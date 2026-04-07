import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace Im. */
export namespace Im {

    /** Namespace Scrm. */
    namespace Scrm {

        /** Namespace Ww. */
        namespace Ww {

            /** Namespace Proto. */
            namespace Proto {

                /** Properties of an AcceptCustomerTaskMessage. */
                interface IAcceptCustomerTaskMessage {

                    /** AcceptCustomerTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** AcceptCustomerTaskMessage RemoteId */
                    RemoteId?: (number|Long|null);

                    /** AcceptCustomerTaskMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents an AcceptCustomerTaskMessage. */
                class AcceptCustomerTaskMessage implements IAcceptCustomerTaskMessage {

                    /**
                     * Constructs a new AcceptCustomerTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IAcceptCustomerTaskMessage);

                    /** AcceptCustomerTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** AcceptCustomerTaskMessage RemoteId. */
                    public RemoteId: (number|Long);

                    /** AcceptCustomerTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new AcceptCustomerTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns AcceptCustomerTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IAcceptCustomerTaskMessage): Im.Scrm.Ww.Proto.AcceptCustomerTaskMessage;

                    /**
                     * Encodes the specified AcceptCustomerTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.AcceptCustomerTaskMessage.verify|verify} messages.
                     * @param message AcceptCustomerTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IAcceptCustomerTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified AcceptCustomerTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.AcceptCustomerTaskMessage.verify|verify} messages.
                     * @param message AcceptCustomerTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IAcceptCustomerTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an AcceptCustomerTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns AcceptCustomerTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.AcceptCustomerTaskMessage;

                    /**
                     * Decodes an AcceptCustomerTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns AcceptCustomerTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.AcceptCustomerTaskMessage;

                    /**
                     * Verifies an AcceptCustomerTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an AcceptCustomerTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns AcceptCustomerTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.AcceptCustomerTaskMessage;

                    /**
                     * Creates a plain object from an AcceptCustomerTaskMessage message. Also converts values to other types if specified.
                     * @param message AcceptCustomerTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.AcceptCustomerTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this AcceptCustomerTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for AcceptCustomerTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of an AccountForceOfflineNoticeMessage. */
                interface IAccountForceOfflineNoticeMessage {

                    /** AccountForceOfflineNoticeMessage Reason */
                    Reason?: (Im.Scrm.Ww.Proto.EnumForceOfflineReason|null);

                    /** AccountForceOfflineNoticeMessage Message */
                    Message?: (string|null);

                    /** AccountForceOfflineNoticeMessage WxId */
                    WxId?: (number|Long|null);
                }

                /** Represents an AccountForceOfflineNoticeMessage. */
                class AccountForceOfflineNoticeMessage implements IAccountForceOfflineNoticeMessage {

                    /**
                     * Constructs a new AccountForceOfflineNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IAccountForceOfflineNoticeMessage);

                    /** AccountForceOfflineNoticeMessage Reason. */
                    public Reason: Im.Scrm.Ww.Proto.EnumForceOfflineReason;

                    /** AccountForceOfflineNoticeMessage Message. */
                    public Message: string;

                    /** AccountForceOfflineNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /**
                     * Creates a new AccountForceOfflineNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns AccountForceOfflineNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IAccountForceOfflineNoticeMessage): Im.Scrm.Ww.Proto.AccountForceOfflineNoticeMessage;

                    /**
                     * Encodes the specified AccountForceOfflineNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.AccountForceOfflineNoticeMessage.verify|verify} messages.
                     * @param message AccountForceOfflineNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IAccountForceOfflineNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified AccountForceOfflineNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.AccountForceOfflineNoticeMessage.verify|verify} messages.
                     * @param message AccountForceOfflineNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IAccountForceOfflineNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an AccountForceOfflineNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns AccountForceOfflineNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.AccountForceOfflineNoticeMessage;

                    /**
                     * Decodes an AccountForceOfflineNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns AccountForceOfflineNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.AccountForceOfflineNoticeMessage;

                    /**
                     * Verifies an AccountForceOfflineNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an AccountForceOfflineNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns AccountForceOfflineNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.AccountForceOfflineNoticeMessage;

                    /**
                     * Creates a plain object from an AccountForceOfflineNoticeMessage message. Also converts values to other types if specified.
                     * @param message AccountForceOfflineNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.AccountForceOfflineNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this AccountForceOfflineNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for AccountForceOfflineNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a TransportMessage. */
                interface ITransportMessage {

                    /** TransportMessage Id */
                    Id?: (number|Long|null);

                    /** TransportMessage AccessToken */
                    AccessToken?: (string|null);

                    /** TransportMessage MsgType */
                    MsgType?: (Im.Scrm.Ww.Proto.EnumMsgType|null);

                    /** TransportMessage Content */
                    Content?: (google.protobuf.IAny|null);

                    /** TransportMessage RefMessageId */
                    RefMessageId?: (number|Long|null);
                }

                /** Represents a TransportMessage. */
                class TransportMessage implements ITransportMessage {

                    /**
                     * Constructs a new TransportMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ITransportMessage);

                    /** TransportMessage Id. */
                    public Id: (number|Long);

                    /** TransportMessage AccessToken. */
                    public AccessToken: string;

                    /** TransportMessage MsgType. */
                    public MsgType: Im.Scrm.Ww.Proto.EnumMsgType;

                    /** TransportMessage Content. */
                    public Content?: (google.protobuf.IAny|null);

                    /** TransportMessage RefMessageId. */
                    public RefMessageId: (number|Long);

                    /**
                     * Creates a new TransportMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns TransportMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ITransportMessage): Im.Scrm.Ww.Proto.TransportMessage;

                    /**
                     * Encodes the specified TransportMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.TransportMessage.verify|verify} messages.
                     * @param message TransportMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ITransportMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified TransportMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.TransportMessage.verify|verify} messages.
                     * @param message TransportMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ITransportMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a TransportMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns TransportMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.TransportMessage;

                    /**
                     * Decodes a TransportMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns TransportMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.TransportMessage;

                    /**
                     * Verifies a TransportMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a TransportMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns TransportMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.TransportMessage;

                    /**
                     * Creates a plain object from a TransportMessage message. Also converts values to other types if specified.
                     * @param message TransportMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.TransportMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this TransportMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for TransportMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** EnumMsgType enum. */
                enum EnumMsgType {
                    UnknownMsg = 0,
                    HeartBeatReq = 1001,
                    MsgReceivedAck = 1002,
                    Error = 1003,
                    DeviceAuthReq = 1010,
                    DeviceAuthRsp = 1011,
                    DeviceExitNotice = 1012,
                    AccountForceOfflineNotice = 1013,
                    RedirectNotice = 1015,
                    UpgradeDeviceAppNotice = 1016,
                    PhoneActionTask = 1020,
                    WwOnlineNotice = 1100,
                    WwOfflineNotice = 1101,
                    ContactPushNotice = 1105,
                    DepartmentPushNotice = 1106,
                    CustomerPushNotice = 1107,
                    UserLabelPushNotice = 1108,
                    CorporationPushNotice = 1109,
                    ConversationPushNotice = 1110,
                    NewCustomerPushNotice = 1111,
                    NewCustomerAddedNotice = 1112,
                    CustomerAddNotice = 1113,
                    CustomerDelNotice = 1114,
                    UserLabelChangedNotice = 1115,
                    DepartmentChangedNotice = 1116,
                    ConversationAddNotice = 1117,
                    WxFriendPushNotice = 1118,
                    PostMessageReadNotice = 1119,
                    FriendTalkNotice = 1120,
                    TalkToFriendNotice = 1121,
                    TaskResultNotice = 1122,
                    TalkToFriendTaskResultNotice = 1123,
                    DownloadFileResultNotice = 1124,
                    PullMyQrCodeTaskResultNotice = 1125,
                    ConversationChangedNotice = 1126,
                    HistoryMsgPushNotice = 1127,
                    PullMySnsListTaskResultNotice = 1128,
                    PullSnsTaskListTaskResultNotice = 1129,
                    PostSnsTaskResultNotice = 1130,
                    SnsCommentTaskResultNotice = 1131,
                    GetSnsDataTaskResultNotice = 1132,
                    SnsNotifyNotice = 1133,
                    UserLabelModifyTaskResultNotice = 1134,
                    GetContactInfoTaskResultNotice = 1135,
                    PhoneStateTaskResultNotice = 1136,
                    PhoneStateWarningNotice = 1137,
                    MsgRevokeNotice = 1138,
                    SearchMsgTaskResultNotice = 1139,
                    TriggerAccountPushTask = 1200,
                    TriggerContactPushTask = 1201,
                    TriggerCustomerPushTask = 1202,
                    TriggerConversationPushTask = 1203,
                    TriggerWechatFriendPushTask = 1204,
                    TriggerHistoryMsgPushTask = 1205,
                    TriggerMessageReadTask = 1206,
                    TriggerUserLabelTask = 1207,
                    TriggerNewCustomerTask = 1208,
                    TalkToFriendTask = 1210,
                    DownloadFileByUrlTask = 1211,
                    DownloadFileByMsgIdTask = 1212,
                    AddCustomerFromWxTask = 1214,
                    AddCustomerFromSearchTask = 1215,
                    PullMyQrCodeTask = 1216,
                    ChatRoomActionTask = 1217,
                    PullMySnsListTask = 1218,
                    PullSnsTaskListTask = 1219,
                    PostSnsTask = 1220,
                    PostSnsTaskTask = 1221,
                    SnsLikeTask = 1222,
                    SnsCommentTask = 1223,
                    DelSnsTask = 1224,
                    DelSnsCommentTask = 1225,
                    GetSnsDataTask = 1226,
                    UserLabelDelTask = 1227,
                    UserLabelModifyTask = 1228,
                    UserLabelSetTask = 1229,
                    AddCustomerByIdTask = 1230,
                    GetContactInfoTask = 1231,
                    AcceptCustomerTask = 1232,
                    UserSetLabelTask = 1233,
                    SetUserMemoTask = 1234,
                    PhoneStateTask = 1235,
                    MsgRevokeTask = 1236,
                    SearchMsgTask = 1237,
                    AddCustomerByGroupTask = 1238,
                    ForwardMsgTask = 1239,
                    ForwardMultiTask = 1240
                }

                /** EnumErrorCode enum. */
                enum EnumErrorCode {
                    Success = 0,
                    NoRight = 1001,
                    InvalidParam = 1002,
                    InternalError = 1003,
                    TargetNotOnline = 1004,
                    InfoNotExists = 1005
                }

                /** EnumGender enum. */
                enum EnumGender {
                    UnknownGender = 0,
                    Male = 1,
                    Female = 2
                }

                /** EnumContentType enum. */
                enum EnumContentType {
                    UnknownContent = 0,
                    Text = 1,
                    Picture = 2,
                    Voice = 3,
                    Video = 4,
                    System = 5,
                    Link = 6,
                    LinkExt = 7,
                    File = 8,
                    NameCard = 9,
                    Location = 10,
                    LuckyMoney = 11,
                    MoneyTrans = 12,
                    WeApp = 13,
                    Emoji = 14,
                    RoomManage = 15,
                    Sys_LuckyMoney = 16,
                    RoomSystem = 17,
                    BizLink = 18,
                    AudioCall = 19,
                    VideoCall = 20,
                    NotifyMsg = 21,
                    QuoteMsg = 22,
                    ForwardMsg = 23,
                    SnsNotify = 24,
                    UnSupport = 99
                }

                /** EnumOnlineState enum. */
                enum EnumOnlineState {
                    UnknownState = 0,
                    Online = 1,
                    Offline = 2
                }

                /** EnumAccountType enum. */
                enum EnumAccountType {
                    UnknownAccountType = 0,
                    Main = 1,
                    SubUser = 2
                }

                /** EnumSendStatus enum. */
                enum EnumSendStatus {
                    NoAction = 0,
                    Sending = 1,
                    SendSuccess = 17,
                    SendError = 16
                }

                /** EnumForceOfflineReason enum. */
                enum EnumForceOfflineReason {
                    NoReason = 0,
                    TickedByOther = 1,
                    ByReAlloc = 2,
                    ServiceExpired = 3
                }

                /** Properties of an AddCustomerByGroupTaskMessage. */
                interface IAddCustomerByGroupTaskMessage {

                    /** AddCustomerByGroupTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** AddCustomerByGroupTaskMessage GroupId */
                    GroupId?: (number|Long|null);

                    /** AddCustomerByGroupTaskMessage RemoteId */
                    RemoteId?: (number|Long|null);

                    /** AddCustomerByGroupTaskMessage Msg */
                    Msg?: (string|null);

                    /** AddCustomerByGroupTaskMessage Memo */
                    Memo?: (string|null);

                    /** AddCustomerByGroupTaskMessage Labels */
                    Labels?: (string[]|null);

                    /** AddCustomerByGroupTaskMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents an AddCustomerByGroupTaskMessage. */
                class AddCustomerByGroupTaskMessage implements IAddCustomerByGroupTaskMessage {

                    /**
                     * Constructs a new AddCustomerByGroupTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IAddCustomerByGroupTaskMessage);

                    /** AddCustomerByGroupTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** AddCustomerByGroupTaskMessage GroupId. */
                    public GroupId: (number|Long);

                    /** AddCustomerByGroupTaskMessage RemoteId. */
                    public RemoteId: (number|Long);

                    /** AddCustomerByGroupTaskMessage Msg. */
                    public Msg: string;

                    /** AddCustomerByGroupTaskMessage Memo. */
                    public Memo: string;

                    /** AddCustomerByGroupTaskMessage Labels. */
                    public Labels: string[];

                    /** AddCustomerByGroupTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new AddCustomerByGroupTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns AddCustomerByGroupTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IAddCustomerByGroupTaskMessage): Im.Scrm.Ww.Proto.AddCustomerByGroupTaskMessage;

                    /**
                     * Encodes the specified AddCustomerByGroupTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.AddCustomerByGroupTaskMessage.verify|verify} messages.
                     * @param message AddCustomerByGroupTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IAddCustomerByGroupTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified AddCustomerByGroupTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.AddCustomerByGroupTaskMessage.verify|verify} messages.
                     * @param message AddCustomerByGroupTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IAddCustomerByGroupTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an AddCustomerByGroupTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns AddCustomerByGroupTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.AddCustomerByGroupTaskMessage;

                    /**
                     * Decodes an AddCustomerByGroupTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns AddCustomerByGroupTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.AddCustomerByGroupTaskMessage;

                    /**
                     * Verifies an AddCustomerByGroupTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an AddCustomerByGroupTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns AddCustomerByGroupTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.AddCustomerByGroupTaskMessage;

                    /**
                     * Creates a plain object from an AddCustomerByGroupTaskMessage message. Also converts values to other types if specified.
                     * @param message AddCustomerByGroupTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.AddCustomerByGroupTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this AddCustomerByGroupTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for AddCustomerByGroupTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of an AddCustomerByIdTaskMessage. */
                interface IAddCustomerByIdTaskMessage {

                    /** AddCustomerByIdTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** AddCustomerByIdTaskMessage Ids */
                    Ids?: (string[]|null);

                    /** AddCustomerByIdTaskMessage Msg */
                    Msg?: (string|null);

                    /** AddCustomerByIdTaskMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents an AddCustomerByIdTaskMessage. */
                class AddCustomerByIdTaskMessage implements IAddCustomerByIdTaskMessage {

                    /**
                     * Constructs a new AddCustomerByIdTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IAddCustomerByIdTaskMessage);

                    /** AddCustomerByIdTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** AddCustomerByIdTaskMessage Ids. */
                    public Ids: string[];

                    /** AddCustomerByIdTaskMessage Msg. */
                    public Msg: string;

                    /** AddCustomerByIdTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new AddCustomerByIdTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns AddCustomerByIdTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IAddCustomerByIdTaskMessage): Im.Scrm.Ww.Proto.AddCustomerByIdTaskMessage;

                    /**
                     * Encodes the specified AddCustomerByIdTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.AddCustomerByIdTaskMessage.verify|verify} messages.
                     * @param message AddCustomerByIdTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IAddCustomerByIdTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified AddCustomerByIdTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.AddCustomerByIdTaskMessage.verify|verify} messages.
                     * @param message AddCustomerByIdTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IAddCustomerByIdTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an AddCustomerByIdTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns AddCustomerByIdTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.AddCustomerByIdTaskMessage;

                    /**
                     * Decodes an AddCustomerByIdTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns AddCustomerByIdTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.AddCustomerByIdTaskMessage;

                    /**
                     * Verifies an AddCustomerByIdTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an AddCustomerByIdTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns AddCustomerByIdTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.AddCustomerByIdTaskMessage;

                    /**
                     * Creates a plain object from an AddCustomerByIdTaskMessage message. Also converts values to other types if specified.
                     * @param message AddCustomerByIdTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.AddCustomerByIdTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this AddCustomerByIdTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for AddCustomerByIdTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of an AddCustomerFromSearchTaskMessage. */
                interface IAddCustomerFromSearchTaskMessage {

                    /** AddCustomerFromSearchTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** AddCustomerFromSearchTaskMessage Key */
                    Key?: (string|null);

                    /** AddCustomerFromSearchTaskMessage Msg */
                    Msg?: (string|null);

                    /** AddCustomerFromSearchTaskMessage Memo */
                    Memo?: (string|null);

                    /** AddCustomerFromSearchTaskMessage Labels */
                    Labels?: (string[]|null);

                    /** AddCustomerFromSearchTaskMessage TaskId */
                    TaskId?: (number|Long|null);

                    /** AddCustomerFromSearchTaskMessage AddByGroup */
                    AddByGroup?: (boolean|null);
                }

                /** Represents an AddCustomerFromSearchTaskMessage. */
                class AddCustomerFromSearchTaskMessage implements IAddCustomerFromSearchTaskMessage {

                    /**
                     * Constructs a new AddCustomerFromSearchTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IAddCustomerFromSearchTaskMessage);

                    /** AddCustomerFromSearchTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** AddCustomerFromSearchTaskMessage Key. */
                    public Key: string;

                    /** AddCustomerFromSearchTaskMessage Msg. */
                    public Msg: string;

                    /** AddCustomerFromSearchTaskMessage Memo. */
                    public Memo: string;

                    /** AddCustomerFromSearchTaskMessage Labels. */
                    public Labels: string[];

                    /** AddCustomerFromSearchTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /** AddCustomerFromSearchTaskMessage AddByGroup. */
                    public AddByGroup: boolean;

                    /**
                     * Creates a new AddCustomerFromSearchTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns AddCustomerFromSearchTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IAddCustomerFromSearchTaskMessage): Im.Scrm.Ww.Proto.AddCustomerFromSearchTaskMessage;

                    /**
                     * Encodes the specified AddCustomerFromSearchTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.AddCustomerFromSearchTaskMessage.verify|verify} messages.
                     * @param message AddCustomerFromSearchTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IAddCustomerFromSearchTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified AddCustomerFromSearchTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.AddCustomerFromSearchTaskMessage.verify|verify} messages.
                     * @param message AddCustomerFromSearchTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IAddCustomerFromSearchTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an AddCustomerFromSearchTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns AddCustomerFromSearchTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.AddCustomerFromSearchTaskMessage;

                    /**
                     * Decodes an AddCustomerFromSearchTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns AddCustomerFromSearchTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.AddCustomerFromSearchTaskMessage;

                    /**
                     * Verifies an AddCustomerFromSearchTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an AddCustomerFromSearchTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns AddCustomerFromSearchTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.AddCustomerFromSearchTaskMessage;

                    /**
                     * Creates a plain object from an AddCustomerFromSearchTaskMessage message. Also converts values to other types if specified.
                     * @param message AddCustomerFromSearchTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.AddCustomerFromSearchTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this AddCustomerFromSearchTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for AddCustomerFromSearchTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of an AddCustomerFromWxTaskMessage. */
                interface IAddCustomerFromWxTaskMessage {

                    /** AddCustomerFromWxTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** AddCustomerFromWxTaskMessage Count */
                    Count?: (number|null);

                    /** AddCustomerFromWxTaskMessage Index */
                    Index?: (number|null);

                    /** AddCustomerFromWxTaskMessage Msg */
                    Msg?: (string|null);

                    /** AddCustomerFromWxTaskMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents an AddCustomerFromWxTaskMessage. */
                class AddCustomerFromWxTaskMessage implements IAddCustomerFromWxTaskMessage {

                    /**
                     * Constructs a new AddCustomerFromWxTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IAddCustomerFromWxTaskMessage);

                    /** AddCustomerFromWxTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** AddCustomerFromWxTaskMessage Count. */
                    public Count: number;

                    /** AddCustomerFromWxTaskMessage Index. */
                    public Index: number;

                    /** AddCustomerFromWxTaskMessage Msg. */
                    public Msg: string;

                    /** AddCustomerFromWxTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new AddCustomerFromWxTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns AddCustomerFromWxTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IAddCustomerFromWxTaskMessage): Im.Scrm.Ww.Proto.AddCustomerFromWxTaskMessage;

                    /**
                     * Encodes the specified AddCustomerFromWxTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.AddCustomerFromWxTaskMessage.verify|verify} messages.
                     * @param message AddCustomerFromWxTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IAddCustomerFromWxTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified AddCustomerFromWxTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.AddCustomerFromWxTaskMessage.verify|verify} messages.
                     * @param message AddCustomerFromWxTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IAddCustomerFromWxTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an AddCustomerFromWxTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns AddCustomerFromWxTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.AddCustomerFromWxTaskMessage;

                    /**
                     * Decodes an AddCustomerFromWxTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns AddCustomerFromWxTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.AddCustomerFromWxTaskMessage;

                    /**
                     * Verifies an AddCustomerFromWxTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an AddCustomerFromWxTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns AddCustomerFromWxTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.AddCustomerFromWxTaskMessage;

                    /**
                     * Creates a plain object from an AddCustomerFromWxTaskMessage message. Also converts values to other types if specified.
                     * @param message AddCustomerFromWxTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.AddCustomerFromWxTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this AddCustomerFromWxTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for AddCustomerFromWxTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** EnumChatRoomAction enum. */
                enum EnumChatRoomAction {
                    RoomName = 0,
                    ModifyPublicNoti = 1,
                    AddMember = 2,
                    KickMember = 3,
                    RoomShowName = 4,
                    AddToPhonebook = 5,
                    NewMsgNoti = 6,
                    ExitRoom = 7,
                    CreateRoom = 8,
                    ViewAllMember = 9,
                    TransferOwner = 10,
                    SetVerify = 11,
                    AddManager = 12,
                    DelManager = 13,
                    SetRemark = 14
                }

                /** Properties of a ChatRoomActionTaskMessage. */
                interface IChatRoomActionTaskMessage {

                    /** ChatRoomActionTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** ChatRoomActionTaskMessage ConvId */
                    ConvId?: (number|Long|null);

                    /** ChatRoomActionTaskMessage Action */
                    Action?: (Im.Scrm.Ww.Proto.EnumChatRoomAction|null);

                    /** ChatRoomActionTaskMessage Content */
                    Content?: (string|null);

                    /** ChatRoomActionTaskMessage IntValue */
                    IntValue?: (number|null);

                    /** ChatRoomActionTaskMessage Members */
                    Members?: ((number|Long)[]|null);

                    /** ChatRoomActionTaskMessage taskId */
                    taskId?: (number|Long|null);
                }

                /** Represents a ChatRoomActionTaskMessage. */
                class ChatRoomActionTaskMessage implements IChatRoomActionTaskMessage {

                    /**
                     * Constructs a new ChatRoomActionTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IChatRoomActionTaskMessage);

                    /** ChatRoomActionTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** ChatRoomActionTaskMessage ConvId. */
                    public ConvId: (number|Long);

                    /** ChatRoomActionTaskMessage Action. */
                    public Action: Im.Scrm.Ww.Proto.EnumChatRoomAction;

                    /** ChatRoomActionTaskMessage Content. */
                    public Content: string;

                    /** ChatRoomActionTaskMessage IntValue. */
                    public IntValue: number;

                    /** ChatRoomActionTaskMessage Members. */
                    public Members: (number|Long)[];

                    /** ChatRoomActionTaskMessage taskId. */
                    public taskId: (number|Long);

                    /**
                     * Creates a new ChatRoomActionTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ChatRoomActionTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IChatRoomActionTaskMessage): Im.Scrm.Ww.Proto.ChatRoomActionTaskMessage;

                    /**
                     * Encodes the specified ChatRoomActionTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.ChatRoomActionTaskMessage.verify|verify} messages.
                     * @param message ChatRoomActionTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IChatRoomActionTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ChatRoomActionTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.ChatRoomActionTaskMessage.verify|verify} messages.
                     * @param message ChatRoomActionTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IChatRoomActionTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ChatRoomActionTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ChatRoomActionTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.ChatRoomActionTaskMessage;

                    /**
                     * Decodes a ChatRoomActionTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ChatRoomActionTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.ChatRoomActionTaskMessage;

                    /**
                     * Verifies a ChatRoomActionTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ChatRoomActionTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ChatRoomActionTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.ChatRoomActionTaskMessage;

                    /**
                     * Creates a plain object from a ChatRoomActionTaskMessage message. Also converts values to other types if specified.
                     * @param message ChatRoomActionTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.ChatRoomActionTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ChatRoomActionTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ChatRoomActionTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a CommonTriggerTaskMessage. */
                interface ICommonTriggerTaskMessage {

                    /** CommonTriggerTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** CommonTriggerTaskMessage Flag */
                    Flag?: (number|null);

                    /** CommonTriggerTaskMessage Time */
                    Time?: (number|Long|null);
                }

                /** Represents a CommonTriggerTaskMessage. */
                class CommonTriggerTaskMessage implements ICommonTriggerTaskMessage {

                    /**
                     * Constructs a new CommonTriggerTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ICommonTriggerTaskMessage);

                    /** CommonTriggerTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** CommonTriggerTaskMessage Flag. */
                    public Flag: number;

                    /** CommonTriggerTaskMessage Time. */
                    public Time: (number|Long);

                    /**
                     * Creates a new CommonTriggerTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns CommonTriggerTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ICommonTriggerTaskMessage): Im.Scrm.Ww.Proto.CommonTriggerTaskMessage;

                    /**
                     * Encodes the specified CommonTriggerTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.CommonTriggerTaskMessage.verify|verify} messages.
                     * @param message CommonTriggerTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ICommonTriggerTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified CommonTriggerTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.CommonTriggerTaskMessage.verify|verify} messages.
                     * @param message CommonTriggerTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ICommonTriggerTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a CommonTriggerTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns CommonTriggerTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.CommonTriggerTaskMessage;

                    /**
                     * Decodes a CommonTriggerTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns CommonTriggerTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.CommonTriggerTaskMessage;

                    /**
                     * Verifies a CommonTriggerTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a CommonTriggerTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns CommonTriggerTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.CommonTriggerTaskMessage;

                    /**
                     * Creates a plain object from a CommonTriggerTaskMessage message. Also converts values to other types if specified.
                     * @param message CommonTriggerTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.CommonTriggerTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this CommonTriggerTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for CommonTriggerTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a ContactPushNoticeMessage. */
                interface IContactPushNoticeMessage {

                    /** ContactPushNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** ContactPushNoticeMessage Contacts */
                    Contacts?: (Im.Scrm.Ww.Proto.IContactMessage[]|null);

                    /** ContactPushNoticeMessage Size */
                    Size?: (number|null);

                    /** ContactPushNoticeMessage Count */
                    Count?: (number|null);

                    /** ContactPushNoticeMessage Page */
                    Page?: (number|null);
                }

                /** Represents a ContactPushNoticeMessage. */
                class ContactPushNoticeMessage implements IContactPushNoticeMessage {

                    /**
                     * Constructs a new ContactPushNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IContactPushNoticeMessage);

                    /** ContactPushNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** ContactPushNoticeMessage Contacts. */
                    public Contacts: Im.Scrm.Ww.Proto.IContactMessage[];

                    /** ContactPushNoticeMessage Size. */
                    public Size: number;

                    /** ContactPushNoticeMessage Count. */
                    public Count: number;

                    /** ContactPushNoticeMessage Page. */
                    public Page: number;

