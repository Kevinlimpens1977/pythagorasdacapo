# Onderzoek lesstof bouwen - beste verbeteringen

Datum: 2026-06-06
Scope: onderdeel `Lesstof bouwen` binnen HELIX, met nadruk op CMS-lesroute, contentblocks, vragen, quiz/toets, slidedecks, NotebookLM/AI, leerlingroute, digibord en datacontracten.

## 1. Doel van dit rapport

Dit rapport is bedoeld als keuzedocument. Het geeft geen implementatieplan en voert niets door. Het brengt vanuit vier invalshoeken in kaart welke verbeteringen de meeste waarde hebben:

1. Didactiek en leerontwerp.
2. UX en docentworkflow.
3. Techniek, architectuur en data.
4. Content, AI, bronkwaliteit en slidedecks.

De hoofdvraag:

> Welke verbeteringen aan `lesstof bouwen` leveren de meeste kwaliteit, veiligheid en docentgemak op voordat er nog meer contentfeatures worden toegevoegd?

## 2. Samenvatting

HELIX heeft al een sterke basis. De huidige lesroute werkt met negen contentblocktypes: `theory`, `example`, `question`, `quiz`, `toets`, `media`, `summary`, `game` en `slidedeck` in `src/lib/contentBlockUtils.js`. Daarmee is de functionele basis breder dan alleen tekst en vragen. De leerlingroute in `src/pages/StudentLessonPage.jsx` is relatief volwassen: voortgang, AI-hulp, open antwoordbeoordeling, pogingen, quiz/toets en herstel/uitdaging zijn al aanwezig.

De zwakke plek zit vooral vooraan in de keten: bij het bouwen en publiceren van lesstof. Docenten kunnen veel maken, maar het systeem dwingt nog te weinig af dat lesstof doelgericht, brongetrouw, veilig, opgeslagen, compleet en didactisch verantwoord is voordat het live gaat.

De beste eerste verbeteringen zijn daarom niet "nog meer vraagtypes", maar:

1. Veiligheids- en datacontract op orde brengen.
2. Publiceren veranderen van een simpele statusknop naar een readiness/review-flow.
3. Leerdoelen, bewijsproduct, bronstatus en feedbackkwaliteit first-class maken.
4. Autosave en draft-recovery toevoegen.
5. Slidedeck/AI-output koppelen aan bronmetadata, JSON/HTML-export en docentreview.

## 3. Huidige situatie

### 3.1 Lesstofwerkplek

`src/pages/AdminLesstofPage.jsx` is een hub met vier ingangen:

- Lesmateriaal bouwen: `/admin/cms`
- Lesmateriaal klaarzetten: `/admin/taken-toewijzen`
- Digibord presenteren: `/admin/digibord`
- Slidedecks / NotebookLM: `/admin/slidedecks`

Dat is helder als startpunt, maar de echte workflow is verspreid over losse pagina's. Een docent moet zelf de keten onthouden: bouwen, previewen, klaarzetten, presenteren, slidedeck maken en weer terugkoppelen.

### 3.2 CMS-lesroute

De feitelijke leerlingroute bestaat uit `contentBlocks`. Die worden gelezen via `getContentBlocks` in `src/services/cmsService.js` en gebouwd in `src/components/cms/ContentBlockBuilder.jsx`.

Sterke punten:

- Volgorde is expliciet.
- Blokken kunnen concept/gepubliceerd zijn.
- Drag-and-drop en verplaatsen zijn aanwezig.
- Bloktypes dekken theorie, voorbeelden, vragen, media, game, samenvatting, quiz/toets en slidedeck.
- Quiz/toets hebben pogingbeleid en tokens.

Zwakke punten:

- Publiceren kan zonder inhoudelijke validatie.
- Niet elk bloktype heeft minimale vereisten.
- Er is geen didactische checklist bij publicatie.
- Er is geen verplichte leerdoel/bewijsproduct-koppeling.
- Er is geen autosave of duidelijke dirty-state bescherming in de lesblokstudio.

### 3.3 Vraagmodel

Er bestaan twee vraagmodellen naast elkaar:

- `question` contentblocks verwijzen naar een apart document in `vraag` via `linkedVraagId`.
- `quiz` en `toets` bewaren items inline in `contentBlocks.content.items`.

