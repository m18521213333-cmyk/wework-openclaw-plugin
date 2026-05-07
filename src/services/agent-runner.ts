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
    /**
     * 用户附件 — image/voice/video/file. 当前 Kimi 不支持 vision, 后端会把附件元信息以文本形式
     * 拼到 user content 末尾, 让 LLM 知道用户附了什么 (例: "[用户附了图片: a.png 240KB]").
     * dataUrl 是 base64; uploadedUrl 是远程公网 URL (如果前端已上传, 优先用).
     */
    attachments?: Array<{
      type: string;
      name?: string;
      size?: number;
      mimeType?: string;
      url?: string;
      dataUrl?: string;
    }>;
  }>;
  llmProvider: LLMProviderConfig;
  context?: { wxId?: string; userAccount?: string };
  /** 23 个 MCP 工具的 tool schema list */
  tools: LLMTool[];
}

/** 把附件元信息渲染成文本提示, 拼到 user content 末尾喂给 LLM */
function renderAttachmentsHint(
  atts: NonNullable<ChatRequest["messages"][number]["attachments"]>,
): string {
  if (!atts.length) return "";
  const lines = atts.map((a) => {
    const name = a.name || "(未命名)";
    const sizeKb = a.size ? `${Math.round(a.size / 1024)}KB` : "";
    const mime = a.mimeType ? ` ${a.mimeType}` : "";
    const where = a.url ? ` url=${a.url}` : a.dataUrl ? " (内嵌 base64)" : "";
    return `[用户附了 ${a.type}: ${name}${mime}${sizeKb ? " " + sizeKb : ""}${where}]`;
  });
  return "\n\n" + lines.join("\n");
}

