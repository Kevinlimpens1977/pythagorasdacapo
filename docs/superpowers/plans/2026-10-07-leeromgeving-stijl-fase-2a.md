# HELIX Leeromgeving-stijl, fase 2a: implementatieplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** De eerste indruk van de leerling in de nieuwe stijl: de inlogpagina's, de menubalk, de startpagina als lijst met H-blokjes en "Start hier", en de hoofdstukpagina. Plus het leesbaarheidspunt uit fase 1 (rode tekst).

**Architecture:** Dezelfde bouwstenen als fase 1 (`src/components/leeromgeving/`, `src/styles/leeromgeving.css`). Pure knoplogica in `src/lib/leeromgeving.js` met `node --test`. Alle zichtbare leerlingteksten blijven via `src/lib/uiTaal.js` lopen (tien talen). Alleen het uiterlijk en de opbouw van de startpagina veranderen; data en routes niet.

**Tech Stack:** React 19, Vite, Tailwind 4, lucide-react 1.14, node:test, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-07-leeromgeving-stijl-design.md` (paragraaf 3.2), stijldocument `docs/LEEROMGEVING-STIJL.md`.

## Global Constraints

- Werk in `C:\Projecten\helix leerplatform` op `codex/digitale-vaardigheden-seed`. Nooit `git add -A`/`git add .`; noem paden. `.claude/launch.json` blijft buiten de commits.
- Commits Nederlands met voorvoegsel, eindigend op exact `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Push, markering en deploy alleen in de laatste taak.
- Alle tekst die een leerling ziet loopt via `tekst()`/`aantal()` uit `useLesstofTaal` en staat in `src/lib/uiTaal.js` in alle tien talen (nl, el, it, uk, en, tr, pl, ro, es, ar). `node --test src/lib/uiTaal.test.js` moet groen blijven.
- Leerlingen zien het woord "onderdelen" (bestaande, vertaalde sleutels), niet "lesblokken".
- Gebruik de bouwstenen en klassen van de leeromgeving (`Kaart`, `KaartKop`, `HoofdstukRij`, `ParagraafRij`, `StartKnop`, `Label`, `PaginaKop`, `.lo-*`). Geen Bangers, geen `.ds-display`, geen `.ds-anchor`, geen nieuwe losse hexwaarden.
- Iets wat dicht is toont het slotje en een uitgeschakelde knop.
- Bij openen staat elke uitklaprij dicht (Kevin, 7 okt 2026).
- Niet veranderen: routes, `buildLessonPath`, `useStudentOutline`, de data, de werking van knoppen, de spellen, de presenter, het certificaat, de beheerpagina's.
- `src/lib/designTokenStyles.test.js` blijft groen; de drie AppShell-regels die hij zoekt (`const handleLogoClick = () =>`, `navigate(isAdmin ? '/admin/lesstof' : '/')`, `aria-label={isAdmin ? 'Ga naar Lesstof' : 'Ga naar HELIX start'}`) blijven letterlijk staan.
- Na elke taak: `npx eslint <gewijzigde bestanden>` en `node --test src/lib/`.

---

### Task 1: Donkerder rood, "Start hier" in tien talen, en de knoplogica

**Files:**
- Modify: `src/styles/leeromgeving.css` (token en twee regels), `src/lib/leeromgevingStijl.test.js`, `docs/LEEROMGEVING-STIJL.md`, `docs/superpowers/specs/2026-10-07-leeromgeving-stijl-design.md` (tabel 2.1)
- Modify: `src/lib/uiTaal.js` (sleutel `knop.startHier` in alle tien blokken, direct onder `knop.start`)
- Modify: `src/lib/leeromgeving.js`, `src/lib/leeromgeving.test.js`

**Interfaces:**
- Produces: token `--lo-rood-inkt: #B42F25`; klassen `.lo-voortgang` (balk) en `.lo-invoer` (invoerveld); `uiTaal`-sleutel `knop.startHier`; `hoofdstukKnopSleutel(progress)` → `'knop.bekijkTerug' | 'knop.gaVerder' | 'knop.start'`; `paragraafKnopSleutel(progress)` → `'knop.bekijkTerug' | 'knop.gaVerder' | 'knop.startHier'`.

- [ ] **Step 1: Falende tests**

