import React from 'react';
import { useThemeStore } from '../stores/themeStore';

/**
 * Modal reutilizable para mostrar el sistema de puntos de un grupo
 * 
 * USO:
 * import ScoringSystemModal from '../components/ScoringSystemModal';
 * 
 * // En tu componente:
 * const [showScoringModal, setShowScoringModal] = useState(false);
 * 
 * // Botón para abrir:
 * <button onClick={() => setShowScoringModal(true)}>ℹ️ Ver Sistema de Puntos</button>
 * 
 * // Renderizar modal:
 * {showScoringModal && (
 *   <ScoringSystemModal
 *     group={group}
 *     onClose={() => setShowScoringModal(false)}
 *   />
 * )}
 */

const ScoringSystemModal = ({ group, onClose }) => {
  const theme = useThemeStore((state) => state.theme);

  if (!group) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 20
      }} 
      onClick={onClose}
    >
      <div 
        data-theme={theme} 
        style={{
          background: 'var(--bg2)',
          border: '2px solid var(--border2)',
          borderRadius: 16,
          padding: 32,
          maxWidth: 600,
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2 style={{
          fontFamily: 'Barlow Condensed',
          fontSize: 28,
          fontWeight: 900,
          color: 'var(--white)',
          marginBottom: 8
        }}>
          📊 Sistema de Puntos
        </h2>
        <p style={{
          fontSize: 16,
          color: 'var(--muted)',
          marginBottom: 24
        }}>
          {group.nombre}
        </p>

        {/* Sistema base */}
        <div style={{marginBottom: 20}}>
          <h3 style={{
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--white)',
            marginBottom: 12
          }}>
            🏆 Puntos por Posición
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
            gap: 8
          }}>
            {Object.entries(group.sistema_puntos || {}).map(([pos, pts]) => (
              <div key={pos} style={{
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: 10,
                textAlign: 'center'
              }}>
                <div style={{fontSize: 12, color: 'var(--muted)', marginBottom: 4}}>
                  P{pos}
                </div>
                <div style={{fontSize: 20, fontWeight: 900, color: 'var(--gold)'}}>
                  {pts}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bonus exacto */}
        <div style={{marginBottom: 20}}>
          <h3 style={{fontSize: 16, fontWeight: 700, color: 'var(--white)', marginBottom: 8}}>
            🎯 Bonus Posición Exacta
          </h3>
          <div style={{
            background: 'var(--green-dim)',
            border: '1px solid var(--green)',
            borderRadius: 10,
            padding: 12,
            color: 'var(--green)',
            fontWeight: 600
          }}>
            +{group.bonus_posicion_exacta || 0} puntos adicionales por acertar posición exacta
          </div>
        </div>

        {/* Piloto correcto */}
        {group.usa_sistema_dual && (
          <div style={{marginBottom: 20}}>
            <h3 style={{fontSize: 16, fontWeight: 700, color: 'var(--white)', marginBottom: 8}}>
              ✓ Piloto Correcto (sin posición exacta)
            </h3>
            <div style={{
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 12,
              color: 'var(--muted)'
            }}>
              +{group.puntos_piloto_correcto || 0} puntos si el piloto termina en top {group.cantidad_posiciones}
            </div>
          </div>
        )}

        {/* Vuelta rápida piloto */}
        {group.bonus_vuelta_rapida_piloto && (
          <div style={{marginBottom: 20}}>
            <h3 style={{fontSize: 16, fontWeight: 700, color: 'var(--white)', marginBottom: 8}}>
              🏎️ Bonus Vuelta Rápida Piloto
            </h3>
            <div style={{
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 12,
              color: 'var(--muted)'
            }}>
              +{group.puntos_vuelta_rapida_piloto || 0} puntos por acertar el piloto con vuelta más rápida
            </div>
          </div>
        )}

        {/* Vuelta rápida escudería (si aplica) */}
        {group.bonus_vuelta_rapida_escuderia && (
          <div style={{marginBottom: 20}}>
            <h3 style={{fontSize: 16, fontWeight: 700, color: 'var(--white)', marginBottom: 8}}>
              🏁 Bonus Vuelta Rápida Escudería
            </h3>
            <div style={{
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 12,
              color: 'var(--muted)'
            }}>
              +{group.puntos_vuelta_rapida_escuderia || 0} puntos por acertar la escudería con vuelta más rápida
            </div>
          </div>
        )}

        {/* Ejemplo de cálculo */}
        <div style={{
          background: 'var(--bg4)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: 16,
          marginBottom: 20
        }}>
          <h3 style={{
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--white)',
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: 1
          }}>
            📝 Ejemplo de Cálculo
          </h3>
          <div style={{fontSize: 13, color: 'var(--muted)', lineHeight: 1.6}}>
            • Aciertas P1 exacto: {group.sistema_puntos?.['1'] || 0} + {group.bonus_posicion_exacta || 0} = {(group.sistema_puntos?.['1'] || 0) + (group.bonus_posicion_exacta || 0)} pts<br/>
            {group.usa_sistema_dual && (
              <>• Aciertas piloto en P2 pero termina P4: {group.puntos_piloto_correcto || 0} pts<br/></>
            )}
            {group.bonus_vuelta_rapida_piloto && (
              <>• Aciertas vuelta rápida piloto: +{group.puntos_vuelta_rapida_piloto || 0} pts</>
            )}
          </div>
        </div>

        {/* Info adicional */}
        <div style={{
          padding: 12,
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          marginBottom: 20,
          fontSize: 13,
          color: 'var(--muted)',
          lineHeight: 1.5
        }}>
          <strong style={{color: 'var(--white)'}}>ℹ️ Información:</strong><br/>
          • Se predicen las primeras <strong style={{color: 'var(--white)'}}>{group.cantidad_posiciones}</strong> posiciones<br/>
          • Los puntos se calculan automáticamente al finalizar cada carrera<br/>
          • Las predicciones cierran antes de la clasificación o carrera
        </div>

        {/* Botón cerrar */}
        <button 
          style={{
            width: '100%',
            padding: 14,
            background: 'linear-gradient(135deg, var(--red), #FF3355)',
            border: 'none',
            borderRadius: 10,
            color: 'white',
            fontFamily: 'Barlow Condensed',
            fontSize: 16,
            fontWeight: 800,
            cursor: 'pointer'
          }} 
          onClick={onClose}
        >
          CERRAR
        </button>
      </div>
    </div>
  );
};

export default ScoringSystemModal;