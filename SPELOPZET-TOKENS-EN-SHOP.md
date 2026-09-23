# Spelopzet: tokens verdienen en Shop 2.0 (fase 1 en 2)

> 23 september 2026. Ter review. Bouwt voort op `docs/ONDERZOEK-TOKENSHOP-EN-BELONING.md`.
> Fase 0 (het lek dichtzetten) staat live sinds 23 september 2026, zie §7.
> Nog niets van fase 1 en 2 gebouwd. **Kevins besluiten van 23 september 2026 staan in §0**;
> waar de tekst hieronder daarvan afwijkt, geldt §0.

## 0. Besluiten (23 september 2026)

| # | Vraag | Besluit |
|---|---|---|
| 1 | Namen | **XP** (niveau) en **tokens** (shop) |
| 2 | Weekdoel DV | **het hoofdstuk van die week af.** Eén les = één hoofdstuk. Het weekdoel is het hoofdstuk dat Kevin die week vrijgeeft; HELIX onthoudt per klas de vrijgavedatum. Een week zonder vrijgave heeft geen doel en breekt de reeks niet (vakanties gaan zo vanzelf goed). |
| 2b | Weekdoel Binask | **geen weekdoel, geen weekkist, geen weekreeks.** Binask verdient XP en tokens per blok, naar beheersing. |
| 3 | Gelijktrekken | **per week gelijk.** Een week werken levert in DV en Binask ongeveer evenveel op; een Binask-les dus ongeveer de helft van een DV-les. |
| 4 | Plafond | **200 tokens per vak per week**, spellen tellen mee |
| 5 | Bestaande saldi | **laten staan** |
| 6 | Avatar | **eigen SVG-tekenset** in de comicstijl van het deck |
| 7 | Seizoenen | **herfst en Halloween, Sinterklaas en winter, carnaval, lente en zomer** |
| 8 | Niveau zichtbaar | **voor iedereen in de klas**, naast de naam. Let op: de niveaucurve begint snel (niveau 2-5 in de eerste weken), zodat niemand lang onderaan staat, en XP beloont inzet, niet alleen scores. |
| 9 | PacoPacMan | **terug op halveren bij herhalen**; gedaan op 23 sep 2026 (`replayDecay: 0.5` in Firestore) |

Gevolgen voor de tekst hieronder:
- §3.2 en §3.3 (weekdoel, weekkist, weekreeks, huiswerkbonus) gelden **alleen voor DV**.
- §3.7: Binask wordt per week afgestemd op DV. Richtbedrag: een meedoende leerling verdient per
  vak per week ongeveer 100-150 tokens, met 200 als plafond.
- §5: de balk bovenin toont het DV-weekdoel als "Hoofdstuk van deze week: 3 van 5 blokken".

## 1. Het ritme waarvoor we ontwerpen

| Vak | Lessen per week | Lengte | Huiswerk | Lessen per schooljaar (±38 weken) |
|---|---|---|---|---|
| Digitale vaardigheden | 1 | 45 min | soms | ±38 |
| Binask | 2 | 45 min | soms | ±76 |

Wat dat betekent:

- **Geen dagelijkse streak.** Een leerling die DV één keer per week heeft, kan geen dagreeks
  opbouwen. Duolingo-achtige dagstreaks passen hier niet; we rekenen in **weken**.
- **Het weekdoel volgt het rooster.** DV: één lesmoment per week. Binask: twee.
- **Huiswerk is een bonus, geen verplichting.** Wie thuis iets extra doet, verdient iets extra,
  maar wie dat niet kan (geen laptop, geen rust thuis) mist niets van het weekdoel.
- **Een les is kort.** Een beloningsmoment mag hooguit enkele seconden van de 45 minuten kosten.
- **Vakanties en toetsweken** mogen een reeks nooit breken.

## 2. Twee valuta's

| | **XP** | **Tokens** |
|---|---|---|
| Waarvoor | status en voortgang | kopen in de shop |
| Daalt nooit | ja | nee, je geeft ze uit |
| Verdien je met | alles wat je doet: inzet telt | beheersing en het weekdoel |
| Zichtbaar | je **niveau** (badge naast je naam) | alleen voor jezelf |

XP beloont inzet, zodat ook een leerling die worstelt vooruitgaat. Tokens belonen vooral
beheersing en regelmaat, zodat klikken tot het einde niet loont.

### 2.1 Niveaus

- Niveau 1 tot 30. Een lesmoment levert ongeveer 100 XP op.
- Curve: niveau 2 na 1 les, daarna steeds iets langer. Na een schooljaar zit een gemiddelde
  DV-leerling rond niveau 15, een Binask-leerling (twee vakken samen) rond 22. XP is voor alle
  vakken samen.
- Elk niveau omhoog: een kort moment (2 seconden, met de overwinningseffecten die er al zijn) en
  een beloning: tokens, en op niveau 5, 10, 15, 20, 25 en 30 een item dat je niet kunt kopen.

