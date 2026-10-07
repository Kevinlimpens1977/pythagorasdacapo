# HELIX Leeromgeving-stijl, fase 3: implementatieplan (docentomgeving)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** De docent- en beheeromgeving in de leeromgeving-stijl: de menubalk van beheer met knoppen op één regel, de paginakoppen met een knoppenbalk die netjes afbreekt (Kevin, 7 okt 2026: "Testen als leerling" stond op drie regels), de overzichtspagina's, de lijsten en formulieren, en als laatste de grote werktuigen (Klaarzetten, Voortgang, lesstofeditor). Plus het laadlogo op beheerpagina's.

**Architecture:** Twee lagen. (1) Gedeelde CSS (Task 1): een paar nieuwe bouwstenen in `src/styles/leeromgeving.css` (`.lo-knop--klein`, `.lo-knop--gevaar`, `.lo-knop-tweede--gevaar`, `.lo-knoppenbalk`, `.lo-melding--goed`, knoppen op één regel, een paginakop waarvan de tekst niet meer samengedrukt wordt) en een scope `.beheer-stijl` onderaan `src/index.css` die de oude gedeelde klassen (`helix-card`, `helix-surface`, `btn-primary`, `btn-secondary`, `btn-tool`, `helix-btn-solid`, `input-standard`, `helix-eyebrow`, `helix-heading-xl`, `helix-badge*`, `helix-alert`, `helix-action-card`, `dashboard-lens-tab`, `studio-toolbar-control`) binnen beheerpagina's het nieuwe uiterlijk geeft. (2) Per pagina (Task 2-10): `beheer-stijl` op de wortel van de pagina, koppen naar `PaginaKop`, knoppenrijen naar `.lo-knoppenbalk`, en de losse Tailwind-kleuren, hoofdletters en `font-black` naar de bouwstenen. Task 2-10 raken elk andere bestanden en kunnen tegelijk lopen, elk in een eigen werkkopie.

**Tech Stack:** React 19, Vite, Tailwind 4 (native cascade layers), lucide-react, node:test, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-07-leeromgeving-stijl-design.md` (paragraaf 3.3). Inventarissen: `exports/leeromgeving/fase-3-knoppenbalken-inventaris.md`, `fase-3-inventaris-overzicht.md`, `fase-3-inventaris-lijsten.md`, `fase-3-inventaris-werktuigen.md`.

## Global Constraints

- Productietak `codex/digitale-vaardigheden-seed`. Nooit `git add -A`/`git add .`; noem paden. `.claude/launch.json` blijft buiten de commits. Commits Nederlands met voorvoegsel, eindigend op exact `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Push, markering en deploy alleen in de laatste taak (controller).
- **Alleen het uiterlijk.** Geen handlers, state, effecten, voorwaarden, services, Firestore-aanroepen of volgorde veranderen. `aria-*`, `role`, `id`, `htmlFor`, `title`, `key`, `ref` en toetsenbord-/Escape-afhandeling blijven. Uitzondering die per taak genoemd wordt: Vrijgeven (Task 4).
- **Teksten blijven gelijk**, behalve waar een taak het noemt. Geen nieuwe zichtbare tekst.
- **Eigen beeld, niet aanraken:** `DigibordViewer`, `PdfSlideDeckPresenter`, de presenter (`src/components/presenter/**`, `AdminPresenterPage`), `ImageCanvasEditor`, `CropSelectionOverlay`, `StudentAvatar`, `NulmetingProfielKaart` (gedeeld met het leerlingprofiel), `src/lib/learningResultUtils.js`, `src/services/meldingenService.js`, de spellen (`src/games/**`), `CertificaatPage`. Leerlingpagina's niet aanraken (die zijn af).
- **Bestandseigendom.** Een taak verandert alleen de bestanden in zijn eigen lijst. `src/index.css`, `src/styles/leeromgeving.css`, `src/lib/designTokenStyles.test.js`, `src/lib/leeromgevingStijl.test.js` en `src/pages/AdminStijlgidsPage.jsx` zijn alleen van Task 1. `src/components/layout/AppShell.jsx` alleen van Task 2.
- **Cascade.** Ongelaagde klassen in `src/index.css` winnen van Tailwind en van `.lo-*`. Binnen `.beheer-stijl` zien de oude gedeelde klassen er al nieuw uit (Task 1), dus die mogen blijven staan; zet er geen `.lo-*` naast. Wil je een element echt in een bouwsteen gieten, vervang de oude klasse dan. Tailwind-utilities winnen wel van `.lo-*`.
- **Vastgepinde teksten in tests** (blijven letterlijk): zie de lijst in `fase-3-inventaris-werktuigen.md` onder Tests, plus: `designTokenStyles.test.js` zoekt in AppShell drie regels (`const handleLogoClick = () =>`, `navigate(isAdmin ? '/admin/lesstof' : '/')`, `aria-label={isAdmin ? 'Ga naar Lesstof' : 'Ga naar HELIX start'}`); in ClassOverview de string `helix-card border-orange-100 bg-orange-50/45`; in TakenToewijzen `dashboard-lens-tab` en `btn-secondary`; in CmsShell de layoutklassen; in ContentBlockBuilder `studio-toolbar-control` en de dnd-namen; in CropEditorPanel `presenter-chrome-surface` en `btn-secondary`; in NavigationTree `title="Bewerkingsopties"`, `Pencil`, `Trash2`. De e2e-test verwacht op `/admin/ai-instellingen` de kop "Digidocent instellingen" en de modelnamen, en dat beheer na inloggen op `/admin/instellingen` komt.
- **Vertaaltabel** (naast de tabel in `docs/superpowers/plans/2026-10-07-leeromgeving-stijl-fase-2c.md`, Global Constraints, die ook hier geldt):

