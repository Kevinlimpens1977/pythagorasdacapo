import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createPresenterSession,
  addPresenterPage,
  duplicatePresenterPage,
  deletePresenterPage,
  setActivePresenterPage,
  getActivePresenterPage,
  createPresenterPage,
  getPresenterPageIndex,
  addStrokeToPresenterPage,
  removeStrokeFromPresenterPage,
  addObjectToPresenterPage,
  deleteObjectFromPresenterPage,
  deleteObjectsFromPresenterPage,
  getPresenterObjectBounds,
  getPresenterObjectIdsInRect,
  getPresenterSelectionBounds,
  movePresenterObjectsOnPage,
  resizePresenterObjectsOnPage,
  clearPresenterPageContent,
  setActivePresenterPageAt,
  updatePresenterPageBackground,
  updatePresenterTool,
  getPresenterStrokeStyle
} from './presenterModel.js';

test('createPresenterSession starts with one white page', () => {
  const session = createPresenterSession();

  assert.equal(session.pages.length, 1);
  assert.equal(session.activePageId, session.pages[0].id);
  assert.equal(session.pages[0].title, 'Pagina 1');
  assert.equal(session.pages[0].background.kind, 'white');
  assert.deepEqual(session.pages[0].strokes, []);
  assert.deepEqual(session.pages[0].objects, []);
  assert.deepEqual(session.selectedObjectIds, []);
});

test('addPresenterPage appends a new page and makes it active', () => {
  const session = addPresenterPage(createPresenterSession());

  assert.equal(session.pages.length, 2);
  assert.equal(getActivePresenterPage(session).title, 'Pagina 2');
  assert.equal(session.dirty, true);
});

test('duplicatePresenterPage copies the active page after the original', () => {
  const first = createPresenterSession();
  const page = {
    ...first.pages[0],
    strokes: [{ id: 'stroke-1', tool: 'pen', points: [{ x: 1, y: 2 }] }],
    objects: [{ id: 'object-1', type: 'rectangle', x: 10, y: 20 }]
  };
  const session = { ...first, pages: [page] };
  const next = duplicatePresenterPage(session, page.id);

  assert.equal(next.pages.length, 2);
  assert.notEqual(next.pages[1].id, page.id);
  assert.notEqual(next.pages[1].strokes[0].id, 'stroke-1');
  assert.notEqual(next.pages[1].objects[0].id, 'object-1');
  assert.equal(next.pages[1].title, 'Pagina 1 kopie');
  assert.equal(next.activePageId, next.pages[1].id);
  assert.equal(next.dirty, true);
});

test('duplicatePresenterPage treats missing legacy stroke and object arrays as empty', () => {
  const first = createPresenterSession();
  const legacyPage = {
    id: 'legacy-page',
    title: 'Legacy pagina',
    width: 1920,
    height: 1400,
    background: { kind: 'white' }
  };
  const session = {
    ...first,
    activePageId: legacyPage.id,
    pages: [legacyPage]
  };

  const next = duplicatePresenterPage(session, legacyPage.id);

  assert.equal(next.pages.length, 2);
  assert.equal(next.pages[1].title, 'Legacy pagina kopie');
  assert.deepEqual(next.pages[1].strokes, []);
  assert.deepEqual(next.pages[1].objects, []);
  assert.equal(next.dirty, true);
});

test('duplicatePresenterPage treats non-array imported stroke and object values as empty', () => {
  const first = createPresenterSession();
  const importedPage = {
    id: 'imported-page',
    title: 'Imported pagina',
    width: 1920,
    height: 1400,
    background: { kind: 'white' },
    strokes: {},
    objects: 'bad'
  };
  const session = {
    ...first,
    activePageId: importedPage.id,
    pages: [importedPage]
  };

  let next;
  assert.doesNotThrow(() => {
    next = duplicatePresenterPage(session, importedPage.id);
  });

  assert.equal(next.pages.length, 2);
  assert.equal(next.pages[1].title, 'Imported pagina kopie');
  assert.deepEqual(next.pages[1].strokes, []);
  assert.deepEqual(next.pages[1].objects, []);
  assert.equal(next.dirty, true);
});

test('deletePresenterPage removes a page and keeps an active page', () => {
  const session = addPresenterPage(createPresenterSession());
  const deletedId = session.pages[1].id;
  const next = deletePresenterPage(session, deletedId);

  assert.equal(next.pages.length, 1);
  assert.notEqual(next.activePageId, deletedId);
});

