import { Router } from "express";
import type { Request, Response } from "express";
import multer from "multer";
import * as path from "path";
import * as os from "os";
import { matches, getMatch } from "./data/matches.js";
import { getAIProvider } from "./ai/AIProviderFactory.js";
import type { ChatRequest, ExplainEventRequest } from "./types.js";
import { footballApi } from "./services/footballApi.js";
import { doclingService } from "./services/doclingService.js";

export const api = Router();

// Configure multer for file uploads
const upload = multer({
  dest: path.join(os.tmpdir(), "goalvision-docling"),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (doclingService.isSupportedFile(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Supported: PDF, DOCX, TXT, MD"));
    }
  }
});

api.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "goalvision-ai" });
});

api.get("/ai-status", (_req: Request, res: Response) => {
  const ai = getAIProvider();
  res.json(ai.getStatus());
});

api.get("/matches", (_req: Request, res: Response) => {
  const list = matches.map((m) => ({
    id: m.id, competition: m.competition, stage: m.stage, date: m.date,
    venue: m.venue, city: m.city, status: m.status, result: m.result,
    headline: m.headline, score: m.score,
    homeTeam: { name: m.homeTeam.name, shortName: m.homeTeam.shortName, color: m.homeTeam.color },
    awayTeam: { name: m.awayTeam.name, shortName: m.awayTeam.shortName, color: m.awayTeam.color }
  }));
  res.json(list);
});

api.get("/matches/:id", (req: Request, res: Response) => {
  const match = getMatch(req.params.id);
  if (!match) return res.status(404).json({ error: "Match not found" });
  return res.json(match);
});

// ---- RapidAPI-powered endpoints ----

api.get("/live", async (_req: Request, res: Response) => {
  try {
    const fixtures = await footballApi.getLiveMatches();
    return res.json(fixtures);
  } catch {
    const live = matches.filter((m) => m.status === "live");
    const list = live.map((m) => ({
      id: m.id, competition: m.competition, stage: m.stage, date: m.date,
      venue: m.venue, city: m.city, status: m.status, result: m.result,
      headline: m.headline, score: m.score,
      homeTeam: { name: m.homeTeam.name, shortName: m.homeTeam.shortName, color: m.homeTeam.color, logo: "" },
      awayTeam: { name: m.awayTeam.name, shortName: m.awayTeam.shortName, color: m.awayTeam.color, logo: "" }
    }));
    return res.json(list);
  }
});

api.get("/fixtures", async (req: Request, res: Response) => {
  try {
    const date = req.query.date as string | undefined;
    const fixtures = await footballApi.getFixtures(date);
    return res.json(fixtures);
  } catch {
    return res.json([]);
  }
});

api.get("/match/:id", async (req: Request, res: Response) => {
  try {
    const match = await footballApi.getMatch(req.params.id);
    if (!match) return res.status(404).json({ error: "Match not found" });
    return res.json(match);
  } catch {
    const match = getMatch(req.params.id);
    if (!match) return res.status(404).json({ error: "Match not found" });
    return res.json({
      id: match.id, competition: match.competition, stage: match.stage, date: match.date,
      venue: match.venue, city: match.city, status: match.status, result: match.result,
      headline: match.headline, score: match.score,
      homeTeam: { name: match.homeTeam.name, shortName: match.homeTeam.shortName, color: match.homeTeam.color, logo: "" },
      awayTeam: { name: match.awayTeam.name, shortName: match.awayTeam.shortName, color: match.awayTeam.color, logo: "" }
    });
  }
});

api.get("/standings/:league", async (req: Request, res: Response) => {
  try {
    const standings = await footballApi.getStandings(req.params.league);
    return res.json(standings);
  } catch {
    return res.json([]);
  }
});

api.get("/teams/:id", async (req: Request, res: Response) => {
  try {
    const team = await footballApi.getTeam(req.params.id);
    if (!team) return res.status(404).json({ error: "Team not found" });
    return res.json(team);
  } catch {
    return res.status(404).json({ error: "Team not found" });
  }
});

