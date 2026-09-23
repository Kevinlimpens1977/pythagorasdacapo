# Spelopzet (PRD): VOLUME BEREKENEN

> Spel voor Binask, hoofdstuk 2 "Massa, volume en dichtheid", paragraaf 2.2 Volume.
> Doelgroep: klas 1 vmbo, de EOA-klassen ER3L1A en ER3L2A.
> Versie 1, 23 september 2026. Dit document is voor review. Er is nog geen code geschreven.

## 1. Waarom dit spel

In 2.2 leren leerlingen drie vaardigheden. Die staan als leerdoelen in
`docs/seeds/binask-h2-massa-volume-dichtheid.json` (paragraaf `paragraaf-binask-eoa-1-2-2`):

| Leerdoel uit 2.2 | Missie in het spel |
|---|---|
| Je kunt volume lezen in ml en cm³. | Missie 1: Lees de maatcilinder |
| Je kunt het volume van een blok berekenen. | Missie 2: Meet en bereken de balk |
| Je kunt het volume van een onregelmatig voorwerp meten met water. | Missie 3: Dompel onder |

De les en de presentatie leggen het uit en laten één voorbeeld per vaardigheid zien.
Het spel laat de leerling het zelf **doen**, vaak en met steeds andere schalen.
Het spel volgt dezelfde route als de presentatie: eerst voorbeelden (KIJK), dan zelf
oefenen (DOE), dan controleren (CHECK), dan afronden (KLAAR).

## 2. Wat ik bij de referenties heb gezien

Ik heb elke site geopend en gespeeld. Per site: de logica, de variatie, en wat we
wel en niet overnemen.

### 2.1 RulerGame, Graduated Cylinder Game

Bron: rulergame.net/graduated-cylinder-game.php. Ik heb de broncode gelezen
(`graduated_cylinder.js`).

- **Cilinders en streepjes.** 10 ml (streepje 0,2 ml), 25 ml (0,5 ml), 50 ml (1 ml),
  100 ml (1 ml), of willekeurig.
- **Nakijken in streepjes, niet in kommagetallen.** Antwoord en juiste waarde worden
  omgezet naar "aantal streepjes" en als geheel getal vergeleken. Zo bestaat er geen
  afrondingsfout zoals 7,8000001.
- **Opgaven liggen altijd precies op een streepje.** Nooit op 0 en nooit helemaal bovenaan
  (10 ml: 1,0-9,0; 100 ml: 10-99). Nooit twee keer dezelfde opgave achter elkaar.
- **Drie modi.**
  - Find: je krijgt een volume en zet de vloeistof op die hoogte met klikken, plus en min,
    of het muiswiel.
  - Type: de cilinder staat vast en je tikt het volume in op een cijferpad.
  - Training: de huidige waarde staat in beeld.
- **Spelvorm.** Na elke 5 goede antwoorden ga je een level omhoog. Level 1 geeft 10 punten
  en 10 seconden. Level 10 geeft 100 punten en 1 seconde. Bij een fout of als de tijd op is
  krijg je een strike. Na 3 strikes is het spel voorbij. Een timer kun je uitzetten.
- **Feedback bij fout.** Jouw antwoord in rood naast "het juiste antwoord was ...".
  De cilinder blijft 2,5 seconde staan.

**Overnemen:** nakijken in streepjes, opgaven op een streepje, Find- en Type-modus,
plus/min-knoppen voor precisie, level omhoog na een reeks goede antwoorden.
**Niet overnemen:** strikes en een steeds kortere timer. Snelheid is hier geen leerdoel
(design system p.16). Een aflopende timer maakt precies aflezen juist slordiger.

### 2.2 Stark Science, Volume Measurement

Bron: jasonstark.com/science/measure-volume (Construct 3).

- **Drie cilinders.** 500 ml (streepje 5 ml), 100 ml en 10 ml. Twee goede metingen per
  cilinder, zes in totaal om af te ronden.
- **Eerst een uitgewerkt voorbeeld** op het beginscherm: "De streepjes zijn 5 ml. Het
  niveau ligt tussen 455 en 460, net onder 460, dus 459 ml." Ook: "Lees af aan de
  onderkant van de meniscus."
- **Ingezoomd beeld.** Na "Begin" loopt de cilinder vol. Dan zoomt het beeld in op het
  stuk rond de meniscus. De streepjes zijn dan groot en goed te zien. Dit werkt heel goed.
- **Eenheid is verplicht.** Ik vulde "425" in zonder eenheid. Dan komt: "Include units (ml)".
- **Streng.** Ik antwoordde 479 ml, het juiste antwoord was 478 ml. Dat telde als fout.
  Na een fout krijg je een nieuwe meting.
- **Schatten tussen de streepjes.** Stark gebruikt de Amerikaanse regel: lees af tot op
  één geschat cijfer voorbij het kleinste streepje.

Stark heeft ook een **lengte-oefening** (measure-length). Daarin sleep je een doorzichtige
liniaal over een rood blok. Goed als je binnen 0,015 cm zit. Je moet er vijf achter elkaar
goed hebben. Bij één fout begin je opnieuw.

