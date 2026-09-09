# 006 — Página /uses

**Status:** Draft

## Problema

Página comum em sites de dev (lista de ferramentas, editor, hardware, setup)
que adiciona personalidade e mais uma URL indexável, com esforço baixo — é
praticamente só conteúdo, pouco código novo.

## Requisitos

- [ ] Rota `/uses` listando ferramentas por categoria (ex: editor, terminal,
      hardware, apps do dia a dia).
- [ ] Conteúdo vem de `portfolio.json` (novo bloco, ex: `uses: { categories:
      [...] }`), seguindo o padrão data-driven do resto do site — não
      hardcoded no componente.
- [ ] Indexável, com meta tags próprias (mesma dependência das specs 003/005).

## Fora de escopo

- Links de afiliado — se algum dia fizer sentido, é decisão separada, não
  parte desta spec.

## Abordagem técnica

- Página simples, sem novidade técnica — o único ponto compartilhado com
  outras specs é a dependência de meta tags por rota (003/005). Se nenhuma
  das outras duas estiver feita ainda, essa spec pode ser a primeira a
  resolver isso, já que é a mais simples das três pra validar a abordagem.

## Tarefas

- [ ] Bruno listar as ferramentas/setup reais
- [ ] Adicionar bloco `uses` ao `portfolio.json`
- [ ] Criar rota e componente `/uses`
- [ ] Resolver meta tags por rota (se ainda não resolvido por outra spec)
- [ ] Atualizar `sitemap.xml`
