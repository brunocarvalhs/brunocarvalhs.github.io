import { LegalDocument } from '@/types/legalTypes';
import { getCategoryFromFilename, generateTitle, generateDescription, formatProjectName } from '@/utils/documentUtils';

function parseFrontmatter(raw: string) {
  const match = /^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, content: raw };

  const frontmatterRaw = match[1];
  const content = match[2];

  const data: Record<string, string> = {};
  frontmatterRaw.split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length > 0) {
      data[key.trim()] = rest.join(':').trim();
    }
  });

  return { data, content };
}

async function loadLegalDocuments(modules: Record<string, () => Promise<string>>): Promise<LegalDocument[]> {
  const documents: LegalDocument[] = [];

  for (const path in modules) {
    try {
      const rawContent = await modules[path]();
      const { data: frontmatter, content: markdownContent } = parseFrontmatter(rawContent);

      const parts = path.split('/');
      const filename = parts.pop()!;
      const folder = parts.pop()!;

      const category = getCategoryFromFilename(filename);
      const isRoot = folder === 'legal-docs';
      const projectName = isRoot ? undefined : formatProjectName(folder);

      const id = isRoot
        ? filename.replace(/\.(md|txt)$/i, '')
        : `${folder}-${filename.replace(/\.(md|txt)$/i, '')}`;

      const title = generateTitle(filename, projectName);
      const description = generateDescription(category, projectName);

      const lastUpdated = frontmatter.lastUpdated
        ? new Date(frontmatter.lastUpdated).toISOString()
        : new Date().toISOString();

      const doc: LegalDocument = {
        id,
        title,
        description,
        content: markdownContent,
        lastUpdated,
        category,
      };

      if (!isRoot) {
        doc.project = projectName;
      }

      documents.push(doc);
    } catch (error) {
      console.error(`Erro ao importar arquivo ${path}`, error);
    }
  }

  return documents;
}

const modules = import.meta.glob('../data/legal-docs/**/*.md', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>;

export async function discoverLegalDocuments(): Promise<LegalDocument[]> {
  try {
    const documents = await loadLegalDocuments(modules);
    return documents;
  } catch (error) {
    console.error('Erro ao carregar documentos legais:', error);
    return [];
  }
}