import { useEffect, useState } from "react";
import { RefreshCw, Goal, Star, BarChart3 } from "lucide-react";
import type { AIResult, Match } from "../types";
import { MatchShell } from "../components/match/MatchShell";
import { AIResponse } from "../components/ai/AIResponse";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { NoGoalsState } from "../components/ui/States";
import { api } from "../lib/api";
import { computeResponseConfidence } from "../lib/predictions";

function StatRow({ home, away, suffix = "" }: { label: string; home: number; away: number; suffix?: string }) {
  const total = home + away || 1;
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="w-12 text-right tabular-nums font-semibold text-slate-200">{home}{suffix}</span>
      <div className="flex-1">
        <div className="flex h-1.5 overflow-hidden rounded-full bg-white/5">
          <div className="h-full rounded-l-full" style={{ width: `${(home / total) * 100}%`, backgroundColor: "var(--home-color, #34d399)" }} />
          <div className="h-full rounded-r-full" style={{ width: `${(away / total) * 100}%`, backgroundColor: "var(--away-color, #60a5fa)" }} />
        </div>
      </div>
      <span className="w-12 text-left tabular-nums font-semibold text-slate-200">{away}{suffix}</span>
    </div>
  );
}

function SummaryInner({ match }: { match: Match }) {
  const [result, setResult] = useState<AIResult>();
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.summary(match.id).then((r) => {
      setResult(r);
      setLoading(false);
    });
  };

  useEffect(load, [match.id]);

  const scorers = match.events.filter((e) => e.type === "goal" || e.type === "penalty-goal");
  const topRated = [...match.homeTeam.lineup, ...match.awayTeam.lineup]
    .filter((p) => p.rating)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 5);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="space-y-4 lg:col-span-3">
        <div className="flex justify-end">
          <Button size="sm" variant="secondary" onClick={load} disabled={loading}>
            <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} /> Regenerate
          </Button>
        </div>
        <AIResponse loading={loading} text={result?.text} provider={result?.provider} title="AI Match Report" confidence={result ? computeResponseConfidence(result.provider, match, "summary") : undefined} />
      </div>

      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-pitch-400" /> Key Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5" style={{ "--home-color": match.homeTeam.color, "--away-color": match.awayTeam.color } as React.CSSProperties}>
            <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wide text-slate-500">
              <span>{match.homeTeam.shortName}</span>
              <span className="text-slate-600">vs</span>
              <span>{match.awayTeam.shortName}</span>
            </div>
            <StatRow label="Possession" home={match.stats.possession[0]} away={match.stats.possession[1]} suffix="%" />
            <StatRow label="Shots" home={match.stats.shots[0]} away={match.stats.shots[1]} />
            <StatRow label="xG" home={Math.round(match.stats.xg[0] * 10) / 10} away={Math.round(match.stats.xg[1] * 10) / 10} />
            <StatRow label="Pass %" home={match.stats.passAccuracy[0]} away={match.stats.passAccuracy[1]} suffix="%" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Goal className="h-5 w-5 text-pitch-400" /> Goalscorers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {scorers.map((g) => {
              const team = g.side === "home" ? match.homeTeam : match.awayTeam;
              return (
                <div key={g.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
                  <span className="font-semibold">{g.player}</span>
                  <span className="flex items-center gap-2">
                    <span className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: team.color }}>
                      {team.shortName}
                    </span>
                    <span className="tabular-nums text-slate-400">{g.minute}'</span>
                  </span>
                </div>
              );
            })}
            {scorers.length === 0 && <NoGoalsState />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-pitch-400" /> Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topRated.map((p) => {
              const team = match.homeTeam.lineup.includes(p) ? match.homeTeam : match.awayTeam;
              return (
                <div key={p.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: team.color }} aria-hidden />
                    <span className="font-semibold">{p.name}</span>
                  </span>
                  <span className="rounded-md bg-gradient-to-r from-pitch-500 to-electric-500 px-2 py-0.5 text-xs font-bold text-white tabular-nums">
                    {p.rating?.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function MatchSummary() {
  return <MatchShell>{(match) => <SummaryInner match={match} />}</MatchShell>;
}
