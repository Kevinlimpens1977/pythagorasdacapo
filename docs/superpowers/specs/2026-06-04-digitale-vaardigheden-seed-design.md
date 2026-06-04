# Digitale Vaardigheden VMBO 1 Seed Design

Datum: 2026-06-04  
Status: ter review  
Doel: een complete JSON-seed ontwerpen voor het vak Digitale vaardigheden, leerjaar 1, niveau VMBO.

## 1. Scope

De seed maakt nog geen databasewijzigingen. De seed wordt eerst als bestand aangemaakt:

`docs/seeds/digitale-vaardigheden-vmbo1.seed.json`

Daarna kan in een volgende stap een importscript of CMS-importflow worden ontworpen.

De seed bevat:

- 1 vak: Digitale vaardigheden.
- 1 leerjaar: leerjaar 1.
- 1 gedeeld niveau: VMBO.
- 5 hoofdstukken.
- 30 paragrafen.
- Gepubliceerde lesrouteblokken per paragraaf.
- Slidedeck-placeholder als eerste blok in elke paragraaf.
- Leerlingklare theorie, media, opdrachten, vragen, quizzen/toetsen, summaries en gameplaceholders.
- Interne bronmetadata per blok.
- Badge- en certificaatmetadata.

## 2. Datamodelkeuze

De bestaande HELIX-hiërarchie blijft leidend:

`vak -> leerjaar -> niveau -> hoofdstuk -> paragraaf -> contentBlocks`

Het vak wordt één keer opgebouwd voor alle leerwegen in leerjaar 1:

- `vak.name`: Digitale vaardigheden
- `leerjaar.year`: 1
- `leerjaar.label`: Leerjaar 1
- `niveau.label`: VMBO

Alle klassen uit leerjaar 1 kunnen later aan dezelfde content gekoppeld worden. Er komt geen aparte kopie voor basis, kader of gt.

## 3. Hoofdstukken en paragrafen

De seed gebruikt de vastgestelde hoofdstukstructuur:

| Hoofdstuk | Paragrafen |
|---|---|
| H1: Starten en Account & Veilig | 1.1-1.6 |
| H2: Werken met Microsoft | 2.1-2.6 |
| H3: Veilig en Mediawijs | 3.1-3.6 |
| H4: Data en Bronnen | 4.1-4.6 |
| H5: AI, Code en Portfolio | 5.1-5.6 |

Paragraaftitels, kerndoelen, producten, tokenrichtlijnen, media en gameconcepten komen uit:

`docs/LessenserieDigitaleVaardigheden30Lessen.md`

## 4. Contentbloktypes

Bestaande bloktypes blijven:

- `slidedeck`
- `theory`
- `example`
- `media`
- `question`
- `summary`
- `game`

Nieuwe bloktypes worden ontworpen voor afsluiting:

- `quiz`
- `toets`

`question` blijft bestaan voor tussenvragen onderweg. `quiz` en `toets` zijn afsluitblokken.

## 5. Quiz en toets

Quiz en toets gebruiken dezelfde onderliggende vraag-item-structuur, maar krijgen andere instellingen en presentatie.

### Quiz

Een quiz is snel, speels en formatief. Geschikte itemtypes:

- flashcard
- ja/nee
- waar/niet waar
- meerkeuze
- categorie-sleep
- snelle match
- korte reflectie

Standaard:

- gewone paragrafen eindigen met `quiz`;
- quizzen mogen onbeperkt geoefend worden;
- herhalen levert standaard geen extra tokens op;
- presentatie is licht en oefengericht.

### Toets

Een toets is formeler bewijs van begrip of vaardigheid. Geschikte itemtypes:

- meerkeuze
- open
- invullen
- volgorde
- verbinden
- drag-and-drop
- hotspot
- scenario/casus
- praktijkcheck/rubric

Standaard:

- checkpointparagrafen eindigen met `toets`;
- paragraaf 5.6 gebruikt een eindtoets;
- gewone toetsen hebben maximaal 2 pogingen;
- checkpointtoetsen en eindtoetsen hebben standaard 1 poging;
- docent kan later heropenen of resetten.

## 6. Route-opbouw

Elke paragraaf begint altijd met een `slidedeck`-placeholder.

Daarna volgen inhoudsblokken op basis van onderwerp:

- 1 of meer korte `theory`-blokken;
- waar passend `media`;
- 1 of meer `question`-blokken voor tussentijdse checks;
- `example` alleen waar het echt iets toevoegt.

De vaste afsluiting is:

`summary -> quiz/toets -> game`

Als een game in het lessenserie-document staat, komt er een `game`-blok als laatste blok. In het huidige lessenserie-document staat bij alle 30 paragrafen een gameconcept. Daarom bevat de seed 30 gameplaceholders.

## 7. Gameplaceholders

De bestaande generieke gameplaceholders mogen vervallen als die niet bij Digitale vaardigheden passen.

De seed bevat gameplaceholders met de gamenamen en concepten uit het lessenserie-document, zoals:

