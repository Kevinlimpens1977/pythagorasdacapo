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
  addStrokeToPresenterPage,
  removeStrokeFromPresenterPage,
  addObjectToPresenterPage,
  deleteObjectFromPresenterPage,
  updatePresenterPageBackground
} from './presenterModel.js';

test('createPresenterSession starts with one white page', () => {
  const session = createPresenterSession();

  assert.equal(session.pages.length, 1);
  assert.equal(session.activePageId, session.pages[0].id);
  assert.equal(session.pages[0].title, 'Pagina 1');
  assert.equal(session.pages[0].background.kind, 'white');
  assert.deepEqual(session.pages[0].strokes, []);
  assert.deepEqual(session.pages[0].objects, []);
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
    selectedObjectId: 'object-1'
  };
  const next = deleteObjectFromPresenterPage(session, page.id, 'object-1');

  assert.equal(next.dirty, true);
  assert.equal(next.selectedObjectId, null);
  assert.deepEqual(next.pages[0].objects, [{ id: 'object-2', type: 'ellipse', x: 30, y: 40 }]);
  assert.notEqual(next.pages[0], page);
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
