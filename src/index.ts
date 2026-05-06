/**
 * WeWork SCRM - OpenClaw Plugin (方案B: WS 客户端模式)
 *
 * 通过 WebSocket 连接 Java 后端 (:15088)，使用 JSON 协议。
 * 与原有 Web 管理端共存，同一个手机端，同一个后端，两个入口。
 *
 * 架构:
 *   手机SDK ←→ Java后端 (TCP:15087) ←→ Web管理端 (HTTP:15086)
 *                  ↕
 *              Java WS (:15088)
 *               ↕         ↕
 *           PC前端     OpenClaw (本插件)
 */

import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";

// 工具注册
import { registerMessageTools } from "./tools/message-tools.js";
import { registerContactTools } from "./tools/contact-tools.js";
import { registerGroupTools } from "./tools/group-tools.js";
import { registerMomentsTools } from "./tools/moments-tools.js";
import { registerDeviceTools } from "./tools/device-tools.js";

// WS 客户端
import { getWeWorkClient } from "./services/websocket-service.js";

// 自动化 + AI + 存储 + 调度
import {
  getDb, closeDb,
  addPendingTask, findPendingTaskByMatch, markPendingTaskDone,
  cleanupStalePendingTasks,
} from "./services/storage-service.js";
import { handleAiReply } from "./services/dify-service.js";
import { checkKeywordReply, checkAutoAcceptFriend, persistMessage } from "./services/automation-engine.js";
import { startScheduler, stopScheduler } from "./services/scheduler-service.js";
import { startPhoneMonitor, stopPhoneMonitor } from "./services/phone-monitor.js";
import { startHealthMonitor, stopHealthMonitor } from "./services/health-monitor.js";
import { startContactSync, stopContactSync, handleContactPush, getLastSyncTime } from "./services/contact-sync.js";
import { startAgentBackend } from "./services/agent-backend.js";
import type { LLMProviderConfig } from "./services/llm-provider.js";
import type { Server as HttpServer } from "node:http";
import { handleAiCommand } from "./services/ai-command.js";
import { listPhoneStatusEvents, findContactsByName, listContacts, countContacts, getLastMediaFromSender, getRecentMediaFromSender, recordResolvedMediaUrl, getResolvedMediaUrl, getResolvedMediaStatus, clearResolvedMediaRecord, isTransientResolveError, getMessageMeta, upsertMoment, listMoments, getMomentBySnsId, upsertMomentsTask, listMomentsTasks, upsertQrcode, recordPostMomentsResult } from "./services/storage-service.js";

// send-helper (CLI 直接调用)
// 子进程模式下 Java pluginbot-cli 经常被互踢, 所有 send 路径都走 withRetry 版.
// sync 版 (sendMessage/forwardMessage/...) 留给后台 service 进程的事件回调用 — 那边 WS 长连接稳定.
import {
  searchMessages, triggerHistoryMessages,
  getContactInfo, triggerSync, phoneState, reconnectPhone,
  pullMySns,
  waitTaskResult,
  sendMessageWithRetry, forwardMessageWithRetry,
  massSendWithRetry, postMomentsWithRetry,
  chatRoomActionWithRetry, downloadByMsgIdWithRetry,
  revokeMessageWithRetry,
  addCustomerById, acceptCustomer, getExtUserId, setUserMemo,
  setUserLabels, snsLike, snsComment, deleteSns, pullQrCode,
  getSnsData, pullSnsTaskList,
} from "./services/send-helper.js";

// node 内置: HTTP 上传 (wework upload 用)
import * as fs from "node:fs";
import * as path from "node:path";

const DEFAULT_CONFIG = {
  /** Java 后端 WebSocket 地址 (默认走本机 loopback;
   *  跨机部署时通过 ~/.openclaw/openclaw.json 的 plugins.entries.wework-scrm.config.javaWsUrl 覆盖) */
  javaWsUrl: "ws://127.0.0.1:15088",
  /**
   * 必须配认证, 否则 Java 后端不会向我们这条 WS 推送任何业务消息
   * (Java 端 msgSend2pc 只对认证过的连接广播).
   * 在 ~/.openclaw/openclaw.json 的 plugins.entries.wework-scrm.config.auth 里设:
   *   "auth": { "username": "pluginbot", "password": "xxx",
   *             "cliUsername": "pluginbot-cli", "cliPassword": "yyy" }
   * cliUsername/cliPassword 是 CLI 命令专用账号 — 跟 service 用不同账号,
   * 避免 CLI 调用 squeeze 现有 service 的 WS 连接 (Java 端按 account 名互斥).
   */
  auth: {
    authType: 2 as 2 | 3,
    username: "",
    password: "",
    cliUsername: "",
    cliPassword: "",
  },
  storage: { type: "sqlite" as const, sqlitePath: "./wework-scrm.db" },
  dify: { enabled: false, apiUrl: "", apiKey: "" },
};

