import { type ReactNode, type ComponentType } from "react";
import { Link } from "react-router-dom";
import { SearchX, Activity, Goal, BarChart3 } from "lucide-react";
import { Button } from "./Button";

function Skeleton({ className }: { className?: string }) {
  return <div className={`skeleton ${className ?? ""}`} />;
}

/** Skeleton for the match analysis page: hero + tabs + 2-column content. */
export function MatchSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 rounded-2xl" />
      <Skeleton className="h-12 rounded-xl" />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <Skeleton className="h-96 rounded-2xl" />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

/** Skeleton for the tactical board page. */
export function TacticalSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 rounded-2xl" />
      <Skeleton className="h-12 rounded-xl" />
      <Skeleton className="h-80 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    </div>
  );
}

/** Skeleton for the summary page. */
export function SummarySkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 rounded-2xl" />
      <Skeleton className="h-12 rounded-xl" />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

/** Skeleton for the AI chat page. */
export function ChatSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 rounded-2xl" />
      <Skeleton className="h-12 rounded-xl" />
      <Skeleton className="h-[60vh] min-h-[460px] rounded-2xl" />
    </div>
  );
}

/** Skeleton for the dashboard page. */
export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

/** Generic loading block (backward-compatible). */
export function LoadingBlock({ label = "Loading match…" }: { label?: string }) {
  return (
    <div className="space-y-4">
      <div className="skeleton h-40 rounded-2xl" />
      <div className="skeleton h-12 rounded-xl" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="skeleton h-64 rounded-2xl" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
      <p className="text-center text-sm text-slate-500">{label}</p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon: Icon = SearchX
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl glass p-12 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
        <Icon className="h-7 w-7 text-slate-400" />
      </span>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-400">{description}</p>
      {action ?? (
        <Link to="/dashboard" className="mt-5">
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
      )}
    </div>
  );
}

/** Pre-built empty state for when no events are in a timeline. */
export function NoEventsState() {
  return (
    <EmptyState
      icon={Activity}
      title="No events recorded"
      description="This match doesn't have any timeline events to show."
    />
  );
}

/** Pre-built empty state for when no goals exist. */
export function NoGoalsState() {
  return (
    <EmptyState
      icon={Goal}
      title="No goals scored"
      description="This match ended goalless — a defensive masterclass."
    />
  );
}

/** Pre-built empty state for when statistics are unavailable. */
export function NoStatsState() {
  return (
    <EmptyState
      icon={BarChart3}
      title="No match statistics"
      description="Statistics for this match are not available yet."
    />
  );
}
