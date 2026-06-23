import { create } from 'zustand';
import es from './es';
import en from './en';
import pt from './pt';

const LANGUAGES = { es, en, pt };
const LOCALE_MAP = {
  es: 'es-PY',  
  en: 'en-US',
  pt: 'pt-BR',
};

export const CURRENCY_DECIMALS = {
  USD: 2,
  EUR: 2,
  BRL: 2,
  ARS: 2,
  PYG: 0,
};

/**
 * Detecta el idioma inicial:
 * 1. Preferencia guardada en localStorage (si el usuario ya eligió antes)
 * 2. Idioma del navegador, si es uno de los soportados (es/en/pt)
 * 3. Inglés como fallback neutral (italiano, alemán, etc. no tienen traducción propia)
 */
function getInitialLocale() {
  const saved = localStorage.getItem('podiof1_locale');
  if (saved) return saved;

  const browserLang = navigator.language?.slice(0, 2).toLowerCase();
  if (browserLang === 'es' || browserLang === 'en' || browserLang === 'pt') {
    return browserLang;
  }
  return 'en';
}

/**
 * Language Store - persiste en localStorage
 */
export const useLanguageStore = create((set) => ({
  locale: getInitialLocale(),
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
export function getDateLocale(locale) {
  return LOCALE_MAP[locale] || 'es-PY';
}
export function getRaceName(race, t) {
  if (!race) return '';
  return race.slug ? t(`races.gp.${race.slug}.nombre`) : race.nombre;
}