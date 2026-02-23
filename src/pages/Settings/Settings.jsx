import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../stores/themeStore';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');`;

const CSS = `
[data-theme="dark"] {
  --bg: #0A0A0C; --bg2: #111114; --bg3: #18181D;
  --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.13);
  --red: #E8002D; --red-dim: rgba(232,0,45,0.13);
  --white: #F0F0F0; --muted: rgba(240,240,240,0.40);
}

[data-theme="light"] {
  --bg: #F5F6F8; --bg2: #FFFFFF; --bg3: #E8EAEE;
  --border: rgba(0,0,0,0.10); --border2: rgba(0,0,0,0.18);
  --red: #D40029; --red-dim: rgba(212,0,41,0.08);
  --white: #1A1B1E; --muted: rgba(26,27,30,0.55);
}

body {
  background: var(--bg);
  color: var(--white);
  font-family: 'Barlow', sans-serif;
}

.settings-container {
  padding: 24px 28px;
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
}

.settings-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.back-btn {
  background: transparent;
  border: none;
  color: var(--red);
  cursor: pointer;
  font-size: 24px;
  transition: opacity 0.2s;
}

.back-btn:hover { opacity: 0.7; }

.settings-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 32px;
  font-weight: 900;
  color: var(--white);
}

.settings-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 32px;
  margin-bottom: 24px;
}

.settings-section-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 18px;
  font-weight: 800;
  color: var(--white);
  margin-bottom: 16px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  flex: 1;
}

.setting-label {
  font-weight: 600;
  color: var(--white);
  margin-bottom: 4px;
}

.setting-description {
  font-size: 13px;
  color: var(--muted);
}

.theme-toggle {
  display: flex;
  gap: 8px;
}

.theme-btn {
  padding: 8px 16px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.theme-btn.active {
  background: var(--red);
  border-color: var(--red);
  color: white;
}

.theme-btn:hover:not(.active) {
  border-color: var(--border2);
}
`;

export default function Settings() {
  const navigate = useNavigate();
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div data-theme={theme} className="settings-container">
        <div className="settings-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            ←
          </button>
          <h1 className="settings-title">Configuración</h1>
        </div>

        <div className="settings-card">
          <h2 className="settings-section-title">Apariencia</h2>
          
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Tema</div>
              <div className="setting-description">
                Elige entre tema claro u oscuro
              </div>
            </div>
            <div className="theme-toggle">
              <button
                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                🌙 Oscuro
              </button>
              <button
                className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                ☀️ Claro
              </button>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <h2 className="settings-section-title">Información</h2>
          
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Versión</div>
              <div className="setting-description">PodioF1 v1.0.0</div>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Temporada</div>
              <div className="setting-description">Fórmula 1 2026</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}