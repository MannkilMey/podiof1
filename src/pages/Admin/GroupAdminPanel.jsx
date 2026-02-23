import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
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

body {
  background: var(--bg);
  color: var(--white);
  font-family: 'Barlow', sans-serif;
}

.admin-container {
  padding: 24px 28px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.admin-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 32px;
  font-weight: 900;
  color: var(--white);
}

.btn-back {
  padding: 10px 20px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--white);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.btn-back:hover {
  border-color: var(--red);
}

.admin-section {
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
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.member-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 10px;
  transition: border-color 0.2s;
}

.member-card:hover {
  border-color: var(--border2);
}

.member-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #E8002D, #FF6B35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
}

.member-details {
  display: flex;
  flex-direction: column;
}

.member-name {
  font-weight: 700;
  color: var(--white);
}

.member-email {
  font-size: 13px;
  color: var(--muted);
}

.member-badges {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.badge {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge.admin {
  background: var(--red-dim);
  color: var(--red);
}

.badge.pending {
  background: rgba(255, 184, 0, 0.15);
  color: #FFB800;
}

.member-actions {
  display: flex;
  gap: 8px;
}

.btn-action {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-family: 'Barlow Condensed', sans-serif;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.btn-approve {
  background: var(--green);
  color: white;
}

.btn-approve:hover {
  opacity: 0.8;
}

.btn-reject {
  background: transparent;
  border: 1px solid var(--border2);
  color: var(--muted);
}

.btn-reject:hover {
  border-color: var(--red);
  color: var(--red);
}

.btn-remove {
  background: transparent;
  border: 1px solid var(--border2);
  color: var(--red);
}

.btn-remove:hover {
  background: var(--red-dim);
  border-color: var(--red);
}

.btn-make-admin {
  background: transparent;
  border: 1px solid var(--border2);
  color: var(--gold);
}

.btn-make-admin:hover {
  background: rgba(201, 168, 76, 0.1);
  border-color: var(--gold);
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--muted);
}

.group-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.info-box {
  background: var(--bg3);
  padding: 16px;
  border-radius: 10px;
  border: 1px solid var(--border);
}

.info-label {
  font-size: 12px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.info-value {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: var(--white);
}

.code-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.code-value {
  font-family: 'Share Tech Mono', monospace;
  font-size: 18px;
  letter-spacing: 3px;
  color: var(--red);
}

.btn-copy {
  padding: 6px 12px;
  background: var(--red-dim);
  border: 1px solid rgba(232, 0, 45, 0.3);
  border-radius: 6px;
  color: var(--red);
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  transition: all 0.2s;
}

.btn-copy:hover {
  background: var(--red);
  color: white;
}

/* Modal */
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
}

.modal {
  background: var(--bg2);
  border: 1px solid var(--border2);
  border-radius: 16px;
  padding: 32px;
  max-width: 450px;
  width: 100%;
  margin: 20px;
}

.modal-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: var(--white);
  margin-bottom: 12px;
}

.modal-text {
  color: var(--muted);
  margin-bottom: 24px;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.btn-modal {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-modal-danger {
  background: var(--red);
  border: none;
  color: white;
}

.btn-modal-danger:hover {
  opacity: 0.9;
}

.btn-modal-cancel {
  background: transparent;
  border: 1px solid var(--border2);
  color: var(--white);
}

.btn-modal-cancel:hover {
  border-color: var(--border2);
  background: var(--bg3);
}
`;

export default function GroupAdminPanel() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState(null);

  useEffect(() => {
    loadGroupData();
  }, [groupId]);

  const loadGroupData = async () => {
    try {
      // Cargar grupo
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

      if (groupError) throw groupError;
      setGroup(groupData);

      // Verificar que el usuario es admin
      const { data: memberCheck } = await supabase
        .from('group_members')
        .select('es_admin')
        .eq('grupo_id', groupId)
        .eq('usuario_id', user.id)
        .single();

      if (!memberCheck?.es_admin) {
        toast.error('No tienes permisos de administrador');
        navigate(`/group/${groupId}`);
        return;
      }

      // Cargar miembros aprobados
      const { data: membersData, error: membersError } = await supabase
        .from('group_members')
        .select(`
          id,
          usuario_id,
          es_admin,
          estado,
          users:usuario_id (
            id,
            email,
            nombre,
            apellido
          )
        `)
        .eq('grupo_id', groupId)
        .eq('estado', 'aprobado')
        .order('joined_at', { ascending: true });  // ← AGREGAR ESTA LÍNEA

      if (membersError) throw membersError;
      setMembers(membersData || []);

      // Cargar miembros pendientes
      const { data: pendingData, error: pendingError } = await supabase
        .from('group_members')
        .select(`
          id,
          usuario_id,
          estado,
          users:usuario_id (
            id,
            email,
            nombre,
            apellido
          )
        `)
        .eq('grupo_id', groupId)
        .eq('estado', 'pendiente')
       .order('joined_at', { ascending: true });  // ← AGREGAR ESTA LÍNEA

      if (pendingError) throw pendingError;
      setPendingMembers(pendingData || []);

    } catch (err) {
      console.error('Error loading group data:', err);
      toast.error('Error al cargar datos del grupo');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveMember = async (memberId) => {
    try {
      const { error } = await supabase
        .from('group_members')
        .update({ estado: 'aprobado' })
        .eq('id', memberId);

      if (error) throw error;

      toast.success('Miembro aprobado');
      loadGroupData();
    } catch (err) {
      console.error('Error approving member:', err);
      toast.error('Error al aprobar miembro');
    }
  };

  const handleRejectMember = async (memberId) => {
    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast.success('Solicitud rechazada');
      loadGroupData();
    } catch (err) {
      console.error('Error rejecting member:', err);
      toast.error('Error al rechazar solicitud');
    }
  };

  const handleRemoveMember = async (member) => {
    setConfirmModal({
      title: '¿Eliminar miembro?',
      message: `¿Estás seguro de que quieres eliminar a ${member.users?.nombre || member.users?.email} del grupo?`,
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('group_members')
            .delete()
            .eq('id', member.id);

          if (error) throw error;

          toast.success('Miembro eliminado');
          loadGroupData();
          setConfirmModal(null);
        } catch (err) {
          console.error('Error removing member:', err);
          toast.error('Error al eliminar miembro');
        }
      }
    });
  };

  const handleToggleAdmin = async (member) => {
    const action = member.es_admin ? 'quitar' : 'otorgar';
    
    setConfirmModal({
      title: `¿${action === 'quitar' ? 'Quitar' : 'Otorgar'} permisos de admin?`,
      message: `¿Estás seguro de que quieres ${action} permisos de administrador a ${member.users?.nombre || member.users?.email}?`,
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('group_members')
            .update({ es_admin: !member.es_admin })
            .eq('id', member.id);

          if (error) throw error;

          toast.success(member.es_admin ? 'Permisos de admin removidos' : 'Permisos de admin otorgados');
          loadGroupData();
          setConfirmModal(null);
        } catch (err) {
          console.error('Error toggling admin:', err);
          toast.error('Error al cambiar permisos');
        }
      }
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(group.codigo_invitacion);
    toast.success('Código copiado al portapapeles');
  };

  if (loading) {
    return (
      <>
        <style>{FONTS + CSS}</style>
        <div data-theme={theme} className="admin-container">
          <div className="empty-state">Cargando...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div data-theme={theme} className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <h1 className="admin-title">Administrar Grupo</h1>
          <button className="btn-back" onClick={() => navigate(`/group/${groupId}`)}>
            ← Volver
          </button>
        </div>

        {/* Info del Grupo */}
        <div className="admin-section">
          <h2 className="section-title">Información del Grupo</h2>
          <div className="group-info">
            <div className="info-box">
              <div className="info-label">Nombre</div>
              <div className="info-value">{group?.nombre}</div>
            </div>
            <div className="info-box">
              <div className="info-label">Temporada</div>
              <div className="info-value">{group?.temporada}</div>
            </div>
            <div className="info-box">
              <div className="info-label">Miembros</div>
              <div className="info-value">{members.length}</div>
            </div>
            <div className="info-box">
              <div className="info-label">Código de Invitación</div>
              <div className="code-box">
                <div className="code-value">{group?.codigo_invitacion}</div>
                <button className="btn-copy" onClick={handleCopyCode}>
                  📋
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Solicitudes Pendientes */}
        {pendingMembers.length > 0 && (
          <div className="admin-section">
            <h2 className="section-title">Solicitudes Pendientes ({pendingMembers.length})</h2>
            <div className="members-list">
              {pendingMembers.map(member => (
                <div key={member.id} className="member-card">
                  <div className="member-info">
                    <div className="member-avatar">
                      {member.users?.nombre?.[0]?.toUpperCase() || member.users?.email?.[0]?.toUpperCase()}
                    </div>
                    <div className="member-details">
                      <div className="member-name">
                        {member.users?.nombre ? `${member.users.nombre} ${member.users.apellido || ''}`.trim() : 'Usuario'}
                      </div>
                      <div className="member-email">{member.users?.email}</div>
                      <div className="member-badges">
                        <span className="badge pending">Pendiente</span>
                      </div>
                    </div>
                  </div>
                  <div className="member-actions">
                    <button 
                      className="btn-action btn-approve"
                      onClick={() => handleApproveMember(member.id)}
                    >
                      Aprobar
                    </button>
                    <button 
                      className="btn-action btn-reject"
                      onClick={() => handleRejectMember(member.id)}
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Miembros Actuales */}
        <div className="admin-section">
          <h2 className="section-title">Miembros ({members.length})</h2>
          <div className="members-list">
            {members.map(member => {
              const isCurrentUser = member.usuario_id === user.id;
              const isCreator = group.creador_id === member.usuario_id;

              return (
                <div key={member.id} className="member-card">
                  <div className="member-info">
                    <div className="member-avatar">
                      {member.users?.nombre?.[0]?.toUpperCase() || member.users?.email?.[0]?.toUpperCase()}
                    </div>
                    <div className="member-details">
                      <div className="member-name">
                        {member.users?.nombre ? `${member.users.nombre} ${member.users.apellido || ''}`.trim() : 'Usuario'}
                        {isCurrentUser && ' (Tú)'}
                      </div>
                      <div className="member-email">{member.users?.email}</div>
                      <div className="member-badges">
                        {member.es_admin && <span className="badge admin">Admin</span>}
                        {isCreator && <span className="badge admin">Creador</span>}
                      </div>
                    </div>
                  </div>
                  <div className="member-actions">
                    {!isCreator && !isCurrentUser && (
                      <>
                        <button 
                          className="btn-action btn-make-admin"
                          onClick={() => handleToggleAdmin(member)}
                        >
                          {member.es_admin ? 'Quitar Admin' : 'Hacer Admin'}
                        </button>
                        <button 
                          className="btn-action btn-remove"
                          onClick={() => handleRemoveMember(member)}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal de Confirmación */}
        {confirmModal && (
          <div className="modal-overlay" onClick={() => setConfirmModal(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">{confirmModal.title}</h3>
              <p className="modal-text">{confirmModal.message}</p>
              <div className="modal-actions">
                <button 
                  className="btn-modal btn-modal-danger"
                  onClick={confirmModal.onConfirm}
                >
                  Confirmar
                </button>
                <button 
                  className="btn-modal btn-modal-cancel"
                  onClick={() => setConfirmModal(null)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}