## 3. Verdienen

### 3.1 Per lesblok

| Wat | XP | Tokens |
|---|---|---|
| Theorie, voorbeeld, samenvatting afgerond | 10 | 0 |
| Quiz of toets afgerond, onder 60% | 20 | 0 |
| 60-74% | 20 | 40% van het blokbedrag |
| 75-89% | 25 | 70% |
| 90-99% | 30 | 100% |
| 100% | 30 | 100% + een **ster** |
| Eerste keer 100% op dit blok | +20 | +25% bonus (eenmalig) |
| Spel uitgespeeld | 15 | volgens de spelregel (bestaat al) |

- Het blokbedrag is het bestaande `tokenConfig.totalTokens`.
- Het percentage rekent de **server** uit met de vragen die hij zelf heeft nagekeken
  (`tokenBewijs`, fase 0). Dat is de reden dat fase 0 eerst moest.
- Een herkansing levert XP op, maar alleen tokens voor het verschil met de eerste poging.

### 3.2 Het weekdoel en de weekkist

- **Weekdoel per vak**: op zoveel **verschillende dagen** als er lessen zijn, minstens één blok
  afgerond. DV: 1 dag. Binask: 2 dagen.
- Weekdoel gehaald = de **weekkist**: 30-60 tokens en soms een item uit de gewone shop. Niet te
  koop, alleen goede uitkomsten, de kansen staan erbij ("meestal tokens, 1 op 8 een item").
- **Huiswerkbonus**: een extra dag buiten het weekdoel in dezelfde week geeft +20 tokens (één keer
  per week per vak).
- Een week loopt van maandag tot en met zondag.

### 3.3 De weekreeks

- Het aantal weken achter elkaar dat je je weekdoel haalde, per vak.
- **Weken zonder les tellen niet** (vakantie, toetsweek, uitval): als er in een week voor die klas
  geen blok is afgerond door minstens de helft van de klas, is de week "neutraal".
- **Automatische bevriezing**: één gemiste week per 6 weken breekt de reeks niet.
- Mijlpalen bij 3, 5, 10 en 20 weken: een badge en tokens.

### 3.4 Terugkomen

- Wie 2 of meer weken niets deed, krijgt bij het eerste weekdoel daarna een **comebackbonus**
  (+50%). Nooit straf of verlies.

### 3.5 Plafonds

- Per vak per week een maximum aan tokens: **DV 200, Binask 300**. Spellen tellen mee.
- XP heeft geen plafond (je kunt niet "te veel" leren), maar XP kun je ook niet uitgeven.
- De plafonds staan in een instelling, niet in de code; jij past ze aan.

### 3.6 Badges (eerste twaalf)

Eerste ster · 5 sterren · 25 sterren · Eerste weekdoel · Weekreeks 3 · 5 · 10 · Hoofdstuk rond ·
Foutloze toets · Comeback · Huiswerkheld (5 huiswerkbonussen) · Niveau 10.

### 3.7 Wat een leerling in een week ongeveer verdient

| Leerling | DV per week | Binask per week |
|---|---|---|
| Doet mee, scoort 60-75% | 50-70 | 80-110 |
| Doet mee, scoort 90%+ | 110-140 | 170-220 |
| Plus huiswerk en weekkist | +50-80 | +50-80 |

Deze getallen zijn een schatting op basis van de huidige blokbedragen (DV-paragraaf ±100, Binask
quiz 15 en toets 30). Binask verdient per blok nu veel minder dan DV; dat trekken we recht met een
blokbedrag per lesmoment (§8, vraag 3).

## 4. Shop 2.0

### 4.1 Prijzen die bij het ritme passen

| Zeldzaamheid | Prijs | Sparen (meedoende leerling) |
|---|---|---|
| Gewoon | 60-120 | ±1 week |
| Zeldzaam | 200-350 | 2-3 weken |
| Episch | 500-800 | ±1 maand |
| Platina | 1000-1400 | een periode |
| Legendarisch | 1500-2200 | een half jaar, of een niveaubeloning |

### 4.2 De avatar als hart

- Een eigen figuur in de stijl van het design system: huidskleur (gratis), kapsel, kleding,
  accessoire (bril, pet, koptelefoon, labjas), achtergrond, en een **emote** (een korte beweging na
  een goed resultaat).
- Neutrale start: geen standaard jongen of meisje.
- **Passen**: elk item eerst aan je eigen avatar zien, dan pas kopen.
- Sets per vak: een **labset** voor Binask (labjas, veiligheidsbril, erlenmeyer-pin) en een
  **hackerset** voor DV. Een volle set geeft een exclusief frame.

### 4.3 Wisselende etalage

- Naast de vaste collectie staat elke week een **etalage van 6 items**, met een label "Nieuw".
- Een eerlijke timer ("nog 3 dagen"), en **elk item komt terug**. Geen nep-schaarste.
- Seizoensitems: herfst, Halloween, Sinterklaas, winter, carnaval, lente, toetsweek. Ze komen
  volgend jaar terug.

