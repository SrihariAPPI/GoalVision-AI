import { BaseProvider } from "./BaseProvider.js";
import type { GenerateInput } from "./AIProvider.js";
import type { AIProviderName } from "../types.js";
import { MockProvider } from "./MockProvider.js";

export interface GraniteConfig {
  apiKey: string;
  endpoint?: string;
  model?: string;
}

/**
 * IBM Granite AI Provider.
 * Fully compatible with watsonx.ai (IBM Cloud) IAM token auth and raw endpoints,
 * as well as Hugging Face, Ollama, and standard OpenAI-compatible routes.
 */
export class GraniteProvider extends BaseProvider {
  readonly name: AIProviderName = "ibm-granite";
  readonly model: string;
  private readonly endpoint: string;
  private readonly apiKey: string;
  private readonly fallback: BaseProvider;
  private tokenCache: { token: string; expiry: number } | null = null;

  constructor(config: GraniteConfig, fallback?: BaseProvider) {
    super();
    this.apiKey = config.apiKey;
    this.endpoint = (config.endpoint || "https://us-south.ml.cloud.ibm.com").replace(/\/$/, "");
    this.model = config.model || "ibm/granite-3.0-8b-instruct";
    this.fallback = fallback ?? new MockProvider();
  }

  isLive(): boolean {
    return !!this.apiKey;
  }

  private async getWatsonxToken(): Promise<string> {
    if (this.tokenCache && Date.now() < this.tokenCache.expiry) {
      return this.tokenCache.token;
    }
    console.log("[IBM Granite] Exchanging IAM API key for Watsonx access token...");
    const res = await fetch("https://iam.cloud.ibm.com/identity/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${this.apiKey}`
    });
    if (!res.ok) throw new Error(`IAM Token exchange failed: ${res.status}`);
    const data = (await res.json()) as { access_token: string; expires_in: number };
    const token = data.access_token;
    // Cache token, expiring 5 minutes early
    const expiry = Date.now() + (data.expires_in - 300) * 1000;
    this.tokenCache = { token, expiry };
    return token;
  }

  async generate({ system, user, maxTokens = 320 }: GenerateInput): Promise<string> {
    console.log(`[IBM Granite] Invoking model ${this.model}`);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);

      const isWatsonx = this.endpoint.includes("cloud.ibm.com");
      let url = this.endpoint;
      const headers: Record<string, string> = { "Content-Type": "application/json" };

      if (isWatsonx) {
        const token = await this.getWatsonxToken();
        headers["Authorization"] = `Bearer ${token}`;
        if (!url.includes("/chat/completions") && !url.includes("/text/generation")) {
          url = `${url}/ml/v1/text/generation?version=2023-05-29`;
        }
      } else {
        headers["Authorization"] = `Bearer ${this.apiKey}`;
        if (!url.includes("/chat/completions")) {
          url = `${url}/chat/completions`;
        }
      }

      let body: string;
      if (isWatsonx && url.includes("/text/generation")) {
        const projectId = process.env.WATSONX_PROJECT_ID || "";
        body = JSON.stringify({
          model_id: this.model,
          input: `<|system|>\n${system}\n<|user|>\n${user}\n<|assistant|>\n`,
          parameters: {
            max_new_tokens: maxTokens,
            decoding_method: "greedy",
            temperature: 0.7
          },
          project_id: projectId
        });
      } else {
        body = JSON.stringify({
          model: this.model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user }
          ],
          max_tokens: maxTokens,
          temperature: 0.7
        });
      }

      const res = await fetch(url, {
        method: "POST",
        headers,
        body,
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`IBM Granite API failed: ${res.status} - ${errorText}`);
      }

      let text = "";
      if (isWatsonx && url.includes("/text/generation")) {
        const data = (await res.json()) as {
          results?: Array<{ generated_text?: string }>;
        };
        text = data.results?.[0]?.generated_text?.trim() || "";
      } else {
        const data = (await res.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        text = data.choices?.[0]?.message?.content?.trim() || "";
      }

      if (!text) throw new Error("Empty response from IBM Granite");
      return text;
    } catch (err) {
      const msg = (err as Error).message;
      console.warn(`[IBM Granite] failed (${msg}), falling back dynamically`);
      return this.fallback.generate({ system, user });
    }
  }
}
