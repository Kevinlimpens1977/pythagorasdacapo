# video: explainervideo's voor HELIX

Deze map maakt per hoofdstuk één uitlegvideo van maximaal 3 minuten: Remotion
voor de compositie en de getekende laag, Blender-scripts voor de comicbeelden,
en scripts voor lesstof, draaiboek, timing en ondertitels.

Werk altijd via de skill `/explainer-helix-maker`
(`.claude/skills/explainer-helix-maker/SKILL.md`). Die kent de volgorde en de
akkoordmomenten van Kevin. Het ontwerp staat in
`docs/superpowers/specs/2026-10-02-explainer-helix-maker-design.md` (§18 noemt
wat er anders is gebouwd).

Per hoofdstuk staat alles in `public/hoofdstukken/<hoofdstukId>/`; het
eindresultaat komt in `exports/video/<hoofdstukId>/` (buiten git).

## De drie belangrijkste commando's

Vanuit de repo-root (Git Bash):

```bash
node video/scripts/controleer-draaiboek.mjs --hoofdstuk <id>
(cd video && npx remotion studio --no-open)
(cd video && npx remotion render HelixExplainer ../exports/video/<id>/explainer.mp4 --props='{"hoofdstukId":"<id>"}')
```

Ontbreekt `node_modules`, dan eerst `(cd video && npm i --loglevel=error)`.
