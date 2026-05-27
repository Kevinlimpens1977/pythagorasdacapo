# HELIX Projectkompas

Laatst bijgewerkt: 27 mei 2026

Dit document is bedoeld als vaste contextanker voor verdere ontwikkeling van HELIX. Als de gesprekscontext vol raakt of wordt gecomprimeerd, lees dit document opnieuw om snel weer "on rails" te komen.

## Productvisie

HELIX wordt een professioneel, rustig en schaalbaar leerplatform voor docenten en leerlingen. Docenten bouwen leerstof als duidelijke lesroutes, leerlingen volgen die routes stap voor stap, en digibord, NotebookLM-slidedecks, spellen, crop/OCR en voortgangsinzicht komen samen in een enkele onderwijsworkflow.

De noordster:

**Docent maakt materiaal -> organiseert het als lesroute -> publiceert of wijst toe -> leerling volgt route -> voortgang wordt zichtbaar -> docent gebruikt digibord, slidedecks en spellen voor klassikale en individuele ondersteuning.**

## Hoofdmodules

### Lesstof

De centrale docentwerkplek voor:

- CMS en lesroutes.
- Theorie, voorbeelden, vragen, media, samenvattingen, games en slidedecks.
- Crop/OCR om bronmateriaal snel om te zetten naar bruikbare lesblokken.
- Slidedeckcreator voor NotebookLM-bronpakketten.
- Digibordmateriaal en presentaties.

### Voortgang

Werkplek voor:

- Klasdashboard.
- Leerlingvoortgang.
- Aandachtspunten.
- Later: didactische signalen, paragraafanalyses, vraaganalyses en export.

### Leerlingen

Werkplek voor:

- Leerlingaccounts bekijken.
- Naam, e-mail, klas en rol/accountstatus tonen.
- Later: accountbeheer, veilige wachtwoordflows en uitgebreidere filters.

### Spellen

Werkplek voor educatieve browsergames:

- Zelfstandig speelbare games voor docenten om te testen.
- Game Registry als bron van waarheid.
- Later dezelfde games als CMS-lesblok in leerlingroutes.
- Resultaten blijven voorlopig lokaal; tokens worden later uitsluitend server-side bepaald.

### Presenter

Nieuwe geplande hoofdmodule voor een professioneel digibord-first werkbord.

Richting:

- Eigen hoofdknop `Presenter` in de adminnavigatie.
- Start als leeg bord binnen de HELIX-adminshell.
- Core-first aanpak: eerst schrijven, ruitjes, vormen en wiskundige meetinstrumenten perfect laten voelen.
- Daarna pas HELIX-content importeren en interactieve vraagvensters toevoegen.
- Primair ontworpen voor groot CTOUCH/smartboard-gebruik; laptop is secundair.

### Beheer

Werkplek voor:

- Klassen.
- Taken toewijzen.
- Instellingen.
- Publiceer-info.
- Tijdelijke dev-acties zoals CMS-reset.

### Studentprofiel

Leerling-thuisbasis met:

- Naam, e-mail en rol.
- Huidige klas.
- Voortgang per hoofdstuk/paragraaf.
- Algemene voortgangssamenvatting.

Leerlingen wijzigen hun klas hier niet zelf. De klaskeuze-modal blijft alleen voor leerlingen zonder klas.

## CMS-Structuur

De CMS werkt rond deze leerstructuur:

```text
Vak -> Leerjaar -> Niveau -> Hoofdstuk -> Paragraaf -> Lesroute
```

Een paragraaf wordt gevuld met contentblocks in volgorde. De lesroute is de echte leerlingervaring.

Belangrijk ontwerpprincipe:

**HELIX bouwt geen losse vragenbank als hoofdervaring, maar volledige leerrouteblokken. Een vraag is een type lesblok binnen een bredere lesroute.**

## Lesbloktypes

Huidige en bedoelde contentblocktypes:

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

### Media

Losse media-items. In V1 is de keuze bewust:

- Een mediablok bevat **een** hoofdmedia-item.
- Meerdere media achter elkaar betekent meerdere mediablokken in de lesroute.
- Ondersteund: afbeelding, YouTube, video-upload en media-PDF/document.
- Media-PDF is anders dan Slidedeck-PDF. Media-PDF is een gewone documentviewer, Slidedeck is een presentatiestroom.

