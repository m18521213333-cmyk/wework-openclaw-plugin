/**
 * LLM provider 抽象 — OpenAI-compatible 协议 (Kimi/OpenAI/DeepSeek/通义/...都兼容).
 * Claude 单独适配 (走 messages API).
 *
 * 流式输出: 用 OpenAI SSE 格式 yield delta.
 */

export interface LLMProviderConfig {
  id: string;
  type: "openai_compatible" | "anthropic";
  name: string;
  baseUrl: string;
  apiKey: string;
  model: string;
}

export interface LLMMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  /** assistant 消息可能含 tool_calls (OpenAI 格式) */
  tool_calls?: Array<{
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }>;
  /** tool 角色消息: tool_call_id 关联到 assistant 之前的 call */
  tool_call_id?: string;
  name?: string;
}

export interface LLMTool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>; // JSON Schema
  };
}

/** 流式 delta — 模仿 OpenAI choices[0].delta */
export type LLMDelta =
  | { type: "text"; content: string }
  | { type: "tool_call"; id: string; name: string; argsDelta: string; index: number }
  | { type: "done"; finishReason: "stop" | "tool_calls" | "length" };

/**
 * 调 OpenAI-compatible chat completion 接口 (Kimi 等都用这个),
 * 流式 yield delta.
 */
export async function* streamOpenAICompatible(
  cfg: LLMProviderConfig,
  messages: LLMMessage[],
  tools: LLMTool[] | undefined,
  signal: AbortSignal,
): AsyncGenerator<LLMDelta> {
  const url = `${cfg.baseUrl.replace(/\/$/, "")}/chat/completions`;
  const body: Record<string, unknown> = {
    model: cfg.model,
    messages,
    stream: true,
  };
  if (tools?.length) {
    body.tools = tools;
    body.tool_choice = "auto";
  }

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!resp.ok || !resp.body) {
    const errText = await resp.text().catch(() => "");
    throw new Error(`LLM HTTP ${resp.status}: ${errText.slice(0, 300)}`);
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });

    let nl: number;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line || !line.startsWith("data:")) continue;
      const dataStr = line.slice(5).trim();
      if (dataStr === "[DONE]") {
        return;
      }
      try {
        const parsed = JSON.parse(dataStr) as {
          choices?: Array<{
            delta?: {
              content?: string | null;
              tool_calls?: Array<{
                index: number;
                id?: string;
                type?: string;
                function?: { name?: string; arguments?: string };
              }>;
            };
            finish_reason?: "stop" | "tool_calls" | "length" | null;
          }>;
        };
        const delta = parsed.choices?.[0]?.delta;
        const finishReason = parsed.choices?.[0]?.finish_reason;
        if (delta?.content) {
          yield { type: "text", content: delta.content };
        }
        if (delta?.tool_calls) {
          for (const tc of delta.tool_calls) {
            yield {
              type: "tool_call",
              index: tc.index,
              id: tc.id ?? "",
              name: tc.function?.name ?? "",
              argsDelta: tc.function?.arguments ?? "",
            };
          }
        }
        if (finishReason) {
          yield { type: "done", finishReason };
        }
      } catch (e) {
        // 解析失败的 chunk 丢弃, 继续
        console.warn("[llm-stream] parse fail:", e, "line:", line.slice(0, 100));
      }
    }
  }
}
