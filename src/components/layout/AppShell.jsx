import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import NameSetupModal from '../auth/NameSetupModal';
import CmsResetButton from '../admin/CmsResetButton';
import DeleteStudentsButton from '../admin/DeleteStudentsButton';
import StudentBugReportButton from '../studentBugReports/StudentBugReportButton';
import { StudentBugReportContext } from '../studentBugReports/StudentBugReportContext';
import { BarChart3, BookOpen, Bug, Gamepad2, LogOut, Presentation, SettingsIcon, User, Users } from 'lucide-react';
import { ADMIN_WORKSPACES, isAdminWorkspaceActive } from '../../lib/adminWorkspaceNav';
import helixLogo from '../../afbeeldingen/logo.png';

const workspaceIcons = {
  lesstof: BookOpen,
  voortgang: BarChart3,
  leerlingen: Users,
  meldingen: Bug,
  spellen: Gamepad2,
  presenter: Presentation,
  beheer: SettingsIcon
};

export default function AppShell() {
  const { currentUser, isAdmin, isDevBypass, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [studentBugReportContext, setStudentBugReportContext] = useState({});

  useEffect(() => {
    if (isAdmin && location.pathname === '/') {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, location.pathname, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <StudentBugReportContext.Provider value={{ context: studentBugReportContext, setContext: setStudentBugReportContext }}>
    <div className="helix-page flex min-h-screen flex-col font-sans selection:bg-fuchsia-100 selection:text-[var(--helix-navy)]">
      <NameSetupModal />

      <header className="sticky top-0 z-[100] flex min-h-20 items-center justify-between border-b border-[var(--helix-border)] bg-white/86 px-4 shadow-[0_14px_34px_-28px_rgba(11,19,43,0.45)] backdrop-blur-2xl md:px-10">
        <div className="flex min-w-0 items-center gap-4 md:gap-8">
          <h1
            onClick={() => navigate('/')}
            className="helix-brand group flex shrink-0 cursor-pointer items-center transition-opacity hover:opacity-90"
            aria-label="Ga naar HELIX start"
          >
            <span className="flex h-14 w-36 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm transition-transform group-hover:scale-[1.02] md:h-16 md:w-44">
              <img src={helixLogo} alt="HELIX" className="h-20 w-20 max-w-none scale-[1.2] object-contain" />
            </span>
          </h1>

          <nav className="custom-scrollbar flex max-w-[54vw] gap-1 overflow-x-auto rounded-2xl border border-[var(--helix-border)] bg-[var(--helix-surface-soft)]/82 p-1 md:max-w-none md:gap-2">
            {isAdmin ? (
              ADMIN_WORKSPACES.map((workspace) => {
                const Icon = workspaceIcons[workspace.id] || SettingsIcon;
                const isActive = isAdminWorkspaceActive(workspace, location.pathname);

                return (
                  <button
                    key={workspace.id}
                    onClick={() => navigate(workspace.path)}
                    className={`admin-nav-tab ${isActive ? 'admin-nav-tab-active' : ''}`}
                  >
                    <Icon size={18} />
                    <span className="hidden md:inline">{workspace.label}</span>
                  </button>
                );
              })
            ) : (
              <button
                onClick={() => navigate('/')}
                className={`admin-nav-tab ${
                  location.pathname === '/' || location.pathname.includes('/chapter/')
                    ? 'admin-nav-tab-active'
                    : ''
                }`}
              >
                <BookOpen size={18} />
                <span className="hidden md:inline">Lesmateriaal</span>
              </button>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {isAdmin && <DeleteStudentsButton />}
          {isAdmin && <CmsResetButton />}

          {isDevBypass && (
            <button
              onClick={handleLogout}
              className="hidden rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-black uppercase tracking-wide text-orange-700 transition-colors hover:bg-orange-100 lg:inline-flex"
              title="Reset tijdelijke testmodus"
            >
              Reset testmodus
            </button>
          )}

          {!isAdmin && <StudentBugReportButton />}

          {!isAdmin ? (
            <button
              onClick={() => navigate('/profiel')}
              className={`flex items-center gap-3 rounded-2xl border p-2.5 text-left transition-all focus:outline-none lg:px-3 lg:py-2 ${
                location.pathname === '/profiel'
                  ? 'border-fuchsia-200 bg-fuchsia-50 text-[var(--helix-purple)]'
                  : 'border-transparent text-[var(--helix-navy)] hover:border-[var(--helix-border)] hover:bg-white'
              }`}
              title="Mijn profiel"
            >
              <User size={22} />
              <span className="hidden flex-col items-end lg:flex">
                <span className="text-sm font-bold">{currentUser?.displayName || 'Gebruiker'}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--helix-purple)]">Leerling</span>
              </span>
            </button>
          ) : (
            <div className="mr-2 hidden flex-col items-end lg:flex">
              <span className="text-sm font-bold text-[var(--helix-navy)]">{currentUser?.displayName || 'Gebruiker'}</span>
              <span className="rounded-full bg-[var(--helix-soft-peach)] px-2 text-[10px] font-black uppercase tracking-widest text-orange-700">
                Administrator
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="rounded-2xl border border-transparent p-2.5 text-[var(--helix-muted)] transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-500"
            title="Uitloggen"
          >
            <LogOut size={22} />
          </button>
        </div>
      </header>

      <main className="relative flex flex-1 flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
    </StudentBugReportContext.Provider>
  );
}
