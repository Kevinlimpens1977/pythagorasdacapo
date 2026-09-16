# De vakken, hun id's en hun klassen

Stand van 16 september 2026. Twijfel je of dit nog klopt, lees het dan uit
Firestore in plaats van het over te schrijven; klassen en routes veranderen.

## Binask (de twee EOA-klassen)

| Wat | Waarde |
| --- | --- |
| vakId | `vak-binask-eoa` |
| leerjaarId | `leerjaar-binask-eoa-1` |
| niveauId (lesstof) | `niveau-binask-eoa-1-lr3` ("Leerroute 3 - leerjaar 1") |
| seedBestand | `docs/seeds/binask-eoa.seed.json` |
| blokPrefix | `binask-eoa-1` |
| deckPrefix | `binask-eoa` |
| importeren | `node scripts/import-binask-eoa-seed-to-firestore.mjs --apply` |
| toewijzen | `node scripts/zet-binask-klaar-eoa.mjs --apply` |

De klassen:

| Klas | Id | Leerroute |
| --- | --- | --- |
| ER3L1A | `klas_1787768387441_7` | `niveau-binask-eoa-1-lr3` |
| ER3L2A | `klas_1787768387528_8` | geen route, met opzet |

Er is **één gedeelde kopie** van de lesstof, onder leerroute 1. ER3L1A ziet hem
via haar route; ER3L2A ziet hem doordat zij géén route heeft en dus alles ziet
wat aan haar is toegewezen. Zet daarom nooit een route op ER3L2A, en gebruik
`--koppel-klassen` niet: de importer zou de route uit de seed terugzetten en
twaalf leerlingen zouden hun lesstof kwijt zijn.

`zet-binask-klaar-eoa.mjs` kent per klas een `eigenNiveau`. Dat veld beschermt
"Ga van start..." van ER3L2A, de paragraaf van haar oorspronkelijke leerroute
waar 57 voortgangsrecords in zitten. Zonder dat veld zou een tweede run die
paragraaf als overbodig wegstrepen. Haal het er niet uit.

Bloktypen die Kevin hier wil: presentatie, theorie, voorbeeld, schriftopdracht,
samenvatting, 10-minutencheck, plus een oefenquiz per paragraaf en een toets aan
het eind van het hoofdstuk.

Quiz en toets: één poging, Digidocent uit. Dat komt overeen met wat er nu in de
bibliotheek staat en met wat Kevin voor deze klassen vroeg. Het script vult dit
zelf in.

Hoofdstukken die er staan: 1 ("h1 Stoffen") en 2 ("Massa, volume en dichtheid").
Het eerstvolgende nummer is dus 3 — maar controleer dat in Firestore.

## Digitale vaardigheden (de H1-klassen)

| Wat | Waarde |
| --- | --- |
| vakId | `vak-digitale-vaardigheden` |
| leerjaarId | `leerjaar-digitale-vaardigheden-vmbo1` |
| niveauId | `niveau-dv-vmbo1-kb` (Groene route) voor nieuwe, gedeelde hoofdstukken |
| importeren | `node scripts/import-digitale-vaardigheden-seed-to-firestore.mjs --seed <pad> --apply` |
| toewijzen | `node scripts/zet-klas-lesstof-klaar.mjs --vak dv --apply` |

De negen klassen, sinds 16 september 2026 **allemaal zonder leerroute**, zodat
één gedeeld hoofdstuk voor iedereen zichtbaar kan zijn:

| Klas | Id | Leerlingen |
| --- | --- | --- |
| H1B1 | `klas_1787767044660` | 1 |
| H1B2 | `klas_1787767053890` | 14 |
| H1K1 | `klas_1787768386819_0` | 19 |
| H1K2 | `klas_1787768386908_1` | 17 |
| H1K3 | `klas_1787768387011_2` | 18 |
| H1TL1 | `klas_1787768387188_4` | 24 |
| H1TL2 | `klas_1787768387289_5` | 21 |
| H1TL3 | `klas_1787768387366_6` | 21 |
| H1i1 | `klas_1787768387105_3` | 9 |

