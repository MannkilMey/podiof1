import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');`;

const CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Barlow', sans-serif;
  background: #0A0A0C;
  color: #F0F0F0;
  overflow-x: hidden;
}

.landing {
  min-height: 100vh;
  background: linear-gradient(135deg, #0A0A0C 0%, #1a0510 100%);
  position: relative;
  overflow: hidden;
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
      rgba(232, 0, 45, 0.03) 0px,
      transparent 1px,
      transparent 40px,
      rgba(232, 0, 45, 0.03) 41px
    ),
    repeating-linear-gradient(
      0deg,
      rgba(232, 0, 45, 0.03) 0px,
      transparent 1px,
      transparent 40px,
      rgba(232, 0, 45, 0.03) 41px
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
  background: rgba(10, 10, 12, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
  color: #F0F0F0;
  text-decoration: none;
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

.nav-buttons {
  display: flex;
  gap: 16px;
}

.btn-login {
  padding: 12px 24px;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: #F0F0F0;
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
  transition: opacity 0.3s, transform 0.15s;
  text-decoration: none;
  display: inline-block;
}

.btn-register:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* Hero Section */
.hero {
  text-align: center;
  padding: 120px 32px 80px;
  max-width: 1200px;
  margin: 0 auto;
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
}

.hero-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 72px;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #F0F0F0 0%, #E8002D 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 22px;
  color: rgba(240, 240, 240, 0.7);
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
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #F0F0F0;
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
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
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
  background: rgba(17, 17, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 40px 32px;
  transition: all 0.3s;
}

.feature-card:hover {
  background: rgba(17, 17, 20, 0.8);
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
  color: #F0F0F0;
}

.feature-description {
  color: rgba(240, 240, 240, 0.6);
  line-height: 1.6;
  font-size: 15px;
}

/* Footer */
.footer {
  text-align: center;
  padding: 60px 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 80px;
}

.footer-text {
  color: rgba(240, 240, 240, 0.5);
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
@media (max-width: 768px) {
  .nav {
    padding: 20px 24px;
  }

  .nav-logo {
    font-size: 22px;
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
}
`;

export default function Landing() {
  const user = useAuthStore((state) => state.user);

  // Si ya está autenticado, redirigir al dashboard
  if (user) {
    window.location.href = '/';
    return null;
  }

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div className="landing">
        <div className="landing-content">
          {/* Navbar */}
          <nav className="nav">
            <Link to="/" className="nav-logo">
              <div className="nav-logo-icon">🏎</div>
              Podio<span>F1</span>
            </Link>
            <div className="nav-buttons">
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

          {/* Features Section */}
          <section className="features">
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
                <div className="feature-icon">🏆</div>
                <h3 className="feature-title">Múltiples Grupos</h3>
                <p className="feature-description">
                  Únete a varios grupos simultáneamente. Compite en ligas 
                  diferentes con distintas reglas y amigos.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🌙</div>
                <h3 className="feature-title">Modo Oscuro</h3>
                <p className="feature-description">
                  Interfaz moderna con tema oscuro y claro. Diseño inspirado 
                  en la velocidad y elegancia de la Fórmula 1.
                </p>
              </div>
            </div>
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