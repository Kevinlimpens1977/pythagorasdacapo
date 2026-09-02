# Helix Slide Design System v2 in HELIX: onderzoek en implementatieplan

Datum: 3 september 2026
Status: onderzoek en voorstel; er is niets in `src/` veranderd en niets gecommit.
Bron: "Helix Slide Design System, een visuele familie voor NotebookLM-decks", versie 1.0 van 2 september 2026, 25 pagina's (hierna: het design system of DS). Paginaverwijzingen hieronder (p.1 t/m p.25) verwijzen naar dat document.
Tegenlezers: dit document hoort naast `PROJECTKOMPAS-HELIX.md` (contextanker), `docs/HELIX-DESIGN-AUDIT.md` (staat van de styling op 21 mei 2026) en `src/index.css` (de huidige tokens).

## Samenvatting in vijf bevindingen

1. **Het design system is geschreven voor 16:9-dia's op een projector, niet voor een webapp.** Van de 25 pagina's gaan er 17 over dia-inhoud (families, leerroute, screenshots, beeldgeneratie, timer, QA, NotebookLM-prompt). Slechts vijf pagina's (familie-DNA, kleurtokens, typografie, raster, toegankelijkheid) laten zich rechtstreeks in app-tokens vertalen. De rest wordt in HELIX vooral werkelijkheid via de NotebookLM-prompt, de slidedeck-skill en het digibord.
2. **v2 verschilt inhoudelijk niet van v1.** Na normalisatie van regeleinden zijn de teksten woord voor woord gelijk (2084 versus 2111 woorden, verschil uitsluitend door afbrekingen; beide dragen "Versie 1.0 - 2 september 2026"). Het verschil zit in de opmaak: in v1 lopen de opsommingen in de kaders van p.7, p.14 en p.16 over elkaar heen; in v2 zijn kaders en bullets netjes uitgelijnd en zijn tekstkolommen breder. v2 is dus de leesbare versie van hetzelfde systeem; er hoeft geen "migratie v1 naar v2" te worden gepland.
3. **De grootste botsing zit in paars.** HELIX gebruikt nu een oklch-violet als merk- en actiekleur (`--helix-purple`, `--color-primary-*`, `helix-gradient`, actieve tabs, primaire knoppen, "Bezig"-status, plusparagrafen). Het DS zegt: paars is uitsluitend "Helix-context" (p.6, p.22) en blauw #087EB5 is de actiekleur. Volledig doorvoeren betekent dat 30+ bestanden hun actiekleur wisselen; de helderste route is paars terugbrengen tot logo, merkbanner en de chip "dit komt uit HELIX", en blauw als actiekleur invoeren.
4. **De kleuren van het DS halen op kleine schermen niet allemaal WCAG AA.** Gemeten (WCAG 2.x): geel #FFD33D op crème #FFF7E8 = 1,35:1 (geel mag dus nooit tekst dragen en nooit de enige betekenisdrager zijn); wit op blauw #087EB5 = 4,50:1 (net AA); wit op teal = 3,91:1, op groen = 3,43:1, op oranje = 2,74:1 (allemaal onder AA voor gewone tekst). Voor de app zijn daarom "ink-varianten" nodig (bijv. blauw-ink #066A99 = 5,6:1 op crème) die het DS niet kent. Dat is een aanvulling, geen afwijking: het DS eist zelf "grijswaarden: blijft betekenis intact zonder kleur?" (p.19).
5. **De meest dankbare eerste stap is niet de app maar de prompt.** `src/lib/notebookPromptTemplates.js` bevat nu een prompt van juni 2026 ("Algemene digibordles VMBO/EOA") met een andere slide-opbouw (titel, leerdoelen, startvraag, begrippen, veelgemaakte fouten) en een andere kleurregel (groen = gegeven, blauw = uitleg, geel = aandacht). Het DS levert een kant-en-klare masterprompt (p.22) en promptvelden per dia (p.21). Die kunnen morgen als tweede template in Firestore staan, zonder één regel UI-code, en bepalen direct hoe elk nieuw deck eruitziet.

---

## 1. Onderzoek: het design system per onderdeel

### 1.1 Ontwerpbeslissing en beslisregel (p.2)

Kern: "Eén familie, niet één poster." Geel-zwart is het vaste navigatieanker; drie kernlayouts dragen acht slidefamilies; KIJK-DOE-CHECK-KLAAR is de zichtbare leerroute; comic-energie ondersteunt de aandacht maar instructie blijft dominant; screenshots zijn bewijs en bediening, nooit decor. De beslisregel is de belangrijkste zin van het document: *als stijl en leerbaarheid botsen, wint leerbaarheid; als leerbaarheid en brontrouw botsen, splits de dia en verander de bron niet.* Het systeem is een gewogen synthese uit twee bronreeksen (Tech Lab Quest 6 pagina's, Digital Mission 10 dia's) plus zeven beeldreferenties; verhouding 70/30 (p.1, p.3).

Voor HELIX: de beslisregel kan letterlijk in `PROJECTKOMPAS-HELIX.md` en in de reviewstap van slidedecks (`src/lib/slidedeckReview.js`) worden opgenomen.

### 1.2 Familie-DNA (p.4)

Zes vaste herkenningspunten: (01) geel titelanker als vaste bovenste zone met stap, vraag of status; (02) zwarte lijnvoering met één consistente dikte per component; (03) crème canvas #FFF7E8; (04) 3D-comicbeeld met rijke materialen, warme keylight en heldere silhouetten; (05) één focus, ook bij meerdere opties; (06) statusroute KIJK-DOE-CHECK-KLAAR met HULP als vlag.

Van de zes zijn (01), (02), (03) en (06) app-vertaalbaar; (04) hoort bij beeldgeneratie; (05) is een inhoudsregel die HELIX al deels afdwingt ("maximaal een denkstap per slide" in de huidige prompt; "één cognitieve opdracht" in de leerlingroute via stappen).

### 1.3 Behouden en begrenzen (p.5)

Behouden: geel titelvaandel met korte kop; zware zwarte buitenkaders; crèmebasis met blauw/teal als actiekleur; rijke 3D-cartoonrendering; dynamische panelen voor vergelijkopgaven; vaste timerzone bij echte tijdgebonden opdrachten.
Begrenzen: geen contour-op-contour-op-gloed rond tekst; geen explosie, sterren én speedlines tegelijk als standaard; geen semantiekloze regenboog in de UI-laag; geen kleine of bedekte screenshots; geen stijlmix (Pixar, foto, clipart, vlakke iconen); geen timer, mascotte of bonus zonder didactische functie.

Voor HELIX is "geen semantiekloze regenboog in de UI-laag" het scherpste criterium: het raakt `src/lib/paletColors.js` (13 pastelkleuren voor vak/leerjaar/niveau/hoofdstuk), `presenter-chrome-surface` (perzik-roze-lavendel verloop), `helix-login-visual-bg` (oranje-roze-paars), de tokenshop-effecten en de victory-overlay.

### 1.4 Kleurtokens (p.6, p.22, p.25)

Negen primitieven met semantiek: INK #0B0D0F (tekst/kader), PAPER #FFF7E8 (canvas), YELLOW #FFD33D (navigatie/kop), BLUE #087EB5 (actie/info), TEAL #0D8F93 (ondersteuning), ORANGE #F47A20 (hulp/aandacht), RED #D83A2E (stop/fout), GREEN #2E9D63 (succes), PURPLE #793AC7 (Helix-context). Regel: geel-zwart plus maximaal twee functionele UI-accenten per deck; inhoudsbeelden mogen rijker kleuren zolang ze de systeemsemantiek niet imiteren of het antwoord verklappen. De kop "primitive -> semantic -> component" belooft drie lagen, maar het document geeft alleen de primitieve laag met een semantisch label; de componentlaag ontbreekt. Die vullen we in paragraaf 3 in.

### 1.5 Typografie en copy-fit (p.7)

Twee fonts, niet meer: een displayfont (Bangers, Anton of Impact-equivalent) uitsluitend voor koppen van maximaal zes woorden, uppercase toegestaan; een leesfont (Atkinson Hyperlegible, Arial of Aptos), links uitgelijnd, geen cursief, geen outline, geen volledige kapitalen. Maten op 1920x1080: decktitel 54-72 pt, diatitel 40-48 pt, instructie 28-32 pt, label 24-28 pt, metadata minimaal 20 pt. Copy-fit: 25-35 woorden op een handelingsdia, maximaal 3 korte regels per tekstvlak, inkorten of splitsen, nooit onder de minimummaat verkleinen.

### 1.6 Raster en ruimte (p.8)

Ontwerpcanvas 1920x1080; vaste titelzone 96-132 px; primair beeld 55-78 % van het vlak; 12 kolommen, buitenmarge 96 px, gutter 24 px; ruimteschaal 8/16/24/32/48/64/96 px; minimaal 8 % rustige ruimte rond de instructie.

### 1.7 Drie kernlayouts (p.9)

FOCUS (groot beeld + één instructie; voor KIJK, DOE, WACHT, MULTIPANEL), SPLIT (beeld 60-70 % + begeleiding; voor uitleg, korte procedure, hulp), STATUS (centraal bewijs + korte boodschap; voor CHECK, KLAAR, overgang). Elke layout heeft dezelfde gele titelbalk bovenaan.

### 1.8 Acht slidefamilies (p.10)

1 ROUTE/START (doel, benodigdheden, route), 2 WACHT (startsein en wat nog niet te doen), 3 KIJK (voorbeeld of juiste schermtoestand), 4 DOE (één handeling met groot bewijsbeeld), 5 KORTE PROCEDURE (2-3 onlosmakelijke microstappen), 6 CHECK (verwachte toestand + controlevraag), 7 HULP (eerste herstelactie + escalatie), 8 KLAAR (bewijs van succes + één volgende stap). Op p.21 heet de lijst iets anders (ROUTE, KIJK, DOE, PROCEDURE, CHECK, HULP, KLAAR, MULTIPANEL): WACHT is daar een variant en MULTIPANEL een familie. Die tweede lijst is de operationele en hoort in de prompt.

### 1.9 Leerroute en status (p.11)

KIJK (oriënteren/voordoen) -> DOE (één handeling) -> CHECK (vergelijk met bewijs) -> KLAAR (bevestigd resultaat). WACHT is een KIJK-variant voor klassikale synchronisatie en noemt altijd wat de leerling wél doet, niet doet en wie het startsein geeft ("Kijk mee, nog niet klikken"). HULP is geen vijfde fase maar een conditionele vlag: symptoom -> eerste veilige zelfcheck -> hulpbron; de hoofdtaak verschuift nooit. Titel van de pagina: "procesfase is niet hetzelfde als probleemstatus".

