import { Cpu, Sparkles, Github, Info, CheckCircle2 } from "lucide-react";
import { useMatches } from "../context/MatchContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

export default function Settings() {
  const { aiProvider, aiLive, matches, selectedId } = useMatches();
  const live = aiLive && aiProvider === "granite";
  const selected = matches.find((m) => m.id === selectedId);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Settings</h1>
        <p className="mt-2 text-slate-400">Configuration and status for your GoalVision AI session.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {live ? <Sparkles className="h-5 w-5 text-pitch-400" /> : <Cpu className="h-5 w-5 text-electric-400" />}
            AI Provider
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
            <span className="text-sm text-slate-300">Active provider</span>
            <Badge variant={live ? "pitch" : "electric"}>
              {live ? "IBM Granite (watsonx.ai)" : "Mock Provider (offline)"}
            </Badge>
          </div>
          <p className="text-sm text-slate-400">
            {live
              ? "Connected to IBM watsonx.ai. Explanations and chat are generated live by the Granite foundation model."
              : "No watsonx credentials detected, so GoalVision is running in offline demo mode. The interface and explanations work fully — add WATSONX_API_KEY and WATSONX_PROJECT_ID on the backend to switch to live Granite."}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-pitch-400" /> Session
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Row label="Selected match" value={selected ? `${selected.homeTeam.name} vs ${selected.awayTeam.name}` : "None"} />
          <Row label="Matches available" value={String(matches.length)} />
          <Row label="Theme" value="Dark · Glassmorphism" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About GoalVision AI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <p>
            GoalVision AI makes football understandable — turning match data into plain-language insight
            with explainable, grounded AI. Built for the IBM SkillsBuild AI Challenge.
          </p>
          <ul className="space-y-2">
            {["Explainable AI on every key event", "Grounded chat — no hallucinated stats", "Apple-inspired, fully responsive UI"].map((f) => (
              <li key={f} className="flex items-center gap-2 text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-pitch-400" /> {f}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 pt-2 text-slate-500">
            <Github className="h-4 w-4" /> React 19 · Express · IBM Granite
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
