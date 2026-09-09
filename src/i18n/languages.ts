export const SUPPORTED_LANGUAGES = ['pt-BR', 'en', 'es'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = 'pt-BR';

export const LANGUAGE_LABELS: Record<Language, string> = {
  'pt-BR': 'PT',
  en: 'EN',
  es: 'ES',
};

export const LANGUAGE_NAMES: Record<Language, string> = {
  'pt-BR': 'Português',
  en: 'English',
  es: 'Español',
};

/**
 * Maps a BCP-47 tag (e.g. "en-US", "es-AR", "pt-PT") to one of our
 * supported languages. Portuguese variants other than pt-BR still fall
 * back to pt-BR — it's the language the rest of the content is written in
 * natively, and closer to any Portuguese visitor than English or Spanish.
 */
function matchLanguage(tag: string): Language | null {
  const normalized = tag.toLowerCase();
  if (normalized.startsWith('en')) return 'en';
  if (normalized.startsWith('es')) return 'es';
  if (normalized.startsWith('pt')) return 'pt-BR';
  return null;
}

export function detectBrowserLanguage(candidates: readonly string[]): Language {
  for (const candidate of candidates) {
    const match = matchLanguage(candidate);
    if (match) return match;
  }
  return DEFAULT_LANGUAGE;
}
