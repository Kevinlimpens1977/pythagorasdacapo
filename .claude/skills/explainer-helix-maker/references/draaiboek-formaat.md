# Draaiboekformaat

Bestand: `video/public/hoofdstukken/<hoofdstukId>/draaiboek.json`. Het volledige
voorbeeld is dat van Binask H2 in dezelfde map onder
`hoofdstuk-binask-eoa-1-h2`.

## Lengte

- Tempo: ongeveer 14,6 tekens `uitspraak` (zonder audio-tags) per seconde (H2:
  28 regels, 352 woorden, 175,9 s echt).
- Zo is 350 woorden ongeveer 176 s van de 180. Schrijf liever korter.
- `controleer-draaiboek.mjs` schat met 14,5 tekens per seconde en de echte
  pauzes en scène-overgangen, en waarschuwt boven 175 s.
- Te lang? Schrap eerst een bijzin in de langste scène, dan een pauze. Nooit in
  de CHECK.

## Bovenste niveau

| Veld | Betekenis |
| --- | --- |
| `hoofdstukId` | Firestore-id van het hoofdstuk |
| `doelParagraafId` | paragraaf waar de video vóór de Samenvatting komt |
| `titel` | onderwerp, komt in de bloktitel "Uitlegvideo: ..." (alleen de eerste letter gaat klein; "DNS" blijft "DNS") |
| `kijkvraag` | één vraag die boven de video staat |
| `meta` | rechts in het titelvak, bijvoorbeeld "Binask H2" |
| `scenes` | lijst van scènes |

## Scène

| Veld | Betekenis |
| --- | --- |
| `id` | uniek, bijvoorbeeld `s3` |
| `kop` | max zes woorden, hoofdletters |
| `fase` | `KIJK`, `CHECK` of `KLAAR` |
| `indeling` | `FOCUS`, `SPLIT` of `STATUS` |
| `shot` | `{ naam, frames, startBij? }`; verplicht bij FOCUS en SPLIT. `frames: 1` is een still, meer is een reeks; `startBij` is de regel waarbij de reeks begint |
| `geluiden` | optioneel `[{ bestand, bij, na }]`; `na` in seconden na het begin van regel `bij` |
| `kernwoorden` | `[{ tekst, bij, accent? }]`, rechts in SPLIT |
| `getekend` | getekende onderdelen, zie hieronder |
| `regels` | wie zegt wat |

FOCUS toont het shot breed en Sami groot (met de uitdrukking van haar laatste
regel). SPLIT toont het shot links, `getekend` in het midden en `kernwoorden`
rechts, en een label met Sami's portret zolang zij spreekt. STATUS heeft geen
shot: de getekende onderdelen vullen het beeld.

## Regel

`{ id, spreker: "docent"|"sami", tekst, uitspraak, samiUitdrukking?, pauzeNa? }`.

- `samiUitdrukking`: `vragend`, `verbaasd`, `blij` of `nadenkend` (de vier
  portretten).
- `pauzeNa` in seconden; de CHECK-vraag krijgt 4.
- `uitspraak` mag beginnen met een audio-tag zoals `[curious]`.

## Getekende onderdelen

`bij` is altijd een regel-id in dezelfde scène: het onderdeel start bij het begin
van die regel. `tot` laat het verdwijnen bij het begin van een latere regel.

| type | velden |
| --- | --- |
| `weegschaal` | `items: [{ label, waarde }]`, `eenheid`; telt op in hele getallen en eindigt precies op `waarde`, met haar decimalen (`106.8` wordt 106,8) |
| `maatcilinder` | `van`, `naar?`, `max`, `stap`, `eenheid`, `stijgBij?`, `voorwerp?`, `labels?`, `oog?` |
| `formule` | `regels: [{ tekst, bij }]`; de eerste regel is groot en blauw |
| `driehoek` | `boven`, `linksOnder`, `rechtsOnder` (de drie symbolen), `formules` (precies drie) |
| `opgave` | `vraag[]`, `aftelBij`, `aftelSeconden`, `antwoord[]`, `antwoordBij`; **geen `bij`** |
| `kaarten` | `kaarten: [{ kop, regels[] }]` |

Een `maatcilinder` vult zich bij `bij` tot `van`. Met `naar` en `stijgBij` stijgt
het water bij die regel naar `naar`. Alleen met `"voorwerp": "steen"` valt er
dan een getekende steen in (H2, onderdompelmethode); zonder `voorwerp` stijgt
alleen het water. Een ander voorwerp bestaat nog niet: voeg het eerst toe in
`Maatcilinder.tsx` en in `VOORWERPEN` in `video/lib/draaiboek.mjs`.

Een `driehoek` is een formuledriehoek met afdekken. Het gele kaartje dekt om de
anderhalve seconde een ander symbool af, in deze volgorde: `linksOnder`, `boven`,
`rechtsOnder`. `formules` volgt dezelfde volgorde: de formule die overblijft als
dat symbool is afgedekt. H2 (dichtheid):

```json
{ "type": "driehoek", "bij": "s4-r7", "boven": "m", "linksOnder": "ρ", "rechtsOnder": "V",
  "formules": ["ρ = m / V", "m = ρ × V", "V = m / ρ"] }
```

Voor snelheid zou dat `boven: "s"`, `linksOnder: "v"`, `rechtsOnder: "t"` zijn,
met `["v = s / t", "s = v × t", "t = s / v"]`. Neem symbolen en formules altijd
over uit de lesstof.

Een `opgave` (CHECK) heeft geen `bij`: de vraag staat in beeld vanaf het begin
van regel `aftelBij`, de aftelbalk loopt vanaf het einde van die regel, en het
antwoord (groen) verschijnt bij het begin van `antwoordBij`. Zet `aftelSeconden`
gelijk aan `pauzeNa` van de vraagregel, zodat de stilte en de balk samenvallen.

## Wat de validator wel en niet controleert

`controleer-draaiboek.mjs` (via `video/lib/draaiboek.mjs`) controleert: alle
bovenste velden aanwezig, dubbele scène- en regel-id's, kop van hooguit zes
woorden, fase en indeling, een shot bij FOCUS en SPLIT, sprekers, tekst en
uitspraak aanwezig, geen emoji, geen "BiNaSk" in `uitspraak`, geldige
`samiUitdrukking`, en elke verwijzing (`bij`, `tot`, `stijgBij`, `aftelBij`,
`antwoordBij`, `startBij`, de `bij` van regels en kernwoorden) naar een regel in
dezelfde scène. Bij een `driehoek` eist hij `boven`, `linksOnder`, `rechtsOnder`
en precies drie `formules`; bij een `maatcilinder` alleen een bekend `voorwerp`.

De andere velden per getekend type controleert hij niet. Een fout daarin (een
vergeten `eenheid`, een `opgave` zonder `aftelBij`) zie je pas in Remotion. Draai
daarom altijd één still van de scène vóór je de hele video rendert. `getekend`
en `kernwoorden` mogen ontbreken: dan zijn ze leeg.

## Een nieuw type

Voeg een component toe in `video/src/onderdelen/`, een `case` in
`video/src/Scene.tsx`, en de velden die naar regels verwijzen in
`video/lib/draaiboek.mjs`. Zet geen vakinhoud (symbolen, formules, voorwerpen)
vast in het component: geef ze als velden in het draaiboek mee en laat de
validator ze eisen, zoals bij `driehoek`.
