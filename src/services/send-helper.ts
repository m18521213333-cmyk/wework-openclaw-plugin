/**
 * 消息发送辅助层 (生产级)
 *
 * 所有 Tool → 本模块 → WeWorkServer.sendToDevice() → Protobuf 编码 → 手机端 SDK
 *
 * 对应原 Java:
 *   AsyncTaskService.msgSend2Phone()  → sendToPhone()
 *   MessageUtil.sendMsgByType()       → sendMessage()
 *   MsgIdBuilder.getId()              → 在 codec.ts 内部自增
 */

import { getWeWorkServer } from "./websocket-service.js";
import { EnumMsgType, contentTypeValue } from "../proto/codec.js";

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
 * 向手机端发送指令 (Protobuf 二进制)
 * 对应原 asyncTaskService.msgSend2Phone()
 */
export function sendToPhone(
  wxId: string,
  msgType: number,
  payload: Record<string, unknown>,
): SendResult {
  const server = getWeWorkServer();
  if (!server) {
    return { success: false, error: "通信服务未启动" };
  }

  const ok = server.sendToDevice(wxId, msgType, payload);
  if (!ok) {
    return { success: false, error: `企业微信 ${wxId} 不在线` };
  }
  return { success: true };
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
    Content: Buffer.from(content, "utf-8"),
    TaskId: Date.now(),
  };
  if (atList?.length) payload.AtSomeOne = atList.map(Number);
  return sendToPhone(wxId, EnumMsgType.TalkToFriendTask, payload);
}

export function revokeMessage(wxId: string, msgId: string, convId: string): SendResult {
  return sendToPhone(wxId, EnumMsgType.MsgRevokeTask, {
    WxId: Number(wxId), MsgId: Number(msgId), ConvId: Number(convId),
  });
}

export function forwardMessage(wxId: string, msgId: string, fromConvId: string, toConvId: string): SendResult {
  return sendToPhone(wxId, EnumMsgType.ForwardMsgTask, {
    WxId: Number(wxId), MsgId: Number(msgId), ConvId: Number(fromConvId), ToConvId: Number(toConvId),
  });
}

export function forwardMultiMessages(wxId: string, msgIds: string[], fromConvId: string, toConvId: string): SendResult {
  return sendToPhone(wxId, EnumMsgType.ForwardMultiTask, {
    WxId: Number(wxId), MsgIds: msgIds.map(Number), ConvId: Number(fromConvId), ToConvId: Number(toConvId),
  });
}

export function searchMessages(wxId: string, keyword: string, convId?: string): SendResult {
  const p: Record<string, unknown> = { WxId: Number(wxId), Keyword: keyword };
  if (convId) p.ConvId = Number(convId);
  return sendToPhone(wxId, EnumMsgType.SearchMsgTask, p);
}

export function triggerHistoryMessages(wxId: string, convId: string, count: number = 50): SendResult {
  return sendToPhone(wxId, EnumMsgType.TriggerHistoryMsgPushTask, {
    WxId: Number(wxId), ConvId: Number(convId), Count: count,
  });
}

// ============================================
// 阶段 4: 联系人
// ============================================

export function getContactInfo(wxId: string, remoteId: string): SendResult {
  return sendToPhone(wxId, EnumMsgType.GetContactInfoTask, { WxId: Number(wxId), RemoteId: Number(remoteId) });
}

export function addCustomerById(wxId: string, remoteId: string, verifyContent?: string): SendResult {
  const p: Record<string, unknown> = { WxId: Number(wxId), RemoteId: Number(remoteId) };
  if (verifyContent) p.VerifyContent = verifyContent;
  return sendToPhone(wxId, EnumMsgType.AddCustomerByIdTask, p);
}

export function addCustomerFromSearch(wxId: string, searchText: string, verifyContent?: string): SendResult {
  const p: Record<string, unknown> = { WxId: Number(wxId), SearchText: searchText };
  if (verifyContent) p.VerifyContent = verifyContent;
  return sendToPhone(wxId, EnumMsgType.AddCustomerFromSearchTask, p);
}

