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

const PORT = parseInt(process.env.AGENT_BACKEND_PORT ?? "17800", 10);

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
  app.use(express.json({ limit: "5mb" }));
  app.use((req, _res, next) => {
    opts.logger.info(`[agent] ${req.method} ${req.path}`);
    next();
  });

  // health
  app.get("/api/agent/health", (_req, res) => {
    res.json({ status: "ok", provider: opts.defaultProvider?.name ?? "(未配置)" });
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
      const chatReq: ChatRequest = {
        sessionId,
        messages: req.body.messages ?? [],
        llmProvider: opts.defaultProvider,
        context: req.body.context ?? {},
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
