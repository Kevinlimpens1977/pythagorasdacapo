# HELIX Projectkompas

Laatst bijgewerkt: 3 juni 2026

Dit document is het vaste contextanker voor verdere ontwikkeling van HELIX. Lees dit bestand eerst na contextcompressie, bij een nieuwe agent-sessie of voordat je grotere productkeuzes maakt. Het doel is niet om alle details te herhalen, maar om een frisse agent snel en correct op de rails te zetten.

## Nieuwe Chat Startcontext

Als een nieuwe Codex-chat dit document leest, moet die vooral dit weten:

- Werk op branch `feature/cms-platform`, tenzij de gebruiker iets anders zegt.
- Firebase/appnaam is visueel HELIX, maar Firebase project/config kan nog `pythagoras-eoa` heten.
- Dev server voor dit project draait doorgaans op `http://localhost:5173/`. Poort `5174` draaide eerder een ander project.
- Er is een GitHub-backupbranch gemaakt voor de Digidocent-leerflow: `backup/digidocent-before-learning-flow`.
- Recente hoofdflow: de leerlingroute is uitgebreid met Digidocent, AI/open-antwoordbeoordeling, voortgangsblokjes, herstelopdrachten/challenge en leerling-foutmeldingen.
- Adminnavigatie is nu: `Lesstof`, `Voortgang`, `Leerlingen`, `Meldingen`, `Spellen`, `Presenter`, `Instellingen`. De oude hoofdknop `Beheer` en de oude Admin Hub zijn verwijderd.
- Bekende ongerelateerde untracked items kunnen in gitstatus staan: `.superpowers/`, `exports/helix-button-gradient-options.html`, `exports/presenter-smoke/` en `exports/presenter-toolbar-style-options.html`. Niet automatisch stagen of verwijderen.
- De gebruiker wil vaak eerst bevraagd worden bij grote productkeuzes, maar gaf voor de huidige Digidocent- en meldingenrichting expliciet akkoord.
- Volledige lint kan bestaande schuld raken. Gebruik gericht `npx eslint <aangepaste bestanden>`, gerichte `node --test ...` en `npm run build`.

Recente commits die een nieuwe chat moet kennen:

- `b16b901 feat: vervang beheer door instellingen`
- `c51e6a7 style: stem presenter en voortgang chrome af`
- `aafe2bc style: gebruik helix borderstijl voor headernav`
- `76fb702 style: maak presenter lesstof import direct`
- `92091b1 feat: voeg klasfilter toe aan voortgangsdashboard`
- `88f38b6 fix: toon leerlingfotos in voortgang`
- `80a247a feat: verbeter voortgangsdashboard signalen`
- `4a06bc1 feat: voeg leerling foutmeldingen toe`

## Productvisie

HELIX is een rustig, professioneel en schaalbaar leerplatform voor docenten en leerlingen. Docenten bouwen leerstof als lesroutes, leerlingen volgen die routes stap voor stap, en digibord, Presenter, NotebookLM-slidedecks, spellen, crop/OCR en voortgangsinzicht komen samen in een enkele onderwijsworkflow.

De noordster:

```text
Docent maakt materiaal
-> organiseert dit als lesroute
-> publiceert of wijst toe
-> leerling volgt de route
-> voortgang wordt zichtbaar
-> docent gebruikt digibord, Presenter, slidedecks en spellen voor klassikale en individuele ondersteuning.
```

De inhoudelijke startcontext is VMBO 1-2 wiskunde rond Pythagoras, maar de architectuur is bewust breder opgezet als onderwijs-CMS.

## Huidige Technische Basis

- Frontend: React 19, Vite, Tailwind CSS 4, lucide-react.
- Backend/data: Firebase Authentication, Firestore en Firebase Storage.
- Belangrijke routes staan in `src/App.jsx`.
- Adminnavigatie staat in `src/lib/adminWorkspaceNav.js`.
- Lesbloktypes staan in `src/lib/contentBlockUtils.js`.
- Vraagtypes staan in `src/lib/questionTypeRegistry.js`.
- Presenter-code staat hoofdzakelijk in `src/components/presenter/` en `src/lib/presenter*.js`.
- Digidocent/leerlingroute staat hoofdzakelijk in `src/pages/StudentLessonPage.jsx`, `src/components/slides/AITutorChat.jsx` en `src/lib/aiTutor*.js`.
- Leerling-foutmeldingen staan in `src/components/studentBugReports/`, `src/pages/AdminMeldingenPage.jsx`, `src/lib/studentBugReportUtils.js` en `src/services/studentBugReportService.js`.
- Firebase config gebruikt technisch nog project ID `pythagoras-eoa`, ook als projectnaam/appnaam in Firebase visueel naar HELIX is aangepast.

## Hoofdmodules

### Lesstof

Centrale docentwerkplek voor CMS, lesroutes, contentblocks, crop/OCR, slidedecks, digibordmateriaal en vraagblokken.

Belangrijk:

- `Lesstof` is de hoofdwerkplek voor materiaalproductie.
- CMS gebruikt een navigatieboom en lesroute-builder.
- Contentblocks zijn de centrale waarheid voor leerlingroutes en digibordpresentatie.
- Vraag is geen losse hoofdflow, maar een lesbloktype binnen een bredere lesroute.

### Voortgang

Werkplek voor klasdashboard, leerlingvoortgang en didactische signalen.

Huidig:

- Analyse per klas, geselecteerde klas, paragraaf, leerling en vraag.
- Klasoverzicht heeft nu een functionele klasselector.
- De vier dashboardlenzen zijn `Klas`, `Signalen`, `Paragraaf` en `Leerling`.
- De drie kernblokken richten zich op docentbesluitvorming: `Nu aandacht`, `Klasbeheersing` en `Lesvoortgang`.
- Leerlingdetail toont alleen onderdelen die daadwerkelijk aan de leerling gekoppeld/toegewezen zijn; niet-toegewezen paragrafen worden niet als `nog niet gestart` getoond.
- Leerlingfoto's uit leerlingbeheer worden ook gebruikt in voortgangsoverzichten en profielkoppen waar beschikbaar.
- Voortgangsblokjes in de leerlingroute tonen de status van vraagblokken.
- Groen betekent goed afgerond zonder echte Digidocent-chat.
- Groen met rood stippellijntje betekent goed afgerond met actieve Digidocent-hulp.
- Rood betekent na maximaal vier foutieve pogingen geparkeerd voor herstel.
- Amber betekent dat AI/open-antwoordbeoordeling faalde, maar de leerling mag nooit vastlopen.
- Paragraafafsluiting kiest herstel of uitdaging op basis van de kernvraagresultaten.

Open richting:

- Verdere verfijning van knelpuntanalyse en vraagpatronen.
- Exports en printvriendelijke rapportage.
- Betere analyse van Digidocent-gebruik versus zelfstandig succes.

### Leerlingen

Werkplek voor leerlingaccounts, klasstatus, klassenbeheer, foto's en accountoverzicht.

Huidig:

