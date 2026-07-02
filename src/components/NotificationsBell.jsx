import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { useTranslation, getDateLocale } from '../i18n';

const CSS = `
.notif-wrapper { position: relative; }
.notif-badge { position: absolute; top: -4px; right: -4px; background: var(--red); color: white; font-size: var(--fs-label); font-weight: 800; min-width: 16px; height: 16px; border-radius: 8px; display: flex; align-items: center; justify-content: center; padding: 0 4px; }
.notif-dropdown { position: absolute; top: calc(100% + 8px); right: 0; width: 340px; max-height: 420px; overflow-y: auto; background: var(--bg2); border: 1px solid var(--border2); border-radius: 14px; box-shadow: 0 8px 30px rgba(0,0,0,0.3); z-index: 1000; }
.notif-header { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; border-bottom: 1px solid var(--border); }
.notif-header-title { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: var(--fs-body); color: var(--white); text-transform: uppercase; letter-spacing: 1px; }
.notif-mark-all { font-size: var(--fs-label); color: var(--red); cursor: pointer; background: none; border: none; font-weight: 700; }
.notif-item { display: flex; gap: 10px; padding: 12px 16px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.15s; }
.notif-item:hover { background: var(--bg3); }
.notif-item.unread { background: var(--red-dim); }
.notif-icon { font-size: 20px; flex-shrink: 0; }
.notif-content { flex: 1; min-width: 0; }
.notif-title { font-size: var(--fs-small); font-weight: 700; color: var(--white); margin-bottom: 2px; }
.notif-message { font-size: var(--fs-small); color: var(--muted); line-height: 1.4; }
.notif-time { font-size: var(--fs-label); color: var(--muted); margin-top: 4px; }
.notif-dismiss { background: none; border: none; color: var(--muted); cursor: pointer; font-size: 14px; padding: 2px 6px; flex-shrink: 0; }
.notif-dismiss:hover { color: var(--red); }
.notif-empty { padding: 40px 20px; text-align: center; color: var(--muted); font-size: var(--fs-small); }
`;

export default function NotificationsBell() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { t, locale } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const wrapperRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.leido).length;

  useEffect(() => {
    if (!user) return;
    loadNotifications();

    // 🔴 Tiempo real — los nuevos eventos aparecen sin recargar la página
    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `usuario_id=eq.${user.id}`
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('usuario_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, leido: true } : n));
    const { error } = await supabase
      .from('notifications')
      .update({ leido: true })
      .eq('id', notifId);
    if (error) console.error('Error marking notification as read:', error);
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.leido).map(n => n.id);
    if (unreadIds.length === 0) return;
    setNotifications(prev => prev.map(n => ({ ...n, leido: true })));
    const { error } = await supabase
      .from('notifications')
      .update({ leido: true })
      .in('id', unreadIds);
    if (error) console.error('Error marking all as read:', error);
  };

  const handleNotificationClick = (notif) => {
    if (!notif.leido) markAsRead(notif.id);
    setShowDropdown(false);
    if (notif.grupo_id) navigate(`/group/${notif.grupo_id}`);
  };

  const handleDismiss = (e, notifId) => {
    e.stopPropagation(); // No disparar la navegación del click del item
    markAsRead(notifId);
  };

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleString(getDateLocale(locale), {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });

  // 🔒 Traduce cada notificación según su tipo, usando los datos crudos guardados en metadata.
  // Si no hay metadata (notificaciones viejas, anteriores al ALTER TABLE), usa el texto fijo en español como respaldo.
  const renderNotification = (notif) => {
    const m = notif.metadata;
    if (!m) return { titulo: notif.titulo, mensaje: notif.mensaje };

    switch (notif.tipo) {
      case 'solicitud_grupo':
        return {
          titulo: t('notifications.types.solicitudGrupo.titulo'),
          mensaje: t('notifications.types.solicitudGrupo.mensaje', { nombre: m.solicitante_nombre, grupo: m.grupo_nombre })
        };
      case 'grupo_aprobado':
        return {
          titulo: t('notifications.types.grupoAprobado.titulo'),
          mensaje: t('notifications.types.grupoAprobado.mensaje', { grupo: m.grupo_nombre })
        };
      case 'grupo_rechazado':
        return {
          titulo: t('notifications.types.grupoRechazado.titulo'),
          mensaje: t('notifications.types.grupoRechazado.mensaje', { grupo: m.grupo_nombre })
        };
      case 'badge_desbloqueado': {
        const badgeNombre = m.badge_key ? t(`badges.items.${m.badge_key}.nombre`) : '';
        return {
          titulo: t('notifications.types.badgeDesbloqueado.titulo'),
          mensaje: t('notifications.types.badgeDesbloqueado.mensaje', { badge: badgeNombre })
        };
      }
      case 'override_activado':
        return {
          titulo: t('notifications.types.overrideActivado.titulo'),
          mensaje: t('notifications.types.overrideActivado.mensaje', { grupo: m.grupo_nombre, carrera: m.carrera_nombre })
        };
      default:
        return { titulo: notif.titulo, mensaje: notif.mensaje };
    }
  };

  return (
    <div className="notif-wrapper" ref={wrapperRef}>
      <style>{CSS}</style>
      <div
        className="icon-btn"
        title={t('nav.notifications')}
        style={{ position: 'relative', cursor: 'pointer' }}
        onClick={() => setShowDropdown(prev => !prev)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </div>

      {showDropdown && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <span className="notif-header-title">{t('nav.notifications')}</span>
            {unreadCount > 0 && (
              <button className="notif-mark-all" onClick={markAllAsRead}>
                {t('notifications.markAllRead')}
              </button>
            )}
          </div>

          {loading ? (
            <div className="notif-empty">{t('common.loading')}</div>
          ) : notifications.length === 0 ? (
            <div className="notif-empty">🔔 {t('notifications.empty')}</div>
          ) : (
            notifications.map(notif => {
              const { titulo, mensaje } = renderNotification(notif);
              return (
                <div
                  key={notif.id}
                  className={`notif-item ${!notif.leido ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notif)}
                >
                  <span className="notif-icon">
                    {{
                      solicitud_grupo: '🙋',
                      grupo_aprobado: '✅',
                      grupo_rechazado: '❌',
                      badge_desbloqueado: '🏅',
                      override_activado: '🔓'
                    }[notif.tipo] || '🔔'}
                  </span>
                  <div className="notif-content">
                    <div className="notif-title">{titulo}</div>
                    <div className="notif-message">{mensaje}</div>
                    <div className="notif-time">{formatTime(notif.created_at)}</div>
                  </div>
                  {!notif.leido && (
                    <button className="notif-dismiss" onClick={(e) => handleDismiss(e, notif.id)} title={t('notifications.dismiss')}>
                      ✕
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}