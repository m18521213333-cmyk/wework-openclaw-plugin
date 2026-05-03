#!/usr/bin/env bash
# ============================================================
# WeWork SCRM 业务场景测试脚本
#
# 演示三个真实业务场景:
#   场景 1: 建 vip 群 + 拉客户 + 自动发欢迎语
#   场景 2: 朋友圈推广 (上传本地图 + 带图发朋友圈)
#   场景 3: 群发促销消息 (从历史聊天拉所有客户 + 群发)
#
# 用法:
#   ./scripts/scenarios.sh 1               # 跑场景 1
#   ./scripts/scenarios.sh all             # 全部跑
#   IMG=/local/path.jpg ./scripts/scenarios.sh 2  # 场景 2 自定义图
# ============================================================

set -uo pipefail

WX_ID="${WX_ID:-1688852285335663}"
SCENARIO="${1:-1}"

# 默认测试客户 ID (孟伟在企微的真实客户 ConvId)
CUSTOMER_1="${CUSTOMER_1:-7881301077900374}"
CUSTOMER_2="${CUSTOMER_2:-7881300944899375}"

c_blue()  { printf '\033[34m%s\033[0m\n' "$*"; }
c_green() { printf '\033[32m%s\033[0m\n' "$*"; }
c_yel()   { printf '\033[33m%s\033[0m\n' "$*"; }
section() { echo; c_blue "════ $* ════"; echo; }

# ============================================================
# 场景 1: 建 vip 群 + 拉客户 + 自动发欢迎
# ============================================================

scenario_1_create_vip_group() {
  section "场景 1: 建 vip 群 + 自动欢迎"

  local group_name="智简vip$(date +%Y%m%d)"
  local welcome="🎉 欢迎加入「$group_name」!

群规:
1. 仅供 vip 客户内部交流
2. 每周三发布新品资料
3. 有问题艾特群主即可

(本消息由 OpenClaw wework 插件在建群成功后自动发送)"

  c_yel "▸ 建群 \"$group_name\" + 拉 2 个客户 + 设欢迎语"
  echo

  wework group "$WX_ID" create \
    --members "$CUSTOMER_1" "$CUSTOMER_2" \
    --content "$group_name" \
    --send-after "$welcome"

  echo
  c_yel "▸ pending_tasks 状态 (service 后台监听 ConversationAddNotice)"
  sqlite3 /root/wework-scrm.db \
    "SELECT task_id, match_key, status, result_conv_id, datetime(created_at) FROM pending_tasks WHERE match_key='$group_name' ORDER BY id DESC LIMIT 1;"

  echo
  c_green "✅ 场景 1 已下发. 群名='$group_name'"
  c_yel "  — service 收到 ConvAddNotice 后会自动发欢迎消息"
  c_yel "  — 5 秒后再 SELECT 看 status (应变成 'done')"
}

# ============================================================
# 场景 2: 朋友圈推广 (本地图 → 上传 → 带图发)
# ============================================================

scenario_2_post_moments_with_image() {
  section "场景 2: 朋友圈推广 (本地图 → 上传 → 带图发)"

  local local_img="${IMG:-}"
  local img_url=""

  if [ -n "$local_img" ] && [ -f "$local_img" ]; then
    c_yel "▸ 上传本地图 $local_img"
    img_url=$(wework upload "$local_img" 2>/dev/null | grep "✅" | awk '{print $2}')
    if [ -z "$img_url" ]; then
      echo "❌ 上传失败"
      return 1
    fi
    c_green "  上传完成: $img_url"
  else
    c_yel "▸ (没指定 IMG, 用服务器现成图测试)"
    img_url=$(ls /app/storage/attachment/*/*.jpg 2>/dev/null | head -1 | sed 's|/app/storage|http://60.205.94.161|')
    [ -z "$img_url" ] && { echo "❌ 服务器没图, 请用 IMG=/path/to.jpg 指定"; return 1; }
    c_green "  使用: $img_url"
  fi

  echo
  c_yel "▸ 发朋友圈 (带图)"
  local content="🎁 本周新品 ${img_url##*/}

颜色: 限定 / 尺码: S/M/L/XL
点击图片查看详情 ↑

(OpenClaw wework 插件自动发布 - $(date +%Y-%m-%d))"

  wework moments "$WX_ID" "$content" --type image --media "$img_url"

  echo
  c_green "✅ 场景 2 完成. 朋友圈已发布"
}

# ============================================================
# 场景 3: 群发促销消息 (从历史聊天拉客户)
# ============================================================

scenario_3_mass_send_promo() {
  section "场景 3: 群发促销消息"

  c_yel "▸ 从 SQLite 拉所有有过聊天的客户 ConvId"
  local convs
  convs=$(sqlite3 /root/wework-scrm.db \
    "SELECT DISTINCT conv_id FROM messages WHERE wx_id=$WX_ID AND is_send='false' GROUP BY conv_id;" | tr '\n' ' ')
  local count
  count=$(echo "$convs" | wc -w)
  c_green "  拉到 $count 个会话"

  if [ "$count" -lt 1 ]; then
    echo "❌ 没有任何客户聊天记录, 跳过"
    return 1
  fi

  local promo="📣 周末促销!

会员日 8 折优惠 (仅限 vip 客户)
活动时间: $(date -d "tomorrow" +%Y-%m-%d) ~ $(date -d "+3 days" +%Y-%m-%d)

详情戳店内活动页 ⬇

(OpenClaw 插件群发)"

  echo
  c_yel "▸ 群发到 $count 个客户"
  wework mass-send "$WX_ID" "$promo" --to $convs

  echo
  c_green "✅ 场景 3 完成. 已群发到 $count 个会话"
}

# ============================================================
# Main
# ============================================================

case "$SCENARIO" in
  1)   scenario_1_create_vip_group ;;
  2)   scenario_2_post_moments_with_image ;;
  3)   scenario_3_mass_send_promo ;;
  all) scenario_1_create_vip_group; scenario_2_post_moments_with_image; scenario_3_mass_send_promo ;;
  *)   echo "用法: $0 <1|2|3|all>"; exit 1 ;;
esac
