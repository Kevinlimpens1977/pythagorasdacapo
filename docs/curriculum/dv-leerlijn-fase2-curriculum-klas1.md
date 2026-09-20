# Digitale geletterdheid vmbo klas 1 - fase 2: curriculum van 22 lessen

Opgesteld: 19 september 2026. Status: goedgekeurd door Kevin op 19 september 2026, uitgebreid naar 22 lessen. Er is niets
gebouwd en niets in Firestore gewijzigd.

De bron voor alles hieronder is één bestand:
[`dv-klas1-curriculum.json`](dv-klas1-curriculum.json). De tabellen in dit
document zijn daaruit gegenereerd. Verander je iets aan een les, dan verander
je het daar, zodat planning, matrix en controle niet uit elkaar gaan lopen.

## 0. Genomen besluiten

| Vraag | Besluit van Kevin | Wat dat betekent in dit ontwerp |
| --- | --- | --- |
| Dekking | alle 45 vmbo-elementen in klas 1, in 20 lessen; 21 of 22 mag ook | 22 lessen; elk element heeft minstens één les waarin het echt wordt behandeld |
| Beschikbare tijd | 20 tot 24 lessen in de DIF-uren van de brugklas | 22 lessen passen; bij 24 is er ruimte voor twee extra oefenlessen |
| Voorkennis | tweestapsverificatie is bij iedereen ingesteld; OneDrive en delen nog niet | les 5 bouwt voort op de 2FA; les 3 legt de nadruk op OneDrive en delen |
| Al gegeven lessen | tellen niet mee | 22 nieuwe hoofdstukken, H2 tot en met H23; hoofdstuk 1 is voorkennis |
| Wat is een les | één hoofdstuk met zijn paragrafen = één les | per les drie deelonderwerpen; hoe ze worden opgebouwd, bepaalt de skill |
| Office | geïntegreerd | geen Word-, Excel- of PowerPoint-lessen; de software is middel in les 3, 12, 16 en 17 |
| Programmeren | introductie in klas 1, verdiepen in klas 2 | drie lessen (18, 19 en 20): introductie van alle vijf de 22B-elementen en één oefenles met een eigen spel |
| AI | geen model trainen; speelse kennismaking met generatieve AI; AI als socratisch studiemaatje; extra opdracht: animatie met storyboard en karakters via Copilot | les 14, 15 en 17; 21D-5 als sorteerexperiment (akkoord); storyboard is les 17, de animatie zelf is de extra opdracht (akkoord) |
| Nulmeting | iedereen hetzelfde; bij de start ziet elke leerling zijn eigen score | één leerlijn; elke les heeft een koppeling met een onderdeel van de nulmeting; de eindmeting in HELIX buiten de les |
| MT | meerdere scenario's met voor- en nadelen | volgt in fase 3 |

## 1. Uitgangspunten van het ontwerp

1. **SLO is de maat.** Elke les is gekoppeld aan elementen uit de kerndoelen,
   niet alleen aan een hoofdcode. Een koppeling staat er alleen als de les het
   element echt behandelt.
2. **Van begrijpen naar maken.** Het jaar loopt van hoe systemen werken
   (blok A), via veiligheid en informatie (B en C), naar data en AI (D), zelf
   maken (E) en de samenleving (F). Latere blokken gebruiken wat eerder is
   geleerd.
3. **Software is middel.** OneDrive, Word, Excel, PowerPoint en Copilot komen
   voor op het moment dat een opdracht ze nodig heeft.
4. **Vaste routines met een naam.** Het storingsplan, de privacycheck, de
   broncheck, de datacheck, de AI-check en de ontwerpcyclus. Ze worden één keer
   aangeleerd en daarna steeds opnieuw gebruikt, ook in andere vakken.
5. **Herhaling is ingebouwd.** Elke les begint met een of twee terugblikvragen
   over eerdere lessen (in de matrix als **h**). Waar het inhoudelijk past,
   komt een element terug in een nieuwe context (**H**).
6. **Evidence op twee niveaus.** Elke les sluit af met een check. Twaalf lessen
   leveren daarnaast een product op dat laat zien dat de leerling het kan
   (**E**).
7. **Startscore uit de nulmeting.** Elke les hoort bij één van de negen
   onderdelen van de nulmeting. Bij de start ziet de leerling zijn eigen
   score voor dat onderdeel. Hoe dat technisch komt, is voor fase 6.
8. **Spellen om te oefenen.** Een spel introduceert niets; het laat oefenen
   en levert tokens op. Twee gebouwde spellen passen nu al (les 5 en 10).

## 2. Overzicht van de lessen

| Les | HELIX | Blok | Titel | Primair | Secundair | Startscore nulmeting |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | H2 | A | Wat zit er in je device? | 21A | - | systemen |
| 2 | H3 | A | Hoe reist jouw bericht over internet? | 21A | 23C | systemen |
| 3 | H4 | A | Samenwerken in de cloud | 21A | - | systemen |
| 4 | H5 | A | Technologie aan het werk | 21A | 21D, 23B | systemen |
| 5 | H6 | B | Je accounts op slot | 23A | 21A | veiligheid |
| 6 | H7 | B | Trap er niet in | 23A | - | veiligheid |
| 7 | H8 | B | Jouw gegevens, jouw rechten | 23A | 21C, 23C, 21A | veiligheid |
| 8 | H9 | C | Slim zoeken | 21B | 23A | informatie |
| 9 | H10 | C | De broncheck: echt, nep of twijfel? | 21B | 23A | informatie |
| 10 | H11 | C | Hoe sociale media je aandacht vangen | 23B | 21B | sociaal |
| 11 | H12 | C | Wie ben jij online? | 23B | 23A | sociaal |
| 12 | H13 | D | Onderzoek met data | 21C | 21A, 21B, 23B | data |
| 13 | H14 | D | Van data naar AI | 21C | 21D, 23B | data |
| 14 | H15 | D | Maak kennis met generatieve AI | 21D | 21A, 21C, 23B | ai |
| 15 | H16 | D | AI als studiemaatje | 21D | 21B, 21C, 23A | ai |
| 16 | H17 | E | Ontwerpen voor een doelgroep | 22A | 23C, 21A, 23B | producten |
| 17 | H18 | E | Jouw animatie: storyboard en karakters | 22A | 21D, 23B | producten |
| 18 | H19 | E | Denken als een programmeur | 22B | 22A, 21D | programmeren |
| 19 | H20 | E | Programmeren: events, lijsten en logica | 22B | - | programmeren |
| 20 | H21 | E | Programmeren: maak je eigen spel | 22B | 22A, 21D | programmeren |
| 21 | H22 | F | Technologie, samenleving en jij | 23C | 21B, 21A, 22A | samenleving |
| 22 | H23 | F | Eindproject: een campagne voor brugklassers | 22A | 21C, 23B, 23C, 21B, 21A | producten |

## 3. De lessen in detail

