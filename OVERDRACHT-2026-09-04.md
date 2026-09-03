# Overdracht HELIX – sessie 3/4 september 2026

Plak dit als eerste bericht in de nieuwe sessie.

---

Ik ben Kevin, docent en beheerder van HELIX (React 19 + Vite + Tailwind 4, Firebase project `pythagoras-eoa` in europe-west1, repo `Kevinlimpens1977/pythagorasdacapo`, productiebranch `codex/digitale-vaardigheden-seed`, site op https://dvdacapo.vercel.app). Lees eerst `CLAUDE.md` en dit document. Je hebt een geheugenmap; de notitie `helix-stand-3-sep-2026` beschrijft de laatste stand.

## Werkafspraken

- Grote productkeuzes: eerst vragen. Kleine keuzes zelf maken en melden.
- Deploy van de site alleen met `npx vercel --prod --yes` (push naar GitHub deployt niets). Cloud Functions en rules met `npx firebase deploy --only functions:<naam>` of `--only firestore:rules`. Nooit `firebase deploy --only hosting`.
- Na elke afgeronde taak: lint op de gewijzigde bestanden, `node --test src/lib/`, `npm run build`, commit, push, deploy, en de live bundle controleren (de minifier gebruikt backticks in strings).
- Nooit `exports/`, `badges/`, `.firebase/` of andere untracked mappen stagen. `storage.rules` staat al lang als gewijzigd; laten staan.
- Geen emoticons in de app, alleen lucide-iconen of SVG.
- Scripts met de Admin SDK draaien lokaal via ADC. Scripts die leerlingdata wijzigen kunnen door de beveiliging geblokkeerd worden; dan het script klaarzetten met dry-run en `--apply`, en mij laten draaien.
- Testaccount: `vragen@scheikundeles.nl` (rol student, zit nu in een brugklas met route bb). Admin: `kevlimpens@gmail.com`.
- De dev-login in `.env.local` geeft geen Firebase-sessie; Firestore-flows kun je niet in de browser testen. Werk met unit-tests en bundlecontrole en vraag mij om de laatste check.

## Wat sinds 3 september live staat

1. **Nulmeting digitale vaardigheden** (deel A en B, 27 vragen elk) in paragraaf 1.0 van alle acht brugklassen met een DV-route; persoonlijk startprofiel via Cloud Function `buildNulmetingProfiel`; klasoverzicht en leerlingdetail voor de docent. Klas H1i1 heeft geen route en is overgeslagen.
2. **Eén vraag per scherm** voor alle quizzen en toetsen (`content.presentatie`, standaard aan): statusbalk, Verder/Vorige met GSAP, situatie-afbeelding bij vragen die "situatie A t/m F" noemen, groter lettertype, inleiding klapt in zodra de leerling bezig is. Teruglezen mag overal behalve in de nulmeting. Studio heeft een keuze lijst/één-voor-één en een vinkje teruglezen.
3. **Meerkeuze met meerdere antwoorden** werkt voor leerlingen: het publieke snapshot draagt `answer.multiple` mee. Na elke wijziging in `publicContentBlockView.js` opnieuw `node scripts/backfill-public-content-snapshots.mjs --apply` draaien.
4. **Geen lege inzendingen**: inleverknop uit zolang er geen antwoord staat (`isAssessmentAnswerEmpty`).
5. **Tussentijds opslaan**: concept-antwoord per vraag op het itemdocument (`concept`), telt niet als poging, verdwijnt bij inleveren. Leerling gaat na refresh verder bij de eerste open vraag.
6. **Nulmeting deel B op slot** tot elke vraag van deel A is ingeleverd (`src/lib/nulmetingVolgorde.js`).
7. **Werk resetten per lesblok** in het leerlingdetail van het klasoverzicht, met bevestiging. Cloud Function `resetLeerlingBlokWerk` (alleen admin): wist blokrecord, itemvoortgang en bij een nulmetingblok het startprofiel. Tokens blijven staan en komen niet opnieuw. Kevin koos bewust: alleen per blok, geen aparte beheerpagina.
8. **Presenter**: quizzen en toetsen importeren met vraagkeuze (inleiding als leskaart, per gekozen vraag een vraagvenster met nakijken op het bord). Advies aan Kevin: gebruiken voor nabespreking, niet voor afname.
9. **Bugfix**: doorklikken naar een andere stap sloeg een quiz of toets als afgerond op, waardoor de paragraaf "afgesloten" leek. Gefixt in `studentLessonProgress.js`; de zes foute records zijn hersteld met `scripts/herstel-onterecht-afgeronde-toetsen.mjs`.
10. Eerder deze sessie: Binask-lesstof en vragenronde voor ER3L1A/ER3L2A, kennischeck Devices in 2.2, herkansingsronde met Digidocent-hints, design system v2 doorgevoerd, rules-fix voor rollen, klaswissel en aanmeldproblemen.

## Openstaand en aandachtspunten

- **Spelblokken** hebben hetzelfde navigatiegedrag als de bug hierboven: wie een spelstap overslaat krijgt hem als afgerond. Bewust niet aangeraakt; Kevin beslist.
- `scripts/lege-start-brugklassen.mjs` is achterhaald en mag NIET meer gedraaid worden: brugklassen hebben nu echt werk.
- Klas H1i1 heeft geen route en dus geen nulmeting.
- Handmatige check die nog niemand deed: als testleerling een vraag invullen zonder inleveren, refreshen, en zien of het antwoord terugkomt; en de presenter-import van een toets echt openen.
- Wikimedia-afbeeldingen in oude lesstof worden gehotlinkt (960px-URL's); risico bij uitval.
- Functions-tests: `cd functions && node --test index.test.js`. Gedeelde laag `functions/shared` wordt gesynchroniseerd met `node scripts/sync-functions-shared.mjs`; `voortgangPayload.js` en `publicContentBlockView.js` zitten daar niet in.

## Belangrijke bestanden

- `src/pages/StudentLessonPage.jsx`: leerlingroute, `AssessmentLearningBlock`, `AssessmentStepper`, `AssessmentItemLearningCard`.
- `src/lib/assessmentPresentation.js`, `assessmentRetryRound.js`, `nulmetingProfiel.js`, `nulmetingVolgorde.js`, `voortgangPayload.js`, `studentLessonProgress.js`, `presenterContentImport.js`.
- `src/components/dashboard/ClassOverview.jsx` en `LeerlingStappen.jsx` (docent), `src/components/presenter/PresenterImportDialog.jsx`.
- `functions/index.js`: `gradeClosedQuestion`, `askAiTutor`, `buildNulmetingProfiel`, `resetLeerlingBlokWerk`, `awardTokensForActivity` (claims in `tokenAwardClaims`).
- Seeds en plaatsingsscripts: `docs/seeds/`, `scripts/plaats-*.mjs`.

Laatste commit: `db2c78a`. Alles is gecommit, gepusht en live.
