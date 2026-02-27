import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useToastStore } from '../../stores/toastStore';
import { supabase } from '../../lib/supabase';
import { subHours } from 'date-fns';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');`;

const CSS = `
[data-theme="dark"] {
  --bg: #0A0A0C; --bg2: #111114; --bg3: #18181D; --bg4: #1E1E24;
  --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.13);
  --red: #E8002D; --red-dim: rgba(232,0,45,0.13);
  --white: #F0F0F0; --muted: rgba(240,240,240,0.40);
  --gold: #C9A84C; --green: #00D4A0; --green-dim: rgba(0,212,160,0.15);
}

[data-theme="light"] {
  --bg: #F5F6F8; --bg2: #FFFFFF; --bg3: #E8EAEE; --bg4: #DFE1E6;
  --border: rgba(0,0,0,0.10); --border2: rgba(0,0,0,0.18);
  --red: #D40029; --red-dim: rgba(212,0,41,0.08);
  --white: #1A1B1E; --muted: rgba(26,27,30,0.55);
  --gold: #9C6F10; --green: #007F5F; --green-dim: rgba(0,127,95,0.15);
}

.predictions-comparison {
  padding: 24px 28px;
  max-width: 1400px;
  margin: 0 auto;
  background: var(--bg);
  min-height: calc(100vh - 120px);
}

.back-btn {
  background: transparent;
  border: none;
  color: var(--red);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  transition: opacity 0.2s;
}

.back-btn:hover { opacity: 0.7; }

.race-header {
  background: linear-gradient(135deg, var(--bg2), var(--bg3));
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
}

.race-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 36px;
  font-weight: 900;
  color: var(--white);
  margin-bottom: 8px;
}

.race-subtitle {
  font-size: 16px;
  color: var(--muted);
  margin-bottom: 20px;
}

.race-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--green-dim);
  border: 1px solid rgba(0,212,160,0.3);
  border-radius: 20px;
  color: var(--green);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.race-status.locked {
  background: var(--red-dim);
  border-color: rgba(232,0,45,0.3);
  color: var(--red);
}

.official-result {
  background: var(--bg2);
  border: 2px solid var(--gold);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.section-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: var(--white);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.position-card {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
}

.position-card:hover {
  background: var(--bg4);
  transform: translateY(-2px);
}

.position-number {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 24px;
  font-weight: 900;
  color: var(--gold);
  min-width: 30px;
}

.driver-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--white);
}

.predictions-section {
  margin-bottom: 24px;
}

.predictions-grid {
  display: grid;
  gap: 16px;
}

.prediction-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s;
  animation: fadeInUp 0.3s ease-out;
}

.prediction-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(232,0,45,0.1);
}

.prediction-card.best {
  border-color: var(--gold);
  background: linear-gradient(135deg, var(--bg2), rgba(201,168,76,0.05));
}

.prediction-card.worst {
  opacity: 0.7;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.prediction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--red), #FF3355);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: white;
}

.user-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--white);
}

.user-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-you {
  background: var(--green-dim);
  color: var(--green);
}

.badge-best {
  background: rgba(201,168,76,0.15);
  color: var(--gold);
}

.prediction-score {
  text-align: right;
}

.score-value {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 32px;
  font-weight: 900;
  color: var(--white);
  line-height: 1;
}

.score-label {
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 4px;
}

.accuracy-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.accuracy-label {
  font-size: 12px;
  color: var(--muted);
  min-width: 80px;
}

.accuracy-track {
  flex: 1;
  height: 8px;
  background: var(--bg3);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.accuracy-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--red), var(--gold), var(--green));
  border-radius: 4px;
  transition: width 0.5s ease;
}

.accuracy-value {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--white);
  min-width: 50px;
  text-align: right;
}

.prediction-positions {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 8px;
}

.predicted-position {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.predicted-position.correct {
  background: var(--green-dim);
  border-color: var(--green);
}

.predicted-position.wrong {
  background: var(--red-dim);
  border-color: rgba(232,0,45,0.3);
}

.predicted-number {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 18px;
  font-weight: 900;
  min-width: 24px;
}

.predicted-number.correct {
  color: var(--green);
}

.predicted-number.wrong {
  color: var(--red);
}

.predicted-driver {
  font-size: 13px;
  font-weight: 600;
  color: var(--white);
  flex: 1;
}

.prediction-icon {
  font-size: 14px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
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

.empty-message {
  font-size: 14px;
  color: var(--muted);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--border);
  border-top-color: var(--red);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 16px;
  color: var(--muted);
  font-size: 14px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-box {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.stat-value {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 32px;
  font-weight: 900;
  color: var(--white);
}

.stat-label {
  font-size: 12px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .predictions-comparison {
    padding: 16px;
  }

  .race-header {
    padding: 20px;
  }

  .race-title {
    font-size: 28px;
  }

  .result-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  .prediction-positions {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
`;

