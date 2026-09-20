---
name: helix-hoofdstuk-bouwen
description: Bouwt van aangeleverd lesmateriaal (PDF, Word, tekst, presentaties) een volledig hoofdstuk in de HELIX-lesbibliotheek: vraagt door om de lesstof didactisch sterker te maken, zet hem om in lesblokken, plaatst de presentaties en wijst het hoofdstuk toe aan de juiste klassen. Gebruik deze skill zodra Kevin lesmateriaal aanlevert voor Binask of Digitale vaardigheden, een nieuw hoofdstuk of nieuwe paragrafen wil klaarzetten, een slidedeck aan de bibliotheek wil toevoegen, of lesstof wil klaarzetten voor de EOA-klassen of de H1-klassen. Ook gebruiken als hij niet het woord "hoofdstuk" noemt maar alleen een PDF stuurt met "zet dit klaar voor mijn klas" of "kun je hier lesblokken van maken".
---

# Een hoofdstuk bouwen voor de HELIX-bibliotheek

Kevin levert lesstof aan zoals hij hem heeft: een PDF met de tekst van een
hoofdstuk, plus losse presentaties per paragraaf. Jouw werk is dat om te zetten
naar lesblokken die een leerling stap voor stap doorloopt, en die daarna echt
zichtbaar te maken voor de goede klassen.

Het gaat om live lesmateriaal van ruim honderd leerlingen. Een fout is geen
mislukte build maar een leerling die morgen voor een lege of dubbele les zit.
Daarom staat hieronder een vaste volgorde, en bij elke stap wat er misgaat als
je hem overslaat.

## Voorwaarden

Werk in de HELIX-repo (`C:\Projecten\helix leerplatform`). Staan de scripts uit
stap 2 tot 8 er niet, dan zit je in de verkeerde map; zeg dat en stop.

De scripts praten met Firestore via Application Default Credentials. Bestaat die
inlog niet, dan falen ze met een duidelijke melding; los dat op voordat je
verder gaat in plaats van er omheen te werken.

## De volgorde

1. Bestanden verzamelen en lezen
2. Vak, hoofdstuknummer en klassen vaststellen
3. Indeling voorstellen en laten goedkeuren
4. Vraagronde met Kevin
5. Verrijking voorstellen en laten aanvinken
6. Bouwen: bron-JSON, seed, import, snapshots, decks
7. Toewijzen aan de klassen
8. Controleren en rapporteren

Stap 3 tot 5 gaan over inhoud, stap 6 tot 8 over plaatsen. Sla de inhoudelijke
stappen niet over omdat de bron "al af" lijkt: Kevin vraagt deze skill juist aan
omdat hij wil dat de les rijker wordt dan de PDF die hij aanlevert.

---

## Stap 1. Bestanden

Vraag welke bestanden erbij horen als hij ze niet al genoemd heeft. Kijk uit
zichzelf in `C:\Users\kevli\Downloads` en noem wat je daar vindt dat past bij
het onderwerp, zodat hij alleen hoeft te bevestigen.

Je hebt meestal twee soorten:

- **de lesstof**: één PDF of tekstbestand met de hele inhoud van het hoofdstuk.
  Lees hem helemaal. Kan de Read-tool de PDF niet renderen, haal de tekst er dan
  uit met `pypdf` of PyMuPDF en schrijf hem naar je scratchpad; werk daarna uit
  dat tekstbestand.
- **de presentaties**: één PDF per paragraaf. Die lees je niet uit; je koppelt
  ze in stap 6 aan de juiste paragraaf.

Ontbreekt de lesstof en is er alleen een presentatie, zeg dat dan. Van dia's
alleen valt geen leestekst te maken zonder te gaan verzinnen, en verzinnen is
precies wat hier niet mag.

## Stap 2. Vak, nummer en klassen

Vraag eerst voor welk vak het is. Het antwoord bepaalt alle id's, welke klassen
het krijgen en welk toewijzingsscript je straks draait. Zie
`references/vakken.md` voor beide vakken, inclusief de klas-id's en de
leerroutes. Verzin nooit een id of een klasnaam; als je twijfelt, lees de
bibliotheek uit met een klein leesscript.

