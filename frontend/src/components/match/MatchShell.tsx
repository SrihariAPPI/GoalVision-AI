import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import type { Match } from "../../types";
import { useMatch } from "../../hooks/useMatch";
import { MatchHero } from "./MatchHero";
import { MatchTabs } from "./MatchTabs";
import { EmptyState, MatchSkeleton } from "../ui/States";

interface Props {
  children: (match: Match) => ReactNode;
}

/** Loads the match from the :id route param and frames it with hero + tabs. */
export function MatchShell({ children }: Props) {
  const { id } = useParams<{ id: string }>();
  const { match, loading } = useMatch(id);

  if (loading) return <MatchSkeleton />;
  if (!match)
    return (
      <EmptyState
        title="Match not found"
        description="We couldn't find that match. Pick one from the dashboard to start analysing."
      />
    );

  return (
    <div className="space-y-6">
      <MatchHero match={match} />
      <MatchTabs matchId={match.id} />
      {children(match)}
    </div>
  );
}