api.get("/player/:id", async (req: Request, res: Response) => {
  try {
    const player = await footballApi.getPlayer(req.params.id);
    if (!player) return res.status(404).json({ error: "Player not found" });
    return res.json(player);
  } catch {
    return res.status(404).json({ error: "Player not found" });
  }
});

// ---- AI endpoints ----

api.post("/explain", async (req: Request, res: Response) => {
  const { matchId, eventId } = req.body as ExplainEventRequest;
  if (!matchId || !eventId) return res.status(400).json({ error: "matchId and eventId are required" });
  const ai = getAIProvider();
  const result = await ai.explain(matchId, eventId);
  return res.json(result);
});

api.post("/chat", async (req: Request, res: Response) => {
  const { matchId, message } = req.body as ChatRequest;
  if (!matchId || !message) return res.status(400).json({ error: "matchId and message are required" });
  const ai = getAIProvider();
  const result = await ai.chat(matchId, message);
  return res.json(result);
});

api.post("/summary", async (req: Request, res: Response) => {
  const { matchId } = req.body as { matchId: string };
  const match = getMatch(matchId);
  if (!match) return res.status(404).json({ error: "Match not found" });
  const ai = getAIProvider();
  const result = await ai.summarize(matchId);
  return res.json(result);
});

api.post("/tactical", async (req: Request, res: Response) => {
  const { matchId, side } = req.body as { matchId: string; side: "home" | "away" };
  const match = getMatch(matchId);
  if (!match) return res.status(404).json({ error: "Match not found" });
  const ai = getAIProvider();
  const result = await ai.tactical(matchId, side);
  return res.json(result);
});

api.post("/insights", async (req: Request, res: Response) => {
  const { matchId, type } = req.body as { matchId: string; type: string };
  const match = getMatch(matchId);
  if (!match) return res.status(404).json({ error: "Match not found" });
  const ai = getAIProvider();
  const result = await ai.generateInsights(matchId, type);
  return res.json(result);
});

// ---- Docling Document Intelligence endpoints ----

/**
 * POST /api/docling/upload
 * Upload and extract content from a document (PDF, DOCX, TXT, MD)
 * Returns extracted markdown, text, and page count
 */
api.post("/docling/upload", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await doclingService.extractDocument(req.file.path, req.file.originalname);
    
    if (!result.success) {
      return res.status(500).json({ 
        success: false, 
        error: result.error 
      });
    }

    return res.json({
      success: true,
      markdown: result.markdown,
      text: result.text,
      pages: result.pages,
      metadata: result.metadata
    });
  } catch (error) {
    console.error("[Docling] Upload error:", error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Upload failed" 
    });
  }
});

/**
 * POST /api/docling/analyze
 * Analyze extracted document content using AI Router
 * Expects: { markdown: string } or { file: <uploaded file> }
 * Returns structured analysis: summary, tactical, key players, etc.
 */
api.post("/docling/analyze", upload.single("file"), async (req: Request, res: Response) => {
  try {
    let markdown: string;

    // If file uploaded, extract first
    if (req.file) {
      const extractResult = await doclingService.extractDocument(req.file.path, req.file.originalname);
      if (!extractResult.success) {
        return res.status(500).json({ 
          success: false, 
          error: extractResult.error 
        });
      }
      markdown = extractResult.markdown || "";
    } else if (req.body.markdown) {
      // Use provided markdown
      markdown = req.body.markdown;
    } else {
      return res.status(400).json({ 
        success: false, 
        error: "No file or markdown content provided" 
      });
    }

    if (!markdown || markdown.trim().length < 50) {
      return res.status(400).json({ 
        success: false, 
        error: "Document content too short for analysis" 
      });
    }

    // Analyze with AI
    const analysis = await doclingService.analyzeDocument(markdown, getAIProvider);
    
    if (!analysis.success) {
      return res.status(500).json({ 
        success: false, 
        error: analysis.error 
      });
    }

    return res.json({
      ...analysis
    });
  } catch (error) {
    console.error("[Docling] Analysis error:", error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Analysis failed" 
    });
  }
});