Stel daarna het eerstvolgende vrije hoofdstuknummer voor. Lees dat uit
Firestore, niet uit je geheugen:

```bash
node -e "const{createRequire}=require('module');const r=createRequire('C:/Projecten/helix leerplatform/functions/package.json');const{applicationDefault,getApps,initializeApp}=r('firebase-admin/app');const{getFirestore}=r('firebase-admin/firestore');if(!getApps().length)initializeApp({credential:applicationDefault(),projectId:'pythagoras-eoa'});getFirestore().collection('hoofdstuk').where('vakId','==','vak-binask-eoa').get().then(s=>{s.docs.forEach(d=>console.log(d.get('number'),d.get('title'),d.id,d.get('niveauId')));process.exit(0)})"
```

Vraag de titel van het hoofdstuk. Bestaat het nummer al binnen dezelfde
leerroute, meld dat dan en ga niet verder: twee hoofdstukken met hetzelfde
nummer betekent dat een leerling twee keer "Hoofdstuk 3" in zijn lijst ziet.

Het veld `number` bepaalt de volgorde op de leerlingpagina. Een hoofdstuk zonder
nummer sorteert achteraan, dus ook achter hoofdstukken die er later bij komen.
Zet hem altijd.

## Stap 3. Indeling voorstellen

Lees de bron en stel de paragraafindeling voor: per paragraaf een code, een
titel, de leerdoelen en de rij lesblokken. Laat die lijst zien en laat Kevin
schuiven voordat je ook maar één blok schrijft. Hij kent zijn klas; jij kent
alleen de PDF.

De gebruikelijke opbouw van een paragraaf, zoals in Binask hoofdstuk 2:

presentatie, theorie, voorbeeld, eventueel een tweede theorie en voorbeeld,
schriftopdracht, samenvatting, korte check.

De presentatie volgt altijd het design system; zie
`references/slidedeck-designsysteem.md`.

Welke bloktypen er zijn en wat er per type in moet staat in
`references/bronformaat.md`.

**Schriftopdrachten, 10-minutenchecks en afsluitende checks zijn `theory`-blokken
met een genummerde lijst.** Geen `question`, geen `quiz`, geen `toets`. De
leerling werkt in zijn schrift; er is geen invoerveld, er wordt niets nagekeken
en er staan geen antwoorden in de leerlingversie. Maak je er toch een quiz van,
dan krijgt de leerling een cijfer voor werk dat op papier hoort en ziet hij bij
het terugkijken de antwoorden staan.

Bij Binask horen schriftopdrachten er standaard bij. Bij Digitale vaardigheden
niet: daar zijn de opdrachten digitaal.

## Stap 4. Vraagronde

Eerst vijf vragen over het hoofdstuk als geheel:

1. Voor welke klas of klassen is dit, en wat weten die leerlingen al?
2. Hoeveel lessen heb je ervoor?
3. Waar loopt het elk jaar stuk?
4. Wat moeten ze aan het eind zeker kunnen?
5. Is er iets dat er dit jaar anders in moet dan vorig jaar?

Daarna per paragraaf twee of drie gerichte vragen. Vraag niet naar wat al in de
bron staat; vraag naar wat er niet in staat en wat de les beter maakt. De
volledige vragenbank staat in `references/vraagronde.md`.

Stel de vragen in groepjes, niet één voor één. Kevin zit hier met beperkte tijd
tussen twee lessen.

## Stap 5. Verrijking voorstellen

Laat per paragraaf zien wat je wilt toevoegen en waarom, en laat hem per
voorstel ja of nee zeggen. Bijvoorbeeld: een voorbeeld uit hun leefwereld, een
tussenstap in een berekening, een misvatting expliciet benoemen, een kernbegrip
erbij.

Voeg niets toe dat hij niet gezien heeft. Dit is zijn lesmateriaal en hij staat
ermee voor de klas. De natuurkunde, de getallen en de opdrachten uit de bron
verander je sowieso niet.

