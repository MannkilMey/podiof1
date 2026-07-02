import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useTranslation } from '../i18n';

const CSS = `
.badges-mini { display: flex; flex-wrap: wrap; gap: 4px; }
.badge-mini-item { 
  width: 32px; height: 32px; 
  display: flex; align-items: center; justify-content: center;
  border-radius: 8px; font-size: 18px; 
  background: var(--bg3); border: 1px solid var(--border);
  transition: all 0.2s; cursor: default; position: relative;
}
.badge-mini-item.unlocked { border-color: var(--border2); }
.badge-mini-item.unlocked:hover { transform: scale(1.15); border-color: var(--gold); z-index: 2; }
.badge-mini-item.locked { opacity: 0.25; filter: grayscale(1); }
.badge-mini-tooltip {
  position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);
  background: var(--bg2); border: 1px solid var(--border2); border-radius: 8px;
  padding: 8px 12px; white-space: nowrap; pointer-events: none; opacity: 0;
  transition: opacity 0.2s; z-index: 10; box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  font-size: var(--fs-label); color: var(--white); text-align: center;
}
.badge-mini-item.unlocked:hover .badge-mini-tooltip { opacity: 1; }
.badge-mini-tooltip-name { font-weight: 700; font-family: 'Barlow Condensed', sans-serif; font-size: var(--fs-small); margin-bottom: 2px; }
.badge-mini-tooltip-desc { color: var(--muted); font-size: var(--fs-label); }
.badges-mini-summary { display: flex; align-items: center; gap: 8px; font-size: var(--fs-label); color: var(--muted); margin-bottom: 8px; }
.badges-mini-summary strong { color: var(--white); font-family: 'Barlow Condensed', sans-serif; font-size: var(--fs-body); }
.badges-mini-bar { flex: 1; height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; max-width: 100px; }
.badges-mini-bar-fill { height: 100%; background: linear-gradient(90deg, var(--red), var(--gold)); border-radius: 2px; transition: width 0.4s ease; }
`;

/**
 * UserBadgesMini - Compact badges display for any user
 * 
 * Props:
 *   userId     (required) - UUID of the user
 *   grupoId    (optional) - filter badges by group
 *   showAll    (optional) - show locked badges too (default: false, only unlocked)
 *   compact    (optional) - only show icons, no summary (default: false)
 *   maxShow    (optional) - max badges to display before "+N more"
 *   onClick    (optional) - callback when clicking the badges area
 */
export default function UserBadgesMini({ userId, grupoId, showAll = false, compact = false, maxShow = 12, onClick }) {
  const { t } = useTranslation(); 
  const [allBadges, setAllBadges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetchBadges();
  }, [userId, grupoId]);

  async function fetchBadges() {
    try {
      const [badgesRes, ubRes] = await Promise.all([
        supabase.from('badges').select('id, key, nombre, descripcion, icono, categoria, es_secreto, orden').order('orden'),
        grupoId
          ? supabase.from('user_badges').select('badge_id').eq('usuario_id', userId).eq('grupo_id', grupoId)
          : supabase.from('user_badges').select('badge_id').eq('usuario_id', userId)
      ]);
      setAllBadges(badgesRes.data || []);
      setUserBadges(ubRes.data || []);
    } catch (err) {
      console.error('Error fetching badges:', err);
    } finally {
      setLoaded(true);
    }
  }

  const unlockedIds = useMemo(() => new Set(userBadges.map(ub => ub.badge_id)), [userBadges]);

  const displayBadges = useMemo(() => {
    if (showAll) return allBadges;
    return allBadges.filter(b => unlockedIds.has(b.id));
  }, [allBadges, unlockedIds, showAll]);

  const totalBadges = allBadges.length;
  const unlockedCount = unlockedIds.size;
  const pct = totalBadges > 0 ? Math.round((unlockedCount / totalBadges) * 100) : 0;

  if (!loaded) return null;
  if (!compact && unlockedCount === 0) {
    return (
      <div style={{ fontSize: 'var(--fs-label)', color: 'var(--muted)', padding: '8px 0' }}>
        🔒 {t('badges.noneUnlocked')}
      </div>
    );
  }

  const visible = displayBadges.slice(0, maxShow);
  const remaining = displayBadges.length - maxShow;
 
  return (
    <>
      <style>{CSS}</style>
      <div onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
        {!compact && (
          <div className="badges-mini-summary">
            <span>🏅 <strong>{unlockedCount}</strong>/{totalBadges}</span>
            <div className="badges-mini-bar">
              <div className="badges-mini-bar-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}
        <div className="badges-mini">
          {visible.map(badge => {
            const isUnlocked = unlockedIds.has(badge.id);
            const isSecret = badge.es_secreto;
            return (
              <div key={badge.id} className={`badge-mini-item ${isUnlocked ? 'unlocked' : 'locked'}`}>
                {isUnlocked || !isSecret ? badge.icono : '🔒'}
                {isUnlocked && (
                  <div className="badge-mini-tooltip">
                    <div className="badge-mini-tooltip-name">{t(`badges.items.${badge.key}.nombre`)}</div>
                    <div className="badge-mini-tooltip-desc">{t(`badges.items.${badge.key}.descripcion`)}</div>
                  </div>
                )}
              </div>
            );
          })}
          {remaining > 0 && (
            <div className="badge-mini-item unlocked" style={{ fontSize: 'var(--fs-label)', color: 'var(--muted)', fontWeight: 700, fontFamily: "'Barlow Condensed'" }}>
              +{remaining}
            </div>
          )}
        </div>
      </div>
    </>
  );
}