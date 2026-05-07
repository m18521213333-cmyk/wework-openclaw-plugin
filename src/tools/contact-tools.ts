/**
 * 阶段 4: 联系人与客户管理 → OpenClaw Tools (完整实现)
 *
 * 调用链与阶段3相同:
 *   Agent → Tool.execute() → send-helper → sendToPhone() → 手机端SDK
 *
 * 对应原 Java Handler:
 *   GetContactInfoTaskWebsocketHandler     → wework_get_contact
 *   AddCustomerByIdTaskWebsocketHandler    → wework_add_customer_by_id
 *   AddCustomerFromSearchTaskWebsocketHandler → wework_add_customer_search
 *   AddCustomerFromWxTaskWebsocketHandler  → wework_add_customer_wx
 *   (DelCustomerTask)                      → wework_delete_customer
 *   AcceptCustomerTaskWebsocketHandler     → wework_accept_friend
 *   SetUserMemoTaskWebsocketHandler        → wework_set_memo
 *   GetExtUserIdTaskWebsocketHandler       → wework_get_ext_user_id
 *   (SendFriendVerifyTask)                 → wework_send_friend_verify
 */

import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import {
  getContactInfo,
  addCustomerById,
  addCustomerFromSearch,
  addCustomerFromWx,
  deleteCustomer,
  acceptCustomer,
  setUserMemo,
  getExtUserId,
  sendFriendVerify,
} from "../services/send-helper.js";
import type { SendResult } from "../services/send-helper.js";
import { makeTool, type ToolResult } from "../openclaw-compat.js";
import { awaitTaskResult } from "../services/storage-service.js";

/** 标准结果转换 */
function toResult(r: SendResult, ok: string): ToolResult {
  if (r.success) {
    return { content: [{ type: "text" as const, text: ok }], details: {} };
  }
  return { content: [{ type: "text" as const, text: `操作失败: ${r.error}` }], details: {}, isError: true };
}

/**
 * 工具 await TaskResultNotice 的统一处理 — 拿到 SendResult+TaskId 后等真回执.
 *
 * @param strict  超时是否当 isError. true=必须确认 (delete_customer / 高副作用),
 *                false=中性 pending (let LLM 用 get_contact 复查)
 */
