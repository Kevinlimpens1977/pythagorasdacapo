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
| `zet-inclusie-klaar.mjs` | inclusieversie van een hoofdstuk aan de inclusieklas (H1i1): koppelen, presentatie delen, open of op slot, controle per leerling |
| `verwijder-hoofdstuk.mjs` | hoofdstuk weghalen; weigert bij voortgang of toewijzing |
| `controleer-hoofdstuk.mjs` | leest alles terug en vergelijkt met de bron |
| `vul-slidedeck-paginatellingen.mjs` | diatelling bij decks van vóór 16 sep 2026 |
| `zet-storage-cors.mjs` | de bucket laten weten welke site de PDF's mag lezen |
| `maak-klas.mjs` | nieuwe klas aanmaken, zoals "Nieuwe klas aanmaken" in het beheer |
| `zet-vraagvolgorde-per-leerling.mjs` | quizvragen per leerling schudden binnen hun niveau (vlag op de blokken van één hoofdstuk) |
| `handoff-stand.mjs` | de stand van nu, alleen lezend |

**Geen tweede importweg.** Maak geen vakspecifieke kopie van een script dat er
al is; dan ontstaan twee wegen naar dezelfde collectie die stil uit elkaar
lopen. Daarom zijn de Binask-specifieke varianten opgegaan in de generieke.

### Een nieuw vak of een nieuwe klas

Vak, leerjaar en niveau gaan mee in een eigen seedbestand (zie Diff rekenen); de klas maak je met `node scripts/maak-klas.mjs --naam <naam>` (dry run, dan `--apply`) of via het beheer:

1. **Vak, leerjaar en niveau (leerroute)** maak je in de lesstofeditor
   (`/admin/lesstof`, knop "Nieuw vak"; `createVak`, `createLeerjaar` en
   `createNiveau` in `src/services/cmsService.js`). Het kan ook via een
   seedbestand: de importscripts schrijven ook `vakken`, `leerjaren` en
   `niveaus` uit de seed. Lees daarna de id's terug uit Firestore; verzin ze
   niet.
2. **De klas** maak je op `/admin/klassen` ("Nieuwe klas aanmaken",
   `createKlas` in `src/services/klasService.js`). Leerlingen komen erin met het
   leerlingnummer bij aanmelden of via de import op Leerlingen.
3. **Route of geen route.** Een klas met een `niveauId` ziet alleen lesstof van
   dat niveau. Kies bewust; zie Binask (ER3L2A zonder route).
4. **Toewijzen**: voeg het vak met zijn klassen toe aan de tabel `VAKKEN`
   bovenin `scripts/zet-klas-lesstof-klaar.mjs`, en het vak aan
   `.claude/skills/helix-hoofdstuk-bouwen/references/vakken.md`. Maak geen
   kopie van het script.
5. **Een testleerling** voor de nieuwe klas: zet de klas in `KLASSEN` van
   `scripts/maak-testleerlingen.mjs` en draai hem (dry run, dan `--apply`).
6. De hoofdstukken bouw je daarna met de skill, zoals hierboven. Voor de import
   is er per vak een seedscript (`import-binask-eoa-seed-to-firestore.mjs`,
   `import-digitale-vaardigheden-seed-to-firestore.mjs --seed`); kijk eerst of
   een van die twee met `--seed` het nieuwe vak aankan voordat je iets nieuws
   schrijft.

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
- Een nieuw DV-hoofdstuk **eerst in `H2_EN_VERDER`** van
  `zet-klas-lesstof-klaar.mjs` zetten. Wat er niet in staat, haalt dat script
  bij de klassen weg. Lees in de dry run altijd de regels "gaat eraf".
- **Een nieuw veld in `content` bereikt de leerling niet vanzelf.** Leerlingen
  lezen `publicContentBlocks`, en `buildPublicContentBlockSnapshot` in
  `src/lib/publicContentBlockView.js` neemt alleen velden over die daar
  genoemd staan. Voeg een nieuw veld daar toe (met een test), anders werkt het
  bij de beheerder en niet bij de leerling.
- **Draai `bouw-hoofdstuk-seed.mjs` niet opnieuw op de bron van Binask H2.**
  Live loopt voor op de seed (eindcheck-quiz, Binas-links, spelblokken in 2.2,
  2.6, 1.A, 2.A, 2.T). Die zijn met eigen scripts geplaatst
  (`voeg-volume-spelblokken-toe.mjs`, `plaats-paragraaf-2-6-uitdaging.mjs`,
  `plaats-uitwerkingen-binask.mjs`, `plaats-oefentoets-binask-h2.mjs`); pas
  één onderdeel aan met zijn eigen script.
- **Een presentatie nooit opnieuw plaatsen** met `plaats-hoofdstuk-slidedecks.mjs`
  om hem te hergebruiken. Het script zet een nieuw downloadtoken op de PDF,
  waarna het bestaande deckblok niet meer laadt. Hergebruik voor een
  inclusieversie gaat met `zet-inclusie-klaar.mjs --deel-presentatie`.

## 5. Stand per onderdeel

Bijwerken zodra het verandert. Datum erbij.

### Binask (EOA) - bijgewerkt 15 oktober 2026

Hoofdstuk 1 ("Stoffen") en hoofdstuk 2 ("Massa, volume en dichtheid") staan live
en zijn toegewezen aan ER3L1A (`klas_1787768387441_7`) en ER3L2A
(`klas_1787768387528_8`). Eén gedeelde kopie onder `niveau-binask-eoa-1-lr3`:
ER3L1A ziet die via haar route, ER3L2A doordat zij bewust **geen** route heeft
(ze houdt daarnaast haar eigen "Ga van start...", `paragraaf-binask-eoa-2-1-1`).
Eerstvolgende vrije hoofdstuknummer: 3.

De paragrafen nu, in leesvolgorde:

