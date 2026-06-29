import { motion } from "framer-motion";
import type { Match, MatchEvent } from "../../types";
import { eventLabel } from "../../lib/utils";

const SHOWN: MatchEvent["type"][] = ["goal", "penalty-goal", "penalty-miss", "offside", "shot", "var"];

/** Plots key on-pitch moments by their coordinates, coloured per team. */
export function ShotMap({ match }: { match: Match }) {
  const points = match.events.filter((e) => SHOWN.includes(e.type));

  return (
    <div>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-emerald-950/60 to-emerald-900/30">
        <svg className="absolute inset-0 h-full w-full text-white/15" fill="none" stroke="currentColor" strokeWidth="0.4" viewBox="0 0 100 56" preserveAspectRatio="none">
          <rect x="1" y="1" width="98" height="54" rx="1.5" />
          <line x1="50" y1="1" x2="50" y2="55" />
          <circle cx="50" cy="28" r="7" />
          <rect x="1" y="15" width="13" height="26" />
          <rect x="86" y="15" width="13" height="26" />
        </svg>

        {points.map((e, i) => {
          const team = e.side === "home" ? match.homeTeam : match.awayTeam;
          const isGoal = e.type === "goal" || e.type === "penalty-goal";
          const left = e.side === "home" ? e.x : 100 - e.x;
          return (
            <motion.div
              key={e.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 18 }}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${left}%`, top: `${(e.y / 100) * 100}%` }}
            >
              <span
                className="block rounded-full ring-2 ring-white/50"
                style={{
                  width: isGoal ? 16 : 11,
                  height: isGoal ? 16 : 11,
                  backgroundColor: isGoal ? team.color : "transparent",
                  borderColor: team.color,
                  boxShadow: isGoal ? `0 0 14px ${team.color}` : "none"
                }}
              />
              <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                {e.minute}' {e.player} · {eventLabel(e.type)}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
        <Legend color={match.homeTeam.color} label={`${match.homeTeam.shortName} attack →`} />
        <Legend color={match.awayTeam.color} label={`← ${match.awayTeam.shortName} attack`} />
        <span className="flex items-center gap-1.5">
          <i className="h-3 w-3 rounded-full bg-white/70" /> Filled = goal
        </span>
        <span className="flex items-center gap-1.5">
          <i className="h-3 w-3 rounded-full border-2 border-white/70" /> Outline = chance
        </span>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <i className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