| Oud | Nieuw |
| --- | --- |
| kop met `helix-eyebrow` + `helix-heading-xl` + `helix-muted`-uitleg + knoppen | `<PaginaKop eyebrow titel uitleg acties={<div className="lo-knoppenbalk">…</div>} />` |
| rij knoppen (`btn-tool`, losse knoppen) in een kop of balk | `.lo-knoppenbalk` met `lo-knop-tweede lo-knop--klein` (iconen 16px) |
| gevaarlijke handeling (wissen, resetten) | `lo-knop lo-knop--gevaar`; de knop die het venster opent `lo-knop-tweede lo-knop--klein lo-knop-tweede--gevaar` |
| groene succesmelding | `lo-melding lo-melding--goed` |
| `helix-alert`, oranje/amber waarschuwing | `lo-melding lo-melding--info` of `lo-label--oranje` |
| tabel | `w-full text-sm` met kop `text-[13px] font-extrabold text-[var(--lo-grijs)]` (geen hoofdletters), rijen `border-t border-[var(--lo-lijn)]` |
| kleine kopjes `text-[11px] font-black uppercase tracking-*` | `lo-onderregel font-bold` of `lo-eyebrow` als het echt een eyebrow is |
| statuschips in slate/amber/rose/emerald | `Label` / `lo-label--blauw/groen/oranje/rood/paars` |
| `select`, `input`, `textarea` met eigen randen | `lo-invoer` (of `input-standard` binnen `.beheer-stijl`) |
| tegels/filters met `aria-pressed` | `lo-keuzes` > `lo-keuze` |
| `HelixBrandBanner` | `PaginaKop` (of `KaartKop` in een venster) |
| laadstaat van een pagina of sectie (Loader2 met tekst, "… laden...", pulse-skelet) | `<HelixLaden tekst="…" />` (in een paneel met `className="min-h-0 py-10"`); spinners in knoppen blijven |
| emoji in tekst of iconen | lucide-icoon (alleen als de emoji decoratie is; tekst blijft verder gelijk) |

- **Werken in een eigen werkkopie (Task 2-10).** Je draait in een git-worktree. Maak eerst een koppeling naar de geïnstalleerde pakketten: `cmd //c mklink /J node_modules "C:\Projecten\helix leerplatform\node_modules"` (in de wortel van je werkkopie). Draai daarna alleen `npx eslint <je bestanden>` en `node --test src/lib/`. Draai **geen** `npm run build`, geen dev-server en geen Playwright (de controller doet dat na het samenvoegen). Commit op de tak van je werkkopie; niet pushen.
- Na elke taak in je rapport: `grep -n "ds-display\|ds-anchor\|uppercase\|font-black\|#[0-9A-Fa-f]\{6\}" <je bestanden>` met uitleg bij wat bleef, en `git diff -U0 <base> -- <je bestanden> | grep '^[-+]' | grep -v className` (verwacht: imports, wrapperwissels, en wat de taak noemt).

---

### Task 1: Gedeelde bouwstenen en de scope `.beheer-stijl`

**Files:**
- Modify: `src/styles/leeromgeving.css`, `src/index.css` (alleen onderaan), `src/lib/leeromgevingStijl.test.js`, `src/lib/designTokenStyles.test.js`, `src/pages/AdminStijlgidsPage.jsx`, `tests/e2e/leeromgeving-stijl.spec.js`

**Interfaces (Produces):** klassen `.lo-knop--klein`, `.lo-knop--gevaar`, `.lo-knop-tweede--gevaar`, `.lo-knoppenbalk`, `.lo-melding--goed`; `.lo-knop` en `.lo-knop-tweede` breken niet meer af; `.lo-paginakop` geeft de tekst ruimte; scope `.beheer-stijl`.

- [ ] **Step 1: Falende tests.** Onderaan `src/lib/leeromgevingStijl.test.js`:

```js
test('knoppen blijven op één regel en er zijn kleine, gevaarlijke en succesvarianten', () => {
  assert.match(regel('.lo-knop'), /white-space:\s*nowrap/);
  assert.match(regel('.lo-knop-tweede'), /white-space:\s*nowrap/);
  assert.match(regel('.lo-knop--klein'), /padding:\s*7px 12px/);
  assert.match(regel('.lo-knop--gevaar'), /background:\s*var\(--lo-rood-inkt\)/);
  assert.match(regel('.lo-knop-tweede--gevaar'), /color:\s*var\(--lo-rood-inkt\)/);
  assert.match(regel('.lo-knoppenbalk'), /flex-wrap:\s*wrap/);
  assert.match(regel('.lo-melding--goed'), /background:\s*var\(--lo-groen-zacht\)/);
  assert.match(regel('.lo-paginakop > :first-child'), /flex:\s*1 1 24rem/);
});
```

In `src/lib/designTokenStyles.test.js`: vervang `assert.match(adminKlassenPage, /dashboard-lens-tab/);` door `assert.match(adminKlassenPage, /dashboard-lens-tab|lo-keuze/);` en voeg onderaan toe:

```js
test('beheerpaginas krijgen de leeromgeving-stijl via .beheer-stijl, onder de basisregels', () => {
  const scope = css.indexOf('\n.beheer-stijl .btn-primary,');
  assert.notEqual(scope, -1);
  for (const basis of ['\n.btn-primary {', '\n.btn-secondary {', '\n.btn-tool {', '\n.helix-card {', '\n.helix-action-card {', '\n.dashboard-lens-tab {', '\n.studio-toolbar-control {']) {
    assert.ok(css.indexOf(basis) !== -1 && css.indexOf(basis) < scope, `${basis.trim()} moet boven de scope staan`);
  }
  assert.match(css, /\.beheer-stijl \.helix-card,\s*\n\.beheer-stijl \.helix-surface \{[^}]*box-shadow:\s*var\(--lo-schaduw-kaart\)/);
  assert.match(css, /\.beheer-stijl \.btn-tool \{[^}]*white-space:\s*nowrap/);
});
```