| Hoofdstuk | Paragrafen |
| --- | --- |
| H1 `hoofdstuk-binask-eoa-1-h1` | 1.1 Natuurwetenschappen, 1.2 Stofeigenschappen, 1.3 Gevarensymbolen, 1.4 Vragen en quiz, **1.A Uitwerkingen en antwoorden** |
| H2 `hoofdstuk-binask-eoa-1-h2` | 2.1 Massa, 2.2 Volume, 2.3 Dichtheid, 2.4 Herhalingsopdrachten, 2.5 Plusopdrachten, 2.6 Uitdaging: drijven en zinken (plus, telt niet mee), **2.A Uitwerkingen en antwoorden**, **2.T Oefentoets** |

Wat er sinds 16 september bij kwam (alles live; wat nog niet gecommit is, staat
in paragraaf 7):

- **23 september: spel Volume berekenen** in 2.2 (blokken 9-11, drie gameIds
  `binask-volume-maatcilinder|balk|onderdompelen`, code in
  `src/games/volumeBerekenen/`). Geplaatst met
  `scripts/voeg-volume-spelblokken-toe.mjs`, niet via de seed.
- **30 september: 2.6 Uitdaging** (plusparagraaf, ster) met het spel
  Vloeistoffenlab. Geplaatst met `scripts/plaats-paragraaf-2-6-uitdaging.mjs`.
- **5 oktober: explainervideo** in 2.4 (zie "Explainervideo's").
- **8 oktober: 1.A en 2.A Uitwerkingen en antwoorden.** Per hoofdstuk één
  tekstblok met de antwoorden op alle schriftvragen; bij elke rekenvraag
  gegeven, gevraagd, formule, berekening en antwoord met eenheid. De leerling
  ziet de paragraaf met een slotje tot alle andere paragrafen van dat hoofdstuk
  af zijn (plusparagraaf 2.6 en de oefentoets tellen niet mee). Afvinken kan pas
  na 60 seconden ("Ik heb mijn werk nagekeken"). Bron
  `docs/seeds/binask-uitwerkingen.json`, script
  `scripts/plaats-uitwerkingen-binask.mjs`, voorbeeld als PDF in
  `exports/uitwerkingen-binask/`.
- **15 oktober: 2.T Oefentoets** achteraan H2. Dertien vragen in vier delen
  (H1, massa en volume, dichtheid met het aluminium blokje en het messing
  schaakstuk, bonus drijven en zinken) plus een tabel met dichtheden, voor in
  het schrift, ongeveer een uur. Drie tekeningen in Storage onder
  `pythagoras/oefentoetsen/block-binask-eoa-1-2t-oefentoets/`. Gaat pas open als
  alle paragrafen ervoor **strikt** af zijn (ook 2.A; plusstof niet). Afvinken
  na 5 minuten. Rechtsboven in de les staat een knop Rekenmachine. Bron met de
  docentantwoorden: `docs/seeds/binask-oefentoets-h2.json`, script
  `scripts/plaats-oefentoets-binask-h2.mjs`, tekeningen in `exports/oefentoets-h2/`.
- Toewijzen van 1.A, 2.A en 2.T ging gewoon met
  `zet-klas-lesstof-klaar.mjs --vak binask --apply`. Back-ups van de klassen:
  `exports/reset-backups/klassen-voor-binask-eoa-2026-10-08.json` en `-2026-10-15.json`.

**Groen, paars en strikt af.** Een blok is "af" als het voortgangsrecord op
afgerond staat; dat is wat de leerling als groen ziet. Maar een leerling kan een
quiz hebben afgevinkt zonder alle vragen te maken (bijvoorbeeld omdat het blok
eerst een tekstblok was en later een quiz werd). Kevin noemt dat **paars**. Het
slot van 2.T telt paars als niet af (`isBlokStriktAf` in
`src/lib/studentLessonProgress.js`). Bekend geval: Hasan (ER3L2A), "Eindcheck
hoofdstuk 2" in 2.5 (`block-binask-eoa-1-25-theory-5`, nu een quiz van tien
vragen), afgevinkt toen het nog een tekstblok was. Hij heeft die quiz op
15 oktober alsnog gemaakt; het bolletje is nu groen.

**15 oktober: één vraagronde gereset.** Soraya (ER3L1A) mocht de Vragenronde
van 1.1 opnieuw maken (eerst gemaakt zonder vertaling). Back-up:
`exports/reset-backups/reset-E7LnYFEfsuei9p3CqhzaDe9EH772-block-binask-eoa-1-11-quiz-4-*.json`,
script `.tmp-diag/reset-soraya-vragenronde.mjs`.

**Klasborden voor Kevin (artifacts op claude.ai).** Kevin volgt de EOA-klassen
in een artifact: leerlingen in rijen, paragrafen of onderdelen als groene, rode
of paarse bolletjes. "Update" betekent: data opnieuw ophalen en het artifact
opnieuw publiceren.

| Artifact | Data ophalen |
| --- | --- |
| Klasbord Binask, ER3L2A en ER3L1A met een klaswissel (per lesblok, met paars): https://claude.ai/artifact/EJRNPZ7E51kfXwMmA7DFbY | `node .tmp-diag/klasbord-data.mjs ER3L2A` en `... ER3L1A` (schrijven `.tmp-diag/klasbord-<KLAS>.json`), daarna sjabloon plus data samenvoegen tot één pagina met `{ klassen: [ER3L2A, ER3L1A] }` in `<script id="data">` |
| ER3L1A voortgang (per paragraaf, H1 en H2): https://claude.ai/artifact/U9qNHtLMXuKPJpaq3tzwDm | `node .tmp-diag/klas-hoofdstuk-monitor.mjs --eenmaal` |
| ER3L2A live (8 oktober): https://claude.ai/artifact/TWURKgvpFkykwZy2Q15nQg | `node .tmp-diag/klas-eenmaal.mjs` |

