import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { useTranslation, getDateLocale } from '../../i18n';
import BackButton from '../../components/BackButton';


const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&family=Share+Tech+Mono&display=swap');`;

const CSS = `
[data-theme="dark"] {
  --bg: #0A0A0C; --bg2: #111114; --bg3: #18181D; --bg4: #1E1E24;
  --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.13);
  --red: #E8002D; --red-dim: rgba(232,0,45,0.13);
  --white: #F0F0F0; --muted: rgba(240,240,240,0.40);
  --gold: #C9A84C; --green: #00D4A0; --green-dim: rgba(0,212,160,0.15);
}
[data-theme="light"] {
  --bg: #F5F6F8; --bg2: #FFFFFF; --bg3: #E8EAEE; --bg4: #DFE1E6;
  --border: rgba(0,0,0,0.10); --border2: rgba(0,0,0,0.18);
  --red: #D40029; --red-dim: rgba(212,0,41,0.08);
  --white: #1A1B1E; --muted: rgba(26,27,30,0.55);
  --gold: #9C6F10; --green: #007F5F; --green-dim: rgba(0,127,95,0.15);
}
body { background: var(--bg); color: var(--white); font-family: 'Barlow', sans-serif; }
.profile-card { padding: 16px 12px; }
.form-input, .form-select { font-size: 16px; padding: 10px 12px; }
.profile-page { padding: 24px 28px; max-width: 900px; margin: 0 auto; min-height: 100vh; }
.profile-back { background: transparent; border: none; color: var(--red); cursor: pointer; font-size: var(--fs-body); font-weight: 600; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; padding: 0; transition: opacity 0.2s; }
.profile-back:hover { opacity: 0.7; }
.profile-page-title { font-family: 'Barlow Condensed', sans-serif; font-size: var(--fs-display); font-weight: 900; color: var(--white); margin-bottom: 28px; letter-spacing: 1px; }
.profile-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 28px; margin-bottom: 24px; overflow: hidden; }.profile-card-title { font-family: 'Barlow Condensed', sans-serif; font-size: var(--fs-subtitle); font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: var(--white); margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
.profile-card-title-sub { font-size: var(--fs-small); font-weight: 500; color: var(--muted); text-transform: none; letter-spacing: 0; }
.profile-avatar-row { display: flex; align-items: center; gap: 20px; margin-bottom: 28px; padding-bottom: 24px; border-bottom: 1px solid var(--border); }
.profile-avatar-circle { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #E8002D, #FF6B35); display: flex; align-items: center; justify-content: center; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: var(--fs-stat-secondary); color: white; flex-shrink: 0; }
.profile-avatar-info { flex: 1; }
.profile-avatar-name { font-family: 'Barlow Condensed', sans-serif; font-size: var(--fs-stat-secondary); font-weight: 800; color: var(--white); margin-bottom: 2px; }
.profile-avatar-email { color: var(--muted); font-size: var(--fs-small); }
.profile-avatar-badges-count { display: flex; gap: 16px; margin-top: 6px; }
.profile-avatar-stat { font-size: var(--fs-small); color: var(--muted); display: flex; align-items: center; gap: 4px; }
.profile-avatar-stat strong { color: var(--white); font-family: 'Barlow Condensed', sans-serif; font-size: var(--fs-subtitle); font-weight: 800; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { margin-bottom: 20px; }
.form-label { display: block; font-size: var(--fs-label); font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
.form-input, .form-select { width: 100%; padding: 12px 16px; background: var(--bg3); border: 1px solid var(--border); border-radius: 10px; color: var(--white); font-size: 16px; font-family: 'Barlow', sans-serif; transition: border-color 0.2s; box-sizing: border-box; }
.form-input:focus, .form-select:focus { outline: none; border-color: var(--red); }
.form-input:disabled, .form-select:disabled { opacity: 0.5; cursor: not-allowed; }
.form-select option { background: var(--bg2); color: var(--white); }
.btn-save { padding: 12px 28px; background: linear-gradient(135deg, var(--red), #FF3355); border: none; border-radius: 10px; color: white; font-family: 'Barlow Condensed', sans-serif; font-size: var(--fs-body); font-weight: 800; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: opacity 0.2s; }
.btn-save:hover { opacity: 0.9; }
.btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
.msg-error { background: var(--red-dim); border: 1px solid rgba(232,0,45,0.3); border-radius: 8px; padding: 12px; color: var(--red); font-size: var(--fs-small); margin-bottom: 16px; }
.msg-success { background: rgba(0,212,160,0.1); border: 1px solid rgba(0,212,160,0.3); border-radius: 8px; padding: 12px; color: #00D4A0; font-size: var(--fs-small); margin-bottom: 16px; }

/* BADGES */
.badges-filter { display: flex; gap: 6px; margin-bottom: 20px; overflow-x: auto; padding-bottom: 4px; -webkit-overflow-scrolling: touch; }
.badges-filter-btn { padding: 6px 14px; background: var(--bg3); border: 1px solid var(--border); border-radius: 20px; color: var(--muted); font-size: var(--fs-small); font-weight: 600; cursor: pointer; font-family: 'Barlow', sans-serif; transition: all 0.2s; white-space: nowrap; }
.badges-filter-btn.active { background: var(--red-dim); border-color: var(--red); color: var(--red); }
.badges-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.badge-card { background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; padding: 16px; text-align: center; transition: all 0.25s; position: relative; overflow: hidden; }
.badge-card.unlocked { border-color: var(--border2); }
.badge-card.unlocked:hover { transform: translateY(-2px); border-color: var(--gold); box-shadow: 0 4px 20px rgba(201,168,76,0.15); }
.badge-card.locked { opacity: 0.45; }
.badge-card.locked .badge-icon { filter: grayscale(1); }
.badge-icon { font-size: 36px; margin-bottom: 8px; display: block; line-height: 1; }
.badge-name { font-family: 'Barlow Condensed', sans-serif; font-size: var(--fs-small); font-weight: 700; color: var(--white); margin-bottom: 4px; letter-spacing: 0.3px; }
.badge-desc { font-size: var(--fs-label); color: var(--muted); line-height: 1.4; }
.badge-date { font-size: var(--fs-label); color: var(--gold); margin-top: 6px; font-family: 'Share Tech Mono', monospace; }
.badge-locked-label { font-size: var(--fs-label); color: var(--muted); margin-top: 6px; font-style: italic; }
.badge-category-tag { position: absolute; top: 8px; right: 8px; font-size: var(--fs-label); padding: 2px 6px; border-radius: 4px; background: var(--bg2); color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.badge-new-indicator { position: absolute; top: 8px; left: 8px; width: 8px; height: 8px; border-radius: 50%; background: var(--green); box-shadow: 0 0 6px rgba(0,212,160,0.5); }

.profile-skeleton { height: 200px; background: var(--bg3); border-radius: 12px; animation: pulse 1.5s ease-in-out infinite; margin-bottom: 24px; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }

@media (max-width: 1024px) { .badges-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px) {
  .profile-page { padding: 16px; }
  .profile-card { padding: 20px 16px; }
  .badges-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .badge-card { padding: 14px 10px; }
  .badge-icon { font-size: 30px; }
  .form-row { grid-template-columns: 1fr; }
  .profile-avatar-row { flex-direction: column; text-align: center; }
}
@media (max-width: 400px) {
  .badges-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .badge-icon { font-size: 26px; }
  .profile-card { padding: 16px 12px; }
  .form-input, .form-select { font-size: 16px; padding: 10px 12px; }
}
`;