(Controleer eerst hoe `css` in dat testbestand heet; gebruik die naam. Bestaat `\n.helix-card {` niet letterlijk, kijk dan hoe de regel begint en pas de zoekstring aan.)

Run: `node --test src/lib/leeromgevingStijl.test.js src/lib/designTokenStyles.test.js` → FAIL.

- [ ] **Step 2: Bouwstenen in `src/styles/leeromgeving.css`.**
  - Voeg aan de regel `.lo-knop { … }` toe: `white-space: nowrap; flex: none;`. Idem aan `.lo-knop-tweede { … }`.
  - Na de regel `.lo-knop-start:disabled { … }`:

```css
  .lo-knop--klein { gap: 6px; padding: 7px 12px; font-size: 14px; line-height: 21px; }
  .lo-knop--gevaar { background: var(--lo-rood-inkt); box-shadow: none; }
  .lo-knop--gevaar:hover:not(:disabled) { background: var(--lo-rood-inkt); box-shadow: 0 0 0 3px var(--lo-rood-zacht); }
  .lo-knop-tweede--gevaar { color: var(--lo-rood-inkt); }
  .lo-knop-tweede--gevaar:hover:not(:disabled) { border-color: var(--lo-rood); background: var(--lo-rood-zacht); }
  /* Een rij knoppen die afbreekt naar een volgende regel in plaats van de knoppen samen te drukken. */
  .lo-knoppenbalk { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
```

  - Na `.lo-melding--info { … }`: `.lo-melding--goed { background: var(--lo-groen-zacht); color: var(--lo-groen-inkt); }`
  - Na `.lo-paginakop { … }`: `.lo-paginakop > :first-child { flex: 1 1 24rem; min-width: 0; }`

- [ ] **Step 3: De scope onderaan `src/index.css`** (na het `.study-stijl`-blok):

```css

/* ==========================================================================
   Leeromgeving-stijl in de docentomgeving (fase 3).
   Elke beheerpagina zet `beheer-stijl` op haar wortel. Daarbinnen krijgen de
   oude gedeelde klassen het uiterlijk van de leeromgeving: alleen kleur, rand,
   hoek, letter en schaduw; binnenmarges en breedtes blijven. Moet onder de
   basisregels staan: designTokenStyles.test.js leest per klasse de eerste regel.
   ========================================================================== */
.beheer-stijl .btn-primary,
.beheer-stijl .helix-btn-solid {
  border: 2px solid transparent;
  border-radius: var(--lo-hoek-m);
  background: var(--lo-blauw);
  color: var(--lo-kaart);
  box-shadow: var(--lo-schaduw-knop);
  font-family: var(--lo-letter);
  font-weight: 800;
  white-space: nowrap;
}

.beheer-stijl .btn-primary:hover:not(:disabled),
.beheer-stijl .helix-btn-solid:hover:not(:disabled) {
  background: var(--lo-blauw-inkt);
  translate: none;
}

.beheer-stijl .btn-primary:disabled,
.beheer-stijl .helix-btn-solid:disabled {
  border-color: transparent;
  background: var(--lo-papier-2);
  color: var(--lo-grijs);
  box-shadow: none;
  opacity: 1;
}

.beheer-stijl .btn-primary:focus-visible,
.beheer-stijl .helix-btn-solid:focus-visible {
  box-shadow: var(--lo-schaduw-knop), 0 0 0 3px var(--lo-papier), 0 0 0 6px var(--lo-blauw);
}

.beheer-stijl .btn-secondary,
.beheer-stijl .btn-tool {
  border: 1px solid var(--lo-lijn);
  border-radius: var(--lo-hoek-m);
  background: var(--lo-kaart);
  color: var(--lo-inkt);
  font-family: var(--lo-letter);
  font-weight: 700;
  white-space: nowrap;
}

.beheer-stijl .btn-tool {
  flex: none;
}

.beheer-stijl .btn-tool svg {
  color: var(--lo-grijs);
}

.beheer-stijl .btn-secondary:hover:not(:disabled),
.beheer-stijl .btn-secondary:focus-visible,
.beheer-stijl .btn-tool:hover:not(:disabled) {
  border-color: var(--lo-blauw);
  background: var(--lo-kaart);
  color: var(--lo-inkt);
}

.beheer-stijl .btn-secondary:disabled,
.beheer-stijl .btn-tool:disabled {
  border-color: var(--lo-lijn);
  background: var(--lo-papier-2);
  color: var(--lo-grijs);
  opacity: 1;
}

.beheer-stijl .helix-eyebrow {
  color: var(--lo-blauw-inkt);
  font-family: var(--lo-letter);
  font-size: 12px;
  line-height: 18px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.beheer-stijl .helix-heading-xl {
  color: var(--lo-inkt);
  font-family: var(--lo-letter);
  font-weight: 800;
  letter-spacing: -0.01em;
}

.beheer-stijl .input-standard {
  border: 1px solid var(--lo-lijn);
  border-radius: var(--lo-hoek-m);
  background: var(--lo-kaart);
  color: var(--lo-inkt);
}

.beheer-stijl .input-standard:focus {
  border-color: var(--lo-blauw);
  background: var(--lo-kaart);
}

.beheer-stijl .helix-card,
.beheer-stijl .helix-surface {
  border: none;
  border-radius: var(--lo-hoek-xl);
  background: var(--lo-kaart);
  box-shadow: var(--lo-schaduw-kaart);
}

.beheer-stijl .helix-action-card {
  border: 1px solid var(--lo-lijn);
  border-radius: var(--lo-hoek-l);
  background: var(--lo-kaart);
  color: var(--lo-inkt);
  box-shadow: none;
}

.beheer-stijl .helix-action-card:hover:not(:disabled),
.beheer-stijl .helix-action-card:focus-visible {
  border-color: var(--lo-blauw);
  background: var(--lo-kaart);
}

.beheer-stijl .helix-action-card-active,
.beheer-stijl .helix-action-card-active:hover:not(:disabled) {
  border-color: var(--lo-inkt);
  background: var(--lo-geel-zacht);
}

.beheer-stijl .dashboard-lens-tab,
.beheer-stijl .studio-toolbar-control {
  border: 2px solid var(--lo-lijn);
  background: var(--lo-kaart);
  color: var(--lo-inkt);
  font-family: var(--lo-letter);
  font-weight: 800;
  box-shadow: none;
}

.beheer-stijl .dashboard-lens-tab:hover:not(:disabled),
.beheer-stijl .studio-toolbar-control:hover:not(:disabled) {
  border-color: var(--lo-blauw);
  background: var(--lo-kaart);
}

.beheer-stijl .dashboard-lens-tab-active,
.beheer-stijl .dashboard-lens-tab-active:hover:not(:disabled) {
  border-color: var(--lo-inkt);
  background: var(--lo-inkt);
  color: var(--lo-papier);
}

.beheer-stijl .studio-toolbar-control-active,
.beheer-stijl .studio-toolbar-control-active:hover:not(:disabled) {
  border-color: var(--lo-inkt);
  background: var(--lo-geel-zacht);
  color: var(--lo-inkt);
}

.beheer-stijl .helix-alert {
  border: none;
  border-radius: var(--lo-hoek-m);
  background: var(--lo-oranje-zacht);
  color: var(--lo-inkt);
}

.beheer-stijl .helix-badge {
  border: none;
  border-radius: 999px;
  background: var(--lo-blauw-zacht);
  color: var(--lo-blauw-inkt);
  font-weight: 800;
  letter-spacing: 0;
  text-transform: none;
}

.beheer-stijl .helix-badge-success {
  background: var(--lo-groen-zacht);
  color: var(--lo-groen-inkt);
}

.beheer-stijl .helix-badge-warning {
  background: var(--lo-oranje-zacht);
  color: var(--lo-oranje-inkt);
}

.beheer-stijl .helix-badge-danger {
  background: var(--lo-rood-zacht);
  color: var(--lo-rood-inkt);
}

.beheer-stijl .helix-muted {
  color: var(--lo-grijs);
}
```

