import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from './stores/authStore';
import ToastContainer from './components/Toast';

// Public Pages
import Landing from './pages/Landing/Landing';
import JoinGroup from './pages/Groups/JoinGroup';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

// Main Pages
import Dashboard from './pages/Dashboard/Dashboard';
import PredictionPage from './pages/Predictions/PredictionPage';
import GroupDetail from './pages/Groups/GroupDetail';

// Admin Pages
import ImportResults from './pages/Admin/ImportResults';
import GroupAdminPanel from './pages/Admin/GroupAdminPanel';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import RacesPage from './pages/Races/RacesPage';
import RaceDetailPage from './pages/Races/RaceDetailPage';
import SuperAdminPanel from './pages/Admin/SuperAdminPanel';
import RacePredictionsComparison from './pages/Predictions/RacePredictionsComparison';



// Protected route wrapper
function ProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0A0A0C',
        color: '#F0F0F0',
        fontFamily: 'system-ui',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏎</div>
          <div>Cargando...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/landing" replace />;
  }

  return children;
}

// Public route wrapper (redirects to dashboard if already logged in)
function PublicRoute({ children }) {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0A0A0C',
        color: '#F0F0F0',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏎</div>
          <div>Cargando...</div>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Toaster position="top-right" theme="dark" />
        <Routes>
          {/* ========================================
              PUBLIC ROUTES
          ======================================== */}
          
          {/* Landing Page */}
          <Route 
            path="/landing" 
            element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            } 
          />

          {/* Join Group via Invite Link */}
          <Route path="/join/:inviteCode" element={<JoinGroup />} />

          {/* Auth Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ========================================
              PROTECTED ROUTES (SPECIFIC → GENERAL)
          ======================================== */}

          {/* Profile & Settings */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />

          {/* Super Admin Panel */}
          <Route
            path="/super-admin"
            element={
              <ProtectedRoute>
                <SuperAdminPanel />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/import-results"
            element={
              <ProtectedRoute>
                <ImportResults />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin/group/:groupId" 
            element={
              <ProtectedRoute>
                <GroupAdminPanel />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/group/:groupId/race/:raceId/predictions"
            element={<ProtectedRoute><RacePredictionsComparison /></ProtectedRoute>}
          />

          {/* Group Routes - ESPECÍFICAS PRIMERO */}
          
          {/* Group Details - Ver Miembros */}
          <Route 
            path="/group/:groupId/details" 
            element={
              <ProtectedRoute>
                <GroupDetail />
              </ProtectedRoute>
            } 
          />

          {/* Race Routes */}
          <Route 
            path="/group/:groupId/race/:raceId" 
            element={
              <ProtectedRoute>
                <RaceDetailPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/group/:groupId/races" 
            element={
              <ProtectedRoute>
                <RacesPage />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/group/:groupId/predict/:raceId"
            element={
              <ProtectedRoute>
                <PredictionPage />
              </ProtectedRoute>
            }
          />

          {/* Group Dashboard - GENERAL (va después de las específicas) */}
          <Route
            path="/group/:groupId"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Root Dashboard */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to landing */}
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}