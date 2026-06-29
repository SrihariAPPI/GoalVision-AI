import type { AIProvider, GenerateInput } from "./AIProvider.js";
import type {
  AIProviderName,
  AIResult,
  AIStatus,
  Side
} from "../types.js";
import { OpenAIProvider } from "./OpenAIProvider.js";
import { GeminiProvider } from "./GeminiProvider.js";
import { NemotronProvider } from "./NemotronProvider.js";
import { MiniMaxProvider } from "./MiniMaxProvider.js";
import { MockProvider } from "./MockProvider.js";

// ── Intelligent Router ───────────────────────────────────────────────────────

type TaskType = "quick" | "deep" | "tactical";

const TASK_ROUTING: Record<string, TaskType> = {
  chat: "quick",
  summarize: "deep",
  explain: "deep",
  generateInsights: "deep",
  tactical: "tactical"
};

/**
 * Enterprise multi-model AI router.
 *
 * Routes each task type to the optimal provider:
 *   quick    → Gemini Flash
 *   deep     → GPT OSS 120B
 *   tactical → Gemini Pro
 *
 * Falls back through the chain on failure:
 *   GPT OSS → Gemini Pro → Gemini Flash → Nemotron → MiniMax → Mock
 */
export class AIProviderRouter implements AIProvider {
  readonly name: AIProviderName;
  readonly model: string;
  private readonly chain: AIProvider[];
  private readonly taskMap: Record<TaskType, AIProvider>;
  private lastLatency = 0;
  private lastFallback = false;

  constructor(providers: {
    gptOss?: AIProvider;
    geminiPro?: AIProvider;
    geminiFlash?: AIProvider;
    nemotron?: AIProvider;
    minimax?: AIProvider;
    mock: AIProvider;
  }) {
    this.chain = [
      providers.gptOss,
      providers.geminiPro,
      providers.geminiFlash,
      providers.nemotron,
      providers.minimax,
      providers.mock
    ].filter(Boolean) as AIProvider[];

    this.taskMap = {
      quick: providers.geminiFlash ?? providers.gptOss ?? this.chain[0],
      deep: providers.gptOss ?? providers.geminiPro ?? this.chain[0],
      tactical: providers.geminiPro ?? providers.gptOss ?? this.chain[0]
    };

    this.name = this.chain[0].name;
    this.model = this.chain[0].model;
  }

  isLive(): boolean {
    return this.chain[0].isLive();
  }

  async generate(input: GenerateInput): Promise<string> {
    for (const p of this.chain) {
      try {
        return await p.generate(input);
      } catch { /* try next */ }
    }
    return "Analysis unavailable.";
  }

  // ── Typed methods ─────────────────────────────────────────────────────────

  async chat(matchId: string, message: string): Promise<AIResult> {
    return this.route("chat", (p) => p.chat(matchId, message));
  }

  async summarize(matchId: string): Promise<AIResult> {
    return this.route("summarize", (p) => p.summarize(matchId));
  }

  async tactical(matchId: string, side: Side): Promise<AIResult> {
    return this.route("tactical", (p) => p.tactical(matchId, side));
  }

  async explain(matchId: string, eventId: string): Promise<AIResult> {
    return this.route("explain", (p) => p.explain(matchId, eventId));
  }

  async generateInsights(matchId: string, type: string): Promise<AIResult> {
    return this.route("generateInsights", (p) => p.generateInsights(matchId, type));
  }

  // ── Internal ──────────────────────────────────────────────────────────────

  private getTaskType(method: string): TaskType {
    return TASK_ROUTING[method] ?? "deep";
  }

