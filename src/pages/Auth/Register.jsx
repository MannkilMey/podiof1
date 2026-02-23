import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useThemeStore } from '../../stores/themeStore'
import { useToastStore } from '../../stores/toastStore'
import { supabase } from '../../lib/supabase'

const PAISES = [
  'Argentina', 'Brasil', 'Chile', 'Colombia', 'Costa Rica', 'Ecuador', 'El Salvador',
  'España', 'Estados Unidos', 'Guatemala', 'Honduras', 'México', 'Nicaragua',
  'Panamá', 'Paraguay', 'Perú', 'Puerto Rico', 'República Dominicana', 'Uruguay', 'Venezuela'
]

const AÑOS = Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - i - 10)

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
  font-size: 14px;
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
  font-size: 28px;
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
  margin-top: 6px;
}

.error-message {
  background: var(--red-dim);
  border: 1px solid rgba(232, 0, 45, 0.3);
  border-radius: 8px;
  padding: 12px;
  color: var(--red);
  font-size: 13px;
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
  font-size: 12px;
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
  font-size: 14px;
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
  font-size: 14px;
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
  font-size: 16px;
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

.login-link {
  text-align: center;
  font-size: 14px;
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
    font-size: 12px;
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
    anho_nacimiento: '',
    sexo: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const toast = useToastStore()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      toast.error('Las contraseñas no coinciden')
      return
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      toast.error('La contraseña debe tener al menos 6 caracteres')
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
        anho_nacimiento: parseInt(formData.anho_nacimiento),
        sexo: formData.sexo || null,
      })

      if (userError) throw userError

      await supabase.auth.signOut()

      toast.success('¡Cuenta creada! Ya puedes iniciar sesión 🏁')
      navigate('/login', { replace: true })
    } catch (err) {
      console.error(err)
      setError(err.message || 'Error al crear cuenta. Intenta de nuevo.')
      toast.error('Error al crear cuenta')
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
          ← Volver
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
            <div className="logo-icon">🏎</div>
            <div className="logo-text">
              Podio<span className="accent">F1</span>
            </div>
            <div className="logo-subtitle">
              Crea tu cuenta para competir
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
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="José"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  placeholder="López"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group-row">
              <div>
                <label className="form-label">Contraseña</label>
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
                <label className="form-label">Confirmar</label>
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
              <label className="form-label">País</label>
              <select
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Selecciona tu país</option>
                {PAISES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="form-group-row">
              <div>
                <label className="form-label">Año de Nacimiento</label>
                <select
                  name="anho_nacimiento"
                  value={formData.anho_nacimiento}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="">Año</option>
                  {AÑOS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Sexo (Opcional)</label>
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Prefiero no decir</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span className="divider-text">o</span>
            <div className="divider-line" />
          </div>

          {/* Login Link */}
          <div className="login-link">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login">
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}