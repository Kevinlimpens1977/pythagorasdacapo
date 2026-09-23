# Onderzoek: tokens verdienen en de tokenshop

> 23 september 2026. Grondslag: een audit van de huidige code en een online onderzoek naar
> 20 leerplatforms, motivatieonderzoek en regelgeving (30+ bronnen, onderaan).
> Doel: van een 3 naar een 9,5. Nog niets gebouwd.

## 1. In het kort

Leerlingen gaan "aan" van tokens. Dat is een kans, maar de shop alleen levert geen 9,5 op. In
het Nederlandse NRO-overzicht van gamification in oefenprogramma's hadden de studies met **alleen**
een beloningssysteem geen effect op leerprestaties. Wat wel werkte was de combinatie van
beloning, feedback, werken op eigen niveau en een vorm van competitie.

Een 9,5 vraagt daarom vier dingen:

1. **Eerlijk en veilig verdienen.** Nu kan een leerling onbeperkt tokens verdienen (§3.1).
2. **Belonen voor beheersing en regelmaat**, niet voor klikken tot het einde. Met een niveau dat
   nooit daalt naast de tokens die je uitgeeft.
3. **Een shop die leeft**: een eigen avatar, een wisselende etalage, een spaardoel, laten zien.
4. **Samen**: een klasdoel en een profiel dat klasgenoten kunnen zien, zonder ranglijst.

## 2. Het cijfer nu, per onderdeel

| Onderdeel | Nu | Waarom |
|---|---|---|
| Eerlijk en veilig verdienen | 1 | Onbeperkt verdienen via een zelfgekozen versie; de server gelooft wat de app zegt (§3.1) |
| Waarvoor je beloond wordt | 3 | Vast bedrag bij afronden; geen verschil tussen 60% en 100%; niets voor regelmaat |
| Voortgang naast tokens | 1 | Geen niveau, geen badges, geen streak die blijft, geen opdrachten per week |
| Aanbod in de shop | 4 | 35 items, allemaal voor jezelf; banners, frames en pins verschijnen alleen als kleur |
| Beleving van de shop | 3 | Vast raster, één klik kopen, geen voorvertoning, geen spaardoel, geen wisselend aanbod |
| Sociaal | 1 | Niemand anders ziet wat je hebt; een beloning is een melding van 3,6 seconden |
| Economie | 3 | De hele catalogus kost 19.330 tokens (ongeveer 190 paragrafen); geen plafond, geen andere manier om uit te geven |
| Gereedschap voor jou | 3 | Wel items en correcties per leerling; geen klasbonus, geen overzicht per leerling, geen events |
| Vieren | 4 | De overwinningseffecten zijn goed; verder weinig momenten |
| **Gemiddeld** | **2,6** | Dat past bij jouw 3 |

## 3. Wat de code laat zien

### 3.1 Eerst repareren: onbeperkt verdienen

- De functie `awardTokensForActivity` maakt de sleutel "al beloond" uit een versienummer dat de
  app zelf meestuurt (`functions/index.js:234-242, 2586, 2594, 2598`). Stuurt iemand elke keer
  een ander nummer, dan krijgt hij elke keer de volle beloning. Dat kan vanuit de console van de
  browser; je hoeft er niet voor te hacken.
- De server controleert niet of het gelukt is. `completed`, `passed`, `isCorrect` en `accuracy`
  komen van de app. De spellenpagina stuurt altijd `passed: true` (`StudentSpellenPage.jsx:46-50`).
- Een spel dat in een les staat én op de spellenpagina, betaalt twee keer uit (twee sleutels).
- Een spelregel opslaan op `/admin/spellen` haalt `replayDecay` weg (`tokenService.js:156-177`):
  een onbeperkt spel wordt dan een spel dat één keer uitbetaalt. `maxPlays` wordt alleen in de
  app bewaakt.

Deze punten staan los van hoe leuk de shop is, maar zodra leerlingen het doorhebben, is elke
prijs waardeloos. Ze komen daarom als fase 0 vóór alles.

