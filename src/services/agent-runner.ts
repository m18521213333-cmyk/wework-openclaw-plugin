/**
 * Agent runner — 接收 chat 请求, 流式接 LLM, 工具调用, SSE 回流.
 *
 * 工具执行: 直接 spawn `openclaw wework <cmd>` 子进程 (跟 mcp-server 一样).
 * 这样可以复用现有 36 个 MCP 工具, 不用重写.
 *
 * 敏感操作 confirm gate: 拦 mass_send / delete / pwdedit / account_delete,
 * SSE 发 confirmation_request, 等用户响应再继续.
 */

import { execFile } from "node:child_process";
import {
  streamOpenAICompatible,
  type LLMMessage,
  type LLMTool,
  type LLMProviderConfig,
} from "./llm-provider.js";

const AI_BIN = process.env.AI_BIN || "/usr/local/bin/openclaw";

/** SSE 写函数 — 调用方传 (event, data) 即可 */
export type SSEWriter = (event: string, data: unknown) => void;

/** /api/agent/chat 请求体 */
export interface ChatRequest {
  sessionId: string;
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
    attachments?: Array<{ type: string; url: string; name?: string }>;
  }>;
  llmProvider: LLMProviderConfig;
  context?: { wxId?: string; userAccount?: string };
  /** 23 个 MCP 工具的 tool schema list */
  tools: LLMTool[];
}

/** 确认门 — 哪些工具调用前必须等用户确认 */
const CONFIRM_REQUIRED = new Set([
  "wework_mass_send",
  "account_delete",
  "wework_revoke_message", // 撤回也算
]);
function isConfirmRequired(name: string, args: Record<string, unknown>): boolean {
  if (CONFIRM_REQUIRED.has(name)) return true;
  // 群发收件人 > 5 也确认
  if (name === "wework_mass_send") {
    const arr = args.convIds as unknown[] | undefined;
    if (Array.isArray(arr) && arr.length > 5) return true;
  }
  return false;
}

/** 系统 prompt — 教 LLM 用 23 工具 + 给行为约束 */
function buildSystemPrompt(ctx: ChatRequest["context"]): string {
  return `你是企微 SCRM 系统的 agent. 用户通过 web chat 给你指令, 你用工具执行真实操作.

## ⚠️ 绝对铁律 (违反 = 严重错误)

1. **任何关于 SCRM 数据的回答都必须先调对应工具**. 不允许凭记忆 / 猜测 / 编造结果.
   - 错误示范: 用户问 "找周丁豪", 你直接回 "找到了, 周丁豪, 上次活跃 X 时间." (没调 wework_find_contact)
   - 正确做法: 调 wework_find_contact, 拿到工具返回, 再总结回复.

2. **找不到的工具或字段不存在时, 老实说"工具没返这个数据"** , 不要编.

3. **不要假设 convId / remoteId**. 必须先调 wework_find_contact 拿到才用.

## 当前用户

- 工作微信 wxId: ${ctx?.wxId ?? "1688852285335663"}
- web 账号: ${ctx?.userAccount ?? "(未知)"}

## 可用工具 (23 个 MCP)

每个工具都是真操作. 调用 = 真执行. 详细 schema 看 tool 定义.

核心工具:
- wework_find_contact(wxId, namePattern) — 按名字找联系人
- wework_recent_media(wxId, senderId, withinMinutes, limit) — 最近媒体
- wework_get_history(wxId, convId, count) — 聊天历史
- wework_send_message(wxId, convId, content, contentType) — 发文本/图片/文件
- wework_send_media_url(wxId, convId, url, mediaType) — 发媒体 URL
- wework_resolve_media(wxId, msgId) — 触发 SDK 上传 (仅 Voice/Video/File, 不要给 Picture 用)
- wework_mass_send(wxId, message, convIds) — 群发文本到多个 convId
- wework_post_moments(wxId, content, type, media) — 朋友圈
- wework_create_group / wework_group_add_member / wework_group_set_name — 群操作
- wework_revoke_message / wework_forward_message — 撤回/转发
- wework_status / wework_health / wework_phone_status — 系统状态

## 工作模式

### 模式 A: 简单查询 ("找 X")
1. 立即调 wework_find_contact(wxId, namePattern=X)
2. 1 句话报结果: "找到了, X, 最近活跃 X 时间. (内部 convId 在数据里)"

### 模式 B: 群发 N 个人
1. **同一 LLM 回合**并发调 wework_find_contact 多次 (一次回合给多个 tool_calls)
2. 拿到所有 convId 后下一回合调 wework_mass_send
3. 报结果: "已发给 N 人"

### 模式 C: 转发媒体
1. 并发调 wework_recent_media + wework_find_contact
2. 检查 recent_media 返回每条的 forwardable/isOutgoing/contentType/isHd/sizeBytes:
   - forwardable=true → wework_send_media_url 真发
   - forwardable=false + contentType=Picture → 不调 resolve_media (协议不可靠), 直接告诉用户 "图片在企微 App 里长按→转发"
   - forwardable=false + isOutgoing=true → "你自己发的不能重传, 手动转发"
   - forwardable=false + 非 Picture → wework_resolve_media, 成功 send_media_url, 失败告诉用户

### 严格类型过滤
- "图/图片/照片" → contentType=Picture
- "音频/语音" → Voice
- "视频" → Video
- "文件/文档" → File (不含 Video)

## 回复风格

- 简短: 1-3 句, 别长篇大论
- 纯文本: 不用 markdown 列表/表格/代码块
- 用名字, 不展示 convId/remoteId/wxId 给用户
- 失败时 1 句话报具体原因 + 备选方案
- mass_send / revoke / delete 触发后端 confirm 弹窗, 你不用自己问"确认吗"`;
}

