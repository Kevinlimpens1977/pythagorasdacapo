# Spelopzet: Data Koerier — blind typen met tien vingers

> Vijfde spel voor het HELIX-leerplatform (`data-koerier`, `src/games/dataKoerier/`).
> Tienvinger-blindtyptrainer voor VMBO basis/kader/TL leerjaar 1-2, gebouwd volgens
> `STARTGIDS-NIEUW-SPEL.md`. Dit document beschrijft het ontwerp, de contentstructuur
> en de Higgsfield-assets.

## Concept

De leerling is datakoerier in een pastel digitale stad. Elke les is een **bezorgroute**:
per correct getypt teken rijdt de koerier verder, per afgeronde regel wordt een pakketje
bezorgd. Nauwkeurigheid gaat vóór snelheid: een route is pas "gehaald" bij **90%**
nauwkeurigheid, en pas daarna ontgrendelt de volgende route. Een fout teken blijft staan
tot het goed wordt getypt (niet-bestraffend, wel duidelijk: rood + onderstreping + ✗).

- **13 routes**: basisrij-oriëntatie → linker-/rechterhand → beide handen → bovenste rij →
  onderste rij → hoofdletters (Shift met de andere pink) → cijfers → leestekens →
  digiwoorden → korte zinnen → langere zinnen → meesterproef.
- **Toprit: Expresbezorging** (snelheidsuitdaging) ontgrendelt na route 8; tijdsbonus
  telt alleen boven de accuracy-drempel.
- **Adaptief**: na een regel onder de 80% wordt een scoreloze oefendrill met de twee
  zwakste toetsen ingevoegd (max 2 per sessie). Vingerhints staan in routes 1-6 altijd
  aan, daarna alleen na een fout.
- **Vingerbegeleiding**: visueel toetsenbord met vingerkleuren, basisrij-markers,
  voelrandjes op F/J, Shift-indicatie per hand en twee mini-handjes waarvan de juiste
  vinger oplicht.
- **Caps Lock-vangnet**: de linkerpink raakt bij het reiken naar de a makkelijk per
  ongeluk Caps Lock. Het spel detecteert dit, toont een duidelijke waarschuwing en telt
  hoofdletter-aanslagen door Caps Lock niet als fout.
- **Uitgestelde resultaatmelding**: `onComplete` wordt pas gemeld bij "Naar de
  routekaart", bij unmount of uiterlijk na 6 seconden (exact één keer), zodat de
  GamePlayer-fullscreen niet sluit voordat de speler het eindscherm heeft gezien.

## Architectuur

| Bestand | Rol |
|---|---|
| `dataKoerierToetsenbord.js` | QWERTY-layout, vinger/hand-kaart, Shift-logica, vingerinstructies |
| `dataKoerierLogic.js` (+test) | Pure engine: sessieopbouw, score, accuracy/WPM, streaks, zwakke toetsen, drills, ontgrendeling, contentvalidatie |
| `dataKoerierRoutes.js` (+test) | Alle content (13 routes + Toprit); automatisch gevalideerd op de tekensetregel |
| `dataKoerierVoortgang.js` | localStorage-records per route (per apparaat), geluidsvoorkeur |
| `dataKoerierSounds.js` | WebAudio-feedback (tik-toonladder per streak, bonus, fanfare, record) |
| `DataKoerierGame.jsx` | Routekaart, speelscene, typdoel, toetsenbordviz, eindscherm |

Scoring: 10 punten per in-één-keer-goed teken, 5 na een fout, +50 per 25-streak,
accuracybonus (+100 bij ≥97%, +50 bij ≥92%), Toprit-tijdsbonus in tredes (max +250,
alleen bij ≥90% accuracy). `maxScore` hoort bij de exacte sessie-inhoud (regels worden
per beurt uit grotere pools geschud, zodat herspelen fris blijft).

Tokens: serverdefault `{max: 200, basis: score_accuracy_completion, replayDecay: 0.5}`,
`maxPlays: 0` (onbeperkt oefenen, opbrengst halveert per beurt, plafond 200).

## Content toevoegen of aanpassen

Alle content staat in `dataKoerierRoutes.js` als puur data:

- Elke route heeft `nieuweToetsen` (cumulatief!), `hoofdletters` (vanaf route 7),
  en `blokken` met `{titel, type: 'reeks'|'woorden'|'zinnen', kies, pool}`.
- Per sessie worden `kies` regels uit elke pool geschud; pools moeten minimaal
  `max(6, 2×kies)` regels hebben en regels mogen alleen al geïntroduceerde tekens
  bevatten (spatie altijd toegestaan; hoofdletters alleen als `hoofdletters: true`).
- **`node --test src/games/dataKoerier/dataKoerierRoutes.test.js`** valideert dit
  allemaal automatisch — draai dit na elke contentwijziging.

## Higgsfield-assets

Gegenereerd op 2 augustus 2026 (model `nano_banana_2`, 1k), opgeslagen in
`public/games/data-koerier/`. Elke afbeelding heeft een ingebouwde CSS/emoji-fallback
in de component; het spel werkt volledig zonder deze bestanden.

| Bestand | Gebruik | Prompt-kern |
|---|---|---|
| `stad.webp` | Speelscene-achtergrond (Ken Burns-achtige subtiele beweging) | pastel digital city street, side-scrolling backdrop, lavender/periwinkle, no text |
| `koerier.png` | De koerier (transparante cutout; felle variant van 2 aug 2026 — cobalt blauw robotje, oranje/gele scooter — omdat de pastelversie wegviel tegen de stad; cutout lokaal via PIL flood-fill toen de Higgsfield-remover niet reageerde; CSS geeft een witte halo) | cute robot courier on hovering delivery scooter, BRIGHT vivid saturated colors, side view facing right |
| `trofee.webp` | Eindscherm bij gehaalde route | golden winged delivery parcel as trophy, pastel confetti |
| `mascotte.webp` | Startscherm/routekaart | robot courier waving next to oversized pastel keyboard |

Later door Higgsfield te vervangen/verbeteren (niet blokkerend):

- Koerier-sprite met 2-3 animatieframes (wielen/hover-glow) voor echt rijgevoel.
- Aparte achtergrondvarianten per routegroep (basisrij-wijk, cijferwijk, zinnen-snelweg).
- Korte Seedance-introvideo op de routekaart (zoals bij PacoPacMan).
- Boost-/turbo-effectsprite bij hoge streaks.

## Bekende beperkingen

- Het spel gaat uit van QWERTY (US-International), de standaard op Nederlandse
  school-Chromebooks. Op AZERTY-toetsenborden kloppen de vingeradviezen niet en zijn
  cijfers/@ via AltGr onbereikbaar (AltGr-aanslagen worden genegeerd).
- Het spel gebruikt, net als Turbo Typen en PacoPacMan, Tailwind-paletkleuren in plaats
  van de `--helix-*` CSS-variabelen uit de startgids §5 — bewuste bestaande drift bij de
  nieuwere spellen; los dit platformbreed op, niet per spel.

### Overige punten

- Routevoortgang (records/ontgrendeling) staat in localStorage en is dus per apparaat,
  niet per account. Tokens en lesvoortgang lopen wél gewoon via het platform.
- Het spel vereist een fysiek toetsenbord; op touch-only apparaten toont de routekaart
  een duidelijke waarschuwing.
- Eén route per speelbeurt (contract: één `onComplete` per sessie); de volgende route
  speel je in een nieuwe beurt.