                    /**
                     * Creates a new ContactPushNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ContactPushNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IContactPushNoticeMessage): Im.Scrm.Ww.Proto.ContactPushNoticeMessage;

                    /**
                     * Encodes the specified ContactPushNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.ContactPushNoticeMessage.verify|verify} messages.
                     * @param message ContactPushNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IContactPushNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ContactPushNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.ContactPushNoticeMessage.verify|verify} messages.
                     * @param message ContactPushNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IContactPushNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ContactPushNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ContactPushNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.ContactPushNoticeMessage;

                    /**
                     * Decodes a ContactPushNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ContactPushNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.ContactPushNoticeMessage;

                    /**
                     * Verifies a ContactPushNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ContactPushNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ContactPushNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.ContactPushNoticeMessage;

                    /**
                     * Creates a plain object from a ContactPushNoticeMessage message. Also converts values to other types if specified.
                     * @param message ContactPushNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.ContactPushNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ContactPushNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ContactPushNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a ContactMessage. */
                interface IContactMessage {

                    /** ContactMessage RemoteId */
                    RemoteId?: (number|Long|null);

                    /** ContactMessage AcctId */
                    AcctId?: (string|null);

                    /** ContactMessage Name */
                    Name?: (string|null);

                    /** ContactMessage Alias */
                    Alias?: (string|null);

                    /** ContactMessage Avatar */
                    Avatar?: (string|null);

                    /** ContactMessage Job */
                    Job?: (string|null);

                    /** ContactMessage Mobile */
                    Mobile?: (string|null);

                    /** ContactMessage UnionId */
                    UnionId?: (string|null);

                    /** ContactMessage Gender */
                    Gender?: (Im.Scrm.Ww.Proto.EnumGender|null);

                    /** ContactMessage DepartIds */
                    DepartIds?: ((number|Long)[]|null);

                    /** ContactMessage Attr */
                    Attr?: (number|Long|null);
                }

                /** Represents a ContactMessage. */
                class ContactMessage implements IContactMessage {

                    /**
                     * Constructs a new ContactMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IContactMessage);

                    /** ContactMessage RemoteId. */
                    public RemoteId: (number|Long);

                    /** ContactMessage AcctId. */
                    public AcctId: string;

                    /** ContactMessage Name. */
                    public Name: string;

                    /** ContactMessage Alias. */
                    public Alias: string;

                    /** ContactMessage Avatar. */
                    public Avatar: string;

                    /** ContactMessage Job. */
                    public Job: string;

                    /** ContactMessage Mobile. */
                    public Mobile: string;

                    /** ContactMessage UnionId. */
                    public UnionId: string;

                    /** ContactMessage Gender. */
                    public Gender: Im.Scrm.Ww.Proto.EnumGender;

                    /** ContactMessage DepartIds. */
                    public DepartIds: (number|Long)[];

                    /** ContactMessage Attr. */
                    public Attr: (number|Long);

                    /**
                     * Creates a new ContactMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ContactMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IContactMessage): Im.Scrm.Ww.Proto.ContactMessage;

                    /**
                     * Encodes the specified ContactMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.ContactMessage.verify|verify} messages.
                     * @param message ContactMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IContactMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ContactMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.ContactMessage.verify|verify} messages.
                     * @param message ContactMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IContactMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ContactMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ContactMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.ContactMessage;

                    /**
                     * Decodes a ContactMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ContactMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.ContactMessage;

                    /**
                     * Verifies a ContactMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ContactMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ContactMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.ContactMessage;

                    /**
                     * Creates a plain object from a ContactMessage message. Also converts values to other types if specified.
                     * @param message ContactMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.ContactMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ContactMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ContactMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a ConversationAddNoticeMessage. */
                interface IConversationAddNoticeMessage {

                    /** ConversationAddNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** ConversationAddNoticeMessage Convers */
                    Convers?: (Im.Scrm.Ww.Proto.IConversationMessage|null);
                }

                /** Represents a ConversationAddNoticeMessage. */
                class ConversationAddNoticeMessage implements IConversationAddNoticeMessage {

                    /**
                     * Constructs a new ConversationAddNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IConversationAddNoticeMessage);

                    /** ConversationAddNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** ConversationAddNoticeMessage Convers. */
                    public Convers?: (Im.Scrm.Ww.Proto.IConversationMessage|null);

                    /**
                     * Creates a new ConversationAddNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ConversationAddNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IConversationAddNoticeMessage): Im.Scrm.Ww.Proto.ConversationAddNoticeMessage;

                    /**
                     * Encodes the specified ConversationAddNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.ConversationAddNoticeMessage.verify|verify} messages.
                     * @param message ConversationAddNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IConversationAddNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ConversationAddNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.ConversationAddNoticeMessage.verify|verify} messages.
                     * @param message ConversationAddNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IConversationAddNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ConversationAddNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ConversationAddNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.ConversationAddNoticeMessage;

                    /**
                     * Decodes a ConversationAddNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ConversationAddNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.ConversationAddNoticeMessage;

                    /**
                     * Verifies a ConversationAddNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ConversationAddNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ConversationAddNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.ConversationAddNoticeMessage;

                    /**
                     * Creates a plain object from a ConversationAddNoticeMessage message. Also converts values to other types if specified.
                     * @param message ConversationAddNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.ConversationAddNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ConversationAddNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ConversationAddNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a ConversationPushNoticeMessage. */
                interface IConversationPushNoticeMessage {

                    /** ConversationPushNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** ConversationPushNoticeMessage Convers */
                    Convers?: (Im.Scrm.Ww.Proto.IConversationMessage[]|null);

                    /** ConversationPushNoticeMessage Size */
                    Size?: (number|null);

                    /** ConversationPushNoticeMessage Count */
                    Count?: (number|null);

                    /** ConversationPushNoticeMessage Page */
                    Page?: (number|null);
                }

                /** Represents a ConversationPushNoticeMessage. */
                class ConversationPushNoticeMessage implements IConversationPushNoticeMessage {

                    /**
                     * Constructs a new ConversationPushNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IConversationPushNoticeMessage);

                    /** ConversationPushNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** ConversationPushNoticeMessage Convers. */
                    public Convers: Im.Scrm.Ww.Proto.IConversationMessage[];

                    /** ConversationPushNoticeMessage Size. */
                    public Size: number;

                    /** ConversationPushNoticeMessage Count. */
                    public Count: number;

                    /** ConversationPushNoticeMessage Page. */
                    public Page: number;

                    /**
                     * Creates a new ConversationPushNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ConversationPushNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IConversationPushNoticeMessage): Im.Scrm.Ww.Proto.ConversationPushNoticeMessage;

                    /**
                     * Encodes the specified ConversationPushNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.ConversationPushNoticeMessage.verify|verify} messages.
                     * @param message ConversationPushNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IConversationPushNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ConversationPushNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.ConversationPushNoticeMessage.verify|verify} messages.
                     * @param message ConversationPushNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IConversationPushNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ConversationPushNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ConversationPushNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.ConversationPushNoticeMessage;

                    /**
                     * Decodes a ConversationPushNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ConversationPushNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.ConversationPushNoticeMessage;

                    /**
                     * Verifies a ConversationPushNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ConversationPushNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ConversationPushNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.ConversationPushNoticeMessage;

                    /**
                     * Creates a plain object from a ConversationPushNoticeMessage message. Also converts values to other types if specified.
                     * @param message ConversationPushNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.ConversationPushNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ConversationPushNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ConversationPushNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a ConversationMessage. */
                interface IConversationMessage {

                    /** ConversationMessage Id */
                    Id?: (number|Long|null);

                    /** ConversationMessage RemoteId */
                    RemoteId?: (number|Long|null);

                    /** ConversationMessage Name */
                    Name?: (string|null);

                    /** ConversationMessage Avatar */
                    Avatar?: (string|null);

                    /** ConversationMessage Type */
                    Type?: (number|null);

                    /** ConversationMessage Creator */
                    Creator?: (number|Long|null);

                    /** ConversationMessage CreateTime */
                    CreateTime?: (number|Long|null);

                    /** ConversationMessage UpdateTime */
                    UpdateTime?: (number|Long|null);

                    /** ConversationMessage Notified */
                    Notified?: (boolean|null);

                    /** ConversationMessage Flag */
                    Flag?: (number|null);

                    /** ConversationMessage UnreadCnt */
                    UnreadCnt?: (number|null);

                    /** ConversationMessage Notice */
                    Notice?: (string|null);

                    /** ConversationMessage Digest */
                    Digest?: (string|null);

                    /** ConversationMessage Members */
                    Members?: (Im.Scrm.Ww.Proto.IConvMemberMessage[]|null);

                    /** ConversationMessage Admins */
                    Admins?: ((number|Long)[]|null);

                    /** ConversationMessage HasExternMember */
                    HasExternMember?: (boolean|null);

                    /** ConversationMessage AvatarList */
                    AvatarList?: (string[]|null);

                    /** ConversationMessage isSaved */
                    isSaved?: (boolean|null);

                    /** ConversationMessage isMarked */
                    isMarked?: (boolean|null);

                    /** ConversationMessage isTop */
                    isTop?: (boolean|null);
                }

                /** Represents a ConversationMessage. */
                class ConversationMessage implements IConversationMessage {

                    /**
                     * Constructs a new ConversationMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IConversationMessage);

                    /** ConversationMessage Id. */
                    public Id: (number|Long);

                    /** ConversationMessage RemoteId. */
                    public RemoteId: (number|Long);

                    /** ConversationMessage Name. */
                    public Name: string;

                    /** ConversationMessage Avatar. */
                    public Avatar: string;

                    /** ConversationMessage Type. */
                    public Type: number;

                    /** ConversationMessage Creator. */
                    public Creator: (number|Long);

                    /** ConversationMessage CreateTime. */
                    public CreateTime: (number|Long);

                    /** ConversationMessage UpdateTime. */
                    public UpdateTime: (number|Long);

                    /** ConversationMessage Notified. */
                    public Notified: boolean;

                    /** ConversationMessage Flag. */
                    public Flag: number;

                    /** ConversationMessage UnreadCnt. */
                    public UnreadCnt: number;

                    /** ConversationMessage Notice. */
                    public Notice: string;

                    /** ConversationMessage Digest. */
                    public Digest: string;

                    /** ConversationMessage Members. */
                    public Members: Im.Scrm.Ww.Proto.IConvMemberMessage[];

                    /** ConversationMessage Admins. */
                    public Admins: (number|Long)[];

                    /** ConversationMessage HasExternMember. */
                    public HasExternMember: boolean;

                    /** ConversationMessage AvatarList. */
                    public AvatarList: string[];

                    /** ConversationMessage isSaved. */
                    public isSaved: boolean;

                    /** ConversationMessage isMarked. */
                    public isMarked: boolean;

                    /** ConversationMessage isTop. */
                    public isTop: boolean;

                    /**
                     * Creates a new ConversationMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ConversationMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IConversationMessage): Im.Scrm.Ww.Proto.ConversationMessage;

                    /**
                     * Encodes the specified ConversationMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.ConversationMessage.verify|verify} messages.
                     * @param message ConversationMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IConversationMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ConversationMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.ConversationMessage.verify|verify} messages.
                     * @param message ConversationMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IConversationMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ConversationMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ConversationMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.ConversationMessage;

                    /**
                     * Decodes a ConversationMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ConversationMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.ConversationMessage;

                    /**
                     * Verifies a ConversationMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ConversationMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ConversationMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.ConversationMessage;

                    /**
                     * Creates a plain object from a ConversationMessage message. Also converts values to other types if specified.
                     * @param message ConversationMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.ConversationMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ConversationMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ConversationMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a ConvMemberMessage. */
                interface IConvMemberMessage {

                    /** ConvMemberMessage RemoteId */
                    RemoteId?: (number|Long|null);

                    /** ConvMemberMessage Name */
                    Name?: (string|null);

                    /** ConvMemberMessage JoinTime */
                    JoinTime?: (number|Long|null);

                    /** ConvMemberMessage JoinScene */
                    JoinScene?: (number|null);

                    /** ConvMemberMessage Avatar */
                    Avatar?: (string|null);

                    /** ConvMemberMessage CorpId */
                    CorpId?: (number|Long|null);

                    /** ConvMemberMessage OpRemoteId */
                    OpRemoteId?: (number|Long|null);
                }

                /** Represents a ConvMemberMessage. */
                class ConvMemberMessage implements IConvMemberMessage {

                    /**
                     * Constructs a new ConvMemberMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IConvMemberMessage);

                    /** ConvMemberMessage RemoteId. */
                    public RemoteId: (number|Long);

                    /** ConvMemberMessage Name. */
                    public Name: string;

                    /** ConvMemberMessage JoinTime. */
                    public JoinTime: (number|Long);

                    /** ConvMemberMessage JoinScene. */
                    public JoinScene: number;

                    /** ConvMemberMessage Avatar. */
                    public Avatar: string;

                    /** ConvMemberMessage CorpId. */
                    public CorpId: (number|Long);

                    /** ConvMemberMessage OpRemoteId. */
                    public OpRemoteId: (number|Long);

                    /**
                     * Creates a new ConvMemberMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ConvMemberMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IConvMemberMessage): Im.Scrm.Ww.Proto.ConvMemberMessage;

                    /**
                     * Encodes the specified ConvMemberMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.ConvMemberMessage.verify|verify} messages.
                     * @param message ConvMemberMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IConvMemberMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ConvMemberMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.ConvMemberMessage.verify|verify} messages.
                     * @param message ConvMemberMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IConvMemberMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ConvMemberMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ConvMemberMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.ConvMemberMessage;

                    /**
                     * Decodes a ConvMemberMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ConvMemberMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.ConvMemberMessage;

                    /**
                     * Verifies a ConvMemberMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ConvMemberMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ConvMemberMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.ConvMemberMessage;

                    /**
                     * Creates a plain object from a ConvMemberMessage message. Also converts values to other types if specified.
                     * @param message ConvMemberMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.ConvMemberMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ConvMemberMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ConvMemberMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a ConversationChangedNoticeMessage. */
                interface IConversationChangedNoticeMessage {

                    /** ConversationChangedNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** ConversationChangedNoticeMessage Convers */
                    Convers?: (Im.Scrm.Ww.Proto.IConversationMessage|null);
                }

                /** Represents a ConversationChangedNoticeMessage. */
                class ConversationChangedNoticeMessage implements IConversationChangedNoticeMessage {

                    /**
                     * Constructs a new ConversationChangedNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IConversationChangedNoticeMessage);

                    /** ConversationChangedNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** ConversationChangedNoticeMessage Convers. */
                    public Convers?: (Im.Scrm.Ww.Proto.IConversationMessage|null);

                    /**
                     * Creates a new ConversationChangedNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ConversationChangedNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IConversationChangedNoticeMessage): Im.Scrm.Ww.Proto.ConversationChangedNoticeMessage;

                    /**
                     * Encodes the specified ConversationChangedNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.ConversationChangedNoticeMessage.verify|verify} messages.
                     * @param message ConversationChangedNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IConversationChangedNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ConversationChangedNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.ConversationChangedNoticeMessage.verify|verify} messages.
                     * @param message ConversationChangedNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IConversationChangedNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ConversationChangedNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ConversationChangedNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.ConversationChangedNoticeMessage;

                    /**
                     * Decodes a ConversationChangedNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ConversationChangedNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.ConversationChangedNoticeMessage;

                    /**
                     * Verifies a ConversationChangedNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ConversationChangedNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ConversationChangedNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.ConversationChangedNoticeMessage;

                    /**
                     * Creates a plain object from a ConversationChangedNoticeMessage message. Also converts values to other types if specified.
                     * @param message ConversationChangedNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.ConversationChangedNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ConversationChangedNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ConversationChangedNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a CorporationPushNoticeMessage. */
                interface ICorporationPushNoticeMessage {

                    /** CorporationPushNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** CorporationPushNoticeMessage Corps */
                    Corps?: (Im.Scrm.Ww.Proto.ICorporationMessage[]|null);
                }

                /** Represents a CorporationPushNoticeMessage. */
                class CorporationPushNoticeMessage implements ICorporationPushNoticeMessage {

                    /**
                     * Constructs a new CorporationPushNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ICorporationPushNoticeMessage);

                    /** CorporationPushNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** CorporationPushNoticeMessage Corps. */
                    public Corps: Im.Scrm.Ww.Proto.ICorporationMessage[];

                    /**
                     * Creates a new CorporationPushNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns CorporationPushNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ICorporationPushNoticeMessage): Im.Scrm.Ww.Proto.CorporationPushNoticeMessage;

                    /**
                     * Encodes the specified CorporationPushNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.CorporationPushNoticeMessage.verify|verify} messages.
                     * @param message CorporationPushNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ICorporationPushNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified CorporationPushNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.CorporationPushNoticeMessage.verify|verify} messages.
                     * @param message CorporationPushNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ICorporationPushNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a CorporationPushNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns CorporationPushNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.CorporationPushNoticeMessage;

                    /**
                     * Decodes a CorporationPushNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns CorporationPushNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.CorporationPushNoticeMessage;

                    /**
                     * Verifies a CorporationPushNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a CorporationPushNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns CorporationPushNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.CorporationPushNoticeMessage;

                    /**
                     * Creates a plain object from a CorporationPushNoticeMessage message. Also converts values to other types if specified.
                     * @param message CorporationPushNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.CorporationPushNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this CorporationPushNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for CorporationPushNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a CorporationMessage. */
                interface ICorporationMessage {

                    /** CorporationMessage Id */
                    Id?: (number|Long|null);

                    /** CorporationMessage Name */
                    Name?: (string|null);
                }

                /** Represents a CorporationMessage. */
                class CorporationMessage implements ICorporationMessage {

                    /**
                     * Constructs a new CorporationMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ICorporationMessage);

                    /** CorporationMessage Id. */
                    public Id: (number|Long);

                    /** CorporationMessage Name. */
                    public Name: string;

                    /**
                     * Creates a new CorporationMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns CorporationMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ICorporationMessage): Im.Scrm.Ww.Proto.CorporationMessage;

                    /**
                     * Encodes the specified CorporationMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.CorporationMessage.verify|verify} messages.
                     * @param message CorporationMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ICorporationMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified CorporationMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.CorporationMessage.verify|verify} messages.
                     * @param message CorporationMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ICorporationMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a CorporationMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns CorporationMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.CorporationMessage;

                    /**
                     * Decodes a CorporationMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns CorporationMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.CorporationMessage;

                    /**
                     * Verifies a CorporationMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a CorporationMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns CorporationMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.CorporationMessage;

                    /**
                     * Creates a plain object from a CorporationMessage message. Also converts values to other types if specified.
                     * @param message CorporationMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.CorporationMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this CorporationMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for CorporationMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a CustomerAddNoticeMessage. */
                interface ICustomerAddNoticeMessage {

                    /** CustomerAddNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** CustomerAddNoticeMessage Contact */
                    Contact?: (Im.Scrm.Ww.Proto.ICustomerMessage|null);
                }

                /** Represents a CustomerAddNoticeMessage. */
                class CustomerAddNoticeMessage implements ICustomerAddNoticeMessage {

                    /**
                     * Constructs a new CustomerAddNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ICustomerAddNoticeMessage);

                    /** CustomerAddNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** CustomerAddNoticeMessage Contact. */
                    public Contact?: (Im.Scrm.Ww.Proto.ICustomerMessage|null);

                    /**
                     * Creates a new CustomerAddNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns CustomerAddNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ICustomerAddNoticeMessage): Im.Scrm.Ww.Proto.CustomerAddNoticeMessage;

                    /**
                     * Encodes the specified CustomerAddNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.CustomerAddNoticeMessage.verify|verify} messages.
                     * @param message CustomerAddNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ICustomerAddNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified CustomerAddNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.CustomerAddNoticeMessage.verify|verify} messages.
                     * @param message CustomerAddNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ICustomerAddNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a CustomerAddNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns CustomerAddNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.CustomerAddNoticeMessage;

                    /**
                     * Decodes a CustomerAddNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns CustomerAddNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.CustomerAddNoticeMessage;

                    /**
                     * Verifies a CustomerAddNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a CustomerAddNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns CustomerAddNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.CustomerAddNoticeMessage;

                    /**
                     * Creates a plain object from a CustomerAddNoticeMessage message. Also converts values to other types if specified.
                     * @param message CustomerAddNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.CustomerAddNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this CustomerAddNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for CustomerAddNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a CustomerPushNoticeMessage. */
                interface ICustomerPushNoticeMessage {

                    /** CustomerPushNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** CustomerPushNoticeMessage Contacts */
                    Contacts?: (Im.Scrm.Ww.Proto.ICustomerMessage[]|null);

                    /** CustomerPushNoticeMessage Size */
                    Size?: (number|null);

                    /** CustomerPushNoticeMessage Count */
                    Count?: (number|null);

                    /** CustomerPushNoticeMessage Page */
                    Page?: (number|null);
                }

                /** Represents a CustomerPushNoticeMessage. */
                class CustomerPushNoticeMessage implements ICustomerPushNoticeMessage {

                    /**
                     * Constructs a new CustomerPushNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ICustomerPushNoticeMessage);

                    /** CustomerPushNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** CustomerPushNoticeMessage Contacts. */
                    public Contacts: Im.Scrm.Ww.Proto.ICustomerMessage[];

                    /** CustomerPushNoticeMessage Size. */
                    public Size: number;

                    /** CustomerPushNoticeMessage Count. */
                    public Count: number;

                    /** CustomerPushNoticeMessage Page. */
                    public Page: number;

                    /**
                     * Creates a new CustomerPushNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns CustomerPushNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ICustomerPushNoticeMessage): Im.Scrm.Ww.Proto.CustomerPushNoticeMessage;

                    /**
                     * Encodes the specified CustomerPushNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.CustomerPushNoticeMessage.verify|verify} messages.
                     * @param message CustomerPushNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ICustomerPushNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified CustomerPushNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.CustomerPushNoticeMessage.verify|verify} messages.
                     * @param message CustomerPushNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ICustomerPushNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a CustomerPushNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns CustomerPushNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.CustomerPushNoticeMessage;

                    /**
                     * Decodes a CustomerPushNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns CustomerPushNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.CustomerPushNoticeMessage;

                    /**
                     * Verifies a CustomerPushNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a CustomerPushNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns CustomerPushNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.CustomerPushNoticeMessage;

                    /**
                     * Creates a plain object from a CustomerPushNoticeMessage message. Also converts values to other types if specified.
                     * @param message CustomerPushNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.CustomerPushNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this CustomerPushNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for CustomerPushNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a CustomerMessage. */
                interface ICustomerMessage {

                    /** CustomerMessage RemoteId */
                    RemoteId?: (number|Long|null);

                    /** CustomerMessage Name */
                    Name?: (string|null);

                    /** CustomerMessage Alias */
                    Alias?: (string|null);

                    /** CustomerMessage Avatar */
                    Avatar?: (string|null);

                    /** CustomerMessage Mobile */
                    Mobile?: (string|null);

                    /** CustomerMessage UnionId */
                    UnionId?: (string|null);

                    /** CustomerMessage Gender */
                    Gender?: (Im.Scrm.Ww.Proto.EnumGender|null);

                    /** CustomerMessage CorpId */
                    CorpId?: (number|Long|null);

                    /** CustomerMessage AddTime */
                    AddTime?: (number|null);

                    /** CustomerMessage Source */
                    Source?: (number|null);

                    /** CustomerMessage LabelIds */
                    LabelIds?: ((number|Long)[]|null);

                    /** CustomerMessage Suffix */
                    Suffix?: (string|null);
                }

                /** Represents a CustomerMessage. */
                class CustomerMessage implements ICustomerMessage {

                    /**
                     * Constructs a new CustomerMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ICustomerMessage);

                    /** CustomerMessage RemoteId. */
                    public RemoteId: (number|Long);

                    /** CustomerMessage Name. */
                    public Name: string;

                    /** CustomerMessage Alias. */
                    public Alias: string;

                    /** CustomerMessage Avatar. */
                    public Avatar: string;

                    /** CustomerMessage Mobile. */
                    public Mobile: string;

                    /** CustomerMessage UnionId. */
                    public UnionId: string;

                    /** CustomerMessage Gender. */
                    public Gender: Im.Scrm.Ww.Proto.EnumGender;

                    /** CustomerMessage CorpId. */
                    public CorpId: (number|Long);

                    /** CustomerMessage AddTime. */
                    public AddTime: number;

                    /** CustomerMessage Source. */
                    public Source: number;

                    /** CustomerMessage LabelIds. */
                    public LabelIds: (number|Long)[];

                    /** CustomerMessage Suffix. */
                    public Suffix: string;

                    /**
                     * Creates a new CustomerMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns CustomerMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ICustomerMessage): Im.Scrm.Ww.Proto.CustomerMessage;

                    /**
                     * Encodes the specified CustomerMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.CustomerMessage.verify|verify} messages.
                     * @param message CustomerMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ICustomerMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified CustomerMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.CustomerMessage.verify|verify} messages.
                     * @param message CustomerMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ICustomerMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a CustomerMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns CustomerMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.CustomerMessage;

                    /**
                     * Decodes a CustomerMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns CustomerMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.CustomerMessage;

                    /**
                     * Verifies a CustomerMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a CustomerMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns CustomerMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.CustomerMessage;

                    /**
                     * Creates a plain object from a CustomerMessage message. Also converts values to other types if specified.
                     * @param message CustomerMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.CustomerMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this CustomerMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for CustomerMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a CustomerDelNoticeMessage. */
                interface ICustomerDelNoticeMessage {

                    /** CustomerDelNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** CustomerDelNoticeMessage RemoteId */
                    RemoteId?: (number|Long|null);
                }

                /** Represents a CustomerDelNoticeMessage. */
                class CustomerDelNoticeMessage implements ICustomerDelNoticeMessage {

                    /**
                     * Constructs a new CustomerDelNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ICustomerDelNoticeMessage);

                    /** CustomerDelNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** CustomerDelNoticeMessage RemoteId. */
                    public RemoteId: (number|Long);

                    /**
                     * Creates a new CustomerDelNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns CustomerDelNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ICustomerDelNoticeMessage): Im.Scrm.Ww.Proto.CustomerDelNoticeMessage;

                    /**
                     * Encodes the specified CustomerDelNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.CustomerDelNoticeMessage.verify|verify} messages.
                     * @param message CustomerDelNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ICustomerDelNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified CustomerDelNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.CustomerDelNoticeMessage.verify|verify} messages.
                     * @param message CustomerDelNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ICustomerDelNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a CustomerDelNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns CustomerDelNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.CustomerDelNoticeMessage;

                    /**
                     * Decodes a CustomerDelNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns CustomerDelNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.CustomerDelNoticeMessage;

                    /**
                     * Verifies a CustomerDelNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a CustomerDelNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns CustomerDelNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.CustomerDelNoticeMessage;

                    /**
                     * Creates a plain object from a CustomerDelNoticeMessage message. Also converts values to other types if specified.
                     * @param message CustomerDelNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.CustomerDelNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this CustomerDelNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for CustomerDelNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a DelSnsCommentTaskMessage. */
                interface IDelSnsCommentTaskMessage {

                    /** DelSnsCommentTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** DelSnsCommentTaskMessage SnsId */
                    SnsId?: (number|Long|null);

                    /** DelSnsCommentTaskMessage PostId */
                    PostId?: (string|null);

                    /** DelSnsCommentTaskMessage CommentId */
                    CommentId?: (number|Long|null);

                    /** DelSnsCommentTaskMessage CmPostId */
                    CmPostId?: (string|null);

                    /** DelSnsCommentTaskMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents a DelSnsCommentTaskMessage. */
                class DelSnsCommentTaskMessage implements IDelSnsCommentTaskMessage {

                    /**
                     * Constructs a new DelSnsCommentTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IDelSnsCommentTaskMessage);

                    /** DelSnsCommentTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** DelSnsCommentTaskMessage SnsId. */
                    public SnsId: (number|Long);

                    /** DelSnsCommentTaskMessage PostId. */
                    public PostId: string;

                    /** DelSnsCommentTaskMessage CommentId. */
                    public CommentId: (number|Long);

                    /** DelSnsCommentTaskMessage CmPostId. */
                    public CmPostId: string;

                    /** DelSnsCommentTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new DelSnsCommentTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DelSnsCommentTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IDelSnsCommentTaskMessage): Im.Scrm.Ww.Proto.DelSnsCommentTaskMessage;

                    /**
                     * Encodes the specified DelSnsCommentTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.DelSnsCommentTaskMessage.verify|verify} messages.
                     * @param message DelSnsCommentTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IDelSnsCommentTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DelSnsCommentTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.DelSnsCommentTaskMessage.verify|verify} messages.
                     * @param message DelSnsCommentTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IDelSnsCommentTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DelSnsCommentTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DelSnsCommentTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.DelSnsCommentTaskMessage;

                    /**
                     * Decodes a DelSnsCommentTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DelSnsCommentTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.DelSnsCommentTaskMessage;

                    /**
                     * Verifies a DelSnsCommentTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DelSnsCommentTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DelSnsCommentTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.DelSnsCommentTaskMessage;

                    /**
                     * Creates a plain object from a DelSnsCommentTaskMessage message. Also converts values to other types if specified.
                     * @param message DelSnsCommentTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.DelSnsCommentTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DelSnsCommentTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for DelSnsCommentTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a DelSnsTaskMessage. */
                interface IDelSnsTaskMessage {

