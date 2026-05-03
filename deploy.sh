#!/usr/bin/env bash
# ============================================================
# WeWork SCRM Plugin - 部署到 60.205.94.161
# 流程: 本地 build → rsync 到服务器 → 重启 systemd → 跟踪日志
#
# 不会动:
#   - 服务器 node_modules/  (除非本地 package.json 变了, 见下面 NPM_INSTALL)
#   - 服务器 *.db           (生产数据)
#   - 服务器 .openclaw/openclaw.json (gateway 配置)
#
# 用法:
#   ./deploy.sh           # 正常部署
#   ./deploy.sh --dry-run # 仅 rsync dry-run, 不实际改服务器
#   ./deploy.sh --npm     # 同时在服务器 npm install (依赖变了的时候用)
# ============================================================
set -euo pipefail

REMOTE="wework-prod"
REMOTE_PATH="/root/.openclaw/extensions/wework-scrm/"
SERVICE="openclaw-scrm.service"

DRY_RUN=""
NPM_INSTALL=0
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN="--dry-run" ;;
    --npm)     NPM_INSTALL=1 ;;
    *) echo "未知参数: $arg"; exit 1 ;;
  esac
done

# ---- 1. 本地 build ----
echo "==> [1/4] 本地 build (tsc)"
rm -rf dist
npm run build

# ---- 2. rsync ----
echo "==> [2/4] rsync 到 $REMOTE:$REMOTE_PATH ${DRY_RUN:+(DRY-RUN)}"
rsync -avz --delete $DRY_RUN \
  --exclude='node_modules/' \
  --exclude='*.db' \
  --exclude='*.db-journal' \
  --exclude='*.log' \
  --exclude='.git/' \
  --exclude='.DS_Store' \
  --exclude='deploy.sh' \
  --exclude='install.sh' \
  --exclude='configs/' \
  --exclude='TASK_BREAKDOWN.md' \
  ./ "$REMOTE:$REMOTE_PATH"

# Mac 自带 rsync 是老版本不支持 --chown, 通过 ssh 把属主改回 root
# (rsync 默认会保留 mac 的 uid=501, OpenClaw 检测到 uid 不匹配会拒绝加载插件)
if [[ -z "$DRY_RUN" ]]; then
  ssh "$REMOTE" "chown -R root:root $REMOTE_PATH"
fi

if [[ -n "$DRY_RUN" ]]; then
  echo "==> dry-run 完成, 实际未改动服务器"
  exit 0
fi

# ---- 3. (可选) 服务器 npm install ----
if [[ $NPM_INSTALL -eq 1 ]]; then
  echo "==> [3/4] 服务器 npm install --omit=dev"
  ssh "$REMOTE" "cd $REMOTE_PATH && npm install --omit=dev"
else
  echo "==> [3/4] 跳过 npm install (依赖未变; 加 --npm 强制)"
fi

# ---- 4. 重启 + 看日志 ----
echo "==> [4/4] 重启 $SERVICE 并跟踪日志 (Ctrl-C 退出)"
ssh "$REMOTE" "systemctl restart $SERVICE && sleep 2 && systemctl is-active $SERVICE"
echo "----- journalctl (最近 30 条) -----"
ssh "$REMOTE" "journalctl -u $SERVICE -n 30 --no-pager"
echo
echo "==> 部署完成. 跟踪实时日志: ssh $REMOTE 'journalctl -u $SERVICE -f'"
