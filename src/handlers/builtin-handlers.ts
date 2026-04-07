/**
 * 内置消息处理器 (生产级)
 *
 * 处理手机端 SDK 发来的各种通知/请求，维护连接状态。
 * 每个处理器的逻辑完全复刻原 Java handler/socket/ 下的对应类。
 */

import { EnumMsgType, EnumErrorCode } from "../proto/codec.js";
import type { WeWorkServer } from "../services/websocket-service.js";
import type { MessageRouter, InternalMessage } from "../services/message-router.js";

type Logger = {
  info: (message: string) => void;
  error: (message: string) => void;
};

/** 从 content 兼容取值 */
function f(msg: InternalMessage, key: string): unknown {
  return msg.content?.[key];
}

export function registerBuiltinHandlers(
  router: MessageRouter,
  server: WeWorkServer,
  logger: Logger,
): void {

  // === 设备认证 (DeviceAuthReqHandler) ===
  router.registerHandler(EnumMsgType.DeviceAuthReq, (msg) => {
    const credential = String(f(msg, "Credential") ?? "");
    const authType = f(msg, "AuthType") ?? 0;

    if (!credential) {
      server.sendError(msg.source, EnumErrorCode.InvalidParam, "参数传入错误", msg.id);
      return;
    }
    if (authType !== 1) { // DeviceCode
      server.sendError(msg.source, EnumErrorCode.InvalidParam, "认证方式不支持", msg.id);
      return;
    }

    logger.info(`[Auth] 设备认证: IMEI=${credential}`);
    server.connections.registerDevice(credential, msg.source);

    // 回复 DeviceAuthRsp
    const token = server.connections.getMeta(msg.source)?.deviceId ?? credential;
    server.sendToDevice(credential, EnumMsgType.DeviceAuthRsp, {
      AccessToken: token,
      Extra: { SupplierId: 0, SupplierName: "", AccountType: 2 },
    }, undefined, msg.id);
    // 注: 实际部署时这里应该查数据库验证设备合法性
  });

  // === 心跳 (HeartBeatReqHandler) ===
  router.registerHandler(EnumMsgType.HeartBeatReq, (msg) => {
    server.connections.updateHeartbeat(msg.source);
    server.sendAck(msg.source, msg.accessToken, msg.id);
  });

  // === 上线通知 (WwOnlineNoticeHandler) ===
  router.registerHandler(EnumMsgType.WwOnlineNotice, (msg) => {
    const wxId = String(f(msg, "WxId") ?? "");
    const name = String(f(msg, "Name") ?? "");
    const imei = String(f(msg, "IMEI") ?? "");

    if (!wxId || wxId === "0") {
      logger.error("[Online] 上线通知缺少 WxId");
      return;
    }

    server.connections.registerUser(wxId, msg.source);
    logger.info(`[Online] 企业微信上线: wxId=${wxId} name=${name} imei=${imei}`);

    router.emit("wework:online", { wxId, name, imei });
    server.sendAck(msg.source, msg.accessToken, msg.id);
  });

  // === 下线通知 (WwOfflineNoticeHandler) ===
  router.registerHandler(EnumMsgType.WwOfflineNotice, (msg) => {
    const wxId = String(f(msg, "WxId") ?? "");
    logger.info(`[Offline] 企业微信下线: wxId=${wxId}`);
    router.emit("wework:offline", { wxId });
  });

  // === 消息确认 ===
  router.registerHandler(EnumMsgType.MsgReceivedAck, () => { /* noop */ });

  // === 好友消息 (FriendTalkNoticeHandler) — 核心 ===
  router.registerHandler(EnumMsgType.FriendTalkNotice, (msg) => {
    const wxId = String(f(msg, "WxId") ?? "");
    const senderId = String(f(msg, "SenderId") ?? "");
    const senderName = String(f(msg, "SenderName") ?? "");
    const convId = String(f(msg, "ConvId") ?? "");
    const contentType = Number(f(msg, "ContentType") ?? 0);
    // Content 在 proto 中是 bytes，codec 已转为 base64 string
    const contentRaw = f(msg, "Content");
    const content = typeof contentRaw === "string"
      ? Buffer.from(contentRaw, "base64").toString("utf-8")
      : String(contentRaw ?? "");

    logger.info(`[Message] wxId=${wxId} from=${senderName}(${senderId}) conv=${convId} type=${contentType}`);

    router.emit("wework:message", {
      wxId, senderId, senderName, convId, content, contentType,
      msgId: f(msg, "MsgId"), msgRemoteId: f(msg, "MsgRemoteId"),
      createTime: f(msg, "CreateTime"),
    });

    server.sendAck(msg.source, msg.accessToken, msg.id);
  });

  // === 自己发送的消息回执 ===
  router.registerHandler(EnumMsgType.TalkToFriendTaskResultNotice, (msg) => {
    router.emit("wework:send-result", { raw: msg });
  });

  // === 撤回通知 ===
  router.registerHandler(EnumMsgType.MsgRevokeNotice, (msg) => {
    router.emit("wework:message-revoked", { raw: msg });
    server.sendAck(msg.source, msg.accessToken, msg.id);
  });

  // === 搜索结果 ===
  router.registerHandler(EnumMsgType.SearchMsgTaskResultNotice, (msg) => {
    router.emit("wework:search-result", { raw: msg });
    server.sendAck(msg.source, msg.accessToken, msg.id);
  });

  // === 历史消息推送 ===
  router.registerHandler(EnumMsgType.HistoryMsgPushNotice, (msg) => {
    router.emit("wework:history-messages", { raw: msg });
    server.sendAck(msg.source, msg.accessToken, msg.id);
  });

  // === 已读回执 ===
  router.registerHandler(EnumMsgType.PostMessageReadNotice, (msg) => {
    router.emit("wework:message-read", { raw: msg });
    server.sendAck(msg.source, msg.accessToken, msg.id);
  });

  // === 联系人/客户通知 ===
  for (const [mt, event] of [
    [EnumMsgType.ContactPushNotice, "wework:contact-push"],
    [EnumMsgType.GetContactInfoTaskResultNotice, "wework:contact-info"],
    [EnumMsgType.CustomerPushNotice, "wework:customer-push"],
    [EnumMsgType.CustomerAddNotice, "wework:customer-added"],
    [EnumMsgType.CustomerDelNotice, "wework:customer-deleted"],
    [EnumMsgType.NewCustomerAddedNotice, "wework:new-customer-changed"],
    [EnumMsgType.NewCustomerPushNotice, "wework:new-customer-push"],
    [EnumMsgType.WxFriendPushNotice, "wework:wx-friend-push"],
  ] as [number, string][]) {
    router.registerHandler(mt, (msg) => {
      const wxId = String(f(msg, "WxId") ?? "");
      router.emit(event, { wxId, raw: msg });
      server.sendAck(msg.source, msg.accessToken, msg.id);
    });
  }

  // === 标签通知 ===
  for (const [mt, event] of [
    [EnumMsgType.UserLabelPushNotice, "wework:label-push"],
    [EnumMsgType.UserLabelChangedNotice, "wework:label-changed"],
    [EnumMsgType.UserLabelModifyTaskResultNotice, "wework:label-modify-result"],
  ] as [number, string][]) {
    router.registerHandler(mt, (msg) => {
      router.emit(event, { raw: msg });
      server.sendAck(msg.source, msg.accessToken, msg.id);
    });
  }

  // === 会话/群聊通知 ===
  for (const [mt, event] of [
    [EnumMsgType.ConversationPushNotice, "wework:conversation-push"],
    [EnumMsgType.ConversationAddNotice, "wework:conversation-added"],
    [EnumMsgType.ConversationChangedNotice, "wework:conversation-changed"],
    [EnumMsgType.GroupMemberPushNotice, "wework:group-members"],
    [EnumMsgType.GroupMemberAddNotice, "wework:group-member-added"],
    [EnumMsgType.GroupMemberDelNotice, "wework:group-member-removed"],
  ] as [number, string][]) {
    router.registerHandler(mt, (msg) => {
      router.emit(event, { raw: msg });
      server.sendAck(msg.source, msg.accessToken, msg.id);
    });
  }

  // === 朋友圈通知 ===
  for (const [mt, event] of [
    [EnumMsgType.PostSnsTaskResultNotice, "wework:sns-post-result"],
    [EnumMsgType.GetSnsDataTaskResultNotice, "wework:sns-data"],
    [EnumMsgType.SnsCommentTaskResultNotice, "wework:sns-comment-result"],
    [EnumMsgType.SnsNotifyNotice, "wework:sns-notify"],
    [EnumMsgType.PullMySnsListTaskResultNotice, "wework:sns-my-list"],
    [EnumMsgType.PullSnsTaskListTaskResultNotice, "wework:sns-task-list"],
  ] as [number, string][]) {
    router.registerHandler(mt, (msg) => {
      router.emit(event, { raw: msg });
      server.sendAck(msg.source, msg.accessToken, msg.id);
    });
  }

  // === 设备/系统通知 ===
  for (const [mt, event] of [
    [EnumMsgType.PhoneStateTaskResultNotice, "wework:phone-state"],
    [EnumMsgType.PhoneStateWarningNotice, "wework:phone-warning"],
    [EnumMsgType.PullMyQrCodeTaskResultNotice, "wework:qrcode"],
    [EnumMsgType.DownloadFileResultNotice, "wework:file-downloaded"],
    [EnumMsgType.DepartmentPushNotice, "wework:department-push"],
    [EnumMsgType.CorporationPushNotice, "wework:corporation-push"],
    [EnumMsgType.AccountForceOfflineNotice, "wework:force-offline"],
    [EnumMsgType.TaskResultNotice, "wework:task-result"],
  ] as [number, string][]) {
    router.registerHandler(mt, (msg) => {
      router.emit(event, { raw: msg });
      server.sendAck(msg.source, msg.accessToken, msg.id);
    });
  }

  // === 错误 ===
  router.registerHandler(EnumMsgType.Error, (msg) => {
    logger.error(`[Error] ${JSON.stringify(msg.content)}`);
  });

  const total = [6, 8, 3, 6, 6, 8, 1].reduce((a, b) => a + b, 0); // 核心+联系人+标签+会话群+朋友圈+设备+错误
  logger.info(`[Handlers] 内置处理器注册完成 (${total}个)`);
}
