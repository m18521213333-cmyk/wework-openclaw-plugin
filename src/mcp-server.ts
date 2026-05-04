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

// 安全: send-image 接的 localPath 是 LLM 决定的, 限制只能是这些目录, 防 path traversal
// + LLM 看到 /etc/passwd 当图片传出去
const ALLOWED_IMAGE_DIRS = [
  "/tmp/",
  "/app/storage/attachment/",
  "/root/uploads/",
];

function isPathAllowed(p: string): boolean {
  if (!p || typeof p !== "string") return false;
  // 必须绝对路径 + 不含 .. + 必须在白名单目录下
  if (!p.startsWith("/")) return false;
  if (p.includes("..")) return false;
  return ALLOWED_IMAGE_DIRS.some((d) => p.startsWith(d));
}

// 安全: int64 字段 LLM 可能传 number, 我们要确保字符串化
function asString(v: any): string {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "bigint") return String(v);
  return "";
}

/** 跑一条 wework CLI, 返回 stdout */
async function runWework(args: string[], timeoutMs = 30_000): Promise<string> {
  const { stdout, stderr } = await execFileAsync(WEWORK_BIN, args, {
    timeout: timeoutMs,
    encoding: "utf8",
    maxBuffer: 5 * 1024 * 1024,
  });
  return (stdout + (stderr ? `\n[stderr]\n${stderr}` : "")).trim();
}

