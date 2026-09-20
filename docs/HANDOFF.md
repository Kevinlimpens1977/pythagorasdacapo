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

### Digitale vaardigheden - bijgewerkt 20 september 2026

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

**19 september: curriculumontwerp DV klas 1, alleen op papier.** In
`docs/curriculum/` staan fase 1 (SLO-onderzoek, audit, nulmeting), fase 2 (het
goedgekeurde curriculum van 22 lessen, H2 tot en met H23) en fase 3 (scenario's
voor het MT) en fase 4 (leerlijn klas 1 tot 4). De enige bron is `dv-klas1-curriculum.json`; de tabellen komen
uit `genereer-fase2.mjs` en `genereer-fase3.mjs`. Het MT-rapport (fase 5) bouw je met
`python docs/curriculum/rapport/bouw-rapport.py`; de PDF komt in `exports/curriculum/`.
Er is niets gebouwd in HELIX. Fase 6 (technisch plan) volgt; bouwen pas na
Kevins akkoord op het plan van fase 6.

### Presentaties - 16 september 2026

De trage presentaties kwamen niet door de bestanden maar door de bucket: die
stond alleen `localhost:5173` toe, waardoor de browser elke deck-PDF weigerde en
de viewer na een wachttijd terugviel op een kale iframe met de teller "1 / ?".
Opgelost met `scripts/zet-storage-cors.mjs --apply`; oude instelling in
`exports/reset-backups/storage-cors-voor-2026-09-16.json`. Sindsdien laadt een
deck van 3 MB in tienden van seconden, als echte dia's met een kloppende teller.

## 6. Wat nog open staat

In volgorde van wat Kevin het eerst wil. Wie eraan begint, werkt dit lijstje bij.

1. **Testen als leerling, per klas.** De spec is af en wacht op Kevins review:
   `docs/superpowers/specs/2026-09-20-testleerling-per-klas-design.md`. Negen
   testleerlingaccounts, een callable die alleen voor testaccounts een
   inlogtoken maakt, een beheerpagina "Testen", een balk tijdens het testen en
   filters zodat testaccounts nergens meetellen. Twee open punten staan
   onderaan die spec. Na akkoord: implementatieplan, dan bouwen.
2. **Het losse werk committen** (zie paragraaf 7, "Los in de werkmap"). Kevin
   beslist wanneer.
3. **De gereedheidsfix deployen.** `src/lib/contentReadiness.js` keurde een
   vraagblok met eigen invulvelden ten onrechte af. Tot de volgende deploy
   toont de CMS bij de plusopdracht van 2.1 nog "Koppel eerst een vraag".
   Leerlingen merken er niets van.
4. **Curriculum DV, fase 6.** Fase 1 tot en met 5 liggen er (zie paragraaf 5).
   Fase 6 is het technische plan: SLO-koppeling per les in HELIX, de
   startscore uit de nulmeting bij elke les, en het dashboardconcept. Pas
   bouwen na Kevins akkoord op dat plan.
5. **Hoofdstuk 3 en verder van DV.** Les 2 van het curriculum is "Hoe reist
   jouw bericht over internet?". Bouwen gaat met `/helix-hoofdstuk-bouwen`;
   het deck volgt verplicht het design system.
6. **Vrijgeven van DV hoofdstuk 1**: de lesparagrafen 1.1 tot en met 1.5
   bestaan wel maar zijn aan niemand toegewezen. Dat is een lesbesluit; vraag
   het voordat je toewijst.
7. Uit de navigatie-audit: het dubbele voortgangsoverzicht op het profiel, een
   woord bij het tokenmuntje, onthouden welk hoofdstuk het laatst open stond,
   en toetsenbordbediening van de stappenbalk.
8. Vertaalknop: een blok publiceren vóór "Vertaling nu maken", de
   `vertalingen`-regel kent geen publicatiestatus, en vertalingen worden niet
   verwijderd als een blok wordt teruggetrokken.
9. Paragraaf 1.2 van Binask heeft een deck van 7,1 MB; dat kan naar ongeveer
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

Stand 20 september 2026. Niets hiervan is gecommit; Kevin bepaalt wanneer dat
gebeurt.

| Pad | Wat het is |
| --- | --- |
| `docs/seeds/dv-h2-device.json`, `dv-h2-device.seed.json` | de lesstof van DV hoofdstuk 2, die live staat |
| `scripts/nulmeting-b03-opzoekvraag.mjs` | het script dat nulmeting B vraag 3 een opzoekvraag maakte (al uitgevoerd) |
| `docs/seeds/nulmeting-dv/nulmeting-b.json` (gewijzigd) | dezelfde vraag in de bron, zodat een nieuwe import hem niet terugdraait |
| `scripts/zet-klas-lesstof-klaar.mjs` (gewijzigd) | kan nu één hoofdstuk toewijzen via `lesstofHoofdstukken` |
| `src/lib/contentReadiness.js` en de test (gewijzigd) | vraagblok met eigen invulvelden is geldig; nog niet gedeployd |
| `.claude/skills/helix-hoofdstuk-bouwen/SKILL.md` (gewijzigd) en `references/slidedeck-designsysteem.md` | het design system is verplicht bij elk deck |
| `docs/curriculum/` | het hele curriculumonderzoek, fase 1 tot en met 5, inclusief het MT-rapport en het bouwscript |
| `docs/superpowers/specs/2026-09-20-testleerling-per-klas-design.md` | de spec voor testen als leerling |

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
