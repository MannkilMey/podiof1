import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

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

.profile-container {
  padding: 24px 28px;
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
}

.profile-header {
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

.profile-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 32px;
  font-weight: 900;
  color: var(--white);
}

.profile-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 32px;
  margin-bottom: 24px;
}

.profile-avatar-section {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border);
}

.profile-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #E8002D, #FF6B35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 32px;
  color: white;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: var(--white);
  margin-bottom: 4px;
}

.profile-email {
  color: var(--muted);
  font-size: 14px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--white);
  font-size: 15px;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--red);
}

.form-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  padding: 12px 24px;
  background: linear-gradient(135deg, var(--red), #FF3355);
  border: none;
  border-radius: 10px;
  color: white;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  background: var(--red-dim);
  border: 1px solid rgba(232, 0, 45, 0.3);
  border-radius: 8px;
  padding: 12px;
  color: var(--red);
  font-size: 13px;
  margin-bottom: 20px;
}

.success-message {
  background: rgba(0, 212, 160, 0.1);
  border: 1px solid rgba(0, 212, 160, 0.3);
  border-radius: 8px;
  padding: 12px;
  color: #00D4A0;
  font-size: 13px;
  margin-bottom: 20px;
}
`;

export default function Profile() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.user_metadata?.nombre || '',
        apellido: user.user_metadata?.apellido || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          nombre: formData.nombre,
          apellido: formData.apellido
        }
      });

      if (updateError) throw updateError;

      setSuccess('Perfil actualizado correctamente');
      toast.success('Perfil actualizado');
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error al actualizar perfil');
      toast.error('Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div data-theme={theme} className="profile-container">
        <div className="profile-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            ←
          </button>
          <h1 className="profile-title">Mi Perfil</h1>
        </div>

        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              {formData.nombre?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="profile-info">
              <div className="profile-name">
                {formData.nombre || formData.apellido 
                  ? `${formData.nombre} ${formData.apellido}`.trim()
                  : 'Usuario'}
              </div>
              <div className="profile-email">{user?.email}</div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-input"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Tu nombre"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Apellido</label>
              <input
                type="text"
                className="form-input"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                placeholder="Tu apellido"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={user?.email}
                disabled
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}