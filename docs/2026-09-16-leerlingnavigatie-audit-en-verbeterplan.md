# Leerlingomgeving: audit van navigatie en overzicht, met verbeterplan

16 september 2026. Gebaseerd op de live omgeving (dvdacapo.vercel.app, ingelogd
als leerling in ER3L2A), de code van de leerlingroute en de werkelijke
toewijzingen in Firestore.

## Samenvatting

De leerlingomgeving heeft drie schermen: de lesstofpagina (alles op één
pagina), de lespagina (één paragraaf met een stappenbalk) en het profiel.
De bouwstenen zijn goed: de stappenbalk werkt, "Ga verder" onthoudt waar je
was, en de voortgang klopt. Wat ontbreekt is een **middelste laag**: er is geen
plek waar een leerling één hoofdstuk ziet met wat af is en wat nog open staat.
Daardoor wordt de lesstofpagina één lange lijst, en zit de lespagina in een
doodlopende straat: de enige weg terug heet "Stop met oefenen" en na het
afronden val je op de voorpagina.

Vandaag valt dat mee, want een brugklasser ziet nu één paragraaf en een
EOA-leerling vijf. Aan het eind van het jaar staat een brugklasser op acht
hoofdstukken met tientallen paragrafen en honderden lesblokken. Het plan
hieronder is bedoeld om daar vóór te zijn.

## Wat een leerling nu ziet

**Lesstofpagina (`/`).** Kop "Jouw lesstof, 2 hoofdstukken · 3 van 15
onderdelen af". Daaronder per hoofdstuk een kaart met een voortgangsbalk en
rijen: Introductie, de genummerde paragrafen (maximaal drie, de rest achter
"Toon alles"), en een rij Oefentoetsen. Een paragraafrij klapt open naar de
lijst onderdelen, elk met een knop Start of Opnieuw. Rechts een ankerlijst
"Op deze pagina" met de hoofdstukken. Bovenin de balk: Lesmateriaal (is de
pagina zelf), een spelletjes-icoon, tokens, profiel, uitloggen.

**Lespagina (`/chapter/:paragraaf`).** De balk bovenin verdwijnt. Links een
kolom met de paragraaftitel, het hoofdstuk, een balk "3 van 5 stappen af" en de
stappen met vinkjes. Onderin die kolom één knop: "Stop met oefenen". Rechts het
lesblok, met bovenaan "Stap 4 van 5 · Media" en onderaan Vorige en Volgende
stap. Na de laatste stap: het afrondscherm, en daarna de voorpagina.

**Profiel (`/profiel`).** Startprofiel van de nulmeting, accountgegevens,
wachtwoord, en nog een keer de voortgang per hoofdstuk en paragraaf, in een
andere vorm dan op de lesstofpagina.

## Bevindingen

Gerangschikt op wat een leerling er van merkt. Bij elke bevinding staat waar
het in de code zit, zodat het plan direct uitvoerbaar is.

### 1. Er is geen hoofdstukpagina

De lesstofpagina toont alles tegelijk: elk hoofdstuk, elke paragraaf, en na
openklappen elk onderdeel. Er is geen scherm dat één hoofdstuk laat zien met
"dit heb je gedaan, dit staat nog open". De ankerlijst rechts scrolt alleen.

Nu: een brugklasser ziet 1 paragraaf, een EOA-leerling 4 of 5. Straks: de
blauwe route heeft nu al 11 paragrafen met 140 lesblokken in de bibliotheek,
en het jaarplan telt 8 hoofdstukken. Dat wordt één pagina van enkele
schermlengtes waar je doorheen moet scrollen om te vinden wat je vandaag moet
doen.

Code: `src/components/layout/TableOfContents.jsx` rendert alle
hoofdstukken via `buildChapterOutlines` in `src/lib/chapterOutline.js`.

### 2. Geen "ga verder waar je was" bovenaan

