# 008 — Modo admin para editar o conteúdo pelo site

**Status:** In Progress

## Problema

Todo o conteúdo do site (hero, sobre, projetos, skills, depoimentos) mora em
`src/data/portfolio*.json`, em três idiomas. Hoje, atualizar qualquer texto
exige abrir o repositório, editar JSON à mão e fazer commit. Isso atrasa
atualizações pequenas (um projeto novo, uma skill), e um portfólio
desatualizado é levado menos a sério por quem encontra o site.

## Requisitos

- [ ] Existe a rota `/admin`, fora do sitemap e sem link no site
- [ ] O login é pelo botão "Entrar com GitHub"; só a conta `brunocarvalhs`
      recebe uma credencial (qualquer outra conta vê "acesso negado")
- [ ] Depois do login, dá para editar todo o conteúdo de
      `portfolio.json`, `portfolio.en.json` e `portfolio.es.json`, um idioma
      por aba
- [ ] Listas (projetos, skills, links, depoimentos…) permitem adicionar e
      remover itens
- [ ] "Salvar" grava um commit no `master` daquele arquivo; o CI existente
      publica o site sozinho
- [ ] Se o arquivo mudou no GitHub depois de carregado, o save falha com uma
      mensagem clara em vez de sobrescrever
- [ ] Nenhum segredo vai para o código do site

## Fora de escopo

- Reordenar itens das listas (adicionar quando fizer falta)
- Editar os documentos legais (`src/data/legal-docs/`)
- Upload de imagens
- Pré-visualização antes de salvar (o deploy leva 1–2 minutos)

## Abordagem técnica

**Por que precisa de um servidor.** O GitHub Pages é só estático, e o fluxo
OAuth do GitHub exige um `client_secret` para trocar o `code` pelo token. Esse
segredo não pode ir para o navegador. A troca fica num Cloudflare Worker
gratuito (`workers/github-oauth/`), sem dependências.

**Credencial: GitHub App, não OAuth App.** O token de usuário de um GitHub App
fica limitado às permissões do app (Contents: read & write) e aos repositórios
onde ele está instalado (só `brunocarvalhs.github.io`). Um OAuth App precisaria
do escopo `public_repo`, que escreve em todos os repositórios públicos da conta.
O token de usuário expira em 8 horas.

**Fluxo:**
1. `/admin` gera um `state` aleatório, guarda em `sessionStorage` e redireciona
   para `github.com/login/oauth/authorize`
2. O GitHub redireciona para o Worker com `code` e `state`
3. O Worker troca o `code` pelo token, consulta `GET /user` e só devolve o token
   se o login for `ALLOWED_LOGIN`. A verificação "é o Bruno?" acontece aqui, no
   servidor, e não no navegador
4. O Worker redireciona para `/admin#token=…&state=…`. O fragmento (`#`) nunca é
   enviado a servidor nenhum; a página confere o `state`, guarda o token em
   `sessionStorage` e limpa a URL
5. A página lê e grava os três JSON pela API de contents do GitHub
   (`api.github.com` aceita CORS), usando o `sha` para detectar conflito

**Editor.** O formulário é gerado a partir da forma do próprio JSON (texto,
número, `null`, listas e objetos). Assim, um campo novo no `portfolio.json`
aparece no admin sem mudar o código do admin. Um item novo de lista copia a
forma do último item, com os valores vazios.

**Arquivos:**
- `workers/github-oauth/` — Worker, `wrangler.toml` e teste
- `src/lib/admin.ts` — chamadas à API do GitHub e funções puras (testadas)
- `src/pages/Admin.tsx` — página e formulário, carregada com `React.lazy` para
  não pesar no bundle principal
- `src/App.tsx` — rota `/admin`

O primeiro save reformata o arquivo para `JSON.stringify` com 2 espaços (hoje
alguns objetos curtos estão em uma linha só). É uma diferença única de
formatação, sem mudança de conteúdo.

## Configuração (uma vez)

1. **Criar o GitHub App** em github.com → Settings → Developer settings →
   GitHub Apps → New GitHub App:
   - Homepage URL: `https://brunocarvalhs.github.io`
   - Callback URL: a URL do Worker (passo 2), por exemplo
     `https://github-oauth.<sua-conta>.workers.dev`
   - Webhook: desmarcar "Active"
   - Permissions → Repository → Contents: **Read and write**
   - "Only on this account"
   - Depois de criar: anotar o **Client ID**, gerar um **Client secret** e
     instalar o app só no repositório `brunocarvalhs.github.io`
2. **Publicar o Worker**, dentro de `workers/github-oauth/`:
   ```bash
   npx wrangler login
   npx wrangler secret put GITHUB_CLIENT_SECRET
   npx wrangler deploy
   ```
   Antes, preencher `GITHUB_CLIENT_ID` no `wrangler.toml`.
3. **Ligar o site ao app:** preencher `GITHUB_CLIENT_ID` em `src/lib/admin.ts`
   e fazer push.

## Tarefas

- [x] Worker de troca do token com verificação do login, e teste
- [x] Funções da API e utilitários em `src/lib/admin.ts`, com teste
- [x] Página `/admin` com abas por idioma e formulário gerado do JSON
- [ ] Criar o GitHub App e publicar o Worker (configuração acima)
- [ ] Preencher o Client ID no site e testar um save de ponta a ponta
