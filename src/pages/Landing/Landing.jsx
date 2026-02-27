import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');`;

const CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Barlow', sans-serif;
  overflow-x: hidden;
}

/* Theme Variables */
.landing[data-theme="dark"] {
  --bg-primary: #0A0A0C;
  --bg-secondary: #1a0510;
  --bg-card: rgba(17, 17, 20, 0.6);
  --bg-card-hover: rgba(17, 17, 20, 0.8);
  --text-primary: #F0F0F0;
  --text-secondary: rgba(240, 240, 240, 0.7);
  --text-muted: rgba(240, 240, 240, 0.5);
  --border-color: rgba(255, 255, 255, 0.1);
  --grid-pattern: rgba(232, 0, 45, 0.03);
}

.landing[data-theme="light"] {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8F9FA;
  --bg-card: rgba(255, 255, 255, 0.9);
  --bg-card-hover: rgba(255, 255, 255, 1);
  --text-primary: #1A1B1E;
  --text-secondary: #666;
  --text-muted: #999;
  --border-color: rgba(0, 0, 0, 0.1);
  --grid-pattern: rgba(232, 0, 45, 0.02);
}

.landing {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  position: relative;
  overflow: hidden;
  transition: background 0.3s ease;
}

/* Background Pattern */
.landing::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    repeating-linear-gradient(
      90deg,
      var(--grid-pattern) 0px,
      transparent 1px,
      transparent 40px,
      var(--grid-pattern) 41px
    ),
    repeating-linear-gradient(
      0deg,
      var(--grid-pattern) 0px,
      transparent 1px,
      transparent 40px,
      var(--grid-pattern) 41px
    );
  opacity: 0.5;
  z-index: 0;
}

.landing-content {
  position: relative;
  z-index: 1;
}

/* Navbar */
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 48px;
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-primary);
  text-decoration: none;
  transition: opacity 0.2s;
}

.nav-logo:hover {
  opacity: 0.8;
}

.nav-logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #E8002D, #FF3355);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.nav-logo span {
  color: #E8002D;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.theme-toggle {
  width: 44px;
  height: 44px;
  border: 2px solid var(--border-color);
  background: transparent;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--text-primary);
  font-size: 20px;
}

.theme-toggle:hover {
  border-color: #E8002D;
  background: rgba(232, 0, 45, 0.1);
  transform: rotate(15deg);
}

.btn-login {
  padding: 12px 24px;
  background: transparent;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
}

.btn-login:hover {
  border-color: #E8002D;
  background: rgba(232, 0, 45, 0.1);
  color: #E8002D;
}