- Account Escape
- Password Lab
- Hardware Hunt
- Phishing Detective
- Microsoft Maker Challenge
- Privacy Thermometer
- Bronbattle
- Dashboard Dash
- Prompt Duel
- Certificaat Quest Finale

Elke gameplaceholder bevat:

- `gameId`
- `title`
- `description`
- `subject`: Digitale vaardigheden
- `level`: VMBO leerjaar 1
- `estimatedMinutes`: 3-7 minuten
- `status`: planned
- `cmsEmbeddable`: true
- `tokenRewardPotential`

De echte games worden later gebouwd.

## 8. Tokens

Tokens staan los van badges en certificaten.

Standaard:

- gewone paragraaf: ongeveer 100 tokens totaal;
- checkpointparagraaf: meestal 120 tokens totaal;
- eindexpo/paragraaf 5.6: 150 tokens totaal.

Afsluitblokken:

- gewone quiz: tokenwaarde volgens paragraafverdeling, meestal 15 tokens;
- gewone toets als die later wordt gekozen: vergelijkbaar met quiz;
- hoofdstukcheckpoint-toets: 50 tokens;
- eindtoets in 5.6: 25 tokens.

Tokens zijn motivatie en toekomstige shopwaarde. Tokens bepalen geen badge of certificaat.

## 9. Badges en certificaten

Badges worden automatisch toegekend per afgerond hoofdstuk:

- Account Starter: paragrafen 1.1-1.6
- Microsoft Maker: paragrafen 2.1-2.6
- Veilig & Mediawijs: paragrafen 3.1-3.6
- Data & Bron Detective: paragrafen 4.1-4.6
- Digitaal Vaardig: paragrafen 5.1-5.6

Leerlingen kunnen ontbrekende paragrafen later afronden. Een gemiste badge blijft herstelbaar.

Certificaten:

- Basis-certificaat: 4 van 5 badges + herstelportfolio + eindreflectie.
- Volledig certificaat: 5 van 5 badges + portfolio + eindreflectie.

Er komt geen expertcertificaat.

## 10. Theorie en bronnen

Theorieblokken worden leerlingklaar geschreven in vmbo-vriendelijke taal:

- korte zinnen;
- duidelijke tussenkopjes;
- concrete schoolvoorbeelden;
- liever meerdere korte theorieblokken dan één lange tekst;
- meestal 80-160 woorden per theorieblok.

Waar onderwerpen overlappen, wordt theorie deels gebaseerd op:

`docs/wikiwijs_dacapo_huidige lessen.json`

De gemiddelde lengte en toon van Wikiwijs worden gevolgd. Overlappende thema's zijn onder andere:

- start schooljaar en inloggen;
- Outlook;
- OneDrive;
- veilig wachtwoord;
- device, hardware en software;
- veilig internet;
- privacy en digitale voetafdruk;
- Word;
- PowerPoint;
- social media;
- cyberpesten;
- nepnieuws;
- AI en chatbots.

Voor onderdelen die minder of niet in Wikiwijs staan, wordt inhoud didactisch aangevuld op basis van het lessenserie-document en SLO/Kennisnet-lijn, zoals Excel, data, bronnen met data, algoritmes en programmeren.

## 11. Bronmetadata

Elk blok mag interne bronmetadata krijgen:

- `sourceBasis`: bijvoorbeeld `wikiwijs`, `slo-kennisnet`, `lessenserie-md`, `ai-aanvulling`, of combinaties.
- `sourceNotes`: korte interne toelichting.

Deze velden zijn alleen voor CMS/importcontrole en docentreview. Ze mogen niet zichtbaar zijn in de leerlingweergave.

## 12. Publicatiestatus

Alles in de seed wordt gepubliceerd aangemaakt:

- vak actief;
- leerjaar actief;
- niveau actief;
- hoofdstukken gepubliceerd;
- paragrafen gepubliceerd;
- contentblokken gepubliceerd;
- quiz/toets-items gepubliceerd;
- gameplaceholders zichtbaar in de lesroute.

De school gebruikt HELIX nog niet met leerlingen, dus de inhoud kan daarna nog rustig in CMS worden aangepast.

## 13. Acceptatiecriteria

De seed is geslaagd als:

- er precies 1 vak, 1 leerjaar, 1 niveau, 5 hoofdstukken en 30 paragrafen in staan;
- elke paragraaf start met een `slidedeck`-placeholder;
- elke paragraaf leerlingklare contentblokken bevat;
- elke paragraaf eindigt met `summary -> quiz/toets -> game`;
- checkpoints en eindexpo een `toets` gebruiken;
- gewone paragrafen een `quiz` gebruiken;
- de totale tokenwaarde per paragraaf overeenkomt met de richtlijnen;
- media-links uit het lessenserie-document zijn verwerkt;
- gameplaceholders overeenkomen met de gameconcepten uit het document;
- SLO-kerndoelcodes behouden blijven;
- `sourceBasis` niet zichtbaar bedoeld is voor leerlingen.

