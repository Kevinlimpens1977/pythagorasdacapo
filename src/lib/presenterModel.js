const DEFAULT_BOARD_WIDTH = 1920;
const DEFAULT_PAGE_HEIGHT = 1400;

const createId = (prefix) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const cloneWithFreshIds = (items, prefix) =>
  (Array.isArray(items) ? items : []).map((item) => ({
    ...structuredClone(item),
    id: createId(prefix)
  }));

const cloneValue = (value) => structuredClone(value);

const MIN_TRANSFORM_SIZE = 24;

const isFiniteNumber = (value) => Number.isFinite(value);

const getNumber = (value, fallback = 0) => (isFiniteNumber(value) ? value : fallback);

const TOOL_DEFAULTS = {
  pen: {
    id: 'pen',
    variant: 'pen',
    color: '#111827',
    width: 6
  },
  highlighter: {
    id: 'highlighter',
    variant: 'highlighter',
    color: '#facc15',
    width: 24
  }
};

const getToolKey = (tool) => (tool?.id === 'highlighter' || tool?.variant === 'highlighter' ? 'highlighter' : 'pen');

const normalizePresenterTool = (tool = {}) => {
  const toolKey = getToolKey(tool);
  const defaults = TOOL_DEFAULTS[toolKey];

  return {
    id: defaults.id,
    variant: defaults.variant,
    color: typeof tool.color === 'string' && tool.color ? tool.color : defaults.color,
    width: Number.isFinite(tool.width) && tool.width > 0 ? tool.width : defaults.width
  };
};

export const getPresenterStrokeStyle = (stroke = {}) => {
  const tool = normalizePresenterTool(stroke);

  return {
    color: tool.color,
    width: tool.width,
    opacity: tool.variant === 'highlighter' ? 0.36 : 1,
    lineCap: 'round',
    lineJoin: 'round'
  };
};

const normalizeIdList = (ids) =>
  [...new Set((Array.isArray(ids) ? ids : [ids]).filter((id) => typeof id === 'string' && id.length > 0))];

const normalizeRect = (rect) => {
  if (!rect) return null;

  const x1 = getNumber(rect.x);
  const y1 = getNumber(rect.y);
  const x2 = isFiniteNumber(rect.right) ? rect.right : x1 + getNumber(rect.width);
  const y2 = isFiniteNumber(rect.bottom) ? rect.bottom : y1 + getNumber(rect.height);

  return {
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1),
    right: Math.max(x1, x2),
    bottom: Math.max(y1, y2)
  };
};

const rectsIntersect = (a, b) =>
  a.x <= b.right && a.right >= b.x && a.y <= b.bottom && a.bottom >= b.y;

const rectContainsRect = (outer, inner) =>
  inner.x >= outer.x && inner.right <= outer.right && inner.y >= outer.y && inner.bottom <= outer.bottom;

export const getPresenterObjectBounds = (object) => {
  if (!object?.id) return null;

  const x = getNumber(object.x);
  const y = getNumber(object.y);
  const width = getNumber(object.width, 120);
  const height = getNumber(object.height, 80);
  const left = Math.min(x, x + width);
  const top = Math.min(y, y + height);
  const right = Math.max(x, x + width);
  const bottom = Math.max(y, y + height);

  return {
    x: left,
    y: top,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
    right,
    bottom
  };
};

export const getPresenterSelectionBounds = (page, objectIds) => {
  const selectedIds = new Set(normalizeIdList(objectIds));
  if (selectedIds.size === 0) return null;

  const bounds = (Array.isArray(page?.objects) ? page.objects : [])
    .filter((object) => selectedIds.has(object?.id))
    .map(getPresenterObjectBounds)
    .filter(Boolean);

  if (bounds.length === 0) return null;

  const left = Math.min(...bounds.map((bound) => bound.x));
  const top = Math.min(...bounds.map((bound) => bound.y));
  const right = Math.max(...bounds.map((bound) => bound.right));
  const bottom = Math.max(...bounds.map((bound) => bound.bottom));

  return {
    x: left,
    y: top,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
    right,
    bottom
  };
};

