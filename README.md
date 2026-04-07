# @wework/openclaw-scrm-plugin

企业微信 SCRM 管理插件 for OpenClaw

## 安装

```bash
openclaw plugins install ./wework-openclaw-plugin
openclaw plugins enable wework-scrm
```

## 配置

在 `~/.openclaw/openclaw.json` 中添加:

```json5
{
  plugins: {
    entries: {
      "wework-scrm": {
        enabled: true,
        config: {
          websocket: { port: 15087 },
          storage: { type: "sqlite", sqlitePath: "./wework-scrm.db" },
          dify: { enabled: true, apiUrl: "https://your-dify.com/v1", apiKey: "app-xxx" }
        }
      }
    }
  }
}
```

## 已注册的 Agent 工具

| 工具名 | 功能 | 阶段 |
|--------|------|------|
| `wework_send_message` | 发送消息 | 3 |
| `wework_revoke_message` | 撤回消息 | 3 |
| `wework_forward_message` | 转发消息 | 3 |
| `wework_search_messages` | 搜索消息 | 3 |
| `wework_get_history` | 历史消息 | 3 |
| `wework_get_contact` | 获取联系人 | 4 |
| `wework_add_customer_by_id` | 添加客户(ID) | 4 |
| `wework_add_customer_search` | 添加客户(搜索) | 4 |
| `wework_add_customer_wx` | 添加客户(微信) | 4 |
| `wework_delete_customer` | 删除客户 | 4 |
| `wework_accept_friend` | 接受好友 | 4 |
| `wework_set_memo` | 设置备注 | 4 |
| `wework_chatroom_action` | 群聊操作 | 5 |
| `wework_get_group_members` | 获取群成员 | 5 |
| `wework_manage_labels` | 标签管理 | 5 |
| `wework_set_user_labels` | 打标签 | 5 |
| `wework_mass_send` | 群发消息 | 5 |
| `wework_post_moments` | 发朋友圈 | 6 |
| `wework_get_moments` | 获取朋友圈 | 6 |
| `wework_moments_interact` | 评论/点赞 | 6 |
| `wework_delete_moments` | 删除朋友圈 | 6 |
| `wework_phone_status` | 手机状态 | - |
| `wework_get_qrcode` | 获取二维码 | - |
| `wework_download_file` | 下载文件 | - |
| `wework_sync_data` | 同步数据 | - |
| `wework_list_devices` | 在线设备 | - |

## 开发进度

详见 [TASK_BREAKDOWN.md](./TASK_BREAKDOWN.md)

## 项目结构

```
wework-openclaw-plugin/
├── openclaw.plugin.json     # 插件 manifest
├── package.json
├── tsconfig.json
├── TASK_BREAKDOWN.md         # 任务拆解文档
├── README.md
└── src/
    ├── index.ts              # 插件入口 (definePluginEntry)
    ├── types/
    │   └── index.ts          # 全部类型定义 (从Protobuf映射)
    ├── tools/
    │   ├── message-tools.ts  # 阶段3: 消息工具
    │   ├── contact-tools.ts  # 阶段4: 联系人工具
    │   ├── group-tools.ts    # 阶段5: 群聊/标签工具
    │   ├── moments-tools.ts  # 阶段6: 朋友圈工具
    │   └── device-tools.ts   # 设备/系统工具
    ├── services/             # (阶段2/7实现)
    │   ├── websocket-service.ts
    │   ├── storage-service.ts
    │   └── dify-service.ts
    └── handlers/             # (阶段2实现)
        └── (消息处理器)
```