/** 主入口 — 跑一次 agent loop, SSE 流式回流给前端 */
export async function runAgent(
  req: ChatRequest,
  write: SSEWriter,
  signal: AbortSignal,
  // 用户的 confirmation 响应通过这个 promise 等待
  awaitConfirm: (id: string) => Promise<{ approved: boolean; edits?: Record<string, unknown> }>,
): Promise<void> {
  const messages: LLMMessage[] = [
    { role: "system", content: buildSystemPrompt(req.context) },
    ...req.messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
  ];

  let loopCount = 0;
  const MAX_LOOPS = 8; // 最多 8 轮 tool call (防死循环)

  while (loopCount++ < MAX_LOOPS) {
    if (signal.aborted) return;

    // 收集本轮的 text + tool_calls
    let text = "";
    const toolCallsByIndex = new Map<number, { id: string; name: string; argsRaw: string }>();
    let finishReason: "stop" | "tool_calls" | "length" | undefined;

    for await (const delta of streamOpenAICompatible(req.llmProvider, messages, req.tools, signal)) {
      if (signal.aborted) return;
      if (delta.type === "text") {
        text += delta.content;
        write("final", { text: delta.content });
      } else if (delta.type === "tool_call") {
        const existing = toolCallsByIndex.get(delta.index) ?? { id: "", name: "", argsRaw: "" };
        if (delta.id) existing.id = delta.id;
        if (delta.name) existing.name = delta.name;
        existing.argsRaw += delta.argsDelta;
        toolCallsByIndex.set(delta.index, existing);
      } else if (delta.type === "done") {
        finishReason = delta.finishReason;
      }
    }

    // 整个 stream 结束 — 如果是 stop, 整个 conversation 结束
    if (finishReason === "stop" || finishReason === "length" || toolCallsByIndex.size === 0) {
      break;
    }

    // 把 assistant 的 tool_calls 放回 messages, 然后逐个执行
    const toolCalls = Array.from(toolCallsByIndex.entries())
      .sort(([a], [b]) => a - b)
      .map(([, v]) => v);

    messages.push({
      role: "assistant",
      content: text,
      tool_calls: toolCalls.map((tc) => ({
        id: tc.id || `call_${Math.random().toString(36).slice(2, 10)}`,
        type: "function",
        function: { name: tc.name, arguments: tc.argsRaw },
      })),
    });

    for (const tc of toolCalls) {
      if (signal.aborted) return;
      let args: Record<string, unknown> = {};
      try {
        args = JSON.parse(tc.argsRaw || "{}");
      } catch {
        // ignore — 用空 args
      }

      // SSE 通知前端: 工具开始
      write("tool_call_start", {
        id: tc.id,
        name: tc.name,
        args,
      });

      // 检查是否需要确认
      let approved = true;
      let edits: Record<string, unknown> | undefined;
      if (isConfirmRequired(tc.name, args)) {
        const confirmId = `c_${Math.random().toString(36).slice(2, 10)}`;
        write("confirmation_request", {
          id: confirmId,
          action: tc.name,
          summary: `工具 ${tc.name} 要被调用`,
          willDo: args,
          affectedCount: Array.isArray(args.convIds) ? args.convIds.length : undefined,
        });
        const userResponse = await awaitConfirm(confirmId);
        approved = userResponse.approved;
        edits = userResponse.edits;
        if (edits) args = { ...args, ...edits };
      }

      if (!approved) {
        // 用户取消 — 给 LLM 一个 tool 结果说"用户拒绝了"
        const result = { error: "user_rejected", message: "用户拒绝了这个操作" };
        write("tool_call_result", { id: tc.id, result, elapsedMs: 0 });
        messages.push({
          role: "tool",
          content: JSON.stringify(result),
          tool_call_id: tc.id,
          name: tc.name,
        });
        continue;
      }

      // 执行 (spawn openclaw wework cli 子进程)
      const startMs = Date.now();
      try {
        const out = await runMcpTool(tc.name, args);
        const elapsedMs = Date.now() - startMs;
        write("tool_call_result", { id: tc.id, result: out, elapsedMs });
        messages.push({
          role: "tool",
          content: typeof out === "string" ? out : JSON.stringify(out),
          tool_call_id: tc.id,
          name: tc.name,
        });
      } catch (e) {
        const elapsedMs = Date.now() - startMs;
        const errMsg = e instanceof Error ? e.message : String(e);
        write("tool_call_result", { id: tc.id, error: errMsg, elapsedMs });
        messages.push({
          role: "tool",
          content: JSON.stringify({ error: errMsg }),
          tool_call_id: tc.id,
          name: tc.name,
        });
      }
    }

    // continue loop — LLM 看到 tool 结果, 决定下一步
  }

  write("done", {});
}