### 1.10 Tone of voice (p.12)

Missiegevoel zonder alarmtaal. Vijf patronen: direct werkwoord + object ("Open Outlook."); observeerbaar succescriterium ("Je bent klaar als je inbox zichtbaar is."); rustige herstelroute ("Zie je dit niet? Controleer eerst je internet."); klassikale regie ("Wacht op het startsein."); motivatie via autonomie ("Hierna kun je zelfstandig bij je lesmateriaal."). Vermijd: meer dan één uitroepteken, schuldtaal, vage hulp ("laat het weten"), bonusdruk tijdens de basisroute, technische uitleg vóór de normale handeling.

### 1.11 Screenshotregels (p.13)

Minimaal circa 50-55 % van het bruikbare vlak; recht, scherp, actueel, functioneel uitgesneden; geen AI-reconstructie of perspectiefvervorming; maximaal één primaire pijl/halo met marker naast (niet op) het doel; zoom-callout bij kleine labels; persoonsgegevens anonimiseren; DOE en CHECK tonen een zichtbare eindtoestand. Het negatieve voorbeeld op p.13 is een bestaande Digital Mission-dia waarin de tekst "DvDacapo.vercel.app" in reuzenletters over het HELIX-inlogscherm ligt: precies het onderhoudsrisico dat het systeem wil uitsluiten. Let op: die screenshot toont het huidige paarse HELIX-inlogscherm; als het inlogscherm van kleur verandert, verouderen bestaande decks (zie beslispunt 8).

### 1.12 Beeldgeneratie en renderrecept (p.14)

Semi-realistische 3D-comic; geen fotografie, geen vlakke clipart; warme keylight, koele teal fill, zachte natuurlijke schaduw; sterke zwarte contouren, tastbare materialen; frontaal of licht verhoogd standpunt; rijke details aan de rand, rustige negatieve ruimte bij de taak; stijl, perspectief, licht en detailniveau binnen het deck constant; personages inclusief en leeftijdsadequaat. Kernregel: genereer het vakbeeld zonder titel, letters, timer of labels en voeg alle functionele UI daarna als afzonderlijke, bewerkbare laag toe.

### 1.13 Multipanel (p.15)

2-5 panelen in vaste leesrichting; gelijke schaal, uitsnede en visuele zwaarte; vaste A-E-labels zonder diagnostische kenmerken; CHECK herhaalt dezelfde panelen en labels en toont pas dan de relaties; vakbeelden mogen rijk kleuren, systeemkleuren blijven semantisch stabiel. Het referentiebeeld (ijsblokje/molecuul/spijker/roestige spijker in blauw/groen/geel/rood) laat zien hoe panelen wél mogen kleuren: de kleur is achtergrond, niet antwoord.

### 1.14 Timer (p.16)

Optioneel, taakgericht, nooit een bekwaamheidsoordeel. Positie vaste zone rechtsboven, buiten titel en taakbeeld; breedte 300-430 px, hoogte 64-80 px op 1920x1080; waarde 34-42 px, label 20-24 px, formaat mm:ss; start pas na KIJK/instructie; pauze en verlenging zonder layoutwissel; bij nul volgt CHECK. Niet gebruiken bij eerste begripsopbouw, detaillezen of wanneer snelheid geen leerdoel is. De Presenter heeft al een timerknop (1/2/5 min, werkpakket C1 uit `IMPLEMENTATIEPLAN-PRESENTER-UX.md`); die kan deze tokens overnemen.

### 1.15 Beeldvalidatie (p.17)

Een overtuigende AI-afbeelding is geen bewijs. Validatiegate: aantallen, objectidentiteit en relaties controleren; causaliteit, schaal en richting controleren; moleculen, optica, stroomkringen en fasemodellen door bron of vakspecialist laten verifiëren; geen pseudoletters, pseudoformules of pseudo-interface; kleur nooit als enige antwoorddrager; aantallen, kijkrichting, camera en lege UI-zones vóór generatie vastleggen.

### 1.16 Leeftijdsdifferentiatie (p.18)

Pas steun aan, niet het merk. Jonger/beginnend: één klik per dia, veel voordoen, altijd expliciete CHECK, grotere targets. Middenniveau: 2-3 genummerde microstappen, screenshot dominant. Ouder/gevorderd: compacter, meer keuze, nog steeds één doel en succescriterium. Taalsteun: korte zin, vast werkwoord, pictogram naast tekst, nooit in plaats van tekst. Zelfregulatie: HULP expliciet bij beginners, ingetogen maar vindbaar bij gevorderden. Inclusie: varieer personages zonder stereotypen.

### 1.17 Toegankelijkheidsgates (p.19)

Projector-first is een harde gate met zes tests: 5 SEC (kan een leerling fase, stap en eerstvolgende actie aanwijzen?), ACHTERWAND (kop, actie en kritieke UI-labels leesbaar vanaf 6-8 meter?), GRIJSWAARDEN (betekenis intact zonder kleur?), OCCLUSIE (bedekt niets een functioneel doel?), FOUTPAD (eerst veilige zelfcheck, dan hulp?), FOCUS (noemt 8 van 10 leerlingen na vijf seconden dezelfde opdracht?).

### 1.18 NotebookLM-promptcontract (p.20)

MUST: fase, familie, focus, visual, actie, succes en hulp per dia; alleen FOCUS/SPLIT/STATUS; exact twee fonts en vaste geel-zwarte UI-laag; één cognitieve opdracht en zichtbaar succescriterium; screenshots exact, groot, scherp, onbedekt. SHOULD: 25-35 woorden; werkwoord vooraan, A2/B1; actieve en rustige dia's afwisselen; echte bronbeelden boven gegenereerde interface; splitsen bij >3 microstappen of >2 schermtoestanden. NEVER: fake UI/logo/ingebakken tekst; derde font of willekeurige kleurbetekenis; twee hoofdtaken; bonus belangrijker dan afronding; vrijgave zonder brontrouw en QA.

### 1.19 Exacte promptvelden (p.21)

Per dia twaalf velden: FASE [KIJK|DOE|CHECK|KLAAR], VARIANT [WACHT|HULP|GEEN], FAMILIE [ROUTE|KIJK|DOE|PROCEDURE|CHECK|HULP|KLAAR|MULTIPANEL], KERNLAYOUT [FOCUS|SPLIT|STATUS], FOCUS, TEKST OP DIA, VISUAL, ACTIE, SUCCES ("Gelukt als ..."), HULP (symptoom -> zelfcheck -> escalatie), BRONBEELD (exacte bestandsnaam, niet reconstrueren), UITZONDERING. Motto: laat NotebookLM eerst structureren, dan vormgeven.

### 1.20 Masterprompt (p.22)

Eén kopieerbaar blok van circa 330 woorden dat canvas, titelzone, renderrecept, twee fonts, kernlayouts, leerfasen, één opdracht per dia, screenshotregels, kleursemantiek (rood fout/stop, groen succes, blauw actie/info, oranje hulp, paars Helix-context), decoratieregels (maximaal één burst per dia, decoratie aan randen), timerregel, multipanelregel en toon samenvat. Sluit af met "Splits inhoud voordat je tekst verkleint."

### 1.21 QA-scorecard (p.23)

Vijftien criteria, elk 0/1/2: merkanker, kernlayout, leerfase, O-V-U-C, één focus, screenshot, annotatie, tekstdichtheid, typografie, kleursemantiek, succescriterium, HULP-route, leeftijd, toegankelijkheid, brontrouw. 27-30 vrijgeven, 23-26 gericht reviseren, 0-22 opnieuw structureren. Auto-afkeur: fake of bedekte UI, foutieve bronwaarde, ontbrekend succescriterium, persoonsgegevens, meer dan één hoofdtaak. "O-V-U-C" wordt nergens in het document uitgelegd; vermoedelijk opdracht-visual-uitleg-check of oriëntatie-voordoen-uitvoeren-controleren. Dit hoort als vraag terug naar de auteur (beslispunt 9).

### 1.22 Governance (p.24)

