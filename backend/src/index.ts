import "dotenv/config";
import { createApp } from "./app.js";
import { getAIProvider } from "./ai/AIProviderFactory.js";

const PORT = Number(process.env.PORT) || 4000;

const app = createApp();
getAIProvider(); // resolve + log provider at startup

app.listen(PORT, () => {
  console.log(`\n  🟢 GoalVision AI API running on http://localhost:${PORT}`);
  console.log(`     Health:    http://localhost:${PORT}/api/health`);
  console.log(`     AI status: http://localhost:${PORT}/api/ai-status\n`);
});
