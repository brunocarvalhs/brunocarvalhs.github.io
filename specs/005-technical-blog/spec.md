# 005 — Blog técnico

**Status:** Draft

## Problema

Nenhum conteúdo do site demonstra profundidade técnica em texto — só listas
de skills e descrições curtas de projeto. Um artigo técnico bem escrito (ex:
"Migrando de XML Layouts pra Jetpack Compose") gera uma URL indexável nova
pra buscas de nicho ("Bruno Carvalho" + termo técnico específico) e serve
como prova de conhecimento que percentual de skill bar não prova.

## Requisitos

- [ ] Existe uma rota `/blog` listando artigos, e `/blog/:slug` pro artigo
      individual.
- [ ] Pelo menos 1 artigo publicado no lançamento (não faz sentido subir a
      infraestrutura vazia).
- [ ] Cada artigo é indexável (title/description próprios) e entra no
      `sitemap.xml`.
- [ ] Conteúdo em Markdown — o projeto já tem a dependência `marked` instalada
      e usada em `src/utils/markdownLoader.ts` pra renderizar os documentos
      legais; reaproveitar esse mecanismo em vez de introduzir um novo.

## Fora de escopo

- CMS ou editor visual — artigos são arquivos `.md` no repo, versionados
  como código.
- Comentários/interação social no artigo.
- Categorias/tags — só uma lista simples por enquanto, sem esse peso.

## Abordagem técnica

- Reaproveitar o padrão já existente em `src/data/legal-docs/` +
  `src/utils/markdownLoader.ts` (`discoverLegalDocuments`, `markdownToHtml`)
  — a mesma mecânica de "arquivos `.md` num diretório viram uma lista
  navegável" já foi resolvida pra documentos legais, só precisa ser
  generalizada ou duplicada com um path diferente (`src/data/blog-posts/`).
- Meta tags por rota têm a mesma dependência da spec 003 (precisa de solução
  de meta tags dinâmicas por rota, não só o `index.html` estático).

## Tarefas

- [ ] Escrever o primeiro artigo (conteúdo é do Bruno, não gerado)
- [ ] Decidir: generalizar `markdownLoader.ts` pra servir blog e legal-docs,
      ou duplicar o padrão com um loader próprio
- [ ] Criar rotas `/blog` e `/blog/:slug`
- [ ] Resolver meta tags dinâmicas (mesma dependência da spec 003 — se as
      duas forem feitas, resolver isso uma vez só)
- [ ] Atualizar `sitemap.xml`
