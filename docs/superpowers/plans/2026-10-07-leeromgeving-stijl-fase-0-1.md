# HELIX Leeromgeving-stijl, fase 0 en 1: implementatieplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Een backuppunt zetten (fase 0) en daarna de HELIX Leeromgeving-stijl neerzetten (tokens, CSS, bouwstenen, stijlgids, opmeettest) met als eerste pagina "Testen als leerling" in optie D (fase 1).

**Architecture:** Eén nieuw stijlbestand `src/styles/leeromgeving.css` met `--lo-*`-tokens en `.lo-*`-klassen in `@layer components`, geïmporteerd vanuit `src/index.css`. Kleine React-bouwstenen in `src/components/leeromgeving/` gebruiken die klassen. Pure functies (teksten, groeperen, doelroute) staan in `src/lib/` met `node --test`-tests. Een stijlgids-pagina met voorbeelddata wordt door een Playwright-test opgemeten tegen de waarden uit het ontwerp. De Testen-pagina wordt daarna op die bouwstenen herbouwd.

**Tech Stack:** React 19, Vite, Tailwind 4 (native cascade layers), lucide-react 1.14, Firebase (auth + Firestore), node:test, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-07-leeromgeving-stijl-design.md`

## Global Constraints

- Werk in `C:\Projecten\helix leerplatform` op de productietak `codex/digitale-vaardigheden-seed`. Geen andere sessie tegelijk in deze map.
- Nooit `git add -A` of `git add .`. Noem de paden. Buiten git blijven: `exports/`, `badges/`, `.firebase/`, `.superpowers/`, `.tmp*`, `sources/`, en `.claude/launch.json`.
- Commits in het Nederlands met een voorvoegsel zoals in de geschiedenis (`feat(...)`, `docs(...)`), eindigend op `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Kevin heeft voor dit traject toestemming gegeven om per fase te committen, te markeren, te pushen en te deployen.
- Deployen alleen met `npx vercel --prod --yes`. Nooit `firebase deploy --only hosting`.
- Teksten in de app: Nederlands, korte zinnen, geen emoji. Iconen alleen uit `lucide-react`.
- Tokens exact zoals spec 2.1: `--lo-papier #FFF7E8`, `--lo-papier-2 #FBEBD0`, `--lo-kaart #FFFFFF`, `--lo-lijn #E8DCC3`, `--lo-inkt #0B0D0F`, `--lo-grijs #5B5648`, `--lo-geel #FFD33D`, `--lo-geel-zacht #FFF0B8`, `--lo-blauw #087EB5`, `--lo-blauw-inkt #066A99`, `--lo-blauw-zacht #E1F0F8`, `--lo-paars #793AC7`, `--lo-paars-inkt #5F2C9E`, `--lo-paars-zacht #ECE3F8`, `--lo-groen #2E9D63`, `--lo-groen-inkt #237A4D`, `--lo-groen-zacht #DFF2E7`, `--lo-oranje-inkt #B4520E`, `--lo-oranje-zacht #FDE7D6`, `--lo-rood #D83A2E`, `--lo-rood-zacht #FADDDA`; hoeken 8/12/16/20px; `--lo-schaduw-kaart 0 8px 24px rgba(11, 13, 15, 0.07)`; `--lo-schaduw-knop 0 10px 22px rgba(8, 126, 181, 0.28)`.
- Typografie exact zoals spec 2.2: gewone tekst 15px/400/1,5; kaarttitel 20px/800/30px; uitleg onder kaarttitel 14px/400/21px grijs; rij- en paragraaftitel 15px/700/22,5px; onderregel 12,5px/400/18,75px grijs; H-blokje 13px/800; Start en Start hier 13px/800; keuzeknop 13px/800; label 12px/800/18px.
- Geen Bangers, geen `.ds-display`, geen `.ds-anchor`, geen verwijzing naar het Slide Design System in iets wat dit plan toevoegt.
- Niet aanraken: de `@theme`-kleurfamilies in `src/index.css`, de spellen, de presenter, het certificaat. De bestaande klassen (`btn-primary`, `helix-surface` enz.) blijven in fase 1 ongewijzigd.
- Na elke taak: `npx eslint <gewijzigde bestanden>` en `node --test src/lib/`.

---

## Fase 0: backuppunt

### Task 0: Het werk van vandaag vastleggen en de live versie markeren

**Files:**
- Modify: `docs/HANDOFF.md` (paragraaf 5, onder "Digitale vaardigheden")
- Commit (bestaand, nog niet gecommit): `docs/seeds/dv-h2-device-inclusie.json`, `docs/seeds/dv-h2-device-inclusie.seed.json`, `public/lesstof/dv-h2-*.svg` (17 bestanden), `scripts/zet-inclusie-klaar.mjs`, `scripts/zet-klas-lesstof-klaar.mjs`, `scripts/controleer-hoofdstuk.mjs`, `.claude/skills/helix-hoofdstuk-bouwen/SKILL.md`, `.claude/skills/helix-hoofdstuk-bouwen/references/vakken.md`, `docs/HANDOFF.md`
- Commit: `docs/superpowers/specs/2026-10-07-leeromgeving-stijl-design.md`, `docs/superpowers/plans/2026-10-07-leeromgeving-stijl-fase-0-1.md`

**Interfaces:**
- Produces: git-tag `leeromgeving-voor` op origin; de Vercel-deploy-id van de live versie in `docs/HANDOFF.md`.

- [ ] **Step 1: Controleer de werkmap**

Run: `git status --short | grep -v -E "^\?\? (exports|sources|badges|\.firebase|\.tmp)"`
Expected: alleen de bestanden uit de lijst hierboven plus ` M .claude/launch.json`. Staat er iets anders, stop en meld het.

- [ ] **Step 2: Zoek de live deploy op**

Run: `npx vercel inspect https://dvdacapo.vercel.app 2>&1 | head -20`
Expected: een blok met `id` (begint met `dpl_`) en `url` (`helix-...-kevlimpens-projects.vercel.app`). Noteer beide.

- [ ] **Step 3: Zet het backuppunt in de handoff**

Voeg in `docs/HANDOFF.md`, paragraaf 5, direct onder de alinea "**7 oktober: inclusieversie van hoofdstuk 2 voor H1i1, live en open.**", deze alinea toe (vul de twee waarden uit stap 2 in):

```markdown
**7 oktober: backuppunt vóór de Leeromgeving-stijl.** Git-markering
`leeromgeving-voor` staat op de versie die nu live is. Vercel-deploy van die
versie: `<id uit stap 2>` (`<url uit stap 2>`). Terug naar deze versie kan direct
in Vercel (die deploy weer naar productie zetten) of met `git revert` van de
latere fasecommits en `npx vercel --prod --yes`. Ontwerp:
`docs/superpowers/specs/2026-10-07-leeromgeving-stijl-design.md`.
```

- [ ] **Step 4: Commit het werk van vandaag**

```bash
git add docs/seeds/dv-h2-device-inclusie.json docs/seeds/dv-h2-device-inclusie.seed.json public/lesstof/dv-h2-*.svg scripts/zet-inclusie-klaar.mjs scripts/zet-klas-lesstof-klaar.mjs scripts/controleer-hoofdstuk.mjs .claude/skills/helix-hoofdstuk-bouwen/SKILL.md .claude/skills/helix-hoofdstuk-bouwen/references/vakken.md docs/HANDOFF.md
git commit -m "feat(dv-h2): inclusieversie voor H1i1, zet-inclusie-klaar en inclusiestap in de skill

Inclusieversie van DV H2 (41 blokken, 17 tekeningen), staat sinds 7 okt live.
zet-klas-lesstof-klaar slaat inclusieparagrafen over en kent H3 weer;
controleer-hoofdstuk vergelijkt alleen paragrafen van dezelfde versie.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 5: Commit ontwerp en plan**

```bash
git add docs/superpowers/specs/2026-10-07-leeromgeving-stijl-design.md docs/superpowers/plans/2026-10-07-leeromgeving-stijl-fase-0-1.md
git commit -m "docs(stijl): ontwerp en plan voor de HELIX Leeromgeving-stijl

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 6: Markeer en push**

```bash
git tag -a leeromgeving-voor -m "Live versie vóór de HELIX Leeromgeving-stijl (7 okt 2026)"
git push origin codex/digitale-vaardigheden-seed --follow-tags
```

- [ ] **Step 7: Controleer**

Run: `git ls-remote --tags origin leeromgeving-voor && git status --short | grep -v "^??"`
Expected: één regel met `refs/tags/leeromgeving-voor`; daarna alleen ` M .claude/launch.json`.

---

## Fase 1: de stijl, de bouwstenen en Testen

### Task 1: Stijlbestand, stijldocument en de bewakingstest

**Files:**
- Create: `src/styles/leeromgeving.css`
- Create: `docs/LEEROMGEVING-STIJL.md`
- Modify: `src/index.css:11` (één importregel erbij, direct na `@import "tailwindcss";`)
- Test: `src/lib/leeromgevingStijl.test.js`

**Interfaces:**
- Produces: de klassen `lo-tekst`, `lo-kaart`, `lo-kaart--inclusie`, `lo-kaart-titel`, `lo-kolf`, `lo-kaart-uitleg`, `lo-kaart-voet`, `lo-kaartenraster`, `lo-lijst`, `lo-hoofdstuk`, `lo-rij`, `lo-rij-toggle`, `lo-rij-tekst`, `lo-rij-titel`, `lo-onderregel`, `lo-hblok`, `lo-hblok--dicht`, `lo-paragrafen`, `lo-paragraafrij`, `lo-knop`, `lo-knop-tweede`, `lo-knop-start`, `lo-label` (+ `--blauw`, `--paars`, `--groen`, `--oranje`, `--rood`), `lo-keuzegroep`, `lo-keuzegroep-label`, `lo-keuzes`, `lo-keuze`, `lo-paginakop`, `lo-eyebrow`, `lo-paginatitel`, `lo-paginauitleg`, `lo-melding`, `lo-melding--fout`, `lo-melding--info`, `lo-tokens`, `lo-stalen`, `lo-staal`.

- [ ] **Step 1: Schrijf de falende test**

`src/lib/leeromgevingStijl.test.js`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Bewaakt de HELIX Leeromgeving-stijl (docs/LEEROMGEVING-STIJL.md): de tokens en
// de maten uit Kevins bijlage (optie D, opgemeten op 7 okt 2026).
const css = readFileSync(new URL('../styles/leeromgeving.css', import.meta.url), 'utf8');
const index = readFileSync(new URL('../index.css', import.meta.url), 'utf8');

const regel = (selector) => {
  const veilig = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`(?:^|\\n)\\s*${veilig}\\s*\\{([^}]*)\\}`));
  assert.ok(match, `regel ${selector} ontbreekt`);
  return match[1];
};