                    /** DelSnsTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** DelSnsTaskMessage SnsId */
                    SnsId?: (number|Long|null);

                    /** DelSnsTaskMessage PostId */
                    PostId?: (string|null);

                    /** DelSnsTaskMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents a DelSnsTaskMessage. */
                class DelSnsTaskMessage implements IDelSnsTaskMessage {

                    /**
                     * Constructs a new DelSnsTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IDelSnsTaskMessage);

                    /** DelSnsTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** DelSnsTaskMessage SnsId. */
                    public SnsId: (number|Long);

                    /** DelSnsTaskMessage PostId. */
                    public PostId: string;

                    /** DelSnsTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new DelSnsTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DelSnsTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IDelSnsTaskMessage): Im.Scrm.Ww.Proto.DelSnsTaskMessage;

                    /**
                     * Encodes the specified DelSnsTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.DelSnsTaskMessage.verify|verify} messages.
                     * @param message DelSnsTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IDelSnsTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DelSnsTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.DelSnsTaskMessage.verify|verify} messages.
                     * @param message DelSnsTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IDelSnsTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DelSnsTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DelSnsTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.DelSnsTaskMessage;

                    /**
                     * Decodes a DelSnsTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DelSnsTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.DelSnsTaskMessage;

                    /**
                     * Verifies a DelSnsTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DelSnsTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DelSnsTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.DelSnsTaskMessage;

                    /**
                     * Creates a plain object from a DelSnsTaskMessage message. Also converts values to other types if specified.
                     * @param message DelSnsTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.DelSnsTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DelSnsTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for DelSnsTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a DepartmentPushNoticeMessage. */
                interface IDepartmentPushNoticeMessage {

                    /** DepartmentPushNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** DepartmentPushNoticeMessage Departs */
                    Departs?: (Im.Scrm.Ww.Proto.IDepartmentMessage[]|null);
                }

                /** Represents a DepartmentPushNoticeMessage. */
                class DepartmentPushNoticeMessage implements IDepartmentPushNoticeMessage {

                    /**
                     * Constructs a new DepartmentPushNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IDepartmentPushNoticeMessage);

                    /** DepartmentPushNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** DepartmentPushNoticeMessage Departs. */
                    public Departs: Im.Scrm.Ww.Proto.IDepartmentMessage[];

                    /**
                     * Creates a new DepartmentPushNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DepartmentPushNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IDepartmentPushNoticeMessage): Im.Scrm.Ww.Proto.DepartmentPushNoticeMessage;

                    /**
                     * Encodes the specified DepartmentPushNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.DepartmentPushNoticeMessage.verify|verify} messages.
                     * @param message DepartmentPushNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IDepartmentPushNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DepartmentPushNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.DepartmentPushNoticeMessage.verify|verify} messages.
                     * @param message DepartmentPushNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IDepartmentPushNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DepartmentPushNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DepartmentPushNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.DepartmentPushNoticeMessage;

                    /**
                     * Decodes a DepartmentPushNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DepartmentPushNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.DepartmentPushNoticeMessage;

                    /**
                     * Verifies a DepartmentPushNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DepartmentPushNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DepartmentPushNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.DepartmentPushNoticeMessage;

                    /**
                     * Creates a plain object from a DepartmentPushNoticeMessage message. Also converts values to other types if specified.
                     * @param message DepartmentPushNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.DepartmentPushNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DepartmentPushNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for DepartmentPushNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a DepartmentMessage. */
                interface IDepartmentMessage {

                    /** DepartmentMessage RemoteId */
                    RemoteId?: (number|Long|null);

                    /** DepartmentMessage ParentId */
                    ParentId?: (number|Long|null);

                    /** DepartmentMessage Name */
                    Name?: (string|null);

                    /** DepartmentMessage GroupId */
                    GroupId?: (number|Long|null);

                    /** DepartmentMessage UserCnt */
                    UserCnt?: (number|null);
                }

                /** Represents a DepartmentMessage. */
                class DepartmentMessage implements IDepartmentMessage {

                    /**
                     * Constructs a new DepartmentMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IDepartmentMessage);

                    /** DepartmentMessage RemoteId. */
                    public RemoteId: (number|Long);

                    /** DepartmentMessage ParentId. */
                    public ParentId: (number|Long);

                    /** DepartmentMessage Name. */
                    public Name: string;

                    /** DepartmentMessage GroupId. */
                    public GroupId: (number|Long);

                    /** DepartmentMessage UserCnt. */
                    public UserCnt: number;

                    /**
                     * Creates a new DepartmentMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DepartmentMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IDepartmentMessage): Im.Scrm.Ww.Proto.DepartmentMessage;

                    /**
                     * Encodes the specified DepartmentMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.DepartmentMessage.verify|verify} messages.
                     * @param message DepartmentMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IDepartmentMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DepartmentMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.DepartmentMessage.verify|verify} messages.
                     * @param message DepartmentMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IDepartmentMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DepartmentMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DepartmentMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.DepartmentMessage;

                    /**
                     * Decodes a DepartmentMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DepartmentMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.DepartmentMessage;

                    /**
                     * Verifies a DepartmentMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DepartmentMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DepartmentMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.DepartmentMessage;

                    /**
                     * Creates a plain object from a DepartmentMessage message. Also converts values to other types if specified.
                     * @param message DepartmentMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.DepartmentMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DepartmentMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for DepartmentMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a DeviceAuthReqMessage. */
                interface IDeviceAuthReqMessage {

                    /** DeviceAuthReqMessage AuthType */
                    AuthType?: (Im.Scrm.Ww.Proto.DeviceAuthReqMessage.EnumAuthType|null);

                    /** DeviceAuthReqMessage Credential */
                    Credential?: (string|null);
                }

                /** Represents a DeviceAuthReqMessage. */
                class DeviceAuthReqMessage implements IDeviceAuthReqMessage {

                    /**
                     * Constructs a new DeviceAuthReqMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IDeviceAuthReqMessage);

                    /** DeviceAuthReqMessage AuthType. */
                    public AuthType: Im.Scrm.Ww.Proto.DeviceAuthReqMessage.EnumAuthType;

                    /** DeviceAuthReqMessage Credential. */
                    public Credential: string;

                    /**
                     * Creates a new DeviceAuthReqMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DeviceAuthReqMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IDeviceAuthReqMessage): Im.Scrm.Ww.Proto.DeviceAuthReqMessage;

                    /**
                     * Encodes the specified DeviceAuthReqMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.DeviceAuthReqMessage.verify|verify} messages.
                     * @param message DeviceAuthReqMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IDeviceAuthReqMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DeviceAuthReqMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.DeviceAuthReqMessage.verify|verify} messages.
                     * @param message DeviceAuthReqMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IDeviceAuthReqMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DeviceAuthReqMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DeviceAuthReqMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.DeviceAuthReqMessage;

                    /**
                     * Decodes a DeviceAuthReqMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DeviceAuthReqMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.DeviceAuthReqMessage;

                    /**
                     * Verifies a DeviceAuthReqMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DeviceAuthReqMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DeviceAuthReqMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.DeviceAuthReqMessage;

                    /**
                     * Creates a plain object from a DeviceAuthReqMessage message. Also converts values to other types if specified.
                     * @param message DeviceAuthReqMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.DeviceAuthReqMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DeviceAuthReqMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for DeviceAuthReqMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                namespace DeviceAuthReqMessage {

                    /** EnumAuthType enum. */
                    enum EnumAuthType {
                        Default = 0,
                        DeviceCode = 1,
                        Username = 2,
                        InternalCode = 3
                    }
                }

                /** Properties of a DeviceAuthRspMessage. */
                interface IDeviceAuthRspMessage {

                    /** DeviceAuthRspMessage AccessToken */
                    AccessToken?: (string|null);

                    /** DeviceAuthRspMessage Extra */
                    Extra?: (Im.Scrm.Ww.Proto.DeviceAuthRspMessage.IExtraMessage|null);
                }

                /** Represents a DeviceAuthRspMessage. */
                class DeviceAuthRspMessage implements IDeviceAuthRspMessage {

                    /**
                     * Constructs a new DeviceAuthRspMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IDeviceAuthRspMessage);

                    /** DeviceAuthRspMessage AccessToken. */
                    public AccessToken: string;

                    /** DeviceAuthRspMessage Extra. */
                    public Extra?: (Im.Scrm.Ww.Proto.DeviceAuthRspMessage.IExtraMessage|null);

                    /**
                     * Creates a new DeviceAuthRspMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DeviceAuthRspMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IDeviceAuthRspMessage): Im.Scrm.Ww.Proto.DeviceAuthRspMessage;

                    /**
                     * Encodes the specified DeviceAuthRspMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.DeviceAuthRspMessage.verify|verify} messages.
                     * @param message DeviceAuthRspMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IDeviceAuthRspMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DeviceAuthRspMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.DeviceAuthRspMessage.verify|verify} messages.
                     * @param message DeviceAuthRspMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IDeviceAuthRspMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DeviceAuthRspMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DeviceAuthRspMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.DeviceAuthRspMessage;

                    /**
                     * Decodes a DeviceAuthRspMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DeviceAuthRspMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.DeviceAuthRspMessage;

                    /**
                     * Verifies a DeviceAuthRspMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DeviceAuthRspMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DeviceAuthRspMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.DeviceAuthRspMessage;

                    /**
                     * Creates a plain object from a DeviceAuthRspMessage message. Also converts values to other types if specified.
                     * @param message DeviceAuthRspMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.DeviceAuthRspMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DeviceAuthRspMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for DeviceAuthRspMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                namespace DeviceAuthRspMessage {

                    /** Properties of an ExtraMessage. */
                    interface IExtraMessage {

                        /** ExtraMessage SupplierId */
                        SupplierId?: (number|Long|null);

                        /** ExtraMessage UnionId */
                        UnionId?: (number|Long|null);

                        /** ExtraMessage AccountType */
                        AccountType?: (Im.Scrm.Ww.Proto.EnumAccountType|null);

                        /** ExtraMessage SupplierName */
                        SupplierName?: (string|null);

                        /** ExtraMessage NickName */
                        NickName?: (string|null);

                        /** ExtraMessage Token */
                        Token?: (string|null);
                    }

                    /** Represents an ExtraMessage. */
                    class ExtraMessage implements IExtraMessage {

                        /**
                         * Constructs a new ExtraMessage.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: Im.Scrm.Ww.Proto.DeviceAuthRspMessage.IExtraMessage);

                        /** ExtraMessage SupplierId. */
                        public SupplierId: (number|Long);

                        /** ExtraMessage UnionId. */
                        public UnionId: (number|Long);

                        /** ExtraMessage AccountType. */
                        public AccountType: Im.Scrm.Ww.Proto.EnumAccountType;

                        /** ExtraMessage SupplierName. */
                        public SupplierName: string;

                        /** ExtraMessage NickName. */
                        public NickName: string;

                        /** ExtraMessage Token. */
                        public Token: string;

                        /**
                         * Creates a new ExtraMessage instance using the specified properties.
                         * @param [properties] Properties to set
                         * @returns ExtraMessage instance
                         */
                        public static create(properties?: Im.Scrm.Ww.Proto.DeviceAuthRspMessage.IExtraMessage): Im.Scrm.Ww.Proto.DeviceAuthRspMessage.ExtraMessage;

                        /**
                         * Encodes the specified ExtraMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.DeviceAuthRspMessage.ExtraMessage.verify|verify} messages.
                         * @param message ExtraMessage message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encode(message: Im.Scrm.Ww.Proto.DeviceAuthRspMessage.IExtraMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Encodes the specified ExtraMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.DeviceAuthRspMessage.ExtraMessage.verify|verify} messages.
                         * @param message ExtraMessage message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encodeDelimited(message: Im.Scrm.Ww.Proto.DeviceAuthRspMessage.IExtraMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Decodes an ExtraMessage message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns ExtraMessage
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.DeviceAuthRspMessage.ExtraMessage;

                        /**
                         * Decodes an ExtraMessage message from the specified reader or buffer, length delimited.
                         * @param reader Reader or buffer to decode from
                         * @returns ExtraMessage
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.DeviceAuthRspMessage.ExtraMessage;

                        /**
                         * Verifies an ExtraMessage message.
                         * @param message Plain object to verify
                         * @returns `null` if valid, otherwise the reason why it is not
                         */
                        public static verify(message: { [k: string]: any }): (string|null);

                        /**
                         * Creates an ExtraMessage message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns ExtraMessage
                         */
                        public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.DeviceAuthRspMessage.ExtraMessage;

                        /**
                         * Creates a plain object from an ExtraMessage message. Also converts values to other types if specified.
                         * @param message ExtraMessage
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: Im.Scrm.Ww.Proto.DeviceAuthRspMessage.ExtraMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this ExtraMessage to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };

                        /**
                         * Gets the default type url for ExtraMessage
                         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns The default type url
                         */
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }
                }

                /** Properties of a DownloadFileByMsgIdTaskMessage. */
                interface IDownloadFileByMsgIdTaskMessage {

                    /** DownloadFileByMsgIdTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** DownloadFileByMsgIdTaskMessage MsgId */
                    MsgId?: (number|Long|null);

                    /** DownloadFileByMsgIdTaskMessage MsgRemoteId */
                    MsgRemoteId?: (number|Long|null);

                    /** DownloadFileByMsgIdTaskMessage FileType */
                    FileType?: (number|null);

                    /** DownloadFileByMsgIdTaskMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents a DownloadFileByMsgIdTaskMessage. */
                class DownloadFileByMsgIdTaskMessage implements IDownloadFileByMsgIdTaskMessage {

                    /**
                     * Constructs a new DownloadFileByMsgIdTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IDownloadFileByMsgIdTaskMessage);

                    /** DownloadFileByMsgIdTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** DownloadFileByMsgIdTaskMessage MsgId. */
                    public MsgId: (number|Long);

                    /** DownloadFileByMsgIdTaskMessage MsgRemoteId. */
                    public MsgRemoteId: (number|Long);

                    /** DownloadFileByMsgIdTaskMessage FileType. */
                    public FileType: number;

                    /** DownloadFileByMsgIdTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new DownloadFileByMsgIdTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DownloadFileByMsgIdTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IDownloadFileByMsgIdTaskMessage): Im.Scrm.Ww.Proto.DownloadFileByMsgIdTaskMessage;

                    /**
                     * Encodes the specified DownloadFileByMsgIdTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.DownloadFileByMsgIdTaskMessage.verify|verify} messages.
                     * @param message DownloadFileByMsgIdTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IDownloadFileByMsgIdTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DownloadFileByMsgIdTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.DownloadFileByMsgIdTaskMessage.verify|verify} messages.
                     * @param message DownloadFileByMsgIdTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IDownloadFileByMsgIdTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DownloadFileByMsgIdTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DownloadFileByMsgIdTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.DownloadFileByMsgIdTaskMessage;

                    /**
                     * Decodes a DownloadFileByMsgIdTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DownloadFileByMsgIdTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.DownloadFileByMsgIdTaskMessage;

                    /**
                     * Verifies a DownloadFileByMsgIdTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DownloadFileByMsgIdTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DownloadFileByMsgIdTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.DownloadFileByMsgIdTaskMessage;

                    /**
                     * Creates a plain object from a DownloadFileByMsgIdTaskMessage message. Also converts values to other types if specified.
                     * @param message DownloadFileByMsgIdTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.DownloadFileByMsgIdTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DownloadFileByMsgIdTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for DownloadFileByMsgIdTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a DownloadFileByUrlTaskMessage. */
                interface IDownloadFileByUrlTaskMessage {

                    /** DownloadFileByUrlTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** DownloadFileByUrlTaskMessage Url */
                    Url?: (string|null);

                    /** DownloadFileByUrlTaskMessage AesKey */
                    AesKey?: (string|null);

                    /** DownloadFileByUrlTaskMessage AuthKey */
                    AuthKey?: (string|null);

                    /** DownloadFileByUrlTaskMessage FileName */
                    FileName?: (string|null);

                    /** DownloadFileByUrlTaskMessage MsgType */
                    MsgType?: (number|null);

                    /** DownloadFileByUrlTaskMessage FileType */
                    FileType?: (number|null);

                    /** DownloadFileByUrlTaskMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents a DownloadFileByUrlTaskMessage. */
                class DownloadFileByUrlTaskMessage implements IDownloadFileByUrlTaskMessage {

                    /**
                     * Constructs a new DownloadFileByUrlTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IDownloadFileByUrlTaskMessage);

                    /** DownloadFileByUrlTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** DownloadFileByUrlTaskMessage Url. */
                    public Url: string;

                    /** DownloadFileByUrlTaskMessage AesKey. */
                    public AesKey: string;

                    /** DownloadFileByUrlTaskMessage AuthKey. */
                    public AuthKey: string;

                    /** DownloadFileByUrlTaskMessage FileName. */
                    public FileName: string;

                    /** DownloadFileByUrlTaskMessage MsgType. */
                    public MsgType: number;

                    /** DownloadFileByUrlTaskMessage FileType. */
                    public FileType: number;

                    /** DownloadFileByUrlTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new DownloadFileByUrlTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DownloadFileByUrlTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IDownloadFileByUrlTaskMessage): Im.Scrm.Ww.Proto.DownloadFileByUrlTaskMessage;

                    /**
                     * Encodes the specified DownloadFileByUrlTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.DownloadFileByUrlTaskMessage.verify|verify} messages.
                     * @param message DownloadFileByUrlTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IDownloadFileByUrlTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DownloadFileByUrlTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.DownloadFileByUrlTaskMessage.verify|verify} messages.
                     * @param message DownloadFileByUrlTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IDownloadFileByUrlTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DownloadFileByUrlTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DownloadFileByUrlTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.DownloadFileByUrlTaskMessage;

                    /**
                     * Decodes a DownloadFileByUrlTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DownloadFileByUrlTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.DownloadFileByUrlTaskMessage;

                    /**
                     * Verifies a DownloadFileByUrlTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DownloadFileByUrlTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DownloadFileByUrlTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.DownloadFileByUrlTaskMessage;

                    /**
                     * Creates a plain object from a DownloadFileByUrlTaskMessage message. Also converts values to other types if specified.
                     * @param message DownloadFileByUrlTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.DownloadFileByUrlTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DownloadFileByUrlTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for DownloadFileByUrlTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a DownloadFileResultNoticeMessage. */
                interface IDownloadFileResultNoticeMessage {

                    /** DownloadFileResultNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** DownloadFileResultNoticeMessage Success */
                    Success?: (boolean|null);

                    /** DownloadFileResultNoticeMessage ErrMsg */
                    ErrMsg?: (string|null);

                    /** DownloadFileResultNoticeMessage OrgUrl */
                    OrgUrl?: (string|null);

                    /** DownloadFileResultNoticeMessage Url */
                    Url?: (string|null);

                    /** DownloadFileResultNoticeMessage FileType */
                    FileType?: (number|null);

                    /** DownloadFileResultNoticeMessage TaskId */
                    TaskId?: (number|Long|null);

                    /** DownloadFileResultNoticeMessage MsgId */
                    MsgId?: (number|Long|null);
                }

                /** Represents a DownloadFileResultNoticeMessage. */
                class DownloadFileResultNoticeMessage implements IDownloadFileResultNoticeMessage {

                    /**
                     * Constructs a new DownloadFileResultNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IDownloadFileResultNoticeMessage);

                    /** DownloadFileResultNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** DownloadFileResultNoticeMessage Success. */
                    public Success: boolean;

                    /** DownloadFileResultNoticeMessage ErrMsg. */
                    public ErrMsg: string;

                    /** DownloadFileResultNoticeMessage OrgUrl. */
                    public OrgUrl: string;

                    /** DownloadFileResultNoticeMessage Url. */
                    public Url: string;

                    /** DownloadFileResultNoticeMessage FileType. */
                    public FileType: number;

                    /** DownloadFileResultNoticeMessage TaskId. */
                    public TaskId: (number|Long);

                    /** DownloadFileResultNoticeMessage MsgId. */
                    public MsgId: (number|Long);

                    /**
                     * Creates a new DownloadFileResultNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DownloadFileResultNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IDownloadFileResultNoticeMessage): Im.Scrm.Ww.Proto.DownloadFileResultNoticeMessage;

                    /**
                     * Encodes the specified DownloadFileResultNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.DownloadFileResultNoticeMessage.verify|verify} messages.
                     * @param message DownloadFileResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IDownloadFileResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DownloadFileResultNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.DownloadFileResultNoticeMessage.verify|verify} messages.
                     * @param message DownloadFileResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IDownloadFileResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DownloadFileResultNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DownloadFileResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.DownloadFileResultNoticeMessage;

                    /**
                     * Decodes a DownloadFileResultNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DownloadFileResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.DownloadFileResultNoticeMessage;

                    /**
                     * Verifies a DownloadFileResultNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DownloadFileResultNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DownloadFileResultNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.DownloadFileResultNoticeMessage;

                    /**
                     * Creates a plain object from a DownloadFileResultNoticeMessage message. Also converts values to other types if specified.
                     * @param message DownloadFileResultNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.DownloadFileResultNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DownloadFileResultNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for DownloadFileResultNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of an ErrorMessage. */
                interface IErrorMessage {

                    /** ErrorMessage ErrorCode */
                    ErrorCode?: (Im.Scrm.Ww.Proto.EnumErrorCode|null);

                    /** ErrorMessage ErrorMsg */
                    ErrorMsg?: (string|null);
                }

                /** Represents an ErrorMessage. */
                class ErrorMessage implements IErrorMessage {

                    /**
                     * Constructs a new ErrorMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IErrorMessage);

                    /** ErrorMessage ErrorCode. */
                    public ErrorCode: Im.Scrm.Ww.Proto.EnumErrorCode;

                    /** ErrorMessage ErrorMsg. */
                    public ErrorMsg: string;

                    /**
                     * Creates a new ErrorMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ErrorMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IErrorMessage): Im.Scrm.Ww.Proto.ErrorMessage;

                    /**
                     * Encodes the specified ErrorMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.ErrorMessage.verify|verify} messages.
                     * @param message ErrorMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IErrorMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ErrorMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.ErrorMessage.verify|verify} messages.
                     * @param message ErrorMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IErrorMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an ErrorMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ErrorMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.ErrorMessage;

                    /**
                     * Decodes an ErrorMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ErrorMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.ErrorMessage;

                    /**
                     * Verifies an ErrorMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an ErrorMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ErrorMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.ErrorMessage;

                    /**
                     * Creates a plain object from an ErrorMessage message. Also converts values to other types if specified.
                     * @param message ErrorMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.ErrorMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ErrorMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ErrorMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a ForwardMsgTaskMessage. */
                interface IForwardMsgTaskMessage {

                    /** ForwardMsgTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** ForwardMsgTaskMessage MsgId */
                    MsgId?: (number|Long|null);

                    /** ForwardMsgTaskMessage ConvId */
                    ConvId?: (number|Long|null);

                    /** ForwardMsgTaskMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents a ForwardMsgTaskMessage. */
                class ForwardMsgTaskMessage implements IForwardMsgTaskMessage {

                    /**
                     * Constructs a new ForwardMsgTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IForwardMsgTaskMessage);

                    /** ForwardMsgTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** ForwardMsgTaskMessage MsgId. */
                    public MsgId: (number|Long);

                    /** ForwardMsgTaskMessage ConvId. */
                    public ConvId: (number|Long);

                    /** ForwardMsgTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new ForwardMsgTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ForwardMsgTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IForwardMsgTaskMessage): Im.Scrm.Ww.Proto.ForwardMsgTaskMessage;

                    /**
                     * Encodes the specified ForwardMsgTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.ForwardMsgTaskMessage.verify|verify} messages.
                     * @param message ForwardMsgTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IForwardMsgTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ForwardMsgTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.ForwardMsgTaskMessage.verify|verify} messages.
                     * @param message ForwardMsgTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IForwardMsgTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ForwardMsgTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ForwardMsgTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.ForwardMsgTaskMessage;

                    /**
                     * Decodes a ForwardMsgTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ForwardMsgTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.ForwardMsgTaskMessage;

                    /**
                     * Verifies a ForwardMsgTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ForwardMsgTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ForwardMsgTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.ForwardMsgTaskMessage;

                    /**
                     * Creates a plain object from a ForwardMsgTaskMessage message. Also converts values to other types if specified.
                     * @param message ForwardMsgTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.ForwardMsgTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ForwardMsgTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ForwardMsgTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a ForwardMultiTaskMessage. */
                interface IForwardMultiTaskMessage {

                    /** ForwardMultiTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** ForwardMultiTaskMessage MsgIds */
                    MsgIds?: ((number|Long)[]|null);

                    /** ForwardMultiTaskMessage ConvIds */
                    ConvIds?: ((number|Long)[]|null);

                    /** ForwardMultiTaskMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents a ForwardMultiTaskMessage. */
                class ForwardMultiTaskMessage implements IForwardMultiTaskMessage {

                    /**
                     * Constructs a new ForwardMultiTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IForwardMultiTaskMessage);

                    /** ForwardMultiTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** ForwardMultiTaskMessage MsgIds. */
                    public MsgIds: (number|Long)[];

                    /** ForwardMultiTaskMessage ConvIds. */
                    public ConvIds: (number|Long)[];

                    /** ForwardMultiTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new ForwardMultiTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ForwardMultiTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IForwardMultiTaskMessage): Im.Scrm.Ww.Proto.ForwardMultiTaskMessage;

                    /**
                     * Encodes the specified ForwardMultiTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.ForwardMultiTaskMessage.verify|verify} messages.
                     * @param message ForwardMultiTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IForwardMultiTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ForwardMultiTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.ForwardMultiTaskMessage.verify|verify} messages.
                     * @param message ForwardMultiTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IForwardMultiTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ForwardMultiTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ForwardMultiTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.ForwardMultiTaskMessage;

                    /**
                     * Decodes a ForwardMultiTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ForwardMultiTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.ForwardMultiTaskMessage;

                    /**
                     * Verifies a ForwardMultiTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ForwardMultiTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ForwardMultiTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.ForwardMultiTaskMessage;

                    /**
                     * Creates a plain object from a ForwardMultiTaskMessage message. Also converts values to other types if specified.
                     * @param message ForwardMultiTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.ForwardMultiTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ForwardMultiTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ForwardMultiTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a FriendTalkNoticeMessage. */
                interface IFriendTalkNoticeMessage {

                    /** FriendTalkNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** FriendTalkNoticeMessage ConvId */
                    ConvId?: (number|Long|null);

                    /** FriendTalkNoticeMessage SenderId */
                    SenderId?: (number|Long|null);

                    /** FriendTalkNoticeMessage ContentType */
                    ContentType?: (Im.Scrm.Ww.Proto.EnumContentType|null);

                    /** FriendTalkNoticeMessage Content */
                    Content?: (Uint8Array|null);

                    /** FriendTalkNoticeMessage MsgId */
                    MsgId?: (number|Long|null);

                    /** FriendTalkNoticeMessage MsgRemoteId */
                    MsgRemoteId?: (number|Long|null);

                    /** FriendTalkNoticeMessage CreateTime */
                    CreateTime?: (number|Long|null);

                    /** FriendTalkNoticeMessage SenderName */
                    SenderName?: (string|null);

                    /** FriendTalkNoticeMessage RefId */
                    RefId?: (number|Long|null);

                    /** FriendTalkNoticeMessage Flag */
                    Flag?: (number|null);

                    /** FriendTalkNoticeMessage IsRevoke */
                    IsRevoke?: (boolean|null);
                }

                /** Represents a FriendTalkNoticeMessage. */
                class FriendTalkNoticeMessage implements IFriendTalkNoticeMessage {

                    /**
                     * Constructs a new FriendTalkNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IFriendTalkNoticeMessage);

                    /** FriendTalkNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** FriendTalkNoticeMessage ConvId. */
                    public ConvId: (number|Long);

                    /** FriendTalkNoticeMessage SenderId. */
                    public SenderId: (number|Long);

                    /** FriendTalkNoticeMessage ContentType. */
                    public ContentType: Im.Scrm.Ww.Proto.EnumContentType;

                    /** FriendTalkNoticeMessage Content. */
                    public Content: Uint8Array;

                    /** FriendTalkNoticeMessage MsgId. */
                    public MsgId: (number|Long);

                    /** FriendTalkNoticeMessage MsgRemoteId. */
                    public MsgRemoteId: (number|Long);

