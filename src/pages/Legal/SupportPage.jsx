import { Link } from 'react-router-dom';
import { useThemeStore } from '../../stores/themeStore';
import { useTranslation } from '../../i18n';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');`;

const CSS = `
[data-theme="dark"] {
  --bg: #0A0A0C; --bg2: #111114; --bg3: #18181D; --bg4: #1E1E24;
  --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.13);
  --red: #E8002D; --red-dim: rgba(232,0,45,0.13);
  --white: #F0F0F0; --muted: rgba(240,240,240,0.40);
  --gold: #C9A84C; --green: #00D4A0;
}

[data-theme="light"] {
  --bg: #F5F6F8; --bg2: #FFFFFF; --bg3: #E8EAEE; --bg4: #DFE1E6;
  --border: rgba(0,0,0,0.10); --border2: rgba(0,0,0,0.18);
  --red: #D40029; --red-dim: rgba(212,0,41,0.08);
  --white: #1A1B1E; --muted: rgba(26,27,30,0.55);
  --gold: #9C6F10; --green: #007F5F;
}

.support-page { min-height: 100vh; background: var(--bg); padding: 40px 20px; }
.support-container { max-width: 640px; margin: 0 auto; }
.support-back { display: inline-flex; align-items: center; gap: 8px; color: var(--red); text-decoration: none; font-size: var(--fs-body); font-weight: 600; margin-bottom: 24px; }
.support-back:hover { opacity: 0.7; }
.support-title { font-family: 'Barlow Condensed', sans-serif; font-size: var(--fs-display); font-weight: 900; color: var(--white); margin-bottom: 8px; }
.support-subtitle { color: var(--muted); font-size: var(--fs-subtitle); margin-bottom: 32px; }
.support-contact-card { background: var(--bg2); border: 1px solid var(--gold); border-radius: 14px; padding: 24px; margin-bottom: 32px; text-align: center; }
.support-contact-label { font-size: var(--fs-small); color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
.support-contact-email { font-family: 'Barlow Condensed', sans-serif; font-size: var(--fs-stat-secondary); font-weight: 800; color: var(--gold); text-decoration: none; }
.support-contact-email:hover { opacity: 0.85; }
.faq-section-title { font-family: 'Barlow Condensed', sans-serif; font-size: var(--fs-subtitle); font-weight: 800; color: var(--white); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; }
.faq-item { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 18px 20px; margin-bottom: 12px; }
.faq-question { font-weight: 700; color: var(--white); font-size: var(--fs-subtitle); margin-bottom: 6px; }
.faq-answer { color: var(--muted); font-size: var(--fs-body); line-height: 1.6; }

@media (max-width: 480px) {
  .support-page { padding: 24px 16px; }
}
`;

export default function SupportPage() {
  const theme = useThemeStore((state) => state.theme);
  const { t } = useTranslation();

  const faqs = [1, 2, 3, 4, 5].map(n => ({
    q: t(`support.faq${n}Q`),
    a: t(`support.faq${n}A`)
  }));

  return (
    <div data-theme={theme} className="support-page">
      <style>{FONTS + CSS}</style>
      <div className="support-container">
        <Link to="/" className="support-back">{t('support.backToHome')}</Link>

        <h1 className="support-title">{t('support.title')}</h1>
        <p className="support-subtitle">{t('support.subtitle')}</p>

        <div className="support-contact-card">
          <div className="support-contact-label">{t('support.contactLabel')}</div>
          <a href="mailto:info@podio.lat" className="support-contact-email">
            info@podio.lat
          </a>
        </div>

        <div className="faq-section-title">{t('support.faqSectionTitle')}</div>
        {faqs.map((item, idx) => (
          <div key={idx} className="faq-item">
            <div className="faq-question">{item.q}</div>
            <div className="faq-answer">{item.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}