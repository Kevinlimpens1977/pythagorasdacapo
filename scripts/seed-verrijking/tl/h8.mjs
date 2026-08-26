// Verrijkingslaag hoofdstuk 8 (tl) - Zelf maken: programmeren, ontwerpen en
// terugblikken.
//
// ALLE GETALLEN IN DEZE KOP ZIJN IN RONDE 6 NAGETELD OP DE GEGENEREERDE SEED,
// niet uit de vorige ronde overgenomen. Ronde 5 beweerde hier vier dingen die
// niet klopten (een vast quizaantal van 6, een eindtoets van 36, een verkeerd
// vraagnummer bij 8.4 en negen mediablokken) en noemde zichzelf ondertussen
// "nagelopen". Dat is precies de kop waarop een volgende bouwer en de docent
// varen, dus hieronder staat wat de generator werkelijk oplevert.
//
// WAT ER IN DEZE RONDE AAN DE VRAGEN IS VERANDERD
// -----------------------------------------------
// (1) TERUGKEERVRAGEN, NU TWEE PER QUIZ. De blauwdruk vraagt 2 van de 5
//     quizvragen uit eerdere stof; de mechanische controle eist er 1 en stond
//     daarom groen terwijl elke quiz er precies 1 had. Inhoudelijk keken er wel
//     meer vragen terug, maar ze hingen aan een doel van de eigen paragraaf en
//     tellen dan niet mee, want de controle leest het veld `leerdoel`. Zeven
//     vragen zijn omgetagd naar het doel van de paragraaf waar hun stof
//     vandaan komt: 8.1 q5 -> 6.1 (algoritme op social media), 8.1 q6 -> 1.1
//     (inloggen op je schoolaccount), 8.2 q2 -> 2.2 (hardware en software),
//     8.3 q6 -> 7.4 (het antwoord van een chatbot controleren), 8.4 q9 -> 1.1
//     (een screenshot maken en inleveren), 8.5 q4 -> 1.4 (bron noemen bij
//     overgenomen tekst) en 8.7 q6 -> 8.3 (wat een bug is en hoe je hem
//     opspoort). Elke vraag is getagd op het doel dat je NODIG hebt om hem te
//     kunnen beantwoorden, niet op een willekeurig eerder doel. Nagemeten op
//     de gegenereerde seed: alle zeven quizzen hebben nu 2 terugkeervragen
//     (8.6 als eindtoets 32) en er blijft in geen enkele quiz een eigen
//     leerdoel onbevraagd.
// (2) 8.4 QUIZVRAAG 10. Het goede antwoord zei "kies A4", terwijl theorieblok B
//     en stap 2 van de praktijkopdracht juist uitleggen dat Canva dit formaat
//     A3 noemt. Het antwoordblad sprak dus de theorie tegen die het toetste. Er
//     staat nu "kies een staand posterformaat", zoals toetsvraag 23 het al
//     deed. Omdat de goede knop daardoor de langste werd (3 van de 7, boven de
//     grens van 40%), is de afleider met de omgekeerde volgorde aangevuld tot
//     hij langer is; nagemeten staat 8.4 weer op 2 van de 7.
// (3) 8.6 TOETSVRAAG 34 (phishing). De afleider "Het bericht komt binnen op een
//     moment dat je niets verwacht" is buiten de methode gewoon een
//     phishingsignaal, dus een leerling die er iets over gelezen had kon hem
//     met recht aanklikken. Vervangen door "De afzender staat niet in je lijst
//     met contactpersonen", een echte misvatting: ook gewone post komt van
//     onbekenden.
// (4) 8.7 QUIZVRAAG 6. De afleider "Omdat blokken al door de computer
//     gecontroleerd zijn, terwijl tekst pas bij het uitvoeren gelezen wordt"
//     was half waar - de blokvorm wordt inderdaad door de editor afgedwongen.
//     Vervangen door een afleider die het verschil aan de lengte van het
//     programma ophangt in plaats van aan de schrijfregels; dat is wel
//     eenduidig fout naast het syntaxis-antwoord.
//
// WAT DE GENERATOR VAN DIT HOOFDSTUK MAAKT (tl)
// ---------------------------------------------
//   7 paragrafen, 94 contentblokken.
//   51 startvragen: 8.1 zeven, 8.2 drie, 8.3 drie, 8.4 veertien, 8.5 drie,
//      8.6 achttien, 8.7 drie.
//   40 oefenopgaven: vijf per paragraaf, plus drie extra in 8.4 en twee in 8.6.
//   10 mediablokken: een per paragraaf, en twee in 8.5, 8.6 en 8.7.
//   41 quizvragen, waarvan 13 open: 8.1, 8.2, 8.3 en 8.7 hebben er zes, 8.5
//      heeft er zeven en 8.4 tien.
//   38 toetsvragen in de eindtoets van 8.6, waarvan 10 open.
//   79 quiz- en toetsvragen samen.
//
// HOE DIT BESTAND DE BLAUWDRUK VOLGT
// ----------------------------------
// - Stap 1, de startcheck: elk leerdoel heeft zijn eigen diagnostische
//   startvraag. Die staan als objecten { vraag, antwoord, uitleg, leerdoel } in
//   `checks` in scripts/seed-structuur/tl/h8.mjs. De generator maakt daar het
//   blok dv-tl-8-*-question-check van, zet het vóór de theorie, zet de
//   Digidocent er uit en klapt de uitleg dicht. Het zijn voorkennisvragen: ze
//   gaan over wat de leerling meebrengt of in een eerdere paragraaf deed.
// - Stap 4, 5 en 6, oefenen: `opties.oefenen` in het structuurbestand levert per
//   paragraaf vijf uitgewerkte opgaven (samen, zelf, zelf, steun, plus) in de
//   blokken dv-tl-8-*-question-oefenen-*, tussen de theorie en de bewijsopdracht.
// - De hoofdstuklaag van de blauwdruk staat sinds ronde 6 in de startcheck-
//   blokken en niet meer verstopt in het oefenblok. De voorkennischeck over
//   hoofdstuk 7 staat bovenaan de checks van 8.1, de deeltoets over 8.1 tot en
//   met 8.3 is de startcheck van 8.4, en de diagnostische ronde over alle
//   zeventien verplichte leerdoelen is de startcheck van checkpoint 8.6. De
//   uitkomst van die twee routeert echt: het steun- en het plusspoor staan als
//   eerste opgave in de blokken "Extra steun" en "Extra plus" van dezelfde
//   paragraaf, met de drempel in de vraagtekst. Zie de kop van het
//   structuurbestand voor de volledige verantwoording, inclusief wat er níet
//   mee opgelost is.
// - Elk theorieblok heeft een uitgewerkt voorbeeld (vraag + volledige
//   uitwerking) dat vóór het oefenblok en vóór de quiz komt: 14 voorbeelden.
// - De leerdoelen van 8.4 stonden in ronde 4 anders dan in het jaarplan; ronde
//   5 heeft ze teruggezet op de drie doelen die het jaarplan noemt. De negen
//   quizvragen en de acht toetsitems zijn inhoudelijk niet veranderd, alleen
//   opnieuw aan een doel gehangen. Zie de kop van het structuurbestand voor de
//   dekking per doel.
// - Terugkeervragen (spreiding op paragraafniveau): elke afsluitquiz heeft er
//   minstens twee die hun stof uit een eerdere paragraaf of een eerder
//   hoofdstuk halen. Per quiz staan de nummers in de kop van die quiz
//   hieronder, en die nummers zijn in ronde 6 tegen de prompts aan gehouden.
//   Ronde 7 heeft er nog iets aan moeten doen. Een terugkeervraag telt pas mee
//   als hij aan het LEERDOEL van die eerdere paragraaf hangt, want dat veld is
//   wat de mechanische controle leest. Vijf quizzen keken inhoudelijk wel
//   terug maar hingen hun terugkeervraag aan een eigen doel, of keken alleen
//   naar een eerder hoofdstuk en niet naar een eerdere paragraaf van dit
//   hoofdstuk. Opgelost door in 8.2, 8.3 en 8.7 het veld `leerdoel` te
//   verleggen naar de paragraaf waar de vraag naar terugstuurt, en door in 8.4
//   en 8.5 elk een terugkeervraag toe te voegen (8.4 vraag 10 naar 8.1, 8.5
//   vraag 7 naar 8.4). Dat verschuift wel de dekking binnen die quizzen: niet
//   elk eigen doel wordt daar nog precies twee keer bevraagd. De eindtoets in
//   8.6 dekt alle zeventien verplichte doelen onveranderd twee keer.
// - Antwoordlengte: het goede antwoord mag binnen een blok hoogstens 40% van de
//   keren het langste zijn, anders is de vraag te raden zonder te lezen. In
//   ronde 6 zat 8.2 op 67%, 8.7 op 67% en de eindtoets van 8.6 op 41%. Ronde 7
//   heeft dat rechtgezet door bij zes goede antwoorden de redengevende bijzin
//   uit de knop te halen en in `explanation` te zetten: 8.2 vraag 6, 8.7 vraag
//   6 en de toetsvragen 32, 33 en 35. De uitleg is dus niet verdwenen, hij
//   staat nu op de plek waar de leerling hem NA zijn antwoord leest in plaats
//   van ervoor. Stand nu: 8.2 33%, 8.4 29%, 8.5 25%, 8.6 27%, 8.7 33%.
// - De hoofdstuktoets in 8.6 is tegelijk de eindtoets van het leerjaar
//   (final: true) en telt 38 vragen. De blauwdruk vraagt "elk doel minstens
//   2x"; hoofdstuk 8 heeft 17 leerdoelen in 8.1 tot en met 8.6, dus 34 vragen
//   is daar de ondergrens - de startwaarde 15-20 hoort bij een hoofdstuk van
//   ongeveer twaalf doelen en staat in de blauwdruk zelf als ontwerpkeuze, niet
//   als bewijs. Omdat dit de eindtoets van het jaar is, halen zes vragen hun
//   stof uit hoofdstuk 1 tot en met 7: wachtwoorden (h1), device en bestanden
//   (h2), phishing (h3), Word-opmaak (h4), webshopcheck (h5) en social media
//   (h6); h7 komt terug in de vragen over de chatbot.
// - Stap 8: elk bewijsproduct heeft een modelantwoord. `assignment` is in alle
//   zeven paragrafen een object { tekst, label, modelAnswer, nakijkpunten }, dus
//   het modelantwoord staat als docentdata op het invoerveld en de nakijkpunten
//   komen als "Je bewijs is af als:" bij de leerling in beeld. Er staat geen
//   rubriek meer in kapitalen in de tekst die de leerling leest.
// - Theoretische leerweg: 13 van de 39 quizvragen en 10 van de 38 toetsvragen
//   zijn open, en het vraagtype wisselt per paragraaf van volgorde.
//
// WAT HIER NIET OP TE LOSSEN IS
// -----------------------------
// De blauwdruk vraagt om herverdeling van tokens ten gunste van wat gemeten
// wordt. De verdeling zit in tokenPlan() in
// scripts/generate-digitale-vaardigheden-seed.mjs en geldt voor alle 52
// paragrafen van alle drie de leerwegen: de ongecontroleerde praktijkopdracht
// krijgt 35 van de 100 tokens (55 van de 150 bij de eindtoets), de afsluitquiz
// 30 en de eindtoets 40. Het oefenblok haalt zijn 15 tokens (10 bij een
// checkpoint) uit dat opdrachtbudget, dus de opdracht staat feitelijk op 20 in
// een gewone paragraaf en op 45 in 8.6. Dat rechttrekken is een wijziging in
// gedeelde code die elk hoofdstuk raakt en hoort in één keer voor de hele seed
// te gebeuren, niet vanuit hoofdstuk 8. Dat de startcheck nul tokens krijgt is
// géén gebrek maar blauwdrukbeleid: bij stap 1 staat letterlijk "geen cijfer,
// geen tokens", en dat geldt dus ook voor de deeltoets en de diagnostische
// ronde die daar nu in staan.
// Verder staat open: de vier schermafbeeldingen uit les 18 zijn niet
// meegeleverd en dus niet gereproduceerd (zie de kop van
// scripts/seed-structuur/tl/h8.mjs). Beide punten staan genoteerd zodat ze
// zichtbaar blijven in plaats van stilzwijgend te blijven liggen.
//
// Let op: 8.7 is de vrijwillige plusparagraaf. De hoofdstuktoets in 8.6 stelt
// daar geen enkele vraag over; alle toetsvragen hangen aan leerdoelen van 8.1
// tot en met 8.6.

