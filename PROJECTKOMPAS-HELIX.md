# HELIX Projectkompas

Laatst bijgewerkt: 24 augustus 2026

Dit document is het vaste contextanker voor verdere ontwikkeling van HELIX. Lees dit bestand eerst na contextcompressie, bij een nieuwe agent-sessie of voordat je grotere productkeuzes maakt. Het doel is niet om alle details te herhalen, maar om een frisse agent snel en correct op de rails te zetten.

## De Leeromgeving Is Leeg (24 augustus 2026)

Op 24 augustus 2026 is de leeromgeving bewust en eenmalig leeggemaakt, zodat de lesstof opnieuw opgebouwd kan worden. **Alles wat hieronder over concrete DV-lesinhoud staat, beschrijft dus hoe het wérkte, niet wat er nu in Firestore staat.**

Verwijderd (692 documenten, via `scripts/reset-leeromgeving.mjs --apply`):

- Alle lesstof: 1 vak, 1 leerjaar, 1 niveau, 6 hoofdstukken (H1-H5 van de DV-lesserie plus een testhoofdstuk), 31 paragrafen, 276 contentblocks en 1 vraag.
- Alle leerlingveilige snapshots: 276 `publicContentBlocks` en 1 `publicQuestions`.
- De 5 badges en 2 certificaten uit de DV-seed.
- De 4 klassen (EOA, H1TL1, H1bk1, h2K1), inclusief hun toegangscodes.
- Alle 51 voortgangsdocumenten.
- Alle tokendata: rekeningen, grootboek, aankopen, claims en loadouts.

Bewust behouden:

- De 16 `users` (15 leerlingen + 1 admin). Namen, wachtwoordstatus en foto's staan er nog; `klasId`, `joinedKlasAt` en de oude lesstatusvelden zijn eraf gehaald omdat hun klas niet meer bestaat. **Firebase Auth is niet aangeraakt**, dus deze leerlingen kunnen gewoon inloggen.
- De tokenshopcatalogus (35 items), `tokenGameRewardRules`, `gameInstellingen`, `promptTemplates`, `photoImports` en `studentBugReports`.

Let op:

- **Firebase Storage is niet opgeruimd.** De geuploade afbeeldingen, video's, PDF's en crops van de verwijderde lesblokken staan er nog. Ze kosten opslag maar zitten niets in de weg.
- De back-ups staan in `exports/reset-backups/` en bevatten leerlingnamen en e-mailadressen. Die map staat in `.gitignore` en hoort daar te blijven.
- `scripts/inventaris-leeromgeving.mjs` is een alleen-lezen telling van alle collecties; handig om te controleren wat er staat.
- De in-app knop `Reset CMS` (`src/components/admin/CmsResetButton.jsx`) is op 24 augustus 2026 gerepareerd; zie het kopje hieronder.

## De Knop Reset CMS

`Reset CMS` staat in de adminheader (`AppShell`, alleen admin, alleen vanaf xl-breedte) en maakt de lesstof leeg zonder dat je een script hoeft te draaien.

Wat die knop doet:

- Wist de collecties uit `CMS_RESET_COLLECTIONS` (`src/lib/cmsResetConfig.js`): `publicContentBlocks`, `publicQuestions`, `contentBlocks`, `slidedeckPackages`, `vraag`, `paragraaf`, `hoofdstuk`, `niveau`, `leerjaar`, `vak`, `vakken`, plus de `questionMetadata`-subcollecties.
- **De twee publieke snapshots staan bewust vooraan in die lijst.** Breekt de reset halverwege af, dan is "leerlingen zien niets meer terwijl de CMS nog gevuld is" een veilige tussenstand; andersom zouden leerlingen de oude lesstof blijven zien terwijl de docent denkt dat alles weg is. Tot 24 augustus 2026 ontbraken deze twee collecties volledig, waardoor een reset de leerlingervaring niet opruimde.
- Maakt lesstof-toewijzingen in `klassen` leeg (`enabledParagrafen`, `enabledChapters`, `enabledContentBlocks`, `studentOverrides`) en haalt oude lesstatusvelden van leerlingdocumenten af.
- Leerlingvoortgang gaat er alleen uit als de docent het vinkje "Ook de leerlingvoortgang wissen" aanzet. `CMS_RESET_PROGRESS_COLLECTIONS` staat daarom bewust los van `CMS_RESET_COLLECTIONS`; een test bewaakt dat leerlingdata nooit in de gewone wislijst belandt.
- Elke stap wordt apart afgevangen. Een collectie die op de rules stukloopt maakt de rest van de reset niet kapot; het resultaatpaneel toont per collectie wat er is verwijderd en wat er misging.

Wat die knop bewust NIET kan, en waarom:

- `badges` en `certificates` hebben **geen enkele Firestore-rule** en zijn daarmee voor elke client onbereikbaar, ook voor een admin. Alleen een Admin SDK-script (`scripts/reset-leeromgeving.mjs`) komt erbij. De seed-import maakt ze wel aan. Wil je die ooit client-side beheren, dan moeten er eerst rules voor komen.
- `adminCropSources` blijft staan: dat is je gescande bronmateriaal, dat je juist nodig hebt om opnieuw op te bouwen. Ook die collectie heeft overigens geen rule.
- Firebase Storage wordt niet opgeruimd.

Het dialoogvenster benoemt dit alles expliciet via `CMS_RESET_UNTOUCHED`, zodat de tekst niet meer belooft dan de knop waarmaakt.

## Nieuwe Chat Startcontext

Als een nieuwe Codex-chat dit document leest, moet die vooral dit weten:

- Werk op branch `codex/digitale-vaardigheden-seed`, tenzij de gebruiker iets anders zegt.
- Firebase/appnaam is visueel HELIX, maar Firebase project/config kan nog `pythagoras-eoa` heten.
- Dev server voor dit project draait doorgaans op `http://localhost:5173/` of `http://127.0.0.1:5173/`. Poort `5174` draaide eerder een ander project.
- Er is een GitHub-backupbranch voor de meest recente lesstof-bouwen-verbeteringen: `backup/voor-lesstof-bouwen-verbeteringen-2026-06-06`. Eerdere backup: `backup/digidocent-before-learning-flow`.
- Recente hoofdflow: de leerlingroute is uitgebreid met Digidocent, AI/open-antwoordbeoordeling, voortgangsblokjes, herstelopdrachten/challenge en leerling-foutmeldingen.
- Recente CMS-flow: contentblocks hebben nu bron-/reviewflags, readiness, publicatie-overzicht, veilige public snapshots en zichtbaar bewerkmenu in de navigatieboom.
- Recente NotebookLM-flow: slidedeckpackages krijgen bronmanifest, generatie-/reviewmetadata en kunnen na upload/review terug synchroniseren naar het geopende CMS-slidedeckblok.
- Adminnavigatie is nu in code: `Lesstof`, `Voortgang`, `Leerlingen`, `Spellen`, `Presenter`, `Instellingen`. `Meldingen` staat als route `/admin/meldingen` onder `Instellingen` met open-meldingenbadge; `Projectkompas` heeft een aparte adminknop en route `/admin/projectkompas`.
- Recente Presenter-flow: naast V1a Core zijn tekstobjecten, een beperkt wiskundesymbolenpalet, verhoudingstabel/Pythagoras-bordtools, paginathumbnails en HELIX-lesstofimport als snapshotpagina's aanwezig. Gum/borstelgroottes zijn in de actuele codecheck nog niet als aparte toolbarflow zichtbaar.
- Recente leerlingbeheer-flow: leerlingfoto-import ondersteunt klassenfoto upload/plakken, PDF-fotolijstimport op basis van tekstlaag, reviewrijen en definitieve goedkeuring via Callable Function `approveStudentPhotoImportCrop`.
- Recente tokenshop-flow: de leerlingshop op `/tokenshop` heeft categorietabbladen (`Alles`, `Avatars`, `Frames`, `Pins`, `Banners`, `Effects`, `Titels`) met aantallen per tab; itemnamen zijn vakneutraal (bijv. `Leerheld` in plaats van `Rekenheld`).
- Hosting draait op **Vercel** (project `helix`, repo `Kevinlimpens1977/pythagorasdacapo`, `vercel.json` met Vite/dist en SPA-rewrite plus `.vercelignore`). Deployen gebeurt door te pushen naar GitHub. Firebase blijft alleen backend: Auth, Firestore, Storage en Functions in `europe-west1`. Gebruik dus nooit `firebase deploy --only hosting`, ook al staat er nog een `hosting`-blok in `firebase.json` en ligt er een oude `.firebase/`-cache.
- Recente spellen-flow: naast de vijf React-spellen in `src/games/` bestaat er nu een tweede spelsoort. `ExternalGameHost` draait een compleet standalone spel als statische map uit `public/games/<game-id>/<versie>/` in een same-origin iframe, met een postMessage-contract naar hetzelfde `onComplete`. Eerste gebruiker: **DVLingo** (12 augustus 2026).
- Bekende ongerelateerde untracked items kunnen in gitstatus staan, bijvoorbeeld losse screenshots in `exports/`, bron-artwork in `badges/` en lokale `.firebase/`-cache. Niet automatisch stagen of verwijderen.
- De gebruiker wil vaak eerst bevraagd worden bij grote productkeuzes, maar gaf voor de huidige Digidocent- en meldingenrichting expliciet akkoord.
- Volledige lint kan bestaande repo-brede schuld raken. Gebruik gericht `npx eslint <aangepaste bestanden>`, gerichte `node --test ...` en `npm run build`.