Die scripts staan in `.tmp-diag/` en dus **buiten git**; gooi die map niet weg.
Het klasbord toont ook 1.A, 2.A en 2.T als eigen kolom.

### Digitale vaardigheden - bijgewerkt 15 oktober 2026

Negen H1-klassen, allemaal zonder leerroute (routes zijn er op 16 september
afgehaald, back-up in `exports/reset-backups/klassen-voor-dv-h1-2026-09-16.json`).
Toegewezen per klas: de nulmeting, hoofdstuk 2 en hoofdstuk 3 (H3 op slot).
H1i1 krijgt van H2 en H3 de inclusieversie.

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

**Eind september: DV hoofdstuk 3 klaar, maar op slot.** `hoofdstuk-dv-klas1-h3`
("Hoe reist jouw bericht over internet?"), paragrafen 3.1 tot en met 3.3, plus
een inclusieversie (`paragraaf-dv-klas1-incl-31` tot en met `-33`) voor H1i1.
Toegewezen aan alle negen H1-klassen, maar het hoofdstuk staat in
`vergrendeldeHoofdstukken` van elke klas: leerlingen zien het met een slot tot
Kevin het opent op `/admin/vrijgeven`. Bron `docs/seeds/dv-h3-internet.json` en
`dv-h3-internet-inclusie.json`, klaarzetten met `scripts/zet-dv-h3-klaar.mjs`
(commit `c1bee94`). **H4 tot en met H23** bestaan als hoofdstuk met drie
ongepubliceerde paragrafen zonder blokken, ook op slot. De lesideeën staan in
`docs/curriculum/lesideeen-h4-h23.md`. Een volgend hoofdstuk vul je dus in een
bestaand hoofdstuk-id; maak geen tweede hoofdstuk met hetzelfde nummer.

**7 oktober: inclusieversie van hoofdstuk 2 voor H1i1, live en open.** Drie
paragrafen `paragraaf-dv-klas1-incl-21` tot en met `-23` in hetzelfde
hoofdstuk, 41 blokken: de gedeelde presentatie, 24 korte theorieblokken (één
idee en hooguit vijf zinnen per scherm), 6 voorbeelden, 3 samenvattingen, 4
korte checks (10 tokens) en 3 quizzen van tien klikvragen (30 tokens). Er zijn
17 tekeningen in `public/lesstof/dv-h2-*.svg` (generator
`.tmp-diag/h2-inclusie-tekeningen.py`), live gezet met `npx vercel --prod --yes`.
Bron `docs/seeds/dv-h2-device-inclusie.json`, seed `dv-h2-device-inclusie.seed.json`.
Klaargezet met het nieuwe `scripts/zet-inclusie-klaar.mjs`: `variantVan` en
`variantProfiel` op de paragrafen, het deckblok van 2.1 gekopieerd met hetzelfde
pakket, en alleen H1i1 toegewezen. Back-up van de klas:
`exports/reset-backups/klassen-voor-inclusie-hoofdstuk-dv-klas1-h2-2026-10-07.json`.
Alle 18 leerlingen van H1i1 zien 2.1 tot en met 2.3 in de inclusieversie (41
blokken). Bij de andere klassen en in de bestaande lesstof is niets veranderd;
de snapshots van de gewone versie kregen alleen een lege `ondertitels`-lijst.
`controleer-hoofdstuk.mjs` slaat nu de paragrafen van de andere versie over;
`zet-klas-lesstof-klaar.mjs` slaat inclusieparagrafen over en heeft hoofdstuk 3
in `H2_EN_VERDER` gekregen (zonder dat zou een run 3.1 tot en met 3.3 bij vijf
klassen weghalen). De skill heeft een paragraaf "Een inclusieversie" met de
afspraken.

**7 oktober: backuppunt vóór de Leeromgeving-stijl.** Git-markering
`leeromgeving-voor` staat op de versie die nu live is. Vercel-deploy van die
versie: `dpl_3koNoaSCECXY9JUm1ZXsaGP12CDT` (`helix-org6zbngj-kevlimpens-projects.vercel.app`). Terug naar deze versie kan direct
in Vercel (die deploy weer naar productie zetten) of met `git revert` van de
latere fasecommits en `npx vercel --prod --yes`. Ontwerp:
`docs/superpowers/specs/2026-10-07-leeromgeving-stijl-design.md`.

**7 oktober: HELIX Leeromgeving-stijl, fase 1 live.** De website heeft een eigen
stijl, los van het Slide Design System: `docs/LEEROMGEVING-STIJL.md`,
`src/styles/leeromgeving.css` (tokens `--lo-*`, klassen `.lo-*`) en de bouwstenen
in `src/components/leeromgeving/`. Stijlgids op `/admin/stijlgids` (ingang op
Instellingen), opgemeten door `tests/e2e/leeromgeving-stijl.spec.js`. Testen als
leerling staat in optie D: klassen met dezelfde lesstof in één kaart, en starten
kan op de startpagina, bij een hoofdstuk of in een paragraaf. Markering
`leeromgeving-fase-1`, Vercel-deploy `dpl_Ck4o2hdZU8dayDF6ByNUhFwddu6d`. Volgende fase: de
leerlingomgeving (ontwerp paragraaf 3.2). De twee tests in
`tests/e2e/auth-admin-smoke.spec.js` zijn verouderd (ze zoeken de oude
ontwikkelaarsknoppen op /login) en falen; dat is geen regressie, ze worden in
fase 2 bijgewerkt.

