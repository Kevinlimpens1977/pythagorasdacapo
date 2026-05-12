# Implementatieplan – Sessie 2026-05-12

## Context
We bouwen een didactisch leerplatform (Stelling van Pythagoras). Studenten loggen in, zien lesmateriaal en opdrachten per klas. Admins beheren content via een CMS.

**Huidige state:** Phase 4 (Klassen) + Phase 6B (Firestore loading) zijn compleet.  
**Probleem:** DB is vervuild door incomplete import-functies. Per-klas chapter filtering ontbreekt. Rich editor mist antwoord-veld, OCR, en opmaak.  
**Doel deze sessie:** DB cleanup + Phase 6C (chapter filtering) + start Rich Editor (Phase 2).

---

## Deel A – DB Reset & Cleanup

### Probleem
`deletePythagorasMigration()` in `src/services/migrationService.js` verwijdert alleen `vraag` docs maar laat orphaned docs achter in `vak`, `leerjaar`, `niveau`, `hoofdstuk`, `paragraaf` collections.

### Oplossing
**1. Fix `deletePythagorasMigration()`** — verwijder ook vak/leerjaar/niveau/hoofdstuk/paragraaf docs voor het Pythagoras-vak (id `'pythagoras'`).

**2. Voeg `deleteAllCmsContent()` toe** — verwijdert ALLES uit alle CMS collections (vak, leerjaar, niveau, hoofdstuk, paragraaf, vraag, klassen). Users worden NIET aangeraakt.

**3. "Alles Wissen" knop in AdminDashboardPage** — destructieve actie met dubbele bevestiging (confirm dialog met intypen van "WISSEN").

### Files
- `src/services/migrationService.js` — fix delete + voeg `deleteAllCmsContent()` toe
- `src/pages/AdminDashboardPage.jsx` — voeg rode "Alles Wissen" sectie toe onderaan de data-management area

### Schema na reset
Na reset zijn ALLE cms-collections leeg. Admin klikt "Dummy Data aanmaken" en/of "Pythagoras importeren" om fresh te starten.

---

## Deel B – Phase 6C: Per-Klas Chapter Filtering

### Doel
Admin kan per klas instellen welke chapters (paragrafen) zichtbaar zijn voor studenten. Studenten zien alleen de chapters die hun klas heeft ingeschakeld.

### Data Schema
```js
// klassen/{klasId}
{
  name: 'VMBO 1A',
  code: 'VMB1A',
  settings: { hintsEnabled, aiEnabled, calculatorEnabled },
  // NIEUW:
  enabledChapters: {
    voorkennis: true,
    para_71: true,
    para_72: false,
    para_73: false,
    para_74: false,
    para_75: false,
    para_76: false,
  }
}
```

Chapter IDs zijn exact de string-IDs uit `src/data/chapters.js` CHAPTERS array. Die worden ook gebruikt als `paragraafId` in Firestore `vraag` collection en als URL param in `/chapter/:chapterId`.

### Implementatiestappen

**Stap 1 — `src/services/klasService.js`**  
Voeg toe:
```js
export const updateKlasChapters = async (klasId, enabledChapters) => {
  await updateDoc(doc(db, 'klassen', klasId), {
    enabledChapters,
    updatedAt: serverTimestamp()
  });
};
```
Voeg ook `enabledChapters` toe aan `createKlas()` (default: alle false behalve voorkennis).

**Stap 2 — `src/pages/AdminKlassenPage.jsx`**  
Voeg een sectie "Beschikbare Chapters" toe in het rechter detail-panel, onder de settings-toggles.  
- Importeer `CHAPTERS` uit `../../data/chapters`
- Render per chapter een toggle (zelfde patroon als de settings-toggles)
- On toggle: call `updateKlasChapters(selectedKlas.id, { ...selectedKlas.enabledChapters, [chapter.id]: !current })`
- Sla huidige state op in lokale `selectedKlas` state zodat UI direct respondeert

