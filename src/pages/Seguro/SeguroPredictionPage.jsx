import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useToastStore } from '../../stores/toastStore';
import { supabase } from '../../lib/supabase';
import { useTranslation } from '../../i18n';
import BackButton from '../../components/BackButton';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');`;

const CSS_STYLES = `
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
* { box-sizing: border-box; }

.seguro-page { padding: 24px 28px; max-width: 900px; margin: 0 auto; background: var(--bg); min-height: calc(100vh - 60px); }
.seguro-back { background: transparent; border: none; color: var(--red); cursor: pointer; font-size: var(--fs-body); font-weight: 600; display: flex; align-items: center; gap: 8px; padding: 0; margin-bottom: 20px; transition: opacity 0.2s; }
.seguro-back:hover { opacity: 0.7; }

.seguro-title { font-family: 'Barlow Condensed', sans-serif; font-size: var(--fs-page-title); font-weight: 900; color: var(--white); margin-bottom: 4px; }
.seguro-subtitle { color: var(--muted); font-size: var(--fs-subtitle); margin-bottom: 24px; }

.seguro-status-card { background: var(--bg2); border: 2px solid var(--border); border-radius: 14px; padding: 20px; margin-bottom: 24px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.seguro-status-card.activo { border-color: var(--green); background: linear-gradient(135deg, var(--bg2), rgba(0,212,160,0.04)); }
.seguro-status-icon { font-size: 32px; }
.seguro-status-info { flex: 1; min-width: 200px; }
.seguro-status-label { font-family: 'Barlow Condensed', sans-serif; font-size: var(--fs-subtitle); font-weight: 800; color: var(--white); margin-bottom: 2px; }
.seguro-status-sub { font-size: var(--fs-small); color: var(--muted); }
.seguro-toggle-btn { padding: 10px 20px; border: none; border-radius: 10px; font-family: 'Barlow Condensed', sans-serif; font-size: var(--fs-small); font-weight: 800; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
.seguro-toggle-btn.activar { background: linear-gradient(135deg, var(--green), #00A67E); color: white; }
.seguro-toggle-btn.desactivar { background: transparent; border: 2px solid var(--red); color: var(--red); }
.seguro-toggle-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.seguro-credits-row { display: flex; gap: 16px; font-size: var(--fs-small); color: var(--muted); margin-top: 8px; flex-wrap: wrap; }
.seguro-credits-badge { background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; padding: 4px 10px; font-weight: 700; color: var(--gold); }

.seguro-instruction-box { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 24px; }
.seguro-instruction-title { font-family: 'Barlow Condensed', sans-serif; font-size: var(--fs-subtitle); font-weight: 800; color: var(--white); margin-bottom: 12px; }
.seguro-instruction-text { color: var(--muted); font-size: var(--fs-body); line-height: 1.6; }

.seguro-grid { display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 24px; }
.seguro-list { background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 20px; }
.seguro-list-title { font-family: 'Barlow Condensed', sans-serif; font-size: var(--fs-body); font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; }

.seguro-driver-item { background: var(--bg3); border: 2px solid var(--border); border-radius: 10px; padding: 14px 16px; margin-bottom: 8px; display: flex; align-items: center; gap: 12px; cursor: grab; transition: all 0.2s; user-select: none; }
.seguro-driver-item:active { cursor: grabbing; }
.seguro-driver-item:hover { border-color: var(--gold); transform: translateX(4px); }
.seguro-driver-item.dragging { opacity: 0.5; }
.seguro-driver-item.clickable { cursor: pointer; }

.seguro-position-number { font-family: 'Barlow Condensed', sans-serif; font-size: var(--fs-section-title); font-weight: 900; color: var(--white); min-width: 32px; text-align: center; }
.seguro-position-number.podium { color: var(--gold); }
.seguro-driver-color { width: 4px; height: 40px; border-radius: 2px; }
.seguro-driver-info { flex: 1; }
.seguro-driver-name { font-weight: 600; color: var(--white); font-size: var(--fs-subtitle); margin-bottom: 2px; }
.seguro-driver-team { font-size: var(--fs-small); color: var(--muted); }
.seguro-driver-number { font-family: 'Barlow Condensed', sans-serif; font-size: var(--fs-subtitle); font-weight: 700; color: var(--muted); min-width: 36px; text-align: right; }
.seguro-drag-icon { color: var(--muted); font-size: 18px; }
.seguro-remove-btn { background: var(--red-dim); border: 1px solid var(--red); border-radius: 6px; color: var(--red); padding: 4px 8px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.seguro-remove-btn:hover { background: var(--red); color: white; }

.seguro-bonus-section { background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 20px; margin-bottom: 24px; }
.seguro-bonus-label { font-size: var(--fs-small); font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; display: block; }
.seguro-page select { width: 100%; padding: 12px 16px; background: var(--bg3); border: 1px solid var(--border); border-radius: 10px; color: var(--white); font-size: 16px; cursor: pointer; font-family: 'Barlow', sans-serif; }

.seguro-actions { display: flex; gap: 12px; margin-bottom: 24px; }
.seguro-btn-save { flex: 1; padding: 16px; background: linear-gradient(135deg, var(--gold), #A67C00); border: none; border-radius: 12px; color: white; font-family: 'Barlow Condensed', sans-serif; font-size: var(--fs-subtitle); font-weight: 800; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: opacity 0.2s; }
.seguro-btn-save:hover { opacity: 0.9; }
.seguro-btn-save:disabled { opacity: 0.4; cursor: not-allowed; }

.seguro-locked { text-align: center; padding: 60px 20px; color: var(--muted); }
.seguro-locked-icon { font-size: 64px; margin-bottom: 16px; opacity: 0.3; }

.seguro-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 9998; padding: 20px; }
.seguro-modal { background: var(--bg2); border: 2px solid var(--gold); border-radius: 16px; padding: 32px; max-width: 480px; width: 100%; }
.seguro-modal-icon { font-size: 48px; text-align: center; margin-bottom: 12px; }
.seguro-modal-title { font-family: 'Barlow Condensed', sans-serif; font-size: var(--fs-stat-secondary); font-weight: 900; color: var(--white); text-align: center; margin-bottom: 16px; }
.seguro-modal-text { font-size: var(--fs-body); color: var(--muted); line-height: 1.6; margin-bottom: 24px; }
.seguro-modal-actions { display: flex; gap: 12px; }
.seguro-modal-btn { flex: 1; padding: 14px; border-radius: 10px; font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: var(--fs-body); cursor: pointer; border: none; }
.seguro-modal-btn.confirm { background: linear-gradient(135deg, var(--green), #00A67E); color: white; }
.seguro-modal-btn.cancel { background: transparent; border: 2px solid var(--border2); color: var(--white); }

@media (max-width: 900px) {
  .seguro-page { padding: 16px; }
  .seguro-actions { flex-direction: column; }
}
`;

