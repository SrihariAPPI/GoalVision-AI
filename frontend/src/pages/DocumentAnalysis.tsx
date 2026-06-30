import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Brain,
  Download,
  Copy,
  Check,
  AlertCircle,
  Zap,
  Sparkles,
  Target,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Users,
  ChevronDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { cn } from "../lib/utils";

export default function DocumentAnalysis() {
  const [step, setStep] = useState<"upload" | "extracting" | "analyzing" | "results">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [extractedMarkdown, setExtractedMarkdown] = useState("");
  const [analysis, setAnalysis] = useState<DoclingAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    summary: true,
    tactical: true,
    players: true,
    strengths: true,
    weaknesses: true,
    recommendations: true
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const validateFile = (f: File): boolean => {
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "text/markdown"];
    const allowedExts = [".pdf", ".docx", ".txt", ".md"];
    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    
    if (!allowedTypes.includes(f.type) && !allowedExts.includes(ext)) {
      setError("Unsupported file type. Please upload PDF, DOCX, TXT, or MD files.");
      return false;
    }
    if (f.size > 25 * 1024 * 1024) {
      setError("File too large. Maximum size is 25MB.");
      return false;
    }
    setError(null);
    return true;
  };

  const uploadFile = async () => {
    if (!file) return;
    setStep("extracting");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/docling/upload`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Upload failed");
      }

      setExtractedMarkdown(data.markdown || "");
      setStep("analyzing");
      await analyzeContent(data.markdown || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setStep("upload");
    }
  };

  const analyzeContent = async (markdown: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/docling/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown })
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysis(data);
      setStep("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setStep("upload");
    }
  };

  const handleReupload = () => {
    setFile(null);
    setExtractedMarkdown("");
    setAnalysis(null);
    setStep("upload");
    setError(null);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadMarkdown = () => {
    if (extractedMarkdown) {
      downloadFile(extractedMarkdown, "document-analysis.md", "text/markdown");
    }
  };

  const downloadJSON = () => {
    if (analysis) {
      const json = JSON.stringify(
        { markdown: extractedMarkdown, analysis },
        null,
        2
      );
      downloadFile(json, "document-analysis.json", "application/json");
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const AnalysisSection = ({ 
    title, 
    icon: Icon, 
    content, 
    color, 
    sectionKey,
    emptyMessage 
  }: { 
    title: string; 
    icon: React.ComponentType<{ className?: string }>;
    content?: string;
    color: string;
    sectionKey: keyof typeof expandedSections;
    emptyMessage?: string;
  }) => {
    const isExpanded = expandedSections[sectionKey];
    
    return (
      <motion.div
        key={sectionKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="group"
      >
        <Card className={cn("overflow-hidden border-l-4", color)}>
          <CardHeader 
            className="cursor-pointer p-4 hover:bg-white/[0.02] transition-colors"
            onClick={() => toggleSection(sectionKey)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", color.replace("border-l-4", "bg-opacity-10 bg"))}>
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-slate-400"
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
            </div>
          </CardHeader>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <CardContent className="pt-0">
                  <div className="prose prose-invert max-w-none whitespace-pre-wrap text-slate-300">
                    {content || <span className="text-slate-500 italic">{emptyMessage || "No data available"}</span>}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => content && copyToClipboard(content!, title)}
                      className="text-sm px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-colors flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </button>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    );
  };

  if (step === "upload") {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-6"
          >
            <Brain className="h-8 w-8 text-blue-400" />
            <span className="text-lg font-semibold text-white">AI Document Intelligence</span>
          </motion.div>
          <h1 className="text-3xl font-black tracking-tight">Analyze Football Documents</h1>
          <p className="mt-2 text-slate-400 max-w-md mx-auto">
            Upload match reports, tactical analyses, scouting PDFs, or player reports. 
            Our AI will extract insights and generate comprehensive analysis.
          </p>
        </div>

        <Card className={cn("relative overflow-hidden", dragActive && "border-blue-500/50 bg-blue-500/5")}>
          <div className="p-8 text-center">
            <input
              type="file"
              id="file-upload"
              accept=".pdf,.docx,.txt,.md"
              onChange={handleFileChange}
              className="hidden"
            />
            <label 
              htmlFor="file-upload"
              className="cursor-pointer"
              onDragEnter={(e) => handleDrag(e)}
              onDragLeave={(e) => handleDrag(e)}
              onDragOver={(e) => handleDrag(e)}
              onDrop={handleDrop}
            >
              <motion.div
                animate={{ scale: dragActive ? 1.02 : 1 }}
                transition={{ duration: 0.15 }}
                className="relative"
              >
                <div className="mx-auto mb-6">
                  <div className={cn(
                    "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4",
                    dragActive ? "bg-blue-500/20 border-2 border-blue-500" : "bg-white/5 border-2 border-dashed border-white/10"
                  )}>
                    <Upload className={cn("h-10 w-10", dragActive ? "text-blue-400" : "text-slate-500")} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {dragActive ? "Drop your document here" : "Drag & drop a document"}
                </h3>
                <p className="text-slate-400 mb-4">or click to browse</p>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5">
                    <FileText className="h-3.5 w-3.5" /> PDF
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5">
                    <FileText className="h-3.5 w-3.5" /> DOCX
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5">
                    <FileText className="h-3.5 w-3.5" /> TXT
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5">
                    <FileText className="h-3.5 w-3.5" /> MD
                  </span>
                </div>
                <p className="mt-4 text-xs text-slate-500">Max file size: 25MB</p>
              </motion.div>
            </label>
          </div>
          {file && (
            <div className="px-8 pb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <FileText className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{file.name}</p>
                    <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={uploadFile}
                  disabled={step !== "upload"}
                  className="px-6 py-2.5 bg-gradient-to-r from-pitch-500 to-pitch-600 text-white font-semibold rounded-xl hover:from-pitch-600 hover:to-pitch-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Brain className="h-5 w-5 mr-2" />
                  Extract & Analyze
                </button>
              </motion.div>
            </div>
          )}
        </Card>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <FeatureCard icon={Zap} title="Instant Extraction" desc="Docling-powered OCR & layout analysis" />
          <FeatureCard icon={Sparkles} title="AI Analysis" desc="Multi-model tactical breakdown" />
          <FeatureCard icon={Download} title="Export Ready" desc="Markdown, JSON, or copy to clipboard" />
        </div>
      </div>
    );
  }

  if (step === "extracting" || step === "analyzing") {
    const isExtracting = step === "extracting";
    return (
      <div className="max-w-md mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full border-4 border-pitch-500/20" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-4 border-pitch-500 border-t-transparent"
            />
            <div className="relative w-full h-full flex items-center justify-center">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center",
                isExtracting ? "bg-blue-500/20" : "bg-purple-500/20"
              )}>
                {isExtracting ? (
                  <FileText className="h-8 w-8 text-blue-400" />
                ) : (
                  <Brain className="h-8 w-8 text-purple-400" />
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white"
        >
          {isExtracting ? "Extracting Document" : "AI Analysis in Progress"}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-400"
        >
          {isExtracting 
            ? "Docling is parsing your document structure, tables, and text..." 
            : "Multi-model AI is generating tactical insights..."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full h-2 bg-white/10 rounded-full overflow-hidden"
        >
          <motion.div
            animate={{ width: isExtracting ? "100%" : "100%" }}
            transition={{ duration: isExtracting ? 3 : 2, ease: "easeInOut" }}
            className={cn(
              "h-full rounded-full",
              isExtracting 
                ? "bg-gradient-to-r from-blue-500 to-pitch-500" 
                : "bg-gradient-to-r from-purple-500 to-pink-500"
            )}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-slate-500"
        >
          {isExtracting ? "This usually takes 10-30 seconds" : "Generating summary, tactics, key players & recommendations"}
        </motion.p>
      </div>
    );
  }

  if (step === "results" && analysis) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gradient-to-r from-pitch-500/10 to-emerald-500/10 rounded-2xl border border-pitch-500/20"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-pitch-500/20 rounded-xl">
              <Check className="h-6 w-6 text-pitch-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Analysis Complete</h2>
              <p className="text-sm text-slate-400">AI-powered insights generated successfully</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <button onClick={downloadMarkdown} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
              <Download className="h-4 w-4" />
              Download MD
            </button>
            <button onClick={downloadJSON} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
              <Download className="h-4 w-4" />
              Download JSON
            </button>
            <button onClick={handleReupload} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
              <Upload className="h-4 w-4" />
              New Document
            </button>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          <AnalysisSection
            title="Match Summary"
            icon={FileText}
            content={analysis.summary}
            color="border-l-4 border-pitch-500 bg-pitch-500/5"
            sectionKey="summary"
            emptyMessage="No summary generated"
          />
          <AnalysisSection
            title="Tactical Analysis"
            icon={Target}
            content={analysis.tacticalAnalysis}
            color="border-l-4 border-blue-500 bg-blue-500/5"
            sectionKey="tactical"
            emptyMessage="No tactical analysis generated"
          />
          <AnalysisSection
            title="Key Players"
            icon={Users}
            content={analysis.keyPlayers}
            color="border-l-4 border-purple-500 bg-purple-500/5"
            sectionKey="players"
            emptyMessage="No key players identified"
          />
          <AnalysisSection
            title="Strengths"
            icon={TrendingUp}
            content={analysis.strengths}
            color="border-l-4 border-emerald-500 bg-emerald-500/5"
            sectionKey="strengths"
            emptyMessage="No strengths identified"
          />
          <AnalysisSection
            title="Weaknesses"
            icon={TrendingDown}
            content={analysis.weaknesses}
            color="border-l-4 border-red-500 bg-red-500/5"
            sectionKey="weaknesses"
            emptyMessage="No weaknesses identified"
          />
          <AnalysisSection
            title="Recommendations"
            icon={Lightbulb}
            content={analysis.recommendations}
            color="border-l-4 border-amber-500 bg-amber-500/5"
            sectionKey="recommendations"
            emptyMessage="No recommendations generated"
          />
        </div>

        <Card className="border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Raw Markdown (Extracted)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <button
                onClick={() => copyToClipboard(extractedMarkdown, "Markdown")}
                className="absolute top-3 right-3 px-3 py-1 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center gap-1"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </button>
              <pre className="prose prose-invert max-w-none whitespace-pre-wrap text-sm text-slate-300 bg-ink-950 p-4 rounded-xl border border-white/5 overflow-x-auto max-h-96">
                {extractedMarkdown || "No content extracted"}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}

function FeatureCard({ icon: Icon, title, desc }: FeatureCardProps) {
  return (
    <Card className="p-6 text-center hover:border-pitch-500/30 transition-colors">
      <div className="mx-auto mb-3 p-3 bg-pitch-500/20 rounded-xl w-fit">
        <Icon className="h-6 w-6 text-pitch-400" />
      </div>
      <h4 className="font-semibold text-white mb-1">{title}</h4>
      <p className="text-sm text-slate-400">{desc}</p>
    </Card>
  );
}

interface DoclingAnalysisResult {
  success: boolean;
  summary?: string;
  tacticalAnalysis?: string;
  keyPlayers?: string;
  strengths?: string;
  weaknesses?: string;
  recommendations?: string;
  error?: string;
}