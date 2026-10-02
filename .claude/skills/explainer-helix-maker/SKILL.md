---
name: explainer-helix-maker
description: Maakt van de lesstof van een HELIX-hoofdstuk een Nederlandse, geanimeerde uitlegvideo (explainer) van maximaal 3 minuten in de HELIX-stijl, met vaste stemmen (docent Thomas en leerling Sami via ElevenLabs), 3D-comicbeelden uit Blender, getekende metingen en formules in Remotion en losse ondertitelsporen (.vtt) in het Nederlands en in de taal van de leerling (de negen talen van de taalknop), en zet de video daarna vóór de Samenvatting van de gekozen paragraaf. Gebruik deze skill zodra Kevin vraagt om een explainer, uitlegvideo, animatie of filmpje bij een hoofdstuk of paragraaf, voor Binask of Digitale vaardigheden, ook als hij alleen zegt "maak hier een video van", of als een bestaande explainer opnieuw gemaakt, ingekort of opnieuw geplaatst moet worden. Niet voor het bouwen van lesstof of presentaties zelf: daarvoor is helix-hoofdstuk-bouwen.
---

# Een explainervideo maken voor een HELIX-hoofdstuk

Je maakt één video per hoofdstuk, maximaal 3:00, voor leerlingen die zelfstandig
kijken. De EOA-leerlingen leren nog Nederlands: rustig tempo, A2/B1, korte zinnen.
Elke video ziet er hetzelfde uit en klinkt hetzelfde. Dat is het hele punt van
deze skill: wijk niet af van de vaste stem, stijl en volgorde.

Werk in `C:\Projecten\helix leerplatform`. Het ontwerp staat in
`docs/superpowers/specs/2026-10-02-explainer-helix-maker-design.md`. Dat is het
plan van vóór de bouw: bij verschil gelden de scripts in `video/` en deze skill
(het draaiboekformaat, de mapnamen en de portretten zijn anders gebouwd; §18 van
de spec noemt de verschillen).

## Voor je begint

- `ffprobe -version` werkt (`meet-timing` heeft het nodig).
- Blender 5.2 staat er. Het pad staat bij stap 5.
- De Firestore-scripts gebruiken de standaard Google-aanmelding, zoals de andere
  HELIX-scripts. Geeft er een een aanmeldfout, stop dan en meld dat aan Kevin.
- De ElevenLabs-tools (`creative_*`) zijn uitgesteld: laad ze met ToolSearch
  voor je ze gebruikt.
- `video/node_modules` ontbreekt? Dan `(cd video && npm i --loglevel=error)`.

## De volgorde

1. Lesstof lezen
2. Draaiboek en doelparagraaf, **akkoord Kevin**
3. Kosten stemmen, **akkoord Kevin**
4. Stemmen opnemen en timing meten
4b. Vertalingen voor de ondertitels (`vertalingen.json`), na het goedgekeurde
   draaiboek en vóór het renderen van de ondertitels
5. Comic-shots in Blender (nieuwe voorwerpen eenmalig in de bibliotheek)
6. Samenvoegen in Remotion en bekijken
7. Renderen, stills controleren, **akkoord Kevin op de video**
8. Plaatsen: dry run, **akkoord Kevin**, dan `--apply`
9. Controleren als testleerling

Sla stap 2, 3, 7 of 8 nooit over. Een stem- of beeldgeneratie kost geld, en een
fout in de video zien honderd leerlingen.

## 1. Lesstof lezen

```bash
node video/scripts/lees-hoofdstuk.mjs --hoofdstuk <hoofdstukId>
```

Dit leest Firestore (de echte stand, niet de seed) en schrijft
`video/public/hoofdstukken/<id>/lesstof.json`. Lees dat bestand helemaal. Haal
de begrippen, de voorbeelden en hun getallen eruit. Verzin geen nieuwe getallen:
neem de voorbeelden uit de lesstof over.

## 2. Draaiboek

Schrijf `video/public/hoofdstukken/<id>/draaiboek.json` volgens
`references/draaiboek-formaat.md`. Opbouw: opening (vraag van Sami), één scène
per kernbegrip, één CHECK met een rekenopgave uit de lesstof, één KLAAR.

Lengte: de stem spreekt ongeveer 14,6 tekens per seconde (gemeten bij H2). Dat
maakt 350 woorden ongeveer 176 s, dus bijna de grens van 180. Schrijf liever
korter dan langer. Controleer:

```bash
node video/scripts/controleer-draaiboek.mjs --hoofdstuk <id>
```

Het script valideert het draaiboek en schat de lengte met de echte tijdlijn
(pauzes en scène-overgangen) op 14,5 tekens per seconde. Boven 175 s waarschuwt
het. De waarschuwing is geen foutcode: lees de uitvoer en schrap eerst een
bijzin in de langste scène, vóór er geld aan stemmen opgaat.

