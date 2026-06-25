import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useToastStore } from '../../stores/toastStore';
import { supabase } from '../../lib/supabase';
import { useTranslation, getDateLocale, getRaceName } from '../../i18n';
import BackButton from '../../components/BackButton';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');`;

const CSS = `
[data-theme="dark"] {
  --bg: #0A0A0C; --bg2: #111114; --bg3: #18181D; --bg4: #1E1E24;
  --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.13);
  --red: #E8002D; --red-dim: rgba(232,0,45,0.13);
  --white: #F0F0F0; --muted: rgba(240,240,240,0.40);
  --gold: #C9A84C; --green: #00D4A0;
}

[data-theme="light"] {
  --bg: #F5F6F8; --bg2: #FFFFFF; --bg3: #E8EAEE; --bg4: #DFE1E6;
  --border: rgba(0,0,0,0.10); --border2: rgba(0,0,0,0.18);
  --red: #D40029; --red-dim: rgba(212,0,41,0.08);
  --white: #1A1B1E; --muted: rgba(26,27,30,0.55);
  --gold: #9C6F10; --green: #007F5F;
}

.super-admin-panel {
  padding: 24px 28px;
  max-width: 1600px;
  margin: 0 auto;
  background: var(--bg);
  min-height: 100vh;
}

.back-btn {
  background: transparent;
  border: none;
  color: var(--red);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  transition: opacity 0.2s;
}

.back-btn:hover { opacity: 0.7; }

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.panel-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 36px;
  font-weight: 900;
  color: var(--white);
}

.panel-subtitle {
  color: var(--muted);
  font-size: 14px;
  margin-top: 4px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(232, 0, 45, 0.1);
}

.stat-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.stat-value {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 48px;
  font-weight: 900;
  color: var(--white);
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 8px;
}

.tabs-container {
  margin-bottom: 24px;
}

.tabs-nav {
  display: flex;
  gap: 8px;
  border-bottom: 2px solid var(--border);
  margin-bottom: 24px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.tab-btn {
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  padding: 12px 20px;
  color: var(--muted);
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: -2px;
  white-space: nowrap;
}

.tab-btn.active {
  color: var(--red);
  border-bottom-color: var(--red);
}

.tab-btn:hover:not(.active) {
  color: var(--white);
}

.search-bar {
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--white);
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: var(--red);
}

.data-table {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
}

.data-table table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: var(--bg3);
  padding: 16px;
  text-align: left;
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
}

.data-table td {
  padding: 16px;
  border-top: 1px solid var(--border);
  color: var(--white);
}

.data-table tr:hover {
  background: var(--bg3);
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.badge.active {
  background: rgba(0, 212, 160, 0.15);
  color: var(--green);
}

.badge.inactive {
  background: var(--bg3);
  color: var(--muted);
}

.btn-view {
  background: var(--red);
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  color: white;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-view:hover {
  opacity: 0.9;
}

.settings-panel {
  padding: 24px;
}

.toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--bg3);
  border-radius: 12px;
  border: 1px solid var(--border);
  flex-wrap: wrap;
}

.toggle-row-info {
  flex: 1;
  min-width: 200px;
}

.toggle-row-label {
  font-weight: 700;
  color: var(--white);
  font-size: 16px;
  margin-bottom: 4px;
}

.toggle-row-desc {
  font-size: 13px;
  color: var(--muted);
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
  flex-shrink: 0;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg4);
  border: 1px solid var(--border2);
  transition: 0.3s;
  border-radius: 28px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: var(--white);
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background: var(--red);
  border-color: var(--red);
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

input:disabled + .toggle-slider {
  opacity: 0.5;
  cursor: not-allowed;
}

.paywall-warning {
  margin-top: 12px;
  padding: 12px 16px;
  background: var(--red-dim);
  border: 1px solid rgba(232,0,45,0.3);
  border-radius: 10px;
  color: var(--red);
  font-size: 13px;
  font-weight: 600;
}

.admin-section {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 24px;
}

.section-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: var(--white);
  margin-bottom: 16px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--muted);
}

.fastest-lap-section {
  margin-top: 24px;
}

.race-fastest-card {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.race-fastest-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.race-fastest-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 18px;
  font-weight: 800;
  color: var(--white);
}

.race-fastest-date {
  font-size: 12px;
  color: var(--muted);
}

.fastest-lap-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.fastest-lap-select {
  flex: 1;
  padding: 10px 14px;
  background: var(--bg2);
  border: 1px solid var(--border2);
  border-radius: 8px;
  color: var(--white);
  font-size: 14px;
  cursor: pointer;
  font-family: 'Barlow', sans-serif;
}

.btn-clear-fastest {
  padding: 10px 16px;
  background: transparent;
  border: 1px solid var(--border2);
  border-radius: 8px;
  color: var(--muted);
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
}

.current-fastest {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 14px;
  background: rgba(0, 212, 160, 0.1);
  border: 1px solid rgba(0, 212, 160, 0.3);
  border-radius: 8px;
  font-size: 13px;
}

.current-fastest-icon {
  font-size: 16px;
}

.current-fastest-text {
  color: var(--green);
  font-weight: 700;
}

@media (max-width: 768px) {
  .super-admin-panel {
    padding: 16px;
  }
  
  .panel-title {
    font-size: 28px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .data-table {
    overflow-x: auto;
  }
  
  .data-table table {
    min-width: 800px;
  }
}
`;

