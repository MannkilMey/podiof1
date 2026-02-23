import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');`;

const CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Barlow', sans-serif;
  background: linear-gradient(135deg, #0A0A0C 0%, #1a0510 100%);
  min-height: 100vh;
}

.reset-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.reset-box {
  background: rgba(17, 17, 20, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 48px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #E8002D, #FF3355);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.logo-text {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #F0F0F0;
}

.logo-text span {
  color: #E8002D;
}

.reset-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #F0F0F0;
  text-align: center;
  margin-bottom: 12px;
}

.reset-subtitle {
  color: rgba(240, 240, 240, 0.6);
  text-align: center;
  margin-bottom: 32px;
  font-size: 15px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: rgba(240, 240, 240, 0.8);
  margin-bottom: 8px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.form-input {
  width: 100%;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #F0F0F0;
  font-size: 15px;
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #E8002D;
  background: rgba(255, 255, 255, 0.08);
}

.password-hint {
  font-size: 12px;
  color: rgba(240, 240, 240, 0.5);
  margin-top: 6px;
}

.password-strength {
  margin-top: 8px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.password-strength-bar {
  height: 100%;
  transition: all 0.3s;
}

.password-strength-bar.weak {
  width: 33%;
  background: #E8002D;
}

.password-strength-bar.medium {
  width: 66%;
  background: #FFB800;
}

.password-strength-bar.strong {
  width: 100%;
  background: #00D4A0;
}

.btn-submit {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #E8002D, #FF3355);
  border: none;
  border-radius: 10px;
  color: white;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
}

.btn-submit:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  background: rgba(232, 0, 45, 0.1);
  border: 1px solid rgba(232, 0, 45, 0.3);
  border-radius: 10px;
  padding: 16px;
  color: #E8002D;
  margin-bottom: 24px;
  text-align: center;
  font-size: 14px;
}

@media (max-width: 600px) {
  .reset-box {
    padding: 32px 24px;
  }
}
`;

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar que hay una sesión de recuperación activa
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error('Enlace inválido o expirado');
        navigate('/forgot-password');
      }
    });
  }, [navigate]);

  useEffect(() => {
    // Calcular fortaleza de contraseña
    if (password.length === 0) {
      setPasswordStrength('');
    } else if (password.length < 6) {
      setPasswordStrength('weak');
    } else if (password.length < 10) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      toast.success('¡Contraseña actualizada correctamente!');
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error al actualizar la contraseña');
      toast.error('Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div className="reset-container">
        <div className="reset-box">
          <div className="logo">
            <div className="logo-icon">🏎</div>
            <div className="logo-text">Podio<span>F1</span></div>
          </div>

          <h1 className="reset-title">Nueva Contraseña</h1>
          <p className="reset-subtitle">
            Ingresa tu nueva contraseña
          </p>

          {error && (
            <div className="error-message">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nueva Contraseña</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoFocus
              />
              <div className="password-hint">Mínimo 6 caracteres</div>
              {passwordStrength && (
                <div className="password-strength">
                  <div className={`password-strength-bar ${passwordStrength}`}></div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirmar Contraseña</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}