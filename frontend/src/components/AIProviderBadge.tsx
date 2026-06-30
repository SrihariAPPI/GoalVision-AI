import { motion } from "framer-motion";
import { useMatches } from "../context/MatchContext";
import { cn } from "../lib/utils";

const providerLabels: Record<string, { label: string; color: string }> = {
  "gpt-oss": { label: "GPT OSS", color: "border-pitch-500/40 bg-pitch-500/10 text-pitch-400" },
  "ibm-granite": { label: "IBM Granite", color: "border-blue-500/30 bg-blue-500/10 text-blue-400" },
  "gemini-pro": { label: "Gemini Pro", color: "border-pitch-500/40 bg-pitch-500/10 text-pitch-400" },
  "gemini-flash": { label: "Gemini Flash", color: "border-electric-500/30 bg-electric-500/10 text-electric-400" },
  nemotron: { label: "Nemotron", color: "border-pitch-500/40 bg-pitch-500/10 text-pitch-400" },
  minimax: { label: "MiniMax", color: "border-pitch-500/40 bg-pitch-500/10 text-pitch-400" },
  mock: { label: "Demo", color: "border-electric-500/30 bg-electric-500/8 text-electric-400" }
};

export function AIProviderBadge({ className }: { className?: string }) {
  const { aiStatus, aiLive } = useMatches();
  const info = providerLabels[aiStatus?.provider ?? "mock"] ?? providerLabels.mock;
  const live = aiLive;

  if (live) {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
          info.color,
          className
        )}
        title={`${info.label} · ${aiStatus?.model ?? ""}`}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pitch-400 opacity-40" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-pitch-400" />
        </span>
        {info.label}
      </motion.span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        info.color,
        className
      )}
      title="Offline demo mode"
    >
      <span className="h-2 w-2 rounded-full bg-electric-400" />
      {info.label}
    </span>
  );
}