In `src/lib/leeromgevingStijl.test.js`: voeg `'--lo-rood-inkt': '#B42F25'` toe aan het object `verwacht` van de kleurentest, en een nieuwe test:

```js
test('rode tekst is donker genoeg en er is een voortgangsbalk en een invoerveld', () => {
  assert.match(regel('.lo-label--rood'), /color:\s*var\(--lo-rood-inkt\)/);
  assert.match(regel('.lo-melding--fout'), /color:\s*var\(--lo-rood-inkt\)/);
  assert.match(regel('.lo-voortgang'), /height:\s*8px/);
  assert.match(regel('.lo-invoer'), /border:\s*1px solid var\(--lo-lijn\)/);
  assert.match(regel('.lo-invoer'), /border-radius:\s*var\(--lo-hoek-m\)/);
});
```

In `src/lib/leeromgeving.test.js`: voeg `hoofdstukKnopSleutel` en `paragraafKnopSleutel` toe aan de import en:

```js
test('de knop van een hoofdstuk en een paragraaf volgt de voortgang', () => {
  assert.equal(hoofdstukKnopSleutel({ done: 0, total: 5, isCompleted: false }), 'knop.start');
  assert.equal(hoofdstukKnopSleutel({ done: 2, total: 5, isCompleted: false }), 'knop.gaVerder');
  assert.equal(hoofdstukKnopSleutel({ done: 5, total: 5, isCompleted: true }), 'knop.bekijkTerug');
  assert.equal(hoofdstukKnopSleutel(undefined), 'knop.start');
  assert.equal(paragraafKnopSleutel({ done: 0, total: 7, isCompleted: false }), 'knop.startHier');
  assert.equal(paragraafKnopSleutel({ done: 3, total: 7, isCompleted: false }), 'knop.gaVerder');
  assert.equal(paragraafKnopSleutel({ done: 7, total: 7, isCompleted: true }), 'knop.bekijkTerug');
});
```

In `src/lib/uiTaal.test.js` een test:

```js
test('Start hier staat in alle talen', () => {
  assert.equal(uiTekst('knop.startHier', 'nl'), 'Start hier');
  assert.equal(uiTekst('knop.startHier', 'en'), 'Start here');
});
```

Run: `node --test src/lib/leeromgevingStijl.test.js src/lib/leeromgeving.test.js src/lib/uiTaal.test.js` → FAIL.

- [ ] **Step 2: CSS**

In `src/styles/leeromgeving.css`: in `:root` direct na `--lo-rood: #D83A2E;` de regel `--lo-rood-inkt: #B42F25;`. Vervang in `.lo-label--rood` en `.lo-melding--fout` `color: var(--lo-rood)` door `color: var(--lo-rood-inkt)`. Voeg in `@layer components` na de meldingen toe:

```css
  /* Voortgangsbalk */
  .lo-voortgang { display: block; height: 8px; overflow: hidden; border-radius: 999px; background: var(--lo-papier-2); }
  .lo-voortgang > i { display: block; height: 100%; border-radius: 999px; background: var(--lo-groen); }

  /* Invoerveld */
  .lo-invoer { display: block; width: 100%; padding: 12px 14px; border: 1px solid var(--lo-lijn); border-radius: var(--lo-hoek-m); background: var(--lo-kaart); color: var(--lo-inkt); font-family: var(--lo-letter); font-size: 15px; line-height: 1.5; }
  .lo-invoer:focus-visible { outline: 3px solid var(--lo-blauw); outline-offset: 2px; border-color: var(--lo-blauw); }
  .lo-veldlabel { display: block; margin-bottom: 6px; font-size: 14px; line-height: 21px; font-weight: 700; color: var(--lo-inkt); }
```

- [ ] **Step 3: "Start hier" in tien talen**

In `src/lib/uiTaal.js`, in elk taalblok direct onder `'knop.start'`:

| Blok | Waarde |
| --- | --- |
| NL | `'knop.startHier': 'Start hier',` |
| EL | `'knop.startHier': 'Ξεκίνα εδώ',` |
| IT | `'knop.startHier': 'Inizia qui',` |
| UK | `'knop.startHier': 'Почни тут',` |
| EN | `'knop.startHier': 'Start here',` |
| TR | `'knop.startHier': 'Buradan başla',` |
| PL | `'knop.startHier': 'Zacznij tutaj',` |
| RO | `'knop.startHier': 'Începe aici',` |
| ES | `'knop.startHier': 'Empieza aquí',` |
| AR | `'knop.startHier': 'ابدأ هنا',` |

