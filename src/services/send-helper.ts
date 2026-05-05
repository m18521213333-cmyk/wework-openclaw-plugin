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
  taskId?: number;
}

// ============================================
// 核心发送函数
// ============================================

/**
 * 通过 Java 后端 WS 发送指令
 * 对应原 PC 前端 WebSocket 发 JSON → WebSocketMessageProcessor 分发
 *
 * ⚠️ 同步快失败版: 不连接就返回. 历史路径 + 后台调度保留这个语义.
 * 新代码请用 sendToJavaWithRetry — 会等重连 + 重试.
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
// 异步重试版 sendToJava (主路径)
// ============================================

/** sendToJavaWithRetry 选项 */
export interface SendRetryOpts {
  /** 最多尝试次数 (含首次), 默认 4 */
  attempts?: number;
  /** 单次等待 client.connected 变 true 的最大时间 (ms), 默认 15000 */
  waitForConnectMs?: number;
  /** 重试间隔起始值 (ms), 默认 400. 实际间隔: 400 → 800 → 1600 → 3200 ms (指数退避) */
  backoffStartMs?: number;
  /** 想看每次尝试就传; 用 logger.info 之类 */
  onAttempt?: (attempt: number, info: { connected: boolean; lastError?: string }) => void;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * 等 WS 客户端 _connected 变 true (用于子进程刚启动 / 临时被踢后重连场景).
 * 客户端自身有 5s 自动重连, 这里只是配合等待.
 */
async function waitForConnect(timeoutMs: number): Promise<boolean> {
  const client = getWeWorkClient();
  if (!client) return false;
  if (client.connected) return true;
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (client.connected) return true;
    await sleep(200);
  }
  return client.connected;
}

/**
 * 通过 Java 后端 WS 发送指令, 失败自动重试.
 *
 * 重试策略:
 *   1. 检查 client.connected. 如果断了, 等最多 waitForConnectMs (默认 15s) 让 WS 自动重连
 *   2. 调 client.sendCommand. 成功就返回
 *   3. 失败 (网络异常 / 被 Java 踢) 就 backoffStartMs * 2^(attempt-1) 退避后重试
 *   4. 重试 attempts 次仍失败, 返回最后一次错误
 *
 * 触发场景:
 *   - 多个 CLI 子进程同时 auth pluginbot-cli, Java 互相踢 → 短暂 1-2s _connected=false
 *   - Java 后端重启 → 5-30s 不可用
 *   - 凭据轮换时 plugin 重启 → ~10s 不可用
 */
export async function sendToJavaWithRetry(
  msgType: string,
  content: Record<string, unknown>,
  opts: SendRetryOpts = {},
): Promise<SendResult> {
  const attempts = Math.max(1, opts.attempts ?? 4);
  const waitForConnectMs = opts.waitForConnectMs ?? 15000;
  const backoffStartMs = opts.backoffStartMs ?? 400;

  const client = getWeWorkClient();
  if (!client) {
    return { success: false, error: "WS 客户端未初始化" };
  }

  let lastError = "";
  for (let i = 1; i <= attempts; i++) {
    // 等连接
    const connected = await waitForConnect(waitForConnectMs);
    opts.onAttempt?.(i, { connected, lastError: lastError || undefined });
    if (!connected) {
      lastError = `等待 Java 后端连接 ${waitForConnectMs / 1000}s 仍未恢复`;
      // 后续 attempt 还会再等一次, 但最后一轮就直接退出
      if (i === attempts) break;
      await sleep(backoffStartMs * Math.pow(2, i - 1));
      continue;
    }

    // 发
    const ok = client.sendCommand(msgType, content);
    if (ok) {
      return { success: true };
    }
    lastError = `第 ${i}/${attempts} 次发送失败 (sendCommand 返回 false, 可能 ws 临时不可写)`;

    // 退避
    if (i < attempts) {
      await sleep(backoffStartMs * Math.pow(2, i - 1));
    }
  }

  return { success: false, error: `重试 ${attempts} 次仍失败: ${lastError}` };
}

