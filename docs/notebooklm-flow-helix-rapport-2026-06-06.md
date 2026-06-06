# NotebookLM-flow binnen HELIX

Datum: 2026-06-06  
Scope: hoe een docent NotebookLM kan gebruiken om brongebaseerde content te maken en deze als slidedeck binnen een HELIX-lesroute in te zetten.

## Korte conclusie

HELIX heeft op dit moment een hybride NotebookLM-workflow:

1. De docent maakt in HELIX een NotebookLM-pakket met onderwerp, leerdoelen, brontekst, afbeeldingen, contextkoppeling en prompt.
2. HELIX maakt daar een bron-PDF en prompt-snapshot van.
3. De docent gebruikt die bron-PDF en prompt handmatig in NotebookLM om een slidedeck te genereren.
4. De docent downloadt de NotebookLM-presentatie als PDF of PowerPoint en uploadt de presentatie-PDF terug in HELIX.
5. Daarna kan de docent het slidedeck kiezen in een `slidedeck`-blok binnen de CMS-lesroute.
6. Leerlingen en docenten kunnen het deck openen in de leerlingroute en op het digibord via de PDF-presenter.

De workflow is dus nog geen volledig geautomatiseerde AI-pipeline. Het is juist een gecontroleerde productiestroom: HELIX maakt een nette bronbasis, NotebookLM maakt een presentatie, de docent controleert, en HELIX publiceert pas de geuploade PDF in de lesroute.

## Wat NotebookLM in deze flow doet

NotebookLM is in deze toepassing vooral een brongebaseerde onderwijsassistent. De docent geeft NotebookLM een afgebakende set bronnen, bijvoorbeeld de HELIX-bron-PDF, afbeeldingen, theorie, voorbeeldopgaven en leerdoelen. NotebookLM kan daar vervolgens een slide deck van maken.

Volgens de officiele NotebookLM-hulp kan een gebruiker:

- bronnen uploaden naar een notebook;
- een slide deck genereren via het Studio-paneel;
- voorkeuren meegeven zoals format, taal, lengte en prompt;
- het deck presenteren in NotebookLM;
- het deck downloaden als PDF of PowerPoint.

Belangrijk: NotebookLM geeft zelf aan dat slide decks AI-gegenereerd zijn en visuele of feitelijke onnauwkeurigheden kunnen bevatten. De docentcontrole is dus geen extra luxe, maar een noodzakelijke stap.

## Hoe HELIX de NotebookLM-flow nu ondersteunt

### 1. Slidedeckcreator: bronpakket maken

Locatie in HELIX: `Lesstof > Slidedecks` (`/admin/slidedecks`).

De pagina `src/pages/AdminSlidedecksPage.jsx` bevat de huidige Slidedeckcreator. De docent vult daar in:

- onderwerp / titel;
- vak;
- leerjaar;
- niveau;
- hoofdstuk;
- paragraaf;
- leerdoelen;
- brontekst / lesinhoud;
- afbeeldingen;
- prompttemplate.

Alleen de titel is technisch verplicht. Leerdoelen en brontekst kunnen op dit moment leeg blijven, waarna de bron-PDF fallbackteksten krijgt zoals "Nog geen leerdoelen ingevuld" en "Nog geen brontekst ingevuld". Didactisch is dat niet wenselijk: voor goede NotebookLM-output moet de docent juist voldoende bronmateriaal invullen.

### 2. HELIX maakt een bron-PDF

De functie `createSourcePdfBlob` in `src/lib/sourcePdfGenerator.js` maakt een PDF met:

- onderwerp;
- leerdoelen;
- brontekst / lesinhoud;
- extra pagina's voor geuploade afbeeldingen.

Die PDF is bedoeld als compacte, nette bron voor NotebookLM. De waarde hiervan is dat NotebookLM niet hoeft te gokken op losse context: de bronbasis staat in een document dat de docent zelf heeft samengesteld.

### 3. HELIX bewaart prompt en metadata

