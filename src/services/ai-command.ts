/**
 * /ai <自然语言指令> — 用企微当 OpenClaw 的 IM 入口
 *
 * 用户在企微跟自己 (或任意会话) 发 "/ai 看周丁豪聊了啥, 给个回复",
 * plugin 收到 FriendTalkNotice 检测到 /ai 前缀:
 *   1. 立刻回 "🤖 处理中..." 让用户知道收到了
 *   2. 异步 spawn `openclaw agent` 跑指令
 *   3. agent 返回结果, 用 sendMessage 把结果回到原会话
 *
 * 安全:
 *   - 仅当 senderId == wxId (你自己发的) 才触发. 别人发 /ai 不会执行
 *   - 防 loop: agent 回的内容不会以 /ai 开头, 不会自递归触发
 */

import { execFile } from "node:child_process";
import { sendMessage } from "./send-helper.js";

const AI_PREFIX = "/ai";
const AI_BIN = process.env.AI_BIN || "/usr/local/bin/openclaw";

interface CmdContext {
  wxId: string;
  convId: string;
  senderId: string;
  senderName?: string;
  contentBase64: string;
  /** ContentType 可能是 number (proto enum 数字 0/1) 或 string ("Text"/"Picture" 等) */
  contentType: number | string;
  logger: { info: (m: string) => void; warn: (m: string) => void; error: (m: string) => void };
  /**
   * 允许触发 /ai 的 senderId 白名单 (除了 wxId 本身).
   * 例: 你个人微信加的外部联系人 RemoteId.
   * 留空 = 仅 wxId 本身 (但企微 App 自发不走 Java, 所以基本等于禁用)
   */
  allowedSenders?: string[];
}

/** 解码企微 base64 编码的文本内容 */
function decodeText(b64: string): string {
  try { return Buffer.from(b64, "base64").toString("utf8"); }
  catch { return ""; }
}

/** 异步跑 openclaw agent, 返回 agent 的最后输出 */
function runAgentAsync(prompt: string, timeoutMs = 90_000): Promise<string> {
  return new Promise((resolve, reject) => {
    const sid = `ai-cmd-${Date.now()}`;
    const child = execFile(AI_BIN, ["agent", "--agent", "main", "--session-id", sid, "-m", prompt], {
      timeout: timeoutMs,
      encoding: "utf8",
      maxBuffer: 5 * 1024 * 1024,
    }, (err, stdout, _stderr) => {
      if (err) return reject(err);
      // 过滤掉 [plugins] 那种噪音, 留 LLM 最终输出
      const lines = stdout.split("\n")
        .filter((l) => !l.startsWith("["))
        .filter((l) => l.trim().length > 0);
      const result = lines.join("\n").trim();
      resolve(result || "(agent 没输出)");
    });
    child.on("error", reject);
  });
}

/**
 * 检查并处理 /ai 命令.
 * @returns true = 这条消息是 /ai 命令 (调用方不要再走其他自动回复路径)
 */
export function handleAiCommand(ctx: CmdContext): boolean {
  // 只处理文本消息 (proto enum: 0=Unknown 1=Text, JSON 形式可能是数字也可能是字符串"Text")
  const ct = ctx.contentType;
  const isText = ct === 1 || ct === 0 || ct === "Text" || ct === "text" || ct === "1" || ct === "0";
  if (!isText) return false;
  if (!ctx.contentBase64) return false;

  const text = decodeText(ctx.contentBase64).trim();
  if (!text.startsWith(AI_PREFIX)) return false;

  // 安全检查: senderId 必须是 wxId 自己 OR 在白名单里
  // 白名单典型用法: 你个人微信加企微 (孟伟) 后, 你个人微信对应的外部 RemoteId
  const allowed = new Set([ctx.wxId, ...(ctx.allowedSenders ?? [])]);
  if (!allowed.has(ctx.senderId)) {
    // 总是日志记录 — 用户看 journalctl 能知道自己 ID 是啥, 加进 config
    ctx.logger.warn(`[AICmd] /ai 来自未授权 senderId=${ctx.senderId} (${ctx.senderName ?? "无名"}). 内容: ${text.slice(0, 60)}. 如要授权, 加到 plugins.entries.wework-scrm.config.ai.allowedSenders`);
    return true; // 算处理了 (避免其他 handler 把它当普通消息回复)
  }

  const prompt = text.slice(AI_PREFIX.length).trim();
  if (!prompt) {
    sendMessage(ctx.wxId, ctx.convId, "🤖 用法: /ai <你的自然语言指令>\n例: /ai 给客户余燕发条祝福: 周末愉快", "text");
    return true;
  }

  ctx.logger.info(`[AICmd] 收到 /ai 指令 (convId=${ctx.convId}): ${prompt.slice(0, 60)}`);

  // 立刻回执告诉用户在处理 (用户不会觉得没反应)
  sendMessage(ctx.wxId, ctx.convId, `🤖 收到, 处理中…\n指令: ${prompt}`, "text");

  // 异步跑 agent + 回复, 不阻塞 message handler
  // 注意 agent 跑完可能要 30-60 秒
  const enrichedPrompt = `我企微 wxId=${ctx.wxId}, 当前会话 convId=${ctx.convId}. 用户指令: ${prompt}. 你可以用 wework__wework_find_contact 按名字找联系人 convId, wework__wework_get_history 看会话历史, wework__wework_send_message 发消息, wework__wework_post_moments 发朋友圈. 简短报告做了什么.`;

  runAgentAsync(enrichedPrompt).then((result) => {
    // result 可能很长, 截断到合理长度避免企微 1MB 限制
    const output = result.length > 4000 ? result.slice(0, 4000) + "\n…(截断)" : result;
    const reply = `✅ 已处理:\n\n${output}`;
    sendMessage(ctx.wxId, ctx.convId, reply, "text");
    ctx.logger.info(`[AICmd] ✓ 已回复结果 (长度 ${output.length})`);
  }).catch((e: any) => {
    const errMsg = e.message || String(e);
    sendMessage(ctx.wxId, ctx.convId, `❌ 处理失败: ${errMsg.slice(0, 200)}`, "text");
    ctx.logger.error(`[AICmd] 失败: ${errMsg}`);
  });

  return true;
}
