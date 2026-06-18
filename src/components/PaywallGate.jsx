import { useState } from 'react';
import { useThemeStore } from '../stores/themeStore';
import { usePremium } from '../hooks/usePremium';

/**
 * PaywallGate - Envuelve contenido premium
 * 
 * Props:
 *   feature    (required) - key del feature: 'stats_advanced', 'deep_analytics', 
 *                           'export_excel', 'unlimited_groups', 'custom_profile'
 *   children   (required) - contenido que se muestra si tiene acceso
 *   fallback   (optional) - componente alternativo para free users (si no se pasa, muestra blur + modal)
 *   blur       (optional) - si true, muestra el contenido blurreado con overlay (default: true)
 *   compact    (optional) - si true, muestra versión compacta del gate (para botones inline)
 * 
 * Usage:
 *   <PaywallGate feature="stats_advanced">
 *     <DeepAnalyticsContent />
 *   </PaywallGate>
 * 
 *   <PaywallGate feature="export_excel" compact>
 *     <button onClick={handleExport}>Export</button>
 *   </PaywallGate>
 */

const FEATURE_INFO = {
  stats_advanced: {
    icon: '📊',
    title: 'Análisis Avanzado',
    description: 'Accedé a estadísticas detalladas, comparaciones y análisis profundo de predicciones.'
  },
  deep_analytics: {
    icon: '🔬',
    title: 'Deep Analytics',
    description: 'Ganadores por carrera, puntos pre-carrera, performance de pilotos y más.'
  },
  export_excel: {
    icon: '📥',
    title: 'Exportar a Excel',
    description: 'Descargá tus datos en formato Excel para análisis offline.'
  },
  unlimited_groups: {
    icon: '👥',
    title: 'Grupos Ilimitados',
    description: 'Unite a todos los grupos que quieras sin límite.'
  },
  no_ads: {
    icon: '🚫',
    title: 'Sin Publicidad',
    description: 'Disfrutá de la app sin banners ni interrupciones.'
  },
  custom_profile: {
    icon: '🎨',
    title: 'Perfil Personalizado',
    description: 'Personalizá tu perfil con colores y estilos exclusivos.'
  },
  badge_supporter: {
    icon: '⭐',
    title: 'Badge Supporter',
    description: 'Badge exclusivo que muestra tu apoyo a PodioF1.'
  }
};

const PREMIUM_BENEFITS = [
  '📊 Análisis avanzado de predicciones',
  '🔬 Deep Analytics con métricas de pilotos',
  '📥 Exportar datos a Excel',
  '👥 Grupos ilimitados',
  '⭐ Badge exclusivo "Supporter"',
  '🚫 Sin publicidad'
];

export default function PaywallGate({ feature, children, fallback, blur = true, compact = false }) {
  const { checkFeature, prices, loading } = usePremium();
  const theme = useThemeStore((state) => state.theme);
  const [showModal, setShowModal] = useState(false);

  // While loading, show children (avoids flash)
  if (loading) return children;

  // If feature is accessible, show children
  if (checkFeature(feature)) return children;

  // If custom fallback provided, use it
  if (fallback) return fallback;

  const info = FEATURE_INFO[feature] || { icon: '🔒', title: 'Premium', description: 'Esta función requiere una suscripción.' };

  // ============================================
  // COMPACT MODE (for inline buttons)
  // ============================================
  if (compact) {
    return (
      <button
        onClick={() => setShowModal(true)}
        style={{
          padding: '10px 16px',
          background: 'var(--bg3)',
          border: '1px solid var(--gold)',
          borderRadius: 8,
          color: 'var(--gold)',
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: "'Barlow Condensed', sans-serif",
          letterSpacing: 1,
          textTransform: 'uppercase',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.15)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg3)'; }}
      >
        👑 Premium
        {showModal && <UpgradeModal onClose={() => setShowModal(false)} prices={prices} theme={theme} />}
      </button>
    );
  }

  // ============================================
  // BLUR MODE (shows content behind blur)
  // ============================================
  return (
    <div style={{ position: 'relative' }}>
      {/* Blurred content preview */}
      {blur && (
        <div style={{
          filter: 'blur(6px)',
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0.4,
          maxHeight: 400,
          overflow: 'hidden'
        }}>
          {children}
        </div>
      )}

      {/* Overlay */}
      <div style={{
        position: blur ? 'absolute' : 'relative',
        top: blur ? 0 : 'auto',
        left: blur ? 0 : 'auto',
        right: blur ? 0 : 'auto',
        bottom: blur ? 0 : 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        zIndex: 5
      }}>
        <div style={{
          background: 'var(--bg2)',
          border: '1px solid var(--gold)',
          borderRadius: 16,
          padding: 32,
          textAlign: 'center',
          maxWidth: 380,
          boxShadow: '0 8px 40px rgba(201,168,76,0.15)'
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{info.icon}</div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 22, fontWeight: 900, color: 'var(--white)',
            marginBottom: 8, letterSpacing: 0.5
          }}>
            {info.title}
          </div>
          <div style={{
            fontSize: 13, color: 'var(--muted)', lineHeight: 1.6,
            marginBottom: 20
          }}>
            {info.description}
          </div>

          <button
            onClick={() => setShowModal(true)}
            style={{
              width: '100%', padding: '14px 24px',
              background: 'linear-gradient(135deg, #C9A84C, #A67C00)',
              border: 'none', borderRadius: 10, color: 'white',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 16, fontWeight: 800, letterSpacing: 1,
              textTransform: 'uppercase', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            👑 Hacete Premium
          </button>

          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10 }}>
            Desde ${prices.monthly}/mes
          </div>
        </div>
      </div>

      {showModal && <UpgradeModal onClose={() => setShowModal(false)} prices={prices} theme={theme} />}
    </div>
  );
}