Zes stappen: 1 BRONLOCK (screenshots, termen, URL's, waarden vastleggen), 2 SLIDEPLAN (fase, familie, kernlayout, succescriterium), 3 BEELD (alleen inhoudsbeeld genereren, vakinhoud valideren), 4 UI-LAAG (titel, labels, timer, status tokenvast toevoegen), 5 QA (15 criteria en achterwandtest), 6 VERSIE (afwijkingen noteren; eerst tokens wijzigen, niet losse slides). Wijzigingsregel: een lokale afwijking mag alleen om brontrouw, toegankelijkheid of vakinhoud, wordt vastgelegd, en wordt na drie keer gepromoveerd tot token of officiële variant.

### 1.23 Cheat sheet (p.25)

Vaste bouwstenen: 16:9 1920x1080; geel #FFD33D + zwart #0B0D0F; warm paper #FFF7E8; 2 fonts, 2 UI-accenten; FOCUS/SPLIT/STATUS; KIJK/DOE/CHECK/KLAAR. Vrijgavevoorwaarden: 1 cognitieve opdracht; screenshot circa 55-78 %; 25-35 woorden; 1 primaire marker; succescriterium verplicht; QA >= 27/30 en nul harde fouten. Motto: "Rijk beeld. Rustige instructie. Zichtbaar succes."

### 1.24 Wat v2 verschilt van v1

Tekstueel niets (zie bevinding 2). Visueel: v2 herstelt de kaders waarin v1 de bullets op elkaar liet vallen (p.7 copy-fit, p.14 renderrecept, p.16 timertokens) en zet de tekstkolommen breder, waardoor er minder afbrekingen zijn. Beide versies gebruiken zelf het systeem dat ze beschrijven: crème canvas, gele topbalk met zwarte lijn, Bangers-achtige kop, blauwe eyebrow, witte kaarten met zwarte contour en gele kop. Wat het document niet doet: het geeft geen contrastwaarden, geen dark mode, geen mobiele maten, geen componentlaag en geen definitie van O-V-U-C.

---

## 2. Vertaling naar de webapp: wat geldt letterlijk, wat vertaald wordt, wat alleen voor dia's geldt

De regels van het DS gaan over één vlak van 1920x1080 dat vanaf zes meter gelezen wordt. HELIX draait op telefoons van 360 px breed (leerlingen), laptops (docenten) en een digibord (Presenter, digibord-viewer, PDF-presenter). Per regel:

| Onderdeel (pagina) | Letterlijk in de app | Vertaald | Alleen slidedecks / presenter |
|---|---|---|---|
| Beslisregel: leerbaarheid > stijl, splits i.p.v. bron wijzigen (p.2) | Ja, als ontwerpprincipe in het kompas en in reviews | | |
| Geel titelanker (p.4) | | Ja: gele "stapbalk" bovenaan een lesstap en bovenaan een digibordslide; niet als app-header op elke pagina (beheer heeft er niets aan) | |
| Zwarte lijnvoering, één dikte per component (p.4) | | Ja: 2 px ink-rand op kaarten in leerling- en digibordcontext; in beheer blijft de zachte 1 px rand (dichte tabellen verdragen geen zware contour) | |
| Crème canvas #FFF7E8 (p.4, p.6) | Ja als paginagrond voor leerling- en presentatiecontext | Beheer: crème als grond, wit als kaartvlak, zodat formulieren en tabellen leesbaar blijven | |
| 3D-comicbeeld en renderrecept (p.4, p.14) | | | Ja: alleen voor gegenereerde vakbeelden in decks |
| Eén focus per dia (p.4) | | Ja: de leerlingroute toont al één stap per scherm (`StudyStepRail`); regel bekrachtigen, niet bouwen | |
| Statusroute KIJK-DOE-CHECK-KLAAR (p.4, p.11) | | Ja: als optioneel fase-label op lesblokken (theorie = KIJK, opdracht = DOE, nakijken = CHECK, afgerond = KLAAR); HULP-vlag = Digidocent/hulpknop | Ja, verplicht in decks |
| Kleurtokens en semantiek (p.6) | Ja: de negen primitieven worden app-tokens | Aanvulling nodig: ink-varianten voor tekst op crème/wit, zachte vlakken (tints) voor achtergronden; "maximaal twee UI-accenten per deck" wordt "per scherm maximaal twee accentkleuren naast geel-zwart" | |
| Twee fonts (p.7) | Ja: Bangers (display) + Atkinson Hyperlegible (lees) vervangen Outfit + Plus Jakarta Sans | Bangers alleen voor h1 en stapkoppen >= 22 px en <= 6 woorden; nooit voor knoppen, navigatielabels, tabelkoppen of formulierlabels | |
| Maten 20-72 pt (p.7) | | Ja: schaal via `clamp()`; op telefoon 16/18/22/28 px, op desktop 16/20/28/40 px; digibord/presenter 1:1 met de pt-maten (20 pt metadata = 27 px op 1080p) | Ja letterlijk in decks |
| Copy-fit 25-35 woorden, 3 regels (p.7) | | Alleen als schrijfrichtlijn voor lesblokteksten in het CMS (readiness-hint), niet afdwingen | Ja |
| Raster 12 kolommen, marge 96, gutter 24, schaal 8-96 (p.8) | Ruimteschaal 8/16/24/32/48/64/96 ja (Tailwind kent deze al als 2/4/6/8/12/16/24) | Marge 96 px wordt 20 px (telefoon) / 32 px (tablet) / 96 px (digibord) | Titelzone 96-132 px en beeld 55-78 % alleen voor slides |
| Drie kernlayouts (p.9) | | Ja in de digibord-viewer: theorie/media = SPLIT, vraag = FOCUS, samenvatting/afronding = STATUS | Ja |
| Acht slidefamilies (p.10) | | | Ja; in HELIX hooguit als metadata op een slidedeck-blok |
| Tone of voice (p.12) | Ja: knopteksten, foutmeldingen en lesblokinstructies (werkwoord vooraan, één uitroepteken, "Gelukt als ...") | | |
| Screenshotregels (p.13) | | Ja voor afbeeldingen in lesblokken: crop-tool bewaakt al uitsnede; regel "geen tekst over UI" als CMS-hint | Ja |
| Multipanel (p.15) | | Ja voor meerkeuzevragen: opties gelijk van grootte, A-E-labels, kleur verraadt niets | Ja |
| Timer (p.16) | | Ja: Presenter-timer (bestaat) en eventuele opdrachttimer in spellen nemen positie rechtsboven, mm:ss en "bij nul volgt CHECK" over | Ja |
| Beeldvalidatie (p.17) | | | Ja; in HELIX als reviewvraag bij slidedeck-upload |
| Leeftijdsdifferentiatie (p.18) | | Deels: "grotere targets" en "pictogram naast tekst" gelden voor de leerling-UI; niveaus komen uit `niveau` in de CMS-hiërarchie | Ja |
| Toegankelijkheidsgates (p.19) | GRIJSWAARDEN en FOUTPAD ja voor de hele app | 5 SEC en FOCUS als handtest voor leerlingpagina's; ACHTERWAND alleen digibord | OCCLUSIE alleen dia's |
| Promptcontract, promptvelden, masterprompt (p.20-22) | | | Ja: `notebookPromptTemplates.js`, `promptTemplates` in Firestore, skill `create-slidedeck` |
| QA-scorecard (p.23) | | | Ja: reviewmetadata van `slidedeckPackages` |
| Governance en wijzigingsregel (p.24) | Ja: "wijzig eerst tokens, niet losse schermen" en "drie keer dezelfde afwijking = token" gelden voor `index.css` | | |

### 2.1 De spanningen, eerlijk benoemd

**Bangers op kleine schermen.** Bangers is een gecondenseerd comic-kapitaalfont met hoge x-hoogte en schuine stand. Op een projector bij 40-72 pt is het uitstekend leesbaar; op een telefoon bij 16-18 px worden de smalle letters een grijze streep en lijken "STAP 3" en "STAP 8" op elkaar. Voorstel: Bangers alleen vanaf 22 px, alleen voor koppen van hoogstens zes woorden, altijd met `letter-spacing: 0.01em` en zwarte tekst; alle andere tekst in het leesfont. Voor labels die nu `helix-eyebrow` gebruiken (11-12 px uppercase met tracking) blijft het leesfont in bold; Bangers is daar te druk. Fallback-stack: `'Bangers', 'Anton', 'Impact', 'Arial Narrow Bold', sans-serif`.

**Atkinson Hyperlegible heeft te weinig gewichten.** De klassieke Atkinson Hyperlegible (2019) kent alleen 400 en 700 (plus cursief). HELIX gebruikt overal `font-semibold` (600), `font-extrabold` (800) en `font-black` (900): 1.200+ voorkomens. Met de klassieke versie synthetiseert de browser die gewichten (lelijk, onbetrouwbaar). "Atkinson Hyperlegible Next" (Braille Institute, 2024, OFL, op Google Fonts) heeft 200-800 als variabel font en is dezelfde ontwerpfamilie. Aanbeveling: Next gebruiken en 900 naar 800 mappen. Dat blijft binnen de letter van het DS ("Atkinson Hyperlegible, Arial of Aptos").

**Contrast van geel.** Gemeten: #FFD33D op #FFF7E8 1,35:1; op wit 1,43:1. Geel is dus onbruikbaar als tekstkleur, als randkleur die betekenis draagt en als "actief"-indicator zonder tweede drager. Ink (#0B0D0F) op geel is 13,6:1, dus gele vlakken met zwarte tekst en zwarte rand werken overal, ook op telefoon. Consequentie: de gele stapbalk krijgt altijd een 2 px ink-onderrand (zoals in het DS zelf op elke pagina), anders verdwijnt hij op crème.

**Contrast van de accentkleuren met witte tekst.** Blauw #087EB5 haalt 4,50:1 (AA net); teal 3,91; groen 3,43; oranje 2,74; rood 4,60; paars 6,48. Een gevulde blauwe knop met witte tekst mag dus, maar teal-, groen- en oranje-knoppen met witte tekst niet. Daarom introduceert het tokenvoorstel per accent een `-ink`-variant (blauw #066A99 5,6:1, teal #0A6F72 5,6:1, oranje #B4520E 4,8:1, groen #237A4D 5,0:1, rood #B42F25 5,9:1 op crème) voor tekst en iconen, en een `-soft`-tint voor achtergrondvlakken. Het DS blijft daarmee de bron voor de vlakkleuren; de ink-varianten zijn de componentlaag die het DS zelf aankondigt maar niet uitwerkt.

**Dichte docentschermen.** `ContentBlockBuilder.jsx` (3.494 regels), `TakenToewijzenPage.jsx` (1.428), `ClassOverview.jsx` (1.876) en `AdminSlidedecksPage.jsx` (849) zijn tabellen, formulieren en boomstructuren. Zware zwarte contouren, Bangers-koppen en 24 px minimummaten maken die schermen niet beter maar onbruikbaar. Voor beheer geldt daarom: tokens ja (crème grond, ink-tekst, blauw als actie, nieuwe statuskleuren), vormtaal nee (geen 2 px contouren op elke rij, geen Bangers onder h1-niveau). Het DS zegt dat zelf ook indirect: "pas steun aan, niet het merk" (p.18).

**Paars.** Nu: `--helix-purple` is actie (knoppen `btn-primary`, `helix-btn-solid`, links, `btn-tool`-iconen, focusring), navigatie (actieve tab `admin-nav-tab-active`, `study-step-active`), status ("Bezig" in `STAP_STATUS_PRESENTATIE`, plusparagrafen in `PLUS_PRESENTATIE`), merk (logo-mark, brandbanner, inlogpaneel) en decor (`presenter-chrome-surface`, `helix-page-background`). Het DS reserveert paars voor "Helix-context": de kleur die zegt "dit komt uit HELIX" in een deck of screenshot. Beide gebruiken tegelijk kan niet: als paars in de app overal is, betekent paars in een deck niets meer. Voorstel: paars houden voor logo, merkbanner, de chip "uit HELIX" en de plusparagraaf-markering (dat is inhoudelijk "extra HELIX-context"); actie wordt blauw, "Bezig" wordt blauw-soft met ink-tekst, focusring wordt blauw. De vier stijlbewakers in `src/lib/designTokenStyles.test.js` leggen de huidige paarse regels vast en moeten meebewegen.

**Voortgang alleen met kleur.** `STAP_STATUS_PRESENTATIE` in `src/lib/klasVoortgangOverzicht.js` heeft per status drie klassen: `chipClass` (met tekst "Af", "Na", "Vast", "Bezig", "–": voldoet), `dotClass` (alleen een gekleurde stip, gebruikt in `ClassOverview` en `LeerlingStappen`: voldoet niet) en `balkClass` (voortgangsbalk in emerald/amber/rood/paars zonder patroon of label: voldoet niet). Het DS-criterium GRIJSWAARDEN (p.19) en "kleur nooit als enige drager" (p.17) vragen om een tweede drager: icoon (vinkje, klok, uitroepteken, pijl), tekstlabel of patroon. Dit is klein werk in één lib-bestand plus drie componenten, en hoort in fase 2. Daarnaast is de kleurkeuze inconsistent: "Afgerond" gebruikt hardcoded `emerald-600` terwijl `--helix-success` bestaat; het DS-groen #2E9D63 vervangt beide.

**Bestaande decoratie.** Tokenshop-kaarten (glans, sparkles, aurora), `victory-overlay` (confetti, sterren, aurora) en `helix-login-visual-bg` zijn precies "explosie, sterren én speedlines tegelijk" (p.5). Het DS is hier streng voor dia's; voor een beloningsmoment in een spel is dat te streng. Voorstel: de effecten blijven maar krijgen de DS-kleuren (geel, blauw, teal, ink) in plaats van het huidige violet/roze/oranje, en de aurora verdwijnt (regenboog zonder semantiek).

**Ruimteschaal.** Het DS werkt met 8-96 px; HELIX gebruikt Tailwind-spacing (4 px-basis) en eigen radii 12/16/22/28. Beide zijn verenigbaar; de radii van het DS zijn kleiner (kaarten circa 16-20 px, knoppen circa 10-12 px). Voorstel: radii terug naar 8/12/16/20 in leerling- en digibordcontext.

---

## 3. Tokenvoorstel

### 3.1 CSS-blok (Tailwind 4 `@theme` plus variabelen), naast de huidige tokens

Dit blok kan in fase 0 letterlijk in `src/index.css` worden opgenomen zonder dat er iets zichtbaar verandert: de `--helix-*`-variabelen behouden hun huidige waarden en krijgen een alias naar het nieuwe token pas in fase 1-5 per oppervlak. De `@import` van Google Fonts wordt vervangen door `@font-face` op zelfgehoste bestanden (zie 3.3) of, als tussenstap, uitgebreid met de twee nieuwe families.

```css
/* ==== HELIX DESIGN SYSTEM V2 (Helix Slide Design System, 2 sep 2026) ==== */
/* Laag 1: primitieven (p.6). Exact de waarden uit het document. */
@theme {
  --color-ink: #0B0D0F;
  --color-paper: #FFF7E8;
  --color-yellow: #FFD33D;
  --color-blue: #087EB5;
  --color-teal: #0D8F93;
  --color-orange: #F47A20;
  --color-red: #D83A2E;
  --color-green: #2E9D63;
  --color-purple: #793AC7;

  /* Componentlaag die het DS aankondigt maar niet uitwerkt.
     -ink: tekst/iconen op paper en wit (>= 4,5:1 gemeten op #FFF7E8).
     -soft: achtergrondtint voor chips, alerts en cellen (tekst altijd in -ink). */
  --color-blue-ink: #066A99;
  --color-teal-ink: #0A6F72;
  --color-orange-ink: #B4520E;
  --color-red-ink: #B42F25;
  --color-green-ink: #237A4D;
  --color-purple-ink: #5F2C9E;
  --color-blue-soft: #E1F0F8;
  --color-teal-soft: #DCF1F1;
  --color-orange-soft: #FDE7D6;
  --color-red-soft: #FADDDA;
  --color-green-soft: #DFF2E7;
  --color-purple-soft: #ECE3F8;
  --color-yellow-soft: #FFF0B8;
  --color-paper-2: #FBEBD0;      /* rustig tweede vlak, bijv. instructiepaneel (p.8/p.9) */
  --color-line-soft: #E8DCC3;    /* zachte scheidingslijn op paper */
  --color-ink-muted: #5B5648;    /* secundaire tekst, 6,9:1 op paper */

  /* Typografie (p.7): exact twee families. */
  --font-display: 'Bangers', 'Anton', 'Impact', 'Arial Narrow Bold', sans-serif;
  --font-sans: 'Atkinson Hyperlegible Next', 'Atkinson Hyperlegible', 'Arial', 'Aptos', system-ui, sans-serif;

  /* Ruimteschaal (p.8): 8, 16, 24, 32, 48, 64, 96. Tailwind-spacing dekt dit al
     (2, 4, 6, 8, 12, 16, 24); deze namen maken de DS-stappen expliciet. */
  --spacing-ds-1: 8px;
  --spacing-ds-2: 16px;
  --spacing-ds-3: 24px;
  --spacing-ds-4: 32px;
  --spacing-ds-5: 48px;
  --spacing-ds-6: 64px;
  --spacing-ds-7: 96px;

  /* Lijnvoering (p.4): één dikte per component. */
  --border-width-ds: 2px;
  --border-width-ds-heavy: 3px;

  /* Radii: kleiner dan de huidige 12/16/22/28. */
  --radius-ds-sm: 8px;
  --radius-ds-md: 12px;
  --radius-ds-lg: 16px;
  --radius-ds-xl: 20px;
}

/* Laag 2: semantiek (p.6, p.22). Wordt in fase 1-5 per oppervlak op de
   bestaande --helix-* aliassen gezet; tot dan staan ze er naast. */
@layer base {
  :root {
    --ds-canvas: var(--color-paper);
    --ds-surface: #FFFFFF;
    --ds-surface-2: var(--color-paper-2);
    --ds-text: var(--color-ink);
    --ds-text-muted: var(--color-ink-muted);
    --ds-line: var(--color-ink);
    --ds-line-soft: var(--color-line-soft);

    --ds-anchor: var(--color-yellow);           /* navigatie / kop: gele titelzone */
    --ds-anchor-text: var(--color-ink);         /* nooit wit op geel */
    --ds-action: var(--color-blue);             /* actie / info */
    --ds-action-hover: var(--color-blue-ink);
    --ds-action-text: #FFFFFF;                  /* 4,5:1 op --color-blue: alleen >= 16 px bold of >= 18 px */
    --ds-support: var(--color-teal);            /* ondersteuning */
    --ds-help: var(--color-orange);             /* hulp / aandacht (HULP-vlag) */
    --ds-stop: var(--color-red);                /* stop / fout */
    --ds-success: var(--color-green);           /* succes / KLAAR */
    --ds-helix: var(--color-purple);            /* Helix-context: logo, merkbanner, "uit HELIX", plus */

    --ds-focus: 0 0 0 3px var(--color-paper), 0 0 0 6px var(--color-blue);
    --ds-shadow-card: 4px 4px 0 var(--color-ink);           /* comic-offset i.p.v. blur (leerling/digibord) */
    --ds-shadow-soft: 0 8px 24px rgba(11, 13, 15, 0.08);    /* beheer */

    /* Leerfasen (p.11): kleur + tekst + icoon, nooit kleur alleen. */
    --ds-phase-kijk: var(--color-blue);
    --ds-phase-doe: var(--color-yellow);
    --ds-phase-check: var(--color-teal);
    --ds-phase-klaar: var(--color-green);
    --ds-flag-wacht: var(--color-ink);
    --ds-flag-hulp: var(--color-orange);

    /* Typografische schaal (p.7) vertaald met clamp: telefoon -> desktop -> digibord.
       Digibord (1080p) komt uit op 20/28/40/54 pt = 27/37/53/72 px. */
    --ds-text-meta: clamp(0.875rem, 0.8rem + 0.4vw, 1.6875rem);
    --ds-text-label: clamp(1rem, 0.9rem + 0.5vw, 1.875rem);
    --ds-text-instruction: clamp(1.125rem, 1rem + 0.7vw, 2.3125rem);
    --ds-text-slide-title: clamp(1.5rem, 1.2rem + 1.4vw, 3.3125rem);
    --ds-text-deck-title: clamp(1.875rem, 1.4rem + 2.2vw, 4.5rem);
  }
}

/* Component-utilities die het DS letterlijk beschrijft. */
.ds-anchor {                       /* gele titelzone met zwarte lijn (p.4, p.8) */
  background: var(--ds-anchor);
  color: var(--ds-anchor-text);
  border-bottom: var(--border-width-ds-heavy) solid var(--ds-line);
  font-family: var(--font-display);
  letter-spacing: 0.01em;
  text-transform: uppercase;
}
.ds-card {                         /* wit vlak, zwarte contour, comic-offset (p.9) */
  background: var(--ds-surface);
  border: var(--border-width-ds) solid var(--ds-line);
  border-radius: var(--radius-ds-lg);
  box-shadow: var(--ds-shadow-card);
}
.ds-btn-action {
  background: var(--ds-action);
  color: var(--ds-action-text);
  border: var(--border-width-ds) solid var(--ds-line);
  border-radius: var(--radius-ds-md);
  font-family: var(--font-sans);
  font-weight: 700;
}
.ds-btn-action:hover { background: var(--ds-action-hover); }
.ds-btn-action:focus-visible { outline: none; box-shadow: var(--ds-focus); }
.ds-phase {                        /* fasechip: kleurvlak + tekst + icoon-slot */
  display: inline-flex; align-items: center; gap: 0.5rem;
  border: var(--border-width-ds) solid var(--ds-line);
  border-radius: var(--radius-ds-sm);
  padding: 0.125rem 0.625rem;
  font-family: var(--font-display);
  text-transform: uppercase;
  color: var(--color-ink);
}
.ds-phase-kijk  { background: var(--color-blue-soft); }
.ds-phase-doe   { background: var(--color-yellow); }
.ds-phase-check { background: var(--color-teal-soft); }
.ds-phase-klaar { background: var(--color-green-soft); }
.ds-flag-hulp   { background: var(--color-orange-soft); color: var(--color-orange-ink); }
.ds-timer {                        /* p.16: rechtsboven, mm:ss */
  font-family: var(--font-sans); font-variant-numeric: tabular-nums;
  border: var(--border-width-ds) solid var(--ds-line);
  border-radius: var(--radius-ds-sm);
  background: var(--ds-surface);
  min-width: 7.5rem;
}
```

### 3.2 Mapping oud token -> nieuw token

| Huidig (`src/index.css`) | Waarde nu | Nieuw | Opmerking |
|---|---|---|---|
| `--color-primary-500/600` (`@theme`) | oklch-violet | `--color-blue` / `--color-blue-ink` | Tailwind-klassen `bg-primary-*` worden `bg-blue`/`bg-blue-ink`; 2 voorkomens in `.jsx`, rest via `--helix-purple` |
| `--color-primary-50/100` | lavendel | `--color-blue-soft` | |
| `--color-success-*` | Tailwind green | `--color-green`, `--color-green-ink`, `--color-green-soft` | |
| `--color-error-*` | Tailwind red | `--color-red`, `--color-red-ink`, `--color-red-soft` | |
| `--color-warning-*` | oranje `#f97316` | `--color-orange`, `--color-orange-ink`, `--color-orange-soft` | DS-oranje betekent "hulp/aandacht", niet "waarschuwing"; tekstlabels aanpassen |
| `--font-sans` | Plus Jakarta Sans | Atkinson Hyperlegible Next | |
| `--font-display` | Outfit | Bangers | Alleen h1/stapkop >= 22 px |
| `--helix-purple`, `--helix-purple-dark` | oklch-violet | `--ds-action` (blauw) waar het actie is; `--ds-helix` (paars) waar het merk is | Per gebruik beslissen; 350+ verwijzingen in `.jsx` |
| `--helix-navy` | oklch donkerviolet | `--color-ink` | Koppen en primaire tekst |
| `--helix-text` | idem | `--color-ink` | |
| `--helix-muted` | oklch grijsviolet | `--color-ink-muted` | |
| `--helix-bg`, `--helix-page-background` | lichtlavendel + radiale gloed | `--color-paper`, geen gloed | Test "Helix page background is drawn once" blijft geldig |
| `--helix-surface`, `--helix-surface-soft` | wit, lichtviolet | `#FFFFFF`, `--color-paper-2` | |
| `--helix-border` | lichtviolet | `--color-line-soft` (beheer), `--color-ink` (leerling/digibord) | Twee contexten, twee waarden |
| `--helix-soft-lavender`, `--helix-soft-pink`, `--helix-soft-peach` | tints | `--color-purple-soft` (alleen Helix-context), `--color-blue-soft`, `--color-yellow-soft` | roze en perzik vervallen |
| `--helix-pink`, `--helix-orange` | roze, oranje | vervallen; oranje -> `--color-orange` | roze heeft geen semantiek in het DS |
| `--helix-success` / `--helix-warning` / `--helix-danger` / `--helix-info` | oklch | `--ds-success` / `--ds-help` / `--ds-stop` / `--ds-action` | |
| `--helix-gradient`, `--helix-gradient-border`, `--helix-gradient-soft` | violetverloop | vervallen; vervangen door effen `--ds-action` en ink-rand | "geen regenboog in de UI-laag" |
| `--helix-radius-sm/md/lg/xl` | 12/16/22/28 | `--radius-ds-sm/md/lg/xl` 8/12/16/20 | |
| `--helix-shadow-soft/card/glow` | blur-schaduwen | `--ds-shadow-soft` (beheer), `--ds-shadow-card` (offset, leerling/digibord); glow vervalt | |
| `--helix-focus` | violet ring | `--ds-focus` (blauw, dubbele ring) | Zichtbaar op crème én op blauw |
| `paletColors.js` PASTEL_COLORS (13 kleuren) | Tailwind-pastels | Beperken tot 6 DS-tinten (blue-soft, teal-soft, orange-soft, green-soft, purple-soft, yellow-soft) met ink-tekst | Gebruikt door TakenToewijzen en AdminDigibord; alleen ordening, geen betekenis |
| `presenter-chrome-surface` | perzik-roze-lavendel | `--color-paper-2` met ink-lijn | |
| `.slide-heading`, `.slide-content` | slate, tot `text-9xl` | `--ds-text-slide-title`, `--ds-text-instruction` | Alleen nog gebruikt in de ongebruikte `src/components/slides/`-map |
| STAP_STATUS_PRESENTATIE (`klasVoortgangOverzicht.js`) | emerald/amber/rose/purple | green/orange/red/blue(+soft) plus icoon | "Bezig" is nu paars; wordt blauw |

### 3.3 Fontstack en licentie

- **Bangers** (Vernon Adams, SIL Open Font License 1.1). Eén gewicht (400), Latin. Beschikbaar op Google Fonts en als bron op GitHub.
- **Atkinson Hyperlegible Next** (Braille Institute of America / Applied Design Works, SIL OFL 1.1, 2024). Variabel 200-800 plus cursief. Ook op Google Fonts. De klassieke "Atkinson Hyperlegible" (400/700) is dezelfde licentie maar te smal in gewichten voor HELIX.
- De OFL staat zelfhosten, bundelen en distribueren toe; het enige verbod is verkopen als losstaand product en hernoemen zonder de Reserved Font Name-regel te respecteren. Beide fonts mogen dus in `public/fonts/` in de repo, met het licentiebestand ernaast.
- **Aanbeveling: zelfhosten.** Argumenten: leerlingen zitten achter schoolnetwerken die Google-domeinen soms blokkeren; geen derde-partijverzoek per pagina (AVG-vriendelijker voor een school); geen FOUT/FOIT-verschil tussen leerling en digibord; de Presenter werkt ook offline op het bord. Bestanden: `Bangers-Regular.woff2` (circa 30 kB), `AtkinsonHyperlegibleNext-Variable.woff2` (circa 80 kB) en de italic-variant. `@font-face` met `font-display: swap` en `size-adjust` op de fallback zodat de layout niet springt.
- De huidige `@import url('https://fonts.googleapis.com/...')` bovenaan `src/index.css` vervalt dan; `index.html` heeft nu geen font-links en hoeft alleen een `<link rel="preload">` voor de twee woff2-bestanden te krijgen.

---

## 4. Inventaris: wat wordt geraakt, per oppervlak

Tellingen op 3 september 2026: 19 pagina's in `src/pages/` (14 `Admin*`, 4 `Student*`, `TakenToewijzenPage`), 85 componentbestanden in `src/components/` (admin 8, auth 8, cms 10, common 6, dashboard 7, digibord 2, games 4, layout 2, lesson 3, media 1, presenter 19, slides 11, studentBugReports 2, tokens 2), 6 spelmappen in `src/games/`, 6 mappen in `public/games/`, 117 bestanden in `src/lib/` waarvan 116 testbestanden met 963 tests (gemeten: allemaal groen in 3,5 s). `src/index.css` is 1.543 regels met circa 110 klassen. In alle `.jsx` samen: 1.247 `slate-*`-klassen, 288 `amber-*`, 285 `red-*`, 223 `blue-*`, 175 `emerald-*`, 99 `green-*`, 73 `fuchsia-*`, 64 `indigo-*`, 26 `orange-*`, 25 `violet-*`, 23 `sky-*`, 18 `rose-*`. Verwijzingen naar `--helix-purple`/`navy`/`lavender`/`gradient`: 74 in `StudentLessonPage`, 42 in `ContentBlockBuilder`, 34 in `TableOfContents`, 27 in `ClassOverview`, verder 15-27 per beheerpagina.

### 4.1 Fundament (fase 0) - klein

- `src/index.css` (tokens bovenaan, `@font-face`, `@theme`).
- `index.html` (font-preload).
- `public/fonts/` (nieuw: 3 woff2 + OFL.txt).
- `src/lib/designTokenStyles.test.js` (stijlbewakers; uitbreiden met bewakers voor de nieuwe tokens).
- `DESIGN_SYSTEM.md`, `DESIGN_SYSTEM_SHOWCASE.md` (verouderd: beschrijven nog blauw-op-slate uit mei 2026; vervangen door één actueel document).

### 4.2 Slidedecks, NotebookLM-prompt en skill (fase 1a) - middel

- `src/lib/notebookPromptTemplates.js` (nieuwe template-constante), `src/services/slidedeckService.js` (`ensureDefaultPromptTemplate` seedt alleen als er nog géén template is; er is een migratie- of "voeg standaardprompt toe"-actie nodig), `src/pages/AdminSlidedecksPage.jsx` (templatekeuze, prompt-snapshot, reviewvelden), `src/lib/slidedeckReview.js` (+ test) voor de QA-scorecard en de promptvelden als metadata, `src/lib/slidedeckCmsSync.js`.
- `.claude/skills/create-slidedeck/SKILL.md` en `.claude/preferences/slidedeck-preferences.md` (nog "Helvetica/Arial", "44-52 pt titel", "blauw voor uitleg").
- `src/components/digibord/PdfSlideDeckPresenter.jsx` (chrome rond de PDF: 29 className/style-regels, nu slate/blauw).
- Bestaande decks in `exports/` (7-3-langste-zijde) zijn oude stijl; niet aanpassen.

### 4.3 Presenter en digibord (fase 1b) - groot

- `src/components/presenter/` 19 bestanden, circa 8.150 regels; vooral `PresenterShell.jsx` (1.516), `PresenterToolbar.jsx` (1.059; harde kleuren `#7c3aed`, `#2563eb`, `#16a34a`, `#dc2626` voor pen-swatches), `PresenterImportDialog.jsx` (23 helix-verwijzingen), `PresenterImportedObjectCard.jsx`, `PresenterMathToolObject.jsx` (17), `PresenterFocusTools.jsx` (timer, spotlight), `PresenterBackground.jsx`, `PresenterPageThumbnail.jsx`.
- `src/components/digibord/DigibordViewer.jsx` (490 regels; slidelayouts voor theorie/voorbeeld/vraag/media/samenvatting/game/slidedeck; nu wit-slate-blauw, `rounded-3xl`, `shadow-2xl`).
- `src/pages/AdminDigibordPage.jsx` (471), `src/pages/AdminPresenterPage.jsx` (5), `src/lib/digibordSlideUtils.js` (mapping bloktype -> slide; hier komt kernlayout en fase bij).
- `src/index.css`: `presenter-chrome-surface`, `presenter-page-enter`.
- Pen-swatches in de Presenter mogen rijk blijven (inhoud, geen UI-semantiek), maar de zes vaste swatches kunnen de negen DS-primitieven worden.

### 4.4 Leerlingpagina's (fase 2) - groot

- `src/pages/StudentLessonPage.jsx` (4.027 regels, 74 helix-verwijzingen; lesblokken, vragen, Digidocent, herstel/challenge, statusklassen `inputClassForStatus`), `StudentProfilePage.jsx` (517), `StudentSpellenPage.jsx` (113), `StudentTokenShopPage.jsx` (366).
- `src/components/layout/AppShell.jsx` (281; header, navigatie), `TableOfContents.jsx` (968; hoofdstukken, voortgangsbalken).
- `src/components/lesson/` (3: `StudyStepRail`, `StudyConfirmBar`, `LearningGoalsIntro`), `src/components/slides/AITutorChat.jsx` (de enige component uit die map die nog gebruikt wordt), `src/components/media/MediaRenderer.jsx`, `src/components/common/` (6: `HelixBrandBanner`, `Meldbel`, `StudentAvatar`, `FullscreenSurface`, `ImageModal`, `FormattedText`), `src/components/tokens/` (2), `src/components/studentBugReports/` (2).
- `src/index.css`: `lesson-prose`, `study-*` (11 klassen), `helix-progress-*`, `helix-badge-*`, `token-shop-*` (14), `victory-*` (9), `helix-brand-banner-*` (7).
- `src/lib/klasVoortgangOverzicht.js` (+ test): statuspresentatie krijgt icoon en DS-kleuren.
- Leerling-e2e ontbreekt; `tests/e2e/auth-admin-smoke.spec.js` dekt alleen login en de AI-instellingenroute.

### 4.5 Inlogschermen (fase 3) - klein

- `src/components/auth/LoginScreen.jsx` (281; paars merkpaneel), `AdminLoginScreen.jsx` (316; donker paneel), `NameSetupModal.jsx`, `ClassSelectionModal.jsx`, `RequiredPasswordChange.jsx`.
- `src/index.css`: `input-auth`, `btn-primary-lg`, `btn-secondary`, `helix-login-visual-bg`, `helix-logo-mark`.
- Let op de screenshot-afhankelijkheid: de Digital Mission-decks bevatten het huidige paarse inlogscherm (p.3, p.13). Wie het inlogscherm restylet, moet die decks opnieuw screenshotten (BRONLOCK, p.24).

### 4.6 Beheer (fase 4) - groot, maar oppervlakkig

- Pagina's: `AdminLesstofPage`, `AdminCmsPage`, `AdminKlassenPage` (705), `AdminLeerlingenPage` (542), `AdminMeldingenPage`, `AdminSettingsPage`, `AdminAiSettingsPage` (302), `AdminSpellenPage` (454), `AdminTokenManagementPage` (517), `AdminCropToolPage` (326), `AdminProjectKompasPage`, `TakenToewijzenPage` (1.428).
- `src/components/cms/` 10 (waarvan `ContentBlockBuilder.jsx` 3.494 en `QuestionEditor.jsx` 1.055), `src/components/dashboard/` 7 (`ClassOverview.jsx` 1.876, `KlasVoortgangMatrix`, `NakijkPaneel`, `AandachtsLijst`, `LeerlingStappen`, `PlusOverzicht`, `BeoordeelActies`), `src/components/admin/` 8 (crop-tool en foto-import; canvaskleuren `#047857`, `#10b981`, `#3b82f6` zijn functioneel en blijven), `src/components/games/` 4 (`GamePlayer`, `ExternalGameHost`, `KlasSpelToewijzing`, `DvlingoWoordenPanel`).
- `src/index.css`: `admin-nav-tab*`, `dashboard-lens-tab*`, `studio-toolbar-control*`, `btn-tool`, `helix-action-card*`, `helix-alert`, `project-kompas-document`.
- `src/lib/paletColors.js` (+ ColorEmojiPicker).

### 4.7 Spellen (fase 5) - middel

- React-spellen: `dataKoerier` (1.291 regels; slate/indigo/amber), `pacoPacMan` (979; slate/amber/emerald), `socialMediaZoektocht` (511 + levels; slate/sky), `turboTypen` (716; slate/sky/amber), `wachtwoordDetective` (661; slate/amber/emerald). Alleen de schil (start-, pauze-, resultaatscherm, HUD) volgt het DS; speelvelden en sprites zijn inhoud.
- `src/games/GameComponentRenderer.jsx`, `src/components/games/GamePlayer.jsx` (kop en chips in blauw/emerald), `src/components/tokens/VictoryEffectOverlay.jsx`.
- DVLingo: `public/games/dvlingo/v1/css/` (10 CSS-bestanden, eigen palet groen `#1c8055`, blauw `#2f7ccd`, geel `#ffd23a`, eigen fonts via `--lt-basis`/`--lt-zwaar`). Extern spel met pariteitsbank tegen de standalone bron (`exports/dvlingo-pariteit/`); restylen breekt de pariteit. Aanbeveling: alleen de HELIX-host (`ExternalGameHost`) restylen, DVLingo zelf laten.

### 4.8 Opruimen

- `src/components/slides/`: 10 van de 11 bestanden (`SlideRenderer`, `PresentationSlide`, `TheorySlide`, `ExerciseSlide`, `DemoSlide`, `WelcomeSlide`, `SummarySlide`, `EvaluationSlide`, `EvaluationSummarySlide`, `PythagorasProofSlide`) worden nergens buiten die map geïmporteerd; alleen `AITutorChat` wordt gebruikt. Samen met `.slide-heading`/`.slide-content` en `src/App.css` (184 regels Vite-template-CSS, wordt niet geïmporteerd) zijn dit kandidaten om te verwijderen, niet te restylen.
- Documentatie: `DESIGN_SYSTEM.md`, `DESIGN_SYSTEM_SHOWCASE.md`, `README_TYPOGRAPHY.md` en de vijf `TYPOGRAPHY_*`, de `LAYOUT_*`-reeks en `VISUAL_POLISH_AUDIT.md` beschrijven de blauw-slate-fase van mei 2026 en de Inter-font-aanname; `docs/HELIX-DESIGN-AUDIT.md` beschrijft mei 2026 vóór "richting B". Na fase 0 is er één actueel stijldocument nodig; de rest kan naar `docs/archief/`.

---

## 5. Implementatieplan in fasen

Volgorde: 0 tokens en fonts, 1 slidedecks en presenter, 2 leerlingpagina's, 3 inlogschermen, 4 beheer, 5 spellen en opruimen. Die volgorde klopt met waar het DS voor gemaakt is (dia's en digibord eerst) en met het risico (leerlingen zien fase 2 en 3, docenten fase 4). Eén motivatie om af te wijken: fase 1a (prompt en skill) is los van alle UI-werk en kan als eerste, nog vóór fase 0, omdat het geen code raakt die tests of build beïnvloedt en direct effect heeft op het volgende deck.

