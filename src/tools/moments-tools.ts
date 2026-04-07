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
      const r = postMoments(
        params.wxId,
        params.content,
        params.contentType ?? "text",
        params.mediaUrls,
        params.linkUrl,
        params.linkTitle,
        params.visibleList,
      );
      return toResult(r, `朋友圈发布指令已发送 (${params.contentType ?? "text"})`);
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
  // 原逻辑: GetSnsDataTaskMessage → msgSend2Phone
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_get_sns_detail",
    description: "获取指定朋友圈动态的详情（内容、评论、点赞等）",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
      snsId: Type.String({ description: "朋友圈动态ID" }),
    }),
    async execute(_id, params) {
      const r = getSnsData(params.wxId, params.snsId);
      return toResult(r, `朋友圈详情查询已发送: snsId=${params.snsId}`);
    },
  }));

  // --------------------------------------------------
  // 6.2b 拉取自己的朋友圈列表
  // 原逻辑: PullMySnsListTaskMessage → msgSend2Phone
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_get_my_moments",
    description: "拉取自己发布的朋友圈列表，结果通过事件异步返回",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
    }),
    async execute(_id, params) {
      const r = pullMySns(params.wxId);
      return toResult(r, "个人朋友圈列表拉取指令已发送");
    },
  }));

  // --------------------------------------------------
  // 6.2c 拉取管理员朋友圈任务列表
  // 原逻辑: PullSnsTaskListTaskMessage → msgSend2Phone
  // --------------------------------------------------
  api.registerTool(makeTool({
    name: "wework_get_moments_tasks",
    description: "获取企业管理员下发的朋友圈任务列表，结果通过事件异步返回",
    parameters: Type.Object({
      wxId: Type.String({ description: "企业微信ID" }),
    }),
    async execute(_id, params) {
      const r = pullSnsTaskList(params.wxId);
      return toResult(r, "管理员朋友圈任务列表拉取指令已发送");
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
