/**
 * 消息发送辅助层 (方案B: 通过 Java 后端 WS JSON 协议)
 *
 * 调用链:
 *   OpenClaw Agent/CLI → 本模块 → WeWorkClient.sendCommand() → Java WS :15088 → 手机端
 *
 * JSON 协议格式 (与 PC 前端完全一致):
 *   { "MsgType": "TalkToFriendTask", "Content": { "WxId": 12345, ... } }
 *
 * 对应原 Java:
 *   WebSocketMessageProcessor.handler() → 根据 MsgType 分发
 *   XxxWebsocketHandler.handleMsg()     → asyncTaskService.msgSend2Phone()
 */

import { getWeWorkClient } from "./websocket-service.js";

// ============================================
// 发送结果
// ============================================

export interface SendResult {
  success: boolean;
  error?: string;
}

// ============================================
// 核心发送函数
// ============================================

/**
 * 通过 Java 后端 WS 发送指令
 * 对应原 PC 前端 WebSocket 发 JSON → WebSocketMessageProcessor 分发
 */
export function sendToJava(
  msgType: string,
  content: Record<string, unknown>,
): SendResult {
  const client = getWeWorkClient();
  if (!client) {
    return { success: false, error: "WS 客户端未初始化" };
  }
  if (!client.connected) {
    return { success: false, error: "未连接 Java 后端" };
  }

  const ok = client.sendCommand(msgType, content);
  if (!ok) {
    return { success: false, error: "发送失败" };
  }
  return { success: true };
}

// ============================================
// 内容类型映射
// ============================================

function contentTypeValue(name: string): number {
  const map: Record<string, number> = {
    text: 0, image: 1, voice: 2, video: 3,
    link: 4, file: 5, namecard: 6, location: 7,
    weapp: 8, emoji: 9,
  };
  return map[name.toLowerCase()] ?? 0;
}

// ============================================
// 阶段 3: 消息
// ============================================

export function sendMessage(
  wxId: string, convId: string, content: string,
  contentType: string = "text", atList?: string[],
): SendResult {
  const payload: Record<string, unknown> = {
    WxId: Number(wxId),
    ConvId: Number(convId),
    ContentType: contentTypeValue(contentType),
    Content: content,
    TaskId: Date.now(),
  };
  if (atList?.length) payload.AtSomeOne = atList.map(Number);
  return sendToJava("TalkToFriendTask", payload);
}

export function revokeMessage(wxId: string, msgId: string, convId: string): SendResult {
  return sendToJava("MsgRevokeTask", {
    WxId: Number(wxId), MsgId: Number(msgId), ConvId: Number(convId),
  });
}

export function forwardMessage(wxId: string, msgId: string, fromConvId: string, toConvId: string): SendResult {
  return sendToJava("ForwardMsgTask", {
    WxId: Number(wxId), MsgId: Number(msgId), ConvId: Number(fromConvId), ToConvId: Number(toConvId),
  });
}

export function forwardMultiMessages(wxId: string, msgIds: string[], fromConvId: string, toConvId: string): SendResult {
  return sendToJava("ForwardMultiTask", {
    WxId: Number(wxId), MsgIds: msgIds.map(Number), ConvId: Number(fromConvId), ToConvId: Number(toConvId),
  });
}

export function searchMessages(wxId: string, keyword: string, convId?: string): SendResult {
  const p: Record<string, unknown> = { WxId: Number(wxId), Keyword: keyword };
  if (convId) p.ConvId = Number(convId);
  return sendToJava("SearchMsgTask", p);
}

export function triggerHistoryMessages(wxId: string, convId: string, count: number = 50): SendResult {
  return sendToJava("TriggerHistoryMsgPushTask", {
    WxId: Number(wxId), ConvId: Number(convId), Count: count,
  });
}

// ============================================
// 阶段 4: 联系人
// ============================================

