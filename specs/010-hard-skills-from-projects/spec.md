# 010 — Hard skills derivadas dos projetos

**Status:** Done

## Problema

A seção de skills mostrava porcentagens escritas à mão ("Android 95%"), que não
dá pra verificar e soam arbitrárias para quem avalia o portfólio. Dividir em
hard skills e soft skills, com as hard skills sendo só as tecnologias que
aparecem de fato nos projetos, deixa a seção verificável.

## Requisitos

- [x] A seção de hard skills lista as tecnologias presentes nos projetos (linguagem
      + topics dos repos do GitHub + `technologies` dos projetos do `portfolio.json`).
- [x] Cada tecnologia mostra em quantos projetos aparece, ordenada por esse número.
- [x] Um projeto curado que também é repo do GitHub conta uma vez só; nomes iguais
      com grafias diferentes ("Jetpack Compose" / "jetpack-compose") viram um só.
- [x] Soft skills continuam como estão.
- [x] Funciona sem GitHub (cai só nos projetos curados).

## Fora de escopo

- O comando `skills` do Terminal continua lendo `skills.categories` do `portfolio.json`.
- Bytes por linguagem (`languages_url`): seria 1 request por repo e estoura o limite de 60/h sem autenticação.

## Abordagem técnica

`collectHardSkills` exportado de `SkillsSection.tsx` e testado. Reaproveita
`useGithubProjects(100)`, o mesmo cache da `/loja`, então não faz request a mais.

## Tarefas

- [x] Lógica + teste
- [x] Seção, strings e títulos nos 3 idiomas
