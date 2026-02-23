import { supabase } from '../lib/supabase';
import * as openf1 from './openf1';

/**
 * Obtener puntos F1 por posición
 */
function getPuntosByPosition(position) {
  const points = {
    1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
    6: 8, 7: 6, 8: 4, 9: 2, 10: 1
  };
  return points[position] || 0;
}

/**
 * Importar resultados completos de una carrera desde OpenF1
 */
export async function importRaceResults(raceId, sessionKey) {
  try {
    console.log(`🏁 Importando resultados para carrera ${raceId} desde sesión ${sessionKey}`);
    
    // 1. Verificar que la sesión existe y está finalizada
    const sessionInfo = await openf1.getSessionInfo(sessionKey);
    if (!sessionInfo) {
      throw new Error('Sesión no encontrada en OpenF1');
    }
    
    console.log('📊 Sesión encontrada:', sessionInfo.session_name, sessionInfo.location);
    
    // 2. Obtener datos de OpenF1
    const [positions, laps] = await Promise.all([
      openf1.getSessionResults(sessionKey),
      openf1.getSessionLaps(sessionKey)
    ]);
    
    console.log('✅ Datos obtenidos:', {
      positions: positions.length,
      laps: laps.length
    });
    
    if (positions.length === 0) {
      throw new Error('No hay posiciones finales disponibles para esta sesión');
    }
    
    // 3. Encontrar vuelta más rápida
    const fastestLap = openf1.findFastestLap(laps);
    const fastestLapDriverNumber = fastestLap?.driver_number;
    
    console.log('⚡ Vuelta más rápida:', {
      driver: fastestLapDriverNumber,
      time: fastestLap?.lap_duration
    });
    
    // 4. Obtener mapeo de pilotos (número → UUID)
    const { data: dbDrivers, error: driversError } = await supabase
      .from('drivers')
      .select('id, numero, openf1_driver_number, nombre_completo');
    
    if (driversError) throw driversError;
    
    // Crear mapeo: priorizar openf1_driver_number, sino usar numero
    const driverMap = {};
    dbDrivers.forEach(driver => {
      const num = driver.openf1_driver_number || driver.numero;
      if (num) {
        driverMap[num] = {
          id: driver.id,
          nombre: driver.nombre_completo
        };
      }
    });
    
    console.log('👥 Pilotos mapeados:', Object.keys(driverMap).length);
    
    // 5. Preparar datos para inserción
    const results = [];
    const unmappedDrivers = [];
    
    positions.forEach(pos => {
      const driverData = driverMap[pos.driver_number];
      
      if (!driverData) {
        unmappedDrivers.push(pos.driver_number);
        console.warn(`⚠️ Piloto no encontrado en BD: #${pos.driver_number}`);
        return;
      }
      
      results.push({
        carrera_id: raceId,
        piloto_id: driverData.id,
        posicion_final: pos.position,
        puntos_f1: getPuntosByPosition(pos.position),
        estado_carrera: 'finalizado',
        vuelta_rapida: pos.driver_number === fastestLapDriverNumber,
        clasificacion_status: 'Finished'
      });
    });
    
    if (unmappedDrivers.length > 0) {
      console.error('❌ Pilotos sin mapear:', unmappedDrivers);
      throw new Error(`No se pudieron mapear los pilotos: ${unmappedDrivers.join(', ')}`);
    }
    
    console.log('📝 Resultados preparados:', results.length);
    
    // 6. Eliminar resultados existentes
    const { error: deleteError } = await supabase
      .from('race_results')
      .delete()
      .eq('carrera_id', raceId);
    
    if (deleteError) throw deleteError;
    
    console.log('🗑️ Resultados anteriores eliminados');
    
    // 7. Insertar nuevos resultados
    const { data: insertedResults, error: insertError } = await supabase
      .from('race_results')
      .insert(results)
      .select();
    
    if (insertError) throw insertError;
    
    console.log('💾 Resultados insertados:', insertedResults.length);
    
    // 8. Marcar carrera como importada
    const { error: updateError } = await supabase
      .from('races')
      .update({
        openf1_session_key: sessionKey,
        openf1_meeting_key: sessionInfo.meeting_key,
        resultados_importados: true,
        fecha_importacion: new Date().toISOString()
      })
      .eq('id', raceId);
    
    if (updateError) throw updateError;
    
    console.log('✅ Carrera marcada como importada');
    
    // 9. Calcular puntos de todas las predicciones de esta carrera
    const { data: predictions } = await supabase
      .from('predictions')
      .select('id')
      .eq('carrera_id', raceId);
    
    if (predictions && predictions.length > 0) {
      console.log(`🎯 Calculando puntos de ${predictions.length} predicciones...`);
      
      for (const pred of predictions) {
        await supabase.rpc('calcular_puntos_prediccion', {
          p_prediccion_id: pred.id
        });
      }
      
      console.log('✅ Puntos calculados');
    }
    
    return {
      success: true,
      resultsCount: insertedResults.length,
      fastestLapDriver: fastestLapDriverNumber,
      predictionsUpdated: predictions?.length || 0,
      sessionInfo: {
        name: sessionInfo.session_name,
        location: sessionInfo.location,
        date: sessionInfo.date_start
      }
    };
    
  } catch (error) {
    console.error('❌ Error importando resultados:', error);
    throw error;
  }
}

