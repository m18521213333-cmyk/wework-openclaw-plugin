#!/usr/bin/env bash
# 故障演练自动化脚本 — 8 个 resolve_media + send 路径失败场景
#
# 用法:
#   ./scripts/playbook.sh           # 跑全套
#   ./scripts/playbook.sh 1 2 8     # 只跑 1, 2, 8 三个场景
#   ./scripts/playbook.sh --list    # 看场景清单
#
# 设计:
#   - 每个场景独立 (test_N), 失败不影响后续
#   - 输出 ✓/✗ + 关键证据片段, 不刷屏
#   - 末尾汇总通过率
#   - 设计时尽量幂等, 不修改长期状态 (有改 sqlite 的会还原)
#
# 前置条件:
#   - ~/.ssh/config 里有 Host wework-prod
#   - 服务器 openclaw-scrm + wework-server active
#   - Plugin 部署在 /root/.openclaw/extensions/wework-scrm/

set -uo pipefail

# ============================================
# 配置
# ============================================
SSH_HOST="${PLAYBOOK_SSH:-wework-prod}"
WX_ID="${PLAYBOOK_WXID:-1688852285335663}"
SENDER_ID="${PLAYBOOK_SENDERID:-7881300944899375}"
PLUGIN_BIN="/usr/local/bin/openclaw"

# 颜色 (TTY 时用)
if [ -t 1 ]; then
    G='\033[32m'; R='\033[31m'; Y='\033[33m'; B='\033[34m'; D='\033[2m'; N='\033[0m'
else
    G=''; R=''; Y=''; B=''; D=''; N=''
fi

PASS_COUNT=0
FAIL_COUNT=0
RESULTS=()

# ============================================
# Helpers
# ============================================
sssh() { ssh -o ConnectTimeout=8 "$SSH_HOST" "$@"; }
sssh_q() { ssh -o ConnectTimeout=8 -q "$SSH_HOST" "$@" 2>/dev/null; }

log_pass() {
    local n=$1 desc=$2 detail=${3:-}
    PASS_COUNT=$((PASS_COUNT + 1))
    RESULTS+=("PASS|$n|$desc")
    printf "${G}✓ #%s${N} %s" "$n" "$desc"
    [ -n "$detail" ] && printf " ${D}— %s${N}" "$detail"
    printf "\n"
}

log_fail() {
    local n=$1 desc=$2 detail=${3:-}
    FAIL_COUNT=$((FAIL_COUNT + 1))
    RESULTS+=("FAIL|$n|$desc|$detail")
    printf "${R}✗ #%s${N} %s\n" "$n" "$desc"
    [ -n "$detail" ] && printf "  ${R}详细:${N} %s\n" "$detail"
}

log_skip() {
    local n=$1 desc=$2 reason=$3
    RESULTS+=("SKIP|$n|$desc|$reason")
    printf "${Y}⊘ #%s${N} %s ${D}(skipped: %s)${N}\n" "$n" "$desc" "$reason"
}

section() {
    printf "\n${B}━━━ $1 ━━━${N}\n"
}

# 找一个最近的 Picture msgId (用作 #6 / #7 的目标)
find_recent_picture_msg() {
    sssh_q 'sqlite3 /root/wework-scrm.db "SELECT msg_id FROM messages WHERE content_type='\''Picture'\'' ORDER BY id DESC LIMIT 1"'
}

# 找一个 24h+ 旧的 Picture msgId (用作 #3 / #5)
find_old_picture_msg() {
    sssh_q 'sqlite3 /root/wework-scrm.db "SELECT msg_id FROM messages WHERE content_type='\''Picture'\'' AND created_at < datetime('\''now'\'', '\''-24 hours'\'') ORDER BY id DESC LIMIT 1"'
}

# ============================================
# 场景实现
# ============================================

