import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, Activity, ClipboardList, MessageSquare, FileText, Settings, Menu, X } from "lucide-react";
import { useMatches } from "../../context/MatchContext";
import { AIProviderBadge } from "../AIProviderBadge";
import { cn } from "../../lib/utils";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, scoped: false },
  { to: "/analysis", label: "Analysis", icon: Activity, scoped: true },
  { to: "/tactical", label: "Tactical", icon: ClipboardList, scoped: true },
  { to: "/chat", label: "AI Chat", icon: MessageSquare, scoped: true },
  { to: "/summary", label: "Summary", icon: FileText, scoped: true },
  { to: "/settings", label: "Settings", icon: Settings, scoped: false }
];

export function Navbar() {
  const { selectedId } = useMatches();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const hrefFor = (to: string, scoped: boolean) =>
    scoped && selectedId ? `${to}/${selectedId}` : to;

  const isActive = (to: string) => location.pathname.startsWith(to);

  return (
    <header className="sticky top-0 z-50">
      <div className="glass-strong border-b border-white/10">
        <nav className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <Logo />
            <span className="text-lg font-extrabold tracking-tight">
              Goal<span className="gradient-text">Vision</span>
            </span>
          </Link>

          <div className="mx-auto hidden items-center gap-1 lg:flex">
            {links.map(({ to, label, icon: Icon, scoped }) => (
              <NavLink
                key={to}
                to={hrefFor(to, scoped)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive(to) ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </div>

          <div className="ml-auto hidden lg:block">
            <AIProviderBadge />
          </div>

          <button
            className="ml-auto rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-strong overflow-hidden border-b border-white/10 lg:hidden"
          >
            <div className="space-y-1 px-4 py-3">
              {links.map(({ to, label, icon: Icon, scoped }) => (
                <NavLink
                  key={to}
                  to={hrefFor(to, scoped)}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                    isActive(to) ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
              <div className="pt-2">
                <AIProviderBadge />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Logo() {
  return (
    <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pitch-500 to-electric-600 shadow-glow">
      <span className="absolute inset-0 rounded-xl ring-1 ring-white/30" />
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      </svg>
    </span>
  );
}
