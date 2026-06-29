import { motion } from "framer-motion";
import { Sparkles, ShieldCheck } from "lucide-react";
import type { AIProviderName } from "../../types";
import { TypingDots } from "../ui/Spinner";

interface Props {
  loading: boolean;
  text?: string;
  provider?: AIProviderName;
  title?: string;
  confidence?: { score: number; reasons: string[] };
}

function formatLine(line: string): string {
  return line
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic text-slate-200">$1</em>')
    .replace(/`(.+?)`/g, '<code class="rounded bg-white/10 px-1 py-0.5 text-[11px] font-mono text-pitch-300">$1</code>');
}

function renderParagraph(para: string, i: number) {
  if (para.startsWith("• ") || para.startsWith("- ")) {
    return (
      <li key={i} className="ml-4 list-disc text-sm leading-relaxed text-slate-200" dangerouslySetInnerHTML={{ __html: formatLine(para.slice(2)) }} />
    );
  }
  if (/^\d+\.\s/.test(para)) {
    return (
      <li key={i} className="ml-4 list-decimal text-sm leading-relaxed text-slate-200" dangerouslySetInnerHTML={{ __html: formatLine(para.replace(/^\d+\.\s/, "")) }} />
    );
  }
  return <p key={i} className="text-sm leading-relaxed text-slate-200" dangerouslySetInnerHTML={{ __html: formatLine(para) }} />;
}

/** Renders an AI-generated answer with provenance, supporting multi-paragraph text. */
export function AIResponse({ loading, text, provider, title = "GoalVision AI", confidence }: Props) {
  return (
    <div className="gradient-border rounded-2xl glass p-5" role="region" aria-label={title}>
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-bold">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-pitch-500 to-electric-600">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </span>
          {title}
        </span>
        <div className="flex items-center gap-2">
          {confidence && !loading && (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold tabular-nums"
              title={confidence.reasons.join(" · ")}
            >
              <ShieldCheck className="h-3 w-3 text-pitch-400" />
              {confidence.score}%
            </span>
          )}
          {provider && !loading && (
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              {provider === "mock" ? "Demo AI" : provider.replace("-", " ").toUpperCase()}
            </span>
          )}
        </div>
      </div>
      {loading ? (
        <div className="flex items-center gap-3 py-2 text-sm text-slate-400" role="status" aria-label="Loading AI response">
          <TypingDots /> Analysing the match data…
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {(text ?? "").split("\n").filter(Boolean).map((para, i) => renderParagraph(para, i))}
        </motion.div>
      )}
    </div>
  );
}
