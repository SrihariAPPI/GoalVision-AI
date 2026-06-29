import { BaseProvider } from "./BaseProvider.js";
import type { GenerateInput } from "./AIProvider.js";
import type { AIProviderName } from "../types.js";
import { MockProvider } from "./MockProvider.js";

export interface OpenAIConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
}

/**
 * OpenAI-compatible provider targeting NVIDIA NIM's endpoint.
 * Base URL defaults to https://integrate.api.nvidia.com/v1
 * Model defaults to openai/gpt-oss-120b
 */
export class OpenAIProvider extends BaseProvider {
  readonly name: AIProviderName = "gpt-oss";
  readonly model: string;
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly fallback: BaseProvider;

  constructor(config: OpenAIConfig, fallback?: BaseProvider) {
    super();
    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl || "https://integrate.api.nvidia.com/v1").replace(/\/$/, "");
    this.model = config.model || "openai/gpt-oss-120b";
    this.fallback = fallback ?? new MockProvider();
  }

  isLive(): boolean {
    return true;
  }

  async generate({ system, user, maxTokens = 320 }: GenerateInput): Promise<string> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);
      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user }
          ],
          max_tokens: maxTokens,
          temperature: 0.7
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`OpenAI API failed: ${res.status}`);
      const data = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const text = data.choices?.[0]?.message?.content?.trim();
      if (!text) throw new Error("Empty response from OpenAI");
      return text;
    } catch (err) {
      const msg = (err as Error).message;
      console.warn(`[OpenAIProvider] failed (${msg}), falling back`);
      return this.fallback.generate({ system, user });
    }
  }
}