Vaste werkwijze per fase (uit `IMPLEMENTATIEPLAN-PRESENTER-UX.md`): bouwen -> `node --test src/lib/` (963 tests) -> `npx eslint <gewijzigde bestanden>` -> `npm run build` -> browsercheck op 375 px, 1280 px en 1920 px -> commit op `codex/digitale-vaardigheden-seed` -> push (Vercel deployt vanaf GitHub; nooit `firebase deploy --only hosting`).

### Fase 0: tokens en fonts, zonder zichtbare verandering

Doel: het DS bestaat in de code, de fonts laden, niets verandert voor gebruikers.

Stappen:
1. `public/fonts/` aanmaken met Bangers en Atkinson Hyperlegible Next (woff2) en `OFL.txt`.
2. In `src/index.css` het blok uit 3.1 opnemen; `@font-face` toevoegen; de Google-`@import` laten staan tot fase 2 (Outfit/Jakarta zijn dan nog in gebruik).
3. `index.html`: `<link rel="preload" as="font" type="font/woff2" crossorigin>` voor beide fonts; `lang="nl"` (staat nu op `en`).
4. `src/lib/designTokenStyles.test.js` uitbreiden met: de negen primitieven staan exact in `index.css`; `--font-display` bevat Bangers; `--font-sans` bevat Atkinson; geen nieuwe `@import` van Google Fonts na fase 2.
5. Eén verborgen demo-route of exportbestand (`exports/design-system-v2-preview/00-tokens.html`) dat alle tokens, de typografische schaal en de zes fasechips toont, als referentie voor de andere fasen.