Leg Kevin het draaiboek voor zoals een docent het leest: per scène tijd, beeld,
en wie wat zegt. Noem de voorgestelde doelparagraaf (`lees-hoofdstuk` geeft die;
regel: de herhalingsparagraaf, anders de laatste gewone paragraaf met een
Samenvatting, nooit plus of uitdaging). Wacht op akkoord.

**Wat misgaat als je dit overslaat:** een video met een fout getal moet opnieuw
ingesproken worden, en dat kost credits.

## 3 en 4. Stemmen

Zie `references/stem-en-stijl.md` voor de stem-id's, het model en de
downloadroute. Altijd eerst `estimate_only`, dan Kevin, dan pas opnemen. Eén
opname per regel met `generations_count: 1` (de tool maakt anders standaard vier
varianten en rekent ze alle vier). Download elke opname via de `master_url` uit
`creative_get_flow_run_status` naar `audio/<regelId>.mp3`. Daarna:

```bash
node video/scripts/meet-timing.mjs --hoofdstuk <id>
```

Exit 2 betekent te lang: schrap eerst een bijzin in de langste scène, niet in de
CHECK.

## 4b. Vertalingen voor de ondertitels

De stem blijft Nederlands. De ondertitels staan ook in de taal van de leerling,
zodat een EOA-leerling meeleest in zijn moedertaal. Doe dit pas als het
draaiboek door Kevin is goedgekeurd: elke wijziging van een `tekst` maakt de
vertaling van die regel verouderd.

Vertaal de `tekst` (niet de `uitspraak`) van elke regel naar alle talen van
`LES_TALEN` in `src/lib/lesTaal.js` (el, uk, ar, tr, pl, ro, es, it, en) en
schrijf `video/public/hoofdstukken/<id>/vertalingen.json`, naast het draaiboek:

```json
{
  "hoofdstukId": "<id>",
  "bron": { "<regelId>": "<exact de Nederlandse tekst uit draaiboek.json>" },
  "talen": { "el": { "<regelId>": "<vertaling>" }, "uk": { "...": "..." } }
}
```

`bron` is een momentopname van de Nederlandse tekst per regel. Wijkt het
draaiboek er later van af, dan is die vertaling verouderd en weigert
`maak-ondertitels.mjs` te schrijven.

Afspraken voor de vertaling:

- Getallen, eenheden en symbolen blijven exact zoals op het scherm: g, kg, ml,
  cm³, ρ, m, V, en 7,9 met komma. Niet omzetten naar een andere schrijfwijze.
- Een kernbegrip krijgt de eerste keer het Nederlandse woord tussen haakjes
  (Engels: "In class we say mass (massa)"), zodat de leerling het woord in de
  les herkent. Daarna mag het gewoon in zijn taal.
- Zelfde toon als het Nederlands: korte zinnen, rustig, A2/B1. Een cue staat
  precies zo lang in beeld als de stem duurt; een veel langere vertaling leest
  te snel. Wordt een regel te lang voor twee regels van 42 tekens, dan maakt
  `maakVtt` er meer cues van.
- Geen emoji en geen opmaak (`<`, `>`, `&` worden ontsnapt). De spreker blijft
  de voice-tag uit het draaiboek, niet iets in de tekst.
- Arabisch (rechts naar links): zet formules en getal plus eenheid tussen
  bidi-isolaten, LRI (U+2066) vóór en PDI (U+2069) erna, zodat "25 − 15 = 10"
  en "750 g" niet omdraaien. `breekTekst` in `video/lib/ondertitels.mjs` breekt
  nooit binnen zo'n isolaat: een formule met spaties erin blijft op één regel.
  `maakVtt` schrijft binnen een isolaat harde spaties (U+00A0), zodat ook de
  browser de formule op een smalle video niet afbreekt. Elk isolaat moet dicht:
  een opener (LRI, RLI of FSI) zonder PDI, of een los PDI, meldt
  `controleerVertalingen` per taal en regel als fout.

Daarna controle en schrijven (stap 6 en 7 doen dat ook):

```bash
node video/scripts/maak-ondertitels.mjs --hoofdstuk <id>
```

Het script controleert eerst alles (taal of regel ontbreekt, verouderde bron,
emoji, onbalans in bidi-isolaten, taalcode buiten `LES_TALEN`). Bij een fout stopt het met exit 1 en
schrijft het niets. Anders komt er per taal een `ondertitels.<code>.vtt` in
`exports/video/<id>/`, naast `ondertitels.nl.vtt`, en het script meldt per
bestand het aantal cues. Staat `vertalingen.json` er niet, dan komt alleen `nl`.

Komt er later een taal bij in `LES_TALEN`: vul `vertalingen.json` aan met die
taal, draai `maak-ondertitels.mjs` en de plaatsing (stap 8) opnieuw. Dat
overschrijft het blok en schuift niets op.

## 5. Comic-shots