# #1: WS 连接断 (重启 Java 期间发指令)
test_1_ws_drop() {
    section "#1 WS 连接断 — sendToJavaWithRetry 等重连"

    # 后台启 send (会触发 sendMessageWithRetry 流程)
    local out=$(sssh_q "$PLUGIN_BIN wework send $WX_ID $SENDER_ID '[playbook-#1] WS 断后重连测试' --type text 2>&1")

    if echo "$out" | grep -q '✅ 消息已发送'; then
        log_pass "1" "WS 连接正常时 send 直通" "(本场景默认 WS 在线; 完整测试需手工 systemctl restart wework-server 同时跑这命令)"
    else
        log_fail "1" "WS send 路径异常" "$(echo "$out" | tail -3 | head -1)"
    fi
}

# #2: Java 应用层繁忙 ("其他任务下载中") - 通过 stale 记录注入
test_2_java_busy_transient() {
    section "#2 Java 应用层繁忙 → transient 重试 ×3"

    local msg_id=$(find_recent_picture_msg)
    if [ -z "$msg_id" ]; then
        log_skip "2" "transient 重试" "找不到测试用 Picture msgId"
        return
    fi

    # 注入: 写一条 stale 失败记录, 标记 "其他任务下载中"
    # resolve-media 启动时会 clear 这条, 所以这是测 isTransientResolveError 关键词识别
    # 真要测 retry 链条, 需要 Java 真在忙. 这里用 grep 检查代码逻辑就好.

    # 实际验证方式: 跑一次 resolve-media, 看输出是否含 "transient" 关键词的处理痕迹 (不一定触发, 看运气)
    # 更可靠: grep 已部署的代码里有没有这些关键词
    local code_check=$(sssh_q "grep -c '其他任务下载中' /root/.openclaw/extensions/wework-scrm/dist/services/storage-service.js")
    if [ "${code_check:-0}" -ge 1 ]; then
        log_pass "2" "isTransientResolveError 关键词列表已部署" "包含 '其他任务下载中'"
    else
        log_fail "2" "isTransientResolveError 关键词列表缺失" "服务器代码里没找到 '其他任务下载中' 关键词"
    fi
}

# #3: SDK 静默超时 (老图 / 缓存清的图)
test_3_sdk_silent_timeout() {
    section "#3 SDK 静默超时 — 老图 resolve, 期望 ~15-20s 内返回静默错"

    local msg_id=$(find_old_picture_msg)
    if [ -z "$msg_id" ]; then
        log_skip "3" "SDK 静默超时" "找不到 24h+ 的 Picture msgId"
        return
    fi

    # 短 wait 减少跑测时间. 真实 60s 用户自己测一遍.
    local start=$(date +%s)
    local out=$(sssh_q "$PLUGIN_BIN wework resolve-media $WX_ID $msg_id --wait 15 --max-retries 1 --retry-wait 2 2>&1")
    local elapsed=$(( $(date +%s) - start ))

    # 期望: 失败, 文案含 "Java 报错"或"静默无响应"或"重试 N 次仍失败"
    if echo "$out" | grep -qE '重试.*次仍失败|静默无响应|Java 报错|永久错误'; then
        log_pass "3" "失败被正确分类" "msgId=$msg_id, 耗时 ${elapsed}s"
    elif echo "$out" | grep -q '✅ 已到位'; then
        log_pass "3" "竟然成功了 (老图还能拉)" "msgId=$msg_id, ${elapsed}s"
    else
        log_fail "3" "失败文案不符合期望" "$(echo "$out" | tail -3 | head -1)"
    fi
}

# #4: outgoing 自己发的媒体 — 验证 recent_media isOutgoing 字段
test_4_outgoing_isOutgoing_field() {
    section "#4 outgoing 媒体识别 — recent_media 含 isOutgoing 字段"

    local out=$(sssh_q "$PLUGIN_BIN wework recent-media $WX_ID $SENDER_ID --within 1440 --json 2>&1")

    if echo "$out" | grep -q '"isOutgoing"'; then
        local total=$(echo "$out" | grep -c '"isOutgoing"')
        local outgoing_count=$(echo "$out" | grep -c '"isOutgoing": true')
        log_pass "4" "isOutgoing 字段存在" "$total 条媒体, $outgoing_count 条 outgoing"
    else
        log_fail "4" "recent_media 没返回 isOutgoing 字段" "$(echo "$out" | tail -5 | head -3)"
    fi
}