Recente commits die een nieuwe chat moet kennen:

- `80bd7f4 chore: sluit dvlingo_startbestanden uit van de Vercel-upload` (12 aug 2026, HEAD)
- `80c9632 chore: launch-config dvlingo-bron wijst naar de bronmap op 8124`
- `5debee8 test: pariteitsbank voor DVLingo tegen de standalone bron`
- `7121284 feat: DVLingo als extern spel in het leerplatform`
- `88c4a91 feat: route-introducties met vingeruitleg en voiceover voor data koerier` (2 aug 2026)
- `ca9671e fix: caps lock-vangnet en uitgestelde onComplete voor data koerier`
- `0ff94a5 feat: data koerier tienvinger-typspel + spellen-checkpoint`
- `061721b feat: instrumenten wegklikbaar via toggle in werkbalk` (18 juli 2026)
- `848bfa8 feat: professionele passer die bogen en cirkels als inkt tekent`
- `797ca0b feat: precisiegum wist stukjes van een streek i.p.v. de hele streek`
- `12b4539 feat: presenter award-features (vraagregie, focus, instrumenten v2, bordmodus)`
- `cd456cb feat: render exercise-vraagblokken in leerlingroute`
- `8e62b20 feat: maak leerlingroute mobiel- en leerlingvriendelijker`

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
- Cloud Functions staan in `functions/index.js` en bevatten onder andere OpenRouter/Digidocent, OCR, leerlingaccount-sync, wachtwoordreset en leerlingfoto-importgoedkeuring.
- Belangrijke routes staan in `src/App.jsx`.
- Adminnavigatie staat in `src/lib/adminWorkspaceNav.js`.
- Lesbloktypes staan in `src/lib/contentBlockUtils.js`.
- Contentblock-readiness staat in `src/lib/contentReadiness.js`.
- Paragraafmetadata staat in `src/lib/paragraphMetadata.js`.
- Publieke leerlingweergaves staan in `src/lib/publicContentBlockView.js` en `src/lib/publicQuestionView.js`.
- Slidedeck-review en CMS-sync staan in `src/lib/slidedeckReview.js` en `src/lib/slidedeckCmsSync.js`.
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
- Publiceren is nu gekoppeld aan readiness: blokken moeten inhoudelijk compleet zijn, bron-/AI-review respecteren en waar nodig een docentbesluit of override-reden hebben.
- Paragrafen kunnen leerdoelen, bewijsproduct, SLO-koppeling, doelgroep, geschatte tijd en reviewstatus bewaren.

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

Leerlingfoto-import is inmiddels gebouwd als leerlingbeheerflow:

- Import uit geplakte/geuploade klassenfoto is aanwezig.
- Import uit PDF-fotolijst is aanwezig via tekstlaagdetectie en foto-uitsnedevoorstellen.
- Betrouwbare V1 heeft een controlelijst/reviewtabel voor foto-uitsnedes en naam-matching voordat er wordt opgeslagen.
- Bestaande leerlingen krijgen alleen een goedgekeurd `photo`-object.
- Onbekende leerlingen kunnen via `pending_new` als geimporteerd `users`-studentdocument met foto worden aangemaakt; dit is nog geen Firebase Auth-account.
- Echte nieuwe Firebase Auth accounts mogen niet client-side worden aangemaakt; daarvoor blijft een aparte veilige Cloud Function/Admin SDK-flow nodig.

Actuele richting:

- Houd de admin-only foto-importwizard binnen of naast `AdminLeerlingenPage`.
- Hergebruik upload/plak/canvas/selectiepatronen uit `ImageCanvasEditor`.
- Client mag bronfoto uploaden/plakken, PDF-fotolijst verwerken, cropvoorstellen maken, handmatige uitsnedes laten corrigeren en matches voorstellen.
- Docent moet elke rij goedkeuren, overslaan/afwijzen of als nieuwe geimporteerde leerling markeren voordat data definitief wordt opgeslagen.
- Definitief koppelen aan `users/{uid}` en definitief opslaan naar `student-photos/...` gebeurt via Callable Cloud Function `approveStudentPhotoImportCrop`.
- De client mag geen echte Firebase Auth-leerlingaccounts bulk aanmaken.

### Spellen

Werkplek voor educatieve browsergames.

Huidig:

- Game Registry is per 18 juli 2026 opnieuw opgebouwd: alle oude prototypes (Pythagoras Trainer, Account Escape) en ~29 placeholders zijn verwijderd voor een schone start.
- Eerste echte spel: **Wachtwoord Detective** (`wachtwoord-detective`, `src/games/wachtwoordDetective/`) over veilige wachtwoorden voor VMBO kader-TL leerjaar 1. Vier zaken (2x meerkeuze, 2x fragmenten combineren, zaak 4 is bewust onkraakbaar met "Ik geef op"-leermoment) + debriefvragen + finale "bescherm je eigen account". maxScore 15, tokenregel max 100 (score_accuracy_completion), volledig light mode. Higgsfield-avatars in `public/games/wachtwoord-detective/` (emoji-fallback in component). End-to-end browsergetest 18 juli 2026 (14/15 → accuracy 93 → suggestie 93 tokens).
- Tweede spel: **Social Media Zoektocht** (`social-media-zoektocht`, `src/games/socialMediaZoektocht/`) — zoekplaat-spel in 3 levels + ⭐ bonuslevel (digitaal klaslokaal, influencerkamer, social media studio, en "Het grote mediafestival" met 12 bonuswoorden zoals smartwatch/VR-bril/drone/router/cookie incl. cookie-eindvraag) voor VMBO basis/kader/TL leerjaar 1-2. maxScore 5750 (3×1300 + 1600 + 250 eindbonus). Per level één Higgsfield-zoekplaat waarin alle 9 objecten logisch verwerkt zijn, met onzichtbare hotspots (transparante buttons op %-coördinaten, aria-labels, hitbox-marge) — géén losse objectlagen of intro-animaties meer (op verzoek gebruiker vervangen, 18 juli 2026). Anti-gok-mechaniek (18 juli 2026): leerling selecteert éérst een woord in de zoeklijst en klikt dán de plek in de plaat aan; klikken zonder selectie telt niet (vriendelijke melding), verkeerde plek mét selectie = misklik (-10) met melding, hint selecteert + pulseert het doelwoord en toont de hinttekst. Gevonden = groene ring + vinkje op de plek. Pauze, timer, WebAudio-geluidjes met mute. Score centraal in `zoektochtConfig.js`, tokenregel max 200, speellimiet 3x. Leveldata als config in `levels/` (nieuw level = nieuwe zoekplaat + configbestand; hotspotposities schatten op de gegenereerde afbeelding). Resultaat bevat `details` met per-level statistieken (optioneel veld in `createLocalGameResult`/GamePlayer, additief). End-to-end browsergetest (hotspots exact op configuratieposities geverifieerd; perfect level = 1300 punten).
- Derde spel: **Turbo Typen** (`turbo-typen`, `src/games/turboTypen/`) — sneltypspel in 5 levels voor VMBO leerjaar 1-2. Digitale woorden bewegen via CSS-animatie van links naar de "firewall" rechts; typen zonder invoerveld (eerste letter lockt een woord, ZType-stijl, pure logica in `turboTypenLogic.js` + tests). Per level langere woorden én hoger tempo (vaste woordenlijsten in `turboTypenWoorden.js` → deterministische maxScore 4180 = 10/letter + 100 foutloos-bonus per level). Gevaar-pulse bij de firewall (CSS-animatie met delay op 72% van de baan), combo-teller, letterscore-popups, schermschok bij inslag, climax-eindscherm met optellende score en tokenbedrag. Higgsfield-graphics in `public/games/turbo-typen/` (allemaal met fallback): 5 zachte pastel-achtergronden per level met Ken Burns-animatie + witte leesbaarheidslaag, vlammende firewall-muur (`firewall.png`, cutout), ster-explosie `boem.png` op de exacte woordpositie bij raak (positie via getBoundingClientRect), toetsenbord-mascotte op startscherm, gouden trofee op eindscherm. **replayDecay-mechanisme (server-side, nieuw)**: `tokenGameRewardRules.replayDecay` (0-1) laat herhaalbeurten uitbetalen met verval — beurt n = basis × decay^(n-1), totaalplafond = rule.max; claim-doc houdt `plays`/`totalAwarded` bij, elke uitbetaalde beurt krijgt een eigen grootboekregel (`activity-replay`). Turbo Typen: max 200, decay 0.5, speellimiet Onbeperkt. Spellen zonder replayDecay behouden exact het oude 1x-gedrag.
- Vierde spel: **PacoPacMan** (`paco-pac-man`, `src/games/pacoPacMan/`) — Pacman-stijl doolhof-arcadespel in 4 levels over de hele DV-leerlijn, VMBO leerjaar 1-2. Eigen naam/karakters (Bandai Namco-rechten). Held Chompy (geel robotje, 3 mond-frames) tegen 4 virus-spookjes met AI-persoonlijkheden (jager/sluiper/twijfelaar/bang) + scatter/chase-klok; finale (level 4) heeft teleport-tunnels en een Virus-Koning die in 2 mini-bosses splitst. 3 computer-icoontjes per level bevriezen het spel voor een powervraag (12 vragen uit de theorie-PDF); goed = power-mode (spoken opeetbaar). Pure engine `pacoLogic.js` (vaste 60Hz-timestep, deterministische seeded RNG, greedy-op-kruispunt-AI, swap-botsingdetectie) met 16 node:tests incl. een BFS-bot die elk level volledig uitspeelt om maze-integriteit te bewijzen. React-laag: rAF-loop met sprites via directe DOM-transforms (geen setState per frame), dots op canvas, muren als multi-stroke SVG, cornering+inputbuffer, D-pad bij touch, 3 levens/level zonder game-over, herkansing voor foute vragen. maxScore 7700, tokenregel max 400 met replayDecay 0.5, maxPlays 0. Assets in `public/games/paco-pac-man/`: Chompy-frames, 4 virussen + bange + Virus-Koning, vraag-icoon, power-orb, 4 achtergronden, licht 3D-logo, trofee, en 5 Seedance 2.0-intro-video's (10s, mét de spelkarakters als image-reference). Ontworpen na brainstorm met 3 subagents (GFX/spelbeleving/architectuur). E2E-getest 19 juli 2026 (alle levels, quiz→power, boss+teleports, eindscherm+resultaatcontract; console schoon).
- Vijfde spel: **Data Koerier** (`data-koerier`, `src/games/dataKoerier/`) — tienvinger-blindtyptrainer voor VMBO basis/kader/TL leerjaar 1-2, gebouwd 2 augustus 2026 (ontwerp: `SPELOPZET-DATA-KOERIER.md`). Dertien routes (basisrij → boven/onder → Shift → cijfers → leestekens → digiwoorden → zinnen → meesterproef) + Toprit-snelheidsuitdaging (ontgrendelt na route 8, tijdsbonus alleen bij ≥90% accuracy). Route gehaald bij ≥90% nauwkeurigheid, dan pas ontgrendelt de volgende; regels worden per beurt uit grotere pools geschud (maxScore per sessie-inhoud, contract-conform). Visueel toetsenbord met vingerkleuren/mini-handjes/Shift-per-andere-hand, adaptieve scoreloze drills bij <80% regelnauwkeurigheid, fout = niet-bestraffend blijven staan (rood+onderstreping+✗, nooit kleur-alleen). Records/ontgrendeling in localStorage (per apparaat); details (accuracy/wpm/zwakste toetsen) reizen mee naar voortgang. Contentvalidatie is een test: `dataKoerierRoutes.test.js` dwingt de tekensetregel per route af. Higgsfield-assets (stad/koerier-cutout/trofee/mascotte, `nano_banana_2`) in `public/games/data-koerier/` met emoji/CSS-fallbacks. Tokenregel max 200, replayDecay 0.5, maxPlays 0. Let op: de serverdefault in `functions/index.js` vereist een functions-deploy; tot die tijd kan de regel ook via `/admin/spellen` worden opgeslagen. E2E-browsergetest 2 augustus 2026 (route uitspelen 99% → score 1805/1810, faalscenario 66% met drill-invoeging, record/ontgrendeling/mute-persistentie; console schoon; daarna ook visueel geverifieerd in echte Chrome met screenshots). Na gebruikersfeedback zelfde dag: (a) Caps Lock-vangnet — de linkerpink raakt bij het reiken naar de a snel Caps Lock, dan telde élke aanslag als fout; nu duidelijke waarschuwingsbanner en die aanslagen tellen niet mee; (b) onComplete wordt uitgesteld gemeld (bij "Naar de routekaart", unmount of uiterlijk na 6 s, exact 1x via pending-ref) zodat GamePlayer fullscreen niet meer sluit vóór de speler het eindscherm zag. Zelfde dag toegevoegd voor zelfstandig werkende brugklassers: skipbare route-introducties ("zo doe je het") die per route de thuisrij en elke nieuwe toets met de juiste vinger tonen op het echte toetsenbord (stappen uit `buildIntroStappen`, dus altijd correct), met voiceover: Higgsfield-TTS-wav's voor routes 1-4 en 7 in `public/games/data-koerier/audio/`, en automatische fallback op browser-spraak (nl-NL) voor de rest en bij ontbrekende bestanden (`dataKoerierSpraak.js`). Bewust GEEN AI-instructievideo's (videomodellen tonen handen/vingers onbetrouwbaar). Resterende TTS (routes 5, 6, 8-13, Toprit) en de Seedance-sfeervideo wachten op nieuw Higgsfield-tegoed — zie SPELOPZET-DATA-KOERIER.md.
- Zesde spel: **DVLingo** (`dvlingo`, `public/games/dvlingo/v1/`) — Digitale Vaardigheden Lingo, geintegreerd 12 augustus 2026. Dit is het eerste **externe** spel: een bestaand standalone vanilla-JS spel (~18.600 regels, bron blijft in `dvlingo_startbestanden/`) dat niet is herbouwd maar als statische map wordt geserveerd. De spelmotor is byte-identiek; alleen `index.html` is aangepast en `js/helix-brug.js` is toegevoegd als leesmee-brug die de eindstand uit het DOM-contract en `DVL.Game.staat()` haalt. Woorden raden over veilig en slim online zijn in drie levels, met na elk level de ballenfase en een bonuswoord van elf letters. Tokens: 6.000 spelpunten = 100% accuracy, regel 0-400 met `replayDecay 0.5`, onbeperkt speelbaar. Spelkeuzes: 2-spelersmodus verwijderd, "Stoppen en naar de eindstand" telt als afronding met de tot dan behaalde score, waarschuwing bij verlaten tijdens een lopend potje, geen sessieherstel. Visuele pariteit met de bron is blind bewezen via `scripts/dvlingo-pariteit.mjs` (bron op poort 8124 via launch-config `dvlingo-bron`; zes schermen desktop + mobiel, geen verlies, geen console-fouten; beelden in `exports/dvlingo-pariteit/`).
- **Platformvoorziening voor externe spellen:** `src/games/ExternalGameHost.jsx` is een herbruikbare iframe-schil voor standalone spellen in `public/games/`, met een postMessage-contract (`gereed`/`gestart`/`bezig`/`klaar`) dat uitkomt op hetzelfde `onStart`/`onComplete`-contract als de React-spellen. Gekozen om CSS- en JS-isolatie te garanderen (geen botsing tussen de spel-reset en Tailwind, geen `id`-collisions, geen document-brede listeners die blijven hangen) en omdat een engine-update dan een mapvervanging is. De vijf React-spellen in `src/games/` blijven ongewijzigd.
- **Woordenbeheer DVLingo** zit als adminpaneel op `/admin/spellen` (`src/games/DvlingoWoordenPanel.jsx`), naast het paneel Tokenbeloning. Opslag in Firestore-collectie `gameInstellingen/{gameId}`: read voor iedere ingelogde gebruiker, schrijven admin-only. Het spel leest de lijst read-only mee en schrijft zelf nooit naar Firestore. Let op: dit paneel werkt pas nadat `firestore:rules` is gedeployed.
- De infrastructuur staat er volledig: `/admin/spellen`, GamePlayer, GameComponentRenderer, `gameComponentKeys.js`, `ExternalGameHost.jsx`, het `game`-lesbloktype en de CMS-selectie.
- Het `game`-lesbloktype werkt end-to-end in de leerlingroute: voortgang gaat naar Firestore en tokens worden server-side toegekend via `awardTokensForActivity` (reward-rules in `tokenGameRewardRules`; defaults voor beide spellen in `DEFAULT_GAME_TOKEN_REWARD_RULES` in `functions/index.js`).
- Tokens worden niet client-side uitgegeven.
- Tokenregels per spel zijn instelbaar op `/admin/spellen` (paneel "Spelinstellingen": tokens actief, min, max, berekening). Opslaan schrijft naar `tokenGameRewardRules/{gameId}`; "Herstel standaard" verwijdert de eigen regel. Client-helpers en de spiegel van de serverdefaults staan in `src/lib/gameTokenRewardRules.js` + `src/services/tokenService.js`.
- Speellimiet per spel: zelfde paneel, "Aantal keer speelbaar" (1-5 of Onbeperkt), opgeslagen als `maxPlays` in hetzelfde `tokenGameRewardRules/{gameId}`-document (default in de registry via `game.maxPlays`, 0 = onbeperkt). Telling loopt per leerling per lesblok in de voortgang (`gamePlayCount`); handhaving client-side in `GameBlock` (leerling ziet resterende beurten en na de limiet een "uitgespeeld"-kaart, stap blijft afgerond). `tokenGameRewardRules` is nu leesbaar voor alle ingelogde gebruikers (schrijven admin-only) zodat de limiet live geldt. Bewust een zachte limiet in dezelfde vertrouwenslaag als voortgang; tokens blijven server-side 1x beveiligd.
- Let op: lesblokken die naar een verwijderde gameId verwijzen tonen leerlingen "Game niet gevonden" totdat ze een nieuw spel krijgen of worden gedepubliceerd. Sinds de opruimactie van 24 augustus 2026 bestaan er geen lesblokken meer, dus dit speelt pas weer bij nieuwe content.
- Er is een startgids voor nieuwe spellen: `STARTGIDS-NIEUW-SPEL.md` in de projectroot.

