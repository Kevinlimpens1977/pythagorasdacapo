import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import NameSetupModal from '../auth/NameSetupModal';
import CmsResetButton from '../admin/CmsResetButton';
import DeleteStudentsButton from '../admin/DeleteStudentsButton';
import HelpPaneel from '../admin/HelpPaneel';
import TestleerlingBalk from '../admin/TestleerlingBalk';
import Meldbel from '../common/Meldbel';
import { StudentBugReportContext } from '../studentBugReports/StudentBugReportContext';
import TokenBalancePill from '../tokens/TokenBalancePill';
import NiveauPill from '../tokens/NiveauPill';
import WeekdoelPill from '../tokens/WeekdoelPill';
import { BarChart3, BellRing, BookOpen, Gamepad2, LogOut, Presentation, SettingsIcon, User, Users } from 'lucide-react';
import { ADMIN_WORKSPACES, isAdminWorkspaceActive } from '../../lib/adminWorkspaceNav';
import { isStudyRoutePath } from '../../lib/studyRouteState';
import { neemTestsessieDoel } from '../../lib/leeromgeving';
import { subscribeToNieuweMeldingenAantal } from '../../services/meldingenService';
import { subscribeActiveTokenShopItems, subscribeStudentTokenLoadout } from '../../services/tokenService';
import { getActiveRewardItems, normalizeLoadout } from '../../lib/tokenShopRewards';
import ProfielAvatar from '../avatar/ProfielAvatar';
import KlasDoelPill from '../klas/KlasDoelPill';
import EventPill from '../klas/EventPill';
import HelixLogo from '../merk/HelixLogo';

const workspaceIcons = {
  lesstof: BookOpen,
  voortgang: BarChart3,
  leerlingen: Users,
  spellen: Gamepad2,
  presenter: Presentation,
  instellingen: SettingsIcon
};

