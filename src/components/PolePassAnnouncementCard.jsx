import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n';

export default function PolePassAnnouncementCard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem('polepass_announcement_dismissed') === 'true');

  if (dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem('polepass_announcement_dismissed', 'true');
    setDismissed(true);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--bg2), rgba(201,168,76,0.06))',
      border: '1px solid var(--gold)', borderRadius: 14, padding: 18,
      marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap'
    }}>
      <span style={{ fontSize: 28 }}>👑</span>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'var(--fs-subtitle)', color: 'var(--white)' }}>
          {t('polePassAnnouncement.title')}
        </div>
        <div style={{ fontSize: 'var(--fs-small)', color: 'var(--muted)' }}>
          {t('polePassAnnouncement.subtitle')}
        </div>
      </div>
      <button
        onClick={() => navigate('/upgrade', { state: { origen: 'anuncio_dashboard' } })}
        style={{
          padding: '8px 16px', background: 'linear-gradient(135deg, var(--gold), #A67C00)',
          border: 'none', borderRadius: 8, color: 'white', fontWeight: 700, fontSize: 'var(--fs-small)',
          cursor: 'pointer', whiteSpace: 'nowrap'
        }}
      >
        {t('polePassAnnouncement.cta')}
      </button>
      <button onClick={handleDismiss} style={{
        background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 16, padding: 4
      }}>✕</button>
    </div>
  );
}