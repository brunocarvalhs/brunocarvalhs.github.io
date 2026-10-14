import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Store, { appLinks, filterApps, linkKind, listCategories } from './Store';
import { GithubProject, useGithubProjects } from '@/hooks/use-github-projects';
import { LanguageProvider } from '@/contexts/LanguageContext';

vi.mock('@/hooks/use-github-projects', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/hooks/use-github-projects')>()),
  useGithubProjects: vi.fn(),
}));
const mockedHook = vi.mocked(useGithubProjects);

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

describe('<Store />', () => {
  const repos = [
    app({ name: 'FriendsSecrets', language: 'Kotlin', stars: 9, htmlUrl: 'https://github.com/brunocarvalhs/FriendsSecrets' }),
    app({ name: 'Revise', language: 'JavaScript', stars: 3, homepage: 'https://brunocarvalhs.github.io/Revise' }),
    app({ name: 'Paguei', language: 'Kotlin', stars: 1, description: 'Organiza boletos' }),
    app({ name: 'Tiny', language: 'Dart', stars: 0 }),
  ];
  const renderStore = () =>
    render(
      <LanguageProvider>
        <Store />
      </LanguageProvider>
    );

  beforeEach(() => {
    localStorage.setItem('language', 'pt-BR');
    mockedHook.mockReturnValue({ projects: repos, loading: false, error: null });
  });

  it('shows featured top 3 by stars and the full list', () => {
    renderStore();
    const featured = screen.getByRole('region', { name: 'Destaques' });
    expect(within(featured).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'FriendsSecrets',
      'Revise',
      'Paguei',
    ]);
    expect(within(screen.getByRole('region', { name: /Todos os projetos/ })).getAllByRole('listitem')).toHaveLength(4);
  });

  it('links curated Play Store and GitHub Pages demo', () => {
    renderStore();
    const list = screen.getByRole('list');
    expect(within(list).getByRole('link', { name: 'Google Play: FriendsSecrets' })).toHaveAttribute(
      'href',
      'https://play.google.com/store/apps/details?id=br.com.brunocarvalhs.friendssecrets'
    );
    expect(within(list).getByRole('link', { name: 'Demo: Revise' })).toHaveAttribute('href', 'https://brunocarvalhs.github.io/Revise');
    expect(within(list).getByRole('link', { name: 'Código: Tiny' })).toBeInTheDocument();
  });

  it('filters by search and category, hiding featured while filtering', async () => {
    const user = userEvent.setup();
    renderStore();
    await user.type(screen.getByRole('searchbox'), 'boleto');
    expect(screen.queryByRole('region', { name: 'Destaques' })).not.toBeInTheDocument();
    expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(1);

    await user.clear(screen.getByRole('searchbox'));
    await user.click(screen.getByRole('button', { name: 'Kotlin' }));
    expect(screen.getByRole('button', { name: 'Kotlin' })).toHaveAttribute('aria-pressed', 'true');
    expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(2);

    await user.type(screen.getByRole('searchbox'), 'nada-disso');
    expect(screen.getByText('Nenhum projeto encontrado.')).toBeInTheDocument();
  });

  it('shows skeletons while loading and a GitHub link on error', () => {
    mockedHook.mockReturnValue({ projects: [], loading: true, error: null });
    const { unmount } = renderStore();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    unmount();

    mockedHook.mockReturnValue({ projects: [], loading: false, error: 'boom' });
    renderStore();
    expect(screen.getByRole('link', { name: 'Ver no GitHub' })).toHaveAttribute('href', 'https://github.com/brunocarvalhs');
  });
});