test('deletePresenterPage keeps one empty page when deleting the last page', () => {
  const session = createPresenterSession();
  const next = deletePresenterPage(session, session.activePageId);

  assert.equal(next.pages.length, 1);
  assert.equal(next.pages[0].title, 'Pagina 1');
  assert.equal(next.pages[0].background.kind, 'white');
  assert.deepEqual(next.pages[0].strokes, []);
  assert.deepEqual(next.pages[0].objects, []);
});

test('addStrokeToPresenterPage appends a stroke to the target page and marks dirty', () => {
  const session = addPresenterPage(createPresenterSession());
  const targetPageId = session.pages[0].id;
  const stroke = {
    id: 'stroke-1',
    variant: 'pen',
    color: '#111827',
    width: 5,
    points: [{ x: 10, y: 20 }]
  };
  const next = addStrokeToPresenterPage(session, targetPageId, stroke);

  assert.equal(next.dirty, true);
  assert.deepEqual(next.pages[0].strokes, [stroke]);
  assert.deepEqual(next.pages[1].strokes, []);
  assert.notEqual(next.pages[0], session.pages[0]);
  assert.equal(next.pages[1], session.pages[1]);
});

test('updatePresenterTool changes pen style without changing pages', () => {
  const session = createPresenterSession();
  const next = updatePresenterTool(session, { color: '#dc2626', width: 10 });

  assert.equal(next.dirty, true);
  assert.deepEqual(next.tool, {
    id: 'pen',
    variant: 'pen',
    color: '#dc2626',
    width: 10
  });
  assert.equal(next.pages, session.pages);
});

test('updatePresenterTool switches to a highlighter tool with its own style', () => {
  const session = createPresenterSession();
  const next = updatePresenterTool(session, { id: 'highlighter', variant: 'highlighter', color: '#facc15', width: 24 });

  assert.equal(next.dirty, true);
  assert.deepEqual(next.tool, {
    id: 'highlighter',
    variant: 'highlighter',
    color: '#facc15',
    width: 24
  });
});

test('getPresenterStrokeStyle renders highlighter strokes as translucent broad strokes', () => {
  assert.deepEqual(
    getPresenterStrokeStyle({ variant: 'highlighter', color: '#facc15', width: 24 }),
    {
      color: '#facc15',
      width: 24,
      opacity: 0.36,
      lineCap: 'round',
      lineJoin: 'round'
    }
  );

  assert.deepEqual(
    getPresenterStrokeStyle({ variant: 'pen', color: '#111827', width: 6 }),
    {
      color: '#111827',
      width: 6,
      opacity: 1,
      lineCap: 'round',
      lineJoin: 'round'
    }
  );
});

test('removeStrokeFromPresenterPage removes a stroke by id', () => {
  const page = createPresenterPage({
    id: 'page-1',
    strokes: [
      { id: 'stroke-1', points: [{ x: 1, y: 2 }] },
      { id: 'stroke-2', points: [{ x: 3, y: 4 }] }
    ]
  });
  const session = {
    ...createPresenterSession(),
    activePageId: page.id,
    pages: [page]
  };
  const next = removeStrokeFromPresenterPage(session, page.id, 'stroke-1');

  assert.equal(next.dirty, true);
  assert.deepEqual(next.pages[0].strokes, [{ id: 'stroke-2', points: [{ x: 3, y: 4 }] }]);
  assert.notEqual(next.pages[0], page);
});

test('addObjectToPresenterPage adds object and selects it', () => {
  const session = addPresenterPage(createPresenterSession());
  const targetPageId = session.pages[0].id;
  const object = {
    id: 'object-1',
    type: 'rectangle',
    x: 10,
    y: 20,
    width: 240,
    height: 160
  };
  const next = addObjectToPresenterPage(session, targetPageId, object);

  assert.equal(next.dirty, true);
  assert.equal(next.selectedObjectId, object.id);
  assert.deepEqual(next.selectedObjectIds, [object.id]);
  assert.deepEqual(next.pages[0].objects, [object]);
  assert.deepEqual(next.pages[1].objects, []);
  assert.notEqual(next.pages[0], session.pages[0]);
  assert.equal(next.pages[1], session.pages[1]);
});