export function getContactInfo(wxId: string, remoteId: string): SendResult {
  return sendToJava("GetContactInfoTask", { WxId: Number(wxId), RemoteId: Number(remoteId) });
}

export function addCustomerById(wxId: string, remoteId: string, verifyContent?: string): SendResult {
  const p: Record<string, unknown> = { WxId: Number(wxId), RemoteId: Number(remoteId) };
  if (verifyContent) p.VerifyContent = verifyContent;
  return sendToJava("AddCustomerByIdTask", p);
}

export function addCustomerFromSearch(wxId: string, searchText: string, verifyContent?: string): SendResult {
  const p: Record<string, unknown> = { WxId: Number(wxId), SearchText: searchText };
  if (verifyContent) p.VerifyContent = verifyContent;
  return sendToJava("AddCustomerFromSearchTask", p);
}

export function addCustomerFromWx(wxId: string, wxFriendId: string, verifyContent?: string): SendResult {
  const p: Record<string, unknown> = { WxId: Number(wxId), WxFriendId: Number(wxFriendId) };
  if (verifyContent) p.VerifyContent = verifyContent;
  return sendToJava("AddCustomerFromWxTask", p);
}

export function deleteCustomer(wxId: string, remoteId: string): SendResult {
  return sendToJava("TriggerCustomerPushTask", { WxId: Number(wxId), RemoteId: Number(remoteId) });
}

export function acceptCustomer(wxId: string, remoteId: string): SendResult {
  return sendToJava("AcceptCustomerTask", { WxId: Number(wxId), RemoteId: Number(remoteId) });
}

export function setUserMemo(wxId: string, remoteId: string, memo: string): SendResult {
  return sendToJava("SetUserMemoTask", { WxId: Number(wxId), RemoteId: Number(remoteId), Memo: memo });
}

export function getExtUserId(wxId: string, remoteId: string): SendResult {
  return sendToJava("GetExtUserIdTask", { WxId: Number(wxId), RemoteId: Number(remoteId) });
}

export function sendFriendVerify(wxId: string, remoteId: string, verifyContent?: string): SendResult {
  const p: Record<string, unknown> = { WxId: Number(wxId), RemoteId: Number(remoteId) };
  if (verifyContent) p.VerifyContent = verifyContent;
  return sendToJava("AddCustomerByIdTask", p);
}

// ============================================
// 阶段 5: 群聊 + 标签
// ============================================

export function chatRoomAction(wxId: string, action: string, convId?: string, members?: string[], content?: string): SendResult {
  const actionMap: Record<string, number> = { create: 0, add_member: 1, remove_member: 2, set_name: 3, set_notice: 4, quit: 5 };
  const p: Record<string, unknown> = { WxId: Number(wxId), Action: actionMap[action] ?? 0 };
  if (convId) p.ConvId = Number(convId);
  if (members) p.Members = members.map(Number);
  if (content) p.Content = content;
  return sendToJava("ChatRoomActionTask", p);
}

export function getGroupMembers(wxId: string, convId: string): SendResult {
  return sendToJava("ChatRoomActionTask", { WxId: Number(wxId), ConvId: Number(convId), Action: -1 });
}

export function createLabel(wxId: string, labelName: string): SendResult {
  return sendToJava("UserLabelSetTask", { WxId: Number(wxId), LabelName: labelName });
}

export function deleteLabel(wxId: string, labelId: string): SendResult {
  return sendToJava("UserLabelDelTask", { WxId: Number(wxId), LabelId: Number(labelId) });
}

export function modifyLabel(wxId: string, labelId: string, labelName: string): SendResult {
  return sendToJava("UserLabelModifyTask", { WxId: Number(wxId), LabelId: Number(labelId), LabelName: labelName });
}

export function setUserLabels(wxId: string, remoteId: string, labelIds: string[]): SendResult {
  return sendToJava("UserSetLabelTask", { WxId: Number(wxId), RemoteId: Number(remoteId), LabelIds: labelIds.map(Number) });
}

