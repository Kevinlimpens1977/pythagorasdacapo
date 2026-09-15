# Vertaalknop bij lesstof: implementatieplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Een leerling met een ingestelde moedertaal kan per lespagina wisselen tussen de Nederlandse lesstof en een vertaling in zijn eigen taal.

**Architecture:** De vertaling wordt gemaakt bij het eerste gebruik en bewaard in `vertalingen/{blockId}__{taal}`, met een vingerafdruk van de Nederlandse brontekst zodat een gewijzigde les zichzelf opnieuw laat vertalen. Een Cloud Function doet de vertaling en leest daarvoor uitsluitend de leerlingversie van een blok, zodat de antwoordsleutel nooit bij de vertaler of in een voor leerlingen leesbaar document komt. De leerlingroute legt de vertaalde tekst over het blok heen en laat alle kenmerken staan.

**Tech Stack:** React 19 + Vite, Firebase (Firestore, Cloud Functions gen2 in europe-west1), OpenRouter via de bestaande `privateConfig/openrouter`, tests met `node --test`.

**Spec:** `docs/superpowers/specs/2026-09-15-vertaalknop-lesstof-design.md`

## Global Constraints

- Geen emoticons in de app. Alleen lucide-iconen of SVG.
- Nederlands in code, commentaar, commits en schermteksten.
- Na elke taak: lint op de gewijzigde bestanden, `node --test src/lib/`, `npm run build`, commit. Deployen gebeurt pas na taak 4, en alleen met `npx vercel --prod --yes`.
- Cloud Functions deployen met `npx firebase deploy --only functions:vertaalLesblok --project pythagoras-eoa`. Rules met `npx firebase deploy --only firestore:rules --project pythagoras-eoa`. Nooit `firebase deploy --only hosting`.
- Nooit `exports/`, `badges/`, `.firebase/` of andere untracked mappen stagen.
- De vertaalfunctie leest `publicContentBlocks`, nooit `contentBlocks`.
- Taalcodes zijn ISO 639-1: `el` (Grieks), `it` (Italiaans). Leeg betekent: geen vertaalknop.
- Documentsleutel van een vertaling is exact `${blockId}__${taal}`, met twee liggende streepjes.

---

### Task 1: Pure taallaag

De rekenregels los van React en los van Firebase, zodat de leerlingroute, de Cloud Function en de tests dezelfde regels delen.

**Files:**
- Create: `src/lib/lesTaal.js`
- Create: `src/lib/lesTaal.test.js`
- Modify: `scripts/sync-functions-shared.mjs:36-43` (bestandslijst)

**Interfaces:**
- Consumes: niets.
- Produces:
  - `LES_TALEN: Array<{ code: string, label: string, nederlands: string }>`
  - `isLesTaal(code: string): boolean`
  - `getLesTaal(user: object): string` — lege string als er geen geldige taal staat.
    Dit vervangt de `magVertalen(user)` uit de spec: één functie die de taal
    teruggeeft doet hetzelfde werk als een ja-nee-vraag plus een tweede
    functie om de code op te halen.
  - `taalLabel(code: string): string` — de eigen naam van de taal, bijvoorbeeld `Ελληνικά`
  - `isVertaalbaarBlok(block: object): boolean`
  - `bronTekstVanBlok(block: object): string`
  - `bronVingerafdruk(block: object): string` — 8 tekens hex
  - `voegVertalingSamen(block: object, vertaling: object): object`
  - `antwoordInstructie(taal: string): string`

- [ ] **Step 1: Schrijf de falende test**

Maak `src/lib/lesTaal.test.js`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  antwoordInstructie,
  bronVingerafdruk,
  getLesTaal,
  isLesTaal,
  isVertaalbaarBlok,
  taalLabel,
  voegVertalingSamen
} from './lesTaal.js';

const blok = {
  id: 'blok-1',
  type: 'quiz',
  title: 'Stoffen',
  content: {
    html: '<p>Een stof heeft eigenschappen.</p>',
    items: [
      {
        id: 'v1',
        type: 'meerkeuze',
        prompt: 'Wat is een stof?',
        options: [
          { id: 'a', text: 'Iets wat je kunt aanraken' },
          { id: 'b', text: 'Een kleur' }
        ],
        answer: { multiple: false },
        tokens: 5
      },
      { id: 'v2', type: 'open', prompt: 'Noem twee stoffen.', answer: {} }
    ]
  }
};

const vertaling = {
  titel: 'Ουσίες',
  html: '<p>Μια ουσία έχει ιδιότητες.</p>',
  items: [
    {
      id: 'v1',
      prompt: 'Τι είναι μια ουσία;',
      options: [{ id: 'a', text: 'Κάτι που μπορείς να αγγίξεις' }, { id: 'b', text: 'Ένα χρώμα' }]
    }
  ]
};

test('een taal geldt alleen als hij in de lijst staat', () => {
  assert.equal(isLesTaal('el'), true);
  assert.equal(isLesTaal('it'), true);
  assert.equal(isLesTaal('nl'), false);
  assert.equal(isLesTaal(''), false);
  assert.equal(isLesTaal(undefined), false);
  assert.equal(taalLabel('el'), 'Ελληνικά');
  assert.equal(taalLabel('xx'), '');
});

test('getLesTaal leest de taal van de leerling en weigert onzin', () => {
  assert.equal(getLesTaal({ lesTaal: 'it' }), 'it');
  assert.equal(getLesTaal({ lesTaal: ' el ' }), 'el');
  assert.equal(getLesTaal({ lesTaal: 'klingon' }), '');
  assert.equal(getLesTaal({}), '');
  assert.equal(getLesTaal(null), '');
});