### Samenvatting

Kernpunten, afsluiting, onthoudzinnen en korte herhaling.

### Game

Educatieve browsergame uit de Game Registry. De game kan zelfstandig worden gespeeld en later als lesblok binnen de leerlingroute draaien.

### Slidedeck

Een NotebookLM-presentatie-PDF als apart lesbloktype. Dit is bewust los van Media, omdat een slidedeck een presentatiestroom is voor leerlingroute en digibord.

## Crop/OCR Studio

De crop/OCR workflow is een docentproductietool.

Doel:

- Upload bronmateriaal.
- Crop afbeelding.
- OCR tekst.
- Plaats tekst of afbeelding direct in het geopende lesblok.
- Werk ook prettig met grote scans, foto's en A4-pagina's.

Belangrijke UX-keuzes:

- Inline bronpaneel blijft beschikbaar voor snelle acties.
- Fullscreen cropstudio is de precieze scanwerkbank.
- Hand-modus om te pannen.
- Selectie-modus om crops te tekenen.
- Crophistorie/selecties blijven zichtbaar.
- Crops moeten kunnen worden gekozen, verwijderd en aangepast.
- Overlappende crops moeten mogelijk zijn.
- OCR-crops worden tekst in de editor.
- Afbeelding-crops worden echte afbeeldingen in de editor.
- Afbeeldingen horen niet als aparte "gekoppelde afbeelding" onder de editor te staan wanneer ze al in de editor geplaatst zijn.

## Slidedeckcreator / NotebookLM Workflow

Onder Lesstof bestaat een hybride Slidedeckcreator.

Doel:

- Docent maakt in HELIX een NotebookLM-pakket.
- HELIX bewaart bron-PDF, prompt-snapshot en later de geuploade NotebookLM-presentatie-PDF.
- Die presentatie-PDF kan daarna als Slidedeck-lesblok in de CMS-lesroute worden geplaatst.

Workflow:

1. Docent vult titel/onderwerp in.
2. Docent kiest optioneel context uit CMS-structuur: vak, leerjaar, niveau, hoofdstuk, paragraaf.
3. Docent vult leerdoelen in.
4. Docent voegt brontekst toe.
5. Docent uploadt of plakt afbeeldingen.
6. Docent kiest of beheert prompttemplate.
7. HELIX genereert bron-PDF en bewaart prompt-snapshot.
8. Docent gebruikt bron-PDF en prompt in NotebookLM.
9. Docent uploadt de door NotebookLM gegenereerde presentatie-PDF terug naar HELIX.
10. CMS kan het pakket als Slidedeck-lesblok selecteren zodra `generatedDeckPdf` aanwezig is.

Belangrijke datakeuzes:

- Firestore metadata in `slidedeckPackages`.
- Prompttemplates in `promptTemplates`.
- PDF's en assets in Firebase Storage.
- PDF-bestanden niet als binary in Firestore.
- Slidedeck-lesblok verwijst naar een slidedeckpakket.

## Digibord

Digibord is de bestaande contentblock-gebaseerde presentatielaag. De nieuwe module `Presenter` wordt de bredere digibordtool voor vrij bordwerk, wiskundige uitleg en later HELIX-content als objecten op het bord.

Digibord blijft voorlopig gericht op contentblocks presenteren als klassikale lesflow.

Richting:

- Gebruik gepubliceerde `contentBlocks` als bron.
- Toon theorie, voorbeeld, vraag, media, samenvatting, game en slidedeck op een digibordvriendelijke manier.
- Maak bediening rustig: vorige, volgende, sluiten, fullscreen waar logisch.
- Oude "slides niet gevonden"-logica moet verdwijnen ten gunste van contentblock-gebaseerde presentatie.

Voor slidedecks:

- Toon startkaart in digibord.
- Open presentatie-PDF fullscreen.
- Vorige/volgende slide.
- Escape of sluitknop om terug te keren.
- Geen verwarring met gewone media.

Voor mediablokken:

