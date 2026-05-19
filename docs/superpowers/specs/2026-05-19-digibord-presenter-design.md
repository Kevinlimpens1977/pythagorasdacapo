# Digibord Presenter V1 Design

Datum: 2026-05-19
Project: HELIX leerplatform
Status: ontwerp goedgekeurd voor planvorming

## Aanleiding

De huidige Digibord-presenter toont bij nieuwe CMS-lessen soms `Slides niet gevonden`, terwijl er wel inhoud in de paragraaf staat. De oorzaak is architectonisch: de presenter gebruikt nog de oude slide/vraag-logica via `slideService`, terwijl de actuele CMS-lesroute is opgebouwd uit `contentBlocks`.

V1 herbouwt Digibord daarom als presentatielaag bovenop dezelfde CMS-lesroute die leerlingen zien.

## Doel

Docenten moeten een paragraaf uit de CMS-lesroute kunnen openen als professionele digibordpresentatie. De presenter gebruikt de bestaande lesblokken in volgorde en zet die automatisch om naar duidelijke klassikale slides.

## Gekozen Richting

Digibord Presenter V1 gebruikt optie 1 voor de databron:

- de CMS-lesroute is leidend;
- `contentBlocks` worden direct geladen voor de gekozen paragraaf;
- de volgorde uit de leerlingroute blijft gelijk;
- de oude `vraag`/slide-collectie is niet langer leidend voor Digibord.

## Presentatiegedrag

Een lesblok hoeft niet precies een slide te blijven. Een lesblok kan meerdere digibordslides opleveren wanneer de inhoud daar om vraagt.

Splitsing gebeurt inhoudsgestuurd:

- kopjes starten logische nieuwe slides;
- alinea's blijven zo veel mogelijk intact;
- lijsten blijven overzichtelijk bij elkaar;
- afbeeldingen worden beoordeeld op rol en formaat;
- kleine ondersteunende beelden blijven bij de tekst;
- grote of detailrijke afbeeldingen krijgen een eigen beeldslide.

## Vraagblokken

Vraagblokken worden klassikaal bruikbaar gemaakt:

- eerst wordt de vraag getoond;
- antwoord of uitleg is standaard verborgen;
- de docent krijgt een knop `Toon antwoord`;
- dit voorkomt dat leerlingen het antwoord direct zien tijdens klassikale bespreking.

V1 gebruikt wat er al beschikbaar is in het gekoppelde vraagdocument of in de block-content. Als er nog geen antwoord/uitleg beschikbaar is, toont de presenter een nette lege staat in plaats van te crashen.

## Concepten Tonen

Standaard toont Digibord alleen gepubliceerde lesblokken. De docent krijgt een toggle `Concepten tonen`.

Gedrag:

- uit: alleen gepubliceerde blokken;
- aan: gepubliceerde en conceptblokken;
- bedoeld voor lesvoorbereiding en testpresentaties;
- leerlingenlogica wordt hierdoor niet aangepast.

## Visuele Stijl

Gekozen stijl: lichte HELIX-modus.

Kenmerken:

- lichte achtergrond;
- witte of zeer lichtgrijze slides;
- blauwe HELIX-accenten;
- grote, rustige typografie;
- veel witruimte;
- geschikt voor digibord/projector zonder donkere theatermodus als standaard.

De presenter krijgt standaard een focusmodus. De normale app-header en toolbar zijn verborgen of compact, maar de docent kan chrome tonen/verbergen met een toggle.

## Presenterbediening

V1 bevat een praktische lesmodus:

- vorige slide;
- volgende slide;
- sluiten;
- slide-teller;
- slide-overzicht;
- knop `Toon antwoord` bij vraagblokken;
- focus/fullscreen-toggle;
- toggle `Concepten tonen`.

Docenttools zoals timer, laserpointer, tekenpen en notities vallen buiten V1.

## Technische Architectuur

### Nieuwe Mapper

Introduceer een mapper, bijvoorbeeld:

```ts
contentBlocksToDigibordSlides(blocks, options)
```

