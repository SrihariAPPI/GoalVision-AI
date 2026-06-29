import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, User, Eraser, ShieldCheck } from "lucide-react";
import type { ChatTurn, Match } from "../types";
import { MatchShell } from "../components/match/MatchShell";
import { Button } from "../components/ui/Button";
import { TypingDots } from "../components/ui/Spinner";
import { api } from "../lib/api";
import { cn } from "../lib/utils";
import { computeResponseConfidence } from "../lib/predictions";

const SUGGESTIONS = [
  "Why was this offside?",
  "Explain the decisive goal.",
  "Who changed the game?",
  "Compare both teams.",
  "Explain the formation."
];

function formatMessage(content: string): string {
  return content
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic text-slate-200">$1</em>')
    .replace(/`(.+?)`/g, '<code class="rounded bg-white/10 px-1 py-0.5 text-[11px] font-mono text-pitch-300">$1</code>');
}

function ChatInner({ match }: { match: Match }) {
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastConfidence, setLastConfidence] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const send = async (message: string) => {
    const text = message.trim();
    if (!text || loading) return;
    const next: ChatTurn[] = [...history, { role: "user", content: text }];
    setHistory(next);
    setInput("");
    setLoading(true);
    const res = await api.chat(match.id, text, history);
    const conf = computeResponseConfidence(res.provider, match, "explain");
    setHistory([...next, { role: "assistant", content: res.text }]);
    setLastConfidence(conf.score);
    setLoading(false);
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };

  const clearChat = () => {
    setHistory([]);
    inputRef.current?.focus();
  };

  return (
    <div className="flex h-[60vh] min-h-[460px] flex-col rounded-2xl glass" role="region" aria-label="AI Chat">
      {history.length > 0 && (
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <span className="text-xs text-slate-500">{history.length} messages</span>
          <button
            onClick={clearChat}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
            aria-label="Clear conversation"
          >
            <Eraser className="h-3 w-3" /> Clear
          </button>
        </div>
      )}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5" role="log" aria-label="Conversation" aria-live="polite">
        {history.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pitch-500 to-electric-600 shadow-glow">
              <Sparkles className="h-6 w-6 text-white" />
            </span>
            <h3 className="text-lg font-bold">Ask GoalVision about this match</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-400">
              Grounded in {match.homeTeam.name} {match.score.home}–{match.score.away} {match.awayTeam.name}. Pick a question or type your own.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2" role="group" aria-label="Suggested questions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => void send(s)}
                  className="rounded-full glass px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {history.map((turn, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex gap-3", turn.role === "user" ? "flex-row-reverse" : "")}
          >
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                turn.role === "user" ? "bg-white/10" : "bg-gradient-to-br from-pitch-500 to-electric-600"
              )}
              aria-hidden
            >
              {turn.role === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4 text-white" />}
            </span>
            <div className="max-w-[80%]">
              <div
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  turn.role === "user" ? "bg-electric-500/20 text-white" : "glass-strong text-slate-200"
                )}
                role="article"
                aria-label={turn.role === "user" ? "Your message" : "GoalVision response"}
              >
                {turn.role === "assistant" ? (
                  <span dangerouslySetInnerHTML={{ __html: formatMessage(turn.content) }} />
                ) : (
                  turn.content
                )}
              </div>
              {turn.role === "assistant" && i === history.length - 1 && lastConfidence > 0 && (
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-slate-400">
                  <ShieldCheck className="h-3 w-3 text-pitch-400" />
                  {lastConfidence}% confidence
                </span>
              )}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex gap-3" role="status" aria-label="GoalVision is thinking">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-pitch-500 to-electric-600" aria-hidden>
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <div className="flex items-center rounded-2xl glass-strong px-4 py-3">
              <TypingDots />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-white/10 p-3">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask about goals, tactics, players…"
          className="flex-1 rounded-xl bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pitch-400/50"
          aria-label="Your question"
          autoComplete="off"
        />
        <Button type="submit" disabled={!input.trim() || loading} aria-label="Send message">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

export default function AIChat() {
  return <MatchShell>{(match) => <ChatInner match={match} />}</MatchShell>;
}