test('alle kleuren van de leeromgeving staan er met hun vaste waarde', () => {
  const verwacht = {
    '--lo-papier': '#FFF7E8', '--lo-papier-2': '#FBEBD0', '--lo-kaart': '#FFFFFF', '--lo-lijn': '#E8DCC3',
    '--lo-inkt': '#0B0D0F', '--lo-grijs': '#5B5648', '--lo-geel': '#FFD33D', '--lo-geel-zacht': '#FFF0B8',
    '--lo-blauw': '#087EB5', '--lo-blauw-inkt': '#066A99', '--lo-blauw-zacht': '#E1F0F8',
    '--lo-paars': '#793AC7', '--lo-paars-inkt': '#5F2C9E', '--lo-paars-zacht': '#ECE3F8',
    '--lo-groen': '#2E9D63', '--lo-groen-inkt': '#237A4D', '--lo-groen-zacht': '#DFF2E7',
    '--lo-oranje-inkt': '#B4520E', '--lo-oranje-zacht': '#FDE7D6', '--lo-rood': '#D83A2E', '--lo-rood-zacht': '#FADDDA'
  };
  for (const [naam, waarde] of Object.entries(verwacht)) {
    assert.match(css, new RegExp(`${naam}:\\s*${waarde};`, 'i'), `${naam} moet ${waarde} zijn`);
  }
});

test('de maten uit de bijlage: kaart, lijst, rij en H-blokje', () => {
  assert.match(regel('.lo-kaart'), /padding:\s*22px/);
  assert.match(regel('.lo-kaart'), /border-radius:\s*var\(--lo-hoek-xl\)/);
  assert.match(regel('.lo-kaart-titel'), /font-size:\s*20px/);
  assert.match(regel('.lo-kaart-titel'), /font-weight:\s*800/);
  assert.match(regel('.lo-kaart-uitleg'), /font-size:\s*14px/);
  assert.match(regel('.lo-lijst'), /border:\s*1px solid var\(--lo-lijn\)/);
  assert.match(regel('.lo-rij'), /padding:\s*10px 12px/);
  assert.match(regel('.lo-rij-titel'), /font-size:\s*15px/);
  assert.match(regel('.lo-rij-titel'), /font-weight:\s*700/);
  assert.match(regel('.lo-onderregel'), /font-size:\s*12\.5px/);
  assert.match(regel('.lo-hblok'), /height:\s*30px/);
  assert.match(regel('.lo-hblok'), /border:\s*2px solid var\(--lo-inkt\)/);
  assert.match(regel('.lo-hblok'), /font-size:\s*13px/);
  assert.match(regel('.lo-paragrafen'), /padding:\s*0 12px 10px 52px/);
});

test('de knoppen, labels en keuzeknoppen uit de bijlage', () => {
  assert.match(regel('.lo-knop-start'), /padding:\s*6px 10px/);
  assert.match(regel('.lo-knop-start'), /font-size:\s*13px/);
  assert.match(regel('.lo-knop-start'), /background:\s*var\(--lo-blauw-zacht\)/);
  assert.match(regel('.lo-knop-start'), /color:\s*var\(--lo-blauw-inkt\)/);
  assert.match(regel('.lo-label'), /padding:\s*2px 9px/);
  assert.match(regel('.lo-label'), /font-size:\s*12px/);
  assert.match(regel('.lo-keuze'), /padding:\s*5px 11px/);
  assert.match(regel(".lo-keuze[aria-pressed='true']"), /background:\s*var\(--lo-inkt\)/);
});

test('de leeromgeving staat los van het Slide Design System', () => {
  assert.doesNotMatch(css, /Slide Design System[^.]*volg/i);
  assert.doesNotMatch(css, /Bangers|ds-display|ds-anchor|--font-comic/);
  assert.match(css, /docs\/LEEROMGEVING-STIJL\.md/);
  assert.match(index, /@import "\.\/styles\/leeromgeving\.css";/);
});
```

- [ ] **Step 2: Draai de test en zie hem falen**

Run: `node --test src/lib/leeromgevingStijl.test.js`
Expected: FAIL met `ENOENT ... src/styles/leeromgeving.css`.

- [ ] **Step 3: Schrijf het stijlbestand**

`src/styles/leeromgeving.css`:

```css
/* ==========================================================================
   HELIX Leeromgeving-stijl: het uiterlijk van de website voor leerlingen en
   docenten. Bron en regels: docs/LEEROMGEVING-STIJL.md.
   Dit is NIET het Helix Slide Design System; dat is alleen voor slidedecks,
   NotebookLM-materiaal en explainervideo's en hoort hier niet in.
   De maten komen uit Kevins bijlage (optie D, opgemeten op 7 okt 2026).
   ========================================================================== */

:root {
  --lo-papier: #FFF7E8;
  --lo-papier-2: #FBEBD0;
  --lo-kaart: #FFFFFF;
  --lo-lijn: #E8DCC3;
  --lo-inkt: #0B0D0F;
  --lo-grijs: #5B5648;
  --lo-geel: #FFD33D;
  --lo-geel-zacht: #FFF0B8;
  --lo-blauw: #087EB5;
  --lo-blauw-inkt: #066A99;
  --lo-blauw-zacht: #E1F0F8;
  --lo-paars: #793AC7;
  --lo-paars-inkt: #5F2C9E;
  --lo-paars-zacht: #ECE3F8;
  --lo-groen: #2E9D63;
  --lo-groen-inkt: #237A4D;
  --lo-groen-zacht: #DFF2E7;
  --lo-oranje-inkt: #B4520E;
  --lo-oranje-zacht: #FDE7D6;
  --lo-rood: #D83A2E;
  --lo-rood-zacht: #FADDDA;
  --lo-hoek-s: 8px;
  --lo-hoek-m: 12px;
  --lo-hoek-l: 16px;
  --lo-hoek-xl: 20px;
  --lo-schaduw-kaart: 0 8px 24px rgba(11, 13, 15, 0.07);
  --lo-schaduw-knop: 0 10px 22px rgba(8, 126, 181, 0.28);
  --lo-letter: 'Atkinson Hyperlegible Next Variable', 'Atkinson Hyperlegible', Arial, system-ui, sans-serif;
}

