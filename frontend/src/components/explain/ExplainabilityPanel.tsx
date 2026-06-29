import { motion } from "framer-motion";
import { Brain, ShieldCheck, GitCompareArrows, ChevronDown } from "lucide-react";
import type { Match, Player } from "../../types";
import { computeAttribution, type Factor } from "../../lib/predictions";

function topPerformers(match: Match): Player[] {
  return [...match.homeTeam.lineup, ...match.awayTeam.lineup]
    .filter((p) => p.rating)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 5);
}

/**
 * The explainability centrepiece: a transparent, SHAP-style breakdown of which
 * features drive the performance prediction, with a confidence score, an
 * evidence panel and a counterfactual ("why the prediction would change").
 */
export function ExplainabilityPanel({ match }: { match: Match }) {
  const { factors, net, leaning, confidence, counterfactual } = computeAttribution(match);
  const leaningTeam =
    leaning === "home" ? match.homeTeam : leaning === "away" ? match.awayTeam : null;
  const maxMag = Math.max(...factors.map((f) => Math.abs(f.contribution)), 1);
  const players = topPerformers(match);

  return (
    <div className="space-y-6" role="region" aria-label="Explainable AI prediction breakdown">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-pitch-500/20 to-electric-600/20 ring-1 ring-white/10">
            <Brain className="h-5 w-5 text-pitch-400" />
          </span>
          <div>
            <div className="text-sm text-slate-400">Model leans toward</div>
            <div className="text-lg font-extrabold">
              {leaningTeam ? leaningTeam.name : "An even contest"}
              {leaningTeam && (
                <span className="ml-2 text-sm font-bold text-pitch-400">
                  {net > 0 ? "+" : ""}
                  {net} pts
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ConfidenceRing value={confidence} />
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
          <span>{match.awayTeam.shortName} ◄ favours</span>
          <span>Feature contribution</span>
          <span>favours ► {match.homeTeam.shortName}</span>
        </div>
        <div className="space-y-2.5">
          {factors.map((f, i) => (
            <FactorBar
              key={f.label}
              factor={f}
              maxMag={maxMag}
              homeColor={match.homeTeam.color}
              awayColor={match.awayTeam.color}
              delay={i * 0.06}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-white/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold">
            <ShieldCheck className="h-4 w-4 text-pitch-400" /> Evidence
          </div>
          <ul className="space-y-1.5 text-xs text-slate-400" role="list" aria-label="Feature evidence values">
            {factors.map((f) => (
              <li key={f.label} className="flex items-center justify-between gap-2" title={f.note}>
                <span className="truncate">{f.label}</span>
                <span className="shrink-0 tabular-nums text-slate-300">
                  {f.homeValue}
                  {f.suffix} <span className="text-slate-600">vs</span> {f.awayValue}
                  {f.suffix}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-electric-500/10 to-grape-500/10 p-4 ring-1 ring-white/10">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold">
            <GitCompareArrows className="h-4 w-4 text-electric-400" /> Why the prediction would change
          </div>
          <p className="text-xs leading-relaxed text-slate-300">{counterfactual}</p>
        </div>
      </div>

      <div className="rounded-xl bg-white/5 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold">
          <span className="text-pitch-400" aria-hidden>★</span> Top Performers
        </div>
        <div className="flex flex-wrap gap-2">
          {players.map((p) => {
            const team = match.homeTeam.lineup.includes(p) ? match.homeTeam : match.awayTeam;
            return (
              <span
                key={p.id}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-xs"
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: team.color }}
                  aria-hidden
                />
                <span className="font-semibold text-slate-200">{p.name}</span>
                <span className="rounded bg-gradient-to-r from-pitch-500 to-electric-500 px-1.5 py-0.5 text-[10px] font-bold text-white tabular-nums">
                  {p.rating?.toFixed(1)}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      <details className="group rounded-lg bg-white/5 p-3">
        <summary className="flex cursor-pointer items-center gap-2 text-[11px] font-semibold text-slate-400 hover:text-slate-300">
          <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" aria-hidden />
          How the model works
        </summary>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
          Every contribution above is an additive, fixed-weight score computed from this match's data —
          no hidden model or black box. The bars sum to the net edge, so you can audit exactly why
          GoalVision reached its verdict. Weights are inspectable and published — nothing is hidden.
        </p>
      </details>
    </div>
  );
}

function FactorBar({
  factor,
  maxMag,
  homeColor,
  awayColor,
  delay
}: {
  factor: Factor;
  maxMag: number;
  homeColor: string;
  awayColor: string;
  delay: number;
}) {
  const positive = factor.contribution >= 0;
  const widthPct = (Math.abs(factor.contribution) / maxMag) * 50;
  return (
    <div className="group" title={factor.note} role="group" aria-label={`${factor.label}: ${factor.contribution > 0 ? "+" : ""}${factor.contribution} points`}>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-300">{factor.label}</span>
        <span className="tabular-nums font-bold" style={{ color: positive ? homeColor : awayColor }}>
          {positive ? "+" : ""}
          {factor.contribution} pts
        </span>
      </div>
      <div className="relative h-3 rounded-full bg-white/5" role="img" aria-label={`${factor.label} contribution bar`}>
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/20" aria-hidden />
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${widthPct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay, ease: "easeOut" }}
          className="absolute top-0 h-full rounded-full"
          style={{
            backgroundColor: positive ? homeColor : awayColor,
            left: positive ? "50%" : undefined,
            right: positive ? undefined : "50%"
          }}
        />
      </div>
    </div>
  );
}

function ConfidenceRing({ value }: { value: number }) {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
          <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
          <motion.circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            stroke="url(#confGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="confGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#34d399" />
              <stop offset="1" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-black tabular-nums">
          {value}%
        </span>
      </div>
      <div className="text-xs">
        <div className="font-bold text-slate-200">Confidence</div>
        <div className="text-slate-500">model certainty</div>
      </div>
    </div>
  );
}
