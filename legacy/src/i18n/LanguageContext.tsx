import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, Direction, TranslationsSchema, TRANSLATIONS } from './translations';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  isRtl: boolean;
  t: TranslationsSchema;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  tr: (path: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'kasp_scholarship_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'ar') {
        return saved;
      }
    } catch {
      // ignore storage error
    }
    return 'ar';
  });

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';
  const isRtl = direction === 'rtl';
  const currentTranslations = TRANSLATIONS[language];

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // ignore
    }

    // Apply HTML attributes
    document.documentElement.lang = language;
    document.documentElement.dir = direction;

    // Apply proper document title & meta description
    if (language === 'ar') {
      document.title = 'برنامج خادم الحرمين الشريفين للابتعاث | البوابة الوطنية الموحدة';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'البوابة الرسمية لبرنامج خادم الحرمين الشريفين للابتعاث - تقديم ومتابعة الابتعاث الخارجي بأرقى جامعات العالم.');
      }
    } else {
      document.title = 'The Custodian of the Two Holy Mosques Scholarship Program | National Portal';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'Official portal for The Custodian of the Two Holy Mosques Scholarship Program - Apply and manage overseas scholarships at top global institutions.');
      }
    }
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  // Helper for deep string path (e.g., 'nav.programTitle')
  const tr = (path: string, fallback?: string): string => {
    const parts = path.split('.');
    let current: unknown = currentTranslations;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = (current as Record<string, unknown>)[part];
      } else {
        return fallback || path;
      }
    }
    return typeof current === 'string' ? current : fallback || path;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        isRtl,
        t: currentTranslations,
        setLanguage,
        toggleLanguage,
        tr
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Convenient alias for useLanguage
export const useTranslation = useLanguage;