export const getPresenterObjectIdsInRect = (page, rect, { mode = 'intersect' } = {}) => {
  const selectionRect = normalizeRect(rect);
  if (!selectionRect || selectionRect.width === 0 || selectionRect.height === 0) return [];

  return (Array.isArray(page?.objects) ? page.objects : [])
    .filter((object) => {
      const objectBounds = getPresenterObjectBounds(object);
      if (!objectBounds) return false;

      return mode === 'contain'
        ? rectContainsRect(selectionRect, objectBounds)
        : rectsIntersect(selectionRect, objectBounds);
    })
    .map((object) => object.id);
};

export const movePresenterObjectsOnPage = (session, pageId = session.activePageId, objectIds, delta = {}) => {
  const selectedIds = new Set(normalizeIdList(objectIds));
  const dx = getNumber(delta.dx);
  const dy = getNumber(delta.dy);
  if (selectedIds.size === 0 || (dx === 0 && dy === 0)) return session;

  return updatePresenterPage(session, pageId, (page) => {
    const objects = Array.isArray(page?.objects) ? page.objects : [];
    if (!objects.some((object) => selectedIds.has(object?.id))) return page;

    return {
      ...page,
      objects: objects.map((object) =>
        selectedIds.has(object?.id)
          ? {
              ...object,
              x: getNumber(object.x) + dx,
              y: getNumber(object.y) + dy
            }
          : object
      )
    };
  });
};

export const resizePresenterObjectsOnPage = (
  session,
  pageId = session.activePageId,
  objectIds,
  fromBounds,
  toBounds,
  { minSize = MIN_TRANSFORM_SIZE } = {}
) => {
  const selectedIds = new Set(normalizeIdList(objectIds));
  const sourceBounds = normalizeRect(fromBounds);
  const targetBounds = normalizeRect(toBounds);
  if (!sourceBounds || !targetBounds || selectedIds.size === 0) return session;
  if (sourceBounds.width <= 0 || sourceBounds.height <= 0) return session;

  const safeMinSize = isFiniteNumber(minSize) && minSize > 0 ? minSize : MIN_TRANSFORM_SIZE;
  const nextBounds = {
    ...targetBounds,
    width: Math.max(safeMinSize, targetBounds.width),
    height: Math.max(safeMinSize, targetBounds.height)
  };
  nextBounds.right = nextBounds.x + nextBounds.width;
  nextBounds.bottom = nextBounds.y + nextBounds.height;

  const scaleX = nextBounds.width / sourceBounds.width;
  const scaleY = nextBounds.height / sourceBounds.height;

  return updatePresenterPage(session, pageId, (page) => {
    const objects = Array.isArray(page?.objects) ? page.objects : [];
    if (!objects.some((object) => selectedIds.has(object?.id))) return page;

    return {
      ...page,
      objects: objects.map((object) => {
        if (!selectedIds.has(object?.id)) return object;
        const objectScale = Math.max(0.1, Math.min(Math.abs(scaleX), Math.abs(scaleY)));
        const nextTextStyle = object.type === 'text' && object.textStyle
          ? {
              ...object.textStyle,
              fontSize: Math.max(8, getNumber(object.textStyle.fontSize, 48) * objectScale)
            }
          : object.textStyle;

        return {
          ...object,
          x: nextBounds.x + (getNumber(object.x) - sourceBounds.x) * scaleX,
          y: nextBounds.y + (getNumber(object.y) - sourceBounds.y) * scaleY,
          width: getNumber(object.width, 120) * scaleX,
          height: getNumber(object.height, 80) * scaleY,
          ...(nextTextStyle ? { textStyle: nextTextStyle } : {})
        };
      })
    };
  });
};

export const createPresenterPage = (overrides = {}) => ({
  id: overrides.id ?? createId('presenter-page'),
  title: overrides.title ?? 'Pagina 1',
  width: overrides.width ?? DEFAULT_BOARD_WIDTH,
  height: overrides.height ?? DEFAULT_PAGE_HEIGHT,
  background: cloneValue(overrides.background ?? {
    kind: 'white',
    gridSize: 96
  }),
  strokes: cloneValue(overrides.strokes ?? []),
  objects: cloneValue(overrides.objects ?? []),
  source: cloneValue(overrides.source ?? null)
});

