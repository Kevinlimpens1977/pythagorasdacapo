# Technisch plan: inclusievarianten

> Versie 1, 23 september 2026. Ter goedkeuring door Kevin. Er is nog niets van gebouwd,
> behalve de helpknop (§9), die nu al uitlegt wat er straks kan.

## 1. Het doel in één alinea

Er is één basisroute per vak. Een klas met het leerprofiel **inclusie** (nu H1i1) volgt
diezelfde route, maar ziet op sommige plekken een **inclusievariant**: een blok of een hele
paragraaf die voor die klas een basisblok of basisparagraaf vervangt. Wat niet afwijkt,
onderhoud je maar één keer. Wat een inclusieklas helemaal niet hoeft te doen, zet je uit
met de blokselectie die al bestaat.

## 2. Uitgangspunten

- **Eén bron.** Geen tweede route met kopieën van hoofdstukken. Dat was in september de reden
  om DV van drie routes naar één te brengen.
- **Een variant is een eigen blok met een eigen id.** Voortgang (`voortgang/{uid}_{blockId}`),
  tokens en nakijken werken daardoor ongewijzigd: de leerling maakt gewoon een blok.
- **Een variant staat op dezelfde plek.** Hij krijgt dezelfde `order` als het basisblok, zodat
  de stap op dezelfde plek in de les staat.
- **De handmatige blokselectie blijft de baas.** Heeft een klas voor een paragraaf een eigen
  lijst (`enabledContentBlocks[pid]`), dan geldt die lijst, ook voor varianten.
- **Geen uitzondering per klas in de code.** De code kijkt naar het profiel van de klas, nooit
  naar de naam H1i1. Dat was ook de lijn bij `inleidingIngeklapt`.

## 3. Datamodel

### 3.1 Klas

| Veld | Waarden | Standaard |
|---|---|---|
| `leerprofiel` | `'standaard'` of `'inclusie'` | ontbreekt = `'standaard'` |
| `studentOverrides.{uid}.leerprofiel` (fase 4) | idem | ontbreekt = profiel van de klas |

Het tweede veld is voor een inclusieleerling in een gewone klas. Dat bouwen we pas in fase 4.

### 3.2 Lesblok (`contentBlocks` en de snapshot `publicContentBlocks`)

| Veld | Op welk blok | Betekenis |
|---|---|---|
| `variantVan` | het variantblok | id van het basisblok dat het vervangt |
| `variantProfiel` | het variantblok | `'inclusie'` (ruimte voor later, bijvoorbeeld `'plus'`) |
| `vervangenVoor` | het basisblok | lijst van profielen waarvoor een variant bestaat, bijv. `['inclusie']` |

`vervangenVoor` is een afgeleid veld: de service zet het bij het maken of verwijderen van een
variant. Het is nodig omdat `firestore.rules` geen andere documenten kan doorzoeken. De regel
kan zo aan het basisblok zelf zien dat het voor een inclusieklas vervangen is.

### 3.3 Paragraaf

| Veld | Betekenis |
|---|---|
| `variantVan` | id van de basisparagraaf |
| `variantProfiel` | `'inclusie'` |

Voor paragrafen is geen regelwijziging nodig. Een paragraaf ziet een leerling alleen als hij
expliciet is toegewezen (`enabledParagrafen`). Het werk zit dus in het klaarzetscherm: dat kiest
bij een inclusieklas de variantparagraaf in plaats van de basis (§6).

## 4. De zichtbaarheidsregel

Eén regel, op drie plekken die gelijk moeten blijven:

```
zichtbaar(blok, klas, leerling) =
  paragraaf toegewezen
  EN blok gepubliceerd en niet gearchiveerd
  EN (
    als er een eigen blokselectie is:   blok staat in de selectie of in de extra's van de leerling
    anders:
      profiel = profiel van de leerling of anders van de klas (standaard als leeg)
      als blok.variantProfiel bestaat:  blok.variantProfiel == profiel
      anders:                           profiel NIET in blok.vervangenVoor
  )
```

