# HANDOFF - begin hier

Dit bestand is de vaste overdracht van HELIX. Het geldt voor elke sessie, in
Claude Code of in Codex, en het wordt bijgewerkt in plaats van opnieuw
geschreven. Eén bestand, altijd actueel. Oude, gedateerde overdrachten staan in
`docs/handoffs/`.

De afspraak: **wat hier staat is blijvend waar** (afspraken, werkwijze,
valkuilen). **Wat vandaag waar is, vraag je op met een commando.** Een document
veroudert stilletjes; een commando niet.

## 1. De eerste drie dingen van een nieuwe sessie

1. `git pull`
2. `node scripts/handoff-stand.mjs`
3. Lees paragraaf 2 hieronder. Daar gaat een overdracht mis.

Dat tweede commando leest alleen en toont: de tak en of je gelijk loopt met
GitHub, welke wijzigingen er los in de werkmap staan, welke bundel er live
draait, wat er in Firestore staat per vak en per klas, of er wezen zijn, en of
de bucketinstelling goed staat. Gebruik `--kort` om Firestore over te slaan.

## 2. Het meeste werk staat niet in git

Dit is de belangrijkste zin van dit document. Een `git log` vertelt maar de
helft. Buiten de repo leven:

| Wat | Waar | Hoe je het ziet |
| --- | --- | --- |
| Alle lesstof, klassen, toewijzingen, voortgang | Firestore `pythagoras-eoa` | `node scripts/handoff-stand.mjs` |
| Presentatie-PDF's | Firebase Storage `slidedecks/...` | idem |
| Wie de PDF's mag ophalen | CORS-instelling van de bucket | idem, kopje Storage |
| De draaiende site | Vercel | idem, kopje Live site |

Gevolg: een sessie kan iets grondig veranderd hebben zonder één regel diff. Zet
zulke wijzigingen daarom altijd in paragraaf 5 van dit bestand, met de back-up
erbij.

## 3. Werkafspraken van Kevin

- Grote productkeuzes eerst vragen. Kleine zelf beslissen en achteraf melden.
- **Niets committen of pushen zonder dat Kevin het vraagt.**
- De site deploy je alleen met `npx vercel --prod --yes`. Nooit
  `firebase deploy --only hosting`.
- Functies: `npx firebase deploy --only functions:<naam>`. Regels:
  `npx firebase deploy --only firestore:rules --project pythagoras-eoa`.
- **Nooit stagen:** `exports/`, `badges/`, `.firebase/`, `.superpowers/`,
  `.tmp*`, `sources/`. Gebruik dus geen `git add -A`, maar noem de paden.
- Nederlands, korte zinnen, geen emoji. Iconen zijn lucide of SVG.
- Admin-scripts draaien met Application Default Credentials.
- Elk schrijvend script eerst als dry run, pas daarna `--apply`.
- Na een taak: lint op de gewijzigde bestanden, `node --test src/lib/`,
  `npm run build`.

**Werk niet met twee sessies tegelijk in deze map.** Op 16 september liepen een
sessie en een fork door elkaar heen: de een verwijderde een script waar de ander
net naar verwees. Sluit de ene sessie af (commit of noteer wat er los staat)
voordat je in de andere begint.

## 4. Lesmateriaal naar de bibliotheek: één weg

Een hoofdstuk van Kevin (PDF of tekst, plus losse presentaties) wordt lesstof
via de skill in `.claude/skills/helix-hoofdstuk-bouwen/`. In Claude Code heet
die `/helix-hoofdstuk-bouwen`; in Codex lees je `SKILL.md` uit die map, wat op
hetzelfde neerkomt, want het is tekst met instructies. De vier naslagbestanden
in `references/` gaan over het bronformaat, de vakken met hun id's en klassen,
de vraagregels en de vragenronde.

Werk je zonder de skill, dan is dit de volgorde, en die ligt vast:

