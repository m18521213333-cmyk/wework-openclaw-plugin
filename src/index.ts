/**
 * WeWork SCRM - OpenClaw Plugin (方案B: WS 客户端模式)
 *
 * 通过 WebSocket 连接 Java 后端 (:15088)，使用 JSON 协议。
 * 与原有 Web 管理端共存，同一个手机端，同一个后端，两个入口。
 *
 * 架构:
 *   手机SDK ←→ Java后端 (TCP:15087) ←→ Web管理端 (HTTP:15086)
 *                  ↕
 *              Java WS (:15088)
 *               ↕         ↕
 *           PC前端     OpenClaw (本插件)
 */

import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";

// 工具注册
import { registerMessageTools } from "./tools/message-tools.js";
import { registerContactTools } from "./tools/contact-tools.js";
import { registerGroupTools } from "./tools/group-tools.js";
import { registerMomentsTools } from "./tools/moments-tools.js";
import { registerDeviceTools } from "./tools/device-tools.js";

// WS 客户端
import { getWeWorkClient } from "./services/websocket-service.js";

// 自动化 + AI + 存储 + 调度
import { getDb, closeDb } from "./services/storage-service.js";
import { handleAiReply } from "./services/dify-service.js";
import { checkKeywordReply, checkAutoAcceptFriend, persistMessage } from "./services/automation-engine.js";
import { startScheduler, stopScheduler } from "./services/scheduler-service.js";
import { initDevPipeline, getDevPipeline } from "./services/dev-pipeline.js";

// send-helper (CLI 直接调用)
import {
  sendMessage, searchMessages, triggerHistoryMessages,
  getContactInfo, triggerSync, phoneState,
  chatRoomAction, massSend, postMoments, pullMySns,
} from "./services/send-helper.js";

const DEFAULT_CONFIG = {
  /** Java 后端 WebSocket 地址 */
  javaWsUrl: "ws://60.205.94.161:15088",
  storage: { type: "sqlite" as const, sqlitePath: "./wework-scrm.db" },
  dify: { enabled: false, apiUrl: "", apiKey: "" },
  /** 6-Agent 自动开发流水线 */
  devPipeline: {
    enabled: false,
    gatewayUrl: "http://127.0.0.1:8080",
    gatewayToken: "",
    projectsDir: `${process.env.HOME ?? "."}/wework-projects`,
    triggerKeywords: ["@开发助手", "@dev", "/dev", "我想做一个", "帮我开发"],
    /** 可选: 用本地 Claude Code CLI 替代 OpenClaw HTTP, 留空则用 Gateway HTTP */
    claudeCliPath: "",
  },
};