**7 oktober: Leeromgeving-stijl fase 2a live.** Inlogpagina's (leerling en
beheerder) staan in de leeromgeving-stijl, met velden die aan hun naam
gekoppeld zijn en foutmeldingen die worden voorgelezen (`role="alert"`). De
menubalk is nieuw; "Lesmateriaal" meldt `aria-current="page"`. De startpagina
is een lijst: "Verder waar je was" (het lange lesstaplabel breekt af), daaronder
hoofdstukrijen met voortgang (`.lo-voortgang`) die uitklappen naar paragrafen
met "Start hier"; bij openen staat elke rij dicht, wat dicht is toont het
slotje met uitleg. De hoofdstukpagina heeft paragraafrijen met stappen en een
slot zonder stippellijn. Rijen breken af op een telefoon en elke Start-knop
heeft een `aria-label` met de titel van de rij. Nieuw: `--lo-rood-inkt` (rode
tekst die 4,5:1 haalt) en de sleutel `knop.startHier` in tien talen. De
inlogtests in `tests/e2e/auth-admin-smoke.spec.js` zijn bijgewerkt en groen.
Markering `leeromgeving-fase-2a`, Vercel-deploy `dpl_CxaYxBFeVKC65ekSQbbZ9bAQb18B`. Kevin test nog
als testleerling (H1i1, een vmbo-klas, ER3L1A), ook op telefoon of iPad.

**7 oktober: Leeromgeving-stijl fase 2b live.** De lespagina: het lesblok is
een witte kaart, de stappenbalk een lijst met nummerblokjes (geel bij de
huidige stap), boven- en voetbalk wit met een lijn, "Volgende stap" als
hoofdknop. Leerdoelen, de zwevende bevestiging, quiz, toets (nummerpillen),
Digidocent, voorbeelden en slides zijn mee. De gedeelde oude knoppen krijgen
binnen de scope `.study-stijl` het nieuwe uiterlijk (zie
`docs/LEEROMGEVING-STIJL.md`, paragraaf Lespagina). Werking ongewijzigd. Nog
oud: rekenbladen wiskunde, `InleveringVak`, `MediaRenderer`, presenter. Op een
telefoon is de knop volledig scherm weg uit de bovenbalk (hij viel daar buiten
beeld). Tekst op `--lo-oranje-zacht` staat in inkt: `--lo-oranje-inkt` haalt
daar maar 4,2:1, dus het label "op slot" uit fase 1 (12px) zit net onder AA;
dat token aanpassen is een keuze voor fase 4.
Stijlgids heeft een sectie Lespagina; `src/lib/lespaginaStijl.test.js` en de
tweede test in `tests/e2e/leeromgeving-stijl.spec.js` bewaken hem.
Markering `leeromgeving-fase-2b`, Vercel-deploy `dpl_ASBddrehU7Dskrpegj3XRvE4HQKk`.
**7 oktober: nieuw logo live.** Kevins nieuwe logo (geel H-blok, ELIX, blauwe
stip) staat als SVG in `src/components/merk/HelixLogo.jsx`: in de menubalk (op
een telefoon alleen het H-blok), op de inlogpagina's, in de Voortgang-banner en
als tabbladicoon. Bij het laden staat het logo met drie golvende blauwe stipjes
in beeld (`HelixLaden`, ook in `index.html` tot de app er is). Beheerpagina's
laden nog met hun eigen spinners; dat gaat mee in fase 3. Commit e564001.
**7 oktober: Leeromgeving-stijl fase 2c live.** De pillen in de menubalk
(tokens, niveau, weekdoel, klasdoel, event) zijn `.lo-pil` (44px, met
balkje). Profiel, tokenshop (met avatarmaker en privileges), Mijn klas (met
stemmen en wedstrijd), het spellenoverzicht en het niveau-moment staan in de
nieuwe stijl: geen Bangers, gele banden, inktranden of harde schaduwen meer.
Een uitgeschakelde hoofdknop is nu crème met grijze tekst (leesbaar). De
achtergrond is lichter: `--lo-papier` #FFFBF4 (was #FFF7E8). Werking
ongewijzigd. Bekend en bewust gelaten: op /spellen staat de spelnaam dubbel
(GamePlayer heeft een eigen kop; fase 3). Markering `leeromgeving-fase-2c`,
Vercel-deploy `dpl_69kvnG6skRDikkXJjS8q5jngTJec`.
**7 oktober: Leeromgeving-stijl fase 3 live.** De docentomgeving staat in de
nieuwe stijl: menubalk (alleen menu, naam, uitloggen; Wis leerlingen en Reset CMS
op Instellingen), paginakoppen met een knoppenbalk die afbreekt in plaats van
woorden op drie regels, Lesstof, Instellingen, Leerlingen, Klassen, Vrijgeven
(raster met H-blokjes en slotjes), Tokenbeheer, Meldingen, AI, Projectkompas,
Slidedecks, digibordoverzicht, Spellenbeheer, crop-tool, Klaarzetten, Voortgang
en de lesstofeditor. Via de scope `beheer-stijl` (zie `docs/LEEROMGEVING-STIJL.md`).
Het laadlogo staat nu ook op beheerpagina's. `--lo-oranje-inkt` is #A2490C (5:1).
Op /spellen staat de spelnaam niet meer dubbel. Gebouwd met negen uitvoerders
tegelijk, elk in een eigen worktree (`.claude/worktrees/fase3-t*`, na afloop
opgeruimd). Markering `leeromgeving-fase-3`, Vercel-deploy `dpl_9yVoEhYzEXMF3nMEHDAniJzT3oJH`.
Volgende: fase 4 (opruimen).

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

### Diff rekenen - 15 oktober 2026

Nieuw vak voor de nieuwe klas **Diff_kader2** (`klas_1792053696147`, geen
route, vmbo kader leerjaar 2, rekenachterstand). Id's en commando's staan in
`references/vakken.md` van de skill. Vier domeinen: Getallen, Verhoudingen,
Meten en meetkunde, Verbanden. Die worden later elk een hoofdstuk onder het ene
niveau `niveau-diff-rekenen-2-kader`; per leerling openzetten gaat via
`studentOverrides.extraParagrafen`. Een HELIX-route is één per klas, dus de
domeinen zijn geen routes.

