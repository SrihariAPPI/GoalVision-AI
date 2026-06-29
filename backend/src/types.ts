// Shared domain types for GoalVision AI.

export type EventType =
  | "goal"
  | "penalty-goal"
  | "penalty-miss"
  | "yellow-card"
  | "red-card"
  | "offside"
  | "substitution"
  | "var"
  | "shot"
  | "kickoff"
  | "halftime"
  | "fulltime";

export type Side = "home" | "away";

export interface Player {
  id: string;
  name: string;
  number: number;
  position: string; // e.g. "GK", "CB", "CM", "ST"
  /** Normalised pitch coordinates for formation rendering: 0..100 (x = own goal -> opp goal, y = left -> right). */
  x: number;
  y: number;
  rating?: number;
}

export interface TeamSheet {
  id: string;
  name: string;
  shortName: string;
  color: string; // primary kit colour (hex)
  accent: string; // secondary colour (hex)
  formation: string; // e.g. "4-3-3"
  manager: string;
  lineup: Player[];
  substitutes: Player[];
}

export interface MatchEvent {
  id: string;
  minute: number;
  type: EventType;
  side: Side;
  player: string;
  assist?: string;
  /** Player coming off (for substitutions). */
  playerOff?: string;
  detail: string; // short human label
  /** Pitch location 0..100 for the on-pitch marker. */
  x: number;
  y: number;
}

export interface MatchStats {
  possession: [number, number]; // [home, away] percent
  shots: [number, number];
  shotsOnTarget: [number, number];
  xg: [number, number];
  passes: [number, number];
  passAccuracy: [number, number]; // percent
  corners: [number, number];
  fouls: [number, number];
  offsides: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
}

export interface MomentumPoint {
  minute: number;
  /** -100 (total away dominance) .. +100 (total home dominance). */
  value: number;
}

export interface HeatCell {
  x: number;
  y: number;
  intensity: number; // 0..1
}

export interface Match {
  id: string;
  competition: string;
  stage: string;
  date: string; // ISO date
  venue: string;
  city: string;
  status: "FT" | "AET" | "PEN" | "live";
  result: string; // human readable, e.g. "Argentina win 4-2 on penalties"
  headline: string;
  homeTeam: TeamSheet;
  awayTeam: TeamSheet;
  score: { home: number; away: number; halfTime: [number, number] };
  stats: MatchStats;
  events: MatchEvent[];
  momentum: MomentumPoint[];
  heatmap: { home: HeatCell[]; away: HeatCell[] };
}

// ---- AI layer contracts ----

export type AIProviderName =
  | "gpt-oss"
  | "gemini-flash"
  | "gemini-pro"
  | "nemotron"
  | "minimax"
  | "mock";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  matchId: string;
  message: string;
  history?: ChatTurn[];
  provider?: AIProviderName;
}

export interface ExplainEventRequest {
  matchId: string;
  eventId: string;
  provider?: AIProviderName;
}

export interface AIResult {
  text: string;
  provider: AIProviderName;
  model?: string;
  latency?: number;
}

export interface AIStatus {
  provider: AIProviderName;
  live: boolean;
  model: string;
  latency: number;
  fallback: boolean;
  status: "ok" | "degraded" | "offline";
}
