/**
 * 阶段 3: 核心消息功能 → OpenClaw Tools (完整实现)
 *
 * 每个 Tool 的 execute() 现在通过 send-helper → WeWorkServer → 手机端SDK。
 *
 * 调用链:
 *   OpenClaw Agent 调用 Tool
 *     → sendMessage() / revokeMessage() / ...
 *       → sendToPhone(wxId, MsgType, payload)
 *         → WeWorkServer.connections.getConnectionByUserId(wxId)
 *           → conn.send(JSON.stringify(packet))  // WebSocket
 *           → conn.write(header + body)          // TCP Socket
 *
 * 对应原 Java Handler:
 *   TalkToFriendTaskWebsocketHandler  → wework_send_message
 *   MsgRevokeTaskWebsocketHandler     → wework_revoke_message
 *   ForwardMsgTaskWebsocketHandler    → wework_forward_message
 *   ForwardMultiTaskWebsocketHandler  → wework_forward_message (multi模式)
 *   SearchMsgTaskWebsocketHandler     → wework_search_messages
 *   TriggerHistoryMsgPushTask         → wework_get_history
 */

import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import {
  sendMessage,
  revokeMessage,
  forwardMessage,
  forwardMultiMessages,
  searchMessages,
  triggerHistoryMessages,
} from "../services/send-helper.js";
import type { SendResult } from "../services/send-helper.js";
import { makeTool, type ToolResult } from "../openclaw-compat.js";

/** 把 SendResult 转为 OpenClaw Tool 的标准返回格式 */
function toToolResult(result: SendResult, successMsg: string): ToolResult {
  if (result.success) {
    return {
      content: [{ type: "text" as const, text: successMsg }],
      details: {},
    };
  } else {
    return {
      content: [{ type: "text" as const, text: `操作失败: ${result.error}` }],
      details: {},
      isError: true,
    };
  }
}