/**
 * 调 plugin 已注册的 MCP 工具 — spawn `openclaw wework <subcmd>` 子进程.
 * 每个工具的 args 怎么映射到 CLI 参数, 看 mcp-server.ts 的 runArgs.
 *
 * 简化方案: 直接调 mcp-server 的 runArgs 函数 (TODO: 重构成共享的 dispatcher).
 * 当前实现一个最简映射, 覆盖核心几个; 其他先返"未实现".
 */
async function runMcpTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  // 把 args 映射到 CLI args (按 mcp-server.ts 的 runArgs)
  const cliArgs = mapToolToCliArgs(name, args);
  if (!cliArgs) {
    throw new Error(`工具 ${name} 暂未在 agent backend 实现 (TODO)`);
  }

  return new Promise((resolve, reject) => {
    execFile(AI_BIN, ["wework", ...cliArgs, "--json"], {
      timeout: 60_000,
      maxBuffer: 5 * 1024 * 1024,
      encoding: "utf8",
    }, (err, stdout, stderr) => {
      if (err) {
        reject(new Error(`${err.message}; stderr: ${(stderr ?? "").slice(0, 200)}`));
        return;
      }
      // ⚠️ CLI 反着用: [plugins] noise 走 stdout, 实际 --json 结果走 stderr.
      // 合并两边后按 noise 前缀过滤.
      const combined = (stdout || "") + (stderr || "");
      const NOISE_PREFIXES = ["[plugins]", "[ws]", "[gateway]", "[reload]", "[shutdown]", "[health-monitor]", "[diagnostic]", "[browser/server]", "[canvas]", "[heartbeat]"];
      const lines = combined.split("\n").filter((l) => {
        if (!l) return false;
        return !NOISE_PREFIXES.some((p) => l.startsWith(p));
      });
      // 优先尝试整段 JSON parse (适合多行 array/object 输出)
      const joined = lines.join("\n").trim();
      try {
        resolve(JSON.parse(joined));
        return;
      } catch { /* 不是 JSON 整段, 继续 */ }
      // 再尝试找最后一行 JSON
      for (let i = lines.length - 1; i >= 0; i--) {
        const t = lines[i].trim();
        if (t.startsWith("{") || t.startsWith("[")) {
          try {
            resolve(JSON.parse(t));
            return;
          } catch { /* 不是这一行, 继续 */ }
        }
      }
      // fallback 文本
      resolve(joined);
    });
  });
}

