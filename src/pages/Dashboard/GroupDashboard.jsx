import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useToastStore } from '../../stores/toastStore';
import { useGroupDashboard } from '../../hooks/useGroupDashboard';
import { useCountdown } from '../../hooks/useCountdown';
import { useDriverStandings } from '../../hooks/useDriverStandings';
import { useTeamStandings } from '../../hooks/useTeamStandings';
import { useLastRace } from '../../hooks/useLastRace';
import { useUserRaceDetails } from '../../hooks/useUserRaceDetails';
import { SkeletonTable, SkeletonStats } from '../../components/SkeletonLoader';
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

.group-dashboard {
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

.hero-banner {
  background: linear-gradient(135deg, var(--bg2), var(--bg3));
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}

.hero-banner::before {
  content: '🏎';
  position: absolute;
  right: -20px;
  bottom: -20px;
  font-size: 200px;
  opacity: 0.03;
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.hero-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 36px;
  font-weight: 900;
  color: var(--white);
  margin-bottom: 8px;
}

.admin-badge {
  background: var(--red-dim);
  color: var(--red);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.next-race {
  color: var(--muted);
  font-size: 18px;
  margin-bottom: 16px;
}

.countdown-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.countdown-box {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.countdown-box.expired {
  opacity: 0.5;
}

.countdown-label {
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.countdown-time {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 28px;
  font-weight: 900;
  color: var(--white);
}

.countdown-date {
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
}

.alert-banner {
  background: var(--red-dim);
  border: 1px solid rgba(232, 0, 45, 0.3);
  border-radius: 10px;
  padding: 12px 16px;
  color: var(--red);
  font-weight: 600;
  font-size: 14px;
  animation: slideIn 0.3s ease-out;
}

.alert-banner.success {
  background: rgba(0, 212, 160, 0.1);
  border-color: rgba(0, 212, 160, 0.3);
  color: var(--green);
}

.btn-admin {
  margin-bottom: 16px;
  padding: 12px 24px;
  background: var(--red);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.2s ease;
}

.btn-admin:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-admin:active {
  transform: translateY(0);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: default;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(232, 0, 45, 0.1);
}

.stat-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.stat-value {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 48px;
  font-weight: 900;
  color: var(--white);
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 8px;
}

.tabs-container {
  margin-bottom: 24px;
}

.tabs-nav {
  display: flex;
  gap: 8px;
  border-bottom: 2px solid var(--border);
  margin-bottom: 24px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
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
  transition: all 0.2s ease;
  margin-bottom: -2px;
  white-space: nowrap;
}

.tab-btn.active {
  color: var(--red);
  border-bottom-color: var(--red);
}

.tab-btn:hover:not(.active) {
  color: var(--white);
}

.tab-content {
  animation: fadeInUp 0.3s ease-out;
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

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.leaderboard-table {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.3s;
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

.leaderboard-table tr {
  transition: background-color 0.15s ease;
}

.leaderboard-table tr:hover {
  background: var(--bg3);
}

.leaderboard-table tr.current-user {
  background: var(--red-dim);
}

.leaderboard-table tr.current-user:hover {
  background: var(--red-dim);
  opacity: 0.9;
}

.position-cell {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 20px;
  font-weight: 900;
}

.medal { 
  font-size: 20px;
  margin-right: 4px;
}

/* Mobile responsive */
@media (max-width: 900px) {
  .group-dashboard { 
    padding: 16px; 
  }
  
  .stats-grid { 
    grid-template-columns: 1fr; 
  }
  
  .countdown-container { 
    grid-template-columns: 1fr; 
  }
}

@media (max-width: 768px) {
  .hero-banner {
    padding: 20px;
  }
  
  .hero-title {
    font-size: 28px;
  }
  
  .countdown-time {
    font-size: 20px;
  }
  
  .tab-btn {
    padding: 10px 16px;
    font-size: 14px;
  }
  
  .leaderboard-table {
    overflow-x: auto;
  }
  
  .leaderboard-table table {
    min-width: 500px;
  }

  .stat-value {
    font-size: 36px;
  }

  .stat-icon {
    font-size: 24px;
  }
}
`;

function HeroBanner({ group, nextRace, navigate, groupId }) {
  const toast = useToastStore();
  const raceDate = nextRace ? new Date(nextRace.fecha_programada) : new Date();
  const deadlineDate = nextRace ? subHours(raceDate, nextRace.deadlineHours || 2) : new Date();
  
  const countdownToRace = useCountdown(raceDate);
  const countdownToDeadline = useCountdown(deadlineDate);
  
  const canPredict = nextRace && !countdownToDeadline.expired && !countdownToRace.expired;

  const handleShareGroup = () => {
    const inviteLink = `${window.location.origin}/join/${group.codigo_invitacion}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success('¡Link copiado al portapapeles! 📋');
  };

  if (!nextRace) {
    return (
      <div className="hero-banner">
        <div className="hero-header">
          <div>
            <h1 className="hero-title">{group.nombre}</h1>
            <p className="next-race">No hay carreras programadas</p>
          </div>
          {group.isAdmin && <span className="admin-badge">Admin</span>}
        </div>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            className="btn-admin"
            onClick={() => navigate(`/group/${groupId}/races`)}
            style={{ background: 'linear-gradient(135deg, var(--red), #FF3355)', marginBottom: 0 }}
          >
            🏁 Ver Carreras
          </button>
          
          {group.isAdmin && (
            <>
              <button 
                className="btn-admin"
                onClick={() => navigate(`/admin/group/${groupId}`)}
                style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', marginBottom: 0 }}
              >
                ⚙️ Administrar Grupo
              </button>
              
              <button 
                className="btn-admin"
                onClick={handleShareGroup}
                style={{ 
                  background: 'linear-gradient(135deg, #00D4A0, #00A67E)', 
                  marginBottom: 0 
                }}
              >
                🔗 Compartir Grupo
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="hero-banner">
      <div className="hero-header">
        <div>
          <h1 className="hero-title">{group.nombre}</h1>
          <p className="next-race">
            🏁 Próxima carrera: {nextRace.nombre} · {nextRace.circuito}
          </p>
        </div>
        {group.isAdmin && <span className="admin-badge">⚙️ Admin</span>}
      </div>

      <div className="countdown-container">
        <div className={`countdown-box ${countdownToDeadline.expired ? 'expired' : ''}`}>
          <div className="countdown-label">⏰ Predicciones cierran</div>
          <div className="countdown-time">{countdownToDeadline.formatted}</div>
          <div className="countdown-date">
            {deadlineDate.toLocaleString('es', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>

        <div className={`countdown-box ${countdownToRace.expired ? 'expired' : ''}`}>
          <div className="countdown-label">🏁 Carrera inicia</div>
          <div className="countdown-time">{countdownToRace.formatted}</div>
          <div className="countdown-date">
            {raceDate.toLocaleString('es', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button 
          className="btn-admin"
          onClick={() => navigate(`/group/${groupId}/races`)}
          style={{ background: 'linear-gradient(135deg, var(--red), #FF3355)', marginBottom: 0 }}
        >
          🏁 Ver Todas las Carreras
        </button>
        
        {group.isAdmin && (
          <>
            <button 
              className="btn-admin"
              onClick={() => navigate(`/admin/group/${groupId}`)}
              style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', marginBottom: 0 }}
            >
              ⚙️ Administrar Grupo
            </button>
            
            <button 
              className="btn-admin"
              onClick={handleShareGroup}
              style={{ 
                background: 'linear-gradient(135deg, #00D4A0, #00A67E)', 
                marginBottom: 0 
              }}
            >
              🔗 Compartir Grupo
            </button>
          </>
        )}
      </div>

      {!nextRace.userHasPredicted && canPredict ? (
        <div className="alert-banner">
          ⚠️ Aún no has enviado tu predicción para esta carrera
          <button 
            onClick={() => navigate(`/group/${groupId}/predict/${nextRace.id}`)}
            style={{
              marginLeft: 16,
              padding: '8px 16px',
              background: 'var(--red)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.9'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            Predecir Ahora →
          </button>
        </div>
      ) : nextRace.userHasPredicted ? (
        <div className="alert-banner success">
          ✅ Ya enviaste tu predicción para {nextRace.nombre}
        </div>
      ) : (
        <div className="alert-banner">
          🔒 Las predicciones para {nextRace.nombre} están cerradas
        </div>
      )}
    </div>
  );
}

function StatsCards({ leaderboard, userId }) {
  const currentUser = leaderboard.find(u => u.userId === userId);
  
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">🏆</div>
        <div className="stat-value">{currentUser?.position || '-'}°</div>
        <div className="stat-label">Posición</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">📊</div>
        <div className="stat-value">{currentUser?.puntos || 0}</div>
        <div className="stat-label">Puntos</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">✅</div>
        <div className="stat-value">{currentUser?.exactos || 0}</div>
        <div className="stat-label">Exactos</div>
      </div>
    </div>
  );
}

function SeasonProgressBar({ temporada }) {
  const [progress, setProgress] = useState({ completed: 0, total: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const { data: races } = await supabase
          .from('races')
          .select('id, estado')
          .eq('temporada', temporada);

        const total = races?.length || 0;
        const completed = races?.filter(r => r.estado === 'finalizada').length || 0;
        const percentage = total > 0 ? (completed / total) * 100 : 0;

        setProgress({ completed, total, percentage });
      } catch (err) {
        console.error('Error fetching progress:', err);
      } finally {
        setLoading(false);
      }
    }

    if (temporada) {
      fetchProgress();
    }
  }, [temporada]);

  if (loading) return null;

  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: 20,
      marginBottom: 24
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
      }}>
        <div>
          <div style={{
            fontSize: 11,
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 4
          }}>
            Progreso de la Temporada {temporada}
          </div>
          <div style={{
            fontFamily: 'Barlow Condensed',
            fontSize: 24,
            fontWeight: 900,
            color: 'var(--white)'
          }}>
            {progress.completed} / {progress.total} carreras
          </div>
        </div>
        <div style={{
          fontFamily: 'Barlow Condensed',
          fontSize: 48,
          fontWeight: 900,
          color: 'var(--red)'
        }}>
          {Math.round(progress.percentage)}%
        </div>
      </div>
      
      <div style={{
        width: '100%',
        height: 12,
        background: 'var(--bg3)',
        borderRadius: 6,
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          width: `${progress.percentage}%`,
          height: '100%',
          background: 'linear-gradient(90deg, var(--red), #FF3355)',
          transition: 'width 0.5s ease',
          borderRadius: 6
        }} />
      </div>

      <div style={{
        fontSize: 12,
        color: 'var(--muted)',
        marginTop: 8,
        textAlign: 'center'
      }}>
        {progress.total - progress.completed > 0 
          ? `${progress.total - progress.completed} carreras pendientes` 
          : '✅ Temporada completada'}
      </div>
    </div>
  );
}

function LeaderboardTab({ leaderboard, userId, groupId }) {
  const [expandedUser, setExpandedUser] = useState(null);
  const { details, loading: detailsLoading, loadDetails } = useUserRaceDetails(groupId, expandedUser);

  const getMedal = (position) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return '';
  };

  const handleToggleExpand = (user) => {
    if (expandedUser === user.userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(user.userId);
      loadDetails();
    }
  };

  useEffect(() => {
    if (expandedUser) {
      loadDetails();
    }
  }, [expandedUser]);

  if (leaderboard.length === 0) {
    return <SkeletonTable rows={5} columns={5} />;
  }

  return (
    <div className="leaderboard-table">
      <table>
        <thead>
          <tr>
            <th style={{ width: 50 }}></th>
            <th>#</th>
            <th>Usuario</th>
            <th>Puntos</th>
            <th>Exactos</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map(user => {
            const isExpanded = expandedUser === user.userId;
            
            return (
              <>
                <tr 
                  key={user.userId} 
                  className={user.userId === userId ? 'current-user' : ''}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleToggleExpand(user)}
                >
                  <td style={{ textAlign: 'center', fontSize: 16 }}>
                    {isExpanded ? '▼' : '▶'}
                  </td>
                  <td className="position-cell">
                    <span className="medal">{getMedal(user.position)}</span>
                    {user.position}
                  </td>
                  <td>{user.nombre}</td>
                  <td>{Math.round(user.puntos)}</td>
                  <td>{user.exactos}</td>
                </tr>

                {isExpanded && (
                  <tr>
                    <td colSpan={5} style={{ padding: 0, background: 'var(--bg3)' }}>
                      {detailsLoading ? (
                        <div style={{ padding: 20, textAlign: 'center', color: 'var(--muted)' }}>
                          Cargando detalles...
                        </div>
                      ) : (
                        <div style={{ padding: 20 }}>
                          <div style={{
                            fontFamily: 'Barlow Condensed',
                            fontSize: 14,
                            fontWeight: 700,
                            color: 'var(--muted)',
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                            marginBottom: 12
                          }}>
                            📊 Detalle por Carrera
                          </div>
                          
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: 8
                          }}>
                            {details.map(race => (
                              <div
                                key={race.carrera_id}
                                style={{
                                  background: 'var(--bg2)',
                                  border: race.estado === 'finalizada' 
                                    ? `1px solid ${race.puntos > 0 ? 'var(--green)' : 'var(--border)'}` 
                                    : '1px solid var(--border)',
                                  borderRadius: 8,
                                  padding: 12,
                                  fontSize: 13,
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <div style={{
                                  fontSize: 11,
                                  color: 'var(--muted)',
                                  marginBottom: 4
                                }}>
                                  R{race.ronda} • {race.nombre}
                                </div>
                                
                                {race.estado === 'finalizada' ? (
                                  <div style={{
                                    fontFamily: 'Barlow Condensed',
                                    fontSize: 20,
                                    fontWeight: 900,
                                    color: race.puntos > 0 ? 'var(--green)' : 'var(--muted)'
                                  }}>
                                    {Math.round(race.puntos)} pts
                                  </div>
                                ) : (
                                  <div style={{
                                    fontSize: 12,
                                    color: 'var(--muted)',
                                    fontStyle: 'italic'
                                  }}>
                                    {race.predijo ? '✓ Predicho' : '⏳ Pendiente'}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          <div style={{
                            marginTop: 16,
                            paddingTop: 16,
                            borderTop: '1px solid var(--border)',
                            display: 'flex',
                            gap: 24,
                            fontSize: 13,
                            flexWrap: 'wrap'
                          }}>
                            <div>
                              <span style={{ color: 'var(--muted)' }}>Mejor carrera:</span>{' '}
                              <span style={{ fontWeight: 700, color: 'var(--green)' }}>
                                {Math.max(...details.map(d => d.puntos))} pts
                              </span>
                            </div>
                            <div>
                              <span style={{ color: 'var(--muted)' }}>Promedio:</span>{' '}
                              <span style={{ fontWeight: 700 }}>
                                {Math.round(details.reduce((sum, d) => sum + d.puntos, 0) / details.filter(d => d.estado === 'finalizada').length || 0)} pts
                              </span>
                            </div>
                            <div>
                              <span style={{ color: 'var(--muted)' }}>Predicciones:</span>{' '}
                              <span style={{ fontWeight: 700 }}>
                                {details.filter(d => d.predijo).length}/{details.length}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DriversStandingsTab({ standings, loading }) {
  if (loading) {
    return <SkeletonTable rows={10} columns={5} />;
  }

  if (standings.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
        <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🏁</div>
        <div style={{ fontSize: 18, marginBottom: 8 }}>No hay datos disponibles</div>
        <div style={{ fontSize: 14 }}>Las clasificaciones aparecerán cuando haya carreras completadas</div>
      </div>
    );
  }

  const getMedal = (position) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return '';
  };

  return (
    <div className="leaderboard-table">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Piloto</th>
            <th>Equipo</th>
            <th>Carreras</th>
            <th>Puntos</th>
          </tr>
        </thead>
        <tbody>
          {standings.map(driver => (
            <tr key={driver.piloto_id}>
              <td className="position-cell">
                <span className="medal">{getMedal(driver.position)}</span>
                {driver.position}
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ 
                    fontSize: 12, 
                    color: 'var(--muted)',
                    fontFamily: 'monospace',
                    minWidth: 30
                  }}>
                    #{driver.numero}
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    {driver.nombre_completo || 'Desconocido'}
                  </span>
                  {driver.acronimo && (
                    <span style={{ 
                      fontSize: 11, 
                      color: 'var(--muted)',
                      fontFamily: 'monospace',
                      marginLeft: 4
                    }}>
                      {driver.acronimo}
                    </span>
                  )}
                </div>
              </td>
              <td style={{ color: 'var(--muted)', fontSize: 14 }}>
                {driver.equipo || 'N/A'}
              </td>
              <td style={{ textAlign: 'center', color: 'var(--muted)' }}>
                {driver.carreras}
              </td>
              <td style={{ 
                fontFamily: 'Barlow Condensed', 
                fontSize: 18, 
                fontWeight: 700 
              }}>
                {Math.round(driver.puntos)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TeamsStandingsTab({ standings, loading }) {
  if (loading) {
    return <SkeletonTable rows={10} columns={4} />;
  }

  if (standings.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
        <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🏁</div>
        <div style={{ fontSize: 18, marginBottom: 8 }}>No hay datos disponibles</div>
        <div style={{ fontSize: 14 }}>Las clasificaciones aparecerán cuando haya carreras completadas</div>
      </div>
    );
  }

  const getMedal = (position) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return '';
  };

  return (
    <div className="leaderboard-table">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Equipo</th>
            <th>Carreras</th>
            <th>Puntos</th>
          </tr>
        </thead>
        <tbody>
          {standings.map(team => (
            <tr key={team.equipo_id}>
              <td className="position-cell">
                <span className="medal">{getMedal(team.position)}</span>
                {team.position}
              </td>
              <td style={{ fontWeight: 600, fontSize: 15 }}>
                {team.nombre}
              </td>
              <td style={{ textAlign: 'center', color: 'var(--muted)' }}>
                {team.carreras}
              </td>
              <td style={{ 
                fontFamily: 'Barlow Condensed', 
                fontSize: 18, 
                fontWeight: 700 
              }}>
                {Math.round(team.puntos)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LastRaceTab({ groupId, temporada, userId, group }) {
  const { lastRace, results, predictions, drivers, loading } = useLastRace(groupId, temporada);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>📜</div>
        <div>Cargando última carrera...</div>
      </div>
    );
  }

  if (!lastRace) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
        <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🏁</div>
        <div style={{ fontSize: 18, marginBottom: 8 }}>No hay carreras completadas aún</div>
        <div style={{ fontSize: 14 }}>La información aparecerá cuando se complete la primera carrera</div>
      </div>
    );
  }

  const bestPrediction = predictions[0];
  const worstPrediction = predictions[predictions.length - 1];
  const avgPoints = predictions.length > 0 
    ? predictions.reduce((sum, p) => sum + p.puntos, 0) / predictions.length 
    : 0;

  const calculateCorrect = (userPositions) => {
    if (!userPositions || !results) return 0;
    let correct = 0;
    userPositions.slice(0, group.cantidad_posiciones || 10).forEach((pilotoId, idx) => {
      if (results[idx]?.piloto_id === pilotoId) {
        correct++;
      }
    });
    return correct;
  };

  return (
    <div>
      <div style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <div style={{ 
          fontSize: 12, 
          color: 'var(--muted)', 
          textTransform: 'uppercase', 
          letterSpacing: 1,
          marginBottom: 8
        }}>
          Última Carrera Completada
        </div>
        <h2 style={{
          fontFamily: 'Barlow Condensed',
          fontSize: 32,
          fontWeight: 900,
          color: 'var(--white)',
          marginBottom: 8
        }}>
          {lastRace.nombre}
        </h2>
        <div style={{ 
          fontSize: 14, 
          color: 'var(--muted)',
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap'
        }}>
          <span>📍 {lastRace.circuito}</span>
          <span>📅 {new Date(lastRace.fecha_programada).toLocaleDateString('es', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}</span>
          <span>👥 {predictions.length} predicciones</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        <div style={{
          background: 'var(--bg2)',
          border: '2px solid var(--green)',
          borderRadius: 12,
          padding: 20,
          textAlign: 'center',
          transition: 'transform 0.2s ease'
        }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            🏆 Mejor Predicción
          </div>
          <div style={{ fontFamily: 'Barlow Condensed', fontSize: 24, fontWeight: 900, color: 'var(--white)', marginBottom: 4 }}>
            {bestPrediction?.nombre || 'N/A'}
          </div>
          <div style={{ fontSize: 14, color: 'var(--green)', fontWeight: 700 }}>
            {Math.round(bestPrediction?.puntos || 0)} puntos • {calculateCorrect(bestPrediction?.posiciones)} exactos
          </div>
        </div>

        <div style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 20,
          textAlign: 'center',
          transition: 'transform 0.2s ease'
        }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            📊 Promedio del Grupo
          </div>
          <div style={{ fontFamily: 'Barlow Condensed', fontSize: 24, fontWeight: 900, color: 'var(--white)' }}>
            {Math.round(avgPoints)} puntos
          </div>
        </div>

        {worstPrediction && (
          <div style={{
            background: 'var(--bg2)',
            border: '1px solid rgba(232,0,45,0.3)',
            borderRadius: 12,
            padding: 20,
            textAlign: 'center',
            transition: 'transform 0.2s ease'
          }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              😅 Peor Predicción
            </div>
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: 24, fontWeight: 900, color: 'var(--white)', marginBottom: 4 }}>
              {worstPrediction.nombre}
            </div>
            <div style={{ fontSize: 14, color: 'var(--red)', fontWeight: 700 }}>
              {Math.round(worstPrediction.puntos)} puntos
            </div>
          </div>
        )}
      </div>

      <div style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: 24,
        marginBottom: 24
      }}>
        <h3 style={{
          fontFamily: 'Barlow Condensed',
          fontSize: 18,
          fontWeight: 800,
          color: 'var(--white)',
          marginBottom: 16,
          textTransform: 'uppercase',
          letterSpacing: 1
        }}>
          🏁 Resultado Oficial
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {results.slice(0, group.cantidad_posiciones || 10).map((result, idx) => {
            const driver = drivers[result.piloto_id];
            return (
              <div key={result.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                background: 'var(--bg3)',
                borderRadius: 8,
                border: '1px solid var(--border)',
                transition: 'transform 0.2s ease'
              }}>
                <span style={{
                  fontFamily: 'Barlow Condensed',
                  fontSize: 20,
                  fontWeight: 900,
                  color: 'var(--white)',
                  minWidth: 30
                }}>
                  {idx + 1}°
                </span>
                <span style={{ flex: 1, fontWeight: 600 }}>
                  {driver ? driver.nombre_completo : 'Desconocido'}
                </span>
                <span style={{
                  fontFamily: 'Barlow Condensed',
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--muted)'
                }}>
                  {result.puntos_f1} pts
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="leaderboard-table">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Usuario</th>
              <th>Exactos</th>
              <th>Puntos</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((pred, idx) => {
              const correctPredictions = calculateCorrect(pred.posiciones);
              const isCurrentUser = pred.usuario_id === userId;
              
              return (
                <tr key={pred.id} className={isCurrentUser ? 'current-user' : ''}>
                  <td className="position-cell">
                    {idx === 0 && '🥇'}
                    {idx === 1 && '🥈'}
                    {idx === 2 && '🥉'}
                    {idx + 1}
                  </td>
                  <td>{pred.nombre}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{
                      background: correctPredictions > 0 ? 'rgba(0,212,160,0.15)' : 'var(--bg3)',
                      color: correctPredictions > 0 ? 'var(--green)' : 'var(--muted)',
                      padding: '4px 12px',
                      borderRadius: 12,
                      fontWeight: 700,
                      fontSize: 14
                    }}>
                      {correctPredictions}
                    </span>
                  </td>
                  <td style={{
                    fontFamily: 'Barlow Condensed',
                    fontSize: 18,
                    fontWeight: 700
                  }}>
                    {Math.round(pred.puntos)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function GroupDashboard() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  const [activeTab, setActiveTab] = useState('general');
  
  const { group, nextRace, leaderboard, loading, error } = useGroupDashboard(groupId, user?.id);
  const { standings: driverStandings, loading: standingsLoading } = useDriverStandings(group?.temporada);
  const { standings: teamStandings, loading: teamsLoading } = useTeamStandings(group?.temporada);

  if (loading) {
    return (
      <>
        <style>{FONTS + CSS}</style>
        <div data-theme={theme} className="group-dashboard">
          <div style={{ 
            height: 200, 
            background: 'var(--bg2)', 
            border: '1px solid var(--border)',
            borderRadius: 16,
            marginBottom: 24,
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
          <SkeletonStats />
          <SkeletonTable rows={8} columns={4} />
        </div>
      </>
    );
  }

  if (error || !group) {
    return (
      <>
        <style>{FONTS + CSS}</style>
        <div data-theme={theme} className="group-dashboard">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Volver a todos los grupos
          </button>
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--red)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <div>Error al cargar el dashboard</div>
            <div style={{ fontSize: 14, marginTop: 8 }}>{error}</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div data-theme={theme} className="group-dashboard">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Volver a todos los grupos
        </button>

        <HeroBanner 
          group={group} 
          nextRace={nextRace} 
          navigate={navigate} 
          groupId={groupId}
        />
        
        <StatsCards leaderboard={leaderboard} userId={user.id} />
        <SeasonProgressBar temporada={group.temporada} />

        <div className="tabs-container">
          <div className="tabs-nav">
            <button 
              className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              📊 General
            </button>
            <button 
              className={`tab-btn ${activeTab === 'pilotos' ? 'active' : ''}`}
              onClick={() => setActiveTab('pilotos')}
            >
              🏎️ Pilotos
            </button>
            <button 
              className={`tab-btn ${activeTab === 'equipos' ? 'active' : ''}`}
              onClick={() => setActiveTab('equipos')}
            >
              🏁 Equipos
            </button>
            <button 
              className={`tab-btn ${activeTab === 'ultima' ? 'active' : ''}`}
              onClick={() => setActiveTab('ultima')}
            >
              📜 Última Carrera
            </button>
          </div>

          <div className="tab-content" key={activeTab}>
            {activeTab === 'general' && <LeaderboardTab leaderboard={leaderboard} userId={user.id} groupId={groupId} />}
            {activeTab === 'pilotos' && (
              <DriversStandingsTab standings={driverStandings} loading={standingsLoading} />
            )}
            {activeTab === 'equipos' && (
              <TeamsStandingsTab standings={teamStandings} loading={teamsLoading} />
            )}
            {activeTab === 'ultima' && (
              <LastRaceTab 
                groupId={groupId} 
                temporada={group.temporada} 
                userId={user.id}
                group={group}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}