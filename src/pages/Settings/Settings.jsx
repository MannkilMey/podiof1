import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { supabase } from '../../lib/supabase';
import { useTranslation } from '../../i18n';
import { isNative } from '../../hooks/usePlatform';
import BackButton from '../../components/BackButton';
import LanguageSelector from '../../components/LanguageSelector';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');`;

const CSS = `
[data-theme="dark"] {
  --bg: #0A0A0C; --bg2: #111114; --bg3: #18181D; --bg4: #1E1E24;
  --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.13);
  --red: #E8002D; --red-dim: rgba(232,0,45,0.13);
  --white: #F0F0F0; --muted: rgba(240,240,240,0.40);
  --green: #00D4A0;
}
[data-theme="light"] {
  --bg: #F5F6F8; --bg2: #FFFFFF; --bg3: #E8EAEE; --bg4: #DFE1E6;
  --border: rgba(0,0,0,0.10); --border2: rgba(0,0,0,0.18);
  --red: #D40029; --red-dim: rgba(212,0,41,0.08);
  --white: #1A1B1E; --muted: rgba(26,27,30,0.55);
  --green: #007F5F;
}
body { background: var(--bg); color: var(--white); font-family: 'Barlow', sans-serif; }
.settings-container { padding: 24px 28px; max-width: 800px; margin: 0 auto; min-height: 100vh; }
.settings-header { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; }
.back-btn { background: transparent; border: none; color: var(--red); cursor: pointer; font-size: var(--fs-section-title); transition: opacity 0.2s; }
.back-btn:hover { opacity: 0.7; }
.settings-title { font-family: 'Barlow Condensed', sans-serif; font-size: var(--fs-page-title); font-weight: 900; color: var(--white); }
.settings-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 32px; margin-bottom: 24px; }
.settings-section-title { font-family: 'Barlow Condensed', sans-serif; font-size: var(--fs-subtitle); font-weight: 800; color: var(--white); margin-bottom: 16px; }
.setting-item { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid var(--border); }
.setting-item:last-child { border-bottom: none; }
.setting-info { flex: 1; }
.setting-label { font-weight: 600; color: var(--white); margin-bottom: 4px; }
.setting-description { font-size: var(--fs-small); color: var(--muted); }
.theme-toggle { display: flex; gap: 8px; }
.theme-btn { padding: 8px 16px; background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; color: var(--muted); cursor: pointer; transition: all 0.2s; font-size: var(--fs-body); }
.theme-btn.active { background: var(--red); border-color: var(--red); color: white; }
.theme-btn:hover:not(.active) { border-color: var(--border2); }
`;

export default function Settings() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const { t, locale, setLocale } = useTranslation();
  const [pushEnabled, setPushEnabled] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from('users').select('push_enabled').eq('id', user.id).single()
      .then(({ data }) => {
        if (data) setPushEnabled(data.push_enabled ?? true);
      });
  }, [user]);

  const handleTogglePush = async () => {
    const newValue = !pushEnabled;
    setPushEnabled(newValue);
    await supabase.from('users').update({ push_enabled: newValue }).eq('id', user.id);
  };

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div data-theme={theme} className="settings-container">
        <div className="settings-header">
          <BackButton className="back-btn" onClick={() => navigate('/')}>←</BackButton>
          <h1 className="settings-title">{t('nav.settings')}</h1>
        </div>

        {/* Apariencia */}
        <div className="settings-card">
          <h2 className="settings-section-title">{t('settings.appearance')}</h2>
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">{t('settings.themeLabel')}</div>
              <div className="setting-description">{t('settings.themeDescription')}</div>
            </div>
            <div className="theme-toggle">
              <button className={`theme-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>
                🌙 {t('dashboard.themeDark')}
              </button>
              <button className={`theme-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>
                ☀️ {t('dashboard.themeLight')}
              </button>
            </div>
          </div>
        </div>

        {/* Idioma */}
        <div className="settings-card">
          <h2 className="settings-section-title">🌐 {t('settings.language')}</h2>
          <LanguageSelector />
        </div>

        {/* Notificaciones — solo en nativo */}
        {isNative && (
          <div className="settings-card">
            <h2 className="settings-section-title">🔔 {t('settings.notifications')}</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--white)', fontSize: 'var(--fs-body)', marginBottom: 4 }}>
                  {t('settings.pushNotifications')}
                </div>
                <div style={{ fontSize: 'var(--fs-small)', color: 'var(--muted)' }}>
                  {t('settings.pushNotificationsDesc')}
                </div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: 48, height: 26, flexShrink: 0, marginLeft: 16 }}>
                <input type="checkbox" checked={pushEnabled} onChange={handleTogglePush} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{
                  position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                  background: pushEnabled ? 'var(--green)' : 'var(--bg4)',
                  borderRadius: 26, transition: '0.3s', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)'
                }}>
                  <span style={{
                    position: 'absolute', height: 20, width: 20,
                    left: pushEnabled ? 24 : 4, bottom: 3,
                    background: 'white', borderRadius: '50%', transition: '0.3s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                  }} />
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Información */}
        <div className="settings-card">
          <h2 className="settings-section-title">{t('settings.information')}</h2>
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">{t('settings.versionLabel')}</div>
              <div className="setting-description">Podio v1.2.0</div>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">{t('admin.season')}</div>
              <div className="setting-description">{t('settings.f1Season', { year: 2026 })}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}