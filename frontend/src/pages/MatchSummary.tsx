import { useEffect, useState } from "react";
import { RefreshCw, Goal, Star } from "lucide-react";
import type { AIResult, Match } from "../types";
import { MatchShell } from "../components/match/MatchShell";
import { AIResponse } from "../components/ai/AIResponse";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { api } from "../lib/api";

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
    .slice(0, 3);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="space-y-4 lg:col-span-3">
        <div className="flex justify-end">
          <Button size="sm" variant="secondary" onClick={load} disabled={loading}>
            <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} /> Regenerate
          </Button>
        </div>
        <AIResponse loading={loading} text={result?.text} provider={result?.provider} title="AI Match Report" />
      </div>

      <div className="space-y-6 lg:col-span-2">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-pitch-400" /> Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topRated.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
                <span className="font-semibold">{p.name}</span>
                <span className="rounded-md bg-gradient-to-r from-pitch-500 to-electric-500 px-2 py-0.5 text-xs font-bold text-white tabular-nums">
                  {p.rating?.toFixed(1)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function MatchSummary() {
  return <MatchShell>{(match) => <SummaryInner match={match} />}</MatchShell>;
}
