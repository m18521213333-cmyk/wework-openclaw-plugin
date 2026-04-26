/**
 * 开发流水线服务
 *
 * 把企业微信用户的需求文本转交给 OpenClaw 6-Agent 团队,
 * 全流程跑完后把结果(代码包+部署链接)通过企业微信回传给用户。
 *
 * 触发流程:
 *   1. 用户在企业微信发 "@开发助手 我想做一个XX系统"
 *   2. wework-scrm 收到消息 → 检测到触发关键词
 *   3. 启动 DevPipeline → 串联调用 6 个 Agent
 *   4. 完成后用 sendMessage() 把成果发回给客户
 *
 * 与 OpenClaw 的对接方式:
 *   - 通过 OpenClaw HTTP Gateway API 调用 agents
 *   - 默认地址 http://127.0.0.1:8080 (本地 OpenClaw Gateway)
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as crypto from "node:crypto";
import { spawn } from "node:child_process";
import { sendMessage } from "./send-helper.js";

// ============================================
// 类型定义
// ============================================

export interface PipelineConfig {
  /** OpenClaw Gateway URL */
  gatewayUrl: string;
  /** Gateway 认证 token */
  gatewayToken?: string;
  /** 项目根目录 (每个需求会在此目录下建子目录) */
  projectsDir: string;
  /** 是否启用流水线触发 */
  enabled: boolean;
  /** 触发关键词 (消息中包含这些词才会启动流水线) */
  triggerKeywords: string[];
  /** Claude Code 可执行文件路径 (备选: 直接用 claude CLI 而不是 OpenClaw HTTP) */
  claudeCliPath?: string;
}

export interface PipelineRequest {
  /** 触发流水线的企业微信ID */
  wxId: string;
  /** 客户会话ID (用于回传结果) */
  convId: string;
  /** 客户ID */
  senderId: string;
  /** 客户姓名 */
  senderName: string;
  /** 原始需求文本 */
  requirement: string;
}

export interface PipelineStage {
  agent: string;
  prompt: string;
  /** 这个阶段的输出文件 (相对项目目录) */
  outputs?: string[];
  /** 是否可以与其他阶段并行 */
  parallel?: boolean;
}

// ============================================
// 6-Agent 流水线定义
// ============================================

const STAGES: PipelineStage[] = [
  {
    agent: "requirements-analyst",
    prompt: "{REQUIREMENT}\n\n请基于以上需求,输出 docs/requirements.md (用户故事 + 验收标准格式)",
    outputs: ["docs/requirements.md"],
  },
  {
    agent: "product-designer",
    prompt: "请阅读 docs/requirements.md,输出 docs/prd.md (功能模块 + 数据模型 + API契约)",
    outputs: ["docs/prd.md"],
  },
  {
    agent: "ui-designer",
    prompt: "请阅读 docs/prd.md,输出 docs/ui-spec.md 和 prototypes/*.html (可点击的低保真原型)",
    outputs: ["docs/ui-spec.md"],
  },
  {
    agent: "backend-dev",
    prompt: "请阅读 docs/prd.md,在 src/backend/ 实现所有 API。完成后跑 npm run typecheck 确保类型正确",
    outputs: ["src/backend/"],
    parallel: true, // 与 frontend 并行
  },
  {
    agent: "frontend-dev",
    prompt: "请阅读 docs/ui-spec.md 和 docs/prd.md,在 src/frontend/ 实现前端。完成后跑 npm run build",
    outputs: ["src/frontend/"],
    parallel: true,
  },
  {
    agent: "tester",
    prompt: "请阅读 docs/prd.md 和 src/backend/,在 src/backend/tests/ 写集成测试并跑通,输出 docs/test-report.md",
    outputs: ["docs/test-report.md"],
  },
];

// ============================================
// 流水线执行器
// ============================================

export class DevPipeline {
  private config: PipelineConfig;
  private logger: { info: (msg: string) => void; error: (msg: string) => void };

  constructor(
    config: PipelineConfig,
    logger?: { info: (msg: string) => void; error: (msg: string) => void },
  ) {
    this.config = config;
    this.logger = logger ?? {
      info: (msg) => console.log(`[DevPipeline] ${msg}`),
      error: (msg) => console.error(`[DevPipeline] ${msg}`),
    };
  }