### 3.2 Kleinere fouten

- "Recente geschiedenis" is niet recent: `limit(12)` zonder volgorde (`tokenService.js:70-74`).
- "Mijn spullen" toont maar 8 items (`StudentTokenShopPage.jsx:322`).
- Een item uitzetten kan niet (geen "unequip").
- Kopen controleert "al in bezit" buiten de transactie om.

### 3.3 Wat er al goed staat

- Kopen gaat via de server, in een transactie, met een eigen boekhouding (`tokenTransactions`).
- Vijf zeldzaamheden, zes soorten items, afbeeldingen in `public/token-shop/`.
- De overwinningseffecten en de profielpagina zijn een goede basis.
- De docs sluiten pay-to-win en een klasranglijst al uit. Dat blijkt uit het onderzoek terecht.

## 4. Wat het onderzoek zegt

### 4.1 Wat 12-14-jarigen drijft

- **Status en zelfexpressie, meer dan het item zelf.** Tieners zijn extra gevoelig voor
  waardering door leeftijdgenoten, maar willen lof liever privé dan klassikaal. Dus: de leerling
  kiest zelf wat hij laat zien.
- **Een eigen avatar** is het best onderbouwde cosmetische item. Identificatie met je avatar
  verhoogt inzet en speeltijd. Bij Roblox passen tieners hun avatar aan om creatief te zijn (47%)
  of op te vallen (38%). Emotes en bewegingen winnen terrein.
- **Jongens en meisjes** (gemiddelden, veel overlap, matig bewijs): meisjes besteden meer
  aandacht aan kleding en accessoires, jongens aan kracht, voortgang en effecten. Een ranglijst
  helpt jongens meer en haakt meisjes eerder af. Ontwerp voor beide: neutrale basis, kleding én
  emotes, en doelen voor jezelf of het team in plaats van één klaslijst.
- **Echte klasprivileges** zijn in de middenbouw favoriet: muziek bij zelfstandig werken, zelf je
  plek kiezen, een joker voor een deadline. Dit is praktijkkennis van docenten, geen experiment.
- **Samen iets halen** werkt: een groepsbeloning waarbij de klas samen spaart is effectief en
  leerlingen kiezen er vaak zelf voor.
- **Vmbo**: de motivatie ligt gemiddeld lager en daalt in het vo. Beloningen helpen vooral bij
  oefenwerk dat leerlingen saai vinden, en kunnen uitgroeien tot eigen motivatie als de docent de
  beloning koppelt aan "je kunt dit nu".

### 4.2 Wat de beste platforms doen

| Platform | Wat werkt | Overnemen voor HELIX |
|---|---|---|
| Duolingo | XP apart van uitgeefbare gems; streak met freeze; kleine competities van gelijk niveau; opdrachten per week | twee valuta's, streak in lesdagen, weekopdrachten |
| Squla | munten per goed antwoord, **5x bonus de eerste keer dat je een niveau haalt**, diamanten voor 3 dagen oefenen per week, ook een goed doel | bonus voor beheersing, weekdoel voor regelmaat |
| Rekentuin / Prowise Learn | de prijzenkast die leerlingen trots lieten zien; nu een avatarwinkel met regelmatig nieuwe kleding; de verwelkende tuin en "muntjesstress" zijn eruit | avatar met wisselend aanbod, vitrine; nooit straf door verlies |
| Gimkit | XP geeft munten, **maximaal 15 niveaus per week**; trails en stickers | weekplafond |
| Blooket | **maximaal 500 tokens per dag** | dagplafond; niet overnemen: packs met kans (kansspel-achtig) |
| Sumdog | **weekkist bij 20 minuten per week**, eigen huis inrichten, cadeaus aan vrienden | weekkist, cadeau geven |
| Bettermarks | munten per kwaliteit (60/75/90%), ster bij 100% **maar één keer per serie** | belonen naar kwaliteit, niet farmen |
| Mathletics | certificaat per week met de eigen avatar erop | tastbaar certificaat |
| Classcraft | privileges als aparte laag; volle set geeft een huisdier | privileges, setbonus |
| Khan Academy | avatars ontgrendelen via mijlpalen; geen winkel, en punten voelen daardoor doelloos | ontgrendelen naast kopen |
| Prodigy | huisdieren en seizoensquests; kritiek op pay-to-win en upselling | huisdier; nooit iets achter een betaalmuur |
| Brawl Stars | schrapte loot boxes, miste daarna de spanning, bracht **gratis, alleen verdiende** Starr Drops terug | een verdiende verrassing mag, een gekochte niet |

