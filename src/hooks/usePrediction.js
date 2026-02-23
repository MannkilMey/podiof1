import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function usePrediction(groupId, raceId, userId) {
  const [data, setData] = useState({
    drivers: [],
    group: null,
    race: null,
    existingPrediction: null,
    canPredict: false,
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!groupId || !raceId || !userId) return;

    async function fetchData() {
      try {
        // 1. Obtener info del grupo
        const { data: group, error: groupError } = await supabase
          .from('groups')
          .select('*')
          .eq('id', groupId)
          .single();

        if (groupError) throw groupError;

        // 2. Obtener info de la carrera
        const { data: race, error: raceError } = await supabase
          .from('races')
          .select('*')
          .eq('id', raceId)
          .single();

        if (raceError) throw raceError;

        // 3. Verificar si puede predecir
        const now = new Date();
        const raceDate = new Date(race.fecha_programada);
        const deadlineDate = new Date(raceDate.getTime() - (group.horas_cierre_prediccion * 60 * 60 * 1000));
        
        const canPredict = now < deadlineDate && now < raceDate;

        // 4. Obtener pilotos de la temporada (con JOIN a drivers y teams)
        const { data: driversData, error: driversError } = await supabase
          .from('drivers_season')
          .select(`
            piloto_id,
            numero_auto,
            escuderia_id,
            drivers:piloto_id (
              id,
              nombre_completo,
              acronimo,
              numero,
              nacionalidad
            ),
            teams:escuderia_id (
              id,
              nombre,
              color_principal
            )
          `)
          .eq('temporada', group.temporada);

        if (driversError) throw driversError;

        // 5. Verificar si ya existe una predicción
        const { data: prediction } = await supabase
          .from('predictions')
          .select('*')
          .eq('grupo_id', groupId)
          .eq('carrera_id', raceId)
          .eq('usuario_id', userId)
          .maybeSingle();

        // 6. Mapear datos (incluir equipoId para bonus de escudería)
        const mappedDrivers = driversData.map(d => ({
          id: d.drivers.id,
          nombre: d.drivers.nombre_completo,
          numero: d.numero_auto || d.drivers.numero,
          acronimo: d.drivers.acronimo,
          nacionalidad: d.drivers.nacionalidad,
          equipo: d.teams?.nombre || 'Sin equipo',
          equipoId: d.escuderia_id,  // ID del equipo para bonus
          color: d.teams?.color_principal || '#CCCCCC'
        }));

        setData({
          drivers: mappedDrivers,
          group,
          race,
          existingPrediction: prediction,
          canPredict,
          loading: false,
          error: null
        });

      } catch (err) {
        console.error('Error fetching prediction data:', err);
        setData(prev => ({
          ...prev,
          loading: false,
          error: err.message
        }));
      }
    }

    fetchData();
  }, [groupId, raceId, userId]);

  return data;
}