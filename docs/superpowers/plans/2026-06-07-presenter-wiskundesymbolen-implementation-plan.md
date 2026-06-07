# Presenter Wiskundesymbolen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a compact `Σ` symbol palette to Presenter text mode, inserting `π √ ² ³ × ÷ ≤ ≥ ≈ ≠ ∠ °` at the active text cursor or creating a new text object when no text cursor is active.

**Architecture:** Keep the visible UI in `PresenterToolbar.jsx`, route symbol actions through `PresenterShell.jsx`, and keep text cursor capture/restoration inside `PresenterObjectLayer.jsx`. Add one pure helper in `src/lib/presenterTextInsertion.js` so the string insertion behavior is covered by focused tests before React wiring.

**Tech Stack:** React 19, Vite, lucide-react, Node test runner.

---

## File Structure

- Create `src/lib/presenterTextInsertion.js`: pure selection-offset text insertion helper.
- Create `src/lib/presenterTextInsertion.test.js`: focused tests for cursor/range insertion and fallback behavior.
- Modify `src/components/presenter/PresenterObjectLayer.jsx`: report active text selection offsets and restore caret after programmatic insertion.
- Modify `src/components/presenter/PresenterBoard.jsx`: pass text selection and caret request callbacks between shell and object layer.
- Modify `src/components/presenter/PresenterShell.jsx`: store latest text cursor snapshot, insert symbols via helper, and request caret restoration.
- Modify `src/components/presenter/PresenterToolbar.jsx`: replace direct symbol row with compact `Σ` popover and correct Unicode symbol list.

---

### Task 1: Pure Text Insertion Helper

**Files:**
- Create: `src/lib/presenterTextInsertion.js`
- Create: `src/lib/presenterTextInsertion.test.js`

- [ ] **Step 1: Write the failing helper tests**

Create `src/lib/presenterTextInsertion.test.js`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { insertTextAtSelection } from './presenterTextInsertion.js';

test('insertTextAtSelection inserts a symbol at a collapsed cursor offset', () => {
  assert.deepEqual(
    insertTextAtSelection('a = c', '√', { start: 4, end: 4 }),
    { text: 'a = √c', caretOffset: 5 }
  );
});

test('insertTextAtSelection replaces a selected text range', () => {
  assert.deepEqual(
    insertTextAtSelection('hoek 90 graden', '°', { start: 7, end: 16 }),
    { text: 'hoek 90°', caretOffset: 8 }
  );
});

test('insertTextAtSelection clamps offsets to the text length', () => {
  assert.deepEqual(
    insertTextAtSelection('π', '²', { start: 99, end: 99 }),
    { text: 'π²', caretOffset: 2 }
  );
});

test('insertTextAtSelection appends when selection is missing', () => {
  assert.deepEqual(
    insertTextAtSelection('x', '≈', null),
    { text: 'x≈', caretOffset: 2 }
  );
});
```

- [ ] **Step 2: Run the tests and verify they fail**

Run:

```bash
node --test src/lib/presenterTextInsertion.test.js
```

Expected: fail because `src/lib/presenterTextInsertion.js` does not exist.

- [ ] **Step 3: Implement the helper**

Create `src/lib/presenterTextInsertion.js`:

```js
const toSafeString = (value = '') =>
  typeof value === 'string' ? value : String(value ?? '');

const toFiniteOffset = (value, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number) : fallback;
};

const clampOffset = (value, length) =>
  Math.max(0, Math.min(toFiniteOffset(value, length), length));

