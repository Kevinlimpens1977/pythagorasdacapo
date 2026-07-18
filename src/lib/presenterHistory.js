const MAX_HISTORY_ITEMS = 80;

// Pagina's worden in het hele model immutabel bijgewerkt (spread/replace),
// dus de history kan referenties bewaren in plaats van diepe klonen. Dat
// scheelt een structuredClone per penstreek/gumbeweging.
const clonePage = (page) => page;

const getPageHistory = (history, pageId) =>
  history.byPageId[pageId] || { undo: [], redo: [] };

export const createPresenterHistory = () => ({
  byPageId: {}
});

export const recordPresenterPageState = (history, pageId, page) => {
  const pageHistory = getPageHistory(history, pageId);
  const undo = [...pageHistory.undo, clonePage(page)].slice(-MAX_HISTORY_ITEMS);

  return {
    ...history,
    byPageId: {
      ...history.byPageId,
      [pageId]: {
        undo,
        redo: []
      }
    }
  };
};

export const undoPresenterPage = (history, pageId, currentPage) => {
  const pageHistory = getPageHistory(history, pageId);
  if (pageHistory.undo.length === 0) {
    return { page: currentPage, history };
  }

  const previous = pageHistory.undo[pageHistory.undo.length - 1];
  const undo = pageHistory.undo.slice(0, -1);
  const redo = [...pageHistory.redo, clonePage(currentPage)];

  return {
    page: previous,
    history: {
      ...history,
      byPageId: {
        ...history.byPageId,
        [pageId]: { undo, redo }
      }
    }
  };
};

export const redoPresenterPage = (history, pageId, currentPage) => {
  const pageHistory = getPageHistory(history, pageId);
  if (pageHistory.redo.length === 0) {
    return { page: currentPage, history };
  }

  const next = pageHistory.redo[pageHistory.redo.length - 1];
  const redo = pageHistory.redo.slice(0, -1);
  const undo = [...pageHistory.undo, clonePage(currentPage)].slice(-MAX_HISTORY_ITEMS);

  return {
    page: next,
    history: {
      ...history,
      byPageId: {
        ...history.byPageId,
        [pageId]: { undo, redo }
      }
    }
  };
};