export default function RacePredictionsComparison() {
  const { groupId, raceId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  const toast = useToastStore();

  const [race, setRace] = useState(null);
  const [officialResult, setOfficialResult] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [drivers, setDrivers] = useState({});
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    loadData();
  }, [groupId, raceId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Cargar información de la carrera
      const { data: raceData, error: raceError } = await supabase
        .from('races')
        .select('*')
        .eq('id', raceId)
        .single();

      if (raceError) throw raceError;
      setRace(raceData);

      // Verificar si las predicciones están cerradas
      const raceDate = new Date(raceData.fecha_programada);
      const deadlineDate = subHours(raceDate, raceData.horas_cierre_prediccion || 2);
      const now = new Date();
      const locked = now >= deadlineDate;
      setIsLocked(locked);

      if (!locked) {
        toast.error('Las predicciones aún están abiertas');
        return;
      }

      // Cargar pilotos
      const { data: driversData } = await supabase
        .from('pilotos')
        .select('*');

      const driversMap = {};
      driversData?.forEach(d => {
        driversMap[d.id] = d.nombre_completo || `${d.nombre} ${d.apellido}`;
      });
      setDrivers(driversMap);

      // Cargar resultado oficial
      const { data: resultsData } = await supabase
        .from('race_results')
        .select('*')
        .eq('carrera_id', raceId)
        .order('posicion_final', { ascending: true });

      setOfficialResult(resultsData || []);

      // Cargar todas las predicciones del grupo
      const { data: predictionsData } = await supabase
        .from('predictions')
        .select(`
          *,
          users:usuario_id (
            id,
            nombre,
            apellido,
            email
          ),
          scores!inner (
            puntos,
            aciertos_exactos
          )
        `)
        .eq('grupo_id', groupId)
        .eq('carrera_id', raceId);

      // Transformar y ordenar predicciones por puntos
      const transformedPredictions = predictionsData
        ?.map(pred => ({
          ...pred,
          userName: `${pred.users.nombre} ${pred.users.apellido}`.trim(),
          userEmail: pred.users.email,
          puntos: pred.scores?.[0]?.puntos || 0,
          aciertos_exactos: pred.scores?.[0]?.aciertos_exactos || 0
        }))
        .sort((a, b) => b.puntos - a.puntos) || [];

      setPredictions(transformedPredictions);

    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Error al cargar las predicciones');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name, lastName) => {
    return `${name?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?';
  };

  const calculateAccuracy = (positions) => {
    if (!positions || !officialResult.length) return 0;
    
    let correct = 0;
    positions.slice(0, 10).forEach((pilotoId, idx) => {
      if (officialResult[idx]?.piloto_id === pilotoId) {
        correct++;
      }
    });
    
    return (correct / 10) * 100;
  };

  const isPredictionCorrect = (predictedPilotoId, position) => {
    return officialResult[position]?.piloto_id === predictedPilotoId;
  };

  if (loading) {
    return (
      <>
        <style>{FONTS + CSS}</style>
        <div data-theme={theme} className="predictions-comparison">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">Cargando predicciones...</div>
          </div>
        </div>
      </>
    );
  }

  if (!race || !isLocked) {
    return (
      <>
        <style>{FONTS + CSS}</style>
        <div data-theme={theme} className="predictions-comparison">
          <button className="back-btn" onClick={() => navigate(`/group/${groupId}/races`)}>
            ← Volver
          </button>
          <div className="empty-state">
            <div className="empty-icon">🔒</div>
            <div className="empty-title">Predicciones no disponibles</div>
            <div className="empty-message">
              Las predicciones se podrán ver después del cierre del deadline
            </div>
          </div>
        </div>
      </>
    );
  }

  const bestPrediction = predictions[0];
  const avgPoints = predictions.length > 0
    ? predictions.reduce((sum, p) => sum + p.puntos, 0) / predictions.length
    : 0;

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div data-theme={theme} className="predictions-comparison">
        <button className="back-btn" onClick={() => navigate(`/group/${groupId}/races`)}>
          ← Volver a Carreras
        </button>

        {/* Race Header */}
        <div className="race-header">
          <h1 className="race-title">{race.nombre}</h1>
          <p className="race-subtitle">📍 {race.circuito} • 📅 {new Date(race.fecha_programada).toLocaleDateString('es')}</p>
          <span className={`race-status ${isLocked ? 'locked' : ''}`}>
            {isLocked ? '🔒 Predicciones cerradas' : '✓ Abiertas'}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-value">{predictions.length}</div>
            <div className="stat-label">Predicciones</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{Math.round(avgPoints)}</div>
            <div className="stat-label">Puntos Promedio</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{Math.round(bestPrediction?.puntos || 0)}</div>
            <div className="stat-label">Mejor Puntuación</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{bestPrediction?.aciertos_exactos || 0}</div>
            <div className="stat-label">Máximo Exactos</div>
          </div>
        </div>

        {/* Official Result */}
        {officialResult.length > 0 && (
          <div className="official-result">
            <h2 className="section-title">🏆 Resultado Oficial</h2>
            <div className="result-grid">
              {officialResult.slice(0, 10).map((result, idx) => (
                <div key={result.id} className="position-card">
                  <div className="position-number">{idx + 1}°</div>
                  <div className="driver-name">{drivers[result.piloto_id] || 'Desconocido'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Predictions */}
        <div className="predictions-section">
          <h2 className="section-title">
            📊 Predicciones del Grupo ({predictions.length})
          </h2>

          {predictions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <div className="empty-title">Sin predicciones</div>
              <div className="empty-message">
                Nadie realizó predicciones para esta carrera
              </div>
            </div>
          ) : (
            <div className="predictions-grid">
              {predictions.map((prediction, idx) => {
                const isCurrentUser = prediction.usuario_id === user.id;
                const isBest = idx === 0;
                const accuracy = calculateAccuracy(prediction.posiciones);

                return (
                  <div 
                    key={prediction.id} 
                    className={`prediction-card ${isBest ? 'best' : ''}`}
                  >
                    <div className="prediction-header">
                      <div className="user-info">
                        <div className="user-avatar">
                          {getInitials(prediction.users.nombre, prediction.users.apellido)}
                        </div>
                        <div>
                          <div className="user-name">{prediction.userName}</div>
                          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                            {isCurrentUser && (
                              <span className="user-badge badge-you">✓ Tú</span>
                            )}
                            {isBest && (
                              <span className="user-badge badge-best">👑 Mejor</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="prediction-score">
                        <div className="score-value">{Math.round(prediction.puntos)}</div>
                        <div className="score-label">Puntos</div>
                      </div>
                    </div>

                    <div className="accuracy-bar">
                      <div className="accuracy-label">Exactitud:</div>
                      <div className="accuracy-track">
                        <div 
                          className="accuracy-fill" 
                          style={{ width: `${accuracy}%` }}
                        ></div>
                      </div>
                      <div className="accuracy-value">{Math.round(accuracy)}%</div>
                    </div>

                    <div style={{ 
                      fontSize: 12, 
                      color: 'var(--muted)', 
                      marginBottom: 12,
                      display: 'flex',
                      gap: 16
                    }}>
                      <span>✓ {prediction.aciertos_exactos} exactos</span>
                      <span>🎯 {prediction.scores?.[0]?.aciertos_piloto || 0} pilotos correctos</span>
                    </div>

                    <div className="prediction-positions">
                      {prediction.posiciones?.slice(0, 10).map((pilotoId, position) => {
                        const isCorrect = isPredictionCorrect(pilotoId, position);
                        
                        return (
                          <div 
                            key={position} 
                            className={`predicted-position ${isCorrect ? 'correct' : 'wrong'}`}
                          >
                            <div className={`predicted-number ${isCorrect ? 'correct' : 'wrong'}`}>
                              {position + 1}°
                            </div>
                            <div className="predicted-driver">
                              {drivers[pilotoId] || 'Desconocido'}
                            </div>
                            <div className="prediction-icon">
                              {isCorrect ? '✓' : '✗'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}