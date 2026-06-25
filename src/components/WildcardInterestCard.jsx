import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { useToastStore } from '../stores/toastStore';
import { useTranslation } from '../i18n';

export default function WildcardInterestCard({ groupId }) {
  const user = useAuthStore((state) => state.user);
  const toast = useToastStore();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!groupId || !user) return;
    checkExisting();
  }, [groupId, user]);

  const checkExisting = async () => {
    try {
      const { data, error } = await supabase
        .from('wildcards_interest')
        .select('id')
        .eq('grupo_id', groupId)
        .eq('usuario_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setVisible(!data); // ya respondió antes en este grupo → no se muestra
    } catch (err) {
      console.error('Error checking wildcard interest:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResponder = async (respuesta) => {
    setSubmitting(true);
    try {
      const { error } = await supabase.rpc('registrar_interes_comodines', {
        p_grupo_id: groupId,
        p_respuesta: respuesta
      });
      if (error) throw error;
      toast.success(t('wildcardInterest.thanksToast'));
      setVisible(false);
    } catch (err) {
      console.error('Error registering wildcard interest:', err);
      toast.error(t('wildcardInterest.errorToast'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !visible) return null;

  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--gold)',
      borderRadius: 14,
      padding: 20,
      marginBottom: 24
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 24 }}>🎁</span>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 800, color: 'var(--white)' }}>
          {t('wildcardInterest.title')}
        </span>
      </div>

      <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16 }}>
        {t('wildcardInterest.explanationGlobal')}<br/>
        {t('wildcardInterest.explanationPosicional')}
      </p>

      <p style={{ fontSize: 13, color: 'var(--white)', fontWeight: 600, marginBottom: 16 }}>
        {t('wildcardInterest.question')}
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          onClick={() => handleResponder('activaria_comodines')}
          disabled={submitting}
          style={{
            padding: '10px 20px', background: 'linear-gradient(135deg, #C9A84C, #A67C00)',
            border: 'none', borderRadius: 10, color: 'white',
            fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 800,
            letterSpacing: 0.5, textTransform: 'uppercase', cursor: 'pointer'
          }}
        >
          👍 {t('wildcardInterest.yesBtn')}
        </button>
        <button
          onClick={() => handleResponder('no_le_interesa')}
          disabled={submitting}
          style={{
            padding: '10px 20px', background: 'transparent',
            border: '1px solid var(--border2)', borderRadius: 10, color: 'var(--muted)',
            fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 800,
            letterSpacing: 0.5, textTransform: 'uppercase', cursor: 'pointer'
          }}
        >
          {t('wildcardInterest.noBtn')}
        </button>
      </div>
    </div>
  );
}