- Toont leerlingen uit `users` met rol `student`.
- Toont naam, e-mail, klas, leerlingnummer, laatste activiteit/accountstatus en avatar/foto indien aanwezig.
- Heeft acties voor auth synchroniseren, leerlingnummers koppelen, foto's importeren en klassen beheren.
- Klassenbeheer is bereikbaar via `Leerlingen` en route `/admin/klassen`; de topnav-active state valt daar ook onder `Leerlingen`.
- Wachtwoordbeheer per leerling is aanwezig.
- Leerlingfoto's worden centraal via `StudentAvatar` hergebruikt in leerlinglijst en voortgang.

### Meldingen

Werkplek voor door leerlingen gemelde fouten.

Gebouwd per 2 juni 2026:

- Leerlingen hebben in de topbar een knop `Meld een fout`.
- De popup vraagt alleen categorie, korte toelichting en optionele extra uitleg.
- Automatisch meegestuurd worden leerlingnaam, e-mail, uid, leerlingnummer indien bekend, klas, URL, paginatitel, paragraaf, hoofdstuk, lesblok en vraagcontext waar beschikbaar.
- Categorieen:
  - Antwoordmodel klopt niet
  - Schrijffout of taal
  - Opdracht is onduidelijk
  - Technisch probleem
  - Afbeelding/video/link werkt niet
  - Anders
- Limiet tegen misbruik: maximaal 3 meldingen per leerling per 10 minuten.
- Adminpagina `/admin/meldingen` toont meldingen newest-first.
- Admin kan filteren op status en categorie.
- Statussen: Nieuw, In behandeling, Opgelost, Afgewezen.
- Admin kan een korte adminnotitie opslaan.

Belangrijke bestanden:

- `src/components/studentBugReports/StudentBugReportButton.jsx`
- `src/components/studentBugReports/StudentBugReportContext.jsx`
- `src/pages/AdminMeldingenPage.jsx`
- `src/services/studentBugReportService.js`
- `src/lib/studentBugReportUtils.js`
- `src/lib/studentBugReportUtils.test.js`

Firestore:

- Collectie `studentBugReports`.
- De service filtert status/categorie client-side na nieuwste query om samengestelde Firestore-indexen voor V1 zoveel mogelijk te vermijden.

Eerder verkend op 28 mei 2026; basis is inmiddels gebouwd:

- Een importtool voor leerlingfoto's uit een geplakte/geuploade klassenfoto is technisch haalbaar.
- Betrouwbare V1 moet een controlelijst hebben voor foto-uitsnedes en naam-matching voordat er wordt opgeslagen.
- Bestaande leerlingen krijgen alleen een goedgekeurd `photo`-object; onbekende leerlingen moeten eerst als review/pending worden behandeld.
- Echte nieuwe Firebase Auth accounts mogen niet client-side worden aangemaakt. Daarvoor is later een veilige Cloud Function met Firebase Admin SDK nodig.

Actuele richting:

- Houd de admin-only foto-importwizard binnen of naast `AdminLeerlingenPage`.
- Hergebruik upload/plak/canvas/selectiepatronen uit `ImageCanvasEditor`.
- Client mag bronfoto uploaden/plakken, cropvoorstellen maken, handmatige uitsnedes laten corrigeren en matches voorstellen.
- Docent moet elke rij goedkeuren, overslaan of markeren voor latere review voordat data definitief wordt opgeslagen.
- Voor productie moet definitief koppelen aan `users/{uid}` en definitief opslaan naar `student-photos/...` bij voorkeur via Callable Cloud Function met Admin SDK.
- De client mag geen echte Firebase Auth-leerlingaccounts bulk aanmaken.

### Spellen

Werkplek voor educatieve browsergames.

Huidig:

- Game Registry bestaat.
- `/admin/spellen` bestaat.
- Pythagoras Trainer is het eerste prototype.
- Resultaten blijven voorlopig lokaal.
- Tokens worden niet client-side uitgegeven.

### Presenter

Presenter is de nieuwe digibord-first werkbordmodule, vergelijkbaar met Prowise Presenter of SMART board software, maar in HELIX-stijl en later gekoppeld aan lesroutes.

Status per 3 juni 2026:

- Presenter V1a Core is gebouwd op branch `feature/cms-platform`.
- Route bestaat op `/admin/presenter`.
- Eigen adminnavigatieknop `Presenter` bestaat.
- Werkbalk en bovenrand zijn visueel gelijkgetrokken met de zachte HELIX-toolbarstijl.
- Lesstofimport loopt primair via de onderste werkbalkknop `Lesstof`; de dubbele bovenknop `Importeer CMS` is verwijderd.
- De module is technisch geimplementeerd en gericht getest, maar de echte digibordervaring moet nog browsermatig en praktisch worden gevalideerd.

Belangrijk: behandel Presenter niet meer als alleen een plan. Behandel het als een gebouwde V1a met open validatie en polish.

### Instellingen

Werkplek voor platformbrede instellingen die niet bij lesstof, leerlingen of voortgang horen.

Huidig:

- Hoofdnavknop `Instellingen` vervangt de oude hoofdnavknop `Beheer`.
- `/admin/instellingen` is de nieuwe instellingen-landingspagina.
- `/admin` redirect naar `/admin/instellingen`.
- Digidocent/OpenRouter instellingen blijven op `/admin/ai-instellingen` en vallen route-actief onder `Instellingen`.
- De oude `Startinformatie`-modal uit een eerdere versie is verwijderd.
- De oude Admin Hub / Beheer-overzichtspagina is verwijderd.

### Studentprofiel

Leerling-thuisbasis met naam, e-mail, rol, klas en voortgang. Leerlingen wijzigen hun klas niet zelf; klasbeheer ligt bij admin/docent.

## CMS-Structuur

De CMS werkt rond deze leerstructuur:

```text
Vak -> Leerjaar -> Niveau -> Hoofdstuk -> Paragraaf -> Lesroute
```

Een paragraaf wordt gevuld met contentblocks in volgorde. De lesroute is de echte leerlingervaring.

Belangrijk ontwerpprincipe:

```text
HELIX bouwt geen losse vragenbank als hoofdervaring.
Een vraag is een type lesblok binnen een bredere lesroute.
```

## Lesbloktypes

Huidige contentblocktypes:

1. Theorie
2. Voorbeeld
3. Vraag
4. Media
5. Samenvatting
6. Game
7. Slidedeck

### Theorie

Uitleg, definities, stappenplannen, formules en ondersteunende afbeeldingen.

### Voorbeeld

Uitgewerkte voorbeelden met bronmateriaal, tekst, afbeeldingen en eventuele stap-voor-stap uitleg.

### Vraag

Interactieve oefenvraag. Vraagblokken blijven gekoppeld aan centrale `vraag`-documenten, zodat vragen later herbruikbaar zijn.

Huidige vraagtypes:

- open
- meerkeuze
- numeriek
- koppelen
- invullen
- volgorde

Vraagtypes gebruiken een uitbreidbare registry in `src/lib/questionTypeRegistry.js`.

Tokenvelden bestaan alvast als metadata per vraagtype, maar het tokensysteem zelf is nog niet gebouwd. Echte tokenuitgifte moet later server-side gebeuren.

### Media

Een mediablok bevat een hoofdmedia-item.

Ondersteund:

- afbeelding
- YouTube
- video-upload
- media-PDF/document

Media-PDF is anders dan Slidedeck-PDF. Media-PDF is een documentviewer; Slidedeck is een presentatiestroom.

### Samenvatting

