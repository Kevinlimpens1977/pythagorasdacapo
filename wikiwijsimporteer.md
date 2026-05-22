# Wikiwijs-import: analyse Firestore- en CMS-structuur

Bronnen gecontroleerd:
- `src/services/cmsService.js`
- `src/hooks/useCms.js`
- `src/types/cms.types.js`
- `src/lib/contentBlockUtils.js`
- `src/services/firestoreService.js`
- `src/services/slideService.js`
- `src/services/voortgangService.js`
- `src/pages/AdminCmsPage.jsx`
- `src/pages/AdminLesstofPage.jsx`
- `src/pages/StudentLessonPage.jsx`
- `src/components/cms/CmsShell.jsx`
- `src/components/cms/CreateContentModal.jsx`
- `src/components/cms/CreateQuestionModal.jsx`
- `src/components/cms/ContentBlockBuilder.jsx`
- `src/components/cms/DualPanelEditor.jsx`
- `src/components/cms/QuestionEditor.jsx`
- `src/App.jsx`
- `FIRESTORE_SCHEMA.md`
- `PROJECTKOMPAS-HELIX.md`

## Vraag 1: Firestore lesstructuur

### Bestaat er een `lessons`-collectie of vergelijkbaar?

Er is in de codebase geen `lessons`-collectie gevonden.

De huidige lesstructuur gebruikt platte top-level Firestore-collecties:

```text
vak/{vakId}
leerjaar/{leerjaarId}
niveau/{niveauId}
hoofdstuk/{hoofdstukId}
paragraaf/{paragraafId}
vraag/{vraagId}
contentBlocks/{blockId}
```

De leerling-lesroute wordt in de actuele code opgebouwd uit:

```text
paragraaf/{paragraafId}
contentBlocks/{blockId} where paragraafId == {paragraafId}
```

In `src/pages/StudentLessonPage.jsx` wordt de routeparameter `chapterId` gebruikt als `paragraafId`. Daarna worden `cmsService.getParagraaf(paragraafId)` en `cmsService.getContentBlocks(paragraafId, false)` geladen. Dat betekent dat de feitelijke "les" in de app overeenkomt met een `paragraaf`-document plus de gepubliceerde `contentBlocks` voor die paragraaf.

Daarnaast bestaan er aanverwante collecties voor voortgang en metadata:

```text
voortgang/{userId}_{vraagId}
voortgang/{userId}_{blockId}
questionMetadata/{paragraphId}/questions/{questionId}
adminCropSources/{sourceImageId}
slidedeckPackages/{packageId}
promptTemplates/{templateId}
```

`FIRESTORE_SCHEMA.md` beschrijft ook subcollecties als `paragraaf/{paragraafId}/crops/{cropId}` en `paragraaf/{paragraafId}/sourceImages/{imageId}`, maar in de actuele code is voor cropmetadata vooral `questionMetadata/{paragraphId}/questions/{questionId}` en `adminCropSources/{sourceImageId}` gevonden.

### Hoe ziet een les-document eruit?

Er is geen afzonderlijk les-documenttype gevonden. De lesroute bestaat uit een `paragraaf`-document en losse `contentBlocks`.

#### `paragraaf/{paragraafId}`

`createParagraaf` in `src/services/cmsService.js` schrijft deze velden:

| Veld | Type | Herkomst/opmerking |
| --- | --- | --- |
| `vakId` | string | overgenomen van parent `hoofdstuk` |
| `leerjaarId` | string | overgenomen van parent `hoofdstuk` |
| `niveauId` | string | overgenomen van parent `hoofdstuk` |
| `hoofdstukId` | string | parent-ID |
| `code` | string | `data.code || ''` |
| `title` | string | formulierdata |
| `beschrijving` | string | formulierdata of `''` |
| `order` | number | eerstvolgende volgorde binnen hoofdstuk |
| `published` | boolean | `data.published !== false` |
| `createdBy` | string | admin user ID |
| `createdAt` | Firestore server timestamp | via `serverTimestamp()` |
| `aiCompanionEnabled` | boolean | standaard `true` |
| `cropCount` | number | standaard `0` |
| `isArchived` | boolean | standaard `false` |
| `updatedAt` | Firestore server timestamp | alleen bij updates via `updateParagraaf` |

