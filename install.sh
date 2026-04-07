#!/bin/bash
# ============================================
# WeWork SCRM OpenClaw 插件 — 安装配置脚本
# 在你的 macOS 上执行这个脚本即可完成全部配置
# ============================================

set -e

echo "========================================"
echo "  WeWork SCRM OpenClaw 插件安装配置"
echo "========================================"

# ------------------------------------------
# 1. 克隆代码
# ------------------------------------------
echo ""
echo "[1/5] 克隆插件代码..."

PLUGIN_DIR="$HOME/wework-openclaw-plugin"

if [ -d "$PLUGIN_DIR" ]; then
  echo "  目录已存在，拉取最新代码..."
  cd "$PLUGIN_DIR"
  git pull origin main
else
  git clone https://github.com/m18521213333-cmyk/wework-openclaw-plugin.git "$PLUGIN_DIR"
  cd "$PLUGIN_DIR"
fi

# ------------------------------------------
# 2. 安装依赖
# ------------------------------------------
echo ""
echo "[2/5] 安装 npm 依赖..."
npm install

# ------------------------------------------
# 3. 安装插件到 OpenClaw
# ------------------------------------------
echo ""
echo "[3/5] 安装插件到 OpenClaw..."
openclaw plugins install "$PLUGIN_DIR" --link
openclaw plugins enable wework-scrm

# ------------------------------------------
# 4. 写入 OpenClaw 配置
# ------------------------------------------
echo ""
echo "[4/5] 配置 OpenClaw..."

OPENCLAW_CONFIG="$HOME/.openclaw/openclaw.json"

# 备份原配置
if [ -f "$OPENCLAW_CONFIG" ]; then
  cp "$OPENCLAW_CONFIG" "${OPENCLAW_CONFIG}.bak.$(date +%Y%m%d%H%M%S)"
  echo "  已备份原配置"
fi

# 用 node 来安全地合并配置（不破坏已有配置）
node -e "
const fs = require('fs');
const path = '$OPENCLAW_CONFIG';

let config = {};
try {
  const raw = fs.readFileSync(path, 'utf-8');
  // 简单去掉 JSON5 的注释
  const cleaned = raw.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  config = JSON.parse(cleaned);
} catch { 
  config = {};
}

// 确保 plugins 结构存在
if (!config.plugins) config.plugins = {};
if (!config.plugins.entries) config.plugins.entries = {};

// 写入 wework-scrm 插件配置
config.plugins.entries['wework-scrm'] = {
  enabled: true,
  config: {
    websocket: {
      port: 15087,
      host: '0.0.0.0'
    },
    storage: {
      type: 'sqlite',
      sqlitePath: '$PLUGIN_DIR/wework-scrm.db'
    },
    dify: {
      enabled: true,
      apiUrl: 'https://chat-dify.cloud.zjian.net/v1',
      apiKey: 'app-ClyQIYixmknsVkYrH7QmWYib'
    },
    autoReply: {
      enabled: true,
      timeRange: '0:24'
    }
  }
};

// 确保插件在允许列表中
if (!config.plugins.allow) config.plugins.allow = [];
if (!config.plugins.allow.includes('wework-scrm')) {
  config.plugins.allow.push('wework-scrm');
}

fs.writeFileSync(path, JSON.stringify(config, null, 2));
console.log('  配置已写入: ' + path);
"

# ------------------------------------------
# 5. 重启 OpenClaw Gateway
# ------------------------------------------
echo ""
echo "[5/5] 重启 OpenClaw Gateway..."
openclaw gateway restart 2>/dev/null || echo "  请手动重启: openclaw gateway restart"

echo ""
echo "========================================"
echo "  安装完成!"
echo "========================================"
echo ""
echo "  插件目录: $PLUGIN_DIR"
echo "  数据库:   $PLUGIN_DIR/wework-scrm.db"
echo "  TCP 端口: 15087 (手机端SDK)"
echo "  WS  端口: 15088 (PC前端)"
echo "  Dify AI:  https://chat-dify.cloud.zjian.net/v1"
echo ""
echo "  验证命令:"
echo "    openclaw plugins list        # 应看到 wework-scrm [enabled]"
echo "    openclaw wework status       # 查看连接状态"
echo ""
echo "  手机端SDK连接地址不变:"
echo "    TCP: 你的服务器IP:15087"
echo ""
