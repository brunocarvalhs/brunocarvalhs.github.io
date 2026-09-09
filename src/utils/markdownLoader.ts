import { LegalDocument } from '@/types/legalTypes';
import { discoverLegalDocuments } from '@/services/fileDiscoveryService';
import { getProjectKey } from '@/utils/documentUtils';
import { Language, DEFAULT_LANGUAGE } from '@/i18n/languages';

const documentsCache: Partial<Record<Language, LegalDocument[]>> = {};

export const getAllDocuments = async (language: Language = DEFAULT_LANGUAGE): Promise<LegalDocument[]> => {
  if (!documentsCache[language]) {
    documentsCache[language] = await discoverLegalDocuments(language);
  }
  return documentsCache[language]!;
};

export const getDocumentsByProject = async (projectKey?: string, language: Language = DEFAULT_LANGUAGE): Promise<LegalDocument[]> => {
  const allDocs = await getAllDocuments(language);

  if (!projectKey) {
    return allDocs.filter(doc => !doc.project);
  }

  return allDocs.filter(doc => doc.project === projectKey);
};
export const getProjects = async (language: Language = DEFAULT_LANGUAGE): Promise<string[]> => {
  const allDocs = await getAllDocuments(language);
  const projects = [...new Set(allDocs.filter(doc => doc.project).map(doc => getProjectKey(doc.project || '')))];
  return projects.filter(Boolean);
};

export { markdownToHtml } from '@/services/markdownService';
export type { LegalDocument } from '@/types/legalTypes';
