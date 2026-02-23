import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useToastStore } from '../../stores/toastStore';
import { supabase } from '../../lib/supabase';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');`;

const CSS = `
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

.super-admin-panel {
  padding: 24px 28px;
  max-width: 1600px;
  margin: 0 auto;
  background: var(--bg);
  min-height: 100vh;
}

.back-btn {
  background: transparent;
  border: none;
  color: var(--red);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  transition: opacity 0.2s;
}

.back-btn:hover { opacity: 0.7; }

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.panel-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 36px;
  font-weight: 900;
  color: var(--white);
}

.panel-subtitle {
  color: var(--muted);
  font-size: 14px;
  margin-top: 4px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(232, 0, 45, 0.1);
}

.stat-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.stat-value {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 48px;
  font-weight: 900;
  color: var(--white);
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 8px;
}

.tabs-container {
  margin-bottom: 24px;
}

.tabs-nav {
  display: flex;
  gap: 8px;
  border-bottom: 2px solid var(--border);
  margin-bottom: 24px;
}

.tab-btn {
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  padding: 12px 20px;
  color: var(--muted);
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: -2px;
}

.tab-btn.active {
  color: var(--red);
  border-bottom-color: var(--red);
}

.tab-btn:hover:not(.active) {
  color: var(--white);
}

.search-bar {
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--white);
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: var(--red);
}

.data-table {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
}

.data-table table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: var(--bg3);
  padding: 16px;
  text-align: left;
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
}

.data-table td {
  padding: 16px;
  border-top: 1px solid var(--border);
  color: var(--white);
}

.data-table tr:hover {
  background: var(--bg3);
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.badge.active {
  background: rgba(0, 212, 160, 0.15);
  color: var(--green);
}

.badge.inactive {
  background: var(--bg3);
  color: var(--muted);
}

.btn-view {
  background: var(--red);
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  color: white;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-view:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .super-admin-panel {
    padding: 16px;
  }
  
  .panel-title {
    font-size: 28px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .data-table {
    overflow-x: auto;
  }
  
  .data-table table {
    min-width: 800px;
  }
}
`;

export default function SuperAdminPanel() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  const toast = useToastStore();

  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGroups: 0,
    totalPredictions: 0,
    totalRaces: 0
  });
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    checkSuperAdmin();
  }, [user]);

  useEffect(() => {
    if (isSuperAdmin) {
      loadData();
    }
  }, [isSuperAdmin]);

  const checkSuperAdmin = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('is_super_admin')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (!data.is_super_admin) {
        toast.error('No tienes permisos para acceder a esta página');
        navigate('/');
        return;
      }

      setIsSuperAdmin(true);
    } catch (err) {
      console.error('Error checking super admin:', err);
      navigate('/');
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Stats
      const [usersCount, groupsCount, predictionsCount, racesCount] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('groups').select('id', { count: 'exact', head: true }),
        supabase.from('predictions').select('id', { count: 'exact', head: true }),
        supabase.from('races').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        totalUsers: usersCount.count || 0,
        totalGroups: groupsCount.count || 0,
        totalPredictions: predictionsCount.count || 0,
        totalRaces: racesCount.count || 0
      });

      // Users
      const { data: usersData } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      setUsers(usersData || []);

      // Groups with creator info
      const { data: groupsData } = await supabase
        .from('groups')
        .select(`
          *,
          creator:users!groups_creador_id_fkey(nombre, apellido, email)
        `)
        .order('created_at', { ascending: false });

      setGroups(groupsData || []);

    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGroups = groups.filter(g =>
    g.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.creator?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <style>{FONTS + CSS}</style>
        <div data-theme={theme} className="super-admin-panel">
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚙️</div>
            <div>Cargando panel...</div>
          </div>
        </div>
      </>
    );
  }

  if (!isSuperAdmin) return null;

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div data-theme={theme} className="super-admin-panel">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Volver al Dashboard
        </button>

        <div className="panel-header">
          <div>
            <h1 className="panel-title">⚙️ Panel de Super Admin</h1>
            <p className="panel-subtitle">Administración general de PodioF1</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Usuarios</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏁</div>
            <div className="stat-value">{stats.totalGroups}</div>
            <div className="stat-label">Grupos</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{stats.totalPredictions}</div>
            <div className="stat-label">Predicciones</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏎</div>
            <div className="stat-value">{stats.totalRaces}</div>
            <div className="stat-label">Carreras</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs-nav">
            <button 
              className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 Usuarios
            </button>
            <button 
              className={`tab-btn ${activeTab === 'groups' ? 'active' : ''}`}
              onClick={() => setActiveTab('groups')}
            >
              🏁 Grupos
            </button>
          </div>

          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Users Table */}
          {activeTab === 'users' && (
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>País</th>
                    <th>Año Nac.</th>
                    <th>Registro</th>
                    <th>Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td>{u.nombre} {u.apellido}</td>
                      <td>{u.email}</td>
                      <td>{u.pais || '-'}</td>
                      <td>{u.anho_nacimiento || '-'}</td>
                      <td>{new Date(u.created_at).toLocaleDateString('es')}</td>
                      <td>
                        {u.is_super_admin ? (
                          <span className="badge active">SUPER</span>
                        ) : (
                          <span className="badge inactive">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Groups Table */}
          {activeTab === 'groups' && (
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Creador</th>
                    <th>Temporada</th>
                    <th>Código</th>
                    <th>Creado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGroups.map(g => (
                    <tr key={g.id}>
                      <td>{g.nombre}</td>
                      <td>{g.creator?.nombre} {g.creator?.apellido}</td>
                      <td>{g.temporada}</td>
                      <td style={{ fontFamily: 'monospace' }}>{g.codigo_invitacion}</td>
                      <td>{new Date(g.created_at).toLocaleDateString('es')}</td>
                      <td>
                        <button 
                          className="btn-view"
                          onClick={() => navigate(`/group/${g.id}`)}
                        >
                          Ver →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}