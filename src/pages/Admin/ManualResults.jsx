import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');`;

const CSS = `
[data-theme="dark"] {
  --bg: #0A0A0C; --bg2: #111114; --bg3: #18181D; --bg4: #1E1E24;
  --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.13);
  --red: #E8002D; --red-dim: rgba(232,0,45,0.13);
  --white: #F0F0F0; --muted: rgba(240,240,240,0.40);
  --gold: #C9A84C; --green: #00D4A0;
}

[data-theme="light"] {
  --bg: #F5F6F8; --bg2: #FFFFFF; --bg3: #E8EAEE; --bg4: #DFE1E6;
  --border: rgba(0,0,0,0.10); --border2: rgba(0,0,0,0.18);
  --red: #D40029; --red-dim: rgba(212,0,41,0.08);
  --white: #1A1B1E; --muted: rgba(26,27,30,0.55);
  --gold: #9C6F10; --green: #007F5F;
}

html, body { background: var(--bg); color: var(--white); }
#root { background: var(--bg); }

.manual-results-page {
  background: var(--bg);
  padding: 24px 28px;
  max-width: 1000px;
  margin: 0 auto;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 32px;
}

.back-btn {
  background: transparent;
  border: none;
  color: var(--red);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  transition: opacity 0.2s;
}

.back-btn:hover { opacity: 0.7; }

.page-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 32px;
  font-weight: 900;
  color: var(--white);
  margin-bottom: 8px;
}

.page-subtitle {
  color: var(--muted);
  font-size: 14px;
}

.race-info-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 24px;
}

.race-badge-sprint {
  background: linear-gradient(135deg, #FFB800, #FF8C00);
  color: #000;
  font-weight: 900;
  padding: 6px 14px;
  border-radius: 10px;
  display: inline-block;
  margin-bottom: 12px;
  font-size: 13px;
  letter-spacing: 1px;
}

.race-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.info-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--white);
}

.positions-section {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 24px;
}

.section-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: var(--white);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.position-row {
  display: grid;
  grid-template-columns: 60px 1fr 100px;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
  padding: 12px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 10px;
}

.position-number {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 24px;
  font-weight: 900;
  color: var(--white);
  text-align: center;
}

.position-number.podium {
  color: var(--gold);
}

.driver-select {
  width: 100%;
  padding: 10px 14px;
  background: var(--bg);
  border: 1px solid var(--border2);
  border-radius: 8px;
  color: var(--white);
  font-size: 14px;
  cursor: pointer;
  font-family: 'Barlow', sans-serif;
}

.driver-select:focus {
  outline: none;
  border-color: var(--red);
}

.fastest-lap-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
}

.fastest-lap-checkbox input {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.fastest-lap-section {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.actions {
  display: flex;
  gap: 12px;
}

.btn-save {
  flex: 1;
  padding: 16px;
  background: linear-gradient(135deg, var(--red), #FF3355);
  border: none;
  border-radius: 12px;
  color: white;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
}

.btn-save:hover {
  opacity: 0.88;
  transform: translateY(-2px);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-cancel {
  flex: 1;
  padding: 16px;
  background: transparent;
  border: 2px solid var(--border);
  border-radius: 12px;
  color: var(--white);
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  border-color: var(--red);
  color: var(--red);
  background: var(--red-dim);
}

.loading-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--muted);
}

.error-message {
  background: rgba(232, 0, 45, 0.1);
  border: 1px solid rgba(232, 0, 45, 0.3);
  border-radius: 12px;
  padding: 16px;
  color: var(--red);
  margin-bottom: 24px;
  font-size: 14px;
}

.warning-box {
  background: rgba(255, 184, 0, 0.1);
  border: 1px solid rgba(255, 184, 0, 0.3);
  border-radius: 12px;
  padding: 16px;
  color: #FFB800;
  margin-bottom: 24px;
  font-size: 13px;
  line-height: 1.6;
}
`;