- Afbeelding, YouTube, video en PDF moeten inline getoond worden.
- Elk media-item moet fullscreen geopend/gesloten kunnen worden.
- Video gebruikt een gewone videoplayer met controls.
- YouTube gebruikt een embed-player.
- Media-PDF gebruikt een documentviewer met grote preview/fullscreen, niet de slide-per-page presenter.

## Presenter

Presenter is ontworpen als nieuwe hoofdmodule voor docenten: een fullscreen digibordtool zoals Prowise Presenter of SMART board software, maar later gekoppeld aan HELIX-lesroutes.

Vastgelegde ontwerpkeuze:

- Gefaseerde aanpak.
- V1a: `Presenter Core`.
- V1b: `HELIX Content Layer`.
- Designspecificatie staat in `docs/superpowers/specs/2026-05-27-presenter-design.md`.

### Presenter V1a: Core

V1a moet eerst een betrouwbaar, precies wiskundig bord worden.

In scope:

- Eigen adminnavigatieknop `Presenter`.
- Direct openen op een leeg wit bord binnen de bestaande adminshell.
- Optionele browser-fullscreenknop.
- Pagina's 1, 2, 3 met verticale scroll.
- Grote touchvriendelijke scrollstrip rechts, alleen zichtbaar wanneer nodig.
- Interne coordinate space voor exacte stylus/touch-plaatsing.
- Auto-hide ondertoolbar met pin-optie.
- Toolbarvolgorde:
  - vorige pagina
  - paginanummer
  - volgende pagina
  - select
  - undo
  - redo
  - pen
  - objecten
  - lesstof
  - achtergrond
  - pagina's
  - fullscreen
  - terug
- Pen, markeerstift en meetkundepen/rechte-lijnpen.
- Gum wist alleen penstreken.
- Wit, lijntjes en vierkante ruitjes als achtergrondoverlay.
- Ruitjes voelen als wiskundeschrift 1 x 1 cm en blijven altijd vierkant.
- Snap-to-grid alleen wanneer ruitjes aan staan.
- Alle vormen meteen in V1a:
  - rechthoek
  - cirkel/ovaal
  - lijn
  - pijl
  - driehoek
  - veelhoek/vrije vorm via punten
  - assenstelsel
  - tabel/raster
  - hoekmarkering
- Meetinstrumenten meteen in V1a:
  - liniaal
  - geodriehoek
  - passer
  - gradenboog
- Meetinstrumenten zijn tijdelijke overlays; alleen het getekende resultaat blijft staan.
- Undo/redo per pagina.
- Pagina toevoegen, verwijderen met bevestiging en dupliceren.
- Simpel tekstueel pagina-overzicht links; echte thumbnails later.
- Tijdelijk lokaal herstel via browser/session storage met vraag "Vorige Presenter-sessie herstellen?"

Niet in V1a:

- Teksttool.
- Lesroute-import.
- Vraagvensters.
- Media-import.
- Echte pagina-thumbnails.
- Timer, spotlight en schermgordijn.
- Firebase-opslag van Presenter-sessies.
- Export.

### Presenter V1b: HELIX Content Layer

V1b voegt HELIX-koppeling toe bovenop het Core-bord.

In scope:

- Paragraafimport via fullscreen kiesvenster.
- Structuur: hoofdstuk -> paragraaf -> import.
- Alleen gepubliceerde blokken importeren.
- Import voegt nieuwe pagina's achteraan toe.
- Import is een momentopname, geen live koppeling met CMS-wijzigingen.
- Lange blokken: docent kiest scrollbaar houden of splitsen.
- Theorie en voorbeelden als grote bordobjecten zonder zware kaartstijl.
- Lesblokken zijn verplaatsbaar en schaalbaar, maar blijven recht en leesbaar.
- Vraagvensters zijn vrij plaatsbaar en schaalbaar.
- Vraagvensters hebben geen permanente titelbalk.
- `Controleer` verschijnt pas nadat er iets is ingevuld/geselecteerd.
- Feedback na controle:
  - subtiele groene/rode rand om het hele vraagvenster
  - bij invulvragen alleen foutieve velden rood markeren
