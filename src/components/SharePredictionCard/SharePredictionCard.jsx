import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { useToastStore } from '../../stores/toastStore';
import { useThemeStore } from '../../stores/themeStore';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');`;

const CSS = `
/* THEME VARIABLES */
[data-theme="dark"] {
  --bg: #0A0A0C; --bg2: #111114; --bg3: #18181D; --bg4: #1E1E24;
  --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.13);
  --red: #E8002D; --red-dim: rgba(232,0,45,0.13);
  --white: #F0F0F0; --muted: rgba(240,240,240,0.40);
  --gold: #C9A84C; --green: #00D4A0; --green-dim: rgba(0,212,160,0.15);
}

[data-theme="light"] {
  --bg: #F5F6F8; --bg2: #FFFFFF; --bg3: #E8EAEE; --bg4: #DFE1E6;
  --border: rgba(0,0,0,0.10); --border2: rgba(0,0,0,0.18);
  --red: #D40029; --red-dim: rgba(212,0,41,0.08);
  --white: #1A1B1E; --muted: rgba(26,27,30,0.55);
  --gold: #9C6F10; --green: #007F5F; --green-dim: rgba(0,127,95,0.15);
}

html, body {
  background: var(--bg);
  color: var(--white);
}

#root {
  background: var(--bg);
}

/* MODAL CON TEMA */
.share-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
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
  background: var(--bg2);
  border: 1px solid var(--border2);
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
  color: var(--white);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.share-close-btn {
  background: transparent;
  border: none;
  color: var(--red);
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
  min-height: 540px; /* ✅ CAMBIO: min-height en lugar de height */
  height: auto; /* ✅ NUEVO: altura automática */
  background: linear-gradient(135deg, #1a0510 0%, #0A0A0C 100%);
  border: 2px solid #E8002D;
  border-radius: 16px;
  padding: 40px;
  padding-bottom: 80px; /* ✅ NUEVO: espacio para watermark */
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
  pointer-events: none; /* ✅ NUEVO */
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

/* Content - General Results */
.general-header {
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(255,255,255,0.1);
}

.general-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 20px;
  font-weight: 900;
  color: #C9A84C;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.general-winner {
  font-size: 32px;
  font-weight: 900;
  color: #F0F0F0;
  margin-bottom: 4px;
}

.general-points {
  font-size: 18px;
  color: #E8002D;
  font-weight: 700;
}

.general-stats {
  margin-bottom: 24px;
}

.general-stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.general-stat-row:last-child {
  border-bottom: none;
}

.most-voted-section {
  margin-top: 20px;
  margin-bottom: 20px; /* ✅ NUEVO: espacio antes del watermark */
}

.most-voted-title {
  font-size: 12px;
  color: rgba(240,240,240,0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
}

.most-voted-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  margin-bottom: 6px;
}

.most-voted-pos {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
  font-weight: 900;
  color: #C9A84C;
  min-width: 40px;
}

.most-voted-driver {
  font-size: 14px;
  font-weight: 600;
  color: #F0F0F0;
  flex: 1;
}

/* Watermark */
.card-watermark {
  position: absolute;
  bottom: 20px; /* ✅ CAMBIO: reducido de 24px */
  left: 40px;
  right: 40px;
  text-align: center;
  background: linear-gradient(135deg, #1a0510 0%, #0A0A0C 100%); /* ✅ NUEVO: fondo */
  padding: 12px 0; /* ✅ NUEVO */
  z-index: 10; /* ✅ NUEVO: por encima del emoji */
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
  background: linear-gradient(135deg, #E8002D, #FF3355);
  color: white;
}

.share-btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.share-btn-secondary {
  background: var(--bg3);
  color: var(--white);
  border: 1px solid var(--border2);
}

.share-btn-secondary:hover {
  background: var(--bg4);
}

.share-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 600px) {
  .share-card {
    width: 100%;
    min-height: auto;
    padding: 30px;
    padding-bottom: 70px;
  }
  
  .card-title {
    font-size: 24px;
  }
  
  .general-winner {
    font-size: 26px;
  }
}
`;

/**
 * SharePredictionCard Component
 * 
 * @param {string} type - "prediction", "individual", "result", o "general"
 * @param {object} data - Datos según el tipo:
 *   - prediction: { drivers: [{ name: string }] }
 *   - individual/result: { points, exactHits, totalDrivers, position, totalParticipants, accuracy }
 *   - general: { topUser, topPoints, totalParticipants, avgPoints, mostVoted, officialResult }
 * @param {string} raceName - Nombre de la carrera
 * @param {object} user - Objeto user completo de Supabase Auth
 * @param {function} onClose - Callback para cerrar el modal
 */
