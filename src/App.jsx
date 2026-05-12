import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/auth/AuthProvider';
import LoginScreen from './components/auth/LoginScreen';
import AppShell from './components/layout/AppShell';
import TableOfContents from './components/layout/TableOfContents';
import SlideRenderer from './components/slides/SlideRenderer';
import ClassOverview from './components/dashboard/ClassOverview';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminCropToolPage from './pages/AdminCropToolPage';
import AdminCmsPage from './pages/AdminCmsPage';
import AdminKlassenPage from './pages/AdminKlassenPage';
import AdminDigibordPage from './pages/AdminDigibordPage';
import ClassSelectionModal from './components/auth/ClassSelectionModal';

const PrivateRoute = ({ children, requireAdmin = false }) => {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser) return <Navigate to="/login" />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" />;

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/" element={<PrivateRoute><AppShell /></PrivateRoute>}>
        <Route index element={<TableOfContents />} />
        <Route path="chapter/:chapterId" element={<SlideRenderer />} />
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
