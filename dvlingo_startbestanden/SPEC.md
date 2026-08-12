# Digitale Vaardigheden Lingo — bouwcontract

Dit bestand is de bindende afspraak tussen alle bouwers en critici. Wijk hier niet vanaf
zonder het bestand aan te passen, anders passen de losse stukken niet meer op elkaar.

## Wat we bouwen

Een speelbaar Nederlands LINGO-spel in de browser, met de naam **Digitale Vaardigheden Lingo**.
Daarnaast een aparte **quizmasterpagina** waar de quizmaster zelf de te raden woorden invoert en
beheert; het spel speelt precies die lijst af.

Thema: digitale vaardigheden (wachtwoord, phishing, browser, bestand, back-up, ...). De
standaardwoordenlijst gaat over dat onderwerp.

## De lat

Het spel op https://spele.nl/spel/lingo/ (Azerion / GameDistribution). Het is live gespeeld en
vastgelegd in screenshots. Grafisch mag ons spel er nooit onder zitten. Hieronder wat er echt te
zien was.

### Schermen van de referentie (bevestigd)

1. **Menu**: lichtblauwe lucht met zachte glans, zwevende doorschijnende ballen, een slinger met
   lampjes over de bovenkant. Het LINGO-woordmerk als vijf gekleurde bingoballen met witte letter
   (L rood, I blauw, N blauw, G geel, O groen). Een tekenfilm-quizmaster met een bal in zijn hand,
   naast een wit tekstblok `WELKOM! / KIES EEN SPEL`. Twee pilknoppen met chevron rechts:
   `SINGLE PLAYER / 1 SPELER` (blauw) en `MULTIPLAYER / 2 SPELERS` (geel). Knoppen schuiven
   zijwaarts bij hover. Rechtsboven drie kleine ronde iconen: muziek, geluid, uitleg.
2. **Moeilijkheid**: drie pilknoppen onder elkaar, met een kleinere tweede regel eronder —
   `MAKKELIJK / 5-LETTER WOORDEN` (blauw), `MOEILIJK / 5 & 6 LETTER WOORDEN` (geel),
   `EXPERT / 5, 6 & 7-LETTER WOORDEN` (rood). *Wij bouwen dit scherm niet na: bij ons is er geen
   levelkeuze, iedereen begint bij level 1. Zie de nieuwe spelopzet onderaan.*
3. **Spel**: bord links, paneel rechts. Ronde terugknop linksboven, pauzeknop rechtsboven.

### Beoordelingskleuren (bevestigd door zelf te spelen)

Doelwoord begon met V, gok was VADER:

- **Goede letter op goede plek** → de hele tegel wordt **rood** (helder signaalrood, zelfde
  tegelvorm en verloop, witte letter).
- **Letter komt voor, verkeerde plek** → een **gele/gouden cirkel** die bijna de hele tegel vult,
  op de blauwe tegel, met de witte letter erbovenop.
- **Letter komt niet voor** → de tegel blijft gewoon blauw.
- De volgende rij wordt automatisch voorgevuld met de goede letters; onbekende posities tonen
  een witte stip.

Hieronder de rest van de referentie zo exact mogelijk beschreven.

### Referentie-layout (desktop, ~1150x660 speelveld)