De service `src/services/slidedeckService.js` maakt een Firestore-document in `slidedeckPackages` en uploadt bestanden naar Firebase Storage:

- `slidedecks/{packageId}/source.pdf`
- `slidedecks/{packageId}/assets/...`
- later: `slidedecks/{packageId}/generated-deck.pdf`

Het pakket bewaart onder andere:

- `title`
- `learningGoals`
- `sourceText`
- `linkedContext`
- `promptTemplateId`
- `promptTemplateName`
- `promptSnapshot`
- `sourcePdf`
- `sourceAssets`
- `generatedDeckPdf`
- `status`

De status is eerst `sourceReady`. Na upload van de NotebookLM-PDF wordt dit `deckUploaded`.

### 4. Prompttemplate voor digibordlessen

De standaardprompt staat in `src/lib/notebookPromptTemplates.js`. Die prompt stuurt NotebookLM richting:

- VMBO / EOA;
- Nederlands;
- klassikale uitleg op het digibord;
- korte zinnen;
- maximaal een denkstap per slide;
- vraag-slide en antwoord-slide;
- leerdoelen, begrippen, voorbeelden, veelgemaakte fouten, oefening en samenvatting;
- uitsluitend gebruik van toegevoegde bronbestanden.

Dit past goed bij HELIX, omdat de lesroute niet alleen een presentatie is. Het deck kan de klassikale uitleg dragen, terwijl HELIX daarna interactieve vragen, games, quizzen, toetsen en samenvattingen kan tonen.

## Praktische docentworkflow

### Stap A - Bepaal de plek in de lesroute

Vooraf kiest de docent waar het slidedeck in de lesroute hoort:

- als opening van een paragraaf;
- als klassikale uitleg voor een nieuw begrip;
- als stap-voor-stap voorbeeld;
- als herhaling voor een toets;
- als instructie voordat leerlingen zelfstandig oefenen.

Advies: gebruik een NotebookLM-slidedeck niet als volledige lesroute. Gebruik het als uitlegmoment binnen een route met HELIX-blokken eromheen.

Sterke lesroute:

1. `slidedeck` voor startvraag, leerdoelen en uitleg.
2. `theory` of `example` voor korte naslag.
3. `question` voor directe check.
4. `game` of oefenblok voor actieve verwerking.
5. `quiz` of `toets` voor controle.
6. `summary` voor afronding.

### Stap B - Maak een NotebookLM-pakket in HELIX

De docent opent `/admin/slidedecks` en maakt een nieuw NotebookLM-pakket.

Minimale inhoud die de docent moet invullen:

- duidelijke titel, bijvoorbeeld "Pythagoras: schuine zijde berekenen";
- leerdoelen, een per regel;
- theorie in korte alinea's;
- minimaal een uitgewerkt voorbeeld;
- eventuele veelgemaakte fouten;
- taalsteun of begrippenlijst voor EOA/taalzwakke leerlingen;
- afbeeldingen of schema's als die het begrip visueel maken.

Goed bronmateriaal levert beter resultaat op dan een lange algemene prompt. NotebookLM kan de presentatie mooier structureren, maar de inhoudelijke kwaliteit blijft afhangen van de bronnen die de docent aanlevert.

### Stap C - Download bronbestand en kopieer prompt

Na "Maak NotebookLM-bestanden" verschijnt het pakket in de bibliotheek.

De docent gebruikt:

- `Download` bij bronbestand: dit is de HELIX-bron-PDF;
- `Prompt`: kopieert de prompt-snapshot.

Die prompt-snapshot is belangrijk voor herhaalbaarheid. Later is zichtbaar met welke instructie het deck is gemaakt.

### Stap D - Werk in NotebookLM

In NotebookLM doet de docent:

1. Maak een nieuw notebook aan, bij voorkeur per paragraaf of lesonderwerp.
2. Upload de HELIX-bron-PDF als bron.
3. Voeg eventueel extra bronnen toe, maar alleen als ze echt bij deze les horen.
4. Open Studio en kies `Slide Deck`.
5. Kies bij voorkeur een presentatiestijl die past bij digibordgebruik.
6. Plak de HELIX-prompt in het promptveld.
7. Genereer het slide deck.
8. Controleer het deck kritisch.
9. Download het deck als PDF of PowerPoint.

Advies voor HELIX: upload in HELIX de PDF-versie, omdat de huidige HELIX-presenter PDF-decks rendert.

### Stap E - Controleer het NotebookLM-deck

De docent controleert minimaal:

- Staat er geen theorie in die niet in de bronnen stond?
- Kloppen alle voorbeelden en antwoorden?
- Is het taalniveau geschikt voor VMBO / EOA?
- Heeft elke slide een duidelijke functie?
- Zijn vraag- en antwoordslides gescheiden?
- Zijn afbeeldingen passend en niet misleidend?
- Zijn er geen persoonsgegevens of gevoelige leerlingdata gebruikt?
- Is het deck kort genoeg voor klassikaal gebruik?

Richtlijn: voor een normale klassikale uitleg is 8 tot 15 slides vaak sterker dan 20+ slides. Maak liever een compact deck met daarna actieve HELIX-vragen.

### Stap F - Upload de presentatie-PDF terug in HELIX

Terug in `/admin/slidedecks` uploadt de docent de NotebookLM-PDF bij het pakket via `Upload deck`.

HELIX slaat dit op als `generatedDeckPdf` en zet de status naar `deckUploaded`. Vanaf dat moment is het pakket beschikbaar voor CMS-blokken.

### Stap G - Koppel het deck aan een lesroute

In de CMS-lesroute voegt de docent een `slidedeck`-blok toe of bewerkt een bestaand slidedeckblok.

De editor in `src/components/cms/ContentBlockBuilder.jsx` laadt alleen deck-ready pakketten op: pakketten met een geuploade `generatedDeckPdf`. Bij selectie bewaart het blok:

- `slidedeckPackageId`
- `deckTitle`
- `generatedDeckUrl`
- `generatedDeckStoragePath`
- `sourcePdfUrl`
- `sourcePdfStoragePath`

Dat is verstandig: een leeg bronpakket zonder geuploade presentatie komt niet zomaar in de lesroute terecht.

### Stap H - Gebruik in leerlingroute en digibord

In `src/pages/StudentLessonPage.jsx` wordt een `slidedeck`-blok getoond als presentatieblok met knop `Presentatie openen`.

De component `src/components/digibord/PdfSlideDeckPresenter.jsx` opent de PDF, rendert pagina's met `pdfjs-dist`, en ondersteunt navigatie tussen slides. Voor de docent betekent dit:

- klassikaal gebruiken op het digibord;
- leerlingen kunnen het deck in de route openen;
- PDF blijft bruikbaar als stabiele presentatievorm.

## Waarvoor deze flow didactisch sterk is

Deze NotebookLM-flow is vooral sterk voor:

- start van een paragraaf;
- klassikale uitleg;
- visuele begripsintroductie;
- stapsgewijze voorbeelden;
- checkvragen tijdens de uitleg;
- herhaling voor een toets;
- taalsteun voor EOA/taalzwakke leerlingen;
- snel omzetten van bestaand lesmateriaal naar een digiborddeck.

Voorbeelden:

- Wiskunde: "Stelling van Pythagoras" met bronuitleg, rechthoekige driehoek, voorbeeldopgaven en fouten.
- Digitale vaardigheden: "Sterke wachtwoorden" met regels, voorbeelden, foute wachtwoorden en klassikale checks.
- Nederlands/EOA: "Hoofdgedachte vinden" met tekstfragmenten, markeringen en voorbeeldvragen.

## Waarvoor deze flow minder geschikt is

Gebruik NotebookLM niet als enige bron voor:

- formele toetsvragen zonder docentcontrole;
- automatisch nagekeken oefeningen;
- persoonlijke feedback op leerlingniveau;
- content met persoonsgegevens;
- onderwerpen waarbij exactheid cruciaal is zonder extra controle;
- complete lesroutes zonder interactieve verwerking.

