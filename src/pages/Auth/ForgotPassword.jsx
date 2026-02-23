import { useState } from 'react';
import { Link } from 'react-router-dom';
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

.forgot-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.forgot-box {
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

.forgot-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #F0F0F0;
  text-align: center;
  margin-bottom: 12px;
}

.forgot-subtitle {
  color: rgba(240, 240, 240, 0.6);
  text-align: center;
  margin-bottom: 32px;
  font-size: 15px;
  line-height: 1.5;
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

.back-link {
  text-align: center;
  margin-top: 24px;
  color: rgba(240, 240, 240, 0.6);
  font-size: 14px;
}

.back-link a {
  color: #E8002D;
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.2s;
}

.back-link a:hover {
  opacity: 0.8;
}

.success-message {
  background: rgba(0, 212, 160, 0.1);
  border: 1px solid rgba(0, 212, 160, 0.3);
  border-radius: 10px;
  padding: 20px;
  color: #00D4A0;
  margin-bottom: 24px;
  text-align: center;
  font-size: 14px;
  line-height: 1.6;
}

.success-icon {
  font-size: 48px;
  margin-bottom: 12px;
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
  .forgot-box {
    padding: 32px 24px;
  }
}
`;

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Por favor ingresa tu email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;

      setEmailSent(true);
      toast.success('Email enviado correctamente');

    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error al enviar el email');
      toast.error('Error al enviar el email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div className="forgot-container">
        <div className="forgot-box">
          <div className="logo">
            <div className="logo-icon">🏎</div>
            <div className="logo-text">Podio<span>F1</span></div>
          </div>

          {emailSent ? (
            <>
              <div className="success-message">
                <div className="success-icon">✅</div>
                <div>
                  <strong>Email enviado correctamente</strong>
                  <br/><br/>
                  Te enviamos un enlace de recuperación a:
                  <br/>
                  <strong>{email}</strong>
                  <br/><br/>
                  Revisa tu bandeja de entrada y spam. El enlace es válido por 1 hora.
                </div>
              </div>

              <div className="back-link">
                <Link to="/login">← Volver al login</Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="forgot-title">¿Olvidaste tu contraseña?</h1>
              <p className="forgot-subtitle">
                Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
              </p>

              {error && (
                <div className="error-message">{error}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                </button>
              </form>

              <div className="back-link">
                ¿Recordaste tu contraseña? <Link to="/login">Inicia sesión</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}