/** 把 MCP 工具调用映射到 `openclaw wework <subcmd> <args>` */
function mapToolToCliArgs(name: string, args: Record<string, unknown>): string[] | null {
  const a = args as Record<string, string | number | string[] | undefined>;
  switch (name) {
    case "wework_send_message":
      return ["send", String(a.wxId), String(a.convId), String(a.content), "--type", String(a.contentType ?? "text")];
    case "wework_send_media_url":
    case "wework_send_image_url":
      return ["send", String(a.wxId), String(a.convId), String(a.url), "--type", String(a.mediaType ?? "image")];
    case "wework_mass_send": {
      const ids = Array.isArray(a.convIds) ? (a.convIds as string[]) : [];
      return ["mass-send", String(a.wxId), String(a.message), "--to", ...ids];
    }
    case "wework_post_moments": {
      const out = ["moments", String(a.wxId), String(a.content)];
      if (a.type) out.push("--type", String(a.type));
      if (Array.isArray(a.media)) out.push("--media", ...(a.media as string[]));
      return out;
    }
    case "wework_recent_media":
      return ["recent-media", String(a.wxId), String(a.senderId), "--within", String(a.withinMinutes ?? 30), "--limit", String(a.limit ?? 10)];
    case "wework_resolve_media":
      return ["resolve-media", String(a.wxId), String(a.msgId), "--wait", String(a.waitSec ?? 60)];
    case "wework_find_contact":
      return ["find-contact", String(a.wxId), String(a.namePattern)];
    case "wework_get_history":
      return ["history", String(a.wxId), String(a.convId), "-n", String(a.count ?? 50)];
    case "wework_search_messages":
      return ["search", String(a.wxId), String(a.keyword), ...(a.convId ? ["--conv", String(a.convId)] : [])];
    case "wework_status":
    case "wework_health":
      return ["health"];
    case "wework_phone_status":
      return ["phone", String(a.wxId)];
    case "wework_my_moments":
      return ["my-moments", String(a.wxId)];
    case "wework_sync_data":
      return ["sync", String(a.wxId), "--type", String(a.dataType ?? "all")];
    case "wework_revoke_message":
      return ["revoke", String(a.wxId), String(a.msgId), String(a.convId)];
    case "wework_forward_message":
      return ["forward", String(a.wxId), String(a.msgId), String(a.fromConvId), String(a.toConvId)];
    case "wework_get_contact":
      return ["contact", String(a.wxId), String(a.remoteId)];
    case "wework_create_group":
      return ["group", String(a.wxId), "create", "--members", ...(Array.isArray(a.members) ? (a.members as string[]) : []), "--content", String(a.name)];
    case "wework_group_set_name":
      return ["group", String(a.wxId), "set_name", "-g", String(a.convId), "-c", String(a.name)];
    case "wework_group_add_member":
      return ["group", String(a.wxId), "add_member", "-g", String(a.convId), "-m", ...(Array.isArray(a.members) ? (a.members as string[]) : [])];
    case "wework_upload":
      return ["upload", String(a.localPath)];
    default:
      return null;
  }
}
