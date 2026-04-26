# OpenClaw 6-Agent 开发团队配置

## 6 个角色

| Agent | 职责 | 输入 | 输出 |
|-------|------|------|------|
| `requirements-analyst` | 需求分析师 | 用户原始需求 | `docs/requirements.md` |
| `product-designer` | 产品设计师 | requirements.md | `docs/prd.md` |
| `ui-designer` | UI 设计师 | prd.md | `docs/ui-spec.md` + HTML 原型 |
| `backend-dev` | 后端开发 | prd.md | `src/backend/` |
| `frontend-dev` | 前端开发 | ui-spec.md + prd.md | `src/frontend/` |
| `tester` | 测试工程师 | prd.md + backend | `src/backend/tests/` |

---

## 安装步骤

### 1. 合并配置到现有 OpenClaw

```bash
# 备份现有配置
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak

# 用 node 合并新的 agents 配置(不破坏已有内容)
node -e "
const fs = require('fs');
const path = require('os').homedir() + '/.openclaw/openclaw.json';
const newAgents = require('./configs/dev-team-agents.json');

let cfg = JSON.parse(
  fs.readFileSync(path, 'utf-8').replace(/\/\/.*$/gm,'').replace(/\/\*[\s\S]*?\*\//g,'')
);

// 合并 agents
cfg.agents = cfg.agents || {};
cfg.agents.defaults = { ...cfg.agents.defaults, ...newAgents.agents.defaults };
cfg.agents.entries = { ...cfg.agents.entries, ...newAgents.agents.entries };

fs.writeFileSync(path, JSON.stringify(cfg, null, 2));
console.log('✓ 6 个开发团队 Agent 已合并到 openclaw.json');
"

# 重启 Gateway 让配置生效
openclaw gateway restart
```

### 2. 验证

```bash
openclaw agents list

# 预期输出:
# requirements-analyst   需求分析师
# product-designer       产品设计师
# ui-designer            UI 设计师
# backend-dev            后端开发
# frontend-dev           前端开发
# tester                 测试工程师
```

---

## 使用方式

### 方式 A: 串联执行(推荐新手,稳定可控)

新建一个项目目录,然后逐个调用:

```bash
mkdir my-project && cd my-project
mkdir -p docs src/backend src/frontend prototypes

# 阶段 1: 需求分析(交互式问答澄清需求)
openclaw agents run requirements-analyst \
  --message "我想做一个小型的图书借阅系统,管理员可以管理图书,用户可以借还书"

# 阶段 2: 产品设计(自动读取 docs/requirements.md)
openclaw agents run product-designer \
  --message "基于 docs/requirements.md 输出完整 PRD"

# 阶段 3: UI 设计
openclaw agents run ui-designer \
  --message "基于 docs/prd.md 设计所有页面"

# 阶段 4: 并行开发(前后端各开一个终端同时跑)
# 终端 A:
openclaw agents run backend-dev --message "实现 PRD 定义的所有 API"
# 终端 B:
openclaw agents run frontend-dev --message "基于 ui-spec.md 实现前端"

# 阶段 5: 测试
openclaw agents run tester --message "为所有 API 写集成测试并跑通"
```

### 方式 B: 编排脚本一键执行

把上面的命令写成一个 shell 脚本:

```bash
cat > run-dev-team.sh << 'EOF'
#!/bin/bash
set -e

REQUIREMENT="$1"
if [ -z "$REQUIREMENT" ]; then
  echo "用法: ./run-dev-team.sh \"我想做一个 XX 系统\""
  exit 1
fi

mkdir -p docs src/backend src/frontend prototypes

echo "━━━ [1/6] 需求分析 ━━━"
openclaw agents run requirements-analyst --message "$REQUIREMENT"

echo "━━━ [2/6] 产品设计 ━━━"
openclaw agents run product-designer --message "基于 docs/requirements.md 输出 PRD"

echo "━━━ [3/6] UI 设计 ━━━"
openclaw agents run ui-designer --message "基于 docs/prd.md 设计页面"

echo "━━━ [4/6] 后端开发 ━━━"
openclaw agents run backend-dev --message "实现 PRD 定义的所有 API" &
BACKEND_PID=$!

echo "━━━ [5/6] 前端开发(与后端并行) ━━━"
openclaw agents run frontend-dev --message "基于 ui-spec.md 实现前端"

# 等后端跑完
wait $BACKEND_PID

echo "━━━ [6/6] 测试 ━━━"
openclaw agents run tester --message "为所有 API 写集成测试"

echo ""
echo "✓ 开发流程全部完成"
ls -R docs/ src/
EOF

chmod +x run-dev-team.sh

# 用法
./run-dev-team.sh "我想做一个图书借阅系统"
```

---

## 资源消耗(云端 API 模式)

6 个 Agent 跑同一个项目的成本估算(以 Claude Sonnet 4.7 为例):

| 项目复杂度 | Token 用量 | 预计成本(USD) | 耗时 |
|-----------|-----------|--------------|------|
| 简单(Todo/留言板) | ~150k | $1-2 | 5-10 分钟 |
| 中等(图书馆/博客) | ~400k | $3-6 | 15-25 分钟 |
| 复杂(电商/CRM) | ~1M+ | $10-20 | 1 小时+ |

本地资源占用几乎为 0,只是发请求和接收结果。

---

## 配合企业微信 SCRM 插件的玩法

把这套开发团队和你的 wework-scrm 插件结合,让企业微信用户提需求 → 自动开发:

```
客户在企业微信发 "我想要一个 XX 工具"
  ↓
wework-scrm 插件捕获消息
  ↓
触发 requirements-analyst Agent
  ↓
6 个 Agent 流水线执行
  ↓
完成后用 wework_send_message 工具
把成果(代码包+部署链接)发回给客户
```

需要的话告诉我,我帮你写这个集成。