export const createPresenterSession = () => {
  const firstPage = createPresenterPage({ title: 'Pagina 1' });

  return {
    version: 1,
    title: '',
    recentColors: [],
    activePageId: firstPage.id,
    pages: [firstPage],
    tool: {
      id: 'pen',
      color: '#111827',
      width: 6,
      variant: 'pen'
    },
    toolStyles: {
      pen: cloneValue(TOOL_DEFAULTS.pen),
      highlighter: cloneValue(TOOL_DEFAULTS.highlighter)
    },
    toolbar: {
      pinned: false,
      activeCategory: 'pen'
    },
    selectedObjectId: null,
    selectedObjectIds: [],
    dirty: false
  };
};

export const getActivePresenterPage = (session) =>
  (Array.isArray(session?.pages) ? session.pages : []).find((page) => page.id === session?.activePageId) ||
  (Array.isArray(session?.pages) ? session.pages[0] : null) ||
  null;

export const getPresenterPageIndex = (session, pageId = session?.activePageId) => {
  const pages = Array.isArray(session?.pages) ? session.pages : [];
  if (pages.length === 0) return -1;

  const activeIndex = pages.findIndex((page) => page?.id === pageId);
  return activeIndex === -1 ? 0 : activeIndex;
};

const updatePresenterPage = (session, pageId = session.activePageId, updater) => {
  const pages = Array.isArray(session?.pages) ? session.pages : [];
  const pageIndex = pages.findIndex((page) => page?.id === pageId);
  if (pageIndex === -1 || typeof updater !== 'function') return session;

  const nextPage = updater(pages[pageIndex]);
  if (!nextPage) return session;

  return {
    ...session,
    pages: pages.map((page, index) => (index === pageIndex ? nextPage : page)),
    dirty: true
  };
};

export const updatePresenterPageBackground = (
  session,
  pageId = session.activePageId,
  background
) => {
  if (!background) return session;

  return updatePresenterPage(session, pageId, (page) => ({
    ...page,
    background: cloneValue(background)
  }));
};

export const setActivePresenterPage = (session, pageId) => {
  const pages = Array.isArray(session?.pages) ? session.pages : [];
  if (!pages.some((page) => page.id === pageId)) return session;

  return {
    ...session,
    activePageId: pageId,
    selectedObjectId: null,
    selectedObjectIds: []
  };
};

export const setActivePresenterPageAt = (session, index) => {
  const pages = Array.isArray(session?.pages) ? session.pages : [];
  if (!Number.isInteger(index) || index < 0 || index >= pages.length) return session;

  return setActivePresenterPage(session, pages[index].id);
};

export const addPresenterPage = (session) => {
  const pages = Array.isArray(session?.pages) ? session.pages : [];
  const page = createPresenterPage({ title: `Pagina ${pages.length + 1}` });

  return {
    ...session,
    pages: [...pages, page],
    activePageId: page.id,
    selectedObjectId: null,
    selectedObjectIds: [],
    dirty: true
  };
};

export const addStrokeToPresenterPage = (session, pageId = session.activePageId, stroke) => {
  if (!stroke) return session;

  return updatePresenterPage(session, pageId, (page) => ({
    ...page,
    strokes: [...(Array.isArray(page?.strokes) ? page.strokes : []), cloneValue(stroke)]
  }));
};

export const updatePresenterTool = (session, updates = {}) => {
  const requestedKey = getToolKey(updates.id || updates.variant ? updates : session?.tool);
  const currentStyles = session?.toolStyles || {};
  const currentTool = normalizePresenterTool(currentStyles[requestedKey] || session?.tool || TOOL_DEFAULTS[requestedKey]);
  const nextTool = normalizePresenterTool({
    ...currentTool,
    ...updates,
    id: requestedKey,
    variant: requestedKey
  });
  const nextToolStyles = {
    pen: normalizePresenterTool(currentStyles.pen || TOOL_DEFAULTS.pen),
    highlighter: normalizePresenterTool(currentStyles.highlighter || TOOL_DEFAULTS.highlighter),
    [requestedKey]: nextTool
  };

  if (
    session?.tool?.id === nextTool.id &&
    session?.tool?.variant === nextTool.variant &&
    currentTool.color === nextTool.color &&
    currentTool.width === nextTool.width &&
    session?.toolStyles?.[requestedKey]?.color === nextToolStyles[requestedKey].color &&
    session?.toolStyles?.[requestedKey]?.width === nextToolStyles[requestedKey].width
  ) {
    return session;
  }

  return {
    ...session,
    tool: nextTool,
    toolStyles: nextToolStyles,
    dirty: true
  };
};

