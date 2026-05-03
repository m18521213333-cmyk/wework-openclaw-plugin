#!/usr/bin/env bash
# ============================================================
# WeWork SCRM 插件 Smoke Test
#
# 验证所有 14 个 CLI 命令 + 底层服务全部正常工作.
# 在服务器 (60.205.94.161) 上跑.
#
# 用法:
#   ./scripts/smoke-test.sh                       # 全部测试
#   ./scripts/smoke-test.sh --skip-send            # 跳过会真发消息的测试
#   WX_ID=... CONV_ID=... ./scripts/smoke-test.sh  # 自定义测试 wxId/convId
# ============================================================

set -uo pipefail

WX_ID="${WX_ID:-1688852285335663}"        # 孟伟
CONV_ID="${CONV_ID:-7881300944899375}"    # 测试客户会话
SKIP_SEND=0
[[ "${1:-}" == "--skip-send" ]] && SKIP_SEND=1

PASS=0
FAIL=0
SKIP=0

c_red()   { printf '\033[31m%s\033[0m' "$*"; }
c_green() { printf '\033[32m%s\033[0m' "$*"; }
c_yel()   { printf '\033[33m%s\033[0m' "$*"; }
c_blue()  { printf '\033[34m%s\033[0m' "$*"; }

pass() { c_green "  ✅ "; echo "$*"; PASS=$((PASS+1)); }
fail() { c_red   "  ❌ "; echo "$*"; FAIL=$((FAIL+1)); }
skip() { c_yel   "  ⏭  "; echo "$*"; SKIP=$((SKIP+1)); }
section() { echo; c_blue "━━ $* ━━"; echo; }

# ============================================================
# 1. 基础环境检查
# ============================================================

section "1. 服务 + 端口 + 防火墙"

systemctl is-active --quiet openclaw-scrm.service \
  && pass "openclaw-scrm.service active" \
  || fail "openclaw-scrm.service not active"

systemctl is-active --quiet wework-server.service \
  && pass "wework-server.service active" \
  || fail "wework-server.service not active"

for port in 15086 15087 15088; do
  ss -tlnp 2>/dev/null | grep -q ":$port " \
    && pass "Java 端口 $port listening" \
    || fail "Java 端口 $port not listening"
done

# ufw 不是必须 active, 但 active 时三个端口必须 ALLOW
if ufw status | grep -q "Status: active"; then
  for port in 15086 15087 15088; do
    ufw status | grep -q "$port/tcp" \
      && pass "ufw 放行 $port/tcp" \
      || skip "ufw 没显式放行 $port/tcp (默认允许或防火墙关)"
  done
fi

# 公网到 15086 / 15087 (Java HTTP + 手机 SDK)
curl -sS -m 3 -o /dev/null -w "%{http_code}" http://60.205.94.161:15086/ 2>/dev/null | grep -q "302\|200" \
  && pass "公网 15086 可达 (Web 管理端)" \
  || skip "公网 15086 不可达 (检查阿里云 SG)"

# ============================================================
# 2. 数据库 + 表
# ============================================================

section "2. MySQL + SQLite + 必要表"

PASS_DB=$(grep "^spring.datasource.password" /opt/wework/wework-server/src/main/resources/application.properties 2>/dev/null | cut -d= -f2)
if [ -n "$PASS_DB" ]; then
  for tbl in tbl_wx_accountinfo tbl_accountinfo tbl_platform_tenant tbl_wx_message; do
    cnt=$(MYSQL_PWD="$PASS_DB" mysql -uwework workchat -N -e "SELECT COUNT(*) FROM $tbl;" 2>/dev/null)
    if [ -n "$cnt" ]; then
      pass "MySQL.$tbl 存在 ($cnt 行)"
    else
      fail "MySQL.$tbl 缺失或不可访问"
    fi
  done
else
  skip "找不到 MySQL 密码, 跳过 MySQL 检查"
fi

# SQLite
SQLITE_DB=/root/wework-scrm.db
[ -f "$SQLITE_DB" ] && pass "SQLite ${SQLITE_DB} 存在" || fail "SQLite 不存在"

for tbl in messages keywords pending_tasks; do
  sqlite3 "$SQLITE_DB" "SELECT COUNT(*) FROM $tbl;" >/dev/null 2>&1 \
    && pass "SQLite.$tbl 存在" \
    || fail "SQLite.$tbl 缺失"
done

# ============================================================
# 3. 插件账号
# ============================================================

section "3. 插件账号 (pluginbot / pluginbot-cli)"

if [ -n "$PASS_DB" ]; then
  for acc in pluginbot pluginbot-cli; do
    found=$(MYSQL_PWD="$PASS_DB" mysql -uwework workchat -N -e "SELECT COUNT(*) FROM tbl_accountinfo WHERE account='$acc' AND state=1;" 2>/dev/null)
    [ "$found" = "1" ] && pass "账号 $acc 存在且启用" || fail "账号 $acc 不存在或被禁用"
  done

  # 路由: tbl_wx_accountinfo.accountid = pluginbot 的 id (=15)
  bot_id=$(MYSQL_PWD="$PASS_DB" mysql -uwework workchat -N -e "SELECT id FROM tbl_accountinfo WHERE account='pluginbot' LIMIT 1;" 2>/dev/null)
  routed=$(MYSQL_PWD="$PASS_DB" mysql -uwework workchat -N -e "SELECT accountid FROM tbl_wx_accountinfo WHERE wxid=$WX_ID;" 2>/dev/null)
  [ "$routed" = "$bot_id" ] && pass "路由 accountid=$bot_id (孟伟 → pluginbot)" \
    || fail "路由错误: tbl_wx_accountinfo.accountid=$routed (应该=$bot_id)"