.btn-register {
  padding: 12px 24px;
  background: linear-gradient(135deg, #E8002D, #FF3355);
  border: none;
  border-radius: 10px;
  color: white;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(232, 0, 45, 0.3);
}

/* Hero Section */
.hero {
  text-align: center;
  padding: 120px 32px 80px;
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeInUp 0.8s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(232, 0, 45, 0.1);
  border: 1px solid rgba(232, 0, 45, 0.3);
  border-radius: 50px;
  padding: 8px 20px;
  margin-bottom: 32px;
  font-size: 14px;
  font-weight: 600;
  color: #E8002D;
  letter-spacing: 1px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.hero-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 72px;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 24px;
  background: linear-gradient(135deg, var(--text-primary) 0%, #E8002D 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 22px;
  color: var(--text-secondary);
  margin-bottom: 48px;
  line-height: 1.6;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.hero-cta {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 60px;
}

.btn-hero-primary {
  padding: 18px 40px;
  background: linear-gradient(135deg, #E8002D, #FF3355);
  border: none;
  border-radius: 12px;
  color: white;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
  box-shadow: 0 10px 30px rgba(232, 0, 45, 0.3);
}

.btn-hero-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(232, 0, 45, 0.4);
}

.btn-hero-secondary {
  padding: 18px 40px;
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
}

.btn-hero-secondary:hover {
  border-color: #E8002D;
  background: rgba(232, 0, 45, 0.1);
}

/* Stats Section */
.stats-section {
  max-width: 900px;
  margin: 0 auto 80px;
  padding: 0 32px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.stat-item {
  text-align: center;
  padding: 32px 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.3s;
}

.stat-item:hover {
  transform: translateY(-4px);
  border-color: rgba(232, 0, 45, 0.3);
}

.stat-number {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 48px;
  font-weight: 900;
  color: #E8002D;
  margin-bottom: 8px;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* How It Works Section */
.how-it-works {
  padding: 80px 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 48px;
  font-weight: 900;
  text-align: center;
  margin-bottom: 60px;
  color: var(--text-primary);
}

.steps-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  position: relative;
}

.step-card {
  text-align: center;
  padding: 40px 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  position: relative;
  transition: all 0.3s;
}

.step-card:hover {
  transform: translateY(-4px);
  border-color: rgba(232, 0, 45, 0.3);
}

.step-number {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #E8002D, #FF3355);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 32px;
  font-weight: 900;
  color: white;
  margin: 0 auto 24px;
}

.step-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.step-description {
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 15px;
}

/* Features Section */
.features {
  padding: 80px 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  margin-top: 60px;
}

.feature-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 40px 32px;
  transition: all 0.3s;
}

.feature-card:hover {
  background: var(--bg-card-hover);
  border-color: rgba(232, 0, 45, 0.3);
  transform: translateY(-4px);
}

.feature-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, rgba(232, 0, 45, 0.2), rgba(255, 51, 85, 0.2));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: 24px;
}

.feature-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.feature-description {
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 15px;
}

/* CTA Section */
.cta-section {
  max-width: 800px;
  margin: 80px auto;
  padding: 60px 40px;
  background: linear-gradient(135deg, #E8002D, #FF3355);
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(232, 0, 45, 0.4);
}

.cta-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 42px;
  font-weight: 900;
  color: white;
  margin-bottom: 16px;
}

.cta-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 32px;
  line-height: 1.6;
}

.btn-cta {
  padding: 18px 40px;
  background: white;
  border: none;
  border-radius: 12px;
  color: #E8002D;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
}

.btn-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Footer */
.footer {
  text-align: center;
  padding: 60px 32px;
  border-top: 1px solid var(--border-color);
}

.footer-text {
  color: var(--text-muted);
  font-size: 14px;
}

.footer-link {
  color: #E8002D;
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.2s;
}

