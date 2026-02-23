import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useGroupDashboard(groupId, userId) {
  const [data, setData] = useState({
    group: null,
    nextRace: null,
    leaderboard: [],
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

        // 5. Obtener leaderboard
        const { data: scores } = await supabase
          .from('scores')
          .select(`
            usuario_id,
            puntos,
            users (nombre, apellido)
          `)
          .eq('grupo_id', groupId);

        // Agrupar puntos por usuario
        const userScores = {};
        scores?.forEach(s => {
          if (!userScores[s.usuario_id]) {
            userScores[s.usuario_id] = {
              userId: s.usuario_id,
              nombre: `${s.users.nombre || ''} ${s.users.apellido || ''}`.trim() || 'Usuario',
              puntos: 0,
              exactos: 0
            };
          }
          userScores[s.usuario_id].puntos += parseFloat(s.puntos || 0);
        });

        // Contar predicciones exactas
        const { data: predictions } = await supabase
          .from('predictions')
          .select('usuario_id, posiciones, carrera_id')
          .eq('grupo_id', groupId);

        // Solo buscar resultados si hay predicciones
        let results = [];
        if (predictions && predictions.length > 0) {
          // Obtener IDs únicos de carreras
          const carrerasSet = new Set(predictions.map(p => p.carrera_id).filter(Boolean));
          const carreras = Array.from(carrerasSet);
          
          // Solo hacer la consulta si hay carreras válidas
          if (carreras.length > 0) {
            const { data: resultsData, error: resultsError } = await supabase
              .from('race_results')
              .select('carrera_id, piloto_id, posicion_final')  // ← CORREGIDO
              .in('carrera_id', carreras);
            
            if (resultsError) {
              console.error('Error fetching race results:', resultsError);
            } else {
              results = resultsData || [];
            }
          }
        }

        // Calcular exactos
        if (predictions && predictions.length > 0 && results.length > 0) {
          predictions.forEach(pred => {
            if (!pred.posiciones || !Array.isArray(pred.posiciones)) return;
            
            const raceResults = results.filter(r => r.carrera_id === pred.carrera_id);
            if (!raceResults || raceResults.length === 0) return;

            let exactCount = 0;
            pred.posiciones.forEach((pilotoId, idx) => {
              const realPosition = raceResults.find(r => r.piloto_id === pilotoId)?.posicion_final;  // ← CORREGIDO
              if (realPosition === idx + 1) exactCount++;
            });

            if (userScores[pred.usuario_id]) {
              userScores[pred.usuario_id].exactos += exactCount;
            }
          });
        }

        // Convertir a array y ordenar
        const leaderboard = Object.values(userScores)
          .sort((a, b) => b.puntos - a.puntos)
          .map((user, idx) => ({
            ...user,
            position: idx + 1,
            isCurrentUser: user.userId === userId
          }));

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
          leaderboard,
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