import { useEffect, useState } from "react";
import { Flame, GitFork, TrendingUp } from "lucide-react";
import type { AIResult, Match } from "../types";
import { MatchShell } from "../components/match/MatchShell";
import { Pitch } from "../components/football/Pitch";
import { MomentumChart } from "../components/charts/MomentumChart";
import { AIResponse } from "../components/ai/AIResponse";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { api } from "../lib/api";

function TacticalInner({ match }: { match: Match }) {
  const [showLanes, setShowLanes] = useState(true);
  const [showHeat, setShowHeat] = useState(true);
  const [home, setHome] = useState<AIResult>();
  const [away, setAway] = useState<AIResult>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([api.tactical(match.id, "home"), api.tactical(match.id, "away")]).then(([h, a]) => {
      if (!active) return;
      setHome(h);
      setAway(a);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [match.id]);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Tactical Board</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant={showLanes ? "primary" : "outline"} onClick={() => setShowLanes((v) => !v)}>
              <GitFork className="h-4 w-4" /> Passing Lanes
            </Button>
            <Button size="sm" variant={showHeat ? "primary" : "outline"} onClick={() => setShowHeat((v) => !v)}>
              <Flame className="h-4 w-4" /> Heat Map
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Pitch
            home={match.homeTeam}
            away={match.awayTeam}
            showPassingLanes={showLanes}
            heat={showHeat ? match.heatmap : undefined}
          />
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <span className="flex items-center gap-2">
              <i className="h-3 w-3 rounded-full" style={{ backgroundColor: match.homeTeam.color }} />
              {match.homeTeam.name} · {match.homeTeam.formation}
            </span>
            <span className="flex items-center gap-2">
              <i className="h-3 w-3 rounded-full" style={{ backgroundColor: match.awayTeam.color }} />
              {match.awayTeam.name} · {match.awayTeam.formation}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-pitch-400" /> Momentum & Pressure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MomentumChart data={match.momentum} homeName={match.homeTeam.shortName} awayName={match.awayTeam.shortName} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <AIResponse loading={loading} text={home?.text} provider={home?.provider} title={`${match.homeTeam.name} — Tactical Read`} />
        <AIResponse loading={loading} text={away?.text} provider={away?.provider} title={`${match.awayTeam.name} — Tactical Read`} />
      </div>
    </>
  );
}

export default function TacticalBoard() {
  return (
    <MatchShell>
      {(match) => (
        <div className="space-y-6">
          <TacticalInner match={match} />
        </div>
      )}
    </MatchShell>
  );
}