**Overnemen:** voorbeeld vooraf, ingezoomd beeld van de meniscus, eenheid verplicht,
doorzichtige versleepbare liniaal voor missie 2.
**Niet overnemen:** schatten voorbij het kleinste streepje. In de Nederlandse onderbouw lees
je af op een streepje (of een half streepje). Zie open vraag 2. Ook niet: opnieuw beginnen
na één fout. Dat is te hard voor klas 1.

### 2.3 Effortless Math, Volume Practice

Bron: effortlessmath.com/math-topics/practice-volume (volledig scherm:
`practice_volume-2.html`).

- **Oneindig veel opgaven** met balken, kubussen en driehoekige prisma's. Moeilijkheid
  Makkelijk, Gemiddeld of Moeilijk.
- **Teller bovenin:** beantwoord, goed, percentage, reeks (streak), beste reeks.
  "10 op rij = beheerst."
- **Uitwerking bij een fout.** Ik vulde 24 in bij een kubus met ribbe 8. Antwoord:
  "Niet helemaal, het is 512", met drie stappen: formule, invullen, uitrekenen.
- **Pop-upcheck bij de les:** drie meerkeuzevragen. Bij een fout antwoord een korte zin
  waarom ("10 keer 6 is 60").
- **Veelgemaakte fout in de uitleg:** afmetingen optellen in plaats van vermenigvuldigen.
- **Badges** (eerste goed, 5 op rij, 10 op rij, comeback) en voortgang in de browser.

**Overnemen:** stap-voor-stap uitwerking bij een fout, reeksteller, de "opgeteld in plaats van
vermenigvuldigd"-herkenning, omgekeerde opgaven (volume en twee maten gegeven, zoek de hoogte).
**Niet overnemen:** badges met emoji. Badges worden hooguit lucide-iconen.

### 2.4 GeoGebra, Volume of a Rectangular Prism

Bron: geogebra.org/m/HMepNNjV.

- Drie schuifjes: rijen (lengte), kolommen (breedte), lagen (hoogte). De balk bestaat uit
  losse kubusjes van 1 bij 1 bij 1.
- Knoppen "Spin" (draaien in 3D), "Random" (nieuwe balk) en "Show Answer".
- Een vakje "Cubes on bottom layer": eerst de onderste laag tellen, dan keer het aantal lagen.

**Overnemen:** het idee van de onderste laag. In het voorbeeld van missie 2 vullen we de balk
met kubusjes van 1 cm³: eerst de bodemlaag (5 × 3 = 15), dan laag voor laag (× 2 = 30).
Zo zie je waarom de formule klopt.
**Niet overnemen:** vrij draaien in 3D. Dat vraagt een 3D-bibliotheek, en het helpt niet bij
aflezen of rekenen. Een vaste schuine tekening (isometrisch) is genoeg.

### 2.5 ACS, Water Displacement

Bron: acs.org/middleschoolchemistry, les 3.2. De site blokkeert automatische bezoekers.
Ik heb de simulatie via de bestandslocatie op assets.acs.org geopend en frame voor frame
bekeken.

Het is een lineair verhaal met Volgende en Terug:

1. Cilinder van 100 ml met 60 ml water. Voorwerp ernaast.
2. Afspelen: het voorwerp zakt in het water. Nieuw niveau 72 ml.
3. Op het scherm: "Beginvolume 60 ml of 60 cm³. Eindvolume 72 ml of 72 cm³.
   Volume = eind - begin. 72 - 60 = 12 cm³."
4. Massa op een weegschaal: 60 g.
5. Dichtheid: 60 g / 12 cm³ = 5 g/cm³.
6. Zijstap "1 cm³ = 1 ml": een kubusje van 1 cm³ gaat in het water en het niveau stijgt
   precies 1 ml.

**Overnemen:** de vaste volgorde begin, erin, eind, aftrekken. Bij elke stand zowel ml als cm³.
De kubusjes-demo "1 cm³ = 1 ml" als brug tussen missie 2 en 3.
**Niet overnemen:** massa en dichtheid. Dat is paragraaf 2.3. Wel de techniek zo bouwen dat
een latere dichtheidsmissie erop kan aansluiten.

### 2.6 Dichtheidslab (in je lijst "AZRS Density Lab")

Een tool met de naam "AZRS" heb ik niet kunnen vinden. Er zijn twee gratis labs zonder account
die precies doen wat je beschrijft. Die heb ik allebei gespeeld.

**Stark Science, Mass-Volume Lab met onderdompelen** (jasonstark.com/science/mass-volume2):

- Kies een stof: aluminium, staal, hout, koper, zink of lood. "New Size" geeft een blok met een
  andere grootte.
- Sleep de liniaal over het blok om te meten. Sleep het blok in de maatcilinder. Sleep het op
  de weegschaal.
- Het waterniveau staat als getal naast een pijltje. Aluminiumblok: 700 ml naar 1263 ml,
  dus 563 cm³. De leerling hoeft niet zelf af te lezen.
- **Hout drijft.** Het houten blok bleef bovenop liggen: 700 ml naar 717 ml, terwijl het blok
  veel groter was. De maker schrijft dat dit een goed gespreksmoment is: wat meet je eigenlijk
  als het voorwerp niet helemaal onder water zit?
