import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  const [showIntro, setShowIntro] = useState(() => {
    // Only play once per session so it remains premium and non-intrusive
    return !sessionStorage.getItem("goalvision.introPlayed");
  });

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

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem("goalvision.introPlayed", "true");
  };

  const showSkeleton = loading || extraLoading;

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <FootballIntro key="intro" onComplete={handleIntroComplete} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-10"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FootballIntro({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1500); // Settle, Shockwave-pop and fadeout completes in 1.5s
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05070d] overflow-hidden"
    >
      <div className="relative flex items-center justify-center">
        {/* Neon expanding shockwave pop */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{
            scale: [0.6, 2.8],
            opacity: [0, 0.9, 0],
          }}
          transition={{
            duration: 0.55,
            delay: 0.75,
            ease: "easeOut",
          }}
          className="absolute h-24 w-24 rounded-full border-2 border-pitch-400 bg-pitch-500/10 blur-[2px]"
        />

        {/* Ambient glow pop */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: [0.5, 3.8],
            opacity: [0, 0.45, 0],
          }}
          transition={{
            duration: 0.75,
            delay: 0.75,
            ease: "easeOut",
          }}
          className="absolute h-32 w-32 rounded-full bg-gradient-to-r from-pitch-500 to-emerald-500 blur-xl"
        />

        {/* Beautiful vector football spinning, settling and zoom-popping */}
        <motion.div
          initial={{ scale: 0, rotate: -270, opacity: 0 }}
          animate={{
            scale: [0, 1.25, 1, 28],
            rotate: [-270, 45, 0, 180],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            times: [0, 0.45, 0.65, 1],
            duration: 1.35,
            ease: "easeInOut",
          }}
          className="relative z-10 text-pitch-400 drop-shadow-[0_0_25px_rgba(34,197,94,0.65)]"
        >
          <svg viewBox="0 0 100 100" className="w-24 h-24">
            <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="3" fill="#080c14" />
            <polygon points="50,38 61,46 57,58 43,58 39,46" fill="currentColor" opacity="0.85" />
            
            <line x1="50" y1="38" x2="50" y2="4" stroke="currentColor" strokeWidth="2.5" />
            <line x1="61" y1="46" x2="92" y2="35" stroke="currentColor" strokeWidth="2.5" />
            <line x1="57" y1="58" x2="76" y2="90" stroke="currentColor" strokeWidth="2.5" />
            <line x1="43" y1="58" x2="24" y2="90" stroke="currentColor" strokeWidth="2.5" />
            <line x1="39" y1="46" x2="8" y2="35" stroke="currentColor" strokeWidth="2.5" />

            <polyline points="50,4 34,14 39,26 50,26 61,26 66,14 50,4" fill="none" stroke="currentColor" strokeWidth="2" />
            <polyline points="92,35 81,23 68,30 61,46 75,52 88,48" fill="none" stroke="currentColor" strokeWidth="2" />
            <polyline points="76,90 86,74 74,63 57,58 64,74 62,90" fill="none" stroke="currentColor" strokeWidth="2" />
            <polyline points="24,90 14,74 26,63 43,58 36,74 38,90" fill="none" stroke="currentColor" strokeWidth="2" />
            <polyline points="8,35 19,23 32,30 39,46 25,52 12,48" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ times: [0, 0.45, 1], duration: 1.25, delay: 0.1 }}
        className="mt-6 text-sm font-semibold tracking-widest text-pitch-400 uppercase select-none"
      >
        GoalVision AI
      </motion.div>
    </motion.div>
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
