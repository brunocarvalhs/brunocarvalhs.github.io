// Runs after `vite build`. Generates a static build/legal/index.html with
// the actual legal doc text baked into the HTML.
//
// Why this exists: GitHub Pages has no server-side routing, so a
// client-only route like /legal is normally only reachable through the
// build/404.html SPA fallback — which GitHub Pages serves with an HTTP 404
// status no matter what's in the body. The two Cestou legal doc URLs
// (/legal?doc=cestou-privacy-policy, /legal?doc=cestou-terms-of-use) are
// hardcoded inside the published Android app and are what Google Play's
// automated policy checker fetches directly; a 404 status fails that check
// even though the SPA renders the right content once JS runs. GitHub Pages
// ignores the query string when resolving a path to a file, so a single
// physical build/legal/index.html makes /legal (with any ?doc=... query)
// resolve to a real file and return 200.
//
// That file needs actual doc text in the raw HTML response too (not just
// something assembled client-side), so this also renders every legal doc's
// markdown to HTML at build time and embeds it. The live React app still
// mounts over #root and takes over as the interactive Legal page — this
// static markup is only what a plain HTTP fetch (Play's checker, a
// crawler that skips JS) sees before that happens.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const legalDocsDir = path.join(root, "src/data/legal-docs");
const buildDir = path.join(root, "build");

const CATEGORY_TITLES = {
  privacy: "Política de Privacidade",
  terms: "Termos de Uso",
  accessibility: "Acessibilidade",
  cookies: "Política de Cookies",
  data: "Uso e Exclusão de Dados",
};

function getCategoryFromFilename(filename) {
  if (filename.includes("privacy")) return "privacy";
  if (filename.includes("terms")) return "terms";
  if (filename.includes("accessibility")) return "accessibility";
  if (filename.includes("cookies")) return "cookies";
  return "data";
}

function formatProjectName(folder) {
  return folder.charAt(0).toUpperCase() + folder.slice(1);
}

function parseFrontmatter(raw) {
  const match = /^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/.exec(raw);
  if (!match) return raw;
  return match[2];
}

// Only the pt-BR (no language suffix) file per doc — index.html itself is
// pt-BR-only for the same reason (see CLAUDE.md's i18n section), and this
// static fallback follows that existing convention rather than adding real
// per-language routes.
function isDefaultLanguageDoc(filename) {
  return filename.endsWith(".md") && !/\.(en|es)\.md$/.test(filename);
}

function readDoc(dir, filename, projectFolder) {
  const raw = readFileSync(path.join(dir, filename), "utf-8");
  const content = parseFrontmatter(raw);
  const category = getCategoryFromFilename(filename);
  const base = filename.replace(/\.md$/i, "");
  const id = projectFolder ? `${projectFolder}-${base}` : base;
  const project = projectFolder ? formatProjectName(projectFolder) : undefined;
  const title = project ? `${CATEGORY_TITLES[category]} — ${project}` : CATEGORY_TITLES[category];
  return { id, title, html: marked.parse(content) };
}

function collectDocs() {
  const docs = [];
  for (const entry of readdirSync(legalDocsDir)) {
    const entryPath = path.join(legalDocsDir, entry);
    if (statSync(entryPath).isDirectory()) {
      for (const file of readdirSync(entryPath)) {
        if (isDefaultLanguageDoc(file)) docs.push(readDoc(entryPath, file, entry));
      }
    } else if (isDefaultLanguageDoc(entry)) {
      docs.push(readDoc(legalDocsDir, entry, undefined));
    }
  }
  return docs;
}

function buildFragment(docs) {
  const nav = docs.map((d) => `<li><a href="?doc=${d.id}">${d.title}</a></li>`).join("\n      ");
  const sections = docs
    .map((d) => `<article id="${d.id}">\n      <h1>${d.title}</h1>\n      ${d.html}\n    </article>`)
    .join("\n\n    ");

  return `<main style="max-width:720px;margin:0 auto;padding:2rem 1.5rem;font-family:system-ui,sans-serif;line-height:1.6;color:#1f2937">
    <h1 style="margin-bottom:0.5rem">Documentos Legais</h1>
    <p>Políticas de privacidade e termos de uso dos aplicativos.</p>
    <ul>
      ${nav}
    </ul>
    ${sections}
  </main>`;
}

const docs = collectDocs();
if (docs.length === 0) {
  throw new Error("prerender-legal: nenhum documento legal encontrado em src/data/legal-docs");
}

const indexHtmlPath = path.join(buildDir, "index.html");
const template = readFileSync(indexHtmlPath, "utf-8");

if (!template.includes('<div id="root"></div>')) {
  throw new Error('prerender-legal: <div id="root"></div> não encontrado em build/index.html');
}

const fragment = buildFragment(docs);
const html = template
  .replace('<div id="root"></div>', `<div id="root">${fragment}</div>`)
  .replace(/<title>[^<]*<\/title>/, "<title>Documentos Legais — Bruno Carvalho</title>")
  .replace(
    /<meta name="description" content="[^"]*" \/>/,
    '<meta name="description" content="Políticas de privacidade e termos de uso dos aplicativos publicados por Bruno Carvalho na Play Store." />'
  )
  .replace(/<link rel="canonical" href="[^"]*" \/>/, '<link rel="canonical" href="https://bruno-carvalho.dev.br/legal" />');

// Written to both forms — build/legal.html and build/legal/index.html —
// because it's not worth staking the fix on knowing exactly how GitHub
// Pages resolves an extensionless path (whether it tries "<path>.html",
// "<path>/index.html", or redirects to add a trailing slash first). The
// app's hardcoded deep links hit /legal with no trailing slash, so both
// forms exist and serve identical content — whichever GitHub Pages picks,
// the request resolves to a real 200 instead of the 404.html fallback.
const legalDir = path.join(buildDir, "legal");
mkdirSync(legalDir, { recursive: true });
writeFileSync(path.join(legalDir, "index.html"), html);
writeFileSync(path.join(buildDir, "legal.html"), html);

console.log(`prerender-legal: ${docs.length} documento(s) embutido(s) em build/legal.html e build/legal/index.html`);
