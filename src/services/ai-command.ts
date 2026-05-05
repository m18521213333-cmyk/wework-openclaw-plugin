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
import { sendMessageWithRetry } from "./send-helper.js";

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
// 默认 4 分钟 — 多张图/复杂任务需要 LLM 多次 tool 调用
function runAgentAsync(prompt: string, timeoutMs = 240_000): Promise<string> {
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
    // 用法提示走重试: 即使瞬时被踢也尽量送达
    sendMessageWithRetry(ctx.wxId, ctx.convId, "🤖 用法: /ai <你的自然语言指令>\n例: /ai 给客户余燕发条祝福: 周末愉快", "text").catch((e) => {
      ctx.logger.warn(`[AICmd] 用法提示发送失败: ${e?.message ?? e}`);
    });
    return true;
  }

  ctx.logger.info(`[AICmd] 收到 /ai 指令 (convId=${ctx.convId}): ${prompt.slice(0, 60)}`);

  // 立刻回执告诉用户在处理 (用户不会觉得没反应) — 走重试
  sendMessageWithRetry(ctx.wxId, ctx.convId, `🤖 收到, 处理中…\n指令: ${prompt}`, "text").catch((e) => {
    ctx.logger.warn(`[AICmd] 处理中提示发送失败: ${e?.message ?? e}`);
  });

  // 异步跑 agent + 回复, 不阻塞 message handler
  // 注意 agent 跑完可能要 30-60 秒
  const enrichedPrompt = `我企微 wxId=${ctx.wxId}, 我刚发指令的 senderId=${ctx.senderId}. 用户指令: ${prompt}.

可用工具:
- wework__wework_find_contact: 按名字找联系人 convId
- wework__wework_get_history: 看会话历史
- wework__wework_send_message: 发文本消息 (contentType=text 默认)
- wework__wework_send_message: 也能发图片/语音/视频, contentType=image/voice/video, content=URL
- wework__wework_post_moments: 发朋友圈, type=text/image/link, media=[URLs]
- wework__wework_recent_media: 拿用户在 IM 里最近发的图/音/视频/文件 URL 列表 (支持多张, senderId=${ctx.senderId})
- wework__wework_upload: 上传服务器本地文件, 返回 URL

媒体发送工作流 (用户说"把刚发的 X 个媒体发给YY, 加文字Y"):
1. wework__wework_recent_media(wxId, senderId=${ctx.senderId}, limit=N) 拿 URL 列表
   每条返回: contentType, url, msgId, forwardable, isOutgoing, isHd, sizeBytes, thumbUrl, reason
2. wework__wework_find_contact 找 YY 的 convId
3. 先 wework__wework_send_message(wxId, convId, message=Y) 发文字
4. 对每个媒体, 看 forwardable + isOutgoing + contentType + isHd + sizeBytes 字段决策:

   a. forwardable=true: wework_send_media_url(wxId, convId, url, mediaType) 真发出去
      mediaType: Picture→image, Voice→voice, Video→video, File→file

   b. forwardable=false 且 contentType=Picture:
      → **绝对不调 resolve_media** (SDK 协议对图片 DownloadFileByMsgId 极不可靠)
      → reason 字段已经包含精确根因 (isHd / size 超阈值), 直接告诉用户:
        * 如果 isHd=true → "你这张图发的时候勾了'原图', 工作手机 SDK 协议不能转原图. 重发时不勾原图我就能直接转, 或者你企微长按图→转发也行"
        * 如果 sizeBytes > 800KB → "图太大 (size=XXMB), SDK 没自动入图床. 重发时压缩小一点 (≤700KB) 我能直接转, 或者长按手动转发"
        * 否则 → 试 resolve_media, 失败再建议手动
      → **必须告诉用户具体的'重发时怎么做'**, 不要只说"SDK 限制" — 用户没法行动

   c. forwardable=false 且 isOutgoing=true 且不是 Picture (Voice/Video/File):
      → **直接放弃 resolve_media** (outgoing 不能重传)
      → 1 句话: "你自己发出去的 [Voice/Video/File] SDK 不能重传, 在企微长按转发给YY 更快"

   d. forwardable=false 且 isOutgoing=false 且不是 Picture (incoming Voice/Video/File):
      → 试 wework__wework_resolve_media(wxId, msgId) 触发手机下载到图床
      → resolve_media 内部已自动 transient 重试 (Java 报"其他任务下载中"会等几秒重试 3 次)
      → 成功就 wework_send_media_url 发
      → 失败: 1 句话告诉用户失败 + 建议手动转发, 不要长篇解释

绝对不能做的事:
- 转发媒体用 wework_send_message(发文字 URL 字符串), 接收方看到链接不是真媒体
- 对 Picture 类型试 wework_resolve_media (SDK 几乎必失败, 浪费 30s+ 用户等得心烦)
- 对 isOutgoing=true 的媒体试 wework_resolve_media (同上)
- 媒体的 url 字段是 /storage/emulated/... 手机本地路径不是公网, 永远不能直接 send
- 模糊地说"SDK 限制不能转" — 必须给出**用户能立即操作的方案**:
  * "重发时不要勾选原图" (isHd=true 场景)
  * "重发时压缩图 ≤700KB" (大图场景)
  * "长按图→转发给YY" (兜底场景)
- 失败时长篇解释技术原因. 用户只想知道两件事: "成功还是失败" + "失败的话我现在能干啥"

回复格式要求:
- 用纯文本, 不要 markdown 表格 / 列表 / 代码块 (微信不渲染)
- 不要展示 convId / remoteId / wxId 等技术 ID, 用联系人名字代替
- 1-3 句话总结做了什么 + 是否成功, 别太长`;

  runAgentAsync(enrichedPrompt).then(async (result) => {
    // result 可能很长, 截断到合理长度避免企微 1MB 限制
    const output = result.length > 4000 ? result.slice(0, 4000) + "\n…(截断)" : result;
    const reply = `✅ 已处理:\n\n${output}`;
    // 结果回执是用户最关心的, 必须走重试 — 子进程序列后期 Java 经常被多个 auth 互踢
    const r = await sendMessageWithRetry(ctx.wxId, ctx.convId, reply, "text", undefined, { attempts: 5, waitForConnectMs: 20000 });
    if (r.success) ctx.logger.info(`[AICmd] ✓ 已回复结果 (长度 ${output.length})`);
    else ctx.logger.error(`[AICmd] ❌ 回复结果发送失败 (重试已尽): ${r.error}`);
  }).catch(async (e: any) => {
    const errMsg = e.message || String(e);
    await sendMessageWithRetry(ctx.wxId, ctx.convId, `❌ 处理失败: ${errMsg.slice(0, 200)}`, "text").catch(() => {});
    ctx.logger.error(`[AICmd] 失败: ${errMsg}`);
  });

  return true;
}