export const insertTextAtSelection = (text = '', insertion = '', selection = null) => {
  const source = toSafeString(text);
  const insert = toSafeString(insertion);
  const length = source.length;
  const rawStart = selection && typeof selection === 'object' ? selection.start : length;
  const rawEnd = selection && typeof selection === 'object' ? selection.end : rawStart;
  const start = clampOffset(rawStart, length);
  const end = clampOffset(rawEnd, length);
  const rangeStart = Math.min(start, end);
  const rangeEnd = Math.max(start, end);
  const nextText = `${source.slice(0, rangeStart)}${insert}${source.slice(rangeEnd)}`;

  return {
    text: nextText,
    caretOffset: rangeStart + insert.length
  };
};
```

- [ ] **Step 4: Run helper tests and verify they pass**

Run:

```bash
node --test src/lib/presenterTextInsertion.test.js
```

Expected: 4 tests pass.

- [ ] **Step 5: Commit Task 1**

```bash
git add src/lib/presenterTextInsertion.js src/lib/presenterTextInsertion.test.js
git commit -m "feat: add presenter text insertion helper"
```

---

### Task 2: Cursor Capture And Caret Restoration

**Files:**
- Modify: `src/components/presenter/PresenterObjectLayer.jsx`
- Modify: `src/components/presenter/PresenterBoard.jsx`

- [ ] **Step 1: Add DOM cursor helpers in `PresenterObjectLayer.jsx`**

Near the existing `moveCaretToEnd` helper, add:

```js
const getTextSelectionOffsets = (element) => {
  if (!element || typeof window === 'undefined') return null;
  const selection = window.getSelection?.();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  if (!element.contains(range.startContainer) || !element.contains(range.endContainer)) return null;

  const startRange = document.createRange();
  startRange.selectNodeContents(element);
  startRange.setEnd(range.startContainer, range.startOffset);

  const endRange = document.createRange();
  endRange.selectNodeContents(element);
  endRange.setEnd(range.endContainer, range.endOffset);

  return {
    start: startRange.toString().length,
    end: endRange.toString().length
  };
};

const findTextPosition = (root, offset) => {
  const safeOffset = Math.max(0, Number(offset) || 0);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  let consumed = 0;

  while (current) {
    const length = current.textContent?.length || 0;
    if (consumed + length >= safeOffset) {
      return {
        node: current,
        offset: Math.max(0, Math.min(safeOffset - consumed, length))
      };
    }
    consumed += length;
    current = walker.nextNode();
  }

  return { node: root, offset: root.childNodes.length };
};

const moveCaretToOffset = (element, offset) => {
  if (!element || typeof window === 'undefined') return;
  const selection = window.getSelection?.();
  if (!selection) return;

  const position = findTextPosition(element, offset);
  const range = document.createRange();
  range.setStart(position.node, position.offset);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
};
```

- [ ] **Step 2: Extend `PresenterTextObject` props and callbacks**

Change the function signature:

```js
function PresenterTextObject({
  object,
  interactive,
  selected = false,
  textCaretRequest,
  onInteract,
  onSelectObject,
  onTextChange,
  onTextCursorChange
}) {
```

Inside `PresenterTextObject`, after the existing `useEffect` that syncs `innerText`, add:

```js
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || textCaretRequest?.objectId !== object.id) return;
    requestAnimationFrame(() => {
      editor.focus();
      moveCaretToOffset(editor, textCaretRequest.offset);
      onTextCursorChange?.(object.id, {
        ...getTextSelectionOffsets(editor),
        requestId: textCaretRequest.requestId
      });
    });
  }, [object.id, onTextCursorChange, textCaretRequest]);
```

Add a reporting helper inside `PresenterTextObject`:

```js
  const reportCursor = () => {
    const selection = getTextSelectionOffsets(editorRef.current);
    if (!selection) return;
    onTextCursorChange?.(object.id, selection);
  };
```

Update handlers:

```js
  const handleInput = (event) => {
    onTextChange?.(object.id, event.currentTarget.innerText);
    reportCursor();
  };

  const handleFocus = () => {
    onInteract?.();
    onSelectObject?.(object.id);
    if (focusAtEndRef.current) {
      focusAtEndRef.current = false;
      requestAnimationFrame(() => {
        moveCaretToEnd(editorRef.current);
        reportCursor();
      });
      return;
    }
    requestAnimationFrame(reportCursor);
  };
```

Add these props on the contentEditable `<div>`:

```jsx
          onBlur={reportCursor}
          onKeyUp={reportCursor}
          onMouseUp={reportCursor}
          onPointerUp={reportCursor}
```

- [ ] **Step 3: Pass new props through `PresenterObjectLayer`**

Add these props to `PresenterObjectLayer`:

```js
  textCaretRequest,
  onTextCursorChange,
```

Pass them into `PresenterTextObject`:

```jsx
                textCaretRequest={textCaretRequest}
                onInteract={onInteract}
                onSelectObject={onSelectObject}
                onTextChange={onTextChange}
                onTextCursorChange={onTextCursorChange}
```

- [ ] **Step 4: Pass new props through `PresenterBoard`**

Add these props to the `PresenterBoard` signature:

```js
  textCaretRequest,
  onTextCursorChange,
```

Pass them to the first, object-rendering `PresenterObjectLayer`:

```jsx
          textCaretRequest={textCaretRequest}
          onTextCursorChange={onTextCursorChange}