test('deleteObjectFromPresenterPage removes selected object and clears selectedObjectId', () => {
  const page = createPresenterPage({
    id: 'page-1',
    objects: [
      { id: 'object-1', type: 'rectangle', x: 10, y: 20 },
      { id: 'object-2', type: 'ellipse', x: 30, y: 40 }
    ]
  });
  const session = {
    ...createPresenterSession(),
    activePageId: page.id,
    pages: [page],
    selectedObjectId: 'object-1',
    selectedObjectIds: ['object-1']
  };
  const next = deleteObjectFromPresenterPage(session, page.id, 'object-1');

  assert.equal(next.dirty, true);
  assert.equal(next.selectedObjectId, null);
  assert.deepEqual(next.selectedObjectIds, []);
  assert.deepEqual(next.pages[0].objects, [{ id: 'object-2', type: 'ellipse', x: 30, y: 40 }]);
  assert.notEqual(next.pages[0], page);
});

test('deleteObjectFromPresenterPage ignores missing object ids without dirtying session', () => {
  const page = createPresenterPage({
    id: 'page-1',
    objects: [{ id: 'object-1', type: 'rectangle', x: 10, y: 20 }]
  });
  const session = {
    ...createPresenterSession(),
    activePageId: page.id,
    pages: [page],
    selectedObjectId: 'missing-object',
    dirty: false
  };
  const next = deleteObjectFromPresenterPage(session, page.id, 'missing-object');

  assert.equal(next, session);
  assert.equal(next.dirty, false);
  assert.equal(next.selectedObjectId, 'missing-object');
  assert.deepEqual(next.pages[0].objects, page.objects);
});

test('deleteObjectFromPresenterPage ignores missing legacy object arrays without clearing selection', () => {
  const page = {
    id: 'legacy-page',
    title: 'Legacy pagina',
    width: 1920,
    height: 1400,
    background: { kind: 'white' }
  };
  const session = {
    ...createPresenterSession(),
    activePageId: page.id,
    pages: [page],
    selectedObjectId: 'object-1',
    dirty: false
  };
  const next = deleteObjectFromPresenterPage(session, page.id, 'object-1');

  assert.equal(next, session);
  assert.equal(next.dirty, false);
  assert.equal(next.selectedObjectId, 'object-1');
  assert.equal(next.pages[0], page);
});

test('getPresenterObjectBounds normalizes negative object dimensions', () => {
  assert.deepEqual(
    getPresenterObjectBounds({ id: 'object-1', type: 'line', x: 100, y: 80, width: -40, height: -20 }),
    { x: 60, y: 60, width: 40, height: 20, right: 100, bottom: 80 }
  );
});

test('getPresenterObjectIdsInRect returns objects intersecting the marquee rectangle', () => {
  const page = createPresenterPage({
    objects: [
      { id: 'object-1', type: 'rectangle', x: 10, y: 10, width: 100, height: 80 },
      { id: 'object-2', type: 'ellipse', x: 150, y: 30, width: 90, height: 90 },
      { id: 'object-3', type: 'triangle', x: 420, y: 30, width: 100, height: 80 }
    ]
  });

  assert.deepEqual(getPresenterObjectIdsInRect(page, { x: 0, y: 0, width: 180, height: 140 }), [
    'object-1',
    'object-2'
  ]);
  assert.deepEqual(getPresenterObjectIdsInRect(page, { x: 0, y: 0, width: 180, height: 140 }, { mode: 'contain' }), [
    'object-1'
  ]);
});

test('getPresenterSelectionBounds combines selected object bounds', () => {
  const page = createPresenterPage({
    objects: [
      { id: 'object-1', type: 'rectangle', x: 10, y: 20, width: 100, height: 80 },
      { id: 'object-2', type: 'ellipse', x: 180, y: 40, width: 90, height: 70 },
      { id: 'object-3', type: 'triangle', x: 500, y: 40, width: 90, height: 70 }
    ]
  });

  assert.deepEqual(getPresenterSelectionBounds(page, ['object-1', 'object-2']), {
    x: 10,
    y: 20,
    width: 260,
    height: 90,
    right: 270,
    bottom: 110
  });
});

test('movePresenterObjectsOnPage moves selected objects as a group', () => {
  const page = createPresenterPage({
    id: 'page-1',
    objects: [
      { id: 'object-1', type: 'rectangle', x: 10, y: 20, width: 100, height: 80 },
      { id: 'object-2', type: 'ellipse', x: 180, y: 40, width: 90, height: 70 },
      { id: 'object-3', type: 'triangle', x: 500, y: 40, width: 90, height: 70 }
    ]
  });
  const session = { ...createPresenterSession(), activePageId: page.id, pages: [page] };

  const next = movePresenterObjectsOnPage(session, page.id, ['object-1', 'object-2'], { dx: 15, dy: -5 });

  assert.equal(next.dirty, true);
  assert.equal(next.pages[0].objects[0].x, 25);
  assert.equal(next.pages[0].objects[0].y, 15);
  assert.equal(next.pages[0].objects[1].x, 195);
  assert.equal(next.pages[0].objects[1].y, 35);
  assert.equal(next.pages[0].objects[2], page.objects[2]);
});

