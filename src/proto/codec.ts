/**
 * Protobuf 编解码模块 (生产级, 兼容原手机端 SDK)
 *
 * 线路格式 (与原 Java SelfEncoder/SelfDecoder 完全一致):
 *   [4字节大端长度头] [Protobuf TransportMessage body]
 *
 * TransportMessage 内部 Content 字段使用 google.protobuf.Any:
 *   type_url = "type.googleapis.com/Im.Scrm.Ww.Proto.XxxMessage"
 *   value    = XxxMessage 的 protobuf 编码 bytes
 */

import * as protobuf from "protobufjs/minimal.js";

// 加载编译后的静态模块 — 注册到 protobuf.roots["default"]
import "./bundle.js";

// 取 Proto 命名空间
const _root = (protobuf as any).roots?.["default"] ?? {};
const Proto = _root?.Im?.Scrm?.Ww?.Proto;

if (!Proto || !Proto.TransportMessage) {
  throw new Error("[codec] Protobuf bundle 加载失败, 找不到 Im.Scrm.Ww.Proto");
}

// ============================================
// 导出核心类型引用
// ============================================

export const TransportMessage = Proto.TransportMessage;
export const EnumMsgType = Proto.EnumMsgType;
export const EnumContentType = Proto.EnumContentType;
export const EnumErrorCode = Proto.EnumErrorCode;

// ============================================
// MsgType 枚举值 → 对应的 Protobuf Message 构造器
// 手机端 SDK 发送的 Any.type_url 包含这些名称
// ============================================

const MSG_TYPE_MAP: Record<number, any> = {};

function reg(enumName: string, messageCtor: any) {
  const val = EnumMsgType[enumName];
  if (val !== undefined && messageCtor) {
    MSG_TYPE_MAP[val] = messageCtor;
  }
}

// 设备认证
reg("DeviceAuthReq", Proto.DeviceAuthReqMessage);
reg("DeviceAuthRsp", Proto.DeviceAuthRspMessage);

// 上下线
reg("WwOnlineNotice", Proto.WwOnlineNoticeMessage);
reg("WwOfflineNotice", Proto.WwOfflineNoticeMessage);

// 消息
reg("TalkToFriendTask", Proto.TalkToFriendTaskMessage);
reg("FriendTalkNotice", Proto.FriendTalkNoticeMessage);
reg("MsgRevokeTask", Proto.MsgRevokeTaskMessage);
reg("MsgRevokeNotice", Proto.MsgRevokeNoticeMessage);
reg("ForwardMsgTask", Proto.ForwardMsgTaskMessage);
reg("ForwardMultiTask", Proto.ForwardMultiTaskMessage);
reg("SearchMsgTask", Proto.SearchMsgTaskMessage);
reg("SearchMsgTaskResultNotice", Proto.SearchMsgTaskResultNoticeMessage);
reg("TriggerHistoryMsgPushTask", Proto.TriggerHistoryMsgPushTaskMessage);
reg("HistoryMsgPushNotice", Proto.HistoryMsgPushNoticeMessage);
reg("TalkToFriendTaskResultNotice", Proto.TalkToFriendTaskResultNoticeMessage);
reg("DownloadFileResultNotice", Proto.DownloadFileResultNoticeMessage);

// 联系人/客户
reg("ContactPushNotice", Proto.ContactPushNoticeMessage);
reg("GetContactInfoTask", Proto.GetContactInfoTaskMessage);
reg("GetContactInfoTaskResultNotice", Proto.GetContactInfoTaskResultNoticeMessage);
reg("CustomerPushNotice", Proto.CustomerPushNoticeMessage);
reg("CustomerAddNotice", Proto.CustomerAddNoticeMessage);
reg("CustomerDelNotice", Proto.CustomerDelNoticeMessage);
reg("NewCustomerAddedNotice", Proto.NewCustomerAddedNoticeMessage);
reg("NewCustomerPushNotice", Proto.NewCustomerPushNoticeMessage);
reg("AddCustomerByIdTask", Proto.AddCustomerByIdTaskMessage);
reg("AddCustomerFromSearchTask", Proto.AddCustomerFromSearchTaskMessage);
reg("AddCustomerFromWxTask", Proto.AddCustomerFromWxTaskMessage);
reg("AddCustomerByGroupTask", Proto.AddCustomerByGroupTaskMessage);
reg("AcceptCustomerTask", Proto.AcceptCustomerTaskMessage);
reg("SetUserMemoTask", Proto.SetUserMemoTaskMessage);
reg("GetExtUserIdTask", Proto.GetExtUserIdTaskMessage);

// 会话
reg("ConversationPushNotice", Proto.ConversationPushNoticeMessage);
reg("ConversationAddNotice", Proto.ConversationAddNoticeMessage);
reg("ConversationChangedNotice", Proto.ConversationChangedNoticeMessage);
reg("PostMessageReadNotice", Proto.PostMessageReadNoticeMessage);