                    /** FriendTalkNoticeMessage CreateTime. */
                    public CreateTime: (number|Long);

                    /** FriendTalkNoticeMessage SenderName. */
                    public SenderName: string;

                    /** FriendTalkNoticeMessage RefId. */
                    public RefId: (number|Long);

                    /** FriendTalkNoticeMessage Flag. */
                    public Flag: number;

                    /** FriendTalkNoticeMessage IsRevoke. */
                    public IsRevoke: boolean;

                    /**
                     * Creates a new FriendTalkNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns FriendTalkNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IFriendTalkNoticeMessage): Im.Scrm.Ww.Proto.FriendTalkNoticeMessage;

                    /**
                     * Encodes the specified FriendTalkNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.FriendTalkNoticeMessage.verify|verify} messages.
                     * @param message FriendTalkNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IFriendTalkNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified FriendTalkNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.FriendTalkNoticeMessage.verify|verify} messages.
                     * @param message FriendTalkNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IFriendTalkNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a FriendTalkNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns FriendTalkNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.FriendTalkNoticeMessage;

                    /**
                     * Decodes a FriendTalkNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns FriendTalkNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.FriendTalkNoticeMessage;

                    /**
                     * Verifies a FriendTalkNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a FriendTalkNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns FriendTalkNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.FriendTalkNoticeMessage;

                    /**
                     * Creates a plain object from a FriendTalkNoticeMessage message. Also converts values to other types if specified.
                     * @param message FriendTalkNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.FriendTalkNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this FriendTalkNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for FriendTalkNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a GetContactInfoTaskMessage. */
                interface IGetContactInfoTaskMessage {

                    /** GetContactInfoTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** GetContactInfoTaskMessage RemoteId */
                    RemoteId?: (number|Long|null);
                }

                /** Represents a GetContactInfoTaskMessage. */
                class GetContactInfoTaskMessage implements IGetContactInfoTaskMessage {

                    /**
                     * Constructs a new GetContactInfoTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IGetContactInfoTaskMessage);

                    /** GetContactInfoTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** GetContactInfoTaskMessage RemoteId. */
                    public RemoteId: (number|Long);

                    /**
                     * Creates a new GetContactInfoTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetContactInfoTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IGetContactInfoTaskMessage): Im.Scrm.Ww.Proto.GetContactInfoTaskMessage;

                    /**
                     * Encodes the specified GetContactInfoTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.GetContactInfoTaskMessage.verify|verify} messages.
                     * @param message GetContactInfoTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IGetContactInfoTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetContactInfoTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.GetContactInfoTaskMessage.verify|verify} messages.
                     * @param message GetContactInfoTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IGetContactInfoTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetContactInfoTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetContactInfoTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.GetContactInfoTaskMessage;

                    /**
                     * Decodes a GetContactInfoTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetContactInfoTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.GetContactInfoTaskMessage;

                    /**
                     * Verifies a GetContactInfoTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GetContactInfoTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GetContactInfoTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.GetContactInfoTaskMessage;

                    /**
                     * Creates a plain object from a GetContactInfoTaskMessage message. Also converts values to other types if specified.
                     * @param message GetContactInfoTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.GetContactInfoTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetContactInfoTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for GetContactInfoTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a GetContactInfoTaskResultNoticeMessage. */
                interface IGetContactInfoTaskResultNoticeMessage {

                    /** GetContactInfoTaskResultNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** GetContactInfoTaskResultNoticeMessage Success */
                    Success?: (boolean|null);

                    /** GetContactInfoTaskResultNoticeMessage ErrMsg */
                    ErrMsg?: (string|null);

                    /** GetContactInfoTaskResultNoticeMessage Info */
                    Info?: (Im.Scrm.Ww.Proto.ICustomerMessage|null);

                    /** GetContactInfoTaskResultNoticeMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents a GetContactInfoTaskResultNoticeMessage. */
                class GetContactInfoTaskResultNoticeMessage implements IGetContactInfoTaskResultNoticeMessage {

                    /**
                     * Constructs a new GetContactInfoTaskResultNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IGetContactInfoTaskResultNoticeMessage);

                    /** GetContactInfoTaskResultNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** GetContactInfoTaskResultNoticeMessage Success. */
                    public Success: boolean;

                    /** GetContactInfoTaskResultNoticeMessage ErrMsg. */
                    public ErrMsg: string;

                    /** GetContactInfoTaskResultNoticeMessage Info. */
                    public Info?: (Im.Scrm.Ww.Proto.ICustomerMessage|null);

                    /** GetContactInfoTaskResultNoticeMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new GetContactInfoTaskResultNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetContactInfoTaskResultNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IGetContactInfoTaskResultNoticeMessage): Im.Scrm.Ww.Proto.GetContactInfoTaskResultNoticeMessage;

                    /**
                     * Encodes the specified GetContactInfoTaskResultNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.GetContactInfoTaskResultNoticeMessage.verify|verify} messages.
                     * @param message GetContactInfoTaskResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IGetContactInfoTaskResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetContactInfoTaskResultNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.GetContactInfoTaskResultNoticeMessage.verify|verify} messages.
                     * @param message GetContactInfoTaskResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IGetContactInfoTaskResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetContactInfoTaskResultNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetContactInfoTaskResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.GetContactInfoTaskResultNoticeMessage;

                    /**
                     * Decodes a GetContactInfoTaskResultNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetContactInfoTaskResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.GetContactInfoTaskResultNoticeMessage;

                    /**
                     * Verifies a GetContactInfoTaskResultNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GetContactInfoTaskResultNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GetContactInfoTaskResultNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.GetContactInfoTaskResultNoticeMessage;

                    /**
                     * Creates a plain object from a GetContactInfoTaskResultNoticeMessage message. Also converts values to other types if specified.
                     * @param message GetContactInfoTaskResultNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.GetContactInfoTaskResultNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetContactInfoTaskResultNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for GetContactInfoTaskResultNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a GetSnsDataTaskMessage. */
                interface IGetSnsDataTaskMessage {

                    /** GetSnsDataTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** GetSnsDataTaskMessage SnsId */
                    SnsId?: (number|Long|null);

                    /** GetSnsDataTaskMessage PostId */
                    PostId?: (string|null);

                    /** GetSnsDataTaskMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents a GetSnsDataTaskMessage. */
                class GetSnsDataTaskMessage implements IGetSnsDataTaskMessage {

                    /**
                     * Constructs a new GetSnsDataTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IGetSnsDataTaskMessage);

                    /** GetSnsDataTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** GetSnsDataTaskMessage SnsId. */
                    public SnsId: (number|Long);

                    /** GetSnsDataTaskMessage PostId. */
                    public PostId: string;

                    /** GetSnsDataTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new GetSnsDataTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetSnsDataTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IGetSnsDataTaskMessage): Im.Scrm.Ww.Proto.GetSnsDataTaskMessage;

                    /**
                     * Encodes the specified GetSnsDataTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.GetSnsDataTaskMessage.verify|verify} messages.
                     * @param message GetSnsDataTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IGetSnsDataTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetSnsDataTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.GetSnsDataTaskMessage.verify|verify} messages.
                     * @param message GetSnsDataTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IGetSnsDataTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetSnsDataTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetSnsDataTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.GetSnsDataTaskMessage;

                    /**
                     * Decodes a GetSnsDataTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetSnsDataTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.GetSnsDataTaskMessage;

                    /**
                     * Verifies a GetSnsDataTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GetSnsDataTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GetSnsDataTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.GetSnsDataTaskMessage;

                    /**
                     * Creates a plain object from a GetSnsDataTaskMessage message. Also converts values to other types if specified.
                     * @param message GetSnsDataTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.GetSnsDataTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetSnsDataTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for GetSnsDataTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a GetSnsDataTaskResultNoticeMessage. */
                interface IGetSnsDataTaskResultNoticeMessage {

                    /** GetSnsDataTaskResultNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** GetSnsDataTaskResultNoticeMessage Success */
                    Success?: (boolean|null);

                    /** GetSnsDataTaskResultNoticeMessage ErrMsg */
                    ErrMsg?: (string|null);

                    /** GetSnsDataTaskResultNoticeMessage SnsInfo */
                    SnsInfo?: (Im.Scrm.Ww.Proto.ISnsInfoMessage|null);

                    /** GetSnsDataTaskResultNoticeMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents a GetSnsDataTaskResultNoticeMessage. */
                class GetSnsDataTaskResultNoticeMessage implements IGetSnsDataTaskResultNoticeMessage {

                    /**
                     * Constructs a new GetSnsDataTaskResultNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IGetSnsDataTaskResultNoticeMessage);

                    /** GetSnsDataTaskResultNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** GetSnsDataTaskResultNoticeMessage Success. */
                    public Success: boolean;

                    /** GetSnsDataTaskResultNoticeMessage ErrMsg. */
                    public ErrMsg: string;

                    /** GetSnsDataTaskResultNoticeMessage SnsInfo. */
                    public SnsInfo?: (Im.Scrm.Ww.Proto.ISnsInfoMessage|null);

                    /** GetSnsDataTaskResultNoticeMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new GetSnsDataTaskResultNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetSnsDataTaskResultNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IGetSnsDataTaskResultNoticeMessage): Im.Scrm.Ww.Proto.GetSnsDataTaskResultNoticeMessage;

                    /**
                     * Encodes the specified GetSnsDataTaskResultNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.GetSnsDataTaskResultNoticeMessage.verify|verify} messages.
                     * @param message GetSnsDataTaskResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IGetSnsDataTaskResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetSnsDataTaskResultNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.GetSnsDataTaskResultNoticeMessage.verify|verify} messages.
                     * @param message GetSnsDataTaskResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IGetSnsDataTaskResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetSnsDataTaskResultNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetSnsDataTaskResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.GetSnsDataTaskResultNoticeMessage;

                    /**
                     * Decodes a GetSnsDataTaskResultNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetSnsDataTaskResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.GetSnsDataTaskResultNoticeMessage;

                    /**
                     * Verifies a GetSnsDataTaskResultNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GetSnsDataTaskResultNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GetSnsDataTaskResultNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.GetSnsDataTaskResultNoticeMessage;

                    /**
                     * Creates a plain object from a GetSnsDataTaskResultNoticeMessage message. Also converts values to other types if specified.
                     * @param message GetSnsDataTaskResultNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.GetSnsDataTaskResultNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetSnsDataTaskResultNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for GetSnsDataTaskResultNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a PullMySnsListTaskResultNoticeMessage. */
                interface IPullMySnsListTaskResultNoticeMessage {

                    /** PullMySnsListTaskResultNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** PullMySnsListTaskResultNoticeMessage Success */
                    Success?: (boolean|null);

                    /** PullMySnsListTaskResultNoticeMessage ErrMsg */
                    ErrMsg?: (string|null);

                    /** PullMySnsListTaskResultNoticeMessage SnsList */
                    SnsList?: (Im.Scrm.Ww.Proto.ISnsInfoMessage[]|null);

                    /** PullMySnsListTaskResultNoticeMessage NextSeq */
                    NextSeq?: (number|Long|null);
                }

                /** Represents a PullMySnsListTaskResultNoticeMessage. */
                class PullMySnsListTaskResultNoticeMessage implements IPullMySnsListTaskResultNoticeMessage {

                    /**
                     * Constructs a new PullMySnsListTaskResultNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IPullMySnsListTaskResultNoticeMessage);

                    /** PullMySnsListTaskResultNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** PullMySnsListTaskResultNoticeMessage Success. */
                    public Success: boolean;

                    /** PullMySnsListTaskResultNoticeMessage ErrMsg. */
                    public ErrMsg: string;

                    /** PullMySnsListTaskResultNoticeMessage SnsList. */
                    public SnsList: Im.Scrm.Ww.Proto.ISnsInfoMessage[];

                    /** PullMySnsListTaskResultNoticeMessage NextSeq. */
                    public NextSeq: (number|Long);

                    /**
                     * Creates a new PullMySnsListTaskResultNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns PullMySnsListTaskResultNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IPullMySnsListTaskResultNoticeMessage): Im.Scrm.Ww.Proto.PullMySnsListTaskResultNoticeMessage;

                    /**
                     * Encodes the specified PullMySnsListTaskResultNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.PullMySnsListTaskResultNoticeMessage.verify|verify} messages.
                     * @param message PullMySnsListTaskResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IPullMySnsListTaskResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified PullMySnsListTaskResultNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.PullMySnsListTaskResultNoticeMessage.verify|verify} messages.
                     * @param message PullMySnsListTaskResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IPullMySnsListTaskResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a PullMySnsListTaskResultNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns PullMySnsListTaskResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.PullMySnsListTaskResultNoticeMessage;

                    /**
                     * Decodes a PullMySnsListTaskResultNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns PullMySnsListTaskResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.PullMySnsListTaskResultNoticeMessage;

                    /**
                     * Verifies a PullMySnsListTaskResultNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a PullMySnsListTaskResultNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns PullMySnsListTaskResultNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.PullMySnsListTaskResultNoticeMessage;

                    /**
                     * Creates a plain object from a PullMySnsListTaskResultNoticeMessage message. Also converts values to other types if specified.
                     * @param message PullMySnsListTaskResultNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.PullMySnsListTaskResultNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this PullMySnsListTaskResultNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for PullMySnsListTaskResultNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a SnsInfoMessage. */
                interface ISnsInfoMessage {

                    /** SnsInfoMessage Author */
                    Author?: (number|Long|null);

                    /** SnsInfoMessage Content */
                    Content?: (string|null);

                    /** SnsInfoMessage Images */
                    Images?: (Im.Scrm.Ww.Proto.ISnsMediaInfoMessage[]|null);

                    /** SnsInfoMessage Link */
                    Link?: (Im.Scrm.Ww.Proto.ISnsMediaInfoMessage|null);

                    /** SnsInfoMessage Video */
                    Video?: (Im.Scrm.Ww.Proto.ISnsMediaInfoMessage|null);

                    /** SnsInfoMessage Comments */
                    Comments?: (Im.Scrm.Ww.Proto.ISnsCommentMessage[]|null);

                    /** SnsInfoMessage Likes */
                    Likes?: (Im.Scrm.Ww.Proto.ISnsLikeMessage[]|null);

                    /** SnsInfoMessage SnsId */
                    SnsId?: (number|Long|null);

                    /** SnsInfoMessage Time */
                    Time?: (number|null);

                    /** SnsInfoMessage PostId */
                    PostId?: (string|null);

                    /** SnsInfoMessage Type */
                    Type?: (number|null);
                }

                /** Represents a SnsInfoMessage. */
                class SnsInfoMessage implements ISnsInfoMessage {

                    /**
                     * Constructs a new SnsInfoMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ISnsInfoMessage);

                    /** SnsInfoMessage Author. */
                    public Author: (number|Long);

                    /** SnsInfoMessage Content. */
                    public Content: string;

                    /** SnsInfoMessage Images. */
                    public Images: Im.Scrm.Ww.Proto.ISnsMediaInfoMessage[];

                    /** SnsInfoMessage Link. */
                    public Link?: (Im.Scrm.Ww.Proto.ISnsMediaInfoMessage|null);

                    /** SnsInfoMessage Video. */
                    public Video?: (Im.Scrm.Ww.Proto.ISnsMediaInfoMessage|null);

                    /** SnsInfoMessage Comments. */
                    public Comments: Im.Scrm.Ww.Proto.ISnsCommentMessage[];

                    /** SnsInfoMessage Likes. */
                    public Likes: Im.Scrm.Ww.Proto.ISnsLikeMessage[];

                    /** SnsInfoMessage SnsId. */
                    public SnsId: (number|Long);

                    /** SnsInfoMessage Time. */
                    public Time: number;

                    /** SnsInfoMessage PostId. */
                    public PostId: string;

                    /** SnsInfoMessage Type. */
                    public Type: number;

                    /**
                     * Creates a new SnsInfoMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns SnsInfoMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ISnsInfoMessage): Im.Scrm.Ww.Proto.SnsInfoMessage;

                    /**
                     * Encodes the specified SnsInfoMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.SnsInfoMessage.verify|verify} messages.
                     * @param message SnsInfoMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ISnsInfoMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified SnsInfoMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.SnsInfoMessage.verify|verify} messages.
                     * @param message SnsInfoMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ISnsInfoMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a SnsInfoMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns SnsInfoMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.SnsInfoMessage;

                    /**
                     * Decodes a SnsInfoMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns SnsInfoMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.SnsInfoMessage;

                    /**
                     * Verifies a SnsInfoMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a SnsInfoMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns SnsInfoMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.SnsInfoMessage;

                    /**
                     * Creates a plain object from a SnsInfoMessage message. Also converts values to other types if specified.
                     * @param message SnsInfoMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.SnsInfoMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this SnsInfoMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for SnsInfoMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a SnsMediaInfoMessage. */
                interface ISnsMediaInfoMessage {

                    /** SnsMediaInfoMessage ThumbImg */
                    ThumbImg?: (string|null);

                    /** SnsMediaInfoMessage Url */
                    Url?: (string|null);

                    /** SnsMediaInfoMessage Desc */
                    Desc?: (string|null);
                }

                /** Represents a SnsMediaInfoMessage. */
                class SnsMediaInfoMessage implements ISnsMediaInfoMessage {

                    /**
                     * Constructs a new SnsMediaInfoMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ISnsMediaInfoMessage);

                    /** SnsMediaInfoMessage ThumbImg. */
                    public ThumbImg: string;

                    /** SnsMediaInfoMessage Url. */
                    public Url: string;

                    /** SnsMediaInfoMessage Desc. */
                    public Desc: string;

                    /**
                     * Creates a new SnsMediaInfoMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns SnsMediaInfoMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ISnsMediaInfoMessage): Im.Scrm.Ww.Proto.SnsMediaInfoMessage;

                    /**
                     * Encodes the specified SnsMediaInfoMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.SnsMediaInfoMessage.verify|verify} messages.
                     * @param message SnsMediaInfoMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ISnsMediaInfoMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified SnsMediaInfoMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.SnsMediaInfoMessage.verify|verify} messages.
                     * @param message SnsMediaInfoMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ISnsMediaInfoMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a SnsMediaInfoMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns SnsMediaInfoMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.SnsMediaInfoMessage;

                    /**
                     * Decodes a SnsMediaInfoMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns SnsMediaInfoMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.SnsMediaInfoMessage;

                    /**
                     * Verifies a SnsMediaInfoMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a SnsMediaInfoMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns SnsMediaInfoMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.SnsMediaInfoMessage;

                    /**
                     * Creates a plain object from a SnsMediaInfoMessage message. Also converts values to other types if specified.
                     * @param message SnsMediaInfoMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.SnsMediaInfoMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this SnsMediaInfoMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for SnsMediaInfoMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a SnsCommentMessage. */
                interface ISnsCommentMessage {

                    /** SnsCommentMessage FriendId */
                    FriendId?: (number|Long|null);

                    /** SnsCommentMessage Content */
                    Content?: (string|null);

                    /** SnsCommentMessage CommentId */
                    CommentId?: (number|Long|null);

                    /** SnsCommentMessage ReplyCommentId */
                    ReplyCommentId?: (number|Long|null);

                    /** SnsCommentMessage ReplyWxId */
                    ReplyWxId?: (number|Long|null);

                    /** SnsCommentMessage Time */
                    Time?: (number|null);

                    /** SnsCommentMessage PostId */
                    PostId?: (string|null);
                }

                /** Represents a SnsCommentMessage. */
                class SnsCommentMessage implements ISnsCommentMessage {

                    /**
                     * Constructs a new SnsCommentMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ISnsCommentMessage);

                    /** SnsCommentMessage FriendId. */
                    public FriendId: (number|Long);

                    /** SnsCommentMessage Content. */
                    public Content: string;

                    /** SnsCommentMessage CommentId. */
                    public CommentId: (number|Long);

                    /** SnsCommentMessage ReplyCommentId. */
                    public ReplyCommentId: (number|Long);

                    /** SnsCommentMessage ReplyWxId. */
                    public ReplyWxId: (number|Long);

                    /** SnsCommentMessage Time. */
                    public Time: number;

                    /** SnsCommentMessage PostId. */
                    public PostId: string;

                    /**
                     * Creates a new SnsCommentMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns SnsCommentMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ISnsCommentMessage): Im.Scrm.Ww.Proto.SnsCommentMessage;

                    /**
                     * Encodes the specified SnsCommentMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.SnsCommentMessage.verify|verify} messages.
                     * @param message SnsCommentMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ISnsCommentMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified SnsCommentMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.SnsCommentMessage.verify|verify} messages.
                     * @param message SnsCommentMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ISnsCommentMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a SnsCommentMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns SnsCommentMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.SnsCommentMessage;

                    /**
                     * Decodes a SnsCommentMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns SnsCommentMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.SnsCommentMessage;

                    /**
                     * Verifies a SnsCommentMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a SnsCommentMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns SnsCommentMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.SnsCommentMessage;

                    /**
                     * Creates a plain object from a SnsCommentMessage message. Also converts values to other types if specified.
                     * @param message SnsCommentMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.SnsCommentMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this SnsCommentMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for SnsCommentMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a SnsLikeMessage. */
                interface ISnsLikeMessage {

                    /** SnsLikeMessage FriendId */
                    FriendId?: (number|Long|null);

                    /** SnsLikeMessage Time */
                    Time?: (number|null);
                }

                /** Represents a SnsLikeMessage. */
                class SnsLikeMessage implements ISnsLikeMessage {

                    /**
                     * Constructs a new SnsLikeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ISnsLikeMessage);

                    /** SnsLikeMessage FriendId. */
                    public FriendId: (number|Long);

                    /** SnsLikeMessage Time. */
                    public Time: number;

                    /**
                     * Creates a new SnsLikeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns SnsLikeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ISnsLikeMessage): Im.Scrm.Ww.Proto.SnsLikeMessage;

                    /**
                     * Encodes the specified SnsLikeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.SnsLikeMessage.verify|verify} messages.
                     * @param message SnsLikeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ISnsLikeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified SnsLikeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.SnsLikeMessage.verify|verify} messages.
                     * @param message SnsLikeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ISnsLikeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a SnsLikeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns SnsLikeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.SnsLikeMessage;

                    /**
                     * Decodes a SnsLikeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns SnsLikeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.SnsLikeMessage;

                    /**
                     * Verifies a SnsLikeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a SnsLikeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns SnsLikeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.SnsLikeMessage;

                    /**
                     * Creates a plain object from a SnsLikeMessage message. Also converts values to other types if specified.
                     * @param message SnsLikeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.SnsLikeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this SnsLikeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for SnsLikeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a ChatMessage. */
                interface IChatMessage {

                    /** ChatMessage ConvId */
                    ConvId?: (number|Long|null);

                    /** ChatMessage SenderId */
                    SenderId?: (number|Long|null);

                    /** ChatMessage ContentType */
                    ContentType?: (Im.Scrm.Ww.Proto.EnumContentType|null);

                    /** ChatMessage Content */
                    Content?: (Uint8Array|null);

                    /** ChatMessage MsgId */
                    MsgId?: (number|Long|null);

                    /** ChatMessage MsgRemoteId */
                    MsgRemoteId?: (number|Long|null);

                    /** ChatMessage CreateTime */
                    CreateTime?: (number|Long|null);

                    /** ChatMessage SenderName */
                    SenderName?: (string|null);

                    /** ChatMessage RefId */
                    RefId?: (number|Long|null);

                    /** ChatMessage Flag */
                    Flag?: (number|null);

                    /** ChatMessage IsRevoke */
                    IsRevoke?: (boolean|null);
                }

                /** Represents a ChatMessage. */
                class ChatMessage implements IChatMessage {

                    /**
                     * Constructs a new ChatMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IChatMessage);

                    /** ChatMessage ConvId. */
                    public ConvId: (number|Long);

                    /** ChatMessage SenderId. */
                    public SenderId: (number|Long);

                    /** ChatMessage ContentType. */
                    public ContentType: Im.Scrm.Ww.Proto.EnumContentType;

                    /** ChatMessage Content. */
                    public Content: Uint8Array;

                    /** ChatMessage MsgId. */
                    public MsgId: (number|Long);

                    /** ChatMessage MsgRemoteId. */
                    public MsgRemoteId: (number|Long);

                    /** ChatMessage CreateTime. */
                    public CreateTime: (number|Long);

                    /** ChatMessage SenderName. */
                    public SenderName: string;

                    /** ChatMessage RefId. */
                    public RefId: (number|Long);

                    /** ChatMessage Flag. */
                    public Flag: number;

                    /** ChatMessage IsRevoke. */
                    public IsRevoke: boolean;

                    /**
                     * Creates a new ChatMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ChatMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IChatMessage): Im.Scrm.Ww.Proto.ChatMessage;

                    /**
                     * Encodes the specified ChatMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.ChatMessage.verify|verify} messages.
                     * @param message ChatMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IChatMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ChatMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.ChatMessage.verify|verify} messages.
                     * @param message ChatMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IChatMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ChatMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ChatMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.ChatMessage;

                    /**
                     * Decodes a ChatMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ChatMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.ChatMessage;

                    /**
                     * Verifies a ChatMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ChatMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ChatMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.ChatMessage;

                    /**
                     * Creates a plain object from a ChatMessage message. Also converts values to other types if specified.
                     * @param message ChatMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.ChatMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ChatMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ChatMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a HistoryMsgPushNoticeMessage. */
                interface IHistoryMsgPushNoticeMessage {

                    /** HistoryMsgPushNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** HistoryMsgPushNoticeMessage Messages */
                    Messages?: (Im.Scrm.Ww.Proto.IChatMessage[]|null);

                    /** HistoryMsgPushNoticeMessage Count */
                    Count?: (number|null);

                    /** HistoryMsgPushNoticeMessage ConvId */
                    ConvId?: (number|Long|null);

                    /** HistoryMsgPushNoticeMessage HasMore */
                    HasMore?: (boolean|null);
                }

                /** Represents a HistoryMsgPushNoticeMessage. */
                class HistoryMsgPushNoticeMessage implements IHistoryMsgPushNoticeMessage {

                    /**
                     * Constructs a new HistoryMsgPushNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IHistoryMsgPushNoticeMessage);

                    /** HistoryMsgPushNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** HistoryMsgPushNoticeMessage Messages. */
                    public Messages: Im.Scrm.Ww.Proto.IChatMessage[];

                    /** HistoryMsgPushNoticeMessage Count. */
                    public Count: number;

                    /** HistoryMsgPushNoticeMessage ConvId. */
                    public ConvId: (number|Long);

                    /** HistoryMsgPushNoticeMessage HasMore. */
                    public HasMore: boolean;

                    /**
                     * Creates a new HistoryMsgPushNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns HistoryMsgPushNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IHistoryMsgPushNoticeMessage): Im.Scrm.Ww.Proto.HistoryMsgPushNoticeMessage;

                    /**
                     * Encodes the specified HistoryMsgPushNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.HistoryMsgPushNoticeMessage.verify|verify} messages.
                     * @param message HistoryMsgPushNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IHistoryMsgPushNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified HistoryMsgPushNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.HistoryMsgPushNoticeMessage.verify|verify} messages.
                     * @param message HistoryMsgPushNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IHistoryMsgPushNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a HistoryMsgPushNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns HistoryMsgPushNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.HistoryMsgPushNoticeMessage;

                    /**
                     * Decodes a HistoryMsgPushNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns HistoryMsgPushNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.HistoryMsgPushNoticeMessage;

                    /**
                     * Verifies a HistoryMsgPushNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a HistoryMsgPushNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns HistoryMsgPushNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.HistoryMsgPushNoticeMessage;

                    /**
                     * Creates a plain object from a HistoryMsgPushNoticeMessage message. Also converts values to other types if specified.
                     * @param message HistoryMsgPushNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.HistoryMsgPushNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this HistoryMsgPushNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for HistoryMsgPushNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a MsgRevokeNoticeMessage. */
                interface IMsgRevokeNoticeMessage {

                    /** MsgRevokeNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** MsgRevokeNoticeMessage ConvId */
                    ConvId?: (number|Long|null);

                    /** MsgRevokeNoticeMessage MsgId */
                    MsgId?: (number|Long|null);

                    /** MsgRevokeNoticeMessage MsgRemoteId */
                    MsgRemoteId?: (number|Long|null);

                    /** MsgRevokeNoticeMessage Flag */
                    Flag?: (number|null);
                }

                /** Represents a MsgRevokeNoticeMessage. */
                class MsgRevokeNoticeMessage implements IMsgRevokeNoticeMessage {

                    /**
                     * Constructs a new MsgRevokeNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IMsgRevokeNoticeMessage);

                    /** MsgRevokeNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** MsgRevokeNoticeMessage ConvId. */
                    public ConvId: (number|Long);

