import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { blendRepos, mapRepo, useGithubProjects, type RawRepo } from './use-github-projects';

function repo(overrides: Partial<RawRepo>): RawRepo {
  return {
    name: 'repo',
    description: null,
    html_url: 'https://github.com/brunocarvalhs/repo',
    homepage: null,
    language: null,
    stargazers_count: 0,
    pushed_at: '2024-01-01T00:00:00Z',
    fork: false,
    archived: false,
    topics: [],
    ...overrides,
  };
}

describe('blendRepos', () => {
  it('never returns more than `limit` repos', () => {
    const repos = Array.from({ length: 20 }, (_, i) =>
      repo({ name: `repo-${i}`, pushed_at: `2024-01-${(i % 28) + 1}T00:00:00Z`, stargazers_count: i })
    );
    expect(blendRepos(repos, 6)).toHaveLength(6);
  });

  it('never returns duplicates even when a repo is both recent and popular', () => {
    const repos = [
      repo({ name: 'best', pushed_at: '2024-06-01T00:00:00Z', stargazers_count: 100 }),
      repo({ name: 'second', pushed_at: '2024-05-01T00:00:00Z', stargazers_count: 1 }),
      repo({ name: 'third', pushed_at: '2024-01-01T00:00:00Z', stargazers_count: 50 }),
    ];
    const blended = blendRepos(repos, 3);
    const names = blended.map((r) => r.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('represents both the most recent and the most popular repo when they differ', () => {
    const mostRecent = repo({ name: 'recent', pushed_at: '2024-06-01T00:00:00Z', stargazers_count: 0 });
    const mostPopular = repo({ name: 'popular', pushed_at: '2020-01-01T00:00:00Z', stargazers_count: 999 });
    const filler = Array.from({ length: 5 }, (_, i) =>
      repo({ name: `filler-${i}`, pushed_at: '2022-01-01T00:00:00Z', stargazers_count: 5 })
    );

    const blended = blendRepos([mostPopular, ...filler, mostRecent], 3);
    const names = blended.map((r) => r.name);
    expect(names).toContain('recent');
    expect(names).toContain('popular');
  });

  it('returns everything when there are fewer repos than the limit', () => {
    const repos = [repo({ name: 'only-one' })];
    expect(blendRepos(repos, 6)).toHaveLength(1);
  });

  it('returns an empty list for an empty input', () => {
    expect(blendRepos([], 6)).toEqual([]);
  });
});

describe('mapRepo', () => {
  it('falls back to the GitHub Pages URL when homepage is empty and Pages is on', () => {
    expect(mapRepo(repo({ name: 'bem-ti-click', has_pages: true })).homepage).toBe(
      'https://brunocarvalhs.github.io/bem-ti-click'
    );
  });

  it('prefers an explicit homepage over the Pages URL', () => {
    expect(mapRepo(repo({ homepage: 'https://example.com', has_pages: true })).homepage).toBe('https://example.com');
  });

  it('has no demo when there is neither homepage nor Pages', () => {
    expect(mapRepo(repo({})).homepage).toBeNull();
  });
});

describe('useGithubProjects', () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
  });
  const ok = (body: RawRepo[]) => ({ ok: true, status: 200, json: async () => body });

  it('drops forks/archived, maps repos and caches per limit', async () => {
    fetchMock.mockResolvedValue(
      ok([repo({ name: 'a', stargazers_count: 2 }), repo({ name: 'fork', fork: true }), repo({ name: 'old', archived: true })])
    );
    const { result } = renderHook(() => useGithubProjects(6));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.projects.map((p) => p.name)).toEqual(['a']);
    expect(result.current.error).toBeNull();

    // same limit → served from cache, no new request
    const again = renderHook(() => useGithubProjects(6));
    expect(again.result.current.projects.map((p) => p.name)).toEqual(['a']);
    expect(again.result.current.loading).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // different limit → its own cache entry, fetches again
    renderHook(() => useGithubProjects(100));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });

  it('ignores an expired cache', async () => {
    localStorage.setItem(
      'github-projects-cache:brunocarvalhs:6',
      JSON.stringify({ fetchedAt: Date.now() - 2 * 60 * 60 * 1000, projects: [mapRepo(repo({ name: 'stale' }))] })
    );
    fetchMock.mockResolvedValue(ok([repo({ name: 'fresh' })]));
    const { result } = renderHook(() => useGithubProjects(6));
    await waitFor(() => expect(result.current.projects.map((p) => p.name)).toEqual(['fresh']));
  });

  it('sets error and keeps projects empty when GitHub fails', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 403, json: async () => [] });
    const { result } = renderHook(() => useGithubProjects(6));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toMatch(/403/);
    expect(result.current.projects).toEqual([]);
  });
});
