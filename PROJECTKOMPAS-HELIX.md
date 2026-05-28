# HELIX Projectkompas

Laatst bijgewerkt: 28 mei 2026

Dit document is het vaste contextanker voor verdere ontwikkeling van HELIX. Lees dit bestand eerst na contextcompressie, bij een nieuwe agent-sessie of voordat je grotere productkeuzes maakt. Het doel is niet om alle details te herhalen, maar om een frisse agent snel en correct op de rails te zetten.

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

Werkplek voor klasdashboard, leerlingvoortgang en later didactische signalen.

Open richting:

- Analyse per klas, paragraaf en vraag.
- Signalen voor vastlopers en inactiviteit.
- Leerlingdrilldown en exports.

### Leerlingen

Werkplek voor leerlingaccounts, klasstatus en accountoverzicht.

Huidig:

- Toont leerlingen uit `users` met rol `student`.
- Toont naam, e-mail, klas en laatste activiteit/accountstatus.
- Wachtwoordbeheer en accountflows zijn nog beperkt.

Nieuw verkend op 28 mei 2026:

- Een importtool voor leerlingfoto's uit een geplakte/geuploade klassenfoto is technisch haalbaar.
- Betrouwbare V1 moet een controlelijst hebben voor foto-uitsnedes en naam-matching voordat er wordt opgeslagen.
- Bestaande leerlingen krijgen alleen `photoURL`/`photoPath`; onbekende leerlingen moeten eerst als review/pending worden behandeld.
- Echte nieuwe Firebase Auth accounts mogen niet client-side worden aangemaakt. Daarvoor is later een veilige Cloud Function met Firebase Admin SDK nodig.

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

Status per 28 mei 2026:

- Presenter V1a Core is gebouwd op branch `feature/cms-platform`.
- Route bestaat op `/admin/presenter`.
- Eigen adminnavigatieknop `Presenter` bestaat.
- De module is technisch geimplementeerd en gericht getest, maar de echte digibordervaring moet nog browsermatig en praktisch worden gevalideerd.

Belangrijk: behandel Presenter niet meer als alleen een plan. Behandel het als een gebouwde V1a met open validatie en polish.

### Beheer

Werkplek voor klassen, taken toewijzen, instellingen, publiceer-info en tijdelijke dev-acties zoals CMS-reset.

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

V1a-plus is de tussenstap tussen de gebouwde Presenter Core en V1b. Deze pluslaag blijft bordgericht en haalt nog geen HELIX-lesstof binnen.

Doel:

- Het vrije bord completer maken voor dagelijkse wiskundeles.
- Docenten tekst en wiskundige notatie laten toevoegen zonder meteen V1b-lesroute-import te bouwen.
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

- HELIX-lesstof importeren.
- Vraagvensters op het bord.
- Firebase-opslag van Presenter-sessies.
- Export.

## Presenter V1b: HELIX Content Layer

V1b is nog niet gebouwd en moet pas na expliciet akkoord worden opgepakt.

Richting:

- Paragraafimport via fullscreen kiesvenster.
- Structuur: hoofdstuk -> paragraaf -> import.
- Alleen gepubliceerde blokken importeren.
- Import voegt nieuwe pagina's achteraan toe.
- Import is een momentopname, geen live koppeling met CMS-wijzigingen.
- Theorie en voorbeelden als grote bordobjecten.
- Vraagvensters vrij plaatsbaar en schaalbaar.
- Vraagvensters ondersteunen huidige vraagtypes.
- `Controleer` verschijnt pas na input.
- Feedback via subtiele groene/rode rand.
- Tokens blijven onzichtbaar in Presenter.
- Media binnen geimporteerde blokken gebruikt grote digibordvriendelijke controls.
- Echte pagina-thumbnails in linker paneel.

Niet bouwen zonder nieuw akkoord:

- HELIX-content import.
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

Belangrijke Storage-paden:

- `pythagoras/question-crops/...`
- `pythagoras/source-pages/...`
- vraag- en contentcrops
- `slidedecks/{packageId}/source.pdf`
- `slidedecks/{packageId}/generated-deck.pdf`
- `slidedecks/{packageId}/assets/{assetId}`
- `mediaBlocks/{blockId}/{fileName}`
- later mogelijk `student-photos/{uid}/profile.webp`

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
  - Spellen
  - Presenter
  - Beheer
- Active states zijn routegroep-gebaseerd.
- HELIX design system richting is gestart: light-mode onderwijsstijl, zachte surfaces, warme accenten, Sora/Inter-achtige typografie, kaart- en knopstijl.

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

### Presenter V1a

- Presenter Core gebouwd.
- Toolbar, pen, markeerstift, ruitjes, objecten, selectie, pagina's, clear page, auto-hide, recovery, fullscreen en meetinstrument-overlays aanwezig.
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

- HELIX-content import.
- Vraagvensters op het bord.
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

- Accountbeheer en veilige wachtwoordflows.
- Uitgebreidere filters.
- Mogelijke leerlingfoto-import met reviewstap.
- Als echte nieuwe leerlingaccounts bulk aangemaakt moeten worden: Cloud Function/Admin SDK ontwerpen.

### 7. Voortgang En Analytics Versterken

Nodig:

- Analyse per klas, paragraaf en vraag.
- Knelpunten.
- Leerlingdrilldown.
- Signalen voor vastlopers en inactiviteit.

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
- Presenter V1b niet alvast meebouwen zonder nieuw akkoord.

## Actuele Technische Aandachtspunten Voor Nieuwe Agent

- Werk op branch `feature/cms-platform`, tenzij de gebruiker anders zegt.
- Huidige gitstatus kan lokale untracked tooling bevatten, zoals `.superpowers/` en `exports/presenter-smoke/`. Niet automatisch stagen of verwijderen.
- `README.md` is nog geen betrouwbare projectdocumentatie.
- `FIRESTORE_SCHEMA.md` is deels ouder dan de implementatie.
- Volledige `npm run lint` kan nog falen op bestaande lint-schuld. Gebruik voorlopig gerichte `npx eslint <aangepaste bestanden>` plus `npm run build`.
- Dev server draait meestal op `http://localhost:5173/` of een nabije Vite-poort. De gebruiker gebruikt vaak `localhost` liever dan `127.0.0.1`.
- Voor lokale dev-login kunnen `.env.local` flags nodig zijn:
  - `VITE_ENABLE_DEV_LOGIN=true`
  - `VITE_ENABLE_DEV_ADMIN_LOGIN=true`
- Geen Firebase Anonymous Auth gebruiken voor tests.

Belangrijke bestanden bij CMS/lesroutewerk:

- `src/components/cms/CmsShell.jsx`
- `src/components/cms/ContentBlockBuilder.jsx`
- `src/lib/contentBlockUtils.js`
- `src/lib/questionTypeRegistry.js`
- `src/lib/questionPreviewUtils.js`
- `src/lib/fillBlankUtils.js`
- `src/components/media/MediaRenderer.jsx`
- `src/pages/StudentLessonPage.jsx`
- `src/components/digibord/DigibordViewer.jsx`

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

Recente commitclusters die context geven:

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