test('resizePresenterObjectsOnPage scales selected objects from group bounds', () => {
  const page = createPresenterPage({
    id: 'page-1',
    objects: [
      { id: 'object-1', type: 'rectangle', x: 10, y: 20, width: 100, height: 80 },
      { id: 'object-2', type: 'ellipse', x: 160, y: 60, width: 50, height: 40 }
    ]
  });
  const session = { ...createPresenterSession(), activePageId: page.id, pages: [page] };
  const fromBounds = getPresenterSelectionBounds(page, ['object-1', 'object-2']);

  const next = resizePresenterObjectsOnPage(session, page.id, ['object-1', 'object-2'], fromBounds, {
    x: 10,
    y: 20,
    width: 400,
    height: 160
  });

  assert.equal(next.dirty, true);
  assert.equal(next.pages[0].objects[0].x, 10);
  assert.equal(next.pages[0].objects[0].y, 20);
  assert.equal(next.pages[0].objects[0].width, 200);
  assert.equal(next.pages[0].objects[0].height, 160);
  assert.equal(next.pages[0].objects[1].x, 310);
  assert.equal(next.pages[0].objects[1].y, 100);
  assert.equal(next.pages[0].objects[1].width, 100);
  assert.equal(next.pages[0].objects[1].height, 80);
});

test('resizePresenterObjectsOnPage scales text font size with the object frame', () => {
  const page = createPresenterPage({
    id: 'page-1',
    objects: [
      {
        id: 'text-1',
        type: 'text',
        x: 20,
        y: 30,
        width: 200,
        height: 100,
        textStyle: { fontSize: 48, color: '#111827' }
      }
    ]
  });
  const session = { ...createPresenterSession(), activePageId: page.id, pages: [page] };
  const fromBounds = getPresenterSelectionBounds(page, ['text-1']);

  const next = resizePresenterObjectsOnPage(session, page.id, ['text-1'], fromBounds, {
    x: 20,
    y: 30,
    width: 400,
    height: 200
  });

  assert.equal(next.pages[0].objects[0].width, 400);
  assert.equal(next.pages[0].objects[0].height, 200);
  assert.equal(next.pages[0].objects[0].textStyle.fontSize, 96);
});

test('deleteObjectsFromPresenterPage removes a selected group and keeps remaining selection', () => {
  const page = createPresenterPage({
    id: 'page-1',
    objects: [
      { id: 'object-1', type: 'rectangle', x: 10, y: 20 },
      { id: 'object-2', type: 'ellipse', x: 30, y: 40 },
      { id: 'object-3', type: 'triangle', x: 50, y: 60 }
    ]
  });
  const session = {
    ...createPresenterSession(),
    activePageId: page.id,
    pages: [page],
    selectedObjectId: 'object-1',
    selectedObjectIds: ['object-1', 'object-2', 'object-3']
  };

  const next = deleteObjectsFromPresenterPage(session, page.id, ['object-1', 'object-2']);

  assert.equal(next.dirty, true);
  assert.equal(next.selectedObjectId, 'object-3');
  assert.deepEqual(next.selectedObjectIds, ['object-3']);
  assert.deepEqual(next.pages[0].objects, [{ id: 'object-3', type: 'triangle', x: 50, y: 60 }]);
});

test('clearPresenterPageContent clears only the target page content and selected object', () => {
  const session = addPresenterPage(createPresenterSession());
  const firstPageId = session.pages[0].id;
  const secondPageId = session.pages[1].id;
  const pageOneStroke = { id: 'stroke-1', points: [{ x: 1, y: 2 }] };
  const pageTwoStroke = { id: 'stroke-2', points: [{ x: 3, y: 4 }] };
  const pageOneObject = { id: 'object-1', type: 'rectangle', x: 10, y: 20 };
  const pageTwoObject = { id: 'object-2', type: 'ellipse', x: 30, y: 40 };
  const populatedSession = {
    ...session,
    activePageId: firstPageId,
    selectedObjectId: pageOneObject.id,
    pages: [
      {
        ...session.pages[0],
        strokes: [pageOneStroke],
        objects: [pageOneObject]
      },
      {
        ...session.pages[1],
        strokes: [pageTwoStroke],
        objects: [pageTwoObject]
      }
    ],
    dirty: false
  };

  const next = clearPresenterPageContent(populatedSession, firstPageId);

  assert.equal(next.dirty, true);
  assert.equal(next.selectedObjectId, null);
  assert.deepEqual(next.pages[0].strokes, []);
  assert.deepEqual(next.pages[0].objects, []);
  assert.deepEqual(next.pages[1].strokes, [pageTwoStroke]);
  assert.deepEqual(next.pages[1].objects, [pageTwoObject]);
  assert.equal(next.pages[1].id, secondPageId);
});

