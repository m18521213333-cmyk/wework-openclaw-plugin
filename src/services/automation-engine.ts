/**
 * 阶段 7.1 + 7.2: 自动化引擎
 *
 * 对应原 Java AsyncTaskService 中的:
 *   - checkKeyWord()     → 关键词自动回复 (完全/模糊/智能匹配)
 *   - checkAddFriends()  → 自动接受好友请求
 *   - checkInChatRoom()  → 自动将客户拉入标签群
 *   - saveMsg()          → 保存消息到数据库
 *
 * 这些逻辑在收到消息/客户事件时被触发，通过 MessageRouter 的事件系统接入。
 */

import {
  getKeywords,
  getAutoSetting,
  saveMessage,
} from "./storage-service.js";
import { sendMessage, acceptCustomer } from "./send-helper.js";

// AutoType 常量 (对应原 AutoType.java)
const AUTO_TYPE = {
  LUCKY_MONEY: 1001,
  FRIEND_REQUEST: 1002,
  GROUP_INVITATION: 1003,
  MONEY_TRANS: 1004,
  KEYWORDS: 2001,
  IN_CHATROOM: 2002,
};

// ============================================
// 7.1 关键词自动回复
// ============================================

/**
 * 检查收到的消息是否匹配关键词规则，如果匹配则自动回复
 *
 * 复刻原 AsyncTaskService.checkKeyWord() 的完整逻辑:
 *   1. 检查该 wxId 是否开启了关键词自动回复
 *   2. 检查当前时间是否在设定的时间段内
 *   3. 按优先级匹配: 精准匹配 → 模糊包含 → 智能匹配
 *   4. 命中后自动回复
 */
export function checkKeywordReply(
  wxId: string,
  convId: string,
  messageContent: string,
  contentType: number,
  logger?: { info: (message: string) => void },
): boolean {
  const log = logger ?? { info: console.log };

  // 只处理文本消息
  if (contentType !== 0) return false;
  if (!messageContent) return false;

  // 检查是否开启了关键词自动回复
  const setting = getAutoSetting(wxId, AUTO_TYPE.KEYWORDS);
  if (!setting) return false;

  // 检查时间段 (remarks 格式: "开始时:结束时"，如 "11:6" 表示11点到次日6点)
  if (setting.remarks) {
    const parts = setting.remarks.split(":");
    if (parts.length >= 2) {
      const start = parseInt(parts[0], 10);
      const end = parseInt(parts[1], 10);
      const now = new Date().getHours();
      if (now < start && now > end) {
        return false;
      }
    }
  }

  // --- 第1轮: 精准完全匹配 (keyType=0) ---
  const exactKeywords = getKeywords(wxId, 0);
  for (const kw of exactKeywords) {
    if (kw.keyWord === messageContent) {
      log.info(`[AutoReply] 精准匹配: "${kw.keyWord}" → 回复`);
      sendMessage(wxId, convId, kw.returnString, String(kw.resourceType));
      return true;
    }
  }

  // --- 第2轮: 模糊包含匹配 (keyType=1) ---
  const fuzzyKeywords = getKeywords(wxId, 1);
  for (const kw of fuzzyKeywords) {
    if (kw.keyWord && messageContent.includes(kw.keyWord)) {
      log.info(`[AutoReply] 模糊匹配: "${kw.keyWord}" → 回复`);
      sendMessage(wxId, convId, kw.returnString, String(kw.resourceType));
      return true;
    }
  }

  // --- 第3轮: 智能匹配 (keyType=2) ---
  // 原系统使用 org.xm.Similarity 的词林相似度，这里用简化版本
  const smartKeywords = getKeywords(wxId, 2);
  if (smartKeywords.length > 0) {
    let bestMatch: (typeof smartKeywords)[0] | null = null;
    let bestScore = 0;

    for (const kw of smartKeywords) {
      if (!kw.keyWord) continue;
      const score = simpleSimilarity(kw.keyWord, messageContent);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = kw;
      }
    }

    if (bestMatch && bestScore > 0.85) {
      log.info(
        `[AutoReply] 智能匹配: "${bestMatch.keyWord}" (相似度=${bestScore.toFixed(2)}) → 回复`,
      );
      sendMessage(
        wxId,
        convId,
        bestMatch.returnString,
        String(bestMatch.resourceType),
      );
      return true;
    }
  }

  return false;
}

/**
 * 简化版文本相似度计算
 * 原系统使用 Similarity.cilinSimilarity (词林相似度)
 * 这里用 Jaccard + 编辑距离的混合方案作为替代
 */
function simpleSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (!a || !b) return 0;

  // 字符级 Jaccard 相似度
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = new Set([...setA].filter((c) => setB.has(c)));
  const union = new Set([...setA, ...setB]);
  const jaccard = intersection.size / union.size;

  // 包含关系加分
  const containBonus = a.includes(b) || b.includes(a) ? 0.2 : 0;

  // 长度相似度
  const lenRatio = Math.min(a.length, b.length) / Math.max(a.length, b.length);

  return Math.min(1, jaccard * 0.5 + lenRatio * 0.3 + containBonus);
}

// ============================================
// 7.2 自动接受好友请求
// ============================================

/**
 * 检查是否应该自动接受好友请求
 *
 * 对应原 AsyncTaskService.checkAddFriends()
 */
export function checkAutoAcceptFriend(
  wxId: string,
  remoteId: string,
  logger?: { info: (message: string) => void },
): boolean {
  const log = logger ?? { info: console.log };

  const setting = getAutoSetting(wxId, AUTO_TYPE.FRIEND_REQUEST);
  if (!setting) return false;

  log.info(`[AutoAccept] 自动接受好友请求: wxId=${wxId}, remoteId=${remoteId}`);
  acceptCustomer(wxId, remoteId);
  return true;
}

// ============================================
// 消息存储
// ============================================

/**
 * 保存聊天记录
 * 对应原 AsyncTaskService.saveMsg()
 */
export function persistMessage(msg: {
  wxId: string;
  convId: string;
  senderId?: string;
  senderName?: string;
  contentType?: string | number;
  content?: string;
  msgId?: string | number;
  msgRemoteId?: string | number;
  refId?: string | number;
  isSend?: string;
  createTime?: number;
}): void {
  saveMessage({
    wxId: msg.wxId,
    convId: msg.convId,
    senderId: String(msg.senderId ?? ""),
    senderName: msg.senderName,
    contentType: String(msg.contentType ?? "text"),
    content: msg.content,
    msgId: String(msg.msgId ?? ""),
    msgRemoteId: String(msg.msgRemoteId ?? ""),
    refId: String(msg.refId ?? ""),
    isSend: msg.isSend ?? "false",
    msgTime: msg.createTime ?? Date.now(),
  });
}
