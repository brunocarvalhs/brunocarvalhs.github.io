import ptBR from '@/data/portfolio.json';
import en from '@/data/portfolio.en.json';
import es from '@/data/portfolio.es.json';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/i18n/languages';

const PORTFOLIO_DATA: Record<Language, typeof ptBR> = { 'pt-BR': ptBR, en, es };

export function usePortfolioData() {
  const { language } = useLanguage();
  return PORTFOLIO_DATA[language];
}
