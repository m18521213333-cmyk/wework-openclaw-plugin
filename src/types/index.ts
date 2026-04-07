/**
 * WeWork SCRM 类型定义
 * 从原 Java Protobuf (Im.Scrm.Ww.Proto) 映射而来
 */

// ============================================
// 传输层类型 (对应 WTransport.proto)
// ============================================

/** 消息类型枚举 - 对应 EnumMsgType */
export enum MsgType {
  // --- 设备与认证 ---
  DeviceAuthReq = 1,
  DeviceAuthRsp = 2,
  HeartBeatReq = 3,
  MsgReceivedAck = 4,

  // --- 好友消息 ---
  TalkToFriendTask = 100,           // 发送消息给好友
  TalkToFriendTaskResultNotice = 101,
  FriendTalkNotice = 102,           // 收到好友消息
  MsgRevokeTask = 103,              // 撤回消息
  MsgRevokeNotice = 104,
  ForwardMsgTask = 105,             // 转发消息
  ForwardMultiTask = 106,           // 合并转发
  SearchMsgTask = 107,              // 搜索消息
  SearchMsgTaskResultNotice = 108,

  // --- 联系人与客户 ---
  ContactPushNotice = 200,          // 联系人推送
  GetContactInfoTask = 201,         // 获取联系人信息
  GetContactInfoTaskResultNotice = 202,
  CustomerPushNotice = 203,         // 客户推送
  CustomerAddNotice = 204,          // 新客户添加
  CustomerDelNotice = 205,          // 客户删除
  NewCustomerAddedNotice = 206,
  NewCustomerPushNotice = 207,
  AddCustomerByIdTask = 208,        // 通过ID添加
  AddCustomerFromSearchTask = 209,  // 通过搜索添加
  AddCustomerFromWxTask = 210,      // 通过微信添加
  AddCustomerByGroupTask = 211,     // 通过群添加
  AcceptCustomerTask = 212,         // 接受好友
  DelCustomerTask = 213,            // 删除客户
  SetUserMemoTask = 214,            // 设置备注
  GetExtUserIdTask = 215,
  SendFriendVerifyTask = 216,

  // --- 会话 ---
  ConversationPushNotice = 300,
  ConversationAddNotice = 301,
  ConversationChangedNotice = 302,
  GetConversationInfoTask = 303,
  TriggerMessageReadTask = 304,
  PostMessageReadNotice = 305,
  TriggerHistoryMsgPushTask = 306,  // 获取历史消息
  HistoryMsgPushNotice = 307,

  // --- 群聊 ---
  ChatRoomActionTask = 400,         // 群操作
  GroupMemberPushNotice = 401,
  GroupMemberAddNotice = 402,
  GroupMemberDelNotice = 403,
  GetGroupMemberTask = 404,
  QunFaTask = 405,                  // 群发

  // --- 标签 ---
  UserLabelPushNotice = 500,
  UserLabelSetTask = 501,           // 创建标签
  UserLabelDelTask = 502,           // 删除标签
  UserLabelModifyTask = 503,        // 修改标签
  UserLabelModifyTaskResultNotice = 504,
  UserLabelChangedNotice = 505,
  UserSetLabelTask = 506,           // 给用户打标签

  // --- 朋友圈 ---
  PostSnsTask = 600,                // 发朋友圈
  PostSnsTaskResultNotice = 601,
  GetSnsDataTask = 602,             // 获取朋友圈数据
  GetSnsDataTaskResultNotice = 603,
  SnsCommentTask = 604,             // 评论
  SnsCommentTaskResultNotice = 605,
  SnsLikeTask = 606,                // 点赞
  DelSnsTask = 607,                 // 删除朋友圈
  DelSnsCommentTask = 608,          // 删除评论
  SnsNotifyNotice = 609,
  PullMySnsListTask = 610,
  PullMySnsListTaskResultNotice = 611,
  PullSnsTaskListTask = 612,
  PullSnsTaskListTaskResultNotice = 613,
  SnsMsgNotice = 614,

