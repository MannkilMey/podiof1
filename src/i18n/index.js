import { create } from 'zustand';
import es from './es';
import en from './en';
import pt from './pt';

const LANGUAGES = { es, en, pt };

/**
 * Language Store - persiste en localStorage
 */
export const useLanguageStore = create((set) => ({
  locale: localStorage.getItem('podiof1_locale') || 'es',
  setLocale: (locale) => {
    localStorage.setItem('podiof1_locale', locale);
    set({ locale });
  }
}));

/**
 * useTranslation hook
 * 
 * Usage:
 *   const { t, locale, setLocale } = useTranslation();
 *   t('nav.profile')          → "Mi Perfil" (es) / "My Profile" (en)
 *   t('race.countdown', { days: 5 }) → "Faltan 5 días" / "5 days left"
 */
export function useTranslation() {
  const { locale, setLocale } = useLanguageStore();
  const translations = LANGUAGES[locale] || LANGUAGES.es;

  function t(key, params = {}) {
    // Navigate nested keys: 'nav.profile' → translations.nav.profile
    const value = key.split('.').reduce((obj, k) => obj?.[k], translations);
    
    if (value === undefined) {
      // Fallback to Spanish, then to the key itself
      const fallback = key.split('.').reduce((obj, k) => obj?.[k], LANGUAGES.es);
      if (fallback === undefined) return key;
      return applyParams(fallback, params);
    }

    return applyParams(value, params);
  }

  function applyParams(str, params) {
    if (typeof str !== 'string') return str;
    return Object.entries(params).reduce(
      (s, [key, val]) => s.replace(new RegExp(`{{${key}}}`, 'g'), val),
      str
    );
  }

  return { t, locale, setLocale, locales: Object.keys(LANGUAGES) };
}