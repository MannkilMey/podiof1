import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useThemeStore } from '../../stores/themeStore'
import { useToastStore } from '../../stores/toastStore'
import { supabase } from '../../lib/supabase'
import { useTranslation } from '../../i18n'
import { isNative } from '../../hooks/usePlatform'
import { loginWithGoogle, loginWithApple, isUserCancelled } from '../../lib/nativeAuth'

const PAISES = [
  'Argentina', 'Brasil', 'Chile', 'Colombia', 'Costa Rica', 'Ecuador', 'El Salvador',
  'España', 'Estados Unidos', 'Guatemala', 'Honduras', 'México', 'Nicaragua',
  'Panamá', 'Paraguay', 'Perú', 'Puerto Rico', 'República Dominicana', 'Uruguay', 'Venezuela'
]


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

.register-container {
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

.back-btn-top {
  position: absolute;
  top: 20px;
  left: 20px;
  background: transparent;
  border: 2px solid var(--border);
  border-radius: 8px;
  padding: 8px 16px;
  color: var(--white);
  font-size: var(--fs-body);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.back-btn-top:hover {
  border-color: var(--red);
  color: var(--red);
  background: var(--red-dim);
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

.register-box {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 520px;
  color: var(--white);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.logo-area {
  text-align: center;
  margin-bottom: 32px;
}

.logo-icon {
  width: 56px;
  height: 56px;
  background: var(--red);
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 10px;
}

.logo-text {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: var(--fs-stat-secondary);
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--white);
}

.logo-text .accent {
  color: var(--red);
}

.logo-subtitle {
  font-size: var(--fs-small);
  color: var(--muted);
  margin-top: 6px;
}

.error-message {
  background: var(--red-dim);
  border: 1px solid rgba(232, 0, 45, 0.3);
  border-radius: 8px;
  padding: 12px;
  color: var(--red);
  font-size: var(--fs-small);
  margin-bottom: 18px;
}

.form-group {
  margin-bottom: 18px;
}

.form-group-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 18px;
}

.form-label {
  display: block;
  font-size: var(--fs-small);
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 7px;
}

.form-input {
  width: 100%;
  padding: 11px 14px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 9px;
  color: var(--white);
  font-size: 16px;
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

.form-select {
  width: 100%;
  padding: 11px 14px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 9px;
  color: var(--white);
  font-size: 16px;
  font-family: 'Barlow', sans-serif;
  cursor: pointer;
  transition: border-color 0.2s;
}

.form-select:focus {
  outline: none;
  border-color: var(--red);
}

.form-select option {
  background: var(--bg2);
  color: var(--white);
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, var(--red), #FF3355);
  border: none;
  border-radius: 10px;
  color: white;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: var(--fs-subtitle);
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  margin-top: 8px;
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
  margin: 20px 0;
  color: var(--muted);
  font-size: var(--fs-small);
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

.login-link {
  text-align: center;
  font-size: var(--fs-body);
  color: var(--muted);
}

.login-link a {
  color: var(--red);
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.2s;
}

.login-link a:hover {
  opacity: 0.8;
}

@media (max-width: 600px) {
  .register-box {
    padding: 32px 24px;
  }
  
  .form-group-row {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  
  .back-btn-top {
    top: 12px;
    left: 12px;
    padding: 6px 12px;
  }
  
  .theme-toggle {
    top: 12px;
    right: 12px;
  }
}
`;

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido: '',
    pais: '',
    termsAccepted: false
  })
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState(null) // 'google' | 'apple' | null
  const [error, setError] = useState('')

  const user = useAuthStore((state) => state.user)
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const toast = useToastStore()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const anyLoading = loading || !!socialLoading

  // Navegar al home SOLO cuando un login social crea la sesión.
  // El flujo de email NO entra acá: hace signOut() y va a /login por su cuenta.
  useEffect(() => {
    if (user && socialLoading) {
      navigate('/', { replace: true })
    }
  }, [user, socialLoading, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleGoogleRegister = async () => {
    if (anyLoading) return
    setError('')
    setSocialLoading('google')
    try {
      await loginWithGoogle()
      // web: el navegador redirige. native: el useEffect navega cuando `user` se setea.
    } catch (err) {
      if (!isUserCancelled(err)) {
        console.error(err)
        toast.error(t('auth.errorLogin'))
      }
      setSocialLoading(null)
    }
  }

  const handleAppleRegister = async () => {
    if (anyLoading) return
    setError('')
    setSocialLoading('apple')
    try {
      await loginWithApple()
      // native: el useEffect navega cuando `user` se setea.
    } catch (err) {
      if (!isUserCancelled(err)) {
        console.error(err)
        toast.error(t('auth.errorLogin'))
      }
      setSocialLoading(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordMismatch'))
      toast.error(t('auth.passwordMismatch'))
      return
    }
    if (!formData.termsAccepted) {
      setError(t('auth.mustAcceptTerms'))
      toast.error(t('auth.mustAcceptTerms'))
      return
    }
    if (formData.password.length < 6) {
      setError(t('auth.passwordTooShort'))
      toast.error(t('auth.passwordTooShort'))
      return
    }

    setLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nombre: formData.nombre,
            apellido: formData.apellido,
          },
          emailRedirectTo: undefined,
        }
      })

      if (authError) throw authError

      const { error: userError } = await supabase.from('users').insert({
        id: authData.user.id,
        email: formData.email,
        nombre: formData.nombre,
        apellido: formData.apellido,
        pais: formData.pais,
        terms_accepted_at: new Date().toISOString(),
        terms_version: '1.0',
      })

      if (userError) throw userError

      await supabase.auth.signOut()

      toast.success(t('auth.accountCreated'))
      navigate('/login', { replace: true })
    } catch (err) {
      console.error(err)
      setError(err.message || t('auth.accountCreationError'))
      toast.error(t('auth.accountCreationErrorShort'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{CSS}</style>
      <div data-theme={theme} className="register-container">
        {/* Botón Volver */}
        <button 
          className="back-btn-top"
          onClick={() => navigate('/landing')}
        >
          ← {t('common.back')}
        </button>

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

        <div className="register-box">
          {/* Logo Area */}
          <div className="logo-area">
            <img src="/logo.png" alt="Podio" style={{width: 56, height: 56, borderRadius: 12, objectFit: 'cover'}} />
            <div className="logo-text">
              Podio
            </div>
            <div className="logo-subtitle">
              {t('auth.registerSubtitle')}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">{error}</div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group-row">
              <div>
                <label className="form-label">{t('auth.firstName')}</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder={t('auth.firstNamePlaceholder')}
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">{t('auth.lastName')}</label>
                <input
                  type="text"
                  name="apellido"
                  placeholder={t('auth.lastNamePlaceholder')}
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('auth.email')}</label>
              <input
                type="email"
                name="email"
                placeholder={t('auth.emailPlaceholder')}
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group-row">
              <div>
                <label className="form-label">{t('auth.password')}</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">{t('auth.confirmPassword')}</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('auth.country')}</label>
              <select
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">{t('auth.countryPlaceholder')}</option>
                {PAISES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              cursor: 'pointer',
              fontSize: 'var(--fs-small)',
              color: 'var(--muted)',
              marginBottom: 16,
              lineHeight: 1.5
            }}>
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                style={{ width: 18, height: 18, cursor: 'pointer', marginTop: 2, flexShrink: 0 }}
              />
              <span>
                {t('auth.acceptTermsPrefix')}{' '}
                <a href="/terms" target="_blank" style={{ color: 'var(--red)', textDecoration: 'none' }}>
                  {t('auth.termsAndConditions')}
                </a>{' '}
                {t('auth.acceptTermsAnd')}{' '}
                <a href="/privacy" target="_blank" style={{ color: 'var(--red)', textDecoration: 'none' }}>
                  {t('auth.privacyPolicy')}
                </a>
              </span>
            </label>

            <button
              type="submit"
              disabled={anyLoading}
              className="btn-submit"
            >
              {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span className="divider-text">{t('common.or')}</span>
            <div className="divider-line" />
          </div>

          {/* Google Register */}
          <button
            onClick={handleGoogleRegister}
            disabled={anyLoading}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              color: 'var(--white)',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: 'uppercase',
              cursor: anyLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              opacity: socialLoading === 'google' ? 0.5 : (anyLoading ? 0.6 : 1),
              marginBottom: isNative ? 12 : 20
            }}
            onMouseEnter={(e) => { if (!anyLoading) e.currentTarget.style.borderColor = 'var(--red)' }}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {socialLoading === 'google' ? (t('common.loading') || 'Cargando...') : (t('auth.continueWithGoogle') || 'Continuar con Google')}
          </button>

          {/* Apple Register — solo en la app iOS (diseño exigido por Apple: fondo negro + logo) */}
          {isNative && (
            <button
              onClick={handleAppleRegister}
              disabled={anyLoading}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#000',
                border: '1px solid #000',
                borderRadius: 10,
                color: '#fff',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: 'uppercase',
                cursor: anyLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                opacity: socialLoading === 'apple' ? 0.5 : (anyLoading ? 0.6 : 1),
                marginBottom: 20
              }}
            >
              <svg width="18" height="18" viewBox="0 0 384 512" fill="#fff" style={{ marginTop: -2 }}>
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C64.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
              </svg>
              {socialLoading === 'apple' ? (t('common.loading') || 'Cargando...') : (t('auth.continueWithApple') || 'Continuar con Apple')}
            </button>
          )}

          {/* Login Link */}
          <div className="login-link">
           {t('auth.haveAccount')}{' '}
            <Link to="/login">
              {t('auth.signIn')}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}