  // --- 设备与系统 ---
  WwOnlineNotice = 700,             // 上线通知
  WwOfflineNotice = 701,            // 下线通知
  PhoneStateTask = 702,
  PhoneStateTaskResultNotice = 703,
  PhoneStateWarningNotice = 704,
  PhoneActionTask = 705,
  DownloadFileByUrlTask = 706,
  DownloadFileByMsgIdTask = 707,
  DownloadFileResultNotice = 708,
  PullMyQrCodeTask = 709,
  PullMyQrCodeTaskResultNotice = 710,
  DepartmentPushNotice = 711,
  CorporationPushNotice = 712,
  AccountForceOfflineNotice = 713,
  UpgradeDeviceAppNotice = 714,
  TaskResultNotice = 798,            // 通用任务结果通知
  ErrorNotice = 799,

  // --- 其他 ---
  VoiceTransTextTask = 800,
  VoiceTextNotice = 801,
  ConfigPushNotice = 900,
  RedirectNotice = 901,
  WxFriendPushNotice = 902,
  OneWayCustomerPushNotice = 903,
  ShareCustomerPushNotice = 904,
  SavedConvListPushNotice = 905,
  CustomerGroupPushNotice = 906,
  TopMsgPushNotice = 907,
  SetTopMsgTask = 908,
  GetTopMsgTask = 909,
  AddEmojiTask = 910,
  AddEmojiTaskResultNotice = 911,
  RunFunCardTask = 912,
  AddShareCustomerTask = 913,
  DaKaTask = 914,
  JoinGroupInviteTask = 915,
  PostDeviceInfoNotice = 916,
  CommonTriggerTask = 917,
  ConfigSetting = 918,
}

/** 内容类型枚举 - 对应 EnumContentType */
export enum ContentType {
  Text = 0,
  Image = 1,
  Voice = 2,
  Video = 3,
  Link = 4,
  File = 5,
  WeApp = 6,       // 小程序
  Location = 7,
  NameCard = 8,    // 名片
  Emoji = 9,
}

/** 错误码枚举 - 对应 EnumErrorCode */
export enum ErrorCode {
  Success = 0,
  InvalidParam = 1,
  InvalidDevice = 2,
  NotOnline = 3,
  AuthFailed = 4,
  NoPermission = 5,
}

// ============================================
// 传输消息结构 (对应 TransportMessage)
// ============================================

export interface TransportMessage {
  MsgType: MsgType;
  Content: unknown;
  AccessToken?: string;
  Id?: number;
}

// ============================================
// 消息相关类型
// ============================================

/** 发送消息 - 对应 TalkToFriendTaskMessage */
export interface TalkToFriendTask {
  WxId: number;
  ConvId: number;
  ContentType: ContentType;
  Content: string;
  AtList?: number[];     // @的用户列表
  TaskId?: number;
}

/** 收到消息 - 对应 FriendTalkNoticeMessage */
export interface FriendTalkNotice {
  WxId: number;
  ConvId: number;
  SenderId: number;
  SenderName: string;
  ContentType: ContentType;
  Content: string;       // 原为 ByteString，这里转为 string
  MsgId: number;
  MsgRemoteId: number;
  CreateTime: number;
  RefId?: number;
}

/** 撤回消息 */
export interface MsgRevokeTask {
  WxId: number;
  MsgId: number;
  ConvId: number;
  TaskId?: number;
}

/** 转发消息 */
export interface ForwardMsgTask {
  WxId: number;
  MsgId: number;
  ConvId: number;
  ToConvId: number;
  TaskId?: number;
}

/** 搜索消息 */
export interface SearchMsgTask {
  WxId: number;
  ConvId: number;
  Keyword: string;
  TaskId?: number;
}

// ============================================
// 联系人与客户类型
// ============================================