NotebookLM maakt een presentatie. HELIX moet daarna de leeractiviteit dragen: oefenen, vragen beantwoorden, voortgang meten en feedback geven.

## Huidige sterke punten in HELIX

1. Bron en output blijven gescheiden.
   De bron-PDF en gegenereerde deck-PDF worden apart bewaard. Dat maakt controle mogelijk.

2. Prompt wordt als snapshot opgeslagen.
   De docent kan later zien met welke instructie het deck is gemaakt.

3. Contextkoppeling aan lesstofstructuur.
   Een pakket kan gekoppeld worden aan vak, leerjaar, niveau, hoofdstuk en paragraaf.

4. CMS toont alleen geuploade decks.
   De lesroute kiest uit pakketten waar al een NotebookLM-PDF bij staat.

5. PDF-presenter is geschikt voor digibord.
   De huidige presenter laadt PDF-bytes via Storage of download-URL en toont pagina's als slides.

## Huidige aandachtspunten

1. Leerdoelen en brontekst zijn niet verplicht.
   Technisch kan een docent een zwak bronpakket maken. Didactisch zou minimaal leerdoelen + broninhoud verplicht moeten zijn.

2. De NotebookLM-stap is handmatig.
   De docent moet zelf naar NotebookLM, bron uploaden, prompt plakken, deck downloaden en PDF terug uploaden.

3. Er is nog geen reviewstatus.
   Een geuploade PDF is meteen deck-ready. Er is geen aparte status zoals `needsReview`, `approved` of `publishedForRoute`.

4. Geen bronverwijzingen per slide.
   HELIX bewaart de bron-PDF, maar niet welke slide op welke bronpassage gebaseerd is.

5. Geen JSON/HTML-export in deze app-flow.
   De projectdocumentatie noemt PDF + JSON + HTML, maar de huidige adminflow werkt vooral met bron-PDF, prompt-snapshot en gegenereerde deck-PDF.

6. Geen inline pakket maken vanuit het CMS-blok.
   Een docent die in de lesroute een leeg slidedeckblok ziet, moet zelf naar `Lesstof > Slidedecks`.

7. Slidedeck blijft passief zonder omliggende blokken.
   De echte leerroute ontstaat pas wanneer de docent na het deck vragen, voorbeelden, games of quizzen toevoegt.

## Aanbevolen werkwijze voor docenten

Gebruik deze vuistregel:

> NotebookLM maakt de klassikale uitleg. HELIX maakt er een lesroute van.

Praktisch betekent dit:

1. Maak per paragraaf een NotebookLM-pakket.
2. Voeg alleen betrouwbare broninhoud toe.
3. Laat NotebookLM een kort digiborddeck maken.
4. Controleer en verbeter het deck.
5. Upload de PDF in HELIX.
6. Koppel het deck aan een `slidedeck`-blok.
7. Zet direct daarna een of meer HELIX-vragen.
8. Sluit af met oefening, game, quiz of samenvatting.

## Voorbeeldroute: Pythagoras

Paragraaf: Stelling van Pythagoras.

Bronpakket in HELIX:

- Titel: "Pythagoras: rechthoekige driehoeken"
- Leerdoelen:
  - Ik herken de rechthoekige driehoek.
  - Ik wijs de schuine zijde aan.
  - Ik gebruik `a^2 + b^2 = c^2`.
  - Ik bereken een ontbrekende zijde stap voor stap.
- Brontekst:
  - uitleg rechthoekige driehoek;
  - betekenis van rechthoekszijden en schuine zijde;
  - twee uitgewerkte voorbeelden;
  - veelgemaakte fout: verkeerde zijde als `c` kiezen.
- Afbeeldingen:
  - driehoek met labels;
  - voorbeeldopgave uit boek of eigen schema.

NotebookLM-output:

- 10 tot 14 slides;
- startvraag;
- leerdoelen;
- begrippen;
- voorbeeld 1;
- korte leerlingvraag;
- antwoordslide;
- voorbeeld 2;
- veelgemaakte fout;
- nu-jij-slide;
- samenvatting.

HELIX-route:

1. `slidedeck`: NotebookLM-PDF.
2. `example`: kort uitgewerkt voorbeeld als naslag.
3. `question`: wijs de schuine zijde aan.
4. `question`: bereken ontbrekende zijde.
5. `quiz`: 3 tot 5 checks.
6. `summary`: onthoudzin en stappenplan.

## Voorbeeldroute: Digitale vaardigheden

Paragraaf: Sterke wachtwoorden en accountveiligheid.

Bronpakket in HELIX:

- regels voor sterke wachtwoorden;
- voorbeelden van zwak/sterk;
- 2FA;
- phishing-waarschuwing;
- schoolcontext zonder echte leerlingdata.

NotebookLM-output:

- opener met slecht wachtwoordvoorbeeld;
- regels in korte taal;
- klassikale check: "Wat is hier onveilig?";
- verbeterde wachtwoordzin;
- 2FA-uitleg;
- afsluitende oefenvraag.

HELIX-route:

1. `slidedeck`: klassikale uitleg.
2. `question`: herken zwak wachtwoord.
3. `game`: accountveiligheid game.
4. `summary`: 3 regels die leerlingen moeten onthouden.

## Verbeteringen die HELIX later sterker maken

1. Verplicht bronkwaliteit.
   Maak leerdoelen en brontekst verplicht, of toon een kwaliteitswaarschuwing bij lege bronvelden.

2. Voeg reviewstatus toe.
   Gebruik statussen zoals `sourceReady`, `deckUploaded`, `needsReview`, `approved`, `linkedToRoute`.

3. Voeg docentchecklist toe bij upload.
   Laat de docent aanvinken: brongetrouw, gecontroleerd, taalniveau passend, geen persoonsgegevens.

4. Maak CMS-koppeling directer.
   Voeg in een leeg `slidedeck`-blok een knop toe: "Maak NotebookLM-pakket voor deze paragraaf".

5. Bewaar generatie-manifest.
   Naast promptSnapshot ook opslaan: NotebookLM-notebooknaam, exportdatum, bestandsnaam, gekozen format, taal, lengte en docentnotities.

6. Voeg JSON/HTML-export toe.
   Als de app later meer dan PDF wil tonen, kan een deck ook als gestructureerde slide-data worden opgeslagen.

7. Voeg bronlabels toe.
   Gebruik labels zoals `SOURCE_BASED`, `AI_SUGGESTION`, `NEEDS_REVIEW` en `TEACHER_DECISION`, passend bij de projectnotities.

8. Maak review naast elkaar mogelijk.
   Toon bron-PDF links, NotebookLM-PDF rechts en checklist/docentnotities ernaast.

## Bronnen

Officiele NotebookLM-documentatie:

- Generate a Slide Deck in NotebookLM: https://support.google.com/notebooklm/answer/16757456?hl=en
- Add or discover new sources for your notebook: https://support.google.com/notebooklm/answer/16215270?co=GENIE.Platform%3DDesktop&hl=en
- Create a notebook in NotebookLM: https://support.google.com/notebooklm/answer/16206563?hl=en
- Learn about NotebookLM: https://support.google.com/notebooklm/answer/16164461?hl=en

Lokale HELIX-bronnen:

- `src/pages/AdminSlidedecksPage.jsx`
- `src/services/slidedeckService.js`
- `src/lib/sourcePdfGenerator.js`
- `src/lib/notebookPromptTemplates.js`
- `src/components/cms/ContentBlockBuilder.jsx`
- `src/pages/StudentLessonPage.jsx`
- `src/components/digibord/PdfSlideDeckPresenter.jsx`
- `src/lib/contentBlockUtils.js`
- `src/lib/digibordSlideUtils.js`
- `src/lib/presenterContentImport.js`
