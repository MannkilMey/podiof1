import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { useThemeStore } from '../stores/themeStore';
import { useTranslation } from '../i18n';

// ============================================
// CONFIGURACIÓN DE PREGUNTAS
// ============================================
const getProfileQuestions = (t) => [
  
  {
    key: 'escuderia_favorita_id',
    title: t('onboarding.favoriteTeam'),
    subtitle: t('onboarding.favoriteTeamSub'),
    type: 'select_teams',
    table: 'users',
    field: 'escuderia_favorita_id'
  },
  {
    key: 'piloto_favorito_id',
    title: t('onboarding.favoriteDriver'),
    subtitle: t('onboarding.favoriteDriverSub'),
    type: 'select_drivers',
    table: 'users',
    field: 'piloto_favorito_id'
  }
];



const getAllQuestions = (t) => [...getProfileQuestions(t)];

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function OnboardingModal() {
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  const { t } = useTranslation();  
  const ALL_QUESTIONS = getAllQuestions(t);  
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [answer, setAnswer] = useState('');
  const [multiAnswers, setMultiAnswers] = useState(new Set());
  const [saving, setSaving] = useState(false);
  const [direction, setDirection] = useState('enter');
  const [loaded, setLoaded] = useState(false);

  // ============================================
  // CHECK PENDING QUESTIONS
  // ============================================
  useEffect(() => {
    if (!user) return;

    // Don't show more than once per session
    const sessionKey = `onboarding_shown_${user.id}`;
    if (sessionStorage.getItem(sessionKey)) {
      setLoaded(true);
      return;
    }

    checkPending();
  }, [user]);

  async function checkPending() {
    try {
      const [profileRes, surveysRes, teamsRes, driversRes] = await Promise.all([
        supabase.from('users').select('escuderia_favorita_id, piloto_favorito_id').eq('id', user.id).single(),
        supabase.from('user_surveys').select('pregunta_key, respuesta, skipped').eq('usuario_id', user.id),
        supabase.from('teams').select('id, nombre').order('nombre'),
        supabase.from('drivers').select('id, nombre_completo').order('nombre_completo')
      ]);

      setTeams(teamsRes.data || []);
      setDrivers(driversRes.data || []);

      const profile = profileRes.data || {};
      const surveys = new Map((surveysRes.data || []).map(s => [s.pregunta_key, s]));

      // Find unanswered questions
      const pending = ALL_QUESTIONS.filter(q => {
        if (q.table === 'users') {
          return !profile[q.field];
        }
        const survey = surveys.get(q.key);
        // Show if not answered AND not skipped in the last 7 days
        if (!survey) return true;
        if (survey.respuesta) return false;
        if (survey.skipped) {
          const skippedAt = new Date(survey.created_at || 0);
          const daysSince = (Date.now() - skippedAt.getTime()) / (1000 * 60 * 60 * 24);
          return daysSince > 7; // Re-ask after 7 days
        }
        return true;
      });

      if (pending.length > 0) {
        setPendingQuestions(pending);
        setVisible(true);
      }

      // Mark as shown for this session
      sessionStorage.setItem(`onboarding_shown_${user.id}`, 'true');
    } catch (err) {
      console.error('Onboarding check error:', err);
    } finally {
      setLoaded(true);
    }
  }

  // ============================================
  // SAVE ANSWER
  // ============================================
  const handleSave = useCallback(async () => {
    if (!pendingQuestions[currentIndex]) return;
    const q = pendingQuestions[currentIndex];
    const value = q.type === 'multi_select' ? [...multiAnswers].join(', ') : answer;

    if (!value) return;

    setSaving(true);
    try {
      if (q.table === 'users') {
        await supabase.from('users').update({ [q.field]: value }).eq('id', user.id);
      } else {
        await supabase.from('user_surveys').upsert({
          usuario_id: user.id,
          pregunta_key: q.key,
          respuesta: value,
          skipped: false
        }, { onConflict: 'usuario_id, pregunta_key' });
      }
      goNext();
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  }, [answer, multiAnswers, currentIndex, pendingQuestions, user]);

  // ============================================
  // SKIP
  // ============================================
  const handleSkip = useCallback(() => {
    goNext();
  }, [goNext]);


  function goNext() {
    setDirection('exit');
    setTimeout(() => {
      if (currentIndex + 1 >= pendingQuestions.length) {
        setVisible(false);
      } else {
        setCurrentIndex(prev => prev + 1);
        setAnswer('');
        setMultiAnswers(new Set());
        setDirection('enter');
      }
    }, 200);
  }

  // ============================================
  // CLOSE
  // ============================================
  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  const toggleMulti = useCallback((opt) => {
    setMultiAnswers(prev => {
      const next = new Set(prev);
      next.has(opt) ? next.delete(opt) : next.add(opt);
      return next;
    });
  }, []);

  // ============================================
  // RENDER
  // ============================================
  if (!visible || !loaded || pendingQuestions.length === 0) return null;

  const q = pendingQuestions[currentIndex];
  const progress = ((currentIndex + 1) / pendingQuestions.length) * 100;
  const canSave = q.type === 'multi_select' ? multiAnswers.size > 0 : !!answer;

  const CSS_VARS = `
    [data-theme="dark"] {
      --bg: #0A0A0C; --bg2: #111114; --bg3: #18181D;
      --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.13);
      --red: #E8002D; --red-dim: rgba(232,0,45,0.13);
      --white: #F0F0F0; --muted: rgba(240,240,240,0.40);
      --gold: #C9A84C; --green: #00D4A0; --green-dim: rgba(0,212,160,0.15);
    }
    [data-theme="light"] {
      --bg: #F5F6F8; --bg2: #FFFFFF; --bg3: #E8EAEE;
      --border: rgba(0,0,0,0.10); --border2: rgba(0,0,0,0.18);
      --red: #D40029; --red-dim: rgba(212,0,41,0.08);
      --white: #1A1B1E; --muted: rgba(26,27,30,0.55);
      --gold: #9C6F10; --green: #007F5F; --green-dim: rgba(0,127,95,0.15);
    }
  `;

  return (
    <div data-theme={theme} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, padding: 20
    }} onClick={handleClose}>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 20, padding: 0, width: '100%', maxWidth: 440,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)', overflow: 'hidden',
        animation: direction === 'enter' ? 'onbSlideIn 0.3s ease-out' : 'onbSlideOut 0.2s ease-in',
      }} onClick={e => e.stopPropagation()}>

        {/* Progress bar */}
        <div style={{ height: 4, background: 'var(--bg3)' }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--red), #FF3355)',
            transition: 'width 0.3s ease', borderRadius: '0 2px 2px 0'
          }} />
        </div>

        {/* Header */}
        <div style={{ padding: '24px 28px 0' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4
          }}>
            <span style={{ fontSize: 'var(--fs-label)', color: 'var(--muted)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
               {currentIndex + 1} {t('onboarding.of')} {pendingQuestions.length}
            </span>
            <button onClick={handleClose} style={{
              background: 'transparent', border: 'none', color: 'var(--muted)',
              fontSize: 20, cursor: 'pointer', padding: '4px 8px', borderRadius: 6,
              transition: 'color 0.2s'
            }} onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
               onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
              ✕
            </button>
          </div>

          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'var(--fs-section-title)',
            fontWeight: 900, color: 'var(--white)', marginBottom: 6, letterSpacing: 0.5
          }}>
            {q.title}
          </h2>
          <p style={{ fontSize: 'var(--fs-small)', color: 'var(--muted)', marginBottom: 24 }}>
            {q.subtitle}
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '0 28px 24px' }}>

                   {/* SELECT TEAMS */}
          {q.type === 'select_teams' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
              {teams.map(t => (
                <button key={t.id} onClick={() => setAnswer(t.id)} style={{
                  padding: '14px 16px', background: answer === t.id ? 'var(--red-dim)' : 'var(--bg3)',
                  border: `2px solid ${answer === t.id ? 'var(--red)' : 'var(--border)'}`,
                  borderRadius: 10, color: answer === t.id ? 'var(--red)' : 'var(--white)',
                  fontSize: 'var(--fs-subtitle)', fontWeight: answer === t.id ? 700 : 500,
                  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                  fontFamily: "'Barlow', sans-serif"
                }}>
                  {answer === t.id ? '● ' : '○ '}{t.nombre}
                </button>
              ))}
            </div>
          )}

          {/* SELECT DRIVERS */}
          {q.type === 'select_drivers' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
              {drivers.map(d => (
                <button key={d.id} onClick={() => setAnswer(d.id)} style={{
                  padding: '14px 16px', background: answer === d.id ? 'var(--red-dim)' : 'var(--bg3)',
                  border: `2px solid ${answer === d.id ? 'var(--red)' : 'var(--border)'}`,
                  borderRadius: 10, color: answer === d.id ? 'var(--red)' : 'var(--white)',
                  fontSize: 'var(--fs-subtitle)', fontWeight: answer === d.id ? 700 : 500,
                  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                  fontFamily: "'Barlow', sans-serif"
                }}>
                  {answer === d.id ? '● ' : '○ '}{d.nombre_completo}
                </button>
              ))}
            </div>
          )}

          {/* SINGLE SELECT */}
          {q.type === 'single_select' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.options.map(opt => (
                <button key={opt} onClick={() => setAnswer(opt)} style={{
                  padding: '14px 16px', background: answer === opt ? 'var(--red-dim)' : 'var(--bg3)',
                  border: `2px solid ${answer === opt ? 'var(--red)' : 'var(--border)'}`,
                  borderRadius: 10, color: answer === opt ? 'var(--red)' : 'var(--white)',
                  fontSize: 'var(--fs-subtitle)', fontWeight: answer === opt ? 700 : 500,
                  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                  fontFamily: "'Barlow', sans-serif"
                }}>
                  {answer === opt ? '● ' : '○ '}{opt}
                </button>
              ))}
            </div>
          )}

          {/* MULTI SELECT */}
          {q.type === 'multi_select' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.options.map(opt => {
                const selected = multiAnswers.has(opt);
                return (
                  <button key={opt} onClick={() => toggleMulti(opt)} style={{
                    padding: '14px 16px', background: selected ? 'var(--green-dim)' : 'var(--bg3)',
                    border: `2px solid ${selected ? 'var(--green)' : 'var(--border)'}`,
                    borderRadius: 10, color: selected ? 'var(--green)' : 'var(--white)',
                    fontSize: 'var(--fs-subtitle)', fontWeight: selected ? 700 : 500,
                    cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                    fontFamily: "'Barlow', sans-serif"
                  }}>
                    {selected ? '☑ ' : '☐ '}{opt}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div style={{
          padding: '16px 28px 24px', display: 'flex', gap: 12,
          borderTop: '1px solid var(--border)'
        }}>
          <button onClick={goNext} style={{
            flex: 1, padding: '14px', background: 'transparent',
            border: '2px solid var(--border)', borderRadius: 10,
            color: 'var(--muted)', fontSize: 'var(--fs-body)', fontWeight: 700,
            fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 1,
            textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--white)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}>
            {t('onboarding.skipBtn')}
          </button>
          <button onClick={handleSave} disabled={!canSave || saving} style={{
            flex: 2, padding: '14px',
            background: canSave ? 'linear-gradient(135deg, var(--red), #FF3355)' : 'var(--bg3)',
            border: 'none', borderRadius: 10,
            color: canSave ? 'white' : 'var(--muted)', fontSize: 'var(--fs-body)', fontWeight: 800,
            fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 1,
            textTransform: 'uppercase', cursor: canSave ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s', opacity: saving ? 0.6 : 1
          }}>
            {saving ? t('onboarding.savingBtn') : currentIndex + 1 >= pendingQuestions.length ? t('onboarding.finishBtn') : t('onboarding.continueBtn')}
          </button>
        </div>
      </div>

      <style>{CSS_VARS + `
        @keyframes onbSlideIn {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes onbSlideOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(-20px) scale(0.95); }
        }
      `}</style>
    </div>
  );
}