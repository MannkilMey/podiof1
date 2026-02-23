import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useToastStore } from '../../stores/toastStore';
import { usePrediction } from '../../hooks/usePrediction';
import { supabase } from '../../lib/supabase';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
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

.prediction-page {
  padding: 24px 28px;
  max-width: 900px;
  margin: 0 auto;
  background: var(--bg);
  min-height: calc(100vh - 60px);
}

.pred-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.back-btn {
  background: transparent;
  border: none;
  color: var(--red);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  transition: opacity 0.2s;
}

.back-btn:hover { opacity: 0.7; }

.theme-toggle {
  display: flex;
  align-items: center;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.theme-opt {
  padding: 6px 10px;
  cursor: pointer;
  font-size: 15px;
  transition: background 0.2s;
  color: var(--muted);
  border: none;
  background: transparent;
  font-family: inherit;
}

.theme-opt.active { 
  background: var(--red); 
  color: white; 
}

.prediction-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 32px;
  font-weight: 900;
  color: var(--white);
  margin-bottom: 8px;
}

.prediction-subtitle {
  color: var(--muted);
  font-size: 16px;
  margin-bottom: 16px;
}

.deadline-banner {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  transition: all 0.3s;
}

.deadline-banner.warning {
  border-color: rgba(232, 0, 45, 0.3);
  background: var(--red-dim);
}

.deadline-banner.expired {
  border-color: rgba(128, 128, 128, 0.3);
  background: var(--muted);
  opacity: 0.6;
}

.deadline-text {
  font-size: 14px;
  color: var(--white);
  font-weight: 600;
}

.instruction-box {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.instruction-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 18px;
  font-weight: 800;
  color: var(--white);
  margin-bottom: 12px;
}

.instruction-text {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
}

.prediction-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.drivers-list {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
}

.list-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 16px;
}

.driver-item {
  background: var(--bg3);
  border: 2px solid var(--border);
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: grab;
  transition: all 0.2s;
  user-select: none;
  position: relative;
}

.driver-item:active {
  cursor: grabbing;
}

.driver-item:hover {
  border-color: var(--red);
  transform: translateX(4px);
}

.driver-item.dragging {
  opacity: 0.5;
}

.driver-item.selected {
  background: var(--red-dim);
  border-color: var(--red);
}

.driver-item.clickable {
  cursor: pointer;
}

.position-number {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 20px;
  font-weight: 900;
  color: var(--white);
  min-width: 32px;
  text-align: center;
}

.position-number.podium {
  color: var(--gold);
}

.driver-color {
  width: 4px;
  height: 40px;
  border-radius: 2px;
}

.driver-info {
  flex: 1;
}

.driver-name {
  font-weight: 600;
  color: var(--white);
  font-size: 15px;
  margin-bottom: 2px;
}

.driver-team {
  font-size: 12px;
  color: var(--muted);
}

.driver-number {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--muted);
  min-width: 36px;
  text-align: right;
}

.drag-icon {
  color: var(--muted);
  font-size: 18px;
}

.remove-btn {
  background: var(--red-dim);
  border: 1px solid var(--red);
  border-radius: 6px;
  color: var(--red);
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: var(--red);
  color: white;
}

.bonus-section {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 24px;
}

.bonus-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.bonus-select {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bonus-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--muted);
}

.prediction-page select {
  width: 100%;
  padding: 12px 16px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--white);
  font-size: 14px;
  cursor: pointer;
  font-family: 'Barlow', sans-serif;
}

.actions {
  display: flex;
  gap: 12px;
}

