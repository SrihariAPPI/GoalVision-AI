// Domain types shared across the GoalVision AI frontend. Mirrors the backend contract.

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
  position: string;
  x: number;
  y: number;
  rating?: number;
}

export interface TeamSheet {
  id: string;
  name: string;
  shortName: string;
  color: string;
  accent: string;
  formation: string;
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
  playerOff?: string;
  detail: string;
  x: number;
  y: number;
}

export interface MatchStats {
  possession: [number, number];
  shots: [number, number];
  shotsOnTarget: [number, number];
  xg: [number, number];
  passes: [number, number];
  passAccuracy: [number, number];
  corners: [number, number];
  fouls: [number, number];
  offsides: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
}

export interface MomentumPoint {
  minute: number;
  value: number;
}

export interface HeatCell {
  x: number;
  y: number;
  intensity: number;
}

export interface Match {
  id: string;
  competition: string;
  stage: string;
  date: string;
  venue: string;
  city: string;
  status: "FT" | "AET" | "PEN" | "live";
  result: string;
  headline: string;
  homeTeam: TeamSheet;
  awayTeam: TeamSheet;
  score: { home: number; away: number; halfTime: [number, number] };
  stats: MatchStats;
  events: MatchEvent[];
  momentum: MomentumPoint[];
  heatmap: { home: HeatCell[]; away: HeatCell[] };
}

export interface MatchSummaryCard {
  id: string;
  competition: string;
  stage: string;
  date: string;
  venue: string;
  city: string;
  status: Match["status"];
  result: string;
  headline: string;
  score: Match["score"];
  homeTeam: { name: string; shortName: string; color: string };
  awayTeam: { name: string; shortName: string; color: string };
}

export type AIProviderName =
  | "gpt-oss"
  | "gemini-flash"
  | "gemini-pro"
  | "nemotron"
  | "minimax"
  | "ibm-granite"
  | "mock";

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

export type ProviderOption = AIProviderName | "auto";

export interface LiveFixture {
  id: string;
  competition: string;
  stage: string;
  date: string;
  venue: string;
  city: string;
  status: Match["status"];
  result: string;
  headline: string;
  score: Match["score"];
  homeTeam: { name: string; shortName: string; color: string; logo?: string };
  awayTeam: { name: string; shortName: string; color: string; logo?: string };
  elapsed?: number;
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}
