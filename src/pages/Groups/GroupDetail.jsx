import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useToastStore } from '../../stores/toastStore';
import { useGroupMembers } from '../../hooks/useGroupMembers';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import { supabase } from '../../lib/supabase';

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

.group-detail {
  padding: 24px 28px;
  max-width: 1200px;
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

  .member-actions {
    width: 100%;
    justify-content: flex-end;
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

  // Handlers
  const handleRemoveMember = async () => {
    const result = await removeMember(confirmRemove.member.id);
    if (result.success) {
      toast.success(`${confirmRemove.member.fullName} ha sido eliminado del grupo`);
      refresh();
    } else {
      toast.error('Error al eliminar el miembro');
    }
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
  };

  const handleShareGroup = () => {
    const inviteLink = `${window.location.origin}/join/${group.codigo_invitacion}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success('¡Link de invitación copiado! 📋');
  };

  const getInitials = (name, lastName) => {
    return `${name?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?';
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
              <span>{group.sistema_puntos === 'podio' ? 'Podio' : group.sistema_puntos === 'exactos' ? 'Exactos' : 'Mixto'}</span>
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
              <button 
                className="btn btn-secondary"
                onClick={() => navigate(`/admin/group/${groupId}`)}
              >
                ⚙️ Configuración
              </button>
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
            <div className="info-value">
              {group.sistema_puntos === 'podio' && 'Podio'}
              {group.sistema_puntos === 'exactos' && 'Exactos'}
              {group.sistema_puntos === 'mixto' && 'Mixto'}
            </div>
          </div>

          <div className="info-card">
            <div className="info-label">Posiciones a Predecir</div>
            <div className="info-value">{group.cantidad_posiciones || 10}</div>
          </div>

          <div className="info-card">
            <div className="info-label">Cierre de Predicciones</div>
            <div className="info-value">{group.horas_cierre_prediccion || 2}h antes</div>
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