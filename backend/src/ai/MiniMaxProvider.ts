import { BaseProvider } from "./BaseProvider.js";
import type { GenerateInput } from "./AIProvider.js";
import type { AIProviderName } from "../types.js";
import { MockProvider } from "./MockProvider.js";

export interface MiniMaxConfig {
  apiKey: string;
  model?: string;
}

/**
 * MiniMax M3 provider via their OpenAI-compatible endpoint.
 */
export class MiniMaxProvider extends BaseProvider {
  readonly name: AIProviderName = "minimax";
  readonly model: string;
  private readonly apiKey: string;
  private readonly fallback: BaseProvider;

  constructor(config: MiniMaxConfig, fallback?: BaseProvider) {
    super();
    this.apiKey = config.apiKey;
    this.model = config.model || "minimax-m3";
    this.fallback = fallback ?? new MockProvider();
  }

  isLive(): boolean {
    return true;
  }

  async generate({ system, user, maxTokens = 320 }: GenerateInput): Promise<string> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);
      const res = await fetch("https://api.minimax.chat/v1/text/chatcompletion", {
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
      if (!res.ok) throw new Error(`MiniMax API failed: ${res.status}`);
      const data = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const text = data.choices?.[0]?.message?.content?.trim();
      if (!text) throw new Error("Empty response from MiniMax");
      return text;
    } catch (err) {
      const msg = (err as Error).message;
      console.warn(`[MiniMaxProvider] failed (${msg}), falling back`);
      return this.fallback.generate({ system, user });
    }
  }
}
