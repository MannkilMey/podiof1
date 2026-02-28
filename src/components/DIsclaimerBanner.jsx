import { useThemeStore } from '../stores/themeStore';

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
  font-size: 18px;
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
  font-size: 14px;
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
  font-size: 13px;
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
  font-size: 13px;
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
  
  .disclaimer-title {
    font-size: 16px;
  }
  
  .disclaimer-content {
    font-size: 13px;
  }
  
  .disclaimer-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
`;

/**
 * Disclaimer anti-gambling
 * Muestra claramente que NO es un sitio de apuestas
 */
export default function DisclaimerBanner({ variant = 'full' }) {
  const theme = useThemeStore((state) => state.theme);

  if (variant === 'compact') {
    return (
      <>
        <style>{CSS}</style>
        <div data-theme={theme} className="disclaimer-compact">
          ⚠️ <strong>PodioF1 es GRATIS</strong> • Sin apuestas • Sin dinero real • Solo diversión deportiva entre amigos
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div data-theme={theme} className="disclaimer-banner">
        <div className="disclaimer-title">
          ⚠️ Aviso Importante: PodioF1 NO es un Sitio de Apuestas
        </div>
        <div className="disclaimer-content">
          <p style={{ marginBottom: 12, fontWeight: 600 }}>
            PodioF1 es una plataforma <strong>100% GRATUITA</strong> de predicciones deportivas de la Formula 1 para competir con amigos.
          </p>
          
          <div className="disclaimer-grid">
            <div className="disclaimer-item no">
              ❌ NO hay apuestas de dinero
            </div>
            <div className="disclaimer-item no">
              ❌ NO hay premios en efectivo
            </div>
            <div className="disclaimer-item no">
              ❌ NO hay pagos requeridos
            </div>
            <div className="disclaimer-item yes">
              ✅ 100% Gratis
            </div>
            <div className="disclaimer-item yes">
              ✅ Solo diversión entre amigos
            </div>
            <div className="disclaimer-item yes">
              ✅ Predicciones deportivas
            </div>
          </div>
        </div>
      </div>
    </>
  );
}