Dit werkt, maar is conceptueel en technisch rommelig. Voor docenten voelt een vraag als een lesblok, maar technisch is het een wrapper rond een apart document. Voor techniek betekent dit extra risico op weesvragen, missende linked questions en dubbele adapters.

### 3.4 Slidedeck/AI-workflow

De projectdocumentatie belooft een workflow met PDF + JSON + HTML en source tags. De huidige app-flow maakt vooral een NotebookLM-pakket met bron-PDF en prompt, waarna een gegenereerde NotebookLM-PDF wordt geupload. Die PDF kan daarna als `slidedeck`-blok gekozen worden.

Sterk:

- Praktisch en robuust voor digibordgebruik.
- Prompttemplate is brongebonden en VMBO/EOA-gericht.
- Slidedeckpackages kunnen aan context worden gekoppeld.

Zwak:

- Geen verplicht JSON/HTML-exportcontract in de app-flow.
- Geen per-slide source tags.
- Geen reviewstatus die publicatie blokkeert.
- Geen per-claim/per-slide bronverwijzing.
- Alleen titel is verplicht bij het maken van een bronpakket.

## 4. Belangrijkste risico's

### P0 - Leerlingen kunnen mogelijk antwoorden en concepten lezen

De technische analyse wijst op een groot risico in `firestore.rules`: ingelogde gebruikers kunnen `vraag` en `contentBlocks` lezen. De UI filtert wel op `published`, maar client-side filtering is geen beveiliging. Omdat antwoorden/model answers in `vraag.antwoord` en quiz/toets-content kunnen zitten, moet dit voor toets- en leerlinggebruik eerst worden opgelost.

Aanbeveling:

- Splits publieke leerlingcontent en private docent/antwoorddata.
- Of serve antwoorden alleen via callable functions.
- Laat leerlingen alleen toegewezen, gepubliceerde lesstof lezen.

Waarom eerst:

Zonder deze stap kun je mooie toets- en feedbackfeatures bouwen die inhoudelijk kloppen, maar alsnog antwoorddata lekken.

### P0 - Publiceren is te licht

Een blok kan gepubliceerd worden zonder checks. Dat betekent dat lege tekst, ontbrekende vraag, ontbrekend media-item, lege quiz of niet-gekoppeld slidedeck live kan gaan.

Aanbeveling:

- Maak een readiness-check per bloktype.
- Publiceren kan pas als minimale velden compleet zijn.
- Voeg een bewuste override toe voor admins, met reden.

Minimale checks:

- `theory`/`summary`: niet-lege tekst.
- `question`: geldige gekoppelde vraag + antwoordconfiguratie.
- `media`: geldige media/link + alt/caption waar relevant.
- `slidedeck`: gekozen package met geupload deck.
- `quiz`/`toets`: minimaal 1 item, antwoorden ingevuld, pogingbeleid geldig.
- `game`: geldig gameId of planned-placeholder met status.

### P0 - Geen verplicht leerdoel en bewijsproduct

De docs voor Digitale Vaardigheden zijn didactisch sterk: kerndoelen, vaste HELIX-opbouw, bewijsproducten, tokens, badges en certificaten. Maar in de CMS-builder zijn leerdoelen en bewijsproducten nog geen leidende velden.

Aanbeveling:

- Maak op paragraafniveau verplicht:
  - leerdoelen;
  - bewijsproduct of eindprestatie;
  - kerndoel/SLO-koppeling waar relevant;
  - niveau/doelgroep;
  - geschatte lestijd.

Waarom:

Dan bouwt de docent geen rij losse blokken, maar een doelgerichte leerroute.

### P0 - Opslaan is kwetsbaar

Lesblokstudio's werken met handmatig opslaan. Escape kan sluiten. Er is onvoldoende bescherming tegen niet-opgeslagen wijzigingen. Crops/OCR en vraagbewerking maken dit extra kwetsbaar.

Aanbeveling:

- Voeg autosave of lokale draft-recovery toe.
- Toon status: `Niet opgeslagen`, `Opslaan...`, `Opgeslagen om 14:32`.
- Blokkeer sluiten/navigeren bij dirty content.
- Markeer crop-inserties als dirty totdat echt opgeslagen is.