  /**
   * 检查消息是否应该触发流水线
   */
  shouldTrigger(message: string): boolean {
    if (!this.config.enabled) return false;
    if (!message) return false;
    return this.config.triggerKeywords.some((kw) => message.includes(kw));
  }

  /**
   * 执行完整流水线 (异步,不阻塞消息处理)
   */
  async execute(req: PipelineRequest): Promise<void> {
    const projectId = this.generateProjectId(req);
    const projectDir = path.join(this.config.projectsDir, projectId);

    try {
      this.logger.info(`[${projectId}] 启动开发流水线: ${req.requirement.slice(0, 50)}...`);

      // 创建项目目录
      await this.initProject(projectDir);

      // 通知用户开始处理
      await this.notifyUser(
        req,
        `✅ 已收到您的需求,开发流水线已启动\n📋 项目编号: ${projectId}\n⏳ 预计 15-25 分钟完成,请稍候`,
      );

      // 执行各阶段
      let currentStage = 0;
      while (currentStage < STAGES.length) {
        const stage = STAGES[currentStage];

        // 检查是否有连续的可并行阶段
        const parallelGroup: PipelineStage[] = [stage];
        while (
          currentStage + parallelGroup.length < STAGES.length &&
          STAGES[currentStage + parallelGroup.length].parallel &&
          stage.parallel
        ) {
          parallelGroup.push(STAGES[currentStage + parallelGroup.length]);
        }

        if (parallelGroup.length > 1) {
          // 并行执行
          this.logger.info(
            `[${projectId}] 并行执行 ${parallelGroup.length} 个阶段: ${parallelGroup.map((s) => s.agent).join(", ")}`,
          );
          await Promise.all(
            parallelGroup.map((s) => this.runStage(projectDir, s, req)),
          );
          currentStage += parallelGroup.length;
        } else {
          // 串行执行
          await this.runStage(projectDir, stage, req);
          currentStage++;
        }

        // 进度通知
        const progress = Math.round((currentStage / STAGES.length) * 100);
        await this.notifyUser(req, `📊 进度 ${progress}% (${currentStage}/${STAGES.length})`);
      }

      // 打包成果
      const archivePath = await this.archiveProject(projectDir, projectId);

      // 推送结果
      await this.notifyUser(
        req,
        `🎉 开发完成!\n📦 项目编号: ${projectId}\n📥 代码包: ${archivePath}\n📝 包含: 需求文档/PRD/UI原型/前后端代码/测试报告`,
      );

      this.logger.info(`[${projectId}] 流水线完成`);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      this.logger.error(`[${projectId}] 流水线失败: ${errMsg}`);
      await this.notifyUser(req, `❌ 开发过程中出错: ${errMsg}\n请稍后重试或联系人工处理`);
    }
  }

  // --------------------------------------------------
  // 内部方法
  // --------------------------------------------------

  private generateProjectId(req: PipelineRequest): string {
    const hash = crypto.createHash("md5")
      .update(`${req.senderId}-${req.requirement}-${Date.now()}`)
      .digest("hex")
      .slice(0, 8);
    const date = new Date().toISOString().slice(0, 10);
    return `proj-${date}-${hash}`;
  }

  private async initProject(projectDir: string): Promise<void> {
    await fs.mkdir(path.join(projectDir, "docs"), { recursive: true });
    await fs.mkdir(path.join(projectDir, "src", "backend"), { recursive: true });
    await fs.mkdir(path.join(projectDir, "src", "frontend"), { recursive: true });
    await fs.mkdir(path.join(projectDir, "prototypes"), { recursive: true });
  }

