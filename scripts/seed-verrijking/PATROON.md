# Patroon voor een verrijkingsbestand

Hieronder staat de documentatiekop die in `scripts/seed-verrijking/h1.mjs`
stond, het kopieerpatroon van het oude curriculum. De regels over vragen,
afleiders en feedback gelden onveranderd voor de acht hoofdstukken van het
nieuwe jaarplan: elke bouwer leest dit voor hij vragen schrijft. Het volledige
oude bestand staat nog in `scripts/seed-verrijking/_oud/h1.mjs` en is het beste
voorbeeld van hoe een ingevulde paragraaf eruitziet.

## Drie leerwegen naast elkaar

Het vak wordt gevuld voor basis (`bb`), kader (`kb`) en theoretisch (`tl`):
dezelfde onderwerpen, een ander taalniveau en een andere vorm. Elke leerweg
heeft een eigen map:

```
scripts/seed-structuur/<niveau>/h<n>.mjs   structuur en lesstof
scripts/seed-verrijking/<niveau>/h<n>.mjs  leerdoelen, voorbeelden, vragen
```

Een verrijkingsbestand exporteert default een object met de paragraafcodes als
sleutels. Per leerweg wordt ALLES geladen wat er als `.mjs` in die map staat -
geen vaste lijst. `_oud/` valt erbuiten. Ontbreekt een bestand, dan bouwt de
seed gewoon door zonder die verrijking en meldt de generator het.

Welke paragrafen bij welke leerweg horen staat in
`scripts/seed-structuur/jaarplan.mjs`. Basis laat vier paragrafen vallen (2.4,
4.4, 6.1 en 7.4); de theoretische leerweg heeft er per hoofdstuk een
vrijwillige plusparagraaf bij.

## Optionele paragrafen

De plusparagraaf van de theoretische leerweg is VRIJWILLIG. In het
hoofdstukbestand markeer je hem met een optiesobject achter `p(...)`:

```js
p('1.6', 'Plus: hoe beschermt een wachtwoord jou eigenlijk?', ['21A', '23A'],
  'uitlegkaart over inloggen', 100, 'Sleutel en Slot',
  ['Kop A', 'Tekst A'],
  ['Kop B', 'Tekst B'],
  media(...), ['Check?'], 'Opdracht.', ['idee', 'idee', 'idee'],
  'Gamebeschrijving.', { optioneel: true })
```

Wat dat doet:

- het paragraafdocument krijgt `optioneel: true` en `verplicht: false`;
- de hoofdstukbadge eist de paragraaf niet;
- de hoofdstuktoets mag er geen vraag over stellen. Een toetsvraag met een
  `leerdoel` dat bij een optionele paragraaf van hetzelfde hoofdstuk hoort
  stopt de generator met een foutmelding, en de validator meldt hem ook als de
  vraag rechtstreeks in de seed of via de CMS is gezet;
- de app telt hem niet mee in het percentage dat een leerling van het hoofdstuk
  af moet hebben (`src/lib/chapterOutline.js` en `src/lib/progressSummary.js`).
  Wat er vrijwillig extra gedaan is staat apart in `progress.optioneelDone` en
  `progress.optioneelTotal`.

Tokens levert de plusparagraaf gewoon op: er moet iets tegenover staan. Een
checkpoint kan nooit optioneel zijn - dat is de hoofdstuktoets.

Voor de verrijking van een optionele paragraaf verandert er niets: dezelfde
leerdoelen, kernbegrippen, samenvatting en eigen afsluitquiz. Alleen de
hoofdstuktoets blijft eraf.

## Wat NIET in dit bestand hoort: startcheck, oefenblok en modelantwoord

Drie stappen uit de blauwdruk staan in het **structuurbestand**, niet hier. Ze
staan hieronder omdat je ze bij het schrijven van je vragen nodig hebt: een
toetsvraag hoort te passen bij wat de leerling ervoor geoefend heeft.

