/**
 * 消息路由器 (生产级)
 *
 * 对应原 SocketMessageProcessor + WebSocketMessageProcessor
 *
 * WeWorkServer 发射 "message" 事件时 payload 已经是 DecodedMessage，
 * 本模块负责根据 msgType 分发到对应的处理函数。
 */

import { EventEmitter } from "node:events";
import { WebSocket } from "ws";
import * as net from "node:net";
import type { WeWorkServer } from "./websocket-service.js";
import type { DecodedMessage } from "../proto/codec.js";
import { EnumMsgType, decodeTransport } from "../proto/codec.js";

export interface InternalMessage extends DecodedMessage {
  source: net.Socket | WebSocket;
  protocol: "tcp" | "ws-binary" | "ws-json";
}

export type HandlerFn = (msg: InternalMessage) => void | Promise<void>;

export class MessageRouter extends EventEmitter {
  private handlers = new Map<number, HandlerFn>();
  private server: WeWorkServer;

  constructor(server: WeWorkServer) {
    super();
    this.server = server;
    this.bindEvents();
  }

  registerHandler(msgType: number, handler: HandlerFn): void {
    this.handlers.set(msgType, handler);
  }

  private bindEvents(): void {
    // Protobuf 消息 (TCP + WS Binary) — 已由 WeWorkServer 解码
    this.server.on("message", (conn: net.Socket | WebSocket, decoded: DecodedMessage) => {
      const meta = this.server.connections.getMeta(conn);
      const msg: InternalMessage = {
        ...decoded,
        source: conn,
        protocol: meta?.type === "tcp" ? "tcp" : "ws-binary",
      };
      this.dispatch(msg);
    });

    // JSON 消息 (WS Text) — PC 前端
    this.server.on("json-message", (conn: WebSocket, text: string) => {
      this.handleJsonMessage(conn, text);
    });
  }

  /**
   * 处理 PC 前端 JSON 消息
   * 对应原 WebSocketMessageProcessor.handler()
   */
  private handleJsonMessage(conn: WebSocket, text: string): void {
    try {
      const json = JSON.parse(text);
      const msgTypeName: string = json.MsgType;
      if (!msgTypeName) {
        this.server.sendJson(conn, { msgType: "Error", message: "MsgType消息类型传入错误" });
        return;
      }

      const contentStr = json.Content;
      if (!contentStr) {
        this.server.sendJson(conn, { msgType: "Error", message: "Content消息内容传入错误" });
        return;
      }

      const msgType: number | undefined = EnumMsgType[msgTypeName];
      if (msgType === undefined) {
        this.server.sendJson(conn, { msgType: "Error", message: `未知消息类型: ${msgTypeName}` });
        return;
      }

      const content = typeof contentStr === "string" ? JSON.parse(contentStr) : contentStr;

      const msg: InternalMessage = {
        id: json.Id ?? Date.now(),
        msgType,
        msgTypeName,
        accessToken: json.AccessToken ?? "",
        refMessageId: json.RefMessageId ?? 0,
        content,
        source: conn,
        protocol: "ws-json",
      };

      this.dispatch(msg);
    } catch (err) {
      this.server.sendJson(conn, { msgType: "Error", message: "参数传入错误" });
      this.emit("error", err);
    }
  }

  private dispatch(msg: InternalMessage): void {
    const handler = this.handlers.get(msg.msgType);
    if (handler) {
      try {
        const result = handler(msg);
        if (result instanceof Promise) result.catch((e) => this.emit("error", e));
      } catch (err) {
        this.emit("error", err);
      }
    } else {
      this.emit("unhandled", msg.msgType, msg.msgTypeName);
    }

    // 通用事件
    this.emit("message", msg);
    this.emit(`msg:${msg.msgTypeName}`, msg);
  }
}