Per les: de inhoud, de leerdoelen en de SLO-koppeling. Hoe een les als HELIX-hoofdstuk wordt opgebouwd, volgt later uit `/helix-hoofdstuk-bouwen`. De "deelonderwerpen" zijn de inhoudelijke indeling in paragrafen, geen blokstructuur.

### Blok A: Hoe digitale systemen werken

#### Les 1 (HELIX-hoofdstuk 2): Wat zit er in je device?

Een computer is geen magie: invoer, verwerking, opslag en uitvoer, en hoe software daarmee samenwerkt. Met een vast stappenplan los je zelf een storing op.

- **Deelonderwerpen:** Invoer, verwerking, opslag en uitvoer; Software en besturingssysteem; Het storingsplan: zelf een probleem oplossen.
- **Leerdoelen:**
  - Je kunt de hoofdonderdelen van een computer noemen en uitleggen wat ze doen.
  - Je kunt het verschil uitleggen tussen hardware, software en een besturingssysteem.
  - Je kunt met een stappenplan een eenvoudige storing zelf oplossen.
- **SLO:** primair 21A Digitale systemen. Elementen: 21A-1 (I).
- **Relatie:** bouwt voort op hoofdstuk 1 en voorkennis; komt terug in les 2, les 3, les 5.
- **Evidence:** afsluitcheck.
- **Vaste routine:** Storingsplan.
- **Vakintegratie:** techniek, NaSk.
- **Differentiatie:** basis: Werken met een plaat van een computer en kaartjes per onderdeel. GL/TL-plus: Uitleggen waarom een computer trager wordt met veel open programma's, in eigen woorden.
- **Startscore:** bij de start ziet de leerling zijn nulmetingsscore voor "systemen".

#### Les 2 (HELIX-hoofdstuk 3): Hoe reist jouw bericht over internet?

Wat er gebeurt tussen versturen en ontvangen: netwerk, router, server en datacenter. Slimme apparaten zitten ook op dat netwerk. Wat gebeurt er als het uitvalt, en wat kost het aan energie?

- **Deelonderwerpen:** Van jouw scherm naar een server en terug; Slimme apparaten op het netwerk; Als internet uitvalt: afhankelijk en energie.
- **Leerdoelen:**
  - Je kunt in stappen uitleggen hoe een bericht over internet reist.
  - Je kunt voorbeelden geven van slimme apparaten en uitleggen hoe ze met internet verbonden zijn.
  - Je kunt uitleggen waarom een storing bij een grote dienst veel mensen tegelijk raakt, en dat datacenters veel energie gebruiken.
- **SLO:** primair 21A Digitale systemen. Elementen: 21A-2 (I), 21A-1 (O), 23C-4 (I), 23C-3 (I).
- **Relatie:** bouwt voort op les 1; komt terug in les 3, les 4, les 5, les 21.
- **Evidence:** afsluitcheck.
- **Vakintegratie:** aardrijkskunde, NaSk.
- **Differentiatie:** basis: De route van een bericht als strip met vijf vakken. GL/TL-plus: Opzoeken hoeveel stroom een datacenter in Nederland gebruikt, met bron.
- **Startscore:** bij de start ziet de leerling zijn nulmetingsscore voor "systemen".

#### Les 3 (HELIX-hoofdstuk 4): Samenwerken in de cloud

Werken met OneDrive: een vaste mappenstructuur, duidelijke bestandsnamen, lokaal of in de cloud opslaan, delen met de juiste rechten, samen in één document werken en een oude versie terughalen. Word en OneDrive zijn het middel, niet het doel.

- **Deelonderwerpen:** Mappen en bestandsnamen in OneDrive; Delen: bekijken of bewerken; Samen in één document en versies terughalen.
- **Leerdoelen:**
  - Je kunt in OneDrive een vaste mappenstructuur maken en bestanden een duidelijke naam geven.
  - Je kunt uitleggen wat het verschil is tussen lokaal opslaan en opslaan in de cloud, en een bestand delen met de juiste rechten.
  - Je kunt met een klasgenoot in één document werken en een eerdere versie terughalen.
- **SLO:** primair 21A Digitale systemen. Elementen: 21A-3 (IE), 21A-1 (H).
- **Relatie:** bouwt voort op les 1, les 2; komt terug in les 5, les 12, les 16.
- **Evidence:** een gedeeld document dat samen is bewerkt, met een teruggehaalde versie.
- **Software als middel:** OneDrive, Word.
- **Vakintegratie:** alle vakken.
- **Differentiatie:** basis: Stappenkaart met schermafbeeldingen voor delen en versies. GL/TL-plus: Een map inrichten voor een groepsproject met afspraken over namen en rechten.
- **Startscore:** bij de start ziet de leerling zijn nulmetingsscore voor "systemen".
- **Let op:** Kevin: leerlingen moeten OneDrive en bestanden delen nog leren. Deze les zo vroeg mogelijk in het jaar plannen, zodat andere vakken er direct gebruik van maken.

#### Les 4 (HELIX-hoofdstuk 5): Technologie aan het werk

Welke digitale systemen gebruiken een supermarkt, een ziekenhuis, een garage en de gemeente? Welke beroepen horen daarbij, en welke passen bij jou? Hoe houd je nieuwe ontwikkelingen bij?

- **Deelonderwerpen:** Systemen bij bedrijven en overheid; AI die je al tegenkomt zonder het te merken; Beroepen met technologie, en wat bij jou past.
- **Leerdoelen:**
  - Je kunt bij drie bedrijven of instellingen een digitaal systeem noemen en zeggen welke taak het uitvoert.
  - Je kunt voorbeelden geven van AI-systemen die bedrijven en de overheid gebruiken.
  - Je kunt twee beroepen noemen waarin digitale technologie belangrijk is en uitleggen of ze bij jou passen.
- **SLO:** primair 21A Digitale systemen. Elementen: 21A-4 (I), 21A-5 (I), 21D-2 (I), 23B-5 (I), 21A-2 (H).
- **Relatie:** bouwt voort op les 2; komt terug in les 7, les 14, les 16, les 17, les 21, les 22.
- **Evidence:** afsluitcheck.
- **Vakintegratie:** LOB, mentor, praktijkvakken.
- **Differentiatie:** basis: Kiezen uit vier uitgewerkte werkplekken. GL/TL-plus: Een nieuwe technologische ontwikkeling uit het nieuws beoordelen op mogelijkheden en beperkingen.
- **Startscore:** bij de start ziet de leerling zijn nulmetingsscore voor "systemen".

### Blok B: Veilig en privacy

#### Les 5 (HELIX-hoofdstuk 6): Je accounts op slot

Zwakke plekken in je accounts en apparaten, en hoe je ze dichtzet. Tweestapsverificatie heeft iedereen al aan voor het schoolaccount; in deze les leer je waarom die werkt en wat je doet als je telefoon kwijt is. Daarna: updates, openbaar wifi en een wachtwoordzin voor je andere accounts.