- **Achtergrond**: zachte lichtblauwe verloop-lucht (boven ~#c3e6f8, onder ~#9fd6f2), met een
  lichter radiaal schijnsel achter het bord. Het hele speelveld zit in een afgeronde container
  (radius ~28px) met een dikke witte rand (~8px) en een subtiele slagschaduw.
- **Bord**: links, vierkant, 5x5. Afgeronde kader-rand (~5px) in donker marineblauw (#2b4a8b),
  radius ~14px. Tussen de tegels ~4px voegen in datzelfde marineblauw.
- **Tegels**: verticaal verloop van #3f95e2 (boven) naar #2d6cc2 (onder), radius ~6px, lichte
  glans bovenin. Letters wit, zeer zwaar schreefloos lettertype, ~46px, licht schaduwtje.
  Onbekende posities tonen een witte stip (~11px) in het midden.
- **Rechterpaneel** (op ~1/3 breedte):
  - `RONDE 2` — vet, hoofdletters, letterafstand ~2px, kleur #2f5fa8, ~18px.
  - **Scorevak**: afgeronde rechthoek (radius ~14px), blauw verloop (#3b86d8 → #2a6ac0),
    wit vet getal ~42px.
  - **Hintlamp**: gele cirkel (#ffd23a) met gloeilampsymbool, en rechtsboven een klein blauw
    badge-rondje met het aantal hints in wit.
  - **Tijdbalk**: pilvorm, ~10px hoog. Spoor donker marineblauw (#21449a), vulling rood
    (#e8382f), loopt van links leeg.
  - **Invoerveld**: pilvorm (radius ~20px), ~64px hoog, lichtblauwwit (#c9dff1), de getypte
    letters gecentreerd, vet, hoofdletters, kleur #5b7fae.
  - **Bevestigknop**: cirkel ~62px, lichtblauw (#cfe2f4), wit vinkje.
- **Hoeken**: linksboven een ronde terugknop met blauwe chevron, rechtsboven een ronde pauzeknop.
- **Onderbalk**: witte balk met spelicoon en de titel links; rechts ronde knoppen.

### Waar wij moeten winnen

Gelijk spelen met de referentie is verliezen. Wij moeten beter zijn op:
tegelanimaties (omdraaien met echte 3D-flip en versprongen timing), de reactie van het bord bij
een fout woord, de spanning van de tijdbalk, leesbaarheid van de letters, gevoel van de
knoppen, geluid, en de mobiele weergave.

## Spelregels (Nederlandse Lingo)

- Rondes lopen op in woordlengte: 5 letters, dan 6, dan 7.
- Per woord 5 pogingen. De eerste letter staat altijd voor in de eerste rij.
- Beoordeling per letter, met dubbele letters correct afgehandeld (tel eerst de goede posities,
  verdeel daarna pas de resterende voorraad over de gele):
  - juiste letter op juiste plek → **rood vak** (klasse `is-goed`)
  - letter komt voor, verkeerde plek → **gele cirkel** achter de letter (klasse `is-aanwezig`)
  - letter komt niet voor → **blauw/leeg** (klasse `is-fout`)
- Goed geraden letters blijven staan en worden automatisch voorgevuld in de volgende rij.
- **De speler mag met elk bestaand Nederlands woord gokken**, niet alleen met de woorden die geraden
  moeten worden. Dat is de kern van Lingo: je zet een gewoon woord in om letters te vinden. Het
  woordenboek daarvoor staat in `js/woordenboek.js`: alle Nederlandse woorden van 5 t/m 7 letters
  (35.938 stuks), afgeleid van de open woordenlijst van OpenTaal
  (https://github.com/OpenTaal/opentaal-wordlist, CC BY 3.0 / BSD), zonder eigennamen en zonder
  accenten. Het bestand wordt ná `js/woorden.js` geladen en vult die lijst aan.
- Het doelwoord en de andere woorden uit de afspeellijst zijn altijd geldig, ook als de quizmaster iets
  invoerde dat het woordenboek niet kent. Dekt het woordenboek een lengte helemaal niet (8 of 9
  letters), dan wordt elke nette letterreeks toegelaten, anders is zo'n woord onraadbaar.
- Een woord dat niet bestaat, kost géén poging: rij schudt, korte melding, tijd loopt door.
- Tijd per woord loopt af via de balk. Tijd op = woord mislukt, juiste woord tonen.
- Hints: de speler kan een hint inzetten om één letter te onthullen; hints worden gespaard.
- Score: punten per opgelost woord, meer punten bij minder pogingen en meer resterende tijd.
- Na elk level een ballenfase en een bonuswoord; zie *Nieuwe spelopzet* onderaan.

## Technisch contract

- Vanilla HTML/CSS/JS. **Geen build-stap, geen CDN, geen externe requests.** Alles moet werken
  door `index.html` te openen vanaf schijf (`file://`), dus **geen ES-modules** en geen `fetch`
  van lokale bestanden. Scripts hangen aan één globale namespace `window.DVL`.
- Geluid via de WebAudio API (zelf gesynthetiseerd), geen audiobestanden. Standaard aan, met
  een demper-knop die in localStorage bewaard wordt.
- Werkt op desktop én mobiel (staand). Toetsenbordbediening op desktop: letters typen,
  Backspace, Enter. Op mobiel een eigen schermtoetsenbord.
- Toegankelijk: focusstaten zichtbaar, `aria-live` voor meldingen, `prefers-reduced-motion`
  gerespecteerd, contrast voldoende.

### Bestandsindeling

De stijlbladen en de scripts staan in `index.html` in deze volgorde; die volgorde
telt, want de latere bladen rekenen op de eerdere.

```
index.html          het spel
woordenbeheer.html  beheerpagina, achter een wachtwoord (js/toegang.js)
voortgang.html      live voortgangspagina (niet aanpassen door bouwers)
meet.html           meetbank voor de bouwers: schermen opmeten in een iframe

css/base.css        variabelen, reset, typografie, knoppen
css/game.css        spelweergave: bord, tegels, paneel, toetsenbord, menu, uitslag
css/startscherm.css het startscherm per level
css/finale.css      de ballenmachine: trommel, goot, uitvak, rollende bal, LINGO-vlag
css/beeld.css       sfeerlaag met de beelden uit assets/
css/sfeer.css       de zwevende tekens achter het speelveld (na game.css laden)
css/tijdrand.css    de rand van het speelveld als tijdmeter
css/ballenfase.css  het scherm van de ballenfase (na finale.css laden)
css/bonuswoord.css  het scherm van het bonuswoord
css/woordenbeheer.css  de knop naar Woordenbeheer en het slotscherm
css/quizmaster.css  beheerpagina

js/woorden.js       standaardwoordenlijst
js/woordenboek.js   alle Nederlandse woorden van 5 t/m 7 letters
js/core.js          spellogica zonder DOM
js/opslag.js        localStorage-laag, gedeeld door beide pagina's
js/audio.js         WebAudio-geluiden
js/lingokaart.js    kaart, ballenbak, trekken, LINGO-controle (geen DOM)
js/bonuswoord.js    de pool, het kiezen, de vrijgegeven posities (geen DOM)
js/ballenfase.js    het scherm van de ballenfase
js/bonusscherm.js   het scherm van het bonuswoord
js/startscherm.js   vult #scherm-start per level
js/tijdrand.js      laat de rand meelopen met de klok
js/dev.js           tijdelijk hulpknopje dat het doelwoord toont
js/game.js          spel-UI, regelt de volgorde van een potje
js/quizmaster.js    beheer-UI
js/toegang.js       het wachtwoordslot op Woordenbeheer

js/core.test.html   js/lingokaart.test.html   js/bonuswoord.test.html
js/ballenfase.proef.html   js/bonusscherm.proef.html
css/proef-nieuwe-schermen.html
assets/             beelden: beeldmerk, achtergrond, rand.svg, icoon
```

`css/finale.css` heette naar de oude bingofinale, maar levert nu uitsluitend de
ballenmachine voor de ballenfase. Zie *De ballenmachine* verderop.

### Woordenbeheer en het slot

De beheerpagina heet **Woordenbeheer**, niet Quizmaster; het woord quizmaster staat alleen nog in
lopende tekst waar het over de persoon gaat. Er wordt naar verwezen met `.knop-woordenbeheer`, een
groene 3D-knop met het icoon uit `assets/icoon-woordenbeheer.svg`.

De pagina zit achter een wachtwoord: `quizmaster`, hoofdletterongevoelig, met spaties eromheen
toegestaan. `woordenbeheer.html` draagt in de opmaak zelf `<html class="is-vergrendeld">`, zodat de
lijst nooit even zichtbaar is voordat het slot ervoor schuift en de pagina ook dicht blijft zonder
JavaScript. `js/toegang.js` haalt die klasse eraf en onthoudt het binnen dezelfde browsersessie.

Wees hier eerlijk over in elke uitleg: **dit is een deurbel, geen slot.** De controle gebeurt in de
browser, dus wie de broncode opent komt erlangs. Het houdt leerlingen uit de woordenlijst en verder
niets; bewaar er nooit iets gevoeligs achter.

### De sierrand

Rondom het speelveld liep eerst een slinger met lampjes, daarna een rand van afgeronde tegeltjes
met iconen voor digitale vaardigheden (`assets/rand.svg`, opgezet als negenvlak: hoeken 100x100,
randen 500 breed). Allebei zijn ze vervangen: `css/sfeer.css` laat de tekens nu vrij achter het
kader zweven en zet de oude slinger uit. Wie een icoon van de rand wil wisselen, wisselt één
`<use>`-regel in `assets/rand.svg`.

### De ballenmachine

`css/finale.css` is de opmaak van de vervallen bingofinale, teruggebracht tot wat de ballenfase
ervan gebruikt: de kast met de trommelnis, het zijpaneel met teller en lampje, de goot, het uitvak,
de bal met zijn schijf en getal, de rollende bal en de LINGO-vlag. `js/ballenfase.js` bouwt de
machine bewust met diezelfde `finale-`klassen. De kleuren en de balmaat komen van `.bal-machine` in
`css/ballenfase.css`, dus dat blad moet ná `css/finale.css` geladen worden. `@keyframes
finale-rollen`, `finale-rollen-liggend` en `finale-plof` staan in `css/finale.css` en worden vanuit
`css/ballenfase.css` en `js/ballenfase.js` bij naam aangeroepen; `finale-rollen-liggend` hoort
binnen de mediaquery `max-width: 760px` te blijven staan, want daar ligt de kast plat.

### API-contract

`js/woorden.js`
```js
window.DVL = window.DVL || {};
DVL.STANDAARDWOORDEN = [ { woord: "WACHTWOORD", uitleg: "..." }, ... ];  // gemengde lengtes 5-7
```

`js/core.js` — puur, geen DOM, geen timers
```js
DVL.Core = {
  beoordeel(poging, doelwoord),   // -> ['goed'|'aanwezig'|'fout', ...]
  nieuwSpel(opties),              // -> spelstaat
  doeZet(staat, poging),          // -> { staat, resultaat, geldig, reden }
  gebruikHint(staat),
  bereken Score is niet nodig; scoor(staat, ms) -> punten
};
```

`js/opslag.js`
```js
DVL.Opslag = {
  laadLijst(),        // -> { gebruikEigenLijst: bool, schud: bool, woorden: [{woord, uitleg}] }
  bewaarLijst(lijst),
  actieveWoorden(),   // -> [{woord, uitleg}] die het spel echt afspeelt
  luister(cb)         // roept cb aan bij wijziging, ook vanuit een ander tabblad (storage-event)
};
```
localStorage-sleutel: `dvl.lijst.v1` (JSON).

### Startschermen per level (verplicht)

Er zijn drie levels, en **elk level begint met een eigen startscherm** waarop het beeldmerk
`assets/dvlingo-merk.png` groot bovenaan staat. Dat beeld is het gezicht van het spel: een
tekenfilmjongen achter een laptop met het woordmerk Digitale Vaardigheden Lingo eronder, met
uitgeknipte achtergrond zodat hij vrij op de blauwe lucht staat.

Het beeld draagt de titel al, dus zet er geen tweede keer "Digitale Vaardigheden Lingo" onder.
Eronder komen per level deze teksten, in de dikke 3D-stijl van het beeldmerk zodat ze bij de
tekening horen:

| Level | Naam | Regel eronder | Uitleg |
|---|---|---|---|
| 1 | `MAKKELIJK` | `Woorden van 5 letters` | `Je begint rustig. Elk woord heeft 5 letters en de eerste letter krijg je cadeau.` |
| 2 | `MOEILIJK` | `Woorden van 5 en 6 letters` | `De woorden worden langer. Dezelfde tijd, meer letters om te vinden.` |
| 3 | `EXPERT` | `Woorden van 5, 6 en 7 letters` | `Alles komt langs, tot en met 7 letters. Haal de finale en speel om LINGO.` |

Over de onderkant van de tekening ligt een 3D-lint met `LEVEL 1`, `LEVEL 2` of `LEVEL 3`. Dat lint
is een HTML-laag over het beeld heen, geen tekst die in het plaatje gebakken zit, zodat de spelling
altijd klopt en de kleur per level meeloopt: level 1 blauw, level 2 goudgeel, level 3 rood.
Onderaan één grote knop `START`, en een klein regeltje met het aantal rondes en
`5 pogingen per woord`.

Opmaak: `#scherm-start` met `data-level="1|2|3"`, daarbinnen `.start-doos` met `.start-merk`
(het beeld plus `.start-lint` met `.start-lint-tekst`), `.start-naam`, `.start-regel`,
`.start-uitleg`, `.start-knop` en `.start-voet`. Eén scherm dat per level gevuld wordt, niet drie
losse schermen. Het beeld schaalt mee en blijft op 360px breed volledig zichtbaar, met een `alt`
die de tekening beschrijft.

Dit is al gebouwd en klaar voor gebruik in `css/startscherm.css` en `js/startscherm.js`. Bouw dat
niet opnieuw. Inhaken gaat zo:

- `index.html`: `<link rel="stylesheet" href="css/startscherm.css">` en
  `<script src="js/startscherm.js"></script>` erbij, plus een leeg
  `<section class="scherm" id="scherm-start"></section>`.
- `js/game.js`: bij de keuze van een level `DVL.Startscherm.toon(nummer, function(){ ... })`
  aanroepen, het startscherm tonen, en in de terugroep het spel echt beginnen.
- De levels 1, 2 en 3 vervangen de moeilijkheidsgraden makkelijk, moeilijk en expert; woordlengtes
  en aantal rondes komen uit `DVL.Startscherm.LEVELS`.

Het beeld wordt ook gebruikt als beeldmerk in het hoofdmenu en op de quizmasterpagina.

### DOM- en klassencontract (bindend voor CSS én JS)

Schermen (één tegelijk zichtbaar, actief via `.is-actief`), in de volgorde waarin een potje ze
langsloopt: `#scherm-menu`, `#scherm-start`, `#scherm-spel`, `#scherm-ballen`, `#scherm-bonus`,
`#scherm-uitslag`, allemaal met de klasse `.scherm`. Er is geen `#scherm-moeilijkheid` en geen
`#scherm-finale` meer.

Bord:
```html
<div id="bord" class="bord" data-lengte="5">
  <div class="rij" data-rij="0">
    <div class="tegel is-goed" data-kolom="0"><span class="letter">V</span></div>
    <div class="tegel is-leeg"  data-kolom="1"><span class="stip"></span></div>
  </div>
</div>
```
Tegelmodificaties: `is-leeg`, `is-open` (letter getypt, nog niet beoordeeld), `is-goed` (rood),
`is-aanwezig` (gele cirkel), `is-fout` (blauw), `is-actief` (cursorpositie).
Animatieklassen: `.draait` (tegel omdraaien), `.schudt` (rij bij ongeldig woord), `.springt`.

Paneel: `#ronde`, `#score`, `#hints` met `#hint-aantal`, `#tijdbalk` met `.vulling`,
`#invoer`, `#bevestig`, `#melding` (met `aria-live="polite"`), `#pauze`, `#terug`.
Schermtoetsenbord: `#toetsenbord` met `.toets[data-letter]`, `.toets--wis`, `.toets--enter`.

### Quizmasterpagina

- Woorden toevoegen, wijzigen, verwijderen, en de volgorde bepalen (omhoog/omlaag én slepen).
- Per woord een optionele uitleg die het spel na het raden toont.
- Validatie: alleen letters, 3 t/m 9 tekens, dubbelen worden gemeld, hoofdletters afgedwongen.
- Bulk plakken van een lijst, en exporteren.
- Schakelaar tussen eigen lijst en standaardlijst, en een schud-schakelaar.
- Knop "test dit woord" die het spel met dat woord opent.
- Zelfde visuele taal en zelfde afwerkingsniveau als het spel. Geen kaal formulier.

---

## Nieuwe spelopzet: levels, ballen, lingokaart en bonuswoord

Dit vervangt de oude opzet van drie levels met een vast aantal rondes. De oude
bingofinale met 36 ballen is vervallen en verwijderd: `#scherm-finale` en
`js/finale.js` bestaan niet meer. Van de vormgeving is de machine gebleven —
trommel, goot, uitvak, rollende bal en LINGO-vlag — en die staat nog altijd in
`css/finale.css`; de kaart en het bedieningspaneel van die finale zijn weg.

### Verloop van een heel spel

```
START  →  altijd level 1
LEVEL 1   spelen tot 4 woorden goed        →  BALLENFASE  →  BONUSWOORD (1e kans)
LEVEL 2   spelen tot 3 woorden goed        →  BALLENFASE  →  BONUSWOORD (2e kans)
LEVEL 3   spelen tot 2 woorden goed        →  BALLENFASE  →  BONUSWOORD (3e kans)
                                                            →  EINDSTAND
```

Er is geen levelkeuze meer aan het begin: iedereen start bij level 1 en speelt door
tot en met de eindstand.

### De levels

| level | woordlengtes | spelen tot | maximaal ballen |
|---|---|---|---|
| 1 | 5 | 4 goed | 4 |
| 2 | 5 en 6 | 3 goed | 5 |
| 3 | 5, 6 en 7 | 2 goed | 5 |

- Elk woord krijgt **60 seconden**, ongeacht de lengte. Dat vervangt de tijd per
  woordlengte.
- Verdiende ballen = maximum − aantal fout of niet geraden woorden, **minimaal 1**.
- Een woord dat niet bestaat kost geen poging; dat blijft zoals het is.

### De lingokaart (js/lingokaart.js, pure logica)

Eén kaart voor het hele spel, onderdeel van de sessie en niet van een level.
Alleen bij LINGO komt er een nieuwe.

- 25 unieke getallen van 1 t/m 70, verdeeld over de groepen 1-9, 10-19, 20-29,
  30-39, 40-49, 50-59, 60-70. Elke groep minstens 3; vier willekeurige groepen
  krijgen er een vierde bij. Daarna schudden en willekeurig op de 5x5 plaatsen.
- Bij het aanmaken worden **8 vakjes vooraf doorgestreept**. Die mogen samen nooit
  al een LINGO vormen; lukt dat, opnieuw trekken.
- LINGO = vijf doorgestreepte vakjes op een rij: horizontaal, verticaal of over een
  van beide diagonalen. Na élke nieuwe markering controleren.

### De ballenbak

Per kaart: de **17 nog open nummers**, één `?`-bal, 3 rode ballen, en
`3 − groenVerzameld` groene ballen.

| bal | gevolg | kost een trekking |
|---|---|---|
| nummer | het vakje wordt doorgestreept; stond het al doorgestreept, dan gebeurt er niets | ja |
| `?` | de speler kiest zelf een nog open vakje; de echte bal van dat nummer blijft in de bak | ja |
| groen | teller omhoog, bij 3 een bonus die maar één keer wordt uitgekeerd | **nee** |
| rood | de ballenfase stopt onmiddellijk | de rest vervalt |

### Wat blijft en wat wordt vervangen

**Blijft het hele spel bestaan** (sessie): de kaart, de doorgestreepte vakjes, de
groene teller, of de groene bonus al is uitgekeerd, het aantal behaalde LINGO's,
het bonuswoord en welke letters daarvan al vrijgegeven zijn.

**Wordt vervangen bij een nieuwe kaart na LINGO**: de getallen, de 8
startmarkeringen, de nummerballen, de `?`-bal en de drie rode ballen. De groene
teller wordt **niet** gereset; er komen nog `3 − groenVerzameld` groene ballen in.

Resterende trekkingen lopen door op de nieuwe kaart. De uitgebreide introductie
("we strepen eerst 8 nummers voor je door") speelt alleen de allereerste keer, na
level 1; daarna worden de 8 startvakjes kort achter elkaar doorgestreept.

### Het bonuswoord (js/bonuswoord.js, pure logica)

Eén Nederlands woord van precies 11 letters over digitale geletterdheid, per spel
willekeurig gekozen uit een ruime pool. Blijft hetzelfde in level 1, 2 en 3.

- Vrijgegeven letters: 3 na level 1, 6 na level 2, 8 na level 3. De posities zijn
  per spel willekeurig en veranderen daarna niet meer.
- Raadt de speler het woord al na level 1 of 2, dan komt er na het volgende level
  een nieuw woord dat weer met 3 letters begint.
- Per kans **18 seconden**; daarna gaat het spel vanzelf verder.
- Al gebruikte bonuswoorden worden per speler bewaard en uitgesloten, tot de pool
  op is; dan pas wordt de geschiedenis gewist.

**Weergave**, volgens de referentie: elf vakjes op een rij. De vrijgegeven letters
staan er al in, in de **rode** tegelstijl van een goede letter op het bord. De open
plekken zijn lege blauwe tegels. De nog te plaatsen letters liggen eronder als
**gele ronde schijven met een witte letter**, door elkaar. De speler kan typen én
de losse letters aanklikken of erheen slepen.

### Bestandsindeling

```
js/lingokaart.js   kaart, ballenbak, trekken, LINGO-controle (geen DOM)
js/bonuswoord.js   de pool, het kiezen, de vrijgegeven posities (geen DOM)
js/ballenfase.js   het scherm van de ballenfase
js/bonusscherm.js  het scherm van het bonuswoord
css/ballenfase.css   laden ná css/finale.css: dat levert de machine
css/bonuswoord.css
js/lingokaart.test.html   en js/bonuswoord.test.html
```

### DOM-contract van de nieuwe schermen

`#scherm-ballen` bevat `.bal-machine` (de trommel, goot en uitvak uit css/finale.css),
`.bal-kaart` met 25 `.bal-vak[data-getal]` en de standen `is-open`, `is-weg`,
`is-nieuw`, `is-kiesbaar`, `is-lingo`; verder `.bal-teller` (trekkingen te gaan),
`.bal-groen` met drie `.bal-groen-stip`, en `.bal-melding` met `aria-live`.

`#scherm-bonus` bevat `.bonus-rij` met elf `.bonus-vak` (standen `is-vrij`,
`is-leeg`, `is-gevuld`), `.bonus-voorraad` met `.bonus-schijf[data-letter]`,
`.bonus-klok` en `.bonus-melding`.

### API van de twee nieuwe schermen

Beide schermen zijn zelfstandig: ze vullen hun eigen opmaak, houden hun eigen klok bij en melden
via een terugroep dat ze klaar zijn. `js/game.js` regelt alleen de volgorde.

```js
DVL.Ballenfase.start({
  sessie,              // de sessie uit DVL.Kaart.nieuweSessie(), blijft het hele spel bestaan
  trekkingen,          // hoeveel ballen dit level verdiend zijn
  eersteKeer,          // true na level 1: de uitgebreide introductie met de acht startvakjes
  opKlaar              // functie(resultaat) zodra de fase voorbij is
});
// resultaat: { lingos, groenVerzameld, groenBonus, punten }

DVL.Bonusscherm.start({
  stap,                // 1, 2 of 3: hoeveel letters er vrijgegeven zijn (3, 6 of 8)
  seconden,            // 18
  opKlaar              // functie({ geraden, woord, punten })
});
```

Beide gebruiken `DVL.Audio` als die er is, en werken door als hij ontbreekt.

### Wat js/game.js regelt

- Bij `Single player` of `Multiplayer` meteen naar het startscherm van level 1; er is geen scherm
  met een levelkeuze meer.
- Per level spelen tot het aantal goede woorden gehaald is, dan de ballen berekenen
  (maximum − fout, minimaal 1), dan `DVL.Ballenfase.start`, dan `DVL.Bonusscherm.start`, dan het
  volgende level.
- Na de derde bonuskans de eindstand.
- De sessie van `DVL.Kaart` wordt één keer aangemaakt bij de start van het spel en overleeft alle
  drie de levels.

---

## Twee ingebouwde woordenlijsten

Het spel heeft twee eigen lijsten, en daarnaast nog altijd de lijst van de quizmaster:

| bron | bestand | waarvoor |
|---|---|---|
| `digitaal` | `js/woorden.js` (`DVL.STANDAARDWOORDEN`) | **de standaard.** Woorden over digitale vaardigheden. |
| `algemeen` | `js/woorden-algemeen.js` (`DVL.ALGEMENEWOORDEN`) | gewone Nederlandse woorden, voor wie het spel wil spelen zonder het thema. |
| `eigen` | localStorage | de lijst die de quizmaster zelf invoert. |

De keuze staat op de pagina Woordenbeheer. Digitale vaardigheden blijft de stand waarin het spel
begint; wie iets anders wil, zet het daar om.

### Opslag

De sleutel blijft `dvl.lijst.v1`. Er komt één veld bij:

```js
{ bron: "digitaal" | "algemeen" | "eigen", gebruikEigenLijst, schud, woorden }
```

`gebruikEigenLijst` blijft bestaan en betekent hetzelfde als `bron === "eigen"`; oude opslag zonder
`bron` wordt gelezen als `eigen` wanneer die vlag aan stond en anders als `digitaal`. Zo blijft een
lijst die al op iemands computer staat gewoon werken.

`DVL.Opslag.actieveWoorden()` geeft de woorden van de gekozen bron terug. Raakt de eigen lijst op
tijdens een level, dan wordt er stil aangevuld met de lijst die als bron is ingesteld — dat is en
blijft de afspraak uit "Wat js/game.js regelt".

### De algemene lijst

`js/woorden-algemeen.js` wordt naast `js/woorden.js` geladen en zet `DVL.ALGEMENEWOORDEN` in
dezelfde vorm: `[{ woord, uitleg }]`, hoofdletters A-Z, geen accenten, geen eigennamen.

**Minstens 200 woorden per lengte** (5, 6 en 7 letters), dus 600 of meer in totaal. Gewone woorden
die een leerling van het voortgezet onderwijs kent: dieren, eten, huis, school, natuur, sport,
beroep, kleding, verkeer, gevoel. Elk woord krijgt een uitleg van één zin die het woord zelf niet
noemt. Niets grofs, niets naars: dit draait in een klaslokaal.

Elk woord moet in `js/woordenboek.js` staan, anders is het onraadbaar.