1. bron-JSON schrijven, formaat in `docs/LESBLOKKEN-AANLEVERFORMAAT.md`
2. `node scripts/bouw-hoofdstuk-seed.mjs --bron <bestand>`
3. `node scripts/import-<vak>-seed-to-firestore.mjs --apply`
4. `node scripts/backfill-public-content-snapshots.mjs --hoofdstuk <id> --apply`
5. `python scripts/comprimeer-slidedeck.py` naar `sources/<map>/`
6. `node scripts/plaats-hoofdstuk-slidedecks.mjs --bron <bestand> --apply`
7. `node scripts/zet-klas-lesstof-klaar.mjs --vak <binask|dv> --apply`
8. `node scripts/controleer-hoofdstuk.mjs --bron <bestand>`

| Script | Doet |
| --- | --- |
| `bouw-hoofdstuk-seed.mjs` | bron-JSON naar hoofdstuk, paragrafen en lesblokken in de seed |
| `plaats-hoofdstuk-slidedecks.mjs` | presentaties naar Storage, pakket, deckblok, snapshot, dia's geteld |
| `comprimeer-slidedeck.py` | PDF naar één JPEG per pagina (schaal 1,5, kwaliteit 82) |
| `zet-klas-lesstof-klaar.mjs` | route en toewijzing per klas, met controle per leerling |
| `verwijder-hoofdstuk.mjs` | hoofdstuk weghalen; weigert bij voortgang of toewijzing |
| `controleer-hoofdstuk.mjs` | leest alles terug en vergelijkt met de bron |
| `vul-slidedeck-paginatellingen.mjs` | diatelling bij decks van vóór 16 sep 2026 |
| `zet-storage-cors.mjs` | de bucket laten weten welke site de PDF's mag lezen |
| `handoff-stand.mjs` | de stand van nu, alleen lezend |

**Geen tweede importweg.** Maak geen vakspecifieke kopie van een script dat er
al is; dan ontstaan twee wegen naar dezelfde collectie die stil uit elkaar
lopen. Daarom zijn de Binask-specifieke varianten opgegaan in de generieke.

### Valkuilen die geld kosten

- `--koppel-klassen` **nooit** bij de Binask-import: die zet de route uit de
  seed terug op ER3L2A, en dan raken twaalf leerlingen hun lesstof kwijt.
- `--hoofdstuk <id>` **niet weglaten** bij `backfill-public-content-snapshots.mjs`;
  zonder dat filter herschrijft hij alle snapshots van het hele platform.
- Een nieuw DV-hoofdstuk **niet** in `docs/seeds/digitale-vaardigheden-vmbo1.seed.json`
  zetten: dat bestand wordt volledig opnieuw gegenereerd uit het jaarplan en
  gooit het hoofdstuk weg. Geef het een eigen seedbestand en importeer met
  `import-digitale-vaardigheden-seed-to-firestore.mjs --seed <pad>`.
- `number` op het hoofdstuk zetten, anders sorteert het achteraan bij de leerling.
- Kernbegrippen horen in de html als `<dl>`; `content.keyTerms` toont de
  leerlingpagina niet.
- Schriftopdrachten, 10-minutenchecks en afsluitende checks zijn `theory`-blokken
  met een genummerde lijst. Geen question, quiz of toets: geen invoerveld, geen
  nakijken, geen antwoorden in de leerlingversie.
- Voortgangsdocumenten hebben **geen `vakId`**. Tellen gaat per `paragraafId`.
  Een query op `where('vakId', ...)` geeft altijd leeg en dus een vals "0".

## 5. Stand per onderdeel

Bijwerken zodra het verandert. Datum erbij.

### Binask (EOA) - 16 september 2026

Hoofdstuk 1 ("h1 Stoffen") en hoofdstuk 2 ("Massa, volume en dichtheid", 5
paragrafen, 33 lesblokken, 3 presentaties) staan live en zijn toegewezen aan
ER3L1A (`klas_1787768387441_7`) en ER3L2A (`klas_1787768387528_8`). Eén gedeelde
kopie onder `niveau-binask-eoa-1-lr3`: ER3L1A ziet die via haar route, ER3L2A
doordat zij bewust **geen** route heeft. Eerstvolgende vrije hoofdstuknummer: 3.

### Digitale vaardigheden - bijgewerkt 21 september 2026

Negen H1-klassen, allemaal zonder leerroute (routes zijn er op 16 september
afgehaald, back-up in `exports/reset-backups/klassen-voor-dv-h1-2026-09-16.json`).
Alleen de nulmeting is toegewezen.

