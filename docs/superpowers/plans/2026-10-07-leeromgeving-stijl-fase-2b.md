# HELIX Leeromgeving-stijl, fase 2b: implementatieplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** De lespagina (`/chapter/:id`) in de leeromgeving-stijl: het lesblok als witte kaart, de stappenbalk als lijst met scheidingslijnen en een geel nummerblokje voor de huidige stap, "Volgende stap" als hoofdknop, en de balken, meldingen en blokken eromheen in dezelfde vormen. Alleen het uiterlijk.

**Architecture:** De kleuren van de lespagina staan al op de juiste waarden (de `--helix-*`-tokens wijzen sinds de DS-ronde naar dezelfde hexwaarden als `--lo-*`). Wat verandert is vorm en letter. Dat gebeurt op drie plekken: (1) de eigen `study-*`-klassen in `src/index.css` krijgen de `--lo-*`-tokens; (2) een nieuwe scope-klasse `.study-stijl` op de lespagina geeft de gedeelde klassen (`btn-primary`, `btn-secondary`, `helix-btn-solid`, `helix-eyebrow`, `input-standard`) daar het uiterlijk van `.lo-knop`, `.lo-knop-tweede`, `.lo-eyebrow` en `.lo-invoer`, zonder andere pagina's te raken; (3) in de JSX van de stappenbalk, de bovenbalk, de voetbalk en de blokken gaan losse Tailwind-kleuren en vormen over op `.lo-*`-klassen en `var(--lo-*)`.

**Tech Stack:** React 19, Vite, Tailwind 4 (native cascade layers), lucide-react, node:test, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-07-leeromgeving-stijl-design.md` (paragraaf 3.2, punt Lespagina; paragraaf 6, risico's), stijldocument `docs/LEEROMGEVING-STIJL.md`.

## Global Constraints

- Werk in `C:\Projecten\helix leerplatform` op `codex/digitale-vaardigheden-seed`. Nooit `git add -A`/`git add .`; noem paden. `.claude/launch.json` blijft buiten de commits.
- Commits Nederlands met voorvoegsel, eindigend op exact `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Push, markering en deploy alleen in de laatste taak.
- **Alleen het uiterlijk.** Geen gedragswijziging: geen handlers, state, effecten, voorwaarden, routes, teksten of volgorde van elementen veranderen. Geen nieuwe stappen. `aria-*`, `role`, `id`, `htmlFor`, `title`, `key`, `ref` en de klassen `assessment-stepper` en `assessment-stepper-stage` (gsap en type-vergroting hangen eraan) blijven staan.
- Zichtbare teksten blijven letterlijk gelijk, ook de Nederlandse die niet via `uiTaal` lopen ("Ga verder met de knop hierboven", "Afgevinkt", "Stappen", "Stappen sluiten", "Opnieuw proberen").
- **Cascade-lagen.** Alle eigen klassen in `src/index.css` staan ongelaagd en winnen van Tailwind-utilities en van `.lo-*` (die in `@layer components` staan). Een `.lo-*`-klasse op een element dat ook `btn-primary`, `btn-secondary`, `helix-btn-solid`, `helix-surface`, `study-panel` of `input-standard` heeft, verliest dus. Vervang zulke klassen, zet ze niet naast elkaar. Utilities (`hidden`, `p-0`, `lg:hidden`, `h-11`) winnen wel van `.lo-*`.
- Gebruik `.lo-*`-klassen en `var(--lo-*)`. Geen Bangers, geen `.ds-display`, geen `.ds-anchor`, geen nieuwe losse hexwaarden of rgba-kleuren in JSX. Bestaande Tailwind-kleurfamilies (`amber-*`, `emerald-*`, `red-*`, `rose-*`) voor goed/fout/let-op in vragen blijven staan; het thema van Tailwind zelf niet aanpassen (spec 6: dan verkleuren de spellen mee).
- Niet aanraken: `src/lib/learningResultUtils.js` (test vastgepind, ook docentdashboard), `src/components/media/MediaRenderer.jsx` en `src/components/digibord/PdfSlideDeckPresenter.jsx` (gedeeld met presenter en digibord), de spellen (`src/games/`, `src/components/games/`), `VictoryEffectOverlay`, `NiveauOmhoogMoment` (fase 2c).
- `src/lib/designTokenStyles.test.js` blijft groen. Hij pakt per selector de eerste regel in `index.css` die met `<selector> {` begint; nieuwe regels met `.btn-primary {` of `.btn-secondary {` in de selector moeten dus **onder** de basisregels staan.
- Na elke taak: `npx eslint <gewijzigde bestanden>` en `node --test src/lib/`.

---

### Task 1: De lesklassen op de nieuwe tokens, en de scope `.study-stijl`

**Files:**
- Modify: `src/index.css` (de regels `.study-block` t/m `.study-step-active .study-step-check`, ca. regel 1309-1434; en een nieuw blok onderaan het bestand)
- Modify: `src/pages/StudentLessonPage.jsx:1207` (één klasse erbij)
- Create: `src/lib/lespaginaStijl.test.js`

**Interfaces:**
- Produces (CSS-klassen voor Task 2-4): `.study-block` (witte kaart), `.study-panel`, `.study-example`, `.study-example-label`, `.study-surface`, `.study-rail`, `.study-stappen` (op de `ol` van de stappenbalk, naast `.lo-lijst`), `.study-step`, `.study-step-active`, `.study-step-nummer`, `.study-step-title`, `.study-step-meta`, `.study-step-type`, `.study-step-todo`, `.study-step-check`, `.study-einde` (kaart rond het paragraafeinde), en de scope `.study-stijl` (op de wortel van de lespagina en op het voorbeeld in de stijlgids).
- Vervalt: `.study-step-idle` en `.study-step-icon` (Task 2 haalt ze uit de JSX).

- [ ] **Step 1: Falende test**

