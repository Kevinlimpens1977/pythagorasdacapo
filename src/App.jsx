import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/auth/AuthProvider';
import LoginScreen from './components/auth/LoginScreen';
import AppShell from './components/layout/AppShell';
import TableOfContents from './components/layout/TableOfContents';
import StudentLessonPage from './pages/StudentLessonPage';
import ClassOverview from './components/dashboard/ClassOverview';
import AdminDashboardPage from './pages/AdminDashboardPage';
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
import AdminSlidedecksPage from './pages/AdminSlidedecksPage';

const PrivateRoute = ({ children, requireAdmin = false }) => {
  const { user, isAdmin } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" />;

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/" element={<PrivateRoute><AppShell /></PrivateRoute>}>
        <Route index element={<TableOfContents />} />
        <Route path="profiel" element={<StudentProfilePage />} />
        <Route path="chapter/:chapterId" element={<StudentLessonPage />} />
        <Route path="admin" element={
          <PrivateRoute requireAdmin={true}>
            <AdminDashboardPage />
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
        <Route path="admin/spellen" element={
          <PrivateRoute requireAdmin={true}>
            <AdminSpellenPage />
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
