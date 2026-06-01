# Consistente Lesmateriaal Tree Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the CMS tree and "Lesmateriaal klaarzetten" navigation consistent: text-first, indented, no emoji/color controls, no artificial letter badges.

**Architecture:** Add shared CMS label helpers in `src/lib/cmsNavigationUtils.js`, then reuse those helpers in the CMS tree and assignment page. The assignment page loads the hierarchy as a tree and keeps assignment state separate from CMS editing actions.

**Tech Stack:** React 19, Vite, Node test runner, existing CMS service layer.

---

### Task 1: Shared Labels

**Files:**
- Modify: `src/lib/cmsNavigationUtils.js`
- Modify: `src/lib/cmsNavigationUtils.test.js`

- [ ] Add failing tests for label fallbacks covering `name`, legacy `naam`, `label`, `title`, and empty values.
- [ ] Run `node --test src/lib/cmsNavigationUtils.test.js` and confirm the new tests fail because the helper is missing.
- [ ] Add `getCmsItemLabel(type, item)` and use it inside `buildCmsNavigationTree`.
- [ ] Run `node --test src/lib/cmsNavigationUtils.test.js` and confirm all tests pass.

### Task 2: Clean CMS Tree

**Files:**
- Modify: `src/components/cms/NavigationTree.jsx`

- [ ] Remove artificial badge text generation for vak, leerjaar, niveau, hoofdstuk and paragraaf.
- [ ] Keep expand/collapse buttons, indentation, counts, create, rename and archive actions.
- [ ] Adjust the tree row grid so the label aligns cleanly without a badge column.
- [ ] Keep selected and active-path styling visible.

### Task 3: Remove Color and Emoji Creation UI

**Files:**
- Modify: `src/components/cms/CreateContentModal.jsx`

- [ ] Remove the `ColorEmojiPicker` import.
- [ ] Remove `color`, `emoji` and `showColorPicker` state.
- [ ] Stop sending `color` and `emoji` when creating vak, leerjaar, niveau and hoofdstuk.
- [ ] Remove the "Kies kleur & emoji" section from the form.

### Task 4: Rebuild Assignment Navigation

**Files:**
- Modify: `src/pages/TakenToewijzenPage.jsx`

- [ ] Import `buildCmsNavigationTree` and `getCmsItemLabel`.
- [ ] Load the full CMS hierarchy for the assignment tree after vakken are available.
- [ ] Replace the card-based left navigation with an indented tree.
- [ ] Keep paragraph assignment checkboxes, chapter bulk toggle and content-block selection.
- [ ] Use text fallbacks so no row can render as only an emoji or blank label.
- [ ] Use all loaded paragrafen to show proper names in the "Klaargezet" overview.

### Task 5: Verification

**Files:**
- Verify only.

- [ ] Run `node --test src/lib/cmsNavigationUtils.test.js`.
- [ ] Run `npm run build`.
- [ ] Start the dev server and open the app.
- [ ] Manually verify that creating content has no color/emoji section.
- [ ] Manually verify that the CMS tree has no emoji or artificial letter badges.
- [ ] Manually verify that "Lesmateriaal klaarzetten" after class choice uses the text tree and still allows class and per-student assignment.
