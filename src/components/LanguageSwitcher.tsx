import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStrings } from '@/i18n/strings';
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS, LANGUAGE_NAMES } from '@/i18n/languages';
import { cn } from '@/lib/utils';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const t = useStrings();

  return (
    <div
      role="group"
      aria-label={t.language.selectorLabel}
      className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 font-mono text-xs font-semibold dark:bg-gray-800"
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          aria-pressed={language === lang}
          title={LANGUAGE_NAMES[lang]}
          className={cn(
            'rounded-md px-2 py-1 transition-colors',
            language === lang
              ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-400'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          )}
        >
          {LANGUAGE_LABELS[lang]}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