// 群聊
reg("ChatRoomActionTask", Proto.ChatRoomActionTaskMessage);
reg("QunFaTask", Proto.QunFaTaskMessage);

// 标签
reg("UserLabelPushNotice", Proto.UserLabelPushNoticeMessage);
reg("UserLabelSetTask", Proto.UserLabelSetTaskMessage);
reg("UserLabelDelTask", Proto.UserLabelDelTaskMessage);
reg("UserLabelModifyTask", Proto.UserLabelModifyTaskMessage);
reg("UserLabelModifyTaskResultNotice", Proto.UserLabelModifyTaskResultNoticeMessage);
reg("UserLabelChangedNotice", Proto.UserLabelChangedNoticeMessage);
reg("UserSetLabelTask", Proto.UserSetLabelTaskMessage);

// 朋友圈
reg("PostSnsTask", Proto.PostSnsTaskMessage);
reg("PostSnsTaskTask", Proto.PostSnsTaskTaskMessage);
reg("PostSnsTaskResultNotice", Proto.PostSnsTaskResultNoticeMessage);
reg("GetSnsDataTask", Proto.GetSnsDataTaskMessage);
reg("GetSnsDataTaskResultNotice", Proto.GetSnsDataTaskResultNoticeMessage);
reg("SnsCommentTask", Proto.SnsCommentTaskMessage);
reg("SnsCommentTaskResultNotice", Proto.SnsCommentTaskResultNoticeMessage);
reg("SnsLikeTask", Proto.SnsLikeTaskMessage);
reg("DelSnsTask", Proto.DelSnsTaskMessage);
reg("DelSnsCommentTask", Proto.DelSnsCommentTaskMessage);
reg("SnsNotifyNotice", Proto.SnsNotifyNoticeMessage);
reg("PullMySnsListTask", Proto.PullMySnsListTaskMessage);
reg("PullMySnsListTaskResultNotice", Proto.PullMySnsListTaskResultNoticeMessage);
reg("PullSnsTaskListTask", Proto.PullSnsTaskListTaskMessage);
reg("PullSnsTaskListTaskResultNotice", Proto.PullSnsTaskListTaskResultNoticeMessage);

// 触发任务 (均使用 CommonTriggerTaskMessage)
reg("TriggerAccountPushTask", Proto.CommonTriggerTaskMessage);
reg("TriggerContactPushTask", Proto.CommonTriggerTaskMessage);
reg("TriggerCustomerPushTask", Proto.CommonTriggerTaskMessage);
reg("TriggerConversationPushTask", Proto.CommonTriggerTaskMessage);
reg("TriggerWechatFriendPushTask", Proto.CommonTriggerTaskMessage);
reg("TriggerHistoryMsgPushTask", Proto.TriggerHistoryMsgPushTaskMessage);
reg("TriggerMessageReadTask", Proto.CommonTriggerTaskMessage);
reg("TriggerUserLabelTask", Proto.CommonTriggerTaskMessage);
reg("TriggerNewCustomerTask", Proto.CommonTriggerTaskMessage);

// 设备
reg("PhoneStateTask", Proto.PhoneStateTaskMessage);
reg("PhoneStateTaskResultNotice", Proto.PhoneStateTaskResultNoticeMessage);
reg("PhoneStateWarningNotice", Proto.PhoneStateWarningNoticeMessage);
reg("PhoneActionTask", Proto.PhoneActionTaskMessage);
reg("PullMyQrCodeTask", Proto.PullMyQrCodeTaskMessage);
reg("PullMyQrCodeTaskResultNotice", Proto.PullMyQrCodeTaskResultNoticeMessage);
reg("DownloadFileByUrlTask", Proto.DownloadFileByUrlTaskMessage);
reg("DownloadFileByMsgIdTask", Proto.DownloadFileByMsgIdTaskMessage);

// 系统
reg("Error", Proto.ErrorMessage);
reg("TaskResultNotice", Proto.TaskResultNoticeMessage);
reg("DepartmentPushNotice", Proto.DepartmentPushNoticeMessage);
reg("CorporationPushNotice", Proto.CorporationPushNoticeMessage);
reg("AccountForceOfflineNotice", Proto.AccountForceOfflineNoticeMessage);
reg("WxFriendPushNotice", Proto.WxFriendPushNoticeMessage);
reg("RedirectNotice", Proto.RedirectNoticeMessage);

// ============================================
// 解码: 收到手机端数据 → 结构化对象
// ============================================

export interface DecodedMessage {
  id: number;
  msgType: number;
  msgTypeName: string;
  accessToken: string;
  refMessageId: number;
  content: Record<string, unknown>;
}