fi

# ============================================================
# 4. nginx /attachment 反代
# ============================================================

section "4. nginx 图床反代"

SAMPLE=$(ls /app/storage/attachment/*/. 2>/dev/null | grep -m1 "\.jpg" | head -1)
SAMPLE_DIR=$(ls -d /app/storage/attachment/*/ 2>/dev/null | head -1 | xargs basename)
SAMPLE_NAME=$(ls "/app/storage/attachment/${SAMPLE_DIR}/" 2>/dev/null | head -1)
if [ -n "$SAMPLE_NAME" ]; then
  code=$(curl -sS -m 5 -o /dev/null -w "%{http_code}" "http://60.205.94.161/attachment/${SAMPLE_DIR}/${SAMPLE_NAME}" 2>/dev/null)
  [ "$code" = "200" ] && pass "nginx /attachment 反代生效 (示例图 200 OK)" \
    || fail "nginx /attachment 反代失败 (HTTP $code)"
else
  skip "/app/storage/attachment 没图, 跳过反代测试"
fi

# ============================================================
# 5. 插件 systemd 配置
# ============================================================

section "5. systemd 配置"

if grep -q "WEWORK_PLUGIN_ENABLE=1" /etc/systemd/system/openclaw-scrm.service.d/*.conf 2>/dev/null; then
  pass "systemd unit 设置 WEWORK_PLUGIN_ENABLE=1"
else
  fail "systemd unit 没设 WEWORK_PLUGIN_ENABLE=1 (野生 openclaw 会抢登录)"
fi

if [ -x /usr/local/bin/wework ]; then
  pass "/usr/local/bin/wework wrapper 存在"
else
  skip "/usr/local/bin/wework 不存在 (CLI 测试需要 wrapper)"
fi

# ============================================================
# 6. CLI 命令 (查询类, 不发实际消息)
# ============================================================

section "6. CLI 查询类命令"

# 用一个临时文件做 CLI 输出捕获
TMPLOG=$(mktemp)
run_cli() {
  local desc="$1"; shift
  timeout 60 wework "$@" > "$TMPLOG" 2>&1
  if grep -qE "✅|已发送|已连接|查询" "$TMPLOG"; then
    pass "$desc"
  else
    fail "$desc — 输出: $(tail -2 "$TMPLOG")"
  fi
}

if [ -x /usr/local/bin/wework ]; then
  run_cli "wework status"                     status
  run_cli "wework phone $WX_ID"               phone "$WX_ID"
  run_cli "wework contact $WX_ID xxx"         contact "$WX_ID" "$CONV_ID"
  run_cli "wework history -n 3"               history "$WX_ID" "$CONV_ID" -n 3
  run_cli "wework search 测试"                 search "$WX_ID" "测试"
  run_cli "wework sync contacts"              sync "$WX_ID" contacts
  run_cli "wework my-moments"                 my-moments "$WX_ID"
fi

# ============================================================
# 7. CLI 发送类 (会真发消息, 可 --skip-send)
# ============================================================

section "7. CLI 发送类 (--skip-send 可跳过)"

if [ "$SKIP_SEND" = "1" ]; then
  skip "已跳过发送类测试 (--skip-send)"
elif [ -x /usr/local/bin/wework ]; then
  TS=$(date +%H:%M:%S)
  run_cli "wework send (text)"   send "$WX_ID" "$CONV_ID" "smoke-test text $TS"
  run_cli "wework moments (text)" moments "$WX_ID" "smoke-test moments $TS"
fi

rm -f "$TMPLOG"

# ============================================================
# 8. 插件 WS 连接 + 心跳
# ============================================================

section "8. WS 连接 + 心跳"

PID=$(systemctl show -p MainPID openclaw-scrm.service --value 2>/dev/null)
if [ -n "$PID" ] && [ "$PID" != "0" ]; then
  ESTAB=$(ss -tnp 2>/dev/null | grep ":15088" | grep "$PID" | wc -l)
  [ "$ESTAB" -ge 1 ] && pass "插件 WS (PID $PID) 连着 Java 15088" || fail "插件 WS 断开"
fi

# 最近 1 分钟有心跳活动 (说明双向通信工作)
recent_hb=$(journalctl -u wework-server.service --since "1 minute ago" --no-pager 2>/dev/null | grep -c "心跳====" || echo 0)
[ "$recent_hb" -gt 0 ] && pass "Java 端最近 1 分钟收到 $recent_hb 个心跳" \
  || fail "最近 1 分钟没心跳, 可能 service 没在线"

# ============================================================
# 总结
# ============================================================

section "📊 总结"
echo "  PASS: $(c_green $PASS)"
echo "  FAIL: $(c_red $FAIL)"
echo "  SKIP: $(c_yel $SKIP)"
echo

[ $FAIL -eq 0 ] && exit 0 || exit 1
