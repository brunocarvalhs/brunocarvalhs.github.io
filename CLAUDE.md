# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Vite dev server, port 8080
npm run build         # vite build && cp build/index.html build/404.html — see "GitHub Pages deploy" below for why the copy step exists
npm run build:dev     # build in development mode
npm run lint          # eslint .
npm run test          # vitest run — single pass, what CI runs
npm run test:watch    # vitest — interactive watch mode
npm run preview       # preview the production build locally
npm run deploy        # gh-pages -d build — manual fallback only; master pushes deploy automatically now, see CI below
```

Both `package-lock.json` and `yarn.lock` are present; `npm` is the one actually used for scripts above.

### Tests

Vitest + Testing Library (`jsdom` environment, configured inline in `vite.config.ts`'s `test` block; setup file at `src/test/setup.ts`). Tests live next to the code they cover as `*.test.ts(x)`. The suite so far is deliberately narrow: it covers pure logic that was extracted specifically to be testable (and exported) from otherwise-component-local helpers — `Terminal.tsx` (`slugify`, `getCompletions`, `COMMANDS`), `ProjectThumbnail.tsx` (`hashString`, `pickIcon`, `slugifyTitle`), `use-github-projects.ts` (`blendRepos`), `ContactSection.tsx` (`buildMailtoUrl`, `CONTACT_EMAIL`), `Legal.tsx` (`getQueryParam`, `updateQueryParam`), and `i18n/languages.ts` (`detectBrowserLanguage`). When adding new non-trivial logic to a component, prefer exporting it as a standalone function (even from the component's own file) over leaving it inline and untested — that's the established pattern here, not a full component-rendering test for everything.

`jsdom`'s bundled `undici` throws `webidl.util.markAsUncloneable is not a function` on Node 20 (confirmed on GitHub Actions' runner; works fine on Node 22+) — this is why CI pins Node 22, not 20. Don't drop that pin without checking this still holds on whatever `jsdom` version is current then.

## Architecture

This is a personal portfolio site (Vite + React 18 + TypeScript + Tailwind + shadcn/ui on Radix + `react-router-dom`), deployed to GitHub Pages at `bruno-carvalho.dev.br`.

### Content is data-driven, not hardcoded

Nearly all visible copy — hero bio, about/journey text, project list, skills with levels, soft skills, SWOT — lives in `src/data/portfolio.json` (pt-BR, the source of truth) plus its `portfolio.en.json`/`portfolio.es.json` siblings (see "Internationalization" below). Section components (`src/components/HeroSection.tsx`, `AboutSection.tsx`, `ProjectsSection.tsx`, `SkillsSection.tsx`, `SoftSkillsSection.tsx`, `TestimonialsSection.tsx`, `ContactSection.tsx`) call `usePortfolioData()` (`src/hooks/use-portfolio-data.ts`) rather than importing the JSON directly, so they always render the current language's data. `SwotSection.tsx` is the one exception — it's not rendered anywhere (dead code, not wired into `Index.tsx`) and still imports `portfolio.json` directly; the `swot` key only exists in the pt-BR file. When asked to change site copy or add a project/skill, edit all three `portfolio.*.json` files, not the component.

`src/pages/Index.tsx` assembles the section components in order for the `/` route.

### Internationalization (i18n)

Three languages: pt-BR (default/source), `en`, `es`. `src/contexts/LanguageContext.tsx` detects `navigator.language(s)` on first visit (via `detectBrowserLanguage` in `src/i18n/languages.ts`), persists the resolved/chosen language to `localStorage` (`language` key), and sets `<html lang>`. `src/components/LanguageSwitcher.tsx` (in the header, desktop and mobile) lets visitors override the detection manually.

Two content sources, both language-keyed:
- **Portfolio content**: `usePortfolioData()` — see above.
- **Fixed UI strings** (nav labels, button text, toasts, the terminal's command descriptions, the Legal page chrome, 404 copy, SEO title/description): `useStrings()` in `src/i18n/strings.ts`, one big `Strings` object per language. Terminal *command names* themselves (`help`, `whoami`, `ls`, `cat`, …) are never translated — they're literal input, translating them would break the terminal metaphor — only their descriptions and output text are.

`src/components/SeoManager.tsx` mounts once near the app root and keeps `document.title` / meta description / OG / Twitter tags in sync with the current language on every change. `index.html`'s own tags stay pt-BR-only (that's what a crawler or the very first paint sees, before React/JS runs) — this only fixes what the visitor's own browser tab shows, and does not give search engines per-language indexing (no `/en/`, `/es/` route split, no `hreflang`). Don't assume this is real multi-locale SEO.

Legal docs are translated too — see the "Legal docs" section below for how per-language Markdown files and stable cross-language `id`s work together.

### Legal docs are a separate, self-contained subsystem

`/legal` (`src/pages/Legal.tsx`) is unrelated to `portfolio.json`. It renders privacy policies / terms of use for Bruno's Android apps, sourced from Markdown files under `src/data/legal-docs/<project-slug>/*.md` with YAML frontmatter (the frontmatter's `title`/`description` are parsed but unused — the displayed title/description are generated from `category` + `language` + `project`, see `generateTitle`/`generateDescription` in `documentUtils.ts`; only `lastUpdated`, `category`, and `project` from frontmatter actually matter). The pipeline: `src/services/fileDiscoveryService.ts` (`import.meta.glob`-based discovery of the `.md` files) → `src/services/markdownService.ts` (frontmatter parsing + `marked` rendering) → `src/utils/markdownLoader.ts` (the façade the page/components actually import: `getAllDocuments`, `getProjects`, `markdownToHtml`). Category metadata (colors/icons for privacy/terms/accessibility/cookies/data) is centralized in `src/lib/legalCategories.ts`; category *labels* are language-dependent and come from `useStrings().legal.categories` instead.

A doc's language is encoded in its filename: `terms-of-use.md` (no suffix) is treated as pt-BR, `terms-of-use.en.md` and `terms-of-use.es.md` are the translations, matched against `SUPPORTED_LANGUAGES` in `src/i18n/languages.ts`. The document `id` is always derived from the filename *without* the language suffix, so it's stable across languages — this matters because these docs are deep-linked from inside the published Android apps via `/legal?doc=<id>`, and that link must keep working no matter what language the visitor's browser resolves to. `fileDiscoveryService.discoverLegalDocuments(language)` falls back to the pt-BR version of a doc if a translation is missing, rather than silently dropping it from the list — so adding a new doc only in pt-BR is safe, it just won't be localized yet. When adding a new legal doc or editing an existing one, keep all language variants (or accept the pt-BR fallback deliberately) and re-check `npm run build`'s output chunk count matches `5 docs × 3 languages = 15`.

These app-facing legal docs are deep-linked from outside the site (published from within the Android apps themselves via `/legal?doc=<id>`), which is why the GitHub Pages 404 handling below matters — a broken deep link here is a broken link inside a published app, not just a 404 on the website.

### CI/CD: `.github/workflows/ci.yml`

Every push and PR to `master` runs a `check` job (`npm ci && npm run lint && npm run test && npm run build`). On a direct push to `master` (not PRs), a second `deploy` job publishes `build/` straight to the `gh-pages` branch via `peaceiris/actions-gh-pages`, using the automatic `GITHUB_TOKEN` — no manual secret setup. **Pushing to `master` now deploys to production automatically**; there's no separate approval step. `npm run deploy` (the local `gh-pages -d build` command) still works as a manual fallback if you ever need to publish without going through a push/CI cycle, but the normal path is just: push to `master`, CI does the rest.

### GitHub Pages deploy: `build/` is committed, and 404.html must mirror index.html

Unusually, the `build/` output directory is also tracked in git on `master` (not gitignored) — this predates the CI pipeline and is now mostly a redundant byproduct of local `npm run build` runs (CI builds its own fresh copy for deployment and doesn't read the committed one). Harmless to leave committed; not required for the automated deploy to work.

GitHub Pages has no server-side rewrite, so any client-side route other than `/` (e.g. `/legal`, or a deep link like `/legal?doc=...`) resolves as a 404 at the CDN level, which serves `build/404.html` as the response body. For that to actually work as a functioning SPA route, `404.html` must be byte-identical to the current `index.html` (same hashed asset filenames) — a stale 404.html referencing old, deleted JS/CSS chunks silently breaks every deep link. This is why `npm run build` ends with `cp build/index.html build/404.html`; do not remove that step or "clean up" `build/404.html` by hand.

### SEO tags are hand-maintained, per-site not per-route

`index.html` carries the site's `<title>`, meta description, Open Graph/Twitter tags, canonical link, and a `Person` JSON-LD block (`sameAs` linking GitHub/LinkedIn/Instagram) — all pt-BR only; `SeoManager` (see "Internationalization" above) overrides title/description/OG/Twitter at runtime per language, but the JSON-LD block is not touched and stays pt-BR. `public/robots.txt` and `public/sitemap.xml` are static files, manually kept in sync with actual routes. There is currently no per-route meta tag mechanism — every route serves the same `<head>`. If a new indexable route is added (a project case study, a blog post, etc.), it inherits the homepage's meta tags as-is unless a per-route solution is introduced first (tracked as a shared open dependency across several backlog specs — see `specs/README.md`).

### Theming

`src/contexts/ThemeContext.tsx` toggles a `dark` class on `<html>` and persists the choice to `localStorage`, defaulting to `prefers-color-scheme` on first visit. Components style both modes with Tailwind `dark:` variants (not CSS custom properties, despite shadcn's `components.json` having `cssVariables: true` — the primitives in `src/components/ui/*` use the CSS-variable tokens from `src/index.css`, but the hand-written section components mostly use literal Tailwind grays/colors with explicit `dark:` pairs instead).

### Path alias

`@/*` maps to `src/*` (set in `tsconfig.json` and mirrored in `vite.config.ts`). TypeScript's `strictNullChecks` and `noImplicitAny` are both off — don't assume strict-mode guarantees when reading or writing types here.

## Feature backlog: Spec-Driven Development

New features go through `specs/` before implementation — a lightweight spec-per-feature backlog (problem, requirements, technical approach, tasks), each with a `Draft` → `Approved` → `In Progress` → `Done` lifecycle. Read `specs/README.md` before starting new feature work; it explains the process and links the current backlog. Bugfixes, style tweaks, and content updates in `portfolio.json` don't need a spec.