- [ ] **Step 4: Knoplogica**

Onderaan `src/lib/leeromgeving.js`:

```js
/** Welke knoptekst (uiTaal-sleutel) een hoofdstuk krijgt, naar de voortgang. */
export const hoofdstukKnopSleutel = (progress = {}) => {
  if (progress?.isCompleted) return 'knop.bekijkTerug';
  return (progress?.done || 0) > 0 ? 'knop.gaVerder' : 'knop.start';
};

/** Welke knoptekst (uiTaal-sleutel) een paragraaf krijgt, naar de voortgang. */
export const paragraafKnopSleutel = (progress = {}) => {
  if (progress?.isCompleted) return 'knop.bekijkTerug';
  return (progress?.done || 0) > 0 ? 'knop.gaVerder' : 'knop.startHier';
};
```

- [ ] **Step 5: Documenten**

`docs/LEEROMGEVING-STIJL.md`, kleurentabel: rij `--lo-rood` / `-zacht` wordt `| \`--lo-rood\` / \`-inkt\` / \`-zacht\` | #D83A2E / #B42F25 / #FADDDA | fouten; tekst altijd in -inkt (4,5:1 op -zacht) |`. Zelfde rij in de tabel van spec 2.1.

- [ ] **Step 6: Tests en commit**

Run: `node --test src/lib/ && npx eslint src/lib/leeromgeving.js src/lib/leeromgeving.test.js src/lib/leeromgevingStijl.test.js src/lib/uiTaal.js src/lib/uiTaal.test.js` → alles PASS.

```bash
git add src/styles/leeromgeving.css src/lib/leeromgevingStijl.test.js src/lib/leeromgeving.js src/lib/leeromgeving.test.js src/lib/uiTaal.js src/lib/uiTaal.test.js docs/LEEROMGEVING-STIJL.md docs/superpowers/specs/2026-10-07-leeromgeving-stijl-design.md
git commit -m "feat(stijl): donkerder rood, Start hier in tien talen en knoplogica

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: De startpagina als lijst

**Files:**
- Modify: `src/components/layout/TableOfContents.jsx` (de hele weergave; data-ophalen en taal blijven)
- Modify: `src/components/lesson/TaalSchakelaar.jsx` (uiterlijk)

**Interfaces:**
- Consumes: Task 1 (`hoofdstukKnopSleutel`, `paragraafKnopSleutel`, `knop.startHier`, `.lo-voortgang`); bouwstenen uit `src/components/leeromgeving`; `buildLessonPath`, `buildResumePointer`, `zonderVergrendeldeHoofdstukken` zoals ze nu al in het bestand gebruikt worden.

**Wat de leerling ziet, van boven naar beneden:**

1. `PaginaKop` met eyebrow `tekst('lesstof.kop')`, titel `tekst('lesstof.titel')`, uitleg `` `${aantal('hoofdstuk.aantal', chapters.length)} · ${tekst('onderdeel.af', { done, total })}` `` (dezelfde totalen als nu), en als `acties` de `TaalSchakelaar`. De `HelixBrandBanner` verdwijnt van deze pagina (het logo staat al in de menubalk).
2. **Verder waar je was** als `Kaart`:
   - geen pointer: `<p className="lo-melding lo-melding--info">` met `CheckCircle2` (16px) en `verder.klaar.titel` vet + `verder.klaar.tekst`;
   - wel een pointer: eyebrow (`<p className="lo-eyebrow">`) `verder.kop`; `<h2 className="lo-kaart-titel">` met paragraafnummer en (vertaalde) paragraaftitel; `<p className="lo-kaart-uitleg">` met hoofdstuktitel · (`status.nietBegonnen` of `onderdeel.af`); een `lo-kaart-voet` met links `<Label kleur="blauw" icoon={PlayCircle}>{onderdeelTitle}</Label>` en rechts `<button type="button" className="lo-knop">` met `knop.beginnen` of `knop.gaVerder` + `ArrowRight` (18px) naar `buildLessonPath(paragraafId, onderdeelId)`; daaronder `<span className="lo-voortgang" aria-hidden="true"><i style={{ width: `${pct}%` }} /></span>`.
3. **De hoofdstukken** in één `Kaart` met één `<div className="lo-lijst">`. Per hoofdstuk een `HoofdstukRij`:

```jsx
const opSlot = chapter.vergrendeld === true;
const titel = hoofdstukInfo(chapter.id)?.titel || chapter.title;
const onderregel = `${aantal('paragraaf.aantal', chapter.paragraphRows.length)} · ${tekst('onderdeel.af', { done: chapter.progress.done, total: chapter.progress.total })}`;
<HoofdstukRij
  key={chapter.id}
  nummer={chapter.number}
  titel={titel}
  onderregel={onderregel}
  slotTekst={tekst(chapter.aangekondigd ? 'slot.komtEraan' : 'slot.uitleg')}
  labels={chapter.progress.isCompleted ? <Label kleur="groen" icoon={Check}>{tekst('status.af')}</Label> : null}
  opSlot={opSlot}
  open={open[chapter.id] === true}
  onWissel={() => setOpen((stand) => ({ ...stand, [chapter.id]: !stand[chapter.id] }))}
  onStart={() => navigate(`/hoofdstuk/${chapter.id}`)}
  startTekst={tekst(hoofdstukKnopSleutel(chapter.progress))}
