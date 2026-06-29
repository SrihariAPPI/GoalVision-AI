import { motion } from "framer-motion";
import type { Match } from "../../types";
import { computeWinProbability } from "../../lib/predictions";

export { computeWinProbability };

export function WinProbability({ match }: { match: Match }) {
  const p = computeWinProbability(match);
  const segments = [
    { label: match.homeTeam.shortName, value: p.home, color: match.homeTeam.color },
    { label: "Draw", value: p.draw, color: "#64748b" },
    { label: match.awayTeam.shortName, value: p.away, color: match.awayTeam.color }
  ];
  return (
    <div>
      <div className="flex h-4 overflow-hidden rounded-full">
        {segments.map((s) => (
          <motion.div
            key={s.label}
            initial={{ width: 0 }}
            animate={{ width: `${s.value}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ backgroundColor: s.color }}
            className="h-full"
          />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        {segments.map((s) => (
          <div key={s.label}>
            <div className="text-2xl font-black tabular-nums">{s.value}%</div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <i className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-lg bg-white/5 p-3 text-xs text-slate-400">
        <span className="font-semibold text-slate-300">How this is calculated:</span> probabilities are
        derived from expected goals (xG {match.stats.xg[0]} – {match.stats.xg[1]}). A closer xG raises the
        chance of a draw — fully transparent, no hidden model.
      </p>
    </div>
  );
}