// ============================================
// 内容类型映射
// ============================================

/**
 * 把 contentType 名字归一化成 protobuf EnumContentType 的字符串形式.
 * Java 端 JsonFormat.parser() 期望 enum 字段是字符串名 (e.g. "Text"), 不是数字.
 * 数字会让 protobuf 解析失败 → builder 字段全空 → vo.getWxId()=0 → msgSend2Phone 找不到 channel.
 */
function contentTypeValue(name: string): string {
  const map: Record<string, string> = {
    text: "Text", image: "Picture", picture: "Picture",
    voice: "Voice", video: "Video", link: "Link",
    file: "File", namecard: "NameCard", location: "Location",
    weapp: "WeApp", emoji: "Emoji",
  };
  return map[name.toLowerCase()] ?? "Text";
}

// ============================================
// 阶段 3: 消息
// ============================================

/** 构造 TalkToFriendTask payload (sendMessage / sendMessageWithRetry 共用) */
function buildSendMessagePayload(
  wxId: string, convId: string, content: string,
  contentType: string, atList?: string[],
): Record<string, unknown> {
  // 跟 web 前端 webSocketApi.js TalkToFriendTask 严格对齐:
  //   - WxId/ConvId/TaskId 用字符串 (int64 在 JSON 里官方推荐字符串, 避免 JS 精度丢失)
  //   - ContentType 用 enum 字符串名字 ("Text" 不是 0)
  //   - Content 是 bytes, base64 编码
  // 用数字会让 Java JsonFormat.parser() 解析失败 → vo.WxId=0 → msgSend2Phone 找不到 channel
  const payload: Record<string, unknown> = {
    WxId: String(wxId),
    ConvId: String(convId),
    ContentType: contentTypeValue(contentType),
    Content: Buffer.from(content, "utf8").toString("base64"),
    TaskId: String(Date.now()),
  };
  if (atList?.length) payload.AtSomeOne = atList.map(String);
  return payload;
}

export function sendMessage(
  wxId: string, convId: string, content: string,
  contentType: string = "text", atList?: string[],
): SendResult {
  return sendToJava("TalkToFriendTask", buildSendMessagePayload(wxId, convId, content, contentType, atList));
}

/** 异步重试版 sendMessage — 推荐主路径用这个 */
export async function sendMessageWithRetry(
  wxId: string, convId: string, content: string,
  contentType: string = "text", atList?: string[],
  opts?: SendRetryOpts,
): Promise<SendResult> {
  return sendToJavaWithRetry(
    "TalkToFriendTask",
    buildSendMessagePayload(wxId, convId, content, contentType, atList),
    opts,
  );
}

export function revokeMessage(wxId: string, msgId: string, convId: string): SendResult {
  return sendToJava("MsgRevokeTask", {
    WxId: String(wxId), MsgId: String(msgId), ConvId: String(convId),
  });
}

export async function revokeMessageWithRetry(wxId: string, msgId: string, convId: string, opts?: SendRetryOpts): Promise<SendResult> {
  return sendToJavaWithRetry("MsgRevokeTask", {
    WxId: String(wxId), MsgId: String(msgId), ConvId: String(convId),
  }, opts);
}

export function forwardMessage(wxId: string, msgId: string, fromConvId: string, toConvId: string): SendResult {
  return sendToJava("ForwardMsgTask", {
    WxId: String(wxId), MsgId: String(msgId), ConvId: String(fromConvId), ToConvId: String(toConvId),
  });
}

export async function forwardMessageWithRetry(wxId: string, msgId: string, fromConvId: string, toConvId: string, opts?: SendRetryOpts): Promise<SendResult> {
  return sendToJavaWithRetry("ForwardMsgTask", {
    WxId: String(wxId), MsgId: String(msgId), ConvId: String(fromConvId), ToConvId: String(toConvId),
  }, opts);
}

