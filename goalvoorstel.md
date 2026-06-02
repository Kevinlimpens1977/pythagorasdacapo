# Goalvoorstel: Digidocent Leerflow, Pogingen, Voortgang En Paragraafafsluiting

## Doel

Maak van Digidocent een consistente leerlingbegeleider binnen de hele paragraaf:

- elke vraag heeft standaard Digidocent;
- antwoorden worden betrouwbaar beoordeeld;
- fouten leiden tot socratische feedback;
- voortgang wordt visueel eerlijk weergegeven;
- leerlingen lopen nooit vast door AI-falen;
- aan het einde volgt remediation bij rode fouten of een challenge bij alles groen.

Dit document is bedoeld als goal prompt en functionele specificatie voor de volgende implementatiefase.

## Verplichte Voorafstap

Maak eerst een duidelijke GitHub-backup van de huidige versie voordat er code wordt aangepast.

Voorkeursvorm:

```bash
git status --short
git branch backup/digidocent-before-learning-flow
git push origin backup/digidocent-before-learning-flow
```

Doel: deze exacte versie moet later eenvoudig terug te halen zijn.

## Vastgelegde Beslissingen

### Digidocent Beschikbaarheid

- Digidocent staat standaard aan bij leerlingvragen.
- Niet-vraag-lesblokken zoals slidedecks, video, media, theorie en links hebben Digidocent standaard uit.
- Beheer/admin behoudt een escape om Digidocent per vraag uit te zetten.
- Bestaande vraagblokken zonder expliciete instelling worden behandeld alsof Digidocent aan staat.
- Alleen `allowAiHelp === false` betekent expliciet uit.

### Beoordeling Per Vraagtype

- Open vragen worden inhoudelijk door AI beoordeeld.
- Meerkeuze, invullen, numeriek en volgorde worden lokaal gecontroleerd waar dat betrouwbaar kan.
- Bij fout lokaal antwoord genereert AI alleen de socratische hint.
- Automatische feedback na fout telt niet als actief Digidocent-gebruik.

### Echte Digidocent-Hulp

- Alleen actieve chat-hulp telt als Digidocent-hulp.
- Automatische beoordelingsfeedback of automatische fout-hint telt niet als Digidocent-hulp.
- Goed antwoord zonder chat-hulp: groen voortgangsblokje.
- Goed antwoord met echte chat-hulp: groen voortgangsblokje met rood stippellijntje.
- Dit is zichtbaar voor leerling en docent, zonder straftekst voor de leerling.

### Pogingen

- Maximaal 4 echte beoordeelde pogingen per vraag.
- Technische AI-fouten tellen niet als poging.
- Bij goed antwoord: korte groene bevestiging tonen, daarna automatisch door naar de volgende vraag of lesblok.
- Bij fout antwoord: socratische hint tonen en leerling mag opnieuw proberen.
- Na de 4e echte foute poging: korte melding tonen dat de vraag wordt geparkeerd voor herstel, daarna automatisch door.
- Na 4 fout wordt het voortgangsblokje rood.
- Het modelantwoord wordt niet volledig getoond na 4 fouten.

### AI-Falen Bij Open Vragen

Als AI een open vraag niet kan beoordelen:

- geen goed/fout oordeel;
- geen poging erbij;
- antwoord blijft opgeslagen;
- leerling mag verder;
- voortgangsblokje wordt amber: docentbeoordeling nodig;
- docent ziet in dashboard dat AI niet kon beoordelen;
- leerling mag later opnieuw laten beoordelen zolang docent nog niet beoordeeld heeft;
- als beoordeling later lukt, vervangt groen/rood de amber-status;
- amber triggert geen remediation.

Belangrijk uitgangspunt: een leerling mag nooit vastlopen in de paragraaf door AI-falen.

### Gele Foutmeldingen

