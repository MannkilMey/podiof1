import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useThemeStore } from '../../stores/themeStore';
import { toast } from 'sonner';
import * as openf1 from '../../services/openf1';
import { importRaceResults, importQualifyingResults, findSessionsForRace } from '../../services/importResults';

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

.import-container {
  padding: 24px 28px;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--bg);
  min-height: calc(100vh - 60px);
}

.import-header {
  margin-bottom: 32px;
}

.import-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 32px;
  font-weight: 900;
  color: var(--white);
  margin-bottom: 8px;
}

.import-subtitle {
  color: var(--muted);
  font-size: 16px;
}

.races-grid {
  display: grid;
  gap: 16px;
  margin-bottom: 32px;
}

.race-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.race-card:hover {
  border-color: var(--border2);
  transform: translateY(-2px);
}

.race-card.selected {
  border-color: var(--red);
  background: var(--red-dim);
}

.race-card.imported {
  opacity: 0.6;
  border-color: var(--green);
}

.race-name {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: var(--white);
  margin-bottom: 8px;
}

.race-info {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 13px;
  color: var(--muted);
}

.race-badge {
  background: var(--bg3);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.race-badge.imported {
  background: var(--green);
  color: white;
}

.sessions-panel {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.panel-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 18px;
  font-weight: 800;
  color: var(--white);
  margin-bottom: 16px;
}

.session-card {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.session-card:hover {
  border-color: var(--red);
}

.session-card.selected {
  border-color: var(--red);
  background: var(--red-dim);
}

.session-name {
  font-weight: 700;
  color: var(--white);
  margin-bottom: 6px;
}

.session-details {
  font-size: 13px;
  color: var(--muted);
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-import {
  padding: 14px 28px;
  background: linear-gradient(135deg, var(--red), #FF3355);
  border: none;
  border-radius: 10px;
  color: white;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.2s;
  width: 100%;
}

.btn-import:hover {
  opacity: 0.88;
}

.btn-import:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-search {
  padding: 12px 24px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--white);
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.btn-search:hover {
  border-color: var(--red);
  color: var(--red);
}

.progress-log {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px;
  margin-top: 16px;
  max-height: 300px;
  overflow-y: auto;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 12px;
}

.log-line {
  color: var(--muted);
  margin-bottom: 4px;
}

.log-line.success {
  color: var(--green);
}

.log-line.error {
  color: var(--red);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--muted);
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid var(--border);
  border-top-color: var(--red);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
`;

export default function ImportResults() {
  const theme = useThemeStore((state) => state.theme);
  const [races, setRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [importing, setImporting] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadRaces();
  }, []);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message: `[${timestamp}] ${message}`, type }]);
  };

  const loadRaces = async () => {
    try {
      const { data, error } = await supabase
        .from('races')
        .select('*')
        .eq('temporada', 2026)
        .order('fecha_programada', { ascending: true });

      if (error) throw error;
      setRaces(data || []);
    } catch (err) {
      console.error('Error loading races:', err);
      toast.error('Error al cargar carreras');
    } finally {
      setLoading(false);
    }
  };

  const handleRaceSelect = (race) => {
    setSelectedRace(race);
    setSessions([]);
    setSelectedSession(null);
    setLogs([]);
  };

  const handleSearchSessions = async () => {
    if (!selectedRace) return;

    setSearching(true);
    setSessions([]);
    setLogs([]);

    try {
      addLog(`Buscando sesiones para: ${selectedRace.nombre}`);
      
      const foundSessions = await findSessionsForRace(
        selectedRace.nombre,
        selectedRace.fecha_programada,
        2026
      );

      if (foundSessions.length === 0) {
        addLog('No se encontraron sesiones coincidentes', 'error');
        toast.warning('No se encontraron sesiones en OpenF1');
      } else {
        addLog(`Encontradas ${foundSessions.length} sesiones`, 'success');
        setSessions(foundSessions);
      }
    } catch (err) {
      console.error('Error searching sessions:', err);
      addLog(`Error: ${err.message}`, 'error');
      toast.error('Error al buscar sesiones');
    } finally {
      setSearching(false);
    }
  };

  const handleImportResults = async () => {
    if (!selectedRace || !selectedSession) return;

    setImporting(true);
    setLogs([]);

    try {
      addLog('Iniciando importación de resultados...');

      const result = await importRaceResults(selectedRace.id, selectedSession.sessionKey);

      addLog(`✅ ${result.resultsCount} posiciones importadas`, 'success');
      addLog(`⚡ Vuelta rápida: Piloto #${result.fastestLapDriver}`, 'success');
      addLog(`🎯 ${result.predictionsUpdated} predicciones actualizadas`, 'success');

      toast.success('¡Resultados importados correctamente!');

      // Recargar carreras para actualizar estado
      await loadRaces();

      // Limpiar selección
      setSelectedRace(null);
      setSessions([]);
      setSelectedSession(null);

    } catch (err) {
      console.error('Error importing:', err);
      addLog(`❌ Error: ${err.message}`, 'error');
      toast.error('Error al importar resultados');
    } finally {
      setImporting(false);
    }
  };

  const handleImportQualifying = async () => {
    if (!selectedRace || !selectedSession) return;

    setImporting(true);

    try {
      addLog('Importando qualifying...');

      const result = await importQualifyingResults(
        selectedRace.id,
        selectedSession.meetingKey
      );

      addLog(`✅ ${result.count}/${result.total} parrillas actualizadas`, 'success');
      toast.success('Qualifying importado correctamente');

    } catch (err) {
      console.error('Error importing qualifying:', err);
      addLog(`❌ Error: ${err.message}`, 'error');
      toast.error('Error al importar qualifying');
    } finally {
      setImporting(false);
    }
  };

  if (loading) {
    return (
      <>
        <style>{FONTS + CSS}</style>
        <div data-theme={theme} className="import-container">
          <div className="empty-state">
            <div className="loading-spinner"></div>
            <p style={{ marginTop: 16 }}>Cargando carreras...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div data-theme={theme} className="import-container">
        <div className="import-header">
          <h1 className="import-title">Importar Resultados de OpenF1</h1>
          <p className="import-subtitle">
            Selecciona una carrera, busca la sesión en OpenF1 e importa los resultados
          </p>
        </div>

        {/* Lista de Carreras */}
        <div className="races-grid">
          {races.map(race => (
            <div
              key={race.id}
              className={`race-card ${selectedRace?.id === race.id ? 'selected' : ''} ${race.resultados_importados ? 'imported' : ''}`}
              onClick={() => handleRaceSelect(race)}
            >
              <div className="race-name">{race.nombre}</div>
              <div className="race-info">
                <span>📍 {race.circuito}</span>
                <span>📅 {new Date(race.fecha_programada).toLocaleDateString('es')}</span>
                {race.resultados_importados && (
                  <span className="race-badge imported">
                    ✓ Importado
                  </span>
                )}
                {race.openf1_session_key && (
                  <span className="race-badge">
                    Session: {race.openf1_session_key}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Panel de Búsqueda */}
        {selectedRace && (
          <div className="sessions-panel">
            <h2 className="panel-title">
              Buscar Sesión: {selectedRace.nombre}
            </h2>

            <button
              className="btn-search"
              onClick={handleSearchSessions}
              disabled={searching}
            >
              {searching ? (
                <>
                  <span className="loading-spinner"></span> Buscando...
                </>
              ) : (
                '🔍 Buscar en OpenF1'
              )}
            </button>

            {/* Sesiones Encontradas */}
            {sessions.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h3 style={{ color: 'var(--white)', marginBottom: 12, fontSize: 14 }}>
                  Sesiones encontradas:
                </h3>
                {sessions.map(session => (
                  <div
                    key={session.sessionKey}
                    className={`session-card ${selectedSession?.sessionKey === session.sessionKey ? 'selected' : ''}`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="session-name">{session.name}</div>
                    <div className="session-details">
                      <span>📍 {session.location}</span>
                      <span>🏁 {session.circuit}</span>
                      <span>📅 {new Date(session.date).toLocaleDateString('es')}</span>
                      <span>🔑 Session: {session.sessionKey}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Botones de Importación */}
            {selectedSession && (
              <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
                <button
                  className="btn-import"
                  onClick={handleImportResults}
                  disabled={importing}
                >
                  {importing ? 'Importando...' : '⬇️ Importar Resultados'}
                </button>
                <button
                  className="btn-import"
                  style={{ background: 'var(--bg3)', color: 'var(--white)' }}
                  onClick={handleImportQualifying}
                  disabled={importing}
                >
                  🏁 Importar Qualifying
                </button>
              </div>
            )}

            {/* Log de Progreso */}
            {logs.length > 0 && (
              <div className="progress-log">
                {logs.map((log, idx) => (
                  <div key={idx} className={`log-line ${log.type}`}>
                    {log.message}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}