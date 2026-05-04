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
import {
  getDb, closeDb,
  addPendingTask, findPendingTaskByMatch, markPendingTaskDone,
  cleanupStalePendingTasks,
} from "./services/storage-service.js";
import { handleAiReply } from "./services/dify-service.js";
import { checkKeywordReply, checkAutoAcceptFriend, persistMessage } from "./services/automation-engine.js";
import { startScheduler, stopScheduler } from "./services/scheduler-service.js";
import { startPhoneMonitor, stopPhoneMonitor } from "./services/phone-monitor.js";
import { listPhoneStatusEvents } from "./services/storage-service.js";

// send-helper (CLI 直接调用)
import {
  sendMessage, revokeMessage, forwardMessage,
  searchMessages, triggerHistoryMessages,
  getContactInfo, triggerSync, phoneState,
  chatRoomAction, massSend, postMoments, pullMySns,
  waitTaskResult,
} from "./services/send-helper.js";

// node 内置: HTTP 上传 (wework upload 用)
import * as fs from "node:fs";
import * as path from "node:path";

const DEFAULT_CONFIG = {
  /** Java 后端 WebSocket 地址 (默认走本机 loopback;
   *  跨机部署时通过 ~/.openclaw/openclaw.json 的 plugins.entries.wework-scrm.config.javaWsUrl 覆盖) */
  javaWsUrl: "ws://127.0.0.1:15088",
  /**
   * 必须配认证, 否则 Java 后端不会向我们这条 WS 推送任何业务消息
   * (Java 端 msgSend2pc 只对认证过的连接广播).
   * 在 ~/.openclaw/openclaw.json 的 plugins.entries.wework-scrm.config.auth 里设:
   *   "auth": { "username": "pluginbot", "password": "xxx",
   *             "cliUsername": "pluginbot-cli", "cliPassword": "yyy" }
   * cliUsername/cliPassword 是 CLI 命令专用账号 — 跟 service 用不同账号,
   * 避免 CLI 调用 squeeze 现有 service 的 WS 连接 (Java 端按 account 名互斥).
   */
  auth: {
    authType: 2 as 2 | 3,
    username: "",
    password: "",
    cliUsername: "",
    cliPassword: "",
  },
  storage: { type: "sqlite" as const, sqlitePath: "./wework-scrm.db" },
  dify: { enabled: false, apiUrl: "", apiKey: "" },
};

