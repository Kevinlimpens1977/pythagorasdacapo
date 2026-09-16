# Lesblokken aanleveren: de soorten en het formaat

Voor Kevin, om aan ChatGPT mee te geven. Wat hieruit komt kan ik met een klein
plaatsingsscript in de bibliotheek zetten, per route een kopie, zoals we dat
bij Binask en Digitale vaardigheden al doen.

## De negen soorten lesblokken

Een paragraaf is een rij lesblokken die de leerling van boven naar beneden
doorloopt. Elk blok is één stap. Dit zijn de soorten, in de volgorde waarin ze
meestal voorkomen:

| Type | Wat het is | Wat erin moet |
| --- | --- | --- |
| `slidedeck` | De presentatie voor op het bord en om terug te kijken | Alleen een titel. De PDF zet ik er zelf bij; ChatGPT hoeft hier niets voor te maken. |
| `theory` | Leestekst voor de leerling | Titel, 100 tot 250 woorden in korte alinea's, twee tot vier kernbegrippen met uitleg. Taal voor twaalf tot vijftien jaar. |
| `example` | Een uitgewerkt voorbeeld bij de theorie | Titel, een situatie uit het leven van de leerling, stap voor stap uitgewerkt. |
| `media` | Een video of afbeelding met een kijkvraag | Titel, de YouTube-link of afbeeldingslink, één kijkvraag ("Let op wat er gebeurt als..."). |
| `question` | Eén open vraag om zelf in te typen, met Digidocent-hulp | De vraag, een modelantwoord van twee tot drie zinnen, en één zin uitleg waarom dat het antwoord is. |
| `quiz` | Oefenrondje, meerdere pogingen, tokens aan | Vijf tot tien vragen uit de vraagtypen hieronder, met per vraag een korte uitleg bij het goede antwoord. |
| `toets` | Toetsmoment, één poging, Digidocent uit | Tien tot vijfentwintig vragen, zelfde vraagtypen, uitleg bij elke vraag. |
| `summary` | Samenvatting aan het eind | Vijf tot acht korte zinnen, elke zin één ding om te onthouden, plus de kernbegrippen nog een keer. |
| `game` | Spel als afsluiting | Alleen de naam van het spel uit de spellenlijst. ChatGPT hoeft dit niet te maken. |

Een gewone paragraaf ziet er zo uit: slidedeck, theory, example, media,
question, theory, question, summary, quiz. Niet elk blok hoeft erin; drie tot
acht blokken per paragraaf is normaal.

## De vraagtypen voor quiz en toets

| Type | Wat ChatGPT moet leveren |
| --- | --- |
| `meerkeuze` | De vraag, drie of vier opties, welke goed is (nummer, vanaf 0), uitleg bij het goede antwoord. Meerdere goede opties mag; dan een lijst nummers. |
| `waar-niet-waar` | De stelling, `juist: true` of `false`, uitleg. |
| `numeriek` | De vraag, het getal, eventueel een marge en een eenheid. |
| `invullen` | Een zin met het antwoord tussen blokhaken: `"De hoofdstad is [Amsterdam\|amsterdam]."` Alternatieven met een verticale streep. |
| `koppelen` | Drie tot vijf paren `{ "links": "...", "rechts": "..." }`. |
| `volgorde` | Drie tot zes stappen, in de goede volgorde opgeschreven; de app husselt ze zelf. |
| `open` | De vraag en een modelantwoord. Alleen in een quiz, niet in een toets voor de brugklas. |

Voor de brugklas: vooral `meerkeuze` en `waar-niet-waar`. Invullen, koppelen
en volgorde zijn voor die leerlingen het zwaarst; hooguit een paar per quiz.

## Het formaat

Eén JSON-bestand per hoofdstuk. Nederlands, geen emoji, alleen de velden
hieronder. Dit is het bestand dat ik inlees.

