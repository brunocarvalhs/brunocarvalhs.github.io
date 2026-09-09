# 001 — Stats do GitHub ao vivo

**Status:** Draft

## Problema

A seção "Minha Jornada" mostra "37+ Projetos" como número fixo em
`portfolio.json`, mas só 5 projetos aparecem no site e nada sustenta esse
número — foi apontado como o tipo de estatística solta que reduz
credibilidade em vez de aumentar. A API pública do GitHub resolve isso sem
precisar de conta/token: dá pra mostrar contagem real de repositórios
públicos, linguagens mais usadas e há quanto tempo a conta existe — tudo
verificável clicando.

## Requisitos

- [ ] O número de "Projetos" nos stats do About vem da contagem real de
      repositórios públicos do GitHub (`brunocarvalhs`), não mais hardcoded.
- [ ] Mostra data de criação da conta GitHub, convertida em "desde 20XX" —
      cruza com a narrativa já existente ("Iniciei... desde 2018").
- [ ] Se a API falhar (rate limit, offline) o site continua funcionando —
      cai pro valor estático atual do `portfolio.json` como fallback, nunca
      quebra a seção nem mostra erro pro visitante.
- [ ] Chamada é feita client-side, sem token (endpoints públicos), sem
      backend novo.
- [ ] Resultado fica em cache no `localStorage` (ex: 1h) pra não bater na API
      a cada reload e não esbarrar no rate limit não-autenticado (60 req/h
      por IP).

## Fora de escopo

- Lista dos repositórios em si (isso é a spec de case studies, não esta).
- Autenticação/token do GitHub — só endpoints públicos.
- Dados do LinkedIn — não existe API pública viável para isso (avaliado e
  descartado nesta sessão).

## Abordagem técnica

- Novo hook `src/hooks/use-github-stats.ts`: fetch em
  `https://api.github.com/users/brunocarvalhs` (conta pública, sem token),
  extrai `public_repos` e `created_at`, com cache em `localStorage` e
  fallback silencioso pros valores atuais de `portfolio.json` em caso de
  erro.
- `AboutSection.tsx` passa a consumir esse hook pro stat "Projetos" em vez de
  ler direto de `portfolio.json.about.stats`.
- Linguagens (`GET /users/brunocarvalhs/repos` + agregação de
  `language` por repo) é um nice-to-have dentro desta mesma spec se o tempo
  permitir — não é bloqueante pros outros requisitos.

## Tarefas

- [ ] Criar `use-github-stats.ts` com fetch + cache + fallback
- [ ] Ligar o stat "Projetos" do About ao hook
- [ ] Testar cenário de rate-limit/offline (mockar erro, confirmar fallback)
- [ ] Adicionar "no GitHub desde 20XX" em algum ponto do About/Hero