- **Startcheck** (`checks` in `scripts/seed-structuur/<niveau>/h<n>.mjs`). Een
  startvraag per leerdoel, met `{ vraag, antwoord, uitleg, leerdoel }`. De
  generator zet dat blok direct achter het slidedeck, dus vóór de theorie, klapt
  de uitleg dicht tot de leerling hem zelf opent en zet de Digidocent uit. Een
  vraag ná de theorie is een navraag en telt niet als startvraag.
- **Oefenblok** (`opties.oefenen`). Vier tot zes opgaven per paragraaf, verdeeld
  over `samen`, `zelf` en `steun` of `plus`, elk met een uitwerking die pas
  opengaat na de eigen poging.
- **Modelantwoord bij het bewijsproduct** (`assignment` als object met
  `modelAnswer` en `nakijkpunten`). Zonder modelantwoord kan de docent de
  praktijkopdracht niet nakijken en leveren de tokens zichzelf uit.

Vier keer per leerdoel is de lat: startvraag → oefening → afsluitvraag →
toetsitem. Kun je die vier niet aanwijzen, dan is het leerdoel niet af. Een
hoofdstuktoets bevraagt daarom elk verplicht leerdoel van het hoofdstuk, en
liefst twee keer; is dat aantal groter dan de 15 tot 20 vragen die de blauwdruk
als startwaarde noemt, dan wint de dekking van dat ronde getal. Zie
`scripts/seed-structuur/tl/h1.mjs` en `scripts/seed-verrijking/tl/h1.mjs` voor
een volledig uitgewerkt hoofdstuk.

## De zes mechanische controles: dit rekent de validator na

Uit 34 kritiekrondes over de theoretische leerweg kwamen 618 gebreken, en ruim
veertig procent daarvan was telbaar met code. Die veertig procent laat je niet
door een lezer opmerken: het staat er of het staat er niet. Sinds deze ronde
rekent `scripts/validate-digitale-vaardigheden-seed.mjs` ze na, en ze zijn
**hard** - één bevinding en de validator stopt met een foutcode. De controles
zelf staan in `src/lib/seedMechanischeControles.js`, met tests in
`src/lib/seedMechanischeControles.test.js`. Lees ze vóór je begint; dan hoef je
ze achteraf niet te repareren.

Draai na elke wijziging:

```
node scripts/generate-digitale-vaardigheden-seed.mjs
node scripts/validate-digitale-vaardigheden-seed.mjs
```

Het rapport groepeert de bevindingen per leerweg en per hoofdstuk, met de
paragraafcode in elke melding.

**1. Elk leerdoel krijgt zijn eigen startvraag** (95 keer gemeld). Startvragen
leveren winst op de stof waar naar gevraagd is, maar dat effect straalt niet uit
naar de rest. Twee steekproefvragen voor drie leerdoelen laten er dus één
onbevraagd. In `checks` van het structuurbestand staat per leerdoel een object
`{ vraag, antwoord, uitleg, leerdoel }`, en `leerdoel` is de leerdoelzin
**letterlijk** overgetypt uit `learningGoals`. Zonder dat veld kan niemand
aanwijzen welk leerdoel opgehaald wordt.

**2. Het goede antwoord is niet te raden op lengte** (58 keer gemeld). Per quiz-
of toetsblok wordt geteld in hoeveel gesloten vragen het goede antwoord strikt
langer is dan élke afleider. Boven de **40%** is dat een fout, met het
percentage in de melding. Waar-niet-waar telt niet mee, en onder de drie
meetbare vragen wordt er niet gemeten. Los je het op door de redengevende
bijzin naar `explanation` te verplaatsen, of maak de afleiders even lang.

**3. Elke afsluitquiz vanaf de tweede paragraaf kijkt terug** (42 keer gemeld).
Minstens één vraag in de quiz hangt aan een leerdoel van een **eerdere**
paragraaf van hetzelfde hoofdstuk. Spreiden is een van de twee technieken waar
de blauwdruk hard bewijs voor heeft; twee vragen over stof van vorige week zijn
meer waard dan twee extra vragen over vandaag. Zet het leerdoel van die vraag
op de leerdoelzin van die eerdere paragraaf, letterlijk overgetypt.

