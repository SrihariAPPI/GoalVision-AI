import { BaseProvider } from "./BaseProvider.js";
import type { GenerateInput } from "./AIProvider.js";
import type { AIProviderName } from "../types.js";

/**
 * Offline, deterministic provider — no API key required.
 * Generates analyst-style prose from grounded facts already in the prompt.
 */
export class MockProvider extends BaseProvider {
  readonly name: AIProviderName = "mock";
  readonly model = "mock";

  isLive(): boolean {
    return false;
  }

  async generate({ user }: GenerateInput): Promise<string> {
    if (user.includes("EVENT:")) return this.explainEvent(user);
    if (user.includes("User question:")) return this.answerQuestion(user);
    if (user.includes("match summary")) return this.summary(user);
    if (user.includes("tactical read")) return this.tacticalRead(user);
    return "GoalVision AI is analysing the match data.";
  }

  private grab(source: string, label: string): string {
    const re = new RegExp(`${label}\\s*([^.\\n]+)`);
    const m = source.match(re);
    return m ? m[1].trim().replace(/\.$/, "") : "";
  }

  private explainEvent(user: string): string {
    const player = this.grab(user, "Player:");
    const team = this.grab(user, "Team:");
    const description = this.grab(user, "Description:");
    const minute = this.grab(user, "minute");
    const assist = this.grab(user, "Assisted by:");
    const replaced = this.grab(user, "Player replaced:");
    if (user.includes("offside"))
      return `${player} was flagged offside — at the instant the ball was played, he was beyond the last defender. ${description}. It's the kind of fine margin that decides the biggest games.`;
    if (user.includes("substitution"))
      return `A calculated move: ${player} came on${replaced ? ` for ${replaced}` : ""} around the ${minute}-minute mark. ${description}. The manager was reshaping the rhythm.`;
    if (user.includes("penalty"))
      return `${player} stepped up under enormous pressure. ${description}${assist ? ` The chance was set up by ${assist}.` : ""} Penalties in matches this size swing momentum as much as the scoreline.`;
    if (user.includes("card"))
      return `${player} went into the book. ${description}. Beyond the caution, it forced ${team.replace(/\(.*/, "").trim()} to tread carefully for the rest of the match.`;
    return `A defining moment from ${player}. ${description}${assist ? `, with the assist from ${assist}` : ""}. This is why ${team.replace(/\(.*/, "").trim()} will remember this match.`;
  }

  private answerQuestion(user: string): string {
    const q = this.grab(user, 'User question: "').toLowerCase();
    const headline = this.grab(user, "MATCH:");
    if (q.includes("offside"))
      return `An attacker is offside when they're nearer the goal line than both the ball and the second-last defender at the moment a teammate plays the ball — and then involved in play. In ${headline} the flagged calls were tight, the kind only a replay confirms.`;
    if (q.includes("compare"))
      return `Looking at ${headline}: the contest was finely balanced — possession, shots, and xG all close. The difference came down to which side seized its decisive moments.`;
    if (q.includes("formation"))
      return `The shapes in ${headline} dictated the midfield battle. The formation above shows who had the extra body centrally and who tried to win out wide — the momentum swings followed directly.`;
    if (q.includes("changed the game") || q.includes("who changed"))
      return `The player who changed the game flipped the momentum — check the timeline for the goal or substitution that came before the biggest swing. That's GoalVision's read on ${headline}.`;
    return `Great question about ${headline}. Based on the match data above — the goals, xG, possession and the timeline — the story is one of momentum swings backed by statistics. Ask me to explain any specific moment.`;
  }

  private summary(user: string): string {
    const headline = this.grab(user, "MATCH:");
    const result = this.grab(user, "Result:");
    return `${headline} lived up to its billing. ${result}. The match ebbed and flowed through clear phases, and the timeline tells the story of a contest decided by fine margins and big-moment quality.\n\nThe standout performers rose when it mattered most, and the turning point — visible in the momentum swing — reshaped the contest. For anyone who missed it, this was football at its most dramatic.`;
  }

  private tacticalRead(user: string): string {
    const headline = this.grab(user, "MATCH:");
    const side = user.includes("home team") ? "favoured" : "responded with";
    return `Tactically, the side in question ${side} a clear plan in ${headline}: control central areas, use full-backs for width, and press to win the ball high. Their shape gave numbers in midfield, but the opponent found joy in spaces left behind the press — exactly where the decisive moments originated.`;
  }
}