```json
{
  "vak": "Binask",
  "hoofdstuk": { "nummer": 2, "titel": "Mengsels en scheiden" },
  "paragrafen": [
    {
      "code": "2.1",
      "titel": "Zuivere stoffen en mengsels",
      "leerdoelen": [
        "Je weet wat het verschil is tussen een zuivere stof en een mengsel.",
        "Je kunt drie mengsels uit je eigen keuken noemen."
      ],
      "blokken": [
        { "type": "slidedeck", "titel": "Presentatie 2.1" },
        {
          "type": "theory",
          "titel": "Zuiver of gemengd?",
          "html": "<p>...</p><p>...</p>",
          "kernbegrippen": [
            { "begrip": "zuivere stof", "uitleg": "Een stof die uit één soort deeltjes bestaat." }
          ]
        },
        {
          "type": "example",
          "titel": "Limonade maken",
          "html": "<p>Stap 1: ...</p>"
        },
        {
          "type": "media",
          "titel": "Video: zout uit zeewater",
          "url": "https://www.youtube.com/watch?v=...",
          "kijkvraag": "Let op wat er overblijft als het water weg is."
        },
        {
          "type": "question",
          "vraag": "Is thee met suiker een zuivere stof of een mengsel? Leg uit.",
          "modelantwoord": "Een mengsel, want er zitten water, thee en suiker in.",
          "uitleg": "Zodra er meer dan één stof in zit, is het een mengsel."
        },
        {
          "type": "summary",
          "titel": "Samenvatting",
          "html": "<ul><li>...</li></ul>",
          "kernbegrippen": [{ "begrip": "mengsel", "uitleg": "..." }]
        },
        {
          "type": "quiz",
          "titel": "Oefenquiz: mengsels",
          "inleiding": "Check of je het snapt. Je mag twee keer.",
          "vragen": [
            {
              "type": "meerkeuze",
              "vraag": "Welke van deze is een zuivere stof?",
              "opties": ["Zeewater", "Suiker", "Limonade", "Lucht"],
              "juist": 1,
              "uitleg": "Suiker bestaat uit één soort deeltjes; de rest is gemengd."
            },
            {
              "type": "waar-niet-waar",
              "vraag": "Lucht is een mengsel.",
              "juist": true,
              "uitleg": "Lucht bestaat uit stikstof, zuurstof en meer."
            },
            {
              "type": "invullen",
              "tekst": "Een stof met maar één soort deeltjes heet een [zuivere stof|zuivere].",
              "uitleg": "Zuiver betekent: niets anders erin."
            }
          ]
        }
      ]
    }
  ]
}
```

## Wat ik dan doe

1. Bestand in `docs/seeds/` zetten en met de validator nakijken.
2. Slidedeck-PDF's en spellen erbij hangen.
3. Per route een kopie plaatsen, publieke snapshots bouwen, toewijzen aan de
   klassen die het moeten zien.

Vragen in een toets krijgen automatisch één poging en tokens uit; een quiz
twee pogingen en tokens aan. Dat hoeft ChatGPT dus niet te bedenken.

## De prompt voor ChatGPT

> Je maakt lesmateriaal voor HELIX, een leerplatform voor vmbo-leerlingen van
> twaalf tot vijftien jaar. Ik geef je de lesstof van één hoofdstuk. Verdeel die
> over paragrafen en per paragraaf over lesblokken, precies in het JSON-formaat
> hieronder. Gebruik alleen de bloktypen slidedeck, theory, example, media,
> question, quiz en summary. Elke paragraaf: één slidedeck als eerste, twee tot
> drie theorieblokken van 100 tot 250 woorden met kernbegrippen, na elk
> theorieblok één open question, één summary, en als laatste één quiz met vijf
> tot tien vragen. Gebruik in de quiz vooral meerkeuze en waar-niet-waar, en per
> quiz hooguit twee invul-, koppel- of volgordevragen. Elke vraag krijgt een
> uitleg van één zin bij het goede antwoord. Schrijf Nederlands, korte zinnen,
> geen emoji, geen Engelse woorden waar een Nederlands woord bestaat. Leerdoelen
> beginnen met "Je weet" of "Je kunt". Geef alleen de JSON terug.
>
> [hier het formaat plakken] [hier de lesstof plakken]
