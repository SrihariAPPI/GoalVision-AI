import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { AIProviderName } from "../../types";
import { TypingDots } from "../ui/Spinner";

interface Props {
  loading: boolean;
  text?: string;
  provider?: AIProviderName;
  title?: string;
}

/** Renders an AI-generated answer with provenance, supporting multi-paragraph text. */
export function AIResponse({ loading, text, provider, title = "GoalVision AI" }: Props) {
  return (
    <div className="gradient-border rounded-2xl glass p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-bold">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-pitch-500 to-electric-600">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </span>
          {title}
        </span>
        {provider && !loading && (
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {provider === "granite" ? "IBM Granite" : "Demo AI"}
          </span>
        )}
      </div>
      {loading ? (
        <div className="flex items-center gap-3 py-2 text-sm text-slate-400">
          <TypingDots /> Analysing the match data…
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3 text-sm leading-relaxed text-slate-200"
        >
          {(text ?? "").split("\n").filter(Boolean).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </motion.div>
      )}
    </div>
  );
}