- **Deelonderwerpen:** Waarom tweestapsverificatie werkt; Updates en zwakke plekken; Veilig op openbaar wifi.
- **Leerdoelen:**
  - Je kunt uitleggen waarom tweestapsverificatie je account beter beschermt, en wat je doet als je telefoon kwijt is.
  - Je kunt drie zwakke plekken in een account of apparaat noemen en uitleggen waarom updates belangrijk zijn.
  - Je kunt uitleggen wat je wel en niet doet op een openbaar wifi-netwerk.
- **SLO:** primair 23A Veiligheid en privacy. Elementen: 23A-3 (IE), 21A-1 (H).
- **Relatie:** bouwt voort op les 1, les 2, les 3; komt terug in klas 2.
- **Evidence:** beveiligingscheck van het eigen schoolaccount en de schoollaptop: herstelopties, updates en wachtwoordzin.
- **Vakintegratie:** mentor.
- **Differentiatie:** basis: Controlelijst van vijf punten voor je eigen account. GL/TL-plus: Uitleggen waarom een lange wachtwoordzin sterker is dan een kort ingewikkeld wachtwoord.
- **Startscore:** bij de start ziet de leerling zijn nulmetingsscore voor "veiligheid".
- **Spel om te oefenen:** Wachtwoord Detective (gebouwd).
- **Let op:** Tweestapsverificatie is in de eerste schoolweken bij alle leerlingen ingesteld. Deze les bouwt daarop voort. Telefoons mogen niet in de klas; de check gebeurt op de schoollaptop.

#### Les 6 (HELIX-hoofdstuk 7): Trap er niet in

Phishing, oplichting via games en marktplaatsen, nepberichten van bank of DigiD, datalekken. Wat doe je als het toch misgaat, en hoe ga je om met ongepaste berichten?

- **Deelonderwerpen:** Rode vlaggen in berichten; Oplichting in games, apps en marktplaatsen; Het ging toch mis: wat nu?.
- **Leerdoelen:**
  - Je kunt vijf kenmerken van een phishingbericht herkennen.
  - Je kunt voorbeelden geven van risico's bij het gebruik van diensten van bedrijven en overheid.
  - Je weet wat je doet als je bent opgelicht of een ongepast bericht krijgt.
- **SLO:** primair 23A Veiligheid en privacy. Elementen: 23A-2 (I), 23A-5 (I).
- **Relatie:** bouwt voort op hoofdstuk 1 en voorkennis; komt terug in les 8, les 9, les 11.
- **Evidence:** afsluitcheck.
- **Vakintegratie:** economie, mentor.
- **Differentiatie:** basis: Werken met drie uitgewerkte voorbeeldberichten. GL/TL-plus: Beschrijven wat malware is en hoe het op een apparaat komt (havo-vwo-aanvulling 23A).
- **Startscore:** bij de start ziet de leerling zijn nulmetingsscore voor "veiligheid".

#### Les 7 (HELIX-hoofdstuk 8): Jouw gegevens, jouw rechten

Wat persoonsgegevens zijn, wat bedrijven en de overheid ermee doen, welke toestemmingen apps vragen, en welke rechten de AVG jou geeft.

- **Deelonderwerpen:** Wat zijn persoonsgegevens?; Wat doen apps en bedrijven met jouw data?; Je rechten volgens de AVG.
- **Leerdoelen:**
  - Je kunt uitleggen wat persoonsgegevens zijn en voorbeelden geven.
  - Je kunt de toestemmingen van een app beoordelen met de privacycheck.
  - Je kunt twee rechten noemen die de AVG jou geeft en uitleggen waarom die wet er is.
- **SLO:** primair 23A Veiligheid en privacy. Elementen: 23A-1 (I), 23A-4 (I), 21C-3 (I), 23C-2 (I), 21A-4 (h).
- **Relatie:** bouwt voort op les 4; komt terug in les 9, les 13, les 15, les 21, les 22.
- **Evidence:** afsluitcheck.
- **Vaste routine:** Privacycheck.
- **Vakintegratie:** burgerschap, mens en maatschappij.
- **Differentiatie:** basis: Beoordelen van twee bekende apps met een ingevulde voorbeeldcheck. GL/TL-plus: Een privacyverklaring van een app lezen en drie gegevens noemen die hij verzamelt.
- **Startscore:** bij de start ziet de leerling zijn nulmetingsscore voor "veiligheid".

### Blok C: Informatie en media

#### Les 8 (HELIX-hoofdstuk 9): Slim zoeken

Van vraag naar zoektermen, zoekhulpmiddelen combineren (zoekmachine, filters, woordenboek, AI-zoeker), en achteraf nagaan of je aanpak werkte.

- **Deelonderwerpen:** Van vraag naar zoektermen; Zoekhulpmiddelen combineren; Werkte mijn zoekaanpak?.
- **Leerdoelen:**
  - Je kunt een zoekvraag omzetten in goede zoektermen.
  - Je kunt verschillende zoekhulpmiddelen combineren om iets te vinden.
  - Je kunt uitleggen waarom een zoekaanpak wel of niet goed werkte.
- **SLO:** primair 21B Digitale media en informatie. Elementen: 21B-1 (I), 21B-3 (I), 23A-2 (h).
- **Relatie:** bouwt voort op les 6; komt terug in les 9.
- **Evidence:** afsluitcheck.
- **Vakintegratie:** Nederlands, mens en maatschappij.
- **Differentiatie:** basis: Zoektermen kiezen uit een lijst voordat je zelf formuleert. GL/TL-plus: Zoeken in een vakspecifieke bron, zoals een nieuwsarchief of een woordenboek (havo-vwo-aanvulling 21B).
- **Startscore:** bij de start ziet de leerling zijn nulmetingsscore voor "informatie".

#### Les 9 (HELIX-hoofdstuk 10): De broncheck: echt, nep of twijfel?

Een vaste broncheck voor elke bewering: wie, wanneer, waarom, en klopt het elders? Nepnieuws en deepfakes, en hoe je eigen mening bepaalt wat je gelooft. Oplichters gebruiken deepfakes ook om je geld of gegevens te ontfutselen.

- **Deelonderwerpen:** De broncheck in vier vragen; Nepnieuws en deepfakes; Waarom je gelooft wat je al dacht.
- **Leerdoelen:**
  - Je kunt met de broncheck beoordelen of informatie betrouwbaar en bruikbaar is.
  - Je kunt kenmerken van nepnieuws en deepfakes noemen.
  - Je kunt uitleggen hoe je eigen mening beïnvloedt wat je gelooft.
