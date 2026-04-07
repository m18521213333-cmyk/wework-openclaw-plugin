# WeWork SCRM → OpenClaw Plugin 改造任务拆解

## 项目概述

将原有 Java Spring Boot + Netty 企业微信 SCRM 系统改造为 OpenClaw 原生 TypeScript 插件。
原系统通过 Protobuf/WebSocket 与手机端 SDK 通信，管理企业微信的消息、联系人、朋友圈等功能。

---

## 架构对比

### 原架构 (Java)
```
手机SDK ←→ Netty Socket(15087) ←→ Spring Boot 服务 ←→ MySQL/Redis
PC前端 ←→ Netty WebSocket(15088) ↗
Web管理 ←→ HTTP API(15086) ↗
```

### 新架构 (OpenClaw Plugin)
```
手机SDK ←→ WebSocket Service (插件内置) ←→ OpenClaw Gateway
OpenClaw Agent ←→ registerTool() 注册的各种工具
数据存储 ←→ SQLite/JSON 本地存储 (替代MySQL)
Dify AI ←→ HTTP 调用 (保留原有AI对接)
```

---

## 任务分为 7 个阶段，共 21 个子任务

---

## 阶段 1：插件骨架与基础设施 ✅ (本次完成)
> 搭建 OpenClaw 插件标准项目结构

| # | 子任务 | 说明 | 状态 |
|---|--------|------|------|
| 1.1 | 项目脚手架 | package.json, tsconfig, openclaw.plugin.json | ✅ |
| 1.2 | 插件入口 | index.ts + definePluginEntry + register(api) | ✅ |
| 1.3 | 配置 Schema | 连接参数(socket端口/数据库/Redis/Dify)的 JSON Schema | ✅ |
| 1.4 | 类型定义 | 所有 Protobuf 消息类型的 TypeScript 类型 | ✅ |

---

## 阶段 2：WebSocket 通信层 ✅ (已完成)
> 替代 Netty，用 Node.js ws + net 库实现与手机SDK的通信

| # | 子任务 | 说明 | 状态 |
|---|--------|------|------|
| 2.1 | TCP Socket + WebSocket Server | 双端口服务 (TCP=手机SDK, WS=PC/Web) | ✅ |
| 2.2 | 消息编解码 | 4字节大端长度头 + Protobuf body 解包 | ✅ |
| 2.3 | 连接管理 | 设备通道/用户通道/心跳/上下线追踪 | ✅ |
| 2.4 | 消息路由 | MsgType → handler 分发 + 事件系统 | ✅ |

---

## 阶段 3：核心消息功能 → OpenClaw Tools ✅ (已完成)
> 将原有消息收发改造为 AI Agent 可调用的工具

| # | 子任务 | 对应原 Java 类 | OpenClaw Tool 名 | 状态 |
|---|--------|----------------|-----------------|------|
| 3.1 | 发送消息 | TalkToFriendTask | wework_send_message | ✅ |
| 3.2 | 接收消息 | FriendTalkNotice | (事件 Hook + 5个结果通知) | ✅ |
| 3.3 | 消息撤回 | MsgRevokeTask | wework_revoke_message | ✅ |
| 3.4 | 消息转发 | ForwardMsgTask / ForwardMultiTask | wework_forward_message | ✅ |
| 3.5 | 消息搜索 | SearchMsgTask | wework_search_messages | ✅ |
| 3.6 | 历史消息 | TriggerHistoryMsgPush | wework_get_history | ✅ |

**新增文件:** `src/services/send-helper.ts` (消息发送辅助层)

---

## 阶段 4：联系人与客户管理 → OpenClaw Tools ✅ (已完成)

| # | 子任务 | 对应原 Java 类 | OpenClaw Tool 名 | 状态 |
|---|--------|----------------|-----------------|------|
| 4.1 | 获取联系人信息 | GetContactInfoTask | wework_get_contact | ✅ |
| 4.2 | 添加客户(ID) | AddCustomerByIdTask | wework_add_customer_by_id | ✅ |
| 4.3 | 添加客户(搜索) | AddCustomerFromSearchTask | wework_add_customer_search | ✅ |
| 4.4 | 添加客户(微信) | AddCustomerFromWxTask | wework_add_customer_wx | ✅ |
| 4.5 | 删除客户 | DelCustomerTask | wework_delete_customer | ✅ |
| 4.6 | 接受好友请求 | AcceptCustomerTask | wework_accept_friend | ✅ |
| 4.7 | 设置备注 | SetUserMemoTask | wework_set_memo | ✅ |
| 4.8 | 获取外部用户ID | GetExtUserIdTask | wework_get_ext_user_id | ✅ (新增) |
| 4.9 | 发送好友验证 | SendFriendVerifyTask | wework_send_friend_verify | ✅ (新增) |