Controleer eerst in `src/index.css` dat `.helix-badge-success`, `.helix-badge-warning`, `.helix-badge-danger`, `.helix-action-card-active` en `.studio-toolbar-control-active` zo heten; laat een regel weg als de basisklasse niet bestaat en noem dat.

- [ ] **Step 4: Stijlgids.** In `src/pages/AdminStijlgidsPage.jsx` een raster `data-stijlgids="beheer"` met `className="beheer-stijl lo-kaartenraster"`, met één `Kaart` "Knoppen in beheer": een `div.lo-knoppenbalk` met zeven knoppen `lo-knop-tweede lo-knop--klein` en een lucide-icoon van 16px ("Klassen beheren", "Tokenbeheer", "Testen als leerling", "Auth synchroniseren", "Leerlingnummers koppelen", "Foto's importeren", "Archief"), daaronder `btn-tool min-h-12 px-5 text-sm` "Oude knop in de scope", een `lo-knop lo-knop--gevaar` "Leerlingen wissen", een `lo-knop-tweede lo-knop--klein lo-knop-tweede--gevaar` "Reset CMS", `lo-melding lo-melding--goed` "Opgeslagen.", en een `helix-card p-5` met `helix-eyebrow` "Werkplek" en een `helix-badge helix-badge-success` "Actief". Plus een tweede `Kaart` met `<PaginaKop eyebrow="Werkplek" titel="Leerlingen" uitleg="Bekijk leerlingaccounts, gekoppelde klassen, accountstatus en wachtwoordbeheer." acties={<div className="lo-knoppenbalk">…drie van die knoppen…</div>} />`.

- [ ] **Step 5: E2e-meting.** Onderaan `tests/e2e/leeromgeving-stijl.spec.js` een test die als beheerder `/admin/stijlgids` opent en in `[data-stijlgids="beheer"]` meet: elke `.lo-knoppenbalk .lo-knop-tweede` is één regel (`getBoundingClientRect().height` ≤ 40) en heeft `white-space: nowrap`; `.btn-tool` heeft rand `1px solid rgb(232, 220, 195)` en `white-space: nowrap`; `.helix-card` heeft `border-top-width: 0px`, radius `20px`, achtergrond wit; `.helix-badge` heeft `text-transform: none`; `.lo-knop--gevaar` heeft achtergrond `rgb(180, 47, 37)`. Volg de opbouw van de bestaande tests in dat bestand (inloggen via `/login/beheer`, "Als beheerder").

- [ ] **Step 6: Controleren en commit.** `node --test src/lib/`, `npx eslint src/pages/AdminStijlgidsPage.jsx src/lib/leeromgevingStijl.test.js src/lib/designTokenStyles.test.js tests/e2e/leeromgeving-stijl.spec.js`, `npm run build`, `npx playwright test tests/e2e/leeromgeving-stijl.spec.js --reporter=line` (bij EPERM op `test-results/`: `--output="$TEMP/pw-3"`). Commit de zes paden: `style(beheer): bouwstenen voor knoppenbalken en de scope beheer-stijl`.

