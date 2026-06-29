import { Suspense, lazy, type ReactNode } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Layout } from "./components/layout/Layout";
import { Spinner } from "./components/ui/Spinner";
import { useMatches } from "./context/MatchContext";

const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MatchAnalysis = lazy(() => import("./pages/MatchAnalysis"));
const TacticalBoard = lazy(() => import("./pages/TacticalBoard"));
const AIChat = lazy(() => import("./pages/AIChat"));
const MatchSummary = lazy(() => import("./pages/MatchSummary"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

/** Redirect a bare scoped route (e.g. /analysis) to the currently selected match. */
function ScopedRedirect({ base }: { base: string }) {
  const { selectedId, loading } = useMatches();
  if (loading) return null;
  if (!selectedId) return <Navigate to="/dashboard" replace />;
  return <Navigate to={`/${base}/${selectedId}`} replace />;
}

function SuspenseFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950">
      <div className="flex flex-col items-center gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pitch-500 to-electric-600 shadow-glow">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          </svg>
        </span>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Spinner /> Loading…
        </div>
      </div>
    </div>
  );
}

function AnimatedPage({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<SuspenseFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <AnimatedPage>
                  <Dashboard />
                </AnimatedPage>
              </Layout>
            }
          />
          <Route path="/analysis" element={<ScopedRedirect base="analysis" />} />
          <Route
            path="/analysis/:id"
            element={
              <Layout>
                <AnimatedPage>
                  <MatchAnalysis />
                </AnimatedPage>
              </Layout>
            }
          />
          <Route path="/tactical" element={<ScopedRedirect base="tactical" />} />
          <Route
            path="/tactical/:id"
            element={
              <Layout>
                <AnimatedPage>
                  <TacticalBoard />
                </AnimatedPage>
              </Layout>
            }
          />
          <Route path="/chat" element={<ScopedRedirect base="chat" />} />
          <Route
            path="/chat/:id"
            element={
              <Layout>
                <AnimatedPage>
                  <AIChat />
                </AnimatedPage>
              </Layout>
            }
          />
          <Route path="/summary" element={<ScopedRedirect base="summary" />} />
          <Route
            path="/summary/:id"
            element={
              <Layout>
                <AnimatedPage>
                  <MatchSummary />
                </AnimatedPage>
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout>
                <AnimatedPage>
                  <Settings />
                </AnimatedPage>
              </Layout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}
