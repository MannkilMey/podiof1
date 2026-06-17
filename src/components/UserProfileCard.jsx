import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import UserBadgesMini from './UserBadgesMini';

const TEAM_COLORS = {
  'Mercedes': '#00D2BE',
  'Red Bull Racing': '#3671C6',
  'Red Bull': '#3671C6',
  'Ferrari': '#E8002D',
  'McLaren': '#FF8700',
  'Aston Martin': '#006F62',
  'Alpine': '#0090FF',
  'Williams': '#005AFF',
  'RB': '#6692FF',
  'Visa Cash App RB': '#6692FF',
  'Haas': '#B6BABD',
  'Haas F1 Team': '#B6BABD',
  'Sauber': '#52E252',
  'Kick Sauber': '#52E252',
  'Cadillac': '#FFD700',
};

const DEFAULT_COLOR = '#E8002D';

export default function UserProfileCard({ userId }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetchUserData();
  }, [userId]);

  async function fetchUserData() {
    try {
      const { data: user } = await supabase
        .from('users')
        .select(`
          nombre, apellido, 
          escuderia_favorita:escuderia_favorita_id ( id, nombre ),
          piloto_favorito:piloto_favorito_id ( id, nombre_completo )
        `)
        .eq('id', userId)
        .single();

      if (user) setData(user);
    } catch (err) {
      console.error('Error fetching user profile card:', err);
    } finally {
      setLoaded(true);
    }
  }

  if (!loaded || !data) return null;

  const teamName = data.escuderia_favorita?.nombre || '';
  const teamColor = TEAM_COLORS[teamName] || DEFAULT_COLOR;
  const driverName = data.piloto_favorito?.nombre_completo || '';
  const initials = `${data.nombre?.[0] || ''}${data.apellido?.[0] || ''}`.toUpperCase();
  const fullName = `${data.nombre || ''} ${data.apellido || ''}`.trim();

  return (
    <div
      style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: '20px 24px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        position: 'relative',
        overflow: 'visible',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
      onClick={() => navigate('/profile')}
      onMouseEnter={e => { e.currentTarget.style.borderColor = teamColor; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Team color accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${teamColor}, ${teamColor}88)`,
        borderRadius: '14px 14px 0 0'        
      }} />

      {/* Avatar */}
      <div style={{
        width: 52, height: 52, borderRadius: '50%',
        background: `linear-gradient(135deg, ${teamColor}, ${teamColor}88)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
        fontSize: 20, color: 'white', flexShrink: 0,
        boxShadow: `0 2px 12px ${teamColor}33`
      }}>
        {initials || '?'}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20,
          fontWeight: 800, color: 'var(--white)', letterSpacing: 0.5,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
        }}>
          {fullName}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 4, flexWrap: 'wrap' }}>
          {teamName && (
            <span style={{ fontSize: 12, color: teamColor, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: teamColor, flexShrink: 0 }} />
              {teamName}
            </span>
          )}
          {driverName && (
            <span style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              🏎 {driverName}
            </span>
          )}
          {!teamName && !driverName && (
            <span style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>
              Tocá para completar tu perfil →
            </span>
          )}
        </div>
      </div>
          {/* Badges */}
      <div style={{ flexShrink: 0, maxWidth: 180 }}>
        <UserBadgesMini userId={userId} compact maxShow={6} />
      </div>
      {/* Arrow */}
      <div style={{ color: 'var(--muted)', fontSize: 18, flexShrink: 0 }}>›</div>
    </div>
  );
}