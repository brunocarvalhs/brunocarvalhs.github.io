# Spec-Driven Development neste projeto

Este repositório é pequeno e mantido por uma pessoa só, então o processo aqui é
deliberadamente leve — o objetivo não é burocracia, é ter um lugar único onde
"o que vamos construir e por quê" fica escrito **antes** do código, pra que
qualquer sessão (com Claude ou não) tenha o mesmo contexto sem precisar
reconstruir a decisão do zero.

## Como funciona

Cada feature vira uma pasta numerada em `specs/`:

```
specs/
  001-nome-curto-da-feature/
    spec.md
```

Um `spec.md` só tem 4 seções obrigatórias — problema, requisitos, abordagem
técnica e tarefas. Ver [`TEMPLATE.md`](./TEMPLATE.md).

## Ciclo de vida

| Status | Significa |
|---|---|
| `Draft` | Ideia capturada, ainda não confirmada que vale a pena fazer |
| `Approved` | Confirmado que vale a pena, pronto pra virar trabalho |
| `In Progress` | Sendo implementado |
| `Done` | Implementado e no ar |
| `Dropped` | Decidiu-se não fazer (mantém o registro do porquê) |

Specs entram como `Draft`. Uma spec só deve ser implementada depois de virar
`Approved` — isso é o que evita que uma sessão de IA implemente algo que
pareceu uma boa ideia na hora mas não foi de fato decidido.

## Convenção de numeração

Sequencial, nunca reaproveita número mesmo se uma spec for `Dropped`. O número
não implica prioridade — é só um ID estável pra referenciar
("implementa a 004") sem ambiguidade.

## Quando usar isso vs. não usar

- **Usa spec**: qualquer coisa que adiciona uma feature, rota, ou muda
  comportamento visível pro visitante do site.
- **Não precisa de spec**: bugfix, ajuste de estilo, refactor sem mudança de
  comportamento, atualização de conteúdo em `portfolio.json`. Isso é trabalho
  direto, não passa por aqui.

## Contexto do projeto (pra qualquer spec nova ler antes de escrever)

- Objetivo do site: aparecer quando alguém buscar "Bruno Carvalho" no Google
  E, quando encontrado, ler como portfólio profissional sério — não só SEO,
  também credibilidade e conversão (visitante vira contato real). Toda spec
  nova deveria conseguir dizer qual desses dois ela ataca.
- Arquitetura, stack, comandos e convenções técnicas do projeto estão em
  [`CLAUDE.md`](../CLAUDE.md), na raiz — não repetido aqui.

## Backlog atual

| # | Spec | Status |
|---|---|---|
| 001 | [Stats do GitHub ao vivo](./001-github-live-profile-stats/spec.md) | Draft |
| 002 | [Currículo em PDF baixável](./002-downloadable-resume-pdf/spec.md) | Draft |
| 003 | [Página de case study de projeto](./003-project-case-study-pages/spec.md) | Draft |
| 004 | [Comandos novos no terminal](./004-terminal-extended-commands/spec.md) | Draft |
| 005 | [Blog técnico](./005-technical-blog/spec.md) | Draft |
| 006 | [Página /uses](./006-uses-page/spec.md) | Draft |
| 007 | [CTA principal + WhatsApp](./007-primary-cta-whatsapp/spec.md) | Draft |

Três specs (003, 005, 006) compartilham a mesma dependência técnica: meta
tags dinâmicas por rota, que o site não tem hoje (só tags estáticas no
`index.html`). Vale resolver isso uma vez, na primeira dessas três que for
aprovada, em vez de cada uma reinventar.
