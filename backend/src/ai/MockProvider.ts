import type { AIProvider } from "./AIProvider.js";

/**
 * Offline, deterministic provider used when IBM credentials are absent.
 * It is not a language model — it composes analyst-style prose from the
 * grounded facts already present in the prompt, so the demo stays compelling.
 */
export class MockProvider implements AIProvider {
  readonly name = "mock" as const;

  isLive(): boolean {
    return false;
  }

  async generate({ user }: { system: string; user: string }): Promise<string> {
    if (user.includes("EVENT:")) return this.explainEvent(user);
    if (user.includes("User question:")) return this.answerQuestion(user);
    if (user.includes("match summary")) return this.summary(user);
    if (user.includes("tactical read")) return this.tactical(user);
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

    if (user.includes("offside")) {
      return `${player} was flagged offside here because, at the instant the ball was played, he was positioned beyond the last defender with no opponent (other than the goalkeeper) between him and the goal line. ${description}. It's the kind of fine margin that decides the biggest games.`;
    }
    if (user.includes("substitution")) {
      return `This was a calculated move: ${player} came on${replaced ? ` for ${replaced}` : ""} around the ${minute}-minute mark. ${description}. The manager was changing the rhythm of the game, and it shifted how ${team.replace(/\(.*/, "").trim()} controlled the contest.`;
    }
    if (user.includes("penalty")) {
      return `${player} stepped up under enormous pressure. ${description}${assist ? ` The chance was set up by ${assist}.` : ""} Penalties in matches this size are as much about nerve as technique, and this one swung the momentum.`;
    }
    if (user.includes("card")) {
      return `${player} went into the book here. ${description}. Beyond the caution itself, it forced ${team.replace(/\(.*/, "").trim()} to tread carefully for the rest of the match — one mistimed challenge from real trouble.`;
    }
    return `A defining moment from ${player}. ${description}${assist ? `, with the assist from ${assist}` : ""}. Goals like this are why ${team.replace(/\(.*/, "").trim()} will remember this match forever.`;
  }

  private answerQuestion(user: string): string {
    const q = this.grab(user, 'User question: "').toLowerCase();
    const headline = this.grab(user, "MATCH:");
    if (q.includes("offside")) {
      return `An attacker is offside when they're nearer the opponents' goal line than both the ball and the second-last defender at the moment a teammate plays the ball — and they're then involved in the play. In this match (${headline}) the flagged calls were tight, the kind only confirmed on a replay.`;
    }
    if (q.includes("compare")) {
      return `Looking at the data for ${headline}: the contest was finely balanced, with possession, shots and expected goals all close. The difference came down to which side took its decisive moments — the timeline above shows exactly where the game turned.`;
    }
    if (q.includes("formation")) {
      return `The shapes in ${headline} dictated the battle in midfield. The formations listed above tell you who had the extra body in the centre and who tried to win the game out wide — and the momentum swings followed directly from that.`;
    }
    if (q.includes("changed the game") || q.includes("who changed")) {
      return `The player who changed the game was the one whose intervention flipped the momentum — check the timeline for the goal or substitution that came right before the biggest swing. That's GoalVision's read on ${headline}.`;
    }
    return `Great question about ${headline}. Based on the match data above — the goals, the xG, possession and the timeline — the story is one of momentum swings that the statistics back up. Ask me to explain any specific moment and I'll break it down.`;
  }

  private summary(user: string): string {
    const headline = this.grab(user, "MATCH:");
    const result = this.grab(user, "Result:");
    return `${headline} was a contest that lived up to its billing. ${result}. The match ebbed and flowed through clear phases of control, and the timeline of goals tells the story of a game decided by fine margins and big-moment quality.\n\nThe standout performers rose when it mattered most, and the turning point — visible in the momentum swing — reshaped the contest. For anyone who missed it, this was football at its most dramatic.`;
  }

  private tactical(user: string): string {
    const headline = this.grab(user, "MATCH:");
    const side = user.includes("home team") ? "favoured" : "responded with";
    return `Tactically, the side in question ${side} a clear plan in ${headline}: control the central areas, use the full-backs for width, and press to win the ball high. Their shape gave them numbers in midfield, but the opponent found joy in the spaces left behind the press — exactly where the decisive moments originated.`;
  }
}
