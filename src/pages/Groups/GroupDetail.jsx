import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useToastStore } from '../../stores/toastStore';
import { useGroupMembers } from '../../hooks/useGroupMembers';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import { supabase } from '../../lib/supabase';
import { canPredictRace, canPredictRaceSync} from '../../utils/canPredictRace';

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

/* ✅ Background global */
html, body { 
  background: var(--bg); 
  color: var(--white); 
}

#root {
  background: var(--bg);
}

.group-detail {
  background: var(--bg);
  padding: 24px 28px;
  max-width: 1200px;
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

.header-section {
  background: linear-gradient(135deg, var(--bg2), var(--bg3));
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
}

.group-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 36px;
  font-weight: 900;
  color: var(--white);
  margin-bottom: 8px;
}

.group-info {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  font-size: 14px;
  color: var(--muted);
  margin-bottom: 20px;
}

.group-info-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.group-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, var(--red), #FF3355);
  color: white;
}

.btn-secondary {
  background: var(--bg3);
  border: 1px solid var(--border2);
  color: var(--white);
}

.btn-danger {
  background: transparent;
  border: 2px solid var(--red);
  color: var(--red);
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.info-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
}

.info-label {
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.info-value {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--white);
}

.members-section {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: var(--white);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.member-card {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
  gap: 16px;
  flex-wrap: wrap;
}

.member-card:hover {
  background: var(--bg4);
}

.member-card.current-user {
  border-color: var(--red);
  background: var(--red-dim);
}

.member-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.member-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--red), #FF3355);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: white;
}

.member-details {
  flex: 1;
}

.member-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 2px;
}

.member-email {
  font-size: 13px;
  color: var(--muted);
}

.member-badges {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.badge-admin {
  background: var(--red-dim);
  color: var(--red);
}

.badge-you {
  background: rgba(0, 212, 160, 0.15);
  color: var(--green);
}

.member-stats {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-right: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
}

.stat-value {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 20px;
  font-weight: 900;
  color: var(--white);
}

.stat-label {
  font-size: 10px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

.member-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--border2);
  background: transparent;
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 16px;
}

.btn-icon:hover {
  background: var(--bg2);
  border-color: var(--red);
  color: var(--red);
}

.btn-icon.danger:hover {
  background: var(--red-dim);
  border-color: var(--red);
  color: var(--red);
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
  font-size: 18px;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 8px;
}

.empty-message {
  font-size: 14px;
  color: var(--muted);
  margin-bottom: 24px;
}

/* ✅ MODAL PREDICCIONES */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 700px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  margin-bottom: 24px;
}

.modal-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 28px;
  font-weight: 900;
  color: var(--white);
  margin-bottom: 8px;
}

.modal-subtitle {
  font-size: 14px;
  color: var(--muted);
}

.races-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.race-item {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.race-item.past {
  opacity: 0.5;
}

.race-item-info {
  flex: 1;
}

.race-item-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 4px;
}

.race-item-date {
  font-size: 13px;
  color: var(--muted);
}

