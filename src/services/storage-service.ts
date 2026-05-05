/**
 * 阶段 7.5: 数据存储层
 *
 * 用 SQLite 替代原系统的 MySQL，实现本地持久化。
 * 对应原 Java 的 MyBatis DAO 层 + 各 domain 实体。
 *
 * 表结构映射:
 *   tbl_wx_keywords      → keywords       (关键词自动回复)
 *   tbl_sys_autosettings  → auto_settings  (自动化开关)
 *   tbl_wx_message        → messages       (聊天记录)
 *   tbl_platform_tenant   → tenants        (租户/AI配置)
 *   tbl_task_time         → scheduled_tasks(定时任务)
 */

import Database from "better-sqlite3";
import * as path from "node:path";
import * as fs from "node:fs";

let _db: Database.Database | null = null;

/** 获取数据库实例 (惰性初始化) */
export function getDb(dbPath?: string): Database.Database {
  if (!_db) {
    const resolvedPath = dbPath ?? "./wework-scrm.db";
    _db = new Database(resolvedPath);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");
    initTables(_db);
  }
  return _db;
}

/** 关闭数据库 */
export function closeDb(): void {
  if (_db) {
    _db.close();
    _db = null;
  }
}

// ============================================
// 建表
// ============================================

function initTables(db: Database.Database): void {
  db.exec(`
    -- 关键词自动回复 (对应 tbl_wx_keywords)
    CREATE TABLE IF NOT EXISTS keywords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wx_id TEXT NOT NULL,
      key_type INTEGER NOT NULL DEFAULT 0,  -- 0=精准匹配 1=模糊包含 2=智能匹配
      key_word TEXT NOT NULL,
      return_string TEXT NOT NULL,
      resource_type INTEGER NOT NULL DEFAULT 0, -- 回复消息类型(与ContentType一致)
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_keywords_wxid ON keywords(wx_id);

    -- 自动化设置 (对应 tbl_sys_autosettings)
    CREATE TABLE IF NOT EXISTS auto_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wx_id TEXT NOT NULL,
      auto_type INTEGER NOT NULL,  -- 1001=抢红包 1002=自动通过好友 2001=关键词 2002=自动拉群
      state INTEGER NOT NULL DEFAULT 0, -- 0=开启 1=关闭
      remarks TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(wx_id, auto_type)
    );

    -- 聊天记录 (对应 tbl_wx_message)
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wx_id TEXT NOT NULL,
      conv_id TEXT NOT NULL,
      sender_id TEXT,
      sender_name TEXT,
      content_type TEXT DEFAULT 'text',
      content TEXT,
      msg_id TEXT,
      msg_remote_id TEXT,
      ref_id TEXT,
      is_send TEXT DEFAULT 'false',  -- 'true'=自己发的 'false'=收到的
      msg_time INTEGER,              -- 原消息时间戳
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(wx_id, conv_id);
    CREATE INDEX IF NOT EXISTS idx_messages_time ON messages(created_at);

    -- 租户/AI配置 (对应 tbl_platform_tenant)
    CREATE TABLE IF NOT EXISTS tenants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wx_id TEXT NOT NULL UNIQUE,
      corp_id TEXT,
      corp_name TEXT,
      openai INTEGER DEFAULT 0,    -- 0=关闭AI 1=开启AI
      difyai_url TEXT,
      difyai_key TEXT,
      crm_saas_url TEXT,
      crm_cusmap INTEGER DEFAULT 0,
      msg_to_crm INTEGER DEFAULT 0
    );

    -- 定时任务 (对应 tbl_task_time + tbl_task_time_details)
    CREATE TABLE IF NOT EXISTS scheduled_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wx_id TEXT NOT NULL,
      task_type TEXT NOT NULL,       -- 'mass_send' | 'post_moments' | ...
      msg_type TEXT,                 -- MsgType 名称
      content TEXT,                  -- JSON payload
      execute_at TEXT NOT NULL,      -- 执行时间 ISO格式
      state INTEGER DEFAULT 1,      -- 0=已执行 1=待执行
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_tasks_exec ON scheduled_tasks(execute_at, state);

    -- AI对话缓存 (对应原 Redis 中 ai:chat:{wxId}:{convId})
    CREATE TABLE IF NOT EXISTS ai_conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wx_id TEXT NOT NULL,
      conv_id TEXT NOT NULL,
      dify_conversation_id TEXT,
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(wx_id, conv_id)
    );

    -- 待办任务 (跨进程 IPC: CLI 发起 + service 监听 + service 执行后续)
    -- 用例: CLI 发 ChatRoomActionTask CreateRoom 后退出, service 监听 ConversationAddNotice
    --      按群名匹配后用新 ConvId 执行 send_after 动作.
    CREATE TABLE IF NOT EXISTS pending_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id TEXT NOT NULL UNIQUE,
      task_type TEXT NOT NULL,        -- 'create_room' | ...
      wx_id TEXT NOT NULL,
      match_key TEXT,                 -- 用来从 push 通知匹配 (group_name 等)
      action TEXT NOT NULL,           -- 'send_message' | ...
      action_payload TEXT NOT NULL,   -- JSON: {convId?, content, contentType?, ...}
      status TEXT DEFAULT 'pending',  -- pending | done | error | timeout
      result_conv_id TEXT,            -- 执行后填的新群 ConvId
      result_msg TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      done_at TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_pending_status ON pending_tasks(status, task_type);
    CREATE INDEX IF NOT EXISTS idx_pending_match ON pending_tasks(match_key, status);

    -- 手机 SDK 在线/离线 状态变化事件 (P2 监控)
    -- 由 service 后台轮询 Java MySQL tbl_wx_accountinfo, 状态变化时落库
    CREATE TABLE IF NOT EXISTS phone_status_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wx_id TEXT NOT NULL,
      name TEXT,
      from_state TEXT NOT NULL,    -- 'online' | 'offline' | 'unknown'
      to_state TEXT NOT NULL,
      duration_sec INTEGER,         -- 上一状态持续多久
      ts TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_phone_events_wxid_ts ON phone_status_events(wx_id, ts);

    -- 联系人本地缓存 (从 Java ContactPushNotice / CustomerPushNotice 落库)
    -- 让 LLM 用 wework_find_contact 能找到任何同步过的联系人, 不再要求"必须聊过"
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wx_id TEXT NOT NULL,            -- 我的企微 wxid
      remote_id TEXT NOT NULL,        -- 联系人 RemoteId (= 单聊 convId)
      name TEXT,                      -- 显示名 (含公司)
      alias TEXT,                     -- 别名/备注
      avatar TEXT,
      corp_id TEXT,                   -- 外部联系人公司 id
      corp_name TEXT,
      contact_type INTEGER,           -- 1=内部同事 2=外部客户
      gender INTEGER,
      phone TEXT,
      job TEXT,
      raw_json TEXT,                  -- 完整 push 内容备份
      last_synced_at TEXT DEFAULT (datetime('now')),
      UNIQUE(wx_id, remote_id)
    );
    CREATE INDEX IF NOT EXISTS idx_contacts_wxid_name ON contacts(wx_id, name);
    CREATE INDEX IF NOT EXISTS idx_contacts_wxid_alias ON contacts(wx_id, alias);

    -- 视频/文件 resolve 后的真 URL (跨进程: service 监听 DownloadFileResultNotice
    -- 写, CLI/agent 读). 配合 resolve-media 命令实现自动转发.
    CREATE TABLE IF NOT EXISTS resolved_media (
      msg_id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      file_type INTEGER,
      success INTEGER NOT NULL DEFAULT 1,
      err_msg TEXT,
      ts TEXT DEFAULT (datetime('now'))
    );
  `);
}