.btn-save {
  flex: 1;
  padding: 16px;
  background: linear-gradient(135deg, var(--red), #FF3355);
  border: none;
  border-radius: 12px;
  color: white;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
}

.btn-save:hover {
  opacity: 0.88;
  transform: translateY(-2px);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-cancel {
  flex: 1;
  padding: 16px;
  background: transparent;
  border: 2px solid var(--border);
  border-radius: 12px;
  color: var(--white);
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  border-color: var(--red);
  color: var(--red);
  background: var(--red-dim);
}

.locked-message {
  text-align: center;
  padding: 40px 20px;
  color: var(--muted);
}

.locked-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.3;
}

@media (max-width: 900px) {
  .prediction-page { padding: 16px; }
  .bonus-grid { grid-template-columns: 1fr; }
  .pred-header { flex-direction: column; gap: 12px; align-items: flex-start; }
}
`;

function SortableDriver({ driver, position, isSelected, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: driver.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`driver-item ${isDragging ? 'dragging' : ''} ${isSelected ? 'selected' : ''}`}
    >
      <div {...attributes} {...listeners}>
        <div className={`position-number ${position <= 3 ? 'podium' : ''}`}>
          {position}
        </div>
      </div>
      <div className="driver-color" style={{ background: driver.color }} />
      <div className="driver-info">
        <div className="driver-name">{driver.nombre}</div>
        <div className="driver-team">{driver.equipo}</div>
      </div>
      <div className="driver-number">#{driver.numero}</div>
      <div {...attributes} {...listeners} className="drag-icon">⋮⋮</div>
      {onRemove && (
        <button className="remove-btn" onClick={(e) => {
          e.stopPropagation();
          onRemove(driver);
        }}>
          ✕
        </button>
      )}
    </div>
  );
}

export default function PredictionPage() {
  const { groupId, raceId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const toast = useToastStore();
  
  const { drivers, group, race, existingPrediction, canPredict, loading, error } = usePrediction(
    groupId,
    raceId,
    user?.id
  );

  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [fastestLapDriver, setFastestLapDriver] = useState('');
  const [fastestLapTeam, setFastestLapTeam] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!drivers || drivers.length === 0) return;

    if (existingPrediction?.posiciones) {
      const orderedDrivers = existingPrediction.posiciones
        .map(id => drivers.find(d => d.id === id))
        .filter(Boolean);
      
      setSelectedDrivers(orderedDrivers);
      setAvailableDrivers(drivers.filter(d => !existingPrediction.posiciones.includes(d.id)));
      
      if (existingPrediction.vuelta_rapida_piloto_id) {
        setFastestLapDriver(existingPrediction.vuelta_rapida_piloto_id);
      }
      if (existingPrediction.vuelta_rapida_escuderia_id) {
        setFastestLapTeam(existingPrediction.vuelta_rapida_escuderia_id);
      }
    } else {
      setAvailableDrivers(drivers);
    }
  }, [drivers, existingPrediction]);

  const maxPositions = group?.cantidad_posiciones || 10;
  const needsMore = selectedDrivers.length < maxPositions;
  const hasFastestLapDriver = group?.bonus_vuelta_rapida_piloto || false;
  const hasFastestLapTeam = group?.bonus_vuelta_rapida_escuderia || false;

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

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
    if (!canPredict) return;
    
    if (selectedDrivers.length >= maxPositions) {
      toast.error(`Solo puedes seleccionar ${maxPositions} pilotos`);
      return;
    }

    setSelectedDrivers([...selectedDrivers, driver]);
    setAvailableDrivers(availableDrivers.filter(d => d.id !== driver.id));
  };

  const handleDriverRemove = (driver) => {
    if (!canPredict) return;
    
    setSelectedDrivers(selectedDrivers.filter(d => d.id !== driver.id));
    setAvailableDrivers([...availableDrivers, driver].sort((a, b) => 
      a.numero - b.numero
    ));
  };

  const handleSave = async () => {
    if (selectedDrivers.length !== maxPositions) {
      toast.error(`Debes seleccionar exactamente ${maxPositions} pilotos`);
      return;
    }

    if (hasFastestLapDriver && !fastestLapDriver) {
      toast.error('Selecciona el piloto con vuelta más rápida');
      return;
    }

    if (hasFastestLapTeam && !fastestLapTeam) {
      toast.error('Selecciona el equipo con vuelta más rápida');
      return;
    }

    setSaving(true);

    try {
      const posiciones = selectedDrivers.map(d => d.id);
      const predictionData = {
        posiciones,
        updated_at: new Date().toISOString()
      };

      if (hasFastestLapDriver) {
        predictionData.vuelta_rapida_piloto_id = fastestLapDriver;
      }

      if (hasFastestLapTeam) {
        predictionData.vuelta_rapida_escuderia_id = fastestLapTeam;
      }

      if (existingPrediction) {
        const { error: updateError } = await supabase
          .from('predictions')
          .update(predictionData)
          .eq('id', existingPrediction.id);

        if (updateError) throw updateError;
        toast.success('¡Predicción actualizada exitosamente! 🏁');
      } else {
        const { error: insertError } = await supabase
          .from('predictions')
          .insert({
            grupo_id: groupId,
            carrera_id: raceId,
            usuario_id: user.id,
            ...predictionData
          });

        if (insertError) throw insertError;
        toast.success('¡Predicción guardada exitosamente! 🏁');
      }

      setTimeout(() => {
        navigate(`/group/${groupId}`);
      }, 1500);

    } catch (err) {
      console.error('Error saving prediction:', err);
      toast.error('Error al guardar predicción. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/group/${groupId}`);
  };

  if (loading) {
    return (
      <>
        <style>{FONTS + CSS_STYLES}</style>
        <div data-theme={theme} className="prediction-page">
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏎</div>
            <div>Cargando predicción...</div>
          </div>
        </div>
      </>
    );
  }

  if (error || !race) {
    return (
      <>
        <style>{FONTS + CSS_STYLES}</style>
        <div data-theme={theme} className="prediction-page">
          <button className="back-btn" onClick={() => navigate(`/group/${groupId}`)}>
            ← Volver al grupo
          </button>
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--red)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <div>Error al cargar predicción</div>
          </div>
        </div>
      </>
    );
  }

  const activeDriver = activeId ? selectedDrivers.find(d => d.id === activeId) : null;
  
  // Get unique teams with real UUIDs
  const getUniqueTeams = () => {
    const teamMap = new Map();
    drivers.forEach(driver => {
      if (driver.equipoId && !teamMap.has(driver.equipoId)) {
        teamMap.set(driver.equipoId, {
          id: driver.equipoId,
          nombre: driver.equipo
        });
      }
    });
    return Array.from(teamMap.values());
  };

  const teams = getUniqueTeams();

  return (
    <>
      <style>{FONTS + CSS_STYLES}</style>
      <div data-theme={theme} className="prediction-page">
        <div className="pred-header">
          <button className="back-btn" onClick={() => navigate(`/group/${groupId}`)}>
            ← Volver al grupo
          </button>
          
          <div className="theme-toggle">
            <button 
              className={`theme-opt ${theme === "dark" ? "active" : ""}`} 
              onClick={() => setTheme("dark")}
            >
              🌙
            </button>
            <button 
              className={`theme-opt ${theme === "light" ? "active" : ""}`} 
              onClick={() => setTheme("light")}
            >
              ☀️
            </button>
          </div>
        </div>

        <h1 className="prediction-title">{race.nombre}</h1>
        <p className="prediction-subtitle">
          {race.circuito} · {new Date(race.fecha_programada).toLocaleDateString('es', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>

        {!canPredict && (
          <div className="deadline-banner expired">
            <div className="deadline-text">
              🔒 Las predicciones están cerradas para esta carrera
            </div>
          </div>
        )}

        {canPredict && existingPrediction && (
          <div className="deadline-banner">
            <div className="deadline-text">
              ✏️ Editando tu predicción (puedes cambiarla hasta el deadline)
            </div>
          </div>
        )}

        {canPredict ? (
          <>
            <div className="instruction-box">
              <h3 className="instruction-title">📝 Instrucciones</h3>
              <p className="instruction-text">
                1. Selecciona {maxPositions} pilotos en el orden que crees que terminarán<br/>
                2. Arrastra para reordenar<br/>
                3. Haz clic en ✕ para quitar un piloto<br/>
                4. Guarda antes de que cierre el plazo
              </p>
            </div>

            <div className="prediction-grid">
              <div className="drivers-list">
                <div className="list-title">
                  Tu Predicción ({selectedDrivers.length}/{maxPositions})
                </div>
                
                {selectedDrivers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
                    Selecciona pilotos de la lista de abajo
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={selectedDrivers.map(d => d.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {selectedDrivers.map((driver, idx) => (
                        <SortableDriver
                          key={driver.id}
                          driver={driver}
                          position={idx + 1}
                          isSelected={true}
                          onRemove={handleDriverRemove}
                        />
                      ))}
                    </SortableContext>

                    <DragOverlay>
                      {activeDriver ? (
                        <div className="driver-item" style={{ opacity: 0.9 }}>
                          <div className="position-number">
                            {selectedDrivers.findIndex(d => d.id === activeDriver.id) + 1}
                          </div>
                          <div className="driver-color" style={{ background: activeDriver.color }} />
                          <div className="driver-info">
                            <div className="driver-name">{activeDriver.nombre}</div>
                            <div className="driver-team">{activeDriver.equipo}</div>
                          </div>
                          <div className="driver-number">#{activeDriver.numero}</div>
                        </div>
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                )}
              </div>

              {needsMore && (
                <div className="drivers-list">
                  <div className="list-title">
                    Pilotos Disponibles
                  </div>
                  {availableDrivers.map(driver => (
                    <div
                      key={driver.id}
                      className="driver-item clickable"
                      onClick={() => handleDriverSelect(driver)}
                    >
                      <div className="driver-color" style={{ background: driver.color }} />
                      <div className="driver-info">
                        <div className="driver-name">{driver.nombre}</div>
                        <div className="driver-team">{driver.equipo}</div>
                      </div>
                      <div className="driver-number">#{driver.numero}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {(hasFastestLapDriver || hasFastestLapTeam) && (
              <div className="bonus-section">
                <div className="list-title">🏁 Bonus Vuelta Más Rápida</div>
                <div className="bonus-grid">
                  {hasFastestLapDriver && (
                    <div className="bonus-select">
                      <label className="bonus-label">Piloto</label>
                      <select 
                        value={fastestLapDriver}
                        onChange={(e) => setFastestLapDriver(e.target.value)}
                      >
                        <option value="">Seleccionar piloto...</option>
                        {drivers.map(d => (
                          <option key={d.id} value={d.id}>
                            #{d.numero} {d.nombre} ({d.equipo})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {hasFastestLapTeam && (
                    <div className="bonus-select">
                      <label className="bonus-label">Escudería</label>
                      <select
                        value={fastestLapTeam}
                        onChange={(e) => setFastestLapTeam(e.target.value)}
                      >
                        <option value="">Seleccionar escudería...</option>
                        {teams.map((team) => (
                          <option key={team.id} value={team.id}>{team.nombre}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="actions">
              <button
                className="btn-save"
                onClick={handleSave}
                disabled={selectedDrivers.length !== maxPositions || saving}
              >
                {saving ? 'Guardando...' : existingPrediction ? 'Actualizar Predicción' : 'Guardar Predicción'}
              </button>
              <button
                className="btn-cancel"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <div className="locked-message">
            <div className="locked-icon">🔒</div>
            <h2>Predicciones Cerradas</h2>
            <p>El plazo para predecir esta carrera ha expirado</p>
            {existingPrediction && (
              <p style={{ marginTop: 20, color: 'var(--white)' }}>
                ✅ Ya enviaste tu predicción
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}