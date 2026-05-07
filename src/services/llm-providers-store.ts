/**
 * LLM Provider 持久化层
 *
 * 表 llm_providers (定义在 storage-service.ts initTables 里):
 *   id TEXT PK, type, name, base_url, model,
 *   api_key_encrypted (AES-256-GCM, base64), is_default, enabled, created_at
 *
 * API key 加密:
 *   算法 AES-256-GCM (Node 内置 crypto, 无新依赖)
 *   主密钥 32 字节 — 从 env OPENCLAW_SECRET 派生 (scryptSync), fallback 'wework-dev-key' (有 console.warn)
 *   每条记录独立 IV (12 字节随机) + auth tag (16 字节)
 *   存储格式 base64(IV ‖ AUTH_TAG ‖ CIPHERTEXT)  — 一段 base64, 解密时按长度切回
 *
 * 用法:
 *   listProviders()                             — 列表 (含密文)
 *   addProvider({...})                          — 新增, 自动生成 id, 返回 row
 *   updateProvider(id, patch)                   — 局部更新; 含 apiKey 时重新加密
 *   deleteProvider(id)                          — 删除 (默认的不能删, 调用方自行检查)
 *   setDefault(id)                              — 把指定 id 置默认, 其余 isDefault=0
 *   getDefaultProvider()                        — agent-runner 每次 chat 调一下, 拿当前默认
 *   getApiKeyPlain(row)                         — 解密单条
 */

import * as crypto from "node:crypto";
import { getDb } from "./storage-service.js";
import type { LLMProviderConfig } from "./llm-provider.js";

// ============================================
// 加密 / 解密 (AES-256-GCM)
// ============================================

const ALGO = "aes-256-gcm";
const IV_LEN = 12; // GCM 推荐 12 字节
const TAG_LEN = 16; // GCM 默认 auth tag 16 字节
const KEY_LEN = 32; // AES-256 → 32 字节

/** 派生主密钥 — env OPENCLAW_SECRET 走 scrypt, 没设走 dev fallback (有警告) */
let _cachedKey: Buffer | null = null;
function getMasterKey(): Buffer {
  if (_cachedKey) return _cachedKey;
  const raw = process.env.OPENCLAW_SECRET;
  if (!raw) {
    console.warn(
      "[llm-providers-store] OPENCLAW_SECRET 未设置, 使用 dev fallback 'wework-dev-key' — 生产必须设置真密钥",
    );
  }
  const seed = raw || "wework-dev-key";
  // scryptSync — 用固定 salt 让相同 seed 派生同一 key (跨进程一致)
  _cachedKey = crypto.scryptSync(seed, "openclaw-llm-provider-salt-v1", KEY_LEN);
  return _cachedKey;
}

/** 加密 API key, 返回 base64(IV ‖ TAG ‖ CIPHER); 空串原样返回空串 */
export function encryptApiKey(plain: string): string {
  if (!plain) return "";
  const key = getMasterKey();
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // 拼成 IV(12) ‖ TAG(16) ‖ CIPHER(...) → base64
  return Buffer.concat([iv, tag, enc]).toString("base64");
}

/** 解密 — 失败返 null, 不抛 (避免一条坏数据卡死整表读) */
export function decryptApiKey(encB64: string): string | null {
  if (!encB64) return "";
  try {
    const buf = Buffer.from(encB64, "base64");
    if (buf.length < IV_LEN + TAG_LEN + 1) return null;
    const iv = buf.subarray(0, IV_LEN);
    const tag = buf.subarray(IV_LEN, IV_LEN + TAG_LEN);
    const enc = buf.subarray(IV_LEN + TAG_LEN);
    const decipher = crypto.createDecipheriv(ALGO, getMasterKey(), iv);
    decipher.setAuthTag(tag);
    const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
    return dec.toString("utf8");
  } catch (e) {
    console.error("[llm-providers-store] 解密失败:", e instanceof Error ? e.message : e);
    return null;
  }
}

// ============================================
// 表初始化 (惰性, 第一次调用任意 helper 时确保表存在)
// ============================================

