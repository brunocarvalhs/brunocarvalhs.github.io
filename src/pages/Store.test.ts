import { describe, expect, it } from 'vitest';
import { appLinks, filterApps, linkKind, listCategories } from './Store';
import { GithubProject } from '@/hooks/use-github-projects';

const app = (over: Partial<GithubProject>): GithubProject => ({
  name: 'x',
  description: null,
  htmlUrl: 'https://github.com/brunocarvalhs/x',
  homepage: null,
  language: null,
  stars: 0,
  pushedAt: '2026-01-01T00:00:00Z',
  topics: [],
  ...over,
});

describe('linkKind', () => {
  it('classifies Play Store, GitHub Pages and other sites', () => {
    expect(linkKind('https://play.google.com/store/apps/details?id=a')).toBe('play');
    expect(linkKind('https://brunocarvalhs.github.io/Revise')).toBe('demo');
    expect(linkKind('https://example.com')).toBe('site');
    expect(linkKind('not a url')).toBe('site');
  });
});

describe('appLinks', () => {
  it('merges curated Play Store link with homepage, Play first, deduped', () => {
    const a = app({ htmlUrl: 'https://github.com/brunocarvalhs/FriendsSecrets', homepage: 'https://brunocarvalhs.github.io/FriendsSecrets' });
    const curated = new Map([['https://github.com/brunocarvalhs/friendssecrets', 'https://play.google.com/store/apps/details?id=f']]);
    expect(appLinks(a, curated).map((l) => l.kind)).toEqual(['play', 'demo']);
    expect(appLinks(app({ homepage: 'https://x.com/' }), new Map([['https://github.com/brunocarvalhs/x', 'https://x.com']]))).toHaveLength(1);
    expect(appLinks(app({}), new Map())).toEqual([]);
  });
});

describe('filterApps / listCategories', () => {
  const apps = [
    app({ name: 'Paguei', language: 'Kotlin', description: 'Organiza boletos' }),
    app({ name: 'Revise', language: 'JavaScript', topics: ['veículos'] }),
    app({ name: 'FriendsSecrets', language: 'Kotlin' }),
  ];
  it('filters by accent-insensitive query and by language', () => {
    expect(filterApps(apps, 'VEICULOS', null).map((a) => a.name)).toEqual(['Revise']);
    expect(filterApps(apps, 'boleto', 'Kotlin').map((a) => a.name)).toEqual(['Paguei']);
    expect(filterApps(apps, '', 'Kotlin')).toHaveLength(2);
  });
  it('orders categories by frequency', () => {
    expect(listCategories(apps)).toEqual(['Kotlin', 'JavaScript']);
  });
});