Maak `src/lib/lespaginaStijl.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8');

// De inhoud van de regel waarvan een regel precies met deze selector en " {" begint.
function regel(selector) {
  const begin = css.indexOf(`\n${selector} {`);
  assert.notEqual(begin, -1, `regel ${selector} ontbreekt`);
  const open = css.indexOf('{', begin);
  return css.slice(open + 1, css.indexOf('}', open));
}

const LESKLASSEN = [
  '.study-block', '.study-panel', '.study-example', '.study-example-label', '.study-surface',
  '.study-rail', '.study-stappen', '.study-step', '.study-step-nummer', '.study-step-title',
  '.study-step-meta', '.study-step-todo', '.study-step-check', '.study-einde'
];

test('het lesblok is een witte kaart van de leeromgeving', () => {
  const blok = regel('.study-block');
  assert.match(blok, /background:\s*var\(--lo-kaart\)/);
  assert.match(blok, /border-radius:\s*var\(--lo-hoek-xl\)/);
  assert.match(blok, /box-shadow:\s*var\(--lo-schaduw-kaart\)/);
  assert.match(blok, /padding:\s*22px/);
  assert.doesNotMatch(blok, /border:/);
});

test('de huidige stap heeft een geel nummerblokje, de andere een crème', () => {
  assert.match(regel('.study-step-nummer'), /height:\s*30px/);
  assert.match(regel('.study-step-nummer'), /background:\s*var\(--lo-papier-2\)/);
  const actief = regel('.study-step-active .study-step-nummer');
  assert.match(actief, /background:\s*var\(--lo-geel\)/);
  assert.match(actief, /border-color:\s*var\(--lo-inkt\)/);
  assert.match(regel('.study-step-active'), /background:\s*var\(--lo-geel-zacht\)/);
  assert.match(regel('.study-step-title'), /font-size:\s*15px/);
  assert.match(regel('.study-step-title'), /font-weight:\s*700/);
});

test('de lesklassen gebruiken alleen tokens van de leeromgeving', () => {
  for (const selector of LESKLASSEN) {
    const inhoud = regel(selector);
    assert.doesNotMatch(inhoud, /--helix-/, `${selector} gebruikt nog een --helix-token`);
    assert.doesNotMatch(inhoud, /#[0-9A-Fa-f]{3,8}\b|rgba?\(/, `${selector} heeft een losse kleur`);
  }
});

test('binnen de lespagina zien de gedeelde knoppen eruit als de leeromgeving', () => {
  const hoofd = regel('.study-stijl .helix-btn-solid');
  assert.match(hoofd, /background:\s*var\(--lo-blauw\)/);
  assert.match(hoofd, /border-radius:\s*var\(--lo-hoek-m\)/);
  assert.match(hoofd, /font-weight:\s*800/);
  assert.match(regel('.study-stijl .btn-secondary'), /border:\s*1px solid var\(--lo-lijn\)/);
  assert.match(regel('.study-stijl .helix-eyebrow'), /color:\s*var\(--lo-blauw-inkt\)/);
  assert.match(regel('.study-stijl .input-standard'), /border:\s*1px solid var\(--lo-lijn\)/);
  assert.match(regel('.study-stijl .lesson-prose'), /color:\s*var\(--lo-inkt\)/);
});

test('de scope-regels staan onder de basisregels van de knoppen', () => {
  const scope = css.indexOf('\n.study-stijl .btn-primary,');
  assert.notEqual(scope, -1);
  assert.ok(css.indexOf('\n.btn-primary {') < scope);
  assert.ok(css.indexOf('\n.btn-secondary {') < scope);
  assert.ok(css.indexOf('\n.input-standard {') < scope);
});
```

- [ ] **Step 2: Draai hem en zie hem falen**

Run: `node --test src/lib/lespaginaStijl.test.js`
Expected: FAIL (o.a. "regel .study-step-nummer ontbreekt").

- [ ] **Step 3: De lesklassen vervangen**

In `src/index.css`: laat `.study-shell` (met zijn commentaar) staan. Vervang alles vanaf het commentaar boven `.study-block` ("/* Elke stap staat in hetzelfde kader ...") tot en met de regel `.study-step-active .study-step-check { ... }` door:

```css
/* Elke stap staat in dezelfde witte kaart van de leeromgeving: geen rand,
   kaartschaduw, hoek 20px, binnenmarge 22px (16px op een telefoon). Tussen
   theorie, vraag, quiz, game en slides zit geen sprong in kaartvorm. De hoogte
   volgt de inhoud: een leesstap van vier regels is een kaart van vier regels,
   met de afrondknop er direct onder. */
.study-block {
  background: var(--lo-kaart);
  border-radius: var(--lo-hoek-xl);
  box-shadow: var(--lo-schaduw-kaart);
  color: var(--lo-inkt);
  padding: 22px;
}

/* Een deelvlak binnen die kaart (quiz-intro, slides). Zelfde vormfamilie, zodat
   het een onderdeel blijft en geen tweede kaart wordt. De achtergrond komt uit
   de JSX. */
.study-panel {
  border: 1px solid var(--lo-lijn);
  border-radius: var(--lo-hoek-l);
  padding: 18px;
}

/* Uitgewerkt voorbeeld binnen de leeskaart: wit vak met een lijn en een blauw
   label. Links de uitwerking, rechts de figuur. */
.study-example {
  background: var(--lo-kaart);
  border: 1px solid var(--lo-lijn);
  border-radius: var(--lo-hoek-l);
  padding: 18px;
}

.study-example-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 9px;
  border-radius: 999px;
  background: var(--lo-blauw-zacht);
  color: var(--lo-blauw-inkt);
  font-size: 12px;
  line-height: 18px;
  font-weight: 800;
}

.study-example .lesson-prose :where(p, ul, ol, blockquote, h1, h2, h3, h4, h5, h6, dl) {
  max-width: 60ch;
}

/* Kaart rond het afronden van een paragraaf; de activiteit binnenin heeft zijn
   eigen binnenmarge. */
.study-einde {
  overflow: hidden;
  background: var(--lo-kaart);
  border-radius: var(--lo-hoek-xl);
  box-shadow: var(--lo-schaduw-kaart);
}

.study-surface {
  background: var(--lo-papier);
}

.study-rail {
  background: var(--lo-kaart);
  border-right: 1px solid var(--lo-lijn);
}

/* De stappenbalk is een lijst met scheidingslijnen (.lo-lijst in de JSX).
   Per stap: nummerblokje, titel, type-icoon en vinkje. De huidige stap heeft
   een geel nummerblokje op een lichtgele regel. Elke stap blijft bereikbaar. */
.study-stappen {
  overflow: hidden;
}

.study-step {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: none;
  background: transparent;
  color: var(--lo-inkt);
  text-align: left;
  cursor: pointer;
}

.study-step:hover {
  background: var(--lo-papier);
}

/* Binnen de lijst valt een ring buiten de rij weg; daarom een ring aan de binnenkant. */
.study-step:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 3px var(--lo-blauw);
}

.study-step-active,
.study-step-active:hover {
  background: var(--lo-geel-zacht);
}

.study-step-nummer {
  display: inline-grid;
  flex: none;
  place-items: center;
  box-sizing: border-box;
  min-width: 30px;
  height: 30px;
  padding: 0 6px;
  border: 2px solid var(--lo-lijn);
  border-radius: var(--lo-hoek-s);
  background: var(--lo-papier-2);
  color: var(--lo-grijs);
  font-size: 13px;
  line-height: 19.5px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.study-step-active .study-step-nummer {
  border-color: var(--lo-inkt);
  background: var(--lo-geel);
  color: var(--lo-inkt);
}

.study-step-title {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--lo-inkt);
  font-size: 15px;
  line-height: 22.5px;
  font-weight: 700;
}

.study-step-meta {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--lo-grijs);
  font-size: 12.5px;
  line-height: 18.75px;
  font-weight: 400;
}

.study-step-type {
  flex: none;
  color: var(--lo-grijs);
}

/* Een open rondje: de stap is nog niet af. */
.study-step-todo {
  flex: none;
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  border: 2px solid var(--lo-lijn);
  border-radius: 999px;
}

.study-step-check {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: var(--lo-groen-zacht);
  color: var(--lo-groen-inkt);
}

@media (max-width: 760px) {
  .study-block {
    padding: 16px;
  }

  .study-panel,
  .study-example {
    padding: 14px;
  }
}
```

De keyframes `study-confirm-rise`, `.study-confirm-bar` en de reduced-motion-regel eronder blijven ongewijzigd staan.

- [ ] **Step 4: Het scope-blok onderaan `src/index.css`**

Voeg helemaal onderaan `src/index.css` toe (na de `.assessment-stepper-stage`-regels):

```css

/* ==========================================================================
   Leeromgeving-stijl op de lespagina (fase 2b).
   De lespagina deelt btn-primary, btn-secondary, helix-btn-solid, helix-eyebrow,
   input-standard en lesson-prose met andere pagina's. Binnen .study-stijl
   krijgen ze het uiterlijk van .lo-knop, .lo-knop-tweede, .lo-eyebrow en
   .lo-invoer. Alleen kleur, rand, hoek, letter en schaduw: de binnenmarges
   blijven, zodat er in de vragen en de toetsstepper niets verspringt.
   Dit blok moet onder de basisregels staan: designTokenStyles.test.js leest per
   klasse de eerste regel in dit bestand.
   ========================================================================== */
.study-stijl .btn-primary,
.study-stijl .helix-btn-solid {
  border: 2px solid transparent;
  border-radius: var(--lo-hoek-m);
  background: var(--lo-blauw);
  color: var(--lo-kaart);
  box-shadow: var(--lo-schaduw-knop);
  font-family: var(--lo-letter);
  font-weight: 800;
}

.study-stijl .btn-primary:hover:not(:disabled),
.study-stijl .helix-btn-solid:hover:not(:disabled) {
  background: var(--lo-blauw-inkt);
  translate: none;
}

.study-stijl .btn-primary:disabled,
.study-stijl .helix-btn-solid:disabled {
  border-color: transparent;
  background: var(--lo-papier-2);
  color: var(--lo-grijs);
  box-shadow: none;
  opacity: 1;
}

.study-stijl .btn-secondary {
  border: 1px solid var(--lo-lijn);
  border-radius: var(--lo-hoek-m);
  background: var(--lo-kaart);
  color: var(--lo-inkt);
  font-family: var(--lo-letter);
  font-weight: 700;
}

.study-stijl .btn-secondary:hover:not(:disabled),
.study-stijl .btn-secondary:focus-visible {
  border-color: var(--lo-blauw);
  background: var(--lo-kaart);
}

.study-stijl .btn-secondary:disabled {
  border-color: var(--lo-lijn);
  background: var(--lo-papier-2);
  color: var(--lo-grijs);
  opacity: 1;
}

.study-stijl .helix-eyebrow {
  color: var(--lo-blauw-inkt);
  font-family: var(--lo-letter);
  font-size: 12px;
  line-height: 18px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.study-stijl .input-standard {
  border: 1px solid var(--lo-lijn);
  border-radius: var(--lo-hoek-m);
  background: var(--lo-kaart);
  color: var(--lo-inkt);
}

.study-stijl .input-standard:focus {
  border-color: var(--lo-blauw);
  background: var(--lo-kaart);
}

/* Leestekst in inkt in plaats van grijs: beter leesbaar voor leerlingen die nog
   Nederlands leren. Grootte en regelafstand blijven. */
.study-stijl .lesson-prose {
  color: var(--lo-inkt);
}
```

- [ ] **Step 5: De scope op de lespagina**

In `src/pages/StudentLessonPage.jsx` regel 1207:

```jsx
    <div className="study-surface study-shell flex flex-col">
```
wordt
```jsx
    <div className="study-surface study-shell study-stijl flex flex-col">
```

- [ ] **Step 6: Tests groen**

Run: `node --test src/lib/` → alles PASS, ook `designTokenStyles.test.js` en de nieuwe `lespaginaStijl.test.js`.
Run: `npx eslint src/pages/StudentLessonPage.jsx src/lib/lespaginaStijl.test.js` → geen fouten.
Run: `npm run build` → slaagt (Tailwind verwerkt `index.css`).

- [ ] **Step 7: Commit**

```bash
git add src/index.css src/pages/StudentLessonPage.jsx src/lib/lespaginaStijl.test.js
git commit -m "style(les): lesklassen op de tokens van de leeromgeving, scope study-stijl voor de gedeelde knoppen

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: De stappenbalk als lijst, en de lespagina in de stijlgids

**Files:**
- Modify: `src/components/leeromgeving/Label.jsx` (extra attributen doorgeven)
- Modify: `src/components/lesson/StudyStepRail.jsx` (hele bestand, zie code)
- Modify: `src/pages/AdminStijlgidsPage.jsx` (sectie "Lespagina")
- Modify: `tests/e2e/leeromgeving-stijl.spec.js` (tweede test)

**Interfaces:**
- Consumes: de klassen uit Task 1.
- Produces: `Label` accepteert extra attributen (`title`, `role`, ...) en zet die op de `span`. `StudyStepRail` houdt exact dezelfde props.

- [ ] **Step 1: Label geeft attributen door**

`src/components/leeromgeving/Label.jsx`, de functie wordt:

```jsx
export default function Label({ kleur = 'blauw', icoon: Icoon = null, className = '', children, ...rest }) {
  const veilig = KLEUREN.has(kleur) ? kleur : 'blauw';
  return (
    <span {...rest} className={`lo-label lo-label--${veilig}${className ? ` ${className}` : ''}`}>
      {Icoon && <Icoon size={15} aria-hidden="true" />}
      {children}
    </span>
  );
}
```

- [ ] **Step 2: StudyStepRail**

Vervang in `src/components/lesson/StudyStepRail.jsx` de import en de `return` (de props en `const { tekst } = taal;` blijven exact gelijk):

```jsx
import { ArrowLeft, ArrowRight, BookOpen, Check, Star, Target } from 'lucide-react';
import { nederlandseTaalhulp } from '../../hooks/useLesstofTaal';
import Label from '../leeromgeving/Label';
```

```jsx
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-[var(--lo-lijn)] px-5 py-5">
        {/* De uitgang staat bovenaan en heet wat hij doet. Hij heette eerder
            "Stop met oefenen" en stond onderin: een leerling die gewoon terug
            wilde naar zijn overzicht las daar "stoppen" en durfde niet. */}
        <button
          type="button"
          onClick={onExit}
          className="lo-knop-tweede px-3 py-2 text-sm"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {exitLabel || tekst('knop.terugNaarOverzicht')}
        </button>

        <p className="lo-eyebrow mt-4">{tekst('rubriek.paragraaf')}</p>
        <h2 className="mt-1 text-lg font-extrabold leading-6 text-[var(--lo-inkt)]">
          {paragraafTitle || tekst('les.kop')}
        </h2>
        {hoofdstukTitle && (
          chapterId && onOpenChapter ? (
            <button
              type="button"
              onClick={() => onOpenChapter(chapterId)}
              className="lo-onderregel mt-1 inline-flex items-center gap-1 text-left underline decoration-dotted underline-offset-2 transition hover:text-[var(--lo-blauw-inkt)]"
            >
              {hoofdstukTitle}
            </button>
          ) : (
            <p className="lo-onderregel mt-1">{hoofdstukTitle}</p>
          )
        )}

        {optioneel && (
          <Label kleur="paars" icoon={Star} className="mt-2" title={tekst('plus.uitleg')}>
            {tekst('plus.label')}
          </Label>
        )}

        <span className="lo-voortgang mt-4" aria-hidden="true">
          <i style={{ width: `${summary.percentage}%` }} />
        </span>
        {/* De balk hierboven gaat over déze paragraaf, niet over het hoofdstuk.
            Bij plusstof zegt de regel eronder er meteen bij dat het extra is,
            zodat een halve balk nooit als achterstand leest. */}
        <p className="lo-onderregel mt-2">
          {tekst('onderdeel.af', { done: summary.done, total: summary.total })}
          {optioneel && ' · extra werk'}
        </p>
      </div>

      <nav aria-label="Onderdelen in deze paragraaf" className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <ol className="lo-lijst study-stappen">
          {hasIntro && (
            <li>
              <button
                type="button"
                onClick={onOpenIntro}
                aria-current={isIntroActive ? 'step' : undefined}
                className={`study-step${isIntroActive ? ' study-step-active' : ''}`}
              >
                <span className="study-step-nummer">
                  <Target size={15} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="study-step-title">{tekst('les.leerdoelen')}</span>
                </span>
                {isIntroDone && (
                  <span className="study-step-check">
                    <Check size={13} strokeWidth={3.5} />
                  </span>
                )}
              </button>
            </li>
          )}

          {steps.map((step, index) => {
            const Icon = iconForType(step.type);
            // Zolang het leerdoelenscherm openstaat wijst de balk daarnaar, en
            // niet tegelijk ook naar de eerste stap. Eén actieve regel per moment.
            const isActive = step.isActive && !isIntroActive;
            // Onder de staptitel staat alleen hoe de leerling de stap heeft
            // afgerond. Het nummer staat in het blokje ervoor.
            const metaLabel = step.isDone ? step.statusLabel || tekst('status.afgerond') : '';

            return (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => onSelectStep?.(step)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`study-step${isActive ? ' study-step-active' : ''}`}
                >
                  <span className="study-step-nummer">{index + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="study-step-title">{step.title}</span>
                    {metaLabel && <span className="study-step-meta">{metaLabel}</span>}
                  </span>
                  <Icon size={16} className="study-step-type" aria-hidden="true" />
                  {/* Elke stap is bereikbaar; het vinkje of het open rondje laat
                      zien wat al af is en wat nog niet. */}
                  {step.isDone ? (
                    <span className="study-step-check">
                      <Check size={13} strokeWidth={3.5} />
                      <span className="sr-only">{tekst('status.afgerond')}</span>
                    </span>
                  ) : (
                    <span className="study-step-todo">
                      <span className="sr-only">{tekst('status.nogNietAf')}</span>
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* De buren van deze paragraaf. Zonder deze twee moest een leerling na
          elke paragraaf terug naar het overzicht en het hoofdstuk opnieuw
          opzoeken om verder te kunnen. */}
      {(vorigeParagraaf || volgendeParagraaf) && onOpenParagraaf && (
        <div className="shrink-0 border-t border-[var(--lo-lijn)] p-3">
          <p className="lo-onderregel px-1 pb-2 font-bold">
            {tekst('les.inDitHoofdstuk')}
          </p>
          <div className="space-y-1">
            {vorigeParagraaf && (
              <button
                type="button"
                onClick={() => onOpenParagraaf(vorigeParagraaf.id)}
                className="flex w-full items-center gap-2 rounded-[var(--lo-hoek-m)] px-3 py-2 text-left transition hover:bg-[var(--lo-papier)]"
              >
                <ArrowLeft size={15} className="shrink-0 text-[var(--lo-grijs)]" aria-hidden="true" />
                <span className="lo-rij-titel min-w-0 flex-1 truncate">
                  {vorigeParagraaf.number ? `${vorigeParagraaf.number} ` : ''}
                  {taal.paragraafInfo(vorigeParagraaf.id)?.titel || vorigeParagraaf.title}
                </span>
              </button>
            )}
            {volgendeParagraaf && (
              <button
                type="button"
                onClick={() => onOpenParagraaf(volgendeParagraaf.id)}
                className="flex w-full items-center gap-2 rounded-[var(--lo-hoek-m)] px-3 py-2 text-left transition hover:bg-[var(--lo-papier)]"
              >
                <span className="lo-rij-titel min-w-0 flex-1 truncate">
                  {volgendeParagraaf.number ? `${volgendeParagraaf.number} ` : ''}
                  {taal.paragraafInfo(volgendeParagraaf.id)?.titel || volgendeParagraaf.title}
                </span>
                <ArrowRight size={15} className="shrink-0 text-[var(--lo-grijs)]" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
```

Let op: `lo-rij-titel` heeft `overflow-wrap: anywhere`; de utility `truncate` wint (utilities-laag) en kapt af zoals voorheen.

- [ ] **Step 3: Sectie "Lespagina" in de stijlgids**

In `src/pages/AdminStijlgidsPage.jsx`:

Imports: zet de lucide-regel op
```jsx
import { BookOpen, Coins, House, Lightbulb, ListChecks, Lock, Presentation, RefreshCw } from 'lucide-react';
```
en voeg toe onder de import van `../components/leeromgeving`:
```jsx
import StudyStepRail from '../components/lesson/StudyStepRail';
```

Onder `const geenActie = () => {};`:
```jsx
const VOORBEELD_STAPPEN = [
  { id: 's1', title: 'Presentatie', type: 'slidedeck', isDone: true, statusLabel: 'Bekeken' },
  { id: 's2', title: 'Theorie: wat is dichtheid?', type: 'theory', isDone: true },
  { id: 's3', title: 'Voorbeeld: een blokje hout', type: 'example', isActive: true },
  { id: 's4', title: 'Schriftopdracht', type: 'theory' },
  { id: 's5', title: 'Korte check', type: 'quiz' }
];

const STAP_ICONEN = { slidedeck: Presentation, theory: BookOpen, example: Lightbulb, quiz: ListChecks };
```

In de JSX, direct na de afsluitende `</div>` van het bestaande `lo-kaartenraster` (dus als tweede raster binnen `helix-container`):
```jsx
        <div data-stijlgids="lespagina" className="study-stijl lo-kaartenraster">
          <Kaart>
            <KaartKop titel="Stappenbalk" uitleg="Een lijst met scheidingslijnen. De huidige stap heeft een geel nummerblokje." />
            <div className="study-rail h-[600px] overflow-hidden rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)]">
              <StudyStepRail
                paragraafTitle="2.3 Dichtheid"
                hoofdstukTitle="H2 Stoffen"
                steps={VOORBEELD_STAPPEN}
                summary={{ total: 5, done: 2, percentage: 40 }}
                iconForType={(type) => STAP_ICONEN[type] || BookOpen}
                hasIntro
                isIntroDone
                onOpenIntro={geenActie}
                onSelectStep={geenActie}
                onExit={geenActie}
              />
            </div>
          </Kaart>

          <article className="study-block flex flex-col gap-6">
            <div className="lesson-prose">
              <h2>Dichtheid</h2>
              <p>Dichtheid zegt hoeveel massa er in één kubieke centimeter van een stof zit.</p>
              <ul>
                <li>Massa meet je in gram.</li>
                <li>Volume meet je in kubieke centimeter.</li>
              </ul>
            </div>
            <div className="study-example">
              <span className="study-example-label">Voorbeeld</span>
              <p className="mt-3">Een blokje hout van 10 cm³ weegt 6 g.</p>
            </div>
            <p className="helix-eyebrow">Presentatie</p>
            <input className="input-standard" aria-label="Voorbeeldantwoord" placeholder="Jouw antwoord" />
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn-primary px-5 py-3 text-sm">Volgende stap</button>
              <button type="button" className="helix-btn-solid px-5 py-3 text-sm">Ik heb het gelezen</button>
            </div>
            <button type="button" className="btn-secondary px-5 py-3 text-sm">Vorige</button>
          </article>
        </div>
```

- [ ] **Step 4: E2e-meting van de lespagina in de stijlgids**

Voeg in `tests/e2e/leeromgeving-stijl.spec.js` onderaan een tweede test toe:

```js
test('de lespagina in de stijlgids heeft de vormen van de leeromgeving', async ({ page }) => {
  await page.goto('/login/beheer');
  await page.getByRole('button', { name: /Als beheerder/i }).click();
  await expect(page).toHaveURL(/\/admin\/instellingen$/);
  await page.goto('/admin/stijlgids');

  const sectie = page.locator('[data-stijlgids="lespagina"]');
  await expect(sectie).toBeVisible();
  await page.evaluate(() => document.fonts.ready);

  const maten = await sectie.evaluate((el) => {
    const stijl = (selector) => {
      const node = el.querySelector(selector);
      const s = getComputedStyle(node);
      return {
        size: s.fontSize, weight: s.fontWeight, color: s.color, bg: s.backgroundColor, image: s.backgroundImage,
        radius: s.borderTopLeftRadius, padding: s.padding,
        border: `${s.borderTopWidth} ${s.borderTopStyle} ${s.borderTopColor}`,
        height: Math.round(node.getBoundingClientRect().height)
      };
    };
    return {
      actiefNummer: stijl('.study-step-active .study-step-nummer'),
      gewoonNummer: stijl('li:last-child .study-step-nummer'),
      actieveStap: stijl('.study-step-active'),
      staptitel: stijl('.study-step-title'),
      blok: stijl('.study-block'),
      hoofdknop: stijl('.btn-primary'),
      leesknop: stijl('.helix-btn-solid'),
      tweede: stijl('.btn-secondary'),
      eyebrow: stijl('.helix-eyebrow'),
      invoer: stijl('.input-standard'),
      leestekst: stijl('.lesson-prose p')
    };
  });

  const inkt = 'rgb(11, 13, 15)';
  const blauw = 'rgb(8, 126, 181)';
  expect(maten.actiefNummer).toMatchObject({ bg: 'rgb(255, 211, 61)', border: `2px solid ${inkt}`, radius: '8px', height: 30, size: '13px', weight: '800' });
  expect(maten.gewoonNummer).toMatchObject({ bg: 'rgb(251, 235, 208)', border: '2px solid rgb(232, 220, 195)' });
  expect(maten.actieveStap.bg).toBe('rgb(255, 240, 184)');
  expect(maten.staptitel).toMatchObject({ size: '15px', weight: '700', color: inkt });
  expect(maten.blok).toMatchObject({ bg: 'rgb(255, 255, 255)', radius: '20px', padding: '22px' });
  expect(maten.blok.border.startsWith('0px')).toBe(true);
  expect(maten.hoofdknop).toMatchObject({ bg: blauw, radius: '12px', weight: '800' });
  expect(maten.leesknop).toMatchObject({ bg: blauw, image: 'none', radius: '12px', weight: '800' });
  expect(maten.tweede).toMatchObject({ bg: 'rgb(255, 255, 255)', border: '1px solid rgb(232, 220, 195)', color: inkt });
  expect(maten.eyebrow).toMatchObject({ size: '12px', weight: '800', color: 'rgb(6, 106, 153)' });
  expect(maten.invoer.border).toBe('1px solid rgb(232, 220, 195)');
  expect(maten.leestekst.color).toBe(inkt);
});
```

- [ ] **Step 5: Controleren**

Run: `npx eslint src/components/leeromgeving/Label.jsx src/components/lesson/StudyStepRail.jsx src/pages/AdminStijlgidsPage.jsx tests/e2e/leeromgeving-stijl.spec.js` → geen fouten.
Run: `node --test src/lib/` → PASS.
Run: `npx playwright test tests/e2e/leeromgeving-stijl.spec.js --reporter=line` → 2 passed. (Geeft `test-results/` een EPERM, voeg dan `--output=<map in je temp>` toe. Start de playwright-webserver niet zelf als er al een dev-server op 5173 draait; de config hergebruikt hem.)

- [ ] **Step 6: Commit**

```bash
git add src/components/leeromgeving/Label.jsx src/components/lesson/StudyStepRail.jsx src/pages/AdminStijlgidsPage.jsx tests/e2e/leeromgeving-stijl.spec.js
git commit -m "style(les): stappenbalk als lijst met nummerblokjes, lespagina in de stijlgids

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: De balken rond de les, de leerdoelen en de bevestiging

**Files:**
- Modify: `src/pages/StudentLessonPage.jsx` (bovenbalk ca. 1229-1308, vertaalstrook 1314-1326, beheerstrook 1328-1335, paragraafeinde 1343, voetbalk 1439-1480, nulmeting-dialoog 1485-1518, lade 1524-1547, `CenteredState` ca. 5023-5043)
- Modify: `src/components/lesson/StudyConfirmBar.jsx`
- Modify: `src/components/lesson/LearningGoalsIntro.jsx`

**Interfaces:**
- Consumes: `.study-einde`, `.study-stijl` (Task 1), `Label` met `title` (Task 2), `.lo-knop`, `.lo-knop-tweede`, `.lo-hblok`, `.lo-rij-titel`, `.lo-onderregel`, `.lo-kaart`, `.lo-kaart-titel`, `.lo-melding`, `.lo-label`.

Vervang per plek alleen het `className` (en waar aangegeven het binnenste van een element). Alles wat niet genoemd wordt blijft letterlijk staan. Voeg de import `import Label from '../components/leeromgeving/Label';` toe aan `StudentLessonPage.jsx` bij de andere component-imports.

- [ ] **Step 1: Bovenbalk** (`StudentLessonPage.jsx` vanaf ca. 1229)

| Element | Nieuw `className` / inhoud |
| --- | --- |
| balk zelf (`div` met `border-b ... bg-white/86 ... backdrop-blur-xl`) | `flex shrink-0 items-center gap-3 border-b border-[var(--lo-lijn)] bg-[var(--lo-kaart)] px-4 py-3 sm:px-6` |
| knop "Stappen" | `lo-knop-tweede h-11 px-3 text-sm lg:hidden` |
| icoontegel (`span` met `<ActiveStepIcon size={19} />`) | `lo-hblok hidden sm:inline-grid` en als inhoud: `{showParagraphEnd ? <ActiveStepIcon size={16} aria-hidden="true" /> : currentIndex + 1}` |
| titel `p` | `lo-rij-titel truncate` |
| metaregel `p` | `lo-onderregel truncate` |
| plus-`span` | vervang het hele `<span ...>...</span>` door `<Label kleur="paars" icoon={Star} className="hidden sm:inline-flex" title={PLUS_UITLEG_LEERLING}>{PLUS_LABEL}</Label>` |
| tokenmelding-`span` | vervang door `<Label kleur="groen" className="hidden sm:inline-flex">{tokenAwardNotice}</Label>` |
| percentage-`span` | `hidden text-[13px] font-extrabold tabular-nums text-[var(--lo-grijs)] sm:inline` |
| knop leerdoelen en knop volledig scherm | `lo-knop-tweede h-11 w-11 shrink-0 justify-center p-0` |

- [ ] **Step 2: Stroken onder de bovenbalk**

| Element | Nieuw `className` |
| --- | --- |
| vertaalstrook (`div` met `border-amber-200 bg-amber-50`) | `flex shrink-0 flex-wrap items-center gap-2 border-b border-[var(--lo-lijn)] bg-[var(--lo-oranje-zacht)] px-4 py-2 text-xs font-bold text-[var(--lo-oranje-inkt)] sm:px-6` |
| knop "Opnieuw proberen" | `lo-knop-tweede px-2 py-1 text-xs` |
| beheerstrook | `shrink-0 border-b border-[var(--lo-lijn)] bg-[var(--lo-kaart)] px-4 py-2 text-xs font-bold text-[var(--lo-grijs)] sm:px-6`; het `span` "Adminpreview:" krijgt `text-[var(--lo-inkt)]` |
| omhulsel paragraafeinde (`div className="helix-surface overflow-hidden"`) | `study-einde` |

- [ ] **Step 3: Voetbalk en nulmeting-dialoog**

| Element | Nieuw `className` |
| --- | --- |
| `footer` | `flex flex-col gap-3 border-t border-[var(--lo-lijn)] bg-[var(--lo-kaart)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6` |
| knop vorige | `lo-knop-tweede justify-center text-sm disabled:opacity-40` |
| statusregel `p` | `` `text-center text-[13px] font-bold ${studyNotice ? 'text-[var(--lo-rood-inkt)]' : 'text-[var(--lo-grijs)]'}` `` |
| knop volgende stap / afronden (`btn-primary px-5 py-3 text-sm`) | `lo-knop justify-center text-sm` |
| dialoogkaart (`div role="alertdialog"`) | `lo-kaart gap-0 border border-[var(--lo-lijn)] p-4` |
| titel `p` in de dialoog | `font-extrabold text-[var(--lo-inkt)]` |
| uitleg `p` (`helix-muted mt-1 text-sm font-semibold`) | `mt-1 text-sm text-[var(--lo-grijs)]` |
| knop "Terug naar de vragen" | `lo-knop text-sm` |
| knop "Toch naar de volgende stap" | `lo-knop-tweede text-sm` |

- [ ] **Step 4: Lade op een telefoon**

| Element | Nieuw `className` |
| --- | --- |
| paneel (`study-rail relative z-10 ... bg-white`) | `study-rail relative z-10 flex h-full w-[86%] max-w-[340px] flex-col` |
| knop sluiten | `lo-knop-tweede h-10 w-10 justify-center p-0` |

De achtergrondlaag (`bg-[rgba(11,19,43,0.42)]`) blijft staan; die hoort bij de overlays en gaat in fase 4 mee.

- [ ] **Step 5: CenteredState** (onderaan het bestand)

```jsx
function CenteredState({ icon: Icon, title, description, actionLabel, onAction, spinning = false }) {
  return (
    <div className="helix-page flex min-h-[70vh] items-center justify-center px-4">
      <div className="lo-kaart max-w-md items-center p-8 text-center">
        <span className="lo-hblok lo-hblok--dicht h-14 min-w-14">
          <Icon size={26} className={spinning ? 'animate-spin' : ''} aria-hidden="true" />
        </span>
        <h1 className="lo-kaart-titel">{title}</h1>
        <p className="lo-kaart-uitleg mt-0">{description}</p>
        {actionLabel && (
          <button
            onClick={onAction}
            className="lo-knop mt-2 text-sm"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
```

(`CenteredState` staat buiten `.study-stijl`; daarom `lo-knop` in plaats van `btn-primary`.)

- [ ] **Step 6: StudyConfirmBar**

In `src/components/lesson/StudyConfirmBar.jsx`:

| Element | Nieuw `className` |
| --- | --- |
| kaart (`div` met `rounded-2xl border-[rgba(34,197,94,0.32)]`) | `pointer-events-auto flex w-full max-w-xl items-center gap-3 rounded-[var(--lo-hoek-xl)] border border-[var(--lo-lijn)] bg-[var(--lo-kaart)] px-4 py-3 shadow-[var(--lo-schaduw-kaart)] sm:gap-4 sm:px-5` |
| vinkje (`span` met `bg-[rgba(34,197,94,0.14)] text-[#237A4D]`) | `flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--lo-groen-zacht)] text-[var(--lo-groen-inkt)]` |
| bericht `p` | `min-w-0 flex-1 truncate text-[15px] font-bold text-[var(--lo-inkt)]` |
| knop (`helix-btn-solid shrink-0 px-4 py-2.5 text-sm`) | ongewijzigd laten; `.study-stijl .helix-btn-solid` uit Task 1 geeft hem de nieuwe vorm |

- [ ] **Step 7: LearningGoalsIntro**

In `src/components/lesson/LearningGoalsIntro.jsx` (de dialoog is een kind van `.study-stijl`):

| Element | Nieuw `className` / inhoud |
| --- | --- |
| dialoog (`helix-surface flex max-h-[86vh] ...`) | `lo-kaart max-h-[86vh] w-full max-w-lg gap-0 overflow-hidden p-5 sm:p-6` |
| icoontegel (`helix-gradient flex h-9 w-9 ...`) | `lo-hblok` (inhoud `<Target size={18} />` wordt `<Target size={16} aria-hidden="true" />`) |
| `h2` | `lo-kaart-titel` |
| contextregel `p` | `lo-onderregel truncate` |
| plusvak (`div` met `border-[rgba(122,60,255,0.35)]`) | `mt-4 rounded-[var(--lo-hoek-l)] bg-[var(--lo-paars-zacht)] p-4` |
| plustitel `p` | `flex items-center gap-2 text-sm font-extrabold text-[var(--lo-paars-inkt)]` |
| plusuitleg `p` | `mt-1.5 text-sm leading-6 text-[var(--lo-inkt)]` |
| lijst `ul` | `custom-scrollbar lo-lijst mt-4 min-h-0 overflow-y-auto` |
| `li` | `flex items-start gap-2.5 px-4 py-3` |
| stip `span` | `mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--lo-blauw)]` |
| itemtekst `span` | `text-[15px] leading-6 text-[var(--lo-inkt)]` |
| bijschrift `p` | `lo-onderregel` |
| knop verder (`helix-btn-solid`) | ongewijzigd laten (scope uit Task 1) |

- [ ] **Step 8: Controleren en commit**

Run: `npx eslint src/pages/StudentLessonPage.jsx src/components/lesson/StudyConfirmBar.jsx src/components/lesson/LearningGoalsIntro.jsx` → geen fouten.
Run: `node --test src/lib/` → PASS. `npm run build` → slaagt.
Controleer met `git diff -U0 src/pages/StudentLessonPage.jsx | grep '^[-+]' | grep -v className` dat er buiten `className`, de `Label`-import, de twee vervangen `span`s, de inhoud van de icoontegel en `CenteredState` niets veranderde.

```bash
git add src/pages/StudentLessonPage.jsx src/components/lesson/StudyConfirmBar.jsx src/components/lesson/LearningGoalsIntro.jsx
git commit -m "style(les): boven- en voetbalk, lade, leerdoelen en bevestiging in de leeromgeving-stijl

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: De blokken in de les

**Files:**
- Modify: `src/pages/StudentLessonPage.jsx` (blokweergaven, zie tabel)
- Modify: `src/lib/lessonBlockPresentation.js` (`chipClass` van voorbeeld en samenvatting)

**Interfaces:**
- Consumes: Task 1-3. `lessonBlockPresentation.test.js` eist alleen dat `chipClass` niet leeg is, dat de eyebrows `'Voorbeeld'` en `'Samenvatting'` blijven en dat `cardClass` `undefined` is.

Regels voor deze taak:
- Vervang alleen `className`-waarden (en waar genoemd een vaste kleur in een `className`). Geen JSX-structuur, geen tekst, geen logica.
- Waar een element `btn-primary`, `btn-secondary`, `helix-btn-solid`, `helix-eyebrow` of `input-standard` heeft: **laat staan**. De scope uit Task 1 regelt die. Dat geldt ook binnen `.assessment-stepper` (daar hangen ook de vergrotingsregels aan).
- `font-black` (900) wordt `font-extrabold` (800) op de elementen die je in deze taak toch al aanraakt; ga niet het hele bestand door.
- De goed/fout/let-op-kleuren van Tailwind in vragen en toetsen (`emerald-*`, `red-*`, `rose-*`, `amber-*`, `green-*`) en alles uit `learningResultUtils` blijven.

- [ ] **Step 1: Kleine vaste plekken**

| Plek (functie, ca. regel) | Was | Wordt |
| --- | --- | --- |
| `LessonBlockContent`, los onderdeel op slot (ca. 1601) | `flex items-start gap-3 rounded-[20px] border-[2.5px] border-dashed border-[#BDB3A0] bg-[#FFFCF6] p-6` | `lo-melding lo-melding--info gap-3 p-5` |
| idem, `Lock`-icoon | `mt-0.5 shrink-0 text-[var(--helix-muted)]` | `mt-0.5 shrink-0 text-[var(--lo-grijs)]` |
| idem, titel `p` | `font-black text-[var(--helix-navy)]` | `font-extrabold text-[var(--lo-inkt)]` |
| idem, tekst `p` | `helix-muted mt-2 text-sm leading-6` | `mt-2 text-sm font-normal leading-6 text-[var(--lo-grijs)]` |
| spel op slot en nulmeting op slot (ca. 1610 en 1630), het kader | `rounded-[var(--helix-radius-lg)] border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-6` | `rounded-[var(--lo-hoek-m)] bg-[var(--lo-papier-2)] p-5` |
| idem, titel `p` en tekst `p` | zoals hierboven | zoals hierboven (titel `font-extrabold text-[var(--lo-inkt)]`, tekst `mt-2 text-sm leading-6 text-[var(--lo-grijs)]`) |
| `ReadingBlockCompletion`, beide rijen | `border-[var(--helix-border)]` | `border-[var(--lo-lijn)]` |
| idem, afgevinkt-`span` | `inline-flex items-center gap-2 rounded-[var(--helix-radius-lg)] border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] px-5 py-3 text-sm font-black text-[var(--helix-muted)]` | `inline-flex items-center gap-2 rounded-[var(--lo-hoek-m)] bg-[var(--lo-groen-zacht)] px-5 py-3 text-sm font-extrabold text-[var(--lo-groen-inkt)]` |
| idem, `Check` in dat `span` | `text-[#237A4D]` | `className` weglaten (erft de kleur) |
| idem, hinttekst `p` | `text-sm font-semibold leading-6 text-[var(--helix-muted)]` | `text-sm leading-6 text-[var(--lo-grijs)]` |
| `DefaultLearningBlock`, typelabel (ca. 3340) | `` `inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] ${presentation.chipClass}` `` | `` `lo-label ${presentation.chipClass}` `` |
| `lessonBlockPresentation.js`, `chipClass` van voorbeeld | `bg-sky-100 text-sky-800` | `lo-label--blauw` |
| idem, `chipClass` van samenvatting | `bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]` | `lo-label--groen` |
| `DefaultLearningBlock`, leeg-melding (gestippeld, ca. 3368) | gestippelde rand + `--helix-surface-soft` | `rounded-[var(--lo-hoek-m)] bg-[var(--lo-papier-2)] p-5 text-sm text-[var(--lo-grijs)]` (overige layoutklassen zoals `text-center` behouden) |
| `DefaultLearningBlock`, figuur (ca. 3379) | `rounded-lg border ... bg-white/70 p-3` | `rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] bg-[var(--lo-kaart)] p-3` |
| `SlidedeckBlock` (ca. 3456) | `study-panel border-fuchsia-100 bg-[var(--helix-soft-lavender)]/70` | `study-panel bg-[var(--lo-blauw-zacht)]` |
| idem, titel (`font-display text-2xl ...`) | — | `lo-kaart-titel mt-1` |
| idem, waarschuwing (amber) | amber-klassen | `lo-melding lo-melding--info mt-3` (behoud eventuele marge) |
| `GameBlock`, spel ontbreekt (orange-50/200) | — | `lo-melding lo-melding--info` + bestaande marge/padding |
| `GameBlock`, notitie (surface-soft) | `--helix-surface-soft`/`--helix-border` | `bg-[var(--lo-papier)]`, `border-[var(--lo-lijn)]` |
| `GameBlock`, klaar-kaart (`rounded-2xl border bg-white p-6`) en zijn icoontegel (lavender) | — | kaart `rounded-[var(--lo-hoek-l)] border border-[var(--lo-lijn)] bg-[var(--lo-kaart)] p-6`; tegel `lo-hblok` |

- [ ] **Step 2: Quiz en toets**

| Plek | Wordt |
| --- | --- |
| `AssessmentLearningBlock`, `panelKleur` (ca. 3606): toets blue-50/100/950 | `bg-[var(--lo-blauw-zacht)] text-[var(--lo-inkt)]` |
| idem, quiz emerald | `bg-[var(--lo-groen-zacht)] text-[var(--lo-inkt)]` |
| idem, `h3` met `font-display` in de intropanelen | `lo-kaart-titel` (+ bestaande marge) |
| idem, nulmeting af (blue) en herkansingspanelen (emerald, amber) op `study-panel` | `study-panel` + respectievelijk `bg-[var(--lo-blauw-zacht)]`, `bg-[var(--lo-groen-zacht)]`, `bg-[var(--lo-oranje-zacht)]`; tekst `text-[var(--lo-inkt)]`; dode `border-*`-utilities naast `study-panel` weghalen |
| `AssessmentStepper`, kop "Vraag x van y" (paars, hoofdletters) | `lo-eyebrow` |
| idem, nummerpillen (ca. 3897-3912), basis `h-7 min-w-7 rounded-md` | basis `inline-grid h-7 min-w-7 place-items-center rounded-[var(--lo-hoek-s)] border-2 px-1 text-xs font-extrabold tabular-nums`; huidige vraag `border-[var(--lo-inkt)] bg-[var(--lo-geel)] text-[var(--lo-inkt)]` (de ring weg); ingeleverd-wacht `border-transparent bg-[var(--lo-oranje-zacht)] text-[var(--lo-oranje-inkt)]`; goed `border-transparent bg-[var(--lo-groen-zacht)] text-[var(--lo-groen-inkt)]`; fout `border-transparent bg-[var(--lo-rood-zacht)] text-[var(--lo-rood-inkt)]`; leeg `border-[var(--lo-lijn)] bg-[var(--lo-papier-2)] text-[var(--lo-grijs)]` |
| idem, navigatiebalk (ca. 3947, `rounded-2xl border-2 bg-surface-soft`) | `rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] bg-[var(--lo-papier)]` + bestaande layout |
| `AssessmentItemLearningCard`, kaart (ca. 4377) | vervang alleen `rounded-2xl border-2 bg-white` door `rounded-[var(--lo-hoek-l)] border-2 bg-[var(--lo-kaart)]`; de toonklassen (`tone.*`, amber-200 bij herkansen) blijven |
| idem, metaregel (paars, hoofdletters) | `lo-eyebrow` |
| idem, knop opnieuw (lavender) | `lo-knop-start` |
| idem, feedbackvak (surface-soft) | `rounded-[var(--lo-hoek-m)] bg-[var(--lo-papier)] p-3` + bestaande tekstklassen zonder `--helix-` |
| `AssessmentAnswerInput`, antwoordopties (ca. 4486, 4509) `rounded-xl border bg-surface-soft` | `rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] bg-[var(--lo-kaart)]` + bestaande padding; `accent-[var(--helix-purple)]` → `accent-[var(--lo-blauw)]` |

- [ ] **Step 3: Vragen, oefeningen en Digidocent**

| Plek | Wordt |
| --- | --- |
| `QuestionLearningBlock`, Digidocent-feedback (violet, ca. 3015) | `border-[var(--lo-lijn)] bg-[var(--lo-paars-zacht)] text-[var(--lo-inkt)]` |
| idem, invulvak (ca. 3040, `rounded-3xl border-fuchsia-100 bg-...lavender/55`) | `rounded-[var(--lo-hoek-l)] border border-[var(--lo-lijn)] bg-[var(--lo-papier)]` + bestaande `p-5 text-lg leading-10`; `text-[var(--helix-navy)]` → `text-[var(--lo-inkt)]` |
| idem, invulveldjes (ca. 3056, `border-2 border-fuchsia-200`) | `border-2 border-[var(--lo-lijn)]` (statuskleuren uit `inputClassForStatus` blijven) |
| idem, `focus:ring-fuchsia-100` (ca. 3090) | `focus:ring-[var(--lo-blauw-zacht)]` |
| idem, Digidocent-knop en -lade (ca. 3239, 3270, 3279) | `border-fuchsia-100` → `border-[var(--lo-lijn)]`; `bg-[var(--helix-soft-lavender)]` → `bg-[var(--lo-blauw-zacht)]`; `rounded-3xl`/`rounded-t-3xl` → `rounded-[var(--lo-hoek-xl)]`/`rounded-t-[var(--lo-hoek-xl)]` |
| `ExerciseLearningBlock`, veldkaarten (ca. 4753, 4814) | `rounded-2xl border bg-white` → `rounded-[var(--lo-hoek-l)] border border-[var(--lo-lijn)] bg-[var(--lo-kaart)]` |
| idem, nummertegel (lavender/paars) | `lo-hblok` |
| idem, voortgangsbalk (ca. 4805-4808) | buitenste `lo-voortgang` met binnenste `<i style={{ width: ... }} />` alleen als de huidige markup al een binnen-`div` met inline breedte is; anders alleen kleuren: track `bg-[var(--lo-papier-2)]`, vulling `bg-[var(--lo-groen)]` |
| idem, Digidocent-vak (ca. 4888-4890, violet) | vak `rounded-[var(--lo-hoek-m)] bg-[var(--lo-paars-zacht)] p-3`; kopje `lo-eyebrow text-[var(--lo-paars-inkt)]`; tekst `mt-1 text-sm leading-6 text-[var(--lo-inkt)]` |
| idem, vinkje `#237A4D` (ca. 4919) | `text-[var(--lo-groen-inkt)]` |
| `ParagraphEndActivity`, docent-kijkt-na-vak (amber, ca. 1815) | `rounded-[var(--lo-hoek-l)] bg-[var(--lo-oranje-zacht)] text-[var(--lo-inkt)]` + bestaande padding |
| idem, klaar-vak (slate, ca. 1839) | `rounded-[var(--lo-hoek-l)] bg-[var(--lo-papier-2)] text-[var(--lo-inkt)]` + bestaande padding |
| idem, opdrachtkaarten (ca. 1867) | `rounded-[var(--lo-hoek-l)] border border-[var(--lo-lijn)] bg-[var(--lo-kaart)]` + padding; "Opdracht n" → `lo-eyebrow` |
| idem, feedback (violet, ca. 1878) | `rounded-[var(--lo-hoek-m)] bg-[var(--lo-paars-zacht)] px-4 py-3 text-sm font-bold text-[var(--lo-inkt)]` |
| idem, koppen met `font-display text-3xl` | `text-3xl font-extrabold text-[var(--lo-inkt)]` (zonder `font-display`) |

De rekenbladen (`MathToolbox` en verwanten, ca. 1908-2380), `InleveringVak` en de rekenmachine blijven in deze fase zoals ze zijn; die worden alleen bij wiskunde gebruikt en komen in fase 4 mee. Noteer dat in je rapport.

- [ ] **Step 4: Controleren**

Run: `npx eslint src/pages/StudentLessonPage.jsx src/lib/lessonBlockPresentation.js` → geen fouten.
Run: `node --test src/lib/` → PASS (ook `lessonBlockPresentation.test.js`, `learningResultUtils.test.js`, `studyRouteState.test.js`).
Run: `npm run build` → slaagt.
Run: `git diff -U0 src/pages/StudentLessonPage.jsx | grep '^[-+]' | grep -v 'className\|^+++\|^---'` → alleen de vervangen `Check`-regel en eventuele regels waar een `className`-string over meerdere regels liep; geen handlers, state of tekst.
Run: `grep -c "fuchsia\|violet" src/pages/StudentLessonPage.jsx` → alleen nog treffers binnen 1908-2380 (rekenbladen).

- [ ] **Step 5: Commit**

```bash
git add src/pages/StudentLessonPage.jsx src/lib/lessonBlockPresentation.js
git commit -m "style(les): lesblokken, quiz, toets en Digidocent in de leeromgeving-stijl

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Fase 2b afronden en live zetten

**Files:**
- Modify: `docs/LEEROMGEVING-STIJL.md` (paragraaf over de lespagina)
- Modify: `docs/HANDOFF.md` (paragraaf 5 en 6)

- [ ] **Step 1:** `npx eslint src/index.css src/pages/StudentLessonPage.jsx src/components/lesson src/components/leeromgeving src/pages/AdminStijlgidsPage.jsx src/lib/lessonBlockPresentation.js` (CSS overslaan als eslint hem niet leest) `&& node --test src/lib/ && npm run build && npx playwright test --reporter=line` → alles groen.
- [ ] **Step 2:** Bekijk `/admin/stijlgids` op desktop- en telefoonbreedte (375px) met de ontwikkelaarslogin; maak schermafbeeldingen naar `exports/leeromgeving/fase-2b-stijlgids-*.png`.
- [ ] **Step 3:** `docs/LEEROMGEVING-STIJL.md`: een paragraaf "Lespagina" met de scope `.study-stijl` (wat hij met welke gedeelde klasse doet en waarom hij onderaan `index.css` staat), het nummerblokje in de stappenbalk, en wat bewust nog oud is (rekenbladen, `InleveringVak`, overlay-achtergronden, `MediaRenderer`, presenter).
- [ ] **Step 4:** `docs/HANDOFF.md` paragraaf 5: alinea "**7 oktober: Leeromgeving-stijl fase 2b live.**" met wat er veranderde, markering `leeromgeving-fase-2b` en de deploy-id. Paragraaf 6: het fasepunt wordt "fase 2c (profiel, tokenshop, spellenoverzicht, Mijn klas, de pillen in de menubalk)", plus de testronde van Kevin voor 2a en 2b samen.
- [ ] **Step 5:** Commit de twee documenten; `git tag -a leeromgeving-fase-2b -m "HELIX Leeromgeving-stijl fase 2b: de lespagina"`; `git push origin codex/digitale-vaardigheden-seed --follow-tags`.
- [ ] **Step 6:** `npx vercel --prod --yes`; controleer dat de live CSS `study-step-nummer` bevat; zet de deploy-id in de handoff, commit en push.
- [ ] **Step 7 (controller):** Kevin vragen om als testleerling van ER3L1A, een vmbo-klas en H1i1 een paragraaf door te lopen: stappenbalk, een leesstap afvinken, een quiz, een presentatie, de leerdoelen, en op een telefoon de lade.

---

## Self-review

- **Spec 3.2, Lespagina gedekt:** lesblok als witte kaart (Task 1 `.study-block`), stappenbalk als lijst met scheidingslijnen en een geel nummerblokje voor de huidige stap (Task 1 CSS, Task 2 JSX), "Volgende stap" als hoofdknop (Task 3, `lo-knop` in de voetbalk), alleen het uiterlijk (Global Constraints; diff-controle in Task 3 en 4).
- **Spec 6, risico's:** lespagina van 5043 regels → alleen `className`, met diff-controle; Tailwind-kleurfamilies niet aangepast → goed/fout-kleuren blijven, thema onaangeroerd; per blok bekijken → stijlgids-sectie (Task 2) en Kevins testronde (Task 5).
- **Spec 5, controle:** stijlgids met meting (Task 2, e2e), pure test op de CSS (Task 1), `designTokenStyles.test.js` blijft groen (scope onderaan, getest in Task 1).
- **Namen consistent:** `.study-step-nummer`, `.study-step-type`, `.study-stappen`, `.study-einde`, `.study-stijl` gedefinieerd in Task 1 en zo gebruikt in Task 2-4. `Label` krijgt `...rest` in Task 2 en wordt met `title` gebruikt in Task 2 en 3.
- **Bewust niet in 2b:** rekenbladen, `InleveringVak`, rekenmachine, `MediaRenderer`, `PdfSlideDeckPresenter`, overlay-achtergronden, `VictoryEffectOverlay`, `NiveauOmhoogMoment` (2c).