export function forwardMultiMessages(wxId: string, msgIds: string[], fromConvId: string, toConvId: string): SendResult {
  return sendToJava("ForwardMultiTask", {
    WxId: String(wxId), MsgIds: msgIds.map(String), ConvId: String(fromConvId), ToConvId: String(toConvId),
  });
}

export async function forwardMultiMessagesWithRetry(wxId: string, msgIds: string[], fromConvId: string, toConvId: string, opts?: SendRetryOpts): Promise<SendResult> {
  return sendToJavaWithRetry("ForwardMultiTask", {
    WxId: String(wxId), MsgIds: msgIds.map(String), ConvId: String(fromConvId), ToConvId: String(toConvId),
  }, opts);
}

export function searchMessages(wxId: string, keyword: string, convId?: string): SendResult {
  const p: Record<string, unknown> = { WxId: String(wxId), Keyword: keyword };
  if (convId) p.ConvId = String(convId);
  return sendToJava("SearchMsgTask", p);
}

export function triggerHistoryMessages(wxId: string, convId: string, count: number = 50): SendResult {
  return sendToJava("TriggerHistoryMsgPushTask", {
    WxId: String(wxId), ConvId: String(convId), Count: count,
  });
}

// ============================================
// 阶段 4: 联系人
// ============================================

export function getContactInfo(wxId: string, remoteId: string): SendResult {
  return sendToJava("GetContactInfoTask", { WxId: String(wxId), RemoteId: String(remoteId) });
}

export function addCustomerById(wxId: string, remoteId: string, verifyContent?: string): SendResult {
  const p: Record<string, unknown> = { WxId: String(wxId), RemoteId: String(remoteId) };
  if (verifyContent) p.VerifyContent = verifyContent;
  return sendToJava("AddCustomerByIdTask", p);
}

export function addCustomerFromSearch(wxId: string, searchText: string, verifyContent?: string): SendResult {
  const p: Record<string, unknown> = { WxId: String(wxId), SearchText: searchText };
  if (verifyContent) p.VerifyContent = verifyContent;
  return sendToJava("AddCustomerFromSearchTask", p);
}

export function addCustomerFromWx(wxId: string, wxFriendId: string, verifyContent?: string): SendResult {
  const p: Record<string, unknown> = { WxId: String(wxId), WxFriendId: Number(wxFriendId) };
  if (verifyContent) p.VerifyContent = verifyContent;
  return sendToJava("AddCustomerFromWxTask", p);
}

export function deleteCustomer(wxId: string, remoteId: string): SendResult {
  return sendToJava("TriggerCustomerPushTask", { WxId: String(wxId), RemoteId: String(remoteId) });
}

export function acceptCustomer(wxId: string, remoteId: string): SendResult {
  return sendToJava("AcceptCustomerTask", { WxId: String(wxId), RemoteId: String(remoteId) });
}

export function setUserMemo(wxId: string, remoteId: string, memo: string): SendResult {
  return sendToJava("SetUserMemoTask", { WxId: String(wxId), RemoteId: String(remoteId), Memo: memo });
}

export function getExtUserId(wxId: string, remoteId: string): SendResult {
  return sendToJava("GetExtUserIdTask", { WxId: String(wxId), RemoteId: String(remoteId) });
}

export function sendFriendVerify(wxId: string, remoteId: string, verifyContent?: string): SendResult {
  const p: Record<string, unknown> = { WxId: String(wxId), RemoteId: String(remoteId) };
  if (verifyContent) p.VerifyContent = verifyContent;
  return sendToJava("AddCustomerByIdTask", p);
}

// ============================================
// 阶段 5: 群聊 + 标签
// ============================================

/**
 * 双监听: 同时等
 *   - TaskResultNotice (按 TaskId 匹配, ExtId = 新群 ConvId)
 *   - ConversationAddNotice (按群 Name 匹配, Convers.Id = 新群 ConvId)
 * 谁先到用谁. 用于建群等异步操作 + 自动后续动作.
 */
