import { LegalDocument } from '@/types/legalTypes';
import { discoverLegalDocuments } from '@/services/fileDiscoveryService';
import { getProjectKey } from '@/utils/documentUtils';

let documentsCache: LegalDocument[] | null = null;

export const getAllDocuments = async (): Promise<LegalDocument[]> => {
  if (!documentsCache) {
    documentsCache = await discoverLegalDocuments();
  }
  return documentsCache;
};

export const getDocumentsByProject = async (projectKey?: string): Promise<LegalDocument[]> => {
  const allDocs = await getAllDocuments();

  if (!projectKey) {
    return allDocs.filter(doc => !doc.project);
  }

  return allDocs.filter(doc => doc.project === projectKey);
};
export const getProjects = async (): Promise<string[]> => {
  const allDocs = await getAllDocuments();
  const projects = [...new Set(allDocs.filter(doc => doc.project).map(doc => getProjectKey(doc.project || '')))];
  return projects.filter(Boolean);
};

export { markdownToHtml } from '@/services/markdownService';
export type { LegalDocument } from '@/types/legalTypes';