**Hoofdstuk 1, startles digitale nulmeting** (`hoofdstuk-diff-rekenen-2-start`),
live en toegewezen: 1.1 tot en met 1.4, één per domein, elk uitleg, voorbeeld en
een quiz van 12 vragen (4 basis, 4 plus, 4 verdieping in `taxonomy.masteryLevel`;
meerkeuze en getal invullen), één poging, Digidocent uit, 24 tokens. Bron
`docs/seeds/diff-rekenen-start-nulmeting.json`, seed `docs/seeds/diff-rekenen.seed.json`.
`controleer-hoofdstuk.mjs`: alles in orde. In de klas start elke groep bij een
ander domein (dat zegt Kevin; de paragrafen staan open).

Nieuw in de code: de seedbouwer kent getalvragen (`antwoord`, `marge`,
`eenheid` in `scripts/lib/vraagItems.mjs`), en een quizblok met
`content.vraagVolgordePerLeerling: true` toont de vragen per leerling in een
eigen volgorde, geschud binnen elk niveau (`schudVraagVolgordePerNiveau` in
`src/lib/answerOptionShuffle.js`, doorgegeven in `publicContentBlockView.js`).
Staat aan op de vier quizzen van de startles; live met `npx vercel --prod --yes`
(`helix-9kwz0jelu`). Nakijken en voortgang gaan op item-id, dus de volgorde
raakt het nakijken niet.

**Rekenhulp als kladwerk (15 oktober, live, `helix-btbt14j6z`):** bij
getalvragen in een quiz staat de rekenhulp (verhoudingstabel, rekenmachine)
als kladwerk (`KladRekenhulp` in `StudentLessonPage.jsx`, aan met
`settings.allowMathToolbox` op het blok, gezet met
`zet-vraagvolgorde-per-leerling.mjs --rekenhulp`). Alleen het getal wordt
nagekeken; het kladwerk wordt niet bewaard. Een nagekeken verhoudingstabel als
eigen vraagtype bestaat niet; dat vraagt een nieuw type op client en server.

**Leerlingen (15 oktober):** 20 accounts aangemaakt met
`scripts/maak-leerlingaccounts.mjs` (tijdelijk wachtwoord, `mustChangePassword`,
lijst in `exports/leerlingen/`). 8 leerlingen maakten zelf een account en kozen
Diff_kader2. De 12 die niet inlogden zitten in een andere klas en zijn op
Kevins verzoek verwijderd met `ruim-leeg-dubbelaccount-op.mjs` (back-up
`exports/reset-backups/lege-dubbelaccounts-2026-10-15.json`). Nu 16 leerlingen
plus de testleerling.

Overzicht voor de docent (per leerling antwoorden, percentage en niveau per
domein, volgorde sterk naar zwak): `node scripts/diff-rekenen-nulmeting-overzicht.mjs`
(alleen lezen, `--met-test` neemt de testleerling mee), JSON in
`.tmp-diag/diff-kader2-nulmeting.json`. Rekenregels in
`scripts/lib/diffRekenenNulmeting.mjs` met test. Een overzicht in HELIX zelf
bestaat nog niet. Testleerling `testleerling-diff_kader2` is aangemaakt.
Back-up van de klas: `exports/reset-backups/klassen-voor-diff-rekenen-2026-10-15.json`.

### Klasborden - 15 oktober 2026

Nieuwe beheerpagina `/admin/klasborden` (knop "Klasborden" tussen Voortgang en
Leerlingen): per klas een kaart met een verkleind klasbord, zoals het
klasbord-artifact, live bijgewerkt. Elke kaart toont het hoofdstuk met de
laatste activiteit van de klas. Klik voor het hele scherm (portal naar body,
boven de menubalk), met klas- en hoofdstukknoppen; Esc of het kruisje sluit.
Kleuren (Kevin, 15 okt): donkergroen alles goed, groen af, lichtgroen af
met veel fouten (minder dan 70% goed in de eerste ronde, `eersteScore`;
`ZWAK_GRENS` in `klasbord.js`), rood afgevinkt zonder alle vragen
(`isBlokStriktAf`), lichtgeel nog te maken, lichtgeel met slotje op slot
(klasslot op hoofdstuk, paragraaf of blok, en de paragraafsloten van 2.A en
2.T per leerling). Alles uit het blokrecord, geen items-subcollectie.

Kolommen zijn de `enabledParagrafen` van de klas, gefilterd op haar route.
Extra paragrafen per leerling tellen niet mee. Testaccounts en Kevins eigen
leerlingaccount ("Kevin Limpens" in ER3L1A) staan er niet op.
Code: `src/lib/klasbord.js` (+ test), `src/components/klasbord/`,
`src/pages/AdminKlasbordenPage.jsx`. Leest live de hele `voortgang`-collectie,
net als Voortgang. Lokaal bekeken met echte data; live sinds 15 okt (`helix-8f2do2cra`).

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

De functie draait als `firebase-adminsdk-fbsvc@pythagoras-eoa.iam.gserviceaccount.com`
(regel `serviceAccount` in `functions/index.js`); alleen dat account mag een
inlogtoken ondertekenen. Haal die regel niet weg. Het werkt: Kevin logt zo in
als testleerling.

**15 oktober: een testaccount ziet de paragraafsloten open.** Kevin wil als
testleerling elke paragraaf kunnen bekijken, ook 1.A, 2.A en 2.T, zonder eerst
alles te maken. Een testaccount (`isTestaccount: true`) slaat daarom de
paragraafsloten over, net als de beheerder (`useStudentOutline.js` en
`StudentLessonPage.jsx`, `zietParagraafSlotenOpen`). Er wordt niets afgevinkt;
het slot telt gewoon niet. Het klasslot van de docent (hoofdstukken op slot)
geldt wél, en de wachttijd voor het afvinken ook.

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

