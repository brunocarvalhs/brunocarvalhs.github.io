import { DocumentCategory, LegalDocument } from '@/types/legalTypes';
import { Language } from '@/i18n/languages';

export const parseFrontmatter = (
  markdownContent: string,
  id: string
): LegalDocument => {
  // Regexp para capturar o frontmatter entre --- e ---
  const frontmatterMatch = markdownContent.match(/^---\n([\s\S]*?)\n---/);

  let frontmatterString = '';
  let content = markdownContent;

  if (frontmatterMatch) {
    frontmatterString = frontmatterMatch[1];
    // Remove o frontmatter do conteúdo, mantendo só o texto abaixo do ---
    content = markdownContent.slice(frontmatterMatch[0].length).trim();
  }

  const data: Partial<LegalDocument> = {};

  const lines = frontmatterString.split('\n');
  lines.forEach(line => {
    const [key, ...rest] = line.split(':');
    if (!key) return;
    const value = rest.join(':').trim();

    switch (key.trim()) {
      case 'title':
        data.title = value;
        break;
      case 'description':
        data.description = value;
        break;
      case 'lastUpdated':
        data.lastUpdated = value;
        break;
      case 'category':
        // força a tipagem correta
        if (
          value === 'privacy' ||
          value === 'terms' ||
          value === 'accessibility' ||
          value === 'cookies' ||
          value === 'data'
        ) {
          data.category = value;
        }
        break;
      case 'project':
        data.project = value;
        break;
    }
  });

  // Validação simples para campos obrigatórios - pode ser ajustada conforme necessidade
  if (!data.title) data.title = 'Título não informado';
  if (!data.description) data.description = '';
  if (!data.lastUpdated) data.lastUpdated = new Date().toISOString().slice(0, 10);
  if (!data.category) data.category = 'data';

  return {
    id,
    title: data.title,
    description: data.description,
    lastUpdated: data.lastUpdated,
    category: data.category,
    project: data.project,
    content,
  };
};

// Mapeamento de categorias baseado no nome do arquivo
export const getCategoryFromFilename = (filename: string): DocumentCategory => {
  if (filename.includes('privacy')) return 'privacy';
  if (filename.includes('terms')) return 'terms';
  if (filename.includes('accessibility')) return 'accessibility';
  if (filename.includes('cookies')) return 'cookies';
  return 'data';
};

const CATEGORY_TITLES: Record<Language, Record<DocumentCategory, string>> = {
  'pt-BR': {
    privacy: 'Política de Privacidade',
    terms: 'Termos de Uso',
    accessibility: 'Acessibilidade',
    cookies: 'Política de Cookies',
    data: 'Uso e Exclusão de Dados',
  },
  en: {
    privacy: 'Privacy Policy',
    terms: 'Terms of Use',
    accessibility: 'Accessibility',
    cookies: 'Cookie Policy',
    data: 'Data Usage & Deletion',
  },
  es: {
    privacy: 'Política de Privacidad',
    terms: 'Términos de Uso',
    accessibility: 'Accesibilidad',
    cookies: 'Política de Cookies',
    data: 'Uso y Eliminación de Datos',
  },
};

const CATEGORY_DESCRIPTIONS: Record<Language, Record<DocumentCategory, (project?: string) => string>> = {
  'pt-BR': {
    privacy: (project) => `Política de privacidade${project ? ` para ${project}` : ' do portfólio'}`,
    terms: (project) => `Termos de uso${project ? ` do ${project}` : ' do portfólio'}`,
    accessibility: (project) => `Informações de acessibilidade${project ? ` do ${project}` : ''}`,
    cookies: (project) => `Política de cookies${project ? ` do ${project}` : ''}`,
    data: (project) => `Informações sobre dados${project ? ` do ${project}` : ''}`,
  },
  en: {
    privacy: (project) => `Privacy policy${project ? ` for ${project}` : ' for the portfolio'}`,
    terms: (project) => `Terms of use${project ? ` for ${project}` : ' for the portfolio'}`,
    accessibility: (project) => `Accessibility information${project ? ` for ${project}` : ''}`,
    cookies: (project) => `Cookie policy${project ? ` for ${project}` : ''}`,
    data: (project) => `Data information${project ? ` for ${project}` : ''}`,
  },
  es: {
    privacy: (project) => `Política de privacidad${project ? ` para ${project}` : ' del portafolio'}`,
    terms: (project) => `Términos de uso${project ? ` de ${project}` : ' del portafolio'}`,
    accessibility: (project) => `Información de accesibilidad${project ? ` de ${project}` : ''}`,
    cookies: (project) => `Política de cookies${project ? ` de ${project}` : ''}`,
    data: (project) => `Información sobre datos${project ? ` de ${project}` : ''}`,
  },
};

// Título exibido para o documento: rótulo da categoria (por idioma) + projeto.
export const generateTitle = (category: DocumentCategory, language: Language, project?: string): string => {
  const baseTitle = CATEGORY_TITLES[language][category];
  return project ? `${baseTitle} — ${project}` : baseTitle;
};

// Descrição exibida para o documento: baseada na categoria, idioma e projeto.
export const generateDescription = (category: DocumentCategory, language: Language, project?: string): string => {
  return CATEGORY_DESCRIPTIONS[language][category](project);
};

// Função para formatar nome do projeto
export const formatProjectName = (projectFolder: string): string => {
  const projectNames: Record<string, string> = {
    'ecommerce-app': 'E-commerce App',
    'task-manager': 'Task Manager'
  };
  
  return projectNames[projectFolder] || projectFolder.charAt(0).toUpperCase() + projectFolder.slice(1);
};

// Função para converter nome do projeto para chave
export const getProjectKey = (projectName: string): string => {
  const projectKeys: Record<string, string> = {
    'E-commerce App': 'ecommerce-app',
    'Task Manager': 'task-manager'
  };
  
  return projectKeys[projectName] || projectName.toLowerCase();
};