---

### Task 2: Menubalk van beheer, Help en de twee gevaarknoppen

**Files:** `src/components/layout/AppShell.jsx` (alleen het beheerdeel), `src/components/admin/HelpPaneel.jsx`, `src/components/admin/DeleteStudentsButton.jsx`, `src/components/admin/CmsResetButton.jsx`.
**Inventaris:** `fase-3-knoppenbalken-inventaris.md` (A) en `fase-3-inventaris-overzicht.md` (AppShell, HelpPaneel, Delete/CmsReset).

- Nav (ca. 129-160): de beheertabs worden `lo-keuze` (zoals het leerlingdeel, ca. 161-177) met `aria-current={isActive ? 'page' : undefined}`; de wrapper `lo-keuzes flex-nowrap`. Labels tonen vanaf `lg` (`hidden lg:inline`), daaronder alleen het icoon (de knop houdt een `aria-label` of `title` met het label; voeg `aria-label={label}` toe, dat is geen zichtbare tekst). De alertstip blijft. De nav mag niet meer afkappen: geen `max-w-[54vw]`; de linkergroep `min-w-0`, de nav `overflow-x-auto` met verborgen balk mag blijven als laatste redmiddel.
- Rechtergroep (ca. 185): `shrink-0` en `gap-2`. Help, Wis leerlingen, Reset CMS: de knop die het venster opent wordt `lo-knop-tweede lo-knop--klein` (Wis en Reset met `lo-knop-tweede--gevaar`), iconen 16px, geen hoofdletters, labels op één regel. Hun zichtbaarheid per breedte blijft zoals hij is. Reset testmodus (alleen dev): `lo-knop-tweede lo-knop--klein` met oranje tekst `text-[var(--lo-oranje-inkt)]`.
- Naam en badge (ca. 282-287): badge "Administrator" → `<Label kleur="oranje">Administrator</Label>`; naam `text-sm font-bold text-[var(--lo-inkt)]`. Uitloggen krijgt `aria-label="Uitloggen"` (bestaat als `title`).
- Laat het leerlingdeel, de wrapper (112), de header (117), Spellen (202-215) en de drie vastgepinde regels ongemoeid.
- `HelpPaneel`: de gele band met `ds-anchor`/`ds-display` (50-55) → een kop `lo-kaart-titel` "Help" met een sluitknop `lo-knop-tweede h-10 w-10 justify-center p-0`; de aside een witte kaart (`bg-[var(--lo-kaart)]`, rand links `border-l border-[var(--lo-lijn)]`, `shadow-[var(--lo-schaduw-kaart)]`); de overlay `bg-[rgba(11,13,15,0.3)]` mag blijven als `bg-[var(--lo-inkt)]/30`; onderwerpchips → `lo-keuzes`/`lo-keuze` met de bestaande gekozen-staat (zet `aria-pressed`); optiekaarten → `rounded-[var(--lo-hoek-l)] border border-[var(--lo-lijn)] bg-[var(--lo-kaart)] p-4`; StatusLabel → `Label` groen/oranje; "Let op"-vak → `lo-melding lo-melding--info`; koppen `font-extrabold`.
- `DeleteStudentsButton`, `CmsResetButton`: venster `lo-kaart` met `max-w-…` zoals nu; rode eyebrow → `lo-eyebrow text-[var(--lo-rood-inkt)]`; waarschuwing → `lo-melding lo-melding--fout`; bevestigingsinvoer → `lo-invoer`; fout → `lo-melding--fout`; resultaat → `lo-melding--goed`; amber keuzevak en "Blijft staan" → `rounded-[var(--lo-hoek-m)] bg-[var(--lo-papier)] p-4`; annuleren `lo-knop-tweede`; de gevaarknop `lo-knop lo-knop--gevaar` (spinner blijft).
- Commit: `style(beheer): menubalk, Help en gevaarknoppen in de leeromgeving-stijl`.

### Task 3: Lesstof, Instellingen en Leerlingen

**Files:** `src/pages/AdminLesstofPage.jsx`, `src/pages/AdminSettingsPage.jsx`, `src/pages/AdminLeerlingenPage.jsx`. Niet: `StudentPhotoImportWizard`, `StudentNumberImportPanel`, `StudentAvatar`.
**Inventaris:** `fase-3-inventaris-overzicht.md`.

- Elke pagina: `beheer-stijl` op de wortel (naast `helix-page`).
- Lesstof en Instellingen: kop → `PaginaKop` (decoratieve tegel bij Instellingen weg); de actiekaarten → `<Kaart as="button" …>` met `KaartKop` en een `lo-onderregel`-actieregel, of `helix-action-card` laten staan (de scope doet het uiterlijk) maar de icoontegel → `lo-hblok lo-hblok--dicht` met het icoon; per kaart de Tailwind-tinten (violet/red/amber) → `Label` of icoonkleur via tokens. Lesstof: het raster wordt `lo-kaartenraster` (geen 4-in-3 meer).
- Leerlingen: kop → `PaginaKop` met `acties={<div className="lo-knoppenbalk">…</div>}`; de zeven knoppen `lo-knop-tweede lo-knop--klein`, iconen 16px, spinners blijven; de foutmelding uit de knoppenrij naar een eigen `lo-melding lo-melding--fout` onder de kop. Statkaarten (`StatCard`, ca. 491-497) → `lo-kaart` met getal `text-3xl font-extrabold tabular-nums`. Lijst: zoekveld en selects `lo-invoer`; hoofdletterlabels → `lo-onderregel font-bold`; badge → `Label`; rijknoppen `lo-knop-start` (rood: `lo-knop-tweede lo-knop--klein lo-knop-tweede--gevaar`); groene melding `lo-melding--goed`. "Leerlingen laden..." (ca. 342) → `HelixLaden`. `PasswordResetModal`: `lo-kaart`, `lo-invoer`, `lo-knop`/`lo-knop-tweede`, fout `lo-melding--fout`.
- Commit: `style(beheer): Lesstof, Instellingen en Leerlingen met knoppenbalk in de leeromgeving-stijl`.