### Explainervideo's - 2 oktober 2026

Per hoofdstuk één uitlegvideo van max 3:00, gemaakt met de skill
`/explainer-helix-maker` (`.claude/skills/explainer-helix-maker/`). Ontwerp:
`docs/superpowers/specs/2026-10-02-explainer-helix-maker-design.md`.

- Vaste stemmen: docent Thomas, leerling Sami (Mette), `eleven_v4`, via de
  ElevenLabs-MCP. Portretten van Sami in `video/public/sami/`.
- Gereedschap in `video/` (Remotion, Blender-scripts). Draaiboek en timing per
  hoofdstuk in `video/public/hoofdstukken/<id>/` (in git); audio en shots daar
  buiten git; eindresultaat in `exports/video/<id>/` (buiten git).
- De video staat als media-blok direct vóór de Samenvatting van de gekozen
  paragraaf, met een los ondertitelspoor.
- Ondertitels in de moedertaal: een `.vtt` per taal van de taalknop naast `nl`;
  de speler kiest de taal van de leerling als zijn taalknop aan staat, anders
  Nederlands (ontwerp §19, skill stap 4b).
- Eerste video: Binask H2, **live sinds 5 oktober 2026** in 2.4
  Herhalingsopdrachten (blok 4, vóór de Samenvatting) voor ER3L1A en ER3L2A,
  met ondertitels in 10 talen. Blok `block-binask-eoa-1-h2-explainer-video`,
  bestanden in Storage onder `explainers/hoofdstuk-binask-eoa-1-h2/`. Back-up
  van vóór de plaatsing: `exports/reset-backups/explainer-hoofdstuk-binask-eoa-1-h2-*.json`.
  Het videoblok telt mee in de voortgang: wie 2.4 al af had, ziet hem weer als
  niet af tot de video bevestigd is. Nog te doen: controle als testleerling,
  ook op iPad/iOS Safari.
- KlimBit is **live sinds 5 oktober 2026** (gemerged in `4617fbc`, tokenregel
  in `364ae17`): voor iedereen op `/spellen`, callables `startKlimbitPoging` en
  `rondKlimbitPogingAf` (europe-west1), regels voor `klimbitPogingen`,
  `klimbitTeller` en `spelRecords`. Tokenregel van Kevin: oplopend van 0 bij
  400 m naar 200 bij 1000 m, 250 bij 2000 m en 350 bij 3000 m; alleen het
  verschil bij een nieuw record, hooguit 350 per leerling, buiten het
  weekplafond. Back-up van de regels van vóór de uitrol:
  `exports/reset-backups/firestore-rules-live-voor-klimbit-*.rules`. Details en
  de handmatige test: `docs/OVERDRACHT-KLIMBIT-2026-10-02.md`. De worktree
  `C:\Projecten\helix-klimbit` mag weg; volg de opruimstappen in die overdracht
  (eerst de node_modules-koppelingen los).
- Functions uitrollen gaf op 5 oktober "User code failed to load ... Timeout
  after 10000"; met `FUNCTIONS_DISCOVERY_TIMEOUT=60` ervoor lukte het. Node.js
  20 voor functions verloopt op 30 oktober 2026: daarna eerst upgraden.

### Paragraafsloten, wachttijd en rekenmachine - 15 oktober 2026

Drie instellingen die je op een paragraaf of lesblok zet en die de app
algemeen leest, dus ook bruikbaar voor een ander vak of hoofdstuk:

| Waar | Veld | Wat het doet |
| --- | --- | --- |
| paragraaf | `ontgrendelNaHoofdstuk: true` | slot tot de rest van het hoofdstuk af is (de antwoorden 1.A, 2.A) |
| paragraaf | `ontgrendelNaVoorgaande: true` | slot tot alles ervoor **strikt** af is, dus ook alle quizvragen gemaakt (de oefentoets 2.T) |
| lesblok | `content.minimaleTijdSeconden`, `content.bevestigLabel` | afvinkknop pas na zoveel seconden, met eigen tekst |
| lesblok | `content.rekenmachine: true` | knop Rekenmachine rechtsboven in de les |

De regels staan in `src/lib/antwoordenSlot.js` (beide sloten, met uitleg
bovenin), `src/lib/minimaleLeestijd.js` en `src/lib/studentLessonProgress.js`
(`isBlokStriktAf`). Plusparagrafen tellen nergens mee. Geen kringslot: de
antwoorden wachten niet op de oefentoets. De wachttijd is een duwtje en geen
beveiliging: de starttijd staat in sessionStorage, een nieuw tabblad begint
opnieuw. De rekenmachine is dezelfde als in het dichtheidsspel
(`src/games/dichtheid/componenten/Rekenmachine.jsx`).