// ============================================
// 手机状态事件
// ============================================
export interface PhoneStatusEvent {
  wxId: string;
  name?: string;
  fromState: "online" | "offline" | "unknown";
  toState: "online" | "offline";
  durationSec?: number;
}

export function recordPhoneStatusEvent(e: PhoneStatusEvent): void {
  const db = getDb();
  db.prepare(
    "INSERT INTO phone_status_events (wx_id, name, from_state, to_state, duration_sec) VALUES (?, ?, ?, ?, ?)",
  ).run(e.wxId, e.name ?? null, e.fromState, e.toState, e.durationSec ?? null);
}

export function listPhoneStatusEvents(wxId?: string, limit = 50): any[] {
  const db = getDb();
  return wxId
    ? db.prepare("SELECT * FROM phone_status_events WHERE wx_id=? ORDER BY id DESC LIMIT ?").all(wxId, limit)
    : db.prepare("SELECT * FROM phone_status_events ORDER BY id DESC LIMIT ?").all(limit);
}

// 按名字模糊找联系人 — 双源合并: 先查 contacts 表 (包含全部同步过的),
// 再 fallback 到 messages 表 (聊过的). LLM 用 "给赵丽发消息" 这种自然语言时优先调这个.
/**
 * 从历史消息里取某 senderId 最近的图片/语音/视频/文件 (多张).
 * 给 LLM 用: 用户先在 IM 连发 4 张图, 再发 /ai 把刚发的图都发给XX, LLM 调这个拿全部 URL.
 */
