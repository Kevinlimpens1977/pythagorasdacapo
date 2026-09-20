# Digitale geletterdheid vmbo - fase 1: onderzoek en beslisvoorbereiding

Opgesteld: 19 september 2026. Status: onderzoeksdocument, geen besluit.
Er is in deze fase niets gebouwd en niets in Firestore gewijzigd.

Vier soorten uitspraken staan in dit document door elkaar. Ze zijn steeds
gemarkeerd:

- **[SLO]** officiële inhoud of status volgens SLO of OCW;
- **[Analyse]** onderwijskundige analyse;
- **[Keuze]** een ontwerpkeuze voor DaCapo/HELIX die nog genomen moet worden;
- **[Scenario]** een verkenning, geen voorspelling.

---

## 1. Geraadpleegde basis

Officiële bronnen:

- SLO (2026). *Kerndoelen voortgezet onderwijs*, derde druk, 15 april 2026,
  hoofdstuk digitale geletterdheid (p. 50-59) en de begrippenlijst.
  https://www.slo.nl/publish/pages/23189/kerndoelen-voortgezet-onderwijs-slo-2026-derde-druk.pdf
- SLO, *Veelgestelde vragen actualisatie kerndoelen*, bijgewerkt 10 september 2026.
  https://www.slo.nl/thema/meer/actualisatie-kerndoelen-examenprogramma/actualisatie-kerndoelen/veelgestelde-vragen/
- SLO, *Kerndoelen digitale geletterdheid* (pagina van 21 november 2025).
  https://www.slo.nl/thema/meer/actualisatie-kerndoelen-examenprogramma/actualisatie-kerndoelen/definitieve-conceptkerndoelen-digitale/
- SLO, *Het curriculum verandert. Wat kun je wanneer verwachten?* (21 oktober 2025).
  https://www.actualisatiekerndoelen.nl/updates/het-curriculum-verandert-wat-kun-je-wanneer-verwachten

Bestaand materiaal in HELIX en daaromheen:

- Live: hoofdstuk 1 "Startklaar op je nieuwe school" in drie routeversies,
  met de nulmeting (deel A en B) als paragraaf 1.0.
- De gegenereerde seed `docs/seeds/digitale-vaardigheden-vmbo1.seed.json`:
  acht hoofdstukken, 45 paragrafen per route, met SLO-codes per paragraaf.
  Hoofdstuk 2 tot en met 8 staan niet meer live (verwijderd op 16 september),
  maar de inhoud staat nog in dit bestand.
- `docs/OnderzoekEnBrainstormDV.md`: het eerdere ontwerp van 30 lessen (juni 2026).
- Het Wikiwijs-arrangement "Digitale Geletterdheid" van DaCapo (20 lessen,
  laatst gewijzigd 28 oktober 2025): de huidige schoolpraktijk.
- De nulmeting: `docs/seeds/nulmeting-dv/` (54 vragen, analysemodel) en 122
  startprofielen in Firestore, waarvan 59 compleet (alleen gelezen).
- `src/lib/gameRegistry.js`: 6 gebouwde spellen, ongeveer 75 geplande.
- De skill `/helix-hoofdstuk-bouwen` als kader voor later bouwen. In deze fase
  niet gebruikt om te bouwen.
- Tintara, jaarplanning vmbo leerjaar 1, alleen als benchmark voor didactische
  kwaliteit.

---

## 2. Actuele SLO-analyse

### 2.1 Status

- **[SLO]** De kerndoelen digitale geletterdheid hebben de status *definitief
  concept*. SLO leverde ze in september 2025 aan OCW; de set van alle negen
  leergebieden volgde in november 2025.
- **[SLO]** Nederlands en rekenen-wiskunde zijn op **1 augustus 2026** wettelijk
  in werking getreden. De overige kerndoelen, waaronder digitale geletterdheid,
  volgen volgens SLO **een jaar later, in 2027** (FAQ, 10 september 2026).
- **[SLO]** Na inwerkingtreding geldt overgangsrecht: een school kiest per
  leergebied wanneer zij overgaat. In **augustus 2031** moet iedere school
  onderwijs geven dat op de nieuwe kerndoelen is gebaseerd. Dan begint het
  handhavend toezicht van de inspectie. De inspectie moedigt aan om eerder te
  beginnen.
- **[Analyse]** DaCapo loopt dus niet achter, maar is vroeg. De leerlingen die
  nu in klas 1 zitten, zitten in 2031 niet meer in de onderbouw. Voor hen is
  het een kwaliteitskeuze, geen wettelijke plicht.

### 2.2 Wat SLO wel en niet voorschrijft

- **[SLO]** De kerndoelen gelden voor de hele **onderbouw**. Die duurt op het
  vmbo twee jaar. Het zijn dezelfde kerndoelen voor alle leerwegen; waar nodig
  staan er aanvullingen voor havo-vwo.
- **[SLO]** Er staan geen niveauaanduidingen in en geen minimumniveau per
  schoolsoort.
- **[SLO]** Er staat geen aantal lessen in. SLO noemt alleen dat alle kerndoelen
  samen ongeveer 70 procent van de onderwijstijd vragen; 30 procent is vrije
  ruimte. Dat is een getal voor alle leergebieden samen, niet voor digitale
  geletterdheid.
- **[SLO]** De school bepaalt zelf in welke vakken of leergebieden zij de
  kerndoelen onderbrengt. SLO noemt uitdrukkelijk Nederlands (informatie en
  bronnen), rekenen-wiskunde (data), de creatieve vakken (ontwerpen) en
  burgerschap, mens en maatschappij en mens en natuur (invloed van technologie).
- **[SLO]** Opbouw van elk kerndoel: een kernzin, doelzinnen, en een uitwerking
  onder "het gaat hierbij om". Die uitwerking noemen we hieronder de
  *elementen*.
- **[SLO]** Voor het vmbo: "digitale geletterdheid bereidt leerlingen voor op de
  beroepsgerichte profielen waarin digitale technologie een rol speelt".

### 2.3 De negen kerndoelen

Jouw indeling klopt met de officiële bron. Twee kleine verschillen in
benaming: 21D heet officieel "Artificiële Intelligentie (AI)", en de kernzinnen
van de drie domeinen zijn:

- 21 De leerling zet digitale technologie en digitale media in.
- 22 De leerling creëert digitale producten.
- 23 De leerling participeert in de gedigitaliseerde wereld.

**[Analyse]** 21C en 21D beginnen met "De leerling verkent". De andere zeven
vragen dat de leerling iets inzet, gebruikt, programmeert, analyseert of
keuzes maakt. Dat is een lichtere opdracht: kennismaken en onderzoeken, niet
beheersen. Dit is mijn lezing van de formulering; SLO zegt niet expliciet welk
doeltype elk kerndoel is.

