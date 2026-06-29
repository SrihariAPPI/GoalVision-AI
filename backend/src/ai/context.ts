import type { Match, MatchEvent } from "../types.js";

/** Build a compact, factual context string about a match for grounding the model. */
export function matchContext(match: Match): string {
  const s = match.stats;
  const line = (label: string, pair: [number, number], suffix = "") =>
    `- ${label}: ${match.homeTeam.shortName} ${pair[0]}${suffix} vs ${match.awayTeam.shortName} ${pair[1]}${suffix}`;

  const events = match.events
    .map((e) => `  ${e.minute}' [${e.type}] ${e.side === "home" ? match.homeTeam.shortName : match.awayTeam.shortName} — ${e.player}: ${e.detail}`)
    .join("\n");

  return [
    `MATCH: ${match.homeTeam.name} ${match.score.home}-${match.score.away} ${match.awayTeam.name}`,
    `Competition: ${match.competition} — ${match.stage}`,
    `Venue: ${match.venue}, ${match.city} (${match.date}). Result: ${match.result}`,
    `Formations: ${match.homeTeam.name} ${match.homeTeam.formation} (mgr ${match.homeTeam.manager}); ${match.awayTeam.name} ${match.awayTeam.formation} (mgr ${match.awayTeam.manager}).`,
    "Key statistics:",
    line("Possession", s.possession, "%"),
    line("Shots", s.shots),
    line("Shots on target", s.shotsOnTarget),
    line("Expected goals (xG)", s.xg),
    line("Pass accuracy", s.passAccuracy, "%"),
    line("Corners", s.corners),
    line("Fouls", s.fouls),
    line("Offsides", s.offsides),
    "Timeline of key events:",
    events
  ].join("\n");
}

/** A short factual description of a single event for the explain endpoint. */
export function eventContext(match: Match, event: MatchEvent): string {
  const team = event.side === "home" ? match.homeTeam : match.awayTeam;
  const opponent = event.side === "home" ? match.awayTeam : match.homeTeam;
  const parts = [
    `EVENT: ${event.type} at minute ${event.minute}.`,
    `Team: ${team.name} (vs ${opponent.name}).`,
    `Player: ${event.player}.`
  ];
  if (event.assist) parts.push(`Assisted by: ${event.assist}.`);
  if (event.playerOff) parts.push(`Player replaced: ${event.playerOff}.`);
  parts.push(`Description: ${event.detail}.`);
  parts.push(`Score in this match finished ${match.homeTeam.name} ${match.score.home}-${match.score.away} ${match.awayTeam.name}.`);
  return parts.join(" ");
}