export function getRecentMediaFromSender(wxId: string, senderId: string, withinMinutes = 30, limit = 10): any[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT content_type, content, msg_id, is_send, datetime(created_at, 'localtime') AS ts
    FROM messages
    WHERE wx_id=? AND sender_id=?
      AND content_type IN ('Picture', 'Voice', 'Video', 'File', '2', '3', '4', '5')
      AND created_at > datetime('now', '-${withinMinutes} minutes')
    ORDER BY id DESC
    LIMIT ?
  `).all(wxId, senderId, limit) as any[];

  return rows.map((r) => {
    let url = "";
    let thumbUrl = "";
    let isHd = false;
    let sizeBytes = 0;
    // content 一般是 base64-encoded JSON (Java 推送时这么编)
    // 先尝试 base64 decode 再 parse, 失败再 fallback 原始
    const tryParse = (s: string): any | null => {
      try { return JSON.parse(s); } catch { return null; }
    };
    let obj = null;
    try {
      const decoded = Buffer.from(r.content, "base64").toString("utf8");
      obj = tryParse(decoded);
    } catch { /* not base64 */ }
    if (!obj) obj = tryParse(r.content);
    if (obj) {
      url = obj.url || obj.fileUrl || "";
      thumbUrl = obj.thumbUrl || obj.coverUrl || "";
      isHd = !!obj.isHd;
      sizeBytes = Number(obj.size) || 0;
    }

    // [Java 后端 bug 兜底] Voice 类型 Java 报的 URL 后缀是 .mp3,
    // 但磁盘实际存的是 .amr. 转发该 URL 给目标方时手机 SDK 下载会 404.
    // 这里 fallback: 用 fs 检测真实存在的扩展名替换.
    if ((r.content_type === "Voice" || r.content_type === "3") && url) {
      try {
        const m = url.match(/\/attachment\/(\d+)\/([A-F0-9]+)\.([a-z0-9]+)$/i);
        if (m) {
          const [, date, hash] = m;
          const dir = `/app/storage/attachment/${date}`;
          for (const ext of ["amr", "silk", "mp3", "m4a", "wav"]) {
            const p = `${dir}/${hash}.${ext}`;
            if (fs.existsSync(p)) {
              url = url.replace(/\.[a-z0-9]+$/i, `.${ext}`);
              break;
            }
          }
        }
      } catch { /* ignore */ }
    }

    // [视频/文件转发限制] Java 后端不会把客户发的视频/文件存到图床, 直接报手机本地路径
    // 形如 /storage/emulated/0/Download/... 这种公网下载不了.
    // 我们标记 forwardable=false, LLM 看到就别瞎报"成功".
    const forwardable = !!url && /^https?:\/\//.test(url);

    // is_send 在 SQLite 里是字符串 "true"/"false". true = 我们/工作手机发出去的 (outgoing)
    const isOutgoing = String(r.is_send) === "true";

    // forwardable=false 的具体原因区分 (LLM 拿到能选对策略, 不要无脑试 resolve 浪费 60s)
    // 5/5 终极调查后真相 — Picture 何时 forwardable=true vs false:
    //   isHd=false 且 size <= ~700KB → Java/SDK 自动存图床, URL 是公网, forwardable=true
    //   isHd=true (HD 原图)          → 不自动存, URL 是 /storage/emulated/...
    //   isHd=false 但 size >= ~1MB   → 不自动存 (大图阈值)
    //
    // 这是企微/SDK 厂商的产品行为. 一旦没自动存, resolve_media 也几乎不能补救
    // (Web 前端遇到同样情况只能弹"资源地址获取失败").
    //
    // 用户视角看不到 isHd 标志 (企微 App 里"原图"按钮控制), 操作"一样"但结果不同.
    // 所以 LLM 必须**明确告诉用户原因和可执行方案** — 不是模糊的"SDK 限制".
    const isPicture = r.content_type === "Picture" || r.content_type === "2";

    let reason: string | undefined;
    if (!forwardable) {
      if (isOutgoing) {
        // 工作手机自己发出去的媒体, SDK 协议不支持重新上传 (官方限制).
        reason = "outgoing 自己发出去的媒体, SDK 不支持重传. **告诉用户在企微 App 里长按→转发**.";
      } else if (isPicture) {
        // 给用户精确的可执行诊断
        const sizeKB = Math.round(sizeBytes / 1024);
        const sizeDesc = sizeBytes > 1024 * 1024
          ? `${(sizeBytes / 1024 / 1024).toFixed(2)}MB`
          : `${sizeKB}KB`;
        if (isHd) {
          reason = `这张图你发的时候勾选了"原图"(isHd=true, ${sizeDesc}), 工作手机 SDK 协议不会把原图自动存图床, resolve_media 也几乎补不上 (Web 前端遇到一样, 那边就弹'资源地址获取失败'). **告诉用户两个方案**: ①企微 App 重发时**不要点"原图"按钮**, 发普通图我能直接转; ②或者长按图→手动转发给目标人. 千万别试 resolve_media (浪费 30s).`;
        } else if (sizeBytes > 800 * 1024) {
          reason = `这张图 size=${sizeDesc} 超过 SDK 自动入图床阈值 (~800KB), 没自动公网化. **告诉用户两个方案**: ①企微 App 重发时压缩一下图 (尺寸小一些, ≤700KB 我能直接转); ②或者长按图→手动转发. 别试 resolve_media.`;
        } else {
          reason = `这张图 isHd=false size=${sizeDesc}, 按理应该自动入图床但没入 (Java/SDK 偶发故障). 可以试 wework_resolve_media; 失败就让用户手动转发.`;
        }
      } else if (!url) {
        // 非 Picture (Voice/Video/File) 且 url 完全空
        reason = "incoming 大文件未自动入图床. 用 wework_resolve_media(msgId) 触发手机 SDK 上传, 拿到 URL 再 send_media_url. 失败 (其他任务下载中=Java 繁忙→已自动重试) 退回手动转发.";
      } else {
        // 非 Picture 且 url 是 /storage/emulated/... 之类手机本地路径
        reason = "incoming 媒体, URL 是手机本地路径 (公网不可下). 用 wework_resolve_media(msgId) 触发手机 SDK 上传到图床, 拿到真 URL 再 send_media_url.";
      }
    }

    return {
      contentType: r.content_type,
      url: forwardable ? url : "",
      thumbUrl,
      ts: r.ts,
      msgId: r.msg_id,
      isOutgoing,
      isHd,
      sizeBytes,
      forwardable,
      reason,
      thumbUrlForwardable: !!thumbUrl && /^https?:\/\//.test(thumbUrl),
    };
  });
}

/** 单个最近的 (向后兼容) */
export function getLastMediaFromSender(wxId: string, senderId: string, withinMinutes = 30): any | null {
  const list = getRecentMediaFromSender(wxId, senderId, withinMinutes, 1);
  return list[0] ?? null;
}

// 内存里记 msgId → 已下载到图床的真实 URL (含失败信息)
// 由 DownloadFileResultNotice 推送时填进来, resolve-media 命令轮询
const _resolvedMediaUrls = new Map<string, { url: string; ts: number; success: boolean; errMsg?: string }>();

export function recordResolvedMediaUrl(msgId: string, url: string, fileType?: number, success = true, errMsg?: string): void {
  if (!msgId) return;
  _resolvedMediaUrls.set(msgId, { url, ts: Date.now(), success, errMsg });
  // 同时写 SQLite 跨进程同步 (CLI/agent 进程能查到)
  try {
    const db = getDb();
    db.prepare(`
      INSERT INTO resolved_media (msg_id, url, file_type, success, err_msg, ts)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(msg_id) DO UPDATE SET
        url=excluded.url,
        file_type=excluded.file_type,
        success=excluded.success,
        err_msg=excluded.err_msg,
        ts=datetime('now')
    `).run(msgId, url ?? "", fileType ?? null, success ? 1 : 0, errMsg ?? null);
  } catch { /* ignore */ }
}

/** 已下载的真实 URL — 简化版, 只成功才返回 (向后兼容) */
export function getResolvedMediaUrl(msgId: string): string | null {
  const s = getResolvedMediaStatus(msgId);
  return s.state === "success" ? s.url ?? null : null;
}

/**
 * 已下载的状态 (区分 pending/success/failed) + 错误信息.
 * 给 resolve-media CLI 用: 区分"还在等"vs"Java 报错"vs"成功"
 */
export type MediaStatus =
  | { state: "pending" }
  | { state: "success"; url: string }
  | { state: "failed"; errMsg?: string };

export function getResolvedMediaStatus(msgId: string): MediaStatus {
  if (!msgId) return { state: "pending" };
  // 先查内存 (service 进程自己写的最快)
  const mem = _resolvedMediaUrls.get(msgId);
  if (mem) {
    if (mem.success && mem.url) return { state: "success", url: mem.url };
    return { state: "failed", errMsg: mem.errMsg };
  }
  // 再查 SQLite (跨进程: CLI 子进程读 service 进程写的)
  try {
    const db = getDb();
    const r = db.prepare("SELECT url, success, err_msg FROM resolved_media WHERE msg_id=?").get(msgId) as any;
    if (!r) return { state: "pending" };
    if (r.success && r.url) return { state: "success", url: r.url };
    return { state: "failed", errMsg: r.err_msg ?? undefined };
  } catch {
    return { state: "pending" };
  }
}

/**
 * 清掉某 msgId 的 resolved_media 记录 (内存 + SQLite).
 * 给 transient 重试用: Java 报"其他任务下载中"后, 清掉失败记录, 重发 download 触发, 等新结果.
 */
export function clearResolvedMediaRecord(msgId: string): void {
  if (!msgId) return;
  _resolvedMediaUrls.delete(msgId);
  try {
    const db = getDb();
    db.prepare("DELETE FROM resolved_media WHERE msg_id=?").run(msgId);
  } catch { /* ignore */ }
}

/**
 * 判断 errMsg 是否 Java/SDK 的"暂时性繁忙"错误 — 应该等几秒重试.
 * 关键词从实测日志归纳, 后续遇到新关键词加进来.
 */
export function isTransientResolveError(errMsg: string | undefined): boolean {
  if (!errMsg) return false;
  const msg = errMsg.toLowerCase();
  const transientKeywords = [
    "其他任务下载中",  // 5/5 实测: Java SDK 同时只下一个文件, 后续请求拒
    "下载中",           // 兜底变体
    "繁忙",
    "busy",
    "in progress",
    "another task",
    "rate limit",
    "请稍后",
  ];
  return transientKeywords.some((k) => errMsg.includes(k) || msg.includes(k.toLowerCase()));
}

// 给 resolve-media 用: 顺便从 messages 表读 msg_remote_id
export function getMessageMeta(wxId: string, msgId: string): any | null {
  const db = getDb();
  return db.prepare("SELECT msg_id, msg_remote_id, content_type, content FROM messages WHERE wx_id=? AND msg_id=? LIMIT 1").get(wxId, msgId);
}

export function findContactsByName(wxId: string, namePattern: string, limit = 10): any[] {
  const db = getDb();
  const like = `%${namePattern}%`;

  // 1) 主源: contacts 表 (含未聊过的同步联系人)
  const fromContacts = db.prepare(`
    SELECT
      remote_id    AS conv_id,
      name         AS sender_name,
      alias,
      corp_name,
      contact_type,
      last_synced_at AS last_seen,
      'contact'    AS source,
      0            AS msg_count
    FROM contacts
    WHERE wx_id=? AND (name LIKE ? OR alias LIKE ?)
    ORDER BY last_synced_at DESC
    LIMIT ?
  `).all(wxId, like, like, limit) as any[];

  // 2) 备用源: messages 表 (聊过的联系人, 即使没在 contacts 里)
  const haveRemoteIds = new Set(fromContacts.map((c: any) => c.conv_id));
  const fromMessages = db.prepare(`
    SELECT
      conv_id,
      sender_name,
      NULL         AS alias,
      NULL         AS corp_name,
      NULL         AS contact_type,
      MAX(created_at) AS last_seen,
      'message'    AS source,
      COUNT(*)     AS msg_count
    FROM messages
    WHERE wx_id=? AND sender_name LIKE ?
    GROUP BY conv_id, sender_name
    ORDER BY MAX(created_at) DESC
    LIMIT ?
  `).all(wxId, like, limit) as any[];

  // 合并 (contacts 优先), 同 conv_id 不重复
  const merged = [...fromContacts];
  for (const m of fromMessages) {
    if (!haveRemoteIds.has(m.conv_id)) merged.push(m);
  }
  return merged.slice(0, limit);
}

// 联系人表 upsert (从 Java push notice 调用)
export interface ContactRecord {
  wxId: string;
  remoteId: string;
  name?: string;
  alias?: string;
  avatar?: string;
  corpId?: string;
  corpName?: string;
  contactType?: number;
  gender?: number;
  phone?: string;
  job?: string;
  rawJson?: string;
}
export function upsertContact(c: ContactRecord): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO contacts (wx_id, remote_id, name, alias, avatar, corp_id, corp_name, contact_type, gender, phone, job, raw_json, last_synced_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(wx_id, remote_id) DO UPDATE SET
      name=excluded.name,
      alias=excluded.alias,
      avatar=excluded.avatar,
      corp_id=excluded.corp_id,
      corp_name=excluded.corp_name,
      contact_type=excluded.contact_type,
      gender=excluded.gender,
      phone=excluded.phone,
      job=excluded.job,
      raw_json=excluded.raw_json,
      last_synced_at=datetime('now')
  `).run(c.wxId, c.remoteId, c.name ?? null, c.alias ?? null, c.avatar ?? null,
    c.corpId ?? null, c.corpName ?? null, c.contactType ?? null,
    c.gender ?? null, c.phone ?? null, c.job ?? null, c.rawJson ?? null);
}