/** 确认门 — 哪些工具调用前必须等用户确认 (破坏性 / 高副作用) */
const CONFIRM_REQUIRED = new Set([
  "wework_mass_send",          // 群发, 影响多人
  "wework_revoke_message",     // 撤回 (对方可能看到)
  "wework_delete_customer",    // 删客户, 不可逆
  "wework_delete_label",       // 删标签, 影响所有打过此签的客户
  "wework_modify_label",       // 改标签名, 影响所有打过的客户
  "wework_set_user_labels",    // 给用户打标签 (LLM 一句话可能误打数十人)
  "wework_delete_moments",     // 删朋友圈, 不可逆
  "wework_delete_sns_comment", // 删评论
  "wework_post_moments",       // 发朋友圈是公开行为
  "wework_post_moments_task",  // 同上
]);
function isConfirmRequired(name: string, args: Record<string, unknown>): boolean {
  if (CONFIRM_REQUIRED.has(name)) return true;
  // 群操作: 踢人 / 退群 / 解散 — 不可逆, 强制确认
  if (name === "wework_chatroom_action") {
    const a = String(args.action ?? "");
    if (["kick", "quit", "exit", "remove_member", "dismiss"].includes(a)) return true;
  }
  // 群发收件人 > 5 也确认 (mass_send 已经在 set 里, 这里是双保险)
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
   - **wework_find_contact 仅找联系人 (人), 不查群**. 用户说人名 = 永远私聊.
   - 用户想发群必须显式说"群"/"到 XX 群"/"群发 XX": 这种情况调 wework_get_history 先列出群会话或问用户给出群 ID, 不要用 find_contact.
   - find_contact 没找到 → 提示 "联系人没同步, 跑 wework_sync_data --type contacts 触发同步" 而不是瞎找.

4. **🚫 严禁改写用户原话**.
   - 用户说: "群发 X Y Z: 假期结束了" → 调 wework_mass_send 时 message="假期结束了" **完全照原文**. 不许改成 "亲爱的客户, 节后开工愉快, 期待与您再次合作" 这种润色.
   - 用户说: "发文给赵丽: 周末新品上线" → message="周末新品上线" **一字不改**.
   - 你只是工具的搬运工, 不是文案策划. 用户没让你润色就别润色.
   - 用户主动说"帮我写一条" 才是允许改写的信号; 否则原样传.

5. **🚫 严禁工具未跑完就抢先报成功**.
   - 错误: 用户说群发 → 你调 find_contact, 还没等 mass_send 跑完就回 "已发给 3 人".
   - 正确: 等所有 tool call 真返回成功结果后, 才写"已发给 N 人".
   - 工具失败时如实报失败原因, 不要美化.

## 当前用户

- 工作微信 wxId: ${ctx?.wxId ?? DEFAULT_WX_ID}
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

/**
 * 兜底 wxId — 跟 agent-backend 那边对齐.
 * 当 ChatRequest.context.wxId 没传时用 (基本不会发生, header / body 总会带一个).
 */
const DEFAULT_WX_ID = process.env.DEFAULT_WX_ID || "1688852285335663";

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
    ...req.messages.map((m) => {
      // 用户消息附件以文本形式拼到 content 末尾 (Kimi 当前无 vision, 兜底)
      const hint = m.role === "user" && m.attachments && m.attachments.length > 0
        ? renderAttachmentsHint(m.attachments)
        : "";
      return {
        role: m.role as "user" | "assistant",
        content: m.content + hint,
      };
    }),
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

      // 调试日志: 看 LLM 实际传什么参数 (尤其 message 字段)
      console.log(`[agent] tool: ${tc.name} args: ${JSON.stringify(args).slice(0, 300)}`);

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

      // 多账号: 把 context.wxId 兜底注入 args (LLM 偶尔会漏 wxId), 同时通过 env 传给子进程
      const ctxWxId = req.context?.wxId || DEFAULT_WX_ID;
      if (!args.wxId) args.wxId = ctxWxId;

      // 执行 (spawn openclaw wework cli 子进程)
      const startMs = Date.now();
      try {
        const out = await runMcpTool(tc.name, args, ctxWxId);
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
async function runMcpTool(
  name: string,
  args: Record<string, unknown>,
  /** 多账号: 当前会话的 wxId, 通过 OPENCLAW_WX_ID env 传给子进程做兜底 */
  ctxWxId?: string,
): Promise<unknown> {
  // 把 args 映射到 CLI args (按 mcp-server.ts 的 runArgs)
  const cliArgs = mapToolToCliArgs(name, args);
  if (!cliArgs) {
    throw new Error(`工具 ${name} 暂未在 agent backend 实现 (TODO)`);
  }

  // 只有支持 --json 的 CLI 子命令才加 (查询类). send/mass-send/group 等 mutation
  // 命令不支持, 加了会报 'unknown option --json' 错.
  const JSON_SUPPORTED_SUBCMDS = new Set([
    "find-contact", "recent-media", "resolve-media", "history", "search",
    "contacts", "events", "phone", "status", "last-media", "send-image",
    "my-moments", "moments", "group",
  ]);
  const subcmd = cliArgs[0];
  const finalArgs = JSON_SUPPORTED_SUBCMDS.has(subcmd)
    ? ["wework", ...cliArgs, "--json"]
    : ["wework", ...cliArgs];

  // 多账号: 通过 env 把 wxId 透给子进程 (CLI 现阶段不识别 --wx-id flag, 用 env 安全).
  // CLI 主路径还是通过 args.wxId 的位置参数传 (mapToolToCliArgs 已处理), env 是兜底.
  const childEnv: NodeJS.ProcessEnv = { ...process.env };
  if (ctxWxId) childEnv.OPENCLAW_WX_ID = ctxWxId;

  return new Promise((resolve, reject) => {
    execFile(AI_BIN, finalArgs, {
      timeout: 60_000,
      maxBuffer: 5 * 1024 * 1024,
      encoding: "utf8",
      env: childEnv,
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
    // ── P2 客户操作 ──────────────────────────────────────────────────────
    case "wework_add_customer": {
      const out = ["add-customer", String(a.wxId), String(a.remoteId)];
      if (a.verifyContent) out.push("--verify", String(a.verifyContent));
      return out;
    }
    case "wework_accept_customer":
      return ["accept-customer", String(a.wxId), String(a.remoteId)];
    case "wework_get_ext_user_id":
      return ["get-ext-user-id", String(a.wxId), String(a.remoteId)];
    case "wework_set_user_memo":
      return ["set-memo", String(a.wxId), String(a.remoteId), String(a.memo)];
    case "wework_set_user_labels": {
      const ids = Array.isArray(a.labelIds) ? (a.labelIds as string[]) : [];
      return ["set-user-labels", String(a.wxId), String(a.remoteId), "--label-ids", ...ids];
    }
    // ── P2 朋友圈互动 ─────────────────────────────────────────────────────
    case "wework_sns_like":
      return ["sns-like", String(a.wxId), String(a.snsId)];
    case "wework_sns_comment": {
      const out = ["sns-comment", String(a.wxId), String(a.snsId), String(a.content)];
      if (a.replyTo) out.push("--reply-to", String(a.replyTo));
      return out;
    }
    case "wework_sns_delete":
      return ["delete-sns", String(a.wxId), String(a.snsId)];
    // ── P3 工具 ───────────────────────────────────────────────────────────
    case "wework_pull_qr_code":
      return ["pull-qr-code", String(a.wxId)];
    default:
      return null;
  }
}