- **SLO:** primair 21B Digitale media en informatie. Elementen: 21B-2 (IE), 21B-5 (I), 21B-1 (O), 21B-3 (H), 23A-1 (h), 23A-4 (h), 23A-2 (H).
- **Relatie:** bouwt voort op les 6, les 7, les 8; komt terug in les 10, les 15, les 21, les 22.
- **Evidence:** een ingevulde broncheck bij een echte bewering uit het nieuws of van sociale media.
- **Vaste routine:** Broncheck.
- **Vakintegratie:** Nederlands, mens en maatschappij, burgerschap.
- **Differentiatie:** basis: De broncheck met aankruisvakken. GL/TL-plus: Twee bronnen over hetzelfde onderwerp vergelijken en uitleggen welke het bruikbaarst is.
- **Startscore:** bij de start ziet de leerling zijn nulmetingsscore voor "informatie".

#### Les 10 (HELIX-hoofdstuk 11): Hoe sociale media je aandacht vangen

Hoe een feed werkt en waarom je blijft scrollen. Wat het doet met je denken, je stemming, je slaap en je lichaam, en wat jij eraan kunt doen. Je schermtijd noteer je thuis van je eigen telefoon; in de les werk je met die cijfers.

- **Deelonderwerpen:** Hoe een feed bepaalt wat jij ziet; Wat scrollen met je doet; Jouw schermtijd onder de loep.
- **Leerdoelen:**
  - Je kunt uitleggen hoe sociale media je aandacht trekken en vasthouden.
  - Je kunt beschrijven hoe sociale media je denken en gedrag beïnvloeden.
  - Je kunt je eigen schermgebruik bekijken en één verandering kiezen die goed is voor je gezondheid.
- **SLO:** primair 23B Digitale technologie, jezelf en de ander. Elementen: 21B-4 (I), 23B-2 (I), 23B-3 (IE), 21B-5 (H).
- **Relatie:** bouwt voort op les 9; komt terug in les 12, les 14, les 21, les 22.
- **Evidence:** eigen schermtijdoverzicht (thuis genoteerd) met één gekozen verandering.
- **Vakintegratie:** biologie, bewegen en sport, mentor.
- **Differentiatie:** basis: Een ingevuld voorbeeldoverzicht als model. GL/TL-plus: Uitleggen waarom een gratis app toch geld verdient aan jouw aandacht.
- **Startscore:** bij de start ziet de leerling zijn nulmetingsscore voor "sociaal".
- **Spel om te oefenen:** Social Media Zoektocht (gebouwd).
- **Let op:** Telefoons mogen niet in de klas. Plan deze les rond de Week van de mediawijsheid, dan sluit hij aan op wat de school die week doet.

#### Les 11 (HELIX-hoofdstuk 12): Wie ben jij online?

Je online identiteit bewust inrichten, respectvol reageren, en wat je doet bij cyberpesten als slachtoffer of als omstander.

- **Deelonderwerpen:** Je online identiteit; Respectvol reageren; Cyberpesten: kijken of ingrijpen?.
- **Leerdoelen:**
  - Je kunt uitleggen hoe wat je online deelt je online identiteit vormt.
  - Je kunt respectvol reageren, ook als je het ergens niet mee eens bent.
  - Je weet wat je doet bij cyberpesten, als slachtoffer en als omstander.
- **SLO:** primair 23B Digitale technologie, jezelf en de ander. Elementen: 23B-1 (I), 23B-4 (I), 23A-5 (O).
- **Relatie:** bouwt voort op les 6; komt terug in les 13, les 16, les 22.
- **Evidence:** afsluitcheck.
- **Vakintegratie:** mentor, burgerschap.
- **Differentiatie:** basis: Keuzes maken in uitgewerkte situaties. GL/TL-plus: Een eigen profiel beoordelen vanuit de blik van een toekomstige werkgever.
- **Startscore:** bij de start ziet de leerling zijn nulmetingsscore voor "sociaal".
- **Let op:** De Week tegen Pesten valt vroeg in het schooljaar, deze les later. Het vakmoment bij de mentor (V11) vangt dat op; de les verwijst terug naar die week.

### Blok D: Data en AI

#### Les 12 (HELIX-hoofdstuk 13): Onderzoek met data

Een eigen vraag beantwoorden met een kleine dataset: ordenen in een spreadsheet, een grafiek maken, een conclusie trekken, en zeggen wat de data niet laten zien.

- **Deelonderwerpen:** Van vraag naar data; Ordenen en een grafiek maken; Wat de data niet laten zien.
- **Leerdoelen:**
  - Je kunt met een kleine dataset een vraag beantwoorden.
  - Je kunt data ordenen in een spreadsheet en er een passende grafiek van maken.
  - Je kunt uitleggen waarom een dataset maar een deel van de werkelijkheid laat zien.
- **SLO:** primair 21C Data. Elementen: 21C-1 (IE), 21C-2 (IE), 21A-3 (O), 21B-4 (h), 23B-2 (h).
- **Relatie:** bouwt voort op les 3, les 10; komt terug in les 13, les 14, les 16, les 21, les 22.
- **Evidence:** mini-onderzoek: vraag, data, grafiek, conclusie en één beperking.
- **Vaste routine:** Datacheck.
- **Software als middel:** Excel.
- **Vakintegratie:** wiskunde, NaSk.
- **Differentiatie:** basis: Werken met een klaargezette dataset en een grafiek die al half af is. GL/TL-plus: Een open dataset gebruiken, bijvoorbeeld van het CBS (havo-vwo-aanvulling 21C).
- **Startscore:** bij de start ziet de leerling zijn nulmetingsscore voor "data".

#### Les 13 (HELIX-hoofdstuk 14): Van data naar AI

Hoe bedrijven en overheid datagestuurd werken, en hoe AI uit data leert. Het verschil tussen een systeem met vaste regels en een AI die op kansen werkt, en waarom slechte data slechte AI oplevert.

- **Deelonderwerpen:** Datagestuurd werken; Vaste regels of leren van voorbeelden; Slechte data, slechte AI.
- **Leerdoelen:**
  - Je kunt voorbeelden geven van hoe bedrijven en de overheid data gebruiken om beslissingen te nemen.
  - Je kunt het verschil uitleggen tussen een systeem met vaste regels en een AI-systeem.
  - Je kunt uitleggen waarom de kwaliteit van data bepaalt hoe goed een AI werkt.
- **SLO:** primair 21C Data. Elementen: 21C-4 (I), 21C-5 (I), 21D-1 (I), 21D-3 (I), 21C-3 (O), 21C-1 (H), 23B-1 (h), 23B-4 (h).
- **Relatie:** bouwt voort op les 7, les 11, les 12; komt terug in les 14, les 15, les 16, les 22.
- **Evidence:** afsluitcheck.
- **Vakintegratie:** wiskunde, economie.
- **Differentiatie:** basis: Sorteren van tien voorbeelden in 'vaste regel' of 'leert van data'. GL/TL-plus: Beschrijven wat machine learning is (havo-vwo-aanvulling 21D).
- **Startscore:** bij de start ziet de leerling zijn nulmetingsscore voor "data".

#### Les 14 (HELIX-hoofdstuk 15): Maak kennis met generatieve AI

