import { useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, User } from "lucide-react";
import type { ChatTurn, Match } from "../types";
import { MatchShell } from "../components/match/MatchShell";
import { Button } from "../components/ui/Button";
import { TypingDots } from "../components/ui/Spinner";
import { api } from "../lib/api";
import { cn } from "../lib/utils";

const SUGGESTIONS = [
  "Why was this offside?",
  "Explain the decisive goal.",
  "Who changed the game?",
  "Compare both teams.",
  "Explain the formation."
];

function ChatInner({ match }: { match: Match }) {
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = async (message: string) => {
    const text = message.trim();
    if (!text || loading) return;
    const next: ChatTurn[] = [...history, { role: "user", content: text }];
    setHistory(next);
    setInput("");
    setLoading(true);
    const res = await api.chat(match.id, text, history);
    setHistory([...next, { role: "assistant", content: res.text }]);
    setLoading(false);
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  return (
    <div className="flex h-[60vh] min-h-[460px] flex-col rounded-2xl glass">
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
        {history.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pitch-500 to-electric-600 shadow-glow">
              <Sparkles className="h-6 w-6 text-white" />
            </span>
            <h3 className="text-lg font-bold">Ask GoalVision about this match</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-400">
              Grounded in {match.homeTeam.name} {match.score.home}–{match.score.away} {match.awayTeam.name}. Pick a question or type your own.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
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
            >
              {turn.role === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4 text-white" />}
            </span>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                turn.role === "user" ? "bg-electric-500/20 text-white" : "glass-strong text-slate-200"
              )}
            >
              {turn.content}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-pitch-500 to-electric-600">
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
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about goals, tactics, players…"
          className="flex-1 rounded-xl bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pitch-400/50"
          aria-label="Your question"
        />
        <Button type="submit" disabled={!input.trim() || loading} aria-label="Send">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

export default function AIChat() {
  return <MatchShell>{(match) => <ChatInner match={match} />}</MatchShell>;
}