function SortableSeguroDriver({ driver, position, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: driver.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className={`seguro-driver-item ${isDragging ? 'dragging' : ''}`}>
      <div {...attributes} {...listeners}>
        <div className={`seguro-position-number ${position <= 3 ? 'podium' : ''}`}>{position}</div>
      </div>
      <div className="seguro-driver-color" style={{ background: driver.color }} />
      <div className="seguro-driver-info">
        <div className="seguro-driver-name">{driver.nombre}</div>
        <div className="seguro-driver-team">{driver.equipo}</div>
      </div>
      <div className="seguro-driver-number">#{driver.numero}</div>
      <div {...attributes} {...listeners} className="seguro-drag-icon">⋮⋮</div>
      {onRemove && (
        <button className="seguro-remove-btn" onClick={(e) => { e.stopPropagation(); onRemove(driver); }}>✕</button>
      )}
    </div>
  );
}

export default function SeguroPredictionPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  const toast = useToastStore();
  const { t } = useTranslation();

  const [group, setGroup] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [fastestLapDriver, setFastestLapDriver] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (!groupId || !user?.id) return;
    fetchData();
  }, [groupId, user?.id]);

  async function fetchData() {
    try {
      setLoading(true);

      const { data: groupData, error: groupError } = await supabase
        .from('groups').select('*').eq('id', groupId).single();
      if (groupError) throw groupError;
      setGroup(groupData);

      const { data: driversData, error: driversError } = await supabase
        .from('drivers_season')
        .select(`
          piloto_id, numero_auto, escuderia_id,
          drivers:piloto_id ( id, nombre_completo, acronimo, numero, nacionalidad ),
          teams:escuderia_id ( id, nombre, color_principal )
        `)
        .eq('temporada', groupData.temporada);
      if (driversError) throw driversError;

      const mappedDrivers = driversData.map(d => ({
        id: d.drivers.id,
        nombre: d.drivers.nombre_completo,
        numero: d.numero_auto || d.drivers.numero,
        equipo: d.teams?.nombre || 'Sin equipo',
        equipoId: d.escuderia_id,
        color: d.teams?.color_principal || '#CCCCCC'
      }));
      setDrivers(mappedDrivers);

      const { data: backupData } = await supabase
        .from('predicciones_respaldo')
        .select('*')
        .eq('grupo_id', groupId)
        .eq('usuario_id', user.id)
        .maybeSingle();

      if (backupData) {
        setIsActive(backupData.activo);
        const ordered = backupData.posiciones.map(id => mappedDrivers.find(d => d.id === id)).filter(Boolean);
        setSelectedDrivers(ordered);
        setAvailableDrivers(mappedDrivers.filter(d => !backupData.posiciones.includes(d.id)));
        if (backupData.vuelta_rapida_piloto_id) setFastestLapDriver(backupData.vuelta_rapida_piloto_id);
      } else {
        setAvailableDrivers(mappedDrivers);
      }

      const { data: creditsData } = await supabase
        .from('user_wildcard_credits')
        .select('creditos_no_comprados, creditos_comprados')
        .eq('usuario_id', user.id)
        .maybeSingle();
      setCredits((creditsData?.creditos_no_comprados || 0) + (creditsData?.creditos_comprados || 0));

    } catch (err) {
      console.error('Error loading seguro data:', err);
      toast.error(t('seguro.loadError'));
    } finally {
      setLoading(false);
    }
  }

  const maxPositions = group?.cantidad_posiciones || 10;
  const needsMore = selectedDrivers.length < maxPositions;
  const hasFastestLapBonus = group?.bonus_vuelta_rapida_piloto || false;
  const isComplete = selectedDrivers.length === maxPositions && (!hasFastestLapBonus || fastestLapDriver);

  const handleDragStart = (event) => setActiveId(event.active.id);
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setSelectedDrivers((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  const handleDriverSelect = (driver) => {
    if (selectedDrivers.length >= maxPositions) return;
    setSelectedDrivers([...selectedDrivers, driver]);
    setAvailableDrivers(availableDrivers.filter(d => d.id !== driver.id));
  };

  const handleDriverRemove = (driver) => {
    setSelectedDrivers(selectedDrivers.filter(d => d.id !== driver.id));
    setAvailableDrivers([...availableDrivers, driver].sort((a, b) => a.numero - b.numero));
  };

  const handleSave = async (activar = false) => {
    if (selectedDrivers.length !== maxPositions) {
      toast.error(t('seguro.exactDriversError', { max: maxPositions }));
      return;
    }
    if (hasFastestLapBonus && !fastestLapDriver) {
      toast.error(t('seguro.selectFastestDriverError'));
      return;
    }

    setSaving(true);
    try {
      const payload = {
        usuario_id: user.id,
        grupo_id: groupId,
        posiciones: selectedDrivers.map(d => d.id),
        vuelta_rapida_piloto_id: hasFastestLapBonus ? fastestLapDriver : null,
        updated_at: new Date().toISOString()
      };

      if (activar) {
        payload.activo = true;
        payload.activado_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('predicciones_respaldo')
        .upsert(payload, { onConflict: 'usuario_id,grupo_id' });

      if (error) throw error;

      setIsActive(activar || isActive);
      toast.success(activar ? t('seguro.activatedSuccess') : t('seguro.savedSuccess'));
      setShowActivationModal(false);
    } catch (err) {
      console.error('Error saving seguro:', err);
      if (err.message?.includes('row-level security')) {
        toast.error(t('seguro.needsPremiumError'));
      } else {
        toast.error(t('seguro.saveError'));
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('predicciones_respaldo')
        .update({ activo: false })
        .eq('usuario_id', user.id)
        .eq('grupo_id', groupId);
      if (error) throw error;
      setIsActive(false);
      toast.success(t('seguro.deactivatedSuccess'));
    } catch (err) {
      console.error('Error deactivating seguro:', err);
      toast.error(t('seguro.saveError'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <style>{FONTS + CSS_STYLES}</style>
        <div data-theme={theme} className="seguro-page">
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
            <div>{t('seguro.loading')}</div>
          </div>
        </div>
      </>
    );
  }

  if (!group?.beta_seguro_prediccion) {
    return (
      <>
        <style>{FONTS + CSS_STYLES}</style>
        <div data-theme={theme} className="seguro-page">
          <BackButton className="seguro-back" onClick={() => navigate(`/group/${groupId}`)}>← {t('common.back')}</BackButton>
          <div className="seguro-locked">
            <div className="seguro-locked-icon">🛡️</div>
            <div>{t('seguro.notEnabledForGroup')}</div>
          </div>
        </div>
      </>
    );
  }

  const activeDriver = activeId ? selectedDrivers.find(d => d.id === activeId) : null;

  return (
    <>
      <style>{FONTS + CSS_STYLES}</style>
      <div data-theme={theme} className="seguro-page">
        <BackButton className="seguro-back" onClick={() => navigate(`/group/${groupId}`)}>← {t('common.back')}</BackButton>

        <h1 className="seguro-title">🛡️ {t('seguro.pageTitle')}</h1>
        <p className="seguro-subtitle">{group.nombre}</p>

        <div className={`seguro-status-card ${isActive ? 'activo' : ''}`}>
          <span className="seguro-status-icon">{isActive ? '🛡️' : '⚪'}</span>
          <div className="seguro-status-info">
            <div className="seguro-status-label">
              {isActive ? t('seguro.statusActive') : t('seguro.statusInactive')}
            </div>
            <div className="seguro-status-sub">
              {isActive ? t('seguro.statusActiveSub') : t('seguro.statusInactiveSub')}
            </div>
            <div className="seguro-credits-row">
              <span className="seguro-credits-badge">💰 {credits} {t('seguro.creditsWord')}</span>
              <span>{t('seguro.costPerUse', { cost: 3 })}</span>
            </div>
          </div>
          {isActive ? (
            <button className="seguro-toggle-btn desactivar" onClick={handleDeactivate} disabled={saving}>
              {t('seguro.deactivateBtn')}
            </button>
          ) : (
            <button
              className="seguro-toggle-btn activar"
              onClick={() => setShowActivationModal(true)}
              disabled={saving || !isComplete}
            >
              {t('seguro.activateBtn')}
            </button>
          )}
        </div>

        <div className="seguro-instruction-box">
          <h3 className="seguro-instruction-title">📝 {t('seguro.instructionsTitle')}</h3>
          <p className="seguro-instruction-text">{t('seguro.instructionsText', { max: maxPositions })}</p>
        </div>

        <div className="seguro-grid">
          <div className="seguro-list">
            <div className="seguro-list-title">{t('seguro.yourBackup', { current: selectedDrivers.length, max: maxPositions })}</div>
            {selectedDrivers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
                {t('seguro.selectFromList')}
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <SortableContext items={selectedDrivers.map(d => d.id)} strategy={verticalListSortingStrategy}>
                  {selectedDrivers.map((driver, idx) => (
                    <SortableSeguroDriver key={driver.id} driver={driver} position={idx + 1} onRemove={handleDriverRemove} />
                  ))}
                </SortableContext>
                <DragOverlay>
                  {activeDriver ? (
                    <div className="seguro-driver-item" style={{ opacity: 0.9 }}>
                      <div className="seguro-position-number">{selectedDrivers.findIndex(d => d.id === activeDriver.id) + 1}</div>
                      <div className="seguro-driver-color" style={{ background: activeDriver.color }} />
                      <div className="seguro-driver-info">
                        <div className="seguro-driver-name">{activeDriver.nombre}</div>
                        <div className="seguro-driver-team">{activeDriver.equipo}</div>
                      </div>
                      <div className="seguro-driver-number">#{activeDriver.numero}</div>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>

          {needsMore && (
            <div className="seguro-list">
              <div className="seguro-list-title">{t('seguro.availableDrivers')}</div>
              {availableDrivers.map(driver => (
                <div key={driver.id} className="seguro-driver-item clickable" onClick={() => handleDriverSelect(driver)}>
                  <div className="seguro-driver-color" style={{ background: driver.color }} />
                  <div className="seguro-driver-info">
                    <div className="seguro-driver-name">{driver.nombre}</div>
                    <div className="seguro-driver-team">{driver.equipo}</div>
                  </div>
                  <div className="seguro-driver-number">#{driver.numero}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {hasFastestLapBonus && (
          <div className="seguro-bonus-section">
            <label className="seguro-bonus-label">🏁 {t('seguro.fastestLapBonus')}</label>
            <select value={fastestLapDriver} onChange={(e) => setFastestLapDriver(e.target.value)}>
              <option value="">{t('seguro.selectDriverPlaceholder')}</option>
              {drivers.map(d => (
                <option key={d.id} value={d.id}>#{d.numero} {d.nombre} ({d.equipo})</option>
              ))}
            </select>
          </div>
        )}

        <div className="seguro-actions">
          <button className="seguro-btn-save" onClick={() => handleSave(false)} disabled={saving || selectedDrivers.length !== maxPositions}>
            {saving ? t('seguro.saving') : t('seguro.saveBtn')}
          </button>
        </div>
      </div>

      {showActivationModal && (
        <div className="seguro-modal-overlay" onClick={() => setShowActivationModal(false)}>
          <div data-theme={theme} className="seguro-modal" onClick={(e) => e.stopPropagation()}>
            <div className="seguro-modal-icon">🛡️</div>
            <h2 className="seguro-modal-title">{t('seguro.consentTitle')}</h2>
            <p className="seguro-modal-text">{t('seguro.consentText', { cost: 3 })}</p>
            <div className="seguro-modal-actions">
              <button className="seguro-modal-btn cancel" onClick={() => setShowActivationModal(false)}>
                {t('common.cancel')}
              </button>
              <button className="seguro-modal-btn confirm" onClick={() => handleSave(true)} disabled={saving}>
                {t('seguro.consentConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}