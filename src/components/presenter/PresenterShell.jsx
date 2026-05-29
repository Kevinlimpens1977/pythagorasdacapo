import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, FilePlus2 } from 'lucide-react';
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
  clearPresenterPageContent,
  createPresenterSession,
  deleteObjectsFromPresenterPage,
  deleteObjectFromPresenterPage,
  deletePresenterPage,
  duplicatePresenterPage,
  getActivePresenterPage,
  getPresenterPageIndex,
  movePresenterObjectsOnPage,
  resizePresenterObjectsOnPage,
  setActivePresenterPageAt,
  updatePresenterTool,
  updatePresenterPageBackground
} from '../../lib/presenterModel';
import { createPresenterObject } from '../../lib/presenterObjects';
import {
  clearPresenterRecoveryState,
  hasRecoverablePresenterState,
  loadPresenterRecoveryState,
  savePresenterRecoveryState
} from '../../lib/presenterStorage';
import {
  appendHelixContentImportToPresenterSession,
  getPublishedPresenterContentBlocks
} from '../../lib/presenterContentImport';
import PresenterBoard from './PresenterBoard';
import PresenterImportDialog from './PresenterImportDialog';
import PresenterInstrumentOverlay from './PresenterInstrumentOverlay';
import PresenterPagePanel from './PresenterPagePanel';
import PresenterRecoveryPrompt from './PresenterRecoveryPrompt';
import PresenterToolbar from './PresenterToolbar';

const MAX_SESSION_HISTORY_ITEMS = 80;
const DEFAULT_TEXT_TOOL_STYLE = {
  bold: false,
  italic: false,
  color: '#111827',
  fontSize: 48,
  fontFamily: 'helix',
  align: 'left'
};

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

const createHistoryOrder = () => ({
  undo: [],
  redo: []
});

const normalizeHistory = (history) => ({
  ...history,
  session: history.session || createSessionHistory(),
  order: history.order || createHistoryOrder()
});

const findSessionPage = (session, pageId) =>
  session.pages.find((page) => page.id === pageId) || null;

const canUndoEntry = (history, session, entry) => {
  if (!entry) return false;
  if (entry.kind === 'session') return normalizeHistory(history).session.undo.length > 0;
  if (entry.kind !== 'page') return false;

  const pageHistory = history.byPageId[entry.pageId];
  return Boolean(pageHistory?.undo.length > 0 && findSessionPage(session, entry.pageId));
};

const canRedoEntry = (history, session, entry) => {
  if (!entry) return false;
  if (entry.kind === 'session') return normalizeHistory(history).session.redo.length > 0;
  if (entry.kind !== 'page') return false;

  const pageHistory = history.byPageId[entry.pageId];
  return Boolean(pageHistory?.redo.length > 0 && findSessionPage(session, entry.pageId));
};

const getFallbackUndoEntry = (history, session) => {
  const normalizedHistory = normalizeHistory(history);
  const orderedEntry = normalizedHistory.order.undo[normalizedHistory.order.undo.length - 1];
  if (orderedEntry) return orderedEntry;

  if (normalizedHistory.session.undo.length > 0) return { kind: 'session' };

  const pageEntry = Object.entries(normalizedHistory.byPageId).find(([pageId, pageHistory]) =>
    pageHistory.undo.length > 0 && findSessionPage(session, pageId)
  );

  return pageEntry ? { kind: 'page', pageId: pageEntry[0] } : null;
};

const getFallbackRedoEntry = (history, session) => {
  const normalizedHistory = normalizeHistory(history);
  const orderedEntry = normalizedHistory.order.redo[normalizedHistory.order.redo.length - 1];
  if (orderedEntry) return orderedEntry;

  if (normalizedHistory.session.redo.length > 0) return { kind: 'session' };

  const pageEntry = Object.entries(normalizedHistory.byPageId).find(([pageId, pageHistory]) =>
    pageHistory.redo.length > 0 && findSessionPage(session, pageId)
  );

  return pageEntry ? { kind: 'page', pageId: pageEntry[0] } : null;
};

