# OpenClaw 指挥工作手机 — 测试用例清单

> 5/4 22:30 完整自验证通过. 你按 **从无副作用 → 高副作用** 顺序测.
> 所有命令都在服务器 SSH 里跑.

## 准备

```bash
ssh wework-prod
# 或本地: ssh root@60.205.94.161
```

确认手机在线 (重要 — 离线时 MCP 直接拒绝):
```bash
wework health
# 看 service:ws_connected ✅ + 手机 SDK 在线
```

---

## 🟢 第 1 组 — 无副作用 (随便测)

### 1.1 综合健康检查

```bash
wework health
```
**预期**: 14 项全 ✅ Summary: 全绿

### 1.2 手机/WS 状态

```bash
wework status
```
**预期**: Java WS ✅ 已连接, 手机 SDK ✅ 在线 孟伟

### 1.3 列联系人 (本地缓存 204 个)

```bash
wework contacts 1688852285335663 -n 10
```
**预期**: 列出最近同步的联系人, 含赵丽/王业帆等

### 1.4 按名字找 convId

```bash
wework find-contact 1688852285335663 王
wework find-contact 1688852285335663 赵丽
```
**预期**: 模糊匹配返回多条 (王XX) / 单条 (赵丽)

### 1.5 看会话历史 (直读 SQLite, 真内容)

```bash
wework history 1688852285335663 1688850338121834 -n 5    # 周丁豪
wework history 1688852285335663 1688857604237023 -n 5    # 余燕
```
**预期**: 显示真实消息内容 (Text 已 base64 解码), 含发送方向 ←/→

### 1.6 手机离线历史

```bash
wework events -n 5
```
**预期**: 列出每次手机 SDK 上下线时间 + 持续时长

---

## 🟡 第 2 组 — 单聊发送 (轻量, 给 1 人发 1 条)

### 2.1 自然语言驱动 (推荐入口)

```bash
wework-ai "给客户余燕发: 你好, 这是 LLM 自动测试"
wework-ai "给周丁豪发条简短问候"
wework-ai "看周丁豪最近聊了啥, 给个得体回复"
```
**预期**: LLM 自动 find-contact → get-history → send-message, 客户企微真收到

### 2.2 CLI 直驱 (备用)

```bash
wework send 1688852285335663 7881300944899375 "CLI 直驱测试"
wework send-image 1688852285335663 7881300944899375 /tmp/test.jpg
```
**预期**: 立即 ✅ 已发送; 客户企微收到

### 2.3 撤回 (限 2 分钟内)

```bash
# 先 send 拿到 msgId, 然后:
wework revoke 1688852285335663 <msgId> <convId>
```

---

## 🟠 第 3 组 — 朋友圈 (中等, 全好友可见)

### 3.1 LLM 发纯文朋友圈

```bash
wework-ai "发朋友圈: 周末好, 这是 OpenClaw 自动驱动测试"
```

### 3.2 CLI 发带图朋友圈

```bash
URL=$(wework upload /tmp/test.jpg | grep "✅" | awk '{print $2}')
wework moments 1688852285335663 "新品上架!" --type image --media "$URL"
```

### 3.3 查我自己的朋友圈

```bash
wework my-moments 1688852285335663
```

---

## 🔴 第 4 组 — 群操作 (重等, 真创群拉人)

### 4.1 LLM 建群+欢迎 (一条命令)

```bash
wework-ai "建群名为 测试群$(date +%H%M) 拉余燕(remoteId=1688857604237023) 周丁豪(remoteId=1688850338121834) 进来, 群里发: 欢迎进群"
```
**预期**: 异步, 群创建后 ConvAdd 推送 → service 自动发欢迎

### 4.2 CLI 建群

```bash
wework group 1688852285335663 create \
  --members 1688857604237023 1688850338121834 \
  --content "今晚 vip 群" \
  --send-after "🎉 欢迎进群"
```

### 4.3 改群名 / 加人 / 看成员

```bash
wework group 1688852285335663 set_name --group <convId> --content "新群名"
wework group 1688852285335663 add_member --group <convId> --members <remoteId>
wework group 1688852285335663 list_members --group <convId>
```

### 4.4 看 pending 任务状态

```bash
sqlite3 /root/wework-scrm.db "SELECT task_id, match_key, status, result_conv_id, datetime(created_at,'localtime') FROM pending_tasks ORDER BY id DESC LIMIT 5;"
```

---

## 🔥 第 5 组 — 群发 (最重等, 多人同时收, 慎重)

### 5.1 LLM 群发 (告诉它范围)

```bash
wework-ai "给余燕和周丁豪同时发: 这是 LLM 群发测试"
```

### 5.2 CLI 群发

```bash
wework mass-send 1688852285335663 "周末促销, 仅限今日 8 折" \
  --to 1688857604237023 1688850338121834
```

### 5.3 业务场景一键 (3 个全跑)

```bash
/root/.openclaw/extensions/wework-scrm/scripts/scenarios.sh all
```

---

## 🤖 第 6 组 — LLM 复合任务 (最难, 验证 LLM 真理解)

### 6.1 看上下文 + 情境化回复

```bash
wework-ai "周丁豪 convId=1688850338121834 最近抱怨了什么? 看完根据他抱怨内容写一条真诚得体的回复发给他"
```

### 6.2 全部客户群发促销 (从 SQLite 拉)

```bash
wework-ai "把跟我聊过天的所有客户拉个名单, 给他们群发: 新品上线"
```

### 6.3 多步: 建群 + 拉人 + 改名 + 发欢迎

```bash
wework-ai "建一个 VIP 客户群, 把余燕和周丁豪拉进来, 群名设为 '今日 VIP', 进群欢迎语: '欢迎你们进 VIP 群, 后续有专享福利'"
```

---

## ⚠️ 测试时注意

1. **手机离线时所有发送类一律拒绝** — MCP server 会先查 isonline=0 才让发, 不再误报"成功". 离线了开 SCRM App 重登.
2. **LLM 调用 30s 内完成** — 升级 4C/8G 后正常应是 5-30s. 超过 60s 说明系统又降级了, 跑 `wework health` 看.
3. **测试群/朋友圈/群发 会真发到客户**, 你的客户能看到. 非真测试场景请改成自己的测试号或临时群.
4. **撤回限 2 分钟内** — 错过窗口就没法撤, 企微限制.
5. **联系人 30 分钟自动重新同步**, 你新加的联系人 30min 内会出现在 contacts 里.

---

## 故障排查速查

| 症状 | 第一步 |
|---|---|
| LLM 报"消息已发送"但客户没收到 | 看 `wework status` isonline=1? 手机离线了 |
| LLM 调用 60s+ 超时 | `wework health` 看 swap 用量, RAM 够吗 |
| `wework history` 没数据 | 看 SQLite messages 表, Java 是不是没推 |
| `wework find-contact` 找不到 | `wework sync 1688852285335663 contacts` 主动同步, 等 30s |
| 建群欢迎没发到群里 | `sqlite3 ~/wework-scrm.db "SELECT * FROM pending_tasks ORDER BY id DESC LIMIT 5"` 看 status |
| Kimi LLM 调用 hang | `pkill -9 -f openclaw` 清残留, `systemctl restart openclaw-scrm` |

---

测完每条记一下 ✅/❌, 我看反馈再修.