export async function waitTaskResult(
  taskId: number | string,
  timeoutMs: number = 30000,
  matchByName?: string,
): Promise<{ success: boolean; convId?: string; ext?: string; errMsg?: string }> {
  const client = getWeWorkClient();
  if (!client) return { success: false, errMsg: "WS 客户端未初始化" };
  const targetTaskId = String(taskId);
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      client.off("json-message", listener);
      resolve({ success: false, errMsg: `等待结果超时 (${timeoutMs}ms)` });
    }, timeoutMs);
    const listener = (json: any) => {
      const msgType = json?.msgType ?? json?.MsgType;
      let inner: any = json.message ?? json.Content;
      if (typeof inner === "string") {
        try { inner = JSON.parse(inner); } catch {}
      }
      // 路径 1: TaskResultNotice 按 TaskId 匹配
      if (msgType === "TaskResultNotice") {
        const tid = String(inner?.TaskId ?? inner?.taskId ?? "");
        if (tid === targetTaskId) {
          clearTimeout(timer);
          client.off("json-message", listener);
          resolve({
            success: !!inner?.Success,
            convId: inner?.ExtId ? String(inner.ExtId) : undefined,
            ext: inner?.Ext,
            errMsg: inner?.ErrMsg,
          });
          return;
        }
      }
      // 路径 2: ConversationAddNotice 按群名匹配 (建群专用)
      if (matchByName && msgType === "ConversationAddNotice") {
        const conv = inner?.Convers ?? inner?.convers;
        const name = conv?.Name ?? conv?.name;
        if (name === matchByName) {
          const cid = conv?.Id ?? conv?.id;
          if (cid) {
            clearTimeout(timer);
            client.off("json-message", listener);
            resolve({ success: true, convId: String(cid) });
            return;
          }
        }
      }
    };
    client.on("json-message", listener);
  });
}

/** 群操作 action → proto enum 名 (RoomName/AddMember/...) */
function buildChatRoomPayload(wxId: string, action: string, convId?: string, members?: string[], content?: string, taskId?: number): { payload: Record<string, unknown>; taskId: number } {
  // proto EnumChatRoomAction (string enum, 不是顺序编号):
  //   RoomName=0/改群名, ModifyPublicNoti=1/改公告, AddMember=2/拉人, KickMember=3/踢人,
  //   RoomShowName=4/改群内显示名, AddToPhonebook=5, NewMsgNoti=6, ExitRoom=7/退群,
  //   CreateRoom=8/建群, ViewAllMember=9, TransferOwner=10, SetVerify=11,
  //   AddManager=12, DelManager=13, SetRemark=14/设置备注
  const actionMap: Record<string, string> = {
    set_name: "RoomName",
    set_notice: "ModifyPublicNoti",
    add_member: "AddMember",
    remove_member: "KickMember",
    kick: "KickMember",
    show_name: "RoomShowName",
    quit: "ExitRoom",
    exit: "ExitRoom",
    create: "CreateRoom",
    list_members: "ViewAllMember",
    set_remark: "SetRemark",
  };
  const tid = taskId ?? Date.now();
  const p: Record<string, unknown> = {
    WxId: String(wxId),
    Action: actionMap[action] ?? "RoomName",
    taskId: String(tid),  // 注意 proto 字段是小写 taskId
  };
  if (convId) p.ConvId = String(convId);
  if (members?.length) p.Members = members.map(String);
  if (content) p.Content = content;
  return { payload: p, taskId: tid };
}

export function chatRoomAction(wxId: string, action: string, convId?: string, members?: string[], content?: string, taskId?: number): SendResult {
  const { payload, taskId: tid } = buildChatRoomPayload(wxId, action, convId, members, content, taskId);
  const r = sendToJava("ChatRoomActionTask", payload);
  return r.success ? { success: true, taskId: tid } as any : r;
}

export async function chatRoomActionWithRetry(wxId: string, action: string, convId?: string, members?: string[], content?: string, taskId?: number, opts?: SendRetryOpts): Promise<SendResult> {
  const { payload, taskId: tid } = buildChatRoomPayload(wxId, action, convId, members, content, taskId);
  const r = await sendToJavaWithRetry("ChatRoomActionTask", payload, opts);
  return r.success ? { success: true, taskId: tid } as any : r;
}