const clearPresenterRedoBranches = (history) => {
  const normalizedHistory = normalizeHistory(history);
  const byPageId = Object.fromEntries(
    Object.entries(normalizedHistory.byPageId).map(([pageId, pageHistory]) => [
      pageId,
      {
        ...pageHistory,
        redo: []
      }
    ])
  );

  return {
    ...normalizedHistory,
    byPageId,
    session: {
      ...normalizedHistory.session,
      redo: []
    },
    order: {
      ...normalizedHistory.order,
      redo: []
    }
  };
};

const hasAvailableUndo = (history, session) => {
  const normalizedHistory = normalizeHistory(history);

  return Boolean(
    [...normalizedHistory.order.undo].reverse().some((entry) => canUndoEntry(normalizedHistory, session, entry)) ||
      normalizedHistory.session.undo.length > 0 ||
      Object.entries(normalizedHistory.byPageId).some(([pageId, pageHistory]) =>
        pageHistory.undo.length > 0 && findSessionPage(session, pageId)
      )
  );
};

const hasAvailableRedo = (history, session) => {
  const normalizedHistory = normalizeHistory(history);

  return Boolean(
    [...normalizedHistory.order.redo].reverse().some((entry) => canRedoEntry(normalizedHistory, session, entry)) ||
      normalizedHistory.session.redo.length > 0 ||
      Object.entries(normalizedHistory.byPageId).some(([pageId, pageHistory]) =>
        pageHistory.redo.length > 0 && findSessionPage(session, pageId)
      )
  );
};

const recordPresenterPageAction = (history, pageId, page) => {
  const normalizedHistory = normalizeHistory(history);
  const nextHistory = recordPresenterPageState(normalizedHistory, pageId, page);
  const historyWithoutRedo = clearPresenterRedoBranches(nextHistory);

  return {
    ...historyWithoutRedo,
    order: {
      undo: [...normalizedHistory.order.undo, { kind: 'page', pageId }].slice(-MAX_SESSION_HISTORY_ITEMS),
      redo: []
    }
  };
};

const recordPresenterSessionAction = (history, session) => {
  const normalizedHistory = normalizeHistory(history);
  const historyWithoutRedo = clearPresenterRedoBranches(normalizedHistory);

  return {
    ...historyWithoutRedo,
    session: {
      undo: [...historyWithoutRedo.session.undo, clonePresenterSession(session)].slice(-MAX_SESSION_HISTORY_ITEMS),
      redo: []
    },
    order: {
      undo: [...normalizedHistory.order.undo, { kind: 'session' }].slice(-MAX_SESSION_HISTORY_ITEMS),
      redo: []
    }
  };
};

const applyUndoOrder = (history, entry) => {
  const normalizedHistory = normalizeHistory(history);
  const undo = normalizedHistory.order.undo.slice(0, -1);
  const redo = [...normalizedHistory.order.redo, entry].slice(-MAX_SESSION_HISTORY_ITEMS);

  return {
    ...normalizedHistory,
    order: { undo, redo }
  };
};

const applyRedoOrder = (history, entry) => {
  const normalizedHistory = normalizeHistory(history);
  const redo = normalizedHistory.order.redo.slice(0, -1);
  const undo = [...normalizedHistory.order.undo, entry].slice(-MAX_SESSION_HISTORY_ITEMS);

  return {
    ...normalizedHistory,
    order: { undo, redo }
  };
};

const trimStaleUndoOrderEntry = (history) => {
  const normalizedHistory = normalizeHistory(history);

  return {
    ...normalizedHistory,
    order: {
      ...normalizedHistory.order,
      undo: normalizedHistory.order.undo.slice(0, -1)
    }
  };
};

