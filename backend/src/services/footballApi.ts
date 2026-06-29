import axios from "axios";
import type { AxiosInstance } from "axios";
import { matches as demoMatches, getMatch as getDemoMatch } from "../data/matches.js";

const BASE = "https://api-football186.p.rapidapi.com";
const CACHE_TTL = 30_000;

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, expiry: Date.now() + CACHE_TTL });
}

function createClient(): AxiosInstance {
  const key = process.env.RAPIDAPI_KEY ?? "";
  const host = process.env.RAPIDAPI_HOST ?? "api-football186.p.rapidapi.com";
  return axios.create({
    baseURL: BASE,
    headers: {
      "x-rapidapi-key": key,
      "x-rapidapi-host": host,
      "Content-Type": "application/json"
    },
    timeout: 8000
  });
}

let client: AxiosInstance | null = null;

function getClient(): AxiosInstance {
  if (!client) client = createClient();
  return client;
}

function isApiConfigured(): boolean {
  return !!(process.env.RAPIDAPI_KEY && process.env.RAPIDAPI_HOST);
}

function mapStatus(short: string): "live" | "FT" | "AET" | "PEN" {
  switch (short) {
    case "FT":
    case "AET":
      return short;
    case "PEN":
      return "PEN";
    case "LIVE":
    case "1H":
    case "2H":
    case "HT":
    case "ET":
    case "BT":
    case "INT":
      return "live";
    default:
      return "live";
  }
}

function buildHeadline(home: string, away: string): string {
  return `${home} face ${away} in this matchup`;
}

function buildResult(home: number | null, away: number | null): string {
  if (home === null || away === null) return "Kick-off soon";
  return `${home}-${away}`;
}

function buildShortName(name: string): string {
  const parts = name.split(" ");
  if (parts.length === 1) return name.substring(0, 3).toUpperCase();
  return parts.map((p) => p[0]).join("").substring(0, 3).toUpperCase();
}

const TEAM_COLORS: Record<string, string> = {
  "Manchester City": "#6CABDD",
  "Manchester Utd": "#DA291C",
  "Liverpool": "#C8102E",
  "Arsenal": "#EF0107",
  "Chelsea": "#034694",
  "Tottenham": "#132257",
  "Barcelona": "#A50044",
  "Real Madrid": "#FEBE10",
  "Atlético Madrid": "#CB3524",
  "Bayern Munich": "#DC052D",
  "Borussia Dortmund": "#FDE100",
  "Paris Saint Germain": "#004170",
  "Marseille": "#2FAEE0",
  "Juventus": "#000000",
  "AC Milan": "#FB090B",
  "Inter Milan": "#0069B5",
  "Napoli": "#12A0D6",
  "Roma": "#8E1F2F",
  "Ajax": "#D31245",
  "PSV": "#E10000",
  "Feyenoord": "#C8102E",
  "Benfica": "#E2001A",
  "Porto": "#0051A0",
  "Sporting CP": "#008000",
  "Celtic": "#00985F",
  "Rangers": "#0032A0",
  "Fluminense": "#760B0B",
  "Flamengo": "#E80000",
  "Palmeiras": "#006437",
  "Santos": "#000000",
  "São Paulo": "#C0C0C0",
  "River Plate": "#E50000",
  "Boca Juniors": "#F5D00E",
  "Argentina": "#6CACE4",
  "Brazil": "#FEDF00",
  "France": "#1A2A6C",
  "Germany": "#000000",
  "Spain": "#C60B1E",
  "Italy": "#008FD7",
  "Portugal": "#006600",
  "Netherlands": "#FF6600",
  "England": "#FFFFFF",
  "Belgium": "#E00000",
  "Croatia": "#C8102E",
  "Uruguay": "#003DA5",
  "Colombia": "#FCD116",
  "Chile": "#003DA5",
  "Japan": "#000066",
  "South Korea": "#E60000",
  "USA": "#003DA5",
  "Mexico": "#006847",
  "Nigeria": "#008751",
  "Cameroon": "#007A5E",
  "Ghana": "#CA0000",
  "Ivory Coast": "#F77F00",
  "Senegal": "#00853F",
  "Morocco": "#C1272D",
  "Algeria": "#006B3F",
  "Tunisia": "#E70013",
  "Egypt": "#CE1126",
  "South Africa": "#007A4D",
  "Australia": "#FCD116",
  "Saudi Arabia": "#006C35",
  "Iran": "#239F40",
  "Qatar": "#8C1B1D",
  "United Arab Emirates": "#00732F",
  "China": "#EE1C25",
  "India": "#FF9933",
  "Wales": "#C8102E",
  "Scotland": "#005EB8",
  "Poland": "#DC143C",
  "Sweden": "#FECC02",
  "Denmark": "#C8102E",
  "Norway": "#C8102E",
  "Switzerland": "#DA291C",
  "Austria": "#ED2939",
  "Czech Republic": "#11457E",
  "Turkey": "#E30A17",
  "Greece": "#0D5EAF",
  "Russia": "#0039A6",
  "Ukraine": "#005BBB",
  "Serbia": "#C6363C",
};