Kernpunten, afsluiting, onthoudzinnen en korte herhaling.

### Game

Educatieve browsergame uit de Game Registry. Later kan een game ook als CMS-lesblok in leerlingroutes draaien.

### Slidedeck

Een NotebookLM-presentatie-PDF als apart lesbloktype. Dit is bewust los van Media.

## Vraagstudio En Preview

Huidige status:

- Vraagstudio opent vanuit lesblokstudio als fullscreen overlay.
- Vraagtype wordt gekozen via registry.
- Elk vraagtype heeft een eigen antwoordtemplate.
- Elk vraagtype kan tokenmetadata opslaan.
- Invulvragen gebruiken een knop `Maak gat` in plaats van handmatig `[GAP]` typen.
- Invulvragen slaan segmenten/gaps op en bewaren legacy `[GAP]`-compatibiliteit.
- Slimme controle accepteert kleine spelfouten en equivalente notaties, zoals `opervlakte` voor `oppervlakte` en `cm2` voor `vierkante centimeter`.
- Lesroute-preview rendert gepubliceerde vraagblokken.
- Preview geeft visuele goed/fout feedback via gekleurde kaders.
- Feedbackteksten zoals `Goed` en `Nog niet goed` zijn verwijderd voor rust.
- Volgordevragen renderen als ordenbare/tikbare testweergave.

## Crop/OCR Studio

De crop/OCR workflow is een docentproductietool.

Doel:

- Upload bronmateriaal.
- Crop afbeelding.
- OCR tekst.
- Plaats tekst of afbeelding direct in het geopende lesblok.
- Werk prettig met grote scans, foto's en A4-pagina's.

Belangrijke UX-keuzes:

- Inline bronpaneel voor snelle acties.
- Fullscreen cropstudio als precieze scanwerkbank.
- Hand-modus om te pannen.
- Selectie-modus om crops te tekenen.
- Crophistorie/selecties blijven zichtbaar.
- Crops kunnen gekozen, verwijderd en aangepast worden.
- Overlappende crops zijn mogelijk.
- OCR-crops worden tekst in de editor.
- Afbeelding-crops worden echte afbeeldingen in de editor.

## Slidedeckcreator / NotebookLM Workflow

Onder Lesstof bestaat een hybride Slidedeckcreator.

Workflow:

1. Docent vult titel/onderwerp in.
2. Docent kiest optioneel CMS-context: vak, leerjaar, niveau, hoofdstuk, paragraaf.
3. Docent vult leerdoelen in.
4. Docent voegt brontekst toe.
5. Docent uploadt of plakt afbeeldingen.
6. Docent kiest of beheert prompttemplate.
7. HELIX genereert bron-PDF en bewaart prompt-snapshot.
8. Docent gebruikt bron-PDF en prompt in NotebookLM.
9. Docent uploadt de door NotebookLM gegenereerde presentatie-PDF terug naar HELIX.
10. CMS kan het pakket als Slidedeck-lesblok selecteren zodra `generatedDeckPdf` aanwezig is.

Datakeuzes:

- Firestore metadata in `slidedeckPackages`.
- Prompttemplates in `promptTemplates`.
- PDF's en assets in Firebase Storage.
- PDF-bestanden niet als binary in Firestore.
- Slidedeck-lesblok verwijst naar een slidedeckpakket.

## Digibord

Digibord is de bestaande contentblock-gebaseerde presentatielaag. Presenter is de bredere vrij-bordwerkmodule.

Huidig:

- Gebruikt gepubliceerde `contentBlocks` als bron.
- Toont theorie, voorbeeld, vraag, media, samenvatting, game en slidedeck digibordvriendelijker.
- Slidedeck-PDF kan fullscreen en slide-per-page worden gepresenteerd.
- Media gebruikt gedeelde `MediaRenderer`.

Open:

- Verdere polish van bediening, fullscreen, media-PDF/documentviewer en klassikale flow.

## Digidocent En Leerlingroute-AI

Digidocent is de leerlingbegeleider in de leerlingroute. Hij moet socratisch helpen, context van de paragraaf kunnen gebruiken en leerlingen nooit blokkeren wanneer AI faalt.

Status per 2 juni 2026:

- Digidocent heet nu Digidocent, niet meer P-AI-co.
- Digidocent is paragraafbewust: eerdere chat en voortgang binnen de paragraaf kunnen als context worden meegegeven.
- Chatgeschiedenis wordt per paragraaf/vraag in localStorage bewaard en als gecontroleerde state gebruikt.
- Digidocent-paneel zit als verticale knop aan de rechterkant.
- Paneel opent bij hover/mouse-enter en sluit bij mouse-out.
- Belangrijke UX-fix: als er concepttekst in het chatvenster staat die nog niet verstuurd is, sluit het paneel niet automatisch bij mouse-out. De concepttekst blijft per vraag bewaard.
- Actieve chat-hulp telt als Digidocent-hulp voor voortgangskleuring.
- Automatische foutfeedback of beoordelingsfeedback telt niet als echte Digidocent-hulp.

Beschikbaarheid:

- Vraagblokken hebben Digidocent standaard aan.
- Niet-vraag-lesblokken zoals theorie, media, YouTube/slidedeck hebben Digidocent standaard uit.
- Admin/instellingen en blokinstellingen kunnen per context een escape hebben om Digidocent uit te zetten.

Open-antwoordbeoordeling:

- Open vragen gaan primair via Digidocent/AI-beoordeling.
- Simpele numerieke antwoorden worden lokaal beoordeeld voordat AI nodig is.
- Voorbeelden die lokaal goed moeten kunnen: `sqrt(100) = 10`, `wortel van 100 = 10`, `3 + 3 = 6`.
- Als AI faalt bij een open vraag, wordt de leerling niet geblokkeerd.
- AI-falen wordt amber/pending teacher review, zodat de leerling verder kan en de docent kan meekijken.
- Gele JSON-foutmeldingen zoals `No JSON object found` mogen niet rauw zichtbaar zijn voor leerlingen.

Pogingen en voortgang:

- Leerling mag maximaal 4 pogingen doen bij een vraag.
- Fout antwoord voor poging 1-3 geeft automatisch een korte socratische hint.
- Na poging 4 fout wordt de vraag rood/geparkeerd voor herstel.
- Goed antwoord gaat automatisch door naar de volgende vraag/lesstap.
- Groen blokje: goed zonder echte Digidocent-chat.
- Groen blokje met rood stippellijntje: goed met echte Digidocent-chat.
- Amber blokje: beoordeling faalde, leerling mag door en docent kijkt mee.
- Rood blokje: na maximale pogingen fout, herstelopdracht nodig.

Paragraafafsluiting:

- Als alle kernvragen groen zijn, krijgt de leerling een uitdagende vraag op basis van dezelfde didactiek en onderwerpen.
- Als er rode/gefaalde vragen zijn, krijgt de leerling een verplichte herstelopdracht.
- Herstelopdrachten moeten inhoudelijk aansluiten op de foutief gemaakte vraag en foutsoort.
- Voor veelvoorkomende simpele rekenpatronen is herstel nu concreter en niet meer generiek:
  - `3 + 3` fout als `9` herkent optellen versus vermenigvuldigen.
  - `wortel`-vragen leggen de inverse controle uit.
