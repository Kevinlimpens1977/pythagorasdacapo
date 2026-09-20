# Het design system voor presentaties

Elk deck dat je voor HELIX maakt, volgt het **Helix Slide Design System**
(versie 1.0, 2 september 2026, 25 pagina's). Dat is niet optioneel: het is de
huisstijl van de digibordlessen, en een deck dat hem niet volgt valt op tussen
de rest.

Het document zelf staat in `sources/designsysteem/`:

- `Helix_Slide_Design_System_v2.pdf` (30 MB, buiten git);
- `designsysteem-tekst.txt`, de uitgelezen tekst van alle 25 pagina's.

Staat die map er niet, vraag Kevin dan om het PDF; het staat ook in zijn map
Downloads. Zonder dit document maak je geen deck.

## Het geldt op twee plekken

1. **In de bron.** Naast de lesstof voeg je de tekst van het design system als
   tweede bron toe in NotebookLM. Zo kent het model de families, de fasen en de
   kleuren, in plaats van ze uit de prompt te moeten afleiden.
2. **In de prompt.** De masterprompt hieronder is de basis van elke
   deckprompt. Vul het onderwerp in en plak de promptvelden en het contract
   eronder.

De oudere prompt "Algemene digibordles VMBO/EOA" uit
`src/lib/notebookPromptTemplates.js` is van juni 2026 en volgt dit systeem
niet. Gebruik hem niet voor nieuwe decks.

## De masterprompt (p.22, letterlijk)

Begin met één regel met het onderwerp, dan deze tekst:

> Maak een 16:9 educatief slidedeck voor Nederlandse vo-leerlingen in de vaste
> Helix Quest-familie. Gebruik een warm crèmekleurig canvas, een geel-zwarte
> titelzone en rijke semi-realistische 3D-comicbeelden met sterke zwarte
> contouren, warme keylight en koele teal fill. Gebruik exact twee fonts: een
> gecondenseerd comic-displayfont uitsluitend voor korte koppen en een
> toegankelijke sans-serif voor alle leestekst. Gebruik uitsluitend de
> kernlayouts FOCUS, SPLIT en STATUS en kies per dia één semantische familie.
> Label de leerfase KIJK, DOE, CHECK of KLAAR. WACHT is een KIJK-variant; HULP
> is een conditionele herstelvlag. Behandel per dia één cognitieve opdracht.
> Toon één primaire visual en formuleer één observeerbare actie. Voeg op DOE,
> CHECK en KLAAR een zichtbaar succescriterium toe. Plaats exacte screenshots
> groot, scherp, recht en onbedekt; reconstrueer nooit een interface. Voeg
> maximaal één primaire pijl of halo toe buiten functionele pixels. Gebruik
> geel-zwart plus maximaal twee functionele UI-accenten. Rood betekent
> fout/stop, groen succes, blauw actie/info, oranje hulp en paars
> Helix-context. Comicdecoratie blijft aan randen en hoeken en ondersteunt
> richting, fase of status. Gebruik maximaal één losse burst per dia. Wissel
> actieve en rustige dia's af. Genereer vakbeelden zonder ingebakken tekst,
> labels of timer. Voeg die daarna als afzonderlijke lagen toe. Valideer
> wetenschappelijke aantallen, relaties en causaliteit. Een MULTIPANEL-opgave
> bevat 2-5 gelijkwaardige opties met vaste A-E-labels; het juiste antwoord mag
> niet door schaal, positie, scherpte of kleur worden verraden. Gebruik een
> timer alleen wanneer tijd didactisch nodig is; plaats hem rechtsboven en laat
> afloop altijd overgaan naar CHECK. Schrijf direct, rustig en competent, met
> een werkwoord vooraan en bij voorkeur maximaal 25-35 woorden op een
> handelingsdia. Splits inhoud voordat je tekst verkleint.

## De promptvelden per dia (p.21)

Laat NotebookLM eerst structureren, dan pas vormgeven. Zet deze velden onder de
masterprompt:

```
PER DIA:
FASE: [KIJK | DOE | CHECK | KLAAR]
VARIANT: [WACHT | HULP | GEEN]
FAMILIE: [ROUTE | KIJK | DOE | PROCEDURE | CHECK | HULP | KLAAR | MULTIPANEL]
KERNLAYOUT: [FOCUS | SPLIT | STATUS]
FOCUS: [één cognitieve opdracht]
TEKST OP DIA: [exacte, korte tekst]
VISUAL: [exact bronbeeld of generatiebeschrijving]
ACTIE: [één observeerbare leerlingactie]
SUCCES: [Gelukt als ...]
HULP: [symptoom, eerste zelfcheck, escalatie]
BRONBEELD: [exacte bestandsnaam; niet reconstrueren]
UITZONDERING: [alleen indien noodzakelijk]
```

## Het contract (p.20)

**Moet:** fase, familie, focus, visual, actie, succes en hulp per dia; alleen
FOCUS, SPLIT en STATUS; exact twee fonts; vaste geel-zwarte UI-laag; één
cognitieve opdracht met zichtbaar succescriterium; screenshots exact, groot,
scherp en onbedekt.

**Liefst:** 25 tot 35 woorden op handelingsdia's; werkwoord vooraan; taalniveau
A2 of B1 waar dat past; actieve en rustige dia's afwisselen; echte bronbeelden
boven gegenereerde interface; splitsen bij meer dan drie microstappen of meer
dan twee schermtoestanden.

**Nooit:** nagemaakte interface, nagemaakt logo of ingebakken functionele
tekst; een derde font of willekeurige kleurbetekenis; twee zelfstandige
hoofdtaken op één dia; een bonus die belangrijker lijkt dan de afronding;
vrijgeven zonder brontrouw en QA.

## De kleuren (p.6)

| Token | Hex | Betekenis |
| --- | --- | --- |
| INK | #0B0D0F | tekst en kader |
| PAPER | #FFF7E8 | canvas |
| YELLOW | #FFD33D | navigatie en kop |
| BLUE | #087EB5 | actie en info |
| TEAL | #0D8F93 | ondersteuning |
| ORANGE | #F47A20 | hulp en aandacht |
| RED | #D83A2E | stop en fout |
| GREEN | #2E9D63 | succes |
| PURPLE | #793AC7 | Helix-context |

Geel-zwart plus hoogstens twee functionele accenten per deck. Geel draagt nooit
tekst: op crème haalt het 1,35:1 en dat is onleesbaar.

## Vrijgave (p.25)

Voor je het deck plaatst: één cognitieve opdracht per dia, screenshot ongeveer
55 tot 78 procent van de dia, 25 tot 35 woorden, één primaire marker,
succescriterium aanwezig, en geen harde fouten.

**Loop het deck zelf na voordat je het plaatst.** De generator maakt soms een
onleesbare regel of een Engelse kop. Beeld is geen tekstlaag, dus lezen gaat
alleen door de dia's te bekijken. Verbeter wat er niet klopt, of laat het deck
opnieuw maken.
