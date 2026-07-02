import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTranslation, getDateLocale } from '../i18n';
import { isNative } from '../hooks/usePlatform';


const CURRENCY_SYMBOLS = {
  USD: '$', PYG: '₲', BRL: 'R$', ARS: '$', EUR: '€', GBP: '£'
};

const CURRENCY_FORMATS = {
  PYG: { decimals: 0, separator: '.' },
  USD: { decimals: 2, separator: ',' },
  BRL: { decimals: 2, separator: ',' },
  ARS: { decimals: 0, separator: '.' },
  EUR: { decimals: 2, separator: ',' },
  GBP: { decimals: 2, separator: ',' }
};

function formatMoney(amount, currency = 'USD', dateLocale = 'es-PY') {
  const sym = CURRENCY_SYMBOLS[currency] || currency + ' ';
  const fmt = CURRENCY_FORMATS[currency] || { decimals: 2, separator: ',' };
  const num = Number(amount) || 0;
  const formatted = num.toLocaleString(dateLocale, {
    minimumFractionDigits: fmt.decimals,
    maximumFractionDigits: fmt.decimals
  });
  return `${sym} ${formatted}`;
}

export default function PozoCard({ groupId, leaderboard }) {
  const { t, locale } = useTranslation();
  const [data, setData] = useState(null);
  const [members, setMembers] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!groupId) return;
    fetchPozo();
  }, [groupId]);

  async function fetchPozo() {
    try {
      const [groupRes, membersRes] = await Promise.all([
        supabase.from('groups')
          .select('pozo_habilitado, pozo_monto_por_persona, pozo_moneda, pozo_distribucion')
          .eq('id', groupId).single(),
        supabase.from('group_members')
          .select('id', { count: 'exact', head: true })
          .eq('grupo_id', groupId)
      ]);

      if (groupRes.data?.pozo_habilitado) {
        setData(groupRes.data);
        setMembers(membersRes.count || 0);
      }
    } catch (err) {
      console.error('Error fetching pozo:', err);
    } finally {
      setLoaded(true);
    }
  }

  if (!loaded || !data) return null;

  const montoPersona = Number(data.pozo_monto_por_persona) || 0;
  const moneda = data.pozo_moneda || 'USD';
  const total = montoPersona * members;
  const distribucion = data.pozo_distribucion || { "1": 60, "2": 25, "3": 15 };

  // Sort distribution by position
  const distEntries = Object.entries(distribucion)
    .sort(([a], [b]) => Number(a) - Number(b));

  const medals = { '1': '🥇', '2': '🥈', '3': '🥉' };
  const barColors = { '1': '#FFD700', '2': '#C0C0C0', '3': '#CD7F32' };

  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: 24,
      marginBottom: 24,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Gold accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: 'linear-gradient(90deg, #FFD700, #C9A84C, #FFD700)',
        borderRadius: '14px 14px 0 0'
      }} />

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 20, gap: 12, flexWrap: 'wrap'
      }}>
        <div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'var(--fs-subtitle)',
            fontWeight: 800, color: 'var(--white)', textTransform: 'uppercase',
            letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 8
          }}>
            🏁 {t('podioPoints.title')}
          </div>
          <div style={{ fontSize: 'var(--fs-small)', color: 'var(--muted)', marginTop: 4 }}>
             {t('podioPoints.participants', { count: members })}
             {!isNative && ` · ${t('podioPoints.perPerson', { amount: formatMoney(montoPersona, moneda, getDateLocale(locale)) })}`}
          </div>
        </div>
        {!isNative && (
        <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(22px, 5vw, 36px)',
            fontWeight: 900, color: '#C9A84C', 
            lineHeight: 1,
            textAlign: 'right', 
            wordBreak: 'break-word'
        }}>
          {formatMoney(total, moneda, getDateLocale(locale))}
        </div>
        )}
      </div>

      {/* Distribution */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16
      }}>
        {distEntries.map(([pos, pct]) => {
          const amount = (total * Number(pct)) / 100;
          const medal = medals[pos] || `${pos}°`;
          const barColor = barColors[pos] || 'var(--muted)';

          return (
            <div key={pos} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 'var(--fs-section-title)', width: 32, textAlign: 'center', flexShrink: 0 }}>
                {medal}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: 4
                }}>
                  <span style={{
                    fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'var(--fs-body)',
                    fontWeight: 700, color: 'var(--white)'
                  }}>
                    {t('podioPoints.place', { pos })} — {pct}%
                  </span>
                  {!isNative && (
                  <span style={{
                    fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'var(--fs-subtitle)',
                    fontWeight: 900, color: barColor
                  }}>
                    {formatMoney(amount, moneda, getDateLocale(locale))}
                  </span>
                  )}
                </div>
                <div style={{
                  height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%', width: `${pct}%`, background: barColor,
                    borderRadius: 3, transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
        {/* Projected winners */}
      {leaderboard && leaderboard.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 'var(--fs-label)', fontWeight: 700, letterSpacing: 1,
            textTransform: 'uppercase', color: 'var(--muted)',
            marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6
          }}>
            🏆 {t('podioPoints.currentProjection')}
            <span style={{
              fontSize: 'var(--fs-label)', padding: '2px 6px', borderRadius: 4,
              background: 'var(--bg3)', color: 'var(--muted)',
              fontWeight: 600, letterSpacing: 0
            }}>
              {t('podioPoints.live')}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {distEntries.map(([pos, pct]) => {
              const posNum = Number(pos);
              const user = leaderboard[posNum - 1];
              const amount = (total * Number(pct)) / 100;
              const medal = medals[pos] || `${pos}°`;
              const barColor = barColors[pos] || 'var(--muted)';
              
              if (!user) return null;
              
              return (
                <div key={`winner-${pos}`} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', background: 'var(--bg3)',
                  borderRadius: 8, border: `1px solid ${posNum === 1 ? 'rgba(201,168,76,0.3)' : 'var(--border)'}`,
                  transition: 'all 0.2s'
                }}>
                  <span style={{ fontSize: 'var(--fs-section-title)', flexShrink: 0 }}>{medal}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 'var(--fs-body)', fontWeight: 700, color: 'var(--white)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {user.nombre}
                    </div>
                    <div style={{ fontSize: 'var(--fs-label)', color: 'var(--muted)' }}>
                      {t('common.pointsCount', { count: Math.round(user.puntos) })} · {t('common.exactCount', { count: user.exactos })}
                    </div>
                  </div>
                  {!isNative && (
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 'var(--fs-subtitle)', fontWeight: 900, color: barColor,
                    flexShrink: 0
                  }}>
                    {formatMoney(amount, moneda, getDateLocale(locale))}
                  </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Disclaimer */}
      <div style={{
        background: 'var(--bg3)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '10px 14px', fontSize: 'var(--fs-label)',
        color: 'var(--muted)', lineHeight: 1.5, textAlign: 'center'
      }}>
        ⚠️{t('podioPoints.disclaimer')}
      </div>
    </div>
  );
}