@layer components {
  .lo-tekst { font-family: var(--lo-letter); font-size: 15px; line-height: 1.5; color: var(--lo-inkt); }

  /* Paginakop */
  .lo-paginakop { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-end; justify-content: space-between; }
  .lo-eyebrow { margin: 0; font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--lo-blauw-inkt); }
  .lo-paginatitel { margin: 6px 0 0; font-size: clamp(28px, 4vw, 38px); line-height: 1.15; font-weight: 800; letter-spacing: -0.01em; color: var(--lo-inkt); text-wrap: balance; }
  .lo-paginauitleg { margin: 8px 0 0; max-width: 70ch; font-size: 17px; line-height: 1.55; color: var(--lo-grijs); }

  /* Kaart */
  .lo-kaartenraster { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 460px), 1fr)); gap: 18px; align-items: start; }
  .lo-kaart { display: flex; flex-direction: column; gap: 14px; min-width: 0; padding: 22px; border-radius: var(--lo-hoek-xl); background: var(--lo-kaart); box-shadow: var(--lo-schaduw-kaart); font-family: var(--lo-letter); font-size: 15px; line-height: 1.5; color: var(--lo-inkt); }
  .lo-kaart--inclusie { outline: 3px solid var(--lo-paars-zacht); }
  .lo-kaart-titel { display: inline-flex; align-items: center; gap: 8px; margin: 0; font-size: 20px; line-height: 30px; font-weight: 800; color: var(--lo-inkt); text-wrap: balance; }
  .lo-kolf { color: var(--lo-paars); flex: none; }
  .lo-kaart-uitleg { margin: 4px 0 0; font-size: 14px; line-height: 21px; font-weight: 400; color: var(--lo-grijs); }
  .lo-kaart-voet { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between; font-size: 14px; color: var(--lo-grijs); }
  .lo-tokens { display: inline-flex; align-items: center; gap: 4px; color: var(--lo-grijs); font-variant-numeric: tabular-nums; }

  /* Lijst met scheidingslijnen */
  .lo-lijst { display: flex; flex-direction: column; border: 1px solid var(--lo-lijn); border-radius: var(--lo-hoek-m); }
  .lo-lijst > * + * { border-top: 1px solid var(--lo-lijn); }
  .lo-rij { display: flex; align-items: center; gap: 10px; padding: 10px 12px; }
  .lo-rij-toggle { display: flex; flex: 1; align-items: center; gap: 10px; min-width: 0; padding: 0; border: none; background: none; text-align: left; color: inherit; font: inherit; cursor: pointer; }
  .lo-rij-toggle:disabled { cursor: default; }
  .lo-rij-tekst { display: block; flex: 1; min-width: 0; }
  .lo-rij-titel { display: block; font-size: 15px; line-height: 22.5px; font-weight: 700; color: var(--lo-inkt); overflow-wrap: anywhere; }
  .lo-onderregel { display: block; font-size: 12.5px; line-height: 18.75px; font-weight: 400; color: var(--lo-grijs); font-variant-numeric: tabular-nums; }

  /* H-blokje */
  .lo-hblok { display: inline-grid; flex: none; place-items: center; box-sizing: border-box; min-width: 30px; height: 30px; padding: 0 6px; border: 2px solid var(--lo-inkt); border-radius: var(--lo-hoek-s); background: var(--lo-geel); color: var(--lo-inkt); font-size: 13px; line-height: 19.5px; font-weight: 800; font-variant-numeric: tabular-nums; }
  .lo-hblok--dicht { border-color: var(--lo-lijn); background: var(--lo-papier-2); color: var(--lo-grijs); }

  /* Paragrafen onder een hoofdstuk */
  .lo-paragrafen { display: flex; flex-direction: column; gap: 2px; padding: 0 12px 10px 52px; }
  .lo-paragrafen > * + * { border-top: 1px solid var(--lo-lijn); }
  .lo-paragraafrij { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 7px 0; }

  /* Knoppen */
  .lo-knop { display: inline-flex; align-items: center; gap: 8px; padding: 12px 18px; border: none; border-radius: var(--lo-hoek-m); background: var(--lo-blauw); color: #FFFFFF; font-family: var(--lo-letter); font-size: 15px; line-height: 1.5; font-weight: 800; box-shadow: var(--lo-schaduw-knop); cursor: pointer; }
  .lo-knop:hover:not(:disabled) { background: var(--lo-blauw-inkt); }
  .lo-knop:disabled { background: #A8A08C; box-shadow: none; cursor: not-allowed; }
  .lo-knop-tweede { display: inline-flex; align-items: center; gap: 8px; padding: 11px 17px; border: 1px solid var(--lo-lijn); border-radius: var(--lo-hoek-m); background: var(--lo-kaart); color: var(--lo-inkt); font-family: var(--lo-letter); font-size: 15px; line-height: 1.5; font-weight: 700; cursor: pointer; }
  .lo-knop-tweede:hover:not(:disabled) { border-color: var(--lo-blauw); }
  .lo-knop-tweede:disabled { color: var(--lo-grijs); cursor: not-allowed; }
  .lo-knop-start { display: inline-flex; flex: none; align-items: center; gap: 6px; padding: 6px 10px; border: 1px solid transparent; border-radius: var(--lo-hoek-s); background: var(--lo-blauw-zacht); color: var(--lo-blauw-inkt); font-family: var(--lo-letter); font-size: 13px; line-height: 19.5px; font-weight: 800; white-space: nowrap; cursor: pointer; }
  .lo-knop-start:hover:not(:disabled) { border-color: var(--lo-blauw); }
  .lo-knop-start:disabled { background: var(--lo-papier-2); color: var(--lo-grijs); cursor: not-allowed; }
  .lo-knop:focus-visible, .lo-knop-tweede:focus-visible, .lo-knop-start:focus-visible, .lo-keuze:focus-visible, .lo-rij-toggle:focus-visible { outline: 3px solid var(--lo-blauw); outline-offset: 2px; }

  /* Labels */
  .lo-label { display: inline-flex; flex: none; align-items: center; gap: 5px; padding: 2px 9px; border-radius: 999px; font-size: 12px; line-height: 18px; font-weight: 800; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .lo-label--blauw { background: var(--lo-blauw-zacht); color: var(--lo-blauw-inkt); }
  .lo-label--paars { background: var(--lo-paars-zacht); color: var(--lo-paars-inkt); }
  .lo-label--groen { background: var(--lo-groen-zacht); color: var(--lo-groen-inkt); }
  .lo-label--oranje { background: var(--lo-oranje-zacht); color: var(--lo-oranje-inkt); }
  .lo-label--rood { background: var(--lo-rood-zacht); color: var(--lo-rood); }

  /* Keuzeknoppen */
  .lo-keuzegroep { display: flex; flex-direction: column; gap: 6px; }
  .lo-keuzegroep-label { font-size: 13px; line-height: 19.5px; font-weight: 800; color: var(--lo-grijs); }
  .lo-keuzes { display: flex; flex-wrap: wrap; gap: 8px; }
  .lo-keuze { display: inline-flex; align-items: center; gap: 6px; padding: 5px 11px; border: 2px solid var(--lo-lijn); border-radius: 999px; background: var(--lo-kaart); color: var(--lo-inkt); font-family: var(--lo-letter); font-size: 13px; line-height: 19.5px; font-weight: 800; cursor: pointer; }
  .lo-keuze:hover { border-color: var(--lo-blauw); }
  .lo-keuze[aria-pressed='true'] { border-color: var(--lo-inkt); background: var(--lo-inkt); color: var(--lo-papier); }

  /* Meldingen */
  .lo-melding { display: flex; align-items: flex-start; gap: 8px; margin: 0; padding: 12px 14px; border-radius: var(--lo-hoek-m); font-size: 14px; line-height: 21px; font-weight: 600; }
  .lo-melding--fout { background: var(--lo-rood-zacht); color: var(--lo-rood); }
  .lo-melding--info { background: var(--lo-papier-2); color: var(--lo-grijs); }

  /* Kleurstalen in de stijlgids */
  .lo-stalen { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
  .lo-staal { display: flex; flex-direction: column; gap: 6px; font-size: 12.5px; line-height: 18.75px; color: var(--lo-grijs); }
  .lo-staal span:first-child { height: 44px; border: 1px solid var(--lo-lijn); border-radius: var(--lo-hoek-s); }

  @media (max-width: 760px) {
    .lo-kaart { padding: 16px; }
    .lo-paragrafen { padding-left: 12px; }
  }
}
```

- [ ] **Step 4: Importeer het in index.css**

In `src/index.css` direct na de regel `@import "tailwindcss";` (regel 11) toevoegen:

```css
@import "./styles/leeromgeving.css";
```

- [ ] **Step 5: Schrijf het stijldocument**

`docs/LEEROMGEVING-STIJL.md`:

```markdown
# HELIX Leeromgeving-stijl

Het uiterlijk van de website van HELIX, voor leerlingen en docenten. Dit is het
enige stijldocument van de website.

## Niet het Slide Design System

| | Leeromgeving-stijl | Helix Slide Design System |
| --- | --- | --- |
| Voor | de website | slidedecks, NotebookLM-materiaal, explainervideo's |
| Code | `src/styles/leeromgeving.css`, `src/components/leeromgeving/` | geen websitecode |
| Letter | Atkinson Hyperlegible Next, nergens Bangers | Bangers voor koppen |
| Kenmerken | witte kaarten, scheidingslijnen, gele H-blokjes | stripstijl, gele titelband, rasterpunten |

Wie een deck maakt, kijkt niet hier. Wie de website aanpast, kijkt niet in het
Slide Design System.

## Bron

Optie D van de proefpagina "Indeling Testen als leerling", door Kevin gekozen op
7 oktober 2026 en opgemeten met `getComputedStyle`. Het ontwerp met alle keuzes:
`docs/superpowers/specs/2026-10-07-leeromgeving-stijl-design.md`. De stijlgids
staat in de app op `/admin/stijlgids`; `tests/e2e/leeromgeving-stijl.spec.js`
meet hem op.

## Kleuren

Altijd via de tokens, nooit een losse hexwaarde in een component.

| Token | Waarde | Gebruik |
| --- | --- | --- |
| `--lo-papier` | #FFF7E8 | achtergrond van de pagina |
| `--lo-papier-2` | #FBEBD0 | dichte H-blokjes, uitgeschakelde knoppen |
| `--lo-kaart` | #FFFFFF | kaarten en lijsten |
| `--lo-lijn` | #E8DCC3 | randen en scheidingslijnen |
| `--lo-inkt` | #0B0D0F | tekst, rand van het H-blokje |
| `--lo-grijs` | #5B5648 | onderregels en uitleg |
| `--lo-geel` | #FFD33D | H-blokje |
| `--lo-geel-zacht` | #FFF0B8 | aandacht |
| `--lo-blauw` / `-inkt` / `-zacht` | #087EB5 / #066A99 / #E1F0F8 | hoofdknop / tekst op lichtblauw / Start-knop en blauwe labels |
| `--lo-paars` / `-inkt` / `-zacht` | #793AC7 / #5F2C9E / #ECE3F8 | kolf-icoon / label inclusie |
| `--lo-groen` / `-inkt` / `-zacht` | #2E9D63 / #237A4D / #DFF2E7 | af en voortgang |
| `--lo-oranje-inkt` / `-zacht` | #B4520E / #FDE7D6 | op slot |
| `--lo-rood` / `-zacht` | #D83A2E / #FADDDA | fouten |

## Letter en maten

| Tekst | Grootte / dikte | Regelhoogte |
| --- | --- | --- |
| gewone tekst | 15px / 400 | 1,5 |
| kaarttitel | 20px / 800 | 30px |
| uitleg onder de kaarttitel | 14px / 400, grijs | 21px |
| rij- en paragraaftitel | 15px / 700 | 22,5px |
| onderregel | 12,5px / 400, grijs | 18,75px |
| H-blokje, Start, Start hier, keuzeknop | 13px / 800 | 19,5px |
| label | 12px / 800 | 18px |
| paginakop | 28-38px / 800 | 1,15 |

Kaart: hoek 20px, binnenmarge 22px (16px op een telefoon), schaduw
`0 8px 24px rgba(11,13,15,.07)`. Lijst: rand 1px, hoek 12px, rijen 10px 12px met
een lijn ertussen. Paragrafen springen 52px in. H-blokje: 30px hoog, rand 2px
inkt, hoek 8px. Start-knop: padding 6px 10px, hoek 8px.

## Bouwstenen

`src/components/leeromgeving/`: `Kaart`, `KaartKop`, `HBlok`, `HoofdstukRij`,
`ParagraafRij`, `StartKnop`, `Label`, `Keuzeknoppen`, `PaginaKop`. Gebruik die
in plaats van eigen opmaak. Iconen alleen uit lucide-react.

## Regels

- Iets wat dicht is, toont het slotje en een uitgeschakelde knop.
- Aantallen voluit: "1 paragraaf", "3 paragrafen", "1 lesblok", "9 lesblokken".
- Koppen nooit in hoofdletters en nooit in Bangers.
- Eigen uiterlijk houden: de spellen, de presenter en het digibord, het certificaat.
```

- [ ] **Step 6: Draai de test**

Run: `node --test src/lib/leeromgevingStijl.test.js && node --test src/lib/`
Expected: alle tests PASS (de vier nieuwe en de bestaande).

- [ ] **Step 7: Controleer dat de build het stijlbestand meeneemt**

Run: `npm run build 2>&1 | tail -3 && grep -l "lo-hblok" dist/assets/*.css`
Expected: build slaagt; één CSS-bestand bevat `lo-hblok`.

- [ ] **Step 8: Commit**

```bash
git add src/styles/leeromgeving.css src/index.css docs/LEEROMGEVING-STIJL.md src/lib/leeromgevingStijl.test.js
git commit -m "feat(stijl): HELIX Leeromgeving-stijl, tokens en klassen

Eigen stijlbestand en stijldocument voor de website, los van het Slide Design
System. Maten uit optie D, opgemeten op 7 okt 2026.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Pure functies voor teksten en de doelroute

**Files:**
- Create: `src/lib/leeromgeving.js`
- Test: `src/lib/leeromgeving.test.js`

**Interfaces:**
- Produces:
  - `aantalTekst(aantal: number, enkelvoud: string, meervoud: string): string` → `"1 paragraaf"`, `"3 paragrafen"`
  - `zonderHoofdstukVoorvoegsel(titel: string): string` → `"H2: Wat zit er in je device?"` wordt `"Wat zit er in je device?"`
  - `splitsParagraafLabel(label: string): { code: string, naam: string }` → `"2.3 Dichtheid"` wordt `{ code: '2.3', naam: 'Dichtheid' }`
  - `hoofdstukOnderregel({ paragrafen: number, lesblokken: number }): string` → `"3 paragrafen · 41 lesblokken"`
  - `testsessieDoelRoute(doel: { soort: 'start'|'hoofdstuk'|'paragraaf', id?: string } | null): string` → `'/'`, `'/hoofdstuk/<id>'`, `'/chapter/<id>'`

- [ ] **Step 1: Schrijf de falende tests**

`src/lib/leeromgeving.test.js`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  aantalTekst,
  hoofdstukOnderregel,
  splitsParagraafLabel,
  testsessieDoelRoute,
  zonderHoofdstukVoorvoegsel
} from './leeromgeving.js';

test('aantallen staan voluit, enkelvoud bij precies één', () => {
  assert.equal(aantalTekst(1, 'paragraaf', 'paragrafen'), '1 paragraaf');
  assert.equal(aantalTekst(3, 'paragraaf', 'paragrafen'), '3 paragrafen');
  assert.equal(aantalTekst(0, 'lesblok', 'lesblokken'), '0 lesblokken');
});

test('het voorvoegsel H2: gaat van de hoofdstuktitel af', () => {
  assert.equal(zonderHoofdstukVoorvoegsel('H2: Wat zit er in je device?'), 'Wat zit er in je device?');
  assert.equal(zonderHoofdstukVoorvoegsel('h1 Stoffen'), 'Stoffen');
  assert.equal(zonderHoofdstukVoorvoegsel('Massa, volume en dichtheid'), 'Massa, volume en dichtheid');
  assert.equal(zonderHoofdstukVoorvoegsel(undefined), '');
});

test('een paragraaflabel splitst in code en naam, ook als de code dubbel staat', () => {
  assert.deepEqual(splitsParagraafLabel('2.3 Dichtheid'), { code: '2.3', naam: 'Dichtheid' });
  assert.deepEqual(splitsParagraafLabel('3.1 3.1 Van jouw scherm'), { code: '3.1', naam: 'Van jouw scherm' });
  assert.deepEqual(splitsParagraafLabel('Nulmeting'), { code: '', naam: 'Nulmeting' });
});

test('de onderregel van een hoofdstuk noemt paragrafen en lesblokken', () => {
  assert.equal(hoofdstukOnderregel({ paragrafen: 3, lesblokken: 41 }), '3 paragrafen · 41 lesblokken');
  assert.equal(hoofdstukOnderregel({ paragrafen: 1, lesblokken: 1 }), '1 paragraaf · 1 lesblok');
});

test('een testsessie gaat naar de startpagina, een hoofdstuk of een paragraaf', () => {
  assert.equal(testsessieDoelRoute(null), '/');
  assert.equal(testsessieDoelRoute({ soort: 'start' }), '/');
  assert.equal(testsessieDoelRoute({ soort: 'hoofdstuk', id: 'hoofdstuk-dv-klas1-h2' }), '/hoofdstuk/hoofdstuk-dv-klas1-h2');
  assert.equal(testsessieDoelRoute({ soort: 'paragraaf', id: 'paragraaf-dv-klas1-incl-21' }), '/chapter/paragraaf-dv-klas1-incl-21');
  assert.equal(testsessieDoelRoute({ soort: 'hoofdstuk' }), '/');
});
```

- [ ] **Step 2: Draai de tests en zie ze falen**

Run: `node --test src/lib/leeromgeving.test.js`
Expected: FAIL met `Cannot find module ... leeromgeving.js`.

- [ ] **Step 3: Schrijf de functies**

`src/lib/leeromgeving.js`:

```js
/**
 * Kleine, pure tekstregels van de HELIX Leeromgeving-stijl
 * (docs/LEEROMGEVING-STIJL.md). Geen React, zodat ze met node --test te
 * controleren zijn.
 */

/** "1 paragraaf", "3 paragrafen": aantallen staan altijd voluit. */
export const aantalTekst = (aantal, enkelvoud, meervoud) => `${aantal} ${aantal === 1 ? enkelvoud : meervoud}`;

/** Een hoofdstuktitel zonder "H2:" ervoor; het H-blokje toont het nummer al. */
export const zonderHoofdstukVoorvoegsel = (titel = '') => String(titel ?? '').replace(/^h\d+\s*[:.-]?\s*/i, '').trim();

/** "2.3 Dichtheid" naar { code: '2.3', naam: 'Dichtheid' }; een dubbele code valt weg. */
export const splitsParagraafLabel = (label = '') => {
  const tekst = String(label ?? '').trim();
  const match = /^(\d+\.\d+)\s+(.*)$/.exec(tekst);
  if (!match) return { code: '', naam: tekst };
  return { code: match[1], naam: match[2].replace(/^\d+\.\d+\s+/, '') };
};

/** "3 paragrafen · 41 lesblokken" onder de titel van een hoofdstukrij. */
export const hoofdstukOnderregel = ({ paragrafen = 0, lesblokken = 0 } = {}) =>
  `${aantalTekst(paragrafen, 'paragraaf', 'paragrafen')} · ${aantalTekst(lesblokken, 'lesblok', 'lesblokken')}`;

/** Waar een testleerling na het inloggen begint. */
export const testsessieDoelRoute = (doel = null) => {
  if (doel?.soort === 'hoofdstuk' && doel.id) return `/hoofdstuk/${encodeURIComponent(doel.id)}`;
  if (doel?.soort === 'paragraaf' && doel.id) return `/chapter/${encodeURIComponent(doel.id)}`;
  return '/';
};
```

- [ ] **Step 4: Draai de tests**

Run: `node --test src/lib/leeromgeving.test.js && npx eslint src/lib/leeromgeving.js src/lib/leeromgeving.test.js`
Expected: 5 tests PASS, eslint zonder meldingen.

- [ ] **Step 5: Commit**

```bash
git add src/lib/leeromgeving.js src/lib/leeromgeving.test.js
git commit -m "feat(stijl): tekstregels en doelroute voor de leeromgeving

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Klassen groeperen op lesstof en hoofdstukken uit lessen

**Files:**
- Modify: `src/lib/testleerlingOverzicht.js` (import bovenaan, twee exports onderaan)
- Test: `src/lib/testleerlingOverzicht.test.js` (tests onderaan erbij)

**Interfaces:**
- Consumes: `zonderHoofdstukVoorvoegsel` uit Task 2.
- Produces:
  - `groepeerOpLesstof(kaarten: Array<{ klas, beeld: { lessen } , ...}>): Array<{ sleutel: string, kaarten: Array }>`: klassen die precies dezelfde lesstof zien (hoofdstuknummer, hoofdstuktitel zonder voorvoegsel, paragraaflabel, op slot, aantal blokken) in één groep, in de volgorde van de invoer; `sleutel` is `groep-1`, `groep-2`, ...
  - `hoofdstukkenVanLessen(lessen): Array<{ id, nummer, titel, lessen, opSlot, aantalBlokken, inclusie }>`: lessen per hoofdstuk in volgorde; `opSlot` als alle lessen op slot zijn; `aantalBlokken` telt alleen open lessen; `inclusie` als een les-id `-incl-` bevat.

- [ ] **Step 1: Schrijf de falende tests**

Voeg onderaan `src/lib/testleerlingOverzicht.test.js` toe, en zet de import bovenaan op:
`import { bouwKlasTestbeeld, bouwTestdataOverzicht, groepeerOpLesstof, hoofdstukkenVanLessen } from './testleerlingOverzicht.js';`

```js
const les = (id, extra = {}) => ({
  id,
  label: '2.1 Massa',
  hoofdstukId: 'h2',
  hoofdstukTitel: 'H2: Massa',
  hoofdstukNummer: 2,
  opSlot: false,
  aantalBlokken: 7,
  ...extra
});

test('klassen met dezelfde lesstof komen in één groep, ook met eigen nulmeting-id', () => {
  const kaarten = [
    { klas: { id: 'a', naam: 'H1B1' }, beeld: { lessen: [les('nulmeting-bb', { label: '1.0 Nulmeting', hoofdstukNummer: 1, hoofdstukId: 'h1-bb' })] } },
    { klas: { id: 'b', naam: 'H1K1' }, beeld: { lessen: [les('nulmeting-kb', { label: '1.0 Nulmeting', hoofdstukNummer: 1, hoofdstukId: 'h1-kb' })] } },
    { klas: { id: 'c', naam: 'H1i1' }, beeld: { lessen: [les('nulmeting-kort', { label: '1.0 Nulmeting (kort)', hoofdstukNummer: 1 })] } }
  ];
  const groepen = groepeerOpLesstof(kaarten);
  assert.equal(groepen.length, 2);
  assert.deepEqual(groepen[0].kaarten.map((k) => k.klas.naam), ['H1B1', 'H1K1']);
  assert.equal(groepen[0].sleutel, 'groep-1');
  assert.deepEqual(groepen[1].kaarten.map((k) => k.klas.naam), ['H1i1']);
});

test('een hoofdstuk op slot of met andere blokken maakt een eigen groep', () => {
  const open = { klas: { id: 'a' }, beeld: { lessen: [les('p')] } };
  const dicht = { klas: { id: 'b' }, beeld: { lessen: [les('p', { opSlot: true })] } };
  const meerBlokken = { klas: { id: 'c' }, beeld: { lessen: [les('p', { aantalBlokken: 9 })] } };
  assert.equal(groepeerOpLesstof([open, dicht, meerBlokken]).length, 3);
  assert.deepEqual(groepeerOpLesstof([]), []);
});

test('lessen worden hoofdstukken met telling, slot en inclusie', () => {
  const hoofdstukken = hoofdstukkenVanLessen([
    les('n', { hoofdstukId: 'h1', hoofdstukNummer: 1, hoofdstukTitel: 'H1: Startklaar', label: '1.0 Nulmeting', aantalBlokken: 2 }),
    les('paragraaf-x-incl-21', { aantalBlokken: 18 }),
    les('paragraaf-x-incl-22', { label: '2.2 Software', aantalBlokken: 10 }),
    les('d', { hoofdstukId: 'h3', hoofdstukNummer: 3, hoofdstukTitel: 'Internet', label: '3.1 Reis', opSlot: true, aantalBlokken: 6 })
  ]);
  assert.deepEqual(hoofdstukken.map((h) => [h.id, h.nummer, h.titel, h.lessen.length, h.aantalBlokken, h.opSlot, h.inclusie]), [
    ['h1', 1, 'Startklaar', 1, 2, false, false],
    ['h2', 2, 'Massa', 2, 28, false, true],
    ['h3', 3, 'Internet', 1, 0, true, false]
  ]);
});
```

- [ ] **Step 2: Draai de tests en zie ze falen**

Run: `node --test src/lib/testleerlingOverzicht.test.js`
Expected: FAIL, `groepeerOpLesstof is not a function` (of een SyntaxError op de import).

- [ ] **Step 3: Schrijf de functies**

In `src/lib/testleerlingOverzicht.js` bij de imports bovenaan:

```js
import { zonderHoofdstukVoorvoegsel } from './leeromgeving.js';
```

Onderaan het bestand:

```js
// Wat een leerling ziet, als vergelijkbare sleutel. Bewust niet op id: de
// vmbo-klassen hebben elk een eigen nulmeting-id met hetzelfde label, en zien
// dus precies hetzelfde.
const lesstofHandtekening = (lessen = []) => JSON.stringify(
  lessen.map((les) => [
    les.hoofdstukNummer,
    zonderHoofdstukVoorvoegsel(les.hoofdstukTitel),
    les.label,
    Boolean(les.opSlot),
    les.aantalBlokken
  ])
);

/** Klassen die precies dezelfde lesstof zien, in één groep (Testen, optie D). */
export const groepeerOpLesstof = (kaarten = []) => {
  const groepen = new Map();
  (Array.isArray(kaarten) ? kaarten : []).forEach((kaart) => {
    const handtekening = lesstofHandtekening(kaart?.beeld?.lessen || []);
    if (!groepen.has(handtekening)) groepen.set(handtekening, []);
    groepen.get(handtekening).push(kaart);
  });
  return [...groepen.values()].map((leden, index) => ({ sleutel: `groep-${index + 1}`, kaarten: leden }));
};

/** De lessen van een klas per hoofdstuk, in de volgorde waarin de leerling ze ziet. */
export const hoofdstukkenVanLessen = (lessen = []) => {
  const perHoofdstuk = new Map();
  (Array.isArray(lessen) ? lessen : []).forEach((les) => {
    const sleutel = les.hoofdstukId || `zonder-hoofdstuk-${les.hoofdstukNummer}`;
    if (!perHoofdstuk.has(sleutel)) {
      perHoofdstuk.set(sleutel, {
        id: les.hoofdstukId || '',
        nummer: les.hoofdstukNummer,
        titel: zonderHoofdstukVoorvoegsel(les.hoofdstukTitel),
        lessen: []
      });
    }
    perHoofdstuk.get(sleutel).lessen.push(les);
  });
  return [...perHoofdstuk.values()].map((hoofdstuk) => ({
    ...hoofdstuk,
    opSlot: hoofdstuk.lessen.every((les) => les.opSlot),
    aantalBlokken: hoofdstuk.lessen.filter((les) => !les.opSlot).reduce((som, les) => som + (les.aantalBlokken || 0), 0),
    inclusie: hoofdstuk.lessen.some((les) => String(les.id || '').includes('-incl-'))
  }));
};
```

- [ ] **Step 4: Draai de tests**

Run: `node --test src/lib/testleerlingOverzicht.test.js && node --test src/lib/ && npx eslint src/lib/testleerlingOverzicht.js src/lib/testleerlingOverzicht.test.js`
Expected: alle tests PASS, eslint zonder meldingen.

- [ ] **Step 5: Commit**

```bash
git add src/lib/testleerlingOverzicht.js src/lib/testleerlingOverzicht.test.js
git commit -m "feat(testen): klassen groeperen op lesstof en hoofdstukken uit lessen

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: De bouwstenen

**Files:**
- Create: `src/components/leeromgeving/Kaart.jsx`
- Create: `src/components/leeromgeving/HBlok.jsx`
- Create: `src/components/leeromgeving/StartKnop.jsx`
- Create: `src/components/leeromgeving/Label.jsx`
- Create: `src/components/leeromgeving/HoofdstukRij.jsx`
- Create: `src/components/leeromgeving/ParagraafRij.jsx`
- Create: `src/components/leeromgeving/Keuzeknoppen.jsx`
- Create: `src/components/leeromgeving/PaginaKop.jsx`
- Create: `src/components/leeromgeving/index.js`

**Interfaces:**
- Consumes: de klassen uit Task 1.
- Produces (importeren via `src/components/leeromgeving`):
  - `Kaart({ as = 'section', inclusie = false, className = '', children, ...rest })`
  - `KaartKop({ titel, uitleg = '', kolf = false })`
  - `HBlok({ nummer, dicht = false })`
  - `StartKnop({ children = 'Start', onClick, disabled = false, icoon = LogIn, ...rest })` met `icoon={null}` voor geen icoon
  - `Label({ kleur = 'blauw', icoon = null, children })`, kleur: `blauw | paars | groen | oranje | rood`
  - `HoofdstukRij({ nummer, titel, onderregel, slotTekst = 'op slot', labels = null, opSlot = false, open = false, onWissel, onStart, startTekst = 'Start', startUit = false, children })`
  - `ParagraafRij({ code = '', naam, onderregel, labels = null, onStart, startTekst = 'Start hier', startUit = false })`
  - `Keuzeknoppen({ label = '', opties: Array<{ id, naam }>, gekozen, onKies })`
  - `PaginaKop({ eyebrow = '', titel, uitleg = '', acties = null })`

- [ ] **Step 1: Kaart en KaartKop**

`src/components/leeromgeving/Kaart.jsx`:

```jsx
import { FlaskConical } from 'lucide-react';

/** Witte kaart van de leeromgeving (docs/LEEROMGEVING-STIJL.md). */
export function Kaart({ as: Element = 'section', inclusie = false, className = '', children, ...rest }) {
  const klassen = ['lo-kaart', inclusie ? 'lo-kaart--inclusie' : '', className].filter(Boolean).join(' ');
  return <Element className={klassen} {...rest}>{children}</Element>;
}

/** Titel van 20px met eventueel het paarse kolf-icoon, en een grijze uitleg. */
export function KaartKop({ titel, uitleg = '', kolf = false }) {
  return (
    <div>
      <h2 className="lo-kaart-titel">
        {kolf && <FlaskConical size={18} className="lo-kolf" aria-hidden="true" />}
        {titel}
      </h2>
      {uitleg && <p className="lo-kaart-uitleg">{uitleg}</p>}
    </div>
  );
}
```

- [ ] **Step 2: HBlok, StartKnop en Label**

`src/components/leeromgeving/HBlok.jsx`:

```jsx
/** Geel H-blokje met het hoofdstuknummer; crème als het hoofdstuk dicht is. */
export default function HBlok({ nummer, dicht = false }) {
  const getal = Number(nummer);
  const tekst = Number.isFinite(getal) && getal < 999 ? getal : '?';
  return <span className={dicht ? 'lo-hblok lo-hblok--dicht' : 'lo-hblok'}>H{tekst}</span>;
}
```

`src/components/leeromgeving/StartKnop.jsx`:

```jsx
import { LogIn } from 'lucide-react';

/** De lichtblauwe Start-knop uit de bijlage. `icoon={null}` voor Start hier. */
export default function StartKnop({ children = 'Start', onClick, disabled = false, icoon: Icoon = LogIn, ...rest }) {
  return (
    <button type="button" className="lo-knop-start" onClick={onClick} disabled={disabled} {...rest}>
      {Icoon && <Icoon size={15} aria-hidden="true" />}
      {children}
    </button>
  );
}
```

`src/components/leeromgeving/Label.jsx`:

```jsx
const KLEUREN = new Set(['blauw', 'paars', 'groen', 'oranje', 'rood']);

/** Pil-label, 12px vet. */
export default function Label({ kleur = 'blauw', icoon: Icoon = null, children }) {
  const veilig = KLEUREN.has(kleur) ? kleur : 'blauw';
  return (
    <span className={`lo-label lo-label--${veilig}`}>
      {Icoon && <Icoon size={15} aria-hidden="true" />}
      {children}
    </span>
  );
}
```

- [ ] **Step 3: HoofdstukRij en ParagraafRij**

`src/components/leeromgeving/HoofdstukRij.jsx`:

```jsx
import { ChevronDown, ChevronRight, Lock } from 'lucide-react';

import HBlok from './HBlok';
import StartKnop from './StartKnop';

/**
 * Eén hoofdstuk in een lijst: H-blokje, titel, onderregel en een Start-knop.
 * Klapt uit tot paragraafrijen (children). Op slot: crème blokje, slotje,
 * knop uit, niet uit te klappen.
 */
export default function HoofdstukRij({
  nummer,
  titel,
  onderregel,
  slotTekst = 'op slot',
  labels = null,
  opSlot = false,
  open = false,
  onWissel,
  onStart,
  startTekst = 'Start',
  startUit = false,
  children
}) {
  const kanOpen = !opSlot && typeof onWissel === 'function';
  const Pijl = open ? ChevronDown : ChevronRight;

  return (
    <div className="lo-hoofdstuk">
      <div className="lo-rij">
        <button
          type="button"
          className="lo-rij-toggle"
          onClick={kanOpen ? onWissel : undefined}
          disabled={!kanOpen}
          aria-expanded={kanOpen ? open : undefined}
        >
          <HBlok nummer={nummer} dicht={opSlot} />
          <span className="lo-rij-tekst">
            <span className="lo-rij-titel">{titel}</span>
            <span className="lo-onderregel">{opSlot ? slotTekst : onderregel}</span>
          </span>
          {labels}
          {opSlot && <Lock size={15} aria-hidden="true" />}
          {kanOpen && <Pijl size={15} aria-hidden="true" />}
        </button>
        {onStart && (
          <StartKnop onClick={onStart} disabled={opSlot || startUit}>
            {startTekst}
          </StartKnop>
        )}
      </div>
      {open && !opSlot && children ? <div className="lo-paragrafen">{children}</div> : null}
    </div>
  );
}
```

`src/components/leeromgeving/ParagraafRij.jsx`:

```jsx
import StartKnop from './StartKnop';

/** Eén paragraaf onder een hoofdstuk: "2.3 Dichtheid", "9 lesblokken", Start hier. */
export default function ParagraafRij({ code = '', naam, onderregel, labels = null, onStart, startTekst = 'Start hier', startUit = false }) {
  return (
    <div className="lo-paragraafrij">
      <span className="lo-rij-tekst">
        <span className="lo-rij-titel">{code ? `${code} ${naam}` : naam}</span>
        {onderregel && <span className="lo-onderregel">{onderregel}</span>}
      </span>
      {labels}
      {onStart && (
        <StartKnop onClick={onStart} disabled={startUit} icoon={null}>
          {startTekst}
        </StartKnop>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Keuzeknoppen, PaginaKop en de index**

`src/components/leeromgeving/Keuzeknoppen.jsx`:

```jsx
/** Ronde keuzeknoppen; de gekozen knop is zwart met crème tekst. */
export default function Keuzeknoppen({ label = '', opties = [], gekozen, onKies }) {
  return (
    <div className="lo-keuzegroep">
      {label && <span className="lo-keuzegroep-label">{label}</span>}
      <div className="lo-keuzes">
        {opties.map((optie) => (
          <button
            key={optie.id}
            type="button"
            className="lo-keuze"
            aria-pressed={optie.id === gekozen}
            onClick={() => onKies(optie.id)}
          >
            {optie.naam}
          </button>
        ))}
      </div>
    </div>
  );
}
```

`src/components/leeromgeving/PaginaKop.jsx`:

```jsx
/** Kop van een pagina: eyebrow, titel en uitleg, met eventueel knoppen rechts. */
export default function PaginaKop({ eyebrow = '', titel, uitleg = '', acties = null }) {
  return (
    <header className="lo-paginakop">
      <div>
        {eyebrow && <p className="lo-eyebrow">{eyebrow}</p>}
        <h1 className="lo-paginatitel">{titel}</h1>
        {uitleg && <p className="lo-paginauitleg">{uitleg}</p>}
      </div>
      {acties}
    </header>
  );
}
```

`src/components/leeromgeving/index.js`:

```js
// Bouwstenen van de HELIX Leeromgeving-stijl (docs/LEEROMGEVING-STIJL.md).
export { Kaart, KaartKop } from './Kaart';
export { default as HBlok } from './HBlok';
export { default as StartKnop } from './StartKnop';
export { default as Label } from './Label';
export { default as HoofdstukRij } from './HoofdstukRij';
export { default as ParagraafRij } from './ParagraafRij';
export { default as Keuzeknoppen } from './Keuzeknoppen';
export { default as PaginaKop } from './PaginaKop';
```

- [ ] **Step 5: Lint en build**

Run: `npx eslint src/components/leeromgeving/ && npm run build 2>&1 | tail -3`
Expected: geen eslint-meldingen; build slaagt. (De bouwstenen worden in Task 5 en 7 gebruikt en in Task 6 opgemeten.)

- [ ] **Step 6: Commit**

```bash
git add src/components/leeromgeving/
git commit -m "feat(stijl): bouwstenen van de leeromgeving

Kaart, H-blokje, hoofdstuk- en paragraafrij, Start-knop, label, keuzeknoppen
en paginakop, zoals in optie D.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Stijlgids op /admin/stijlgids

**Files:**
- Create: `src/pages/AdminStijlgidsPage.jsx`
- Modify: `src/App.jsx` (import bij de andere pagina-imports rond regel 31-32; route direct na `admin/testen`, rond regel 86-90)
- Modify: `src/pages/AdminSettingsPage.jsx` (`settingsSections` een vierde item)

**Interfaces:**
- Consumes: alle bouwstenen uit Task 4; `hoofdstukOnderregel`, `aantalTekst` uit Task 2.
- Produces: route `/admin/stijlgids` (alleen admin). De voorbeeldkaart van optie D staat in een element met `data-stijlgids="optie-d"`; daarin is H2 bij het openen uitgeklapt. Task 6 meet die op.

- [ ] **Step 1: Schrijf de pagina**

`src/pages/AdminStijlgidsPage.jsx`:

```jsx
import { useState } from 'react';
import { Coins, House, Lock, RefreshCw } from 'lucide-react';

import { HoofdstukRij, Kaart, KaartKop, Keuzeknoppen, Label, PaginaKop, ParagraafRij, StartKnop } from '../components/leeromgeving';
import { aantalTekst, hoofdstukOnderregel } from '../lib/leeromgeving';

/**
 * Stijlgids van de HELIX Leeromgeving-stijl, met voorbeelddata. Leest niets uit
 * Firestore, zodat hij ook met de ontwikkelaarslogin werkt en door
 * tests/e2e/leeromgeving-stijl.spec.js opgemeten kan worden.
 * Dit is niet het Slide Design System.
 */

const VOORBEELD_H2 = [
  { code: '2.1', naam: 'Massa', blokken: 7 },
  { code: '2.2', naam: 'Volume', blokken: 11 },
  { code: '2.3', naam: 'Dichtheid', blokken: 9 }
];

const VMBO_KLASSEN = ['H1B1', 'H1B2', 'H1K1', 'H1K2', 'H1K3', 'H1TL1', 'H1TL2', 'H1TL3'].map((naam) => ({ id: naam, naam }));

const KLEUREN = [
  ['--lo-papier', '#FFF7E8'], ['--lo-papier-2', '#FBEBD0'], ['--lo-kaart', '#FFFFFF'], ['--lo-lijn', '#E8DCC3'],
  ['--lo-inkt', '#0B0D0F'], ['--lo-grijs', '#5B5648'], ['--lo-geel', '#FFD33D'], ['--lo-geel-zacht', '#FFF0B8'],
  ['--lo-blauw', '#087EB5'], ['--lo-blauw-inkt', '#066A99'], ['--lo-blauw-zacht', '#E1F0F8'], ['--lo-paars', '#793AC7'],
  ['--lo-paars-zacht', '#ECE3F8'], ['--lo-groen', '#2E9D63'], ['--lo-groen-zacht', '#DFF2E7'], ['--lo-oranje-zacht', '#FDE7D6'],
  ['--lo-rood', '#D83A2E'], ['--lo-rood-zacht', '#FADDDA']
];

const geenActie = () => {};

export default function AdminStijlgidsPage() {
  const [open, setOpen] = useState({ h1: false, h2: true });
  const [klas, setKlas] = useState('H1B1');
  const wissel = (sleutel) => setOpen((stand) => ({ ...stand, [sleutel]: !stand[sleutel] }));

  return (
    <div className="helix-page lo-tekst">
      <div className="helix-container flex flex-col gap-8 py-10 md:py-12">
        <PaginaKop
          eyebrow="Stijl"
          titel="Stijlgids leeromgeving"
          uitleg="Alle bouwstenen van de HELIX Leeromgeving-stijl, met voorbeelddata. Dit is de stijl van de website, niet het Slide Design System van de decks."
        />

        <div className="lo-kaartenraster">
          <div data-stijlgids="optie-d">
            <Kaart>
              <KaartKop kolf titel="ER3L1A" uitleg="Binask · leerroute niveau-binask-eoa-1-lr3" />
              <div className="lo-lijst">
                <HoofdstukRij
                  nummer={1}
                  titel="Stoffen"
                  onderregel={hoofdstukOnderregel({ paragrafen: 4, lesblokken: 10 })}
                  open={open.h1}
                  onWissel={() => wissel('h1')}
                  onStart={geenActie}
                >
                  <ParagraafRij code="1.1" naam="Natuurwetenschappen" onderregel={aantalTekst(4, 'lesblok', 'lesblokken')} onStart={geenActie} />
                </HoofdstukRij>
                <HoofdstukRij
                  nummer={2}
                  titel="Massa, volume en dichtheid"
                  onderregel={hoofdstukOnderregel({ paragrafen: 6, lesblokken: 46 })}
                  open={open.h2}
                  onWissel={() => wissel('h2')}
                  onStart={geenActie}
                >
                  {VOORBEELD_H2.map((paragraaf) => (
                    <ParagraafRij
                      key={paragraaf.code}
                      code={paragraaf.code}
                      naam={paragraaf.naam}
                      onderregel={aantalTekst(paragraaf.blokken, 'lesblok', 'lesblokken')}
                      onStart={geenActie}
                    />
                  ))}
                </HoofdstukRij>
              </div>
              <div className="lo-kaart-voet">
                <span className="inline-flex flex-wrap items-center gap-2">
                  <Label kleur="blauw">23 testrecords</Label>
                  <span className="lo-tokens"><Coins size={15} aria-hidden="true" />150</span>
                </span>
                <StartKnop icoon={House} onClick={geenActie}>Start op de startpagina</StartKnop>
              </div>
            </Kaart>
          </div>

          <Kaart>
            <KaartKop
              titel="Digitale vaardigheden · 8 klassen"
              uitleg="Deze klassen zien precies dezelfde lesstof. Elke klas heeft wel een eigen testleerling."
            />
            <Keuzeknoppen label="Log in als testleerling van" opties={VMBO_KLASSEN} gekozen={klas} onKies={setKlas} />
            <div className="lo-lijst">
              <HoofdstukRij nummer={1} titel="Startklaar op je nieuwe school" onderregel={hoofdstukOnderregel({ paragrafen: 1, lesblokken: 2 })} onWissel={geenActie} onStart={geenActie} />
              <HoofdstukRij nummer={2} titel="Wat zit er in je device?" onderregel={hoofdstukOnderregel({ paragrafen: 3, lesblokken: 16 })} onWissel={geenActie} onStart={geenActie} />
              <HoofdstukRij nummer={3} titel="Hoe reist jouw bericht over internet?" opSlot onStart={geenActie} />
            </div>
          </Kaart>

          <Kaart inclusie>
            <KaartKop kolf titel="H1i1" uitleg="Inclusieklas: krijgt de inclusieversie van elk hoofdstuk." />
            <div className="lo-lijst">
              <HoofdstukRij
                nummer={2}
                titel="Wat zit er in je device?"
                onderregel={hoofdstukOnderregel({ paragrafen: 3, lesblokken: 41 })}
                labels={<Label kleur="paars">inclusie</Label>}
                onWissel={geenActie}
                onStart={geenActie}
              />
            </div>
          </Kaart>

          <Kaart>
            <KaartKop titel="Knoppen en labels" uitleg="De hoofdknop voor de ene belangrijkste handeling, de tweede knop ernaast." />
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className="lo-knop">Start testsessie</button>
              <button type="button" className="lo-knop" disabled>Start testsessie</button>
              <button type="button" className="lo-knop-tweede"><RefreshCw size={16} aria-hidden="true" />Verversen</button>
              <StartKnop onClick={geenActie}>Start</StartKnop>
              <StartKnop disabled>Start</StartKnop>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Label kleur="blauw">5 testrecords</Label>
              <Label kleur="paars">inclusie</Label>
              <Label kleur="groen">af</Label>
              <Label kleur="oranje" icoon={Lock}>op slot</Label>
              <Label kleur="rood">2 problemen</Label>
            </div>
            <p className="lo-melding lo-melding--info">Voor deze klas staat geen lesstof klaar.</p>
            <p className="lo-melding lo-melding--fout">De testsessie kon niet gestart worden.</p>
          </Kaart>

          <Kaart>
            <KaartKop titel="Kleuren" uitleg="Altijd via de tokens, nooit een losse hexwaarde in een component." />
            <div className="lo-stalen">
              {KLEUREN.map(([token, waarde]) => (
                <div key={token} className="lo-staal">
                  <span style={{ background: `var(${token})` }} />
                  <span><b>{token}</b> {waarde}</span>
                </div>
              ))}
            </div>
          </Kaart>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Voeg de route toe**

In `src/App.jsx` bij de imports (na `import AdminVrijgevenPage from './pages/AdminVrijgevenPage';`):

```jsx
import AdminStijlgidsPage from './pages/AdminStijlgidsPage';
```

Direct na het blok van de route `admin/testen`:

```jsx
        <Route path="admin/stijlgids" element={
          <PrivateRoute requireAdmin={true}>
            <AdminStijlgidsPage />
          </PrivateRoute>
        } />
```

- [ ] **Step 3: Zet een ingang op Instellingen**

In `src/pages/AdminSettingsPage.jsx`: voeg `Palette` toe aan de lucide-import en zet als vierde item in `settingsSections`:

```jsx
  {
    title: 'Stijlgids leeromgeving',
    description: 'Alle bouwstenen van de websitestijl naast elkaar: kaarten, rijen, H-blokjes, knoppen en kleuren.',
    actionLabel: 'Open stijlgids',
    path: '/admin/stijlgids',
    icon: Palette,
    tone: 'text-amber-700 bg-amber-50'
  }
```

- [ ] **Step 4: Lint en build**

Run: `npx eslint src/pages/AdminStijlgidsPage.jsx src/App.jsx src/pages/AdminSettingsPage.jsx && npm run build 2>&1 | tail -3`
Expected: geen meldingen; build slaagt.

- [ ] **Step 5: Bekijk de pagina één keer**

Start de dev-server met `preview_start` (naam `helix-dev`), ga naar `http://localhost:5173/login`, klik "Admin testlogin", ga naar `/admin/stijlgids` en maak één schermafbeelding. Vergelijk met Kevins bijlage (de kaart ER3L1A met H2 uitgeklapt). Expected: zelfde opbouw; geen consolefouten (`read_console_messages`, alleen fouten).

- [ ] **Step 6: Commit**

```bash
git add src/pages/AdminStijlgidsPage.jsx src/App.jsx src/pages/AdminSettingsPage.jsx
git commit -m "feat(stijl): stijlgids leeromgeving op /admin/stijlgids

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Opmeettest tegen de bijlage

**Files:**
- Create: `tests/e2e/leeromgeving-stijl.spec.js`

**Interfaces:**
- Consumes: `/admin/stijlgids` met `data-stijlgids="optie-d"` uit Task 5; de ontwikkelaarslogin ("Admin testlogin").

- [ ] **Step 1: Schrijf de test**

`tests/e2e/leeromgeving-stijl.spec.js`:

```js
import { expect, test } from '@playwright/test';

// Meet de stijlgids op zoals Kevins bijlage (optie D) op 7 okt 2026 is opgemeten.
// Elke afwijking van de tabel in docs/LEEROMGEVING-STIJL.md is een fout.
test('de stijlgids heeft de maten van de bijlage', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: /Admin testlogin/i }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.goto('/admin/stijlgids');

  const kaart = page.locator('[data-stijlgids="optie-d"] .lo-kaart');
  await expect(kaart).toBeVisible();
  await page.evaluate(() => document.fonts.ready);

  const maten = await kaart.evaluate((el) => {
    const stijl = (selector) => {
      const node = selector ? el.querySelector(selector) : el;
      const s = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return {
        font: s.fontFamily, size: s.fontSize, weight: s.fontWeight, lh: s.lineHeight, color: s.color,
        bg: s.backgroundColor, padding: s.padding, radius: s.borderTopLeftRadius,
        border: `${s.borderTopWidth} ${s.borderTopStyle} ${s.borderTopColor}`, height: Math.round(rect.height)
      };
    };
    return {
      kaart: stijl(null),
      titel: stijl('.lo-kaart-titel'),
      uitleg: stijl('.lo-kaart-uitleg'),
      lijst: stijl('.lo-lijst'),
      rij: stijl('.lo-rij'),
      hblok: stijl('.lo-hblok'),
      rijtitel: stijl('.lo-rij .lo-rij-titel'),
      onderregel: stijl('.lo-rij .lo-onderregel'),
      start: stijl('.lo-rij .lo-knop-start'),
      paragrafen: stijl('.lo-paragrafen'),
      paragraaftitel: stijl('.lo-paragraafrij .lo-rij-titel'),
      paragraafregel: stijl('.lo-paragraafrij .lo-onderregel'),
      startHier: stijl('.lo-paragraafrij .lo-knop-start'),
      label: stijl('.lo-label'),
      lettertypeGeladen: document.fonts.check('15px "Atkinson Hyperlegible Next Variable"')
    };
  });

  const grijs = 'rgb(91, 86, 72)';
  const inkt = 'rgb(11, 13, 15)';

  expect(maten.lettertypeGeladen).toBe(true);
  expect(maten.kaart.font).toContain('Atkinson Hyperlegible Next');
  expect(maten.kaart).toMatchObject({ size: '15px', bg: 'rgb(255, 255, 255)', padding: '22px', radius: '20px' });
  expect(maten.titel).toMatchObject({ size: '20px', weight: '800', lh: '30px', color: inkt });
  expect(maten.uitleg).toMatchObject({ size: '14px', weight: '400', lh: '21px', color: grijs });
  expect(maten.lijst).toMatchObject({ radius: '12px', border: '1px solid rgb(232, 220, 195)' });
  expect(maten.rij.padding).toBe('10px 12px');
  expect(maten.hblok).toMatchObject({ size: '13px', weight: '800', bg: 'rgb(255, 211, 61)', radius: '8px', border: `2px solid ${inkt}`, height: 30 });
  expect(maten.rijtitel).toMatchObject({ size: '15px', weight: '700', lh: '22.5px', color: inkt });
  expect(maten.onderregel).toMatchObject({ size: '12.5px', weight: '400', lh: '18.75px', color: grijs });
  expect(maten.start).toMatchObject({ size: '13px', weight: '800', padding: '6px 10px', radius: '8px', bg: 'rgb(225, 240, 248)', color: 'rgb(6, 106, 153)', height: 34 });
  expect(maten.paragrafen.padding).toBe('0px 12px 10px 52px');
  expect(maten.paragraaftitel).toMatchObject({ size: '15px', weight: '700' });
  expect(maten.paragraafregel).toMatchObject({ size: '12.5px', color: grijs });
  expect(maten.startHier).toMatchObject({ size: '13px', weight: '800', padding: '6px 10px', height: 34 });
  expect(maten.label).toMatchObject({ size: '12px', weight: '800', padding: '2px 9px' });
});
```

- [ ] **Step 2: Draai de test**

Run: `npx playwright test tests/e2e/leeromgeving-stijl.spec.js --reporter=line`
Expected: 1 passed. Faalt een waarde, pas dan `src/styles/leeromgeving.css` aan (niet de test): de test is de bijlage.

- [ ] **Step 3: Draai ook de bestaande e2e-tests**

Run: `npx playwright test --reporter=line`
Expected: alle tests passed (de twee bestaande inlogtests en de nieuwe).

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/leeromgeving-stijl.spec.js
git commit -m "test(stijl): stijlgids opmeten tegen de maten van de bijlage

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Testen als leerling in optie D

**Files:**
- Modify: `src/pages/AdminTestenPage.jsx` (imports, `laden`, `startTestsessie`, de hele `return`)

**Interfaces:**
- Consumes: `groepeerOpLesstof`, `hoofdstukkenVanLessen` (Task 3); `aantalTekst`, `hoofdstukOnderregel`, `splitsParagraafLabel`, `testsessieDoelRoute` (Task 2); de bouwstenen (Task 4).
- Produces: elke kaart in `kaarten` krijgt een veld `vakNaam`; `startTestsessie(testaccount, doelRoute = '/')`.

- [ ] **Step 1: Pas de imports aan**

Vervang de lucide-import en voeg de nieuwe imports toe:

```jsx
import { AlertTriangle, Coins, House, Loader2, RefreshCw } from 'lucide-react';
```

```jsx
import { bouwKlasTestbeeld, bouwTestdataOverzicht, groepeerOpLesstof, hoofdstukkenVanLessen } from '../lib/testleerlingOverzicht';
import { aantalTekst, hoofdstukOnderregel, splitsParagraafLabel, testsessieDoelRoute } from '../lib/leeromgeving';
import { HoofdstukRij, Kaart, KaartKop, Keuzeknoppen, Label, PaginaKop, ParagraafRij, StartKnop } from '../components/leeromgeving';
```

(`ChevronDown`, `ChevronRight`, `FlaskConical` en `LogIn` vallen weg uit de lucide-import; ze zitten nu in de bouwstenen.)

- [ ] **Step 2: Haal de vaknaam op in `laden`**

Direct na de regel `const hoofdstukkenById = Object.fromEntries(...)`:

```jsx
      // De naam van het vak boven een groepskaart ("Digitale vaardigheden · 8 klassen").
      const vakIds = [...new Set(Object.values(hoofdstukkenById).map((hoofdstuk) => hoofdstuk.vakId).filter(Boolean))];
      const vakDocs = await Promise.all(vakIds.map((id) => getDoc(doc(db, 'vak', id)).catch(() => null)));
      const vakNaamById = Object.fromEntries(
        vakDocs.filter((vakDoc) => vakDoc?.exists?.()).map((vakDoc) => [vakDoc.id, vakDoc.data().name || vakDoc.data().naam || vakDoc.id])
      );
```

En in de `return` van de `rijen`-map:

```jsx
        const vakNaam = vakNaamById[hoofdstukkenById[beeld.lessen[0]?.hoofdstukId]?.vakId] || '';
        return { klas, testaccount, beeld, testdata, tokens, vakNaam };
```

- [ ] **Step 3: Start met een doelroute**

Vervang de functie `startTestsessie` door:

```jsx
  const startTestsessie = async (testaccount, doelRoute = '/') => {
    if (!testaccount) return;
    setFout('');
    setStartBezigUid(testaccount.uid);

    try {
      const resultaat = await startTestleerlingSessieCall({ uid: testaccount.uid });
      if (!resultaat.success) {
        setFout(resultaat.error || 'De testsessie kon niet gestart worden.');
        return;
      }
      await signInWithCustomToken(auth, resultaat.token);
      // Meteen naar de gekozen plek: de startpagina, een hoofdstuk of een paragraaf.
      navigate(doelRoute);
    } catch (error) {
      console.error('Inloggen als testleerling mislukt:', error);
      setFout('Inloggen als testleerling lukte niet. Start de testsessie opnieuw.');
    } finally {
      setStartBezigUid('');
    }
  };
```

- [ ] **Step 4: Status voor keuze en uitklappen, en de groepen**

Vervang `const [openTestdata, setOpenTestdata] = useState({});` door:

```jsx
  const [gekozenPerGroep, setGekozenPerGroep] = useState({});
  const [openHoofdstuk, setOpenHoofdstuk] = useState({});
```

En voeg na `const zonderTestaccount = useMemo(...)` toe:

```jsx
  const groepen = useMemo(() => groepeerOpLesstof(kaarten), [kaarten]);
  const bezig = startBezigUid !== '';
```

- [ ] **Step 5: Vervang de weergave**

Vervang alles vanaf `return (` tot het einde van de component door:

```jsx
  return (
    <div className="helix-page lo-tekst">
      <div className="helix-container flex flex-col gap-6 py-10 md:py-12">
        <PaginaKop
          eyebrow="Testen"
          titel="Testen als leerling"
          uitleg="Klassen die precies dezelfde lesstof zien, staan samen in één kaart. Kies een klas en start als testleerling op de startpagina, bij een hoofdstuk of meteen in een paragraaf. Wat je maakt, telt nergens mee."
          acties={(
            <button type="button" onClick={laden} className="lo-knop-tweede" disabled={loading}>
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
              Verversen
            </button>
          )}
        />

        {fout && <p className="lo-melding lo-melding--fout">{fout}</p>}

        {zonderTestaccount > 0 && !loading && (
          <p className="lo-melding lo-melding--info">
            {zonderTestaccount === 1 ? 'Eén klas heeft' : `${zonderTestaccount} klassen hebben`} nog geen testleerling.
            Draai <code className="font-mono">node scripts/maak-testleerlingen.mjs --apply</code> om ze aan te maken.
          </p>
        )}

        {loading ? (
          <p className="lo-melding lo-melding--info">
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Bezig met laden...
          </p>
        ) : (
          <div className="lo-kaartenraster">
            {groepen.map((groep) => {
              const kaart = groep.kaarten.find((item) => item.klas.id === gekozenPerGroep[groep.sleutel])
                || groep.kaarten.find((item) => item.testaccount)
                || groep.kaarten[0];
              const { klas, testaccount, beeld, testdata, tokens, vakNaam } = kaart;
              const hoofdstukken = hoofdstukkenVanLessen(beeld.lessen);
              const meer = groep.kaarten.length > 1;
              const inclusie = hoofdstukken.some((hoofdstuk) => hoofdstuk.inclusie);
              const startUit = !testaccount || bezig;
              const start = (doel) => startTestsessie(testaccount, testsessieDoelRoute(doel));

              return (
                <Kaart key={groep.sleutel} inclusie={inclusie}>
                  {meer ? (
                    <KaartKop
                      titel={`${vakNaam ? `${vakNaam} · ` : ''}${groep.kaarten.length} klassen`}
                      uitleg="Deze klassen zien precies dezelfde lesstof. Elke klas heeft wel een eigen testleerling."
                    />
                  ) : (
                    <KaartKop
                      kolf
                      titel={klasNaam(klas)}
                      uitleg={inclusie
                        ? 'Inclusieklas: krijgt de inclusieversie van elk hoofdstuk.'
                        : `${vakNaam ? `${vakNaam} · ` : ''}leerroute ${beeld.route || 'geen'}`}
                    />
                  )}

                  {meer && (
                    <Keuzeknoppen
                      label="Log in als testleerling van"
                      opties={groep.kaarten.map((item) => ({ id: item.klas.id, naam: klasNaam(item.klas) }))}
                      gekozen={klas.id}
                      onKies={(id) => setGekozenPerGroep((stand) => ({ ...stand, [groep.sleutel]: id }))}
                    />
                  )}

                  {!testaccount && (
                    <p className="lo-melding lo-melding--fout">Nog geen testleerling voor {klasNaam(klas)}.</p>
                  )}

                  {hoofdstukken.length === 0 ? (
                    <p className="lo-melding lo-melding--info">Voor deze klas staat geen lesstof klaar.</p>
                  ) : (
                    <div className="lo-lijst">
                      {hoofdstukken.map((hoofdstuk) => {
                        const sleutel = `${groep.sleutel}|${hoofdstuk.id}`;
                        return (
                          <HoofdstukRij
                            key={hoofdstuk.id || sleutel}
                            nummer={hoofdstuk.nummer}
                            titel={hoofdstuk.titel}
                            onderregel={hoofdstukOnderregel({ paragrafen: hoofdstuk.lessen.length, lesblokken: hoofdstuk.aantalBlokken })}
                            labels={hoofdstuk.inclusie ? <Label kleur="paars">inclusie</Label> : null}
                            opSlot={hoofdstuk.opSlot}
                            open={openHoofdstuk[sleutel] === true}
                            onWissel={() => setOpenHoofdstuk((stand) => ({ ...stand, [sleutel]: !stand[sleutel] }))}
                            onStart={() => start({ soort: 'hoofdstuk', id: hoofdstuk.id })}
                            startUit={startUit}
                          >
                            {hoofdstuk.lessen.map((les) => {
                              const { code, naam } = splitsParagraafLabel(les.label);
                              const regel = testdata?.regels.find((item) => item.paragraafId === les.id);
                              const onderregel = [
                                aantalTekst(les.aantalBlokken, 'lesblok', 'lesblokken'),
                                regel?.afgerond ? `testleerling ${regel.afgerond} van ${regel.totaal} af` : ''
                              ].filter(Boolean).join(' · ');
                              return (
                                <ParagraafRij
                                  key={les.id}
                                  code={code}
                                  naam={naam}
                                  onderregel={onderregel}
                                  onStart={() => start({ soort: 'paragraaf', id: les.id })}
                                  startUit={startUit || les.opSlot}
                                />
                              );
                            })}
                          </HoofdstukRij>
                        );
                      })}
                    </div>
                  )}

                  {beeld.problemen.length > 0 && (
                    <ul className="flex flex-col gap-2">
                      {beeld.problemen.map((probleem) => (
                        <li key={`${probleem.soort}-${probleem.paragraafId}`} className="lo-melding lo-melding--fout">
                          <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                          <span>{probleem.tekst}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="lo-kaart-voet">
                    <span className="inline-flex flex-wrap items-center gap-2">
                      {testdata?.totaalRecords
                        ? <Label kleur="blauw">{aantalTekst(testdata.totaalRecords, 'testrecord', 'testrecords')}</Label>
                        : <span>Nog geen testdata</span>}
                      <span className="lo-tokens"><Coins size={15} aria-hidden="true" />{tokens ?? 0}</span>
                      {testdata?.laatsteActiviteitMs ? <span>Laatste activiteit: {datumLabel(testdata.laatsteActiviteitMs)}</span> : null}
                    </span>
                    <StartKnop icoon={startBezigUid === testaccount?.uid ? Loader2 : House} onClick={() => start({ soort: 'start' })} disabled={startUit}>
                      Start op de startpagina
                    </StartKnop>
                  </div>
                </Kaart>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Lint, tests en build**

Run: `npx eslint src/pages/AdminTestenPage.jsx && node --test src/lib/ && npm run build 2>&1 | tail -3`
Expected: geen eslint-meldingen (geen ongebruikte imports meer), alle tests PASS, build slaagt.

- [ ] **Step 7: Bekijk de pagina**

In de dev-server (zie Task 5 stap 5) met "Admin testlogin" naar `/admin/testen`. De ontwikkelaarsadmin is niet bij Firebase aangemeld, dus de klassen laden mogelijk niet; dan toont de pagina de foutmelding "De klassen konden niet geladen worden." in de nieuwe stijl. Controleer dat er geen consolefouten van de render zelf zijn (`read_console_messages` met `onlyErrors`). De echte controle doet Kevin in Task 8.

- [ ] **Step 8: Commit**

```bash
git add src/pages/AdminTestenPage.jsx
git commit -m "feat(testen): Testen als leerling in optie D

Klassen met dezelfde lesstof in één kaart, starten op de startpagina, bij een
hoofdstuk of in een paragraaf. In de HELIX Leeromgeving-stijl.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Fase 1 afronden, markeren, live zetten en laten testen

**Files:**
- Modify: `docs/HANDOFF.md` (paragraaf 4 tabel, paragraaf 5, paragraaf 6)

- [ ] **Step 1: Alles nog één keer**

Run: `npx eslint src/styles src/lib/leeromgeving.js src/lib/testleerlingOverzicht.js src/components/leeromgeving src/pages/AdminStijlgidsPage.jsx src/pages/AdminTestenPage.jsx src/pages/AdminSettingsPage.jsx src/App.jsx && node --test src/lib/ && npm run build 2>&1 | tail -3 && npx playwright test --reporter=line`
Expected: geen eslint-meldingen, alle unit-tests PASS, build slaagt, alle e2e-tests passed.

- [ ] **Step 2: Werk de handoff bij**

In `docs/HANDOFF.md`:
- paragraaf 4, tabel met scripts: geen wijziging (geen nieuw script).
- paragraaf 5, onder "Digitale vaardigheden" na de alinea over het backuppunt:

```markdown
**7 oktober: HELIX Leeromgeving-stijl, fase 1 live.** De website heeft een eigen
stijl, los van het Slide Design System: `docs/LEEROMGEVING-STIJL.md`,
`src/styles/leeromgeving.css` (tokens `--lo-*`, klassen `.lo-*`) en de bouwstenen
in `src/components/leeromgeving/`. Stijlgids op `/admin/stijlgids` (ingang op
Instellingen), opgemeten door `tests/e2e/leeromgeving-stijl.spec.js`. Testen als
leerling staat in optie D: klassen met dezelfde lesstof in één kaart, en starten
kan op de startpagina, bij een hoofdstuk of in een paragraaf. Markering
`leeromgeving-fase-1`, Vercel-deploy `<id uit stap 5>`. Volgende fase: de
leerlingomgeving (ontwerp paragraaf 3.2).
```

- paragraaf 6: bovenaan het punt toevoegen `**Leeromgeving-stijl fase 2**: inlogpagina's en leerlingomgeving, volgens docs/superpowers/specs/2026-10-07-leeromgeving-stijl-design.md, paragraaf 3.2. Eerst een plan.`

- [ ] **Step 3: Commit en markeer**

```bash
git add docs/HANDOFF.md
git commit -m "docs(handoff): Leeromgeving-stijl fase 1 live

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git tag -a leeromgeving-fase-1 -m "HELIX Leeromgeving-stijl fase 1: stijl, bouwstenen, stijlgids, Testen in optie D"
git push origin codex/digitale-vaardigheden-seed --follow-tags
```

- [ ] **Step 4: Deploy**

Run: `npx vercel --prod --yes 2>&1 | grep -E "Production|Inspect|Error"`
Expected: een regel `Production  https://helix-...vercel.app` en geen `Error`.

- [ ] **Step 5: Controleer de live versie en noteer de deploy**

Run: `curl -s https://dvdacapo.vercel.app/ | grep -o 'assets/index-[A-Za-z0-9_-]*\.css' | head -1 | xargs -I{} curl -s https://dvdacapo.vercel.app/{} | grep -c "lo-hblok"` en `npx vercel inspect https://dvdacapo.vercel.app 2>&1 | grep -E "^\s*id|url" | head -2`
Expected: een getal groter dan 0 (de nieuwe stijl staat live) en de deploy-id. Zet die id in de alinea uit stap 2 (vervang `<id uit stap 5>`), commit met `git add docs/HANDOFF.md && git commit -m "docs(handoff): deploy-id fase 1" ` (met de Co-Authored-By-regel) en `git push`.

- [ ] **Step 6: Vraag Kevin om de testronde**

Vraag Kevin op `https://dvdacapo.vercel.app/admin/testen`:
1. de vier kaarten te bekijken (ER3L1A, ER3L2A, de acht vmbo-klassen samen, H1i1);
2. bij H1i1 "Start" naast hoofdstuk 2 te klikken: hij moet op de hoofdstukpagina van hoofdstuk 2 binnenkomen;
3. na "Terug naar beheer" bij ER3L1A hoofdstuk 2 uit te klappen en "Start hier" bij 2.3 Dichtheid te klikken: hij moet in de les van 2.3 binnenkomen;
4. `/admin/stijlgids` te bekijken.

Komt hij bij stap 2 of 3 op de startpagina uit in plaats van op de gekozen plek, dan overschrijft iets na het inloggen de route (spec 6, risico 3). Zoek dat dan op in `src/components/auth/AuthProvider.jsx` en `ClassSelectionModal.jsx` voordat fase 2 begint.
```

---

## Self-review

- **Spec-dekking.** Fase 0 (spec 4, rij 0): Task 0. Fase 1 (spec 4, rij 1): tokens en CSS (spec 2.1-2.3) Task 1; stijldocument (spec 1, 3.4) Task 1; bouwstenen (spec 2.3) Task 4; stijlgids (spec 5) Task 5; opmeten tegen de tabel (spec 5) Task 6; Testen optie D met groeperen en doelroute (spec 3.1) Task 3 en 7; pure functies met tests (spec 5) Task 2 en 3; markeren, deployen, handoff en Kevins testronde (spec 4) Task 8. `designTokenStyles.test.js` (spec 5) bewaakt de oude klassen die in fase 1 niet veranderen; hij wordt bijgewerkt in de fasen die die klassen aanpassen. De nieuwe stijl wordt bewaakt door `leeromgevingStijl.test.js` (Task 1).
- **Geen open plekken.** De enige in te vullen waarden zijn de deploy-id's, die pas bestaan bij het uitvoeren (Task 0 stap 2, Task 8 stap 5).
- **Namen kloppen.** `groepeerOpLesstof`, `hoofdstukkenVanLessen`, `aantalTekst`, `hoofdstukOnderregel`, `splitsParagraafLabel`, `testsessieDoelRoute`, `zonderHoofdstukVoorvoegsel`; props `startUit`, `icoon`, `onWissel`, `onStart` zijn in Task 4 gedefinieerd en zo gebruikt in Task 5 en 7.
