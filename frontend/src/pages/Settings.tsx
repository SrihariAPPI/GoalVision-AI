import { Cpu, Sparkles, Github, Info, CheckCircle2, Settings2 } from "lucide-react";
import { useMatches } from "../context/MatchContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import type { ProviderOption } from "../types";

const PROVIDER_OPTIONS: { value: ProviderOption; label: string; desc: string }[] = [
  { value: "auto", label: "Auto (Recommended)", desc: "Intelligently routes each query to the optimal AI model" },
  { value: "gpt-oss", label: "GPT OSS 120B", desc: "NVIDIA NIM — deep reasoning & match explanations" },
  { value: "gemini-flash", label: "Gemini Flash", desc: "Google — quick chat & lightweight tasks" },
  { value: "gemini-pro", label: "Gemini Pro", desc: "Google — tactical analysis & complex reasoning" },
  { value: "nemotron", label: "Nemotron Ultra", desc: "NVIDIA — alternative deep reasoning" },
  { value: "minimax", label: "MiniMax M3", desc: "Lightweight alternative model" },
  { value: "mock", label: "Mock", desc: "Offline demo — no API key required" }
];

const providerBadgeColor = (provider: string, live: boolean): "pitch" | "electric" => {
  if (!live) return "electric";
  if (provider === "gemini-flash" || provider === "mock") return "electric";
  return "pitch";
};

const providerDisplayName = (provider: string): string => {
  const map: Record<string, string> = {
    "gpt-oss": "GPT OSS 120B",
    "gemini-flash": "Gemini Flash",
    "gemini-pro": "Gemini Pro",
    nemotron: "Nemotron Ultra",
    minimax: "MiniMax M3",
    mock: "Mock Provider (offline)"
  };
  return map[provider] ?? provider;
};

export default function Settings() {
  const { aiStatus, aiLive, matches, selectedId, preferredProvider, setPreferredProvider } = useMatches();
  const live = aiLive;
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
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
            <span className="text-sm text-slate-300">Active provider</span>
            <Badge variant={providerBadgeColor(aiStatus?.provider ?? "mock", live)}>
              {providerDisplayName(aiStatus?.provider ?? "mock")}
            </Badge>
          </div>

          {aiStatus && (
            <div className="space-y-2 rounded-lg bg-white/5 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Model</span>
                <span className="font-semibold text-slate-200">{aiStatus.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="font-semibold text-slate-200">{aiStatus.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Latency</span>
                <span className="font-semibold text-slate-200">{aiStatus.latency}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fallback</span>
                <span className="font-semibold text-slate-200">{aiStatus.fallback ? "Yes" : "No"}</span>
              </div>
            </div>
          )}

          <div className="pt-2">
            <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Settings2 className="h-4 w-4" /> Preferred provider
            </label>
            <div className="grid gap-2">
              {PROVIDER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPreferredProvider(opt.value)}
                  className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                    preferredProvider === opt.value
                      ? "border-pitch-500/50 bg-pitch-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/[0.07]"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                      preferredProvider === opt.value
                        ? "border-pitch-400 bg-pitch-400"
                        : "border-slate-500"
                    }`}
                  >
                    {preferredProvider === opt.value && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <div>
                    <span className="block font-medium text-slate-200">{opt.label}</span>
                    <span className="block text-xs text-slate-400">{opt.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-slate-400">
            {live
              ? "Connected to the multi-model AI engine. Queries are routed to the optimal model based on task type."
              : "No API credentials detected. Running in offline demo mode — add API keys on the backend to enable live AI providers."}
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
            <Github className="h-4 w-4" /> React 19 · Express · Multi-Model AI
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
