# 004 — Comandos novos no terminal

**Status:** Draft

## Problema

O terminal (`src/components/Terminal.tsx`) já existe e funciona (`help`,
`whoami`, `about`, `ls`, `cat <projeto>.md`, `skills`, `contact`, `open
github/linkedin`, `theme`, `sudo hire-me`), mas dois pontos identificados
depois de construído ainda não têm comando: baixar o currículo, e um jeito
mais direto de chamar no WhatsApp do que só mostrar o número.

## Requisitos

- [ ] `resume` (ou `download cv`) baixa o PDF do currículo — depende da spec
      002 estar pronta primeiro.
- [ ] `contact --whatsapp` (ou comando equivalente mais curto) abre
      `wa.me/<número>` numa nova aba.
- [ ] Ambos aparecem no `help`.
- [ ] Comandos novos seguem o mesmo padrão dos existentes: puxam de
      `portfolio.json`/dado real, não são texto hardcoded solto no
      componente.

## Fora de escopo

- Novos easter eggs decorativos (isso não precisa de spec, é baixo risco e
  pode ser feito direto).
- Autocomplete/tab-completion — não pedido, não implementar de graça.

## Abordagem técnica

- Depende de duas coisas que talvez não existam ainda: o PDF do currículo
  (spec 002) e um número de WhatsApp confirmado em formato `55XXXXXXXXXXX`
  (o telefone já existe em `ContactSection.tsx` como `tel:+5513997934483` —
  confirmar com o Bruno se é o mesmo número pro WhatsApp antes de
  implementar).
- Editar o command parser dentro de `Terminal.tsx`, seguindo o padrão dos
  `case` já existentes.

## Tarefas

- [ ] Confirmar número de WhatsApp a usar
- [ ] Implementar `contact --whatsapp` (não depende de nada, pode ir primeiro)
- [ ] Implementar `resume` (depende da 002 estar `Done`)
- [ ] Atualizar texto do `help`
