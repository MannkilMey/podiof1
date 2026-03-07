import { subHours } from 'date-fns';

/**
 * Determina si se puede hacer predicción para una carrera
 * @param {Object} race - Objeto de la carrera
 * @param {Object} group - Objeto del grupo
 * @returns {Object} { canPredict: boolean, reason: string }
 */
export const canPredictRace = (race, group) => {
  const now = new Date();
  const raceStart = new Date(race.fecha_programada);
  
  // REGLA 1: NUNCA después de que comenzó la carrera
  if (now >= raceStart) {
    return {
      canPredict: false,
      reason: 'La carrera ya comenzó'
    };
  }
  
  // REGLA 2: Si admin habilitó predicciones forzadas → abierto hasta inicio
  if (race.predicciones_forzadas_abiertas === true) {
    return {
      canPredict: true,
      reason: 'Predicciones habilitadas por administrador',
      deadline: raceStart
    };
  }
  
  // REGLA 3: Deadline normal del grupo
  const horasCierre = group.horas_cierre_prediccion || 24;
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