### Task 4: Klassen en Vrijgeven

**Files:** `src/pages/AdminKlassenPage.jsx`, `src/pages/AdminVrijgevenPage.jsx`.
**Inventaris:** `fase-3-inventaris-lijsten.md` (Klassen, Vrijgeven-raster).

- Beide: `beheer-stijl` op de wortel; kop → `PaginaKop`; meldingen → `lo-melding`.
- Klassen: klassenlijst (`dashboard-lens-tab`, ca. 371-386) mag `dashboard-lens-tab` houden (scope) of naar `lo-keuze` met `aria-pressed`; de test accepteert beide. Detailkaart, instellingen, route-select: scope plus `lo-invoer`; hoofdletterkopjes (416, 478, 508, 596) → `lo-onderregel font-bold`; lesstofboom: hoofdstukrijen tonen `<HBlok nummer={hoofdstuk.number} />` vóór de titel; "Deels" → `<Label kleur="oranje">`; leerlingenlijst: scope doet `helix-action-card`. Laadstaten (355-363, 483) → `HelixLaden`.
- Vrijgeven (spec: "het raster krijgt H-blokjes en slotjes"; hier mag de weergave van een cel veranderen, de logica niet):
  - Rijdata (ca. 53-59): voeg `nummer: hoofdstuk.number` toe (alleen weergave).
  - Rijkop: `<HBlok nummer={rij.nummer} dicht={alle toegewezen klassen op slot} />` + titel + onderregel; "Alles vrijgeven"/"Alles op slot" → `lo-knop-start` met `LockOpen`/`Lock`; "Per paragraaf…" → `lo-knop-tweede lo-knop--klein`.
  - Cel: de checkbox wordt een knop `type="button"` met `aria-pressed={opSlot}` en de bestaande `aria-label`, die dezelfde `wissel(...)` aanroept als de checkbox nu bij `onChange`. Inhoud: op slot `Lock` 15px + "op slot" in `lo-label lo-label--oranje`; open `LockOpen` + "open" in `lo-label lo-label--groen`; bezig "..." zoals nu. Niet toegewezen blijft het streepje. Paragraafcellen idem, kleiner (`lo-knop-start`-maat), uitgeschakeld als het hoofdstuk op slot staat (bestaande voorwaarde en `title`).
  - Tekst: de uitleg (ca. 180-183) en de voetnoot (335-339) zeggen nu "Een vinkje betekent: op slot". Vervang dat door "Een slotje betekent: op slot. Klik op een vakje om het te wisselen." (de enige tekstwijziging in deze taak).
  - Laadstaat (203-207) → `HelixLaden`.
- Commit: `style(beheer): Klassen en Vrijgeven met H-blokjes en slotjes`.

### Task 5: Tokenbeheer, Meldingen, AI-instellingen, Projectkompas en de laadstaat van Testen

**Files:** `src/pages/AdminTokenManagementPage.jsx`, `src/pages/AdminMeldingenPage.jsx`, `src/pages/AdminAiSettingsPage.jsx`, `src/pages/AdminProjectKompasPage.jsx`, `src/pages/AdminTestenPage.jsx` (alleen de laadstaat, ca. 184-187 → `HelixLaden`).
**Inventaris:** `fase-3-inventaris-lijsten.md`.

- Alle vier: `beheer-stijl` op de wortel; kop → `PaginaKop` (AI: de h1-tekst "Digidocent instellingen" blijft precies zo; e2e zoekt hem); meldingen → `lo-melding` (goed/fout); hoofdletterlabels → `lo-onderregel font-bold`; `Stat` (Tokenbeheer ca. 532) → `lo-kaart` met getal `font-extrabold tabular-nums`; laadstaten → `HelixLaden`.
- Tokenbeheer: de standaardaccentkleur `'#087EB5'` (43, 158, 171) is data: laten. Uploadvak gestippeld → `rounded-[var(--lo-hoek-m)] border border-dashed border-[var(--lo-lijn)] bg-[var(--lo-papier)]`.
- Meldingen: filterknoppen (`btn-tool`, ca. 68) → `lo-keuzes`/`lo-keuze` met `aria-pressed`; de statuskleuren uit `meldingenService.js` niet aanpassen (mag in de pagina naar `Label` per statussleutel als dat kan zonder de service te wijzigen).
- Projectkompas: kaarten en het hoofdletterlabel (26); de CSS `.project-kompas-document` laten.
- Commit: `style(beheer): Tokenbeheer, Meldingen, AI-instellingen en Projectkompas in de leeromgeving-stijl`.

### Task 6: Slidedecks en het digibordoverzicht

**Files:** `src/pages/AdminSlidedecksPage.jsx`, `src/pages/AdminDigibordPage.jsx`. Niet: `DigibordViewer`, `PdfSlideDeckPresenter`.
**Inventaris:** `fase-3-inventaris-lijsten.md`.

