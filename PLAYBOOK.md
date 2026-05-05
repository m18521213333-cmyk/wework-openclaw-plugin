# 🧨 故障演练 Playbook — resolve_media 8 个失败场景

> 5/5 实测 13:46 那次失败暴露出系统只覆盖了 3 个失败模式. 全梳理 8 种, 每个加触发方法 + 期望行为 + 真出现时的诊断步骤.
>
> 用法: 改完代码后, 抽 30 分钟挨个跑这 8 个场景, 验证每个都触发期望行为. 比"等真用户撞 bug"快得多.

---

## 失败场景全清单

| # | 场景 | 触发 | 期望行为 (改完代码后) |
|---|---|---|---|
| 1 | **WS 连接断** | 重启 wework-server 期间发指令 | sendToJavaWithRetry 等重连 + 重试, 用户感知不到 (≤15s 恢复) |
| 2 | **Java 应用层繁忙** ("其他任务下载中") | 同时跑多个 resolve-media | transient 重试 ×3, 总耗时 ~15s, 第 N 次成功就退出 |
| 3 | **SDK 静默超时** | resolve 一张已删/过期的图 | 60s 后 fail, 文案 "SDK 静默无响应, 退回手动转发" |
| 4 | **outgoing 自己发的媒体** | /ai 转发"刚才你自己发出去的图" | recent_media 返 isOutgoing=true, LLM 直接告诉用户手动转 |
| 5 | **大图过期/缓存清** | 过 24h 后的旧图触发 resolve | 60s 静默 → 同 #3 退回手动 |
| 6 | **msg_remote_id 缺失** | 改 sqlite 把某 msg 的 msg_remote_id 设空 | resolve-media 立刻 fail-fast, 不发 download 请求 |
| 7 | **整个 Java/SDK 重启** | systemctl restart wework-server | sendToJavaWithRetry 等重连 (≤30s), 然后 resolve 走正常流程 |
| 8 | **URL 预检** | LLM 把 `/storage/emulated/...` 当 URL 发 | send fail-fast, 给出正确指引 |

---

## 怎么演练

### 场景 1: WS 连接断

```bash
# Term 1: 启一个长任务
ssh wework-prod '/usr/local/bin/openclaw wework send 1688852285335663 7881300944899375 "test1" --type text'

# 同时 Term 2: 重启 Java
ssh wework-prod 'systemctl restart wework-server'
```

**期望**: Term 1 看到 `[retry] 第 N 次尝试 (connected=false...)`, 等 Java 起来后自动成功

---

### 场景 2: Java 应用层繁忙 — **当前最高频的真实失败**

```bash
# 同时并发 2 个 resolve-media (模拟 LLM 串行调用时被自己撞)
ssh wework-prod 'for msg in 7636279822044462401 7636279822044462402; do \
    /usr/local/bin/openclaw wework resolve-media 1688852285335663 $msg --wait 30 & \
  done; wait'
```

**期望** 至少一个 ⏳ 看到 `Java 繁忙 ("其他任务下载中"), 5s 后重试`, 总耗时 ~30s 内

---

### 场景 3: SDK 静默超时

```bash
# 找一张老图 (超过 24h 的) 试 resolve
# 用 sqlite 查一个老 msgId
ssh wework-prod 'sqlite3 /root/wework-scrm.db "SELECT msg_id FROM messages WHERE content_type=\"Picture\" AND created_at < datetime(\"now\", \"-24 hours\") ORDER BY id DESC LIMIT 1"'

# 拿到 msgId 后:
ssh wework-prod 'time /usr/local/bin/openclaw wework resolve-media 1688852285335663 <msgId> --wait 60'
```

**期望**: 60s 后输出 `❌ 60s 内手机 SDK 静默无响应 (常见: outgoing/缓存清/SDK 不支持). 退回手动转发更稳`

---

### 场景 4: outgoing 自己发的媒体 — **LLM 决策测试**

**手动触发**:
1. 你手机企微对自己发一张图
2. /ai 把刚才发的图发给XX

