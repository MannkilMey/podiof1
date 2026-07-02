import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useToastStore } from '../../stores/toastStore';
import { supabase } from '../../lib/supabase';
import { useTranslation } from '../../i18n';

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

.join-page {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.join-container {
  max-width: 500px;
  width: 100%;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  animation: fadeInUp 0.5s ease-out;
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

.join-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.join-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: var(--fs-display);
  font-weight: 900;
  color: var(--white);
  margin-bottom: 12px;
}

.join-subtitle {
  color: var(--muted);
  font-size: var(--fs-subtitle);
  margin-bottom: 24px;
}

.group-info {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  text-align: left;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: var(--muted);
  font-size: var(--fs-small);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.info-value {
  color: var(--white);
  font-weight: 600;
  font-size: var(--fs-subtitle);
}

.btn-join {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, var(--red), #FF3355);
  border: none;
  border-radius: 12px;
  color: white;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: var(--fs-subtitle);
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 12px;
}

.btn-join:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.btn-join:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-back {
  width: 100%;
  padding: 16px;
  background: transparent;
  border: 2px solid var(--border);
  border-radius: 12px;
  color: var(--white);
  font-family: 'Barlow Condensed', sans-serif;
  font-size: var(--fs-subtitle);
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-back:hover {
  border-color: var(--red);
  color: var(--red);
}

.error-message {
  color: var(--red);
  font-size: var(--fs-body);
  margin-top: 12px;
}
`;

export default function JoinGroup() {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  const toast = useToastStore();
  const { t } = useTranslation();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGroup();
  }, [inviteCode]);

  const loadGroup = async () => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('codigo_invitacion', inviteCode)
        .single();

      if (error) throw error;
      setGroup(data);
    } catch (err) {
      console.error('Error loading group:', err);
      setError(t('joinGroup.invalidOrExpiredCode'));
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!user) {
      toast.info(t('joinGroup.loginRequired'));
      navigate('/login');
      return;
    }

    setJoining(true);

    try {
      // Verificar si ya es miembro
      const { data: existingMember } = await supabase
        .from('group_members')
        .select('id, estado')
        .eq('grupo_id', group.id)
        .eq('usuario_id', user.id)
        .maybeSingle();

      if (existingMember) {
        if (existingMember.estado === 'aprobado') {
          toast.info(t('joinGroup.alreadyMemberInfo'));
          navigate(`/group/${group.id}`);
          return;
        } else if (existingMember.estado === 'pendiente') {
          toast.info(t('joinGroup.alreadyRequestedInfo'));
          navigate('/');
          return;
        }
      }

      // Unirse al grupo
      const { error: insertError } = await supabase
        .from('group_members')
        .insert({
          grupo_id: group.id,
          usuario_id: user.id,
          estado: group.requiere_aprobacion ? 'pendiente' : 'aprobado',
          es_admin: false
        });

      if (insertError) {
        if (insertError.message?.includes('FREE_MEMBER_LIMIT_REACHED')) {
          throw new Error(t('joinGroup.memberLimitReached'));
        }
        throw insertError;
      }

      if (group.requiere_aprobacion) {
        toast.success(t('joinGroup.pendingApproval', { name: group.nombre }));
        navigate('/');
      } else {
        toast.success(t('joinGroup.joined', { name: group.nombre }));
        navigate(`/group/${group.id}`);
      }
    } catch (err) {
      console.error('Error joining group:', err);
      toast.error(err.message || t('joinGroup.errorJoining'));
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <>
        <style>{FONTS + CSS}</style>
        <div data-theme={theme} className="join-page">
          <div className="join-container">
            <div className="join-icon">🏎</div>
            <div>{t('common.loading')}</div>
          </div>
        </div>
      </>
    );
  }

  if (error || !group) {
    return (
      <>
        <style>{FONTS + CSS}</style>
        <div data-theme={theme} className="join-page">
          <div className="join-container">
            <div className="join-icon">❌</div>
            <h1 className="join-title">{t('joinGroup.invalidLinkTitle')}</h1>
            <p className="join-subtitle">
              {error || t('joinGroup.groupNotFoundFallback')}
            </p>
            <button className="btn-back" onClick={() => navigate('/')}>
              {t('joinGroup.backToHome')}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div data-theme={theme} className="join-page">
        <div className="join-container">
          <div className="join-icon">🏁</div>
          <h1 className="join-title">{t('joinGroup.title')}</h1>
          <p className="join-subtitle">
            {t('joinGroup.invitedSubtitle')}
          </p>

          <div className="group-info">
            <div className="info-row">
              <span className="info-label">{t('joinGroup.groupLabel')}</span>
              <span className="info-value">{group.nombre}</span>
            </div>
            <div className="info-row">
              <span className="info-label">{t('admin.season')}</span>
              <span className="info-value">{group.temporada}</span>
            </div>
            <div className="info-row">
              <span className="info-label">{t('joinGroup.approvalLabel')}</span>
              <span className="info-value">
                {group.requiere_aprobacion ? t('joinGroup.approvalRequired') : t('joinGroup.approvalAutomatic')}
              </span>
            </div>
          </div>

          <button 
            className="btn-join" 
            onClick={handleJoin}
            disabled={joining}
          >
            {joining ? t('joinGroup.joiningBtn') : t('joinGroup.joinBtnFull')}
          </button>

          <button className="btn-back" onClick={() => navigate('/')}>
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </>
  );
}