De JSDoc-type definitie noemt daarnaast optionele of verwachte velden zoals `lastCropUpdate`, `pdfPath` en `aiCompanionPrompt`.

#### `contentBlocks/{blockId}`

`createContentBlock` in `src/services/cmsService.js` schrijft deze velden:

| Veld | Type | Herkomst/opmerking |
| --- | --- | --- |
| `id` | string | gelijk aan Firestore document-ID |
| `vakId` | string | overgenomen van parent `paragraaf` |
| `leerjaarId` | string | overgenomen van parent `paragraaf` |
| `niveauId` | string | overgenomen van parent `paragraaf` |
| `hoofdstukId` | string | overgenomen van parent `paragraaf` |
| `paragraafId` | string | parent-ID |
| `type` | string enum | `theory`, `example`, `question`, `media`, `summary`, `game`, `slidedeck` |
| `order` | number | eerstvolgende volgorde binnen paragraaf |
| `title` | string | opgegeven titel of `Nieuw lesblok` |
| `status` | string enum | standaard `draft`, gebruikt met `published` |
| `content` | object | afhankelijk van blocktype |
| `linkedVraagId` | string of null | vooral voor vraagblokken |
| `createdBy` | string | admin user ID |
| `createdAt` | Firestore server timestamp | via `serverTimestamp()` |
| `updatedAt` | Firestore server timestamp | via `serverTimestamp()` |
| `isArchived` | boolean | standaard `false` |

De default `content`-structuren komen uit `src/lib/contentBlockUtils.js`:

```js
export const CONTENT_BLOCK_TYPES = [
  'theory',
  'example',
  'question',
  'media',
  'summary',
  'game',
  'slidedeck'
];
```

```js
export const getDefaultContentForBlockType = (type) => {
  if (type === 'example') {
    return { html: '', steps: [], imageUrl: '', crops: [] };
  }

  if (type === 'media') {
    return {
      html: '',
      mediaKind: 'image',
      mediaUrl: '',
      storagePath: '',
      fileName: '',
      contentType: '',
      size: 0,
      caption: '',
      altText: '',
      thumbnailUrl: '',
      crops: []
    };
  }

  if (type === 'question') {
    return { html: '', exercise: { fields: [] }, crops: [] };
  }

  if (type === 'game') {
    return { html: '', gameId: '', settings: {}, crops: [] };
  }

  if (type === 'slidedeck') {
    return {
      html: '',
      slidedeckPackageId: '',
      deckTitle: '',
      generatedDeckUrl: '',
      generatedDeckStoragePath: '',
      sourcePdfUrl: '',
      sourcePdfStoragePath: ''
    };
  }

  return { html: '', imageUrl: '', crops: [] };
};
```

#### `vraag/{vraagId}`

`createVraag` in `src/services/cmsService.js` schrijft deze velden:

| Veld | Type | Herkomst/opmerking |
| --- | --- | --- |
| `vakId` | string | overgenomen van parent `paragraaf` |
| `leerjaarId` | string | overgenomen van parent `paragraaf` |
| `niveauId` | string | overgenomen van parent `paragraaf` |
| `hoofdstukId` | string | overgenomen van parent `paragraaf` |
| `paragraafId` | string | parent-ID |
| `number` | number/string | formulierdata; soms numeriek verwerkt |
| `title` | string | formulierdata |
| `vraagtype` | string enum | `open`, `meerkeuze`, `numeriek`, `tabel`; default `open` |
| `order` | number | eerstvolgende volgorde binnen paragraaf |
| `status` | string enum | default `draft` |
| `createdBy` | string | admin user ID |
| `createdAt` | Firestore server timestamp | via `serverTimestamp()` |
| `content` | object | `{ text: string, images: array }` bij create |
| `vraagMetadata` | object | zie hieronder |
| `antwoord` | object | afhankelijk van vraagtype |
| `isArchived` | boolean | standaard `false` |
| `updatedAt` | Firestore server timestamp | alleen bij updates via `updateVraag` |

