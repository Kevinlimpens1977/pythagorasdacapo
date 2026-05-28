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
    activePageId: firstPage.id,
    pages: [firstPage],
    tool: {
      id: 'pen',
      color: '#111827',
      width: 6,
      variant: 'pen'
    },
    toolbar: {
      pinned: false,
      activeCategory: 'pen'
    },
    selectedObjectId: null,
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
    selectedObjectId: null
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
  const currentTool = session?.tool || {};
  const color = typeof updates.color === 'string' && updates.color ? updates.color : currentTool.color || '#111827';
  const width = Number.isFinite(updates.width) && updates.width > 0 ? updates.width : currentTool.width || 6;
  const nextTool = {
    id: 'pen',
    variant: 'pen',
    color,
    width
  };

  if (
    currentTool.id === nextTool.id &&
    currentTool.variant === nextTool.variant &&
    currentTool.color === nextTool.color &&
    currentTool.width === nextTool.width
  ) {
    return session;
  }

  return {
    ...session,
    tool: nextTool,
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

export const addObjectToPresenterPage = (session, pageId = session.activePageId, object) => {
  if (!object?.id) return session;

  const nextSession = updatePresenterPage(session, pageId, (page) => ({
    ...page,
    objects: [...(Array.isArray(page?.objects) ? page.objects : []), cloneValue(object)]
  }));

  if (nextSession === session) return session;

  return {
    ...nextSession,
    selectedObjectId: object.id
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
    selectedObjectId: session.selectedObjectId === objectId ? null : session.selectedObjectId
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
    dirty: true
  };
};