Een speelse kennismaking: tekst en beeld maken met Copilot. Hoe het werkt (het volgende woord of pixel voorspellen), wat het goed kan en waar het misgaat. Een klein experiment: leer een computer sorteren met voorbeelden.

- **Deelonderwerpen:** Maken met Copilot; Hoe voorspelt AI?; Experiment: leer de computer sorteren.
- **Leerdoelen:**
  - Je kunt met Copilot een tekst en een afbeelding maken.
  - Je kunt uitleggen dat generatieve AI voorspelt en niet weet.
  - Je kunt met een klein experiment laten zien dat de voorbeelden bepalen wat een AI leert.
- **SLO:** primair 21D Artificiële Intelligentie (AI). Elementen: 21D-2 (O), 21D-3 (O), 21D-5 (I), 21A-5 (H), 21C-5 (H), 23B-3 (h), 21C-2 (h).
- **Relatie:** bouwt voort op les 4, les 10, les 12, les 13; komt terug in les 18, les 20, les 21, les 22.
- **Evidence:** afsluitcheck.
- **Software als middel:** Copilot.
- **Vakintegratie:** Nederlands, kunst.
- **Differentiatie:** basis: Werken met drie kant-en-klare prompts om mee te beginnen. GL/TL-plus: Twee AI-antwoorden op dezelfde vraag vergelijken en verklaren waarom ze verschillen.
- **Startscore:** bij de start ziet de leerling zijn nulmetingsscore voor "ai".
- **Let op:** 21D-5 licht ingevuld: geen echt model trainen (keuze Kevin), wel een sorteerexperiment met voorbeelden. Zwakke plek.

#### Les 15 (HELIX-hoofdstuk 16): AI als studiemaatje

AI inzetten om te leren in plaats van om het werk over te nemen: Copilot laat jou vragen beantwoorden, zoals een goede docent. Met de AI-check controleer je elk antwoord, en je weet wat wel en niet mag bij schoolwerk. Wat deel je wel en niet met een AI, en wat doet Microsoft met jouw gesprek?

- **Deelonderwerpen:** Laat AI jou vragen stellen; De AI-check; Eerlijk gebruik bij schoolwerk.
- **Leerdoelen:**
  - Je kunt Copilot zo instrueren dat hij je helpt leren in plaats van het antwoord te geven.
  - Je kunt een AI-antwoord controleren met de AI-check en een fout verbeteren.
  - Je kunt uitleggen wanneer AI-gebruik bij schoolwerk eerlijk is en wanneer niet.
- **SLO:** primair 21D Artificiële Intelligentie (AI). Elementen: 21D-4 (IE), 21D-1 (H), 21B-2 (H), 21C-4 (h), 23A-1 (H), 23A-4 (H).
- **Relatie:** bouwt voort op les 7, les 9, les 13; komt terug in les 17, les 21, les 22.
- **Evidence:** een leergesprek met Copilot plus een gecontroleerd en verbeterd antwoord.
- **Vaste routine:** AI-check.
- **Software als middel:** Copilot.
- **Vakintegratie:** Nederlands, moderne vreemde talen, alle vakken.
- **Differentiatie:** basis: Een vaste openingsprompt voor het leergesprek. GL/TL-plus: Zelf een prompt ontwerpen die Copilot dwingt om vragen te stellen en geen antwoorden te geven.
- **Startscore:** bij de start ziet de leerling zijn nulmetingsscore voor "ai".

### Blok E: Ontwerpen en maken

#### Les 16 (HELIX-hoofdstuk 17): Ontwerpen voor een doelgroep

Een digitaal product voor een echt doel op school of in de buurt: informeren, overtuigen of iets in beweging zetten. Doelgroep, ontwerpeisen, een eerste versie, feedback en een tweede versie. Beeld dat je mag gebruiken. PowerPoint of Word is het middel. Feedback geef je respectvol en concreet.

- **Deelonderwerpen:** Doel, doelgroep en ontwerpeisen; Versie 1, feedback, versie 2; Beeld dat je mag gebruiken.
- **Leerdoelen:**
  - Je kunt voor een doelgroep ontwerpeisen opstellen en daarmee een digitaal product maken.
  - Je kunt je product verbeteren na feedback en uitleggen wat je veranderde en waarom.
  - Je kunt beeld gebruiken dat je mag gebruiken, met de juiste bronvermelding.
- **SLO:** primair 22A Creëren met digitale technologie. Elementen: 22A-2 (IE), 22A-3 (I), 22A-4 (IE), 22A-5 (IE), 23C-1 (I), 21A-3 (O), 23B-5 (h), 23B-1 (O).
- **Relatie:** bouwt voort op les 3, les 4, les 11, les 12, les 13; komt terug in les 17, les 18, les 20, les 21, les 22.
- **Evidence:** product met ontwerpeisen, versie 1, feedback en versie 2.
- **Vaste routine:** Ontwerpcyclus.
- **Software als middel:** PowerPoint of Word.
- **Vakintegratie:** kunst, Nederlands, praktijkvakken.
- **Differentiatie:** basis: Een sjabloon met vaste ontwerpeisen om uit te kiezen. GL/TL-plus: Het product testen bij twee echte gebruikers en de uitkomst verwerken.
- **Startscore:** bij de start ziet de leerling zijn nulmetingsscore voor "producten".

#### Les 17 (HELIX-hoofdstuk 18): Jouw animatie: storyboard en karakters

Een eigen kort verhaal uitdrukken in beeld: een storyboard maken en karakters ontwerpen met prompts in Copilot. Wie is eigenaar van een AI-beeld? Extra opdracht: de animatie echt maken. Welke beroepen maken dit soort beeld?

- **Deelonderwerpen:** Van idee naar storyboard; Karakters maken met prompts; Van wie is een AI-beeld?.
- **Leerdoelen:**
  - Je kunt een idee of gevoel uitwerken in een storyboard van zes beelden.
  - Je kunt met prompts in Copilot karakters maken die passen bij je verhaal.
  - Je kunt uitleggen wat je wel en niet mag met beeld dat door AI is gemaakt.
- **SLO:** primair 22A Creëren met digitale technologie. Elementen: 22A-1 (IE), 22A-4 (O), 22A-5 (O), 21D-4 (O), 22A-2 (h), 23B-5 (H).
- **Relatie:** bouwt voort op les 4, les 15, les 16; komt terug in les 21, les 22.
- **Evidence:** storyboard met karakters; extra opdracht: de animatie zelf.
- **Vaste routine:** Ontwerpcyclus.
- **Software als middel:** Copilot, PowerPoint.
- **Vakintegratie:** kunst, Nederlands.
- **Differentiatie:** basis: Een storyboard met drie vaste beelden en drie eigen beelden. GL/TL-plus: De animatie afmaken en presenteren (extra opdracht).
- **Startscore:** bij de start ziet de leerling zijn nulmetingsscore voor "producten".

