# Assessment Block Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bouw een inline CMS-editor voor quiz- en toetsblokken.

**Architecture:** Houd quiz/toetsvragen als `content.items` binnen het contentBlock. Zet pure mutatie- en normalisatiefuncties in `src/lib/assessmentBlockUtils.js`; gebruik die in `ContentBlockBuilder.jsx`.

**Tech Stack:** React 19, Vite, Firestore contentBlocks, Node test runner, ESLint.

---

### Task 1: Helperfuncties

**Files:**
- Create: `src/lib/assessmentBlockUtils.js`
- Create: `src/lib/assessmentBlockUtils.test.js`

- [ ] Maak helpers voor `createAssessmentItem`, `normalizeAssessmentItem`, `normalizeAssessmentItems`, `moveAssessmentItem`, `duplicateAssessmentItem`, `removeAssessmentItem`, `sumAssessmentItemTokens`.
- [ ] Test default itemdata voor `meerkeuze`, `waar-niet-waar` en `open`.
- [ ] Test token-som, verplaatsen, dupliceren en verwijderen.

### Task 2: CMS Editor UI

**Files:**
- Modify: `src/components/cms/ContentBlockBuilder.jsx`

- [ ] Importeer de helperfuncties.
- [ ] Voeg `AssessmentStudioFields` toe.
- [ ] Toon titel/status/instructietekst/blokinstellingen.
- [ ] Toon itemkaarten met type, prompt, opties, correct-status, feedback en tokens.
- [ ] Voeg knoppen toe voor toevoegen, dupliceren, verwijderen en omhoog/omlaag.
- [ ] Sla genormaliseerde `content.items` op via bestaande `handleSave`.

### Task 3: Verificatie

**Files:**
- Modify if needed: `src/lib/contentBlockUtils.test.js`

- [ ] Run `node --test src\lib\assessmentBlockUtils.test.js src\lib\contentBlockUtils.test.js`.
- [ ] Run gerichte ESLint op gewijzigde bestanden.
- [ ] Run `npm run build`.
- [ ] Commit en push naar `codex/digitale-vaardigheden-seed`.