export const removeStrokeFromPresenterPage = (session, pageId = session.activePageId, strokeId) => {
  if (!strokeId) return session;

  return updatePresenterPage(session, pageId, (page) => ({
    ...page,
    strokes: (Array.isArray(page?.strokes) ? page.strokes : []).filter((stroke) => stroke?.id !== strokeId)
  }));
};

export const removeStrokesFromPresenterPage = (session, pageId = session.activePageId, strokeIds) => {
  const removedIds = new Set(normalizeIdList(strokeIds));
  if (removedIds.size === 0) return session;

  const pages = Array.isArray(session?.pages) ? session.pages : [];
  const page = pages.find((currentPage) => currentPage?.id === pageId);
  const strokes = Array.isArray(page?.strokes) ? page.strokes : [];
  if (!strokes.some((stroke) => removedIds.has(stroke?.id))) return session;

  return updatePresenterPage(session, pageId, (currentPage) => ({
    ...currentPage,
    strokes: (Array.isArray(currentPage?.strokes) ? currentPage.strokes : []).filter(
      (stroke) => !removedIds.has(stroke?.id)
    )
  }));
};

export const rotatePresenterObjectOnPage = (session, pageId = session.activePageId, objectId, rotation) => {
  if (!objectId || !isFiniteNumber(rotation)) return session;

  const normalizedRotation = ((rotation % 360) + 360) % 360;

  return updatePresenterPage(session, pageId, (page) => {
    const objects = Array.isArray(page?.objects) ? page.objects : [];
    if (!objects.some((object) => object?.id === objectId)) return page;

    return {
      ...page,
      objects: objects.map((object) =>
        object?.id === objectId && getNumber(object.rotation) !== normalizedRotation
          ? { ...object, rotation: normalizedRotation }
          : object
      )
    };
  });
};

const MAX_RECENT_COLORS = 6;
const isHexColor = (value) => typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);

export const addRecentPresenterColor = (session, color) => {
  if (!isHexColor(color)) return session;

  const normalized = color.toLowerCase();
  const current = (Array.isArray(session?.recentColors) ? session.recentColors : []).filter(isHexColor);
  const next = [normalized, ...current.filter((entry) => entry.toLowerCase() !== normalized)].slice(0, MAX_RECENT_COLORS);

  if (current.length === next.length && current.every((entry, index) => entry === next[index])) return session;

  return {
    ...session,
    recentColors: next
  };
};

export const renamePresenterSession = (session, title) => {
  const nextTitle = typeof title === 'string' ? title.trimStart().slice(0, 80) : '';
  if ((session?.title || '') === nextTitle) return session;

  return {
    ...session,
    title: nextTitle,
    dirty: true
  };
};

export const addObjectToPresenterPage = (session, pageId = session.activePageId, object) => {
  if (!object?.id) return session;

  const nextSession = updatePresenterPage(session, pageId, (page) => ({
    ...page,
    objects: [...(Array.isArray(page?.objects) ? page.objects : []), cloneValue(object)]
  }));

  if (nextSession === session) return session;

  return {
    ...nextSession,
    selectedObjectId: object.id,
    selectedObjectIds: [object.id]
  };
};

export const deleteObjectFromPresenterPage = (session, pageId = session.activePageId, objectId) => {
  if (!objectId) return session;

  const pages = Array.isArray(session?.pages) ? session.pages : [];
  const page = pages.find((currentPage) => currentPage?.id === pageId);
  const objects = Array.isArray(page?.objects) ? page.objects : [];
  if (!objects.some((object) => object?.id === objectId)) return session;

  const nextSession = updatePresenterPage(session, pageId, (page) => ({
    ...page,
    objects: (Array.isArray(page?.objects) ? page.objects : []).filter((object) => object?.id !== objectId)
  }));

  if (nextSession === session) return session;

  return {
    ...nextSession,
    selectedObjectId: session.selectedObjectId === objectId ? null : session.selectedObjectId,
    selectedObjectIds: normalizeIdList(session.selectedObjectIds).filter((selectedId) => selectedId !== objectId)
  };
};

