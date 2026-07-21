import { useEffect } from 'react';
import { usePushNotifications } from './hooks/usePushNotifications';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from './stores/authStore';
import ToastContainer from './components/Toast';
import AppOnboarding from './pages/Onboarding/AppOnboarding';
import { isNative } from './hooks/usePlatform';
import { useTranslation } from './i18n';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App as CapApp } from '@capacitor/app';
import { AdMob } from '@capacitor-community/admob';
import PersistentAdBanner from './components/PersistentAdBanner';

// Public Pages
import Landing from './pages/Landing/Landing';
import JoinGroup from './pages/Groups/JoinGroup';
import HowItWorks from './pages/HowItWorks/HowItWorks';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import TermsOfService from './pages/Legal/TermsOfService';
import SupportPage from './pages/Legal/SupportPage';




// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import DeleteAccount from './pages/Settings/DeleteAccount';
import UpgradePage from './pages/Upgrade/UpgradePage';
import SeguroPredictionPage from './pages/Seguro/SeguroPredictionPage';


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
import ManualResults from './pages/Admin/ManualResults';

// Stats Pages
import PointsHistogram from './pages/Stats/PointsHistogram';
import PredictionAnalysis from './pages/Stats/PredictionAnalysis';
import DeepAnalytics from './pages/Stats/DeepAnalytics';


// Protected route wrapper
function ProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const { t } = useTranslation();

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
          <div>{t('common.loading')}</div>
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
  const { t } = useTranslation(); 

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
          <div>{t('common.loading')}</div>
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
  usePushNotifications();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isNative) return;
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });
  }, []);

  useEffect(() => {
    if (!isNative) return;
    const backHandler = CapApp.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      }
    });
    return () => {
      backHandler.then(h => h.remove());
    };
  }, []);
  
  useEffect(() => {
    if (!isNative) return;
    AdMob.initialize({ requestTrackingAuthorization: false })
      .then(() => console.log('[AdMob] initialized ✅'))
      .catch((e) => console.error('[AdMob] init error', e));
  }, []);

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
                {isNative ? <AppOnboarding /> : <Landing />}
              </PublicRoute>
            } 
          />
          
          <Route path="/como-funciona" element={<HowItWorks />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/support" element={<SupportPage />} />

          


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
          <Route path="/group/:groupId/seguro" element={<ProtectedRoute><SeguroPredictionPage /></ProtectedRoute>} />
          <Route path="/admin/race/:raceId/results" element={<ProtectedRoute><ManualResults /></ProtectedRoute>} />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route path="/upgrade" element={<ProtectedRoute><UpgradePage /></ProtectedRoute>} />

          <Route path="/delete-account" element={<ProtectedRoute><DeleteAccount /></ProtectedRoute>} />



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

          {/* Stats - Deep Analytics (más específica, va primero) */}
          <Route
            path="/group/:groupId/stats/deep"
            element={
              <ProtectedRoute>
                <DeepAnalytics />
              </ProtectedRoute>
            }
          />

          {/* Stats - Análisis */}
          <Route
            path="/group/:groupId/stats/analysis"
            element={
              <ProtectedRoute>
                <PredictionAnalysis />
              </ProtectedRoute>
            }
          />

          {/* Stats - Histograma de Puntos */}
          <Route
            path="/group/:groupId/stats"
            element={
              <ProtectedRoute>
                <PointsHistogram />
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
        <PersistentAdBanner />
      </BrowserRouter>
    </>
  );
}