### 2.4 Wat alleen voor havo-vwo geldt

**[SLO]** Bij vijf kerndoelen staat een extra element met het label "Aanvulling
havo-vwo". Die horen **niet** bij de vmbo-verplichting:

| Kerndoel | Aanvulling havo-vwo |
| --- | --- |
| 21B | vakspecifieke zoekstrategieën, zoekhulpmiddelen en zoekopdrachten |
| 21C | open data gebruiken om een probleem op te lossen of onderzoek te doen |
| 21D | machine learning, expertsystemen en manieren om AI te trainen beschrijven; reflecteren op mogelijkheden en beperkingen van AI |
| 22A | een probleem in een ander vak oplossen met computationele denkstrategieën |
| 23A | malware en andere bedreigingen beschrijven |

**[Analyse]** Voor TL kunnen deze elementen een zinvolle verdieping zijn. Ze
tellen dan als verdieping, niet als dekking.

---

## 3. Canonieke SLO-matrix (vmbo)

Dit is de voorgestelde inhoudelijke basis voor het hele project. Per kerndoel
vijf vmbo-elementen, samen **45 elementen**. De codes als `21A-1` zijn een
eigen nummering **[Keuze]**; SLO nummert de elementen niet. De omschrijvingen
volgen de SLO-tekst, licht ingekort.

### 21A Digitale systemen - "De leerling zet digitale systemen functioneel in."

| Code | Element (SLO) |
| --- | --- |
| 21A-1 | beschrijven wat technisch nodig is om digitale systemen te laten werken en in een netwerk te laten samenwerken |
| 21A-2 | beschrijven hoe internet werkt en welke plaats slimme apparatuur daarin heeft |
| 21A-3 | geavanceerde mogelijkheden van software gebruiken voor communicatie, samenwerken en het maken en bewerken van verschillende typen bestanden |
| 21A-4 | digitale systemen herkennen die bedrijven, media en overheid gebruiken om taken uit te voeren of problemen op te lossen |
| 21A-5 | nieuwe technologische ontwikkelingen bijhouden, met hun mogelijkheden en beperkingen |

- Relevantie vmbo: hoog. Dit is de basis van zelfredzaamheid en sluit aan op
  beroepsgerichte profielen.
- Leerlingvaardigheden: onderdelen en hun functie uitleggen; uitleggen wat er
  gebeurt als je een website opent; bestanden ordenen, delen en samen
  bewerken; een eenvoudige storing stap voor stap oplossen.
- Evidence: een werkende mappenstructuur en een gedeeld document; een uitleg
  van de weg van een bericht; een verslag van een storing die je oploste.
- Vakintegratie: techniek, NaSk (stroom en warmte), praktijkvakken.

### 21B Digitale media en informatie - "De leerling navigeert doelgericht in het digitale media- en informatielandschap voor het verwerven en verwerken van informatie."

| Code | Element (SLO) |
| --- | --- |
| 21B-1 | geschikte zoekhulpmiddelen, zoekopdrachten en zoekstrategieën combineren |
| 21B-2 | aangeboden en gevonden informatie beoordelen op betrouwbaarheid en bruikbaarheid |
| 21B-3 | reflecteren op hoe geschikt de gebruikte zoekstrategie was |
| 21B-4 | beschrijven hoe sociale media werken en hoe ze aandacht trekken, vasthouden en beïnvloeden |
| 21B-5 | reflecteren op hoe eigen kennis, opvattingen en voorkeuren je interpretatie beïnvloeden |

- Relevantie vmbo: zeer hoog. Nodig in elk vak, en dagelijks aan de orde op
  sociale media.
- Leerlingvaardigheden: een zoekvraag omzetten in zoektermen; een bron
  controleren met een vaste routine; uitleggen waarom een feed jou iets laat
  zien; eigen vooroordelen herkennen.
- Evidence: een broncheck bij een echte bewering; een vergelijking van twee
  zoekaanpakken; een uitleg van de eigen feed.
- Vakintegratie: Nederlands (bronnen, argumenteren), mens en maatschappij,
  burgerschap.

### 21C Data - "De leerling verkent het gebruik van data en dataverwerking."

| Code | Element (SLO) |
| --- | --- |
| 21C-1 | redeneren over hoe een dataset een beperkt beeld geeft van de werkelijkheid |
| 21C-2 | onderzoek uitvoeren met een dataset om een vraag te beantwoorden, een taak uit te voeren of een probleem op te lossen |
| 21C-3 | beschrijven hoe bedrijven, instellingen en overheden data gebruiken |
| 21C-4 | beschrijven hoe de mogelijkheden groeien om datagestuurd te werken |
| 21C-5 | reflecteren op hoe AI nieuwe manieren van dataverwerking mogelijk maakt |

- Relevantie vmbo: hoog, maar in de huidige schoolpraktijk afwezig (zie
  hoofdstuk 4).
- Leerlingvaardigheden: een eigen vraag beantwoorden met een kleine dataset;
  een grafiek maken en eerlijk aflezen; zeggen wat de data niet laten zien.
- Evidence: een klein data-onderzoek met vraag, data, grafiek en conclusie
  inclusief beperking.
- Vakintegratie: wiskunde (grafieken, statistiek), NaSk (meten), economie,
  aardrijkskunde.

### 21D Artificiële Intelligentie (AI) - "De leerling verkent mogelijkheden en beperkingen van AI."

| Code | Element (SLO) |
| --- | --- |
| 21D-1 | beschrijven hoe de kwaliteit en eigenschappen van data de werking en uitkomsten van AI bepalen |
| 21D-2 | veelvoorkomende AI-systemen en hun toepassingen herkennen bij bedrijven, instellingen en overheden |
| 21D-3 | het verschil beschrijven tussen digitale systemen die op regels werken en AI-systemen die op statistiek werken |
| 21D-4 | doelgericht, verantwoord en kritisch interacteren met een AI-systeem |
| 21D-5 | experimenteren met het trainen van AI-systemen |

- Relevantie vmbo: hoog, en snel veranderend.
- Leerlingvaardigheden: AI herkennen in het dagelijks leven; uitleggen waarom
  AI fouten en vooroordelen overneemt uit data; een AI-antwoord controleren en
  verbeteren; zelf een eenvoudig model trainen en zien waar het misgaat.
- Evidence: een gecontroleerd en verbeterd AI-antwoord met verantwoording; een
  trainingsexperiment met conclusie.
- Vakintegratie: Nederlands en moderne vreemde talen (AI-tekst en vertalen
  controleren), mens en maatschappij.

