<div align="center">

# ⚽ GoalVision AI

### *Understand Football Like Never Before*

AI-powered, **explainable** football match analysis — built for the **IBM SkillsBuild AI Challenge**.

Powered by **IBM Granite** on **watsonx.ai**, with a graceful offline mode so the demo never breaks.

</div>

---

## ✨ What it does

GoalVision turns raw match data into *understanding*. Instead of overwhelming fans with numbers or
giving black-box predictions, it **explains football in plain language** — grounded in real match data.

| Feature | Description |
| --- | --- |
| 🧠 **Explainable AI** | Click any goal, card, offside, penalty or substitution → get a clear, plain-language reason. |
| 💬 **Football Chat** | Ask *"Why was this offside?"*, *"Who changed the game?"*, *"Compare both teams"* — answers grounded in the match. |
| 📋 **Tactical Board** | Formations on a live pitch, passing lanes, heat maps and minute-by-minute momentum. |
| 📈 **Win Probability** | Transparent, xG-based probability — the formula is shown, no hidden model. |
| 📝 **AI Match Summary** | Broadcast-quality recap generated in seconds. |
| ⏱️ **Match Timeline** | Every key event, beautifully visualised and interactive. |

Three legendary matches ship with the app: **the 2022 World Cup Final**, **the Miracle of Istanbul (2005)**,
and **Liverpool 4-0 Barcelona (2019)**.

---

## 🏗️ Architecture

```
goalvision-ai/
├── frontend/     React 19 · Vite · TypeScript · Tailwind · Framer Motion · Recharts · Lucide
├── backend/      Node · Express · TypeScript · AIProvider (Granite + Mock)
├── render.yaml   Backend deploy blueprint (Render)
└── README.md
```

### The AIProvider abstraction

The backend depends only on a single `AIProvider` interface:

- **`GraniteProvider`** — calls IBM Granite via the watsonx.ai REST API (with IAM token caching).
- **`MockProvider`** — fully offline; composes analyst-style prose from grounded match facts.

At startup the factory picks **Granite** if `WATSONX_API_KEY` + `WATSONX_PROJECT_ID` are present,
otherwise it transparently falls back to **Mock**. If a live Granite call ever fails, it degrades to
Mock automatically — **the app never shows an error to the user.**

---

## 🚀 Run locally

**Prerequisites:** Node.js 18+ (tested on Node 24).

```bash
# 1) Backend  →  http://localhost:4000
cd backend
npm install
cp .env.example .env      # optional — add watsonx creds to enable live Granite
npm run dev

# 2) Frontend →  http://localhost:5173   (in a second terminal)
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. The Vite dev server proxies `/api` to the backend automatically.

> No IBM credentials? No problem. The app runs end-to-end in **offline demo mode** out of the box.

---

## 🔑 Enabling IBM Granite (watsonx.ai)

Add these to `backend/.env`:

```env
WATSONX_API_KEY=your_ibm_cloud_api_key
WATSONX_PROJECT_ID=your_watsonx_project_id
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_MODEL_ID=ibm/granite-3-8b-instruct
```

Restart the backend — the console will log `IBM Granite enabled`. The badge in the app switches to
**IBM Granite**. Check live status any time at `GET /api/ai-status`.

---

## ☁️ Deployment

### Backend → Render
1. Push this repo to GitHub.
2. In Render: **New + → Blueprint**, select the repo. `render.yaml` configures everything.
3. Set `CORS_ORIGIN` to your Vercel URL, and (optionally) the `WATSONX_*` secrets.

### Frontend → Vercel
1. In Vercel: **New Project**, import the repo, set **Root Directory** to `frontend`.
2. Add env var `VITE_API_BASE_URL` = your Render backend URL (e.g. `https://goalvision-api.onrender.com`).
3. Deploy. `vercel.json` already handles SPA routing.

---

## 🔌 API Reference

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/ai-status` | Active AI provider (`granite` / `mock`) |
| `GET` | `/api/matches` | List matches |
| `GET` | `/api/matches/:id` | Full match detail |
| `POST` | `/api/explain` | Explain an event `{ matchId, eventId }` |
| `POST` | `/api/chat` | Grounded chat `{ matchId, message }` |
| `POST` | `/api/summary` | AI match summary `{ matchId }` |
| `POST` | `/api/tactical` | Tactical read `{ matchId, side }` |

---

## 🎯 Why it wins

- **Explainability is the hero** — every AI output answers *"why?"*, mapping directly to responsible-AI judging.
- **Real IBM stack** — Granite on watsonx.ai, front and centre.
- **Always-on demo** — offline fallback means it works on conference Wi-Fi, every time.
- **Funded-startup polish** — Apple-inspired dark glassmorphism, premium animations, fully responsive.

<div align="center">

**GoalVision AI** · Understand Football Like Never Before

</div>
