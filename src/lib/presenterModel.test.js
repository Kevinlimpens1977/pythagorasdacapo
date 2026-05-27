import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createPresenterSession,
  addPresenterPage,
  duplicatePresenterPage,
  deletePresenterPage,
  setActivePresenterPage,
  getActivePresenterPage,
  createPresenterPage
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