### 22A Creëren met digitale technologie - "De leerling gebruikt passende werkwijzen bij het creëren en gebruiken van verschillende typen digitale producten."

| Code | Element (SLO) |
| --- | --- |
| 22A-1 | experimenteren met ontwikkel- en bewerkingssoftware om gedachten, ideeën of gevoelens uit te drukken |
| 22A-2 | een digitaal product ontwikkelen en delen dat informeert, overtuigt of beïnvloedt |
| 22A-3 | met computationele denkstrategieën afwegen in hoeverre het doel met een digitaal product bereikt kan worden |
| 22A-4 | een product ontwerpen en realiseren aan de hand van ontwerpeisen, in een iteratief proces, met reflectie op product en proces |
| 22A-5 | rekening houden met auteursrecht, licenties en bron- en naamsvermelding |

- Relevantie vmbo: zeer hoog. Sluit direct aan op praktijkgerichte vakken en
  profielen.
- Leerlingvaardigheden: ontwerpeisen opstellen voor een doelgroep; een eerste
  versie testen en verbeteren; beeld gebruiken dat mag; kiezen welk product
  bij welk doel past.
- Evidence: een product met ontwerpeisen, twee versies en een korte
  verantwoording.
- Vakintegratie: kunst en cultuur, Nederlands, praktijkvakken, mentor.

### 22B Programmeren - "De leerling programmeert een computerprogramma met behulp van computationele denkstrategieën."

| Code | Element (SLO) |
| --- | --- |
| 22B-1 | de taak en het doel van een computerprogramma beschrijven |
| 22B-2 | het algoritme bij een taak ontwerpen en schematisch weergeven |
| 22B-3 | programmeerconcepten gebruiken: events, datastructuren en combinaties van logische operatoren |
| 22B-4 | een eigen programma of dat van een ander documenteren, testen en bijstellen |
| 22B-5 | een probleem of taak zo aanpakken dat programmeren het kan oplossen |

- Relevantie vmbo: verplicht. Let op: 22B-3 vraagt ook **datastructuren**
  (zoals een lijst) en **combinaties van logische operatoren** (en, of, niet).
  Dat is meer dan "herhaling en als-dan".
- Leerlingvaardigheden: een stappenplan tekenen; een blokprogramma met events
  en een lijst maken; testen met verschillende invoer; een fout vinden in
  andermans programma.
- Evidence: een werkend programma met schema, testverslag en een verbetering.
- Vakintegratie: wiskunde (logica, algoritmen), techniek.

### 23A Veiligheid en privacy - "De leerling gaat veilig om met digitale systemen, data en de privacy van zichzelf en anderen."

| Code | Element (SLO) |
| --- | --- |
| 23A-1 | kennis hebben van rechten en plichten van personen en instellingen rond de bescherming van persoonsgegevens, data en privacy |
| 23A-2 | veiligheidsrisico's herkennen bij het gebruik van digitale systemen van bedrijven, instellingen en overheden |
| 23A-3 | zich beschermen tegen zwakke plekken in gebruikte systemen en netwerken |
| 23A-4 | herkennen hoe anderen omgaan met privacy en de veiligheid van data die zij verzamelen of bewaren |
| 23A-5 | adequaat omgaan met ongepaste content, ongepast gedrag en veiligheidsrisico's in digitale omgevingen |

- Relevantie vmbo: zeer hoog en direct nodig.
- Leerlingvaardigheden: sterke inlog en tweestapsverificatie; phishing
  herkennen en melden; zeggen welke rechten je hebt over je gegevens;
  instellingen van een app beoordelen; weten wat je doet bij ongepast gedrag.
- Evidence: een beveiligd eigen account; een geanalyseerd phishingbericht; een
  beoordeling van app-toestemmingen.
- Vakintegratie: mentor, burgerschap, economie (online kopen).

### 23B Digitale technologie, jezelf en de ander - "De leerling maakt weloverwogen keuzes bij het gebruik van digitale technologie en digitale media."

| Code | Element (SLO) |
| --- | --- |
| 23B-1 | online respectvol en verantwoord communiceren en handelen |
| 23B-2 | de invloed van technologie en media op het eigen denken, het eigen gedrag en de omgang met anderen evalueren |
| 23B-3 | rekening houden met de eigen fysieke en mentale gezondheid en die van anderen |
| 23B-4 | reflecteren op en vormgeven van de eigen online identiteit in relatie tot anderen |
| 23B-5 | de eigen interesse in digitale technologie en media verkennen in relatie tot studies en beroepen |

- Relevantie vmbo: zeer hoog. 23B-5 sluit direct aan op loopbaanoriëntatie.
- Leerlingvaardigheden: een nette mail of reactie schrijven; het eigen
  schermgedrag onderzoeken; handelen bij cyberpesten als omstander; een eigen
  profiel bewust inrichten; beroepen verkennen waarin technologie een rol speelt.
- Evidence: een eigen onderzoek naar schermtijd met plan; een uitgewerkte
  omstander-situatie; een verkenning van twee beroepen.
- Vakintegratie: mentor, LOB, bewegen en sport, biologie.

### 23C Digitale technologie, samenleving en wereld - "De leerling analyseert hoe digitale technologie, digitale media en de samenleving elkaar wederzijds beïnvloeden."

| Code | Element (SLO) |
| --- | --- |
| 23C-1 | verkennen hoe technologie en media te benutten zijn voor maatschappelijke betrokkenheid |
| 23C-2 | verkennen hoe de ontwikkeling van technologie te sturen en te reguleren is om menselijke en democratische waarden te beschermen |
| 23C-3 | redeneren over kansen en risico's vanuit ethisch, sociaal, economisch en ecologisch perspectief |
| 23C-4 | analyseren hoe samenlevingen afhankelijk zijn van digitale technologie en van grote technologiebedrijven |
| 23C-5 | ethische dilemma's beschrijven bij toekomstkeuzes die met technologie te maken hebben |

- Relevantie vmbo: verplicht, maar het meest abstract. Vraagt concrete,
  herkenbare contexten.
- Leerlingvaardigheden: een dilemma vanuit twee of meer perspectieven bekijken;
  uitleggen wat regels als de AVG of de Europese AI-wet beschermen; laten
  zien wat er gebeurt als een grote dienst uitvalt.
- Evidence: een beargumenteerde mening vanuit meerdere perspectieven; een
  kleine campagne voor een maatschappelijk doel.
- Vakintegratie: mens en maatschappij, burgerschap, economie, aardrijkskunde.

---

## 4. Audit bestaande HELIX Digitale Vaardigheden

### 4.1 Wat er is

- **Live**: hoofdstuk 1 met nulmeting (1.0) en vijf lessen (1.1-1.5), in drie
  routeversies.
