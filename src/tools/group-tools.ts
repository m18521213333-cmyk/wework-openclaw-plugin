/**
 * 阶段 5: 群聊与标签管理 → OpenClaw Tools (完整实现)
 *
 * 对应原 Java Handler:
 *   ChatRoomActionTaskWebsocketHandler  → wework_chatroom_action
 *   (GetGroupMemberTask)                → wework_get_group_members
 *   UserLabelSetTaskWebsocketHandler    → wework_create_label
 *   UserLabelDelTaskWebsocketHandler    → wework_delete_label
 *   UserLabelModifyTaskWebsocketHandler → wework_modify_label
 *   UserSetLabelTaskWebsocketHandler    → wework_set_user_labels
 *   TriggerUserLabelTaskWebsocketHandler → wework_sync_labels
 *   (QunFaTask)                         → wework_mass_send
 */

import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import {
  chatRoomAction,
  getGroupMembers,
  createLabel,
  deleteLabel,
  modifyLabel,
  setUserLabels,
  triggerLabelSync,
  massSend,
} from "../services/send-helper.js";
import type { SendResult } from "../services/send-helper.js";
import { makeTool, type ToolResult } from "../openclaw-compat.js";
import { awaitTaskResult } from "../services/storage-service.js";

function toResult(r: SendResult, ok: string): ToolResult {
  if (r.success) {
    return { content: [{ type: "text" as const, text: ok }], details: {} };
  }
  return { content: [{ type: "text" as const, text: `操作失败: ${r.error}` }], details: {}, isError: true };
}

/** await TaskResultNotice 真回执. strict=true 时超时按错误处理. */
async function awaitAndFormat(
  wxId: string, result: SendResult,
  successMsg: string, pendingHint: string,
  timeoutMs = 8000, strict = false,
): Promise<ToolResult> {
  if (!result.success || !result.taskId) {
    return { content: [{ type: "text" as const, text: `操作失败: ${result.error ?? "未知"}` }], details: {}, isError: true };
  }
  const r = await awaitTaskResult(wxId, result.taskId, timeoutMs);
  if (!r) {
    return {
      content: [{ type: "text" as const, text: `${strict ? "❌" : "⏳"} ${strict ? "操作未确认" : "操作待确认"}: ${timeoutMs / 1000}s 内手机端无 TaskResultNotice 回执. ${pendingHint}` }],
      details: {},
      isError: strict,
    };
  }
  if (r.success) {
    return { content: [{ type: "text" as const, text: `✅ ${successMsg} (taskId=${result.taskId}${r.extId ? `, extId=${r.extId}` : ""})` }], details: {} };
  }
  return {
    content: [{ type: "text" as const, text: `❌ 手机端拒绝: code=${r.code} ${r.errMsg || "未知"}` }],
    details: {},
    isError: true,
  };
}

