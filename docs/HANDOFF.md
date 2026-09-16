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

### Digitale vaardigheden - 16 september 2026

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

### Presentaties - 16 september 2026

De trage presentaties kwamen niet door de bestanden maar door de bucket: die
stond alleen `localhost:5173` toe, waardoor de browser elke deck-PDF weigerde en
de viewer na een wachttijd terugviel op een kale iframe met de teller "1 / ?".
Opgelost met `scripts/zet-storage-cors.mjs --apply`; oude instelling in
`exports/reset-backups/storage-cors-voor-2026-09-16.json`. Sindsdien laadt een
deck van 3 MB in tienden van seconden, als echte dia's met een kloppende teller.

## 6. Wat nog open staat

- DV opnieuw opbouwen zodra Kevin lesmateriaal aanlevert.
- Vrijgeven van DV hoofdstuk 1: de lesparagrafen bestaan wel maar zijn aan
  niemand toegewezen. Dat is een lesbesluit; vraag het voordat je toewijst.
- Uit de navigatie-audit: het dubbele voortgangsoverzicht op het profiel, een
  woord bij het tokenmuntje, onthouden welk hoofdstuk het laatst open stond, en
  toetsenbordbediening van de stappenbalk.
- Vertaalknop: een blok publiceren vóór "Vertaling nu maken", de
  `vertalingen`-regel kent geen publicatiestatus, en vertalingen worden niet
  verwijderd als een blok wordt teruggetrokken.
- Paragraaf 1.2 van Binask heeft een deck van 7,1 MB; dat kan naar ongeveer
  5,9 MB. Niet dringend.

## 7. Bij het afsluiten van een sessie

1. Commit wat af is, of schrijf hieronder op wat er los blijft staan en waarom.
2. Heb je iets veranderd wat niet in git zichtbaar is (Firestore, Storage, de
   bucket, een skill)? Zet het in paragraaf 5, met de back-up erbij.
3. Klopt paragraaf 4 nog? Nieuw script of gewijzigde volgorde hoort erin.
4. Draai `node scripts/handoff-stand.mjs` en kijk of de uitkomst overeenkomt met
   wat hier staat. Wijkt het af, dan is dit bestand aan de beurt, niet de stand.

### Los in de werkmap

Niets. Bijwerken zodra dat verandert.

## Archief

Gedateerde overdrachten van eerdere sessies staan in `docs/handoffs/`. Ze
beschrijven hoe iets is ontstaan; wat nu geldt staat hierboven.

- `docs/handoffs/2026-09-16-avond.md` - Binask hoofdstuk 2 live, DV opgeruimd,
  de skill gebouwd.
