import { useMemo, useState } from 'react';
import {
  addPresenterPage,
  addStrokeToPresenterPage,
  createPresenterSession,
  deletePresenterPage,
  duplicatePresenterPage,
  getActivePresenterPage,
  setActivePresenterPage,
  updatePresenterPageBackground
} from '../../lib/presenterModel';
import PresenterBoard from './PresenterBoard';
import PresenterPagePanel from './PresenterPagePanel';
import PresenterToolbar from './PresenterToolbar';

export default function PresenterShell() {
  const [session, setSession] = useState(() => createPresenterSession());
  const [toolbarPinned, setToolbarPinned] = useState(() => Boolean(session.toolbar?.pinned));
  const [activeCategory, setActiveCategory] = useState(() => session.toolbar?.activeCategory || 'pen');
  const [pagePanelOpen, setPagePanelOpen] = useState(false);

  const activePage = getActivePresenterPage(session);
  const pages = useMemo(() => session.pages || [], [session.pages]);
  const activeIndex = useMemo(
    () => Math.max(0, pages.findIndex((page) => page.id === activePage?.id)),
    [activePage?.id, pages]
  );
  const pageLabel = pages.length > 0 ? `Pagina ${activeIndex + 1}/${pages.length}` : 'Pagina 0/0';
  const currentTool = activeCategory === 'pen'
    ? { id: 'pen', variant: 'pen', color: '#111827', width: 5 }
    : { id: 'select' };

  const activatePageAt = (index) => {
    const page = pages[index];
    if (!page) return;

    setSession((currentSession) => setActivePresenterPage(currentSession, page.id));
  };

  const selectPage = (pageId) => {
    setSession((currentSession) => setActivePresenterPage(currentSession, pageId));
  };

  const addPage = () => {
    setSession((currentSession) => addPresenterPage(currentSession));
  };

  const duplicatePage = () => {
    setSession((currentSession) => duplicatePresenterPage(currentSession, currentSession.activePageId));
  };

  const deletePage = () => {
    const canConfirm = typeof window !== 'undefined' && typeof window.confirm === 'function';
    if (canConfirm && !window.confirm('Deze pagina verwijderen?')) return;

    setSession((currentSession) => deletePresenterPage(currentSession, currentSession.activePageId));
  };

  const handleCategory = (category) => {
    setActiveCategory(category);
    setPagePanelOpen(category === 'pages');
  };

  const handleSelectTool = () => {
    setActiveCategory('select');
    setPagePanelOpen(false);
  };

  const handleFullscreen = () => {
    if (typeof document === 'undefined') return;

    const element = document.documentElement;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
      return;
    }

    element.requestFullscreen?.();
  };

  const handleStrokeComplete = (stroke) => {
    setSession((currentSession) =>
      addStrokeToPresenterPage(currentSession, currentSession.activePageId, stroke)
    );
  };

  const handleBackground = (background) => {
    setSession((currentSession) =>
      updatePresenterPageBackground(currentSession, currentSession.activePageId, background)
    );
  };

  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] flex-col overflow-hidden bg-slate-200">
      <header className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 px-4 py-3 text-slate-50 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Presenter</p>
          <h1 className="text-lg font-black leading-tight">Digibord Core</h1>
        </div>
        <span className="rounded-md border border-slate-700 px-3 py-2 text-sm font-black text-slate-200">
          {pageLabel}
        </span>
      </header>

      <PresenterBoard page={activePage} tool={currentTool} onStrokeComplete={handleStrokeComplete} />
      <PresenterPagePanel
        pages={pages}
        activePageId={session.activePageId}
        open={pagePanelOpen}
        onSelectPage={selectPage}
        onAddPage={addPage}
        onDuplicatePage={duplicatePage}
        onDeletePage={deletePage}
      />
      <PresenterToolbar
        pageLabel={pageLabel}
        activeCategory={activeCategory}
        pinned={toolbarPinned}
        background={activePage?.background}
        onTogglePinned={() => setToolbarPinned((current) => !current)}
        onCategory={handleCategory}
        onBackground={handleBackground}
        onPrev={() => activatePageAt(activeIndex - 1)}
        onNext={() => activatePageAt(activeIndex + 1)}
        prevDisabled={activeIndex <= 0}
        nextDisabled={activeIndex >= pages.length - 1}
        canUndo={false}
        canRedo={false}
        onSelect={handleSelectTool}
        onFullscreen={handleFullscreen}
      />
    </section>
  );
}
