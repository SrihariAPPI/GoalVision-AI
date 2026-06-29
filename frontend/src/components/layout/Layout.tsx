import type { ReactNode } from "react";
import { Navbar } from "./Navbar";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        GoalVision AI · Understand Football Like Never Before · Built for the IBM SkillsBuild AI Challenge
      </footer>
    </div>
  );
}
