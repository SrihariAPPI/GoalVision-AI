import { Cpu } from "lucide-react";
import { motion } from "framer-motion";
import { useMatches } from "../context/MatchContext";
import { cn } from "../lib/utils";

export function AIProviderBadge({ className }: { className?: string }) {
  const { aiProvider, aiLive } = useMatches();
  const live = aiLive && aiProvider === "granite";

  if (live) {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-pitch-500/40 bg-gradient-to-r from-pitch-500/10 to-electric-500/10 px-3 py-1 text-xs font-semibold text-pitch-400",
          className
        )}
        title="Connected to IBM watsonx.ai · Granite model active"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pitch-400 opacity-40" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-pitch-400" />
        </span>
        Powered by IBM Granite
      </motion.span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-electric-500/30 bg-electric-500/8 px-3 py-1 text-xs font-semibold text-electric-400",
        className
      )}
      title="No watsonx credentials — running in offline demo mode"
    >
      <Cpu className="h-3 w-3" />
      Demo Mode
    </span>
  );
}