### P0 - AI/source review ontbreekt als harde poort

Source tags zoals `SOURCE_BASED`, `AI_SUGGESTION`, `NEEDS_REVIEW`, `TEACHER_DECISION` staan in projectafspraken, maar zijn nog geen first-class appcontract dat publicatie afdwingt.

Aanbeveling:

- Voeg `sourceManifest`, `generationManifest`, `reviewStatus`, `sourceTagsSummary`, `citations` en `teacherDecisionLog` toe aan slidedeckpackages en waar nodig contentblocks.
- Publiceer niet automatisch bij `AI_SUGGESTION` of `NEEDS_REVIEW`.
- Vereis docentnotitie bij `TEACHER_DECISION`.

## 5. Beste verbeterpakketten

### Pakket A - Veilig lesstofcontract

Doel:

Zorg dat content veilig, eenduidig en uitbreidbaar is voordat meer features worden toegevoegd.

Onderdelen:

- Firestore rules aanscherpen.
- Antwoorden scheiden van leerling-leesbare content.
- Beslissen of `contentBlocks` de enige bron van waarheid wordt, of dat `vraag` officieel gekoppeld blijft.
- Transactionele create/update voor vraagblok + vraagdocument.
- Centrale normalizers/schema's voor `ContentBlock`, `Question`, `AssessmentItem`, `ProgressRecord`.
- Statusmodel normaliseren: `draft`, `needs_review`, `ready`, `published`, `archived`.

Impact:

Zeer hoog.

Risico:

Middelgroot, omdat dit datamodel en rules raakt.

Aanbevolen volgorde:

Eerst doen. Dit is de fundering voor toetsing, AI-review en publicatie.

### Pakket B - Publicatie en readiness

Doel:

Voorkom dat half-afgemaakte lesstof live gaat.

Onderdelen:

- Readiness-check per bloktype.
- Didactische publicatiecheck op paragraafniveau.
- Validatiepaneel met problemen en waarschuwingen.
- Draft-aware preview: "Bekijk als leerling - concept" en "Bekijk als leerling - gepubliceerd".
- Publicatie-overzicht: hoeveel blokken concept, needs review, klaar, gepubliceerd.

Impact:

Zeer hoog voor docentvertrouwen en leerlingkwaliteit.

Risico:

Laag tot middelgroot. Veel kan eerst als waarschuwing, daarna als harde gate.

Aanbevolen volgorde:

Direct na of parallel aan Pakket A.

### Pakket C - Didactisch ontwerp in de builder

Doel:

Maak didactische kwaliteit zichtbaar en makkelijk invulbaar.

Onderdelen:

- Leerdoelen en bewijsproduct verplicht op paragraafniveau.
- Kerndoel/SLO-koppeling als metadata.
- Taxonomieveld voor vragen en toetsitems:
  - herkennen;
  - begrijpen;
  - toepassen;
  - uitleggen;
  - maken/controleren.
- Scaffoldingrol per blok:
  - ik doe voor;
  - samen oefenen;
  - zelf proberen;
  - bewijs leveren;
  - reflecteren.
- Feedback/misconceptievelden per antwoordoptie.
- Eenvoudige toetsmatrijs voor quiz/toets.

Impact:

Hoog voor VMBO 1-2 kwaliteit, toetsbaarheid en docentkeuzes.

Risico:

Middelgroot. Te veel verplichte velden kunnen docenten vertragen. Beste aanpak: eerst slim voorgestelde defaults en publicatiecheck, niet meteen overal harde verplichting.

### Pakket D - Autosave en herstel

Doel:

Maak contentproductie veilig en ontspannen.

Onderdelen:

- Debounced autosave in lesblokstudio.
- Dirty-state guard bij sluiten, escape en navigeren.
- Lokale draft-recovery bij netwerkproblemen.
- Snackbar/undo bij archiveren.
- Duidelijke save-status in vraagstudio en blockstudio.

Impact:

Hoog voor dagelijks gebruik.

Risico:

Middelgroot door Firestore write-volume en conflictlogica.

Aanbevolen aanpak:

Begin met lokale draft-recovery + dirty-state guard. Daarna pas echte autosave.

