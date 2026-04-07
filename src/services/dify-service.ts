/**
 * 阶段 7.3: Dify AI 对接服务
 *
 * 对应原 Java FriendTalkNoticeHandler 中的 Dify 集成逻辑:
 *   1. 收到消息 → 检查该 wxId 是否开启了 AI
 *   2. 从 Redis(现SQLite) 获取 conversationId
 *   3. 调用 Dify API 的 chat-messages (streaming)
 *   4. 收到完整回复后 → 通过 sendMsgByType 发给用户
 *   5. 缓存新的 conversationId
 *
 * 原系统使用 difyai-spring-boot-starter 的 DifyClient，
 * 这里用原生 fetch 实现 Dify HTTP API 调用。
 */

import {
  getTenantByWxId,
  getAiConversationId,
  setAiConversationId,
  getLastMessages,
} from "./storage-service.js";
import { sendMessage } from "./send-helper.js";

export interface DifyConfig {
  apiUrl: string;
  apiKey: string;
}

/**
 * 处理 AI 自动回复
 *
 * 完整复刻原 FriendTalkNoticeHandler 中的 Dify 逻辑:
 *   1. 查 tenant 配置 → openai > 0 才启用
 *   2. 查 ai_conversations 获取 conversation_id
 *   3. 调 Dify chat-messages API (blocking模式，streaming在Node中更复杂)
 *   4. 回复发给用户
 *   5. 缓存 conversation_id
 */
export async function handleAiReply(
  wxId: string,
  convId: string,
  senderId: string,
  senderName: string,
  content: string,
  globalDifyConfig?: DifyConfig,
  logger?: { info: (...a: unknown[]) => void; error: (...a: unknown[]) => void },
): Promise<void> {
  const log = logger ?? { info: console.log, error: console.error };

  // 1. 查租户配置
  const tenant = getTenantByWxId(wxId);
  const difyUrl =
    tenant?.difyaiUrl ?? globalDifyConfig?.apiUrl;
  const difyKey =
    tenant?.difyaiKey ?? globalDifyConfig?.apiKey;

  // 如果租户没开启AI 且 全局也没配置，跳过
  if (!difyUrl || !difyKey) {
    return;
  }
  if (tenant && tenant.openai <= 0 && !globalDifyConfig) {
    return;
  }

  // 2. 获取已有的 conversation_id
  const conversationId = getAiConversationId(wxId, convId) ?? "";

  // 3. 查历史消息 (用于 inputs)
  const history = getLastMessages(convId, wxId, 100);
  const historyList = history.map((m) => ({
    msgId: m.msgId,
    ConvId: m.convId,
    SenderId: m.senderId,
    time: m.msgTime,
  }));

  // 4. 调用 Dify API
  try {
    log.info(`[Dify] 发送AI请求: wxId=${wxId}, convId=${convId}`);

    const body = {
      inputs: {
        prologue: "",
        target: "",
        memo_user_id: senderName,
        user_id: senderId,
        wx_id: wxId,
        remote_id: senderId,
        chat_history: historyList,
      },
      query: content,
      response_mode: "blocking", // 用 blocking 模式简化实现
      conversation_id: conversationId || undefined,
      user: senderName,
      auto_generate_name: false,
    };

    const resp = await fetch(`${difyUrl}/chat-messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${difyKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      log.error(`[Dify] API错误: ${resp.status} ${resp.statusText}`);
      return;
    }

    const data = (await resp.json()) as {
      answer?: string;
      conversation_id?: string;
    };

    if (!data.answer) {
      log.error("[Dify] 返回无内容");
      return;
    }

    // 5. 清理 <think>...</think> 标签 (与原系统 removeThinkTags 一致)
    let answer = data.answer.replace(/<think>[\s\S]*?<\/think>/g, "");
    answer = answer.replace(/^[\s\n]+/, "");

    if (!answer.trim()) {
      return;
    }

    log.info(`[Dify] AI回复: "${answer.slice(0, 80)}..."`);

    // 6. 发送回复给用户
    sendMessage(wxId, convId, answer, "text");

    // 7. 缓存 conversation_id
    if (data.conversation_id) {
      setAiConversationId(wxId, convId, data.conversation_id);
    }
  } catch (err) {
    log.error(`[Dify] 调用异常: ${(err as Error).message}`);
  }
}