`vraagMetadata` wordt bij create als volgt gevuld:

```js
vraagMetadata: {
  difficulty: data.vraagMetadata?.difficulty || 3,
  hints: data.vraagMetadata?.hints || [],
  showCalculator: data.vraagMetadata?.showCalculator || false,
  calculatorMode: data.vraagMetadata?.calculatorMode || 'standard'
}
```

### Hoe worden vraagblokken opgeslagen?

Vraagblokken worden niet als subcollectie en niet als array in het les-/paragraafdocument opgeslagen.

De actuele opslag is:

1. Een vraagblok is een los document in `contentBlocks/{blockId}` met `type: 'question'`.
2. Dat contentblock bevat `linkedVraagId`.
3. De echte vraaginhoud staat in een apart top-level document `vraag/{vraagId}`.

In `src/components/cms/ContentBlockBuilder.jsx` maakt `handleCreateBlock('question')` eerst een `vraag`-document aan met `cmsService.createVraag(...)` en daarna een `contentBlocks`-document met `linkedVraagId`.

In `src/pages/StudentLessonPage.jsx` worden vraagblokken tijdens het laden verrijkt:

```js
if (block.type !== 'question' || !block.linkedVraagId) return block;
const vraag = await cmsService.getVraag(block.linkedVraagId);
return {
  ...block,
  linkedVraag: vraag,
  title: vraag?.title || block.title
};
```

### Bestaande interfaces of types voor de lesstructuur

Er zijn geen TypeScript `interface`- of `type`-declaraties gevonden. Wel bestaat `src/types/cms.types.js` met JSDoc `@typedef`-types. Hieronder staan de relevante types letterlijk overgenomen:

```js
/**
 * @typedef {Object} Vak
 * @property {string} id - Unique vak ID (e.g., "wiskunde-2024")
 * @property {string} name - Display name (e.g., "Wiskunde")
 * @property {string} code - Subject code (e.g., "WIS")
 * @property {string} icon - Emoji icon (e.g., "ðŸ“")
 * @property {string} beschrijving - Description
 * @property {number} order - Sort order
 * @property {string} createdBy - Admin user ID
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {boolean} isActive - Is this subject active?
 */

/**
 * @typedef {Object} Leerjaar
 * @property {string} id - Unique leerjaar ID
 * @property {string} vakId - Reference to parent vak ID
 * @property {number} year - Year number (1, 2, 3, 4)
 * @property {string} label - Display label (e.g., "VMBO Jaar 1")
 * @property {string[]} niveaus - Array of available levels
 * @property {Date} createdAt
 * @property {boolean} isActive
 */

/**
 * @typedef {Object} Niveau
 * @property {string} id - Unique niveau ID
 * @property {string} vakId - Parent vak ID
 * @property {string} leerjaarId - Parent leerjaar ID
 * @property {string} label - Display label (e.g., "VMBO-B", "HAVO", "VWO")
 * @property {number} order - Sort order
 * @property {Date} createdAt
 * @property {boolean} isActive
 */

/**
 * @typedef {Object} Hoofdstuk
 * @property {string} id - Unique chapter ID
 * @property {string} vakId - Parent vak ID
 * @property {string} leerjaarId - Parent leerjaar ID
 * @property {string} niveauId - Parent niveau ID
 * @property {number} number - Chapter number (e.g., 7)
 * @property {string} title - Chapter title (e.g., "Pythagoras")
 * @property {string} beschrijving - Chapter description
 * @property {number} order - Sort order
 * @property {boolean} published - Is published?
 * @property {string} createdBy - Admin user ID
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {boolean} isArchived - Is archived?
 */

/**
 * @typedef {Object} Paragraaf
 * @property {string} id - Unique paragraph ID
 * @property {string} vakId - Parent vak ID
 * @property {string} leerjaarId - Parent leerjaar ID
 * @property {string} niveauId - Parent niveau ID
 * @property {string} hoofdstukId - Parent chapter ID
 * @property {string} code - Code (e.g., "7.3")
 * @property {string} title - Title (e.g., "Langste zijde berekenen")
 * @property {string} beschrijving - Description
 * @property {number} order - Sort order within chapter
 * @property {boolean} published - Is published?
 * @property {string} createdBy - Admin user ID
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {Date} lastCropUpdate - Last crop modification
 * @property {string} pdfPath - Optional: path to source PDF
 * @property {boolean} aiCompanionEnabled - Enable AI hints?
 * @property {string} aiCompanionPrompt - System prompt for AI
 * @property {number} cropCount - Number of crops attached
 * @property {boolean} isArchived - Is archived?
 */

/**
 * @typedef {Object} VraagContent
 * @property {string} text - Question text (HTML)
 * @property {Array<ImageRef>} images - Attached images
 * @property {Array<TableData>} tables - Attached tables (for tabel questions)
 */

/**
 * @typedef {Object} ImageRef
 * @property {string} cropId - Reference to crop
 * @property {string} position - "above" | "below" | "left" | "right"
 * @property {number} width - Width in pixels
 * @property {string} caption - Optional caption
 */

/**
 * @typedef {Object} TableData
 * @property {number} rows - Number of rows
 * @property {number} cols - Number of columns
 * @property {Array<Array<string>>} data - Table data
 * @property {Array<Array<number>>} editableCells - Which cells are editable [row, col]
 */

/**
 * @typedef {Object} VraagMetadata
 * @property {number} difficulty - Difficulty 1-5 (stars)
 * @property {string[]} hints - Array of hints
 * @property {boolean} showCalculator - Show calculator?
 * @property {string} calculatorMode - "standard" | "scientific"
 * @property {number} estimatedTime - Time in seconds
 * @property {string[]} keywords - Search keywords
 */

/**
 * @typedef {Object} MultiChoiceAntwoord
 * @property {Array<ChoiceOption>} options - Answer options
 */

/**
 * @typedef {Object} ChoiceOption
 * @property {string} id - Option ID (e.g., "opt_a")
 * @property {string} text - Display text
 * @property {boolean} correct - Is this correct?
 * @property {string} explanation - Why is this correct/wrong?
 */

/**
 * @typedef {Object} NumericAntwoord
 * @property {number} correctValue - Correct answer
 * @property {number} tolerance - Tolerance (Â±)
 * @property {string} unit - Unit (e.g., "cmÂ²")
 * @property {string} explanation - Explanation
 */

/**
 * @typedef {Object} OpenAntwoord
 * @property {string} modelAnswer - Model answer text
 * @property {string[]} keywords - Expected keywords
 * @property {Array<RubricPoint>} rubric - Scoring rubric
 */

/**
 * @typedef {Object} RubricPoint
 * @property {number} points - Points for this criterion
 * @property {string} description - What must student show?
 */

/**
 * @typedef {Object} TableAntwoord
 * @property {number} tableIndex - Which table in content.tables
 * @property {Object<string, number>} correctValues - e.g. {"1,1": 16, "2,1": 30.25}
 * @property {number} tolerance - Tolerance for numeric cells
 */

/**
 * @typedef {Object} Vraag
 * @property {string} id - Unique question ID
 * @property {string} vakId - Parent vak ID
 * @property {string} leerjaarId - Parent leerjaar ID
 * @property {string} niveauId - Parent niveau ID
 * @property {string} hoofdstukId - Parent chapter ID
 * @property {string} paragraafId - Parent paragraph ID
 * @property {string} number - Question number (e.g., "14a")
 * @property {string} title - Question title
 * @property {"open"|"meerkeuze"|"numeriek"|"tabel"} vraagtype - Question type
 * @property {VraagContent} content - Question content
 * @property {VraagMetadata} vraagMetadata - Question metadata
 * @property {Object} antwoord - Answer (varies by type)
 * @property {number} order - Sort order within paragraph
 * @property {"draft"|"published"|"archived"} status - Publication status
 * @property {string} createdBy - Admin user ID
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {Date} lastAnswerAt - Last student answer time
 * @property {Object} analytics - Performance analytics
 * @property {boolean} isArchived - Is archived?
 */

/**
 * CMS State - For useCms hook
 * @typedef {Object} CmsState
 * @property {Vak[]} vakken - All subjects
 * @property {Leerjaar[]} leerjaren - Available years
 * @property {Niveau[]} niveaus - Available levels
 * @property {Hoofdstuk[]} hoofdstukken - Available chapters
 * @property {Paragraaf[]} paragrafen - Available paragraphs
 * @property {Vraag[]} vragen - Available questions
 *
 * @property {string|null} selectedVakId - Currently selected vak
 * @property {string|null} selectedLeerjaarId - Currently selected year
 * @property {string|null} selectedNiveauId - Currently selected level
 * @property {string|null} selectedHoofdstukId - Currently selected chapter
 * @property {string|null} selectedParagraafId - Currently selected paragraph
 * @property {string|null} selectedVraagId - Currently selected question
 *
 * @property {boolean} loading - Is loading?
 * @property {string|null} error - Error message if any
 */
```

