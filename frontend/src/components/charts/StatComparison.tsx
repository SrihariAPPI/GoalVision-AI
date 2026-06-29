import { motion } from "framer-motion";

interface StatRow {
  label: string;
  home: number;
  away: number;
  suffix?: string;
}

interface Props {
  rows: StatRow[];
  homeColor: string;
  awayColor: string;
}

export function StatComparison({ rows, homeColor, awayColor }: Props) {
  return (
    <div className="space-y-4">
      {rows.map((row) => {
        const total = row.home + row.away || 1;
        const homePct = (row.home / total) * 100;
        return (
          <div key={row.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-bold tabular-nums">
                {row.home}
                {row.suffix}
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{row.label}</span>
              <span className="font-bold tabular-nums">
                {row.away}
                {row.suffix}
              </span>
            </div>
            <div className="flex h-2 overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${homePct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                style={{ backgroundColor: homeColor }}
              />
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${100 - homePct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                style={{ backgroundColor: awayColor }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