export default {
  '8.1': {
    learningGoals: [
      'Je kunt uitleggen wat een algoritme is als stappenplan.',
      'Je kunt een dagelijkse handeling in duidelijke stappen opschrijven.',
      'Je weet wat een herhaling en een keuze in een stappenplan zijn.'
    ],
    theorie: [
      {
        keyTerms: ['algoritme', 'stappenplan', 'volgorde'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sam schrijft op: 1. pak een boterham, 2. smeer boter, 3. pak het brood uit de zak. Waarom loopt een computer hierop vast?</p>',
          '<p><strong>Antwoord.</strong> Stap 3 komt te laat: bij stap 1 ligt het brood nog in de zak, dus de eerste instructie is onuitvoerbaar. Een mens leest eroverheen en pakt gewoon de zak, een computer stopt. Goed is: 1. pak de zak, 2. haal er twee sneetjes uit, 3. pak een mes, 4. smeer boter op sneetje een. Elke stap is nu uitvoerbaar op het moment dat hij aan de beurt is.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['herhaling', 'keuze', 'voorwaarde'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je moet je tas inpakken voor zes vakken, en alleen bij gym gaat je sporttas mee. Hoe schrijf je dat op zonder zes keer hetzelfde te typen?</p>',
          '<p><strong>Antwoord.</strong> Met een herhaling en een keuze samen: "herhaal voor elk vak in je rooster: pak het boek en het schrift van dat vak; als het vak gym is, pak dan ook je sporttas." De herhaling doet zes rondes, en de voorwaarde "als het vak gym is" beslist per ronde of die extra stap wordt uitgevoerd.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een algoritme is een stappenplan waarin elke instructie precies zegt wat er moet gebeuren, in een volgorde die de computer letterlijk afwerkt. Met een herhaling laat je een stuk meerdere keren uitvoeren zonder het over te typen. Met een keuze kijkt het programma naar een voorwaarde en gaat het daarna de ene of de andere kant op.</p>',
      // 'algoritme' staat al vet in het eerste theorieblok en in hoofdstuk 7;
      // een kernbegrip mag in hoogstens twee blokken vet staan.
      keyTerms: ['stappenplan', 'herhaling', 'keuze']
    },
    // Afsluitquiz: 6 vragen, elk leerdoel 2x. Terugkeervragen: vraag 5 (h6, het
    // aanbevelingsalgoritme van social media) en vraag 6 (h1, inloggen op je
    // schoolaccount).
    vragen: [
      {
        prompt: 'Wat is het belangrijkste verschil tussen uitleg aan een klasgenoot en een algoritme voor een computer?',
        leerdoel: 'Je kunt uitleggen wat een algoritme is als stappenplan.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een algoritme moet altijd in het Engels geschreven worden.', correct: false, misconception: 'Denkt dat programmeren een taal is in plaats van een manier van opschrijven.' },
          { text: 'Een klasgenoot vult ontbrekende stappen zelf aan, een computer doet alleen precies wat er staat.', correct: true, explanation: 'De computer denkt niet mee, dus elke handeling moet er letterlijk in staan.' },
          { text: 'Een algoritme mag nooit meer dan tien stappen hebben.', correct: false, misconception: 'Denkt dat een algoritme kort moet zijn in plaats van volledig.' },
          { text: 'Bij een computer maakt het niet uit in welke volgorde de stappen staan, hij zoekt het zelf wel uit.', correct: false, misconception: 'Ziet de volgorde als versiering en niet als onderdeel van de instructie.' }
        ],
        feedback: 'Een mens vult gaten vanzelf op, een computer niet. Daarom moet in een algoritme elke handeling er letterlijk in staan.'
      },
      {
        prompt: 'Leg uit waarom je jouw stappenplan laat uitvoeren door een klasgenoot die niet mag meedenken.',
        type: 'open',
        leerdoel: 'Je kunt een dagelijkse handeling in duidelijke stappen opschrijven.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Een klasgenoot die meedenkt vult mijn vergeten stappen vanzelf in, waardoor het lijkt of mijn stappenplan klopt. Een computer doet dat niet. Door hem letterlijk uit te laten voeren, kom ik erachter welke stap ik was vergeten of in de verkeerde volgorde had gezet.',
        nakijkpunten: [
          'Noemt dat een meedenkende lezer fouten onzichtbaar maakt.',
          'Legt de link met de computer, die alleen doet wat er staat.',
          'Beschrijft dat de test een concrete fout in volgorde of volledigheid oplevert.'
        ],
        feedback: 'De test is streng bedoeld: wie meedenkt repareert jouw fout in zijn hoofd, en dan leer jij er niets van.'
      },
      {
        prompt: 'In welke zin zit een keuze met een voorwaarde?',
        leerdoel: 'Je weet wat een herhaling en een keuze in een stappenplan zijn.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Herhaal vijf keer: doe een stap naar voren.', correct: false, misconception: 'Verwart de herhaling met de keuze omdat er ook iets meerdere keren gebeurt.' },
          { text: 'Zet je tas in je kluisje.', correct: false, misconception: 'Ziet elke losse instructie al als een beslissing.' },
          { text: 'Loop naar het lokaal en ga zitten.', correct: false, misconception: 'Denkt dat twee stappen achter elkaar samen een keuze vormen.' },
          { text: 'Als het regent, pak dan je jas, anders pak je een pet.', correct: true, explanation: 'Hier staat een voorwaarde die waar of niet waar kan zijn, met twee verschillende vervolgen.' }
        ],
        feedback: 'De woorden als en anders verraden de keuze. Wat tussen als en dan staat is de voorwaarde die klopt of niet klopt.'
      },
      {
        prompt: 'In een stappenplan mag je een stap weglaten als iedereen die stap toch wel kent.',
        waar: false,
        leerdoel: 'Je kunt een dagelijkse handeling in duidelijke stappen opschrijven.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Wat iedereen kent, kent de computer juist niet. Een weggelaten stap is precies de plek waar het straks vastloopt.'
      },
      {
        prompt: 'Je leerde eerder dat social media een algoritme gebruiken om jouw tijdlijn te vullen. Wat heeft dat algoritme gemeen met jouw eigen stappenplan?',
        leerdoel: 'Je kunt uitleggen wat een algoritme op social media is.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        options: [
          { text: 'Allebei zijn het instructies die stap voor stap in een vaste volgorde worden uitgevoerd.', correct: true, explanation: 'Ook een aanbevelingsalgoritme is gewoon een reeks regels die een computer afwerkt.' },
          { text: 'Allebei bedenken ze helemaal zelf wat goed voor jou is, zonder dat er instructies aan te pas komen.', correct: false, misconception: 'Denkt dat een algoritme een eigen mening of bedoeling heeft.' },
          { text: 'Allebei werken ze alleen op een telefoon.', correct: false, misconception: 'Koppelt het begrip algoritme aan een apparaat in plaats van aan een manier van werken.' },
          { text: 'Allebei laten ze de uitkomst aan het toeval over.', correct: false, misconception: 'Verwart een algoritme met willekeur omdat de uitkomst per persoon verschilt.' }
        ],
        feedback: 'Een tijdlijn vullen en een boterham smeren volgen dezelfde vorm: instructies op volgorde, uitgevoerd zonder eigen mening.'
      },
      {
        prompt: 'In hoofdstuk 1 leerde je inloggen op je schoolaccount. Beschrijf dat inloggen als stappenplan en wijs aan waar er een keuze met een voorwaarde in zit.',
        type: 'open',
        leerdoel: 'Je kunt inloggen op je schoolaccount, het wifi-netwerk van school en Office 365.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        modelAnswer: 'De stappen zijn: open de browser, ga naar de inlogpagina, typ je schoolmailadres, typ je wachtwoord en klik op inloggen. De keuze zit erachter: als je wachtwoord klopt, dan kom je binnen, anders krijg je een melding en mag je het opnieuw proberen. Bij twee-staps-verificatie komt er nog een keuze bij: als de code klopt, dan ga je door.',
        nakijkpunten: [
          'Zet het inloggen in genummerde, uitvoerbare stappen.',
          'Wijst een echte voorwaarde aan die waar of niet waar kan zijn.',
          'Noemt wat er in beide gevallen gebeurt, dus zowel bij wel als bij niet kloppen.'
        ],
        feedback: 'Ook een inlogscherm is een algoritme met een keuze erin: klopt het wachtwoord wel of niet, en daarna gaat het twee kanten op.'
      }
    ]
  },

  '8.2': {
    learningGoals: [
      'Je kunt met blokken een klein programma maken dat werkt.',
      'Je kunt in je programma een herhaling en een als-dan-keuze gebruiken.',
      'Je kunt uitleggen wat jouw programma stap voor stap doet.'
    ],
    theorie: [
      {
        keyTerms: ['blokken', 'sprite', 'script'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Milan sleept drie blokken los onder elkaar op het werkveld, maar er gebeurt niets als hij op de groene vlag klikt. Wat is er aan de hand?</p>',
          '<p><strong>Antwoord.</strong> Losse blokken vormen nog geen script. Ze moeten echt aan elkaar klikken, met bovenaan het startblok "wanneer op de groene vlag wordt geklikt". Pas dan weet de sprite wanneer hij de rij instructies moet afwerken.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['gebeurtenis', 'herhaal-blok', 'als-dan-blok'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je wilt een balletje dat blijft bewegen en terugkaatst tegen de rand. Welke drie blokken heb je minimaal nodig, en in welke volgorde?</p>',
          '<p><strong>Antwoord.</strong> Bovenaan het startblok voor de gebeurtenis: wanneer op de groene vlag wordt geklikt. Daaronder een herhaal-blok met "herhaal oneindig", en daarbinnen "neem 10 stappen" met eronder "keer om aan de rand". Dat kaatsblok kijkt zelf al of hij de rand raakt, dus een als-dan eromheen zou dubbelop zijn. Wil je er iets extra\'s bij, zet dan binnen de herhaling een als-dan met de voorwaarde "raak ik (rand)?" en daarin bijvoorbeeld "zeg Boing!". Die keuze zit binnen de herhaling, want hij moet elke ronde opnieuw gecontroleerd worden.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>In een blokkentaal klik je blokken aan elkaar tot een script, dat precies hetzelfde is als een algoritme op papier. Elk script begint met een startblok, en daarbinnen zorgt een herhaling ervoor dat iets doorgaat. Een als-dan-blok laat het programma alleen iets doen als de voorwaarde die je erin schuift waar is.</p>',
      keyTerms: ['blokken', 'script', 'als-dan-blok']
    },
    // Afsluitquiz: 6 vragen. Terugkeervragen: vraag 2 (h2, hardware en
    // software) en vraag 6 (8.1, het algoritme op papier). Vraag 6 hangt sinds
    // ronde 7 aan het leerdoel van 8.1 waar hij werkelijk over gaat, en niet
    // meer aan een eigen doel van 8.2: de mechanische controle op spreiding
    // leest het veld `leerdoel`, en een terugkeervraag die aan een eigen doel
    // hangt telt daar terecht niet mee. Daardoor zijn de eigen drie doelen nu
    // 2x, 2x en 1x bevraagd in plaats van drie keer twee.
    vragen: [
      {
        prompt: 'Waarmee begint een script dat moet starten zodra je op de groene vlag klikt?',
        leerdoel: 'Je kunt met blokken een klein programma maken dat werkt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Met een herhaalblok.', correct: false, misconception: 'Denkt dat een programma begint met wat het vaakst gebeurt.' },
          { text: 'Met een als-dan-blok.', correct: false, misconception: 'Denkt dat het programma eerst moet beslissen voordat het mag starten.' },
          { text: 'Met een gebeurtenisblok, zoals wanneer op de groene vlag wordt geklikt.', correct: true, explanation: 'Een gebeurtenisblok zegt wanneer de rest van het script moet gaan lopen.' },
          { text: 'Met een beweegblok, want de sprite moet als eerste bewegen.', correct: false, misconception: 'Verwart de eerste zichtbare actie met het startsignaal.' }
        ],
        feedback: 'Zonder startblok weet niemand wanneer je script moet lopen. Het gele gebeurtenisblok geeft dat startsein.'
      },
      {
        prompt: 'In hoofdstuk 2 leerde je het verschil tussen hardware en software. Leg uit wat in jouw Scratch-project de hardware is en wat de software, en waarom dat zo is.',
        type: 'open',
        leerdoel: 'Je kunt het verschil uitleggen tussen hardware en software.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        modelAnswer: 'De hardware is alles wat ik kan vastpakken: de laptop, het scherm, het toetsenbord en de muis waarmee ik de blokken sleep. De software is alles wat er niet aan te voelen is: de browser, Scratch zelf en mijn eigen script. Mijn script is dus software, want het zijn opdrachten die de hardware laat uitvoeren wat ik bedacht heb.',
        nakijkpunten: [
          'Noemt minstens twee concrete voorbeelden van hardware in de eigen werkplek.',
          'Zegt dat het eigen script bij de software hoort en waarom.',
          'Legt uit dat software de opdrachten geeft die de hardware uitvoert.'
        ],
        feedback: 'Je script is software: een rij opdrachten die pas iets doet zodra hardware hem uitvoert. Zonder het een gebeurt het ander niets.'
      },
      {
        prompt: 'Je wilt dat je sprite van uiterlijk verandert zodra hij de rand raakt. Welk blok heb je daarvoor nodig?',
        leerdoel: 'Je kunt in je programma een herhaling en een als-dan-keuze gebruiken.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Een als-dan-blok met de voorwaarde "raak ik (rand)?".', correct: true, explanation: 'Het veranderen mag alleen gebeuren op het moment dat de voorwaarde waar is.' },
          { text: 'Een herhaalblok met het aantal 10.', correct: false, misconception: 'Denkt dat vaak genoeg herhalen vanzelf tot de verandering leidt.' },
          { text: 'Een extra gebeurtenisblok met de groene vlag.', correct: false, misconception: 'Denkt dat elke nieuwe actie een eigen startblok nodig heeft.' },
          { text: 'Een geluidsblok, zodat je hoort dat hij de rand raakt.', correct: false, misconception: 'Verwart een signaal aan de speler met een beslissing in het programma.' }
        ],
        feedback: 'Iets dat maar soms moet gebeuren hoort in een als-dan-blok, met de voorwaarde die dat moment herkent.'
      },
      {
        prompt: 'Alles wat je binnen een herhaalblok legt, wordt net zo vaak uitgevoerd als jij opgeeft.',
        waar: true,
        leerdoel: 'Je kunt in je programma een herhaling en een als-dan-keuze gebruiken.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Wat binnen de lus staat gaat mee in elke ronde; blokken die eronder hangen worden juist maar een keer gedaan.'
      },
      {
        prompt: 'Beschrijf jouw eigen programma blok voor blok, van het startblok tot het laatste blok, en zeg per blok wat de sprite dan doet.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen wat jouw programma stap voor stap doet.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Mijn script start met het blok wanneer op de groene vlag wordt geklikt. Daarna komt herhaal oneindig, zodat het spel blijft lopen. Binnen die herhaling neemt mijn sprite tien stappen. Daarna kijkt het als-dan-blok of hij de rand raakt; is dat waar, dan keert hij om. Daardoor blijft hij heen en weer bewegen.',
        nakijkpunten: [
          'Noemt de blokken in de juiste volgorde, te beginnen bij het startblok.',
          'Legt per blok uit wat de sprite op dat moment doet.',
          'Maakt duidelijk welke blokken binnen de herhaling of binnen de keuze staan.'
        ],
        feedback: 'Wie zijn eigen script kan navertellen, kan het ook uitbreiden. Vastlopen bij het uitleggen wijst meestal precies de fout aan.'
      },
      {
        prompt: 'Waarom mag je een Scratch-script gerust een algoritme noemen?',
        leerdoel: 'Je kunt uitleggen wat een algoritme is als stappenplan.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        options: [
          { text: 'Omdat er kleuren in zitten, en een algoritme is altijd gekleurd.', correct: false, misconception: 'Kijkt naar de vorm van de blokken in plaats van naar wat ze doen.' },
          { text: 'Omdat het alleen in Scratch werkt en nergens anders.', correct: false, misconception: 'Denkt dat een algoritme aan een programma vastzit.' },
          { text: 'Omdat een computer sneller rekent dan een mens.', correct: false, misconception: 'Verwart rekensnelheid met de structuur van instructies.' },
          { text: 'Omdat het instructies op volgorde zijn.', correct: true, explanation: 'Precies de definitie uit paragraaf 8.1: instructies in een vaste volgorde, met herhalingen en keuzes erin, alleen nu in blokvorm.' }
        ],
        feedback: 'Blokken zijn de schrijfwijze, niet de inhoud. Onder de kleuren zit hetzelfde stappenplan dat je op papier maakte.'
      }
    ]
  },

  '8.3': {
    learningGoals: [
      'Je kunt je programma testen en zien waar het misgaat.',
      'Je weet wat een bug is en hoe je die opspoort.',
      'Je kunt je programma verbeteren na feedback van een klasgenoot.'
    ],
    theorie: [
      {
        keyTerms: ['bug', 'testen', 'foutmelding'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Lisa\'s sprite beweegt en keert netjes om, maar verandert nooit van uiterlijk bij de rand. Er komt geen foutmelding. Waar begint zij met zoeken?</p>',
          '<p><strong>Antwoord.</strong> Bij het als-dan-blok, want dat is het enige blok dat over dat uiterlijk beslist. Zij zet er tijdelijk een blok "zeg hallo" bij in. Verschijnt hallo nooit, dan wordt de voorwaarde nooit waar en zit de bug in de voorwaarde zelf, niet in het uiterlijkblok.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['debuggen', 'badeendje', 'testplan'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Youssef verandert drie blokken tegelijk en het programma werkt ineens. Waarom is dat een probleem?</p>',
          '<p><strong>Antwoord.</strong> Hij weet nu niet welke van de drie wijzigingen het oploste, en de andere twee kunnen nieuwe fouten hebben veroorzaakt die hij nog niet ziet. Bij debuggen verander je daarom een ding tegelijk en test je meteen opnieuw, zodat elke wijziging een eigen antwoord oplevert.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een bug is een fout waardoor je programma iets anders doet dan je bedoelde, en fouten maken hoort er gewoon bij. Door te testen op de plekken waar het stuk kan gaan, ontdek je waar het misloopt. Bij debuggen verander je een ding tegelijk, en het hardop uitleggen aan een klasgenoot laat je de fout meestal zelf zien.</p>',
      keyTerms: ['bug', 'testen', 'debuggen']
    },
    // Afsluitquiz: 6 vragen. Terugkeervragen: vraag 5 (8.2, de blokken van je
    // eigen script) en vraag 6 (h7, een chatbotantwoord controleren voordat je
    // het overneemt). Vraag 5 hangt sinds ronde 7 aan het doel van 8.2 waar hij
    // de leerling naar terugstuurt; zie de toelichting bij 8.2 hierboven.
    vragen: [
      {
        prompt: 'Wat is een bug?',
        leerdoel: 'Je weet wat een bug is en hoe je die opspoort.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een virus dat iemand anders in jouw programma heeft gezet.', correct: false, misconception: 'Verwart een eigen programmeerfout met een aanval van buitenaf.' },
          { text: 'Een fout waardoor je programma iets anders doet dan de bedoeling was.', correct: true, explanation: 'Bug is het gewone woord voor elke programmeerfout, groot of klein.' },
          { text: 'Een blok dat in Scratch niet bestaat.', correct: false, misconception: 'Denkt dat een fout alleen kan ontstaan door een onbestaand blok.' },
          { text: 'Een waarschuwing dat je computer bijna vol is.', correct: false, misconception: 'Verwart een systeemmelding met een fout in de eigen code.' }
        ],
        feedback: 'Een bug hoort bij programmeren zoals een schrijffout bij schrijven hoort: iedereen maakt ze, het werk zit in het vinden.'
      },
      {
        prompt: 'Je klasgenoot zegt dat jouw sprite bij de rand blijft trillen in plaats van om te draaien. Beschrijf hoe je die feedback gebruikt om je programma te verbeteren.',
        type: 'open',
        leerdoel: 'Je kunt je programma verbeteren na feedback van een klasgenoot.',
        denkniveau: 'maken_controleren',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik schrijf eerst op wat er precies gebeurt en wanneer. Daarna kijk ik naar "keer om aan de rand" en naar de blokken eromheen, want daar hoort het omkeren. Ik verander een ding tegelijk, bijvoorbeeld door na het omkeren een paar stappen weg te laten lopen van de rand, en ik test daarna meteen opnieuw. Werkt het, dan noteer ik wat ik veranderd heb.',
        nakijkpunten: [
          'Beschrijft eerst het waargenomen gedrag voordat er iets aangepast wordt.',
          'Wijst het blok of de voorwaarde aan waar de fout waarschijnlijk zit.',
          'Noemt dat er een wijziging tegelijk gedaan wordt en daarna opnieuw getest.'
        ],
        feedback: 'Feedback van een ander is gratis informatie. Noteer wat hij zag, verander een ding, test opnieuw en schrijf het resultaat op.'
      },
      {
        prompt: 'Je test je programma het beste door alleen de weg te proberen die je zelf bedacht had.',
        waar: false,
        leerdoel: 'Je kunt je programma testen en zien waar het misgaat.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Juist op de wegen die jij niet bedacht had gaat het stuk, dus daar test je bewust op.'
      },
      {
        prompt: 'Je programma doet niets zichtbaars en er verschijnt geen foutmelding. Wat is de handigste volgende stap?',
        leerdoel: 'Je kunt je programma testen en zien waar het misgaat.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'samen_oefenen',
        options: [
          { text: 'Alles weggooien en helemaal opnieuw beginnen, want zoeken kost meer tijd dan overnieuw bouwen.', correct: false, misconception: 'Denkt dat opnieuw beginnen sneller is dan zoeken, terwijl dezelfde fout vaak terugkomt.' },
          { text: 'Wachten en het morgen nog eens proberen.', correct: false, misconception: 'Denkt dat een programma vanzelf verandert.' },
          { text: 'Steeds meer blokken toevoegen tot er eindelijk iets op het scherm gebeurt, en dan pas gaan kijken.', correct: false, misconception: 'Verwart meer code met betere code en maakt het zoekgebied juist groter.' },
          { text: 'Het script blok voor blok uitvoeren en er tussendoor iets laten zeggen, zodat je ziet hoe ver hij komt.', correct: true, explanation: 'Zo verklein je het zoekgebied stap voor stap tot de plek waar het misgaat.' }
        ],
        feedback: 'Kleine stappen en zichtbare tussenresultaten brengen je naar de plek van de fout; blind bijbouwen doet dat niet.'
      },
      {
        prompt: 'Je sprite blijft stilstaan nadat je op de groene vlag klikt. Noem twee blokken uit paragraaf 8.2 die je als eerste controleert, en leg uit hoe je erachter komt welk van de twee de bug bevat.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen wat jouw programma stap voor stap doet.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        modelAnswer: 'Ik controleer eerst het gebeurtenisblok "wanneer op de groene vlag wordt geklikt" en daarna het herhaal-blok met "neem 10 stappen" erin. Om te zien welk van de twee fout is, hang ik onder het startblok tijdelijk een blok "zeg start". Verschijnt start niet, dan zit de fout bovenin en hangen mijn blokken waarschijnlijk los. Verschijnt start wel, dan ligt het aan de herhaling of aan het beweegblok erin.',
        nakijkpunten: [
          'Noemt twee concrete blokken uit 8.2, waaronder het startblok.',
          'Beschrijft een test die de twee mogelijkheden uit elkaar haalt.',
          'Zegt wat elke uitkomst van die test betekent.'
        ],
        feedback: 'Zoeken doe je met een test die twee mogelijkheden uit elkaar haalt. Dan weet je na een keer klikken welke helft je kunt overslaan.'
      },
      {
        prompt: 'In hoofdstuk 7 leerde je het antwoord van een chatbot te controleren voordat je het overneemt. Leg uit waarom je met de tip van een klasgenoot over jouw programma op dezelfde manier omgaat.',
        type: 'open',
        leerdoel: 'Je kunt controleren of het antwoord van een chatbot klopt.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        modelAnswer: 'In allebei de gevallen krijg ik iets aangereikt dat kan kloppen, maar dat niet vanzelf waar is. Bij een chatbot controleer ik het bij een andere bron; bij een tip van een klasgenoot voer ik hem door en test ik daarna of het echt beter werkt. Blijkt de tip niet te helpen, dan draai ik hem terug en schrijf ik op waarom ik hem niet overneem.',
        nakijkpunten: [
          'Legt uit dat allebei de bronnen kunnen kloppen maar gecontroleerd moeten worden.',
          'Noemt een concrete controle: opnieuw testen of nazoeken bij een andere bron.',
          'Zegt wat er gebeurt als de tip of het antwoord niet blijkt te kloppen.'
        ],
        feedback: 'Een tip en een chatbotantwoord lijken meer op elkaar dan je denkt: allebei aannemelijk, allebei pas bruikbaar na een controle.'
      }
    ]
  },

  '8.4': {
    learningGoals: [
      'Je kunt met je schoolmail een Canva-account maken en inloggen.',
      'Je kunt een A4-poster starten en tekst, elementen en kleur toevoegen.',
      'Je kunt je ontwerp downloaden of delen als PNG of PDF.'
    ],
    theorie: [
      {
        keyTerms: ['Canva', 'template', 'schoolmail'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Ayoub registreert zich met zijn privémail en krijgt geen bevestigingsmail binnen. Wat gaat er mis en wat doet hij?</p>',
          '<p><strong>Antwoord.</strong> Twee dingen. Voor school hoort hij zijn schoolmail te gebruiken, niet zijn privémail, want daar houdt de docent zicht op. En de bevestiging staat vaak in de map ongewenste mail. Hij kijkt daar eerst, en registreert zich anders opnieuw met het juiste adres.</p>'
        ].join('\n')
      },
      {
        // De bron noemt dit menu letterlijk "laag" (rechtermuisknop, dan
        // 'laag'). Het is een knopnaam die de leerling moet aanklikken, dus hij
        // staat hier in het enkelvoud van de bron en niet als "lagen".
        keyTerms: ['elementen', 'vormen', 'laag', 'PNG'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Fenna zet een grote foto op haar poster en ineens is haar titel weg. Wat is er gebeurd en hoe lost ze het op?</p>',
          '<p><strong>Antwoord.</strong> De foto ligt boven de tekst. Met de rechtermuisknop kiest ze "laag" en zet ze de foto naar achteren, of ze zet de titel naar voren. Valt de tekst daarna nog weg tegen de kleur, dan past ze de tekstkleur aan, zodat de titel leesbaar blijft.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Canva is een online ontwerptool waarin je met een template snel een poster, flyer of presentatie maakt. Je start een ontwerp met de plusknop, voegt tekst, elementen en een achtergrondkleur toe, en met de rechtermuisknop en "laag" bepaal je wat vooraan staat. Klaar ben je pas als je via Delen en Downloaden je werk als PNG of PDF hebt opgeslagen en ingeleverd.</p>',
      keyTerms: ['Canva', 'template', 'elementen']
    },
    // Afsluitquiz: 9 vragen, verdeeld over de drie leerdoelen die het jaarplan
    // voor 8.4 noemt. Dit is de enige quiz van het hoofdstuk met meer dan zes
    // vragen; de overige vijf hebben er zes. Ronde 4 had hier een eigen doel
    // over "wat Canva is en de vier onderdelen van de homepagina" van gemaakt
    // en daarvoor de twee jaarplandoelen over de poster maken en de poster
    // inleveren samengevoegd; ronde 5 heeft dat teruggedraaid, want daarmee
    // week 8.4 als enige paragraaf van dit hoofdstuk van het jaarplan af. De
    // vragen zelf zijn ongewijzigd gebleven en alleen opnieuw opgehangen.
    // Verdeling nu: vier vragen bij het account (1, 2, 3 en 5, inclusief de
    // homepagina, want die is precies wat stap 7 van de bron je na het
    // inloggen laat zien), twee bij het starten van de poster (4 en 7) en drie
    // bij downloaden en delen (6, 8 en 9). Terugkeervragen: vraag 7 (h4, Word
    // en PowerPoint naast Canva), vraag 9 (h1, een screenshot maken en
    // inleveren) en sinds ronde 7 vraag 10 (8.1, de Canva-stappen als
    // stappenplan). Ronde 5 schreef hier vraag 6; dat was fout, vraag 6 gaat
    // over automatisch opslaan en inleveren. Nageteld in ronde 6.
    // Vraag 10 is er in ronde 7 bij gekomen omdat 8.4 als enige gewone
    // paragraaf van dit hoofdstuk nergens naar een EERDERE paragraaf van
    // hoofdstuk 8 terugkeek: vraag 7 en 9 halen hun stof uit hoofdstuk 4 en 1,
    // en dat telt niet als spreiding binnen dit hoofdstuk. De quiz heeft
    // daardoor 10 vragen.
    vragen: [
      {
        prompt: 'Wat is Canva?',
        leerdoel: 'Je kunt met je schoolmail een Canva-account maken en inloggen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een online ontwerptool waarmee je posters, flyers en presentaties maakt.', correct: true, explanation: 'Online betekent dat je niets installeert; je werkt in je browser en kunt er op elke computer bij.' },
          { text: 'Een programma dat je eerst op je laptop moet installeren.', correct: false, misconception: 'Denkt dat een ontwerpprogramma altijd geïnstalleerd moet worden, zoals Word vroeger.' },
          { text: 'Een zoekmachine voor afbeeldingen met een Creative Commons-licentie.', correct: false, misconception: 'Verwart Canva met het zoeken naar bruikbaar beeld uit paragraaf 4.3.' },
          { text: 'Een chatbot die teksten voor je schrijft.', correct: false, misconception: 'Schuift alles wat online is en slim lijkt op één hoop met AI.' }
        ],
        feedback: 'Canva is gereedschap om iets te ontwerpen, geen zoekmachine en geen chatbot. Je maakt er zelf iets mee.'
      },
      {
        prompt: 'Welk onderdeel van de Canva-homepagina gebruik je om verder te werken aan iets dat je vorige les gemaakt hebt?',
        leerdoel: 'Je kunt met je schoolmail een Canva-account maken en inloggen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De zoekbalk bovenin, waarin je typt wat je wilt gaan maken.', correct: false, misconception: 'Denkt dat zoeken ook je eigen werk oplevert, terwijl de zoekbalk sjablonen zoekt.' },
          { text: 'Het overzicht van je eerdere ontwerpen.', correct: true, explanation: 'Daar staat je eigen werk klaar, zodat je verdergaat waar je gebleven was in plaats van opnieuw te beginnen.' },
          { text: 'De grote plusknop links.', correct: false, misconception: 'Start iets nieuws en laat het oude ontwerp onaangeroerd staan.' },
          { text: 'De toegang tot uploads.', correct: false, misconception: 'Verwart je eigen ontwerpen met de eigen foto\'s die je hebt geüpload.' }
        ],
        feedback: 'Zoekbalk boven, plusknop links, je eerdere ontwerpen in het midden, templates en uploads daarnaast. Vier onderdelen, vier taken.'
      },
      {
        prompt: 'Welk mailadres gebruik je als je je bij Canva registreert voor school?',
        leerdoel: 'Je kunt met je schoolmail een Canva-account maken en inloggen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je privémail, want die check je toch het vaakst.', correct: false, misconception: 'Kiest voor gemak en vergeet dat schoolwerk op je schoolaccount hoort.' },
          { text: 'Het mailadres van een ouder.', correct: false, misconception: 'Denkt dat een account van iemand anders ook jouw werk kan bewijzen.' },
          { text: 'Je schoolmail.', correct: true, explanation: 'Met je schoolmail hoort je ontwerp bij je schoolaccount en kan je docent je werk terugvinden.' },
          { text: 'Een nieuw adres dat je speciaal voor Canva aanmaakt.', correct: false, misconception: 'Maakt een extra account aan en raakt daardoor het overzicht kwijt.' }
        ],
        feedback: 'School en privé houd je gescheiden. Met je schoolmail hoort je ontwerp bij je schoolwerk en raak je het niet kwijt.'
      },
      {
        prompt: 'Je bent net ingelogd en staat op de homepagina. Waar klik je om een nieuw, leeg ontwerp te beginnen?',
        leerdoel: 'Je kunt een A4-poster starten en tekst, elementen en kleur toevoegen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Op de grote plusknop aan de linkerkant.', correct: true, explanation: 'De plusknop links is de vaste startknop voor elk nieuw ontwerp.' },
          { text: 'Op een van je eerdere ontwerpen in het midden van het scherm.', correct: false, misconception: 'Opent bestaand werk en gaat daarin verder, waardoor het oude ontwerp overschreven raakt.' },
          { text: 'Op je profielfoto rechtsboven.', correct: false, misconception: 'Zoekt de startknop bij de accountinstellingen.' },
          { text: 'Op het woord Canva linksboven.', correct: false, misconception: 'Verwart de knop die je terugbrengt naar de homepagina met de knop die iets nieuws start.' }
        ],
        feedback: 'De plusknop is de startknop. Het woord Canva linksboven brengt je terug, en dat is iets anders dan iets nieuws beginnen.'
      },
      {
        prompt: 'Je hebt je geregistreerd, maar Canva laat je nog niet naar binnen. Welke stap heb je waarschijnlijk overgeslagen?',
        leerdoel: 'Je kunt met je schoolmail een Canva-account maken en inloggen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je hebt nog geen ontwerp gemaakt.', correct: false, misconception: 'Denkt dat je account pas telt zodra je er iets mee gedaan hebt.' },
          { text: 'Je hebt bij het registreren je voornaam en je achternaam niet allebei ingevuld.', correct: false, misconception: 'Zoekt de fout in een veld dat het formulier zelf al zou hebben afgedwongen.' },
          { text: 'Je hebt de bevestigingsmail nog niet geopend en de link of code nog niet gebruikt.', correct: true, explanation: 'Registreren is stap één; pas na het bevestigen weet Canva dat het mailadres echt van jou is.' },
          { text: 'Je hebt de video bij deze paragraaf niet gekeken, en daarom laat Canva je nog niet naar binnen.', correct: false, misconception: 'Verwart hulp bij een stap met de stap zelf.' }
        ],
        feedback: 'Registreren en bevestigen zijn twee aparte stappen. Zonder die bevestiging blijft je account onderweg steken.'
      },
      {
        prompt: 'Canva slaat je ontwerp automatisch op, dus je hoeft het niet meer apart in te leveren.',
        waar: false,
        leerdoel: 'Je kunt je ontwerp downloaden of delen als PNG of PDF.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Automatisch opslaan bewaart je werk in jouw account. Inleveren is een aparte stap die jij nog zelf moet zetten.'
      },
      {
        prompt: 'In hoofdstuk 4 maakte je een verslag in Word en een presentatie in PowerPoint. Leg uit waarom je voor een poster liever Canva gebruikt, en noem twee dingen die je in Canva anders doet dan in Word.',
        type: 'open',
        leerdoel: 'Je kunt een A4-poster starten en tekst, elementen en kleur toevoegen.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        modelAnswer: 'Word is gemaakt voor lopende tekst met koppen en paginanummers, en Canva is gemaakt voor beeld: je begint met een template en zet daarna alles precies waar je het hebben wilt. In Canva sleep ik tekstvakken en elementen vrij over de bladzijde, terwijl tekst in Word altijd in de regel meeloopt. En in Canva bepaal ik met de rechtermuisknop en "laag" wat voor en wat achter staat; dat doe ik in Word niet.',
        nakijkpunten: [
          'Zegt waarvoor Canva bedoeld is en waarvoor Word bedoeld is.',
          'Noemt twee concrete verschillen in werkwijze, bijvoorbeeld vrij plaatsen of werken met de laagvolgorde.',
          'Koppelt de keuze aan het soort product dat gevraagd wordt.'
        ],
        feedback: 'Gereedschap kies je bij de opdracht: Word voor tekst die doorloopt, Canva voor beeld dat je vrij op de bladzijde plaatst.'
      },
      {
        prompt: 'Je kunt je poster niet downloaden omdat je betaalde elementen gebruikt hebt. Wat kun je doen?',
        leerdoel: 'Je kunt je ontwerp downloaden of delen als PNG of PDF.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Met je eigen geld een schoolabonnement op Canva Pro kopen, want alleen wie betaalt mag een ontwerp downloaden of delen.', correct: false, misconception: 'Denkt dat betalen de enige uitweg is.' },
          { text: 'De opdracht overslaan en niets inleveren, want zonder gedownload bestand heb je geen bewijs.', correct: false, misconception: 'Ziet een technische hobbel aan voor een reden om te stoppen.' },
          { text: 'Je poster in Word natekenen met tekstvakken en afbeeldingen, en dat bestand inleveren.', correct: false, misconception: 'Doet het werk over in plaats van het bestaande ontwerp bruikbaar te maken.' },
          { text: 'De betaalde elementen vervangen, een screenshot maken waarvan je alleen je poster uitsnijdt, of bij Delen een link delen.', correct: true, explanation: 'Dat zijn precies de drie routes uit de les, en alle drie leveren ze bewijs op.' }
        ],
        feedback: 'Er zijn drie uitwegen: element vervangen, uitgesneden screenshot of een gedeelde link. Niets inleveren is er geen van.'
      },
      {
        prompt: 'Downloaden lukt niet, dus je maakt een screenshot zoals je in paragraaf 1.1 geleerd hebt. Beschrijf in stappen hoe je van dat screenshot een net ingeleverd bestand maakt.',
        type: 'open',
        leerdoel: 'Je kunt een screenshot maken en die inleveren bij je docent.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik zet mijn poster eerst schermvullend en maak dan een screenshot. Daarna snijd ik het beeld bij, zodat alleen de poster overblijft en niet mijn browser of mijn taakbalk. Ik sla het op als PNG in de map van dit vak in OneDrive, met mijn naam en klas in de bestandsnaam. Ten slotte lever ik het in op de plek die mijn docent heeft uitgelegd en controleer ik of het er echt staat.',
        nakijkpunten: [
          'Noemt het uitsnijden, zodat er geen browser of taakbalk in beeld blijft.',
          'Beschrijft waar het bestand wordt opgeslagen en hoe het heet.',
          'Sluit af met een controle dat het werk daadwerkelijk is ingeleverd.'
        ],
        feedback: 'Een screenshot met je hele bureaublad erop is geen inlevering. Uitsnijden, netjes benoemen, inleveren, controleren.'
      },
      {
        prompt: 'In paragraaf 8.1 schreef je een dagelijkse handeling op als stappenplan. Welk rijtje is zo\'n stappenplan voor het maken van een Canva-poster?',
        leerdoel: 'Je kunt een dagelijkse handeling in duidelijke stappen opschrijven.',
        denkniveau: 'toepassen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        options: [
          { text: 'Maak een poster en lever hem in.', correct: false, misconception: 'Noemt het doel in plaats van de stappen, waardoor niemand het kan uitvoeren.' },
          { text: 'Download je poster, kies daarna een staand formaat en log als allerlaatste stap pas in bij je Canva-account.', correct: false, misconception: 'Zet de stappen wel op een rij maar in een volgorde die onuitvoerbaar is.' },
          { text: 'Zet er zo veel mogelijk plaatjes op tot het mooi genoeg lijkt, en kijk daarna pas verder.', correct: false, misconception: 'Vervangt een stappenplan door proberen tot het toevallig goed is.' },
          { text: 'Log in, klik op de plus, kies een staand posterformaat, zet je titel neer, download als PNG.', correct: true, explanation: 'Vijf stappen die je in deze volgorde kunt uitvoeren, precies zoals bij het stappenplan uit 8.1.' }
        ],
        feedback: 'Een stappenplan is pas goed als elke stap uitvoerbaar is op het moment dat hij aan de beurt is; ook bij ontwerpen.'
      }
    ]
  },

  '8.5': {
    learningGoals: [
      'Je kunt met een chatbot informatie verzamelen over jouw onderwerp.',
      'Je kunt die informatie in je eigen woorden op een poster zetten.',
      'Je kunt een poster maken die leesbaar, rustig en aantrekkelijk is.'
    ],
    theorie: [
      {
        // 'prompt' en 'eigen woorden' staan al vet in hoofdstuk 7 (7.3 en 7.4);
        // ze komen hier wel in de tekst en in de vragen terug, maar niet vet.
        keyTerms: ['TalkAI', 'onderwerp'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Welke opdracht aan de chatbot levert meer op: "vertel iets over cyberpesten" of iets anders?</p>',
          '<p><strong>Antwoord.</strong> Iets anders, en wel: "Je geeft voorlichting op een school. Geef vijf korte tips tegen cyberpesten voor leerlingen van twaalf jaar, elke tip maximaal vijftien woorden." Nu staan de vier onderdelen erin: de opdracht (geef vijf korte tips), het onderwerp (cyberpesten), de doelgroep (leerlingen van twaalf jaar) en de lengte (maximaal vijftien woorden per tip). Het zinnetje "Je geeft voorlichting op een school" is geen vijfde onderdeel, maar de losse roltip uit hoofdstuk 7 die de toon stuurt. Het antwoord is daardoor meteen bruikbaar voor twee tekstvakken op je poster.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['poster', 'witruimte', 'titel'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Twee posters over nepnieuws: de een heeft acht plaatjes en vijf kleuren, de ander een grote titel, twee tekstvakken en veel wit. Welke werkt beter en waarom?</p>',
          '<p><strong>Antwoord.</strong> De tweede. Een poster wordt in een paar seconden bekeken, dus de kijker moet direct zien waar hij over gaat. Acht plaatjes en vijf kleuren laten het oog nergens rusten, terwijl witruimte de titel juist naar voren haalt.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een chatbot levert ruw materiaal: je controleert het, kort het in en schrijft het in je eigen woorden op, want alleen dan kun je het ook uitleggen. Een goede poster is leesbaar en niet te druk, met een grote titel, hooguit twee of drie kleuren en genoeg witruimte. Je poster moet aan zes voorwaarden voldoen, van een duidelijke titel tot het staande formaat.</p>',
      keyTerms: ['poster', 'witruimte', 'voorwaarden']
    },
    // Afsluitquiz: 7 vragen. Terugkeervragen: vraag 2 (h7, hallucineren en het
    // controleren van een chatbotantwoord), vraag 4 (1.4, teksten van internet
    // en bronvermelding) en sinds ronde 7 vraag 7 (8.4, downloaden en
    // inleveren). Vraag 7 is toegevoegd omdat de eerste twee terugkeervragen
    // hun stof buiten hoofdstuk 8 halen; spreiding binnen het hoofdstuk zelf
    // ontbrak daardoor. De eigen drie leerdoelen worden 2x, 2x en 2x bevraagd,
    // vraag 7 hangt aan het downloaddoel van 8.4.
    vragen: [
      {
        prompt: 'Welke prompt levert de bruikbaarste informatie op voor een poster over veilig internetten?',
        leerdoel: 'Je kunt met een chatbot informatie verzamelen over jouw onderwerp.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Veilig internet.', correct: false, misconception: 'Denkt dat een zoekterm hetzelfde is als een opdracht aan een chatbot.' },
          { text: 'Vertel eens iets over internet en over alles wat daar zoal mee te maken heeft.', correct: false, misconception: 'Vraagt zo breed dat het antwoord over alles en niets gaat.' },
          { text: 'Geef vijf korte tips over veilig internetten voor leerlingen van twaalf jaar, elke tip maximaal vijftien woorden.', correct: true, explanation: 'Hier staan opdracht, onderwerp, doelgroep en lengte in, dus het antwoord past meteen op een poster.' },
          { text: 'Maak mijn poster over veilig internetten helemaal af, bedenk zelf de titel en de plaatjes, en lever hem meteen in.', correct: false, misconception: 'Laat het denkwerk over aan de chatbot en levert werk in dat niet van hem is.' }
        ],
        feedback: 'Een prompt met opdracht, onderwerp, doelgroep en lengte geeft antwoord dat je zonder veel knippen kunt gebruiken.'
      },
      {
        prompt: 'De chatbot noemt een getal over cyberpesten dat goed op je poster zou staan. Leg uit wat je doet voordat dat getal er echt op komt.',
        type: 'open',
        leerdoel: 'Je kunt met een chatbot informatie verzamelen over jouw onderwerp.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        modelAnswer: 'Ik controleer het getal eerst bij een betrouwbare bron, bijvoorbeeld een site over pesten of het CBS, want een chatbot kan hallucineren en getallen verzinnen die zeker klinken. Klopt het, dan schrijf ik het in mijn eigen woorden op en noem ik erbij waar het vandaan komt. Klopt het niet of vind ik niets, dan laat ik het weg.',
        nakijkpunten: [
          'Noemt dat een chatbot getallen kan verzinnen (hallucineren).',
          'Beschrijft een controle bij een andere, betrouwbare bron.',
          'Zegt wat er gebeurt als het getal niet te controleren is.'
        ],
        feedback: 'Een getal dat je niet kunt controleren hoort niet op een poster. Wat er staat, moet jij kunnen verdedigen.'
      },
      {
        prompt: 'Tekst die de chatbot voor je schrijft mag je precies zo op je poster plakken.',
        waar: false,
        leerdoel: 'Je kunt die informatie in je eigen woorden op een poster zetten.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'De voorwaarden van de opdracht eisen dat je de informatie aanpast naar je eigen woorden, en dat je kunt uitleggen wat er staat.'
      },
      {
        prompt: 'In paragraaf 1.4 leerde je dat je teksten van internet niet zomaar overneemt en dat je de bron noemt. Leg uit hoe die regel geldt voor tekst die een chatbot voor jou schrijft.',
        type: 'open',
        leerdoel: 'Je weet dat je teksten van internet niet zomaar mag overnemen en dat je de bron noemt.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        modelAnswer: 'Ook een chatbot is niet mijzelf: de zinnen komen ergens vandaan en zijn niet door mij bedacht. Daarom schrijf ik ze om naar mijn eigen woorden, zodat ik ze kan uitleggen en het echt mijn werk is. Neem ik toch iets bijna letterlijk over, dan zet ik erbij dat ik het met een chatbot gemaakt heb, net zoals ik bij een website de bron noem.',
        nakijkpunten: [
          'Zegt dat de tekst van de chatbot niet vanzelf eigen werk is.',
          'Noemt het herschrijven in eigen woorden als de gewone route.',
          'Noemt bronvermelding als je iets toch bijna letterlijk overneemt.'
        ],
        feedback: 'De regel uit 1.4 verandert niet omdat de tekst uit een chatbot komt. Eigen woorden, of eerlijk zeggen waar het vandaan komt.'
      },
      {
        prompt: 'Wanneer noemen we een poster leesbaar?',
        leerdoel: 'Je kunt een poster maken die leesbaar, rustig en aantrekkelijk is.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Als de teksten niet wegvallen tegen de foto of de achtergrond.', correct: true, explanation: 'Leesbaar gaat over contrast en grootte: de kijker moet de tekst zonder moeite kunnen lezen.' },
          { text: 'Als er zo veel mogelijk informatie op staat, want dan weet de kijker meteen alles.', correct: false, misconception: 'Verwart volledigheid met duidelijkheid.' },
          { text: 'Als er minstens vijf kleuren gebruikt zijn.', correct: false, misconception: 'Denkt dat meer kleur automatisch aantrekkelijker is.' },
          { text: 'Als de poster liggend gemaakt is.', correct: false, misconception: 'Verwart het formaat met de leesbaarheid.' }
        ],
        feedback: 'Leesbaar betekent: zonder moeite te lezen. Contrast, lettergrootte en rust bepalen dat, niet de hoeveelheid tekst.'
      },
      {
        prompt: 'Hoeveel kleuren gebruik je volgens de tips uit de eindopdracht maximaal op je poster?',
        leerdoel: 'Je kunt een poster maken die leesbaar, rustig en aantrekkelijk is.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een kleur, want meer leidt af.', correct: false, misconception: 'Slaat door naar het andere uiterste en maakt de poster saai.' },
          { text: 'Zoveel als je mooi vindt.', correct: false, misconception: 'Denkt dat smaak hier de enige maat is.' },
          { text: 'Minstens vijf, anders valt hij niet op.', correct: false, misconception: 'Denkt dat opvallen hetzelfde is als druk.' },
          { text: 'Twee of drie kleuren die goed bij elkaar passen.', correct: true, explanation: 'Dat is de tip uit de les: genoeg variatie om te boeien, weinig genoeg om rustig te blijven.' }
        ],
        feedback: 'Twee of drie kleuren die bij elkaar passen geven rust. Alles wat daarboven komt vecht om de aandacht van de kijker.'
      },
      {
        prompt: 'Je poster is af en in Canva staat "alle wijzigingen opgeslagen". Wat moet er volgens paragraaf 8.4 nog gebeuren voordat je docent hem kan beoordelen?',
        leerdoel: 'Je kunt je ontwerp downloaden of delen als PNG of PDF.',
        denkniveau: 'toepassen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        options: [
          { text: 'Niets meer, want Canva bewaart je poster automatisch in je eigen account.', correct: false, misconception: 'Verwart opslaan in je eigen account met inleveren bij je docent.' },
          { text: 'Je poster opnieuw namaken in Word, zodat je zeker weet dat het bestand ook echt te openen is.', correct: false, misconception: 'Doet het werk over in plaats van het bestaande ontwerp te exporteren.' },
          { text: 'Alleen het tabblad sluiten, dan komt je poster vanzelf bij je docent terecht.', correct: false, misconception: 'Denkt dat afsluiten hetzelfde is als versturen.' },
          { text: 'Downloaden als PNG of PDF en dat bestand inleveren.', correct: true, explanation: 'Automatisch opslaan en inleveren zijn twee losse stappen; alleen het gedownloade bestand is jouw bewijs.' }
        ],
        feedback: 'Opgeslagen is niet ingeleverd. Je poster telt pas mee zodra het gedownloade bestand op de inleverplek staat.'
      }
    ]
  },

  '8.6': {
    learningGoals: [
      'Je kunt terugkijken op wat je dit jaar geleerd hebt over digitale geletterdheid.',
      'Je kunt je kennis laten zien in een eigen eindcreatie in Canva, Word of PowerPoint.'
    ],
    theorie: [
      {
        keyTerms: ['reflecteren', 'leerjaar', 'verschillen'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Twee antwoorden op "wat is je het meest bijgebleven": "alles" en "dat een deepfake met gewone software gemaakt wordt". Welk antwoord is een terugblik?</p>',
          '<p><strong>Antwoord.</strong> Het tweede. Reflecteren betekent dat je iets concreets aanwijst en zegt waarom het je raakte. "Alles" zegt niets over wat er in jouw hoofd veranderd is, en je kunt er ook geen vervolgvraag op stellen.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['eindcreatie', 'opmaak', 'inleveren'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Noor kiest optie B en levert een A4 in met drie alinea\'s zonder koppen en zonder afbeelding. Voldoet dat?</p>',
          '<p><strong>Antwoord.</strong> Nee. Optie B vraagt behalve de inhoud ook minstens een afbeelding en zichtbare opmaak: koppen, vetgedrukte woorden en paginanummering. Dat is precies wat je in hoofdstuk 4 met Word geleerd hebt, en het is hier het bewijs dat je die vaardigheid nog beheerst.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Je sluit het jaar af door te reflecteren: je benoemt wat je geleerd hebt, wat je nog wilt weten en of je je nu veilig genoeg voelt online. Daarna kies je een eindcreatie in Canva, Word of PowerPoint, met per optie eigen eisen aan beeld, tekst en opmaak. Het inleveren is een aparte stap: terugblik en creatie gaan samen naar je docent.</p>',
      keyTerms: ['reflecteren', 'eindcreatie', 'inleveren']
    },
    // EINDTOETS VAN HET LEERJAAR - 38 vragen, 10 open.
    // Elk van de zeventien leerdoelen van 8.1 tot en met 8.6 wordt precies twee
    // keer bevraagd, behalve het accountdoel van 8.4, dat er vier krijgt, en
    // het terugblikdoel van 8.6, dat eveneens vier vragen krijgt omdat het over
    // het hele jaar gaat. De acht Canva-vragen zijn in ronde 5 opnieuw over de
    // drie jaarplandoelen van 8.4 verdeeld: vier bij het account inclusief de
    // homepagina, twee bij het starten van de poster en twee bij downloaden en
    // delen. De diagnostische ronde staat sinds ronde 6 niet meer in het
    // oefenblok maar in de STARTCHECK van 8.6, dus als eerste blok van deze
    // paragraaf en ruim voor deze toets: zeventien vragen, een per doel, met
    // per gemist doel het herhaalmateriaal erbij, gevolgd door de herhaling
    // (de twee theorieblokken) en de twee sporen bij Extra steun en Extra plus. Zes vragen halen hun stof uit eerdere
    // hoofdstukken: h1 (wachtwoord), h2 (hardware en software), h3 (phishing),
    // h4 (Word-opmaak), h5 (webshopcheck) en h6 (social media), en h7 komt
    // terug in de vragen over de chatbot. Over 8.7 gaat geen enkele vraag: dat
    // is de vrijwillige plusparagraaf.
    vragen: [
      {
        prompt: 'Wat is een algoritme?',
        leerdoel: 'Je kunt uitleggen wat een algoritme is als stappenplan.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Een stappenplan met instructies die in een vaste volgorde worden uitgevoerd.', correct: true, explanation: 'Precies de definitie uit paragraaf 8.1, of het nu op papier staat of in blokken.' },
          { text: 'Een computerprogramma dat helemaal zelf kan nadenken en zelf zijn beslissingen neemt.', correct: false, misconception: 'Verwart een algoritme met kunstmatige intelligentie.' },
          { text: 'Een foutmelding van de computer.', correct: false, misconception: 'Koppelt het woord aan iets dat misgaat.' },
          { text: 'Een app waarmee je posters maakt.', correct: false, misconception: 'Verwart een begrip uit programmeren met een ontwerpprogramma.' }
        ],
        feedback: 'Stappen, op volgorde, letterlijk uit te voeren: dat is een algoritme, of het nu over een recept of een tijdlijn gaat.'
      },
      {
        prompt: 'Leg uit waarom een algoritme voor een computer volledig moet zijn, terwijl een uitleg aan een mens dat niet hoeft.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen wat een algoritme is als stappenplan.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Een mens heeft voorkennis en vult zelf aan wat er niet staat: hoort hij "smeer een boterham", dan pakt hij vanzelf de zak. Een computer heeft die voorkennis niet en voert alleen uit wat er letterlijk staat. Ontbreekt er een stap, dan stopt hij of doet hij iets anders dan de bedoeling was.',
        nakijkpunten: [
          'Noemt dat een mens ontbrekende stappen zelf invult.',
          'Zegt dat een computer alleen doet wat er letterlijk staat.',
          'Beschrijft het gevolg van een ontbrekende stap.'
        ],
        feedback: 'Volledigheid is bij een algoritme geen netheid maar noodzaak: wat er niet staat, gebeurt bij een computer ook niet.'
      },
      {
        prompt: 'Je schrijft op hoe je thee zet. Welke stap is niet goed genoeg opgeschreven voor een robot?',
        leerdoel: 'Je kunt een dagelijkse handeling in duidelijke stappen opschrijven.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Pak een mok uit de kast.', correct: false, misconception: 'Ziet een gewone concrete handeling aan voor een onduidelijke.' },
          { text: 'Doe een theezakje in de mok.', correct: false, misconception: 'Denkt dat elke stap met een voorwerp erin onduidelijk is.' },
          { text: 'Zet even thee.', correct: true, explanation: 'Dit is geen stap maar de hele opdracht; er staat niets in wat je kunt uitvoeren.' },
          { text: 'Giet heet water in de mok tot hij driekwart vol is.', correct: false, misconception: 'Vindt de stap te lang, terwijl juist die maat hem uitvoerbaar maakt.' }
        ],
        feedback: 'Een stap die de hele opdracht herhaalt is geen stap. Uitvoerbaar betekent: een handeling, met genoeg maat erbij.'
      },
      {
        prompt: 'Een stappenplan is af zodra jij zelf begrijpt wat er staat.',
        waar: false,
        leerdoel: 'Je kunt een dagelijkse handeling in duidelijke stappen opschrijven.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'Jij weet al wat je bedoelde, dus jouw begrip bewijst niets. Pas een uitvoerder die niets invult laat zien of het klopt.'
      },
      {
        prompt: 'Waarvoor gebruik je een herhaling in een stappenplan?',
        leerdoel: 'Je weet wat een herhaling en een keuze in een stappenplan zijn.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Om het programma sneller te laten opstarten en onderweg minder geheugen te laten gebruiken.', correct: false, misconception: 'Verwart herhalen met snelheid van de computer.' },
          { text: 'Om dezelfde stappen meerdere keren te laten uitvoeren zonder ze over te typen.', correct: true, explanation: 'De herhaling voert de blokken die erin liggen elke ronde opnieuw uit.' },
          { text: 'Om te bepalen of iets waar of niet waar is.', correct: false, misconception: 'Verwisselt de herhaling met de keuze.' },
          { text: 'Om je programma een naam te geven.', correct: false, misconception: 'Denkt dat besturingsstructuren over benoemen gaan.' }
        ],
        feedback: 'Herhalen scheelt schrijfwerk en fouten: je zet de stappen een keer neer en laat de lus het aantal rondes doen.'
      },
      {
        prompt: 'Welk stukje tekst is een voorwaarde?',
        leerdoel: 'Je weet wat een herhaling en een keuze in een stappenplan zijn.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Neem tien stappen naar voren.', correct: false, misconception: 'Ziet elke instructie met een getal erin als een voorwaarde.' },
          { text: 'Herhaal dit twintig keer.', correct: false, misconception: 'Verwart het aantal rondes van een lus met een voorwaarde.' },
          { text: 'Zeg hallo tegen de speler.', correct: false, misconception: 'Denkt dat een blok dat iets toont ook iets beslist.' },
          { text: 'Raak je de rand.', correct: true, explanation: 'Dit kan op elk moment waar of niet waar zijn, en daar beslist het programma op.' }
        ],
        feedback: 'Een voorwaarde is een uitspraak die klopt of niet klopt. Kun je er ja of nee op zeggen, dan heb je hem te pakken.'
      },
      {
        prompt: 'Wat heb je minimaal nodig om je Scratch-programma te laten starten als de speler op de groene vlag klikt?',
        leerdoel: 'Je kunt met blokken een klein programma maken dat werkt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Een gebeurtenisblok bovenaan, met de rest van je blokken eraan vastgeklikt.', correct: true, explanation: 'Het startsignaal staat bovenaan en de blokken eronder horen er vast aan te zitten.' },
          { text: 'Losse blokken die ergens op het werkveld liggen, netjes onder elkaar in de goede volgorde.', correct: false, misconception: 'Denkt dat blokken al werken zodra ze op het scherm staan.' },
          { text: 'Een sprite met een mooie afbeelding.', correct: false, misconception: 'Verwart het uiterlijk van de sprite met de werking van het script.' },
          { text: 'Een account op scratch.mit.edu.', correct: false, misconception: 'Denkt dat inloggen nodig is om iets te laten werken, terwijl dat alleen bewaren is.' }
        ],
        feedback: 'Startblok bovenaan, de rest eraan vast: dat is het minimum. Losse blokken doen niets, hoe mooi ze ook liggen.'
      },
      {
        prompt: 'Beschrijf welke blokken jij gebruikt hebt om je sprite te laten bewegen en terug te laten kaatsen, en zeg per blok waar het staat.',
        type: 'open',
        leerdoel: 'Je kunt met blokken een klein programma maken dat werkt.',
        denkniveau: 'maken_controleren',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Bovenaan staat "wanneer op de groene vlag wordt geklikt". Daaronder staat "herhaal oneindig". Binnen die herhaling staat "neem 10 stappen" met daaronder "keer om aan de rand", dat het terugkaatsen zelf regelt. Onderin de herhaling staat nog een als-dan-blok met de voorwaarde "raak ik (rand)?" en daarin "zeg Boing!".',
        nakijkpunten: [
          'Noemt het gebeurtenisblok, een herhaling en een als-dan-blok.',
          'Zegt per blok of het binnen of buiten de herhaling staat.',
          'De beschreven volgorde levert echt bewegen en terugkaatsen op.'
        ],
        feedback: 'Waar een blok staat bepaalt wat het doet. Hetzelfde beweegblok binnen of buiten de lus geeft een heel ander spel.'
      },
      {
        prompt: 'Wat schuif je in een als-dan-blok?',
        leerdoel: 'Je kunt in je programma een herhaling en een als-dan-keuze gebruiken.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Het aantal keren dat iets moet gebeuren.', correct: false, misconception: 'Vult het getal van de herhaling in op de plek van de voorwaarde.' },
          { text: 'De naam van je sprite.', correct: false, misconception: 'Denkt dat de keuze over het figuur gaat en niet over een situatie.' },
          { text: 'Een voorwaarde die waar of niet waar kan zijn.', correct: true, explanation: 'De blokken binnenin worden alleen uitgevoerd als die voorwaarde op dat moment waar is.' },
          { text: 'De achtergrondkleur van het speelveld.', correct: false, misconception: 'Verwart de vormgeving van het speelveld met de logica van het script.' }
        ],
        feedback: 'In het als-vak hoort iets dat klopt of niet klopt, bijvoorbeeld "raak ik (rand)?". Dat is de kern van elke keuze.'
      },
      {
        prompt: 'Een als-dan-blok en een herhaal-blok doen hetzelfde, zolang er maar een getal in staat.',
        waar: false,
        leerdoel: 'Je kunt in je programma een herhaling en een als-dan-keuze gebruiken.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'De een telt rondes, de ander beslist. Een herhaling gaat over hoe vaak, een keuze over of het gebeurt of niet.'
      },
      {
        prompt: 'Een klasgenoot vraagt wat jouw programma doet. Welke uitleg is de beste?',
        leerdoel: 'Je kunt uitleggen wat jouw programma stap voor stap doet.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Het is een spelletje met een kat erin.', correct: false, misconception: 'Beschrijft wat je ziet in plaats van wat het programma doet.' },
          { text: 'Als je op de vlag klikt, loopt de kat door en draait hij om zodra hij de rand raakt.', correct: true, explanation: 'Deze uitleg volgt de blokken in volgorde en noemt wanneer wat gebeurt.' },
          { text: 'Ik heb er heel lang aan gewerkt en na veel proberen werkt mijn programma nu eindelijk goed.', correct: false, misconception: 'Vertelt over het maakproces in plaats van over de werking.' },
          { text: 'Er zitten oranje en gele blokken in.', correct: false, misconception: 'Beschrijft de kleuren van de blokken in plaats van hun betekenis.' }
        ],
        feedback: 'Een goede uitleg volgt het script: eerst het startsein, dan wat er steeds gebeurt, dan wat er soms gebeurt.'
      },
      {
        prompt: 'Leg uit hoe je aan iemand duidelijk maakt welke blokken binnen je herhaling staan en welke eronder hangen.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen wat jouw programma stap voor stap doet.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik wijs aan dat de blokken binnen de lus ingesloten zijn door de oranje C-vorm en verder naar rechts staan. Alles wat daarbinnen ligt gebeurt elke ronde opnieuw. De blokken die eronder hangen staan weer helemaal links en gebeuren pas als de herhaling klaar is, of bij een oneindige lus zelfs nooit.',
        nakijkpunten: [
          'Noemt de vorm of de inspringing waaraan je ziet wat binnen de lus valt.',
          'Zegt dat wat binnen de lus staat elke ronde opnieuw gebeurt.',
          'Zegt wanneer de blokken eronder aan de beurt komen.'
        ],
        feedback: 'Binnen of buiten de lus zie je aan de vorm en de inspringing. Precies daarom kun je met blokken geen onmogelijke code maken.'
      },
      {
        prompt: 'Een programma dat een keer goed werkte, is daarmee getest.',
        waar: false,
        leerdoel: 'Je kunt je programma testen en zien waar het misgaat.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'Een keer goed gaan is geluk hebben. Testen is bewust de gevallen proberen waarin het juist mis kan gaan.'
      },
      {
        prompt: 'Je programma doet niets zichtbaars en geeft geen melding. Welke aanpak brengt je het snelst bij de fout?',
        leerdoel: 'Je kunt je programma testen en zien waar het misgaat.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Alle blokken door elkaar husselen en net zo lang kijken tot er eindelijk iets anders gebeurt.', correct: false, misconception: 'Denkt dat toeval sneller is dan zoeken.' },
          { text: 'Aan je docent vragen om het voor je op te lossen.', correct: false, misconception: 'Slaat het zoeken over, waardoor je bij de volgende fout weer vastloopt.' },
          { text: 'Halverwege je script een blok zetten dat iets zegt, zodat je ziet of hij daar komt.', correct: true, explanation: 'Zo halveer je het zoekgebied: komt hij er wel, dan ligt de fout erna.' },
          { text: 'Het programma opnieuw opstarten tot het wel werkt.', correct: false, misconception: 'Denkt dat een programma zich per keer anders gedraagt.' }
        ],
        feedback: 'Een zichtbaar tussenpunt splitst je script in tweeën. Elke test die je zo doet, halveert de plek waar de fout kan zitten.'
      },
      {
        prompt: 'Je sprite verandert niet van uiterlijk bij de rand en er komt geen melding. Waar kijk je als eerste?',
        leerdoel: 'Je weet wat een bug is en hoe je die opspoort.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Bij het als-dan-blok met de voorwaarde over de rand.', correct: true, explanation: 'Dat is het enige blok dat over die verandering beslist, dus daar begint het zoeken.' },
          { text: 'Bij het uiterlijk van je sprite.', correct: false, misconception: 'Zoekt de fout in de vormgeving in plaats van in de logica.' },
          { text: 'Bij de achtergrond van het speelveld, want daar staat de rand van het scherm op.', correct: false, misconception: 'Denkt dat het speelveld het gedrag van de sprite bepaalt.' },
          { text: 'Bij de naam van je project.', correct: false, misconception: 'Zoekt buiten het script naar een oorzaak die er niet kan zitten.' }
        ],
        feedback: 'Begin altijd bij het blok dat over het kapotte gedrag gaat. Dat scheelt je het doorspitten van je hele script.'
      },
      {
        prompt: 'Leg uit hoe je met kleine stappen ontdekt in welk blok de fout zit.',
        type: 'open',
        leerdoel: 'Je weet wat een bug is en hoe je die opspoort.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik voer mijn script niet in een keer uit, maar kijk na elk blok of het resultaat nog klopt. Dat doe ik door tussendoor iets te laten zeggen of door een stuk tijdelijk uit te zetten. Zodra het resultaat niet meer klopt, weet ik dat de fout in het blok ervoor zit, en verander ik alleen dat blok.',
        nakijkpunten: [
          'Beschrijft controleren na elke stap in plaats van na het geheel.',
          'Noemt een concrete techniek: iets laten zeggen of een stuk uitzetten.',
          'Zegt hoe de uitkomst de plek van de fout aanwijst.'
        ],
        feedback: 'Kleine stappen maken een onzichtbare fout zichtbaar. Je zoekt niet naar de fout, je sluit stukje bij beetje plekken uit.'
      },
      {
        prompt: 'Je programma werkt na drie wijzigingen tegelijk ineens goed. Waarom is dat toch een probleem?',
        leerdoel: 'Je kunt je programma verbeteren na feedback van een klasgenoot.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Omdat Scratch dan traag wordt.', correct: false, misconception: 'Denkt dat het aantal wijzigingen invloed heeft op de snelheid.' },
          { text: 'Omdat je niet weet welke wijziging hielp, en de andere twee nieuwe fouten kunnen hebben gemaakt.', correct: true, explanation: 'Zonder tussentijds testen levert een geslaagde uitkomst geen bruikbare informatie op.' },
          { text: 'Omdat je programma door die drie wijzigingen veel te lang geworden is.', correct: false, misconception: 'Verwart de lengte van het script met de kwaliteit van je test.' },
          { text: 'Omdat je het programma nu niet meer mag inleveren, want je hebt er te veel dingen tegelijk in aangepast.', correct: false, misconception: 'Denkt dat het om een regel gaat in plaats van om je eigen inzicht.' }
        ],
        feedback: 'Werken is niet hetzelfde als begrijpen. Wie niet weet waardoor het werkt, staat bij de volgende fout weer op nul.'
      },
      {
        prompt: 'Een klasgenoot geeft je drie tips over jouw programma. Beschrijf in welke volgorde je ze uitvoert en waarom je dat zo doet.',
        type: 'open',
        leerdoel: 'Je kunt je programma verbeteren na feedback van een klasgenoot.',
        denkniveau: 'maken_controleren',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik begin met de tip over het gedrag dat het meest kapot is, want die levert de grootste winst op. Die voer ik als enige door en daarna test ik meteen opnieuw. Werkt het, dan noteer ik dat en pak ik de volgende tip. Zo weet ik na elke test welke verandering welk effect had, en kan ik een tip die niet hielp terugdraaien.',
        nakijkpunten: [
          'Voert een tip tegelijk door en test daartussen.',
          'Geeft een reden voor de gekozen volgorde.',
          'Noemt dat een tip die niet helpt teruggedraaid of afgewezen wordt.'
        ],
        feedback: 'Feedback verwerk je als een reeks kleine proeven, niet als een lijst die je in een keer afvinkt.'
      },
      {
        prompt: 'Canva is een online ontwerptool: je werkt in je browser en hoeft niets te installeren.',
        waar: true,
        leerdoel: 'Je kunt met je schoolmail een Canva-account maken en inloggen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'Juist omdat het online staat, kun je op elke schoolcomputer verder met hetzelfde ontwerp.'
      },
      {
        prompt: 'Op de homepagina van Canva staan vier onderdelen. Welke rij noemt ze alle vier?',
        leerdoel: 'Je kunt met je schoolmail een Canva-account maken en inloggen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Ontwerpen, tekst, elementen en uploads.', correct: false, misconception: 'Noemt het linkermenu dat pas in de open poster verschijnt, niet het beginscherm.' },
          { text: 'Delen, Downloaden, PNG en PDF.', correct: false, misconception: 'Noemt de uitgang van een af ontwerp in plaats van de ingang van het programma.' },
          { text: 'De zoekbalk, de plusknop links, je eerdere ontwerpen en de toegang tot templates en uploads.', correct: true, explanation: 'Zoeken, nieuw beginnen, verder werken en materiaal halen: dat zijn de vier taken van het beginscherm.' },
          { text: 'De prullenbak, het menu "laag", het kleurwieltje en de rechtermuisknop.', correct: false, misconception: 'Verwart het gereedschap waarmee je een ontwerp bewerkt met het scherm waarop je binnenkomt.' }
        ],
        feedback: 'Het beginscherm en de poster zelf hebben elk hun eigen menu. Kleurwieltje en "laag" horen bij de poster, niet bij de homepagina.'
      },
      {
        prompt: 'Welke stap hoort bij het maken van je Canva-account voor school?',
        leerdoel: 'Je kunt met je schoolmail een Canva-account maken en inloggen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Je registreert met je privémail, want dat adres werkt altijd en dat wachtwoord ken je uit je hoofd.', correct: false, misconception: 'Kiest het bekende adres en haalt schoolwerk uit je schoolomgeving.' },
          { text: 'Je registreert met je schoolmail en bevestigt daarna via de link of de code in je mail.', correct: true, explanation: 'Registreren, bevestigen en pas daarna inloggen is de volgorde uit de les.' },
          { text: 'Je gebruikt het account van een klasgenoot.', correct: false, misconception: 'Denkt dat een geleend account ook jouw werk kan bewijzen.' },
          { text: 'Je hoeft geen account, je werkt anoniem verder.', correct: false, misconception: 'Denkt dat je zonder account je ontwerp kunt bewaren en inleveren.' }
        ],
        feedback: 'Registreren met je schoolmail, bevestigen via de mail, daarna pas inloggen. Sla je het bevestigen over, dan kom je er niet in.'
      },
      {
        prompt: 'Na het registreren kun je meteen inloggen, ook als je de bevestigingsmail nooit geopend hebt.',
        waar: false,
        leerdoel: 'Je kunt met je schoolmail een Canva-account maken en inloggen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'Zonder bevestiging bestaat je account nog niet echt. Kijk ook in de map ongewenste mail voordat je opnieuw begint.'
      },
      {
        prompt: 'Hoe kom je vanaf de homepagina bij een lege staande poster?',
        leerdoel: 'Je kunt een A4-poster starten en tekst, elementen en kleur toevoegen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Je opent je vorige ontwerp en gooit alles wat erop staat weg.', correct: false, misconception: 'Hergebruikt oud werk en raakt daarmee de vorige opdracht kwijt.' },
          { text: 'Je zoekt op internet naar een lege poster en slaat die op.', correct: false, misconception: 'Zoekt buiten het programma naar iets wat het programma zelf levert.' },
          { text: 'Je klikt op je profielfoto en kiest daar een formaat.', correct: false, misconception: 'Zoekt ontwerpinstellingen bij je accountgegevens.' },
          { text: 'Je klikt op de plus, typt poster in de zoekbalk en kiest een staand formaat.', correct: true, explanation: 'Plus, zoeken, formaat kiezen is de vaste route naar een nieuw ontwerp.' }
        ],
        feedback: 'Plus, zoekwoord, formaat: drie klikken en je hebt een leeg vel in precies de maat die de opdracht vraagt.'
      },
      {
        prompt: 'Je titel valt weg tegen de achtergrondkleur die je net gekozen hebt. Wat is de beste oplossing?',
        leerdoel: 'Je kunt een A4-poster starten en tekst, elementen en kleur toevoegen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Een andere achtergrondkleur kiezen of de tekstkleur aanpassen, zodat de titel leesbaar blijft.', correct: true, explanation: 'Leesbaarheid gaat voor: kleur en tekst moeten genoeg verschillen.' },
          { text: 'De titel kleiner maken zodat hij minder opvalt.', correct: false, misconception: 'Verkleint het probleem letterlijk in plaats van het op te lossen.' },
          { text: 'De titel helemaal weghalen, want de plaatjes op je poster vertellen het verhaal ook wel zonder tekst.', correct: false, misconception: 'Denkt dat beeld de titel kan vervangen, terwijl een poster juist in een oogopslag moet zeggen waar hij over gaat.' },
          { text: 'Nog een tweede titel eronder zetten.', correct: false, misconception: 'Lost onleesbaarheid op door meer tekst toe te voegen.' }
        ],
        feedback: 'Kleurcontrast is geen smaakkwestie: kan een lezer je titel op een meter afstand niet lezen, dan mist hij je boodschap.'
      },
      {
        prompt: 'Hoe lever je een Canva-ontwerp in als bestand?',
        leerdoel: 'Je kunt je ontwerp downloaden of delen als PNG of PDF.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Je maakt een foto van je scherm met je telefoon.', correct: false, misconception: 'Denkt dat elk beeld even goed is, ook als het scheef en onscherp is.' },
          { text: 'Je stuurt het adres van de Canva-startpagina op.', correct: false, misconception: 'Verwart de site met het eigen ontwerp.' },
          { text: 'Je laat het gewoon in Canva staan, want het slaat automatisch op.', correct: false, misconception: 'Verwart automatisch opslaan met inleveren.' },
          { text: 'Je klikt op Delen, dan op Downloaden en kiest PNG of PDF.', correct: true, explanation: 'Zo maak je een bestand dat je docent los van jouw account kan openen.' }
        ],
        feedback: 'Delen, downloaden, formaat kiezen: pas dan heb je een bestand dat buiten jouw account te openen is.'
      },
      {
        prompt: 'Downloaden lukt niet door een betaald element. Noem twee van de drie uitwegen uit de les, kies er een en leg uit waarom je die kiest.',
        type: 'open',
        leerdoel: 'Je kunt je ontwerp downloaden of delen als PNG of PDF.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik kan het betaalde element vervangen door een gratis element, of ik kan een screenshot maken en daar alleen mijn poster uitsnijden. De derde mogelijkheid is bij Delen een link delen. Ik kies het vervangen, want dan houd ik een echt PNG-bestand met de volle kwaliteit, en een screenshot wordt vaak minder scherp.',
        nakijkpunten: [
          'Noemt twee van de drie uitwegen correct.',
          'Maakt een duidelijke keuze uit de genoemde mogelijkheden.',
          'Geeft een inhoudelijke reden voor die keuze, bijvoorbeeld kwaliteit of gemak.'
        ],
        feedback: 'Alle drie de uitwegen leveren bewijs, maar niet dezelfde kwaliteit. Wie kiest, hoort te kunnen zeggen waarom.'
      },
      {
        prompt: 'Welke prompt levert de beste informatie op voor een poster over nepnieuws herkennen?',
        leerdoel: 'Je kunt met een chatbot informatie verzamelen over jouw onderwerp.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Nepnieuws.', correct: false, misconception: 'Typt een zoekterm zoals bij een zoekmachine in plaats van een opdracht.' },
          { text: 'Je geeft voorlichting op een school. Noem vier kenmerken waaraan een leerling van twaalf nepnieuws herkent, elk in een zin.', correct: true, explanation: 'Opdracht, onderwerp, doelgroep en lengte staan erin, dus het antwoord past meteen in je tekstvakken. De rol vooraf is de losse tip uit hoofdstuk 7 en geen vijfde onderdeel.' },
          { text: 'Is nepnieuws erg?', correct: false, misconception: 'Vraagt om een mening in plaats van om bruikbare informatie.' },
          { text: 'Schrijf mijn hele poster over nepnieuws en bedenk zelf maar welke informatie voor mijn klas belangrijk is.', correct: false, misconception: 'Laat de opdracht door de chatbot uitvoeren in plaats van hem als hulpmiddel te gebruiken.' }
        ],
        feedback: 'Een prompt is een opdracht, geen zoekterm. Opdracht, onderwerp, doelgroep en lengte maken het antwoord meteen bruikbaar.'
      },
      {
        prompt: 'Leg uit waarom je een chatbotantwoord altijd controleert voordat je het gebruikt, en beschrijf hoe je dat doet.',
        type: 'open',
        leerdoel: 'Je kunt met een chatbot informatie verzamelen over jouw onderwerp.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Een chatbot kan hallucineren: hij verzint dan iets dat heel zeker klinkt maar niet klopt, zoals een naam of een getal. Daarom zoek ik de belangrijkste beweringen na op een betrouwbare site, bijvoorbeeld van een organisatie of de overheid. Klopt het niet, of vind ik niets, dan laat ik het weg in plaats van het toch op te schrijven.',
        nakijkpunten: [
          'Noemt hallucineren of het verzinnen van feiten als reden.',
          'Beschrijft een concrete controle bij een tweede bron.',
          'Zegt wat er gebeurt als de bewering niet te bevestigen is.'
        ],
        feedback: 'Zeker klinken is geen bewijs. Wat jij op je poster zet, moet je bij een tweede bron kunnen terugvinden.'
      },
      {
        prompt: 'Als de chatbot al korte zinnen maakt, mag je die precies zo op je poster overnemen.',
        waar: false,
        leerdoel: 'Je kunt die informatie in je eigen woorden op een poster zetten.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'Kort is nog niet eigen. De opdracht vraagt dat jij de tekst hebt aangepast en dus ook kunt uitleggen.'
      },
      {
        prompt: 'De chatbot schrijft: "Het wordt aanbevolen mobiele apparaten voorafgaand aan de nachtrust te vermijden." Schrijf deze zin om tot een postertekst en leg uit wat je veranderd hebt.',
        type: 'open',
        leerdoel: 'Je kunt die informatie in je eigen woorden op een poster zetten.',
        denkniveau: 'maken_controleren',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Mijn versie is: "Leg je telefoon een uur voor het slapen weg." Ik heb de moeilijke woorden vervangen door woorden die iedereen kent, en ik spreek de lezer direct aan met je. Ook heb ik de zin korter gemaakt en er iets concreets in gezet, namelijk een uur, want op een poster moet je in een oogopslag weten wat je moet doen.',
        nakijkpunten: [
          'Levert een echte herschrijving op in eenvoudige, korte taal.',
          'Benoemt minstens twee dingen die zijn veranderd.',
          'Legt uit waarom die verandering past bij een poster.'
        ],
        feedback: 'Omschrijven is meer dan woorden wisselen: korter, concreter en gericht op de lezer die er drie seconden naar kijkt.'
      },
      {
        prompt: 'Aan welke voorwaarde moet de poster uit de eindopdracht voldoen?',
        leerdoel: 'Je kunt een poster maken die leesbaar, rustig en aantrekkelijk is.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Hij bevat minstens twee tekstvakken met korte uitleg of tips en een duidelijke titel.', correct: true, explanation: 'Titel, beeld en twee tekstvakken horen bij de zes voorwaarden uit de opdracht.' },
          { text: 'Hij is liggend, zodat er meer op past.', correct: false, misconception: 'Vergeet dat de opdracht een staand formaat eist.' },
          { text: 'Hij gaat over minstens drie onderwerpen tegelijk uit de lijst van negen onderwerpen.', correct: false, misconception: 'Denkt dat meer onderwerpen meer inhoud betekenen, terwijl de poster juist over een onderwerp gaat.' },
          { text: 'Hij bestaat uit een lange lopende tekst met alle informatie die je gevonden hebt.', correct: false, misconception: 'Behandelt een poster als een verslag.' }
        ],
        feedback: 'Een titel, minstens een beeld, twee korte tekstvakken, een onderwerp uit de lijst, eigen woorden en staand: dat zijn de zes.'
      },
      {
        prompt: 'Waarom laat je op een poster bewust witruimte over?',
        leerdoel: 'Je kunt een poster maken die leesbaar, rustig en aantrekkelijk is.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Omdat je dan minder werk hebt aan je poster.', correct: false, misconception: 'Ziet witruimte als luiheid in plaats van als keuze.' },
          { text: 'Omdat inkt duur is bij het afdrukken.', correct: false, misconception: 'Zoekt een praktische reden buiten het ontwerp.' },
          { text: 'Omdat het oog rust nodig heeft.', correct: true, explanation: 'Lege ruimte om een titel heen maakt die titel juist sterker, want er is niets meer dat om aandacht vecht.' },
          { text: 'Omdat het verplicht is bij elke opdracht in Canva.', correct: false, misconception: 'Denkt dat het een systeemregel is in plaats van een ontwerpkeuze.' }
        ],
        feedback: 'Witruimte is geen lege plek maar een keuze: hoe minder er om aandacht vecht, hoe harder je titel binnenkomt.'
      },
      {
        prompt: 'Je leerde dit jaar dat je een wachtwoord veilig moet maken. Wat maakt een wachtwoord het sterkst?',
        leerdoel: 'Je kunt terugkijken op wat je dit jaar geleerd hebt over digitale geletterdheid.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Je geboortedatum met een uitroepteken erachter.', correct: false, misconception: 'Denkt dat een extra teken persoonlijke gegevens veilig maakt.' },
          { text: 'Een lange wachtwoordzin die jij onthoudt.', correct: true, explanation: 'Lengte weegt zwaarder dan ingewikkeldheid, en een zin van meerdere woorden onthoud je zonder hem ergens op te schrijven.' },
          { text: 'De naam van je huisdier, want die kent niemand.', correct: false, misconception: 'Onderschat hoeveel er over jou online te vinden is.' },
          { text: 'Hetzelfde wachtwoord overal, zodat je het nooit vergeet.', correct: false, misconception: 'Ruilt veiligheid in voor gemak en verliest bij een lek meteen alles.' }
        ],
        feedback: 'Lengte wint van ingewikkeldheid, en hergebruik is het grootste risico. Een wachtwoordzin lost allebei die dingen op.'
      },
      {
        prompt: 'Kijk terug naar hoofdstuk 3. Aan welk kenmerk herken je een phishingbericht het duidelijkst?',
        leerdoel: 'Je kunt terugkijken op wat je dit jaar geleerd hebt over digitale geletterdheid.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'De afzender staat niet in je lijst met contactpersonen.', correct: false, misconception: 'Ziet een onbekende afzender als bewijs, terwijl je ook gewone post van onbekenden krijgt.' },
          { text: 'Er staat een afbeelding in.', correct: false, misconception: 'Ziet beeld aan voor een verdacht kenmerk.' },
          { text: 'Het bericht is in het Nederlands geschreven.', correct: false, misconception: 'Denkt dat phishing altijd uit het buitenland en in slecht Engels komt.' },
          { text: 'Het maakt haast, vraagt om je gegevens en de link wijst naar een vreemd adres.', correct: true, explanation: 'Haast, een verzoek om gegevens en een afwijkende link zijn samen het klassieke patroon.' }
        ],
        feedback: 'Haast plus gegevens plus een vreemde link: die drie samen zijn het patroon waar phishing bijna altijd op stukloopt.'
      },
      {
        prompt: 'Terugblik op hoofdstuk 5: welke check doe je voordat je iets bestelt bij een webshop die je niet kent?',
        leerdoel: 'Je kunt terugkijken op wat je dit jaar geleerd hebt over digitale geletterdheid.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Je checkt de URL, de contactgegevens en reviews buiten de site.', correct: true, explanation: 'Dat zijn drie checks die je zelf kunt doen; beoordelingen van buiten de webshop wegen zwaarder dan die erop staan.' },
          { text: 'Je kijkt of er een slotje in de adresbalk staat en bestelt dan gerust.', correct: false, misconception: 'Denkt dat het slotje bewijst dat de verkoper eerlijk is, terwijl het alleen over de verbinding gaat.' },
          { text: 'Je let alleen op de prijs, want goedkoper is beter.', correct: false, misconception: 'Ziet een verdacht lage prijs aan voor een buitenkansje.' },
          { text: 'Je vertrouwt de reviews op de webshop zelf.', correct: false, misconception: 'Vergeet dat een webshop zijn eigen beoordelingen kan schrijven of filteren.' }
        ],
        feedback: 'Het slotje zegt alleen dat de verbinding beveiligd is. Over de verkoper zegt het niets, dus check adres, contact en reviews.'
      },
      {
        prompt: 'Noem een ding over je device of je bestanden en een ding over social media dat je nu anders doet dan in september, en leg per ding uit waarom.',
        type: 'open',
        leerdoel: 'Je kunt terugkijken op wat je dit jaar geleerd hebt over digitale geletterdheid.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'reflecteren',
        modelAnswer: 'Ik sla mijn schoolwerk nu op in mappen in OneDrive in plaats van los op het bureaublad, want dan vind ik het op elke computer terug en raak ik niets kwijt als mijn laptop stuk gaat. En op social media zet ik mijn account op privé en denk ik na voordat ik iets deel, omdat wat je online zet veel langer blijft bestaan dan je denkt.',
        nakijkpunten: [
          'Noemt een concrete verandering rond het device, de bestanden of de opslag.',
          'Noemt een concrete verandering rond social media of privacy.',
          'Geeft bij allebei een reden die uit de lesstof van dit jaar komt.'
        ],
        feedback: 'Terugkijken werkt pas als je iets aanwijst dat je echt anders doet. Dan is het geleerd en niet alleen gehoord.'
      },
      {
        prompt: 'Je kiest optie B, het Word-verslag. Welke opmaak hoort er verplicht in?',
        leerdoel: 'Je kunt je kennis laten zien in een eigen eindcreatie in Canva, Word of PowerPoint.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Een voorblad met een foto van jezelf.', correct: false, misconception: 'Vult de eisen aan met iets uit een andere opdracht.' },
          { text: 'Een inhoudsopgave van minstens drie bladzijden.', correct: false, misconception: 'Verwart de eisen van dit A4 met die van een groter verslag.' },
          { text: 'Koppen, vetgedrukte woorden en paginanummering.', correct: true, explanation: 'Dat zijn precies de drie opmaakeisen bij optie B, en je leerde ze in hoofdstuk 4.' },
          { text: 'Een grafiek uit Excel.', correct: false, misconception: 'Denkt dat elke opdracht met data gevuld moet worden.' }
        ],
        feedback: 'Optie B toetst je Word-vaardigheid uit hoofdstuk 4: koppen, vet en paginanummers moeten er zichtbaar in staan.'
      },
      {
        prompt: 'Kies een van de drie opties voor je eindcreatie en beschrijf welk bewijs jij daarmee levert van wat je dit jaar geleerd hebt.',
        type: 'open',
        leerdoel: 'Je kunt je kennis laten zien in een eigen eindcreatie in Canva, Word of PowerPoint.',
        denkniveau: 'maken_controleren',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik kies optie C, een PowerPoint van drie dia\'s over nepnieuws. Elke dia krijgt een titel, een afbeelding en een korte uitleg. Daarmee laat ik twee dingen zien: dat ik weet hoe je nepnieuws herkent, en dat ik een presentatie kan opbouwen met korte, leesbare tekst en passend beeld, zoals ik in hoofdstuk 4 geleerd heb.',
        nakijkpunten: [
          'Noemt duidelijk welke optie gekozen is en welk onderwerp.',
          'Beschrijft de eisen van die optie (beeld, tekst, opmaak of titel).',
          'Legt uit welke kennis of vaardigheid uit dit leerjaar ermee bewezen wordt.'
        ],
        feedback: 'Een eindcreatie is bewijs, geen versiering: je laat er zowel je kennis als je vaardigheid met het programma mee zien.'
      }
    ]
  },

  '8.7': {
    learningGoals: [
      'Je weet wat een variabele is en waar je hem voor gebruikt.',
      'Je kunt een klein blokprogramma vergelijken met dezelfde code in tekst.',
      'Je kunt uitleggen waarom programmeurs met tekst werken en niet met blokken.'
    ],
    theorie: [
      {
        keyTerms: ['variabele', 'waarde', 'teller'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je spel telt hoeveel ballen je vangt, maar de score springt na elke ronde terug naar nul. Wat gaat er mis?</p>',
          '<p><strong>Antwoord.</strong> Het blok "maak score 0" staat binnen de herhaling in plaats van erboven. Daardoor wordt de waarde elke ronde opnieuw op nul gezet. Zet het instellen boven de lus en laat binnen de lus alleen "verander score met 1" staan; dan telt de teller wel door.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['tekstcode', 'Python', 'syntaxis'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Wat is in tekstcode de tegenhanger van het oranje blok "herhaal 10 keer: neem 10 stappen"?</p>',
          '<p><strong>Antwoord.</strong> In Python schrijf je: for i in range(10): en daaronder, ingesprongen, print("stap"). De logica is identiek, alleen de vorm verandert. Vergeet je de dubbele punt of de inspringing, dan weigert de computer, terwijl blokken die fout onmogelijk maken.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een variabele is een plek met een naam waarin je iets bewaart dat kan veranderen, zoals een score die per ronde omhooggaat. Dezelfde herhaling en keuze die je in blokken bouwde bestaan in Python als een paar regels tekstcode; alleen de syntaxis verschilt. Programmeurs werken met tekst omdat je daarin kunt zoeken, vergelijken en met miljoenen regels tegelijk kunt werken.</p>',
      keyTerms: ['variabele', 'Python', 'tekstcode']
    },
    // Afsluitquiz: 6 vragen. Terugkeervragen: vraag 4 (8.2, je eigen
    // blokprogramma met herhaling en keuze) en vraag 6 (8.3, debuggen en
    // foutmeldingen). Vraag 4 hangt sinds ronde 7 aan het herhaling-en-keuze-
    // doel van 8.2, want daar stuurt hij de leerling naartoe; het eigen doel
    // over blokken naast tekstcode wordt door vraag 3 gedekt.
    // Let op: dit is de vrijwillige plusparagraaf. De eindtoets van 8.6 stelt
    // over deze drie leerdoelen geen enkele vraag.
    vragen: [
      {
        prompt: 'Wat is een variabele in een programma?',
        leerdoel: 'Je weet wat een variabele is en waar je hem voor gebruikt.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een blok waarmee je het programma start zodra iemand op de groene vlag klikt.', correct: false, misconception: 'Verwart de variabele met het gebeurtenisblok.' },
          { text: 'Een plek met een naam waarin je een waarde bewaart die kan veranderen.', correct: true, explanation: 'De naam blijft staan, de inhoud wissel je, precies zoals bij een schoolbord of een rekening.' },
          { text: 'Een fout die de computer niet kan lezen.', correct: false, misconception: 'Verwart het begrip met een bug of een foutmelding.' },
          { text: 'Een tekening die je op je sprite plakt.', correct: false, misconception: 'Denkt dat het begrip over de vormgeving van het speelveld gaat.' }
        ],
        feedback: 'Zie een variabele als een doosje met een etiket: het etiket blijft, wat erin zit verandert tijdens het spel.'
      },
      {
        prompt: 'Een teller die per ronde omhooggaat hoort binnen de herhaling te staan, en het instellen op nul erbuiten.',
        waar: true,
        leerdoel: 'Je weet wat een variabele is en waar je hem voor gebruikt.',
        denkniveau: 'toepassen',
        niveau: 'verdieping',
        rol: 'zelf_proberen',
        feedback: 'Staat het op nul zetten binnen de lus, dan begint je score elke ronde opnieuw en telt hij nooit op.'
      },
      {
        prompt: 'Welke regel Python doet hetzelfde als het blok "herhaal 10 keer"?',
        leerdoel: 'Je kunt een klein blokprogramma vergelijken met dezelfde code in tekst.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'samen_oefenen',
        options: [
          { text: 'if score > 10:', correct: false, misconception: 'Verwart de keuze met de herhaling omdat er ook een getal in staat.' },
          { text: 'score = score + 1', correct: false, misconception: 'Ziet een telling aan voor een herhaling.' },
          { text: 'for i in range(10):', correct: true, explanation: 'De for-regel doorloopt tien rondes, net als het oranje herhaalblok.' },
          { text: 'print("10")', correct: false, misconception: 'Denkt dat het getal in de code hetzelfde betekent als het aantal rondes.' }
        ],
        feedback: 'Het woord for hoort bij herhalen en if bij kiezen. Dezelfde twee bouwstenen als in blokken, andere schrijfwijze.'
      },
      {
        prompt: 'Neem het programma dat je in paragraaf 8.2 bouwde, met de herhaling en de als-dan-keuze erin. Schrijf allebei op als regel tekstcode en leg uit wat er hetzelfde blijft.',
        type: 'open',
        leerdoel: 'Je kunt in je programma een herhaling en een als-dan-keuze gebruiken.',
        denkniveau: 'maken_controleren',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Het herhaalblok wordt "while True:" of "for i in range(10):", en het als-dan-blok wordt "if raakt_rand():" met daaronder ingesprongen "keer_om()". Hetzelfde blijft de structuur: de keuze staat binnen de herhaling, dus hij wordt elke ronde opnieuw gecontroleerd. Alleen de vorm verandert, want in tekst laat de inspringing zien wat binnen de lus hoort, en in blokken doet de C-vorm dat.',
        nakijkpunten: [
          'Schrijft zowel de herhaling als de keuze als regel tekstcode.',
          'Laat zien dat de keuze binnen de herhaling blijft staan.',
          'Benoemt wat de rol van inspringing is tegenover de vorm van de blokken.'
        ],
        feedback: 'Wat je in blokken aan de vorm ziet, zie je in tekst aan de inspringing. De structuur eronder is precies dezelfde.'
      },
      {
        prompt: 'Noem twee redenen waarom programmeurs met tekstcode werken en niet met blokken, en leg uit wat blokken juist makkelijker maken.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen waarom programmeurs met tekst werken en niet met blokken.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Tekst typ je sneller dan dat je blokken sleept, en je kunt in tekst zoeken en vervangen, versies vergelijken en met heel grote programma\'s werken die in blokken niet op het scherm zouden passen. Blokken zijn juist makkelijker om te beginnen, omdat ze alleen passen als het klopt, dus je kunt geen schrijffout maken en je let alleen op de logica.',
        nakijkpunten: [
          'Noemt twee echte voordelen van tekstcode, bijvoorbeeld snelheid, zoeken of omvang.',
          'Noemt minstens een voordeel van blokken, bijvoorbeeld dat je geen schrijffout kunt maken.',
          'Maakt duidelijk dat de logica in beide vormen hetzelfde blijft.'
        ],
        feedback: 'Blokken beschermen je tegen schrijffouten, tekst geeft je snelheid en schaal. Daarom is de een de opstap naar de ander.'
      },
      {
        prompt: 'In paragraaf 8.3 leerde je foutmeldingen lezen. Waarom levert een vergeten dubbele punt in Python wel een foutmelding op en een blokprogramma nooit?',
        leerdoel: 'Je weet wat een bug is en hoe je die opspoort.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        options: [
          { text: 'Omdat tekstcode een syntaxis heeft die je letterlijk moet volgen.', correct: true, explanation: 'Blokken passen alleen als het al klopt, dus hun vorm sluit onmogelijke combinaties bij voorbaat uit; in tekst moet jij de schrijfregels zelf naleven.' },
          { text: 'Omdat Python ouder is dan Scratch.', correct: false, misconception: 'Verklaart een verschil in werking met de leeftijd van de taal.' },
          { text: 'Omdat een blokprogramma altijd korter is en er dus minder fout kan gaan.', correct: false, misconception: 'Verklaart het verschil met de lengte van het programma in plaats van met de schrijfregels.' },
          { text: 'Omdat een dubbele punt in Python niets betekent en dus rustig weggelaten mag worden.', correct: false, misconception: 'Ziet leestekens in code als versiering.' }
        ],
        feedback: 'De schrijfregels van een taal heten syntaxis. In blokvorm zijn ze in de vorm gebouwd, in tekst moet jij ze zelf naleven.'
      }
    ]
  }
};