let _tableEnsured = false;
function ensureTable(): void {
  if (_tableEnsured) return;
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS llm_providers (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,            -- kimi/claude/openai/dify/custom
      name TEXT NOT NULL,
      base_url TEXT NOT NULL,
      model TEXT NOT NULL,
      api_key_encrypted TEXT,        -- AES-256-GCM 密文 (base64); 空串表示无 key
      is_default INTEGER DEFAULT 0,  -- 0/1
      enabled INTEGER DEFAULT 1,     -- 0/1
      created_at INTEGER NOT NULL    -- unix 毫秒
    );
    CREATE INDEX IF NOT EXISTS idx_llm_providers_default ON llm_providers(is_default);
  `);
  _tableEnsured = true;
}

// ============================================
// 类型
// ============================================

export interface LLMProviderRow {
  id: string;
  type: string;
  name: string;
  baseUrl: string;
  model: string;
  /** 加密后的 base64; 没填 key 时空串 */
  apiKeyEncrypted: string;
  isDefault: boolean;
  enabled: boolean;
  createdAt: number;
}

export interface AddProviderInput {
  type: string;
  name: string;
  baseUrl: string;
  model: string;
  apiKey: string;
  isDefault?: boolean;
}

export interface UpdateProviderInput {
  type?: string;
  name?: string;
  baseUrl?: string;
  model?: string;
  /** 传了 (含空串) 视为重新设置; 不传 ( undefined) 保持原值 */
  apiKey?: string;
  isDefault?: boolean;
  enabled?: boolean;
}

// ============================================
// CRUD
// ============================================

interface RawRow {
  id: string;
  type: string;
  name: string;
  base_url: string;
  model: string;
  api_key_encrypted: string | null;
  is_default: number;
  enabled: number;
  created_at: number;
}

function mapRow(r: RawRow): LLMProviderRow {
  return {
    id: r.id,
    type: r.type,
    name: r.name,
    baseUrl: r.base_url,
    model: r.model,
    apiKeyEncrypted: r.api_key_encrypted ?? "",
    isDefault: r.is_default === 1,
    enabled: r.enabled === 1,
    createdAt: r.created_at,
  };
}

/** 列出所有 provider (按 is_default 优先, 然后按 created_at) */
export function listProviders(): LLMProviderRow[] {
  ensureTable();
  const rows = getDb()
    .prepare(
      "SELECT id, type, name, base_url, model, api_key_encrypted, is_default, enabled, created_at FROM llm_providers ORDER BY is_default DESC, created_at ASC",
    )
    .all() as RawRow[];
  return rows.map(mapRow);
}

/** 单条 — id 不存在返 null */
export function getProvider(id: string): LLMProviderRow | null {
  ensureTable();
  const r = getDb()
    .prepare(
      "SELECT id, type, name, base_url, model, api_key_encrypted, is_default, enabled, created_at FROM llm_providers WHERE id=?",
    )
    .get(id) as RawRow | undefined;
  return r ? mapRow(r) : null;
}

/**
 * 当前默认 provider (供 agent-runner 每次 chat query).
 * 返回已解密的 LLMProviderConfig (能直接喂给 streamOpenAICompatible).
 * 如果没默认或解密失败, 返 null.
 */
export function getDefaultProvider(): LLMProviderConfig | null {
  ensureTable();
  const r = getDb()
    .prepare(
      "SELECT id, type, name, base_url, model, api_key_encrypted, is_default, enabled, created_at FROM llm_providers WHERE is_default=1 AND enabled=1 LIMIT 1",
    )
    .get() as RawRow | undefined;
  if (!r) return null;
  const row = mapRow(r);
  const apiKey = row.apiKeyEncrypted ? decryptApiKey(row.apiKeyEncrypted) : "";
  if (apiKey === null) return null;
  // type 字段映射: anthropic 走 anthropic 协议, 其余走 OpenAI 兼容
  const protoType: LLMProviderConfig["type"] =
    row.type === "claude" || row.type === "anthropic" ? "anthropic" : "openai_compatible";
  return {
    id: row.id,
    type: protoType,
    name: row.name,
    baseUrl: row.baseUrl,
    apiKey,
    model: row.model,
  };
}

/** 拿单条解密后的 API key (testProvider 用); 没 key 返空串, 解密失败返 null */
export function getApiKeyPlain(row: LLMProviderRow): string | null {
  if (!row.apiKeyEncrypted) return "";
  return decryptApiKey(row.apiKeyEncrypted);
}

/** 生成短 id (跟原前端 'custom-${Date.now()}' 类似但带随机后缀防撞) */
function genId(): string {
  return `prov_${Date.now().toString(36)}_${crypto.randomBytes(3).toString("hex")}`;
}

/**
 * 新增. isDefault=true 时把其他记录的 is_default 清 0 (单事务).
 * 返回新增后的 row.
 */
export function addProvider(input: AddProviderInput): LLMProviderRow {
  ensureTable();
  const db = getDb();
  const id = genId();
  const enc = encryptApiKey(input.apiKey || "");
  const isDefault = input.isDefault ? 1 : 0;
  const now = Date.now();

  // 单事务: 如果要置默认, 先清旧默认, 再插入
  db.transaction(() => {
    if (isDefault === 1) {
      db.prepare("UPDATE llm_providers SET is_default=0").run();
    } else {
      // 如果当前还一条都没有, 自动把第一条置默认 (不然 getDefaultProvider 永远返 null)
      const cnt = (db.prepare("SELECT COUNT(*) AS n FROM llm_providers").get() as { n: number }).n;
      if (cnt === 0) {
        // 强制置默认
        db.prepare(
          `INSERT INTO llm_providers (id, type, name, base_url, model, api_key_encrypted, is_default, enabled, created_at)
           VALUES (?, ?, ?, ?, ?, ?, 1, 1, ?)`,
        ).run(id, input.type, input.name, input.baseUrl, input.model, enc, now);
        return;
      }
    }
    db.prepare(
      `INSERT INTO llm_providers (id, type, name, base_url, model, api_key_encrypted, is_default, enabled, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`,
    ).run(id, input.type, input.name, input.baseUrl, input.model, enc, isDefault, now);
  })();

  const row = getProvider(id);
  if (!row) throw new Error("addProvider 失败 (插入后查不到)");
  return row;
}

/** 局部更新; 找不到 id 返 null */
export function updateProvider(id: string, patch: UpdateProviderInput): LLMProviderRow | null {
  ensureTable();
  const db = getDb();
  const cur = getProvider(id);
  if (!cur) return null;

  const fields: string[] = [];
  const vals: unknown[] = [];

  if (patch.type !== undefined) {
    fields.push("type=?");
    vals.push(patch.type);
  }
  if (patch.name !== undefined) {
    fields.push("name=?");
    vals.push(patch.name);
  }
  if (patch.baseUrl !== undefined) {
    fields.push("base_url=?");
    vals.push(patch.baseUrl);
  }
  if (patch.model !== undefined) {
    fields.push("model=?");
    vals.push(patch.model);
  }
  if (patch.apiKey !== undefined) {
    // 空串 = 清除 key (允许); 非空 = 重新加密
    fields.push("api_key_encrypted=?");
    vals.push(patch.apiKey ? encryptApiKey(patch.apiKey) : "");
  }
  if (patch.enabled !== undefined) {
    fields.push("enabled=?");
    vals.push(patch.enabled ? 1 : 0);
  }

  db.transaction(() => {
    if (fields.length > 0) {
      vals.push(id);
      db.prepare(`UPDATE llm_providers SET ${fields.join(", ")} WHERE id=?`).run(...vals);
    }
    // is_default 单独处理 — 通过 setDefault 逻辑保持唯一性
    if (patch.isDefault === true) {
      db.prepare("UPDATE llm_providers SET is_default=0").run();
      db.prepare("UPDATE llm_providers SET is_default=1 WHERE id=?").run(id);
    } else if (patch.isDefault === false) {
      // 只是把当前这条去默认 (不一定要立刻补另一条)
      db.prepare("UPDATE llm_providers SET is_default=0 WHERE id=?").run(id);
    }
  })();

  return getProvider(id);
}

/** 删除. 不允许删默认的 (调用方应先 setDefault 别人); 这里放硬约束兜底. 返删除条数 */
export function deleteProvider(id: string): { deleted: number; reason?: string } {
  ensureTable();
  const cur = getProvider(id);
  if (!cur) return { deleted: 0, reason: "not_found" };
  if (cur.isDefault) return { deleted: 0, reason: "is_default" };
  const r = getDb().prepare("DELETE FROM llm_providers WHERE id=?").run(id);
  return { deleted: r.changes };
}

/** 设默认 — 把 id 置默认, 其余清 0 (单事务). id 不存在返 false */
export function setDefault(id: string): boolean {
  ensureTable();
  const db = getDb();
  const cur = getProvider(id);
  if (!cur) return false;
  db.transaction(() => {
    db.prepare("UPDATE llm_providers SET is_default=0").run();
    db.prepare("UPDATE llm_providers SET is_default=1, enabled=1 WHERE id=?").run(id);
  })();
  return true;
}

// ============================================
// 启动 seed — 把启动 default provider (env / config) 写一条进 DB,
// 让用户没手动配过时也有可用的默认
// ============================================

/**
 * 启动时调一次: 如果表空, 用 fallbackCfg seed 一条默认进去;
 * 如果表已有记录, 不动 (用户配置优先).
 *
 * @returns true 表示插入了 seed
 */
export function seedDefaultIfEmpty(fallbackCfg: LLMProviderConfig | null): boolean {
  if (!fallbackCfg) return false;
  ensureTable();
  const cnt = (getDb().prepare("SELECT COUNT(*) AS n FROM llm_providers").get() as { n: number }).n;
  if (cnt > 0) return false;
  // type: anthropic → claude, 其它默认 kimi/openai (按 baseUrl 含 moonshot 区分)
  let type = "custom";
  if (fallbackCfg.type === "anthropic") type = "claude";
  else if (/moonshot/i.test(fallbackCfg.baseUrl)) type = "kimi";
  else if (/openai\.com/i.test(fallbackCfg.baseUrl)) type = "openai";
  else if (/dify/i.test(fallbackCfg.baseUrl)) type = "dify";

  addProvider({
    type,
    name: fallbackCfg.name,
    baseUrl: fallbackCfg.baseUrl,
    model: fallbackCfg.model,
    apiKey: fallbackCfg.apiKey,
    isDefault: true,
  });
  return true;
}