export default definePluginEntry({
  id: "wework-scrm",
  name: "WeWork SCRM",
  description: "企业微信 SCRM 插件 — 通过 Java 后端 WS 协议操控消息/联系人/群聊/朋友圈",

  register(api: OpenClawPluginApi) {
    const logger = api.logger;
    const cfg = { ...DEFAULT_CONFIG, ...(api.config ?? {}) };

    // 注册全部 Agent 工具 (36个)
    registerMessageTools(api);
    registerContactTools(api);
    registerGroupTools(api);
    registerMomentsTools(api);
    registerDeviceTools(api);

    // 后台服务: WS 客户端连接 Java 后端
    api.registerService({
      id: "wework-ws-client",

      async start() {
        // 初始化 SQLite
        getDb(cfg.storage.sqlitePath);
        logger.info(`[Storage] SQLite: ${cfg.storage.sqlitePath}`);

        // 初始化 6-Agent 开发流水线
        if (cfg.devPipeline.enabled) {
          initDevPipeline({
            enabled: true,
            gatewayUrl: cfg.devPipeline.gatewayUrl,
            gatewayToken: cfg.devPipeline.gatewayToken || undefined,
            projectsDir: cfg.devPipeline.projectsDir,
            triggerKeywords: cfg.devPipeline.triggerKeywords,
            claudeCliPath: cfg.devPipeline.claudeCliPath || undefined,
          }, logger);
          logger.info(`[DevPipeline] 已启用, 触发词: ${cfg.devPipeline.triggerKeywords.join(", ")}`);
          logger.info(`[DevPipeline] 项目目录: ${cfg.devPipeline.projectsDir}`);
        }

        // 连接 Java 后端 WS
        const client = getWeWorkClient({ serverUrl: cfg.javaWsUrl });

        client.on("log", (m: string) => logger.info(`[WS] ${m}`));
        client.on("error", (e: Error) => logger.error(`[WS] ${e.message}`));

        client.on("connected", () => {
          logger.info(`[Ready] 已连接 Java 后端 ${cfg.javaWsUrl}`);
        });

        // 接收 Java 后端推送的事件 (与 PC 前端收到的一样)
        client.on("json-message", async (json: Record<string, unknown>) => {
          try {
            const msgType = json.MsgType as string;
            const content = json.Content as Record<string, unknown> ?? {};

            // 消息通知 → 持久化 + 自动回复
            if (msgType === "FriendTalkNotice") {
              const d = content as {
                WxId?: number; ConvId?: number; SenderId?: number; SenderName?: string;
                Content?: string; ContentType?: number; MsgId?: number; MsgRemoteId?: number; CreateTime?: number;
              };

              persistMessage({
                wxId: String(d.WxId ?? ""), convId: String(d.ConvId ?? ""),
                senderId: String(d.SenderId ?? ""), senderName: d.SenderName ?? "",
                contentType: d.ContentType ?? 0, content: d.Content ?? "",
                msgId: d.MsgId, msgRemoteId: d.MsgRemoteId,
                isSend: "false", createTime: d.CreateTime,
              });

              const handled = checkKeywordReply(
                String(d.WxId), String(d.ConvId), d.Content ?? "", d.ContentType ?? 0, logger,
              );

              // 检查是否触发 6-Agent 自动开发流水线
              const pipeline = getDevPipeline();
              if (pipeline && pipeline.shouldTrigger(d.Content ?? "")) {
                logger.info(`[DevPipeline] 触发: from=${d.SenderName}, content="${(d.Content ?? "").slice(0, 60)}..."`);
                // 异步执行,不阻塞消息处理
                pipeline.execute({
                  wxId: String(d.WxId ?? ""),
                  convId: String(d.ConvId ?? ""),
                  senderId: String(d.SenderId ?? ""),
                  senderName: d.SenderName ?? "",
                  requirement: d.Content ?? "",
                }).catch((err) => logger.error(`[DevPipeline] 执行失败: ${err.message}`));
              } else if (!handled && cfg.dify.enabled) {
                await handleAiReply(
                  String(d.WxId), String(d.ConvId), String(d.SenderId), d.SenderName ?? "", d.Content ?? "",
                  { apiUrl: cfg.dify.apiUrl!, apiKey: cfg.dify.apiKey! }, logger,
                );
              }
            }

            // 新客户通知 → 自动接受
            if (msgType === "CustomerAddNotice" || msgType === "NewCustomerPushNotice") {
              const wxId = String(content.WxId ?? "");
              const remoteId = String(content.RemoteId ?? "");
              if (remoteId && remoteId !== "0") {
                checkAutoAcceptFriend(wxId, remoteId, logger);
              }
            }

          } catch (e: any) {
            logger.error(`[Event] ${e.message}`);
          }
        });

        // 启动定时任务调度
        startScheduler(logger);

        // 连接
        await client.start();
      },

      async stop() {
        stopScheduler();
        const c = getWeWorkClient();
        if (c) await c.stop();
        closeDb();
        logger.info("[Stopped]");
      },
    });

    // ============================================
    // CLI 插件: openclaw wework <command>
    // ============================================
    api.registerCli(({ program }: { program: any }) => {
      const ww = program.command("wework").description("WeWork SCRM 管理");

      let cliInitiatedConnection = false;

      /** CLI 模式下确保 WS 客户端已初始化并连接 */
      async function ensureConnected(): Promise<boolean> {
        let client = getWeWorkClient();
        if (!client) {
          // CLI 模式下 service.start() 不会被调用，需要手动初始化
          client = getWeWorkClient({ serverUrl: cfg.javaWsUrl });
          cliInitiatedConnection = true;
          try {
            await new Promise<void>((resolve, reject) => {
              const timeout = setTimeout(() => reject(new Error("连接超时")), 5000);
              client!.once("connected", () => { clearTimeout(timeout); resolve(); });
              client!.once("error", (e: Error) => { clearTimeout(timeout); reject(e); });
              client!.start();
            });
          } catch (e: any) {
            console.log(`❌ 无法连接 Java 后端 (${cfg.javaWsUrl}): ${e.message}`);
            return false;
          }
        }
        return true;
      }

      /** CLI 命令执行完后断开连接，让进程正常退出 */
      async function cleanupConnection(): Promise<void> {
        if (cliInitiatedConnection) {
          const client = getWeWorkClient();
          if (client) await client.stop();
        }
      }

      /** 包装 action：自动连接 + 执行 + 断开 */
      function withConnection<T extends (...args: any[]) => void>(fn: T) {
        return async (...args: Parameters<T>) => {
          if (!await ensureConnected()) return;
          try { await fn(...args); } finally { await cleanupConnection(); }
        };
      }

      // --- 状态 ---
      ww.command("status").description("查看连接状态").action(withConnection(async () => {
        const c = getWeWorkClient();
        if (!c) { console.log("❌ 插件未启动"); return; }
        console.log(`Java 后端: ${c.connected ? "✅ 已连接" : "❌ 未连接"} (${cfg.javaWsUrl})`);
      }));

      // --- 发消息 ---
      ww.command("send")
        .description("发送消息")
        .argument("<wxId>", "企业微信ID")
        .argument("<convId>", "目标会话ID")
        .argument("<message>", "消息内容")
        .option("-t, --type <type>", "消息类型: text/image/file/link", "text")
        .action(withConnection(async (wxId: string, convId: string, message: string, opts: { type: string }) => {
          const r = sendMessage(wxId, convId, message, opts.type);
          console.log(r.success ? `✅ 消息已发送 → ${convId}` : `❌ ${r.error}`);
        }));

      // --- 搜索消息 ---
      ww.command("search")
        .description("搜索历史消息")
        .argument("<wxId>", "企业微信ID")
        .argument("<keyword>", "搜索关键词")
        .option("-c, --conv <convId>", "限定会话")
        .action(withConnection(async (wxId: string, keyword: string, opts: { conv?: string }) => {
          const r = searchMessages(wxId, keyword, opts.conv);
          console.log(r.success ? `✅ 搜索指令已发送: "${keyword}"` : `❌ ${r.error}`);
        }));

      // --- 历史消息 ---
      ww.command("history")
        .description("拉取历史消息")
        .argument("<wxId>", "企业微信ID")
        .argument("<convId>", "会话ID")
        .option("-n, --count <n>", "条数", "50")
        .action(withConnection(async (wxId: string, convId: string, opts: { count: string }) => {
          const r = triggerHistoryMessages(wxId, convId, parseInt(opts.count));
          console.log(r.success ? `✅ 拉取 ${opts.count} 条历史消息` : `❌ ${r.error}`);
        }));

      // --- 联系人信息 ---
      ww.command("contact")
        .description("查询联系人")
        .argument("<wxId>", "企业微信ID")
        .argument("<remoteId>", "联系人ID")
        .action(withConnection(async (wxId: string, remoteId: string) => {
          const r = getContactInfo(wxId, remoteId);
          console.log(r.success ? `✅ 查询已发送: ${remoteId}` : `❌ ${r.error}`);
        }));

      // --- 群发 ---
      ww.command("mass-send")
        .description("群发消息")
        .argument("<wxId>", "企业微信ID")
        .argument("<message>", "消息内容")
        .option("-t, --type <type>", "消息类型", "text")
        .option("--to <ids...>", "目标会话ID列表")
        .action(withConnection(async (wxId: string, message: string, opts: { type: string; to: string[] }) => {
          if (!opts.to?.length) { console.log("❌ 请指定 --to <会话ID列表>"); return; }
          const r = massSend(wxId, opts.to, message, opts.type);
          console.log(r.success ? `✅ 群发 → ${opts.to.length} 个会话` : `❌ ${r.error}`);
        }));

      // --- 群聊操作 ---
      ww.command("group")
        .description("群聊管理")
        .argument("<wxId>", "企业微信ID")
        .argument("<action>", "操作: create/add_member/remove_member/set_name/set_notice/quit")
        .option("-g, --group <convId>", "群会话ID")
        .option("-m, --members <ids...>", "成员ID列表")
        .option("-c, --content <text>", "群名/公告内容")
        .action(withConnection(async (wxId: string, action: string, opts: { group?: string; members?: string[]; content?: string }) => {
          const r = chatRoomAction(wxId, action, opts.group, opts.members, opts.content);
          console.log(r.success ? `✅ 群操作 ${action} 已发送` : `❌ ${r.error}`);
        }));

      // --- 发朋友圈 ---
      ww.command("moments")
        .description("发布朋友圈")
        .argument("<wxId>", "企业微信ID")
        .argument("<content>", "文字内容")
        .option("-t, --type <type>", "类型: text/image/video/link", "text")
        .option("--media <urls...>", "图片/视频URL")
        .action(withConnection(async (wxId: string, content: string, opts: { type: string; media?: string[] }) => {
          const r = postMoments(wxId, content, opts.type, opts.media);
          console.log(r.success ? "✅ 朋友圈发布指令已发送" : `❌ ${r.error}`);
        }));

      // --- 查看朋友圈 ---
      ww.command("my-moments")
        .description("拉取我的朋友圈")
        .argument("<wxId>", "企业微信ID")
        .action(withConnection(async (wxId: string) => {
          const r = pullMySns(wxId);
          console.log(r.success ? "✅ 朋友圈列表拉取已发送" : `❌ ${r.error}`);
        }));

      // --- 同步数据 ---
      ww.command("sync")
        .description("触发数据同步")
        .argument("<wxId>", "企业微信ID")
        .argument("<type>", "类型: contacts/customers/conversations/labels/all")
        .action(withConnection(async (wxId: string, type: string) => {
          const r = triggerSync(wxId, type);
          console.log(r.success ? `✅ ${type} 同步已发送` : `❌ ${r.error}`);
        }));

      // --- 手机状态 ---
      ww.command("phone")
        .description("查询手机状态")
        .argument("<wxId>", "企业微信ID")
        .action(withConnection(async (wxId: string) => {
          const r = phoneState(wxId);
          console.log(r.success ? "✅ 手机状态查询已发送" : `❌ ${r.error}`);
        }));

      // --- 6-Agent 开发流水线 (手动触发) ---
      ww.command("dev")
        .description("手动触发 6-Agent 自动开发流水线 (用于测试)")
        .argument("<wxId>", "发起方企业微信ID")
        .argument("<convId>", "目标客户会话ID (用于回传结果)")
        .argument("<requirement>", "需求描述")
        .option("--sender <id>", "客户ID", "test-sender")
        .option("--name <name>", "客户姓名", "测试用户")
        .action(async (wxId: string, convId: string, requirement: string, opts: { sender: string; name: string }) => {
          // 初始化流水线 (如果还没启用,使用默认配置临时启动)
          let pipeline = getDevPipeline();
          if (!pipeline) {
            pipeline = initDevPipeline({
              enabled: true,
              gatewayUrl: cfg.devPipeline.gatewayUrl,
              gatewayToken: cfg.devPipeline.gatewayToken || undefined,
              projectsDir: cfg.devPipeline.projectsDir,
              triggerKeywords: cfg.devPipeline.triggerKeywords,
              claudeCliPath: cfg.devPipeline.claudeCliPath || undefined,
            });
            console.log(`[DevPipeline] 临时启动 (项目目录: ${cfg.devPipeline.projectsDir})`);
          }

          if (!await ensureConnected()) return;
          try {
            console.log(`🚀 启动开发流水线: "${requirement.slice(0, 60)}..."`);
            await pipeline.execute({
              wxId, convId,
              senderId: opts.sender,
              senderName: opts.name,
              requirement,
            });
            console.log("✅ 流水线执行完成");
          } finally {
            await cleanupConnection();
          }
        });

    }, { commands: ["wework"] });

    logger.info("[wework-scrm] 注册完成: 36 Agent工具 + CLI(含dev流水线) + WS客户端模式 (→ Java后端)");
  },
});