#### Les 18 (HELIX-hoofdstuk 19): Denken als een programmeur

Een probleem zo opknippen dat een computer het kan uitvoeren: taak en doel beschrijven, een algoritme bedenken en tekenen als stroomschema. Eerst zonder computer.

- **Deelonderwerpen:** Wat moet het programma doen?; Het algoritme als stroomschema; Kan een computer dit oplossen?.
- **Leerdoelen:**
  - Je kunt beschrijven wat de taak en het doel van een programma zijn.
  - Je kunt een algoritme bedenken en tekenen als stroomschema.
  - Je kunt een probleem opdelen in stappen die een computer kan uitvoeren.
- **SLO:** primair 22B Programmeren. Elementen: 22B-1 (I), 22B-2 (I), 22B-5 (I), 22A-3 (H), 21D-5 (h).
- **Relatie:** bouwt voort op les 14, les 16; komt terug in les 19, les 20.
- **Evidence:** afsluitcheck.
- **Vakintegratie:** wiskunde, techniek.
- **Differentiatie:** basis: Een stroomschema aanvullen waarin een paar stappen al staan. GL/TL-plus: Een probleem uit een ander vak omzetten in een algoritme (havo-vwo-aanvulling 22A).
- **Startscore:** bij de start ziet de leerling zijn nulmetingsscore voor "programmeren".

#### Les 19 (HELIX-hoofdstuk 20): Programmeren: events, lijsten en logica

Een klein blokprogramma dat reageert op een klik (event), een lijst gebruikt en beslist met en, of en niet. Testen met verschillende invoer, een fout vinden en uitleggen wat je programma doet.

- **Deelonderwerpen:** Events: het programma reageert; Lijsten en logica; Testen, fouten zoeken en uitleggen.
- **Leerdoelen:**
  - Je kunt een programma maken dat reageert op een event, zoals een klik.
  - Je kunt in een programma een lijst en een voorwaarde met en of of gebruiken.
  - Je kunt een programma testen, een fout verbeteren en in eigen woorden uitleggen wat het doet.
- **SLO:** primair 22B Programmeren. Elementen: 22B-3 (IE), 22B-4 (IE), 22B-2 (O), 22B-1 (O), 22B-5 (h).
- **Relatie:** bouwt voort op les 18; komt terug in les 20.
- **Evidence:** werkend programma met korte uitleg en een verbeterde fout.
- **Vakintegratie:** wiskunde, techniek.
- **Differentiatie:** basis: Een half af programma aanvullen. GL/TL-plus: Het programma uitbreiden met een eigen functie en die documenteren.
- **Startscore:** bij de start ziet de leerling zijn nulmetingsscore voor "programmeren".

#### Les 20 (HELIX-hoofdstuk 21): Programmeren: maak je eigen spel

Wat je in les 19 leerde, zet je in voor een eigen mini-spel: een event start het spel, een lijst houdt iets bij en een voorwaarde met en of of beslist wie wint. Een klasgenoot test je spel met een testlijst, en jij verbetert het.

- **Deelonderwerpen:** Je spel ontwerpen op papier; Bouwen met events, lijsten en logica; Laten testen en verbeteren.
- **Leerdoelen:**
  - Je kunt een eigen spelidee omzetten in een algoritme en een werkend blokprogramma.
  - Je kunt in je spel een event, een lijst en een voorwaarde met en of of gebruiken.
  - Je kunt het spel van een klasgenoot testen met een testlijst en je eigen spel verbeteren na zijn feedback.
- **SLO:** primair 22B Programmeren. Elementen: 22B-3 (OE), 22B-4 (OE), 22B-5 (O), 22B-2 (O), 22A-3 (H), 21D-5 (h).
- **Relatie:** bouwt voort op les 14, les 16, les 18, les 19; komt terug in klas 2.
- **Evidence:** eigen mini-spel met ingevulde testlijst en een verbetering.
- **Vakintegratie:** wiskunde, techniek.
- **Differentiatie:** basis: Een spelsjabloon waarin het event al staat; de leerling vult lijst en voorwaarde aan. GL/TL-plus: Een tweede level toevoegen dat een variabele of lijst uit het eerste level gebruikt.
- **Startscore:** bij de start ziet de leerling zijn nulmetingsscore voor "programmeren".

### Blok F: Technologie en samenleving

#### Les 21 (HELIX-hoofdstuk 22): Technologie, samenleving en jij

Een dilemma over de toekomst, bekeken vanuit vier kanten: ethisch, sociaal, economisch en ecologisch. Wie maakt de regels voor technologie en AI, en hoe afhankelijk zijn we van een paar grote bedrijven? Welke rol spelen sociale media in het debat?

- **Deelonderwerpen:** Een dilemma van vier kanten; Wie maakt de regels?; Hoe afhankelijk zijn we?.
- **Leerdoelen:**
  - Je kunt een dilemma over technologie beschrijven en vanuit vier perspectieven bekijken.
  - Je kunt uitleggen waarom er regels zijn voor technologie, zoals de AVG en de Europese AI-wet.
  - Je kunt met een voorbeeld uitleggen hoe afhankelijk de samenleving is van grote technologiebedrijven.
- **SLO:** primair 23C Digitale technologie, samenleving en wereld. Elementen: 23C-5 (IE), 23C-3 (TE), 23C-2 (H), 23C-4 (H), 23C-1 (H), 21B-2 (T), 21B-4 (H), 21A-5 (H), 22A-1 (h).
- **Relatie:** bouwt voort op les 2, les 4, les 7, les 9, les 10, les 12, les 14, les 15, les 16, les 17; komt terug in les 22.
- **Evidence:** beargumenteerde mening over een dilemma vanuit vier perspectieven, met gecheckte bronnen.
- **Vaste routine:** Broncheck.
- **Vakintegratie:** mens en maatschappij, burgerschap.
- **Differentiatie:** basis: Perspectiefkaarten met een voorbeeldzin per perspectief. GL/TL-plus: Een standpunt verdedigen in een kort debat.
- **Startscore:** bij de start ziet de leerling zijn nulmetingsscore voor "samenleving".

#### Les 22 (HELIX-hoofdstuk 23): Eindproject: een campagne voor brugklassers

Afsluiting van het jaar in één product. De klas verzamelt data over schermgebruik, slaap of online gedrag, en elke leerling maakt een korte campagne voor andere brugklassers, met eerlijke cijfers, gecheckte bronnen en de ontwerpcyclus. De eindmeting maken leerlingen daarna in HELIX buiten de les.

- **Deelonderwerpen:** Wat zeggen onze eigen data?; De campagne ontwerpen en maken; Terugkijken: wat kun jij nu?.
- **Leerdoelen:**
  - Je kunt data uit je eigen klas gebruiken als onderbouwing, en zeggen wat die data niet laten zien.
  - Je kunt een digitaal product maken dat een doelgroep informeert of overtuigt, met de ontwerpcyclus.
  - Je kunt met voorbeelden uit dit jaar laten zien wat je hebt geleerd over technologie, jezelf en de ander.
