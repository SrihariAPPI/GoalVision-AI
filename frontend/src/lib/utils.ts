import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

const EVENT_ICON: Record<string, string> = {
  goal: "⚽",
  "penalty-goal": "🥅",
  "penalty-miss": "❌",
  "yellow-card": "🟨",
  "red-card": "🟥",
  offside: "🚩",
  substitution: "🔁",
  var: "📺",
  shot: "🎯",
  kickoff: "🟢",
  halftime: "⏸️",
  fulltime: "🏁"
};

export function eventIcon(type: string): string {
  return EVENT_ICON[type] ?? "•";
}

export function eventLabel(type: string): string {
  return type
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Events a user can ask GoalVision to explain. */
export const EXPLAINABLE_EVENTS = new Set([
  "goal",
  "penalty-goal",
  "penalty-miss",
  "yellow-card",
  "red-card",
  "offside",
  "substitution"
]);
