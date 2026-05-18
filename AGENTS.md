# Codex Guide - Stelling van Pythagoras Project

## Slidedeck Workflow

**Skill:** `.Codex/skills/create-slidedeck/SKILL.md`  
**Preferences:** `.Codex/preferences/slidedeck-preferences.md`

### Quick Start

```bash
/create-slidedeck <source> [options]
```

**Sources:**
- Notebook name/ID: `/create-slidedeck "stelling van pythagoras"`
- PDF/JPG: `/create-slidedeck @file.pdf`
- Text: `/create-slidedeck "Pythagoras zei dat a² + b² = c²..."`

**Output:** PDF (digibord) + JSON (platform) + HTML (preview) → `./exports/`

### Standard Settings
- **Level:** VMBO 1-2
- **Slides:** 15-20
- **Tone:** Laagdrempelig
- **Questions:** 3-5 per slidedeck
- **Exports:** Always PDF + JSON + HTML

See preferences file for customization per project.

---

## PDF Integration Strategy (All Chapters)

**Approach:** Option 3 - Hybrid Dual-Presentation Mode  
**Doc:** `IMPLEMENTATION_PLAN_PDF_INTEGRATION.md`

Each chapter (7.3, 7.4, 7.5, 7.6) follows Phase-based rollout:
- **Phase 1:** PDF viewer component + digibord presentation (2-3 days)
- **Phase 2:** Optional native React slides + evaluation questions (1 week)
- **Phase 3:** Polish & analytics based on teacher feedback

**Pattern:** PDF always works, native features added gradually.

---

## Key Notes

- NotebookLM (local): PDF/JPG analysis
- Codex: Content structure & exports
- Firebase: Lesson platform (separate setup)
- Source tags: `SOURCE_BASED` | `AI_SUGGESTION` | `NEEDS_REVIEW` | `TEACHER_DECISION`
- **PDF Integration:** Hybrid approach with Phase-based rollout (see Implementation Plan)

---

## Git Versioning Rules

After every significant change (new feature, refactor, bugfix, major UI update):

1. Run `git add -A`
2. Write a clear commit message: `git commit -m "feat: [short description]"`
3. Push to GitHub: `git push origin main`

**Never skip this step.** Always commit before moving to the next task.

---

**Created:** 2026-05-10  
**Updated:** 2026-05-14 (Custom Colors/Emoji feature, Git versioning rules added)