Er is geen JSDoc typedef voor `ContentBlock` gevonden in `src/types/cms.types.js`. De contentblock-vorm moet uit `cmsService.createContentBlock` en `contentBlockUtils.getDefaultContentForBlockType` worden afgeleid.

## Vraag 2: CMS-opbouw

### Bestaat er een admin/CMS-scherm voor lessen en vraagblokken?

Ja.

De route staat in `src/App.jsx`:

```jsx
<Route path="admin/cms" element={
  <PrivateRoute requireAdmin={true}>
    <AdminCmsPage />
  </PrivateRoute>
} />
```

`src/pages/AdminCmsPage.jsx` rendert direct:

```jsx
export default function AdminCmsPage() {
  return <CmsShell />;
}
```

De hoofdcomponent voor het CMS is:

```text
src/components/cms/CmsShell.jsx
```

Daarin zit de navigatiestructuur, de selectie van vak/leerjaar/niveau/hoofdstuk/paragraaf en de koppeling naar de lesroute-editor.

Voor lesblokken staat de relevante editor hier:

```text
src/components/cms/ContentBlockBuilder.jsx
```

Voor vraagbewerking bestaan deze componenten:

```text
src/components/cms/CreateQuestionModal.jsx
src/components/cms/DualPanelEditor.jsx
src/components/cms/QuestionEditor.jsx
```

Let op: in de huidige `CmsShell.jsx` staan `showLegacyParagraafPanel` en `showLegacyQuestionPanel` op `false`. Daardoor is de oude vraagdetailflow in `DualPanelEditor`/`QuestionEditor` in deze shell niet de standaardroute; de actieve paragraafweergave gebruikt `ContentBlockBuilder`.

### Hoe worden nieuwe lessen of blokken aangemaakt?

#### Nieuwe vakken, leerjaren, niveaus, hoofdstukken en paragrafen

Deze worden aangemaakt via een formuliermodal:

```text
src/components/cms/CreateContentModal.jsx
```

De modal ondersteunt:

```js
type // 'vak' | 'leerjaar' | 'niveau' | 'hoofdstuk' | 'paragraaf'
```

Afhankelijk van `type` roept de modal een servicefunctie aan:

```text
cmsService.createVak(...)
cmsService.createLeerjaar(...)
cmsService.createNiveau(...)
cmsService.createHoofdstuk(...)
cmsService.createParagraaf(...)
```

`CmsShell.jsx` opent deze modal vanuit de sidebar en vanuit het werkvlak. Na aanmaken ververst `CmsShell` de relevante lijst en selecteert het nieuwe item.