- Tip van de maker: meet een blok eerst met de liniaal en dompel het daarna onder. Dan zie je
  dat cm³ en ml hetzelfde getal geven.

**SimBucket, Density Lab** (ook via PBS LearningMedia):

- Bekerglas met niveaupijl (25,5 ml), weegschaal, schuifjes voor massa en volume.
- Stoffen: goud, lood, schuim, ijs, ijzer, hout, rubber en een mysteriestof "?????".
- Een schuif voor de dichtheid van de vloeistof, en een knop "Randomize".

**Overnemen:** de valkuil van het drijvende voorwerp, "eerst meten, dan onderdompelen" als
controle, slepen van voorwerp naar cilinder.
**Niet overnemen:** het niveau als kant-en-klaar getal. Bij ons leest de leerling zelf af.
Zo komt missie 1 terug in missie 3. De mysteriestof bewaren we voor 2.3 Dichtheid.

### 2.7 De rode draad

| Wat werkt | Waar gezien | In ons spel |
|---|---|---|
| Eerst een uitgewerkt voorbeeld, dan zelf | Stark, ACS, les 2.2 | KIJK-fase per missie, met de voorbeelden uit de presentatie |
| Ingezoomd beeld bij kleine streepjes | Stark | Loep bij de meniscus |
| Nakijken in hele streepjes | RulerGame | Kern van de logica |
| Eenheid verplicht | Stark | Eenheid kiezen hoort bij elk antwoord |
| Uitwerking bij een fout | Effortless Math | Foutspecifieke feedback + stappen |
| Streak en level omhoog | RulerGame, Effortless | Na 3 goed op rij een lastigere schaal |
| Lagen van kubusjes | GeoGebra | Voorbeeld in missie 2 |
| Vaste volgorde begin, erin, eind, aftrekken | ACS, les 2.2 | Missie 3 |
| Drijvend voorwerp als valkuil | Stark Mass-Volume | Valkuilopgave in missie 3 |

## 3. Stijl: zoals de presentatie van 2.2

