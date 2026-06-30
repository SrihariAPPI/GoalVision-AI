import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import type { AIProviderRouter } from "../ai/AIProviderFactory.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Docling Service
 * Handles document extraction and AI-powered analysis
 */
export interface ExtractionResult {
  success: boolean;
  markdown?: string;
  text?: string;
  pages?: number;
  metadata?: Record<string, unknown>;
  error?: string;
}

export interface AnalysisResult {
  success: boolean;
  summary?: string;
  tacticalAnalysis?: string;
  keyPlayers?: string;
  strengths?: string;
  weaknesses?: string;
  recommendations?: string;
  error?: string;
}

/**
 * Extract document content using Docling Python script
 */
async function extractWithDocling(filePath: string, originalName: string): Promise<ExtractionResult> {
  return new Promise((resolve) => {
    const scriptPath = path.join(__dirname, "..", "..", "scripts", "docling_extract.py");
    const pythonCmd = process.platform === "win32" ? "python" : "python3";

    // multer stores the upload under a random name with no extension. Docling
    // relies on the extension to detect the format, so give the temp file the
    // original extension before handing it to the Python script.
    const originalExt = path.extname(originalName);
    let workingPath = filePath;
    if (originalExt && path.extname(filePath).toLowerCase() !== originalExt.toLowerCase()) {
      workingPath = filePath + originalExt;
      try {
        fs.renameSync(filePath, workingPath);
      } catch {
        workingPath = filePath;
      }
    }

    console.log(`[Docling] Extracting: ${originalName} (${workingPath})`);

    const child = spawn(pythonCmd, [scriptPath, workingPath], {
      cwd: __dirname,
      stdio: ["ignore", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      // Clean up temp file
      try {
        if (fs.existsSync(workingPath)) {
          fs.unlinkSync(workingPath);
        }
      } catch {}

      if (code !== 0) {
        console.error(`[Docling] Extraction failed (code ${code}):`, stderr);
        resolve({ success: false, error: `Docling failed: ${stderr}` });
        return;
      }

      try {
        const result = JSON.parse(stdout.trim());
        resolve(result);
      } catch (parseErr) {
        console.error("[Docling] Failed to parse output:", stdout);
        resolve({ success: false, error: "Invalid JSON from Docling script" });
      }
    });

    child.on("error", (err) => {
      console.error("[Docling] Spawn error:", err);
      resolve({ success: false, error: `Failed to start Docling: ${err.message}` });
    });

    // 60 second timeout
    setTimeout(() => {
      child.kill("SIGKILL");
      resolve({ success: false, error: "Docling extraction timed out" });
    }, 60000);
  });
}

/**
 * Analyze document content using AI Router
 * Calls multiple AI methods for different analysis aspects
 */
async function analyzeWithAI(
  markdown: string,
  getProvider: () => AIProviderRouter
): Promise<AnalysisResult> {
  const ai = getProvider();

  try {
    // Truncate if too long (keep first ~15000 chars for token limits)
    const truncatedMarkdown = markdown.length > 15000 
      ? markdown.slice(0, 15000) + "\n\n[Content truncated for analysis...]"
      : markdown;

    // Parallel AI calls for different analysis aspects
    const [
      summaryResult,
      tacticalResult,
      playersResult,
      strengthsResult,
      weaknessesResult,
      recommendationsResult
    ] = await Promise.allSettled([
      // 1. Match Summary
      ai.generate({
        system: `You are an expert football analyst. Provide a concise, professional match report summary from the document content. Focus on key events, result, and narrative.`,
        user: `Document:\n${truncatedMarkdown}\n\nWrite a professional match summary (150-250 words):`,
        maxTokens: 300
      }),
      // 2. Tactical Analysis
      ai.generate({
        system: `You are a tactical football analyst. Extract tactical insights: formations, shape, patterns of play, key tactical decisions, in-game adjustments.`,
        user: `Document:\n${truncatedMarkdown}\n\nProvide tactical analysis (200-300 words):`,
        maxTokens: 350
      }),
      // 3. Key Players
      ai.generate({
        system: `You are a football scout. Identify key players mentioned, their roles, performances, and impact on the game.`,
        user: `Document:\n${truncatedMarkdown}\n\nList key players with brief performance notes (bullet points):`,
        maxTokens: 250
      }),
      // 4. Strengths
      ai.generate({
        system: `You are a performance analyst. Identify team/player strengths from the document: what worked well, dominant phases, effective patterns.`,
        user: `Document:\n${truncatedMarkdown}\n\nList key strengths (bullet points):`,
        maxTokens: 200
      }),
      // 5. Weaknesses
      ai.generate({
        system: `You are a performance analyst. Identify weaknesses, vulnerabilities, areas for improvement mentioned or implied in the document.`,
        user: `Document:\n${truncatedMarkdown}\n\nList weaknesses/areas for improvement (bullet points):`,
        maxTokens: 200
      }),
      // 6. Recommendations
      ai.generate({
        system: `You are a football coach. Provide actionable recommendations for training, tactical adjustments, or squad management based on the document.`,
        user: `Document:\n${truncatedMarkdown}\n\nProvide coach recommendations (bullet points):`,
        maxTokens: 250
      })
    ]);

    return {
      success: true,
      summary: summaryResult.status === "fulfilled" ? summaryResult.value : "Summary unavailable",
      tacticalAnalysis: tacticalResult.status === "fulfilled" ? tacticalResult.value : "Tactical analysis unavailable",
      keyPlayers: playersResult.status === "fulfilled" ? playersResult.value : "Key players unavailable",
      strengths: strengthsResult.status === "fulfilled" ? strengthsResult.value : "Strengths unavailable",
      weaknesses: weaknessesResult.status === "fulfilled" ? weaknessesResult.value : "Weaknesses unavailable",
      recommendations: recommendationsResult.status === "fulfilled" ? recommendationsResult.value : "Recommendations unavailable"
    };
  } catch (err) {
    console.error("[Docling] AI analysis error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "AI analysis failed"
    };
  }
}

/**
 * Public Docling Service API
 */
export const doclingService = {
  /**
   * Check if a file type is supported
   */
  isSupportedFile(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();
    return [".pdf", ".docx", ".txt", ".md"].includes(ext);
  },

  /**
   * Extract document content using Docling
   */
  async extractDocument(filePath: string, originalName: string): Promise<ExtractionResult> {
    const ext = path.extname(originalName).toLowerCase();
    const supportedExts = [".pdf", ".docx", ".txt", ".md"];
    
    if (!supportedExts.includes(ext)) {
      return { 
        success: false, 
        error: `Unsupported file type: ${ext}. Supported: ${supportedExts.join(", ")}` 
      };
    }

    return extractWithDocling(filePath, originalName);
  },

  /**
   * Analyze document content with AI
   */
  async analyzeDocument(
    markdown: string, 
    getProvider: () => AIProviderRouter
  ): Promise<AnalysisResult> {
    if (!markdown || markdown.trim().length < 50) {
      return { success: false, error: "Document content too short for analysis" };
    }

    return analyzeWithAI(markdown, getProvider);
  }
};

/**
 * Configure multer for file uploads
 */
export const upload = await import("multer").then(({ default: multer }) => {
  const uploadDir = path.join(__dirname, "..", "uploads");
  const tempDir = path.join(__dirname, "..", "temp");
  
  // Ensure directories exist
  [uploadDir, tempDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  return multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, tempDir),
      filename: (_req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
      }
    }),
    fileFilter: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const allowed = [".pdf", ".docx", ".txt", ".md"];
      if (allowed.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error(`File type ${ext} not allowed. Allowed: ${allowed.join(", ")}`));
      }
    },
    limits: {
      fileSize: 25 * 1024 * 1024 // 25MB max
    }
  });
});