| Plek | Wat er verandert |
|---|---|
| `src/lib/assignmentUtils.js` `getAssignedContentBlockIds` (:21) | de tak "geen eigen selectie" filtert op profiel; nieuwe pure functie `isZichtbaarVoorProfiel(blok, profiel)` |
| `src/services/cmsService.js` `getExplicitAssignedBlockIds` / `getAssignedPublicContentBlocks` (:376, :383) | dezelfde filter na het ophalen (nu een kopie van de logica: laten aanroepen op `assignmentUtils`) |
| `firestore.rules` `isAssignedContentBlock` (:102) | extra voorwaarde met `resource.data.variantProfiel`, `resource.data.vervangenVoor` en `studentKlasDoc().data.leerprofiel` |
| `functions/index.js` `isContentBlockAssignedToStudent` (:1462) | krijgt het blok mee en past dezelfde regel toe; callers `assertQuestionAssignedToCaller` (:1480) en `assertAssessmentBlockAssignedToCaller` (:1619) geven het blok door |
| `functions/index.js` `findNulmetingBlocksForKlas` (:3245) | kijkt nu alleen naar `enabledParagrafen`; moet dezelfde regel gebruiken, anders telt een nulmetingvariant dubbel |

De routefilter (`klasRoute.js`) verandert niet; die staat los hiervan.

**Pariteit.** Er is nu geen test die de rules echt uitvoert (`firestoreRules.test.js` zoekt alleen
tekst). Voorstel: één tabel met gevallen (`docs/testcases/zichtbaarheid-varianten.json`) die door
drie tests wordt gelezen: de client-functie, de functions-helper (via `__test` exporteren) en een
tekstcontrole op de rules. Een echte rules-emulatortest (`@firebase/rules-unit-testing`) is beter
maar vraagt de Firebase-emulator; dat is een aparte keuze (§10, vraag 3).

## 5. Lesstofeditor (`ContentBlockBuilder.jsx`, `cmsService.js`)

- Bij elk blok een knop **"Maak inclusievariant"**. Die gebruikt de bestaande
  `duplicateContentBlock` (:786), maar zet `variantVan`, `variantProfiel`, dezelfde `order` en
  de titel "... (inclusie)", en zet op het basisblok `vervangenVoor`.
- `createContentBlock` (:562) en `buildPublicContentBlockSnapshot`
  (`publicContentBlockView.js:247`) werken met een vaste veldenlijst: de drie nieuwe velden moeten
  daar expliciet bij, anders vallen ze weg.
- In de blokkenlijst staat een variant ingesprongen onder zijn basisblok, met een label
  "Inclusie". Verwijderen van een variant haalt `vervangenVoor` weer van het basisblok.
- Verwijderen van een basisblok met een variant: waarschuwing, en de variant wordt dan een
  gewoon blok voor iedereen of wordt mee verwijderd (keuze in het venster).

## 6. Klaarzetten (`/admin/taken-toewijzen`) en klassen (`/admin/klassen`)

- **Klassenpagina** (`AdminKlassenPage.jsx`, naast de routekeuze :93, :459): keuze
  **Leerprofiel: Standaard / Inclusie**. Schrijft `klas.leerprofiel` via een nieuwe
  `updateKlasLeerprofiel` in `klasService.js`.
- **Klaarzetten** (`TakenToewijzenPage.jsx`):
  - Bij een inclusieklas staat bovenaan een label "Leerprofiel: inclusie".
  - Per paragraaf een telling "2 aanpassingen voor inclusie" (aantal varianten).
  - `toggleHoofdstukAssignment` (:730): bij een inclusieklas wordt een paragraaf met een
    inclusievariant vervangen door die variant; bij een standaardklas worden variantparagrafen
    overgeslagen. Pure hulpfunctie `paragrafenVoorProfiel(paragrafen, profiel)` met tests.
  - De blokselectie (`toggleContentBlockAssignment` :753) toont varianten naast hun basisblok,
    zodat je ziet wat de klas werkelijk krijgt.
- **Knop "Hoe zet ik inclusie klaar?"** opent de help op dat onderwerp (§9).

## 7. Docentoverzichten

- `ClassOverview.jsx` maakt nu één kolom per blok (:289, `buildStapKolommen` :1103). Met een
  variant krijgt elke leerling een lege kolom "Niet toegewezen". Oplossing: kolommen groeperen op
  `variantVan || id`, zodat basis en variant één kolom zijn. De cel toont het blok dat die
  leerling werkelijk kreeg, met een klein label "incl." bij een variant.
- `buildParagraafRapport` (`klasVoortgangOverzicht.js:529`) en `LeerlingStappen` werken per
  leerling en blijven kloppen.