>
  {chapter.paragraphRows.map((row) => (
    <ParagraafRij
      key={row.id}
      code={row.number || row.code}
      naam={paragraafInfo(row.id)?.titel || row.title}
      onderregel={row.vergrendeld ? tekst('slot.label') : tekst('onderdeel.af', { done: row.progress.done, total: row.progress.total })}
      labels={row.optioneel ? <Label kleur="blauw">{tekst('plus.label')}</Label> : null}
      onStart={() => navigate(buildLessonPath(row.id, row.resumeOnderdeelId))}
      startTekst={tekst(paragraafKnopSleutel(row.progress))}
      startUit={row.vergrendeld === true}
    />
  ))}
</HoofdstukRij>
```

   met `const [open, setOpen] = useState({});` (alles dicht bij openen). Controleer de echte namen van `paragraafInfo`/`hoofdstukInfo` en de pointer-velden in het huidige bestand en gebruik die.
4. De plus-uitleg (als er plusparagrafen zijn) als `<p className="lo-melding lo-melding--info">` met `plus.label` vet en `plus.uitleg`.
5. **Laden:** `LesstofSkelet` wordt drie grijze vlakken in de nieuwe stijl: een `div` van 120px hoog en twee van 220px, elk met klasse `lo-kaart animate-pulse` en `aria-hidden`, plus de bestaande sr-only tekst.
6. **Leeg:** een `Kaart` met `KaartKop` titel `lesstof.leeg.titel` en uitleg `lesstof.leeg.tekst`.
7. De pagina-wrapper: `<div className="helix-page lo-tekst">` met daarin `<div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 md:py-10">`.

**TaalSchakelaar**: dezelfde props en werking; uiterlijk met de keuzeknoppen-stijl: een `div className="lo-keuzes"` met `Languages` (16px, kleur `var(--lo-grijs)`, `aria-hidden`) en twee `button className="lo-keuze"` met `aria-pressed` (Nederlands / `taalLabel(taal)` met spinner als `bezig`).

- [ ] **Step 1:** Herschrijf de weergave van `TableOfContents.jsx` volgens 1-7. Laat de imports van hooks en helpers staan die je nog gebruikt; verwijder ongebruikte.
- [ ] **Step 2:** Herschrijf het uiterlijk van `TaalSchakelaar.jsx`.
- [ ] **Step 3:** `npx eslint src/components/layout/TableOfContents.jsx src/components/lesson/TaalSchakelaar.jsx && node --test src/lib/ && npm run build` → schoon, PASS, build ok.
- [ ] **Step 4: Commit**

