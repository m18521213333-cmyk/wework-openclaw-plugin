/**
 * 阶段 6: 朋友圈功能 → OpenClaw Tools (完整实现)
 *
 * 对应原 Java Handler:
 *   PostSnsTaskWebsocketHandler          → wework_post_moments
 *   PostSnsTaskTaskWebsocketHandler      → wework_post_moments_task
 *   GetSnsDataTaskWebsocketHandler       → wework_get_sns_detail
 *   PullMySnsListTaskWebsocketHandler    → wework_get_my_moments
 *   PullSnsTaskListTaskWebsocketHandler  → wework_get_moments_tasks
 *   SnsCommentTaskWebsocketHandler       → wework_sns_comment
 *   SnsLikeTaskWebsocketHandler          → wework_sns_like
 *   DelSnsTaskWebsocketHandler           → wework_delete_moments
 *   DelSnsCommentTaskWebsocketHandler    → wework_delete_sns_comment
 */

import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { clearPostMomentsResult, takePostMomentsResult } from "../services/storage-service.js";
import {
  postMoments,
  postMomentsTask,
  getSnsData,
  pullMySns,
  pullSnsTaskList,
  snsComment,
  snsLike,
  deleteSns,
  deleteSnsComment,
} from "../services/send-helper.js";
import type { SendResult } from "../services/send-helper.js";
import { listMoments, getMomentBySnsId, listMomentsTasks } from "../services/storage-service.js";
import { makeTool, type ToolResult } from "../openclaw-compat.js";

function toResult(r: SendResult, ok: string): ToolResult {
  if (r.success) {
    return { content: [{ type: "text" as const, text: ok }], details: {} };
  }
  return { content: [{ type: "text" as const, text: `操作失败: ${r.error}` }], details: {}, isError: true };
}

