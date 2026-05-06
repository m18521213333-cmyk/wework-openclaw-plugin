/**
 * 手机 SDK 在线状态监控 (后台轮询)
 *
 * 每 60s 查 Java MySQL tbl_wx_accountinfo.isonline, 状态变化时:
 *  - 落 SQLite phone_status_events 表
 *  - 打日志 (journalctl 可见)
 *  - 通过 healthEvents 广播 phone-offline / phone-reconnected (前端 SSE toast)
 *  - 触发自动重连流程 (online → offline 时, 最多 3 次, 每次间隔 30s)
 *
 * 仅在 systemd-managed openclaw-scrm.service 里跑 (有 WEWORK_PLUGIN_ENABLE=1).
 * CLI / agent 进程不跑这个轮询.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import * as fs from "node:fs";
import { recordPhoneStatusEvent } from "./storage-service.js";
import { healthEvents } from "./health-events.js";

const execFileAsync = promisify(execFile);

export interface PhoneRow {
  wxId: string;
  name: string;
  online: boolean;
}

// 上次见到的状态 + 那个状态从什么时候开始 (用来算 duration)
const lastState = new Map<string, { state: "online" | "offline"; sinceTs: number }>();

// 重连状态: 每个 wxId 一个 retry counter + scheduled timer.
// online → offline 跳变时启动; 重连成功 (再次 online 跳变) 或超出 max 重置.
interface ReconnectState {
  attempts: number;          // 已尝试次数
  timer: NodeJS.Timeout | null; // 下一次尝试的定时器
  giveUp: boolean;              // 是否已放弃 (本次 offline 周期内不再重试)
  name: string;
}
const reconnectState = new Map<string, ReconnectState>();

// 重连参数 (常量, 任务约束: 最多 3 次, 间隔 30s)
const RECONNECT_MAX_RETRY = 3;
const RECONNECT_INTERVAL_MS = 30_000;
const OPENCLAW_BIN = process.env.AI_BIN || "/usr/local/bin/openclaw";

let _interval: NodeJS.Timeout | null = null;
let _logger: { info: (m: string) => void; warn: (m: string) => void; error: (m: string) => void } | null = null;

export async function queryPhones(): Promise<PhoneRow[] | null> {
  const propsPath = "/opt/wework/wework-server/src/main/resources/application.properties";
  if (!fs.existsSync(propsPath)) return null;
  const props = fs.readFileSync(propsPath, "utf8");
  const dbUser = props.match(/^spring\.datasource\.username=(.+)$/m)?.[1]?.trim() ?? "wework";
  const dbPass = props.match(/^spring\.datasource\.password=(.+)$/m)?.[1]?.trim() ?? "";
  const dbName = props.match(/jdbc:mysql:\/\/[^/]+\/([^?]+)/)?.[1] ?? "workchat";
  if (!dbPass) return null;
  try {
    const { stdout } = await execFileAsync("mysql",
      ["-u", dbUser, "-N", "-B", dbName, "-e",
       "SELECT wxid, name, isonline FROM tbl_wx_accountinfo WHERE wxid IS NOT NULL;"],
      { env: { ...process.env, MYSQL_PWD: dbPass }, encoding: "utf8", timeout: 5_000 });
    return stdout.trim().split("\n").filter(Boolean).map((line) => {
      const [wxId, name, isonlineStr] = line.split("\t");
      return { wxId, name: name ?? "", online: isonlineStr === "0" };
    });
  } catch {
    return null;
  }
}

/**
 * 触发一次 openclaw CLI 重连 (TODO: CLI 子命令 reconnect-phone 还没实现, 标 warn)
 *
 * 当前实现: 直接 spawn `openclaw wework reconnect-phone --wx-id=<wxId>`.
 * 如果 CLI 不识别 (返非 0 / 报 unknown command), 当成 transient 失败处理 + console.warn.
 *
 * 返回 true 表示 CLI 退出码 0 (Java 接收到重连指令, 不代表手机一定真重新上线).
 * 真实是否上线由下一次 tick 拉 MySQL isonline 确认.
 */
async function triggerReconnect(wxId: string): Promise<boolean> {
  return new Promise((resolve) => {
    execFile(
      OPENCLAW_BIN,
      ["wework", "reconnect-phone", `--wx-id=${wxId}`],
      { timeout: 15_000, encoding: "utf8" },
      (err, _stdout, stderr) => {
        if (err) {
          // CLI 还没实现 / 报错 — 标 TODO 提示
          const msg = (stderr || err.message || "").slice(0, 200);
          // eslint-disable-next-line no-console
          console.warn(
            `[PhoneMonitor] TODO: 'openclaw wework reconnect-phone --wx-id=${wxId}' CLI 未就绪或失败: ${msg}`,
          );
          resolve(false);
          return;
        }
        resolve(true);
      },
    );
  });
}