- `Reset antwoord` beschikbaar.
- Geen `Toon antwoord` knop.
- Tokens blijven onzichtbaar in Presenter.
- Alle huidige vraagtypes ondersteunen:
  - open
  - meerkeuze
  - numeriek
  - koppelen
  - invullen
  - volgorde
- Koppelvragen via lijnen trekken.
- Volgordevragen via tikvolgorde.
- Numerieke en invulvragen hergebruiken bestaande slimme controlelogica.
- Media binnen geimporteerde blokken speelt af met grote digibordvriendelijke controls.
- Echte pagina-thumbnails in linker paneel.

## Spellen / Game Module

De Game Module is opgebouwd rond een Game Registry.

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

Belangrijke veiligheidsregels:

- Registry bevat alleen serialiseerbare metadata.
- GameResult bevat `attemptId`, `startedAt`, `completedAt`, score en nauwkeurigheid.
- Resultaten blijven voorlopig lokaal.
- Geen tokenwrites vanuit client.
- `tokenRewardPotential` is alleen metadata.
- `suggestedTokenReward` is alleen indicatief.
- Echte tokenuitgifte gebeurt later server-side via Cloud Function/backendvalidatie.

Huidige richting:

- `/admin/spellen` is de zelfstandige werkplek.
- Pythagoras Trainer is eerste prototypegame.
- CMS-gameblok kan later registry-games selecteren die `cmsBlock` ondersteunen.

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

Belangrijke Storage-paden:

- crop/source pages.
- vraag- en contentcrops.
- `slidedecks/{packageId}/source.pdf`
- `slidedecks/{packageId}/generated-deck.pdf`
- `slidedecks/{packageId}/assets/{assetId}`
- `mediaBlocks/{blockId}/{fileName}` voor afbeeldingen, video's en media-PDF's uit mediablokken.

Let op:

- Firebase rules zijn tijdens development soms tijdelijk permissief gemaakt.
- Productierijpe security rules zijn nog een aparte hardeningfase.
- Leerlingen mogen uiteindelijk alleen eigen voortgang en toegewezen/gepubliceerde lesstof zien.
- CMS-writes moeten uiteindelijk beperkt zijn tot admin/docent.
- Storage rules moeten voor development minimaal `mediaBlocks/{allPaths=**}` toestaan voor ingelogde admins/docenten, anders uploadt video/media niet.

## Wat Al Is Volbracht

### Product en navigatie

- Rebranding naar **Helix** met DNA-helix logo.
- Adminnavigatie heringericht naar werkplekken:
  - Lesstof
  - Voortgang
  - Leerlingen
  - Spellen
  - Beheer
- `Presenter` is als nieuwe geplande hoofdmodule vastgesteld, maar nog niet gebouwd.
- `Lesmateriaal` is voor admins niet langer de primaire hoofdknop.
- Active states zijn routegroep-gebaseerd.
- HELIX design system integratie is gestart: warm gradient, Sora/Inter, light-mode onderwijsstijl, zachte surfaces, nieuwe kaart- en knopstijl.
- Er is een nieuw logo-asset aangeleverd in `src/afbeeldingen/logo.png`; dit moet nog gecontroleerd en consequent worden gekoppeld aan alle HELIX-brandingplekken als de gebruiker dit opnieuw oppakt.

### Studentprofiel

- Route `/profiel` toegevoegd.
- Leerlingprofiel toont naam, e-mail, klas en voortgang.
- Headerprofiel voor leerlingen is klikbaar.
- Effectieve paragrafenlogica is gelijkgetrokken met toegewezen taken.

### Admin Hub

- Admin Hub rustiger gemaakt als werkdashboard.
- Statusblokjes toegevoegd, zoals aantal klassen, leerlingen en actieve paragrafen.
- Acties gegroepeerd rond werkstromen.

### CMS

