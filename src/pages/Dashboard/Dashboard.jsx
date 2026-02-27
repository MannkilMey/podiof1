import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useGroups } from '../../hooks/useGroups';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import GroupDashboard from './GroupDashboard';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&family=Share+Tech+Mono&display=swap');`;

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

[data-theme="dark"] {
  --bg:      #0A0A0C;  --bg2:    #111114;  --bg3:    #18181D;  --bg4:    #1E1E24;
  --border:  rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.13);
  --red:     #E8002D;  --red-dim: rgba(232,0,45,0.13);
  --white:   #F0F0F0;  --muted:  rgba(240,240,240,0.40); --muted2: rgba(240,240,240,0.05);
  --text-secondary: rgba(240,240,240,0.65);
  --gold:    #C9A84C;  --green:   #00D4A0;
  --shadow:  0 8px 40px rgba(0,0,0,0.55);  --nav-bg: rgba(10,10,12,0.92);
}

[data-theme="light"] {
  --bg:      #F5F6F8;  --bg2:    #FFFFFF;  --bg3:    #E8EAEE;  --bg4:    #DFE1E6;
  --border:  rgba(0,0,0,0.10); --border2: rgba(0,0,0,0.18);
  --red:     #D40029;  --red-dim: rgba(212,0,41,0.08);
  --white:   #1A1B1E;  --muted:  rgba(26,27,30,0.55); --muted2: rgba(0,0,0,0.04);
  --text-secondary: rgba(26,27,30,0.75);
  --gold:    #9C6F10;  --green:   #007F5F;
  --shadow:  0 8px 40px rgba(0,0,0,0.08);  --nav-bg: rgba(255,255,255,0.95);
}

html, body { 
  margin: 0; 
  padding: 0; 
  width: 100%;
  height: 100%;
  background: var(--bg); 
  color: var(--white); 
  font-family: 'Barlow', sans-serif; 
  transition: background .3s, color .3s; 
}

#root {
  min-height: 100vh;
  width: 100%;
  background: var(--bg);
}

.app { 
  min-height: 100vh; 
  width: 100%;
  display: flex; 
  flex-direction: column; 
  background: var(--bg);
}

.nav { 
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  height: 60px;
  background: var(--nav-bg);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  transition: background .3s, border-color .3s, color .3s; 
}

.nav-logo { 
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 22px;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--white); 
}

.nav-logo span { color: var(--red); }

.nav-logo-icon { 
  width: 32px;
  height: 32px;
  background: var(--red);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px; 
}

.nav-right { display: flex; align-items: center; gap: 10px; }

.icon-btn { 
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: border-color .2s, background .3s;
  color: var(--white); 
}

.icon-btn:hover { border-color: var(--red); }

.nav-avatar { 
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #E8002D, #FF6B35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  border: 2px solid var(--border);
  color: white;
  transition: border-color .2s; 
}

.nav-avatar:hover { border-color: var(--red); }

/* User Menu Dropdown */
.user-menu {
  position: relative;
}

.user-menu-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--bg2);
  border: 1px solid var(--border2);
  border-radius: 12px;
  min-width: 240px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  overflow: hidden;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-menu-header {
  padding: 16px;
  border-bottom: 1px solid var(--border);
  background: var(--bg3);
}

.user-menu-name {
  font-weight: 700;
  font-size: 15px;
  color: var(--white);
  margin-bottom: 4px;
}

.user-menu-email {
  font-size: 13px;
  color: var(--muted);
}

.user-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--white);
  cursor: pointer;
  transition: background 0.2s;
  font-size: 14px;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
}

.user-menu-item:hover {
  background: var(--bg3);
}

.user-menu-item.danger {
  color: var(--red);
}

.user-menu-item.danger:hover {
  background: var(--red-dim);
}

.user-menu-divider {
  height: 1px;
  background: var(--border);
  margin: 4px 0;
}

.theme-toggle { 
  display: flex;
  align-items: center;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  transition: background .3s; 
}

.theme-opt { 
  padding: 6px 10px;
  cursor: pointer;
  font-size: 15px;
  transition: background .2s;
  color: var(--muted); 
}