export function addCustomerFromWx(wxId: string, wxFriendId: string, verifyContent?: string): SendResult {
  const p: Record<string, unknown> = { WxId: Number(wxId), WxFriendId: Number(wxFriendId) };
  if (verifyContent) p.VerifyContent = verifyContent;
  return sendToPhone(wxId, EnumMsgType.AddCustomerFromWxTask, p);
}

export function deleteCustomer(wxId: string, remoteId: string): SendResult {
  // 原系统没有独立的 DelCustomerTask proto, 用通用方式
  return sendToPhone(wxId, EnumMsgType.TriggerCustomerPushTask, { WxId: Number(wxId), RemoteId: Number(remoteId) });
}

export function acceptCustomer(wxId: string, remoteId: string): SendResult {
  return sendToPhone(wxId, EnumMsgType.AcceptCustomerTask, { WxId: Number(wxId), RemoteId: Number(remoteId) });
}

export function setUserMemo(wxId: string, remoteId: string, memo: string): SendResult {
  return sendToPhone(wxId, EnumMsgType.SetUserMemoTask, { WxId: Number(wxId), RemoteId: Number(remoteId), Memo: memo });
}

export function getExtUserId(wxId: string, remoteId: string): SendResult {
  return sendToPhone(wxId, EnumMsgType.GetExtUserIdTask, { WxId: Number(wxId), RemoteId: Number(remoteId) });
}

export function sendFriendVerify(wxId: string, remoteId: string, verifyContent?: string): SendResult {
  const p: Record<string, unknown> = { WxId: Number(wxId), RemoteId: Number(remoteId) };
  if (verifyContent) p.VerifyContent = verifyContent;
  return sendToPhone(wxId, EnumMsgType.AddCustomerByIdTask, p); // 同用 AddCustomerById
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
  return sendToPhone(wxId, EnumMsgType.ChatRoomActionTask, p);
}

export function getGroupMembers(wxId: string, convId: string): SendResult {
  return sendToPhone(wxId, EnumMsgType.ChatRoomActionTask, { WxId: Number(wxId), ConvId: Number(convId), Action: -1 });
}

export function createLabel(wxId: string, labelName: string): SendResult {
  return sendToPhone(wxId, EnumMsgType.UserLabelSetTask, { WxId: Number(wxId), LabelName: labelName });
}

export function deleteLabel(wxId: string, labelId: string): SendResult {
  return sendToPhone(wxId, EnumMsgType.UserLabelDelTask, { WxId: Number(wxId), LabelId: Number(labelId) });
}

export function modifyLabel(wxId: string, labelId: string, labelName: string): SendResult {
  return sendToPhone(wxId, EnumMsgType.UserLabelModifyTask, { WxId: Number(wxId), LabelId: Number(labelId), LabelName: labelName });
}

export function setUserLabels(wxId: string, remoteId: string, labelIds: string[]): SendResult {
  return sendToPhone(wxId, EnumMsgType.UserSetLabelTask, { WxId: Number(wxId), RemoteId: Number(remoteId), LabelIds: labelIds.map(Number) });
}

export function triggerLabelSync(wxId: string): SendResult {
  return sendToPhone(wxId, EnumMsgType.TriggerUserLabelTask, { WxId: Number(wxId) });
}

export function massSend(wxId: string, convIds: string[], content: string, contentType: string = "text"): SendResult {
  return sendToPhone(wxId, EnumMsgType.QunFaTask, {
    WxId: Number(wxId), ConvIds: convIds.map(Number), ContentType: contentTypeValue(contentType), Content: Buffer.from(content),
  });
}

// ============================================
// 阶段 6: 朋友圈
// ============================================

