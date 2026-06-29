import { motion } from "framer-motion";
import type { HeatCell, Player, TeamSheet } from "../../types";

interface PitchProps {
  home: TeamSheet;
  away: TeamSheet;
  showPassingLanes?: boolean;
  heat?: { home: HeatCell[]; away: HeatCell[] };
}

/** A glassy football pitch with both formations, optional passing lanes and heat. */
export function Pitch({ home, away, showPassingLanes = false, heat }: PitchProps) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-emerald-950/60 to-emerald-900/30">
      <PitchMarkings />

      {heat && (
        <>
          {heat.home.map((c, i) => (
            <HeatBlob key={`hh-${i}`} cell={c} color="#34d399" mirror={false} />
          ))}
          {heat.away.map((c, i) => (
            <HeatBlob key={`ha-${i}`} cell={c} color="#60a5fa" mirror />
          ))}
        </>
      )}

      {showPassingLanes && <PassingLanes team={home} color={home.color} mirror={false} />}
      {showPassingLanes && <PassingLanes team={away} color={away.color} mirror />}

      {home.lineup.map((p, i) => (
        <PlayerDot key={p.id} player={p} color={home.color} mirror={false} delay={i * 0.03} />
      ))}
      {away.lineup.map((p, i) => (
        <PlayerDot key={p.id} player={p} color={away.color} mirror delay={i * 0.03} />
      ))}
    </div>
  );
}

/** Convert team-local (x: own goal 0 -> opponent 50, y: 0..100) to pitch percentage. */
function place(x: number, y: number, mirror: boolean) {
  const px = mirror ? 100 - x : x;
  return { left: `${px}%`, top: `${y}%` };
}

function PlayerDot({
  player,
  color,
  mirror,
  delay
}: {
  player: Player;
  color: string;
  mirror: boolean;
  delay: number;
}) {
  const pos = place(player.x, player.y, mirror);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 260, damping: 20 }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={pos}
    >
      <div className="group flex flex-col items-center">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-lg ring-2 ring-white/40 sm:h-8 sm:w-8"
          style={{ backgroundColor: color }}
        >
          {player.number}
        </div>
        <span className="mt-1 max-w-[64px] truncate rounded bg-black/50 px-1 text-[9px] font-medium text-white/90 opacity-0 transition-opacity group-hover:opacity-100 sm:text-[10px]">
          {player.name}
        </span>
      </div>
    </motion.div>
  );
}

function PassingLanes({ team, color, mirror }: { team: TeamSheet; color: string; mirror: boolean }) {
  // Connect each midfielder/forward to nearby teammates to suggest passing lanes.
  const pts = team.lineup;
  const lanes: Array<[Player, Player]> = [];
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      if (Math.hypot(dx, dy) < 26) lanes.push([pts[i], pts[j]]);
    }
  }
  return (
    <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
      {lanes.map(([a, b], i) => {
        const ax = mirror ? 100 - a.x : a.x;
        const bx = mirror ? 100 - b.x : b.x;
        return (
          <line
            key={i}
            x1={`${ax}%`}
            y1={`${a.y}%`}
            x2={`${bx}%`}
            y2={`${b.y}%`}
            stroke={color}
            strokeOpacity={0.22}
            strokeWidth={1.2}
          />
        );
      })}
    </svg>
  );
}

function HeatBlob({ cell, color, mirror }: { cell: HeatCell; color: string; mirror: boolean }) {
  const left = mirror ? 100 - cell.x : cell.x;
  const size = 90 + cell.intensity * 120;
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
      style={{
        left: `${left}%`,
        top: `${cell.y}%`,
        width: size,
        height: size,
        backgroundColor: color,
        opacity: 0.12 + cell.intensity * 0.22
      }}
    />
  );
}

function PitchMarkings() {
  return (
    <svg className="absolute inset-0 h-full w-full text-white/15" fill="none" stroke="currentColor" strokeWidth="0.4" viewBox="0 0 100 62.5" preserveAspectRatio="none">
      <rect x="1" y="1" width="98" height="60.5" rx="1.5" />
      <line x1="50" y1="1" x2="50" y2="61.5" />
      <circle cx="50" cy="31.25" r="8" />
      <circle cx="50" cy="31.25" r="0.6" fill="currentColor" />
      <rect x="1" y="18" width="14" height="26.5" />
      <rect x="85" y="18" width="14" height="26.5" />
      <rect x="1" y="25" width="5" height="12.5" />
      <rect x="94" y="25" width="5" height="12.5" />
    </svg>
  );
}