Bestanden: `src/index.css`, `index.html`, `public/fonts/*`, `src/lib/designTokenStyles.test.js`.
Tests: `node --test src/lib/` groen; `npm run build`; Lighthouse-check dat de fonts preloaden en niets op `fonts.googleapis.com` bijkomt.
Risico's: laag. Naamconflict: Tailwind 4 genereert uit `--color-blue` de utility `bg-blue`, wat kan botsen met de gewoonte `bg-blue-600`; Tailwind's eigen `blue-*`-schaal blijft bestaan omdat `@theme` zonder `--color-*: initial` alleen toevoegt. Bewust laten staan tot fase 5.
Rollback: één commit terugdraaien; er zijn geen afhankelijke wijzigingen.

### Fase 1a: NotebookLM-prompt en slidedeck-skill

Doel: elk nieuw deck volgt het DS, zonder UI-code aan te raken.

Stappen:
1. In `src/lib/notebookPromptTemplates.js` een tweede export toevoegen: `HELIX_QUEST_PROMPT_NAME = 'Helix Quest-familie (design system v2)'` en `HELIX_QUEST_PROMPT` met drie delen: (a) de masterprompt van p.22 letterlijk, aangevuld met de exacte hexwaarden van p.6 en de twee fontnamen; (b) de promptvelden van p.21 als verplicht uitvoerformaat per dia, inclusief de regel "laat NotebookLM eerst structureren (alle velden) en dan pas vormgeven"; (c) het MUST/SHOULD/NEVER-contract van p.20 als slotcontrole. De placeholder `[vul hier onderwerp/paragraaf in]` blijft zodat `fillNotebookPrompt` werkt. De bestaande VMBO/EOA-prompt blijft bestaan als "Algemene digibordles (klassiek)".
2. Bepalen wat er met de bestaande slide-opbouw gebeurt (titel, leerdoelen, startvraag, begrippen, veelgemaakte fouten, "Nu jij", samenvatting): die mapt op de families ROUTE (titel+leerdoelen), KIJK (begrip, voorbeeld), DOE ("Nu jij"), CHECK (antwoordslide), HULP (veelgemaakte fouten), KLAAR (samenvatting/afsluiting). Deze mapping als tabel in de prompt opnemen, zodat een wiskundeles net zo goed in de familie past als een digitale-vaardighedenles.
3. `src/services/slidedeckService.js`: `ensureDefaultPromptTemplate` seedt alleen bij een lege collectie. Toevoegen: `ensurePromptTemplateVersion(key, version)` die per bekende template-sleutel controleert of de versie in Firestore bestaat en anders aanmaakt (oude versie op `status: 'archived'`); `isDefault` verplaatsen naar de nieuwe template. Test in `src/lib/` voor de pure vergelijking (bestaande service-code heeft geen tests; de lib-laag wel).
4. `src/lib/slidedeckReview.js`: reviewmetadata uitbreiden met `designSystemVersion: 'v2'`, `qaScorecard` (15 criteria x 0/1/2, totaal, drempels 27/23), `autoReject` (5 vlaggen) en per dia de twaalf promptvelden (optioneel, uit de door NotebookLM gegeven structuur geplakt). `getSlidedeckReviewStatusLabel` krijgt "Vrijgeven (>= 27)", "Reviseren (23-26)", "Herstructureren (< 23)". Tests uitbreiden.
5. `src/pages/AdminSlidedecksPage.jsx`: templatekeuze toont de nieuwe template als standaard; reviewpaneel toont de scorecard als 15 rijen met drie knoppen (0/1/2) en de vijf auto-afkeurvinkjes; vrijgave naar het CMS-slidedeckblok (`slidedeckCmsSync`) alleen bij score >= 27 en nul auto-afkeur, met een docent-override die de reden logt (wijzigingsregel p.24).
6. `.claude/skills/create-slidedeck/SKILL.md`: sectie "Design system v2" met de masterprompt, de promptvelden als verplicht JSON-schema (`fase`, `variant`, `familie`, `kernlayout`, `focus`, `tekst`, `visual`, `actie`, `succes`, `hulp`, `bronbeeld`, `uitzondering` per slide), de QA-scorecard als stap vóór export, de screenshotregels als checklist, en de PDF-layoutparagraaf vervangen (nu "14-18 pt titels", moet 40-72 pt worden). `slidedeck-preferences.md`: fonts, maten en kleurregel vervangen door het DS; "Dark mode option" schrappen (het DS is light-only).
7. Eén proefdeck genereren met de nieuwe prompt (bijvoorbeeld de bestaande Digital Mission-inhoud) en de scorecard invullen. Pas na een score >= 27 de template als standaard zetten.

