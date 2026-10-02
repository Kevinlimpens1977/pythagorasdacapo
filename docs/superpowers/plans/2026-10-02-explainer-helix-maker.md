# Explainervideo's per hoofdstuk (explainer-helix-maker) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Een herhaalbare pijplijn plus de skill `/explainer-helix-maker` die van de lesstof van een HELIX-hoofdstuk een Nederlandse uitlegvideo van maximaal 3:00 maakt en die vóór de Samenvatting in de juiste paragraaf zet; eerste run: Binask EOA H2.

**Architecture:** HELIX krijgt een ondertitelspoor in het media-blok (drie kleine wijzigingen in `src/`). Een Remotion-project in `video/` voegt stemmen (ElevenLabs-MCP), comic-shots (Blender, zonder scherm gerenderd vanuit Python) en getekende HELIX-onderdelen samen tot een MP4 plus een .vtt. Een plaatsingsscript uploadt naar Storage en zet het blok in Firestore, eerst als dry run.

**Tech Stack:** React 19, Remotion 4.0.512 (`remotion`, `@remotion/cli`, `@remotion/media`, `@remotion/google-fonts`), Blender 5.2 (bpy, EEVEE), ElevenLabs-MCP (`eleven_v4`, `gemini-3-pro-image`, `birefnet-v2-bg-removal`), Firebase Admin (via `functions/`), Node 20 `node:test`, ffmpeg/ffprobe 9.

**Spec:** `docs/superpowers/specs/2026-10-02-explainer-helix-maker-design.md`

## Global Constraints

- Taal in app, video, commits en berichten aan Kevin: Nederlands, korte zinnen, geen emoji. Iconen alleen lucide of SVG.
- Niets committen of pushen zonder dat Kevin het vraagt. Nooit `git add -A`; noem de paden.
- Elk schrijvend script eerst als dry run, pas daarna `--apply`.
- Deployen alleen met `npx vercel --prod --yes`, en alleen op Kevins verzoek. Nooit `firebase deploy --only hosting`.
- Video maximaal 180 seconden.
- Canvas 1920 × 1080, 30 fps. De zone vanaf y = 884 blijft leeg (ondertitels van de speler).
- Docent: ElevenLabs-stem `fIYdULbypRf7uZYX6u0T` (Thomas). Sami: `L8qZJEV989Y3D0xnaVCa` (Mette). Model `eleven_v4`. Altijd `generations_count: 1`.
- Elke betaalde generatie (stem, beeld) eerst met `estimate_only: true`; Kevin keurt de kosten goed vóór de echte run.
- Kleuren: ink `#0B0D0F`, paper `#FFF7E8`, geel `#FFD33D`, blauw `#087EB5` (metingen, formules), groen `#2E9D63` (alleen juist antwoord bij CHECK en KLAAR). Water `#9FD3EA` mag (beeldinhoud).
- Lettertypen: Bangers (koppen, max zes woorden, hoofdletters) en Atkinson Hyperlegible Next (al het andere).
- In Blender-renders en AI-beelden staat nooit tekst, een getal of een schaalverdeling.
- `src/pages/StudentLessonPage.jsx` niet aanraken (er staan wijzigingen van een andere sessie in).
- Gegenereerde media (audio, shots) en eindbestanden blijven buiten git: `video/public/hoofdstukken/*/audio/`, `video/public/hoofdstukken/*/shots/`, `exports/`.
- Blender: `C:/Program Files/Blender Foundation/Blender 5.2/blender.exe`.
- Firebase-project `pythagoras-eoa`, bucket `pythagoras-eoa.firebasestorage.app`.

## Bestandskaart

| Pad | Verantwoordelijkheid |
| --- | --- |
| `src/lib/mediaUtils.js` | `normalizeOndertitels`, veld `ondertitels` in `normalizeMediaContent` |
| `src/lib/publicContentBlockView.js` | `ondertitels` blijft in de leerlingkopie |
| `src/components/media/MediaRenderer.jsx` | `<track>`, `crossOrigin`, `poster` |
| `eslint.config.js`, `src/index.css`, `.gitignore` | `video/` buiten lint, Tailwind-scan en (deels) git |
| `video/` (Remotion-scaffold) | `package.json`, `tsconfig.json`, `remotion.config.ts`, `src/index.ts`, `src/Root.tsx` |
| `video/lib/tijdlijn.mjs` | draaiboek + timing -> frames per scène en regel |
| `video/lib/ondertitels.mjs` | tijdlijn -> WebVTT |
| `video/lib/draaiboek.mjs` | validatie van een draaiboek |
| `video/lib/lesstof.mjs` | html -> tekst, lesstofsamenvatting, voorstel doelparagraaf |
| `video/lib/timing.mjs` | duren -> `timing.json` |
| `video/scripts/*.mjs` | lees-hoofdstuk, tel-tekens, meet-timing, maak-ondertitels, scene-frames |
| `video/src/theme.ts`, `video/src/fonts.ts` | vaste tokens en lettertypen |
| `video/src/onderdelen/*.tsx` | titelvak, comicpaneel, getekende onderdelen, kernwoorden, sprekerlabel |
| `video/src/Scene.tsx`, `video/src/HelixExplainer.tsx` | indeling per scène, compositie, metadata |
| `video/blender/renderrecept.py`, `video/blender/bouw_lab.py`, `video/blender/render-shot.py` | renderrecept, labbibliotheek, CLI |
| `video/blender/shots/<hoofdstukId>.py` | shots per hoofdstuk |
| `video/public/sami/*.png` | vaste portretten van Sami |
| `video/public/hoofdstukken/<id>/{lesstof,draaiboek,timing}.json` | per hoofdstuk, in git |
| `scripts/lib/explainerPlaatsing.mjs` (+ test) | puur plan: blok, snapshot, verschuivingen |
| `scripts/plaats-explainer-video.mjs` | upload + Firestore, dry run / `--apply` |
| `.claude/skills/explainer-helix-maker/` | de skill en vier references |
| `docs/HANDOFF.md`, `scripts/handoff-stand.mjs` | verwijzing voor volgende sessies |

Afwijking van de spec, al verwerkt in de spec: Python-module heet `bouw_lab.py` (een streepje kan niet in een Python-importnaam).

---

### Task 1: Ondertitels in het media-datamodel

**Files:**
- Modify: `src/lib/mediaUtils.js:72-101`
- Test: `src/lib/mediaUtils.test.js`

**Interfaces:**
- Produces: `normalizeOndertitels(value) -> Array<{ taal: string, label: string, url: string, storagePath: string }>`; `normalizeMediaContent(content).ondertitels` (altijd een array).

- [ ] **Step 1: Write the failing tests**

Voeg onderaan `src/lib/mediaUtils.test.js` toe, en zet `normalizeOndertitels` in de import bovenaan:

```js
test('normalizeOndertitels houdt alleen bruikbare sporen over', () => {
  assert.deepEqual(
    normalizeOndertitels([
      { taal: 'NL', label: 'Nederlands', url: 'https://example.test/nl.vtt', storagePath: 'explainers/h2/ondertitels.nl.vtt' },
      { taal: 'ar', url: 'https://example.test/ar.vtt' },
      { taal: '', url: 'https://example.test/leeg.vtt' },
      { taal: 'en', url: 'javascript:alert(1)' },
      null
    ]),
    [
      { taal: 'nl', label: 'Nederlands', url: 'https://example.test/nl.vtt', storagePath: 'explainers/h2/ondertitels.nl.vtt' },
      { taal: 'ar', label: 'AR', url: 'https://example.test/ar.vtt', storagePath: '' }
    ]
  );
  assert.deepEqual(normalizeOndertitels(undefined), []);
  assert.deepEqual(normalizeOndertitels('geen lijst'), []);
});

test('normalizeMediaContent geeft ondertitels door', () => {
  const media = normalizeMediaContent({
    mediaUrl: 'https://example.test/uitleg.mp4',
    ondertitels: [{ taal: 'nl', label: 'Nederlands', url: 'https://example.test/nl.vtt' }]
  });
  assert.equal(media.mediaKind, 'video');
  assert.deepEqual(media.ondertitels, [
    { taal: 'nl', label: 'Nederlands', url: 'https://example.test/nl.vtt', storagePath: '' }
  ]);
});
```