export function registerMessageTools(api: OpenClawPluginApi) {
  // --------------------------------------------------
  // 3.1 发送消息 (对应 TalkToFriendTask)
  //
  // 原逻辑 (TalkToFriendTaskWebsocketHandler.java):
  //   1. 解析 JSON → TalkToFriendTaskMessage
  //   2. asyncTaskService.msgSend2Phone(ctx, wxId, TalkToFriendTask, vo, req)
  //      → 通过 wxId 找到手机端通道 → 转发 protobuf 消息
  //      → 回复发送方 MsgReceivedAck
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_send_message",
    description:
      "发送企业微信消息给指定联系人或群聊。支持文本、图片、文件、链接、小程序等类型。",
    parameters: Type.Object({
      wxId: Type.String({ description: "发送方企业微信ID" }),
      convId: Type.String({ description: "目标会话ID（联系人或群聊）" }),
      contentType: Type.Optional(
        Type.Union(
          [
            Type.Literal("text"),
            Type.Literal("image"),
            Type.Literal("file"),
            Type.Literal("link"),
            Type.Literal("video"),
            Type.Literal("voice"),
            Type.Literal("weapp"),
            Type.Literal("namecard"),
            Type.Literal("location"),
          ],
          { default: "text", description: "消息类型，默认文本" },
        ),
      ),
      content: Type.String({
        description: "消息内容（文本内容 或 文件/图片URL）",
      }),
      atList: Type.Optional(
        Type.Array(Type.String(), {
          description: "需要@的用户ID列表（仅群聊有效）",
        }),
      ),
    }),
    async execute(_id, params) {
      const result = sendMessage(
        params.wxId,
        params.convId,
        params.content,
        params.contentType ?? "text",
        params.atList,
      );

      const typeLabel = params.contentType ?? "text";
      return toToolResult(
        result,
        `消息已发送到会话 ${params.convId}（类型: ${typeLabel}）`,
      );
    },
  }));

  // --------------------------------------------------
  // 3.3 撤回消息 (对应 MsgRevokeTask)
  //
  // 原逻辑: 解析 MsgRevokeTaskMessage → msgSend2Phone
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_revoke_message",
    description: "撤回已发送的企业微信消息",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      msgId: Type.String({ description: "要撤回的消息ID" }),
      convId: Type.String({ description: "会话ID" }),
    }),
    async execute(_id, params) {
      const result = revokeMessage(params.wxId, params.msgId, params.convId);
      return toToolResult(result, `消息 ${params.msgId} 已撤回`);
    },
  }));

  // --------------------------------------------------
  // 3.4 转发消息 (对应 ForwardMsgTask + ForwardMultiTask)
  //
  // 原逻辑:
  //   ForwardMsgTaskWebsocketHandler   → 单条转发
  //   ForwardMultiTaskWebsocketHandler → 合并转发多条
  //
  // 这里合并为一个 Tool，通过 msgId 参数判断：
  //   单个 msgId → ForwardMsgTask
  //   多个 msgId (逗号分隔) → ForwardMultiTask
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_forward_message",
    description:
      "将消息转发到其他会话。支持单条转发和多条合并转发（多个消息ID用逗号分隔）",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      msgId: Type.String({
        description: "要转发的消息ID（多条合并转发用逗号分隔，如 '123,456,789'）",
      }),
      fromConvId: Type.String({ description: "原会话ID" }),
      toConvId: Type.String({ description: "目标会话ID" }),
    }),
    async execute(_id, params) {
      const msgIds = params.msgId.split(",").map((s: string) => s.trim());

      let result: SendResult;
      if (msgIds.length === 1) {
        // 单条转发
        result = forwardMessage(
          params.wxId,
          msgIds[0],
          params.fromConvId,
          params.toConvId,
        );
      } else {
        // 合并转发
        result = forwardMultiMessages(
          params.wxId,
          msgIds,
          params.fromConvId,
          params.toConvId,
        );
      }

      return toToolResult(
        result,
        `${msgIds.length}条消息已转发到会话 ${params.toConvId}`,
      );
    },
  }));

  // --------------------------------------------------
  // 3.5 搜索消息 (对应 SearchMsgTask)
  //
  // 原逻辑: 解析 SearchMsgTaskMessage → msgSend2Phone
  // 手机端会异步返回 SearchMsgTaskResultNotice
  //
  // 注意: 这是一个异步操作，Tool 返回的是"指令已发送"，
  // 搜索结果会通过事件推送回来。后续可以扩展为等待结果的模式。
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_search_messages",
    description:
      "在指定会话中搜索历史消息。搜索指令发送后，结果将通过事件推送返回。",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      convId: Type.Optional(
        Type.String({ description: "会话ID（不填则搜索所有会话）" }),
      ),
      keyword: Type.String({ description: "搜索关键词" }),
    }),
    async execute(_id, params) {
      const result = searchMessages(
        params.wxId,
        params.keyword,
        params.convId,
      );

      return toToolResult(
        result,
        `搜索指令已发送，关键词: "${params.keyword}"，结果将异步推送`,
      );
    },
  }));

  // --------------------------------------------------
  // 3.6 获取历史消息 (对应 TriggerHistoryMsgPushTask)
  //
  // 原逻辑: 解析 TriggerHistoryMsgPushTaskMessage → msgSend2Phone
  // 手机端会异步返回 HistoryMsgPushNotice
  //
  // 与搜索消息类似，这是异步操作。
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_get_history",
    description:
      "获取指定会话的历史聊天记录。指令发送后，历史消息将通过事件推送返回。",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      convId: Type.String({ description: "会话ID" }),
      count: Type.Optional(
        Type.Number({
          default: 50,
          description: "获取条数，默认50",
          minimum: 1,
          maximum: 500,
        }),
      ),
    }),
    async execute(_id, params) {
      const result = triggerHistoryMessages(
        params.wxId,
        params.convId,
        params.count ?? 50,
      );

      return toToolResult(
        result,
        `历史消息拉取指令已发送，会话 ${params.convId}，请求 ${params.count ?? 50} 条`,
      );
    },
  }));
}
