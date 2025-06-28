import { DocDocument, DocDocumentCategory } from '@/types/documentTypes';
import { getCategoryFromFilename, generateTitle, generateDescription, formatProjectName } from '@/utils/documentUtils';

async function loadDocDocuments(
  modules: Record<string, () => Promise<string>>
): Promise<DocDocument[]> {
  const parseFrontmatter = (raw: string) => {
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
  };

  const documents: DocDocument[] = [];

  for (const path in modules) {
    try {
      const rawContent = await modules[path]();
      const { data: frontmatter, content: markdownContent } = parseFrontmatter(rawContent);

      const parts = path.split('/');
      const filename = parts.pop()!;
      const folder = parts.pop()!;

      // Categoria pelo filename ou frontmatter
      const categoryFromFile = getCategoryFromFilename(filename) as DocDocumentCategory;
      const category: DocDocumentCategory = frontmatter.category as DocDocumentCategory || categoryFromFile;

      // Projeto e assunto extraídos do path ou frontmatter
      const isRoot = folder === 'documents';
      const project = frontmatter.project || (isRoot ? 'geral' : formatProjectName(folder));
      const subject = frontmatter.subject || 'documentos';

      const id = isRoot
        ? filename.replace(/\.(md|txt)$/i, '')
        : `${folder}-${filename.replace(/\.(md|txt)$/i, '')}`;

      const title = frontmatter.title || generateTitle(filename, project);
      const description = frontmatter.description || generateDescription(category, project);

      const lastUpdated = frontmatter.lastUpdated
        ? new Date(frontmatter.lastUpdated).toISOString()
        : new Date().toISOString();

      // Extrair tags do frontmatter, caso exista
      const tags = frontmatter.tags
        ? frontmatter.tags.split(',').map((tag: string) => tag.trim())
        : undefined;

      const doc: DocDocument = {
        id,
        title,
        description,
        content: markdownContent,
        lastUpdated,
        category,
        project,
        subject,
        filePath: path.replace(/^..\/data\//, ''), // relativo a partir da pasta data
        tags,
      };

      documents.push(doc);
    } catch (error) {
      console.error(`Erro ao importar arquivo ${path}`, error);
    }
  }

  return documents;
}

const modules = import.meta.glob('../data/documents/**/*.md', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>;

export async function discoverLegalDocuments(): Promise<DocDocument[]> {
  try {
    const documents = await loadDocDocuments(modules);
    return documents;
  } catch (error) {
    console.error('Erro ao carregar documentos legais:', error);
    return [];
  }
}