**4. De hoofdstuktoets dekt het hele hoofdstuk, behalve de plus** (32 keer
gemeld). Elk leerdoel van elke **verplichte** paragraaf van het hoofdstuk,
inclusief dat van het checkpoint zelf, komt minstens één keer terug in de toets.
De leerdoelen van de vrijwillige plusparagraaf mogen er juist **niet** in: wie
de plus overslaat mag niets missen dat later getoetst wordt. De validator meldt
precies welke leerdoelen ontbreken en welke er ten onrechte in staan.

**5. Geen kapotte en geen dubbele vragen** (12 keer gemeld). Een gesloten vraag
zonder goed antwoord wordt door de app stil gerepareerd door optie 1 goed te
rekenen, en een lege optietekst wordt stil aangevuld tot "Antwoord N" - dus
allebei fout. Verder: geen vraag waarin álle opties goed staan, geen lege
prompt, geen lege optietekst en geen open vraag zonder `modelAnswer`. En binnen
één hoofdstuk mogen geen twee vragen vrijwel hetzelfde vragen: prompts worden
genormaliseerd (zonder opmaak, leestekens en hoofdletters) en op woordoverlap
vergeleken; vanaf **85%** overlap is het dezelfde vraag opnieuw en geen tweede
meetmoment.

**6. De oefenlaag is gevuld** (7 keer gemeld). Elke gewone paragraaf - dus alles
behalve het checkpoint, de plusparagraaf inbegrepen - heeft in `opties.oefenen`
opgaven in de groep `samen` én in de groep `zelf`. Zonder die twee is de eerste
opgave met feedback die de leerling ziet meteen de afsluitquiz, en dan is er
tussen voordoen en beoordelen niets geoefend.

## De bewaarde documentatiekop

Let op: waar hieronder `scripts/seed-verrijking/h<n>.mjs` staat, lees
`scripts/seed-verrijking/<niveau>/h<n>.mjs`, en waar `1.6` als checkpointcode
genoemd wordt, geldt dat voor het checkpoint van het hoofdstuk waar je aan
werkt.

---