export function registerMomentsTools(api: OpenClawPluginApi) {
  // --------------------------------------------------
  // 6.1 发布朋友圈
  // 原逻辑: PostSnsTaskMessage → msgSend2Phone
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_post_moments",
    description:
      "发布企业微信朋友圈动态，支持纯文本、图文、视频、链接等类型",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      contentType: Type.Optional(
        Type.Union(
          [
            Type.Literal("text"),
            Type.Literal("image"),
            Type.Literal("video"),
            Type.Literal("link"),
          ],
          { default: "text", description: "朋友圈类型" },
        ),
      ),
      content: Type.String({ description: "文字内容" }),
      mediaUrls: Type.Optional(
        Type.Array(Type.String(), {
          description: "图片/视频的URL列表（图文或视频类型时需要）",
        }),
      ),
      linkUrl: Type.Optional(Type.String({ description: "链接URL" })),
      linkTitle: Type.Optional(Type.String({ description: "链接标题" })),
      visibleList: Type.Optional(
        Type.Array(Type.String(), {
          description: "可见用户ID列表（不填则所有人可见）",
        }),
      ),
    }),
    async execute(_id, params) {
      // 清掉旧回执 + 发指令
      clearPostMomentsResult(params.wxId);
      const r = postMoments(
        params.wxId,
        params.content,
        params.contentType ?? "text",
        params.mediaUrls,
        params.linkUrl,
        params.linkTitle,
        params.visibleList,
      );
      if (!r.success) {
        return { content: [{ type: "text" as const, text: `朋友圈发布失败: ${r.error}` }], details: {}, isError: true };
      }
      // await 真回执 (PostSnsTaskResultNotice WS push), 最长等 10s
      const start = Date.now();
      while (Date.now() - start < 10_000) {
        const result = takePostMomentsResult(params.wxId);
        if (result) {
          if (result.success) {
            return { content: [{ type: "text" as const, text: `朋友圈已成功发布 (${params.contentType ?? "text"}, 用时 ${Math.round((Date.now()-start)/100)/10}s)` }], details: {} };
          }
          return { content: [{ type: "text" as const, text: `朋友圈发布失败 (手机端拒绝): ${result.errMsg || "未知"}` }], details: {}, isError: true };
        }
        await new Promise((r) => setTimeout(r, 500));
      }
      // 超时: 回执没到, 不能确认成功 — isError 让上层不当成成功, LLM 也别美化
      return {
        content: [{
          type: "text" as const,
          text: `❌ 朋友圈发布未确认: 10s 内手机端没回 PostSnsTaskResultNotice. 不能算成功! 可能原因: 手机离线 / SDK 卡住 / 朋友圈被风控. 请刷新手机端朋友圈或调 wework_get_my_moments 看是否真发出. **不要告诉用户已成功**, 老实说还在等.`,
        }],
        details: {},
        isError: true,
      };
    },
  }));

  // --------------------------------------------------
  // 6.1b 执行管理员朋友圈任务
  // 原逻辑: PostSnsTaskTaskMessage → msgSend2Phone
  // 企业管理员可以下发朋友圈任务，员工端执行此任务来发圈
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_post_moments_task",
    description: "执行企业管理员分配的朋友圈发布任务",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      taskId: Type.String({ description: "管理员下发的朋友圈任务ID" }),
    }),
    async execute(_id, params) {
      const r = postMomentsTask(params.wxId, params.taskId);
      return toResult(r, `朋友圈任务执行指令已发送: taskId=${params.taskId}`);
    },
  }));

  // --------------------------------------------------
  // 6.2a 获取单条朋友圈详情
  // 原逻辑: GetSnsDataTaskMessage → msgSend2Phone (异步) +
  //         WS push GetSnsDataTaskResultNotice 落 SQLite moments 表 +
  //         这里 await 后从 SQLite 读 sns_id 对应记录
  // 局限: 子进程 CLI 自己没 WS receive 端, 实际入库由 plugin server 进程完成.
  //       plugin server 离线时拿不到新数据 (后续可换 EventEmitter).
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_get_sns_detail",
    description: "获取指定朋友圈动态的详情 (先发查询指令, 等 3s 让 WS push 入 SQLite, 再返回 sns_id 对应的最新记录)",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      snsId: Type.String({ description: "朋友圈动态ID" }),
    }),
    async execute(_id, params) {
      // 1) 先发查询指令 (fire-and-forget; 由 plugin server 进程接 push 入 SQLite)
      const trig = getSnsData(params.wxId, params.snsId);
      // 2) 粗略等 3 秒让 WS push 写库
      await new Promise((r) => setTimeout(r, 3000));
      // 3) 读 SQLite 拿这条 sns_id 的详情
      const row = getMomentBySnsId(params.snsId);
      if (!row) {
        const tail = trig.success
          ? "暂无该朋友圈数据 (可能首次拉取还没回来, 重试一次; 或 sns_id 不属于该 wxId)"
          : `暂无该朋友圈数据, 且查询指令发送失败: ${trig.error}`;
        return {
          content: [{ type: "text" as const, text: tail }],
          details: {},
          isError: !trig.success,
        };
      }
      let images: Array<{ url: string; thumbUrl?: string }> = [];
      try { images = row.image_urls ? JSON.parse(row.image_urls) : []; } catch { /* ignore */ }
      // raw_json 里有完整的 SnsInfo (含评论/点赞/视频/链接), 一并返回
      let raw: any = null;
      try { raw = row.raw_json ? JSON.parse(row.raw_json) : null; } catch { /* ignore */ }
      const view = {
        snsId: row.sns_id,
        wxId: row.wx_id,
        content: row.content,
        imageUrls: images,
        postAt: row.post_at,
        comments: raw?.Comments ?? raw?.comments ?? [],
        likes: raw?.Likes ?? raw?.likes ?? [],
        link: raw?.Link ?? raw?.link ?? null,
        video: raw?.Video ?? raw?.video ?? null,
      };
      const header = `朋友圈详情 (refreshOk=${trig.success}):\n`;
      return {
        content: [{ type: "text" as const, text: header + JSON.stringify(view, null, 2) }],
        details: {},
      };
    },
  }));

  // --------------------------------------------------
  // 6.2b 拉取自己的朋友圈列表
  // 原逻辑: PullMySnsListTaskMessage → msgSend2Phone (异步) +
  //         WS push PullMySnsListTaskResultNotice 落 SQLite moments 表 +
  //         这里 await 后从 SQLite 读最新 20 条
  // 局限: 子进程 CLI 自己没有 WS receive 端, 实际入库由 plugin server (开常驻 WS
  //       的那个) 完成. plugin server 离线时拿不到新数据 (TODO: 后续可换 EventEmitter).
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_get_my_moments",
    description: "拉取自己发布的朋友圈列表 (先发刷新指令, 等 3s 让 WS push 入 SQLite, 再返回最新 20 条)",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
    }),
    async execute(_id, params) {
      // 1) 先发刷新指令到 Java (fire-and-forget; 由 plugin server 进程接 push 入 SQLite)
      const trig = pullMySns(params.wxId);
      // 2) 粗略等 3 秒让 WS push 写库 (后续可改 EventEmitter await 精确化)
      await new Promise((r) => setTimeout(r, 3000));
      // 3) 读 SQLite (即使触发失败, 老缓存还能用)
      const rows = listMoments(params.wxId, 20);
      if (rows.length === 0) {
        const tail = trig.success
          ? "暂无朋友圈数据 (可能首次拉取还没回来, 重试一次)"
          : `暂无朋友圈数据, 且刷新指令发送失败: ${trig.error}`;
        return {
          content: [{ type: "text" as const, text: tail }],
          details: {},
        };
      }
      const view = rows.map((r) => {
        let images: Array<{ url: string; thumbUrl?: string }> = [];
        try { images = r.image_urls ? JSON.parse(r.image_urls) : []; } catch { /* ignore */ }
        return {
          snsId: r.sns_id,
          content: r.content,
          imageUrls: images,
          postAt: r.post_at,
        };
      });
      const header = `共 ${rows.length} 条朋友圈 (refreshOk=${trig.success}):\n`;
      return {
        content: [{ type: "text" as const, text: header + JSON.stringify(view, null, 2) }],
        details: {},
      };
    },
  }));

  // --------------------------------------------------
  // 6.2c 拉取管理员朋友圈任务列表
  // 原逻辑: PullSnsTaskListTaskMessage → msgSend2Phone (异步) +
  //         WS push PullSnsTaskListTaskResultNotice 落 SQLite moments_tasks 表 +
  //         这里 await 后从 SQLite 读最新 50 条
  // 局限同 wework_get_my_moments — 实际入库依赖 plugin server 进程.
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_get_moments_tasks",
    description: "获取企业管理员下发的朋友圈任务列表 (先发拉取指令, 等 3s 让 WS push 入 SQLite, 再返回最新 50 条)",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
    }),
    async execute(_id, params) {
      // 1) 先发拉取指令 (fire-and-forget; 由 plugin server 进程接 push 入 SQLite)
      const trig = pullSnsTaskList(params.wxId);
      // 2) 粗略等 3 秒让 WS push 写库
      await new Promise((r) => setTimeout(r, 3000));
      // 3) 读 SQLite (即使触发失败, 老缓存还能用)
      const rows = listMomentsTasks(params.wxId, 50);
      if (rows.length === 0) {
        const tail = trig.success
          ? "暂无管理员朋友圈任务 (可能首次拉取还没回来, 重试一次)"
          : `暂无管理员朋友圈任务, 且拉取指令发送失败: ${trig.error}`;
        return {
          content: [{ type: "text" as const, text: tail }],
          details: {},
        };
      }
      const view = rows.map((r) => {
        let images: Array<{ url: string; thumbUrl?: string }> = [];
        try { images = r.image_urls ? JSON.parse(r.image_urls) : []; } catch { /* ignore */ }
        return {
          snsId: r.sns_id,
          author: r.author,
          content: r.content,
          imageUrls: images,
          postAt: r.post_at,
          posted: !!r.posted,
        };
      });
      const header = `共 ${rows.length} 条朋友圈任务 (refreshOk=${trig.success}):\n`;
      return {
        content: [{ type: "text" as const, text: header + JSON.stringify(view, null, 2) }],
        details: {},
      };
    },
  }));

  // --------------------------------------------------
  // 6.3a 评论朋友圈
  // 原逻辑: SnsCommentTaskMessage → msgSend2Phone
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_sns_comment",
    description: "对朋友圈动态发表评论，也可以回复某条评论",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      snsId: Type.String({ description: "朋友圈动态ID" }),
      content: Type.String({ description: "评论内容" }),
      replyTo: Type.Optional(
        Type.String({ description: "回复某条评论的ID（选填）" }),
      ),
    }),
    async execute(_id, params) {
      const r = snsComment(
        params.wxId,
        params.snsId,
        params.content,
        params.replyTo,
      );
      return toResult(r, `评论已发送: snsId=${params.snsId}`);
    },
  }));

  // --------------------------------------------------
  // 6.3b 点赞朋友圈
  // 原逻辑: SnsLikeTaskMessage → msgSend2Phone
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_sns_like",
    description: "为朋友圈动态点赞",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      snsId: Type.String({ description: "朋友圈动态ID" }),
    }),
    async execute(_id, params) {
      const r = snsLike(params.wxId, params.snsId);
      return toResult(r, `点赞已发送: snsId=${params.snsId}`);
    },
  }));

  // --------------------------------------------------
  // 6.4a 删除朋友圈
  // 原逻辑: DelSnsTaskMessage → msgSend2Phone
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_delete_moments",
    description: "删除自己发布的朋友圈动态",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      snsId: Type.String({ description: "要删除的朋友圈动态ID" }),
    }),
    async execute(_id, params) {
      const r = deleteSns(params.wxId, params.snsId);
      return toResult(r, `朋友圈删除指令已发送: snsId=${params.snsId}`);
    },
  }));

  // --------------------------------------------------
  // 6.4b 删除朋友圈评论
  // 原逻辑: DelSnsCommentTaskMessage → msgSend2Phone
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_delete_sns_comment",
    description: "删除朋友圈下的某条评论",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      snsId: Type.String({ description: "朋友圈动态ID" }),
      commentId: Type.String({ description: "要删除的评论ID" }),
    }),
    async execute(_id, params) {
      const r = deleteSnsComment(params.wxId, params.snsId, params.commentId);
      return toResult(
        r,
        `评论删除指令已发送: snsId=${params.snsId}, commentId=${params.commentId}`,
      );
    },
  }));
}
