import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { useMatches } from "../context/MatchContext";
import { Badge } from "../components/ui/Badge";
import { DashboardSkeleton } from "../components/ui/States";
import { formatDate } from "../lib/utils";

export default function Dashboard() {
  const { matches, loading, setSelectedId } = useMatches();
  const navigate = useNavigate();

  const open = (id: string) => {
    setSelectedId(id);
    navigate(`/analysis/${id}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Match Dashboard</h1>
        <p className="mt-2 text-slate-400">
          Legendary fixtures, re-analysed by AI. Pick a match to explore its story, tactics and key moments.
        </p>
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {matches.map((m, i) => (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => open(m.id)}
              className="group relative overflow-hidden rounded-2xl glass p-6 text-left transition-all hover:-translate-y-1 hover:shadow-glow"
            >
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl transition-opacity group-hover:opacity-60"
                style={{ backgroundColor: m.homeTeam.color, opacity: 0.25 }}
              />
              <div className="relative">
                <div className="mb-4 flex items-center gap-2">
                  <Badge variant="grape">{m.competition}</Badge>
                  <Badge>{m.status === "PEN" ? "Penalties" : m.status === "AET" ? "AET" : "FT"}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <Team name={m.homeTeam.name} short={m.homeTeam.shortName} color={m.homeTeam.color} />
                  <div className="px-3 text-2xl font-black tabular-nums">
                    {m.score.home}<span className="mx-1 text-slate-500">-</span>{m.score.away}
                  </div>
                  <Team name={m.awayTeam.name} short={m.awayTeam.shortName} color={m.awayTeam.color} align="right" />
                </div>

                <p className="mt-4 line-clamp-2 text-sm text-slate-300">{m.headline}</p>

                <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{formatDate(m.date)}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{m.city}</span>
                </div>

                <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-pitch-400">
                  Analyse match
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

function Team({
  name,
  short,
  color,
  align = "left"
}: {
  name: string;
  short: string;
  color: string;
  align?: "left" | "right";
}) {
  return (
    <div className={`flex flex-1 flex-col gap-1.5 ${align === "right" ? "items-end" : "items-start"}`}>
      <span
        className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-black text-white ring-2 ring-white/25"
        style={{ backgroundColor: color }}
      >
        {short}
      </span>
      <span className="text-xs font-semibold text-slate-300">{name}</span>
    </div>
  );
}