### Tokensysteem en Tokenshop

Gebouwd per 7 juni 2026, catalogus volledig gevuld per 13 juli 2026.

- Uitgifte volledig server-side via Cloud Functions (regio `europe-west1`): `awardTokensForActivity`, `purchaseTokenShopItem`, `equipTokenShopItem`, `adjustStudentTokens`, `createOrUpdateTokenShopItem`, `uploadTokenShopItemImage`.
- Firestore-collecties: `tokenAccounts`, `tokenTransactions` (grootboek), `tokenPurchases`, `tokenAwardClaims` (idempotentie), `studentTokenLoadouts`, `tokenShopItems`, `tokenGameRewardRules`. Alles client-side read-only; muteren kan alleen via functions.
- Economie geijkt op circa 200 tokens per gewone les. Prijsladder: pins 60-700, titels 80-1500, avatars 100-2200, frames 150-900, banners 200-1000, victory-effects 400-950.
- Catalogus (35 items) staat in `src/lib/tokenShopRewards.js` per categorie (`DEFAULT_AVATAR_ITEMS`, `DEFAULT_FRAME_ITEMS`, `DEFAULT_PIN_ITEMS`, `DEFAULT_BANNER_ITEMS`, `DEFAULT_TITLE_ITEMS`, `DEFAULT_VICTORY_EFFECT_ITEMS`). Artwork in `public/token-shop/` (glossy 3D badge-stijl).
- Seeden kan via de adminknop in `/admin/tokenbeheer` of via `node scripts/seed-token-shop-catalog.mjs --apply` (Admin SDK, dry-run zonder vlag).
- Leerlingweergave: actieve avatar/frame/titel/pins in de header (`AppShell`), banner/titel/frame/pins ook op `/profiel`, kopen en activeren op `/tokenshop`.
- `/tokenshop` heeft categorietabbladen (`Alles`, `Avatars`, `Frames`, `Pins`, `Banners`, `Effects`, `Titels`) met item-aantallen per tab; tabvolgorde volgt `TOKEN_SHOP_ITEM_TYPES` in `src/lib/tokenShopRewards.js` (UI in `src/pages/StudentTokenShopPage.jsx`).
- Itemnamen zijn vakneutraal: de titel `Rekenheld` is vervangen door `Leerheld` (itemId `titel-leerheld`), zodat de shop niet wiskunde-specifiek voelt.
- Victory-effects spelen bewust NIET na elke vraag: het volledige effect speelt bij paragraafafsluiting, een subtiele variant bij 5-goed-op-rij streak-mijlpalen. Logica in `src/lib/victoryEffects.js` (+tests), overlay in `src/components/tokens/VictoryEffectOverlay.jsx`, CSS in `src/index.css` (`victory-*`).
- Admin item-editor ondersteunt accentkleur, kaartanimatie, pin-shortLabel en effect-keuze (`previewStyle`).

### Presenter

Presenter is de nieuwe digibord-first werkbordmodule, vergelijkbaar met Prowise Presenter of SMART board software, maar in HELIX-stijl en later gekoppeld aan lesroutes.

Status per 7 juni 2026:

- Presenter V1a Core is gebouwd en blijft onderdeel van de huidige HELIX-basis.
- Route bestaat op `/admin/presenter`.
- Eigen adminnavigatieknop `Presenter` bestaat.
- Werkbalk en bovenrand zijn visueel gelijkgetrokken met de zachte HELIX-toolbarstijl.
- Lesstofimport loopt primair via de onderste werkbalkknop `Lesstof`; de dubbele bovenknop `Importeer CMS` is verwijderd.
- De module is technisch geimplementeerd en gericht getest, maar de echte digibordervaring moet nog browsermatig en praktisch worden gevalideerd.

Belangrijk: behandel Presenter niet meer als alleen een plan. Behandel het als een gebouwde V1a met open validatie en polish.

Grote UX-uitbouw per 18 juli 2026 (zie `IMPLEMENTATIEPLAN-PRESENTER-UX.md`, werkpakketten A/B/C volledig opgeleverd; bewust ZONDER cloudsessies/export):

- Precisiegum met drie borstelgroottes (wist alleen het geraakte stuk van een streek en splitst hem waar nodig; objecten blijven ongemoeid), rotatiehandvat met 15°-snap, custom kleurkiezer + recente kleuren, één paginanavigator, aria-labels/sneltoetsen, localStorage-recovery met autosave-indicator en bordnaam, importdialog met bevestigingsstap en blokselectie.
- Tekenervaring: gladde inkt (quadratic curves + drukmodulatie), live preview op canvas met rAF, pen/vinger-scheiding met palm rejection en two-finger pan, meetkundepen (rechte lijn + gridsnap + Shift-hoeksnap), smart guides met uitlijnsnap, Ctrl+D dupliceren, voorgrond/achtergrond, history zonder structuredClone per streek.
- Meetinstrumenten zijn echte bordobjecten: sleepbaar/roteerbaar, penstreken snappen op de tekenrand van liniaal/geodriehoek, gradenboog/geodriehoek tonen de hoek, de passer is een echt tekenend instrument: naald verslepen, straal instellen met snap op halve ruitjes (label in ruitjes), potloodbeen rondtrekken tekent bogen als inkt (gumbaar/undo-baar, in de actuele penstijl) en een knop tekent de hele cirkel; lijn/pijl kunnen hun lengte in ruitjes tonen (Meet-knop).
- Klassikale regie: onthul/verberg-knop op geimporteerde vraagkaarten, grote timer (1/2/5 min), leerlingkiezer met klaskeuze en leerlingfoto's, spotlight/schermgordijn/laserpointer (Focus-categorie).
- Bordmodus: fullscreen op de Presenter-sectie zelf (adminchrome weg, 100dvh), toolbar-uitlijning links/midden/rechts, donkere bordmodus (donkere inkt wordt automatisch licht), millimeter- en assenstelselachtergronden, zachte paginawissel-animatie.
- Nieuwe libs (elk met tests): `presenterEraser`, `presenterInk`, `presenterInstruments`, `presenterAlignment`, `presenterFocus`; nieuwe componenten `PresenterFocusTools.jsx`, herbouwde `PresenterInstrumentOverlay.jsx`.
- Nog praktijkvalidatie nodig op echte hardware: pen-druk, touch/palm rejection, CTOUCH-ervaring; importbevestiging en leerlingkiezer met echte login testen.

### Instellingen

