import { useEffect, useState } from "react";
import type { Match } from "../types";
import { api } from "../lib/api";

export function useMatch(id: string | undefined) {
  const [match, setMatch] = useState<Match | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    api.getMatch(id).then((m) => {
      if (!active) return;
      setMatch(m);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id]);

  return { match, loading };
}