.race-item-status {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.race-item-status.open {
  background: rgba(0, 212, 160, 0.15);
  color: var(--green);
}

.race-item-status.closed {
  background: rgba(255, 184, 0, 0.15);
  color: #FFB800;
}

.race-item-status.forced {
  background: var(--red-dim);
  color: var(--red);
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg4);
  border: 1px solid var(--border2);
  transition: 0.3s;
  border-radius: 28px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: var(--white);
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background: var(--red);
  border-color: var(--red);
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

input:disabled + .toggle-slider {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

@media (max-width: 768px) {
  .group-detail {
    padding: 16px;
  }

  .header-section {
    padding: 20px;
  }

  .group-title {
    font-size: 28px;
  }

  .group-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .member-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .member-stats {
    width: 100%;
    justify-content: space-around;
    padding: 12px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    margin: 0;
  }

  .member-badges {
    width: 100%;
  }

  .member-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .modal-content {
    padding: 24px;
    max-width: 100%;
  }

  .race-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
`;

export default function GroupDetail() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  const toast = useToastStore();

  const [group, setGroup] = useState(null);
  const [groupLoading, setGroupLoading] = useState(true);
  const [currentUserMember, setCurrentUserMember] = useState(null);
  
  const { members, loading: membersLoading, removeMember, makeAdmin, removeAdmin, leaveGroup, refresh } = useGroupMembers(groupId);

  // Modales
  const [confirmRemove, setConfirmRemove] = useState({ show: false, member: null });
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [confirmToggleAdmin, setConfirmToggleAdmin] = useState({ show: false, member: null });
  
  // ✅ Modal de predicciones
  const [showPredictionsModal, setShowPredictionsModal] = useState(false);
  const [races, setRaces] = useState([]);
  const [racesLoading, setRacesLoading] = useState(false);

  // ✅ NUEVO: Estados para tracking de predicciones
  const [expandedRace, setExpandedRace] = useState(null);
  const [predictionStats, setPredictionStats] = useState({});
  const [loadingStats, setLoadingStats] = useState(false);

  // Cargar información del grupo
  useEffect(() => {
    async function loadGroup() {
      try {
        setGroupLoading(true);
        
        const { data: groupData, error: groupError } = await supabase
          .from('groups')
          .select('*')
          .eq('id', groupId)
          .single();

        if (groupError) throw groupError;

        const { data: memberData, error: memberError } = await supabase
          .from('group_members')
          .select('*')
          .eq('grupo_id', groupId)
          .eq('usuario_id', user.id)
          .single();

        if (memberError && memberError.code !== 'PGRST116') throw memberError;

        setGroup(groupData);
        setCurrentUserMember(memberData);
      } catch (err) {
        console.error('Error loading group:', err);
        toast.error('Error al cargar el grupo');
      } finally {
        setGroupLoading(false);
      }
    }

    if (groupId && user) {
      loadGroup();
    }
  }, [groupId, user]);

  // Cargar carreras para modal
  const loadRaces = async () => {
    try {
      setRacesLoading(true);
      
      // 1. Obtener todas las carreras de la temporada
      const { data: racesData, error: racesError } = await supabase
        .from('races')
        .select('*')
        .eq('temporada', group.temporada)
        .order('fecha_programada', { ascending: true });

      if (racesError) throw racesError;

      // 2. Obtener configuraciones específicas de ESTE grupo
      const { data: groupRacesData, error: groupRacesError } = await supabase
        .from('group_races')
        .select('carrera_id, predicciones_forzadas_abiertas')
        .eq('grupo_id', groupId);

      if (groupRacesError && groupRacesError.code !== 'PGRST116') {
        throw groupRacesError;
      }

      // 3. Crear lookup de configuraciones por carrera
      const configMap = {};
      (groupRacesData || []).forEach(config => {
        configMap[config.carrera_id] = config.predicciones_forzadas_abiertas;
      });

      // 4. Combinar carreras con configuración específica del grupo
      const racesWithConfig = (racesData || []).map(race => ({
        ...race,
        predicciones_forzadas_abiertas: 
          configMap[race.id] !== undefined 
            ? configMap[race.id] 
            : race.predicciones_forzadas_abiertas
      }));

      setRaces(racesWithConfig);
    } catch (err) {
      console.error('Error loading races:', err);
      toast.error('Error al cargar carreras');
    } finally {
      setRacesLoading(false);
    }
  };

  // ✅ NUEVO: Cargar estadísticas de predicciones por carrera
  const loadPredictionStats = async (raceId) => {
    try {
      setLoadingStats(true);

      // 1. Obtener miembros aprobados del grupo
      const { data: membersData, error: membersError } = await supabase
        .from('group_members')
        .select(`
          usuario_id,
          users:usuario_id (
            id,
            nombre,
            apellido,
            email
          )
        `)
        .eq('grupo_id', groupId)
        .eq('estado', 'aprobado');

      if (membersError) throw membersError;

      // 2. Obtener predicciones de esta carrera
      const { data: predictionsData, error: predictionsError } = await supabase
        .from('predictions')
        .select('usuario_id, created_at, updated_at')
        .eq('grupo_id', groupId)
        .eq('carrera_id', raceId);

      if (predictionsError) throw predictionsError;

      // 3. Crear mapa de predicciones por usuario
      const predictionMap = {};
      (predictionsData || []).forEach(pred => {
        predictionMap[pred.usuario_id] = {
          createdAt: pred.created_at,
          updatedAt: pred.updated_at,
          wasModified: pred.created_at !== pred.updated_at
        };
      });

      // 4. Clasificar usuarios
      const hasPredicted = [];
      const missing = [];

      (membersData || []).forEach(member => {
        const user = member.users;
        const fullName = `${user.nombre || ''} ${user.apellido || ''}`.trim() || user.email;
        
        if (predictionMap[member.usuario_id]) {
          const pred = predictionMap[member.usuario_id];
          hasPredicted.push({
            userId: member.usuario_id,
            name: fullName,
            lastModified: pred.updatedAt,
            wasModified: pred.wasModified
          });
        } else {
          missing.push({
            userId: member.usuario_id,
            name: fullName
          });
        }
      });

      // 5. Ordenar por última modificación
      hasPredicted.sort((a, b) => 
        new Date(b.lastModified) - new Date(a.lastModified)
      );

      setPredictionStats(prev => ({
        ...prev,
        [raceId]: {
          hasPredicted,
          missing,
          total: membersData.length
        }
      }));

    } catch (err) {
      console.error('Error loading prediction stats:', err);
      toast.error('Error al cargar estadísticas');
    } finally {
      setLoadingStats(false);
    }
  };

  // ✅ NUEVO: Toggle expand race
  const handleToggleRaceExpand = (raceId) => {
    if (expandedRace === raceId) {
      setExpandedRace(null);
    } else {
      setExpandedRace(raceId);
      if (!predictionStats[raceId]) {
        loadPredictionStats(raceId);
      }
    }
  };

  const handleToggleForcedPredictions = async (raceId, currentValue) => {
    try {
      const newValue = !currentValue;
      
      // ⚠️ TEMPORAL: Actualizar races directamente (afecta todos los grupos)
      const { error } = await supabase
        .from('races')
        .update({ predicciones_forzadas_abiertas: newValue })
        .eq('id', raceId);

      if (error) throw error;

      // Actualizar estado local inmediatamente
      setRaces(prevRaces => 
        prevRaces.map(race => 
          race.id === raceId 
            ? { ...race, predicciones_forzadas_abiertas: newValue }
            : race
        )
      );

      toast.success(
        newValue 
          ? '✅ Predicciones abiertas (TODOS los grupos)' 
          : '🔒 Predicciones cerradas (TODOS los grupos)'
      );
    } catch (err) {
      console.error('Error toggling predictions:', err);
      toast.error('Error al cambiar estado');
      loadRaces();
    }
  };

  // Handlers existentes
  const handleRemoveMember = async () => {
    const result = await removeMember(confirmRemove.member.id);
    if (result.success) {
      toast.success(`${confirmRemove.member.fullName} ha sido eliminado del grupo`);
      refresh();
    } else {
      toast.error('Error al eliminar el miembro');
    }
    setConfirmRemove({ show: false, member: null });
  };

  const handleLeaveGroup = async () => {
    const result = await leaveGroup(user.id);
    if (result.success) {
      toast.success('Has abandonado el grupo');
      navigate('/');
    } else {
      toast.error('Error al salir del grupo');
    }
  };

  const handleToggleAdmin = async () => {
    const member = confirmToggleAdmin.member;
    const result = member.isAdmin 
      ? await removeAdmin(member.id)
      : await makeAdmin(member.id);

    if (result.success) {
      toast.success(member.isAdmin ? 'Admin removido' : 'Admin asignado');
      refresh();
    } else {
      toast.error('Error al cambiar permisos');
    }
    setConfirmToggleAdmin({ show: false, member: null });
  };

  const handleShareGroup = () => {
    const inviteLink = `${window.location.origin}/join/${group.codigo_invitacion}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success('¡Link de invitación copiado! 📋');
  };

  // Abrir modal de predicciones
  const handleManagePredictions = () => {
    setShowPredictionsModal(true);
    loadRaces();
  };

  const getInitials = (name, lastName) => {
    return `${name?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ✅ NUEVO: Función helper para tiempo relativo
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `hace ${diffMins} min`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    if (diffDays === 1) return 'hace 1 día';
    return `hace ${diffDays} días`;
  };

  if (groupLoading || membersLoading) {
    return (
      <>
        <style>{FONTS + CSS}</style>
        <div data-theme={theme} className="group-detail">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">Cargando detalles del grupo...</div>
          </div>
        </div>
      </>
    );
  }

  if (!group || !currentUserMember) {
    return (
      <>
        <style>{FONTS + CSS}</style>
        <div data-theme={theme} className="group-detail">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Volver
          </button>
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <div className="empty-title">Grupo no encontrado</div>
            <div className="empty-message">
              No tienes acceso a este grupo o no existe
            </div>
          </div>
        </div>
      </>
    );
  }

  const isAdmin = currentUserMember.es_admin;
  const approvedMembers = members.filter(m => m.status === 'aprobado');

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div data-theme={theme} className="group-detail">
        <button className="back-btn" onClick={() => navigate(`/group/${groupId}`)}>
          ← Volver al Dashboard
        </button>

        {/* Header Section */}
        <div className="header-section">
          <h1 className="group-title">{group.nombre}</h1>
          
          <div className="group-info">
            <div className="group-info-item">
              <span>📅</span>
              <span>Temporada {group.temporada}</span>
            </div>
            <div className="group-info-item">
              <span>👥</span>
              <span>{approvedMembers.length} miembros</span>
            </div>
            <div className="group-info-item">
              <span>🎯</span>
              <span>Top {group.cantidad_posiciones || 10}</span>
            </div>
            {isAdmin && (
              <div className="group-info-item">
                <span>⚙️</span>
                <span>Administrador</span>
              </div>
            )}
          </div>

          <div className="group-actions">
            <button 
              className="btn btn-primary"
              onClick={handleShareGroup}
            >
              🔗 Compartir Grupo
            </button>
            
            {isAdmin && (
              <>
                <button 
                  className="btn btn-secondary"
                  onClick={handleManagePredictions}
                >
                  ⏰ Gestionar Predicciones
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate(`/admin/group/${groupId}`)}
                >
                  ⚙️ Configuración
                </button>
              </>
            )}
            
            <button 
              className="btn btn-danger"
              onClick={() => setConfirmLeave(true)}
            >
              🚪 Salir del Grupo
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="info-grid">
          <div className="info-card">
            <div className="info-label">Sistema de Puntos</div>
            <div className="info-value">F1 Oficial</div>
          </div>

          <div className="info-card">
            <div className="info-label">Posiciones a Predecir</div>
            <div className="info-value">{group.cantidad_posiciones || 10}</div>
          </div>

          <div className="info-card">
            <div className="info-label">Cierre de Predicciones</div>
            <div className="info-value">{group.horas_cierre_prediccion || 24}h antes</div>
          </div>

          <div className="info-card">
            <div className="info-label">Código de Invitación</div>
            <div className="info-value" style={{ fontSize: 18 }}>
              {group.codigo_invitacion}
            </div>
          </div>
        </div>

        {/* Members Section */}
        <div className="members-section">
          <div className="section-header">
            <h2 className="section-title">
              👥 Miembros ({approvedMembers.length})
            </h2>
          </div>

          {approvedMembers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <div className="empty-title">No hay miembros</div>
              <div className="empty-message">
                Comparte el link de invitación para que otros se unan
              </div>
            </div>
          ) : (
            <div className="members-list">
              {approvedMembers.map(member => {
                const isCurrentUser = member.userId === user.id;
                const canRemove = isAdmin && !isCurrentUser;
                const canToggleAdmin = isAdmin && !isCurrentUser;

                return (
                  <div 
                    key={member.id} 
                    className={`member-card ${isCurrentUser ? 'current-user' : ''}`}
                  >
                    <div className="member-info">
                      <div className="member-avatar">
                        {getInitials(member.name, member.lastName)}
                      </div>
                      <div className="member-details">
                        <div className="member-name">{member.fullName}</div>
                        <div className="member-email">{member.email}</div>
                      </div>
                    </div>

                    <div className="member-stats">
                      <div className="stat-item">
                        <div className="stat-value">{member.puntos || 0}</div>
                        <div className="stat-label">Puntos</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-value">{member.exactos || 0}</div>
                        <div className="stat-label">Exactos</div>
                      </div>
                    </div>

                    <div className="member-badges">
                      {member.isAdmin && (
                        <span className="badge badge-admin">⚙️ Admin</span>
                      )}
                      {isCurrentUser && (
                        <span className="badge badge-you">✓ Tú</span>
                      )}
                    </div>

                    {!isCurrentUser && isAdmin && (
                      <div className="member-actions">
                        {canToggleAdmin && (
                          <button
                            className="btn-icon"
                            onClick={() => setConfirmToggleAdmin({ show: true, member })}
                            title={member.isAdmin ? 'Quitar admin' : 'Hacer admin'}
                          >
                            {member.isAdmin ? '👤' : '⚙️'}
                          </button>
                        )}
                        {canRemove && (
                          <button
                            className="btn-icon danger"
                            onClick={() => setConfirmRemove({ show: true, member })}
                            title="Eliminar miembro"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ✅ Modal Gestionar Predicciones */}
        {showPredictionsModal && (
          <div className="modal-overlay" onClick={() => setShowPredictionsModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">⏰ Gestionar Predicciones</h2>
                <p className="modal-subtitle">
                  Habilita predicciones hasta el inicio de la carrera
                </p>
              </div>

              {racesLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <div className="loading-text">Cargando carreras...</div>
                </div>
              ) : (
                <div className="races-list">
                  {races.map(race => {
                    const now = new Date();
                    const raceStart = new Date(race.fecha_programada);
                    const isPast = now >= raceStart;
                    const status = canPredictRaceSync(race, group);
                    const isExpanded = expandedRace === race.id;
                    const stats = predictionStats[race.id];

                    return (
                      <div key={race.id}>
                        <div 
                          className={`race-item ${isPast ? 'past' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleToggleRaceExpand(race.id)}
                        >
                          <div className="race-item-info" style={{ flex: 1 }}>
                            <div className="race-item-name">
                              {race.nombre}
                              {stats && (
                                <span style={{ 
                                  marginLeft: 12, 
                                  fontSize: 13, 
                                  color: 'var(--green)',
                                  fontWeight: 600
                                }}>
                                  ✅ {stats.hasPredicted.length}/{stats.total}
                                </span>
                              )}
                            </div>
                            <div className="race-item-date">
                              {formatDate(race.fecha_programada)}
                            </div>
                            {isPast && (
                              <div className="race-item-status closed">
                                ✓ Finalizada
                              </div>
                            )}
                            {!isPast && race.predicciones_forzadas_abiertas && (
                              <div className="race-item-status forced">
                                🔓 Abierto hasta inicio
                              </div>
                            )}
                            {!isPast && !race.predicciones_forzadas_abiertas && status.canPredict && (
                              <div className="race-item-status open">
                                ✓ Normal
                              </div>
                            )}
                            {!isPast && !race.predicciones_forzadas_abiertas && !status.canPredict && (
                              <div className="race-item-status closed">
                                🔒 Cerrado
                              </div>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ 
                              fontSize: 20,
                              transition: 'transform 0.2s',
                              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}>
                              ▼
                            </span>

                            <label 
                              className="toggle-switch"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={race.predicciones_forzadas_abiertas || false}
                                disabled={isPast}
                                onChange={() => handleToggleForcedPredictions(
                                  race.id,
                                  race.predicciones_forzadas_abiertas
                                )}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </div>
                        </div>

                        {/* ✅ NUEVO: Panel expandible */}
                        {isExpanded && (
                          <div style={{
                            background: 'var(--bg4)',
                            border: '1px solid var(--border)',
                            borderTop: 'none',
                            borderRadius: '0 0 12px 12px',
                            padding: 20,
                            marginTop: -12,
                            marginBottom: 12
                          }}>
                            {loadingStats ? (
                              <div style={{ textAlign: 'center', padding: 20, color: 'var(--muted)' }}>
                                Cargando estadísticas...
                              </div>
                            ) : stats ? (
                              <>
                                {/* ✅ Han Predicho */}
                                {stats.hasPredicted.length > 0 && (
                                  <div style={{ marginBottom: 20 }}>
                                    <div style={{
                                      fontSize: 13,
                                      fontWeight: 700,
                                      color: 'var(--green)',
                                      marginBottom: 12,
                                      textTransform: 'uppercase',
                                      letterSpacing: 1
                                    }}>
                                      ✅ Han Predicho ({stats.hasPredicted.length})
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                      {stats.hasPredicted.map(user => (
                                        <div key={user.userId} style={{
                                          background: 'var(--bg3)',
                                          border: '1px solid var(--border)',
                                          borderRadius: 8,
                                          padding: '10px 14px',
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          fontSize: 13
                                        }}>
                                          <span style={{ color: 'var(--white)', fontWeight: 600 }}>
                                            {user.name}
                                          </span>
                                          <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 12,
                                            color: 'var(--muted)'
                                          }}>
                                            {user.wasModified && (
                                              <span style={{ color: '#FFB800' }}>🔄 Modificado</span>
                                            )}
                                            <span>{getTimeAgo(user.lastModified)}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* ✅ Faltan */}
                                {stats.missing.length > 0 && (
                                  <div>
                                    <div style={{
                                      fontSize: 13,
                                      fontWeight: 700,
                                      color: 'var(--red)',
                                      marginBottom: 12,
                                      textTransform: 'uppercase',
                                      letterSpacing: 1
                                    }}>
                                      ❌ Faltan ({stats.missing.length})
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                      {stats.missing.map(user => (
                                        <div key={user.userId} style={{
                                          background: 'var(--bg3)',
                                          border: '1px solid var(--border)',
                                          borderRadius: 8,
                                          padding: '10px 14px',
                                          fontSize: 13,
                                          color: 'var(--muted)'
                                        }}>
                                          {user.name}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </>
                            ) : null}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="modal-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowPredictionsModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Modals */}
        <ConfirmModal
          isOpen={confirmRemove.show}
          onClose={() => setConfirmRemove({ show: false, member: null })}
          onConfirm={handleRemoveMember}
          title="¿Eliminar miembro?"
          message={`¿Estás seguro de eliminar a ${confirmRemove.member?.fullName}? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          type="danger"
        />

        <ConfirmModal
          isOpen={confirmLeave}
          onClose={() => setConfirmLeave(false)}
          onConfirm={handleLeaveGroup}
          title="¿Salir del grupo?"
          message="Perderás acceso a las predicciones y la clasificación de este grupo. Podrás volver a unirte si tienes el código de invitación."
          confirmText="Sí, salir"
          cancelText="Cancelar"
          type="warning"
        />

        <ConfirmModal
          isOpen={confirmToggleAdmin.show}
          onClose={() => setConfirmToggleAdmin({ show: false, member: null })}
          onConfirm={handleToggleAdmin}
          title={confirmToggleAdmin.member?.isAdmin ? '¿Quitar admin?' : '¿Hacer admin?'}
          message={
            confirmToggleAdmin.member?.isAdmin
              ? `${confirmToggleAdmin.member?.fullName} dejará de ser administrador del grupo.`
              : `${confirmToggleAdmin.member?.fullName} podrá gestionar el grupo y sus miembros.`
          }
          confirmText={confirmToggleAdmin.member?.isAdmin ? 'Quitar admin' : 'Hacer admin'}
          cancelText="Cancelar"
          type="info"
        />
      </div>
    </>
  );
}