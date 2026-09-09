# 002 — Currículo em PDF baixável

**Status:** Draft

## Problema

Recrutador que acha o site pesquisando "Bruno Carvalho Android developer"
frequentemente quer um PDF pra encaminhar internamente ou anexar num ATS —
não só rolar a página. Hoje não existe isso no site.

## Requisitos

- [ ] Existe um botão/link claro ("Baixar Currículo") acessível a partir do
      Hero e/ou da seção de Contato.
- [ ] O PDF gerado reflete os dados reais de `portfolio.json` (nome, cargo,
      bio, experiência, skills, projetos) — não é um arquivo estático mantido
      à parte que desatualiza sozinho.
- [ ] Formato profissional, uma página se possível, sem o visual "site
      exportado" (não é print-to-PDF da página inteira).
- [ ] Funciona 100% client-side (sem backend) — build-time ou on-demand no
      browser, sem custo de infra.

## Fora de escopo

- Múltiplos formatos de currículo (ex: um por vaga) — só um, geral.
- Editor visual do currículo — o conteúdo vem do `portfolio.json`, ponto.

## Abordagem técnica

Duas rotas possíveis, decidir na implementação:

1. **Build-time**: um script Node (`scripts/generate-resume.ts`, rodado no
   `prebuild`) usa os dados de `portfolio.json` pra gerar
   `public/bruno-carvalho-cv.pdf` via alguma lib de PDF (ex: `pdf-lib` ou
   `@react-pdf/renderer`). Vantagem: zero custo em runtime, PDF é só um
   arquivo estático servido. Precisa rodar de novo sempre que
   `portfolio.json` mudar (o `prebuild` cobre isso automaticamente).
2. **On-demand no browser**: gera o PDF no cliente ao clicar (ex:
   `@react-pdf/renderer` no client, ou `window.print()` com uma rota
   `/resume` com CSS `@media print` dedicado). Vantagem: não precisa de passo
   de build extra.

Preferência: opção 1 (build-time) — menos JS no bundle do site principal,
PDF sempre pronto sem esperar geração no clique.

## Tarefas

- [ ] Decidir lib de geração de PDF (build-time vs on-demand)
- [ ] Layout do currículo (seções: contato, resumo, experiência, skills,
      projetos em destaque)
- [ ] Script/rota de geração lendo de `portfolio.json`
- [ ] Botão de download no Hero e/ou Contato
- [ ] Conferir que atualizar `portfolio.json` reflete no PDF sem trabalho manual
