# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Vite dev server, port 8080
npm run build         # vite build && cp build/index.html build/404.html — see "GitHub Pages deploy" below for why the copy step exists
npm run build:dev     # build in development mode
npm run lint          # eslint .
npm run preview       # preview the production build locally
npm run deploy        # gh-pages -d build — pushes build/ to the gh-pages branch (does NOT run build first, run `npm run build` before this)
```

There is no test suite (no test runner is installed, no `test` script exists).

Both `package-lock.json` and `yarn.lock` are present; `npm` is the one actually used for scripts above.

## Architecture

This is a personal portfolio site (Vite + React 18 + TypeScript + Tailwind + shadcn/ui on Radix + `react-router-dom`), deployed to GitHub Pages at `bruno-carvalho.dev.br`.

### Content is data-driven, not hardcoded

Nearly all visible copy — hero bio, about/journey text, project list, skills with levels, soft skills, SWOT — lives in `src/data/portfolio.json`, a single JSON tree. Section components (`src/components/HeroSection.tsx`, `AboutSection.tsx`, `ProjectsSection.tsx`, `SkillsSection.tsx`, `SoftSkillsSection.tsx`, `SwotSection.tsx`) import this file directly and render from it. When asked to change site copy or add a project/skill, edit `portfolio.json`, not the component.

`src/pages/Index.tsx` assembles the section components in order for the `/` route.

### Legal docs are a separate, self-contained subsystem

`/legal` (`src/pages/Legal.tsx`) is unrelated to `portfolio.json`. It renders privacy policies / terms of use for Bruno's Android apps, sourced from Markdown files under `src/data/legal-docs/<project-slug>/*.md` with YAML frontmatter. The pipeline: `src/services/fileDiscoveryService.ts` (`import.meta.glob`-based discovery of the `.md` files) → `src/services/markdownService.ts` (frontmatter parsing + `marked` rendering) → `src/utils/markdownLoader.ts` (the façade the page/components actually import: `getAllDocuments`, `getProjects`, `markdownToHtml`). Category metadata (labels/colors/icons for privacy/terms/accessibility/cookies/data) is centralized in `src/lib/legalCategories.ts` — shared by `Legal.tsx`, `LegalDocCard.tsx`, and `LegalDocViewer.tsx` rather than duplicated per-component.

These app-facing legal docs are deep-linked from outside the site (published from within the Android apps themselves via `/legal?doc=<id>`), which is why the GitHub Pages 404 handling below matters — a broken deep link here is a broken link inside a published app, not just a 404 on the website.

### GitHub Pages deploy: `build/` is committed, and 404.html must mirror index.html

Unusually, the `build/` output directory is tracked in git on `master` (not gitignored) — the workflow is `npm run build` then `npm run deploy` (which pushes `build/` to the `gh-pages` branch via the `gh-pages` package), and `build/` in `master` ends up as a byproduct of that local build step.

GitHub Pages has no server-side rewrite, so any client-side route other than `/` (e.g. `/legal`, or a deep link like `/legal?doc=...`) resolves as a 404 at the CDN level, which serves `build/404.html` as the response body. For that to actually work as a functioning SPA route, `404.html` must be byte-identical to the current `index.html` (same hashed asset filenames) — a stale 404.html referencing old, deleted JS/CSS chunks silently breaks every deep link. This is why `npm run build` ends with `cp build/index.html build/404.html`; do not remove that step or "clean up" `build/404.html` by hand.

### SEO tags are hand-maintained, per-site not per-route

`index.html` carries the site's `<title>`, meta description, Open Graph/Twitter tags, canonical link, and a `Person` JSON-LD block (`sameAs` linking GitHub/LinkedIn/Instagram). `public/robots.txt` and `public/sitemap.xml` are static files, manually kept in sync with actual routes. There is currently no per-route meta tag mechanism — every route serves the same `<head>`. If a new indexable route is added (a project case study, a blog post, etc.), it inherits the homepage's meta tags as-is unless a per-route solution is introduced first (tracked as a shared open dependency across several backlog specs — see `specs/README.md`).

### Theming

`src/contexts/ThemeContext.tsx` toggles a `dark` class on `<html>` and persists the choice to `localStorage`, defaulting to `prefers-color-scheme` on first visit. Components style both modes with Tailwind `dark:` variants (not CSS custom properties, despite shadcn's `components.json` having `cssVariables: true` — the primitives in `src/components/ui/*` use the CSS-variable tokens from `src/index.css`, but the hand-written section components mostly use literal Tailwind grays/colors with explicit `dark:` pairs instead).

### Path alias

`@/*` maps to `src/*` (set in `tsconfig.json` and mirrored in `vite.config.ts`). TypeScript's `strictNullChecks` and `noImplicitAny` are both off — don't assume strict-mode guarantees when reading or writing types here.

## Feature backlog: Spec-Driven Development

New features go through `specs/` before implementation — a lightweight spec-per-feature backlog (problem, requirements, technical approach, tasks), each with a `Draft` → `Approved` → `In Progress` → `Done` lifecycle. Read `specs/README.md` before starting new feature work; it explains the process and links the current backlog. Bugfixes, style tweaks, and content updates in `portfolio.json` don't need a spec.
