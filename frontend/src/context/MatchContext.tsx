import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AIProviderName, AIStatus, ProviderOption, MatchSummaryCard } from "../types";
import { api } from "../lib/api";

interface MatchContextValue {
  matches: MatchSummaryCard[];
  loading: boolean;
  selectedId: string;
  setSelectedId: (id: string) => void;
  aiProvider: AIProviderName;
  aiLive: boolean;
  aiStatus: AIStatus | null;
  preferredProvider: ProviderOption;
  setPreferredProvider: (p: ProviderOption) => void;
}

const MatchContext = createContext<MatchContextValue | null>(null);

const STORAGE_KEY = "goalvision.selectedMatch";
const PROVIDER_KEY = "goalvision.preferredProvider";

export function MatchProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<MatchSummaryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedIdState] = useState<string>(
    () => localStorage.getItem(STORAGE_KEY) ?? ""
  );
  const [aiStatus, setAiStatus] = useState<AIStatus | null>(null);
  const [preferredProvider, setPreferredProvider] = useState<ProviderOption>(
    () => (localStorage.getItem(PROVIDER_KEY) as ProviderOption) ?? "auto"
  );

  const aiProvider = aiStatus?.provider ?? "mock";
  const aiLive = aiStatus?.live ?? false;

  useEffect(() => {
    let active = true;
    Promise.all([api.listMatches(), api.aiStatus()]).then(([list, status]) => {
      if (!active) return;
      setMatches(list);
      setAiStatus(status);
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

  const handleSetPreferredProvider = (p: ProviderOption) => {
    setPreferredProvider(p);
    localStorage.setItem(PROVIDER_KEY, p);
  };

  const value = useMemo(
    () => ({
      matches,
      loading,
      selectedId,
      setSelectedId,
      aiProvider,
      aiLive,
      aiStatus,
      preferredProvider,
      setPreferredProvider: handleSetPreferredProvider
    }),
    [matches, loading, selectedId, aiProvider, aiLive, aiStatus, preferredProvider]
  );

  return <MatchContext.Provider value={value}>{children}</MatchContext.Provider>;
}

export function useMatches() {
  const ctx = useContext(MatchContext);
  if (!ctx) throw new Error("useMatches must be used within MatchProvider");
  return ctx;
}
