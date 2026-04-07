/**
 * 阶段 7.4: 定时任务调度器
 *
 * 对应原 Java TimingTaskService:
 *   - 每分钟查询数据库中待执行的任务
 *   - 到时间后发送对应指令给手机端
 *   - 标记任务为已完成
 *
 * 原系统用 Spring @Scheduled + MySQL，这里用 setInterval + SQLite。
 */

import {
  getPendingTasks,
  markTaskDone,
  type ScheduledTask,
} from "./storage-service.js";
import { sendToPhone } from "./send-helper.js";
import { EnumMsgType } from "../proto/codec.js";

let _timer: ReturnType<typeof setInterval> | null = null;

/**
 * 启动定时任务调度器
 * 每 60 秒检查一次待执行任务
 */
export function startScheduler(
  logger?: { info: (...a: unknown[]) => void; error: (...a: unknown[]) => void },
): void {
  const log = logger ?? { info: console.log, error: console.error };

  if (_timer) {
    log.info("[Scheduler] 调度器已在运行");
    return;
  }

  log.info("[Scheduler] 定时任务调度器已启动 (间隔=60秒)");

  _timer = setInterval(() => {
    try {
      executePendingTasks(log);
    } catch (err) {
      log.error(`[Scheduler] 执行异常: ${(err as Error).message}`);
    }
  }, 60_000); // 60秒

  // 启动时立即执行一次
  try {
    executePendingTasks(log);
  } catch {
    // 忽略首次执行错误
  }
}

/**
 * 停止定时任务调度器
 */
export function stopScheduler(): void {
  if (_timer) {
    clearInterval(_timer);
    _timer = null;
  }
}

/**
 * 执行所有到期的待处理任务
 *
 * 对应原 TimingTaskService.executeTask():
 *   1. 查询 execute_at <= now AND state = 1 的任务
 *   2. 解析 content (JSON payload)
 *   3. 通过 sendToPhone 发送指令
 *   4. 标记为已完成
 */
function executePendingTasks(
  log: { info: (...a: unknown[]) => void; error: (...a: unknown[]) => void },
): void {
  const tasks = getPendingTasks();
  if (tasks.length === 0) return;

  log.info(`[Scheduler] 发现 ${tasks.length} 个待执行任务`);

  for (const task of tasks) {
    try {
      executeTask(task, log);
      markTaskDone(task.id);
      log.info(`[Scheduler] 任务 ${task.id} 执行完成 (${task.taskType})`);
    } catch (err) {
      log.error(
        `[Scheduler] 任务 ${task.id} 执行失败: ${(err as Error).message}`,
      );
    }
  }
}

/**
 * 执行单个定时任务
 */
function executeTask(
  task: ScheduledTask,
  log: { info: (...a: unknown[]) => void; error: (...a: unknown[]) => void },
): void {
  // 解析 payload
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(task.content);
  } catch {
    log.error(`[Scheduler] 任务 ${task.id} payload解析失败`);
    return;
  }

  // 解析 MsgType
  const msgTypeName = task.msgType;
  const msgType = EnumMsgType[msgTypeName as keyof typeof EnumMsgType];

  if (msgType === undefined) {
    log.error(`[Scheduler] 任务 ${task.id} 未知消息类型: ${msgTypeName}`);
    return;
  }

  // 发送指令
  const result = sendToPhone(task.wxId, msgType, payload);
  if (!result.success) {
    log.error(`[Scheduler] 任务 ${task.id} 发送失败: ${result.error}`);
  }
}
