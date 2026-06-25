import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { supabase } from '../../lib/supabase';
import * as XLSX from 'xlsx';
import StatsTabBar from './StatsTabBar';
import { useTranslation, getRaceName } from '../../i18n';
import BackButton from '../../components/BackButton';
import PaywallGate from '../../components/PaywallGate';  

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
.analysis-page { padding: 24px 28px; max-width: 1400px; margin: 0 auto; background: var(--bg); min-height: calc(100vh - 120px); }
.analysis-back-btn { background: transparent; border: none; color: var(--red); cursor: pointer; font-size: 14px; font-weight: 600; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; padding: 0; transition: opacity 0.2s; }
.analysis-back-btn:hover { opacity: 0.7; }
.analysis-header { margin-bottom: 28px; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; }
.analysis-header-left { flex: 1; }
.analysis-title { font-family: 'Barlow Condensed', sans-serif; font-size: 36px; font-weight: 900; color: var(--white); margin-bottom: 6px; letter-spacing: 1px; }
.analysis-subtitle { color: var(--muted); font-size: 15px; }
.analysis-panel { background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 24px; margin-bottom: 24px; }
.analysis-panel-title { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: var(--white); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.analysis-panel-title-sub { font-size: 12px; font-weight: 500; color: var(--muted); text-transform: none; letter-spacing: 0; }
.analysis-controls { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; align-items: flex-end; }
.analysis-control-group label { display: block; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
.analysis-select { padding: 10px 14px; background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; color: var(--white); font-size: 13px; font-family: 'Barlow', sans-serif; cursor: pointer; min-width: 200px; }
.analysis-export-btn { padding: 10px 16px; background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; color: var(--muted); font-size: 13px; cursor: pointer; font-family: 'Barlow', sans-serif; transition: all 0.2s; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
.analysis-export-btn:hover { border-color: var(--green); color: var(--green); background: var(--green-dim); }
.analysis-skeleton { height: 300px; background: var(--bg3); border-radius: 12px; animation: pulse 1.5s ease-in-out infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
.insight-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; margin-bottom: 24px; }
.insight-card { background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; padding: 16px; transition: all 0.2s; }
.insight-card-name { font-size: 15px; font-weight: 700; color: var(--white); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.insight-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; font-size: 12px; }
.insight-label { color: var(--muted); }
.insight-value { font-weight: 700; color: var(--white); font-family: 'Barlow Condensed', sans-serif; font-size: 14px; }
.race-block { margin-bottom: 24px; }
.race-block-header { background: var(--bg3); border: 1px solid var(--border); border-radius: 12px 12px 0 0; padding: 16px 20px; }
.race-block-title { font-family: 'Barlow Condensed', sans-serif; font-size: 20px; font-weight: 900; color: var(--white); margin-bottom: 4px; }
.race-block-subtitle { font-size: 12px; color: var(--muted); }
.race-official { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
.race-official-pill { padding: 4px 10px; background: var(--bg2); border: 1px solid var(--border); border-radius: 6px; font-size: 11px; color: var(--muted); font-family: 'Barlow Condensed', sans-serif; font-weight: 600; white-space: nowrap; }
.race-official-pill.vr { border-color: rgba(128,0,255,0.4); color: #A855F7; }
.user-prediction { border: 1px solid var(--border); border-top: none; padding: 16px 20px; background: var(--bg2); }
.user-prediction:last-child { border-radius: 0 0 12px 12px; }
.user-pred-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px; }
.user-pred-name { font-weight: 700; font-size: 14px; color: var(--white); }
.user-pred-score { font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-size: 18px; }
.user-pred-grid { display: flex; flex-wrap: wrap; gap: 6px; }
.pred-pill { padding: 4px 10px; border-radius: 6px; font-size: 11px; font-family: 'Barlow Condensed', sans-serif; font-weight: 600; display: flex; align-items: center; gap: 4px; white-space: nowrap; }
.pred-pill.exact { background: rgba(0,212,160,0.15); border: 1px solid rgba(0,212,160,0.3); color: var(--green); }
.pred-pill.pilot-ok { background: rgba(201,168,76,0.15); border: 1px solid rgba(201,168,76,0.3); color: var(--gold); }
.pred-pill.miss { background: var(--bg3); border: 1px solid var(--border); color: var(--muted); }
.legend-bar { display: flex; flex-wrap: wrap; gap: 16px; padding: 14px 18px; background: var(--bg3); border: 1px solid var(--border); border-radius: 10px; margin-bottom: 24px; font-size: 12px; color: var(--muted); align-items: center; }
.legend-item { display: flex; align-items: center; gap: 6px; }
.scoring-mini { display: flex; flex-wrap: wrap; gap: 8px; font-size: 11px; color: var(--muted); }
.scoring-pill { padding: 2px 8px; background: var(--bg2); border: 1px solid var(--border); border-radius: 4px; font-family: 'Share Tech Mono', monospace; }
@media (max-width: 900px) {
  .analysis-page { padding: 16px; }
  .analysis-title { font-size: 28px; }
  .analysis-controls { flex-direction: column; align-items: stretch; }
  .insight-grid { grid-template-columns: 1fr; }
  .analysis-header { flex-direction: column; }
}
`;

export default function PredictionAnalysis() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const theme = useThemeStore((state) => state.theme);
  const user = useAuthStore((state) => state.user);
  const { t } = useTranslation(); 

  const [groupInfo, setGroupInfo] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [raceResults, setRaceResults] = useState([]);
  const [drivers, setDrivers] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterRace, setFilterRace] = useState('todas');
  const [filterUser, setFilterUser] = useState('todos');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!groupId) return;
    fetchData();
  }, [groupId]);

  async function fetchData() {
      setLoading(true);
      try {
        const [groupRes, predsRes, driversRes] = await Promise.all([
          supabase.from('groups').select('id, nombre, temporada, cantidad_posiciones, sistema_puntos, sistema_puntos_sprint, incluir_sprints, usa_sistema_dual, puntos_piloto_correcto, bonus_posicion_exacta').eq('id', groupId).single(),
          // 🔒 !inner + filtro de estado: una carrera no finalizada nunca sale del servidor
          supabase.from('predictions').select(`
            id, usuario_id, posiciones, puntos_obtenidos,
            carrera:carrera_id!inner ( id, nombre, slug, ronda, tipo, estado )
          `).eq('grupo_id', groupId).eq('carrera.estado', 'finalizada').order('created_at', { ascending: true }),
          supabase.from('drivers').select('id, nombre_completo, acronimo')
        ]);

        const gData = groupRes.data;
        setGroupInfo(gData);

        const driversMap = {};
        (driversRes.data || []).forEach(d => { driversMap[d.id] = d; });
        setDrivers(driversMap);

        const predsData = predsRes.data || [];

        // 🔒 Nombres vía función segura (RLS ya no permite leer 'users' directo)
        const userIds = [...new Set(predsData.map(p => p.usuario_id).filter(Boolean))];
        const { data: profiles } = await supabase.rpc('get_public_names', { p_user_ids: userIds });
        const nameById = {};
        (profiles || []).forEach(p => { nameById[p.id] = p; });

        const finishedPreds = predsData.map(p => ({ ...p, usuario: { id: p.usuario_id, ...nameById[p.usuario_id] } }));
        setPredictions(finishedPreds);

        const raceIds = [...new Set(finishedPreds.map(p => p.carrera?.id).filter(Boolean))];
        if (raceIds.length > 0) {
          const { data: results } = await supabase
            .from('race_results')
            .select('carrera_id, piloto_id, posicion_final, vuelta_rapida, puntos_f1')
            .in('carrera_id', raceIds)
            .order('posicion_final', { ascending: true });
          setRaceResults(results || []);
        }
      } catch (err) {
        console.error('Error fetching analysis data:', err);
      } finally {
        setLoading(false);
      }
    }

  const { races, users, analysisData, insights } = useMemo(() => {
    if (!predictions.length || !Object.keys(drivers).length) {
      return { races: [], users: [], analysisData: [], insights: [] };
    }

    const maxPos = groupInfo?.cantidad_posiciones || 10;

    const racesMap = new Map();
    predictions.forEach(p => {
      if (!p.carrera?.id) return;
      if (!racesMap.has(p.carrera.id)) {
        racesMap.set(p.carrera.id, { id: p.carrera.id, nombre: p.carrera.nombre, slug: p.carrera.slug, ronda: p.carrera.ronda, tipo: p.carrera.tipo });
      }
    });
    const races = [...racesMap.values()].sort((a, b) => a.ronda - b.ronda);

    const usersMap = new Map();
    predictions.forEach(p => {
      if (!p.usuario?.id) return;
      if (!usersMap.has(p.usuario.id)) {
        usersMap.set(p.usuario.id, { id: p.usuario.id, nombre: `${p.usuario.nombre} ${p.usuario.apellido || ''}`.trim() });
      }
    });
    const users = [...usersMap.values()].sort((a, b) => a.nombre.localeCompare(b.nombre));

    const resultsLookup = {};
    raceResults.forEach(rr => {
      if (!resultsLookup[rr.carrera_id]) {
        resultsLookup[rr.carrera_id] = { byPos: {}, byPilot: {}, pilots: new Set(), vr: null };
      }
      const rl = resultsLookup[rr.carrera_id];
      rl.byPos[rr.posicion_final] = rr.piloto_id;
      rl.byPilot[rr.piloto_id] = rr.posicion_final;
      if (rr.posicion_final <= maxPos) rl.pilots.add(rr.piloto_id);
      if (rr.vuelta_rapida) rl.vr = rr.piloto_id;
    });

    const analysisData = races.map(race => {
      const rl = resultsLookup[race.id] || { byPos: {}, byPilot: {}, pilots: new Set(), vr: null };

      const official = [];
      for (let pos = 1; pos <= maxPos; pos++) {
        const pid = rl.byPos[pos];
        official.push({
          pos,
          pilotoId: pid,
          nombre: pid ? (drivers[pid]?.nombre_completo || '?') : '?',
          acronimo: pid ? (drivers[pid]?.acronimo || '') : '',
          vr: pid === rl.vr
        });
      }

      const racePreds = predictions
        .filter(p => p.carrera?.id === race.id)
        .sort((a, b) => (b.puntos_obtenidos || 0) - (a.puntos_obtenidos || 0));

      const userResults = racePreds.map(pred => {
        const posiciones = pred.posiciones || [];
        const slots = posiciones.slice(0, maxPos).map((pilotoId, idx) => {
          const pos = idx + 1;
          const realPilotAtPos = rl.byPos[pos];
          const driverName = drivers[pilotoId]?.nombre_completo || '?';

          let status;
          if (pilotoId === realPilotAtPos) {
            status = 'exact';
          } else if (rl.pilots.has(pilotoId)) {
            status = 'pilot-ok';
          } else {
            status = 'miss';
          }

          return { pos, pilotoId, driverName, status };
        });

        return {
          userId: pred.usuario?.id,
          userName: `${pred.usuario?.nombre || ''} ${pred.usuario?.apellido || ''}`.trim(),
          puntos: pred.puntos_obtenidos || 0,
          slots,
          exactCount: slots.filter(s => s.status === 'exact').length,
          pilotOkCount: slots.filter(s => s.status === 'pilot-ok').length,
          missCount: slots.filter(s => s.status === 'miss').length
        };
      });

      return { race, official, userResults };
    });

    // ============================================
    // INSIGHTS PER USER
    // ============================================
    const insightsMap = new Map();

    analysisData.forEach(({ race, userResults }) => {
      userResults.forEach(ur => {
        if (!insightsMap.has(ur.userId)) {
          insightsMap.set(ur.userId, {
            userId: ur.userId,
            userName: ur.userName,
            totalPuntos: 0,
            totalExact: 0,
            totalPilotOk: 0,
            totalMiss: 0,
            racesCount: 0,
            bestRace: { name: '', puntos: 0 },
            worstRace: { name: '', puntos: Infinity },
            positionHits: {},
            driverHits: {}
          });
        }
        const ins = insightsMap.get(ur.userId);
        ins.totalPuntos += ur.puntos;
        ins.totalExact += ur.exactCount;
        ins.totalPilotOk += ur.pilotOkCount;
        ins.totalMiss += ur.missCount;
        ins.racesCount += 1;

        if (ur.puntos > ins.bestRace.puntos) {
          ins.bestRace = { name: race.nombre, puntos: ur.puntos };
        }
        if (ur.puntos < ins.worstRace.puntos) {
          ins.worstRace = { name: race.nombre, puntos: ur.puntos };
        }

        ur.slots.forEach(s => {
          if (s.status === 'exact') {
            ins.positionHits[s.pos] = (ins.positionHits[s.pos] || 0) + 1;
          }
          if (s.status === 'exact' || s.status === 'pilot-ok') {
            if (!ins.driverHits[s.pilotoId]) {
              ins.driverHits[s.pilotoId] = { name: s.driverName, exact: 0, pilotOk: 0 };
            }
            if (s.status === 'exact') ins.driverHits[s.pilotoId].exact += 1;
            else ins.driverHits[s.pilotoId].pilotOk += 1;
          }
        });
      });
    });

    const insights = [...insightsMap.values()]
      .sort((a, b) => b.totalPuntos - a.totalPuntos)
      .map(ins => {
        const bestPos = Object.entries(ins.positionHits).sort(([, a], [, b]) => b - a)[0];

        // Top 3 drivers (sorted by total hits, then by exact as tiebreaker)
        const topDrivers = Object.values(ins.driverHits)
          .sort((a, b) => (b.exact + b.pilotOk) - (a.exact + a.pilotOk) || b.exact - a.exact)
          .slice(0, 3);

        return {
          ...ins,
          bestPosition: bestPos ? { pos: parseInt(bestPos[0]), hits: bestPos[1], pct: Math.round((bestPos[1] / ins.racesCount) * 100) } : null,
          topDrivers,
          avgExact: ins.racesCount > 0 ? (ins.totalExact / ins.racesCount).toFixed(1) : '0',
          avgPuntos: ins.racesCount > 0 ? Math.round(ins.totalPuntos / ins.racesCount) : 0
        };
      });

    return { races, users, analysisData, insights };
  }, [predictions, raceResults, drivers, groupInfo]);

  const filteredData = useMemo(() => {
    let data = analysisData;
    if (filterRace !== 'todas') {
      data = data.filter(d => d.race.id === filterRace);
    }
    if (filterUser !== 'todos') {
      data = data.map(d => ({
        ...d,
        userResults: d.userResults.filter(ur => ur.userId === filterUser)
      })).filter(d => d.userResults.length > 0);
    }
    return data;
  }, [analysisData, filterRace, filterUser]);

  const scoringInfo = useMemo(() => {
    if (!groupInfo) return { race: [], sprint: [] };
    const race = groupInfo.sistema_puntos ? Object.entries(groupInfo.sistema_puntos).sort(([a], [b]) => a - b).map(([pos, pts]) => ({ pos, pts })) : [];
    const sprint = groupInfo.sistema_puntos_sprint ? Object.entries(groupInfo.sistema_puntos_sprint).sort(([a], [b]) => a - b).map(([pos, pts]) => ({ pos, pts })) : [];
    return { race, sprint };
  }, [groupInfo]);

  const handleExport = useCallback(() => {
    if (!analysisData.length) return;
    setExporting(true);
    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: Predicción vs Resultado
  const detailHeaders = [
    t('predictionAnalysis.raceLabel'), t('predictionAnalysis.roundColumn'), t('predictionAnalysis.typeColumn'),
    t('leaderboard.user'), t('common.position'), t('predictionAnalysis.predictedDriverColumn'),
    t('predictionAnalysis.realDriverColumn'), t('predictionAnalysis.resultColumn'), t('predictionAnalysis.totalPointsColumn')
  ];      
  const detailRows = [];
      analysisData.forEach(({ race, official, userResults }) => {
        userResults.forEach(ur => {
          ur.slots.forEach(s => {
            const realDriver = official.find(o => o.pos === s.pos);
            detailRows.push([
              getRaceName(race, t), race.ronda, race.tipo, ur.userName, s.pos,
              s.driverName, realDriver?.nombre || '?',
              s.status === 'exact' ? `✅ ${t('predictionAnalysis.exactCaps')}` : s.status === 'pilot-ok' ? `🟡 ${t('predictionAnalysis.pilotOkCaps')}` : `❌ ${t('predictionAnalysis.missCaps')}`,
              s.pos === 1 ? ur.puntos : ''
            ]);
          });
        });
      });
      const ws1 = XLSX.utils.aoa_to_sheet([detailHeaders, ...detailRows]);
      ws1['!cols'] = [{ wch: 28 }, { wch: 6 }, { wch: 8 }, { wch: 20 }, { wch: 9 }, { wch: 22 }, { wch: 22 }, { wch: 14 }, { wch: 8 }];
      XLSX.utils.book_append_sheet(wb, ws1, t('predictionAnalysis.sheet1Name'));

      // Sheet 2: Insights por Usuario
      const insHeaders = [
        t('leaderboard.user'), t('predictionAnalysis.totalPointsColumnShort'), t('predictionAnalysis.avgPerRaceColumn'),
        t('predictionAnalysis.totalExactColumn'), t('predictionAnalysis.avgExactColumn'), t('predictionAnalysis.pilotOkColumn'),
        t('predictionAnalysis.missesColumn'), t('predictionAnalysis.bestRaceColumn'), t('predictionAnalysis.bestPtsColumn'),
        t('predictionAnalysis.bestPositionColumn'), t('predictionAnalysis.posHitPctColumn'), t('predictionAnalysis.topDriversColumn')
      ];
      const insRows = insights.map(i => [
        i.userName, Math.round(i.totalPuntos), i.avgPuntos, i.totalExact, i.avgExact, i.totalPilotOk, i.totalMiss,
        i.bestRace.name, Math.round(i.bestRace.puntos),
        i.bestPosition ? `#${i.bestPosition.pos}` : '-', i.bestPosition ? `${i.bestPosition.pct}%` : '-',
        i.topDrivers?.map((d, idx) => `${idx + 1}. ${d.name} (✅${d.exact} 🟡${d.pilotOk})`).join(' | ') || '-'
      ]);
      const ws2 = XLSX.utils.aoa_to_sheet([insHeaders, ...insRows]);
      ws2['!cols'] = [{ wch: 20 }, { wch: 12 }, { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 8 }, { wch: 22 }, { wch: 10 }, { wch: 16 }, { wch: 12 }, { wch: 60 }];
      XLSX.utils.book_append_sheet(wb, ws2, t('predictionAnalysis.sheet2Name'));

      // Sheet 3: Sistema de Puntos
      const scoreRows = [
        [t('predictionAnalysis.scoringSystemRaceCaps')],
        [t('common.position'), t('common.points')],
        ...scoringInfo.race.map(s => [s.pos + '°', s.pts]),
        [],
        [t('predictionAnalysis.scoringSystemSprintCaps')],
        [t('common.position'), t('common.points')],
        ...scoringInfo.sprint.map(s => [s.pos + '°', s.pts]),
        [],
        [t('predictionAnalysis.colorLegendCaps')],
        [t('predictionAnalysis.symbolColumn'), t('predictionAnalysis.meaningColumn')],
        [`✅ ${t('predictionAnalysis.exactCaps')}`, t('predictionAnalysis.legendExact')],
        [`🟡 ${t('predictionAnalysis.pilotOkCaps')}`, t('predictionAnalysis.legendPilotOkFull')],
        [`❌ ${t('predictionAnalysis.missCaps')}`, t('predictionAnalysis.legendMissFull')],
        [`🟣 ${t('predictionAnalysis.fastestLapCaps')}`, t('predictionAnalysis.legendFastestLap')]
      ];
      if (groupInfo?.usa_sistema_dual) {
        scoreRows.push([], [t('predictionAnalysis.dualSystemCaps')], [t('predictionAnalysis.dualCorrectDriverLabel'), groupInfo.puntos_piloto_correcto + ' pts'], [t('predictionAnalysis.dualBonusLabel'), '+' + groupInfo.bonus_posicion_exacta + ' pts']);
      }
      const ws3 = XLSX.utils.aoa_to_sheet(scoreRows);
      ws3['!cols'] = [{ wch: 35 }, { wch: 60 }];
      XLSX.utils.book_append_sheet(wb, ws3, t('scoringModal.title'));

      XLSX.writeFile(wb, `PodioF1_Analisis_${groupInfo?.nombre || t('pointsHistogram.groupFallback')}_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  }, [analysisData, insights, groupInfo, scoringInfo]);

  if (loading) {
    return (
      <>
        <style>{FONTS + CSS}</style>
        <div data-theme={theme} className="analysis-page">
          <BackButton className="analysis-back-btn">← {t('predictionAnalysis.backToGroup')}</BackButton>
          <StatsTabBar active="analysis" groupId={groupId} />
          <div className="analysis-skeleton" />
          <div className="analysis-skeleton" style={{ height: 200, marginTop: 24 }} />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div data-theme={theme} className="analysis-page">
      <BackButton className="analysis-back-btn" onClick={() => navigate(`/group/${groupId}`)}>← {t('predictionAnalysis.backToGroup')}</BackButton>

        <StatsTabBar active="analysis" groupId={groupId} />
        <PaywallGate feature="stats_advanced">
        <div className="analysis-header">
          <div className="analysis-header-left">
            <h1 className="analysis-title">📋 {t('predictionAnalysis.title')}</h1>
            <p className="analysis-subtitle">{groupInfo?.nombre} · {t('predictionAnalysis.subtitle')}</p>
          </div>
          {analysisData.length > 0 && (
            <PaywallGate feature="export_excel" compact>
              <button className="analysis-export-btn" onClick={handleExport} disabled={exporting}>
                {exporting ? `⏳ ${t('pointsHistogram.exporting')}` : `📥 ${t('predictionAnalysis.exportAnalysis')}`}
              </button>
            </PaywallGate>
          )}
        </div>

        {/* LEGEND WITH COLOR SAMPLES */}
        <div className="legend-bar">
          <div className="legend-item">
            <span className="pred-pill exact" style={{ padding: '2px 8px', fontSize: 10 }}>✅ {t('predictionAnalysis.legendExamplePos1')}</span>
            <span>{t('predictionAnalysis.legendExact')}</span>
          </div>
          <div className="legend-item">
            <span className="pred-pill pilot-ok" style={{ padding: '2px 8px', fontSize: 10 }}>🟡 {t('predictionAnalysis.legendExamplePos3')}</span>
            <span>{t('predictionAnalysis.legendPilotOk')}</span>
          </div>
          <div className="legend-item">
            <span className="pred-pill miss" style={{ padding: '2px 8px', fontSize: 10 }}>❌ {t('predictionAnalysis.legendExamplePos5')}</span>
            <span>{t('predictionAnalysis.legendMiss')}</span>
          </div>
          <div className="legend-item">
            <span className="race-official-pill vr" style={{ padding: '2px 8px', fontSize: 10 }}>🟣 {t('predictionAnalysis.legendFastestLap')}</span>
            <span>{t('predictionAnalysis.legendFastestLapDesc')}</span>
          </div>
        </div>

        {/* SCORING SYSTEM */}
        <div className="analysis-panel">
          <div className="analysis-panel-title">🏆 {t('scoringModal.title')}</div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('predictionAnalysis.raceLabel')}</div>
            <div className="scoring-mini">
              {scoringInfo.race.map(s => <span key={s.pos} className="scoring-pill">{s.pos}° = {s.pts} {t('common.pts')}</span>)}
            </div>
          </div>
          {scoringInfo.sprint.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>⚡ Sprint</div>
              <div className="scoring-mini">
                {scoringInfo.sprint.map(s => <span key={s.pos} className="scoring-pill">{s.pos}° = {s.pts} {t('common.pts')}</span>)}
              </div>
            </div>
          )}
          {groupInfo?.usa_sistema_dual && (
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8, padding: '8px 12px', background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <strong style={{ color: 'var(--white)' }}>{t('predictionAnalysis.dualSystemLabel')}:</strong> {t('predictionAnalysis.dualSystemDetail', { driverPts: groupInfo.puntos_piloto_correcto, bonusPts: groupInfo.bonus_posicion_exacta })}
            </div>
          )}
        </div>

        {/* FILTERS */}
        <div className="analysis-controls">
          <div className="analysis-control-group">
            <label>{t('predictionAnalysis.raceLabel')}</label>
            <select className="analysis-select" value={filterRace} onChange={e => setFilterRace(e.target.value)} style={{ background: 'var(--bg3)' }}>
              <option value="todas" style={{ background: 'var(--bg2)' }}>{t('predictionAnalysis.allRaces')}</option>
              {races.map(r => (
                <option key={r.id} value={r.id} style={{ background: 'var(--bg2)' }}>
                  {r.tipo === 'sprint' ? '⚡ ' : ''}{getRaceName(r, t)} (R{r.ronda})
                </option>
              ))}
            </select>
          </div>
          <div className="analysis-control-group">
            <label>{t('leaderboard.user')}</label>
            <select className="analysis-select" value={filterUser} onChange={e => setFilterUser(e.target.value)} style={{ background: 'var(--bg3)' }}>
              <option value="todos" style={{ background: 'var(--bg2)' }}>{t('predictionAnalysis.allUsers')}</option>
              {users.map(u => (
                <option key={u.id} value={u.id} style={{ background: 'var(--bg2)' }}>{u.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* INSIGHTS */}
        {filterUser === 'todos' && filterRace === 'todas' && insights.length > 0 && (
          <div className="analysis-panel">
            <div className="analysis-panel-title">🔍{t('predictionAnalysis.insightsTitle')}</div>
            <div className="insight-grid">
              {insights.map((ins, idx) => {
                const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '';
                return (
                  <div key={ins.userId} className="insight-card">
                    <div className="insight-card-name">
                      {medal && <span style={{ fontSize: 18 }}>{medal}</span>}
                      {ins.userName}
                    </div>
                    <div className="insight-row">
                      <span className="insight-label">{t('predictionAnalysis.totalPoints')}</span>
                      <span className="insight-value" style={{ color: 'var(--red)' }}>{Math.round(ins.totalPuntos)}</span>
                    </div>
                    <div className="insight-row">
                      <span className="insight-label">{t('predictionAnalysis.avgPerRace')}</span>
                      <span className="insight-value">{ins.avgPuntos} {t('common.pts')}</span>
                    </div>
                    <div className="insight-row">
                      <span className="insight-label">{t('predictionAnalysis.exactHits')}</span>
                      <span className="insight-value" style={{ color: 'var(--green)' }}>{ins.totalExact} ({ins.avgExact}/{t('predictionAnalysis.raceSlash')})</span>
                    </div>
                    <div className="insight-row">
                      <span className="insight-label">🎯 {t('predictionAnalysis.bestPositionLabel')}</span>
                      <span className="insight-value">{ins.bestPosition ? `#${ins.bestPosition.pos} (${ins.bestPosition.pct}%)` : '-'}</span>
                    </div>

                    {/* TOP 3 PILOTOS ACERTADOS */}
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>🏎 {t('predictionAnalysis.topDriversTitle')}</div>
                      {ins.topDrivers.length > 0 ? ins.topDrivers.map((d, di) => (
                        <div key={di} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0', fontSize: 12 }}>
                          <span style={{ color: 'var(--white)', fontWeight: 600 }}>{di + 1}. {d.name}</span>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <span style={{ color: 'var(--green)', fontWeight: 700 }}>✅{d.exact}</span>
                            <span style={{ color: 'var(--gold)', fontWeight: 700 }}>🟡{d.pilotOk}</span>
                            <span style={{ color: 'var(--muted)', fontSize: 11 }}>= {d.exact + d.pilotOk}</span>
                          </div>
                        </div>
                      )) : <span style={{ color: 'var(--muted)', fontSize: 12 }}>-</span>}
                    </div>

                    <div className="insight-row" style={{ marginTop: 8 }}>
                      <span className="insight-label">🏆 {t('predictionAnalysis.bestRaceLabel')}</span>
                      <span className="insight-value">{ins.bestRace.name} ({Math.round(ins.bestRace.puntos)})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* RACE BLOCKS */}
        {filteredData.length === 0 ? (
          <div className="analysis-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, opacity: 0.3, marginBottom: 16 }}>📋</div>
            <div style={{ color: 'var(--muted)', fontSize: 15 }}>{t('predictionAnalysis.noDataForFilters')}</div>
          </div>
        ) : (
          filteredData.map(({ race, official, userResults }) => (
            <div key={race.id} className="race-block">
              <div className="race-block-header">
                <div className="race-block-title">
                  {race.tipo === 'sprint' ? '⚡ ' : '🏁 '}{getRaceName(race, t)}
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--muted)', marginLeft: 8 }}>{t('predictionAnalysis.roundLabel', { round: race.ronda })}</span>
                </div>
                <div className="race-block-subtitle">{t('lastRace.officialResult')}</div>
                <div className="race-official">
                  {official.map(o => (
                    <span key={o.pos} className={`race-official-pill ${o.vr ? 'vr' : ''}`}>
                      {o.pos}° {o.nombre}{o.vr ? ' 🟣' : ''}
                    </span>
                  ))}
                </div>
              </div>

              {userResults.map(ur => (
                <div key={ur.userId} className="user-prediction">
                  <div className="user-pred-header">
                    <div>
                      <span className="user-pred-name">{ur.userName}</span>
                      <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 12 }}>
                        ✅{ur.exactCount} 🟡{ur.pilotOkCount} ❌{ur.missCount}
                      </span>
                    </div>
                    <span className="user-pred-score" style={{ color: ur.puntos > 0 ? 'var(--green)' : 'var(--muted)' }}>
                      {Math.round(ur.puntos)} {t('common.pts')}
                    </span>
                  </div>
                  <div className="user-pred-grid">
                    {ur.slots.map(s => (
                      <span key={s.pos} className={`pred-pill ${s.status}`}>
                        {s.status === 'exact' ? '✅' : s.status === 'pilot-ok' ? '🟡' : '❌'}
                        {s.pos}° {s.driverName}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
        </PaywallGate>
      </div>
    </>
  );
}