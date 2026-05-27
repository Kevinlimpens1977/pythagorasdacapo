# Presenter V1a Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Presenter V1a Core: a digibord-first blank board with pages, exact pointer coordinates, pen/highlighter/geometry drawing, square grids, shapes, math instruments, page controls, local recovery, and a disabled path toward later HELIX content import.

**Architecture:** Keep Presenter isolated from the existing Digibord/contentblock presenter. Add a new `/admin/presenter` route and a focused `src/components/presenter/` feature folder. Put all serializable board state, grid math, pointer transforms, undo/redo, and recovery in pure `src/lib/presenter*.js` utilities first, then layer React components on top.

**Tech Stack:** React 19, Vite, Tailwind CSS v4, React Router, lucide-react, native Pointer Events, SVG for shapes/geometry/measurements, canvas/SVG hybrid for pen strokes, browser `sessionStorage` for temporary local recovery, Node test runner for pure utility tests.

---

## Scope Boundary

This plan implements **V1a only** from `docs/superpowers/specs/2026-05-27-presenter-design.md`.

Included:

- Admin navigation item `Presenter`.
- Route `/admin/presenter`.
- Blank Presenter board inside the existing HELIX admin shell.
- Page model with vertical scroll, add/delete/duplicate, previous/next.
- Per-page undo/redo.
- Internal coordinate model and pointer-to-board conversion.
- Pen, highlighter, geometry pen, gum.
- White/lines/grid backgrounds with square grid and snap-to-grid.
- Shapes and math objects.
- Temporary math instruments.
- Auto-hide bottom toolbar with large touch popovers.
- Right-side touch scrollstrip.
- Textual page overview.
- Local session recovery.
- Disabled `Lesstof` and `Vraag` affordances.

Excluded:

- Text tool.
- HELIX paragraph import.
- Question windows.
- Media import.
- Rendered thumbnails.
- Firebase session persistence.
- Export.
- Timer, spotlight, screen curtain.

## File Structure

Create:

- `src/lib/presenterModel.js`  
  Serializable Presenter state factories and reducers: pages, active page, tools, page mutations, object mutations.

- `src/lib/presenterModel.test.js`  
  Unit tests for pages, delete confirmation helpers, active page transitions, and object deletion.

- `src/lib/presenterHistory.js`  
  Per-page undo/redo helpers.

- `src/lib/presenterHistory.test.js`  
  Unit tests for undo/redo isolation per page.

- `src/lib/presenterGeometry.js`  
  Coordinate transforms, grid sizing, square-grid CSS/SVG values, snap-to-grid, distance/angle helpers.

- `src/lib/presenterGeometry.test.js`  
  Unit tests for exact coordinate mapping, square grids, snap behavior, distance and angle calculations.

- `src/lib/presenterStorage.js`  
  Session storage serialization, validation, and recovery prompt helpers.

- `src/lib/presenterStorage.test.js`  
  Unit tests with a fake storage object.

- `src/lib/presenterObjects.js`  
  Shape/object factories and rendering metadata: rectangle, circle, line, arrow, triangle, polygon, axes, table grid, angle marker.

- `src/lib/presenterObjects.test.js`  
  Unit tests for object defaults, rotatability, and duplicate support.

- `src/pages/AdminPresenterPage.jsx`  
  Route page that hosts Presenter V1a inside the admin shell.

- `src/components/presenter/PresenterShell.jsx`  
  Main Presenter controller: state, page viewport, toolbar, popovers, keyboard shortcuts, fullscreen, recovery.

- `src/components/presenter/PresenterBoard.jsx`  
  Board viewport, page surface, background overlays, pointer event bridge, right scrollstrip.

- `src/components/presenter/PresenterBackground.jsx`  
  White/lines/grid visual background. Grid must remain square.

- `src/components/presenter/PresenterInkLayer.jsx`  
  Draws highlighter and pen strokes in fixed layer order.

- `src/components/presenter/PresenterObjectLayer.jsx`  
  Draws shape and math objects with selection handles.

- `src/components/presenter/PresenterToolbar.jsx`  
  Auto-hide bottom toolbar, fixed button order, pinning, category popovers.

- `src/components/presenter/PresenterPagePanel.jsx`  
  Textual page overview, add/delete/duplicate controls.

- `src/components/presenter/PresenterInstrumentOverlay.jsx`  
  Temporary liniaal/geodriehoek/passer/gradenboog overlays and actions.

- `src/components/presenter/PresenterRecoveryPrompt.jsx`  
  "Vorige Presenter-sessie herstellen?" prompt.

Modify:

- `src/App.jsx`  
  Add `/admin/presenter` route.

- `src/lib/adminWorkspaceNav.js`  
  Add `Presenter` workspace and route prefix.

- `src/lib/adminWorkspaceNav.test.js`  
  Add Presenter routing tests.

- `src/components/layout/AppShell.jsx`  
  Add Presenter icon mapping.

Optional if needed:

- `src/index.css` or existing global CSS file  
  Add a small Presenter section only for CSS that cannot be expressed ergonomically with Tailwind.

---

## Task 1: Navigation And Route Skeleton

**Files:**

- Create: `src/pages/AdminPresenterPage.jsx`
- Modify: `src/App.jsx`
- Modify: `src/lib/adminWorkspaceNav.js`
- Modify: `src/lib/adminWorkspaceNav.test.js`
- Modify: `src/components/layout/AppShell.jsx`

- [ ] **Step 1: Extend admin workspace tests first**

Add the Presenter expectations to `src/lib/adminWorkspaceNav.test.js`.

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ADMIN_WORKSPACES,
  getAdminWorkspaceForPath,
  isAdminWorkspaceActive
} from './adminWorkspaceNav.js';

test('getAdminWorkspaceForPath groups presenter under its own workspace', () => {
  assert.equal(getAdminWorkspaceForPath('/admin/presenter'), 'presenter');
  assert.equal(getAdminWorkspaceForPath('/admin/presenter/session'), 'presenter');
});

test('presenter workspace is active only for presenter routes', () => {
  const presenter = ADMIN_WORKSPACES.find((workspace) => workspace.id === 'presenter');

  assert.ok(presenter);
  assert.equal(isAdminWorkspaceActive(presenter, '/admin/presenter'), true);
  assert.equal(isAdminWorkspaceActive(presenter, '/admin/lesstof'), false);
});
```

- [ ] **Step 2: Run route tests and verify failure**

Run:

```bash
node --test src/lib/adminWorkspaceNav.test.js
```

Expected: FAIL because `presenter` workspace does not exist.

- [ ] **Step 3: Add Presenter workspace**

Modify `src/lib/adminWorkspaceNav.js` by inserting Presenter between `spellen` and `beheer`.

```js
  {
    id: 'presenter',
    label: 'Presenter',
    path: '/admin/presenter',
    routePrefixes: ['/admin/presenter']
  },
