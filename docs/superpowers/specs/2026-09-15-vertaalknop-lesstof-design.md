# Vertaalknop bij lesstof: leerling leest in zijn moedertaal

Ontwerp, 15 september 2026. Afgestemd met Kevin.

## Waarom

In ER3L1A zitten een Griekse en een Italiaanse leerling. Zij lezen dezelfde
Nederlandse theorie en vragen als de rest en lopen daarop vast, niet op de stof.
Er moet een knop komen waarmee ze kunnen wisselen tussen het Nederlandse
origineel en hun eigen taal.

Kevin heeft gekozen voor een voorziening die voor élke leerling met een
ingestelde taal werkt, in alle lesstof, zodat de volgende nieuwkomer geen nieuw
bouwtraject is.

## Wat het niet is

Bewust buiten dit ontwerp, om het klein en af te houden:

- **Geen vertaling van slidedecks, media of spellen.** Dat is beeld, geen tekst
  die we kunnen omzetten. Alleen theorie, vraagteksten, antwoordopties en de
  inleiding van een toets- of quizblok gaan mee.
- **Geen automatische taalherkenning.** De docent zet de taal, verder niets.
- **Geen talen die van rechts naar links lopen.** Grieks en Italiaans lopen net
  als het Nederlands van links naar rechts. Arabisch zou opmaakwerk vragen dat
  hier niet in zit; dat is een apart traject.
- **Geen vertaling van wat de leerling zelf schrijft.** Zie "Open vragen".

## Aanpak: vertalen bij het eerste gebruik, daarna bewaren

Drie manieren lagen voor: alles vooraf vertalen met een script, alles live
vertalen bij elke druk op de knop, of vertalen bij het eerste gebruik en het
resultaat bewaren. De derde is gekozen.

Vooraf vertalen levert verouderde tekst zodra Kevin een les aanpast, en het
vraagt dat iemand onthoudt het script opnieuw te draaien. Live vertalen kost bij
elke druk op de knop een paar seconden op schoolwifi en levert elke keer een
andere formulering.

Bij vertalen-en-bewaren wacht alleen de eerste leerling op een blok; daarna is
het voor iedereen meteen klaar. Bij de vertaling leggen we een vingerafdruk van
de Nederlandse brontekst vast. Past Kevin die tekst aan, dan klopt de
vingerafdruk niet meer en wordt er opnieuw vertaald. Zo kan een vertaling niet
stil verouderen. Wil Kevin een hoofdstuk vóór de les klaarzetten, dan draait
hetzelfde pad als script vooruit.

## Gegevens

### Taal bij de leerling

`users/{uid}.lesTaal`: een taalcode volgens ISO 639-1, of leeg.

- Leeg betekent: geen knop, geen gedragsverandering. De leerlingen die nu op
  HELIX werken merken niets.
- Voor nu twee waarden in de keuzelijst: `el` (Grieks) en `it` (Italiaans).
  De lijst staat in `src/lib/lesTaal.js`, zodat er een taal bij kan zonder dat
  er verder iets verandert.
- Te zetten in Beheer bij de leerling, naast de klas.

### Bewaarde vertaling

`vertalingen/{blockId}__{taal}`:

| veld | betekenis |
| --- | --- |
| `blockId`, `taal` | waar de vertaling bij hoort |
| `bronVingerafdruk` | hash over de genormaliseerde brontekst uit de leerlingversie |
| `titel`, `html` | vertaalde bloktitel en tekst |
| `items` | per vraag `{ id, prompt, options: [{ id, text }] }` |
| `bron` | `ai` of `docent` |
| `gecontroleerd` | door Kevin nagekeken, ja of nee |
| `verouderd` | bron is gewijzigd terwijl de vertaling nagekeken was |
| `model`, `gemaaktOp`, `bijgewerktOp` | herkomst |

De kenmerken van vragen en antwoordopties blijven ongewijzigd. Alleen zichtbare
tekst wordt vervangen, nooit een kenmerk waar het nakijken op draait.

## Cloud Function `vertaalLesblok`

Callable in `europe-west1`, naast `askAiTutor`.

**Invoer:** `{ blockId, taal }`. **Uitvoer:** de vertaling, of een nette melding.

Stappen:

1. Ingelogd, en de leerling heeft dit blok toegewezen, via de bestaande
   `assertAssessmentBlockAssignedToCaller` uit `functions/index.js`. Zo kan een
   leerling geen lesstof van een andere klas opvragen, en staat er geen tweede
   waarheid over toegang naast de eerste.
2. Lees **uitsluitend** de leerlingversie uit `publicContentBlocks`. Nooit het
   blok uit `contentBlocks`.
3. Bereken de vingerafdruk. Is er een bewaarde vertaling met dezelfde
   vingerafdruk, geef die terug en stop.