Hoofdstuk 2 is verwijderd in alle drie de leerroutes: 473 documenten, back-up in
`exports/reset-backups/verwijderd-hoofdstuk-dv-*-2026-09-16.json`, en de inhoud
staat nog in `docs/seeds/digitale-vaardigheden-vmbo1.seed.json`.

**Hoofdstuk 1 blijft staan, ook als een opdracht klinkt als "de oude
hoofdstukken mogen weg".** De nulmeting (deel A en B) zit als paragraaf 1.0 ín
hoofdstuk 1, per leerroute een eigen versie plus de korte variant voor H1i1.
Daaraan hangen 195 voortgangsrecords van 140 leerlingen, 4457 losse antwoorden
en 115 startprofielen. Kevin bouwt dit vak opnieuw op met de skill, in één
versie voor alle klassen, met de groene route (`niveau-dv-vmbo1-kb`) als
uitgangspunt. Eerstvolgende vrije nummer: 2.

**18 september: nulmeting B vraag 3 is een opzoekvraag.** Item
`nulmeting-digitale-vaardigheden-b-03` (data en informatie) heeft in de drie
routeblokken een vraagtekst met het antwoord erin; de seed
`docs/seeds/nulmeting-dv/nulmeting-b.json` is gelijk bijgewerkt. De 57
leerlingen die hem fout hadden, hebben hem nu goed: itemrecord, blokstand en
startprofiel opnieuw berekend met `scripts/nulmeting-b03-opzoekvraag.mjs`.
Back-up in `exports/reset-backups/nulmeting-b03-opzoekvraag-2026-09-18.json`.