```

- [ ] **Step 4: Add route page skeleton**

Create `src/pages/AdminPresenterPage.jsx`.

```jsx
export default function AdminPresenterPage() {
  return (
    <section className="flex min-h-[calc(100vh-5rem)] flex-col bg-slate-100">
      <div className="flex flex-1 items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 text-center shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Presenter</p>
          <h1 className="mt-2 text-3xl font-black text-[var(--helix-navy)]">Digibord Core</h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-[var(--helix-muted)]">
            Presenter V1a wordt hier opgebouwd als leeg digibord met pen, ruitjes, vormen en meetinstrumenten.
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Register route**

Modify `src/App.jsx`.

```jsx
import AdminPresenterPage from './pages/AdminPresenterPage';
```

Add inside the admin routes:

```jsx
        <Route path="admin/presenter" element={
          <PrivateRoute requireAdmin={true}>
            <AdminPresenterPage />
          </PrivateRoute>
        } />
```

- [ ] **Step 6: Add navigation icon**

Modify `src/components/layout/AppShell.jsx`.

```jsx
import { BarChart3, BookOpen, Gamepad2, LogOut, Presentation, SettingsIcon, User, Users } from 'lucide-react';
```

Add to `workspaceIcons`:

```js
  presenter: Presentation,
```

- [ ] **Step 7: Verify and commit**

Run:

```bash
node --test src/lib/adminWorkspaceNav.test.js
npx eslint src/App.jsx src/pages/AdminPresenterPage.jsx src/lib/adminWorkspaceNav.js src/lib/adminWorkspaceNav.test.js src/components/layout/AppShell.jsx
npm run build
```

Expected: tests pass, lint passes for touched files, build succeeds.

Commit:

```bash
git add src/App.jsx src/pages/AdminPresenterPage.jsx src/lib/adminWorkspaceNav.js src/lib/adminWorkspaceNav.test.js src/components/layout/AppShell.jsx
git commit -m "feat: add presenter admin route"
```

---

## Task 2: Presenter State Model

**Files:**

- Create: `src/lib/presenterModel.js`
- Create: `src/lib/presenterModel.test.js`

- [ ] **Step 1: Write model tests**

Create `src/lib/presenterModel.test.js`.

```js
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
```

- [ ] **Step 2: Run tests and verify failure**

Run:

```bash
node --test src/lib/presenterModel.test.js
```

Expected: FAIL because `presenterModel.js` does not exist.

- [ ] **Step 3: Implement serializable model**

Create `src/lib/presenterModel.js`.

```js
const DEFAULT_BOARD_WIDTH = 1920;
const DEFAULT_PAGE_HEIGHT = 1400;

const createId = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const cloneWithFreshIds = (items, prefix) =>
  items.map((item) => ({
    ...structuredClone(item),
    id: createId(prefix)
  }));

export const createPresenterPage = (overrides = {}) => ({
  id: overrides.id || createId('presenter-page'),
  title: overrides.title || 'Pagina 1',
  width: overrides.width || DEFAULT_BOARD_WIDTH,
  height: overrides.height || DEFAULT_PAGE_HEIGHT,
  background: overrides.background || {
    kind: 'white',
    gridSize: 96
  },
  strokes: overrides.strokes || [],
  objects: overrides.objects || [],
  source: overrides.source || null
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

  const activePageId = session.activePageId === pageId ? pages[Math.max(0, pages.length - 1)].id : session.activePageId;

  return {
    ...session,
    pages,
    activePageId,
    selectedObjectId: null,
    dirty: true
  };
};
```

- [ ] **Step 4: Verify and commit**

Run:

```bash
node --test src/lib/presenterModel.test.js
npx eslint src/lib/presenterModel.js src/lib/presenterModel.test.js
```

Expected: pass.

Commit:

```bash
git add src/lib/presenterModel.js src/lib/presenterModel.test.js
git commit -m "feat: add presenter session model"
```

---

## Task 3: Geometry, Grid, And Pointer Mapping

**Files:**

- Create: `src/lib/presenterGeometry.js`
- Create: `src/lib/presenterGeometry.test.js`

- [ ] **Step 1: Write geometry tests**

Create `src/lib/presenterGeometry.test.js`.

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mapClientPointToBoard,
  getBoardScale,
  snapPointToGrid,
  getGridLineStyle,
  measureDistance,
  measureAngleDegrees
} from './presenterGeometry.js';

test('getBoardScale uses uniform scale so grid squares stay square', () => {
  assert.equal(getBoardScale({ viewportWidth: 960, boardWidth: 1920 }), 0.5);
  assert.equal(getBoardScale({ viewportWidth: 1440, boardWidth: 1920 }), 0.75);
});

test('mapClientPointToBoard maps pointer coordinates into internal board coordinates', () => {
  const point = mapClientPointToBoard({
    clientX: 500,
    clientY: 340,
    rect: { left: 20, top: 40 },
    scrollTop: 120,
    scale: 0.5
  });

  assert.deepEqual(point, { x: 960, y: 840 });
});

test('snapPointToGrid only snaps when grid is enabled', () => {
  assert.deepEqual(snapPointToGrid({ x: 143, y: 151 }, { enabled: true, gridSize: 48 }), { x: 144, y: 144 });
  assert.deepEqual(snapPointToGrid({ x: 143, y: 151 }, { enabled: false, gridSize: 48 }), { x: 143, y: 151 });
});

test('getGridLineStyle returns equal horizontal and vertical size', () => {
  assert.deepEqual(getGridLineStyle({ gridSize: 96, scale: 0.5 }), {
    backgroundSize: '48px 48px',
    lineSize: 48
  });
});

test('measureDistance returns Euclidean distance', () => {
  assert.equal(measureDistance({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
});

test('measureAngleDegrees returns positive degrees between two rays', () => {
  const angle = measureAngleDegrees({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 });

  assert.equal(angle, 90);
});
```

- [ ] **Step 2: Run tests and verify failure**

Run:

```bash
node --test src/lib/presenterGeometry.test.js
```

Expected: FAIL because `presenterGeometry.js` does not exist.

- [ ] **Step 3: Implement geometry helpers**

Create `src/lib/presenterGeometry.js`.

```js
export const getBoardScale = ({ viewportWidth, boardWidth }) => {
  if (!viewportWidth || !boardWidth) return 1;
  return viewportWidth / boardWidth;
};

export const mapClientPointToBoard = ({ clientX, clientY, rect, scrollTop = 0, scale = 1 }) => ({
  x: Math.round((clientX - rect.left) / scale),
  y: Math.round((clientY - rect.top + scrollTop) / scale)
});

export const snapValueToGrid = (value, gridSize) =>
  Math.round(value / gridSize) * gridSize;

export const snapPointToGrid = (point, { enabled, gridSize }) => {
  if (!enabled || !gridSize) return point;

  return {
    x: snapValueToGrid(point.x, gridSize),
    y: snapValueToGrid(point.y, gridSize)
  };
};

export const getGridLineStyle = ({ gridSize, scale }) => {
  const lineSize = Math.max(1, Math.round(gridSize * scale));

  return {
    backgroundSize: `${lineSize}px ${lineSize}px`,
    lineSize
  };
};

export const measureDistance = (a, b) =>
  Math.hypot(b.x - a.x, b.y - a.y);

export const measureAngleDegrees = (origin, a, b) => {
  const angleA = Math.atan2(a.y - origin.y, a.x - origin.x);
  const angleB = Math.atan2(b.y - origin.y, b.x - origin.x);
  const raw = Math.abs((angleB - angleA) * 180 / Math.PI);
  const normalized = raw > 180 ? 360 - raw : raw;

  return Math.round(normalized);
};
```

- [ ] **Step 4: Verify and commit**

Run:

```bash
node --test src/lib/presenterGeometry.test.js
npx eslint src/lib/presenterGeometry.js src/lib/presenterGeometry.test.js
```

Expected: pass.

Commit:

```bash
git add src/lib/presenterGeometry.js src/lib/presenterGeometry.test.js
git commit -m "feat: add presenter geometry helpers"
```

---

## Task 4: Per-Page Undo/Redo

**Files:**

- Create: `src/lib/presenterHistory.js`
- Create: `src/lib/presenterHistory.test.js`

- [ ] **Step 1: Write history tests**

Create `src/lib/presenterHistory.test.js`.

```js
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
```

- [ ] **Step 2: Run tests and verify failure**

Run:

```bash
node --test src/lib/presenterHistory.test.js
```

Expected: FAIL because `presenterHistory.js` does not exist.

- [ ] **Step 3: Implement history**

Create `src/lib/presenterHistory.js`.

```js
const MAX_HISTORY_ITEMS = 80;

const clonePage = (page) => structuredClone(page);

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
```

- [ ] **Step 4: Verify and commit**

Run:

```bash
node --test src/lib/presenterHistory.test.js src/lib/presenterModel.test.js
npx eslint src/lib/presenterHistory.js src/lib/presenterHistory.test.js
```

Commit:

```bash
git add src/lib/presenterHistory.js src/lib/presenterHistory.test.js
git commit -m "feat: add presenter page history"
```

---

## Task 5: Presenter Objects And Shape Metadata

**Files:**

- Create: `src/lib/presenterObjects.js`
- Create: `src/lib/presenterObjects.test.js`

- [ ] **Step 1: Write object tests**

Create `src/lib/presenterObjects.test.js`.

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createPresenterObject,
  canRotatePresenterObject,
  canDuplicatePresenterObject,
  getPresenterObjectLabel
} from './presenterObjects.js';

test('createPresenterObject creates rectangle defaults', () => {
  const object = createPresenterObject('rectangle', { x: 10, y: 20 });

  assert.equal(object.type, 'rectangle');
  assert.equal(object.x, 10);
  assert.equal(object.y, 20);
  assert.equal(object.width, 240);
  assert.equal(object.height, 160);
  assert.equal(object.rotation, 0);
});

test('all v1a shape types can be created', () => {
  const types = ['rectangle', 'ellipse', 'line', 'arrow', 'triangle', 'polygon', 'axes', 'table', 'angle'];

  for (const type of types) {
    assert.equal(createPresenterObject(type).type, type);
  }
});

test('presenter v1a objects are rotatable except future content/question objects', () => {
  assert.equal(canRotatePresenterObject({ type: 'rectangle' }), true);
  assert.equal(canRotatePresenterObject({ type: 'lessonBlock' }), false);
  assert.equal(canRotatePresenterObject({ type: 'questionWindow' }), false);
});

test('only shapes and future text are duplicatable', () => {
  assert.equal(canDuplicatePresenterObject({ type: 'rectangle' }), true);
  assert.equal(canDuplicatePresenterObject({ type: 'text' }), true);
  assert.equal(canDuplicatePresenterObject({ type: 'lessonBlock' }), false);
});

test('getPresenterObjectLabel returns readable Dutch labels', () => {
  assert.equal(getPresenterObjectLabel({ type: 'axes' }), 'Assenstelsel');
  assert.equal(getPresenterObjectLabel({ type: 'table' }), 'Tabel/raster');
});
```

- [ ] **Step 2: Run tests and verify failure**

Run:

```bash
node --test src/lib/presenterObjects.test.js
```

Expected: FAIL because `presenterObjects.js` does not exist.

- [ ] **Step 3: Implement object metadata**

Create `src/lib/presenterObjects.js`.

```js
const createId = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const DEFAULTS = {
  rectangle: { width: 240, height: 160 },
  ellipse: { width: 220, height: 160 },
  line: { width: 260, height: 0 },
  arrow: { width: 260, height: 0 },
  triangle: { width: 240, height: 180 },
  polygon: { width: 240, height: 180, points: [{ x: 0, y: 180 }, { x: 120, y: 0 }, { x: 240, y: 180 }] },
  axes: { width: 360, height: 260 },
  table: { width: 360, height: 240, rows: 4, columns: 5 },
  angle: { width: 180, height: 120, angleDegrees: 90 }
};

const LABELS = {
  rectangle: 'Rechthoek',
  ellipse: 'Cirkel/ovaal',
  line: 'Lijn',
  arrow: 'Pijl',
  triangle: 'Driehoek',
  polygon: 'Veelhoek',
  axes: 'Assenstelsel',
  table: 'Tabel/raster',
  angle: 'Hoekmarkering',
  text: 'Tekst',
  lessonBlock: 'Lesblok',
  questionWindow: 'Vraag'
};

const ROTATABLE_TYPES = new Set(['rectangle', 'ellipse', 'line', 'arrow', 'triangle', 'polygon', 'axes', 'table', 'angle']);
const DUPLICATABLE_TYPES = new Set([...ROTATABLE_TYPES, 'text']);

export const createPresenterObject = (type, overrides = {}) => {
  const defaults = DEFAULTS[type] || DEFAULTS.rectangle;

  return {
    id: overrides.id || createId('object'),
    type,
    x: overrides.x || 0,
    y: overrides.y || 0,
    width: overrides.width || defaults.width,
    height: overrides.height ?? defaults.height,
    rotation: overrides.rotation || 0,
    strokeColor: overrides.strokeColor || '#111827',
    fillColor: overrides.fillColor || 'transparent',
    strokeWidth: overrides.strokeWidth || 4,
    label: overrides.label || '',
    showLabel: overrides.showLabel || false,
    ...defaults,
    ...overrides
  };
};

export const canRotatePresenterObject = (object) =>
  ROTATABLE_TYPES.has(object?.type);

export const canDuplicatePresenterObject = (object) =>
  DUPLICATABLE_TYPES.has(object?.type);

export const getPresenterObjectLabel = (object) =>
  LABELS[object?.type] || 'Object';
```

- [ ] **Step 4: Verify and commit**

Run:

```bash
node --test src/lib/presenterObjects.test.js
npx eslint src/lib/presenterObjects.js src/lib/presenterObjects.test.js
```

Commit:

```bash
git add src/lib/presenterObjects.js src/lib/presenterObjects.test.js
git commit -m "feat: add presenter shape metadata"
```

---

## Task 6: Local Recovery Storage

**Files:**

- Create: `src/lib/presenterStorage.js`
- Create: `src/lib/presenterStorage.test.js`

- [ ] **Step 1: Write storage tests**

Create `src/lib/presenterStorage.test.js`.

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createPresenterSession } from './presenterModel.js';
import {
  PRESENTER_STORAGE_KEY,
  savePresenterRecoveryState,
  loadPresenterRecoveryState,
  clearPresenterRecoveryState,
  hasRecoverablePresenterState
} from './presenterStorage.js';

const createFakeStorage = () => {
  const map = new Map();
  return {
    getItem: (key) => map.get(key) || null,
    setItem: (key, value) => map.set(key, value),
    removeItem: (key) => map.delete(key),
    has: (key) => map.has(key)
  };
};

test('savePresenterRecoveryState writes serialized session', () => {
  const storage = createFakeStorage();
  const session = { ...createPresenterSession(), dirty: true };

  savePresenterRecoveryState(storage, session);

  assert.equal(storage.has(PRESENTER_STORAGE_KEY), true);
});

test('loadPresenterRecoveryState returns saved session', () => {
  const storage = createFakeStorage();
  const session = { ...createPresenterSession(), dirty: true };

  savePresenterRecoveryState(storage, session);

  assert.equal(loadPresenterRecoveryState(storage).version, 1);
});

test('loadPresenterRecoveryState ignores invalid JSON', () => {
  const storage = createFakeStorage();
  storage.setItem(PRESENTER_STORAGE_KEY, '{not-json');

  assert.equal(loadPresenterRecoveryState(storage), null);
});

test('hasRecoverablePresenterState requires dirty pages or content', () => {
  const clean = createPresenterSession();
  const dirty = { ...clean, dirty: true };

  assert.equal(hasRecoverablePresenterState(clean), false);
  assert.equal(hasRecoverablePresenterState(dirty), true);
});

test('clearPresenterRecoveryState removes recovery data', () => {
  const storage = createFakeStorage();
  savePresenterRecoveryState(storage, { ...createPresenterSession(), dirty: true });
  clearPresenterRecoveryState(storage);

  assert.equal(storage.has(PRESENTER_STORAGE_KEY), false);
});
```

- [ ] **Step 2: Run tests and verify failure**

Run:

```bash
node --test src/lib/presenterStorage.test.js
```

Expected: FAIL because `presenterStorage.js` does not exist.

- [ ] **Step 3: Implement recovery storage**

Create `src/lib/presenterStorage.js`.

```js
export const PRESENTER_STORAGE_KEY = 'helix.presenter.recovery.v1';

export const hasRecoverablePresenterState = (session) => {
  if (!session) return false;
  if (session.dirty) return true;

  return session.pages?.some((page) => page.strokes?.length > 0 || page.objects?.length > 0) || false;
};

export const savePresenterRecoveryState = (storage, session) => {
  if (!storage || !hasRecoverablePresenterState(session)) return;

  storage.setItem(PRESENTER_STORAGE_KEY, JSON.stringify({
    savedAt: new Date().toISOString(),
    session
  }));
};

export const loadPresenterRecoveryState = (storage) => {
  if (!storage) return null;

  try {
    const raw = storage.getItem(PRESENTER_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (parsed?.session?.version !== 1 || !Array.isArray(parsed.session.pages)) return null;

    return parsed.session;
  } catch {
    return null;
  }
};

export const clearPresenterRecoveryState = (storage) => {
  storage?.removeItem(PRESENTER_STORAGE_KEY);
};
```

- [ ] **Step 4: Verify and commit**

Run:

```bash
node --test src/lib/presenterStorage.test.js
npx eslint src/lib/presenterStorage.js src/lib/presenterStorage.test.js
```

Commit:

```bash
git add src/lib/presenterStorage.js src/lib/presenterStorage.test.js
git commit -m "feat: add presenter local recovery"
```

---

## Task 7: Presenter Shell And Board Rendering Skeleton

**Files:**

- Create: `src/components/presenter/PresenterShell.jsx`
- Create: `src/components/presenter/PresenterBoard.jsx`
- Create: `src/components/presenter/PresenterBackground.jsx`
- Modify: `src/pages/AdminPresenterPage.jsx`

- [ ] **Step 1: Create Presenter background component**

Create `src/components/presenter/PresenterBackground.jsx`.

```jsx
import { getGridLineStyle } from '../../lib/presenterGeometry';

export default function PresenterBackground({ background, scale }) {
  if (background.kind === 'lines') {
    const lineSize = Math.round((background.gridSize || 96) * scale);
    return (
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(148,163,184,0.36) 1px, transparent 1px)',
          backgroundSize: `100% ${lineSize}px`
        }}
      />
    );
  }

  if (background.kind === 'grid') {
    const { backgroundSize } = getGridLineStyle({ gridSize: background.gridSize || 96, scale });
    return (
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(148,163,184,0.34) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(148,163,184,0.34) 1px, transparent 1px)'
          ].join(', '),
          backgroundSize
        }}
      />
    );
  }

  return null;
}
```

- [ ] **Step 2: Create board component**

Create `src/components/presenter/PresenterBoard.jsx`.

```jsx
import { useMemo, useRef } from 'react';
import PresenterBackground from './PresenterBackground';
import { getBoardScale } from '../../lib/presenterGeometry';