export function listContacts(wxId: string, limit = 100): any[] {
  const db = getDb();
  return db.prepare(
    "SELECT * FROM contacts WHERE wx_id=? ORDER BY last_synced_at DESC LIMIT ?",
  ).all(wxId, limit);
}

export function countContacts(wxId: string): number {
  const db = getDb();
  const r = db.prepare("SELECT COUNT(*) AS n FROM contacts WHERE wx_id=?").get(wxId) as any;
  return r?.n ?? 0;
}

// ============================================
// 待办任务 (跨进程 IPC)
// ============================================

export interface PendingTask {
  id: number;
  taskId: string;
  taskType: string;
  wxId: string;
  matchKey: string | null;
  action: string;
  actionPayload: string;
  status: string;
  resultConvId: string | null;
  resultMsg: string | null;
}

export function addPendingTask(p: {
  taskId: string;
  taskType: string;
  wxId: string;
  matchKey?: string;
  action: string;
  actionPayload: Record<string, unknown>;
}): void {
  getDb()
    .prepare(
      "INSERT INTO pending_tasks (task_id, task_type, wx_id, match_key, action, action_payload) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .run(p.taskId, p.taskType, p.wxId, p.matchKey ?? null, p.action, JSON.stringify(p.actionPayload));
}

export function listPendingTasks(taskType?: string): PendingTask[] {
  const db = getDb();
  const rows = taskType
    ? db.prepare("SELECT id, task_id AS taskId, task_type AS taskType, wx_id AS wxId, match_key AS matchKey, action, action_payload AS actionPayload, status, result_conv_id AS resultConvId, result_msg AS resultMsg FROM pending_tasks WHERE status='pending' AND task_type=?").all(taskType)
    : db.prepare("SELECT id, task_id AS taskId, task_type AS taskType, wx_id AS wxId, match_key AS matchKey, action, action_payload AS actionPayload, status, result_conv_id AS resultConvId, result_msg AS resultMsg FROM pending_tasks WHERE status='pending'").all();
  return rows as PendingTask[];
}

export function findPendingTaskByMatch(taskType: string, matchKey: string): PendingTask | null {
  const row = getDb()
    .prepare(
      "SELECT id, task_id AS taskId, task_type AS taskType, wx_id AS wxId, match_key AS matchKey, action, action_payload AS actionPayload, status, result_conv_id AS resultConvId, result_msg AS resultMsg FROM pending_tasks WHERE status='pending' AND task_type=? AND match_key=? ORDER BY id DESC LIMIT 1",
    )
    .get(taskType, matchKey);
  return (row ?? null) as PendingTask | null;
}

export function markPendingTaskDone(id: number, resultConvId?: string, resultMsg?: string): void {
  getDb()
    .prepare(
      "UPDATE pending_tasks SET status='done', result_conv_id=?, result_msg=?, done_at=datetime('now') WHERE id=?",
    )
    .run(resultConvId ?? null, resultMsg ?? null, id);
}

export function markPendingTaskError(id: number, errMsg: string): void {
  getDb()
    .prepare("UPDATE pending_tasks SET status='error', result_msg=?, done_at=datetime('now') WHERE id=?")
    .run(errMsg, id);
}

/** 删除超过 ageHours 还在 pending 的任务 (避免堆积) */
export function cleanupStalePendingTasks(ageHours: number = 24): number {
  const r = getDb()
    .prepare(
      `UPDATE pending_tasks SET status='timeout', done_at=datetime('now') WHERE status='pending' AND created_at < datetime('now', '-${ageHours} hours')`,
    )
    .run();
  return r.changes;
}

// ============================================
// 关键词操作 (对应 KeyWordsService / KeyWordsDao)
// ============================================

export interface KeywordRule {
  id: number;
  wxId: string;
  keyType: number;
  keyWord: string;
  returnString: string;
  resourceType: number;
}

export function getKeywords(wxId: string, keyType?: number): KeywordRule[] {
  const db = getDb();
  if (keyType !== undefined) {
    return db
      .prepare("SELECT * FROM keywords WHERE wx_id = ? AND key_type = ?")
      .all(wxId, keyType) as KeywordRule[];
  }
  return db
    .prepare("SELECT * FROM keywords WHERE wx_id = ?")
    .all(wxId) as KeywordRule[];
}

export function addKeyword(
  wxId: string,
  keyWord: string,
  returnString: string,
  keyType: number = 0,
  resourceType: number = 0,
): void {
  const db = getDb();
  db.prepare(
    "INSERT INTO keywords (wx_id, key_type, key_word, return_string, resource_type) VALUES (?, ?, ?, ?, ?)",
  ).run(wxId, keyType, keyWord, returnString, resourceType);
}

export function deleteKeyword(id: number): void {
  getDb().prepare("DELETE FROM keywords WHERE id = ?").run(id);
}

// ============================================
// 自动化设置操作 (对应 SysAutoSettingService)
// ============================================

export interface AutoSetting {
  id: number;
  wxId: string;
  autoType: number;
  state: number;
  remarks: string | null;
}

export function getAutoSetting(
  wxId: string,
  autoType: number,
): AutoSetting | undefined {
  return getDb()
    .prepare("SELECT * FROM auto_settings WHERE wx_id = ? AND auto_type = ? AND state = 0")
    .get(wxId, autoType) as AutoSetting | undefined;
}

export function setAutoSetting(
  wxId: string,
  autoType: number,
  state: number,
  remarks?: string,
): void {
  getDb()
    .prepare(
      `INSERT INTO auto_settings (wx_id, auto_type, state, remarks)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(wx_id, auto_type) DO UPDATE SET state = ?, remarks = ?`,
    )
    .run(wxId, autoType, state, remarks ?? null, state, remarks ?? null);
}

// ============================================
// 消息存储 (对应 MessageService / MessageDao)
// ============================================

export interface StoredMessage {
  id: number;
  wxId: string;
  convId: string;
  senderId: string;
  senderName: string;
  contentType: string;
  content: string;
  msgId: string;
  isSend: string;
  msgTime: number;
  createdAt: string;
}

export function saveMessage(msg: {
  wxId: string;
  convId: string;
  senderId?: string;
  senderName?: string;
  contentType?: string;
  content?: string;
  msgId?: string;
  msgRemoteId?: string;
  refId?: string;
  isSend?: string;
  msgTime?: number;
}): void {
  getDb()
    .prepare(
      `INSERT INTO messages (wx_id, conv_id, sender_id, sender_name, content_type, content, msg_id, msg_remote_id, ref_id, is_send, msg_time)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      msg.wxId,
      msg.convId,
      msg.senderId ?? "",
      msg.senderName ?? "",
      msg.contentType ?? "text",
      msg.content ?? "",
      msg.msgId ?? "",
      msg.msgRemoteId ?? "",
      msg.refId ?? "",
      msg.isSend ?? "false",
      msg.msgTime ?? Date.now(),
    );
}

export function getLastMessages(
  convId: string,
  wxId: string,
  limit: number = 100,
): StoredMessage[] {
  return getDb()
    .prepare(
      "SELECT * FROM messages WHERE conv_id = ? AND wx_id = ? ORDER BY id DESC LIMIT ?",
    )
    .all(convId, wxId, limit) as StoredMessage[];
}

// ============================================
// 租户/AI配置 (对应 PlatformTenantService)
// ============================================

export interface TenantConfig {
  id: number;
  wxId: string;
  openai: number;
  difyaiUrl: string | null;
  difyaiKey: string | null;
}

export function getTenantByWxId(wxId: string): TenantConfig | undefined {
  return getDb()
    .prepare("SELECT * FROM tenants WHERE wx_id = ?")
    .get(wxId) as TenantConfig | undefined;
}

export function setTenant(wxId: string, config: Partial<TenantConfig>): void {
  getDb()
    .prepare(
      `INSERT INTO tenants (wx_id, openai, difyai_url, difyai_key)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(wx_id) DO UPDATE SET openai = ?, difyai_url = ?, difyai_key = ?`,
    )
    .run(
      wxId,
      config.openai ?? 0,
      config.difyaiUrl ?? null,
      config.difyaiKey ?? null,
      config.openai ?? 0,
      config.difyaiUrl ?? null,
      config.difyaiKey ?? null,
    );
}

// ============================================
// AI对话缓存 (替代原 Redis ai:chat:{wxId}:{convId})
// ============================================

export function getAiConversationId(
  wxId: string,
  convId: string,
): string | null {
  const row = getDb()
    .prepare(
      "SELECT dify_conversation_id FROM ai_conversations WHERE wx_id = ? AND conv_id = ?",
    )
    .get(wxId, convId) as { dify_conversation_id: string } | undefined;
  return row?.dify_conversation_id ?? null;
}

export function setAiConversationId(
  wxId: string,
  convId: string,
  difyConversationId: string,
): void {
  getDb()
    .prepare(
      `INSERT INTO ai_conversations (wx_id, conv_id, dify_conversation_id)
       VALUES (?, ?, ?)
       ON CONFLICT(wx_id, conv_id) DO UPDATE SET dify_conversation_id = ?, updated_at = datetime('now')`,
    )
    .run(wxId, convId, difyConversationId, difyConversationId);
}

// ============================================
// 定时任务 (对应 TaskTimeService)
// ============================================

export interface ScheduledTask {
  id: number;
  wxId: string;
  taskType: string;
  msgType: string;
  content: string;
  executeAt: string;
  state: number;
}

export function getPendingTasks(): ScheduledTask[] {
  return getDb()
    .prepare(
      "SELECT * FROM scheduled_tasks WHERE state = 1 AND execute_at <= datetime('now') ORDER BY execute_at",
    )
    .all() as ScheduledTask[];
}

export function addScheduledTask(task: {
  wxId: string;
  taskType: string;
  msgType?: string;
  content: string;
  executeAt: string;
}): number {
  const result = getDb()
    .prepare(
      "INSERT INTO scheduled_tasks (wx_id, task_type, msg_type, content, execute_at) VALUES (?, ?, ?, ?, ?)",
    )
    .run(task.wxId, task.taskType, task.msgType ?? "", task.content, task.executeAt);
  return result.lastInsertRowid as number;
}

export function markTaskDone(id: number): void {
  getDb().prepare("UPDATE scheduled_tasks SET state = 0 WHERE id = ?").run(id);
}

export function deletePendingTask(id: number): void {
  getDb().prepare("DELETE FROM scheduled_tasks WHERE id = ? AND state = 1").run(id);
}
