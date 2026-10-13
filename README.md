# Portfólio Bruno Carvalho

Meu portfólio pessoal, no ar em **https://brunocarvalhs.github.io/**.

Reúne apresentação, projetos, habilidades, depoimentos e contato, em três idiomas (pt-BR, en e es) e com tema claro e escuro. Os projetos são combinados com os repositórios públicos do meu GitHub, buscados pela API deles.

## Stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS** e **shadcn/ui** (sobre Radix)
- **react-router-dom** para as rotas
- **Vitest + Testing Library** para os testes
- **GitHub Pages**, com deploy automático pelo GitHub Actions

## O que tem no site

- **Seções da home:** apresentação, sobre mim, projetos, habilidades, soft skills, depoimentos e contato
- **Terminal interativo** (`help`, `whoami`, `ls`, `cat`…) para explorar o conteúdo pelo teclado
- **Projetos ao vivo:** a lista mistura `portfolio.json` com os repositórios públicos do GitHub
- **Três idiomas:** detecta o idioma do navegador e deixa trocar manualmente
- **Documentos legais** em `/legal`: políticas de privacidade e termos de uso dos meus apps Android, linkados de dentro dos próprios apps

## Como rodar

Precisa de **Node 22 ou superior** (o CI usa o 22).

```bash
git clone https://github.com/brunocarvalhs/brunocarvalhs.github.io.git
cd brunocarvalhs.github.io
npm install
npm run dev        # http://localhost:8080
```

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (porta 8080) |
| `npm run build` | Build de produção em `build/` |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | ESLint |
| `npm run test` | Testes, uma execução só (o que o CI roda) |
| `npm run test:watch` | Testes em modo watch |

## Como editar o conteúdo

Quase todo o texto do site mora em JSON, não nos componentes:

- `src/data/portfolio.json`: pt-BR, a fonte principal
- `src/data/portfolio.en.json` e `src/data/portfolio.es.json`: as traduções

Para trocar um texto, adicionar um projeto ou uma skill, edite **os três arquivos**. Os textos fixos da interface (menus, botões, avisos) ficam em `src/i18n/strings.ts`.

## Estrutura

```
src/
├── components/   # Seções da home, terminal, header e footer
├── contexts/     # Tema e idioma
├── data/         # portfolio*.json e os documentos legais (legal-docs/)
├── hooks/        # Dados do portfólio e da API do GitHub
├── i18n/         # Idiomas e textos fixos
├── pages/        # Home, /legal e 404
└── services/     # Leitura dos documentos legais em Markdown
public/           # robots.txt, sitemap.xml e imagens
scripts/          # Pré-renderização da página /legal
specs/            # Specs de funcionalidades planejadas
```

## Deploy

Todo push na `master` roda o CI (`lint`, `test` e `build`) e, passando, publica `build/` na branch `gh-pages`. Não há passo manual.

O GitHub Pages não faz reescrita de rotas, então o `npm run build` copia o `index.html` para `404.html`. É isso que faz links diretos como `/legal?doc=...` funcionarem. Não remova esse passo.

## Para quem usa o Claude Code

O `CLAUDE.md` descreve a arquitetura e as convenções do projeto. Funcionalidades novas começam por uma spec em `specs/` (veja `specs/README.md`).

## Contato

- **E-mail:** brunocarvalhs@outlook.com.br
- **LinkedIn:** [brunocarvalhs](https://www.linkedin.com/in/brunocarvalhs/)
- **GitHub:** [brunocarvalhs](https://github.com/brunocarvalhs)
