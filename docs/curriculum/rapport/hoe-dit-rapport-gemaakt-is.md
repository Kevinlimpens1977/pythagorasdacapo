# Hoe het MT-rapport gemaakt is

Geschreven op 20 september 2026, zodat iemand anders, of een ander taalmodel,
hetzelfde rapport kan maken. Het beschrijft de opdracht, de bronnen, de
werkwijze en de bestanden.

Het rapport zelf: `exports/curriculum/Digitale-geletterdheid-vmbo-rapport-MT.pdf`
(19 pagina's A4), met `...-MT.html` ernaast. De map `exports/` staat buiten git.

## 1. De opdracht

Kevin gaf een uitgeschreven opdracht van ongeveer 3000 woorden. De kern, in
de volgorde die het werk bepaalde:

1. **Eerst onderzoeken, niet bouwen.** Een harde grens: geen hoofdstukken
   aanmaken, geen database wijzigen, geen dashboard implementeren, geen
   lescontent genereren. Pas bouwen na expliciete goedkeuring van een apart
   implementatieplan.
2. **Werk binnen het bestaande kader.** De opbouw van hoofdstukken, paragrafen
   en lesblokken in HELIX ligt vast, net als de manier waarop presentaties
   worden gemaakt. De opdracht bepaalt *wat* leerlingen leren; de bestaande
   skill `/helix-hoofdstuk-bouwen` bepaalt *hoe* het later lesmateriaal wordt.
3. **Onderzoek de actuele SLO-kerndoelen zelf** en maak onderscheid tussen
   officiële inhoud, de juridische status, aanbevelingen en eigen keuzes.
   Nooit doen alsof SLO een aantal lessen voorschrijft.
4. **Maak een canonieke SLO-matrix** met per kerndoel de onderliggende
   onderdelen, en gebruik die als enige inhoudelijke bron.
5. **Onderscheid curriculumdekking van leerlingbeheersing.** "Beheerst" mag
   alleen als er bewijs per leerling is.
6. **Audit wat er al is** in HELIX, inclusief de nulmeting, en forceer geen
   SLO-code op bestaande lessen.
7. **Brainstorm eerst over prioriteiten**: een keuzekaart van 12 tot 20 thema's
   en maximaal acht gerichte beslisvragen met opties en consequenties.
8. **Stel lastige vragen**; bevestig niet automatisch de aannames van de
   opdrachtgever.
9. **Scenario's**: 20 lessen, 40 lessen en een hybride model, vergeleken voor
   het MT, met nadruk op het verschil tussen dekking en duurzaam leren.
10. **Doorlopende leerlijn klas 1 tot 4**, vakintegratie, gemeenschappelijke
    taal, projecten, beoordelen als AI beschikbaar is, toekomstscenario's en
    een dashboardconcept.
11. **Daarna pas het rapport**, met 25 voorgeschreven hoofdstukken, zakelijk,
    zonder marketingtaal, zelfstandig leesbaar voor iemand die HELIX niet kent.
12. **Fasering**: onderzoek, curriculum, scenario's, leerlijn, rapport,
    technisch plan. Na elke fase stoppen en wachten.

Daarnaast gelden de vaste projectafspraken uit `CLAUDE.md`: Nederlands, korte
zinnen, geen emoji, elk schrijvend script eerst als dry run, en niets
committen of pushen zonder dat Kevin erom vraagt.

## 2. De beslissingen van Kevin onderweg

Het rapport is geen model-eigen product: zeven keuzes van Kevin bepalen de
inhoud. Ze zijn hem als meerkeuzevragen voorgelegd, met de gevolgen erbij.

| Keuze | Antwoord |
| --- | --- |
| Dekking | alle 45 vmbo-elementen in klas 1 |
| Lessen | 20, later 22 |
| Al gegeven lessen | tellen niet mee |
| Eenheid | één les is één HELIX-hoofdstuk met zijn paragrafen |
| Office | integreren in andere lessen, geen eigen lessen |
| Programmeren | introduceren in klas 1, verdiepen in klas 2 |
| AI | geen model trainen; generatieve AI als kennismaking; AI als socratisch studiemaatje; animatie met storyboard en Copilot |
| Nulmeting | iedereen dezelfde lijn; elke leerling ziet zijn eigen startscore |
| MT | meerdere scenario's met voor- en nadelen, geen pleidooi |

## 3. Bronnen

### Officieel

| Bron | Gebruikt voor |
| --- | --- |
| SLO (2026), *Kerndoelen voortgezet onderwijs*, derde druk, 15 april 2026: https://www.slo.nl/publish/pages/23189/kerndoelen-voortgezet-onderwijs-slo-2026-derde-druk.pdf | de negen kerndoelen, de 45 vmbo-onderdelen, de havo-vwo-aanvullingen, de begrippenlijst |
| SLO, *Veelgestelde vragen actualisatie kerndoelen* (bijgewerkt 10 september 2026): https://www.slo.nl/thema/meer/actualisatie-kerndoelen-examenprogramma/actualisatie-kerndoelen/veelgestelde-vragen/ | wettelijke status, invoering, onderbouw van twee jaar, 70 procent onderwijstijd, doeltypen |
| SLO, *Kerndoelen digitale geletterdheid*: https://www.slo.nl/thema/meer/actualisatie-kerndoelen-examenprogramma/actualisatie-kerndoelen/definitieve-conceptkerndoelen-digitale/ | status "definitief concept" |
| SLO, *Het curriculum verandert*: https://www.actualisatiekerndoelen.nl/updates/het-curriculum-verandert-wat-kun-je-wanneer-verwachten | overgangsrecht en augustus 2031 |
| DaCapo College: https://dacapokijktnaarmij.nl, met de *Lessentabel 2026-2027* en de *Schoolgids 2026-2027* | vakken per leerweg, DIF-uren, LOB, profielen, telefoonbeleid, themaweken |

### Ter vergelijking

| Bron | Gebruikt voor |
| --- | --- |
| Wikiwijs, arrangement *Digitale Geletterdheid* van DaCapo: https://maken.wikiwijs.nl/216903 | wat de school nu geeft: 20 lessen, geen data, geen programmeren |
| Tintara: https://www.tintara.nl, met de vmbo-jaarplanning leerjaar 1 | benchmark voor didactische kwaliteit; niet overgenomen, want het materiaal mag niet worden herpubliceerd |
| Perkins, Furze, Roe en MacVaugh (2024), *The AI Assessment Scale* | basis voor de AI-ladder van vijf treden |

### Uit het project zelf

- `docs/seeds/digitale-vaardigheden-vmbo1.seed.json`: het oude DV-aanbod van
  acht hoofdstukken, met SLO-codes per paragraaf.
- `docs/seeds/nulmeting-dv/`: de 54 vragen en het analysemodel.
- Firestore, alleen gelezen: de live hoofdstukken, de klassen met hun
  toewijzingen, 122 startprofielen uit `nulmetingProfielen`.
- `src/lib/gameRegistry.js`: de gebouwde en geplande spellen.
- `docs/OnderzoekEnBrainstormDV.md`: het eerdere ontwerp van 30 lessen.

## 4. Werkwijze

### Fase 1, onderzoek

1. De SLO-bundel opgehaald en de tekst uitgelezen (`pypdf`), daarna het
   hoofdstuk digitale geletterdheid woord voor woord gelezen. De 45
   vmbo-onderdelen zijn met de hand genummerd als `21A-1` tot `23C-5`; SLO
   nummert ze niet.
2. De status opgezocht in de FAQ, niet uit het geheugen.
3. De lessentabel en schoolgids van DaCapo gelezen; de lessentabel is als
   afbeelding bekeken, omdat de kolommen in platte tekst door elkaar lopen.
4. Het bestaande aanbod geaudit: per hoofdstuk onderwerp, dekking en advies.
5. De nulmeting geanalyseerd: welke onderdelen worden gemeten, welke niet, en
   de uitslag per onderdeel over 122 leerlingen.
6. Daarna een keuzekaart van 18 thema's en acht beslisvragen.

### Fase 2, curriculum

Het curriculum staat in **één bestand**, `docs/curriculum/dv-klas1-curriculum.json`.
Dat is de enige bron; elke tabel in de documenten komt daaruit. Per les staan
erin: titel, blok, focus, deelonderwerpen, leerdoelen, evidence, vakintegratie,
differentiatie, het onderdeel van de nulmeting, en per SLO-element de rol:

| Rol | Betekenis |
| --- | --- |
| I | introductie |
| O | oefenen |
| H | herhalen in een nieuwe context |
| h | korte terugblikvraag |
| T | toepassen in een grotere opdracht |
| E | evidence: de leerling maakt een product |

`docs/curriculum/genereer-fase2.mjs` leest dat bestand en maakt het overzicht,
de lessen in detail, de dekkingsmatrix en de controle op de 45 elementen. Het
script stopt als een element nergens wordt geïntroduceerd. Zo kan het
curriculum niet stilletjes uit de pas lopen met de tabellen.

### Fase 3, scenario's

`docs/curriculum/dv-scenarios.json` bevat de achttien extra lessen van het
40-lessenscenario en de zestien vakmomenten van het hybride model.
`docs/curriculum/genereer-fase3.mjs` rekent per scenario dezelfde maatstaven
uit over de 45 onderdelen: geïntroduceerd, inhoudelijk terug, stevig verankerd
(twee keer of vaker), alleen introductie, met product als evidence, toegepast
in een ander vak, en het gemiddelde aantal herhalingen.

Die cijfers dragen het rapport. Ze zijn niet geschat maar geteld.

### Fase 5, het rapport

- Bron: `docs/curriculum/rapport/rapport-dv-mt.md`, met plaatshouders
  `{{DEKKINGSMATRIX}}`, `{{SCENARIOCIJFERS}}`, `{{VAKMOMENTEN}}`,
  `{{LESSENOVERZICHT}}` en `{{DOCENTKAARTEN}}`.
- Bouwscript: `docs/curriculum/rapport/bouw-rapport.py`. Het draait de twee
  generatoren, haalt de tabellen eruit, leest de docentkaarten uit het
  fase-4-document, zet de Markdown om naar HTML (`python-markdown` met de
  extensies `tables`, `md_in_html` en `sane_lists`), plakt er een eigen
  stylesheet omheen en laat Edge in headless-stand een A4-PDF afdrukken
  (`--headless --no-pdf-header-footer --print-to-pdf`).
- De opmaak zit in dat script: titelpagina, blauw #0f4c81, Segoe UI,
  paginanummers en voettekst via `@page`-marges, tabellen op 9 punt, kaarten
  voor de docentkaarten.

Bijwerken gaat met één commando:

```bash
python docs/curriculum/rapport/bouw-rapport.py
```

## 5. Bestanden

| Bestand | Wat het is |
| --- | --- |
| `docs/curriculum/dv-leerlijn-fase1-onderzoek.md` | SLO-analyse, audit, nulmeting, keuzekaart, beslisvragen |
| `docs/curriculum/dv-klas1-curriculum.json` | het curriculum van 22 lessen; enige bron |
| `docs/curriculum/dv-leerlijn-fase2-curriculum-klas1.md` | de lessen, de matrix en de controle |
| `docs/curriculum/dv-scenarios.json` | extra lessen en vakmomenten |
| `docs/curriculum/dv-leerlijn-fase3-scenarios.md` | de scenario's met cijfers en voor- en nadelen |
| `docs/curriculum/dv-leerlijn-fase4-klas1-4.md` | leerlijn klas 1 tot 4, routines, docentkaarten, AI-ladder |
| `docs/curriculum/genereer-fase2.mjs`, `genereer-fase3.mjs` | de generatoren |
| `docs/curriculum/rapport/rapport-dv-mt.md` | de tekst van het rapport |
| `docs/curriculum/rapport/bouw-rapport.py` | maakt HTML en PDF |
| `exports/curriculum/Digitale-geletterdheid-vmbo-rapport-MT.pdf` | het rapport |

## 6. Hetzelfde nog eens laten maken

Geef een ander model deze opdracht:

> Maak een beslisdocument voor de teamleiding over digitale geletterdheid in
> het vmbo. Werk in fasen en stop na elke fase.
>
> **Fase 1.** Zoek de actuele kerndoelen digitale geletterdheid op bij SLO en
> gebruik alleen officiële bronnen. Lees per kerndoel de punten onder "het gaat
> hierbij om" en nummer ze; dat zijn de onderdelen waarop je later telt. Zoek
> ook de juridische status op en zeg er expliciet bij wat officieel is en wat
> jouw analyse. Kijk daarna wat de school nu doet: de lessentabel, de
> schoolgids, het bestaande lesmateriaal en de resultaten van een eventuele
> nulmeting. Lever een keuzekaart van 12 tot 20 thema's en maximaal acht
> beslisvragen met opties en gevolgen. Vraag door, bevestig niet.
>
> **Fase 2.** Maak het curriculum in één machineleesbaar bestand: per les de
> leerdoelen, de gekoppelde onderdelen en de rol per onderdeel (introductie,
> oefenen, herhalen, terugblik, toepassen, evidence). Schrijf een script dat
> daaruit de planning, de dekkingsmatrix en een controle genereert, en dat
> stopt als een onderdeel nergens wordt geïntroduceerd.
>
> **Fase 3.** Leg de scenario's vast in een tweede bestand en reken met een
> script per scenario dezelfde maatstaven uit. Vergelijk op cijfers, niet op
> gevoel, en schrijf geen pleidooi.
>
> **Fase 4.** Werk de doorlopende lijn uit, de rol van andere vakken, de vaste
> routines met docentkaarten, projecten, beoordelen terwijl AI beschikbaar is,
> en toekomstscenario's.
>
> **Fase 5.** Schrijf het rapport zelfstandig leesbaar voor iemand die het
> platform niet kent. Laat de tabellen door het bouwscript invullen, zodat ze
> niet uit de pas lopen. Zakelijk, geen marketingtaal, en per uitspraak
> duidelijk of het officieel is, een analyse, een keuze of een scenario.

Drie regels die de kwaliteit bepalen:

1. **Eén bron voor de cijfers.** Tabellen in een rapport die met de hand zijn
   overgetypt, kloppen na de eerste wijziging niet meer.
2. **Tel wat je beweert.** "Stevig verankerd" moet een definitie hebben en
   geteld worden, anders is het een mening.
3. **Scheid officieel van eigen keuze.** Dat is wat het document bruikbaar
   maakt in een gesprek met een MT.

## Versie 2.0 (22 september 2026)

Wat er is veranderd ten opzichte van versie 1, en hoe je het reproduceert:

1. **Hoofdstuk 7 is herschreven** met de nulmeting per leerweg. De cijfers komen
   uit `node docs/curriculum/nulmeting-stand-per-niveau.mjs`, dat de losse
   antwoorden (`voortgang/{uid}_{blockId}/items`) optelt per basis-, kader- en
   tl-klas. De stand van 22 september staat als JSON in
   `docs/curriculum/nulmeting-stand-2026-09-22.json`.
2. **De inclusieklas H1i1 staat er bewust naast**, niet in de vergelijking: die
   klas maakte een verkorte nulmeting (twee keer twintig vragen). Dat is in het
   rapport expliciet benoemd, omdat een half vergelijkbare score erger is dan
   geen score.
3. **Het is een momentopname.** Dat staat er twee keer bij: in de
   managementsamenvatting en in 7.1. De laatste tweede delen komen in dezelfde
   week binnen.
4. **De schermafbeelding van het startprofiel** maak je met
   `node docs/curriculum/rapport/maak-startprofiel-figuur.mjs`. Dat script bouwt
   de kaart op met dezelfde HTML als `NulmetingProfielKaart.jsx` en de gebouwde
   CSS van de app, en schiet hem met Edge headless naar
   `exports/curriculum/startprofiel-voorbeeld.png`. De leerling is verzonnen;
   dezelfde gegevens staan als profiel op het testaccount `testleerling-h1k2`,
   zodat je de kaart ook in de app zelf kunt bekijken.
5. **Paragraaf 7.5 beschrijft alleen wat werkt.** Extra uitleg per onderdeel,
   de herstelopdracht of uitdaging aan het eind van een paragraaf
   (`buildParagraphEndPlan`) en de tweede kans met de Digidocent (huisregels in
   `DEFAULT_MASTER_RULES`) draaien vandaag. Dat de lesroute straks automatisch
   op het startprofiel begint, staat er als nog te bouwen bij.
6. Bouwen: `python docs/curriculum/rapport/bouw-rapport.py`. Het versienummer
   staat op de titelpagina in `rapport-dv-mt.md` en in de voettekst in
   `bouw-rapport.py`.
