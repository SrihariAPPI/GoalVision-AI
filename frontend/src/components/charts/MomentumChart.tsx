import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { MomentumPoint } from "../../types";

interface Props {
  data: MomentumPoint[];
  homeName: string;
  awayName: string;
}

export function MomentumChart({ data, homeName, awayName }: Props) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="homeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="awayGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="minute"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickFormatter={(m) => `${m}'`}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickLine={false}
          />
          <YAxis domain={[-100, 100]} hide />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.18)" />
          <Tooltip
            contentStyle={{
              background: "rgba(10,14,26,0.92)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 12,
              color: "#e2e8f0",
              fontSize: 12
            }}
            formatter={(value: number) => {
              const v = Number(value);
              return [`${Math.abs(v)}% pressure`, v >= 0 ? homeName : awayName];
            }}
            labelFormatter={(m) => `Minute ${m}`}
          />
          <Area
            type="monotone"
            dataKey={(d: MomentumPoint) => Math.max(0, d.value)}
            stroke="#34d399"
            strokeWidth={2}
            fill="url(#homeGrad)"
            name={homeName}
            isAnimationActive
          />
          <Area
            type="monotone"
            dataKey={(d: MomentumPoint) => Math.min(0, d.value)}
            stroke="#60a5fa"
            strokeWidth={2}
            fill="url(#awayGrad)"
            name={awayName}
            isAnimationActive
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-2 flex items-center justify-center gap-6 text-xs text-slate-400">
        <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-pitch-400" />{homeName} dominance</span>
        <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-electric-400" />{awayName} dominance</span>
      </div>
    </div>
  );
}
