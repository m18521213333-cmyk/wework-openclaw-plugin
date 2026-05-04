/**
 * 联系人定时同步 + WS 推送落库
 *
 * 双轨制:
 *   1. 主动定时拉: 每 30 分钟触发 wework sync contacts (Java 推回 ContactPushNotice)
 *   2. 被动接收: WS 服务收到 ContactPushNotice / CustomerPushNotice 时调用 upsertContact
 *
 * 这样 LLM 用 wework_find_contact 能查到任何企微通讯录里的联系人,
 * 不再依赖 "必须聊过" 这种限制.
 *
 * 仅在 systemd-managed openclaw-scrm.service 里跑 (有 WEWORK_PLUGIN_ENABLE=1).
 */

import { triggerSync as sendTriggerSync } from "./send-helper.js";
import { upsertContact, countContacts } from "./storage-service.js";

let _interval: NodeJS.Timeout | null = null;
let _logger: { info: (m: string) => void; warn: (m: string) => void; error: (m: string) => void } | null = null;
let _wxId: string | null = null;
let _lastSyncOkAt: number = 0;

/**
 * 处理 Java 推过来的 ContactPushNotice / CustomerPushNotice
 * 这些 notice 包含一批联系人, 字段名取自 proto:
 *   WxId           = 我的企微 wxid
 *   Contacts/RoomMembers/Customers  (任一)  = 联系人列表
 * 每个联系人对象大致有: RemoteId, Name, Alias, Avatar, CorpId, CorpName, Type, Gender, Phone, Position
 */
export function handleContactPush(content: any, logger: any): void {
  if (!content) return;
  const wxId = String(content.WxId ?? content.wxId ?? "");
  if (!wxId) return;

  // 不同 push 字段名都收一下
  const lists = [
    content.Contacts, content.contacts,
    content.Customers, content.customers,
    content.Members, content.members,
    content.RoomMembers, content.roomMembers,
  ].filter(Array.isArray);

  let n = 0;
  for (const list of lists) {
    for (const c of list) {
      if (!c) continue;
      const remoteId = String(c.RemoteId ?? c.remoteId ?? c.WxId ?? c.wxId ?? "");
      if (!remoteId) continue;
      try {
        upsertContact({
          wxId,
          remoteId,
          name: c.Name ?? c.name,
          alias: c.Alias ?? c.alias,
          avatar: c.Avatar ?? c.avatar,
          corpId: String(c.CorpId ?? c.corpId ?? "") || undefined,
          corpName: c.CorpName ?? c.corpName,
          contactType: c.Type ?? c.type,
          gender: c.Gender ?? c.gender,
          phone: c.Phone ?? c.phone,
          job: c.Position ?? c.position ?? c.Job ?? c.job,
          rawJson: JSON.stringify(c),
        });
        n++;
      } catch (e: any) {
        logger?.warn?.(`[ContactSync] upsert failed: ${e.message}`);
      }
    }
  }

  if (n > 0) {
    _lastSyncOkAt = Date.now();
    logger?.info?.(`[ContactSync] 落库 ${n} 个联系人 (wxId=${wxId}, 总数 ${countContacts(wxId)})`);
  }
}

/** 触发主动同步 (走 Java) */
async function tickSync(): Promise<void> {
  if (!_wxId || !_logger) return;
  try {
    const r = sendTriggerSync(_wxId, "contacts");
    if (r.success) {
      _logger.info(`[ContactSync] ✓ 已发同步指令到 Java (类型=contacts, wxId=${_wxId})`);
    } else {
      _logger.warn(`[ContactSync] 发同步指令失败: ${r.error}`);
    }
  } catch (e: any) {
    _logger.warn(`[ContactSync] 同步异常: ${e.message}`);
  }
}

/** 启动定时同步: 启动后先跑一次, 然后每 intervalMs 跑一次 */
export function startContactSync(
  wxId: string,
  logger: { info: (m: string) => void; warn: (m: string) => void; error: (m: string) => void },
  intervalMs = 30 * 60 * 1000,  // 默认 30 分钟
  initialDelayMs = 30_000,       // 启动 30s 后跑第一次 (等 WS 认证完)
): void {
  if (_interval) return;
  _wxId = wxId;
  _logger = logger;
  logger.info(`[ContactSync] 启动 (wxId=${wxId}, 间隔 ${intervalMs / 60000}min)`);

  setTimeout(tickSync, initialDelayMs);
  _interval = setInterval(tickSync, intervalMs);
}

export function stopContactSync(): void {
  if (_interval) {
    clearInterval(_interval);
    _interval = null;
    _logger?.info("[ContactSync] 已停止");
  }
}

/** 给 wework health 用 — 报告最后一次同步成功时间 */
export function getLastSyncTime(): { ts: number; ageSec: number } {
  return {
    ts: _lastSyncOkAt,
    ageSec: _lastSyncOkAt ? Math.round((Date.now() - _lastSyncOkAt) / 1000) : -1,
  };
}