export function registerGroupTools(api: OpenClawPluginApi) {
  // --------------------------------------------------
  // 5.1 群聊操作（建群/拉人/踢人/改名/发公告/退群）
  //
  // 原逻辑: ChatRoomActionTaskMessage → msgSend2Phone
  // Action 枚举: CreateRoom=0, AddMember=1, RemoveMember=2,
  //              SetRoomName=3, SetRoomNotice=4, QuitRoom=5
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_chatroom_action",
    description:
      "群聊管理操作：创建群、拉人入群、踢人出群、修改群名、发群公告、退群",
    parameters: Type.Object({
      wxId: Type.String({ description: "操作人企业微信ID" }),
      action: Type.Union(
        [
          Type.Literal("create"),
          Type.Literal("add_member"),
          Type.Literal("remove_member"),
          Type.Literal("set_name"),
          Type.Literal("set_notice"),
          Type.Literal("quit"),
        ],
        { description: "操作类型" },
      ),
      convId: Type.Optional(
        Type.String({ description: "群会话ID（创建群时不需要）" }),
      ),
      members: Type.Optional(
        Type.Array(Type.String(), {
          description: "成员ID列表（创建群/拉人/踢人时需要）",
        }),
      ),
      content: Type.Optional(
        Type.String({ description: "群名或群公告内容（set_name/set_notice时需要）" }),
      ),
    }),
    async execute(_id, params) {
      const r = chatRoomAction(
        params.wxId,
        params.action,
        params.convId,
        params.members,
        params.content,
      );
      const actionLabels: Record<string, string> = {
        create: "创建群聊",
        add_member: "拉人入群",
        remove_member: "踢人出群",
        set_name: "修改群名",
        set_notice: "发群公告",
        quit: "退出群聊",
      };
      // 创建群聊有自己的 ConversationAddNotice / pending_tasks 流程, 不在这里 await
      // (免得跟 CLI 的 send-after 流程冲突). 直接返回指令已发.
      if (params.action === "create") {
        return toResult(r, `${actionLabels[params.action]}指令已发送`);
      }
      // 踢人/退/解散 是不可逆 + 高风险, 必须 await 真回执. 超时强否定.
      const isStrict = params.action === "remove_member" || params.action === "quit";
      return awaitAndFormat(
        params.wxId, r,
        `${actionLabels[params.action]}已确认 (${params.action})`,
        isStrict
          ? `**${actionLabels[params.action]}不能算成功!** 不要重发. 用 wework_get_group_members 复查群成员.`
          : `8s 内 SDK 没回. 用 wework_get_group_members 复查群状态.`,
        8000, isStrict,
      );
    },
  }));

  // --------------------------------------------------
  // 5.2 获取群成员列表
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_get_group_members",
    description: "获取群聊的成员列表。结果通过事件异步返回。",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      convId: Type.String({ description: "群会话ID" }),
    }),
    async execute(_id, params) {
      const r = getGroupMembers(params.wxId, params.convId);
      return toResult(r, `群成员查询已发送，群: ${params.convId}`);
    },
  }));

  // --------------------------------------------------
  // 5.3a 创建标签
  //
  // 原逻辑: UserLabelSetTaskMessage → msgSend2Phone
  // 注意: 原系统中 UserLabelSetTask 是"创建标签"
  //       UserSetLabelTask 是"给用户打标签"，名字容易混淆
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_create_label",
    description: "创建新的企业微信标签",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      labelName: Type.String({ description: "标签名称" }),
    }),
    async execute(_id, params) {
      const r = createLabel(params.wxId, params.labelName);
      // 创建标签是 mutation, 但失败可重试 (无副作用). 超时中性 — LLM 用 wework_sync_labels 复查.
      return awaitAndFormat(
        params.wxId, r,
        `标签 "${params.labelName}" 已创建`,
        `8s 内无 UserLabelModifyTaskResultNotice 回执. 用 wework_sync_labels + 看推送列表确认.`,
        8000, false,
      );
    },
  }));

  // --------------------------------------------------
  // 5.3b 删除标签
  //
  // 原逻辑: UserLabelDelTaskMessage → msgSend2Phone
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_delete_label",
    description: "删除企业微信标签",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      labelId: Type.String({ description: "标签ID" }),
    }),
    async execute(_id, params) {
      const r = deleteLabel(params.wxId, params.labelId);
      // 删标签是不可逆 mutation, 但客户身上的 label 关系会一并消失. 超时中性 (实测 SDK 推 push 较慢).
      return awaitAndFormat(
        params.wxId, r,
        `标签 ${params.labelId} 已删除`,
        `8s 内无回执. 用 wework_sync_labels 复查列表.`,
        8000, false,
      );
    },
  }));

  // --------------------------------------------------
  // 5.3c 修改标签名称
  //
  // 原逻辑: UserLabelModifyTaskMessage → msgSend2Phone
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_modify_label",
    description: "修改企业微信标签的名称",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      labelId: Type.String({ description: "标签ID" }),
      labelName: Type.String({ description: "新标签名称" }),
    }),
    async execute(_id, params) {
      const r = modifyLabel(params.wxId, params.labelId, params.labelName);
      return awaitAndFormat(
        params.wxId, r,
        `标签 ${params.labelId} 已重命名为 "${params.labelName}"`,
        `8s 内无 UserLabelModifyTaskResultNotice 回执. 用 wework_sync_labels 复查.`,
        8000, false,
      );
    },
  }));

  // --------------------------------------------------
  // 5.4 给用户打标签
  //
  // 原逻辑: UserSetLabelTaskMessage → msgSend2Phone
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_set_user_labels",
    description: "给指定联系人/客户设置标签（可同时设置多个标签）",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      remoteId: Type.String({ description: "目标用户ID" }),
      labelIds: Type.Array(Type.String(), {
        description: "要设置的标签ID列表",
      }),
    }),
    async execute(_id, params) {
      const r = setUserLabels(params.wxId, params.remoteId, params.labelIds);
      // 给用户打标签是 LLM 误操作高发场景 (一句话理解偏差). 超时中性 — LLM 用 wework_get_contact 复查.
      return awaitAndFormat(
        params.wxId, r,
        `用户 ${params.remoteId} 标签已设置: [${params.labelIds.join(",")}]`,
        `8s 内无回执. 用 wework_get_contact 复查 ${params.remoteId} 当前 labelIds.`,
        8000, false,
      );
    },
  }));

  // --------------------------------------------------
  // 5.4b 同步标签列表
  //
  // 原逻辑: TriggerUserLabelTaskWebsocketHandler
  //         用 CommonTriggerTask 触发手机端推送标签列表
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_sync_labels",
    description: "触发企业微信同步标签列表，结果通过事件推送返回",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
    }),
    async execute(_id, params) {
      const r = triggerLabelSync(params.wxId);
      return toResult(r, "标签同步指令已发送，标签列表将异步推送");
    },
  }));

  // --------------------------------------------------
  // 5.5 群发消息
  //
  // 对应原 QunFaTask
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_mass_send",
    description:
      "向多个联系人或群聊批量发送消息（群发助手）。支持文本、图片、文件、链接。",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      convIds: Type.Array(Type.String(), {
        description: "目标会话ID列表",
        minItems: 1,
      }),
      contentType: Type.Optional(
        Type.Union(
          [
            Type.Literal("text"),
            Type.Literal("image"),
            Type.Literal("file"),
            Type.Literal("link"),
          ],
          { default: "text", description: "消息类型" },
        ),
      ),
      content: Type.String({ description: "消息内容" }),
    }),
    async execute(_id, params) {
      const r = massSend(
        params.wxId,
        params.convIds,
        params.content,
        params.contentType ?? "text",
      );
      return toResult(
        r,
        `群发消息已发送: ${params.convIds.length}个目标会话, 类型=${params.contentType ?? "text"}`,
      );
    },
  }));
}