async function awaitAndFormat(
  wxId: string,
  result: SendResult,
  successMsg: string,
  pendingHint: string,
  timeoutMs: number = 8000,
  strict: boolean = false,
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

export function registerContactTools(api: OpenClawPluginApi) {
  // --------------------------------------------------
  // 4.1 获取联系人信息
  //
  // 原逻辑: 解析 GetContactInfoTaskMessage → msgSend2Phone
  // 手机端异步返回 GetContactInfoTaskResultNotice
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_get_contact",
    description:
      "获取企业微信联系人/客户的详细信息（昵称、头像、标签、所属企业等）。结果通过事件异步返回。",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      remoteId: Type.String({ description: "目标联系人ID" }),
    }),
    async execute(_id, params) {
      // 查询类: 真回执 GetContactInfoTaskResultNotice 落 task_results, 中性等回; 拿不到不算错
      const r = getContactInfo(params.wxId, params.remoteId);
      return awaitAndFormat(
        params.wxId, r,
        `联系人信息查询确认: ${params.remoteId}`,
        `查询结果异步推送, 仍可能稍后到达. 直接返回联系人查询发出而已.`,
        6000, false,
      );
    },
  }));

  // --------------------------------------------------
  // 4.2 通过ID添加客户
  //
  // 原逻辑: 解析 AddCustomerByIdTaskMessage → msgSend2Phone
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_add_customer_by_id",
    description: "通过用户ID添加企业微信客户/好友",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      remoteId: Type.String({ description: "目标用户ID" }),
      verifyContent: Type.Optional(
        Type.String({ description: "验证消息内容（选填）" }),
      ),
    }),
    async execute(_id, params) {
      const r = addCustomerById(
        params.wxId,
        params.remoteId,
        params.verifyContent,
      );
      // 加好友是 mutation 但对方需要确认, 超时设中性 — LLM 用 wework_get_contact 复查
      return awaitAndFormat(
        params.wxId, r,
        `添加客户请求已确认下发, 目标ID: ${params.remoteId}`,
        `加好友是异步动作 (对方需确认), 8s 内 SDK 没回不一定失败. 用 wework_get_contact 查 ${params.remoteId} 状态.`,
        8000, false,
      );
    },
  }));

  // --------------------------------------------------
  // 4.3 通过搜索添加客户
  //
  // 原逻辑: 解析 AddCustomerFromSearchTaskMessage → msgSend2Phone
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_add_customer_search",
    description: "通过手机号或微信号搜索并添加客户",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      searchText: Type.String({ description: "搜索关键词（手机号/微信号）" }),
      verifyContent: Type.Optional(
        Type.String({ description: "验证消息内容（选填）" }),
      ),
    }),
    async execute(_id, params) {
      const r = addCustomerFromSearch(
        params.wxId,
        params.searchText,
        params.verifyContent,
      );
      return awaitAndFormat(
        params.wxId, r,
        `搜索添加客户请求已确认下发, 搜索: "${params.searchText}"`,
        `加好友是异步动作 (对方需确认), 8s 内 SDK 没回不一定失败.`,
        8000, false,
      );
    },
  }));

  // --------------------------------------------------
  // 4.4 从微信添加客户
  //
  // 原逻辑: 解析 AddCustomerFromWxTaskMessage → msgSend2Phone
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_add_customer_wx",
    description: "从个人微信好友中添加为企业微信客户",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      wxFriendId: Type.String({ description: "微信好友ID" }),
      verifyContent: Type.Optional(
        Type.String({ description: "验证消息内容（选填）" }),
      ),
    }),
    async execute(_id, params) {
      const r = addCustomerFromWx(
        params.wxId,
        params.wxFriendId,
        params.verifyContent,
      );
      return awaitAndFormat(
        params.wxId, r,
        `从微信添加客户请求已确认下发, 好友ID: ${params.wxFriendId}`,
        `加好友是异步动作 (对方需确认), 8s 内 SDK 没回不一定失败.`,
        8000, false,
      );
    },
  }));

  // --------------------------------------------------
  // 4.5 删除客户
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_delete_customer",
    description: "删除企业微信客户/联系人 (await TaskResultNotice 真回执, 不可逆操作 — 超时按错误处理)",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      remoteId: Type.String({ description: "要删除的客户ID" }),
    }),
    async execute(_id, params) {
      // 删除客户是不可逆 + 高风险 (LLM 一句"删除张三"可能误删). 必须 await 真回执, 超时强否定.
      const r = deleteCustomer(params.wxId, params.remoteId);
      return awaitAndFormat(
        params.wxId, r,
        `客户 ${params.remoteId} 已删除`,
        `**不能算成功!** 不要重复执行避免风险扩散. 用 wework_get_contact 复查 ${params.remoteId} 是否已被删.`,
        8000, true,
      );
    },
  }));

  // --------------------------------------------------
  // 4.6 接受好友请求
  //
  // 原逻辑: 解析 AcceptCustomerTaskMessage → msgSend2Phone
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_accept_friend",
    description: "接受客户/好友的添加请求 (await TaskResultNotice 真回执)",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      remoteId: Type.String({ description: "请求添加的用户ID" }),
    }),
    async execute(_id, params) {
      const r = acceptCustomer(params.wxId, params.remoteId);
      // 接好友是 mutation, 但成功后通常会有 ContactPushNotice 入库. 超时设中性 — 让 LLM 用 get_contact 复查.
      return awaitAndFormat(
        params.wxId, r,
        `已接受好友请求: ${params.remoteId}`,
        `8s 内 SDK 没回 — 用 wework_get_contact 复查 ${params.remoteId} 是否已成为联系人.`,
        8000, false,
      );
    },
  }));

  // --------------------------------------------------
  // 4.7 设置用户备注
  //
  // 原逻辑: 解析 SetUserMemoTaskMessage → msgSend2Phone
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_set_memo",
    description: "设置联系人/客户的备注名 (await TaskResultNotice 真回执)",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      remoteId: Type.String({ description: "联系人ID" }),
      memo: Type.String({ description: "备注内容" }),
    }),
    async execute(_id, params) {
      const r = setUserMemo(params.wxId, params.remoteId, params.memo);
      return awaitAndFormat(
        params.wxId, r,
        `备注已设置: ${params.remoteId} → "${params.memo}"`,
        `8s 内 SDK 没回回执. 备注可见性低风险, 用 wework_get_contact 复查.`,
        8000, false,
      );
    },
  }));

  // --------------------------------------------------
  // 4.8 获取外部用户ID (额外工具)
  //
  // 原逻辑: 解析 GetExtUserIdTaskMessage → msgSend2Phone
  // 用于获取客户在企业微信平台上的 external_userid
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_get_ext_user_id",
    description:
      "获取客户在企业微信平台的外部用户ID (external_userid) (await TaskResultNotice, 结果在 ext 字段)",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      remoteId: Type.String({ description: "客户ID" }),
    }),
    async execute(_id, params) {
      const r = getExtUserId(params.wxId, params.remoteId);
      return awaitAndFormat(
        params.wxId, r,
        `外部用户ID查询确认: ${params.remoteId}`,
        `8s 内 SDK 没回. 多查询场景这种事多发生在 SDK 卡顿 — 也可能是 remoteId 错的.`,
        6000, false,
      );
    },
  }));

  // --------------------------------------------------
  // 4.9 发送好友验证申请 (额外工具)
  //
  // 对应原 SendFriendVerifyTask
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_send_friend_verify",
    description: "主动发送好友验证申请给指定用户 (await TaskResultNotice 真回执)",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      remoteId: Type.String({ description: "目标用户ID" }),
      verifyContent: Type.Optional(
        Type.String({ description: "验证消息（选填）" }),
      ),
    }),
    async execute(_id, params) {
      const r = sendFriendVerify(
        params.wxId,
        params.remoteId,
        params.verifyContent,
      );
      return awaitAndFormat(
        params.wxId, r,
        `好友验证申请已发送给: ${params.remoteId}`,
        `8s 内无回执 — 大概率手机离线, 或 remoteId 错. 不会重复打扰对方.`,
        8000, false,
      );
    },
  }));
}
