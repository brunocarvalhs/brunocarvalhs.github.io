import { describe, expect, it } from 'vitest';
import { blendRepos, type RawRepo } from './use-github-projects';

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
