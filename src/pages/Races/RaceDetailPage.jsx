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

.race-detail-container {
  padding: 24px 28px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
}

.race-detail-header {
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

.race-detail-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 32px;
  font-weight: 900;
  color: var(--white);
}

.race-detail-subtitle {
  color: var(--muted);
  font-size: 14px;
  margin-top: -24px;
  margin-bottom: 24px;
}

.race-hero {
  background: linear-gradient(135deg, var(--bg2), var(--bg3));
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}

.race-hero::before {
  content: '🏁';
  position: absolute;
  right: -20px;
  bottom: -20px;
  font-size: 200px;
  opacity: 0.03;
}

.race-hero-content {
  position: relative;
  z-index: 1;
}

.race-round-big {
  font-size: 12px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.race-name-big {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 48px;
  font-weight: 900;
  color: var(--white);
  margin-bottom: 16px;
  line-height: 1;
}

.race-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.race-info-item {
  background: var(--bg3);
  padding: 16px;
  border-radius: 10px;
  border: 1px solid var(--border);
}

.race-info-label {
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.race-info-value {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: var(--white);
}

.race-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-predict {
  padding: 14px 28px;
  background: linear-gradient(135deg, var(--red), #FF3355);
  border: none;
  border-radius: 10px;
  color: white;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-predict:hover { opacity: 0.9; }
.btn-predict:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-edit {
  padding: 14px 28px;
  background: transparent;
  border: 2px solid var(--border2);
  border-radius: 10px;
  color: var(--white);
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
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

.tabs-nav {
  display: flex;
  gap: 8px;
  border-bottom: 2px solid var(--border);
  margin-bottom: 24px;
}

.tab-btn {
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  padding: 12px 20px;
  color: var(--muted);
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -2px;
}

.tab-btn.active {
  color: var(--red);
  border-bottom-color: var(--red);
}

.tab-btn:hover:not(.active) {
  color: var(--white);
}

.results-section {
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

.results-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.result-column {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 20px;
}

.result-column-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
  font-weight: 800;
  color: var(--white);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
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
  padding: 12px;
  background: var(--bg2);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.result-item.correct {
  background: rgba(0, 212, 160, 0.1);
  border-color: var(--green);
}

.result-item.wrong {
  background: rgba(232, 0, 45, 0.05);
  border-color: rgba(232, 0, 45, 0.2);
}

.result-position {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 24px;
  font-weight: 900;
  color: var(--white);
  min-width: 40px;
}

.result-driver {
  flex: 1;
  font-size: 15px;
  color: var(--white);
  font-weight: 600;
}

.result-points {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--muted);
}

.result-check {
  font-size: 20px;
}

.leaderboard-table {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
}

.leaderboard-table table {
  width: 100%;
  border-collapse: collapse;
}

.leaderboard-table th {
  background: var(--bg3);
  padding: 16px;
  text-align: left;
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
}

.leaderboard-table td {
  padding: 16px;
  border-top: 1px solid var(--border);
  color: var(--white);
}

.leaderboard-table tr.current-user {
  background: var(--red-dim);
}

.position-cell {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 20px;
  font-weight: 900;
}

.medal { font-size: 20px; }

.points-earned-big {
  background: var(--bg3);
  border: 2px solid var(--green);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  margin-top: 24px;
}

.points-label-big {
  font-size: 14px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 12px;
  font-weight: 700;
}

.points-value-big {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 72px;
  font-weight: 900;
  color: var(--green);
  line-height: 1;
}

.no-prediction {
  text-align: center;
  padding: 60px 20px;
  color: var(--muted);
}

.no-prediction-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.3;
}

.loading-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--muted);
}

@media (max-width: 900px) {
  .results-comparison {
    grid-template-columns: 1fr;
  }
  
  .race-info-grid {
    grid-template-columns: 1fr;
  }
}
`;

export default function RaceDetailPage() {
  const { groupId, raceId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);

  const [activeTab, setActiveTab] = useState('results');
  const [group, setGroup] = useState(null);
  const [race, setRace] = useState(null);
  const [raceResults, setRaceResults] = useState([]);
  const [userPrediction, setUserPrediction] = useState(null);
  const [userScore, setUserScore] = useState(null);
  const [groupLeaderboard, setGroupLeaderboard] = useState([]);
  const [drivers, setDrivers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRaceDetail();
  }, [raceId, groupId]);

  const loadRaceDetail = async () => {
    try {
      const { data: groupData } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();
      setGroup(groupData);

      const { data: raceData } = await supabase
        .from('races')
        .select('*')
        .eq('id', raceId)
        .single();
      setRace(raceData);

      const { data: driversData } = await supabase
        .from('drivers')
        .select('*');

      const driversMap = {};
      driversData?.forEach(d => {
        driversMap[d.id] = d;
      });
      setDrivers(driversMap);

      const { data: resultsData } = await supabase
        .from('race_results')
        .select('*')
        .eq('carrera_id', raceId)
        .order('posicion_final', { ascending: true });
      setRaceResults(resultsData || []);

      const { data: predictionData } = await supabase
        .from('predictions')
        .select('*')
        .eq('grupo_id', groupId)
        .eq('carrera_id', raceId)
        .eq('usuario_id', user.id)
        .maybeSingle();
      setUserPrediction(predictionData);

      const { data: scoreData } = await supabase
        .from('scores')
        .select('puntos')
        .eq('grupo_id', groupId)
        .eq('carrera_id', raceId)
        .eq('usuario_id', user.id)
        .maybeSingle();
      setUserScore(scoreData?.puntos);

      const { data: scoresData } = await supabase
        .from('scores')
        .select(`
          usuario_id,
          puntos,
          users:usuario_id (
            nombre,
            apellido
          )
        `)
        .eq('grupo_id', groupId)
        .eq('carrera_id', raceId)
        .order('puntos', { ascending: false });

      const leaderboard = scoresData?.map((s, idx) => ({
        position: idx + 1,
        userId: s.usuario_id,
        nombre: `${s.users?.nombre || ''} ${s.users?.apellido || ''}`.trim() || 'Usuario',
        puntos: s.puntos,
        isCurrentUser: s.usuario_id === user.id
      })) || [];
      
      setGroupLeaderboard(leaderboard);

    } catch (err) {
      console.error('Error loading race detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRaceStatus = () => {
    if (!race || !group) return {};
    
    const now = new Date();
    const raceDate = new Date(race.fecha_programada);
    const deadlineHours = group.horas_cierre_prediccion || 2;
    const deadline = subHours(raceDate, deadlineHours);

    const hasPrediction = !!userPrediction;
    const isBeforeDeadline = now < deadline;
    const isBeforeRace = now < raceDate;

    return {
      canPredict: !hasPrediction && isBeforeDeadline,
      canEdit: hasPrediction && isBeforeDeadline && isBeforeRace,
      isCompleted: race.estado === 'finalizada'
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMedal = (position) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return '';
  };

  if (loading) {
    return (
      <>
        <style>{FONTS + CSS}</style>
        <div data-theme={theme} className="race-detail-container">
          <div className="loading-state">
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏎</div>
            <div>Cargando detalles...</div>
          </div>
        </div>
      </>
    );
  }

  if (!race || !group) {
    return (
      <>
        <style>{FONTS + CSS}</style>
        <div data-theme={theme} className="race-detail-container">
          <div className="loading-state">
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <div>Carrera no encontrada</div>
          </div>
        </div>
      </>
    );
  }

  const status = getRaceStatus();

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div data-theme={theme} className="race-detail-container">
        <div className="race-detail-header">
          <button className="back-btn" onClick={() => navigate(`/group/${groupId}/races`)}>
            ←
          </button>
          <h1 className="race-detail-title">Detalles de Carrera</h1>
        </div>

        <p className="race-detail-subtitle">{group.nombre}</p>

        <div className="race-hero">
          <div className="race-hero-content">
            <div className="race-round-big">Ronda {race.numero_ronda}</div>
            <h2 className="race-name-big">{race.nombre}</h2>

            <div className="race-info-grid">
              <div className="race-info-item">
                <div className="race-info-label">Circuito</div>
                <div className="race-info-value">{race.circuito}</div>
              </div>
              <div className="race-info-item">
                <div className="race-info-label">Fecha</div>
                <div className="race-info-value">{formatDate(race.fecha_programada)}</div>
              </div>
              <div className="race-info-item">
                <div className="race-info-label">Estado</div>
                <div className="race-info-value">
                  {race.estado === 'finalizada' ? '✅ Completada' : '⏳ Programada'}
                </div>
              </div>
              <div className="race-info-item">
                <div className="race-info-label">País</div>
                <div className="race-info-value">{race.pais || 'N/A'}</div>
              </div>
            </div>

            {(status.canPredict || status.canEdit) && (
              <div className="race-actions">
                {status.canPredict && (
                  <button 
                    className="btn-predict"
                    onClick={() => navigate(`/group/${groupId}/predict/${raceId}`)}
                  >
                    Hacer Predicción
                  </button>
                )}
                {status.canEdit && (
                  <button 
                    className="btn-edit"
                    onClick={() => navigate(`/group/${groupId}/predict/${raceId}?edit=true`)}
                  >
                    Editar Predicción
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="tabs-nav">
          <button 
            className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            📊 Resultados
          </button>
          <button 
            className={`tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            🏆 Clasificación del Grupo
          </button>
        </div>

        {activeTab === 'results' && (
          <>
            {status.isCompleted && userPrediction ? (
              <div className="results-section">
                <h3 className="section-title">Tu Predicción vs Resultado Real</h3>
                
                <div className="results-comparison">
                  <div className="result-column">
                    <div className="result-column-title">🏁 Resultado Real</div>
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
                            <div className="result-points">{result.puntos_f1} pts</div>
                            {predictedCorrectly && <span className="result-check">✓</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="result-column">
                    <div className="result-column-title">🎯 Tu Predicción</div>
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
                            <div className="result-points">
                              {realPosition ? `${realPosition.posicion_final}° real` : 'DNF'}
                            </div>
                            <span className="result-check">{isCorrect ? '✓' : '✗'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {userScore !== undefined && userScore !== null && (
                  <div className="points-earned-big">
                    <div className="points-label-big">Puntos Obtenidos</div>
                    <div className="points-value-big">{Math.round(userScore)}</div>
                  </div>
                )}
              </div>
            ) : !userPrediction ? (
              <div className="no-prediction">
                <div className="no-prediction-icon">📝</div>
                <div style={{ fontSize: 18, marginBottom: 8 }}>No has hecho predicción para esta carrera</div>
                {status.canPredict && (
                  <button 
                    className="btn-predict"
                    style={{ marginTop: 16 }}
                    onClick={() => navigate(`/group/${groupId}/predict/${raceId}`)}
                  >
                    Hacer Predicción Ahora
                  </button>
                )}
              </div>
            ) : (
              <div className="no-prediction">
                <div className="no-prediction-icon">⏳</div>
                <div style={{ fontSize: 18 }}>Los resultados estarán disponibles cuando finalice la carrera</div>
              </div>
            )}
          </>
        )}

        {activeTab === 'leaderboard' && (
          <div className="leaderboard-table">
            {groupLeaderboard.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Usuario</th>
                    <th>Puntos</th>
                  </tr>
                </thead>
                <tbody>
                  {groupLeaderboard.map(member => (
                    <tr key={member.userId} className={member.isCurrentUser ? 'current-user' : ''}>
                      <td className="position-cell">
                        <span className="medal">{getMedal(member.position)}</span>
                        {member.position}
                      </td>
                      <td>{member.nombre}</td>
                      <td>{Math.round(member.puntos)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-prediction">
                <div className="no-prediction-icon">📊</div>
                <div style={{ fontSize: 18 }}>
                  {status.isCompleted 
                    ? 'Nadie del grupo ha participado en esta carrera' 
                    : 'La clasificación estará disponible cuando finalice la carrera'}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}