**期望**:
- recent_media 返 `isOutgoing: false` (你企微对自己发, sender 是你 — 算 outgoing 吗? 看具体场景)
- 实际上你手机对自己发是个特殊情况, 验证字段值是否符合直觉

**直接 CLI 验证 isOutgoing 字段**:
```bash
ssh wework-prod '/usr/local/bin/openclaw wework recent-media 1688852285335663 7881300944899375 --within 120 --json' | grep isOutgoing
```

---

### 场景 5: 大图过期/缓存清

跟 #3 同, 区别只是文案语义.

---

### 场景 6: msg_remote_id 缺失

```bash
# 模拟坏数据: 把某 msgId 的 msg_remote_id 改空
ssh wework-prod 'sqlite3 /root/wework-scrm.db "UPDATE messages SET msg_remote_id=\"\" WHERE msg_id=<某 msgId>"'

# 试 resolve
ssh wework-prod '/usr/local/bin/openclaw wework resolve-media 1688852285335663 <msgId>'
```

**期望**: 立刻输出 `❌ msg_remote_id 缺失... 手机 SDK 不会响应 download 请求`

完事**记得改回去**:
```bash
# 找 msg_remote_id 备份 (从 messages 表别的字段反查 / 或 Java 推送日志看)
```

---

### 场景 7: Java/SDK 整个重启

```bash
# 整个重启 wework-server 期间观察 plugin
ssh wework-prod 'systemctl restart wework-server'
sleep 5
# 试 resolve-media
ssh wework-prod '/usr/local/bin/openclaw wework resolve-media 1688852285335663 <msgId>'
```

**期望**: 重启完 5-30s 内 ESTAB 重连, plugin 自动 resume, resolve-media 正常跑

---

### 场景 8: URL 预检 — fail-fast

```bash
# 故意发本地路径
ssh wework-prod '/usr/local/bin/openclaw wework send 1688852285335663 7881300944899375 "/storage/emulated/0/abc.jpg" --type voice'
```

**期望**: 立刻输出
```
❌ voice 类型必须是 http(s) URL, 不能是手机本地路径 / 文件路径...
   ↳ 如果想发本地图片, 先 wework upload <path> 拿 URL...
   ↳ 如果想转发用户发的媒体, 先 wework recent-media + wework resolve-media...
```

---

## 真出问题时的诊断步骤

```bash
# 1. 看刚才 /ai 失败的具体日志
ssh wework-prod 'journalctl -u openclaw-scrm --since "10 min ago" --no-pager | grep -E "AICmd|Download|resolve" | tail -30'

# 2. 看那条 msgId 的 SQLite 记录
ssh wework-prod 'sqlite3 /root/wework-scrm.db "SELECT msg_id, is_send, content_type, length(content), msg_remote_id FROM messages WHERE msg_id=<msgId>"'

# 3. 看 resolved_media 状态
ssh wework-prod 'sqlite3 /root/wework-scrm.db "SELECT * FROM resolved_media WHERE msg_id=<msgId>"'

# 4. 看 Java 那边看到啥
ssh wework-prod 'journalctl -u wework-server --since "10 min ago" --no-pager | grep -iE "DownloadFile|<msgId>" | tail -20'

# 5. 看手机 SDK 在线状态
ssh wework-prod 'DBPW=$(grep "^spring.datasource.password" /opt/wework/wework-server/target/classes/application.properties | cut -d= -f2); mysql -uroot -p"$DBPW" -Dworkchat -e "SELECT wxid, name, isonline, login_time FROM tbl_wx_accountinfo"'
```

## 遇到新失败模式怎么办

1. 加到上面表格里, 编号 #9 / #10 / ...
2. 写触发方法 + 期望行为
3. 在 `storage-service.ts` 的 `isTransientResolveError` 关键词列表加新关键词 (如果是 transient)
4. 在 `index.ts` 的 resolve-media CLI 加新分支 (如果是新 outcome)
5. 跑一次 `playbook` 全套, 确认现有场景没回归
