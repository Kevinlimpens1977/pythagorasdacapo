# Digitale Vaardigheden Seed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete HELIX-ready JSON seed for Digitale vaardigheden VMBO leerjaar 1, with filled lesson routes, tokens, quiz/toets blocks, game placeholders, and correct student tool settings.

**Architecture:** Generate the seed from a focused Node script so the large dataset is maintainable and repeatable. Add minimal platform support for `quiz` and `toets` block metadata so CMS/student route labels and defaults understand the new block types. Validate the generated seed with a dedicated test script before any Firestore import is attempted.

**Tech Stack:** Node.js scripts, JSON seed files, existing HELIX React/CMS utility modules, Node test runner where useful.

---

## Files

- Create: `scripts/generate-digitale-vaardigheden-seed.mjs`
- Create: `scripts/validate-digitale-vaardigheden-seed.mjs`
- Create: `docs/seeds/digitale-vaardigheden-vmbo1.seed.json`
- Modify: `src/lib/contentBlockUtils.js`
- Modify: `src/components/cms/ContentBlockBuilder.jsx`
- Modify: `src/pages/StudentLessonPage.jsx`
- Modify: `src/lib/gameRegistry.js`
- Optional test: `src/lib/contentBlockUtils.test.js`
- Source input: `docs/LessenserieDigitaleVaardigheden30Lessen.md`
- Source input: `docs/wikiwijs_dacapo_huidige lessen.json`

## Task 1: Add Quiz/Toets Block Support

- [ ] Add `quiz` and `toets` to `CONTENT_BLOCK_TYPES`.
- [ ] Add labels `Quiz` and `Toets`.
- [ ] Add defaults for `content.items`, `assessmentType`, `attemptPolicy`, `tokenConfig`, and `sourceBasis`.
- [ ] Ensure `normalizeContentBlockSettings` defaults:
  - `allowMathToolbox: false` for every block.
  - `allowAiHelp: true` for `question` and `quiz`.
  - `allowAiHelp: false` for `toets`.
- [ ] Add CMS icons/descriptions/field labels for `quiz` and `toets`.
- [ ] Make student rendering fall back to clear HTML content for `quiz` and `toets` until richer interactive UI is built.
- [ ] Verify content block utility tests pass.

## Task 2: Replace Generic Game Placeholders

- [ ] Update `src/lib/gameRegistry.js`.
- [ ] Remove or supersede generic placeholder games that do not fit Digitale vaardigheden.
- [ ] Add 30 Digitale vaardigheden planned games from the lessons document.
- [ ] Use stable `gameId` values, e.g. `dv-account-escape`, `dv-password-lab`, `dv-certificaat-quest-finale`.
- [ ] Mark all as `cmsEmbeddable: true`, `status: planned`, `subject: Digitale vaardigheden`, `level: VMBO leerjaar 1`.
- [ ] Keep existing real/prototype Pythagoras trainer untouched.

## Task 3: Build the Seed Generator

- [ ] Create `scripts/generate-digitale-vaardigheden-seed.mjs`.
- [ ] Define fixed subject hierarchy:
  - vak: Digitale vaardigheden
  - leerjaar: Leerjaar 1
  - niveau: VMBO
  - 5 hoofdstukken
  - 30 paragrafen
- [ ] Encode all paragraaf titles, kerndoelen, products, media, game concepts and token totals from `docs/LessenserieDigitaleVaardigheden30Lessen.md`.
- [ ] Generate route blocks:
  - first block: `slidedeck`
  - middle blocks: multiple short `theory`, `media`, `question`, optional `example`
  - final blocks: `summary -> quiz/toets -> game`
- [ ] Add published status to all generated objects.
- [ ] Add internal-only `sourceBasis` and `sourceNotes` to blocks.
- [ ] Add token allocation per block, with totals matching each paragraaf.
- [ ] Set `settings.allowMathToolbox` to `false` everywhere.
- [ ] Set `settings.allowAiHelp` to `true` for answer blocks except `toets` and eindtoets.
- [ ] Generate `docs/seeds/digitale-vaardigheden-vmbo1.seed.json`.

## Task 4: Fill Student-Ready Content

- [ ] Use compact vmbo language.
- [ ] Keep theory blocks around 80-160 words where possible.
- [ ] Reuse/paraphrase overlapping Wikiwijs themes:
  - schoolstart and inloggen
  - Outlook
  - OneDrive
  - veilig wachtwoord
  - device/hardware/software
  - veilig internet/phishing/privacy
  - Word and PowerPoint
  - social media
  - cyberpesten
  - nepnieuws
  - AI/chatbots
- [ ] Add didactic content for less-covered themes:
  - Excel/data
  - data privacy
  - bronnen met cijfers
  - algoritmes
  - blokprogrammeren/debuggen
- [ ] Add media blocks with links from the lessons document.
- [ ] Add quiz items for ordinary paragrafen.
- [ ] Add toets items for 1.6, 2.6, 3.6, 4.6, and 5.6.
- [ ] Add game placeholder content as the final block.

## Task 5: Seed Validation

- [ ] Create `scripts/validate-digitale-vaardigheden-seed.mjs`.
- [ ] Validate exact counts:
  - 1 vak
  - 1 leerjaar
  - 1 niveau
  - 5 hoofdstukken
  - 30 paragrafen
- [ ] Validate every paragraaf starts with `slidedeck`.
- [ ] Validate every paragraaf ends with `summary -> quiz/toets -> game`.
- [ ] Validate checkpoint/eindexpo paragrafen use `toets`.
- [ ] Validate ordinary paragrafen use `quiz`.
- [ ] Validate token totals.
- [ ] Validate no block enables wiskundetoolkit/math toolbox.
- [ ] Validate Digidocent is enabled for answer blocks except toets/eindtoets.
- [ ] Validate no visible learner content contains `sourceBasis`.

## Task 6: Run Verification

- [ ] Run seed generation:

```bash
node scripts/generate-digitale-vaardigheden-seed.mjs
```

- [ ] Run seed validation:

```bash
node scripts/validate-digitale-vaardigheden-seed.mjs
```

- [ ] Run focused tests:

```bash
npm test -- contentBlockUtils
```

- [ ] Inspect generated seed size and spot-check H1, H3 and H5 content manually.

## Task 7: Commit and Push

- [ ] Stage only files changed for this implementation.
- [ ] Commit:

```bash
git commit -m "feat: add digitale vaardigheden seed"
```

- [ ] Push:

```bash
git push -u origin codex/digitale-vaardigheden-seed
```

