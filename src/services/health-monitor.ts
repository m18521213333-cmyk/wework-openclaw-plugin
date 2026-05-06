/**
 * 系统健康监控 (后台 60s 轮询)
 *
 * 检查项:
 *  - Java :15088 WS 连接 (从 getWeWorkClient().connected 读)
 *  - Redis ping (redis-cli, 从 application.properties 读 host/port/password)
 *  - MySQL ping (mysql -e 'SELECT 1', 从 application.properties 读 user/password)
 *
 * 任何一项从 up → down / down → up 跳变时:
 *  - healthEvents 广播 java-down/java-up / redis-down/redis-up / mysql-down/mysql-up
 *  - 打日志
 *
 * 不持久化跳变历史 (跟 phone-monitor 不同), 历史看 journalctl.
 * 仅在 service 进程跑 (跟 PhoneMonitor 一样, 启动注入 logger).
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import * as fs from "node:fs";
import { healthEvents } from "./health-events.js";
import { getWeWorkClient } from "./websocket-service.js";

const execFileAsync = promisify(execFile);

type Logger = { info: (m: string) => void; warn: (m: string) => void; error: (m: string) => void };

const PROPS_PATH = "/opt/wework/wework-server/src/main/resources/application.properties";

interface CheckState {
  up: boolean;
  reason: string;
}
const lastJava: CheckState = { up: true, reason: "" };
const lastRedis: CheckState = { up: true, reason: "" };
const lastMysql: CheckState = { up: true, reason: "" };
let _bootstrapped = false; // 第一次 tick 不广播 (只设基线)

let _interval: NodeJS.Timeout | null = null;
let _logger: Logger | null = null;

/** 读 application.properties, 失败返 null */
function readProps(): string | null {
  try {
    if (!fs.existsSync(PROPS_PATH)) return null;
    return fs.readFileSync(PROPS_PATH, "utf8");
  } catch {
    return null;
  }
}

/** 检查 Java WS 连接状态 — 直接读 plugin 自己持有的 WS 客户端 */
function checkJava(): { up: boolean; reason: string } {
  try {
    // getWeWorkClient(undefined) 会返 null! (truly null), 读 .connected 会爆
    // 这里用 try 兜住; 如果连 client 都没初始化, 当 down
    const client = getWeWorkClient() as { connected: boolean } | null;
    if (!client) return { up: false, reason: "WeWorkClient 未初始化" };
    return client.connected
      ? { up: true, reason: "" }
      : { up: false, reason: "WS 未连接 Java :15088" };
  } catch (e) {
    return { up: false, reason: e instanceof Error ? e.message : String(e) };
  }
}

/** 检查 Redis ping (5s timeout). 没装 redis-cli 时跳过 (返 up=true 不告警) */
async function checkRedis(): Promise<{ up: boolean; reason: string }> {
  const props = readProps();
  if (!props) return { up: true, reason: "" }; // 拿不到配置就当 ok 不打扰
  const host = props.match(/^spring\.redis\.host=(.+)$/m)?.[1]?.trim() ?? "127.0.0.1";
  const port = props.match(/^spring\.redis\.port=(.+)$/m)?.[1]?.trim() ?? "6379";
  const pass = props.match(/^spring\.redis\.password=(.+)$/m)?.[1]?.trim() ?? "";
  try {
    const args = ["-h", host, "-p", port];
    if (pass) args.push("-a", pass, "--no-auth-warning");
    args.push("PING");
    const { stdout } = await execFileAsync("redis-cli", args, {
      encoding: "utf8",
      timeout: 5_000,
    });
    if (stdout.trim().toUpperCase() === "PONG") return { up: true, reason: "" };
    return { up: false, reason: `redis-cli 返回 '${stdout.trim().slice(0, 100)}'` };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    // ENOENT = redis-cli 没装, 当 ok 跳过
    if (/ENOENT/.test(msg)) return { up: true, reason: "" };
    return { up: false, reason: msg.slice(0, 200) };
  }
}