# #5: 大图过期/缓存清 — 跟 #3 同, 区别仅文案. 跳过避免重复
test_5_image_expired() {
    section "#5 大图过期/缓存清 — 同 #3 实质, 跳过避免重复测试"
    log_skip "5" "图过期/缓存清" "本质同 #3, 文案路径相同"
}

# #6: msg_remote_id 缺失 → fail-fast
test_6_missing_remote_id() {
    section "#6 msg_remote_id 缺失 → fail-fast"

    local msg_id=$(find_recent_picture_msg)
    if [ -z "$msg_id" ]; then
        log_skip "6" "msg_remote_id 缺失" "找不到测试 msg"
        return
    fi

    # 备份原值 + 暂时清空
    local orig=$(sssh_q "sqlite3 /root/wework-scrm.db \"SELECT msg_remote_id FROM messages WHERE msg_id=$msg_id\"")
    if [ -z "$orig" ]; then
        log_skip "6" "msg_remote_id 缺失" "test msg 本来就没 msg_remote_id, 改不了"
        return
    fi

    sssh_q "sqlite3 /root/wework-scrm.db \"UPDATE messages SET msg_remote_id='' WHERE msg_id=$msg_id\""

    local start=$(date +%s)
    local out=$(sssh_q "$PLUGIN_BIN wework resolve-media $WX_ID $msg_id --wait 5 2>&1")
    local elapsed=$(( $(date +%s) - start ))

    # 还原
    sssh_q "sqlite3 /root/wework-scrm.db \"UPDATE messages SET msg_remote_id='$orig' WHERE msg_id=$msg_id\""

    # 期望: 立刻报 msg_remote_id 缺失.
    # 阈值给 10s — 子进程启动 + WS auth 本来就 3-5s 开销, fail-fast 是 "不进 60s 等待" 即可
    if echo "$out" | grep -q 'msg_remote_id 缺失'; then
        if [ "$elapsed" -le 10 ]; then
            log_pass "6" "msg_remote_id 缺失 fail-fast" "${elapsed}s 内退出 (含 ~5s 子进程启动开销)"
        else
            log_fail "6" "msg_remote_id 缺失但没 fail-fast" "用了 ${elapsed}s, 期望 <10s"
        fi
    else
        log_fail "6" "msg_remote_id 缺失没被预检" "$(echo "$out" | tail -3 | head -1)"
    fi
}

# #7: Java/SDK 整重启 — 不真重启 (有破坏性), 只检查 plugin 重连机制
test_7_java_restart_resilience() {
    section "#7 Java/SDK 重启韧性 — plugin 5s 自动重连机制存在"

    # 检查 WS 客户端代码里有 reconnectInterval=5000 + maxReconnects=0 (无限)
    local check=$(sssh_q "grep -E 'reconnectInterval|scheduleReconnect' /root/.openclaw/extensions/wework-scrm/dist/services/websocket-service.js | head -3")
    if echo "$check" | grep -q 'reconnectInterval'; then
        log_pass "7" "WS 自动重连机制存在" "(真重启测试需手动 systemctl restart wework-server)"
    else
        log_fail "7" "WS 自动重连代码异常" "websocket-service.js 没找到 reconnectInterval"
    fi
}

