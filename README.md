# @wework/openclaw-scrm-plugin

企业微信 SCRM 管理插件 for OpenClaw

通过 WebSocket 协议把企业微信功能（消息收发、客户管理、群聊、朋友圈、自动化）暴露成 OpenClaw 的 36 个 agent tools + 14 个 CLI 命令。最终形态：**OpenClaw Agent 用自然语言驱动企业微信操作**。

## 架构

```
┌──────────────────────────────────────────────────────────────────┐
│  阿里云 60.205.94.161                                            │
│                                                                  │
│  Java 后端 (Spring Boot + Netty)                                 │
│   ├─ TCP 15087 ◄── 工作手机 SDK (企微账号: 孟伟 wxid=168...)   │
│   ├─ HTTP 15086 (Web 管理端 + /fileUpload 图床)                  │
│   └─ WS 15088 ◄─┬─ Web 端 PC 客户端 (pctest 账号)               │
│                  ├─ 本插件 service (pluginbot 账号)              │
│                  └─ 本插件 CLI (pluginbot-cli 账号, 不与 service 互踢) │
│                                                                  │
│  OpenClaw Gateway (systemd: openclaw-scrm.service, 端口 18800)   │
│   └─ wework-scrm 插件 (本仓库)                                   │
│       ├─ service: 长连接 WS 收消息 → SQLite 持久化               │
│       ├─ CLI: openclaw wework <subcommand>                       │
│       └─ Tool API: 36 个 tools 给 LLM Agent 调用                 │
│                                                                  │
│  其他: nginx (80, /attachment 反代图床), MySQL (workchat),       │
│        Redis, ufw (15086/15087/15088 已放行)                     │
└──────────────────────────────────────────────────────────────────┘
```

## 部署

### 服务器一次性配置

```bash
# 1. ufw 开 Java 后端三个端口
sudo ufw allow 15086/tcp comment "WeWork web admin"
sudo ufw allow 15087/tcp comment "WeWork mobile SDK"
# 15088 不开公网 (内网回环 + 服务器内插件用)

# 2. 阿里云 ECS 安全组同样开 15086/15087 入方向 TCP

# 3. 修 Java OOM (TasksMax 4124 → 16384)
sudo mkdir -p /etc/systemd/system/wework-server.service.d
sudo tee /etc/systemd/system/wework-server.service.d/override.conf <<EOF
[Service]
TasksMax=16384
LimitNPROC=16384
LimitNOFILE=65536
EOF
sudo systemctl daemon-reload
sudo systemctl restart wework-server.service

# 4. 创建缺失的 tbl_platform_tenant 表
mysql -uwework workchat -p <<EOF
CREATE TABLE \`tbl_platform_tenant\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`corpid\` varchar(255) DEFAULT NULL,
  \`corpname\` varchar(255) DEFAULT NULL,
  \`openai\` int DEFAULT 0,
  \`difyai_url\` varchar(512) DEFAULT NULL,
  \`difyai_key\` varchar(512) DEFAULT NULL,
  \`crm_saasurl\` varchar(512) DEFAULT NULL,
  \`crm_cusmap\` int DEFAULT 0,
  \`msg_to_crm\` int DEFAULT 0,
  PRIMARY KEY (\`id\`),
  KEY \`idx_corpid\` (\`corpid\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
EOF

# 5. 创建插件专用账号 (跟 web 端 pctest 隔离)
mysql -uwework workchat -p <<EOF
INSERT INTO tbl_accountinfo (account, password, nickname, type, cid, state, create_time)
VALUES
  ('pluginbot', 'CHANGE_ME', '插件机器人', 1, 7, 1, NOW()),
  ('pluginbot-cli', 'CHANGE_ME', '插件CLI', 1, 7, 1, NOW());
EOF

# 6. 把孟伟 wxId 路由到 pluginbot 账号 (Java msgSend2pc 推送目标)
mysql -uwework workchat -p -e "UPDATE tbl_wx_accountinfo SET accountid=15 WHERE wxid=1688852285335663;"

# 7. nginx 反代图床 (让手机 SDK 能下载 fileUpload 后的图)
sudo tee -a /etc/nginx/sites-available/store-growth <<EOF
location /attachment/ {
    alias /app/storage/attachment/;
    autoindex off;
    add_header Cache-Control "public, max-age=86400";
}
EOF
sudo nginx -t && sudo nginx -s reload

# 8. systemd unit 加 WEWORK_PLUGIN_ENABLE 环境变量隔离野生 openclaw
sudo mkdir -p /etc/systemd/system/openclaw-scrm.service.d
sudo tee /etc/systemd/system/openclaw-scrm.service.d/wework-env.conf <<EOF
[Service]
Environment=WEWORK_PLUGIN_ENABLE=1
EOF
sudo systemctl daemon-reload
```

