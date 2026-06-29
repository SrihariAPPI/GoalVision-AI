import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, MapPin, Radio, Trophy } from "lucide-react";
import { useMatches } from "../context/MatchContext";
import { api } from "../lib/api";
import { Badge } from "../components/ui/Badge";
import { DashboardSkeleton } from "../components/ui/States";
import { formatDate } from "../lib/utils";
import type { LiveFixture } from "../types";

export default function Dashboard() {
  const { matches, loading, setSelectedId } = useMatches();
  const navigate = useNavigate();

  const [liveFixtures, setLiveFixtures] = useState<LiveFixture[]>([]);
  const [todayFixtures, setTodayFixtures] = useState<LiveFixture[]>([]);
  const [extraLoading, setExtraLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const today = new Date().toISOString().split("T")[0];
    Promise.all([api.getLiveMatches(), api.getFixtures(today)]).then(([live, fixtures]) => {
      if (!active) return;
      setLiveFixtures(live);
      setTodayFixtures(fixtures.filter((f) => f.status !== "live"));
      setExtraLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const liveMatches = matches.filter((m) => m.status === "live");
  const classicMatches = matches.filter((m) => m.status !== "live");

  const open = (id: string) => {
    setSelectedId(id);
    navigate(`/analysis/${id}`);
  };

  const showSkeleton = loading || extraLoading;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Match Dashboard</h1>
        <p className="mt-2 text-slate-400">
          Live scores, today's fixtures, and legendary matches re-analysed by AI.
        </p>
      </div>

      {showSkeleton ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Live Matches from API */}
          {liveFixtures.length > 0 && (
            <section>
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/20">
                  <Radio className="h-4 w-4 text-red-400" />
                </span>
                <h2 className="text-2xl font-bold text-white">Live Now</h2>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                </span>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {liveFixtures.map((m, i) => (
                  <FixtureCard key={m.id} fixture={m} index={i} open={open} isLive />
                ))}
              </div>
            </section>
          )}

          {/* Live Matches from demo data (fallback) */}
          {liveFixtures.length === 0 && liveMatches.length > 0 && (
            <section>
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/20">
                  <Radio className="h-4 w-4 text-red-400" />
                </span>
                <h2 className="text-2xl font-bold text-white">Live Matches</h2>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                </span>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {liveMatches.map((m, i) => (
                  <MatchCard key={m.id} match={m} index={i} open={open} isLive />
                ))}
              </div>
            </section>
          )}

          {/* Today's Fixtures */}
          {todayFixtures.length > 0 && (
            <section>
              <div className="mb-5 flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-400" />
                <h2 className="text-2xl font-bold text-white">Today's Fixtures</h2>
                <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
                  Upcoming
                </span>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {todayFixtures.map((m, i) => (
                  <FixtureCard key={m.id} fixture={m} index={i} open={open} />
                ))}
              </div>
            </section>
          )}

          {/* Classic Matches */}
          <section>
            <div className="mb-5 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">Classic Matches</h2>
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                Historic
              </span>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {classicMatches.map((m, i) => (
                <MatchCard key={m.id} match={m} index={i} open={open} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function formatKickoff(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function FixtureCard({
  fixture: m,
  index,
  open,
  isLive
}: {
  fixture: LiveFixture;
  index: number;
  open: (id: string) => void;
  isLive?: boolean;
}) {
  const liveLabel = isLive && m.elapsed ? `${m.elapsed}'` : isLive ? "LIVE" : formatKickoff(m.date);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
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
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-red-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              {liveLabel}
            </span>
          ) : (
            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
              {liveLabel}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-1 flex-col items-start gap-1.5">
            {m.homeTeam.logo ? (
              <img src={m.homeTeam.logo} alt={m.homeTeam.name} className="h-8 w-8 object-contain" />
            ) : (
              <span
                className="flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black text-white ring-2 ring-white/25"
                style={{ backgroundColor: m.homeTeam.color }}
              >
                {m.homeTeam.shortName}
              </span>
            )}
            <span className="text-xs font-semibold text-slate-300">{m.homeTeam.name}</span>
          </div>

          <div className="px-3 text-2xl font-black tabular-nums">
            {m.score.home}<span className="mx-1 text-slate-500">-</span>{m.score.away}
          </div>

          <div className="flex flex-1 flex-col items-end gap-1.5">
            {m.awayTeam.logo ? (
              <img src={m.awayTeam.logo} alt={m.awayTeam.name} className="h-8 w-8 object-contain" />
            ) : (
              <span
                className="flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black text-white ring-2 ring-white/25"
                style={{ backgroundColor: m.awayTeam.color }}
              >
                {m.awayTeam.shortName}
              </span>
            )}
            <span className="text-xs font-semibold text-slate-300">{m.awayTeam.name}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{formatDate(m.date)}</span>
          {m.venue && (
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{m.city || m.venue}</span>
          )}
        </div>

        <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-pitch-400">
          {isLive ? "View live match" : "View match"}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </motion.button>
  );
}

function MatchCard({
  match: m,
  index,
  open,
  isLive
}: {
  match: import("../types").MatchSummaryCard;
  index: number;
  open: (id: string) => void;
  isLive?: boolean;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
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
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-red-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              Live
            </span>
          ) : (
            <Badge>{m.status === "PEN" ? "Penalties" : m.status === "AET" ? "AET" : "FT"}</Badge>
          )}
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
          {isLive ? "View live match" : "Analyse match"}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </motion.button>
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
