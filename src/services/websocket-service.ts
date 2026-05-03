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
  /**
   * 认证信息. Java 后端的 msgSend2pc() 只对认证过的连接推送,
   * 不发认证的连接拿不到任何 FriendTalkNotice / WwOnlineNotice 等业务消息.
   * 协议: { MsgType:"DeviceAuthReq", Content:'{"AuthType":2,"Credential":"<base64(user:pwd)>"}' }
   *   AuthType=2 = Username (PC端账号密码)
   *   AuthType=3 = InternalCode (走IP白名单, Credential可空)
   * 默认 AuthType=2; 留空 username 则跳过认证 (拿不到推送).
   */
  authType?: 2 | 3;
  username?: string;
  password?: string;
}

// ============================================
// WS 客户端 (替代原来的 WeWorkServer)
// ============================================

export class WeWorkClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private config: WeWorkClientConfig;
  private reconnectCount = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private heartbeatId = 0;
  private accessToken = "";
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

      // 认证 + 立即启动心跳
      // (Java 后端不显式回 DeviceAuthRsp; 客户端自己生成 AccessToken, 心跳每 3s 带上)
      const authType = this.config.authType ?? 2;
      let didAuth = false;
      if (authType === 2 && this.config.username) {
        const cred = Buffer.from(
          `${this.config.username}:${this.config.password ?? ""}`,
        ).toString("base64");
        // 注意 Content 是 JSON **对象** 不是字符串 — 跟 PC 前端 deviceAuthReq() 一致.
        // 字符串会让 Java 端 JsonFormat.merge 抛异常 → builder 字段为空 → 后续判 token 失败.
        this.ws!.send(JSON.stringify({
          Id: 1010,
          AccessToken: "",
          MsgType: "DeviceAuthReq",
          Content: { AuthType: 2, Credential: cred },
        }));
        this.emit("log", `已发认证 (Username=${this.config.username})`);
        didAuth = true;
      } else if (authType === 3) {
        this.ws!.send(JSON.stringify({
          Id: 1010,
          AccessToken: "",
          MsgType: "DeviceAuthReq",
          Content: { AuthType: 3, Credential: "" },
        }));
        this.emit("log", "已发认证 (InternalCode)");
        didAuth = true;
      } else {
        this.emit("log", "⚠ 未配置认证, Java 后端不会推送业务消息");
      }

      // 不在 open 后立即启动心跳! 等 DeviceAuthRsp 回来拿到真实 token 再 startHeartbeat.
      // (源码 HeartBeatReqWebsocketHandler 校验 vo.getAccessToken().equals(getNettyId(ctx)))

      this.emit("connected");
      this.emit("log", `已连接 Java 后端: ${this.config.serverUrl}`);
    });

    this.ws.on("message", (data, isBinary) => {
      if (isBinary) return; // PC WS 协议都是 text, 忽略 binary
      try {
        const text = data.toString();
        const json = JSON.parse(text);


        // 监听 DeviceAuthRsp 拿 Java 分配的 AccessToken (= nettyId).
        // 心跳必须用这个 token; 不对就被判 "token过期" → close.
        // 注意: Java 发给客户端的 JSON 字段是**小写开头** (msgType/accessToken/message),
        //       客户端发给 Java 的字段是大写开头 (MsgType/AccessToken/Content).
        //       真实 token 在 message 字段里 (是序列化的 DeviceAuthRsp protobuf JSON).
        const incomingMsgType = json?.msgType ?? json?.MsgType;
        if (incomingMsgType === "DeviceAuthRsp") {
          let inner: any = json.message ?? json.Message ?? json.Content;
          if (typeof inner === "string") {
            try { inner = JSON.parse(inner); } catch {}
          }
          const token = inner?.AccessToken ?? inner?.accessToken ?? json.accessToken;
          if (token) {
            this.accessToken = String(token);
            this.emit("log", `认证成功, 服务端 AccessToken=${this.accessToken}, 启动 3s 心跳`);
            this.startHeartbeat();
          } else {
            this.emit("log", `[Auth] 收到 DeviceAuthRsp 但没找到 AccessToken: ${JSON.stringify(json).slice(0, 200)}`);
          }
        }

        this.emit("json-message", json);
      } catch (err) {
        this.emit("parse-error", err);
      }
    });

    this.ws.on("close", () => {
      this._connected = false;
      this.stopHeartbeat();
      this.accessToken = "";
      this.emit("disconnected");
      this.emit("log", "与 Java 后端断开连接");
      this.scheduleReconnect();
    });

    this.ws.on("error", (err) => {
      this._connected = false;
      this.emit("error", err);
    });
  }

  /** 启动 3s 心跳, 跟 PC 端协议一致. Java 端 5s 不见心跳就 kick. */
  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
      this.heartbeatId++;
      try {
        // Content 是 JSON **对象** {} 不是字符串 "{}" — 跟前端 heartBeatReq() 一致.
        // 字符串会让 Java 端 JsonFormat.merge 抛异常 → vo.AccessToken 为空 → token 校验失败被踢.
        this.ws.send(JSON.stringify({
          Id: this.heartbeatId,
          MsgType: "HeartBeatReq",
          AccessToken: this.accessToken,
          Content: {},
        }));
      } catch (err) {
        this.emit("error", err);
      }
    }, 3000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
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
      ...(this.accessToken ? { AccessToken: this.accessToken } : {}),
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
    this.stopHeartbeat();
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
