import { Shield, Scale, Accessibility, Database, FileText, LucideIcon } from 'lucide-react';
import type { DocumentCategory } from '@/types/legalTypes';

export const categoryLabels: Record<DocumentCategory, string> = {
  privacy: 'Privacidade',
  terms: 'Termos',
  accessibility: 'Acessibilidade',
  cookies: 'Cookies',
  data: 'Dados',
};

export const categoryColors: Record<DocumentCategory, string> = {
  privacy: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
  terms: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
  accessibility: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
  cookies: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
  data: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
};

export const categoryIcons: Record<DocumentCategory, LucideIcon> = {
  privacy: Shield,
  terms: Scale,
  accessibility: Accessibility,
  cookies: Database,
  data: FileText,
};
