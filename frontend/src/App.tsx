import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { useMatches } from "./context/MatchContext";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import MatchAnalysis from "./pages/MatchAnalysis";
import TacticalBoard from "./pages/TacticalBoard";
import AIChat from "./pages/AIChat";
import MatchSummary from "./pages/MatchSummary";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

/** Redirect a bare scoped route (e.g. /analysis) to the currently selected match. */
function ScopedRedirect({ base }: { base: string }) {
  const { selectedId, loading } = useMatches();
  if (loading) return null;
  if (!selectedId) return <Navigate to="/dashboard" replace />;
  return <Navigate to={`/${base}/${selectedId}`} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
      <Route path="/analysis" element={<ScopedRedirect base="analysis" />} />
      <Route
        path="/analysis/:id"
        element={
          <Layout>
            <MatchAnalysis />
          </Layout>
        }
      />
      <Route path="/tactical" element={<ScopedRedirect base="tactical" />} />
      <Route
        path="/tactical/:id"
        element={
          <Layout>
            <TacticalBoard />
          </Layout>
        }
      />
      <Route path="/chat" element={<ScopedRedirect base="chat" />} />
      <Route
        path="/chat/:id"
        element={
          <Layout>
            <AIChat />
          </Layout>
        }
      />
      <Route path="/summary" element={<ScopedRedirect base="summary" />} />
      <Route
        path="/summary/:id"
        element={
          <Layout>
            <MatchSummary />
          </Layout>
        }
      />
      <Route
        path="/settings"
        element={
          <Layout>
            <Settings />
          </Layout>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
