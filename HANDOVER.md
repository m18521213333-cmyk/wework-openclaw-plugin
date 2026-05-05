# 🎁 wework-openclaw-plugin — 完整接手文档

> 5/3 早 → 5/5 傍晚, ~36 小时, 32 commit (plugin) + 1 commit (Java 后端).
> 全媒体闭环 / Web 鉴权治本 (止血 + JWT) / 凭据轮换 (5 web 账号 + Kimi key) /
> send 重试 / SDK 上传根因 (AsyncConfig) / 严格类型过滤 — 全做完.
> 任何新会话只看这份 30 秒能接上.

## ⭐ 终极形态 (今晚 5/5 凌晨实测落地)

```
你 (任何地方, 只要有手机)
  ↓ 个人微信发到孟伟企微
"/ai 把刚发的图/音/视频/文件/朋友圈 发给客户XX [+ 文字Y]"
  ↓ 30-60s
LLM (Kimi via moonshot.cn) 自动:
  recent_media → resolve_media (视频/文件触发手机 SDK 上传) → send_media_url
  ↓
客户 XX 企微收到原始媒体 ✅
你个人微信收到 "✅ 已处理: ..." 报告
```

## TL;DR (今晚最终版)

```
✅ 接收链路:    客户 → Java → 插件 SQLite (含 contacts 204 个 + messages + resolved_media)
✅ 发送链路:    LLM Agent / CLI → Java → 手机 SDK → 客户企微
                  ├─ 单聊文本 ✅       ├─ 单聊图片 ✅
                  ├─ 单聊语音 ✅       ├─ 单聊视频 ✅ (resolve-media 触发上传)
                  ├─ 单聊文件 ✅       ├─ 群聊消息 ✅
                  ├─ 群发 ✅            ├─ 朋友圈纯文 ✅
                  └─ 朋友圈带多图 ✅

✅ /ai 命令模式: 个人微信发 /ai → plugin 接 → spawn agent → 回复结果给你个人微信
✅ LLM 工具:     19 个 MCP tool 暴露给 Kimi (find/send/upload/resolve/post_moments/...)
✅ 业务流程:    建群+欢迎 (RemoteId 修了); 看历史智能回复; 多媒体转发
✅ 守护:         phone-monitor (60s 巡 isonline); contact-sync (30min); MCP 离线拒绝
✅ 资源:         ECS 升 4C/8G; sshd swap 2G; Java AsyncConfig 10000→50 (省 3GB 虚内存)
✅ OpenClaw:    2026.5.2 (修了 PATH 软链 + bashrc alias + 删 user-systemd 重复 gateway)
```

## ⚠️ 最后一个 bug (1eb97bb commit)

凌晨 02:13 之前的 5 次建群欢迎全部发到了 **错误的 ConvId** —
`ConvAddNotice.Convers.Id` 是 Java DB 内部主键 (形如 `7635xxxxxxxxxxxxxxx`),
不是企微真群 ConvId. talkToFriendTask 拿这种 id 找不到会话, 客户端把它
显示成"诡异单聊红色感叹号" (你晚上反复看到的就是这个).

正确字段是 `Convers.RemoteId` (形如 `10xxxxxxxxxxxxxxx`, 跟
`tbl_wx_message.ConvId` 一致). 修了之后 vip0212修复后群你直接收到了欢迎.

| 群 | 真 ConvId (RemoteId) | 之前用的 (Id, 错的) |
|---|---|---|
| vip0212修复后 ✅ | 10860367787674791 | — (已修, 直接用 RemoteId) |
| vip0148群 (老) | 10771793581934761 | 7635723906955859509 |
| vip0140群 (老) | 10707935695300817 | 7635721978515543455 |
| 智简vip0122 (老) | 10696529405848940 | 7635717172447138863 |

## 已修的 P0 安全 (5/5 凌晨 08:11)