                    /** MsgRevokeNoticeMessage MsgId. */
                    public MsgId: (number|Long);

                    /** MsgRevokeNoticeMessage MsgRemoteId. */
                    public MsgRemoteId: (number|Long);

                    /** MsgRevokeNoticeMessage Flag. */
                    public Flag: number;

                    /**
                     * Creates a new MsgRevokeNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns MsgRevokeNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IMsgRevokeNoticeMessage): Im.Scrm.Ww.Proto.MsgRevokeNoticeMessage;

                    /**
                     * Encodes the specified MsgRevokeNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.MsgRevokeNoticeMessage.verify|verify} messages.
                     * @param message MsgRevokeNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IMsgRevokeNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified MsgRevokeNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.MsgRevokeNoticeMessage.verify|verify} messages.
                     * @param message MsgRevokeNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IMsgRevokeNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a MsgRevokeNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns MsgRevokeNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.MsgRevokeNoticeMessage;

                    /**
                     * Decodes a MsgRevokeNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns MsgRevokeNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.MsgRevokeNoticeMessage;

                    /**
                     * Verifies a MsgRevokeNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a MsgRevokeNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns MsgRevokeNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.MsgRevokeNoticeMessage;

                    /**
                     * Creates a plain object from a MsgRevokeNoticeMessage message. Also converts values to other types if specified.
                     * @param message MsgRevokeNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.MsgRevokeNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this MsgRevokeNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for MsgRevokeNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a MsgRevokeTaskMessage. */
                interface IMsgRevokeTaskMessage {

                    /** MsgRevokeTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** MsgRevokeTaskMessage RemoteId */
                    RemoteId?: (number|Long|null);

                    /** MsgRevokeTaskMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents a MsgRevokeTaskMessage. */
                class MsgRevokeTaskMessage implements IMsgRevokeTaskMessage {

                    /**
                     * Constructs a new MsgRevokeTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IMsgRevokeTaskMessage);

                    /** MsgRevokeTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** MsgRevokeTaskMessage RemoteId. */
                    public RemoteId: (number|Long);

                    /** MsgRevokeTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new MsgRevokeTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns MsgRevokeTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IMsgRevokeTaskMessage): Im.Scrm.Ww.Proto.MsgRevokeTaskMessage;

                    /**
                     * Encodes the specified MsgRevokeTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.MsgRevokeTaskMessage.verify|verify} messages.
                     * @param message MsgRevokeTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IMsgRevokeTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified MsgRevokeTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.MsgRevokeTaskMessage.verify|verify} messages.
                     * @param message MsgRevokeTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IMsgRevokeTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a MsgRevokeTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns MsgRevokeTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.MsgRevokeTaskMessage;

                    /**
                     * Decodes a MsgRevokeTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns MsgRevokeTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.MsgRevokeTaskMessage;

                    /**
                     * Verifies a MsgRevokeTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a MsgRevokeTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns MsgRevokeTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.MsgRevokeTaskMessage;

                    /**
                     * Creates a plain object from a MsgRevokeTaskMessage message. Also converts values to other types if specified.
                     * @param message MsgRevokeTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.MsgRevokeTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this MsgRevokeTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for MsgRevokeTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a NewCustomerAddedNoticeMessage. */
                interface INewCustomerAddedNoticeMessage {

                    /** NewCustomerAddedNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** NewCustomerAddedNoticeMessage Contact */
                    Contact?: (Im.Scrm.Ww.Proto.ICustomerMessage|null);
                }

                /** Represents a NewCustomerAddedNoticeMessage. */
                class NewCustomerAddedNoticeMessage implements INewCustomerAddedNoticeMessage {

                    /**
                     * Constructs a new NewCustomerAddedNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.INewCustomerAddedNoticeMessage);

                    /** NewCustomerAddedNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** NewCustomerAddedNoticeMessage Contact. */
                    public Contact?: (Im.Scrm.Ww.Proto.ICustomerMessage|null);

                    /**
                     * Creates a new NewCustomerAddedNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns NewCustomerAddedNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.INewCustomerAddedNoticeMessage): Im.Scrm.Ww.Proto.NewCustomerAddedNoticeMessage;

                    /**
                     * Encodes the specified NewCustomerAddedNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.NewCustomerAddedNoticeMessage.verify|verify} messages.
                     * @param message NewCustomerAddedNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.INewCustomerAddedNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified NewCustomerAddedNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.NewCustomerAddedNoticeMessage.verify|verify} messages.
                     * @param message NewCustomerAddedNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.INewCustomerAddedNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a NewCustomerAddedNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns NewCustomerAddedNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.NewCustomerAddedNoticeMessage;

                    /**
                     * Decodes a NewCustomerAddedNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns NewCustomerAddedNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.NewCustomerAddedNoticeMessage;

                    /**
                     * Verifies a NewCustomerAddedNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a NewCustomerAddedNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns NewCustomerAddedNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.NewCustomerAddedNoticeMessage;

                    /**
                     * Creates a plain object from a NewCustomerAddedNoticeMessage message. Also converts values to other types if specified.
                     * @param message NewCustomerAddedNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.NewCustomerAddedNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this NewCustomerAddedNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for NewCustomerAddedNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a NewCustomerPushNoticeMessage. */
                interface INewCustomerPushNoticeMessage {

                    /** NewCustomerPushNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** NewCustomerPushNoticeMessage Contacts */
                    Contacts?: (Im.Scrm.Ww.Proto.ICustomerMessage[]|null);
                }

                /** Represents a NewCustomerPushNoticeMessage. */
                class NewCustomerPushNoticeMessage implements INewCustomerPushNoticeMessage {

                    /**
                     * Constructs a new NewCustomerPushNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.INewCustomerPushNoticeMessage);

                    /** NewCustomerPushNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** NewCustomerPushNoticeMessage Contacts. */
                    public Contacts: Im.Scrm.Ww.Proto.ICustomerMessage[];

                    /**
                     * Creates a new NewCustomerPushNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns NewCustomerPushNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.INewCustomerPushNoticeMessage): Im.Scrm.Ww.Proto.NewCustomerPushNoticeMessage;

                    /**
                     * Encodes the specified NewCustomerPushNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.NewCustomerPushNoticeMessage.verify|verify} messages.
                     * @param message NewCustomerPushNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.INewCustomerPushNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified NewCustomerPushNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.NewCustomerPushNoticeMessage.verify|verify} messages.
                     * @param message NewCustomerPushNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.INewCustomerPushNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a NewCustomerPushNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns NewCustomerPushNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.NewCustomerPushNoticeMessage;

                    /**
                     * Decodes a NewCustomerPushNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns NewCustomerPushNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.NewCustomerPushNoticeMessage;

                    /**
                     * Verifies a NewCustomerPushNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a NewCustomerPushNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns NewCustomerPushNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.NewCustomerPushNoticeMessage;

                    /**
                     * Creates a plain object from a NewCustomerPushNoticeMessage message. Also converts values to other types if specified.
                     * @param message NewCustomerPushNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.NewCustomerPushNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this NewCustomerPushNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for NewCustomerPushNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** EnumPhoneAction enum. */
                enum EnumPhoneAction {
                    None = 0,
                    Reboot = 1,
                    UploadLog = 2,
                    UploadFile = 3,
                    CleanFileUrlCache = 6
                }

                /** Properties of a PhoneActionTaskMessage. */
                interface IPhoneActionTaskMessage {

                    /** PhoneActionTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** PhoneActionTaskMessage Imei */
                    Imei?: (string|null);

                    /** PhoneActionTaskMessage Action */
                    Action?: (Im.Scrm.Ww.Proto.EnumPhoneAction|null);

                    /** PhoneActionTaskMessage StrParam */
                    StrParam?: (string|null);

                    /** PhoneActionTaskMessage IntParam */
                    IntParam?: (number|null);

                    /** PhoneActionTaskMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents a PhoneActionTaskMessage. */
                class PhoneActionTaskMessage implements IPhoneActionTaskMessage {

                    /**
                     * Constructs a new PhoneActionTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IPhoneActionTaskMessage);

                    /** PhoneActionTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** PhoneActionTaskMessage Imei. */
                    public Imei: string;

                    /** PhoneActionTaskMessage Action. */
                    public Action: Im.Scrm.Ww.Proto.EnumPhoneAction;

                    /** PhoneActionTaskMessage StrParam. */
                    public StrParam: string;

                    /** PhoneActionTaskMessage IntParam. */
                    public IntParam: number;

                    /** PhoneActionTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new PhoneActionTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns PhoneActionTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IPhoneActionTaskMessage): Im.Scrm.Ww.Proto.PhoneActionTaskMessage;

                    /**
                     * Encodes the specified PhoneActionTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.PhoneActionTaskMessage.verify|verify} messages.
                     * @param message PhoneActionTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IPhoneActionTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified PhoneActionTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.PhoneActionTaskMessage.verify|verify} messages.
                     * @param message PhoneActionTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IPhoneActionTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a PhoneActionTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns PhoneActionTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.PhoneActionTaskMessage;

                    /**
                     * Decodes a PhoneActionTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns PhoneActionTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.PhoneActionTaskMessage;

                    /**
                     * Verifies a PhoneActionTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a PhoneActionTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns PhoneActionTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.PhoneActionTaskMessage;

                    /**
                     * Creates a plain object from a PhoneActionTaskMessage message. Also converts values to other types if specified.
                     * @param message PhoneActionTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.PhoneActionTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this PhoneActionTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for PhoneActionTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a PhoneStateTaskMessage. */
                interface IPhoneStateTaskMessage {

                    /** PhoneStateTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** PhoneStateTaskMessage Imei */
                    Imei?: (string|null);
                }

                /** Represents a PhoneStateTaskMessage. */
                class PhoneStateTaskMessage implements IPhoneStateTaskMessage {

                    /**
                     * Constructs a new PhoneStateTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IPhoneStateTaskMessage);

                    /** PhoneStateTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** PhoneStateTaskMessage Imei. */
                    public Imei: string;

                    /**
                     * Creates a new PhoneStateTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns PhoneStateTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IPhoneStateTaskMessage): Im.Scrm.Ww.Proto.PhoneStateTaskMessage;

                    /**
                     * Encodes the specified PhoneStateTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.PhoneStateTaskMessage.verify|verify} messages.
                     * @param message PhoneStateTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IPhoneStateTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified PhoneStateTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.PhoneStateTaskMessage.verify|verify} messages.
                     * @param message PhoneStateTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IPhoneStateTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a PhoneStateTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns PhoneStateTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.PhoneStateTaskMessage;

                    /**
                     * Decodes a PhoneStateTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns PhoneStateTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.PhoneStateTaskMessage;

                    /**
                     * Verifies a PhoneStateTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a PhoneStateTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns PhoneStateTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.PhoneStateTaskMessage;

                    /**
                     * Creates a plain object from a PhoneStateTaskMessage message. Also converts values to other types if specified.
                     * @param message PhoneStateTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.PhoneStateTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this PhoneStateTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for PhoneStateTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a PhoneStateTaskResultNoticeMessage. */
                interface IPhoneStateTaskResultNoticeMessage {

                    /** PhoneStateTaskResultNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** PhoneStateTaskResultNoticeMessage Imei */
                    Imei?: (string|null);

                    /** PhoneStateTaskResultNoticeMessage BatteryLevel */
                    BatteryLevel?: (number|null);

                    /** PhoneStateTaskResultNoticeMessage ChargingState */
                    ChargingState?: (number|null);

                    /** PhoneStateTaskResultNoticeMessage NetType */
                    NetType?: (string|null);

                    /** PhoneStateTaskResultNoticeMessage SdcardFree */
                    SdcardFree?: (number|Long|null);
                }

                /** Represents a PhoneStateTaskResultNoticeMessage. */
                class PhoneStateTaskResultNoticeMessage implements IPhoneStateTaskResultNoticeMessage {

                    /**
                     * Constructs a new PhoneStateTaskResultNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IPhoneStateTaskResultNoticeMessage);

                    /** PhoneStateTaskResultNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** PhoneStateTaskResultNoticeMessage Imei. */
                    public Imei: string;

                    /** PhoneStateTaskResultNoticeMessage BatteryLevel. */
                    public BatteryLevel: number;

                    /** PhoneStateTaskResultNoticeMessage ChargingState. */
                    public ChargingState: number;

                    /** PhoneStateTaskResultNoticeMessage NetType. */
                    public NetType: string;

                    /** PhoneStateTaskResultNoticeMessage SdcardFree. */
                    public SdcardFree: (number|Long);

                    /**
                     * Creates a new PhoneStateTaskResultNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns PhoneStateTaskResultNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IPhoneStateTaskResultNoticeMessage): Im.Scrm.Ww.Proto.PhoneStateTaskResultNoticeMessage;

                    /**
                     * Encodes the specified PhoneStateTaskResultNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.PhoneStateTaskResultNoticeMessage.verify|verify} messages.
                     * @param message PhoneStateTaskResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IPhoneStateTaskResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified PhoneStateTaskResultNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.PhoneStateTaskResultNoticeMessage.verify|verify} messages.
                     * @param message PhoneStateTaskResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IPhoneStateTaskResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a PhoneStateTaskResultNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns PhoneStateTaskResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.PhoneStateTaskResultNoticeMessage;

                    /**
                     * Decodes a PhoneStateTaskResultNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns PhoneStateTaskResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.PhoneStateTaskResultNoticeMessage;

                    /**
                     * Verifies a PhoneStateTaskResultNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a PhoneStateTaskResultNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns PhoneStateTaskResultNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.PhoneStateTaskResultNoticeMessage;

                    /**
                     * Creates a plain object from a PhoneStateTaskResultNoticeMessage message. Also converts values to other types if specified.
                     * @param message PhoneStateTaskResultNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.PhoneStateTaskResultNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this PhoneStateTaskResultNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for PhoneStateTaskResultNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a PhoneStateWarningNoticeMessage. */
                interface IPhoneStateWarningNoticeMessage {

                    /** PhoneStateWarningNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** PhoneStateWarningNoticeMessage Imei */
                    Imei?: (string|null);

                    /** PhoneStateWarningNoticeMessage BatteryLevel */
                    BatteryLevel?: (number|null);

                    /** PhoneStateWarningNoticeMessage ChargingState */
                    ChargingState?: (number|null);

                    /** PhoneStateWarningNoticeMessage NetType */
                    NetType?: (string|null);

                    /** PhoneStateWarningNoticeMessage SdcardFree */
                    SdcardFree?: (number|Long|null);
                }

                /** Represents a PhoneStateWarningNoticeMessage. */
                class PhoneStateWarningNoticeMessage implements IPhoneStateWarningNoticeMessage {

                    /**
                     * Constructs a new PhoneStateWarningNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IPhoneStateWarningNoticeMessage);

                    /** PhoneStateWarningNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** PhoneStateWarningNoticeMessage Imei. */
                    public Imei: string;

                    /** PhoneStateWarningNoticeMessage BatteryLevel. */
                    public BatteryLevel: number;

                    /** PhoneStateWarningNoticeMessage ChargingState. */
                    public ChargingState: number;

                    /** PhoneStateWarningNoticeMessage NetType. */
                    public NetType: string;

                    /** PhoneStateWarningNoticeMessage SdcardFree. */
                    public SdcardFree: (number|Long);

                    /**
                     * Creates a new PhoneStateWarningNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns PhoneStateWarningNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IPhoneStateWarningNoticeMessage): Im.Scrm.Ww.Proto.PhoneStateWarningNoticeMessage;

                    /**
                     * Encodes the specified PhoneStateWarningNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.PhoneStateWarningNoticeMessage.verify|verify} messages.
                     * @param message PhoneStateWarningNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IPhoneStateWarningNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified PhoneStateWarningNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.PhoneStateWarningNoticeMessage.verify|verify} messages.
                     * @param message PhoneStateWarningNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IPhoneStateWarningNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a PhoneStateWarningNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns PhoneStateWarningNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.PhoneStateWarningNoticeMessage;

                    /**
                     * Decodes a PhoneStateWarningNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns PhoneStateWarningNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.PhoneStateWarningNoticeMessage;

                    /**
                     * Verifies a PhoneStateWarningNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a PhoneStateWarningNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns PhoneStateWarningNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.PhoneStateWarningNoticeMessage;

                    /**
                     * Creates a plain object from a PhoneStateWarningNoticeMessage message. Also converts values to other types if specified.
                     * @param message PhoneStateWarningNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.PhoneStateWarningNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this PhoneStateWarningNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for PhoneStateWarningNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a PostMessageReadNoticeMessage. */
                interface IPostMessageReadNoticeMessage {

                    /** PostMessageReadNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** PostMessageReadNoticeMessage ConvId */
                    ConvId?: (number|Long|null);
                }

                /** Represents a PostMessageReadNoticeMessage. */
                class PostMessageReadNoticeMessage implements IPostMessageReadNoticeMessage {

                    /**
                     * Constructs a new PostMessageReadNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IPostMessageReadNoticeMessage);

                    /** PostMessageReadNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** PostMessageReadNoticeMessage ConvId. */
                    public ConvId: (number|Long);

                    /**
                     * Creates a new PostMessageReadNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns PostMessageReadNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IPostMessageReadNoticeMessage): Im.Scrm.Ww.Proto.PostMessageReadNoticeMessage;

                    /**
                     * Encodes the specified PostMessageReadNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.PostMessageReadNoticeMessage.verify|verify} messages.
                     * @param message PostMessageReadNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IPostMessageReadNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified PostMessageReadNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.PostMessageReadNoticeMessage.verify|verify} messages.
                     * @param message PostMessageReadNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IPostMessageReadNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a PostMessageReadNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns PostMessageReadNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.PostMessageReadNoticeMessage;

                    /**
                     * Decodes a PostMessageReadNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns PostMessageReadNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.PostMessageReadNoticeMessage;

                    /**
                     * Verifies a PostMessageReadNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a PostMessageReadNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns PostMessageReadNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.PostMessageReadNoticeMessage;

                    /**
                     * Creates a plain object from a PostMessageReadNoticeMessage message. Also converts values to other types if specified.
                     * @param message PostMessageReadNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.PostMessageReadNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this PostMessageReadNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for PostMessageReadNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a PostSnsTaskMessage. */
                interface IPostSnsTaskMessage {

                    /** PostSnsTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** PostSnsTaskMessage Content */
                    Content?: (string|null);

                    /** PostSnsTaskMessage Media */
                    Media?: (Im.Scrm.Ww.Proto.IMediaMessage|null);

                    /** PostSnsTaskMessage Comment */
                    Comment?: (string|null);

                    /** PostSnsTaskMessage Visible */
                    Visible?: (Im.Scrm.Ww.Proto.IVisibleMessage|null);

                    /** PostSnsTaskMessage TaskId */
                    TaskId?: (number|Long|null);

                    /** PostSnsTaskMessage Poi */
                    Poi?: (Im.Scrm.Ww.Proto.IPoiMessage|null);
                }

                /** Represents a PostSnsTaskMessage. */
                class PostSnsTaskMessage implements IPostSnsTaskMessage {

                    /**
                     * Constructs a new PostSnsTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IPostSnsTaskMessage);

                    /** PostSnsTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** PostSnsTaskMessage Content. */
                    public Content: string;

                    /** PostSnsTaskMessage Media. */
                    public Media?: (Im.Scrm.Ww.Proto.IMediaMessage|null);

                    /** PostSnsTaskMessage Comment. */
                    public Comment: string;

                    /** PostSnsTaskMessage Visible. */
                    public Visible?: (Im.Scrm.Ww.Proto.IVisibleMessage|null);

                    /** PostSnsTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /** PostSnsTaskMessage Poi. */
                    public Poi?: (Im.Scrm.Ww.Proto.IPoiMessage|null);

                    /**
                     * Creates a new PostSnsTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns PostSnsTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IPostSnsTaskMessage): Im.Scrm.Ww.Proto.PostSnsTaskMessage;

                    /**
                     * Encodes the specified PostSnsTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.PostSnsTaskMessage.verify|verify} messages.
                     * @param message PostSnsTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IPostSnsTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified PostSnsTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.PostSnsTaskMessage.verify|verify} messages.
                     * @param message PostSnsTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IPostSnsTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a PostSnsTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns PostSnsTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.PostSnsTaskMessage;

                    /**
                     * Decodes a PostSnsTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns PostSnsTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.PostSnsTaskMessage;

                    /**
                     * Verifies a PostSnsTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a PostSnsTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns PostSnsTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.PostSnsTaskMessage;

                    /**
                     * Creates a plain object from a PostSnsTaskMessage message. Also converts values to other types if specified.
                     * @param message PostSnsTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.PostSnsTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this PostSnsTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for PostSnsTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a MediaMessage. */
                interface IMediaMessage {

                    /** MediaMessage Type */
                    Type?: (Im.Scrm.Ww.Proto.MediaMessage.EnumAttachType|null);

                    /** MediaMessage Content */
                    Content?: (string[]|null);
                }

                /** Represents a MediaMessage. */
                class MediaMessage implements IMediaMessage {

                    /**
                     * Constructs a new MediaMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IMediaMessage);

                    /** MediaMessage Type. */
                    public Type: Im.Scrm.Ww.Proto.MediaMessage.EnumAttachType;

                    /** MediaMessage Content. */
                    public Content: string[];

                    /**
                     * Creates a new MediaMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns MediaMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IMediaMessage): Im.Scrm.Ww.Proto.MediaMessage;

                    /**
                     * Encodes the specified MediaMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.MediaMessage.verify|verify} messages.
                     * @param message MediaMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IMediaMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified MediaMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.MediaMessage.verify|verify} messages.
                     * @param message MediaMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IMediaMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a MediaMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns MediaMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.MediaMessage;

                    /**
                     * Decodes a MediaMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns MediaMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.MediaMessage;

                    /**
                     * Verifies a MediaMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a MediaMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns MediaMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.MediaMessage;

                    /**
                     * Creates a plain object from a MediaMessage message. Also converts values to other types if specified.
                     * @param message MediaMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.MediaMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this MediaMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for MediaMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                namespace MediaMessage {

                    /** EnumAttachType enum. */
                    enum EnumAttachType {
                        Picture = 0,
                        Video = 1,
                        Link = 2
                    }
                }

                /** Properties of a VisibleMessage. */
                interface IVisibleMessage {

                    /** VisibleMessage userIds */
                    userIds?: ((number|Long)[]|null);

                    /** VisibleMessage labelIds */
                    labelIds?: ((number|Long)[]|null);
                }

                /** Represents a VisibleMessage. */
                class VisibleMessage implements IVisibleMessage {

                    /**
                     * Constructs a new VisibleMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IVisibleMessage);

                    /** VisibleMessage userIds. */
                    public userIds: (number|Long)[];

                    /** VisibleMessage labelIds. */
                    public labelIds: (number|Long)[];

                    /**
                     * Creates a new VisibleMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns VisibleMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IVisibleMessage): Im.Scrm.Ww.Proto.VisibleMessage;

                    /**
                     * Encodes the specified VisibleMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.VisibleMessage.verify|verify} messages.
                     * @param message VisibleMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IVisibleMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified VisibleMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.VisibleMessage.verify|verify} messages.
                     * @param message VisibleMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IVisibleMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a VisibleMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns VisibleMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.VisibleMessage;

                    /**
                     * Decodes a VisibleMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns VisibleMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.VisibleMessage;

                    /**
                     * Verifies a VisibleMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a VisibleMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns VisibleMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.VisibleMessage;

                    /**
                     * Creates a plain object from a VisibleMessage message. Also converts values to other types if specified.
                     * @param message VisibleMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.VisibleMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this VisibleMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for VisibleMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a PoiMessage. */
                interface IPoiMessage {

                    /** PoiMessage City */
                    City?: (string|null);

                    /** PoiMessage Address */
                    Address?: (string|null);

                    /** PoiMessage PoiName */
                    PoiName?: (string|null);

                    /** PoiMessage Lon */
                    Lon?: (number|null);

                    /** PoiMessage Lat */
                    Lat?: (number|null);
                }

                /** Represents a PoiMessage. */
                class PoiMessage implements IPoiMessage {

                    /**
                     * Constructs a new PoiMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IPoiMessage);

                    /** PoiMessage City. */
                    public City: string;

                    /** PoiMessage Address. */
                    public Address: string;

                    /** PoiMessage PoiName. */
                    public PoiName: string;

                    /** PoiMessage Lon. */
                    public Lon: number;

                    /** PoiMessage Lat. */
                    public Lat: number;

                    /**
                     * Creates a new PoiMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns PoiMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IPoiMessage): Im.Scrm.Ww.Proto.PoiMessage;

                    /**
                     * Encodes the specified PoiMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.PoiMessage.verify|verify} messages.
                     * @param message PoiMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IPoiMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified PoiMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.PoiMessage.verify|verify} messages.
                     * @param message PoiMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IPoiMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a PoiMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns PoiMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.PoiMessage;

                    /**
                     * Decodes a PoiMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns PoiMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.PoiMessage;

                    /**
                     * Verifies a PoiMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a PoiMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns PoiMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.PoiMessage;

                    /**
                     * Creates a plain object from a PoiMessage message. Also converts values to other types if specified.
                     * @param message PoiMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.PoiMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this PoiMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for PoiMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a PostSnsTaskResultNoticeMessage. */
                interface IPostSnsTaskResultNoticeMessage {

                    /** PostSnsTaskResultNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** PostSnsTaskResultNoticeMessage Success */
                    Success?: (boolean|null);

                    /** PostSnsTaskResultNoticeMessage ErrMsg */
                    ErrMsg?: (string|null);

                    /** PostSnsTaskResultNoticeMessage TaskId */
                    TaskId?: (number|Long|null);

                    /** PostSnsTaskResultNoticeMessage SnsId */
                    SnsId?: (number|Long|null);

                    /** PostSnsTaskResultNoticeMessage PostId */
                    PostId?: (string|null);

                    /** PostSnsTaskResultNoticeMessage CommentId */
                    CommentId?: (number|Long|null);
                }

                /** Represents a PostSnsTaskResultNoticeMessage. */
                class PostSnsTaskResultNoticeMessage implements IPostSnsTaskResultNoticeMessage {

                    /**
                     * Constructs a new PostSnsTaskResultNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IPostSnsTaskResultNoticeMessage);

                    /** PostSnsTaskResultNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** PostSnsTaskResultNoticeMessage Success. */
                    public Success: boolean;

                    /** PostSnsTaskResultNoticeMessage ErrMsg. */
                    public ErrMsg: string;

                    /** PostSnsTaskResultNoticeMessage TaskId. */
                    public TaskId: (number|Long);

                    /** PostSnsTaskResultNoticeMessage SnsId. */
                    public SnsId: (number|Long);

                    /** PostSnsTaskResultNoticeMessage PostId. */
                    public PostId: string;

                    /** PostSnsTaskResultNoticeMessage CommentId. */
                    public CommentId: (number|Long);

                    /**
                     * Creates a new PostSnsTaskResultNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns PostSnsTaskResultNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IPostSnsTaskResultNoticeMessage): Im.Scrm.Ww.Proto.PostSnsTaskResultNoticeMessage;

                    /**
                     * Encodes the specified PostSnsTaskResultNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.PostSnsTaskResultNoticeMessage.verify|verify} messages.
                     * @param message PostSnsTaskResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IPostSnsTaskResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified PostSnsTaskResultNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.PostSnsTaskResultNoticeMessage.verify|verify} messages.
                     * @param message PostSnsTaskResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IPostSnsTaskResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a PostSnsTaskResultNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns PostSnsTaskResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.PostSnsTaskResultNoticeMessage;

                    /**
                     * Decodes a PostSnsTaskResultNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns PostSnsTaskResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.PostSnsTaskResultNoticeMessage;

                    /**
                     * Verifies a PostSnsTaskResultNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a PostSnsTaskResultNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns PostSnsTaskResultNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.PostSnsTaskResultNoticeMessage;

                    /**
                     * Creates a plain object from a PostSnsTaskResultNoticeMessage message. Also converts values to other types if specified.
                     * @param message PostSnsTaskResultNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.PostSnsTaskResultNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this PostSnsTaskResultNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for PostSnsTaskResultNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a PostSnsTaskTaskMessage. */
                interface IPostSnsTaskTaskMessage {

                    /** PostSnsTaskTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** PostSnsTaskTaskMessage SnsId */
                    SnsId?: (number|Long|null);

                    /** PostSnsTaskTaskMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents a PostSnsTaskTaskMessage. */
                class PostSnsTaskTaskMessage implements IPostSnsTaskTaskMessage {

