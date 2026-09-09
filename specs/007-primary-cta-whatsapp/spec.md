# 007 — CTA principal + link direto de WhatsApp

**Status:** Draft

## Problema

O Hero e a seção de Contato têm três saídas com peso visual igual (form,
email, redes sociais) e nenhuma se destaca — recrutador não sabe qual é "o"
jeito certo de chegar até o Bruno. Um link direto de WhatsApp (`wa.me/...`)
reduz fricção em relação ao `tel:` puro, que na prática abre o discador, não
uma conversa.

## Requisitos

- [ ] Existe um CTA principal claramente destacado no Hero (ex: "Falar no
      WhatsApp" ou "Baixar Currículo" — decidir qual dos dois é o principal;
      os outros contatos continuam existindo, só não competem visualmente).
- [ ] Link de WhatsApp usa o formato `https://wa.me/55XXXXXXXXXXX` com o
      número confirmado (ver spec 004, mesma dependência de confirmar o
      número).
- [ ] `ContactSection.tsx` também ganha a opção de WhatsApp ao lado do
      form/email existentes.

## Fora de escopo

- Mudar o formulário de contato em si (já foi corrigido pra usar `mailto:`
  nesta sessão — não é essa spec).

## Abordagem técnica

- Puro front-end: um botão/link novo, sem dependência de backend.
- Reaproveitar o ícone de `lucide-react` ou um SVG de WhatsApp (não incluso
  no lucide por padrão — checar se `react-icons`, que já está instalado no
  projeto, tem o ícone antes de adicionar qualquer SVG novo).

## Tarefas

- [ ] Confirmar número de WhatsApp (compartilhado com a spec 004)
- [ ] Decidir qual é o CTA principal do Hero
- [ ] Adicionar botão de WhatsApp no Hero
- [ ] Adicionar opção de WhatsApp em `ContactSection.tsx`
