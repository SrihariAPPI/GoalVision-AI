import type { EventType } from "../types.js";

export const SYSTEM_ANALYST =
  "You are GoalVision AI, an elite football (soccer) analyst and broadcaster. " +
  "You explain the game with clarity, warmth and tactical insight for fans who are not experts. " +
  "Be vivid but concise. Never invent statistics that are not provided. " +
  "Use plain language, short paragraphs, and avoid jargon without a quick explanation.";

const EVENT_GUIDANCE: Record<EventType, string> = {
  goal: "Explain how the goal was created, why the defence was beaten, and what it meant for the game.",
  "penalty-goal": "Explain why the penalty was awarded, the pressure on the taker, and its impact on momentum.",
  "penalty-miss": "Explain the situation, the psychology of the moment, and the consequences.",
  "yellow-card": "Explain what the player did, why it was cautioned, and the tactical risk it creates.",
  "red-card": "Explain the offence, why it warranted dismissal, and how it reshapes the match.",
  offside: "Explain the offside rule in this specific situation in simple terms, and whether it was tight or clear.",
  substitution: "Explain the tactical reasoning behind the change and what the manager was trying to fix or protect.",
  var: "Explain what the moment involved and why it mattered.",
  shot: "Explain the chance, its quality, and why it did or didn't result in a goal.",
  kickoff: "Set the scene for the match.",
  halftime: "Summarise the first half briefly.",
  fulltime: "Summarise the final outcome briefly."
};

export function explainPrompt(eventType: EventType, eventFacts: string): { system: string; user: string } {
  return {
    system: SYSTEM_ANALYST,
    user:
      `${eventFacts}\n\n` +
      `Task: ${EVENT_GUIDANCE[eventType]}\n` +
      "Write 2-3 short sentences a casual fan would instantly understand. Do not use bullet points."
  };
}

export function chatPrompt(matchCtx: string, message: string): { system: string; user: string } {
  return {
    system: SYSTEM_ANALYST,
    user:
      `Here is the full context for the match the user is asking about:\n\n${matchCtx}\n\n` +
      `User question: "${message}"\n\n` +
      "Answer using only the facts above. If the answer isn't in the data, say so honestly. " +
      "Keep it to a tight, engaging paragraph."
  };
}

export function summaryPrompt(matchCtx: string): { system: string; user: string } {
  return {
    system: SYSTEM_ANALYST,
    user:
      `${matchCtx}\n\n` +
      "Task: Write a polished match summary for a fan who missed the game. " +
      "Cover the story of the match, the turning point, the standout performer, and the final outcome. " +
      "Use 2 short paragraphs. Do not invent any statistic not listed above."
  };
}

export function tacticalPrompt(matchCtx: string, side: "home" | "away"): { system: string; user: string } {
  return {
    system: SYSTEM_ANALYST,
    user:
      `${matchCtx}\n\n` +
      `Task: Give a concise tactical read of the ${side} team's approach — their shape, how they tried to win, ` +
      "and one weakness the opponent exploited. 3-4 sentences, no bullet points."
  };
}
