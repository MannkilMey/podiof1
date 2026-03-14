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

  const incluirSprints = group.incluir_sprints || false;

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
          maxWidth: 700,
          width: '100%',
          maxHeight: '85vh',
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

        {/* ========================================
            CARRERAS NORMALES
        ======================================== */}
        <div style={{
          background: 'var(--bg3)',
          border: '2px solid var(--border2)',
          borderRadius: 14,
          padding: 20,
          marginBottom: 20
        }}>
          <h3 style={{
            fontFamily: 'Barlow Condensed',
            fontSize: 22,
            fontWeight: 900,
            color: 'var(--white)',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            🏁 CARRERAS
          </h3>

          {/* Sistema base */}
          <div style={{marginBottom: 20}}>
            <h4 style={{
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--muted)',
              marginBottom: 12,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}>
              Puntos por Posición
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
              gap: 8
            }}>
              {Object.entries(group.sistema_puntos || {}).map(([pos, pts]) => (
                <div key={pos} style={{
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: 10,
                  textAlign: 'center'
                }}>
                  <div style={{fontSize: 11, color: 'var(--muted)', marginBottom: 4}}>
                    P{pos}
                  </div>
                  <div style={{fontSize: 18, fontWeight: 900, color: 'var(--gold)'}}>
                    {pts}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bonus exacto */}
          <div style={{marginBottom: 16}}>
            <h4 style={{
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--muted)',
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}>
              🎯 Bonus Posición Exacta
            </h4>
            <div style={{
              background: 'rgba(0, 212, 160, 0.15)',
              border: '1px solid var(--green)',
              borderRadius: 10,
              padding: 12,
              color: 'var(--green)',
              fontWeight: 600,
              fontSize: 14
            }}>
              +{group.bonus_posicion_exacta || 0} puntos por acertar posición exacta
            </div>
          </div>

          {/* Piloto correcto */}
          {group.usa_sistema_dual && (
            <div style={{marginBottom: 16}}>
              <h4 style={{
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--muted)',
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: 1
              }}>
                ✓ Piloto Correcto (sin posición exacta)
              </h4>
              <div style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: 12,
                color: 'var(--white)',
                fontSize: 14
              }}>
                +{group.puntos_piloto_correcto || 0} puntos si el piloto termina en top {group.cantidad_posiciones}
              </div>
            </div>
          )}

          {/* Vuelta rápida piloto */}
          {group.bonus_vuelta_rapida_piloto && (
            <div style={{marginBottom: 16}}>
              <h4 style={{
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--muted)',
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: 1
              }}>
                🏎️ Vuelta Rápida Piloto
              </h4>
              <div style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: 12,
                color: 'var(--white)',
                fontSize: 14
              }}>
                +{group.puntos_vuelta_rapida_piloto || 0} puntos por acertar vuelta más rápida
              </div>
            </div>
          )}

          {/* Vuelta rápida escudería */}
          {group.bonus_vuelta_rapida_escuderia && (
            <div style={{marginBottom: 0}}>
              <h4 style={{
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--muted)',
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: 1
              }}>
                🏁 Vuelta Rápida Escudería
              </h4>
              <div style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: 12,
                color: 'var(--white)',
                fontSize: 14
              }}>
                +{group.puntos_vuelta_rapida_escuderia || 0} puntos por acertar escudería con vuelta más rápida
              </div>
            </div>
          )}
        </div>

        {/* ========================================
            CARRERAS SPRINT
        ======================================== */}
        {incluirSprints && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 184, 0, 0.1), rgba(255, 140, 0, 0.1))',
            border: '2px solid rgba(255, 184, 0, 0.4)',
            borderRadius: 14,
            padding: 20,
            marginBottom: 20
          }}>
            <h3 style={{
              fontFamily: 'Barlow Condensed',
              fontSize: 22,
              fontWeight: 900,
              color: '#FFB800',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              ⚡ SPRINT
            </h3>

            {/* Sistema Sprint */}
            <div style={{marginBottom: 16}}>
              <h4 style={{
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--muted)',
                marginBottom: 12,
                textTransform: 'uppercase',
                letterSpacing: 1
              }}>
                Puntos por Posición
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
                gap: 8
              }}>
                {Object.entries(group.sistema_puntos_sprint || {
                  "1":8,"2":7,"3":6,"4":5,"5":4,"6":3,"7":2,"8":1
                }).map(([pos, pts]) => (
                  <div key={pos} style={{
                    background: 'var(--bg2)',
                    border: '1px solid rgba(255, 184, 0, 0.3)',
                    borderRadius: 8,
                    padding: 10,
                    textAlign: 'center'
                  }}>
                    <div style={{fontSize: 11, color: 'var(--muted)', marginBottom: 4}}>
                      P{pos}
                    </div>
                    <div style={{fontSize: 18, fontWeight: 900, color: '#FFB800'}}>
                      {pts}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Sprint */}
            <div style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 14,
              fontSize: 13,
              color: 'var(--muted)',
              lineHeight: 1.6
            }}>
              <div style={{marginBottom: 8, color: 'var(--white)', fontWeight: 600}}>
                ℹ️ Características Sprint:
              </div>
              • Se predicen <strong style={{color: 'var(--white)'}}>{group.cantidad_posiciones_sprint || 8}</strong> posiciones<br/>
              • Mismo sistema dual (+{group.bonus_posicion_exacta || 10} exacto, +{group.puntos_piloto_correcto || 5} piloto)<br/>
              • <strong style={{color: '#FFB800'}}>No hay bonus de vuelta rápida</strong>
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
            📝 Ejemplo de Cálculo (Carrera)
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

          {incluirSprints && (
            <>
              <div style={{
                height: 1,
                background: 'var(--border)',
                margin: '12px 0'
              }}></div>
              <h3 style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#FFB800',
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: 1
              }}>
                ⚡ Ejemplo de Cálculo (Sprint)
              </h3>
              <div style={{fontSize: 13, color: 'var(--muted)', lineHeight: 1.6}}>
                • Aciertas P1 exacto: 8 + {group.bonus_posicion_exacta || 0} = {8 + (group.bonus_posicion_exacta || 0)} pts<br/>
                {group.usa_sistema_dual && (
                  <>• Aciertas piloto en P2 pero termina P4: {group.puntos_piloto_correcto || 0} pts<br/></>
                )}
                • No hay bonus de vuelta rápida en Sprint
              </div>
            </>
          )}
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
          <strong style={{color: 'var(--white)'}}>ℹ️ Información General:</strong><br/>
          • Carreras: {group.cantidad_posiciones} posiciones a predecir<br/>
          {incluirSprints && (
            <>• Sprint: {group.cantidad_posiciones_sprint || 8} posiciones a predecir<br/></>
          )}
          • Los puntos se calculan automáticamente al finalizar<br/>
          • Las predicciones cierran {group.horas_cierre_prediccion || 24}h antes (o según admin)
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
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }} 
          onMouseOver={(e) => e.target.style.opacity = '0.9'}
          onMouseOut={(e) => e.target.style.opacity = '1'}
          onClick={onClose}
        >
          CERRAR
        </button>
      </div>
    </div>
  );
};

export default ScoringSystemModal;