### 插件配置 (~/.openclaw/openclaw.json)

```json5
{
  plugins: {
    allow: ["wework-scrm"],
    entries: {
      "wework-scrm": {
        enabled: true,
        config: {
          javaWsUrl: "ws://127.0.0.1:15088",
          auth: {
            authType: 2,
            username: "pluginbot",       // service 账号
            password: "CHANGE_ME",
            cliUsername: "pluginbot-cli", // CLI 账号 (跟 service 隔离不互踢)
            cliPassword: "CHANGE_ME"
          },
          storage: {
            type: "sqlite",
            sqlitePath: "./wework-scrm.db"
          },
          dify: { enabled: false }
        }
      }
    }
  }
}
```

### 部署脚本

```bash
# 本地 build + rsync 到服务器
./deploy.sh

# 创建 wrapper 让 CLI 用起来更顺手
sudo tee /usr/local/bin/wework <<'EOF'
#!/bin/bash
exec env WEWORK_PLUGIN_ENABLE=1 openclaw wework "$@"
EOF
sudo chmod +x /usr/local/bin/wework

systemctl restart openclaw-scrm.service
```

## CLI 命令参考

### 查询类

| 命令 | 功能 |
|---|---|
| `wework status` | 查 WS 连接状态 |
| `wework phone <wxId>` | 查手机状态 |
| `wework contact <wxId> <remoteId>` | 查联系人详情 |
| `wework history <wxId> <convId> -n N` | 拉 N 条历史消息 |
| `wework search <wxId> <keyword>` | 搜历史消息 |
| `wework my-moments <wxId>` | 拉我发布的朋友圈列表 |
| `wework sync <wxId> contacts\|customers\|conversations\|labels\|all` | 触发同步 |

### 发送类

| 命令 | 功能 |
|---|---|
| `wework send <wxId> <convId> <text>` | 发文本消息 |
| `wework send <wxId> <convId> <imageURL> --type image` | 发图片消息 (URL 必须可被手机 SDK 下载) |
| `wework send-image <wxId> <convId> <localPath>` | 一条龙: 上传本地图片 + 发出去 (省去复制 URL 的步骤) |
| `wework mass-send <wxId> <text> --to id1 id2 id3` | 群发 (内部循环 sendMessage) |
| `wework moments <wxId> <文案>` | 发纯文朋友圈 |
| `wework moments <wxId> <文案> --type image --media url1 url2` | 发带图朋友圈 |
| `wework moments <wxId> <文案> --type link --media url --link-url xxx --link-title yyy` | 发链接朋友圈 |
| `wework revoke <wxId> <msgId> <convId>` | 撤回消息 |
| `wework forward <wxId> <msgId> <fromConvId> <toConvId>` | 转发消息 |

### 群操作

```bash
# 建群 (拉成员 + 改群名)
wework group <wxId> create --members id1 id2 --content "群名"

# 建群 + 自动发欢迎消息 (跨进程 IPC: CLI 退出后 service 监听 ConversationAddNotice
# 按群名匹配, 用新 ConvId 自动发 send-after 内容)
wework group <wxId> create --members id1 id2 --content "智简vip20260503" \
  --send-after "🎉 欢迎进群! 这是插件自动发的"

# 改群名
wework group <wxId> set_name --group <convId> --content "新群名"

# 改公告
wework group <wxId> set_notice --group <convId> --content "群公告内容"

# 加成员
wework group <wxId> add_member --group <convId> --members id1 id2

# 踢人
wework group <wxId> remove_member --group <convId> --members id1

# 退群
wework group <wxId> quit --group <convId>

# 看群成员
wework group <wxId> list_members --group <convId>

# 设置群备注
wework group <wxId> set_remark --group <convId> --content "我的备注"
```