## Stap 6. Bouwen

Eén importweg, altijd dezelfde. Bouw geen vakspecifieke variant van een script
dat er al staat: dan bestaan er twee wegen naar dezelfde collectie en wijkt de
ene stilletjes af van de andere.

**Leg eerst de beginstand vast.** Schrijf een klein leesscript dat per bestaand
hoofdstuk de paragrafen, blok-id's en het aantal voortgangsrecords wegschrijft
naar je scratchpad. Zonder die nulmeting kun je achteraf niet aantonen dat je
aan bestaande hoofdstukken en aan voortgang niets hebt veranderd, en dat is
precies wat Kevin wil weten.

**Draai elke stap eerst zonder `--apply`.** De dry run laat zien wat er gaat
gebeuren; pas als dat klopt draai je hem opnieuw met `--apply`.

### 6a. Bron-JSON schrijven

Schrijf het hoofdstuk als één bestand in `docs/seeds/`, in het formaat van
`docs/LESBLOKKEN-AANLEVERFORMAAT.md` met de extra `meta`-velden die de scripts
nodig hebben. Zie `references/bronformaat.md` voor het volledige formaat en een
voorbeeld.

Twee dingen die makkelijk misgaan:

- **Kernbegrippen horen in de html**, als `<dl>` met `<dt>` en `<dd>`. Het veld
  `content.keyTerms` wordt wel bewaard maar niet aan de leerling getoond; zet je
  ze alleen daar, dan ziet hij ze nooit.
- **Formules en tekens letterlijk overnemen.** Zet de tekens die er precies zo
  moeten staan in `meta.controleerTeksten`, bijvoorbeeld `ρ = m / V` of
  `g/cm³`. De generator weigert dan te bouwen als ze onderweg verminkt zijn. Een
  ρ die een p wordt maakt de hele paragraaf fout.

### 6b. Seed bouwen

```bash
node scripts/bouw-hoofdstuk-seed.mjs --bron docs/seeds/<bestand>.json --toon
node scripts/bouw-hoofdstuk-seed.mjs --bron docs/seeds/<bestand>.json
```

`--toon` bouwt alles op en print het zonder iets te schrijven. Het script
controleert onderweg op dubbele id's, lege blokken, invoervelden in de lesstof
en zichtbare antwoorden, en stopt bij een probleem in plaats van het door te
laten lekken naar de bibliotheek.

Het maakt geen slidedeck-blokken: die hebben een PDF in Storage nodig en komen
in 6e. Daarom begint een paragraaf mét presentatie bij volgnummer 2.

### 6c. Importeren

```bash
node scripts/import-binask-eoa-seed-to-firestore.mjs
node scripts/import-binask-eoa-seed-to-firestore.mjs --apply
```

Voor Digitale vaardigheden is het `scripts/import-digitale-vaardigheden-seed-to-firestore.mjs`
met `--seed <pad>`; zie `references/vakken.md`, want daar zit een valkuil met de
gegenereerde DV-seed.

**Gebruik nooit `--koppel-klassen`.** Dat zet een leerroute op een klas. ER3L2A
staat bewust zonder route zodat die klas de lesstof van leerjaar 1 ziet; zet je
er een route op, dan verdwijnt die lesstof uit beeld voor twaalf leerlingen.

`--wijs-toe` alleen bewust gebruiken. Toewijzen doe je liever in stap 7, met het
script dat per leerling controleert wat hij werkelijk ziet.

Vergelijk voor de zekerheid eerst wat de import aan bestaande documenten zou
veranderen: de seed schrijft met merge, dus een veld dat in de seed anders staat
dan live overschrijft de live waarde.

### 6d. Publieke snapshots

```bash
node scripts/backfill-public-content-snapshots.mjs --hoofdstuk <hoofdstukId> --apply
```

Een leerling leest niet uit `contentBlocks` maar uit `publicContentBlocks`.
Zonder deze stap staat het hoofdstuk er wel, maar ziet de leerling lege blokken.

