import en from './en.json';
import am from './am.json';
import om from './om.json';
import ti from './ti.json';
import ar from './ar.json';
import fr from './fr.json';
import { Language } from '../types';

export interface LanguageOption {
  code: Language;
  nativeName: string;
  englishName: string;
  dir: 'ltr' | 'rtl';
  speechCode: string;
  intlLocale: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', nativeName: 'English', englishName: 'English', dir: 'ltr', speechCode: 'en-US', intlLocale: 'en-US' },
  { code: 'am', nativeName: 'አማርኛ', englishName: 'Amharic', dir: 'ltr', speechCode: 'am-ET', intlLocale: 'am-ET' },
  { code: 'om', nativeName: 'Afaan Oromoo', englishName: 'Oromo', dir: 'ltr', speechCode: 'om-ET', intlLocale: 'en-ET' },
  { code: 'ti', nativeName: 'ትግርኛ', englishName: 'Tigrinya', dir: 'ltr', speechCode: 'ti-ET', intlLocale: 'ti-ET' },
  { code: 'ar', nativeName: 'العربية', englishName: 'Arabic', dir: 'rtl', speechCode: 'ar-SA', intlLocale: 'ar-EG' },
  { code: 'fr', nativeName: 'Français', englishName: 'French', dir: 'ltr', speechCode: 'fr-FR', intlLocale: 'fr-FR' },
];

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en,
  am,
  om,
  ti,
  ar,
  fr,
};

export function getInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem('diasporapay_lang') as Language | null;
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      return saved;
    }
    const browserLang = navigator.language?.split('-')[0] as Language;
    if (browserLang && SUPPORTED_LANGUAGES.some((l) => l.code === browserLang)) {
      return browserLang;
    }
  } catch {
    // ignore storage errors
  }
  return 'en';
}

export function createTranslator(lang: Language) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return (key: string): string => {
    return dict[key] || TRANSLATIONS.en[key] || key;
  };
}

export function getLanguageMeta(lang: Language): LanguageOption {
  return SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];
}