Geen schriftopdrachten bij dit vak; de opdrachten zijn digitaal. Quiz: meerdere
pogingen en Digidocent aan. Toets: één poging, Digidocent uit.

Kevin bouwt dit vak opnieuw op met deze skill, in **één versie voor alle
klassen**. Waar hij tussen de drie oude taalversies moest kiezen, koos hij de
**groene route** als uitgangspunt. Hoofdstuk 2 is op 16 september 2026 verwijderd
(473 documenten, back-up in `exports/reset-backups/`); het eerstvolgende vrije
nummer is dus 2. Controleer dat in Firestore voordat je erop vertrouwt.

### Drie dingen die hier misgaan

**De nulmeting zit ín hoofdstuk 1.** De paragrafen
`paragraaf-dv-bb-nulmeting-dv`, `paragraaf-dv-kb-nulmeting-dv`,
`paragraaf-dv-tl-nulmeting-dv` en `paragraaf-dv-h1i1-nulmeting-kort` hangen
onder `hoofdstuk-dv-<route>-h1`. Daar zit deel A en deel B in, met 195
voortgangsrecords van 140 leerlingen en 115 berekende startprofielen in
`nulmetingProfielen`. **Verwijder hoofdstuk 1 dus niet**, ook niet als iemand
zegt dat de oude hoofdstukken weg mogen; dat is waarschijnlijk niet wat hij
bedoelt. Vraag het na. `scripts/verwijder-hoofdstuk.mjs` weigert het overigens
uit zichzelf zodra er voortgang aan hangt.

**De gegenereerde seed.** `docs/seeds/digitale-vaardigheden-vmbo1.seed.json`
wordt volledig opnieuw opgebouwd door
`scripts/generate-digitale-vaardigheden-seed.mjs` uit het jaarplan. Zet je een
hoofdstuk uit aangeleverd lesmateriaal in dat bestand, dan is het weg zodra
iemand die generator draait. Geef zo'n hoofdstuk daarom een eigen seedbestand:

```json
"seedBestand": "docs/seeds/dv-h2-<onderwerp>.seed.json"
```

Dat bestand moet ook `vakken`, `leerjaren` en `niveaus` bevatten (kopieer die
blokken uit de grote seed), en importeer het met
`--seed docs/seeds/dv-h2-<onderwerp>.seed.json`.

Regenereer de grote DV-seed niet zonder reden: hij staat op HEAD en een
herbouw levert alleen een nieuw tijdstempel op.

**Toewijzen is een aparte beslissing.** De klassen hebben op dit moment alleen
hun eigen nulmeting toegewezen. Een nieuw hoofdstuk wordt pas zichtbaar als je
het toewijst, en dat is een lesbesluit: vraag of het vrijgegeven mag worden voor
je `--vak dv --apply` draait met gevulde `lesstofNiveaus`. Staat die lijst leeg,
dan werkt het script alleen de route bij en verandert er voor de leerling niets.

## Wat je opzoekt in plaats van overschrijft

De volgende vragen beantwoord je met een leesscript tegen Firestore, niet uit
dit bestand:

- Welk hoofdstuknummer is vrij?
- Welke paragrafen staan er al onder dit vak?
- Wat heeft een klas op dit moment toegewezen, en welke route heeft zij?
- Hoeveel voortgangsrecords hangen aan een paragraaf?

De collecties: `vak`, `leerjaar`, `niveau`, `hoofdstuk`, `paragraaf`,
`contentBlocks` (met de antwoorden erin), `publicContentBlocks` (wat de leerling
leest), `klassen` (`enabledParagrafen`, `niveauId`, `studentOverrides`),
`voortgang` (met subcollectie `items`), `slidedeckPackages`.
