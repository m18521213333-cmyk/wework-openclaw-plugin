/**
 * Agent backend HTTP server (Express on :17800)
 *
 * Endpoints:
 *   POST /api/agent/chat       — text/event-stream, 流式 agent 回复
 *   POST /api/agent/confirm    — 用户响应确认请求
 *   POST /api/agent/abort      — 中断当前 chat
 *   GET  /api/status/all       — 系统状态聚合
 *   GET  /api/llm/providers    — 列 provider (仅 metadata, key 不返)
 *   POST /api/llm/providers    — 添加 / 更新 provider
 *   DELETE /api/llm/providers/:id
 *   POST /api/llm/providers/:id/test
 *
 * 鉴权: 所有 endpoint 都校验 token header (复用 Java JWT — 简单做法是 forward 给 Java 验证, 或直接 trust nginx).
 *   当前先 trust (本地开发 + nginx 同源).
 */

import express, { type Request, type Response } from "express";
import http from "node:http";
import { runAgent, type ChatRequest } from "./agent-runner.js";
import type { LLMTool, LLMProviderConfig } from "./llm-provider.js";
import { queryPhones } from "./phone-monitor.js";
import { renameConversation, getQrcode } from "./storage-service.js";
import { pullQrCode } from "./send-helper.js";
import { healthEvents, type HealthEvent } from "./health-events.js";

const PORT = parseInt(process.env.AGENT_BACKEND_PORT ?? "17800", 10);

/**
 * 兜底 wxId — 当请求没带 X-WeWork-Account-Id header (老前端 / 直接调 curl) 时用.
 * 多账号上线后, 前端必带 header, 这里只是降级路径.
 */
const DEFAULT_WX_ID = process.env.DEFAULT_WX_ID || "1688852285335663";

/** 从请求头读当前操作的工作微信 wxId, 没带就用兜底 */
function readWxId(req: { headers: Record<string, unknown> }): string {
  const raw = req.headers["x-wework-account-id"];
  if (typeof raw === "string" && raw.length > 0) return raw;
  if (Array.isArray(raw) && typeof raw[0] === "string" && raw[0].length > 0) return raw[0];
  return DEFAULT_WX_ID;
}

/** 等确认 — sessionId+confirmationId → resolver */
const pendingConfirmations = new Map<
  string,
  { resolve: (v: { approved: boolean; edits?: Record<string, unknown> }) => void; createdAt: number }
>();

/** 当前活跃 sessions — 支持 abort */
const activeAborts = new Map<string, AbortController>();

