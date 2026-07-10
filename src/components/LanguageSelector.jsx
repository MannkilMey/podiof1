// src/components/LanguageSelector.jsx
import { useTranslation } from '../i18n';
import { useThemeStore } from '../stores/themeStore';

const LANG_LABELS = {
  es: '🇪🇸 Español',
  en: '🇺🇸 English',
  pt: '🇧🇷 Português'
};

export default function LanguageSelector({ compact = false }) {
  const { locale, setLocale, locales } = useTranslation();
  const theme = useThemeStore((state) => state.theme);

  if (compact) {
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        {locales.map(lang => (
          <button
            key={lang}
            onClick={() => setLocale(lang)}
            style={{
              padding: '6px 12px',
              background: locale === lang ? 'var(--red)' : 'transparent',
              border: `1px solid ${locale === lang ? 'var(--red)' : 'var(--border2)'}`,
              color: locale === lang ? 'white' : 'var(--white)',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: locale === lang ? 700 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <select
      value={locale}
      onChange={e => setLocale(e.target.value)}
      style={{
        padding: '10px 14px',
        background: 'var(--bg3)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        color: 'var(--white)',
        fontSize: 14,
        cursor: 'pointer',
        fontFamily: "'Barlow', sans-serif",
        width: '100%'
      }}
    >
      {locales.map(lang => (
        <option key={lang} value={lang}>
          {LANG_LABELS[lang]}
        </option>
      ))}
    </select>
  );
}