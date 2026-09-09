import { Language } from '@/i18n/languages';
import { useLanguage } from '@/contexts/LanguageContext';

export interface Strings {
  seo: {
    title: string;
    description: string;
    ogLocale: string;
  };
  nav: {
    items: string[];
    legal: string;
    openMenu: string;
    closeMenu: string;
  };
  language: {
    selectorLabel: string;
  };
  hero: {
    badge: string;
    ctaProjects: string;
    openTerminalAria: string;
    clickToOpenTerminal: string;
  };
  about: {
    eyebrow: string;
  };
  projects: {
    eyebrow: string;
    liveDataNote: string;
    statRepos: string;
    statStars: string;
    statFollowers: string;
    statTopLanguage: string;
    contributionMapAlt: (user: string) => string;
    codeButton: string;
    demoButton: string;
    noDescription: string;
  };
  skills: {
    eyebrow: string;
    thresholdAdvanced: string;
    thresholdSolid: string;
    thresholdEvolving: string;
  };
  softSkills: {
    eyebrow: string;
  };
  testimonials: {
    eyebrow: string;
    viewOriginal: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    infoTitle: string;
    emailLabel: string;
    phoneLabel: string;
    locationLabel: string;
    locationValue: string;
    socialTitle: string;
    formTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailFieldLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitButton: string;
    toastTitle: string;
    toastDescription: string;
  };
  footer: {
    copyright: (year: number, name: string) => string;
  };
  legal: {
    eyebrow: string;
    title: string;
    subtitle: string;
    statsDocuments: string;
    statsProjects: string;
    statsCategories: string;
    filterByProject: string;
    allProjects: string;
    allCategories: string;
    loading: string;
    emptyState: string;
    notFoundToastTitle: string;
    notFoundToastDescription: string;
    viewButton: string;
    categories: Record<'privacy' | 'terms' | 'accessibility' | 'cookies' | 'data', string>;
  };
  legalViewer: {
    backButton: string;
    downloadButton: string;
    shareButton: string;
    copyButton: string;
    copiedButton: string;
    updatedOn: (date: string) => string;
    loading: string;
    errorContent: string;
    footerNote: string;
    shareErrorAlert: string;
  };
  notFound: {
    title: string;
    subtitle: string;
    returnHome: string;
  };
  terminal: {
    aboutFileName: string;
    welcome: (name: string) => string;
    typeHelpHint: string;
    helpCommandsHeader: string;
    helpLines: { cmd: string; desc: string }[];
    helpShortcutsHeader: string;
    helpShortcuts: { keys: string; desc: string }[];
    catUsage: string;
    catNotFound: (arg: string) => string;
    catHint: string;
    projectTech: (list: string) => string;
    projectGithub: (url: string) => string;
    projectLive: (url: string) => string;
    projectLiveUnavailable: string;
    lsHint: string;
    emailLabel: string;
    contactHint: string;
    openUnknown: (arg: string) => string;
    openHint: string;
    openOpening: (url: string) => string;
    themeChanged: (mode: string) => string;
    themeDark: string;
    themeLight: string;
    sudoPassword: string;
    sudoVerifying: string;
    sudoHiring: string;
    sudoCongrats: string;
    sudoEmail: (email: string) => string;
    sudoDenied: string;
    exitMessage: string;
    commandNotFound: (cmd: string) => string;
    triggerAriaLabel: string;
    dialogTitle: string;
    dialogDescription: (name: string) => string;
    closeAriaLabel: string;
    inputAriaLabel: string;
    dateLocale: string;
  };
}