### 4.3 Wetenschap en grenzen

- **Ondermijning.** Vaste beloningen voor meedoen of afronden verlagen de eigen motivatie (128
  studies, Deci e.a. 1999), bij kinderen sterker. Onverwachte en informatieve beloningen ("je
  beheerst nu X") en belonen voor beheersing zijn veiliger.
- **Ranglijsten** geven van alle spelelementen het vaakst negatieve effecten (Hanus & Fox 2015).
  Beter: je eigen record, kleine groepen van gelijk niveau, teamdoelen.
- **Loot boxes.** De Kansspelautoriteit vindt dat kinderen niet met kansspelen in aanraking moeten
  komen. Het verband tussen loot boxes en probleemgokken is het sterkst bij tieners. HELIX heeft
  geen echt geld en geen handel, dus juridisch speelt het niet, maar ethisch geldt: **nooit
  verrassingen kopen met tokens, nooit handel**. Een verdiende verrassing met alleen goede
  uitkomsten is wel verdedigbaar (de "Mystery Motivator" werkt in de klas).
- **Inflatie.** Meer munten erin dan eruit maakt alles waardeloos. Nodig: plafonds per dag of
  week, terugkerende manieren om uit te geven, prijzen die meegroeien.
- **Eerlijk.** Verdienen moet afhangen van inzet en groei op het eigen niveau, niet van absolute
  scores. Anders verdienen de sterke leerlingen alles en haken de zwakke af.

## 5. De aanbevelingen, per fase

### Fase 0: dichtzetten (eerst, één dagdeel)

- De versie van een blok of spel bepaalt de **server**, nooit de app.
- De server kijkt het resultaat zelf na waar dat al kan (vragen en toetsen gaan al via
  `gradeClosedQuestionCore`); voor spellen een **dagplafond** en de nauwkeurigheid begrenzen.
- Eén sleutel per spel en leerling, ongeacht of het in een les of op de spellenpagina staat.
- `replayDecay` en `maxPlays` meenemen bij opslaan in het beheer, en `maxPlays` op de server bewaken.
- De geschiedenis sorteren, "Mijn spullen" volledig tonen, item uitzetten, "al in bezit" in de transactie.

### Fase 1: verdienen voor leren (grootste leereffect)

- **Twee valuta's.** *XP* bepaalt je **niveau** (1 tot 50, nooit omlaag, zichtbaar als badge) en
  *tokens* geef je uit. Een niveau omhoog = een moment + een beloning.
- **Belonen naar beheersing**: 60% een beetje, 75% meer, 90% veel, 100% een ster, maar alleen
  de eerste keer (zoals bettermarks). Een **eerste keer 100% op een onderdeel geeft een bonus**
  (zoals Squla).
- **Weekdoel voor regelmaat**: op 3 lesdagen per week geoefend = de **weekkist** (verdiend, niet te
  koop, alleen goede uitkomsten, kansen zichtbaar).
- **Streak in lesdagen**, niet kalenderdagen: weekend en vakantie tellen niet, twee freezes vanzelf.
- **Comebackbonus** na afwezigheid, nooit straf of verlies.
- **Plafond per dag en per week**, zodat farmen niet loont en de economie heel blijft.
- **Badges** voor mijlpalen: eerste 100%, 10 lessen, een heel hoofdstuk, een foutloze toets.
- Elke beloning zegt **waarvoor**: "Je beheerst nu de onderdompelmethode."

### Fase 2: Shop 2.0

- **Avatarmaker** als hart van de shop: lagen voor huid, kapsel, kleding, accessoires, en emotes.
  Neutrale start, voor jongens en meisjes. Beelden in de stijl van het design system (Higgsfield).
- **Wekelijkse etalage** van 6 items naast de vaste collectie. Items komen altijd terug, met een
  eerlijke timer en geen nep-schaarste.
- **Verlanglijst en spaardoel** met een balk. Start elk doel met een klein voorschot (dat verhoogt
  de kans dat het doel gehaald wordt) en stel na een aankoop meteen een volgend doel voor.
- **Passen** op je eigen avatar voordat je koopt.
- **Sets met een setbonus** (volle set = exclusief frame of huisdier).
- **Seizoenen**: herfst, Halloween, winter, de toetsweek. Seizoensitems komen volgend jaar terug.
- **Uitpakmoment** na een aankoop, en de afbeeldingen van banners, frames en pins echt tonen.
- Zeldzaamheid via prijs of een badge-eis, nooit via kans.

### Fase 3: samen (de sociale motor)

- **Profielvitrine** die klasgenoten kunnen zien: avatar, titel, 3 pins, badges. De leerling kiest
  wat erop staat. Nooit het saldo of scores.
- **Klasdoel met een balk**: iedereen draagt bij, samen sparen voor een klasmoment (spelkwartier,
  muziekles, film). Zwakke leerlingen tellen evengoed mee.
- **Cadeau geven** aan een klasgenoot. Geen handel.
- **Kleine competities** van gelijk niveau of per team, als keuze. Geen klasranglijst.
- **Goed doel**: een klaspot die jij aan een echte actie koppelt.

### Fase 4: echte privileges en jouw gereedschap

- **Privilege-items** met een voorraad per week, die jij goedkeurt: muziek met oortjes (1 les),
  zelf je plek kiezen, een joker voor een deadline van een oefenopdracht (nooit voor toetsen),
  "DJ van de week", een positief bericht naar huis.
- **Docentdashboard**: inwisselverzoeken, een bonus voor de hele klas, events ("dubbele XP-week"),
  per leerling de geschiedenis, en wat er gekocht wordt.
- **Certificaat per week** met de eigen avatar erop, om te printen.

### Fase 5: extra's

- Een **companion** die meegroeit met beheersing en nooit doodgaat of verwelkt.
- Een **ontwerpwedstrijd**: het beste leerlingontwerp komt in de shop.
- Een **eigen kamer** inrichten.

## 6. Wat er per fase aan het cijfer doet

| Na fase | Verwacht cijfer | Waarom |
|---|---|---|
| 0 | 4 | eerlijk en veilig; de basis voor alles |
| 1 | 6 | belonen voor leren, niveau en weekdoel: het grootste leereffect |
| 2 | 7,5 | een shop die leeft, met de avatar als hart |
| 3 | 8,5 | laten zien en samen sparen: de sociale motor voor 12-14 |
| 4 | 9 | echte privileges en jouw gereedschap |
| 5 + meten en bijsturen | 9,5 | de laatste stap zit in bijsturen op echte cijfers en wat leerlingen zelf willen |

Een 9,5 haal je niet met bouwen alleen. Twee dingen horen erbij:

- **Vraag het de leerlingen.** Een korte stemming in HELIX: welke items, welk klasdoel, welk
  privilege. Laat de beste ideeën zien in de shop ("ontworpen door 1K2").
- **Meet.** Per week: hoeveel leerlingen hun weekdoel halen, wat er gekocht wordt, of de
  beheersingsscores stijgen. Pas prijzen en plafonds daarop aan.

## 7. Grenzen die je nooit overschrijdt

- Nooit cijfers, toetsvoordeel of hulp bij een toets kopen.
- Nooit verrassingsdozen kopen met tokens; nooit handel tussen leerlingen.
- Nooit een openbare stand van saldo of scores; nooit een klasranglijst.
- Nooit straf door verlies: niets verwelkt, niets tikt weg.
- Nooit nep-schaarste of nep-timers.
- Items komen altijd terug.

## 8. Voorgestelde volgende stap

Fase 0 bouwen (dichtzetten), en tegelijk een spelopzet schrijven voor fase 1 en 2 met de keuzes
die van jou zijn: het aantal niveaus, de plafonds, de eerste twintig avatar-items, de privileges
die je wilt aanbieden, en het eerste klasdoel.

## Bronnen (selectie)

- NRO, Gamification in digitale oefenprogramma's (Post e.a.): https://www.researchgate.net/publication/338570607
- Deci, Koestner & Ryan 1999 (meta-analyse ondermijning): https://home.ubalt.edu/tmitch/642/articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf
- Cameron & Pierce 1994: https://journals.sagepub.com/doi/10.3102/00346543064003363
- Sailer & Homner 2020 (meta-analyse gamification): https://eric.ed.gov/?id=EJ1245270
- Hanus & Fox 2015 (ranglijsten): https://www.sciencedirect.com/science/article/abs/pii/S0360131514002000
- Soares e.a. 2016 (token-economie in de klas): https://eric.ed.gov/?id=EJ1141302
- Mystery Motivator meta-analyse 2024: https://journals.sagepub.com/doi/abs/10.1177/10983007231224048
- Birk e.a. CHI 2016 (avatar-identificatie): https://dl.acm.org/doi/10.1145/2858036.2858062
- Blakemore 2018 (sociale gevoeligheid adolescenten): https://journals.sagepub.com/doi/10.1177/0963721417738144
- Digital Wellness Lab (avatars en jongeren): https://digitalwellnesslab.org/research-briefs/young-peoples-use-of-avatars-and-virtual-character-customization/
- Springer 2025 (ranglijst en gender): https://link.springer.com/article/10.1007/s12528-025-09438-4
- Kansspelautoriteit over loot boxes: https://kansspelautoriteit.nl/over-ons/bestuur-organisatie-samenwerking/bestuur-organisatie/blogs-rene-jansen-voorzitter/loot-boxes/
- Zendle e.a. 2019 (loot boxes en adolescenten): https://royalsocietypublishing.org/rsos/article/6/6/190049/94826/Adolescents-and-loot-boxes-links-with-problem
- FTC-schikking Fortnite: https://www.ftc.gov/business-guidance/blog/2022/12/245-million-ftc-settlement-alleges-fortnite-owner-epic-games-used-digital-dark-patterns-charge
- Brawl Stars en Starr Drops: https://www.deconstructoroffun.com/blog/why-removing-loot-boxes-in-brawlstars-failed
- Duolingo streaks: https://blog.duolingo.com/how-duolingo-streak-builds-habit/
- Squla beloningen: https://squlanl.zendesk.com/hc/nl/articles/205839742-Waar-kan-ik-mijn-munten-en-diamanten-inwisselen
- Prowise Learn nieuwe spelersomgeving: https://www.prowise.com/nieuws-events/ontdek-de-nieuwe-spelersomgeving-van-prowise-learn/
- Bettermarks munten en sterren: https://helpdesk.bettermarks.com/help/nl-nl/47-algemeen/178-overzicht-van-munten-en-sterren-voor-leerlingen
- Sumdog munten: https://support.sumdog.com/knowledge/coins
- Gimkit cosmetica: https://help.gimkit.com/en/article/cosmetics-explained-10ht2ek/
- Kivetz 2006 (goal gradient): https://www.researchgate.net/publication/239776073
- Inspectie, Motivatie om te leren (2019): https://www.onderwijsinspectie.nl/binaries/onderwijsinspectie/documenten/rapporten/2019/07/18/motivatie-om-te-leren/Motivatie+om+te+leren.pdf
- Middenbouw-privileges (praktijk): https://www.maneuveringthemiddle.com/12-creative-incentives-middle-school/
