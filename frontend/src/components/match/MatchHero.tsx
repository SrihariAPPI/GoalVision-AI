import { MapPin, Trophy } from "lucide-react";
import type { Match } from "../../types";
import { formatDate } from "../../lib/utils";
import { Badge } from "../ui/Badge";

export function MatchHero({ match }: { match: Match }) {
  return (
    <div className="relative overflow-hidden rounded-2xl glass-strong p-6 sm:p-8">
      <div
        className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: match.homeTeam.color, opacity: 0.18 }}
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: match.awayTeam.color, opacity: 0.18 }}
      />
      <div className="relative">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <Badge variant="grape">
            <Trophy className="h-3 w-3" /> {match.competition}
          </Badge>
          <Badge>{match.stage}</Badge>
          <Badge variant="electric">
            <MapPin className="h-3 w-3" /> {match.venue}
          </Badge>
          <span className="text-xs text-slate-400">{formatDate(match.date)}</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <TeamBlock name={match.homeTeam.name} short={match.homeTeam.shortName} color={match.homeTeam.color} formation={match.homeTeam.formation} align="left" />
          <div className="text-center">
            <div className="text-4xl font-black tabular-nums sm:text-6xl">
              {match.score.home}
              <span className="mx-2 text-slate-500">:</span>
              {match.score.away}
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-widest text-pitch-400">
              {match.status === "PEN" ? "After Penalties" : match.status === "AET" ? "After Extra Time" : "Full Time"}
            </div>
            <div className="mt-1 text-[11px] text-slate-400">HT {match.score.halfTime[0]}–{match.score.halfTime[1]}</div>
          </div>
          <TeamBlock name={match.awayTeam.name} short={match.awayTeam.shortName} color={match.awayTeam.color} formation={match.awayTeam.formation} align="right" />
        </div>

        <p className="mt-5 text-center text-sm font-medium text-slate-300">{match.result}</p>
      </div>
    </div>
  );
}

function TeamBlock({
  name,
  short,
  color,
  formation,
  align
}: {
  name: string;
  short: string;
  color: string;
  formation: string;
  align: "left" | "right";
}) {
  return (
    <div className={`flex flex-1 flex-col gap-2 ${align === "right" ? "items-end" : "items-start"}`}>
      <div className={`flex items-center gap-3 ${align === "right" ? "flex-row-reverse" : ""}`}>
        <span
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-black text-white shadow-lg ring-2 ring-white/30 sm:h-14 sm:w-14"
          style={{ backgroundColor: color }}
        >
          {short}
        </span>
        <div className={align === "right" ? "text-right" : ""}>
          <div className="text-base font-bold leading-tight sm:text-xl">{name}</div>
          <div className="text-xs text-slate-400">{formation}</div>
        </div>
      </div>
    </div>
  );
}