De kop meldt "3 van 15 onderdelen af", maar niet wát de leerling nu moet doen.
De knop "Ga verder" staat pas in de paragraafrij, tussen andere rijen met
"Start". Een leerling die inlogt moet zelf zoeken waar hij was.

### 3. De uitgang van een les heet "Stop met oefenen"

Op de lespagina is de balk bovenin weg. De enige weg terug is een knop linksonder
met de tekst "Stop met oefenen" en een deur-icoon. Een leerling die gewoon
terug wil naar zijn overzicht leest "stoppen" en twijfelt of hij dan zijn werk
kwijt is. Er is geen kruimelpad (vak › hoofdstuk › paragraaf) en geen logo om
op te klikken.

Code: `src/components/lesson/StudyStepRail.jsx`, standaardwaarde
`exitLabel = 'Stop met oefenen'`; `StudentLessonPage.jsx` regel 1142
(`onExit: () => navigate('/')`).

### 4. Na het afronden val je op de voorpagina

Rondt een leerling de laatste stap af, dan komt het afrondscherm en daarna de
lesstofpagina. Er is geen knop "Verder naar 1.2 Stofeigenschappen". De leerling
moet terug naar boven, het juiste hoofdstuk zoeken en de volgende paragraaf
aanklikken. Bij een les van drie korte paragrafen gebeurt dat drie keer.

Code: `StudentLessonPage.jsx` regel 1310 stuurt na `onFinish` naar `/`. Er is
in de lesroute geen verwijzing naar een volgende paragraaf.

### 5. Dezelfde quiz staat twee keer op de lesstofpagina

Bij "1.1 Ga van start..." staat de "Vragenronde" als vijfde onderdeel. Diezelfde
quiz staat er nog een keer onder, in de rij "Oefentoetsen · 1 onderdeel · 0
af". Voor een leerling zijn dat twee deuren naar dezelfde kamer, en het telt
verwarrend: de paragraaf zegt "5 onderdelen", het hoofdstuk "3 / 5", en
Oefentoetsen "0 af" over precies dezelfde quiz.

Code: `buildAssessmentRows` in `src/lib/chapterOutline.js` kopieert elke quiz
en toets uit de genummerde paragrafen naar een eigen rij; de paragraafrij houdt
hem ook. Het is een kopie, geen verplaatsing.

### 6. "Toon alles" verbergt de vierde paragraaf

Een hoofdstuk toont maximaal drie paragrafen; de rest zit achter "Toon alles
(4)". Bij h1 Stoffen verbergt dat precies de paragraaf "1.4 Vragen en quiz",
het onderdeel waar de leerling naartoe werkt. Eén paragraaf verstoppen achter
een knop bespaart niets en kost een klik.

Code: `PARAGRAPH_PREVIEW_COUNT = 3` in `src/lib/chapterOutline.js`.

### 7. Drie woorden voor hetzelfde ding, en een tikfout

Op de lesstofpagina heet het "onderdelen" (met de tikfout "5 onderdeelen" in
beeld), in de stappenbalk "stappen", bovenin de lespagina "Stap 4 van 5", en in
het beheer "lesblokken". Een leerling die "3 van 5 stappen af" ziet en op de
voorpagina "3 / 5" zonder eenheid, moet zelf bedenken dat dat hetzelfde is.

### 8. Voortgang staat op vijf plekken, in vier vormen

Kop van de pagina ("3 van 15 onderdelen af"), hoofdstukkaart ("3 / 5"),
paragraafrij ("3 / 5" met balkje), stappenbalk ("3 van 5 stappen af") en profiel
("20% afgerond"). Allemaal correct, maar de leerling krijgt nergens één rustig
antwoord op "hoe ver ben ik".

### 9. Hoofdstuknummering is niet consequent

"HOOFDSTUK 1 · Welkom in Helix" heeft een nummer; "HOOFDSTUK · h1 Stoffen" niet,
en het nummer zit daar in de titel. Dat is inhoud, geen code, maar het maakt de
ankerlijst rechts en de kaartkoppen ongelijk.

