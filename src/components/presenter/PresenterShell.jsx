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
  addRecentPresenterColor,
  addStrokeToPresenterPage,
  clearPresenterPageContent,
  createPresenterSession,
  deleteObjectsFromPresenterPage,
  deleteObjectFromPresenterPage,
  deletePresenterPage,
  duplicatePresenterPage,
  getActivePresenterPage,
  getPresenterPageIndex,
  duplicatePresenterObjectsOnPage,
  movePresenterObjectsOnPage,
  reorderPresenterObjectsOnPage,
  replaceStrokesOnPresenterPage,
  renamePresenterSession,
  resizePresenterObjectsOnPage,
  rotatePresenterObjectOnPage,
  setActivePresenterPageAt,
  updatePresenterTool,
  updatePresenterPageBackground
} from '../../lib/presenterModel';
import { DEFAULT_PRESENTER_ERASER_SIZE, erasePartialStrokes, getPresenterEraserRadius } from '../../lib/presenterEraser';
import { createPresenterInstrument, planInstrumentPlacement } from '../../lib/presenterInstruments';
import { createCurtain, createLaser, createSpotlight } from '../../lib/presenterFocus';
import { PresenterStudentPicker, PresenterTimerOverlay } from './PresenterFocusTools';
import { createPresenterObject, updatePresenterMathToolObject } from '../../lib/presenterObjects';
import { AXES_DEFAULT_GRID_SIZE, planAxesObjectPlacement } from '../../lib/presenterAxes';
import { recognizePresenterShape } from '../../lib/presenterShapeRecognition';
import {
  clearPresenterRecoveryState,
  hasRecoverablePresenterState,
  migratePresenterRecoveryState,
  savePresenterRecoveryState
} from '../../lib/presenterStorage';
import {
  applyClassroomLogToObject,
  clearClassroomLogFromObject
} from '../../lib/presenterClassroomLog.js';
import {
  appendHelixContentImportToPresenterSession,
  getPublishedPresenterContentBlocks
} from '../../lib/presenterContentImport';
import { insertTextAtSelection } from '../../lib/presenterTextInsertion';
import PresenterBoard from './PresenterBoard';
import PresenterImportDialog from './PresenterImportDialog';
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

const getBrowserLocalStorage = () => {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
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
  const restored = migratePresenterRecoveryState({
    primaryStorage: getBrowserLocalStorage(),
    legacyStorage: getBrowserSessionStorage()
  })?.session || null;
  return hasRecoverablePresenterState(restored) ? restored : null;
};