```bash
git add src/components/layout/TableOfContents.jsx src/components/lesson/TaalSchakelaar.jsx
git commit -m "feat(leerling): startpagina als lijst met H-blokjes en Start hier

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: De hoofdstukpagina

**Files:**
- Modify: `src/components/lesson/ChapterDetail.jsx` (uiterlijk van `ChapterDetailView`, `OutlineRow`, `ParagraphPanel`, `AssessmentRow`, `RowOptionsMenu`)
- Modify: `src/pages/StudentChapterPage.jsx` (pagina-wrapper, terugknop, slot- en niet-gevonden-scherm, `NogTeDoen`)

**Interfaces:**
- Consumes: Task 1; bouwstenen; `ChapterDetailView`-props blijven precies gelijk.

**Wat er verandert (werking en teksten blijven):**

1. **Wrapper** `PageShell`: `helix-page lo-tekst` met `mx-auto max-w-7xl px-4 py-8 md:py-10`. Terugknop "Terug naar overzicht" als `lo-knop-tweede` met `ArrowLeft`.
2. **Kop van het hoofdstuk** (in `ChapterDetailView`): een `Kaart` met links een `<span className="lo-hblok">H{chapter.number}</span>` (of `?` zonder nummer), de eyebrow, de titel als `lo-kaart-titel`, de badges als `Label` (paragrafen en plus `blauw`, studieduur `blauw`); rechts `rubriek.voortgang`, `done / total` en de balk `.lo-voortgang`.
3. **Rijen** (introductie, voorkennis, paragrafen, oefentoetsen, toetsen) samen in één `<div className="lo-lijst">`. `OutlineRow` krijgt het uiterlijk van een `HoofdstukRij`: een `lo-rij` met een `lo-rij-toggle` (pijltje 15px), links een blokje — bij een paragraaf `<span className="lo-hblok">{row.number}</span>`, bij introductie/voorkennis/toetsen het bestaande icoon in een `lo-hblok`-vak met `lo-hblok--dicht`-kleuren — dan `lo-rij-titel` en `lo-onderregel` (de bestaande meta), het `PlusLabel` als `<Label kleur="blauw">`, de `done / total` als `lo-onderregel`, en de startknop als `StartKnop` met de bestaande `startLabel`. Vergrendeld: geen stippellijn meer; crème blokje (`lo-hblok lo-hblok--dicht`), `Lock` 15px, onderregel `slot.label · slot.uitleg`, `StartKnop` uitgeschakeld.
4. **Uitgeklapt paneel** (`ParagraphPanel`): binnen `lo-paragrafen`. Leerdoelen als `lo-melding lo-melding--info` met de eyebrow `intro.watJeGaatLeren` en een lijst; elk onderdeel als `lo-paragraafrij` met nummer of vinkje (`CheckCircle2` 16px in `var(--lo-groen)`), titel (`lo-rij-titel`), type (`lo-onderregel`), `StartKnop` (`icoon={null}`) met `knop.opnieuw` of `knop.start`, en het bestaande menu. Vergrendeld onderdeel: `Lock`, `onderdeel.slotTekst`, knop uitgeschakeld.
5. **`RowOptionsMenu`**: knop met `lo-knop-tweede`-uitstraling (36px vierkant, `MoreVertical`), menu als witte `lo-kaart` met `padding: 6px` en items als `lo-knop-tweede` zonder rand.
6. **`NogTeDoen`** (rechterkolom): een `Kaart` met eyebrow `nogTeDoen.kop`, uitleg, en de items als `lo-lijst` met `lo-rij` (titel + onderregel + `ArrowRight`).
7. **Slot- en niet-gevonden-scherm**: een `Kaart` met `KaartKop` (titel en uitleg via de bestaande sleutels) en een `lo-knop` "Terug naar overzicht".
8. Verwijder de losse hexwaarden `#BDB3A0` en `#FFFCF6` uit deze twee bestanden.

- [ ] **Step 1:** Pas `ChapterDetail.jsx` aan volgens 2-5; laat props, handlers, `aria-*`, ids (`paneel-${rowId}`) en teksten staan.
- [ ] **Step 2:** Pas `StudentChapterPage.jsx` aan volgens 1, 6 en 7.
- [ ] **Step 3:** `npx eslint src/components/lesson/ChapterDetail.jsx src/pages/StudentChapterPage.jsx && node --test src/lib/ && npm run build` → schoon, PASS, ok. `grep -n "#BDB3A0\|#FFFCF6\|ds-display" src/components/lesson/ChapterDetail.jsx src/pages/StudentChapterPage.jsx` → niets.
- [ ] **Step 4: Commit**