Werkplek voor platformbrede instellingen die niet bij lesstof, leerlingen of voortgang horen.

Huidig:

- Hoofdnavknop `Instellingen` vervangt de oude hoofdnavknop `Beheer`.
- `/admin/instellingen` is de nieuwe instellingen-landingspagina.
- `/admin` redirect naar `/admin/instellingen`.
- Digidocent/OpenRouter instellingen blijven op `/admin/ai-instellingen` en vallen route-actief onder `Instellingen`.
- Leerling-foutmeldingen staan technisch op `/admin/meldingen` en vallen in de actuele adminnavigatie route-actief onder `Instellingen`.
- De adminshell toont bij `Instellingen` een open-meldingenbadge wanneer er open leerlingmeldingen zijn.
- `/admin/projectkompas` toont dit document in de app en is bereikbaar via een aparte `Projectkompas`-knop buiten de hoofdworkspace-tabs.
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
4. Quiz
5. Toets
6. Media
7. Samenvatting
8. Game
9. Slidedeck

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

Tokenvelden bestaan als metadata per vraagtype. Het tokensysteem zelf is inmiddels gebouwd (zie sectie Tokensysteem en Tokenshop); echte tokenuitgifte gebeurt uitsluitend server-side via Cloud Functions.

### Quiz

Korte controle- of oefenserie binnen een lesroute. Quizblokken gebruiken vraagachtige assessmentdata, maar zijn bedoeld als compacte tussentijdse check.

### Toets

Meer formele toets- of afsluitvorm binnen de lesroute. Toetsblokken worden apart getypeerd zodat later pogingbeheer, scorelogica en toetsmodus kunnen groeien zonder gewone oefenvragen te vervuilen.

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
2. Docent kiest optioneel CMS-context: vak, leerjaar, niveau, hoofdstuk, paragraaf en eventueel het geopende `contentBlockId`.
3. Docent vult leerdoelen en bronmateriaal in.
4. Docent uploadt of plakt afbeeldingen.
5. Docent kiest of beheert prompttemplate.
6. HELIX genereert bron-PDF en bewaart prompt-snapshot, `sourceManifest`, `generationManifest`, `sourceTagsSummary` en waar mogelijk citatie-/bronverwijzingen.
7. Docent gebruikt bron-PDF en prompt in NotebookLM.
8. Docent uploadt de door NotebookLM gegenereerde presentatie-PDF terug naar HELIX.
9. Pakket gaat naar review: bron-PDF, NotebookLM-PDF, checklist, AI-suggesties en docentbesluit worden naast elkaar beoordeeld.
10. Alleen `approved` of expliciet `teacher_decision` met notitie geldt als deck-ready voor CMS-selectie en publicatie.
11. Als het pakket vanuit een leeg CMS-slidedeckblok is gemaakt, synchroniseert upload/review terug naar dat blok.

Datakeuzes:

- Firestore metadata in `slidedeckPackages`.
- Prompttemplates in `promptTemplates`.
- PDF's en assets in Firebase Storage.
- PDF-bestanden niet als binary in Firestore.
- Slidedeck-lesblok verwijst naar een slidedeckpakket.
- JSON/HTML-export blijft deel van de platformcontracten: JSON voor HELIX-inname, HTML voor snelle preview/controle.
- Source tags blijven belangrijk: `SOURCE_BASED`, `AI_SUGGESTION`, `NEEDS_REVIEW`, `TEACHER_DECISION`.
- Slidedeckblokken met `AI_SUGGESTION` of `NEEDS_REVIEW` mogen niet als publiceerbaar worden behandeld zonder review of docentbesluit.

## Digibord

Digibord is de bestaande contentblock-gebaseerde presentatielaag. Presenter is de bredere vrij-bordwerkmodule.

Huidig:

- Gebruikt gepubliceerde `contentBlocks` als bron.
- Toont theorie, voorbeeld, vraag, quiz, toets, media, samenvatting, game en slidedeck digibordvriendelijker.
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
- Geen aparte gumtool zichtbaar in de actuele toolbarcode; gum/borstelgedrag blijft open V1a-plus werk.
- Achtergronden: wit, lijnen en vierkante ruitjes.
- Ruitjes blijven vierkant en kunnen als wiskundeschrift dienen.
- Snap-to-grid voor relevante tekenacties.
- Vormobjecten: rechthoek, cirkel/ovaal, lijn, pijl, driehoek en verwante objecten.
- Extra bordobjecten in actuele code: tekst, verhoudingstabel-tool en Pythagoras-schema-tool.
- Objectlaag met selectie.
- Selectiekader/marquee-selectie.
- Objecten verslepen en schalen via transformaties.
- Rood verwijderpunt/kruisje bij geselecteerde objecten.
- Pagina helemaal leegmaken.
- Tijdelijke meetinstrument-overlays: liniaal, geodriehoek, passer, gradenboog.
- Paginathumbnails bestaan in `PresenterPageThumbnail.jsx`.

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

Actueel deels gebouwd in V1a-plus:

- Teksttool in de toolbar.
- Klik/tap op het bord om een tekstobject te plaatsen.
- Tekstobjecten zijn selecteerbaar, verplaatsbaar en schaalbaar zoals andere objecten.
- Tekstobjecten blijven recht en leesbaar.
- Basale tekstinstellingen: kleur, grootte, fontkeuze, vet/cursief en uitlijning.
- Wiskundesymbolenpalet bij tekstinvoer bestaat, maar is nog beperkt.
- Actuele zichtbare symbolen in `PresenterToolbar.jsx`: `Â²`, `âˆš`, `Ï€`, `Ã·`, `Ã—`, `â‰¤`, `â‰¥`.

Nog gewenst in V1a-plus:

- Wiskundesymbolenpalet uitbreiden tot de bredere doelset:
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
- Actuele import ondersteunt gepubliceerde `theory`, `example`, `media`, `question` en `slidedeck` als snapshotpagina/object.
- Import voegt nieuwe pagina's achteraan toe.
- Import is een momentopname, geen live koppeling met CMS-wijzigingen.
- De importroute moet direct en rustig blijven: liever via de onderste werkbalk dan via dubbele knoppen.
- Tokenmetadata wordt bij import uit snapshots gestript.

Verdieping voor later:

- Theorie, voorbeelden, media, vragen en slidedecks bestaan als geimporteerde bordobjecten, maar verdere browsermatige praktijkpolish blijft nodig.
- Vraagvensters zijn vrij plaatsbaar en schaalbaar als Presenter-objecten; interactieve leerling-/scorelogica op het bord blijft later werk.
- Vraagvensters renderen previews voor huidige vraagtypes via `presenterContentObjectUtils.js`; echte klassikale interactie en scoreflow blijven later werk.
- `Controleer` verschijnt pas na input.
- Feedback via subtiele groene/rode rand.
- Tokens blijven onzichtbaar in Presenter.
- Media binnen geimporteerde blokken gebruikt grote digibordvriendelijke controls.
- Paginathumbnails bestaan, maar verdere visuele/performantiepolish blijft open.

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
- `cmsEmbeddable`
- `tokenRewardPotential`
- `maxPlays`
- `status`

Veiligheidsregels:

- Registry bevat alleen serialiseerbare metadata.
- Geen tokenwrites vanuit client.
- `tokenRewardPotential` en `suggestedTokenReward` zijn alleen indicatief.
- Echte tokenuitgifte gebeurt server-side via `awardTokensForActivity` (reward-rules in `tokenGameRewardRules`); het `game`-lesbloktype schrijft voortgang naar Firestore.

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
- `publicQuestions`
- `publicContentBlocks`
- `voortgang`
- `promptTemplates`
- `slidedeckPackages`
- `questionMetadata`
- `adminCropSources`
- `studentBugReports`
- `tokenAccounts`
- `tokenTransactions`
- `tokenPurchases`
- `tokenAwardClaims`
- `studentTokenLoadouts`
- `tokenShopItems`
- `tokenGameRewardRules`
- `gameInstellingen`

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
- `vraag` en `contentBlocks` zijn de private CMS-bronnen voor admin/docent.
- `publicQuestions` en `publicContentBlocks` zijn leerlingveilige snapshots voor gepubliceerde/toegewezen lesstof.
- Studenten horen via rules alleen eigen voortgang, eigen profielbasis en gepubliceerde/toegewezen publieke snapshots te lezen.
- CMS-writes zijn bedoeld voor admin/docent/supervisor, niet voor leerlingen.
- Productierijpe Firestore en Storage rules blijven een hardeningfase, maar de scheiding private CMS-data versus publieke snapshots is nu de gewenste richting.
- Tokens en leerlingaccount-aanmaak moeten server-side worden gevalideerd.
- Backfillscript voor bestaande publieke snapshots: `scripts/backfill-public-content-snapshots.mjs` via `npm run backfill:public-content`.