export default definePluginEntry({
  id: "wework-scrm",
  name: "WeWork SCRM",
  description: "企业微信 SCRM 插件 — 通过 Java 后端 WS 协议操控消息/联系人/群聊/朋友圈",

  register(api: OpenClawPluginApi) {
    const logger = api.logger;

    // Agent backend HTTP server handle (Express, 给 web v2 /api/agent/* 用)
    let agentHttpServer: HttpServer | null = null;

    // OpenClaw SDK 的 api.config 是整个 ~/.openclaw/openclaw.json 的内容,
    // 插件自己的 config 在 plugins.entries["wework-scrm"].config 里, 要手动取
    const wholeCfg = (api.config ?? {}) as Record<string, any>;
    const pluginCfg = wholeCfg?.plugins?.entries?.["wework-scrm"]?.config ?? {};
    const cfg = {
      ...DEFAULT_CONFIG,
      ...pluginCfg,
      auth: { ...DEFAULT_CONFIG.auth, ...(pluginCfg.auth ?? {}) },
      storage: { ...DEFAULT_CONFIG.storage, ...(pluginCfg.storage ?? {}) },
      dify: { ...DEFAULT_CONFIG.dify, ...(pluginCfg.dify ?? {}) },
    };

    // 注册全部 Agent 工具 (36个) — 始终注册, 让 OpenClaw inspect/agent 都能看到 tools
    // (避免之前 "WEWORK_PLUGIN_ENABLE 没设就 return" 导致 tool 不可见的问题)
    registerMessageTools(api);
    registerContactTools(api);
    registerGroupTools(api);
    registerMomentsTools(api);
    registerDeviceTools(api);

    // [2026-05-04 已知限制] OpenClaw 2026.5.x 改了 plugin 暴露 tool 给 agent 的规则,
    // 要求 plugin 是 "capability mode" (注册 channel/provider/agent-harness 等). 我们目前
    // 是 "non-capability" mode, 所以 36 个 wework_* tools 在 CLI 和 service 里都能用,
    // 但 LLM agent (openclaw agent ...) 看不到它们. 解决路径需要重构 plugin 注册逻辑.
    // 当前 workaround: 用户继续用 CLI (wework send/group/moments/...) 直接驱动.

    // 后台服务: WS 客户端连接 Java 后端
    api.registerService({
      id: "wework-ws-client",

      async start() {
        // WS 连接只能由 systemd-managed openclaw-scrm.service 持有 (避免多进程
        // 同账号 squeeze). 其他 openclaw 进程 (CLI / agent / inspect) 加载
        // plugin 时跳过 WS, 但 tools 正常注册可见.
        if (process.env.WEWORK_PLUGIN_ENABLE !== "1") {
          logger.info("[wework-scrm] tools 已注册, 但跳过 WS 连接 (没 WEWORK_PLUGIN_ENABLE=1)");
          return;
        }

        // 初始化 SQLite
        getDb(cfg.storage.sqlitePath);
        logger.info(`[Storage] SQLite: ${cfg.storage.sqlitePath}`);

        // 连接 Java 后端 WS (含认证)
        const client = getWeWorkClient({
          serverUrl: cfg.javaWsUrl,
          authType: cfg.auth.authType,
          username: cfg.auth.username,
          password: cfg.auth.password,
        });

        if (!cfg.auth.username && cfg.auth.authType !== 3) {
          logger.error("[Auth] auth.username 为空, Java 后端不会推送业务消息! 请在 ~/.openclaw/openclaw.json 的 plugins.entries.wework-scrm.config.auth 里配置");
        }

        client.on("log", (m: string) => logger.info(`[WS] ${m}`));
        client.on("error", (e: Error) => logger.error(`[WS] ${e.message}`));

        client.on("connected", () => {
          logger.info(`[Ready] 已连接 Java 后端 ${cfg.javaWsUrl}`);
        });

        // 接收 Java 后端推送的事件 (与 PC 前端收到的一样)
        // 注意: Java 发给客户端的 JSON 字段是小写开头 (msgType/message),
        //       客户端发给 Java 是大写开头 (MsgType/Content). 两边都兼容一下.
        client.on("json-message", async (json: Record<string, unknown>) => {
          try {
            const msgType = (json.msgType ?? json.MsgType) as string;
            let rawContent: any = json.message ?? json.Message ?? json.Content;
            if (typeof rawContent === "string") {
              try { rawContent = JSON.parse(rawContent); } catch {}
            }
            const content = (rawContent ?? {}) as Record<string, unknown>;

            // 消息通知 → 持久化 + 自动回复
            if (msgType === "FriendTalkNotice") {
              const d = content as {
                WxId?: number; ConvId?: number; SenderId?: number; SenderName?: string;
                Content?: string; ContentType?: number; MsgId?: number; MsgRemoteId?: number; CreateTime?: number;
              };

              persistMessage({
                wxId: String(d.WxId ?? ""), convId: String(d.ConvId ?? ""),
                senderId: String(d.SenderId ?? ""), senderName: d.SenderName ?? "",
                contentType: d.ContentType ?? 0, content: d.Content ?? "",
                msgId: d.MsgId, msgRemoteId: d.MsgRemoteId,
                isSend: "false", createTime: d.CreateTime,
              });

              // /ai 命令优先 (你个人微信 → 孟伟企微 发 "/ai 给客户XX发祝福")
              // allowedSenders 白名单从 plugin config 读, 支持你个人微信对应的外部 RemoteId
              const aiAllowedSenders: string[] =
                (cfg as any).ai?.allowedSenders ?? (pluginCfg as any).ai?.allowedSenders ?? [];
              const aiHandled = handleAiCommand({
                wxId: String(d.WxId ?? ""),
                convId: String(d.ConvId ?? ""),
                senderId: String(d.SenderId ?? ""),
                senderName: d.SenderName,
                contentBase64: d.Content ?? "",
                contentType: d.ContentType ?? 0,
                allowedSenders: aiAllowedSenders,
                logger,
              });

              if (!aiHandled) {
                const handled = checkKeywordReply(
                  String(d.WxId), String(d.ConvId), d.Content ?? "", d.ContentType ?? 0, logger,
                );

                if (!handled && cfg.dify.enabled) {
                  await handleAiReply(
                    String(d.WxId), String(d.ConvId), String(d.SenderId), d.SenderName ?? "", d.Content ?? "",
                    { apiUrl: cfg.dify.apiUrl!, apiKey: cfg.dify.apiKey! }, logger,
                  );
                }
              }
            }

            // 新客户通知 → 自动接受
            if (msgType === "CustomerAddNotice" || msgType === "NewCustomerPushNotice") {
              const wxId = String(content.WxId ?? "");
              const remoteId = String(content.RemoteId ?? "");
              if (remoteId && remoteId !== "0") {
                checkAutoAcceptFriend(wxId, remoteId, logger);
              }
              // 同时落库 contacts 表 (单个客户进来, content 直接是客户字段)
              if (remoteId) {
                handleContactPush({
                  WxId: wxId,
                  Contacts: [{
                    RemoteId: remoteId,
                    Name: content.Name,
                    Alias: content.Alias,
                    Avatar: content.Avatar,
                    CorpId: content.CorpId,
                    CorpName: content.CorpName,
                    Type: content.Type ?? 2,  // 默认外部
                    Gender: content.Gender,
                    Phone: content.Phone,
                    Position: content.Position ?? content.Job,
                  }],
                }, logger);
              }
            }

            // 联系人 / 客户列表批量推送 → 落库 contacts 表
            // (sync contacts 触发后 Java 推这些消息, 一次可能几百个联系人)
            if (
              msgType === "ContactPushNotice" ||
              msgType === "CustomerPushNotice" ||
              msgType === "ConversationPushNotice"  // 群成员也包含 RemoteId
            ) {
              handleContactPush(content, logger);
            }

            // 新会话通知 (建群完成等异步操作的回调)
            // 用于跨进程 IPC: CLI 写入 pending_tasks 后退出, service 这边收到推送匹配执行
            // Java 通知文件下载完成 (视频/文件转发的关键 notice)
            // 字段: WxId, Success, ErrMsg, OrgUrl, Url, FileType (1大图 4语音 5视频 6文件), TaskId, MsgId
            if (msgType === "DownloadFileResultNotice") {
              const success = content.Success ?? content.success ?? false;
              const newUrl = String(content.Url ?? content.url ?? "");
              const msgId = String(content.MsgId ?? content.msgId ?? "");
              const fileType = content.FileType ?? content.fileType;
              const errMsg = content.ErrMsg ?? content.errMsg;
              const ftNum = typeof fileType === "number" ? fileType : undefined;
              const errStr = typeof errMsg === "string" ? errMsg : undefined;
              if (success && newUrl && msgId) {
                recordResolvedMediaUrl(msgId, newUrl, ftNum, true);
                logger.info(`[Download] ✅ msgId=${msgId} fileType=${fileType} → ${newUrl}`);
              } else if (msgId) {
                recordResolvedMediaUrl(msgId, "", ftNum, false, errStr);
                logger.warn(`[Download] ❌ msgId=${msgId} fileType=${fileType} success=${success} err="${errStr ?? ""}"`);
              }
            }

            // 朋友圈拉取结果 (我的朋友圈列表 / 单条详情) → 落 SQLite moments 表
            // 解决 fire-and-forget: tool/CLI 发完 PullMySnsListTask 立即拿不到数据,
            // 这里 WS push 进来后写库, tool/CLI 等几秒再读 SQLite 拿到.
            // 字段映射 (proto bundle.d.ts 行 4977/5098/5220):
            //   PullMySnsListTaskResultNoticeMessage:
            //     WxId int64 / Success bool / ErrMsg / SnsList: ISnsInfoMessage[] / NextSeq
            //   GetSnsDataTaskResultNoticeMessage:
            //     WxId int64 / Success bool / ErrMsg / SnsInfo: ISnsInfoMessage / TaskId
            //   ISnsInfoMessage:
            //     SnsId int64 / Author int64 / Content string / Images: ISnsMediaInfoMessage[]
            //     Link / Video: ISnsMediaInfoMessage / Comments / Likes / Time uint32 / PostId / Type
            //   ISnsMediaInfoMessage: { ThumbImg, Url, Desc }
            if (msgType === "PullMySnsListTaskResultNotice" || msgType === "GetSnsDataTaskResultNotice") {
              const wxId = String(content.WxId ?? (content as any).wxId ?? "");
              const success = (content.Success ?? (content as any).success) !== false;
              if (!success) {
                const err = content.ErrMsg ?? (content as any).errMsg;
                logger.warn(`[Moments] ${msgType} 失败: ${err}`);
              } else {
                // 单条 (GetSnsData) 包成数组统一处理
                const list: any[] = msgType === "PullMySnsListTaskResultNotice"
                  ? ((content.SnsList ?? (content as any).snsList ?? []) as any[])
                  : (() => {
                      const one = content.SnsInfo ?? (content as any).snsInfo;
                      return one ? [one] : [];
                    })();

                let saved = 0;
                for (const sns of list) {
                  if (!sns) continue;
                  const snsId = String(sns.SnsId ?? sns.snsId ?? "");
                  if (!snsId || snsId === "0") continue;
                  // Time 字段: proto 是 uint32 秒. 兜底容忍各种大小写
                  const tRaw = sns.Time ?? sns.time;
                  const postAt = typeof tRaw === "number" ? tRaw
                    : typeof tRaw === "string" ? Number(tRaw) || null
                    : null;
                  // 图片: Images 数组 + 可能的单 Video.Url 也归到 image_urls 一并展示
                  const images = (sns.Images ?? sns.images ?? []) as any[];
                  const imageUrls = images.map((img: any) => ({
                    url: String(img?.Url ?? img?.url ?? ""),
                    thumbUrl: img?.ThumbImg ?? img?.thumbImg ?? undefined,
                  })).filter((i) => i.url);

                  const finalWxId = wxId || String(sns.Author ?? sns.author ?? "");
                  const contentStr = (sns.Content ?? sns.content ?? null) as string | null;
                  const rawJson = JSON.stringify(sns);
                  upsertMoment({
                    wxId: finalWxId,
                    snsId,
                    content: contentStr,
                    imageUrls,
                    postAt,
                    rawJson,
                  });
                  saved++;

                  // 写穿到 Java MySQL (备份, fire-and-forget, 失败不影响 SQLite)
                  fetch("http://127.0.0.1:15086/api/wework/moments/upsert", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({
                      wxId: finalWxId,
                      snsId,
                      content: contentStr ?? "",
                      imageUrls: JSON.stringify(imageUrls),
                      postAt: postAt != null ? String(postAt) : "",
                      rawJson,
                    }),
                  }).catch((e) => logger.warn(`[Moments] write-through MySQL fail: ${(e as Error).message}`));
                }
                logger.info(`[Moments] ${msgType} 落库 ${saved} 条 (wxId=${wxId})`);
              }
            }

            // 朋友圈发布回执 (PostSnsTaskResultNotice / PostSnsTaskTaskResultNotice)
            // 解决 fire-and-forget 假成功: 写内存 map, post_moments tool await 后读
            if (msgType === "PostSnsTaskResultNotice" || msgType === "PostSnsTaskTaskResultNotice") {
              const wxId = String(content.WxId ?? (content as any).wxId ?? "");
              const success = (content.Success ?? (content as any).success) === true;
              const errMsg = String(content.ErrMsg ?? (content as any).errMsg ?? "");
              if (wxId) {
                recordPostMomentsResult(wxId, success, errMsg);
                logger.info(`[Moments] ${msgType} 回执: wxId=${wxId} success=${success} errMsg=${errMsg.slice(0, 80)}`);
              }
            }

            // 管理员朋友圈任务列表 → 落 SQLite moments_tasks 表
            // 解决 fire-and-forget: tool/CLI 发完 PullSnsTaskListTask 立即拿不到数据,
            // 这里 WS push 进来后写库, tool/CLI 等几秒再读 SQLite 拿到.
            // 字段映射 (proto WPullSnsTaskListTaskResultNotice):
            //   PullSnsTaskListTaskResultNoticeMessage:
            //     WxId int64 / Success bool / ErrMsg / TaskList: SnsTaskMessage[]
            //   SnsTaskMessage:
            //     Author int64 / SnsInfo: SnsInfoMessage / Posted bool
            if (msgType === "PullSnsTaskListTaskResultNotice") {
              const wxId = String(content.WxId ?? (content as any).wxId ?? "");
              const success = (content.Success ?? (content as any).success) !== false;
              if (!success) {
                const err = content.ErrMsg ?? (content as any).errMsg;
                logger.warn(`[MomentsTask] ${msgType} 失败: ${err}`);
              } else {
                const list = (content.TaskList ?? (content as any).taskList ?? []) as any[];
                let saved = 0;
                for (const task of list) {
                  if (!task) continue;
                  const author = String(task.Author ?? task.author ?? "");
                  const sns = task.SnsInfo ?? task.snsInfo;
                  if (!sns) continue;
                  const snsId = String(sns.SnsId ?? sns.snsId ?? "");
                  if (!snsId || snsId === "0") continue;
                  const tRaw = sns.Time ?? sns.time;
                  const postAt = typeof tRaw === "number" ? tRaw
                    : typeof tRaw === "string" ? Number(tRaw) || null
                    : null;
                  const images = (sns.Images ?? sns.images ?? []) as any[];
                  const imageUrls = images.map((img: any) => ({
                    url: String(img?.Url ?? img?.url ?? ""),
                    thumbUrl: img?.ThumbImg ?? img?.thumbImg ?? undefined,
                  })).filter((i) => i.url);
                  const posted = !!(task.Posted ?? task.posted);
                  upsertMomentsTask({
                    wxId,
                    snsId,
                    author: author || null,
                    content: (sns.Content ?? sns.content ?? null) as string | null,
                    imageUrls,
                    postAt,
                    posted,
                    rawJson: JSON.stringify(task),
                  });
                  saved++;
                }
                logger.info(`[MomentsTask] ${msgType} 落库 ${saved} 条 (wxId=${wxId})`);
              }
            }

            // 我的二维码拉取结果 → 落 SQLite qrcodes 表
            // 字段映射 (proto WPullMyQrCodeTaskResultNotice):
            //   WxId int64 / Success bool / ErrMsg string / Url string
            // 注: proto 里没有 base64 / expireTime — 当前只能落 url, 其他字段留 null.
            // 解决 fire-and-forget: HTTP /api/wework/qrcode 触发 Task → 等几秒 → 读 SQLite.
            if (msgType === "PullMyQrCodeTaskResultNotice") {
              const wxId = String(content.WxId ?? (content as any).wxId ?? "");
              const success = (content.Success ?? (content as any).success) !== false;
              if (!success) {
                const err = content.ErrMsg ?? (content as any).errMsg;
                logger.warn(`[QrCode] ${msgType} 失败 (wxId=${wxId}): ${err}`);
              } else {
                const url = String(content.Url ?? (content as any).url ?? "");
                if (wxId && url) {
                  upsertQrcode(wxId, url, null, null);
                  logger.info(`[QrCode] ${msgType} 落库 wxId=${wxId} url=${url.slice(0, 80)}`);
                } else {
                  logger.warn(`[QrCode] ${msgType} 字段为空 wxId="${wxId}" url="${url}"`);
                }
              }
            }

            if (msgType === "ConversationAddNotice") {
              const conv = (content.Convers ?? (content as any).convers) as any;
              const groupName = conv?.Name ?? conv?.name;
              // 关键: ConvAdd push 的 conv.Id 是 Java DB 主键 (内部 id), 不是企微真正的群 ConvId.
              // 真正的群 ConvId 在 conv.RemoteId 字段 — talkToFriendTask 必须用 RemoteId,
              // 用 Id 会发到不存在的会话, 出现 "诡异单聊" 状态. 实测验证:
              //   群"vip0148群": Id=7635723906955859509(假) RemoteId=10771793581934761(真, MySQL 验证)
              const internalId = conv?.Id ?? conv?.id;
              const realConvId = conv?.RemoteId ?? conv?.remoteId;
              const convType = conv?.Type ?? conv?.type;  // 0=单聊 1=群聊
              if (groupName && realConvId) {
                logger.info(`[ConvAdd] 新会话: name="${groupName}" RemoteId=${realConvId} (internalId=${internalId}) type=${convType} (0=单聊 1=群聊)`);
                // 只匹配群聊 (Type=1), 跳过单聊
                if (convType !== 1 && convType !== "1") {
                  logger.info(`[ConvAdd] 跳过 (Type=${convType} 不是群聊)`);
                  return;
                }
                try {
                  const pending = findPendingTaskByMatch("create_room", String(groupName));
                  if (pending) {
                    logger.info(`[PendingTask] 命中 task_id=${pending.taskId} action=${pending.action}`);
                    const payload = JSON.parse(pending.actionPayload);
                    if (pending.action === "send_message") {
                      // 外部群刚建出来时, 客户可能还在企微确认加群中, 立即发会被拒 (SDK 显示红色感叹号).
                      // 延迟 ~30 秒等客户确认.
                      const delayMs = payload.delayMs ?? 30000;
                      logger.info(`[PendingTask] ⏳ 延迟 ${delayMs}ms 后发欢迎到 RemoteId=${realConvId} (等客户确认加群)`);
                      setTimeout(async () => {
                        const r = await sendMessageWithRetry(
                          pending.wxId,
                          String(realConvId),
                          payload.content,
                          payload.contentType ?? "text",
                        );
                        if (r.success) {
                          markPendingTaskDone(pending.id, String(realConvId), "sent");
                          logger.info(`[PendingTask] ✅ 欢迎消息已发到新群 RemoteId=${realConvId}`);
                        } else {
                          logger.error(`[PendingTask] ❌ 发欢迎消息失败: ${r.error}`);
                        }
                      }, delayMs);
                    }
                  }
                } catch (e: any) {
                  logger.error(`[PendingTask] 处理异常: ${e.message}`);
                }
              }
            }

          } catch (e: any) {
            logger.error(`[Event] ${e.message}`);
          }
        });

        // 每小时清理一次超过 24 小时还在 pending 的任务
        setInterval(() => {
          try {
            const n = cleanupStalePendingTasks(24);
            if (n > 0) logger.info(`[PendingTask] 清理 ${n} 个 stale 任务`);
          } catch {}
        }, 3600 * 1000);

        // 启动定时任务调度
        startScheduler(logger);

        // 启动手机 SDK 在线状态监控 (60s 轮询 MySQL, 状态变化时落库 + 告警 + 自动重连)
        startPhoneMonitor(logger, 60_000);

        // 启动系统健康监控 (60s 轮询 Java WS / Redis / MySQL, 跳变时通过 healthEvents 广播)
        startHealthMonitor(logger, 60_000);

        // 启动联系人定时同步 (启动 30s 后跑第一次, 之后每 30min 一次)
        // 同步指令发到 Java, 联系人列表回来走 ContactPushNotice → handleContactPush 落 SQLite contacts 表
        if (cfg.auth?.username) {
          // 用第一个配置的 wxId. 多账号场景需要扩展 (按 wxAccountInfo 表所有 isonline=0 的)
          // 这里先用约定的: 如果配置里没有显式 wxId, 用 1688852285335663 (孟伟)
          const syncWxId = (cfg as any).syncWxId || "1688852285335663";
          startContactSync(syncWxId, logger, 30 * 60 * 1000, 30_000);
        }

        // 启动 agent HTTP backend (Express on :17800) — 给新 web /web2/ 用
        // 提供 /api/agent/chat (SSE) + /api/agent/confirm + /api/llm/providers
        try {
          const llmCfg = (cfg as any).llm ?? {};
          const apiKey =
            process.env.MOONSHOT_API_KEY ||
            process.env.KIMI_API_KEY ||
            process.env.OPENAI_API_KEY ||
            llmCfg.apiKey ||
            "";
          let defaultProvider: LLMProviderConfig | null = null;
          if (apiKey) {
            defaultProvider = {
              id: "kimi-default",
              type: "openai_compatible",
              name: llmCfg.name || "Kimi",
              baseUrl: llmCfg.baseUrl || "https://api.moonshot.cn/v1",
              apiKey,
              model: llmCfg.model || "kimi-k2-turbo-preview",
            };
            logger.info(`[agent-backend] LLM 配置: ${defaultProvider.name} ${defaultProvider.model}`);
          } else {
            logger.warn("[agent-backend] 未找到 LLM api key (env MOONSHOT_API_KEY/KIMI_API_KEY/OPENAI_API_KEY 或 plugin config llm.apiKey), agent chat 接口会返 503");
          }
          agentHttpServer = startAgentBackend({ defaultProvider, logger });
        } catch (e: any) {
          logger.error(`[agent-backend] 启动失败: ${e?.message ?? e}`);
        }

        // 连接
        await client.start();
      },

      async stop() {
        stopScheduler();
        stopPhoneMonitor();
        stopHealthMonitor();
        stopContactSync();
        if (agentHttpServer) {
          await new Promise<void>((r) => agentHttpServer!.close(() => r()));
          agentHttpServer = null;
        }
        const c = getWeWorkClient();
        if (c) await c.stop();
        closeDb();
        logger.info("[Stopped]");
      },
    });

    // ============================================
    // CLI 插件: openclaw wework <command>
    // ============================================
    api.registerCli(({ program }: { program: any }) => {
      const ww = program.command("wework").description("WeWork SCRM 管理");

      let cliInitiatedConnection = false;

      /** CLI 模式下确保 WS 客户端已初始化并连接 */
      async function ensureConnected(): Promise<boolean> {
        let client = getWeWorkClient();
        if (!client) {
          // CLI 模式: 用 cliUsername/cliPassword 走独立账号,
          // 避免跟 service 的 username 互踢. 留空则 fallback 到 auth.username.
          const cliUser = cfg.auth.cliUsername || cfg.auth.username;
          const cliPwd  = cfg.auth.cliPassword || cfg.auth.password;
          if (!cliUser) {
            console.log("❌ auth.cliUsername (或 auth.username) 未配置, CLI 无法登录 Java 后端");
            return false;
          }
          client = getWeWorkClient({
            serverUrl: cfg.javaWsUrl,
            authType: cfg.auth.authType,
            username: cliUser,
            password: cliPwd,
          });
          cliInitiatedConnection = true;
          // 等到收到 DeviceAuthRsp + accessToken 后才算"真连接成功"
          // (而不是 ws onopen, 那时心跳还没启动, 几秒就被踢)
          try {
            await new Promise<void>((resolve, reject) => {
              const timeout = setTimeout(
                () => reject(new Error("连接超时 (30s)")),
                30000,
              );
              client!.on("log", (m: string) => {
                if (m.includes("认证成功")) {
                  clearTimeout(timeout);
                  resolve();
                }
              });
              client!.once("error", (e: Error) => {
                clearTimeout(timeout);
                reject(e);
              });
              client!.start();
            });
            // 给 Java 端注册 channel 的时间, 避免发送指令时还没准备好
            await new Promise((r) => setTimeout(r, 500));
          } catch (e: any) {
            console.log(`❌ 无法连接 Java 后端 (${cfg.javaWsUrl}): ${e.message}`);
            return false;
          }
        }
        return true;
      }

      /** CLI 命令执行完后断开连接，让进程正常退出 */
      async function cleanupConnection(): Promise<void> {
        if (cliInitiatedConnection) {
          const client = getWeWorkClient();
          if (client) await client.stop();
        }
      }

      /** 包装 action：自动连接 + 执行 + 断开 */
      function withConnection<T extends (...args: any[]) => void>(fn: T) {
        return async (...args: Parameters<T>) => {
          if (!await ensureConnected()) return;
          try { await fn(...args); } finally { await cleanupConnection(); }
        };
      }

      // --- 状态 ---
      // 综合健康检查: WS 连接 + 手机 SDK isonline + 系统资源
      // 加 --json 给 MCP server / 自动化 用
      ww.command("status")
        .description("查 WS 连接 + 手机在线 + 系统综合状态")
        .option("--json", "JSON 输出 (给程序读)")
        .option("--wx-id <id>", "查指定 wxId 的手机状态, 默认所有")
        .action(withConnection(async (opts: { json?: boolean; wxId?: string }) => {
          const c = getWeWorkClient();
          const wsConnected = c?.connected ?? false;
          const result: any = {
            ts: new Date().toISOString(),
            ws: { connected: wsConnected, url: cfg.javaWsUrl },
            phones: [] as Array<{ wxId: string; name: string; online: boolean }>,
            warnings: [] as string[],
          };

          // 查 MySQL 看手机 SDK 在线状态 (isonline=0 表示真在线, 1=离线)
          try {
            const propsPath = "/opt/wework/wework-server/src/main/resources/application.properties";
            if (fs.existsSync(propsPath)) {
              const props = fs.readFileSync(propsPath, "utf8");
              const dbUser = props.match(/^spring\.datasource\.username=(.+)$/m)?.[1]?.trim() ?? "wework";
              const dbPass = props.match(/^spring\.datasource\.password=(.+)$/m)?.[1]?.trim() ?? "";
              const dbName = props.match(/jdbc:mysql:\/\/[^/]+\/([^?]+)/)?.[1] ?? "workchat";
              if (dbPass) {
                const filter = opts.wxId ? `WHERE wxid=${opts.wxId}` : `WHERE wxid IS NOT NULL`;
                const sql = `SELECT wxid, name, isonline FROM tbl_wx_accountinfo ${filter};`;
                const { execFileSync } = await import("node:child_process");
                const out = execFileSync("mysql", ["-u", dbUser, "-N", "-B", dbName, "-e", sql],
                  { env: { ...process.env, MYSQL_PWD: dbPass }, encoding: "utf8", timeout: 5000 });
                for (const line of out.trim().split("\n")) {
                  const [wxId, name, isonlineStr] = line.split("\t");
                  if (!wxId) continue;
                  const online = isonlineStr === "0";
                  result.phones.push({ wxId, name, online });
                  if (!online) result.warnings.push(`手机 ${name}(${wxId}) SDK 离线 (isonline=${isonlineStr}) — 客户消息发不到!`);
                }
              }
            }
          } catch (e: any) {
            result.warnings.push(`无法查 MySQL phone status: ${e.message}`);
          }

          if (!wsConnected) result.warnings.push("Java WS 未连接, 收发都会失败");

          if (opts.json) {
            console.log(JSON.stringify(result, null, 2));
            return;
          }

          // 人类可读输出
          console.log(`Java WS:    ${wsConnected ? "✅ 已连接" : "❌ 未连接"} (${cfg.javaWsUrl})`);
          if (result.phones.length === 0) {
            console.log("手机 SDK:   ⚠️  无数据 (查不到 tbl_wx_accountinfo)");
          } else {
            for (const p of result.phones) {
              console.log(`手机 SDK:   ${p.online ? "✅ 在线" : "❌ 离线"} ${p.name}(${p.wxId})`);
            }
          }
          if (result.warnings.length > 0) {
            console.log("");
            console.log("⚠️  警告:");
            for (const w of result.warnings) console.log(`  - ${w}`);
          }
        }));

      // --- 列出本地缓存的联系人 ---
      ww.command("contacts")
        .description("列本地缓存的联系人 (来自定时同步 + push 推送)")
        .argument("<wxId>", "企业微信ID")
        .option("-n, --limit <n>", "条数, 默认 50", "50")
        .option("--json", "JSON 输出")
        .action((wxId: string, opts: { limit: string; json?: boolean }) => {
          const limit = parseInt(opts.limit, 10) || 50;
          const list = listContacts(wxId, limit);
          const total = countContacts(wxId);
          const sync = getLastSyncTime();
          if (opts.json) { console.log(JSON.stringify({ total, lastSync: sync, items: list }, null, 2)); return; }
          console.log(`共 ${total} 个联系人. 最近同步: ${sync.ageSec >= 0 ? `${sync.ageSec}s 前` : "未同步过"}`);
          if (list.length === 0) {
            console.log("(尚无数据. 启动后 30s 才会触发首次同步, 或者你 wework sync ${wxId} contacts 主动触发)");
            return;
          }
          for (const c of list as any[]) {
            const tag = c.contact_type === 1 ? "[内部]" : c.contact_type === 2 ? "[外部]" : "[?]";
            console.log(`  ${tag} ${(c.name || "无名").padEnd(28)} ${c.alias ? "("+c.alias+") " : ""}${(c.corp_name || "")}  convId=${c.remote_id}`);
          }
        });

      // --- 触发 Java 让手机 SDK 上传媒体到图床 + 等 DownloadFileResultNotice 回写真 URL ---
      ww.command("resolve-media")
        .description("视频/文件 Java 没存图床时, 触发手机上传 + 等 Result 通知 + 返回真 URL")
        .argument("<wxId>", "企业微信ID")
        .argument("<msgId>", "消息 MsgId (从 history 拿)")
        .option("-w, --wait <s>", "单次最大等待秒数 (大文件可加大)", "60")
        .option("-t, --file-type <n>", "FileType: 0=原始(默认通用) 1=大图 4=语音 5=视频 6=文件", "0")
        .option("--max-retries <n>", "Java 报 transient 错误时重试几次", "3")
        .option("--retry-wait <s>", "transient 重试间隔秒数", "5")
        .option("--json", "JSON 输出")
        .action(withConnection(async (wxId: string, msgId: string, opts: { wait: string; fileType: string; maxRetries: string; retryWait: string; json?: boolean }) => {
          const waitSec = parseInt(opts.wait, 10) || 60;
          const fileType = parseInt(opts.fileType, 10) || 0;
          const maxRetries = parseInt(opts.maxRetries, 10) || 3;
          const retryWaitSec = parseInt(opts.retryWait, 10) || 5;
          // 1. 拿 msg_remote_id (Java 协议要求, web 端实测必传)
          const meta = getMessageMeta(wxId, msgId);
          if (!meta) {
            console.log(opts.json ? JSON.stringify({ ok: false, error: "msg not found" }) : `❌ msgId=${msgId} 不在本地 messages 表`);
            return;
          }
          const msgRemoteId = meta.msg_remote_id ?? "";
          // 1b. 预检查: msg_remote_id 缺失 → SDK 不会响应, fail-fast
          // (web 端实测, 手机 SDK 必须看到 MsgRemoteId 才会启动下载. 不传 = 静默丢弃)
          if (!msgRemoteId) {
            const err = "msg_remote_id 缺失 (该消息可能不是从手机 SDK 推过来, 或落库时漏了字段). 手机 SDK 不会响应 download 请求.";
            console.log(opts.json ? JSON.stringify({ ok: false, error: err }) : `❌ ${err}`);
            return;
          }

          // 文件系统 fallback 用的 hash (从原 url 提)
          const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
          const yesterday = new Date(Date.now() - 86400_000).toISOString().slice(0, 10).replace(/-/g, "");
          let originalUrl = "";
          try {
            const decoded = Buffer.from(meta.content, "base64").toString("utf8");
            originalUrl = JSON.parse(decoded).url || "";
          } catch { try { originalUrl = JSON.parse(meta.content).url || ""; } catch {} }
          const hashMatch = originalUrl.match(/([a-fA-F0-9]{32})/);
          const hash = hashMatch?.[1]?.toUpperCase() ?? "";

          // 1c. 清掉旧的 resolved_media 记录 (上次失败的 stale 不能影响这次判断)
          // 不清的话: 旧 success=false 记录会让首次 poll 立即拿到, 跳过等新 notice 的过程, 误判 permanent
          clearResolvedMediaRecord(msgId);

          // 2. 触发 + 等结果 — 带 transient 重试 (实测 Java "其他任务下载中" 等几秒就好)
          const startTotalMs = Date.now();
          let foundUrl = "";
          let lastErrMsg: string | undefined;
          let attempts = 0;

          for (let retry = 0; retry <= maxRetries; retry++) {
            attempts++;
            // 触发下载 (含 MsgRemoteId + FileType, 否则手机 SDK 不响应)
            const trig = await downloadByMsgIdWithRetry(wxId, msgId, String(msgRemoteId), fileType);
            if (!trig.success) {
              lastErrMsg = `触发下载失败 (WS 层): ${trig.error}`;
              break;
            }

            // 轮询: pending / success / failed
            const attemptStartMs = Date.now();
            let attemptResult: "success" | "transient_failed" | "permanent_failed" | "timeout" = "timeout";
            let attemptErr: string | undefined;

            while (Date.now() - attemptStartMs < waitSec * 1000) {
              const status = getResolvedMediaStatus(msgId);
              if (status.state === "success") {
                foundUrl = status.url;
                attemptResult = "success";
                break;
              }
              if (status.state === "failed") {
                attemptErr = status.errMsg;
                if (isTransientResolveError(status.errMsg)) {
                  // 已知 transient 关键词 → 后续 retry
                  attemptResult = "transient_failed";
                } else if (!status.errMsg) {
                  // Java 回 success=false 但没给 ErrMsg — 不知道是 SDK 静默拒绝 (permanent)
                  // 还是 protocol 把字段丢了 (transient). 给一次 retry 机会, 不要直接判 perm.
                  attemptResult = "transient_failed";
                  attemptErr = "Java 回 success=false 但未提供 ErrMsg (可能 SDK 静默拒绝)";
                } else {
                  // Java 给了具体的非 transient 错误 → 重试无用
                  attemptResult = "permanent_failed";
                }
                break;
              }
              // pending: 轮询期间也试文件系统 hash 匹配 (Java 没发 notice 但实际下完了的兜底)
              if (hash) {
                for (const date of [today, yesterday]) {
                  const dir = `/app/storage/attachment/${date}`;
                  if (fs.existsSync(dir)) {
                    const match = fs.readdirSync(dir).find((f) => f.toUpperCase().startsWith(hash + "."));
                    if (match) {
                      foundUrl = `http://60.205.94.161/attachment/${date}/${match}`;
                      attemptResult = "success";
                      break;
                    }
                  }
                }
                if (foundUrl) break;
              }
              await new Promise((r) => setTimeout(r, 1500));
            }

            if (attemptResult === "success") break;
            lastErrMsg = attemptErr ?? "(SDK 静默超时)";

            if (attemptResult === "permanent_failed") {
              // Java 明确报错且非 transient — 重试也没用
              console.log(opts.json
                ? JSON.stringify({ ok: false, error: "permanent", javaErr: lastErrMsg, attempts, hash })
                : `❌ Java 永久错误: ${lastErrMsg} (重试无用)`);
              return;
            }

            if (attemptResult === "timeout") {
              // SDK 60s 静默 — 一般是 SDK 不支持 / 文件已删 / outgoing 自己发的
              break; // 不进入重试 (重试也是静默)
            }

            // attemptResult === "transient_failed" → Java 暂时繁忙, 等几秒重试
            if (retry < maxRetries) {
              if (!opts.json) console.log(`⏳ Java 繁忙 ("${lastErrMsg}"), ${retryWaitSec}s 后重试 (${retry + 1}/${maxRetries})...`);
              clearResolvedMediaRecord(msgId);  // 清掉旧失败记录, 等新 notice
              await new Promise((r) => setTimeout(r, retryWaitSec * 1000));
            }
          }

          // 收尾输出
          const totalSec = Math.round((Date.now() - startTotalMs) / 1000);
          if (foundUrl) {
            console.log(opts.json ? JSON.stringify({ ok: true, url: foundUrl, waitedSec: totalSec, attempts })
              : `✅ 已到位 (${totalSec}s, 试了 ${attempts} 次): ${foundUrl}`);
          } else if (lastErrMsg && lastErrMsg !== "(SDK 静默超时)") {
            // Java 有反馈, 重试 maxRetries 次仍 transient
            console.log(opts.json ? JSON.stringify({ ok: false, error: "transient_exhausted", javaErr: lastErrMsg, attempts, hash, waitedSec: totalSec })
              : `❌ Java 报错 "${lastErrMsg}" 重试 ${attempts} 次仍失败 (用了 ${totalSec}s)`);
          } else {
            // 60s 内 Java 啥也没回 — SDK 静默
            console.log(opts.json ? JSON.stringify({ ok: false, error: "sdk_silent_timeout", hash, waitedSec: totalSec, attempts })
              : `❌ ${totalSec}s 内手机 SDK 静默无响应 (常见: outgoing 自己发的不能重传 / 大图缓存清了 / SDK 协议不支持). 退回手动转发更稳.`);
          }
        }));

      // --- 拉某联系人最近发的图片/语音/视频/文件 URL (支持多张) ---
      ww.command("recent-media")
        .description("拿某 senderId 最近 X 分钟发的媒体 (图/音/视频/文件), 支持多张")
        .argument("<wxId>", "企业微信ID")
        .argument("<senderId>", "发送方")
        .option("-w, --within <min>", "时间窗口 (分钟)", "30")
        .option("-n, --limit <n>", "最多几张", "10")
        .option("--json", "JSON 输出")
        .action((wxId: string, senderId: string, opts: { within: string; limit: string; json?: boolean }) => {
          const within = parseInt(opts.within, 10) || 30;
          const limit = parseInt(opts.limit, 10) || 10;
          const list = getRecentMediaFromSender(wxId, senderId, within, limit);
          if (opts.json) { console.log(JSON.stringify(list, null, 2)); return; }
          if (list.length === 0) {
            console.log(`❌ ${senderId} 最近 ${within}min 内没发图/音/视频`);
            return;
          }
          console.log(`找到 ${list.length} 个媒体 (新→旧):`);
          for (const m of list) {
            console.log(`  [${m.ts}] ${m.contentType.padEnd(8)} ${m.url}`);
          }
        });

      // 向后兼容
      ww.command("last-media")
        .description("(deprecated, 用 recent-media) 拿单条最近媒体")
        .argument("<wxId>", "企业微信ID")
        .argument("<senderId>", "发送方")
        .option("-w, --within <min>", "时间窗口 (分钟)", "30")
        .option("--json", "JSON 输出")
        .action((wxId: string, senderId: string, opts: { within: string; json?: boolean }) => {
          const within = parseInt(opts.within, 10) || 30;
          const m = getLastMediaFromSender(wxId, senderId, within);
          if (opts.json) { console.log(JSON.stringify(m)); return; }
          if (!m) { console.log(`❌ 没发`); return; }
          console.log(`${m.contentType} ${m.url}`);
        });

      // --- 按名字找联系人 (优先 contacts 表, 然后 messages 历史) ---
      // 让 LLM 能处理"给赵丽发消息"这种自然语言, 先 find-contact 拿 convId, 再 send
      ww.command("find-contact")
        .description("按名字 (模糊匹配) 找联系人 convId (优先 contacts 同步表, 备用聊天历史)")
        .argument("<wxId>", "企业微信ID")
        .argument("<namePattern>", "联系人名字关键字 (会模糊匹配)")
        .option("--json", "JSON 输出")
        .action((wxId: string, namePattern: string, opts: { json?: boolean }) => {
          const matches = findContactsByName(wxId, namePattern, 10);
          if (opts.json) { console.log(JSON.stringify(matches, null, 2)); return; }
          if (matches.length === 0) {
            console.log(`❌ 没找到名字含 "${namePattern}" 的联系人`);
            console.log(`提示: 仅查 contacts 联系人表 (不再用聊天记录, 避免把群成员当联系人).`);
            console.log(`如确认这人加过, 先同步通讯录: wework sync ${wxId} contacts`);
            return;
          }
          console.log(`找到 ${matches.length} 个匹配 "${namePattern}" 的会话:`);
          for (const m of matches as any[]) {
            console.log(`  ${m.sender_name.padEnd(30)}  convId=${m.conv_id}  最后活跃=${m.last_seen}  消息数=${m.msg_count}`);
          }
        });

      // --- 手机状态事件历史 ---
      ww.command("events")
        .description("查手机 SDK 在线/离线 状态变化历史")
        .option("--wx-id <id>", "限定 wxId")
        .option("-n, --limit <n>", "条数, 默认 20", "20")
        .option("--json", "JSON 输出")
        .action((opts: { wxId?: string; limit: string; json?: boolean }) => {
          const limit = parseInt(opts.limit, 10) || 20;
          const events = listPhoneStatusEvents(opts.wxId, limit);
          if (opts.json) { console.log(JSON.stringify(events, null, 2)); return; }
          if (events.length === 0) {
            console.log("暂无手机状态事件 (PhoneMonitor 还在初始化, 或者状态没变化过)");
            return;
          }
          console.log("手机 SDK 在线/离线 历史 (最新在前):");
          for (const e of events as any[]) {
            const icon = e.to_state === "offline" ? "❌" : "✅";
            const dur = e.duration_sec ? ` (上一状态持续 ${e.duration_sec}s)` : "";
            console.log(`  ${e.ts}  ${icon} ${e.name}(${e.wx_id}) ${e.from_state} → ${e.to_state}${dur}`);
          }
        });

      // --- 综合健康检查 ---
      // status 只看 WS+phone, health 把整套基础设施都查一遍 (运维一条命令搞定)
      ww.command("health")
        .description("综合健康检查 (Java/Redis/MySQL/手机/swap/服务全套)")
        .option("--json", "JSON 输出")
        .action(async (opts: { json?: boolean }) => {
          const { execFile } = await import("node:child_process");
          const { promisify } = await import("node:util");
          const exec = promisify(execFile);
          const sh = async (cmd: string, args: string[], timeout = 5000) => {
            try { const r = await exec(cmd, args, { encoding: "utf8", timeout }); return r.stdout.trim(); }
            catch (e: any) { return null; }
          };
          const probe: any = { ts: new Date().toISOString(), checks: {} };

          // 1. systemd 服务
          for (const svc of ["openclaw-scrm", "wework-server", "nginx", "mysql", "redis-server"]) {
            const r = await sh("systemctl", ["is-active", `${svc}.service`]);
            probe.checks[`svc:${svc}`] = { ok: r === "active", value: r };
          }

          // 2. Java 端口
          for (const port of ["15086", "15087", "15088"]) {
            const r = await sh("ss", ["-tln"]);
            const listening = r?.includes(`:${port} `) ?? false;
            probe.checks[`port:${port}`] = { ok: listening };
          }

          // 3. 内存 / swap / load
          const free = await sh("free", ["-m"]);
          if (free) {
            const memLine = free.split("\n").find((l) => l.startsWith("Mem:"));
            const swapLine = free.split("\n").find((l) => l.startsWith("Swap:"));
            const memCols = memLine?.split(/\s+/) ?? [];
            const swapCols = swapLine?.split(/\s+/) ?? [];
            const memAvail = parseInt(memCols[6] ?? "0", 10);
            const swapTotal = parseInt(swapCols[1] ?? "0", 10);
            probe.checks["memory:available_mb"] = { ok: memAvail > 200, value: memAvail };
            probe.checks["swap:total_mb"] = { ok: swapTotal > 0, value: swapTotal, hint: swapTotal === 0 ? "没 swap, RAM 紧时 SSH 会卡 banner timeout" : "" };
          }
          const upt = await sh("uptime", []);
          probe.checks["uptime"] = { ok: true, value: upt };

          // 4. WS 状态: 看 systemd service 进程的 PID 是否真连着 Java 15088
          // (CLI 自己的 WS 是临时的, 不代表真实运行状态)
          try {
            const sysctlPid = await sh("systemctl", ["show", "-p", "MainPID", "openclaw-scrm.service", "--value"]);
            const pid = sysctlPid?.trim();
            if (pid && pid !== "0") {
              const ssOut = await sh("ss", ["-tn"]);
              const wsConnected = ssOut?.split("\n").some((l) =>
                l.includes(":15088") && l.includes("ESTAB")) ?? false;
              probe.checks["service:ws_connected"] = { ok: wsConnected,
                value: wsConnected ? `service PID ${pid} 连着 Java 15088` : "service WS 没连上 Java" };
            } else {
              probe.checks["service:ws_connected"] = { ok: false, value: "service 进程没在跑" };
            }
          } catch (e: any) { /* 忽略 */ }

          // 5. 手机 SDK isonline (从 MySQL)
          try {
            const propsPath = "/opt/wework/wework-server/src/main/resources/application.properties";
            if (fs.existsSync(propsPath)) {
              const props = fs.readFileSync(propsPath, "utf8");
              const dbUser = props.match(/^spring\.datasource\.username=(.+)$/m)?.[1]?.trim() ?? "wework";
              const dbPass = props.match(/^spring\.datasource\.password=(.+)$/m)?.[1]?.trim() ?? "";
              const dbName = props.match(/jdbc:mysql:\/\/[^/]+\/([^?]+)/)?.[1] ?? "workchat";
              if (dbPass) {
                const out = await sh("mysql", ["-u", dbUser, "-N", "-B", dbName, "-e",
                  "SELECT wxid, name, isonline FROM tbl_wx_accountinfo WHERE wxid IS NOT NULL;"]);
                if (out) {
                  const phones = out.split("\n").filter(Boolean).map((l) => {
                    const [wxid, name, isonline] = l.split("\t");
                    return { wxid, name, online: isonline === "0" };
                  });
                  probe.checks["phone:online_count"] = { ok: phones.some((p) => p.online), value: phones };
                }
              }
            }
          } catch (e: any) { /* 忽略 */ }

          // 6. nginx /attachment 反代
          const nginxOk = await sh("curl", ["-sS", "-m", "3", "-o", "/dev/null", "-w", "%{http_code}",
            "http://127.0.0.1/attachment/"]);
          probe.checks["nginx:attachment"] = { ok: nginxOk === "200" || nginxOk === "403", value: nginxOk };

          // 7. SQLite 大小
          if (fs.existsSync(cfg.storage.sqlitePath)) {
            const stat = fs.statSync(cfg.storage.sqlitePath);
            probe.checks["sqlite:size_kb"] = { ok: true, value: Math.round(stat.size / 1024) };
          }

          // ====== 输出 ======
          const failed = Object.entries(probe.checks).filter(([_, v]: any) => !v.ok);
          probe.summary = { total: Object.keys(probe.checks).length, failed: failed.length };

          if (opts.json) { console.log(JSON.stringify(probe, null, 2)); return; }
          console.log("=== WeWork SCRM 综合健康检查 ===");
          for (const [k, v] of Object.entries(probe.checks)) {
            const vv = v as any;
            const icon = vv.ok ? "✅" : "❌";
            const valStr = typeof vv.value === "string" ? vv.value :
              Array.isArray(vv.value) ? vv.value.map((p: any) => `${p.name}(${p.online ? "在线" : "❌离线"})`).join(", ") :
              String(vv.value ?? "");
            console.log(`  ${icon} ${k.padEnd(28)} ${valStr}${vv.hint ? "  ← " + vv.hint : ""}`);
          }
          console.log("");
          console.log(`Summary: ${failed.length === 0 ? "✅ 全绿" : `❌ ${failed.length}/${probe.summary.total} 项异常`}`);
        });

      // --- 发消息 ---
      // 重要: 这条 CLI 是 MCP 工具 wework_send_message / wework_send_media_url / wework_send_image_url 的实际后端,
      // LLM 一次 /ai 会快速 spawn 多个子进程, Java pluginbot-cli 单会话语义会互踢 → 必须走 retry 版.
      ww.command("send")
        .description("发送消息")
        .argument("<wxId>", "企业微信ID")
        .argument("<convId>", "目标会话ID")
        .argument("<message>", "消息内容 (text 类型 = 文字; 其他类型 = http(s) URL)")
        .option("-t, --type <type>", "消息类型: text/image/voice/video/file/link", "text")
        .action(withConnection(async (wxId: string, convId: string, message: string, opts: { type: string }) => {
          // 预检查: 非 text 类型必须是 http(s) URL
          // (LLM 偶尔会把 /storage/emulated/... 这种手机本地路径直接当 URL 发, Java 收到后媒体打不开,
          //  接收方看到红色感叹号. 这里 fail-fast 让 LLM 立刻拿到错误反馈)
          const t = opts.type.toLowerCase();
          if (t !== "text" && t !== "link") {
            if (!/^https?:\/\//i.test(message)) {
              const err = `❌ ${t} 类型必须是 http(s) URL, 不能是手机本地路径 / 文件路径. 收到: ${message.slice(0, 80)}${message.length > 80 ? "..." : ""}`;
              console.log(err);
              console.log(`   ↳ 如果想发本地图片, 先 wework upload <path> 拿 URL, 或者用 wework send-image <wxId> <convId> <localPath> 一条龙.`);
              console.log(`   ↳ 如果想转发用户发的媒体, 先 wework recent-media + wework resolve-media 拿真 URL.`);
              return;
            }
          }
          const r = await sendMessageWithRetry(wxId, convId, message, opts.type, undefined, {
            attempts: 4, waitForConnectMs: 15000,
            onAttempt: (n, info) => {
              if (n > 1 || !info.connected) console.log(`[retry] 第 ${n} 次尝试 (connected=${info.connected}${info.lastError ? ", err=" + info.lastError : ""})`);
            },
          });
          console.log(r.success ? `✅ 消息已发送 → ${convId}` : `❌ ${r.error}`);
        }));

      // --- 搜索消息 ---
      ww.command("search")
        .description("搜索历史消息")
        .argument("<wxId>", "企业微信ID")
        .argument("<keyword>", "搜索关键词")
        .option("-c, --conv <convId>", "限定会话")
        .action(withConnection(async (wxId: string, keyword: string, opts: { conv?: string }) => {
          const r = searchMessages(wxId, keyword, opts.conv);
          console.log(r.success ? `✅ 搜索指令已发送: "${keyword}"` : `❌ ${r.error}`);
        }));

      // --- 历史消息 ---
      // 历史消息: 直接读 SQLite (Java push 已经同步过来), 同步返回真实内容
      // LLM/agent 调这个能立刻拿到内容, 不走异步 Java 触发
      ww.command("history")
        .description("查会话历史消息 (直接读 SQLite 本地, 同步返回真实内容)")
        .argument("<wxId>", "企业微信ID")
        .argument("<convId>", "会话ID")
        .option("-n, --count <n>", "条数", "20")
        .option("--json", "JSON 输出")
        .option("--sync-from-java", "同时触发 Java 重新拉一遍 (异步, 这次未必有新内容, 下次再调有更全)")
        .action(async (wxId: string, convId: string, opts: { count: string; json?: boolean; syncFromJava?: boolean }) => {
          const limit = parseInt(opts.count, 10) || 20;
          const db = getDb(cfg.storage.sqlitePath);
          const rows = db.prepare(
            "SELECT datetime(created_at, 'localtime') AS ts, sender_name, content_type, content, is_send, msg_id " +
            "FROM messages WHERE wx_id=? AND conv_id=? ORDER BY id DESC LIMIT ?"
          ).all(wxId, convId, limit) as any[];

          // 解码 base64 文本内容 (我们落库时 Text 类型 content 是 base64)
          const decoded = rows.map((r) => {
            let content = r.content;
            if (r.content_type === "Text" || r.content_type === "text" || r.content_type === "1") {
              try { content = Buffer.from(r.content, "base64").toString("utf8"); } catch {}
            }
            return { ...r, content };
          });

          if (opts.json) {
            console.log(JSON.stringify(decoded.reverse(), null, 2));
          } else {
            if (decoded.length === 0) {
              console.log(`暂无历史消息 (wxId=${wxId}, convId=${convId}). 你可以加 --sync-from-java 触发后端拉一遍.`);
            } else {
              console.log(`最近 ${decoded.length} 条 (新→旧):`);
              for (const r of decoded as any[]) {
                const dir = r.is_send === "true" ? "→" : "←";
                const text = String(r.content).replace(/\s+/g, " ").slice(0, 80);
                console.log(`  [${r.ts}] ${dir} ${(r.sender_name || "?").padEnd(20)} (${r.content_type}) ${text}`);
              }
            }
          }

          if (opts.syncFromJava) {
            // 触发 Java 异步拉, 下次调本命令会拿到更全
            triggerHistoryMessages(wxId, convId, limit);
          }
        });

      // --- 联系人信息 ---
      ww.command("contact")
        .description("查询联系人")
        .argument("<wxId>", "企业微信ID")
        .argument("<remoteId>", "联系人ID")
        .action(withConnection(async (wxId: string, remoteId: string) => {
          const r = getContactInfo(wxId, remoteId);
          console.log(r.success ? `✅ 查询已发送: ${remoteId}` : `❌ ${r.error}`);
        }));

      // --- 群发 --- (走重试: 同 send 命令理由)
      ww.command("mass-send")
        .description("群发消息")
        .argument("<wxId>", "企业微信ID")
        .argument("<message>", "消息内容")
        .option("-t, --type <type>", "消息类型", "text")
        .option("--to <ids...>", "目标会话ID列表")
        .action(withConnection(async (wxId: string, message: string, opts: { type: string; to: string[] }) => {
          if (!opts.to?.length) { console.log("❌ 请指定 --to <会话ID列表>"); return; }
          const r = await massSendWithRetry(wxId, opts.to, message, opts.type);
          console.log(r.success ? `✅ 群发 → ${opts.to.length} 个会话` : `❌ ${r.error}`);
        }));

      // --- 群聊操作 ---
      ww.command("group")
        .description("群聊管理")
        .argument("<wxId>", "企业微信ID")
        .argument("<action>", "操作: create/add_member/remove_member/set_name/set_notice/quit/list_members/set_remark")
        .option("-g, --group <convId>", "群会话ID")
        .option("-m, --members <ids...>", "成员ID列表")
        .option("-c, --content <text>", "群名/公告内容")
        .option("--send-after <msg>", "建群成功后发一条欢迎消息 (仅 create)")
        .option("--welcome-delay <ms>", "建群后延迟多久发欢迎 (等客户确认加群, 默认 30000ms)", "30000")
        .option("--wait-timeout <ms>", "等待 TaskResult 超时", "30000")
        .action(withConnection(async (wxId: string, action: string, opts: { group?: string; members?: string[]; content?: string; sendAfter?: string; welcomeDelay: string; waitTimeout: string }) => {
          const r = await chatRoomActionWithRetry(wxId, action, opts.group, opts.members, opts.content);
          if (!r.success) {
            console.log(`❌ ${r.error}`);
            return;
          }
          console.log(`✅ 群操作 ${action} 已发送 (TaskId=${r.taskId})`);
          // 建群+欢迎消息流程: 通过 SQLite IPC 委托给 service 进程执行
          // (CLI 是短期进程, ConversationAddNotice 推给 service 不是 CLI, 所以 CLI 等不到)
          if (action === "create" && opts.sendAfter && r.taskId && opts.content) {
            try {
              const delayMs = parseInt(opts.welcomeDelay) || 30000;
              addPendingTask({
                taskId: String(r.taskId),
                taskType: "create_room",
                wxId: wxId,
                matchKey: opts.content,
                action: "send_message",
                actionPayload: { content: opts.sendAfter, contentType: "text", delayMs },
              });
              console.log(`📋 已登记 pending 任务: 收到群"${opts.content}"创建通知后, 等 ${delayMs}ms 让客户确认加群, 再自动发欢迎`);
              console.log(`   (查状态: sqlite3 /root/wework-scrm.db "SELECT * FROM pending_tasks WHERE task_id='${r.taskId}'")`);
            } catch (e: any) {
              console.log(`⚠ 登记 pending 任务失败: ${e.message}`);
            }
          }
        }));

      // --- 发朋友圈 ---
      ww.command("moments")
        .description("发布朋友圈")
        .argument("<wxId>", "企业微信ID")
        .argument("<content>", "文字内容")
        .option("-t, --type <type>", "类型: text/image/video/link", "text")
        .option("--media <urls...>", "图片/视频URL")
        .action(withConnection(async (wxId: string, content: string, opts: { type: string; media?: string[] }) => {
          const r = await postMomentsWithRetry(wxId, content, opts.type, opts.media);
          console.log(r.success ? "✅ 朋友圈发布指令已发送" : `❌ ${r.error}`);
        }));

      // --- 查看朋友圈 ---
      // 注意: CLI 子进程自己没有 WS receive 端 (sendToJava 只发不收),
      // 实际把 PullMySnsListTaskResultNotice 落到 SQLite moments 表的是
      // plugin server 进程 (常驻 WS, 在 client.on("json-message",...) 里).
      // CLI 等 3s 后从 SQLite 读. plugin server 离线则拿不到新数据 (TODO).
      ww.command("my-moments")
        .description("拉取我的朋友圈 (先发刷新指令, 等 3s 让 plugin server 入库, 再读 SQLite)")
        .argument("<wxId>", "企业微信ID")
        .option("-n, --limit <n>", "条数, 默认 20", "20")
        .option("--json", "JSON 输出")
        .action(withConnection(async (wxId: string, opts: { limit: string; json?: boolean }) => {
          const limit = parseInt(opts.limit, 10) || 20;
          const r = pullMySns(wxId);
          if (!r.success) {
            // 刷新指令都没发出去, 也试一下读旧缓存兜底
            if (!opts.json) console.log(`❌ 刷新指令发送失败: ${r.error}`);
          }
          // 等 3s 让 plugin server WS push 入库
          await new Promise((rr) => setTimeout(rr, 3000));
          const list = listMoments(wxId, limit);
          if (opts.json) {
            console.log(JSON.stringify({
              refreshOk: r.success,
              refreshError: r.success ? undefined : r.error,
              count: list.length,
              items: list.map((row) => {
                let images: Array<{ url: string; thumbUrl?: string }> = [];
                try { images = row.image_urls ? JSON.parse(row.image_urls) : []; } catch { /* ignore */ }
                return {
                  snsId: row.sns_id,
                  content: row.content,
                  imageUrls: images,
                  postAt: row.post_at,
                };
              }),
            }, null, 2));
            return;
          }
          if (list.length === 0) {
            console.log("(暂无朋友圈数据 — 可能首次拉取 plugin server 还没回写, 重试一次; 或 plugin server 没在跑)");
            return;
          }
          for (const row of list) {
            const ts = row.post_at ? new Date(row.post_at * 1000).toISOString() : "未知时间";
            const snippet = (row.content ?? "").replace(/\n/g, " ").slice(0, 80);
            console.log(`  [${ts}] snsId=${row.sns_id}  ${snippet}`);
          }
        }));

      // --- 拉取单条朋友圈详情 ---
      // 同 my-moments: CLI 子进程发查询指令 → 等 3s → 读 SQLite (plugin server 写入)
      ww.command("sns-data")
        .description("拉取单条朋友圈详情 (先发查询, 等 3s 让 plugin server 入库, 再读 SQLite)")
        .argument("<wxId>", "企业微信ID")
        .argument("<snsId>", "朋友圈动态ID")
        .option("--json", "JSON 输出")
        .action(withConnection(async (wxId: string, snsId: string, opts: { json?: boolean }) => {
          const r = getSnsData(wxId, snsId);
          if (!r.success && !opts.json) {
            console.log(`❌ 查询指令发送失败: ${r.error}`);
          }
          await new Promise((rr) => setTimeout(rr, 3000));
          const row = getMomentBySnsId(snsId);
          if (opts.json) {
            if (!row) {
              console.log(JSON.stringify({ refreshOk: r.success, found: false }));
              return;
            }
            let images: Array<{ url: string; thumbUrl?: string }> = [];
            try { images = row.image_urls ? JSON.parse(row.image_urls) : []; } catch { /* ignore */ }
            let raw: any = null;
            try { raw = row.raw_json ? JSON.parse(row.raw_json) : null; } catch { /* ignore */ }
            console.log(JSON.stringify({
              refreshOk: r.success,
              found: true,
              snsId: row.sns_id,
              wxId: row.wx_id,
              content: row.content,
              imageUrls: images,
              postAt: row.post_at,
              comments: raw?.Comments ?? raw?.comments ?? [],
              likes: raw?.Likes ?? raw?.likes ?? [],
              link: raw?.Link ?? raw?.link ?? null,
              video: raw?.Video ?? raw?.video ?? null,
            }, null, 2));
            return;
          }
          if (!row) {
            console.log("(暂无该朋友圈数据 — 可能首次拉取 plugin server 还没回写, 重试一次; 或 sns_id 不存在)");
            return;
          }
          const ts = row.post_at ? new Date(row.post_at * 1000).toISOString() : "未知时间";
          const snippet = (row.content ?? "").replace(/\n/g, " ").slice(0, 200);
          console.log(`[${ts}] snsId=${row.sns_id}  ${snippet}`);
        }));

      // --- 拉取管理员朋友圈任务列表 ---
      ww.command("sns-task-list")
        .description("拉取管理员朋友圈任务列表 (先发拉取, 等 3s 让 plugin server 入库, 再读 SQLite)")
        .argument("<wxId>", "企业微信ID")
        .option("-n, --limit <n>", "条数, 默认 50", "50")
        .option("--json", "JSON 输出")
        .action(withConnection(async (wxId: string, opts: { limit: string; json?: boolean }) => {
          const limit = parseInt(opts.limit, 10) || 50;
          const r = pullSnsTaskList(wxId);
          if (!r.success && !opts.json) {
            console.log(`❌ 拉取指令发送失败: ${r.error}`);
          }
          await new Promise((rr) => setTimeout(rr, 3000));
          const list = listMomentsTasks(wxId, limit);
          if (opts.json) {
            console.log(JSON.stringify({
              refreshOk: r.success,
              refreshError: r.success ? undefined : r.error,
              count: list.length,
              items: list.map((row) => {
                let images: Array<{ url: string; thumbUrl?: string }> = [];
                try { images = row.image_urls ? JSON.parse(row.image_urls) : []; } catch { /* ignore */ }
                return {
                  snsId: row.sns_id,
                  author: row.author,
                  content: row.content,
                  imageUrls: images,
                  postAt: row.post_at,
                  posted: !!row.posted,
                };
              }),
            }, null, 2));
            return;
          }
          if (list.length === 0) {
            console.log("(暂无管理员朋友圈任务 — 可能首次拉取 plugin server 还没回写; 或 plugin server 没在跑)");
            return;
          }
          for (const row of list) {
            const ts = row.post_at ? new Date(row.post_at * 1000).toISOString() : "未知时间";
            const flag = row.posted ? "[已发表]" : "[未发表]";
            const snippet = (row.content ?? "").replace(/\n/g, " ").slice(0, 80);
            console.log(`  ${flag} [${ts}] snsId=${row.sns_id}  ${snippet}`);
          }
        }));

      // --- 同步数据 ---
      ww.command("sync")
        .description("触发数据同步")
        .argument("<wxId>", "企业微信ID")
        .argument("<type>", "类型: contacts/customers/conversations/labels/all")
        .action(withConnection(async (wxId: string, type: string) => {
          const r = triggerSync(wxId, type);
          console.log(r.success ? `✅ ${type} 同步已发送` : `❌ ${r.error}`);
        }));

      // --- 手机状态 ---
      ww.command("phone")
        .description("查询手机状态")
        .argument("<wxId>", "企业微信ID")
        .action(withConnection(async (wxId: string) => {
          const r = phoneState(wxId);
          console.log(r.success ? "✅ 手机状态查询已发送" : `❌ ${r.error}`);
        }));

      // --- 重连手机 (phone-monitor 自动调) ---
      // 注: Java 协议没专门 Reconnect task, 复用 PhoneStateTask 触发心跳.
      // 真实是否上线由下次 monitor 拉 MySQL isonline 确认.
      ww.command("reconnect-phone")
        .description("尝试重连工作手机")
        .requiredOption("--wx-id <wxId>", "企业微信 ID")
        .action(withConnection(async (opts: { wxId: string }) => {
          const r = reconnectPhone(opts.wxId);
          console.log(r.success ? `✅ 重连指令已发送 (wxId=${opts.wxId})` : `❌ ${r.error}`);
        }));

      // --- 撤回消息 ---
      ww.command("revoke")
        .description("撤回已发出的消息")
        .argument("<wxId>", "企业微信ID")
        .argument("<msgId>", "消息ID (从 history 拉到的 MsgId)")
        .argument("<convId>", "会话ID")
        .action(withConnection(async (wxId: string, msgId: string, convId: string) => {
          const r = await revokeMessageWithRetry(wxId, msgId, convId);
          console.log(r.success ? `✅ 撤回指令已发送 (msg=${msgId})` : `❌ ${r.error}`);
        }));

      // --- 转发消息 ---
      ww.command("forward")
        .description("转发消息到另一个会话")
        .argument("<wxId>", "企业微信ID")
        .argument("<msgId>", "要转发的消息ID")
        .argument("<fromConvId>", "源会话ID")
        .argument("<toConvId>", "目标会话ID")
        .action(withConnection(async (wxId: string, msgId: string, fromConvId: string, toConvId: string) => {
          const r = await forwardMessageWithRetry(wxId, msgId, fromConvId, toConvId);
          console.log(r.success ? `✅ 转发指令已发送 (${fromConvId} → ${toConvId})` : `❌ ${r.error}`);
        }));

      // --- 上传本地文件 → 拽 URL ---
      // 之后用: wework send <wxId> <convId> <URL> --type image
      // 或一条龙: wework send-image <wxId> <convId> <localPath>
      const DEFAULT_UPLOAD_URL = "http://127.0.0.1:15086/fileUpload";
      async function uploadLocalFile(localPath: string, uploadUrl: string): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
        if (!fs.existsSync(localPath)) {
          return { ok: false, error: `文件不存在: ${localPath}` };
        }
        const fileBuf = fs.readFileSync(localPath);
        const fileName = path.basename(localPath);
        const boundary = `----wework${Date.now()}`;
        const head = Buffer.from(
          `--${boundary}\r\nContent-Disposition: form-data; name="myfile"; filename="${fileName}"\r\nContent-Type: application/octet-stream\r\n\r\n`,
          "utf8",
        );
        const tail = Buffer.from(`\r\n--${boundary}--\r\n`, "utf8");
        const body = Buffer.concat([head, fileBuf, tail]);
        try {
          const res = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": `multipart/form-data; boundary=${boundary}` },
            body,
          });
          const text = await res.text();
          const json = JSON.parse(text);
          const url = json?.data?.url;
          if (url) return { ok: true, url };
          return { ok: false, error: `上传 API 没返回 url: ${text.slice(0, 200)}` };
        } catch (e: any) {
          return { ok: false, error: e.message };
        }
      }

      ww.command("upload")
        .description("上传本地文件到服务器图床, 输出 URL")
        .argument("<localPath>", "本地文件绝对路径")
        .option("--upload-url <url>", "fileUpload 接口 URL", DEFAULT_UPLOAD_URL)
        .action(async (localPath: string, opts: { uploadUrl: string }) => {
          // 注意: 此命令不需要连 Java WS, 只是 HTTP POST
          const r = await uploadLocalFile(localPath, opts.uploadUrl);
          console.log(r.ok ? `✅ ${r.url}` : `❌ ${r.error}`);
        });

      // --- 一条龙: 本地图 → 上传 → 发给客户/群 ---
      // 替代手动 wework upload <path> 然后复制 url 再 wework send
      ww.command("send-image")
        .description("上传本地图片并发送给目标会话 (一条龙)")
        .argument("<wxId>", "企业微信ID")
        .argument("<convId>", "目标会话ID (单聊客户 RemoteId 或群 ConvId)")
        .argument("<localPath>", "本地图片绝对路径")
        .option("--upload-url <url>", "fileUpload 接口 URL", DEFAULT_UPLOAD_URL)
        .action(withConnection(async (wxId: string, convId: string, localPath: string, opts: { uploadUrl: string }) => {
          const up = await uploadLocalFile(localPath, opts.uploadUrl);
          if (!up.ok) {
            console.log(`❌ 上传失败: ${up.error}`);
            return;
          }
          console.log(`✅ 上传完成: ${up.url}`);
          const r = await sendMessageWithRetry(wxId, convId, up.url, "image");
          console.log(r.success ? `✅ 图片已发送 → ${convId}` : `❌ 发送失败: ${r.error}`);
        }));

      // --- 加好友 ---
      ww.command("add-customer")
        .description("发送好友请求")
        .argument("<wxId>", "企业微信ID")
        .argument("<remoteId>", "目标客户 RemoteId")
        .option("-v, --verify <content>", "验证消息", "你好")
        .action(withConnection(async (wxId: string, remoteId: string, opts: { verify?: string }) => {
          const r = addCustomerById(wxId, remoteId, opts.verify);
          console.log(r.success ? `✅ 加好友请求已发送 → ${remoteId}` : `❌ ${r.error}`);
        }));

      // --- 通过好友请求 ---
      ww.command("accept-customer")
        .description("通过好友请求")
        .argument("<wxId>", "企业微信ID")
        .argument("<remoteId>", "待接受客户 RemoteId")
        .action(withConnection(async (wxId: string, remoteId: string) => {
          const r = acceptCustomer(wxId, remoteId);
          console.log(r.success ? `✅ 已通过好友请求: ${remoteId}` : `❌ ${r.error}`);
        }));

      // --- 获取外部用户ID ---
      ww.command("get-ext-user-id")
        .description("获取客户 external user id")
        .argument("<wxId>", "企业微信ID")
        .argument("<remoteId>", "客户 RemoteId")
        .action(withConnection(async (wxId: string, remoteId: string) => {
          const r = getExtUserId(wxId, remoteId);
          console.log(r.success ? `✅ 获取 ExtUserId 已发送: ${remoteId}` : `❌ ${r.error}`);
        }));

      // --- 设置备注 ---
      ww.command("set-memo")
        .description("设置客户备注")
        .argument("<wxId>", "企业微信ID")
        .argument("<remoteId>", "客户 RemoteId")
        .argument("<memo>", "备注内容")
        .action(withConnection(async (wxId: string, remoteId: string, memo: string) => {
          const r = setUserMemo(wxId, remoteId, memo);
          console.log(r.success ? `✅ 备注已设置: ${remoteId} → "${memo}"` : `❌ ${r.error}`);
        }));

      // --- 给客户打标签 ---
      ww.command("set-user-labels")
        .description("给客户打标签")
        .argument("<wxId>", "企业微信ID")
        .argument("<remoteId>", "客户 RemoteId")
        .option("--label-ids <ids...>", "标签 ID 列表")
        .action(withConnection(async (wxId: string, remoteId: string, opts: { labelIds?: string[] }) => {
          if (!opts.labelIds?.length) { console.log("❌ 请指定 --label-ids <标签ID列表>"); return; }
          const r = setUserLabels(wxId, remoteId, opts.labelIds);
          console.log(r.success ? `✅ 标签已设置: ${remoteId} → [${opts.labelIds.join(",")}]` : `❌ ${r.error}`);
        }));

      // --- 朋友圈点赞 ---
      ww.command("sns-like")
        .description("给朋友圈动态点赞")
        .argument("<wxId>", "企业微信ID")
        .argument("<snsId>", "朋友圈动态ID")
        .action(withConnection(async (wxId: string, snsId: string) => {
          const r = snsLike(wxId, snsId);
          console.log(r.success ? `✅ 点赞已发送: ${snsId}` : `❌ ${r.error}`);
        }));

      // --- 朋友圈评论 ---
      ww.command("sns-comment")
        .description("评论朋友圈动态")
        .argument("<wxId>", "企业微信ID")
        .argument("<snsId>", "朋友圈动态ID")
        .argument("<content>", "评论内容")
        .option("--reply-to <commentId>", "回复某条评论的ID")
        .action(withConnection(async (wxId: string, snsId: string, content: string, opts: { replyTo?: string }) => {
          const r = snsComment(wxId, snsId, content, opts.replyTo);
          console.log(r.success ? `✅ 评论已发送: ${snsId}` : `❌ ${r.error}`);
        }));

      // --- 删除朋友圈 ---
      ww.command("delete-sns")
        .description("删除自己发的朋友圈动态")
        .argument("<wxId>", "企业微信ID")
        .argument("<snsId>", "朋友圈动态ID")
        .action(withConnection(async (wxId: string, snsId: string) => {
          const r = deleteSns(wxId, snsId);
          console.log(r.success ? `✅ 删除朋友圈已发送: ${snsId}` : `❌ ${r.error}`);
        }));

      // --- 拉取自己二维码 ---
      ww.command("pull-qr-code")
        .description("拉取自己的企业微信二维码")
        .argument("<wxId>", "企业微信ID")
        .action(withConnection(async (wxId: string) => {
          const r = pullQrCode(wxId);
          console.log(r.success ? `✅ 二维码拉取已发送: ${wxId}` : `❌ ${r.error}`);
        }));

    }, { commands: ["wework"] });

    logger.info("[wework-scrm] 注册完成: 36 Agent工具 + CLI + WS客户端模式 (→ Java后端)");
  },
});