export default function PresenterBoard({ page, viewportWidth = 1920 }) {
  const scrollRef = useRef(null);
  const scale = useMemo(
    () => getBoardScale({ viewportWidth, boardWidth: page.width }),
    [viewportWidth, page.width]
  );

  return (
    <div className="relative flex flex-1 overflow-hidden bg-slate-200">
      <div
        ref={scrollRef}
        className="presenter-scroll-area relative flex-1 overflow-y-auto overflow-x-hidden"
        style={{ touchAction: 'pan-y' }}
      >
        <div
          className="relative mx-auto bg-white shadow-[0_18px_45px_rgba(15,23,42,0.16)]"
          style={{
            width: `${page.width * scale}px`,
            height: `${page.height * scale}px`
          }}
        >
          <PresenterBackground background={page.background} scale={scale} />
          <div className="absolute left-8 top-8 rounded-xl bg-white/90 px-4 py-2 text-sm font-black text-slate-500 shadow-sm">
            {page.title}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create shell component**

Create `src/components/presenter/PresenterShell.jsx`.

```jsx
import { useMemo, useState } from 'react';
import PresenterBoard from './PresenterBoard';
import {
  addPresenterPage,
  createPresenterSession,
  getActivePresenterPage,
  setActivePresenterPage
} from '../../lib/presenterModel';

export default function PresenterShell() {
  const [session, setSession] = useState(() => createPresenterSession());
  const activePage = useMemo(() => getActivePresenterPage(session), [session]);
  const activeIndex = session.pages.findIndex((page) => page.id === session.activePageId);

  const goToOffset = (offset) => {
    const nextPage = session.pages[activeIndex + offset];
    if (nextPage) {
      setSession((current) => setActivePresenterPage(current, nextPage.id));
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-5rem)] flex-col bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-3 text-white">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Presenter</p>
          <h1 className="text-lg font-black">Digibord Core</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-xl bg-slate-800 px-3 py-2 text-sm font-bold" onClick={() => goToOffset(-1)}>
            Vorige
          </button>
          <span className="min-w-24 text-center text-sm font-black">
            Pagina {activeIndex + 1}/{session.pages.length}
          </span>
          <button className="rounded-xl bg-slate-800 px-3 py-2 text-sm font-bold" onClick={() => goToOffset(1)}>
            Volgende
          </button>
          <button className="rounded-xl bg-white px-3 py-2 text-sm font-black text-slate-950" onClick={() => setSession(addPresenterPage)}>
            + Pagina
          </button>
        </div>
      </div>

      {activePage && <PresenterBoard page={activePage} viewportWidth={1920} />}
    </section>
  );
}
```

- [ ] **Step 4: Use shell in page**

Modify `src/pages/AdminPresenterPage.jsx`.

```jsx
import PresenterShell from '../components/presenter/PresenterShell';

export default function AdminPresenterPage() {
  return <PresenterShell />;
}
```

- [ ] **Step 5: Verify and commit**

Run:

```bash
npx eslint src/pages/AdminPresenterPage.jsx src/components/presenter/PresenterShell.jsx src/components/presenter/PresenterBoard.jsx src/components/presenter/PresenterBackground.jsx
npm run build
```

Manual check:

- Start dev server.
- Open `http://localhost:5174/admin/presenter`.
- Confirm a blank white board appears inside adminshell.
- Confirm `+ Pagina`, `Vorige`, and `Volgende` work.

Commit:

```bash
git add src/pages/AdminPresenterPage.jsx src/components/presenter/PresenterShell.jsx src/components/presenter/PresenterBoard.jsx src/components/presenter/PresenterBackground.jsx
git commit -m "feat: render presenter board shell"
```

---

## Task 8: Toolbar, Page Panel, And Disabled Future Categories

**Files:**

- Create: `src/components/presenter/PresenterToolbar.jsx`
- Create: `src/components/presenter/PresenterPagePanel.jsx`
- Modify: `src/components/presenter/PresenterShell.jsx`

- [ ] **Step 1: Create toolbar component**

Create `src/components/presenter/PresenterToolbar.jsx`.

```jsx
import {
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  Eraser,
  FileText,
  Grid3X3,
  Maximize2,
  MousePointer2,
  PenLine,
  Redo2,
  Shapes,
  Undo2
} from 'lucide-react';

const toolbarCategories = [
  { id: 'pen', label: 'Pen', icon: PenLine },
  { id: 'objects', label: 'Objecten', icon: Shapes },
  { id: 'lesson', label: 'Lesstof', icon: FileText, disabled: true },
  { id: 'background', label: 'Achtergrond', icon: Grid3X3 },
  { id: 'pages', label: "Pagina's", icon: CheckSquare }
];

export default function PresenterToolbar({
  pageLabel,
  activeCategory,
  pinned,
  onTogglePinned,
  onCategory,
  onPrev,
  onNext,
  onUndo,
  onRedo,
  onSelect,
  onFullscreen
}) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center pb-4 transition-transform ${pinned ? '' : 'translate-y-[calc(100%-1.25rem)] hover:translate-y-0'}`}>
      <div className="pointer-events-auto rounded-2xl border border-slate-700 bg-slate-950/96 p-2 text-white shadow-[0_20px_48px_rgba(15,23,42,0.35)]">
        <div className="mb-2 flex justify-center">
          <button className="h-1.5 w-20 rounded-full bg-slate-500" onClick={onTogglePinned} aria-label={pinned ? 'Toolbar losmaken' : 'Toolbar vastzetten'} />
        </div>
        <div className="flex items-center gap-2">
          <button className="presenter-tool-button" onClick={onPrev}><ArrowLeft size={20} /></button>
          <span className="min-w-24 text-center text-sm font-black">{pageLabel}</span>
          <button className="presenter-tool-button" onClick={onNext}><ArrowRight size={20} /></button>
          <button className="presenter-tool-button" onClick={onSelect}><MousePointer2 size={20} /></button>
          <button className="presenter-tool-button" onClick={onUndo}><Undo2 size={20} /></button>
          <button className="presenter-tool-button" onClick={onRedo}><Redo2 size={20} /></button>

          {toolbarCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                disabled={category.disabled}
                onClick={() => onCategory(category.id)}
                className={`flex min-h-12 items-center gap-2 rounded-xl px-3 text-sm font-black transition ${
                  activeCategory === category.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'
                } disabled:cursor-not-allowed disabled:opacity-45`}
              >
                <Icon size={20} />
                <span>{category.label}</span>
              </button>
            );
          })}

          <button className="presenter-tool-button" onClick={onFullscreen}><Maximize2 size={20} /></button>
        </div>
      </div>
    </div>
  );
}
```

Add temporary CSS utility to the global CSS file if no local CSS module is introduced:

```css
.presenter-tool-button {
  min-height: 3rem;
  min-width: 3rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background: rgb(30 41 59);
  color: white;
  font-weight: 900;
}
```

- [ ] **Step 2: Create page panel component**

Create `src/components/presenter/PresenterPagePanel.jsx`.

```jsx
export default function PresenterPagePanel({ pages, activePageId, open, onSelectPage, onAddPage, onDuplicatePage, onDeletePage }) {
  if (!open) return null;

  return (
    <aside className="absolute bottom-24 left-4 top-4 z-20 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-black text-slate-950">Pagina's</h2>
        <button className="rounded-xl bg-slate-950 px-3 py-2 text-sm font-black text-white" onClick={onAddPage}>Nieuw</button>
      </div>
      <div className="space-y-2">
        {pages.map((page, index) => (
          <button
            key={page.id}
            onClick={() => onSelectPage(page.id)}
            className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left ${
              page.id === activePageId ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'
            }`}
          >
            <span>
              <span className="block text-sm font-black text-slate-950">Pagina {index + 1}</span>
              <span className="block text-xs font-bold text-slate-500">{page.title}</span>
            </span>
            <span className="text-xs font-black text-slate-400">{index + 1}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-black text-slate-700" onClick={onDuplicatePage}>Dupliceer</button>
        <button className="rounded-xl bg-red-50 px-3 py-2 text-sm font-black text-red-700" onClick={onDeletePage}>Verwijder</button>
      </div>
    </aside>
  );
}
```

- [ ] **Step 3: Wire toolbar and page panel into shell**

Modify `PresenterShell.jsx` to:

- use `PresenterToolbar`
- use `PresenterPagePanel`
- track `toolbarPinned`
- track `activeCategory`
- track `pagePanelOpen`
- use browser `confirm('Deze pagina verwijderen?')` only for V1a page delete confirmation until a styled modal is added

Core handlers:

```jsx
const [toolbarPinned, setToolbarPinned] = useState(false);
const [activeCategory, setActiveCategory] = useState('pen');
const [pagePanelOpen, setPagePanelOpen] = useState(false);

const handleCategory = (category) => {
  setActiveCategory(category);
  setPagePanelOpen(category === 'pages');
};

const handleDeletePage = () => {
  if (!window.confirm('Deze pagina verwijderen?')) return;
  setSession((current) => deletePresenterPage(current, current.activePageId));
};
```

- [ ] **Step 4: Verify and commit**

Run:

```bash
npx eslint src/components/presenter/PresenterToolbar.jsx src/components/presenter/PresenterPagePanel.jsx src/components/presenter/PresenterShell.jsx
npm run build
```

Manual check:

- Toolbar is at bottom and can be pinned.
- `Lesstof` is disabled.
- Page panel opens from `Pagina's`.
- Delete asks confirmation.

Commit:

```bash
git add src/components/presenter/PresenterToolbar.jsx src/components/presenter/PresenterPagePanel.jsx src/components/presenter/PresenterShell.jsx src/index.css
git commit -m "feat: add presenter toolbar and page panel"
```

---

## Task 9: Ink Capture And Stroke Rendering

**Files:**

- Create: `src/components/presenter/PresenterInkLayer.jsx`
- Modify: `src/components/presenter/PresenterBoard.jsx`
- Modify: `src/components/presenter/PresenterShell.jsx`
- Modify: `src/lib/presenterModel.js`
- Modify: `src/lib/presenterModel.test.js`

- [ ] **Step 1: Add stroke model tests**

Append to `src/lib/presenterModel.test.js`.

```js
import {
  addStrokeToPresenterPage,
  removeStrokeFromPresenterPage
} from './presenterModel.js';

test('addStrokeToPresenterPage appends stroke to target page', () => {
  const session = createPresenterSession();
  const pageId = session.activePageId;
  const next = addStrokeToPresenterPage(session, pageId, { id: 'stroke-1', tool: 'pen', points: [] });

  assert.equal(next.pages[0].strokes.length, 1);
  assert.equal(next.dirty, true);
});

test('removeStrokeFromPresenterPage removes stroke by id', () => {
  const session = addStrokeToPresenterPage(createPresenterSession(), undefined, { id: 'stroke-1', tool: 'pen', points: [] });
  const next = removeStrokeFromPresenterPage(session, session.activePageId, 'stroke-1');

  assert.equal(next.pages[0].strokes.length, 0);
});
```

- [ ] **Step 2: Implement stroke model helpers**

Add to `src/lib/presenterModel.js`.

```js
const updatePresenterPage = (session, pageId = session.activePageId, updater) => ({
  ...session,
  pages: session.pages.map((page) => page.id === pageId ? updater(page) : page),
  dirty: true
});

export const addStrokeToPresenterPage = (session, pageId = session.activePageId, stroke) =>
  updatePresenterPage(session, pageId, (page) => ({
    ...page,
    strokes: [...page.strokes, stroke]
  }));

export const removeStrokeFromPresenterPage = (session, pageId = session.activePageId, strokeId) =>
  updatePresenterPage(session, pageId, (page) => ({
    ...page,
    strokes: page.strokes.filter((stroke) => stroke.id !== strokeId)
  }));
```

- [ ] **Step 3: Create ink layer**

Create `src/components/presenter/PresenterInkLayer.jsx`.

```jsx
const pointsToPath = (points = []) => {
  if (points.length === 0) return '';
  const [first, ...rest] = points;
  return [`M ${first.x} ${first.y}`, ...rest.map((point) => `L ${point.x} ${point.y}`)].join(' ');
};

export default function PresenterInkLayer({ page }) {
  const highlighter = page.strokes.filter((stroke) => stroke.tool === 'highlighter');
  const pen = page.strokes.filter((stroke) => stroke.tool !== 'highlighter');

  const renderStroke = (stroke) => (
    <path
      key={stroke.id}
      d={pointsToPath(stroke.points)}
      fill="none"
      stroke={stroke.color}
      strokeWidth={stroke.width}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={stroke.tool === 'highlighter' ? 0.36 : 1}
    />
  );

  return (
    <>
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${page.width} ${page.height}`} preserveAspectRatio="none">
        {highlighter.map(renderStroke)}
      </svg>
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${page.width} ${page.height}`} preserveAspectRatio="none">
        {pen.map(renderStroke)}
      </svg>
    </>
  );
}
```

- [ ] **Step 4: Wire pointer capture**

In `PresenterBoard.jsx`, add handlers:

```jsx
const activeStrokeRef = useRef(null);

const handlePointerDown = (event) => {
  if (!onStrokeComplete || tool.id === 'select') return;
  event.currentTarget.setPointerCapture(event.pointerId);
  const point = mapClientPointToBoard({
    clientX: event.clientX,
    clientY: event.clientY,
    rect: event.currentTarget.getBoundingClientRect(),
    scrollTop: scrollRef.current?.scrollTop || 0,
    scale
  });
  activeStrokeRef.current = {
    id: `stroke-${Date.now()}`,
    tool: tool.variant,
    color: tool.color,
    width: tool.width,
    points: [point]
  };
};

const handlePointerMove = (event) => {
  if (!activeStrokeRef.current) return;
  const point = mapClientPointToBoard({
    clientX: event.clientX,
    clientY: event.clientY,
    rect: event.currentTarget.getBoundingClientRect(),
    scrollTop: scrollRef.current?.scrollTop || 0,
    scale
  });
  activeStrokeRef.current.points.push(point);
};

const handlePointerUp = () => {
  if (!activeStrokeRef.current) return;
  onStrokeComplete(activeStrokeRef.current);
  activeStrokeRef.current = null;
};
```

Pass `tool` and `onStrokeComplete` from `PresenterShell`, and render `PresenterInkLayer`.

- [ ] **Step 5: Verify and commit**

Run:

```bash
node --test src/lib/presenterModel.test.js
npx eslint src/lib/presenterModel.js src/lib/presenterModel.test.js src/components/presenter/PresenterInkLayer.jsx src/components/presenter/PresenterBoard.jsx src/components/presenter/PresenterShell.jsx
npm run build
```

Manual check:

- Pen draws on the board.
- Highlighter is translucent.
- One-finger/stylus drawing does not scroll accidentally.

Commit:

```bash
git add src/lib/presenterModel.js src/lib/presenterModel.test.js src/components/presenter/PresenterInkLayer.jsx src/components/presenter/PresenterBoard.jsx src/components/presenter/PresenterShell.jsx
git commit -m "feat: add presenter ink drawing"
```

---

## Task 10: Background Popover, Grid, Lines, And Snap

**Files:**

- Modify: `src/components/presenter/PresenterToolbar.jsx`
- Modify: `src/components/presenter/PresenterShell.jsx`
- Modify: `src/components/presenter/PresenterBoard.jsx`
- Modify: `src/lib/presenterModel.js`
- Modify: `src/lib/presenterGeometry.test.js`

- [ ] **Step 1: Add model helper for background**

Add tests to `presenterModel.test.js`.

```js
import { updatePresenterPageBackground } from './presenterModel.js';

test('updatePresenterPageBackground changes only target page background', () => {
  const session = addPresenterPage(createPresenterSession());
  const firstPageId = session.pages[0].id;
  const next = updatePresenterPageBackground(session, firstPageId, { kind: 'grid', gridSize: 96 });

  assert.equal(next.pages[0].background.kind, 'grid');
  assert.equal(next.pages[1].background.kind, 'white');
});
```

Implement:

```js
export const updatePresenterPageBackground = (session, pageId = session.activePageId, background) =>
  updatePresenterPage(session, pageId, (page) => ({
    ...page,
    background
  }));
```

- [ ] **Step 2: Add background popover**

In `PresenterToolbar.jsx`, render above the toolbar when `activeCategory === 'background'`.

```jsx
{activeCategory === 'background' && (
  <div className="mb-3 rounded-2xl border border-slate-700 bg-slate-950/96 p-3 shadow-2xl">
    <div className="grid grid-cols-4 gap-2">
      <button className="presenter-popover-button" onClick={() => onBackground({ kind: 'white', gridSize })}>Wit</button>
      <button className="presenter-popover-button" onClick={() => onBackground({ kind: 'lines', gridSize })}>Lijntjes</button>
      <button className="presenter-popover-button" onClick={() => onBackground({ kind: 'grid', gridSize })}>Ruitjes</button>
      <button className="presenter-popover-button" onClick={() => onBackground({ kind: 'grid', gridSize: gridSize === 96 ? 72 : 96 })}>Ruitmaat</button>
    </div>
  </div>
)}
```

Add CSS utility:

```css
.presenter-popover-button {
  min-height: 3.5rem;
  border-radius: 0.875rem;
  background: rgb(30 41 59);
  padding: 0.75rem;
  color: white;
  font-size: 0.875rem;
  font-weight: 900;
}
```

- [ ] **Step 3: Snap geometry pen when grid enabled**

In `PresenterBoard.jsx`, when `tool.variant === 'geometry-pen'`, call:

```js
const maybeSnapPoint = (point) =>
  snapPointToGrid(point, {
    enabled: page.background.kind === 'grid',
    gridSize: page.background.gridSize || 96
  });
```

Use `maybeSnapPoint(point)` for pointer down and move only for geometry pen. Normal pen and highlighter remain smooth.

- [ ] **Step 4: Verify and commit**

Run:

```bash
node --test src/lib/presenterModel.test.js src/lib/presenterGeometry.test.js
npx eslint src/components/presenter/PresenterToolbar.jsx src/components/presenter/PresenterShell.jsx src/components/presenter/PresenterBoard.jsx src/lib/presenterModel.js
npm run build
```

Manual check:

- White/lines/grid switch works.
- Grid squares remain square on resize.
- Geometry pen snaps to grid only when grid is active.
- Normal pen remains smooth.

Commit:

```bash
git add src/components/presenter/PresenterToolbar.jsx src/components/presenter/PresenterShell.jsx src/components/presenter/PresenterBoard.jsx src/lib/presenterModel.js src/lib/presenterModel.test.js src/index.css
git commit -m "feat: add presenter backgrounds and grid snap"
```

---

## Task 11: Object Layer And Basic Shape Creation

**Files:**

- Create: `src/components/presenter/PresenterObjectLayer.jsx`
- Modify: `src/components/presenter/PresenterShell.jsx`
- Modify: `src/components/presenter/PresenterBoard.jsx`
- Modify: `src/lib/presenterModel.js`
- Modify: `src/lib/presenterModel.test.js`

- [ ] **Step 1: Add object reducer tests**

Append to `presenterModel.test.js`.

```js
import { addObjectToPresenterPage, deleteObjectFromPresenterPage } from './presenterModel.js';

test('addObjectToPresenterPage adds object and selects it', () => {
  const session = createPresenterSession();
  const next = addObjectToPresenterPage(session, session.activePageId, { id: 'object-1', type: 'rectangle' });

  assert.equal(next.pages[0].objects.length, 1);
  assert.equal(next.selectedObjectId, 'object-1');
});

test('deleteObjectFromPresenterPage removes selected object', () => {
  const session = addObjectToPresenterPage(createPresenterSession(), undefined, { id: 'object-1', type: 'rectangle' });
  const next = deleteObjectFromPresenterPage(session, session.activePageId, 'object-1');

  assert.equal(next.pages[0].objects.length, 0);
  assert.equal(next.selectedObjectId, null);
});
```

Implement in `presenterModel.js`.

```js
export const addObjectToPresenterPage = (session, pageId = session.activePageId, object) => ({
  ...updatePresenterPage(session, pageId, (page) => ({
    ...page,
    objects: [...page.objects, object]
  })),
  selectedObjectId: object.id
});

export const deleteObjectFromPresenterPage = (session, pageId = session.activePageId, objectId) => ({
  ...updatePresenterPage(session, pageId, (page) => ({
    ...page,
    objects: page.objects.filter((object) => object.id !== objectId)
  })),
  selectedObjectId: session.selectedObjectId === objectId ? null : session.selectedObjectId
});
```

- [ ] **Step 2: Create object layer**

Create `src/components/presenter/PresenterObjectLayer.jsx`.

```jsx
const renderObject = (object, selected, onSelect, onDelete) => {
  const common = {
    stroke: object.strokeColor,
    strokeWidth: object.strokeWidth,
    fill: object.fillColor,
    transform: `translate(${object.x} ${object.y}) rotate(${object.rotation || 0})`
  };

  return (
    <g key={object.id} onPointerDown={(event) => { event.stopPropagation(); onSelect(object.id); }}>
      {object.type === 'rectangle' && <rect {...common} width={object.width} height={object.height} rx="8" />}
      {object.type === 'ellipse' && <ellipse {...common} cx={object.width / 2} cy={object.height / 2} rx={object.width / 2} ry={object.height / 2} />}
      {object.type === 'line' && <line {...common} x1="0" y1="0" x2={object.width} y2={object.height} fill="none" />}
      {object.type === 'arrow' && <line {...common} x1="0" y1="0" x2={object.width} y2={object.height} fill="none" markerEnd="url(#presenter-arrow)" />}
      {object.type === 'triangle' && <polygon {...common} points={`0,${object.height} ${object.width / 2},0 ${object.width},${object.height}`} />}
      {object.type === 'polygon' && <polygon {...common} points={(object.points || []).map((point) => `${point.x},${point.y}`).join(' ')} />}
      {object.type === 'axes' && <path {...common} fill="none" d={`M 0 ${object.height / 2} H ${object.width} M ${object.width / 2} 0 V ${object.height}`} />}
      {object.type === 'table' && <rect {...common} width={object.width} height={object.height} />}
      {object.type === 'angle' && <path {...common} fill="none" d={`M 0 ${object.height} L 0 0 A ${object.width / 2} ${object.width / 2} 0 0 1 ${object.width / 2} ${object.height / 2}`} />}
      {selected && (
        <>
          <rect x={object.x - 8} y={object.y - 8} width={object.width + 16} height={object.height + 16} fill="none" stroke="#2563eb" strokeWidth="3" strokeDasharray="10 8" />
          <foreignObject x={object.x + object.width - 18} y={object.y - 22} width="44" height="44">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-lg font-black text-white shadow-lg" onClick={(event) => { event.stopPropagation(); onDelete(object.id); }}>x</button>
          </foreignObject>
        </>
      )}
    </g>
  );
};

export default function PresenterObjectLayer({ page, selectedObjectId, onSelectObject, onDeleteObject }) {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${page.width} ${page.height}`} preserveAspectRatio="none">
      <defs>
        <marker id="presenter-arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
          <path d="M 0 0 L 12 6 L 0 12 z" fill="#111827" />
        </marker>
      </defs>
      {page.objects.map((object) => renderObject(object, object.id === selectedObjectId, onSelectObject, onDeleteObject))}
    </svg>
  );
}
```

- [ ] **Step 3: Add object popover in toolbar**

The `Objecten` popover should create buttons for:

```js
['rectangle', 'ellipse', 'line', 'arrow', 'triangle', 'polygon', 'axes', 'table', 'angle']
```

Each button calls:

```js
onCreateObject(type)
```

In `PresenterShell`, implement:

```js
const handleCreateObject = (type) => {
  const object = createPresenterObject(type, { x: 220, y: 180 });
  setSession((current) => addObjectToPresenterPage(current, current.activePageId, object));
};
```

- [ ] **Step 4: Verify and commit**

Run:

```bash
node --test src/lib/presenterModel.test.js src/lib/presenterObjects.test.js
npx eslint src/components/presenter/PresenterObjectLayer.jsx src/components/presenter/PresenterToolbar.jsx src/components/presenter/PresenterShell.jsx src/components/presenter/PresenterBoard.jsx src/lib/presenterModel.js
npm run build
```

Manual check:

- Create each shape type from Objecten popover.
- Select object shows blue selection outline and red delete circle.
- Delete circle removes the object.

Commit:

```bash
git add src/components/presenter/PresenterObjectLayer.jsx src/components/presenter/PresenterToolbar.jsx src/components/presenter/PresenterShell.jsx src/components/presenter/PresenterBoard.jsx src/lib/presenterModel.js src/lib/presenterModel.test.js
git commit -m "feat: add presenter shape objects"
```

---

## Task 12: Math Instruments Overlay

**Files:**

- Create: `src/components/presenter/PresenterInstrumentOverlay.jsx`
- Modify: `src/components/presenter/PresenterToolbar.jsx`
- Modify: `src/components/presenter/PresenterShell.jsx`

- [ ] **Step 1: Create instrument overlay**

Create `src/components/presenter/PresenterInstrumentOverlay.jsx`.

```jsx
const instrumentLabels = {
  ruler: 'Liniaal',
  triangle: 'Geodriehoek',
  compass: 'Passer',
  protractor: 'Gradenboog'
};

export default function PresenterInstrumentOverlay({ instrument, onClose }) {
  if (!instrument) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div className="pointer-events-auto absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
        <div className="rounded-2xl border border-slate-300 bg-white/88 p-4 shadow-2xl backdrop-blur">
          {instrument === 'ruler' && <div className="h-16 w-[520px] rounded-lg border-2 border-slate-500 bg-yellow-100/80" />}
          {instrument === 'triangle' && <div className="h-64 w-80 border-b-[220px] border-l-[0] border-r-[320px] border-b-yellow-100/80 border-r-transparent" />}
          {instrument === 'compass' && <div className="h-72 w-72 rounded-full border-4 border-dashed border-slate-600 bg-white/50" />}
          {instrument === 'protractor' && <div className="h-40 w-80 rounded-t-full border-4 border-b-0 border-slate-600 bg-yellow-100/70" />}
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-xl">
          <span className="font-black">{instrumentLabels[instrument]}</span>
          <button className="rounded-xl bg-white px-3 py-2 text-sm font-black text-slate-950" onClick={onClose}>Sluit tool</button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add instruments to Objecten popover**

In `PresenterToolbar`, under `Objecten`, add instrument buttons:

```js
[
  { id: 'ruler', label: 'Liniaal' },
  { id: 'triangle', label: 'Geodriehoek' },
  { id: 'compass', label: 'Passer' },
  { id: 'protractor', label: 'Gradenboog' }
]
```

Each calls:

```js
onInstrument(id)
```

- [ ] **Step 3: Wire overlay in shell**

In `PresenterShell.jsx`:

```jsx
const [instrument, setInstrument] = useState(null);
```

Render:

```jsx
<PresenterInstrumentOverlay instrument={instrument} onClose={() => setInstrument(null)} />
```

- [ ] **Step 4: Verify and commit**

Run:

```bash
npx eslint src/components/presenter/PresenterInstrumentOverlay.jsx src/components/presenter/PresenterToolbar.jsx src/components/presenter/PresenterShell.jsx
npm run build
```

Manual check:

- Liniaal, geodriehoek, passer, gradenboog overlays can open and close.
- They are temporary overlays and do not persist as objects.

Commit:

```bash
git add src/components/presenter/PresenterInstrumentOverlay.jsx src/components/presenter/PresenterToolbar.jsx src/components/presenter/PresenterShell.jsx
git commit -m "feat: add presenter math instrument overlays"
```

---

## Task 13: Fullscreen, Keyboard Shortcuts, And Recovery Prompt

**Files:**

- Create: `src/components/presenter/PresenterRecoveryPrompt.jsx`
- Modify: `src/components/presenter/PresenterShell.jsx`
- Modify: `src/pages/AdminPresenterPage.jsx`

- [ ] **Step 1: Create recovery prompt**

Create `src/components/presenter/PresenterRecoveryPrompt.jsx`.

```jsx
export default function PresenterRecoveryPrompt({ onRestore, onDiscard }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/48 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">Presenter</p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">Vorige Presenter-sessie herstellen?</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Er staat nog tijdelijk bordwerk in deze browser. Je kunt dit herstellen of met een leeg bord beginnen.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700" onClick={onDiscard}>Leeg bord</button>
          <button className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white" onClick={onRestore}>Herstellen</button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire recovery**

In `PresenterShell.jsx`:

- call `loadPresenterRecoveryState(window.sessionStorage)` on mount
- show prompt if state exists
- save dirty state with `savePresenterRecoveryState(window.sessionStorage, session)`
- clear recovery on discard

Use:

```jsx
useEffect(() => {
  const recovered = loadPresenterRecoveryState(window.sessionStorage);
  if (recovered) setRecoverySession(recovered);
}, []);
```

and:

```jsx
useEffect(() => {
  savePresenterRecoveryState(window.sessionStorage, session);
}, [session]);
```

- [ ] **Step 3: Add beforeunload warning**

In `PresenterShell.jsx`:

```jsx
useEffect(() => {
  const handleBeforeUnload = (event) => {
    if (!hasRecoverablePresenterState(session)) return;
    event.preventDefault();
    event.returnValue = '';
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [session]);
```

- [ ] **Step 4: Add fullscreen handler**

In `PresenterShell.jsx`:

```js
const [fullscreenError, setFullscreenError] = useState('');

const requestFullscreen = async () => {
  try {
    setFullscreenError('');
    await document.documentElement.requestFullscreen();
  } catch {
    setFullscreenError('Fullscreen kon niet worden gestart. Presenter blijft gewoon bruikbaar.');
  }
};
```

Render the error as a small toast.

- [ ] **Step 5: Add keyboard shortcuts**

In `PresenterShell.jsx`, add `useEffect` for:

- `Ctrl+Z`: undo active page.
- `Ctrl+Y`: redo active page.
- `Delete`: delete selected object.
- `ArrowLeft`: previous page.
- `ArrowRight`: next page.
- `Escape`: exit fullscreen if active, otherwise set tool to select and close instrument.

- [ ] **Step 6: Verify and commit**

Run:

```bash
node --test src/lib/presenterStorage.test.js
npx eslint src/components/presenter/PresenterRecoveryPrompt.jsx src/components/presenter/PresenterShell.jsx src/pages/AdminPresenterPage.jsx
npm run build
```

Manual check:

- Create a stroke, refresh, see recovery prompt.
- Restore returns board state.
- Discard starts blank.
- Fullscreen button starts browser fullscreen or shows error.
- Escape exits fullscreen or cancels active tool.

Commit:

```bash
git add src/components/presenter/PresenterRecoveryPrompt.jsx src/components/presenter/PresenterShell.jsx src/pages/AdminPresenterPage.jsx
git commit -m "feat: add presenter recovery and fullscreen"
```

---

## Task 14: Polish Pass And Browser Verification

**Files:**

- Modify: `src/components/presenter/PresenterShell.jsx`
- Modify: `src/components/presenter/PresenterBoard.jsx`
- Modify: `src/components/presenter/PresenterToolbar.jsx`
- Modify: `src/components/presenter/PresenterObjectLayer.jsx`
- Modify: `src/components/presenter/PresenterInstrumentOverlay.jsx`
- Modify: `src/components/presenter/PresenterRecoveryPrompt.jsx`

- [ ] **Step 1: Run full targeted test suite**

Run:

```bash
node --test src/lib/presenterModel.test.js src/lib/presenterHistory.test.js src/lib/presenterGeometry.test.js src/lib/presenterObjects.test.js src/lib/presenterStorage.test.js src/lib/adminWorkspaceNav.test.js
```

Expected: PASS.

- [ ] **Step 2: Run targeted lint**

Run:

```bash
npx eslint src/App.jsx src/pages/AdminPresenterPage.jsx src/lib/adminWorkspaceNav.js src/lib/adminWorkspaceNav.test.js src/lib/presenterModel.js src/lib/presenterModel.test.js src/lib/presenterHistory.js src/lib/presenterHistory.test.js src/lib/presenterGeometry.js src/lib/presenterGeometry.test.js src/lib/presenterObjects.js src/lib/presenterObjects.test.js src/lib/presenterStorage.js src/lib/presenterStorage.test.js src/components/layout/AppShell.jsx src/components/presenter/PresenterShell.jsx src/components/presenter/PresenterBoard.jsx src/components/presenter/PresenterBackground.jsx src/components/presenter/PresenterInkLayer.jsx src/components/presenter/PresenterObjectLayer.jsx src/components/presenter/PresenterToolbar.jsx src/components/presenter/PresenterPagePanel.jsx src/components/presenter/PresenterInstrumentOverlay.jsx src/components/presenter/PresenterRecoveryPrompt.jsx
```

Expected: PASS.

- [ ] **Step 3: Run production build**

Run:

```bash
npm run build
```

Expected: PASS. Existing Vite chunk warnings are acceptable.

- [ ] **Step 4: Browser verification at 1920 x 1080**

Open:

```text
http://localhost:5174/admin/presenter
```

Verify:

- Presenter nav item exists and active state is correct.
- Blank board opens.
- Toolbar appears at bottom and can pin/unpin.
- Pen draws under pointer.
- Highlighter is translucent and below normal pen.
- Geometry pen snaps only when grid is active.
- White, lines, and grid backgrounds switch.
- Grid squares remain square.
- Page add/delete/duplicate works.
- Delete page asks confirmation.
- Textual page panel works.
- Shapes can be created and deleted.
- Instruments open and close as temporary overlays.
- Recovery prompt appears after refresh with dirty state.
- Fullscreen button works or shows graceful error.

- [ ] **Step 5: Commit final polish**

Commit any final fixes:

```bash
git add src docs PROJECTKOMPAS-HELIX.md
git commit -m "polish: verify presenter core"
```

- [ ] **Step 6: Push branch**

Run:

```bash
git push origin feature/cms-platform
```

---

## Self-Review

Spec coverage:

- Navigation and route: Task 1.
- Board pages and internal model: Tasks 2, 7.
- Exact pointer mapping, grid, snap: Tasks 3, 10.
- Per-page undo/redo: Task 4.
- Shape metadata and shape rendering: Tasks 5, 11.
- Local recovery: Tasks 6, 13.
- Toolbar and page controls: Task 8.
- Ink drawing: Task 9.
- Math instruments: Task 12.
- Fullscreen, keyboard, warning behavior: Task 13.
- Verification: Task 14.

Known intentional deferrals from V1a spec:

- Text tool remains out of scope.
- HELIX import remains out of scope.
- Interactive question windows remain out of scope.
- Rendered thumbnails remain out of scope.
- Export remains out of scope.

Placeholder scan:

- No incomplete task markers remain.
- Final polish files are listed explicitly in Task 14.

Type consistency:

- `session.pages`, `session.activePageId`, `page.strokes`, `page.objects`, `page.background`, and `selectedObjectId` are consistent across tasks.
- Geometry helpers use `x`, `y`, `gridSize`, `scale`, `rect`, and `scrollTop` consistently.
- Object helpers use `type`, `x`, `y`, `width`, `height`, `rotation`, `strokeColor`, `fillColor`, and `strokeWidth` consistently.
