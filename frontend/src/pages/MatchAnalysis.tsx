import { useState } from "react";
import { Sparkles, ListTree, BarChart3, Gauge, Brain, Crosshair } from "lucide-react";
import type { MatchEvent } from "../types";
import { MatchShell } from "../components/match/MatchShell";
import { EventTimeline } from "../components/match/EventTimeline";
import { ExplainDrawer } from "../components/match/ExplainDrawer";
import { StatComparison } from "../components/charts/StatComparison";
import { WinProbability } from "../components/charts/WinProbability";
import { ExplainabilityPanel } from "../components/explain/ExplainabilityPanel";
import { ShotMap } from "../components/charts/ShotMap";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

export default function MatchAnalysis() {
  const [selected, setSelected] = useState<MatchEvent | null>(null);

  return (
    <MatchShell>
      {(match) => (
        <>
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ListTree className="h-5 w-5 text-pitch-400" /> Match Timeline
                  </CardTitle>
                  <span className="flex items-center gap-1.5 text-xs text-electric-400">
                    <Sparkles className="h-3.5 w-3.5" /> Click an event to explain it
                  </span>
                </CardHeader>
                <CardContent>
                  <EventTimeline match={match} onExplain={setSelected} activeEventId={selected?.id} />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-pitch-400" /> Performance Win Probability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <WinProbability match={match} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-pitch-400" /> Match Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StatComparison
                    homeColor={match.homeTeam.color}
                    awayColor={match.awayTeam.color}
                    rows={[
                      { label: "Possession", home: match.stats.possession[0], away: match.stats.possession[1], suffix: "%" },
                      { label: "Shots", home: match.stats.shots[0], away: match.stats.shots[1] },
                      { label: "On Target", home: match.stats.shotsOnTarget[0], away: match.stats.shotsOnTarget[1] },
                      { label: "Expected Goals", home: match.stats.xg[0], away: match.stats.xg[1] },
                      { label: "Pass Accuracy", home: match.stats.passAccuracy[0], away: match.stats.passAccuracy[1], suffix: "%" },
                      { label: "Corners", home: match.stats.corners[0], away: match.stats.corners[1] },
                      { label: "Fouls", home: match.stats.fouls[0], away: match.stats.fouls[1] }
                    ]}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-pitch-400" /> Explainable AI · Why this prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ExplainabilityPanel match={match} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crosshair className="h-5 w-5 text-pitch-400" /> Shot Map & Key Moments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ShotMap match={match} />
            </CardContent>
          </Card>

          <ExplainDrawer match={match} event={selected} onClose={() => setSelected(null)} />
        </>
      )}
    </MatchShell>
  );
}