export default function AppShell() {
  const { currentUser, userData, isAdmin, isDevBypass, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [studentBugReportContext, setStudentBugReportContext] = useState({});
  const [openBugReportCount, setOpenBugReportCount] = useState(0);
  const [studentLoadout, setStudentLoadout] = useState({ activePinIds: [] });
  const [rewardItems, setRewardItems] = useState([]);
  const canShowStudentRewards = !isAdmin && !isDevBypass && Boolean(currentUser?.uid);
  // Tijdens het studeren is de app-chrome weg: geen logo, geen navigatie, geen
  // tokenpil, geen profiel of uitloggen. De studeerroute bouwt zijn eigen balk.
  const isStudyRoute = isStudyRoutePath(location.pathname);

  useEffect(() => {
    if (isAdmin && location.pathname === '/') {
      navigate('/admin/instellingen', { replace: true });
    }
  }, [isAdmin, location.pathname, navigate]);

  // Een testsessie vanaf /admin/testen kan op een hoofdstuk of paragraaf
  // beginnen; die plek is bewaard tot precies deze testleerling binnen is.
  useEffect(() => {
    if (isAdmin || !currentUser?.uid) return;
    const doel = neemTestsessieDoel(window.sessionStorage, currentUser.uid);
    if (doel && doel !== location.pathname) navigate(doel, { replace: true });
  }, [isAdmin, currentUser?.uid, location.pathname, navigate]);

  useEffect(() => {
    if (!isAdmin) {
      return undefined;
    }

    // Live meetellen wat het beheer nog niet bekeken heeft: dat is het rode
    // bolletje op Instellingen, hetzelfde signaal als de bel bij de melder.
    return subscribeToNieuweMeldingenAantal(setOpenBugReportCount, () => setOpenBugReportCount(0));
  }, [isAdmin]);

  useEffect(() => {
    if (!canShowStudentRewards) {
      return undefined;
    }

    const unsubscribers = [
      subscribeStudentTokenLoadout(
        currentUser.uid,
        setStudentLoadout,
        (error) => console.warn('Actieve shopitems konden niet worden geladen:', error)
      ),
      subscribeActiveTokenShopItems(
        setRewardItems,
        (error) => console.warn('Shopitem-catalogus kon niet worden geladen voor de header:', error)
      )
    ];

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe?.());
  }, [canShowStudentRewards, currentUser?.uid]);

  const normalizedLoadout = normalizeLoadout(studentLoadout);
  const activeRewards = canShowStudentRewards
    ? getActiveRewardItems({ loadout: normalizedLoadout, items: rewardItems })
    : [];
  const activeFrame = activeRewards.find((item) => item.itemType === 'avatarFrame');
  const activeAvatar = activeRewards.find((item) => item.itemType === 'avatarSkin');
  const activeTitle = activeRewards.find((item) => item.itemType === 'titleBadge');
  const activePins = activeRewards.filter((item) => item.itemType === 'shopBadge').slice(0, 3);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate(isAdmin ? '/admin/lesstof' : '/');
  };

  return (
    <StudentBugReportContext.Provider value={{ context: studentBugReportContext, setContext: setStudentBugReportContext }}>
    <div className="helix-page flex min-h-screen flex-col font-sans selection:bg-fuchsia-100 selection:text-[var(--helix-navy)]">
      <NameSetupModal />
      <TestleerlingBalk />

      {!isStudyRoute && (
      <header className="sticky top-0 z-[100] flex min-h-20 items-center justify-between border-b border-[var(--lo-lijn)] bg-[var(--lo-kaart)] px-4 md:px-10">
        <div className="flex min-w-0 items-center gap-4 md:gap-8">
          <h1
            onClick={handleLogoClick}
            className="helix-brand group flex shrink-0 cursor-pointer items-center transition-opacity hover:opacity-90"
            aria-label={isAdmin ? 'Ga naar Lesstof' : 'Ga naar HELIX start'}
          >
            {/* Op een telefoon alleen het H-blok, daarboven het hele woordmerk. */}
            <HelixLogo variant="blok" titel="" className="h-10 sm:hidden" />
            <HelixLogo titel="" className="hidden h-9 sm:block md:h-10" />
          </h1>

          <nav
            className={
              isAdmin
                ? 'nav-scroll-onzichtbaar flex max-w-[54vw] gap-1 overflow-x-auto rounded-2xl border border-[var(--helix-border)] bg-[var(--helix-surface-soft)]/82 p-1 md:max-w-none md:gap-2'
                : 'lo-keuzes flex-nowrap'
            }
          >
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
                    {workspace.id === 'instellingen' && openBugReportCount > 0 && (
                      <span
                        className="admin-nav-alert"
                        aria-label={`${openBugReportCount} open leerlingmelding${openBugReportCount === 1 ? '' : 'en'}`}
                        title={`${openBugReportCount} open leerlingmelding${openBugReportCount === 1 ? '' : 'en'}`}
                      >
                        <BellRing size={13} />
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <button
                onClick={() => navigate('/')}
                className="lo-keuze min-h-10 shrink-0"
                aria-current={
                  location.pathname === '/' ||
                  location.pathname.includes('/chapter/') ||
                  location.pathname.startsWith('/hoofdstuk/')
                    ? 'page'
                    : undefined
                }
              >
                <BookOpen size={18} />
                <span className="hidden md:inline">Lesmateriaal</span>
                <span className="sr-only md:hidden">Lesmateriaal</span>
              </button>
            )}
          </nav>
        </div>

        {/* De knop Projectkompas is er op 22 september 2026 uitgehaald: dat
            document is er voor wie aan HELIX bouwt, niet voor de balk boven een
            les. De pagina blijft bestaan op /admin/projectkompas. */}

        <div className="flex items-center gap-3 md:gap-4">
          {isAdmin && <HelpPaneel />}
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

          {/* Ook voor beheerders (1 okt 2026): zij kunnen KlimBit spelen,
              maar verdienen er nooit tokens mee. */}
          <button
            onClick={() => navigate('/spellen')}
            className={`lo-knop-tweede shrink-0 px-3 py-2 ${
              location.pathname === '/spellen' ? 'border-[var(--lo-blauw)]' : ''
            }`}
            aria-current={location.pathname === '/spellen' ? 'page' : undefined}
            title="Spellen"
          >
            <Gamepad2 size={18} />
            {/* Alleen een gamepad zonder woord liet leerlingen raden waar de
                knop heen ging. Op een smal scherm blijft het icoon alleen. */}
            <span className="hidden sm:inline">Spellen</span>
            <span className="sr-only sm:hidden">Spellen</span>
          </button>

          {!isAdmin && (
            <button
              onClick={() => navigate('/klas')}
              className={`lo-knop-tweede shrink-0 px-3 py-2 ${
                location.pathname === '/klas' ? 'border-[var(--lo-blauw)]' : ''
              }`}
              aria-current={location.pathname === '/klas' ? 'page' : undefined}
              title="Mijn klas"
            >
              <Users size={18} />
              <span className="hidden sm:inline">Mijn klas</span>
              <span className="sr-only sm:hidden">Mijn klas</span>
            </button>
          )}

          {!isAdmin && <EventPill klasId={userData?.klasId} disabled={isDevBypass} />}
          {!isAdmin && <KlasDoelPill klasId={userData?.klasId} disabled={isDevBypass} onOpen={() => navigate('/klas')} />}
          {!isAdmin && <WeekdoelPill studentUid={currentUser?.uid} disabled={isDevBypass} />}
          {!isAdmin && <NiveauPill studentUid={currentUser?.uid} disabled={isDevBypass} />}

          {!isAdmin && (
            <TokenBalancePill
              studentUid={currentUser?.uid}
              disabled={isDevBypass}
              onOpenShop={() => navigate('/tokenshop')}
            />
          )}

          {!isAdmin ? (
            <button
              onClick={() => navigate('/profiel')}
              className={`lo-knop-tweede gap-3 p-2 text-left lg:px-3 lg:py-2 ${
                location.pathname === '/profiel' ? 'border-[var(--lo-blauw)]' : ''
              }`}
              aria-current={location.pathname === '/profiel' ? 'page' : undefined}
              title="Mijn profiel"
            >
              <span
                className="token-header-avatar flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 bg-white"
                style={{
                  '--token-avatar-accent': activeAvatar?.previewStyle?.accent || 'var(--helix-purple)',
                  borderColor: activeFrame?.previewStyle?.accent || activeAvatar?.previewStyle?.accent || 'transparent'
                }}
              >
                <ProfielAvatar loadout={normalizedLoadout} plaatje={activeAvatar} leeg={<User size={20} />} />
              </span>
              <span className="hidden flex-col items-end lg:flex">
                <span className="text-[15px] font-bold leading-snug text-[var(--lo-inkt)]">{currentUser?.displayName || 'Gebruiker'}</span>
                <span className="lo-onderregel">{activeTitle?.title || 'Leerling'}</span>
                {activePins.length > 0 && (
                  <span className="mt-1 flex max-w-48 justify-end gap-1 overflow-hidden">
                    {activePins.map((pin) => (
                      <span
                        key={pin.id}
                        className="rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-white"
                        style={{ background: pin.previewStyle?.accent || 'var(--helix-purple)' }}
                      >
                        {pin.previewStyle?.shortLabel || pin.title}
                      </span>
                    ))}
                  </span>
                )}
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
            className="lo-knop-tweede px-3 py-2"
            title="Uitloggen"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>
      )}

      {/* overflow-x-clip in plaats van overflow-hidden: clip maakt geen scrollcontainer,
          dus blijft `position: sticky` binnen een pagina (zoals de ankernavigatie op de
          lesstofpagina) meescrollen met het venster. */}
      <main className="relative flex flex-1 flex-col overflow-x-clip">
        <Outlet />
      </main>

      {/* De meldbel zweeft rechtsonder over elke pagina, ook tijdens het
          studeren: hij hoort niet bij de app-chrome maar bij het vangnet. */}
      <Meldbel user={currentUser} rol={isAdmin ? 'beheer' : 'leerling'} />
    </div>
    </StudentBugReportContext.Provider>
  );
}
