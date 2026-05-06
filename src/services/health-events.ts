/**
 * 健康事件总线 (内存单例 EventEmitter)
 *
 * 用途:
 *  - phone-monitor / health-monitor 检测到状态跳变时 emit 事件
 *  - agent-backend 的 SSE 路由订阅这些事件, 推给前端 toast
 *
 * 设计:
 *  - 进程内广播, 不持久化 (前端连上后只看新事件; 历史看 phone_status_events 表)
 *  - 监听器基本都是 SSE 长连接, 数量可观, 主动调高 maxListeners 防 warning
 *  - 事件 payload 都带 ts (毫秒) + 必要业务字段
 */

import { EventEmitter } from "node:events";

/** 手机离线 — 跳变 online → offline 时触发 */
export interface PhoneOfflineEvent {
  type: "phone-offline";
  ts: number;
  wxId: string;
  name: string;
}

/** 手机重连成功 — 跳变 offline → online 时触发 (含手动恢复 / 自动重连) */
export interface PhoneReconnectedEvent {
  type: "phone-reconnected";
  ts: number;
  wxId: string;
  name: string;
  /** 离线持续秒数 (从 jump 到 offline 起算) */
  offlineDurationSec: number;
}

/** Java WS 后端断开 */
export interface JavaDownEvent {
  type: "java-down";
  ts: number;
  /** 失败原因 (例: WS not connected / Java HTTP 端口探测失败) */
  reason: string;
}

/** Java WS 后端恢复 */
export interface JavaUpEvent {
  type: "java-up";
  ts: number;
}

/** Redis ping 失败 */
export interface RedisDownEvent {
  type: "redis-down";
  ts: number;
  reason: string;
}

/** Redis 恢复 */
export interface RedisUpEvent {
  type: "redis-up";
  ts: number;
}

/** MySQL ping 失败 */
export interface MysqlDownEvent {
  type: "mysql-down";
  ts: number;
  reason: string;
}

/** MySQL 恢复 */
export interface MysqlUpEvent {
  type: "mysql-up";
  ts: number;
}

/** 自动重连尝试 (info, 让前端可见 retry 进度) */
export interface PhoneReconnectAttemptEvent {
  type: "phone-reconnect-attempt";
  ts: number;
  wxId: string;
  name: string;
  /** 第几次尝试 (1..maxRetry) */
  attempt: number;
  maxRetry: number;
}

/** 自动重连放弃 — 超过 maxRetry 仍然 offline */
export interface PhoneReconnectGiveUpEvent {
  type: "phone-reconnect-giveup";
  ts: number;
  wxId: string;
  name: string;
}

export type HealthEvent =
  | PhoneOfflineEvent
  | PhoneReconnectedEvent
  | JavaDownEvent
  | JavaUpEvent
  | RedisDownEvent
  | RedisUpEvent
  | MysqlDownEvent
  | MysqlUpEvent
  | PhoneReconnectAttemptEvent
  | PhoneReconnectGiveUpEvent;

export type HealthEventName = HealthEvent["type"];

/**
 * 单例 EventEmitter — 任何模块 import 拿到的都是同一个 bus.
 * 监听 'event' 拿全部事件, 或监听具体 type 拿单种.
 */
class HealthEventBus extends EventEmitter {
  constructor() {
    super();
    // SSE 长连接可能有多客户端 + 内部模块订阅, 默认 10 太紧
    this.setMaxListeners(50);
  }

  /** 广播事件 — 同时按类型 emit 和按通用 'event' emit */
  broadcast(ev: HealthEvent): void {
    this.emit(ev.type, ev);
    this.emit("event", ev);
  }
}

export const healthEvents = new HealthEventBus();
