import React, { useMemo, useState } from 'react';
import { ExternalLink, Github, Play, Search, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { PALETTES, hashString, pickIcon } from '@/components/ProjectThumbnail';
import { GithubProject, useGithubProjects } from '@/hooks/use-github-projects';
import { useStrings } from '@/i18n/strings';
import { usePortfolioData } from '@/hooks/use-portfolio-data';

const GITHUB_PROFILE = 'https://github.com/brunocarvalhs';
const FEATURED_COUNT = 3;

/** Distinct languages, most common first — the store's category chips. */
export function listCategories(apps: GithubProject[]): string[] {
  const counts = new Map<string, number>();
  for (const app of apps) if (app.language) counts.set(app.language, (counts.get(app.language) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([lang]) => lang);
}

/** Case/accent-insensitive search over name, description and topics, plus an optional language filter. */
export function filterApps(apps: GithubProject[], query: string, category: string | null): GithubProject[] {
  const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const q = norm(query.trim());
  return apps.filter(
    (app) =>
      (!category || app.language === category) &&
      (!q || norm([app.name, app.description ?? '', ...app.topics].join(' ')).includes(q))
  );
}

const techOf = (app: GithubProject) => [app.language, ...app.topics].filter(Boolean) as string[];

const AppIcon = ({ app, size }: { app: GithubProject; size: 'sm' | 'lg' }) => {
  const [from, to] = PALETTES[hashString(app.name) % PALETTES.length];
  const Icon = pickIcon(techOf(app));
  const box = size === 'lg' ? 'h-20 w-20 rounded-3xl' : 'h-16 w-16 rounded-2xl';
  return (
    <div className={`flex shrink-0 items-center justify-center bg-gradient-to-br shadow-md ${from} ${to} ${box}`}>
      <Icon className={size === 'lg' ? 'h-10 w-10 text-white' : 'h-8 w-8 text-white'} strokeWidth={1.5} aria-hidden="true" />
    </div>
  );
};

const Stars = ({ count }: { count: number }) => (
  <span className="inline-flex items-center gap-1 tabular-nums">
    {count}
    <Star className="h-3 w-3 fill-current text-amber-500" aria-hidden="true" />
  </span>
);

export type LinkKind = 'play' | 'demo' | 'site';
export type AppLink = { kind: LinkKind; url: string };

export function linkKind(url: string): LinkKind {
  const host = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return '';
    }
  })();
  if (host === 'play.google.com') return 'play';
  if (host.endsWith('.github.io')) return 'demo';
  return 'site';
}

/**
 * Every way to reach a project outside GitHub: the curated `live` link from
 * portfolio.json (usually the Play Store, which repos rarely set as homepage)
 * plus the repo's own homepage / GitHub Pages — deduped, Play Store first.
 * `curated` maps lowercased GitHub URL → live URL.
 */
export function appLinks(app: GithubProject, curated: Map<string, string>): AppLink[] {
  const urls = [curated.get(app.htmlUrl.toLowerCase()), app.homepage].filter(Boolean) as string[];
  const order: LinkKind[] = ['play', 'site', 'demo'];
  return [...new Set(urls.map((u) => u.replace(/\/$/, '')))]
    .map((url) => ({ kind: linkKind(url), url }))
    .sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind));
}

const LinkButtons = ({ app, links, variant }: { app: GithubProject; links: AppLink[]; variant: 'card' | 'banner' }) => {
  const t = useStrings();
  const label: Record<LinkKind, string> = { play: t.store.playStore, site: t.store.site, demo: t.store.demo };
  const primary =
    variant === 'banner'
      ? 'bg-white text-gray-900 hover:bg-white/90'
      : 'bg-blue-600 text-white hover:bg-blue-500';
  const secondary =
    variant === 'banner'
      ? 'border border-white/60 text-white hover:bg-white/10'
      : 'border border-gray-300 text-gray-900 hover:bg-gray-100 dark:border-white/15 dark:text-white dark:hover:bg-white/10';
  const base = 'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors';

  return (
    <div className="flex flex-wrap items-center gap-2">
      {links.map((link, i) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} ${i === 0 ? primary : secondary}`}
          aria-label={`${label[link.kind]}: ${app.name}`}
        >
          {link.kind === 'play' ? <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" /> : <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />}
          {label[link.kind]}
        </a>
      ))}
      <a
        href={app.htmlUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${links.length === 0 ? primary : secondary}`}
        aria-label={`${t.store.codeButton}: ${app.name}`}
      >
        <Github className="h-3.5 w-3.5" aria-hidden="true" />
        {t.store.codeButton}
      </a>
    </div>
  );
};