export const deleteObjectsFromPresenterPage = (session, pageId = session.activePageId, objectIds) => {
  const deletedIds = new Set(normalizeIdList(objectIds));
  if (deletedIds.size === 0) return session;

  const pages = Array.isArray(session?.pages) ? session.pages : [];
  const page = pages.find((currentPage) => currentPage?.id === pageId);
  const objects = Array.isArray(page?.objects) ? page.objects : [];
  if (!objects.some((object) => deletedIds.has(object?.id))) return session;

  const nextSession = updatePresenterPage(session, pageId, (page) => ({
    ...page,
    objects: (Array.isArray(page?.objects) ? page.objects : []).filter((object) => !deletedIds.has(object?.id))
  }));

  if (nextSession === session) return session;

  const selectedObjectIds = normalizeIdList(session.selectedObjectIds).filter((selectedId) => !deletedIds.has(selectedId));

  return {
    ...nextSession,
    selectedObjectId: deletedIds.has(session.selectedObjectId) ? selectedObjectIds[0] || null : session.selectedObjectId,
    selectedObjectIds
  };
};

export const clearPresenterPageContent = (session, pageId = session.activePageId) => {
  const pages = Array.isArray(session?.pages) ? session.pages : [];
  const page = pages.find((currentPage) => currentPage?.id === pageId);
  if (!page) return session;

  const strokes = Array.isArray(page?.strokes) ? page.strokes : [];
  const objects = Array.isArray(page?.objects) ? page.objects : [];
  if (strokes.length === 0 && objects.length === 0) return session;

  const nextSession = updatePresenterPage(session, pageId, (currentPage) => ({
    ...currentPage,
    strokes: [],
    objects: []
  }));

  if (nextSession === session) return session;

  const clearedObjectIds = new Set(objects.map((object) => object?.id).filter(Boolean));

  return {
    ...nextSession,
    selectedObjectId: clearedObjectIds.has(session.selectedObjectId) ? null : session.selectedObjectId,
    selectedObjectIds: (Array.isArray(session.selectedObjectIds) ? session.selectedObjectIds : []).filter(
      (selectedId) => !clearedObjectIds.has(selectedId)
    )
  };
};

export const duplicatePresenterPage = (session, pageId = session.activePageId) => {
  const sessionPages = Array.isArray(session?.pages) ? session.pages : [];
  const sourceIndex = sessionPages.findIndex((page) => page.id === pageId);
  if (sourceIndex === -1) return session;

  const source = sessionPages[sourceIndex];
  const duplicate = createPresenterPage({
    ...structuredClone(source),
    id: createId('presenter-page'),
    title: `${source.title} kopie`,
    strokes: cloneWithFreshIds(source.strokes, 'stroke'),
    objects: cloneWithFreshIds(source.objects, 'object')
  });
  const pages = [...sessionPages];
  pages.splice(sourceIndex + 1, 0, duplicate);

  return {
    ...session,
    pages,
    activePageId: duplicate.id,
    selectedObjectId: null,
    selectedObjectIds: [],
    dirty: true
  };
};

export const deletePresenterPage = (session, pageId = session.activePageId) => {
  const sessionPages = Array.isArray(session?.pages) ? session.pages : [];
  const deletedIndex = sessionPages.findIndex((page) => page.id === pageId);
  if (deletedIndex === -1) return session;

  const pages = sessionPages.filter((page) => page.id !== pageId);

  if (pages.length === 0) {
    const replacement = createPresenterPage({ title: 'Pagina 1' });
    return {
      ...session,
      pages: [replacement],
      activePageId: replacement.id,
      selectedObjectId: null,
      selectedObjectIds: [],
      dirty: true
    };
  }

  const activePageId =
    session.activePageId === pageId
      ? pages[Math.min(deletedIndex, pages.length - 1)].id
      : session.activePageId;

  return {
    ...session,
    pages,
    activePageId,
    selectedObjectId: null,
    selectedObjectIds: [],
    dirty: true
  };
};