### 文件上传 + 发图

```bash
# 一条龙: 上传 + 发给会话 (推荐)
wework send-image 1688852285335663 7881300944899375 /path/to/local.jpg

# 拆分: 先上传拿 URL
URL=$(wework upload /path/to/local.jpg | tail -1 | awk '{print $2}')

# 然后用 URL 发图给客户
wework send 1688852285335663 7881300944899375 "$URL" --type image

# 或发到朋友圈 (没法用 send-image, 朋友圈格式不同)
wework moments 1688852285335663 "新品上架" --type image --media "$URL"
```

## 业务场景示例

### 场景 1: 建群 + 自动发欢迎 (已自动化)

```bash
wework group 1688852285335663 create \
  --members 客户1ID 客户2ID 客户3ID \
  --content "智简vip20260503" \
  --send-after "🎉 欢迎进群! 群里会定期分享..."
```

CLI 立即退出, service 进程在后台监听 ConversationAddNotice, 按群名 "智简vip20260503" 匹配, 收到后用新群 ConvId 自动调 sendMessage 发欢迎。状态可查:

```bash
sqlite3 /root/wework-scrm.db \
  "SELECT task_id, match_key, status, result_conv_id, datetime(created_at) FROM pending_tasks ORDER BY id DESC LIMIT 5;"
```

### 场景 2: 给所有客户群发推广 (从标签拉)

```bash
# 1. 同步通讯录到 SQLite
wework sync 1688852285335663 contacts

# 2. 等几秒, 从 SQLite 拉某个标签下的客户
sleep 3
CONVS=$(sqlite3 /root/wework-scrm.db "SELECT conv_id FROM messages WHERE wx_id=1688852285335663 GROUP BY conv_id;" | tr '\n' ' ')

# 3. 群发
wework mass-send 1688852285335663 "新品促销..." --to $CONVS
```

### 场景 3: 朋友圈带图

```bash
# 上传图片
URL=$(wework upload /Users/me/Pictures/promo.jpg | grep "✅" | awk '{print $2}')

# 发朋友圈
wework moments 1688852285335663 "周末促销!" --type image --media "$URL"
```

## 故障排查

### 插件连不上 Java

```bash
# 1. 看 service 状态
systemctl status openclaw-scrm.service

# 2. 看 Java 端口
ss -tlnp | grep -E "1508[678]"

# 3. 看插件 WS 连接
ss -tn | grep ":15088"

# 4. 看插件最新日志
journalctl -u openclaw-scrm.service -n 30
```

### 客户没收到我们发的消息

1. **先查 Java 端有没有 talkToFriendTask 处理**:
   ```bash
   journalctl -u wework-server.service --since "5 minutes ago" | grep talkToFriendTask
   ```

2. **看 isonline 状态** (1=离线 0=在线):
   ```bash
   mysql -uwework workchat -e "SELECT wxid, name, isonline FROM tbl_wx_accountinfo;"
   ```
   如果 isonline=1 说明 Java 找不到手机 SDK channel, 需要让手机 SDK 重连。

3. **看 ConvId 对不对** (从 SQLite 拉真实会话):
   ```bash
   sqlite3 /root/wework-scrm.db \
     "SELECT DISTINCT sender_name, conv_id, MAX(created_at) FROM messages GROUP BY conv_id;"
   ```

### service 跟 CLI 互踢

确认 `~/.openclaw/openclaw.json` 里 `auth.username` 跟 `auth.cliUsername` 是**两个不同账号**, 且 `WEWORK_PLUGIN_ENABLE=1` 只在 systemd unit 里设置 (野生 openclaw 不要有这个 env)。

## 协议细节 (重要 — 跟 web 前端对齐)

### 客户端发到 Java (大写字段)

```json
{
  "MsgType": "TalkToFriendTask",
  "AccessToken": "<nettyId, 来自 DeviceAuthRsp>",
  "Content": {                                  // 必须是对象不是字符串!
    "WxId": "1688852285335663",                 // int64 用字符串!
    "ConvId": "7881300944899375",
    "ContentType": "Text",                       // enum 用名字, 不是 0!
    "Content": "<base64(消息文本或URL)>",        // bytes 字段必须 base64
    "TaskId": "1777825442746"
  }
}
```

