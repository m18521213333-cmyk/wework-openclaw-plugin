/**
 * OpenClaw Plugin SDK 类型声明
 *
 * OpenClaw 运行时提供这些 API，编译时只需类型。
 */

declare module "openclaw/plugin-sdk" {
  export interface PluginLogger {
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    debug(message: string): void;
  }

  export interface ServiceDefinition {
    id: string;
    start(): Promise<void>;
    stop(): Promise<void>;
  }

  export interface OpenClawPluginApi {
    logger: PluginLogger;
    config: Record<string, unknown> | undefined;
    registerTool(tool: unknown): void;
    registerService(service: ServiceDefinition): void;
    registerCli(fn: (ctx: { program: unknown }) => void, opts?: { commands?: string[] }): void;
  }
}

declare module "openclaw/plugin-sdk/plugin-entry" {
  import type { OpenClawPluginApi } from "openclaw/plugin-sdk";

  export interface PluginEntryDefinition {
    id: string;
    name: string;
    description: string;
    register(api: OpenClawPluginApi): void;
  }

  export function definePluginEntry(def: PluginEntryDefinition): PluginEntryDefinition;
}