```text
Verrijkingslaag hoofdstuk 1 - Starten en Account & Veilig.

Dit bestand is het KOPIEERPATROON voor h2 t/m h5. Hoofdstuk 1 is inhoudelijk
af: elke paragraaf heeft leerdoelen, twee verrijkte theorieblokken, een
samenvatting en een volledige set toetsvragen. Wie hoofdstuk 2 gaat vullen,
kopieert de structuur van een paragraaf hieronder en vervangt de inhoud.

Per paragraafcode:
  learningGoals: 2 of 3 korte zinnen die beginnen met "Je weet ..." of "Je kunt ...".
  theorie: array met exact twee items, in dezelfde volgorde als de twee
           theorieblokken van die paragraaf in de generator.
    keyTerms:    2 tot 4 woorden die LETTERLIJK als los woord in die
                 theorietekst staan; de leesopmaak zet ze vet.
    exampleHtml: een uitgewerkt voorbeeld als vraag + antwoord. Het paneel
                 zet zelf al het label "Voorbeeld" erboven.
  samenvatting: de laatste leestekst voor de quiz of toets.
    html:     2 of 3 zinnen die de begrippen van die paragraaf herhalen, elk
              begrip letterlijk genoemd. Taalniveau B1, brugklas.
    keyTerms: verplicht zodra html gevuld is; elk woord staat letterlijk in
              die samenvatting. Een kernbegrip mag in de hele seed in
              maximaal twee blokken staan (validator bewaakt dat).
  vragen: de vragen van de afsluitquiz (paragraaf) of de hoofdstuktoets
          (checkpoint 1.6). ONTBREEKT deze lijst, dan komt er geen quiz in de
          leerlingroute: de generator zet dat blok op draft en noemt de
          paragraaf in de lijst onderaan de run. Er worden nooit vragen
          verzonnen.

FORMAAT van een vraag
---------------------
De veldnamen zijn gelijk aan die van de CMS-editor, zodat een vraag die in de
app is gemaakt hier ongewijzigd in geplakt kan worden.

  prompt        De vraag of stelling zoals de leerling hem leest. Verplicht.
  type          'meerkeuze' | 'waar-niet-waar' | 'open'. Mag weg: de generator
                leidt het type af uit de vraag (options -> meerkeuze,
                waar -> waar-niet-waar, modelAnswer -> open). Nooit uit de
                volgorde. Een prompt die begint met wat/waarom/hoe/welke/
                wanneer/wie of eindigt op een vraagteken kan geen
                waar-niet-waar-stelling zijn; de generator weigert dat.
  options       Gesloten vragen. 3 of 4 opties bij meerkeuze, elk met text en
                correct: true of false. Minstens een goede en minstens een
                foute. Optioneel per optie: explanation (waarom dit klopt) en
                misconception (welke denkfout hierachter zit).
  waar          Korte vorm voor waar-niet-waar: true of false. De generator
                maakt dan zelf de opties Waar en Niet waar.
  feedback      Wat de leerling na het antwoorden leest. Verplicht, minstens
                20 tekens, en per vraag anders. Dezelfde zin mag in hoogstens
                twee paragrafen staan.
  modelAnswer   Open vragen: wat er in een goed antwoord staat.
  nakijkpunten  Open vragen: 2 of 3 punten waar de docent op let. Ze komen als
                lijstje in het rubricveld van de nakijkstapel.
  leerdoel      Een van de learningGoals hierboven, letterlijk overgetypt.
                De toetsmatrijs in de CMS groepeert hierop, dus een vraag
                zonder leerdoel telt daar als "Geen leerdoel gekoppeld".
                Uitzondering: een hoofdstuktoets (1.6) toetst het hele
                hoofdstuk, dus daar mag het leerdoel ook uit een eerdere
                paragraaf van datzelfde hoofdstuk komen. Zo laat de matrijs
                van de toets zien welke hoofdstukdoelen echt bevraagd worden.
  denkniveau    Optioneel: herkennen | begrijpen | toepassen | uitleggen |
                maken_controleren. Standaard begrijpen (open: uitleggen).
  niveau        Optioneel: basis | plus | verdieping. Standaard basis.
  rol           Optioneel: ik_doe_voor | samen_oefenen | zelf_proberen |
                bewijs_leveren | reflecteren. Standaard zelf_proberen.
                Deze drie voeden samen met leerdoel de toetsmatrijs; laat je
                ze weg, dan lijkt elke vraag even zwaar.

Verder bewaakt de generator: het goede antwoord staat niet in elke gesloten
vraag van een blok op dezelfde plek, een quiz heeft minstens 3 vragen, een
toets minstens 6, en een blok bestaat niet alleen uit open vragen.

AFLEIDERS SCHRIJVEN
-------------------
Een foute optie is pas bruikbaar als een brugklasser hem echt kan kiezen.
Schrijf dus geen onzin ("de website wordt trager van hetzelfde wachtwoord")
maar de denkfout die je in de klas hoort ("ik hoef geen nieuwe map, ik weet
zelf wel welk bestand het is"). Zet die denkfout er letterlijk bij in
misconception: dan ziet de docent in de nakijkstapel niet alleen dat het fout
was, maar ook waarom. Bij het goede antwoord hoort een explanation die
uitlegt waarom dat antwoord klopt.

Waar-niet-waar mag op twee manieren. De korte vorm (waar: true/false) is de
standaard. Wil je de denkfout achter de foute knop vastleggen, schrijf dan
type: 'waar-niet-waar' met precies twee opties Waar en Niet waar, in die
volgorde; zie 1.2 vraag 2. De teksten moeten letterlijk Waar en Niet waar
zijn, anders herkent de validator het paar niet.
```
