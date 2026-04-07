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

/** 标准结果转换 */
function toResult(r: SendResult, ok: string): ToolResult {
  if (r.success) {
    return { content: [{ type: "text" as const, text: ok }], details: {} };
  }
  return { content: [{ type: "text" as const, text: `操作失败: ${r.error}` }], details: {}, isError: true };
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
      const r = getContactInfo(params.wxId, params.remoteId);
      return toResult(r, `联系人信息查询指令已发送，目标: ${params.remoteId}`);
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
      return toResult(r, `添加客户请求已发送，目标ID: ${params.remoteId}`);
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
      return toResult(r, `搜索添加客户请求已发送，搜索: "${params.searchText}"`);
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
      return toResult(r, `从微信添加客户请求已发送，好友ID: ${params.wxFriendId}`);
    },
  }));

  // --------------------------------------------------
  // 4.5 删除客户
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_delete_customer",
    description: "删除企业微信客户/联系人",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      remoteId: Type.String({ description: "要删除的客户ID" }),
    }),
    async execute(_id, params) {
      const r = deleteCustomer(params.wxId, params.remoteId);
      return toResult(r, `客户 ${params.remoteId} 删除指令已发送`);
    },
  }));

  // --------------------------------------------------
  // 4.6 接受好友请求
  //
  // 原逻辑: 解析 AcceptCustomerTaskMessage → msgSend2Phone
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_accept_friend",
    description: "接受客户/好友的添加请求",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      remoteId: Type.String({ description: "请求添加的用户ID" }),
    }),
    async execute(_id, params) {
      const r = acceptCustomer(params.wxId, params.remoteId);
      return toResult(r, `已接受好友请求: ${params.remoteId}`);
    },
  }));

  // --------------------------------------------------
  // 4.7 设置用户备注
  //
  // 原逻辑: 解析 SetUserMemoTaskMessage → msgSend2Phone
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_set_memo",
    description: "设置联系人/客户的备注名",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      remoteId: Type.String({ description: "联系人ID" }),
      memo: Type.String({ description: "备注内容" }),
    }),
    async execute(_id, params) {
      const r = setUserMemo(params.wxId, params.remoteId, params.memo);
      return toResult(r, `备注已设置: ${params.remoteId} → "${params.memo}"`);
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
      "获取客户在企业微信平台的外部用户ID (external_userid)，用于与企业微信官方API对接",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      remoteId: Type.String({ description: "客户ID" }),
    }),
    async execute(_id, params) {
      const r = getExtUserId(params.wxId, params.remoteId);
      return toResult(r, `外部用户ID查询已发送: ${params.remoteId}`);
    },
  }));

  // --------------------------------------------------
  // 4.9 发送好友验证申请 (额外工具)
  //
  // 对应原 SendFriendVerifyTask
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_send_friend_verify",
    description: "主动发送好友验证申请给指定用户",
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
      return toResult(r, `好友验证申请已发送给: ${params.remoteId}`);
    },
  }));
}