/** 联系人信息 */
export interface ContactInfo {
  WxId: number;
  RemoteId: number;
  NickName: string;
  Avatar: string;
  Gender: number;
  Phone?: string;
  Email?: string;
  Corp?: string;         // 所属企业
  Department?: string;
  Position?: string;
  LabelIds?: number[];
}

/** 添加客户(通过ID) */
export interface AddCustomerByIdTask {
  WxId: number;
  RemoteId: number;
  VerifyContent?: string;
  TaskId?: number;
}

/** 添加客户(通过搜索) */
export interface AddCustomerFromSearchTask {
  WxId: number;
  SearchText: string;
  VerifyContent?: string;
  TaskId?: number;
}

/** 接受好友 */
export interface AcceptCustomerTask {
  WxId: number;
  RemoteId: number;
  TaskId?: number;
}

/** 设置备注 */
export interface SetUserMemoTask {
  WxId: number;
  RemoteId: number;
  Memo: string;
  TaskId?: number;
}

// ============================================
// 群聊类型
// ============================================

/** 群聊操作类型 - 对应 EnumChatRoomAction */
export enum ChatRoomAction {
  CreateRoom = 0,
  AddMember = 1,
  RemoveMember = 2,
  SetRoomName = 3,
  SetRoomNotice = 4,
  QuitRoom = 5,
}

/** 群聊操作 */
export interface ChatRoomActionTask {
  WxId?: number;
  ConvId?: number;
  Members: number[];
  Action: ChatRoomAction;
  Content?: string;      // 群名/群公告
  TaskId?: number;
}

/** 群发消息 */
export interface QunFaTask {
  WxId: number;
  ConvIds: number[];     // 目标会话列表
  ContentType: ContentType;
  Content: string;
  TaskId?: number;
}

// ============================================
// 标签类型
// ============================================

/** 创建/修改标签 */
export interface UserLabelTask {
  WxId: number;
  LabelId?: number;
  LabelName: string;
  TaskId?: number;
}

/** 给用户打标签 */
export interface UserSetLabelTask {
  WxId: number;
  RemoteId: number;
  LabelIds: number[];
  TaskId?: number;
}

// ============================================
// 朋友圈类型
// ============================================

/** 发朋友圈 */
export interface PostSnsTask {
  WxId: number;
  ContentType: ContentType;
  Content: string;
  MediaUrls?: string[];   // 图片/视频URL
  LinkUrl?: string;        // 链接
  LinkTitle?: string;
  VisibleList?: number[];  // 可见列表
  TaskId?: number;
}

/** 朋友圈互动(评论/点赞) */
export interface SnsInteractTask {
  WxId: number;
  SnsId: number;
  Content?: string;       // 评论内容(点赞时为空)
  ReplyTo?: number;       // 回复某条评论
  TaskId?: number;
}

// ============================================
// 设备与连接类型
// ============================================

/** 设备认证请求 */
export interface DeviceAuthReq {
  DeviceId: string;
  DeviceName: string;
  Token: string;
  WxId?: number;
}

/** 设备认证响应 */
export interface DeviceAuthRsp {
  Code: ErrorCode;
  Msg: string;
}

/** 在线连接信息 */
export interface ConnectionInfo {
  wxId: string;
  deviceId: string;
  connectedAt: Date;
  lastHeartbeat: Date;
  ws: unknown;           // WebSocket 实例引用
}

// ============================================
// 插件配置类型
// ============================================

export interface PluginConfig {
  websocket: {
    port: number;
    host: string;
  };
  storage: {
    type: "sqlite" | "mysql";
    sqlitePath: string;
    mysqlUrl?: string;
  };
  redis: {
    enabled: boolean;
    url: string;
  };
  dify: {
    enabled: boolean;
    apiUrl?: string;
    apiKey?: string;
  };
  autoReply: {
    enabled: boolean;
    timeRange: string;
  };
}
