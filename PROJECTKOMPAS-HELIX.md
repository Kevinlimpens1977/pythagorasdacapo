# HELIX Projectkompas

Laatst bijgewerkt: 20 mei 2026

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

Losse afbeeldingen, video's, YouTube-links, externe links en algemene documenten.

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

Digibord moet uiteindelijk contentblocks presenteren als klassikale lesflow.

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

Let op:

- Firebase rules zijn tijdens development soms tijdelijk permissief gemaakt.
- Productierijpe security rules zijn nog een aparte hardeningfase.
- Leerlingen mogen uiteindelijk alleen eigen voortgang en toegewezen/gepubliceerde lesstof zien.
- CMS-writes moeten uiteindelijk beperkt zijn tot admin/docent.

## Wat Al Is Volbracht

### Product en navigatie

- Rebranding naar **Helix** met DNA-helix logo.
- Adminnavigatie heringericht naar werkplekken:
  - Lesstof
  - Voortgang
  - Leerlingen
  - Spellen
  - Beheer
- `Lesmateriaal` is voor admins niet langer de primaire hoofdknop.
- Active states zijn routegroep-gebaseerd.

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
- Zoekveld en statusinformatie toegevoegd.
- Contentblocks voor theorie, voorbeeld, vraag, media en samenvatting toegevoegd.
- Later uitgebreid met game en slidedeck.
- Lesrouteblokken hebben volgorde via omhoog/omlaag-knoppen.
- Wisactie voor lesblok is vervangen/bedoeld als kleinere bevestigings-UX in plaats van browser-alert.

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

### Voortgang

- Voortgangspagina heeft basisdashboard.
- Marges/layout zijn afgestemd op andere adminpagina's.
- Overbodige croptoollink is verwijderd/bedoeld verwijderd uit voortgang.

### Documentatie

- `19526.md` gemaakt met open verbeterpunten uit de oorspronkelijke PRD.
- `IPLAN-GAME-MODULE.md` gemaakt/aangescherpt.
- `IMPLEMENTATIEPLAN-SLIDEDECKCREATOR.md` gemaakt.

## Belangrijkste Open Productwerk

### 1. Leerling-lesroute Afronden

De leerlingervaring moet de gepubliceerde contentblocks netjes als leerroute tonen.

Nodig:

- Moderne leerlingweergave voor contentblocks.
- Heldere voortgang door theorie, voorbeeld, vraag, media, samenvatting, game en slidedeck.
- Rustige empty states.
- Mobiele layout.

### 2. Digibord Doorontwikkelen

Digibord moet een echte professionele presentatiemodus worden.

Nodig:

- Alle contentblocktypes mooi presenteren.
- Betere slide/fase-opbouw.
- Docentbediening.
- Fullscreen-modus.
- PDF/slidedeck ervaring verder polijsten.

### 3. CMS Lesblokstudio Verfijnen

Nodig:

- Fullscreen editor voor tekst en afbeeldingen.
- Afbeeldingen in editor kunnen positioneren en verwijderen.
- Fontgrootte, fontkleur en meerdere lettertypes.
- Geen overbodige crop-hulptekst bij bloktypes waar dat niet logisch is.
- Vraagflow verder losmaken van oude "vraag detail"-pagina's.

### 4. Voortgang En Analytics Versterken

Nodig:

- Analyse per klas, paragraaf en vraag.
- Knelpunten.
- Leerlingdrilldown.
- Signalen voor vastlopers en inactiviteit.

### 5. Toetsmodus V1

Nodig:

- Oefentoets of hoofdstuktoets.
- Pogingen, scores en feedback.
- Docentoverzicht.

### 6. Firebase Security Hardening

Nodig:

- Productierijpe Firestore rules.
- Productierijpe Storage rules.
- Geen dev-bypass in productie.
- Leerlingrechten beperken tot eigen/toegewezen data.

### 7. Multi-tenant Later

Nodig:

- School/tenantmodel.
- Rollen per tenant.
- Migratiepad voor huidige single-school structuur.

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