- **SLO:** primair 22A Creëren met digitale technologie. Elementen: 21C-2 (T), 21C-1 (H), 22A-2 (TE), 22A-1 (H), 22A-4 (O), 23B-2 (H), 23B-3 (H), 23B-4 (H), 23C-1 (T), 21B-2 (H), 21C-4 (h), 21A-4 (h).
- **Relatie:** bouwt voort op les 4, les 7, les 9, les 10, les 11, les 12, les 13, les 14, les 15, les 16, les 17, les 21; komt terug in klas 2.
- **Evidence:** campagneproduct met eigen klasdata, bronnen en een korte verantwoording.
- **Vaste routine:** Datacheck, Broncheck, Ontwerpcyclus.
- **Software als middel:** PowerPoint, Excel of Copilot, naar keuze.
- **Vakintegratie:** mentor, Nederlands, wiskunde.
- **Differentiatie:** basis: Een campagnesjabloon met vaste onderdelen en een klaargezette klasgrafiek. GL/TL-plus: De campagne testen bij twee leerlingen uit een andere klas en de reactie verwerken.
- **Startscore:** bij de start ziet de leerling zijn nulmetingsscore voor "producten".

## 4. Dekkingsmatrix: kerndoel x les

Codering: **I** introductie, **O** oefenen, **H** herhalen in een nieuwe context, **h** terugblikvraag, **T** toepassen in een grotere opdracht, **E** evidence. Een sterretje (*) betekent: dit kerndoel is in deze les primair.

| | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **21A** | I* | IO* | IHE* | IH* | H |  | h |  |  |  |  | O |  | H |  | O |  |  |  |  | H | h |
| **21B** |  |  |  |  |  |  |  | I* | IOHE* | IH |  | h |  |  | H |  |  |  |  |  | HT | H |
| **21C** |  |  |  |  |  |  | I |  |  |  |  | IE* | IOH* | Hh | h |  |  |  |  |  |  | HhT |
| **21D** |  |  |  | I |  |  |  |  |  |  |  |  | I | IO* | IHE* |  | O | h |  | h |  |  |
| **22A** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | IE* | IOhE* | H |  | H | h | OHTE* |
| **22B** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | I* | IOhE* | OE* |  |  |
| **23A** |  |  |  |  | IE* | I* | I* | h | Hh |  | O |  |  |  | H |  |  |  |  |  |  |  |
| **23B** |  |  |  | I |  |  |  |  |  | IE* | I* | h | h | h |  | Oh | H |  |  |  |  | H |
| **23C** |  | I |  |  |  |  | I |  |  |  |  |  |  |  |  | I |  |  |  |  | IHTE* | T |

## 5. Controle op de 45 elementen

| Element | Introductie | Oefenen / herhalen / toepassen | Evidence | Aantal lessen | Signaal |
| --- | --- | --- | --- | --- | --- |
| 21A-1 | 1 | 2, 3, 5 | - | 4 | geen product-evidence |
| 21A-2 | 2 | 4 | - | 2 | geen product-evidence |
| 21A-3 | 3 | 12, 16 | 3 | 3 | in orde |
| 21A-4 | 4 | 7h, 22h | - | 3 | alleen terugblikvraag; geen product-evidence |
| 21A-5 | 4 | 14, 21 | - | 3 | geen product-evidence |
| 21B-1 | 8 | 9 | - | 2 | geen product-evidence |
| 21B-2 | 9 | 15, 21, 22 | 9 | 4 | in orde |
| 21B-3 | 8 | 9 | - | 2 | geen product-evidence |
| 21B-4 | 10 | 21, 12h | - | 3 | geen product-evidence |
| 21B-5 | 9 | 10 | - | 2 | geen product-evidence |
| 21C-1 | 12 | 13, 22 | 12 | 3 | in orde |
| 21C-2 | 12 | 22, 14h | 12 | 3 | in orde |
| 21C-3 | 7 | 13 | - | 2 | geen product-evidence |
| 21C-4 | 13 | 15h, 22h | - | 3 | alleen terugblikvraag; geen product-evidence |
| 21C-5 | 13 | 14 | - | 2 | geen product-evidence |
| 21D-1 | 13 | 15 | - | 2 | geen product-evidence |
| 21D-2 | 4 | 14 | - | 2 | geen product-evidence |
| 21D-3 | 13 | 14 | - | 2 | geen product-evidence |
| 21D-4 | 15 | 17 | 15 | 2 | in orde |
| 21D-5 | 14 | 18h, 20h | - | 3 | alleen terugblikvraag; geen product-evidence |
| 22A-1 | 17 | 22, 21h | 17 | 3 | in orde |
| 22A-2 | 16 | 22, 17h | 16, 22 | 3 | in orde |
| 22A-3 | 16 | 18, 20 | - | 3 | geen product-evidence |
| 22A-4 | 16 | 17, 22 | 16 | 3 | in orde |
| 22A-5 | 16 | 17 | 16 | 2 | in orde |
| 22B-1 | 18 | 19 | - | 2 | geen product-evidence |
| 22B-2 | 18 | 19, 20 | - | 3 | geen product-evidence |
| 22B-3 | 19 | 20 | 19, 20 | 2 | in orde |
| 22B-4 | 19 | 20 | 19, 20 | 2 | in orde |
| 22B-5 | 18 | 20, 19h | - | 3 | geen product-evidence |
| 23A-1 | 7 | 15, 9h | - | 3 | geen product-evidence |
| 23A-2 | 6 | 9, 8h | - | 3 | geen product-evidence |
| 23A-3 | 5 | - | 5 | 1 | alleen geïntroduceerd |
| 23A-4 | 7 | 15, 9h | - | 3 | geen product-evidence |
| 23A-5 | 6 | 11 | - | 2 | geen product-evidence |
| 23B-1 | 11 | 16, 13h | - | 3 | geen product-evidence |
| 23B-2 | 10 | 22, 12h | - | 3 | geen product-evidence |
| 23B-3 | 10 | 22, 14h | 10 | 3 | in orde |
| 23B-4 | 11 | 22, 13h | - | 3 | geen product-evidence |
| 23B-5 | 4 | 17, 16h | - | 3 | geen product-evidence |
| 23C-1 | 16 | 21, 22 | - | 3 | geen product-evidence |
| 23C-2 | 7 | 21 | - | 2 | geen product-evidence |
| 23C-3 | 2 | 21 | 21 | 2 | in orde |
| 23C-4 | 2 | 21 | - | 2 | geen product-evidence |
| 23C-5 | 21 | - | 21 | 1 | alleen geïntroduceerd |

Samenvatting: alle 45 elementen worden geïntroduceerd. 40 komen daarna inhoudelijk terug; 3 alleen via een terugblikvraag (21A-4, 21C-4, 21D-5); 2 worden alleen geïntroduceerd (23A-3, 23C-5). 15 elementen hebben een product als evidence; de andere 30 alleen de afsluitcheck van de les.