export function getGroupMembers(wxId: string, convId: string): SendResult {
  return sendToJava("ChatRoomActionTask", { WxId: String(wxId), ConvId: String(convId), Action: -1 });
}

export function createLabel(wxId: string, labelName: string): SendResult {
  return sendToJava("UserLabelSetTask", { WxId: String(wxId), LabelName: labelName });
}

export function deleteLabel(wxId: string, labelId: string): SendResult {
  return sendToJava("UserLabelDelTask", { WxId: String(wxId), LabelId: Number(labelId) });
}

export function modifyLabel(wxId: string, labelId: string, labelName: string): SendResult {
  return sendToJava("UserLabelModifyTask", { WxId: String(wxId), LabelId: Number(labelId), LabelName: labelName });
}

export function setUserLabels(wxId: string, remoteId: string, labelIds: string[]): SendResult {
  return sendToJava("UserSetLabelTask", { WxId: String(wxId), RemoteId: String(remoteId), LabelIds: labelIds.map(Number) });
}

export function triggerLabelSync(wxId: string): SendResult {
  return sendToJava("TriggerUserLabelTask", { WxId: String(wxId) });
}

export function massSend(wxId: string, convIds: string[], content: string, contentType: string = "text"): SendResult {
  // Java 后端没有 QunFaTask handler — 在客户端循环单发实现群发.
  let okCount = 0;
  let firstErr = "";
  for (const convId of convIds) {
    const r = sendMessage(wxId, convId, content, contentType);
    if (r.success) okCount++;
    else if (!firstErr) firstErr = r.error ?? "unknown";
  }
  if (okCount === convIds.length) {
    return { success: true };
  }
  return {
    success: false,
    error: `群发部分失败 (成功 ${okCount}/${convIds.length}): ${firstErr}`,
  };
}

/** 异步重试版群发: 每条都各自走 sendMessageWithRetry, 单条失败不影响后续. */
export async function massSendWithRetry(wxId: string, convIds: string[], content: string, contentType: string = "text", opts?: SendRetryOpts): Promise<SendResult> {
  let okCount = 0;
  let firstErr = "";
  for (const convId of convIds) {
    const r = await sendMessageWithRetry(wxId, convId, content, contentType, undefined, opts);
    if (r.success) okCount++;
    else if (!firstErr) firstErr = r.error ?? "unknown";
  }
  if (okCount === convIds.length) {
    return { success: true };
  }
  return {
    success: false,
    error: `群发部分失败 (成功 ${okCount}/${convIds.length}): ${firstErr}`,
  };
}

// ============================================
// 阶段 6: 朋友圈
// ============================================

function buildPostMomentsPayload(wxId: string, content: string, contentType: string = "text", mediaUrls?: string[], linkUrl?: string, linkTitle?: string, visibleList?: string[]): Record<string, unknown> {
  // PostSnsTaskMessage proto 字段: WxId, Content(string), Media, Comment, Visible, TaskId, Poi
  // 注意: Content 是 string 类型 (不是 bytes), 不要 base64; 也没有 ContentType 字段.
  const p: Record<string, unknown> = {
    WxId: String(wxId),
    Content: content,
    TaskId: Date.now(),
  };
  if (mediaUrls?.length) {
    // MediaMessage: Type (0=Picture 1=Video 2=Link), Content (url 数组)
    const typeMap: Record<string, number> = { image: 0, picture: 0, video: 1, link: 2 };
    p.Media = {
      Type: typeMap[contentType.toLowerCase()] ?? 0,
      Content: linkUrl ? [linkUrl, linkTitle ?? "", ...mediaUrls] : mediaUrls,
    };
  }
  if (visibleList?.length) {
    p.Visible = { userIds: visibleList.map(String) };
  }
  return p;
}

