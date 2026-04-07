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
  `);
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
