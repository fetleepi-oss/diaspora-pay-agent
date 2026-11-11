import { useState, useEffect, useMemo } from 'react';
import { Language } from '../types';
import { createTranslator, getInitialLanguage, getLanguageMeta } from '../i18n';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  const meta = useMemo(() => getLanguageMeta(language), [language]);
  const t = useMemo(() => createTranslator(language), [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = meta.dir;
    try {
      localStorage.setItem('diasporapay_lang', language);
    } catch {
      // ignore
    }
  }, [language, meta.dir]);

  return { language, setLanguage, t, meta };
}