### 10. De lesstofpagina laadt traag, en dat wordt erger

Bij het openen staat er een tijd "Lesstof laden...". De pagina haalt per
paragraaf de blokken op, en daarna in een lus per paragraaf de voortgang, de
één na de ander. Met 11 paragrafen zijn dat ruim twintig aparte rondreizen naar
Firestore vóór er iets in beeld staat; op schoolwifi is dat seconden.

Code: `TableOfContents.jsx` regel 108-118, `for ... await` per paragraaf.

### 11. Spellen en tokens zijn alleen een icoon

In de balk heeft alleen Lesmateriaal een tekst. Spellen is een gamepad-icoon
zonder woord, de tokenshop een muntje. Op een smal scherm valt ook het woord
Lesmateriaal weg. En Lesmateriaal is op de voorpagina de actieve knop, dus hij
doet daar niets.

### 12. Het profiel heeft een tweede overzicht

Onder "Mijn voortgang" staat dezelfde informatie als op de lesstofpagina, maar
als percentage en in een andere opmaak. Twee overzichten die anders rekenen en
er anders uitzien, zonder dat een leerling weet welke de echte is.

### Wat goed is en zo moet blijven

- De stappenbalk in de les: elke stap is klikbaar, vinkjes tonen wat af is, de
  actieve stap is duidelijk.
- "Ga verder" brengt de leerling naar de eerste open stap, ook na een refresh.
- Concept-antwoorden overleven een uitgevallen laptop.
- De afgeronde paragraaf opent sinds deze week bij de lesstof en niet op het
  slotscherm.
- De rustige, warme vormgeving van design system v2. Niets in dit plan vraagt
  om andere lettertypen, andere iconen of meer visuele drukte.

## Verbeterplan

Drie fasen. Fase 1 is klein en kan deze week; fase 2 is de structuurwijziging
die het probleem echt oplost; fase 3 is snelheid en afwerking. Elke stap is los
uit te voeren en te testen.

### Fase 1: de scherpe randen weg (kleine wijzigingen, direct merkbaar)

1. **Eén kaart bovenaan: "Verder waar je was".** Paragraaftitel, de open stap,
   een balkje, één grote knop. Daaronder pas de hoofdstukken. Een leerling die
   inlogt klikt één keer en is aan het werk. Bron: de eerste paragraaf met een
   open stap, in volgorde van het hoofdstuk.
2. **De uitgang heet "Terug naar overzicht"** met een pijl naar links, bovenin
   de stappenbalk in plaats van onderin, en daaronder als kruimelpad het
   hoofdstuk en de paragraaf. Het HELIX-logo linksboven blijft op de lespagina
   staan en gaat naar het overzicht.
3. **Na het afronden: "Verder naar [volgende paragraaf]".** Het afrondscherm
   krijgt naast "Terug naar overzicht" een primaire knop naar de eerstvolgende
   paragraaf van hetzelfde hoofdstuk die nog niet af is. Is er geen, dan
   "Hoofdstuk afgerond" met de knop naar het overzicht.
4. **De quiz staat één keer.** De rij Oefentoetsen toont alleen quizzen en
   toetsen die niet al in een genummerde paragraaf zitten. Zitten ze er wel in,
   dan blijft alleen de paragraaf over en krijgt het onderdeel in de paragraaf
   een duidelijk label "Quiz" of "Toets".
5. **"Toon alles" pas vanaf zeven paragrafen.** Tot en met zes staat alles
   gewoon in beeld.
6. **Eén woord: onderdeel.** "5 onderdelen", "3 van 5 onderdelen af",
   "Onderdeel 4 van 5". De tikfout "onderdeelen" verdwijnt daarmee vanzelf.
7. **Woorden bij de iconen.** Spellen en Tokens krijgen hun naam naast het
   icoon, net als Lesmateriaal.

### Fase 2: de hoofdstukpagina (de structuurwijziging)

Dit is de laag die ontbreekt en die jouw eigen wens beschrijft: eerst een
hoofdstuk kiezen, dan zien wat af is en wat open staat.

