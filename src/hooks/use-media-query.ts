import { useEffect, useState } from 'react';

/**
 * Tracks whether a media query currently matches. Safe to read synchronously
 * on first render here: this app is a pure client-rendered Vite SPA with no
 * server-rendered markup to hydrate against, so there's no mismatch/flash
 * risk in seeding the initial state from `window.matchMedia`.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
