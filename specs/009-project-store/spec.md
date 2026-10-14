# 009 — Loja de projetos (`/loja`)

**Status:** Done

## Problema

A Home mostra só 6 projetos. Quem quer ver tudo, ou abrir o app/site de um
projeto, precisa ir no GitHub. Uma página no estilo Google Play / Microsoft
Store dá credibilidade ao portfólio e deixa o visitante a um clique do app,
seja ele Play Store, site ou demo. Também cria uma URL nova indexável.

## Requisitos

- [x] Rota `/loja` lista todos os repos públicos (sem fork nem arquivados), ao vivo do GitHub.
- [x] Busca (sem diferenciar maiúsculas nem acentos) por nome, descrição e topics.
- [x] Chips de categoria por linguagem.
- [x] Banner de destaques (top 3 por estrelas) quando não há filtro ativo.
- [x] Cada projeto tem botões para **Google Play**, **Site** e/ou **Demo** (conforme
      os links que existirem), além de **Código**.
- [x] Links da Play Store curados no `portfolio.json` (`live`) entram mesmo quando
      o repo não tem `homepage`.
- [x] Textos de UI nos 3 idiomas; link no header (desktop e mobile).
- [x] `/loja` responde com HTTP 200 no GitHub Pages (não via `404.html`) e está no `sitemap.xml`.

## Fora de escopo

- Venda/pagamento: "loja" é só a metáfora visual.
- Página de detalhe por app (ver spec 003).
- Screenshots reais: os ícones são gerados (`PALETTES`/`pickIcon` do `ProjectThumbnail`).

## Abordagem técnica

- `src/pages/Store.tsx` reaproveita `useGithubProjects(100)`. A chave do cache
  agora inclui o `limit`, senão a lista de 6 da Home vazaria para a loja.
- Lógica pura exportada e testada em `Store.test.ts`: `filterApps`,
  `listCategories`, `linkKind` (`play.google.com` → Play, `*.github.io` → Demo,
  qualquer outro → Site) e `appLinks` (curado + homepage, sem duplicatas, Play primeiro).
- O `npm run build` copia `index.html` para `build/loja/index.html` (mesmo motivo do `prerender-legal`).

## Tarefas

- [x] Página, rota e link no header
- [x] Strings pt-BR/en/es
- [x] Testes
- [x] Sitemap + cópia estática no build
