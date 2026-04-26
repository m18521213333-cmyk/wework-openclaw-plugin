# 企业微信 → 6-Agent 自动开发流水线

把客户在企业微信发的需求,自动交给 6 个开发 Agent 流水线开发,完成后把代码包推回给客户。

## 工作流程

```
客户在企业微信发: "我想做一个图书借阅系统"
        ↓
wework-scrm 收到 FriendTalkNotice
        ↓
检测到关键词 "我想做" → 触发 DevPipeline
        ↓
立即回复: "✅ 已收到需求,预计 15-25 分钟完成"
        ↓
异步执行 6-Agent 流水线:
  1. 需求分析师 → docs/requirements.md
  2. 产品设计师 → docs/prd.md
  3. UI 设计师 → docs/ui-spec.md + 原型
  4. 后端开发 ┐ 并行
  5. 前端开发 ┘
  6. 测试工程师 → 测试通过
        ↓
打包 tar.gz 并推送给客户:
"🎉 开发完成! 代码包: /path/to/proj-xxx.tar.gz"
```

## 配置启用

编辑 `~/.openclaw/openclaw.json`,在 `wework-scrm` 配置中加入:

```json
{
  "plugins": {
    "entries": {
      "wework-scrm": {
        "enabled": true,
        "config": {
          "javaWsUrl": "ws://你的Java后端:15088",
          "storage": {
            "type": "sqlite",
            "sqlitePath": "./wework-scrm.db"
          },
          "dify": {
            "enabled": true,
            "apiUrl": "https://chat-dify.cloud.zjian.net/v1",
            "apiKey": "app-ClyQIYixmknsVkYrH7QmWYib"
          },
          "devPipeline": {
            "enabled": true,
            "gatewayUrl": "http://127.0.0.1:8080",
            "projectsDir": "/Users/你的用户名/wework-projects",
            "triggerKeywords": ["@开发助手", "@dev", "/dev", "我想做一个", "帮我开发"],
            "claudeCliPath": "/usr/local/bin/claude"
          }
        }
      }
    }
  }
}
```

**关键参数说明:**

- `enabled: true` — 开启自动开发流水线
- `triggerKeywords` — 客户消息包含这些关键词才会触发,避免误触发
- `projectsDir` — 每个项目会在此目录下建独立子目录
- `claudeCliPath` — 推荐用本地 Claude Code CLI(已登录账号),把这里设为 `claude` 命令的路径
- `gatewayUrl` — 备选方案,通过 OpenClaw HTTP API 调用 Agent

## 测试方法

### 方式 A: CLI 手动触发(推荐先用这个测试)

```bash
openclaw wework dev <你的wxId> <测试客户convId> "我想做一个图书借阅系统,管理员能管理图书,用户能借还书"
```

执行流程:
- 立即在企业微信给指定客户发"已收到需求"消息
- 后台跑 6-Agent 流水线
- 完成后再发"开发完成"+ 代码包路径

### 方式 B: 真实客户触发

让客户在企业微信直接发:

```
@开发助手 我想做一个简单的待办事项App
```

或:

```
帮我开发一个客户预约系统,要能在线预约和取消
```

只要消息包含 `triggerKeywords` 中任一关键词就会自动触发。

## 资源消耗

| 项目复杂度 | 耗时 | API 成本 |
|-----------|------|----------|
| 简单 (Todo) | 5-10 分钟 | $1-2 |
| 中等 (图书馆/博客) | 15-25 分钟 | $3-6 |
| 复杂 (CRM) | 1 小时+ | $10-20 |

本机资源占用 ~0%,云端 API 跑。

## 安全建议

**1. 限制触发权限** — 修改 `automation-engine.ts` 中的触发逻辑,只允许白名单内的客户触发,防止恶意客户滥用 API 额度。

**2. 限流** — 每个客户每天最多触发 2 次,可在 `dev-pipeline.ts` 的 `shouldTrigger()` 中加入 SQLite 计数检查。

**3. 项目隔离** — 每个项目都有独立子目录,不会互相影响。

**4. 失败兜底** — 流水线失败会自动回复客户出错信息,不会假装成功。

## 故障排查

**"开发流水线已启动" 后没有后续消息?**

检查日志: `tail -f ~/.openclaw/logs/wework-scrm.log`

常见原因:
- Claude Code CLI 路径错误 → 改 `claudeCliPath` 为正确路径(用 `which claude` 查)
- OpenClaw Gateway 没启动 → `openclaw gateway status`
- 某个 Agent 跑超时 → 看具体哪个阶段卡住,可能需要增大超时时间

**项目目录权限问题?**

```bash
mkdir -p ~/wework-projects
chmod 755 ~/wework-projects
```

**想看具体某个 Agent 的输出?**

每个项目目录里都有完整的中间产物:
```
~/wework-projects/proj-2026-04-26-abc12345/
  ├── docs/requirements.md
  ├── docs/prd.md
  ├── docs/ui-spec.md
  ├── docs/test-report.md
  ├── prototypes/*.html
  ├── src/backend/
  └── src/frontend/
```
