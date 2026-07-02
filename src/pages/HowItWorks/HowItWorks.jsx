import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../stores/themeStore';
import { useTranslation } from '../../i18n';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');`;

const CSS = `
[data-theme="dark"] {
  --bg: #0A0A0C; --bg2: #111114; --bg3: #18181D;
  --white: #F0F0F0; --muted: rgba(240,240,240,0.40);
  --red: #E8002D; --border: rgba(255,255,255,0.07);
  --green: #00D4A0;
}

[data-theme="light"] {
  --bg: #F5F6F8; --bg2: #FFFFFF; --bg3: #E8EAEE;
  --white: #1A1B1E; --muted: rgba(26,27,30,0.55);
  --red: #D40029; --border: rgba(0,0,0,0.10);
  --green: #007F5F;
}

.how-it-works-page {
  min-height: 100vh;
  background: var(--bg);
  padding: 24px;
}

.hiw-container {
  max-width: 900px;
  margin: 0 auto;
}

.hiw-header {
  text-align: center;
  margin-bottom: 48px;
}

.hiw-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: var(--fs-display);
  font-weight: 900;
  color: var(--white);
  margin-bottom: 16px;
}

.hiw-subtitle {
  font-size: var(--fs-subtitle);
  color: var(--muted);
  line-height: 1.6;
}

.hiw-step {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}

.hiw-step::before {
  content: attr(data-number);
  position: absolute;
  top: -20px;
  right: 20px;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 120px;
  font-weight: 900;
  color: var(--border);
  opacity: 0.3;
  line-height: 1;
}

.hiw-step-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.hiw-step-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: var(--fs-stat-secondary);
  font-weight: 800;
  color: var(--white);
  margin-bottom: 12px;
}

.hiw-step-description {
  font-size: var(--fs-subtitle);
  line-height: 1.8;
  color: var(--muted);
  margin-bottom: 16px;
}

.hiw-step-tips {
  background: rgba(0, 212, 160, 0.1);
  border-left: 3px solid var(--green);
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
}

.hiw-step-tips strong {
  color: var(--green);
  display: block;
  margin-bottom: 8px;
  font-size: var(--fs-body);
}

.hiw-cta {
  text-align: center;
  margin: 60px 0;
}

.btn-hiw {
  padding: 16px 32px;
  background: linear-gradient(135deg, var(--red), #FF3355);
  border: none;
  border-radius: 10px;
  color: white;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: var(--fs-subtitle);
  font-weight: 800;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-hiw:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  
  
  .hiw-step {
    padding: 24px;
  }
  
  .hiw-step::before {
    font-size: 80px;
    top: -10px;
    right: 10px;
  }
}
`;