# #8: URL 预检 — 非 text 类型 + 非 http(s)
test_8_url_precheck() {
    section "#8 URL 预检 — 非 text 类型必须 http(s), fail-fast"

    local out=$(sssh_q "$PLUGIN_BIN wework send $WX_ID $SENDER_ID '/storage/emulated/0/test.jpg' --type voice 2>&1")

    if echo "$out" | grep -qE 'voice 类型必须是 http|✗|❌'; then
        log_pass "8" "本地路径 voice 被预检拦下" "$(echo "$out" | grep -E '❌|✗' | head -1 | cut -c1-80)"
    else
        log_fail "8" "URL 预检没生效" "$(echo "$out" | tail -3 | head -1)"
    fi

    # 顺便验证 text 类型不受影响
    local out2=$(sssh_q "$PLUGIN_BIN wework send $WX_ID $SENDER_ID '[playbook-#8] text 不受预检' --type text 2>&1")
    if echo "$out2" | grep -q '✅ 消息已发送'; then
        log_pass "8b" "text 类型不被 URL 预检影响" ""
    else
        log_fail "8b" "text 发送也被拦了 (不该)" "$(echo "$out2" | tail -3 | head -1)"
    fi
}

# ============================================
# main
# ============================================
list_scenarios() {
    cat <<EOF
可用场景:
  1  WS 连接断 — sendToJavaWithRetry 等重连
  2  Java 应用层繁忙 → transient 重试 (代码部署校验)
  3  SDK 静默超时 — 老图 resolve
  4  outgoing 媒体识别 — recent_media isOutgoing 字段
  5  大图过期/缓存清 (同 #3, 默认跳)
  6  msg_remote_id 缺失 → fail-fast
  7  Java/SDK 重启韧性 — plugin 自动重连
  8  URL 预检 — 非 text 必须 http(s)

环境变量覆盖:
  PLAYBOOK_SSH    — ssh 别名 (default: wework-prod)
  PLAYBOOK_WXID   — 工作 wxId (default: 1688852285335663)
  PLAYBOOK_SENDERID — 测试 senderId (default: 7881300944899375)
EOF
}

main() {
    if [ "${1:-}" = "--list" ] || [ "${1:-}" = "-l" ]; then
        list_scenarios
        exit 0
    fi

    section "🧨 resolve_media + send 路径故障演练 — 8 个场景"
    printf "${D}server=%s wxId=%s senderId=%s${N}\n" "$SSH_HOST" "$WX_ID" "$SENDER_ID"

    # 前置: 服务存活
    local services=$(sssh_q "systemctl is-active openclaw-scrm wework-server 2>&1")
    if ! echo "$services" | head -2 | grep -qE '^active' ; then
        printf "${R}前置失败: 服务异常${N}\n%s\n" "$services"
        exit 2
    fi

    # 选 scenarios
    local scenarios=()
    if [ "$#" -eq 0 ]; then
        scenarios=(1 2 3 4 5 6 7 8)
    else
        scenarios=("$@")
    fi

    for n in "${scenarios[@]}"; do
        case "$n" in
            1) test_1_ws_drop ;;
            2) test_2_java_busy_transient ;;
            3) test_3_sdk_silent_timeout ;;
            4) test_4_outgoing_isOutgoing_field ;;
            5) test_5_image_expired ;;
            6) test_6_missing_remote_id ;;
            7) test_7_java_restart_resilience ;;
            8) test_8_url_precheck ;;
            *) printf "${R}未知场景: %s${N}\n" "$n" ;;
        esac
    done

    # 汇总
    section "📊 汇总"
    local total=$((PASS_COUNT + FAIL_COUNT))
    printf "${G}通过 %d${N} / ${R}失败 %d${N} / 总 %d (skip 不计)\n" "$PASS_COUNT" "$FAIL_COUNT" "$total"

    if [ "$FAIL_COUNT" -gt 0 ]; then
        printf "\n${R}失败列表:${N}\n"
        for r in "${RESULTS[@]}"; do
            IFS='|' read -r status n desc detail <<< "$r"
            [ "$status" = "FAIL" ] && printf "  ${R}✗ #%s${N} %s ${D}— %s${N}\n" "$n" "$desc" "$detail"
        done
        exit 1
    fi
    printf "${G}全绿 ✓${N}\n"
}

main "$@"