/** 直查 MySQL 看手机 SDK 是否在线 (绕开 wework status, 它要起 WS 太慢) */
async function checkPhoneOnline(wxId: string): Promise<{ ok: boolean; reason?: string }> {
  try {
    const fs = await import("node:fs");
    const propsPath = "/opt/wework/wework-server/src/main/resources/application.properties";
    if (!fs.existsSync(propsPath)) return { ok: true }; // 没配置就乐观
    const props = fs.readFileSync(propsPath, "utf8");
    const dbUser = props.match(/^spring\.datasource\.username=(.+)$/m)?.[1]?.trim() ?? "wework";
    const dbPass = props.match(/^spring\.datasource\.password=(.+)$/m)?.[1]?.trim() ?? "";
    const dbName = props.match(/jdbc:mysql:\/\/[^/]+\/([^?]+)/)?.[1] ?? "workchat";
    if (!dbPass) return { ok: true };
    const sql = `SELECT name, isonline FROM tbl_wx_accountinfo WHERE wxid=${wxId};`;
    const { stdout } = await execFileAsync("mysql", ["-u", dbUser, "-N", "-B", dbName, "-e", sql], {
      env: { ...process.env, MYSQL_PWD: dbPass }, encoding: "utf8", timeout: 5_000,
    });
    const line = stdout.trim().split("\n")[0];
    if (!line) return { ok: true }; // 没找到该 wxId, 不阻塞
    const [name, isonlineStr] = line.split("\t");
    if (isonlineStr === "0") return { ok: true }; // 在线
    return { ok: false, reason: `手机 SDK 离线 (${name}, isonline=${isonlineStr}), 消息发不出去. 提醒用户在工作手机上重新登录 SCRM App` };
  } catch (e: any) {
    process.stderr.write(`[mcp-check] error: ${e.message}\n`);
    return { ok: true }; // 查询失败时不阻塞 (避免阻塞业务)
  }
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
  {
    name: "wework_get_contact",
    description: "查某个客户/联系人的详细信息.",
    inputSchema: {
      type: "object",
      properties: {
        wxId: { type: "string" },
        remoteId: { type: "string", description: "联系人 RemoteId" },
      },
      required: ["wxId", "remoteId"],
    },
    runArgs: (a: any) => ["contact", a.wxId, a.remoteId],
  },
  {
    name: "wework_my_moments",
    description: "拉取我自己发布的朋友圈列表.",
    inputSchema: {
      type: "object",
      properties: { wxId: { type: "string" } },
      required: ["wxId"],
    },
    runArgs: (a: any) => ["my-moments", a.wxId],
  },
  {
    name: "wework_sync_data",
    description: "触发数据同步 (通讯录/客户/会话/标签).",
    inputSchema: {
      type: "object",
      properties: {
        wxId: { type: "string" },
        type: { type: "string", enum: ["contacts", "customers", "conversations", "labels", "all"], description: "同步类型" },
      },
      required: ["wxId", "type"],
    },
    runArgs: (a: any) => ["sync", a.wxId, a.type],
  },
  {
    name: "wework_revoke_message",
    description: "撤回消息 (仅限 2 分钟内自己发的).",
    inputSchema: {
      type: "object",
      properties: {
        wxId: { type: "string" },
        msgId: { type: "string" },
        convId: { type: "string" },
      },
      required: ["wxId", "msgId", "convId"],
    },
    runArgs: (a: any) => ["revoke", a.wxId, a.msgId, a.convId],
  },
  {
    name: "wework_forward_message",
    description: "转发某条消息到另一个会话.",
    inputSchema: {
      type: "object",
      properties: {
        wxId: { type: "string" },
        msgId: { type: "string" },
        fromConvId: { type: "string" },
        toConvId: { type: "string" },
      },
      required: ["wxId", "msgId", "fromConvId", "toConvId"],
    },
    runArgs: (a: any) => ["forward", a.wxId, a.msgId, a.fromConvId, a.toConvId],
  },
  {
    name: "wework_group_set_name",
    description: "改群名 (针对自己是群主的群).",
    inputSchema: {
      type: "object",
      properties: {
        wxId: { type: "string" },
        groupConvId: { type: "string" },
        name: { type: "string" },
      },
      required: ["wxId", "groupConvId", "name"],
    },
    runArgs: (a: any) => ["group", a.wxId, "set_name", "--group", a.groupConvId, "--content", a.name],
  },
  {
    name: "wework_group_add_member",
    description: "拉成员进群.",
    inputSchema: {
      type: "object",
      properties: {
        wxId: { type: "string" },
        groupConvId: { type: "string" },
        members: { type: "array", items: { type: "string" }, description: "客户 RemoteId 列表" },
      },
      required: ["wxId", "groupConvId", "members"],
    },
    runArgs: (a: any) => ["group", a.wxId, "add_member", "--group", a.groupConvId, "--members", ...a.members],
  },
  {
    name: "wework_health",
    description: "综合健康检查 (服务/端口/Java/手机/swap/SQLite). 排查问题首选.",
    inputSchema: { type: "object", properties: {} },
    runArgs: (_a: any) => ["health", "--json"],
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
  const a = args ?? {};

  // 1. 输入校验 (path traversal / 类型规范化)
  if (name === "wework_send_image" && !isPathAllowed(asString((a as any).localPath))) {
    return {
      isError: true,
      content: [{ type: "text", text: `localPath 不在白名单目录: ${ALLOWED_IMAGE_DIRS.join(", ")}` }],
    };
  }

  // 2. 发送类: 先查手机在线, 离线就拒绝 (防止 LLM 报错误的 "成功")
  const sendingTools = new Set([
    "wework_send_message", "wework_send_image", "wework_mass_send",
    "wework_post_moments", "wework_create_group",
  ]);
  if (sendingTools.has(name)) {
    const wxId = asString((a as any).wxId);
    if (wxId) {
      const check = await checkPhoneOnline(wxId);
      if (!check.ok) {
        return {
          isError: true,
          content: [{ type: "text", text: `❌ 操作中止: ${check.reason}` }],
        };
      }
    }
  }

  // 3. 真正执行
  try {
    const cliArgs = tool.runArgs(a);
    const out = await runWework(cliArgs);
    return { content: [{ type: "text", text: out }] };
  } catch (e: any) {
    return {
      isError: true,
      content: [{ type: "text", text: `wework ${tool.runArgs(a).join(" ")} failed: ${e.message}\n${e.stdout ?? ""}\n${e.stderr ?? ""}` }],
    };
  }
});

// 启动 stdio
const transport = new StdioServerTransport();
server.connect(transport).then(() => {
  // 服务启动后什么也不打印 (stdio 上别污染 MCP 协议)
  process.stderr.write("[wework-mcp] ready\n");
});
