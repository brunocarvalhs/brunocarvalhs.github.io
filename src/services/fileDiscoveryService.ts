import { LegalDocument } from '@/types/legalTypes';
import { getCategoryFromFilename, generateTitle, generateDescription, formatProjectName } from '@/utils/documentUtils';
import { Language, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@/i18n/languages';

// Importa dinamicamente todos os arquivos .md dentro da pasta legal-docs e subpastas
const modules = import.meta.glob('../data/legal-docs/**/*.md', {
    query: '?raw', import: 'default'
});

// Arquivos podem trazer o idioma no próprio nome (ex: privacy-policy.en.md).
// Sem sufixo, o arquivo é tratado como pt-BR (idioma original dos primeiros
// documentos publicados).
const LANGUAGE_SUFFIX_RE = new RegExp(`\\.(${SUPPORTED_LANGUAGES.join('|')})\\.md$`, 'i');

function splitLanguageSuffix(filename: string): { baseFilename: string; language: Language } {
    const match = LANGUAGE_SUFFIX_RE.exec(filename);
    if (!match) return { baseFilename: filename, language: DEFAULT_LANGUAGE };
    const language = SUPPORTED_LANGUAGES.find((l) => l.toLowerCase() === match[1].toLowerCase()) ?? DEFAULT_LANGUAGE;
    return { baseFilename: filename.replace(LANGUAGE_SUFFIX_RE, '.md'), language };
}

// Função simples para extrair frontmatter manualmente
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

// Carrega e agrupa todos os documentos por idioma, a partir do sufixo no
// nome do arquivo (ver splitLanguageSuffix). O id de um documento é sempre
// derivado do nome-base (sem o sufixo de idioma), então fica estável entre
// idiomas — importante porque links de dentro dos apps apontam para
// `?doc=<id>` e não devem quebrar quando o visitante muda de idioma.
async function discoverAllDocumentsByLanguage(): Promise<Record<Language, LegalDocument[]>> {
    const byLanguage: Record<Language, LegalDocument[]> = { 'pt-BR': [], en: [], es: [] };

    for (const path in modules) {
        try {
            const rawContent = (await modules[path]()) as string;

            // Frontmatter manual (só lastUpdated é usado hoje)
            const { data: frontmatter, content: markdownContent } = parseFrontmatter(rawContent);

            // Extrair filename e folder do path
            const parts = path.split('/');
            const rawFilename = parts.pop()!;
            const folder = parts.pop()!;
            const { baseFilename: filename, language } = splitLanguageSuffix(rawFilename);

            const category = getCategoryFromFilename(filename);
            const isRoot = folder === 'legal-docs';
            const projectName = isRoot ? undefined : formatProjectName(folder);

            const id = isRoot
                ? filename.replace(/\.(md|txt)$/i, '')
                : `${folder}-${filename.replace(/\.(md|txt)$/i, '')}`;

            const title = generateTitle(category, language, projectName);
            const description = generateDescription(category, language, projectName);

            // lastUpdated como string do frontmatter ou data atual
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

            byLanguage[language].push(doc);
        } catch (error) {
            console.error(`Erro ao importar arquivo ${path}`, error);
        }
    }

    return byLanguage;
}

let documentsByLanguageCache: Record<Language, LegalDocument[]> | null = null;

export const discoverLegalDocuments = async (language: Language = DEFAULT_LANGUAGE): Promise<LegalDocument[]> => {
    if (!documentsByLanguageCache) {
        documentsByLanguageCache = await discoverAllDocumentsByLanguage();
    }

    // Se uma tradução específica faltar, cai para o pt-BR em vez de o
    // documento simplesmente sumir da listagem.
    const primary = documentsByLanguageCache[language] ?? [];
    const fallback = documentsByLanguageCache[DEFAULT_LANGUAGE] ?? [];
    const seenIds = new Set(primary.map((d) => d.id));
    return [...primary, ...fallback.filter((d) => !seenIds.has(d.id))];
};