```

Do not pass `onTextChange` to the selection-only `PresenterObjectLayer`, because that layer has `showObjects={false}`.

- [ ] **Step 5: Run a targeted lint check for touched component syntax**

Run:

```bash
npx eslint src/components/presenter/PresenterObjectLayer.jsx src/components/presenter/PresenterBoard.jsx
```

Expected: exit 0.

- [ ] **Step 6: Commit Task 2**

```bash
git add src/components/presenter/PresenterObjectLayer.jsx src/components/presenter/PresenterBoard.jsx
git commit -m "feat: track presenter text cursor"
```

---

### Task 3: Shell Symbol Insertion State

**Files:**
- Modify: `src/components/presenter/PresenterShell.jsx`

- [ ] **Step 1: Import the insertion helper**

Add near the other lib imports:

```js
import { insertTextAtSelection } from '../../lib/presenterTextInsertion.js';
```

- [ ] **Step 2: Add text cursor and caret request state**

Near the existing text state:

```js
  const [activeTextCursor, setActiveTextCursor] = useState(null);
  const [textCaretRequest, setTextCaretRequest] = useState(null);
```

Add a handler near `handleTextChange`:

```js
  const handleTextCursorChange = useCallback((objectId, selection) => {
    if (!objectId || !selection) return;
    setActiveTextCursor({
      objectId,
      start: selection.start,
      end: selection.end
    });
  }, []);
```

- [ ] **Step 3: Replace `handleTextSymbol` with cursor-aware insertion**

Replace the current `handleTextSymbol` function:

```js
  const handleTextSymbol = (symbol) => {
    if (!selectedTextObject?.id) {
      handleCreateTextObject(symbol);
      return;
    }

    updateObjectOnActivePageWithHistory(selectedTextObject.id, (object) => {
      const currentText = typeof object?.content?.text === 'string' ? object.content.text : '';
      const selection = activeTextCursor?.objectId === object.id
        ? activeTextCursor
        : { start: currentText.length, end: currentText.length };
      const result = insertTextAtSelection(currentText, symbol, selection);

      setTextCaretRequest({
        objectId: object.id,
        offset: result.caretOffset,
        requestId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      });
      setActiveTextCursor({
        objectId: object.id,
        start: result.caretOffset,
        end: result.caretOffset
      });

      return {
        ...object,
        content: {
          ...(object.content || {}),
          text: result.text
        }
      };
    });
  };
```

- [ ] **Step 4: Pass cursor props to `PresenterBoard`**

Add to the `<PresenterBoard />` props:

```jsx
        textCaretRequest={textCaretRequest}
        onTextCursorChange={handleTextCursorChange}
```

- [ ] **Step 5: Run targeted tests and lint**

Run:

```bash
node --test src/lib/presenterTextInsertion.test.js
npx eslint src/components/presenter/PresenterShell.jsx src/components/presenter/PresenterBoard.jsx src/components/presenter/PresenterObjectLayer.jsx src/lib/presenterTextInsertion.js src/lib/presenterTextInsertion.test.js
```

Expected: tests pass and ESLint exits 0.

- [ ] **Step 6: Commit Task 3**

```bash
git add src/components/presenter/PresenterShell.jsx src/components/presenter/PresenterBoard.jsx src/components/presenter/PresenterObjectLayer.jsx src/lib/presenterTextInsertion.js src/lib/presenterTextInsertion.test.js
git commit -m "feat: insert presenter symbols at cursor"
```

---

### Task 4: Toolbar `Σ` Popover

**Files:**
- Modify: `src/components/presenter/PresenterToolbar.jsx`

- [ ] **Step 1: Import React state and Sigma icon**

At the top:

```js
import { useState } from 'react';
```

Add `Sigma` to the lucide import:

```js
  Sigma,
```

- [ ] **Step 2: Replace the current symbol array**

Replace:

```js
const mathSymbols = ['Â²', 'âˆš', 'Ï€', 'Ã·', 'Ã—', 'â‰¤', 'â‰¥'];
```

With:

```js
const mathSymbols = ['π', '√', '²', '³', '×', '÷', '≤', '≥', '≈', '≠', '∠', '°'];
```

- [ ] **Step 3: Add popover state**

Inside `PresenterToolbar`, after `runAction`:

```js
  const [symbolsOpen, setSymbolsOpen] = useState(false);
```

Update `handleCategory` so changing toolbar category closes the popover:

```js
    setSymbolsOpen(false);
