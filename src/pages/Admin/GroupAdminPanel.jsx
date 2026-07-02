import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { toast } from 'sonner';
import { useTranslation, getDateLocale, getRaceName } from '../../i18n';
import BackButton from '../../components/BackButton';
import { isNative } from '../../hooks/usePlatform';

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

html, body { 
  background: var(--bg); 
  color: var(--white); 
}

#root {
  background: var(--bg);
}

.admin-container {
  background: var(--bg);
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
  font-size: var(--fs-page-title);
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
  font-size: var(--fs-body);
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
  font-size: var(--fs-section-title);
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
  font-size: var(--fs-small);
  color: var(--muted);
}

.member-badges {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.badge {
  font-size: var(--fs-label);
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
  font-size: var(--fs-small);
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
  font-size: var(--fs-small);
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.info-value {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: var(--fs-section-title);
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
  font-size: var(--fs-subtitle);
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
  font-size: var(--fs-small);
  font-weight: 700;
  transition: all 0.2s;
}

.btn-copy:hover {
  background: var(--red);
  color: white;
}

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
  font-size: var(--fs-section-title);
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
  font-size: var(--fs-body);
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

/* 🆕 Fastest Lap Section */
.fastest-lap-section {
  margin-top: 24px;
}

.race-fastest-card {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.race-fastest-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.race-fastest-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: var(--fs-subtitle);
  font-weight: 800;
  color: var(--white);
}

.race-fastest-date {
  font-size: var(--fs-small);
  color: var(--muted);
}

.fastest-lap-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.fastest-lap-select {
  flex: 1;
  padding: 10px 14px;
  background: var(--bg2);
  border: 1px solid var(--border2);
  border-radius: 8px;
  color: var(--white);
  font-size: 16px;
  font-family: 'Barlow', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}

.fastest-lap-select:hover {
  border-color: var(--red);
}

.fastest-lap-select:focus {
  outline: none;
  border-color: var(--red);
  box-shadow: 0 0 0 3px rgba(232, 0, 45, 0.1);
}

.fastest-lap-select option {
  background: var(--bg2);
  color: var(--white);
}

.btn-save-fastest {
  padding: 10px 20px;
  background: linear-gradient(135deg, var(--green), #00A67E);
  border: none;
  border-radius: 8px;
  color: white;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: var(--fs-small);
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.2s;
  min-width: 100px;
}

.btn-save-fastest:hover {
  opacity: 0.9;
}

.btn-save-fastest:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-clear-fastest {
  padding: 10px 16px;
  background: transparent;
  border: 1px solid var(--border2);
  border-radius: 8px;
  color: var(--muted);
  font-family: 'Barlow Condensed', sans-serif;
  font-size: var(--fs-small);
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-clear-fastest:hover {
  border-color: var(--red);
  color: var(--red);
}

.current-fastest {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 14px;
  background: rgba(0, 212, 160, 0.1);
  border: 1px solid rgba(0, 212, 160, 0.3);
  border-radius: 8px;
  font-size: var(--fs-small);
}

.current-fastest-icon {
  font-size: 16px;
}

.current-fastest-text {
  color: var(--green);
  font-weight: 700;
}
@media (max-width: 768px) {
  .admin-container {
    padding: 16px;
  }

  .admin-header {
    flex-wrap: wrap;
    gap: 12px;
  }

  
  .group-info {
    grid-template-columns: 1fr;
  }

  .member-card {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
  }

  .member-actions {
    flex-direction: column;
    width: 100%;
  }

  .btn-action {
    width: 100%;
    padding: 12px 16px;
    text-align: center;
  }

  .code-box {
    flex-wrap: wrap;
  }
}
`;

export default function GroupAdminPanel() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  const { t, locale } = useTranslation();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState(null);
  
  const [pozoData, setPozoData] = useState({ pozo_habilitado: false, pozo_monto_por_persona: 0, pozo_moneda: 'USD', pozo_distribucion: '60-25-15' });
  const [savingPozo, setSavingPozo] = useState(false);
  const [requiereAprobacion, setRequiereAprobacion] = useState(false);
  const [savingApproval, setSavingApproval] = useState(false);
  const [memberLimitInfo, setMemberLimitInfo] = useState(null);


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
      setRequiereAprobacion(groupData.requiere_aprobacion || false);
      setGroup(groupData);

      // Verificar que el usuario es admin
      const { data: memberCheck } = await supabase
        .from('group_members')
        .select('es_admin')
        .eq('grupo_id', groupId)
        .eq('usuario_id', user.id)
        .single();
        // Inicializar datos del pozo
      const distPreset = (() => {
        const d = groupData.pozo_distribucion;
        if (!d) return '60-25-15';
        if (d['1'] === 60) return '60-25-15';
        if (d['1'] === 50) return '50-30-20';
        if (d['1'] === 70) return '70-20-10';
        if (d['1'] === 100) return '100-0-0';
        return '60-25-15';
      })();
      setPozoData({
        pozo_habilitado: groupData.pozo_habilitado || false,
        pozo_monto_por_persona: groupData.pozo_monto_por_persona || 0,
        pozo_moneda: groupData.pozo_moneda || 'USD',
        pozo_distribucion: distPreset
      });
      if (!memberCheck?.es_admin && groupData.creador_id !== user.id) {
        toast.error(t('errors.notAdmin'));
        navigate(`/group/${groupId}`);
        return;
      }

      const { data: allMembersData, error: membersError } = await supabase
        .rpc('get_group_members_full', { p_grupo_id: groupId });

      if (membersError) throw membersError;

      const sortedMembers = (allMembersData || []).sort(
        (a, b) => new Date(a.joined_at) - new Date(b.joined_at)
      );

      const toUiShape = (m) => ({
        id: m.id,
        usuario_id: m.usuario_id,
        es_admin: m.es_admin,
        estado: m.estado,
        users: { id: m.usuario_id, email: m.email, nombre: m.nombre, apellido: m.apellido }
      });

      setMembers(sortedMembers.filter(m => m.estado === 'aprobado').map(toUiShape));
      setPendingMembers(sortedMembers.filter(m => m.estado === 'pendiente').map(toUiShape));

      const { data: limitData } = await supabase.rpc('get_member_limit_info', { p_grupo_id: groupId });
      setMemberLimitInfo(limitData?.[0] || null);
    

    } catch (err) {
      console.error('Error loading group data:', err);
      toast.error(t('errors.loadingGroup'));
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

      toast.success(t('admin.memberApproved'));
      loadGroupData();
    } catch (err) {
      console.error('Error approving member:', err);
      toast.error(t('admin.errorApproving'));
    }
  };

  const handleRejectMember = async (memberId) => {
    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast.success(t('admin.requestRejected'));
      loadGroupData();
    } catch (err) {
      console.error('Error rejecting member:', err);
      toast.error(t('admin.errorRejecting'));
    }
  };

  const handleRemoveMember = async (member) => {
    setConfirmModal({
      title: t('admin.confirmRemove'),
      message: t('admin.confirmRemoveMsg', { name: member.users?.nombre || member.users?.email }),
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('group_members')
            .delete()
            .eq('id', member.id);

          if (error) throw error;

          toast.success(t('admin.memberRemoved'));
          loadGroupData();
          setConfirmModal(null);
        } catch (err) {
          console.error('Error removing member:', err);
          toast.error(t('admin.errorRemoving'));
        }
      }
    });
  };

  const handleToggleAdmin = async (member) => {
    
      if (member.usuario_id === group.creador_id) {
      toast.error(t('admin.errorCannotToggleCreatorAdmin'));
      return;
    }
    const action = member.es_admin ? t('admin.actionRemove') : t('admin.actionGrant');
    const actionCapitalized = member.es_admin ? t('admin.actionRemoveCap') : t('admin.actionGrantCap');

    
    setConfirmModal({
      title: t('admin.confirmAdmin', { action: actionCapitalized }),
      message: t('admin.confirmAdminMsg', { action, name: member.users?.nombre || member.users?.email }),
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('group_members')
            .update({ es_admin: !member.es_admin })
            .eq('id', member.id);

          if (error) throw error;

          toast.success(member.es_admin ? t('admin.adminRemoved') : t('admin.adminGranted'));
          loadGroupData();
          setConfirmModal(null);
        } catch (err) {
          console.error('Error toggling admin:', err);
          toast.error(t('admin.errorTogglingAdmin'));
        }
      }
    });
  };
  const handleToggleApproval = async (checked) => {
  setSavingApproval(true);
  try {
    const { error } = await supabase.from('groups').update({ requiere_aprobacion: checked }).eq('id', groupId);
    if (error) throw error;
    setRequiereAprobacion(checked);
    toast.success(checked ? t('admin.approvalEnabledToast') : t('admin.approvalDisabledToast'));
  } catch (err) {
    console.error('Error toggling approval requirement:', err);
    toast.error(t('admin.errorSavingApproval'));
  } finally {
    setSavingApproval(false);
  }
};

  const handleCopyCode = () => {
    navigator.clipboard.writeText(group.codigo_invitacion);
    toast.success(t('admin.codeCopied'));
  };


const handleTransferOwnership = async (member) => {
  setConfirmModal({
    title: t('admin.confirmTransferTitle'),
    message: t('admin.confirmTransferMsg', { name: member.users?.nombre || member.users?.email }),
    onConfirm: async () => {
      try {
        const { error } = await supabase.rpc('transferir_titularidad', {
          p_grupo_id: groupId,
          p_nuevo_titular_id: member.usuario_id
        });

        if (error) {
          if (error.message?.includes('RECIPIENT_GROUP_LIMIT_REACHED')) {
            toast.error(t('admin.errorTransferRecipientLimit'));
          } else {
            throw error;
          }
          return;
        }

        toast.success(t('admin.titleTransferred'));
        loadGroupData();
        setConfirmModal(null);
      } catch (err) {
        console.error('Error transferring ownership:', err);
        toast.error(t('admin.errorTransferring'));
      }
    }
  });
};


  if (loading) {
    return (
      <>
        <style>{FONTS + CSS}</style>
        <div data-theme={theme} className="admin-container">
          <div className="empty-state">{t('common.loading')}</div>
        </div>
      </>
    );
  }
  const esElTitularActual = group?.creador_id === user.id;

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div data-theme={theme} className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <h1 className="admin-title">{t('admin.title')}</h1>
          <BackButton className="btn-back" onClick={() => navigate(`/group/${groupId}`)}>
            {t('admin.back')}
          </BackButton>
        </div>

        {/* Info del Grupo */}
        <div className="admin-section">
          <h2 className="section-title">{t('admin.groupInfo')}</h2>
          <div className="group-info">
            <div className="info-box">
              <div className="info-label">{t('admin.name')}</div>
              <div className="info-value">{group?.nombre}</div>
            </div>
            <div className="info-box">
              <div className="info-label">{t('admin.season')}</div>
              <div className="info-value">{group?.temporada}</div>
            </div>
            <div className="info-box">
              <div className="info-label">{t('common.members')}</div>
              <div className="info-value">{members.length}</div>
            </div>
            <div className="info-box">
              <div className="info-label">{t('admin.inviteCode')}</div>
              <div className="code-box">
                <div className="code-value">{group?.codigo_invitacion}</div>
                <button className="btn-copy" onClick={handleCopyCode}>
                  📋
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Configuración de unión al grupo */}
          <div className="admin-section">
            <h2 className="section-title">👥 {t('admin.joinSettingsTitle')}</h2>
            <label style={{
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
              padding: 16, background: 'var(--bg3)', borderRadius: 10,
              border: `1px solid ${requiereAprobacion ? 'var(--gold)' : 'var(--border)'}`
            }}>
              <input
                type="checkbox"
                checked={requiereAprobacion}
                disabled={savingApproval}
                onChange={e => handleToggleApproval(e.target.checked)}
                style={{ width: 18, height: 18, cursor: 'pointer' }}
              />
              <div>
                <div style={{ fontWeight: 700, color: 'var(--white)', fontSize: 'var(--fs-subtitle)' }}>{t('admin.requireApprovalLabel')}</div>
                <div style={{ fontSize: 'var(--fs-small)', color: 'var(--muted)' }}>{t('admin.requireApprovalSub')}</div>
              </div>
            </label>
          </div>

        {/* Solicitudes Pendientes */}
        {pendingMembers.length > 0 && (
          <div className="admin-section">
            <h2 className="section-title">{t('admin.pendingRequests')} ({pendingMembers.length})</h2>
            <div className="members-list">
              {pendingMembers.map(member => (
                <div key={member.id} className="member-card">
                  <div className="member-info">
                    <div className="member-avatar">
                      {member.users?.nombre?.[0]?.toUpperCase() || member.users?.email?.[0]?.toUpperCase()}
                    </div>
                    <div className="member-details">
                      <div className="member-name">
                        {member.users?.nombre ? `${member.users.nombre} ${member.users.apellido || ''}`.trim() : t('dashboard.defaultUserName')}
                      </div>
                      <div className="member-email">{member.users?.email}</div>
                      <div className="member-badges">
                        <span className="badge pending">{t('common.pending')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="member-actions">
                    <button 
                      className="btn-action btn-approve"
                      onClick={() => handleApproveMember(member.id)}
                    >
                      {t('admin.approve')}
                    </button>
                    <button 
                      className="btn-action btn-reject"
                      onClick={() => handleRejectMember(member.id)}
                    >
                      {t('admin.reject')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Miembros Actuales */}
        <div className="admin-section">
          <h2 className="section-title">
            {t('admin.currentMembers')} ({members.length}{memberLimitInfo && !memberLimitInfo.es_ilimitado ? `/${memberLimitInfo.limite}` : ''})
          </h2>
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
                        {member.users?.nombre ? `${member.users.nombre} ${member.users.apellido || ''}`.trim() : t('dashboard.defaultUserName')}
                        {isCurrentUser && ` (${t('admin.youSuffix')})`}
                      </div>
                      <div className="member-email">{member.users?.email}</div>
                      <div className="member-badges">
                        {member.es_admin && <span className="badge admin">{t('dashboard.admin')}</span>}
                        {isCreator && <span className="badge admin">{t('admin.creatorBadge')}</span>}
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
                          {member.es_admin ? t('admin.removeAdmin') : t('admin.makeAdmin')}
                        </button>
                        <button 
                          className="btn-action btn-remove"
                          onClick={() => handleRemoveMember(member)}
                        >
                          {t('admin.remove')}
                        </button>
                      </>
                    )}
                    {esElTitularActual && !isCurrentUser && (
                      <button 
                        className="btn-action btn-make-admin"
                        onClick={() => handleTransferOwnership(member)}
                        title={t('admin.transferOwnership')}
                      >
                        👑 {t('admin.transferOwnership')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

       

        {/* 💰 CONFIGURACIÓN DEL POZO */}
        <div className="admin-section">
          <h2 className="section-title">🏁 {t('podioPoints.title')}</h2>
          <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-body)', marginBottom: 20, lineHeight: 1.6 }}>
            {t('podioPoints.configDescription')}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
              padding: 16, background: 'var(--bg3)', borderRadius: 10,
              border: `1px solid ${pozoData.pozo_habilitado ? 'var(--gold)' : 'var(--border)'}`
            }}>
              <input type="checkbox" checked={pozoData.pozo_habilitado}
                onChange={e => setPozoData({ ...pozoData, pozo_habilitado: e.target.checked })}
                style={{ width: 18, height: 18, cursor: 'pointer' }} />
              <div>
                <div style={{ fontWeight: 700, color: 'var(--white)', fontSize: 'var(--fs-subtitle)' }}>{t('podioPoints.enable')}</div>
                <div style={{ fontSize: 'var(--fs-small)', color: 'var(--muted)' }}>{t('podioPoints.enableSub')}</div>
              </div>
            </label>

            {pozoData.pozo_habilitado && (
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
                {!isNative ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label className="info-label">{t('podioPoints.amountPerPerson')}</label>
                    <input type="number" min="0" value={pozoData.pozo_monto_por_persona}
                      onChange={e => setPozoData({ ...pozoData, pozo_monto_por_persona: Number(e.target.value) })}
                      style={{
                        width: '100%', padding: '10px 14px', background: 'var(--bg2)',
                        border: '1px solid var(--border)', borderRadius: 8, color: 'var(--white)',
                        fontSize: 16, fontFamily: "'Share Tech Mono', monospace", boxSizing: 'border-box'
                      }} />
                  </div>
                  <div>
                    <label className="info-label">{t('podioPoints.referenceUnit')}</label>
                    <select value={pozoData.pozo_moneda}
                      onChange={e => setPozoData({ ...pozoData, pozo_moneda: e.target.value })}
                      className="fastest-lap-select">
                      <option value="USD">{t('currencies.USD')}</option>
                      <option value="PYG">{t('currencies.PYG')}</option>
                      <option value="BRL">{t('currencies.BRL')}</option>
                      <option value="ARS">{t('currencies.ARS')}</option>
                      <option value="EUR">{t('currencies.EUR')}</option>
                    </select>
                  </div>
                </div>) : (
                  <div style={{
                    padding: 12, background: 'var(--bg2)', borderRadius: 8,
                    border: '1px solid var(--border)', fontSize: 'var(--fs-small)', color: 'var(--muted)', marginBottom: 16
                  }}>
                    ℹ️ {t('podioPoints.webOnlyConfig')}
                  </div>
                )}

                <div style={{ marginBottom: 16 }}>
                  <label className="info-label">{t('podioPoints.distribution')}</label>
                  <select value={pozoData.pozo_distribucion}
                    onChange={e => setPozoData({ ...pozoData, pozo_distribucion: e.target.value })}
                    className="fastest-lap-select">
                    <option value="60-25-15">{t('createGroup.dist602515')}</option>
                    <option value="50-30-20">{t('createGroup.dist503020')}</option>
                    <option value="70-20-10">{t('createGroup.dist702010')}</option>
                    <option value="100-0-0">{t('createGroup.dist100')} {t('createGroup.distAllToWinner')}</option>
                  </select>
                </div>

                {!isNative && pozoData.pozo_monto_por_persona > 0 && (
                  <div style={{
                    padding: 12, background: 'var(--bg2)', borderRadius: 8,
                    border: '1px solid var(--border)', fontSize: 'var(--fs-small)', color: 'var(--muted)', marginBottom: 16
                  }}>
                   {t('podioPoints.estimatedTotal')}: <strong style={{ color: 'var(--gold)', fontFamily: "'Barlow Condensed'", fontSize: 'var(--fs-section-title)' }}>
                    {pozoData.pozo_moneda === 'PYG' ? '₲' : pozoData.pozo_moneda === 'BRL' ? 'R$' : '$'} {(pozoData.pozo_monto_por_persona * members.length).toLocaleString(getDateLocale(locale))}
                  </strong> {t('admin.potMembersBreakdown', { count: members.length, amount: pozoData.pozo_monto_por_persona.toLocaleString(getDateLocale(locale)) })}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={async () => {
                setSavingPozo(true);
                try {
                  const presets = {
                    '60-25-15': { "1": 60, "2": 25, "3": 15 },
                    '50-30-20': { "1": 50, "2": 30, "3": 20 },
                    '70-20-10': { "1": 70, "2": 20, "3": 10 },
                    '100-0-0': { "1": 100 }
                  };
                  const { error } = await supabase.from('groups').update({
                    pozo_habilitado: pozoData.pozo_habilitado,
                    pozo_monto_por_persona: pozoData.pozo_monto_por_persona,
                    pozo_moneda: pozoData.pozo_moneda,
                    pozo_distribucion: presets[pozoData.pozo_distribucion] || presets['60-25-15']
                  }).eq('id', groupId);
                  if (error) throw error;
                  toast.success(t('podioPoints.configSaved'));
                } catch (err) {
                  console.error(err);
                  toast.error(t('admin.errorSavingPot'));
                } finally {
                  setSavingPozo(false);
                }
              }}
              disabled={savingPozo}
              className="btn-save-fastest"
              style={{ alignSelf: 'flex-start' }}
            >
              {savingPozo ? t('admin.savingPot') : `💾 ${t('podioPoints.saveConfig')}`}
            </button>
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
                  {t('common.confirm')}
                </button>
                <button 
                  className="btn-modal btn-modal-cancel"
                  onClick={() => setConfirmModal(null)}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}