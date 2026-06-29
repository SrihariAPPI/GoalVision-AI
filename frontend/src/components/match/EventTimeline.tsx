import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { Match, MatchEvent } from "../../types";
import { eventIcon, eventLabel, EXPLAINABLE_EVENTS, cn } from "../../lib/utils";

interface Props {
  match: Match;
  onExplain: (event: MatchEvent) => void;
  activeEventId?: string;
}

export function EventTimeline({ match, onExplain, activeEventId }: Props) {
  return (
    <ol className="relative space-y-3">
      <div className="absolute left-[44px] top-2 bottom-2 w-px bg-white/10" aria-hidden />
      {match.events.map((event, i) => {
        const explainable = EXPLAINABLE_EVENTS.has(event.type);
        const team = event.side === "home" ? match.homeTeam : match.awayTeam;
        const active = activeEventId === event.id;
        return (
          <motion.li
            key={event.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className={cn(
              "relative flex items-start gap-3 rounded-xl p-3 transition-colors",
              explainable ? "cursor-pointer hover:bg-white/5" : "",
              active ? "bg-white/10 ring-1 ring-pitch-500/40" : "glass"
            )}
            onClick={() => explainable && onExplain(event)}
          >
            <span className="flex h-9 w-12 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-bold tabular-nums text-slate-300">
              {event.minute}'
            </span>
            <span className="mt-0.5 text-lg leading-none" aria-hidden>
              {eventIcon(event.type)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{event.player}</span>
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                  style={{ backgroundColor: team.color }}
                >
                  {team.shortName}
                </span>
                <span className="text-[11px] uppercase tracking-wide text-slate-500">{eventLabel(event.type)}</span>
              </div>
              <p className="mt-0.5 text-sm text-slate-400">{event.detail}</p>
            </div>
            {explainable && (
              <span
                className={cn(
                  "mt-1 inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold transition-colors",
                  active ? "bg-pitch-500/20 text-pitch-300" : "text-electric-400"
                )}
              >
                <Sparkles className="h-3 w-3" /> Explain
              </span>
            )}
          </motion.li>
        );
      })}
    </ol>
  );
}