### Java 推送给客户端 (小写字段!)

```json
{
  "msgType": "FriendTalkNotice",                // 小写 m!
  "accessToken": null,
  "refMsgId": 123,
  "message": "{\"WxId\":\"...\",\"ConvId\":\"...\",\"Content\":\"<base64>\",\"SenderName\":\"...\"}"
}
```

### 心跳

```json
{ "Id": <自增>, "AccessToken": "<token>", "MsgType": "HeartBeatReq", "Content": {} }
```

每 3 秒一次 (Java 端 5 秒不见心跳就 close)。

## 已知限制

1. **同账号互斥**: Java 端 `nettyConnectionUtil` 按 account 名字保持 1 个 PC channel, 同账号新登录踢旧的。所以 service 和 CLI 用不同账号 (pluginbot vs pluginbot-cli)。
2. **CLI 进程是短期的**: ConversationAddNotice 等异步推送只发给 service。CLI 要等结果必须用 SQLite IPC (pending_tasks 表) 委托给 service。
3. **图片消息**: Content 字段是图片 URL (base64 编码), 手机 SDK 通过 URL 下载后用企微 SDK 发出。需要 nginx /attachment 反代生效。
4. **消息撤回**: 只能撤回最近 2 分钟内自己发的消息 (企微限制)。
5. **群操作**: 建群成员是客户的 RemoteId (不是 ConvId), 注意区分。
6. **ConvAddNotice 字段坑**: `Convers.Id` 是 Java 数据库主键 (内部 id, 形如 `7635xxxxxxxxxxxxxxx`), `Convers.RemoteId` 才是企微真正的群 ConvId (形如 `10xxxxxxxxxxxxxxx`)。`talkToFriendTask` 必须用 RemoteId, 用 Id 会发到不存在的会话, 出现"诡异单聊红色感叹号"现象。proto 注释里写 "公司id，部门id或其他" 是误导, 实际就是群 ConvId。

## 项目结构

```
wework-openclaw-plugin/
├── openclaw.plugin.json         # 插件 manifest + configSchema
├── package.json
├── tsconfig.json
├── deploy.sh                    # 本地 build + rsync 到服务器
├── README.md                    # 本文档
├── src/
│   ├── index.ts                 # 插件入口: 注册 36 tools + 14 CLI commands + service
│   ├── openclaw-compat.ts       # OpenClaw SDK 兼容层
│   ├── proto/                   # protobuf 定义 (75 个 .proto 文件 + bundle)
│   ├── services/
│   │   ├── websocket-service.ts # WS 客户端 + 认证 + 心跳 + 自动重连
│   │   ├── send-helper.ts       # 所有发送类函数 (sendMessage, postMoments, ...)
│   │   ├── storage-service.ts   # SQLite (messages, keywords, pending_tasks 等)
│   │   ├── automation-engine.ts # 关键词回复 / 自动接受好友
│   │   ├── dify-service.ts      # Dify AI 自动回复 (可选)
│   │   └── scheduler-service.ts # 定时任务调度
│   ├── tools/                   # 36 个 OpenClaw agent tools 注册
│   │   ├── message-tools.ts
│   │   ├── contact-tools.ts
│   │   ├── group-tools.ts
│   │   ├── moments-tools.ts
│   │   └── device-tools.ts
│   └── types/
└── proto/                       # 原始 .proto 定义 (供查阅)
```

## 修复过的关键 bug

详见 git log。一句话总结:

1. ufw 防火墙 + 阿里云 SG 三个端口
2. 数据库表 tbl_platform_tenant 缺失 → INSERT 默认行
3. PC 协议: DeviceAuthRsp 拿 nettyId 当 token + 3s 心跳 + Content 是对象
4. JSON 字段大小写: 客户端发大写, Java 回小写
5. protobuf JSON: int64 字符串化 + enum 名字化 + bytes base64
6. 多 openclaw 进程同账号互踢 → WEWORK_PLUGIN_ENABLE 隔离 + service/CLI 独立账号
7. tbl_wx_accountinfo.accountid 路由 → 让 Java msgSend2pc 推到我们插件
8. nginx /attachment 反代图床 → 手机 SDK 能下载图片
9. CLI/Service 跨进程 IPC: SQLite pending_tasks 表协调建群+自动欢迎

## License

ISC
