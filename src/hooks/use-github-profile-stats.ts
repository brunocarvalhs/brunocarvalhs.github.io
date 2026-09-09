import { useEffect, useState } from 'react';

const GITHUB_USER = 'brunocarvalhs';
const CACHE_KEY = `github-profile-stats-cache:${GITHUB_USER}`;
const CACHE_TTL_MS = 60 * 60 * 1000;

export interface GithubProfileStats {
  publicRepos: number;
  followers: number;
  totalStars: number;
  topLanguage: string | null;
  createdAt: string;
}

interface CacheShape {
  fetchedAt: number;
  stats: GithubProfileStats;
}

function readCache(): GithubProfileStats | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheShape;
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null;
    return parsed.stats;
  } catch {
    return null;
  }
}

function writeCache(stats: GithubProfileStats) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), stats }));
  } catch {
    // ignore — caching is a nice-to-have, not required for correctness
  }
}

/** Aggregate profile stats (repo/follower counts, total stars, top language)
 * from the public GitHub REST API — same no-auth, cached approach as
 * `use-github-projects`. */
export function useGithubProfileStats() {
  const [stats, setStats] = useState<GithubProfileStats | null>(() => readCache());
  const [loading, setLoading] = useState(stats === null);

  useEffect(() => {
    if (readCache()) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USER}`, { signal: controller.signal }),
          fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=owner`, {
            signal: controller.signal,
          }),
        ]);
        if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API request failed');

        const user = await userRes.json();
        const repos: { fork: boolean; stargazers_count: number; language: string | null }[] =
          await reposRes.json();

        const eligible = repos.filter((r) => !r.fork);
        const totalStars = eligible.reduce((sum, r) => sum + r.stargazers_count, 0);

        const languageCounts = new Map<string, number>();
        eligible.forEach((r) => {
          if (!r.language) return;
          languageCounts.set(r.language, (languageCounts.get(r.language) ?? 0) + 1);
        });
        const topLanguage =
          [...languageCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

        const result: GithubProfileStats = {
          publicRepos: user.public_repos,
          followers: user.followers,
          totalStars,
          topLanguage,
          createdAt: user.created_at,
        };
        setStats(result);
        writeCache(result);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        // Leave `stats` as-is (null, or last cached value) — callers should
        // hide the stat row rather than show a broken dashboard tile.
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  return { stats, loading };
}
