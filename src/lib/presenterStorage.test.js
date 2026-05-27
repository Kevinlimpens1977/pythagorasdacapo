import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PRESENTER_STORAGE_KEY,
  clearPresenterRecoveryState,
  hasRecoverablePresenterState,
  loadPresenterRecoveryState,
  savePresenterRecoveryState
} from './presenterStorage.js';

const createFakeStorage = () => {
  const values = new Map();

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    values
  };
};

const createCleanSession = (overrides = {}) => ({
  version: 1,
  activePageId: 'page-1',
  pages: [
    {
      id: 'page-1',
      strokes: [],
      objects: []
    }
  ],
  dirty: false,
  ...overrides
});

test('savePresenterRecoveryState writes serialized session', () => {
  const storage = createFakeStorage();
  const session = createCleanSession({ dirty: true });

  savePresenterRecoveryState(storage, session);

  const saved = JSON.parse(storage.getItem(PRESENTER_STORAGE_KEY));

  assert.equal(typeof saved.savedAt, 'string');
  assert.deepEqual(saved.session, session);
  assert.doesNotThrow(() => new Date(saved.savedAt).toISOString());
});

test('savePresenterRecoveryState no-ops for clean session', () => {
  const storage = createFakeStorage();

  savePresenterRecoveryState(storage, createCleanSession());

  assert.equal(storage.getItem(PRESENTER_STORAGE_KEY), null);
});

test('savePresenterRecoveryState no-ops without storage', () => {
  assert.doesNotThrow(() => savePresenterRecoveryState(undefined, createCleanSession({ dirty: true })));
});

test('savePresenterRecoveryState no-ops when setItem throws', () => {
  const storage = {
    setItem: () => {
      throw new Error('storage blocked');
    }
  };

  assert.doesNotThrow(() => savePresenterRecoveryState(storage, createCleanSession({ dirty: true })));
});

test('loadPresenterRecoveryState returns saved session', () => {
  const storage = createFakeStorage();
  const session = createCleanSession({ dirty: true });

  storage.setItem(PRESENTER_STORAGE_KEY, JSON.stringify({
    savedAt: '2026-05-27T10:00:00.000Z',
    session
  }));

  assert.deepEqual(loadPresenterRecoveryState(storage), session);
});

test('loadPresenterRecoveryState returns null without storage', () => {
  assert.equal(loadPresenterRecoveryState(), null);
});

test('loadPresenterRecoveryState returns null when no item exists', () => {
  assert.equal(loadPresenterRecoveryState(createFakeStorage()), null);
});

test('loadPresenterRecoveryState returns null when getItem throws', () => {
  const storage = {
    getItem: () => {
      throw new Error('storage blocked');
    }
  };

  assert.equal(loadPresenterRecoveryState(storage), null);
});

test('loadPresenterRecoveryState returns null when getItem is missing', () => {
  assert.equal(loadPresenterRecoveryState({}), null);
});

test('loadPresenterRecoveryState ignores invalid JSON', () => {
  const storage = createFakeStorage();
  storage.setItem(PRESENTER_STORAGE_KEY, '{invalid json');

  assert.equal(loadPresenterRecoveryState(storage), null);
});

test('loadPresenterRecoveryState no-ops for malformed session shape', () => {
  const storage = createFakeStorage();
  storage.setItem(PRESENTER_STORAGE_KEY, JSON.stringify({
    savedAt: '2026-05-27T10:00:00.000Z',
    session: {
      version: 2,
      pages: []
    }
  }));

  assert.equal(loadPresenterRecoveryState(storage), null);

  storage.setItem(PRESENTER_STORAGE_KEY, JSON.stringify({
    savedAt: '2026-05-27T10:00:00.000Z',
    session: {
      version: 1,
      pages: null
    }
  }));

  assert.equal(loadPresenterRecoveryState(storage), null);
});

test('hasRecoverablePresenterState requires dirty pages or content', () => {
  assert.equal(hasRecoverablePresenterState(), false);
  assert.equal(hasRecoverablePresenterState(createCleanSession()), false);
  assert.equal(hasRecoverablePresenterState(createCleanSession({ dirty: true })), true);
});

test('hasRecoverablePresenterState treats page strokes as recoverable even when clean', () => {
  const session = createCleanSession({
    pages: [
      {
        id: 'page-1',
        strokes: [{ id: 'stroke-1', points: [] }],
        objects: []
      }
    ]
  });

  assert.equal(hasRecoverablePresenterState(session), true);
});

test('hasRecoverablePresenterState treats page objects as recoverable even when clean', () => {
  const session = createCleanSession({
    pages: [
      {
        id: 'page-1',
        strokes: [],
        objects: [{ id: 'object-1', type: 'rectangle' }]
      }
    ]
  });

  assert.equal(hasRecoverablePresenterState(session), true);
});

test('clearPresenterRecoveryState removes recovery data', () => {
  const storage = createFakeStorage();
  storage.setItem(PRESENTER_STORAGE_KEY, 'saved');

  clearPresenterRecoveryState(storage);

  assert.equal(storage.getItem(PRESENTER_STORAGE_KEY), null);
});

test('clearPresenterRecoveryState no-ops without storage', () => {
  assert.doesNotThrow(() => clearPresenterRecoveryState());
});

test('clearPresenterRecoveryState no-ops when removeItem throws', () => {
  const storage = {
    removeItem: () => {
      throw new Error('storage blocked');
    }
  };

  assert.doesNotThrow(() => clearPresenterRecoveryState(storage));
});

test('clearPresenterRecoveryState no-ops when removeItem is missing', () => {
  assert.doesNotThrow(() => clearPresenterRecoveryState({}));
});