test('alleen tekstblokken zijn vertaalbaar', () => {
  assert.equal(isVertaalbaarBlok({ type: 'theory' }), true);
  assert.equal(isVertaalbaarBlok({ type: 'question' }), true);
  assert.equal(isVertaalbaarBlok({ type: 'quiz' }), true);
  assert.equal(isVertaalbaarBlok({ type: 'toets' }), true);
  assert.equal(isVertaalbaarBlok({ type: 'summary' }), true);
  assert.equal(isVertaalbaarBlok({ type: 'slidedeck' }), false);
  assert.equal(isVertaalbaarBlok({ type: 'media' }), false);
  assert.equal(isVertaalbaarBlok({ type: 'game' }), false);
  assert.equal(isVertaalbaarBlok(null), false);
});

test('de vingerafdruk volgt de zichtbare tekst en niets anders', () => {
  const zelfde = JSON.parse(JSON.stringify(blok));
  assert.equal(bronVingerafdruk(blok), bronVingerafdruk(zelfde));

  // Een gewijzigde vraagtekst levert een andere vingerafdruk.
  const gewijzigd = JSON.parse(JSON.stringify(blok));
  gewijzigd.content.items[0].prompt = 'Wat is precies een stof?';
  assert.notEqual(bronVingerafdruk(blok), bronVingerafdruk(gewijzigd));

  // Iets dat de leerling niet leest, verandert de vingerafdruk niet.
  const zelfdeTekst = JSON.parse(JSON.stringify(blok));
  zelfdeTekst.content.items[0].tokens = 99;
  assert.equal(bronVingerafdruk(blok), bronVingerafdruk(zelfdeTekst));
});

test('samenvoegen vervangt tekst en laat kenmerken en antwoordgegevens staan', () => {
  const samen = voegVertalingSamen(blok, vertaling);

  assert.equal(samen.title, 'Ουσίες');
  assert.equal(samen.content.html, '<p>Μια ουσία έχει ιδιότητες.</p>');
  assert.equal(samen.content.items[0].prompt, 'Τι είναι μια ουσία;');
  assert.equal(samen.content.items[0].options[0].text, 'Κάτι που μπορείς να αγγίξεις');

  // Kenmerken, antwoordgegevens en volgorde blijven ongemoeid.
  assert.equal(samen.content.items[0].id, 'v1');
  assert.equal(samen.content.items[0].options[0].id, 'a');
  assert.equal(samen.content.items[0].tokens, 5);
  assert.deepEqual(samen.content.items[0].answer, { multiple: false });
  assert.equal(samen.content.items.length, 2);

  // Een vraag zonder vertaling houdt zijn Nederlandse tekst.
  assert.equal(samen.content.items[1].prompt, 'Noem twee stoffen.');

  // Het origineel is niet aangeraakt.
  assert.equal(blok.title, 'Stoffen');
});

test('samenvoegen zonder vertaling geeft het blok ongewijzigd terug', () => {
  assert.equal(voegVertalingSamen(blok, null), blok);
});

test('de antwoordinstructie staat vast in de code, niet in het model', () => {
  assert.match(antwoordInstructie('el'), /ολλανδικά|Ολλανδικά/);
  assert.match(antwoordInstructie('it'), /olandese/i);
  assert.equal(antwoordInstructie('nl'), '');
  assert.equal(antwoordInstructie(''), '');
});
```

- [ ] **Step 2: Draai de test en zie hem falen**

Run: `node --test src/lib/lesTaal.test.js`
Expected: FAIL, `Cannot find module './lesTaal.js'`

- [ ] **Step 3: Schrijf de implementatie**

Maak `src/lib/lesTaal.js`:

```js
/**
 * Lesstof in de taal van de leerling.
 *
 * Puur en zonder React of Firebase, zodat de leerlingroute, de Cloud Function
 * en de tests dezelfde regels delen. Deze laag bepaalt WELKE tekst vertaald
 * wordt en hoe een vertaling over een blok heen gaat; het vertalen zelf gebeurt
 * server-side.
 */

const schoon = (waarde) => String(waarde ?? '').trim();

export const LES_TALEN = [
  { code: 'el', label: 'Ελληνικά', nederlands: 'Grieks' },
  { code: 'it', label: 'Italiano', nederlands: 'Italiaans' }
];

export const beschikbareTalen = () => LES_TALEN;

export const isLesTaal = (code) => LES_TALEN.some((taal) => taal.code === schoon(code));

/** De taal van een leerling, of '' als er niets geldigs staat. */
export const getLesTaal = (user) => {
  const code = schoon(user?.lesTaal);
  return isLesTaal(code) ? code : '';
};

export const taalLabel = (code) => LES_TALEN.find((taal) => taal.code === schoon(code))?.label || '';

/**
 * Welke bloktypen hebben tekst die we kunnen omzetten? Slidedecks, media en
 * spellen zijn beeld; daar valt niets te vertalen zonder het materiaal zelf te
 * verbouwen.
 */
export const VERTAALBARE_BLOKTYPEN = new Set(['theory', 'question', 'quiz', 'toets', 'summary']);

export const isVertaalbaarBlok = (block) => VERTAALBARE_BLOKTYPEN.has(schoon(block?.type));

/**
 * De tekst waar de vingerafdruk over gaat: precies wat de leerling leest, in
 * een vaste volgorde. Tokens, kenmerken en instellingen blijven erbuiten, zodat
 * een gewijzigde tokenwaarde geen nieuwe vertaling uitlokt.
 */
export const bronTekstVanBlok = (block) => {
  const content = block?.content || {};
  const delen = [schoon(block?.title), schoon(content.html)];

  (Array.isArray(content.items) ? content.items : []).forEach((item) => {
    delen.push(schoon(item?.id), schoon(item?.prompt));
    (Array.isArray(item?.options) ? item.options : []).forEach((optie) => {
      delen.push(schoon(optie?.id), schoon(optie?.text));
    });
  });

  return delen.join('');
};

/**
 * FNV-1a, 32 bits, als hex. Bewust geen cryptografische hash: dit is een
 * cachesleutel, geen beveiliging. Het voordeel is dat hij synchroon is en in de
 * browser en in Node hetzelfde antwoord geeft, zonder afhankelijkheden.
 */