Verantwoordelijkheden:

- contentblocks normaliseren en sorteren;
- concepten filteren afhankelijk van `includeDrafts`;
- HTML-content parseren naar structurele segmenten;
- tekst, lijsten en afbeeldingen omzetten naar presenter-slides;
- vraagblokken verrijken met gekoppelde vraagdata waar nodig;
- stabiele slide-id's genereren op basis van `blockId` en segmentindex.

### Datamodel Voor Digibordslides

Conceptueel contract:

```ts
type DigibordSlide = {
  id: string;
  blockId: string;
  sourceType: 'theory' | 'example' | 'question' | 'media' | 'summary' | 'game';
  variant: 'text' | 'image' | 'mixed' | 'question';
  title: string;
  html?: string;
  imageUrl?: string;
  altText?: string;
  question?: {
    promptHtml?: string;
    imageUrl?: string;
    answerHtml?: string;
    explanationHtml?: string;
  };
  meta: {
    blockOrder: number;
    segmentIndex: number;
    status?: 'published' | 'draft';
  };
};
```

### Dataflow

1. Admin kiest paragraaf in `/admin/digibord`.
2. Presenter laadt `contentBlocks` voor deze paragraaf.
3. Optioneel worden gekoppelde vragen opgehaald voor vraagblokken.
4. Mapper zet de lesroute om naar `DigibordSlide[]`.
5. Presenter rendert slides in lichte HELIX-stijl.
6. Interactieve state zoals huidig slide-nummer en antwoord zichtbaar blijft lokaal in de presenter.

Er zijn geen Firestore-schemawijzigingen nodig voor V1.

## Betrokken Bestanden

Waarschijnlijk te wijzigen bij implementatie:

- `src/pages/AdminDigibordPage.jsx`
- `src/components/digibord/DigibordViewer.jsx`
- `src/services/slideService.js` of een nieuwe digibord-specifieke service
- `src/lib/contentBlockUtils.js`
- nieuw: `src/lib/digibordSlideUtils.js`
- tests naast de nieuwe mapper, bijvoorbeeld `src/lib/digibordSlideUtils.test.js`

Mogelijk te hergebruiken:

- `src/services/cmsService.js`
- `src/lib/contentBlockUtils.js`
- bestaande slidecomponenten alleen waar ze nog passen.

## Error Handling

Lege of incomplete content krijgt taakgerichte meldingen:

- geen lesblokken: `Deze paragraaf heeft nog geen lesroute`;
- alleen concepten en toggle uit: `Geen gepubliceerde blokken`;
- vraag zonder antwoord: knop `Toon antwoord` wordt verborgen of toont `Nog geen antwoord ingevuld`;
- kapotte afbeelding: slide blijft bruikbaar met alt-tekst of een rustige fallbackweergave.

De tekst `Slides niet gevonden` verdwijnt uit de nieuwe V1-flow.

## Teststrategie

Minimaal testen:

- paragraaf met theorieblok levert slides op;
- lang theorieblok splitst op kopjes/alinea's;
- afbeelding in rich text wordt als beeld of mixed slide verwerkt;
- vraagblok toont antwoord pas na actie;
- `Concepten tonen` filtert correct;
- lege paragraaf toont nette lege staat;
- oude vraagloze content crasht niet;
- volgorde van CMS-lesroute blijft behouden.

## Buiten Scope Voor V1

- losse digibordpresentaties apart van de leerlingroute;
- handmatige slide-editor;
- tekenpen, timer, laserpointer;
- presenter-notities;
- analytics van digibordgebruik;
- synchronisatie met leerlingapparaten;
- server-side PDF export.

## GO-Momenten

GO 1: implementatieplan schrijven op basis van dit ontwerp.

GO 2: mapper en tests bouwen zonder UI-risico.

GO 3: `DigibordViewer` aansluiten op `contentBlocks`.

GO 4: lichte HELIX-presenter UI bouwen.

GO 5: browserpreview op `/admin/digibord` met echte CMS-paragraaf.

GO 6: build/lint draaien, committen en pushen.