export function postMoments(wxId: string, content: string, contentType: string = "text", mediaUrls?: string[], linkUrl?: string, linkTitle?: string, visibleList?: string[]): SendResult {
  const p: Record<string, unknown> = { WxId: Number(wxId), ContentType: contentTypeValue(contentType), Content: Buffer.from(content) };
  if (mediaUrls) p.MediaUrls = mediaUrls;
  if (linkUrl) p.LinkUrl = linkUrl;
  if (linkTitle) p.LinkTitle = linkTitle;
  if (visibleList) p.VisibleList = visibleList.map(Number);
  return sendToPhone(wxId, EnumMsgType.PostSnsTask, p);
}

export function postMomentsTask(wxId: string, taskId: string): SendResult {
  return sendToPhone(wxId, EnumMsgType.PostSnsTaskTask, { WxId: Number(wxId), TaskId: Number(taskId) });
}

export function getSnsData(wxId: string, snsId: string): SendResult {
  return sendToPhone(wxId, EnumMsgType.GetSnsDataTask, { WxId: Number(wxId), SnsId: Number(snsId) });
}

export function pullMySns(wxId: string): SendResult {
  return sendToPhone(wxId, EnumMsgType.PullMySnsListTask, { WxId: Number(wxId) });
}

export function pullSnsTaskList(wxId: string): SendResult {
  return sendToPhone(wxId, EnumMsgType.PullSnsTaskListTask, { WxId: Number(wxId) });
}

export function snsComment(wxId: string, snsId: string, content: string, replyTo?: string): SendResult {
  const p: Record<string, unknown> = { WxId: Number(wxId), SnsId: Number(snsId), Content: content };
  if (replyTo) p.ReplyTo = Number(replyTo);
  return sendToPhone(wxId, EnumMsgType.SnsCommentTask, p);
}

export function snsLike(wxId: string, snsId: string): SendResult {
  return sendToPhone(wxId, EnumMsgType.SnsLikeTask, { WxId: Number(wxId), SnsId: Number(snsId) });
}

export function deleteSns(wxId: string, snsId: string): SendResult {
  return sendToPhone(wxId, EnumMsgType.DelSnsTask, { WxId: Number(wxId), SnsId: Number(snsId) });
}

export function deleteSnsComment(wxId: string, snsId: string, commentId: string): SendResult {
  return sendToPhone(wxId, EnumMsgType.DelSnsCommentTask, { WxId: Number(wxId), SnsId: Number(snsId), CommentId: Number(commentId) });
}

// ============================================
// 设备
// ============================================

export function phoneState(wxId: string): SendResult {
  return sendToPhone(wxId, EnumMsgType.PhoneStateTask, { WxId: Number(wxId) });
}

export function pullQrCode(wxId: string): SendResult {
  return sendToPhone(wxId, EnumMsgType.PullMyQrCodeTask, { WxId: Number(wxId) });
}

export function downloadByUrl(wxId: string, url: string): SendResult {
  return sendToPhone(wxId, EnumMsgType.DownloadFileByUrlTask, { WxId: Number(wxId), Url: url });
}

export function downloadByMsgId(wxId: string, msgId: string): SendResult {
  return sendToPhone(wxId, EnumMsgType.DownloadFileByMsgIdTask, { WxId: Number(wxId), MsgId: Number(msgId) });
}

export function triggerSync(wxId: string, dataType: string): SendResult {
  const typeMap: Record<string, number> = {
    contacts: EnumMsgType.TriggerContactPushTask,
    customers: EnumMsgType.TriggerCustomerPushTask,
    conversations: EnumMsgType.TriggerConversationPushTask,
    labels: EnumMsgType.TriggerUserLabelTask,
    departments: EnumMsgType.TriggerContactPushTask,
    wx_friends: EnumMsgType.TriggerWechatFriendPushTask,
    all: EnumMsgType.TriggerAccountPushTask,
  };
  const mt = typeMap[dataType] ?? EnumMsgType.TriggerAccountPushTask;
  return sendToPhone(wxId, mt, { WxId: Number(wxId) });
}