const fnv1a = (tekst) => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < tekst.length; i += 1) {
    hash ^= tekst.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
};

export const bronVingerafdruk = (block) => fnv1a(bronTekstVanBlok(block));

/**
 * De vertaalde tekst over het blok heen. Alleen zichtbare tekst wordt
 * vervangen; kenmerken, antwoordgegevens, volgorde en instellingen blijven
 * staan, want daar draait het nakijken op. Een vraag zonder vertaling houdt
 * zijn Nederlandse tekst.
 */
export const voegVertalingSamen = (block, vertaling) => {
  if (!block || !vertaling) return block;

  const perItemId = new Map(
    (Array.isArray(vertaling.items) ? vertaling.items : [])
      .filter((item) => schoon(item?.id))
      .map((item) => [schoon(item.id), item])
  );

  const items = (Array.isArray(block.content?.items) ? block.content.items : []).map((item) => {
    const vertaald = perItemId.get(schoon(item?.id));
    if (!vertaald) return item;

    const perOptieId = new Map(
      (Array.isArray(vertaald.options) ? vertaald.options : [])
        .filter((optie) => schoon(optie?.id))
        .map((optie) => [schoon(optie.id), schoon(optie.text)])
    );

    return {
      ...item,
      prompt: schoon(vertaald.prompt) || item.prompt,
      options: (Array.isArray(item.options) ? item.options : []).map((optie) => {
        const tekst = perOptieId.get(schoon(optie?.id));
        return tekst ? { ...optie, text: tekst } : optie;
      })
    };
  });

  return {
    ...block,
    title: schoon(vertaling.titel) || block.title,
    content: {
      ...(block.content || {}),
      html: schoon(vertaling.html) || block.content?.html || '',
      items
    }
  };
};

/**
 * Bij een open vraag schrijft de leerling zijn antwoord in het Nederlands, want
 * het nakijken zet het af tegen een Nederlands modelantwoord. Deze zin staat
 * vast in de code en komt niet uit het vertaalmodel, zodat hij altijd klopt.
 */
const ANTWOORD_INSTRUCTIE = {
  el: 'Γράψε την απάντησή σου στα ολλανδικά.',
  it: 'Scrivi la tua risposta in olandese.'
};

export const antwoordInstructie = (taal) => ANTWOORD_INSTRUCTIE[schoon(taal)] || '';
```

- [ ] **Step 4: Draai de test en zie hem slagen**

Run: `node --test src/lib/lesTaal.test.js`
Expected: PASS, 6 tests

- [ ] **Step 5: Neem het bestand op in de gedeelde laag**

In `scripts/sync-functions-shared.mjs` staat een lijst met bestandsnamen die naar `functions/shared/` gekopieerd worden (rond regel 36-43). Voeg `'lesTaal.js'` toe aan die lijst, achter `'nulmetingProfiel.js'`, en draai daarna:

Run: `node scripts/sync-functions-shared.mjs`
Expected: `functions/shared bijgewerkt: ... lesTaal.js`

- [ ] **Step 6: Alle tests en de build**

Run: `npx eslint src/lib/lesTaal.js src/lib/lesTaal.test.js && node --test src/lib/ && npm run build`
Expected: geen lintfouten, alle tests groen, build klaar

- [ ] **Step 7: Commit**

```bash
git add src/lib/lesTaal.js src/lib/lesTaal.test.js scripts/sync-functions-shared.mjs functions/shared/lesTaal.js
git commit -m "feat(vertaling): pure taallaag met vingerafdruk en samenvoegen"
```

---

### Task 2: Taal instellen bij de leerling

**Files:**
- Create: `src/services/lesTaalService.js`
- Modify: `src/pages/AdminLeerlingenPage.jsx` (leerlingrij en de handlers rond regel 91-170)
- Modify: `firestore.rules` (het `users`-blok)

**Interfaces:**
- Consumes: `LES_TALEN`, `isLesTaal` uit Task 1.
- Produces: `zetLesTaal(studentUid: string, taal: string): Promise<void>` uit `src/services/lesTaalService.js`.

- [ ] **Step 1: Schrijf de service**

Maak `src/services/lesTaalService.js`:

```js
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { isLesTaal } from '../lib/lesTaal';

/**
 * De moedertaal van een leerling. Leeg zetten haalt de vertaalknop weg.
 * Een onbekende code wordt geweigerd in plaats van stil opgeslagen: anders
 * staat er een taal bij de leerling waar niets mee gebeurt.
 */
export const zetLesTaal = async (studentUid, taal) => {
  const code = String(taal || '').trim();
  if (!studentUid) throw new Error('studentUid is verplicht');
  if (code && !isLesTaal(code)) throw new Error(`Onbekende taal: ${code}`);

  await updateDoc(doc(db, 'users', studentUid), {
    lesTaal: code,
    updatedAt: serverTimestamp()
  });
};
```

- [ ] **Step 2: Zet de keuzelijst in het leerlingoverzicht**

In `src/pages/AdminLeerlingenPage.jsx`, naast `handleMoveStudent` (rond regel 91), een handler erbij:

```js
  const handleSetLesTaal = async (student, taal) => {
    try {
      await zetLesTaal(student.id, taal);
      setStudents((huidige) => huidige.map((rij) => (
        rij.id === student.id ? { ...rij, lesTaal: taal } : rij
      )));
    } catch (error) {
      console.error('Taal opslaan mislukt:', error);
      setError('De taal kon niet worden opgeslagen.');
    }
  };
```

Importeer bovenaan:

```js
import { beschikbareTalen } from '../lib/lesTaal';
import { zetLesTaal } from '../services/lesTaalService';
```

In de rij van een leerling, naast de klaskeuze, een tweede keuzelijst:

```jsx
<label className="flex items-center gap-2 text-sm">
  <span className="sr-only">Taal van {student.displayName}</span>
  <select
    value={student.lesTaal || ''}
    onChange={(event) => handleSetLesTaal(student, event.target.value)}
    className="rounded-xl border border-[var(--helix-border)] bg-white px-2 py-1 text-sm font-bold"
  >
    <option value="">Nederlands</option>
    {beschikbareTalen().map((taal) => (
      <option key={taal.code} value={taal.code}>{taal.nederlands}</option>
    ))}
  </select>