```bash
git add src/components/lesson/ChapterDetail.jsx src/pages/StudentChapterPage.jsx
git commit -m "feat(leerling): hoofdstukpagina in de leeromgeving-stijl

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: De menubalk voor leerlingen

**Files:**
- Modify: `src/components/layout/AppShell.jsx` (alleen de header en het leerlinggedeelte)

**Wat er verandert:**

1. `<header>`: witte balk `bg-[var(--lo-kaart)]`, onderrand `border-b border-[var(--lo-lijn)]`, geen blur of zware schaduw (`shadow-[0_1px_0_var(--lo-lijn)]` mag weg), hoogte en padding gelijk.
2. Het tabje **Lesmateriaal** (leerling): ook actief op `/hoofdstuk/...` (nu alleen `/` en `/chapter/`). Stijl: de pil-groep wordt een `lo-keuzes`-rij; het tabje een `lo-keuze` met `aria-pressed` voor actief.
3. **Spellen** en **Mijn klas**: `lo-knop-tweede` met het bestaande icoon, compacter (`padding: 8px 12px`, via Tailwind `px-3 py-2`), actief = `aria-current="page"` en rand `var(--lo-blauw)`.
4. **Profielknop** en **uitloggen**: `lo-knop-tweede`-uitstraling; naam 15px/700, titel als `lo-onderregel`.
5. De pillen (`EventPill`, `KlasDoelPill`, `WeekdoelPill`, `NiveauPill`, `TokenBalancePill`) blijven in deze taak ongemoeid (fase 2c).
6. Het beheerdeel van de header (adminknoppen, Help, Reset) blijft ongemoeid (fase 3), behalve dat het in dezelfde witte balk staat.
7. De drie regels die `designTokenStyles.test.js` zoekt blijven letterlijk staan.

- [ ] **Step 1:** Pas de header aan volgens 1-7.
- [ ] **Step 2:** `npx eslint src/components/layout/AppShell.jsx && node --test src/lib/ && npm run build` → schoon, PASS (inclusief `designTokenStyles.test.js`), ok.
- [ ] **Step 3: Commit**

```bash
git add src/components/layout/AppShell.jsx
git commit -m "feat(leerling): menubalk in de leeromgeving-stijl

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: De inlogpagina's en de inlogtests

**Files:**
- Modify: `src/components/auth/LoginScreen.jsx`, `src/components/auth/AdminLoginScreen.jsx`
- Modify: `tests/e2e/auth-admin-smoke.spec.js`

**Wat er verandert:**

1. Beide pagina's: crème achtergrond (`helix-page lo-tekst`), in het midden één `Kaart` van maximaal 480px breed (`mx-auto w-full max-w-[480px]`), bovenin het HELIX-logo (`afbeeldingen/logo.png`, 64px hoog) en een `PaginaKop`-achtige kop: titel als `lo-paginatitel` (de bestaande tekst: "Hoi! Log in" / "Maak je account" / "Inloggen op beheer"), uitleg als `lo-paginauitleg`. Het gekleurde merkpaneel links en de `ds-display`-koppen verdwijnen.
2. Invoervelden: `lo-invoer` met een `label className="lo-veldlabel"`; het oogje bij het wachtwoord blijft (absoluut rechts in het veld).
3. Hoofdknop (Inloggen / Account maken / Inloggen met schoolaccount): `lo-knop` over de volle breedte (`w-full justify-center`). Tweede knoppen (Inloggen met e-mail, Wachtwoordlink sturen): `lo-knop-tweede` volle breedte. Links (Wachtwoord vergeten?, Account aanmaken, naar beheer, naar leerling): tekstknoppen in `var(--lo-blauw-inkt)`, 14px/700.
4. Fout- en meldingsvakken: `lo-melding lo-melding--fout` / `lo-melding--info`.
5. Het blok "Alleen lokaal" (ontwikkelaarsknoppen) blijft met dezelfde knopteksten "Als leerling" en "Als beheerder", als `lo-melding lo-melding--info` met twee `lo-knop-tweede`.
6. Alle zichtbare teksten, routes en `aria-*` blijven gelijk.
7. `tests/e2e/auth-admin-smoke.spec.js` bijwerken naar de huidige app:
   - admintest: `page.goto('/login/beheer')`, knop `/Als beheerder/i`, URL `/\/admin\/instellingen$/`, daarna `/admin/ai-instellingen` en de bestaande koptekst- en modelcontroles; verwijder de controle op een knop "Beheer";
   - leerlingtest: `page.goto('/login/beheer')`, knop `/Als leerling/i`, URL `http://127.0.0.1:5173/`, daarna `/admin/ai-instellingen` → terug op `/`, knop `/Lesmateriaal/i` zichtbaar.