### Pakket E - Slidedeck/AI-bronkwaliteit

Doel:

Maak AI- en NotebookLM-output controleerbaar, herbruikbaar en veilig publiceerbaar.

Onderdelen:

- Herstel PDF + JSON + HTML + metadata als standaard exportcontract.
- Source tags per slide en/of contentblock.
- Reviewpaneel: bron-PDF links, NotebookLM-PDF rechts, checklist rechts.
- Verplichte leerdoelen + bronmateriaal bij slidedeckpakket.
- Productiemodus waarin scripts stoppen bij nul bronnen of mislukte upload.
- Koppeling vanuit leeg slidedeckblok: "Maak NotebookLM-pakket voor deze paragraaf".
- Automatische terugkoppeling naar CMS wanneer deck klaar is.

Impact:

Hoog voor betrouwbaarheid en digibordkwaliteit.

Risico:

Middelgroot. Metadata kost extra werk, maar voorkomt dat AI-aanvulling ongemerkt als bronmateriaal live gaat.

### Pakket F - Docentworkflow versnellen

Doel:

Minder klikken, minder contextwissels, sneller goede routes bouwen.

Onderdelen:

- Lesroute-templates:
  - uitleg + voorbeeld + 3 vragen + samenvatting;
  - NotebookLM presentatie + checkvragen;
  - herhaalroute;
  - toetsroute;
  - steunroute;
  - plusroute.
- Bulkacties op lesblokken:
  - publiceren;
  - archiveren;
  - dupliceren;
  - verplaatsen;
  - Digidocent/toolbox aan-uit.
- Zichtbare `...` menu's in plaats van verborgen hover/dubbelklik-acties.
- Coachende empty states.
- Taalconsistentie: overal `Concept` en `Gepubliceerd` in plaats van gemengd Engels/Nederlands.

Impact:

Middel tot hoog.

Risico:

Laag tot middelgroot.

Aanbevolen volgorde:

Na de kwaliteits- en veiligheidsbasis, anders versnel je mogelijk ook slechte publicatie.

## 6. Prioriteitenmatrix

| Prioriteit | Verbetering | Waarom | Eerstvolgende bewijswaarde |
|---|---|---|---|
| P0 | Firestore/antwoordtoegang beveiligen | Voorkomt lekken van antwoorden en concepten | Leerlingen kunnen alleen gepubliceerde/toegewezen content lezen |
| P0 | Readiness/publicatiecheck | Voorkomt halflege leerlingroutes | Publiceren toont blokproblemen en blokkeert kritieke fouten |
| P0 | Leerdoel + bewijsproduct op paragraaf | Maakt lessen doelgericht | Elke paragraaf heeft doel, bewijs en afsluitcheck |
| P0 | Dirty guard/draft recovery | Voorkomt verlies van docentwerk | Sluiten/navigeren waarschuwt bij wijzigingen |
| P0 | AI/source reviewstatus | Voorkomt ongecontroleerde AI-publicatie | `NEEDS_REVIEW` kan niet naar leerling live |
| P1 | Contentblock/question contract | Minder weesvragen en duplicatie | Vraagblok-create is transactioneel of inline |
| P1 | Toetsmatrijs | Maakt quiz/toets uitlegbaar | Items tonen dekking per leerdoel/type/niveau |
| P1 | Draft-aware preview | Docent ziet wat leerling ziet | Preview kan concept en gepubliceerd tonen |
| P1 | Slidedeck-CMS koppeling | Minder contextwissels | Slidedeckblok kan pakket maken en volgen |
| P1 | Source JSON/HTML export | Hergebruik en controle | Elke deck-run heeft PDF + JSON + HTML + metadata |
| P2 | Templates | Sneller goede routes | Docent start vanuit routepatroon |
| P2 | Differentiatie vooraf | Steun/plusroute ontwerpbaar | Blokken kunnen steun/basis/plus markeren |
| P2 | Bulkacties | Minder handwerk | Multi-select op lesblokken |
| P2 | Microcopy/undo | Meer vertrouwen | Archiveren heeft undo, taal is consistent |

## 7. Aanbevolen volgorde

### Fase 1 - Veilig en betrouwbaar publiceren