- CMS-shell en navigatieboom professioneler gemaakt.
- Sidebar kan volledig worden ingeklapt zonder lege witte balk.
- De CMS-navigatieboom heeft geen losse knop "Alles inklappen" meer. Klikken op het bovenste vakniveau, bijvoorbeeld "Digitale Vaardigheden", klapt de geopende tree terug dicht.
- De functionele zijbalk-inklapknop staat onder het zoekveld, op de plek waar eerder "Alles inklappen" stond.
- De CMS-zijbalk is sleepbaar breder/smaller te maken. Bij pagina-herlaad of opnieuw uitklappen start hij weer op de standaardbreedte.
- Count-badges in de navigatieboom, zoals `2 jaren`, `2 niveaus`, `2 paragrafen` en `0 blokken`, staan in een vaste rechterkolom en lijnen onder elkaar uit.
- Als de sidebar is ingeklapt gebruikt de lesroute-builder meer beschikbare breedte, maar blijft gecentreerd.
- Zoekveld en statusinformatie toegevoegd.
- Contentblocks voor theorie, voorbeeld, vraag, media en samenvatting toegevoegd.
- Later uitgebreid met game en slidedeck.
- Lesrouteblokken hebben volgorde via omhoog/omlaag-knoppen.
- Wisactie voor lesblok is vervangen/bedoeld als kleinere bevestigings-UX in plaats van browser-alert.
- Lesbloktype-selector is vernieuwd naar compacte responsive tegels.
- Selector is aangepast voor zoom/smalle breedtes: tekst breekt veilig af, tegels zijn hoger en 7 kolommen verschijnen alleen bij extra brede schermen.
- Contentblock-statusbadges in gemaakte lesroutes kunnen wisselen tussen `concept` en `published`.
- Vraagblokken gebruiken een uitbreidbare vraagtype-registry.
- Vraagstudio ondersteunt vraagtypes:
  - open
  - meerkeuze
  - numeriek
  - koppelen
  - invullen
  - volgorde
- Elk vraagtype kan eigen antwoordtemplate en tokenconfiguratie opslaan.
- Tokensysteem is nog niet gebouwd; tokenvelden worden alvast als metadata opgeslagen.
- Invulvragen gebruiken in de editor een knop `Maak gat` in plaats van handmatig `[GAP]` typen.
- Invulvragen slaan segmenten/gaps op en behouden legacy `[GAP]`-tekst voor compatibiliteit.
- Slimme invulcontrole accepteert kleine spelfouten en equivalente notaties, zoals `opervlakte` voor `oppervlakte` en `cm2` voor `vierkante centimeter`.
- Vraagstudio opent vanuit lesblokstudio weer correct als fullscreen overlay.

### Crop/OCR

- Universele crop/OCR richting opgezet voor meerdere bloktypes.
- Fullscreen cropstudio toegevoegd.
- Hand/selectie-modus toegevoegd.
- Zoom/pan verbeterd.
- Selecties kunnen naast elkaar en overlappend bestaan.
- Cropselecties kunnen voor verwerking worden verwijderd.
- OCR en afbeelding-crops hebben gescheiden verwerking.

### Spellen

- Implementatieplan gemaakt.
- Game Registry toegevoegd.
- `/admin/spellen` toegevoegd.
- GamePlayer-wrapper toegevoegd.
- Pythagoras Trainer als eerste prototypegame toegevoegd.
- Resultaten blijven lokaal in browser.
- Geen Firebase/resultaat/tokenwrites.

### Slidedeckcreator

- Implementatieplan gemaakt.
- `/admin/slidedecks` toegevoegd.
- Promptbibliotheek met templates toegevoegd.
- NotebookLM standaardprompt toegevoegd.
- Bron-PDF generatie in browser toegevoegd.
- Slidedeckpackages in Firestore.
- PDF en assets in Storage.
- NotebookLM gegenereerde PDF upload bij bestaande package.
- CMS-lesbloktype `slidedeck` toegevoegd.
- Slidedeck selector toont alleen packages met geuploade presentatie-PDF.
- Digibord kan Slidedeck-PDF fullscreen presenteren.
- PDF-presenter heeft fallback via Storage bytes / blob URL om CORS en iframe-problemen te vermijden.
- Slidedeck-PDF kan slide-per-page gepresenteerd worden met vorige/volgende.

### Lesroute Preview / Vragen

