import express from "express";
import cors from "cors";
import { api } from "./routes.js";

export function createApp() {
  const app = express();

  const origin = process.env.CORS_ORIGIN;
  app.use(
    cors({
      origin: origin ? origin.split(",").map((o) => o.trim()) : true
    })
  );
  app.use(express.json());

  app.use("/api", api);

  app.get("/", (_req, res) => {
    res.json({
      name: "GoalVision AI API",
      docs: ["/api/health", "/api/ai-status", "/api/matches", "/api/matches/:id"]
    });
  });

  // 404 fallback
  app.use((_req, res) => res.status(404).json({ error: "Not found" }));

  return app;
}
