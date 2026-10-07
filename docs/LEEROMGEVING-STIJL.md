# HELIX Leeromgeving-stijl

Het uiterlijk van de website van HELIX, voor leerlingen en docenten. Dit is het
enige stijldocument van de website.

## Niet het Slide Design System

| | Leeromgeving-stijl | Helix Slide Design System |
| --- | --- | --- |
| Voor | de website | slidedecks, NotebookLM-materiaal, explainervideo's |
| Code | `src/styles/leeromgeving.css`, `src/components/leeromgeving/` | geen websitecode |
| Letter | Atkinson Hyperlegible Next, nergens Bangers | Bangers voor koppen |
| Kenmerken | witte kaarten, scheidingslijnen, gele H-blokjes | stripstijl, gele titelband, rasterpunten |

Wie een deck maakt, kijkt niet hier. Wie de website aanpast, kijkt niet in het
Slide Design System.

## Bron

Optie D van de proefpagina "Indeling Testen als leerling", door Kevin gekozen op
7 oktober 2026 en opgemeten met `getComputedStyle`. Het ontwerp met alle keuzes:
`docs/superpowers/specs/2026-10-07-leeromgeving-stijl-design.md`. De stijlgids
staat in de app op `/admin/stijlgids`; `tests/e2e/leeromgeving-stijl.spec.js`
meet hem op.

## Kleuren

Altijd via de tokens, nooit een losse hexwaarde in een component.

| Token | Waarde | Gebruik |
| --- | --- | --- |
| `--lo-papier` | #FFFBF4 | achtergrond van de pagina (7 okt 2026 lichter gemaakt; was #FFF7E8) |
| `--lo-papier-2` | #FBEBD0 | dichte H-blokjes, uitgeschakelde knoppen |
| `--lo-kaart` | #FFFFFF | kaarten en lijsten |
| `--lo-lijn` | #E8DCC3 | randen en scheidingslijnen |
| `--lo-inkt` | #0B0D0F | tekst, rand van het H-blokje |
| `--lo-grijs` | #5B5648 | onderregels en uitleg |
| `--lo-geel` | #FFD33D | H-blokje |
| `--lo-geel-zacht` | #FFF0B8 | aandacht |
| `--lo-blauw` / `-inkt` / `-zacht` | #087EB5 / #066A99 / #E1F0F8 | hoofdknop / tekst op lichtblauw / Start-knop en blauwe labels |
| `--lo-paars` / `-inkt` / `-zacht` | #793AC7 / #5F2C9E / #ECE3F8 | kolf-icoon / label inclusie |
| `--lo-groen` / `-inkt` / `-zacht` | #2E9D63 / #237A4D / #DFF2E7 | af en voortgang |
| `--lo-oranje-inkt` / `-zacht` | #B4520E / #FDE7D6 | op slot |
| `--lo-rood` / `-inkt` / `-zacht` | #D83A2E / #B42F25 / #FADDDA | fouten; tekst altijd in -inkt (4,5:1 op -zacht) |

## Letter en maten

| Tekst | Grootte / dikte | Regelhoogte |
| --- | --- | --- |
| gewone tekst | 15px / 400 | 1,5 |
| kaarttitel | 20px / 800 | 30px |
| uitleg onder de kaarttitel | 14px / 400, grijs | 21px |
| rij- en paragraaftitel | 15px / 700 | 22,5px |
| onderregel | 12,5px / 400, grijs | 18,75px |
| H-blokje, Start, Start hier, keuzeknop | 13px / 800 | 19,5px |
| label | 12px / 800 | 18px |
| paginakop | 28-38px / 800 | 1,15 |

Kaart: hoek 20px, binnenmarge 22px (16px op een telefoon), schaduw
`0 8px 24px rgba(11,13,15,.07)`. Lijst: rand 1px, hoek 12px, rijen 10px 12px met
een lijn ertussen. Paragrafen springen 52px in. H-blokje: 30px hoog, rand 2px
inkt, hoek 8px. Start-knop: padding 6px 10px, hoek 8px.

