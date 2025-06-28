export interface LegalDocument {
  id: string;
  title: string;
  description: string;
  content: string;
  lastUpdated: string;
  category: 'privacy' | 'terms' | 'accessibility' | 'cookies' | 'data';
  project?: string;
}

export type DocumentCategory = 'privacy' | 'terms' | 'accessibility' | 'cookies' | 'data';
