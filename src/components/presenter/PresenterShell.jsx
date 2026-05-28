import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createPresenterHistory,
  recordPresenterPageState,
  redoPresenterPage,
  undoPresenterPage
} from '../../lib/presenterHistory';
import {
  addObjectToPresenterPage,
  addPresenterPage,
  addStrokeToPresenterPage,
  createPresenterSession,
  deleteObjectFromPresenterPage,
  deletePresenterPage,
  duplicatePresenterPage,
  getActivePresenterPage,
  setActivePresenterPage,
  updatePresenterPageBackground
} from '../../lib/presenterModel';
import { createPresenterObject } from '../../lib/presenterObjects';
import {
  clearPresenterRecoveryState,
  hasRecoverablePresenterState,
  loadPresenterRecoveryState,
  savePresenterRecoveryState
} from '../../lib/presenterStorage';
import PresenterBoard from './PresenterBoard';
import PresenterInstrumentOverlay from './PresenterInstrumentOverlay';
import PresenterPagePanel from './PresenterPagePanel';
import PresenterRecoveryPrompt from './PresenterRecoveryPrompt';
import PresenterToolbar from './PresenterToolbar';

const MAX_SESSION_HISTORY_ITEMS = 80;

const createObjectId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `object-${crypto.randomUUID()}`;
  }

  return `object-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

const getBrowserSessionStorage = () => {
  if (typeof window === 'undefined') return null;

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

const isEditableShortcutTarget = (target) => {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName.toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || target.isContentEditable;
};

const replacePresenterPage = (session, pageId, page) => ({
  ...session,
  pages: session.pages.map((currentPage) => (currentPage.id === pageId ? page : currentPage)),
  dirty: true
});

const clonePresenterSession = (session) => structuredClone(session);

const createSessionHistory = () => ({
  undo: [],
  redo: []
});

const normalizeHistory = (history) => ({
  ...history,
  session: history.session || createSessionHistory()
});

const recordPresenterSessionState = (history, session) => {
  const normalizedHistory = normalizeHistory(history);

  return {
    ...normalizedHistory,
    session: {
      undo: [...normalizedHistory.session.undo, clonePresenterSession(session)].slice(-MAX_SESSION_HISTORY_ITEMS),
      redo: []
    }
  };
};

const undoPresenterSession = (history, currentSession) => {
  const normalizedHistory = normalizeHistory(history);
  if (normalizedHistory.session.undo.length === 0) {
    return { session: currentSession, history };
  }

  const previous = normalizedHistory.session.undo[normalizedHistory.session.undo.length - 1];
  const undo = normalizedHistory.session.undo.slice(0, -1);
  const redo = [...normalizedHistory.session.redo, clonePresenterSession(currentSession)].slice(
    -MAX_SESSION_HISTORY_ITEMS
  );

  return {
    session: previous,
    history: {
      ...normalizedHistory,
      session: { undo, redo }
    }
  };
};

const redoPresenterSession = (history, currentSession) => {
  const normalizedHistory = normalizeHistory(history);
  if (normalizedHistory.session.redo.length === 0) {
    return { session: currentSession, history };
  }

  const next = normalizedHistory.session.redo[normalizedHistory.session.redo.length - 1];
  const redo = normalizedHistory.session.redo.slice(0, -1);
  const undo = [...normalizedHistory.session.undo, clonePresenterSession(currentSession)].slice(
    -MAX_SESSION_HISTORY_ITEMS
  );

  return {
    session: next,
    history: {
      ...normalizedHistory,
      session: { undo, redo }
    }
  };
};

const getInitialRecoveredSession = () => {
  const restored = loadPresenterRecoveryState(getBrowserSessionStorage());
  return hasRecoverablePresenterState(restored) ? restored : null;
};

export default function PresenterShell() {
  const [session, setSession] = useState(() => createPresenterSession());
  const [history, setHistory] = useState(() => createPresenterHistory());
  const [toolbarPinned, setToolbarPinned] = useState(() => Boolean(session.toolbar?.pinned));
  const [activeCategory, setActiveCategory] = useState(() => session.toolbar?.activeCategory || 'pen');
  const [pagePanelOpen, setPagePanelOpen] = useState(false);
  const [instrument, setInstrument] = useState(null);
  const [recoveredSession, setRecoveredSession] = useState(getInitialRecoveredSession);
  const [fullscreenErrorVisible, setFullscreenErrorVisible] = useState(false);
  const fullscreenErrorTimerRef = useRef(null);

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
  const activePageHistory = history.byPageId[activePage?.id] || { undo: [], redo: [] };
  const sessionHistory = history.session || createSessionHistory();
  const canUndoPage = activePageHistory.undo.length > 0;
  const canRedoPage = activePageHistory.redo.length > 0;
  const canUndoSession = sessionHistory.undo.length > 0;
  const canRedoSession = sessionHistory.redo.length > 0;
  const canUndo = canUndoPage || canUndoSession;
  const canRedo = canRedoPage || canRedoSession;

  const updateActivePageWithHistory = useCallback((updater) => {
    setSession((currentSession) => {
      const page = getActivePresenterPage(currentSession);
      if (!page) return currentSession;

      const nextSession = updater(currentSession, page);
      if (nextSession === currentSession) return currentSession;

      setHistory((currentHistory) => recordPresenterPageState(currentHistory, page.id, page));
      return nextSession;
    });
  }, []);

  const activatePageAt = useCallback((index) => {
    const page = pages[index];
    if (!page) return;

    setSession((currentSession) => setActivePresenterPage(currentSession, page.id));
  }, [pages]);

  const selectPage = (pageId) => {
    setSession((currentSession) => setActivePresenterPage(currentSession, pageId));
  };

  const addPage = () => {
    setSession((currentSession) => {
      const nextSession = addPresenterPage(currentSession);
      if (nextSession === currentSession) return currentSession;

      setHistory((currentHistory) => recordPresenterSessionState(currentHistory, currentSession));
      return nextSession;
    });
  };

  const duplicatePage = () => {
    setSession((currentSession) => {
      const nextSession = duplicatePresenterPage(currentSession, currentSession.activePageId);
      if (nextSession === currentSession) return currentSession;

      setHistory((currentHistory) => recordPresenterSessionState(currentHistory, currentSession));
      return nextSession;
    });
  };

  const deletePage = () => {
    const canConfirm = typeof window !== 'undefined' && typeof window.confirm === 'function';
    if (canConfirm && !window.confirm('Deze pagina verwijderen?')) return;

    setSession((currentSession) => {
      const nextSession = deletePresenterPage(currentSession, currentSession.activePageId);
      if (nextSession === currentSession) return currentSession;

      setHistory((currentHistory) => recordPresenterSessionState(currentHistory, currentSession));
      return nextSession;
    });
  };

  const handleCategory = (category) => {
    setActiveCategory(category);
    setPagePanelOpen(category === 'pages');
  };

  const handleSelectTool = () => {
    setActiveCategory('select');
    setPagePanelOpen(false);
  };

  const handleInstrument = (instrumentId) => {
    setInstrument(instrumentId);
    setActiveCategory('select');
    setPagePanelOpen(false);
  };

  const showFullscreenError = useCallback(() => {
    setFullscreenErrorVisible(true);

    if (fullscreenErrorTimerRef.current) {
      window.clearTimeout(fullscreenErrorTimerRef.current);
    }

    fullscreenErrorTimerRef.current = window.setTimeout(() => {
      setFullscreenErrorVisible(false);
      fullscreenErrorTimerRef.current = null;
    }, 4200);
  }, []);

  const handleFullscreen = useCallback(async () => {
    if (typeof document === 'undefined') return;

    const element = document.documentElement;
    if (document.fullscreenElement) {
      await document.exitFullscreen?.();
      return;
    }

    try {
      if (typeof element.requestFullscreen !== 'function') {
        showFullscreenError();
        return;
      }

      await element.requestFullscreen?.();
    } catch {
      showFullscreenError();
    }
  }, [showFullscreenError]);

  const handleUndo = useCallback(() => {
    setSession((currentSession) => {
      const page = getActivePresenterPage(currentSession);
      if (!page) {
        const result = undoPresenterSession(history, currentSession);
        if (result.session === currentSession && result.history === history) return currentSession;

        setHistory(result.history);
        return result.session;
      }

      if (canUndoPage) {
        const result = undoPresenterPage(history, page.id, page);
        if (result.page === page && result.history === history) return currentSession;

        setHistory(result.history);
        return replacePresenterPage(currentSession, page.id, result.page);
      }

      const result = undoPresenterSession(history, currentSession);
      if (result.session === currentSession && result.history === history) return currentSession;

      setHistory(result.history);
      return result.session;
    });
  }, [canUndoPage, history]);

  const handleRedo = useCallback(() => {
    setSession((currentSession) => {
      const page = getActivePresenterPage(currentSession);
      if (!page) {
        const result = redoPresenterSession(history, currentSession);
        if (result.session === currentSession && result.history === history) return currentSession;

        setHistory(result.history);
        return result.session;
      }

      if (canRedoPage) {
        const result = redoPresenterPage(history, page.id, page);
        if (result.page === page && result.history === history) return currentSession;

        setHistory(result.history);
        return replacePresenterPage(currentSession, page.id, result.page);
      }

      const result = redoPresenterSession(history, currentSession);
      if (result.session === currentSession && result.history === history) return currentSession;

      setHistory(result.history);
      return result.session;
    });
  }, [canRedoPage, history]);

  const handleStrokeComplete = (stroke) => {
    updateActivePageWithHistory((currentSession) =>
      addStrokeToPresenterPage(currentSession, currentSession.activePageId, stroke)
    );
  };

  const handleBackground = (background) => {
    updateActivePageWithHistory((currentSession) =>
      updatePresenterPageBackground(currentSession, currentSession.activePageId, background)
    );
  };

  const handleCreateObject = (type) => {
    const object = createPresenterObject(type, {
      id: createObjectId(),
      x: 220,
      y: 180
    });

    updateActivePageWithHistory((currentSession) =>
      addObjectToPresenterPage(currentSession, currentSession.activePageId, object)
    );
  };

  const handleSelectObject = (objectId) => {
    setSession((currentSession) => ({
      ...currentSession,
      selectedObjectId: objectId
    }));
  };

  const handleDeleteObject = useCallback((objectId) => {
    updateActivePageWithHistory((currentSession) =>
      deleteObjectFromPresenterPage(currentSession, currentSession.activePageId, objectId)
    );
  }, [updateActivePageWithHistory]);

  const handleDiscardRecovery = () => {
    clearPresenterRecoveryState(getBrowserSessionStorage());
    setRecoveredSession(null);
    setSession(createPresenterSession());
    setHistory(createPresenterHistory());
    setActiveCategory('pen');
    setPagePanelOpen(false);
    setInstrument(null);
  };

  const handleRestoreRecovery = () => {
    if (!recoveredSession) return;

    setSession(recoveredSession);
    setHistory(createPresenterHistory());
    setToolbarPinned(Boolean(recoveredSession.toolbar?.pinned));
    setActiveCategory(recoveredSession.toolbar?.activeCategory || 'pen');
    setPagePanelOpen(false);
    setInstrument(null);
    setRecoveredSession(null);
  };

  useEffect(() => {
    if (recoveredSession) return;

    savePresenterRecoveryState(getBrowserSessionStorage(), session);
  }, [recoveredSession, session]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleBeforeUnload = (event) => {
      if (!hasRecoverablePresenterState(session)) return;

      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [session]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleKeyDown = (event) => {
      if (recoveredSession || isEditableShortcutTarget(event.target)) return;

      const isUndo = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && !event.shiftKey;
      const isRedo =
        (event.ctrlKey || event.metaKey) &&
        (event.key.toLowerCase() === 'y' || (event.shiftKey && event.key.toLowerCase() === 'z'));

      if (isUndo) {
        if (canUndo) {
          event.preventDefault();
          handleUndo();
        }
        return;
      }

      if (isRedo) {
        if (canRedo) {
          event.preventDefault();
          handleRedo();
        }
        return;
      }

      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (session.selectedObjectId) {
          event.preventDefault();
          handleDeleteObject(session.selectedObjectId);
        }
        return;
      }

      if (event.key === 'ArrowLeft') {
        if (activeIndex > 0) {
          event.preventDefault();
          activatePageAt(activeIndex - 1);
        }
        return;
      }

      if (event.key === 'ArrowRight') {
        if (activeIndex < pages.length - 1) {
          event.preventDefault();
          activatePageAt(activeIndex + 1);
        }
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
          return;
        }

        setActiveCategory('select');
        setPagePanelOpen(false);
        setInstrument(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeIndex,
    activatePageAt,
    canRedo,
    canUndo,
    handleDeleteObject,
    handleRedo,
    handleUndo,
    pages.length,
    recoveredSession,
    session.selectedObjectId
  ]);

  useEffect(() => () => {
    if (fullscreenErrorTimerRef.current) {
      window.clearTimeout(fullscreenErrorTimerRef.current);
    }
  }, []);

  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] flex-col overflow-hidden bg-slate-200">
      {fullscreenErrorVisible ? (
        <div
          className="fixed right-4 top-4 z-50 max-w-sm rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-950 shadow-lg"
          role="status"
        >
          Fullscreen kon niet worden gestart. Presenter blijft gewoon bruikbaar.
        </div>
      ) : null}
      {recoveredSession ? (
        <PresenterRecoveryPrompt onRestore={handleRestoreRecovery} onDiscard={handleDiscardRecovery} />
      ) : null}
      <header className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 px-4 py-3 text-slate-50 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Presenter</p>
          <h1 className="text-lg font-black leading-tight">Digibord Core</h1>
        </div>
        <span className="rounded-md border border-slate-700 px-3 py-2 text-sm font-black text-slate-200">
          {pageLabel}
        </span>
      </header>

      <PresenterBoard
        page={activePage}
        tool={currentTool}
        selectedObjectId={session.selectedObjectId}
        onStrokeComplete={handleStrokeComplete}
        onSelectObject={handleSelectObject}
        onDeleteObject={handleDeleteObject}
      />
      <PresenterPagePanel
        pages={pages}
        activePageId={session.activePageId}
        open={pagePanelOpen}
        onSelectPage={selectPage}
        onAddPage={addPage}
        onDuplicatePage={duplicatePage}
        onDeletePage={deletePage}
      />
      <PresenterInstrumentOverlay instrument={instrument} onClose={() => setInstrument(null)} />
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
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSelect={handleSelectTool}
        onCreateObject={handleCreateObject}
        onInstrument={handleInstrument}
        onFullscreen={handleFullscreen}
      />
    </section>
  );
}
