export const DEFAULT_NOTEBOOK_PROMPT_NAME = 'Algemene digibordles VMBO/EOA';

export const DEFAULT_NOTEBOOK_PROMPT = `===== BEGIN PROMPT NOTEBOOKLM ALGEMENE DIGIBORDLES VMBO/EOA =====
ONDERWERP VAN DE LES: [vul hier onderwerp/paragraaf in]
NIVEAU: VMBO / EOA
LESFOCUS: klassikale uitleg op het digibord met stap-voor-stap leerlingvragen

Maak een duidelijke, didactische presentatie / slide deck in het Nederlands voor een VMBO/EOA-klas.

Gebruik ALLEEN de toegevoegde bronbestanden:
- theoriepagina's
- voorbeeldopgaven
- leerdoelen
- afbeeldingen
- schema's
- opdrachten
- paragraafmateriaal

Verzin geen nieuwe theorie die niet in de bronnen staat. Je mag voorbeelden didactisch herschrijven, maar inhoudelijk moet alles kloppen met de bron.

DOEL VAN DE PRESENTATIE
De presentatie moet geschikt zijn voor een klassikale uitleg op het digibord.
De leerlingen moeten stap voor stap begrijpen:
1. Wat het onderwerp is.
2. Wat ze moeten leren.
3. Welke begrippen belangrijk zijn.
4. Hoe een voorbeeldopgave wordt aangepakt.
5. Hoe ze daarna zelf kunnen oefenen.

DOELGROEP
- VMBO
- EOA / taalzwakkere leerlingen
- Leerlingen die baat hebben bij rustige, visuele en stapsgewijze uitleg

ALGEMENE STIJL
- Light mode
- Rustige, moderne onderwijsstijl
- Grote goed leesbare letters
- Veel witruimte
- Maximaal een denkstap per slide
- Korte zinnen
- Geen volle tekstpagina's
- Duidelijke koppen
- Geschikt voor digibord
- Gebruik visuele ondersteuning: pijlen, highlights, cirkels, kleurvlakken, iconen en schema's
- Gebruik waar mogelijk dezelfde visuele stijl als een helder schoolboek
- Zorg voor vaste opbouw en consistente vormgeving in alle slides

VASTE SLIDE-OPBOUW

SLIDE 1 - TITELPAGINA
Maak een rustige beginpagina.
Titel: gebruik het hoofdonderwerp van de paragraaf.
Ondertitel: korte uitleg waar de les over gaat.
Visueel: een passende afbeelding, schema of illustratie uit de bron of afgeleid van de bron.

SLIDE 2 - LEERDOELEN
Titel:
Leerdoelen

Gebruik deze opbouw:
Wat je gaat leren:

- Je leert ...
- Je leert ...
- Je leert ...
- Je oefent met ...

Maak deze slide als rustige leerdoelenkaart met lichte achtergrond en duidelijke tekst.

SLIDE 3 - VOORKENNIS / STARTVRAAG
Begin met een eenvoudige leerlingvraag.
Laat leerlingen eerst nadenken. Geef het antwoord nog niet meteen.

SLIDE 4 - ANTWOORD OP STARTVRAAG
Geef een kort en visueel antwoord. Gebruik markeringen in afbeelding, tekst of opgave.

SLIDE 5 T/M 8 - BELANGRIJKE BEGRIPPEN
Introduceer de belangrijkste begrippen uit de bron. Gebruik steeds vraag-slide en antwoord-slide.

THEORIE-UITLEG
Leg de theorie uit in kleine stappen. Splits elke redenering op in losse slides.

VOORBEELDOPGAVEN
Gebruik minimaal 2 voorbeeldopgaven uit de bron. Werk elke voorbeeldopgave langzaam uit.

LEERLINGVRAGEN
Gebruik regelmatig leerlingvragen tussen de uitleg door en geef na elke leerlingvraag een aparte antwoordslide.

TAALSTEUN VOOR EOA
Maak de taal eenvoudig. Leg moeilijke woorden kort uit. Gebruik korte zinnen.

VISUELE REGELS
Gebruik groen voor goed/bekend/gegeven, blauw voor uitleg/stappen, oranje/geel voor aandacht en rood alleen voor waarschuwing of veelgemaakte fout.

VEELGEMAAKTE FOUTEN
Maak een aparte slide met 2 of 3 veelgemaakte fouten en hoe leerlingen die voorkomen.

OEFENSLIDE
Maak daarna een oefenslide: Nu jij. Geef nog geen antwoord op dezelfde slide.

ANTWOORDSLIDE OEFENING
Geef daarna de uitwerking stap voor stap.

SAMENVATTING
Maak een duidelijke samenvattingsslide met belangrijkste begrippen, stappen en een korte onthoudzin.

AFSLUITING
Laatste slide: Klaar om te oefenen. Eindig met: Pak je schrift. We gaan oefenen.

BELANGRIJKE KWALITEITSEISEN
- Maak de presentatie niet te snel.
- Geen grote sprongen in de uitleg.
- Elke slide moet klassikaal bespreekbaar zijn.
- Gebruik de bron als inhoudelijke basis.
- Houd de stijl consequent.
- Denk als een docent die op het digibord stap voor stap uitlegt.
- Zorg dat zwakkere leerlingen de uitleg kunnen volgen.
- Zorg dat sterkere leerlingen actief blijven door korte denkvragen.

OUTPUT
Maak een volledig slide deck met duidelijke slidetitels.
Beschrijf per slide:
- titel
- tekst op de slide
- visueel idee
- eventuele docent-/spreektekst

===== END PROMPT NOTEBOOKLM ALGEMENE DIGIBORDLES VMBO/EOA =====`;

export const fillNotebookPrompt = (templateBody = DEFAULT_NOTEBOOK_PROMPT, title = '') =>
  String(templateBody || DEFAULT_NOTEBOOK_PROMPT).replace('[vul hier onderwerp/paragraaf in]', title || '[vul hier onderwerp/paragraaf in]');
