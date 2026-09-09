import { useEffect, useState } from 'react';

const GITHUB_USER = 'brunocarvalhs';
const CACHE_KEY = `github-projects-cache:${GITHUB_USER}`;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1h — keeps us well under the 60 req/h unauthenticated rate limit

export interface GithubProject {
  name: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  pushedAt: string;
  topics: string[];
}

export interface RawRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  topics?: string[];
}

interface CacheShape {
  fetchedAt: number;
  projects: GithubProject[];
}

function readCache(): GithubProject[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheShape;
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null;
    return parsed.projects;
  } catch {
    return null;
  }
}

function writeCache(projects: GithubProject[]) {
  try {
    const payload: CacheShape = { fetchedAt: Date.now(), projects };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage unavailable (private mode, quota) — fine, just skip caching
  }
}

function mapRepo(repo: RawRepo): GithubProject {
  return {
    name: repo.name,
    description: repo.description,
    htmlUrl: repo.html_url,
    homepage: repo.homepage,
    language: repo.language,
    stars: repo.stargazers_count,
    pushedAt: repo.pushed_at,
    topics: repo.topics ?? [],
  };
}

/**
 * Blends "most recently pushed" and "most starred" repos into one deduped
 * list, capped at `limit`, interleaving the two rankings so both signals
 * are represented rather than one dominating (e.g. an old repo with lots of
 * stars wouldn't otherwise leave room for anything recent). Forks and
 * archived repos should already be filtered out of `repos` before calling
 * this — it doesn't re-check those flags itself.
 */
export function blendRepos(repos: RawRepo[], limit: number): RawRepo[] {
  const byRecent = [...repos].sort(
    (a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
  );
  const byPopular = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count);

  const seen = new Set<string>();
  const blended: RawRepo[] = [];
  for (let i = 0; i < repos.length && blended.length < limit; i++) {
    for (const repo of [byRecent[i], byPopular[i]]) {
      if (repo && !seen.has(repo.name) && blended.length < limit) {
        seen.add(repo.name);
        blended.push(repo);
      }
    }
  }
  return blended;
}

/**
 * Public repos for `brunocarvalhs`, blending "recently pushed" and "most
 * starred" into one deduped list — no auth needed (unauthenticated GitHub
 * REST API, 60 req/h/IP), cached in localStorage for an hour so a page
 * reload doesn't re-fetch. On any failure (offline, rate-limited) `error`
 * is set and `projects` stays empty — callers should fall back to static
 * content rather than show a broken section.
 */
export function useGithubProjects(limit = 6) {
  const [projects, setProjects] = useState<GithubProject[]>(() => readCache() ?? []);
  const [loading, setLoading] = useState(projects.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (readCache()) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=owner`,
          { signal: controller.signal, headers: { Accept: 'application/vnd.github+json' } }
        );
        if (!res.ok) throw new Error(`GitHub API respondeu ${res.status}`);
        const raw = (await res.json()) as RawRepo[];

        const eligible = raw.filter((r) => !r.fork && !r.archived);
        const blended = blendRepos(eligible, limit);
        const result = blended.map(mapRepo);
        setProjects(result);
        writeCache(result);
        setError(null);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [limit]);

  return { projects, loading, error };
}