## 8. Hoofdstukpijplijn (`bouw-hoofdstuk-seed.mjs`)

- In het bronformaat (`docs/LESBLOKKEN-AANLEVERFORMAAT.md`) krijgt een blok een optioneel veld
  `inclusie: { titel?, html?, vragen?, ... }` met alleen wat afwijkt.
- De bouwer maakt daarvan een tweede blok met id `{basisId}-inclusie` en dezelfde `order`. Het
  mag **niet** als los blok in `blokken[]` worden ingevoegd, want de id's zijn nu
  volgnummergebonden (:115); dan verschuiven alle latere id's.
- De skill `helix-hoofdstuk-bouwen` krijgt een stap: "Welke blokken hebben een inclusieversie
  nodig?"

## 9. Helpknop (nu al gebouwd)

- Een knop **Help** rechtsboven in de beheerbalk (`AppShell.jsx`, naast de adminknoppen).
- Hij opent een zijpaneel met onderwerpen. Het eerste onderwerp is **Inclusie klaarzetten**:
  wat er kan, in welke volgorde, en welke opties je hebt.
- Elke optie heeft een status: **Werkt nu** of **Na de bouw**. De inhoud staat in één bestand
  (`src/lib/helpInhoud.js`). Na elke fase zet je de status van die opties op "Werkt nu".
- Op de klaarzetpagina opent een knop "Hoe zet ik inclusie klaar?" het paneel direct op dat
  onderwerp.

## 10. Fasen

| Fase | Wat | Klaar als |
|---|---|---|
| 0 | Helpknop met de uitleg (dit document, §9) | gebouwd op 23 sep 2026 |
| 1 | Datamodel, `leerprofiel` op de klas, zichtbaarheidsregel op de drie plekken, pariteitstests, deploy van rules en functions | een testleerling in een inclusieklas ziet een variant in plaats van het basisblok, en een leerling in een standaardklas ziet hem niet |
| 2 | Editor: "Maak inclusievariant", velden in de snapshot, varianten zichtbaar in de blokkenlijst | Kevin maakt zelf een variant zonder script |
| 3 | Klaarzetten en overzicht: profielkeuze bij de klas, telling per paragraaf, variantparagrafen bij het klaarzetten van een hoofdstuk, gegroepeerde kolommen in `ClassOverview` | een hoofdstuk klaarzetten voor H1i1 geeft vanzelf de juiste mix |
| 4 | Profiel per leerling, varianten in de hoofdstukpijplijn, de korte nulmeting van H1i1 omzetten naar `variantVan` | een inclusieleerling in een gewone klas werkt |

Schatting: fase 1 een halve dag, fase 2 en 3 samen een halve dag, fase 4 een paar uur.

## 11. Risico's

- **Drie regels die uit de pas lopen.** Daarom één tabel met testgevallen voor alle drie (§4).
- **Rules en functions moeten mee gedeployd worden.** Anders ziet een inclusieleerling in de app
  een variant die de server weigert na te kijken.
- **Bestaande eigen blokselecties.** Die blijven gelden en negeren het profiel. Dat is bewust,
  maar het kan verrassen: de help noemt het.
- **`plaats-nulmeting-h1i1.mjs` overschrijft `enabledParagrafen`** met één paragraaf (:326). Niet
  opnieuw draaien zonder dat te weten; in fase 4 vervangen door de nieuwe regel.
- **De blauwe en paarse DV-route** blijven bestaan voor de nulmetingvoortgang. Ze horen niet bij
  dit plan; wel kan de klaarzetboom ze verbergen.

## 12. Nog open (graag jouw mening)

1. **Profiel per leerling (fase 4)**: nodig, of zijn inclusieleerlingen altijd in een eigen klas?
2. **Meer profielen**: alleen `inclusie`, of ook ruimte voor bijvoorbeeld een plusvariant voor
   snelle leerlingen? Het datamodel kan het, de schermen bouwen we dan voor twee profielen.
3. **Rules-test met de emulator**: echte test (meer werk, meer zekerheid) of de tabel met
   gevallen voor client en functions plus een tekstcontrole op de rules?
4. **Basisblok verwijderen terwijl er een variant is**: variant mee weg, of variant wordt gewoon
   blok? Voorstel: vragen in het venster.