const trimStaleRedoOrderEntry = (history) => {
  const normalizedHistory = normalizeHistory(history);

  return {
    ...normalizedHistory,
    order: {
      ...normalizedHistory.order,
      redo: normalizedHistory.order.redo.slice(0, -1)
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
  const [toolbarOpen, setToolbarOpen] = useState(() => Boolean(session.toolbar?.pinned));
  const [activeCategory, setActiveCategory] = useState(() => session.toolbar?.activeCategory || 'pen');
  const [pagePanelOpen, setPagePanelOpen] = useState(false);
  const [instrument, setInstrument] = useState(null);
  const [recoveredSession, setRecoveredSession] = useState(getInitialRecoveredSession);
  const [fullscreenErrorVisible, setFullscreenErrorVisible] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [textToolStyle, setTextToolStyle] = useState(DEFAULT_TEXT_TOOL_STYLE);
  const fullscreenErrorTimerRef = useRef(null);
  const toolbarAutoCloseTimerRef = useRef(null);

  const activePage = getActivePresenterPage(session);
  const pages = useMemo(() => session.pages || [], [session.pages]);
  const activeIndex = useMemo(() => getPresenterPageIndex(session), [session]);
  const pageLabel = pages.length > 0 ? `Pagina ${activeIndex + 1}/${pages.length}` : 'Pagina 0/0';
  const toolStyles = session.toolStyles || {};
  const penTool = toolStyles.pen || { id: 'pen', variant: 'pen', color: '#111827', width: 6 };
  const highlighterTool = toolStyles.highlighter || {
    id: 'highlighter',
    variant: 'highlighter',
    color: '#facc15',
    width: 24
  };
  const activeDrawingTool = activeCategory === 'highlighter' ? highlighterTool : penTool;
  const currentTool = activeCategory === 'pen' || activeCategory === 'highlighter'
    ? {
        id: activeCategory,
        variant: activeCategory,
        color: activeDrawingTool.color || (activeCategory === 'highlighter' ? '#facc15' : '#111827'),
        width: Number.isFinite(activeDrawingTool.width) && activeDrawingTool.width > 0
          ? activeDrawingTool.width
          : activeCategory === 'highlighter'
            ? 24
            : 6
      }
    : { id: 'select' };
  const canUndo = hasAvailableUndo(history, session);
  const canRedo = hasAvailableRedo(history, session);
  const canClearPage = Boolean(
    (Array.isArray(activePage?.strokes) && activePage.strokes.length > 0) ||
      (Array.isArray(activePage?.objects) && activePage.objects.length > 0)
  );
  const selectedTextObject = useMemo(() => {
    const selectedId = Array.isArray(session.selectedObjectIds) && session.selectedObjectIds.length === 1
      ? session.selectedObjectIds[0]
      : session.selectedObjectId;

    return (Array.isArray(activePage?.objects) ? activePage.objects : []).find(
      (object) => object?.id === selectedId && object?.type === 'text'
    ) || null;
  }, [activePage, session.selectedObjectId, session.selectedObjectIds]);
  const selectedTextStyle = selectedTextObject?.textStyle || textToolStyle;

  const clearToolbarAutoCloseTimer = useCallback(() => {
    if (toolbarAutoCloseTimerRef.current) {
      window.clearTimeout(toolbarAutoCloseTimerRef.current);
      toolbarAutoCloseTimerRef.current = null;
    }
  }, []);

  const openToolbar = useCallback(() => {
    clearToolbarAutoCloseTimer();
    setToolbarOpen(true);
  }, [clearToolbarAutoCloseTimer]);

  const closeToolbar = useCallback(() => {
    if (toolbarPinned) return;

    clearToolbarAutoCloseTimer();
    setToolbarOpen(false);
  }, [clearToolbarAutoCloseTimer, toolbarPinned]);

  const scheduleToolbarAutoClose = useCallback(() => {
    if (toolbarPinned || typeof window === 'undefined') return;

    clearToolbarAutoCloseTimer();
    toolbarAutoCloseTimerRef.current = window.setTimeout(() => {
      setToolbarOpen(false);
      toolbarAutoCloseTimerRef.current = null;
    }, 3000);
  }, [clearToolbarAutoCloseTimer, toolbarPinned]);

  const updateActivePageWithHistory = useCallback((updater) => {
    setSession((currentSession) => {
      const page = getActivePresenterPage(currentSession);
      if (!page) return currentSession;

      const nextSession = updater(currentSession, page);
      if (nextSession === currentSession) return currentSession;

      setHistory((currentHistory) => recordPresenterPageAction(currentHistory, page.id, page));
      return nextSession;
    });
  }, []);

  const updateObjectOnActivePageWithHistory = useCallback((objectId, updater) => {
    if (!objectId || typeof updater !== 'function') return;

    updateActivePageWithHistory((currentSession, page) => {
      const objects = Array.isArray(page?.objects) ? page.objects : [];
      let changed = false;
      const nextObjects = objects.map((object) => {
        if (object?.id !== objectId) return object;

        const nextObject = updater(object);
        if (!nextObject || nextObject === object) return object;

        changed = true;
        return nextObject;
      });

      if (!changed) return currentSession;

      return replacePresenterPage(currentSession, page.id, {
        ...page,
        objects: nextObjects
      });
    });
  }, [updateActivePageWithHistory]);

  const activatePageAt = useCallback((index) => {
    setSession((currentSession) => setActivePresenterPageAt(currentSession, index));
  }, []);

  const selectPage = (pageId) => {
    setSession((currentSession) => {
      const pages = Array.isArray(currentSession?.pages) ? currentSession.pages : [];
      const pageIndex = pages.findIndex((page) => page.id === pageId);

      return setActivePresenterPageAt(currentSession, pageIndex);
    });
  };

  const addPage = () => {
    setSession((currentSession) => {
      const nextSession = addPresenterPage(currentSession);
      if (nextSession === currentSession) return currentSession;

      setHistory((currentHistory) => recordPresenterSessionAction(currentHistory, currentSession));
      return nextSession;
    });
  };

  const duplicatePage = () => {
    setSession((currentSession) => {
      const nextSession = duplicatePresenterPage(currentSession, currentSession.activePageId);
      if (nextSession === currentSession) return currentSession;

      setHistory((currentHistory) => recordPresenterSessionAction(currentHistory, currentSession));
      return nextSession;
    });
  };

  const deletePage = () => {
    const canConfirm = typeof window !== 'undefined' && typeof window.confirm === 'function';
    if (canConfirm && !window.confirm('Deze pagina verwijderen?')) return;

    setSession((currentSession) => {
      const nextSession = deletePresenterPage(currentSession, currentSession.activePageId);
      if (nextSession === currentSession) return currentSession;

      setHistory((currentHistory) => recordPresenterSessionAction(currentHistory, currentSession));
      return nextSession;
    });
  };

  const clearPage = () => {
    if (!canClearPage) return;

    const canConfirm = typeof window !== 'undefined' && typeof window.confirm === 'function';
    if (canConfirm && !window.confirm('Huidige pagina leegmaken? Dit verwijdert alleen de inhoud van deze pagina en kan met undo worden teruggezet.')) {
      return;
    }

    updateActivePageWithHistory((currentSession) =>
      clearPresenterPageContent(currentSession, currentSession.activePageId)
    );
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

  const openImportDialog = () => {
    setImportDialogOpen(true);
    setActiveCategory('lesson');
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

  const exitFullscreenSafely = useCallback(async () => {
    if (typeof document === 'undefined' || !document.fullscreenElement) return false;

    try {
      if (typeof document.exitFullscreen !== 'function') {
        showFullscreenError();
        return false;
      }

      await document.exitFullscreen();
      return true;
    } catch {
      showFullscreenError();
      return false;
    }
  }, [showFullscreenError]);

  const handleFullscreen = useCallback(async () => {
    if (typeof document === 'undefined') return;

    const element = document.documentElement;
    if (document.fullscreenElement) {
      await exitFullscreenSafely();
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
  }, [exitFullscreenSafely, showFullscreenError]);

  const handleUndo = useCallback(() => {
    setSession((currentSession) => {
      const entry = getFallbackUndoEntry(history, currentSession);
      if (!entry) return currentSession;

      if (entry.kind === 'session') {
        const result = undoPresenterSession(history, currentSession);
        if (result.session === currentSession && result.history === history) {
          setHistory((currentHistory) => trimStaleUndoOrderEntry(currentHistory));
          return currentSession;
        }

        setHistory(applyUndoOrder(result.history, entry));
        return result.session;
      }

      const page = findSessionPage(currentSession, entry.pageId);
      if (!page) {
        setHistory((currentHistory) => trimStaleUndoOrderEntry(currentHistory));
        return currentSession;
      }

      const result = undoPresenterPage(history, entry.pageId, page);
      if (result.page === page && result.history === history) {
        setHistory((currentHistory) => trimStaleUndoOrderEntry(currentHistory));
        return currentSession;
      }

      setHistory(applyUndoOrder(result.history, entry));
      return replacePresenterPage(currentSession, entry.pageId, result.page);
    });
  }, [history]);

  const handleRedo = useCallback(() => {
    setSession((currentSession) => {
      const entry = getFallbackRedoEntry(history, currentSession);
      if (!entry) return currentSession;

      if (entry.kind === 'session') {
        const result = redoPresenterSession(history, currentSession);
        if (result.session === currentSession && result.history === history) {
          setHistory((currentHistory) => trimStaleRedoOrderEntry(currentHistory));
          return currentSession;
        }

        setHistory(applyRedoOrder(result.history, entry));
        return result.session;
      }

      const page = findSessionPage(currentSession, entry.pageId);
      if (!page) {
        setHistory((currentHistory) => trimStaleRedoOrderEntry(currentHistory));
        return currentSession;
      }

      const result = redoPresenterPage(history, entry.pageId, page);
      if (result.page === page && result.history === history) {
        setHistory((currentHistory) => trimStaleRedoOrderEntry(currentHistory));
        return currentSession;
      }

      setHistory(applyRedoOrder(result.history, entry));
      return replacePresenterPage(currentSession, entry.pageId, result.page);
    });
  }, [history]);

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

  const handlePenStyle = (updates) => {
    setSession((currentSession) => updatePresenterTool(currentSession, updates));
    setActiveCategory(updates?.id === 'highlighter' || updates?.variant === 'highlighter' ? 'highlighter' : 'pen');
    setPagePanelOpen(false);
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

  const handleCreateTextObject = (initialText = '') => {
    const object = createPresenterObject('text', {
      id: createObjectId(),
      x: 260,
      y: 220,
      content: { text: initialText },
      textStyle: textToolStyle
    });

    updateActivePageWithHistory((currentSession) =>
      addObjectToPresenterPage(currentSession, currentSession.activePageId, object)
    );
    setActiveCategory('text');
    setPagePanelOpen(false);
  };

  const handleTextStyle = (updates) => {
    setTextToolStyle((currentStyle) => ({
      ...currentStyle,
      ...updates
    }));

    if (!selectedTextObject?.id) return;

    updateObjectOnActivePageWithHistory(selectedTextObject.id, (object) => ({
      ...object,
      textStyle: {
        ...DEFAULT_TEXT_TOOL_STYLE,
        ...(object.textStyle || {}),
        ...updates
      }
    }));
  };

  const handleTextSymbol = (symbol) => {
    if (!selectedTextObject?.id) {
      handleCreateTextObject(symbol);
      return;
    }

    updateObjectOnActivePageWithHistory(selectedTextObject.id, (object) => {
      const currentText = typeof object?.content?.text === 'string' ? object.content.text : '';
      const separator = currentText && !currentText.endsWith(' ') ? ' ' : '';

      return {
        ...object,
        content: {
          ...(object.content || {}),
          text: `${currentText}${separator}${symbol}`
        }
      };
    });
  };

  const handleTextChange = useCallback((objectId, text) => {
    updateObjectOnActivePageWithHistory(objectId, (object) => {
      const nextText = typeof text === 'string' ? text : '';
      if ((object?.content?.text || '') === nextText) return object;

      return {
        ...object,
        content: {
          ...(object.content || {}),
          text: nextText
        }
      };
    });
  }, [updateObjectOnActivePageWithHistory]);

  const handleImportContent = (importOptions) => {
    if (getPublishedPresenterContentBlocks(importOptions?.contentBlocks).length === 0) return false;

    setSession((currentSession) => {
      const nextSession = appendHelixContentImportToPresenterSession(currentSession, importOptions);
      if (nextSession === currentSession) return currentSession;

      setHistory((currentHistory) => recordPresenterSessionAction(currentHistory, currentSession));
      return nextSession;
    });

    return true;
  };

  const handleSelectObject = (objectId) => {
    setSession((currentSession) => ({
      ...currentSession,
      selectedObjectId: objectId,
      selectedObjectIds: objectId ? [objectId] : []
    }));
  };

  const handleSelectObjects = (objectIds = []) => {
    const selectedObjectIds = [...new Set((Array.isArray(objectIds) ? objectIds : [objectIds]).filter(Boolean))];

    setSession((currentSession) => ({
      ...currentSession,
      selectedObjectId: selectedObjectIds[0] || null,
      selectedObjectIds
    }));
  };

  const handleMoveObjects = useCallback((objectIds, delta) => {
    updateActivePageWithHistory((currentSession) =>
      movePresenterObjectsOnPage(currentSession, currentSession.activePageId, objectIds, delta)
    );
  }, [updateActivePageWithHistory]);

  const handleResizeObjects = useCallback((objectIds, fromBounds, toBounds) => {
    updateActivePageWithHistory((currentSession) =>
      resizePresenterObjectsOnPage(currentSession, currentSession.activePageId, objectIds, fromBounds, toBounds)
    );
  }, [updateActivePageWithHistory]);

  const handleDeleteObject = useCallback((objectId) => {
    updateActivePageWithHistory((currentSession) =>
      deleteObjectFromPresenterPage(currentSession, currentSession.activePageId, objectId)
    );
  }, [updateActivePageWithHistory]);

  const handleDeleteObjects = useCallback((objectIds) => {
    updateActivePageWithHistory((currentSession) =>
      deleteObjectsFromPresenterPage(currentSession, currentSession.activePageId, objectIds)
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
    setToolbarOpen(Boolean(recoveredSession.toolbar?.pinned));
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
        const selectedObjectIds =
          Array.isArray(session.selectedObjectIds) && session.selectedObjectIds.length > 0
            ? session.selectedObjectIds
            : session.selectedObjectId
              ? [session.selectedObjectId]
              : [];

        if (selectedObjectIds.length > 0) {
          event.preventDefault();
          handleDeleteObjects(selectedObjectIds);
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
          void exitFullscreenSafely();
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
    exitFullscreenSafely,
    handleDeleteObject,
    handleDeleteObjects,
    handleRedo,
    handleUndo,
    pages.length,
    recoveredSession,
    session.selectedObjectId,
    session.selectedObjectIds
  ]);

  useEffect(() => () => {
    if (fullscreenErrorTimerRef.current) {
      window.clearTimeout(fullscreenErrorTimerRef.current);
    }

    if (toolbarAutoCloseTimerRef.current) {
      window.clearTimeout(toolbarAutoCloseTimerRef.current);
    }
  }, []);

  return (
    <section className="relative flex h-[calc(100dvh-5rem)] min-h-0 flex-col overflow-hidden bg-slate-200">
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
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm font-black text-slate-50 transition hover:border-violet-300 hover:bg-slate-800"
            onClick={openImportDialog}
          >
            <FilePlus2 size={18} strokeWidth={2.4} />
            Importeer CMS
          </button>
          <div className="flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900 p-1">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded border border-transparent text-slate-100 transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => activatePageAt(activeIndex - 1)}
              disabled={activeIndex <= 0}
              aria-label="Vorige pagina"
            >
              <ArrowLeft size={18} strokeWidth={2.4} />
            </button>
            <span className="min-w-24 px-2 text-center text-sm font-black text-slate-200">{pageLabel}</span>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded border border-transparent text-slate-100 transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => activatePageAt(activeIndex + 1)}
              disabled={activeIndex >= pages.length - 1}
              aria-label="Volgende pagina"
            >
              <ArrowRight size={18} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </header>

      <PresenterBoard
        page={activePage}
        tool={currentTool}
        selectedObjectId={session.selectedObjectId}
        selectedObjectIds={session.selectedObjectIds}
        onInteract={closeToolbar}
        onStrokeComplete={handleStrokeComplete}
        onSelectObject={handleSelectObject}
        onSelectObjects={handleSelectObjects}
        onMoveObjects={handleMoveObjects}
        onResizeObjects={handleResizeObjects}
        onDeleteObject={handleDeleteObject}
        onDeleteObjects={handleDeleteObjects}
        onTextChange={handleTextChange}
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
      <PresenterImportDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImport={handleImportContent}
      />
      {pages.length > 1 ? (
        <div className="pointer-events-auto absolute bottom-28 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-[#6f4a87] bg-[#2b1838] px-2 py-2 text-[#fbf7ff] shadow-xl">
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-[#6f4a87] bg-[#3a224b] px-3 text-lg font-black transition hover:bg-[#472b5b] disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => activatePageAt(activeIndex - 1)}
            disabled={activeIndex <= 0}
            aria-label="Vorige Presenter-pagina"
          >
            ←
          </button>
          <span className="min-w-28 px-2 text-center text-sm font-black">{pageLabel}</span>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-[#6f4a87] bg-[#3a224b] px-3 text-lg font-black transition hover:bg-[#472b5b] disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => activatePageAt(activeIndex + 1)}
            disabled={activeIndex >= pages.length - 1}
            aria-label="Volgende Presenter-pagina"
          >
            →
          </button>
        </div>
      ) : null}
      <PresenterToolbar
        pageLabel={pageLabel}
        activeCategory={activeCategory}
        open={toolbarOpen}
        pinned={toolbarPinned}
        background={activePage?.background}
        penStyle={currentTool}
        onTogglePinned={() => {
          clearToolbarAutoCloseTimer();
          setToolbarPinned((current) => {
            const nextPinned = !current;
            setToolbarOpen(nextPinned);
            return nextPinned;
          });
        }}
        onOpen={openToolbar}
        onAction={scheduleToolbarAutoClose}
        onCategory={handleCategory}
        onBackground={handleBackground}
        onPenStyle={handlePenStyle}
        onAddPage={addPage}
        onPrev={() => activatePageAt(activeIndex - 1)}
        onNext={() => activatePageAt(activeIndex + 1)}
        prevDisabled={activeIndex <= 0}
        nextDisabled={activeIndex >= pages.length - 1}
        canUndo={canUndo}
        canRedo={canRedo}
        canClearPage={canClearPage}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClearPage={clearPage}
        onSelect={handleSelectTool}
        onCreateObject={handleCreateObject}
        onCreateTextObject={() => handleCreateTextObject()}
        onTextStyle={handleTextStyle}
        onTextSymbol={handleTextSymbol}
        selectedTextStyle={selectedTextStyle}
        hasSelectedTextObject={Boolean(selectedTextObject)}
        onInstrument={handleInstrument}
        onOpenImport={openImportDialog}
        onFullscreen={handleFullscreen}
      />
    </section>
  );
}
