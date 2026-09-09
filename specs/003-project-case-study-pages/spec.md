# 003 — Página de case study de projeto

**Status:** Draft

## Problema

Os cards de projeto na Home mostram só título + descrição curta + tech tags —
não contam a história (problema, decisões técnicas, resultado). Isso é raso
pra quem já achou o site e quer avaliar profundidade técnica real, e não gera
nenhuma URL nova indexável pro Google. "Friends Secrets" é o melhor candidato
pra primeiro case study: tem link real na Play Store e é o projeto mais
completo.

## Requisitos

- [ ] Existe uma rota própria (ex: `/projetos/friends-secrets`) com conteúdo
      substancialmente maior que o card da Home: contexto/problema,
      decisões técnicas (por que Kotlin + Jetpack Compose + IA), desafios,
      screenshots reais do app, e link pra Play Store.
- [ ] A rota é uma página real (não modal/overlay) — precisa ter `<title>` e
      meta description próprios, ser indexável, e entrar no `sitemap.xml`.
- [ ] O card da Home linka pra essa página em vez de (ou além de) abrir
      direto GitHub/Play Store.
- [ ] Usa screenshots reais do app (não o placeholder gerado do
      `ProjectThumbnail` — esse é fallback pra quando não há imagem real).

## Fora de escopo

- Case study dos outros 4 projetos — só Friends Secrets primeiro. Repetir
  esta spec (numerada de novo) se/quando fizer sentido pros outros.
- CMS ou sistema de conteúdo genérico — é uma página específica, não uma
  infraestrutura de "posts".

## Abordagem técnica

- Nova rota em `App.tsx`: `<Route path="/projetos/:slug" element={<ProjectCaseStudy />} />`.
- Novo campo opcional em cada item de `portfolio.json.projects.items`, ex.
  `caseStudy: { slug, problem, approach, challenges, screenshots: string[] }` —
  só preenchido pra Friends Secrets por enquanto; os outros projetos ficam
  sem esse campo e o card continua linkando pro GitHub como hoje.
- Screenshots reais precisam ser fornecidas (arquivos de imagem) — não dá
  pra gerar, é conteúdo que só o Bruno tem.
- Meta tags da página seguem o padrão já estabelecido em `index.html`
  (título, description, OG) mas específicos do projeto — usar
  `react-helmet-async` ou equivalente leve para meta tags por rota (o site
  hoje só tem meta tags estáticas no `index.html`, isso precisa mudar pra
  suportar múltiplas rotas com SEO próprio).

## Tarefas

- [ ] Bruno fornecer 3-5 screenshots reais do Friends Secrets
- [ ] Escolher lib de meta tags por rota (`react-helmet-async` ou similar)
- [ ] Adicionar campo `caseStudy` ao projeto no `portfolio.json`
- [ ] Criar componente/rota `ProjectCaseStudy`
- [ ] Atualizar `sitemap.xml` com a nova URL
- [ ] Linkar do card da Home pra essa página