4. Is de bewaarde vertaling nagekeken door Kevin maar klopt de vingerafdruk
   niet meer, geef hem terug met `verouderd: true`. Overschrijf werk van de
   docent nooit stilzwijgend.
5. Anders: vertaal, bewaar, geef terug.

De opdracht aan het model is strak: zet alleen de zichtbare tekst om, laat de
HTML-structuur en alle kenmerken staan, beantwoord de vragen niet, en verzin
niets bij.

**Waarom alleen de leerlingversie.** In het blok uit `contentBlocks` staat de
antwoordsleutel. Die hoort niet bij een vertaler en niet in een bewaard
document dat elke leerling mag lezen. `publicContentBlockView.js` haalt de
sleutel er al af voor de leerlingroute; dat is hier dezelfde grens en die rekken
we niet op.

## Beveiligingsregels

`vertalingen/{id}`: lezen mag elke ingelogde gebruiker, schrijven alleen een
beheerder. De Cloud Function schrijft met de Admin SDK en valt buiten de regels.

Let op de les van 11 september: een regel die op `resource.data` leunt, laat
wel een enkel document opvragen maar geen lijstquery toe. De leerlingroute
vraagt per blok één document op, dus dat is hier geen probleem. Het
docentoverzicht lijst wel op, en die regel moet daarom op een voorwaarde staan
die zonder `resource` te toetsen is.

## In de leerlingroute

**Eén schakelaar per pagina**, boven in de les: Nederlands of de eigen taal. Hij
zet alles op het scherm tegelijk om. Een knopje bij elk tekstblok maakt de
pagina rommelig en onderbreekt het lezen.

- De keuze blijft staan tijdens het bladeren door de les en na een verversing,
  bewaard per leerling in `localStorage`. Niet in Firestore: het is een
  voorkeur van het moment, geen gegeven waar de docent iets aan heeft.
- Tijdens het ophalen blijft de Nederlandse tekst staan met een melding dat de
  vertaling geladen wordt. Nooit een leeg scherm.
- Mislukt het vertalen, dan blijft de Nederlandse tekst staan met een melding.
  De les gaat altijd door.

Pure hulpjes in `src/lib/lesTaal.js`, met tests:

- `beschikbareTalen()` en `taalLabel(code)`
- `magVertalen(user)`
- `bronVingerafdruk(publiekBlok)`
- `voegVertalingSamen(blok, vertaling)`: legt de vertaalde tekst over het blok
  en laat kenmerken, antwoordgegevens en volgorde ongemoeid

## Open vragen: het antwoord blijft Nederlands

Kevin heeft besloten dat een leerling zijn antwoord in het Nederlands schrijft.
Daarmee blijft het hele nakijkpad ongewijzigd, inclusief het modelantwoord en
de beoordeling op de server.

Onder een vertaalde open vraag komt daarom een vaste regel in de taal van de
leerling: *schrijf je antwoord in het Nederlands*. Die zin komt uit een klein
woordenboek in de code, niet uit het model, zodat hij altijd klopt.

Meerkeuze en waar-niet-waar vragen geen aanpassing: de leerling klikt op een
keuze met een vast kenmerk, en alleen het label is vertaald.

## Nakijken door de docent

In het beheer per blok een paneel met bron en vertaling naast elkaar. Kevin kan
de vertaling aanpassen; opslaan zet `bron: docent` en `gecontroleerd: true`.
Vanaf dat moment overschrijft de machine die tekst niet meer, maar meldt bij een
gewijzigde bron dat hij nagelopen moet worden.

## Testen

- Pure hulpjes met `node --test`: vingerafdruk blijft gelijk bij dezelfde tekst
  en verandert bij gewijzigde tekst, samenvoegen behoudt kenmerken en
  antwoordgegevens, de Nederlandse-antwoordregel verschijnt alleen bij open
  vragen.
- Functietest naast de bestaande set: de vertaalfunctie krijgt nooit de
  antwoordsleutel mee, en kenmerken overleven de vertaling.
- In de browser is dit niet als leerling te testen, want de dev-login geeft geen
  Firebase-sessie. Dus: bundlecontrole na deployen en een laatste check door
  Kevin met een echte leerling.

## Volgorde van bouwen

1. Taalveld bij de leerling en de keuzelijst in het beheer.
2. Pure hulpjes met hun tests.
3. Cloud Function plus beveiligingsregel.
4. Schakelaar en weergave in de leerlingroute.
5. Nakijkpaneel voor de docent.
6. Uitrollen: eerst Binask voor de twee leerlingen van ER3L1A, daarna de rest.

Na stap 4 is de voorziening bruikbaar voor de klas. Stap 5 kan daarna.

## Wat dit kost

Binask is ongeveer 19.000 tekens, het hele platform 407.000. Omdat er pas
vertaald wordt wat een leerling echt opent, blijft het gebruik ver onder dat
laatste getal. Een vertaling wordt één keer gemaakt en daarna door iedereen
gedeeld.