- [ ] **Step 1:** Pas beide schermen aan volgens 1-6.
- [ ] **Step 2:** Werk de e2e-test bij volgens 7.
- [ ] **Step 3:** `npx eslint src/components/auth/LoginScreen.jsx src/components/auth/AdminLoginScreen.jsx tests/e2e/auth-admin-smoke.spec.js && node --test src/lib/ && npm run build && npx playwright test --reporter=line` → alle e2e-tests passed (draai Playwright met `--output=<tempmap>` als `test-results/` een EPERM geeft; zet `node_modules/.vite/deps` opzij bij een EPERM van de dev-server). `grep -n "ds-display" src/components/auth/*.jsx` → niets.
- [ ] **Step 4: Commit**

```bash
git add src/components/auth/LoginScreen.jsx src/components/auth/AdminLoginScreen.jsx tests/e2e/auth-admin-smoke.spec.js
git commit -m "feat(inloggen): inlogpagina's in de leeromgeving-stijl, inlogtests bijgewerkt

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Fase 2a afronden en live zetten

**Files:**
- Modify: `docs/HANDOFF.md` (paragraaf 5 en 6)

- [ ] **Step 1:** `npx eslint src/components/layout src/components/lesson/ChapterDetail.jsx src/components/lesson/TaalSchakelaar.jsx src/pages/StudentChapterPage.jsx src/components/auth/LoginScreen.jsx src/components/auth/AdminLoginScreen.jsx src/lib/leeromgeving.js src/lib/uiTaal.js && node --test src/lib/ && npm run build && npx playwright test --reporter=line` → alles groen.
- [ ] **Step 2:** `docs/HANDOFF.md` paragraaf 5, na de alinea over fase 1: een alinea "**7 oktober: Leeromgeving-stijl fase 2a live.**" met wat er veranderde (inlogpagina's, menubalk, startpagina als lijst met "Start hier", hoofdstukpagina, `--lo-rood-inkt`, `knop.startHier` in tien talen, inlogtests bijgewerkt), markering `leeromgeving-fase-2a` en de deploy-id. Paragraaf 6: het fase-2-punt wordt "fase 2b (lespagina) en 2c (profiel, tokenshop, spellen, Mijn klas)". Verhelp ook de dubbele nummering 0 in paragraaf 6.
- [ ] **Step 3:** Commit `docs/HANDOFF.md`, `git tag -a leeromgeving-fase-2a -m "HELIX Leeromgeving-stijl fase 2a: inloggen, menubalk, startpagina, hoofdstukpagina"`, `git push origin codex/digitale-vaardigheden-seed --follow-tags`.
- [ ] **Step 4:** `npx vercel --prod --yes`; controleer dat de live CSS `lo-voortgang` bevat; zet de deploy-id in de handoff, commit en push.
- [ ] **Step 5 (controller):** Kevin vragen om als testleerling van H1i1, een vmbo-klas en ER3L1A in te loggen en de startpagina, een hoofdstukpagina en het uitklappen te bekijken, ook op een telefoon of iPad.

---

## Self-review

- **Spec 3.2 gedekt:** inlogpagina's (Task 5), menubalk (Task 4), startpagina met Verder waar je was, hoofdstukrijen, voortgang, uitklappen naar paragrafen met Start hier, slot met uitleg, plus als label (Task 2), hoofdstukpagina met paragraafrijen, stappen en slot zonder stippellijn (Task 3), teksten in tien talen (Task 1). Lespagina, profiel, tokenshop, spellen en Mijn klas zijn fase 2b en 2c.
- **Uit fase 1 meegenomen:** rode tekst donkerder (Task 1); verouderde inlogtests (Task 5).
- **Namen:** `hoofdstukKnopSleutel`, `paragraafKnopSleutel`, `knop.startHier`, `.lo-voortgang`, `.lo-invoer`, `.lo-veldlabel` zijn in Task 1 gedefinieerd en zo gebruikt in Task 2, 3 en 5.