Bestanden: `src/lib/notebookPromptTemplates.js`, `src/services/slidedeckService.js`, `src/lib/slidedeckReview.js` (+ `.test.js`), `src/lib/slidedeckCmsSync.js` (+ test), `src/pages/AdminSlidedecksPage.jsx`, `.claude/skills/create-slidedeck/SKILL.md`, `.claude/preferences/slidedeck-preferences.md`.
Tests: bestaande slidedeck-tests plus nieuwe voor scorecard-totaal, drempels, auto-afkeur en templateversie; `npm run build`.
Risico's: NotebookLM negeert delen van een lange prompt; daarom staan de promptvelden en het contract ná de masterprompt en is het proefdeck een harde stap. Firestore-rules voor `promptTemplates` moeten schrijven door admin toestaan (bestaat al voor `createPromptTemplate`).
Rollback: de oude template blijft in Firestore; `isDefault` terugzetten volstaat. Skill-wijzigingen zijn tekst.

### Fase 1b: presenter en digibord

Doel: alles wat op het bord komt, ziet eruit als het DS.

Stappen:
1. `DigibordViewer.jsx`: per slidetype een kernlayout kiezen in `digibordSlideUtils.js` (`kernlayout: 'focus' | 'split' | 'status'`, `fase: 'kijk' | 'doe' | 'check' | 'klaar'`): theorie/voorbeeld -> SPLIT/KIJK; vraag -> FOCUS/DOE, antwoord onthuld -> STATUS/CHECK; samenvatting -> STATUS/KLAAR; media -> FOCUS/KIJK; game -> FOCUS/DOE; slidedeck -> PDF-presenter. Elke slide krijgt `.ds-anchor` bovenaan (titel + fasechip), `.ds-card` als vlak, `--ds-text-slide-title` en `--ds-text-instruction`, crème grond. De overzichtsmodus (thumbnails) en de chrome (knoppen, "Slide 3/12") in ink op paper-2.
2. `PdfSlideDeckPresenter.jsx`: chrome (balk, knoppen, foutmeldingen) in DS-tokens; het PDF-canvas zelf blijft de bron.
3. Presenter: `presenter-chrome-surface` -> paper-2 met ink-lijn; toolbarknoppen wit met 2 px ink-rand, actief = geel met ink; pen-swatches: de negen DS-primitieven als vaste set, custom kleur blijft; timer (`PresenterFocusTools`) rechtsboven, mm:ss, `.ds-timer`, en bij nul een "CHECK"-overgang (bijvoorbeeld de spotlight uit, vraagkaart onthuld); geïmporteerde lesstofkaarten (`PresenterImportedObjectCard`) krijgen dezelfde `.ds-anchor`/`.ds-card`-opbouw als de digibord-viewer zodat bord en viewer één familie zijn; donkere bordmodus behouden (het DS kent geen dark mode, maar de bordmodus is functioneel en niet stilistisch: witte inkt op donker bord).
4. `AdminDigibordPage.jsx`: hoofdstukkaarten met DS-tinten in plaats van `paletColors`.