Zie `references/blender-renderrecept.md`. Maak `video/blender/shots/<id>.py` met
één functie per `shot.naam` uit het draaiboek. Render elk shot. Git Bash:

```bash
"/c/Program Files/Blender Foundation/Blender 5.2/blender.exe" -b --factory-startup -P video/blender/render-shot.py -- --hoofdstuk <id> --shot <naam>
```

PowerShell:

```powershell
& "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" -b --factory-startup -P video/blender/render-shot.py -- --hoofdstuk <id> --shot <naam>
```

Voeg `--alleen 1,45,90` toe om alleen die frames te renderen: een snelle proef
vóór je de hele reeks rendert. Bekijk elke render. Geen tekst, geen getallen,
geen schaalverdeling in een render: die horen in de getekende laag. Het water in
een 3D-shot stijgt natuurkundig, maar alleen de getekende maatcilinder draagt de
exacte getallen.

## 6 en 7. Samenvoegen, renderen, controleren

```bash
(cd video && npx remotion studio --no-open)
```

Bekijk elke scène. Dan:

```bash
node video/scripts/scene-frames.mjs --hoofdstuk <id>
(cd video && npx remotion still HelixExplainer ../exports/video/<id>/stills/<scene>.png --frame=<frame> --props='{"hoofdstukId":"<id>"}')
(cd video && npx remotion render HelixExplainer ../exports/video/<id>/explainer.mp4 --props='{"hoofdstukId":"<id>"}')
(cd video && npx remotion still HelixExplainer ../exports/video/<id>/poster.png --frame=<posterframe> --props='{"hoofdstukId":"<id>"}')
node video/scripts/maak-ondertitels.mjs --hoofdstuk <id>
```

De laatste regel schrijft `ondertitels.nl.vtt` en, als `vertalingen.json` er is
(stap 4b), een `.vtt` per taal van de taalknop. Controleer dat het aantal
bestanden klopt: 10 met vertalingen, 1 zonder.

Dit is Git Bash. De haakjes maken een subshell: na elke regel sta je weer in de
repo-root. De scripts in `video/scripts/` werken vanuit elke map. In PowerShell
breken de aanhalingstekens in `--props` de JSON: zet de props in een JSON-bestand
en geef `--props=<pad>`.

Bekijk elke still tegen de QA-lijst in `references/stem-en-stijl.md`. Stuur
Kevin de MP4 en wacht op zijn ja.

## 8. Plaatsen

Zie `references/plaatsing.md`.

```bash
node scripts/plaats-explainer-video.mjs --hoofdstuk <id> --paragraaf <doelParagraafId>
```

Laat Kevin de dry run zien. Hij toont ook de talen die meegaan ("Ondertitels in
10 talen: nl (Nederlands), el (Ελληνικά), ..."): alle `ondertitels.*.vtt` in de exportmap
gaan mee, mits `nl` erbij is en de code een taal van `LES_TALEN` is. Staat er een
oud vertaald bestand uit een eerdere ronde, haal het dan weg of maak het nieuw.
De dry run (en `--apply`, vóór de writes) waarschuwt als een vertaald bestand
ouder is dan `ondertitels.nl.vtt`: dan kan de timing niet meer kloppen met de
stem. Draai dan `maak-ondertitels.mjs` opnieuw.
Bij ja: zelfde commando met `--apply`. Zeg er altijd bij dat een nieuw videoblok
meetelt in de voortgang: leerlingen die de paragraaf al af hadden, zien hem weer
als niet af tot ze de video bevestigd hebben.

## 9. Controleren

Testleerling van de klas via `/admin/testen`: video staat direct boven de
Samenvatting, speelt af, ondertitels staan aan en kunnen uit. Controleer ook de
taal: staat de taalknop uit, dan staan de ondertitels in het Nederlands; zet je
hem aan (testleerling met een `lesTaal`), dan staan ze in die taal. Via de
CC-knop kan een leerling altijd wisselen. Zet je de taalknop tijdens de les om,
dan wisselt het spoor mee.

## Uitrollen

De speler (`MediaRenderer.jsx`) is code: die moet live zijn voordat een
leerling de ondertitels in zijn moedertaal ziet. Afspraken:

- Uitrollen gebeurt alleen vanuit de hoofdmap van HELIX en nooit vanuit een
  worktree. Vercel deployt wat in de map staat, niet wat in git staat.
- Live en git moeten na een uitrol gelijk zijn.
- Volgorde: commit, eventueel merge, één deploy (`npx vercel --prod --yes`),
  plaatsen met `--apply`, testleerling, push.

Commit en push alleen als Kevin erom vraagt.

## Rapporteren

Meld Kevin: lengte, kosten (stemmen en beelden), paragraaf, welke klassen het
zien, in welke talen de ondertitels staan, en wat er buiten git staat
(`exports/video/<id>/`, de audio en shots; `vertalingen.json` staat wel in git).
Commit niets zonder dat hij erom vraagt.