/** 23 个 MCP 工具的 JSON Schema (跟 mcp-server.ts 对齐, 暴露给 LLM) */
const TOOL_SCHEMAS: LLMTool[] = [
  {
    type: "function",
    function: {
      name: "wework_recent_media",
      description: "拿某 senderId 最近 N 分钟发的媒体 (Picture/Voice/Video/File). 返回字段含 contentType/url/msgId/forwardable/isOutgoing/isHd/sizeBytes/reason. forwardable=true 直接 send_media_url; false 看 reason 决定是否 resolve_media 或建议手动转发.",
      parameters: {
        type: "object",
        properties: {
          wxId: { type: "string" },
          senderId: { type: "string" },
          withinMinutes: { type: "number", default: 30 },
          limit: { type: "number", default: 10 },
        },
        required: ["wxId", "senderId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "wework_find_contact",
      description: "按名字模糊匹配找联系人, 返回 convId + remoteId + name + type. 优先用 contacts 表 (服务器同步过的), 备用聊天历史.",
      parameters: {
        type: "object",
        properties: {
          wxId: { type: "string" },
          namePattern: { type: "string", description: "联系人名字关键词" },
        },
        required: ["wxId", "namePattern"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "wework_send_message",
      description: "给目标会话发文本/图片/文件/链接. contentType=text 时 content 是文字; image/file 时 content 必须是 http(s) URL.",
      parameters: {
        type: "object",
        properties: {
          wxId: { type: "string" },
          convId: { type: "string" },
          content: { type: "string" },
          contentType: { type: "string", enum: ["text", "image", "voice", "video", "file", "link"], default: "text" },
        },
        required: ["wxId", "convId", "content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "wework_send_media_url",
      description: "把媒体 URL 发到会话 — 用于转发用户在 IM 里发的语音/视频/文件. 接收方看到真媒体, 不是文字链接. mediaType 跟 recent_media 返回的 contentType 对应.",
      parameters: {
        type: "object",
        properties: {
          wxId: { type: "string" },
          convId: { type: "string" },
          url: { type: "string", description: "公网 URL (从 recent_media 拿)" },
          mediaType: { type: "string", enum: ["image", "voice", "video", "file"] },
        },
        required: ["wxId", "convId", "url", "mediaType"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "wework_resolve_media",
      description: "视频/文件 Java 没自动入图床 (forwardable=false 且 url 是手机本地路径) 时, 用这个触发手机 SDK 上传到图床, 拿到真 URL 再 send_media_url. ⚠️ Picture 类型不要调 — SDK 协议对图片不可靠.",
      parameters: {
        type: "object",
        properties: {
          wxId: { type: "string" },
          msgId: { type: "string" },
          waitSec: { type: "number", default: 60 },
        },
        required: ["wxId", "msgId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "wework_get_history",
      description: "查会话最近 N 条历史消息 (直读本地 SQLite). 返回真实内容 (Text 已 base64 解码).",
      parameters: {
        type: "object",
        properties: {
          wxId: { type: "string" },
          convId: { type: "string" },
          count: { type: "number", default: 50 },
        },
        required: ["wxId", "convId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "wework_search_messages",
      description: "搜历史消息 (异步 Java 拉, 结果通过事件推送).",
      parameters: {
        type: "object",
        properties: {
          wxId: { type: "string" },
          keyword: { type: "string" },
          convId: { type: "string" },
        },
        required: ["wxId", "keyword"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "wework_mass_send",
      description: "群发文本到多个会话. ⚠️ 收件人 > 5 人时会触发 confirmation gate, 用户确认后才执行.",
      parameters: {
        type: "object",
        properties: {
          wxId: { type: "string" },
          message: { type: "string" },
          convIds: { type: "array", items: { type: "string" } },
        },
        required: ["wxId", "message", "convIds"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "wework_post_moments",
      description: "发朋友圈 (text/image/link). 多图: type=image, media=[公网 URL 数组].",
      parameters: {
        type: "object",
        properties: {
          wxId: { type: "string" },
          content: { type: "string" },
          type: { type: "string", enum: ["text", "image", "link"], default: "text" },
          media: { type: "array", items: { type: "string" } },
        },
        required: ["wxId", "content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "wework_my_moments",
      description: "拉取我自己发过的朋友圈列表.",
      parameters: {
        type: "object",
        properties: { wxId: { type: "string" } },
        required: ["wxId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "wework_create_group",
      description: "建群 + 拉成员. members 是 RemoteId 数组, name 是群名.",
      parameters: {
        type: "object",
        properties: {
          wxId: { type: "string" },
          members: { type: "array", items: { type: "string" } },
          name: { type: "string" },
        },
        required: ["wxId", "members", "name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "wework_group_set_name",
      description: "改群名.",
      parameters: {
        type: "object",
        properties: {
          wxId: { type: "string" },
          convId: { type: "string" },
          name: { type: "string" },
        },
        required: ["wxId", "convId", "name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "wework_group_add_member",
      description: "拉人入群.",
      parameters: {
        type: "object",
        properties: {
          wxId: { type: "string" },
          convId: { type: "string" },
          members: { type: "array", items: { type: "string" } },
        },
        required: ["wxId", "convId", "members"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "wework_revoke_message",
      description: "撤回已发出的消息. ⚠️ 触发 confirmation gate.",
      parameters: {
        type: "object",
        properties: {
          wxId: { type: "string" },
          msgId: { type: "string" },
          convId: { type: "string" },
        },
        required: ["wxId", "msgId", "convId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "wework_forward_message",
      description: "转发某条消息到另一会话.",
      parameters: {
        type: "object",
        properties: {
          wxId: { type: "string" },
          msgId: { type: "string" },
          fromConvId: { type: "string" },
          toConvId: { type: "string" },
        },
        required: ["wxId", "msgId", "fromConvId", "toConvId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "wework_status",
      description: "拿系统总体状态 (Java/手机/Plugin/Redis/MySQL/内存).",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "wework_phone_status",
      description: "查某 wxId 的工作手机在线状态.",
      parameters: {
        type: "object",
        properties: { wxId: { type: "string" } },
        required: ["wxId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "wework_get_contact",
      description: "查某联系人详细信息.",
      parameters: {
        type: "object",
        properties: { wxId: { type: "string" }, remoteId: { type: "string" } },
        required: ["wxId", "remoteId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "wework_sync_data",
      description: "触发 Java 重新同步联系人/客户/对话/标签等数据.",
      parameters: {
        type: "object",
        properties: {
          wxId: { type: "string" },
          dataType: { type: "string", enum: ["contacts", "customers", "conversations", "labels", "all"] },
        },
        required: ["wxId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "wework_health",
      description: "综合健康检查 (服务/端口/SQLite/swap/手机 SDK 全套).",
      parameters: { type: "object", properties: {} },
    },
  },
];

export function startAgentBackend(opts: {
  defaultProvider: LLMProviderConfig | null;
  logger: { info: (m: string) => void; warn: (m: string) => void; error: (m: string) => void };
}): http.Server {
  const app = express();
  // 50mb 给附件 base64 留余量 (前端单文件 ≤5MB, 总 ≤5 个 → 最大 ~33MB base64)
  app.use(express.json({ limit: "50mb" }));
  app.use((req, _res, next) => {
    opts.logger.info(`[agent] ${req.method} ${req.path}`);
    next();
  });

  // health
  app.get("/api/agent/health", (_req, res) => {
    res.json({ status: "ok", provider: opts.defaultProvider?.name ?? "(未配置)" });
  });

  // GET /api/wework/accounts — 列出所有工作微信账号 (多账号下拉用)
  // 数据源: Java MySQL tbl_wx_accountinfo (走 phone-monitor 的 mysql 命令).
  // 没拿到时降级返单条兜底, 让前端起码能跑.
  app.get("/api/wework/accounts", async (_req, res) => {
    try {
      const phones = await queryPhones();
      if (!phones || phones.length === 0) {
        // Java MySQL 拿不到 → 降级
        res.json({
          code: 0,
          msg: "ok",
          data: [
            { wxId: DEFAULT_WX_ID, name: "孟伟@智简", isOnline: true, brand: "ZTE" },
          ],
        });
        return;
      }
      res.json({
        code: 0,
        msg: "ok",
        data: phones.map((p) => ({
          wxId: p.wxId,
          name: p.name || `(${p.wxId})`,
          isOnline: p.online,
        })),
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      opts.logger.error(`[api/wework/accounts] ${msg}`);
      // 失败也降级, 不让前端炸
      res.json({
        code: 0,
        msg: "ok",
        data: [{ wxId: DEFAULT_WX_ID, name: "孟伟@智简", isOnline: true, brand: "ZTE" }],
      });
    }
  });

  // GET /api/wework/qrcode?wxId=xxx — 拉当前账号 (或指定 wxId) 的二维码
  // 流程:
  //   1) 发 PullMyQrCodeTask 到 Java (send-helper, fire-and-forget)
  //   2) await ~3s 等 Java 通过 WS 推 PullMyQrCodeTaskResultNotice 进来
  //      (index.ts json-message handler 把 url 写到 SQLite qrcodes 表)
  //   3) 读 SQLite, 有 url/base64 就 200 + data, 没有就 code:-1 让前端走 catch
  // 注: 为什么不直接同步等 Java 回 — Java/SDK 异步, 我们是 fire-and-forget 模式,
  //     跟 moments 一样靠 WS push 落库 + HTTP 路由 polling 取.
  app.get("/api/wework/qrcode", async (req, res) => {
    try {
      const wxId = String(req.query.wxId ?? readWxId(req as unknown as { headers: Record<string, unknown> }));
      if (!wxId) {
        res.status(400).json({ code: -1, msg: "wxId 必填" });
        return;
      }

      // 触发 Java 拉新二维码 — pullQrCode 内部走 sendToJava (WS 协议帧)
      const sendResult = pullQrCode(wxId);
      if (!sendResult.success) {
        opts.logger.warn(`[api/wework/qrcode] pullQrCode 发送失败 wxId=${wxId}: ${sendResult.error}`);
        // 发送失败不直接 fail — 仍尝试读 SQLite (可能有上次拉到的旧数据)
      }

      // 等 Java 异步推回结果, 实测正常路径 1~2s, 给 3s 余量
      await new Promise<void>((r) => setTimeout(r, 3000));

      // 读 SQLite (WS handler 写入)
      const row = getQrcode(wxId);
      if (row && (row.qr_url || row.qr_base64)) {
        res.json({
          code: 0,
          msg: "ok",
          data: {
            url: row.qr_url ?? "",
            base64: row.qr_base64 ?? "",
            expireAt: row.expire_at ?? null,
          },
        });
        return;
      }

      // 没拉到 — 返 code:-1, 前端 axios 拦截器会 reject, SettingsView 显示 msg
      res.json({ code: -1, msg: "二维码暂未拉到, 请稍后再试" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      opts.logger.error(`[api/wework/qrcode] ${msg}`);
      res.status(500).json({ code: -1, msg });
    }
  });

  // ============================================
  // 列表 API — 给 web v2 菜单页用 (ContactsView / ConversationsView 等)
  // 复用 plugin 已有的 SQLite (storage-service)
  // ============================================

  // GET /api/contacts?wxId=&search=&limit=&offset=
  // 多账号: 优先 X-WeWork-Account-Id header, 兼容旧 wxId query param.
  app.get("/api/contacts", async (req, res) => {
    try {
      const wxId = String(req.query.wxId ?? readWxId(req as unknown as { headers: Record<string, unknown> }));
      const search = String(req.query.search ?? "");
      const limit = Math.min(parseInt(String(req.query.limit ?? "100"), 10) || 100, 500);
      const offset = parseInt(String(req.query.offset ?? "0"), 10) || 0;
      if (!wxId) {
        res.status(400).json({ code: -1, msg: "wxId 必填" });
        return;
      }
      // 直接读 SQLite (plugin 已建好 contacts 表)
      const Database = (await import("better-sqlite3")).default;
      const db = new Database("/root/wework-scrm.db", { readonly: true });
      try {
        // contacts 表实际字段: remote_id, name, alias, avatar, corp_id, corp_name, contact_type, gender, phone, job, last_synced_at
        let sql = "SELECT remote_id, name, alias, avatar, corp_name, contact_type AS type, gender, phone, job AS position, last_synced_at AS last_seen FROM contacts WHERE wx_id=?";
        const params: unknown[] = [wxId];
        if (search) {
          sql += " AND (name LIKE ? OR alias LIKE ?)";
          params.push(`%${search}%`, `%${search}%`);
        }
        sql += " ORDER BY last_seen DESC LIMIT ? OFFSET ?";
        params.push(limit, offset);
        const rows = db.prepare(sql).all(...params);
        const total = (db.prepare("SELECT COUNT(*) AS c FROM contacts WHERE wx_id=?").get(wxId) as { c: number }).c;
        res.json({ code: 0, msg: "ok", data: { total, items: rows } });
      } finally {
        db.close();
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      opts.logger.error(`[api/contacts] ${msg}`);
      res.status(500).json({ code: -1, msg });
    }
  });

  // GET /api/conversations?wxId=&limit=
  // 多账号: 优先 X-WeWork-Account-Id header.
  app.get("/api/conversations", async (req, res) => {
    try {
      const wxId = String(req.query.wxId ?? readWxId(req as unknown as { headers: Record<string, unknown> }));
      const limit = Math.min(parseInt(String(req.query.limit ?? "50"), 10) || 50, 200);
      if (!wxId) {
        res.status(400).json({ code: -1, msg: "wxId 必填" });
        return;
      }
      const Database = (await import("better-sqlite3")).default;
      const db = new Database("/root/wework-scrm.db", { readonly: true });
      try {
        // 按 conv_id 聚合, 取最近一条作为 preview, 顺便统计未读条数.
        // LEFT JOIN conversations 拿用户自定义 nick (没有则 fallback messages.sender_name).
        const rows = db.prepare(`
          SELECT
            m.conv_id,
            COALESCE(c.nick, MAX(m.sender_name)) AS sender_name,
            c.nick AS nick,
            MAX(m.content_type) AS content_type,
            MAX(m.content) AS last_content,
            datetime(MAX(m.created_at), 'localtime') AS last_ts,
            COUNT(*) AS msg_count
          FROM messages m
          LEFT JOIN conversations c
            ON c.wx_id = m.wx_id AND c.conv_id = m.conv_id
          WHERE m.wx_id=? AND m.created_at > datetime('now', '-7 days')
          GROUP BY m.conv_id
          ORDER BY MAX(m.created_at) DESC
          LIMIT ?
        `).all(wxId, limit) as any[];
        // 解码 base64 文本预览
        const items = rows.map((r) => {
          let preview = String(r.last_content ?? "");
          try {
            if (r.content_type === "Text" || r.content_type === "1") {
              preview = Buffer.from(preview, "base64").toString("utf8");
            } else {
              preview = `[${r.content_type}]`;
            }
          } catch { /* ignore */ }
          return { ...r, preview: preview.slice(0, 80), last_content: undefined };
        });
        res.json({ code: 0, msg: "ok", data: items });
      } finally {
        db.close();
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      opts.logger.error(`[api/conversations] ${msg}`);
      res.status(500).json({ code: -1, msg });
    }
  });

  // POST /api/conversations/rename — 给会话起本地昵称
  // body: { convId: string, nick: string | null }   (nick 空字符串/null 视为清空恢复原名)
  // 多账号: 优先 X-WeWork-Account-Id header.
  app.post("/api/conversations/rename", async (req, res) => {
    try {
      const wxId = readWxId(req as unknown as { headers: Record<string, unknown> });
      const convId = String(req.body?.convId ?? "").trim();
      const rawNick = req.body?.nick;
      const nick = typeof rawNick === "string" ? rawNick.trim() : null;
      if (!wxId || !convId) {
        res.status(400).json({ code: -1, msg: "wxId + convId 必填" });
        return;
      }
      // 空串当成清空 (恢复消息原 sender_name)
      renameConversation(wxId, convId, nick && nick.length > 0 ? nick : null);
      res.json({ code: 0, msg: "ok", data: { convId, nick } });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      opts.logger.error(`[api/conversations/rename] ${msg}`);
      res.status(500).json({ code: -1, msg });
    }
  });

  // GET /api/messages?wxId=&convId=&limit=
  // 多账号: 优先 X-WeWork-Account-Id header.
  app.get("/api/messages", async (req, res) => {
    try {
      const wxId = String(req.query.wxId ?? readWxId(req as unknown as { headers: Record<string, unknown> }));
      const convId = String(req.query.convId ?? "");
      const limit = Math.min(parseInt(String(req.query.limit ?? "50"), 10) || 50, 500);
      if (!wxId || !convId) {
        res.status(400).json({ code: -1, msg: "wxId + convId 必填" });
        return;
      }
      const Database = (await import("better-sqlite3")).default;
      const db = new Database("/root/wework-scrm.db", { readonly: true });
      try {
        const rows = db.prepare(`
          SELECT msg_id, msg_remote_id, sender_id, sender_name, content_type, content, is_send,
            datetime(created_at, 'localtime') AS ts
          FROM messages
          WHERE wx_id=? AND conv_id=?
          ORDER BY id DESC LIMIT ?
        `).all(wxId, convId, limit) as any[];
        // 解码 base64 文本 content
        const items = rows.map((r) => {
          let content = String(r.content ?? "");
          try {
            if (r.content_type === "Text" || r.content_type === "1") {
              content = Buffer.from(content, "base64").toString("utf8");
            } else if (r.content_type === "Picture" || r.content_type === "Voice" || r.content_type === "Video" || r.content_type === "File") {
              try {
                const obj = JSON.parse(Buffer.from(content, "base64").toString("utf8"));
                content = JSON.stringify(obj);
              } catch { /* keep raw */ }
            }
          } catch { /* ignore */ }
          return { ...r, content };
        });
        res.json({ code: 0, msg: "ok", data: items.reverse() });
      } finally {
        db.close();
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      opts.logger.error(`[api/messages] ${msg}`);
      res.status(500).json({ code: -1, msg });
    }
  });

  // GET /api/status/all — 给 StatusPanel 真用 (替换前端 mock)
  app.get("/api/status/all", async (_req, res) => {
    try {
      // 多账号: 优先从 phone-monitor 拿真在线状态; 拿不到降级到兜底
      let phones: Array<{ wxId: string; name: string; isOnline: boolean; brand?: string; module?: string }>;
      try {
        const rows = await queryPhones();
        if (rows && rows.length > 0) {
          phones = rows.map((r) => ({ wxId: r.wxId, name: r.name || `(${r.wxId})`, isOnline: r.online }));
        } else {
          throw new Error("queryPhones empty");
        }
      } catch {
        phones = [
          { wxId: DEFAULT_WX_ID, name: "孟伟@智简", isOnline: true, brand: "ZTE", module: "7531N" },
        ];
      }
      // 先返 mock+部分真实, 后续逐步接 health 检查
      res.json({
        code: 0,
        msg: "ok",
        data: {
          phones,
          java: { active: true, uptime: "—" },
          plugin: { active: true, pid: process.pid },
          redis: { active: true },
          mysql: { active: true },
          swap: { totalMb: 2047, usedMb: 0 },
          memory: { availableMb: Math.round(process.memoryUsage().rss / 1024 / 1024) },
        },
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      res.status(500).json({ code: -1, msg });
    }
  });

  // POST /api/agent/chat (SSE)
  app.post("/api/agent/chat", async (req: Request, res: Response) => {
    if (!opts.defaultProvider) {
      res.status(503).json({ code: -1, msg: "LLM provider 未配置" });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // nginx 不缓冲

    const sessionId = req.body.sessionId ?? `s_${Math.random().toString(36).slice(2)}`;
    const ac = new AbortController();
    activeAborts.set(sessionId, ac);

    const write: (event: string, data: unknown) => void = (event, data) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    const awaitConfirm = (id: string): Promise<{ approved: boolean; edits?: Record<string, unknown> }> => {
      return new Promise((resolve) => {
        pendingConfirmations.set(`${sessionId}:${id}`, { resolve, createdAt: Date.now() });
        // 30 分钟没响应当超时拒绝
        setTimeout(() => {
          if (pendingConfirmations.has(`${sessionId}:${id}`)) {
            pendingConfirmations.delete(`${sessionId}:${id}`);
            resolve({ approved: false });
          }
        }, 30 * 60_000);
      });
    };

    try {
      // 多账号: header 优先, 没带则 body.context.wxId, 都没有兜底.
      const wxId = readWxId(req as unknown as { headers: Record<string, unknown> });
      const ctx = { ...(req.body.context ?? {}), wxId };
      const chatReq: ChatRequest = {
        sessionId,
        messages: req.body.messages ?? [],
        llmProvider: opts.defaultProvider,
        context: ctx,
        tools: TOOL_SCHEMAS,
      };
      await runAgent(chatReq, write, ac.signal, awaitConfirm);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      opts.logger.error(`[agent] runAgent error: ${msg}`);
      write("error", { message: msg });
    } finally {
      activeAborts.delete(sessionId);
      res.end();
    }
  });

  // POST /api/agent/confirm
  app.post("/api/agent/confirm", (req, res) => {
    const { sessionId, confirmationId, approved, edits } = req.body as {
      sessionId: string;
      confirmationId: string;
      approved: boolean;
      edits?: Record<string, unknown>;
    };
    const key = `${sessionId}:${confirmationId}`;
    const pending = pendingConfirmations.get(key);
    if (!pending) {
      res.status(404).json({ code: -1, msg: "confirmation 不存在或已超时" });
      return;
    }
    pendingConfirmations.delete(key);
    pending.resolve({ approved, edits });
    res.json({ code: 0, msg: "ok" });
  });

  // POST /api/agent/abort
  app.post("/api/agent/abort", (req, res) => {
    const sessionId = req.body.sessionId as string;
    activeAborts.get(sessionId)?.abort();
    activeAborts.delete(sessionId);
    res.json({ code: 0, msg: "ok" });
  });

  // GET /api/llm/providers
  // GET /api/health/events (SSE) — 推 phone-offline / phone-reconnected / java-down/up / redis-down/up / mysql-down/up
  // 前端 (web2 StatusPanel) 订阅显示 toast 通知.
  // 仅广播未来事件, 不回放历史 (历史看 phone_status_events 表).
  app.get("/api/health/events", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // nginx 不缓冲
    // flushHeaders 让客户端立即收到 200 (Express 5 默认 headersSent 即可, 这里显式调以兼容)
    if (typeof res.flushHeaders === "function") {
      res.flushHeaders();
    }

    // 起始 hello 事件 — 前端用来确认连通
    res.write(`event: ready\ndata: ${JSON.stringify({ ts: Date.now() })}\n\n`);

    const onEvent = (ev: HealthEvent): void => {
      try {
        // SSE 标准: event: <type> + data: <json> + 空行
        res.write(`event: ${ev.type}\ndata: ${JSON.stringify(ev)}\n\n`);
      } catch {
        // 写失败 — 客户端断了, off 由 close handler 处理
      }
    };
    healthEvents.on("event", onEvent);

    // 心跳 (15s 一次), 防止中间代理 idle close
    const ping = setInterval(() => {
      try {
        res.write(`: ping ${Date.now()}\n\n`);
      } catch { /* ignore */ }
    }, 15_000);

    const cleanup = (): void => {
      clearInterval(ping);
      healthEvents.off("event", onEvent);
    };
    req.on("close", cleanup);
    req.on("error", cleanup);
  });

  app.get("/api/llm/providers", (_req, res) => {
    // 当前只支持单 provider (从启动配置). 后续可加 DB 存多个.
    if (!opts.defaultProvider) {
      res.json({ code: 0, msg: "ok", data: [] });
      return;
    }
    const p = opts.defaultProvider;
    res.json({
      code: 0,
      msg: "ok",
      data: [
        {
          id: p.id,
          type: p.type,
          name: p.name,
          baseUrl: p.baseUrl,
          model: p.model,
          keyPreview: p.apiKey.slice(0, 8) + "***",
          isDefault: true,
          enabled: true,
        },
      ],
    });
  });

  const server = http.createServer(app);
  server.listen(PORT, "127.0.0.1", () => {
    opts.logger.info(`[agent-backend] listening on :${PORT} (provider=${opts.defaultProvider?.name ?? "(未配置)"})`);
  });

  // 周期清理超时 confirmations
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of pendingConfirmations) {
      if (now - v.createdAt > 35 * 60_000) {
        pendingConfirmations.delete(k);
        v.resolve({ approved: false });
      }
    }
  }, 60_000);

  return server;
}