</label>
```

De leerlingen worden in deze pagina met `getDocs` opgehaald; `lesTaal` komt dus vanzelf mee in `student`.

- [ ] **Step 3: Sta het veld toe in de regels**

In `firestore.rules`, in het `match /users/{userId}` blok, moet een admin dit veld kunnen schrijven. Controleer of de bestaande update-regel voor admins al breed genoeg is; is dat zo, verander dan niets en noteer dat in de commit. Zo niet, voeg `lesTaal` toe aan de toegestane velden.

Run: `npx firebase deploy --only firestore:rules --project pythagoras-eoa`
Expected: `rules file firestore.rules compiled successfully`, alleen als de regels gewijzigd zijn

- [ ] **Step 4: Lint, tests, build**

Run: `npx eslint src/services/lesTaalService.js src/pages/AdminLeerlingenPage.jsx && node --test src/lib/ && npm run build`
Expected: schoon, groen, gebouwd

- [ ] **Step 5: Commit**

```bash
git add src/services/lesTaalService.js src/pages/AdminLeerlingenPage.jsx firestore.rules
git commit -m "feat(vertaling): moedertaal instelbaar bij de leerling"
```

---

### Task 3: Cloud Function `vertaalLesblok`

**Files:**
- Modify: `functions/index.js` (core bij de andere cores, export onderaan bij `askAiTutor`, en toevoegen aan `exports.__test`)
- Modify: `functions/index.test.js`
- Modify: `firestore.rules` (nieuw blok `vertalingen`)

**Interfaces:**
- Consumes: `bronVingerafdruk`, `isLesTaal`, `isVertaalbaarBlok` uit `functions/shared/lesTaal.js` (Task 1), en de bestaande `getOpenRouterRuntimeConfig(db, provider)` en `assertAssessmentBlockAssignedToCaller({ db, uid, callerData, block, blockId })`.
- Produces: callable `vertaalLesblok({ blockId, taal })` die `{ success, vertaling, verouderd }` teruggeeft.

- [ ] **Step 1: Schrijf de falende test**

Voeg toe aan `functions/index.test.js`:

```js
test("vertaalLesblok geeft een bewaarde vertaling terug zonder het model te bellen", async () => {
  let modelGebeld = false;
  const publiekBlok = {
    id: "blok-1",
    type: "theory",
    status: "published",
    paragraafId: "para-1",
    title: "Stoffen",
    content: { html: "<p>Een stof heeft eigenschappen.</p>", items: [] }
  };
  const vingerafdruk = bronVingerafdruk(publiekBlok);

  const resultaat = await vertaalLesblokCore({
    auth: { uid: "leerling-1" },
    data: { blockId: "blok-1", taal: "el" },
    db: vertaalDb({
      publiekBlok,
      bestaandeVertaling: { bronVingerafdruk: vingerafdruk, titel: "Ουσίες", html: "<p>...</p>", items: [] },
      caller: { role: "student", klasId: "klas-1" }
    }),
    fetchImpl: () => { modelGebeld = true; throw new Error("had niet gebeld mogen worden"); },
    openrouterApiKeyProvider: () => "sk-or-test"
  });

  assert.equal(modelGebeld, false);
  assert.equal(resultaat.success, true);
  assert.equal(resultaat.vertaling.titel, "Ουσίες");
});

test("vertaalLesblok stuurt de antwoordsleutel nooit naar het model", async () => {
  let verstuurdeBody = null;
  const publiekBlok = {
    id: "blok-2",
    type: "quiz",
    status: "published",
    paragraafId: "para-1",
    title: "Quiz",
    content: {
      html: "",
      items: [{ id: "v1", type: "meerkeuze", prompt: "Wat is een stof?", options: [{ id: "a", text: "Iets tastbaars" }] }]
    }
  };

  await vertaalLesblokCore({
    auth: { uid: "leerling-1" },
    data: { blockId: "blok-2", taal: "it" },
    db: vertaalDb({ publiekBlok, bestaandeVertaling: null, caller: { role: "student", klasId: "klas-1" } }),
    fetchImpl: (url, opties) => {
      verstuurdeBody = opties.body;
      return {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: JSON.stringify({ titel: "Quiz", html: "", items: [{ id: "v1", prompt: "Che cos'e una sostanza?", options: [{ id: "a", text: "Qualcosa di tangibile" }] }] }) } }]
        })
      };
    },
    openrouterApiKeyProvider: () => "sk-or-test"
  });

  assert.equal(verstuurdeBody.includes("correctOptionId"), false);
  assert.equal(verstuurdeBody.includes("modelAnswer"), false);
  assert.equal(verstuurdeBody.includes("Iets tastbaars"), true);
});