export function triggerLabelSync(wxId: string): SendResult {
  return sendToJava("TriggerUserLabelTask", { WxId: Number(wxId) });
}

export function massSend(wxId: string, convIds: string[], content: string, contentType: string = "text"): SendResult {
  return sendToJava("QunFaTask", {
    WxId: Number(wxId), ConvIds: convIds.map(Number), ContentType: contentTypeValue(contentType), Content: content,
  });
}

// ============================================
// 阶段 6: 朋友圈
// ============================================

export function postMoments(wxId: string, content: string, contentType: string = "text", mediaUrls?: string[], linkUrl?: string, linkTitle?: string, visibleList?: string[]): SendResult {
  const p: Record<string, unknown> = { WxId: Number(wxId), ContentType: contentTypeValue(contentType), Content: content };
  if (mediaUrls) p.MediaUrls = mediaUrls;
  if (linkUrl) p.LinkUrl = linkUrl;
  if (linkTitle) p.LinkTitle = linkTitle;
  if (visibleList) p.VisibleList = visibleList.map(Number);
  return sendToJava("PostSnsTask", p);
}

export function postMomentsTask(wxId: string, taskId: string): SendResult {
  return sendToJava("PostSnsTaskTask", { WxId: Number(wxId), TaskId: Number(taskId) });
}

export function getSnsData(wxId: string, snsId: string): SendResult {
  return sendToJava("GetSnsDataTask", { WxId: Number(wxId), SnsId: Number(snsId) });
}

export function pullMySns(wxId: string): SendResult {
  return sendToJava("PullMySnsListTask", { WxId: Number(wxId) });
}

export function pullSnsTaskList(wxId: string): SendResult {
  return sendToJava("PullSnsTaskListTask", { WxId: Number(wxId) });
}

export function snsComment(wxId: string, snsId: string, content: string, replyTo?: string): SendResult {
  const p: Record<string, unknown> = { WxId: Number(wxId), SnsId: Number(snsId), Content: content };
  if (replyTo) p.ReplyTo = Number(replyTo);
  return sendToJava("SnsCommentTask", p);
}

export function snsLike(wxId: string, snsId: string): SendResult {
  return sendToJava("SnsLikeTask", { WxId: Number(wxId), SnsId: Number(snsId) });
}

export function deleteSns(wxId: string, snsId: string): SendResult {
  return sendToJava("DelSnsTask", { WxId: Number(wxId), SnsId: Number(snsId) });
}

export function deleteSnsComment(wxId: string, snsId: string, commentId: string): SendResult {
  return sendToJava("DelSnsCommentTask", { WxId: Number(wxId), SnsId: Number(snsId), CommentId: Number(commentId) });
}

// ============================================
// 设备
// ============================================

export function phoneState(wxId: string): SendResult {
  return sendToJava("PhoneStateTask", { WxId: Number(wxId) });
}

export function pullQrCode(wxId: string): SendResult {
  return sendToJava("PullMyQrCodeTask", { WxId: Number(wxId) });
}

export function downloadByUrl(wxId: string, url: string): SendResult {
  return sendToJava("DownloadFileByUrlTask", { WxId: Number(wxId), Url: url });
}

export function downloadByMsgId(wxId: string, msgId: string): SendResult {
  return sendToJava("DownloadFileByMsgIdTask", { WxId: Number(wxId), MsgId: Number(msgId) });
}

export function triggerSync(wxId: string, dataType: string): SendResult {
  const typeMap: Record<string, string> = {
    contacts: "TriggerContactPushTask",
    customers: "TriggerCustomerPushTask",
    conversations: "TriggerConversationPushTask",
    labels: "TriggerUserLabelTask",
    departments: "TriggerContactPushTask",
    wx_friends: "TriggerWechatFriendPushTask",
    all: "TriggerAccountPushTask",
  };
  const mt = typeMap[dataType] ?? "TriggerAccountPushTask";
  return sendToJava(mt, { WxId: Number(wxId) });
}