Bestanden: `src/components/digibord/*` (2), `src/components/presenter/*` (vooral Shell, Toolbar, FocusTools, ImportedObjectCard, PageThumbnail, Background), `src/lib/digibordSlideUtils.js` (+ test), `src/pages/AdminDigibordPage.jsx`, `src/index.css`.
Tests: `digibordSlideUtils.test.js` uitbreiden met kernlayout/fase-mapping; presenter-tests (`presenterModel`, `presenterHistory`, `presenterGeometry`, `presenterObjects`, `presenterStorage`) blijven groen; `npm run build`; handmatige bordcheck op 1920 px en op de CTOUCH (achterwandtest p.19: kop en actie leesbaar op 6-8 m).
Risico's: de Presenter is 8.150 regels met veel inline kleurstrings; een regex-vervanging is niet veilig, dus per component met de hand. Bordmodus en instrumenten hebben eigen kleuren die functioneel zijn (liniaal, gradenboog) en niet mee mogen.
Rollback: per component committen; `presenter-chrome-surface` kan in één regel terug.

### Fase 2: leerlingpagina's

Doel: leerlingen zien de familie op telefoon en laptop, met dezelfde fasetaal als op het bord.

Stappen:
1. `AppShell.jsx`: crème grond, header wit met ink-onderlijn, logo en merkbanner blijven paars (Helix-context), navigatie-actief = geel-soft met ink-tekst en ink-onderstreping (niet alleen kleur), tokenbalans-pil in teal-soft.
2. `StudentLessonPage.jsx`: per lesblok een `.ds-anchor` met bloktitel en fasechip (theorie = KIJK, opdracht = DOE, ingeleverd/nakijken = CHECK, afgerond = KLAAR); Digidocent en herstelopdracht als HULP-vlag (oranje-soft, orange-ink, met icoon); `inputClassForStatus` naar green-soft/red-soft met ink-tekst en icoon; primaire knoppen blauw; secundaire wit met ink-rand; `lesson-prose` in Atkinson met `--ds-text-instruction` op desktop en 18 px op telefoon; koppen in Bangers alleen op h1/h2-niveau >= 22 px.
3. `StudyStepRail.jsx` en `TableOfContents.jsx`: voortgangsbalken krijgen naast kleur een label ("4 van 7") en per stap een icoon; `study-step-active` blauw-soft met ink in plaats van gevuld paars.
4. `src/lib/klasVoortgangOverzicht.js`: `STAP_STATUS_PRESENTATIE` krijgt `icon` (CheckCircle2, Clock, AlertTriangle, ArrowRight, Circle) en DS-kleuren; alle plekken die `dotClass` gebruiken tonen het icoon; `PLUS_PRESENTATIE` blijft paars (Helix-context: extra HELIX-stof).
5. `StudentProfilePage`, `StudentSpellenPage`, `StudentTokenShopPage`: kaarten `.ds-card`, badges in DS-tinten; tokenshop-effecten en `victory-*` naar geel/blauw/teal, aurora weg.
6. `AITutorChat.jsx`: chatbubbels wit/ink, Digidocent-bubbel teal-soft (ondersteuning).
7. Google-`@import` verwijderen; Outfit en Plus Jakarta Sans verdwijnen uit `index.css` (`.helix-eyebrow`, `.helix-heading-*`, `.btn-*`, `.lesson-prose` headings, `.project-kompas-document`).

Bestanden: `src/pages/Student*.jsx` (4), `src/components/layout/*` (2), `src/components/lesson/*` (3), `src/components/common/*` (6), `src/components/tokens/*` (2), `src/components/slides/AITutorChat.jsx`, `src/components/media/MediaRenderer.jsx`, `src/lib/klasVoortgangOverzicht.js` (+ test), `src/index.css`.
Tests: `klasVoortgangOverzicht.test.js` uitbreiden (elke status heeft icoon én label); `designTokenStyles.test.js` aanpassen (primaire knop is blauw, actieve tab is geel-soft; bewaker "geen Google Fonts-import" aan); nieuwe Playwright-smoke: leerling logt in met dev-login, opent een hoofdstuk, ziet fasechip en voortgangslabel (`tests/e2e/student-lesson-smoke.spec.js`); grijswaardentest: screenshot in `filter: grayscale(1)` en controleren dat status nog leesbaar is.
Risico's: `StudentLessonPage` is 4.027 regels en de plek waar de nakijkfout van 25 augustus zat; wijzigingen strikt cosmetisch houden, geen logica in dezelfde commit. Bangers op koppen van lange paragraaftitels (> 6 woorden) breekt de regel; oplossing: Bangers alleen op het vaste anker ("STAP 3") en de paragraaftitel in het leesfont.
Rollback: per pagina committen; tokens uit fase 0 blijven staan.

### Fase 3: inlogschermen

Doel: het eerste scherm is herkenbaar familie, en de decks die het inlogscherm screenshotten kloppen weer.

Stappen:
1. `LoginScreen.jsx`: linker merkpaneel van gevuld paars naar crème met gele titelzone ("WELKOM BIJ HELIX", Bangers), logo in paars (Helix-context), formulier in `.ds-card`, knop blauw, foutmelding red-soft met icoon, succes green-soft met icoon.
2. `AdminLoginScreen.jsx`: zelfde opbouw, donker paneel wordt ink met gele kop; ontwikkelaarspanelen ongemoeid.
3. `NameSetupModal`, `ClassSelectionModal`, `RequiredPasswordChange`: `.ds-card`, `input-auth` met 2 px ink-rand en blauwe focus.
4. Nieuwe screenshots van beide inlogschermen maken en als bronbeeld in het Digital Mission-deck vervangen (BRONLOCK).