export default function ManualResults() {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);

  const [race, setRace] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [fastestLapDriverId, setFastestLapDriverId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [raceId]);

  const loadData = async () => {
  try {
    setLoading(true);

    // Cargar carrera
    const { data: raceData, error: raceError } = await supabase
      .from('races')
      .select('*')
      .eq('id', raceId)
      .single();

    if (raceError) throw raceError;
    setRace(raceData);

    // ✅ NUEVO: Determinar cantidad de posiciones según tipo
    const isSprint = raceData.tipo === 'sprint';
    const maxPositions = isSprint ? 8 : 22; // 8 para Sprint, 22 para Carrera

    // Cargar pilotos de la temporada
    const { data: driversData, error: driversError } = await supabase
      .from('drivers_season')
      .select(`
        piloto_id,
        numero_auto,
        drivers:piloto_id (
          id,
          nombre_completo,
          numero
        )
      `)
      .eq('temporada', raceData.temporada);

    if (driversError) throw driversError;

    const mappedDrivers = driversData.map(d => ({
      id: d.drivers.id,
      nombre: d.drivers.nombre_completo,
      numero: d.numero_auto || d.drivers.numero
    })).sort((a, b) => a.numero - b.numero);

    setDrivers(mappedDrivers);

    // ✅ CAMBIADO: Inicializar posiciones según tipo de carrera
    const initialPositions = Array.from({ length: maxPositions }, (_, i) => ({
      position: i + 1,
      driverId: '',
      hasFastestLap: false
    }));

    setPositions(initialPositions);

    // ✅ NUEVO: Verificar si ya hay resultados guardados
    const { data: existingResults, error: resultsError } = await supabase
      .from('race_results')
      .select(`
        *,
        drivers:piloto_id (
          id,
          nombre_completo,
          numero
        )
      `)
      .eq('carrera_id', raceId)
      .order('posicion_final', { ascending: true });

    if (resultsError) throw resultsError;

    // ✅ NUEVO: Si hay resultados, cargarlos
    if (existingResults && existingResults.length > 0) {
      const loadedPositions = initialPositions.map(pos => {
        const existingResult = existingResults.find(r => r.posicion_final === pos.position);
        if (existingResult) {
          return {
            position: pos.position,
            driverId: existingResult.piloto_id,
            hasFastestLap: existingResult.vuelta_rapida || false
          };
        }
        return pos;
      });
      setPositions(loadedPositions);
    }

  } catch (err) {
    console.error('Error loading data:', err);
    setError('Error al cargar datos');
  } finally {
    setLoading(false);
  }
};

  const handleDriverChange = (position, driverId) => {
    setPositions(prev => prev.map(p => 
      p.position === position 
        ? { ...p, driverId }
        : p
    ));
  };

  const handleFastestLapChange = (position) => {
    setPositions(prev => prev.map(p => ({
      ...p,
      hasFastestLap: p.position === position
    })));
  };

 const handleSave = async () => {
  try {
    setSaving(true);
    setError('');

    // Validar que al menos top 3 esté completo
    const filledPositions = positions.filter(p => p.driverId);
    if (filledPositions.length < 3) {
      throw new Error('Debes completar al menos las primeras 3 posiciones');
    }

    // Verificar pilotos duplicados
    const driverIds = filledPositions.map(p => p.driverId);
    const uniqueDrivers = new Set(driverIds);
    if (driverIds.length !== uniqueDrivers.size) {
      throw new Error('No puedes seleccionar el mismo piloto dos veces');
    }

    // ✅ NUEVO: Determinar sistema de puntos según tipo de carrera
    const isSprint = race.tipo === 'sprint';
    const puntosF1 = isSprint 
      ? { 1: 8, 2: 7, 3: 6, 4: 5, 5: 4, 6: 3, 7: 2, 8: 1 }
      : { 1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2, 10: 1 };

    // ✅ MODIFICADO: Construir resultados CON puntos_f1
    const results = filledPositions.map(p => ({
      carrera_id: raceId,
      piloto_id: p.driverId,
      posicion_final: p.position,
      puntos_f1: puntosF1[p.position] || 0,  // ✅ NUEVO
      vuelta_rapida: race.tipo === 'sprint' ? false : p.hasFastestLap,
      estado_carrera: 'finalizado',
      created_at: new Date().toISOString()
    }));

    // Eliminar resultados existentes
    const { error: deleteError } = await supabase
      .from('race_results')
      .delete()
      .eq('carrera_id', raceId);

    if (deleteError) throw deleteError;

    // Insertar nuevos resultados
    const { error: insertError } = await supabase
      .from('race_results')
      .insert(results);

    if (insertError) throw insertError;

    // Actualizar estado de carrera
    const { error: updateError } = await supabase
      .from('races')
      .update({ 
        estado: 'finalizada',
        resultados_importados: true,
        fecha_importacion: new Date().toISOString()
      })
      .eq('id', raceId);

    if (updateError) throw updateError;

    // Calcular puntos de todas las predicciones
    console.log('🔄 Calculando puntos para carrera:', raceId);
    
    const { data: recalcData, error: recalcError } = await supabase
      .rpc('calcular_puntos_carrera', {
        p_carrera_id: raceId
      });

    if (recalcError) {
      console.error('Error recalculando puntos:', recalcError);
      toast.warning('⚠️ Resultados guardados pero hubo un error al calcular puntos automáticamente');
    } else {
      console.log('✅ Puntos calculados:', recalcData);
      const prediccionesCalculadas = recalcData?.[0]?.predicciones_calculadas || 0;
      toast.success(`✅ Resultados guardados y ${prediccionesCalculadas} predicciones calculadas`);
    }

    // Navegar después de 1 segundo
    setTimeout(() => navigate(-1), 1000);

  } catch (err) {
    console.error('Error saving results:', err);
    setError(err.message || 'Error al guardar resultados');
  } finally {
    setSaving(false);
  }
};
  if (loading) {
    return (
      <>
        <style>{FONTS + CSS}</style>
        <div data-theme={theme} className="manual-results-page">
          <div className="loading-state">
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏎</div>
            <div>Cargando...</div>
          </div>
        </div>
      </>
    );
  }

  if (!race) {
    return (
      <>
        <style>{FONTS + CSS}</style>
        <div data-theme={theme} className="manual-results-page">
          <div className="error-message">Carrera no encontrada</div>
        </div>
      </>
    );
  }

  const isSprint = race.tipo === 'sprint';

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div data-theme={theme} className="manual-results-page">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Volver
          </button>
          <h1 className="page-title">Ingresar Resultados Manualmente</h1>
          <p className="page-subtitle">
            Completa los resultados de la carrera para calcular puntos
          </p>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}

        {/* Info de la Carrera */}
        <div className="race-info-card">
          {isSprint && (
            <div className="race-badge-sprint">⚡ SPRINT</div>
          )}
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 24,
            fontWeight: 800,
            marginBottom: 16,
            color: 'var(--white)'
          }}>{race.nombre}</h2>

          <div className="race-info-grid">
            <div className="info-item">
              <div className="info-label">Circuito</div>
              <div className="info-value">{race.circuito}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Fecha</div>
              <div className="info-value">
                {new Date(race.fecha_programada).toLocaleDateString('es')}
              </div>
            </div>
            <div className="info-item">
              <div className="info-label">Tipo</div>
              <div className="info-value">{isSprint ? 'Sprint' : 'Carrera'}</div>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="warning-box">
          ⚠️ <strong>Importante:</strong> Completa al menos las primeras 3 posiciones. 
          {!isSprint && ' Marca la casilla de vuelta rápida para el piloto correspondiente.'}
          {isSprint && ' Los Sprint no tienen bonus de vuelta rápida.'}
        </div>

        {/* Posiciones */}
        <div className="positions-section">
        <h3 className="section-title">🏁 Posiciones</h3>
        
        {positions.map(pos => {
            // ✅ NUEVO: Filtrar pilotos ya seleccionados (excepto el actual)
            const selectedDriverIds = positions
            .filter(p => p.driverId && p.position !== pos.position)
            .map(p => p.driverId);
            
            const availableDrivers = drivers.filter(
            driver => !selectedDriverIds.includes(driver.id)
            );

            return (
            <div key={pos.position} className="position-row">
                <div className={`position-number ${pos.position <= 3 ? 'podium' : ''}`}>
                {pos.position}°
                </div>

                <select
                className="driver-select"
                value={pos.driverId}
                onChange={(e) => handleDriverChange(pos.position, e.target.value)}
                >
                <option value="">Seleccionar piloto...</option>
                {availableDrivers.map(driver => (
                    <option key={driver.id} value={driver.id}>
                    #{driver.numero} {driver.nombre}
                    </option>
                ))}
                </select>

                {!isSprint && (
                <div className="fastest-lap-checkbox">
                    <input
                    type="checkbox"
                    checked={pos.hasFastestLap}
                    onChange={() => handleFastestLapChange(pos.position)}
                    disabled={!pos.driverId}
                    title="Vuelta más rápida"
                    />
                    <span style={{ marginLeft: 8, fontSize: 13, color: 'var(--muted)' }}>
                    V.Rápida
                    </span>
                </div>
                )}
            </div>
            );
        })}
        </div>
        {/* Acciones */}
        <div className="actions">
          <button
            className="btn-save"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar Resultados'}
          </button>
          <button
            className="btn-cancel"
            onClick={() => navigate(-1)}
            disabled={saving}
          >
            Cancelar
          </button>
        </div>
      </div>
    </>
  );
}