- **In de seed, niet live**: hoofdstuk 2 tot en met 8, 40 paragrafen. De inhoud
  is bruikbaar als grondstof.
- **Schoolpraktijk**: het Wikiwijs-arrangement van 20 lessen.

### 4.2 Audit per hoofdstuk (seed, groene route)

De kolom "SLO inhoudelijk" is mijn eigen beoordeling. Waar die afwijkt van de
code in de seed, staat dat bij de observaties.

| Hoofdstuk | Onderwerp | SLO inhoudelijk | Dekking | Bruikbaarheid | Advies |
| --- | --- | --- | --- | --- | --- |
| H1 Startklaar (live) | inloggen, SOMtoday, wachtwoord, mailen, wat is digitale geletterdheid | 21A-3, 23A-3, 23B-1 | gedeeltelijk | sterk, al gegeven | behouden; SLO-codes van 1.3 en 1.4 rechttrekken |
| H2 Je device | hardware, software/OS/updates, bestanden en cloud, internet en data | 21A-1, 21A-2, 21A-3, 23A-3 | goed voor 21A | sterk | behouden, compacter; minder losse onderdelen opsommen (geluidskaart, videokaart), meer werking en samenhang |
| H3 Veilig internet | risico's, 2FA, phishing, identiteitsfraude, digitale voetafdruk | 23A-2, 23A-3, 23A-5, 23B-4 | goed voor 23A | sterk | behouden; 23A-1 (rechten, AVG) en 23A-4 (app-toestemmingen) toevoegen |
| H4 Word, Excel, PowerPoint | voorblad, koppen, inhoudsopgave, afbeeldingen, Excel, dia's, presenteren, eindtoets | 21A-3, 22A-5, 21C (één paragraaf) | te breed in tijd, smal in SLO | aanpassing nodig | inkorten; tools inzetten binnen ontwerp- en data-opdrachten in plaats van als eigen hoofdstuk |
| H5 Normen, waarden, online kopen | gedragsregels, privacy-instellingen, webshop, betaalmethoden, douane | 23B-1, 23A-5, 23A-2 | gedeeltelijk | wisselend | 5.1-5.3 behouden; 5.4 (Klarna, invoerrechten) is vooral economie; kandidaat voor vakintegratie |
| H6 Mediawijs | algoritme, FOMO en zelfbeeld, cyberpesten (2x), gezondheid, nepnieuws en deepfake | 21B-2, 21B-4, 23B-1 t/m 4 | goed voor 21B-4 en 23B | sterk | behouden; cyberpesten mogelijk in één les; broncheck krijgt een eigen les |
| H7 AI en chatbots | wat is AI, gevaren, prompts, hallucinatie | 21D-2, 21D-4, deels 21D-1 | gedeeltelijk | sterk | uitbreiden met 21D-3 (regels tegenover statistiek) en 21D-5 (zelf een model trainen) |
| H8 Zelf maken | algoritmes, blokken programmeren, debuggen, Canva, poster met AI, terugblik | 22B-1, 22B-2, 22B-4, 22A-1, 22A-2 | gedeeltelijk | aanpassing nodig | programmeren uitbreiden met events, lijsten en logische operatoren; ontwerpen iteratief maken met ontwerpeisen |

### 4.3 Sterke dekking

- 23A en 23B zijn ruim aanwezig: veiligheid, privacy, gedrag, welzijn.
- 21A (werking van systemen) is goed uitgewerkt in H2.
- 21B-4 (hoe sociale media werken) staat er goed in.

### 4.4 Hiaten

| Element | Wat ontbreekt |
| --- | --- |
| 21C-1, 21C-2 | een echt data-onderzoek met een eigen vraag, en wat een dataset niet laat zien; nu alleen een Excel-tabel en een grafiek |
| 21C-3, 21C-4 | hoe bedrijven en overheid data gebruiken |
| 21D-3 | het verschil tussen een systeem met vaste regels en een AI-systeem |
| 21D-5 | zelf een AI-model trainen |
| 22A-3, 22A-4 | ontwerpen met ontwerpeisen, testen en een tweede versie |
| 22B-3 | events, lijsten (datastructuren) en combinaties van logische operatoren |
| 23A-1 | rechten en plichten rond persoonsgegevens |
| 23B-5 | eigen interesse in technologie en beroepen |
| 23C-2, 23C-4 | regulering en afhankelijkheid van grote techbedrijven |
| 21A-4, 21A-5 | systemen bij bedrijven en overheid; nieuwe ontwikkelingen bijhouden |

### 4.5 Overlap

- Wachtwoorden en accountbeveiliging: 1.2, 3.1 en de checkpoints.
- Privacy en persoonsgegevens: 3.3, 5.2 en 7.2.
- Cyberpesten: twee paragrafen (6.3 en 6.4).
- Checkpoint-paragrafen: acht stuks. Nuttig als evidence, maar in 20 lessen
  kosten ze samen bijna een kwart van de tijd.

### 4.6 De huidige schoolpraktijk (Wikiwijs, 20 lessen)

| Soort les | Aantal |
| --- | --- |
| Start, introductie, devices, veilig internet | 3 |
| Word en PowerPoint | 4 |
| Eindtoetsen | 2 |
| Mediawijsheid (waarden, shoppen, social media, pesten, gezondheid, nepnieuws) | 6 |
| AI en chatbot | 2 |
| Canva en eindopdracht | 2 |
| Afsluiting | 1 |

**[Analyse]** In de huidige twintig lessen zitten **geen data (21C)** en **geen
programmeren (22B)**. Ontwerpen (22A) is vooral Canva. 23C komt nauwelijks aan
bod. Vier van de twintig lessen zijn Word en PowerPoint. Voor twee van de negen
kerndoelen is de dekking nu dus nul.

### 4.7 Spellen

- Gebouwd: Wachtwoord Detective, Social Media Zoektocht, Turbo Typen, Paco
  Pac-Man, Data Koerier, DVLingo.
- Gepland: ongeveer 75, gekoppeld aan paragraafnummers uit twee oudere
  ontwerpen. Die nummers kloppen niet meer zodra de leerlijn verandert.
- **[Analyse]** Een spel is het sterkst als oefen- of herhaalmoment, niet als
  eerste uitleg. Dat past bij de fase "geoefend" en "herhaald" in de
  dekkingsmatrix, en bij tokens als beloning voor oefenen.

### 4.8 Tintara als benchmark

Tintara (jaarplanning vmbo leerjaar 1, 80 lessen) is sterk in concrete
openingen, beeldspraak en actieve werkvormen. Het is geschreven voor de docent,
niet voor zelfstandig werk, en sommige getallen zijn te stellig. Bruikbaar als
maatstaf voor didactische kwaliteit en als bron van ideeën, niet om over te
nemen: het materiaal mag niet herpubliceerd worden.

