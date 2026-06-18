import { useState, useEffect } from 'react';

/**
 * InstallPrompt - Banner que sugiere instalar la PWA
 * 
 * Solo aparece si:
 * - El navegador soporta PWA (beforeinstallprompt)
 * - El usuario no la tiene instalada
 * - No fue descartado en esta sesión
 * 
 * En iOS Safari muestra instrucciones manuales
 */
export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed this session
    if (sessionStorage.getItem('pwa_dismissed')) return;

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // On iOS, show after 30 seconds (no beforeinstallprompt event)
    if (iOS) {
      const timer = setTimeout(() => setShowBanner(true), 30000);
      return () => clearTimeout(timer);
    }

    // Android/Desktop: listen for beforeinstallprompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show after 15 seconds to not be annoying
      setTimeout(() => setShowBanner(true), 15000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('pwa_dismissed', 'true');
  };

  if (!showBanner || isInstalled) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      zIndex: 1500, padding: '12px 16px',
      background: 'var(--bg2, #111114)',
      borderTop: '1px solid var(--border, rgba(255,255,255,0.07))',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
      animation: 'installSlideUp 0.3s ease-out'
    }}>
      <div style={{
        maxWidth: 600, margin: '0 auto',
        display: 'flex', alignItems: 'center', gap: 12
      }}>
        {/* Icon */}
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: 'linear-gradient(135deg, #E8002D, #FF3355)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, flexShrink: 0
        }}>
          🏎
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 15, fontWeight: 800,
            color: 'var(--white, #F0F0F0)',
            letterSpacing: 0.5
          }}>
            Instalá PodioF1
          </div>
          <div style={{
            fontSize: 12,
            color: 'var(--muted, rgba(240,240,240,0.4))',
            lineHeight: 1.4
          }}>
            {isIOS
              ? 'Tocá el ícono de compartir y luego "Agregar a inicio"'
              : 'Acceso rápido desde tu pantalla de inicio'
            }
          </div>
        </div>

        {/* Actions */}
        {isIOS ? (
          <button onClick={handleDismiss} style={{
            padding: '8px 14px', background: 'transparent',
            border: '1px solid var(--border, rgba(255,255,255,0.07))',
            borderRadius: 8, color: 'var(--muted, rgba(240,240,240,0.4))',
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            fontFamily: "'Barlow Condensed', sans-serif",
            textTransform: 'uppercase', letterSpacing: 0.5
          }}>
            Entendido
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button onClick={handleDismiss} style={{
              padding: '8px 12px', background: 'transparent',
              border: 'none', color: 'var(--muted, rgba(240,240,240,0.4))',
              fontSize: 12, cursor: 'pointer',
              fontFamily: "'Barlow Condensed', sans-serif",
              textTransform: 'uppercase', letterSpacing: 0.5
            }}>
              Ahora no
            </button>
            <button onClick={handleInstall} style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #E8002D, #FF3355)',
              border: 'none', borderRadius: 8, color: 'white',
              fontSize: 13, fontWeight: 800, cursor: 'pointer',
              fontFamily: "'Barlow Condensed', sans-serif",
              textTransform: 'uppercase', letterSpacing: 0.5
            }}>
              Instalar
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes installSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}