/** 检查 MySQL ping (SELECT 1) */
async function checkMysql(): Promise<{ up: boolean; reason: string }> {
  const props = readProps();
  if (!props) return { up: true, reason: "" };
  const dbUser = props.match(/^spring\.datasource\.username=(.+)$/m)?.[1]?.trim() ?? "wework";
  const dbPass = props.match(/^spring\.datasource\.password=(.+)$/m)?.[1]?.trim() ?? "";
  const dbName = props.match(/jdbc:mysql:\/\/[^/]+\/([^?]+)/)?.[1] ?? "workchat";
  if (!dbPass) return { up: true, reason: "" };
  try {
    const { stdout } = await execFileAsync(
      "mysql",
      ["-u", dbUser, "-N", "-B", dbName, "-e", "SELECT 1;"],
      { env: { ...process.env, MYSQL_PWD: dbPass }, encoding: "utf8", timeout: 5_000 },
    );
    if (stdout.trim() === "1") return { up: true, reason: "" };
    return { up: false, reason: `mysql 返回 '${stdout.trim().slice(0, 100)}'` };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/ENOENT/.test(msg)) return { up: true, reason: "" };
    return { up: false, reason: msg.slice(0, 200) };
  }
}

/** 跳变检测 + 事件广播通用逻辑 */
function reconcile(
  prev: CheckState,
  cur: { up: boolean; reason: string },
  downType: "java-down" | "redis-down" | "mysql-down",
  upType: "java-up" | "redis-up" | "mysql-up",
  label: string,
): void {
  if (prev.up === cur.up) {
    // 无跳变 — 只更新最新 reason 描述, 不重发事件
    prev.reason = cur.reason;
    return;
  }
  prev.up = cur.up;
  prev.reason = cur.reason;
  const ts = Date.now();
  if (!cur.up) {
    _logger?.warn(`[HealthMonitor] ❌ ${label} DOWN: ${cur.reason}`);
    if (downType === "java-down") {
      healthEvents.broadcast({ type: "java-down", ts, reason: cur.reason });
    } else if (downType === "redis-down") {
      healthEvents.broadcast({ type: "redis-down", ts, reason: cur.reason });
    } else {
      healthEvents.broadcast({ type: "mysql-down", ts, reason: cur.reason });
    }
  } else {
    _logger?.info(`[HealthMonitor] ✅ ${label} UP`);
    if (upType === "java-up") {
      healthEvents.broadcast({ type: "java-up", ts });
    } else if (upType === "redis-up") {
      healthEvents.broadcast({ type: "redis-up", ts });
    } else {
      healthEvents.broadcast({ type: "mysql-up", ts });
    }
  }
}

async function tick(): Promise<void> {
  const java = checkJava();
  const [redis, mysql] = await Promise.all([checkRedis(), checkMysql()]);

  if (!_bootstrapped) {
    // 第一次 tick: 只设基线, 不发"刚启动就 down"的告警 (会刷屏)
    lastJava.up = java.up;
    lastJava.reason = java.reason;
    lastRedis.up = redis.up;
    lastRedis.reason = redis.reason;
    lastMysql.up = mysql.up;
    lastMysql.reason = mysql.reason;
    _bootstrapped = true;
    if (!java.up) _logger?.warn(`[HealthMonitor] 启动基线: Java DOWN (${java.reason})`);
    if (!redis.up) _logger?.warn(`[HealthMonitor] 启动基线: Redis DOWN (${redis.reason})`);
    if (!mysql.up) _logger?.warn(`[HealthMonitor] 启动基线: MySQL DOWN (${mysql.reason})`);
    return;
  }

  reconcile(lastJava, java, "java-down", "java-up", "Java WS");
  reconcile(lastRedis, redis, "redis-down", "redis-up", "Redis");
  reconcile(lastMysql, mysql, "mysql-down", "mysql-up", "MySQL");
}

export function startHealthMonitor(logger: Logger, intervalMs = 60_000): void {
  if (_interval) return;
  _logger = logger;
  logger.info(`[HealthMonitor] 启动 (轮询间隔 ${intervalMs / 1000}s, 检查 Java WS / Redis / MySQL)`);
  tick().catch((e) => logger.error(`[HealthMonitor] tick error: ${e instanceof Error ? e.message : String(e)}`));
  _interval = setInterval(() => {
    tick().catch((e) => logger.error(`[HealthMonitor] tick error: ${e instanceof Error ? e.message : String(e)}`));
  }, intervalMs);
}

export function stopHealthMonitor(): void {
  if (_interval) {
    clearInterval(_interval);
    _interval = null;
    _logger?.info("[HealthMonitor] 已停止");
  }
  _bootstrapped = false;
}
