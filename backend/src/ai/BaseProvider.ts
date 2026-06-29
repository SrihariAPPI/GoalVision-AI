import type { AIProvider, GenerateInput } from "./AIProvider.js";
import type { AIProviderName, AIResult, Side } from "../types.js";
import { getMatch, getEvent } from "../data/matches.js";
import { matchContext, eventContext } from "./context.js";
import { explainPrompt, chatPrompt, summaryPrompt, tacticalPrompt, insightsPrompt } from "./prompts.js";

/**
 * Abstract base that implements the typed AIProvider convenience methods.
 * Concrete subclasses only need to implement `generate()` and supply `name`, `model`.
 */
export abstract class BaseProvider implements AIProvider {
  abstract readonly name: AIProviderName;
  abstract readonly model: string;
  abstract isLive(): boolean;
  abstract generate(input: GenerateInput): Promise<string>;

  async chat(matchId: string, message: string): Promise<AIResult> {
    const match = getMatch(matchId);
    if (!match) return { text: "Match not found.", provider: this.name, model: this.model };
    const { system, user } = chatPrompt(matchContext(match), message);
    const text = await this.generate({ system, user, maxTokens: 320 });
    return { text, provider: this.name, model: this.model };
  }

  async summarize(matchId: string): Promise<AIResult> {
    const match = getMatch(matchId);
    if (!match) return { text: "Match not found.", provider: this.name, model: this.model };
    const { system, user } = summaryPrompt(matchContext(match));
    const text = await this.generate({ system, user, maxTokens: 360 });
    return { text, provider: this.name, model: this.model };
  }

  async tactical(matchId: string, side: Side): Promise<AIResult> {
    const match = getMatch(matchId);
    if (!match) return { text: "Match not found.", provider: this.name, model: this.model };
    const { system, user } = tacticalPrompt(matchContext(match), side);
    const text = await this.generate({ system, user, maxTokens: 280 });
    return { text, provider: this.name, model: this.model };
  }

  async explain(matchId: string, eventId: string): Promise<AIResult> {
    const found = getEvent(matchId, eventId);
    if (!found) return { text: "Event not found.", provider: this.name, model: this.model };
    const facts = eventContext(found.match, found.event);
    const { system, user } = explainPrompt(found.event.type, facts);
    const text = await this.generate({ system, user, maxTokens: 220 });
    return { text, provider: this.name, model: this.model };
  }

  async generateInsights(matchId: string, type: string): Promise<AIResult> {
    const match = getMatch(matchId);
    if (!match) return { text: "Match not found.", provider: this.name, model: this.model };
    const { system, user } = insightsPrompt(matchContext(match), type);
    const text = await this.generate({ system, user, maxTokens: 400 });
    return { text, provider: this.name, model: this.model };
  }
}