export default function HowItWorks() {
  const navigate = useNavigate();
  const theme = useThemeStore((state) => state.theme);
  const { t } = useTranslation();


  return (
    <>
      <style>{FONTS + CSS}</style>
      <div data-theme={theme} className="how-it-works-page">
        <div className="hiw-container">

          <div className="hiw-header">
            <h1 className="hiw-title">{t('howItWorks.title')}</h1>
            <p className="hiw-subtitle">{t('howItWorks.subtitle')}</p>
          </div>

          <div className="hiw-step" data-number="1">
            <div className="hiw-step-icon">🏁</div>
            <h2 className="hiw-step-title">{t('howItWorks.step1Title')}</h2>
            <p className="hiw-step-description">{t('howItWorks.step1Desc1')}</p>
            <p className="hiw-step-description">{t('howItWorks.step1Desc2')}</p>
            <div className="hiw-step-tips">
              <strong>{t('howItWorks.step1TipLabel')}</strong>
              {t('howItWorks.step1Tip')}
            </div>
          </div>

          <div className="hiw-step" data-number="2">
            <div className="hiw-step-icon">👥</div>
            <h2 className="hiw-step-title">{t('howItWorks.step2Title')}</h2>
            <p className="hiw-step-description">{t('howItWorks.step2Desc1')}</p>
            <p className="hiw-step-description"><strong>{t('howItWorks.step2Desc2Label')}</strong></p>
            <ul style={{ color: 'var(--muted)', marginLeft: 20, lineHeight: 1.8 }}>
              <li><strong>{t('howItWorks.step2SystemAccuracyLabel')}</strong> {t('howItWorks.step2SystemAccuracy')}</li>
              <li><strong>{t('howItWorks.step2SystemBalancedLabel')}</strong> {t('howItWorks.step2SystemBalanced')}</li>
              <li><strong>{t('howItWorks.step2SystemLiberalLabel')}</strong> {t('howItWorks.step2SystemLiberal')}</li>
            </ul>
            <div className="hiw-step-tips">
              <strong>{t('howItWorks.step2TipLabel')}</strong>
              {t('howItWorks.step2Tip')}
            </div>
          </div>

          <div className="hiw-step" data-number="3">
            <div className="hiw-step-icon">📧</div>
            <h2 className="hiw-step-title">{t('howItWorks.step3Title')}</h2>
            <p className="hiw-step-description">{t('howItWorks.step3Desc1')}</p>
            <p className="hiw-step-description">{t('howItWorks.step3Desc2')}</p>
            <div className="hiw-step-tips">
              <strong>{t('howItWorks.step3TipLabel')}</strong>
              {t('howItWorks.step3Tip')}
            </div>
          </div>

          <div className="hiw-step" data-number="4">
            <div className="hiw-step-icon">🎯</div>
            <h2 className="hiw-step-title">{t('howItWorks.step4Title')}</h2>
            <p className="hiw-step-description">{t('howItWorks.step4Desc1')}</p>
            <p className="hiw-step-description">{t('howItWorks.step4Desc2')}</p>
            <div className="hiw-step-tips">
              <strong>{t('howItWorks.step4TipLabel')}</strong>
              {t('howItWorks.step4Tip')}
            </div>
          </div>

          <div className="hiw-step" data-number="5">
            <div className="hiw-step-icon">🏆</div>
            <h2 className="hiw-step-title">{t('howItWorks.step5Title')}</h2>
            <p className="hiw-step-description">{t('howItWorks.step5Desc1')}</p>
            <p className="hiw-step-description"><strong>{t('howItWorks.step5Desc2Label')}</strong></p>
            <ul style={{ color: 'var(--muted)', marginLeft: 20, lineHeight: 1.8 }}>
              <li>{t('howItWorks.step5Point1')}</li>
              <li>{t('howItWorks.step5Point2')}</li>
              <li>{t('howItWorks.step5Point3')}</li>
            </ul>
            <p className="hiw-step-description">{t('howItWorks.step5Desc3')}</p>
            <div className="hiw-step-tips">
              <strong>{t('howItWorks.step5TipLabel')}</strong>
              {t('howItWorks.step5Tip')}
            </div>
          </div>

          <div className="hiw-cta">
            <h2 style={{
              fontFamily: 'Barlow Condensed',
              fontSize: 'var(--fs-page-title)',
              fontWeight: 900,
              color: 'var(--white)',
              marginBottom: 16
            }}>
              {t('howItWorks.ctaTitle')}
            </h2>
            <p style={{
              fontSize: 'var(--fs-subtitle)',
              color: 'var(--muted)',
              marginBottom: 24,
              maxWidth: 600,
              margin: '0 auto 24px'
            }}>
              {t('howItWorks.ctaSubtitle')}
            </p>
            <button className="btn-hiw" onClick={() => navigate('/register')}>
              {t('howItWorks.ctaButton')}
            </button>
          </div>

          <div style={{ marginTop: 60, paddingTop: 40, borderTop: '1px solid var(--border)' }}>
            <h2 style={{
              fontFamily: 'Barlow Condensed',
              fontSize: 'var(--fs-page-title)',
              fontWeight: 900,
              color: 'var(--white)',
              marginBottom: 24
            }}>
              {t('howItWorks.faqTitle')}
            </h2>

            {[1, 2, 3, 4].map(n => (
              <div key={n} style={{ marginBottom: 24 }}>
                <h3 style={{
                  fontFamily: 'Barlow Condensed',
                  fontSize: 'var(--fs-section-title)',
                  fontWeight: 700,
                  color: 'var(--white)',
                  marginBottom: 8
                }}>
                  {t(`howItWorks.faq${n}Q`)}
                </h3>
                <p style={{ fontSize: 'var(--fs-subtitle)', color: 'var(--muted)', lineHeight: 1.8 }}>
                  {t(`howItWorks.faq${n}A`)}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}