### 4.4 Spaardoel en verlanglijst

- Eén **spaardoel** met een balk op de lespagina en in de shop ("nog 84 tokens").
- Tot vijf items op de verlanglijst.
- Stel je een nieuw doel in, dan krijg je een klein voorschot (10 tokens, één keer per doel,
  hooguit één keer per week).
- Direct na een aankoop stelt de shop een volgend doel voor.

### 4.5 Kopen voelt als iets

- Een bevestiging ("Voor 250 tokens kopen?").
- Een **uitpakmoment** van 2 seconden.
- Banners, frames en pins verschijnen echt als afbeelding (nu alleen als kleur).
- Een item uitzetten kan weer.

### 4.6 Wat blijft

- De bestaande 35 items blijven te koop en krijgen een plek in de nieuwe indeling.
- Bestaande saldi blijven staan (§8, vraag 5).

## 5. Wat de leerling ziet

- **Lespagina**: in de balk bovenin het niveau, de tokens en het weekdoel ("1 van 2 dagen"). Na een
  blok een melding "+25 XP, +12 tokens" met de reden ("90% goed").
- **Einde van een les**: een samenvatting van één scherm: wat je verdiende, je weekdoel, je
  spaardoel.
- **Shop**: bovenaan het spaardoel en de etalage, daaronder de avatar met passen, daaronder de
  collectie per soort.

## 6. Wat jij ziet

- Per klas: wie het weekdoel haalde, de weekreeks, het gemiddelde niveau.
- De plafonds en de weekkist instellen.
- Een bonus voor de hele klas geven ("goed gewerkt vandaag").

## 7. Fase 0 is gedaan (23 september 2026)

- De server bepaalt de versie van een lesblok; een zelfgekozen versie levert niets meer op.
- Tokens alleen voor lesstof die aan de leerling is toegewezen.
- Een spel betaalt één keer per leerling uit, of het nu in een les of op de spellenpagina staat;
  oude claims tellen mee.
- `maxPlays` wordt op de server bewaakt.
- Opslaan in `/admin/spellen` bewaart de halvering bij herhalen.
- De server legt vast welke toetsvragen hij goed rekende (`tokenBewijs`). Dat staat in
  **schaduwmodus**: hij registreert, weigert nog niet. Na een week kijken we of eerlijke leerlingen
  altijd compleet bewijs hebben, en zetten we `TOKEN_BEWIJS_AFDWINGEN` aan.

## 8. Techniek in het kort

- **Alles op de server.** `awardTokensForActivity` wordt uitgebreid: XP, het tokenbedrag per
  beheersing, het weekplafond en het weekdoel rekent de server uit. De app stuurt alleen "ik heb
  dit blok afgerond".
- Nieuwe documenten (alleen de server schrijft):
  - `leerlingVoortgang/{uid}`: XP, niveau, sterren, badges, weekreeks per vak.
  - `leerlingWeek/{uid}_{vak}_{jaar-week}`: dagen actief, tokens deze week, weekdoel, kist.
- Instellingen in `tokenInstellingen/algemeen`: plafonds, lesmomenten per vak, bedragen van de kist.
- Open antwoorden die de AI nakijkt, moeten ook bewijs opleveren; anders tellen ze niet mee voor
  het percentage.
- Avatar: lagen als SVG of als losse afbeeldingen per laag (§9, vraag 6).

## 9. Nog open (graag jouw mening)

1. **Namen**: "XP" en "tokens", of iets eigens (bijvoorbeeld "HELIX-punten" en "munten")?
2. **Weekdoel**: "op zoveel verschillende dagen als er lessen zijn" (DV 1, Binask 2). Of liever
   "de klaargezette paragraaf van deze week af"?
3. **Binask en DV gelijktrekken**: een vast bedrag per lesmoment (bijvoorbeeld 100 tokens per les
   bij 90%+), los van hoeveel blokken er in een les zitten?
4. **Plafonds**: DV 200 en Binask 300 tokens per week, goed?
5. **Bestaande saldi** (hoogste nu 824): laten staan, of eenmalig omrekenen naar de nieuwe prijzen?
6. **Avatar**: een eigen tekenset als SVG (strak, lagen passen altijd, meer bouwwerk) of
   Higgsfield-beelden per laag (rijker, maar lagen passen lastiger op elkaar)?
7. **Seizoenen**: carnaval erbij? En welke vakantieweken moeten neutraal zijn (schoolkalender
   Da Capo)?
8. **Niveau zichtbaar**: alleen voor de leerling zelf, of ook naast de naam voor klasgenoten
   (dat is eigenlijk fase 3)?
9. **PacoPacMan**: de regel in Firestore is zijn halvering kwijt (opslaan in het oude beheer).
   Terugzetten naar halveren bij herhalen, zoals de code-default?
