import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './locales/en.json';
import kuTranslation from './locales/ku.json';
import arTranslation from './locales/ar.json';

const resources = {
  en: { translation: enTranslation },
  ku: { translation: kuTranslation },
  ar: { translation: arTranslation },
};

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeName: 'English', dir: 'ltr', flag: '🇬🇧' },
  { code: 'ku', label: 'Kurdish', nativeName: 'کوردی', dir: 'rtl', flag: '☀️' },
  { code: 'ar', label: 'Arabic', nativeName: 'العربية', dir: 'rtl', flag: '🇸🇦' },
];

const RTL_LANGUAGES = ['ar', 'ku'];

export const updateDocumentDirection = (lng) => {
  const isRtl = RTL_LANGUAGES.includes(lng);
  if (typeof document !== 'undefined') {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lng || 'en';
  }
};

const initialLng = (() => {
  try {
    const saved = localStorage.getItem('i18nextLng');
    if (saved && ['en', 'ku', 'ar'].includes(saved)) {
      return saved;
    }
  } catch {
    // ignore
  }
  return 'en';
})();

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLng,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
  });

i18n.on('languageChanged', (lng) => {
  updateDocumentDirection(lng);
  try {
    localStorage.setItem('i18nextLng', lng);
  } catch {
    // ignore
  }
});

// Sync on load
updateDocumentDirection(i18n.language || 'en');

export default i18n;