## Wat Al Is Volbracht

### Product en navigatie

- Rebranding naar HELIX met DNA-helix logo.
- Adminnavigatie ingericht naar werkplekken:
  - Lesstof
  - Voortgang
  - Leerlingen
  - Spellen
  - Presenter
  - Instellingen
- `Meldingen` draait als `/admin/meldingen` onder `Instellingen`, met open-meldingenbadge in de adminshell.
- `Projectkompas` draait als aparte adminknop/route `/admin/projectkompas`.
- Active states zijn routegroep-gebaseerd.
- `Beheer` is als hoofdnav en oude hub verwijderd; `/admin` redirect naar `/admin/instellingen`.
- `/admin/klassen` valt onder `Leerlingen`.
- `/admin/taken-toewijzen` valt onder `Lesstof`.
- `/admin/ai-instellingen` valt onder `Instellingen`.
- `/admin/meldingen` valt in de actuele code onder `Instellingen`.
- HELIX design system richting is gestart: light-mode onderwijsstijl, zachte surfaces, warme accenten, Sora/Inter-achtige typografie, kaart- en knopstijl.
- Actieve headerknoppen en voortgangtabs gebruiken de lichte HELIX-gradient als borderrand met witte vulling en donkere tekst/icons.

### CMS

- CMS-shell en navigatieboom professioneler gemaakt.
- Bewerken in de CMS-navigatieboom is zichtbaar gemaakt via een menu/actieknop; verborgen dubbelklik-acties zijn niet meer de primaire route.
- Sidebar kan volledig worden ingeklapt.
- Sidebar is sleepbaar breder/smaller.
- Count-badges staan in een vaste rechterkolom en blijven op een regel.
- Tree counts zijn gestabiliseerd zodat paragraaf/blok-aantallen niet verspringen bij uitklappen.
- Hoofdstukbanden-stijl is toegepast voor betere UX.
- Actieve paragraaf gebruikt lichte paarse achtergrond.
- Lesbloktype-selector is responsief en compact.
- Contentblock-statusmodel is uitgebreid naar `draft`, `needs_review`, `ready`, `published` en `archived`.
- Readiness-checks bestaan per bloktype en tonen waarom iets nog niet publiceerbaar is.
- Bron-/reviewflags kunnen publicatie blokkeren; `AI_SUGGESTION` en `NEEDS_REVIEW` vereisen review of een expliciet docentbesluit.
- Admin override-redenen worden vastgelegd wanneer een docent bewust buiten automatische readiness om publiceert.
- Publicatie-overzicht in de routebuilder laat zien welke blokken klaar zijn, welke blokkeren en wat er nog moet gebeuren.
- Paragraafmetadata ondersteunt leerdoelen, bewijsproduct, SLO-koppeling, doelgroep, geschatte tijd en reviewstatus.
- Lesblokstudio heeft dirty-state bescherming, lokale conceptrecovery en guardrails bij sluiten/Escape.
- Bulkacties bestaan voor publiceren, archiveren, dupliceren, verplaatsen en toggles zoals Digidocent/math toolbox waar passend.
- Archiveren heeft foutuitleg en herstel/undo-richting in plaats van stil falen.
- Routetemplates bestaan voor o.a. uitleg + voorbeeld + vragen + samenvatting, NotebookLM-route, herhaalroute, toetsroute, steunroute en plusroute.
- Lesrouteblokken hebben volgorde via omhoog/omlaag-knoppen.
- Contentblocks voor theorie, voorbeeld, vraag, quiz, toets, media, samenvatting, game en slidedeck bestaan.

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
- Game Registry toegevoegd en per 18 juli 2026 opnieuw opgebouwd; de oude prototypes (Pythagoras Trainer, Account Escape) en de circa 29 placeholders zijn verwijderd.
- `/admin/spellen` toegevoegd, inclusief de panelen Tokenbeloning (per spel min/max/berekening/`replayDecay`/`maxPlays`) en DVLingo-woordenbeheer.
- GamePlayer-wrapper toegevoegd, met `variant="student"` en `variant="admin"` en fullscreen via `FullscreenSurface`.
- `ExternalGameHost` toegevoegd als iframe-schil voor standalone spellen uit `public/games/`.
- Zes werkende spellen: Wachtwoord Detective, Social Media Zoektocht, Turbo Typen, PacoPacMan, Data Koerier en DVLingo.
- Resultaten gaan naar `voortgang`; tokens worden uitsluitend server-side toegekend via `awardTokensForActivity`.

### Slidedeckcreator

- `/admin/slidedecks` toegevoegd.
- Promptbibliotheek met templates toegevoegd.
- NotebookLM standaardprompt toegevoegd.
- Bron-PDF generatie in browser toegevoegd.
- Slidedeckpackages in Firestore.
- PDF en assets in Storage.
- Upload van NotebookLM gegenereerde PDF bij bestaande package.
- Bronmanifest, generatie-manifest, source tags, citaties en reviewmetadata worden bij packages bewaard.
- Reviewflow met checklist, statuslabels en docentbesluit is toegevoegd.
- Alleen deck-ready packages horen in CMS-selectie/publicatie gebruikt te worden.
- Vanuit een leeg CMS-slidedeckblok kan de creator openen met paragraaf/context en `contentBlockId`.
- Upload en review kunnen packagegegevens terug synchroniseren naar het gekoppelde CMS-slidedeckblok.
- CMS-lesbloktype `slidedeck` toegevoegd.
- Slidedeck selector toont alleen pakketten die inhoudelijk klaar/reviewbaar genoeg zijn voor lesgebruik.
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
- Preview kan concept/draft versus gepubliceerde route bewuster tonen via querymodus, zodat docenten kunnen controleren zonder per ongeluk leerlingdata te publiceren.
- Leerlingroute hoort publieke snapshots (`publicContentBlocks`, `publicQuestions`) te gebruiken voor leerlingveilige weergave.
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

Een administrator kan een klassenfoto/screenshot uploaden of plakken, een PDF-fotolijst importeren, leerlingfoto's uitsnijden, bestaande leerlingen matchen en na controle de foto als avatar aan het leerlingaccount koppelen.

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
   - Alternatief: upload een PDF-fotolijst; de app leest namen uit de PDF-tekstlaag en maakt foto-uitsnedes op basis van naamposities.
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
   - Mogelijke beslissingen in de actuele code: koppelen aan bestaande leerling (`approve`), nieuwe geimporteerde leerling aanmaken (`pending_new`) of afwijzen/overslaan (`reject`).
   - Toon progress voor `uitsnijden`, `uploaden`, `opslaan`.
   - Ondersteun gedeeltelijk succes: geslaagde foto's blijven gekoppeld, mislukte rijen krijgen retry/overslaan.
   - Definitief opslaan gebruikt Callable Function `approveStudentPhotoImportCrop`; developer-login mag de wizard previewen maar niet definitief koppelen.

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

Voor onbekende leerlingen volgens het oorspronkelijke datamodel:

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

Actuele codecheck 7 juni 2026:

- `approveStudentPhotoImportCrop` maakt bij `pending_new` direct een geimporteerd `users/{photo_import_...}`-studentdocument met `isImportedStudent: true`, lege e-mail en gekoppelde foto.
- `pendingStudents` bestaat nog in rules/resetcontext, maar is niet de hoofdroute van de huidige goedkeurfunctie.

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
- PDF-fotolijst verwerken via `pdfjs-dist`, mits de PDF bruikbare tekstlaag/namen bevat.
- Canvas-crops maken.
- Lokale preview/review tonen.
- Bestaande leerlingen uit dezelfde klas tonen en handmatig matchen.
- Tijdelijke importsource/crops uploaden.
- `photoImports` en croprecords schrijven als admin.

Actuele rules-nuance:

- Firestore `photoImports` en `pendingStudents` zijn admin-only.
- Storage `photo-imports/...` staat in de actuele `storage.rules` nog open voor iedere ingelogde gebruiker.
- Storage `student-photos/...` is read voor iedere ingelogde gebruiker en write false; definitieve writes lopen via Admin SDK.

### Cloud Function / Admin SDK Voor Productie-Hardening

Callable Function `approveStudentPhotoImportCrop` bestaat in `functions/index.js`.

De function doet nu:

- Controleren dat caller de klas mag beheren.
- Controleren dat caller toegang heeft tot `klasId`.
- Verifieren dat `matchedUserId` bestaat.
- Verifieren dat `matchedUserId.role == "student"`.
- Verifieren dat de leerling in dezelfde klas zit, met bewuste adminoverride-optie.
- Tijdelijke crop kopieren naar `student-photos/...`.
- `users/{uid}.photo` bijwerken.
- Bij `pending_new` een geimporteerd leerlingdocument met foto aanmaken.
- Afwijzen/overslaan als `reject` verwerken.

Nog hardenen:

- Afbeeldingen server-side normaliseren/resizen naar vaste veilige formaten; V1 kopieert dezelfde client-WebP naar avatar en thumb.
- Oude importbestanden opruimen.
- Eventueel oude leerlingfoto's vervangen/verwijderen.
- Batchvariant of betere gedeeltelijk-succes/retry-flow uitwerken.

### Securityregels

Voor productie-hardening:

- Leerlingen mogen nooit zelf `role`, `klasId`, `photo`, importstatus of matchdata schrijven.
- `photoImports` alleen admin/docent read/write.
- `pendingStudents` alleen admin/docent.
- `student-photos` write alleen via Cloud Function/Admin SDK.
- `student-photos` read alleen admin/docent en eventueel de leerling zelf.
- `photo-imports` read/write alleen admin/docent en tijdelijk met `expiresAt`.
- Storage moet MIME en bestandsgrootte beperken tot veilige image-types.
- PDF-fotolijstimport is inmiddels gekozen en gebouwd; hardening moet rekening houden met `application/pdf` als bron alleen in deze importflow.

Belangrijk risico:

- Huidige development rules kunnen permissief zijn.
- Omdat adminrechten uit `users/{uid}.role` komen, mogen leerlingen in productie nooit hun eigen rolveld kunnen aanpassen.

### Presenter V1a

- Presenter Core gebouwd.
- Toolbar, pen, markeerstift, ruitjes, objecten, selectie, pagina's, clear page, auto-hide, recovery, fullscreen en meetinstrument-overlays aanwezig.
- Tekstobjecten, beperkt wiskundesymbolenpalet, verhoudingstabel-tool, Pythagoras-schema-tool en paginathumbnails zijn inmiddels in code aanwezig.
- Een aparte gumtool met borstelgroottes is in de actuele codecheck nog niet zichtbaar.
- De donkere Presenter-bovenrand is gelijkgetrokken met de zachte toolbar-achtergrond.
- De onderste werkbalk is de primaire route voor lesstofimport.
- HELIX-lesstofimport maakt snapshotpagina's/objecten van gepubliceerde theorie, voorbeeld, media, vraag en slidedeck.
- Verdere praktijkvalidatie blijft open.

### Authenticatie / Firebase

- Google adminlogin gebruikt popup-login met fallback naar redirect-login wanneer popups blokkeren.
- Lokale dev/admin-login is toegevoegd voor browsermatige verificatie.
- Firebase authorized domains voor lokaal testen horen `localhost` en eventueel `127.0.0.1` te bevatten, zonder poortnummer.

## Direct Openstaand (stand 24 augustus 2026)

Dit zijn geen ontwerpvragen maar concrete losse eindjes van de laatste sessies. Ze blokkeren DVLingo in de klas.

1. `npx firebase deploy --only firestore:rules --project pythagoras-eoa` — verplicht, anders kan het woordenbeheerpaneel niet opslaan naar `gameInstellingen/dvlingo`.
2. `npx firebase deploy --only functions --project pythagoras-eoa` — voor de servercode-default DVLingo 0-400 met `replayDecay 0.5`.
3. Tokenregel voor DVLingo een keer opslaan op `/admin/spellen` -> paneel Tokenbeloning (0-400, "Score en nauwkeurigheid"). Dit is het alternatief zolang de functions-deploy nog niet is gedraaid.
4. Leerling-test DVLingo: CMS-lesblok van type `game` met DVLingo, uitspelen als testleerling, controleren op toast, saldo en transactie in `/admin/tokenbeheer`.
5. **Vercel production branch nakijken.** De site staat op Vercel, maar GitHub's default branch is `master` en `codex/digitale-vaardigheden-seed` staat inmiddels 360 commits voor op `master`. Staat Production Branch in het Vercel-dashboard op de codex-branch, dan is elke push al de productie-deploy. Staat het op `master`, dan is er een merge van 360 commits nodig en dat is een aparte beslissing.
6. Zelfde geldt voor Data Koerier: de serverdefault staat in `functions/index.js` maar vereist een functions-deploy.

## Belangrijkste Open Productwerk

### 1. Presenter V1a Valideren En Polijsten

Nodig:

- Echte browser smoke test vastleggen.
- Testen op groot scherm/touchscreen/CTOUCH.
- Toolbar-interactie verfijnen.
- Objectmanipulatie en selectiekader verder polijsten.
- Meetinstrumenten beoordelen op digibordgevoel.
- Performance bij veel penstreken/objecten testen.

### 2. Presenter V1a-plus Afronden

Alleen bordgerichte afronding; tekst en een beperkte symbolenbasis zijn al gebouwd.

Focus:

- Teksttool browsermatig valideren en polijsten.
- Tekstobjecten, selectie, verplaatsen en schalen op touch/groot scherm valideren.
- Wiskundesymbolenpalet toevoegen met o.a. `π`, `√`, `²`, `³`, `×`, `÷`, `≤`, `≥`, `≈`, `≠`, `∠` en `°`.
- Nuance: het symbolenpalet bestaat al beperkt; de symboolregel hierboven betekent uitbreiden tot de volledige doelset en browsermatig valideren.
- Gum uitbreiden met borstel-diameteropties small, medium en large.
- Gum alleen pen-/markeerstiftstreken laten wissen, zodat objecten niet per ongeluk verdwijnen.

### 3. Presenter V1b Ontwerpen En Bouwen

Alleen na expliciet akkoord.

Focus:

- Interactieve vraagvensters op het bord.
- Media en slidedecks als rijkere interactieve bordobjecten.
- Paginathumbnails verder polijsten.
- Eventueel opslag/export later.

### 4. Leerlingroute Afronden

Gebouwd per 18 juli 2026:

- Codecheck bevestigde dat de leerlingroute overal publieke snapshots (`publicContentBlocks`/`publicQuestions`) gebruikt; private CMS-reads zitten strikt achter `isAdmin`.
- Gedeeld fullscreen-mechanisme: `src/components/common/FullscreenSurface.jsx` + `src/lib/fullscreenSurfaceState.js` (overlay z-1200, native fullscreen-toggle, Escape-afhandeling; children blijven gemount zodat video's/games niet herstarten). Gebruikt door `MediaRenderer` en `GamePlayer`; `PdfSlideDeckPresenter` had dit patroon al en is de stijlreferentie.
- Game-blok leerlingklaar: `GamePlayer` heeft `variant="student"` (default, rustige leerlingweergave met resultaatkaart) en `variant="admin"` (foundation-label, mode/resultHandling-badges, JSON-resultaat; gebruikt op `/admin/spellen`). Games kunnen fullscreen gespeeld worden.
- Digidocent mobiel: het paneel is op mobiel een bottom-sheet met eigen sluitknop en een zwevende Digidocent-knop; hover-openen alleen op hover-apparaten (`shouldExpandAiTutorOnHover` in `aiTutorPanelState.js`); chathoogte is flexibel (`min(500px,60dvh)`).
- Stappen-sidebar is op mobiel een horizontale scrollstrip in plaats van een lange lijst boven de les.
- Empty states: leeg quiz/toets-blok en leeg theorie/voorbeeld/samenvatting-blok tonen een nette melding; placeholder-HTML is vervangen (`src/lib/lessonBlockPresentation.js`).
- Voorbeeld en samenvatting hebben een eigen rustig visueel accent (`getLessonBlockAccent`).

Exercise-vraagblokken (blokker gevonden en opgelost 18 juli 2026):

- De 60 geseede DV-vraagblokken hebben geen `linkedVraagId` maar dragen hun opgave als `content.exercise` (invulvelden). Voorheen toonde de leerlingroute daarvoor "Vraag niet gevonden" en liepen ALLE 30 DV-paragrafen vast rond stap 4-5.
- Opgelost: `ExerciseLearningBlock` in `StudentLessonPage.jsx` rendert de invulvelden (genummerd, textarea per veld); inleveren kan pas als alle velden zijn ingevuld, telt het blok als afgerond (antwoorden naar `voortgang` als `lastAnswer.kind='exercise'`, `vraagType='exercise'`) en gaat automatisch door. Opnieuw inleveren mag.
- Helpers en sanitizing in `src/lib/exerciseBlockUtils.js` (+tests); publieke snapshots nemen exercise-velden mee als alleen id+label (`publicContentBlockView.js`), eventuele docentantwoorden blijven privé.
- Backfill gedraaid op 18 juli 2026 (`node scripts/backfill-public-content-snapshots.mjs --apply`, 276 blokken + 1 vraag) zodat bestaande snapshots de velden bevatten.
- Digidocent zit bewust (nog) niet op exercise-blokken; alleen op gekoppelde vraag-documenten.
- Browsermatig geverifieerd met echte data (admin Google-login, `paragraaf-dv-1-2`): volledige route stap 1-9 doorlopen incl. media-fullscreen, twee exercise-blokken, samenvatting-accent, quiz-nakijken en leerling-gameweergave (placeholder zonder dev-chrome).

Nog open:

- Verhoudingstabel- en Pythagoras-werkbladen leunen op mobiel op horizontaal scrollen; bewust zo gelaten.
- Echte toetsafname-flow blijft het aparte punt Toetsmodus V1.
- Digidocent-bottom-sheet nog niet met echte data gezien (DV-content heeft geen gekoppelde vraag-documenten); mobiele weergave het beste even op een telefoon controleren.
- Let op datakwaliteit: er bestaat nog maar 1 document in `vraag`; question-blokken met een oude `linkedVraagId` (zoals in `paragraaf-dv-1-1` niet meer voorkomend na exercise-route) tonen "Vraag niet gevonden".

### 5. CMS Lesblokstudio Verfijnen

Nodig:

- Fullscreen editor polish.
- Afbeeldingen in editor positioneren en verwijderen.
- Fontgrootte, fontkleur en lettertypes verder UX-polishen.
- Mediablokstudio eenvoudiger maken.
- Slidedeckblokstudio verder afstemmen op presentatieworkflow.
- Readiness/publicatie-overzicht in echte docentflow browsermatig valideren.
- Public snapshot-backfill en rules in staging/productie zorgvuldig controleren.

### 6. Leerlingbeheer Uitbreiden

Nodig:

- Accountbeheer en veilige wachtwoordflows verder hardenen.
- Uitgebreidere filters.
- Leerlingfoto-import verder hardenen volgens de bestaande upload/PDF/review/Callable Function-flow.
- Avatarweergave uitbreiden met hover/focus-popup.
- `photoImports`, `users/{uid}.photo` en de huidige `pending_new`-route naar geimporteerde `users`-documenten controleren tegen privacy- en beheerwensen.
- `pendingStudents` alleen als eventueel later reviewmodel heroverwegen; de huidige goedkeurfunctie gebruikt die collectie niet als hoofdpad.
- Callable Cloud Function/Admin SDK bestaat voor definitieve foto-goedkeuring; harden nu vooral rules, server-side resizing, cleanup en batch/retry.
- Als echte Firebase Auth-accounts voor nieuwe leerlingen bulk aangemaakt moeten worden: aparte Cloud Function/Admin SDK-flow ontwerpen.

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
- Leerlingrechten beperken tot eigen/toegewezen data en publieke snapshots.
- Admin/docent writes expliciet beperken.
- Verifieren dat private `vraag`/`contentBlocks` niet direct student-readable zijn.

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

- Werk op branch `codex/digitale-vaardigheden-seed`, tenzij de gebruiker anders zegt.
- Recente wijzigingen zijn gepusht naar GitHub op `codex/digitale-vaardigheden-seed`, maar zijn pas live na deploy.
- Hosting-deploy kan via Vercel (`vercel.json`: Vite-build naar `dist` met SPA-rewrite); Firebase blijft de backend (Auth, Firestore, Storage, Functions in `europe-west1`).
- Er bestaat een herstelbare backupbranch: `backup/voor-lesstof-bouwen-verbeteringen-2026-06-06`; eerdere backup voor Digidocent: `backup/digidocent-before-learning-flow`.
- Huidige gitstatus kan lokale untracked screenshots/prototypes bevatten, vooral in `exports/`. Niet automatisch stagen of verwijderen.
- `README.md` is nog geen betrouwbare projectdocumentatie.
- `FIRESTORE_SCHEMA.md` is deels ouder dan de implementatie.
- Volledige `npm run lint` faalt op bestaande schuld: 205 meldingen (203 errors, 2 warnings) over 36 bestanden op 24 augustus 2026. Daarvan komen er circa 169 uit de DVLingo-vanilla-JS-bestanden (`dvlingo_startbestanden/` en `public/games/dvlingo/`) die globals gebruiken en niet door de React-eslintconfig heen horen te lopen; slechts 35 meldingen zitten in `src/`. Overweeg beide mappen aan de eslint-ignores toe te voegen zodat de lint weer signaal geeft. Gebruik tot die tijd gerichte `npx eslint <aangepaste bestanden>` plus `npm run build`.
- Firestore rules zijn verder dan een dev-basis voor publieke snapshots en leerlingfoto-import, maar Storage rules voor `photo-imports` en `student-photos` zijn nog pragmatisch en moeten voor productie opnieuw beoordeeld worden.
- Functions zijn onderdeel van de actuele architectuur; gebruik `functions/index.js` en `functions/index.test.js` bij Digidocent, OCR, leerlingwachtwoorden, leerlingaccount-sync en foto-importgoedkeuring.
- Actuele teststatus (24 augustus 2026): `node --test src/lib/ src/games/ functions/` draait groen met **679 tests**, 0 fouten, circa 20 seconden.
- Actuele buildstatus (24 augustus 2026): `npm run build` slaagt in circa 31 seconden. Bekende waarschuwingen: hoofdchunk 2,29 MB (660 kB gzip) boven de 500 kB-grens, en INEFFECTIVE_DYNAMIC_IMPORT voor `firestoreService.js`/`storageService.js`. De zes spellen belanden correct in `dist/games/`, inclusief `dist/games/dvlingo/v1/`.
- `PROJECTKOMPAS-HELIX.md` wordt tijdens de build via de Vite-plugin `helix-project-kompas` in `vite.config.js` ingelezen en als module geleverd aan `/admin/projectkompas`. Dit bestand bijwerken is dus meteen de in-app update; er is geen aparte kopie.
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
- `/tokenshop` leerling-tokenshop
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
- `/admin/meldingen` leerling-foutmeldingen, actief onder `Instellingen`
- `/admin/spellen` spellen, inclusief de panelen Tokenbeloning en DVLingo-woordenbeheer
- `/admin/tokenbeheer` tokenbeheer en shopcatalogus
- `/admin/crop-tool` crop/OCR-studio
- `/admin/presenter` Presenter
- `/admin/ai-instellingen` Digidocent/OpenRouter instellingen, actief onder `Instellingen`
- `/admin/projectkompas` actueel Projectkompas in de app

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
- `src/components/admin/StudentPhotoImportWizard.jsx`
- `src/services/studentPhotoImportService.js`
- `src/services/studentPhotoPdfListImportService.js`
- `src/lib/studentPhotoImportUtils.js`
- `src/lib/studentPhotoPdfListUtils.js`
- `src/lib/studentPhotoUtils.js`
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
- `src/components/presenter/PresenterImportDialog.jsx`
- `src/components/presenter/PresenterImportedObjectCard.jsx`
- `src/components/presenter/PresenterMathToolObject.jsx`
- `src/components/presenter/PresenterPageThumbnail.jsx`
- `src/components/presenter/PresenterInstrumentOverlay.jsx`
- `src/components/presenter/PresenterPagePanel.jsx`
- `src/components/presenter/PresenterRecoveryPrompt.jsx`
- `src/components/presenter/presenterContentObjectUtils.js`
- `src/lib/presenterContentImport.js`
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
- `src/services/studentPhotoImportService.js`
- `functions/index.js`
- `functions/index.test.js`

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

Volledige testset (679 tests, circa 20 seconden):

```bash
node --test src/lib/ src/games/ functions/
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
7. Controleer `src/lib/gameRegistry.js` en `STARTGIDS-NIEUW-SPEL.md` bij spellenwerk; de echte tokenbedragen staan in `DEFAULT_GAME_TOKEN_REWARD_RULES` (`functions/index.js`) met spiegel `SERVER_DEFAULT_GAME_REWARD_RULES` (`src/lib/gameTokenRewardRules.js`), niet in de startgids.
8. Controleer recente gitstatus voordat je wijzigt.
9. Vraag bij grote productkeuzes eerst om brainstorm/plan, tenzij de gebruiker expliciet `bouw`, `proceed` of `implementeer` zegt. Bij een nieuw spel hoort er eerst een `SPELOPZET-<NAAM>.md` ter review te liggen voordat er code komt.
