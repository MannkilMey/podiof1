import { Link } from 'react-router-dom';
import { useThemeStore } from '../../stores/themeStore';

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
.support-back { display: inline-flex; align-items: center; gap: 8px; color: var(--red); text-decoration: none; font-size: 14px; font-weight: 600; margin-bottom: 24px; }
.support-back:hover { opacity: 0.7; }
.support-title { font-family: 'Barlow Condensed', sans-serif; font-size: 36px; font-weight: 900; color: var(--white); margin-bottom: 8px; }
.support-subtitle { color: var(--muted); font-size: 15px; margin-bottom: 32px; }
.support-contact-card { background: var(--bg2); border: 1px solid var(--gold); border-radius: 14px; padding: 24px; margin-bottom: 32px; text-align: center; }
.support-contact-label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
.support-contact-email { font-family: 'Barlow Condensed', sans-serif; font-size: 22px; font-weight: 800; color: var(--gold); text-decoration: none; }
.support-contact-email:hover { opacity: 0.85; }
.faq-section-title { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 800; color: var(--white); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; }
.faq-item { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 18px 20px; margin-bottom: 12px; }
.faq-question { font-weight: 700; color: var(--white); font-size: 15px; margin-bottom: 6px; }
.faq-answer { color: var(--muted); font-size: 14px; line-height: 1.6; }

@media (max-width: 480px) {
  .support-page { padding: 24px 16px; }
  .support-title { font-size: 28px; }
}
`;

const FAQS = [
  {
    q: '¿Cómo creo un grupo de predicciones?',
    a: 'Entrá a la app, tocá "Crear grupo" en la pantalla principal, y elegí el nombre, la cantidad de posiciones a predecir, y el sistema de puntos. Se genera un código de invitación que podés compartir con tus amigos.'
  },
  {
    q: '¿Cómo invito a otras personas a mi grupo?',
    a: 'Desde el panel de administración de tu grupo, tocá "Compartir grupo" para copiar el link de invitación, o compartí directamente el código que aparece en la pantalla del grupo.'
  },
  {
    q: 'Olvidé mi contraseña, ¿qué hago?',
    a: 'En la pantalla de inicio de sesión, tocá "¿Olvidaste tu contraseña?" e ingresá tu email. Vas a recibir un link para crear una nueva contraseña.'
  },
  {
    q: '¿Qué pasa si no envío mi predicción a tiempo?',
    a: 'Cada grupo tiene un horario límite de cierre antes de cada carrera. Si no enviás tu predicción antes de ese horario, no vas a sumar puntos en esa carrera, pero podés seguir participando en las siguientes.'
  },
  {
    q: '¿La app procesa pagos o dinero real?',
    a: 'No. PodioF1 no procesa pagos. La función "PodioPoints" es solo un acuerdo informal entre los miembros de un grupo, registrado dentro de la app como referencia — el dinero se maneja por fuera, entre ustedes.'
  }
];

export default function SupportPage() {
  const theme = useThemeStore((state) => state.theme);

  return (
    <div data-theme={theme} className="support-page">
      <style>{FONTS + CSS}</style>
      <div className="support-container">
        <Link to="/" className="support-back">← Volver al inicio</Link>

        <h1 className="support-title">Soporte</h1>
        <p className="support-subtitle">¿Tenés un problema o una pregunta? Estamos para ayudarte.</p>

        <div className="support-contact-card">
          <div className="support-contact-label">Escribinos directamente</div>
          <a href="mailto:info@podiof1.com" className="support-contact-email">
            info@podiof1.com
          </a>
        </div>

        <div className="faq-section-title">Preguntas frecuentes</div>
        {FAQS.map((item, idx) => (
          <div key={idx} className="faq-item">
            <div className="faq-question">{item.q}</div>
            <div className="faq-answer">{item.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}