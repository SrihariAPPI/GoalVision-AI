import { BaseProvider } from "./BaseProvider.js";
import type { GenerateInput } from "./AIProvider.js";
import type { AIProviderName } from "../types.js";
import { MockProvider } from "./MockProvider.js";

export interface GeminiConfig {
  apiKey: string;
  model?: string;
}

/**
 * Google Gemini provider via the REST generateContent endpoint.
 * Use `model: "gemini-2.5-flash"` for Flash, `model: "gemini-2.5-pro"` for Pro.
 */
export class GeminiProvider extends BaseProvider {
  readonly name: AIProviderName;
  readonly model: string;
  private readonly apiKey: string;
  private readonly fallback: BaseProvider;

  constructor(config: GeminiConfig, fallback?: BaseProvider) {
    super();
    this.apiKey = config.apiKey;
    this.model = config.model || "gemini-2.5-flash";
    this.name = this.model.includes("pro") ? "gemini-pro" : "gemini-flash";
    this.fallback = fallback ?? new MockProvider();
  }

  isLive(): boolean {
    return true;
  }

  async generate({ system, user, maxTokens = 320 }: GenerateInput): Promise<string> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: user }] }],
          generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 }
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`Gemini API failed: ${res.status}`);
      const data = (await res.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> };
        }>;
      };
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!text) throw new Error("Empty response from Gemini");
      return text;
    } catch (err) {
      const msg = (err as Error).message;
      console.warn(`[GeminiProvider] failed (${msg}), falling back`);
      return this.fallback.generate({ system, user });
    }
  }
}