#### Nieuwe lesblokken

Nieuwe lesblokken worden aangemaakt via de block editor:

```text
src/components/cms/ContentBlockBuilder.jsx
```

Deze editor toont blocktypes:

```text
Theorie
Voorbeeld
Vraag
Media
Samenvatting
Game
Slidedeck
```

De onderliggende constants zijn:

```js
export const CONTENT_BLOCK_TYPES = [
  'theory',
  'example',
  'question',
  'media',
  'summary',
  'game',
  'slidedeck'
];
```

Bij aanmaken roept `ContentBlockBuilder`:

```text
cmsService.createContentBlock(...)
```

Voor een `question`-block maakt `ContentBlockBuilder` eerst een centraal vraagdocument via:

```text
cmsService.createVraag(...)
```

Daarna wordt het lesblok aangemaakt met `linkedVraagId`.

#### Nieuwe losse vragen

Er bestaat ook een modal:

```text
src/components/cms/CreateQuestionModal.jsx
```

Deze roept direct:

```text
cmsService.createVraag(...)
```

In de huidige gevonden code is `CreateQuestionModal` wel aanwezig, maar binnen `CmsShell.jsx` lijkt de actieve standaardflow voor vraagblokken via `ContentBlockBuilder` te lopen.

### Relevante componenten en routes voor contentbeheer

Routes:

```text
/admin/lesstof
/admin/cms
/admin/crop-tool
/admin/slidedecks
/admin/digibord
/admin/taken-toewijzen
/chapter/:chapterId
```

Belangrijkste bestanden:

| Bestand | Rol |
| --- | --- |
| `src/App.jsx` | Route-definities en admin guards |
| `src/pages/AdminLesstofPage.jsx` | Startpagina voor lesstofbeheer; linkt naar CMS, klaarzetten, digibord en slidedecks |
| `src/pages/AdminCmsPage.jsx` | Rendert de CMS-shell |
| `src/components/cms/CmsShell.jsx` | Hoofdscherm voor CMS-selectie, breadcrumb, detailpanelen en lesroute-editor |
| `src/components/cms/NavigationTree.jsx` | Sidebar-boom voor vak, leerjaar, niveau, hoofdstuk, paragraaf en contentcontext |
| `src/components/cms/CreateContentModal.jsx` | Formuliermodal voor vak/leerjaar/niveau/hoofdstuk/paragraaf |
| `src/components/cms/ContentBlockBuilder.jsx` | Actieve editor voor lesrouteblokken binnen een paragraaf |
| `src/components/cms/CreateQuestionModal.jsx` | Modal voor los vraagdocument |
| `src/components/cms/DualPanelEditor.jsx` | Oude/aanvullende vraagstudio met crop/editor-panelen |
| `src/components/cms/QuestionEditor.jsx` | Vraag-editor voor tekst, metadata, hints en antwoorden |
| `src/hooks/useCms.js` | Laadt en beheert CMS-state en selectiehiërarchie |
| `src/services/cmsService.js` | Centrale CRUD-laag voor Firestore CMS-collecties |
| `src/lib/contentBlockUtils.js` | Blocktypes, default contentstructuren, sortering, preview en slide mapping |
| `src/pages/StudentLessonPage.jsx` | Leerlingweergave van gepubliceerde contentblocks per paragraaf |
| `src/pages/TakenToewijzenPage.jsx` | Koppelt paragrafen en specifieke contentblocks aan klassen/leerlingen |

### Niet gevonden of expliciet afwezig

- Geen `lessons`-collectie gevonden.
- Geen enkel lesdocument waarin alle blokken als array zijn opgeslagen gevonden.
- Geen subcollectie onder `paragraaf/{paragraafId}` voor de huidige `contentBlocks` of `vraag`-documenten gevonden in de actieve CMS-service.
- Geen TypeScript interfaces gevonden; alleen JSDoc typedefs in `src/types/cms.types.js`.
- Geen JSDoc typedef voor `ContentBlock` gevonden.
