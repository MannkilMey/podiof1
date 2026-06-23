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
.deep-page { padding: 24px 28px; max-width: 1400px; margin: 0 auto; background: var(--bg); min-height: calc(100vh - 120px); }
.deep-back-btn { background: transparent; border: none; color: var(--red); cursor: pointer; font-size: 14px; font-weight: 600; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; padding: 0; transition: opacity 0.2s; }
.deep-back-btn:hover { opacity: 0.7; }
.deep-header { margin-bottom: 28px; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; }
.deep-header-left { flex: 1; }
.deep-title { font-family: 'Barlow Condensed', sans-serif; font-size: 36px; font-weight: 900; color: var(--white); margin-bottom: 6px; letter-spacing: 1px; }
.deep-subtitle { color: var(--muted); font-size: 15px; }
.deep-panel { background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 24px; margin-bottom: 24px; }
.deep-panel-title { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: var(--white); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.deep-panel-title-sub { font-size: 12px; font-weight: 500; color: var(--muted); text-transform: none; letter-spacing: 0; }
.deep-export-btn { padding: 10px 16px; background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; color: var(--muted); font-size: 13px; cursor: pointer; font-family: 'Barlow', sans-serif; transition: all 0.2s; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
.deep-export-btn:hover { border-color: var(--green); color: var(--green); background: var(--green-dim); }
.deep-skeleton { height: 300px; background: var(--bg3); border-radius: 12px; animation: pulse 1.5s ease-in-out infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }

.race-winner-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; }
.race-winner-card { background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; padding: 16px; transition: all 0.2s; }
.race-winner-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.race-winner-card-name { font-family: 'Barlow Condensed', sans-serif; font-size: 16px; font-weight: 800; color: var(--white); text-transform: uppercase; letter-spacing: 0.5px; }
.race-winner-card-type { font-size: 10px; padding: 2px 8px; border-radius: 4px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
.race-winner-podium { display: flex; flex-direction: column; gap: 6px; }
.podium-row { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.podium-medal { font-size: 16px; width: 24px; text-align: center; }
.podium-name { flex: 1; color: var(--white); font-weight: 600; }
.podium-pts { font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-size: 15px; }

.prerace-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.prerace-table th { background: var(--bg3); padding: 12px 16px; text-align: left; font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
.prerace-table td { padding: 12px 16px; border-top: 1px solid var(--border); color: var(--white); }
.prerace-table tr:hover { background: var(--bg3); }

.pilot-card { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg3); border: 1px solid var(--border); border-radius: 10px; }
.pilot-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px; }
.pilot-name { font-size: 14px; font-weight: 700; color: var(--white); }
.pilot-stat { font-size: 12px; color: var(--muted); }
.pilot-variation { font-family: 'Barlow Condensed', sans-serif; font-size: 20px; font-weight: 900; }

.user-stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
.user-stat-card { background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; padding: 16px; }
.user-stat-card-name { font-size: 15px; font-weight: 700; color: var(--white); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.user-stat-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; font-size: 12px; }
.user-stat-label { color: var(--muted); }
.user-stat-value { font-weight: 700; color: var(--white); font-family: 'Barlow Condensed', sans-serif; font-size: 14px; }

.section-toggle { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
.section-toggle-btn { padding: 8px 16px; background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; color: var(--muted); font-size: 13px; cursor: pointer; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; transition: all 0.2s; white-space: nowrap; }
.section-toggle-btn.active { background: var(--red-dim); border-color: var(--red); color: var(--red); }

@media (max-width: 900px) {
  .deep-page { padding: 16px; }
  .deep-title { font-size: 28px; }
  .race-winner-grid { grid-template-columns: 1fr; }
  .pilot-grid { grid-template-columns: 1fr; }
  .user-stats-grid { grid-template-columns: 1fr; }
  .deep-header { flex-direction: column; }
  .prerace-table { display: block; overflow-x: auto; }
}
`;

export default function DeepAnalytics() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const theme = useThemeStore((state) => state.theme);
  const user = useAuthStore((state) => state.user);
  const { t } = useTranslation();

  const [groupInfo, setGroupInfo] = useState(null);
  const [scores, setScores] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [qualifyingResults, setQualifyingResults] = useState([]);
  const [raceResults, setRaceResults] = useState([]);
  const [drivers, setDrivers] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('winners');
  const [exporting, setExporting] = useState(false);

  // ============================================
  // FETCH DATA
  // ============================================
  useEffect(() => {
    if (!groupId) return;
    fetchData();
  }, [groupId]);

  async function fetchData() {
    setLoading(true);
    try {
      const { data: gData } = await supabase
        .from('groups')
        .select('id, nombre, temporada, cantidad_posiciones, sistema_puntos, sistema_puntos_sprint, incluir_sprints, usa_sistema_dual, puntos_piloto_correcto, bonus_posicion_exacta')
        .eq('id', groupId).single();

      setGroupInfo(gData);

      const [scoresRes, predsRes, driversRes] = await Promise.all([
        supabase.from('scores').select(`
          puntos, aciertos_exactos, aciertos_piloto,
          usuario:usuario_id ( id, nombre, apellido ),
          carrera:carrera_id ( id, nombre, slug, ronda, tipo, estado )
        `).eq('grupo_id', groupId).order('created_at', { ascending: true }),
        supabase.from('predictions').select(`
          id, posiciones, puntos_obtenidos,
          usuario:usuario_id ( id, nombre, apellido ),
          carrera:carrera_id ( id, nombre, slug, ronda, tipo, estado )
        `).eq('grupo_id', groupId),
        supabase.from('drivers').select('id, nombre_completo, acronimo, openf1_driver_number')
      ]);

      setScores(scoresRes.data || []);

      const finishedPreds = (predsRes.data || []).filter(p => p.carrera?.estado === 'finalizada');
      setPredictions(finishedPreds);

      const driversMap = {};
      (driversRes.data || []).forEach(d => { driversMap[d.id] = d; });
      setDrivers(driversMap);

      // Fetch qualifying + race results for finished races
      const raceIds = [...new Set(finishedPreds.map(p => p.carrera?.id).filter(Boolean))];
      if (raceIds.length > 0) {
        const [qualRes, resultRes] = await Promise.all([
          supabase.from('qualifying_results').select('carrera_id, piloto_id, posicion, tiempo').in('carrera_id', raceIds).order('posicion'),
          supabase.from('race_results').select('carrera_id, piloto_id, posicion_final, vuelta_rapida, puntos_f1').in('carrera_id', raceIds).order('posicion_final')
        ]);
        setQualifyingResults(qualRes.data || []);
        setRaceResults(resultRes.data || []);
      }
    } catch (err) {
      console.error('Error fetching deep analytics:', err);
    } finally {
      setLoading(false);
    }
  }

  // ============================================
  // PROCESS DATA
  // ============================================
  const { raceWinners, preRaceData, pilotPerformance, userStats } = useMemo(() => {
    if (!scores.length || !groupInfo) {
      return { raceWinners: [], preRaceData: [], pilotPerformance: [], userStats: [] };
    }

    const maxPos = groupInfo.cantidad_posiciones || 10;
    const sistemaPuntos = groupInfo.sistema_puntos || {};

    // ============================================
    // 1. RACE WINNERS
    // ============================================
    const racesMap = new Map();
    scores.forEach(s => {
      if (!s.carrera?.id || s.carrera?.estado !== 'finalizada') return;
      const raceId = s.carrera.id;
      if (!racesMap.has(raceId)) {
        racesMap.set(raceId, {
          id: raceId,
          nombre: s.carrera.nombre,
          slug: s.carrera.slug,
          ronda: s.carrera.ronda,
          tipo: s.carrera.tipo,
          users: []
        });
      }
      racesMap.get(raceId).users.push({
        userId: s.usuario?.id,
        nombre: `${s.usuario?.nombre || ''} ${s.usuario?.apellido || ''}`.trim(),
        puntos: Number(s.puntos) || 0,
        exactos: Number(s.aciertos_exactos) || 0
      });
    });

    const raceWinners = [...racesMap.values()]
      .sort((a, b) => a.ronda - b.ronda)
      .map(race => {
        race.users.sort((a, b) => b.puntos - a.puntos);
        const avg = race.users.length > 0
          ? Math.round(race.users.reduce((sum, u) => sum + u.puntos, 0) / race.users.length)
          : 0;
        return { ...race, podium: race.users.slice(0, 3), avg };
      });

    // ============================================
    // 2. PRE-RACE POINTS (Qualifying-based scoring)
    // ============================================
    const qualLookup = {};
    qualifyingResults.forEach(q => {
      if (!qualLookup[q.carrera_id]) qualLookup[q.carrera_id] = { byPos: {}, byPilot: {}, pilots: new Set() };
      const ql = qualLookup[q.carrera_id];
      ql.byPos[q.posicion] = q.piloto_id;
      ql.byPilot[q.piloto_id] = q.posicion;
      if (q.posicion <= maxPos) ql.pilots.add(q.piloto_id);
    });

    const preRaceData = [];
    const finishedRaces = [...racesMap.values()].sort((a, b) => a.ronda - b.ronda);

    finishedRaces.forEach(race => {
      const ql = qualLookup[race.id];
      if (!ql) return;

      const racePreds = predictions.filter(p => p.carrera?.id === race.id);
      const sp = race.tipo === 'sprint' ? (groupInfo.sistema_puntos_sprint || {}) : sistemaPuntos;

      racePreds.forEach(pred => {
        const posiciones = pred.posiciones || [];
        let preRacePts = 0;
        let preRaceExact = 0;

        posiciones.slice(0, maxPos).forEach((pilotoId, idx) => {
          const pos = idx + 1;
          const qualPilotAtPos = ql.byPos[pos];

          if (groupInfo.usa_sistema_dual) {
            if (pilotoId === qualPilotAtPos) {
              preRacePts += Number(groupInfo.puntos_piloto_correcto || 0) + Number(groupInfo.bonus_posicion_exacta || 0);
              preRaceExact++;
            } else if (ql.pilots.has(pilotoId)) {
              preRacePts += Number(groupInfo.puntos_piloto_correcto || 0);
            }
          } else {
            if (pilotoId === qualPilotAtPos) {
              preRacePts += Number(sp[String(pos)] || 0);
              preRaceExact++;
            }
          }
        });

        preRaceData.push({
          raceId: race.id,
          raceName: race.nombre,
          ronda: race.ronda,
          raceSlug: race.slug,
          tipo: race.tipo,
          userId: pred.usuario?.id,
          userName: `${pred.usuario?.nombre || ''} ${pred.usuario?.apellido || ''}`.trim(),
          puntosPreCarrera: preRacePts,
          puntosReales: pred.puntos_obtenidos || 0,
          diferencia: (pred.puntos_obtenidos || 0) - preRacePts,
          exactosPreCarrera: preRaceExact
        });
      });
    });

    // ============================================
    // 3. PILOT PERFORMANCE
    // ============================================
    const pilotMap = new Map();
    qualifyingResults.forEach(q => {
      const rr = raceResults.find(r => r.carrera_id === q.carrera_id && r.piloto_id === q.piloto_id);
      if (!rr || !rr.posicion_final) return;

      const driver = drivers[q.piloto_id];
      if (!driver) return;

      if (!pilotMap.has(q.piloto_id)) {
        pilotMap.set(q.piloto_id, {
          pilotoId: q.piloto_id,
          nombre: driver.nombre_completo,
          acronimo: driver.acronimo,
          races: [],
          totalVariation: 0
        });
      }
      const variation = q.posicion - rr.posicion_final;
      pilotMap.get(q.piloto_id).races.push({
        raceId: q.carrera_id,
        posClasif: q.posicion,
        posCarrera: rr.posicion_final,
        variation
      });
      pilotMap.get(q.piloto_id).totalVariation += variation;
    });

    const pilotPerformance = [...pilotMap.values()]
      .map(p => ({
        ...p,
        avgVariation: p.races.length > 0 ? (p.totalVariation / p.races.length).toFixed(1) : 0,
        bestGain: Math.max(...p.races.map(r => r.variation)),
        worstDrop: Math.min(...p.races.map(r => r.variation)),
        racesCount: p.races.length
      }))
      .sort((a, b) => b.totalVariation - a.totalVariation);

    // ============================================
    // 4. USER STATS
    // ============================================
    const userMap = new Map();
    raceWinners.forEach(race => {
      race.users.forEach((u, idx) => {
        if (!userMap.has(u.userId)) {
          userMap.set(u.userId, {
            userId: u.userId,
            nombre: u.nombre,
            wins: 0,
            podiums: 0,
            totalPuntos: 0,
            races: [],
            bestRace: { name: '', puntos: 0 },
            worstRace: { name: '', puntos: Infinity }
          });
        }
        const us = userMap.get(u.userId);
        if (idx === 0) us.wins++;
        if (idx < 3) us.podiums++;
        us.totalPuntos += u.puntos;
        us.races.push({ name: race.nombre, slug: race.slug, puntos: u.puntos, position: idx + 1 });
        if (u.puntos > us.bestRace.puntos) us.bestRace = { name: race.nombre, slug: race.slug, puntos: u.puntos };
        if (u.puntos < us.worstRace.puntos) us.worstRace = { name: race.nombre, slug: race.slug, puntos: u.puntos };
      });
    });

    const userStats = [...userMap.values()]
      .map(u => {
        const avg = u.races.length > 0 ? Math.round(u.totalPuntos / u.races.length) : 0;
        // Trend: compare avg of last 2 races vs first 2
        const recent = u.races.slice(-2);
        const early = u.races.slice(0, 2);
        const recentAvg = recent.length > 0 ? recent.reduce((s, r) => s + r.puntos, 0) / recent.length : 0;
        const earlyAvg = early.length > 0 ? early.reduce((s, r) => s + r.puntos, 0) / early.length : 0;
        const trend = recentAvg - earlyAvg;

        // Pre-race total
        const userPreRace = preRaceData.filter(p => p.userId === u.userId);
        const totalPreRace = userPreRace.reduce((s, p) => s + p.puntosPreCarrera, 0);
        const totalReal = userPreRace.reduce((s, p) => s + p.puntosReales, 0);

        return {
          ...u,
          avg,
          trend,
          totalPreRace,
          totalReal,
          preRaceDiff: totalReal - totalPreRace
        };
      })
      .sort((a, b) => b.wins - a.wins || b.totalPuntos - a.totalPuntos);

    return { raceWinners, preRaceData, pilotPerformance, userStats };
  }, [scores, predictions, qualifyingResults, raceResults, drivers, groupInfo]);

  // ============================================
  // EXPORT EXCEL
  // ============================================
  const handleExport = useCallback(() => {
    if (!raceWinners.length) return;
    setExporting(true);
    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: Race Winners
      const winHeaders = [
        t('predictionAnalysis.raceLabel'), t('predictionAnalysis.roundColumn'), t('predictionAnalysis.typeColumn'),
        '🥇 1°', t('deepAnalytics.pts1Column'), '🥈 2°', t('deepAnalytics.pts2Column'), '🥉 3°', t('deepAnalytics.pts3Column'),
        t('deepAnalytics.averageLabel')
      ];
      const winRows = raceWinners.map(r => [
        getRaceName(r, t), r.ronda, r.tipo,
        r.podium[0]?.nombre || '-', Math.round(r.podium[0]?.puntos || 0),
        r.podium[1]?.nombre || '-', Math.round(r.podium[1]?.puntos || 0),
        r.podium[2]?.nombre || '-', Math.round(r.podium[2]?.puntos || 0),
        r.avg
      ]);
      const ws1 = XLSX.utils.aoa_to_sheet([winHeaders, ...winRows]);
      ws1['!cols'] = [{ wch: 28 }, { wch: 6 }, { wch: 8 }, { wch: 20 }, { wch: 8 }, { wch: 20 }, { wch: 8 }, { wch: 20 }, { wch: 8 }, { wch: 10 }];
      XLSX.utils.book_append_sheet(wb, ws1, t('deepAnalytics.winnersByRace'));

      // Sheet 2: Pre-Race vs Real
      const preHeaders = [
        t('predictionAnalysis.raceLabel'), t('predictionAnalysis.roundColumn'), t('leaderboard.user'),
        t('deepAnalytics.ptsPreRaceColumn'), t('deepAnalytics.ptsRealColumn'), t('deepAnalytics.differenceColumn'),
        t('deepAnalytics.exactPreRaceColumn')
      ];
      const preRows = preRaceData.map(p => [
         getRaceName({ nombre: p.raceName, slug: p.raceSlug }, t), p.ronda, p.userName, p.puntosPreCarrera, Math.round(p.puntosReales), Math.round(p.diferencia), p.exactosPreCarrera
      ]);
      const ws2 = XLSX.utils.aoa_to_sheet([preHeaders, ...preRows]);
      ws2['!cols'] = [{ wch: 28 }, { wch: 6 }, { wch: 20 }, { wch: 16 }, { wch: 12 }, { wch: 12 }, { wch: 18 }];
      XLSX.utils.book_append_sheet(wb, ws2, t('deepAnalytics.preRaceVsReal'));

      // Sheet 3: Pilot Performance
      const pilotHeaders = [
        t('standings.driver'), t('common.races'), t('deepAnalytics.avgVariationColumn'),
        t('deepAnalytics.bestGainColumn'), t('deepAnalytics.worstDropColumn'), t('deepAnalytics.totalVariationColumn')
      ];
      const pilotRows = pilotPerformance.map(p => [
        p.nombre, p.racesCount, p.avgVariation, `+${p.bestGain}`, p.worstDrop, p.totalVariation
      ]);
      const ws3 = XLSX.utils.aoa_to_sheet([pilotHeaders, ...pilotRows]);
      ws3['!cols'] = [{ wch: 22 }, { wch: 10 }, { wch: 18 }, { wch: 14 }, { wch: 12 }, { wch: 16 }];
      XLSX.utils.book_append_sheet(wb, ws3, t('deepAnalytics.pilotPerformance'));

      // Sheet 4: User Stats
      const usHeaders = [
        t('leaderboard.user'), t('deepAnalytics.victoriesLabel'), t('deepAnalytics.podiumsLabel'),
        t('predictionAnalysis.totalPointsColumnShort'), t('deepAnalytics.averageLabel'), t('deepAnalytics.ptsPreRaceColumn'),
        t('deepAnalytics.differenceColumn'), t('predictionAnalysis.bestRaceColumn'), t('deepAnalytics.worstRaceColumn'),
        t('deepAnalytics.trendLabel')
      ];      
      const usRows = userStats.map(u => [
        u.nombre, u.wins, u.podiums, Math.round(u.totalPuntos), u.avg,
        u.totalPreRace, Math.round(u.preRaceDiff),
        `${getRaceName({ nombre: u.bestRace.name, slug: u.bestRace.slug }, t)} (${Math.round(u.bestRace.puntos)})`,
        `${getRaceName({ nombre: u.worstRace.name, slug: u.worstRace.slug }, t)} (${Math.round(u.worstRace.puntos)})`,
        u.trend > 0 ? t('deepAnalytics.trendUpDetail', { value: Math.round(u.trend) }) : u.trend < 0 ? t('deepAnalytics.trendDownDetail', { value: Math.round(u.trend) }) : t('deepAnalytics.trendStable')
      ]);
      const ws4 = XLSX.utils.aoa_to_sheet([usHeaders, ...usRows]);
      ws4['!cols'] = usHeaders.map(() => ({ wch: 18 }));
      XLSX.utils.book_append_sheet(wb, ws4, t('deepAnalytics.statsByPlayer'));

      XLSX.writeFile(wb, `PodioF1_DeepAnalytics_${groupInfo?.nombre || t('pointsHistogram.groupFallback')}_${new Date().toISOString().slice(0, 10)}.xlsx`);    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  }, [raceWinners, preRaceData, pilotPerformance, userStats, groupInfo]);

  // ============================================
  // RENDER
  // ============================================
  if (loading) {
    return (
      <>
        <style>{FONTS + CSS}</style>
        <div data-theme={theme} className="deep-page">
          <BackButton className="deep-back-btn">← {t('predictionAnalysis.backToGroup')}</BackButton>
          <StatsTabBar active="deep" groupId={groupId} />
          <div className="deep-skeleton" />
          <div className="deep-skeleton" style={{ height: 200, marginTop: 24 }} />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div data-theme={theme} className="deep-page">
        <BackButton className="deep-back-btn" onClick={() => navigate(`/group/${groupId}`)}>← {t('predictionAnalysis.backToGroup')}</BackButton>

        <StatsTabBar active="deep" groupId={groupId} />

        <div className="deep-header">
          <div className="deep-header-left">
            <h1 className="deep-title">🔬 {t('deepAnalytics.title')}</h1>
            <p className="deep-subtitle">{groupInfo?.nombre} · {t('deepAnalytics.subtitle')}</p>
          </div>
          {raceWinners.length > 0 && (
            <PaywallGate feature="export_excel" compact>
              <button className="deep-export-btn" onClick={handleExport} disabled={exporting}>
                {exporting ? `⏳ ${t('pointsHistogram.exporting')}` : `📥 ${t('pointsHistogram.exportExcel')}`}
              </button>
            </PaywallGate>
          )}
        </div>

        {/* SECTION TOGGLE */}
        <div className="section-toggle">
          {[
            { key: 'winners', label: `🏆 ${t('deepAnalytics.winnersTab')}` },
            { key: 'prerace', label: `📊 ${t('deepAnalytics.preRaceTab')}` },
            { key: 'pilots', label: `🏎 ${t('deepAnalytics.pilotsTab')}` },
            { key: 'users', label: `👤 ${t('deepAnalytics.playersTab')}` }
          ].map(s => (
            <button key={s.key} className={`section-toggle-btn ${activeSection === s.key ? 'active' : ''}`}
              onClick={() => setActiveSection(s.key)}>{s.label}</button>
          ))}
        </div>

        {/* ============================================ */}
        {/* RACE WINNERS */}
        {/* ============================================ */}
        {activeSection === 'winners' && (
          <div className="deep-panel">
            <div className="deep-panel-title">🏆 {t('deepAnalytics.winnersByRace')} <span className="deep-panel-title-sub">({raceWinners.length} {t('common.races')})</span></div>
            {raceWinners.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>{t('deepAnalytics.noFinishedRaces')}</div>
            ) : (
              <div className="race-winner-grid">
                {raceWinners.map(race => (
                  <div key={race.id} className="race-winner-card">
                    <div className="race-winner-card-header">
                      <div className="race-winner-card-name">
                        {race.tipo === 'sprint' ? '⚡ ' : '🏁 '}{getRaceName(race, t)}
                      </div>
                      <span className="race-winner-card-type" style={{
                        background: race.tipo === 'sprint' ? 'rgba(201,168,76,0.15)' : 'var(--red-dim)',
                        color: race.tipo === 'sprint' ? 'var(--gold)' : 'var(--red)',
                        border: `1px solid ${race.tipo === 'sprint' ? 'rgba(201,168,76,0.3)' : 'rgba(232,0,45,0.3)'}`
                      }}>
                        R{race.ronda}
                      </span>
                    </div>
                    <div className="race-winner-podium">
                      {race.podium.map((u, i) => (
                        <div key={u.userId} className="podium-row">
                          <span className="podium-medal">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                          <span className="podium-name">{u.nombre}</span>
                          <span className="podium-pts" style={{ color: i === 0 ? 'var(--green)' : 'var(--white)' }}>{Math.round(u.puntos)}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>👥 {t('pozo.participants', { count: race.users.length })}</span>
                      <span>{t('deepAnalytics.averageLabel')}: {race.avg} {t('common.pts')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Wins leaderboard */}
            {userStats.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--white)', fontFamily: "'Barlow Condensed'", textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                  🏅 {t('deepAnalytics.winsTable')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {userStats.filter(u => u.wins > 0 || u.podiums > 0).map((u, i) => (
                    <div key={u.userId} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                      background: i === 0 ? 'var(--red-dim)' : 'var(--bg3)',
                      border: `1px solid ${i === 0 ? 'rgba(232,0,45,0.15)' : 'var(--border)'}`,
                      borderRadius: 8
                    }}>
                      <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: i === 0 ? 20 : 14, width: 28, textAlign: 'center', color: i === 0 ? 'var(--white)' : 'var(--muted)' }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                      </span>
                      <span style={{ flex: 1, fontWeight: 700, fontSize: 14, color: 'var(--white)' }}>{u.nombre}</span>
                      <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                        <span style={{ color: 'var(--gold)' }}>🏆 {t('deepAnalytics.winsCount', { count: u.wins })}</span>
                        <span style={{ color: 'var(--muted)' }}>🥉 {t('deepAnalytics.podiumsCount', { count: u.podiums })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================ */}
        {/* PRE-RACE VS REAL */}
        {/* ============================================ */}
        {activeSection === 'prerace' && (
          <div className="deep-panel">
            <div className="deep-panel-title">
              📊 {t('deepAnalytics.preRaceVsReal')}
              <span className="deep-panel-title-sub">{t('deepAnalytics.preRaceExplain')}</span>
            </div>
            {preRaceData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>{t('deepAnalytics.noQualifyingData')}</div>
            ) : (
              <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border)' }}>
                <table className="prerace-table">
                  <thead>
                    <tr>
                      <th>{t('predictionAnalysis.raceLabel')}</th>
                      <th>{t('leaderboard.user')}</th>
                      <th>{t('deepAnalytics.ptsPreRaceColumn')}</th>
                      <th>{t('deepAnalytics.ptsRealColumn')}</th>
                      <th>{t('deepAnalytics.differenceColumn')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...new Set(preRaceData.map(p => p.raceId))].map(raceId => {
                      const raceRows = preRaceData.filter(p => p.raceId === raceId).sort((a, b) => b.puntosReales - a.puntosReales);
                      return raceRows.map((p, i) => (
                        <tr key={`${p.raceId}-${p.userId}`}>
                          {i === 0 && (
                            <td rowSpan={raceRows.length} style={{
                              fontWeight: 700, fontSize: 13, verticalAlign: 'top', borderRight: '1px solid var(--border)'
                            }}>
                              {p.tipo === 'sprint' ? '⚡ ' : ''}{getRaceName({ nombre: p.raceName, slug: p.raceSlug }, t)}
                              <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 400 }}>{t('predictionAnalysis.roundLabel', { round: p.ronda })}</div>
                            </td>
                          )}
                          <td style={{ fontWeight: 600 }}>{p.userName}</td>
                          <td style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 15, color: 'var(--muted)' }}>
                            {p.puntosPreCarrera}
                          </td>
                          <td style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 15, color: 'var(--green)' }}>
                            {Math.round(p.puntosReales)}
                          </td>
                          <td style={{
                            fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 15,
                            color: p.diferencia > 0 ? 'var(--green)' : p.diferencia < 0 ? 'var(--red)' : 'var(--muted)'
                          }}>
                            {p.diferencia > 0 ? '+' : ''}{Math.round(p.diferencia)}
                          </td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ============================================ */}
        {/* PILOT PERFORMANCE */}
        {/* ============================================ */}
        {activeSection === 'pilots' && (
          <div className="deep-panel">
            <div className="deep-panel-title">
              🏎 {t('deepAnalytics.pilotPerformance')}
              <span className="deep-panel-title-sub">{t('deepAnalytics.variationExplain')}</span>
            </div>
            {pilotPerformance.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>{t('common.noData')}</div>
            ) : (
              <>
                {/* Top climbers & droppers */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  <div style={{ background: 'var(--green-dim)', border: '1px solid rgba(0,212,160,0.3)', borderRadius: 10, padding: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>🚀 {t('deepAnalytics.topClimber')}</div>
                    <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 22, fontWeight: 900, color: 'var(--green)' }}>
                      {pilotPerformance[0]?.nombre}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>{t('deepAnalytics.avgPositionsGained', { value: pilotPerformance[0]?.avgVariation })}</div>
                  </div>
                  <div style={{ background: 'var(--red-dim)', border: '1px solid rgba(232,0,45,0.3)', borderRadius: 10, padding: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>📉 {t('deepAnalytics.biggestDrop')}</div>
                    <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 22, fontWeight: 900, color: 'var(--red)' }}>
                      {pilotPerformance[pilotPerformance.length - 1]?.nombre}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>{t('deepAnalytics.avgPositionsLost', { value: pilotPerformance[pilotPerformance.length - 1]?.avgVariation })}</div>
                  </div>
                </div>

                <div className="pilot-grid">
                  {pilotPerformance.map(p => (
                    <div key={p.pilotoId} className="pilot-card">
                      <div style={{ flex: 1 }}>
                        <div className="pilot-name">{p.nombre}</div>
                        <div className="pilot-stat">{t('deepAnalytics.pilotStatLine', { races: p.racesCount, best: p.bestGain, worst: p.worstDrop })}</div>
                      </div>
                      <div className="pilot-variation" style={{
                        color: Number(p.avgVariation) > 0 ? 'var(--green)' : Number(p.avgVariation) < 0 ? 'var(--red)' : 'var(--muted)'
                      }}>
                        {Number(p.avgVariation) > 0 ? '↑' : Number(p.avgVariation) < 0 ? '↓' : '='}{Math.abs(p.avgVariation)}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ============================================ */}
        {/* USER STATS */}
        {/* ============================================ */}
        {activeSection === 'users' && (
          <div className="deep-panel">
            <div className="deep-panel-title">👤 {t('deepAnalytics.statsByPlayer')}</div>
            {userStats.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>{t('common.noData')}</div>
            ) : (
              <div className="user-stats-grid">
                {userStats.map((u, idx) => (
                  <div key={u.userId} className="user-stat-card">
                    <div className="user-stat-card-name">
                      {idx === 0 ? '🥇 ' : idx === 1 ? '🥈 ' : idx === 2 ? '🥉 ' : ''}{u.nombre}
                    </div>
                    <div className="user-stat-row">
                      <span className="user-stat-label">🏆 {t('deepAnalytics.victoriesLabel')}</span>
                      <span className="user-stat-value" style={{ color: 'var(--gold)' }}>{u.wins}</span>
                    </div>
                    <div className="user-stat-row">
                      <span className="user-stat-label">🥉 {t('deepAnalytics.podiumsLabel')}</span>
                      <span className="user-stat-value">{u.podiums}</span>
                    </div>
                    <div className="user-stat-row">
                      <span className="user-stat-label">{t('predictionAnalysis.totalPoints')}</span>
                      <span className="user-stat-value" style={{ color: 'var(--red)' }}>{Math.round(u.totalPuntos)}</span>
                    </div>
                    <div className="user-stat-row">
                      <span className="user-stat-label">{t('predictionAnalysis.avgPerRace')}</span>
                      <span className="user-stat-value">{u.avg} {t('common.pts')}</span>
                    </div>
                    <div className="user-stat-row">
                      <span className="user-stat-label">🏆 {t('predictionAnalysis.bestRaceLabel')}</span>
                      <span className="user-stat-value">{getRaceName({ nombre: u.bestRace.name, slug: u.bestRace.slug }, t)} ({Math.round(u.bestRace.puntos)})</span>
                    </div>
                    <div className="user-stat-row">
                      <span className="user-stat-label">😅 {t('deepAnalytics.worstRaceLabel')}</span>
                      <span className="user-stat-value">{getRaceName({ nombre: u.worstRace.name, slug: u.worstRace.slug }, t)} ({Math.round(u.worstRace.puntos)})</span>
                    </div>

                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                        📊 {t('deepAnalytics.preRaceVsReal')}
                      </div>
                      <div className="user-stat-row">
                        <span className="user-stat-label">{t('deepAnalytics.ptsIfQualEqualsResult')}</span>
                        <span className="user-stat-value" style={{ color: 'var(--muted)' }}>{u.totalPreRace}</span>
                      </div>
                      <div className="user-stat-row">
                        <span className="user-stat-label">{t('deepAnalytics.ptsRealLabel')}</span>
                        <span className="user-stat-value" style={{ color: 'var(--green)' }}>{Math.round(u.totalReal)}</span>
                      </div>
                      <div className="user-stat-row">
                        <span className="user-stat-label">{t('deepAnalytics.differenceColumn')}</span>
                        <span className="user-stat-value" style={{
                          color: u.preRaceDiff > 0 ? 'var(--green)' : u.preRaceDiff < 0 ? 'var(--red)' : 'var(--muted)'
                        }}>
                          {u.preRaceDiff > 0 ? '+' : ''}{Math.round(u.preRaceDiff)}
                        </span>
                      </div>
                    </div>

                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                      <div className="user-stat-row">
                        <span className="user-stat-label">📈 {t('deepAnalytics.trendLabel')}</span>
                        <span className="user-stat-value" style={{
                          color: u.trend > 0 ? 'var(--green)' : u.trend < 0 ? 'var(--red)' : 'var(--muted)'
                        }}>
                          {u.trend > 0 ? t('deepAnalytics.trendUp') : u.trend < 0 ? t('deepAnalytics.trendDown') : t('deepAnalytics.trendStable')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}