- Technische meldingen zoals "Digidocent kon je antwoord niet beoordelen" mogen niet als prominent geel kader boven de vraag blijven hangen.
- Bij AI-falen komt een rustige melding bij het beoordelingsgebied.
- Oude assessment-feedback mag niet aan een nieuwe poging of andere vraag blijven plakken.
- Feedback moet gekoppeld zijn aan de poging waarop die feedback hoort.

### Voortgangsbalk

Voortgangsblokjes krijgen minimaal deze statussen:

- grijs/leeg: nog niet beoordeeld;
- groen: correct zonder echte Digidocent-chat;
- groen met rood stippellijntje: correct met echte Digidocent-chat;
- rood: 4 echte pogingen, nog fout;
- amber: open vraag kon door AI niet beoordeeld worden, docentreview nodig.

Niet-vraag-lesblokken kunnen als gewone afgeronde routeblokken blijven tellen, maar niet als didactische score.

### Paragraafafsluiting

Aan het einde van de paragraaf komt een virtuele eindstap.

- Als er minimaal een rode vraag is: verplichte remediation.
- Als alles groen is: verplichte challenge.
- Amber-vragen triggeren geen remediation, maar blijven zichtbaar als docentreview.

### Remediation

- Remediation verschijnt alleen bij rode vragen.
- Remediation is een compacte herstelset per paragraaf.
- De herstelset wordt automatisch gegenereerd op basis van de rode foutpatronen.
- Inhoud: korte uitleg plus 2 tot 4 ondersteunende opdrachten.
- Didactiek, niveau en onderwerpen sluiten aan op de oorspronkelijke vragen en lesblokken.
- Remediation is verplicht om de paragraaf af te sluiten.
- Remediation herstelt de oorspronkelijke score niet.
- De oorspronkelijke rode vraag blijft rood, zodat de docent het oorspronkelijke probleem ziet.
- Docent ziet achteraf welke remediation is aangeboden en afgerond.

### Challenge

- Als alles groen is, krijgt de leerling een uitdagende open vraag.
- Challenge is verplicht als die verschijnt.
- Challenge heeft maximaal 1 poging.
- Challenge wordt door AI beoordeeld.
- Bij AI-falen krijgt challenge dezelfde amber fallback als open vragen.
- Challenge telt als docentfeedback en/of plusinformatie.
- Een foute challenge maakt de basisparagraaf niet rood.

### Digidocent-Geheugen

- De zichtbare chat is per vraag schoon.
- Digidocent krijgt op de achtergrond wel paragraafsamenvatting mee.
- Digidocent moet patronen kunnen zien, bijvoorbeeld herhaalde fouten of vergeten eenheden.
- Chatballonnen van vraag 1 mogen niet letterlijk zichtbaar blijven bij vraag 2.

## Huidige Onderzoeksbevindingen

Uit codeonderzoek en subagent-analyse:

- Digidocent wordt nu alleen getoond als `allowAiHelp && !submitted`.
- `allowAiHelp` staat standaard uit, waardoor vraag 2 geen Digidocent kan tonen.
- Open-vraagbeoordeling draait wel, ook als de chat uit staat.
- Het gele kader komt uit opgeslagen `openAnswerAssessment.feedback`.
- Oude feedback kan blijven hangen omdat draft-saves bestaande `openAnswerAssessment` bewaren.
- Voortgang rekent nu vooral met `completed` en `isCorrect`.
- Fout na max pogingen bestaat nog niet als aparte afgeronde rode status.
- Goed met AI-hulp gebruikt nu roze tinten, niet groen met rode stippelrand.
- Er is nog geen auto-next na correct antwoord.
- Er is nog geen eind-paragraaf remediation/challenge flow.
- Mogelijke technische bug: `getContentBlocks` kan Firestore document-id overschrijven met `doc.data().id`, waardoor voortgang tussen vragen kan lekken als ids dubbel/fout zijn.

## Voorgesteld Datamodel

Breid bestaande voortgangrecords backwards-compatible uit.

Nieuwe of explicietere velden:

```js
{
  progressType: "contentBlock" | "paragraphEnd",
  assignmentKind: "core" | "remediation" | "challenge",
  resultTier: "in_progress" | "independent" | "guided" | "failed" | "pending_teacher_review",
  completionReason: "correct" | "max_attempts" | "teacher_review_pending" | "remediation_completed" | "challenge_completed",
  attemptStatus: "open" | "completed" | "locked" | "pending_teacher_review",
  attempts: 0,
  maxAttempts: 4,
  isCorrect: false,
  completed: false,
  aiHelpCount: 0,
  aiHelpUsed: false,
  scoreWeight: 0,
  lastAnswer: {},
  lastAssessment: {
    source: "ai" | "local" | "teacher",
    feedback: "",
    missing: [],
    answerSignature: ""
  },
  teacherSignal: "",
  teacherFeedbackSummary: ""
}
```

Backwards compatibility:

- bestaande `helpTier` blijft voorlopig bestaan;
- `resultTier` kan worden afgeleid uit oude velden als het ontbreekt;
- `completed: true` en `isCorrect: false` mag gebruikt worden voor rood gefaalde vragen, mits `resultTier: "failed"`;
- amber gebruikt `completed: true`, `isCorrect: false`, `resultTier: "pending_teacher_review"`.

## Functionele Acceptatiecriteria

1. Elke vraag toont standaard Digidocent, behalve als expliciet uitgezet.
2. Niet-vraag-lesblokken tonen Digidocent standaard niet.
3. Vraag 2 toont Digidocent als het een vraagblok is.
4. Oude gele technische feedback blijft niet hangen bij nieuwe pogingen of andere vragen.
5. Open vraag met AI-falen wordt amber en leerling kan verder.
6. AI-falen telt niet als poging.
7. Foute beoordeelde poging toont automatisch een socratische hint.
8. Maximaal 4 echte pogingen per vraag.
9. Na 4 foute pogingen wordt vraag rood afgerond en leerling gaat door.
10. Goed antwoord toont korte bevestiging en gaat automatisch door.
11. Groen zonder chat-hulp is helder zichtbaar.
12. Groen met chat-hulp heeft rood stippellijntje.
13. Rood en amber zijn zichtbaar in leerlingvoortgang en docentdashboard.
14. Einde paragraaf met rode vragen toont verplichte remediation.
15. Einde paragraaf zonder rode vragen toont verplichte challenge.
16. Challenge telt als docentfeedback, niet als rood voor basisparagraaf.
17. Remediation blijft leerling-specifiek en wordt opgeslagen voor docentinzage.
18. Docent kan zien welke vragen rood, amber, guided of independent zijn.
19. Er is een GitHub-backupbranch voordat implementatie start.
20. Tests dekken poginglogica, voortgangskleuren, Digidocent default, AI-falen, remediation en challenge.

## Implementatiefases

### Fase 0: Backup En Veiligheidsnet

- Maak backupbranch op GitHub.
- Noteer actuele commit.
- Draai bestaande tests.

### Fase 1: Bugfixes En Digidocent Standaard Aan

- Maak Digidocent default aan voor vraagblokken.
- Houd expliciet `allowAiHelp === false` als admin escape.
- Non-question blokken default uit.
- Fix `getContentBlocks` zodat Firestore doc-id leidend blijft.
- Wis of koppel oude assessmentfeedback aan de juiste poging.

### Fase 2: Pogingen, Beoordeling En Voortgangsstatussen

- Introduceer `maxAttempts = 4`.
- Scheid AI-falen van echte poging.
- Voeg amber, rood, groen en groen-met-stippel toe.
- Auto-next na goed en na max pogingen.
- Automatische socratische hints bij foute pogingen.

### Fase 3: Docentdashboard En Scorefeedback

- Toon independent/guided/failed/pending teacher review.
- Toon attempts, AI-chat hulp, scoreWeight en teacherSignal.
- Zorg dat oude records leesbaar blijven.

### Fase 4: Paragraaf-Eindstap

- Voeg virtuele eindstap toe.
- Genereer remediation bij rood.
- Genereer challenge bij alles groen.
- Sla resultaten op als `progressType: "paragraphEnd"`.

