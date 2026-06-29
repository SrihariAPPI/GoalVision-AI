import type { Match } from "../types";

/**
 * Performance-based win probability derived transparently from expected goals (xG).
 * Not a black box: the formula is shown to the user so the number is explainable.
 */
export function computeWinProbability(match: Match) {
  const [xgH, xgA] = match.stats.xg;
  const diff = Math.abs(xgH - xgA);
  const pDraw = Math.min(0.32, Math.max(0.12, 0.3 - diff * 0.08));
  const remaining = 1 - pDraw;
  const total = xgH + xgA || 1;
  const pHome = remaining * (xgH / total);
  const pAway = remaining * (xgA / total);
  return {
    home: Math.round(pHome * 100),
    draw: Math.round(pDraw * 100),
    away: Math.round(pAway * 100)
  };
}

export interface Factor {
  /** Feature label shown to the user. */
  label: string;
  /** Signed contribution in percentage points: positive favours home, negative favours away. */
  contribution: number;
  /** Raw values for the evidence panel. */
  homeValue: number;
  awayValue: number;
  suffix: string;
  /** Plain-language note explaining the feature. */
  note: string;
}

export interface Attribution {
  factors: Factor[];
  /** Net edge in percentage points (positive = home). */
  net: number;
  /** Side the model leans toward. */
  leaning: "home" | "away" | "even";
  /** Model confidence 0..100. */
  confidence: number;
  /** Counterfactual describing what would flip / shift the prediction. */
  counterfactual: string;
}

interface FeatureSpec {
  label: string;
  weight: number;
  home: number;
  away: number;
  suffix: string;
  /** Normaliser turning the raw (home-away) gap into a -1..1 signal. */
  normalize: (h: number, a: number) => number;
  note: string;
  /** When true, a lower value is better (e.g. fouls), so the sign flips. */
  lowerIsBetter?: boolean;
}

const ratio = (h: number, a: number) => (h - a) / Math.max(1, h + a);
const pct = (h: number, a: number) => (h - a) / 100;

/**
 * SHAP-style additive attribution. Each feature contributes a signed number of
 * percentage points toward the home (+) or away (-) side; the contributions sum
 * to the net edge. Weights are fixed and inspectable — nothing is hidden.
 */
export function computeAttribution(match: Match): Attribution {
  const s = match.stats;
  const specs: FeatureSpec[] = [
    { label: "Expected Goals (xG)", weight: 30, home: s.xg[0], away: s.xg[1], suffix: "", normalize: ratio, note: "The quality of chances created — the single best predictor of performance." },
    { label: "Goals Scored", weight: 24, home: match.score.home, away: match.score.away, suffix: "", normalize: ratio, note: "Actual finishing output on the day." },
    { label: "Shots on Target", weight: 18, home: s.shotsOnTarget[0], away: s.shotsOnTarget[1], suffix: "", normalize: ratio, note: "How often each side genuinely tested the keeper." },
    { label: "Possession", weight: 10, home: s.possession[0], away: s.possession[1], suffix: "%", normalize: pct, note: "Control of the ball and territory." },
    { label: "Pass Accuracy", weight: 9, home: s.passAccuracy[0], away: s.passAccuracy[1], suffix: "%", normalize: pct, note: "Cohesion and ball retention under pressure." },
    { label: "Discipline", weight: 9, home: s.fouls[0], away: s.fouls[1], suffix: " fouls", normalize: (h, a) => ratio(a, h), note: "Fewer fouls and cards reduce risk — lower is better.", lowerIsBetter: true }
  ];

  const factors: Factor[] = specs.map((f) => ({
    label: f.label,
    contribution: Math.round(f.weight * f.normalize(f.home, f.away) * 10) / 10,
    homeValue: f.home,
    awayValue: f.away,
    suffix: f.suffix,
    note: f.note
  }));

  const net = Math.round(factors.reduce((sum, f) => sum + f.contribution, 0) * 10) / 10;
  const leaning: Attribution["leaning"] = Math.abs(net) < 3 ? "even" : net > 0 ? "home" : "away";

  // Confidence: larger margin + factors agreeing on direction => higher confidence.
  const agree = factors.filter((f) => Math.sign(f.contribution) === Math.sign(net) && f.contribution !== 0).length;
  const agreement = factors.length ? agree / factors.length : 0;
  const confidence = Math.round(Math.min(94, Math.max(52, 52 + Math.abs(net) * 1.6 + agreement * 18)));

  // Counterfactual built around the most decisive factor.
  const top = [...factors].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))[0];
  const favoured = top.contribution >= 0 ? match.homeTeam.name : match.awayTeam.name;
  const trailing = top.contribution >= 0 ? match.awayTeam.name : match.homeTeam.name;
  const counterfactual =
    leaning === "even"
      ? `The model sees this as a coin-flip. If ${trailing} had edged ${top.label.toLowerCase()}, the prediction would tip decisively their way.`
      : `${top.label} is the swing factor (${top.contribution > 0 ? "+" : ""}${top.contribution} pts to ${favoured}). Had ${trailing} matched ${favoured} there, the ${Math.abs(net).toFixed(1)}-point edge would all but vanish.`;

  return { factors, net, leaning, confidence, counterfactual };
}