/**
 * Importar posiciones de parrilla (qualifying)
 */
export async function importQualifyingResults(raceId, meetingKey) {
  try {
    console.log(`🏁 Importando qualifying para carrera ${raceId}, meeting ${meetingKey}`);
    
    // Obtener sesión de qualifying
    const qualifyingSession = await openf1.getSession(meetingKey, 'Qualifying');
    
    if (!qualifyingSession) {
      throw new Error('Sesión de qualifying no encontrada');
    }
    
    console.log('📊 Qualifying encontrado:', qualifyingSession.session_name);
    
    const positions = await openf1.getSessionResults(qualifyingSession.session_key);
    
    console.log('✅ Posiciones obtenidas:', positions.length);
    
    // Mapeo de pilotos
    const { data: dbDrivers } = await supabase
      .from('drivers')
      .select('id, numero, openf1_driver_number');
    
    const driverMap = {};
    dbDrivers.forEach(driver => {
      const num = driver.openf1_driver_number || driver.numero;
      if (num) driverMap[num] = driver.id;
    });
    
    // Actualizar posiciones de parrilla en race_results
    let updated = 0;
    for (const pos of positions) {
      const driverId = driverMap[pos.driver_number];
      if (!driverId) {
        console.warn(`⚠️ Piloto no encontrado: #${pos.driver_number}`);
        continue;
      }
      
      const { error } = await supabase
        .from('race_results')
        .update({ posicion_parrilla: pos.position })
        .eq('carrera_id', raceId)
        .eq('piloto_id', driverId);
      
      if (!error) updated++;
    }
    
    console.log(`✅ Parrillas actualizadas: ${updated}`);
    
    return { 
      success: true, 
      count: updated,
      total: positions.length 
    };
    
  } catch (error) {
    console.error('❌ Error importando qualifying:', error);
    throw error;
  }
}

/**
 * Buscar y sugerir sesiones para una carrera
 */
export async function findSessionsForRace(raceName, raceDate, year) {
  try {
    const matches = await openf1.findSessionByRace(raceName, raceDate, year);
    
    return matches.map(session => ({
      sessionKey: session.session_key,
      meetingKey: session.meeting_key,
      name: session.session_name,
      location: session.location || session.country_name,
      date: session.date_start,
      circuit: session.circuit_short_name
    }));
    
  } catch (error) {
    console.error('Error buscando sesiones:', error);
    throw error;
  }
}