import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { supabase } from '../../lib/supabase';
import StatsTabBar from './StatsTabBar';  
import * as XLSX from 'xlsx';
import { useTranslation } from '../../i18n';
import BackButton from '../../components/BackButton'; 
import PaywallGate from '../../components/PaywallGate';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine
} from 'recharts';

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

.stats-page { padding: 24px 28px; max-width: 1400px; margin: 0 auto; background: var(--bg); min-height: calc(100vh - 120px); }
.stats-back-btn { background: transparent; border: none; color: var(--red); cursor: pointer; font-size: 14px; font-weight: 600; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; padding: 0; transition: opacity 0.2s; }
.stats-back-btn:hover { opacity: 0.7; }
.stats-header { margin-bottom: 28px; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; }
.stats-header-left { flex: 1; }
.stats-title { font-family: 'Barlow Condensed', sans-serif; font-size: 36px; font-weight: 900; color: var(--white); margin-bottom: 6px; letter-spacing: 1px; }
.stats-subtitle { color: var(--muted); font-size: 15px; }
.stats-controls { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; align-items: flex-end; }
.stats-control-group label { display: block; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
.stats-filter-bar { display: flex; background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
.stats-filter-btn { padding: 10px 16px; background: transparent; border: none; color: var(--muted); font-size: 13px; font-weight: 400; cursor: pointer; font-family: 'Barlow', sans-serif; transition: all 0.2s; white-space: nowrap; }
.stats-filter-btn.active { background: var(--red); color: white; font-weight: 700; }
.stats-toggle-btn { padding: 10px 16px; background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; color: var(--muted); font-size: 13px; cursor: pointer; font-family: 'Barlow', sans-serif; transition: all 0.2s; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
.stats-toggle-btn.active { background: var(--green-dim); border-color: var(--green); color: var(--green); font-weight: 600; }
.stats-export-btn { padding: 10px 16px; background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; color: var(--muted); font-size: 13px; cursor: pointer; font-family: 'Barlow', sans-serif; transition: all 0.2s; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
.stats-export-btn:hover { border-color: var(--green); color: var(--green); background: var(--green-dim); }
.stats-panel { background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 24px; margin-bottom: 24px; transition: all 0.3s; }
.stats-panel-title { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: var(--white); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.stats-panel-title-sub { font-size: 12px; font-weight: 500; color: var(--muted); text-transform: none; letter-spacing: 0; }
.user-chips-container { margin-bottom: 24px; }
.user-chips-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.user-chips-label { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); }
.user-chips-actions { display: flex; gap: 6px; }
.user-chips-action-btn { background: transparent; border: 1px solid var(--border); border-radius: 6px; padding: 3px 10px; font-size: 11px; color: var(--muted); cursor: pointer; font-family: 'Barlow', sans-serif; transition: all 0.2s; }
.user-chips-action-btn:hover { border-color: var(--red); color: var(--red); }
.user-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.user-chip { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; font-family: 'Barlow', sans-serif; user-select: none; }
.user-chip.active { font-weight: 700; }
.user-chip-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.ranking-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 10px; }
.ranking-card { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 10px; border: 1px solid var(--border); transition: all 0.2s; cursor: pointer; }
.ranking-card.top3 { background: var(--red-dim); border-color: rgba(232,0,45,0.15); }
.ranking-card:not(.top3) { background: var(--bg3); }
.ranking-position { font-family: 'Barlow Condensed', sans-serif; font-weight: 900; width: 32px; text-align: center; flex-shrink: 0; }
.ranking-info { flex: 1; min-width: 0; }
.ranking-name { font-size: 14px; font-weight: 700; color: var(--white); margin-bottom: 4px; }
.ranking-bar-bg { height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; margin-bottom: 4px; }
.ranking-bar-fill { height: 100%; border-radius: 2px; transition: width 0.5s ease; }
.ranking-details { display: flex; gap: 12px; font-size: 11px; color: var(--muted); flex-wrap: wrap; }
.ranking-points { text-align: right; flex-shrink: 0; }
.ranking-points-value { font-family: 'Barlow Condensed', sans-serif; font-size: 24px; font-weight: 900; color: var(--white); }
.ranking-points-label { font-size: 10px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; }
.forecast-legend { display: flex; align-items: center; gap: 16px; padding: 12px 16px; background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 16px; font-size: 12px; color: var(--muted); flex-wrap: wrap; }
.forecast-legend-item { display: flex; align-items: center; gap: 6px; }
.forecast-legend-swatch { width: 16px; height: 10px; border-radius: 2px; flex-shrink: 0; }
.stats-empty { height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--muted); gap: 12px; }
.stats-empty-icon { font-size: 48px; opacity: 0.3; }
.stats-skeleton { height: 400px; background: var(--bg3); border-radius: 12px; animation: pulse 1.5s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

@media (max-width: 900px) {
  .stats-page { padding: 16px; }
  .stats-title { font-size: 28px; }
  .stats-controls { flex-direction: column; align-items: stretch; }
  .ranking-grid { grid-template-columns: 1fr; }
  .stats-header { flex-direction: column; }
}
@media (max-width: 768px) {
  .user-chips { gap: 6px; }
  .user-chip { padding: 5px 10px; font-size: 12px; }
}
`;

const USER_COLORS = [
  '#E8002D', '#00D4A0', '#C9A84C', '#3B82F6', '#F97316',
  '#8B5CF6', '#EC4899', '#14B8A6', '#EAB308', '#06B6D4',
  '#EF4444', '#22C55E', '#A855F7', '#F59E0B', '#6366F1'
];

// ============================================
// CUSTOM TOOLTIPS
// ============================================
function BarTooltip({ active, payload, label, theme }) {
  const { t } = useTranslation();
  if (!active || !payload?.length) return null;
  const bg = theme === 'dark' ? '#18181D' : '#FFFFFF';
  const border = theme === 'dark' ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.15)';
  const text = theme === 'dark' ? '#F0F0F0' : '#1A1B1E';
  const muted = theme === 'dark' ? 'rgba(240,240,240,0.5)' : 'rgba(26,27,30,0.55)';
  const sorted = [...payload].filter(p => p.value > 0).sort((a, b) => b.value - a.value);
  const isProjected = label?.startsWith('📈');

  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: '14px 18px', boxShadow: '0 8px 30px rgba(0,0,0,0.3)', minWidth: 180, maxWidth: 280 }}>
      <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 14, fontWeight: 800, color: text, marginBottom: 10, letterSpacing: 0.5, textTransform: 'uppercase' }}>
        {label}{isProjected && <span style={{ fontSize: 10, color: muted, fontWeight: 500, textTransform: 'none', marginLeft: 8 }}>({t('pointsHistogram.projectedLabel')})</span>}
      </div>
      {sorted.map((entry, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '3px 0', fontSize: 13 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: entry.color || entry.fill, opacity: isProjected ? 0.5 : 1, flexShrink: 0 }} />
            <span style={{ color: muted }}>{entry.name}</span>
          </div>
          <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 15, color: text }}>{Math.round(entry.value)} {t('common.pts')}</span>
        </div>
      ))}
    </div>
  );
}

function LineTooltip({ active, payload, label, theme }) {
  const { t } = useTranslation();
  if (!active || !payload?.length) return null;
  const bg = theme === 'dark' ? '#18181D' : '#FFFFFF';
  const border = theme === 'dark' ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.15)';
  const text = theme === 'dark' ? '#F0F0F0' : '#1A1B1E';
  const muted = theme === 'dark' ? 'rgba(240,240,240,0.5)' : 'rgba(26,27,30,0.55)';
  const sorted = [...payload].filter(p => p.value != null).sort((a, b) => b.value - a.value);

  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: '14px 18px', boxShadow: '0 8px 30px rgba(0,0,0,0.3)', minWidth: 180, maxWidth: 280 }}>
      <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 14, fontWeight: 800, color: text, marginBottom: 10, letterSpacing: 0.5, textTransform: 'uppercase' }}>{label}</div>
      {sorted.map((entry, i) => {
        const prev = i < sorted.length - 1 ? sorted[i + 1].value : null;
        const diff = prev != null ? entry.value - prev : null;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '3px 0', fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 50, background: entry.stroke || entry.color, flexShrink: 0 }} />
              <span style={{ color: muted }}>{entry.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 15, color: text }}>{Math.round(entry.value)}</span>
              {diff != null && sorted.length > 1 && i === 0 && (
                <span style={{ fontSize: 10, color: 'var(--green)', fontWeight: 600 }}>+{Math.round(diff)}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function PointsHistogram() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const theme = useThemeStore((state) => state.theme);
  const user = useAuthStore((state) => state.user);
  const { t } = useTranslation();

  const [groupInfo, setGroupInfo] = useState(null);
  const [scores, setScores] = useState([]);
  const [allRaces, setAllRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('todas');
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [showForecast, setShowForecast] = useState(false);
  const [activeChart, setActiveChart] = useState('barras');
  const [exporting, setExporting] = useState(false);
  const [profilesMap, setProfilesMap] = useState({});

  // ============================================
  // FETCH DATA — PARALLEL
  // ============================================
  useEffect(() => {
    if (!groupId) return;
    fetchData();
  }, [groupId]);

  async function fetchData() {
    setLoading(true);
    try {
      // Step 1: get group info first (need temporada for races query)
      const { data: gData, error: gError } = await supabase
        .from('groups')
        .select('id, nombre, temporada, incluir_sprints')
        .eq('id', groupId)
        .single();

      if (gError) throw gError;

      // Step 2: parallel fetch scores + races (both depend on group data)
      const [scoresRes, racesRes] = await Promise.all([
        supabase.from('scores').select(`
          usuario_id, puntos, aciertos_exactos, aciertos_piloto,
          carrera:carrera_id ( id, nombre, ronda, tipo, estado )
        `).eq('grupo_id', groupId).order('created_at', { ascending: true }),
        supabase.from('races').select('id, nombre, ronda, tipo, estado')
          .eq('temporada', gData.temporada)
          .order('ronda', { ascending: true })
      ]);

      if (scoresRes.error) throw scoresRes.error;

      const scoresData = scoresRes.data || [];
      const racesData = racesRes.data || [];

      // 🔒 Nombres vía función segura (RLS ya no permite leer 'users' directo)
      const uniqueUserIds = [...new Set(scoresData.map(s => s.usuario_id).filter(Boolean))];
      const { data: profiles } = await supabase.rpc('get_public_names', { p_user_ids: uniqueUserIds });
      const nameById = {};
      (profiles || []).forEach(p => { nameById[p.id] = p; });

      // Set all states together before loading ends
      setGroupInfo(gData);
      setAllRaces(racesData);
      setScores(scoresData);
      setProfilesMap(nameById);

      const users = new Set();
      scoresData.forEach(s => { if (s.usuario_id) users.add(s.usuario_id); });
      setSelectedUsers(users);
    } catch (err) {
      console.error('Error fetching stats data:', err);
    } finally {
      setLoading(false);
    }
  }

  // ============================================
  // PROCESS DATA
  // ============================================
  const { chartData, cumulativeData, userList, stats, forecastData } = useMemo(() => {
    if (!scores.length) {
      return { chartData: [], cumulativeData: [], userList: [], stats: null, forecastData: [] };
    }

    let filtered = scores;
    if (filterType === 'carrera') filtered = scores.filter(s => s.carrera?.tipo !== 'sprint');
    else if (filterType === 'sprint') filtered = scores.filter(s => s.carrera?.tipo === 'sprint');

    // Users
    const usersMap = new Map();
      filtered.forEach(s => {
        if (!s.usuario_id) return;
        const uid = s.usuario_id;
        if (!usersMap.has(uid)) {
          const profile = profilesMap[uid] || {};
          usersMap.set(uid, {
            id: uid,
            displayName: `${profile.nombre || ''} ${profile.apellido?.[0] || ''}`.trim(),
            color: USER_COLORS[usersMap.size % USER_COLORS.length]
          });
        }
      });
    const userList = [...usersMap.values()];

    // Bar chart data
    const racesMap = new Map();
    filtered.forEach(s => {
      const raceName = s.carrera?.nombre || t('pointsHistogram.unnamedRace');
      const ronda = s.carrera?.ronda || 0;
      const tipo = s.carrera?.tipo || 'carrera';
      const uInfo = usersMap.get(s.usuario_id);
      if (!uInfo) return;
      if (!racesMap.has(raceName)) racesMap.set(raceName, { ronda, tipo });
      racesMap.get(raceName)[uInfo.displayName] = Number(s.puntos) || 0;
    });

    const chartData = [...racesMap.entries()]
      .sort(([, a], [, b]) => a.ronda - b.ronda)
      .map(([name, data]) => ({
        raceName: data.tipo === 'sprint' ? `⚡ ${name}` : name,
        ...data
      }));

    // Cumulative
    const cumTotals = {};
    userList.forEach(u => { cumTotals[u.displayName] = 0; });
    const cumulativeData = chartData.map(race => {
      const entry = { raceName: race.raceName };
      userList.forEach(u => {
        cumTotals[u.displayName] += (race[u.displayName] || 0);
        entry[u.displayName] = cumTotals[u.displayName];
      });
      return entry;
    });

    // ============================================
    // FORECASTING
    // ============================================
    let forecastData = [];
    const completedRaceIds = new Set(filtered.map(s => s.carrera?.id).filter(Boolean));
    let remainingRaces = allRaces.filter(r => !completedRaceIds.has(r.id) && r.estado !== 'finalizada');
    if (filterType === 'carrera') remainingRaces = remainingRaces.filter(r => r.tipo !== 'sprint');
    else if (filterType === 'sprint') remainingRaces = remainingRaces.filter(r => r.tipo === 'sprint');

    

    if (remainingRaces.length > 0 && chartData.length > 0) {
      const userWeightedAvg = {};
      userList.forEach(u => {
        const uScores = chartData.map(r => r[u.displayName]).filter(v => v != null);
        if (!uScores.length) { userWeightedAvg[u.displayName] = 0; return; }
        let wSum = 0, wTotal = 0;
        uScores.forEach((pts, i) => { const w = i + 1; wSum += pts * w; wTotal += w; });
        userWeightedAvg[u.displayName] = wTotal > 0 ? Math.round(wSum / wTotal) : 0;
      });

      forecastData = remainingRaces.sort((a, b) => a.ronda - b.ronda).slice(0, 10).map(race => {
        const label = race.tipo === 'sprint' ? `📈 ⚡ ${race.nombre}` : `📈 ${race.nombre}`;
        const entry = { raceName: label, ronda: race.ronda, tipo: race.tipo, _isProjected: true };
        userList.forEach(u => { entry[u.displayName] = userWeightedAvg[u.displayName]; });
        return entry;
      });

    } 
    
    // Ranking
    const totalByUser = new Map();
    filtered.forEach(s => {
      const uInfo = usersMap.get(s.usuario_id);
      if (!uInfo) return;
      if (!totalByUser.has(uInfo.id)) {
        totalByUser.set(uInfo.id, { id: uInfo.id, name: uInfo.displayName, color: uInfo.color, puntos: 0, aciertos_exactos: 0, aciertos_piloto: 0, carreras: 0 });
      }
      const u = totalByUser.get(uInfo.id);
      u.puntos += Number(s.puntos) || 0;
      u.aciertos_exactos += Number(s.aciertos_exactos) || 0;
      u.aciertos_piloto += Number(s.aciertos_piloto) || 0;
      u.carreras += 1;
    });

    return {
      chartData,
      cumulativeData,
      userList,
      stats: { totalCarreras: chartData.length, ranking: [...totalByUser.values()].sort((a, b) => b.puntos - a.puntos) },
      forecastData
    };
  }, [scores, filterType, allRaces, profilesMap]);

  // ============================================
  // USER FILTER
  // ============================================
  const toggleUser = useCallback((userId) => {
    setSelectedUsers(prev => {
      const next = new Set(prev);
      next.has(userId) ? next.delete(userId) : next.add(userId);
      return next;
    });
  }, []);

  const selectAllUsers = useCallback(() => setSelectedUsers(new Set(userList.map(u => u.id))), [userList]);
  const clearAllUsers = useCallback(() => setSelectedUsers(new Set()), []);

  const visibleUsers = useMemo(() => userList.filter(u => selectedUsers.has(u.id)), [userList, selectedUsers]);

  const combinedChartData = useMemo(() => {
    if (!showForecast) return chartData;
    return [...chartData, ...forecastData];
  }, [chartData, forecastData, showForecast]);

  const hasSprints = useMemo(() => scores.some(s => s.carrera?.tipo === 'sprint'), [scores]);

  // ============================================
  // EXPORT TO EXCEL
  // ============================================
  const handleExport = useCallback(() => {
    if (!chartData.length || !stats) return;
    setExporting(true);

    try {
      const wb = XLSX.utils.book_new();

      const headers = [t('pointsHistogram.raceColumn'), ...userList.map(u => u.displayName)];
      const rows = chartData.map(race => {
        const row = [race.raceName.replace('⚡ ', '(Sprint) ')];
        userList.forEach(u => row.push(race[u.displayName] ?? 0));
        return row;
      });
      const totalRow = [t('pointsHistogram.totalRow')];
      userList.forEach(u => {
        const total = chartData.reduce((sum, r) => sum + (r[u.displayName] || 0), 0);
        totalRow.push(total);
      });
      rows.push(totalRow);

      const ws1 = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      ws1['!cols'] = [{ wch: 30 }, ...userList.map(() => ({ wch: 15 }))];
      XLSX.utils.book_append_sheet(wb, ws1, t('pointsHistogram.pointsByRace'));

      const rankHeaders = [t('common.position'), t('leaderboard.user'), t('common.points'), t('pointsHistogram.exactHitsColumn'), t('pointsHistogram.driverHitsColumn'), t('common.races')];
      const rankRows = stats.ranking.map((u, i) => [i + 1, u.name, Math.round(u.puntos), u.aciertos_exactos, u.aciertos_piloto, u.carreras]);
      const ws2 = XLSX.utils.aoa_to_sheet([rankHeaders, ...rankRows]);
      ws2['!cols'] = [{ wch: 10 }, { wch: 25 }, { wch: 10 }, { wch: 18 }, { wch: 18 }, { wch: 10 }];
      XLSX.utils.book_append_sheet(wb, ws2, t('pointsHistogram.rankingSheet'));

      const cumHeaders = [t('pointsHistogram.raceColumn'), ...userList.map(u => u.displayName)];
      const cumRows = cumulativeData.map(race => {
        const row = [race.raceName.replace('⚡ ', '(Sprint) ')];
        userList.forEach(u => row.push(race[u.displayName] ?? 0));
        return row;
      });
      const ws3 = XLSX.utils.aoa_to_sheet([cumHeaders, ...cumRows]);
      ws3['!cols'] = [{ wch: 30 }, ...userList.map(() => ({ wch: 15 }))];
      XLSX.utils.book_append_sheet(wb, ws3, t('pointsHistogram.cumulativePoints'));

      const fileName = `PodioF1_Stats_${groupInfo?.nombre || t('pointsHistogram.groupFallback')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (err) {
      console.error('Error exporting:', err);
    } finally {
      setExporting(false);
    }
  }, [chartData, cumulativeData, stats, userList, groupInfo]);

  // ============================================
  // THEME COLORS
  // ============================================
  const tc = useMemo(() => ({
    grid: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
    muted: theme === 'dark' ? 'rgba(240,240,240,0.40)' : 'rgba(26,27,30,0.55)',
    axis: theme === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.10)',
    refLine: theme === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)',
    refLabel: theme === 'dark' ? 'rgba(240,240,240,0.4)' : 'rgba(26,27,30,0.55)'
  }), [theme]);

  // ============================================
  // RENDER
  // ============================================
  if (loading) {
    return (
      <>
        <style>{FONTS + CSS}</style>
        <div data-theme={theme} className="stats-page">
          <BackButton className="stats-back-btn" onClick={() => navigate(`/group/${groupId}`)}>← {t('pointsHistogram.backToGroup')}</BackButton>
          <StatsTabBar active="charts" groupId={groupId} />
          <div className="stats-header"><div className="stats-header-left"><h1 className="stats-title">📊 {t('pointsHistogram.title')}</h1><p className="stats-subtitle">{t('common.loading')}</p></div></div>
          <div className="stats-skeleton" />
          <div className="stats-skeleton" style={{ height: 200, marginTop: 24 }} />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div data-theme={theme} className="stats-page">

      <BackButton className="stats-back-btn" onClick={() => navigate(`/group/${groupId}`)}>← {t('pointsHistogram.backToGroup')}</BackButton>

        <StatsTabBar active="charts" groupId={groupId} />

        {/* HEADER */}
        <div className="stats-header">
          <div className="stats-header-left">
            <h1 className="stats-title">📊 {t('pointsHistogram.title')}</h1>
            <p className="stats-subtitle">{groupInfo?.nombre} · {t('pointsHistogram.subtitle')}</p>
          </div>
          {chartData.length > 0 && (
            <PaywallGate feature="export_excel" compact>
              <button className="stats-export-btn" onClick={handleExport} disabled={exporting}>
                {exporting ? `⏳ ${t('pointsHistogram.exporting')}` : `📥 ${t('pointsHistogram.exportExcel')}`}
              </button>
            </PaywallGate>
          )}

        </div>

        {/* CONTROLS */}
        <div className="stats-controls">
          {hasSprints && (
            <div className="stats-control-group">
              <label>{t('pointsHistogram.raceTypeLabel')}</label>
              <div className="stats-filter-bar">
                {[  { key: 'todas', label: t('pointsHistogram.filterAll') },
                    { key: 'carrera', label: `🏁 ${t('common.races')}` },
                    { key: 'sprint', label: `⚡ ${t('tabs.sprints')}` }].map(opt => (
                  <button key={opt.key} className={`stats-filter-btn ${filterType === opt.key ? 'active' : ''}`} onClick={() => setFilterType(opt.key)}>{opt.label}</button>
                ))}
              </div>
            </div>
          )}

          {forecastData.length > 0 && (
            <div className="stats-control-group">
              <label>{t('pointsHistogram.forecastLabel')}</label>
              <button className={`stats-toggle-btn ${showForecast ? 'active' : ''}`} onClick={() => setShowForecast(!showForecast)}>
                📈 {t('pointsHistogram.forecastLabel')} {showForecast ? t('pointsHistogram.on') : t('pointsHistogram.off')}
              </button>
            </div>
          )}

          <div className="stats-control-group">
            <label>{t('pointsHistogram.chartLabel')}</label>
            <div className="stats-filter-bar">
              <button className={`stats-filter-btn ${activeChart === 'barras' ? 'active' : ''}`} onClick={() => setActiveChart('barras')}>📊 {t('pointsHistogram.barsChart')}</button>
              <button className={`stats-filter-btn ${activeChart === 'acumulado' ? 'active' : ''}`} onClick={() => setActiveChart('acumulado')}>📈 {t('pointsHistogram.cumulativeChart')}</button>
            </div>
          </div>
        </div>

        {/* USER CHIPS */}
        {userList.length > 1 && (
          <div className="user-chips-container">
            <div className="user-chips-header">
              <span className="user-chips-label">{t('pointsHistogram.filterUsers')}</span>
              <div className="user-chips-actions">
                <button className="user-chips-action-btn" onClick={selectAllUsers}>{t('pointsHistogram.allUsers')}</button>
                <button className="user-chips-action-btn" onClick={clearAllUsers}>{t('pointsHistogram.noneUsers')}</button>
              </div>
            </div>
            <div className="user-chips">
              {userList.map(u => {
                const isActive = selectedUsers.has(u.id);
                return (
                  <div key={u.id} className={`user-chip ${isActive ? 'active' : ''}`} onClick={() => toggleUser(u.id)}
                    style={{ background: isActive ? `${u.color}18` : 'var(--bg3)', borderColor: isActive ? u.color : 'var(--border)', color: isActive ? 'var(--white)' : 'var(--muted)' }}>
                    <div className="user-chip-dot" style={{ background: u.color, opacity: isActive ? 1 : 0.3 }} />
                    {u.displayName}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FORECAST LEGEND */}
        {showForecast && forecastData.length > 0 && activeChart === 'barras' && (
          <div className="forecast-legend">
            <div className="forecast-legend-item"><div className="forecast-legend-swatch" style={{ background: 'var(--red)' }} /><span>{t('pointsHistogram.realResult')}</span></div>
            <div className="forecast-legend-item"><div className="forecast-legend-swatch" style={{ background: 'var(--red)', opacity: 0.35, border: '1px dashed var(--muted)' }} /><span>{t('pointsHistogram.forecastWeighted')}</span></div>
            <span style={{ fontSize: 11, fontStyle: 'italic' }}>{t('pointsHistogram.recentRacesWeight')}</span>
          </div>
        )}

        {/* BAR CHART */}
        {activeChart === 'barras' && (
          <div className="stats-panel">
            <div className="stats-panel-title">📊 {t('pointsHistogram.pointsByRace')}</div>
            {combinedChartData.length === 0 || visibleUsers.length === 0 ? (
              <div className="stats-empty">
                <span className="stats-empty-icon">📊</span>
                <span style={{ fontSize: 15 }}>{scores.length === 0 ? t('pointsHistogram.noScores') : visibleUsers.length === 0 ? t('pointsHistogram.selectAtLeastOneUser') : t('pointsHistogram.noDataForFilter')}</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(400, visibleUsers.length * 20 + 360)}>
                <BarChart data={combinedChartData} margin={{ top: 10, right: 20, left: 0, bottom: 60 }} barCategoryGap="18%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke={tc.grid} vertical={false} />
                  <XAxis dataKey="raceName" tick={{ fill: tc.muted, fontSize: 11, fontFamily: "'Barlow Condensed'", fontWeight: 600 }} tickLine={false} axisLine={{ stroke: tc.axis }} angle={-30} textAnchor="end" height={80} interval={0} />
                  <YAxis tick={{ fill: tc.muted, fontSize: 12, fontFamily: "'Share Tech Mono'" }} tickLine={false} axisLine={false}
                   label={{ value: t('common.points'), angle: -90, position: 'insideLeft', fill: tc.muted, fontSize: 12, fontFamily: "'Barlow Condensed'", fontWeight: 600 }} />
                  <Tooltip content={<BarTooltip theme={theme} />} />
                  <Legend wrapperStyle={{ fontFamily: "'Barlow'", fontSize: 12, paddingTop: 16 }} iconType="square" iconSize={10} />
                  {showForecast && chartData.length > 0 && (
                    <ReferenceLine x={chartData[chartData.length - 1]?.raceName} stroke={tc.refLine} strokeDasharray="5 5"
                      label={{ value: t('pointsHistogram.realVsForecast'), position: 'top', fill: tc.refLabel, fontSize: 10, fontFamily: "'Barlow Condensed'" }} />
                  )}
                  {visibleUsers.map(u => <Bar key={u.id} dataKey={u.displayName} fill={u.color} radius={[4, 4, 0, 0]} maxBarSize={40} />)}
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {/* CUMULATIVE LINE CHART */}
        {activeChart === 'acumulado' && (
          <div className="stats-panel">
            <div className="stats-panel-title">
              📈 {t('pointsHistogram.cumulativePoints')}
              <span className="stats-panel-title-sub">{t('pointsHistogram.distanceEvolution')}</span>
            </div>
            {cumulativeData.length === 0 || visibleUsers.length === 0 ? (
              <div className="stats-empty">
                <span className="stats-empty-icon">📈</span>
                <span style={{ fontSize: 15 }}>{scores.length === 0 ? t('pointsHistogram.noScores') : t('pointsHistogram.selectAtLeastOneUser')}</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(400, visibleUsers.length * 15 + 360)}>
                <LineChart data={cumulativeData} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={tc.grid} vertical={false} />
                  <XAxis dataKey="raceName" tick={{ fill: tc.muted, fontSize: 11, fontFamily: "'Barlow Condensed'", fontWeight: 600 }} tickLine={false} axisLine={{ stroke: tc.axis }} angle={-30} textAnchor="end" height={80} interval={0} />
                  <YAxis tick={{ fill: tc.muted, fontSize: 12, fontFamily: "'Share Tech Mono'" }} tickLine={false} axisLine={false}
                    label={{ value: t('pointsHistogram.cumulativePtsLabel'), angle: -90, position: 'insideLeft', fill: tc.muted, fontSize: 12, fontFamily: "'Barlow Condensed'", fontWeight: 600 }} />
                  <Tooltip content={<LineTooltip theme={theme} />} />
                  <Legend wrapperStyle={{ fontFamily: "'Barlow'", fontSize: 12, paddingTop: 16 }} iconType="line" iconSize={14} />
                  {visibleUsers.map(u => (
                    <Line key={u.id} type="monotone" dataKey={u.displayName} stroke={u.color} strokeWidth={3}
                      dot={{ r: 4, fill: u.color, strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: u.color, stroke: theme === 'dark' ? '#111' : '#fff', strokeWidth: 2 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {/* RANKING */}
        {stats?.ranking?.length > 0 && (
          <div className="stats-panel">
            <div className="stats-panel-title">🏆 {t('pointsHistogram.cumulativeRanking')} <span className="stats-panel-title-sub">({stats.totalCarreras} {stats.totalCarreras === 1 ? t('pointsHistogram.raceSingular') : t('common.races')})</span></div>
            <div className="ranking-grid">
              {stats.ranking.map((u, i) => {
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
                const maxPuntos = stats.ranking[0]?.puntos || 1;
                const pct = (u.puntos / maxPuntos) * 100;
                const isSelected = selectedUsers.has(u.id);
                return (
                  <div key={u.name} className={`ranking-card ${i < 3 ? 'top3' : ''}`} style={{ opacity: isSelected ? 1 : 0.4 }} onClick={() => toggleUser(u.id)}>
                    <div className="ranking-position" style={{ fontSize: i < 3 ? 22 : 14, color: i < 3 ? 'var(--white)' : 'var(--muted)' }}>{medal}</div>
                    <div className="ranking-info">
                      <div className="ranking-name">{u.name}</div>
                      <div className="ranking-bar-bg"><div className="ranking-bar-fill" style={{ width: `${pct}%`, background: u.color }} /></div>
                      <div className="ranking-details">
                        <span>🎯 {t('common.exactCount', { count: u.aciertos_exactos })}</span>
                        <span>✓ {t('pointsHistogram.driversCount', { count: u.aciertos_piloto })}</span>
                        <span>🏁 {t('pointsHistogram.racesCount', { count: u.carreras })}</span>
                      </div>
                    </div>
                    <div className="ranking-points"><div className="ranking-points-value">{Math.round(u.puntos)}</div><div className="ranking-points-label">{t('common.pts')}</div></div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FORECAST SUMMARY */}
        {showForecast && stats?.ranking?.length > 0 && forecastData.length > 0 && (
          <div className="stats-panel">
          <div className="stats-panel-title">📈 {t('pointsHistogram.finalSeasonForecast')}<span className="stats-panel-title-sub">{t('pointsHistogram.forecastRacesNote', { count: forecastData.length })}</span></div>
            <div className="ranking-grid">
              {stats.ranking.filter(u => selectedUsers.has(u.id)).map(u => {
                const fpr = forecastData[0]?.[u.name] || 0;
                return { ...u, projectedTotal: Math.round(u.puntos + fpr * forecastData.length), fpr };
              }).sort((a, b) => b.projectedTotal - a.projectedTotal).map((u, i) => {
                const maxP = Math.max(...stats.ranking.map(r => { const f = forecastData[0]?.[r.name] || 0; return r.puntos + f * forecastData.length; })) || 1;
                const pct = (u.projectedTotal / maxP) * 100;
                return (
                  <div key={u.name} className={`ranking-card ${i < 3 ? 'top3' : ''}`}>
                    <div className="ranking-position" style={{ fontSize: i < 3 ? 22 : 14, color: i < 3 ? 'var(--white)' : 'var(--muted)' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</div>
                    <div className="ranking-info">
                      <div className="ranking-name">{u.name}</div>
                      <div className="ranking-bar-bg"><div className="ranking-bar-fill" style={{ width: `${pct}%`, background: u.color }} /></div>
                      <div className="ranking-details">
                        <span>{t('pointsHistogram.currentLabel')}: {Math.round(u.puntos)} {t('common.pts')}</span>
                        <span>+{Math.round(u.fpr * forecastData.length)} {t('pointsHistogram.projectedSuffix')}</span>
                      </div>                   
                      </div>
                    <div className="ranking-points"><div className="ranking-points-value">{u.projectedTotal}</div><div className="ranking-points-label">{t('pointsHistogram.ptsEstimated')}</div></div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}