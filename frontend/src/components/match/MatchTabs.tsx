import { NavLink } from "react-router-dom";
import { Activity, ClipboardList, MessageSquare, FileText } from "lucide-react";
import { cn } from "../../lib/utils";

const tabs = [
  { to: "analysis", label: "Analysis", icon: Activity },
  { to: "tactical", label: "Tactical", icon: ClipboardList },
  { to: "chat", label: "AI Chat", icon: MessageSquare },
  { to: "summary", label: "Summary", icon: FileText }
];

export function MatchTabs({ matchId }: { matchId: string }) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl glass p-1">
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={`/${to}/${matchId}`}
          className={({ isActive }) =>
            cn(
              "flex flex-1 min-w-max items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
              isActive
                ? "bg-gradient-to-r from-pitch-500/90 to-electric-500/90 text-white shadow-glow"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </div>
  );
}
