# Het bronbestand

Eén JSON-bestand per hoofdstuk, in `docs/seeds/`. Dit is het bestand dat
`scripts/bouw-hoofdstuk-seed.mjs` en `scripts/plaats-hoofdstuk-slidedecks.mjs`
allebei lezen, zodat lesstof en presentaties niet uit elkaar kunnen lopen.

Het is het lichte formaat uit `docs/LESBLOKKEN-AANLEVERFORMAAT.md`, plus de
`meta`-velden die de scripts nodig hebben om te weten waar het hoofdstuk hoort.

## Inhoud

1. [meta](#meta)
2. [hoofdstuk](#hoofdstuk)
3. [paragrafen](#paragrafen)
4. [De bloktypen](#de-bloktypen)
5. [Volledig voorbeeld](#volledig-voorbeeld)

## meta

| Veld | Verplicht | Wat het doet |
| --- | --- | --- |
| `vak` | nee | Label voor de leesbaarheid, bijvoorbeeld "Binask". |
| `bron` | ja in de praktijk | Waar de inhoud vandaan komt; komt in `sourceNotes` van elk blok, zodat je later weet welk bestand de waarheid was. |
| `vakId` | ja | Bijvoorbeeld `vak-binask-eoa`. |
| `leerjaarId` | ja | Bijvoorbeeld `leerjaar-binask-eoa-1`. |
| `niveauId` | ja | De leerroute waaronder het hoofdstuk hangt. Bepaalt welke klassen het kúnnen zien. |
| `seedBestand` | ja | Het seedbestand waarin het hoofdstuk wordt bijgewerkt. |
| `blokPrefix` | ja | Bepaalt de id's: `block-<blokPrefix>-<code>-<type>-<n>` en `paragraaf-<blokPrefix>-<code>`. |
| `deckPrefix` | nee | Prefix voor pakket-id's; standaard gelijk aan `blokPrefix`. Alleen nodig als bestaande pakketten een andere prefix hebben. |
| `deckMap` | nee | Map met de gecomprimeerde presentaties, bijvoorbeeld `sources/binask-jpeg`. Scheelt `--bronmap`. |
| `controleerTeksten` | nee | Lijst tekst die letterlijk in de lesstof moet voorkomen. De generator en de controle weigeren als er iets ontbreekt. Gebruik dit voor formules en eenheden. |

`controleerTeksten` is je vangnet tegen stille tekstschade. Zet er de tekens in
die er precies zo moeten staan: `ρ = m / V`, `m = ρ × V`, `g/cm³`, `1 ml = 1 cm³`.

## hoofdstuk

```json
"hoofdstuk": {
  "nummer": 3,
  "titel": "Warmte en temperatuur",
  "beschrijving": "Wat warmte is, hoe je temperatuur meet en hoe stoffen warmte doorgeven."
}
```

`nummer` bepaalt de volgorde op de leerlingpagina. Zonder nummer sorteert het
hoofdstuk achteraan. `id` mag je meegeven, maar hoeft niet: zonder id wordt het
`hoofdstuk-<blokPrefix>-h<nummer>`.

## paragrafen

```json
{
  "code": "3.1",
  "titel": "Temperatuur meten",
  "beschrijving": "Thermometer, graden Celsius, aflezen.",
  "leerdoelen": ["Je weet wat temperatuur is.", "Je kunt een thermometer aflezen."],
  "slidedeck": { "sleutel": "h3-temperatuur", "bestand": "h3-3.1-temperatuur.pdf", "titel": "Presentatie 3.1" },
  "blokken": []
}
```

- `code` is wat de leerling ziet, bijvoorbeeld "3.1". De paragraaftitel wordt
  `"3.1 Temperatuur meten"`.
- `leerdoelen` beginnen met "Je weet" of "Je kunt".
- `slidedeck` is optioneel. Staat hij er, dan begint het eerste tekstblok bij
  volgnummer 2, want volgnummer 1 is voor de presentatie.
- `sleutel` bepaalt het pakket-id; `bestand` is de bestandsnaam in `deckMap`.

## De bloktypen

### theory, example, summary

```json
{
  "type": "theory",
  "titel": "Wat is temperatuur?",
  "html": "<p>...</p><p>...</p>",
  "kernbegrippen": [
    { "begrip": "temperatuur", "uitleg": "Hoe warm of koud iets is." }
  ]
}
```

Honderd tot tweehonderdvijftig woorden in korte alinea's. De kernbegrippen komen
als begrippenlijst onder de tekst in de html terecht; `content.keyTerms` wordt
wel bewaard maar niet aan de leerling getoond.

Toegestane html: `<p>`, `<h3>`, `<ul>`, `<ol>`, `<li>`, `<strong>`, `<em>`,
`<table>`, `<dl>`. Geen `<input>`, `<textarea>`, `<form>` of `contenteditable`:
de app zet invoervelden zelf neer waar ze horen.

### Schriftopdracht, 10-minutencheck, eindcheck

Dit zijn gewone `theory`-blokken met een genummerde lijst en de vlag
`schriftopdracht: true`, zodat in de bronnotitie komt te staan dat het schriftwerk
is.

```json
{
  "type": "theory",
  "schriftopdracht": true,
  "titel": "Schriftopdracht 3.1",
  "html": "<p>Schrijf de antwoorden in je schrift.</p><ol><li>...</li></ol>"
}
```

Geen `question`, `quiz` of `toets`: de leerling werkt op papier, er wordt niets
nagekeken en er staan geen antwoorden in de leerlingversie.

### media

```json
{ "type": "media", "titel": "Video: warmte geleiden", "url": "https://www.youtube.com/watch?v=...", "kijkvraag": "Let op welk materiaal het snelst warm wordt." }
```

De kijkvraag komt boven de video te staan.

### question

Eén of meer open vragen die de leerling intypt, met Digidocent-hulp.

```json
{
  "type": "question",
  "titel": "Korte check",
  "inleiding": "Beantwoord in gewone zinnen.",
  "vragen": [
    { "vraag": "Waarom voelt metaal kouder dan hout?", "modelantwoord": "Metaal geleidt warmte sneller...", "uitleg": "Het gaat om geleiding, niet om de temperatuur." }
  ],
  "digidocent": true
}
```

Het modelantwoord is docentdata en komt in het invulveld, niet in de tekst die
de leerling leest. Zet `digidocent: false` als hulp tijdens het antwoorden het
doel van de vraag ondermijnt.

### quiz en toets

```json
{
  "type": "quiz",
  "titel": "Oefenquiz 3.1",
  "inleiding": "Check of je het snapt.",
  "tokens": 15,
  "vragen": [
    { "prompt": "Water kookt bij 100 graden Celsius.", "waar": true, "feedback": "Bij normale luchtdruk kookt water inderdaad bij 100 graden." },
    { "prompt": "Welk meetinstrument gebruik je voor temperatuur?", "options": [
        { "text": "Thermometer", "correct": true },
        { "text": "Weegschaal" },
        { "text": "Maatcilinder" }
      ], "feedback": "Een thermometer meet temperatuur; de andere twee meten massa en volume." }
  ]
}
```

Een quiz heeft minstens drie vragen, een toets minstens zes. Elke vraag heeft
eigen feedback van minstens twintig tekens. Wat er verder gecontroleerd wordt
staat in `vraagregels.md`.

Pogingen, tokens en Digidocent worden per vak ingevuld; zie `vakken.md`. Met
`tokens` overschrijf je het aantal tokens van dat blok.

## Volledig voorbeeld

```json
{
  "meta": {
    "vak": "Binask",
    "bron": "HELIX_H3_Warmte_bron.pdf (Kevin, 3 oktober 2026)",
    "vakId": "vak-binask-eoa",
    "leerjaarId": "leerjaar-binask-eoa-1",
    "niveauId": "niveau-binask-eoa-1-lr3",
    "seedBestand": "docs/seeds/binask-eoa.seed.json",
    "blokPrefix": "binask-eoa-1",
    "deckPrefix": "binask-eoa",
    "deckMap": "sources/binask-jpeg",
    "controleerTeksten": ["Q = m × c × ΔT", "°C"]
  },
  "hoofdstuk": {
    "nummer": 3,
    "titel": "Warmte en temperatuur",
    "beschrijving": "Wat warmte is en hoe je temperatuur meet."
  },
  "paragrafen": [
    {
      "code": "3.1",
      "titel": "Temperatuur meten",
      "beschrijving": "Thermometer en graden Celsius.",
      "leerdoelen": ["Je weet wat temperatuur is.", "Je kunt een thermometer aflezen."],
      "slidedeck": { "sleutel": "h3-temperatuur", "bestand": "h3-3.1-temperatuur.pdf", "titel": "Presentatie 3.1 - Temperatuur" },
      "blokken": [
        { "type": "theory", "titel": "Wat is temperatuur?", "html": "<p>...</p>", "kernbegrippen": [{ "begrip": "temperatuur", "uitleg": "Hoe warm of koud iets is." }] },
        { "type": "example", "titel": "Voorbeeld - koortsthermometer", "html": "<ol><li>Stap 1: ...</li></ol>" },
        { "type": "theory", "schriftopdracht": true, "titel": "Schriftopdracht 3.1", "html": "<ol><li>...</li></ol>" },
        { "type": "summary", "titel": "Samenvatting", "html": "<ul><li>...</li></ul>" },
        { "type": "theory", "schriftopdracht": true, "titel": "10-minutencheck", "html": "<ol><li>...</li></ol>" }
      ]
    }
  ]
}
```

Een echt, werkend voorbeeld staat in
`docs/seeds/binask-h2-massa-volume-dichtheid.json`.