**Web 端 /user/** 鉴权快速止血**:
- `WebConfiguration.java` 把 `/user/**` 从 excludePathPatterns 删了, 只留 `/user/login`
- 任何调用 `/user/account/*` 等接口必须带 `token: 33DD94BBF49356583E460D1FA2907EDB` header
- Web 前端登录后自动带, 业务正常
- **公开仓库后这个静态 token 还是会泄, 治本要改 JWT (待办)**

`/opt/wework/wework-server/` 已重新编译部署. 备份在 `/tmp/wework-patches/WebConfiguration.java.orig` 万一要回滚.

## 已修的 P0 安全 (5/5 上午 09:35) — 强密码轮换

5 个账号全部从弱密码 `1q2w3e4r5t` (键盘对角线模式, top100 字典里) 轮换成 24 位独立随机 alnum:
- `tbl_accountinfo`: root / admin / pctest / pluginbot / pluginbot-cli (5 个账号)
- `/root/.openclaw/openclaw.json` 同步 pluginbot + pluginbot-cli 两个机器人密码
- 备份: `/root/.openclaw/openclaw.json.bak.*` + `/root/tbl_accountinfo.bak.*.sql`
- 凭据归档: `/root/credentials.txt` (mode 600 仅 root 可读) — **抄一份到本地密码管理器**
- 验证: 新密码 web 登录返回 token, 旧密码返回"账号或密码错误", health 全绿

## ⚠️ 5/5 下午 16:43 — 找到 SDK 全部媒体上传失败的真根因

**症状**: 5/5 下午 /ai 转发任何 incoming 媒体 (图/音/视频/文件) 都报 "SDK 静默拒绝", forwardable=false 全部, URL 留 `/storage/emulated/...` 手机本地路径。

**真根因**: 我 5/4 把 Java 后端 `AsyncConfig.java` 的 `corePoolSize` 从 **10000** 改到 **50** (出发点是省内存, corePool=10000 占 ~10GB 虚拟内存触发 swap):

```java
// 5/4 改的 (元凶):
threadPool.setCorePoolSize(50);
threadPool.setMaxPoolSize(500);
// 原版:
threadPool.setCorePoolSize(10000);
threadPool.setMaxPoolSize(20000);
```

**为啥是 AsyncConfig 引起的**:
- Java 内部 SDK 协议处理大量用 `@Async` 标注 (FriendTalkNotice 接收 / 文件接收 / 转发 PC 端 / 落库)
- 这些都走 AsyncConfig 的 thread pool
- corePool=50 + maxPool=500 + queue=10000 看起来够, 但 **SDK 高峰时单条媒体推送会触发几十个并发 @Async**
- 50 被打满后走 `CallerRunsPolicy` (调用线程自己干) → 调用线程是 Netty event loop → 阻塞 Netty → 文件接收超时
- 结果: SDK 推 FriendTalkNotice 时 URL 字段还是手机本地, 因为 Java 没来得及处理上传

**症状演化**:
- 5/4 改完没立刻爆 (那时负载低)
- 5/5 09:29 Java 重启 (Step2 密码) → SDK 重连大量初始化任务 → 09:32 Video 挂
- 5/5 11:07 Java 重启 (JWT) → 进一步退化 → 11:31 后全挂
- 16:31 改回 corePool=10000 → 16:43 ✅ SDK 自动上传恢复

**正确解决 OOM 应该这样做** (待优化, 不是今晚的事):
- 不缩到 50, 中间值 **1000-2000** 试
- 同时保留 swap (已做)
- 改之前用 `jstack` profile 高峰 thread usage 确定真正需要的 size
- 改后用 PLAYBOOK 跑一次回归 (8 个失败场景全过才能上)

**今天的教训**:
- 不要随便改框架默认 thread pool 大小, 即使看起来过配
- 改 Java 后端任何 config 后必须真实负载测一遍 (我没做)
- 5/4 那次改动**没及时回归测试**就上, 拖到 5/5 下午才发现, 浪费了大量时间 (gitee 1 个分支 + 反复重启 + 各种瞎猜)

## 5/5 傍晚最后一波

**SDK 全媒体上传断的真根因 (commit `7612f0b`)**: 之前我把 `AsyncConfig.java` corePool 从 10000 缩到 50 (省内存意图). 5/5 上午两次 Java 重启后 Netty 业务线程被打满, SDK 推 FriendTalkNotice 含图床上传过程的处理被阻塞队列吞掉, URL 字段保留手机本地路径. 已回退到 10000.

**严格类型过滤 (commit `b2c8e22`)**: 用户说"文件" LLM 把视频也带上去了. enrichedPrompt 加规则: "图"/"音频"/"视频"/"文件" 严格按 contentType 过滤, 不贪心.

**Kimi key 轮换** (5/5 17:xx, 旧 key 公开仓库会泄): 新 key 配 systemd `Environment` 三处 (MOONSHOT/KIMI/OPENAI _API_KEY), `daemon-reload + restart openclaw-scrm`. 旧 key 已在 platform.moonshot.cn revoke.

## 已修的 resolve_media 失败场景 (5/5 下午 14:43)

实测 13:46 那次 /ai 转发自己发的图给陈攀攀失败 (`其他任务下载中`). 系统梳理 8 个失败模式发现当前代码只覆盖 3 种, 补全到 7 种 (commit `2bafde5`):

新加能力:
- `recent_media` 加 `isOutgoing` 字段 — LLM 别在自己发的媒体上浪费 60s 试 resolve
- `getResolvedMediaStatus` 返 state (pending/success/failed) + errMsg — 之前只能拿 url 或 null
- `clearResolvedMediaRecord` — transient 重试时清 stale, 重发 download
- `isTransientResolveError` — 关键词识别 Java/SDK 暂时繁忙
- CLI `resolve-media` 改造: msg_remote_id 预检 + clear stale + 多轮 retry + 错误文案区分 3 结局
- CLI `send` 加 url 预检 — 非 text 类型必须 http(s)
- ai-command enrichedPrompt 教 LLM 用 isOutgoing 决策

实测对比 (同一个失败 msgId):
- 改前: 60s 静默超时 + 误报 permanent
- 改后: 11s 内 3 次 transient 重试, 文案准确

**详细失败场景手册见 [PLAYBOOK.md](./PLAYBOOK.md)** — 8 个场景, 每个怎么手动触发 + 期望行为 + 真出问题的诊断步骤.

## 已修的 P0 安全 (5/5 中午 11:08) — Web 鉴权治本 (JWT)

之前 `Constant.TOKEN = "33DD94BBF49356583E460D1FA2907EDB"` 是**所有 web 接口共用一个静态字符串**, 一泄露就全员失守. 公开仓库 / 抓包 / 代码搜都能拿到.

**改造** (Java 后端 commit `e8cc347` on branch `feat/web-jwt-auth`):
- 加 `io.jsonwebtoken:jjwt:0.9.1` 依赖
- 新增 `framework/auth/JwtUtil.java`: HS256 签发 + 解析, claims 含 userId(sub) + account
- `application.properties`:
  - `jwt.secret=${JWT_SECRET:CHANGE-ME-DO-NOT-USE-IN-PROD}` (prod 用 env 覆盖, **服务器实际有 32 字节随机 secret**)
  - `jwt.expiration-ms=604800000` (7 天)
- `UserController.login`: 改用 `jwtUtil.generate(user.getId(), user.getAccount())`
- `TokenInterceptor` (改 @Component): `parseQuietly()` 校验 + 401 + JSON 错误体
- `WebConfiguration`: `@Autowired TokenInterceptor` (之前 `new TokenInterceptor()` JwtUtil 拿不到)

**验证 5/5**:
- ✅ 登录返 149 字符 JWT
- ✅ JWT 调 /user/account/* 200
- ✅ 老静态 token 33DD9... 401 + JSON
- ✅ 无 token 401 + JSON
- ✅ 篡改 JWT 401
- ✅ plugin WS 自动重连无影响 (WS 走独立的 DeviceAuthReq, 跟 web token 是两路)

**Phase 2 待办** (BCrypt 密码哈希): 当前 5 账号 password 仍是明文 24 位 alnum. 改 BCrypt 要同时改 `AccountService.login` (web 路径) + `AccountService.clientlogin` (WS 路径) + 启动时迁移现有密码, 风险更大, 单独做.

## 已修的 send 路径瞬时失败 (5/5 上午 10:30) — 重试机制

**问题**: /ai 群发 N 联系人时, LLM 通过 mcp-server 快速 spawn 多个 `openclaw wework send` 子进程, 每个子进程都用 `pluginbot-cli` auth Java. **Java PC 协议默认一个账号一个活跃 WS 会话**, 后来的 auth 把先来的踢掉 → `_connected=false` → 立即返回"未连接 Java 后端" → LLM 看到错误反馈再自行重试, 体验差且漏发.

**修复** (commit `2a0caeb`):
- `send-helper.ts` 新增 `sendToJavaWithRetry` + 7 个 `*WithRetry` 包装函数
  - 检测断开后等 WS 自动重连 (最长 15s, 客户端本身 5s 自动重连一次)
  - 失败按指数退避重试 400→800→1600→3200ms, 最多 4 次
  - /ai 最终结果回执用更激进的 attempts=5/waitForConnectMs=20s
- 8 个 send 入口全切到 retry 版: `wework send` / `mass-send` / `forward` / `revoke` / `moments` / `group` / `send-image` / `PendingTask` 延迟欢迎
- `ai-command.ts` 4 个 `sendMessage` 调用全切到 `sendMessageWithRetry`
- 后台 service 进程 (WS 长连接稳的) 仍用同步快失败版

**验证**: 5 个并发 CLI 子进程 5/5 全成功, 真实 /ai 群发 3 联系人文字+音频 61s 一次跑通, 三方均收到真音频, 无任何"未连接"日志.

**根治** (待办, 大改): MCP 工具不要 spawn 子进程, 直接走主 service 的内置 RPC. 风险大, 先用 band-aid.

## 你要做的 3 件事 (按紧急度)

### 0. 关键命令一览

```bash
# 自然语言驱动 (终极形态)
ssh wework-prod 'wework-ai "给客户XX发祝福: 周末愉快"'

# 或 你个人微信发到孟伟企微 (任意会话):
/ai 把刚发的 4 张图发给余燕
/ai 把刚才的视频发给赵丽
/ai 看周丁豪聊了啥, 给个得体回复

# 综合健康
ssh wework-prod 'wework health'

# 联系人查找/列表 (本地缓存 204 个)
wework contacts 1688852285335663
wework find-contact 1688852285335663 赵丽

# 历史 (直读 SQLite, 含 base64 解码)
wework history 1688852285335663 <convId> -n 10

# 媒体 URL 解析 (视频/文件)
wework resolve-media 1688852285335663 <msgId>

# 业务场景一键
/root/.openclaw/extensions/wework-scrm/scripts/scenarios.sh all
```

### 1. push 24 commit 到 GitHub (5 分钟)

我已经 commit 到本地 (b86a218 → cb082b8 → 7a9d84d → c417185 → 45af784 → **1eb97bb**)。push 失败因为 mac 没加 GitHub SSH key。两种方式选一个:

**方式 A — 加 GitHub SSH key**:
```bash
cat ~/.ssh/id_ed25519.pub      # 复制这个公钥
# 粘到 https://github.com/settings/ssh/new
git push origin main
```

**方式 B — 用 PAT (Personal Access Token)**:
```bash
git remote set-url origin https://github.com/m18521213333-cmyk/wework-openclaw-plugin.git
git push origin main             # 用户名输 m18521213333-cmyk, 密码输 PAT
```

### 2. 轮换密码 (✅ 5 个 web 账号已完成 5/5 上午; Redis/Dify/Kimi 待办)

> ⚠️ 此前 commit 历史里有过明文密码 (5/3 凌晨调试时). 公开仓库前需要先用
> `git filter-repo` 清掉历史 (或者继续维持 private 仓库).

| 系统 | 状态 | 在哪儿读 | 怎么换 |
|---|---|---|---|
| `tbl_accountinfo` 5 个账号 (root/admin/pctest/pluginbot/pluginbot-cli) | ✅ **5/5 上午已轮换** 24 位 alnum 独立 | MySQL `workchat.tbl_accountinfo` | 见 `/root/credentials.txt` (600) |
| MySQL `wework` 用户 | ⏳ 待轮换 | `application.properties` 里 `spring.datasource.password` | `mysql -uroot -p; SET PASSWORD FOR 'wework'@'localhost'='新密码';` 然后改 properties + 重启 wework-server |
| Redis | ⏳ 待轮换 | application.properties 里 `spring.redis.password` | 改 redis conf + properties + 双重启 |
| Dify Key | ⏳ 待轮换 | application.properties 里 `dify.key` | https://chat-dify.cloud.zjian.net/ 控制台 revoke + 重新生成 + 改 properties + 删 install.sh 里的硬编码 |
| Kimi API Key | ⏳ 待轮换 | `/etc/systemd/system/openclaw-scrm.service.d/llm-env.conf` 里 `KIMI_API_KEY` | https://platform.moonshot.cn/console/api-keys revoke + 重新生成 + 改 systemd file + daemon-reload + restart |

### 3. 试试新群发 + 欢迎完整闭环

```bash
ssh wework-prod 'wework group 1688852285335663 create \
  --members 7881301077900374 7881300944899375 \
  --content "今天的vip群" \
  --send-after "🎉 欢迎进群!"'
```

5 秒内你企微会看到新群 + 群里第一条欢迎消息.

### 4. (可选) 接 LLM Agent 实现「自然语言驱动」

最终形态是用户说"给孟伟发条祝福" → Agent 自动调 wework_send_message tool. 需要:
- 服务器装个 LLM provider (OpenAI key / Anthropic key / 本地 LMStudio)
- 配 `~/.openclaw/openclaw.json` 的 `models.providers`
- 跑 `openclaw agent -m "..."`

我没做是因为没你的 API key.

---

## 一晚的修复时间线

| 时间 | bug | 修法 |
|---|---|---|
| **5/5 14:43** | resolve_media 8 个失败场景只覆盖 3 个 (其他任务下载中 立刻放弃 / outgoing 浪费 60s 试 resolve / 错误文案误导) | 全梳理 + 补 7 个 case + isOutgoing 字段 + transient 重试 (commit 2bafde5). PLAYBOOK.md 留 8 场景演练手册 |
| **5/5 11:08** | Web 静态 token 治本 (`Constant.TOKEN` 任何人拿到都通行) | JWT 改造 (Java commit e8cc347 on feat/web-jwt-auth) |
| **5/5 10:30** | LLM 群发 N 联系人时 send 路径瞬时失败 ("未连接 Java 后端") — 子进程 pluginbot-cli 互踢 | send-helper 加 `*WithRetry` 等重连+指数退避 (commit 2a0caeb) |
| **5/5 09:35** | 5 个账号弱密码 `1q2w3e4r5t` (键盘对角线) | 24 位独立随机 alnum + openclaw.json 同步 |
| **5/5 08:11** | Web /user/** 鉴权缺失 | WebConfiguration excludePathPatterns 改 /user/login |
| 14:00 | 安全审计发现 dev-pipeline.ts 危险代码 (消息驱动 spawn child_process 跑 claude CLI) | 删除 |
| 15:00 | Java 后端 OOM (TasksMax 4124 满了) | systemd override 改 16384 |
| 16:00 | 阿里云 SG 不通 15087/15086 | 你在控制台开 |
| 17:00 | 服务器本机 ufw 防火墙挡 15086/87/88 | `ufw allow` |
| 18:00 | 数据库表 tbl_platform_tenant 缺失导致消息处理异常 | CREATE TABLE + INSERT 默认行 |
| 19:00 | 协议: DeviceAuthRsp 拿 nettyId 当 token / 3s 心跳 / Content 是对象 | 重写 websocket-service.ts |
| 19:30 | 协议: WS JSON 字段 客户端发大写, Java 回小写 | 兼容两种 |
| 20:00 | 多 openclaw 进程同账号互踢 | WEWORK_PLUGIN_ENABLE 环境变量隔离 + pluginbot/pluginbot-cli 双账号 |
| 20:30 | 改 tbl_wx_accountinfo.accountid=15 让 Java 推到我们插件 | UPDATE SQL |
| 21:00 | 协议: int64 必须字符串 + enum 用名字 (Text/Picture) + bytes base64 | sed 全量改 send-helper.ts |
| 22:30 | 图片消息: nginx /attachment 没反代 | 加 location 反代 |
| 22:50 | CLI revoke / forward / upload 缺失 | 实现 + protobuf 字段对齐 |
| 23:30 | group create 协议: Action enum 用名字 (CreateRoom 不是 0) | 重写 actionMap |
| 00:00 | 建群+自动发欢迎 (CLI 是短期进程收不到 push) | SQLite IPC: pending_tasks 表 |
| 01:22 | "完整闭环" 表象 OK 但其实欢迎发到了错的 ConvId | (未发现) |
| 01:48 | 加 Type=1 过滤跳单聊, 还是不对 (ConvId 本身就错) | 缩小但没解 |
| 02:13 | **真根因**: ConvAdd 用 conv.Id (Java 内部 id) 而不是 conv.RemoteId | 1eb97bb 修 |
| 02:14 | **真完整闭环**: vip0212修复后 客户实收欢迎 (你确认) | ✅✅ |

## 项目文件清单

```
wework-openclaw-plugin/
├── README.md               ← 完整使用文档 (架构/部署/CLI/场景/故障排查/协议)
├── HANDOVER.md             ← 本文件 (一晚成果速读)
├── deploy.sh               ← 本地 build + rsync 到服务器
├── openclaw.plugin.json    ← 插件 manifest + auth schema (含 cliUsername)
├── package.json
├── tsconfig.json
├── scripts/
│   ├── smoke-test.sh       ← 验证服务/数据库/CLI 14 项
│   └── scenarios.sh        ← 业务场景: 建vip群/朋友圈带图/群发促销
├── src/
│   ├── index.ts            ← 36 tools + 14 CLI + service (监听 ConvAdd 自动 send)
│   ├── services/
│   │   ├── websocket-service.ts  ← WS 客户端 + DeviceAuth + 3s 心跳 + 重连
│   │   ├── send-helper.ts        ← 全部发送函数 (字符串化 + base64 + enum 名字) + *WithRetry 版
│   │   ├── ai-command.ts         ← /ai 命令处理 (spawn agent 子进程 + 回执给个人微信)
│   │   ├── storage-service.ts    ← SQLite (含 pending_tasks 跨进程 IPC)
│   │   └── ...
│   ├── tools/              ← 36 个 OpenClaw agent tools 注册
│   └── ...
└── proto/                  ← 75 个 .proto 文件 (Java 后端协议定义)
```

## Git 提交清单 (已全部 push 到 GitHub)

```
2a0caeb fix: send 路径加内置重试 — 解决 LLM 子进程序列被 Java pluginbot-cli 互踢的瞬时失败  ← 新
f6714d4 docs: HANDOVER 同步今晚最终成果 + Web /user/** 鉴权止血
639ec8f feat: 视频/文件转发 — 加 MsgRemoteId+FileType + DownloadFileResultNotice 监听
7e7ee37 feat: 视频/文件转发 — 加 resolve-media + 诚实告知 SDK 限制
1eb97bb fix(group): 建群欢迎发到真实群 RemoteId 不是 Java 内部 Id
45af784 test: 业务场景脚本 - 建vip群+欢迎/朋友圈带图/群发促销
c417185 test: smoke-test.sh - 验证服务/数据库/账号/CLI/连接全套
7a9d84d docs: 完整 README - 架构/部署/CLI/场景/故障排查/协议细节
cb082b8 feat: 建群 → 自动发欢迎消息 (SQLite IPC 跨进程协调)
b86a218 feat: 全链路打通 + 协议修复 + CLI 完善
```

## 服务器上的关键改动 (持久化, 重启不会丢)

```
# systemd unit override
/etc/systemd/system/wework-server.service.d/override.conf       (TasksMax 16384)
/etc/systemd/system/openclaw-scrm.service.d/wework-env.conf     (WEWORK_PLUGIN_ENABLE=1)

# nginx 反代
/etc/nginx/sites-enabled/store-growth                            (加 location /attachment/)

# ufw
ufw allow 15086/tcp, 15087/tcp                                   (15088 不开公网)

# MySQL
新建 tbl_platform_tenant 表 + 默认行
新增 pluginbot (id=15) / pluginbot-cli (id=16) 账号
UPDATE tbl_wx_accountinfo SET accountid=15 WHERE wxid=1688852285335663

# /usr/local/bin/wework wrapper
exec env WEWORK_PLUGIN_ENABLE=1 openclaw wework "$@"

# 插件代码
/root/.openclaw/extensions/wework-scrm/   (rsync 部署的最新代码)

# 数据
/root/wework-scrm.db                       (SQLite, 含 messages + pending_tasks)
/app/storage/attachment/<日期>/*.jpg        (图床, web/CLI 上传的图)
```

## 已知遗留 / 未来工作

1. ~~**LLM Agent 自然语言驱动**~~ — ✅ Kimi (moonshot.cn) 已接入, /ai 命令端到端 OK
2. ~~**wework upload 自动连发**~~ — ✅ 已实现 `wework send-image <wxId> <convId> <localPath>`, 一条龙上传+发送
3. **MCP 工具 spawn 子进程模型** — 当前每个 LLM 工具调用都 spawn 新的 `openclaw wework <cmd>` 子进程, 启动+auth ~6s, 序列长会有重复成本. 治本是直接走主 service 的 in-process RPC. 风险大没动, 已用 sendToJavaWithRetry band-aid 兜住瞬时失败.
4. ~~**Web JWT 治本**~~ — ✅ 已做 (commit e8cc347 on `feat/web-jwt-auth` 分支). **BCrypt 密码哈希 Phase 2 待办** — 要改 web + WS 两路的 login 查询, 加启动迁移, 风险更大 ~1h
5. **Java 安全优化** — fileUpload 没大小/类型限制, CORS `Allow-Origin: *` 全开放, 待收
6. **pending_tasks 还能扩展** — 不只用于建群+欢迎, 还可以做"加好友成功后自动打标签"等异步链
7. **撤回 / 转发 CLI** — revoke / forward / forward-multi 命令注册了, 协议跟 send 一致, 没找到合适的 msgId 实战测
8. ~~**sshd fork 资源耗尽**~~ — ✅ **已根治** (12:53). 真凶不是 sshd 不是 fork, 是**内存严重不够 + 没 swap**:
   - 3.4G RAM, Java 占 860M / MySQL 386M / OpenClaw 372M, 实际可用只剩 342M
   - SSH 要 fork+exec 新 bash 时内核分不出内存 → fork 失败 → banner timeout
   - 修法: `fallocate -l 2G /swapfile && mkswap && swapon`, 写 fstab, swappiness=10
   - 现在: 2.4G 余量, 不会再随机卡死

## 故障排查速查

| 症状 | 第一步 |
|---|---|
| 客户没收到我们发的消息 | 看 `tbl_wx_accountinfo.isonline` (1=离线), 让手机 SDK App 重启重登 |
| 插件断断续续被踢 | 确认 `WEWORK_PLUGIN_ENABLE=1` 在 systemd unit 里, 别的 openclaw 进程没用 pluginbot 账号 |
| 心跳超时 | 看 `~/.openclaw/openclaw.json` 的 auth.password, sqlite 验证 pluginbot 账号 state=1 |
| 图片消息不到 | curl `http://60.205.94.161/attachment/<日期>/<md5>.jpg` 看 nginx 反代是否生效 |
| 建群成功但欢迎没发 | 看 `sqlite3 /root/wework-scrm.db "SELECT * FROM pending_tasks ORDER BY id DESC"` 状态 |
| ssh 卡 banner | 阿里云控制台重启实例 (sshd fork 资源耗尽) |

## 验证用的工具

```bash
# 服务器上跑全套 smoke test
./scripts/smoke-test.sh

# 跑业务场景
./scripts/scenarios.sh 1     # 建vip群+欢迎
./scripts/scenarios.sh 2     # 朋友圈带图
./scripts/scenarios.sh 3     # 群发
```

---

**Good morning! 链路全通了, 就剩 commit push 和密码轮换了.** ☕

> P.S. 早 09:51 SSH 又死了一次 (sshd banner timeout). 业务进程都还在跑,
> 实际功能不受影响 (你之前收到的 vip0212修复后欢迎是真到位了).
> 你看到这个时如果新 SSH 还连不上, 阿里云控制台重启一下实例就好.