                    /**
                     * Constructs a new PostSnsTaskTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IPostSnsTaskTaskMessage);

                    /** PostSnsTaskTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** PostSnsTaskTaskMessage SnsId. */
                    public SnsId: (number|Long);

                    /** PostSnsTaskTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new PostSnsTaskTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns PostSnsTaskTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IPostSnsTaskTaskMessage): Im.Scrm.Ww.Proto.PostSnsTaskTaskMessage;

                    /**
                     * Encodes the specified PostSnsTaskTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.PostSnsTaskTaskMessage.verify|verify} messages.
                     * @param message PostSnsTaskTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IPostSnsTaskTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified PostSnsTaskTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.PostSnsTaskTaskMessage.verify|verify} messages.
                     * @param message PostSnsTaskTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IPostSnsTaskTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a PostSnsTaskTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns PostSnsTaskTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.PostSnsTaskTaskMessage;

                    /**
                     * Decodes a PostSnsTaskTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns PostSnsTaskTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.PostSnsTaskTaskMessage;

                    /**
                     * Verifies a PostSnsTaskTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a PostSnsTaskTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns PostSnsTaskTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.PostSnsTaskTaskMessage;

                    /**
                     * Creates a plain object from a PostSnsTaskTaskMessage message. Also converts values to other types if specified.
                     * @param message PostSnsTaskTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.PostSnsTaskTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this PostSnsTaskTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for PostSnsTaskTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a PullMyQrCodeTaskMessage. */
                interface IPullMyQrCodeTaskMessage {

                    /** PullMyQrCodeTaskMessage WxId */
                    WxId?: (number|Long|null);
                }

                /** Represents a PullMyQrCodeTaskMessage. */
                class PullMyQrCodeTaskMessage implements IPullMyQrCodeTaskMessage {

                    /**
                     * Constructs a new PullMyQrCodeTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IPullMyQrCodeTaskMessage);

                    /** PullMyQrCodeTaskMessage WxId. */
                    public WxId: (number|Long);

                    /**
                     * Creates a new PullMyQrCodeTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns PullMyQrCodeTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IPullMyQrCodeTaskMessage): Im.Scrm.Ww.Proto.PullMyQrCodeTaskMessage;

                    /**
                     * Encodes the specified PullMyQrCodeTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.PullMyQrCodeTaskMessage.verify|verify} messages.
                     * @param message PullMyQrCodeTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IPullMyQrCodeTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified PullMyQrCodeTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.PullMyQrCodeTaskMessage.verify|verify} messages.
                     * @param message PullMyQrCodeTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IPullMyQrCodeTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a PullMyQrCodeTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns PullMyQrCodeTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.PullMyQrCodeTaskMessage;

                    /**
                     * Decodes a PullMyQrCodeTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns PullMyQrCodeTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.PullMyQrCodeTaskMessage;

                    /**
                     * Verifies a PullMyQrCodeTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a PullMyQrCodeTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns PullMyQrCodeTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.PullMyQrCodeTaskMessage;

                    /**
                     * Creates a plain object from a PullMyQrCodeTaskMessage message. Also converts values to other types if specified.
                     * @param message PullMyQrCodeTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.PullMyQrCodeTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this PullMyQrCodeTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for PullMyQrCodeTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a PullMyQrCodeTaskResultNoticeMessage. */
                interface IPullMyQrCodeTaskResultNoticeMessage {

                    /** PullMyQrCodeTaskResultNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** PullMyQrCodeTaskResultNoticeMessage Success */
                    Success?: (boolean|null);

                    /** PullMyQrCodeTaskResultNoticeMessage ErrMsg */
                    ErrMsg?: (string|null);

                    /** PullMyQrCodeTaskResultNoticeMessage Url */
                    Url?: (string|null);
                }

                /** Represents a PullMyQrCodeTaskResultNoticeMessage. */
                class PullMyQrCodeTaskResultNoticeMessage implements IPullMyQrCodeTaskResultNoticeMessage {

                    /**
                     * Constructs a new PullMyQrCodeTaskResultNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IPullMyQrCodeTaskResultNoticeMessage);

                    /** PullMyQrCodeTaskResultNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** PullMyQrCodeTaskResultNoticeMessage Success. */
                    public Success: boolean;

                    /** PullMyQrCodeTaskResultNoticeMessage ErrMsg. */
                    public ErrMsg: string;

                    /** PullMyQrCodeTaskResultNoticeMessage Url. */
                    public Url: string;

                    /**
                     * Creates a new PullMyQrCodeTaskResultNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns PullMyQrCodeTaskResultNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IPullMyQrCodeTaskResultNoticeMessage): Im.Scrm.Ww.Proto.PullMyQrCodeTaskResultNoticeMessage;

                    /**
                     * Encodes the specified PullMyQrCodeTaskResultNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.PullMyQrCodeTaskResultNoticeMessage.verify|verify} messages.
                     * @param message PullMyQrCodeTaskResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IPullMyQrCodeTaskResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified PullMyQrCodeTaskResultNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.PullMyQrCodeTaskResultNoticeMessage.verify|verify} messages.
                     * @param message PullMyQrCodeTaskResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IPullMyQrCodeTaskResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a PullMyQrCodeTaskResultNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns PullMyQrCodeTaskResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.PullMyQrCodeTaskResultNoticeMessage;

                    /**
                     * Decodes a PullMyQrCodeTaskResultNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns PullMyQrCodeTaskResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.PullMyQrCodeTaskResultNoticeMessage;

                    /**
                     * Verifies a PullMyQrCodeTaskResultNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a PullMyQrCodeTaskResultNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns PullMyQrCodeTaskResultNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.PullMyQrCodeTaskResultNoticeMessage;

                    /**
                     * Creates a plain object from a PullMyQrCodeTaskResultNoticeMessage message. Also converts values to other types if specified.
                     * @param message PullMyQrCodeTaskResultNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.PullMyQrCodeTaskResultNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this PullMyQrCodeTaskResultNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for PullMyQrCodeTaskResultNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a PullMySnsListTaskMessage. */
                interface IPullMySnsListTaskMessage {

                    /** PullMySnsListTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** PullMySnsListTaskMessage Seq */
                    Seq?: (number|Long|null);
                }

                /** Represents a PullMySnsListTaskMessage. */
                class PullMySnsListTaskMessage implements IPullMySnsListTaskMessage {

                    /**
                     * Constructs a new PullMySnsListTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IPullMySnsListTaskMessage);

                    /** PullMySnsListTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** PullMySnsListTaskMessage Seq. */
                    public Seq: (number|Long);

                    /**
                     * Creates a new PullMySnsListTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns PullMySnsListTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IPullMySnsListTaskMessage): Im.Scrm.Ww.Proto.PullMySnsListTaskMessage;

                    /**
                     * Encodes the specified PullMySnsListTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.PullMySnsListTaskMessage.verify|verify} messages.
                     * @param message PullMySnsListTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IPullMySnsListTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified PullMySnsListTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.PullMySnsListTaskMessage.verify|verify} messages.
                     * @param message PullMySnsListTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IPullMySnsListTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a PullMySnsListTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns PullMySnsListTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.PullMySnsListTaskMessage;

                    /**
                     * Decodes a PullMySnsListTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns PullMySnsListTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.PullMySnsListTaskMessage;

                    /**
                     * Verifies a PullMySnsListTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a PullMySnsListTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns PullMySnsListTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.PullMySnsListTaskMessage;

                    /**
                     * Creates a plain object from a PullMySnsListTaskMessage message. Also converts values to other types if specified.
                     * @param message PullMySnsListTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.PullMySnsListTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this PullMySnsListTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for PullMySnsListTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a PullSnsTaskListTaskMessage. */
                interface IPullSnsTaskListTaskMessage {

                    /** PullSnsTaskListTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** PullSnsTaskListTaskMessage ShowAll */
                    ShowAll?: (boolean|null);
                }

                /** Represents a PullSnsTaskListTaskMessage. */
                class PullSnsTaskListTaskMessage implements IPullSnsTaskListTaskMessage {

                    /**
                     * Constructs a new PullSnsTaskListTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IPullSnsTaskListTaskMessage);

                    /** PullSnsTaskListTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** PullSnsTaskListTaskMessage ShowAll. */
                    public ShowAll: boolean;

                    /**
                     * Creates a new PullSnsTaskListTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns PullSnsTaskListTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IPullSnsTaskListTaskMessage): Im.Scrm.Ww.Proto.PullSnsTaskListTaskMessage;

                    /**
                     * Encodes the specified PullSnsTaskListTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.PullSnsTaskListTaskMessage.verify|verify} messages.
                     * @param message PullSnsTaskListTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IPullSnsTaskListTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified PullSnsTaskListTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.PullSnsTaskListTaskMessage.verify|verify} messages.
                     * @param message PullSnsTaskListTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IPullSnsTaskListTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a PullSnsTaskListTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns PullSnsTaskListTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.PullSnsTaskListTaskMessage;

                    /**
                     * Decodes a PullSnsTaskListTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns PullSnsTaskListTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.PullSnsTaskListTaskMessage;

                    /**
                     * Verifies a PullSnsTaskListTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a PullSnsTaskListTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns PullSnsTaskListTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.PullSnsTaskListTaskMessage;

                    /**
                     * Creates a plain object from a PullSnsTaskListTaskMessage message. Also converts values to other types if specified.
                     * @param message PullSnsTaskListTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.PullSnsTaskListTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this PullSnsTaskListTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for PullSnsTaskListTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a PullSnsTaskListTaskResultNoticeMessage. */
                interface IPullSnsTaskListTaskResultNoticeMessage {

                    /** PullSnsTaskListTaskResultNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** PullSnsTaskListTaskResultNoticeMessage Success */
                    Success?: (boolean|null);

                    /** PullSnsTaskListTaskResultNoticeMessage ErrMsg */
                    ErrMsg?: (string|null);

                    /** PullSnsTaskListTaskResultNoticeMessage TaskList */
                    TaskList?: (Im.Scrm.Ww.Proto.ISnsTaskMessage[]|null);
                }

                /** Represents a PullSnsTaskListTaskResultNoticeMessage. */
                class PullSnsTaskListTaskResultNoticeMessage implements IPullSnsTaskListTaskResultNoticeMessage {

                    /**
                     * Constructs a new PullSnsTaskListTaskResultNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IPullSnsTaskListTaskResultNoticeMessage);

                    /** PullSnsTaskListTaskResultNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** PullSnsTaskListTaskResultNoticeMessage Success. */
                    public Success: boolean;

                    /** PullSnsTaskListTaskResultNoticeMessage ErrMsg. */
                    public ErrMsg: string;

                    /** PullSnsTaskListTaskResultNoticeMessage TaskList. */
                    public TaskList: Im.Scrm.Ww.Proto.ISnsTaskMessage[];

                    /**
                     * Creates a new PullSnsTaskListTaskResultNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns PullSnsTaskListTaskResultNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IPullSnsTaskListTaskResultNoticeMessage): Im.Scrm.Ww.Proto.PullSnsTaskListTaskResultNoticeMessage;

                    /**
                     * Encodes the specified PullSnsTaskListTaskResultNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.PullSnsTaskListTaskResultNoticeMessage.verify|verify} messages.
                     * @param message PullSnsTaskListTaskResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IPullSnsTaskListTaskResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified PullSnsTaskListTaskResultNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.PullSnsTaskListTaskResultNoticeMessage.verify|verify} messages.
                     * @param message PullSnsTaskListTaskResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IPullSnsTaskListTaskResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a PullSnsTaskListTaskResultNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns PullSnsTaskListTaskResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.PullSnsTaskListTaskResultNoticeMessage;

                    /**
                     * Decodes a PullSnsTaskListTaskResultNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns PullSnsTaskListTaskResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.PullSnsTaskListTaskResultNoticeMessage;

                    /**
                     * Verifies a PullSnsTaskListTaskResultNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a PullSnsTaskListTaskResultNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns PullSnsTaskListTaskResultNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.PullSnsTaskListTaskResultNoticeMessage;

                    /**
                     * Creates a plain object from a PullSnsTaskListTaskResultNoticeMessage message. Also converts values to other types if specified.
                     * @param message PullSnsTaskListTaskResultNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.PullSnsTaskListTaskResultNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this PullSnsTaskListTaskResultNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for PullSnsTaskListTaskResultNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a SnsTaskMessage. */
                interface ISnsTaskMessage {

                    /** SnsTaskMessage Author */
                    Author?: (number|Long|null);

                    /** SnsTaskMessage SnsInfo */
                    SnsInfo?: (Im.Scrm.Ww.Proto.ISnsInfoMessage|null);

                    /** SnsTaskMessage Posted */
                    Posted?: (boolean|null);
                }

                /** Represents a SnsTaskMessage. */
                class SnsTaskMessage implements ISnsTaskMessage {

                    /**
                     * Constructs a new SnsTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ISnsTaskMessage);

                    /** SnsTaskMessage Author. */
                    public Author: (number|Long);

                    /** SnsTaskMessage SnsInfo. */
                    public SnsInfo?: (Im.Scrm.Ww.Proto.ISnsInfoMessage|null);

                    /** SnsTaskMessage Posted. */
                    public Posted: boolean;

                    /**
                     * Creates a new SnsTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns SnsTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ISnsTaskMessage): Im.Scrm.Ww.Proto.SnsTaskMessage;

                    /**
                     * Encodes the specified SnsTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.SnsTaskMessage.verify|verify} messages.
                     * @param message SnsTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ISnsTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified SnsTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.SnsTaskMessage.verify|verify} messages.
                     * @param message SnsTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ISnsTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a SnsTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns SnsTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.SnsTaskMessage;

                    /**
                     * Decodes a SnsTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns SnsTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.SnsTaskMessage;

                    /**
                     * Verifies a SnsTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a SnsTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns SnsTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.SnsTaskMessage;

                    /**
                     * Creates a plain object from a SnsTaskMessage message. Also converts values to other types if specified.
                     * @param message SnsTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.SnsTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this SnsTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for SnsTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a TalkMessage. */
                interface ITalkMessage {

                    /** TalkMessage ContentType */
                    ContentType?: (Im.Scrm.Ww.Proto.EnumContentType|null);

                    /** TalkMessage Content */
                    Content?: (Uint8Array|null);
                }

                /** Represents a TalkMessage. */
                class TalkMessage implements ITalkMessage {

                    /**
                     * Constructs a new TalkMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ITalkMessage);

                    /** TalkMessage ContentType. */
                    public ContentType: Im.Scrm.Ww.Proto.EnumContentType;

                    /** TalkMessage Content. */
                    public Content: Uint8Array;

                    /**
                     * Creates a new TalkMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns TalkMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ITalkMessage): Im.Scrm.Ww.Proto.TalkMessage;

                    /**
                     * Encodes the specified TalkMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.TalkMessage.verify|verify} messages.
                     * @param message TalkMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ITalkMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified TalkMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.TalkMessage.verify|verify} messages.
                     * @param message TalkMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ITalkMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a TalkMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns TalkMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.TalkMessage;

                    /**
                     * Decodes a TalkMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns TalkMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.TalkMessage;

                    /**
                     * Verifies a TalkMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a TalkMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns TalkMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.TalkMessage;

                    /**
                     * Creates a plain object from a TalkMessage message. Also converts values to other types if specified.
                     * @param message TalkMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.TalkMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this TalkMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for TalkMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a QunFaTaskMessage. */
                interface IQunFaTaskMessage {

                    /** QunFaTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** QunFaTaskMessage Msgs */
                    Msgs?: (Im.Scrm.Ww.Proto.ITalkMessage[]|null);

                    /** QunFaTaskMessage ConvId */
                    ConvId?: ((number|Long)[]|null);

                    /** QunFaTaskMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents a QunFaTaskMessage. */
                class QunFaTaskMessage implements IQunFaTaskMessage {

                    /**
                     * Constructs a new QunFaTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IQunFaTaskMessage);

                    /** QunFaTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** QunFaTaskMessage Msgs. */
                    public Msgs: Im.Scrm.Ww.Proto.ITalkMessage[];

                    /** QunFaTaskMessage ConvId. */
                    public ConvId: (number|Long)[];

                    /** QunFaTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new QunFaTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns QunFaTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IQunFaTaskMessage): Im.Scrm.Ww.Proto.QunFaTaskMessage;

                    /**
                     * Encodes the specified QunFaTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.QunFaTaskMessage.verify|verify} messages.
                     * @param message QunFaTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IQunFaTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified QunFaTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.QunFaTaskMessage.verify|verify} messages.
                     * @param message QunFaTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IQunFaTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a QunFaTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns QunFaTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.QunFaTaskMessage;

                    /**
                     * Decodes a QunFaTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns QunFaTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.QunFaTaskMessage;

                    /**
                     * Verifies a QunFaTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a QunFaTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns QunFaTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.QunFaTaskMessage;

                    /**
                     * Creates a plain object from a QunFaTaskMessage message. Also converts values to other types if specified.
                     * @param message QunFaTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.QunFaTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this QunFaTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for QunFaTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a RedirectNoticeMessage. */
                interface IRedirectNoticeMessage {

                    /** RedirectNoticeMessage Type */
                    Type?: (number|null);

                    /** RedirectNoticeMessage ServerUrl */
                    ServerUrl?: (string|null);

                    /** RedirectNoticeMessage ServerPort */
                    ServerPort?: (number|null);
                }

                /** Represents a RedirectNoticeMessage. */
                class RedirectNoticeMessage implements IRedirectNoticeMessage {

                    /**
                     * Constructs a new RedirectNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IRedirectNoticeMessage);

                    /** RedirectNoticeMessage Type. */
                    public Type: number;

                    /** RedirectNoticeMessage ServerUrl. */
                    public ServerUrl: string;

                    /** RedirectNoticeMessage ServerPort. */
                    public ServerPort: number;

                    /**
                     * Creates a new RedirectNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns RedirectNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IRedirectNoticeMessage): Im.Scrm.Ww.Proto.RedirectNoticeMessage;

                    /**
                     * Encodes the specified RedirectNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.RedirectNoticeMessage.verify|verify} messages.
                     * @param message RedirectNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IRedirectNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified RedirectNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.RedirectNoticeMessage.verify|verify} messages.
                     * @param message RedirectNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IRedirectNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a RedirectNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns RedirectNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.RedirectNoticeMessage;

                    /**
                     * Decodes a RedirectNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns RedirectNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.RedirectNoticeMessage;

                    /**
                     * Verifies a RedirectNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a RedirectNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns RedirectNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.RedirectNoticeMessage;

                    /**
                     * Creates a plain object from a RedirectNoticeMessage message. Also converts values to other types if specified.
                     * @param message RedirectNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.RedirectNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this RedirectNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for RedirectNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a SearchMsgTaskMessage. */
                interface ISearchMsgTaskMessage {

                    /** SearchMsgTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** SearchMsgTaskMessage ConvId */
                    ConvId?: (number|Long|null);

                    /** SearchMsgTaskMessage Keyword */
                    Keyword?: (string|null);
                }

                /** Represents a SearchMsgTaskMessage. */
                class SearchMsgTaskMessage implements ISearchMsgTaskMessage {

                    /**
                     * Constructs a new SearchMsgTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ISearchMsgTaskMessage);

                    /** SearchMsgTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** SearchMsgTaskMessage ConvId. */
                    public ConvId: (number|Long);

                    /** SearchMsgTaskMessage Keyword. */
                    public Keyword: string;

                    /**
                     * Creates a new SearchMsgTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns SearchMsgTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ISearchMsgTaskMessage): Im.Scrm.Ww.Proto.SearchMsgTaskMessage;

                    /**
                     * Encodes the specified SearchMsgTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.SearchMsgTaskMessage.verify|verify} messages.
                     * @param message SearchMsgTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ISearchMsgTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified SearchMsgTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.SearchMsgTaskMessage.verify|verify} messages.
                     * @param message SearchMsgTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ISearchMsgTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a SearchMsgTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns SearchMsgTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.SearchMsgTaskMessage;

                    /**
                     * Decodes a SearchMsgTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns SearchMsgTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.SearchMsgTaskMessage;

                    /**
                     * Verifies a SearchMsgTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a SearchMsgTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns SearchMsgTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.SearchMsgTaskMessage;

                    /**
                     * Creates a plain object from a SearchMsgTaskMessage message. Also converts values to other types if specified.
                     * @param message SearchMsgTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.SearchMsgTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this SearchMsgTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for SearchMsgTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a ConvMessage. */
                interface IConvMessage {

                    /** ConvMessage Id */
                    Id?: (number|Long|null);

                    /** ConvMessage RemoteId */
                    RemoteId?: (number|Long|null);

                    /** ConvMessage Name */
                    Name?: (string|null);

                    /** ConvMessage Avatar */
                    Avatar?: (string|null);

                    /** ConvMessage Type */
                    Type?: (number|null);
                }

                /** Represents a ConvMessage. */
                class ConvMessage implements IConvMessage {

                    /**
                     * Constructs a new ConvMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IConvMessage);

                    /** ConvMessage Id. */
                    public Id: (number|Long);

                    /** ConvMessage RemoteId. */
                    public RemoteId: (number|Long);

                    /** ConvMessage Name. */
                    public Name: string;

                    /** ConvMessage Avatar. */
                    public Avatar: string;

                    /** ConvMessage Type. */
                    public Type: number;

                    /**
                     * Creates a new ConvMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ConvMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IConvMessage): Im.Scrm.Ww.Proto.ConvMessage;

                    /**
                     * Encodes the specified ConvMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.ConvMessage.verify|verify} messages.
                     * @param message ConvMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IConvMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ConvMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.ConvMessage.verify|verify} messages.
                     * @param message ConvMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IConvMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ConvMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ConvMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.ConvMessage;

                    /**
                     * Decodes a ConvMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ConvMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.ConvMessage;

                    /**
                     * Verifies a ConvMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ConvMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ConvMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.ConvMessage;

                    /**
                     * Creates a plain object from a ConvMessage message. Also converts values to other types if specified.
                     * @param message ConvMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.ConvMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ConvMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ConvMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a SearchResult. */
                interface ISearchResult {

                    /** SearchResult conv */
                    conv?: (Im.Scrm.Ww.Proto.IConvMessage|null);

                    /** SearchResult Msgs */
                    Msgs?: (Im.Scrm.Ww.Proto.IChatMessage[]|null);
                }

                /** Represents a SearchResult. */
                class SearchResult implements ISearchResult {

                    /**
                     * Constructs a new SearchResult.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ISearchResult);

                    /** SearchResult conv. */
                    public conv?: (Im.Scrm.Ww.Proto.IConvMessage|null);

                    /** SearchResult Msgs. */
                    public Msgs: Im.Scrm.Ww.Proto.IChatMessage[];

                    /**
                     * Creates a new SearchResult instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns SearchResult instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ISearchResult): Im.Scrm.Ww.Proto.SearchResult;

                    /**
                     * Encodes the specified SearchResult message. Does not implicitly {@link Im.Scrm.Ww.Proto.SearchResult.verify|verify} messages.
                     * @param message SearchResult message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ISearchResult, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified SearchResult message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.SearchResult.verify|verify} messages.
                     * @param message SearchResult message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ISearchResult, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a SearchResult message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns SearchResult
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.SearchResult;

                    /**
                     * Decodes a SearchResult message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns SearchResult
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.SearchResult;

                    /**
                     * Verifies a SearchResult message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a SearchResult message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns SearchResult
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.SearchResult;

                    /**
                     * Creates a plain object from a SearchResult message. Also converts values to other types if specified.
                     * @param message SearchResult
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.SearchResult, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this SearchResult to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for SearchResult
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a SearchMsgTaskResultNoticeMessage. */
                interface ISearchMsgTaskResultNoticeMessage {

                    /** SearchMsgTaskResultNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** SearchMsgTaskResultNoticeMessage Keyword */
                    Keyword?: (string|null);

                    /** SearchMsgTaskResultNoticeMessage Success */
                    Success?: (boolean|null);

                    /** SearchMsgTaskResultNoticeMessage ErrMsg */
                    ErrMsg?: (string|null);

                    /** SearchMsgTaskResultNoticeMessage Results */
                    Results?: (Im.Scrm.Ww.Proto.ISearchResult[]|null);
                }

                /** Represents a SearchMsgTaskResultNoticeMessage. */
                class SearchMsgTaskResultNoticeMessage implements ISearchMsgTaskResultNoticeMessage {

                    /**
                     * Constructs a new SearchMsgTaskResultNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ISearchMsgTaskResultNoticeMessage);

                    /** SearchMsgTaskResultNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** SearchMsgTaskResultNoticeMessage Keyword. */
                    public Keyword: string;

                    /** SearchMsgTaskResultNoticeMessage Success. */
                    public Success: boolean;

                    /** SearchMsgTaskResultNoticeMessage ErrMsg. */
                    public ErrMsg: string;

                    /** SearchMsgTaskResultNoticeMessage Results. */
                    public Results: Im.Scrm.Ww.Proto.ISearchResult[];

                    /**
                     * Creates a new SearchMsgTaskResultNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns SearchMsgTaskResultNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ISearchMsgTaskResultNoticeMessage): Im.Scrm.Ww.Proto.SearchMsgTaskResultNoticeMessage;

                    /**
                     * Encodes the specified SearchMsgTaskResultNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.SearchMsgTaskResultNoticeMessage.verify|verify} messages.
                     * @param message SearchMsgTaskResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ISearchMsgTaskResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified SearchMsgTaskResultNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.SearchMsgTaskResultNoticeMessage.verify|verify} messages.
                     * @param message SearchMsgTaskResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ISearchMsgTaskResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a SearchMsgTaskResultNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns SearchMsgTaskResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.SearchMsgTaskResultNoticeMessage;

                    /**
                     * Decodes a SearchMsgTaskResultNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns SearchMsgTaskResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.SearchMsgTaskResultNoticeMessage;

                    /**
                     * Verifies a SearchMsgTaskResultNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a SearchMsgTaskResultNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns SearchMsgTaskResultNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.SearchMsgTaskResultNoticeMessage;

                    /**
                     * Creates a plain object from a SearchMsgTaskResultNoticeMessage message. Also converts values to other types if specified.
                     * @param message SearchMsgTaskResultNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.SearchMsgTaskResultNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this SearchMsgTaskResultNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for SearchMsgTaskResultNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a SetUserMemoTaskMessage. */
                interface ISetUserMemoTaskMessage {

                    /** SetUserMemoTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** SetUserMemoTaskMessage RemoteId */
                    RemoteId?: (number|Long|null);

                    /** SetUserMemoTaskMessage Memo */
                    Memo?: (string|null);

                    /** SetUserMemoTaskMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents a SetUserMemoTaskMessage. */
                class SetUserMemoTaskMessage implements ISetUserMemoTaskMessage {

                    /**
                     * Constructs a new SetUserMemoTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ISetUserMemoTaskMessage);

                    /** SetUserMemoTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** SetUserMemoTaskMessage RemoteId. */
                    public RemoteId: (number|Long);

                    /** SetUserMemoTaskMessage Memo. */
                    public Memo: string;

                    /** SetUserMemoTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new SetUserMemoTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns SetUserMemoTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ISetUserMemoTaskMessage): Im.Scrm.Ww.Proto.SetUserMemoTaskMessage;

                    /**
                     * Encodes the specified SetUserMemoTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.SetUserMemoTaskMessage.verify|verify} messages.
                     * @param message SetUserMemoTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ISetUserMemoTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified SetUserMemoTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.SetUserMemoTaskMessage.verify|verify} messages.
                     * @param message SetUserMemoTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ISetUserMemoTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a SetUserMemoTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns SetUserMemoTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.SetUserMemoTaskMessage;

                    /**
                     * Decodes a SetUserMemoTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns SetUserMemoTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.SetUserMemoTaskMessage;

                    /**
                     * Verifies a SetUserMemoTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a SetUserMemoTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns SetUserMemoTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.SetUserMemoTaskMessage;

                    /**
                     * Creates a plain object from a SetUserMemoTaskMessage message. Also converts values to other types if specified.
                     * @param message SetUserMemoTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.SetUserMemoTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this SetUserMemoTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for SetUserMemoTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a SnsCommentTaskMessage. */
                interface ISnsCommentTaskMessage {

                    /** SnsCommentTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** SnsCommentTaskMessage SnsId */
                    SnsId?: (number|Long|null);

                    /** SnsCommentTaskMessage PostId */
                    PostId?: (string|null);

