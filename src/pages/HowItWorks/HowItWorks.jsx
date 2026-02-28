import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../stores/themeStore';

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
  font-size: 48px;
  font-weight: 900;
  color: var(--white);
  margin-bottom: 16px;
}

.hiw-subtitle {
  font-size: 18px;
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
  font-size: 28px;
  font-weight: 800;
  color: var(--white);
  margin-bottom: 12px;
}

.hiw-step-description {
  font-size: 16px;
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
  font-size: 14px;
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
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-hiw:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .hiw-title {
    font-size: 36px;
  }
  
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

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div data-theme={theme} className="how-it-works-page">
        <div className="hiw-container">
          
          <div className="hiw-header">
            <h1 className="hiw-title">Cómo Funciona PodioF1</h1>
            <p className="hiw-subtitle">
              Aprende a crear tu grupo de predicciones de Formula 1, 
              invitar a tus amigos, y empezar a competir en 5 simples pasos.
            </p>
          </div>

          {/* Paso 1 */}
          <div className="hiw-step" data-number="1">
            <div className="hiw-step-icon">🏁</div>
            <h2 className="hiw-step-title">Crea tu Cuenta Gratis</h2>
            <p className="hiw-step-description">
              Regístrate en PodioF1 en menos de 1 minuto. Solo necesitas tu email 
              y una contraseña. No se requiere tarjeta de crédito, no hay costos 
              ocultos, y no necesitas descargar ninguna aplicación.
            </p>
            <p className="hiw-step-description">
              Después de registrarte, confirma tu email y ya estarás listo para 
              crear tu primer grupo de predicciones de Formula 1.
            </p>
            <div className="hiw-step-tips">
              <strong>💡 Consejo:</strong>
              Usa un email que revises frecuentemente. PodioF1 te enviará recordatorios 
              antes de cada carrera para que no olvides hacer tu predicción.
            </div>
          </div>

          {/* Paso 2 */}
          <div className="hiw-step" data-number="2">
            <div className="hiw-step-icon">👥</div>
            <h2 className="hiw-step-title">Crea tu Grupo de Predicciones F1</h2>
            <p className="hiw-step-description">
              Haz click en "Crear Grupo" y personaliza tu liga de Formula 1. 
              Dale un nombre creativo a tu grupo (por ejemplo: "Los Pilotos del Café" 
              o "Oficina GP"). Elige la temporada (2024, 2025, etc.) y selecciona 
              el sistema de puntos que prefieras.
            </p>
            <p className="hiw-step-description">
              <strong>Sistemas de puntos disponibles:</strong>
            </p>
            <ul style={{ color: 'var(--muted)', marginLeft: 20, lineHeight: 1.8 }}>
              <li><strong>Exactitud:</strong> Más puntos por predicciones exactas de posición</li>
              <li><strong>Balanceado:</strong> Mix entre exactitud y aciertos de piloto</li>
              <li><strong>Liberal:</strong> Más puntos por acertar pilotos, menos por posición exacta</li>
            </ul>
            <div className="hiw-step-tips">
              <strong>💡 Consejo:</strong>
              Si es tu primer grupo, usa el sistema "Balanceado". Es el más justo 
              para principiantes y expertos. Puedes crear múltiples grupos con diferentes 
              sistemas para probar cuál te gusta más.
            </div>
          </div>

          {/* Paso 3 */}
          <div className="hiw-step" data-number="3">
            <div className="hiw-step-icon">📧</div>
            <h2 className="hiw-step-title">Invita a tus Amigos</h2>
            <p className="hiw-step-description">
              Una vez creado tu grupo, recibirás un código de invitación único. 
              Compártelo con tus amigos fanáticos de F1 vía WhatsApp, email, o redes 
              sociales. Ellos solo necesitan hacer click en el link, crear su cuenta 
              (si no la tienen), y automáticamente se unirán a tu grupo.
            </p>
            <p className="hiw-step-description">
              No hay límite de miembros. Invita a 5 amigos o a 50, tú decides. 
              Mientras más participantes, más emocionante la competencia.
            </p>
            <div className="hiw-step-tips">
              <strong>💡 Consejo:</strong>
              Invita a personas que realmente vean Formula 1. La competencia es 
              más divertida cuando todos están enganchados con el deporte. Puedes 
              crear varios grupos: uno con expertos y otro con novatos.
            </div>
          </div>

          {/* Paso 4 */}
          <div className="hiw-step" data-number="4">
            <div className="hiw-step-icon">🎯</div>
            <h2 className="hiw-step-title">Haz tu Predicción Antes de Cada Carrera</h2>
            <p className="hiw-step-description">
              Antes de cada Gran Premio, entra a PodioF1 y predice quiénes terminarán 
              en el top 10. Arrastra y suelta los pilotos en el orden que creas correcto. 
              Piensa estratégicamente: ¿Verstappen dominará? ¿Hamilton tendrá un buen día? 
              ¿Alonso sorprenderá?
            </p>
            <p className="hiw-step-description">
              Tienes hasta 2 horas antes de la carrera para hacer tu predicción 
              (este tiempo puede ser personalizado por el administrador). Puedes 
              editar tu predicción cuantas veces quieras antes del deadline.
            </p>
            <div className="hiw-step-tips">
              <strong>💡 Consejo:</strong>
              No siempre vayas con los favoritos. A veces un piloto "underdog" puede 
              sorprender y darte muchos puntos si nadie más lo predijo. Mira la 
              práctica y clasificación antes de decidir.
            </div>
          </div>

          {/* Paso 5 */}
          <div className="hiw-step" data-number="5">
            <div className="hiw-step-icon">🏆</div>
            <h2 className="hiw-step-title">Gana Puntos y Compite en la Clasificación</h2>
            <p className="hiw-step-description">
              Después de cada carrera de Formula 1, PodioF1 calcula automáticamente 
              tus puntos comparando tu predicción con el resultado oficial. Recibirás 
              un email con tu puntuación y verás cómo quedaste en la clasificación 
              del grupo.
            </p>
            <p className="hiw-step-description">
              <strong>Cómo se otorgan puntos:</strong>
            </p>
            <ul style={{ color: 'var(--muted)', marginLeft: 20, lineHeight: 1.8 }}>
              <li>Predicción exacta de posición: Máximos puntos (ej: 10 pts)</li>
              <li>Piloto correcto, posición incorrecta: Puntos parciales (ej: 5 pts)</li>
              <li>Piloto incorrecto: 0 puntos</li>
            </ul>
            <p className="hiw-step-description">
              La competencia continúa durante toda la temporada. ¿Quién será el 
              campeón de tu grupo al final del año? ¿Quién tendrá la racha más 
              larga de aciertos? ¿Quién la recuperación más épica?
            </p>
            <div className="hiw-step-tips">
              <strong>💡 Consejo:</strong>
              No te desanimes si empiezas mal. En Formula 1 todo puede pasar. 
              Una buena racha de 3-4 carreras puede ponerte en los primeros lugares. 
              La consistencia gana campeonatos.
            </div>
          </div>

          {/* CTA */}
          <div className="hiw-cta">
            <h2 style={{ 
              fontFamily: 'Barlow Condensed', 
              fontSize: 32, 
              fontWeight: 900, 
              color: 'var(--white)',
              marginBottom: 16
            }}>
              ¿Listo para Empezar?
            </h2>
            <p style={{ 
              fontSize: 16, 
              color: 'var(--muted)', 
              marginBottom: 24,
              maxWidth: 600,
              margin: '0 auto 24px'
            }}>
              Crea tu cuenta gratis ahora y forma tu grupo de predicciones F1. 
              La próxima carrera está a la vuelta de la esquina.
            </p>
            <button 
              className="btn-hiw"
              onClick={() => navigate('/register')}
            >
              🏁 Crear Cuenta Gratis
            </button>
          </div>

          {/* FAQs adicionales */}
          <div style={{ marginTop: 60, paddingTop: 40, borderTop: '1px solid var(--border)' }}>
            <h2 style={{ 
              fontFamily: 'Barlow Condensed', 
              fontSize: 32, 
              fontWeight: 900, 
              color: 'var(--white)',
              marginBottom: 24
            }}>
              Preguntas Frecuentes
            </h2>

            <div style={{ marginBottom: 24 }}>
              <h3 style={{ 
                fontFamily: 'Barlow Condensed', 
                fontSize: 20, 
                fontWeight: 700, 
                color: 'var(--white)',
                marginBottom: 8
              }}>
                ¿Puedo cambiar el sistema de puntos después de crear el grupo?
              </h3>
              <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8 }}>
                Solo el administrador puede cambiar el sistema de puntos, y únicamente 
                antes de que empiece la temporada o si aún no se han registrado 
                predicciones.
              </p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h3 style={{ 
                fontFamily: 'Barlow Condensed', 
                fontSize: 20, 
                fontWeight: 700, 
                color: 'var(--white)',
                marginBottom: 8
              }}>
                ¿Qué pasa si olvido hacer mi predicción?
              </h3>
              <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8 }}>
                Simplemente no ganas puntos para esa carrera, pero sigues en la 
                competencia. PodioF1 te envía recordatorios 24 horas antes y 2 horas 
                antes de cada carrera para ayudarte a no olvidar.
              </p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h3 style={{ 
                fontFamily: 'Barlow Condensed', 
                fontSize: 20, 
                fontWeight: 700, 
                color: 'var(--white)',
                marginBottom: 8
              }}>
                ¿Puedo ver las predicciones de otros antes de hacer la mía?
              </h3>
              <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8 }}>
                No. Las predicciones están ocultas hasta que se cierre el deadline. 
                Esto garantiza que cada persona haga su predicción de forma independiente 
                y honesta.
              </p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h3 style={{ 
                fontFamily: 'Barlow Condensed', 
                fontSize: 20, 
                fontWeight: 700, 
                color: 'var(--white)',
                marginBottom: 8
              }}>
                ¿Cómo se manejan los empates?
              </h3>
              <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8 }}>
                Si dos o más personas tienen el mismo puntaje al final de la temporada, 
                gana quien tenga más aciertos exactos (predicciones de posición perfecta). 
                Si aún hay empate, gana quien tenga más aciertos de piloto.
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}