const getCategoryLabels = (t) => ({
  todas: t('badges.categories.todas'),
  premium: t('badges.categories.premium'),
  victorias: t('badges.categories.victorias'),
  rachas: t('badges.categories.rachas'),
  precision: t('badges.categories.precision'),
  participacion: t('badges.categories.participacion'),
  especiales: t('badges.categories.especiales'),
  secretos: t('badges.categories.secretos'),
});

export default function Profile() {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  const { t, locale } = useTranslation(); 
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', apellido: '', piloto_favorito_id: '', escuderia_favorita_id: '' });
  const [allBadges, setAllBadges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [teams, setTeams] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [badgeFilter, setBadgeFilter] = useState('todas');

  // ============================================
  // FETCH DATA
  // ============================================
  useEffect(() => {
    if (!authUser) return;
    fetchProfile();
  }, [authUser]);

  async function fetchProfile() {
    setLoading(true);
    try {
      const userId = authUser.id;

      const [profileRes, badgesRes, userBadgesRes, teamsRes, driversRes] = await Promise.all([
        supabase.from('users').select('*').eq('id', userId).single(),
        supabase.from('badges').select('*').order('orden'),
        supabase.from('user_badges').select('badge_id, grupo_id, desbloqueado_en, groups:grupo_id(nombre)').eq('usuario_id', userId),
        supabase.from('teams').select('id, nombre').order('nombre'),
        supabase.from('drivers').select('id, nombre_completo').order('nombre_completo')
      ]);

      const profile = profileRes.data;
      setProfileData(profile);
      setFormData({
        nombre: profile?.nombre || '',
        apellido: profile?.apellido || '',
        piloto_favorito_id: profile?.piloto_favorito_id || '',
        escuderia_favorita_id: profile?.escuderia_favorita_id || ''
      });
      setAllBadges(badgesRes.data || []);
      setUserBadges(userBadgesRes.data || []);
      setTeams(teamsRes.data || []);
      setDrivers(driversRes.data || []);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }

  // ============================================
  // SAVE PROFILE
  // ============================================
  async function handleSave(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const updates = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        piloto_favorito_id: formData.piloto_favorito_id || null,
        escuderia_favorita_id: formData.escuderia_favorita_id || null
      };

      const { error: dbError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', authUser.id);

      if (dbError) throw dbError;

      // Also update auth metadata for name
      await supabase.auth.updateUser({
        data: { nombre: formData.nombre, apellido: formData.apellido }
      });

      setSuccess(t('profile.updated'));
      toast.success(t('profile.updated'));
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || t('profile.errorUpdating'));
      toast.error(t('profile.errorUpdating'));
    } finally {
      setSaving(false);
    }
  }

  // ============================================
  // BADGES DATA
  // ============================================
  const unlockedBadgeIds = useMemo(() => {
    const map = new Map();
    userBadges.forEach(ub => {
      if (!map.has(ub.badge_id)) {
        map.set(ub.badge_id, { date: ub.desbloqueado_en, grupo: ub.groups?.nombre || '' });
      }
    });
    return map;
  }, [userBadges]);

  const filteredBadges = useMemo(() => {
    if (badgeFilter === 'todas') return allBadges;
    return allBadges.filter(b => b.categoria === badgeFilter);
  }, [allBadges, badgeFilter]);

  const badgeStats = useMemo(() => {
    const total = allBadges.filter(b => !b.es_secreto).length;
    const unlocked = allBadges.filter(b => unlockedBadgeIds.has(b.id)).length;
    const secretsUnlocked = allBadges.filter(b => b.es_secreto && unlockedBadgeIds.has(b.id)).length;
    return { total, unlocked, secretsUnlocked, pct: total > 0 ? Math.round((unlocked / (total + allBadges.filter(b => b.es_secreto).length)) * 100) : 0 };
  }, [allBadges, unlockedBadgeIds]);

  const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString(getDateLocale(locale), { day: '2-digit', month: 'short', year: 'numeric' });
};
  const CATEGORY_LABELS = getCategoryLabels(t);
  // ============================================
  // RENDER
  // ============================================
  if (loading) {
    return (
      <>
        <style>{FONTS + CSS}</style>
        <div data-theme={theme} className="profile-page">
          <BackButton className="profile-back" onClick={() => navigate(-1)}>← {t('common.back')}</BackButton>
          <h1 className="profile-page-title">{t('profile.title')}</h1>
          <div className="profile-skeleton" />
          <div className="profile-skeleton" style={{ height: 400 }} />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div data-theme={theme} className="profile-page">

      <BackButton className="profile-back" onClick={() => navigate(-1)}>← {t('common.back')}</BackButton>
        <h1 className="profile-page-title">{t('profile.title')}</h1>

        {/* ============================================ */}
        {/* PROFILE CARD */}
        {/* ============================================ */}
        <div className="profile-card">
          <div className="profile-avatar-row">
            <div className="profile-avatar-circle">
              {formData.nombre?.[0]?.toUpperCase() || authUser?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="profile-avatar-info">
              <div className="profile-avatar-name">
               {formData.nombre || formData.apellido ? `${formData.nombre} ${formData.apellido}`.trim() : t('dashboard.defaultUserName')}
              </div>
              <div className="profile-avatar-email">{authUser?.email}</div>
              <div className="profile-avatar-badges-count">
                <span className="profile-avatar-stat">🏅 <strong>{badgeStats.unlocked}</strong>/{badgeStats.total + allBadges.filter(b => b.es_secreto).length} {t('profile.badgesWord')}</span>
                {badgeStats.secretsUnlocked > 0 && (
                  <span className="profile-avatar-stat">🤫 <strong>{badgeStats.secretsUnlocked}</strong> {t('profile.secretsWord')}</span>
                )}
              </div>
            </div>
          </div>

          {error && <div className="msg-error">{error}</div>}
          {success && <div className="msg-success">{success}</div>}

          <form onSubmit={handleSave}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('profile.name')}</label>
                <input type="text" className="form-input" value={formData.nombre}
                  onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder={t('profile.namePlaceholder')} disabled={saving} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('profile.lastName')}</label>
                <input type="text" className="form-input" value={formData.apellido}
                  onChange={e => setFormData({ ...formData, apellido: e.target.value })}
                  placeholder={t('profile.lastNamePlaceholder')} disabled={saving} />
              </div>
            </div>

    
              <div className="form-group">
                <label className="form-label">{t('auth.email')}</label>
                <input type="email" className="form-input" value={authUser?.email || ''} disabled />
              </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">🏎 {t('profile.favoriteTeam')}</label>
                <select className="form-select" value={formData.escuderia_favorita_id}
                  onChange={e => setFormData({ ...formData, escuderia_favorita_id: e.target.value })}
                  disabled={saving}>
                  <option value="">{t('profile.selectTeam')}</option>
                    {teams.map(team => <option key={team.id} value={team.id}>{team.nombre}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">👤 {t('profile.favoriteDriver')}</label>
                <select className="form-select" value={formData.piloto_favorito_id}
                  onChange={e => setFormData({ ...formData, piloto_favorito_id: e.target.value })}
                  disabled={saving}>
                  <option value="">{t('profile.selectDriver')}</option>
                  {drivers.map(d => <option key={d.id} value={d.id}>{d.nombre_completo}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? t('profile.saving') : t('profile.saveChanges')}
            </button>
          </form>
        </div>

        {/* ============================================ */}
        {/* BADGES SECTION */}
        {/* ============================================ */}
        <div className="profile-card">
          <div className="profile-card-title">
            🏅 {t('profile.myBadges')}
            <span className="profile-card-title-sub">({badgeStats.unlocked} {t('profile.unlocked')})</span>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-label)', color: 'var(--muted)', marginBottom: 6 }}>
              <span>{t('profile.generalProgress')}</span>
              <span style={{ fontFamily: "'Share Tech Mono'", color: 'var(--white)' }}>{badgeStats.pct}%</span>
            </div>
            <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${badgeStats.pct}%`, background: 'linear-gradient(90deg, var(--red), var(--gold))', borderRadius: 3, transition: 'width 0.5s ease' }} />
            </div>
          </div>

          {/* Category filter */}
          <div className="badges-filter">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
              const count = key === 'todas' ? allBadges.length : allBadges.filter(b => b.categoria === key).length;
              const unlockedCount = key === 'todas'
                ? badgeStats.unlocked
                : allBadges.filter(b => b.categoria === key && unlockedBadgeIds.has(b.id)).length;
              return (
                <button key={key} className={`badges-filter-btn ${badgeFilter === key ? 'active' : ''}`}
                  onClick={() => setBadgeFilter(key)}>
                  {label} {key !== 'todas' && <span style={{ opacity: 0.6 }}>{unlockedCount}/{count}</span>}
                </button>
              );
            })}
          </div>

          {/* Badges grid */}
          <div className="badges-grid">
            {filteredBadges.map(badge => {
              const isUnlocked = unlockedBadgeIds.has(badge.id);
              const unlockData = unlockedBadgeIds.get(badge.id);
              const isSecret = badge.es_secreto;

              return (
                <div key={badge.id} className={`badge-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
                  {isUnlocked && (
                    <div className="badge-new-indicator" title={t('profile.unlockedTooltip')} />
                  )}

                  <span className="badge-icon">{isUnlocked || !isSecret ? badge.icono : '🔒'}</span>

                  <div className="badge-name">
                    {isUnlocked || !isSecret ? t(`badges.items.${badge.key}.nombre`) : '???'}
                  </div>

                  <div className="badge-desc">
                    {isUnlocked
                      ? t(`badges.items.${badge.key}.descripcion`)
                      : isSecret
                        ? t('badges.secretDesc')
                        : t(`badges.items.${badge.key}.descripcion`)
                    }
                  </div>

                  {isUnlocked ? (
                    <div className="badge-date">
                      ✅ {formatDate(unlockData?.date)}
                      {unlockData?.grupo && <span style={{ display: 'block', fontSize: 'var(--fs-label)', opacity: 0.7 }}>{unlockData.grupo}</span>}
                    </div>
                  ) : (
                    <div className="badge-locked-label">
                      {isSecret ? t('badges.secret') : t('badges.locked')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredBadges.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
              {t('profile.noBadgesInCategory')}
            </div>
          )}
        </div>

          <div className="profile-card" style={{ borderColor: 'rgba(232,0,45,0.3)' }}>
            <div className="profile-card-title" style={{ color: 'var(--red)' }}>
              ⚠️ {t('profile.dangerZone')}
            </div>
            <p style={{ fontSize: 'var(--fs-small)', color: 'var(--muted)', marginBottom: 16, lineHeight: 1.6 }}>
              {t('profile.deleteAccountDesc')}
            </p>
            <button
              onClick={() => navigate('/delete-account')}
              style={{
                padding: '10px 20px', background: 'transparent',
                border: '2px solid var(--red)', borderRadius: 8,
                color: 'var(--red)', fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 'var(--fs-small)', fontWeight: 800, letterSpacing: 1,
                textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-dim)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              🗑️ {t('profile.deleteAccountBtn')}
            </button>
          </div>

      </div>
    </>
  );
}