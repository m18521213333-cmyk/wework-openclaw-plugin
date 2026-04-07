/**
 * OpenClaw Plugin SDK 兼容层
 *
 * 提供 makeTool() 帮助函数，自动补充 AgentTool 所需的 label 字段
 * 和 execute 返回值中的 details 字段。
 */

import type { TSchema, Static } from "@sinclair/typebox";

export interface ToolResult {
  content: { type: "text"; text: string }[];
  details: Record<string, never>;
  isError?: boolean;
}

export interface SimpleToolDef<T extends TSchema> {
  name: string;
  description: string;
  parameters: T;
  execute: (
    toolCallId: string,
    params: Static<T>,
    signal?: AbortSignal,
  ) => Promise<ToolResult>;
}

/**
 * 创建符合 AnyAgentTool 接口的工具对象
 * 自动补齐 label 字段
 */
export function makeTool<T extends TSchema>(def: SimpleToolDef<T>) {
  return {
    ...def,
    label: def.name,
  };
}
