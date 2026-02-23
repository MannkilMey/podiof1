import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useLastRace(groupId, temporada) {
  const [lastRace, setLastRace] = useState(null);
  const [results, setResults] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [drivers, setDrivers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId || !temporada) return;

    async function fetchLastRace() {
      try {
        // 1. Obtener la última carrera completada de la temporada
        const { data: lastRaceData, error: raceError } = await supabase
          .from('races')
          .select('*')
          .eq('temporada', temporada)
          .eq('estado', 'finalizada')
          .order('fecha_programada', { ascending: false })
          .limit(1);

        // Si no hay error pero tampoco datos, no hay carreras finalizadas
        if (raceError || !lastRaceData || lastRaceData.length === 0) {
          setLastRace(null);
          setLoading(false);
          return;
        }

        // Tomar el primer elemento del array
        const race = lastRaceData[0];
        setLastRace(race);

        // 2. Obtener pilotos
        const { data: driversData } = await supabase
          .from('drivers')
          .select('*');

        const driversMap = {};
        driversData?.forEach(d => {
          driversMap[d.id] = d;
        });
        setDrivers(driversMap);

        // 3. Obtener resultados oficiales de esa carrera
        const { data: resultsData } = await supabase
          .from('race_results')
          .select('*')
          .eq('carrera_id', race.id)
          .order('posicion_final', { ascending: true });

        setResults(resultsData || []);

        // 4. Obtener TODAS las predicciones del grupo para esa carrera
        const { data: predictionsData } = await supabase
          .from('predictions')
          .select(`
            id,
            usuario_id,
            posiciones,
            users:usuario_id (
              nombre,
              apellido
            )
          `)
          .eq('grupo_id', groupId)
          .eq('carrera_id', race.id);

        // 5. Obtener scores de cada usuario en esa carrera
        const { data: scoresData } = await supabase
          .from('scores')
          .select('usuario_id, puntos')
          .eq('grupo_id', groupId)
          .eq('carrera_id', race.id);

        const scoresMap = {};
        scoresData?.forEach(s => {
          scoresMap[s.usuario_id] = s.puntos;
        });

        // Combinar predicciones con scores
        const predictionsWithScores = predictionsData?.map(pred => ({
          ...pred,
          puntos: scoresMap[pred.usuario_id] || 0,
          nombre: `${pred.users?.nombre || ''} ${pred.users?.apellido || ''}`.trim() || 'Usuario'
        })) || [];

        // Ordenar por puntos
        predictionsWithScores.sort((a, b) => b.puntos - a.puntos);

        setPredictions(predictionsWithScores);

      } catch (err) {
        console.error('Error fetching last race:', err);
        setLastRace(null);
      } finally {
        setLoading(false);
      }
    }

    fetchLastRace();
  }, [groupId, temporada]);

  return { lastRace, results, predictions, drivers, loading };
}