import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";
import { Button } from "./Button";

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
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl glass p-12 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
        <SearchX className="h-7 w-7 text-slate-400" />
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
