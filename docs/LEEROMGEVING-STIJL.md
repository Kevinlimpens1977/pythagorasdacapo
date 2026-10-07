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
| `--lo-papier` | #FFF7E8 | achtergrond van de pagina |
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

## Regels

- Iets wat dicht is, toont het slotje en een uitgeschakelde knop.
- Aantallen voluit: "1 paragraaf", "3 paragrafen", "1 lesblok", "9 lesblokken".
- Koppen nooit in hoofdletters en nooit in Bangers.
- Eigen uiterlijk houden: de spellen, de presenter en het digibord, het certificaat.