- Voortgangpayload bewaart snapshots zoals vraagtekst, modelantwoord en laatste antwoord, zodat herstelopdrachten context hebben.

Belangrijke bestanden:

- `src/pages/StudentLessonPage.jsx`
- `src/components/slides/AITutorChat.jsx`
- `src/lib/aiTutorConversation.js`
- `src/lib/aiTutorLessonContext.js`
- `src/lib/aiTutorAnswerSummary.js`
- `src/lib/aiTutorPanelState.js`
- `src/lib/localOpenAnswerAssessment.js`
- `src/lib/studentQuestionAttemptFlow.js`
- `src/lib/learningResultUtils.js`
- `src/lib/paragraphEndActivity.js`
- `src/lib/voortgangPayload.js`
- `src/lib/openAnswerAssessmentFeedback.js`

Belangrijke tests:

- `src/lib/aiTutorPanelState.test.js`
- `src/lib/localOpenAnswerAssessment.test.js`
- `src/lib/studentQuestionAttemptFlow.test.js`
- `src/lib/learningResultUtils.test.js`
- `src/lib/paragraphEndActivity.test.js`
- `src/lib/voortgangPayload.test.js`
- `src/lib/openAnswerAssessmentFeedback.test.js`

## Presenter V1a Core

Presenter V1a is technisch gebouwd.

Gebouwd:

- `/admin/presenter` route en navigatie.
- Board shell binnen HELIX-adminshell.
- Pagina's met pagina toevoegen/verwijderen/dupliceren en navigatie.
- Verticale scroll per pagina.
- Interne coordinate space voor exacte pointer/touch-plaatsing.
- Per-pagina undo/redo.
- Lokale recovery via browser/session storage.
- Fullscreen handling.
- Auto-hide ondertoolbar met altijd zichtbare handle.
- Toolbar zonder horizontale scroll.
- Pen met kleur- en diktekeuze.
- Markeerstift met kleur- en diktekeuze.
- Gum voor penstreken.
- Achtergronden: wit, lijnen en vierkante ruitjes.
- Ruitjes blijven vierkant en kunnen als wiskundeschrift dienen.
- Snap-to-grid voor relevante tekenacties.
- Vormobjecten: rechthoek, cirkel/ovaal, lijn, pijl, driehoek en verwante objecten.
- Objectlaag met selectie.
- Selectiekader/marquee-selectie.
- Objecten verslepen en schalen via transformaties.
- Rood verwijderpunt/kruisje bij geselecteerde objecten.
- Pagina helemaal leegmaken.
- Tijdelijke meetinstrument-overlays: liniaal, geodriehoek, passer, gradenboog.

Verificatiestatus:

- `presenter_notule.md` meldt dat gerichte tests, gerichte ESLint en build groen waren.
- Browsermatige UI-verificatie was eerst geblokkeerd door auth.
- Daarna is lokale admin-auth toegevoegd voor Presenter-verificatie.
- Controleer actuele smoke-output en voer waar nodig opnieuw een browsercheck uit voordat je Presenter als praktijkgevalideerd beschouwt.

Belangrijke nuance:

```text
Presenter V1a is gebouwd en technisch gericht geverifieerd.
Presenter V1a is nog niet bewezen als volledig gevalideerde CTOUCH/digibord-ervaring.
```

## Presenter V1a-plus: Tekst, Wiskundesymbolen En Gum

V1a-plus is de tussenstap tussen de gebouwde Presenter Core en de diepere V1b-contentlaag. Deze pluslaag blijft primair bordgericht.

Doel:

- Het vrije bord completer maken voor dagelijkse wiskundeles.
- Docenten tekst en wiskundige notatie laten toevoegen zonder meteen interactieve V1b-vraagvensters te bouwen.
- Gumgedrag natuurlijker maken voor penstreken op een digibord.

Gewenst in V1a-plus:

- Teksttool in de toolbar.
- Klik/tap op het bord om een tekstobject te plaatsen.
- Tekstobjecten zijn selecteerbaar, verplaatsbaar en schaalbaar zoals andere objecten.
- Tekstobjecten blijven recht en leesbaar.
- Basale tekstinstellingen: tekstgrootte en eventueel vet/cursief als dit UX-matig rustig blijft.
- Wiskundesymbolenpalet bij tekstinvoer.
- Minimaal gewenste symbolen:
  - `π`
  - `√`
  - `²`
  - `³`
  - `×`
  - `÷`
  - `≤`
  - `≥`
  - `≈`
  - `≠`
  - `∠`
  - `°`
- Gumfunctie met drie borstelgroottes:
  - small
  - medium
  - large
- De drie gumgroottes staan voor de borstel-diameter: small wist heel precies, medium is standaard, large wist breed alsof je met een grote borstel over penstreken gaat.
- Gum wist primair pen- en markeerstiftstreken op basis van raakvlak/borsteldiameter.
- Objecten blijven via selectie/verwijderknop verwijderd worden, niet per ongeluk met de gum.

Niet in V1a-plus:

- Interactieve vraagvensters op het bord.
- Firebase-opslag van Presenter-sessies.
- Export.

## Presenter Content Layer

Een eerste HELIX-lesstofimport is inmiddels aanwezig in Presenter. De onderste werkbalkknop `Lesstof` opent de importroute direct; de eerdere dubbele bovenknop `Importeer CMS` is verwijderd.

Huidige richting:

- Paragraafimport via fullscreen kiesvenster.
- Structuur: hoofdstuk -> paragraaf -> import.
- Alleen gepubliceerde blokken importeren.
- Import voegt nieuwe pagina's achteraan toe.
- Import is een momentopname, geen live koppeling met CMS-wijzigingen.
- De importroute moet direct en rustig blijven: liever via de onderste werkbalk dan via dubbele knoppen.

Verdieping voor later:

- Theorie en voorbeelden als grote bordobjecten.
- Vraagvensters vrij plaatsbaar en schaalbaar.
- Vraagvensters ondersteunen huidige vraagtypes.
- `Controleer` verschijnt pas na input.
- Feedback via subtiele groene/rode rand.
- Tokens blijven onzichtbaar in Presenter.
- Media binnen geimporteerde blokken gebruikt grote digibordvriendelijke controls.
- Echte pagina-thumbnails in linker paneel.

Niet bouwen zonder nieuw akkoord:

- Interactieve vraagvensters.
- Firebase-opslag van Presenter-sessies.
- Export/cloudsessies.

## Spellen / Game Module

De Game Module draait rond een Game Registry.

Registry bevat onder andere:

- `gameId`
- `title`
- `description`
- `subject`
- `topic`
- `level`
- `learningGoals`
- `skills`
- `estimatedMinutes`
- `route`
- `componentKey`
- `supportedModes`
- `tokenRewardPotential`
- `status`

Veiligheidsregels:

- Registry bevat alleen serialiseerbare metadata.
- Resultaten blijven voorlopig lokaal.
- Geen tokenwrites vanuit client.
- `tokenRewardPotential` en `suggestedTokenReward` zijn alleen indicatief.
- Echte tokenuitgifte gebeurt later server-side via Cloud Function/backendvalidatie.

## Firebase / Data

Belangrijke Firestore-collecties:

- `users`
- `klassen`
- `photoImports`
- `pendingStudents`
- `vak`
- `leerjaar`
- `niveau`
- `hoofdstuk`
- `paragraaf`
- `vraag`
- `contentBlocks`
- `voortgang`
- `promptTemplates`
- `slidedeckPackages`
- `questionMetadata`
- `adminCropSources`
- `studentBugReports`

Belangrijke Storage-paden:

- `pythagoras/question-crops/...`
- `pythagoras/source-pages/...`
- vraag- en contentcrops
- `slidedecks/{packageId}/source.pdf`
- `slidedecks/{packageId}/generated-deck.pdf`
- `slidedecks/{packageId}/assets/{assetId}`
- `mediaBlocks/{blockId}/{fileName}`
- `photo-imports/{klasId}/{importId}/...` voor tijdelijke leerlingfoto-imports
- `student-photos/{klasId}/{uid}/avatar_256.webp`
- `student-photos/{klasId}/{uid}/thumb_96.webp`

Let op:

- `FIRESTORE_SCHEMA.md` is nuttig, maar deels ouder dan de daadwerkelijke services.
- Firebase rules zijn tijdens development deels permissief/testgericht.
- Productierijpe Firestore en Storage rules zijn nog een hardeningfase.
- Leerlingen mogen uiteindelijk alleen eigen voortgang en toegewezen/gepubliceerde lesstof zien.
- CMS-writes moeten uiteindelijk beperkt zijn tot admin/docent.
- Tokens en leerlingaccount-aanmaak moeten server-side worden gevalideerd.

## Wat Al Is Volbracht

### Product en navigatie

- Rebranding naar HELIX met DNA-helix logo.
- Adminnavigatie ingericht naar werkplekken:
  - Lesstof
  - Voortgang
  - Leerlingen
  - Meldingen
  - Spellen
  - Presenter
  - Instellingen
- Active states zijn routegroep-gebaseerd.
- `Beheer` is als hoofdnav en oude hub verwijderd; `/admin` redirect naar `/admin/instellingen`.
- `/admin/klassen` valt onder `Leerlingen`.
- `/admin/taken-toewijzen` valt onder `Lesstof`.
- `/admin/ai-instellingen` valt onder `Instellingen`.
- HELIX design system richting is gestart: light-mode onderwijsstijl, zachte surfaces, warme accenten, Sora/Inter-achtige typografie, kaart- en knopstijl.
- Actieve headerknoppen en voortgangtabs gebruiken de lichte HELIX-gradient als borderrand met witte vulling en donkere tekst/icons.

### CMS

- CMS-shell en navigatieboom professioneler gemaakt.
- Sidebar kan volledig worden ingeklapt.
- Sidebar is sleepbaar breder/smaller.
- Count-badges staan in een vaste rechterkolom en blijven op een regel.
- Tree counts zijn gestabiliseerd zodat paragraaf/blok-aantallen niet verspringen bij uitklappen.
- Hoofdstukbanden-stijl is toegepast voor betere UX.
- Actieve paragraaf gebruikt lichte paarse achtergrond.
- Lesbloktype-selector is responsief en compact.
- Contentblock-statusbadges kunnen wisselen tussen `concept` en `published`.
- Lesrouteblokken hebben volgorde via omhoog/omlaag-knoppen.
- Contentblocks voor theorie, voorbeeld, vraag, media, samenvatting, game en slidedeck bestaan.

### Tree En Style Verkenningen

Lokale HTML-prototypes bestaan als besluitvormingshulpmiddel:

- `exports/tree-ux-variants.html`
- `exports/helix-style-variants.html`

Deze bestanden zijn prototypes/documentatie, geen productcode. Ze zijn bedoeld om UX- en huisstijlkeuzes visueel te vergelijken.

### Crop/OCR

- Fullscreen cropstudio toegevoegd.
- Hand/selectie-modus toegevoegd.
- Zoom/pan verbeterd.
- Overlappende selecties mogelijk.
- Cropselecties kunnen verwijderd worden.
- OCR en afbeelding-crops hebben gescheiden verwerking.

### Spellen

- Implementatieplan gemaakt.
- Game Registry toegevoegd.
- `/admin/spellen` toegevoegd.
- GamePlayer-wrapper toegevoegd.
- Pythagoras Trainer als eerste prototypegame toegevoegd.
- Resultaten blijven lokaal.

### Slidedeckcreator

- `/admin/slidedecks` toegevoegd.
- Promptbibliotheek met templates toegevoegd.
- NotebookLM standaardprompt toegevoegd.
- Bron-PDF generatie in browser toegevoegd.
- Slidedeckpackages in Firestore.
- PDF en assets in Storage.
- Upload van NotebookLM gegenereerde PDF bij bestaande package.
- CMS-lesbloktype `slidedeck` toegevoegd.
- Slidedeck selector toont alleen packages met geuploade presentatie-PDF.
- Digibord kan Slidedeck-PDF fullscreen presenteren.

### Media V1

- CMS-mediablok ondersteunt afbeelding, YouTube, video-upload en PDF-upload.
- Afbeeldingen kunnen via upload, klembord en crop worden toegevoegd.
- Video/PDF/media-upload wordt direct persistent opgeslagen in het contentblok.
- Media-normalisatie herkent meerdere veldvormen.
- Leerlingroute en digibord gebruiken gedeelde `MediaRenderer`.
- Media-preview en fullscreen-weergave zijn aanwezig.

### Leerlingroute / Preview

- Gepubliceerde vraagblokken renderen in preview.
- Belangrijkste vraagtypes werken in preview.
- Controle geeft visuele goed/fout feedback.
- Volgordevragen renderen als testweergave in plaats van leeg tekstvak.
- Leerlingroute gebruikt voortgangsblokjes met groen, groen plus rood stippellijntje, amber en rood.
- Digidocent is standaard beschikbaar bij vraagblokken.
- Open antwoorden kunnen lokaal of via AI beoordeeld worden.
- AI-falen blokkeert de leerling niet; de voortgang wordt amber en docent kan meekijken.
- Na maximaal vier foutieve pogingen wordt een vraag rood en volgt paragraafherstel.
- Aan het einde van een paragraaf komt herstel of uitdaging.
- Herstelopdrachten gebruiken vraagtekst, verwacht antwoord, laatste antwoord en feedbacksnapshot voor betere aansluiting.

## Leerlingfoto-Import V1

De basis voor leerlingfoto-import en avatarhergebruik is gebouwd. De onderstaande richting blijft belangrijk voor verdere productie-hardening en privacy.

### Doel

Een administrator kan een klassenfoto/screenshot uploaden of plakken, leerlingfoto's uitsnijden, bestaande leerlingen matchen en na controle de foto als avatar aan het leerlingaccount koppelen.

Belangrijk principe:

```text
Automatische detectie en naamherkenning zijn adviserend.
De docent/admin keurt altijd expliciet goed voordat er naar leerlingdata wordt geschreven.
```

### UX-Flow

Startpunt:

- `Leerlingen` heeft een actie `Foto's importeren`.
- De leerlingenpagina toont statcards `Met foto` en `Zonder foto`.
- Foto's worden via de gedeelde avatarlogica ook in voortgang/profielcontext gebruikt.

Wizardstappen:

1. `Bron`
   - Upload of plak een JPG/PNG/WebP klassenfoto of screenshot.
   - Gebruik een duidelijke drop/upload-zone.
   - Toon foutmelding bij ongeldig bestand.
   - Waarschuw bij groot bestand.

2. `Uitsnedes`
   - Toon de bronfoto in canvas/fullscreen-stijl.
   - V1 mag automatische uitsnedes als voorstellen tonen.
   - Admin kan elke uitsnede corrigeren, verwijderen of handmatig toevoegen.
   - Statussen per uitsnede: `voorgesteld`, `aangepast`, `verwijderd`, `handmatig toegevoegd`.

3. `Matchen`
   - Toon een reviewtabel met foto-preview, herkende naam, gematchte leerling, zekerheid, klas, status en actie.
   - Matching zoekt op `displayName`, e-mailprefix en eventueel klasfilter.
   - Statussen: `zekere match`, `controle nodig`, `geen match`, `dubbele match`, `naam ontbreekt`.

4. `Goedkeuren`
   - Opslaan mag pas wanneer alle rijen een expliciete beslissing hebben.
   - Mogelijke beslissingen: koppelen, overslaan, later reviewen.
   - Toon progress voor `uitsnijden`, `uploaden`, `opslaan`.
   - Ondersteun gedeeltelijk succes: geslaagde foto's blijven gekoppeld, mislukte rijen krijgen retry/overslaan.

Na goedkeuren:

- Leerlingenoverzicht ververst.
- Avatarvak toont foto indien aanwezig, anders huidige icon/initialenfallback.
- Bij hover/focus verschijnt een grotere tijdelijke popup met foto, naam, klas, e-mail en laatste activiteit.
- Popup mag geen layout verschuiven.

### Datamodel

Voeg aan `users/{uid}` geen losse `photoURL` als enige waarheid toe, maar een gestructureerd `photo`-object:

```js
photo: {
  storagePath: "student-photos/{klasId}/{uid}/avatar_256.webp",
  thumbStoragePath: "student-photos/{klasId}/{uid}/thumb_96.webp",
  status: "approved",
  sourceImportId: "import_...",
  cropId: "crop_...",
  approvedBy: "adminUid",
  approvedAt: timestamp,
  updatedAt: timestamp
}
```

Nieuwe importcollectie:

```js
photoImports/{importId} {
  klasId,
  status: "draft" | "review" | "processing" | "completed" | "cancelled",
  sourceStoragePath,
  originalFileName,
  contentType,
  fileSize,
  createdBy,
  createdAt,
  updatedAt,
  expiresAt,
  cropCount,
  approvedCount,
  pendingCount
}

photoImports/{importId}/crops/{cropId} {
  order,
  cropStoragePath,
  bbox: { x, y, width, height },
  originalImageSize: { width, height },
  status: "unmatched" | "matched" | "approved" | "rejected" | "pending_new",
  matchedUserId,
  matchedDisplayName,
  matchConfidence,
  matchMethod: "manual" | "name" | "email" | "suggested",
  proposedName,
  reviewNote,
  approvedBy,
  approvedAt,
  createdAt
}
```

Voor onbekende leerlingen:

```js
pendingStudents/{pendingId} {
  klasId,
  importId,
  cropId,
  displayNameProposed,
  photoStoragePath,
  status: "pending_account" | "needs_review" | "merged" | "discarded",
  createdBy,
  createdAt,
  resolvedBy,
  resolvedAt,
  resolvedUserId
}
```

### Storage

Gebruik geen bestaande lesmateriaalpaden zoals `pythagoras/question-crops/...` voor leerlingfoto's.

Aanbevolen paden:

```text
photo-imports/{klasId}/{importId}/source/original.jpg
photo-imports/{klasId}/{importId}/crops/{cropId}.webp
student-photos/{klasId}/{uid}/avatar_256.webp
student-photos/{klasId}/{uid}/thumb_96.webp
```

Privacykeuze:

- Bewaar bij voorkeur `storagePath` en `thumbStoragePath`.
- Gebruik niet standaard permanente download-URL's als enige bron, omdat Firebase download-URL's tokenlinks zijn die buiten de app deelbaar blijven.
- Voor striktere privacy: lees via Storage SDK met rules of later via backend met kort geldige URL.

### Client-Side Mag

- Afbeelding uploaden of plakken.
- Canvas-crops maken.
- Lokale preview/review tonen.
- Bestaande leerlingen uit dezelfde klas tonen en handmatig matchen.
- Tijdelijke importsource/crops uploaden, mits rules admin-only zijn.
- `photoImports` conceptmetadata schrijven als admin, mits rules strak valideren.

### Cloud Function / Admin SDK Voor Productie-Hardening

Gebruik een callable function zoals `approveStudentPhotoImportCrop` of een batchvariant.

De function moet:

- Controleren dat caller admin/docent is.
- Controleren dat caller toegang heeft tot `klasId`.
- Verifieren dat `matchedUserId` bestaat.
- Verifieren dat `matchedUserId.role == "student"`.
- Verifieren dat de leerling in dezelfde klas zit of bewust door admin is gekozen.
- Afbeeldingen normaliseren naar vaste veilige formaten en afmetingen.
- Tijdelijke crop kopieren/verplaatsen naar `student-photos/...`.
- `users/{uid}.photo` bijwerken.
- `pendingStudents` aanmaken of mergen voor onbekende leerlingen.
- Oude importbestanden opruimen.
- Eventueel oude leerlingfoto's vervangen/verwijderen.

### Securityregels

Voor productie-hardening:

- Leerlingen mogen nooit zelf `role`, `klasId`, `photo`, importstatus of matchdata schrijven.
- `photoImports` alleen admin/docent read/write.
- `pendingStudents` alleen admin/docent.
- `student-photos` write alleen via Cloud Function/Admin SDK.
- `student-photos` read alleen admin/docent en eventueel de leerling zelf.
- `photo-imports` read/write alleen admin/docent en tijdelijk met `expiresAt`.
- Storage moet MIME en bestandsgrootte beperken tot veilige image-types.
- PDF is voor V1 leerlingfoto-import niet nodig, tenzij later expliciet gekozen.

Belangrijk risico:

- Huidige development rules kunnen permissief zijn.
- Omdat adminrechten uit `users/{uid}.role` komen, mogen leerlingen in productie nooit hun eigen rolveld kunnen aanpassen.

### Presenter V1a

- Presenter Core gebouwd.
- Toolbar, pen, markeerstift, ruitjes, objecten, selectie, pagina's, clear page, auto-hide, recovery, fullscreen en meetinstrument-overlays aanwezig.
- De donkere Presenter-bovenrand is gelijkgetrokken met de zachte toolbar-achtergrond.
- De onderste werkbalk is de primaire route voor lesstofimport.
- Verdere praktijkvalidatie blijft open.

### Authenticatie / Firebase

- Google adminlogin gebruikt popup-login met fallback naar redirect-login wanneer popups blokkeren.
- Lokale dev/admin-login is toegevoegd voor browsermatige verificatie.
- Firebase authorized domains voor lokaal testen horen `localhost` en eventueel `127.0.0.1` te bevatten, zonder poortnummer.

## Belangrijkste Open Productwerk

### 1. Presenter V1a Valideren En Polijsten

Nodig:

- Echte browser smoke test vastleggen.
- Testen op groot scherm/touchscreen/CTOUCH.
- Toolbar-interactie verfijnen.
- Objectmanipulatie en selectiekader verder polijsten.
- Meetinstrumenten beoordelen op digibordgevoel.
- Performance bij veel penstreken/objecten testen.

### 2. Presenter V1a-plus Bouwen

Alleen bordgerichte uitbreidingen, nog zonder HELIX-contentlaag.

Focus:

- Teksttool toevoegen.
- Tekstobjecten selecteerbaar, verplaatsbaar en schaalbaar maken.
- Wiskundesymbolenpalet toevoegen met o.a. `π`, `√`, `²`, `³`, `×`, `÷`, `≤`, `≥`, `≈`, `≠`, `∠` en `°`.
- Gum uitbreiden met borstel-diameteropties small, medium en large.
- Gum alleen pen-/markeerstiftstreken laten wissen, zodat objecten niet per ongeluk verdwijnen.

### 3. Presenter V1b Ontwerpen En Bouwen

Alleen na expliciet akkoord.

Focus:

- Interactieve vraagvensters op het bord.
- Media en slidedecks als bordobjecten.
- Pagina-thumbnails.
- Eventueel opslag/export later.

### 4. Leerlingroute Afronden

Nodig:

- Verdere polish voor theorie, voorbeeld, vraag, media, samenvatting, game en slidedeck.
- Rustige empty states.
- Mobiele layout.
- Consistente fullscreen-ervaring.

### 5. CMS Lesblokstudio Verfijnen

Nodig:

- Fullscreen editor polish.
- Afbeeldingen in editor positioneren en verwijderen.
- Fontgrootte, fontkleur en lettertypes verder UX-polishen.
- Mediablokstudio eenvoudiger maken.
- Slidedeckblokstudio verder afstemmen op presentatieworkflow.

### 6. Leerlingbeheer Uitbreiden

Nodig:

- Accountbeheer en veilige wachtwoordflows verder hardenen.
- Uitgebreidere filters.
- Leerlingfoto-import verder hardenen volgens de V1 importbatch/reviewflow.
- Avatarweergave uitbreiden met hover/focus-popup.
- `photoImports`, `pendingStudents` en `users/{uid}.photo` datamodel controleren tegen de actuele implementatie.
- Callable Cloud Function/Admin SDK overwegen/gebruiken voor definitieve foto-goedkeuring en opslag bij productiegang.
- Als echte nieuwe leerlingaccounts bulk aangemaakt moeten worden: aparte Cloud Function/Admin SDK-flow ontwerpen.

### 7. Voortgang En Analytics Versterken

Nodig:

- Knelpuntenanalyse per vraag en paragraaf verder verdiepen.
- Leerlingdrilldown verder polijsten.
- Signalen voor vastlopers, inactiviteit en Digidocent-afhankelijk succes verder aanscherpen.
- Export/printvriendelijke rapportage ontwerpen.

### 8. Toetsmodus V1

Nodig:

- Oefentoets of hoofdstuktoets.
- Pogingen, scores en feedback.
- Docentoverzicht.

### 9. Firebase Security Hardening

Nodig:

- Productierijpe Firestore rules.
- Productierijpe Storage rules.
- Geen dev-bypass in productie.
- Leerlingrechten beperken tot eigen/toegewezen data.
- Admin/docent writes expliciet beperken.

### 10. Documentatie En Schema Opschonen

Nodig:

- `README.md` vervangen door echte HELIX-projectintro, setup, scripts, Firebase/env en ontwikkelworkflow.
- `FIRESTORE_SCHEMA.md` bijwerken naar actuele services.
- Mojibake/encodingproblemen in docs opruimen waar ze overdracht of lesmateriaal raken.

### 11. Multi-tenant Later

Nodig:

- School/tenantmodel.
- Rollen per tenant.
- Migratiepad vanaf huidige single-school structuur.

## Ontwerpprincipes Voor Verdere Bouw

- Rustige, professionele onderwijsinterface.
- Geen drukke gamification voordat de kernflow stabiel is.
- Docentproductie moet snel zijn: crop/OCR, hergebruik, duidelijke routebouw.
- Leerlingervaring moet simpel en voorspelbaar zijn.
- Een centrale waarheid voor lesroutes: `contentBlocks`.
- Geen grote refactors zonder directe productwaarde.
- Geen destructieve database-acties zonder expliciete bevestiging.
- Geen client-side tokenuitgifte.
- Geen client-side bulk-aanmaak van echte Firebase Auth leerlingen.
- Firebase rules liever documenteren en handmatig laten plakken dan automatisch wijzigen.
- Media en slidedecks zijn verschillende didactische objecten.
- Een mediablok is een hoofdmedia-item.
- Presenter is digibord-first: grote touchdoelen, exacte pointercoordinaten, rustige toolmodus.
- Presenter V1a-plus mag bordgerichte basistools toevoegen, zoals tekst, wiskundesymbolen en gumgroottes.
- Presenter V1b-verdieping zoals interactieve vraagvensters, cloudopslag of export niet alvast meebouwen zonder nieuw akkoord.

## Actuele Technische Aandachtspunten Voor Nieuwe Agent

- Werk op branch `feature/cms-platform`, tenzij de gebruiker anders zegt.
- Recente wijzigingen zijn gepusht naar GitHub op `feature/cms-platform`, maar zijn pas live op Firebase na deploy.
- Er bestaat een herstelbare backupbranch: `backup/digidocent-before-learning-flow`.
- Huidige gitstatus kan lokale untracked tooling/prototypes bevatten, zoals `.superpowers/`, `exports/helix-button-gradient-options.html`, `exports/presenter-smoke/` en `exports/presenter-toolbar-style-options.html`. Niet automatisch stagen of verwijderen.
- `README.md` is nog geen betrouwbare projectdocumentatie.
- `FIRESTORE_SCHEMA.md` is deels ouder dan de implementatie.
- Volledige `npm run lint` kan nog falen op bestaande lint-schuld. Gebruik voorlopig gerichte `npx eslint <aangepaste bestanden>` plus `npm run build`.
- Dev server draait meestal op `http://localhost:5173/` of een nabije Vite-poort. De gebruiker gebruikt vaak `localhost` liever dan `127.0.0.1`.
- Poort `5174` was eerder bezet door een ander project; gebruik die niet zomaar voor HELIX.
- Voor lokale dev-login kunnen `.env.local` flags nodig zijn:
  - `VITE_ENABLE_DEV_LOGIN=true`
  - `VITE_ENABLE_DEV_ADMIN_LOGIN=true`
- Geen Firebase Anonymous Auth gebruiken voor tests.

Actuele belangrijke routes:

- `/` leerling-overzicht/lesmateriaal
- `/chapter/:chapterId` leerlingroute
- `/profiel` leerlingprofiel
- `/admin` legacy redirect naar `/admin/instellingen`
- `/admin/instellingen` instellingenwerkplek
- `/admin/lesstof` lesstofwerkplek
- `/admin/cms` CMS platform
- `/admin/digibord` digibord
- `/admin/slidedecks` slidedeckcreator
- `/dashboard` voortgang/klasdashboard
- `/admin/leerlingen` leerlingbeheer
- `/admin/klassen` klassenbeheer, actief onder `Leerlingen`
- `/admin/taken-toewijzen` lesmateriaal klaarzetten, actief onder `Lesstof`
- `/admin/meldingen` leerling-foutmeldingen
- `/admin/spellen` spellen
- `/admin/presenter` Presenter
- `/admin/ai-instellingen` Digidocent/OpenRouter instellingen, actief onder `Instellingen`