.theme-opt.active { background: var(--red); color: white; }

.group-bar { 
  background: var(--bg2);
  border-bottom: 1px solid var(--border);
  padding: 0 28px;
  display: flex;
  align-items: center;
  gap: 0;
  overflow-x: auto;
  scrollbar-width: none;
  transition: background .3s, border-color .3s; 
}

.group-bar::-webkit-scrollbar { display: none; }

.group-tab { 
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 16px;
  border-bottom: 3px solid transparent;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  color: var(--muted);
  transition: color .2s, border-color .2s;
  flex-shrink: 0; 
}

.group-tab:hover { color: var(--white); }
.group-tab.active { color: var(--red); border-bottom-color: var(--red); font-weight: 600; }

.group-tab-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); flex-shrink: 0; }
.group-tab-dot.admin { background: var(--red); }

.group-tab-badge { 
  font-size: 10px;
  font-weight: 700;
  background: var(--red-dim);
  color: var(--red);
  padding: 1px 6px;
  border-radius: 10px; 
}

.group-bar-all { 
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  color: var(--muted);
  border-bottom: 3px solid transparent;
  border-left: 1px solid var(--border);
  margin-left: 8px;
  transition: color .2s;
  flex-shrink: 0; 
}

.group-bar-all:hover { color: var(--red); }
.group-bar-all.active { color: var(--red); border-bottom-color: var(--red); }

.main { 
  flex: 1;
  padding: 24px 28px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  background: var(--bg);
}

.empty-state { text-align: center; padding: 80px 20px; }
.empty-icon { font-size: 64px; margin-bottom: 20px; opacity: 0.3; }

.empty-title { 
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 12px;
  color: var(--white); 
}

.empty-text { 
  color: var(--muted);
  font-size: 15px;
  margin-bottom: 32px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto; 
}

.btn-primary { 
  padding: 14px 28px;
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
  transition: opacity .2s, transform .15s; 
}

.btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }

.btn-secondary { 
  padding: 12px 24px;
  background: transparent;
  border: 2px solid var(--border);
  border-radius: 10px;
  color: var(--text-secondary);
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all .2s;
  margin-left: 12px; 
}

.btn-secondary:hover { 
  border-color: var(--red);
  color: var(--red);
  background: var(--red-dim);
}

.groups-grid { 
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 24px; 
}

.group-card { 
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
  cursor: pointer;
  transition: border-color .2s, transform .15s, background .3s;
  position: relative; 
}

.group-card:hover { border-color: var(--border2); transform: translateY(-2px); }
.group-card.is-active { border-color: var(--red); }

.group-card-name { 
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 12px;
  color: var(--white); 
}

.gc-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }

.gc-chip { 
  font-size: 11px;
  color: var(--muted);
  background: var(--bg3);
  padding: 3px 9px;
  border-radius: 20px;
  border: 1px solid var(--border); 
}

.gc-chip.admin { 
  color: var(--red);
  background: var(--red-dim);
  border-color: rgba(232, 0, 45, 0.25);
  font-weight: 700; 
}

.gc-stats { display: flex; gap: 0; margin-bottom: 14px; }
.gc-stat { text-align: center; flex: 1; }

.gc-stat-val { 
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 24px;
  font-weight: 900;
  color: var(--white); 
}

.gc-stat-lbl { 
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-top: 1px; 
}

.gc-divider { width: 1px; background: var(--border); align-self: stretch; }

.loading-container { 
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg); 
}

.loading-box { text-align: center; }
.loading-icon { font-size: 48px; margin-bottom: 16px; animation: spin 2s linear infinite; }

@keyframes spin { 
  from { transform: rotate(0deg); } 
  to { transform: rotate(360deg); } 
}

.loading-text { 
  font-size: 14px;
  color: var(--muted);
  font-family: 'Barlow Condensed', sans-serif;
  letter-spacing: 2px;
  text-transform: uppercase; 
}