test("vertaalLesblok weigert een onbekende taal", async () => {
  await assert.rejects(
    () => vertaalLesblokCore({
      auth: { uid: "leerling-1" },
      data: { blockId: "blok-1", taal: "klingon" },
      db: vertaalDb({ publiekBlok: null, bestaandeVertaling: null, caller: { role: "student", klasId: "klas-1" } }),
      fetchImpl: () => { throw new Error("niet bellen"); },
      openrouterApiKeyProvider: () => "sk-or-test"
    }),
    /taal/i
  );
});
```

Gebruik de nep-database die al in `functions/index.test.js` staat: `createNulmetingDb(docs)` rond regel 1716. Ondanks de naam is het een algemene, op paden gesleutelde nepdatabase met `doc(pad)`, `set` en subcollecties, en precies wat deze functie nodig heeft. Bouw geen tweede.

De store vult zich met paden. Voor deze tests heb je nodig:

```js
const vertaalDb = ({ publiekBlok, bestaandeVertaling, caller }) => createNulmetingDb({
  "users/leerling-1": caller,
  "klassen/klas-1": {
    enabledParagrafen: ["para-1"],
    enabledContentBlocks: {},
    studentOverrides: {}
  },
  ...(publiekBlok ? { [`publicContentBlocks/${publiekBlok.id}`]: publiekBlok } : {}),
  ...(bestaandeVertaling
    ? { [`vertalingen/${publiekBlok.id}__${bestaandeVertaling.taal || "el"}`]: bestaandeVertaling }
    : {}),
  "privateConfig/openrouter": { apiKey: "sk-or-test", model: "test/model", enabled: true }
});
```

De drie tests hierboven roepen `vertaalDb(` al aan. Zet verder bovenaan het bestand `bronVingerafdruk` bij de imports uit `./shared/lesTaal.js`, en haal `vertaalLesblokCore` uit `__test`, net als de andere cores.

- [ ] **Step 2: Draai de test en zie hem falen**

Run: `cd functions && node --test index.test.js`
Expected: FAIL, `vertaalLesblokCore is not defined`

- [ ] **Step 3: Schrijf de core**

In `functions/index.js`, bij de andere cores:

```js
// functions/shared is ESM en dit bestand is CommonJS, dus de laag komt binnen
// met een dynamische import in een gecachete promise. Exact hetzelfde patroon
// als sharedNulmetingLayerPromise verderop in dit bestand; require() zou hier
// bij de eerste aanroep stukgaan.
let sharedLesTaalLayerPromise = null;
function getLesTaalLayer() {
  if (!sharedLesTaalLayerPromise) {
    sharedLesTaalLayerPromise = import("./shared/lesTaal.js").then((layer) => ({
      bronVingerafdruk: layer.bronVingerafdruk,
      isLesTaal: layer.isLesTaal,
      isVertaalbaarBlok: layer.isVertaalbaarBlok,
    }));
  }
  return sharedLesTaalLayerPromise;
}

const VERTAAL_MAX_TOKENS = 3000;

function bouwVertaalBericht({ blok, taalNederlands }) {
  // Alleen de zichtbare tekst gaat mee. Wat hier niet in staat, kan het model
  // ook niet lekken: de leerlingversie draagt geen antwoordsleutel, en we
  // sturen expliciet alleen de velden die vertaald moeten worden.
  const teVertalen = {
    titel: String(blok.title || ""),
    html: String(blok.content?.html || ""),
    items: (blok.content?.items || []).map((item) => ({
      id: String(item.id || ""),
      prompt: String(item.prompt || ""),
      options: (item.options || []).map((optie) => ({
        id: String(optie.id || ""),
        text: String(optie.text || "")
      }))
    }))
  };

  return [
    {
      role: "system",
      content: [
        `Je vertaalt lesmateriaal voor het voortgezet onderwijs van het Nederlands naar het ${taalNederlands}.`,
        "Regels:",
        "- Vertaal uitsluitend de zichtbare tekst in de velden titel, html, prompt en text.",
        "- Laat elke id ongewijzigd.",
        "- Behoud de HTML-structuur en alle attributen precies zoals ze zijn.",
        "- Beantwoord geen vragen en voeg niets toe.",
        "- Gebruik taal die een leerling van twaalf tot vijftien jaar begrijpt.",
        "- Antwoord met uitsluitend geldige JSON in exact dezelfde vorm als de invoer."
      ].join("\n")
    },
    { role: "user", content: JSON.stringify(teVertalen) }
  ];
}

async function vertaalLesblokCore({ auth, data, db, fetchImpl = fetch, openrouterApiKeyProvider }) {
  const { bronVingerafdruk, isLesTaal, isVertaalbaarBlok } = await getLesTaalLayer();

  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Je moet ingelogd zijn.");
  }

  const blockId = String(data?.blockId || "").trim();
  const taal = String(data?.taal || "").trim();

  if (!blockId) {
    throw new HttpsError("invalid-argument", "blockId ontbreekt.");
  }
  if (!isLesTaal(taal)) {
    throw new HttpsError("invalid-argument", `Onbekende taal: ${taal}`);
  }

  const callerSnapshot = await db.doc(`users/${auth.uid}`).get();
  const callerData = callerSnapshot.exists ? callerSnapshot.data() || {} : {};

  // Uitsluitend de leerlingversie. Het blok uit contentBlocks draagt de
  // antwoordsleutel en hoort niet bij een vertaler.
  const blokSnapshot = await db.doc(`publicContentBlocks/${blockId}`).get();
  if (!blokSnapshot.exists) {
    throw new HttpsError("not-found", "Dit lesblok bestaat niet.");
  }
  const blok = { id: blockId, ...blokSnapshot.data() };

  if (!isVertaalbaarBlok(blok)) {
    throw new HttpsError("failed-precondition", "Dit soort lesblok heeft geen tekst om te vertalen.");
  }

  await assertAssessmentBlockAssignedToCaller({ db, uid: auth.uid, callerData, block: blok, blockId });

  const vingerafdruk = bronVingerafdruk(blok);
  const vertalingRef = db.doc(`vertalingen/${blockId}__${taal}`);
  const bestaand = await vertalingRef.get();

  if (bestaand.exists) {
    const opgeslagen = bestaand.data() || {};
    if (opgeslagen.bronVingerafdruk === vingerafdruk) {
      return { success: true, vertaling: opgeslagen, verouderd: false };
    }
    // Werk van de docent overschrijven we niet stil: teruggeven met een vlag.
    if (opgeslagen.bron === "docent") {
      return { success: true, vertaling: opgeslagen, verouderd: true };
    }
  }

  const runtimeConfig = await getOpenRouterRuntimeConfig(db, openrouterApiKeyProvider);
  const taalNederlands = taal === "el" ? "Grieks" : "Italiaans";

  const response = await fetchImpl("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${runtimeConfig.apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://stellingvanpythagoras.nl",
      "X-Title": "HELIX App"
    },
    body: JSON.stringify({
      model: runtimeConfig.model,
      messages: bouwVertaalBericht({ blok, taalNederlands }),
      max_tokens: VERTAAL_MAX_TOKENS,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    throw new HttpsError("unavailable", "Vertalen lukt nu even niet.");
  }

  const payload = await response.json();
  const rauw = payload?.choices?.[0]?.message?.content || "";
  let vertaald;
  try {
    vertaald = JSON.parse(rauw);
  } catch (parseError) {
    throw new HttpsError("internal", "De vertaling kwam niet in het juiste formaat terug.");
  }

  const vertaling = {
    blockId,
    taal,
    bronVingerafdruk: vingerafdruk,
    titel: String(vertaald.titel || ""),
    html: String(vertaald.html || ""),
    items: Array.isArray(vertaald.items) ? vertaald.items : [],
    bron: "ai",
    gecontroleerd: false,
    model: runtimeConfig.model,
    bijgewerktOp: new Date().toISOString()
  };

  await vertalingRef.set(vertaling, { merge: false });

  return { success: true, vertaling, verouderd: false };
}
```

Onderaan, bij `askAiTutor`:

```js
exports.vertaalLesblok = onCall({
  region: REGION,
  secrets: [openrouterApiKey],
}, async (request) => {
  return await vertaalLesblokCore({
    auth: request.auth,
    data: request.data || {},
    db: getFirestore(),
    openrouterApiKeyProvider: () => openrouterApiKey.value(),
  });
});
```

En in `exports.__test` de regel `vertaalLesblokCore,` erbij, op alfabetische plek.

Maak tot slot de foutteksten van `assertAssessmentBlockAssignedToCaller` neutraal, want die controle dekt nu ook theorie- en vraagblokken: vervang in die functie "Dit toetsblok staat niet klaar om nagekeken te worden." door "Dit lesblok staat niet klaar." en beide keren "Dit toetsblok hoort niet bij jouw lesstof." door "Dit lesblok hoort niet bij jouw lesstof.". Controleer met `grep -n "toetsblok" functions/index.js` dat er geen achterblijven in deze functie, en pas de bestaande tests aan die op die teksten matchen.

- [ ] **Step 4: Draai de functietests**

Run: `cd functions && node --test index.test.js`
Expected: PASS, de drie nieuwe tests erbij en de bestaande blijven groen

- [ ] **Step 5: Regel voor de bewaarde vertalingen**

In `firestore.rules`, naast de andere blokken:

```
    // Vertalingen van lesstof. Leesbaar voor iedereen die ingelogd is: het is
    // dezelfde tekst die de leerling toch al in zijn les ziet, en er staat geen
    // antwoordsleutel in (vertaalLesblok leest alleen publicContentBlocks).
    // Schrijven gaat via de Cloud Function met de Admin SDK, of door een
    // beheerder die een vertaling corrigeert. De leesvoorwaarde raakt bewust
    // geen `resource`, zodat ook een lijstquery van het docentoverzicht er
    // langs komt.
    match /vertalingen/{vertalingId} {
      allow read: if signedIn();
      allow write: if isAdmin();
    }
```

- [ ] **Step 6: Deploy de functie en de regels**

Run: `npx firebase deploy --only functions:vertaalLesblok --project pythagoras-eoa`
Expected: `functions[vertaalLesblok(europe-west1)] Successful create operation`

Run: `npx firebase deploy --only firestore:rules --project pythagoras-eoa`
Expected: `released rules firestore.rules to cloud.firestore`

- [ ] **Step 7: Commit**

```bash
git add functions/index.js functions/index.test.js firestore.rules
git commit -m "feat(vertaling): Cloud Function vertaalLesblok met bewaarde vertalingen"
```

---

### Task 4: Schakelaar en weergave in de leerlingroute

Na deze taak is de voorziening bruikbaar voor de klas.

**Files:**
- Create: `src/services/vertaalService.js`
- Create: `src/components/lesson/TaalSchakelaar.jsx`
- Modify: `src/pages/StudentLessonPage.jsx`

**Interfaces:**
- Consumes: `getLesTaal`, `taalLabel`, `isVertaalbaarBlok`, `voegVertalingSamen`, `antwoordInstructie` uit Task 1; callable `vertaalLesblok` uit Task 3.
- Produces: `haalVertaling(blockId: string, taal: string): Promise<object|null>` uit `src/services/vertaalService.js`.

- [ ] **Step 1: Schrijf de service**

Maak `src/services/vertaalService.js`:

```js
import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

/**
 * De vertaling van één lesblok. Mislukt het, dan geeft dit null terug en blijft
 * de Nederlandse tekst staan: een leerling mag hier nooit op vastlopen.
 */
export const haalVertaling = async (blockId, taal) => {
  if (!blockId || !taal) return null;
  try {
    const aanroep = httpsCallable(functions, 'vertaalLesblok');
    const antwoord = await aanroep({ blockId, taal });
    return antwoord?.data?.vertaling || null;
  } catch (error) {
    console.error('Vertaling ophalen mislukt:', error);
    return null;
  }
};
```

Controleer in `src/services/firebase.js` hoe `functions` geëxporteerd wordt en of er al een `httpsCallable`-patroon in de codebase staat; volg dat en verzin geen tweede manier.

- [ ] **Step 2: Schrijf de schakelaar**

Maak `src/components/lesson/TaalSchakelaar.jsx`:

```jsx
import { Languages, Loader2 } from 'lucide-react';
import { taalLabel } from '../../lib/lesTaal';

/**
 * Eén schakelaar per lespagina: Nederlands of de eigen taal van de leerling.
 * Hij zet alles op het scherm tegelijk om. Een knop bij elk tekstblok zou de
 * pagina rommelig maken en het lezen onderbreken.
 */
export default function TaalSchakelaar({ taal, actief, bezig, onWissel }) {
  if (!taal) return null;

  return (
    <div className="inline-flex items-center gap-2 rounded-2xl border-2 border-[var(--helix-border)] bg-white p-1">
      <Languages size={16} aria-hidden="true" className="ml-2 text-[var(--helix-muted)]" />
      <button
        type="button"
        onClick={() => onWissel(false)}
        aria-pressed={!actief}
        className={`rounded-xl px-3 py-1.5 text-sm font-black ${!actief ? 'bg-[var(--helix-purple)] text-white' : 'text-[var(--helix-muted)]'}`}
      >
        Nederlands
      </button>
      <button
        type="button"
        onClick={() => onWissel(true)}
        aria-pressed={actief}
        className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-black ${actief ? 'bg-[var(--helix-purple)] text-white' : 'text-[var(--helix-muted)]'}`}
      >
        {bezig && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
        {taalLabel(taal)}
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Haak hem in de lespagina**

In `src/pages/StudentLessonPage.jsx`:

1. Importeer `TaalSchakelaar`, `haalVertaling`, en uit `lesTaal`: `getLesTaal`, `isVertaalbaarBlok`, `voegVertalingSamen`, `antwoordInstructie`.
2. Naast de bestaande state:

```jsx
  const lesTaal = getLesTaal(userData);
  const [taalActief, setTaalActief] = useState(() => {
    try {
      return window.localStorage.getItem(`helix-lestaal-${currentUser?.uid || ''}`) === 'aan';
    } catch (opslagFout) {
      return false;
    }
  });
  const [vertalingen, setVertalingen] = useState({});
  const [vertalingBezig, setVertalingBezig] = useState(false);
```

3. Een handler die de keuze onthoudt en de vertaling ophaalt:

```jsx
  const wisselTaal = async (aan) => {
    setTaalActief(aan);
    try {
      window.localStorage.setItem(`helix-lestaal-${currentUser?.uid || ''}`, aan ? 'aan' : 'uit');
    } catch (opslagFout) {
      // Een browser die opslag weigert mag de les niet breken.
    }
    if (!aan || !lesTaal || !currentBlock?.id) return;
    if (!isVertaalbaarBlok(currentBlock) || vertalingen[currentBlock.id]) return;

    setVertalingBezig(true);
    const vertaling = await haalVertaling(currentBlock.id, lesTaal);
    setVertalingen((huidige) => ({ ...huidige, [currentBlock.id]: vertaling }));
    setVertalingBezig(false);
  };
```

4. Het blok dat getoond wordt, gaat door de samenvoeging heen. Zoek waar `currentBlock` aan `LessonBlockContent` wordt meegegeven (rond regel 1155) en geef daar een afgeleide waarde mee:

```jsx
  const zichtbaarBlok = taalActief && lesTaal && vertalingen[currentBlock?.id]
    ? voegVertalingSamen(currentBlock, vertalingen[currentBlock.id])
    : currentBlock;
```

Gebruik `zichtbaarBlok` in de `block`-prop en in `getLessonBlockRenderKey`. Laat alle andere props op `currentBlock` staan: die gaan over voortgang en opslaan, en dat hoort bij het echte blok.

5. Zet de schakelaar in de kop van de les, naast de titel van de stap (rond regel 1036).

6. Bij een open vraag in een vertaald blok komt de vaste instructie onder de vraag. Geef `antwoordInstructie(taalActief ? lesTaal : '')` mee aan `AssessmentItemLearningCard` en toon hem daar onder de prompt wanneer de string niet leeg is.

- [ ] **Step 4: Lint, tests, build**

Run: `npx eslint src/pages/StudentLessonPage.jsx src/components/lesson/TaalSchakelaar.jsx src/services/vertaalService.js && node --test src/lib/ && npm run build`
Expected: schoon, groen, gebouwd

- [ ] **Step 5: Commit, push en deploy**

```bash
git add src/pages/StudentLessonPage.jsx src/components/lesson/TaalSchakelaar.jsx src/services/vertaalService.js
git commit -m "feat(vertaling): schakelaar tussen Nederlands en de eigen taal in de les"
git push origin codex/digitale-vaardigheden-seed
npx vercel --prod --yes
```

- [ ] **Step 6: Controleer de live bundel**

```bash
ASSET=$(curl -s https://dvdacapo.vercel.app/ | grep -oE '/assets/index-[A-Za-z0-9._-]+\.js' | head -1)
curl -s "https://dvdacapo.vercel.app$ASSET" | grep -c "Ελληνικά"
```
Expected: 1 of hoger

Vraag Kevin daarna om de laatste check met een echte leerling: de dev-login geeft geen Firebase-sessie, dus dit is in de browser niet als leerling te testen.

---

### Task 5: Nakijkpaneel voor de docent

**Files:**
- Create: `src/components/cms/VertalingPaneel.jsx`
- Modify: `src/pages/AdminLesstofPage.jsx` (of het blokpaneel dat daar een blok toont)
- Modify: `src/services/lesTaalService.js`

**Interfaces:**
- Consumes: `beschikbareTalen`, `bronVingerafdruk` uit Task 1.
- Produces: `bewaarDocentVertaling(blockId: string, taal: string, velden: object): Promise<void>` uit `src/services/lesTaalService.js`.

- [ ] **Step 1: Breid de service uit**

Voeg toe aan `src/services/lesTaalService.js`. Let op: Task 2 heeft daar al een importregel uit `firebase/firestore` staan. Breid die regel uit tot `import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';` en voeg GEEN tweede importregel toe.

```js

/**
 * Een vertaling die de docent heeft nagekeken. Vanaf nu overschrijft de machine
 * deze tekst niet meer; bij een gewijzigde bron komt hij terug met een seintje
 * dat hij nagelopen moet worden.
 */
export const bewaarDocentVertaling = async (blockId, taal, velden) => {
  await setDoc(doc(db, 'vertalingen', `${blockId}__${taal}`), {
    ...velden,
    blockId,
    taal,
    bron: 'docent',
    gecontroleerd: true,
    bijgewerktOp: serverTimestamp()
  }, { merge: true });
};

export const haalOpgeslagenVertaling = async (blockId, taal) => {
  const snapshot = await getDoc(doc(db, 'vertalingen', `${blockId}__${taal}`));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};
```

- [ ] **Step 2: Bouw het paneel**

Maak `src/components/cms/VertalingPaneel.jsx`. Volg de opmaak van `ParagraafKlaarzettenPanel.jsx`, zodat het paneel niet uit de toon valt.

```jsx
import { useEffect, useState } from 'react';
import { AlertTriangle, Check, Loader2 } from 'lucide-react';
import { beschikbareTalen, bronVingerafdruk, taalLabel } from '../../lib/lesTaal';
import { bewaarDocentVertaling, haalOpgeslagenVertaling } from '../../services/lesTaalService';

/**
 * Bron en vertaling naast elkaar, zodat de docent een machinevertaling kan
 * bijsturen. Wat hier opgeslagen wordt, overschrijft de machine daarna niet
 * meer; bij een gewijzigde Nederlandse tekst komt er een seintje.
 */
export default function VertalingPaneel({ blok }) {
  const [taal, setTaal] = useState(beschikbareTalen()[0].code);
  const [vertaling, setVertaling] = useState(null);
  const [bezig, setBezig] = useState(false);
  const [bewaard, setBewaard] = useState(false);

  useEffect(() => {
    let gestopt = false;
    setVertaling(null);
    haalOpgeslagenVertaling(blok.id, taal).then((gevonden) => {
      if (!gestopt) setVertaling(gevonden);
    });
    return () => { gestopt = true; };
  }, [blok.id, taal]);

  const verouderd = Boolean(vertaling) && vertaling.bronVingerafdruk !== bronVingerafdruk(blok);

  const opslaan = async () => {
    setBezig(true);
    setBewaard(false);
    try {
      await bewaarDocentVertaling(blok.id, taal, {
        titel: vertaling?.titel || '',
        html: vertaling?.html || '',
        items: vertaling?.items || [],
        bronVingerafdruk: bronVingerafdruk(blok)
      });
      setBewaard(true);
    } finally {
      setBezig(false);
    }
  };

  return (
    <section className="helix-surface mt-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-black text-[var(--helix-navy)]">Vertaling nakijken</h2>
        <select
          value={taal}
          onChange={(event) => setTaal(event.target.value)}
          className="rounded-xl border border-[var(--helix-border)] bg-white px-3 py-2 text-sm font-bold"
        >
          {beschikbareTalen().map((optie) => (
            <option key={optie.code} value={optie.code}>{optie.nederlands}</option>
          ))}
        </select>
      </div>

      {!vertaling && (
        <p className="helix-muted mt-3 text-sm">
          Er is nog geen vertaling in het {taalLabel(taal)}. Die ontstaat zodra een leerling de knop
          voor het eerst gebruikt.
        </p>
      )}

      {verouderd && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800">
          <AlertTriangle size={16} aria-hidden="true" />
          De Nederlandse tekst is gewijzigd sinds deze vertaling is nagekeken.
        </p>
      )}

      {vertaling && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <p className="helix-eyebrow">Nederlands</p>
            <p className="mt-2 font-black">{blok.title}</p>
            <div className="lesson-prose mt-2 text-sm" dangerouslySetInnerHTML={{ __html: blok.content?.html || '' }} />
          </div>
          <div>
            <p className="helix-eyebrow">{taalLabel(taal)}</p>
            <input
              value={vertaling.titel || ''}
              onChange={(event) => setVertaling({ ...vertaling, titel: event.target.value })}
              className="mt-2 w-full rounded-xl border border-[var(--helix-border)] px-3 py-2 font-black"
            />
            <textarea
              value={vertaling.html || ''}
              onChange={(event) => setVertaling({ ...vertaling, html: event.target.value })}
              rows={10}
              className="mt-2 w-full rounded-xl border border-[var(--helix-border)] px-3 py-2 font-mono text-xs"
            />
          </div>
        </div>
      )}

      {vertaling && (
        <button type="button" onClick={opslaan} disabled={bezig} className="btn-primary mt-4 px-5 py-3 text-sm">
          {bezig ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Check size={16} aria-hidden="true" />}
          Vastzetten als nagekeken
        </button>
      )}

      {bewaard && <p className="mt-2 text-sm font-bold text-emerald-700">Opgeslagen.</p>}
    </section>
  );
}
```

De vragen per item staan bewust niet in dit eerste paneel: theorie is waar een leerling het meeste leest, en een tekstvak per antwoordoptie maakt het scherm onwerkbaar. Blijkt bij gebruik dat de vragen ook bijgestuurd moeten worden, dan is dat een aparte, kleine uitbreiding.

- [ ] **Step 3: Lint, tests, build**

Run: `npx eslint src/components/cms/VertalingPaneel.jsx src/services/lesTaalService.js && node --test src/lib/ && npm run build`
Expected: schoon, groen, gebouwd

- [ ] **Step 4: Commit, push en deploy**

```bash
git add src/components/cms/VertalingPaneel.jsx src/services/lesTaalService.js src/pages/AdminLesstofPage.jsx
git commit -m "feat(vertaling): docent kan een vertaling nakijken en vastzetten"
git push origin codex/digitale-vaardigheden-seed
npx vercel --prod --yes
```

---

## Uitrollen

Na taak 4 zet Kevin bij de Griekse en de Italiaanse leerling in ER3L1A de taal. Zij openen Binask en drukken op de schakelaar; de eerste keer duurt een blok een paar seconden, daarna is het voor iedereen meteen klaar.

Wil hij een hoofdstuk vóór de les klaarzetten, dan is een script dat `vertaalLesblok` per blok aanroept een kleine toevoeging. Dat staat bewust niet in dit plan: pas bouwen als blijkt dat het wachten bij het eerste gebruik hinderlijk is.