1. Firestore rules en antwoordtoegang.
2. Statusmodel en readiness-checks.
3. Dirty-state guard en lokale draft-recovery.
4. Paragraafvelden: leerdoel, bewijsproduct, kerndoel, reviewstatus.

Waarom:

Dit voorkomt dat de basis onveilig of inconsistent blijft terwijl je nieuwe contentfunctionaliteit toevoegt.

### Fase 2 - Didactische kwaliteit

1. Didactische publicatiecheck.
2. Feedback/misconceptievelden.
3. Taxonomievelden.
4. Eenvoudige toetsmatrijs.
5. Scaffoldingrol per blok.

Waarom:

Hiermee wordt de builder een ontwerpstudio, niet alleen een contentlijst.

### Fase 3 - AI/source en slidedeckproductie

1. Slidedeck source/review manifest.
2. PDF + JSON + HTML + metadata.
3. Reviewpaneel.
4. Inline CMS-koppeling voor slidedeckblokken.
5. Production-mode validatie voor scripts.

Waarom:

Dit maakt NotebookLM/AI-output bruikbaar als gecontroleerde lesstof, niet alleen als losse PDF.

### Fase 4 - Snelheid en docentgemak

1. Lesroute-templates.
2. Bulkacties.
3. Betere navigatie-acties.
4. Undo/snackbars.
5. Steun/basis/plusroutes.

Waarom:

Pas als de kwaliteitsbasis klopt, is versnellen echt waardevol.

## 8. Beslisvragen voor jou

### Vraag 1 - Wil je eerst veiligheid of docentgemak?

Mijn advies: veiligheid eerst. Vooral antwoordtoegang en readiness-checks.

Keuze:

- A: Eerst Firestore/antwoordtoegang + publicatiechecks.
- B: Eerst autosave/templates voor direct docentgemak.
- C: Eerst AI/slidedeck-review omdat NotebookLM centraal is.

### Vraag 2 - Moet `contentBlocks` de enige bron van waarheid worden?

Mijn advies: ja, op termijn. Maak vragen onderdeel van het contentblockcontract, of maak het gekoppelde vraagmodel transactioneel en expliciet.

Keuze:

- A: Vraagdata inline in contentblocks.
- B: `vraag` blijft apart, maar met hard linked contract.
- C: Hybride tijdelijk houden, eerst alleen safety/validatie.

### Vraag 3 - Hoe streng moet publicatie worden?

Mijn advies: gefaseerd. Eerst waarschuwingen + blokkeren van kritieke fouten, daarna strengere didactische gates.

Keuze:

- A: Alleen waarschuwingen.
- B: Kritieke fouten blokkeren.
- C: Volledige didactische checklist verplicht.

### Vraag 4 - Hoe zwaar moet bronverantwoording worden?

Mijn advies: per-slide source tags in V1; per-claim citaties pas later.

Keuze:

- A: Alleen package-level bronstatus.
- B: Per-slide source tags.
- C: Per-claim citaties en docentbeslissing.

## 9. Conclusie

De beste verbetering is geen losse feature, maar een kwaliteitslaag bovenop de bestaande lesroute:

> HELIX moet docenten niet alleen laten bouwen, maar helpen bewijzen dat een lesroute veilig, compleet, doelgericht, brongetrouw en publiceerbaar is.

De sterkste eerste tranche:

1. Beveilig antwoorddata en conceptcontent.
2. Maak publicatie afhankelijk van readiness.
3. Voeg leerdoel, bewijsproduct en bron/reviewstatus toe.
4. Bescherm docentwerk met dirty guard/draft recovery.
5. Breng AI/slidedeck-output terug naar PDF + JSON + HTML + metadata.

Daarna worden templates, differentiatie, toetsmatrijzen en bulkacties veel waardevoller, omdat ze dan bovenop een betrouwbare basis komen.

## 10. Gebruikte invalshoeken

Dit rapport is samengesteld uit:

- lokale inspectie van de huidige codebase en documenten;
- subagent didactiek/leerontwerp;
- subagent UX/docentworkflow;
- subagent techniek/architectuur/data;
- subagent content/AI/slidedeck/bronkwaliteit.

Er is geen code aangepast.
