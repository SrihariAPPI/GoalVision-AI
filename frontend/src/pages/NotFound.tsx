import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mb-6"
      >
        <span className="text-[120px] font-black leading-none gradient-text sm:text-[180px]">404</span>
        <span className="absolute left-1/2 top-1/2 -z-10 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pitch-500/20 blur-3xl" />
      </motion.div>
      <h1 className="text-2xl font-bold">Off the pitch</h1>
      <p className="mt-2 max-w-sm text-slate-400">
        This page has wandered offside. Let's get you back to the action.
      </p>
      <Link to="/" className="mt-6">
        <Button size="lg">
          <Home className="h-5 w-5" /> Back to GoalVision
        </Button>
      </Link>
    </div>
  );
}