function getTeamColor(name: string): string {
  return TEAM_COLORS[name] ?? "#666666";
}

function mapFixture(f: Record<string, unknown>) {
  const fixture = f.fixture as Record<string, unknown>;
  const league = f.league as Record<string, unknown>;
  const teams = f.teams as Record<string, unknown>;
  const homeTeam = teams.home as Record<string, unknown>;
  const awayTeam = teams.away as Record<string, unknown>;
  const goals = f.goals as Record<string, unknown>;
  const score = f.score as Record<string, unknown>;
  const status = fixture.status as Record<string, unknown>;
  const venue = (fixture.venue ?? {}) as Record<string, unknown>;

  const homeName = (homeTeam.name ?? "Home") as string;
  const awayName = (awayTeam.name ?? "Away") as string;
  const statusShort = (status.short ?? "NS") as string;
  const homeGoals = goals.home as number | null;
  const awayGoals = goals.away as number | null;
  const halftimeScore = (score.halftime ?? {}) as Record<string, unknown>;

  return {
    id: String(fixture.id),
    competition: (league.name ?? "Unknown") as string,
    stage: (league.round ?? "") as string,
    date: (fixture.date ?? new Date().toISOString()) as string,
    venue: (venue.name ?? "") as string,
    city: (venue.city ?? "") as string,
    status: mapStatus(statusShort),
    result: buildResult(homeGoals, awayGoals),
    headline: buildHeadline(homeName, awayName),
    score: {
      home: homeGoals ?? 0,
      away: awayGoals ?? 0,
      halfTime: [
        (halftimeScore.home as number) ?? 0,
        (halftimeScore.away as number) ?? 0
      ] as [number, number]
    },
    homeTeam: {
      name: homeName,
      shortName: (homeTeam.code as string) ?? buildShortName(homeName),
      color: getTeamColor(homeName),
      logo: (homeTeam.logo as string) ?? ""
    },
    awayTeam: {
      name: awayName,
      shortName: (awayTeam.code as string) ?? buildShortName(awayName),
      color: getTeamColor(awayName),
      logo: (awayTeam.logo as string) ?? ""
    },
    elapsed: (status.elapsed as number) ?? undefined
  };
}

async function fetchLiveMatchesFromApi() {
  const res = await getClient().get("/fixtures", { params: { live: "all" } });
  const data = res.data as { response: Record<string, unknown>[] };
  return (data.response ?? []).map(mapFixture);
}

async function fetchFixturesFromApi(date?: string) {
  const params: Record<string, string> = {};
  if (date) params.date = date;
  const res = await getClient().get("/fixtures", { params });
  const data = res.data as { response: Record<string, unknown>[] };
  return (data.response ?? []).map(mapFixture);
}

async function fetchMatchFromApi(id: string) {
  const res = await getClient().get("/fixture", { params: { id } });
  const data = res.data as { response: Record<string, unknown>[] };
  const fixture = (data.response ?? [])[0];
  if (!fixture) return null;
  return mapFixture(fixture);
}

async function fetchStandingsFromApi(league: string) {
  const res = await getClient().get("/standings", { params: { league, season: new Date().getFullYear() } });
  const data = res.data as { response: Record<string, unknown>[] };
  return data.response ?? [];
}

async function fetchTeamFromApi(id: string) {
  const res = await getClient().get("/team", { params: { id } });
  const data = res.data as { response: Record<string, unknown>[] };
  return (data.response ?? [])[0] ?? null;
}

async function fetchPlayerFromApi(id: string) {
  const res = await getClient().get("/player", { params: { id } });
  const data = res.data as { response: Record<string, unknown>[] };
  return (data.response ?? [])[0] ?? null;
}

