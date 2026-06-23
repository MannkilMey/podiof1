import React from 'react';
import { useThemeStore } from '../stores/themeStore';
import { useTranslation } from '../i18n';

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
  const { t } = useTranslation();

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
          📊 {t('scoringModal.title')}
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
            🏁 {t('scoringModal.racesSection')}
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
              {t('scoringModal.pointsByPosition')}
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
              🎯 {t('scoringModal.exactPositionBonus')}
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
              {t('scoringModal.exactPositionBonusValue', { points: group.bonus_posicion_exacta || 0 })}
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
                ✓ {t('scoringModal.correctDriverNoExact')}
              </h4>
              <div style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: 12,
                color: 'var(--white)',
                fontSize: 14
              }}>
               {t('scoringModal.correctDriverNoExactValue', { points: group.puntos_piloto_correcto || 0, top: group.cantidad_posiciones })}
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
                🏎️ {t('scoringModal.fastestLapDriver')}
              </h4>
              <div style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: 12,
                color: 'var(--white)',
                fontSize: 14
              }}>
                {t('scoringModal.fastestLapDriverValue', { points: group.puntos_vuelta_rapida_piloto || 0 })}
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
                🏁 {t('scoringModal.fastestLapTeam')}
              </h4>
              <div style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: 12,
                color: 'var(--white)',
                fontSize: 14
              }}>
                {t('scoringModal.fastestLapTeamValue', { points: group.puntos_vuelta_rapida_escuderia || 0 })}
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
              ⚡ {t('scoringModal.sprintSection')}
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
                {t('scoringModal.pointsByPosition')}
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
                ℹ️ {t('scoringModal.sprintCharacteristics')}
              </div>
              • {t('scoringModal.sprintPositionsPredicted', { count: group.cantidad_posiciones_sprint || 8 })}<br/>
              • {t('scoringModal.sprintDualSystem', { exact: group.bonus_posicion_exacta || 10, driver: group.puntos_piloto_correcto || 5 })}<br/>
              • <strong style={{color: '#FFB800'}}>{t('scoringModal.sprintNoFastestLap')}</strong>
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
            📝 {t('scoringModal.exampleRaceTitle')}
          </h3>
          <div style={{fontSize: 13, color: 'var(--muted)', lineHeight: 1.6}}>
            {t('scoringModal.exampleExactP1', { 
                base: group.sistema_puntos?.['1'] || 0, 
                bonus: group.bonus_posicion_exacta || 0, 
                total: (group.sistema_puntos?.['1'] || 0) + (group.bonus_posicion_exacta || 0) 
              })}<br/>
            {group.usa_sistema_dual && (
              <>• {t('scoringModal.exampleDriverOnly', { points: group.puntos_piloto_correcto || 0 })}<br/></>
            )}
            {group.bonus_vuelta_rapida_piloto && (
              <>• {t('scoringModal.exampleFastestLap', { points: group.puntos_vuelta_rapida_piloto || 0 })}</>
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
                ⚡ {t('scoringModal.exampleSprintTitle')}
              </h3>
              <div style={{fontSize: 13, color: 'var(--muted)', lineHeight: 1.6}}>
                •{t('scoringModal.exampleSprintExactP1', { 
                    base: 8, 
                    bonus: group.bonus_posicion_exacta || 0, 
                    total: 8 + (group.bonus_posicion_exacta || 0) 
                  })}<br/>
                {group.usa_sistema_dual && (
                  <>• {t('scoringModal.exampleDriverOnly', { points: group.puntos_piloto_correcto || 0 })}<br/></>
                )}
                • {t('scoringModal.exampleSprintNoFastestLap')}
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
          <strong style={{color: 'var(--white)'}}>ℹ️ {t('scoringModal.generalInfoTitle')}</strong><br/>
          • {t('scoringModal.generalInfoRaces', { count: group.cantidad_posiciones })}<br/>
            {incluirSprints && (
              <>• {t('scoringModal.generalInfoSprint', { count: group.cantidad_posiciones_sprint || 8 })}<br/></>
            )}
          • {t('scoringModal.generalInfoAutoCalc')}<br/>
          • {t('scoringModal.generalInfoDeadline', { hours: group.horas_cierre_prediccion || 24 })}
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
          {t('scoringModal.closeBtn')}
        </button>
      </div>
    </div>
  );
};

export default ScoringSystemModal;