.footer-link:hover {
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 968px) {
  .stats-section {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .steps-container {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

@media (max-width: 768px) {
  .nav {
    padding: 20px 24px;
  }

  .nav-logo {
    font-size: 22px;
  }

  .nav-right {
    gap: 8px;
  }

  .btn-login {
    padding: 10px 16px;
    font-size: 13px;
  }

  .btn-register {
    padding: 10px 16px;
    font-size: 13px;
  }

  .hero {
    padding: 80px 24px 60px;
  }

  .hero-title {
    font-size: 48px;
  }

  .hero-subtitle {
    font-size: 18px;
  }

  .hero-cta {
    flex-direction: column;
  }

  .btn-hero-primary,
  .btn-hero-secondary {
    width: 100%;
    max-width: 400px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .cta-section {
    margin: 60px 24px;
    padding: 40px 32px;
  }

  .cta-title {
    font-size: 32px;
  }
}
`;

export default function Landing() {
  const user = useAuthStore((state) => state.user);
  const { theme, toggleTheme } = useThemeStore();

  // Si ya está autenticado, redirigir al dashboard
  if (user) {
    window.location.href = '/';
    return null;
  }

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div className="landing" data-theme={theme}>
        <div className="landing-content">
          {/* Navbar */}
          <nav className="nav">
            <div className="nav-left">
              <Link to="/" className="nav-logo">
                <div className="nav-logo-icon">🏎</div>
                Podio<span>F1</span>
              </Link>
            </div>
            <div className="nav-right">
              <button 
                onClick={toggleTheme} 
                className="theme-toggle"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <Link to="/login" className="btn-login">Iniciar Sesión</Link>
              <Link to="/register" className="btn-register">Crear Cuenta</Link>
            </div>
          </nav>

          {/* Hero Section */}
          <section className="hero">
            <div className="hero-badge">
              <span>🏁</span>
              Temporada 2026 · Predicciones en Vivo
            </div>
            <h1 className="hero-title">
              Compite con tus amigos<br/>
              en cada carrera de F1
            </h1>
            <p className="hero-subtitle">
              Crea grupos privados, predice los resultados de cada Gran Premio y 
              compite en tiempo real con tus amigos en la temporada 2026 de Fórmula 1.
            </p>
            <div className="hero-cta">
              <Link to="/register" className="btn-hero-primary">
                Comenzar Gratis
              </Link>
              <Link to="/login" className="btn-hero-secondary">
                Ya tengo cuenta
              </Link>
            </div>
          </section>

          {/* Stats Section */}
          <section className="stats-section">
            <div className="stat-item">
              <div className="stat-number">24</div>
              <div className="stat-label">Carreras por año</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Gratis</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">∞</div>
              <div className="stat-label">Grupos ilimitados</div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="how-it-works">
            <h2 className="section-title">Cómo Funciona</h2>
            <div className="steps-container">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3 className="step-title">Crea tu Grupo</h3>
                <p className="step-description">
                  Regístrate gratis y crea un grupo privado. Personaliza el 
                  sistema de puntos y las reglas según tus preferencias.
                </p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3 className="step-title">Invita a tus Amigos</h3>
                <p className="step-description">
                  Comparte el código de invitación con tus amigos. Ellos 
                  se registran e ingresan automáticamente al grupo.
                </p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3 className="step-title">Predice y Compite</h3>
                <p className="step-description">
                  Haz tu predicción antes de cada carrera. Los puntos se 
                  calculan automáticamente y la tabla se actualiza al instante.
                </p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="features">
            <h2 className="section-title">Características</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">👥</div>
                <h3 className="feature-title">Grupos Privados</h3>
                <p className="feature-description">
                  Crea tu propio grupo de predicciones con amigos, familia o colegas. 
                  Configura reglas personalizadas y sistemas de puntuación.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3 className="feature-title">Predicciones Inteligentes</h3>
                <p className="feature-description">
                  Sistema de puntuación dual: acumula puntos por pilotos correctos 
                  y bonos extra por posiciones exactas y vueltas rápidas.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3 className="feature-title">Tablas en Tiempo Real</h3>
                <p className="feature-description">
                  Sigue el rendimiento de todos los participantes con tablas 
                  actualizadas automáticamente después de cada carrera.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3 className="feature-title">Resultados Automáticos</h3>
                <p className="feature-description">
                  Importación automática de resultados oficiales desde OpenF1 API. 
                  Los puntos se calculan y actualizan instantáneamente.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📧</div>
                <h3 className="feature-title">Notificaciones Email</h3>
                <p className="feature-description">
                  Recibe recordatorios 24h antes de cada carrera, notificaciones 
                  de resultados y resúmenes semanales automáticos.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🌙</div>
                <h3 className="feature-title">Modo Oscuro/Claro</h3>
                <p className="feature-description">
                  Interfaz moderna con tema oscuro y claro. Diseño inspirado 
                  en la velocidad y elegancia de la Fórmula 1.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="cta-section">
            <h2 className="cta-title">¿Listo para subir al podio?</h2>
            <p className="cta-subtitle">
              Únete gratis y empieza a competir en la próxima carrera de F1
            </p>
            <Link to="/register" className="btn-cta">
              Crear mi Cuenta Gratis →
            </Link>
          </section>

          {/* Footer */}
          <footer className="footer">
            <p className="footer-text">
              Hecho con ❤️ para los fanáticos de F1 · <Link to="/register" className="footer-link">Crear cuenta gratis</Link>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}