  /**
   * 调用单个 Agent 阶段
   *
   * 优先级:
   *   1. 如果配了 claudeCliPath, 用本地 Claude Code CLI (推荐, 已经登录的账号)
   *   2. 否则用 OpenClaw Gateway HTTP API
   */
  private async runStage(
    projectDir: string,
    stage: PipelineStage,
    req: PipelineRequest,
  ): Promise<void> {
    this.logger.info(`  → [${stage.agent}] 启动`);

    const prompt = stage.prompt.replace("{REQUIREMENT}", req.requirement);

    if (this.config.claudeCliPath) {
      await this.runWithClaudeCli(projectDir, stage.agent, prompt);
    } else {
      await this.runWithOpenClawGateway(projectDir, stage.agent, prompt);
    }

    this.logger.info(`  ← [${stage.agent}] 完成`);
  }

  /**
   * 通过 Claude Code CLI 执行 Agent (推荐方式)
   *
   * 用法: cd <projectDir> && claude --agent <agent> "<prompt>"
   */
  private runWithClaudeCli(projectDir: string, agent: string, prompt: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const cli = this.config.claudeCliPath!;
      const args = [
        "--agent", agent,
        "--no-interactive",
        prompt,
      ];

      const proc = spawn(cli, args, {
        cwd: projectDir,
        env: { ...process.env, CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS: "1" },
        stdio: ["ignore", "pipe", "pipe"],
      });

      let stderr = "";
      proc.stderr.on("data", (chunk: Buffer) => {
        stderr += chunk.toString();
      });

      proc.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Agent ${agent} 退出码 ${code}: ${stderr.slice(0, 500)}`));
      });

      proc.on("error", reject);
    });
  }

  /**
   * 通过 OpenClaw Gateway HTTP API 执行 Agent
   *
   * POST {gatewayUrl}/v1/agents/{agentId}/run
   * Body: { input: prompt, workspace: projectDir }
   */
  private async runWithOpenClawGateway(
    projectDir: string,
    agent: string,
    prompt: string,
  ): Promise<void> {
    const url = `${this.config.gatewayUrl}/v1/agents/${agent}/run`;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (this.config.gatewayToken) {
      headers.Authorization = `Bearer ${this.config.gatewayToken}`;
    }

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        input: prompt,
        workspace: projectDir,
        // OpenClaw 支持的额外参数
        stream: false,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OpenClaw API 错误 ${res.status}: ${text.slice(0, 300)}`);
    }

    // OpenClaw 返回的是流式 JSON, 这里简化为等待 done
    await res.text();
  }

  /**
   * 把项目目录打成 tar.gz
   */
  private async archiveProject(projectDir: string, projectId: string): Promise<string> {
    const archivePath = path.join(this.config.projectsDir, `${projectId}.tar.gz`);
    return new Promise((resolve, reject) => {
      const proc = spawn(
        "tar",
        ["czf", archivePath, "-C", path.dirname(projectDir), path.basename(projectDir)],
        { stdio: "ignore" },
      );
      proc.on("close", (code) => {
        if (code === 0) resolve(archivePath);
        else reject(new Error(`打包失败,退出码 ${code}`));
      });
      proc.on("error", reject);
    });
  }

  /**
   * 通过企业微信通知用户
   */
  private async notifyUser(req: PipelineRequest, message: string): Promise<void> {
    try {
      sendMessage(req.wxId, req.convId, message);
    } catch (err) {
      this.logger.error(`通知用户失败: ${err}`);
    }
  }
}

// ============================================
// 单例 & 默认配置
// ============================================

let _pipeline: DevPipeline | null = null;

export function initDevPipeline(
  config: Partial<PipelineConfig>,
  logger?: { info: (msg: string) => void; error: (msg: string) => void },
): DevPipeline {
  const fullConfig: PipelineConfig = {
    gatewayUrl: config.gatewayUrl ?? "http://127.0.0.1:8080",
    gatewayToken: config.gatewayToken,
    projectsDir: config.projectsDir ?? path.join(process.env.HOME ?? ".", "wework-projects"),
    enabled: config.enabled ?? false,
    triggerKeywords: config.triggerKeywords ?? ["@开发助手", "@dev", "/dev", "我想做", "帮我开发"],
    claudeCliPath: config.claudeCliPath,
  };

  _pipeline = new DevPipeline(fullConfig, logger);
  return _pipeline;
}

export function getDevPipeline(): DevPipeline | null {
  return _pipeline;
}
