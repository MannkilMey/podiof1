const OPENF1_BASE_URL = 'https://api.openf1.org/v1';

/**
 * Obtener sesiones por año y tipo
 */
export async function getSessions(year, sessionType = 'Race') {
  const url = `${OPENF1_BASE_URL}/sessions?year=${year}&session_type=${sessionType}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Error fetching sessions');
  return await response.json();
}

/**
 * Buscar sesión específica por meeting_key y tipo
 */
export async function getSession(meetingKey, sessionType = 'Race') {
  const url = `${OPENF1_BASE_URL}/sessions?meeting_key=${meetingKey}&session_type=${sessionType}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Error fetching session');
  const data = await response.json();
  return data[0] || null;
}

/**
 * Obtener información de sesión por session_key
 */
export async function getSessionInfo(sessionKey) {
  const url = `${OPENF1_BASE_URL}/sessions?session_key=${sessionKey}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Error fetching session info');
  const data = await response.json();
  return data[0] || null;
}

/**
 * Obtener clasificación final de una sesión
 */
export async function getSessionResults(sessionKey) {
  const url = `${OPENF1_BASE_URL}/position?session_key=${sessionKey}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Error fetching positions');
  const positions = await response.json();
  
  if (positions.length === 0) {
    throw new Error('No se encontraron posiciones para esta sesión');
  }
  
  // Filtrar última posición de cada piloto
  const finalPositions = {};
  positions.forEach(pos => {
    const key = pos.driver_number;
    if (!finalPositions[key] || new Date(pos.date) > new Date(finalPositions[key].date)) {
      finalPositions[key] = pos;
    }
  });
  
  return Object.values(finalPositions)
    .filter(p => p.position > 0) // Filtrar posiciones inválidas
    .sort((a, b) => a.position - b.position);
}

/**
 * Obtener vueltas de una sesión (para vuelta rápida)
 */
export async function getSessionLaps(sessionKey) {
  const url = `${OPENF1_BASE_URL}/laps?session_key=${sessionKey}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Error fetching laps');
  return await response.json();
}

/**
 * Encontrar vuelta más rápida de la carrera
 */
export function findFastestLap(laps) {
  const validLaps = laps.filter(lap => 
    lap.lap_duration && 
    lap.lap_duration > 0 && 
    !lap.is_pit_out_lap &&
    lap.segments_sector_1 && // Tiene datos de sectores (vuelta completa)
    lap.segments_sector_2 &&
    lap.segments_sector_3
  );
  
  if (validLaps.length === 0) return null;
  
  return validLaps.reduce((fastest, current) => 
    current.lap_duration < fastest.lap_duration ? current : fastest
  );
}

/**
 * Obtener pilotos de una sesión
 */
export async function getSessionDrivers(sessionKey) {
  const url = `${OPENF1_BASE_URL}/drivers?session_key=${sessionKey}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Error fetching drivers');
  return await response.json();
}

/**
 * Buscar sesiones que coincidan con una carrera
 */
export async function findSessionByRace(raceName, raceDate, year) {
  const sessions = await getSessions(year, 'Race');
  
  // Normalizar nombre para comparación
  const normalizedRaceName = raceName.toLowerCase()
    .replace(/gran premio de /i, '')
    .replace(/grand prix/i, '')
    .replace(/gp /i, '')
    .trim();
  
  const targetDate = new Date(raceDate);
  
  // Buscar coincidencia por nombre o fecha cercana (±7 días)
  const matches = sessions.filter(session => {
    const sessionLocation = (session.location || session.country_name || '').toLowerCase();
    const sessionDate = new Date(session.date_start);
    const daysDiff = Math.abs((targetDate - sessionDate) / (1000 * 60 * 60 * 24));
    
    const nameMatch = sessionLocation.includes(normalizedRaceName) || 
                     normalizedRaceName.includes(sessionLocation);
    
    return nameMatch || daysDiff <= 7;
  });
  
  // Ordenar por fecha más cercana
  return matches.sort((a, b) => {
    const dateA = new Date(a.date_start);
    const dateB = new Date(b.date_start);
    const diffA = Math.abs(targetDate - dateA);
    const diffB = Math.abs(targetDate - dateB);
    return diffA - diffB;
  });
}