---

## 5. Analyse nulmeting

### 5.1 Wat er gemeten wordt

54 vragen, zes per kerndoel, in twee delen. De koppeling aan elementen is mijn
eigen indeling.

| Kerndoel | Gemeten elementen | Niet gemeten |
| --- | --- | --- |
| 21A | 21A-1 (onderdelen, internet uit), 21A-2 (slim apparaat), 21A-3 (mappen, samen in een document) | 21A-4, 21A-5 |
| 21B | 21B-1 (zoekopdracht), 21B-2 (betrouwbaarheid, likes, bronkeuze) | 21B-3, 21B-5; 21B-4 alleen via een vraag die bij 23C is ingedeeld |
| 21C | 21C-1 (beperkte dataset, twee keer), 21C-2 (grafiek aflezen, bruikbare gegevens) | 21C-3, 21C-4, 21C-5 |
| 21D | 21D-1 (donkere katten), 21D-2 (herkennen), 21D-4 (duidelijke opdracht, werkstuk) | 21D-5; 21D-3 deels (koppelvraag) |
| 22A | 22A-2 (product bij doel), 22A-4 (volgorde ontwerpen), 22A-5 (bronvermelding, beeld) | 22A-1, 22A-3; maken zelf wordt niet gemeten |
| 22B | 22B-2 (volgorde), 22B-3 (herhaling, voorwaarde, klik als event), 22B-4 (testen, fout zoeken) | datastructuren; 22B-1, 22B-5 |
| 23A | 23A-3 (wachtwoord, wifi, inlogcode), 23A-5 (situatie), 23A-1 deels (persoonsgegevens, foto) | 23A-2, 23A-4 |
| 23B | 23B-1 (grap, gênante foto), 23B-2 (afleiding), 23B-3 (houding), 23B-4 (online identiteit), pesten | 23B-5 |
| 23C | 23C-3 (energie, perspectieven), 23C-1 deels (toegankelijkheid) | 23C-2, 23C-4, 23C-5; twee van de zes vragen meten eigenlijk 21A-2 en 23A-2 |

### 5.2 Uitkomst bij de klassen (gelezen op 19 september 2026)

122 startprofielen, waarvan 59 compleet (deel A en B). Percentages over de
gemaakte vragen.

| Onderdeel | Goed | Beeld bij de complete profielen |
| --- | --- | --- |
| 22A Producten creëren | 48% | 49 van 59 op start of in ontwikkeling |
| 23C Samenleving | 62% | ongeveer de helft in ontwikkeling |
| 21D AI | 63% | 24 van 59 op start of in ontwikkeling |
| 22B Programmeren | 64% | 22 van 59 op start of in ontwikkeling |
| 21A Systemen | 65% | 28 van 59 op start of in ontwikkeling |
| 21B Informatie | 69% | 12 van 59 op start of in ontwikkeling |
| 23B Jezelf en de ander | 70% | 21 van 59 op start of in ontwikkeling |
| 23A Veiligheid | 71% | 22 van 59 op start of in ontwikkeling |
| 21C Data | 80% | 13 van 59 op start of in ontwikkeling |

### 5.3 Wat dit wel en niet zegt

- **[Analyse]** De nulmeting is evenwichtig: elk kerndoel even zwaar, met
  vragen op basis- en plusniveau. Dat maakt hem geschikt om per klas accenten
  te kiezen.
- Zes gesloten vragen per onderdeel is te weinig voor een betrouwbaar oordeel
  over één leerling. Gebruik hem voor de klas en de groep, en als gespreksstof
  met de leerling, niet als oordeel.
- Hij meet kennis en herkennen, niet maken. 22A scoort het laagst terwijl er
  geen enkele maakopdracht in zit. Het echte beeld van 22A is waarschijnlijk
  nog zwakker.
- De 80 procent bij data is te rooskleurig: de datavragen zijn eenvoudig
  (grafiek aflezen) en vraag B-03 is op 18 september voor iedereen goed
  gerekend. Een echt data-onderzoek is niet gemeten.
