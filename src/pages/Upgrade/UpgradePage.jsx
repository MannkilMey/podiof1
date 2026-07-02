import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeStore } from '../../stores/themeStore';
import { usePremium } from '../../hooks/usePremium';
import { UpgradeModal } from '../../components/PaywallGate';
import BackButton from '../../components/BackButton';
import { useTranslation } from '../../i18n';
import { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Nunito:wght@600;700;800;900&display=swap');`;

const CSS = `
.back-btn { background: transparent; border: none; color: var(--red); cursor: pointer; font-size: var(--fs-body); font-weight: 600; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; padding: 0; transition: opacity 0.2s; }
.back-btn:hover { opacity: 0.7; }
`;

export default function UpgradePage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const theme = useThemeStore((state) => state.theme);
  const { prices } = usePremium();
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) return;
    const origen = location.state?.origen || 'directo';
    supabase.from('upgrade_interactions').insert({
      usuario_id: user.id,
      accion: 'vio_modal',
      origen
    }).then(({ error }) => {
      if (error) console.error('Error registrando vista de upgrade:', error);
    });
  }, [user]);

  return (
    <div data-theme={theme} style={{ minHeight: '100vh', background: 'var(--bg)', padding: '24px 20px' }}>
      <style>{FONTS + CSS}</style>
      <BackButton className="back-btn" onClick={() => navigate(-1)}>
        ← {t('common.back')}
      </BackButton>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <UpgradeModal
          asPage
          onClose={() => navigate(-1)}
          prices={prices}
          theme={theme}
        />
      </div>
    </div>
  );
}