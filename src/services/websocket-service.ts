/**
 * WeWork 通信服务 (方案B: WS 客户端模式)
 *
 * 作为 WebSocket 客户端连接 Java 后端的 :15088 端口，
 * 使用与 PC 前端完全相同的 JSON 协议收发指令。
 *
 * 架构:
 *   手机SDK ←→ Java后端 (TCP:15087 Protobuf)
 *                  ↕
 *   PC前端  ←→ Java后端 (WS:15088 JSON)
 *                  ↕
 *   OpenClaw ←→ Java后端 (WS:15088 JSON)  ← 本模块
 *
 * JSON 协议 (与原 WebSocketMessageProcessor.java 一致):
 *   发送: { "MsgType": "TalkToFriendTask", "Content": { ... }, "AccessToken": "..." }
 *   接收: Java 后端通过 msgSend2pc() 推送事件 JSON
 */

import WebSocket from "ws";
import { EventEmitter } from "node:events";

// ============================================
// 配置
// ============================================

export interface WeWorkClientConfig {
  /** Java 后端 WebSocket 地址 */
  serverUrl: string;
  /** 重连间隔 (ms) */
  reconnectInterval?: number;
  /** 最大重连次数, 0=无限 */
  maxReconnects?: number;
}

// ============================================
// WS 客户端 (替代原来的 WeWorkServer)
// ============================================

export class WeWorkClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private config: WeWorkClientConfig;
  private reconnectCount = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private stopped = false;
  private _connected = false;

  constructor(config: WeWorkClientConfig) {
    super();
    this.config = {
      reconnectInterval: 5000,
      maxReconnects: 0,
      ...config,
    };
  }

  get connected(): boolean {
    return this._connected;
  }

  async start(): Promise<void> {
    this.stopped = false;
    this.connect();
  }

  private connect(): void {
    if (this.stopped) return;

    try {
      this.ws = new WebSocket(this.config.serverUrl);
    } catch (err) {
      this.emit("error", err);
      this.scheduleReconnect();
      return;
    }

    this.ws.on("open", () => {
      this._connected = true;
      this.reconnectCount = 0;
      this.emit("connected");
      this.emit("log", `已连接 Java 后端: ${this.config.serverUrl}`);
    });

    this.ws.on("message", (data, isBinary) => {
      if (isBinary) return; // 忽略二进制帧
      try {
        const text = data.toString();
        const json = JSON.parse(text);
        this.emit("json-message", json);
      } catch (err) {
        this.emit("parse-error", err);
      }
    });

    this.ws.on("close", () => {
      this._connected = false;
      this.emit("disconnected");
      this.emit("log", "与 Java 后端断开连接");
      this.scheduleReconnect();
    });

    this.ws.on("error", (err) => {
      this._connected = false;
      this.emit("error", err);
    });
  }

  private scheduleReconnect(): void {
    if (this.stopped) return;
    if (this.config.maxReconnects! > 0 && this.reconnectCount >= this.config.maxReconnects!) {
      this.emit("log", `已达最大重连次数 (${this.config.maxReconnects}), 停止重连`);
      return;
    }

    this.reconnectCount++;
    const delay = this.config.reconnectInterval!;
    this.emit("log", `${delay / 1000}s 后重连 (第 ${this.reconnectCount} 次)...`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  /**
   * 发送 JSON 指令给 Java 后端
   * 协议格式与 PC 前端完全一致:
   * { "MsgType": "TalkToFriendTask", "Content": { "WxId": 12345, ... } }
   */
  sendCommand(msgType: string, content: Record<string, unknown>): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    const packet = JSON.stringify({
      MsgType: msgType,
      Content: JSON.stringify(content),
    });

    try {
      this.ws.send(packet);
      return true;
    } catch {
      return false;
    }
  }

  async stop(): Promise<void> {
    this.stopped = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.removeAllListeners();
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.close();
      }
      this.ws = null;
    }
    this._connected = false;
    this.emit("log", "WS 客户端已停止");
  }
}

// ============================================
// 单例
// ============================================

let _instance: WeWorkClient | null = null;

export function getWeWorkClient(config?: WeWorkClientConfig): WeWorkClient {
  if (!_instance && config) {
    _instance = new WeWorkClient(config);
  }
  return _instance!;
}

// 向下兼容: 保留 getWeWorkServer 别名
export const getWeWorkServer = getWeWorkClient;
