import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

const badge = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-white/10 text-slate-200",
        pitch: "bg-pitch-500/15 text-pitch-400 border border-pitch-500/30",
        electric: "bg-electric-500/15 text-electric-400 border border-electric-500/30",
        grape: "bg-grape-500/15 text-grape-400 border border-grape-500/30",
        amber: "bg-amber-500/15 text-amber-400 border border-amber-500/30"
      }
    },
    defaultVariants: { variant: "default" }
  }
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badge> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badge({ variant }), className)} {...props} />;
}