**新增:** send-helper 中9个联系人操作函数 + builtin-handlers 中8个通知处理器

---

## 阶段 5：群聊与标签管理 → OpenClaw Tools ✅ (已完成)

| # | 子任务 | 对应原 Java 类 | OpenClaw Tool 名 | 状态 |
|---|--------|----------------|-----------------|------|
| 5.1 | 群操作(建群/拉人/踢人/改名/公告/退群) | ChatRoomActionTask | wework_chatroom_action | ✅ |
| 5.2 | 获取群成员 | GetGroupMemberTask | wework_get_group_members | ✅ |
| 5.3a | 创建标签 | UserLabelSetTask | wework_create_label | ✅ (拆分) |
| 5.3b | 删除标签 | UserLabelDelTask | wework_delete_label | ✅ (拆分) |
| 5.3c | 修改标签 | UserLabelModifyTask | wework_modify_label | ✅ (拆分) |
| 5.4a | 给用户打标签 | UserSetLabelTask | wework_set_user_labels | ✅ |
| 5.4b | 同步标签列表 | TriggerUserLabelTask | wework_sync_labels | ✅ (新增) |
| 5.5 | 群发消息 | QunFaTask | wework_mass_send | ✅ |

**新增:** send-helper 中8个群聊/标签函数 + builtin-handlers 中9个通知处理器 (群成员推送/新增/退出, 标签推送/变更/修改结果, 会话创建/变更/推送)

---

## 阶段 6：朋友圈功能 → OpenClaw Tools ✅ (已完成)

| # | 子任务 | 对应原 Java 类 | OpenClaw Tool 名 | 状态 |
|---|--------|----------------|-----------------|------|
| 6.1a | 发布朋友圈 | PostSnsTask | wework_post_moments | ✅ |
| 6.1b | 执行管理员朋友圈任务 | PostSnsTaskTask | wework_post_moments_task | ✅ (新增) |
| 6.2a | 获取单条朋友圈详情 | GetSnsDataTask | wework_get_sns_detail | ✅ (拆分) |
| 6.2b | 拉取我的朋友圈列表 | PullMySnsListTask | wework_get_my_moments | ✅ (拆分) |
| 6.2c | 拉取管理员朋友圈任务 | PullSnsTaskListTask | wework_get_moments_tasks | ✅ (新增) |
| 6.3a | 评论 | SnsCommentTask | wework_sns_comment | ✅ (拆分) |
| 6.3b | 点赞 | SnsLikeTask | wework_sns_like | ✅ (拆分) |
| 6.4a | 删除朋友圈 | DelSnsTask | wework_delete_moments | ✅ |
| 6.4b | 删除评论 | DelSnsCommentTask | wework_delete_sns_comment | ✅ (新增) |

**新增:** send-helper 中9个朋友圈函数 + builtin-handlers 中6个通知处理器

---

## 阶段 7：自动化与AI集成 ✅ (已完成)

| # | 子任务 | 说明 | 状态 |
|---|--------|------|------|
| 7.1 | 关键词自动回复 | 精准匹配 → 模糊包含 → 智能匹配 三级匹配 | ✅ |
| 7.2 | 自动接受好友 | 新客户事件触发 → 检查auto_settings → 自动通过 | ✅ |
| 7.3 | Dify AI 对接 | 收到消息 → 调 Dify chat-messages API → 回复用户 | ✅ |
| 7.4 | 定时任务 | 60秒轮询 SQLite → 到期任务 → sendToPhone 执行 | ✅ |
| 7.5 | 数据存储层 | SQLite 6张表 (keywords/auto_settings/messages/tenants/scheduled_tasks/ai_conversations) | ✅ |

**新增文件:**
- `src/services/storage-service.ts` — SQLite 存储层 (6张表 + 全部CRUD)
- `src/services/dify-service.ts` — Dify AI 对接 (blocking模式 + think标签清理)
- `src/services/automation-engine.ts` — 自动化引擎 (关键词回复 + 自动接受好友 + 消息存储)
- `src/services/scheduler-service.ts` — 定时任务调度器 (60秒轮询)

---

## ✅ 全部 7 个阶段已完成！最终统计

| 指标 | 数量 |
|------|------|
| OpenClaw 工具 (Tools) | **36个** |
| send-helper 底层函数 | **34个** |
| 通知处理器 (Handlers) | **36个** |
| TypeScript 文件 | **15个** |
| 总代码行数 | **~4510行** |

## 使用方式
```bash
npm install -g openclaw
openclaw plugins install ./wework-openclaw-plugin
openclaw plugins enable wework-scrm
openclaw wework status
```

---

## 每次对话建议推进 1 个阶段
每个阶段完成后，你可以下载代码到本地测试，然后在下次对话中上传继续下一阶段。
