import type { AIResult, AIStatus, ChatTurn, Match, MatchSummaryCard, Side } from "../types";
import { matches as localMatches, getMatch as getLocalMatch } from "../data/matches";

const BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

/**
 * Tiny fetch wrapper. If the backend is unreachable, callers fall back to the
 * bundled dataset / a local mock so the demo never shows a blank screen.
 */
async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}

function toCard(m: Match): MatchSummaryCard {
  return {
    id: m.id,
    competition: m.competition,
    stage: m.stage,
    date: m.date,
    venue: m.venue,
    city: m.city,
    status: m.status,
    result: m.result,
    headline: m.headline,
    score: m.score,
    homeTeam: { name: m.homeTeam.name, shortName: m.homeTeam.shortName, color: m.homeTeam.color },
    awayTeam: { name: m.awayTeam.name, shortName: m.awayTeam.shortName, color: m.awayTeam.color }
  };
}

// ---- Local offline-mock fallbacks (mirror the backend MockProvider intent) ----

function localExplain(matchId: string, eventId: string): AIResult {
  const m = getLocalMatch(matchId);
  const ev = m?.events.find((e) => e.id === eventId);
  if (!m || !ev) return { text: "No data available for this event.", provider: "mock" };
  const team = ev.side === "home" ? m.homeTeam.name : m.awayTeam.name;
  let text: string;
  switch (ev.type) {
    case "offside":
      text = `${ev.player} was flagged offside because, the moment the ball was played, he was beyond the last defender with only the goalkeeper between him and goal. ${ev.detail}. A margin this fine is exactly what decides the biggest games.`;
      break;
    case "substitution":
      text = `A calculated change: ${ev.player} came on${ev.playerOff ? ` for ${ev.playerOff}` : ""} on ${ev.minute}'. ${ev.detail}. The manager was reshaping how ${team} controlled the contest.`;
      break;
    case "penalty-goal":
      text = `${ev.player} held his nerve from the spot. ${ev.detail}. Penalties in matches this size are about composure as much as technique — and this one moved the momentum.`;
      break;
    case "yellow-card":
    case "red-card":
      text = `${ev.player} went into the book. ${ev.detail}. Beyond the caution, it forced ${team} to play on a knife-edge for the rest of the match.`;
      break;
    default:
      text = `A defining moment from ${ev.player}. ${ev.detail}${ev.assist ? `, set up by ${ev.assist}` : ""}. Goals like this are why ${team} will remember this match forever.`;
  }
  return { text, provider: "mock" };
}

function localChat(matchId: string, message: string): AIResult {
  const m = getLocalMatch(matchId);
  if (!m) return { text: "Select a match first.", provider: "mock" };
  const head = `${m.homeTeam.name} ${m.score.home}-${m.score.away} ${m.awayTeam.name}`;
  const q = message.toLowerCase();
  let text: string;
  if (q.includes("offside"))
    text = `An attacker is offside when they're closer to the goal line than both the ball and the second-last defender at the moment the ball is played — then become active. The flagged calls in ${head} were tight, the kind only a replay confirms.`;
  else if (q.includes("compare"))
    text = `In ${head} the contest was finely balanced: possession ${m.stats.possession[0]}–${m.stats.possession[1]}, shots ${m.stats.shots[0]}–${m.stats.shots[1]}, and xG ${m.stats.xg[0]}–${m.stats.xg[1]}. The difference was which side took its decisive moments.`;
  else if (q.includes("formation"))
    text = `${m.homeTeam.name} lined up ${m.homeTeam.formation} and ${m.awayTeam.name} ${m.awayTeam.formation}. The extra body in midfield dictated control, and the momentum swings followed directly from that battle.`;
  else if (q.includes("changed"))
    text = `Look at the timeline of ${head}: the player who changed the game is the one whose goal or substitution came right before the biggest momentum swing. That intervention flipped the match.`;
  else
    text = `Based on the data for ${head} — goals, xG ${m.stats.xg[0]}–${m.stats.xg[1]}, possession ${m.stats.possession[0]}–${m.stats.possession[1]} and the timeline — this was a game of momentum swings backed by the numbers. Ask me about any specific moment.`;
  return { text, provider: "mock" };
}

function localSummary(matchId: string): AIResult {
  const m = getLocalMatch(matchId);
  if (!m) return { text: "No match selected.", provider: "mock" };
  const head = `${m.homeTeam.name} ${m.score.home}-${m.score.away} ${m.awayTeam.name}`;
  return {
    text: `${head} lived up to its billing. ${m.result}. The match moved through clear phases of control, and the timeline of goals tells the story of a contest decided by fine margins and big-moment quality.\n\nThe standout performers rose when it mattered, and the turning point — visible in the momentum swing — reshaped everything. For anyone who missed it, this was football at its most dramatic.`,
    provider: "mock"
  };
}

function localTactical(matchId: string, side: Side): AIResult {
  const m = getLocalMatch(matchId);
  if (!m) return { text: "No match selected.", provider: "mock" };
  const team = side === "home" ? m.homeTeam : m.awayTeam;
  return {
    text: `${team.name} set up in a ${team.formation} under ${team.manager}: control central areas, use the full-backs for width, and press to win the ball high. The shape gave them numbers in midfield, but the opponent found joy in the spaces behind the press — exactly where the decisive moments originated.`,
    provider: "mock"
  };
}

// ---- Public API (network-first, local fallback) ----

export const api = {
  async listMatches(): Promise<MatchSummaryCard[]> {
    try {
      return await get<MatchSummaryCard[]>("/matches");
    } catch {
      return localMatches.map(toCard);
    }
  },

  async getMatch(id: string): Promise<Match | undefined> {
    try {
      return await get<Match>(`/matches/${id}`);
    } catch {
      return getLocalMatch(id);
    }
  },

  async aiStatus(): Promise<AIStatus> {
    try {
      return await get<AIStatus>("/ai-status");
    } catch {
      return { provider: "mock", live: false, model: "mock", latency: 0, fallback: false, status: "offline" };
    }
  },

  async explain(matchId: string, eventId: string): Promise<AIResult> {
    try {
      return await post<AIResult>("/explain", { matchId, eventId });
    } catch {
      return localExplain(matchId, eventId);
    }
  },

  async chat(matchId: string, message: string, history: ChatTurn[] = []): Promise<AIResult> {
    try {
      return await post<AIResult>("/chat", { matchId, message, history });
    } catch {
      return localChat(matchId, message);
    }
  },

  async summary(matchId: string): Promise<AIResult> {
    try {
      return await post<AIResult>("/summary", { matchId });
    } catch {
      return localSummary(matchId);
    }
  },

  async tactical(matchId: string, side: Side): Promise<AIResult> {
    try {
      return await post<AIResult>("/tactical", { matchId, side });
    } catch {
      return localTactical(matchId, side);
    }
  }
};
