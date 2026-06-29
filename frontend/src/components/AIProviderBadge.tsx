import { Sparkles, Cpu } from "lucide-react";
import { useMatches } from "../context/MatchContext";
import { cn } from "../lib/utils";

export function AIProviderBadge({ className }: { className?: string }) {
  const { aiProvider, aiLive } = useMatches();
  const live = aiLive && aiProvider === "granite";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        live
          ? "border-pitch-500/40 bg-pitch-500/10 text-pitch-400"
          : "border-electric-500/40 bg-electric-500/10 text-electric-400",
        className
      )}
      title={live ? "Powered by IBM Granite (watsonx.ai)" : "Offline demo mode — Mock AI provider"}
    >
      {live ? <Sparkles className="h-3.5 w-3.5" /> : <Cpu className="h-3.5 w-3.5" />}
      {live ? "IBM Granite" : "Demo AI"}
    </span>
  );
}