const formatSavedAtLabel = (date) => {
  try {
    return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
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
  const [activeTextCursor, setActiveTextCursor] = useState(null);
  const [textCaretRequest, setTextCaretRequest] = useState(null);
  // Verzoek aan het bord om het bewerkpaneel van een net geplaatst
  // assenstelsel meteen te openen.
  const [axesPanelRequest, setAxesPanelRequest] = useState(null);
  const [eraserSize, setEraserSize] = useState(DEFAULT_PRESENTER_ERASER_SIZE);
  const [penMode, setPenMode] = useState('free');
  // Vormherkenning staat standaard UIT: wie het woord 'Oma' schrijft wil geen
  // ellips. De docent zet hem aan in het penpaneel.
  const [shapeRecognition, setShapeRecognition] = useState(false);
  const [fingerDrawing, setFingerDrawing] = useState(true);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [focusTool, setFocusTool] = useState(null);
  const [timer, setTimer] = useState(null);
  const [studentPickerOpen, setStudentPickerOpen] = useState(false);
  const [boardTheme, setBoardTheme] = useState('light');
  const [toolbarAlign, setToolbarAlign] = useState(() => session.toolbar?.align || 'center');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const shellRef = useRef(null);
  const boardViewportRef = useRef(null);
  // Onthoudt welk instrument net is neergelegd, zodat de nameting daarna
  // precies een keer mag bijsturen en nooit een sleepbeweging overschrijft.
  const instrumentRefitRef = useRef(null);
  const fullscreenErrorTimerRef = useRef(null);
  const eraseGestureHistoryRef = useRef(null);

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
        variant: activeCategory === 'pen' && penMode === 'line' ? 'geometry-pen' : activeCategory,
        color: activeDrawingTool.color || (activeCategory === 'highlighter' ? '#facc15' : '#111827'),
        width: Number.isFinite(activeDrawingTool.width) && activeDrawingTool.width > 0
          ? activeDrawingTool.width
          : activeCategory === 'highlighter'
            ? 24
            : 6
      }
    : activeCategory === 'eraser'
      ? { id: 'eraser', radius: getPresenterEraserRadius(eraserSize) }
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

  // `toolbarOpen` is sinds de nieuwe werkbalk niet meer "is de balk zichtbaar"
  // maar "staat het gereedschapspaneel boven de balk open". De balk zelf staat
  // er altijd; alleen het paneel komt en gaat.
  const openToolbar = useCallback(() => {
    setToolbarOpen(true);
  }, []);

  // Het bord aanraken sluit het paneel — tenzij de docent het heeft vastgezet.
  const closeToolbar = useCallback(() => {
    if (toolbarPinned) return;

    setToolbarOpen(false);
  }, [toolbarPinned]);

  // Sluiten op verzoek van de werkbalk zelf (nogmaals op het gereedschap tikken,
  // de sluitknop, of een afrondende actie). Dat mag ook als het paneel vaststaat.
  const closeToolbarPanel = useCallback(() => {
    setToolbarOpen(false);
  }, []);

  // Werkbalkvoorkeuren horen bij de sessie, zodat vastzetten en uitlijnen een
  // herlaad en een herstel overleven. Dit zet `dirty` bewust NIET: een
  // balkwijziging alleen mag geen herstelrecord opleveren en hoort niet in de
  // undo-geschiedenis.
  const rememberToolbarPreference = useCallback((updates) => {
    setSession((currentSession) => ({
      ...currentSession,
      toolbar: { ...(currentSession.toolbar || {}), ...updates }
    }));
  }, []);

  const handleToolbarAlign = useCallback((align) => {
    setToolbarAlign(align);
    rememberToolbarPreference({ align });
  }, [rememberToolbarPreference]);

  const handleTogglePinned = useCallback(() => {
    const nextPinned = !toolbarPinned;

    setToolbarPinned(nextPinned);
    setToolbarOpen(nextPinned);
    rememberToolbarPreference({ pinned: nextPinned });
  }, [rememberToolbarPreference, toolbarPinned]);

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
    // Nogmaals op Pagina's tikken sluit het overzicht weer, net als bij de
    // gereedschapspanelen. Elke andere categorie sluit het.
    setPagePanelOpen(category === 'pages' ? !(activeCategory === 'pages' && pagePanelOpen) : false);
  };

  const handleSelectTool = () => {
    setActiveCategory('select');
    setPagePanelOpen(false);
  };

  // Instrumentknoppen togglen: nogmaals klikken op het actieve instrument
  // sluit het weer (naast de sluitknop op het instrument zelf en Escape).
  // Een nieuw instrument wordt door planInstrumentPlacement op maat gemaakt en
  // gecentreerd in het vrije deel van het bord: de hele omhullende rechthoek,
  // inclusief de knoppenrij, valt in beeld en nooit achter de balken.
  const handleInstrument = (instrumentId) => {
    const visibleRect = boardViewportRef.current?.() || null;
    const placement = planInstrumentPlacement({
      instrumentId,
      visibleRect,
      boardWidth: activePage?.width,
      boardHeight: activePage?.height,
      boardScale: visibleRect?.scale,
      gridSize: activePage?.background?.gridSize
    });

    setInstrument((current) => {
      if (current?.id === instrumentId) {
        instrumentRefitRef.current = null;
        return null;
      }

      instrumentRefitRef.current = instrumentId;
      return createPresenterInstrument(instrumentId, placement || {});
    });
    setActiveCategory('pen');
    setPagePanelOpen(false);
  };

  const handleInstrumentChange = useCallback((updates) => {
    setInstrument((current) => (current ? { ...current, ...updates } : current));
  }, []);

  // Nameting: het openklappen van een werkbalkpaneel verandert de vrije ruimte
  // op hetzelfde moment dat het instrument wordt neergelegd. Zodra de layout
  // staat, wordt de plaatsing een keer opnieuw doorgerekend met de ruimte die
  // er dan echt is. Daarna niet meer, zodat verslepen ongemoeid blijft.
  const activeInstrumentId = instrument?.id;
  useEffect(() => {
    if (!activeInstrumentId || instrumentRefitRef.current !== activeInstrumentId) return undefined;

    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        instrumentRefitRef.current = null;
        const visibleRect = boardViewportRef.current?.();
        if (!visibleRect) return;

        const placement = planInstrumentPlacement({
          instrumentId: activeInstrumentId,
          visibleRect,
          boardWidth: activePage?.width,
          boardHeight: activePage?.height,
          boardScale: visibleRect.scale,
          gridSize: activePage?.background?.gridSize
        });
        if (!placement) return;

        setInstrument((current) =>
          current?.id === activeInstrumentId ? { ...current, ...placement } : current
        );
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [activeInstrumentId, activePage?.background?.gridSize, activePage?.height, activePage?.width]);

  const handleFocusSelect = (kind) => {
    setFocusTool((current) => {
      if (current?.kind === kind) return null;
      if (kind === 'spotlight') return createSpotlight(current?.kind === 'spotlight' ? current.radiusId : undefined);
      if (kind === 'curtain') return createCurtain();
      if (kind === 'laser') return createLaser();
      return null;
    });
  };

  const handleFocusChange = useCallback((updates) => {
    setFocusTool((current) => (current ? { ...current, ...updates } : current));
  }, []);

  const handleTimerStart = (minutes) => {
    setTimer({ endsAt: Date.now() + minutes * 60000, minutes });
  };

  // De passer tekent met de actuele penstijl: bogen en cirkels worden gewone
  // inkt-strokes, dus gumbaar met de precisiegum en undo-baar per boog.
  const handleCompassStroke = useCallback((points) => {
    if (!Array.isArray(points) || points.length < 2) return;

    // Het id staat buiten de updater zodat die puur blijft (StrictMode voert
    // updaters dubbel uit).
    const strokeId = createObjectId().replace('object-', 'stroke-');

    updateActivePageWithHistory((currentSession) => {
      const penStyle = currentSession.toolStyles?.pen || { color: '#111827', width: 6 };
      const stroke = {
        id: strokeId,
        variant: 'pen',
        color: penStyle.color || '#111827',
        width: Number.isFinite(penStyle.width) && penStyle.width > 0 ? penStyle.width : 6,
        points
      };

      return addStrokeToPresenterPage(currentSession, currentSession.activePageId, stroke);
    });
  }, [updateActivePageWithHistory]);

  // Wat een instrument als bordobject aflevert: nu de hoekconstructie van de
  // geodriehoek. Een object en geen inkt, want het gradenlabel is data - het
  // wordt uit angleDegrees afgeleid, verschuift mee met de figuur en kan niet
  // half weggegumd worden. Precies één history-stap, dus één undo per hoek.
  const handlePlaceInstrumentObject = useCallback((draft) => {
    if (!draft?.type) return;

    // Het id staat buiten de updater zodat die puur blijft (StrictMode voert
    // updaters dubbel uit).
    const objectId = createObjectId();

    updateActivePageWithHistory((currentSession) =>
      addObjectToPresenterPage(
        currentSession,
        currentSession.activePageId,
        createPresenterObject(draft.type, { ...draft, id: objectId })
      )
    );
  }, [updateActivePageWithHistory]);

  const handleToggleObjectMeasure = useCallback((objectId) => {
    if (!objectId) return;

    updateObjectOnActivePageWithHistory(objectId, (object) => ({
      ...object,
      showMeasure: !object.showMeasure
    }));
  }, [updateObjectOnActivePageWithHistory]);

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

    // Echte bordmodus: fullscreen op de Presenter-sectie zelf, zodat de
    // adminchrome volledig verdwijnt en het bord edge-to-edge staat.
    const element = shellRef.current || document.documentElement;
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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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

  // Vormherkenning gebeurt NA het loslaten, en vervangt de streek in DEZELFDE
  // history-stap door een echt object: één haal blijft dus één undo-stap, en de
  // herkende vorm valt meteen in de bestaande machinerie voor selecteren,
  // schalen, roteren, laagvolgorde en smart guides. Bij twijfel geeft
  // recognizePresenterShape null terug en blijft de ruwe inkt gewoon staan.
  const handleStrokeComplete = (stroke) => {
    const shape = shapeRecognition ? recognizePresenterShape(stroke) : null;

    if (shape) {
      // Het id staat buiten de updater zodat die puur blijft (StrictMode voert
      // updaters dubbel uit).
      const object = createPresenterObject(shape.type, {
        id: createObjectId(),
        x: shape.x,
        y: shape.y,
        width: shape.width,
        height: shape.height,
        rotation: shape.rotation || 0,
        ...(Array.isArray(shape.points) ? { points: shape.points } : {}),
        fill: 'none',
        stroke: stroke?.color || '#111827',
        strokeWidth: Number.isFinite(stroke?.width) && stroke.width > 0 ? stroke.width : 6
      });

      updateActivePageWithHistory((currentSession) =>
        addObjectToPresenterPage(currentSession, currentSession.activePageId, object)
      );
      return;
    }

    updateActivePageWithHistory((currentSession) =>
      addStrokeToPresenterPage(currentSession, currentSession.activePageId, stroke)
    );
  };

  // Precisie-gum: wist alleen het geraakte stuk van een streek (en splitst hem
  // waar nodig). Eén gumbeweging = één undo-stap: alleen bij het eerste
  // raakmoment van een gesture wordt de paginastaat vastgelegd.
  const handleEraseBrush = useCallback((brush, gestureId) => {
    setSession((currentSession) => {
      const page = getActivePresenterPage(currentSession);
      if (!page) return currentSession;

      const result = erasePartialStrokes(page.strokes, brush);
      if (!result.changed) return currentSession;

      if (eraseGestureHistoryRef.current !== gestureId || !gestureId) {
        eraseGestureHistoryRef.current = gestureId || null;
        setHistory((currentHistory) => recordPresenterPageAction(currentHistory, page.id, page));
      }

      return replaceStrokesOnPresenterPage(currentSession, currentSession.activePageId, result.strokes);
    });
  }, []);

  const handleRotateObject = useCallback((objectId, rotation) => {
    updateActivePageWithHistory((currentSession) =>
      rotatePresenterObjectOnPage(currentSession, currentSession.activePageId, objectId, rotation)
    );
  }, [updateActivePageWithHistory]);

  const handleCustomColor = useCallback((color) => {
    setSession((currentSession) => addRecentPresenterColor(currentSession, color));
  }, []);

  const handleRenameSession = (title) => {
    setSession((currentSession) => renamePresenterSession(currentSession, title));
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
    const overrides = {
      id: createObjectId(),
      x: 220,
      y: 180
    };

    // Een assenstelsel landt niet blind op 220/180: het wordt gecentreerd in het
    // vrije deel van het bord met zijn hoek op een roosterlijn, zodat de assen
    // meteen samenvallen met het ruitjespapier.
    if (type === 'axes') {
      Object.assign(
        overrides,
        planAxesObjectPlacement({
          gridSize: activePage?.background?.gridSize || AXES_DEFAULT_GRID_SIZE,
          pageWidth: activePage?.width,
          pageHeight: activePage?.height,
          visibleRect: boardViewportRef.current?.() || null
        })
      );
    }

    const object = createPresenterObject(type, overrides);

    updateActivePageWithHistory((currentSession) =>
      addObjectToPresenterPage(currentSession, currentSession.activePageId, object)
    );

    if (type === 'axes') {
      setAxesPanelRequest({ objectId: object.id, requestId: Date.now() });
    }
  };

  // Bereik, asnamen en het kader van een assenstelsel komen altijd als één
  // afgerond pakket binnen (uit het paneel of uit een sleepbeweging), zodat het
  // opgeslagen kader nooit uit de pas loopt met het bereik.
  const handleAxesChange = useCallback((objectId, patch) => {
    if (!objectId || !patch?.range) return;

    updateObjectOnActivePageWithHistory(objectId, (object) => {
      if (object?.type !== 'axes') return object;

      const unchanged =
        object.x === patch.x &&
        object.y === patch.y &&
        object.width === patch.width &&
        object.height === patch.height &&
        object.range?.xMin === patch.range.xMin &&
        object.range?.xMax === patch.range.xMax &&
        object.range?.yMin === patch.range.yMin &&
        object.range?.yMax === patch.range.yMax &&
        object.labels?.x === patch.labels?.x &&
        object.labels?.y === patch.labels?.y;
      // Geen verschil betekent geen undo-stap: het paneel commit bij elke blur.
      if (unchanged) return object;

      return {
        ...object,
        x: patch.x,
        y: patch.y,
        width: patch.width,
        height: patch.height,
        range: { ...patch.range },
        labels: { ...patch.labels }
      };
    });
  }, [updateObjectOnActivePageWithHistory]);

  const handleEnableGrid = () => {
    handleBackground({
      kind: 'grid',
      gridSize: activePage?.background?.gridSize || AXES_DEFAULT_GRID_SIZE
    });
  };

  const handleCreateTextObject = (initialText = '') => {
    const text = typeof initialText === 'string' ? initialText : String(initialText ?? '');
    const object = createPresenterObject('text', {
      id: createObjectId(),
      x: 260,
      y: 220,
      content: { text },
      textStyle: textToolStyle
    });

    updateActivePageWithHistory((currentSession) =>
      addObjectToPresenterPage(currentSession, currentSession.activePageId, object)
    );
    setActiveCategory('text');
    setPagePanelOpen(false);
    return object.id;
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
    const insertion = typeof symbol === 'string' ? symbol : String(symbol ?? '');
    if (!insertion) return;

    if (!selectedTextObject?.id) {
      const objectId = handleCreateTextObject(insertion);
      const selection = { start: insertion.length, end: insertion.length };
      setActiveTextCursor({ objectId, selection });
      setTextCaretRequest({ objectId, offset: insertion.length, requestId: Date.now() });
      return;
    }

    const selection = activeTextCursor?.objectId === selectedTextObject.id
      ? activeTextCursor.selection
      : null;

    updateObjectOnActivePageWithHistory(selectedTextObject.id, (object) => {
      const currentText = typeof object?.content?.text === 'string' ? object.content.text : '';
      const result = insertTextAtSelection(currentText, insertion, selection);

      if (result.text === currentText) return object;
      return {
        ...object,
        content: {
          ...(object.content || {}),
          text: result.text
        }
      };
    });

    const result = insertTextAtSelection(
      typeof selectedTextObject?.content?.text === 'string' ? selectedTextObject.content.text : '',
      insertion,
      selection
    );
    const nextSelection = { start: result.caretOffset, end: result.caretOffset };
    setActiveTextCursor({ objectId: selectedTextObject.id, selection: nextSelection });
    setTextCaretRequest({ objectId: selectedTextObject.id, offset: result.caretOffset, requestId: Date.now() });
  };

  const handleTextCursorChange = useCallback((objectId, selection) => {
    const start = Number.isFinite(selection?.start) ? selection.start : null;
    const end = Number.isFinite(selection?.end) ? selection.end : null;
    if (!objectId || start === null || end === null) return;

    setActiveTextCursor((current) => {
      if (
        current?.objectId === objectId &&
        current.selection?.start === start &&
        current.selection?.end === end
      ) {
        return current;
      }

      return { objectId, selection: { start, end } };
    });
  }, []);

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

  const handleMathToolChange = useCallback((objectId, mathTool) => {
    updateObjectOnActivePageWithHistory(objectId, (object) =>
      updatePresenterMathToolObject(object, mathTool)
    );
  }, [updateObjectOnActivePageWithHistory]);

  // Lesregistratie van een klassikaal behandeld vraagvenster. Dit blijft in de
  // presenter-sessie (en dus in de bestaande localStorage-recovery): geen
  // Firestore, geen voortgangsrecord, geen leerling- of klas-id, geen tokens.
  const handleImportedObjectClassroomLog = useCallback((objectId, entry) => {
    updateObjectOnActivePageWithHistory(objectId, (object) =>
      entry ? applyClassroomLogToObject(object, entry) : clearClassroomLogFromObject(object)
    );
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

  const handleReorderObjects = useCallback((objectIds, direction) => {
    updateActivePageWithHistory((currentSession) =>
      reorderPresenterObjectsOnPage(currentSession, currentSession.activePageId, objectIds, direction)
    );
  }, [updateActivePageWithHistory]);

  const handleDuplicateSelection = useCallback(() => {
    updateActivePageWithHistory((currentSession) => {
      const selectedIds = Array.isArray(currentSession.selectedObjectIds) && currentSession.selectedObjectIds.length > 0
        ? currentSession.selectedObjectIds
        : currentSession.selectedObjectId
          ? [currentSession.selectedObjectId]
          : [];
      if (selectedIds.length === 0) return currentSession;

      return duplicatePresenterObjectsOnPage(currentSession, currentSession.activePageId, selectedIds);
    });
  }, [updateActivePageWithHistory]);

  const handleDiscardRecovery = () => {
    clearPresenterRecoveryState(getBrowserLocalStorage());
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
    setToolbarAlign(recoveredSession.toolbar?.align || 'center');
    setPagePanelOpen(false);
    setInstrument(null);
    setRecoveredSession(null);
  };

  useEffect(() => {
    if (recoveredSession) return;
    if (!hasRecoverablePresenterState(session)) return;

    savePresenterRecoveryState(getBrowserLocalStorage(), session);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- autosave-indicator hoort bij deze externe write
    setLastSavedAt(new Date());
  }, [recoveredSession, session]);

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

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        handleDuplicateSelection();
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
        setFocusTool(null);
        setStudentPickerOpen(false);
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
    handleDuplicateSelection,
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
  }, []);

  return (
    <section
      ref={shellRef}
      className={`relative flex min-h-0 flex-col overflow-hidden ${boardTheme === 'dark' ? 'bg-slate-950' : 'bg-slate-200'} ${
        isFullscreen ? 'h-[100dvh]' : 'h-[calc(100dvh-5rem)]'
      }`}
    >
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
      <header className={`presenter-chrome-surface flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 ${isFullscreen ? 'hidden' : ''}`}>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--helix-purple)]">Presenter</p>
          <input
            type="text"
            value={session.title || ''}
            onChange={(event) => handleRenameSession(event.target.value)}
            placeholder="Naamloos bord"
            aria-label="Naam van dit bord"
            className="w-64 max-w-full truncate rounded-md border border-transparent bg-transparent text-lg font-black leading-tight text-[var(--helix-navy)] outline-none transition placeholder:text-[var(--helix-muted)]/60 hover:border-white/80 hover:bg-white/60 focus:border-white focus:bg-white"
          />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {lastSavedAt ? (
            <span className="text-xs font-bold text-[var(--helix-muted)]" role="status">
              Opgeslagen {formatSavedAtLabel(lastSavedAt)}
            </span>
          ) : null}
          <span className="rounded-md border border-white/70 bg-white/60 px-3 py-1.5 text-sm font-black text-[var(--helix-navy)] shadow-[0_8px_18px_rgba(122,60,255,0.08)]">
            {pageLabel}
          </span>
        </div>
      </header>

      <PresenterBoard
        page={activePage}
        tool={currentTool}
        selectedObjectId={session.selectedObjectId}
        selectedObjectIds={session.selectedObjectIds}
        onInteract={closeToolbar}
        onStrokeComplete={handleStrokeComplete}
        onEraseBrush={handleEraseBrush}
        onRotateObject={handleRotateObject}
        onSelectObject={handleSelectObject}
        onSelectObjects={handleSelectObjects}
        onMoveObjects={handleMoveObjects}
        onResizeObjects={handleResizeObjects}
        onDeleteObject={handleDeleteObject}
        onDeleteObjects={handleDeleteObjects}
        onReorderObjects={handleReorderObjects}
        onTextChange={handleTextChange}
        textCaretRequest={textCaretRequest}
        onTextCursorChange={handleTextCursorChange}
        onMathToolChange={handleMathToolChange}
        onImportedObjectClassroomLog={handleImportedObjectClassroomLog}
        allowFingerDrawing={fingerDrawing}
        instrument={instrument}
        onInstrumentChange={handleInstrumentChange}
        onInstrumentClose={() => setInstrument(null)}
        focus={focusTool}
        onFocusChange={handleFocusChange}
        boardTheme={boardTheme}
        compassPenStyle={penTool}
        onCompassStroke={handleCompassStroke}
        onPlaceInstrumentObject={handlePlaceInstrumentObject}
        onPenStyle={handlePenStyle}
        boardViewportRef={boardViewportRef}
        onToggleObjectMeasure={handleToggleObjectMeasure}
        onAxesChange={handleAxesChange}
        onEnableGrid={handleEnableGrid}
        axesPanelRequest={axesPanelRequest}
      />
      <PresenterTimerOverlay timer={timer} onStop={() => setTimer(null)} />
      <PresenterStudentPicker open={studentPickerOpen} onClose={() => setStudentPickerOpen(false)} />
      <PresenterPagePanel
        pages={pages}
        activePageId={session.activePageId}
        open={pagePanelOpen}
        onSelectPage={selectPage}
        onAddPage={addPage}
        onDuplicatePage={duplicatePage}
        onDeletePage={deletePage}
      />
      <PresenterImportDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImport={handleImportContent}
      />
      <PresenterToolbar
        pageLabel={pageLabel}
        activeCategory={activeCategory}
        open={toolbarOpen}
        pinned={toolbarPinned}
        background={activePage?.background}
        penStyle={currentTool}
        onTogglePinned={handleTogglePinned}
        onOpen={openToolbar}
        onClosePanel={closeToolbarPanel}
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
        onInstrument={handleInstrument}
        activeInstrument={instrument?.id || null}
        onOpenImport={openImportDialog}
        onFullscreen={handleFullscreen}
        eraserSize={eraserSize}
        onEraserSize={setEraserSize}
        recentColors={Array.isArray(session.recentColors) ? session.recentColors : []}
        onCustomColor={handleCustomColor}
        penMode={penMode}
        onPenMode={setPenMode}
        shapeRecognition={shapeRecognition}
        onToggleShapeRecognition={() => setShapeRecognition((current) => !current)}
        fingerDrawing={fingerDrawing}
        onToggleFingerDrawing={() => setFingerDrawing((current) => !current)}
        focusKind={focusTool?.kind || null}
        spotlightRadiusId={focusTool?.kind === 'spotlight' ? focusTool.radiusId : 'medium'}
        curtainDirection={focusTool?.kind === 'curtain' ? focusTool.direction : 'top'}
        onFocusSelect={handleFocusSelect}
        onSpotlightRadius={(radiusId) => handleFocusChange({ radiusId })}
        onCurtainDirection={(direction) => handleFocusChange({ direction })}
        onTimer={handleTimerStart}
        onStudentPicker={() => setStudentPickerOpen(true)}
        boardTheme={boardTheme}
        onToggleBoardTheme={() => setBoardTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
        toolbarAlign={toolbarAlign}
        onToolbarAlign={handleToolbarAlign}
      />
    </section>
  );
}