De beheerder en testaccounts zien de paragraafsloten open (zie "Testen als
leerling").

### Rondleidingsvideo - 8 oktober 2026

"HELIX: zo bied ik elke dag maatwerk" (2:55), voor collega's en het MT. Thomas
spreekt als Kevin; Sami en een Oekraïense, Arabische en Turkse klasgenoot spreken in
hun moedertaal met Nederlandse ondertitels; muziek uit Suno. Compositie
`HelixRondleiding` in `video/src/Rondleiding.tsx` (aangemeld in
`video/src/Root.tsx`), script en stemmen in `video/public/rondleiding/`,
portretten in `video/public/klasgenoten/`. Schermen en render buiten git:
`exports/video/rondleiding/helix-rondleiding-v1.mp4`. Schermafdrukken zijn
geanonimiseerd met `video/scripts/anoniem.js`; echte namen en klascodes horen
er niet in. Wacht op Kevins oordeel.

### Presentaties - 16 september 2026

De trage presentaties kwamen niet door de bestanden maar door de bucket: die
stond alleen `localhost:5173` toe, waardoor de browser elke deck-PDF weigerde en
de viewer na een wachttijd terugviel op een kale iframe met de teller "1 / ?".
Opgelost met `scripts/zet-storage-cors.mjs --apply`; oude instelling in
`exports/reset-backups/storage-cors-voor-2026-09-16.json`. Sindsdien laadt een
deck van 3 MB in tienden van seconden, als echte dia's met een kloppende teller.

## 6. Wat nog open staat

In volgorde van wat Kevin het eerst wil. Wie eraan begint, werkt dit lijstje bij.

1. **Functions upgraden vóór 30 oktober 2026.** `functions/package.json` staat op
   Node.js 20, en die versie verloopt dan voor Cloud Functions. Daarna eerst
   upgraden voordat je een functie uitrolt.
   Lukt de uitrol niet ("User code failed to load ... Timeout"), zet dan
   `FUNCTIONS_DISCOVERY_TIMEOUT=60` ervoor.
2. **Het losse werk van 8 tot en met 15 oktober committen** (zie paragraaf 7,
   "Los in de werkmap"). Het staat live, maar niet in git. Kevin beslist wanneer.
3. **Binask H2 afronden.** Mogelijke volgende stappen, alleen op Kevins vraag:
   uitwerkingen van de oefentoets voor
   de leerling (de antwoorden staan al in `docs/seeds/binask-oefentoets-h2.json`,
   alleen voor de docent); de eindopdracht met cijfer wordt
   2.7. Wil Kevin de wachttijd voor testaccounts weg, dan is dat één regel in
   `StudentLessonPage.jsx` bij de minimale leestijd.
4. **Rondleidingsvideo**: wacht op Kevins oordeel over v1.
5. **Leeromgeving-stijl fase 4 (opruimen).** Fase 0 t/m 3 staan live. Fase 4
   volgens de spec, paragraaf 3.4. Bekende restpunten uit de reviews (logboeken in
   `exports/leeromgeving/fase-*-logboek.md`): rekenbladen en `InleveringVak` op de
   lespagina, `MediaRenderer`, de oude `--helix-*`-tokens en dode CSS
   (`.admin-nav-tab*`, `token-shop-*`), `knopClass` in `lib/nakijkOpdrachten.js`,
   zeven icoonknoppen zonder `aria-label` (o.a. ClassOverview, Slidedecks,
   QuestionEditor), emoji in de lesstofeditor (InlineEdit, DualPanelEditor,
   CmsShell), rode foutvakken in ContentBlockBuilder, GamePlayer-beheerkop,
   een eslint-fout die al bestond in `ExistingCropsManager`. Kevin test de
   leerlingkant en de docentkant (alle beheerpagina's), ook op een telefoon.
   Inventaris van de knoppenbalken:
   `exports/leeromgeving/fase-3-knoppenbalken-inventaris.md`.
6. **Infographic storingsplan (7 oktober 2026).** Gemaakt via de Helix
   Lesstudio (NotebookLM, Helix-opmaak), voor de gewone klassen en voor H1i1.
   Versie 2 wacht op Kevins akkoord: `exports/infographics/dv-h2-storingsplan-v2-verbeterd.png`
   ("bewaard" met de hand verbeterd; versie 1 had drie fouten). Daarna plaatsen
   in 2.3 van beide versies, als lichte afbeelding (geen PNG van 6 MB). Kevin
   wil hem eerst zien voordat er iets wordt vervangen.
7. **DV hoofdstuk 3 openzetten**: staat klaar maar op slot bij alle klassen.
   Dat is een lesbesluit van Kevin (`/admin/vrijgeven`).
8. **Curriculum DV, fase 6.** Fase 1 tot en met 5 liggen er (zie paragraaf 5).
   Fase 6 is het technische plan: SLO-koppeling per les in HELIX, de
   startscore uit de nulmeting bij elke les, en het dashboardconcept. Pas
   bouwen na Kevins akkoord op dat plan.
9. **Hoofdstuk 4 en verder van DV.** De hoofdstukken bestaan al als lege
   huls (zie Digitale vaardigheden). Bouwen gaat met `/helix-hoofdstuk-bouwen`;
   het deck volgt verplicht het design system.
10. **Vrijgeven van DV hoofdstuk 1**: de lesparagrafen 1.1 tot en met 1.5
   bestaan wel maar zijn aan niemand toegewezen. Dat is een lesbesluit; vraag
   het voordat je toewijst.
11. Nog te controleren als testleerling: de explainervideo in Binask 2.4 (ook op
   iPad/iOS Safari) en KlimBit (handmatige test in
   `docs/OVERDRACHT-KLIMBIT-2026-10-02.md`).
12. Uit de navigatie-audit: het dubbele voortgangsoverzicht op het profiel, een
   woord bij het tokenmuntje, onthouden welk hoofdstuk het laatst open stond,
   en toetsenbordbediening van de stappenbalk.
13. Vertaalknop: een blok publiceren vóór "Vertaling nu maken", de
   `vertalingen`-regel kent geen publicatiestatus, en vertalingen worden niet
   verwijderd als een blok wordt teruggetrokken.
14. Paragraaf 1.2 van Binask heeft een deck van 7,1 MB; dat kan naar ongeveer
   5,9 MB. Niet dringend.

15. **Diff rekenen**: het overzicht van de nulmeting in HELIX zelf (nu een
   script), de vier domeinhoofdstukken bouwen met de skill, en per leerling
   domeinen openzetten. Het oude losse vak "BiNaSk" (`vak-binask`, één
   hoofdstuk) staat nog in Firestore; vraag Kevin of het weg mag.

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

**Stand 7 oktober 2026: gecommit in ebfbd62** (inclusieversie H2); fase 1 van de Leeromgeving-stijl staat in de commits tot de markering `leeromgeving-fase-1`.

| Pad | Wat het is |
| --- | --- |
| `docs/seeds/dv-h2-device-inclusie.json`, `dv-h2-device-inclusie.seed.json` (nieuw) | inclusieversie van DV H2 |
| `public/lesstof/dv-h2-*.svg` (17, nieuw) | tekeningen bij de kernstappen |
| `scripts/zet-inclusie-klaar.mjs` (nieuw) | inclusieversie klaarzetten voor H1i1 |
| `scripts/zet-klas-lesstof-klaar.mjs`, `scripts/controleer-hoofdstuk.mjs` (gewijzigd) | inclusieparagrafen overslaan, H3 in `H2_EN_VERDER` |
| `.claude/skills/helix-hoofdstuk-bouwen/SKILL.md`, `references/vakken.md` (gewijzigd) | paragraaf "Een inclusieversie"; ook gekopieerd naar `~/.claude/skills/` |
| `docs/HANDOFF.md` (gewijzigd) | dit bestand |

**Stand 15 oktober 2026: niet gecommit, wel live** (site gedeployd met
`npx vercel --prod --yes`, lesstof met de scripts hieronder). Laatste commit is
`a79cb09` van 7 oktober.

| Pad | Wat het is |
| --- | --- |
| `src/lib/antwoordenSlot.js` + test (nieuw) | de paragraafsloten van 1.A/2.A en 2.T |
| `src/lib/minimaleLeestijd.js` + test (nieuw) | afvinken pas na een minimale tijd |
| `src/lib/studentLessonProgress.js`, `src/lib/chapterOutline.js` (gewijzigd) | strikt af (`isBlokStriktAf`, `isStriktAf`) per onderdeel |
| `src/hooks/useStudentOutline.js` (gewijzigd) | sloten toepassen; beheerder en testaccount zien ze open |
| `src/components/lesson/ChapterDetail.jsx`, `src/components/layout/TableOfContents.jsx` (gewijzigd) | slotje en uitleg bij de rij |
| `src/pages/StudentLessonPage.jsx` (gewijzigd) | slot bij een directe link, wachttijd op de afvinkknop, knop Rekenmachine |
| `src/games/dichtheid/componenten/Rekenmachine.jsx` (gewijzigd) | `onSluit`, zodat de lespagina hem helemaal sluit |
| `src/lib/publicContentBlockView.js` + test (gewijzigd) | `minimaleTijdSeconden`, `bevestigLabel` en `rekenmachine` naar de leerling |
| `src/lib/uiTaal.js` (gewijzigd) | slotteksten in alle talen |
| `docs/seeds/binask-uitwerkingen.json`, `scripts/plaats-uitwerkingen-binask.mjs` (nieuw) | 1.A en 2.A |
| `docs/seeds/binask-oefentoets-h2.json`, `scripts/plaats-oefentoets-binask-h2.mjs` (nieuw) | 2.T, met de docentantwoorden |
| `video/src/Rondleiding.tsx`, `video/src/Root.tsx`, `video/public/rondleiding/`, `video/public/klasgenoten/`, `video/scripts/anoniem.js`, `video/scripts/opname-browser.mjs` | de rondleidingsvideo |
| `.claude/launch.json` (gewijzigd) | server `explainer-bekijken` op poort 8130 |
| `docs/superpowers/plans/2026-10-07-leeromgeving-stijl-fase-2a.md` (nieuw) | plan van fase 2a, bleef liggen |
| `.claude/skills/helix-hoofdstuk-bouwen/SKILL.md` (gewijzigd) | paragraaf "Antwoorden en oefentoets achteraan"; ook gekopieerd naar `~/.claude/skills/` |
| `docs/HANDOFF.md` (gewijzigd) | dit bestand |

Ook van 15 oktober (Diff rekenen, niet gecommit, wel live):
`docs/seeds/diff-rekenen.seed.json`, `docs/seeds/diff-rekenen-start-nulmeting.json`,
`scripts/maak-klas.mjs`, `scripts/zet-vraagvolgorde-per-leerling.mjs`,
`scripts/diff-rekenen-nulmeting-overzicht.mjs`, `scripts/maak-leerlingaccounts.mjs`, `scripts/lib/diffRekenenNulmeting.mjs`
+ test (nieuw); `scripts/lib/vraagItems.mjs`, `scripts/zet-klas-lesstof-klaar.mjs`,
`scripts/maak-testleerlingen.mjs`, `src/lib/answerOptionShuffle.js` + test,
`src/lib/publicContentBlockView.js` + test, `src/pages/StudentLessonPage.jsx`,
`references/vakken.md` (gewijzigd).

Niet committen: `Gele Helix-tegel met blauwe stip.png` in de hoofdmap (een
logobestand van Kevin; vraag waar het heen moet).

Buiten git (genegeerd, maar wel nodig): `sources/dv-jpeg/dv-h2-device.pdf` (het
deck van H2), `sources/designsysteem/` (het design system en de uitgelezen
tekst) en `exports/curriculum/` (het MT-rapport als PDF en HTML). Sinds
oktober ook: `.tmp-diag/` (de klasborden, zie Binask), `exports/oefentoets-h2/`
(de tekeningen van 2.T), `exports/uitwerkingen-binask/`,
`exports/video/rondleiding/` en `exports/werkblad-design/` (het werkblad in
HELIX-stijl dat Kevin als ontwerpvoorbeeld gebruikt).

## Archief

Gedateerde overdrachten van eerdere sessies staan in `docs/handoffs/`. Ze
beschrijven hoe iets is ontstaan; wat nu geldt staat hierboven.

- `docs/handoffs/2026-09-16-avond.md` - Binask hoofdstuk 2 live, DV opgeruimd,
  de skill gebouwd.
- `docs/handoffs/2026-09-20-overdracht-aan-codex.md` - de nulmetingvraag, het
  curriculum DV in vijf fasen, DV hoofdstuk 2 live met deck, het design system
  in de skill, en de spec voor testen als leerling.