**Lesstofpagina wordt een hoofdstukoverzicht.** Bovenaan de kaart "Verder waar
je was" uit fase 1. Daaronder per hoofdstuk één kaart: nummer, titel, een
balkje met "3 van 10 onderdelen", en één knop: "Ga verder" of "Start". Geen
paragrafen meer op deze pagina. Met acht hoofdstukken is dat één scherm zonder
scrollen.

**Nieuwe hoofdstukpagina (`/hoofdstuk/:id`).** Kop met titel en de introductie
van het hoofdstuk. Daaronder de paragrafen als rijen, elk met balkje en
onderdelen direct zichtbaar (geen klapmechaniek nodig, want de pagina gaat over
één hoofdstuk). Elke rij kleurt: af, bezig, nog niet begonnen. Onderaan de
oefentoetsen en toetsen van dit hoofdstuk, alleen als ze niet al in een
paragraaf zitten. Rechts, of op een smal scherm bovenaan: "Nog te doen" met de
open onderdelen als lijst. Dat is het antwoord op "wat staat er nog open".

**Lespagina krijgt context.** Het kruimelpad uit fase 1 wordt klikbaar:
hoofdstuk › paragraaf. Onder de stappenbalk komt een klein blok "Andere
paragrafen in dit hoofdstuk" met de vorige en de volgende, zodat een leerling
niet hoeft terug te klimmen om verder te gaan.

**Adressen blijven werken.** `/chapter/:paragraaf` blijft bestaan zodat
gedeelde links en de presenter niet breken; de nieuwe hoofdstukpagina komt er
naast.

**Het profiel houdt alleen wat er hoort.** Startprofiel, account, wachtwoord,
tokens. De voortgang per paragraaf verhuist naar de hoofdstukpagina; op het
profiel blijft hooguit één regel per hoofdstuk over.

### Fase 3: snelheid en afwerking

1. **Voortgang in één keer ophalen.** Eén query op de voortgang van de leerling
   in plaats van een lus per paragraaf, en de blokken van alle paragrafen
   tegelijk. Dat haalt de wachttijd op "Lesstof laden..." grotendeels weg en
   groeit niet mee met het aantal paragrafen.
2. **Skelet in plaats van spinner.** Tijdens het laden staan de kaarten al op
   hun plek, in grijs. De pagina springt niet als de inhoud binnenkomt.
3. **Onthoud wat open stond.** Welke hoofdstukpagina de leerling het laatst
   zag, in `localStorage`, zodat de terugknop uit een les daar landt.
4. **Nummering rechttrekken.** Elk hoofdstuk een nummer in het veld, niet in de
   titel. Dat is een opruimactie in de bibliotheek, geen code.
5. **Toetsenbord.** Pijltjes door de stappen, Enter om te starten, zichtbare
   focus. Kost weinig en helpt de leerling die geen muis pakt.

## Wat ik bewust niet voorstel

De audit-checklist waarmee dit is nagelopen adviseert standaard andere
lettertypen, andere iconen dan Lucide, korrel op achtergronden en meer
beweging. Dat botst met het design system v2 en met de huisregel voor iconen,
en het lost geen enkele van de twaalf bevindingen op. De problemen zitten in
structuur en woorden, niet in stijl.

## Volgorde en omvang

| Fase | Wat de leerling merkt | Omvang |
| --- | --- | --- |
| 1 | Weet meteen waar hij verder moet, kan altijd terug, ziet elke quiz één keer | Zeven kleine wijzigingen, één middag, geen structuurverandering |
| 2 | Kiest een hoofdstuk en ziet wat af is en wat open staat | Eén nieuwe pagina en twee bestaande pagina's kleiner maken, één of twee dagen |
| 3 | Snellere start, rustiger laden | Eén middag |

Mijn advies: fase 1 nu, fase 2 zodra het tweede hoofdstuk voor de brugklassen
klaarstaat, fase 3 daarna.