export default function SharePredictionCard({ type, data, raceName, user, onClose }) {
  const cardRef = useRef(null);
  const toast = useToastStore();
  const theme = useThemeStore((state) => state.theme);
  const [generating, setGenerating] = useState(false);

  // Normalizar type: "result" e "individual" son lo mismo
  const normalizedType = type === 'result' ? 'individual' : type;

  // Extraer userName del objeto user de Supabase
  const getUserName = () => {
    if (!user) return 'Usuario';
    
    const nombre = user.user_metadata?.nombre || '';
    const apellido = user.user_metadata?.apellido || '';
    const fullName = `${nombre} ${apellido}`.trim();
    
    if (fullName) return fullName;
    
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'Usuario';
  };

  const userName = getUserName();

  const generateImage = async () => {
    if (!cardRef.current) return null;

    try {
      setGenerating(true);
      
      // ✅ MEJORADO: Opciones optimizadas para captura completa
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0A0A0C',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        windowWidth: cardRef.current.scrollWidth, // ✅ NUEVO
        windowHeight: cardRef.current.scrollHeight, // ✅ NUEVO
        width: cardRef.current.offsetWidth, // ✅ NUEVO
        height: cardRef.current.offsetHeight // ✅ NUEVO
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
    link.download = `podiof1-${normalizedType}-${raceName.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = imageData;
    link.click();

    toast.success('¡Imagen descargada!');
  };

  const handleShare = async () => {
    const imageData = await generateImage();
    if (!imageData) return;

    const response = await fetch(imageData);
    const blob = await response.blob();
    const file = new File([blob], `podiof1-${normalizedType}.png`, { type: 'image/png' });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `Mi ${normalizedType === 'prediction' ? 'predicción' : 'resultado'} en PodioF1`,
          text: `¡Mira ${normalizedType === 'general' ? 'los resultados' : 'mi ' + (normalizedType === 'prediction' ? 'predicción' : 'resultado')} de ${raceName}!`
        });
        toast.success('¡Compartido exitosamente!');
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
          toast.error('Error al compartir');
        }
      }
    } else {
      handleDownload();
    }
  };

  const getCardTitle = () => {
    if (normalizedType === 'prediction') return 'Mi Predicción';
    if (normalizedType === 'individual') return 'Mi Resultado';
    if (normalizedType === 'general') return 'Resultados Finales';
    return 'Resultados';
  };

  const getModalTitle = () => {
    if (normalizedType === 'prediction') return '📸 Compartir Predicción';
    if (normalizedType === 'individual') return '📊 Compartir Resultado';
    if (normalizedType === 'general') return '🏆 Compartir Resultados';
    return '📤 Compartir';
  };

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div data-theme={theme} className="share-modal-overlay" onClick={onClose}>
        <div 
          className="share-modal-content" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="share-modal-header">
            <h2 className="share-modal-title">{getModalTitle()}</h2>
            <button className="share-close-btn" onClick={onClose}>✕</button>
          </div>

          {/* Card que se convertirá en imagen - SIEMPRE DARK */}
          <div ref={cardRef} className="share-card">
            <div className="card-logo">PODIOF1</div>

            <div className="card-header">
              <div className="card-title">{getCardTitle()}</div>
              <div className="card-subtitle">{raceName}</div>
              {normalizedType !== 'general' && (
                <div className="card-user">@{userName}</div>
              )}
            </div>

            {normalizedType === 'prediction' ? (
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
            ) : normalizedType === 'individual' ? (
              // TIPO: RESULTADO INDIVIDUAL
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
            ) : normalizedType === 'general' ? (
              // TIPO: RESULTADOS GENERALES
              <>
                <div className="general-header">
                  <div className="general-title">🏆 Ganador</div>
                  <div className="general-winner">{data.topUser}</div>
                  <div className="general-points">{Math.round(data.topPoints)} puntos</div>
                </div>

                <div className="general-stats">
                  <div className="general-stat-row">
                    <div className="stat-label">Participantes</div>
                    <div className="stat-value">{data.totalParticipants}</div>
                  </div>
                  <div className="general-stat-row">
                    <div className="stat-label">Puntos Promedio</div>
                    <div className="stat-value">{Math.round(data.avgPoints)}</div>
                  </div>
                </div>

                {data.officialResult && data.officialResult.length > 0 ? (
                  // ✅ MOSTRAR RESULTADO OFICIAL DE LA CARRERA
                  <div className="most-voted-section">
                    <div className="most-voted-title">🏁 Resultado Oficial</div>
                    {data.officialResult.map((result, idx) => (
                      <div key={idx} className="most-voted-item">
                        <div className="most-voted-pos">
                          {result.posicion === 1 ? '🥇' : result.posicion === 2 ? '🥈' : '🥉'}
                        </div>
                        <div className="most-voted-driver">{result.piloto_nombre}</div>
                        {result.vuelta_rapida && (
                          <span style={{ fontSize: 14, marginLeft: 'auto' }}>🏎️</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : data.mostVoted && data.mostVoted.length > 0 ? (
                  // Fallback: Mostrar más votados si no hay resultado oficial
                  <div className="most-voted-section">
                    <div className="most-voted-title">Más Votados</div>
                    {data.mostVoted.map((vote, idx) => (
                      <div key={idx} className="most-voted-item">
                        <div className="most-voted-pos">P{vote.posicion}</div>
                        <div className="most-voted-driver">{vote.piloto_nombre}</div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </>
            ) : null}

            <div className="card-watermark">
              <div className="watermark-text">
                {normalizedType === 'prediction' 
                  ? 'Únete y predice tú también' 
                  : normalizedType === 'general'
                  ? '¡Únete a la competencia!'
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