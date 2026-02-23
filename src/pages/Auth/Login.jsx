import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useThemeStore } from '../../stores/themeStore'
import { useToastStore } from '../../stores/toastStore'

const CSS = `
[data-theme="dark"] {
  --bg: #0A0A0C;
  --bg2: #111114;
  --bg3: #18181D;
  --border: rgba(255,255,255,0.07);
  --white: #F0F0F0;
  --muted: rgba(240,240,240,0.40);
  --red: #E8002D;
  --red-dim: rgba(232,0,45,0.13);
}

[data-theme="light"] {
  --bg: #F5F6F8;
  --bg2: #FFFFFF;
  --bg3: #E8EAEE;
  --border: rgba(0,0,0,0.10);
  --white: #1A1B1E;
  --muted: rgba(26,27,30,0.55);
  --red: #D40029;
  --red-dim: rgba(212,0,41,0.08);
}

.login-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  padding: 20px;
  font-family: 'Barlow', sans-serif;
  position: relative;
}

.theme-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.theme-opt {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
  color: var(--muted);
  border: none;
  background: transparent;
  font-family: inherit;
}

.theme-opt.active {
  background: var(--red);
  color: white;
}

.login-box {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  color: var(--white);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.logo-area {
  text-align: center;
  margin-bottom: 32px;
}

.logo-icon {
  width: 64px;
  height: 64px;
  background: var(--red);
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: 12px;
}

.logo-text {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--white);
}

.logo-text .accent {
  color: var(--red);
}

.logo-subtitle {
  font-size: 13px;
  color: var(--muted);
  margin-top: 8px;
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

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 13px;
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
  font-family: 'Barlow', sans-serif;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--red);
}

.form-input::placeholder {
  color: var(--muted);
}

.forgot-link {
  text-align: right;
  margin-top: 8px;
}

.forgot-link a {
  font-size: 12px;
  color: var(--red);
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.2s;
}

.forgot-link a:hover {
  opacity: 0.8;
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, var(--red), #FF3355);
  border: none;
  border-radius: 10px;
  color: white;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

.btn-submit:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.divider {
  text-align: center;
  margin: 24px 0;
  color: var(--muted);
  font-size: 13px;
  position: relative;
}

.divider-text {
  background: var(--bg2);
  padding: 0 10px;
  position: relative;
  z-index: 1;
}

.divider-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border);
  z-index: 0;
}

.register-link {
  text-align: center;
  font-size: 14px;
  color: var(--muted);
}

.register-link a {
  color: var(--red);
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.2s;
}

.register-link a:hover {
  opacity: 0.8;
}

@media (max-width: 500px) {
  .login-box {
    padding: 32px 24px;
  }
  
  .theme-toggle {
    top: 12px;
    right: 12px;
  }
}
`;

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const signIn = useAuthStore((state) => state.signIn)
  const user = useAuthStore((state) => state.user)
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const toast = useToastStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    }
  }, [user, navigate, location])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      toast.success('¡Bienvenido de vuelta! 🏁')
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    } catch (err) {
      console.error(err)
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.')
      toast.error('Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{CSS}</style>
      <div data-theme={theme} className="login-container">
        {/* Theme Toggle */}
        <div className="theme-toggle">
          <button 
            className={`theme-opt ${theme === "dark" ? "active" : ""}`}
            onClick={() => setTheme("dark")}
          >
            🌙
          </button>
          <button 
            className={`theme-opt ${theme === "light" ? "active" : ""}`}
            onClick={() => setTheme("light")}
          >
            ☀️
          </button>
        </div>

        <div className="login-box">
          {/* Logo Area */}
          <div className="logo-area">
            <div className="logo-icon">🏎</div>
            <div className="logo-text">
              Podio<span className="accent">F1</span>
            </div>
            <div className="logo-subtitle">
              Predicciones F1 · Temporada 2026
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">{error}</div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
              />
              <div className="forgot-link">
                <Link to="/forgot-password">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
            >
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span className="divider-text">o</span>
            <div className="divider-line" />
          </div>

          {/* Register Link */}
          <div className="register-link">
            ¿No tienes cuenta?{' '}
            <Link to="/register">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}