Werk ook de twee bestaande `deepEqual`-verwachtingen bij ('keeps legacy image media usable' en 'supports uploaded video aliases'): voeg in beide verwachte objecten na `crops: []` de regel `ondertitels: []` toe (met een komma achter `crops: []`).

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test src/lib/mediaUtils.test.js`
Expected: FAIL (`normalizeOndertitels` is not exported / `ondertitels` ontbreekt).

- [ ] **Step 3: Write minimal implementation**

In `src/lib/mediaUtils.js`, direct boven `export const normalizeMediaContent`:

```js
// Ondertitelsporen bij een video. Een lijst, zodat er later vertalingen bij
// kunnen. Alleen http(s)-adressen: de url komt in een <track src>.
export const normalizeOndertitels = (value) =>
  (Array.isArray(value) ? value : [])
    .map((item) => ({
      taal: String(item?.taal || '').trim().toLowerCase(),
      label: String(item?.label || '').trim(),
      url: String(item?.url || '').trim(),
      storagePath: String(item?.storagePath || '').trim()
    }))
    .filter((item) => item.taal && /^https?:\/\//i.test(item.url))
    .map((item) => ({ ...item, label: item.label || item.taal.toUpperCase() }));
```

En in het return-object van `normalizeMediaContent`, na `crops: ...`:

```js
    crops: Array.isArray(content.crops) ? content.crops : [],
    ondertitels: normalizeOndertitels(content.ondertitels)
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test src/lib/`
Expected: PASS, alle tests (was 1098, nu 1100).

---

### Task 2: Ondertitels blijven in de leerlingkopie

**Files:**
- Modify: `src/lib/publicContentBlockView.js:166-179`
- Test: `src/lib/publicContentBlockView.test.js`

**Interfaces:**
- Consumes: `normalizeOndertitels` uit Task 1.
- Produces: `buildPublicContentBlockSnapshot(block).content.ondertitels` voor elk niet-speciaal bloktype (dus ook `media`).

- [ ] **Step 1: Write the failing test**

Onderaan `src/lib/publicContentBlockView.test.js`:

```js
test('buildPublicContentBlockSnapshot houdt ondertitels bij een videoblok', () => {
  const snapshot = buildPublicContentBlockSnapshot({
    id: 'block-video',
    type: 'media',
    status: 'published',
    content: {
      mediaKind: 'video',
      mediaUrl: 'https://example.test/uitleg.mp4',
      fileName: 'uitleg.mp4',
      ondertitels: [
        { taal: 'nl', label: 'Nederlands', url: 'https://example.test/nl.vtt', storagePath: 'explainers/x/ondertitels.nl.vtt' },
        { taal: 'xx', url: 'ftp://niet-toegestaan' }
      ]
    }
  });
  assert.deepEqual(snapshot.content.ondertitels, [
    { taal: 'nl', label: 'Nederlands', url: 'https://example.test/nl.vtt', storagePath: 'explainers/x/ondertitels.nl.vtt' }
  ]);
  assert.equal(snapshot.content.fileName, undefined);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/lib/publicContentBlockView.test.js`
Expected: FAIL (`snapshot.content.ondertitels` is `undefined`).

- [ ] **Step 3: Write minimal implementation**

Bovenaan `src/lib/publicContentBlockView.js` bij de imports:

```js
import { normalizeOndertitels } from './mediaUtils.js';
```

In `sanitizeContent`, in het `base`-object na `crops: ...`:

```js
    crops: Array.isArray(content.crops) ? content.crops : [],
    // Ondertitelsporen van een video; zonder deze regel ziet de leerling ze nooit.
    ondertitels: normalizeOndertitels(content.ondertitels)
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test src/lib/`
Expected: PASS. Faalt een andere test omdat een snapshot nu `ondertitels: []` bevat, voeg dat veld toe aan die verwachting (niet de code aanpassen).

---

### Task 3: Speler toont het ondertitelspoor en de poster

**Files:**
- Modify: `src/components/media/MediaRenderer.jsx` (props van `MediaSurface` en het `MEDIA_KINDS.VIDEO`-blok rond regel 88)

**Interfaces:**
- Consumes: `normalizeMediaContent(...).ondertitels` en `.thumbnailUrl`.

- [ ] **Step 1: Geef ondertitels en poster door aan `MediaSurface`**

In `MediaRenderer` (na `const altText = ...`):

```js
  const ondertitels = normalizedMedia.ondertitels;
  const poster = normalizedMedia.thumbnailUrl || '';
```

In de JSX van `<MediaSurface ... />` twee props erbij:

```jsx
              ondertitels={ondertitels}
              poster={poster}
```

En de signatuur:

```js
function MediaSurface({ mediaKind, mediaUrl, title, altText, ondertitels = [], poster = '', fullscreen = false, presenter = false }) {
```

- [ ] **Step 2: Render `<track>`; `crossOrigin` alleen met ondertitels**

Vervang het `MEDIA_KINDS.VIDEO`-blok door:

```jsx
  if (mediaKind === MEDIA_KINDS.VIDEO) {
    // crossOrigin alleen bij ondertitels: een .vtt van Storage is een ander
    // domein en wordt anders geblokkeerd. Zonder ondertitels blijft alles zoals
    // het was, zodat video's van sites zonder CORS blijven spelen.
    const heeftOndertitels = ondertitels.length > 0;
    return (
      <video
        src={mediaUrl}
        controls
        playsInline
        poster={poster || undefined}
        crossOrigin={heeftOndertitels ? 'anonymous' : undefined}
        className={`${frameClass} bg-black object-contain`}
      >
        {ondertitels.map((spoor, index) => (
          <track
            key={`${spoor.taal}-${spoor.url}`}
            kind="subtitles"
            srcLang={spoor.taal}
            label={spoor.label}
            src={spoor.url}
            default={index === 0}
          />
        ))}
      </video>
    );
  }
```

- [ ] **Step 3: Lint, tests en build**

Run:
```bash
npx eslint src/lib/mediaUtils.js src/lib/mediaUtils.test.js src/lib/publicContentBlockView.js src/lib/publicContentBlockView.test.js src/components/media/MediaRenderer.jsx
node --test src/lib/
npm run build
```
Expected: geen lint-fouten, alle tests PASS, build slaagt.

- [ ] **Step 4: Rook-test in de browser**

Maak `.claude/launch.json` als die nog niet bestaat:

```json
{
  "version": "0.0.1",
  "configurations": [
    { "name": "helix-dev", "runtimeExecutable": "npm", "runtimeArgs": ["run", "dev"], "port": 5173 }
  ]
}
```

Start met `preview_start {name: "helix-dev"}`. Run in de pagina (javascript_tool), om de renderer los van login te controleren:

```js
const v = document.createElement('video'); v.crossOrigin = 'anonymous';
const t = document.createElement('track'); t.kind = 'subtitles'; t.srclang = 'nl'; t.default = true;
v.appendChild(t); [v.crossOrigin, t.kind, t.default]
```
Expected: `["anonymous","subtitles",true]`. De echte controle met een videoblok volgt in Task 13 met de testleerling.

---

### Task 4: Remotion-project `video/` opzetten

**Files:**
- Create: `video/` via de Remotion-scaffold
- Modify: `eslint.config.js:8`, `src/index.css:11-13`, `.gitignore`

**Interfaces:**
- Produces: compositie-id `HelixExplainer` (in Task 9 gevuld), map `video/public/`, `npm test` in `video/` draait `node --test lib/`.

- [ ] **Step 1: Scaffold**

Run vanuit de repo-root:
```bash
npx create-video@latest --yes --blank --no-tailwind video
```
Controleer daarna dat er geen geneste git-repo is ontstaan:
```bash
ls -a video
```
Staat er `video/.git`, verwijder dan alleen die map: `rm -rf video/.git`. Verwijder ook een eventueel aangemaakte `video/.gitignore` niet; die mag blijven.

- [ ] **Step 2: Pakketten toevoegen en versie vastzetten**

Run:
```bash
cd video && npx remotion add @remotion/media && npx remotion add @remotion/google-fonts && cd ..
```
Controleer in `video/package.json` dat `remotion`, `@remotion/cli`, `@remotion/media` en `@remotion/google-fonts` dezelfde versie hebben (4.0.512 of nieuwer, maar onderling gelijk). Voeg aan `scripts` toe:

```json
    "test": "node --test lib/"
```

- [ ] **Step 3: Controleer of Atkinson Hyperlegible Next bestaat**

Run:
```bash
ls video/node_modules/@remotion/google-fonts/dist/esm | grep -i "^AtkinsonHyperlegible"
```
Expected: `AtkinsonHyperlegibleNext.mjs` staat erbij. Staat alleen `AtkinsonHyperlegible.mjs` erbij, gebruik in Task 9 dan `@remotion/google-fonts/AtkinsonHyperlegible` en meld dat aan Kevin.

- [ ] **Step 4: TypeScript mag `.mjs` importeren**

Zet in `video/tsconfig.json` onder `compilerOptions`:

```json
    "allowJs": true,
```

- [ ] **Step 5: Buiten lint, Tailwind-scan en git**

`eslint.config.js` regel 8 wordt:

```js
  globalIgnores(['dist', 'test-results', 'playwright-report', '.agents', '.superpowers', 'exports', 'video']),
```

`src/index.css`, direct na `@import "tailwindcss";`:

```css
@source not "../video";
```

Onderaan `.gitignore`:

```
# Explainervideo's: gegenereerde stemmen en Blender-renders horen niet in git.
# Draaiboek, timing en lesstof per hoofdstuk wel.
video/public/hoofdstukken/*/audio/
video/public/hoofdstukken/*/shots/
video/out/
```

- [ ] **Step 6: Licentie controleren**

Run: `head -60 video/node_modules/remotion/LICENSE.md`
Lees wie gratis mag gebruiken. Meld aan Kevin in één zin of een school (non-profit) eronder valt. Is het twijfelachtig, stop en vraag Kevin vóór Task 12.

- [ ] **Step 7: Verifiëren**

Run:
```bash
npx eslint eslint.config.js
npm run build
cd video && npx remotion compositions && cd ..
```
Expected: lint schoon, build slaagt, de scaffold-compositie wordt getoond.

---

### Task 5: Pure bouwstenen: tijdlijn, ondertitels, draaiboekcontrole, timing

**Files:**
- Create: `video/lib/tijdlijn.mjs`, `video/lib/ondertitels.mjs`, `video/lib/draaiboek.mjs`, `video/lib/timing.mjs`
- Test: `video/lib/tijdlijn.test.mjs`, `video/lib/ondertitels.test.mjs`, `video/lib/draaiboek.test.mjs`, `video/lib/timing.test.mjs`

**Interfaces:**
- Produces:
  - `bouwTijdlijn(draaiboek, timing, fps = 30) -> { fps, totaalSeconden, totaalFrames, scenes: Array<Scene & { start, eind, startFrame, duurFrames, regels: Array<Regel & { bestand, start, duur, eind, startFrame, duurFrames }> }> }`
  - `controleerLengte(tijdlijn, max = 180) -> { ok: boolean, seconden: number }`
  - `maakVtt(tijdlijn) -> string`; `tijdcode(seconden) -> 'HH:MM:SS.mmm'`; `breekTekst(tekst, max = 42) -> string[]`
  - `valideerDraaiboek(draaiboek) -> string[]` (leeg = goed)
  - `bouwTiming(draaiboek, duren, fps = 30) -> { fps, regels: { [regelId]: { bestand, duur } } }` met `duren = { [regelId]: { bestand, duur } }`

- [ ] **Step 1: Write the failing tests**

`video/lib/tijdlijn.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { bouwTijdlijn, controleerLengte, SCENE_AANLOOP, SCENE_UITLOOP, PAUZE_TUSSEN_REGELS } from './tijdlijn.mjs';

const draaiboek = {
  scenes: [
    { id: 's0', regels: [{ id: 'a', spreker: 'sami' }, { id: 'b', spreker: 'docent', pauzeNa: 4 }] },
    { id: 's1', regels: [{ id: 'c', spreker: 'docent' }] }
  ]
};
const timing = { fps: 30, regels: { a: { bestand: 'audio/a.mp3', duur: 2 }, b: { bestand: 'audio/b.mp3', duur: 3 }, c: { bestand: 'audio/c.mp3', duur: 1 } } };

test('bouwTijdlijn zet regels achter elkaar met pauzes', () => {
  const t = bouwTijdlijn(draaiboek, timing, 30);
  const [s0, s1] = t.scenes;
  assert.equal(s0.start, 0);
  assert.equal(s0.regels[0].start, SCENE_AANLOOP);
  assert.equal(s0.regels[1].start, SCENE_AANLOOP + 2 + PAUZE_TUSSEN_REGELS);
  const eindS0 = SCENE_AANLOOP + 2 + PAUZE_TUSSEN_REGELS + 3 + 4 + SCENE_UITLOOP;
  assert.ok(Math.abs(s0.eind - eindS0) < 1e-9);
  assert.ok(Math.abs(s1.start - eindS0) < 1e-9);
  assert.equal(t.totaalFrames, Math.round((eindS0 + SCENE_AANLOOP + 1 + SCENE_UITLOOP) * 30));
  assert.equal(s0.startFrame, 0);
  assert.equal(s1.startFrame, Math.round(eindS0 * 30));
});

test('bouwTijdlijn meldt een ontbrekende opname', () => {
  assert.throws(() => bouwTijdlijn(draaiboek, { regels: {} }), /Geen opname voor regel a/);
});

test('controleerLengte bewaakt de drie minuten', () => {
  assert.deepEqual(controleerLengte({ totaalSeconden: 179.9 }), { ok: true, seconden: 179.9 });
  assert.equal(controleerLengte({ totaalSeconden: 180.1 }).ok, false);
});
```

`video/lib/ondertitels.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { tijdcode, breekTekst, maakVtt } from './ondertitels.mjs';

test('tijdcode schrijft uren, minuten, seconden en milliseconden', () => {
  assert.equal(tijdcode(0), '00:00:00.000');
  assert.equal(tijdcode(61.5), '00:01:01.500');
  assert.equal(tijdcode(3725.0274), '01:02:05.027');
});

test('breekTekst breekt op woorden, maximaal 42 tekens', () => {
  const regels = breekTekst('Massa is hoeveel gram of kilogram iets is. Je meet massa met een weegschaal.');
  assert.ok(regels.every((r) => r.length <= 42));
  assert.equal(regels.join(' '), 'Massa is hoeveel gram of kilogram iets is. Je meet massa met een weegschaal.');
});

test('maakVtt maakt cues met spreker en hooguit twee regels', () => {
  const tijdlijn = {
    scenes: [{
      regels: [
        { id: 'a', spreker: 'sami', tekst: 'En wat is volume?', start: 1, duur: 1.2, eind: 2.2 },
        { id: 'b', spreker: 'docent', tekst: 'Stap 3: reken het verschil uit. 25 − 15 = 10. De steen heeft een volume van 10 cm³ en dat is <precies> goed.', start: 3, duur: 6, eind: 9 }
      ]
    }]
  };
  const vtt = maakVtt(tijdlijn);
  assert.ok(vtt.startsWith('WEBVTT\n\n'));
  assert.match(vtt, /00:00:01\.000 --> 00:00:02\.200\n<v Sami>En wat is volume\?/);
  assert.match(vtt, /<v Docent>Stap 3/);
  assert.match(vtt, /&lt;precies&gt;/);
  const cues = vtt.trim().split('\n\n').slice(1);
  for (const cue of cues) {
    const tekstRegels = cue.split('\n').slice(1);
    assert.ok(tekstRegels.length <= 2, cue);
    tekstRegels.forEach((r) => assert.ok(r.replace(/^<v [^>]+>/, '').length <= 42, r));
  }
  const laatste = cues[cues.length - 1];
  assert.match(laatste, /--> 00:00:09\.000/);
});
```

`video/lib/draaiboek.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { valideerDraaiboek } from './draaiboek.mjs';

const goed = () => ({
  hoofdstukId: 'hoofdstuk-x',
  doelParagraafId: 'paragraaf-x',
  titel: 'Massa',
  kijkvraag: 'Hoe meet je massa?',
  meta: 'Binask H2',
  scenes: [{
    id: 's1', kop: 'MASSA', fase: 'KIJK', indeling: 'SPLIT',
    shot: { naam: 'massa-rijst', frames: 1 },
    kernwoorden: [{ tekst: 'massa', bij: 'r1' }],
    getekend: [{ type: 'weegschaal', items: [{ label: 'pak rijst', waarde: 750 }], eenheid: 'g', bij: 'r1' }],
    regels: [{ id: 'r1', spreker: 'docent', tekst: 'Massa is 750 g.', uitspraak: 'Massa is zevenhonderdvijftig gram.' }]
  }]
});

test('valideerDraaiboek keurt een goed draaiboek goed', () => {
  assert.deepEqual(valideerDraaiboek(goed()), []);
});

test('valideerDraaiboek vindt de bekende fouten', () => {
  const d = goed();
  d.scenes[0].kop = 'EEN KOP VAN VEEL TE VEEL WOORDEN HIER';
  d.scenes[0].fase = 'DOE';
  d.scenes[0].regels.push({ id: 'r1', spreker: 'juf', tekst: 'Top! \u{1F600}', uitspraak: 'Bij BiNaSk zeggen we massa.' });
  d.scenes[0].getekend[0].bij = 'r9';
  const fouten = valideerDraaiboek(d).join('\n');
  assert.match(fouten, /kop heeft meer dan zes woorden/);
  assert.match(fouten, /fase "DOE"/);
  assert.match(fouten, /regel-id r1 komt dubbel voor/);
  assert.match(fouten, /spreker "juf"/);
  assert.match(fouten, /emoji/);
  assert.match(fouten, /BiNaSk/);
  assert.match(fouten, /verwijst naar onbekende regel r9/);
});
```

`video/lib/timing.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { bouwTiming } from './timing.mjs';

test('bouwTiming neemt elke regel uit het draaiboek over', () => {
  const draaiboek = { scenes: [{ regels: [{ id: 'a' }, { id: 'b' }] }] };
  const duren = { a: { bestand: 'audio/a.mp3', duur: 2.0414 }, b: { bestand: 'audio/b.mp3', duur: 1 } };
  assert.deepEqual(bouwTiming(draaiboek, duren), {
    fps: 30,
    regels: { a: { bestand: 'audio/a.mp3', duur: 2.041 }, b: { bestand: 'audio/b.mp3', duur: 1 } }
  });
  assert.throws(() => bouwTiming(draaiboek, { a: duren.a }), /Geen opname voor regel b/);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test video/lib/`
Expected: FAIL (modules bestaan niet).

- [ ] **Step 3: Write the implementations**

`video/lib/tijdlijn.mjs`:

```js
// Van draaiboek + gemeten opnames naar een tijdlijn in seconden en frames.
// Puur: zowel Remotion als de scripts gebruiken dit, zodat beeld en
// ondertitels dezelfde tijden hebben.
export const FPS = 30;
export const MAX_SECONDEN = 180;
export const PAUZE_TUSSEN_REGELS = 0.5;
export const SCENE_AANLOOP = 0.4;
export const SCENE_UITLOOP = 0.8;

export function bouwTijdlijn(draaiboek, timing, fps = FPS) {
  let t = 0;
  const scenes = draaiboek.scenes.map((scene) => {
    const start = t;
    t += SCENE_AANLOOP;
    const regels = scene.regels.map((regel, index) => {
      const opname = timing.regels?.[regel.id];
      if (!opname) throw new Error(`Geen opname voor regel ${regel.id}.`);
      const regelStart = t;
      t += opname.duur;
      const laatste = index === scene.regels.length - 1;
      const resultaat = { ...regel, bestand: opname.bestand, start: regelStart, duur: opname.duur, eind: regelStart + opname.duur };
      t += regel.pauzeNa ?? (laatste ? 0 : PAUZE_TUSSEN_REGELS);
      return resultaat;
    });
    t += SCENE_UITLOOP;
    return { ...scene, start, eind: t, regels };
  });

  const frame = (seconden) => Math.round(seconden * fps);
  return {
    fps,
    totaalSeconden: t,
    totaalFrames: frame(t),
    scenes: scenes.map((scene) => ({
      ...scene,
      startFrame: frame(scene.start),
      duurFrames: frame(scene.eind) - frame(scene.start),
      regels: scene.regels.map((regel) => ({
        ...regel,
        startFrame: frame(regel.start),
        duurFrames: Math.max(1, frame(regel.eind) - frame(regel.start))
      }))
    }))
  };
}

export function controleerLengte(tijdlijn, max = MAX_SECONDEN) {
  return { ok: tijdlijn.totaalSeconden <= max, seconden: tijdlijn.totaalSeconden };
}
```

`video/lib/ondertitels.mjs`:

```js
// Tijdlijn -> WebVTT. Eén of meer cues per regel, hooguit twee regels van
// 42 tekens per cue, met de spreker als voice-tag.
const MAX_TEKENS = 42;
const MAX_REGELS = 2;
const SPREKERS = { docent: 'Docent', sami: 'Sami' };

const twee = (n) => String(n).padStart(2, '0');

export function tijdcode(seconden) {
  const ms = Math.round(seconden * 1000);
  const uren = Math.floor(ms / 3600000);
  const minuten = Math.floor((ms % 3600000) / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  const rest = ms % 1000;
  return `${twee(uren)}:${twee(minuten)}:${twee(sec)}.${String(rest).padStart(3, '0')}`;
}

const ontsnap = (tekst) => tekst.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function breekTekst(tekst, max = MAX_TEKENS) {
  const regels = [];
  let huidig = '';
  for (const woord of tekst.split(/\s+/).filter(Boolean)) {
    const kandidaat = huidig ? `${huidig} ${woord}` : woord;
    if (kandidaat.length <= max || !huidig) {
      huidig = kandidaat;
    } else {
      regels.push(huidig);
      huidig = woord;
    }
  }
  if (huidig) regels.push(huidig);
  return regels;
}

export function maakVtt(tijdlijn) {
  const blokken = ['WEBVTT'];
  for (const scene of tijdlijn.scenes) {
    for (const regel of scene.regels) {
      const naam = SPREKERS[regel.spreker] || 'Docent';
      const regels = breekTekst(regel.tekst);
      const groepen = [];
      for (let i = 0; i < regels.length; i += MAX_REGELS) groepen.push(regels.slice(i, i + MAX_REGELS));
      const totaal = groepen.reduce((som, g) => som + g.join(' ').length, 0);
      let start = regel.start;
      groepen.forEach((groep, index) => {
        const aandeel = groep.join(' ').length / totaal;
        const eind = index === groepen.length - 1 ? regel.eind : start + regel.duur * aandeel;
        blokken.push(`${tijdcode(start)} --> ${tijdcode(eind)}\n<v ${naam}>${groep.map(ontsnap).join('\n')}`);
        start = eind;
      });
    }
  }
  return `${blokken.join('\n\n')}\n`;
}
```

`video/lib/draaiboek.mjs`:

```js
// Controle van een draaiboek vóór er geld aan stemmen of beelden opgaat.
const FASES = ['KIJK', 'CHECK', 'KLAAR'];
const INDELINGEN = ['FOCUS', 'SPLIT', 'STATUS'];
const SPREKERS = ['docent', 'sami'];
const UITDRUKKINGEN = ['vragend', 'verbaasd', 'blij', 'nadenkend'];
const EMOJI = /\p{Extended_Pictographic}/u;

export function valideerDraaiboek(d) {
  const fouten = [];
  for (const veld of ['hoofdstukId', 'doelParagraafId', 'titel', 'kijkvraag', 'meta']) {
    if (!String(d?.[veld] || '').trim()) fouten.push(`Veld ${veld} ontbreekt.`);
  }
  if (!Array.isArray(d?.scenes) || d.scenes.length === 0) {
    fouten.push('Er zijn geen scènes.');
    return fouten;
  }
  const regelIds = new Set();
  const sceneIds = new Set();
  for (const scene of d.scenes) {
    const s = `Scène ${scene.id}`;
    if (sceneIds.has(scene.id)) fouten.push(`${s}: scène-id komt dubbel voor.`);
    sceneIds.add(scene.id);
    if (String(scene.kop || '').trim().split(/\s+/).length > 6) fouten.push(`${s}: kop heeft meer dan zes woorden.`);
    if (!FASES.includes(scene.fase)) fouten.push(`${s}: fase "${scene.fase}" bestaat niet.`);
    if (!INDELINGEN.includes(scene.indeling)) fouten.push(`${s}: indeling "${scene.indeling}" bestaat niet.`);
    if (scene.indeling !== 'STATUS' && !scene.shot?.naam) fouten.push(`${s}: FOCUS en SPLIT hebben een shot nodig.`);
    if (!Array.isArray(scene.regels) || scene.regels.length === 0) fouten.push(`${s}: geen regels.`);
    const eigenIds = new Set();
    for (const regel of scene.regels || []) {
      if (regelIds.has(regel.id)) fouten.push(`${s}: regel-id ${regel.id} komt dubbel voor.`);
      regelIds.add(regel.id);
      eigenIds.add(regel.id);
      if (!SPREKERS.includes(regel.spreker)) fouten.push(`${s}: spreker "${regel.spreker}" bestaat niet.`);
      if (!String(regel.tekst || '').trim()) fouten.push(`${s}: regel ${regel.id} heeft geen tekst.`);
      if (!String(regel.uitspraak || '').trim()) fouten.push(`${s}: regel ${regel.id} heeft geen uitspraak.`);
      if (EMOJI.test(`${regel.tekst}${regel.uitspraak}`)) fouten.push(`${s}: regel ${regel.id} bevat een emoji.`);
      if (/binask/i.test(regel.uitspraak || '')) fouten.push(`${s}: regel ${regel.id} spreekt BiNaSk uit; gebruik "in de les".`);
      if (regel.samiUitdrukking && !UITDRUKKINGEN.includes(regel.samiUitdrukking)) fouten.push(`${s}: uitdrukking "${regel.samiUitdrukking}" bestaat niet.`);
    }
    const verwijzingen = [
      ...(scene.kernwoorden || []).map((k) => k.bij),
      ...(scene.getekend || []).flatMap((g) => [g.bij, g.tot, g.stijgBij, g.aftelBij, g.antwoordBij, ...(g.regels || []).map((r) => r.bij)]),
      ...(scene.geluiden || []).map((g) => g.bij),
      scene.shot?.startBij
    ].filter(Boolean);
    for (const bij of verwijzingen) {
      if (!eigenIds.has(bij)) fouten.push(`${s}: verwijst naar onbekende regel ${bij}.`);
    }
  }
  return fouten;
}
```

`video/lib/timing.mjs`:

```js
// Gemeten duren -> timing.json, in de volgorde van het draaiboek.
export function bouwTiming(draaiboek, duren, fps = 30) {
  const regels = {};
  for (const scene of draaiboek.scenes) {
    for (const regel of scene.regels) {
      const meting = duren[regel.id];
      if (!meting) throw new Error(`Geen opname voor regel ${regel.id}.`);
      regels[regel.id] = { bestand: meting.bestand, duur: Math.round(meting.duur * 1000) / 1000 };
    }
  }
  return { fps, regels };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test video/lib/`
Expected: PASS (alle tests in de vier bestanden).

---

### Task 6: Lesstof van een hoofdstuk lezen

**Files:**
- Create: `video/lib/lesstof.mjs`, `video/scripts/lees-hoofdstuk.mjs`
- Test: `video/lib/lesstof.test.mjs`
- Output: `video/public/hoofdstukken/hoofdstuk-binask-eoa-1-h2/lesstof.json`

**Interfaces:**
- Produces: `htmlNaarTekst(html) -> string`; `vatLesstofSamen({ hoofdstuk, paragrafen, blokken, nu }) -> { hoofdstukId, titel, vakId, gelezenOp, paragrafen: Array<{ id, code, titel, order, heeftSamenvatting, blokken: Array<{ id, type, titel, tekst, kernbegrippen: string[] }> }> }`; `stelDoelParagraafVoor(lesstof) -> string`.

- [ ] **Step 1: Write the failing tests**

`video/lib/lesstof.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { htmlNaarTekst, vatLesstofSamen, stelDoelParagraafVoor } from './lesstof.mjs';

test('htmlNaarTekst maakt leesbare tekst van lesstof-html', () => {
  assert.equal(
    htmlNaarTekst('<p>Je meet massa met een <strong>weegschaal</strong>.</p><ul><li>1 kg = 1000 g</li><li>a &amp; b</li></ul>'),
    'Je meet massa met een weegschaal.\n- 1 kg = 1000 g\n- a & b'
  );
});

const invoer = {
  nu: '2026-10-02T10:00:00.000Z',
  hoofdstuk: { id: 'h2', title: 'Massa, volume en dichtheid', vakId: 'vak-binask-eoa' },
  paragrafen: [
    { id: 'p5', code: '2.5', title: 'Plusopdrachten', order: 5 },
    { id: 'p1', code: '2.1', title: 'Massa', order: 1 },
    { id: 'p4', code: '2.4', title: 'Herhalingsopdrachten', order: 4 }
  ],
  blokken: [
    { id: 'b1', paragraafId: 'p1', type: 'theory', order: 2, title: 'Wat is massa?', content: { html: '<p>Massa is...</p>', kernbegrippen: [{ begrip: 'massa', uitleg: 'hoeveel gram' }] } },
    { id: 'b2', paragraafId: 'p1', type: 'theory', order: 3, title: 'Schriftopdracht 2.1', content: { html: '<p>Maak</p>' } },
    { id: 'b3', paragraafId: 'p1', type: 'summary', order: 4, title: 'Samenvatting', content: { html: '<ul><li>m</li></ul>' } },
    { id: 'b4', paragraafId: 'p4', type: 'summary', order: 3, title: 'Samenvatting', content: { html: '' } },
    { id: 'b5', paragraafId: 'p5', type: 'summary', order: 3, title: 'Samenvatting', content: { html: '' } },
    { id: 'b6', paragraafId: 'p1', type: 'game', order: 5, title: 'Spel', content: {} }
  ]
};

test('vatLesstofSamen sorteert, filtert opdrachten en spellen, en markeert samenvattingen', () => {
  const l = vatLesstofSamen(invoer);
  assert.deepEqual(l.paragrafen.map((p) => p.code), ['2.1', '2.4', '2.5']);
  assert.deepEqual(l.paragrafen[0].blokken.map((b) => b.id), ['b1', 'b3']);
  assert.deepEqual(l.paragrafen[0].blokken[0].kernbegrippen, ['massa: hoeveel gram']);
  assert.equal(l.paragrafen[1].heeftSamenvatting, true);
  assert.equal(l.gelezenOp, '2026-10-02T10:00:00.000Z');
});

test('stelDoelParagraafVoor kiest de herhalingsparagraaf, niet de plus', () => {
  assert.equal(stelDoelParagraafVoor(vatLesstofSamen(invoer)), 'p4');
  const zonderHerhaling = vatLesstofSamen({ ...invoer, paragrafen: invoer.paragrafen.filter((p) => p.id !== 'p4') });
  assert.equal(stelDoelParagraafVoor(zonderHerhaling), 'p1');
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test video/lib/lesstof.test.mjs`
Expected: FAIL (module bestaat niet).

- [ ] **Step 3: Write the implementation**

`video/lib/lesstof.mjs`:

```js
// Lesstof uit Firestore -> een compacte samenvatting om een draaiboek op te
// baseren. Opdrachten, checks en spellen horen niet in een uitlegvideo.
const RELEVANT = new Set(['theory', 'example', 'summary']);
const OPDRACHT = /^(Schriftopdracht|10-minutencheck|Eindcheck|Herhalingsopdrachten|Plusopdrachten)/i;

const ENTITEITEN = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };

export function htmlNaarTekst(html = '') {
  return String(html)
    .replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<\/(p|h[1-6]|li|ul|ol)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (m) => ENTITEITEN[m])
    .split('\n')
    .map((regel) => regel.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
}

const titelVan = (item) => item.title || item.titel || '';

export function vatLesstofSamen({ hoofdstuk, paragrafen, blokken, nu = new Date().toISOString() }) {
  const opVolgorde = (a, b) => (a.order || 0) - (b.order || 0);
  return {
    hoofdstukId: hoofdstuk.id,
    titel: titelVan(hoofdstuk),
    vakId: hoofdstuk.vakId || '',
    gelezenOp: nu,
    paragrafen: [...paragrafen].sort(opVolgorde).map((p) => {
      const eigen = blokken.filter((b) => b.paragraafId === p.id).sort(opVolgorde);
      return {
        id: p.id,
        code: p.code || '',
        titel: titelVan(p),
        order: p.order || 0,
        heeftSamenvatting: eigen.some((b) => b.type === 'summary'),
        blokken: eigen
          .filter((b) => RELEVANT.has(b.type) && !OPDRACHT.test(titelVan(b)))
          .map((b) => ({
            id: b.id,
            type: b.type,
            titel: titelVan(b),
            tekst: htmlNaarTekst(b.content?.html || ''),
            kernbegrippen: (b.content?.kernbegrippen || b.kernbegrippen || []).map((k) => `${k.begrip}: ${k.uitleg}`)
          }))
      };
    })
  };
}

export function stelDoelParagraafVoor(lesstof) {
  const kandidaten = lesstof.paragrafen.filter((p) => p.heeftSamenvatting);
  const herhaling = kandidaten.find((p) => /herhal/i.test(p.titel));
  if (herhaling) return herhaling.id;
  const gewoon = kandidaten.filter((p) => !/plus|uitdaging|verdieping/i.test(p.titel));
  return gewoon.length ? gewoon[gewoon.length - 1].id : '';
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test video/lib/`
Expected: PASS.

- [ ] **Step 5: Write the read-only script**

`video/scripts/lees-hoofdstuk.mjs`:

```js
/**
 * Leest de lesstof van één hoofdstuk uit Firestore. Alleen lezen.
 *
 *   node video/scripts/lees-hoofdstuk.mjs --hoofdstuk hoofdstuk-binask-eoa-1-h2
 *
 * Schrijft video/public/hoofdstukken/<id>/lesstof.json en toont per paragraaf
 * wat er staat, plus de voorgestelde doelparagraaf voor de video.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { vatLesstofSamen, stelDoelParagraafVoor } from '../lib/lesstof.mjs';

const args = process.argv.slice(2);
const optie = (naam) => {
  const i = args.indexOf(naam);
  return i >= 0 && args[i + 1] ? args[i + 1] : '';
};
const hoofdstukId = optie('--hoofdstuk');
if (!hoofdstukId) {
  console.error('Gebruik: node video/scripts/lees-hoofdstuk.mjs --hoofdstuk <hoofdstukId>');
  process.exit(1);
}

const requireFromFunctions = createRequire(new URL('../../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { getFirestore } = requireFromFunctions('firebase-admin/firestore');
if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
const db = getFirestore();

const hoofdstukSnap = await db.collection('hoofdstuk').doc(hoofdstukId).get();
if (!hoofdstukSnap.exists) {
  console.error(`Hoofdstuk ${hoofdstukId} bestaat niet in Firestore.`);
  process.exit(1);
}
const paragrafen = (await db.collection('paragraaf').where('hoofdstukId', '==', hoofdstukId).get())
  .docs.map((d) => ({ id: d.id, ...d.data() })).filter((p) => p.isArchived !== true);
const blokken = (await db.collection('contentBlocks').where('hoofdstukId', '==', hoofdstukId).get())
  .docs.map((d) => ({ id: d.id, ...d.data() })).filter((b) => b.isArchived !== true);

const lesstof = vatLesstofSamen({ hoofdstuk: { id: hoofdstukSnap.id, ...hoofdstukSnap.data() }, paragrafen, blokken });
const uitMap = path.resolve('video/public/hoofdstukken', hoofdstukId);
fs.mkdirSync(uitMap, { recursive: true });
fs.writeFileSync(path.join(uitMap, 'lesstof.json'), `${JSON.stringify(lesstof, null, 2)}\n`);

console.log(`${lesstof.titel} (${hoofdstukId})`);
for (const p of lesstof.paragrafen) {
  console.log(`  ${p.code.padEnd(4)} ${p.titel.padEnd(28)} ${p.blokken.length} uitlegblok(ken)${p.heeftSamenvatting ? ', heeft Samenvatting' : ''}  [${p.id}]`);
}
console.log(`Voorgestelde doelparagraaf: ${stelDoelParagraafVoor(lesstof) || 'geen; vraag Kevin'}`);
console.log(`Geschreven: ${path.relative(process.cwd(), path.join(uitMap, 'lesstof.json'))}`);
process.exit(0);
```

- [ ] **Step 6: Draai het voor H2 en controleer**

Run: `node video/scripts/lees-hoofdstuk.mjs --hoofdstuk hoofdstuk-binask-eoa-1-h2`
Expected: zes paragrafen (2.1 tot en met 2.6). Voorgestelde doelparagraaf `paragraaf-binask-eoa-1-2-4`. Controleer in `lesstof.json` dat de getallen uit het draaiboek erin staan: zoek op `750`, `35 ml`, `15 ml`, `25 ml`, `106,8`, `8,9`, `2,7`, `7,9`. Ontbreekt er één, meld het aan Kevin vóór Task 7.

---

### Task 7: Draaiboek H2 vastleggen

**Files:**
- Create: `video/public/hoofdstukken/hoofdstuk-binask-eoa-1-h2/draaiboek.json`
- Create: `video/scripts/controleer-draaiboek.mjs`

**Interfaces:**
- Consumes: `valideerDraaiboek` (Task 5).
- Produces: het draaiboekformaat dat Remotion (Task 9) en de scripts lezen. Velden per `getekend`-type:
  - `weegschaal`: `items: [{ label, waarde }]`, `eenheid`, `bij`, optioneel `tot`
  - `maatcilinder`: `van`, optioneel `naar`, `max`, `stap`, `eenheid`, `bij`, optioneel `stijgBij`, `labels`, `oog`
  - `formule`: `regels: [{ tekst, bij }]`, `bij`, optioneel `tot`
  - `driehoek`: `bij`
  - `opgave`: `vraag: string[]`, `aftelBij`, `aftelSeconden`, `antwoord: string[]`, `antwoordBij`
  - `kaarten`: `kaarten: [{ kop, regels: string[] }]`, `bij`
- `shot`: `{ naam, frames, startBij? }`.

- [ ] **Step 1: Schrijf het draaiboek**

`video/public/hoofdstukken/hoofdstuk-binask-eoa-1-h2/draaiboek.json`:

```json
{
  "hoofdstukId": "hoofdstuk-binask-eoa-1-h2",
  "doelParagraafId": "paragraaf-binask-eoa-1-2-4",
  "titel": "Massa, volume en dichtheid",
  "kijkvraag": "Hoe meet je het volume van een steen, en hoe reken je de dichtheid uit?",
  "meta": "Binask H2",
  "scenes": [
    {
      "id": "s0", "kop": "MASSA, VOLUME EN DICHTHEID", "fase": "KIJK", "indeling": "FOCUS",
      "shot": { "naam": "opening-blokjes", "frames": 1 },
      "kernwoorden": [], "getekend": [],
      "regels": [
        { "id": "s0-r1", "spreker": "sami", "samiUitdrukking": "vragend", "tekst": "Deze twee blokjes zijn even groot. Toch is dit blokje veel zwaarder. Hoe kan dat?", "uitspraak": "[curious] Deze twee blokjes zijn even groot. Toch is dit blokje veel zwaarder. Hoe kan dat?" },
        { "id": "s0-r2", "spreker": "docent", "tekst": "Dat ontdek je zo. Eerst leer je drie begrippen: massa, volume en dichtheid.", "uitspraak": "Dat ontdek je zo. Eerst leer je drie begrippen: massa, volume en dichtheid." }
      ]
    },
    {
      "id": "s1", "kop": "MASSA", "fase": "KIJK", "indeling": "SPLIT",
      "shot": { "naam": "massa-rijst", "frames": 1 },
      "kernwoorden": [
        { "tekst": "massa", "bij": "s1-r1" },
        { "tekst": "weegschaal", "bij": "s1-r1" },
        { "tekst": "letter: m", "bij": "s1-r4" },
        { "tekst": "gram (g), kilogram (kg)", "bij": "s1-r5" },
        { "tekst": "1 kg = 1000 g", "bij": "s1-r5", "accent": true }
      ],
      "getekend": [
        { "type": "weegschaal", "items": [{ "label": "pak rijst", "waarde": 750 }], "eenheid": "g", "bij": "s1-r2" }
      ],
      "regels": [
        { "id": "s1-r1", "spreker": "docent", "tekst": "Massa is hoeveel gram of kilogram iets is. Je meet massa met een weegschaal.", "uitspraak": "Massa is hoeveel gram of kilogram iets is. Je meet massa met een weegschaal." },
        { "id": "s1-r2", "spreker": "docent", "tekst": "Dit pak rijst heeft een massa van 750 g.", "uitspraak": "Dit pak rijst heeft een massa van zevenhonderdvijftig gram." },
        { "id": "s1-r3", "spreker": "sami", "samiUitdrukking": "nadenkend", "tekst": "Thuis zeggen we: het gewicht.", "uitspraak": "Thuis zeggen we: het gewicht." },
        { "id": "s1-r4", "spreker": "docent", "tekst": "Dat zeggen veel mensen. In de les zeggen we massa. De letter is m.", "uitspraak": "Dat zeggen veel mensen. In de les zeggen we massa. De letter is em." },
        { "id": "s1-r5", "spreker": "docent", "tekst": "Kleine voorwerpen meet je in gram, zware in kilogram. 1 kg is 1000 g.", "uitspraak": "Kleine voorwerpen meet je in gram, zware in kilogram. Eén kilogram is duizend gram." }
      ]
    },
    {
      "id": "s2", "kop": "VOLUME", "fase": "KIJK", "indeling": "SPLIT",
      "shot": { "naam": "volume-dozen", "frames": 1 },
      "kernwoorden": [
        { "tekst": "volume", "bij": "s2-r2" },
        { "tekst": "letter: V", "bij": "s2-r2" },
        { "tekst": "maatcilinder", "bij": "s2-r3" },
        { "tekst": "1 ml = 1 cm³", "bij": "s2-r4", "accent": true }
      ],
      "getekend": [
        { "type": "maatcilinder", "van": 35, "max": 50, "stap": 10, "eenheid": "ml", "bij": "s2-r3", "oog": true }
      ],
      "regels": [
        { "id": "s2-r1", "spreker": "sami", "samiUitdrukking": "vragend", "tekst": "En wat is volume?", "uitspraak": "[curious] En wat is volume?" },
        { "id": "s2-r2", "spreker": "docent", "tekst": "Volume is hoeveel ruimte iets inneemt. De letter is V.", "uitspraak": "Volume is hoeveel ruimte iets inneemt. De letter is vee." },
        { "id": "s2-r3", "spreker": "docent", "tekst": "Water meet je met een maatcilinder. Hier staat het water op 35 ml.", "uitspraak": "Water meet je met een maatcilinder. Hier staat het water op vijfendertig milliliter." },
        { "id": "s2-r4", "spreker": "docent", "tekst": "Bij vaste voorwerpen gebruik je cm³. Onthoud: 1 ml is 1 cm³.", "uitspraak": "Bij vaste voorwerpen gebruik je kubieke centimeter. Onthoud: één milliliter is één kubieke centimeter." }
      ]
    },
    {
      "id": "s3", "kop": "ONDERDOMPELMETHODE", "fase": "KIJK", "indeling": "SPLIT",
      "shot": { "naam": "onderdompel-steen", "frames": 90, "startBij": "s3-r3" },
      "geluiden": [{ "bestand": "audio/plons.mp3", "bij": "s3-r3", "na": 0.47 }],
      "kernwoorden": [
        { "tekst": "onderdompelmethode", "bij": "s3-r2" },
        { "tekst": "volume voorwerp = eindvolume − beginvolume", "bij": "s3-r4" },
        { "tekst": "25 − 15 = 10 ml", "bij": "s3-r4" },
        { "tekst": "10 ml = 10 cm³", "bij": "s3-r4", "accent": true }
      ],
      "getekend": [
        { "type": "maatcilinder", "van": 15, "naar": 25, "max": 30, "stap": 5, "eenheid": "ml", "bij": "s3-r2", "stijgBij": "s3-r3", "labels": true }
      ],
      "regels": [
        { "id": "s3-r1", "spreker": "sami", "samiUitdrukking": "vragend", "tekst": "Maar een steen heeft geen nette vorm. Hoe meet ik het volume van een steen?", "uitspraak": "[curious] Maar een steen heeft geen nette vorm. Hoe meet ik het volume van een steen?" },
        { "id": "s3-r2", "spreker": "docent", "tekst": "Met de onderdompelmethode. Stap 1: lees het water af. Het staat op 15 ml.", "uitspraak": "Met de onderdompelmethode. Stap één: lees het water af. Het staat op vijftien milliliter." },
        { "id": "s3-r3", "spreker": "docent", "tekst": "Stap 2: laat de steen helemaal onder water zakken. Lees opnieuw af: 25 ml.", "uitspraak": "Stap twee: laat de steen helemaal onder water zakken. Lees opnieuw af: vijfentwintig milliliter." },
        { "id": "s3-r4", "spreker": "docent", "tekst": "Stap 3: reken het verschil uit. 25 − 15 = 10. De steen heeft een volume van 10 cm³.", "uitspraak": "Stap drie: reken het verschil uit. Vijfentwintig min vijftien is tien. De steen heeft een volume van tien kubieke centimeter." },
        { "id": "s3-r5", "spreker": "sami", "samiUitdrukking": "verbaasd", "tekst": "Het water stijgt, omdat de steen ruimte inneemt.", "uitspraak": "Het water stijgt, omdat de steen ruimte inneemt." },
        { "id": "s3-r6", "spreker": "docent", "tekst": "Precies.", "uitspraak": "[warmly] Precies." }
      ]
    },
    {
      "id": "s4", "kop": "DICHTHEID", "fase": "KIJK", "indeling": "SPLIT",
      "shot": { "naam": "dichtheid-weegschalen", "frames": 1 },
      "kernwoorden": [
        { "tekst": "dichtheid", "bij": "s4-r3" },
        { "tekst": "teken: ρ (rho)", "bij": "s4-r4" },
        { "tekst": "eenheid: g/cm³", "bij": "s4-r5" },
        { "tekst": "stofeigenschap", "bij": "s4-r7", "accent": true }
      ],
      "getekend": [
        { "type": "weegschaal", "items": [{ "label": "aluminium", "waarde": 27 }, { "label": "ijzer", "waarde": 79 }], "eenheid": "g", "bij": "s4-r2", "tot": "s4-r4" },
        { "type": "formule", "bij": "s4-r4", "tot": "s4-r7", "regels": [
          { "tekst": "ρ = m / V", "bij": "s4-r4" },
          { "tekst": "ijzer: 79 / 10 = 7,9 g/cm³", "bij": "s4-r5" },
          { "tekst": "aluminium: 27 / 10 = 2,7 g/cm³", "bij": "s4-r5" }
        ] },
        { "type": "driehoek", "bij": "s4-r7" }
      ],
      "regels": [
        { "id": "s4-r1", "spreker": "docent", "tekst": "Terug naar de blokjes. Ze hebben allebei een volume van 10 cm³.", "uitspraak": "Terug naar de blokjes. Ze hebben allebei een volume van tien kubieke centimeter." },
        { "id": "s4-r2", "spreker": "docent", "tekst": "Het blokje aluminium heeft een massa van 27 g. Het blokje ijzer 79 g.", "uitspraak": "Het blokje aluminium heeft een massa van zevenentwintig gram. Het blokje ijzer negenenzeventig gram." },
        { "id": "s4-r3", "spreker": "docent", "tekst": "Dat komt door de dichtheid. Dichtheid is hoeveel massa er in 1 cm³ van een stof zit.", "uitspraak": "Dat komt door de dichtheid. Dichtheid is hoeveel massa er in één kubieke centimeter van een stof zit." },
        { "id": "s4-r4", "spreker": "docent", "tekst": "Het teken is de Griekse letter ρ (rho). De formule: ρ = m / V.", "uitspraak": "Het teken is de Griekse letter ro. De formule: ro is em gedeeld door vee." },
        { "id": "s4-r5", "spreker": "docent", "tekst": "IJzer: 79 / 10 = 7,9 g/cm³. Aluminium: 27 / 10 = 2,7.", "uitspraak": "IJzer: negenenzeventig gedeeld door tien is zeven komma negen gram per kubieke centimeter. Aluminium: zevenentwintig gedeeld door tien is twee komma zeven." },
        { "id": "s4-r6", "spreker": "sami", "samiUitdrukking": "blij", "tekst": "Dus in ijzer zit meer massa in dezelfde ruimte.", "uitspraak": "Dus in ijzer zit meer massa in dezelfde ruimte." },
        { "id": "s4-r7", "spreker": "docent", "tekst": "Ja. Dichtheid is een stofeigenschap. Met de formuledriehoek reken je ook m of V uit.", "uitspraak": "Ja. Dichtheid is een stofeigenschap. Met de formuledriehoek reken je ook em of vee uit." }
      ]
    },
    {
      "id": "s5", "kop": "REKEN ZELF", "fase": "CHECK", "indeling": "STATUS",
      "kernwoorden": [],
      "getekend": [
        { "type": "opgave", "vraag": ["m = 106,8 g", "V = 12 cm³", "ρ = ?"], "aftelBij": "s5-r1", "aftelSeconden": 4, "antwoord": ["ρ = 106,8 / 12 = 8,9 g/cm³", "Het blokje kan van koper zijn."], "antwoordBij": "s5-r2" }
      ],
      "regels": [
        { "id": "s5-r1", "spreker": "docent", "pauzeNa": 4, "tekst": "Nu jij. Een blokje heeft een massa van 106,8 g en een volume van 12 cm³. Wat is de dichtheid? Zet de video op pauze en reken het uit.", "uitspraak": "Nu jij. Een blokje heeft een massa van honderdzes komma acht gram en een volume van twaalf kubieke centimeter. Wat is de dichtheid? Zet de video op pauze en reken het uit." },
        { "id": "s5-r2", "spreker": "docent", "tekst": "106,8 / 12 = 8,9 g/cm³. Het blokje kan van koper zijn.", "uitspraak": "Honderdzes komma acht gedeeld door twaalf is acht komma negen gram per kubieke centimeter. Het blokje kan van koper zijn." }
      ]
    },
    {
      "id": "s6", "kop": "DIT WEET JE NU", "fase": "KLAAR", "indeling": "STATUS",
      "kernwoorden": [],
      "getekend": [
        { "type": "kaarten", "bij": "s6-r1", "kaarten": [
          { "kop": "MASSA", "regels": ["weegschaal", "g en kg"] },
          { "kop": "VOLUME", "regels": ["maatcilinder", "ml en cm³"] },
          { "kop": "DICHTHEID", "regels": ["ρ = m / V", "g/cm³"] }
        ] }
      ],
      "regels": [
        { "id": "s6-r1", "spreker": "docent", "tekst": "Massa meet je met een weegschaal. Volume met een maatcilinder. Dichtheid is massa gedeeld door volume.", "uitspraak": "Massa meet je met een weegschaal. Volume met een maatcilinder. Dichtheid is massa gedeeld door volume." },
        { "id": "s6-r2", "spreker": "sami", "samiUitdrukking": "blij", "tekst": "Nu ga ik de herhalingsopdrachten maken.", "uitspraak": "[happy] Nu ga ik de herhalingsopdrachten maken." }
      ]
    }
  ]
}
```

- [ ] **Step 2: Controlescript**

`video/scripts/controleer-draaiboek.mjs`:

```js
/**
 * Controleert een draaiboek en telt de tekens die naar ElevenLabs gaan.
 *   node video/scripts/controleer-draaiboek.mjs --hoofdstuk <id>
 */
import fs from 'node:fs';
import path from 'node:path';
import { valideerDraaiboek } from '../lib/draaiboek.mjs';

const i = process.argv.indexOf('--hoofdstuk');
const hoofdstukId = i >= 0 ? process.argv[i + 1] : '';
if (!hoofdstukId) {
  console.error('Gebruik: node video/scripts/controleer-draaiboek.mjs --hoofdstuk <id>');
  process.exit(1);
}
const pad = path.resolve('video/public/hoofdstukken', hoofdstukId, 'draaiboek.json');
const draaiboek = JSON.parse(fs.readFileSync(pad, 'utf8'));
const fouten = valideerDraaiboek(draaiboek);
const regels = draaiboek.scenes.flatMap((s) => s.regels);
const tekens = regels.reduce((som, r) => som + r.uitspraak.length, 0);
const woorden = regels.reduce((som, r) => som + r.tekst.split(/\s+/).length, 0);
console.log(`${regels.length} regels, ${woorden} woorden, ${tekens} tekens voor ElevenLabs.`);
console.log(`Geschatte lengte bij 140 woorden per minuut plus pauzes: ${Math.round(woorden / 140 * 60 + regels.length * 0.6)} s.`);
if (fouten.length) {
  console.error(fouten.join('\n'));
  process.exit(1);
}
console.log('Draaiboek is in orde.');
```

- [ ] **Step 3: Draai de controle**

Run: `node video/scripts/controleer-draaiboek.mjs --hoofdstuk hoofdstuk-binask-eoa-1-h2`
Expected: `Draaiboek is in orde.` Geschatte lengte onder 180 s. Controleer met de hand de rekencontrole uit spec §9 tegen de `tekst`-velden.

---

### Task 8: Stemmen opnemen met ElevenLabs (betaald, met akkoord)

**Files:**
- Create: `video/scripts/meet-timing.mjs`
- Output: `video/public/hoofdstukken/hoofdstuk-binask-eoa-1-h2/audio/<regelId>.mp3` (buiten git), `timing.json` (in git)

**Interfaces:**
- Consumes: `bouwTiming` (Task 5), draaiboek (Task 7).
- Produces: `timing.json` met `{ fps: 30, regels: { [regelId]: { bestand: 'audio/<regelId>.mp3', duur } } }`.

- [ ] **Step 1: Kosten opvragen**

Laad via ToolSearch: `creative_create_flow`, `creative_generate_speech`, `creative_get_flow_run_status` (server `bfc19472-...`). Roep `creative_generate_speech` aan met `estimate_only: true`, `model_id: "eleven_v4"`, `voice_id: "fIYdULbypRf7uZYX6u0T"`, `generations_count: 1` en als `prompt` de langste `uitspraak` (s4-r5). Reken met het tekentotaal uit Task 7 Step 3 door naar het hele draaiboek.

- [ ] **Step 2: STOP. Kevin akkoord op de kosten**

Meld Kevin: aantal regels, tekentotaal, geschatte credits. Ga pas verder na een duidelijk ja.

- [ ] **Step 3: Eén proefregel en de downloadroute vaststellen**

`creative_create_flow` met naam `HELIX explainer hoofdstuk-binask-eoa-1-h2`. Neem `s0-r2` op (docent) met `flow_id`, `generations_count: 1`. Poll `creative_get_flow_run_status` tot `all_completed`. Zoek in het resultaat de audio-URL van de generatie. Download:

```bash
mkdir -p "video/public/hoofdstukken/hoofdstuk-binask-eoa-1-h2/audio"
curl -L -o "video/public/hoofdstukken/hoofdstuk-binask-eoa-1-h2/audio/s0-r2.mp3" "<audio-url uit de status>"
ffprobe -v error -show_entries format=duration -of csv=p=0 "video/public/hoofdstukken/hoofdstuk-binask-eoa-1-h2/audio/s0-r2.mp3"
```
Expected: een duur tussen 3 en 8 seconden.

Geeft de status geen downloadbare URL: STOP en vraag Kevin zijn API-sleutel zelf in `.env.local` te zetten als `ELEVENLABS_API_KEY` (staat buiten git via `*.local`). Gebruik dan per regel `POST https://api.elevenlabs.io/v1/text-to-speech/<voice_id>?output_format=mp3_44100_128` met body `{"text": "<uitspraak>", "model_id": "eleven_v4"}` en header `xi-api-key`.

- [ ] **Step 4: Kevin luistert de proefregel**

Stuur het bestand met SendUserFile. Vraag: klinkt Thomas goed met `eleven_v4`, tempo goed voor NT2? Bij nee: pas alleen de `uitspraak` aan (komma's, `[slowly]`) en neem die regel opnieuw op.

- [ ] **Step 5: Alle overige regels**

Per regel in draaiboekvolgorde: `creative_generate_speech` met `prompt` = `uitspraak`, `voice_id` = Thomas (`docent`) of Mette (`sami`, `L8qZJEV989Y3D0xnaVCa`), `model_id: "eleven_v4"`, `generations_count: 1`, dezelfde `flow_id`. Poll en download naar `audio/<regelId>.mp3`. Nooit een regel twee keer starten als retry; bij een mislukte generatie eerst de status lezen.

- [ ] **Step 6: Het plonsje**

Laad via ToolSearch `creative_generate_in_flow` en lees het schema. Maak met dezelfde `flow_id` een `sfx`-node met model `eleven_text_to_sound_v2` en prompt `A soft short splash of a small stone dropped into water in a glass measuring cylinder, about one second, no music, no voice`. Gebruik `estimate_only` eerst; het zat in Kevins akkoord van Step 2, maar noem de kosten erbij. Download naar `audio/plons.mp3`. Biedt de werkruimte geen `sfx`-node, haal dan `geluiden` uit scène `s3` van het draaiboek en meld Kevin dat het plonsje vervalt.

- [ ] **Step 7: Timing meten**

`video/scripts/meet-timing.mjs`:

```js
/**
 * Meet de duur van elke opname met ffprobe en schrijft timing.json.
 *   node video/scripts/meet-timing.mjs --hoofdstuk <id>
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { bouwTiming } from '../lib/timing.mjs';
import { bouwTijdlijn, controleerLengte } from '../lib/tijdlijn.mjs';

const i = process.argv.indexOf('--hoofdstuk');
const hoofdstukId = i >= 0 ? process.argv[i + 1] : '';
if (!hoofdstukId) {
  console.error('Gebruik: node video/scripts/meet-timing.mjs --hoofdstuk <id>');
  process.exit(1);
}
const map = path.resolve('video/public/hoofdstukken', hoofdstukId);
const draaiboek = JSON.parse(fs.readFileSync(path.join(map, 'draaiboek.json'), 'utf8'));

const duren = {};
const ontbreekt = [];
for (const regel of draaiboek.scenes.flatMap((s) => s.regels)) {
  const bestand = `audio/${regel.id}.mp3`;
  const vol = path.join(map, bestand);
  if (!fs.existsSync(vol)) { ontbreekt.push(regel.id); continue; }
  const uit = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', vol], { encoding: 'utf8' });
  duren[regel.id] = { bestand, duur: Number.parseFloat(uit.trim()) };
}
if (ontbreekt.length) {
  console.error(`Opnames ontbreken: ${ontbreekt.join(', ')}`);
  process.exit(1);
}
const timing = bouwTiming(draaiboek, duren);
fs.writeFileSync(path.join(map, 'timing.json'), `${JSON.stringify(timing, null, 2)}\n`);
const lengte = controleerLengte(bouwTijdlijn(draaiboek, timing));
console.log(`timing.json geschreven. Lengte: ${lengte.seconden.toFixed(1)} s ${lengte.ok ? '(binnen 180 s)' : '(TE LANG)'}`);
process.exit(lengte.ok ? 0 : 2);
```

Run: `node video/scripts/meet-timing.mjs --hoofdstuk hoofdstuk-binask-eoa-1-h2`
Expected: exit 0, lengte ≤ 180 s.

Te lang (exit 2): schrap in het draaiboek de laatste zin van `s4-r7` ("Met de formuledriehoek reken je ook m of V uit." en de uitspraak daarvan), neem `s4-r7` opnieuw op, en meet opnieuw. Nog steeds te lang: zet `pauzeNa` van `s5-r1` op 3 en meld het aan Kevin.

---

### Task 9: Remotion-compositie met de HELIX-onderdelen

**Files:**
- Create: `video/src/theme.ts`, `video/src/fonts.ts`, `video/src/types.ts`
- Create: `video/src/onderdelen/TitelVak.tsx`, `ComicPaneel.tsx`, `Weegschaal.tsx`, `Maatcilinder.tsx`, `Formule.tsx`, `Driehoek.tsx`, `Opgave.tsx`, `Kaarten.tsx`, `Kernwoorden.tsx`, `SprekerLabel.tsx`
- Create: `video/src/Scene.tsx`, `video/src/HelixExplainer.tsx`
- Modify: `video/src/Root.tsx` (scaffold-inhoud vervangen)

**Interfaces:**
- Consumes: `bouwTijdlijn` (Task 5), draaiboekformaat (Task 7), `timing.json` (Task 8), shots in `public/hoofdstukken/<id>/shots/<naam>/0001.png...` (Task 10), `public/sami/<uitdrukking>.png` (Task 11).
- Produces: compositie `HelixExplainer` met props `{ hoofdstukId: string }`; lengte uit `calculateMetadata`.

Ontbreken shots of Sami-portretten nog (Task 10 en 11), test dan met de prop `zonderBeelden: true`. `ComicPaneel`, `SprekerLabel` en `SamiGroot` tonen dan een leeg paneel of een geel rondje, zodat deze taak los te testen is.

- [ ] **Step 1: Tokens, fonts, types**

`video/src/theme.ts`:

```ts
// Vaste tokens uit het HELIX-designsysteem (p.6-8). Wijzig hier, niet per scène.
export const KLEUR = {
  ink: '#0B0D0F',
  paper: '#FFF7E8',
  geel: '#FFD33D',
  blauw: '#087EB5',
  groen: '#2E9D63',
  water: '#9FD3EA',
  paneel: '#E9F3F2',
  zacht: '#B9B2A3',
  wit: '#FFFFFF',
  metaal: '#C9CED6',
  donker: '#2E3238',
  display: '#DDEFE3',
} as const;

export const MAAT = {
  marge: 96,
  titelHoogte: 124,
  titelRand: 8,
  vlakBoven: 176,
  vlakHoogte: 660,
  ondertitelGrens: 884,
} as const;

export const LIJN = 8;

export const KOLOM = {
  links: { x: 96, w: 620 },
  midden: { x: 736, w: 620 },
  rechts: { x: 1376, w: 448 },
  breed: { x: 96, w: 1728 },
} as const;
```

`video/src/fonts.ts`:

```ts
import { loadFont as laadBangers } from '@remotion/google-fonts/Bangers';
import { loadFont as laadAtkinson } from '@remotion/google-fonts/AtkinsonHyperlegibleNext';

// Twee families, precies zoals het designsysteem (p.7). Arial vangt ρ op als
// Atkinson geen Grieks heeft.
export const KOPFONT = laadBangers('normal', { weights: ['400'], subsets: ['latin'] }).fontFamily;
export const TEKSTFONT = `${laadAtkinson('normal', { weights: ['400', '700'], subsets: ['latin'] }).fontFamily}, Arial, sans-serif`;
```

`video/src/types.ts`:

```ts
export type Spreker = 'docent' | 'sami';
export type Regel = {
  id: string; spreker: Spreker; tekst: string; uitspraak: string;
  samiUitdrukking?: 'vragend' | 'verbaasd' | 'blij' | 'nadenkend'; pauzeNa?: number;
  bestand: string; start: number; duur: number; eind: number; startFrame: number; duurFrames: number;
};
export type Getekend = { type: string; bij: string; tot?: string; [sleutel: string]: unknown };
export type Kernwoord = { tekst: string; bij: string; accent?: boolean };
export type Scene = {
  id: string; kop: string; fase: 'KIJK' | 'CHECK' | 'KLAAR'; indeling: 'FOCUS' | 'SPLIT' | 'STATUS';
  shot?: { naam: string; frames: number; startBij?: string };
  geluiden?: Array<{ bestand: string; bij: string; na: number }>;
  kernwoorden: Kernwoord[]; getekend: Getekend[]; regels: Regel[];
  startFrame: number; duurFrames: number;
};
export type Draaiboek = { hoofdstukId: string; titel: string; meta: string; scenes: Array<Omit<Scene, 'startFrame' | 'duurFrames'>> };
export type Timing = { fps: number; regels: Record<string, { bestand: string; duur: number }> };
// Frame binnen de scène waarop een regel begint of eindigt.
export type Klok = { begin: (regelId: string) => number; einde: (regelId: string) => number };
```

- [ ] **Step 2: TitelVak, ComicPaneel, SprekerLabel, Kernwoorden**

`video/src/onderdelen/TitelVak.tsx`:

```tsx
import React from 'react';
import { KLEUR, MAAT } from '../theme';
import { KOPFONT, TEKSTFONT } from '../fonts';

export const TitelVak: React.FC<{ kop: string; fase: string; meta: string }> = ({ kop, fase, meta }) => (
  <div style={{
    position: 'absolute', left: 0, top: 0, width: 1920, height: MAAT.titelHoogte,
    background: KLEUR.geel, borderBottom: `${MAAT.titelRand}px solid ${KLEUR.ink}`,
    display: 'flex', alignItems: 'center', gap: 34, padding: `0 ${MAAT.marge}px`, boxSizing: 'border-box',
  }}>
    <div style={{ background: KLEUR.ink, color: KLEUR.geel, fontFamily: TEKSTFONT, fontWeight: 700, fontSize: 32, borderRadius: 10, padding: '10px 26px' }}>{fase}</div>
    <div style={{ flex: 1, fontFamily: KOPFONT, fontSize: 72, letterSpacing: 2, color: KLEUR.ink, lineHeight: 1 }}>{kop}</div>
    <div style={{ fontFamily: TEKSTFONT, fontSize: 26, color: KLEUR.ink }}>{meta}</div>
  </div>
);
```

`video/src/onderdelen/ComicPaneel.tsx`:

```tsx
import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { KLEUR, LIJN, MAAT } from '../theme';

type Props = { hoofdstukId: string; naam: string; frames: number; startFrame: number; x: number; w: number; zonderBeeld: boolean };

// Een still zoomt langzaam in; een reeks speelt vanaf startFrame en blijft op
// het laatste beeld staan. zonderBeeld: leeg paneel, voor zolang de shots er
// nog niet zijn.
export const ComicPaneel: React.FC<Props> = ({ hoofdstukId, naam, frames, startFrame, x, w, zonderBeeld }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const nummer = frames <= 1 ? 1 : Math.min(frames, Math.max(1, frame - startFrame + 1));
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.06]);
  const src = staticFile(`hoofdstukken/${hoofdstukId}/shots/${naam}/${String(nummer).padStart(4, '0')}.png`);
  return (
    <div style={{
      position: 'absolute', left: x, top: MAAT.vlakBoven, width: w, height: MAAT.vlakHoogte,
      background: KLEUR.paneel, border: `${LIJN}px solid ${KLEUR.ink}`, borderRadius: 24, overflow: 'hidden', boxSizing: 'border-box',
    }}>
      {!zonderBeeld && <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${frames <= 1 ? zoom : 1})` }} />}
    </div>
  );
};
```

`video/src/onderdelen/SprekerLabel.tsx`:

```tsx
import React from 'react';
import { Img, staticFile } from 'remotion';
import { KLEUR } from '../theme';
import { TEKSTFONT } from '../fonts';

type Props = { uitdrukking: string; zonderBeeld: boolean };
const rondje = { width: 64, height: 64, borderRadius: 32, background: KLEUR.geel, border: `4px solid ${KLEUR.paper}` } as const;

export const SprekerLabel: React.FC<Props> = ({ uitdrukking, zonderBeeld }) => (
  <div style={{
    position: 'absolute', left: 96, top: 770, height: 84, padding: '0 30px 0 10px', borderRadius: 42,
    background: KLEUR.ink, display: 'flex', alignItems: 'center', gap: 16,
  }}>
    {zonderBeeld
      ? <div style={rondje} />
      : <Img src={staticFile(`sami/${uitdrukking}.png`)} style={{ ...rondje, objectFit: 'cover' }} />}
    <div style={{ fontFamily: TEKSTFONT, fontWeight: 700, fontSize: 32, color: KLEUR.paper }}>SAMI</div>
  </div>
);

export const SamiGroot: React.FC<Props> = ({ uitdrukking, zonderBeeld }) => (zonderBeeld ? null : (
  <Img src={staticFile(`sami/${uitdrukking}.png`)} style={{ position: 'absolute', left: 1360, top: 330, width: 460, height: 506, objectFit: 'contain' }} />
));
```

`video/src/onderdelen/Kernwoorden.tsx`:

```tsx
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { KLEUR, KOLOM, LIJN, MAAT } from '../theme';
import { TEKSTFONT } from '../fonts';
import type { Kernwoord, Klok } from '../types';

export const Kernwoorden: React.FC<{ items: Kernwoord[]; klok: Klok }> = ({ items, klok }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{
      position: 'absolute', left: KOLOM.rechts.x, top: MAAT.vlakBoven, width: KOLOM.rechts.w, height: MAAT.vlakHoogte,
      background: KLEUR.wit, border: `${LIJN}px solid ${KLEUR.ink}`, borderRadius: 24, padding: 36, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: 22, fontFamily: TEKSTFONT,
    }}>
      <div style={{ fontWeight: 700, fontSize: 32, color: KLEUR.ink }}>Kernwoorden</div>
      {items.map((item) => {
        const start = klok.begin(item.bij);
        const zicht = interpolate(frame, [start, start + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <div key={item.tekst} style={{
            opacity: zicht, transform: `translateY(${(1 - zicht) * 12}px)`, fontSize: 30, lineHeight: 1.25,
            color: item.accent ? KLEUR.wit : KLEUR.ink, background: item.accent ? KLEUR.blauw : 'transparent',
            borderRadius: 14, padding: item.accent ? '14px 18px' : 0, fontWeight: item.accent ? 700 : 400,
          }}>{item.tekst}</div>
        );
      })}
    </div>
  );
};
```

- [ ] **Step 3: Getekende onderdelen**

`video/src/onderdelen/Weegschaal.tsx`:

```tsx
import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { KLEUR, LIJN } from '../theme';
import { TEKSTFONT } from '../fonts';

type Props = { items: Array<{ label: string; waarde: number }>; eenheid: string; start: number };

const getal = (waarde: number) => new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 1 }).format(waarde);

// Het schermpje telt in een seconde op tot de waarde uit het draaiboek.
export const Weegschaal: React.FC<Props> = ({ items, eenheid, start }) => {
  const frame = useCurrentFrame();
  const voortgang = interpolate(frame, [start, start + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const breedte = items.length === 1 ? 520 : 290;
  return (
    <div style={{ display: 'flex', gap: 30, justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      {items.map((item) => (
        <div key={item.label} style={{ width: breedte, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <svg viewBox="0 0 300 200" width={breedte}>
            <rect x="20" y="40" width="260" height="22" rx="8" fill={KLEUR.metaal} stroke={KLEUR.ink} strokeWidth={LIJN} />
            <rect x="130" y="62" width="40" height="30" fill={KLEUR.ink} />
            <rect x="30" y="92" width="240" height="96" rx="16" fill={KLEUR.donker} stroke={KLEUR.ink} strokeWidth={LIJN} />
            <rect x="62" y="110" width="176" height="60" rx="8" fill={KLEUR.display} stroke={KLEUR.ink} strokeWidth={4} />
            <text x="150" y="152" textAnchor="middle" fontFamily={TEKSTFONT} fontWeight={700} fontSize={items.length === 1 ? 36 : 40} fill={KLEUR.ink}>
              {getal(Math.round(item.waarde * voortgang))} {eenheid}
            </text>
          </svg>
          <div style={{ fontFamily: TEKSTFONT, fontSize: 30, color: KLEUR.ink }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
};
```

`video/src/onderdelen/Maatcilinder.tsx`:

```tsx
import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { KLEUR, LIJN } from '../theme';
import { TEKSTFONT } from '../fonts';

type Props = { van: number; naar?: number; max: number; stap: number; eenheid: string; start: number; stijg?: number; labels?: boolean; oog?: boolean };

const ONDER = 600;
const BOVEN = 100;
const X = 210;
const B = 200;

// Getekende maatcilinder. De schaal klopt altijd: het niveau is een getal uit
// het draaiboek, niet uit een AI-beeld.
export const Maatcilinder: React.FC<Props> = ({ van, naar, max, stap, eenheid, start, stijg, labels, oog }) => {
  const frame = useCurrentFrame();
  const y = (waarde: number) => ONDER - ((ONDER - BOVEN) * waarde) / max;
  const klem = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
  const vullen = interpolate(frame, [start, start + 30], [0, van], { ...klem, easing: Easing.out(Easing.cubic) });
  const stijgStart = (stijg ?? Number.POSITIVE_INFINITY) + 12;
  const niveau = naar !== undefined && stijg !== undefined
    ? (frame < stijgStart ? vullen : interpolate(frame, [stijgStart, stijgStart + 45], [van, naar], { ...klem, easing: Easing.inOut(Easing.cubic) }))
    : vullen;
  const steenY = stijg !== undefined ? interpolate(frame, [stijg, stijg + 14], [BOVEN - 60, ONDER - 40], { ...klem, easing: Easing.in(Easing.quad) }) : null;
  const streepjes = [];
  for (let w = 0; w <= max; w += stap) streepjes.push(w);
  const beginZicht = interpolate(frame, [start + 30, start + 40], [0, 1], klem);
  const eindZicht = stijg !== undefined ? interpolate(frame, [stijgStart + 45, stijgStart + 55], [0, 1], klem) : 0;

  return (
    <svg viewBox="0 0 620 660" width={620} height={660}>
      <rect x={X} y={y(niveau)} width={B} height={ONDER - y(niveau)} fill={KLEUR.water} />
      <line x1={X} x2={X + B} y1={y(niveau)} y2={y(niveau)} stroke={KLEUR.blauw} strokeWidth={6} />
      {steenY !== null && (
        <path transform={`translate(${X + 60} ${steenY})`} d="M0 20 q30 -40 70 -20 q36 18 22 60 q-12 40 -56 36 q-48 -6 -36 -76z" fill="#8C8577" stroke={KLEUR.ink} strokeWidth={7} />
      )}
      <rect x={X} y={BOVEN - 40} width={B} height={ONDER - BOVEN + 40} rx={14} fill="none" stroke={KLEUR.ink} strokeWidth={LIJN} />
      <rect x={X - 10} y={ONDER} width={B + 20} height={30} rx={8} fill={KLEUR.ink} />
      {streepjes.map((w) => (
        <g key={w}>
          <line x1={X} x2={X + 40} y1={y(w)} y2={y(w)} stroke={KLEUR.ink} strokeWidth={5} />
          <text x={X - 20} y={y(w) + 10} textAnchor="end" fontFamily={TEKSTFONT} fontSize={28} fill={KLEUR.ink}>{w}</text>
        </g>
      ))}
      <text x={X + B / 2} y={ONDER + 70} textAnchor="middle" fontFamily={TEKSTFONT} fontSize={28} fill={KLEUR.ink}>{eenheid}</text>
      {oog && (
        <g opacity={beginZicht} transform={`translate(${X + B + 40} ${y(van)})`}>
          <ellipse cx={30} cy={0} rx={30} ry={18} fill={KLEUR.wit} stroke={KLEUR.ink} strokeWidth={5} />
          <circle cx={30} cy={0} r={9} fill={KLEUR.ink} />
          <line x1={-30} x2={-6} y1={0} y2={0} stroke={KLEUR.ink} strokeWidth={4} strokeDasharray="8 6" />
          <text x={74} y={10} fontFamily={TEKSTFONT} fontWeight={700} fontSize={30} fill={KLEUR.blauw}>{van} {eenheid}</text>
        </g>
      )}
      {labels && (
        <>
          <g opacity={beginZicht}>
            <line x1={X + B + 10} x2={X + B + 70} y1={y(van)} y2={y(van)} stroke={KLEUR.ink} strokeWidth={4} strokeDasharray="10 8" />
            <text x={X + B + 80} y={y(van) + 10} fontFamily={TEKSTFONT} fontSize={28} fill={KLEUR.ink}>begin {van} {eenheid}</text>
          </g>
          {naar !== undefined && (
            <g opacity={eindZicht}>
              <line x1={X + B + 10} x2={X + B + 70} y1={y(naar)} y2={y(naar)} stroke={KLEUR.blauw} strokeWidth={6} />
              <text x={X + B + 80} y={y(naar) + 10} fontFamily={TEKSTFONT} fontWeight={700} fontSize={28} fill={KLEUR.blauw}>eind {naar} {eenheid}</text>
            </g>
          )}
        </>
      )}
    </svg>
  );
};
```

`video/src/onderdelen/Formule.tsx`:

```tsx
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { KLEUR } from '../theme';
import { TEKSTFONT } from '../fonts';

export const Formule: React.FC<{ regels: Array<{ tekst: string; start: number }> }> = ({ regels }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 34, height: '100%', padding: '0 20px', fontFamily: TEKSTFONT }}>
      {regels.map((regel, index) => {
        const zicht = interpolate(frame, [regel.start, regel.start + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const eerste = index === 0;
        return (
          <div key={regel.tekst} style={{
            opacity: zicht, fontSize: eerste ? 64 : 34, fontWeight: eerste ? 700 : 400,
            color: eerste ? KLEUR.blauw : KLEUR.ink, textAlign: eerste ? 'center' : 'left',
          }}>{regel.tekst}</div>
        );
      })}
    </div>
  );
};
```

`video/src/onderdelen/Driehoek.tsx`:

```tsx
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { KLEUR, LIJN } from '../theme';
import { TEKSTFONT } from '../fonts';

const STAPPEN = [
  { af: 'rho', formule: 'ρ = m / V' },
  { af: 'm', formule: 'm = ρ × V' },
  { af: 'V', formule: 'V = m / ρ' },
] as const;
const PLEK = { m: { x: 310, y: 250 }, rho: { x: 215, y: 420 }, V: { x: 405, y: 420 } } as const;

// Formuledriehoek: steeds één letter afgedekt met een geel kaartje, eronder
// de formule die overblijft. Elke stap duurt anderhalve seconde.
export const Driehoek: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const stap = STAPPEN[Math.max(0, Math.floor((frame - start) / 45)) % STAPPEN.length];
  const plek = PLEK[stap.af];
  return (
    <svg viewBox="0 0 620 660" width={620} height={660}>
      <polygon points="310,110 520,500 100,500" fill={KLEUR.wit} stroke={KLEUR.ink} strokeWidth={LIJN} strokeLinejoin="round" />
      <line x1={178} x2={442} y1={340} y2={340} stroke={KLEUR.ink} strokeWidth={6} />
      <line x1={310} x2={310} y1={340} y2={500} stroke={KLEUR.ink} strokeWidth={6} />
      <text x={PLEK.m.x} y={PLEK.m.y + 20} textAnchor="middle" fontFamily={TEKSTFONT} fontWeight={700} fontSize={72} fill={KLEUR.ink}>m</text>
      <text x={PLEK.rho.x} y={PLEK.rho.y + 20} textAnchor="middle" fontFamily={TEKSTFONT} fontWeight={700} fontSize={72} fill={KLEUR.ink}>ρ</text>
      <text x={PLEK.V.x} y={PLEK.V.y + 20} textAnchor="middle" fontFamily={TEKSTFONT} fontWeight={700} fontSize={72} fill={KLEUR.ink}>V</text>
      <rect x={plek.x - 52} y={plek.y - 48} width={104} height={96} rx={14} fill={KLEUR.geel} stroke={KLEUR.ink} strokeWidth={6} />
      <text x={310} y={600} textAnchor="middle" fontFamily={TEKSTFONT} fontWeight={700} fontSize={56} fill={KLEUR.blauw}>{stap.formule}</text>
    </svg>
  );
};
```

`video/src/onderdelen/Opgave.tsx`:

```tsx
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { KLEUR, LIJN, MAAT } from '../theme';
import { TEKSTFONT } from '../fonts';

type Props = { vraag: string[]; antwoord: string[]; aftelStart: number; aftelSeconden: number; antwoordStart: number };

export const Opgave: React.FC<Props> = ({ vraag, antwoord, aftelStart, aftelSeconden, antwoordStart }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const klem = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
  const rest = interpolate(frame, [aftelStart, aftelStart + aftelSeconden * fps], [1, 0], klem);
  const aftelZicht = frame >= aftelStart && frame < antwoordStart ? 1 : 0;
  const antwoordZicht = interpolate(frame, [antwoordStart, antwoordStart + 10], [0, 1], klem);
  return (
    <div style={{ position: 'absolute', left: 96, top: MAAT.vlakBoven, width: 1728, height: MAAT.vlakHoogte, display: 'flex', gap: 48, fontFamily: TEKSTFONT }}>
      <div style={{ flex: 1, background: KLEUR.wit, border: `${LIJN}px solid ${KLEUR.ink}`, borderRadius: 24, padding: 56, display: 'flex', flexDirection: 'column', gap: 28 }}>
        {vraag.map((regel) => <div key={regel} style={{ fontSize: 64, color: KLEUR.ink }}>{regel}</div>)}
        <div style={{ marginTop: 'auto', opacity: aftelZicht, display: 'flex', alignItems: 'center', gap: 24 }}>
          <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke={KLEUR.ink} strokeWidth={2.5} strokeLinecap="round"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
          <div style={{ fontSize: 34, color: KLEUR.ink }}>Zet op pauze en reken</div>
          <div style={{ flex: 1, height: 22, border: `4px solid ${KLEUR.ink}`, borderRadius: 11, overflow: 'hidden' }}>
            <div style={{ width: `${rest * 100}%`, height: '100%', background: KLEUR.blauw }} />
          </div>
        </div>
      </div>
      <div style={{ width: 760, opacity: antwoordZicht, background: KLEUR.groen, border: `${LIJN}px solid ${KLEUR.ink}`, borderRadius: 24, padding: 56, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28 }}>
        {antwoord.map((regel, index) => <div key={regel} style={{ fontSize: index === 0 ? 48 : 36, fontWeight: index === 0 ? 700 : 400, color: KLEUR.wit }}>{regel}</div>)}
      </div>
    </div>
  );
};
```

`video/src/onderdelen/Kaarten.tsx`:

```tsx
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { KLEUR, LIJN, MAAT } from '../theme';
import { KOPFONT, TEKSTFONT } from '../fonts';

export const Kaarten: React.FC<{ kaarten: Array<{ kop: string; regels: string[] }>; start: number }> = ({ kaarten, start }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: 96, top: MAAT.vlakBoven, width: 1728, height: MAAT.vlakHoogte, display: 'flex', gap: 48 }}>
      {kaarten.map((kaart, index) => {
        const begin = start + index * 8;
        const zicht = interpolate(frame, [begin, begin + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <div key={kaart.kop} style={{ flex: 1, opacity: zicht, transform: `translateY(${(1 - zicht) * 20}px)`, background: KLEUR.wit, border: `${LIJN}px solid ${KLEUR.ink}`, borderRadius: 24, overflow: 'hidden' }}>
            <div style={{ background: KLEUR.geel, borderBottom: `${LIJN}px solid ${KLEUR.ink}`, padding: '22px 36px', fontFamily: KOPFONT, fontSize: 64, color: KLEUR.ink }}>{kaart.kop}</div>
            <div style={{ padding: 36, display: 'flex', flexDirection: 'column', gap: 22, fontFamily: TEKSTFONT, fontSize: 40, color: KLEUR.ink }}>
              {kaart.regels.map((regel) => <div key={regel}>{regel}</div>)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
```

- [ ] **Step 4: Scene en compositie**

`video/src/Scene.tsx`:

```tsx
import React from 'react';
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Audio } from '@remotion/media';
import { KLEUR, KOLOM, MAAT } from './theme';
import type { Getekend, Klok, Scene as SceneType } from './types';
import { TitelVak } from './onderdelen/TitelVak';
import { ComicPaneel } from './onderdelen/ComicPaneel';
import { Kernwoorden } from './onderdelen/Kernwoorden';
import { SamiGroot, SprekerLabel } from './onderdelen/SprekerLabel';
import { Weegschaal } from './onderdelen/Weegschaal';
import { Maatcilinder } from './onderdelen/Maatcilinder';
import { Formule } from './onderdelen/Formule';
import { Driehoek } from './onderdelen/Driehoek';
import { Opgave } from './onderdelen/Opgave';
import { Kaarten } from './onderdelen/Kaarten';

type Props = { scene: SceneType; hoofdstukId: string; meta: string; zonderBeelden: boolean };

const maakKlok = (scene: SceneType): Klok => {
  const zoek = (id: string) => {
    const regel = scene.regels.find((r) => r.id === id);
    if (!regel) throw new Error(`Regel ${id} niet gevonden in scène ${scene.id}.`);
    return regel;
  };
  return {
    begin: (id) => zoek(id).startFrame - scene.startFrame,
    einde: (id) => zoek(id).startFrame + zoek(id).duurFrames - scene.startFrame,
  };
};

const GetekendOnderdeel: React.FC<{ item: Getekend; klok: Klok }> = ({ item, klok }) => {
  const start = klok.begin(item.bij);
  const g = item as Record<string, any>;
  switch (item.type) {
    case 'weegschaal':
      return <Weegschaal items={g.items} eenheid={g.eenheid} start={start} />;
    case 'maatcilinder':
      return <Maatcilinder van={g.van} naar={g.naar} max={g.max} stap={g.stap} eenheid={g.eenheid} start={start} stijg={g.stijgBij ? klok.begin(g.stijgBij) : undefined} labels={g.labels} oog={g.oog} />;
    case 'formule':
      return <Formule regels={g.regels.map((r: { tekst: string; bij: string }) => ({ tekst: r.tekst, start: klok.begin(r.bij) }))} />;
    case 'driehoek':
      return <Driehoek start={start} />;
    case 'opgave':
      return <Opgave vraag={g.vraag} antwoord={g.antwoord} aftelStart={klok.einde(g.aftelBij)} aftelSeconden={g.aftelSeconden} antwoordStart={klok.begin(g.antwoordBij)} />;
    case 'kaarten':
      return <Kaarten kaarten={g.kaarten} start={start} />;
    default:
      throw new Error(`Onbekend getekend onderdeel: ${item.type}`);
  }
};

export const Scene: React.FC<Props> = ({ scene, hoofdstukId, meta, zonderBeelden }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const klok = maakKlok(scene);
  const nu = scene.regels.find((r) => frame >= klok.begin(r.id) && frame < klok.einde(r.id));
  const laatsteSami = [...scene.regels].reverse().find((r) => r.spreker === 'sami' && klok.begin(r.id) <= frame);
  const zichtbaar = scene.getekend.filter((item) => frame >= klok.begin(item.bij) && (!item.tot || frame < klok.begin(item.tot)));
  const status = scene.indeling === 'STATUS';

  return (
    <AbsoluteFill style={{ background: KLEUR.paper }}>
      <TitelVak kop={scene.kop} fase={scene.fase} meta={meta} />
      {scene.shot && (
        <ComicPaneel
          hoofdstukId={hoofdstukId}
          naam={scene.shot.naam}
          frames={scene.shot.frames}
          startFrame={scene.shot.startBij ? klok.begin(scene.shot.startBij) : 0}
          x={scene.indeling === 'FOCUS' ? KOLOM.breed.x : KOLOM.links.x}
          w={scene.indeling === 'FOCUS' ? KOLOM.breed.w : KOLOM.links.w}
          zonderBeeld={zonderBeelden}
        />
      )}
      {scene.indeling === 'FOCUS' && laatsteSami && <SamiGroot uitdrukking={laatsteSami.samiUitdrukking || 'vragend'} zonderBeeld={zonderBeelden} />}
      {scene.indeling === 'SPLIT' && (
        <div style={{ position: 'absolute', left: KOLOM.midden.x, top: MAAT.vlakBoven, width: KOLOM.midden.w, height: MAAT.vlakHoogte }}>
          {zichtbaar.map((item) => (
            <div key={`${item.type}-${item.bij}`} style={{ position: 'absolute', inset: 0 }}>
              <GetekendOnderdeel item={item} klok={klok} />
            </div>
          ))}
        </div>
      )}
      {status && zichtbaar.map((item) => <GetekendOnderdeel key={`${item.type}-${item.bij}`} item={item} klok={klok} />)}
      {scene.indeling === 'SPLIT' && <Kernwoorden items={scene.kernwoorden} klok={klok} />}
      {nu?.spreker === 'sami' && scene.indeling !== 'FOCUS' && <SprekerLabel uitdrukking={nu.samiUitdrukking || 'vragend'} zonderBeeld={zonderBeelden} />}
      {scene.regels.map((regel) => (
        <Sequence key={regel.id} from={klok.begin(regel.id)} durationInFrames={regel.duurFrames} name={regel.id}>
          <Audio src={staticFile(`hoofdstukken/${hoofdstukId}/${regel.bestand}`)} />
        </Sequence>
      ))}
      {(scene.geluiden || []).map((geluid) => (
        <Sequence key={geluid.bestand} from={klok.begin(geluid.bij) + Math.round(geluid.na * fps)} name={geluid.bestand}>
          <Audio src={staticFile(`hoofdstukken/${hoofdstukId}/${geluid.bestand}`)} volume={0.6} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
```

`video/src/HelixExplainer.tsx`:

```tsx
import React, { useMemo } from 'react';
import { AbsoluteFill, Sequence, staticFile, type CalculateMetadataFunction } from 'remotion';
import { bouwTijdlijn } from '../lib/tijdlijn.mjs';
import { KLEUR } from './theme';
import { Scene } from './Scene';
import type { Draaiboek, Scene as SceneType, Timing } from './types';

// zonderBeelden: shots en portretten weglaten, om de compositie te testen
// voordat Blender en de portretten klaar zijn.
export type ExplainerProps = { hoofdstukId: string; zonderBeelden?: boolean; draaiboek: Draaiboek | null; timing: Timing | null };

export const berekenMetadata: CalculateMetadataFunction<ExplainerProps> = async ({ props }) => {
  const basis = `hoofdstukken/${props.hoofdstukId}`;
  const draaiboek = (await fetch(staticFile(`${basis}/draaiboek.json`)).then((r) => r.json())) as Draaiboek;
  const timing = (await fetch(staticFile(`${basis}/timing.json`)).then((r) => r.json())) as Timing;
  const tijdlijn = bouwTijdlijn(draaiboek, timing, 30);
  return { durationInFrames: tijdlijn.totaalFrames, props: { ...props, draaiboek, timing } };
};

export const HelixExplainer: React.FC<ExplainerProps> = ({ hoofdstukId, zonderBeelden = false, draaiboek, timing }) => {
  const tijdlijn = useMemo(() => (draaiboek && timing ? bouwTijdlijn(draaiboek, timing, 30) : null), [draaiboek, timing]);
  if (!tijdlijn || !draaiboek) return <AbsoluteFill style={{ background: KLEUR.paper }} />;
  return (
    <AbsoluteFill style={{ background: KLEUR.paper }}>
      {tijdlijn.scenes.map((scene: SceneType) => (
        <Sequence key={scene.id} from={scene.startFrame} durationInFrames={scene.duurFrames} name={scene.id}>
          <Scene scene={scene} hoofdstukId={hoofdstukId} meta={draaiboek.meta} zonderBeelden={zonderBeelden} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
```

`video/src/Root.tsx` (scaffold-inhoud vervangen):

```tsx
import React from 'react';
import { Composition } from 'remotion';
import { HelixExplainer, berekenMetadata, type ExplainerProps } from './HelixExplainer';

const standaard: ExplainerProps = { hoofdstukId: 'hoofdstuk-binask-eoa-1-h2', draaiboek: null, timing: null };

export const RemotionRoot: React.FC = () => (
  <Composition
    id="HelixExplainer"
    component={HelixExplainer}
    durationInFrames={300}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={standaard}
    calculateMetadata={berekenMetadata}
  />
);
```

Controleer dat `video/src/index.ts` `registerRoot(RemotionRoot)` uit `./Root` aanroept (scaffold doet dat al).

- [ ] **Step 5: Typecheck en compositie**

Run:
```bash
cd video && npx tsc --noEmit && npx remotion compositions --props='{"hoofdstukId":"hoofdstuk-binask-eoa-1-h2","zonderBeelden":true}' && cd ..
```
Expected: geen TypeScript-fouten. `HelixExplainer` heeft een lengte die past bij `timing.json`, ongeveer 5000 frames. Task 8 moet dus klaar zijn: zonder `timing.json` en de audio kan deze taak niet getest worden.

- [ ] **Step 6: Bekijk in Remotion Studio**

Run in de achtergrond: `cd video && npx remotion studio --no-open`. Open de getoonde URL in de browser pane op `/HelixExplainer`. Zijn shots en portretten er nog niet, zet in het props-paneel van de studio `zonderBeelden` op `true`. Ga naar het midden van elke scène en maak een screenshot. Controleer per scène:
- het titelvak met het fasekenmerk
- of de onderste 196 px leeg zijn
- of de schaal van de maatcilinder klopt (15, 25, 35)
- de getallen op de weegschaal (750, 27, 79)

Stop de studio daarna.

---

### Task 10: Comic-shots in Blender

**Files:**
- Create: `video/blender/renderrecept.py`, `video/blender/bouw_lab.py`, `video/blender/render-shot.py`, `video/blender/shots/hoofdstuk-binask-eoa-1-h2.py`
- Output: `video/public/hoofdstukken/hoofdstuk-binask-eoa-1-h2/shots/<shot>/0001.png ...` (buiten git)

**Interfaces:**
- Produces: shots `opening-blokjes` (1728×660, 1 frame), `massa-rijst`, `volume-dozen`, `dichtheid-weegschalen` (1240×1320, 1 frame), `onderdompel-steen` (1240×1320, 90 frames). Namen moeten gelijk zijn aan `shot.naam` in het draaiboek.
- Shotmodule: `SHOTS: dict[str, callable(scene) -> dict(breedte, hoogte, frames)]`.

- [ ] **Step 1: Wat kan Blender 5.2**

Run:
```bash
"/c/Program Files/Blender Foundation/Blender 5.2/blender.exe" -b --factory-startup --python-expr "import bpy; print('ENGINES', [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items]); print('FREESTYLE', hasattr(bpy.types.RenderSettings, 'use_freestyle')); print('RENDERMETHOD', 'surface_render_method' in bpy.types.Material.bl_rna.properties)"
```
Expected: een EEVEE-engine in de lijst. Noteer of `surface_render_method` bestaat; `renderrecept.py` gebruikt anders `blend_method`.

- [ ] **Step 2: Renderrecept**

`video/blender/renderrecept.py`:

```python
"""Vast renderrecept voor de HELIX-comicshots (designsysteem p.14):
cel-shading, zwarte contouren met een omgekeerde schil, warm licht met een
koele teal schaduwtint, camera recht voor of iets van boven. Geen tekst."""
import math
import bpy

INK = '#0B0D0F'
PAPER = '#FFF7E8'
SCHADUW_TINT = (0.62, 0.80, 0.82, 1.0)
MIDDEN_TINT = (0.93, 0.93, 0.93, 1.0)
LICHT_TINT = (1.0, 0.96, 0.88, 1.0)


def lineair(hexkleur):
    h = hexkleur.lstrip('#')

    def kanaal(c):
        c = int(c, 16) / 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    return (kanaal(h[0:2]), kanaal(h[2:4]), kanaal(h[4:6]), 1.0)


def leeg_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    return bpy.context.scene


def kies_engine(scene):
    namen = [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items]
    for naam in ('BLENDER_EEVEE_NEXT', 'BLENDER_EEVEE'):
        if naam in namen:
            scene.render.engine = naam
            return naam
    raise RuntimeError(f'Geen EEVEE in {namen}')


def zet_render(scene, breedte, hoogte, frames=1):
    kies_engine(scene)
    scene.render.resolution_x = breedte
    scene.render.resolution_y = hoogte
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.view_settings.view_transform = 'Standard'
    scene.render.fps = 30
    scene.frame_start = 1
    scene.frame_end = frames
    if hasattr(scene, 'eevee') and hasattr(scene.eevee, 'taa_render_samples'):
        scene.eevee.taa_render_samples = 32
    wereld = bpy.data.worlds.new('helix-wereld')
    wereld.use_nodes = True
    achtergrond = wereld.node_tree.nodes.get('Background')
    achtergrond.inputs['Color'].default_value = lineair(PAPER)
    achtergrond.inputs['Strength'].default_value = 0.5
    scene.world = wereld


def _transparant(mat):
    if 'surface_render_method' in bpy.types.Material.bl_rna.properties:
        mat.surface_render_method = 'BLENDED'
    else:
        mat.blend_method = 'BLEND'


def toon_materiaal(naam, hexkleur, alpha=1.0):
    bestaand = bpy.data.materials.get(naam)
    if bestaand:
        return bestaand
    mat = bpy.data.materials.new(naam)
    mat.use_nodes = True
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    nodes.clear()
    uit = nodes.new('ShaderNodeOutputMaterial')
    diffuus = nodes.new('ShaderNodeBsdfDiffuse')
    naar_rgb = nodes.new('ShaderNodeShaderToRGB')
    banden = nodes.new('ShaderNodeValToRGB')
    banden.color_ramp.interpolation = 'CONSTANT'
    elementen = banden.color_ramp.elements
    elementen[0].position = 0.0
    elementen[0].color = SCHADUW_TINT
    elementen[1].position = 0.18
    elementen[1].color = MIDDEN_TINT
    licht = elementen.new(0.6)
    licht.color = LICHT_TINT
    basis = nodes.new('ShaderNodeRGB')
    basis.outputs[0].default_value = lineair(hexkleur)
    maal = nodes.new('ShaderNodeVectorMath')
    maal.operation = 'MULTIPLY'
    emissie = nodes.new('ShaderNodeEmission')
    links.new(diffuus.outputs[0], naar_rgb.inputs[0])
    links.new(naar_rgb.outputs[0], banden.inputs[0])
    links.new(banden.outputs[0], maal.inputs[0])
    links.new(basis.outputs[0], maal.inputs[1])
    links.new(maal.outputs[0], emissie.inputs[0])
    if alpha >= 1.0:
        links.new(emissie.outputs[0], uit.inputs[0])
    else:
        doorzichtig = nodes.new('ShaderNodeBsdfTransparent')
        meng = nodes.new('ShaderNodeMixShader')
        meng.inputs[0].default_value = alpha
        links.new(doorzichtig.outputs[0], meng.inputs[1])
        links.new(emissie.outputs[0], meng.inputs[2])
        links.new(meng.outputs[0], uit.inputs[0])
        _transparant(mat)
    return mat


def contour_materiaal():
    mat = bpy.data.materials.get('helix-contour')
    if mat:
        return mat
    mat = bpy.data.materials.new('helix-contour')
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    uit = nodes.new('ShaderNodeOutputMaterial')
    emissie = nodes.new('ShaderNodeEmission')
    emissie.inputs[0].default_value = lineair(INK)
    mat.node_tree.links.new(emissie.outputs[0], uit.inputs[0])
    mat.use_backface_culling = True
    return mat


def geef_materiaal(obj, mat, contour=0.018):
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    if contour > 0:
        obj.data.materials.append(contour_materiaal())
        schil = obj.modifiers.new('contour', 'SOLIDIFY')
        schil.thickness = contour
        schil.offset = 1.0
        schil.use_flip_normals = True
        schil.use_rim = False
        schil.material_offset = 1


def licht_en_camera(locatie, doel, lens=50):
    zon = bpy.data.objects.new('hooglicht', bpy.data.lights.new('hooglicht', 'SUN'))
    zon.data.energy = 3.5
    zon.data.color = (1.0, 0.95, 0.86)
    zon.rotation_euler = (math.radians(50), 0, math.radians(35))
    invul = bpy.data.objects.new('invullicht', bpy.data.lights.new('invullicht', 'SUN'))
    invul.data.energy = 1.0
    invul.data.color = (0.7, 0.9, 0.92)
    invul.rotation_euler = (math.radians(60), 0, math.radians(-60))
    richtpunt = bpy.data.objects.new('richtpunt', None)
    richtpunt.location = doel
    camera = bpy.data.objects.new('camera', bpy.data.cameras.new('camera'))
    camera.location = locatie
    camera.data.lens = lens
    volg = camera.constraints.new('TRACK_TO')
    volg.target = richtpunt
    volg.track_axis = 'TRACK_NEGATIVE_Z'
    volg.up_axis = 'UP_Y'
    scene = bpy.context.scene
    for obj in (zon, invul, richtpunt, camera):
        scene.collection.objects.link(obj)
    scene.camera = camera
    return camera
```

- [ ] **Step 3: Labbibliotheek als code**

`video/blender/bouw_lab.py`:

```python
"""De vaste labspullen voor HELIX-explainers, als code. Een nieuw voorwerp
voeg je hier toe en gebruik je daarna in elk hoofdstuk opnieuw. Geen tekst,
geen getallen en geen schaalverdeling op een voorwerp."""
import bpy
from renderrecept import geef_materiaal, toon_materiaal


def _maak(primitief, naam, locatie, schaal=(1, 1, 1), **opties):
    primitief(location=locatie, **opties)
    obj = bpy.context.active_object
    obj.name = naam
    obj.scale = schaal
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return obj


def labtafel(breedte=3.4, diepte=1.6):
    blad = _maak(bpy.ops.mesh.primitive_cube_add, 'labtafel', (0, 0, -0.05), (breedte / 2, diepte / 2, 0.05))
    geef_materiaal(blad, toon_materiaal('hout', '#C98B54'), contour=0.012)
    return blad


def blokje(naam, hexkleur, x, y=0.0, grootte=0.42):
    obj = _maak(bpy.ops.mesh.primitive_cube_add, naam, (x, y, grootte / 2), (grootte / 2, grootte / 2, grootte / 2))
    afronding = obj.modifiers.new('afronding', 'BEVEL')
    afronding.width = 0.02
    afronding.segments = 2
    geef_materiaal(obj, toon_materiaal(f'{naam}-materiaal', hexkleur))
    return obj


def maatcilinder(x=0.0, hoogte=1.6, straal=0.22, waterhoogte=0.75):
    voet = _maak(bpy.ops.mesh.primitive_cylinder_add, 'cilindervoet', (x, 0, 0.04), (1, 1, 1), vertices=6, radius=straal * 1.9, depth=0.08)
    geef_materiaal(voet, toon_materiaal('donker', '#2E3238'))
    glas = _maak(bpy.ops.mesh.primitive_cylinder_add, 'cilinderglas', (x, 0, 0.08 + hoogte / 2), (1, 1, 1), vertices=48, radius=straal, depth=hoogte)
    geef_materiaal(glas, toon_materiaal('glas', '#FFFFFF', alpha=0.12), contour=0.012)
    bpy.context.scene.cursor.location = (x, 0, 0.08)
    water = _maak(bpy.ops.mesh.primitive_cylinder_add, 'water', (x, 0, 0.58), (1, 1, 1), vertices=48, radius=straal * 0.92, depth=1.0)
    bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
    water.scale = (1, 1, waterhoogte)
    geef_materiaal(water, toon_materiaal('water', '#9FD3EA', alpha=0.75), contour=0)
    return {'voet': voet, 'glas': glas, 'water': water}


def steen(locatie=(0, 0, 0.13)):
    obj = _maak(bpy.ops.mesh.primitive_ico_sphere_add, 'steen', locatie, (1.2, 1.0, 0.85), subdivisions=3, radius=0.13)
    textuur = bpy.data.textures.new('steenruis', 'CLOUDS')
    textuur.noise_scale = 0.3
    ruw = obj.modifiers.new('ruw', 'DISPLACE')
    ruw.texture = textuur
    ruw.strength = 0.035
    geef_materiaal(obj, toon_materiaal('steen', '#8C8577'), contour=0.012)
    return obj


def weegschaal(x, y=0.0, breedte=0.9):
    romp = _maak(bpy.ops.mesh.primitive_cube_add, f'weegschaal-{x}', (x, y, 0.08), (breedte / 2, 0.3, 0.08))
    geef_materiaal(romp, toon_materiaal('donker', '#2E3238'))
    plaat = _maak(bpy.ops.mesh.primitive_cube_add, f'weegplaat-{x}', (x, y, 0.175), (breedte * 0.44, 0.27, 0.015))
    geef_materiaal(plaat, toon_materiaal('metaal', '#C9CED6'), contour=0.01)
    scherm = _maak(bpy.ops.mesh.primitive_cube_add, f'weegscherm-{x}', (x, y - 0.305, 0.08), (0.16, 0.01, 0.045))
    geef_materiaal(scherm, toon_materiaal('lcd', '#3F5E4F'), contour=0.006)
    return romp


def pak_rijst(x, y=0.0, z=0.19):
    pak = _maak(bpy.ops.mesh.primitive_cube_add, 'pak-rijst', (x, y, z + 0.24), (0.16, 0.08, 0.24))
    geef_materiaal(pak, toon_materiaal('rijstpak', '#F2E6C9'))
    band = _maak(bpy.ops.mesh.primitive_cube_add, 'rijstband', (x, y, z + 0.30), (0.165, 0.085, 0.05))
    geef_materiaal(band, toon_materiaal('rijstband', '#D9A441'), contour=0.008)
    return pak


def doos(naam, x, grootte):
    obj = _maak(bpy.ops.mesh.primitive_cube_add, naam, (x, 0, grootte / 2), (grootte / 2, grootte / 2, grootte / 2))
    geef_materiaal(obj, toon_materiaal('karton', '#C9A26B'))
    return obj
```

- [ ] **Step 4: Shots voor H2**

`video/blender/shots/hoofdstuk-binask-eoa-1-h2.py`:

```python
"""Shots voor Binask H2. Elke functie bouwt een scène en geeft het formaat terug."""
import bpy
from bouw_lab import blokje, doos, labtafel, maatcilinder, pak_rijst, steen, weegschaal
from renderrecept import licht_en_camera

PANEEL = (1240, 1320)
BREED = (1728, 660)


def opening_blokjes(scene):
    labtafel()
    blokje('aluminium', '#C9CED6', -0.45)
    blokje('ijzer', '#5D6168', 0.45)
    licht_en_camera((0, -4.2, 1.6), (0, 0, 0.25), lens=50)
    return {'breedte': BREED[0], 'hoogte': BREED[1], 'frames': 1}


def massa_rijst(scene):
    labtafel(2.2, 1.6)
    weegschaal(0)
    pak_rijst(0)
    licht_en_camera((0, -2.6, 1.3), (0, 0, 0.35), lens=50)
    return {'breedte': PANEEL[0], 'hoogte': PANEEL[1], 'frames': 1}


def volume_dozen(scene):
    labtafel(2.2, 1.6)
    doos('grote-doos', -0.35, 0.7)
    doos('kleine-doos', 0.5, 0.3)
    licht_en_camera((0, -3.0, 1.4), (0, 0, 0.35), lens=50)
    return {'breedte': PANEEL[0], 'hoogte': PANEEL[1], 'frames': 1}


def onderdompel_steen(scene):
    labtafel(2.2, 1.6)
    onderdelen = maatcilinder(0, waterhoogte=0.75)
    water = onderdelen['water']
    # Zelfde tempo als de getekende maatcilinder in Remotion: de steen valt in
    # 14 frames, het water stijgt van frame 13 tot 58.
    stuk = steen((0, 0, 2.0))
    stuk.keyframe_insert('location', frame=1)
    stuk.location = (0, 0, 0.22)
    stuk.keyframe_insert('location', frame=15)
    water.keyframe_insert('scale', frame=13)
    water.scale = (1, 1, 1.25)
    water.keyframe_insert('scale', frame=58)
    licht_en_camera((0, -3.4, 1.5), (0, 0, 0.8), lens=50)
    return {'breedte': PANEEL[0], 'hoogte': PANEEL[1], 'frames': 90}


def dichtheid_weegschalen(scene):
    labtafel(2.4, 1.6)
    weegschaal(-0.55, breedte=0.8)
    weegschaal(0.55, breedte=0.8)
    blokje('aluminium', '#C9CED6', -0.55, grootte=0.34).location.z += 0.19
    blokje('ijzer', '#5D6168', 0.55, grootte=0.34).location.z += 0.19
    licht_en_camera((0, -3.0, 1.4), (0, 0, 0.3), lens=50)
    return {'breedte': PANEEL[0], 'hoogte': PANEEL[1], 'frames': 1}


SHOTS = {
    'opening-blokjes': opening_blokjes,
    'massa-rijst': massa_rijst,
    'volume-dozen': volume_dozen,
    'onderdompel-steen': onderdompel_steen,
    'dichtheid-weegschalen': dichtheid_weegschalen,
}
```

- [ ] **Step 5: CLI om één shot te renderen**

`video/blender/render-shot.py`:

```python
"""Rendert één shot zonder scherm.

  blender -b --factory-startup -P video/blender/render-shot.py -- \
    --hoofdstuk hoofdstuk-binask-eoa-1-h2 --shot opening-blokjes
"""
import importlib.util
import os
import sys

import bpy

HIER = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HIER)
import renderrecept  # noqa: E402

args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def optie(naam):
    return args[args.index(naam) + 1] if naam in args else ''


hoofdstuk = optie('--hoofdstuk')
shot = optie('--shot')
if not hoofdstuk or not shot:
    raise SystemExit('Gebruik: -- --hoofdstuk <id> --shot <naam>')

spec = importlib.util.spec_from_file_location('shots', os.path.join(HIER, 'shots', f'{hoofdstuk}.py'))
shots = importlib.util.module_from_spec(spec)
spec.loader.exec_module(shots)
if shot not in shots.SHOTS:
    raise SystemExit(f'Shot {shot} bestaat niet. Kies uit: {", ".join(shots.SHOTS)}')

scene = renderrecept.leeg_scene()
formaat = shots.SHOTS[shot](scene)
renderrecept.zet_render(scene, formaat['breedte'], formaat['hoogte'], formaat['frames'])
uit = os.path.join(HIER, '..', 'public', 'hoofdstukken', hoofdstuk, 'shots', shot)
os.makedirs(uit, exist_ok=True)
scene.render.filepath = os.path.join(os.path.abspath(uit), '####')
bpy.ops.render.render(animation=True)
print(f'KLAAR {shot}: {formaat["frames"]} frame(s) in {os.path.abspath(uit)}')
```

- [ ] **Step 6: Eerste render en beoordeling**

Run:
```bash
"/c/Program Files/Blender Foundation/Blender 5.2/blender.exe" -b --factory-startup -P video/blender/render-shot.py -- --hoofdstuk hoofdstuk-binask-eoa-1-h2 --shot opening-blokjes
```
Expected: `KLAAR opening-blokjes` en `shots/opening-blokjes/0001.png`.

Bekijk de PNG met Read. Controleer tegen het renderrecept:
- zwarte contouren rondom
- twee of drie lichtbanden, geen gladde schaduw
- twee even grote blokjes, het ijzer donkerder
- geen tekst

Klopt iets niet, pas dan alleen `renderrecept.py` of `bouw_lab.py` aan en render opnieuw. Wil je live meekijken, vraag Kevin dan de Blender-add-on aan te zetten (poort 9876) en gebruik `mcp__blender-lab__get_screenshot_of_window_as_image`.

- [ ] **Step 7: Overige shots**

Run voor `massa-rijst`, `volume-dozen`, `onderdompel-steen` en `dichtheid-weegschalen` hetzelfde commando met `--shot <naam>`. Bekijk van elke still de PNG.

Expected bij `onderdompel-steen`:
- frame 1: de steen hangt boven de cilinder
- frame 15: de steen ligt op de bodem
- frame 90: het water staat zichtbaar hoger dan bij frame 1

Bekijk dus de frames 1, 15 en 90.

- [ ] **Step 8: STOP. Kevin keurt de stijl**

Stuur de vijf stills (`0001.png`, en van de steen `0090.png`) met SendUserFile. Vraag of dit het comic-deel is dat hij wil. Pas aan tot hij ja zegt.

---

### Task 11: Portretten van Sami (betaald, met akkoord)

**Files:**
- Output: `video/public/sami/vragend.png`, `verbaasd.png`, `blij.png`, `nadenkend.png` (in git)

**Interfaces:**
- Produces: vier PNG's met transparante achtergrond, vierkant, hoofd en schouders, voor `SprekerLabel` en `SamiGroot`.

- [ ] **Step 1: Kosten opvragen**

Laad via ToolSearch `creative_generate_image`, `creative_edit_image`, `creative_get_flow_run_status`. Run `creative_generate_image` met `estimate_only: true`, `model_id: "gemini-3-pro-image"`, `generations_count: 1` en de prompt uit Step 3. Reken: 1 portret + 3 varianten + 4 keer `birefnet-v2-bg-removal`.

- [ ] **Step 2: STOP. Kevin akkoord op kosten en uiterlijk**

Leg Kevin de prompt en de kosten voor. Vraag of het uiterlijk van Sami goed is of anders moet. Ga pas verder na een ja.

- [ ] **Step 3: Eerste portret (vragend)**

`creative_create_flow` met naam `HELIX Sami portretten`. Daarna `creative_generate_image` met `flow_id`, `model_id: "gemini-3-pro-image"`, `generations_count: 1` en prompt:

```
Semi-realistic 3D comic character render of Sami, a 14-year-old girl, secondary school student in a science lab: white lab coat, clear safety goggles pushed up on her forehead, dark curly hair in a ponytail, friendly face. Expression: curious, asking a question, one eyebrow slightly raised. Head and shoulders portrait, square 1:1, facing the camera, slightly elevated viewpoint. Strong clean black outlines, rich tactile materials, warm key light from the upper left, cool teal fill light from the right, soft natural shadow. Plain flat warm cream background. No text, no letters, no logos, no hands in frame.
```

(Pas de uiterlijke kenmerken aan als Kevin dat in Step 2 vroeg.) Poll tot klaar, download naar `exports/video/sami-ruw/vragend.png` met `curl -L -o`, bekijk met Read en stuur naar Kevin.

- [ ] **Step 4: STOP. Kevin keurt het portret**

Pas bij een nee de prompt aan en genereer één nieuw portret. Ga pas door na een ja.

- [ ] **Step 5: Drie uitdrukkingen**

Per uitdrukking `creative_edit_image` met `connect_from: [<node_id van het goedgekeurde portret>]`, `model_id: "gemini-3-pro-image"`, `generations_count: 1`, dezelfde `flow_id`, prompt:

```
Same character, same outfit, same style, framing, lighting and background. Change only the facial expression to: <EXPRESSION>. No text, no hands.
```

Met `<EXPRESSION>`:
- `surprised, eyebrows up, mouth slightly open` (verbaasd)
- `happy, warm smile` (blij)
- `thinking, looking slightly up, hand not visible` (nadenkend)

Download naar `exports/video/sami-ruw/<uitdrukking>.png`.

- [ ] **Step 6: Achtergrond weg**

Per portret `creative_edit_image` met `connect_from: [<node_id>]`, `model_id: "birefnet-v2-bg-removal"`, `generations_count: 1`, prompt `remove background`. Download naar `video/public/sami/<uitdrukking>.png`. Controleer met ffprobe dat het PNG een alfakanaal heeft:

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=pix_fmt -of csv=p=0 video/public/sami/vragend.png
```
Expected: `rgba`.

---

### Task 12: Renderen en controleren (met akkoord)

**Files:**
- Create: `video/scripts/maak-ondertitels.mjs`, `video/scripts/scene-frames.mjs`
- Output: `exports/video/hoofdstuk-binask-eoa-1-h2/explainer.mp4`, `poster.png`, `ondertitels.nl.vtt`, `stills/<scene>.png`

**Interfaces:**
- Consumes: `bouwTijdlijn`, `maakVtt`, `controleerLengte` (Task 5); compositie (Task 9); shots (Task 10); portretten (Task 11); timing (Task 8).

- [ ] **Step 1: Ondertitelscript**

`video/scripts/maak-ondertitels.mjs`:

```js
/**
 * Schrijft ondertitels.nl.vtt uit draaiboek + timing.
 *   node video/scripts/maak-ondertitels.mjs --hoofdstuk <id>
 */
import fs from 'node:fs';
import path from 'node:path';
import { bouwTijdlijn } from '../lib/tijdlijn.mjs';
import { maakVtt } from '../lib/ondertitels.mjs';

const i = process.argv.indexOf('--hoofdstuk');
const hoofdstukId = i >= 0 ? process.argv[i + 1] : '';
if (!hoofdstukId) {
  console.error('Gebruik: node video/scripts/maak-ondertitels.mjs --hoofdstuk <id>');
  process.exit(1);
}
const map = path.resolve('video/public/hoofdstukken', hoofdstukId);
const lees = (naam) => JSON.parse(fs.readFileSync(path.join(map, naam), 'utf8'));
const vtt = maakVtt(bouwTijdlijn(lees('draaiboek.json'), lees('timing.json')));
const uitMap = path.resolve('exports/video', hoofdstukId);
fs.mkdirSync(uitMap, { recursive: true });
fs.writeFileSync(path.join(uitMap, 'ondertitels.nl.vtt'), vtt);
console.log(`Geschreven: ${path.relative(process.cwd(), path.join(uitMap, 'ondertitels.nl.vtt'))} (${vtt.split('\n\n').length - 1} cues)`);
```

- [ ] **Step 2: Frames per scène voor de controle**

`video/scripts/scene-frames.mjs`:

```js
/**
 * Toont per scène een frame in het midden en het posterframe, voor
 * `remotion still`.
 *   node video/scripts/scene-frames.mjs --hoofdstuk <id>
 */
import fs from 'node:fs';
import path from 'node:path';
import { bouwTijdlijn, controleerLengte } from '../lib/tijdlijn.mjs';

const i = process.argv.indexOf('--hoofdstuk');
const hoofdstukId = i >= 0 ? process.argv[i + 1] : '';
const map = path.resolve('video/public/hoofdstukken', hoofdstukId);
const lees = (naam) => JSON.parse(fs.readFileSync(path.join(map, naam), 'utf8'));
const tijdlijn = bouwTijdlijn(lees('draaiboek.json'), lees('timing.json'));
for (const scene of tijdlijn.scenes) {
  console.log(`${scene.id} ${scene.startFrame + Math.round(scene.duurFrames * 0.7)}`);
}
const opening = tijdlijn.scenes[0];
console.log(`poster ${opening.startFrame + Math.round(opening.duurFrames * 0.5)}`);
const lengte = controleerLengte(tijdlijn);
console.log(`lengte ${lengte.seconden.toFixed(1)}s ${lengte.ok ? 'ok' : 'TE LANG'}`);
```

- [ ] **Step 3: Stills renderen en bekijken**

Run:
```bash
node video/scripts/scene-frames.mjs --hoofdstuk hoofdstuk-binask-eoa-1-h2
```
Run voor elke regel `<scene> <frame>` (vanuit `video/`):
```bash
npx remotion still HelixExplainer ../exports/video/hoofdstuk-binask-eoa-1-h2/stills/<scene>.png --frame=<frame> --props='{"hoofdstukId":"hoofdstuk-binask-eoa-1-h2"}'
```
En de poster:
```bash
npx remotion still HelixExplainer ../exports/video/hoofdstuk-binask-eoa-1-h2/poster.png --frame=<posterframe> --props='{"hoofdstukId":"hoofdstuk-binask-eoa-1-h2"}'
```
Bekijk elke still met Read. Loop per still de QA-punten na (designsysteem p.23 en spec §9):
- titelvak en fasekenmerk
- één focus
- geen tekst in de comicbeelden
- getallen gelijk aan het draaiboek
- onderste zone leeg
- groen alleen bij het antwoord en bij KLAAR

- [ ] **Step 4: Video en ondertitels**

Run (vanuit `video/`):
```bash
npx remotion render HelixExplainer ../exports/video/hoofdstuk-binask-eoa-1-h2/explainer.mp4 --props='{"hoofdstukId":"hoofdstuk-binask-eoa-1-h2"}'
```
Run (vanuit de repo-root):
```bash
node video/scripts/maak-ondertitels.mjs --hoofdstuk hoofdstuk-binask-eoa-1-h2
ffprobe -v error -show_entries format=duration:stream=width,height,codec_name -of default=nw=1 exports/video/hoofdstuk-binask-eoa-1-h2/explainer.mp4
```
Expected: h264 1920×1080, duur ≤ 180 s; aac-audio aanwezig.

- [ ] **Step 5: STOP. Kevin bekijkt de video**

Stuur `explainer.mp4` en `ondertitels.nl.vtt` met SendUserFile. Vraag of de video naar HELIX mag. Zijn er correcties, voer ze uit in het draaiboek of de onderdelen, render opnieuw, en vraag opnieuw. Niets uploaden zonder ja.

---

### Task 13: Plaatsen in HELIX

**Files:**
- Create: `scripts/lib/explainerPlaatsing.mjs`, `scripts/lib/explainerPlaatsing.test.mjs`, `scripts/plaats-explainer-video.mjs`

**Interfaces:**
- Consumes: `buildPublicContentBlockSnapshot` (met Task 2), `validateContentBlockReadiness`, `normalizeContentBlockSettings`, `downloadUrl`, `cleanForFirestore`, `megabytes`, `PROJECT_ID`, `STORAGE_BUCKET` (bestaand).
- Produces: `explainerBlokId(hoofdstukId) -> string`; `bouwExplainerPlan({ hoofdstukId, paragraaf, blokken, titel, kijkvraag, tokens, maker }) -> { blok, snapshot, verschuivingen: Array<{ id, van, naar }>, paden: { video, ondertitels, poster }, fouten: string[] }`.

- [ ] **Step 1: Write the failing tests**

`scripts/lib/explainerPlaatsing.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { bouwExplainerPlan, explainerBlokId } from './explainerPlaatsing.mjs';

const basis = { vakId: 'vak', leerjaarId: 'lj', niveauId: 'nv', hoofdstukId: 'hoofdstuk-binask-eoa-1-h2', paragraafId: 'p24' };
const blokken = [
  { ...basis, id: 'b-theorie', type: 'theory', order: 1 },
  { ...basis, id: 'b-voorbeeld', type: 'example', order: 2 },
  { ...basis, id: 'b-samenvatting', type: 'summary', order: 3 },
  { ...basis, id: 'b-check', type: 'theory', order: 4 }
];
const invoer = {
  hoofdstukId: 'hoofdstuk-binask-eoa-1-h2',
  paragraaf: { id: 'p24', hoofdstukId: 'hoofdstuk-binask-eoa-1-h2' },
  blokken,
  titel: 'Uitlegvideo: massa, volume en dichtheid',
  kijkvraag: 'Hoe meet je het volume van een steen?',
  tokens: { video: 't1', ondertitels: 't2', poster: 't3' },
  maker: 'scripts/plaats-explainer-video.mjs'
};

test('bouwExplainerPlan zet de video vóór de Samenvatting en schuift de rest op', () => {
  const plan = bouwExplainerPlan(invoer);
  assert.equal(plan.blok.id, explainerBlokId('hoofdstuk-binask-eoa-1-h2'));
  assert.equal(plan.blok.id, 'block-binask-eoa-1-h2-explainer-video');
  assert.equal(plan.blok.order, 3);
  assert.equal(plan.blok.type, 'media');
  assert.equal(plan.blok.status, 'published');
  assert.deepEqual(plan.verschuivingen, [{ id: 'b-samenvatting', van: 3, naar: 4 }, { id: 'b-check', van: 4, naar: 5 }]);
  assert.equal(plan.blok.content.mediaKind, 'video');
  assert.match(plan.blok.content.mediaUrl, /explainers%2Fhoofdstuk-binask-eoa-1-h2%2Fexplainer\.mp4\?alt=media&token=t1$/);
  assert.equal(plan.blok.content.ondertitels[0].taal, 'nl');
  assert.match(plan.blok.content.ondertitels[0].url, /token=t2$/);
  assert.equal(plan.snapshot.content.ondertitels.length, 1);
  assert.deepEqual(plan.fouten, []);
});

test('bouwExplainerPlan is idempotent: een bestaand videoblok houdt zijn plek', () => {
  const metVideo = [...blokken.map((b) => (b.order >= 3 ? { ...b, order: b.order + 1 } : b)), { ...basis, id: 'block-binask-eoa-1-h2-explainer-video', type: 'media', order: 3 }];
  const plan = bouwExplainerPlan({ ...invoer, blokken: metVideo });
  assert.equal(plan.blok.order, 3);
  assert.deepEqual(plan.verschuivingen, []);
});

test('bouwExplainerPlan weigert een paragraaf zonder Samenvatting of uit een ander hoofdstuk', () => {
  assert.throws(() => bouwExplainerPlan({ ...invoer, blokken: blokken.filter((b) => b.type !== 'summary') }), /geen Samenvatting/);
  assert.throws(() => bouwExplainerPlan({ ...invoer, paragraaf: { id: 'p24', hoofdstukId: 'ander' } }), /hoort niet bij/);
});

test('bouwExplainerPlan ontsnapt html in de kijkvraag', () => {
  const plan = bouwExplainerPlan({ ...invoer, kijkvraag: 'Is 5 < 7 & waar?' });
  assert.match(plan.blok.content.html, /5 &lt; 7 &amp; waar/);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test scripts/lib/explainerPlaatsing.test.mjs`
Expected: FAIL (module bestaat niet).

- [ ] **Step 3: Write the implementation**

`scripts/lib/explainerPlaatsing.mjs`:

```js
/**
 * Puur plan voor het plaatsen van een explainervideo: het media-blok direct
 * vóór de Samenvatting van een paragraaf, met ondertitels en poster. Geen
 * Firebase hier; scripts/plaats-explainer-video.mjs doet uploaden en schrijven.
 */
import { buildPublicContentBlockSnapshot } from '../../src/lib/publicContentBlockView.js';
import { validateContentBlockReadiness } from '../../src/lib/contentReadiness.js';
import { normalizeContentBlockSettings } from '../../src/lib/contentBlockUtils.js';
import { downloadUrl } from './slidedeckPlaatsing.mjs';

export const explainerBlokId = (hoofdstukId) => `block-${hoofdstukId.replace(/^hoofdstuk-/, '')}-explainer-video`;
export const explainerPad = (hoofdstukId, bestand) => `explainers/${hoofdstukId}/${bestand}`;

const ontsnap = (tekst) => String(tekst).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function bouwExplainerPlan({ hoofdstukId, paragraaf, blokken, titel, kijkvraag, tokens, maker }) {
  if (paragraaf.hoofdstukId !== hoofdstukId) {
    throw new Error(`Paragraaf ${paragraaf.id} hoort niet bij ${hoofdstukId}.`);
  }
  const gesorteerd = [...blokken].sort((a, b) => (a.order || 0) - (b.order || 0));
  const samenvatting = gesorteerd.find((b) => b.type === 'summary');
  if (!samenvatting) throw new Error(`Paragraaf ${paragraaf.id} heeft geen Samenvatting-blok.`);

  const id = explainerBlokId(hoofdstukId);
  const bestaand = gesorteerd.find((b) => b.id === id);
  const paden = {
    video: explainerPad(hoofdstukId, 'explainer.mp4'),
    ondertitels: explainerPad(hoofdstukId, 'ondertitels.nl.vtt'),
    poster: explainerPad(hoofdstukId, 'poster.png')
  };

  const order = bestaand ? bestaand.order : samenvatting.order;
  const verschuivingen = bestaand
    ? []
    : gesorteerd
      .filter((b) => (b.order || 0) >= samenvatting.order)
      .map((b) => ({ id: b.id, van: b.order || 0, naar: (b.order || 0) + 1 }));

  const blok = {
    id,
    vakId: samenvatting.vakId,
    leerjaarId: samenvatting.leerjaarId,
    niveauId: samenvatting.niveauId,
    hoofdstukId,
    paragraafId: paragraaf.id,
    type: 'media',
    order,
    title: titel,
    status: 'published',
    isArchived: false,
    linkedVraagId: null,
    settings: normalizeContentBlockSettings({}, 'media'),
    content: {
      html: `<p><strong>Kijkvraag:</strong> ${ontsnap(kijkvraag)}</p>`,
      mediaKind: 'video',
      mediaUrl: downloadUrl(paden.video, tokens.video),
      storagePath: paden.video,
      fileName: 'explainer.mp4',
      contentType: 'video/mp4',
      thumbnailUrl: downloadUrl(paden.poster, tokens.poster),
      caption: '',
      altText: titel,
      crops: [],
      ondertitels: [
        { taal: 'nl', label: 'Nederlands', url: downloadUrl(paden.ondertitels, tokens.ondertitels), storagePath: paden.ondertitels }
      ]
    },
    createdBy: maker
  };

  const fouten = validateContentBlockReadiness(blok).errors.map((issue) => `${blok.id}: ${issue.message}`);
  return { blok, snapshot: buildPublicContentBlockSnapshot(blok), verschuivingen, paden, fouten };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test scripts/lib/explainerPlaatsing.test.mjs`
Expected: PASS (vier tests).

- [ ] **Step 5: Het plaatsingsscript**

`scripts/plaats-explainer-video.mjs`:

```js
/**
 * Zet een explainervideo in HELIX: MP4, ondertitels en poster naar Storage,
 * het media-blok direct vóór de Samenvatting van de gekozen paragraaf, de
 * Samenvatting en alles erna één plek op, plus de leerlingkopie.
 *
 *   node scripts/plaats-explainer-video.mjs --hoofdstuk <id> --paragraaf <id>            # dry run
 *   node scripts/plaats-explainer-video.mjs --hoofdstuk <id> --paragraaf <id> --apply    # uploaden + schrijven
 *
 * Opties:
 *   --bron <map>     standaard exports/video/<hoofdstukId>
 *   --maker <uid>    standaard deze scriptnaam
 *
 * Titel en kijkvraag komen uit video/public/hoofdstukken/<id>/draaiboek.json.
 * Opnieuw draaien overschrijft het blok en schuift niets dubbel op.
 */
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';

import { bouwExplainerPlan } from './lib/explainerPlaatsing.mjs';
import { PROJECT_ID, STORAGE_BUCKET, cleanForFirestore, megabytes } from './lib/slidedeckPlaatsing.mjs';

const SCRIPT_NAAM = 'scripts/plaats-explainer-video.mjs';
const args = process.argv.slice(2);
const apply = args.includes('--apply');
const optie = (naam, standaard = '') => {
  const i = args.indexOf(naam);
  return i >= 0 && args[i + 1] ? args[i + 1] : standaard;
};

const hoofdstukId = optie('--hoofdstuk');
const paragraafId = optie('--paragraaf');
if (!hoofdstukId || !paragraafId) {
  console.error('Gebruik: node scripts/plaats-explainer-video.mjs --hoofdstuk <id> --paragraaf <id> [--apply]');
  process.exit(1);
}
const bron = path.resolve(optie('--bron', path.join('exports/video', hoofdstukId)));
const maker = optie('--maker', SCRIPT_NAAM);
const draaiboek = JSON.parse(fs.readFileSync(path.resolve('video/public/hoofdstukken', hoofdstukId, 'draaiboek.json'), 'utf8'));
if (draaiboek.doelParagraafId !== paragraafId) {
  console.error(`Let op: het draaiboek noemt ${draaiboek.doelParagraafId} als doelparagraaf, niet ${paragraafId}. Stop.`);
  process.exit(1);
}

const BESTANDEN = [
  { sleutel: 'video', naam: 'explainer.mp4', type: 'video/mp4' },
  { sleutel: 'ondertitels', naam: 'ondertitels.nl.vtt', type: 'text/vtt' },
  { sleutel: 'poster', naam: 'poster.png', type: 'image/png' }
];
for (const bestand of BESTANDEN) {
  bestand.pad = path.join(bron, bestand.naam);
  if (!fs.existsSync(bestand.pad)) {
    console.error(`Bestand ontbreekt: ${bestand.pad}`);
    process.exit(1);
  }
  bestand.grootte = fs.statSync(bestand.pad).size;
  bestand.token = randomUUID();
}

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');
const { getStorage } = requireFromFunctions('firebase-admin/storage');
if (getApps().length === 0) {
  initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID, storageBucket: STORAGE_BUCKET });
}
const db = getFirestore();

const paragraafSnap = await db.collection('paragraaf').doc(paragraafId).get();
if (!paragraafSnap.exists) {
  console.error(`Paragraaf ${paragraafId} bestaat niet.`);
  process.exit(1);
}
const paragraaf = { id: paragraafSnap.id, ...paragraafSnap.data() };
const blokken = (await db.collection('contentBlocks').where('paragraafId', '==', paragraafId).get())
  .docs.map((d) => ({ id: d.id, ...d.data() })).filter((b) => b.isArchived !== true);

const tokens = Object.fromEntries(BESTANDEN.map((b) => [b.sleutel, b.token]));
const plan = bouwExplainerPlan({
  hoofdstukId,
  paragraaf,
  blokken,
  titel: `Uitlegvideo: ${draaiboek.titel.toLowerCase()}`,
  kijkvraag: draaiboek.kijkvraag,
  tokens,
  maker
});
if (plan.fouten.length) {
  console.error(plan.fouten.join('\n'));
  process.exit(1);
}

console.log(`Paragraaf ${paragraaf.code || ''} ${paragraaf.title || paragraaf.titel || ''} (${paragraafId}), ${blokken.length} blokken:`);
for (const b of [...blokken].sort((a, c) => (a.order || 0) - (c.order || 0))) {
  const schuif = plan.verschuivingen.find((v) => v.id === b.id);
  console.log(`  ${String(b.order).padStart(3)}${schuif ? ` -> ${schuif.naar}` : '     '}  ${b.type.padEnd(8)} ${b.title}`);
}
console.log(`Nieuw of bijgewerkt: ${String(plan.blok.order).padStart(3)}  media    ${plan.blok.title}  [${plan.blok.id}]`);
for (const bestand of BESTANDEN) console.log(`Upload ${bestand.naam} (${megabytes(bestand.grootte)}) -> ${plan.paden[bestand.sleutel]}`);

const klassen = (await db.collection('klassen').where('enabledParagrafen', 'array-contains', paragraafId).get()).docs;
const klasUpdates = [];
for (const klas of klassen) {
  const data = klas.data() || {};
  const selectie = data.enabledContentBlocks?.[paragraafId];
  const eigen = Array.isArray(selectie);
  console.log(`Klas ${data.naam || data.name || klas.id}: ${eigen ? `eigen blokselectie (${selectie.length}), video ${selectie.includes(plan.blok.id) ? 'staat er al in' : 'wordt toegevoegd'}` : 'ziet alle blokken'}`);
  if (eigen && !selectie.includes(plan.blok.id)) klasUpdates.push(klas.id);
}

if (!apply) {
  console.log('\nDry run: niets geschreven. Draai met --apply om te uploaden en te schrijven.');
  process.exit(0);
}

// Back-up van alles wat verandert, vóór de eerste schrijfactie.
const backupMap = path.resolve('exports/reset-backups');
fs.mkdirSync(backupMap, { recursive: true });
const raakt = [plan.blok.id, ...plan.verschuivingen.map((v) => v.id)];
const backup = { gemaakt: new Date().toISOString(), contentBlocks: {}, publicContentBlocks: {}, klassen: {} };
for (const id of raakt) {
  const prive = await db.collection('contentBlocks').doc(id).get();
  const publiek = await db.collection('publicContentBlocks').doc(id).get();
  if (prive.exists) backup.contentBlocks[id] = prive.data();
  if (publiek.exists) backup.publicContentBlocks[id] = publiek.data();
}
for (const klasId of klasUpdates) {
  backup.klassen[klasId] = (await db.collection('klassen').doc(klasId).get()).data()?.enabledContentBlocks?.[paragraafId] || null;
}
const backupPad = path.join(backupMap, `explainer-${hoofdstukId}-${Date.now()}.json`);
fs.writeFileSync(backupPad, JSON.stringify(backup, null, 2));
console.log(`\nBack-up: ${backupPad}`);

const bucket = getStorage().bucket();
for (const bestand of BESTANDEN) {
  process.stdout.write(`Uploaden ${bestand.naam}... `);
  await bucket.file(plan.paden[bestand.sleutel]).save(fs.readFileSync(bestand.pad), {
    resumable: true,
    contentType: bestand.type,
    metadata: { cacheControl: 'public, max-age=86400', metadata: { firebaseStorageDownloadTokens: bestand.token } }
  });
  console.log('klaar');
}

const batch = db.batch();
batch.set(db.collection('contentBlocks').doc(plan.blok.id), cleanForFirestore({
  ...plan.blok, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp()
}));
batch.set(db.collection('publicContentBlocks').doc(plan.snapshot.id), cleanForFirestore({
  ...plan.snapshot, updatedAt: FieldValue.serverTimestamp()
}));
for (const schuif of plan.verschuivingen) {
  batch.update(db.collection('contentBlocks').doc(schuif.id), { order: schuif.naar, updatedAt: FieldValue.serverTimestamp() });
  if (backup.publicContentBlocks[schuif.id]) {
    batch.update(db.collection('publicContentBlocks').doc(schuif.id), { order: schuif.naar, updatedAt: FieldValue.serverTimestamp() });
  }
}
for (const klasId of klasUpdates) {
  batch.update(db.collection('klassen').doc(klasId), { [`enabledContentBlocks.${paragraafId}`]: FieldValue.arrayUnion(plan.blok.id) });
}
await batch.commit();
console.log(`Geschreven: 1 videoblok, 1 leerlingkopie, ${plan.verschuivingen.length} verschuiving(en), ${klasUpdates.length} klasselectie(s).`);
process.exit(0);
```

- [ ] **Step 6: Lint en dry run**

Run:
```bash
npx eslint scripts/plaats-explainer-video.mjs scripts/lib/explainerPlaatsing.mjs scripts/lib/explainerPlaatsing.test.mjs
node scripts/plaats-explainer-video.mjs --hoofdstuk hoofdstuk-binask-eoa-1-h2 --paragraaf paragraaf-binask-eoa-1-2-4
```
Expected: lint schoon (scripts vallen onder `**/*.{js,jsx}`? `.mjs` niet; meldt eslint "no matching configuration", dan is dat geen fout). De dry run toont 2.4 met de Samenvatting en wat erna komt `-> +1`, de drie uploads en de EOA-klassen.

---

### Task 14: Live zetten en controleren als leerling (met akkoord)

**Files:**
- geen nieuwe

- [ ] **Step 1: Volledige controle**

Run:
```bash
npx eslint src/lib/mediaUtils.js src/lib/publicContentBlockView.js src/components/media/MediaRenderer.jsx eslint.config.js
node --test src/lib/
node --test video/lib/
node --test scripts/lib/explainerPlaatsing.test.mjs
npm run build
```
Expected: alles schoon en PASS.

- [ ] **Step 2: STOP. Kevin akkoord op deploy**

Vraag: "Mag ik de ondertitelspeler deployen met `npx vercel --prod --yes`?" Deploy alleen bij ja. Na de deploy: `node scripts/handoff-stand.mjs --kort` en noteer de bundelnaam van de live site.

- [ ] **Step 3: STOP. Kevin akkoord op plaatsen**

Laat Kevin de dry-run-uitvoer uit Task 13 Step 6 zien. Bij ja:
```bash
node scripts/plaats-explainer-video.mjs --hoofdstuk hoofdstuk-binask-eoa-1-h2 --paragraaf paragraaf-binask-eoa-1-2-4 --apply
```

- [ ] **Step 4: Controle als testleerling**

Open `https://dvdacapo.vercel.app/admin/testen` in de browser pane (Kevin is daar ingelogd als admin; vraag hem in te loggen als dat niet zo is). Start de testsessie voor ER3L1A. Ga naar Binask, hoofdstuk 2, paragraaf 2.4. Controleer met read_page en javascript_tool:
```js
const v = document.querySelector('video'); const t = v?.querySelector('track');
({ src: v?.currentSrc?.slice(0, 60), crossOrigin: v?.crossOrigin, track: t?.src?.slice(0, 60), mode: v?.textTracks?.[0]?.mode })
```
Expected: `crossOrigin: "anonymous"`, een track-url, `mode: "showing"`. Speel 10 seconden af en maak een screenshot met zichtbare ondertitel. Controleer dat het blok direct boven de Samenvatting staat. Herhaal kort voor ER3L2A. Sluit de testsessie via "Terug naar beheer".

---

### Task 15: De skill en de handoff

**Files:**
- Create: `.claude/skills/explainer-helix-maker/SKILL.md`
- Create: `.claude/skills/explainer-helix-maker/references/stem-en-stijl.md`, `draaiboek-formaat.md`, `blender-renderrecept.md`, `plaatsing.md`
- Modify: `docs/HANDOFF.md` (nieuwe subparagraaf in §5), `scripts/handoff-stand.mjs:90-100`

- [ ] **Step 1: SKILL.md**

`.claude/skills/explainer-helix-maker/SKILL.md`:

````markdown
---
name: explainer-helix-maker
description: Maakt van de lesstof van een HELIX-hoofdstuk een Nederlandse, geanimeerde uitlegvideo (explainer) van maximaal 3 minuten in de HELIX-stijl, met vaste stemmen (docent Thomas en leerling Sami via ElevenLabs), 3D-comicbeelden uit Blender, getekende metingen en formules in Remotion, en een los ondertitelspoor; zet de video daarna vóór de Samenvatting van de gekozen paragraaf. Gebruik deze skill zodra Kevin vraagt om een explainer, uitlegvideo, animatie of filmpje bij een hoofdstuk of paragraaf, voor Binask of Digitale vaardigheden, ook als hij alleen zegt "maak hier een video van".
---

# Een explainervideo maken voor een HELIX-hoofdstuk

Je maakt één video per hoofdstuk, maximaal 3:00, voor leerlingen die zelfstandig
kijken. De EOA-leerlingen leren nog Nederlands: rustig tempo, A2/B1, korte zinnen.
Elke video ziet er hetzelfde uit en klinkt hetzelfde. Dat is het hele punt van
deze skill: wijk niet af van de vaste stem, stijl en volgorde.

Werk in `C:\Projecten\helix leerplatform`. Ontwerp en achtergrond:
`docs/superpowers/specs/2026-10-02-explainer-helix-maker-design.md`.

## De volgorde

1. Lesstof lezen
2. Draaiboek en doelparagraaf, **akkoord Kevin**
3. Kosten stemmen, **akkoord Kevin**
4. Stemmen opnemen en timing meten
5. Comic-shots in Blender (nieuwe voorwerpen eenmalig in de bibliotheek)
6. Samenvoegen in Remotion en bekijken
7. Renderen, stills controleren, **akkoord Kevin op de video**
8. Plaatsen: dry run, **akkoord Kevin**, dan `--apply`
9. Controleren als testleerling

Sla stap 2, 3, 7 of 8 nooit over. Een stem- of beeldgeneratie kost geld, en een
fout in de video zien honderd leerlingen.

## 1. Lesstof lezen

```bash
node video/scripts/lees-hoofdstuk.mjs --hoofdstuk <hoofdstukId>
```

Dit leest Firestore (de echte stand, niet de seed) en schrijft
`video/public/hoofdstukken/<id>/lesstof.json`. Lees dat bestand helemaal. Haal
de begrippen, de voorbeelden en hun getallen eruit. Verzin geen nieuwe getallen:
neem de voorbeelden uit de lesstof over.

## 2. Draaiboek

Schrijf `video/public/hoofdstukken/<id>/draaiboek.json` volgens
`references/draaiboek-formaat.md`. Opbouw: opening (vraag van Sami), één scène
per kernbegrip, één CHECK met een rekenopgave uit de lesstof, één KLAAR. Ongeveer
350 woorden.

Controleer:

```bash
node video/scripts/controleer-draaiboek.mjs --hoofdstuk <id>
```

Leg Kevin het draaiboek voor zoals een docent het leest: per scène tijd, beeld,
en wie wat zegt. Noem de voorgestelde doelparagraaf (`lees-hoofdstuk` geeft die;
regel: de herhalingsparagraaf, anders de laatste gewone paragraaf met een
Samenvatting, nooit plus of uitdaging). Wacht op akkoord.

**Wat misgaat als je dit overslaat:** een video met een fout getal moet opnieuw
ingesproken worden, en dat kost credits.

## 3 en 4. Stemmen

Zie `references/stem-en-stijl.md` voor de stem-id's en het model. Altijd eerst
`estimate_only`, dan Kevin, dan pas opnemen. Eén opname per regel,
`generations_count: 1`. Download elke opname naar `audio/<regelId>.mp3`. Daarna:

```bash
node video/scripts/meet-timing.mjs --hoofdstuk <id>
```

Exit 2 betekent te lang: schrap eerst een bijzin in de langste scène, niet in de
CHECK.

## 5. Comic-shots

Zie `references/blender-renderrecept.md`. Maak `video/blender/shots/<id>.py` met
één functie per `shot.naam` uit het draaiboek. Render elk shot:

```bash
"/c/Program Files/Blender Foundation/Blender 5.2/blender.exe" -b --factory-startup -P video/blender/render-shot.py -- --hoofdstuk <id> --shot <naam>
```

Bekijk elke render. Geen tekst, geen getallen, geen schaalverdeling in een
render: die horen in de getekende laag.

## 6 en 7. Samenvoegen, renderen, controleren

```bash
cd video && npx remotion studio --no-open
```

Bekijk elke scène. Dan:

```bash
node video/scripts/scene-frames.mjs --hoofdstuk <id>
cd video && npx remotion still HelixExplainer ../exports/video/<id>/stills/<scene>.png --frame=<frame> --props='{"hoofdstukId":"<id>"}'
cd video && npx remotion render HelixExplainer ../exports/video/<id>/explainer.mp4 --props='{"hoofdstukId":"<id>"}'
cd video && npx remotion still HelixExplainer ../exports/video/<id>/poster.png --frame=<posterframe> --props='{"hoofdstukId":"<id>"}'
node video/scripts/maak-ondertitels.mjs --hoofdstuk <id>
```

Bekijk elke still tegen de QA-lijst in `references/stem-en-stijl.md`. Stuur
Kevin de MP4 en wacht op zijn ja.

## 8. Plaatsen

Zie `references/plaatsing.md`.

```bash
node scripts/plaats-explainer-video.mjs --hoofdstuk <id> --paragraaf <doelParagraafId>
```

Laat Kevin de dry run zien. Bij ja: zelfde commando met `--apply`.

## 9. Controleren

Testleerling van de klas via `/admin/testen`: video staat direct boven de
Samenvatting, speelt af, ondertitels staan aan en kunnen uit.

## Rapporteren

Meld Kevin: lengte, kosten (stemmen en beelden), paragraaf, welke klassen het
zien, en wat er buiten git staat (`exports/video/<id>/`, de audio en shots).
Commit niets zonder dat hij erom vraagt.
````

- [ ] **Step 2: references/stem-en-stijl.md**

````markdown
# Stem en stijl: vast voor elke explainer

## Stemmen (ElevenLabs-MCP)

| Rol | Naam | voice_id |
| --- | --- | --- |
| Docent | Thomas | `fIYdULbypRf7uZYX6u0T` |
| Sami (leerling, meisje) | Mette | `L8qZJEV989Y3D0xnaVCa` |

- Model `eleven_v4`, altijd `generations_count: 1`.
- Eerst `creative_create_flow`, daarna alle opnames met die `flow_id`.
- `creative_generate_speech`, dan `creative_get_flow_run_status` pollen tot klaar.
- Nooit dezelfde aanroep herhalen als retry; lees eerst de status.
- `uitspraak` is wat de stem zegt (getallen voluit, "kubieke centimeter", "ro",
  "em", "vee"). `tekst` is wat in de ondertitel staat ("106,8", "cm³", "ρ").
- Audio-tags spaarzaam: `[curious]` bij een vraag van Sami, `[warmly]` of
  `[happy]` bij een afsluiter.
- Zeg nooit "BiNaSk" hardop; gebruik "in de les".

## Beeld

- 1920 × 1080, 30 fps. Onderste zone vanaf y = 884 leeg (ondertitels).
- Paper `#FFF7E8`, ink `#0B0D0F`, geel titelvak `#FFD33D` met 8 px zwarte rand.
- Blauw `#087EB5` voor metingen en formules. Groen `#2E9D63` alleen voor het
  juiste antwoord bij CHECK en voor KLAAR.
- Bangers voor koppen (max zes woorden, hoofdletters). Atkinson Hyperlegible
  Next voor al het andere.
- Indelingen: FOCUS (groot beeld), SPLIT (comic links, getekend midden,
  kernwoorden rechts), STATUS (CHECK, KLAAR).
- Sami: vaste portretten in `video/public/sami/` (vragend, verbaasd, blij,
  nadenkend). Nooit opnieuw genereren voor een nieuw hoofdstuk.
- Geen muziek.

## Ondertitels

- WebVTT, één of meer cues per regel, hooguit 2 regels van 42 tekens, spreker
  als `<v Docent>` of `<v Sami>`.
- Los spoor naast de video, standaard aan in de HELIX-speler.

## QA per still (designsysteem p.23)

- Titelvak met fasekenmerk, kop in Bangers.
- Eén cognitieve opdracht per scène.
- Geen tekst of getal in een comicbeeld.
- Elk getal gelijk aan het draaiboek en de lesstof.
- Onderste zone leeg.
- Groen alleen bij het antwoord en bij KLAAR.
- Lengte ≤ 180 s.
````

- [ ] **Step 3: references/draaiboek-formaat.md**

````markdown
# Draaiboekformaat

Bestand: `video/public/hoofdstukken/<hoofdstukId>/draaiboek.json`. Het volledige
voorbeeld is dat van Binask H2 in dezelfde map onder
`hoofdstuk-binask-eoa-1-h2`.

## Bovenste niveau

| Veld | Betekenis |
| --- | --- |
| `hoofdstukId` | Firestore-id van het hoofdstuk |
| `doelParagraafId` | paragraaf waar de video vóór de Samenvatting komt |
| `titel` | onderwerp, komt in de bloktitel "Uitlegvideo: ..." |
| `kijkvraag` | één vraag die boven de video staat |
| `meta` | rechts in het titelvak, bijvoorbeeld "Binask H2" |
| `scenes` | lijst van scènes |

## Scène

| Veld | Betekenis |
| --- | --- |
| `id` | uniek, bijvoorbeeld `s3` |
| `kop` | max zes woorden, hoofdletters |
| `fase` | `KIJK`, `CHECK` of `KLAAR` |
| `indeling` | `FOCUS`, `SPLIT` of `STATUS` |
| `shot` | `{ naam, frames, startBij? }`; verplicht bij FOCUS en SPLIT |
| `geluiden` | optioneel `[{ bestand, bij, na }]`; `na` in seconden na het begin van regel `bij` |
| `kernwoorden` | `[{ tekst, bij, accent? }]`, rechts in SPLIT |
| `getekend` | getekende onderdelen, zie hieronder |
| `regels` | wie zegt wat |

## Regel

`{ id, spreker: "docent"|"sami", tekst, uitspraak, samiUitdrukking?, pauzeNa? }`.
`pauzeNa` in seconden; de CHECK-vraag krijgt 4.

## Getekende onderdelen

`bij` is altijd een regel-id in dezelfde scène: het onderdeel start bij het begin
van die regel. `tot` laat het verdwijnen bij het begin van een latere regel.

| type | velden |
| --- | --- |
| `weegschaal` | `items: [{ label, waarde }]`, `eenheid` |
| `maatcilinder` | `van`, `naar?`, `max`, `stap`, `eenheid`, `stijgBij?`, `labels?`, `oog?` |
| `formule` | `regels: [{ tekst, bij }]`; de eerste regel is groot en blauw |
| `driehoek` | formuledriehoek met afdekken |
| `opgave` | `vraag[]`, `aftelBij`, `aftelSeconden`, `antwoord[]`, `antwoordBij` |
| `kaarten` | `kaarten: [{ kop, regels[] }]` |

Een nieuw type: voeg een component toe in `video/src/onderdelen/`, een `case` in
`video/src/Scene.tsx`, en de velden die naar regels verwijzen in
`video/lib/draaiboek.mjs`.
````

- [ ] **Step 4: references/blender-renderrecept.md**

````markdown
# Blender: renderrecept en labbibliotheek

- `video/blender/renderrecept.py`: EEVEE, cel-shading (Shader to RGB met drie
  harde banden: teal schaduw, neutraal, warm licht), zwarte contour met een
  omgekeerde schil (Solidify, `use_flip_normals`, zwart materiaal met backface
  culling), warm hooglicht en teal invullicht, transparante achtergrond,
  view transform Standard.
- `video/blender/bouw_lab.py`: de vaste voorwerpen als code (labtafel, blokje,
  maatcilinder met water, steen, weegschaal, pak rijst, doos).
- `video/blender/shots/<hoofdstukId>.py`: per hoofdstuk een `SHOTS`-dict van
  shotnaam naar functie die de scène bouwt en `{ breedte, hoogte, frames }`
  teruggeeft. Paneel in SPLIT: 1240 × 1320. Breed in FOCUS: 1728 × 660.
- `video/blender/render-shot.py`: rendert één shot zonder scherm naar
  `video/public/hoofdstukken/<id>/shots/<naam>/####.png`.

## Een voorwerp toevoegen

1. Schrijf een functie in `bouw_lab.py` met `_maak(...)` en `geef_materiaal(...)`.
2. Kies een kleur als hex; gebruik geen tekst of getallen op het voorwerp.
3. Render een proefshot en bekijk het.

## Regels

- Geen tekst, geen getallen, geen schaalverdeling in een render.
- Camera recht voor of iets van boven, lens 50 mm.
- Aantallen en verhoudingen controleren: twee "even grote" blokjes zijn echt even
  groot.
- Live meekijken kan met de Blender-MCP (`blender-lab`, poort 9876) als Kevin de
  add-on aan zet. Renderen werkt ook zonder.
````

- [ ] **Step 5: references/plaatsing.md**

````markdown
# Plaatsing in HELIX

`scripts/plaats-explainer-video.mjs --hoofdstuk <id> --paragraaf <id> [--apply]`

- Leest `exports/video/<id>/explainer.mp4`, `ondertitels.nl.vtt`, `poster.png`.
- Controleert dat `--paragraaf` gelijk is aan `doelParagraafId` in het draaiboek
  en dat de paragraaf een Samenvatting heeft.
- Uploadt naar `explainers/<hoofdstukId>/` met een download-token.
- Zet blok `block-<hoofdstuk zonder "hoofdstuk-">-explainer-video` (type `media`,
  `status: published`) op de plek van de Samenvatting; de Samenvatting en alles
  erna schuift één plek op, in `contentBlocks` en `publicContentBlocks`.
- Voegt de id toe aan `enabledContentBlocks[paragraafId]` van klassen met een
  eigen blokselectie; anders zien die klassen de video niet.
- Zonder `--apply`: dry run. Met `--apply`: eerst een back-up in
  `exports/reset-backups/`.
- Opnieuw draaien overschrijft het blok en schuift niets dubbel op.

De speler (`src/components/media/MediaRenderer.jsx`) toont het veld
`content.ondertitels` als `<track>`; de leerlingkopie neemt het mee
(`src/lib/publicContentBlockView.js`). De bucket-CORS (`scripts/zet-storage-cors.mjs`)
staat GET al toe voor `dvdacapo.vercel.app` en `localhost:5173`.
````

- [ ] **Step 6: HANDOFF.md**

Voeg in `docs/HANDOFF.md` direct vóór `### Presentaties - 16 september 2026` toe:

```markdown
### Explainervideo's - 2 oktober 2026

Per hoofdstuk één uitlegvideo van max 3:00, gemaakt met de skill
`/explainer-helix-maker` (`.claude/skills/explainer-helix-maker/`). Ontwerp:
`docs/superpowers/specs/2026-10-02-explainer-helix-maker-design.md`.

- Vaste stemmen: docent Thomas, leerling Sami (Mette), `eleven_v4`, via de
  ElevenLabs-MCP. Portretten van Sami in `video/public/sami/`.
- Gereedschap in `video/` (Remotion, Blender-scripts). Draaiboek en timing per
  hoofdstuk in `video/public/hoofdstukken/<id>/` (in git); audio en shots daar
  buiten git; eindresultaat in `exports/video/<id>/` (buiten git).
- De video staat als media-blok direct vóór de Samenvatting van de gekozen
  paragraaf, met een los ondertitelspoor.
- Eerste video: Binask H2, in 2.4 Herhalingsopdrachten.
```

- [ ] **Step 7: handoff-stand.mjs**

In `scripts/handoff-stand.mjs`, direct na de regel `console.log('Firestore, Storage en de bucketinstelling staan per definitie buiten git. Zie hieronder.');`:

```js
const explainerSkill = fs.existsSync(path.resolve('.claude/skills/explainer-helix-maker/SKILL.md'));
console.log(`skill explainer-helix-maker: ${explainerSkill ? 'in de repo (.claude/skills/)' : 'ONTBREEKT in de repo'}`);
const explainerMap = path.resolve('video/public/hoofdstukken');
if (fs.existsSync(explainerMap)) {
  for (const id of fs.readdirSync(explainerMap)) {
    const heeft = (naam) => fs.existsSync(path.join(explainerMap, id, naam));
    const mp4 = fs.existsSync(path.resolve('exports/video', id, 'explainer.mp4'));
    console.log(`  explainer ${id}: draaiboek ${heeft('draaiboek.json') ? 'ja' : 'nee'}, timing ${heeft('timing.json') ? 'ja' : 'nee'}, mp4 ${mp4 ? 'ja (lokaal)' : 'nee'}`);
  }
}
```

- [ ] **Step 8: Skill-creator laat de skill nalopen**

Roep de skill `anthropic-skills:skill-creator` aan met de vraag de `description` en de structuur van `.claude/skills/explainer-helix-maker/` te beoordelen op triggeren en volledigheid. Neem verbeteringen over die passen bij Kevins afspraken (Nederlands, geen emoji, de drie akkoordmomenten blijven staan).

- [ ] **Step 9: Verifiëren**

Run:
```bash
npx eslint scripts/handoff-stand.mjs
node scripts/handoff-stand.mjs --kort
```
Expected: de twee nieuwe regels onder "Buiten de repo". Controleer dat de skill in de skill-lijst verschijnt bij een nieuwe sessie (of lees `SKILL.md` terug).

---

### Task 16: Commitvoorstel (alleen op Kevins verzoek)

- [ ] **Step 1: Toon wat er in git hoort**

Run: `git status --short`

Stel Kevin deze paden voor (nooit `git add -A`):

```
src/lib/mediaUtils.js src/lib/mediaUtils.test.js
src/lib/publicContentBlockView.js src/lib/publicContentBlockView.test.js
src/components/media/MediaRenderer.jsx
eslint.config.js src/index.css .gitignore
video/package.json video/package-lock.json video/tsconfig.json video/remotion.config.ts
video/src video/lib video/scripts video/blender video/public/sami
video/public/hoofdstukken/hoofdstuk-binask-eoa-1-h2/lesstof.json
video/public/hoofdstukken/hoofdstuk-binask-eoa-1-h2/draaiboek.json
video/public/hoofdstukken/hoofdstuk-binask-eoa-1-h2/timing.json
scripts/lib/explainerPlaatsing.mjs scripts/lib/explainerPlaatsing.test.mjs scripts/plaats-explainer-video.mjs
scripts/handoff-stand.mjs docs/HANDOFF.md
.claude/skills/explainer-helix-maker
docs/superpowers/specs/2026-10-02-explainer-helix-maker-design.md
docs/superpowers/plans/2026-10-02-explainer-helix-maker.md
```

Commit pas als Kevin erom vraagt, met een Nederlands bericht, bijvoorbeeld `feat(explainer): uitlegvideo per hoofdstuk met ondertitelspoor en skill`, en de Co-Authored-By-regel.