- Gepubliceerde vraagblokken renderen nu in preview in plaats van leeg te blijven.
- Preview ondersteunt de belangrijkste vraagtypes, inclusief invullen, meerkeuze, numeriek, open en volgorde.
- Preview-controle geeft visuele goed/fout feedback met gekleurde kaders.
- Tekstlabels zoals `Goed` en `Nog niet goed` zijn uit de preview-feedback verwijderd om rustiger te ogen.
- Volgordevragen renderen als ordenbare/tikbare testweergave in plaats van als leeg tekstvak.

### Media V1

- CMS-mediablok ondersteunt afbeelding, YouTube, video-upload en PDF-upload.
- Afbeeldingen kunnen via upload, klembord en crop worden toegevoegd.
- Video/PDF/media-upload wordt direct persistent opgeslagen in het contentblok na upload, zodat sluiten van de studio niet per ongeluk media verliest.
- Media-normalisatie herkent meerdere veldvormen: `mediaUrl`, `imageUrl`, `videoUrl`, `pdfUrl`, `fileUrl`, `downloadURL`, `url`.
- Videoherkenning gebruikt MIME-type en bestandsextensie, zoals `.mp4`, `.webm`, `.ogg`, `.mov`, `.m4v`.
- Leerlingroute en digibord gebruiken gedeelde `MediaRenderer`.
- Media-preview en fullscreen-weergave zijn aanwezig.

### Voortgang

- Voortgangspagina heeft basisdashboard.
- Marges/layout zijn afgestemd op andere adminpagina's.
- Overbodige croptoollink is verwijderd/bedoeld verwijderd uit voortgang.

### Authenticatie / Firebase

- Google adminlogin gebruikt popup-login met fallback naar redirect-login wanneer de ingebouwde Codex-browser popups blokkeert.
- Firebase authorized domains voor lokaal testen horen `localhost` en eventueel `127.0.0.1` te bevatten, zonder poortnummer.
- Firebase Project ID blijft technisch `pythagoras-eoa`, ook wanneer projectnaam/appnaam naar HELIX is hernoemd.

### Documentatie

- `19526.md` gemaakt met open verbeterpunten uit de oorspronkelijke PRD.
- `IPLAN-GAME-MODULE.md` gemaakt/aangescherpt.
- `IMPLEMENTATIEPLAN-SLIDEDECKCREATOR.md` gemaakt.
- `docs/HELIX-DESIGN-AUDIT.md` gemaakt als styling/design audit.
- `docs/superpowers/specs/2026-05-27-presenter-design.md` gemaakt als goedgekeurde Presenter-designspec.
- Dit document, `PROJECTKOMPAS-HELIX.md`, is het vaste overdrachtsdocument voor nieuwe agents en contextcompressie.

## Belangrijkste Open Productwerk

### 1. Leerling-lesroute Afronden

De leerlingervaring toont gepubliceerde contentblocks al als leerroute, maar moet verder professioneel worden afgewerkt.

Nodig:

- Verdere polish voor theorie, voorbeeld, vraag, media, samenvatting, game en slidedeck.
- Meer consistente fullscreen-ervaring voor media en slidedeck.
- Vraagblokinteractie verder professionaliseren.
- Rustige empty states.
- Mobiele layout.

### 2. Presenter V1a Implementeren

Nieuwe prioriteit na goedkeuring door gebruiker: implementatieplan maken voor `Presenter Core`, nog niet direct bouwen zonder expliciete go.

V1a-focus:

- Adminnavigatie uitbreiden met `Presenter`.
- Leeg bord binnen adminshell.
- Pagina-state en per-pagina undo/redo.
- Exacte pointer/touch-coordinaten.
- Pen, markeerstift, meetkundepen en gum.
- Vierkante ruitjes/lijntjes en snap-to-grid.
- Vormen en wiskundige objecten.
- Liniaal, geodriehoek, passer en gradenboog.
- Auto-hide ondertoolbar en grote touch-popovers.
- Scrollstrip rechts.
- Lokale session recovery.

Werkwijze:

- Eerst implementatieplan schrijven.
- Daarna wachten op expliciete go van gebruiker voor bouwen.
- Geen V1b-contentlaag meenemen in V1a, behalve disabled/komt-later affordances.

### 3. Digibord Doorontwikkelen

