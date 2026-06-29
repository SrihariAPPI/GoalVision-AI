import { Router } from "express";
import type { Request, Response } from "express";
import { matches, getMatch } from "./data/matches.js";
import { getAIProvider } from "./ai/AIProviderFactory.js";
import type { ChatRequest, ExplainEventRequest } from "./types.js";

export const api = Router();

api.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "goalvision-ai" });
});

api.get("/ai-status", (_req: Request, res: Response) => {
  const ai = getAIProvider();
  res.json(ai.getStatus());
});

// List matches (compact cards for the dashboard).
api.get("/matches", (_req: Request, res: Response) => {
  const list = matches.map((m) => ({
    id: m.id,
    competition: m.competition,
    stage: m.stage,
    date: m.date,
    venue: m.venue,
    city: m.city,
    status: m.status,
    result: m.result,
    headline: m.headline,
    score: m.score,
    homeTeam: { name: m.homeTeam.name, shortName: m.homeTeam.shortName, color: m.homeTeam.color },
    awayTeam: { name: m.awayTeam.name, shortName: m.awayTeam.shortName, color: m.awayTeam.color }
  }));
  res.json(list);
});

// Full match detail.
api.get("/matches/:id", (req: Request, res: Response) => {
  const match = getMatch(req.params.id);
  if (!match) return res.status(404).json({ error: "Match not found" });
  return res.json(match);
});

// Explainable AI: natural-language explanation of a single event.
api.post("/explain", async (req: Request, res: Response) => {
  const { matchId, eventId } = req.body as ExplainEventRequest;
  if (!matchId || !eventId) return res.status(400).json({ error: "matchId and eventId are required" });

  const ai = getAIProvider();
  const result = await ai.explain(matchId, eventId);
  return res.json(result);
});

// AI Chat grounded in a single match.
api.post("/chat", async (req: Request, res: Response) => {
  const { matchId, message } = req.body as ChatRequest;
  if (!matchId || !message) return res.status(400).json({ error: "matchId and message are required" });

  const ai = getAIProvider();
  const result = await ai.chat(matchId, message);
  return res.json(result);
});

// AI match summary.
api.post("/summary", async (req: Request, res: Response) => {
  const { matchId } = req.body as { matchId: string };
  const match = getMatch(matchId);
  if (!match) return res.status(404).json({ error: "Match not found" });

  const ai = getAIProvider();
  const result = await ai.summarize(matchId);
  return res.json(result);
});

// Tactical read for one side.
api.post("/tactical", async (req: Request, res: Response) => {
  const { matchId, side } = req.body as { matchId: string; side: "home" | "away" };
  const match = getMatch(matchId);
  if (!match) return res.status(404).json({ error: "Match not found" });

  const ai = getAIProvider();
  const result = await ai.tactical(matchId, side);
  return res.json(result);
});

// Generate insights (for future use).
api.post("/insights", async (req: Request, res: Response) => {
  const { matchId, type } = req.body as { matchId: string; type: string };
  const match = getMatch(matchId);
  if (!match) return res.status(404).json({ error: "Match not found" });

  const ai = getAIProvider();
  const result = await ai.generateInsights(matchId, type);
  return res.json(result);
});
