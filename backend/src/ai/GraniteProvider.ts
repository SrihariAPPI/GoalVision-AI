import type { AIProvider } from "./AIProvider.js";
import { MockProvider } from "./MockProvider.js";

export interface GraniteConfig {
  apiKey: string;
  projectId: string;
  url: string;
  modelId: string;
}

interface TokenCache {
  token: string;
  expiresAt: number;
}

/**
 * IBM Granite via watsonx.ai. Uses the REST text-generation endpoint with an
 * IAM bearer token (cached until expiry). Any failure degrades gracefully to
 * the offline MockProvider so a flaky network never breaks the demo.
 */
export class GraniteProvider implements AIProvider {
  readonly name = "granite" as const;
  private tokenCache: TokenCache | null = null;
  private readonly fallback = new MockProvider();

  constructor(private readonly config: GraniteConfig) {}

  isLive(): boolean {
    return true;
  }

  private async getToken(): Promise<string> {
    const now = Date.now();
    if (this.tokenCache && this.tokenCache.expiresAt > now + 60_000) {
      return this.tokenCache.token;
    }
    const res = await fetch("https://iam.cloud.ibm.com/identity/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: new URLSearchParams({
        grant_type: "urn:ibm:params:oauth:grant-type:apikey",
        apikey: this.config.apiKey
      })
    });
    if (!res.ok) throw new Error(`IAM token request failed: ${res.status}`);
    const data = (await res.json()) as { access_token: string; expires_in: number };
    this.tokenCache = {
      token: data.access_token,
      expiresAt: now + data.expires_in * 1000
    };
    return data.access_token;
  }

  async generate({
    system,
    user,
    maxTokens = 320
  }: {
    system: string;
    user: string;
    maxTokens?: number;
  }): Promise<string> {
    try {
      const token = await this.getToken();
      const prompt =
        `<|system|>\n${system}\n<|user|>\n${user}\n<|assistant|>\n`;
      const res = await fetch(`${this.config.url}/ml/v1/text/generation?version=2024-05-31`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          model_id: this.config.modelId,
          project_id: this.config.projectId,
          input: prompt,
          parameters: {
            decoding_method: "greedy",
            max_new_tokens: maxTokens,
            min_new_tokens: 30,
            repetition_penalty: 1.05,
            stop_sequences: ["<|user|>", "<|system|>"]
          }
        })
      });
      if (!res.ok) throw new Error(`watsonx generation failed: ${res.status}`);
      const data = (await res.json()) as { results?: Array<{ generated_text?: string }> };
      const text = data.results?.[0]?.generated_text?.trim();
      if (!text) throw new Error("Empty generation from Granite");
      return text;
    } catch (err) {
      console.warn("[GraniteProvider] live call failed, using mock fallback:", (err as Error).message);
      return this.fallback.generate({ system, user });
    }
  }
}
