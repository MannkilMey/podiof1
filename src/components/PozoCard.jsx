import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

function formatMoney(amount, currency = 'USD') {
  const sym = CURRENCY_SYMBOLS[currency] || currency + ' ';
  const fmt = CURRENCY_FORMATS[currency] || { decimals: 2, separator: ',' };
  const num = Number(amount) || 0;
  const formatted = num.toLocaleString('es-PY', {
    minimumFractionDigits: fmt.decimals,
    maximumFractionDigits: fmt.decimals
  });
  return `${sym} ${formatted}`;
}

export default function PozoCard({ groupId }) {
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
            fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18,
            fontWeight: 800, color: 'var(--white)', textTransform: 'uppercase',
            letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 8
          }}>
            💰 Pozo del Grupo
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
            {members} participantes · {formatMoney(montoPersona, moneda)} por persona
          </div>
        </div>
        <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(22px, 5vw, 36px)',
            fontWeight: 900, color: '#C9A84C', 
            lineHeight: 1,
            textAlign: 'right', 
            wordBreak: 'break-word'
        }}>
          {formatMoney(total, moneda)}
        </div>
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
              <span style={{ fontSize: 20, width: 32, textAlign: 'center', flexShrink: 0 }}>
                {medal}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: 4
                }}>
                  <span style={{
                    fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14,
                    fontWeight: 700, color: 'var(--white)'
                  }}>
                    {pos}° lugar — {pct}%
                  </span>
                  <span style={{
                    fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16,
                    fontWeight: 900, color: barColor
                  }}>
                    {formatMoney(amount, moneda)}
                  </span>
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

      {/* Disclaimer */}
      <div style={{
        background: 'var(--bg3)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '10px 14px', fontSize: 10,
        color: 'var(--muted)', lineHeight: 1.5, textAlign: 'center'
      }}>
        ⚠️ PodioF1 no gestiona, almacena ni transfiere dinero. El pozo es informativo y la gestión es responsabilidad de los participantes.
      </div>
    </div>
  );
}