**Stap 3 — `src/components/layout/TableOfContents.jsx`**  
Filter de CHAPTERS array op basis van `klasData.enabledChapters`:
```js
const { isAdmin, klasData } = useAuth();

const visibleChapters = isAdmin
  ? CHAPTERS
  : CHAPTERS.filter(ch => klasData?.enabledChapters?.[ch.id] === true);
```
- Admin: altijd alle chapters zichtbaar
- Student met klas: alleen enabled chapters
- Student zonder klas (geen klasId): fallback naar alle chapters (voor testdoeleinden)

**Stap 4 — `src/components/slides/SlideRenderer.jsx`** (lichte beveiliging)  
Voeg check toe bij het laden: als student probeert een chapter te openen dat niet in `klasData.enabledChapters` staat, redirect naar `/` met melding "Dit chapter is nog niet beschikbaar voor jouw klas."

### Files
- `src/services/klasService.js` — `updateKlasChapters()` + default in `createKlas()`
- `src/pages/AdminKlassenPage.jsx` — chapter toggle UI
- `src/components/layout/TableOfContents.jsx` — filter op `enabledChapters`
- `src/components/slides/SlideRenderer.jsx` — toegangscheck

---

## Deel C – Phase 2 CMS: Rich Editor

### C1 – TipTap uitbreiden (opmaak toolbar)

**Nieuwe packages:**
```
@tiptap/extension-color
@tiptap/extension-font-family
@tiptap/extension-text-style
@tiptap/extension-underline
```

**Toolbar in `QuestionEditor.jsx`** boven de editor:  
`B | I | U | Strikethrough | — | Font [dropdown] | Kleur [picker] | — | Afbeelding toevoegen | Opsomming | Genummerd`

Gebruik bestaand patroon: toolbar buttons roepen `editor.chain().focus().[extension].run()` aan.

**Files:**
- `package.json` — voeg packages toe
- `src/components/cms/QuestionEditor.jsx` — importeer extensions, voeg aan `useEditor` extensions toe, render toolbar

### C2 – Antwoord-veld per vraagtype

**Antwoord schema (Firestore `vraag.antwoord`):**
```js
// Numeriek:
antwoord: { type: 'numeriek', expected: 42, tolerance: 0.5, unit: 'cm', hintBijFout: 'Gebruik a² + b² = c²' }
// Open:
antwoord: { type: 'open' }  // geen auto-check
// Meerkeuze (later):
antwoord: { type: 'meerkeuze', correctIndex: 2 }
```

**UI in `QuestionEditor.jsx`** — voeg een "Antwoord" sectie toe onder de editor, conditioneel op `vraagtype`:
- `numeriek`: input voor verwacht getal, tolerantie, eenheid, hint bij fout
- `open`: readonly melding "Open vraag – geen automatische controle"
- anderen: placeholder voor later

**Opslaan in `DualPanelEditor.jsx`** — voeg `antwoord` toe aan de `updateVraag` call:
```js
antwoord: formState.antwoord || vraag?.antwoord || { type: vraagtype }
```

**Student-facing:** `ExerciseSlide.jsx` moet numeriek antwoord vergelijken. Bekijk hoe het nu werkt voor migrated data en pas aan zodat het ook het nieuwe schema begrijpt.

**Files:**
- `src/components/cms/QuestionEditor.jsx` — antwoord sectie
- `src/components/cms/DualPanelEditor.jsx` — antwoord meenemen in save
- `src/components/slides/ExerciseSlide.jsx` — lees beide schema's (legacy + nieuw)

### C3 – OCR via OpenRouter (text crops)

**Huidig probleem:** Als crop type = 'text', wordt het als `<img>` in de editor gezet (lijn 176-188 DualPanelEditor). Tekst wordt niet geëxtraheerd.

