/**
 * WeWork SCRM - OpenClaw Plugin (生产级)
 *
 * 全部 7 个阶段，真正的 Protobuf 二进制协议，可直接部署。
 *   TCP  端口 → 手机SDK (Protobuf)
 *   WS   端口 → PC前端 (JSON)
 *   SQLite → 本地数据存储
 *   Dify  → AI 自动回复
 */

import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";

// 工具注册
import { registerMessageTools } from "./tools/message-tools.js";
import { registerContactTools } from "./tools/contact-tools.js";
import { registerGroupTools } from "./tools/group-tools.js";
import { registerMomentsTools } from "./tools/moments-tools.js";
import { registerDeviceTools } from "./tools/device-tools.js";

// 通信 + 处理器
import { getWeWorkServer } from "./services/websocket-service.js";
import { registerBuiltinHandlers } from "./handlers/builtin-handlers.js";
import { MessageRouter } from "./services/message-router.js";

// 自动化 + AI + 存储 + 调度
import { getDb, closeDb } from "./services/storage-service.js";
import { handleAiReply } from "./services/dify-service.js";
import { checkKeywordReply, checkAutoAcceptFriend, persistMessage } from "./services/automation-engine.js";
import { startScheduler, stopScheduler } from "./services/scheduler-service.js";

const DEFAULT_CONFIG = {
  websocket: { port: 15087, host: "0.0.0.0" },
  storage: { type: "sqlite" as const, sqlitePath: "./wework-scrm.db" },
  dify: { enabled: false, apiUrl: "", apiKey: "" },
};

export default definePluginEntry({
  id: "wework-scrm",
  name: "WeWork SCRM",
  description: "企业微信 SCRM 插件 — 消息/联系人/群聊/朋友圈/AI自动回复/定时任务",

  register(api: OpenClawPluginApi) {
    const logger = api.logger;
    const cfg = { ...DEFAULT_CONFIG, ...(api.config ?? {}) };

    // 注册全部 Agent 工具
    registerMessageTools(api);
    registerContactTools(api);
    registerGroupTools(api);
    registerMomentsTools(api);
    registerDeviceTools(api);

    // 后台服务
    api.registerService({
      id: "wework-comm-server",

      async start() {
        // 初始化 SQLite
        getDb(cfg.storage.sqlitePath);
        logger.info(`[Storage] SQLite: ${cfg.storage.sqlitePath}`);

        // 启动通信服务
        const server = getWeWorkServer(cfg.websocket);

        server.on("log", (m: string) => logger.info(`[Server] ${m}`));
        server.on("connection-error", (_c: unknown, e: Error) => logger.error(`[Server] ${e.message}`));
        server.on("error", (e: Error) => logger.error(`[Server] ${e.message}`));

        // 创建消息路由器并注册内置处理器
        const router = new MessageRouter(server);
        registerBuiltinHandlers(router, server, logger);

        // 绑定事件回调
        const onEvent = async (name: string, data: Record<string, unknown>) => {
          // === 消息事件 → 自动化处理链 ===
          if (name === "wework:message") {
            const d = data as {
              wxId: string; convId: string; senderId: string; senderName: string;
              content: string; contentType: number; msgId?: string | number; msgRemoteId?: string | number; createTime?: number;
            };

            // 持久化消息
            persistMessage({
              wxId: d.wxId, convId: d.convId, senderId: d.senderId, senderName: d.senderName,
              contentType: d.contentType, content: d.content, msgId: d.msgId,
              msgRemoteId: d.msgRemoteId, isSend: "false", createTime: d.createTime,
            });

            // 关键词自动回复
            const handled = checkKeywordReply(d.wxId, d.convId, d.content, d.contentType, logger);

            // Dify AI 回复
            if (!handled && cfg.dify.enabled) {
              await handleAiReply(d.wxId, d.convId, d.senderId, d.senderName, d.content,
                { apiUrl: cfg.dify.apiUrl!, apiKey: cfg.dify.apiKey! }, logger);
            }
          }

          // === 新客户 → 自动接受好友 ===
          if (name === "wework:customer-added" || name === "wework:new-customer-push") {
            const wxId = data.wxId as string;
            const raw = data.raw as Record<string, unknown> | undefined;
            const remoteId = String(raw?.RemoteId ?? raw?.remoteId ?? "");
            if (remoteId && remoteId !== "0") {
              checkAutoAcceptFriend(wxId, remoteId, logger);
            }
          }
        };

        // Listen for events emitted by the router
        for (const event of ["wework:message", "wework:customer-added", "wework:new-customer-push"]) {
          router.on(event, (data: Record<string, unknown>) => {
            onEvent(event, data).catch((e: Error) => logger.error(`[Event] ${e.message}`));
          });
        }

        // 启动定时任务调度
        startScheduler(logger);

        // 启动网络服务
        await server.start();
        const p = cfg.websocket.port;
        logger.info(`[Ready] TCP=${p}(Protobuf) WS=${p + 1}(JSON) SQLite=${cfg.storage.sqlitePath}`);
      },

      async stop() {
        stopScheduler();
        const s = getWeWorkServer();
        if (s) await s.stop();
        closeDb();
        logger.info("[Stopped]");
      },
    });

    // CLI
    api.registerCli(({ program }: { program: any }) => {
      const ww = program.command("wework").description("WeWork SCRM");
      ww.command("status").description("连接状态").action(() => {
        const s = getWeWorkServer();
        if (!s) { console.log("未启动"); return; }
        const c = s.connections;
        console.log(`设备: ${c.deviceCount}  用户: ${c.userCount}`);
        for (const u of c.getOnlineUsers()) {
          console.log(`  ${u.wxId} (${u.type}) device=${u.deviceId} since=${u.connectedAt.toISOString()}`);
        }
      });
    }, { commands: ["wework"] });

    logger.info("[wework-scrm] 注册完成: 36工具 + Protobuf通信 + 自动化 + AI + 定时任务");
  },
});
