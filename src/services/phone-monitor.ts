/**
 * 手机 SDK 在线状态监控 (后台轮询)
 *
 * 每 60s 查 Java MySQL tbl_wx_accountinfo.isonline, 状态变化时:
 *  - 落 SQLite phone_status_events 表
 *  - 打日志 (journalctl 可见)
 *  - (未来) 触发钉钉/微信告警 webhook
 *
 * 仅在 systemd-managed openclaw-scrm.service 里跑 (有 WEWORK_PLUGIN_ENABLE=1).
 * CLI / agent 进程不跑这个轮询.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import * as fs from "node:fs";
import { recordPhoneStatusEvent } from "./storage-service.js";

const execFileAsync = promisify(execFile);

interface PhoneRow {
  wxId: string;
  name: string;
  online: boolean;
}

// 上次见到的状态 + 那个状态从什么时候开始 (用来算 duration)
const lastState = new Map<string, { state: "online" | "offline"; sinceTs: number }>();

let _interval: NodeJS.Timeout | null = null;
let _logger: { info: (m: string) => void; warn: (m: string) => void; error: (m: string) => void } | null = null;

async function queryPhones(): Promise<PhoneRow[] | null> {
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
  logger.info(`[PhoneMonitor] 启动 (轮询间隔 ${intervalMs / 1000}s)`);
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
}
