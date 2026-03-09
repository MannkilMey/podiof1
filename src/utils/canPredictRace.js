import { subHours } from 'date-fns';
import { supabase } from '../lib/supabase';

/**
 * Determina si se puede hacer predicción para una carrera
 * 
 * @param {Object} race - Objeto de la carrera
 * @param {Object} group - Objeto del grupo
 * @param {string} groupId - ID del grupo (opcional, si no se pasa group)
 * @returns {Promise<Object>} { canPredict: boolean, reason: string, deadline?: Date }
 */
export const canPredictRace = async (race, group, groupId = null) => {
  const now = new Date();
  const raceStart = new Date(race.fecha_programada);
  
  // ════════════════════════════════════════════════════════════════════
  // REGLA 1: NUNCA después de que comenzó la carrera
  // ════════════════════════════════════════════════════════════════════
  if (now >= raceStart) {
    return {
      canPredict: false,
      reason: 'La carrera ya comenzó'
    };
  }
  
  // ════════════════════════════════════════════════════════════════════
  // REGLA 2: Verificar configuración específica del grupo
  // ════════════════════════════════════════════════════════════════════
  
  const currentGroupId = groupId || group?.id;
  let isForcedOpen = race.predicciones_forzadas_abiertas || false;
  
  if (currentGroupId && race.id) {
    try {
      // 🆕 Buscar configuración específica del grupo
      const { data: groupRaceConfig, error } = await supabase
        .from('group_races')
        .select('predicciones_forzadas_abiertas')
        .eq('grupo_id', currentGroupId)
        .eq('carrera_id', race.id)
        .maybeSingle();
      
      // Si hay configuración específica del grupo, tiene prioridad
      if (!error && groupRaceConfig) {
        isForcedOpen = groupRaceConfig.predicciones_forzadas_abiertas;
      }
    } catch (err) {
      console.error('Error fetching group race config:', err);
      // Si hay error, continuar con el valor de race (fallback)
    }
  }
  
  // Si está forzado abierto (ya sea por grupo o global), permitir hasta inicio
  if (isForcedOpen) {
    return {
      canPredict: true,
      reason: 'Predicciones habilitadas por administrador',
      deadline: raceStart
    };
  }
  
  // ════════════════════════════════════════════════════════════════════
  // REGLA 3: Deadline normal del grupo
  // ════════════════════════════════════════════════════════════════════
  
  const horasCierre = group?.horas_cierre_prediccion || 24;
  const deadline = subHours(raceStart, horasCierre);
  
  if (now < deadline) {
    return {
      canPredict: true,
      reason: `Cierra ${horasCierre}h antes`,
      deadline: deadline
    };
  }
  
  return {
    canPredict: false,
    reason: `Predicciones cerradas (${horasCierre}h antes)`
  };
};



export const canPredictRaceSync = (race, group) => {
  const now = new Date();
  const raceStart = new Date(race.fecha_programada);
  
  if (now >= raceStart) {
    return {
      canPredict: false,
      reason: 'La carrera ya comenzó'
    };
  }
  
  // Solo considera el valor global (no group_races)
  if (race.predicciones_forzadas_abiertas === true) {
    return {
      canPredict: true,
      reason: 'Predicciones habilitadas por administrador',
      deadline: raceStart
    };
  }
  
  const horasCierre = group?.horas_cierre_prediccion || 24;
  const deadline = subHours(raceStart, horasCierre);
  
  if (now < deadline) {
    return {
      canPredict: true,
      reason: `Cierra ${horasCierre}h antes`,
      deadline: deadline
    };
  }
  
  return {
    canPredict: false,
    reason: `Predicciones cerradas (${horasCierre}h antes)`
  };
};