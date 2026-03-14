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
        // 1. Obtener info del grupo
        const { data: group, error: groupError } = await supabase
          .from('groups')
          .select('*')
          .eq('id', groupId)
          .single();

        if (groupError) throw groupError;

        // 2. Verificar si es admin
        const { data: membership } = await supabase
          .from('group_members')
          .select('es_admin')
          .eq('grupo_id', groupId)
          .eq('usuario_id', userId)
          .single();

        const isAdmin = membership?.es_admin || group.creador_id === userId;

        // 3. Obtener próxima carrera
        const { data: nextRace } = await supabase
          .from('races')
          .select('*')
          .eq('temporada', group.temporada)
          .gte('fecha_programada', new Date().toISOString())
          .order('fecha_programada', { ascending: true })
          .limit(1)
          .maybeSingle();

        // 4. Verificar si el usuario ya predijo
        let userHasPredicted = false;
        if (nextRace) {
          const { data: prediction } = await supabase
            .from('predictions')
            .select('id')
            .eq('grupo_id', groupId)
            .eq('carrera_id', nextRace.id)
            .eq('usuario_id', userId)
            .maybeSingle();

          userHasPredicted = !!prediction;
        }

        // 5. ✅ NUEVO: Obtener scores CON tipo de carrera
        const { data: scores } = await supabase
          .from('scores')
          .select(`
            usuario_id,
            carrera_id,
            puntos,
            users (nombre, apellido),
            races:carrera_id (tipo)
          `)
          .eq('grupo_id', groupId);

        // ✅ NUEVO: Agrupar puntos por usuario Y por tipo
        const userScoresTotal = {};
        const userScoresRaces = {};
        const userScoresSprints = {};

        scores?.forEach(s => {
          const raceType = s.races?.tipo || 'carrera';
          const puntos = parseFloat(s.puntos || 0);

          // Total (todos)
          if (!userScoresTotal[s.usuario_id]) {
            userScoresTotal[s.usuario_id] = {
              userId: s.usuario_id,
              nombre: `${s.users.nombre || ''} ${s.users.apellido || ''}`.trim() || 'Usuario',
              puntos: 0,
              exactos: 0
            };
          }
          userScoresTotal[s.usuario_id].puntos += puntos;

          // Solo carreras
          if (raceType === 'carrera') {
            if (!userScoresRaces[s.usuario_id]) {
              userScoresRaces[s.usuario_id] = {
                userId: s.usuario_id,
                nombre: `${s.users.nombre || ''} ${s.users.apellido || ''}`.trim() || 'Usuario',
                puntos: 0,
                exactos: 0
              };
            }
            userScoresRaces[s.usuario_id].puntos += puntos;
          }

          // Solo sprints
          if (raceType === 'sprint') {
            if (!userScoresSprints[s.usuario_id]) {
              userScoresSprints[s.usuario_id] = {
                userId: s.usuario_id,
                nombre: `${s.users.nombre || ''} ${s.users.apellido || ''}`.trim() || 'Usuario',
                puntos: 0,
                exactos: 0
              };
            }
            userScoresSprints[s.usuario_id].puntos += puntos;
          }
        });

        // Contar predicciones exactas
        const { data: predictions } = await supabase
          .from('predictions')
          .select('usuario_id, posiciones, carrera_id')
          .eq('grupo_id', groupId);

        // Solo buscar resultados si hay predicciones
        let results = [];
        if (predictions && predictions.length > 0) {
          const carrerasSet = new Set(predictions.map(p => p.carrera_id).filter(Boolean));
          const carreras = Array.from(carrerasSet);
          
          if (carreras.length > 0) {
            const { data: resultsData, error: resultsError } = await supabase
              .from('race_results')
              .select('carrera_id, piloto_id, posicion_final')
              .in('carrera_id', carreras);
            
            if (resultsError) {
              console.error('Error fetching race results:', resultsError);
            } else {
              results = resultsData || [];
            }
          }
        }

        // Calcular exactos (aplica a todos los tipos)
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

            // Agregar exactos a todos los leaderboards
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

        // ✅ NUEVO: Crear 3 leaderboards
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

        // 6. Última carrera completada
        const { data: lastRace } = await supabase
          .from('races')
          .select('*')
          .eq('temporada', group.temporada)
          .eq('estado', 'finalizada')
          .order('fecha_programada', { ascending: false })
          .limit(1)
          .maybeSingle();

        // Actualizar estado
        setData({
          group: { ...group, isAdmin },
          nextRace: nextRace ? {
            ...nextRace,
            userHasPredicted,
            deadlineHours: group.horas_cierre_prediccion || 2
          } : null,
          leaderboard: leaderboardTotal, // Legacy (retrocompatibilidad)
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