  private async route(method: string, fn: (p: AIProvider) => Promise<AIResult>): Promise<AIResult> {
    const start = Date.now();
    const task = this.getTaskType(method);
    const primary = this.taskMap[task];
    const startIdx = this.chain.indexOf(primary);
    const fallback = startIdx > 0 ? this.chain.slice(startIdx) : this.chain;

    for (let i = 0; i < fallback.length; i++) {
      try {
        const result = await fn(fallback[i]);
        this.lastLatency = Date.now() - start;
        this.lastFallback = i > 0;
        if (i > 0) console.log(`[Router] ${method} fell back to ${fallback[i].name}`);
        return { ...result, latency: this.lastLatency };
      } catch (err) {
        if (i < fallback.length - 1) {
          console.warn(`[Router] ${fallback[i].name} failed for ${method}, trying ${fallback[i + 1].name}`);
        }
      }
    }
    this.lastLatency = Date.now() - start;
    return {
      text: "Analysis temporarily unavailable. Please try again.",
      provider: "mock",
      model: "mock",
      latency: this.lastLatency
    };
  }

  getStatus(): AIStatus {
    const live = this.chain[0].isLive();
    return {
      provider: this.chain[0].name,
      live,
      model: this.chain[0].model,
      latency: this.lastLatency,
      fallback: this.lastFallback,
      status: !live ? "offline" : this.lastFallback ? "degraded" : "ok"
    };
  }
}

// ── Factory ──────────────────────────────────────────────────────────────────

let router: AIProviderRouter | null = null;

/**
 * Factory: creates or returns the cached AIProviderRouter.
 * Providers are enabled by environment variables and constructed
 * bottom-up so each can reference the next fallback.
 *
 *   GPT OSS 120B   ← OPENAI_API_KEY + OPENAI_BASE_URL (NVIDIA NIM)
 *   Gemini Pro     ← GEMINI_API_KEY
 *   Gemini Flash   ← GEMINI_API_KEY
 *   Nemotron Ultra ← NVIDIA_API_KEY
 *   MiniMax M3     ← NVIDIA_API_KEY or MINIMAX_MODEL
 *   Mock           ← always available
 */
export function getAIProvider(): AIProviderRouter {
  if (router) return router;

  const mock = new MockProvider();

  const createProviders = () => {
    const openaiKey = process.env.OPENAI_API_KEY?.trim();
    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    const nvidiaKey = process.env.NVIDIA_API_KEY?.trim();

    // Build from bottom up
    let minimax: AIProvider | undefined;
    if (nvidiaKey || process.env.MINIMAX_MODEL?.trim()) {
      minimax = new MiniMaxProvider(
        { apiKey: nvidiaKey ?? "", model: process.env.MINIMAX_MODEL?.trim() },
        mock
      );
    }

    let nemotron: AIProvider | undefined;
    if (nvidiaKey) {
      nemotron = new NemotronProvider(
        { apiKey: nvidiaKey, model: process.env.NEMOTRON_MODEL?.trim() },
        (minimax ?? mock)
      );
    }

    let geminiFlash: AIProvider | undefined;
    let geminiPro: AIProvider | undefined;
    if (geminiKey) {
      geminiFlash = new GeminiProvider(
        { apiKey: geminiKey, model: process.env.GEMINI_FLASH_MODEL || "gemini-2.5-flash" },
        (nemotron ?? minimax ?? mock)
      );
      geminiPro = new GeminiProvider(
        { apiKey: geminiKey, model: process.env.GEMINI_PRO_MODEL || "gemini-2.5-pro" },
        (geminiFlash ?? nemotron ?? minimax ?? mock)
      );
    }

    let gptOss: AIProvider | undefined;
    if (openaiKey) {
      gptOss = new OpenAIProvider(
        {
          apiKey: openaiKey,
          baseUrl: process.env.OPENAI_BASE_URL?.trim(),
          model: process.env.OPENAI_MODEL?.trim()
        },
        (geminiPro ?? geminiFlash ?? nemotron ?? minimax ?? mock)
      );
    }

    return { gptOss, geminiPro, geminiFlash, nemotron, minimax, mock };
  };

  router = new AIProviderRouter(createProviders());
  console.log(`[AI] Router active — primary: ${router.name} (${router.model})`);
  return router;
}

export type { AIProvider };