export const footballApi = {
  async getLiveMatches() {
    const cacheKey = "live";
    const cached = getCached<ReturnType<typeof mapFixture>[]>(cacheKey);
    if (cached) return cached;

    if (!isApiConfigured()) {
      const live = demoMatches.filter((m) => m.status === "live");
      return live.map((m) => ({
        id: m.id,
        competition: m.competition,
        stage: m.stage,
        date: m.date,
        venue: m.venue,
        city: m.city,
        status: m.status,
        result: m.result,
        headline: m.headline,
        score: m.score,
        homeTeam: { name: m.homeTeam.name, shortName: m.homeTeam.shortName, color: m.homeTeam.color, logo: "" },
        awayTeam: { name: m.awayTeam.name, shortName: m.awayTeam.shortName, color: m.awayTeam.color, logo: "" }
      }));
    }

    try {
      const fixtures = await fetchLiveMatchesFromApi();
      setCache(cacheKey, fixtures);
      return fixtures;
    } catch {
      const live = demoMatches.filter((m) => m.status === "live");
      return live.map((m) => ({
        id: m.id,
        competition: m.competition,
        stage: m.stage,
        date: m.date,
        venue: m.venue,
        city: m.city,
        status: m.status,
        result: m.result,
        headline: m.headline,
        score: m.score,
        homeTeam: { name: m.homeTeam.name, shortName: m.homeTeam.shortName, color: m.homeTeam.color, logo: "" },
        awayTeam: { name: m.awayTeam.name, shortName: m.awayTeam.shortName, color: m.awayTeam.color, logo: "" }
      }));
    }
  },

  async getFixtures(date?: string) {
    const cacheKey = `fixtures:${date ?? "today"}`;
    const cached = getCached<ReturnType<typeof mapFixture>[]>(cacheKey);
    if (cached) return cached;

    if (!isApiConfigured()) {
      return [];
    }

    try {
      const fixtures = await fetchFixturesFromApi(date);
      setCache(cacheKey, fixtures);
      return fixtures;
    } catch {
      return [];
    }
  },

  async getMatch(id: string) {
    const cacheKey = `match:${id}`;
    const cached = getCached<ReturnType<typeof mapFixture>>(cacheKey);
    if (cached) return cached;

    if (!isApiConfigured()) {
      const demo = getDemoMatch(id);
      if (!demo) return null;
      return {
        id: demo.id,
        competition: demo.competition,
        stage: demo.stage,
        date: demo.date,
        venue: demo.venue,
        city: demo.city,
        status: demo.status,
        result: demo.result,
        headline: demo.headline,
        score: demo.score,
        homeTeam: { name: demo.homeTeam.name, shortName: demo.homeTeam.shortName, color: demo.homeTeam.color, logo: "" },
        awayTeam: { name: demo.awayTeam.name, shortName: demo.awayTeam.shortName, color: demo.awayTeam.color, logo: "" }
      };
    }

    try {
      const match = await fetchMatchFromApi(id);
      if (match) setCache(cacheKey, match);
      return match;
    } catch {
      const demo = getDemoMatch(id);
      if (!demo) return null;
      return {
        id: demo.id,
        competition: demo.competition,
        stage: demo.stage,
        date: demo.date,
        venue: demo.venue,
        city: demo.city,
        status: demo.status,
        result: demo.result,
        headline: demo.headline,
        score: demo.score,
        homeTeam: { name: demo.homeTeam.name, shortName: demo.homeTeam.shortName, color: demo.homeTeam.color, logo: "" },
        awayTeam: { name: demo.awayTeam.name, shortName: demo.awayTeam.shortName, color: demo.awayTeam.color, logo: "" }
      };
    }
  },

  async getStandings(league: string) {
    const cacheKey = `standings:${league}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    if (!isApiConfigured()) {
      return [];
    }

    try {
      const standings = await fetchStandingsFromApi(league);
      setCache(cacheKey, standings);
      return standings;
    } catch {
      return [];
    }
  },

  async getTeam(id: string) {
    const cacheKey = `team:${id}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    if (!isApiConfigured()) {
      return null;
    }

    try {
      const team = await fetchTeamFromApi(id);
      if (team) setCache(cacheKey, team);
      return team;
    } catch {
      return null;
    }
  },

  async getPlayer(id: string) {
    const cacheKey = `player:${id}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    if (!isApiConfigured()) {
      return null;
    }

    try {
      const player = await fetchPlayerFromApi(id);
      if (player) setCache(cacheKey, player);
      return player;
    } catch {
      return null;
    }
  }
};