Bestanden: `src/components/auth/*` (5 schermen), `src/index.css` (`input-auth`, `btn-primary-lg`, `btn-secondary`, `helix-login-visual-bg`).
Tests: `tests/e2e/auth-admin-smoke.spec.js` blijft groen (selecteert op tekst, niet op kleur); `loginFlow.test`/`devAuth.test.js` ongemoeid; handmatige check op 375 px.
Risico's: laag technisch, hoog zichtbaar (elke leerling ziet dit scherm elke les). Screenshots in bestaande decks verouderen; dat is de reden om fase 3 ná fase 1a te doen, zodat het proefdeck meteen de nieuwe screenshots gebruikt.
Rollback: één commit.

### Fase 4: beheer

Doel: docentschermen delen tokens en fonts met de rest, zonder de dichtheid te verliezen.

Stappen:
1. Alleen tokens: `--helix-*`-aliassen omzetten naar de DS-waarden (navy -> ink, muted -> ink-muted, border -> line-soft, surface-soft -> paper-2, purple -> blauw waar actie, paars waar merk). Geen 2 px contouren op rijen, geen Bangers onder h1.
2. `admin-nav-tab-active`, `dashboard-lens-tab-active`, `studio-toolbar-control-active`, `btn-tool`, `helix-action-card*`: gradientranden vervangen door effen ink- of blauwlijn; bewakers in `designTokenStyles.test.js` aanpassen.
3. `paletColors.js`: van 13 naar 6 DS-tinten (soft-varianten) met ink-tekst; bestaande Firestore-waarden (`colorId`) mappen via een tabel zodat oude keuzes blijven werken (`indigo` -> `blue`, `pink`/`red` -> `red`, `amber`/`lime` -> `yellow`, `cyan` -> `teal`, `gray`/`slate` -> `paper`).
4. Statuskleuren in dashboard (`ClassOverview`, `KlasVoortgangMatrix`, `AandachtsLijst`, `NakijkPaneel`, `LeerlingStappen`) komen automatisch mee uit fase 2 via `STAP_STATUS_PRESENTATIE`; overblijvende hardcoded `emerald/amber/rose` vervangen.
5. CMS (`ContentBlockBuilder`, `QuestionEditor`, `NavigationTree`, `CmsShell`): tokens en fonts; nieuw readiness-hint op tekstblokken: "meer dan 3 regels of 35 woorden in een instructieblok: overweeg splitsen" (copy-fit p.7), niet blokkerend.
6. `AdminSlidedecksPage`, `AdminSpellenPage`, `AdminTokenManagementPage`, `AdminKlassenPage`, `AdminLeerlingenPage`, `AdminMeldingenPage`, `AdminAiSettingsPage`, `AdminSettingsPage`, `AdminCropToolPage`, `TakenToewijzenPage`, `AdminProjectKompasPage`: dezelfde tokenvervanging, pagina voor pagina.

Bestanden: 12 `Admin*`/`TakenToewijzen`-pagina's, `src/components/cms/*` (10), `dashboard/*` (7), `admin/*` (8; canvaskleuren van crop-tool ongemoeid), `games/*` (4), `src/lib/paletColors.js` (+ nieuwe test voor de mapping), `src/lib/contentReadiness.js` (+ test), `src/index.css`.
Tests: alle 963 plus nieuwe; `designTokenStyles.test.js` volledig herzien; `auth-admin-smoke` e2e; handmatige check van `ContentBlockBuilder` op 1280 px (dichtheid) en van `KlasVoortgangMatrix` in grijswaarden.
Risico's: omvang (circa 12.000 regels JSX met verspreide Tailwind-kleurklassen: 1.247 `slate-*`). Aanpak: per pagina, en `slate-*` niet stuk voor stuk vervangen maar via twee `@theme`-overrides (`--color-slate-900: var(--color-ink)`, `--color-slate-500: var(--color-ink-muted)`, `--color-slate-200: var(--color-line-soft)`, `--color-slate-50: var(--color-paper-2)`) zodat de bestaande klassen de nieuwe waarden krijgen; daarna in rust opschonen.
Rollback: de `@theme`-overrides zijn één blok; per pagina committen.

### Fase 5: spellen en opruimen

Doel: spelschillen in de familie; dode stijl en oude tokens weg.

Stappen:
1. Per React-spel: start-, pauze-, resultaat- en HUD-schil naar `.ds-anchor`/`.ds-card`, Bangers voor de speltitel, blauw voor "Start", timer volgens p.16 waar een timer bestaat (Turbo Typen, Data Koerier); speelvelden, sprites en spelkleuren blijven (inhoud, p.6: "inhoudsbeelden mogen rijker kleuren").
2. `GamePlayer.jsx`, `GameComponentRenderer.jsx`, `ExternalGameHost.jsx`: tokens; DVLingo zelf ongemoeid (pariteitsbank).
3. `VictoryEffectOverlay`: DS-kleuren, aurora weg, maximaal één burst (p.22).
4. Verwijderen: `src/components/slides/` behalve `AITutorChat.jsx` (verhuizen naar `src/components/lesson/`), `.slide-heading`/`.slide-content`, `src/App.css`, `--helix-gradient*`, `--helix-pink`, `--helix-soft-pink`, `--helix-soft-peach`, `--helix-shadow-glow`, `helix-login-visual-bg`, `helix-ai-chip`-gradient; `--helix-*`-aliassen die alleen nog naar `--ds-*` wijzen samenvoegen; Tailwind-`@theme` opschonen (`--color-primary-*`, `--color-success-*`, `--color-error-*`, `--color-warning-*`).
5. Documentatie: één `DESIGN_SYSTEM.md` (nieuw, gebaseerd op dit plan en het DS), oude stijl-documenten naar `docs/archief/`, kompas bijwerken met beslisregel en tokenregel.

Bestanden: `src/games/*/**.jsx` (6), `src/components/games/*` (4), `src/components/tokens/VictoryEffectOverlay.jsx`, `src/components/slides/*`, `src/App.css`, `src/index.css`, documentatie.
Tests: spel-logica-tests (`dataKoerierLogic`, `pacoLogic`, `zoektochtLogic`, `turboTypenLogic`, `wachtwoordDetectiveLogic`, `dvlingoScore`) blijven groen; DVLingo-pariteit (`exports/dvlingo-pariteit/`) ongewijzigd; `npm run build` met bundle-groottevergelijking (verwijderen van `slides/` scheelt).
Risico's: `grep` op `slides/` vóór verwijderen herhalen; de tokeneconomie (`helix-spel-tokeneconomie`) raakt niets.
Rollback: verwijderingen in een eigen commit, los van restyling.

### Doorlooptijd (indicatie)

Fase 0: 0,5 dag. Fase 1a: 1 dag plus proefdeck. Fase 1b: 3-4 dagen. Fase 2: 3-4 dagen. Fase 3: 0,5-1 dag. Fase 4: 4-5 dagen. Fase 5: 2 dagen. Totaal circa drie werkweken, met na fase 1b en fase 2 een natuurlijk moment om een klas te laten kijken (5 SEC- en FOCUS-test uit p.19 met echte leerlingen).

---

## 6. Beslispunten voor de gebruiker

1. **Reikwijdte: de hele app of alleen slides, presenter en digibord?** Het DS is projector-first; de app kan er half buiten blijven. Aanbeveling: hele app, maar in de volgorde hierboven en met de expliciete regel dat beheer alleen tokens overneemt en geen comic-vormtaal. Zo blijft één familie zichtbaar van deck tot leerlingscherm zonder dat docentschermen lijden.
2. **Paars.** Terugbrengen tot logo, merkbanner, "uit HELIX"-chip en plusparagrafen, met blauw als actiekleur (aanbeveling), of paars als actiekleur houden en de DS-regel "paars = Helix-context" negeren. Half doen (paars én blauw als actie) is de slechtste optie.
3. **Fonts zelf hosten of via Google Fonts.** Aanbeveling: zelf hosten (OFL staat het toe; schoolnetwerken, AVG, offline bord). En: Atkinson Hyperlegible Next (200-800) in plaats van de klassieke Atkinson (400/700), omdat HELIX veel gewichten gebruikt.
4. **Geel als knopkleur?** Het DS gebruikt geel alleen voor navigatie/kop. Aanbeveling: geel nooit op knoppen; primaire actie blauw met witte tekst (4,5:1) of, waar tekst klein is, blauw-ink. Wie geel op knoppen wil, krijgt zwarte tekst en een zwarte rand, en dan is "actief tabblad" niet meer van "knop" te onderscheiden.
5. **Crème als paginagrond op telefoon.** #FFF7E8 oogt op OLED-schermen warmer/gelig dan op een projector. Aanbeveling: crème als grond, wit als kaartvlak; na fase 2 met een klas bekijken en zo nodig een koelere tint (bijvoorbeeld #FFFAF0) als app-variant vastleggen via de wijzigingsregel (p.24), niet stilzwijgend.
6. **De NotebookLM-prompt: vervangen of erbij?** Aanbeveling: erbij als nieuwe standaard, oude template gearchiveerd maar beschikbaar; pas definitief maken na één proefdeck met scorecard >= 27. En de vraag of de nieuwe prompt ook voor wiskundelessen (Pythagoras) de standaard wordt: aanbeveling ja, met de familie-mapping uit fase 1a stap 2.
7. **Presenter-decor en bordmodus.** `presenter-chrome-surface` (perzik-roze-lavendel) verdwijnt in fase 1b; de donkere bordmodus blijft als functionele modus. Akkoord?
8. **Inlogscherm restylen ja/nee, en wanneer.** Het huidige paarse inlogscherm staat als screenshot in de Digital Mission-decks. Restylen betekent die decks opnieuw screenshotten. Aanbeveling: ja, direct na fase 1a, zodat het proefdeck de nieuwe screenshots bevat.
9. **Vragen aan de auteur van het DS.** Wat betekent "O-V-U-C" in de scorecard (p.23)? Mogen ink-varianten en soft-tinten (paragraaf 3) als officiële componentlaag in het document, zodat de app niet afwijkt maar het systeem aanvult? En: is er een voorkeur voor Bangers boven Anton? (Anton is minder "comic" en beter leesbaar bij kleine maten; het DS noemt beide.)
10. **Opruimen van `src/components/slides/`** (10 ongebruikte Pythagoras-slidecomponenten) en `src/App.css`: verwijderen in fase 5, of bewaren voor een toekomstige native slide-renderer? Aanbeveling: verwijderen; git bewaart ze, en een toekomstige native renderer hoort op de DS-kernlayouts te worden gebouwd, niet op deze bestanden.
