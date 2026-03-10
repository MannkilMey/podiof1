import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useToastStore } from '../../stores/toastStore';
import { supabase } from '../../lib/supabase';
import { canPredictRace } from '../../utils/canPredictRace';
import SharePredictionCard from '../../components/SharePredictionCard/SharePredictionCard';
import * as XLSX from 'xlsx';

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

html, body {
  background: var(--bg);
  color: var(--white);
}

#root {
  background: var(--bg);
}

.predictions-comparison {
  background: var(--bg);
  padding: 24px 28px;
  max-width: 1400px;
  margin: 0 auto;
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

.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 24px;
  border: 2px solid var(--border2);
  border-radius: 12px;
  background: var(--bg2);
  color: var(--white);
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn:hover {
  background: var(--bg3);
  transform: translateY(-2px);
}

.action-btn.primary {
  background: linear-gradient(135deg, var(--red), #FF3355);
  border-color: var(--red);
  color: white;
}

.action-btn.primary:hover {
  opacity: 0.9;
}

.most-voted-section {
  background: linear-gradient(135deg, var(--bg2), rgba(0,212,160,0.03));
  border: 2px solid var(--green);
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

.voted-positions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.voted-position-card {
  background: var(--bg3);
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s;
}

.voted-position-card:hover {
  background: var(--bg4);
  border-color: var(--green);
  transform: translateY(-2px);
}

.position-label {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.voted-driver-name {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 22px;
  font-weight: 900;
  color: var(--white);
  margin-bottom: 8px;
}

.vote-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--muted);
}

.vote-count {
  font-weight: 700;
  color: var(--green);
}

.vote-percentage {
  padding: 4px 8px;
  background: var(--green-dim);
  border-radius: 8px;
  color: var(--green);
  font-weight: 700;
}

.users-ranking-section {
  background: var(--bg2);
  border: 2px solid var(--gold);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.ranking-list {
  display: grid;
  gap: 12px;
}

.ranking-item {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s;
}

.ranking-item:hover {
  background: var(--bg4);
  transform: translateX(4px);
}

.ranking-item.current-user {
  border-color: var(--green);
  background: linear-gradient(135deg, var(--bg3), rgba(0,212,160,0.05));
}

.ranking-position {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 28px;
  font-weight: 900;
  min-width: 50px;
  text-align: center;
}

.ranking-position.first { color: #FFD700; }
.ranking-position.second { color: #C0C0C0; }
.ranking-position.third { color: #CD7F32; }
.ranking-position.other { color: var(--muted); }

.ranking-user-info {
  flex: 1;
}

.ranking-user-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 4px;
}

.ranking-user-stats {
  font-size: 12px;
  color: var(--muted);
  display: flex;
  gap: 12px;
}

.ranking-points {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 32px;
  font-weight: 900;
  color: var(--white);
  text-align: right;
}

.ranking-points-label {
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.official-result {
  background: var(--bg2);
  border: 2px solid var(--gold);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
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

.fastest-lap-icon {
  margin-left: auto;
  font-size: 16px;
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

.prediction-card.current-user {
  border-color: var(--green);
  background: linear-gradient(135deg, var(--bg2), rgba(0,212,160,0.03));
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

.share-result-btn {
  margin-top: 16px;
  width: 100%;
  padding: 12px 20px;
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
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.share-result-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
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

  .voted-positions-grid {
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
  const [group, setGroup] = useState(null);
  const [officialResult, setOfficialResult] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [drivers, setDrivers] = useState({});
  const [mostVotedByPosition, setMostVotedByPosition] = useState([]);
  const [userRanking, setUserRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPredictions, setShowPredictions] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState(null);
  
  // 🆕 Estado para modal de sistema de puntos
  const [showScoringModal, setShowScoringModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [groupId, raceId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Cargar grupo
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

      if (groupError) throw groupError;
      setGroup(groupData);

      // Cargar información de la carrera
      const { data: raceData, error: raceError } = await supabase
        .from('races')
        .select('*')
        .eq('id', raceId)
        .single();

      if (raceError) throw raceError;
      setRace(raceData);

      // Verificar si mostrar predicciones
      const predictionStatus = canPredictRace(raceData, groupData);
      const canStillPredict = predictionStatus.canPredict;
      setShowPredictions(!canStillPredict);

      // Cargar pilotos
      const { data: driversData } = await supabase
        .from('drivers')
        .select('*');

      const driversMap = {};
      driversData?.forEach(d => {
        driversMap[d.id] = d.nombre_completo;
      });
      setDrivers(driversMap);

      // Cargar resultado oficial
      const { data: resultsData } = await supabase
        .from('race_results')
        .select('*')
        .eq('carrera_id', raceId)
        .order('posicion_final', { ascending: true });

      setOfficialResult(resultsData || []);

      // Cargar pilotos más votados por posición
      const { data: mostVotedData, error: votedError } = await supabase
        .rpc('obtener_pilotos_mas_votados_por_posicion', {
          p_grupo_id: groupId,
          p_carrera_id: raceId
        });

      if (votedError) {
        console.error('Error loading most voted:', votedError);
      } else {
        setMostVotedByPosition(mostVotedData || []);
      }

      // Cargar predicciones
      const { data: predictionsData, error: predictionsError } = await supabase
        .from('predictions')
        .select(`
          *,
          users:usuario_id (
            id,
            nombre,
            apellido,
            email
          )
        `)
        .eq('grupo_id', groupId)
        .eq('carrera_id', raceId);

      if (predictionsError) {
        console.error('Error loading predictions:', predictionsError);
        throw predictionsError;
      }

      // Cargar scores por separado
      const { data: scoresData } = await supabase
        .from('scores')
        .select('*')
        .eq('grupo_id', groupId)
        .eq('carrera_id', raceId);

      // Crear mapa de scores por usuario_id
      const scoresMap = {};
      scoresData?.forEach(score => {
        scoresMap[score.usuario_id] = score;
      });

      // Combinar predictions con scores
      const transformedPredictions = predictionsData
        ?.map(pred => {
          const userScore = scoresMap[pred.usuario_id];
          
          return {
            ...pred,
            userName: `${pred.users?.nombre || ''} ${pred.users?.apellido || ''}`.trim() || pred.users?.email || 'Usuario',
            userEmail: pred.users?.email || '',
            puntos: userScore?.puntos || 0,
            aciertos_exactos: userScore?.aciertos_exactos || 0,
            aciertos_piloto: userScore?.aciertos_piloto || 0
          };
        })
        .sort((a, b) => {
          // Ordenar por puntos DESC, luego exactos DESC, luego piloto DESC
          if (b.puntos !== a.puntos) return b.puntos - a.puntos;
          if (b.aciertos_exactos !== a.aciertos_exactos) return b.aciertos_exactos - a.aciertos_exactos;
          return b.aciertos_piloto - a.aciertos_piloto;
        }) || [];

      setPredictions(transformedPredictions);

      // Crear ranking de usuarios
      const ranking = transformedPredictions.map((pred, idx) => ({
        position: idx + 1,
        userId: pred.usuario_id,
        userName: pred.userName,
        puntos: pred.puntos,
        aciertos_exactos: pred.aciertos_exactos,
        aciertos_piloto: pred.aciertos_piloto,
        isCurrentUser: pred.usuario_id === user.id
      }));

      setUserRanking(ranking);

    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Error al cargar las predicciones');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Hoja 1: Resultado Oficial
      const officialSheet = officialResult.slice(0, group?.cantidad_posiciones || 10).map((result, idx) => ({
        'Posición': idx + 1,
        'Piloto': drivers[result.piloto_id] || 'Desconocido',
        'Puntos F1': result.puntos_f1,
        'Vuelta Rápida': result.vuelta_rapida ? 'Sí' : 'No'
      }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(officialSheet), 'Resultado Oficial');

      // Hoja 2: Ranking Usuarios
      const rankingSheet = userRanking.map(user => ({
        'Posición': user.position,
        'Usuario': user.userName,
        'Puntos': user.puntos,
        'Aciertos Exactos': user.aciertos_exactos,
        'Piloto Correcto': user.aciertos_piloto
      }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rankingSheet), 'Ranking Usuarios');

      // Hoja 3: Votos por Posición
      const votesSheet = mostVotedByPosition.map(vote => ({
        'Posición': `P${vote.posicion}`,
        'Piloto': vote.piloto_nombre,
        'Total Votos': vote.total_votos,
        'Porcentaje': `${vote.porcentaje}%`
      }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(votesSheet), 'Votos por Posición');

      // Descargar archivo
      const fileName = `Resultados_${race.nombre.replace(/\s+/g, '_')}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast.success('Excel exportado correctamente');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Error al exportar Excel');
    }
  };

  const handleShareGeneralResults = () => {
  const topUser = userRanking[0];
  const avgPoints = userRanking.length > 0
    ? userRanking.reduce((sum, u) => sum + u.puntos, 0) / userRanking.length
    : 0;

  // ✅ NUEVO: Preparar resultado oficial (top 3 del podio)
  const maxPositions = group?.cantidad_posiciones || 10;
  const officialTop3 = officialResult.slice(0, Math.min(3, maxPositions)).map((result, idx) => ({
    posicion: idx + 1,
    piloto_nombre: drivers[result.piloto_id] || 'Desconocido',
    vuelta_rapida: result.vuelta_rapida || false
  }));

  setShareData({
    type: 'general',
    topUser: topUser?.userName || 'N/A',
    topPoints: topUser?.puntos || 0,
    totalParticipants: userRanking.length,
    avgPoints: Math.round(avgPoints),
    mostVoted: mostVotedByPosition.slice(0, 3),
    officialResult: officialTop3  // ✅ NUEVO: Resultado oficial
  });
  
  setShowShareModal(true);
};

  const getInitials = (name, lastName) => {
    return `${name?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?';
  };

  const calculateAccuracy = (positions) => {
    if (!positions || !officialResult.length) return 0;
    
    let correct = 0;
    const maxPositions = group?.cantidad_posiciones || 10;
    positions.slice(0, maxPositions).forEach((pilotoId, idx) => {
      if (officialResult[idx]?.piloto_id === pilotoId) {
        correct++;
      }
    });
    
    return (correct / maxPositions) * 100;
  };

  const isPredictionCorrect = (predictedPilotoId, position) => {
    return officialResult[position]?.piloto_id === predictedPilotoId;
  };

  const handleShareResult = (prediction, positionInRanking) => {
    const accuracy = calculateAccuracy(prediction.posiciones);
    const maxPositions = group?.cantidad_posiciones || 10;

    setShareData({
      type: 'individual',
      points: prediction.puntos,
      exactHits: prediction.aciertos_exactos,
      totalDrivers: maxPositions,
      position: positionInRanking,
      totalParticipants: predictions.length,
      accuracy: accuracy
    });
    
    setShowShareModal(true);
  };

  const getRankingPositionClass = (position) => {
    if (position === 1) return 'first';
    if (position === 2) return 'second';
    if (position === 3) return 'third';
    return 'other';
  };

  const getRankingEmoji = (position) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `${position}°`;
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

  if (!race || !showPredictions) {
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
              Las predicciones se podrán ver después del cierre. 
              {race?.predicciones_forzadas_abiertas && (
                <><br/>El administrador mantiene las predicciones abiertas.</>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  const maxPositions = group?.cantidad_posiciones || 10;

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div data-theme={theme} className="predictions-comparison">
        <button className="back-btn" onClick={() => navigate(`/group/${groupId}/races`)}>
          ← Volver a Carreras
        </button>

        <div className="race-header">
          <h1 className="race-title">{race.nombre}</h1>
          <p className="race-subtitle">📍 {race.circuito} • 📅 {new Date(race.fecha_programada).toLocaleDateString('es')}</p>
          <span className="race-status locked">
            🔒 Predicciones cerradas - Resultados disponibles
          </span>
        </div>

        <div className="action-buttons">
          <button className="action-btn primary" onClick={exportToExcel}>
            📥 Exportar a Excel
          </button>
          <button className="action-btn" onClick={handleShareGeneralResults}>
            🔗 Compartir Resultados
          </button>
          <button className="action-btn" onClick={() => setShowScoringModal(true)}>
            ℹ️ Sistema de Puntos
          </button>
        </div>

        {/* SECCIÓN 1: PILOTO MÁS VOTADO POR POSICIÓN */}
        {mostVotedByPosition.length > 0 && (
          <div className="most-voted-section">
            <h2 className="section-title">🎯 Piloto Más Votado por Posición</h2>
            <div className="voted-positions-grid">
              {mostVotedByPosition.map((vote) => (
                <div key={vote.posicion} className="voted-position-card">
                  <div className="position-label">P{vote.posicion}</div>
                  <div className="voted-driver-name">{vote.piloto_nombre}</div>
                  <div className="vote-stats">
                    <span className="vote-count">{vote.total_votos} votos</span>
                    <span className="vote-percentage">{vote.porcentaje}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECCIÓN 2: RANKING DE USUARIOS */}
        {userRanking.length > 0 && (
          <div className="users-ranking-section">
            <h2 className="section-title">🏆 Ranking de Usuarios</h2>
            <div className="ranking-list">
              {userRanking.map((rankUser) => (
                <div 
                  key={rankUser.userId} 
                  className={`ranking-item ${rankUser.isCurrentUser ? 'current-user' : ''}`}
                >
                  <div className={`ranking-position ${getRankingPositionClass(rankUser.position)}`}>
                    {getRankingEmoji(rankUser.position)}
                  </div>
                  <div className="ranking-user-info">
                    <div className="ranking-user-name">
                      {rankUser.userName}
                      {rankUser.isCurrentUser && <span style={{marginLeft: 8, fontSize: 12, color: 'var(--green)'}}>✓ Tú</span>}
                    </div>
                    <div className="ranking-user-stats">
                      <span>✓ {rankUser.aciertos_exactos} exactos</span>
                      <span>🎯 {rankUser.aciertos_piloto} pilotos correctos</span>
                    </div>
                  </div>
                  <div className="ranking-points">
                    <div>{Math.round(rankUser.puntos)}</div>
                    <div className="ranking-points-label">pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECCIÓN 3: RESULTADO OFICIAL */}
        {officialResult.length > 0 && (
          <div className="official-result">
            <h2 className="section-title">🏁 Resultado Oficial F1</h2>
            <div className="result-grid">
              {officialResult.slice(0, maxPositions).map((result, idx) => (
                <div key={result.id} className="position-card">
                  <div className="position-number">{idx + 1}°</div>
                  <div className="driver-name">{drivers[result.piloto_id] || 'Desconocido'}</div>
                  {result.vuelta_rapida && <span className="fastest-lap-icon">🏎️</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECCIÓN 3B: VUELTA RÁPIDA */}
        {officialResult.length > 0 && (
          <div className="official-result" style={{marginTop: 16}}>
            <h3 className="section-title" style={{fontSize: 18, marginBottom: 12}}>
              🏎️ Vuelta Más Rápida
            </h3>
            <div style={{display: 'flex', gap: 16, flexWrap: 'wrap'}}>
              {(() => {
                const fastestDriver = officialResult.find(r => r.vuelta_rapida);
                return fastestDriver ? (
                  <div className="position-card" style={{flex: 1, minWidth: 200}}>
                    <div style={{fontSize: 24}}>🏎️</div>
                    <div>
                      <div style={{fontSize: 12, color: 'var(--muted)', marginBottom: 4}}>
                        PILOTO
                      </div>
                      <div className="driver-name">
                        {drivers[fastestDriver.piloto_id] || 'Desconocido'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{color: 'var(--muted)', fontSize: 14}}>
                    No hay información de vuelta rápida
                  </div>
                );
              })()}
              
              {group?.bonus_vuelta_rapida_piloto && (
                <div style={{
                  padding: 12,
                  background: 'var(--green-dim)',
                  border: '1px solid var(--green)',
                  borderRadius: 10,
                  fontSize: 13,
                  color: 'var(--green)',
                  fontWeight: 600
                }}>
                  +{group.puntos_vuelta_rapida_piloto} puntos bonus por acertar
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECCIÓN 4: PREDICCIONES DETALLADAS */}
        <div className="predictions-section">
          <h2 className="section-title">
            📝 Predicciones Detalladas ({predictions.length})
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
                    className={`prediction-card ${isBest ? 'best' : ''} ${isCurrentUser ? 'current-user' : ''}`}
                  >
                    <div className="prediction-header">
                      <div className="user-info">
                        <div className="user-avatar">
                          {getInitials(prediction.users?.nombre, prediction.users?.apellido)}
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
                      <span>🎯 {prediction.aciertos_piloto || 0} pilotos correctos</span>
                    </div>

                    {/* 🆕 DESGLOSE DE PUNTOS */}
                    <div style={{
                      background: 'var(--bg3)',
                      border: '1px solid var(--border)',
                      borderRadius: 10,
                      padding: 12,
                      marginBottom: 12,
                      fontSize: 13
                    }}>
                      <div style={{
                        fontWeight: 700,
                        color: 'var(--white)',
                        marginBottom: 8,
                        fontSize: 12,
                        textTransform: 'uppercase',
                        letterSpacing: 1
                      }}>
                        📊 Desglose de Puntos
                      </div>
                      <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
                        {/* Puntos por posiciones */}
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                          <span style={{color: 'var(--muted)'}}>
                            Posiciones ({prediction.aciertos_exactos} exactos, {prediction.aciertos_piloto - prediction.aciertos_exactos} correctos)
                          </span>
                          <span style={{color: 'var(--white)', fontWeight: 700}}>
                            {(() => {
                              // Calcular puntos de posiciones (sin vuelta rápida)
                              const totalPuntos = prediction.puntos || 0;
                              const bonusVueltaRapida = (() => {
                                if (!group?.bonus_vuelta_rapida_piloto) return 0;
                                const fastestDriver = officialResult.find(r => r.vuelta_rapida);
                                if (!fastestDriver) return 0;
                                return prediction.vuelta_rapida_piloto_id === fastestDriver.piloto_id 
                                  ? (group.puntos_vuelta_rapida_piloto || 0)
                                  : 0;
                              })();
                              return Math.round(totalPuntos - bonusVueltaRapida);
                            })()}
                          </span>
                        </div>

                        {/* Bonus vuelta rápida */}
                        {group?.bonus_vuelta_rapida_piloto && (() => {
                          const fastestDriver = officialResult.find(r => r.vuelta_rapida);
                          const acerto = fastestDriver && prediction.vuelta_rapida_piloto_id === fastestDriver.piloto_id;
                          return (
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              color: acerto ? 'var(--green)' : 'var(--muted)'
                            }}>
                              <span>
                                {acerto ? '✓' : '✗'} Vuelta rápida piloto
                              </span>
                              <span style={{fontWeight: 700}}>
                                {acerto ? `+${group.puntos_vuelta_rapida_piloto}` : '0'}
                              </span>
                            </div>
                          );
                        })()}

                        {/* Línea divisoria */}
                        <div style={{
                          height: 1,
                          background: 'var(--border)',
                          margin: '4px 0'
                        }}></div>

                        {/* Total */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontWeight: 700,
                          color: 'var(--white)',
                          fontSize: 15
                        }}>
                          <span>TOTAL</span>
                          <span>{Math.round(prediction.puntos || 0)}</span>
                        </div>
                      </div>
                    </div>

                    {/* 🆕 PREDICCIÓN VUELTA RÁPIDA */}
                    {group?.bonus_vuelta_rapida_piloto && prediction.vuelta_rapida_piloto_id && (
                      <div style={{
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        borderRadius: 10,
                        padding: 12,
                        marginBottom: 12,
                        fontSize: 13
                      }}>
                        <div style={{
                          fontWeight: 700,
                          color: 'var(--white)',
                          marginBottom: 8,
                          fontSize: 12,
                          textTransform: 'uppercase',
                          letterSpacing: 1
                        }}>
                          🏎️ Predicción Vuelta Rápida
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                          }}>
                            <span style={{
                              fontSize: 20
                            }}>🏎️</span>
                            <span style={{
                              color: 'var(--white)',
                              fontWeight: 600
                            }}>
                              {drivers[prediction.vuelta_rapida_piloto_id] || 'Desconocido'}
                            </span>
                          </div>
                          {(() => {
                            const fastestDriver = officialResult.find(r => r.vuelta_rapida);
                            const acerto = fastestDriver && prediction.vuelta_rapida_piloto_id === fastestDriver.piloto_id;
                            return (
                              <span style={{
                                padding: '4px 12px',
                                background: acerto ? 'var(--green-dim)' : 'var(--red-dim)',
                                border: `1px solid ${acerto ? 'var(--green)' : 'var(--red)'}`,
                                borderRadius: 8,
                                color: acerto ? 'var(--green)' : 'var(--red)',
                                fontWeight: 700,
                                fontSize: 12
                              }}>
                                {acerto ? '✓ ACERTÓ' : '✗ FALLÓ'}
                              </span>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    <div className="prediction-positions">
                      {prediction.posiciones?.slice(0, maxPositions).map((pilotoId, position) => {
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

                    {isCurrentUser && (
                      <button 
                        className="share-result-btn"
                        onClick={() => handleShareResult(prediction, idx + 1)}
                      >
                        📸 Compartir mi Resultado
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 🆕 MODAL SISTEMA DE PUNTOS */}
      {showScoringModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 20
        }} onClick={() => setShowScoringModal(false)}>
          <div data-theme={theme} style={{
            background: 'var(--bg2)',
            border: '2px solid var(--border2)',
            borderRadius: 16,
            padding: 32,
            maxWidth: 600,
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{
              fontFamily: 'Barlow Condensed',
              fontSize: 28,
              fontWeight: 900,
              color: 'var(--white)',
              marginBottom: 20
            }}>
              📊 Sistema de Puntos - {group?.nombre}
            </h2>

            {/* Sistema base */}
            <div style={{marginBottom: 20}}>
              <h3 style={{
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--white)',
                marginBottom: 12
              }}>
                🏆 Puntos por Posición
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                gap: 8
              }}>
                {Object.entries(group?.sistema_puntos || {}).map(([pos, pts]) => (
                  <div key={pos} style={{
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: 10,
                    textAlign: 'center'
                  }}>
                    <div style={{fontSize: 12, color: 'var(--muted)', marginBottom: 4}}>
                      P{pos}
                    </div>
                    <div style={{fontSize: 20, fontWeight: 900, color: 'var(--gold)'}}>
                      {pts}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bonus exacto */}
            <div style={{marginBottom: 20}}>
              <h3 style={{fontSize: 16, fontWeight: 700, color: 'var(--white)', marginBottom: 8}}>
                🎯 Bonus Posición Exacta
              </h3>
              <div style={{
                background: 'var(--green-dim)',
                border: '1px solid var(--green)',
                borderRadius: 10,
                padding: 12,
                color: 'var(--green)',
                fontWeight: 600
              }}>
                +{group?.bonus_posicion_exacta || 0} puntos adicionales por acertar posición exacta
              </div>
            </div>

            {/* Piloto correcto */}
            {group?.usa_sistema_dual && (
              <div style={{marginBottom: 20}}>
                <h3 style={{fontSize: 16, fontWeight: 700, color: 'var(--white)', marginBottom: 8}}>
                  ✓ Piloto Correcto (sin posición exacta)
                </h3>
                <div style={{
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: 12,
                  color: 'var(--muted)'
                }}>
                  +{group?.puntos_piloto_correcto || 0} puntos si el piloto termina en top {group?.cantidad_posiciones}
                </div>
              </div>
            )}

            {/* Vuelta rápida */}
            {group?.bonus_vuelta_rapida_piloto && (
              <div style={{marginBottom: 20}}>
                <h3 style={{fontSize: 16, fontWeight: 700, color: 'var(--white)', marginBottom: 8}}>
                  🏎️ Bonus Vuelta Rápida
                </h3>
                <div style={{
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: 12,
                  color: 'var(--muted)'
                }}>
                  +{group?.puntos_vuelta_rapida_piloto || 0} puntos por acertar el piloto con vuelta más rápida
                </div>
              </div>
            )}

            {/* Ejemplo */}
            <div style={{
              background: 'var(--bg4)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 16,
              marginBottom: 20
            }}>
              <h3 style={{
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--white)',
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: 1
              }}>
                📝 Ejemplo de Cálculo
              </h3>
              <div style={{fontSize: 13, color: 'var(--muted)', lineHeight: 1.6}}>
                • Aciertas P1 exacto: {group?.sistema_puntos?.['1'] || 0} + {group?.bonus_posicion_exacta || 0} = {(group?.sistema_puntos?.['1'] || 0) + (group?.bonus_posicion_exacta || 0)} pts<br/>
                • Aciertas piloto en P2 pero termina P4: {group?.puntos_piloto_correcto || 0} pts<br/>
                • Aciertas vuelta rápida: +{group?.puntos_vuelta_rapida_piloto || 0} pts
              </div>
            </div>

            {/* Botón cerrar */}
            <button style={{
              width: '100%',
              padding: 14,
              background: 'linear-gradient(135deg, var(--red), #FF3355)',
              border: 'none',
              borderRadius: 10,
              color: 'white',
              fontFamily: 'Barlow Condensed',
              fontSize: 16,
              fontWeight: 800,
              cursor: 'pointer',
              marginTop: 20
            }} onClick={() => setShowScoringModal(false)}>
              CERRAR
            </button>
          </div>
        </div>
      )}

      {showShareModal && shareData && (
        <SharePredictionCard
          type={shareData.type || "result"}
          data={shareData}
          raceName={race.nombre}
          user={user}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
}