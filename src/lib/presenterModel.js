const DEFAULT_BOARD_WIDTH = 1920;
const DEFAULT_PAGE_HEIGHT = 1400;

const createId = (prefix) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const cloneWithFreshIds = (items, prefix) =>
  items.map((item) => ({
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
  session.pages.find((page) => page.id === session.activePageId) || session.pages[0] || null;

export const setActivePresenterPage = (session, pageId) => {
  if (!session.pages.some((page) => page.id === pageId)) return session;

  return {
    ...session,
    activePageId: pageId,
    selectedObjectId: null
  };
};

export const addPresenterPage = (session) => {
  const page = createPresenterPage({ title: `Pagina ${session.pages.length + 1}` });

  return {
    ...session,
    pages: [...session.pages, page],
    activePageId: page.id,
    selectedObjectId: null,
    dirty: true
  };
};

export const duplicatePresenterPage = (session, pageId = session.activePageId) => {
  const sourceIndex = session.pages.findIndex((page) => page.id === pageId);
  if (sourceIndex === -1) return session;

  const source = session.pages[sourceIndex];
  const duplicate = createPresenterPage({
    ...structuredClone(source),
    id: createId('presenter-page'),
    title: `${source.title} kopie`,
    strokes: cloneWithFreshIds(source.strokes, 'stroke'),
    objects: cloneWithFreshIds(source.objects, 'object')
  });
  const pages = [...session.pages];
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
  const pages = session.pages.filter((page) => page.id !== pageId);
  if (pages.length === session.pages.length) return session;

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
    session.activePageId === pageId ? pages[Math.max(0, pages.length - 1)].id : session.activePageId;

  return {
    ...session,
    pages,
    activePageId,
    selectedObjectId: null,
    dirty: true
  };
};