test('updatePresenterPageBackground changes only the target page background', () => {
  const session = addPresenterPage(createPresenterSession());
  const targetPageId = session.pages[0].id;
  const untouchedPage = session.pages[1];
  const background = { kind: 'grid', gridSize: 72 };

  const next = updatePresenterPageBackground(session, targetPageId, background);

  assert.equal(next.dirty, true);
  assert.deepEqual(next.pages[0].background, background);
  assert.deepEqual(next.pages[1].background, untouchedPage.background);
  assert.notEqual(next.pages[0], session.pages[0]);
  assert.equal(next.pages[1], untouchedPage);
});

test('setActivePresenterPage switches to a valid page and clears selected object', () => {
  const session = {
    ...addPresenterPage(createPresenterSession()),
    selectedObjectId: 'object-1'
  };
  const next = setActivePresenterPage(session, session.pages[0].id);

  assert.equal(next.activePageId, session.pages[0].id);
  assert.equal(next.selectedObjectId, null);
});

test('getPresenterPageIndex falls back to the first page when activePageId is stale', () => {
  const session = addPresenterPage(createPresenterSession());
  const staleSession = { ...session, activePageId: 'missing-page' };

  assert.equal(getPresenterPageIndex(staleSession), 0);
});

test('setActivePresenterPageAt navigates by index and clears selected object', () => {
  const session = {
    ...addPresenterPage(createPresenterSession()),
    selectedObjectId: 'object-1'
  };
  const next = setActivePresenterPageAt(session, 0);

  assert.equal(next.activePageId, session.pages[0].id);
  assert.equal(next.selectedObjectId, null);
});

test('setActivePresenterPageAt ignores empty or out-of-range navigation', () => {
  const emptySession = { ...createPresenterSession(), pages: [], activePageId: null };
  const session = addPresenterPage(createPresenterSession());

  assert.equal(setActivePresenterPageAt(emptySession, 0), emptySession);
  assert.equal(setActivePresenterPageAt(session, -1), session);
  assert.equal(setActivePresenterPageAt(session, session.pages.length), session);
});

test('setActivePresenterPage ignores unknown page ids', () => {
  const session = createPresenterSession();
  const next = setActivePresenterPage(session, 'missing');

  assert.equal(next.activePageId, session.activePageId);
});

test('createPresenterPage accepts automatic imported title later without coupling to CMS', () => {
  const page = createPresenterPage({ title: 'Vraag 2' });

  assert.equal(page.title, 'Vraag 2');
  assert.equal(page.source, null);
});

test('createPresenterPage clones nested override values', () => {
  const background = { kind: 'image', src: 'slide.png', meta: { page: 1 } };
  const strokes = [{ id: 'stroke-1', points: [{ x: 1, y: 2 }] }];
  const objects = [{ id: 'object-1', type: 'rectangle', style: { color: '#111827' } }];
  const source = { kind: 'imported-slide', ref: { deckId: 'deck-1' } };
  const page = createPresenterPage({ background, strokes, objects, source });

  background.kind = 'white';
  background.meta.page = 2;
  strokes[0].points[0].x = 99;
  strokes.push({ id: 'stroke-2' });
  objects[0].style.color = '#ffffff';
  objects.push({ id: 'object-2' });
  source.ref.deckId = 'deck-2';

  assert.deepEqual(page.background, { kind: 'image', src: 'slide.png', meta: { page: 1 } });
  assert.deepEqual(page.strokes, [{ id: 'stroke-1', points: [{ x: 1, y: 2 }] }]);
  assert.deepEqual(page.objects, [{ id: 'object-1', type: 'rectangle', style: { color: '#111827' } }]);
  assert.deepEqual(page.source, { kind: 'imported-slide', ref: { deckId: 'deck-1' } });
});