export function postMoments(wxId: string, content: string, contentType: string = "text", mediaUrls?: string[], linkUrl?: string, linkTitle?: string, visibleList?: string[]): SendResult {
  return sendToJava("PostSnsTask", buildPostMomentsPayload(wxId, content, contentType, mediaUrls, linkUrl, linkTitle, visibleList));
}

export async function postMomentsWithRetry(wxId: string, content: string, contentType: string = "text", mediaUrls?: string[], linkUrl?: string, linkTitle?: string, visibleList?: string[], opts?: SendRetryOpts): Promise<SendResult> {
  return sendToJavaWithRetry("PostSnsTask", buildPostMomentsPayload(wxId, content, contentType, mediaUrls, linkUrl, linkTitle, visibleList), opts);
}

export function postMomentsTask(wxId: string, taskId: string): SendResult {
  return sendToJava("PostSnsTaskTask", { WxId: String(wxId), TaskId: Number(taskId) });
}

export function getSnsData(wxId: string, snsId: string): SendResult {
  return sendToJava("GetSnsDataTask", { WxId: String(wxId), SnsId: String(snsId) });
}

export function pullMySns(wxId: string): SendResult {
  return sendToJava("PullMySnsListTask", { WxId: String(wxId) });
}

export function pullSnsTaskList(wxId: string): SendResult {
  return sendToJava("PullSnsTaskListTask", { WxId: String(wxId) });
}

export function snsComment(wxId: string, snsId: string, content: string, replyTo?: string): SendResult {
  const p: Record<string, unknown> = { WxId: String(wxId), SnsId: String(snsId), Content: content };
  if (replyTo) p.ReplyTo = Number(replyTo);
  return sendToJava("SnsCommentTask", p);
}

export function snsLike(wxId: string, snsId: string): SendResult {
  return sendToJava("SnsLikeTask", { WxId: String(wxId), SnsId: String(snsId) });
}

export function deleteSns(wxId: string, snsId: string): SendResult {
  return sendToJava("DelSnsTask", { WxId: String(wxId), SnsId: String(snsId) });
}

export function deleteSnsComment(wxId: string, snsId: string, commentId: string): SendResult {
  return sendToJava("DelSnsCommentTask", { WxId: String(wxId), SnsId: String(snsId), CommentId: Number(commentId) });
}

// ============================================
// 设备
// ============================================

export function phoneState(wxId: string): SendResult {
  return sendToJava("PhoneStateTask", { WxId: String(wxId) });
}

export function pullQrCode(wxId: string): SendResult {
  return sendToJava("PullMyQrCodeTask", { WxId: String(wxId) });
}

export function downloadByUrl(wxId: string, url: string): SendResult {
  return sendToJava("DownloadFileByUrlTask", { WxId: String(wxId), Url: url });
}

/**
 * 触发 Java 让手机 SDK 上传指定 msgId 对应的媒体文件到图床.
 * 需要传 MsgRemoteId + FileType 才能让 SDK 真响应 (web 端实测).
 *   FileType: 0=原始文件 (适用所有 原图/视频/音频/文件)
 *             1=大图 4=语音 5=视频 6=文件
 */
export function downloadByMsgId(wxId: string, msgId: string, msgRemoteId?: string, fileType: number = 0): SendResult {
  return sendToJava("DownloadFileByMsgIdTask", {
    WxId: String(wxId),
    MsgId: String(msgId),
    MsgRemoteId: String(msgRemoteId ?? ""),
    FileType: fileType,
    TaskId: String(Date.now()),
  });
}

export async function downloadByMsgIdWithRetry(wxId: string, msgId: string, msgRemoteId?: string, fileType: number = 0, opts?: SendRetryOpts): Promise<SendResult> {
  return sendToJavaWithRetry("DownloadFileByMsgIdTask", {
    WxId: String(wxId),
    MsgId: String(msgId),
    MsgRemoteId: String(msgRemoteId ?? ""),
    FileType: fileType,
    TaskId: String(Date.now()),
  }, opts);
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
  return sendToJava(mt, { WxId: String(wxId) });
}
