import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import NameSetupModal from '../auth/NameSetupModal';
import { LogOut, User, LayoutDashboard, BookOpen, SettingsIcon } from 'lucide-react';

export default function AppShell() {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect admin to /admin if they're viewing student home
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Name Setup Modal for users without displayName */}
      <NameSetupModal />

      {/* Header - Premium Glassmorphism */}
      <header className="sticky top-0 z-[100] h-20 bg-white/70 backdrop-blur-2xl border-b border-slate-200/60 px-6 md:px-12 flex items-center justify-between shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-8">
          <h1
            onClick={() => navigate('/')}
            className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity group"
          >
            <span className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 transform -rotate-6 group-hover:rotate-0 transition-transform">📐</span>
            <span className="tracking-tight hidden sm:inline">Digitaal Leerplatform</span>
          </h1>
          
          <nav className="flex gap-2 p-1 bg-slate-100/50 rounded-2xl border border-slate-200/50">
            <button 
              onClick={() => navigate('/')}
              className={`px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                window.location.pathname === '/' || window.location.pathname.includes('/chapter/') 
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <BookOpen size={18} /> <span className="hidden md:inline">Lesmateriaal</span>
            </button>
            
            {isAdmin && (
              <>
                <button
                  onClick={() => navigate('/admin')}
                  className={`px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                    window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')
                      ? 'bg-purple-100 text-purple-700 shadow-sm border border-purple-200'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <SettingsIcon size={18} /> <span className="hidden md:inline">Admin Hub</span>
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                    window.location.pathname === '/dashboard'
                      ? 'bg-amber-100 text-amber-700 shadow-sm border border-amber-200'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <LayoutDashboard size={18} /> <span className="hidden md:inline">Klas Dashboard</span>
                </button>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {!isAdmin ? (
            <button
              onClick={() => navigate('/profiel')}
              className={`flex items-center gap-3 rounded-xl border p-2.5 text-left transition-all focus:outline-none focus:ring-4 focus:ring-blue-200 lg:px-3 lg:py-2 ${
                location.pathname === '/profiel'
                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                  : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-white'
              }`}
              title="Mijn profiel"
            >
              <User size={22} />
              <span className="hidden flex-col items-end lg:flex">
                <span className="text-sm font-bold">{currentUser?.displayName || 'Gebruiker'}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Leerling</span>
              </span>
            </button>
          ) : (
            <div className="hidden lg:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-slate-800">{currentUser?.displayName || 'Gebruiker'}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 rounded-md">Administrator</span>
            </div>
          )}
          
          <button 
            onClick={handleLogout}
            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
            title="Uitloggen"
          >
            <LogOut size={22} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
