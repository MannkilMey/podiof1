import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import { useThemeStore } from '../../stores/themeStore';
import { usePremium } from '../../hooks/usePremium';
import { PremiumBadge, UpgradeModal } from '../../components/PaywallGate';

const getTabs = (t) => [
  { key: 'charts', label: `📊 ${t('stats.charts')}`, path: '', feature: null },
  { key: 'analysis', label: `📋 ${t('stats.analysis')}`, path: '/analysis', feature: 'stats_advanced' },
  { key: 'deep', label: `🔬 ${t('stats.deepAnalytics')}`, path: '/deep', feature: 'deep_analytics' }
];

export default function StatsTabBar({ active, groupId }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useThemeStore((state) => state.theme);
  const { checkFeature, prices } = usePremium();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const tabs = getTabs(t);

  const handleTabClick = (tab) => {
    if (tab.feature && !checkFeature(tab.feature)) {
      setShowUpgradeModal(true);
      return;
    }
    navigate(`/group/${groupId}/stats${tab.path}`);
  };

  return (
    <div style={{
      display: 'flex',
      gap: 4,
      marginBottom: 24,
      borderBottom: '2px solid var(--border)',
      paddingBottom: 0,
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch'
    }}>
      {tabs.map(tab => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab)}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: 'none',
              borderBottom: `3px solid ${isActive ? 'var(--red)' : 'transparent'}`,
              color: isActive ? 'var(--red)' : 'var(--muted)',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: -2,
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--white)'; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--muted)'; }}
          >
            {tab.label}
            {tab.feature && <PremiumBadge feature={tab.feature} />}
          </button>
        );
      })}

      {showUpgradeModal && (
        <UpgradeModal onClose={() => setShowUpgradeModal(false)} prices={prices} theme={theme} />
      )}
    </div>
  );
}