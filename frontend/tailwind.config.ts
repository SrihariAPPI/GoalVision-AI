import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05070d",
          900: "#0a0e1a",
          800: "#111729",
          700: "#1a2238"
        },
        pitch: {
          400: "#34d399",
          500: "#10b981",
          600: "#059669"
        },
        electric: {
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb"
        },
        grape: {
          400: "#a78bfa",
          500: "#8b5cf6"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(16, 185, 129, 0.45)",
        "glow-blue": "0 0 40px -10px rgba(59, 130, 246, 0.45)",
        card: "0 8px 40px -12px rgba(0, 0, 0, 0.6)"
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 50% 0%, rgba(16,185,129,0.12), transparent 60%), radial-gradient(circle at 100% 100%, rgba(59,130,246,0.10), transparent 50%)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" }
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.7" },
          "100%": { transform: "scale(2.2)", opacity: "0" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        shimmer: "shimmer 1.6s infinite",
        "pulse-ring": "pulse-ring 1.8s ease-out infinite"
      }
    }
  },
  plugins: []
} satisfies Config;
