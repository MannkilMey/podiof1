import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useUserRaceDetails(groupId, userId) {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadDetails = async () => {
    if (!groupId || !userId) return;
    
    setLoading(true);
    try {
      // Obtener todas las carreras de la temporada del grupo
      const { data: group } = await supabase
        .from('groups')
        .select('temporada')
        .eq('id', groupId)
        .single();

      const { data: races } = await supabase
        .from('races')
        .select('id, nombre, numero_ronda, fecha_programada, estado')
        .eq('temporada', group.temporada)
        .order('numero_ronda', { ascending: true });

      // Obtener scores del usuario
      const { data: scores } = await supabase
        .from('scores')
        .select('carrera_id, puntos')
        .eq('grupo_id', groupId)
        .eq('usuario_id', userId);

      const scoresMap = {};
      scores?.forEach(s => {
        scoresMap[s.carrera_id] = s.puntos;
      });

      // Obtener predicciones del usuario
      const { data: predictions } = await supabase
        .from('predictions')
        .select('carrera_id, id')
        .eq('grupo_id', groupId)
        .eq('usuario_id', userId);

      const predictionsMap = new Set(predictions?.map(p => p.carrera_id) || []);

      // Combinar datos
      const raceDetails = races?.map(race => ({
        carrera_id: race.id,
        nombre: race.nombre,
        ronda: race.numero_ronda,
        fecha: race.fecha_programada,
        estado: race.estado,
        puntos: scoresMap[race.id] || 0,
        predijo: predictionsMap.has(race.id)
      })) || [];

      setDetails(raceDetails);
    } catch (err) {
      console.error('Error loading user race details:', err);
    } finally {
      setLoading(false);
    }
  };

  return { details, loading, loadDetails };
}