Het spel ziet eruit als de presentatie `h2-2.2-volume.pdf` (16 dia's) en volgt het
Helix Slide Design System v2. De tokens staan al in `src/index.css`.

### 3.1 Wat ik uit de presentatie overneem

- **Gele titelbalk** bovenaan elk scherm, met zwarte onderrand, kop in hoofdletters en in
  het comicfont. Voorbeelden uit het deck: "VLOEISTOF METEN: DE MAATCILINDER",
  "BLOK BEREKENEN: DE FORMULE", "VOORWERP: ONDERDOMPELMETHODE".
  In code: `.ds-anchor` en `.ds-display`.
- **SPLIT-indeling:** links het beeld (ongeveer 65%), rechts een crème paneel met korte tekst.
  Zo zijn dia 5 tot 8 opgebouwd.
- **Het paar "Samen op het bord" en "Controleer je antwoord".** Eerst de opgave met
  "Schrijf op: formule, invullen". Daarna een STATUS-scherm met het antwoord groot in groen
  ("30 cm³", "12 ml = 12 cm³") en een groene gloed. Dat wordt ons CHECK-scherm na een goed
  antwoord.
- **Genummerde stappen** 1 tot 4 zoals dia 7 (onderdompelmethode), met gele nummerbolletjes.
- **Werktafel met houtnerf en lucht met snelheidslijnen** als achtergrond van het beeldvlak.
- **Afsluiting "KLAAR! WAT HEB JE GELEERD?"** met de lijst van wat je kunt. Dat wordt ons
  eindscherm.
- **Schrijfwijze:** `ml` (klein), `cm³`, `l`, `dm³`. Decimale komma: 7,4 ml. Formules zoals
  in het deck: `V = lengte × breedte × hoogte` en `V = V eind - V begin`.

### 3.2 Regels uit het design system

- Kleuren: inkt `#0B0D0F`, papier `#FFF7E8`, geel `#FFD33D`. Daarnaast per scherm hoogstens
  twee accentkleuren: **blauw** `#087EB5` voor actie en uitleg, **groen** `#2E9D63` voor goed.
  **Rood** `#D83A2E` alleen voor een fout antwoord. **Oranje** `#F47A20` alleen voor de
  hulpvlag. Water is lichtblauw, zoals in het deck.
- Fonts: precies twee. Bangers voor koppen van hoogstens zes woorden en minimaal 22 px.
  Atkinson Hyperlegible Next voor al het andere, ook knoppen en invoer.
- Fase-label per scherm: KIJK, DOE, CHECK of KLAAR. HULP is een vlag (oranje knop "Hint"),
  geen fase.
- Eén opdracht per scherm, met een zichtbaar succescriterium ("Gelukt als het groene vinkje
  verschijnt").
- Kleur is nooit de enige drager: goed heeft ook een vinkje en tekst, fout ook een kruis en
  tekst.
- Geen emoji. Iconen uit lucide-react of eigen SVG.
- Geen timer in de basisroute (design system p.16: niet bij detaillezen).
- Toon: werkwoord vooraan, rustig, hoogstens één uitroepteken. "Lees de maatcilinder af."
  "Kijk naar de onderkant van de meniscus." Geen schuldtaal bij een fout.

### 3.3 Instrumenten zijn SVG, geen AI-beeld

De maatcilinders, de liniaal en de balken tekenen we zelf in SVG. Dat moet, want elk streepje
moet op de juiste plek staan (design system p.17: een overtuigend AI-beeld is geen bewijs).
Ook in de presentatie klopt de schaal niet overal. Dia 5 toont een bekerglas met tuit, en de
streepjes zijn decoratief. In het spel moet de schaal exact zijn.

De SVG's krijgen de comicvormtaal van het deck: dikke zwarte contour (3 px), glas met lichte
glans, blauw water, zachte schaduw. Decor zoals de werktafel, de lucht, de steen, de sleutel
en de knikker mag een gegenereerd beeld zijn, zonder tekst erin (design system p.14).

### 3.4 Schermindeling

**Laptop en digibord (breed):**

```
+------------------------------------------------------------------+
| LEES DE MAATCILINDER                    [DOE]   Opgave 4 van 10  |  <- gele balk
+-------------------------------------------+----------------------+
|                                           |  Hoeveel ml zit er   |
|   [werktafel + lucht]                     |  in de maatcilinder? |
|                                           |                      |
|        maatcilinder (SVG)   [loep]        |  [ 7,4 ] [ml v]      |
|                                           |                      |
|                                           |  [Controleer]        |
|                                           |  [Hint]              |
+-------------------------------------------+----------------------+
|  Reeks: 3 goed op rij        Schaal: 10 ml, streepje = ?         |
+------------------------------------------------------------------+
```

**Telefoon (360 px):** gele balk, daaronder het beeld (cilinder en loep naast elkaar),
daaronder het paneel. Knoppen minstens 44 px hoog. Geen horizontaal scrollen.

## 4. De drie missies

Elke missie heeft dezelfde vier fasen:

1. **Start (ROUTE):** doel in één zin en de route KIJK - DOE - CHECK - KLAAR.
2. **KIJK:** twee of drie voorbeelden uit de presentatie. De leerling klikt mee door de stappen.
   Wie de missie al eens gespeeld heeft, kan KIJK overslaan (knop "Voorbeelden overslaan").
3. **DOE:** tien opgaven die steeds lastiger worden. Na elke opgave direct CHECK.
4. **KLAAR:** score, wat je beheerst, en één tip als je een fout vaker maakte.

Eén missie duurt zes tot acht minuten. Dat past bij de startgids (vijf tot zes minuten per spel)
met een klein beetje extra voor de voorbeelden.

### 4.1 Missie 1: Lees de maatcilinder

**Leerdoel:** je leest een maatcilinder precies af, met de juiste eenheid.

**KIJK (drie voorbeelden):**

1. *Het voorbeeld uit het deck: 35 ml in een cilinder van 50 ml.* De leerling doorloopt
   de aflesroute, die in elke opgave terugkomt:
   - Stap 1: Zoek twee getallen op de schaal (30 en 40).
   - Stap 2: Tel de stappen ertussen (10 stappen).
   - Stap 3: Eén streepje is (40 - 30) : 10 = 1 ml.
   - Stap 4: Lees af bij de **onderkant** van de meniscus: 35 ml. Dat is ook 35 cm³.
   De leerling tikt zelf de twee getallen aan. De stappen lichten één voor één op.
2. *De meniscus.* Een loep toont het gebogen wateroppervlak. Drie lijnen: bovenrand, midden,
   onderkant. De leerling kiest de juiste (A, B of C, zoals de multipanelregel).
3. *Je oog op de goede hoogte.* Drie oogposities: te hoog, gelijk met het water, te laag.
   Kies waar je oog moet zijn. Bij te hoog of te laag lees je een verkeerde waarde af.

**DOE (tien opgaven).** De leerling begint bij een makkelijke cilinder. Na drie goede antwoorden
op rij komt de volgende cilinder. Na twee fouten op rij krijgt de leerling eerst een vraag over
de streepjeswaarde (zie opgavevormen).

| Stap | Cilinder | Getallen op de schaal | Eén streepje | Voorbeeldopgave |
|---|---|---|---|---|
| 1 | 100 ml | elke 10 ml | 1 ml | 74 ml |
| 2 | 50 ml | elke 10 ml | 1 ml | 38 ml |
| 3 | 10 ml | elke 1 ml | 0,2 ml | 7,4 ml |
| 4 | 25 ml | elke 5 ml | 0,5 ml | 17,5 ml |
| 5 | 250 ml | elke 50 ml | 2 ml | 186 ml |
| 6 | 500 ml | elke 50 ml | 5 ml | 435 ml |
| 7 | 1 l (1000 ml) | elke 100 ml | 10 ml | 730 ml = 0,73 l |
| 8 | 1 ml (maatspuit) | elke 0,1 ml | 0,01 ml | 0,37 ml |

Stap 8 is het meesterniveau. Zie open vraag 3.

**Opgavevormen** (door elkaar):

- **Aflezen** (RulerGame Type, Stark): lees af, typ het getal, kies de eenheid.
- **Vullen** (RulerGame Find): "Vul de maatcilinder tot 17,5 ml." Klik op de hoogte en stel bij
  met de plus- en minknoppen. De plus en min verzetten precies één streepje. Ook pijltjestoetsen.
- **Streepjeswaarde:** "Hoeveel ml is één streepje op deze maatcilinder?" Keuze uit vier
  waarden (0,1 / 0,2 / 0,5 / 1 ml).
- **Wie heeft gelijk?** "Sam leest 46 ml af. Noor leest 45 ml af. Wie heeft gelijk en waarom?"
  De foute keuze is altijd een echte denkfout: bovenrand van de meniscus, streepje als 1 ml
  geteld, of verkeerd oog.
- **Omrekenen** (bij stap 7): "Hoeveel liter is dit?" 730 ml = 0,73 l.

**Nakijken:**

- Een opgave ligt altijd precies op een streepje. Nooit op 0, nooit op de bovenste streep.
  Nooit twee keer dezelfde waarde achter elkaar.
- Het antwoord wordt omgezet naar aantal streepjes en als geheel getal vergeleken (RulerGame).
- De eenheid moet kloppen. `ml` en `cm³` zijn allebei goed; `l` alleen als het getal ook
  omgerekend is.
- Invoer accepteert komma en punt: "7,4" en "7.4" zijn gelijk.

**Foutherkenning en feedback** (CHECK na een fout):

| Wat de leerling deed | Hoe we het herkennen | Feedback |
|---|---|---|
| Bovenkant van de meniscus gelezen | Antwoord = juiste waarde + 1 streepje | "Je keek naar de bovenkant. Lees af bij de onderkant van de meniscus." De loep toont beide lijnen. |
| Elk streepje als 1 geteld | Antwoord past bij streepjeswaarde 1 terwijl die 0,2 of 0,5 is | "Tel eerst hoeveel ml één streepje is." De vier stappen van de aflesroute verschijnen. |
| Verkeerde eenheid of geen eenheid | Getal goed, eenheid fout | "Het getal klopt. Welke eenheid hoort erbij?" Telt als half goed. |
| Een label verkeerd gelezen | Antwoord 10 of 100 te veel of te weinig | "Kijk nog eens naar de getallen op de schaal." |
| Iets anders | Geen patroon | Jouw lijn in rood, de juiste lijn in groen, en de aflesroute met de getallen van deze cilinder. |

### 4.2 Missie 2: Meet en bereken de balk

**Leerdoel:** je meet lengte, breedte en hoogte met een liniaal, berekent het volume in cm³ en
rekent om naar ml.

**KIJK (drie voorbeelden):**

1. *Kubusjes van 1 cm³ (GeoGebra-idee).* Het blokje uit "Samen op het bord 1": 5 cm lang,
   3 cm breed, 2 cm hoog. De bodem vult zich met 5 × 3 = 15 kubusjes. Dan komt een tweede laag:
   15 × 2 = 30 kubusjes. Dus V = 5 × 3 × 2 = 30 cm³.
2. *Meten met de liniaal.* De baksteen van dia 6 (6 cm, 2 cm, 3 cm). De liniaal schuift met de
   nul tegen de rand. "Leg de 0 tegen de rand, niet de 1." Uitkomst V = 6 × 2 × 3 = 36 cm³.
3. *Omrekenen.* Het doosje van 8 × 4 × 3 = 96 cm³. Omdat 1 cm³ = 1 ml, past er 96 ml in.

**DOE (acht blokken).** Per blok vier stappen op één scherm, van boven naar beneden:

1. **Meet.** De balk staat schuin getekend. De ribbe die je moet meten licht op. Daarnaast staat
   het vlak recht van voren (voor lengte en hoogte) of van boven (voor breedte). Daar leg je de
   doorzichtige liniaal langs. Meten op een schuine tekening is niet eerlijk. De maker van
   Stark Science liep hier ook tegenaan.
2. **Vul in.** l = __ cm, b = __ cm, h = __ cm.
3. **Bereken.** V = __ × __ × __ = ____ cm³.
4. **Reken om.** ____ cm³ = ____ ml. In de laatste blokken ook naar liter.

**Opbouw:**

| Blok | Maten | Voorbeeld | Extra |
|---|---|---|---|
| 1-3 | hele cm | gum 5 × 2 × 1 cm | cm³ naar ml |
| 4-5 | halve cm (in mm meten) | doosje 4,5 × 3 × 2 cm | mm naar cm |
| 6 | kubus | suikerklontje, dobbelsteen | ribbe × ribbe × ribbe |
| 7 | omgekeerd | V = 60 cm³, l = 5 cm, b = 4 cm. Hoe hoog? | delen |
| 8 | groot | aquarium 50 × 30 × 40 cm = 60 000 cm³ | naar liter en dm³ |

**Nakijken:**

- Meten: het antwoord mag hoogstens 1 mm afwijken. Na twee pogingen verschijnt de juiste
  plaatsing van de liniaal.
- **Rekenen met je eigen maten.** Het volume wordt nagekeken met de maten die de leerling zelf
  invulde. Wie 1 mm verkeerd meet maar daarna goed rekent, krijgt voor het rekenen de punten.
  Zo telt één fout niet drie keer.
- Omrekenen: 1 cm³ = 1 ml; 1000 cm³ = 1 l = 1 dm³.

**Foutherkenning:**

| Wat de leerling deed | Feedback |
|---|---|
| Maten opgeteld (5 + 3 + 2 = 10) | "Je hebt opgeteld. Voor volume vermenigvuldig je: lengte × breedte × hoogte." |
| Twee maten vermenigvuldigd (5 × 3 = 15) | "Dit is de bodem. Hoeveel lagen passen erop?" Kubusjes-animatie. |
| Liniaal vanaf 1 gelezen | Antwoord precies 1 cm te groot: "Legde je de 0 tegen de rand?" |
| cm² of cm als eenheid | "Volume heeft een drie: cm³." |
| mm en cm door elkaar | "Reken eerst alle maten om naar cm." |

### 4.3 Missie 3: Dompel onder

**Leerdoel:** je meet het volume van een onregelmatig voorwerp met de onderdompelmethode.

**KIJK (twee voorbeelden, uit de presentatie):**

1. *De steen, 15 naar 25 ml.* De vier stappen van dia 7, met gele nummers:
   1. Lees het beginvolume af (15 ml).
   2. Laat het voorwerp in het water zakken.
   3. Lees het eindvolume af (25 ml).
   4. Trek af: V = V eind - V begin = 25 - 15 = 10 ml = 10 cm³.
2. *Brug naar missie 2: 1 cm³ = 1 ml.* Een blokje van 2 × 2 × 2 = 8 cm³ gaat in het water.
   Het water stijgt 8 ml. Zelfde getal (Stark-tip en ACS-zijstap).

**DOE (acht voorwerpen).** Per voorwerp:

1. Lees het beginvolume af. Dit is een echte aflesopgave uit missie 1, met loep.
2. Sleep het voorwerp in de maatcilinder. Het zakt en het water stijgt.
3. Lees het eindvolume af.
4. Vul in: V = __ - __ = __ ml = __ cm³.

**Voorwerpen:** steen, sleutel (uit "Samen op het bord 4"), knikker, schroef, ring,
speelgoedpoppetje, dobbelsteen. De dobbelsteen kun je ook met de liniaal meten. Dat is de
controle: komen beide methodes op hetzelfde uit?

**Opbouw:** begin in een cilinder van 50 of 100 ml met streepjes van 1 ml. Daarna 25 ml
(0,5 ml) en 250 ml (2 ml).

**Valkuilopgaven** (twee van de acht, uit het Stark-lab en de praktijk):

- **Het drijvende voorwerp.** Een kurk of houtje blijft bovenop liggen. Het water stijgt weinig.
  Vraag: "Is dit het volume van de kurk?" Goed: nee, want hij is niet helemaal onder water.
  Uitleg: duw hem met een dun staafje onder.
- **Te weinig water.** Het voorwerp komt boven het water uit. Vraag: "Wat moet je eerst doen?"
  Goed: meer water in de cilinder, en opnieuw het beginvolume aflezen.
- (Reserve) **Te veel water.** Het water loopt over de rand. Je weet het eindvolume niet.

**Nakijken:** aflezen zoals in missie 1. Het verschil wordt nagekeken met de standen die de
leerling zelf afgelezen heeft. Zo telt een afleesfout niet dubbel.

**Foutherkenning:**

| Wat de leerling deed | Feedback |
|---|---|
| Begin en eind verwisseld (negatief antwoord) | "Een volume is nooit negatief. Welk getal is het grootst?" |
| Het eindvolume als antwoord gegeven | "Dit is het water plús het voorwerp. Trek het beginvolume eraf." |
| Opgeteld in plaats van afgetrokken | "Het voorwerp duwt het water omhoog. Het verschil is het volume." |

### 4.4 Wat alle missies delen

- **Hint (HULP-vlag).** Een oranje knop. Eerst een zelfcheck ("Welke twee getallen zie je op de
  schaal?"), daarna de volgende stap. Na een hint levert de opgave de helft van de punten.
- **Reeks.** "3 goed op rij" schuift naar een lastigere schaal. De reeks staat onderin, niet
  groot in beeld. Geen druk.
- **CHECK na goed:** STATUS-scherm zoals "Controleer je antwoord" in het deck: het antwoord groot
  in groen, met de korte berekening eronder. Na één seconde de knop "Volgende".
- **CHECK na fout:** het beeld blijft staan. Jouw antwoord in rood, het goede in groen, en de
  foutspecifieke uitleg. Knop "Begrepen".
- **Toetsenbord:** pijltjes verzetten water of liniaal één streepje, Enter controleert.
- **Geluid:** korte WebAudio-tonen voor goed, fout en water. Met een knop uit te zetten.
- **Mogelijk later (niet in versie 1):** een Uitdaging na afronding: 60 seconden zoveel
  mogelijk cilinders aflezen, met de timer rechtsboven (design system p.16). Telt niet mee
  voor tokens. Zie open vraag 5.

## 5. Score en tokens

**Punten per opgave:**

| Resultaat | Punten |
|---|---|
| Goed in één keer | 10 |
| Goed na een hint of tweede poging | 5 |
| Getal goed, eenheid fout | 5 |
| Fout | 0 |

In missie 2 en 3 bestaat een opgave uit deelstappen (meten, rekenen, omrekenen). Elke deelstap
telt apart. De `maxScore` ligt vast per missie, dus accuracy = score / maxScore is eerlijk.

Voorbeelden van KIJK tellen niet mee. Valkuilopgaven wel.

**Tokens (voorstel):** per missie 0-100, met `replayDecay: 0.5` en onbeperkt spelen. De opgaven
worden steeds nieuw gemaakt, dus herhalen is echt oefenen. Beurt 2 levert de helft op, beurt 3
een kwart. Samen voor de hele paragraaf hoogstens 300. Zie open vraag 4.

**`details` in `onComplete`** (voor het docentoverzicht):

```js
{
  missie: 'maatcilinder',
  perSchaal: { '10ml': { goed: 3, totaal: 4 }, ... },
  fouten: { bovenkantMeniscus: 2, streepjeswaarde: 1, eenheid: 0 },
  hintsGebruikt: 1,
  voorbeeldenOvergeslagen: false,
}
```

Zo ziet Kevin per leerling welke denkfout vaak voorkomt.

## 6. Architectuur

### 6.1 Eén spel of drie?

Een lesblok van het type `game` geeft alleen een `gameId` door. Het spel krijgt alleen
`{ onStart, onComplete }` en kan dus niet horen "begin bij missie 2".

**Voorstel: drie registry-items, één component.**

| gameId | Titel | componentKey |
|---|---|---|
| `binask-volume-maatcilinder` | Volume berekenen 1: Lees de maatcilinder | `VolumeMaatcilinder` |
| `binask-volume-balk` | Volume berekenen 2: Meet en bereken de balk | `VolumeBalk` |
| `binask-volume-onderdompelen` | Volume berekenen 3: Dompel onder | `VolumeOnderdompelen` |

In `GameComponentRenderer.jsx` gaan de drie keys naar hetzelfde component met een vaste prop:
`<VolumeBerekenenGame missie="balk" onStart={...} onComplete={...} />`. Het contract met de schil
blijft precies zoals het is.

Voordelen: elke missie past in vijf tot acht minuten, elke missie komt in de les direct na de
bijbehorende uitleg, en tokens en nakijken werken zonder aanpassing van `GameBlock`.

Alternatief: één gameId met alle drie de missies achter elkaar (20 minuten), of een
`gameConfig` op het lesblok. Dat laatste raakt `GameBlock`, `GamePlayer`, de CMS-bouwer en de
renderer. Zie open vraag 1.

### 6.2 Bestanden

```
src/games/volumeBerekenen/
  VolumeBerekenenGame.jsx        schil: start, KIJK, DOE, CHECK, KLAAR; prop missie
  volumeLogic.js                 pure functies: opgaven maken, invoer lezen, nakijken, fouten herkennen, score
  volumeLogic.test.js            node:test
  volumeSchalen.js               de acht cilinders (bereik, labelstap, streepjeswaarde)
  volumeVoorwerpen.js            voorwerpen met volume en of ze drijven
  volumeVoorbeelden.js           de vaste KIJK-voorbeelden uit de presentatie
  volumeSounds.js                WebAudio, geen bestanden
  volumeVoortgang.js             localStorage, defensief: voorbeelden gezien, hoogste schaal
  componenten/
    Maatcilinder.jsx             SVG: glas, schaal, water, meniscus, loep; modus aflezen en vullen
    Liniaal.jsx                  SVG: doorzichtige liniaal met mm-streepjes, slepen
    Balk.jsx                     SVG: schuine balk, kubusjes-vulling, vooraanzicht en bovenaanzicht
    Onderdompelen.jsx            cilinder + voorwerp slepen + stijganimatie
    AntwoordVeld.jsx             getal + eenheidkeuze, komma en punt
```

Herbruiken: `buildRulerTicks` uit `src/lib/presenterInstruments.js` voor de liniaal.
De pointer-logica voor slepen komt uit `PresenterInstrumentOverlay.jsx` als voorbeeld.

### 6.3 Kernlogica (`volumeLogic.js`)

- `maakAfleesOpgave(schaal, vorige)`: kies een geheel aantal streepjes k tussen min en max,
  niet gelijk aan vorige. Waarde = k × streepjeswaarde.
- `leesInvoer("7,4", "ml")`: getal en eenheid, komma of punt, spaties weg.
- `vergelijkInStreepjes(antwoord, juist, streepjeswaarde)`: `Math.round(x / stap)` voor beide.
- `herkenAfleesfout(...)`: bovenkant meniscus, streepjeswaarde, eenheid, label.
- `maakBalk(niveau)`, `controleerVolume(l, b, h, V)`, `herkenRekenfout(...)`: optellen,
  alleen bodem, factor 10.
- `maakOnderdompelOpgave(schaal, voorwerp)`: begin en eind allebei op een streepje, eind
  onder de bovenste streep, water hoog genoeg om het voorwerp te bedekken (behalve bij de
  valkuil).
- `berekenScore(stappen)` en `maxScore(missie)`.

De tests dekken minstens: geen opgave op 0 of op de top, afronding bij 0,2 en 0,01, komma en
punt, elke foutherkenning, maxScore groter dan 0, en dat `onComplete` precies één keer loopt.

### 6.4 Koppeling

1. `gameComponentKeys.js`: drie keys.
2. `GameComponentRenderer.jsx`: drie branches naar hetzelfde component.
3. `GAME_REGISTRY`: drie items, `subject: 'Binask'`, `topic: 'Volume'`, `estimatedMinutes: 7`,
   `status: 'prototype'`.
4. Tokenregels in `functions/index.js` én de spiegel `src/lib/gameTokenRewardRules.js`.
   Of via `/admin/spellen`, dan hoeft functions niet opnieuw gedeployd.
5. Lesblokken: in de seed van H2, paragraaf 2.2, drie `game`-blokken, elk na de bijbehorende
   uitleg. Via de hoofdstukpijplijn, eerst als dry run. Niet `--koppel-klassen` gebruiken.

## 7. Beelden

- **SVG in code:** maatcilinders, liniaal, balken, kubusjes, loep, meniscus. Die zijn exact.
- **Gegenereerd beeld (optioneel):** de werktafel met lucht als achtergrond, en de voorwerpen
  (steen, sleutel, knikker, schroef, ring, poppetje, dobbelsteen, kurk) los en transparant.
  Renderrecept uit het design system: semi-realistische 3D-comic, zwarte contour, warm licht,
  geen tekst in het beeld. Ongeveer tien beelden.
- Zonder gegenereerde beelden werkt het spel ook. Dan zijn de voorwerpen eenvoudige SVG's en is
  de achtergrond effen papier. Dat kan de eerste versie zijn.

## 8. Bekende beperkingen

- Geen echte 3D. De balk is een vaste schuine tekening.
- Aflezen op een scherm is niet hetzelfde als met je oog op ooghoogte. Het oogvoorbeeld in
  KIJK maakt dat bespreekbaar, meer niet.
- Missie 2 toont het meetvlak recht van voren. In het echt meet je aan een driedimensionaal
  voorwerp.
- Voortgang staat in de browser (localStorage). Op een andere laptop ziet de leerling de
  voorbeelden opnieuw.
- Een 1 ml-maatcilinder bestaat in de praktijk nauwelijks.

## 9. Buiten deze versie

- Dichtheid (paragraaf 2.3): weegschaal, mysteriestof, V en m samen. Missie 3 is zo gebouwd
  dat er een weegschaal bij kan.
- Overloopvat voor voorwerpen die niet in een maatcilinder passen.
- Uitdaging met timer (open vraag 5).

## 10. Nog open (graag jouw mening bij de review)

1. **Eén spel of drie?** Mijn voorstel is drie gameIds met één component. Ze passen dan in de
   norm van vijf tot acht minuten en komen elk na de goede uitleg in de les. Of wil je één lang
   spel "Volume berekenen" met drie missies op een kaart?
2. **Hoe precies aflezen?** Mijn voorstel: altijd op een streepje, zoals RulerGame. Stark laat
   leerlingen schatten tussen de streepjes (Amerikaanse regel). Voor klas 1 vmbo vind ik dat te
   veel. Wil je het schatten als extra niveau?
3. **De 1 ml-cilinder.** Een maatcilinder van 0 tot 1 ml bestaat in de praktijk nauwelijks.
   De kleinste gewone is 5 of 10 ml. Wordt het een maatspuit van 1 ml (streepjes van 0,01 ml),
   of een cilinder van 10 ml als kleinste?
4. **Tokens.** Per missie 0-100 met `replayDecay: 0.5`, dus hoogstens 300 voor de paragraaf.
   De vuistregel was ongeveer 100 per paragraaf. Wil je per missie minder (bijvoorbeeld 0-40),
   of mag een oefenparagraaf meer opleveren?
5. **Timer-uitdaging.** Een optionele snelronde na afronding, zonder tokens. Wel doen, later,
   of niet?
6. **Beelden.** Eerst een versie met alleen SVG, of meteen gegenereerde voorwerpen en
   achtergrond in de stijl van het deck?
7. **Valkuilen in missie 3.** Het drijvende voorwerp en "te weinig water". Genoeg, of wil je er
   een bij (bijvoorbeeld een luchtbel onder het voorwerp)?

---

Bronnen die ik bekeken heb: rulergame.net (Graduated Cylinder Game en broncode),
jasonstark.com (Volume Measurement, Length Measurement, Mass-Volume Lab),
effortlessmath.com (Volume Practice en pop-upcheck), geogebra.org/m/HMepNNjV,
acs.org Middle School Chemistry les 3.2 (simulatie via assets.acs.org),
simbucket.com/density (Density Lab, ook op PBS LearningMedia). In HELIX:
`docs/seeds/binask-h2-massa-volume-dichtheid.json`, `sources/binask-jpeg/h2-2.2-volume.pdf`,
`sources/designsysteem/Helix_Slide_Design_System_v2.pdf`, `src/index.css`,
`STARTGIDS-NIEUW-SPEL.md`, `SPELOPZET-CYBER-CHOMPER.md`.