- Beide: `beheer-stijl` op de wortel van de overzichtsweergave (bij Digibord niet om de `DigibordViewer` heen als die schermvullend getoond wordt; zet de klasse op de wortel van het overzicht), kop → `PaginaKop`, laadstaten → `HelixLaden`.
- Slidedecks (111 Tailwind-kleuren): formulier "Nieuw NotebookLM-pakket" met `lo-invoer` en `lo-knop`; tabel volgens de vertaaltabel; statuspillen → `Label`; checklist → `lo-lijst`; vensters (`Modal`, 835) → `lo-kaart`; `SelectBox` → `lo-invoer`; de fuchsia knop "Prompttemplate" → `lo-knop-tweede lo-knop--klein`; blauwe knoppen → `lo-knop`.
- Digibord-overzicht: `DigibordCard` (28-62) → `lo-kaart` als knop, eyebrow `lo-eyebrow`; kop met kruimelpad → `PaginaKop` + kruimels als `lo-knop-start`; "Selectie" → `lo-eyebrow`; `EmptyState` → `Kaart`.
- Commit: `style(beheer): Slidedecks en digibordoverzicht in de leeromgeving-stijl`.

### Task 7: Spellenbeheer en de crop-tool

**Files:** `src/pages/AdminSpellenPage.jsx`, `src/components/games/KlasSpelToewijzing.jsx`, `src/components/games/DvlingoWoordenPanel.jsx`, `src/components/games/GamePlayer.jsx` (alleen een prop, zie onder), `src/pages/StudentSpellenPage.jsx` (alleen die prop doorgeven), `src/pages/AdminCropToolPage.jsx`, `src/components/admin/FloatingCropPanel.jsx`, `src/components/admin/ExistingCropsManager.jsx`. Niet: `ImageCanvasEditor`, `CropSelectionOverlay`.

- Spellenbeheer: `beheer-stijl` op de wortel; kop → `PaginaKop` met de badge als `Label`; filtergroepen (`FilterGroep`) → `lo-keuzes`/`lo-keuze` met `aria-pressed`; tabelkop zonder hoofdletters; `helix-alert`/`helix-badge` mogen blijven (scope) of naar `lo-melding`/`Label`; `TokenRewardPanel` labels `lo-veldlabel`, meldingen `lo-melding--goed/--fout`; `KlasSpelToewijzing` en `DvlingoWoordenPanel` idem; laadstaat `KlasSpelToewijzing` (76) → `HelixLaden className="min-h-0 py-10"`.
- `GamePlayer`: voeg een prop `toonKop = true` toe; als hij `false` is, laat de eigen kop (titel, beschrijving, "GAME", ca. 84-92) weg. `StudentSpellenPage` geeft `toonKop={false}` mee (daar staat de titel al in de kaart). De lespagina en Spellenbeheer veranderen niet. Dit lost de dubbele titel op /spellen op.
- Crop-tool: paneel en toast → `lo-kaart`, `lo-knop`/`lo-knop-tweede`, `lo-melding`; de emoji (156, 255) → lucide-icoon (in 255 staat de emoji in een tekst: haal alleen de emoji weg). `ExistingCropsManager`: laadstaat → `HelixLaden className="min-h-0 py-10"`, lijst → `lo-lijst`.
- Commit: `style(beheer): Spellenbeheer en crop-tool in de leeromgeving-stijl, spelkop niet dubbel`.

### Task 8: Klaarzetten

**Files:** `src/pages/TakenToewijzenPage.jsx`.
**Inventaris:** `fase-3-inventaris-werktuigen.md`.

- `beheer-stijl` op beide wortels (ca. 852 en 903). De pagina moet `helix-page`, `dashboard-lens-tab` en `btn-secondary` blijven bevatten (test).
- Kop (855-868) → `PaginaKop`; `FlowSteps` (66): de scope doet `helix-action-card`, de stapnummers → `lo-hblok` (dicht voor nog niet bereikte stappen); de klaskeuze-`select` → `lo-invoer`.
- Werkruimte: de plakkende kopbalk `bg-[var(--lo-kaart)] border-b border-[var(--lo-lijn)]`; `AssignmentTreeNode`-chips (170, 182, 238) → `Label`; de amber selectiebalk (1002) → `lo-melding lo-melding--info` met `lo-knoppenbalk`; tellers (1327-1332) → `lo-kaart` met `font-extrabold tabular-nums`; amber paragraafrijen (1381-1402) → `lo-rij` met `Label kleur="oranje"`; slate-tekst → `--lo-grijs`/`--lo-inkt`; hoofdletters en `font-black` weg. Laadstaat (1017-1020) → `HelixLaden className="min-h-0 py-12"`.
- Commit: `style(beheer): Klaarzetten in de leeromgeving-stijl`.

### Task 9: Voortgang

**Files:** `src/components/dashboard/ClassOverview.jsx`, `AandachtsLijst.jsx`, `BeoordeelActies.jsx`, `KlasBeloningOverzicht.jsx`, `KlasCijfers.jsx`, `KlasFase5Beheer.jsx`, `KlasPrivilegesBeheer.jsx`, `KlasSamenBeheer.jsx`, `KlasVoortgangMatrix.jsx`, `LeerlingStappen.jsx`, `NakijkPaneel.jsx`, `NulmetingKlasOverzicht.jsx`, `NulmetingLeerlingPaneel.jsx`, `PlusOverzicht.jsx` (alle in `src/components/dashboard/`), `src/lib/klasVoortgangOverzicht.js` (alleen de presentatieconstanten) en zijn test als die klassen controleert.
**Inventaris:** `fase-3-inventaris-werktuigen.md`. Niet: `NulmetingProfielKaart`, `learningResultUtils.js`, `StudentAvatar`, `HelixBrandBanner.jsx` zelf.

