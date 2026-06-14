import { useNavigate } from 'react-router-dom';

const tabs = [
  { key: 'charts', label: '📊 Gráficos', path: '' },
  { key: 'analysis', label: '📋 Análisis', path: '/analysis' },
  { key: 'deep', label: '🔬 Deep Analytics', path: '/deep' }
];

export default function StatsTabBar({ active, groupId }) {
  const navigate = useNavigate();

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
            onClick={() => navigate(`/group/${groupId}/stats${tab.path}`)}
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
          </button>
        );
      })}
    </div>
  );
}