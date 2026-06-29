import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { MatchSummaryCard } from "../types";
import { api } from "../lib/api";

interface MatchContextValue {
  matches: MatchSummaryCard[];
  loading: boolean;
  selectedId: string;
  setSelectedId: (id: string) => void;
  aiProvider: "granite" | "mock";
  aiLive: boolean;
}

const MatchContext = createContext<MatchContextValue | null>(null);

const STORAGE_KEY = "goalvision.selectedMatch";

export function MatchProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<MatchSummaryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedIdState] = useState<string>(
    () => localStorage.getItem(STORAGE_KEY) ?? ""
  );
  const [aiProvider, setAiProvider] = useState<"granite" | "mock">("mock");
  const [aiLive, setAiLive] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([api.listMatches(), api.aiStatus()]).then(([list, status]) => {
      if (!active) return;
      setMatches(list);
      setAiProvider(status.provider);
      setAiLive(status.live);
      setSelectedIdState((current) => current || list[0]?.id || "");
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const setSelectedId = (id: string) => {
    setSelectedIdState(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  const value = useMemo(
    () => ({ matches, loading, selectedId, setSelectedId, aiProvider, aiLive }),
    [matches, loading, selectedId, aiProvider, aiLive]
  );

  return <MatchContext.Provider value={value}>{children}</MatchContext.Provider>;
}

export function useMatches() {
  const ctx = useContext(MatchContext);
  if (!ctx) throw new Error("useMatches must be used within MatchProvider");
  return ctx;
}