### Fase 5: Testen En Deploy

- Unit-tests voor alle nieuwe statuslogica.
- Functions-tests voor AI JSON en fallback.
- Build en gerichte lint.
- Deploy pas na akkoord.

## Goal Prompt Voor Volgende Codex-Run

```text
Doel: implementeer de Digidocent leerflow voor HELIX volgens goalvoorstel.md.

Werk in C:\Projecten\helix leerplatform.

Belangrijk:
1. Maak eerst een GitHub-backupbranch van de huidige staat:
   backup/digidocent-before-learning-flow
   Push deze branch naar origin voordat je code wijzigt.
2. Verander niets aan ongerelateerde bestanden.
3. Werk testgedreven waar mogelijk.
4. Commit en push elke significante fase.
5. Deploy pas na expliciete verificatie en alleen als de gebruiker dat vraagt.

Functionele scope:
- Digidocent standaard aan bij vraagblokken, standaard uit bij non-question blokken.
- Admin escape: alleen expliciet allowAiHelp === false zet Digidocent uit.
- Fix gele technische assessmentmeldingen die blijven hangen.
- Open vragen: AI beoordeelt.
- Andere vraagtypen: lokaal beoordelen, AI alleen voor socratische fout-hint.
- Maximaal 4 echte pogingen.
- AI-falen telt niet als poging en geeft amber/docentreview-status, leerling mag verder.
- Goed antwoord: korte groene bevestiging, daarna auto-next.
- Fout antwoord: automatische socratische hint.
- Na 4 fout: rood blokje, korte melding, auto-next.
- Voortgang: groen, groen met rood stippellijntje, rood, amber.
- Einde paragraaf:
  - rode vragen -> verplichte remediation;
  - alles groen -> verplichte challenge;
  - amber -> docentreview, geen remediation-trigger.
- Remediation is leerling-specifiek, automatisch gegenereerd, verplicht, maar herstelt de oorspronkelijke rode score niet.
- Challenge is verplicht, maximaal 1 poging, telt als docentfeedback, maar maakt basisparagraaf niet rood.
- Zichtbare Digidocent-chat is per vraag schoon, met paragraafsamenvatting op de achtergrond.

Technische aandachtspunten:
- Onderzoek en fix mogelijk id-lek in getContentBlocks waarbij doc.data().id de Firestore doc-id kan overschrijven.
- Breid voortgangrecords backwards-compatible uit met resultTier, assignmentKind, completionReason, attemptStatus, maxAttempts, lastAssessment en teacherSignal.
- Houd oude helpTier/scoreWeight compatibel.
- Update leerlingroute, voortgangsbalk, Digidocent-context, voortgangpayload en docentdashboard waar nodig.

Verificatie:
- functions npm test.
- node --test voor relevante src/lib tests.
- gerichte ESLint.
- npm run build.
- Voeg regressietests toe voor:
  1. Digidocent standaard zichtbaar bij vraag 2;
  2. geel kader blijft niet hangen;
  3. AI-falen open vraag -> amber en geen poging;
  4. 4 fout -> rood en auto-next;
  5. correct zonder chat -> groen;
  6. correct met chat -> groen + rood stippel;
  7. einde met rood -> remediation;
  8. einde alles groen -> challenge.

Lever op:
- samenvatting van wijzigingen;
- testresultaten;
- eventuele open risico's;
- geen deploy zonder expliciete toestemming.
```

## Open Punten Voor Beoordeling

Controleer vooral:

1. Is amber bij AI-falen precies wat je wilt?
2. Moet remediation ook verschijnen bij veel guided hulp, of alleen rood? Nu staat: alleen rood.
3. Moet challenge-score als bonus zichtbaar zijn, of alleen als docentfeedback? Nu staat: docentfeedback/plusinformatie.
4. Is “groen met rood stippellijntje” visueel acceptabel voor leerlingen?
5. Wil je later docent-review vooraf op AI-remediation/challenge, of blijft v1 automatisch?