// ============================================
// UPGRADE MODAL
// ============================================
function UpgradeModal({ onClose, prices, theme }) {
  return (
    <div
      data-theme={theme}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2000, padding: 20
      }}
      onClick={onClose}
    >
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 20, width: '100%', maxWidth: 440,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)', overflow: 'hidden',
        animation: 'premiumSlideIn 0.3s ease-out'
      }} onClick={e => e.stopPropagation()}>

        {/* Gold gradient header */}
        <div style={{
          background: 'linear-gradient(135deg, #C9A84C, #A67C00, #C9A84C)',
          padding: '28px 28px 20px', textAlign: 'center'
        }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>👑</div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 28, fontWeight: 900, color: 'white',
            letterSpacing: 1, textTransform: 'uppercase'
          }}>
            PodioF1 Premium
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
            Llevá tu experiencia al siguiente nivel
          </div>
        </div>

        {/* Benefits */}
        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {PREMIUM_BENEFITS.map((benefit, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                fontSize: 14, color: 'var(--white)'
              }}>
                <span style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: 'var(--gold)', flexShrink: 0
                }}>✓</span>
                {benefit}
              </div>
            ))}
          </div>

          {/* Pricing options */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <div style={{
              flex: 1, padding: 16, background: 'var(--bg3)',
              border: '2px solid var(--gold)', borderRadius: 12,
              textAlign: 'center', position: 'relative'
            }}>
              <div style={{
                position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                background: 'var(--gold)', color: 'white', fontSize: 9,
                fontWeight: 800, padding: '2px 10px', borderRadius: 10,
                textTransform: 'uppercase', letterSpacing: 1
              }}>
                Popular
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Mensual</div>
              <div style={{
                fontFamily: "'Barlow Condensed'", fontSize: 28, fontWeight: 900, color: 'var(--gold)'
              }}>
                ${prices.monthly}
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>por mes</div>
            </div>

            <div style={{
              flex: 1, padding: 16, background: 'var(--bg3)',
              border: '1px solid var(--border)', borderRadius: 12,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Temporada</div>
              <div style={{
                fontFamily: "'Barlow Condensed'", fontSize: 28, fontWeight: 900, color: 'var(--white)'
              }}>
                ${prices.seasonal}
              </div>
              <div style={{ fontSize: 10, color: 'var(--green)' }}>
                Ahorrás {Math.round((1 - prices.seasonal / (prices.monthly * 10)) * 100)}%
              </div>
            </div>
          </div>

          {/* CTA - placeholder for now */}
          <button
            onClick={() => {
              // TODO: Integrate payment provider
              alert('Próximamente: integración con MercadoPago');
              onClose();
            }}
            style={{
              width: '100%', padding: 16,
              background: 'linear-gradient(135deg, #C9A84C, #A67C00)',
              border: 'none', borderRadius: 12, color: 'white',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 18, fontWeight: 900, letterSpacing: 1,
              textTransform: 'uppercase', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            Suscribirme Ahora
          </button>

          <div style={{
            textAlign: 'center', fontSize: 11, color: 'var(--muted)',
            marginTop: 12, lineHeight: 1.5
          }}>
            Cancelá cuando quieras · Sin compromisos
          </div>
        </div>
      </div>

      <style>{`
        @keyframes premiumSlideIn {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

/**
 * PremiumBadge - Small inline badge to indicate premium feature
 * Usage: <PremiumBadge /> next to a feature label
 */
export function PremiumBadge() {
  const { checkFeature } = usePremium();
  // Don't show badge if paywall is off
  if (checkFeature('stats_advanced')) return null;
  
  return (
    <span style={{
      fontSize: 9, fontWeight: 800, color: 'var(--gold)',
      background: 'rgba(201,168,76,0.15)',
      border: '1px solid rgba(201,168,76,0.3)',
      padding: '1px 6px', borderRadius: 6,
      textTransform: 'uppercase', letterSpacing: 0.5,
      marginLeft: 6, verticalAlign: 'middle'
    }}>
      👑 PRO
    </span>
  );
}