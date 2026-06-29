import type { AIProviderName, AIResult } from "../types.js";

export interface GenerateInput {
  system: string;
  user: string;
  maxTokens?: number;
}

/**
 * Core abstraction over a language model provider.
 * Every provider implements the raw `generate` method and the typed
 * convenience methods that routes.ts calls directly.
 */
export interface AIProvider {
  readonly name: AIProviderName;
  readonly model: string;
  isLive(): boolean;
  generate(input: GenerateInput): Promise<string>;
  chat(matchId: string, message: string): Promise<AIResult>;
  summarize(matchId: string): Promise<AIResult>;
  tactical(matchId: string, side: "home" | "away"): Promise<AIResult>;
  explain(matchId: string, eventId: string): Promise<AIResult>;
  generateInsights(matchId: string, type: string): Promise<AIResult>;
}