                    /** SnsCommentTaskMessage Comment */
                    Comment?: (string|null);

                    /** SnsCommentTaskMessage RefWxId */
                    RefWxId?: (number|Long|null);

                    /** SnsCommentTaskMessage RefCommentId */
                    RefCommentId?: (number|Long|null);

                    /** SnsCommentTaskMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents a SnsCommentTaskMessage. */
                class SnsCommentTaskMessage implements ISnsCommentTaskMessage {

                    /**
                     * Constructs a new SnsCommentTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ISnsCommentTaskMessage);

                    /** SnsCommentTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** SnsCommentTaskMessage SnsId. */
                    public SnsId: (number|Long);

                    /** SnsCommentTaskMessage PostId. */
                    public PostId: string;

                    /** SnsCommentTaskMessage Comment. */
                    public Comment: string;

                    /** SnsCommentTaskMessage RefWxId. */
                    public RefWxId: (number|Long);

                    /** SnsCommentTaskMessage RefCommentId. */
                    public RefCommentId: (number|Long);

                    /** SnsCommentTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new SnsCommentTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns SnsCommentTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ISnsCommentTaskMessage): Im.Scrm.Ww.Proto.SnsCommentTaskMessage;

                    /**
                     * Encodes the specified SnsCommentTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.SnsCommentTaskMessage.verify|verify} messages.
                     * @param message SnsCommentTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ISnsCommentTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified SnsCommentTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.SnsCommentTaskMessage.verify|verify} messages.
                     * @param message SnsCommentTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ISnsCommentTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a SnsCommentTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns SnsCommentTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.SnsCommentTaskMessage;

                    /**
                     * Decodes a SnsCommentTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns SnsCommentTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.SnsCommentTaskMessage;

                    /**
                     * Verifies a SnsCommentTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a SnsCommentTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns SnsCommentTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.SnsCommentTaskMessage;

                    /**
                     * Creates a plain object from a SnsCommentTaskMessage message. Also converts values to other types if specified.
                     * @param message SnsCommentTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.SnsCommentTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this SnsCommentTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for SnsCommentTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a SnsCommentTaskResultNoticeMessage. */
                interface ISnsCommentTaskResultNoticeMessage {

                    /** SnsCommentTaskResultNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** SnsCommentTaskResultNoticeMessage Success */
                    Success?: (boolean|null);

                    /** SnsCommentTaskResultNoticeMessage ErrMsg */
                    ErrMsg?: (string|null);

                    /** SnsCommentTaskResultNoticeMessage TaskId */
                    TaskId?: (number|Long|null);

                    /** SnsCommentTaskResultNoticeMessage SnsId */
                    SnsId?: (number|Long|null);

                    /** SnsCommentTaskResultNoticeMessage CommentId */
                    CommentId?: (number|Long|null);

                    /** SnsCommentTaskResultNoticeMessage PostId */
                    PostId?: (string|null);
                }

                /** Represents a SnsCommentTaskResultNoticeMessage. */
                class SnsCommentTaskResultNoticeMessage implements ISnsCommentTaskResultNoticeMessage {

                    /**
                     * Constructs a new SnsCommentTaskResultNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ISnsCommentTaskResultNoticeMessage);

                    /** SnsCommentTaskResultNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** SnsCommentTaskResultNoticeMessage Success. */
                    public Success: boolean;

                    /** SnsCommentTaskResultNoticeMessage ErrMsg. */
                    public ErrMsg: string;

                    /** SnsCommentTaskResultNoticeMessage TaskId. */
                    public TaskId: (number|Long);

                    /** SnsCommentTaskResultNoticeMessage SnsId. */
                    public SnsId: (number|Long);

                    /** SnsCommentTaskResultNoticeMessage CommentId. */
                    public CommentId: (number|Long);

                    /** SnsCommentTaskResultNoticeMessage PostId. */
                    public PostId: string;

                    /**
                     * Creates a new SnsCommentTaskResultNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns SnsCommentTaskResultNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ISnsCommentTaskResultNoticeMessage): Im.Scrm.Ww.Proto.SnsCommentTaskResultNoticeMessage;

                    /**
                     * Encodes the specified SnsCommentTaskResultNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.SnsCommentTaskResultNoticeMessage.verify|verify} messages.
                     * @param message SnsCommentTaskResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ISnsCommentTaskResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified SnsCommentTaskResultNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.SnsCommentTaskResultNoticeMessage.verify|verify} messages.
                     * @param message SnsCommentTaskResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ISnsCommentTaskResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a SnsCommentTaskResultNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns SnsCommentTaskResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.SnsCommentTaskResultNoticeMessage;

                    /**
                     * Decodes a SnsCommentTaskResultNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns SnsCommentTaskResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.SnsCommentTaskResultNoticeMessage;

                    /**
                     * Verifies a SnsCommentTaskResultNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a SnsCommentTaskResultNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns SnsCommentTaskResultNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.SnsCommentTaskResultNoticeMessage;

                    /**
                     * Creates a plain object from a SnsCommentTaskResultNoticeMessage message. Also converts values to other types if specified.
                     * @param message SnsCommentTaskResultNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.SnsCommentTaskResultNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this SnsCommentTaskResultNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for SnsCommentTaskResultNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a SnsLikeTaskMessage. */
                interface ISnsLikeTaskMessage {

                    /** SnsLikeTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** SnsLikeTaskMessage SnsId */
                    SnsId?: (number|Long|null);

                    /** SnsLikeTaskMessage PostId */
                    PostId?: (string|null);

                    /** SnsLikeTaskMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents a SnsLikeTaskMessage. */
                class SnsLikeTaskMessage implements ISnsLikeTaskMessage {

                    /**
                     * Constructs a new SnsLikeTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ISnsLikeTaskMessage);

                    /** SnsLikeTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** SnsLikeTaskMessage SnsId. */
                    public SnsId: (number|Long);

                    /** SnsLikeTaskMessage PostId. */
                    public PostId: string;

                    /** SnsLikeTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new SnsLikeTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns SnsLikeTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ISnsLikeTaskMessage): Im.Scrm.Ww.Proto.SnsLikeTaskMessage;

                    /**
                     * Encodes the specified SnsLikeTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.SnsLikeTaskMessage.verify|verify} messages.
                     * @param message SnsLikeTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ISnsLikeTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified SnsLikeTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.SnsLikeTaskMessage.verify|verify} messages.
                     * @param message SnsLikeTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ISnsLikeTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a SnsLikeTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns SnsLikeTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.SnsLikeTaskMessage;

                    /**
                     * Decodes a SnsLikeTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns SnsLikeTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.SnsLikeTaskMessage;

                    /**
                     * Verifies a SnsLikeTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a SnsLikeTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns SnsLikeTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.SnsLikeTaskMessage;

                    /**
                     * Creates a plain object from a SnsLikeTaskMessage message. Also converts values to other types if specified.
                     * @param message SnsLikeTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.SnsLikeTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this SnsLikeTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for SnsLikeTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a SnsNotifyNoticeMessage. */
                interface ISnsNotifyNoticeMessage {

                    /** SnsNotifyNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** SnsNotifyNoticeMessage Content */
                    Content?: (string|null);

                    /** SnsNotifyNoticeMessage SnsInfo */
                    SnsInfo?: (Im.Scrm.Ww.Proto.ISnsInfoMessage|null);

                    /** SnsNotifyNoticeMessage Type */
                    Type?: (number|null);
                }

                /** Represents a SnsNotifyNoticeMessage. */
                class SnsNotifyNoticeMessage implements ISnsNotifyNoticeMessage {

                    /**
                     * Constructs a new SnsNotifyNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ISnsNotifyNoticeMessage);

                    /** SnsNotifyNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** SnsNotifyNoticeMessage Content. */
                    public Content: string;

                    /** SnsNotifyNoticeMessage SnsInfo. */
                    public SnsInfo?: (Im.Scrm.Ww.Proto.ISnsInfoMessage|null);

                    /** SnsNotifyNoticeMessage Type. */
                    public Type: number;

                    /**
                     * Creates a new SnsNotifyNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns SnsNotifyNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ISnsNotifyNoticeMessage): Im.Scrm.Ww.Proto.SnsNotifyNoticeMessage;

                    /**
                     * Encodes the specified SnsNotifyNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.SnsNotifyNoticeMessage.verify|verify} messages.
                     * @param message SnsNotifyNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ISnsNotifyNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified SnsNotifyNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.SnsNotifyNoticeMessage.verify|verify} messages.
                     * @param message SnsNotifyNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ISnsNotifyNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a SnsNotifyNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns SnsNotifyNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.SnsNotifyNoticeMessage;

                    /**
                     * Decodes a SnsNotifyNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns SnsNotifyNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.SnsNotifyNoticeMessage;

                    /**
                     * Verifies a SnsNotifyNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a SnsNotifyNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns SnsNotifyNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.SnsNotifyNoticeMessage;

                    /**
                     * Creates a plain object from a SnsNotifyNoticeMessage message. Also converts values to other types if specified.
                     * @param message SnsNotifyNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.SnsNotifyNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this SnsNotifyNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for SnsNotifyNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a TalkToFriendTaskMessage. */
                interface ITalkToFriendTaskMessage {

                    /** TalkToFriendTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** TalkToFriendTaskMessage ConvId */
                    ConvId?: (number|Long|null);

                    /** TalkToFriendTaskMessage ContentType */
                    ContentType?: (Im.Scrm.Ww.Proto.EnumContentType|null);

                    /** TalkToFriendTaskMessage Content */
                    Content?: (Uint8Array|null);

                    /** TalkToFriendTaskMessage RefId */
                    RefId?: (number|Long|null);

                    /** TalkToFriendTaskMessage AtSomeOne */
                    AtSomeOne?: ((number|Long)[]|null);

                    /** TalkToFriendTaskMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents a TalkToFriendTaskMessage. */
                class TalkToFriendTaskMessage implements ITalkToFriendTaskMessage {

                    /**
                     * Constructs a new TalkToFriendTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ITalkToFriendTaskMessage);

                    /** TalkToFriendTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** TalkToFriendTaskMessage ConvId. */
                    public ConvId: (number|Long);

                    /** TalkToFriendTaskMessage ContentType. */
                    public ContentType: Im.Scrm.Ww.Proto.EnumContentType;

                    /** TalkToFriendTaskMessage Content. */
                    public Content: Uint8Array;

                    /** TalkToFriendTaskMessage RefId. */
                    public RefId: (number|Long);

                    /** TalkToFriendTaskMessage AtSomeOne. */
                    public AtSomeOne: (number|Long)[];

                    /** TalkToFriendTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new TalkToFriendTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns TalkToFriendTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ITalkToFriendTaskMessage): Im.Scrm.Ww.Proto.TalkToFriendTaskMessage;

                    /**
                     * Encodes the specified TalkToFriendTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.TalkToFriendTaskMessage.verify|verify} messages.
                     * @param message TalkToFriendTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ITalkToFriendTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified TalkToFriendTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.TalkToFriendTaskMessage.verify|verify} messages.
                     * @param message TalkToFriendTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ITalkToFriendTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a TalkToFriendTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns TalkToFriendTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.TalkToFriendTaskMessage;

                    /**
                     * Decodes a TalkToFriendTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns TalkToFriendTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.TalkToFriendTaskMessage;

                    /**
                     * Verifies a TalkToFriendTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a TalkToFriendTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns TalkToFriendTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.TalkToFriendTaskMessage;

                    /**
                     * Creates a plain object from a TalkToFriendTaskMessage message. Also converts values to other types if specified.
                     * @param message TalkToFriendTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.TalkToFriendTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this TalkToFriendTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for TalkToFriendTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a TalkToFriendTaskResultNoticeMessage. */
                interface ITalkToFriendTaskResultNoticeMessage {

                    /** TalkToFriendTaskResultNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** TalkToFriendTaskResultNoticeMessage Success */
                    Success?: (boolean|null);

                    /** TalkToFriendTaskResultNoticeMessage Code */
                    Code?: (Im.Scrm.Ww.Proto.EnumErrorCode|null);

                    /** TalkToFriendTaskResultNoticeMessage ErrMsg */
                    ErrMsg?: (string|null);

                    /** TalkToFriendTaskResultNoticeMessage TaskId */
                    TaskId?: (number|Long|null);

                    /** TalkToFriendTaskResultNoticeMessage ConvId */
                    ConvId?: (number|Long|null);

                    /** TalkToFriendTaskResultNoticeMessage MsgId */
                    MsgId?: (number|Long|null);

                    /** TalkToFriendTaskResultNoticeMessage MsgRemoteId */
                    MsgRemoteId?: (number|Long|null);

                    /** TalkToFriendTaskResultNoticeMessage CreateTime */
                    CreateTime?: (number|Long|null);
                }

                /** Represents a TalkToFriendTaskResultNoticeMessage. */
                class TalkToFriendTaskResultNoticeMessage implements ITalkToFriendTaskResultNoticeMessage {

                    /**
                     * Constructs a new TalkToFriendTaskResultNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ITalkToFriendTaskResultNoticeMessage);

                    /** TalkToFriendTaskResultNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** TalkToFriendTaskResultNoticeMessage Success. */
                    public Success: boolean;

                    /** TalkToFriendTaskResultNoticeMessage Code. */
                    public Code: Im.Scrm.Ww.Proto.EnumErrorCode;

                    /** TalkToFriendTaskResultNoticeMessage ErrMsg. */
                    public ErrMsg: string;

                    /** TalkToFriendTaskResultNoticeMessage TaskId. */
                    public TaskId: (number|Long);

                    /** TalkToFriendTaskResultNoticeMessage ConvId. */
                    public ConvId: (number|Long);

                    /** TalkToFriendTaskResultNoticeMessage MsgId. */
                    public MsgId: (number|Long);

                    /** TalkToFriendTaskResultNoticeMessage MsgRemoteId. */
                    public MsgRemoteId: (number|Long);

                    /** TalkToFriendTaskResultNoticeMessage CreateTime. */
                    public CreateTime: (number|Long);

                    /**
                     * Creates a new TalkToFriendTaskResultNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns TalkToFriendTaskResultNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ITalkToFriendTaskResultNoticeMessage): Im.Scrm.Ww.Proto.TalkToFriendTaskResultNoticeMessage;

                    /**
                     * Encodes the specified TalkToFriendTaskResultNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.TalkToFriendTaskResultNoticeMessage.verify|verify} messages.
                     * @param message TalkToFriendTaskResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ITalkToFriendTaskResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified TalkToFriendTaskResultNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.TalkToFriendTaskResultNoticeMessage.verify|verify} messages.
                     * @param message TalkToFriendTaskResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ITalkToFriendTaskResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a TalkToFriendTaskResultNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns TalkToFriendTaskResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.TalkToFriendTaskResultNoticeMessage;

                    /**
                     * Decodes a TalkToFriendTaskResultNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns TalkToFriendTaskResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.TalkToFriendTaskResultNoticeMessage;

                    /**
                     * Verifies a TalkToFriendTaskResultNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a TalkToFriendTaskResultNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns TalkToFriendTaskResultNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.TalkToFriendTaskResultNoticeMessage;

                    /**
                     * Creates a plain object from a TalkToFriendTaskResultNoticeMessage message. Also converts values to other types if specified.
                     * @param message TalkToFriendTaskResultNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.TalkToFriendTaskResultNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this TalkToFriendTaskResultNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for TalkToFriendTaskResultNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a TaskResultNoticeMessage. */
                interface ITaskResultNoticeMessage {

                    /** TaskResultNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** TaskResultNoticeMessage TaskType */
                    TaskType?: (Im.Scrm.Ww.Proto.EnumMsgType|null);

                    /** TaskResultNoticeMessage TaskId */
                    TaskId?: (number|Long|null);

                    /** TaskResultNoticeMessage Success */
                    Success?: (boolean|null);

                    /** TaskResultNoticeMessage Code */
                    Code?: (Im.Scrm.Ww.Proto.EnumErrorCode|null);

                    /** TaskResultNoticeMessage ErrMsg */
                    ErrMsg?: (string|null);

                    /** TaskResultNoticeMessage Ext */
                    Ext?: (string|null);

                    /** TaskResultNoticeMessage ExtId */
                    ExtId?: (number|Long|null);
                }

                /** Represents a TaskResultNoticeMessage. */
                class TaskResultNoticeMessage implements ITaskResultNoticeMessage {

                    /**
                     * Constructs a new TaskResultNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ITaskResultNoticeMessage);

                    /** TaskResultNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** TaskResultNoticeMessage TaskType. */
                    public TaskType: Im.Scrm.Ww.Proto.EnumMsgType;

                    /** TaskResultNoticeMessage TaskId. */
                    public TaskId: (number|Long);

                    /** TaskResultNoticeMessage Success. */
                    public Success: boolean;

                    /** TaskResultNoticeMessage Code. */
                    public Code: Im.Scrm.Ww.Proto.EnumErrorCode;

                    /** TaskResultNoticeMessage ErrMsg. */
                    public ErrMsg: string;

                    /** TaskResultNoticeMessage Ext. */
                    public Ext: string;

                    /** TaskResultNoticeMessage ExtId. */
                    public ExtId: (number|Long);

                    /**
                     * Creates a new TaskResultNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns TaskResultNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ITaskResultNoticeMessage): Im.Scrm.Ww.Proto.TaskResultNoticeMessage;

                    /**
                     * Encodes the specified TaskResultNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.TaskResultNoticeMessage.verify|verify} messages.
                     * @param message TaskResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ITaskResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified TaskResultNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.TaskResultNoticeMessage.verify|verify} messages.
                     * @param message TaskResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ITaskResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a TaskResultNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns TaskResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.TaskResultNoticeMessage;

                    /**
                     * Decodes a TaskResultNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns TaskResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.TaskResultNoticeMessage;

                    /**
                     * Verifies a TaskResultNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a TaskResultNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns TaskResultNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.TaskResultNoticeMessage;

                    /**
                     * Creates a plain object from a TaskResultNoticeMessage message. Also converts values to other types if specified.
                     * @param message TaskResultNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.TaskResultNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this TaskResultNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for TaskResultNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a TriggerHistoryMsgPushTaskMessage. */
                interface ITriggerHistoryMsgPushTaskMessage {

                    /** TriggerHistoryMsgPushTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** TriggerHistoryMsgPushTaskMessage ConvId */
                    ConvId?: (number|Long|null);

                    /** TriggerHistoryMsgPushTaskMessage RefMsgId */
                    RefMsgId?: (number|Long|null);

                    /** TriggerHistoryMsgPushTaskMessage Flag */
                    Flag?: (number|null);
                }

                /** Represents a TriggerHistoryMsgPushTaskMessage. */
                class TriggerHistoryMsgPushTaskMessage implements ITriggerHistoryMsgPushTaskMessage {

                    /**
                     * Constructs a new TriggerHistoryMsgPushTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ITriggerHistoryMsgPushTaskMessage);

                    /** TriggerHistoryMsgPushTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** TriggerHistoryMsgPushTaskMessage ConvId. */
                    public ConvId: (number|Long);

                    /** TriggerHistoryMsgPushTaskMessage RefMsgId. */
                    public RefMsgId: (number|Long);

                    /** TriggerHistoryMsgPushTaskMessage Flag. */
                    public Flag: number;

                    /**
                     * Creates a new TriggerHistoryMsgPushTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns TriggerHistoryMsgPushTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ITriggerHistoryMsgPushTaskMessage): Im.Scrm.Ww.Proto.TriggerHistoryMsgPushTaskMessage;

                    /**
                     * Encodes the specified TriggerHistoryMsgPushTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.TriggerHistoryMsgPushTaskMessage.verify|verify} messages.
                     * @param message TriggerHistoryMsgPushTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ITriggerHistoryMsgPushTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified TriggerHistoryMsgPushTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.TriggerHistoryMsgPushTaskMessage.verify|verify} messages.
                     * @param message TriggerHistoryMsgPushTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ITriggerHistoryMsgPushTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a TriggerHistoryMsgPushTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns TriggerHistoryMsgPushTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.TriggerHistoryMsgPushTaskMessage;

                    /**
                     * Decodes a TriggerHistoryMsgPushTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns TriggerHistoryMsgPushTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.TriggerHistoryMsgPushTaskMessage;

                    /**
                     * Verifies a TriggerHistoryMsgPushTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a TriggerHistoryMsgPushTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns TriggerHistoryMsgPushTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.TriggerHistoryMsgPushTaskMessage;

                    /**
                     * Creates a plain object from a TriggerHistoryMsgPushTaskMessage message. Also converts values to other types if specified.
                     * @param message TriggerHistoryMsgPushTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.TriggerHistoryMsgPushTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this TriggerHistoryMsgPushTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for TriggerHistoryMsgPushTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a TriggerMessageReadTaskMessage. */
                interface ITriggerMessageReadTaskMessage {

                    /** TriggerMessageReadTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** TriggerMessageReadTaskMessage ConvId */
                    ConvId?: (number|Long|null);
                }

                /** Represents a TriggerMessageReadTaskMessage. */
                class TriggerMessageReadTaskMessage implements ITriggerMessageReadTaskMessage {

                    /**
                     * Constructs a new TriggerMessageReadTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.ITriggerMessageReadTaskMessage);

                    /** TriggerMessageReadTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** TriggerMessageReadTaskMessage ConvId. */
                    public ConvId: (number|Long);

                    /**
                     * Creates a new TriggerMessageReadTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns TriggerMessageReadTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.ITriggerMessageReadTaskMessage): Im.Scrm.Ww.Proto.TriggerMessageReadTaskMessage;

                    /**
                     * Encodes the specified TriggerMessageReadTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.TriggerMessageReadTaskMessage.verify|verify} messages.
                     * @param message TriggerMessageReadTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.ITriggerMessageReadTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified TriggerMessageReadTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.TriggerMessageReadTaskMessage.verify|verify} messages.
                     * @param message TriggerMessageReadTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.ITriggerMessageReadTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a TriggerMessageReadTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns TriggerMessageReadTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.TriggerMessageReadTaskMessage;

                    /**
                     * Decodes a TriggerMessageReadTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns TriggerMessageReadTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.TriggerMessageReadTaskMessage;

                    /**
                     * Verifies a TriggerMessageReadTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a TriggerMessageReadTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns TriggerMessageReadTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.TriggerMessageReadTaskMessage;

                    /**
                     * Creates a plain object from a TriggerMessageReadTaskMessage message. Also converts values to other types if specified.
                     * @param message TriggerMessageReadTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.TriggerMessageReadTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this TriggerMessageReadTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for TriggerMessageReadTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a DeviceAppUpgradeMessage. */
                interface IDeviceAppUpgradeMessage {

                    /** DeviceAppUpgradeMessage VerNumber */
                    VerNumber?: (number|null);

                    /** DeviceAppUpgradeMessage Version */
                    Version?: (string|null);

                    /** DeviceAppUpgradeMessage PackageName */
                    PackageName?: (string|null);

                    /** DeviceAppUpgradeMessage PackageUrl */
                    PackageUrl?: (string|null);
                }

                /** Represents a DeviceAppUpgradeMessage. */
                class DeviceAppUpgradeMessage implements IDeviceAppUpgradeMessage {

                    /**
                     * Constructs a new DeviceAppUpgradeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IDeviceAppUpgradeMessage);

                    /** DeviceAppUpgradeMessage VerNumber. */
                    public VerNumber: number;

                    /** DeviceAppUpgradeMessage Version. */
                    public Version: string;

                    /** DeviceAppUpgradeMessage PackageName. */
                    public PackageName: string;

                    /** DeviceAppUpgradeMessage PackageUrl. */
                    public PackageUrl: string;

                    /**
                     * Creates a new DeviceAppUpgradeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DeviceAppUpgradeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IDeviceAppUpgradeMessage): Im.Scrm.Ww.Proto.DeviceAppUpgradeMessage;

                    /**
                     * Encodes the specified DeviceAppUpgradeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.DeviceAppUpgradeMessage.verify|verify} messages.
                     * @param message DeviceAppUpgradeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IDeviceAppUpgradeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DeviceAppUpgradeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.DeviceAppUpgradeMessage.verify|verify} messages.
                     * @param message DeviceAppUpgradeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IDeviceAppUpgradeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DeviceAppUpgradeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DeviceAppUpgradeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.DeviceAppUpgradeMessage;

                    /**
                     * Decodes a DeviceAppUpgradeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DeviceAppUpgradeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.DeviceAppUpgradeMessage;

                    /**
                     * Verifies a DeviceAppUpgradeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DeviceAppUpgradeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DeviceAppUpgradeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.DeviceAppUpgradeMessage;

                    /**
                     * Creates a plain object from a DeviceAppUpgradeMessage message. Also converts values to other types if specified.
                     * @param message DeviceAppUpgradeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.DeviceAppUpgradeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DeviceAppUpgradeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for DeviceAppUpgradeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of an UpgradeDeviceAppNoticeMessage. */
                interface IUpgradeDeviceAppNoticeMessage {

                    /** UpgradeDeviceAppNoticeMessage WxId */
                    WxId?: (string|null);

                    /** UpgradeDeviceAppNoticeMessage IMEI */
                    IMEI?: (string|null);

                    /** UpgradeDeviceAppNoticeMessage AppInfos */
                    AppInfos?: (Im.Scrm.Ww.Proto.IDeviceAppUpgradeMessage[]|null);
                }

                /** Represents an UpgradeDeviceAppNoticeMessage. */
                class UpgradeDeviceAppNoticeMessage implements IUpgradeDeviceAppNoticeMessage {

                    /**
                     * Constructs a new UpgradeDeviceAppNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IUpgradeDeviceAppNoticeMessage);

                    /** UpgradeDeviceAppNoticeMessage WxId. */
                    public WxId: string;

                    /** UpgradeDeviceAppNoticeMessage IMEI. */
                    public IMEI: string;

                    /** UpgradeDeviceAppNoticeMessage AppInfos. */
                    public AppInfos: Im.Scrm.Ww.Proto.IDeviceAppUpgradeMessage[];

                    /**
                     * Creates a new UpgradeDeviceAppNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns UpgradeDeviceAppNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IUpgradeDeviceAppNoticeMessage): Im.Scrm.Ww.Proto.UpgradeDeviceAppNoticeMessage;

                    /**
                     * Encodes the specified UpgradeDeviceAppNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.UpgradeDeviceAppNoticeMessage.verify|verify} messages.
                     * @param message UpgradeDeviceAppNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IUpgradeDeviceAppNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified UpgradeDeviceAppNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.UpgradeDeviceAppNoticeMessage.verify|verify} messages.
                     * @param message UpgradeDeviceAppNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IUpgradeDeviceAppNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an UpgradeDeviceAppNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns UpgradeDeviceAppNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.UpgradeDeviceAppNoticeMessage;

                    /**
                     * Decodes an UpgradeDeviceAppNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns UpgradeDeviceAppNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.UpgradeDeviceAppNoticeMessage;

                    /**
                     * Verifies an UpgradeDeviceAppNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an UpgradeDeviceAppNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns UpgradeDeviceAppNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.UpgradeDeviceAppNoticeMessage;

                    /**
                     * Creates a plain object from an UpgradeDeviceAppNoticeMessage message. Also converts values to other types if specified.
                     * @param message UpgradeDeviceAppNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.UpgradeDeviceAppNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this UpgradeDeviceAppNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for UpgradeDeviceAppNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a UserLabelChangedNoticeMessage. */
                interface IUserLabelChangedNoticeMessage {

                    /** UserLabelChangedNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** UserLabelChangedNoticeMessage Type */
                    Type?: (number|null);
                }

                /** Represents a UserLabelChangedNoticeMessage. */
                class UserLabelChangedNoticeMessage implements IUserLabelChangedNoticeMessage {

                    /**
                     * Constructs a new UserLabelChangedNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IUserLabelChangedNoticeMessage);

                    /** UserLabelChangedNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** UserLabelChangedNoticeMessage Type. */
                    public Type: number;

                    /**
                     * Creates a new UserLabelChangedNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns UserLabelChangedNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IUserLabelChangedNoticeMessage): Im.Scrm.Ww.Proto.UserLabelChangedNoticeMessage;

                    /**
                     * Encodes the specified UserLabelChangedNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.UserLabelChangedNoticeMessage.verify|verify} messages.
                     * @param message UserLabelChangedNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IUserLabelChangedNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified UserLabelChangedNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.UserLabelChangedNoticeMessage.verify|verify} messages.
                     * @param message UserLabelChangedNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IUserLabelChangedNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a UserLabelChangedNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns UserLabelChangedNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.UserLabelChangedNoticeMessage;

                    /**
                     * Decodes a UserLabelChangedNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns UserLabelChangedNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.UserLabelChangedNoticeMessage;

                    /**
                     * Verifies a UserLabelChangedNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a UserLabelChangedNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns UserLabelChangedNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.UserLabelChangedNoticeMessage;

                    /**
                     * Creates a plain object from a UserLabelChangedNoticeMessage message. Also converts values to other types if specified.
                     * @param message UserLabelChangedNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.UserLabelChangedNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this UserLabelChangedNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for UserLabelChangedNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a UserLabelDelTaskMessage. */
                interface IUserLabelDelTaskMessage {