**Gewenste flow:**
1. Admin maakt crop met type 'text'
2. Crop wordt als blob naar OpenRouter vision model gestuurd
3. Response is geëxtraheerde tekst
4. Tekst wordt als `<p>` in de TipTap editor ingevoegd (niet als image)

**OpenRouter API call** in `src/lib/api.js`:
```js
export const extractTextViaOCR = async (imageBlob) => {
  // base64 encode blob
  // POST naar OpenRouter met model 'openai/gpt-4o' of 'anthropic/claude-3-haiku'
  // image_url in messages array
  // return response.choices[0].message.content (extracted text)
};
```
OpenRouter API key wordt uit `import.meta.env.VITE_OPENROUTER_API_KEY` gehaald. Check of die al in `.env` staat.

**Aanpassing in `DualPanelEditor.jsx`** in `handleProcessCrops`:  
```js
} else if (crop.type === 'text') {
  const extractedText = await extractTextViaOCR(result.blob);
  editorRef.current.chain().focus().insertContent(`<p>${extractedText}</p>`).run();
}
```

**Files:**
- `src/lib/api.js` — voeg `extractTextViaOCR()` toe
- `src/components/cms/DualPanelEditor.jsx` — vervang image-insert door OCR text-insert voor type 'text'
- `.env` — controleer of `VITE_OPENROUTER_API_KEY` bestaat

---

## Volgorde van implementatie

| Stap | Onderdeel | Geschatte tijd |
|------|-----------|----------------|
| 1 | DB Reset: fix migrationService + admin knop | 30 min |
| 2 | Phase 6C: klasService updateKlasChapters | 15 min |
| 3 | Phase 6C: AdminKlassenPage chapter toggles | 30 min |
| 4 | Phase 6C: TableOfContents filteren + SlideRenderer check | 20 min |
| 5 | Rich Editor: TipTap packages + toolbar | 45 min |
| 6 | Rich Editor: Antwoord-veld UI + schema | 45 min |
| 7 | Rich Editor: OCR via OpenRouter | 30 min |
| — | **Totaal** | **~3.5 uur** |

---

## Verificatie (testen na implementatie)

### DB Reset
1. Admin Dashboard → "Alles Wissen" knop → type "WISSEN" → bevestigen
2. Check Firebase Console: alle CMS collections leeg, users intact
3. "Pythagoras importeren" → data komt terug

### Phase 6C
1. Admin → Klassen Beheer → selecteer klas → zie "Beschikbare Chapters" sectie
2. Toggle para_71 ON → toggle para_72 OFF
3. Login als student van die klas → TableOfContents toont alleen para_71
4. Direct navigeren naar `/chapter/para_72` → redirect met melding

### Rich Editor
1. Admin → CMS → selecteer vraag → Edit
2. Toolbar zichtbaar boven editor (B, I, U, kleur, font)
3. Vraagtype = 'numeriek' → antwoord-sectie toont getal/tolerantie-inputs
4. Crop selecteren met type 'text' → verwerken → tekst verschijnt als tekst in editor (niet als image)

---

## Kritieke bestanden (overzicht)

| File | Wijziging |
|------|-----------|
| `src/services/migrationService.js` | Fix delete + deleteAllCmsContent |
| `src/pages/AdminDashboardPage.jsx` | "Alles Wissen" knop |
| `src/services/klasService.js` | updateKlasChapters + default enabledChapters |
| `src/pages/AdminKlassenPage.jsx` | Chapter toggle UI |
| `src/components/layout/TableOfContents.jsx` | Filter op enabledChapters |
| `src/components/slides/SlideRenderer.jsx` | Toegangscheck per klas |
| `src/components/cms/QuestionEditor.jsx` | Toolbar + antwoord-sectie |
| `src/components/cms/DualPanelEditor.jsx` | Antwoord in save + OCR text-insert |
| `src/components/slides/ExerciseSlide.jsx` | Lees nieuw antwoord-schema |
| `src/lib/api.js` | extractTextViaOCR() via OpenRouter |
| `package.json` | TipTap extension packages |