- `beheer-stijl` op de drie wortels van ClassOverview (ca. 721, 786, 1222). De laadstaat (721-727) → `HelixLaden schermvullend={false}` in de pagina.
- `HelixBrandBanner` (816, 1224) → `PaginaKop` (de bannerinhoud wordt titel/uitleg/acties; gebruik dezelfde teksten).
- De KPI-kaart met `helix-card border-orange-100 bg-orange-50/45` (1287): die string blijft letterlijk staan (test).
- Statuschips: in `klasVoortgangOverzicht.js` worden `chipClass` in `STAP_STATUS_PRESENTATIE` en `PLUS_PRESENTATIE` `lo-label lo-label--groen/--oranje/--rood/--blauw/--paars` (af, bezig, aandacht, open, plus); `dotClass`/`balkClass` naar `bg-[var(--lo-…)]`. Haal in Matrix (43, 57, 200) en LeerlingStappen (93, 145, 256) de dubbele `rounded-full border px-… text-[10px] font-black uppercase` weg waar `lo-label` het nu doet; vierkante tegels in LeerlingStappen houden hun maat. Draai `node --test src/lib/klasVoortgangOverzicht.test.js` en pas de test aan als hij klassestrings controleert.
- Panelen (`section.helix-card` met `h2 text-lg font-black`): de scope doet de kaart; koppen `lo-kaart-titel`; tabellen volgens de vertaaltabel; `helix-btn-solid` mag blijven (scope); kleine `rounded-lg border`-knoppen → `lo-knop-start`; laadstaten in panelen → `HelixLaden className="min-h-0 py-10"`.
- Commit: `style(beheer): Voortgang in de leeromgeving-stijl`.

### Task 10: Lesstofeditor

**Files:** `src/pages/AdminCmsPage.jsx`, en in `src/components/cms/`: `CmsShell.jsx`, `ContentBlockBuilder.jsx`, `BlockTypePickerModal.jsx`, `ColorEmojiPicker.jsx`, `CreateContentModal.jsx`, `CreateQuestionModal.jsx`, `CropEditorPanel.jsx`, `DualPanelEditor.jsx`, `InlineEdit.jsx`, `NavigationTree.jsx`, `ParagraafKlaarzettenPanel.jsx`, `QuestionEditor.jsx`, `VertalingPaneel.jsx`.
**Inventaris:** `fase-3-inventaris-werktuigen.md` (incl. alle vastgepinde strings).

- `beheer-stijl` op de wortel van `CmsShell` (ca. 244); de vastgepinde layoutklassen blijven daar letterlijk.
- Grotendeels via de scope. JSX alleen voor: kaartkoppen en statuschips (→ `Label`), de ca. 32 kopjes `text-[11px] font-black uppercase tracking-wide` (→ `lo-onderregel font-bold`), lege staten in CmsShell (403-774: `helix-surface p-8` mag blijven, knoppen via de scope), `HelixBrandBanner` in `CreateContentModal` (135) → `KaartKop`, NavigationTree-rijen (125-136, vaste hex) → `var(--lo-papier-2)`, `var(--lo-papier)`, `var(--lo-blauw-zacht)`, en de laadstaten (CmsShell 387-391, ContentBlockBuilder 629, ParagraafKlaarzettenPanel 130) → `HelixLaden`.
- De donkere schermvullende editor (ContentBlockBuilder ca. 654) en de schermvullende studio (2470) blijven zoals ze zijn.
- `ColorEmojiPicker` kiest emoji als data: laten.
- Commit: `style(beheer): lesstofeditor in de leeromgeving-stijl`.

### Task 11: Samenvoegen, controleren en live zetten (controller)

- [ ] Elke werkkopietak van Task 2-10 samenvoegen op `codex/digitale-vaardigheden-seed` (de bestandslijsten overlappen niet; een conflict betekent dat een taak buiten zijn lijst kwam: terug naar die taak).
- [ ] `npx eslint` op alle gewijzigde bestanden, `node --test src/lib/`, `npm run build`, `npx playwright test --reporter=line`.
- [ ] Als ontwikkelaar-beheerder elke beheerpagina openen, desktop en 375px; schermafbeeldingen naar `exports/leeromgeving/fase-3-*.jpg`. De knoppenbalk van Leerlingen: elke knop op één regel.
- [ ] Eindreview (opus) over het hele bereik; punten verwerken.
- [ ] `docs/LEEROMGEVING-STIJL.md` (bouwstenen en `.beheer-stijl`), `docs/HANDOFF.md` (paragraaf 5 en 6: fase 4 is het volgende); markering `leeromgeving-fase-3`; push; `npx vercel --prod --yes`; deploy-id in de handoff.

---

## Self-review

- **Spec 3.3 gedekt:** menubalk en Help zonder gele band (Task 2); overzichtspagina's Lesstof, Leerlingen, Instellingen (Task 3); Klassen, Vrijgeven met H-blokjes en slotjes (Task 4); Tokenbeheer, Meldingen, AI (Task 5); Slidedecks, digibordoverzicht (Task 6); Spellenbeheer, Crop-tool (Task 7); Klaarzetten (Task 8), Voortgang (Task 9), lesstofeditor (Task 10) als laatste en met de werking ongewijzigd.
- **Kevins vraag van 7 oktober** (knoppen op één regel, passend in de knop): `.lo-knoppenbalk`, nowrap op de knoppen, `.lo-paginakop > :first-child` (Task 1), toegepast in Task 2 en 3 en elke paginakop.
- **Uit 2c meegenomen:** dubbele spelkop op /spellen (Task 7). Laadlogo op beheerpagina's (Task 3-10).
- **Parallel:** Task 2-10 delen geen bestanden; Task 1 levert alle gedeelde CSS en tests vooraf.
- **Namen:** `.lo-knop--klein`, `.lo-knop--gevaar`, `.lo-knop-tweede--gevaar`, `.lo-knoppenbalk`, `.lo-melding--goed`, `.beheer-stijl` in Task 1 gedefinieerd en zo gebruikt in Task 2-10; `toonKop` in Task 7.
