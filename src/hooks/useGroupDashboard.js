import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useGroupDashboard(groupId, userId) {
  const [data, setData] = useState({
    group: null,
    nextRace: null,
    leaderboard: [],
    leaderboardTotal: [],
    leaderboardRaces: [],
    leaderboardSprints: [],
    lastRace: null,
    pointsHistory: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!groupId || !userId) return;

    async function fetchDashboardData() {
      try {
        // ============================================
        // TANDA 1 — Las 4 no dependen de nada entre sí
        // ============================================
        const [
          { data: group, error: groupError },
          { data: membership },
          { data: scores },
          { data: predictions }
        ] = await Promise.all([
          supabase.from('groups').select('*').eq('id', groupId).single(),
          supabase
            .from('group_members')
            .select('es_admin')
            .eq('grupo_id', groupId)
            .eq('usuario_id', userId)
            .single(),
          supabase
            .from('scores')
            .select(`
              usuario_id,
              carrera_id,
              puntos,
              races:carrera_id (tipo)
            `)
            .eq('grupo_id', groupId),
          supabase
            .from('predictions')
            .select('usuario_id, posiciones, carrera_id')
            .eq('grupo_id', groupId)
        ]);

        if (groupError) throw groupError;

        const isAdmin = membership?.es_admin || group.creador_id === userId;

        // Insumos para la Tanda 2, calculados ahora que ya tenemos scores/predictions
        const uniqueUserIds = [...new Set((scores || []).map(s => s.usuario_id).filter(Boolean))];
        const carrerasSet = new Set((predictions || []).map(p => p.carrera_id).filter(Boolean));
        const carreras = Array.from(carrerasSet);

        // ============================================
        // TANDA 2 — Dependen de la Tanda 1, pero no entre sí
        // ============================================
        const [
          { data: nextRace },
          { data: lastRace },
          { data: profiles },
          { data: resultsData, error: resultsError }
        ] = await Promise.all([
          supabase
            .from('races')
            .select('*')
            .eq('temporada', group.temporada)
            .gte('fecha_programada', new Date().toISOString())
            .order('fecha_programada', { ascending: true })
            .limit(1)
            .maybeSingle(),
          supabase
            .from('races')
            .select('*')
            .eq('temporada', group.temporada)
            .eq('estado', 'finalizada')
            .order('fecha_programada', { ascending: false })
            .limit(1)
            .maybeSingle(),
          uniqueUserIds.length > 0
            ? supabase.rpc('get_public_names', { p_user_ids: uniqueUserIds })
            : Promise.resolve({ data: [] }),
          carreras.length > 0
            ? supabase
                .from('race_results')
                .select('carrera_id, piloto_id, posicion_final')
                .in('carrera_id', carreras)
            : Promise.resolve({ data: [], error: null })
        ]);

        if (resultsError) {
          console.error('Error fetching race results:', resultsError);
        }
        const results = resultsData || [];

        const nameMap = {};
        (profiles || []).forEach(p => {
          nameMap[p.id] = `${p.nombre || ''} ${p.apellido || ''}`.trim();
        });

        // ============================================
        // TANDA 3 — Solo si hay próxima carrera (depende de nextRace.id)
        // ============================================
        let userHasPredicted = false;
        let predictionStatus = null;

        if (nextRace) {
          const [{ data: prediction }, { data: statusData }] = await Promise.all([
            supabase
              .from('predictions')
              .select('id')
              .eq('grupo_id', groupId)
              .eq('carrera_id', nextRace.id)
              .eq('usuario_id', userId)
              .maybeSingle(),
            supabase.rpc('get_prediction_status', { p_grupo_id: groupId, p_carrera_id: nextRace.id })
          ]);

          userHasPredicted = !!prediction;
          predictionStatus = statusData?.[0] || null;
        }

        // ============================================
        // Procesamiento — idéntico al original, sin cambios de lógica
        // ============================================
        const userScoresTotal = {};
        const userScoresRaces = {};
        const userScoresSprints = {};

        scores?.forEach(s => {
          const raceType = s.races?.tipo || 'carrera';
          const puntos = parseFloat(s.puntos || 0);

          if (!userScoresTotal[s.usuario_id]) {
            userScoresTotal[s.usuario_id] = {
              userId: s.usuario_id,
              nombre: nameMap[s.usuario_id] || '',
              puntos: 0,
              exactos: 0
            };
          }
          userScoresTotal[s.usuario_id].puntos += puntos;

          if (raceType === 'carrera') {
            if (!userScoresRaces[s.usuario_id]) {
              userScoresRaces[s.usuario_id] = {
                userId: s.usuario_id,
                nombre: nameMap[s.usuario_id] || '',
                puntos: 0,
                exactos: 0
              };
            }
            userScoresRaces[s.usuario_id].puntos += puntos;
          }

          if (raceType === 'sprint') {
            if (!userScoresSprints[s.usuario_id]) {
              userScoresSprints[s.usuario_id] = {
                userId: s.usuario_id,
                nombre: nameMap[s.usuario_id] || '',
                puntos: 0,
                exactos: 0
              };
            }
            userScoresSprints[s.usuario_id].puntos += puntos;
          }
        });

        if (predictions && predictions.length > 0 && results.length > 0) {
          predictions.forEach(pred => {
            if (!pred.posiciones || !Array.isArray(pred.posiciones)) return;

            const raceResults = results.filter(r => r.carrera_id === pred.carrera_id);
            if (!raceResults || raceResults.length === 0) return;

            let exactCount = 0;
            pred.posiciones.forEach((pilotoId, idx) => {
              const realPosition = raceResults.find(r => r.piloto_id === pilotoId)?.posicion_final;
              if (realPosition === idx + 1) exactCount++;
            });

            if (userScoresTotal[pred.usuario_id]) {
              userScoresTotal[pred.usuario_id].exactos += exactCount;
            }
            if (userScoresRaces[pred.usuario_id]) {
              userScoresRaces[pred.usuario_id].exactos += exactCount;
            }
            if (userScoresSprints[pred.usuario_id]) {
              userScoresSprints[pred.usuario_id].exactos += exactCount;
            }
          });
        }

        const createLeaderboard = (userScores) => {
          return Object.values(userScores)
            .sort((a, b) => b.puntos - a.puntos)
            .map((user, idx) => ({
              ...user,
              position: idx + 1,
              isCurrentUser: user.userId === userId
            }));
        };

        const leaderboardTotal = createLeaderboard(userScoresTotal);
        const leaderboardRaces = createLeaderboard(userScoresRaces);
        const leaderboardSprints = createLeaderboard(userScoresSprints);

        setData({
          group: { ...group, isAdmin },
          nextRace: nextRace ? {
            ...nextRace,
            userHasPredicted,
            deadlineHours: group.horas_cierre_prediccion || 2,
            canPredict: predictionStatus?.can_predict || false,
            deadline: predictionStatus?.deadline || null
          } : null,
          leaderboard: leaderboardTotal,
          leaderboardTotal,
          leaderboardRaces,
          leaderboardSprints,
          lastRace,
          pointsHistory: [],
          loading: false,
          error: null
        });

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setData(prev => ({
          ...prev,
          loading: false,
          error: err.message
        }));
      }
    }

    fetchDashboardData();
  }, [groupId, userId]);

  return data;
}