const Store = () => {
  const t = useStrings();
  const { projects, loading, error } = useGithubProjects(100);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const { projects: curatedProjects } = usePortfolioData();
  const curated = useMemo(
    () => new Map(curatedProjects.items.filter((p) => p.live).map((p) => [p.github.toLowerCase(), p.live as string])),
    [curatedProjects]
  );

  const categories = useMemo(() => listCategories(projects), [projects]);
  const results = useMemo(() => filterApps(projects, query, category), [projects, query, category]);
  const featured = useMemo(
    () => [...projects].sort((a, b) => b.stars - a.stars).slice(0, FEATURED_COUNT),
    [projects]
  );
  const browsing = !query && !category;

  const chip = (active: boolean) =>
    `shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
      active
        ? 'border-blue-600 bg-blue-600 text-white'
        : 'border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-white/15 dark:text-neutral-300 dark:hover:bg-white/10'
    }`;

  return (
    <main className="min-h-screen bg-white pb-20 pt-28 dark:bg-black">
      <div className="container mx-auto px-4 sm:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">{t.store.title}</h1>
          <p className="mt-2 text-gray-600 dark:text-neutral-400">{t.store.subtitle}</p>
        </header>

        <div className="relative mb-4 max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.store.searchPlaceholder}
            aria-label={t.store.searchPlaceholder}
            className="h-12 rounded-full pl-11"
          />
        </div>

        {categories.length > 0 && (
          <div className="-mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0" role="group">
            <button type="button" className={chip(!category)} aria-pressed={!category} onClick={() => setCategory(null)}>
              {t.store.allCategories}
            </button>
            {categories.map((lang) => (
              <button
                key={lang}
                type="button"
                className={chip(category === lang)}
                aria-pressed={category === lang}
                onClick={() => setCategory(category === lang ? null : lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        )}

        {!loading && error && projects.length === 0 && (
          <div className="rounded-2xl border border-gray-200 p-8 text-center dark:border-white/10">
            <p className="mb-4 text-gray-600 dark:text-neutral-400">{t.store.error}</p>
            <a href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline dark:text-blue-400">
              {t.store.errorLink}
            </a>
          </div>
        )}

        {!loading && projects.length > 0 && (
          <>
            {browsing && (
              <section className="mb-12" aria-labelledby="store-featured">
                <h2 id="store-featured" className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  {t.store.featured}
                </h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {featured.map((app) => {
                    const [from, to] = PALETTES[hashString(app.name) % PALETTES.length];
                    return (
                      <article
                        key={app.name}
                        className={`relative flex flex-col justify-between gap-6 overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white ${from} ${to}`}
                      >
                        <div className="bg-grid absolute inset-0 opacity-20" />
                        <div className="relative flex items-center gap-4">
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                            {React.createElement(pickIcon(techOf(app)), { className: 'h-8 w-8', strokeWidth: 1.5, 'aria-hidden': true })}
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate text-lg font-bold">{app.name}</h3>
                            <p className="text-sm text-white/80">
                              {app.language ?? '—'} · <Stars count={app.stars} />
                            </p>
                          </div>
                        </div>
                        <p className="relative line-clamp-2 text-sm text-white/90">{app.description ?? t.projects.noDescription}</p>
                        <div className="relative">
                          <LinkButtons app={app} links={appLinks(app, curated)} variant="banner" />
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            <section aria-labelledby="store-all">
              <h2 id="store-all" className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                {category ?? t.store.allApps} <span className="text-base font-normal text-gray-400">({results.length})</span>
              </h2>
              {results.length === 0 ? (
                <p className="py-12 text-center text-gray-500 dark:text-neutral-500">{t.store.empty}</p>
              ) : (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((app) => (
                    <li
                      key={app.name}
                      className="flex gap-4 rounded-2xl border border-gray-200 p-4 transition-colors hover:border-blue-300 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-blue-400/30"
                    >
                      <AppIcon app={app} size="sm" />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <h3 className="truncate font-semibold text-gray-900 dark:text-white">{app.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-neutral-500">
                          {app.language ?? '—'} · <Stars count={app.stars} />
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-neutral-400">
                          {app.description ?? t.projects.noDescription}
                        </p>
                        <div className="mt-3">
                          <LinkButtons app={app} links={appLinks(app, curated)} variant="card" />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
};

export default Store;