const ptBR: Strings = {
  seo: {
    title: 'Bruno Carvalho — Desenvolvedor Android',
    description:
      'Bruno Carvalho, desenvolvedor Android com 5+ anos de experiência em Kotlin, Jetpack Compose e arquitetura, hoje no app do Itaú Unibanco. Veja projetos, apps publicados na Play Store e contato.',
    ogLocale: 'pt_BR',
  },
  nav: {
    items: ['Início', 'Sobre', 'Projetos', 'Habilidades', 'Depoimentos', 'Contato'],
    legal: 'Legal',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
  },
  language: {
    selectorLabel: 'Idioma',
  },
  hero: {
    badge: 'Disponível para novos projetos',
    ctaProjects: 'Ver Projetos',
    openTerminalAria: 'Abrir terminal interativo',
    clickToOpenTerminal: 'clique para abrir o terminal →',
  },
  about: {
    eyebrow: 'Sobre mim',
  },
  projects: {
    eyebrow: 'Portfólio',
    liveDataNote: 'repositórios mais recentes e populares, direto do GitHub',
    statRepos: 'Repositórios',
    statStars: 'Estrelas',
    statFollowers: 'Seguidores',
    statTopLanguage: 'Linguagem principal',
    contributionMapAlt: (user) => `Mapa de contribuições de ${user} no GitHub`,
    codeButton: 'Código',
    demoButton: 'Demo',
    noDescription: 'Sem descrição no GitHub ainda.',
  },
  skills: {
    eyebrow: 'Performance dashboard',
    thresholdAdvanced: 'avançado',
    thresholdSolid: 'sólido',
    thresholdEvolving: 'em evolução',
  },
  softSkills: {
    eyebrow: 'Comportamental',
  },
  testimonials: {
    eyebrow: 'Depoimentos',
    viewOriginal: 'Ver recomendação original',
  },
  contact: {
    eyebrow: 'Vamos conversar',
    title: 'Entre em Contato',
    subtitle:
      'Estou sempre aberto a novas oportunidades e projetos interessantes. Vamos conversar sobre como posso ajudar você!',
    infoTitle: 'Informações de Contato',
    emailLabel: 'Email',
    phoneLabel: 'Telefone',
    locationLabel: 'Localização',
    locationValue: 'São Paulo, Brasil',
    socialTitle: 'Redes Sociais',
    formTitle: 'Envie uma Mensagem',
    nameLabel: 'Nome',
    namePlaceholder: 'Seu nome',
    emailFieldLabel: 'Email',
    emailPlaceholder: 'seu@email.com',
    messageLabel: 'Mensagem',
    messagePlaceholder: 'Sua mensagem aqui...',
    submitButton: 'Enviar Mensagem',
    toastTitle: 'Abrindo seu app de email…',
    toastDescription: 'Confirme o envio por lá para que a mensagem chegue até mim.',
  },
  footer: {
    copyright: (year, name) => `© ${year} ${name}. Todos os direitos reservados.`,
  },
  legal: {
    eyebrow: 'Documentação',
    title: 'Documentação Legal',
    subtitle:
      'Documentos legais organizados por projeto, incluindo políticas de privacidade, termos de uso e informações sobre acessibilidade — usados na publicação dos meus apps.',
    statsDocuments: 'Documentos',
    statsProjects: 'Projetos',
    statsCategories: 'Categorias',
    filterByProject: 'Filtrar por Projeto:',
    allProjects: 'Todos os Projetos',
    allCategories: 'Todas as Categorias',
    loading: 'Carregando documentos...',
    emptyState: 'Nenhum documento encontrado para os filtros selecionados.',
    notFoundToastTitle: 'Documento não encontrado',
    notFoundToastDescription:
      'O link que você acessou aponta para um documento que não existe mais. Aqui está a lista completa.',
    viewButton: 'Visualizar',
    categories: {
      privacy: 'Privacidade',
      terms: 'Termos',
      accessibility: 'Acessibilidade',
      cookies: 'Cookies',
      data: 'Dados',
    },
  },
  legalViewer: {
    backButton: 'Voltar aos Documentos',
    downloadButton: 'Baixar',
    shareButton: 'Compartilhar',
    copyButton: 'Copiar URL',
    copiedButton: 'Copiado!',
    updatedOn: (date) => `Atualizado em ${date}`,
    loading: 'Carregando documento...',
    errorContent: 'Erro ao processar o documento.',
    footerNote:
      'Este documento faz parte da documentação legal dos projetos de propriedade do brunocarvalhs. Para questões específicas, utilize o formulário de contato.',
    shareErrorAlert: 'Erro ao copiar URL.',
  },
  notFound: {
    title: '404',
    subtitle: 'Ops! Página não encontrada',
    returnHome: 'Voltar ao Início',
  },
  terminal: {
    aboutFileName: 'sobre.md',
    welcome: (name) => `bem-vindo ao terminal de ${name} — v1.0.0`,
    typeHelpHint: 'digite "help" para ver os comandos disponíveis.',
    helpCommandsHeader: 'comandos disponíveis:',
    helpLines: [
      { cmd: 'help', desc: 'lista os comandos disponíveis' },
      { cmd: 'whoami', desc: 'quem sou eu' },
      { cmd: 'about | cat sobre.md', desc: 'bio e trajetória' },
      { cmd: 'ls | ls projetos', desc: 'lista os projetos' },
      { cmd: 'cat <projeto>.md', desc: 'detalhes de um projeto' },
      { cmd: 'skills', desc: 'categorias e principais habilidades' },
      { cmd: 'contact', desc: 'informações de contato e redes sociais' },
      { cmd: 'open github', desc: 'abre o GitHub em nova aba' },
      { cmd: 'open linkedin', desc: 'abre o LinkedIn em nova aba' },
      { cmd: 'theme', desc: 'alterna entre tema claro/escuro' },
      { cmd: 'date', desc: 'mostra a data e hora atual' },
      { cmd: 'sudo hire-me', desc: ';)' },
      { cmd: 'clear', desc: 'limpa o terminal' },
      { cmd: 'exit | close', desc: 'fecha o terminal' },
    ],
    helpShortcutsHeader: 'atalhos:',
    helpShortcuts: [
      { keys: '↑ / ↓', desc: 'navega pelo histórico de comandos' },
      { keys: 'Tab', desc: 'autocompleta comando ou argumento' },
      { keys: 'Ctrl+L', desc: 'limpa o terminal' },
      { keys: 'Ctrl+C', desc: 'cancela a linha atual' },
    ],
    catUsage: 'uso: cat <arquivo>.md',
    catNotFound: (arg) => `cat: ${arg}: arquivo não encontrado`,
    catHint: 'digite "ls" para ver os projetos disponíveis.',
    projectTech: (list) => `tecnologias: ${list}`,
    projectGithub: (url) => `github: ${url}`,
    projectLive: (url) => `live: ${url}`,
    projectLiveUnavailable: 'indisponível',
    lsHint: 'dica: "cat <arquivo>.md" para ver os detalhes de um projeto.',
    emailLabel: 'email:',
    contactHint: 'dica: "open github" ou "open linkedin" abre em uma nova aba.',
    openUnknown: (arg) => `open: destino desconhecido "${arg}"`,
    openHint: 'tente: open github  ou  open linkedin',
    openOpening: (url) => `abrindo ${url} ...`,
    themeChanged: (mode) => `tema alterado para ${mode}.`,
    themeDark: 'escuro',
    themeLight: 'claro',
    sudoPassword: '[sudo] password for visitante: ********',
    sudoVerifying: 'verificando permissões... ✔',
    sudoHiring: 'contratando Bruno Carvalho...',
    sudoCongrats: 'parabéns! você acabou de tomar a melhor decisão de contratação do ano.',
    sudoEmail: (email) => `envie um e-mail para ${email} para tornar isso realidade. 🚀`,
    sudoDenied: 'sudo: permissão negada (e ainda bem).',
    exitMessage: 'até a próxima 👋',
    commandNotFound: (cmd) => `command not found: ${cmd}`,
    triggerAriaLabel: 'Abrir terminal interativo',
    dialogTitle: 'Terminal interativo',
    dialogDescription: (name) =>
      `Terminal interativo do portfólio de ${name}. Digite comandos como help, about, ls ou skills.`,
    closeAriaLabel: 'Fechar terminal',
    inputAriaLabel: 'Linha de comando do terminal',
    dateLocale: 'pt-BR',
  },
};