Belangrijke bestanden bij CMS/lesroutewerk:

- `src/components/cms/CmsShell.jsx`
- `src/components/cms/ContentBlockBuilder.jsx`
- `src/lib/contentBlockUtils.js`
- `src/lib/questionTypeRegistry.js`
- `src/lib/questionPreviewUtils.js`
- `src/lib/fillBlankUtils.js`
- `src/components/media/MediaRenderer.jsx`
- `src/pages/StudentLessonPage.jsx`
- `src/components/slides/AITutorChat.jsx`
- `src/lib/aiTutorPanelState.js`
- `src/lib/localOpenAnswerAssessment.js`
- `src/lib/studentQuestionAttemptFlow.js`
- `src/lib/paragraphEndActivity.js`
- `src/lib/voortgangPayload.js`
- `src/lib/learningResultUtils.js`
- `src/components/digibord/DigibordViewer.jsx`

Belangrijke bestanden bij leerling-foutmeldingen:

- `src/components/studentBugReports/StudentBugReportButton.jsx`
- `src/components/studentBugReports/StudentBugReportContext.jsx`
- `src/pages/AdminMeldingenPage.jsx`
- `src/services/studentBugReportService.js`
- `src/lib/studentBugReportUtils.js`
- `src/lib/studentBugReportUtils.test.js`

Belangrijke bestanden bij adminnavigatie, leerlingen en instellingen:

- `src/lib/adminWorkspaceNav.js`
- `src/lib/adminWorkspaceNav.test.js`
- `src/pages/AdminLeerlingenPage.jsx`
- `src/pages/AdminKlassenPage.jsx`
- `src/pages/AdminSettingsPage.jsx`
- `src/pages/AdminAiSettingsPage.jsx`
- `src/lib/authLoginUtils.js`

Belangrijke bestanden bij Presenter:

- `src/pages/AdminPresenterPage.jsx`
- `src/components/presenter/PresenterShell.jsx`
- `src/components/presenter/PresenterBoard.jsx`
- `src/components/presenter/PresenterToolbar.jsx`
- `src/components/presenter/PresenterInkLayer.jsx`
- `src/components/presenter/PresenterObjectLayer.jsx`
- `src/components/presenter/PresenterBackground.jsx`
- `src/components/presenter/PresenterInstrumentOverlay.jsx`
- `src/components/presenter/PresenterPagePanel.jsx`
- `src/components/presenter/PresenterRecoveryPrompt.jsx`
- `src/lib/presenterModel.js`
- `src/lib/presenterHistory.js`
- `src/lib/presenterGeometry.js`
- `src/lib/presenterObjects.js`
- `src/lib/presenterStorage.js`
- `docs/superpowers/specs/2026-05-27-presenter-design.md`
- `docs/superpowers/plans/2026-05-27-presenter-v1a-implementation-plan.md`
- `presenter_notule.md`

Belangrijke services:

- `src/services/cmsService.js`
- `src/services/mediaService.js`
- `src/services/slidedeckService.js`
- `src/services/voortgangService.js`
- `src/services/klasService.js`
- `src/services/storageService.js`
- `src/services/studentBugReportService.js`

Recente commitclusters die context geven:

- Adminnavigatie, voortgang en stijlpolish:
  - `b16b901 feat: vervang beheer door instellingen`
  - `c51e6a7 style: stem presenter en voortgang chrome af`
  - `aafe2bc style: gebruik helix borderstijl voor headernav`
  - `76fb702 style: maak presenter lesstof import direct`
  - `92091b1 feat: voeg klasfilter toe aan voortgangsdashboard`
  - `88f38b6 fix: toon leerlingfotos in voortgang`
  - `80a247a feat: verbeter voortgangsdashboard signalen`

- Digidocent, leerlingroute en meldingen:
  - `4a06bc1 feat: voeg leerling foutmeldingen toe`
  - `ff2c8ef fix: behoud digidocent concepttekst bij hover`
  - `1060c6d fix: stem herstelopdrachten af op foutvraag`
  - `66cc627 feat: implementeer digidocent leerflow`
  - `ecbe47a docs: voeg goalvoorstel digidocent leerflow toe`
  - `f9fcc28 fix: maak digidocent procentfeedback concreet`
  - `a294cb8 feat: maak digidocent paragraafbewust`

- Presenter V1a en polish:
  - `ab91c3b feat: add presenter backgrounds and grid snap`
  - `3b135f6 feat: add presenter shape objects`
  - `4a1f1b3 feat: add presenter math instrument overlays`
  - `892a680 feat: add presenter recovery and fullscreen`
  - `0873be7 feat: add presenter pen style controls`
  - `454998a feat: add presenter clear page and toolbar auto-hide`
  - `c0212fd feat: add presenter marquee selection and object transforms`
  - `fdd7921 feat: refine presenter toolbar and add highlighter controls`
- Presenter verification/auth:
  - `11401be test: add local admin auth for presenter verification`
  - `d51c862 docs: add presenter implementation report`
- CMS tree en design variants:
  - `74f8edb fix: stabilize cms tree block counts and add ux variants`
  - `8566e05 docs: make tree ux variants expandable`
  - `3120094 docs: align tree ux variants to full hierarchy`
  - `e21fa3b style: apply chapter band cms tree styling`
  - `4bb0047 style: refine cms tree chapter bands`
  - `c6cc297 fix: keep cms tree counts on one line`
  - `4c36a8f docs: add helix visual style variants`

## Verificatiegewoonte

Na significante wijzigingen:

1. Gerichte tests draaien.
2. Gerichte lint draaien.
3. `npm run build` draaien wanneer relevant.
4. Browserpreview waar mogelijk.
5. Commit en push volgens projectregel.

Gebruik bij voorkeur:

```bash
npm run build
npx eslint <aangepaste bestanden>
node --test <gerichte testbestanden>
```

Bij Presenter-wijzigingen minimaal overwegen:

```bash
node --test src/lib/presenterModel.test.js src/lib/presenterHistory.test.js src/lib/presenterGeometry.test.js src/lib/presenterObjects.test.js src/lib/presenterStorage.test.js src/lib/adminWorkspaceNav.test.js
```

## Context Reset Instructie Voor Codex

Als dit document wordt gelezen na contextcompressie:

1. Lees eerst dit hele document.
2. Controleer daarna `src/App.jsx` voor actuele routes.
3. Controleer `src/lib/adminWorkspaceNav.js` voor actuele adminnavigatie.
4. Controleer `src/lib/contentBlockUtils.js` voor actuele lesbloktypes.
5. Controleer `src/lib/questionTypeRegistry.js` voor actuele vraagtypes.
6. Controleer `src/components/presenter/` en `src/lib/presenter*.js` bij Presenter-werk.
7. Controleer recente gitstatus voordat je wijzigt.
8. Vraag bij grote productkeuzes eerst om brainstorm/plan, tenzij de gebruiker expliciet `bouw`, `proceed` of `implementeer` zegt.
