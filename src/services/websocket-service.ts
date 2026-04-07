/**
 * WeWork 通信服务 (生产级)
 *
 * 完全兼容原手机端 SDK 的二进制协议:
 *   TCP Socket (端口 15087): 4字节大端长度头 + Protobuf TransportMessage body
 *   WebSocket  (端口 15088): JSON 文本协议 (兼容原 PC 前端)
 *
 * 对应原 Java:
 *   SocketServer.java       → startTcpServer()
 *   WebSocketServer.java    → startWebSocketServer()
 *   NettyConnectionUtil.java → ConnectionManager
 *   SelfDecoder/SelfEncoder  → 在 proto/codec.ts 中实现
 */

import { WebSocketServer, WebSocket, RawData } from "ws";
import * as net from "node:net";
import { EventEmitter } from "node:events";
import {
  decodeTransport,
  encodePacket,
  encodeAck,
  encodeError,
  EnumMsgType,
  EnumErrorCode,
  type DecodedMessage,
} from "../proto/codec.js";

// ============================================
// 连接管理器 (替代 NettyConnectionUtil)
// ============================================

export interface ConnectionMeta {
  wxId: string;
  deviceId: string;
  connectedAt: Date;
  lastHeartbeat: Date;
  /** 连接类型 */
  type: "tcp" | "ws";
}

export class ConnectionManager {
  private deviceConns = new Map<string, net.Socket | WebSocket>();
  private userConns = new Map<string, net.Socket | WebSocket>();
  private meta = new Map<net.Socket | WebSocket, ConnectionMeta>();

  registerDevice(deviceId: string, conn: net.Socket | WebSocket): void {
    const old = this.deviceConns.get(deviceId);
    if (old && old !== conn) this.removeConnection(old);
    this.deviceConns.set(deviceId, conn);
    const m = this.meta.get(conn);
    if (m) m.deviceId = deviceId;
  }

  registerUser(wxId: string, conn: net.Socket | WebSocket): void {
    const old = this.userConns.get(wxId);
    if (old && old !== conn) {
      this.userConns.delete(wxId);
    }
    this.userConns.set(wxId, conn);
    const m = this.meta.get(conn);
    if (m) m.wxId = wxId;
  }

  getByUserId(wxId: string): net.Socket | WebSocket | undefined {
    return this.userConns.get(wxId);
  }

  getByDeviceId(deviceId: string): net.Socket | WebSocket | undefined {
    return this.deviceConns.get(deviceId);
  }

  getMeta(conn: net.Socket | WebSocket): ConnectionMeta | undefined {
    return this.meta.get(conn);
  }

  initConnection(conn: net.Socket | WebSocket, type: "tcp" | "ws"): void {
    this.meta.set(conn, {
      wxId: "",
      deviceId: "",
      connectedAt: new Date(),
      lastHeartbeat: new Date(),
      type,
    });
  }

  updateHeartbeat(conn: net.Socket | WebSocket): void {
    const m = this.meta.get(conn);
    if (m) m.lastHeartbeat = new Date();
  }

  removeConnection(conn: net.Socket | WebSocket): void {
    const m = this.meta.get(conn);
    if (m) {
      if (m.deviceId) this.deviceConns.delete(m.deviceId);
      if (m.wxId) this.userConns.delete(m.wxId);
      this.meta.delete(conn);
    }
  }

  getOnlineUsers(): { wxId: string; deviceId: string; type: string; connectedAt: Date }[] {
    const result: { wxId: string; deviceId: string; type: string; connectedAt: Date }[] = [];
    for (const [wxId, conn] of this.userConns) {
      const m = this.meta.get(conn);
      if (m) result.push({ wxId, deviceId: m.deviceId, type: m.type, connectedAt: m.connectedAt });
    }
    return result;
  }

  get deviceCount(): number { return this.deviceConns.size; }
  get userCount(): number { return this.userConns.size; }

  closeAll(): void {
    for (const conn of this.meta.keys()) {
      try {
        if (conn instanceof WebSocket) conn.close();
        else (conn as net.Socket).destroy();
      } catch { /* ignore */ }
    }
    this.deviceConns.clear();
    this.userConns.clear();
    this.meta.clear();
  }
}

// ============================================
// 服务器
// ============================================

export interface WeWorkServerConfig {
  /** TCP Socket 端口 (手机端 SDK) */
  port: number;
  /** WebSocket 端口 (PC 前端), 默认 port+1 */
  wsPort?: number;
  host: string;
}

export class WeWorkServer extends EventEmitter {
  private tcpServer: net.Server | null = null;
  private wsServer: WebSocketServer | null = null;
  readonly connections = new ConnectionManager();
  private config: WeWorkServerConfig;

  constructor(config: WeWorkServerConfig) {
    super();
    this.config = config;
  }

  async start(): Promise<void> {
    await this.startTcpServer();
    await this.startWebSocketServer();
  }

  // --------------------------------------------------
  // TCP Socket 服务 (手机端 SDK, Protobuf 二进制)
  // 与原 SocketServer.java 完全一致
  // --------------------------------------------------
  private startTcpServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      const port = this.config.port;