export default definePluginEntry({
  id: "wework-scrm",
  name: "WeWork SCRM",
  description: "企业微信 SCRM 插件 — 通过 Java 后端 WS 协议操控消息/联系人/群聊/朋友圈",

  register(api: OpenClawPluginApi) {
    const logger = api.logger;

    // OpenClaw SDK 的 api.config 是整个 ~/.openclaw/openclaw.json 的内容,
    // 插件自己的 config 在 plugins.entries["wework-scrm"].config 里, 要手动取
    const wholeCfg = (api.config ?? {}) as Record<string, any>;
    const pluginCfg = wholeCfg?.plugins?.entries?.["wework-scrm"]?.config ?? {};
    const cfg = {
      ...DEFAULT_CONFIG,
      ...pluginCfg,
      auth: { ...DEFAULT_CONFIG.auth, ...(pluginCfg.auth ?? {}) },
      storage: { ...DEFAULT_CONFIG.storage, ...(pluginCfg.storage ?? {}) },
      dify: { ...DEFAULT_CONFIG.dify, ...(pluginCfg.dify ?? {}) },
    };

    // 注册全部 Agent 工具 (36个) — 始终注册, 让 OpenClaw inspect/agent 都能看到 tools
    // (避免之前 "WEWORK_PLUGIN_ENABLE 没设就 return" 导致 tool 不可见的问题)
    registerMessageTools(api);
    registerContactTools(api);
    registerGroupTools(api);
    registerMomentsTools(api);
    registerDeviceTools(api);

    // [2026-05-04 已知限制] OpenClaw 2026.5.x 改了 plugin 暴露 tool 给 agent 的规则,
    // 要求 plugin 是 "capability mode" (注册 channel/provider/agent-harness 等). 我们目前
    // 是 "non-capability" mode, 所以 36 个 wework_* tools 在 CLI 和 service 里都能用,
    // 但 LLM agent (openclaw agent ...) 看不到它们. 解决路径需要重构 plugin 注册逻辑.
    // 当前 workaround: 用户继续用 CLI (wework send/group/moments/...) 直接驱动.

    // 后台服务: WS 客户端连接 Java 后端
    api.registerService({
      id: "wework-ws-client",

      async start() {
        // WS 连接只能由 systemd-managed openclaw-scrm.service 持有 (避免多进程
        // 同账号 squeeze). 其他 openclaw 进程 (CLI / agent / inspect) 加载
        // plugin 时跳过 WS, 但 tools 正常注册可见.
        if (process.env.WEWORK_PLUGIN_ENABLE !== "1") {
          logger.info("[wework-scrm] tools 已注册, 但跳过 WS 连接 (没 WEWORK_PLUGIN_ENABLE=1)");
          return;
        }

        // 初始化 SQLite
        getDb(cfg.storage.sqlitePath);
        logger.info(`[Storage] SQLite: ${cfg.storage.sqlitePath}`);

        // 连接 Java 后端 WS (含认证)
        const client = getWeWorkClient({
          serverUrl: cfg.javaWsUrl,
          authType: cfg.auth.authType,
          username: cfg.auth.username,
          password: cfg.auth.password,
        });

        if (!cfg.auth.username && cfg.auth.authType !== 3) {
          logger.error("[Auth] auth.username 为空, Java 后端不会推送业务消息! 请在 ~/.openclaw/openclaw.json 的 plugins.entries.wework-scrm.config.auth 里配置");
        }

        client.on("log", (m: string) => logger.info(`[WS] ${m}`));
        client.on("error", (e: Error) => logger.error(`[WS] ${e.message}`));

        client.on("connected", () => {
          logger.info(`[Ready] 已连接 Java 后端 ${cfg.javaWsUrl}`);
        });

        // 接收 Java 后端推送的事件 (与 PC 前端收到的一样)
        // 注意: Java 发给客户端的 JSON 字段是小写开头 (msgType/message),
        //       客户端发给 Java 是大写开头 (MsgType/Content). 两边都兼容一下.
        client.on("json-message", async (json: Record<string, unknown>) => {
          try {
            const msgType = (json.msgType ?? json.MsgType) as string;
            let rawContent: any = json.message ?? json.Message ?? json.Content;
            if (typeof rawContent === "string") {
              try { rawContent = JSON.parse(rawContent); } catch {}
            }
            const content = (rawContent ?? {}) as Record<string, unknown>;

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

              if (!handled && cfg.dify.enabled) {
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

            // 新会话通知 (建群完成等异步操作的回调)
            // 用于跨进程 IPC: CLI 写入 pending_tasks 后退出, service 这边收到推送匹配执行
            if (msgType === "ConversationAddNotice") {
              const conv = (content.Convers ?? (content as any).convers) as any;
              const groupName = conv?.Name ?? conv?.name;
              // 关键: ConvAdd push 的 conv.Id 是 Java DB 主键 (内部 id), 不是企微真正的群 ConvId.
              // 真正的群 ConvId 在 conv.RemoteId 字段 — talkToFriendTask 必须用 RemoteId,
              // 用 Id 会发到不存在的会话, 出现 "诡异单聊" 状态. 实测验证:
              //   群"vip0148群": Id=7635723906955859509(假) RemoteId=10771793581934761(真, MySQL 验证)
              const internalId = conv?.Id ?? conv?.id;
              const realConvId = conv?.RemoteId ?? conv?.remoteId;
              const convType = conv?.Type ?? conv?.type;  // 0=单聊 1=群聊
              if (groupName && realConvId) {
                logger.info(`[ConvAdd] 新会话: name="${groupName}" RemoteId=${realConvId} (internalId=${internalId}) type=${convType} (0=单聊 1=群聊)`);
                // 只匹配群聊 (Type=1), 跳过单聊
                if (convType !== 1 && convType !== "1") {
                  logger.info(`[ConvAdd] 跳过 (Type=${convType} 不是群聊)`);
                  return;
                }
                try {
                  const pending = findPendingTaskByMatch("create_room", String(groupName));
                  if (pending) {
                    logger.info(`[PendingTask] 命中 task_id=${pending.taskId} action=${pending.action}`);
                    const payload = JSON.parse(pending.actionPayload);
                    if (pending.action === "send_message") {
                      // 外部群刚建出来时, 客户可能还在企微确认加群中, 立即发会被拒 (SDK 显示红色感叹号).
                      // 延迟 ~30 秒等客户确认.
                      const delayMs = payload.delayMs ?? 30000;
                      logger.info(`[PendingTask] ⏳ 延迟 ${delayMs}ms 后发欢迎到 RemoteId=${realConvId} (等客户确认加群)`);
                      setTimeout(() => {
                        const r = sendMessage(
                          pending.wxId,
                          String(realConvId),
                          payload.content,
                          payload.contentType ?? "text",
                        );
                        if (r.success) {
                          markPendingTaskDone(pending.id, String(realConvId), "sent");
                          logger.info(`[PendingTask] ✅ 欢迎消息已发到新群 RemoteId=${realConvId}`);
                        } else {
                          logger.error(`[PendingTask] ❌ 发欢迎消息失败: ${r.error}`);
                        }
                      }, delayMs);
                    }
                  }
                } catch (e: any) {
                  logger.error(`[PendingTask] 处理异常: ${e.message}`);
                }
              }
            }

          } catch (e: any) {
            logger.error(`[Event] ${e.message}`);
          }
        });

        // 每小时清理一次超过 24 小时还在 pending 的任务
        setInterval(() => {
          try {
            const n = cleanupStalePendingTasks(24);
            if (n > 0) logger.info(`[PendingTask] 清理 ${n} 个 stale 任务`);
          } catch {}
        }, 3600 * 1000);

        // 启动定时任务调度
        startScheduler(logger);

        // 启动手机 SDK 在线状态监控 (60s 轮询 MySQL, 状态变化时落库 + 告警)
        startPhoneMonitor(logger, 60_000);

        // 连接
        await client.start();
      },

      async stop() {
        stopScheduler();
        stopPhoneMonitor();
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
          // CLI 模式: 用 cliUsername/cliPassword 走独立账号,
          // 避免跟 service 的 username 互踢. 留空则 fallback 到 auth.username.
          const cliUser = cfg.auth.cliUsername || cfg.auth.username;
          const cliPwd  = cfg.auth.cliPassword || cfg.auth.password;
          if (!cliUser) {
            console.log("❌ auth.cliUsername (或 auth.username) 未配置, CLI 无法登录 Java 后端");
            return false;
          }
          client = getWeWorkClient({
            serverUrl: cfg.javaWsUrl,
            authType: cfg.auth.authType,
            username: cliUser,
            password: cliPwd,
          });
          cliInitiatedConnection = true;
          // 等到收到 DeviceAuthRsp + accessToken 后才算"真连接成功"
          // (而不是 ws onopen, 那时心跳还没启动, 几秒就被踢)
          try {
            await new Promise<void>((resolve, reject) => {
              const timeout = setTimeout(
                () => reject(new Error("连接超时 (30s)")),
                30000,
              );
              client!.on("log", (m: string) => {
                if (m.includes("认证成功")) {
                  clearTimeout(timeout);
                  resolve();
                }
              });
              client!.once("error", (e: Error) => {
                clearTimeout(timeout);
                reject(e);
              });
              client!.start();
            });
            // 给 Java 端注册 channel 的时间, 避免发送指令时还没准备好
            await new Promise((r) => setTimeout(r, 500));
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
      // 综合健康检查: WS 连接 + 手机 SDK isonline + 系统资源
      // 加 --json 给 MCP server / 自动化 用
      ww.command("status")
        .description("查 WS 连接 + 手机在线 + 系统综合状态")
        .option("--json", "JSON 输出 (给程序读)")
        .option("--wx-id <id>", "查指定 wxId 的手机状态, 默认所有")
        .action(withConnection(async (opts: { json?: boolean; wxId?: string }) => {
          const c = getWeWorkClient();
          const wsConnected = c?.connected ?? false;
          const result: any = {
            ts: new Date().toISOString(),
            ws: { connected: wsConnected, url: cfg.javaWsUrl },
            phones: [] as Array<{ wxId: string; name: string; online: boolean }>,
            warnings: [] as string[],
          };

          // 查 MySQL 看手机 SDK 在线状态 (isonline=0 表示真在线, 1=离线)
          try {
            const propsPath = "/opt/wework/wework-server/src/main/resources/application.properties";
            if (fs.existsSync(propsPath)) {
              const props = fs.readFileSync(propsPath, "utf8");
              const dbUser = props.match(/^spring\.datasource\.username=(.+)$/m)?.[1]?.trim() ?? "wework";
              const dbPass = props.match(/^spring\.datasource\.password=(.+)$/m)?.[1]?.trim() ?? "";
              const dbName = props.match(/jdbc:mysql:\/\/[^/]+\/([^?]+)/)?.[1] ?? "workchat";
              if (dbPass) {
                const filter = opts.wxId ? `WHERE wxid=${opts.wxId}` : `WHERE wxid IS NOT NULL`;
                const sql = `SELECT wxid, name, isonline FROM tbl_wx_accountinfo ${filter};`;
                const { execFileSync } = await import("node:child_process");
                const out = execFileSync("mysql", ["-u", dbUser, "-N", "-B", dbName, "-e", sql],
                  { env: { ...process.env, MYSQL_PWD: dbPass }, encoding: "utf8", timeout: 5000 });
                for (const line of out.trim().split("\n")) {
                  const [wxId, name, isonlineStr] = line.split("\t");
                  if (!wxId) continue;
                  const online = isonlineStr === "0";
                  result.phones.push({ wxId, name, online });
                  if (!online) result.warnings.push(`手机 ${name}(${wxId}) SDK 离线 (isonline=${isonlineStr}) — 客户消息发不到!`);
                }
              }
            }
          } catch (e: any) {
            result.warnings.push(`无法查 MySQL phone status: ${e.message}`);
          }

          if (!wsConnected) result.warnings.push("Java WS 未连接, 收发都会失败");

          if (opts.json) {
            console.log(JSON.stringify(result, null, 2));
            return;
          }

          // 人类可读输出
          console.log(`Java WS:    ${wsConnected ? "✅ 已连接" : "❌ 未连接"} (${cfg.javaWsUrl})`);
          if (result.phones.length === 0) {
            console.log("手机 SDK:   ⚠️  无数据 (查不到 tbl_wx_accountinfo)");
          } else {
            for (const p of result.phones) {
              console.log(`手机 SDK:   ${p.online ? "✅ 在线" : "❌ 离线"} ${p.name}(${p.wxId})`);
            }
          }
          if (result.warnings.length > 0) {
            console.log("");
            console.log("⚠️  警告:");
            for (const w of result.warnings) console.log(`  - ${w}`);
          }
        }));

      // --- 手机状态事件历史 ---
      ww.command("events")
        .description("查手机 SDK 在线/离线 状态变化历史")
        .option("--wx-id <id>", "限定 wxId")
        .option("-n, --limit <n>", "条数, 默认 20", "20")
        .option("--json", "JSON 输出")
        .action((opts: { wxId?: string; limit: string; json?: boolean }) => {
          const limit = parseInt(opts.limit, 10) || 20;
          const events = listPhoneStatusEvents(opts.wxId, limit);
          if (opts.json) { console.log(JSON.stringify(events, null, 2)); return; }
          if (events.length === 0) {
            console.log("暂无手机状态事件 (PhoneMonitor 还在初始化, 或者状态没变化过)");
            return;
          }
          console.log("手机 SDK 在线/离线 历史 (最新在前):");
          for (const e of events as any[]) {
            const icon = e.to_state === "offline" ? "❌" : "✅";
            const dur = e.duration_sec ? ` (上一状态持续 ${e.duration_sec}s)` : "";
            console.log(`  ${e.ts}  ${icon} ${e.name}(${e.wx_id}) ${e.from_state} → ${e.to_state}${dur}`);
          }
        });

      // --- 综合健康检查 ---
      // status 只看 WS+phone, health 把整套基础设施都查一遍 (运维一条命令搞定)
      ww.command("health")
        .description("综合健康检查 (Java/Redis/MySQL/手机/swap/服务全套)")
        .option("--json", "JSON 输出")
        .action(async (opts: { json?: boolean }) => {
          const { execFile } = await import("node:child_process");
          const { promisify } = await import("node:util");
          const exec = promisify(execFile);
          const sh = async (cmd: string, args: string[], timeout = 5000) => {
            try { const r = await exec(cmd, args, { encoding: "utf8", timeout }); return r.stdout.trim(); }
            catch (e: any) { return null; }
          };
          const probe: any = { ts: new Date().toISOString(), checks: {} };

          // 1. systemd 服务
          for (const svc of ["openclaw-scrm", "wework-server", "nginx", "mysql", "redis-server"]) {
            const r = await sh("systemctl", ["is-active", `${svc}.service`]);
            probe.checks[`svc:${svc}`] = { ok: r === "active", value: r };
          }

          // 2. Java 端口
          for (const port of ["15086", "15087", "15088"]) {
            const r = await sh("ss", ["-tln"]);
            const listening = r?.includes(`:${port} `) ?? false;
            probe.checks[`port:${port}`] = { ok: listening };
          }

          // 3. 内存 / swap / load
          const free = await sh("free", ["-m"]);
          if (free) {
            const memLine = free.split("\n").find((l) => l.startsWith("Mem:"));
            const swapLine = free.split("\n").find((l) => l.startsWith("Swap:"));
            const memCols = memLine?.split(/\s+/) ?? [];
            const swapCols = swapLine?.split(/\s+/) ?? [];
            const memAvail = parseInt(memCols[6] ?? "0", 10);
            const swapTotal = parseInt(swapCols[1] ?? "0", 10);
            probe.checks["memory:available_mb"] = { ok: memAvail > 200, value: memAvail };
            probe.checks["swap:total_mb"] = { ok: swapTotal > 0, value: swapTotal, hint: swapTotal === 0 ? "没 swap, RAM 紧时 SSH 会卡 banner timeout" : "" };
          }
          const upt = await sh("uptime", []);
          probe.checks["uptime"] = { ok: true, value: upt };

          // 4. WS 状态: 看 systemd service 进程的 PID 是否真连着 Java 15088
          // (CLI 自己的 WS 是临时的, 不代表真实运行状态)
          try {
            const sysctlPid = await sh("systemctl", ["show", "-p", "MainPID", "openclaw-scrm.service", "--value"]);
            const pid = sysctlPid?.trim();
            if (pid && pid !== "0") {
              const ssOut = await sh("ss", ["-tn"]);
              const wsConnected = ssOut?.split("\n").some((l) =>
                l.includes(":15088") && l.includes("ESTAB")) ?? false;
              probe.checks["service:ws_connected"] = { ok: wsConnected,
                value: wsConnected ? `service PID ${pid} 连着 Java 15088` : "service WS 没连上 Java" };
            } else {
              probe.checks["service:ws_connected"] = { ok: false, value: "service 进程没在跑" };
            }
          } catch (e: any) { /* 忽略 */ }

          // 5. 手机 SDK isonline (从 MySQL)
          try {
            const propsPath = "/opt/wework/wework-server/src/main/resources/application.properties";
            if (fs.existsSync(propsPath)) {
              const props = fs.readFileSync(propsPath, "utf8");
              const dbUser = props.match(/^spring\.datasource\.username=(.+)$/m)?.[1]?.trim() ?? "wework";
              const dbPass = props.match(/^spring\.datasource\.password=(.+)$/m)?.[1]?.trim() ?? "";
              const dbName = props.match(/jdbc:mysql:\/\/[^/]+\/([^?]+)/)?.[1] ?? "workchat";
              if (dbPass) {
                const out = await sh("mysql", ["-u", dbUser, "-N", "-B", dbName, "-e",
                  "SELECT wxid, name, isonline FROM tbl_wx_accountinfo WHERE wxid IS NOT NULL;"]);
                if (out) {
                  const phones = out.split("\n").filter(Boolean).map((l) => {
                    const [wxid, name, isonline] = l.split("\t");
                    return { wxid, name, online: isonline === "0" };
                  });
                  probe.checks["phone:online_count"] = { ok: phones.some((p) => p.online), value: phones };
                }
              }
            }
          } catch (e: any) { /* 忽略 */ }

          // 6. nginx /attachment 反代
          const nginxOk = await sh("curl", ["-sS", "-m", "3", "-o", "/dev/null", "-w", "%{http_code}",
            "http://127.0.0.1/attachment/"]);
          probe.checks["nginx:attachment"] = { ok: nginxOk === "200" || nginxOk === "403", value: nginxOk };

          // 7. SQLite 大小
          if (fs.existsSync(cfg.storage.sqlitePath)) {
            const stat = fs.statSync(cfg.storage.sqlitePath);
            probe.checks["sqlite:size_kb"] = { ok: true, value: Math.round(stat.size / 1024) };
          }

          // ====== 输出 ======
          const failed = Object.entries(probe.checks).filter(([_, v]: any) => !v.ok);
          probe.summary = { total: Object.keys(probe.checks).length, failed: failed.length };

          if (opts.json) { console.log(JSON.stringify(probe, null, 2)); return; }
          console.log("=== WeWork SCRM 综合健康检查 ===");
          for (const [k, v] of Object.entries(probe.checks)) {
            const vv = v as any;
            const icon = vv.ok ? "✅" : "❌";
            const valStr = typeof vv.value === "string" ? vv.value :
              Array.isArray(vv.value) ? vv.value.map((p: any) => `${p.name}(${p.online ? "在线" : "❌离线"})`).join(", ") :
              String(vv.value ?? "");
            console.log(`  ${icon} ${k.padEnd(28)} ${valStr}${vv.hint ? "  ← " + vv.hint : ""}`);
          }
          console.log("");
          console.log(`Summary: ${failed.length === 0 ? "✅ 全绿" : `❌ ${failed.length}/${probe.summary.total} 项异常`}`);
        });

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
        .argument("<action>", "操作: create/add_member/remove_member/set_name/set_notice/quit/list_members/set_remark")
        .option("-g, --group <convId>", "群会话ID")
        .option("-m, --members <ids...>", "成员ID列表")
        .option("-c, --content <text>", "群名/公告内容")
        .option("--send-after <msg>", "建群成功后发一条欢迎消息 (仅 create)")
        .option("--welcome-delay <ms>", "建群后延迟多久发欢迎 (等客户确认加群, 默认 30000ms)", "30000")
        .option("--wait-timeout <ms>", "等待 TaskResult 超时", "30000")
        .action(withConnection(async (wxId: string, action: string, opts: { group?: string; members?: string[]; content?: string; sendAfter?: string; welcomeDelay: string; waitTimeout: string }) => {
          const r = chatRoomAction(wxId, action, opts.group, opts.members, opts.content);
          if (!r.success) {
            console.log(`❌ ${r.error}`);
            return;
          }
          console.log(`✅ 群操作 ${action} 已发送 (TaskId=${r.taskId})`);
          // 建群+欢迎消息流程: 通过 SQLite IPC 委托给 service 进程执行
          // (CLI 是短期进程, ConversationAddNotice 推给 service 不是 CLI, 所以 CLI 等不到)
          if (action === "create" && opts.sendAfter && r.taskId && opts.content) {
            try {
              const delayMs = parseInt(opts.welcomeDelay) || 30000;
              addPendingTask({
                taskId: String(r.taskId),
                taskType: "create_room",
                wxId: wxId,
                matchKey: opts.content,
                action: "send_message",
                actionPayload: { content: opts.sendAfter, contentType: "text", delayMs },
              });
              console.log(`📋 已登记 pending 任务: 收到群"${opts.content}"创建通知后, 等 ${delayMs}ms 让客户确认加群, 再自动发欢迎`);
              console.log(`   (查状态: sqlite3 /root/wework-scrm.db "SELECT * FROM pending_tasks WHERE task_id='${r.taskId}'")`);
            } catch (e: any) {
              console.log(`⚠ 登记 pending 任务失败: ${e.message}`);
            }
          }
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

      // --- 撤回消息 ---
      ww.command("revoke")
        .description("撤回已发出的消息")
        .argument("<wxId>", "企业微信ID")
        .argument("<msgId>", "消息ID (从 history 拉到的 MsgId)")
        .argument("<convId>", "会话ID")
        .action(withConnection(async (wxId: string, msgId: string, convId: string) => {
          const r = revokeMessage(wxId, msgId, convId);
          console.log(r.success ? `✅ 撤回指令已发送 (msg=${msgId})` : `❌ ${r.error}`);
        }));

      // --- 转发消息 ---
      ww.command("forward")
        .description("转发消息到另一个会话")
        .argument("<wxId>", "企业微信ID")
        .argument("<msgId>", "要转发的消息ID")
        .argument("<fromConvId>", "源会话ID")
        .argument("<toConvId>", "目标会话ID")
        .action(withConnection(async (wxId: string, msgId: string, fromConvId: string, toConvId: string) => {
          const r = forwardMessage(wxId, msgId, fromConvId, toConvId);
          console.log(r.success ? `✅ 转发指令已发送 (${fromConvId} → ${toConvId})` : `❌ ${r.error}`);
        }));

      // --- 上传本地文件 → 拽 URL ---
      // 之后用: wework send <wxId> <convId> <URL> --type image
      // 或一条龙: wework send-image <wxId> <convId> <localPath>
      const DEFAULT_UPLOAD_URL = "http://127.0.0.1:15086/fileUpload";
      async function uploadLocalFile(localPath: string, uploadUrl: string): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
        if (!fs.existsSync(localPath)) {
          return { ok: false, error: `文件不存在: ${localPath}` };
        }
        const fileBuf = fs.readFileSync(localPath);
        const fileName = path.basename(localPath);
        const boundary = `----wework${Date.now()}`;
        const head = Buffer.from(
          `--${boundary}\r\nContent-Disposition: form-data; name="myfile"; filename="${fileName}"\r\nContent-Type: application/octet-stream\r\n\r\n`,
          "utf8",
        );
        const tail = Buffer.from(`\r\n--${boundary}--\r\n`, "utf8");
        const body = Buffer.concat([head, fileBuf, tail]);
        try {
          const res = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": `multipart/form-data; boundary=${boundary}` },
            body,
          });
          const text = await res.text();
          const json = JSON.parse(text);
          const url = json?.data?.url;
          if (url) return { ok: true, url };
          return { ok: false, error: `上传 API 没返回 url: ${text.slice(0, 200)}` };
        } catch (e: any) {
          return { ok: false, error: e.message };
        }
      }

      ww.command("upload")
        .description("上传本地文件到服务器图床, 输出 URL")
        .argument("<localPath>", "本地文件绝对路径")
        .option("--upload-url <url>", "fileUpload 接口 URL", DEFAULT_UPLOAD_URL)
        .action(async (localPath: string, opts: { uploadUrl: string }) => {
          // 注意: 此命令不需要连 Java WS, 只是 HTTP POST
          const r = await uploadLocalFile(localPath, opts.uploadUrl);
          console.log(r.ok ? `✅ ${r.url}` : `❌ ${r.error}`);
        });

      // --- 一条龙: 本地图 → 上传 → 发给客户/群 ---
      // 替代手动 wework upload <path> 然后复制 url 再 wework send
      ww.command("send-image")
        .description("上传本地图片并发送给目标会话 (一条龙)")
        .argument("<wxId>", "企业微信ID")
        .argument("<convId>", "目标会话ID (单聊客户 RemoteId 或群 ConvId)")
        .argument("<localPath>", "本地图片绝对路径")
        .option("--upload-url <url>", "fileUpload 接口 URL", DEFAULT_UPLOAD_URL)
        .action(withConnection(async (wxId: string, convId: string, localPath: string, opts: { uploadUrl: string }) => {
          const up = await uploadLocalFile(localPath, opts.uploadUrl);
          if (!up.ok) {
            console.log(`❌ 上传失败: ${up.error}`);
            return;
          }
          console.log(`✅ 上传完成: ${up.url}`);
          const r = sendMessage(wxId, convId, up.url, "image");
          console.log(r.success ? `✅ 图片已发送 → ${convId}` : `❌ 发送失败: ${r.error}`);
        }));

    }, { commands: ["wework"] });

    logger.info("[wework-scrm] 注册完成: 36 Agent工具 + CLI + WS客户端模式 (→ Java后端)");
  },
});