**19 september: DV hoofdstuk 2 is live.** `hoofdstuk-dv-klas1-h2` ("H2: Wat zit
er in je device?", 3 paragrafen, 16 blokken inclusief het deck in 2.1) is
toegewezen aan H1B1, H1B2, H1K1-3 en H1TL1-3; H1i1 heeft alleen haar korte
nulmeting. Bron `docs/seeds/dv-h2-device.json`, eigen seed
`docs/seeds/dv-h2-device.seed.json`, id-voorvoegsel `dv-klas1`. Het deck komt uit
NotebookLM (notebook "Helix - H2 Wat zit er in je device?"); dia 11 is met de
hand verbeterd (een onleesbare regel weggehaald), gecomprimeerd in
`sources/dv-jpeg/dv-h2-device.pdf`. `zet-klas-lesstof-klaar.mjs --vak dv` wijst
via `lesstofHoofdstukken` alleen de nieuwe hoofdstukken toe; voeg een volgend
hoofdstuk toe aan `H2_EN_VERDER`. Back-up van de klassen in
`exports/reset-backups/klassen-voor-dv-h1-2026-09-19.json`. Controle:
`controleer-hoofdstuk.mjs` alles in orde; bestaande hoofdstukken en de 428
voortgangsrecords ongewijzigd.

**21 september: quiz 2.3 heeft tien uitbreidingsvragen.** Vijf over hardware of
software en vijf over de keuken uit 2.1 (kok, aanrecht, voorraadkast). Het blok
`block-dv-klas1-23-quiz-4` ging van 4 naar 14 vragen en van 30 naar 60 tokens.
Niemand had er voortgang op. Bron bijgewerkt in `docs/seeds/dv-h2-device.json`,
daarna `bouw-hoofdstuk-seed.mjs`, het nieuwe
`scripts/werk-blok-bij-uit-seed.mjs` (werkt één blok bij zonder het hoofdstuk
opnieuw te importeren) en `backfill-public-content-snapshots.mjs`. Back-up van
het oude blok in `exports/reset-backups/blok-block-dv-klas1-23-quiz-4-2026-09-21.json`.

**21 september: twee dashboardfouten rond de nulmeting.** Een afgeronde
nulmeting kreeg `resultTier: failed` zodra niet alles goed was, en het
klasoverzicht las dat als "vastgelopen": een klas die de hele nulmeting had
gemaakt stond op nul afgeronde stappen. `buildStapStatus` in
`src/lib/klasVoortgangOverzicht.js` telt een nulmetingblok nu af zodra alle
vragen beantwoord zijn en toont anders hoeveel vragen al beantwoord zijn. De
tweede was geen fout in de code: er zijn drie paragrafen "1.0 Nulmeting
digitale vaardigheden" (bb, kb, tl) met dezelfde naam in dezelfde keuzelijst.
Kies voor een TL-klas de 1.0 onder het TL-hoofdstuk, anders staat elke leerling
op "Niet toegewezen".

**21 september: voortgang hoort bij de leerling, niet bij de klas.**
`getStudentVoortgang` filterde op de huidige klas; wie van klas wisselde raakte
zijn eerdere resultaten kwijt op de lesstofpagina en kon niet verder waar hij
gebleven was. De query gaat nu alleen op `userId`; `src/lib/voortgangQueryUtils.js`
is daarmee overbodig en verwijderd. Nagerekend over alle 162 leerlingen: alleen
Kevins eigen account had werk in meerdere klassen.

**19 september: curriculumontwerp DV klas 1, alleen op papier.** In
`docs/curriculum/` staan fase 1 (SLO-onderzoek, audit, nulmeting), fase 2 (het
goedgekeurde curriculum van 22 lessen, H2 tot en met H23) en fase 3 (scenario's
voor het MT) en fase 4 (leerlijn klas 1 tot 4). De enige bron is `dv-klas1-curriculum.json`; de tabellen komen
uit `genereer-fase2.mjs` en `genereer-fase3.mjs`. Het MT-rapport (fase 5) bouw je met
`python docs/curriculum/rapport/bouw-rapport.py`; de PDF komt in `exports/curriculum/`.
Er is niets gebouwd in HELIX. Fase 6 (technisch plan) volgt; bouwen pas na
Kevins akkoord op het plan van fase 6.

### Testen als leerling - 21 september 2026

Elf testleerlingaccounts, één per klas, uid `testleerling-<klas>`, e-mail
`<uid>@helix-test.local`, `isTestaccount: true`. Aangemaakt met
`scripts/maak-testleerlingen.mjs` (dry run standaard, `--verwijder` haalt ze
weg). Ze hebben geen wachtwoord: inloggen kan alleen via de callable
`startTestleerlingSessie` (europe-west1), en die geeft alleen een token voor een
account met die vlag, en alleen aan de admin.

De beheerpagina staat op `/admin/testen` (knop op Leerlingen). Per klas: wat de
leerling echt ziet, de problemen die de lesstof onzichtbaar maken, een knop
"Start testsessie" en de testdata van dat account. Tijdens een testsessie staat
er een paarse balk bovenin met "Terug naar beheer".

Testaccounts tellen nergens mee: `src/lib/testaccounts.js` filtert ze uit het
klasoverzicht, leerlingbeheer, tokenbeheer en de klaslijsten, en
`buildNulmetingProfielCore` slaat ze over bij een klasberekening.
`firestore.rules` laat een leerling zijn eigen `isTestaccount` niet zetten.

**Wat nog moet gebeuren:** de functie draait nu nog als het standaard
compute-account en kan daardoor geen inlogtoken ondertekenen. De regel
`serviceAccount: "firebase-adminsdk-fbsvc@..."` staat in `functions/index.js`,
maar de deploy daarvan staat nog open:
`npx firebase deploy --only functions:startTestleerlingSessie --project pythagoras-eoa`.
Tot dat moment geeft de startknop een foutmelding.

### Taalknop in de hele leerroute - 21 september 2026

De vertaalknop stond alleen op de lespagina en vertaalde alleen lesblokken. Nu
staat hij ook op de lesstofpagina, op de hoofdstukpagina en in het startvenster
"Wat je gaat leren", met één keuze voor alles (localStorage
`helix-lestaal-<uid>`, gedeeld via `src/hooks/useLesstofTaal.js`).

Twee soorten tekst, bewust gescheiden:

1. **Vaste schermteksten** ("Ga verder", "7 stappen", "3 van 7 onderdelen af")
   staan in `src/lib/uiTaal.js`, een woordenboek nl/el/it. Een test bewaakt dat
   elke sleutel elke taal heeft en dezelfde plaatshouders gebruikt. Hier komt
   geen model aan te pas: een knop mag nooit op een vertaling wachten.
2. **Titels, beschrijvingen en leerdoelen** komen van de nieuwe callable
   `vertaalLesstofInfo` (europe-west1). Die leest alleen het paragraaf- en
   hoofdstukdocument - geen lesblokken, dus geen antwoordsleutel - en bewaart
   het resultaat in `vertalingen/info-<soort>-<id>__<taal>` met een
   vingerafdruk over de brontekst.

Wat nog Nederlands blijft: de titels van lesblokken in de stappenbalk, en het
eindscherm van een paragraaf. Beide zijn een volgende stap.

Twee dingen die bij het bouwen misgingen en die je moet weten:

- het model plakt er soms een accolade te veel achter; `leesJsonObject` in
  `functions/index.js` leest daarom tot de sluitende accolade in plaats van
  blind te parsen;
- React draait een effect in ontwikkelmodus twee keer, waardoor de eerste
  aanroep zijn eigen antwoord weggooide en de tweede dacht dat alles al was
  opgehaald. De hook gebruikt daarom een `levendRef` en geen vlag per effect.

### De leerling kiest zelf zijn taal - 21 september 2026

De taal stond op het gebruikersdocument en werd door het beheer gezet. Een
leerling kiest hem nu zelf op zijn profiel (`src/components/profiel/TaalKeuzeKaart.jsx`);
in Leerlingbeheer kan Kevin hem nog steeds zetten. De kaart schrijft alleen
`lesTaal` op het eigen document; `firestore.rules` liet dat al toe zolang rol en
testvlag gelijk blijven.

Negen talen: Grieks, Oekraïens, Arabisch, Turks, Pools, Roemeens, Spaans,
Italiaans en Engels. Arabisch staat op verzoek van Kevin in dezelfde
leesrichting als de rest van het scherm (links naar rechts); de Arabische
woorden zelf zet de browser goed, de opmaak draait niet mee.

`src/lib/uiTaal.js` heeft nu één blok per taal in plaats van één regel per
sleutel: een taal erbij is een blok plus een regel in `LES_TALEN` (en daar ook
de antwoordinstructie). De test faalt zodra een taal een sleutel of een
plaatshouder mist.

Let op bij een nieuwe taal: `scripts/sync-functions-shared.mjs` en daarna
`npx firebase deploy --only functions:vertaalLesblok,functions:vertaalLesstofInfo`.
Zonder die deploy weigert de server de taal ("Onbekende taal: uk") en blijft de
lesstof Nederlands terwijl de knoppen al zijn omgezet.

### Hoofdstukken op slot - 22 september 2026

Lesstof kan vooruit klaarstaan zonder dat een klas erin kan. Per klas staat op
het klasdocument `vergrendeldeHoofdstukken: [hoofdstukId]`; de regels staan in
`src/lib/hoofdstukSlot.js` en worden gebruikt door de lesstofpagina, de
hoofdstukpagina en de lespagina (ook wie de link intypt komt er niet in).

Beheer: `/admin/vrijgeven`, ook als kaart op Lesstof. Eén raster met de
hoofdstukken onder elkaar en de klassen ernaast; een vinkje betekent "op slot".
Per rij zetten twee knoppen het hoofdstuk voor alle klassen tegelijk open of op
slot. Het niveau staat bij de hoofdstuknaam, want drie hoofdstukken heten
"H1: Startklaar op je nieuwe school".

Leerling: de tegel blijft staan, grijst weg en krijgt een oranje slotsticker
("Nog op slot") plus de regel "Je docent zet dit hoofdstuk open als de les
begint." De teller bovenaan en "verder waar je was" slaan een vergrendeld
hoofdstuk over, zodat een leerling niet met een achterstand lijkt te beginnen.
De slotteksten staan in alle tien de talen.

De knop Projectkompas is dezelfde dag uit de adminbalk gehaald; de pagina blijft
op `/admin/vrijgeven`'s buurroute `/admin/projectkompas` bestaan.

### Presentaties - 16 september 2026

De trage presentaties kwamen niet door de bestanden maar door de bucket: die
stond alleen `localhost:5173` toe, waardoor de browser elke deck-PDF weigerde en
de viewer na een wachttijd terugviel op een kale iframe met de teller "1 / ?".
Opgelost met `scripts/zet-storage-cors.mjs --apply`; oude instelling in
`exports/reset-backups/storage-cors-voor-2026-09-16.json`. Sindsdien laadt een
deck van 3 MB in tienden van seconden, als echte dia's met een kloppende teller.

## 6. Wat nog open staat

In volgorde van wat Kevin het eerst wil. Wie eraan begint, werkt dit lijstje bij.

1. **Testen als leerling afmaken.** Alles is gebouwd en gedeployd behalve de
   laatste stap: `startTestleerlingSessie` opnieuw uitrollen zodat hij als het
   serviceaccount `firebase-adminsdk-fbsvc` draait. Zonder dat kan hij geen
   inlogtoken ondertekenen. Zie paragraaf 5, "Testen als leerling".
2. **Het losse werk committen** (zie paragraaf 7, "Los in de werkmap"). Kevin
   beslist wanneer.
3. **Curriculum DV, fase 6.** Fase 1 tot en met 5 liggen er (zie paragraaf 5).
   Fase 6 is het technische plan: SLO-koppeling per les in HELIX, de
   startscore uit de nulmeting bij elke les, en het dashboardconcept. Pas
   bouwen na Kevins akkoord op dat plan.
4. **Hoofdstuk 3 en verder van DV.** Les 2 van het curriculum is "Hoe reist
   jouw bericht over internet?". Bouwen gaat met `/helix-hoofdstuk-bouwen`;
   het deck volgt verplicht het design system.
5. **Vrijgeven van DV hoofdstuk 1**: de lesparagrafen 1.1 tot en met 1.5
   bestaan wel maar zijn aan niemand toegewezen. Dat is een lesbesluit; vraag
   het voordat je toewijst.
6. Uit de navigatie-audit: het dubbele voortgangsoverzicht op het profiel, een
   woord bij het tokenmuntje, onthouden welk hoofdstuk het laatst open stond,
   en toetsenbordbediening van de stappenbalk.
7. Vertaalknop: een blok publiceren vóór "Vertaling nu maken", de
   `vertalingen`-regel kent geen publicatiestatus, en vertalingen worden niet
   verwijderd als een blok wordt teruggetrokken.
8. Paragraaf 1.2 van Binask heeft een deck van 7,1 MB; dat kan naar ongeveer
   5,9 MB. Niet dringend.

## 7. Bij het afsluiten van een sessie

1. Commit wat af is, of schrijf hieronder op wat er los blijft staan en waarom.
2. Heb je iets veranderd wat niet in git zichtbaar is (Firestore, Storage, de
   bucket, een skill)? Zet het in paragraaf 5, met de back-up erbij.
3. Klopt paragraaf 4 nog? Nieuw script of gewijzigde volgorde hoort erin.
4. Draai `node scripts/handoff-stand.mjs` en kijk of de uitkomst overeenkomt met
   wat hier staat. Wijkt het af, dan is dit bestand aan de beurt, niet de stand.
5. Werk paragraaf 6 bij: wat je afmaakte gaat eraf, wat je vond komt erbij.

**Dit geldt voor elke sessie, in Claude Code en in Codex.** Kevin wisselt om
beurten tussen beide. Wie dit bestand niet bijwerkt, laat de ander in het
donker werken.

### Los in de werkmap

Stand 21 september 2026. Alles van 17 tot en met 20 september is gecommit
(t/m `f54ef77`). Wat hieronder staat is van 21 september en nog niet gecommit;
Kevin bepaalt wanneer dat gebeurt. Het staat wel live: gedeployd met
`npx vercel --prod --yes`.

| Pad | Wat het is |
| --- | --- |
| `docs/seeds/dv-h2-device.json`, `dv-h2-device.seed.json` (gewijzigd) | quiz 2.3 met tien uitbreidingsvragen, 60 tokens |
| `scripts/werk-blok-bij-uit-seed.mjs` (nieuw) | werkt één lesblok bij vanuit een seed, met back-up en dry run |
| `src/lib/klasVoortgangOverzicht.js` en de test (gewijzigd) | een afgemaakte nulmeting telt als afgerond |
| `src/services/voortgangService.js` (gewijzigd) | voortgang van een leerling zonder klasfilter |
| `src/lib/voortgangQueryUtils.js` en de test (verwijderd) | de terugvalregel die daarbij hoorde is overbodig |
| `src/components/auth/LoginScreen.jsx`, `src/lib/loginIdentifier.js` en de test | inloggen en aanmelden met alleen het leerlingnummer |
| `scripts/maak-testleerlingen.mjs` (nieuw) | maakt de elf testleerlingen aan (al uitgevoerd) |
| `functions/index.js` (gewijzigd) en `index.test.js` | de callable `startTestleerlingSessie` |
| `src/lib/testaccounts.js`, `src/lib/testleerlingOverzicht.js` en hun tests (nieuw) | testaccounts filteren en berekenen wat een klas ziet |
| `src/pages/AdminTestenPage.jsx`, `src/components/admin/TestleerlingBalk.jsx` (nieuw) | de beheerpagina en de balk tijdens het testen |
| `src/App.jsx`, `src/lib/adminWorkspaceNav.js`, `AdminLeerlingenPage.jsx`, `AdminTokenManagementPage.jsx`, `ClassOverview.jsx`, `klasService.js` (gewijzigd) | route, menu en de filters |
| `firestore.rules` (gewijzigd) | een leerling mag zijn eigen testvlag niet zetten |
| `src/lib/uiTaal.js` en de test (nieuw) | het woordenboek met de vaste schermteksten (nl/el/it) |
| `src/hooks/useLesstofTaal.js` (nieuw) | de taalkeuze van de leerling en het ophalen van vertaalde titels |
| `functions/index.js` (gewijzigd) | de callable `vertaalLesstofInfo` en `leesJsonObject` |
| `src/lib/lesTaal.js` + `functions/shared/lesTaal.js` | vingerafdruk voor losse tekst (`tekstVingerafdruk`) |
| `TableOfContents.jsx`, `StudentChapterPage.jsx`, `ChapterDetail.jsx`, `LearningGoalsIntro.jsx`, `StudyStepRail.jsx`, `StudentLessonPage.jsx` | de taalknop en de vertaalde schermteksten |
| `src/components/profiel/TaalKeuzeKaart.jsx` (nieuw) + `StudentProfilePage.jsx` | de leerling kiest zelf zijn taal |
| `src/lib/lesTaal.js` (gewijzigd) en de test | negen talen met hun antwoordinstructie |
| `.claude/launch.json` (gewijzigd) | extra dev-server op poort 5180, voor als 5173 bezet is |
| `src/lib/hoofdstukSlot.js` + test, `src/pages/AdminVrijgevenPage.jsx` (nieuw) | hoofdstukken op slot en het raster om ze vrij te geven |
| `TableOfContents.jsx`, `StudentChapterPage.jsx`, `StudentLessonPage.jsx`, `useStudentOutline.js`, `klasService.js`, `App.jsx`, `AdminLesstofPage.jsx`, `adminWorkspaceNav.js` (gewijzigd) | de slotsticker, de gesloten ingangen en de route ernaartoe |
| `PROJECTKOMPAS-HELIX.md` (gewijzigd) | bijgewerkt naar 22 september; verwijst voor de dagstand naar deze handoff |
| `scripts/ruim-leeg-dubbelaccount-op.mjs`, `scripts/voeg-dubbelaccount-samen.mjs` (nieuw) | dubbele leerlingaccounts opruimen of samenvoegen (allebei al uitgevoerd) |

Buiten git (genegeerd, maar wel nodig): `sources/dv-jpeg/dv-h2-device.pdf` (het
deck van H2), `sources/designsysteem/` (het design system en de uitgelezen
tekst) en `exports/curriculum/` (het MT-rapport als PDF en HTML).

## Archief

Gedateerde overdrachten van eerdere sessies staan in `docs/handoffs/`. Ze
beschrijven hoe iets is ontstaan; wat nu geldt staat hierboven.

- `docs/handoffs/2026-09-16-avond.md` - Binask hoofdstuk 2 live, DV opgeruimd,
  de skill gebouwd.
- `docs/handoffs/2026-09-20-overdracht-aan-codex.md` - de nulmetingvraag, het
  curriculum DV in vijf fasen, DV hoofdstuk 2 live met deck, het design system
  in de skill, en de spec voor testen als leerling.
