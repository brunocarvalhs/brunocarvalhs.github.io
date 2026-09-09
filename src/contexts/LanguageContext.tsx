import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_LANGUAGE, Language, detectBrowserLanguage } from '@/i18n/languages';

const STORAGE_KEY = 'language';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored) {
      setLanguageState(stored);
    } else if (typeof navigator !== 'undefined') {
      const candidates = navigator.languages?.length ? navigator.languages : [navigator.language];
      setLanguageState(detectBrowserLanguage(candidates));
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (next: Language) => {
    localStorage.setItem(STORAGE_KEY, next);
    setLanguageState(next);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
