import { discoverLegalDocuments } from '@/services/docDocumentsLoader';
import { getProjectKey } from '@/utils/documentUtils';
import { DocDocument } from '@/types/documentTypes';

let documentsCache: DocDocument[] | null = null;

// Retorna todos os documentos gerais
export const getAllDocuments = async (): Promise<DocDocument[]> => {
    if (!documentsCache) {
        documentsCache = await discoverLegalDocuments();
    }
    return documentsCache!;
};

// Retorna documentos gerais filtrando por projeto
export const getDocumentsByProject = async (projectKey?: string): Promise<DocDocument[]> => {
    const allDocs = await getAllDocuments();

    if (!projectKey) {
        return allDocs.filter(doc => !doc.project);
    }

    return allDocs.filter(doc => doc.project === projectKey);
};

export { markdownToHtml } from '@/services/markdownService';

// Retorna todos os projetos únicos de documentos gerais
export const getProjects = async (): Promise<string[]> => {
    const allDocs = await getAllDocuments();
    const projects = [...new Set(allDocs.filter(doc => doc.project).map(doc => getProjectKey(doc.project || '')))];
    return projects.filter(Boolean);
};