      this.tcpServer = net.createServer((socket) => {
        this.connections.initConnection(socket, "tcp");
        let buffer = Buffer.alloc(0);

        socket.on("data", (data: Buffer) => {
          buffer = Buffer.concat([buffer, data]);

          // 循环解包 — 与原 SelfDecoder.decode() 完全一致
          while (buffer.length > 4) {
            const bodyLength = buffer.readUInt32BE(0);
            if (buffer.length < 4 + bodyLength) break; // 数据不完整

            const body = buffer.subarray(4, 4 + bodyLength);
            buffer = buffer.subarray(4 + bodyLength);

            try {
              const decoded = decodeTransport(body);
              this.emit("message", socket, decoded);
            } catch (err) {
              this.emit("decode-error", socket, err);
            }
          }
        });

        socket.on("close", () => {
          this.emit("connection-closed", socket);
          this.connections.removeConnection(socket);
        });

        socket.on("error", (err) => {
          this.emit("connection-error", socket, err);
          this.connections.removeConnection(socket);
        });
      });

      this.tcpServer.listen(port, this.config.host, () => {
        this.emit("log", `TCP Socket 服务启动: ${this.config.host}:${port} (手机端SDK)`);
        resolve();
      });
      this.tcpServer.on("error", reject);
    });
  }

  // --------------------------------------------------
  // WebSocket 服务 (PC 前端, JSON 文本)
  // 与原 WebSocketServer.java 完全一致
  // --------------------------------------------------
  private startWebSocketServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsPort = this.config.wsPort ?? this.config.port + 1;

      this.wsServer = new WebSocketServer({ port: wsPort, host: this.config.host });

      this.wsServer.on("connection", (ws) => {
        this.connections.initConnection(ws, "ws");

        ws.on("message", (data: RawData, isBinary: boolean) => {
          if (isBinary) {
            // 二进制帧 → 当作 Protobuf (无4字节头，WebSocket自带帧长度)
            const buf = data instanceof Buffer ? data : Buffer.from(data as ArrayBuffer);
            try {
              const decoded = decodeTransport(buf);
              this.emit("message", ws, decoded);
            } catch (err) {
              this.emit("decode-error", ws, err);
            }
          } else {
            // 文本帧 → JSON 协议 (兼容原 PC 前端)
            this.emit("json-message", ws, data.toString());
          }
        });

        ws.on("close", () => {
          this.emit("connection-closed", ws);
          this.connections.removeConnection(ws);
        });

        ws.on("error", (err) => {
          this.emit("connection-error", ws, err);
          this.connections.removeConnection(ws);
        });
      });

      this.wsServer.on("listening", () => {
        this.emit("log", `WebSocket 服务启动: ${this.config.host}:${wsPort} (PC前端)`);
        resolve();
      });
      this.wsServer.on("error", reject);
    });
  }

  // --------------------------------------------------
  // 发送 Protobuf 消息给手机端 (通过 wxId 查找连接)
  // 对应原 AsyncTaskService.msgSend2Phone() + MessageUtil.sendMsg()
  // --------------------------------------------------
  sendToDevice(
    wxId: string,
    msgType: number,
    payload: Record<string, unknown>,
    accessToken?: string,
    refId?: number,
  ): boolean {
    const conn = this.connections.getByUserId(wxId);
    if (!conn) return false;

    const packet = encodePacket(msgType, payload, accessToken, refId);
    return this.sendRaw(conn, packet);
  }

  /**
   * 发送 ACK 给连接
   * 对应原 MessageUtil.sendMsg(ctx, MsgReceivedAck, token, refId, null)
   */
  sendAck(conn: net.Socket | WebSocket, accessToken: string, refId: number): void {
    const packet = encodeAck(accessToken, refId);
    this.sendRaw(conn, packet);
  }

  /**
   * 发送错误消息给连接
   */
  sendError(conn: net.Socket | WebSocket, errorCode: number, errorMsg: string, refId?: number): void {
    const packet = encodeError(errorCode, errorMsg, refId);
    this.sendRaw(conn, packet);
  }

  /**
   * 发送 JSON 消息给 WebSocket 连接 (PC 前端)
   * 对应原 MessageUtil.sendJsonMsg()
   */
  sendJson(conn: WebSocket, payload: Record<string, unknown>): void {
    if (conn.readyState === WebSocket.OPEN) {
      conn.send(JSON.stringify(payload));
    }
  }

  /**
   * 底层发送: 自动判断连接类型
   */
  private sendRaw(conn: net.Socket | WebSocket, packet: Buffer): boolean {
    try {
      if (conn instanceof WebSocket) {
        if (conn.readyState === WebSocket.OPEN) {
          // WebSocket 发二进制帧 (不含4字节头, WS自带帧长)
          conn.send(packet.subarray(4)); // 去掉4字节头
          return true;
        }
      } else {
        // TCP Socket 发完整包 (含4字节头)
        (conn as net.Socket).write(packet);
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }

  // --------------------------------------------------
  // 停止
  // --------------------------------------------------
  async stop(): Promise<void> {
    this.connections.closeAll();
    if (this.wsServer) {
      await new Promise<void>((r) => this.wsServer!.close(() => r()));
      this.wsServer = null;
    }
    if (this.tcpServer) {
      await new Promise<void>((r) => this.tcpServer!.close(() => r()));
      this.tcpServer = null;
    }
    this.emit("log", "通信服务已停止");
  }
}

// 单例
let _instance: WeWorkServer | null = null;

export function getWeWorkServer(config?: WeWorkServerConfig): WeWorkServer {
  if (!_instance && config) {
    _instance = new WeWorkServer(config);
  }
  return _instance!;
}