export default function SuperAdminPanel() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  const toast = useToastStore();
  const { t, locale } = useTranslation();

  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGroups: 0,
    totalPredictions: 0,
    totalRaces: 0
  });
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Paywall toggle state
  const [paywallEnabled, setPaywallEnabled] = useState(false);
  const [savingPaywall, setSavingPaywall] = useState(false);
  const [confirmPaywallEnable, setConfirmPaywallEnable] = useState(false);

  // 🆕 Races tab state
  const [allRaces, setAllRaces] = useState([]);
  const [loadingRaces, setLoadingRaces] = useState(true);
  const [racesLoaded, setRacesLoaded] = useState(false);
  const [raceResultsMap, setRaceResultsMap] = useState({});
  const [fastestLaps, setFastestLaps] = useState({});
  const [savingFastestLap, setSavingFastestLap] = useState(null);

  useEffect(() => {
    checkSuperAdmin();
  }, [user]);

  useEffect(() => {
    if (isSuperAdmin) {
      loadData();
    }
  }, [isSuperAdmin]);

  // 🆕 Carga perezosa de la pestaña de carreras
  useEffect(() => {
    if (activeTab === 'races' && isSuperAdmin && !racesLoaded) {
      loadRacesData();
    }
  }, [activeTab, isSuperAdmin]);

  const checkSuperAdmin = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('is_super_admin')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (!data.is_super_admin) {
        toast.error(t('superAdmin.noPermissionToast'));
        navigate('/');
        return;
      }

      setIsSuperAdmin(true);
    } catch (err) {
      console.error('Error checking super admin:', err);
      navigate('/');
    }
  };

  const loadPaywallSetting = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'paywall_enabled')
        .single();

      if (error) throw error;
      setPaywallEnabled(data?.value === true);
    } catch (err) {
      console.error('Error loading paywall setting:', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Stats
      const [usersCount, groupsCount, predictionsCount, racesCount] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('groups').select('id', { count: 'exact', head: true }),
        supabase.from('predictions').select('id', { count: 'exact', head: true }),
        supabase.from('races').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        totalUsers: usersCount.count || 0,
        totalGroups: groupsCount.count || 0,
        totalPredictions: predictionsCount.count || 0,
        totalRaces: racesCount.count || 0
      });

      // 🔒 Usuarios vía función segura con chequeo de super admin real
      const { data: usersData } = await supabase.rpc('get_all_users_admin');
      setUsers(usersData || []);

      // 🔒 Grupos + creador, mismo patrón
      const { data: groupsData } = await supabase.rpc('get_all_groups_admin');
      setGroups((groupsData || []).map(g => ({
        ...g,
        creator: { nombre: g.creator_nombre, apellido: g.creator_apellido, email: g.creator_email }
      })));

      // Paywall setting
      await loadPaywallSetting();

    } catch (err) {
      console.error('Error loading data:', err);
      toast.error(t('superAdmin.errorLoadingData'));
    } finally {
      setLoading(false);
    }
  };

  // 🆕 Cargar carreras + resultados existentes para la pestaña de Carreras
  const loadRacesData = async () => {
    setLoadingRaces(true);
    try {
      const { data: racesData, error: racesError } = await supabase
        .from('races')
        .select('*')
        .in('estado', ['programada', 'finalizada'])
        .order('fecha_programada', { ascending: false });

      if (racesError) throw racesError;
      setAllRaces(racesData || []);

      const finishedIds = (racesData || [])
        .filter(r => r.estado === 'finalizada')
        .map(r => r.id);

      if (finishedIds.length > 0) {
        const { data: resultsData, error: resultsError } = await supabase
          .from('race_results')
          .select(`
            *,
            drivers:piloto_id ( id, nombre_completo, acronimo, numero )
          `)
          .in('carrera_id', finishedIds)
          .order('posicion_final', { ascending: true });

        if (resultsError) throw resultsError;

        const resultsByRace = {};
        const fastestByRace = {};
        resultsData?.forEach(result => {
          if (!resultsByRace[result.carrera_id]) resultsByRace[result.carrera_id] = [];
          resultsByRace[result.carrera_id].push(result);
          if (result.vuelta_rapida) fastestByRace[result.carrera_id] = result.piloto_id;
        });
        setRaceResultsMap(resultsByRace);
        setFastestLaps(fastestByRace);
      }

      setRacesLoaded(true);
    } catch (err) {
      console.error('Error loading races data:', err);
      toast.error(t('superAdmin.errorLoadingRaces'));
    } finally {
      setLoadingRaces(false);
    }
  };

  // 🆕 Guardar / limpiar vuelta rápida de una carrera y recalcular puntos
  const handleSaveFastestLap = async (raceId, pilotoId) => {
    setSavingFastestLap(raceId);
    try {
      const { error: clearError } = await supabase
        .from('race_results')
        .update({ vuelta_rapida: false })
        .eq('carrera_id', raceId);
      if (clearError) throw clearError;

      if (pilotoId) {
        const { error: setError } = await supabase
          .from('race_results')
          .update({ vuelta_rapida: true })
          .eq('carrera_id', raceId)
          .eq('piloto_id', pilotoId);
        if (setError) throw setError;
      }

      setFastestLaps(prev => ({ ...prev, [raceId]: pilotoId || null }));

      const { data: recalcData, error: recalcError } = await supabase
        .rpc('calcular_puntos_carrera', { p_carrera_id: raceId });

      if (recalcError) {
        console.error('Error recalculando puntos:', recalcError);
        toast.warning(pilotoId ? t('admin.fastestLapSavedNoRecalc') : t('admin.fastestLapCleared'));
      } else {
        toast.success(
          pilotoId
            ? t('admin.fastestLapSavedRecalc', { count: recalcData?.[0]?.predicciones_calculadas || 0 })
            : t('admin.fastestLapClearedRecalc')
        );
      }
    } catch (err) {
      console.error('Error saving fastest lap:', err);
      toast.error(t('admin.errorSavingFastestLap'));
    } finally {
      setSavingFastestLap(null);
    }
  };

  const handleClearFastestLap = async (raceId) => {
    await handleSaveFastestLap(raceId, null);
  };

  const handleTogglePaywallRequest = () => {
    if (!paywallEnabled) {
      // Turning ON affects every user in the app — confirm first
      setConfirmPaywallEnable(true);
    } else {
      // Turning OFF is always safe — apply directly
      handleTogglePaywall(false);
    }
  };

  const handleTogglePaywall = async (newValue) => {
    setSavingPaywall(true);
    try {
      const { error } = await supabase
        .from('app_settings')
        .update({ value: newValue })
        .eq('key', 'paywall_enabled');

      if (error) throw error;

      setPaywallEnabled(newValue);
      toast.success(newValue ? t('superAdmin.paywallEnabledToast') : t('superAdmin.paywallDisabledToast'));
    } catch (err) {
      console.error('Error toggling paywall:', err);
      toast.error(t('superAdmin.errorSavingPaywall'));
    } finally {
      setSavingPaywall(false);
      setConfirmPaywallEnable(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGroups = groups.filter(g =>
    g.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.creator?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🆕 Carreras finalizadas, sin sprint, con resultados cargados (para la sección de vuelta rápida)
  const finishedNonSprintRaces = allRaces.filter(
    r => r.estado === 'finalizada' && r.tipo !== 'sprint' && raceResultsMap[r.id]?.length > 0
  );

  if (loading) {
    return (
      <>
        <style>{FONTS + CSS}</style>
        <div data-theme={theme} className="super-admin-panel">
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚙️</div>
            <div>{t('superAdmin.loadingPanel')}</div>
          </div>
        </div>
      </>
    );
  }

  if (!isSuperAdmin) return null;

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div data-theme={theme} className="super-admin-panel">
        <BackButton className="back-btn" onClick={() => navigate('/')}>
          ← {t('groupDetail.backToDashboard')}
        </BackButton>

        <div className="panel-header">
          <div>
            <h1 className="panel-title">⚙️ {t('superAdmin.panelTitle')}</h1>
            <p className="panel-subtitle">{t('superAdmin.panelSubtitle')}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">{t('superAdmin.statUsers')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏁</div>
            <div className="stat-value">{stats.totalGroups}</div>
            <div className="stat-label">{t('superAdmin.statGroups')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{stats.totalPredictions}</div>
            <div className="stat-label">{t('superAdmin.statPredictions')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏎</div>
            <div className="stat-value">{stats.totalRaces}</div>
            <div className="stat-label">{t('common.races')}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs-nav">
            <button 
              className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 {t('superAdmin.statUsers')}
            </button>
            <button 
              className={`tab-btn ${activeTab === 'groups' ? 'active' : ''}`}
              onClick={() => setActiveTab('groups')}
            >
              🏁 {t('superAdmin.statGroups')}
            </button>
            <button 
              className={`tab-btn ${activeTab === 'races' ? 'active' : ''}`}
              onClick={() => setActiveTab('races')}
            >
              🏎️ {t('superAdmin.racesTab')}
            </button>
            <button 
              className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              🔐 {t('superAdmin.settingsTab')}
            </button>
          </div>

          {/* Search Bar — solo aplica a las tablas */}
          {(activeTab === 'users' || activeTab === 'groups') && (
            <div className="search-bar">
              <input
                type="text"
                className="search-input"
                placeholder={`${t('common.search')}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}

          {/* Users Table */}
          {activeTab === 'users' && (
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>{t('admin.name')}</th>
                    <th>{t('auth.email')}</th>
                    <th>{t('auth.country')}</th>
                    <th>{t('superAdmin.birthYearColumn')}</th>
                    <th>{t('superAdmin.registeredColumn')}</th>
                    <th>{t('dashboard.admin')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td>{u.nombre} {u.apellido}</td>
                      <td>{u.email}</td>
                      <td>{u.pais || '-'}</td>
                      <td>{u.anho_nacimiento || '-'}</td>
                      <td>{new Date(u.created_at).toLocaleDateString(getDateLocale(locale))}</td>
                      <td>
                        {u.is_super_admin ? (
                          <span className="badge active">{t('superAdmin.superBadge')}</span>
                        ) : (
                          <span className="badge inactive">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Groups Table */}
          {activeTab === 'groups' && (
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>{t('admin.name')}</th>
                    <th>{t('superAdmin.creatorColumn')}</th>
                    <th>{t('admin.season')}</th>
                    <th>{t('superAdmin.codeColumn')}</th>
                    <th>{t('superAdmin.createdColumn')}</th>
                    <th>{t('superAdmin.actionColumn')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGroups.map(g => (
                    <tr key={g.id}>
                      <td>{g.nombre}</td>
                      <td>{g.creator?.nombre} {g.creator?.apellido}</td>
                      <td>{g.temporada}</td>
                      <td style={{ fontFamily: 'monospace' }}>{g.codigo_invitacion}</td>
                      <td>{new Date(g.created_at).toLocaleDateString(getDateLocale(locale))}</td>
                      <td>
                        <button 
                          className="btn-view"
                          onClick={() => navigate(`/group/${g.id}`)}
                        >
                          {t('superAdmin.viewBtn')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 🆕 Races Tab — ingreso de resultados + vuelta rápida */}
          {activeTab === 'races' && (
            <>
              {/* Sección 1 — Ingresar/Editar Resultados */}
              <div className="admin-section">
                <h2 className="section-title">📊 {t('admin.manageResults')}</h2>
                <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
                  {t('admin.manageResultsSubLong')}
                </p>

                {loadingRaces ? (
                  <div style={{ color: 'var(--muted)', padding: 20 }}>{t('admin.loadingRaces')}</div>
                ) : allRaces.length === 0 ? (
                  <div className="empty-state">{t('admin.noRacesScheduled')}</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {allRaces.map(race => (
                      <div
                        key={race.id}
                        style={{
                          background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12,
                          padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            {race.tipo === 'sprint' && (
                              <span style={{
                                background: 'linear-gradient(135deg, #FFB800, #FF8C00)', color: '#000',
                                fontWeight: 900, padding: '4px 10px', borderRadius: 8, fontSize: 11, letterSpacing: 1
                              }}>
                                {t('admin.sprint')}
                              </span>
                            )}
                            <span style={{ fontFamily: 'Barlow Condensed', fontSize: 18, fontWeight: 800, color: 'var(--white)' }}>
                              {getRaceName(race, t)}
                            </span>
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--muted)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            <span>📍 {race.circuito}</span>
                            <span>📅 {new Date(race.fecha_programada).toLocaleDateString(getDateLocale(locale), { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            <span style={{ color: race.estado === 'finalizada' ? 'var(--green)' : 'var(--muted)', fontWeight: race.estado === 'finalizada' ? 700 : 400 }}>
                              {race.estado === 'finalizada' ? t('admin.finished') : `⏳ ${t('common.scheduled')}`}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/admin/race/${race.id}/results`)}
                          style={{
                            padding: '10px 20px',
                            background: race.estado === 'finalizada' ? 'transparent' : 'linear-gradient(135deg, var(--red), #FF3355)',
                            border: race.estado === 'finalizada' ? '2px solid var(--border2)' : 'none',
                            borderRadius: 10, color: race.estado === 'finalizada' ? 'var(--white)' : 'white',
                            fontFamily: 'Barlow Condensed', fontSize: 13, fontWeight: 800, letterSpacing: 1,
                            textTransform: 'uppercase', cursor: 'pointer', minWidth: 140
                          }}
                        >
                          {race.estado === 'finalizada' ? `✏️ ${t('admin.editResults')}` : `➕ ${t('admin.enterResults')}`}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sección 2 — Vuelta Rápida (solo carreras finalizadas, sin sprints) */}
              {!loadingRaces && finishedNonSprintRaces.length > 0 && (
                <div className="admin-section fastest-lap-section">
                  <h2 className="section-title">
                    🏁 {t('admin.fastestLap')} ({finishedNonSprintRaces.length} {finishedNonSprintRaces.length === 1 ? t('admin.raceFinishedSingular') : t('admin.raceFinishedPlural')})
                  </h2>
                  <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
                    {t('superAdmin.fastestLapGenericNote')}
                  </p>

                  {finishedNonSprintRaces.map(race => {
                    const results = raceResultsMap[race.id] || [];
                    const currentFastest = fastestLaps[race.id];
                    const currentDriver = results.find(r => r.piloto_id === currentFastest);
                    const isSaving = savingFastestLap === race.id;

                    return (
                      <div key={race.id} className="race-fastest-card">
                        <div className="race-fastest-header">
                          <div>
                            <div className="race-fastest-title">{getRaceName(race, t)}</div>
                            <div className="race-fastest-date">
                              📍 {race.circuito} • 📅 {new Date(race.fecha_programada).toLocaleDateString(getDateLocale(locale), { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                          </div>
                        </div>

                        <div className="fastest-lap-controls">
                          <select
                            className="fastest-lap-select"
                            value={currentFastest || ''}
                            onChange={(e) => handleSaveFastestLap(race.id, e.target.value || null)}
                            disabled={isSaving}
                          >
                            <option value="">{t('admin.selectFastestDriver')}</option>
                            {results.map(result => (
                              <option key={result.piloto_id} value={result.piloto_id}>
                                P{result.posicion_final} • #{result.drivers?.numero} {result.drivers?.nombre_completo}
                              </option>
                            ))}
                          </select>

                          {currentFastest && (
                            <button className="btn-clear-fastest" onClick={() => handleClearFastestLap(race.id)} disabled={isSaving}>
                              🗑️ {t('admin.clearBtn')}
                            </button>
                          )}
                        </div>

                        {currentDriver && (
                          <div className="current-fastest">
                            <span className="current-fastest-icon">⚡</span>
                            <span className="current-fastest-text">
                              {t('admin.currentFastestLabel')}: #{currentDriver.drivers?.numero} {currentDriver.drivers?.nombre_completo}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Settings Tab — Paywall toggle */}
          {activeTab === 'settings' && (
            <div className="data-table settings-panel">
              <div className="toggle-row">
                <div className="toggle-row-info">
                  <div className="toggle-row-label">{t('superAdmin.paywallToggleLabel')}</div>
                  <div className="toggle-row-desc">{t('superAdmin.paywallToggleDescription')}</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={paywallEnabled}
                    disabled={savingPaywall}
                    onChange={handleTogglePaywallRequest}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              {paywallEnabled && (
                <div className="paywall-warning">
                  ⚠️ {t('superAdmin.paywallActiveWarning')}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Confirm enabling paywall (affects every user) */}
        <ConfirmModal
          isOpen={confirmPaywallEnable}
          onClose={() => setConfirmPaywallEnable(false)}
          onConfirm={() => handleTogglePaywall(true)}
          title={t('superAdmin.confirmEnableTitle')}
          message={t('superAdmin.confirmEnableMsg')}
          confirmText={t('superAdmin.confirmEnableBtn')}
          cancelText={t('common.cancel')}
          type="danger"
        />
      </div>
    </>
  );
}