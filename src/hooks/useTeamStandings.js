import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useTeamStandings(temporada) {
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
          // NO HAY CARRERAS FINALIZADAS - Mostrar equipos con 0 puntos
          const { data: teamsData } = await supabase
            .from('teams')
            .select('id, nombre')
            .order('nombre');

          const standingsArray = teamsData?.map((team, idx) => ({
            equipo_id: team.id,
            nombre: team.nombre,
            puntos: 0,
            carreras: 0,
            position: idx + 1
          })) || [];

          setStandings(standingsArray);
          setLoading(false);
          return;
        }

        // SÍ HAY CARRERAS FINALIZADAS - Calcular puntos reales
        const raceIds = finishedRaces.map(r => r.id);

        // Obtener todos los resultados con info de pilotos
        const { data: results } = await supabase
          .from('race_results')
          .select(`
            piloto_id,
            puntos_f1,
            drivers:piloto_id (
              id
            )
          `)
          .in('carrera_id', raceIds);

        // Obtener relación piloto-equipo para esta temporada
        const pilotosIds = [...new Set(results?.map(r => r.piloto_id))];
        
        const { data: driversSeasonData } = await supabase
          .from('drivers_season')
          .select(`
            piloto_id,
            escuderia_id,
            teams:escuderia_id (
              id,
              nombre
            )
          `)
          .eq('temporada', temporada)
          .in('piloto_id', pilotosIds);

        // Mapear piloto -> equipo
        const teamByDriver = {};
        driversSeasonData?.forEach(ds => {
          teamByDriver[ds.piloto_id] = {
            id: ds.escuderia_id,
            nombre: ds.teams?.nombre
          };
        });

        // Agrupar puntos por equipo
        const teamPoints = {};
        
        results?.forEach(result => {
          const team = teamByDriver[result.piloto_id];
          if (!team) return;

          if (!teamPoints[team.id]) {
            teamPoints[team.id] = {
              equipo_id: team.id,
              nombre: team.nombre,
              puntos: 0,
              carreras: new Set()
            };
          }
          
          teamPoints[team.id].puntos += parseFloat(result.puntos_f1 || 0);
          teamPoints[team.id].carreras.add(result.piloto_id);
        });

        // Convertir a array y ordenar
        const standingsArray = Object.values(teamPoints)
          .map(team => ({
            ...team,
            carreras: finishedRaces.length
          }))
          .sort((a, b) => b.puntos - a.puntos)
          .map((team, idx) => ({
            ...team,
            position: idx + 1
          }));

        setStandings(standingsArray);

      } catch (err) {
        console.error('Error fetching team standings:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStandings();
  }, [temporada]);

  return { standings, loading };
}