Digibord is nu contentblock-gebaseerd en ondersteunt slidedeck/media beter, maar moet nog verder een professionele presentatiemodus worden.

Nodig:

- Alle contentblocktypes mooi presenteren.
- Betere slide/fase-opbouw.
- Docentbediening.
- Fullscreen-modus verder stabiliseren.
- PDF/slidedeck ervaring verder polijsten.
- Media-PDF/documentviewer netjes afronden.
- Video/YouTube fullscreen UX controleren.

### 4. CMS Lesblokstudio Verfijnen

Nodig:

- Fullscreen editor voor tekst en afbeeldingen.
- Afbeeldingen in editor kunnen positioneren en verwijderen.
- Fontgrootte, fontkleur en meerdere lettertypes zijn deels aanwezig, maar vragen verdere UX-polish.
- Geen overbodige crop-hulptekst bij bloktypes waar dat niet logisch is, vooral bij slidedeck/media.
- Vraagflow verder losmaken van oude "vraag detail"-pagina's.
- Vraagstudio is uitgebreid met nieuwe vraagtypes `koppelen`, `invullen` en `volgorde` naast `open`, `meerkeuze` en `numeriek`; de nieuwe types slaan hun antwoordmodel op in het bestaande `antwoord`-object.
- Mediablokstudio verder vereenvoudigen: directe media-keuze, duidelijke uploadstatus, duidelijke foutmelding bij Storage rules.
- Slidedeckblokstudio verder afstemmen op presentatieworkflow.

### 5. Voortgang En Analytics Versterken

Nodig:

- Analyse per klas, paragraaf en vraag.
- Knelpunten.
- Leerlingdrilldown.
- Signalen voor vastlopers en inactiviteit.

### 6. Toetsmodus V1

Nodig:

- Oefentoets of hoofdstuktoets.
- Pogingen, scores en feedback.
- Docentoverzicht.

### 7. Firebase Security Hardening

Nodig:

- Productierijpe Firestore rules.
- Productierijpe Storage rules.
- Geen dev-bypass in productie.
- Leerlingrechten beperken tot eigen/toegewezen data.
- Storage rules voor `mediaBlocks/**`, `slidedecks/**`, crop/source-paden, met later admin-only writes en leerling-read voor gepubliceerde/toegewezen content.

### 8. Multi-tenant Later

Nodig:

- School/tenantmodel.
- Rollen per tenant.
- Migratiepad voor huidige single-school structuur.

### 9. Branding Asset Afronden

Nodig:

- Controleer `src/afbeeldingen/logo.png`.
- Gebruik dit logo consequent in AppShell/header, login en eventuele andere HELIX-brandingplekken.
- Stage dit asset alleen wanneer dit logo-werk daadwerkelijk wordt uitgevoerd.

## Ontwerpprincipes Voor Verdere Bouw

- Rustige, professionele onderwijsinterface.
- Geen drukke gamification voordat de kernflow stabiel is.
- Docentproductie moet snel zijn: crop/OCR, hergebruik, duidelijke routebouw.
- Leerlingervaring moet simpel en voorspelbaar zijn.
- Eén centrale waarheid voor lesroutes: `contentBlocks`.
- Geen grote refactors zonder directe productwaarde.
- Geen destructieve database-acties zonder expliciete bevestiging.
- Geen client-side tokenuitgifte.
- Firebase rules liever documenteren en handmatig laten plakken dan automatisch wijzigen.
- Media en slidedecks zijn verschillende didactische objecten. Niet samenvoegen tot een generiek PDF-blok zonder expliciete keuze.
- Eén mediablok = één hoofdmedia-item. Meerdere media betekent meerdere blokken.
- Presenter moet digibord-first worden ontworpen: grote touchdoelen, exacte pointercoordinaten en een rustige toolmodus boven decoratieve styling.
- Presenter V1a is Core-first. Bouw niet alvast V1b-import/vraagvensters mee zonder nieuw akkoord.

## Actuele Technische Aandachtspunten Voor Nieuwe Agent

