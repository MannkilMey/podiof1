import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { supabase } from '../../lib/supabase';
import { subHours } from 'date-fns';

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

body {
  background: var(--bg);
  color: var(--white);
  font-family: 'Barlow', sans-serif;
}

.races-container {
  padding: 24px 28px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
}

.races-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.back-btn {
  background: transparent;
  border: none;
  color: var(--red);
  cursor: pointer;
  font-size: 24px;
  transition: opacity 0.2s;
}

.back-btn:hover { opacity: 0.7; }

.races-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 32px;
  font-weight: 900;
  color: var(--white);
}

.races-subtitle {
  color: var(--muted);
  font-size: 14px;
  margin-top: -24px;
  margin-bottom: 24px;
}

.races-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.race-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;
}

.race-card:hover {
  border-color: var(--border2);
  transform: translateY(-2px);
}

.race-card.completed {
  border-color: var(--green);
}

.race-card-header {
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border);
}

.race-info {
  flex: 1;
}

.race-round {
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.race-name {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: var(--white);
  margin-bottom: 4px;
}

.race-details {
  display: flex;
  gap: 16px;
  color: var(--muted);
  font-size: 14px;
  margin-top: 8px;
}

.race-detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.race-badges {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.race-badge {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.race-badge.predicted {
  background: rgba(0, 212, 160, 0.15);
  color: var(--green);
}

.race-badge.locked {
  background: rgba(255, 184, 0, 0.15);
  color: #FFB800;
}

.race-badge.completed {
  background: rgba(0, 212, 160, 0.15);
  color: var(--green);
}

.race-actions {
  display: flex;
  gap: 12px;
}

.btn-predict {
  padding: 12px 24px;
  background: linear-gradient(135deg, var(--red), #FF3355);
  border: none;
  border-radius: 10px;
  color: white;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-predict:hover {
  opacity: 0.9;
}

.btn-predict:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--muted);
}

.btn-edit {
  padding: 12px 24px;
  background: transparent;
  border: 2px solid var(--border2);
  border-radius: 10px;
  color: var(--white);
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit:hover {
  border-color: var(--red);
  color: var(--red);
}

.btn-edit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.countdown-small {
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
}

/* Resultados */
.race-results {
  padding: 24px;
  background: var(--bg3);
}

.results-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
  font-weight: 800;
  color: var(--white);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.results-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.result-column {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px;
}

.result-column-title {
  font-size: 12px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
  font-weight: 700;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: var(--bg3);
  border-radius: 8px;
}

.result-item.correct {
  background: rgba(0, 212, 160, 0.1);
  border: 1px solid rgba(0, 212, 160, 0.3);
}

.result-item.wrong {
  background: rgba(232, 0, 45, 0.1);
  border: 1px solid rgba(232, 0, 45, 0.3);
}

.result-position {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 20px;
  font-weight: 900;
  color: var(--white);
  min-width: 30px;
}

.result-driver {
  flex: 1;
  font-size: 14px;
  color: var(--white);
  font-weight: 600;
}

.result-check {
  font-size: 16px;
}

.points-earned {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px;
  margin-top: 16px;
  text-align: center;
}

.points-label {
  font-size: 12px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.points-value {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 48px;
  font-weight: 900;
  color: var(--green);
}

.loading-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--muted);
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.3;
}

.empty-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: var(--white);
  margin-bottom: 8px;
}

.empty-text {
  color: var(--muted);
  font-size: 14px;
}

@media (max-width: 768px) {
  .race-card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .race-actions {
    width: 100%;
    margin-top: 16px;
  }

  .btn-predict,
  .btn-edit {
    flex: 1;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }
}
`;

export default function RacesPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);

  const [group, setGroup] = useState(null);
  const [races, setRaces] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [results, setResults] = useState({});
  const [scores, setScores] = useState({});
  const [drivers, setDrivers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRacesData();
  }, [groupId]);

  const loadRacesData = async () => {
    try {
      // Cargar grupo
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

      if (groupError) throw groupError;
      setGroup(groupData);

      // Cargar pilotos
      const { data: driversData } = await supabase
        .from('drivers')
        .select('*');

      const driversMap = {};
      driversData?.forEach(d => {
        driversMap[d.id] = d;
      });
      setDrivers(driversMap);

      // Cargar carreras de la temporada
      const { data: racesData, error: racesError } = await supabase
        .from('races')
        .select('*')
        .eq('temporada', groupData.temporada)
        .order('fecha_programada', { ascending: true });

      if (racesError) throw racesError;
      setRaces(racesData || []);

      // Cargar predicciones del usuario para este grupo
      const { data: predictionsData } = await supabase
        .from('predictions')
        .select('carrera_id, id, posiciones')
        .eq('grupo_id', groupId)
        .eq('usuario_id', user.id);

      const predictionsMap = {};
      predictionsData?.forEach(pred => {
        predictionsMap[pred.carrera_id] = pred;
      });
      setPredictions(predictionsMap);

      // Cargar resultados reales de todas las carreras
      const raceIds = racesData.map(r => r.id);
      if (raceIds.length > 0) {
        const { data: resultsData } = await supabase
          .from('race_results')
          .select('*')
          .in('carrera_id', raceIds)
          .order('posicion_final', { ascending: true });

        const resultsMap = {};
        resultsData?.forEach(result => {
          if (!resultsMap[result.carrera_id]) {
            resultsMap[result.carrera_id] = [];
          }
          resultsMap[result.carrera_id].push(result);
        });
        setResults(resultsMap);

        // Cargar puntos obtenidos por carrera
        const { data: scoresData } = await supabase
          .from('scores')
          .select('carrera_id, puntos')
          .eq('grupo_id', groupId)
          .eq('usuario_id', user.id)
          .in('carrera_id', raceIds);

        const scoresMap = {};
        scoresData?.forEach(score => {
          scoresMap[score.carrera_id] = score.puntos;
        });
        setScores(scoresMap);
      }

    } catch (err) {
      console.error('Error loading races:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRaceStatus = (race) => {
    const now = new Date();
    const raceDate = new Date(race.fecha_programada);
    const deadlineHours = group.horas_cierre_prediccion || 2;
    const deadline = subHours(raceDate, deadlineHours);

    const hasPrediction = !!predictions[race.id];
    const isBeforeDeadline = now < deadline;
    const isBeforeRace = now < raceDate;

    if (race.estado === 'finalizada') {
      return {
        label: 'Completada',
        badge: 'completed',
        canPredict: false,
        canEdit: false
      };
    }

    if (!hasPrediction) {
      return {
        label: isBeforeDeadline ? 'Sin predecir' : 'Bloqueada',
        badge: isBeforeDeadline ? null : 'locked',
        canPredict: isBeforeDeadline,
        canEdit: false
      };
    }

    return {
      label: 'Predicción enviada',
      badge: 'predicted',
      canPredict: false,
      canEdit: isBeforeDeadline && isBeforeRace
    };
  };

  const handlePredict = (raceId) => {
    navigate(`/group/${groupId}/predict/${raceId}`);
  };

  const handleEdit = (raceId) => {
    navigate(`/group/${groupId}/predict/${raceId}?edit=true`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeadlineText = (race) => {
    const raceDate = new Date(race.fecha_programada);
    const deadlineHours = group.horas_cierre_prediccion || 2;
    const deadline = subHours(raceDate, deadlineHours);
    
    return `Cierra ${deadline.toLocaleDateString('es', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  };

  if (loading) {
    return (
      <>
        <style>{FONTS + CSS}</style>
        <div data-theme={theme} className="races-container">
          <div className="loading-state">
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏎</div>
            <div>Cargando carreras...</div>
          </div>
        </div>
      </>
    );
  }

  if (!group) {
    return (
      <>
        <style>{FONTS + CSS}</style>
        <div data-theme={theme} className="races-container">
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <div className="empty-title">Grupo no encontrado</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div data-theme={theme} className="races-container">
        <div className="races-header">
          <button className="back-btn" onClick={() => navigate(`/group/${groupId}`)}>
            ←
          </button>
          <div>
            <h1 className="races-title">Carreras {group.temporada}</h1>
          </div>
        </div>

        <p className="races-subtitle">
          {group.nombre} • {races.length} carreras
        </p>

        {races.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏁</div>
            <div className="empty-title">No hay carreras programadas</div>
            <div className="empty-text">
              Aún no se han agregado carreras para esta temporada
            </div>
          </div>
        ) : (
          <div className="races-grid">
            {races.map((race) => {
              const status = getRaceStatus(race);
              const raceResults = results[race.id] || [];
              const userPrediction = predictions[race.id];
              const userScore = scores[race.id];
              const hasResults = race.estado === 'finalizada' && raceResults.length > 0;
              
              return (
                <div 
                  key={race.id} 
                  className={`race-card ${race.estado === 'finalizada' ? 'completed' : ''}`}
                  onClick={() => navigate(`/group/${groupId}/race/${race.id}`)}
                >
                  {/* Header */}
                  <div className="race-card-header">
                    <div className="race-info">
                      <div className="race-round">Ronda {race.numero_ronda}</div>
                      <div className="race-name">{race.nombre}</div>
                      <div className="race-details">
                        <div className="race-detail-item">
                          <span>📍</span>
                          <span>{race.circuito}</span>
                        </div>
                        <div className="race-detail-item">
                          <span>📅</span>
                          <span>{formatDate(race.fecha_programada)}</span>
                        </div>
                      </div>
                      <div className="race-badges">
                        {status.badge && (
                          <span className={`race-badge ${status.badge}`}>
                            {status.label}
                          </span>
                        )}
                      </div>
                      {status.canPredict && (
                        <div className="countdown-small">
                          ⏰ {getDeadlineText(race)}
                        </div>
                      )}
                    </div>

                    <div className="race-actions">
                      {status.canPredict && (
                        <button 
                          className="btn-predict"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePredict(race.id);
                          }}
                        >
                          Predecir
                        </button>
                      )}
                      
                      {status.canEdit && (
                        <button 
                          className="btn-edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(race.id);
                          }}
                        >
                          Editar Predicción
                        </button>
                      )}

                      {!status.canPredict && !status.canEdit && userPrediction && (
                        <button 
                          className="btn-edit"
                          disabled
                          onClick={(e) => e.stopPropagation()}
                        >
                          Bloqueada
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Resultados - Solo si la carrera está completada */}
                  {hasResults && userPrediction && (
                    <div className="race-results">
                      <div className="results-title">
                        📊 Resultados
                      </div>
                      <div className="results-grid">
                        {/* Resultado Real */}
                        <div className="result-column">
                          <div className="result-column-title">Resultado Real</div>
                          <div className="result-list">
                            {raceResults.slice(0, group.cantidad_posiciones || 10).map((result, idx) => {
                              const driver = drivers[result.piloto_id];
                              const predictedCorrectly = userPrediction.posiciones?.[idx] === result.piloto_id;
                              
                              return (
                                <div 
                                  key={result.id} 
                                  className={`result-item ${predictedCorrectly ? 'correct' : ''}`}
                                >
                                  <div className="result-position">{idx + 1}°</div>
                                  <div className="result-driver">
                                    {driver ? `${driver.nombre} ${driver.apellido}` : 'Desconocido'}
                                  </div>
                                  {predictedCorrectly && <span className="result-check">✓</span>}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Tu Predicción */}
                        <div className="result-column">
                          <div className="result-column-title">Tu Predicción</div>
                          <div className="result-list">
                            {userPrediction.posiciones?.slice(0, group.cantidad_posiciones || 10).map((pilotoId, idx) => {
                              const driver = drivers[pilotoId];
                              const realPosition = raceResults.find(r => r.piloto_id === pilotoId);
                              const isCorrect = realPosition?.posicion_final === idx + 1;
                              
                              return (
                                <div 
                                  key={idx} 
                                  className={`result-item ${isCorrect ? 'correct' : 'wrong'}`}
                                >
                                  <div className="result-position">{idx + 1}°</div>
                                  <div className="result-driver">
                                    {driver ? `${driver.nombre} ${driver.apellido}` : 'Desconocido'}
                                  </div>
                                  <span className="result-check">{isCorrect ? '✓' : '✗'}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Puntos Obtenidos */}
                      {userScore !== undefined && (
                        <div className="points-earned">
                          <div className="points-label">Puntos Obtenidos</div>
                          <div className="points-value">{Math.round(userScore)}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}