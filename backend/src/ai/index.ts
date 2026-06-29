import type { AIProvider } from "./AIProvider.js";
import { GraniteProvider } from "./GraniteProvider.js";
import { MockProvider } from "./MockProvider.js";

let provider: AIProvider | null = null;

/**
 * Factory: returns IBM Granite when all watsonx credentials are present,
 * otherwise the offline MockProvider. Resolved once and cached.
 */
export function getAIProvider(): AIProvider {
  if (provider) return provider;

  const apiKey = process.env.WATSONX_API_KEY?.trim();
  const projectId = process.env.WATSONX_PROJECT_ID?.trim();
  const url = process.env.WATSONX_URL?.trim() || "https://us-south.ml.cloud.ibm.com";
  const modelId = process.env.WATSONX_MODEL_ID?.trim() || "ibm/granite-3-8b-instruct";

  if (apiKey && projectId) {
    console.log(`[AIProvider] IBM Granite enabled (model: ${modelId}).`);
    provider = new GraniteProvider({ apiKey, projectId, url, modelId });
  } else {
    console.log("[AIProvider] No watsonx credentials found — using MockProvider (offline mode).");
    provider = new MockProvider();
  }
  return provider;
}

export type { AIProvider };