Laat `--hoofdstuk` niet weg: zonder dat filter herschrijft het script alle
snapshots van het hele platform, inclusief vakken waar je niets mee te maken
hebt.

### 6e. Presentaties

**Elk deck volgt het Helix Slide Design System.** Lees
`references/slidedeck-designsysteem.md` voordat je een deck maakt. Daar staat
de masterprompt, de promptvelden per dia en het contract. Twee regels die je
niet mag overslaan:

1. **In de bron**: voeg naast de lesstof de tekst van het design system toe als
   tweede bron in NotebookLM (`sources/designsysteem/designsysteem-tekst.txt`).
2. **In de prompt**: gebruik de masterprompt uit dat bestand, met de
   promptvelden en het contract eronder.

De oude prompt uit `src/lib/notebookPromptTemplates.js` ("Algemene digibordles
VMBO/EOA") is van vóór het design system. Gebruik die niet voor nieuwe decks.

Het deck maak je in NotebookLM met het account van Kevin (Chrome moet draaien;
de bron plak je als "Gekopieerde tekst", want de uploadknop opent een
Windows-venster dat je niet kunt bedienen). Kies bij Studio de diapresentatie
en daarna "Presentatordia's".

**Bekijk het deck daarna zelf, dia voor dia.** Het is beeld zonder tekstlaag,
dus fouten vind je alleen met je ogen. Bij H2 had één dia een onleesbare regel.

Comprimeer daarna. Een deck uit PowerPoint is vaak 15 tot 25 MB; dat moet een
leerling helemaal binnenhalen voordat hij dia 1 ziet.

```bash
python scripts/comprimeer-slidedeck.py --uit sources/<map> "C:/Users/kevli/Downloads/<deck>.pdf"
```

Dat maakt van elke pagina één JPEG, met dezelfde schaal en kwaliteit als de
huisregel in `src/lib/pdfCompressie.js`. De originelen blijven staan. Zet de map
in `meta.deckMap` van het bronbestand, dan hoef je straks geen `--bronmap` mee
te geven.

```bash
node scripts/plaats-hoofdstuk-slidedecks.mjs --bron docs/seeds/<bestand>.json --toon-plan
node scripts/plaats-hoofdstuk-slidedecks.mjs --bron docs/seeds/<bestand>.json
node scripts/plaats-hoofdstuk-slidedecks.mjs --bron docs/seeds/<bestand>.json --apply
```

Dit maakt per presentatie een pakket, zet de PDF in Storage, maakt het lesblok
op volgnummer 1 en schrijft meteen de publieke snapshot. Het telt ook het aantal
dia's en legt dat vast (`generatedDeckPdf.pageCount` en `content.deckPageCount`),
zodat de teller "3 / 14" toont in plaats van "3 / ?" wanneer de browser de PDF
niet zelf kan inlezen.

Voor decks die er al stonden vóór die telling bestond:
`node scripts/vul-slidedeck-paginatellingen.mjs --apply`.

## Stap 7. Toewijzen

```bash
node scripts/zet-klas-lesstof-klaar.mjs --vak binask
node scripts/zet-klas-lesstof-klaar.mjs --vak binask --apply
```

Voor Digitale vaardigheden is het `--vak dv`. Het script wijst alle
gepubliceerde paragrafen van de lesstofniveaus toe aan de klassen in zijn
tabel, laat staan wat van hun eigen route al toegewezen was, maakt een back-up
en rekent daarna per leerling na wat hij werkelijk ziet. Nieuwe klassen of een
ander vak voeg je toe aan de tabel bovenin dat script; maak er geen kopie van.

Die laatste controle is het punt van dit script. Een klas kan een paragraaf
toegewezen krijgen en hem tóch niet zien, omdat haar leerroute alleen lesstof
van één niveau doorlaat. Handmatig een id aan `enabledParagrafen` plakken slaat
die controle over.

## Stap 8. Controleren en rapporteren

```bash
node scripts/controleer-hoofdstuk.mjs --bron docs/seeds/<bestand>.json --klassen ER3L1A,ER3L2A
```

Leest het hoofdstuk terug uit Firestore en vergelijkt het met de bron: bestaat
het precies één keer, staan de paragrafen op volgorde, klopt het aantal blokken,
staat de presentatie vooraan en is hij niet te zwaar, heeft elk blok een
snapshot, komen de formules letterlijk voor, staan er geen invoervelden of
antwoorden in, en zien de klassen het echt.

Vergelijk daarna met de beginstand uit stap 6 en laat zien dat bestaande
hoofdstukken en voortgangsrecords ongewijzigd zijn.

Sluit af met een kort verslag: welke bestanden je hebt toegevoegd of gewijzigd,
welk hoofdstuk en welke paragrafen er nu staan, hoeveel blokken per type, welke
klassen toegang hebben, de uitslag van de controle, en wat er nog handmatig moet
gebeuren.

**Commit en push niets** tenzij Kevin daar expliciet om vraagt.

## Een hoofdstuk opnieuw bouwen

Wil Kevin een bestaand hoofdstuk vervangen, haal het oude dan eerst weg:

```bash
node scripts/verwijder-hoofdstuk.mjs --hoofdstuk <id>
node scripts/verwijder-hoofdstuk.mjs --hoofdstuk <id> --apply
```

Dat verwijdert het hoofdstuk, zijn paragrafen, hun lesblokken, de publieke
snapshots en de badge, met een back-up in `exports/reset-backups/`. Het weigert
zodra er voortgang van leerlingen aan hangt of een klas het nog toegewezen
heeft; ruim dat eerst op in plaats van de blokkade te omzeilen, want daar zit
leerlingwerk.

Controleer vóór het verwijderen of er iets in dat hoofdstuk zit dat moet
blijven. Bij Digitale vaardigheden zit de nulmeting bijvoorbeeld in hoofdstuk 1,
met de resultaten van ruim honderd leerlingen erin.

## Randvoorwaarde buiten de pijplijn

Zolang `node scripts/zet-storage-cors.mjs --apply` niet gedraaid is, laadt elk
geplaatst deck traag, hoe goed de rest ook staat. De Storage-bucket laat dan
alleen `localhost:5173` de bestanden lezen, dus op dvdacapo.vercel.app blokkeert
de browser het ophalen en valt de presentatie terug op de ingebouwde
PDF-weergave. Kevin moet dat script zelf draaien; het wijzigen van
bucketinstellingen is hier geblokkeerd. Noem dit in je eindverslag zolang het
niet gebeurd is.

## Vaste regels

- Nederlands, korte zinnen, geschreven voor leerlingen van twaalf tot vijftien
  die vaak nog Nederlands leren.
- Geen emoji, niet in lesstof en niet in titels. Iconen zijn lucide of SVG.
- De bron is de waarheid. Je mag herschikken, opmaken en na goedkeuring
  verrijken; je verandert geen natuurkunde, geen getallen en geen opdrachten.
- Raak bestaande voortgang, hoofdstukken en toewijzingen niet aan.
- Elke stap eerst als dry run.
- Bij twijfel over een id, een klas of een nummer: lees het uit de bibliotheek,
  vraag het aan Kevin, en ga niet gokken.

## Referentiebestanden

- `references/bronformaat.md` — het formaat van het bronbestand, alle bloktypen
  met een voorbeeld, en de `meta`-velden die de scripts nodig hebben.
- `references/vakken.md` — per vak de id's, de klassen, de leerroutes, het
  toewijzingsscript en de valkuilen.
- `references/vraagregels.md` — wanneer een quiz- of toetsvraag goed genoeg is;
  dit zijn de regels die `scripts/lib/vraagItems.mjs` afdwingt.
- `references/vraagronde.md` — de vragenbank voor stap 4 en 5.
- `references/slidedeck-designsysteem.md` — het Helix Slide Design System: de
  masterprompt, de promptvelden, het contract en de kleuren. Verplicht bij elk
  deck.
