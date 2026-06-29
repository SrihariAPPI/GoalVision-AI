import type { AIProviderName } from "../types.js";

/**
 * Abstraction over the language model. The rest of the app depends only on this
 * interface, so IBM Granite and the offline Mock are fully interchangeable.
 */
export interface AIProvider {
  readonly name: AIProviderName;
  /** True when the provider can actually reach a live model. */
  isLive(): boolean;
  /**
   * Generate a completion for a system + user prompt pair.
   * Implementations must never throw to the caller — on failure they return a
   * graceful fallback string so the demo keeps working.
   */
  generate(input: { system: string; user: string; maxTokens?: number }): Promise<string>;
}
