import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { useToastStore } from '../../stores/toastStore';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');`;

const CSS = `
/* BACKGROUNDS 100% HARDCODED - SIN VARIABLES */
.share-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.98) !important;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  animation: fadeIn 0.2s ease-out;
  overflow-y: auto;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.share-modal-content {
  background: #111114 !important;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 16px;
  padding: 24px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease-out;
  position: relative;
  z-index: 10000;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.share-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.share-modal-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 24px;
  font-weight: 900;
  color: #F0F0F0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.share-close-btn {
  background: transparent;
  border: none;
  color: #E8002D;
  font-size: 24px;
  cursor: pointer;
  padding: 4px 8px;
  transition: opacity 0.2s;
}

.share-close-btn:hover {
  opacity: 0.7;
}

/* Card que se convertirá en imagen - SIEMPRE DARK */
.share-card {
  width: 540px;
  height: 540px;
  background: linear-gradient(135deg, #1a0510 0%, #0A0A0C 100%);
  border: 2px solid #E8002D;
  border-radius: 16px;
  padding: 40px;
  position: relative;
  overflow: hidden;
  margin: 0 auto 24px;
  font-family: 'Barlow', sans-serif;
}

.share-card::before {
  content: '🏎️';
  position: absolute;
  right: -30px;
  bottom: -30px;
  font-size: 180px;
  opacity: 0.03;
}

/* Logo */
.card-logo {
  position: absolute;
  top: 24px;
  left: 24px;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 24px;
  font-weight: 900;
  color: #E8002D;
  letter-spacing: 1px;
}

/* Header */
.card-header {
  margin-bottom: 32px;
}

.card-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 28px;
  font-weight: 900;
  color: #F0F0F0;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-subtitle {
  font-size: 14px;
  color: rgba(240,240,240,0.5);
  margin-bottom: 4px;
}

.card-user {
  font-size: 16px;
  color: #E8002D;
  font-weight: 700;
}

/* Content - Prediction */
.prediction-list {
  margin-bottom: 24px;
}

.prediction-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 10px 12px;
}

.prediction-position {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 20px;
  font-weight: 900;
  color: #C9A84C;
  min-width: 28px;
}

.prediction-position.podium {
  color: #FFD700;
}

.prediction-driver-name {
  font-size: 14px;
  font-weight: 600;
  color: #F0F0F0;
  flex: 1;
}

/* Content - Result */
.result-stats {
  margin-bottom: 32px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-label {
  font-size: 14px;
  color: rgba(240,240,240,0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 32px;
  font-weight: 900;
  color: #F0F0F0;
}

.stat-value.highlight {
  color: #E8002D;
}

.result-position {
  background: linear-gradient(135deg, #E8002D, #FF3355);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  margin-bottom: 24px;
}

.position-label {
  font-size: 12px;
  color: rgba(255,255,255,0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.position-value {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 48px;
  font-weight: 900;
  color: white;
  line-height: 1;
}

.position-total {
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  margin-top: 4px;
}

/* Watermark */
.card-watermark {
  position: absolute;
  bottom: 24px;
  left: 24px;
  right: 24px;
  text-align: center;
}

.watermark-text {
  font-size: 11px;
  color: rgba(240,240,240,0.4);
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.watermark-url {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #E8002D;
  letter-spacing: 1px;
}

/* Buttons */
.share-actions {
  display: flex;
  gap: 12px;
}

.share-btn {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.share-btn-primary {
  background: linear-gradient(135deg, #E8002D, #FF3355) !important;
  color: white !important;
}

.share-btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.share-btn-secondary {
  background: #18181D !important;
  color: #F0F0F0 !important;
  border: 1px solid rgba(255,255,255,0.15);
}

.share-btn-secondary:hover {
  background: #1E1E24 !important;
}

.share-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 600px) {
  .share-card {
    width: 100%;
    height: auto;
    aspect-ratio: 1;
  }
}
`;

/**
 * SharePredictionCard Component
 * 
 * @param {string} type - "prediction" o "result"
 * @param {object} data - Datos según el tipo:
 *   - prediction: { drivers: [{ name: string }] }
 *   - result: { points, exactHits, totalDrivers, position, totalParticipants, accuracy }
 * @param {string} raceName - Nombre de la carrera
 * @param {object} user - Objeto user completo de Supabase Auth
 * @param {function} onClose - Callback para cerrar el modal
 */
