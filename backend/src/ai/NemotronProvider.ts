import { BaseProvider } from "./BaseProvider.js";
import type { GenerateInput } from "./AIProvider.js";
import type { AIProviderName } from "../types.js";
import { MockProvider } from "./MockProvider.js";

export interface NemotronConfig {
  apiKey: string;
  model?: string;
}

/**
 * NVIDIA Nemotron Ultra via the NVIDIA NIM OpenAI-compatible endpoint.
 */
export class NemotronProvider extends BaseProvider {
  readonly name: AIProviderName = "nemotron";
  readonly model: string;
  private readonly apiKey: string;
  private readonly fallback: BaseProvider;

  constructor(config: NemotronConfig, fallback?: BaseProvider) {
    super();
    this.apiKey = config.apiKey;
    this.model = config.model || "nvidia/nemotron-ultra";
    this.fallback = fallback ?? new MockProvider();
  }

  isLive(): boolean {
    return true;
  }

  async generate({ system, user, maxTokens = 320 }: GenerateInput): Promise<string> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);
      const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
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
      if (!res.ok) throw new Error(`Nemotron API failed: ${res.status}`);
      const data = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const text = data.choices?.[0]?.message?.content?.trim();
      if (!text) throw new Error("Empty response from Nemotron");
      return text;
    } catch (err) {
      const msg = (err as Error).message;
      console.warn(`[NemotronProvider] failed (${msg}), falling back`);
      return this.fallback.generate({ system, user });
    }
  }
}
