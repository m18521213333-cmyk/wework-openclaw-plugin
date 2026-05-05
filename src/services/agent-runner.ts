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

/** 系统 prompt — 教 LLM 用 36 工具 + 给行为约束 */
function buildSystemPrompt(ctx: ChatRequest["context"]): string {
  return `你是企微 SCRM 系统的 agent assistant. 用户通过 web 界面跟你对话, 你帮他们用工具完成 SCRM 操作.

当前用户:
- 工作微信 wxId: ${ctx?.wxId ?? "(未知)"}
- web 账号: ${ctx?.userAccount ?? "(未知)"}

可用工具: 23 个 MCP 工具 (wework_send_message / wework_recent_media / wework_find_contact / ...).
所有工具都是真实操作 (不是模拟), 调用即生效.

工作原则:
1. 用户说自然语言, 你判断需要哪个工具(链), 然后调用
2. 严格按用户指令的关键词过滤媒体类型: "图"=Picture, "音频"=Voice, "视频"=Video, "文件"=File
3. 转发媒体时检查 forwardable / isOutgoing / isHd / sizeBytes 字段, 给出可执行建议而不是模糊"SDK 限制"
4. 失败时 1-2 句话告诉用户失败原因 + 立即可行的备选方案
5. 不要长篇技术解释, 微信场景人都不爱看长文
6. 群发 / 撤回 等敏感操作, 后端会拦下让用户确认; 你按工具调用即可, 不用自己加确认逻辑
7. 用纯文本回复, 别用 markdown 表格 / 代码块 (聊天 UI 渲染有限)`;
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
    }, (err, stdout) => {
      if (err) {
        reject(new Error(err.message));
        return;
      }
      // CLI 输出可能含 [plugins] noise + JSON / 文本结果
      const lines = stdout.split("\n").filter((l) => l && !l.startsWith("["));
      const last = lines[lines.length - 1] ?? "";
      try {
        resolve(JSON.parse(last));
      } catch {
        resolve(lines.join("\n").trim());
      }
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