```

Add it before `onCategory?.(category.id);`.

- [ ] **Step 4: Replace the direct symbol row with `Σ` popover**

Replace the existing block that maps `mathSymbols` directly to buttons with:

```jsx
          <div className="relative flex items-center justify-center">
            <button
              type="button"
              className={`${popoverButtonClass} gap-2 ${symbolsOpen ? activeButtonClass : idleButtonClass}`}
              onClick={() => {
                setSymbolsOpen((current) => !current);
                onAction?.();
              }}
              aria-expanded={symbolsOpen}
              aria-label="Wiskundesymbolen"
            >
              <Sigma size={17} strokeWidth={2.6} />
              Symbolen
            </button>
            {symbolsOpen ? (
              <div className="absolute bottom-[calc(100%+0.55rem)] left-1/2 z-50 grid w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 grid-cols-4 gap-1.5 rounded-xl border presenter-chrome-surface p-2 shadow-[0_18px_40px_rgba(28,18,45,0.16)]">
                {mathSymbols.map((symbol) => (
                  <button
                    key={symbol}
                    type="button"
                    className={`${iconButtonClass} h-12 w-full text-lg`}
                    onClick={() => {
                      handleTextSymbol(symbol);
                      onAction?.();
                    }}
                    aria-label={`Wiskundesymbool ${symbol}`}
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
```

- [ ] **Step 5: Run targeted lint**

Run:

```bash
npx eslint src/components/presenter/PresenterToolbar.jsx
```

Expected: exit 0.

- [ ] **Step 6: Commit Task 4**

```bash
git add src/components/presenter/PresenterToolbar.jsx
git commit -m "feat: add presenter symbol palette"
```

---

### Task 5: Verification And Browser Smoke

**Files:**
- Verify: `src/components/presenter/PresenterToolbar.jsx`
- Verify: `src/components/presenter/PresenterShell.jsx`
- Verify: `src/components/presenter/PresenterObjectLayer.jsx`
- Verify: `src/components/presenter/PresenterBoard.jsx`
- Verify: `src/lib/presenterTextInsertion.js`
- Verify: `src/lib/presenterTextInsertion.test.js`

- [ ] **Step 1: Run targeted tests**

```bash
node --test src/lib/presenterTextInsertion.test.js src/lib/presenterModel.test.js src/lib/presenterHistory.test.js src/lib/presenterObjects.test.js
```

Expected: all listed tests pass.

- [ ] **Step 2: Run targeted ESLint**

```bash
npx eslint src/components/presenter/PresenterToolbar.jsx src/components/presenter/PresenterShell.jsx src/components/presenter/PresenterObjectLayer.jsx src/components/presenter/PresenterBoard.jsx src/lib/presenterTextInsertion.js src/lib/presenterTextInsertion.test.js
```

Expected: exit 0.

- [ ] **Step 3: Run production build**

```bash
npm run build
```

Expected: build exits 0. Existing Vite chunk/dynamic-import warnings are acceptable if they match known project warnings and no new errors appear.

- [ ] **Step 4: Browser smoke Presenter text symbol flow**

Use the in-app Browser against the local dev server. If no server is running, start Vite on an available non-5174 port:

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

Smoke steps:

1. Open `/admin/presenter`.
2. Use local admin/dev login if required by the current environment.
3. Open `Tekst`.
4. Create a text object with `abc`.
5. Place the cursor between `a` and `b`.
6. Open `Σ` and click `√`.
7. Confirm text reads `a√bc`.
8. Deselect the text object.
9. Open `Σ` and click `π`.
10. Confirm a new text object containing `π` appears.

- [ ] **Step 5: Commit final verification note if code changed after earlier commits**

If verification required a fix, commit it:

```bash
git add src/components/presenter src/lib/presenterTextInsertion.js src/lib/presenterTextInsertion.test.js
git commit -m "fix: polish presenter symbol insertion"
```

- [ ] **Step 6: Push the branch**

```bash
git push origin codex/digitale-vaardigheden-seed
```

Expected: push succeeds.

---

## Self-Review

- Spec coverage: The plan covers the compact `Σ` popover, exact Projectkompas symbol set, cursor insertion, fallback new text object, mojibake correction, and exclusion of breuken/stroken/pizzapunten.
- Completeness scan: Every step has concrete files, code snippets, commands, and expected results.
- Type consistency: Cursor snapshots consistently use `{ objectId, start, end }`; caret restoration requests consistently use `{ objectId, offset, requestId }`; pure helper returns `{ text, caretOffset }`.