## 6. Per kerndoel

| Kerndoel | Eerste introductie | Primaire lessen | Oefenen | Herhalen | Toepassen | Evidence | Zwakke plekken |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 21A Digitale systemen | les 1 | 1, 2, 3, 4 | 2, 12, 16 | 3, 4, 5, 7, 14, 21, 22 | - | 3 | maar één keer inhoudelijk: 21A-4 |
| 21B Digitale media en informatie | les 8 | 8, 9 | 9 | 9, 10, 12, 15, 21, 22 | 21 | 9 | - |
| 21C Data | les 7 | 12, 13 | 13 | 13, 14, 15, 22 | 22 | 12 | maar één keer inhoudelijk: 21C-4 |
| 21D Artificiële Intelligentie (AI) | les 4 | 14, 15 | 14, 17 | 15, 18, 20 | - | 15 | maar één keer inhoudelijk: 21D-5 |
| 22A Creëren met digitale technologie | les 16 | 16, 17, 22 | 17, 22 | 17, 18, 20, 21, 22 | 22 | 16, 17, 22 | - |
| 22B Programmeren | les 18 | 18, 19, 20 | 19, 20 | 19 | - | 19, 20 | - |
| 23A Veiligheid en privacy | les 5 | 5, 6, 7 | 11 | 8, 9, 15 | - | 5 | maar één keer inhoudelijk: 23A-3 |
| 23B Digitale technologie, jezelf en de ander | les 4 | 10, 11 | 16 | 12, 13, 14, 16, 17, 22 | - | 10 | - |
| 23C Digitale technologie, samenleving en wereld | les 2 | 21 | - | 21 | 21, 22 | 21 | maar één keer inhoudelijk: 23C-5 |

## 7. Differentiatie op curriculumniveau

Eén leerlijn voor alle leerlingen. Dezelfde leerdoelen, dezelfde lessen,
dezelfde evidence. Het verschil zit in hoeveel steun en hoeveel uitdaging.

| Niveau | Wat de leerling krijgt | Voorbeelden in dit ontwerp |
| --- | --- | --- |
| Basis | meer steun: voorbeelden vooraf, halfvolle sjablonen, keuze uit opties voordat je zelf formuleert | stappenkaart bij delen (les 3), klaargezette dataset (les 12), half af programma (les 19), spelsjabloon (les 20) |
| Kader | het ontwerp zoals het staat: zelfstandig toepassen met een vaste routine | de broncheck, de datacheck en de ontwerpcyclus zonder extra steun |
| GL/TL | een plusopdracht met meer analyse, argumentatie of transfer | de vijf havo-vwo-aanvullingen van SLO als plusopdracht: vakspecifiek zoeken (les 8), malware (les 6), open data (les 12), machine learning (les 13), een probleem uit een ander vak als algoritme (les 18) |

De havo-vwo-aanvullingen tellen niet mee voor de dekking. Ze zijn er alleen
als verdieping.

## 8. Een gemeenschappelijke taal

Zes routines die DV aanleert en die andere vakken kunnen gebruiken. De namen
zijn een voorstel.

| Routine | Aangeleerd in | Wat het is | Waar vakken hem kunnen gebruiken |
| --- | --- | --- | --- |
| Storingsplan | les 1 | stap voor stap een digitaal probleem zelf oplossen | elk vak, bij elke laptopstoring |
| Privacycheck | les 7 | wat vraagt deze app of dienst van mij, en is dat nodig? | mentor, bij nieuwe schoolapps |
| Broncheck | les 9 | wie, wanneer, waarom, en klopt het elders? | Nederlands, mens en maatschappij, elk werkstuk |
| Datacheck | les 12 | welke vraag, welke data, wat laten ze niet zien? | wiskunde, NaSk, economie |
| AI-check | les 15 | wat vroeg ik, klopt het, wat is van mij? | elk vak waar AI mag |
| Ontwerpcyclus | les 16 | doel, doelgroep, eisen, versie 1, feedback, versie 2 | kunst, praktijkvakken, projecten |

De uitwerking voor vakdocenten (docentkaarten, voorbeelden) volgt in fase 4.

## 9. Wat dit ontwerp wel en niet waarmaakt

### 9.1 Zwakke plekken

- **21D-5, experimenteren met het trainen van AI**, is licht ingevuld met een
  sorteerexperiment in les 14 (akkoord Kevin). Het komt daarna alleen terug
  als terugblikvraag.
- **23C, de samenleving, zit vooral in les 21.** De elementen worden eerder
  aangestipt (les 2, 7 en 16) en 23C-1 komt terug in het eindproject, maar
  23C-5 (dilemma's) komt maar één keer voor.
- **23A-3 (beveiligen)** staat in les 5 en was ook al onderdeel van hoofdstuk 1.
  Daarna komt het in de 22 lessen niet meer terug.
- **21A-4 en 21C-4** (systemen en datagestuurd werken bij bedrijven en
  overheid) komen na hun introductie alleen terug als terugblikvraag.

### 9.2 Formele dekking tegenover duurzaam leren

De controle in hoofdstuk 5:

- alle **45** elementen worden geïntroduceerd;
- **40** komen daarna inhoudelijk terug in een andere les;
- **3** komen alleen terug als terugblikvraag (21A-4, 21C-4, 21D-5);
- **2** worden alleen geïntroduceerd (23A-3, 23C-5);
- **15** elementen hebben een product als evidence, **30** alleen de
  afsluitcheck.

Met twintig lessen waren het nog 31, 12 en 2. De twee extra lessen
(programmeren oefenen en het eindproject) halen vooral programmeren, data en
welzijn uit de gevarenzone. Wat overblijft is het verschil tussen "één of twee
keer echt gedaan" en "zo vaak geoefend dat het blijft". Dat is het onderwerp
van fase 3.

### 9.3 Wat naar klas 2 gaat

- **21C-2, 21C-4**: een groter data-onderzoek met een eigen vraag;
- **22A**: een groter maakproject, bijvoorbeeld de animatie helemaal af;
- **22B**: programmeren verdiepen, met variabelen, functies en andermans code;
- **21A-4, 21D-5, 23C-5**: technologie in beroepen, AI en dilemma's;
- **23A-3**: beveiliging opnieuw, nu met apparaten thuis en slimme apparaten.

## 10. Besluiten op de open punten

| Punt | Besluit |
| --- | --- |
| 21D-5 | sorteerexperiment in les 14 is akkoord |
| Animatie | storyboard met karakters is les 17; de animatie zelf is de extra opdracht |
| Eindmeting | in HELIX buiten de les, na het eindproject |
| Namen van de routines | akkoord |
| Aantal lessen | 22 (les 20 programmeren oefenen en les 22 eindproject zijn toegevoegd) |
