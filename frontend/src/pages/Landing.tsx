import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  MessageSquare,
  ClipboardList,
  FileText,
  Activity,
  ShieldCheck,
  Zap
} from "lucide-react";
import { Button } from "../components/ui/Button";

const features = [
  { icon: Sparkles, title: "Explainable AI", desc: "Click any goal, card or offside and get a plain-language reason — no black boxes." },
  { icon: MessageSquare, title: "Football Chat", desc: "Ask why a goal happened or who changed the game. Answers grounded in real match data." },
  { icon: ClipboardList, title: "Tactical Board", desc: "Formations, passing lanes, heat maps and momentum, beautifully visualised." },
  { icon: Activity, title: "Win Probability", desc: "See how momentum swung minute-by-minute through the biggest matches." },
  { icon: FileText, title: "AI Match Summary", desc: "A polished, broadcast-quality recap generated in seconds." },
  { icon: ShieldCheck, title: "Powered by IBM Granite", desc: "Built on watsonx.ai, with a graceful offline mode so the demo never breaks." }
];

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pitch-500 to-electric-600 shadow-glow">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="2.5" fill="currentColor" />
            </svg>
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            Goal<span className="gradient-text">Vision</span>
          </span>
        </div>
        <Link to="/dashboard">
          <Button size="sm">
            Launch App <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </header>

      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-16 pb-24 text-center sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold text-slate-300"
        >
          <Sparkles className="h-3.5 w-3.5 text-pitch-400" />
          IBM SkillsBuild AI Challenge · Powered by Granite
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="text-balance text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl"
        >
          Understand Football <span className="gradient-text">Like Never Before</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-balance text-lg text-slate-400"
        >
          GoalVision AI turns raw match data into understanding. Predictions, tactics and key
          moments — explained in plain language by IBM Granite, so anyone can follow the game.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link to="/dashboard">
            <Button size="lg">
              Explore Matches <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/chat">
            <Button size="lg" variant="secondary">
              <MessageSquare className="h-5 w-5" /> Ask the AI
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mx-auto mt-14 max-w-xl gradient-border rounded-2xl glass-strong p-5 text-left"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Zap className="h-3.5 w-3.5 text-pitch-400" /> Try asking
          </div>
          <p className="mt-2 text-lg font-semibold">“Why was Mbappé’s goal offside, and who changed the game?”</p>
          <p className="mt-2 text-sm text-slate-400">
            GoalVision answers instantly, citing the real events from the match.
          </p>
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group rounded-2xl glass p-6 transition-colors hover:bg-white/[0.06]"
            >
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-pitch-500/20 to-electric-600/20 ring-1 ring-white/10">
                <f.icon className="h-5 w-5 text-pitch-400" />
              </span>
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-xs text-slate-500">
        GoalVision AI · Built for the IBM SkillsBuild AI Challenge · Granite on watsonx.ai
      </footer>
    </div>
  );
}
