# Portfolio Bruno Carvalho

[![GitHub license](https://img.shields.io/github/license/brunocarvalhs/brunocarvalhs.github.io)](https://github.com/brunocarvalhs/brunocarvalhs.github.io/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/brunocarvalhs/brunocarvalhs.github.io)](https://github.com/brunocarvalhs/brunocarvalhs.github.io/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/brunocarvalhs/brunocarvalhs.github.io)](https://github.com/brunocarvalhs/brunocarvalhs.github.io/issues)

Este e meu portfolio pessoal, desenvolvido com Angular para exibir meus projetos, habilidades e informacoes de contato de forma interativa e responsiva. O site integra-se com a API do GitHub para exibir automaticamente meus repositorios publicos.

## Tecnologias Utilizadas

- **React**: Framework para construcao da interface
- **TypeScript**: Linguagem de programacao
- **GitHub API**: Integracao para exibir projetos publicos

## Funcionalidades

- **Secao de Apresentacao**: Introducao pessoal com animacoes
- **Sobre Mim**: Informacoes detalhadas sobre minha experiencia e formacao
- **Projetos**: Exibicao automatica dos repositorios do GitHub
- **Habilidades**: Visualizacao das tecnologias que domino
- **Contato**: Formulario para envio de mensagens

## Instalacao e Execucao

### Pre-requisitos

- Node.js (versao 18 ou superior)
- npm ou yarn

### Instalacao

```bash
# Clone o repositorio
git clone https://github.com/brunocarvalhs/brunocarvalhs.github.io.git

# Entre no diretorio
cd brunocarvalhs.github.io

# Instale as dependencias
npm install
```

### Execucao

```bash
# Servidor de desenvolvimento
ng serve

# Acesse http://localhost:4200/
```

### Compilacao para producao

```bash
# Compilar o projeto
ng build --prod

# Os arquivos serao gerados na pasta dist/
```

## Testes

```bash
# Executar testes unitarios
ng test

# Executar testes end-to-end
ng e2e
```

## Estrutura do Projeto

```
src/
├── app/
│   ├── components/       # Componentes reutilizaveis
│   ├── models/           # Interfaces e classes de modelo
│   ├── pages/            # Paginas da aplicacao
│   │   └── home/
│   │       └── section/  # Secoes da pagina inicial
│   └── services/         # Servicos para integracao com APIs
├── assets/
│   ├── images/           # Imagens utilizadas no site
│   └── scss/             # Arquivos de estilo SCSS
└── environments/         # Configuracoes de ambiente
```

## Contribuicao

Contribuicoes sao bem-vindas! Sinta-se a vontade para abrir issues ou enviar pull requests.

1. Faca um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faca commit das suas alteracoes (`git commit -m 'Adiciona nova feature'`)
4. Faca push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licenca

Este projeto esta licenciado sob a licenca MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contato

- **Email**: brunocarvalhs@outlook.com.br
- **LinkedIn**: [brunocarvalhs](https://www.linkedin.com/in/brunocarvalhs/)
- **GitHub**: [brunocarvalhs](https://github.com/brunocarvalhs)