/** 启动一次重连尝试 (内部递归调度下一次, 直到成功 / 放弃 / 状态变化) */
function scheduleReconnect(wxId: string, name: string): void {
  const st = reconnectState.get(wxId);
  if (!st || st.giveUp) return;
  // 状态已经变了 (例如手动恢复), 不重连
  const cur = lastState.get(wxId);
  if (!cur || cur.state === "online") return;

  st.attempts += 1;
  const attempt = st.attempts;

  healthEvents.broadcast({
    type: "phone-reconnect-attempt",
    ts: Date.now(),
    wxId,
    name,
    attempt,
    maxRetry: RECONNECT_MAX_RETRY,
  });
  _logger?.info(`[PhoneMonitor] 自动重连 ${name}(${wxId}) 第 ${attempt}/${RECONNECT_MAX_RETRY} 次`);

  triggerReconnect(wxId)
    .then((ok) => {
      if (!ok) {
        _logger?.warn(`[PhoneMonitor] 重连命令退出码非 0, ${name}(${wxId}) 第 ${attempt} 次失败 — 等下次 tick 验证 isonline`);
      }
      // 不论 CLI 返回如何, 真实结果以下次 tick 看 MySQL 为准.
      // 这里只负责调度下一次 (如果还在 offline + 没超 max).
      const cur2 = lastState.get(wxId);
      const st2 = reconnectState.get(wxId);
      if (!st2 || st2.giveUp) return;
      if (cur2?.state === "online") {
        // 已经回来了 — onJumpToOnline 会清状态, 这里不动
        return;
      }
      if (st2.attempts >= RECONNECT_MAX_RETRY) {
        st2.giveUp = true;
        _logger?.warn(`[PhoneMonitor] ${name}(${wxId}) 自动重连 ${RECONNECT_MAX_RETRY} 次仍未上线, 放弃 (等下次 online → offline 跳变再试)`);
        healthEvents.broadcast({
          type: "phone-reconnect-giveup",
          ts: Date.now(),
          wxId,
          name,
        });
        return;
      }
      // 安排下一次
      st2.timer = setTimeout(() => scheduleReconnect(wxId, name), RECONNECT_INTERVAL_MS);
    })
    .catch((e) => {
      _logger?.error(`[PhoneMonitor] reconnect 异常: ${e instanceof Error ? e.message : String(e)}`);
    });
}

/** 手机跳变 online → offline: 启动重连周期 */
function onJumpToOffline(wxId: string, name: string): void {
  // 清掉旧的 (理论上不会有, 但防御性)
  const old = reconnectState.get(wxId);
  if (old?.timer) clearTimeout(old.timer);
  reconnectState.set(wxId, { attempts: 0, timer: null, giveUp: false, name });
  // 立刻第一次尝试 (符合"最多 3 次, 间隔 30s" 的字面意思: 第一次不等)
  scheduleReconnect(wxId, name);
}

/** 手机跳变 offline → online: 重置重连计数 */
function onJumpToOnline(wxId: string, name: string, offlineDurationSec: number): void {
  const st = reconnectState.get(wxId);
  if (st?.timer) clearTimeout(st.timer);
  if (st && st.attempts > 0) {
    _logger?.info(`[PhoneMonitor] ${name}(${wxId}) 重连成功 (尝试 ${st.attempts} 次后恢复)`);
  }
  reconnectState.delete(wxId);
  healthEvents.broadcast({
    type: "phone-reconnected",
    ts: Date.now(),
    wxId,
    name,
    offlineDurationSec,
  });
}

async function tick(): Promise<void> {
  const phones = await queryPhones();
  if (!phones) return;
  const now = Date.now();
  for (const p of phones) {
    const prev = lastState.get(p.wxId);
    const newState = p.online ? "online" : "offline";

    if (!prev) {
      // 第一次看到, 不记事件, 只设基线
      lastState.set(p.wxId, { state: newState, sinceTs: now });
      continue;
    }

    if (prev.state !== newState) {
      const durationSec = Math.round((now - prev.sinceTs) / 1000);
      recordPhoneStatusEvent({
        wxId: p.wxId,
        name: p.name,
        fromState: prev.state,
        toState: newState,
        durationSec,
      });
      const icon = newState === "offline" ? "❌" : "✅";
      const msg = `[PhoneMonitor] ${icon} ${p.name}(${p.wxId}) ${prev.state} → ${newState} (上个状态持续 ${formatDuration(durationSec)})`;
      if (newState === "offline") _logger?.warn(msg);
      else _logger?.info(msg);
      lastState.set(p.wxId, { state: newState, sinceTs: now });

      // 跳变 hook: 离线 → 触发自动重连; 上线 → 重置 + 广播恢复
      if (newState === "offline") {
        healthEvents.broadcast({
          type: "phone-offline",
          ts: now,
          wxId: p.wxId,
          name: p.name,
        });
        onJumpToOffline(p.wxId, p.name);
      } else {
        onJumpToOnline(p.wxId, p.name, durationSec);
      }
    }
  }
}

function formatDuration(sec: number): string {
  if (sec < 60) return `${sec}s`;
  if (sec < 3600) return `${Math.round(sec / 60)}m`;
  return `${(sec / 3600).toFixed(1)}h`;
}

export function startPhoneMonitor(
  logger: { info: (m: string) => void; warn: (m: string) => void; error: (m: string) => void },
  intervalMs = 60_000,
): void {
  if (_interval) return;
  _logger = logger;
  logger.info(`[PhoneMonitor] 启动 (轮询间隔 ${intervalMs / 1000}s, 自动重连 max=${RECONNECT_MAX_RETRY} 间隔=${RECONNECT_INTERVAL_MS / 1000}s)`);
  // 立即跑一次, 然后定时
  tick().catch((e) => logger.error(`[PhoneMonitor] tick error: ${e.message}`));
  _interval = setInterval(() => {
    tick().catch((e) => logger.error(`[PhoneMonitor] tick error: ${e.message}`));
  }, intervalMs);
}

export function stopPhoneMonitor(): void {
  if (_interval) {
    clearInterval(_interval);
    _interval = null;
    _logger?.info("[PhoneMonitor] 已停止");
  }
  // 清掉所有挂起的重连定时器
  for (const st of reconnectState.values()) {
    if (st.timer) clearTimeout(st.timer);
  }
  reconnectState.clear();
}