/**
 * 解码 Protobuf body (不含4字节头, 调用方负责剥头)
 *
 * 对应原 SelfDecoder.decodeBody():
 *   TransportMessage.getDefaultInstance().getParserForType().parseFrom(body)
 */
export function decodeTransport(bodyBuf: Uint8Array): DecodedMessage {
  const msg = TransportMessage.decode(bodyBuf);
  const msgType: number = msg.MsgType;
  const msgTypeName: string = EnumMsgType[msgType] ?? `Unknown(${msgType})`;

  // 解包 Content (google.protobuf.Any)
  let content: Record<string, unknown> = {};
  if (msg.Content && msg.Content.value && msg.Content.value.length > 0) {
    const ctor = MSG_TYPE_MAP[msgType];
    if (ctor) {
      try {
        const decoded = ctor.decode(msg.Content.value);
        content = ctor.toObject(decoded, {
          longs: String,
          bytes: String,
          defaults: true,
        });
      } catch (err) {
        content = { _decodeError: String(err), _raw: Buffer.from(msg.Content.value).toString("base64") };
      }
    } else {
      content = { _unmapped: true, _msgType: msgTypeName, _raw: Buffer.from(msg.Content.value).toString("base64") };
    }
  }

  return {
    id: toNum(msg.Id),
    msgType,
    msgTypeName,
    accessToken: msg.AccessToken ?? "",
    refMessageId: toNum(msg.RefMessageId),
    content,
  };
}

// ============================================
// 编码: 构造数据 → 发送给手机端
// ============================================

let _idCounter = Date.now();

/**
 * 编码为完整的线路数据包: [4字节大端长度头] + [TransportMessage protobuf body]
 *
 * 对应原:
 *   MessageUtil.getMessage() → 构造 TransportMessage
 *   SelfEncoder.encode()     → 4字节头 + body
 *
 * @param msgType     EnumMsgType 枚举值 (如 EnumMsgType.TalkToFriendTask = 1210)
 * @param payload     内部消息体的字段 (如 { WxId: 12345, Content: Buffer.from('hello') })
 * @param accessToken 可选, 认证token
 * @param refId       可选, 关联消息ID
 */
export function encodePacket(
  msgType: number,
  payload: Record<string, unknown> | null,
  accessToken?: string,
  refId?: number,
): Buffer {
  const id = ++_idCounter;

  const transportFields: any = {
    Id: id,
    MsgType: msgType,
    AccessToken: accessToken ?? "",
  };
  if (refId) {
    transportFields.RefMessageId = refId;
  }

  // 打包 Content
  if (payload) {
    const ctor = MSG_TYPE_MAP[msgType];
    if (ctor) {
      const innerMsg = ctor.create(payload);
      const innerBuf = ctor.encode(innerMsg).finish();
      const typeName = ctor.$type?.name ?? ctor.name ?? "";
      transportFields.Content = {
        type_url: `type.googleapis.com/Im.Scrm.Ww.Proto.${typeName}`,
        value: innerBuf,
      };
    }
  }

  const transport = TransportMessage.create(transportFields);
  const body = TransportMessage.encode(transport).finish();

  // 4字节大端长度头
  const header = Buffer.alloc(4);
  header.writeUInt32BE(body.length, 0);

  return Buffer.concat([header, Buffer.from(body)]);
}

/**
 * 编码 ACK 回复
 * 对应原 MessageUtil.sendMsg(ctx, EnumMsgType.MsgReceivedAck, token, refId, null)
 */
export function encodeAck(accessToken: string, refId: number): Buffer {
  return encodePacket(EnumMsgType.MsgReceivedAck, null, accessToken, refId);
}

/**
 * 编码错误消息
 * 对应原 MessageUtil.sendErrMsg()
 */
export function encodeError(errorCode: number, errorMsg: string, refId?: number): Buffer {
  return encodePacket(
    EnumMsgType.Error,
    { ErrorCode: errorCode, ErrorMsg: errorMsg },
    undefined,
    refId,
  );
}

/**
 * 获取内容类型枚举值
 */
export function contentTypeValue(name: string): number {
  const map: Record<string, string> = {
    text: "Text", image: "Picture", voice: "Voice", video: "Video",
    link: "Link", file: "File", namecard: "NameCard", location: "Location",
    weapp: "WeApp", emoji: "Emoji",
  };
  const enumName = map[name.toLowerCase()] ?? name;
  return EnumContentType[enumName] ?? 0;
}

// ============================================
// 辅助
// ============================================

function toNum(val: any): number {
  if (!val) return 0;
  if (typeof val === "number") return val;
  if (typeof val.toNumber === "function") return val.toNumber();
  return (val.high >>> 0) * 0x100000000 + (val.low >>> 0);
}
