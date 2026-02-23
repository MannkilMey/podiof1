import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useDriverStandings(temporada) {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!temporada) return;

    async function fetchStandings() {
      try {
        // 1. Verificar si hay carreras finalizadas
        const { data: finishedRaces } = await supabase
          .from('races')
          .select('id')
          .eq('temporada', temporada)
          .eq('estado', 'finalizada');

        const hasFinishedRaces = finishedRaces && finishedRaces.length > 0;

        if (!hasFinishedRaces) {
          // NO HAY CARRERAS FINALIZADAS - Mostrar pilotos con 0 puntos
          const { data: driversData } = await supabase
            .from('drivers_season')
            .select(`
              piloto_id,
              numero_auto,
              drivers:piloto_id (
                id,
                nombre_completo,
                numero,
                acronimo
              ),
              teams:escuderia_id (
                nombre
              )
            `)
            .eq('temporada', temporada);

          const standingsArray = driversData?.map((ds, idx) => ({
            piloto_id: ds.piloto_id,
            nombre_completo: ds.drivers?.nombre_completo || 'Desconocido',
            acronimo: ds.drivers?.acronimo || '',
            numero: ds.numero_auto || ds.drivers?.numero || 0,
            equipo: ds.teams?.nombre || 'N/A',
            puntos: 0,
            carreras: 0,
            position: idx + 1
          })) || [];

          standingsArray.sort((a, b) => a.numero - b.numero);
          standingsArray.forEach((driver, idx) => {
            driver.position = idx + 1;
          });

          setStandings(standingsArray);
          setLoading(false);
          return;
        }

        // SÍ HAY CARRERAS FINALIZADAS - Calcular puntos reales
        const raceIds = finishedRaces.map(r => r.id);

        const { data: results, error } = await supabase
          .from('race_results')
          .select(`
            piloto_id,
            puntos_f1,
            drivers:piloto_id (
              id,
              nombre_completo,
              numero,
              acronimo
            )
          `)
          .in('carrera_id', raceIds);

        if (error) throw error;

        // Obtener equipos
        const pilotosIds = [...new Set(results?.map(r => r.piloto_id))];
        
        const { data: driversSeasonData } = await supabase
          .from('drivers_season')
          .select(`
            piloto_id,
            teams:escuderia_id (
              nombre
            )
          `)
          .eq('temporada', temporada)
          .in('piloto_id', pilotosIds);

        const teamsByDriver = {};
        driversSeasonData?.forEach(ds => {
          teamsByDriver[ds.piloto_id] = ds.teams?.nombre || 'N/A';
        });

        // Agrupar por piloto
        const driverPoints = {};
        
        results?.forEach(result => {
          const pilotoId = result.piloto_id;
          const driver = result.drivers;
          
          if (!driverPoints[pilotoId]) {
            driverPoints[pilotoId] = {
              piloto_id: pilotoId,
              nombre_completo: driver?.nombre_completo || 'Desconocido',
              acronimo: driver?.acronimo || '',
              numero: driver?.numero || 0,
              equipo: teamsByDriver[pilotoId] || 'N/A',
              puntos: 0,
              carreras: 0
            };
          }
          
          driverPoints[pilotoId].puntos += parseFloat(result.puntos_f1 || 0);
          driverPoints[pilotoId].carreras += 1;
        });

        const standingsArray = Object.values(driverPoints)
          .sort((a, b) => b.puntos - a.puntos)
          .map((driver, idx) => ({
            ...driver,
            position: idx + 1
          }));

        setStandings(standingsArray);

      } catch (err) {
        console.error('Error fetching driver standings:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStandings();
  }, [temporada]);

  return { standings, loading };
}