const en: Strings = {
  seo: {
    title: 'Bruno Carvalho — Android Developer',
    description:
      'Bruno Carvalho, Android developer with 5+ years of experience in Kotlin, Jetpack Compose and architecture, currently on the Itaú Unibanco app. See projects, apps published on the Play Store and contact info.',
    ogLocale: 'en_US',
  },
  nav: {
    items: ['Home', 'About', 'Projects', 'Skills', 'Testimonials', 'Contact'],
    legal: 'Legal',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  language: {
    selectorLabel: 'Language',
  },
  hero: {
    badge: 'Available for new projects',
    ctaProjects: 'View Projects',
    openTerminalAria: 'Open interactive terminal',
    clickToOpenTerminal: 'click to open the terminal →',
  },
  about: {
    eyebrow: 'About me',
  },
  projects: {
    eyebrow: 'Portfolio',
    liveDataNote: 'most recent and popular repositories, straight from GitHub',
    statRepos: 'Repositories',
    statStars: 'Stars',
    statFollowers: 'Followers',
    statTopLanguage: 'Top language',
    contributionMapAlt: (user) => `${user}'s GitHub contribution map`,
    codeButton: 'Code',
    demoButton: 'Demo',
    noDescription: 'No description on GitHub yet.',
  },
  skills: {
    eyebrow: 'Performance Dashboard',
    thresholdAdvanced: 'advanced',
    thresholdSolid: 'solid',
    thresholdEvolving: 'evolving',
  },
  softSkills: {
    eyebrow: 'Behavioral',
  },
  testimonials: {
    eyebrow: 'Testimonials',
    viewOriginal: 'View original recommendation',
  },
  contact: {
    eyebrow: "Let's talk",
    title: 'Get in Touch',
    subtitle:
      "I'm always open to new opportunities and interesting projects. Let's talk about how I can help you!",
    infoTitle: 'Contact Information',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    locationLabel: 'Location',
    locationValue: 'São Paulo, Brazil',
    socialTitle: 'Social Media',
    formTitle: 'Send a Message',
    nameLabel: 'Name',
    namePlaceholder: 'Your name',
    emailFieldLabel: 'Email',
    emailPlaceholder: 'your@email.com',
    messageLabel: 'Message',
    messagePlaceholder: 'Your message here...',
    submitButton: 'Send Message',
    toastTitle: 'Opening your email app…',
    toastDescription: 'Confirm the send there so the message reaches me.',
  },
  footer: {
    copyright: (year, name) => `© ${year} ${name}. All rights reserved.`,
  },
  legal: {
    eyebrow: 'Documentation',
    title: 'Legal Documentation',
    subtitle:
      'Legal documents organized by project, including privacy policies, terms of use and accessibility information — used when publishing my apps.',
    statsDocuments: 'Documents',
    statsProjects: 'Projects',
    statsCategories: 'Categories',
    filterByProject: 'Filter by Project:',
    allProjects: 'All Projects',
    allCategories: 'All Categories',
    loading: 'Loading documents...',
    emptyState: 'No documents found for the selected filters.',
    notFoundToastTitle: 'Document not found',
    notFoundToastDescription:
      "The link you followed points to a document that no longer exists. Here's the full list.",
    viewButton: 'View',
    categories: {
      privacy: 'Privacy',
      terms: 'Terms',
      accessibility: 'Accessibility',
      cookies: 'Cookies',
      data: 'Data',
    },
  },
  legalViewer: {
    backButton: 'Back to Documents',
    downloadButton: 'Download',
    shareButton: 'Share',
    copyButton: 'Copy URL',
    copiedButton: 'Copied!',
    updatedOn: (date) => `Updated on ${date}`,
    loading: 'Loading document...',
    errorContent: 'Error processing the document.',
    footerNote:
      'This document is part of the legal documentation for projects owned by brunocarvalhs. For specific questions, use the contact form.',
    shareErrorAlert: 'Error copying URL.',
  },
  notFound: {
    title: '404',
    subtitle: 'Oops! Page not found',
    returnHome: 'Return to Home',
  },
  terminal: {
    aboutFileName: 'about.md',
    welcome: (name) => `welcome to ${name}'s terminal — v1.0.0`,
    typeHelpHint: 'type "help" to see the available commands.',
    helpCommandsHeader: 'available commands:',
    helpLines: [
      { cmd: 'help', desc: 'lists the available commands' },
      { cmd: 'whoami', desc: 'who I am' },
      { cmd: 'about | cat about.md', desc: 'bio and background' },
      { cmd: 'ls | ls projects', desc: 'lists the projects' },
      { cmd: 'cat <project>.md', desc: "a project's details" },
      { cmd: 'skills', desc: 'categories and main skills' },
      { cmd: 'contact', desc: 'contact info and social links' },
      { cmd: 'open github', desc: 'opens GitHub in a new tab' },
      { cmd: 'open linkedin', desc: 'opens LinkedIn in a new tab' },
      { cmd: 'theme', desc: 'toggles light/dark theme' },
      { cmd: 'date', desc: 'shows the current date and time' },
      { cmd: 'sudo hire-me', desc: ';)' },
      { cmd: 'clear', desc: 'clears the terminal' },
      { cmd: 'exit | close', desc: 'closes the terminal' },
    ],
    helpShortcutsHeader: 'shortcuts:',
    helpShortcuts: [
      { keys: '↑ / ↓', desc: 'navigates command history' },
      { keys: 'Tab', desc: 'autocompletes command or argument' },
      { keys: 'Ctrl+L', desc: 'clears the terminal' },
      { keys: 'Ctrl+C', desc: 'cancels the current line' },
    ],
    catUsage: 'usage: cat <file>.md',
    catNotFound: (arg) => `cat: ${arg}: file not found`,
    catHint: 'type "ls" to see the available projects.',
    projectTech: (list) => `technologies: ${list}`,
    projectGithub: (url) => `github: ${url}`,
    projectLive: (url) => `live: ${url}`,
    projectLiveUnavailable: 'unavailable',
    lsHint: 'tip: "cat <file>.md" to see a project\'s details.',
    emailLabel: 'email:',
    contactHint: 'tip: "open github" or "open linkedin" opens in a new tab.',
    openUnknown: (arg) => `open: unknown target "${arg}"`,
    openHint: 'try: open github  or  open linkedin',
    openOpening: (url) => `opening ${url} ...`,
    themeChanged: (mode) => `theme switched to ${mode}.`,
    themeDark: 'dark',
    themeLight: 'light',
    sudoPassword: '[sudo] password for visitor: ********',
    sudoVerifying: 'verifying permissions... ✔',
    sudoHiring: 'hiring Bruno Carvalho...',
    sudoCongrats: 'congratulations! you just made the best hiring decision of the year.',
    sudoEmail: (email) => `send an email to ${email} to make it happen. 🚀`,
    sudoDenied: 'sudo: permission denied (and rightfully so).',
    exitMessage: 'see you next time 👋',
    commandNotFound: (cmd) => `command not found: ${cmd}`,
    triggerAriaLabel: 'Open interactive terminal',
    dialogTitle: 'Interactive terminal',
    dialogDescription: (name) =>
      `${name}'s interactive portfolio terminal. Type commands like help, about, ls or skills.`,
    closeAriaLabel: 'Close terminal',
    inputAriaLabel: 'Terminal command line',
    dateLocale: 'en-US',
  },
};

const es: Strings = {
  seo: {
    title: 'Bruno Carvalho — Desarrollador Android',
    description:
      'Bruno Carvalho, desarrollador Android con más de 5 años de experiencia en Kotlin, Jetpack Compose y arquitectura, hoy en la app del Itaú Unibanco. Mira proyectos, apps publicadas en Play Store y contacto.',
    ogLocale: 'es_ES',
  },
  nav: {
    items: ['Inicio', 'Sobre mí', 'Proyectos', 'Habilidades', 'Testimonios', 'Contacto'],
    legal: 'Legal',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
  },
  language: {
    selectorLabel: 'Idioma',
  },
  hero: {
    badge: 'Disponible para nuevos proyectos',
    ctaProjects: 'Ver Proyectos',
    openTerminalAria: 'Abrir terminal interactivo',
    clickToOpenTerminal: 'haz clic para abrir la terminal →',
  },
  about: {
    eyebrow: 'Sobre mí',
  },
  projects: {
    eyebrow: 'Portafolio',
    liveDataNote: 'repositorios más recientes y populares, directo de GitHub',
    statRepos: 'Repositorios',
    statStars: 'Estrellas',
    statFollowers: 'Seguidores',
    statTopLanguage: 'Lenguaje principal',
    contributionMapAlt: (user) => `Mapa de contribuciones de ${user} en GitHub`,
    codeButton: 'Código',
    demoButton: 'Demo',
    noDescription: 'Aún sin descripción en GitHub.',
  },
  skills: {
    eyebrow: 'Panel de Rendimiento',
    thresholdAdvanced: 'avanzado',
    thresholdSolid: 'sólido',
    thresholdEvolving: 'en evolución',
  },
  softSkills: {
    eyebrow: 'Conductual',
  },
  testimonials: {
    eyebrow: 'Testimonios',
    viewOriginal: 'Ver recomendación original',
  },
  contact: {
    eyebrow: 'Hablemos',
    title: 'Ponte en Contacto',
    subtitle:
      'Siempre estoy abierto a nuevas oportunidades y proyectos interesantes. ¡Hablemos sobre cómo puedo ayudarte!',
    infoTitle: 'Información de Contacto',
    emailLabel: 'Email',
    phoneLabel: 'Teléfono',
    locationLabel: 'Ubicación',
    locationValue: 'São Paulo, Brasil',
    socialTitle: 'Redes Sociales',
    formTitle: 'Envía un Mensaje',
    nameLabel: 'Nombre',
    namePlaceholder: 'Tu nombre',
    emailFieldLabel: 'Email',
    emailPlaceholder: 'tu@email.com',
    messageLabel: 'Mensaje',
    messagePlaceholder: 'Tu mensaje aquí...',
    submitButton: 'Enviar Mensaje',
    toastTitle: 'Abriendo tu app de correo…',
    toastDescription: 'Confirma el envío allí para que el mensaje me llegue.',
  },
  footer: {
    copyright: (year, name) => `© ${year} ${name}. Todos los derechos reservados.`,
  },
  legal: {
    eyebrow: 'Documentación',
    title: 'Documentación Legal',
    subtitle:
      'Documentos legales organizados por proyecto, incluyendo políticas de privacidad, términos de uso e información de accesibilidad — utilizados en la publicación de mis apps.',
    statsDocuments: 'Documentos',
    statsProjects: 'Proyectos',
    statsCategories: 'Categorías',
    filterByProject: 'Filtrar por Proyecto:',
    allProjects: 'Todos los Proyectos',
    allCategories: 'Todas las Categorías',
    loading: 'Cargando documentos...',
    emptyState: 'No se encontraron documentos para los filtros seleccionados.',
    notFoundToastTitle: 'Documento no encontrado',
    notFoundToastDescription:
      'El enlace al que accediste apunta a un documento que ya no existe. Aquí está la lista completa.',
    viewButton: 'Ver',
    categories: {
      privacy: 'Privacidad',
      terms: 'Términos',
      accessibility: 'Accesibilidad',
      cookies: 'Cookies',
      data: 'Datos',
    },
  },
  legalViewer: {
    backButton: 'Volver a los Documentos',
    downloadButton: 'Descargar',
    shareButton: 'Compartir',
    copyButton: 'Copiar URL',
    copiedButton: '¡Copiado!',
    updatedOn: (date) => `Actualizado el ${date}`,
    loading: 'Cargando documento...',
    errorContent: 'Error al procesar el documento.',
    footerNote:
      'Este documento forma parte de la documentación legal de los proyectos propiedad de brunocarvalhs. Para preguntas específicas, utiliza el formulario de contacto.',
    shareErrorAlert: 'Error al copiar la URL.',
  },
  notFound: {
    title: '404',
    subtitle: '¡Ups! Página no encontrada',
    returnHome: 'Volver al Inicio',
  },
  terminal: {
    aboutFileName: 'sobre.md',
    welcome: (name) => `bienvenido a la terminal de ${name} — v1.0.0`,
    typeHelpHint: 'escribe "help" para ver los comandos disponibles.',
    helpCommandsHeader: 'comandos disponibles:',
    helpLines: [
      { cmd: 'help', desc: 'lista los comandos disponibles' },
      { cmd: 'whoami', desc: 'quién soy' },
      { cmd: 'about | cat sobre.md', desc: 'biografía y trayectoria' },
      { cmd: 'ls | ls projects', desc: 'lista los proyectos' },
      { cmd: 'cat <proyecto>.md', desc: 'detalles de un proyecto' },
      { cmd: 'skills', desc: 'categorías y principales habilidades' },
      { cmd: 'contact', desc: 'información de contacto y redes sociales' },
      { cmd: 'open github', desc: 'abre GitHub en una nueva pestaña' },
      { cmd: 'open linkedin', desc: 'abre LinkedIn en una nueva pestaña' },
      { cmd: 'theme', desc: 'alterna entre tema claro/oscuro' },
      { cmd: 'date', desc: 'muestra la fecha y hora actual' },
      { cmd: 'sudo hire-me', desc: ';)' },
      { cmd: 'clear', desc: 'limpia la terminal' },
      { cmd: 'exit | close', desc: 'cierra la terminal' },
    ],
    helpShortcutsHeader: 'atajos:',
    helpShortcuts: [
      { keys: '↑ / ↓', desc: 'navega por el historial de comandos' },
      { keys: 'Tab', desc: 'autocompleta comando o argumento' },
      { keys: 'Ctrl+L', desc: 'limpia la terminal' },
      { keys: 'Ctrl+C', desc: 'cancela la línea actual' },
    ],
    catUsage: 'uso: cat <archivo>.md',
    catNotFound: (arg) => `cat: ${arg}: archivo no encontrado`,
    catHint: 'escribe "ls" para ver los proyectos disponibles.',
    projectTech: (list) => `tecnologías: ${list}`,
    projectGithub: (url) => `github: ${url}`,
    projectLive: (url) => `demo: ${url}`,
    projectLiveUnavailable: 'no disponible',
    lsHint: 'consejo: "cat <archivo>.md" para ver los detalles de un proyecto.',
    emailLabel: 'email:',
    contactHint: 'consejo: "open github" o "open linkedin" abre en una nueva pestaña.',
    openUnknown: (arg) => `open: destino desconocido "${arg}"`,
    openHint: 'prueba: open github  o  open linkedin',
    openOpening: (url) => `abriendo ${url} ...`,
    themeChanged: (mode) => `tema cambiado a ${mode}.`,
    themeDark: 'oscuro',
    themeLight: 'claro',
    sudoPassword: '[sudo] password for visitante: ********',
    sudoVerifying: 'verificando permisos... ✔',
    sudoHiring: 'contratando a Bruno Carvalho...',
    sudoCongrats: '¡felicidades! acabas de tomar la mejor decisión de contratación del año.',
    sudoEmail: (email) => `envía un correo a ${email} para hacerlo realidad. 🚀`,
    sudoDenied: 'sudo: permiso denegado (menos mal).',
    exitMessage: 'hasta la próxima 👋',
    commandNotFound: (cmd) => `command not found: ${cmd}`,
    triggerAriaLabel: 'Abrir terminal interactivo',
    dialogTitle: 'Terminal interactivo',
    dialogDescription: (name) =>
      `Terminal interactivo del portafolio de ${name}. Escribe comandos como help, about, ls o skills.`,
    closeAriaLabel: 'Cerrar terminal',
    inputAriaLabel: 'Línea de comandos de la terminal',
    dateLocale: 'es-ES',
  },
};

export const STRINGS: Record<Language, Strings> = { 'pt-BR': ptBR, en, es };

export function useStrings(): Strings {
  const { language } = useLanguage();
  return STRINGS[language];
}
