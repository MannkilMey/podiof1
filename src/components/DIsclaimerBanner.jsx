import { useThemeStore } from '../stores/themeStore';
import { useTranslation } from '../i18n';

const CSS = `
.disclaimer-banner {
  background: linear-gradient(135deg, #FFF3CD 0%, #FFE69C 100%);
  border: 2px solid #FFC107;
  border-radius: 12px;
  padding: 16px 24px;
  margin: 20px auto;
  max-width: 1200px;
  text-align: center;
}

[data-theme="dark"] .disclaimer-banner {
  background: linear-gradient(135deg, #4A3F0B 0%, #5C4D0F 100%);
  border-color: #FFC107;
}

.disclaimer-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: var(--fs-subtitle);
  font-weight: 800;
  color: #856404;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

[data-theme="dark"] .disclaimer-title {
  color: #FFD966;
}

.disclaimer-content {
  font-size: var(--fs-body);
  color: #856404;
  line-height: 1.6;
}

[data-theme="dark"] .disclaimer-content {
  color: #F5E6B3;
}

.disclaimer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.disclaimer-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: var(--fs-small);
  font-weight: 600;
}

.disclaimer-item.no {
  color: #721c24;
}

[data-theme="dark"] .disclaimer-item.no {
  color: #FFB3B3;
}

.disclaimer-item.yes {
  color: #155724;
}

[data-theme="dark"] .disclaimer-item.yes {
  color: #B3FFB3;
}

.disclaimer-compact {
  background: rgba(255, 243, 205, 0.5);
  border: 1px solid #FFC107;
  border-radius: 8px;
  padding: 10px 16px;
  margin: 16px auto;
  max-width: 800px;
  text-align: center;
  font-size: var(--fs-small);
  color: #856404;
}

[data-theme="dark"] .disclaimer-compact {
  background: rgba(74, 63, 11, 0.5);
  color: #F5E6B3;
}

@media (max-width: 768px) {
  .disclaimer-banner {
    padding: 12px 16px;
    margin: 16px;
  }
  
  
  
  .disclaimer-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
`;

/**
 * 
 
 */
export default function DisclaimerBanner({ variant = 'full' }) {
  const theme = useThemeStore((state) => state.theme);
  const { t } = useTranslation();

  if (variant === 'compact') {
    return (
      <>
        <style>{CSS}</style>
        <div data-theme={theme} className="disclaimer-compact">
          ⚠️ <strong>{t('disclaimer.titleCompact')}</strong>  {t('disclaimer.compactText')}
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div data-theme={theme} className="disclaimer-banner">
        <div className="disclaimer-title">
          {t('disclaimer.titleFull')}
        </div>
        <div className="disclaimer-content">
          <p style={{ marginBottom: 12, fontWeight: 600 }}>
            {t('disclaimer.intro')}
          </p>
          
          <div className="disclaimer-grid">
            <div className="disclaimer-item no">❌ {t('disclaimer.noMoney')}</div>
            <div className="disclaimer-item no">❌ {t('disclaimer.noCashPrizes')}</div>
            <div className="disclaimer-item no">❌ {t('disclaimer.noPaymentRequired')}</div>
            <div className="disclaimer-item yes">✅ {t('disclaimer.free')}</div>
            <div className="disclaimer-item yes">✅ {t('disclaimer.funOnly')}</div>
            <div className="disclaimer-item yes">✅ {t('disclaimer.sportsPredictions')}</div>
          </div>
        </div>
      </div>
    </>
  );
}