## Bouwstenen

`src/components/leeromgeving/`: `Kaart`, `KaartKop`, `HBlok`, `HoofdstukRij`,
`ParagraafRij`, `StartKnop`, `Label`, `Keuzeknoppen`, `PaginaKop`. Gebruik die
in plaats van eigen opmaak. Iconen alleen uit lucide-react.

`.lo-pil` is de pil in de menubalk (tokens, niveau, weekdoel, klasdoel, event):
44px hoog zoals de knoppen ernaast, rand `--lo-lijn`, 13px/800. Varianten
`--groen` (gehaald) en `--geel` (event); een mini-balkje met `.lo-pil-balk`.
Een uitgeschakelde `.lo-knop` is crème met grijze tekst, zodat er nog te lezen
staat waarom hij uit staat ("Nog 15").

## Logo

Het logo (Kevin, 7 oktober 2026): geel H-blok met zwarte rand, "ELIX" in zwart,
een blauwe stip. Als SVG in `src/components/merk/HelixLogo.jsx`; niet als plaatje.

- `<HelixLogo />` is het woordmerk: in de menubalk (36-40px hoog) en op de
  inlogpagina's (48px). `variant="blok"` is alleen het H-blok: in de menubalk op
  een telefoon en als tabbladicoon (`public/favicon.svg`).
- `<HelixLaden tekst="..." />` toont het logo met drie blauwe stipjes die om de
  beurt een klein beetje omhoog gaan, als een pagina of onderdeel laadt. Met
  `schermvullend` voor het opstarten van de app; `index.html` toont hetzelfde
  beeld tot de app er is. Bij "minder beweging" staan de stipjes stil.
- Het oude `src/afbeeldingen/logo.png` wordt in de website niet meer gebruikt.

## Lespagina

De lespagina (`StudentLessonPage.jsx`) deelt een paar oude klassen met andere
pagina's: `btn-primary`, `btn-secondary`, `helix-btn-solid`, `helix-eyebrow`,
`input-standard` en `lesson-prose`. Binnen de scope `.study-stijl` (op de wortel
van de lespagina en op het voorbeeld in de stijlgids) krijgen ze het uiterlijk
van `.lo-knop`, `.lo-knop-tweede`, `.lo-eyebrow` en `.lo-invoer`, en leestekst
in inkt. Alleen kleur, rand, hoek, letter en schaduw; de binnenmarges blijven,
zodat de vragen en de toetsstepper niet verspringen. Het blok staat onderaan
`src/index.css`: `designTokenStyles.test.js` leest per klasse de eerste regel.

- Lesblok: `.study-block`, een witte kaart (hoek 20px, kaartschaduw, 22px
  binnenmarge, 16px op een telefoon).
- Stappenbalk: een `.lo-lijst` met per stap een nummerblokje
  (`.study-step-nummer`, crème). De huidige stap heeft een geel blokje op een
  lichtgele regel. Rechts het type-icoon en een vinkje of een open rondje.
- Voetbalk: "Vorige" als tweede knop, "Volgende stap" als hoofdknop.
- Nog in de oude vorm, bewust: de rekenbladen en de rekenmachine van wiskunde,
  `InleveringVak`, de donkere achtergrond achter lades en dialogen,
  `MediaRenderer` en de presenter. Die komen in fase 4.

## Regels

- Iets wat dicht is, toont het slotje en een uitgeschakelde knop.
- Aantallen voluit: "1 paragraaf", "3 paragrafen", "1 lesblok", "9 lesblokken".
- Koppen nooit in hoofdletters en nooit in Bangers. Bangers staat alleen nog in
  de spellen en het certificaat (en tot fase 3 in het Help-paneel).
- Eigen uiterlijk houden: de spellen, de presenter en het digibord, het certificaat.