                    /** UserLabelDelTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** UserLabelDelTaskMessage LabelId */
                    LabelId?: (number|Long|null);

                    /** UserLabelDelTaskMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents a UserLabelDelTaskMessage. */
                class UserLabelDelTaskMessage implements IUserLabelDelTaskMessage {

                    /**
                     * Constructs a new UserLabelDelTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IUserLabelDelTaskMessage);

                    /** UserLabelDelTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** UserLabelDelTaskMessage LabelId. */
                    public LabelId: (number|Long);

                    /** UserLabelDelTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new UserLabelDelTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns UserLabelDelTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IUserLabelDelTaskMessage): Im.Scrm.Ww.Proto.UserLabelDelTaskMessage;

                    /**
                     * Encodes the specified UserLabelDelTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.UserLabelDelTaskMessage.verify|verify} messages.
                     * @param message UserLabelDelTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IUserLabelDelTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified UserLabelDelTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.UserLabelDelTaskMessage.verify|verify} messages.
                     * @param message UserLabelDelTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IUserLabelDelTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a UserLabelDelTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns UserLabelDelTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.UserLabelDelTaskMessage;

                    /**
                     * Decodes a UserLabelDelTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns UserLabelDelTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.UserLabelDelTaskMessage;

                    /**
                     * Verifies a UserLabelDelTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a UserLabelDelTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns UserLabelDelTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.UserLabelDelTaskMessage;

                    /**
                     * Creates a plain object from a UserLabelDelTaskMessage message. Also converts values to other types if specified.
                     * @param message UserLabelDelTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.UserLabelDelTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this UserLabelDelTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for UserLabelDelTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a UserLabelModifyTaskMessage. */
                interface IUserLabelModifyTaskMessage {

                    /** UserLabelModifyTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** UserLabelModifyTaskMessage LabelName */
                    LabelName?: (string|null);

                    /** UserLabelModifyTaskMessage LabelId */
                    LabelId?: (number|Long|null);

                    /** UserLabelModifyTaskMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents a UserLabelModifyTaskMessage. */
                class UserLabelModifyTaskMessage implements IUserLabelModifyTaskMessage {

                    /**
                     * Constructs a new UserLabelModifyTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IUserLabelModifyTaskMessage);

                    /** UserLabelModifyTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** UserLabelModifyTaskMessage LabelName. */
                    public LabelName: string;

                    /** UserLabelModifyTaskMessage LabelId. */
                    public LabelId: (number|Long);

                    /** UserLabelModifyTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new UserLabelModifyTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns UserLabelModifyTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IUserLabelModifyTaskMessage): Im.Scrm.Ww.Proto.UserLabelModifyTaskMessage;

                    /**
                     * Encodes the specified UserLabelModifyTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.UserLabelModifyTaskMessage.verify|verify} messages.
                     * @param message UserLabelModifyTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IUserLabelModifyTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified UserLabelModifyTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.UserLabelModifyTaskMessage.verify|verify} messages.
                     * @param message UserLabelModifyTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IUserLabelModifyTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a UserLabelModifyTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns UserLabelModifyTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.UserLabelModifyTaskMessage;

                    /**
                     * Decodes a UserLabelModifyTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns UserLabelModifyTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.UserLabelModifyTaskMessage;

                    /**
                     * Verifies a UserLabelModifyTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a UserLabelModifyTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns UserLabelModifyTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.UserLabelModifyTaskMessage;

                    /**
                     * Creates a plain object from a UserLabelModifyTaskMessage message. Also converts values to other types if specified.
                     * @param message UserLabelModifyTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.UserLabelModifyTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this UserLabelModifyTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for UserLabelModifyTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a UserLabelModifyTaskResultNoticeMessage. */
                interface IUserLabelModifyTaskResultNoticeMessage {

                    /** UserLabelModifyTaskResultNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** UserLabelModifyTaskResultNoticeMessage Success */
                    Success?: (boolean|null);

                    /** UserLabelModifyTaskResultNoticeMessage ErrMsg */
                    ErrMsg?: (string|null);

                    /** UserLabelModifyTaskResultNoticeMessage TaskId */
                    TaskId?: (number|Long|null);

                    /** UserLabelModifyTaskResultNoticeMessage Label */
                    Label?: (Im.Scrm.Ww.Proto.IUserLabelMessage|null);
                }

                /** Represents a UserLabelModifyTaskResultNoticeMessage. */
                class UserLabelModifyTaskResultNoticeMessage implements IUserLabelModifyTaskResultNoticeMessage {

                    /**
                     * Constructs a new UserLabelModifyTaskResultNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IUserLabelModifyTaskResultNoticeMessage);

                    /** UserLabelModifyTaskResultNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** UserLabelModifyTaskResultNoticeMessage Success. */
                    public Success: boolean;

                    /** UserLabelModifyTaskResultNoticeMessage ErrMsg. */
                    public ErrMsg: string;

                    /** UserLabelModifyTaskResultNoticeMessage TaskId. */
                    public TaskId: (number|Long);

                    /** UserLabelModifyTaskResultNoticeMessage Label. */
                    public Label?: (Im.Scrm.Ww.Proto.IUserLabelMessage|null);

                    /**
                     * Creates a new UserLabelModifyTaskResultNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns UserLabelModifyTaskResultNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IUserLabelModifyTaskResultNoticeMessage): Im.Scrm.Ww.Proto.UserLabelModifyTaskResultNoticeMessage;

                    /**
                     * Encodes the specified UserLabelModifyTaskResultNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.UserLabelModifyTaskResultNoticeMessage.verify|verify} messages.
                     * @param message UserLabelModifyTaskResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IUserLabelModifyTaskResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified UserLabelModifyTaskResultNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.UserLabelModifyTaskResultNoticeMessage.verify|verify} messages.
                     * @param message UserLabelModifyTaskResultNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IUserLabelModifyTaskResultNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a UserLabelModifyTaskResultNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns UserLabelModifyTaskResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.UserLabelModifyTaskResultNoticeMessage;

                    /**
                     * Decodes a UserLabelModifyTaskResultNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns UserLabelModifyTaskResultNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.UserLabelModifyTaskResultNoticeMessage;

                    /**
                     * Verifies a UserLabelModifyTaskResultNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a UserLabelModifyTaskResultNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns UserLabelModifyTaskResultNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.UserLabelModifyTaskResultNoticeMessage;

                    /**
                     * Creates a plain object from a UserLabelModifyTaskResultNoticeMessage message. Also converts values to other types if specified.
                     * @param message UserLabelModifyTaskResultNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.UserLabelModifyTaskResultNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this UserLabelModifyTaskResultNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for UserLabelModifyTaskResultNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a UserLabelPushNoticeMessage. */
                interface IUserLabelPushNoticeMessage {

                    /** UserLabelPushNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** UserLabelPushNoticeMessage LabelGroups */
                    LabelGroups?: (Im.Scrm.Ww.Proto.IUserLabelGroupMessage[]|null);
                }

                /** Represents a UserLabelPushNoticeMessage. */
                class UserLabelPushNoticeMessage implements IUserLabelPushNoticeMessage {

                    /**
                     * Constructs a new UserLabelPushNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IUserLabelPushNoticeMessage);

                    /** UserLabelPushNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** UserLabelPushNoticeMessage LabelGroups. */
                    public LabelGroups: Im.Scrm.Ww.Proto.IUserLabelGroupMessage[];

                    /**
                     * Creates a new UserLabelPushNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns UserLabelPushNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IUserLabelPushNoticeMessage): Im.Scrm.Ww.Proto.UserLabelPushNoticeMessage;

                    /**
                     * Encodes the specified UserLabelPushNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.UserLabelPushNoticeMessage.verify|verify} messages.
                     * @param message UserLabelPushNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IUserLabelPushNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified UserLabelPushNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.UserLabelPushNoticeMessage.verify|verify} messages.
                     * @param message UserLabelPushNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IUserLabelPushNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a UserLabelPushNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns UserLabelPushNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.UserLabelPushNoticeMessage;

                    /**
                     * Decodes a UserLabelPushNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns UserLabelPushNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.UserLabelPushNoticeMessage;

                    /**
                     * Verifies a UserLabelPushNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a UserLabelPushNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns UserLabelPushNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.UserLabelPushNoticeMessage;

                    /**
                     * Creates a plain object from a UserLabelPushNoticeMessage message. Also converts values to other types if specified.
                     * @param message UserLabelPushNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.UserLabelPushNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this UserLabelPushNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for UserLabelPushNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a UserLabelMessage. */
                interface IUserLabelMessage {

                    /** UserLabelMessage Id */
                    Id?: (number|Long|null);

                    /** UserLabelMessage Name */
                    Name?: (string|null);

                    /** UserLabelMessage CreateTime */
                    CreateTime?: (number|null);

                    /** UserLabelMessage GroupId */
                    GroupId?: (number|Long|null);
                }

                /** Represents a UserLabelMessage. */
                class UserLabelMessage implements IUserLabelMessage {

                    /**
                     * Constructs a new UserLabelMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IUserLabelMessage);

                    /** UserLabelMessage Id. */
                    public Id: (number|Long);

                    /** UserLabelMessage Name. */
                    public Name: string;

                    /** UserLabelMessage CreateTime. */
                    public CreateTime: number;

                    /** UserLabelMessage GroupId. */
                    public GroupId: (number|Long);

                    /**
                     * Creates a new UserLabelMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns UserLabelMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IUserLabelMessage): Im.Scrm.Ww.Proto.UserLabelMessage;

                    /**
                     * Encodes the specified UserLabelMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.UserLabelMessage.verify|verify} messages.
                     * @param message UserLabelMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IUserLabelMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified UserLabelMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.UserLabelMessage.verify|verify} messages.
                     * @param message UserLabelMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IUserLabelMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a UserLabelMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns UserLabelMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.UserLabelMessage;

                    /**
                     * Decodes a UserLabelMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns UserLabelMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.UserLabelMessage;

                    /**
                     * Verifies a UserLabelMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a UserLabelMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns UserLabelMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.UserLabelMessage;

                    /**
                     * Creates a plain object from a UserLabelMessage message. Also converts values to other types if specified.
                     * @param message UserLabelMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.UserLabelMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this UserLabelMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for UserLabelMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a UserLabelGroupMessage. */
                interface IUserLabelGroupMessage {

                    /** UserLabelGroupMessage Id */
                    Id?: (number|Long|null);

                    /** UserLabelGroupMessage Creator */
                    Creator?: (number|Long|null);

                    /** UserLabelGroupMessage Name */
                    Name?: (string|null);

                    /** UserLabelGroupMessage Type */
                    Type?: (number|null);

                    /** UserLabelGroupMessage Labels */
                    Labels?: (Im.Scrm.Ww.Proto.IUserLabelMessage[]|null);
                }

                /** Represents a UserLabelGroupMessage. */
                class UserLabelGroupMessage implements IUserLabelGroupMessage {

                    /**
                     * Constructs a new UserLabelGroupMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IUserLabelGroupMessage);

                    /** UserLabelGroupMessage Id. */
                    public Id: (number|Long);

                    /** UserLabelGroupMessage Creator. */
                    public Creator: (number|Long);

                    /** UserLabelGroupMessage Name. */
                    public Name: string;

                    /** UserLabelGroupMessage Type. */
                    public Type: number;

                    /** UserLabelGroupMessage Labels. */
                    public Labels: Im.Scrm.Ww.Proto.IUserLabelMessage[];

                    /**
                     * Creates a new UserLabelGroupMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns UserLabelGroupMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IUserLabelGroupMessage): Im.Scrm.Ww.Proto.UserLabelGroupMessage;

                    /**
                     * Encodes the specified UserLabelGroupMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.UserLabelGroupMessage.verify|verify} messages.
                     * @param message UserLabelGroupMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IUserLabelGroupMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified UserLabelGroupMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.UserLabelGroupMessage.verify|verify} messages.
                     * @param message UserLabelGroupMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IUserLabelGroupMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a UserLabelGroupMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns UserLabelGroupMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.UserLabelGroupMessage;

                    /**
                     * Decodes a UserLabelGroupMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns UserLabelGroupMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.UserLabelGroupMessage;

                    /**
                     * Verifies a UserLabelGroupMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a UserLabelGroupMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns UserLabelGroupMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.UserLabelGroupMessage;

                    /**
                     * Creates a plain object from a UserLabelGroupMessage message. Also converts values to other types if specified.
                     * @param message UserLabelGroupMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.UserLabelGroupMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this UserLabelGroupMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for UserLabelGroupMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a UserLabelSetTaskMessage. */
                interface IUserLabelSetTaskMessage {

                    /** UserLabelSetTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** UserLabelSetTaskMessage LabelId */
                    LabelId?: (number|Long|null);

                    /** UserLabelSetTaskMessage IsCorp */
                    IsCorp?: (boolean|null);

                    /** UserLabelSetTaskMessage AddUsers */
                    AddUsers?: ((number|Long)[]|null);

                    /** UserLabelSetTaskMessage DelUsers */
                    DelUsers?: ((number|Long)[]|null);

                    /** UserLabelSetTaskMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents a UserLabelSetTaskMessage. */
                class UserLabelSetTaskMessage implements IUserLabelSetTaskMessage {

                    /**
                     * Constructs a new UserLabelSetTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IUserLabelSetTaskMessage);

                    /** UserLabelSetTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** UserLabelSetTaskMessage LabelId. */
                    public LabelId: (number|Long);

                    /** UserLabelSetTaskMessage IsCorp. */
                    public IsCorp: boolean;

                    /** UserLabelSetTaskMessage AddUsers. */
                    public AddUsers: (number|Long)[];

                    /** UserLabelSetTaskMessage DelUsers. */
                    public DelUsers: (number|Long)[];

                    /** UserLabelSetTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new UserLabelSetTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns UserLabelSetTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IUserLabelSetTaskMessage): Im.Scrm.Ww.Proto.UserLabelSetTaskMessage;

                    /**
                     * Encodes the specified UserLabelSetTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.UserLabelSetTaskMessage.verify|verify} messages.
                     * @param message UserLabelSetTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IUserLabelSetTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified UserLabelSetTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.UserLabelSetTaskMessage.verify|verify} messages.
                     * @param message UserLabelSetTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IUserLabelSetTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a UserLabelSetTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns UserLabelSetTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.UserLabelSetTaskMessage;

                    /**
                     * Decodes a UserLabelSetTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns UserLabelSetTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.UserLabelSetTaskMessage;

                    /**
                     * Verifies a UserLabelSetTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a UserLabelSetTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns UserLabelSetTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.UserLabelSetTaskMessage;

                    /**
                     * Creates a plain object from a UserLabelSetTaskMessage message. Also converts values to other types if specified.
                     * @param message UserLabelSetTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.UserLabelSetTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this UserLabelSetTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for UserLabelSetTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a UserSetLabelTaskMessage. */
                interface IUserSetLabelTaskMessage {

                    /** UserSetLabelTaskMessage WxId */
                    WxId?: (number|Long|null);

                    /** UserSetLabelTaskMessage RemoteId */
                    RemoteId?: (number|Long|null);

                    /** UserSetLabelTaskMessage LabelId */
                    LabelId?: ((number|Long)[]|null);

                    /** UserSetLabelTaskMessage TaskId */
                    TaskId?: (number|Long|null);
                }

                /** Represents a UserSetLabelTaskMessage. */
                class UserSetLabelTaskMessage implements IUserSetLabelTaskMessage {

                    /**
                     * Constructs a new UserSetLabelTaskMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IUserSetLabelTaskMessage);

                    /** UserSetLabelTaskMessage WxId. */
                    public WxId: (number|Long);

                    /** UserSetLabelTaskMessage RemoteId. */
                    public RemoteId: (number|Long);

                    /** UserSetLabelTaskMessage LabelId. */
                    public LabelId: (number|Long)[];

                    /** UserSetLabelTaskMessage TaskId. */
                    public TaskId: (number|Long);

                    /**
                     * Creates a new UserSetLabelTaskMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns UserSetLabelTaskMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IUserSetLabelTaskMessage): Im.Scrm.Ww.Proto.UserSetLabelTaskMessage;

                    /**
                     * Encodes the specified UserSetLabelTaskMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.UserSetLabelTaskMessage.verify|verify} messages.
                     * @param message UserSetLabelTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IUserSetLabelTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified UserSetLabelTaskMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.UserSetLabelTaskMessage.verify|verify} messages.
                     * @param message UserSetLabelTaskMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IUserSetLabelTaskMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a UserSetLabelTaskMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns UserSetLabelTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.UserSetLabelTaskMessage;

                    /**
                     * Decodes a UserSetLabelTaskMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns UserSetLabelTaskMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.UserSetLabelTaskMessage;

                    /**
                     * Verifies a UserSetLabelTaskMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a UserSetLabelTaskMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns UserSetLabelTaskMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.UserSetLabelTaskMessage;

                    /**
                     * Creates a plain object from a UserSetLabelTaskMessage message. Also converts values to other types if specified.
                     * @param message UserSetLabelTaskMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.UserSetLabelTaskMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this UserSetLabelTaskMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for UserSetLabelTaskMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a WxFriendPushNoticeMessage. */
                interface IWxFriendPushNoticeMessage {

                    /** WxFriendPushNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** WxFriendPushNoticeMessage Friends */
                    Friends?: (Im.Scrm.Ww.Proto.IWxFriendMessage[]|null);

                    /** WxFriendPushNoticeMessage Size */
                    Size?: (number|null);

                    /** WxFriendPushNoticeMessage Count */
                    Count?: (number|null);

                    /** WxFriendPushNoticeMessage Page */
                    Page?: (number|null);
                }

                /** Represents a WxFriendPushNoticeMessage. */
                class WxFriendPushNoticeMessage implements IWxFriendPushNoticeMessage {

                    /**
                     * Constructs a new WxFriendPushNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IWxFriendPushNoticeMessage);

                    /** WxFriendPushNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** WxFriendPushNoticeMessage Friends. */
                    public Friends: Im.Scrm.Ww.Proto.IWxFriendMessage[];

                    /** WxFriendPushNoticeMessage Size. */
                    public Size: number;

                    /** WxFriendPushNoticeMessage Count. */
                    public Count: number;

                    /** WxFriendPushNoticeMessage Page. */
                    public Page: number;

                    /**
                     * Creates a new WxFriendPushNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns WxFriendPushNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IWxFriendPushNoticeMessage): Im.Scrm.Ww.Proto.WxFriendPushNoticeMessage;

                    /**
                     * Encodes the specified WxFriendPushNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.WxFriendPushNoticeMessage.verify|verify} messages.
                     * @param message WxFriendPushNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IWxFriendPushNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified WxFriendPushNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.WxFriendPushNoticeMessage.verify|verify} messages.
                     * @param message WxFriendPushNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IWxFriendPushNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a WxFriendPushNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns WxFriendPushNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.WxFriendPushNoticeMessage;

                    /**
                     * Decodes a WxFriendPushNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns WxFriendPushNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.WxFriendPushNoticeMessage;

                    /**
                     * Verifies a WxFriendPushNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a WxFriendPushNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns WxFriendPushNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.WxFriendPushNoticeMessage;

                    /**
                     * Creates a plain object from a WxFriendPushNoticeMessage message. Also converts values to other types if specified.
                     * @param message WxFriendPushNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.WxFriendPushNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this WxFriendPushNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for WxFriendPushNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a WxFriendMessage. */
                interface IWxFriendMessage {

                    /** WxFriendMessage Name */
                    Name?: (string|null);

                    /** WxFriendMessage Avatar */
                    Avatar?: (string|null);

                    /** WxFriendMessage OpenId */
                    OpenId?: (string|null);

                    /** WxFriendMessage UnionId */
                    UnionId?: (string|null);

                    /** WxFriendMessage HasSent */
                    HasSent?: (boolean|null);
                }

                /** Represents a WxFriendMessage. */
                class WxFriendMessage implements IWxFriendMessage {

                    /**
                     * Constructs a new WxFriendMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IWxFriendMessage);

                    /** WxFriendMessage Name. */
                    public Name: string;

                    /** WxFriendMessage Avatar. */
                    public Avatar: string;

                    /** WxFriendMessage OpenId. */
                    public OpenId: string;

                    /** WxFriendMessage UnionId. */
                    public UnionId: string;

                    /** WxFriendMessage HasSent. */
                    public HasSent: boolean;

                    /**
                     * Creates a new WxFriendMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns WxFriendMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IWxFriendMessage): Im.Scrm.Ww.Proto.WxFriendMessage;

                    /**
                     * Encodes the specified WxFriendMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.WxFriendMessage.verify|verify} messages.
                     * @param message WxFriendMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IWxFriendMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified WxFriendMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.WxFriendMessage.verify|verify} messages.
                     * @param message WxFriendMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IWxFriendMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a WxFriendMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns WxFriendMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.WxFriendMessage;

                    /**
                     * Decodes a WxFriendMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns WxFriendMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.WxFriendMessage;

                    /**
                     * Verifies a WxFriendMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a WxFriendMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns WxFriendMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.WxFriendMessage;

                    /**
                     * Creates a plain object from a WxFriendMessage message. Also converts values to other types if specified.
                     * @param message WxFriendMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.WxFriendMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this WxFriendMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for WxFriendMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a WwOfflineNoticeMessage. */
                interface IWwOfflineNoticeMessage {

                    /** WwOfflineNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** WwOfflineNoticeMessage IMEI */
                    IMEI?: (string|null);

                    /** WwOfflineNoticeMessage Type */
                    Type?: (number|null);
                }

                /** Represents a WwOfflineNoticeMessage. */
                class WwOfflineNoticeMessage implements IWwOfflineNoticeMessage {

                    /**
                     * Constructs a new WwOfflineNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IWwOfflineNoticeMessage);

                    /** WwOfflineNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** WwOfflineNoticeMessage IMEI. */
                    public IMEI: string;

                    /** WwOfflineNoticeMessage Type. */
                    public Type: number;

                    /**
                     * Creates a new WwOfflineNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns WwOfflineNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IWwOfflineNoticeMessage): Im.Scrm.Ww.Proto.WwOfflineNoticeMessage;

                    /**
                     * Encodes the specified WwOfflineNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.WwOfflineNoticeMessage.verify|verify} messages.
                     * @param message WwOfflineNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IWwOfflineNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified WwOfflineNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.WwOfflineNoticeMessage.verify|verify} messages.
                     * @param message WwOfflineNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IWwOfflineNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a WwOfflineNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns WwOfflineNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.WwOfflineNoticeMessage;

                    /**
                     * Decodes a WwOfflineNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns WwOfflineNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.WwOfflineNoticeMessage;

                    /**
                     * Verifies a WwOfflineNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a WwOfflineNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns WwOfflineNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.WwOfflineNoticeMessage;

                    /**
                     * Creates a plain object from a WwOfflineNoticeMessage message. Also converts values to other types if specified.
                     * @param message WwOfflineNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.WwOfflineNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this WwOfflineNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for WwOfflineNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a WwOnlineNoticeMessage. */
                interface IWwOnlineNoticeMessage {

                    /** WwOnlineNoticeMessage WxId */
                    WxId?: (number|Long|null);

                    /** WwOnlineNoticeMessage Name */
                    Name?: (string|null);

                    /** WwOnlineNoticeMessage Alias */
                    Alias?: (string|null);

                    /** WwOnlineNoticeMessage AcctId */
                    AcctId?: (string|null);

                    /** WwOnlineNoticeMessage Avatar */
                    Avatar?: (string|null);

                    /** WwOnlineNoticeMessage Gender */
                    Gender?: (Im.Scrm.Ww.Proto.EnumGender|null);

                    /** WwOnlineNoticeMessage Job */
                    Job?: (string|null);

                    /** WwOnlineNoticeMessage Phone */
                    Phone?: (string|null);

                    /** WwOnlineNoticeMessage CorpId */
                    CorpId?: (number|Long|null);

                    /** WwOnlineNoticeMessage Attr */
                    Attr?: (number|Long|null);

                    /** WwOnlineNoticeMessage DepartIds */
                    DepartIds?: ((number|Long)[]|null);

                    /** WwOnlineNoticeMessage IMEI */
                    IMEI?: (string|null);
                }

                /** Represents a WwOnlineNoticeMessage. */
                class WwOnlineNoticeMessage implements IWwOnlineNoticeMessage {

                    /**
                     * Constructs a new WwOnlineNoticeMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: Im.Scrm.Ww.Proto.IWwOnlineNoticeMessage);

                    /** WwOnlineNoticeMessage WxId. */
                    public WxId: (number|Long);

                    /** WwOnlineNoticeMessage Name. */
                    public Name: string;

                    /** WwOnlineNoticeMessage Alias. */
                    public Alias: string;

                    /** WwOnlineNoticeMessage AcctId. */
                    public AcctId: string;

                    /** WwOnlineNoticeMessage Avatar. */
                    public Avatar: string;

                    /** WwOnlineNoticeMessage Gender. */
                    public Gender: Im.Scrm.Ww.Proto.EnumGender;

                    /** WwOnlineNoticeMessage Job. */
                    public Job: string;

                    /** WwOnlineNoticeMessage Phone. */
                    public Phone: string;

                    /** WwOnlineNoticeMessage CorpId. */
                    public CorpId: (number|Long);

                    /** WwOnlineNoticeMessage Attr. */
                    public Attr: (number|Long);

                    /** WwOnlineNoticeMessage DepartIds. */
                    public DepartIds: (number|Long)[];

                    /** WwOnlineNoticeMessage IMEI. */
                    public IMEI: string;

                    /**
                     * Creates a new WwOnlineNoticeMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns WwOnlineNoticeMessage instance
                     */
                    public static create(properties?: Im.Scrm.Ww.Proto.IWwOnlineNoticeMessage): Im.Scrm.Ww.Proto.WwOnlineNoticeMessage;

                    /**
                     * Encodes the specified WwOnlineNoticeMessage message. Does not implicitly {@link Im.Scrm.Ww.Proto.WwOnlineNoticeMessage.verify|verify} messages.
                     * @param message WwOnlineNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: Im.Scrm.Ww.Proto.IWwOnlineNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified WwOnlineNoticeMessage message, length delimited. Does not implicitly {@link Im.Scrm.Ww.Proto.WwOnlineNoticeMessage.verify|verify} messages.
                     * @param message WwOnlineNoticeMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: Im.Scrm.Ww.Proto.IWwOnlineNoticeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a WwOnlineNoticeMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns WwOnlineNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Im.Scrm.Ww.Proto.WwOnlineNoticeMessage;

                    /**
                     * Decodes a WwOnlineNoticeMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns WwOnlineNoticeMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Im.Scrm.Ww.Proto.WwOnlineNoticeMessage;

                    /**
                     * Verifies a WwOnlineNoticeMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a WwOnlineNoticeMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns WwOnlineNoticeMessage
                     */
                    public static fromObject(object: { [k: string]: any }): Im.Scrm.Ww.Proto.WwOnlineNoticeMessage;

                    /**
                     * Creates a plain object from a WwOnlineNoticeMessage message. Also converts values to other types if specified.
                     * @param message WwOnlineNoticeMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: Im.Scrm.Ww.Proto.WwOnlineNoticeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this WwOnlineNoticeMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for WwOnlineNoticeMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }
            }
        }
    }
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of an Any. */
        interface IAny {

            /** Any type_url */
            type_url?: (string|null);

            /** Any value */
            value?: (Uint8Array|null);
        }

        /** Represents an Any. */
        class Any implements IAny {

            /**
             * Constructs a new Any.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IAny);

            /** Any type_url. */
            public type_url: string;

            /** Any value. */
            public value: Uint8Array;

            /**
             * Creates a new Any instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Any instance
             */
            public static create(properties?: google.protobuf.IAny): google.protobuf.Any;

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Any message, length delimited. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Any;

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Any;

            /**
             * Verifies an Any message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Any
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Any;

            /**
             * Creates a plain object from an Any message. Also converts values to other types if specified.
             * @param message Any
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Any, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Any to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Any
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}
