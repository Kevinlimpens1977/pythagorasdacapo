import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/auth/AuthProvider';
import LoginScreen from './components/auth/LoginScreen';
import AdminLoginScreen from './components/auth/AdminLoginScreen';
import AppShell from './components/layout/AppShell';
import TableOfContents from './components/layout/TableOfContents';
import StudentLessonPage from './pages/StudentLessonPage';
import ClassOverview from './components/dashboard/ClassOverview';
import AdminCropToolPage from './pages/AdminCropToolPage';
import AdminCmsPage from './pages/AdminCmsPage';
import AdminKlassenPage from './pages/AdminKlassenPage';
import AdminDigibordPage from './pages/AdminDigibordPage';
import TakenToewijzenPage from './pages/TakenToewijzenPage';
import StudentProfilePage from './pages/StudentProfilePage';
import ClassSelectionModal from './components/auth/ClassSelectionModal';
import AdminLesstofPage from './pages/AdminLesstofPage';
import AdminLeerlingenPage from './pages/AdminLeerlingenPage';
import AdminSpellenPage from './pages/AdminSpellenPage';
import AdminPresenterPage from './pages/AdminPresenterPage';
import AdminSlidedecksPage from './pages/AdminSlidedecksPage';
import AdminAiSettingsPage from './pages/AdminAiSettingsPage';
import AdminMeldingenPage from './pages/AdminMeldingenPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminProjectKompasPage from './pages/AdminProjectKompasPage';
import StudentTokenShopPage from './pages/StudentTokenShopPage';
import StudentSpellenPage from './pages/StudentSpellenPage';
import AdminTokenManagementPage from './pages/AdminTokenManagementPage';

const PrivateRoute = ({ children, requireAdmin = false }) => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" />;

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/login/beheer" element={<AdminLoginScreen />} />
      <Route path="/" element={<PrivateRoute><AppShell /></PrivateRoute>}>
        <Route index element={<TableOfContents />} />
        <Route path="profiel" element={<StudentProfilePage />} />
        <Route path="tokenshop" element={<StudentTokenShopPage />} />
        <Route path="spellen" element={<StudentSpellenPage />} />
        <Route path="chapter/:chapterId" element={<StudentLessonPage />} />
        <Route path="admin" element={
          <PrivateRoute requireAdmin={true}>
            <Navigate to="/admin/instellingen" replace />
          </PrivateRoute>
        } />
        <Route path="dashboard" element={
          <PrivateRoute requireAdmin={true}>
            <ClassOverview />
          </PrivateRoute>
        } />
        <Route path="admin/crop-tool" element={
          <PrivateRoute requireAdmin={true}>
            <AdminCropToolPage />
          </PrivateRoute>
        } />
        <Route path="admin/lesstof" element={
          <PrivateRoute requireAdmin={true}>
            <AdminLesstofPage />
          </PrivateRoute>
        } />
        <Route path="admin/leerlingen" element={
          <PrivateRoute requireAdmin={true}>
            <AdminLeerlingenPage />
          </PrivateRoute>
        } />
        <Route path="admin/tokenbeheer" element={
          <PrivateRoute requireAdmin={true}>
            <AdminTokenManagementPage />
          </PrivateRoute>
        } />
        <Route path="admin/meldingen" element={
          <PrivateRoute requireAdmin={true}>
            <AdminMeldingenPage />
          </PrivateRoute>
        } />
        <Route path="admin/spellen" element={
          <PrivateRoute requireAdmin={true}>
            <AdminSpellenPage />
          </PrivateRoute>
        } />
        <Route path="admin/presenter" element={
          <PrivateRoute requireAdmin={true}>
            <AdminPresenterPage />
          </PrivateRoute>
        } />
        <Route path="admin/slidedecks" element={
          <PrivateRoute requireAdmin={true}>
            <AdminSlidedecksPage />
          </PrivateRoute>
        } />
        <Route path="admin/cms" element={
          <PrivateRoute requireAdmin={true}>
            <AdminCmsPage />
          </PrivateRoute>
        } />
        <Route path="admin/klassen" element={
          <PrivateRoute requireAdmin={true}>
            <AdminKlassenPage />
          </PrivateRoute>
        } />
        <Route path="admin/digibord" element={
          <PrivateRoute requireAdmin={true}>
            <AdminDigibordPage />
          </PrivateRoute>
        } />
        <Route path="admin/taken-toewijzen" element={
          <PrivateRoute requireAdmin={true}>
            <TakenToewijzenPage />
          </PrivateRoute>
        } />
        <Route path="admin/ai-instellingen" element={
          <PrivateRoute requireAdmin={true}>
            <AdminAiSettingsPage />
          </PrivateRoute>
        } />
        <Route path="admin/instellingen" element={
          <PrivateRoute requireAdmin={true}>
            <AdminSettingsPage />
          </PrivateRoute>
        } />
        <Route path="admin/projectkompas" element={
          <PrivateRoute requireAdmin={true}>
            <AdminProjectKompasPage />
          </PrivateRoute>
        } />
      </Route>
    </Routes>
  );
}

function AppWithModal() {
  return (
    <>
      <AppRoutes />
      <ClassSelectionModal />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppWithModal />
      </Router>
    </AuthProvider>
  );
}

export default App;
