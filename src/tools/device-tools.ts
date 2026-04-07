/**
 * 设备与系统管理工具 (生产级)
 */

import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { phoneState, pullQrCode, downloadByUrl, downloadByMsgId, triggerSync } from "../services/send-helper.js";
import { getWeWorkServer } from "../services/websocket-service.js";
import type { SendResult } from "../services/send-helper.js";
import { makeTool, type ToolResult } from "../openclaw-compat.js";

function toResult(r: SendResult, ok: string): ToolResult {
  if (r.success) return { content: [{ type: "text" as const, text: ok }], details: {} };
  return { content: [{ type: "text" as const, text: `操作失败: ${r.error}` }], details: {}, isError: true };
}

export function registerDeviceTools(api: OpenClawPluginApi) {
  api.registerTool(makeTool({
    name: "wework_phone_status",
    description: "获取绑定手机的运行状态（电量、网络、存储等）",
    parameters: Type.Object({ wxId: Type.String({ description: "企业微信ID" }) }),
    async execute(_id, params) {
      return toResult(phoneState(params.wxId), "手机状态查询已发送");
    },
  }));

  api.registerTool(makeTool({
    name: "wework_get_qrcode",
    description: "获取企业微信个人二维码",
    parameters: Type.Object({ wxId: Type.String({ description: "企业微信ID" }) }),
    async execute(_id, params) {
      return toResult(pullQrCode(params.wxId), "二维码获取指令已发送");
    },
  }));

  api.registerTool(makeTool({
    name: "wework_download_file",
    description: "下载聊天中的文件/图片/视频附件",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      msgId: Type.Optional(Type.String({ description: "消息ID" })),
      fileUrl: Type.Optional(Type.String({ description: "文件URL" })),
    }),
    async execute(_id, params) {
      if (params.fileUrl) {
        return toResult(downloadByUrl(params.wxId, params.fileUrl), "URL下载指令已发送");
      } else if (params.msgId) {
        return toResult(downloadByMsgId(params.wxId, params.msgId), "消息附件下载指令已发送");
      }
      return { content: [{ type: "text" as const, text: "请提供 msgId 或 fileUrl" }], details: {}, isError: true };
    },
  }));

  api.registerTool(makeTool({
    name: "wework_sync_data",
    description: "触发数据同步：联系人、客户、会话、标签等",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      dataType: Type.Union([
        Type.Literal("contacts"), Type.Literal("customers"), Type.Literal("conversations"),
        Type.Literal("labels"), Type.Literal("departments"), Type.Literal("wx_friends"), Type.Literal("all"),
      ], { description: "同步类型" }),
    }),
    async execute(_id, params) {
      return toResult(triggerSync(params.wxId, params.dataType), `${params.dataType} 同步指令已发送`);
    },
  }));

  api.registerTool(makeTool({
    name: "wework_list_devices",
    description: "查看当前 WS 客户端连接状态（方案B通过Java后端管理设备）",
    parameters: Type.Object({}),
    async execute() {
      const client = getWeWorkServer();
      if (!client) return { content: [{ type: "text" as const, text: "通信服务未启动" }], details: {}, isError: true };

      const status = client.connected
        ? "✅ 已连接 Java 后端（设备列表由 Java 后端管理）"
        : "❌ 未连接 Java 后端";
      return { content: [{ type: "text" as const, text: status }], details: {} };
    },
  }));
}
