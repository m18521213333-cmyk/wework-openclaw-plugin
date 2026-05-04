#!/usr/bin/env node
/**
 * WeWork SCRM MCP Server (stdio)
 *
 * 把 wework CLI 命令暴露成 MCP tools, 让 OpenClaw agent (LLM) 可以通过
 * 自然语言调用它们.
 *
 * 注册到 OpenClaw:
 *   openclaw mcp set wework '{"command":"node","args":["/root/.openclaw/extensions/wework-scrm/dist/mcp-server.js"]}'
 *
 * 然后 agent 自然语言:
 *   openclaw agent -m "给孟伟发条消息: 周末愉快"
 * → LLM 自动调 wework_send_message tool → spawn `wework send ...`
 *
 * 这层只是个 MCP wrapper, 真正业务逻辑还是在 systemd-managed
 * openclaw-scrm.service 里 (它有 WS 长连接到 Java + WEWORK_PLUGIN_ENABLE=1).
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const WEWORK_BIN = process.env.WEWORK_BIN || "/usr/local/bin/wework";

/** 跑一条 wework CLI, 返回 stdout */
async function runWework(args: string[], timeoutMs = 30_000): Promise<string> {
  const { stdout, stderr } = await execFileAsync(WEWORK_BIN, args, {
    timeout: timeoutMs,
    encoding: "utf8",
    maxBuffer: 5 * 1024 * 1024,
  });
  return (stdout + (stderr ? `\n[stderr]\n${stderr}` : "")).trim();
}

/** MCP tool 定义 — name 必须跟 OpenClaw agent 调用时一致 */
const TOOLS = [
  {
    name: "wework_send_message",
    description: "给企业微信会话发文本消息. convId 可以是单聊 RemoteId 或群 ConvId.",
    inputSchema: {
      type: "object",
      properties: {
        wxId: { type: "string", description: "企业微信账号 wxId (例 1688852285335663)" },
        convId: { type: "string", description: "会话 ID (单聊客户 RemoteId 或群 ConvId)" },
        message: { type: "string", description: "消息内容" },
      },
      required: ["wxId", "convId", "message"],
    },
    runArgs: (a: any) => ["send", a.wxId, a.convId, a.message],
  },
  {
    name: "wework_send_image",
    description: "上传本地图片并发给企业微信会话 (一条龙: upload + send).",
    inputSchema: {
      type: "object",
      properties: {
        wxId: { type: "string" },
        convId: { type: "string" },
        localPath: { type: "string", description: "服务器上图片绝对路径" },
      },
      required: ["wxId", "convId", "localPath"],
    },
    runArgs: (a: any) => ["send-image", a.wxId, a.convId, a.localPath],
  },
  {
    name: "wework_mass_send",
    description: "群发文本消息到多个会话.",
    inputSchema: {
      type: "object",
      properties: {
        wxId: { type: "string" },
        message: { type: "string" },
        convIds: { type: "array", items: { type: "string" }, description: "目标 convId 列表" },
      },
      required: ["wxId", "message", "convIds"],
    },
    runArgs: (a: any) => ["mass-send", a.wxId, a.message, "--to", ...a.convIds],
  },
  {
    name: "wework_post_moments",
    description: "发朋友圈 (纯文本/带图/带链接).",
    inputSchema: {
      type: "object",
      properties: {
        wxId: { type: "string" },
        content: { type: "string", description: "朋友圈文案" },
        type: { type: "string", enum: ["text", "image", "link"], description: "类型, 默认 text" },
        media: { type: "array", items: { type: "string" }, description: "图片 URL 数组 (type=image 时)" },
      },
      required: ["wxId", "content"],
    },
    runArgs: (a: any) => {
      const args = ["moments", a.wxId, a.content];
      if (a.type) args.push("--type", a.type);
      if (a.media?.length) args.push("--media", ...a.media);
      return args;
    },
  },
  {
    name: "wework_create_group",
    description: "建群 + 拉成员 + 设群名 + (可选)加群后自动发欢迎消息.",
    inputSchema: {
      type: "object",
      properties: {
        wxId: { type: "string" },
        members: { type: "array", items: { type: "string" }, description: "客户 RemoteId 列表" },
        groupName: { type: "string", description: "群名" },
        welcome: { type: "string", description: "(可选) 加群后自动发的欢迎消息" },
      },
      required: ["wxId", "members", "groupName"],
    },
    runArgs: (a: any) => {
      const args = ["group", a.wxId, "create", "--members", ...a.members, "--content", a.groupName];
      if (a.welcome) args.push("--send-after", a.welcome);
      return args;
    },
  },
  {
    name: "wework_get_history",
    description: "拉取某个会话的历史消息记录.",
    inputSchema: {
      type: "object",
      properties: {
        wxId: { type: "string" },
        convId: { type: "string" },
        n: { type: "number", description: "条数, 默认 10", default: 10 },
      },
      required: ["wxId", "convId"],
    },
    runArgs: (a: any) => ["history", a.wxId, a.convId, "-n", String(a.n ?? 10)],
  },
  {
    name: "wework_search_messages",
    description: "在历史消息中按关键字搜索.",
    inputSchema: {
      type: "object",
      properties: {
        wxId: { type: "string" },
        keyword: { type: "string" },
      },
      required: ["wxId", "keyword"],
    },
    runArgs: (a: any) => ["search", a.wxId, a.keyword],
  },
  {
    name: "wework_status",
    description: "查 wework plugin 跟 Java 后端 WS 连接状态.",
    inputSchema: { type: "object", properties: {} },
    runArgs: (_a: any) => ["status"],
  },
  {
    name: "wework_phone_status",
    description: "查工作手机 SDK 状态.",
    inputSchema: {
      type: "object",
      properties: { wxId: { type: "string" } },
      required: ["wxId"],
    },
    runArgs: (a: any) => ["phone", a.wxId],
  },
];

const server = new Server(
  { name: "wework-scrm", version: "0.2.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const tool = TOOLS.find((t) => t.name === name);
  if (!tool) {
    return {
      isError: true,
      content: [{ type: "text", text: `unknown tool: ${name}` }],
    };
  }
  try {
    const cliArgs = tool.runArgs(args ?? {});
    const out = await runWework(cliArgs);
    return { content: [{ type: "text", text: out }] };
  } catch (e: any) {
    return {
      isError: true,
      content: [{ type: "text", text: `wework ${tool.runArgs(args ?? {}).join(" ")} failed: ${e.message}\n${e.stdout ?? ""}\n${e.stderr ?? ""}` }],
    };
  }
});

// 启动 stdio
const transport = new StdioServerTransport();
server.connect(transport).then(() => {
  // 服务启动后什么也不打印 (stdio 上别污染 MCP 协议)
  process.stderr.write("[wework-mcp] ready\n");
});
