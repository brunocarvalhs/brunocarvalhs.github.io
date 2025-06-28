import { DocumentCategory, LegalDocument } from '@/types/legalTypes';

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

// Função para gerar título baseado no filename e projeto
export const generateTitle = (filename: string, project?: string): string => {
  const baseTitle = filename
    .replace(/\.(md|txt)$/i, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return project ? `${baseTitle} - ${project}` : baseTitle;
};

// Função para gerar descrição baseada na categoria e projeto
export const generateDescription = (category: string, project?: string): string => {
  const descriptions = {
    privacy: `Política de privacidade${project ? ` para ${project}` : ' do portfólio'}`,
    terms: `Termos de uso${project ? ` do ${project}` : ' do portfólio'}`,
    accessibility: `Informações de acessibilidade${project ? ` do ${project}` : ''}`,
    cookies: `Política de cookies${project ? ` do ${project}` : ''}`,
    data: `Informações sobre dados${project ? ` do ${project}` : ''}`
  };
  
  return descriptions[category as keyof typeof descriptions] || `Documento legal${project ? ` do ${project}` : ''}`;
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