export default function SharePredictionCard({ type, data, raceName, user, onClose }) {
  const cardRef = useRef(null);
  const toast = useToastStore();
  const [generating, setGenerating] = useState(false);

  // Extraer userName del objeto user de Supabase
  const getUserName = () => {
    if (!user) return 'Usuario';
    
    // Intentar obtener nombre de user_metadata
    const nombre = user.user_metadata?.nombre || '';
    const apellido = user.user_metadata?.apellido || '';
    const fullName = `${nombre} ${apellido}`.trim();
    
    // Si hay nombre completo, usarlo
    if (fullName) return fullName;
    
    // Si no, usar email sin dominio
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    // Último fallback
    return 'Usuario';
  };

  const userName = getUserName();

  const generateImage = async () => {
    if (!cardRef.current) return null;

    try {
      setGenerating(true);
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0A0A0C',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Error al generar imagen');
      return null;
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    const imageData = await generateImage();
    if (!imageData) return;

    const link = document.createElement('a');
    link.download = `podiof1-${type}-${raceName.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = imageData;
    link.click();

    toast.success('¡Imagen descargada!');
  };

  const handleShare = async () => {
    const imageData = await generateImage();
    if (!imageData) return;

    // Convertir base64 a Blob
    const response = await fetch(imageData);
    const blob = await response.blob();
    const file = new File([blob], `podiof1-${type}.png`, { type: 'image/png' });

    // Intentar usar Web Share API
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `Mi ${type === 'prediction' ? 'predicción' : 'resultado'} en PodioF1`,
          text: `¡Mira mi ${type === 'prediction' ? 'predicción' : 'resultado'} para ${raceName}!`
        });
        toast.success('¡Compartido exitosamente!');
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
          toast.error('Error al compartir');
        }
      }
    } else {
      // Fallback: descargar
      handleDownload();
    }
  };

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div className="share-modal-overlay" onClick={onClose}>
        <div 
          className="share-modal-content" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="share-modal-header">
            <h2 className="share-modal-title">
              {type === 'prediction' ? '📸 Compartir Predicción' : '📊 Compartir Resultado'}
            </h2>
            <button className="share-close-btn" onClick={onClose}>✕</button>
          </div>

          {/* Card que se convertirá en imagen */}
          <div ref={cardRef} className="share-card">
            <div className="card-logo">PODIOF1</div>

            <div className="card-header">
              <div className="card-title">
                {type === 'prediction' ? 'Mi Predicción' : 'Mi Resultado'}
              </div>
              <div className="card-subtitle">{raceName}</div>
              <div className="card-user">@{userName}</div>
            </div>

            {type === 'prediction' ? (
              // TIPO: PREDICCIÓN
              <div className="prediction-list">
                {data.drivers?.slice(0, 10).map((driver, idx) => (
                  <div key={idx} className="prediction-item">
                    <div className={`prediction-position ${idx < 3 ? 'podium' : ''}`}>
                      {idx + 1}°
                    </div>
                    <div className="prediction-driver-name">{driver.name}</div>
                  </div>
                ))}
              </div>
            ) : (
              // TIPO: RESULTADO
              <>
                <div className="result-position">
                  <div className="position-label">Posición Final</div>
                  <div className="position-value">{data.position}°</div>
                  <div className="position-total">de {data.totalParticipants} participantes</div>
                </div>

                <div className="result-stats">
                  <div className="stat-row">
                    <div className="stat-label">Puntos</div>
                    <div className="stat-value highlight">{Math.round(data.points)}</div>
                  </div>
                  <div className="stat-row">
                    <div className="stat-label">Aciertos Exactos</div>
                    <div className="stat-value">{data.exactHits}/{data.totalDrivers}</div>
                  </div>
                  <div className="stat-row">
                    <div className="stat-label">Precisión</div>
                    <div className="stat-value">{Math.round(data.accuracy || 0)}%</div>
                  </div>
                </div>
              </>
            )}

            <div className="card-watermark">
              <div className="watermark-text">
                {type === 'prediction' 
                  ? 'Únete y predice tú también' 
                  : '¡Compite con tus amigos!'}
              </div>
              <div className="watermark-url">podiof1.com</div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="share-actions">
            <button 
              className="share-btn share-btn-primary"
              onClick={handleShare}
              disabled={generating}
            >
              {generating ? '⏳ Generando...' : '📤 Compartir'}
            </button>
            <button 
              className="share-btn share-btn-secondary"
              onClick={handleDownload}
              disabled={generating}
            >
              💾 Descargar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}