- Werk op branch `feature/cms-platform`, tenzij de gebruiker anders zegt.
- Recente commits rond CMS/media/layout/Presenter:
  - `0f78c3f feat: add cms question type editors`
  - `a4bc3be docs: analyse vraagtypen implementatie`
  - `bd86e93 fix: stabilize cms tree paragraph counts`
  - `d6cc130 style: widen cms workspace when sidebar collapsed`
  - `34fb5fe fix: make cms block selector responsive`
  - `c707247 style: refine cms block type selector`
  - `e1176c1 fix: persist media uploads immediately`
  - `300bb58 fix: recognize uploaded media videos`
  - `ff6bd34 feat: expand media block playback`
  - `90008ba fix: fallback embedded slidedeck pdf presenter`
  - `69d3cc1 feat: add question type token templates`
  - `228fdad fix: open question studio from lesson blocks`
  - `e58759a feat: add fill blank gap editor`
  - `75b0244 feat: toggle lesson block status badges`
  - `4ded4ed fix: render question types in lesson preview`
  - `6fcb9d9 feat: show answer feedback in lesson preview`
  - `9926adb chore: remove preview answer text labels`
  - `b4a13d1 fix: render sequence questions in preview`
  - `5a08002 fix: fallback admin login to redirect`
  - `a5de703 docs: add presenter design spec`
- Er staat bewust nog untracked lokale tooling/context zoals `.superpowers/`. Niet automatisch toevoegen of verwijderen.
- `src/afbeeldingen/` kan untracked zijn door logo/assetwerk. Controleer inhoud voordat je staged.
- Volledige `npm run lint` faalt nog op bestaande lint-schuld in oudere/externere bestanden. Gebruik voorlopig gerichte `npx eslint <aangepaste bestanden>` plus `npm run build`.
- Belangrijke bestanden om eerst te lezen bij CMS/lesroutewerk:
  - `src/components/cms/CmsShell.jsx`
  - `src/components/cms/ContentBlockBuilder.jsx`
  - `src/lib/contentBlockUtils.js`
  - `src/lib/digibordSlideUtils.js`
  - `src/components/media/MediaRenderer.jsx`
  - `src/pages/StudentLessonPage.jsx`
  - `src/components/digibord/DigibordViewer.jsx`
  - `src/lib/questionTypeRegistry.js`
  - `src/lib/questionPreviewUtils.js`
  - `src/lib/fillBlankUtils.js`
  - `docs/superpowers/specs/2026-05-27-presenter-design.md`
- Belangrijke services:
  - `src/services/cmsService.js`
  - `src/services/mediaService.js`
  - `src/services/slidedeckService.js`
  - `src/services/voortgangService.js`
- Dev server wordt meestal gestart met Vite op `http://127.0.0.1:5173/`.
- In de meest recente lokale sessies werkt de dev server voor de gebruiker via `http://localhost:5174/`; noem liever deze URL wanneer die poort actief is.
- Voor lokale dev-login: `.env.local` kan `VITE_ENABLE_DEV_LOGIN=true` bevatten. Geen Firebase Anonymous Auth gebruiken voor tests.
- Voor de volgende Presenter-stap: schrijf eerst een implementatieplan voor V1a en wacht op expliciete go voordat je code bouwt.

## Verificatiegewoonte

Na significante wijzigingen:

1. Gerichte tests draaien.
2. Gerichte lint draaien.
3. `npm run build` draaien.
4. Browserpreview waar mogelijk.
5. Commit en push volgens projectregel.

Gebruik bij voorkeur:

```bash
npm run build
npx eslint <aangepaste bestanden>
node --test <gerichte testbestanden>
```

## Context Reset Instructie Voor Codex

Als dit document wordt gelezen na contextcompressie:

1. Lees eerst dit hele document.
2. Controleer daarna `src/App.jsx` voor actuele routes.
3. Controleer `src/lib/contentBlockUtils.js` voor actuele lesbloktypes.
4. Controleer `src/lib/adminWorkspaceNav.js` voor actuele adminnavigatie.
5. Controleer recente gitstatus voordat je wijzigt.
6. Vraag bij grote productkeuzes eerst om brainstorm/plan, tenzij de gebruiker expliciet "bouw", "proceed" of "implementeer" zegt.