- 23C wordt maar half gemeten; de wezenlijke elementen (regulering,
  afhankelijkheid, dilemma's) ontbreken.

### 5.4 Wat je ermee kunt voor het curriculum

- **Accenten per klas**: de laagste twee of drie onderdelen van een klas extra
  tijd of een extra oefenmoment geven. Het analysemodel doet dat al per
  leerling ("maximaal drie laagst scorende deelvaardigheden").
- **Lijn**: nulmeting, curriculum, korte checks per kerndoel, en aan het eind
  van klas 1 of 2 een eindmeting. Die eindmeting kan dezelfde opzet hebben,
  met andere vragen en een maakdeel, zodat groei zichtbaar wordt.
- **Aanvulling**: bij een eindmeting ook een korte maakopdracht voor 22A en 22B.
  Anders meet je precies de twee kerndoelen die het meest om doen vragen niet.

---

## 6. Keuzekaart voor leerjaar 1

"Minimaal" is wat nodig is om een element echt te introduceren en één keer te
laten toepassen. "Ideaal" laat ruimte voor oefenen, herhalen en een bewijs.
Aantallen in lessen van 45 minuten.

| # | Thema | SLO | Waarom belangrijk in de vmbo-brugklas | Min. | Ideaal | Minimumvariant | Verdieping bij meer tijd | Risico bij inkorten | Vakintegratie |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Start op school: accounts, cloud, samenwerken in een bestand | 21A-3, 23A-3 | zonder dit loopt elk ander vak vast | 1 | 2 | inloggen, mappen, delen | versiebeheer, samen bewerken | chaos en verloren werk in alle vakken | alle vakken, mentor |
| 2 | Hoe een computer en internet werken | 21A-1, 21A-2 | technologie is geen magie; basis voor storingen oplossen en veiligheid | 1 | 3 | invoer-verwerking-uitvoer, weg van een bericht | slimme apparaten, netwerken, zelf onderzoeken | alleen knoppen bedienen zonder begrip | techniek, NaSk |
| 3 | Zelf storingen oplossen | 21A-1, 21A-3 | zelfredzaamheid; minder afhankelijk van de docent | 0,5 | 1 | stappenplan bij een storing | echte storingen oefenen | leerlingen blijven hangen bij het eerste probleem | praktijkvakken |
| 4 | Accounts en apparaten beveiligen | 23A-3 | directe schade als het misgaat | 1 | 2 | wachtwoordzin, 2FA, updates | openbaar wifi, zwakke plekken | gehackte accounts | mentor |
| 5 | Oplichting en phishing | 23A-2, 23A-5 | leerlingen zijn doelwit, ook via games en sociale media | 1 | 2 | rode vlaggen, wat je dan doet | casussen uit games en marktplaatsen | financiële schade, identiteitsfraude | economie, mentor |
| 6 | Privacy, persoonsgegevens en je rechten | 23A-1, 23A-4, 21C-3 | apps verzamelen meer dan leerlingen denken | 1 | 2 | persoonsgegevens, app-toestemmingen | rechten volgens de AVG, een eigen gegevensverzoek | onwetend delen, geen idee van rechten | burgerschap |
| 7 | Zoeken en bronnen beoordelen | 21B-1, 21B-2, 21B-3, 21B-5 | nodig in elk werkstuk | 1 | 3 | zoektermen, vaste broncheck | eigen vooroordelen, zoekaanpak vergelijken | nepinformatie in werkstukken | Nederlands, M&M |
| 8 | Sociale media, het algoritme en je aandacht | 21B-4, 23B-2 | dagelijkse leefwereld | 1 | 2 | hoe een feed werkt | eigen feed onderzoeken | vatbaar voor beïnvloeding | M&M, burgerschap |
| 9 | Online gedrag, identiteit en cyberpesten | 23B-1, 23B-4, 23A-5 | veiligheid in de klas en daarbuiten | 1 | 2 | omstander-keuzes, respectvol reageren | profiel bewust inrichten | pesten blijft onbesproken | mentor |
| 10 | Digitaal welzijn en gezondheid | 23B-2, 23B-3 | slaap, concentratie, houding | 0,5 | 1 | eigen schermgedrag bekijken | eigen onderzoek met plan | weinig zelfsturing | bewegen en sport, biologie |
| 11 | Data: dataset, onderzoek, grafiek, beperking | 21C-1 t/m 21C-4 | kerndoel nu niet gedekt; basis voor AI | 1 | 3 | een vraag beantwoorden met een kleine dataset | eigen klein onderzoek op school | 21C blijft oppervlakkig of ontbreekt | wiskunde, NaSk |
| 12 | AI begrijpen | 21D-1, 21D-2, 21D-3, 21D-5, 21C-5 | leerlingen gebruiken AI al, zonder te snappen hoe het werkt | 1 | 3 | AI leert van data; regels tegenover statistiek | zelf een model trainen | AI als orakel of als toverdoos | M&M |
| 13 | AI verantwoord gebruiken | 21D-4 | eerlijkheid bij schoolwerk, controleren | 1 | 2 | een antwoord controleren en verbeteren | AI-output vergelijken, bronnen erbij | blind overnemen, fraude | Nederlands, MVT |
| 14 | Digitaal ontwerpen voor een doelgroep | 22A-1 t/m 22A-4 | laagste nulmetingscore; sluit aan op praktijkvakken | 2 | 4 | ontwerpeisen, eerste versie, verbeteren | echt product voor een echte doelgroep | alleen "iets moois maken" zonder ontwerpproces | kunst, praktijkvakken |
| 15 | Auteursrecht en bronvermelding | 22A-5 | in elk werkstuk en elke presentatie | 0,5 | 1 | wat mag, hoe vermeld je | licenties, eigen werk beschermen | plagiaat | Nederlands, kunst |
| 16 | Algoritmisch denken en programmeren | 22B-1 t/m 22B-5 | kerndoel nu niet gedekt in de schoolpraktijk | 2 | 5 | stappenplan, events, herhaling, keuze, testen | lijsten, logische operatoren, eigen projectje | 22B symbolisch; datastructuren en logica ontbreken | wiskunde, techniek |
| 17 | Technologie en samenleving | 23C-1 t/m 23C-5 | burgerschap in een digitale wereld | 1 | 2 | een dilemma vanuit meerdere kanten | regels (AVG, AI-wet), afhankelijkheid van techbedrijven | 23C blijft een losse mening zonder kennis | M&M, burgerschap |
| 18 | Technologie en beroepen | 23B-5, 21A-4 | vmbo bereidt voor op beroepsgerichte profielen | 0,5 | 1 | technologie in drie beroepen | bedrijfsbezoek, gastspreker | geen koppeling met profielkeuze | LOB, mentor |

**[Analyse]** Het minimum telt op tot **18,5 lessen**. Met twintig lessen blijft
er dus anderhalve les over voor de nulmeting, checks en een afsluiting. Alles
komt dan één keer aan bod. Herhalen en verankeren moet dan buiten de twintig
lessen gebeuren: in klas 2, in andere vakken, of met oefening in HELIX.

---

## 7. Eerste contour 20 lessen

Alleen de hoofdlijn, geen definitieve planning.

| Blok | Lessen | Thema's van de keuzekaart | Kerndoelen |
| --- | --- | --- | --- |
| A Startklaar en systemen | 3 | 1, 2, 3, 4 | 21A, 23A |
| B Veilig en privacy | 2 | 5, 6 | 23A, 21C-3 |
| C Informatie en media | 3 | 7, 8, 9, 10 | 21B, 23B |
| D Data en AI | 4 | 11, 12, 13 | 21C, 21D |
| E Maken | 5 | 14, 15, 16 | 22A, 22B |
| F Wereld en afsluiting | 3 | 17, 18, eindopdracht | 23C, 23B-5, alles |

Kenmerken:

- elk kerndoel minstens één primaire les;
- herhaling alleen via korte checks aan het begin van een volgende les en via
  spellen;
- één eindopdracht als evidence voor meerdere kerndoelen;
- Word, Excel en PowerPoint geen eigen lessen: ze komen terug als middel in
  blok D en E.

**[Analyse]** Dit is formele dekking. Voor 22A en 22B is het krap: twee of
drie lessen is genoeg om kennis te maken, niet om het ontwerpen of
programmeren echt te leren.

---

## 8. Eerste contour 40 lessen

Niet de twintig lessen verdubbeld. Wat extra tijd inhoudelijk toevoegt:

| Wat erbij komt | Lessen | Waarom het met 20 niet verantwoord kan |
| --- | --- | --- |
| Per blok een oefen- en toepassingsles | 6 | na één les kunnen leerlingen iets herkennen, niet zelfstandig toepassen |
| Gespreide herhaling: vier korte terugblikken door het jaar | 2 | wat maar één keer aan bod komt, is na een paar weken weg |
| Project 1: data-onderzoek op school (eigen vraag, eigen data) | 3 | 21C-2 vraagt echt onderzoek; dat past niet in één les |
| Project 2: digitaal product voor een echte doelgroep, in twee versies | 4 | 22A-4 vraagt een iteratief proces met testen en verbeteren |
| Programmeren doorbouwen: lijsten, logische operatoren, een eigen spelletje | 3 | 22B-3 vraagt datastructuren en logica; dat is meer dan één les blokken |
| AI zelf trainen en vergelijken | 1 | 21D-5 is een experiment, geen uitleg |
| Feedbackrondes en herkansing op bewijsstukken | 1 | zonder terugkoppeling geen groei |

Samen twintig extra lessen, verdeeld ongeveer zo: A 5, B 4, C 6, D 8, E 11,
F 3, plus 3 voor checks en de eindmeting.

**[Analyse]** Het grootste verschil zit niet in méér onderwerpen, maar in
**oefenen, herhalen en maken**. De kerndoelen die het meest profiteren zijn
22A, 22B en 21C. Juist die zijn nu het zwakst.

---

## 9. Eerste contour hybride model

Twintig DV-lessen, plus tien tot twintig vaste toepassingsmomenten in andere
vakken.

### Wat in DV blijft en wat in de vakken past

| Moet in DV (expliciet aanleren) | Kan in de vakken (toepassen en onderhouden) |
| --- | --- |
| hoe systemen, internet en AI werken (21A-1, 21A-2, 21D-1, 21D-3) | broncheck in werkstukken (Nederlands, M&M) |
| programmeren en algoritmen (22B) | data-onderzoek en grafieken (wiskunde, NaSk) |
| beveiliging en privacyrechten (23A-1, 23A-3) | AI-tekst en vertalingen controleren (Nederlands, MVT) |
| de vaste routines zelf: broncheck, AI-check, privacycheck | ontwerpen voor een doelgroep (kunst, praktijkvakken) |
| AI trainen (21D-5) | online gedrag, welzijn, beroepen (mentor, LOB) |
| | technologie en samenleving (M&M, burgerschap) |

### Voordelen

- Past bij SLO, dat zelf de samenhang met andere leergebieden noemt.
- Leerlingen passen het toe waar het nodig is, dus meer transfer.
- Vraagt geen twintig extra DV-uren in de lessentabel.

### Risico's

- De momenten verdampen als niemand eigenaar is.
- Vakdocenten weten niet wat leerlingen al geleerd hebben.
- Wisselende kwaliteit.
- Er is geen zicht op of het echt gebeurt.

### Randvoorwaarden

- Een eigenaar: de DV-docent als coördinator, met mandaat van het MT.
- Vaste momenten in de jaarplanning, per vak benoemd.
- Een gedeelde taal: vaste routines met een naam, korte docentkaarten.
- Registratie: het toepassingsmoment wordt vastgelegd, zodat de dekking
  zichtbaar blijft.

### Een vierde variant om mee te wegen

**[Scenario]** Twintig lessen plus **oefening buiten de les in HELIX**: korte
herhaalquizzen en spellen met tokens, gespreid over het jaar. Dat lost het
herhaalprobleem deels op zonder extra lesuren. Maken en projecten lost het
niet op.

---

## 10. Eerste visie leerjaar 1 tot en met 4

**[SLO]** De kerndoelen gelden voor de onderbouw: op het vmbo klas 1 en 2. In
klas 3 en 4 gelden ze niet meer. Daar gaat het om examenprogramma's en
beroepsgerichte profielen.

| Klas | Rol | Inhoud op hoofdlijnen |
| --- | --- | --- |
| 1 | fundament | alle negen kerndoelen geïntroduceerd; de vaste routines aangeleerd; nulmeting en eindmeting |
| 2 | verdiepen en afronden | de onderbouwdekking afmaken: data-onderzoek, programmeren met lijsten en logica, AI trainen, 23C (regulering, techbedrijven), 23B-5 (beroepen); evidence per kerndoel |
| 3 | toepassen in het profiel | geen DV-kerndoelen meer; digitale vaardigheden binnen het beroepsgerichte profiel, burgerschap en LOB; vakoverstijgende projecten |
| 4 | zelfstandig en kritisch | digitaal handelen richting mbo en beroep: eigen werk verantwoorden bij gebruik van AI, privacy en veiligheid in een werkcontext |

**[Analyse]** De groei zit in zelfstandigheid en complexiteit, niet in nieuwe
onderwerpen: in klas 1 "ik volg de broncheck", in klas 2 "ik kies zelf de
aanpak", in klas 3 en 4 "ik verantwoord mijn keuzes in een beroepscontext".

Duurzame concepten tegenover hulpmiddelen:

| Duurzaam concept | Huidig hulpmiddel | Tijdelijke techniek |
| --- | --- | --- |
| informatie gestructureerd maken en samen bewerken | Word, OneDrive | een automatische inhoudsopgave invoegen |
| informatie presenteren voor een doelgroep | PowerPoint, Canva | een overgang tussen dia's kiezen |
| met AI communiceren en de uitkomst controleren | ChatGPT, Copilot | een specifieke promptformule |
| data onderzoeken en eerlijk weergeven | Excel | een bepaald grafiekmenu |
| een probleem in stappen oplossen | Scratch, MakeCode | een specifieke blokkenomgeving |

---

## 11. Eerste SLO-dashboardconcept

Alleen wat je moet kunnen zien, geen techniek.

**Overzicht per kerndoel**

- de status in fasen: niet ingepland, ingepland, aangeboden, geoefend,
  herhaald of verankerd, evidence aanwezig;
- per kerndoel hoeveel van de vijf elementen zijn afgedekt, en welke niet;
- welke lessen erbij horen: gegeven en nog te geven.

**SLO × les-matrix**

- rijen: de negen kerndoelen, uit te klappen naar de 45 elementen;
- kolommen: de lessen, plus de toepassingsmomenten in andere vakken;
- per cel: de rol van de les (introductie, oefenen, herhalen, toepassen,
  evidence);
- lezen in twee richtingen: "waar komt 21D terug?" en "wat zit er in les 8?".

**Signalen**

- een kerndoel of element dat nergens staat;
- een element dat maar één keer voorkomt;
- geen herhaling na de introductie;
- geen evidence-moment;
- een kerndoel dat onevenredig veel ruimte krijgt.

**Apart, en pas later: leerlingbeheersing**

- de nulmeting en een eindmeting per leerling;
- evidence per leerling per kerndoel;
- nooit "beheerst" tonen op basis van alleen "de les is gegeven".

Welke curriculuminformatie daarvoor per les moet worden vastgelegd:
primair kerndoel, secundaire kerndoelen, elementen, rol per element, soort
evidence, en of de les gepland of gegeven is. Waar en hoe dat in HELIX komt, is
een vraag voor fase 6.

---

## 12. Belangrijkste observaties

1. **De eis "alle kerndoelen in twintig lessen in klas 1" is strenger dan
   SLO.** De kerndoelen gelden voor de onderbouw, en die duurt op het vmbo twee
   jaar. Een redelijker eis: klas 1 introduceert alle negen, klas 2 rondt af
   en levert evidence.
2. **Twintig lessen is genoeg voor formele dekking, niet voor duurzaam leren.**
   Het minimum van de keuzekaart is 18,5 lessen. Alles komt één keer aan bod;
   herhalen moet ergens anders gebeuren.
3. **De huidige schoolpraktijk dekt twee kerndoelen helemaal niet**: data (21C)
   en programmeren (22B). Vier van de twintig lessen zijn Word en PowerPoint.
   Dat is precies het Office-patroon dat je wilt vermijden.
4. **De seed is sterk op veiligheid, privacy en mediawijsheid**, en zwak op
   maken, data en de wezenlijke delen van AI en samenleving. Die delen zijn
   goede grondstof, maar H4 (zeven paragrafen Office) past niet in een
   leerlijn van twintig lessen.
5. **Sommige SLO-codes in de seed zijn geforceerd.** Mailen (1.3) staat op 21B
   terwijl het 21A-3 en 23B-1 is. Paragraaf 1.4 staat op 22A zonder dat er iets
   gemaakt wordt. Die codes moeten opnieuw bekeken worden voordat je er een
   dashboard op bouwt.
6. **De nulmeting wijst dezelfde kant op als de audit**: maken (22A) scoort het
   laagst en wordt het minst geoefend. Dat pleit voor meer maaktijd, niet voor
   meer uitleg.
7. **"1 hoofdstuk = 1 les" botst met de huidige opbouw.** In HELIX heeft een
   hoofdstuk meerdere paragrafen, en in Binask is een paragraaf ongeveer één
   les. Dat moet vastliggen voordat de dekkingsmatrix wordt ingericht; anders
   meet het dashboard op het verkeerde niveau.
8. **De geplande spellen hangen aan oude paragraafnummers.** Ongeveer 75
   geplande spellen verwijzen naar twee ontwerpen die niet meer gelden. Kies
   later per thema hoogstens één spel, bedoeld om te oefenen.
9. **In klas 3 en 4 gelden de DV-kerndoelen niet meer.** Een lijn tot klas 4
   is daarom een schoolkeuze. Hij hoort vast te zitten aan de
   beroepsgerichte profielen, burgerschap en LOB, niet aan een DV-vak.
10. **Het hybride model is realistischer dan veertig losse lessen, maar alleen
    met een eigenaar en registratie.** Zonder die twee is het in de praktijk
    een model van twintig lessen.

---

## 13. Beslisvragen

**1. Wat is de dekkingseis voor klas 1?**
- a. Alle 45 vmbo-elementen in klas 1. Volledige dekking in één jaar, maar
  alles één keer en oppervlakkig.
- b. Alle negen kerndoelen geïntroduceerd in klas 1; afronden en evidence in
  klas 2. Past bij SLO (onderbouw is twee jaar) en geeft ruimte om te oefenen.
  Vraagt wel een afspraak dat er in klas 2 DV-tijd is.
- c. Een kern van ongeveer 30 elementen in klas 1, de rest bewust in klas 2.
  Het scherpst, maar je moet uitleggen waarom iets later komt.

**2. Tellen de lessen die al gegeven zijn mee in de twintig?**
Hoofdstuk 1 en de nulmeting hebben al lestijd gekost. Als ze meetellen,
blijven er ongeveer veertien tot vijftien lessen over, en worden de keuzes
scherper.

**3. Wat is één les in HELIX: een hoofdstuk of een paragraaf?**
- a. Een hoofdstuk is een les, zoals in de opdracht staat. Dan wordt een
  hoofdstuk klein, en dat wijkt af van hoofdstuk 1 en van Binask.
- b. Een paragraaf is een les, en een hoofdstuk is een blok van enkele lessen.
  Dat past bij de bestaande opbouw en bij de badges per hoofdstuk.

**4. Hoe zwaar weegt praktische zelfredzaamheid met Office?**
- a. Geen eigen Office-lessen; de tools komen terug als middel bij ontwerpen
  en data. Het meeste ruimte voor de kerndoelen, maar er is een risico dat
  vakdocenten merken dat leerlingen geen net verslag kunnen maken.
- b. Eén of twee compacte lessen "werken met documenten", gericht op
  structuur en samenwerken. Een tussenweg.
- c. Zoals nu, vier tot vijf lessen. Kost ongeveer een kwart van de tijd en
  gaat ten koste van data en programmeren.

**5. Hoeveel ruimte krijgt programmeren in klas 1?**
- a. Een compacte introductie van twee lessen: stappenplan, events, herhaling,
  keuze en testen. Lijsten en logische operatoren in klas 2.
- b. Drie tot vier lessen met echt oefenen en een klein eigen programma.
  Kost ruimte bij andere thema's.
- c. Vooral in klas 2, met in klas 1 alleen een algoritme zonder computer.
  Dan is 22B in klas 1 alleen formeel gedekt.

**6. Hoe behandel je AI?**
- a. Vooral als hulpmiddel: goed gebruiken en controleren (21D-4).
- b. Vooral als technologie om te begrijpen: data, regels tegenover
  statistiek, trainen (21D-1, 21D-3, 21D-5).
- c. Bewust beide, met zelf trainen als experiment. Het meest in lijn met SLO,
  en kost drie tot vier lessen.

**7. Hoe gebruik je de nulmeting om te sturen?**
- a. Eén vaste leerlijn voor iedereen; de nulmeting bepaalt alleen accenten
  in klasgesprekken en extra oefening in HELIX.
- b. Een vaste kern plus per klas één of twee keuzelessen voor de laagste
  onderdelen van die klas.
- c. Een eigen route per leerling. Het meest persoonlijk, maar zwaar om te
  onderhouden en bij zes vragen per onderdeel statistisch wankel.

Daarbij, over niveaus: één gemeenschappelijke kern met extra ondersteuning
voor basis en verdieping voor GL/TL (bijvoorbeeld de havo-vwo-aanvullingen als
TL-verdieping), of aparte versies zoals de oude drie routes?

**8. Welk scenario wil je met Manel en het MT bespreken?**
- a. Twintig lessen, eerlijk gepresenteerd als formele dekking met beperkte
  verankering.
- b. Veertig lessen: het sterkste leeraanbod, maar het zwaarst voor de
  lessentabel.
- c. Hybride: twintig lessen plus vaste toepassingsmomenten in vakken. Dan is
  de vraag wie eigenaar is en of het MT dat mandaat geeft.
- d. Twintig lessen plus oefening in HELIX buiten de les. Het goedkoopst, maar
  lost het maken niet op.