@media(max-width: 900px) { 
  .main { padding: 16px; } 
  .nav { padding: 0 16px; } 
  .group-bar { padding: 0 16px; } 
  .groups-grid { grid-template-columns: 1fr; } 
}
`;

const TIPO_LABEL = { 
  f1_oficial: "Oficial F1", 
  puntos_fijos_10_15: "Puntaje Fijo", 
  personalizado: "Personalizado" 
};

// ============================================
// MODAL CREAR GRUPO
// ============================================
function CreateGroupModal({ isOpen, onClose, onSuccess, theme }) {
  const [formData, setFormData] = useState({
    nombre: '',
    temporada: 2026,
    tipo_puntaje: 'f1_oficial',
    cantidad_posiciones: 10,
    horas_cierre_prediccion: 24,
    bonus_vuelta_rapida_piloto: false,
    bonus_vuelta_rapida_escuderia: false,
    usa_sistema_dual: false,
    puntos_piloto_correcto: 5,
    bonus_posicion_exacta: 10
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = useAuthStore((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();

      const sistema_puntos = {
        "1": 25, "2": 18, "3": 15, "4": 12, "5": 10,
        "6": 8, "7": 6, "8": 4, "9": 2, "10": 1
      };

      const { data: newGroup, error: groupError } = await supabase
        .from('groups')
        .insert({
          nombre: formData.nombre,
          codigo_invitacion: code,
          temporada: formData.temporada,
          tipo_puntaje: formData.tipo_puntaje,
          cantidad_posiciones: formData.cantidad_posiciones,
          horas_cierre_prediccion: formData.horas_cierre_prediccion,
          creador_id: user.id,
          bonus_vuelta_rapida_piloto: formData.bonus_vuelta_rapida_piloto,
          bonus_vuelta_rapida_escuderia: formData.bonus_vuelta_rapida_escuderia,
          usa_sistema_dual: formData.usa_sistema_dual,
          puntos_piloto_correcto: formData.puntos_piloto_correcto,
          bonus_posicion_exacta: formData.bonus_posicion_exacta,
          sistema_puntos: sistema_puntos
        })
        .select()
        .single();

      if (groupError) throw groupError;

      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          grupo_id: newGroup.id,
          usuario_id: user.id,
          es_admin: true,
          estado: 'aprobado'
        });

      if (memberError) throw memberError;

      toast.success(`¡Grupo "${formData.nombre}" creado! Código: ${code}`);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al crear grupo');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const colors = {
    bg: theme === 'dark' ? '#111114' : '#FFFFFF',
    bg2: theme === 'dark' ? '#0A0A0C' : '#F5F6F8',
    bg3: theme === 'dark' ? '#18181D' : '#E8EAEE',
    border: theme === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.10)',
    border2: theme === 'dark' ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.18)',
    text: theme === 'dark' ? '#F0F0F0' : '#1A1B1E',
    muted: theme === 'dark' ? 'rgba(240,240,240,0.40)' : 'rgba(26,27,30,0.55)',
    redDim: theme === 'dark' ? 'rgba(232,0,45,0.13)' : 'rgba(212,0,41,0.08)'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      overflowY: 'auto'
    }} onClick={onClose}>
      <div style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        padding: '32px',
        width: '100%',
        maxWidth: '560px',
        color: colors.text,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }} onClick={(e) => e.stopPropagation()}>
        <h2 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '28px',
          fontWeight: '900',
          marginBottom: '8px',
          color: colors.text
        }}>Crear Nuevo Grupo</h2>
        <p style={{ color: colors.muted, fontSize: '14px', marginBottom: '24px' }}>
          Configura tu grupo de predicciones F1
        </p>

        {error && (
          <div style={{
            background: 'rgba(232, 0, 45, 0.1)',
            border: '1px solid rgba(232, 0, 45, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            color: '#E8002D',
            fontSize: '13px',
            marginBottom: '20px'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Nombre del Grupo */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: colors.muted,
              marginBottom: '8px'
            }}>Nombre del Grupo</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
              placeholder="Mi Grupo F1"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: colors.bg3,
                border: `1px solid ${colors.border}`,
                borderRadius: '10px',
                color: colors.text,
                fontSize: '15px',
                fontFamily: "'Barlow', sans-serif"
              }}
            />
          </div>

          {/* Temporada y Posiciones */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: colors.muted,
                marginBottom: '8px'
              }}>Temporada</label>
              <select
                value={formData.temporada}
                onChange={(e) => setFormData({ ...formData, temporada: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: colors.bg3,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '10px',
                  color: colors.text,
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                <option value={2026} style={{ background: colors.bg }}>2026</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: colors.muted,
                marginBottom: '8px'
              }}>Posiciones a predecir</label>
              <select
                value={formData.cantidad_posiciones}
                onChange={(e) => setFormData({ ...formData, cantidad_posiciones: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: colors.bg3,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '10px',
                  color: colors.text,
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                <option value={3} style={{ background: colors.bg }}>Top 3</option>
                <option value={5} style={{ background: colors.bg }}>Top 5</option>
                <option value={10} style={{ background: colors.bg }}>Top 10</option>
              </select>
            </div>
          </div>

          {/* Cierre de Predicciones */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: colors.muted,
              marginBottom: '8px'
            }}>⏰ Cierre de Predicciones</label>
            <select
              value={formData.horas_cierre_prediccion}
              onChange={(e) => setFormData({ ...formData, horas_cierre_prediccion: parseInt(e.target.value) })}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: colors.bg3,
                border: `1px solid ${colors.border}`,
                borderRadius: '10px',
                color: colors.text,
                fontSize: '15px',
                cursor: 'pointer'
              }}
            >
              <option value={24} style={{ background: colors.bg }}>24 horas antes (recomendado)</option>
              <option value={32} style={{ background: colors.bg }}>32 horas antes</option>
              <option value={48} style={{ background: colors.bg }}>48 horas antes (2 días)</option>
            </select>
            <div style={{
              fontSize: '12px',
              color: colors.muted,
              marginTop: '6px',
              lineHeight: '1.5'
            }}>
              Las predicciones se cerrarán {formData.horas_cierre_prediccion} horas antes del inicio de cada carrera
            </div>
          </div>

          {/* Sistema de Puntaje Info */}
          <div style={{
            background: colors.bg3,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: colors.muted,
              marginBottom: '8px'
            }}>Sistema de Puntaje F1 Oficial</div>
            <div style={{ fontSize: '13px', color: colors.muted, lineHeight: '1.6' }}>
              1° = 25 pts · 2° = 18 pts · 3° = 15 pts · 4° = 12 pts · 5° = 10 pts<br/>
              6° = 8 pts · 7° = 6 pts · 8° = 4 pts · 9° = 2 pts · 10° = 1 pt
            </div>
          </div>

          {/* Sistema Dual */}
          <div style={{
            background: colors.bg3,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            padding: '18px',
            marginBottom: '20px'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: formData.usa_sistema_dual ? '16px' : '0'
            }}>
              <input
                type="checkbox"
                checked={formData.usa_sistema_dual}
                onChange={(e) => setFormData({ ...formData, usa_sistema_dual: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer', marginTop: '2px', flexShrink: 0 }}
              />
              <div>
                <div style={{ fontWeight: '700', marginBottom: '6px', color: colors.text }}>
                  Puntuación por piloto sin posición exacta
                </div>
                <div style={{ color: colors.muted, fontSize: '13px', lineHeight: '1.6' }}>
                  Otorga puntos cuando aciertas el piloto aunque no esté en la posición exacta,
                  y da un bonus extra cuando aciertas ambos.
                </div>
              </div>
            </label>

            {formData.usa_sistema_dual && (
              <div style={{
                background: colors.bg2,
                border: `1px solid ${colors.border}`,
                borderRadius: '10px',
                padding: '14px',
                fontSize: '13px',
                lineHeight: '1.7'
              }}>
                <div style={{ color: colors.text, marginBottom: '8px' }}>
                  <strong>Ejemplo:</strong> Predecir Verstappen en 1° lugar
                </div>
                <div style={{ color: colors.muted }}>
                  • Si llega <strong style={{ color: colors.text }}>2°</strong> → 5 puntos (piloto correcto)
                </div>
                <div style={{ color: colors.muted }}>
                  • Si llega <strong style={{ color: colors.text }}>1°</strong> → 25 + 10 = 35 puntos (exacto + bonus)
                </div>
              </div>
            )}
          </div>

          {/* Bonus Vuelta Rápida */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: colors.muted,
              marginBottom: '10px'
            }}>Bonus Opcionales</div>
            
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '8px',
              padding: '10px',
              background: formData.bonus_vuelta_rapida_piloto ? colors.redDim : 'transparent',
              borderRadius: '8px',
              transition: 'background 0.2s',
              color: colors.text
            }}>
              <input
                type="checkbox"
                checked={formData.bonus_vuelta_rapida_piloto}
                onChange={(e) => setFormData({ ...formData, bonus_vuelta_rapida_piloto: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span>Bonus vuelta rápida piloto (+1 pt)</span>
            </label>
            
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '10px',
              background: formData.bonus_vuelta_rapida_escuderia ? colors.redDim : 'transparent',
              borderRadius: '8px',
              transition: 'background 0.2s',
              color: colors.text
            }}>
              <input
                type="checkbox"
                checked={formData.bonus_vuelta_rapida_escuderia}
                onChange={(e) => setFormData({ ...formData, bonus_vuelta_rapida_escuderia: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span>Bonus vuelta rápida escudería (+1 pt)</span>
            </label>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '14px 28px',
                background: loading 
                  ? (theme === 'dark' ? '#666' : '#999')
                  : 'linear-gradient(135deg, #E8002D, #FF3355)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '16px',
                fontWeight: '800',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'opacity .2s, transform .15s'
              }}
              onMouseOver={(e) => !loading && (e.target.style.opacity = '0.88')}
              onMouseOut={(e) => !loading && (e.target.style.opacity = '1')}
            >
              {loading ? 'Creando...' : 'Crear Grupo'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px 24px',
                background: 'transparent',
                border: `2px solid ${colors.border2}`,
                borderRadius: '10px',
                color: colors.text,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '14px',
                fontWeight: '700',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all .2s'
              }}
              onMouseOver={(e) => {
                e.target.style.borderColor = '#E8002D';
                e.target.style.color = '#E8002D';
                e.target.style.background = colors.redDim;
              }}
              onMouseOut={(e) => {
                e.target.style.borderColor = colors.border2;
                e.target.style.color = colors.text;
                e.target.style.background = 'transparent';
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// ============================================
// MODAL UNIRSE A GRUPO
// ============================================
function JoinGroupModal({ isOpen, onClose, onSuccess, theme }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = useAuthStore((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanCode = code.trim().toUpperCase();

      const { data: group, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('codigo_invitacion', cleanCode)
        .single();

      if (groupError || !group) {
        throw new Error('Código de invitación inválido');
      }

      const { data: existing } = await supabase
        .from('group_members')
        .select('*')
        .eq('grupo_id', group.id)
        .eq('usuario_id', user.id)
        .maybeSingle();

      if (existing) {
        throw new Error('Ya eres miembro de este grupo');
      }

      const { error: joinError } = await supabase
        .from('group_members')
        .insert({
          grupo_id: group.id,
          usuario_id: user.id,
          es_admin: false,
          estado: 'aprobado'
        });

      if (joinError) throw joinError;

      toast.success(`¡Te uniste al grupo "${group.nombre}"!`);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al unirse al grupo');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const colors = {
    bg: theme === 'dark' ? '#111114' : '#FFFFFF',
    bg3: theme === 'dark' ? '#18181D' : '#E8EAEE',
    border: theme === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.10)',
    border2: theme === 'dark' ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.18)',
    text: theme === 'dark' ? '#F0F0F0' : '#1A1B1E',
    muted: theme === 'dark' ? 'rgba(240,240,240,0.40)' : 'rgba(26,27,30,0.55)'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }} onClick={onClose}>
      <div style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        padding: '32px',
        width: '100%',
        maxWidth: '450px',
        color: colors.text,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }} onClick={(e) => e.stopPropagation()}>
        <h2 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '28px',
          fontWeight: '900',
          marginBottom: '8px',
          color: colors.text
        }}>Unirse a Grupo</h2>
        <p style={{ color: colors.muted, fontSize: '14px', marginBottom: '24px' }}>
          Ingresa el código de invitación del grupo
        </p>

        {error && (
          <div style={{
            background: 'rgba(232, 0, 45, 0.1)',
            border: '1px solid rgba(232, 0, 45, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            color: '#E8002D',
            fontSize: '13px',
            marginBottom: '20px'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: colors.muted,
              marginBottom: '8px'
            }}>Código de Invitación</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
              placeholder="ABC123XY"
              maxLength={10}
              style={{
                width: '100%',
                padding: '16px',
                background: colors.bg3,
                border: `2px solid ${colors.border}`,
                borderRadius: '10px',
                color: colors.text,
                fontSize: '20px',
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: '4px',
                textAlign: 'center',
                textTransform: 'uppercase'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ flex: 1, opacity: loading ? 0.5 : 1 }}
            >
              {loading ? 'Verificando...' : 'Unirse'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ flex: 1, margin: 0 }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================
// VISTA DE TODOS LOS GRUPOS
// ============================================
function GroupsView({ groups, onCreateGroup, onJoinGroup, onSelectGroup }) {
  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <button className="btn-primary" onClick={onCreateGroup}>
          ＋ Crear Grupo
        </button>
        <button className="btn-secondary" onClick={onJoinGroup}>
          🔗 Unirse con Código
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏁</div>
          <div className="empty-title">No tienes grupos todavía</div>
          <div className="empty-text">
            Crea tu primer grupo de predicciones o únete a uno existente con un código de invitación.
          </div>
        </div>
      ) : (
        <>
          <div style={{ 
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: 'var(--muted)',
            marginBottom: 12
          }}>Mis grupos · {groups.length} activos</div>
          <div className="groups-grid">
            {groups.map(g => (
              <div key={g.id} className="group-card" onClick={() => onSelectGroup(g)}>
                <div className="group-card-name">{g.nombre}</div>
                <div className="gc-chips">
                  <span className="gc-chip">{TIPO_LABEL[g.tipo]}</span>
                  <span className="gc-chip">T{g.temporada}</span>
                  {g.isAdmin && <span className="gc-chip admin">Admin</span>}
                </div>
                <div className="gc-stats">
                  <div className="gc-stat">
                    <div className="gc-stat-val">{g.posicion}°</div>
                    <div className="gc-stat-lbl">Posición</div>
                  </div>
                  <div className="gc-divider"/>
                  <div className="gc-stat">
                    <div className="gc-stat-val">{g.puntos}</div>
                    <div className="gc-stat-lbl">Puntos</div>
                  </div>
                  <div className="gc-divider"/>
                  <div className="gc-stat">
                    <div className="gc-stat-val">{g.miembros}</div>
                    <div className="gc-stat-lbl">Miembros</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

// ============================================
// COMPONENTE PRINCIPAL DASHBOARD
// ============================================
export default function Dashboard() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userIsSuperAdmin, setUserIsSuperAdmin] = useState(false);
  
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const { groups, loading } = useGroups(user?.id);
  const navigate = useNavigate();
  const { groupId } = useParams();
  
  const selectedGroup = groupId 
    ? groups.find(g => g.id === groupId) 
    : null;
  const view = groupId ? 'dashboard' : 'all';

  // Ref para detectar clicks fuera
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  useEffect(() => {
  async function checkSuperAdmin() {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('users')
        .select('is_super_admin')
        .eq('id', user.id)
        .single();
      
      setUserIsSuperAdmin(data?.is_super_admin || false);
    } catch (err) {
      console.error('Error checking super admin:', err);
      setUserIsSuperAdmin(false);
    }
  }
  
  checkSuperAdmin();
}, [user]);

  const handleSignOut = async () => {
    setShowUserMenu(false);
    await signOut();
    navigate('/login', { replace: true });
  };

  const handleCreateGroup = () => {
    setShowCreateModal(true);
  };

  const handleJoinGroup = () => {
    setShowJoinModal(true);
  };

  const handleModalSuccess = () => {
    window.location.reload();
  };

  const handleSelectGroup = (group) => {
    navigate(`/group/${group.id}`);
  };

  const handleBackToAll = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <>
        <style>{FONTS + CSS}</style>
        <div data-theme={theme} className="loading-container">
          <div className="loading-box">
            <div className="loading-icon">🏎</div>
            <div className="loading-text">Cargando grupos...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div data-theme={theme} className="app">
        {/* NAVBAR */}
        <nav className="nav">
          <div className="nav-logo">
            <div className="nav-logo-icon">🏎</div>
            Podio<span>F1</span>
          </div>
          <div className="nav-right">
            <div className="theme-toggle">
              <div 
                className={`theme-opt ${theme === "dark" ? "active" : ""}`} 
                onClick={() => setTheme("dark")} 
                title="Oscuro"
              >
                🌙
              </div>
              <div 
                className={`theme-opt ${theme === "light" ? "active" : ""}`} 
                onClick={() => setTheme("light")} 
                title="Claro"
              >
                ☀️
              </div>
            </div>
            <div className="icon-btn" title="Notificaciones">🔔</div>
            

            {/* USER MENU */}
            <div className="user-menu" ref={userMenuRef}>
              <div 
                className="nav-avatar" 
                onClick={() => setShowUserMenu(!showUserMenu)}
                title="Mi cuenta"
              >
                {user?.user_metadata?.nombre?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>

              {showUserMenu && (
                <div className="user-menu-dropdown">
                  <div className="user-menu-header">
                    <div className="user-menu-name">
                      {user?.user_metadata?.nombre || 'Usuario'}
                    </div>
                    <div className="user-menu-email">{user?.email}</div>
                  </div>

                  <button 
                    className="user-menu-item"
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/profile');
                    }}
                  >
                    <span>👤</span>
                    <span>Mi perfil</span>
                  </button>

                  <button 
                    className="user-menu-item"
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/settings');
                    }}
                  >
                    <span>⚙️</span>
                    <span>Configuración</span>
                  </button>
                  
                  {userIsSuperAdmin && (
                    <>
                      <div className="user-menu-divider"></div>
                      <button 
                        className="user-menu-item super-admin"
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/super-admin');
                        }}
                      >
                        <span>👑</span>
                        <span>Panel de Admin</span>
                      </button>
                    </>
                  )}

                  <div className="user-menu-divider"></div>

                  <button 
                    className="user-menu-item danger"
                    onClick={handleSignOut}
                  >
                    <span>🚪</span>
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* BARRA DE GRUPOS */}
        <div className="group-bar">
          {groups.map(g => (
            <div 
              key={g.id} 
              className={`group-tab ${groupId === g.id ? 'active' : ''}`}
              onClick={() => handleSelectGroup(g)}
            >
              <div className={`group-tab-dot ${g.isAdmin ? "admin" : ""}`}/>
              {g.nombre}
              {g.sinPredecir > 0 && <span className="group-tab-badge">{g.sinPredecir}</span>}
            </div>
          ))}
          <div 
            className={`group-bar-all ${!groupId ? 'active' : ''}`}
            onClick={handleBackToAll}
          >
            ⊞ Todos los grupos
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <main className="main">
          {view === 'all' ? (
            <GroupsView 
              groups={groups} 
              onCreateGroup={handleCreateGroup}
              onJoinGroup={handleJoinGroup}
              onSelectGroup={handleSelectGroup}
            />
          ) : (
            <GroupDashboard />
          )}
        </main>
      </div>

      {/* MODALES */}
      <CreateGroupModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleModalSuccess}
        theme={theme}
      />
      <JoinGroupModal 
        isOpen={showJoinModal} 
        onClose={() => setShowJoinModal(false)}
        onSuccess={handleModalSuccess}
        theme={theme}
      />
    </>
  );
}