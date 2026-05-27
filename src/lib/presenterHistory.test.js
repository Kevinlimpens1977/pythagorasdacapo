import test from 'node:test';
import assert from 'node:assert/strict';
import { createPresenterSession, addPresenterPage } from './presenterModel.js';
import {
  createPresenterHistory,
  recordPresenterPageState,
  undoPresenterPage,
  redoPresenterPage
} from './presenterHistory.js';

test('recordPresenterPageState stores undo state per page', () => {
  const session = createPresenterSession();
  const page = session.pages[0];
  const history = recordPresenterPageState(createPresenterHistory(), page.id, page);

  assert.equal(history.byPageId[page.id].undo.length, 1);
  assert.equal(history.byPageId[page.id].redo.length, 0);
});

test('undoPresenterPage restores previous page without touching another page', () => {
  const session = addPresenterPage(createPresenterSession());
  const pageOne = session.pages[0];
  const pageTwo = session.pages[1];
  const changedPageOne = { ...pageOne, strokes: [{ id: 'stroke-1' }] };
  const history = recordPresenterPageState(createPresenterHistory(), pageOne.id, pageOne);
  const result = undoPresenterPage(history, pageOne.id, changedPageOne);

  assert.equal(result.page.strokes.length, 0);
  assert.equal(result.history.byPageId[pageOne.id].redo.length, 1);
  assert.equal(result.history.byPageId[pageTwo.id], undefined);
});

test('redoPresenterPage reapplies the undone page', () => {
  const session = createPresenterSession();
  const page = session.pages[0];
  const changed = { ...page, objects: [{ id: 'object-1' }] };
  const history = recordPresenterPageState(createPresenterHistory(), page.id, page);
  const undone = undoPresenterPage(history, page.id, changed);
  const redone = redoPresenterPage(undone.history, page.id, undone.page);

  assert.equal(redone.page.objects.length, 1);
});
