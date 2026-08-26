// Verrijkingslaag hoofdstuk 6 - Mediawijs: social media, welzijn en betrouwbaar
// nieuws. Theoretische leerweg (tl).
//
// Zie scripts/seed-verrijking/PATROON.md voor het formaat van een vraag, de
// regels over afleiders en de eisen aan feedback.
//
// Opzet per paragraaf, volgens de blauwdruk:
//   - elk leerdoel heeft zijn eigen startvraag; die staan als `checks` in
//     scripts/seed-structuur/tl/h6.mjs, met antwoord en uitleg erbij, zodat de
//     Digidocent op dat blok uitgaat en de uitleg pas na het antwoord komt.
//     6.1 opent daarnaast met vier voorkennisvragen over hoofdstuk 5;
//   - elk theorieblok heeft een uitgewerkt voorbeeld (vraag + volledige
//     uitwerking) dat vóór het oefenblok, de praktijkopdracht en de afsluitquiz
//     komt;
//   - elke afsluitquiz heeft TWEE terugkeervragen uit eerdere stof. Dat is de
//     spreiding, en die loopt over hoofdstukgrenzen heen: 6.1 kijkt terug op
//     hoofdstuk 5, 6.3 op hoofdstuk 3, en de latere paragrafen op hoofdstuk 5
//     en op eerdere paragrafen van dit hoofdstuk;
//   - de hoofdstuktoets 6.7 raakt elk leerdoel van 6.1 t/m 6.6 en de twee eigen
//     doelen van het checkpoint MINSTENS TWEE KEER, en stelt daarnaast vier
//     vragen over hoofdstuk 5, precies zoals de eigen theorietekst aankondigt.
//     De bron-eindtoets van les 15 gaat immers over les 9 t/m 14;
//   - 6.8 is de vrijwillige plusparagraaf. Hij heeft een eigen afsluitquiz,
//     maar de hoofdstuktoets stelt er nooit een vraag over.
//
// RONDE 2 - wat hier gerepareerd is
//   * 6.7 ging van 19 naar 47 vragen: elk leerdoel nu 2x of vaker, leerdoel
//     6.1-2 (het algoritme leert van klikken en kijken) was 0x en is nu 2x, en
//     er staan vier vragen over hoofdstuk 5 in.
//   * Elke quiz heeft er een tweede terugkeervraag bij gekregen; 6.1 en 6.8
//     hadden er nul en hebben er nu twee.
//   * Brononderdelen die ontbraken zijn nu ook bevraagd: strafbaar zijn na
//     iemand tot wanhoop drijven (les 12), rapporteren bij de app als het juiste
//     omstandergedrag (les 15), een bril door te vaak dichtbij kijken (les 15),
//     de koppeling slechte houding -> rug- en nekklachten (les 13), en de
//     begrippen filters en bewerkingen en influencer (les 15).
//   * Rollen: elke quiz heeft nu minstens één vraag op ik_doe_voor en één op
//     samen_oefenen, naast zelf_proberen, bewijs_leveren en reflecteren.
//   * LET OP over `niveau`: de taxonomie kent alleen basis, plus en verdieping
//     (src/lib/assessmentBlockUtils.js, ASSESSMENT_MASTERY_LEVELS). Er bestaat
//     geen waarde "steun"; die kant van stap 6 van de blauwdruk wordt daarom
//     ingevuld met de steunopgaven in het `oefenen`-blok van elke paragraaf,
//     niet met een label op een toetsvraag.
//
// RONDE 3 - wat hier gerepareerd is
//   * 6.7 ging van 53 terug naar 44 vragen. De dekking is nu exact: twee vragen
//     per verplicht leerdoel van 6.1 t/m 6.7 (20 x 2), plus de vier
//     terugblikvragen over hoofdstuk 5. Welke negen vragen eruit zijn en waar
//     die inhoud nog staat, is opgeschreven in de kop van
//     scripts/seed-structuur/tl/h6.mjs onder RONDE 3, punt 3.
//   * 6.7, lengte van het goede antwoord. Blind op de langste knop klikken gaf
//     22 van de 45 gesloten vragen goed (49 procent), tegen 12 tot 17 procent in
//     elk ander blok van dit hoofdstuk. Bij dertien vragen is de redengevende
//     bijzin daarom uit de antwoordoptie naar `explanation` verhuisd, en is een
//     afleider aangevuld. Nu is het 2 van de 36 (6 procent).
//   * 6.2, plaats van het goede antwoord. Van de 8 gesloten vragen stond het
//     goede antwoord er 5 keer op plek 1 (62,5 procent). De validator meet dit
//     alleen over de hele seed, dus per blok glipte het erdoor. Drie goede
//     antwoorden zijn verschoven en de stelling over druk voelen is een
//     niet-waar-stelling geworden; de verdeling is nu 1/4/3.
//   * 6.1, spreiding over de leerdoelen. Het leerdoel "wat is een algoritme" -
//     het kernbegrip van de paragraaf - hing in de afsluitquiz aan één vraag,
//     terwijl de andere twee er drie hadden. Er staat nu een tweede vraag bij,
//     over waarom een platform aan jouw kijktijd verdient. Dat is de alinea uit
//     theorieblok 1 die nergens anders bevraagd werd.
//   * 6.5 heeft er het klik-item van les 13 en les 15 bij: vier klasgenoten
//     achter hun laptop, kies degene met de slechte houding. Dat stond in ronde
//     2 alleen als kijkvraag bij een afbeelding en was dus niet na te kijken.
//   * 6.8, plaats van het goede antwoord: was 3/3 over twee plekken, is nu
//     2/3/1 over drie plekken.

export default {
  '6.1': {
    learningGoals: [
      'Je kunt uitleggen wat een algoritme op social media is.',
      'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.',
      'Je kunt een voordeel en een nadeel van algoritmes noemen.'
    ],
    theorie: [
      {
        // Het begrip 'algoritme' wordt in dit hoofdstuk overal gebruikt, maar
        // h7.1 (AI) en h8.1 (stappenplan) zetten het al vet en een kernbegrip
        // mag in hoogstens twee blokken staan. Vet staat hier daarom de
        // definitie zelf: een algoritme IS een computerregel.
        keyTerms: ['social media', 'computerregel', 'platform'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sem en Jaylin zitten naast elkaar in de klas en openen op hetzelfde moment dezelfde app. Sem krijgt alleen maar voetbalvideo\'s te zien, terwijl Jaylin de ene make-uptutorial na de andere voorgeschoteld krijgt. Hoe kan dat verschil zo groot zijn, terwijl ze allebei op hetzelfde wifi-netwerk van school zitten?</p>',
          '<p><strong>Antwoord.</strong> Het platform stelt geen vaste tijdlijn samen die alle gebruikers op dezelfde manier te zien krijgen. Voor elke gebruiker rekent het algoritme apart uit welk bericht waarschijnlijk de meeste aandacht vasthoudt. Sem heeft de afgelopen weken voetbalvideo\'s helemaal uitgekeken, en Jaylin heeft herhaaldelijk naar make-up gezocht. Het wifi-netwerk speelt daarbij geen enkele rol, want het gedrag van de gebruiker bepaalt de hele uitkomst. Er zijn dus niet twee versies van de app, maar twee verschillende voorspellingen over twee verschillende mensen.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['kijktijd', 'voorkeuren', 'trending'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Fatima likt een filmpje over een hond en swipet het daarna binnen twee seconden weg. Even later kijkt ze een filmpje over skaten drie keer helemaal uit, zonder het ook maar te liken. Waarover krijgt ze morgen meer te zien, en waarom weegt het systeem die twee handelingen verschillend?</p>',
          '<p><strong>Antwoord.</strong> Over skaten, en het verschil zit in de moeite die elke handeling haar gekost heeft. Een like is één tik die bijna geen tijd kost, maar drie keer helemaal uitkijken kost echte minuten. Kijktijd weegt daarom zwaarder in de berekening dan een like of een snelle reactie eronder. Het wegswipen van de hondenvideo is bovendien een negatief signaal, dus dat onderwerp zakt juist weg. Zo bouwt het systeem haar voorkeuren op uit haar gedrag, en niet uit wat zij zegt leuk te vinden.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Social media laten je niet alles zien: een algoritme kiest per persoon wat er in de tijdlijn komt. Het leert dat uit jouw kijktijd, je klikken en je zoekopdrachten, en het bouwt daaruit een lijst met jouw voorkeuren op. Dat is handig, omdat je sneller vindt wat bij je past, maar het is riskant, omdat je steeds minder ander nieuws en andere meningen tegenkomt. Wat trending heet, is daardoor voor een deel het gevolg van de keuze van het systeem zelf.</p>',
      // 'algoritme' staat alleen in theorieblok 1 van deze paragraaf; h7 en h8
      // gebruiken hetzelfde begrip, en een kernbegrip mag in hoogstens twee
      // blokken vet staan.
      keyTerms: ['tijdlijn', 'trending']
    },
    vragen: [
      {
        prompt: 'Wat is een algoritme op social media?',
        leerdoel: 'Je kunt uitleggen wat een algoritme op social media is.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Een medewerker van het platform die elke dag kiest welke berichten populair worden.', correct: false, misconception: 'Denkt dat er mensen achter zitten die de tijdlijn met de hand samenstellen.' },
          { text: 'Een computerregel die uit jouw gedrag berekent welke berichten jij te zien krijgt.', correct: true, explanation: 'Het algoritme is een rekenregel die voorspelt waar jij naar blijft kijken.' },
          { text: 'Een instelling die jij zelf aanzet als je meer video\'s over één onderwerp wilt.', correct: false, misconception: 'Denkt dat personalisatie een knop is die je zelf bedient.' },
          { text: 'Een filter dat ongepaste berichten van het platform verwijdert.', correct: false, misconception: 'Verwart aanbevelen met het weghalen van berichten die niet mogen.' }
        ],
        feedback: 'Een algoritme is geen mens en geen knop, maar een rekenregel die voorspelt waar jij naar blijft kijken.'
      },
      {
        prompt: 'Waarom bouwt een platform een algoritme dat jouw aandacht zo lang mogelijk vasthoudt?',
        leerdoel: 'Je kunt uitleggen wat een algoritme op social media is.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Omdat je per minuut kijken een klein bedrag aan het platform betaalt.', correct: false, misconception: 'Denkt dat een gratis app op de een of andere manier per gebruiker afrekent.' },
          { text: 'Omdat het platform jouw filmpjes daarna aan andere gebruikers doorverkoopt.', correct: false, misconception: 'Denkt dat de inhoud van gebruikers zelf het handelswaar is.' },
          { text: 'Omdat het algoritme alleen werkt bij mensen met een betaald account.', correct: false, misconception: 'Denkt dat personalisatie een extraatje is waarvoor je moet betalen.' },
          { text: 'Omdat je dan langer blijft en meer advertenties ziet.', correct: true, explanation: 'Advertenties zijn het verdienmodel, en langer blijven betekent simpelweg meer advertenties.' }
        ],
        feedback: 'Aandacht is hier het product: hoe langer jij blijft, hoe meer advertenties het platform aan jou kwijt kan.'
      },
      {
        prompt: 'Het algoritme leert net zo goed van hoe lang jij naar een filmpje kijkt als van de dingen die je aanklikt.',
        waar: true,
        leerdoel: 'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Kijktijd is zelfs een sterker signaal dan een klik, want doorkijken kost jou echte aandacht en tijd.'
      },
      {
        prompt: 'Je zoekt één keer naar een blauwe trui. Waarom zie je daarna dagenlang truien voorbijkomen?',
        leerdoel: 'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat truien op dat moment toevallig trending zijn bij alle gebruikers tegelijk.', correct: false, misconception: 'Denkt dat iedereen dezelfde tijdlijn te zien krijgt.' },
          { text: 'Omdat webshops jouw telefoonnummer hebben gekocht en je daarom gericht benaderen.', correct: false, misconception: 'Denkt dat er altijd persoonsgegevens verkocht moeten zijn voordat je gerichte reclame ziet.' },
          { text: 'Omdat je zoekopdracht is opgeslagen en het systeem verwacht dat je nog wilt kopen.', correct: true, explanation: 'Zoeken is een sterk signaal van koopinteresse, dus het systeem herhaalt dat onderwerp.' }
        ],
        feedback: 'Eén zoekopdracht is voor het systeem een koopsignaal, en dat herhaalt het net zo lang tot jij stopt met reageren.'
      },
      {
        prompt: 'Noem één voordeel en één nadeel van algoritmes op social media, en leg bij het nadeel uit voor wie dat een probleem is.',
        type: 'open',
        leerdoel: 'Je kunt een voordeel en een nadeel van algoritmes noemen.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Een voordeel is dat ik sneller filmpjes en muziek vind die bij mij passen, want ik hoef minder te zoeken. Een nadeel is dat ik bijna alleen nog krijg wat ik al leuk vind, waardoor ik ander nieuws en andere meningen mis. Dat is vooral een probleem voor mijzelf, omdat ik ga denken dat iedereen erover denkt zoals ik.',
        nakijkpunten: [
          'Noemt een concreet voordeel, bijvoorbeeld sneller vinden wat past.',
          'Noemt een nadeel dat gaat over eenzijdig aanbod of te lang doorscrollen.',
          'Legt in eigen woorden uit voor wie dat nadeel een probleem is.'
        ],
        feedback: 'Een goed antwoord noemt niet alleen twee kanten, maar zegt er ook bij wie er last van heeft en waarom.'
      },
      {
        prompt: 'Waarom kan het algoritme meebepalen wat trending wordt?',
        leerdoel: 'Je kunt een voordeel en een nadeel van algoritmes noemen.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat het platform vooraf afspreekt welke video\'s die week populair moeten worden.', correct: false, misconception: 'Denkt dat trends van bovenaf worden ingepland door het bedrijf.' },
          { text: 'Omdat alleen betaalde video\'s in de tijdlijn van andere mensen terechtkomen.', correct: false, misconception: 'Verwart advertenties met aanbevolen video\'s.' },
          { text: 'Omdat een filmpje dat goed scoort daarna nog vaker getoond wordt.', correct: true, explanation: 'Vaker tonen levert meer weergaven op, en meer weergaven leveren weer vaker tonen op.' }
        ],
        feedback: 'Populair worden en veel getoond worden versterken elkaar; daarom kan een trend in een dag ontstaan.'
      },
      {
        prompt: 'Wat zijn social media precies?',
        leerdoel: 'Je kunt uitleggen wat een algoritme op social media is.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Alle websites waarop je spullen kunt kopen, verkopen of ruilen met anderen.', correct: false, misconception: 'Verwart social media met webshops en marktplaatsen.' },
          { text: 'De programma\'s waarmee je op je laptop teksten, tabellen en presentaties maakt.', correct: false, misconception: 'Verwart social media met kantoorsoftware zoals Word en PowerPoint.' },
          { text: 'Nieuwssites zoals de NOS, waar alleen redacteuren de berichten mogen schrijven.', correct: false, misconception: 'Denkt dat social media hetzelfde is als online nieuws lezen.' },
          { text: 'Apps en sites waar gebruikers zelf berichten, foto\'s en video\'s delen.', correct: true, explanation: 'De gebruikers maken de inhoud zelf; daarom staat er sociaal in het woord.' }
        ],
        feedback: 'Bij social media komt de inhoud van de gebruikers en niet van een redactie, en dat geeft het algoritme juist zoveel werk.'
      },
      {
        prompt: 'In hoofdstuk 5 leerde je over normen, waarden en gedragsregels. Welke zin is een gedragsregel en geen waarde?',
        leerdoel: 'Je weet wat normen en waarden zijn en hoe ze online gelden.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Eerlijkheid vind ik belangrijk in alles wat ik doe.', correct: false, misconception: 'Ziet elke uitspraak over goed gedrag aan voor een regel.' },
          { text: 'Je scheldt niemand uit in een groepsapp.', correct: true, explanation: 'Een gedragsregel zegt wat je concreet wel of niet doet, en dat is na te kijken.' },
          { text: 'Respect voor anderen hoort bij mij.', correct: false, misconception: 'Verwart een waarde, dus wat je belangrijk vindt, met de regel die daaruit volgt.' }
        ],
        feedback: 'Een waarde zit vanbinnen; een gedragsregel is de afspraak die eruit volgt en die je kunt controleren.'
      },
      {
        prompt: 'In hoofdstuk 5 zette je je account op privé. Wat verandert daardoor wél en wat niet voor het algoritme?',
        leerdoel: 'Je kunt je account op privé zetten en je bio veilig invullen.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        options: [
          { text: 'Privé bepaalt wie je berichten ziet; het algoritme meet gewoon door.', correct: true, explanation: 'Privacy-instellingen gaan over anderen; jouw eigen klikken en kijktijd blijven signalen.' },
          { text: 'Op privé verzamelt de app helemaal geen gegevens meer over jouw kijkgedrag.', correct: false, misconception: 'Denkt dat een privé-account ook de meting van je eigen gedrag stopzet.' },
          { text: 'Op privé krijg je precies dezelfde tijdlijn als iedereen die niet is ingelogd.', correct: false, misconception: 'Denkt dat privé hetzelfde is als uitgelogd zoeken.' }
        ],
        feedback: 'Privé zetten beschermt wie er meekijkt, maar het maakt jou voor het aanbevelingssysteem niet onzichtbaar.'
      },
      {
        prompt: 'Bedenk een kleine proef waarmee je zelf kunt aantonen dat het algoritme van jouw gedrag leert. Beschrijf wat je drie dagen doet, wat je vooraf verwacht en waaraan je achteraf ziet of je verwachting klopte.',
        type: 'open',
        leerdoel: 'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.',
        denkniveau: 'maken_controleren',
        niveau: 'verdieping',
        rol: 'zelf_proberen',
        modelAnswer: 'Ik kies één onderwerp waar ik normaal nooit naar kijk, bijvoorbeeld hardlopen. Drie avonden lang kijk ik elke hardloopvideo helemaal uit en swipe ik niets weg. Vooraf verwacht ik dat er op dag drie meer sportvideo\'s in mijn tijdlijn staan dan nu. Om dat te kunnen nakijken schrijf ik vandaag op waarover mijn eerste tien items gaan. Op dag vier tel ik opnieuw de eerste tien items en vergelijk ik die twee lijstjes. Staan er meer hardloopvideo\'s bij, dan klopt mijn verwachting en heeft het systeem van mijn kijktijd geleerd.',
        nakijkpunten: [
          'Er staat een meetbare verwachting in die vooraf is opgeschreven, niet pas achteraf.',
          'Er is een beginmeting én een eindmeting, zodat er echt iets te vergelijken valt.',
          'Het gekozen gedrag is een sterk signaal, bijvoorbeeld helemaal uitkijken of zoeken.'
        ],
        feedback: 'Een proef is pas bewijs als je vooraf opschrijft wat je verwacht; anders praat je achteraf elke uitkomst goed.'
      },
      {
        prompt: 'Twee klasgenoten openen naast elkaar dezelfde app en zien een totaal andere tijdlijn. Leg uit waarom datzelfde verschil tegelijk een voordeel en een nadeel is.',
        type: 'open',
        leerdoel: 'Je kunt een voordeel en een nadeel van algoritmes noemen.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'samen_oefenen',
        modelAnswer: 'Het verschil ontstaat doordat het algoritme voor elke persoon apart berekent wat de aandacht vasthoudt. Het voordeel is dat allebei sneller vinden wat bij hen past, want ze hoeven bijna niet te zoeken. Het nadeel is dat ze steeds minder dezelfde dingen zien en dus ook minder dezelfde meningen tegenkomen. Als je alleen nog krijgt wat je al leuk vindt, ga je denken dat iedereen erover denkt zoals jij. Precies wat het handig maakt, maakt het dus ook smal.',
        nakijkpunten: [
          'Het voordeel en het nadeel worden allebei aan dezelfde oorzaak gekoppeld: persoonlijke berekening.',
          'Er staat bij wat het nadeel praktisch betekent, bijvoorbeeld minder andere meningen tegenkomen.'
        ],
        feedback: 'Sterk antwoord als je ziet dat voordeel en nadeel hier één en dezelfde eigenschap zijn, van twee kanten bekeken.'
      }
    ]
  },

  '6.2': {
    learningGoals: [
      'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.',
      'Je weet wat het highlight reel-effect en een filterbubbel zijn.',
      'Je kunt twee dingen noemen die jij kunt doen om positiever met social media om te gaan.'
    ],
    theorie: [
      {
        keyTerms: ['FOMO', 'druk', 'zelfbeeld'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Mila ziet op social media dat haar klas zonder haar naar de kermis is geweest. Die avond kijkt ze wel twintig keer of er nieuwe verhalen zijn bijgekomen. De volgende dag koopt ze precies dezelfde schoenen als drie klasgenoten uit die groep. Welk stuk van haar gedrag is FOMO, en welk stuk is druk voelen?</p>',
          '<p><strong>Antwoord.</strong> Het steeds opnieuw kijken is FOMO: ze is bang iets te missen en zoekt telkens bevestiging. De schoenen zijn druk: niemand heeft gezegd dat het moet, maar ze doet mee omdat anderen het ook doen. Het verschil zit in de richting waarin het gevoel haar duwt, en dat maakt het goed herkenbaar. FOMO trekt haar naar het scherm toe, terwijl druk juist stuurt wat ze buiten dat scherm doet. Allebei raken ze haar zelfbeeld, want ze meet zichzelf af aan wat de groep doet en heeft.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['highlight reel-effect', 'sociale bevestiging', 'filterbubbel'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Een influencer post een foto op een strand met de tekst "gewoon een doordeweekse dag". Onder die foto staan op dat moment ruim 40.000 likes en een paar honderd reacties. Wat zie je hier van het highlight reel-effect, en wat zie je van sociale bevestiging?</p>',
          '<p><strong>Antwoord.</strong> Het highlight reel-effect zit in de foto zelf, want je ziet alleen de mooiste twee seconden van die dag. De uren reizen, het wachten op goed licht en de vijftig mislukte pogingen komen er nooit in. Sociale bevestiging zit in het getal eronder, en dat getal doet meer met je dan je zou denken. Vergelijk jij daarna jouw eigen foto met 12 likes, dan meet je jouw eigen waarde af aan een cijfer. Zie je vervolgens dagenlang alleen nog dit soort strandbeelden, dan zit je bovendien in een filterbubbel. Je aanbod is dan smaller geworden en bestaat nog maar uit één soort leven.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>FOMO is de angst om iets leuks of belangrijks te missen. Druk voelen betekent dat je iets doet omdat anderen het ook doen of van je verwachten. Doordat mensen alleen hun hoogtepunten posten en hun foto\'s bewerken, raakt je zelfbeeld vervormd en vergelijk je jezelf met een werkelijkheid die niet bestaat. Meldingen uitzetten, pauzes plannen en bewust andere accounts volgen zijn dingen die je daar zelf tegenover kunt zetten.</p>',
      keyTerms: ['FOMO', 'zelfbeeld']
    },
    vragen: [
      {
        prompt: 'Wat betekent FOMO?',
        leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Het gevoel dat je achteraf veel te veel tijd op je telefoon hebt doorgebracht en dat je daar spijt van hebt.', correct: false, misconception: 'Verwart spijt achteraf met de angst vooraf.' },
          { text: 'De wens om net zo veel volgers te krijgen als je vrienden hebben.', correct: false, misconception: 'Verwart FOMO met sociale bevestiging.' },
          { text: 'Het gevoel dat je iets belangrijks of leuks mist als je niet op social media kijkt.', correct: true, explanation: 'FOMO staat voor Fear Of Missing Out: de angst om iets te missen.' },
          { text: 'Een filter waarmee je je foto mooier maakt voordat je hem post.', correct: false, misconception: 'Denkt dat elke Engelse afkorting op social media over bewerken gaat.' }
        ],
        feedback: 'FOMO gaat over de angst vooraf: je kijkt omdat je bang bent iets te missen, niet omdat je iets zoekt.'
      },
      {
        prompt: 'Druk voelen betekent dat iemand jou letterlijk opdraagt om iets te doen.',
        waar: false,
        leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Druk werkt zonder dwang: niemand zegt hardop dat het moet, en toch doe je mee om erbij te horen.'
      },
      {
        prompt: 'Wat betekent het woord zelfbeeld?',
        leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Het idee dat jij over jezelf hebt: hoe jij denkt dat je bent.', correct: true, explanation: 'Het zit vanbinnen, en juist daarom kunnen bewerkte beelden van anderen het veranderen.' },
          { text: 'De profielfoto die op jouw social media-account staat ingesteld.', correct: false, misconception: 'Verwart het beeld dat je van jezelf hebt met het plaatje dat anderen zien.' },
          { text: 'Het aantal likes en volgers dat andere mensen aan jouw berichten geven.', correct: false, misconception: 'Denkt dat je zelfbeeld hetzelfde is als je score op social media.' }
        ],
        feedback: 'Je zelfbeeld is van jou, maar het highlight reel-effect schuift er ongemerkt andermans hoogtepunten voor.'
      },
      {
        prompt: 'Het highlight reel-effect betekent dat mensen online vooral hun mooiste momenten laten zien en de moeilijke weglaten.',
        waar: true,
        leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Je vergelijkt daardoor je hele dag met de beste tien seconden van iemand anders, en dat is nooit eerlijk.'
      },
      {
        prompt: 'Hoe ontstaat een filterbubbel op social media?',
        leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Doordat het platform jouw account afschermt zodra je te veel berichten meldt.', correct: false, misconception: 'Verwart een filterbubbel met een privacy-instelling of een straf van de app.' },
          { text: 'Doordat je steeds meer van dezelfde soort berichten te zien krijgt.', correct: true, explanation: 'Het aanbod wordt smaller, waardoor het lijkt alsof iedereen er hetzelfde over denkt.' },
          { text: 'Doordat je zelf een filter over je foto zet voordat je hem plaatst.', correct: false, misconception: 'Denkt dat een filterbubbel iets met fotofilters te maken heeft.' }
        ],
        feedback: 'Een filterbubbel is een smaller aanbod en geen instelling: hij groeit vanzelf uit wat jij aanklikt.'
      },
      {
        prompt: 'Wat wordt er bedoeld met filters en bewerkingen op foto\'s?',
        leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Instellingen waarmee je bepaalt wie jouw foto mag bekijken.', correct: false, misconception: 'Verwart bewerken met een privacy-instelling.' },
          { text: 'Een programma dat ongepaste foto\'s automatisch van het platform haalt.', correct: false, misconception: 'Verwart een fotofilter met de moderatie van een platform.' },
          { text: 'Aanpassingen aan foto\'s of video\'s om ze mooier of perfecter te laten lijken.', correct: true, explanation: 'Huid, kleur en vorm worden bijgewerkt, zodat je geen gewoon gezicht meer ziet.' },
          { text: 'De volgorde waarin het algoritme jouw foto\'s aan anderen laat zien.', correct: false, misconception: 'Haalt bewerken door elkaar met de werking van de tijdlijn.' }
        ],
        feedback: 'Wat je op zo\'n foto ziet is bewerkt beeld; daarom klopt de vergelijking met jouw eigen spiegelbeeld nooit.'
      },
      {
        prompt: 'Wat is een influencer?',
        leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Iemand die bij een platform werkt en bepaalt welke berichten trending worden.', correct: false, misconception: 'Verwart een influencer met een medewerker van het platform.' },
          { text: 'Iemand die alleen maar meekijkt en zelf nooit iets post.', correct: false, misconception: 'Denkt dat een influencer een passieve gebruiker is.' },
          { text: 'Iemand met veel volgers die anderen beïnvloedt met wat hij deelt.', correct: true, explanation: 'Het gaat om bereik plus invloed op wat volgers denken, kopen of doen.' }
        ],
        feedback: 'Een influencer verdient vaak aan die invloed, en juist daarom zie je van hem of haar bijna alleen hoogtepunten.'
      },
      {
        prompt: 'Noem twee dingen die jij zelf kunt doen om positiever met social media om te gaan, en leg per ding uit wat er dan verandert.',
        type: 'open',
        leerdoel: 'Je kunt twee dingen noemen die jij kunt doen om positiever met social media om te gaan.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik zet mijn meldingen uit, zodat ik niet steeds word teruggetrokken naar mijn telefoon en zelf kies wanneer ik kijk. Daarnaast plan ik een social media-pauze van een dag en volg ik bewust een paar positieve accounts, zodat ik minder beelden zie waarmee ik mezelf ga vergelijken.',
        nakijkpunten: [
          'Noemt twee maatregelen uit de paragraaf of een eigen variant daarop.',
          'Legt per maatregel uit welk effect die op het eigen gevoel of gedrag heeft.',
          'Schrijft in eigen woorden en in hele zinnen.'
        ],
        feedback: 'Twee maatregelen noemen is de helft; het antwoord wordt pas sterk als je erbij zet wat er dan verandert.'
      },
      {
        prompt: 'In paragraaf 6.1 leerde je hoe het algoritme jou leert kennen. Welk verband is er tussen dat algoritme en een filterbubbel?',
        leerdoel: 'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        options: [
          { text: 'Er is geen verband: het algoritme kijkt alleen naar wat nieuw is, niet naar wat jij eerder deed.', correct: false, misconception: 'Denkt dat de tijdlijn nog steeds op volgorde van tijd staat.' },
          { text: 'Het algoritme kiest meer van wat je al leuk vond, en dat maakt je aanbod smaller.', correct: true, explanation: 'De bubbel is de uitkomst van dezelfde voorspelling die je tijdlijn vult.' },
          { text: 'Het algoritme maakt alleen bubbels bij mensen die hun account op privé hebben staan.', correct: false, misconception: 'Verwart de zichtbaarheid van je account met wat jij zelf te zien krijgt.' }
        ],
        feedback: 'De filterbubbel is geen los verschijnsel: hij is het gevolg van het algoritme uit de vorige paragraaf.'
      },
      {
        prompt: 'In hoofdstuk 5 leerde je gedragsregels voor online. Welke gedragsregel helpt het best tegen de druk om mee te doen aan een challenge?',
        leerdoel: 'Je kunt drie gedragsregels noemen die online belangrijk zijn.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Ik post pas iets als ik zeker weet dat het veel likes krijgt.', correct: false, misconception: 'Maakt de druk juist groter door de groep de norm te laten bepalen.' },
          { text: 'Ik doe online alleen dingen waar ik in het echt ook achter zou staan.', correct: true, explanation: 'Deze regel geeft je een eigen maatstaf, los van wat de groep op dat moment doet.' },
          { text: 'Ik kijk eerst wat de meesten in de groepsapp doen en ik volg dan gewoon die keuze.', correct: false, misconception: 'Verwart een gedragsregel met meebewegen met de meerderheid.' }
        ],
        feedback: 'Een gedragsregel werkt tegen druk omdat je hem vooraf hebt bedacht, en niet op het moment zelf hoeft te verzinnen.'
      },
      {
        prompt: 'FOMO en druk voelen lijken op elkaar, maar zijn niet hetzelfde. Leg het verschil uit en geef bij allebei een eigen voorbeeld uit je eigen week.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        modelAnswer: 'FOMO is de angst dat je iets leuks of belangrijks mist als je niet kijkt. Het gaat dus over informatie: je wilt weten wat er gebeurt. Druk voelen is het gevoel dat je iets móet doen omdat anderen het ook doen of van je verwachten. Dat gaat over gedrag: je doet iets mee. Mijn FOMO-voorbeeld: ik keek zaterdagavond elk half uur of er iets nieuws in de groepsapp stond. Mijn druk-voorbeeld: iedereen deed een challenge en ik deed mee terwijl ik het eigenlijk stom vond.',
        nakijkpunten: [
          'Het verschil informatie missen tegenover iets moeten doen wordt echt benoemd.',
          'Er staan twee eigen voorbeelden in, één per begrip, en niet twee keer hetzelfde soort situatie.'
        ],
        feedback: 'Bij FOMO ben je bang dat je iets mist; bij druk doe je iets mee. Dat onderscheid maakt je antwoord scherp.'
      },
      {
        prompt: 'Leg uit hoe het algoritme uit paragraaf 6.1 het highlight reel-effect versterkt, en beschrijf wat er daardoor in een filterbubbel met jouw idee van normaal gebeurt.',
        type: 'open',
        leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'samen_oefenen',
        modelAnswer: 'Het highlight reel-effect is dat mensen alleen hun mooiste momenten posten en de moeilijke weglaten. Die perfecte beelden krijgen veel kijktijd, en kijktijd is precies waar het algoritme op stuurt. Daarom toont het systeem juist die beelden vaker, en de gewone momenten steeds minder. Zo kom ik in een filterbubbel waarin bijna alles er perfect uitziet. Mijn idee van normaal schuift dan mee: ik ga geloven dat iedereen er zo uitziet en zo leeft. Terwijl ik in werkelijkheid een selectie zie die het systeem voor mij heeft uitgekozen.',
        nakijkpunten: [
          'De koppeling loopt via kijktijd: mooie beelden scoren, dus het systeem herhaalt ze.',
          'Er staat in dat de bubbel het beeld van normaal verschuift, niet alleen dat je hetzelfde ziet.',
          'De leerling verwijst naar wat in 6.1 over het algoritme is geleerd.'
        ],
        feedback: 'Het highlight reel en het algoritme versterken elkaar: het mooiste beeld wint de kijktijd en wordt daarom nog vaker getoond.'
      }
    ]
  },

  '6.3': {
    learningGoals: [
      'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.',
      'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.',
      'Je weet wat de woorden anoniem, omstander en reputatie betekenen.'
    ],
    theorie: [
      {
        keyTerms: ['cyberpesten', 'anoniem', 'nepaccount'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> In een game krijgt Youssef elke avond scheldberichten van een speler die zich Shadow noemt. Overdag hoort hij op school niets, en niemand in zijn klas merkt er iets van. Is dit toch cyberpesten, ook al weet niemand wie er achter de naam Shadow zit?</p>',
          '<p><strong>Antwoord.</strong> Ja, want het gaat om herhaald gemeen doen via een digitaal middel, en dat is precies cyberpesten. Dat de pester anoniem blijft, maakt het niet minder erg maar voor Youssef juist een stuk zwaarder. Hij weet namelijk niet wie het is, dus hij gaat straks ook zijn eigen klasgenoten wantrouwen. Het is bovendien een voorbeeld van pesten dat 24/7 doorgaat en nooit een pauze neemt. Het gebeurt thuis, in zijn eigen kamer, precies op het moment dat hij juist wilde ontspannen.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['slachtoffer', 'omstander', 'reputatie'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> In een klassenapp van 28 leerlingen wordt Lot om een foto uitgelachen door een paar klasgenoten. Twee leerlingen schrijven mee, drie zetten een lach-emoji eronder en 23 zeggen helemaal niets. Wie zijn in deze situatie de omstanders, en wat merken zij daar later zelf van?</p>',
          '<p><strong>Antwoord.</strong> De 23 die niets zeggen zijn omstanders: ze pesten niet mee, maar ze helpen ook niet. De drie met de emoji doen wel mee, want een reactie is voor Lot net zo zichtbaar als een woord. De omstanders merken het vaak pas later, in de vorm van spijt of een schuldgevoel, en soms in onzekerheid: wat als ik de volgende ben? De twee schrijvers riskeren straf, aangifte en een slechte reputatie, en Lot houdt er slapeloze nachten en buikpijn aan over.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Cyberpesten is pesten via internet, telefoon of andere digitale middelen, en het onderscheidt zich doordat het anoniem kan gebeuren en dag en nacht doorgaat. Het slachtoffer kan verdrietig, angstig of ziek worden, en de pester riskeert straf, aangifte en een slechte naam. De omstander blijft achter met spijt of een schuldgevoel. Wie het ziet gebeuren en niets doet, hoort er dus ook bij.</p>',
      // 'cyberpesten' staat al vet in 3.3 en in theorieblok 1 hierboven.
      keyTerms: ['omstander', 'slachtoffer']
    },
    vragen: [
      {
        prompt: 'Wat is het verschil tussen gewoon pesten en cyberpesten?',
        leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Er is geen verschil; het is precies hetzelfde met een ander woord ervoor.', correct: false, misconception: 'Denkt dat het middel niets uitmaakt voor hoe zwaar het pesten weegt.' },
          { text: 'Cyberpesten gaat via een scherm en kan dag en nacht doorgaan.', correct: true, explanation: 'Het gaat 24/7 door en de pester kan bovendien anoniem blijven.' },
          { text: 'Cyberpesten is minder erg, omdat je de ander niet in het echt tegenkomt.', correct: false, misconception: 'Denkt dat pijn via een scherm minder telt dan pijn op het schoolplein.' }
        ],
        feedback: 'Cyberpesten stopt niet bij de schooldeur, en dat het doorgaat tot in je slaapkamer maakt het juist zwaarder.'
      },
      {
        prompt: 'Welke situatie is een voorbeeld van cyberpesten?',
        leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Iemand laten struikelen op het schoolplein.', correct: false, misconception: 'Herkent pesten wel, maar ziet het digitale kenmerk over het hoofd.' },
          { text: 'Een leuke meme delen met je vrienden.', correct: false, misconception: 'Denkt dat elk grappig bericht in een groep al pesten kan zijn.' },
          { text: 'Iemand uitschelden in een groepsapp.', correct: true, explanation: 'Het gebeurt digitaal, is gericht op één persoon en anderen lezen mee.' },
          { text: 'Met iemand praten over zijn of haar gevoelens.', correct: false, misconception: 'Verwart een moeilijk gesprek met pestgedrag.' }
        ],
        feedback: 'Digitaal, gericht op één persoon en met publiek erbij: dat zijn de drie kenmerken die je hier terugziet.'
      },
      {
        prompt: 'Anoniem betekent dat niemand weet wie er achter een account zit.',
        waar: true,
        leerdoel: 'Je weet wat de woorden anoniem, omstander en reputatie betekenen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Achter een schuilnaam durven mensen verder te gaan, en juist dat maakt anoniem pesten zo hard.'
      },
      {
        prompt: 'Welk gevolg hoort bij de omstander?',
        leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Nablijven op school of een gesprek met de mentor en met je ouders als straf.', correct: false, misconception: 'Wisselt de gevolgen voor de pester om met die voor de omstander.' },
          { text: 'Spijt of een schuldgevoel, omdat hij het zag gebeuren en niets deed.', correct: true, explanation: 'Wie toekijkt en zwijgt, blijft achter met het gevoel dat hij had kunnen helpen.' },
          { text: 'Buikpijn en angst om naar school te gaan.', correct: false, misconception: 'Wisselt de gevolgen voor het slachtoffer om met die voor de omstander.' }
        ],
        feedback: 'Elke rol heeft eigen gevolgen; de omstander betaalt vooral achteraf, met spijt over wat hij niet deed.'
      },
      {
        prompt: 'Leg uit wat het woord reputatie betekent en waarom een pester daar zelf ook last van kan krijgen.',
        type: 'open',
        leerdoel: 'Je weet wat de woorden anoniem, omstander en reputatie betekenen.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Reputatie is hoe anderen over jou denken. Als bekend wordt dat iemand online pest, vinden klasgenoten hem minder aardig en vertrouwen ze hem minder. Die naam raak je niet snel kwijt, ook niet als je allang gestopt bent met pesten.',
        nakijkpunten: [
          'Geeft een juiste uitleg van het woord reputatie.',
          'Legt uit dat anderen de pester minder gaan vertrouwen of aardig vinden.',
          'Noemt dat dit gevolg langer duurt dan het pesten zelf.'
        ],
        feedback: 'Reputatie is het enige gevolg dat de pester zelf niet kan terugdraaien, want anderen bepalen die.'
      },
      {
        prompt: 'In paragraaf 6.2 las je over sociale bevestiging: je waarde afmeten aan likes. Waarom maakt dat cyberpesten extra hard?',
        leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        options: [
          { text: 'Omdat veel likes onder een pestbericht voelen als steun van de hele groep.', correct: true, explanation: 'Likes werken als publiek bewijs, ook onder een gemeen bericht.' },
          { text: 'Omdat likes ervoor zorgen dat het bericht automatisch bij de politie gemeld wordt.', correct: false, misconception: 'Denkt dat platforms zelf aangifte doen zodra iets veel reacties krijgt.' },
          { text: 'Omdat een pester zonder likes helemaal niet verder kan gaan met pesten.', correct: false, misconception: 'Denkt dat pesten vanzelf stopt als niemand reageert.' }
        ],
        feedback: 'Likes onder een gemeen bericht zijn geen bijzaak: ze maken het pesten in de ogen van het slachtoffer groepsbreed.'
      },
      {
        prompt: 'In hoofdstuk 3 leerde je over je digitale voetafdruk. Wat betekent die voor een screenshot van een pestbericht?',
        leerdoel: 'Je weet dat wat je online zet veel langer blijft bestaan dan je denkt.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'samen_oefenen',
        options: [
          { text: 'Het bericht is definitief weg zodra de pester het in de app verwijdert.', correct: false, misconception: 'Denkt dat verwijderen in één app hetzelfde is als verdwijnen van internet.' },
          { text: 'Een screenshot blijft bestaan, ook nadat het originele bericht verwijderd is.', correct: true, explanation: 'Daarom is bewijs vastleggen zo belangrijk: het overleeft het wissen door de pester.' },
          { text: 'Screenshots mag je niet bewaren, omdat dat de privacy van de pester schendt.', correct: false, misconception: 'Denkt dat bewijs bewaren bij pesten verboden is.' }
        ],
        feedback: 'Dat online dingen blijven bestaan werkt hier in je voordeel: jouw screenshot is er nog als het bericht al gewist is.'
      },
      {
        prompt: 'Leg in je eigen woorden uit waarom cyberpesten volgens de bron extra heftig is vergeleken met pesten op het schoolplein. Noem daarbij twee voorbeelden van cyberpesten.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        modelAnswer: 'Pesten op het schoolplein stopt als je naar huis gaat, want dan zie je die mensen niet meer. Cyberpesten gebeurt via je telefoon en gaat dag en nacht door, ook als je thuis in je kamer zit. Er is dus geen plek meer waar je er even vanaf bent. Daar komt bij dat een bericht of foto in één minuut door honderd mensen gezien kan worden. Twee voorbeelden: iemand uitschelden in een groepsapp, en een nepaccount maken om iemand belachelijk te maken.',
        nakijkpunten: [
          'Het argument dag en nacht doorgaan of nooit een veilige plek staat er echt in.',
          'Er staan twee voorbeelden in die uit de bron komen, geen pesten in het echt.'
        ],
        feedback: 'Het beslissende verschil is dat cyberpesten met je meegaat naar huis; daarom weegt het vaak zwaarder dan pesten op het plein.'
      },
      {
        prompt: 'Vergelijk de gevolgen van cyberpesten voor het slachtoffer met die voor de omstander, en leg uit waarom een omstander toch niet buiten schot blijft.',
        type: 'open',
        leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'samen_oefenen',
        modelAnswer: 'Het slachtoffer voelt zich verdrietig of schaamt zich, wordt bang om naar school te gaan en kan lichamelijke klachten krijgen zoals slecht slapen, hoofdpijn of buikpijn. In het ergste geval wordt iemand somber of depressief. De omstander krijgt geen berichten binnen, maar draagt wel iets mee: veel omstanders krijgen later spijt of een schuldgevoel omdat ze niets deden. Ze worden ook onzeker en denken: wat als ik de volgende ben. Het verschil is dus dat de klachten van het slachtoffer van buitenaf komen en die van de omstander van binnenuit. Buiten schot blijf je niet, want wie zwijgt laat zien dat het gedrag geaccepteerd is.',
        nakijkpunten: [
          'Er worden bij het slachtoffer minstens twee gevolgen genoemd die uit de bron komen.',
          'Bij de omstander staan spijt of schuldgevoel én de onzekerheid wat als ik de volgende ben.',
          'Er staat een reden in waarom niets doen zelf ook gevolgen heeft.'
        ],
        feedback: 'Zwijgen is geen neutrale keuze: als niemand iets zegt, lijkt het alsof het gedrag mag. Dat maakt de omstander onderdeel van het probleem.'
      }
    ]
  },

  '6.4': {
    learningGoals: [
      'Je weet wat je kunt doen als je zelf gepest wordt.',
      'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.',
      'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.'
    ],
    theorie: [
      {
        keyTerms: ['screenshots', 'blokkeren', 'vertrouwenspersoon', 'aangifte'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Amir wordt al twee weken lang uitgescholden in een groepsapp met dertig klasgenoten erin. Hij wil de app meteen verwijderen, want dan is hij er in één klap vanaf. Waarom is dat toch niet de beste eerste stap, ook al voelt het als een oplossing?</p>',
          '<p><strong>Antwoord.</strong> Met de app verdwijnt ook zijn bewijs, terwijl het pesten gewoon doorgaat op een plek die hij niet meer ziet. De betere volgorde begint met stap één uit de theorie: praten met iemand die hij vertrouwt. Stap twee is screenshots maken van alle gemene berichten die er nu nog staan. Stap drie is de pesters blokkeren, zodat zij hem niets meer kunnen sturen en hij rust krijgt. Stap vier is het melden bij zijn mentor of bij de vertrouwenspersoon van school. Pas als dat allemaal gedaan is, kan hij besluiten om de app te verwijderen. Bewijs bewaren gaat bij cyberpesten dus altijd vóór opruimen, hoe graag je er ook vanaf wilt.</p>'
        ].join('\n')
      },
      {
        // 'anoniem' staat al vet in 5.2 en in 6.3; hier bolt 'klikken' het
        // verschil tussen melden en verraden.
        keyTerms: ['rapporteren', 'excuses', 'klikken'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sanne zette voor de grap een lach-emoji onder een gemene foto van een klasgenoot. De volgende dag heeft ze daar behoorlijk spijt van, want die klasgenoot zei niets meer terug. Wat kan ze nu nog doen om het een beetje goed te maken?</p>',
          '<p><strong>Antwoord.</strong> Er zijn drie dingen die ze kan doen, en de volgorde daarvan maakt echt uit. Eerst biedt ze haar excuses aan bij de klasgenoot en zegt ze eerlijk dat ze spijt heeft. Dat is moeilijk, maar het is de enige stap die het voor het slachtoffer echt anders maakt. Daarna verwijdert ze haar reactie, zodat ze met een daad laat zien dat ze het meent. Ten slotte laat ze merken dat ze ervan geleerd heeft door voortaan niet meer mee te doen. Ziet ze het bij een onbekende gebeuren, dan rapporteert ze het bericht gewoon bij de app zelf. Gaat het pesten in de groep toch door, dan kan er alsnog aangifte gedaan worden bij de politie.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Word je zelf gepest, dan praat je erover met iemand die je vertrouwt en bewaar je bewijs. Daarna blokkeer je de pester en meld je het bij je mentor of bij de vertrouwenspersoon. Zie je het bij iemand anders, dan negeer je het niet en stuur je privé een steunend berichtje. Daarna rapporteer je het bericht bij de app en meld je het op school; dat is helpen en geen klikken. Bij ernstig pesten kun je aangifte doen bij de politie, en wie iemand tot wanhoop drijft kan zelfs strafbaar zijn. Anoniem hulp vragen kan via Pestweb, de Kindertelefoon of hulplijn 113.</p>',
      keyTerms: ['vertrouwenspersoon', 'aangifte']
    },
    vragen: [
      {
        prompt: 'Je wordt al een week uitgescholden in een groepsapp. Wat is een verstandige eerste stap?',
        leerdoel: 'Je weet wat je kunt doen als je zelf gepest wordt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Terugschelden, zodat ze merken dat je je niet laat doen.', correct: false, misconception: 'Denkt dat terugvechten het pesten stopt in plaats van vergroot.' },
          { text: 'De app van je telefoon halen en er verder met niemand over praten.', correct: false, misconception: 'Denkt dat wegkijken hetzelfde is als oplossen.' },
          { text: 'Screenshots maken en het vertellen aan iemand die je vertrouwt.', correct: true, explanation: 'Je bewaart bewijs en je haalt het probleem weg uit je eentje.' },
          { text: 'Wachten tot het vanzelf overgaat, want dat gebeurt meestal.', correct: false, misconception: 'Gelooft dat online pesten uit zichzelf ophoudt als je niet reageert.' }
        ],
        feedback: 'Bewijs bewaren en het vertellen horen bij elkaar: zonder screenshots is het later jouw woord tegen dat van hen.'
      },
      {
        prompt: 'Iemand blokkeren zorgt ervoor dat die persoon jou geen berichten meer kan sturen en jouw profiel niet meer kan bekijken.',
        waar: true,
        leerdoel: 'Je weet wat je kunt doen als je zelf gepest wordt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Blokkeren lost het pesten niet op, maar het geeft je wel rust terwijl je hulp regelt op school.'
      },
      {
        prompt: 'Je ziet in een openbare reactie dat een onbekende wordt uitgescholden. Wat is dan de juiste actie?',
        leerdoel: 'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Je stuurt het bericht door naar je eigen vrienden, zodat zij ook zien wat er gebeurt.', correct: false, misconception: 'Denkt dat doorsturen waarschuwen is, terwijl het de pest juist verspreidt.' },
          { text: 'Je doet niets, want jij kent die persoon toch niet.', correct: false, misconception: 'Denkt dat je alleen iets hoeft te doen bij mensen die je kent.' },
          { text: 'Je maakt een screenshot en reageert er zelf ook plagend op.', correct: false, misconception: 'Verwart bewijs verzamelen met meedoen.' },
          { text: 'Je rapporteert het bericht bij de app of het platform.', correct: true, explanation: 'Rapporteren is het melden bij de makers van de app, zodat zij het bericht kunnen weghalen.' }
        ],
        feedback: 'Rapporteren werkt ook als je het slachtoffer niet kent: je meldt het bericht bij de app en die kan het weghalen.'
      },
      {
        prompt: 'Waarom is het melden van pesten bij een docent geen klikken?',
        leerdoel: 'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat een docent verplicht is de namen voor iedereen geheim te houden.', correct: false, misconception: 'Denkt dat het verschil in geheimhouding zit in plaats van in de bedoeling.' },
          { text: 'Omdat je het meldt om te helpen, niet om iemand te verraden.', correct: true, explanation: 'Het doel bepaalt het verschil: helpen tegenover verraden.' },
          { text: 'Omdat pesten pas telt als een docent het zelf heeft gezien.', correct: false, misconception: 'Denkt dat een melding zonder getuige niets waard is.' }
        ],
        feedback: 'Het verschil zit in je bedoeling: je meldt omdat iemand hulp nodig heeft, niet om iemand te pakken.'
      },
      {
        prompt: 'Wat betekent aangifte doen?',
        leerdoel: 'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een bericht rapporteren bij de app, zodat het platform het weghaalt.', correct: false, misconception: 'Verwart rapporteren binnen een app met een melding bij de politie.' },
          { text: 'Naar de politie gaan om te melden dat er iets ergs is gebeurd.', correct: true, explanation: 'Aangifte loopt via de politie en kan gevolgen hebben voor de pester.' },
          { text: 'Aan je mentor doorgeven dat je een dag niet naar school komt.', correct: false, misconception: 'Kent het woord niet en gokt op een gewone schoolmelding.' },
          { text: 'Anoniem chatten met de Kindertelefoon over wat er gebeurd is.', correct: false, misconception: 'Verwart anoniem hulp vragen met een officiële melding.' }
        ],
        feedback: 'Rapporteren in een app en aangifte doen bij de politie zijn twee verschillende stappen met verschillende gevolgen.'
      },
      {
        prompt: 'Iemand die een ander zo ernstig pest dat die persoon geen andere uitweg meer ziet, kan daarvoor strafbaar zijn.',
        waar: true,
        leerdoel: 'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Iemand tot wanhoop drijven is geen schoolzaak meer; daar kan de politie aan te pas komen, ook bij een anonieme pester.'
      },
      {
        prompt: 'Je ziet in de klassenapp dat iemand wordt uitgelachen. Beschrijf drie dingen die jij doet en leg bij elk uit waarom.',
        type: 'open',
        leerdoel: 'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik doe niet mee en ik lach ook niet mee, want dan lijkt het alsof ik het goedvind. Daarna stuur ik het slachtoffer privé een berichtje, bijvoorbeeld hé, gaat het, zodat hij zich minder alleen voelt. Tot slot rapporteer ik het bericht bij de app en meld ik het bij mijn mentor, want dat is helpen en geen klikken.',
        nakijkpunten: [
          'Noemt dat niets doen of meelachen het pesten juist bevestigt.',
          'Noemt steun geven aan het slachtoffer, bijvoorbeeld met een privébericht.',
          'Noemt melden bij een docent, mentor of vertrouwenspersoon, of rapporteren bij de app.'
        ],
        feedback: 'Drie kleine acties samen doen meer dan één grote: niet meedoen, steun geven en melden versterken elkaar.'
      },
      {
        prompt: 'In paragraaf 6.3 stond dat cyberpesten 24/7 doorgaat. Wat betekent dat voor de hulp die je zoekt?',
        leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        options: [
          { text: 'Dat je pas hulp kunt vragen als het pesten ook binnen de school gebeurt.', correct: false, misconception: 'Denkt dat school alleen iets doet bij pesten in het schoolgebouw.' },
          { text: 'Dat het slachtoffer thuis geen rustplek heeft, dus wachten helpt niet.', correct: true, explanation: 'Omdat het thuis doorgaat, is snel ingrijpen belangrijker dan afwachten.' },
          { text: 'Dat je het beste eerst een week wacht om te kijken of het vanzelf stopt.', correct: false, misconception: 'Denkt dat afwachten een veilige strategie is bij online pesten.' }
        ],
        feedback: 'Juist omdat het thuis doorgaat is uitstellen geen neutrale keuze; elke dag wachten is een dag zonder rust.'
      },
      {
        prompt: 'In hoofdstuk 5 leerde je een bericht te rapporteren. Waarin verschilt rapporteren van het melden bij je mentor?',
        leerdoel: 'Je weet hoe en waarom je een bericht rapporteert.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'samen_oefenen',
        options: [
          { text: 'Rapporteren gaat naar de makers van de app; melden bij je mentor gaat naar iemand op school.', correct: true, explanation: 'De twee gaan naar verschillende plekken en kunnen daarom allebei nodig zijn.' },
          { text: 'Rapporteren en melden zijn twee woorden voor precies dezelfde handeling.', correct: false, misconception: 'Denkt dat het onderscheid alleen een woordkwestie is.' },
          { text: 'Rapporteren mag alleen als je zelf het slachtoffer bent.', correct: false, misconception: 'Denkt dat je alleen je eigen zaken bij een platform mag melden.' }
        ],
        feedback: 'Doe ze allebei als het kan: de app kan het bericht weghalen, en school kan iets doen aan wat er in de klas gebeurt.'
      },
      {
        prompt: 'Zet de stappen die je zet als je zelf online gepest wordt in een logische volgorde. Leg daarbij uit waarom screenshots maken vóór blokkeren komt.',
        type: 'open',
        leerdoel: 'Je weet wat je kunt doen als je zelf gepest wordt.',
        denkniveau: 'maken_controleren',
        niveau: 'verdieping',
        rol: 'zelf_proberen',
        modelAnswer: 'Stap één is praten met iemand die ik vertrouw, bijvoorbeeld mijn ouders, mijn mentor of een goede vriend. Dan sta ik er meteen niet meer alleen voor en hoef ik het niet zelf op te lossen. Stap twee is screenshots maken van de gemene berichten, zodat ik bewijs heb. Stap drie is de pesters blokkeren, zodat ze mij niets meer kunnen sturen en ik rust krijg. Stap vier is het melden bij school, bij mijn mentor of de vertrouwenspersoon. Stap vijf is anoniem hulp vragen via pestweb.nl of kindertelefoon.nl, als ik liever mijn naam niet zeg. Screenshots maken komt vóór blokkeren, omdat ik na het blokkeren de berichten en het profiel vaak niet meer kan zien. Dan is mijn bewijs weg en kan ik niemand meer laten zien wat er precies is gebeurd.',
        nakijkpunten: [
          'De volgorde begint met praten met iemand die je vertrouwt, precies zoals stap één in de theorie.',
          'Bewijs vastleggen met screenshots staat vóór blokkeren, en melden bij school staat erachter.',
          'De reden voor die volgorde gaat over bewijs dat na het blokkeren niet meer te zien is.'
        ],
        feedback: 'De volgorde is hier de kern: wie eerst blokkeert, raakt vaak het bewijs kwijt dat hij later nodig heeft.'
      },
      {
        prompt: 'Leg het verschil uit tussen anoniem hulp vragen via Kindertelefoon of Pestweb en aangifte doen bij de politie. Beschrijf wanneer je voor welke stap kiest.',
        type: 'open',
        leerdoel: 'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'zelf_proberen',
        modelAnswer: 'Anoniem hulp vragen betekent dat je met iemand praat zonder te zeggen wie je bent, bijvoorbeeld via pestweb.nl of kindertelefoon.nl. Dat kies je als je vooral je verhaal kwijt wilt of niet weet wat je moet doen, en als je nog niet klaar bent voor een grote stap. Aangifte doen betekent dat je naar de politie gaat om te melden dat er iets ernstigs is gebeurd. Daarvoor moet je wel je naam geven en heb je bewijs nodig, zoals screenshots. Dat kies je als het pesten ernstig is, doorgaat of strafbaar wordt. De twee sluiten elkaar niet uit: je kunt eerst anoniem praten en daarna alsnog aangifte doen.',
        nakijkpunten: [
          'Anoniem wordt uitgelegd als je naam niet hoeven noemen, met minstens één van de twee sites erbij.',
          'Bij aangifte staat dat het bij de politie gebeurt en dat het over iets ernstigs of strafbaars gaat.',
          'Er staat een keuzemoment in: wanneer het een en wanneer het ander.'
        ],
        feedback: 'Anoniem praten is een lage drempel, aangifte een zware stap met bewijs. Het is geen of-of: het een kan naar het ander leiden.'
      }
    ]
  },

  '6.5': {
    learningGoals: [
      'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.',
      'Je kunt de 20-20-2 regel uitleggen en toepassen.',
      'Je weet waaraan je digitale verslaving bij jezelf kunt herkennen.'
    ],
    theorie: [
      {
        keyTerms: ['blauw licht', 'melatonine', 'houding', 'nachtmodus'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Bram zit elke avond twee uur onderuitgezakt op de bank te gamen met zijn laptop op schoot. Rond half twaalf legt hij zijn laptop pas weg en gaat hij meteen naar bed. Hij heeft daarna last van zijn nek en valt pas na ongeveer één uur in slaap. Welke twee oorzaken zie je hier, en welke oplossing hoort er bij elke oorzaak?</p>',
          '<p><strong>Antwoord.</strong> De nekklachten komen door zijn houding: met de laptop op schoot hangt zijn hoofd ver naar voren, waardoor er extra spanning op nek en rug komt. Het lastig inslapen komt door het blauw licht van zijn scherm, dat de aanmaak van melatonine remt. Twee klachten, twee verschillende oorzaken, dus twee verschillende oplossingen: de laptop op tafel en op ooghoogte, en het scherm een uur voor bedtijd wegleggen. Doet hij dit jaren achter elkaar, dan komt er nog iets bij: door zo vaak dichtbij te kijken kan hij op termijn een bril nodig hebben.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['20-20-2', 'digitale verslaving', 'prikkelbaar'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Nour maakt anderhalf uur achter elkaar huiswerk achter haar laptop op haar eigen kamer. Hoe past zij de 20-20-2 regel in dat anderhalve uur precies toe, en wat hoort daar juist niet bij?</p>',
          '<p><strong>Antwoord.</strong> Ze zet een timer op 20 minuten en legt die naast haar laptop, zodat ze hem zeker hoort. Gaat de timer af, dan kijkt ze 20 seconden naar iets op minstens 6 meter afstand. Dat kan de overkant van de straat zijn, of een boom die vanuit haar raam te zien is. Hoe vaak dat is, rekent ze uit met de regel delen door 20 en naar beneden afronden. Anderhalf uur is 90 minuten, en 90 gedeeld door 20 is vier hele blokken met 10 minuten over. Ze herhaalt die korte pauze dus vier keer, om 20, 40, 60 en 80 minuten, en samen kost haar dat nog geen twee minuten. De 2 uit de regel hoort niet bij die pauzes, maar bij haar hele dag buiten het huiswerk om. Het gaat om de 2 uur per dag die ze buiten probeert te zijn, verspreid over de hele dag. Even op haar telefoon kijken telt daarom niet als pauze, want dan kijkt ze opnieuw dichtbij en naar een scherm.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Te lang schermgebruik geeft rug- en nekklachten door een slechte houding. Van blauw licht krijg je droge ogen, hoofdpijn en slecht slapen. En wie jarenlang te vaak dichtbij kijkt, kan zelfs een bril nodig hebben. De 20-20-2 regel houdt daar rekening mee: na elke 20 minuten kijk je 20 seconden ver weg, en je bent elke dag minstens 2 uur buiten. Kun je bijna niet stoppen, word je rusteloos zonder telefoon en lijden school of je hobby\'s eronder, dan zijn dat de signalen van digitale verslaving. Voel je je moe of prikkelbaar, gebruik je schermen dan slimmer en bewuster in plaats van helemaal niet meer.</p>',
      keyTerms: ['houding', '20-20-2']
    },
    vragen: [
      {
        prompt: 'Wat is een goed voorbeeld van de 20-20-2 regel?',
        leerdoel: 'Je kunt de 20-20-2 regel uitleggen en toepassen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Elke 20 minuten even op je mobiel kijken.', correct: false, misconception: 'Leest de regel als een schema om juist wél naar een scherm te kijken.' },
          { text: 'Na 20 minuten je ogen 20 seconden dichtdoen en daarna gewoon verder werken.', correct: false, misconception: 'Denkt dat rust voor je ogen hetzelfde is als ver weg kijken.' },
          { text: 'Na 20 minuten 20 seconden ver weg kijken, en 2 uur per dag buiten zijn.', correct: true, explanation: 'Ver kijken ontspant je oogspieren en buitenlicht helpt je slaapritme.' },
          { text: '20 keer per minuut knipperen tijdens het werken.', correct: false, misconception: 'Onthoudt alleen het getal 20 en niet waar het voor staat.' }
        ],
        feedback: 'De drie getallen staan voor 20 minuten, 20 seconden ver weg en 2 uur buiten; alleen samen doen ze hun werk.'
      },
      {
        prompt: 'Welk gevolg hoort bij te veel blauw licht vlak voor het slapengaan?',
        leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Rug- en nekklachten, doordat je in een kromme houding zit te werken.', correct: false, misconception: 'Koppelt elk schermprobleem aan de houding.' },
          { text: 'Moeilijk in slaap komen, doordat melatonine geremd wordt.', correct: true, explanation: 'Melatonine maakt je slaperig, en blauw licht remt dat stofje af.' },
          { text: 'Minder aandacht voor school, familie en hobby\'s.', correct: false, misconception: 'Verwart het gevolg van blauw licht met het gevolg van verslaving.' }
        ],
        feedback: 'Blauw licht werkt op je slaapstofje melatonine; daarom lig je na een uur scrollen langer wakker.'
      },
      {
        prompt: 'Vier klasgenoten werken achter hun laptop. Bij wie zie je de slechte houding?',
        leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Sam heeft zijn laptop op schoot en zijn hoofd hangt ver naar voren.', correct: true, explanation: 'Zijn nek draagt dat hoofd de hele tijd vooruit, en juist daarvan krijg je rug- en nekklachten.' },
          { text: 'Noor zit rechtop, met haar scherm op ooghoogte en haar voeten plat op de grond.', correct: false, misconception: 'Ziet rechtop zitten aan voor stijf zitten en denkt dat dat ook slecht is.' },
          { text: 'Ilias zet zijn laptop op een stapel boeken en kijkt daardoor recht vooruit.', correct: false, misconception: 'Denkt dat een zelfgemaakt hulpmiddel de houding juist verslechtert.' },
          { text: 'Yara zit rechtop en kijkt elke twintig minuten even ver weg.', correct: false, misconception: 'Verwart de oogpauze uit de 20-20-2 regel met de oorzaak van rugklachten.' }
        ],
        feedback: 'Een laptop op schoot trekt je hoofd altijd omlaag; met je scherm op ooghoogte blijven nek en rug in een rechte lijn.'
      },
      {
        prompt: 'Wat is GEEN goed voorbeeld van gezond schermgebruik?',
        leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Rechtop zitten met beide voeten op de grond.', correct: false, misconception: 'Leest de vraag te snel en kiest het eerste gezonde gedrag dat langskomt.' },
          { text: 'Je scherm op ooghoogte zetten.', correct: false, misconception: 'Herkent de goede houding wel, maar mist het woordje GEEN in de vraag.' },
          { text: 'In bed TikTokken tot twee uur \'s nachts.', correct: true, explanation: 'Hier komen een slechte houding, blauw licht en te weinig slaap samen.' },
          { text: 'Na dertig minuten werken even pauze nemen.', correct: false, misconception: 'Denkt dat een pauze alleen telt als hij precies op 20 minuten valt.' }
        ],
        feedback: 'Let bij zo\'n vraag op het woordje GEEN; hier stapelen slechte houding, blauw licht en slaaptekort zich op.'
      },
      {
        prompt: 'Waarom kun je van jarenlang veel schermgebruik uiteindelijk een bril nodig hebben?',
        leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat het geluid van je telefoon je ogen vermoeit.', correct: false, misconception: 'Zoekt de oorzaak in een prikkel die niets met zien te maken heeft.' },
          { text: 'Omdat je ogen door een scherm minder traanvocht aanmaken en daardoor kleiner worden.', correct: false, misconception: 'Verwart droge ogen met een blijvende verandering van de oogvorm.' },
          { text: 'Omdat je dan te vaak dichtbij kijkt en je ogen bijna nooit op veraf hoeven scherpstellen.', correct: true, explanation: 'Daarom zit in de 20-20-2 regel juist dat je regelmatig ver weg moet kijken.' }
        ],
        feedback: 'Dichtbij kijken is de boosdoener, niet het scherm zelf; ver weg kijken is dus geen bijzaak maar de tegenmaatregel.'
      },
      {
        prompt: 'Veel op je telefoon zitten is meteen een digitale verslaving.',
        waar: false,
        leerdoel: 'Je weet waaraan je digitale verslaving bij jezelf kunt herkennen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Pas als je bijna niet kunt stoppen, onrustig wordt zonder telefoon en school of hobby\'s eronder lijden, spreek je van verslaving.'
      },
      {
        prompt: 'Beschrijf jouw eigen ochtend: wat pak je als eerste als je wakker wordt, en wat zegt dat volgens jou over je telefoongebruik?',
        type: 'open',
        leerdoel: 'Je weet waaraan je digitale verslaving bij jezelf kunt herkennen.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'reflecteren',
        modelAnswer: 'Ik pak meteen mijn telefoon om berichten te checken. Dat laat zien dat mijn telefoon een gewoonte is geworden en geen bewuste keuze meer. Een signaal van verslaving is dat ik onrustig word als ik hem niet kan pakken. Ik ga mijn telefoon daarom voortaan buiten mijn slaapkamer opladen.',
        nakijkpunten: [
          'Beschrijft eerlijk het eigen gedrag in de ochtend.',
          'Koppelt dat gedrag aan een kenmerk van digitale verslaving of aan gewoontevorming.',
          'Noemt een concrete verandering, of legt uit waarom die niet nodig is.'
        ],
        feedback: 'De eerste handeling van je dag verraadt je gewoonte; wie dat opschrijft, ziet zijn eigen patroon voor het eerst.'
      },
      {
        prompt: 'In paragraaf 6.2 leerde je over FOMO. Hoe hangt FOMO samen met te veel schermtijd?',
        leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        options: [
          { text: 'Ze staan los van elkaar: FOMO gaat over je gevoel en schermtijd gaat over je ogen.', correct: false, misconception: 'Scheidt het mentale en het lichamelijke deel van digitaal gezond zijn.' },
          { text: 'Doordat je bang bent iets te missen, blijf je langer kijken dan goed is.', correct: true, explanation: 'FOMO is de reden om door te scrollen; de klachten zijn het gevolg van die tijd.' },
          { text: 'FOMO zorgt ervoor dat je juist minder kijkt, omdat je bang wordt van het nieuws.', correct: false, misconception: 'Denkt dat angst altijd tot vermijden leidt in plaats van tot vaker kijken.' }
        ],
        feedback: 'FOMO is de motor onder je schermtijd; wie alleen op de klok let en niet op dat gevoel, houdt het niet vol.'
      },
      {
        prompt: 'In paragraaf 6.3 las je dat een slachtoffer van cyberpesten slecht slaapt en buikpijn krijgt. Wat is het verschil met de klachten uit deze paragraaf?',
        leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'samen_oefenen',
        options: [
          { text: 'Er is geen verschil, want slecht slapen heeft bij iedereen altijd dezelfde oorzaak.', correct: false, misconception: 'Kijkt alleen naar de klacht en niet naar wat hem veroorzaakt.' },
          { text: 'Bij pesten komt het door spanning; hier door houding en blauw licht.', correct: true, explanation: 'Dezelfde klacht kan een heel andere oorzaak hebben, en dus ook een andere oplossing.' },
          { text: 'Bij pesten zijn de klachten ingebeeld en hier zijn ze echt.', correct: false, misconception: 'Denkt dat klachten door spanning niet lichamelijk echt zijn.' }
        ],
        feedback: 'Nachtmodus helpt een gepest kind niet; kijk dus altijd eerst naar de oorzaak voordat je een maatregel kiest.'
      },
      {
        prompt: 'Je hebt vanmiddag twee uur huiswerk op je laptop. Maak een planning waarin de 20-20-2 regel echt past, en leg per onderdeel uit wat het voor je lichaam doet.',
        type: 'open',
        leerdoel: 'Je kunt de 20-20-2 regel uitleggen en toepassen.',
        denkniveau: 'maken_controleren',
        niveau: 'verdieping',
        rol: 'zelf_proberen',
        modelAnswer: 'Ik werk van 15.00 tot 17.00 uur, en dat is 120 minuten. Ik deel 120 door 20 en kom uit op zes volle blokken, dus zes oogpauzes. Mijn wekker gaat om 15.20, 15.40, 16.00, 16.20, 16.40 en 17.00 uur. Bij elke wekker kijk ik 20 seconden naar iets buiten op minstens 6 meter afstand. Die laatste van 17.00 uur valt precies op mijn eindtijd, en ik doe hem toch voordat ik mijn laptop dichtdoe. Ver kijken ontspant de spieren in mijn ogen, want die staan bij dichtbij kijken de hele tijd aangespannen. Zo krijg ik minder snel droge ogen en hoofdpijn. De 2 uit de regel plan ik apart: na 17.00 uur ga ik met de hond naar buiten, zodat ik aan mijn twee uur buitenlicht per dag kom. Buitenlicht helpt tegen bijziendheid en zorgt dat ik \'s avonds beter in slaap val.',
        nakijkpunten: [
          'De drie delen van de regel staan er alle drie in: 20 minuten, 20 seconden ver kijken, 2 uur buiten.',
          'Het aantal oogpauzes klopt met de rekenregel delen door 20 en naar beneden afronden: 120 gedeeld door 20 is zes.',
          'De 2 uur buiten wordt niet in de werktijd gepropt maar apart gepland, met per onderdeel een lichamelijk gevolg erbij.'
        ],
        feedback: 'De twee uur buiten is het deel dat het vaakst sneuvelt; die hoort niet in je werkblok maar ernaast, in je dag.'
      },
      {
        prompt: 'Leg uit waarom veel op je telefoon zitten nog geen digitale verslaving is. Noem drie signalen die er samen wél op wijzen.',
        type: 'open',
        leerdoel: 'Je weet waaraan je digitale verslaving bij jezelf kunt herkennen.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        modelAnswer: 'Veel schermtijd zegt op zichzelf weinig, want iemand kan zijn telefoon voor school, sport of contact gebruiken. Het gaat erom of het je dagelijks leven in de weg zit. Drie signalen die er samen op wijzen: je kunt bijna niet stoppen met je scherm gebruiken, je voelt je rusteloos of ongemakkelijk als je niet op je telefoon kunt, en je hebt minder aandacht voor school, familie of hobby\'s. Eén signaal is nog geen bewijs, maar alle drie tegelijk is een reden om kritisch naar je gedrag te kijken.',
        nakijkpunten: [
          'Er staat uitgelegd waarom het aantal uren alleen geen conclusie toelaat.',
          'De drie signalen uit de bron worden genoemd: niet kunnen stoppen, rusteloos zijn, minder aandacht voor school en anderen.'
        ],
        feedback: 'Niet de uren tellen, maar wat die uren verdringen. Pas als school, familie of hobby\'s eronder lijden, is het een signaal.'
      }
    ]
  },

  '6.6': {
    learningGoals: [
      'Je kunt drie kenmerken van nepnieuws noemen.',
      'Je weet wat een deepfake is en hoe die gemaakt wordt.',
      'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.'
    ],
    theorie: [
      {
        // 'bron' staat al vet in 1.4; het begrip zelf staat wel in de tekst.
        keyTerms: ['nepnieuws', 'clickbait', 'opvallende titel'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je ziet op TikTok deze kop: SCHOKKEND, bekende zanger in het geheim opgenomen, familie zwijgt. Eronder staat een korrelige foto en als afzender de naam nieuws-actueel24.info, zonder auteur erbij. Loop de drie kenmerken van nepnieuws één voor één langs en trek daarna zelf een conclusie.</p>',
          '<p><strong>Antwoord.</strong> Kenmerk één is de opvallende titel, en die is hier meteen raak met hoofdletters en een uitroepteken. Het woord schokkend staat er alleen om je te laten klikken, en dat noemen we clickbait. Kenmerk twee is de bron, en nieuws-actueel24.info is geen bekende nieuwssite zoals de NOS of het Jeugdjournaal. Er staat bovendien geen auteur bij, dus er is niemand die je op dit bericht kunt aanspreken. Kenmerk drie is de foto, want korrelig beeld wijst er vaak op dat een oude foto opnieuw gebruikt is. Alle drie de kenmerken kloppen hier, dus dit is hoogstwaarschijnlijk nepnieuws en niets om door te sturen.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['deepfake', 'factcheck', 'betrouwbare'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Er gaat een filmpje rond waarin de minister-president zegt dat de zomervakantie twee weken korter wordt. Zijn stem en zijn gezicht lijken helemaal echt, dus hoe controleer je dit bericht in vijf minuten?</p>',
          '<p><strong>Antwoord.</strong> Je loopt de vier controlevragen één voor één langs en schrijft per vraag op wat je vindt. Op de vraag wie dit gemaakt heeft, vind je niets: er staat alleen een account zonder naam. Op de vraag wat de bron is, vind je ook niets, want er wordt geen ministerie of persconferentie genoemd. Om te zien of anderen het al gecontroleerd hebben, typ je de zin in Google en kijk je bij bekende nieuwssites. Bij de NOS en het Jeugdjournaal staat er niets over, en dat is bij zulk groot nieuws een sterk teken. Op de vraag of het logisch is, is het antwoord nee, want zo\'n besluit zou overal in het nieuws staan. Voor de zekerheid zoek je het bericht daarna ook nog even op bij Nieuwscheckers.nl. De conclusie na deze ene factcheck is dat het waarschijnlijk een deepfake is, dus niet doorsturen.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Nepnieuws herken je aan drie dingen. Eerst de kop: die is schreeuwerig en gemaakt om je te laten klikken. Daarna de bron, die ontbreekt of vaag is, en de foto\'s die eigenlijk ergens anders vandaan komen. Een deepfake gaat nog een stap verder, want daarin maakt kunstmatige intelligentie een gezicht en een stem na die nooit iets gezegd hebben. Controleer daarom altijd wie het gemaakt heeft, of anderen het al nagekeken hebben en of het verhaal logisch is.</p>',
      keyTerms: ['kop', 'deepfake']
    },
    vragen: [
      {
        prompt: 'Welk kenmerk hoort bij nepnieuws?',
        leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Een heftige, schokkende kop die je vooral moet laten klikken.', correct: true, explanation: 'Dat heet clickbait en is bedoeld om aandacht te vangen, niet om je te informeren.' },
          { text: 'Een tekst zonder spelfouten, want die is altijd betrouwbaar.', correct: false, misconception: 'Denkt dat verzorgd taalgebruik bewijs is dat een bericht klopt.' },
          { text: 'Een foto bij het bericht, want nieuws met beeld is nooit nep.', correct: false, misconception: 'Ziet beeld aan voor bewijs.' },
          { text: 'Een link naar de website van de NOS onder het bericht.', correct: false, misconception: 'Ziet een bronvermelding aan voor een kenmerk van nepnieuws.' }
        ],
        feedback: 'Clickbait verkoopt aandacht: hoe heftiger de kop, hoe belangrijker het is om eerst de bron te zoeken.'
      },
      {
        prompt: 'Welke bron is waarschijnlijk het meest betrouwbaar?',
        leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een anoniem account zonder naam of profielfoto.', correct: false, misconception: 'Denkt dat anonimiteit niet uitmaakt zolang het verhaal maar spannend is.' },
          { text: 'Een onbekende site die zichzelf Gekke Gabber Nieuws noemt.', correct: false, misconception: 'Denkt dat een grappige naam onschuldig en dus betrouwbaar is.' },
          { text: 'Een onderzoeksbericht van de Universiteit van Amsterdam.', correct: true, explanation: 'Een universiteit zet haar naam en haar werkwijze achter wat ze publiceert.' }
        ],
        feedback: 'Een bron die zijn naam en werkwijze durft te noemen kun je controleren; bij een anonieme bron kan dat niet.'
      },
      {
        prompt: 'Bij een deepfake worden duizenden beelden van iemand geanalyseerd voordat de computer het gezicht over iemand anders heen plakt.',
        waar: true,
        leerdoel: 'Je weet wat een deepfake is en hoe die gemaakt wordt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Precies daarom lukt een deepfake het best bij bekende mensen: van hen bestaat er ontzettend veel beeldmateriaal.'
      },
      {
        prompt: 'Waarom is het belangrijk om de bron van een artikel te checken?',
        leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Om te kijken of iemand die je leuk vindt het artikel geschreven heeft.', correct: false, misconception: 'Denkt dat sympathie iets zegt over de juistheid van een bericht.' },
          { text: 'Zo kun je achterhalen of het nieuws echt of nep is.', correct: true, explanation: 'De bron is het snelste controlepunt dat je hebt.' },
          { text: 'Om te kijken of het artikel wel in Nederland geschreven is.', correct: false, misconception: 'Denkt dat het land van herkomst bepaalt of iets waar is.' }
        ],
        feedback: 'De bron is je snelste check: een onbekende afzender betekent zoeken vóór je gelooft of doorstuurt.'
      },
      {
        prompt: 'Leg uit waarom een deepfake gevaarlijker kan zijn dan een nepbericht in tekst, en noem één manier waarop je de techniek positief kunt inzetten.',
        type: 'open',
        leerdoel: 'Je weet wat een deepfake is en hoe die gemaakt wordt.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Een deepfake is gevaarlijker omdat je iemand ziet en hoort; beeld en geluid geloven mensen sneller dan een geschreven bericht. Daardoor verspreidt het zich harder en is het moeilijker om aan te tonen dat het niet waar is. Positief kun je dezelfde techniek gebruiken in films, bijvoorbeeld om een acteur jonger te maken, of om iemand die niet meer kan praten zijn eigen stem terug te geven.',
        nakijkpunten: [
          'Legt uit dat beeld en geluid geloofwaardiger overkomen dan tekst.',
          'Noemt een gevolg, bijvoorbeeld snellere verspreiding of moeilijker te ontkrachten.',
          'Noemt één positieve toepassing van de techniek.'
        ],
        feedback: 'Beeld overtuigt sneller dan tekst, en dat is precies waarom dezelfde techniek ook nuttig kan zijn in film en zorg.'
      },
      {
        prompt: 'In paragraaf 6.1 leerde je hoe het algoritme kiest wat jij ziet. Waarom verspreidt nepnieuws zich daardoor zo snel?',
        leerdoel: 'Je kunt uitleggen wat een algoritme op social media is.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        options: [
          { text: 'Omdat het systeem nepnieuws expres vooraan zet om mensen te waarschuwen.', correct: false, misconception: 'Denkt dat platforms nepnieuws bewust uitlichten als waarschuwing.' },
          { text: 'Omdat schokkende berichten veel kijktijd opleveren.', correct: true, explanation: 'Het systeem meet aandacht en geen waarheid.' },
          { text: 'Omdat nepnieuws altijd door bekende nieuwssites wordt overgenomen.', correct: false, misconception: 'Denkt dat verspreiding alleen via officiële media loopt.' }
        ],
        feedback: 'Het systeem meet aandacht en geen waarheid; boosheid en schrik zijn daarom precies de brandstof voor nepnieuws.'
      },
      {
        prompt: 'In hoofdstuk 5 controleerde je een webshop met vijf checks. Wat hebben die checks gemeen met een factcheck?',
        leerdoel: 'Je kunt vijf checks doen om te zien of een webshop betrouwbaar is.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'samen_oefenen',
        options: [
          { text: 'Bij allebei zoek je bewijs buiten de bron zelf voordat je hem gelooft.', correct: true, explanation: 'Je vertrouwt niet op wat de site over zichzelf zegt, maar op wat anderen erover melden.' },
          { text: 'Bij allebei kijk je vooral of de pagina er verzorgd en professioneel uitziet.', correct: false, misconception: 'Denkt dat een net uiterlijk bewijs is van betrouwbaarheid.' },
          { text: 'Bij allebei is een slotje in de adresbalk het enige dat telt.', correct: false, misconception: 'Denkt dat een technisch kenmerk garandeert dat de inhoud klopt.' }
        ],
        feedback: 'Een webshop en een nieuwsbericht controleer je op dezelfde manier: zoek onafhankelijk bewijs voordat je iets aanneemt.'
      },
      {
        prompt: 'Iemand stuurt je de kop: Zangeres overlijdt na boosterprik - familie zwijgt! Beschrijf stap voor stap hoe je controleert of dit klopt en welke sites je daarbij gebruikt.',
        type: 'open',
        leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.',
        denkniveau: 'maken_controleren',
        niveau: 'verdieping',
        rol: 'zelf_proberen',
        modelAnswer: 'Stap 1: ik kijk wie dit gemaakt heeft en of er een bron bij staat. Staat er geen auteur of organisatie bij, dan is dat meteen verdacht. Stap 2: ik vraag me af of het logisch is; de kop is heftig en suggereert een geheim, en dat is typisch clickbait. Stap 3: ik typ het bericht in Google en kijk of bekende nieuwssites zoals de NOS, RTL Nieuws of het Jeugdjournaal er ook over schrijven. Melden zij niets, terwijl het groot nieuws zou zijn, dan klopt het waarschijnlijk niet. Stap 4: ik zoek het op bij Nieuwscheckers.nl, en anders bij Drogredenen.nl of Snopes.com. Stap 5: ik bekijk de foto; die kan oud zijn en van een heel andere gebeurtenis komen. Pas als meerdere betrouwbare bronnen hetzelfde melden, geloof ik het bericht.',
        nakijkpunten: [
          'De vier controlevragen uit de bron komen terug: wie heeft het gemaakt, wat is de bron, is het gecontroleerd, is het logisch.',
          'Er wordt minstens één factchecksite bij naam genoemd.',
          'Het clickbait-kenmerk van de kop wordt herkend en benoemd.'
        ],
        feedback: 'Groot nieuws dat alleen op één vage site staat, is bijna nooit groot nieuws. Stilte bij de NOS is zelf ook een aanwijzing.'
      },
      {
        prompt: 'Leg uit waarom nepnieuws bijna altijd met een schokkende kop begint, en verbind dat met wat je in 6.1 over kijktijd en het algoritme geleerd hebt.',
        type: 'open',
        leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'samen_oefenen',
        modelAnswer: 'Een schokkende kop moet ervoor zorgen dat je erop klikt; dat heet clickbait. De makers verdienen geld met klikken, of ze willen mensen beïnvloeden, en daar hebben ze bereik voor nodig. Hier komt het algoritme om de hoek kijken: het systeem toont vaker wat veel aandacht en kijktijd krijgt. Een heftige kop levert precies die aandacht op, dus wordt het bericht nog vaker getoond. Zo helpt het algoritme nepnieuws onbedoeld vooruit. De andere twee kenmerken zijn dat er geen betrouwbare bron bij staat en dat er oude of neppe foto\'s bij gebruikt worden.',
        nakijkpunten: [
          'Het woord clickbait wordt gebruikt en uitgelegd als: bedoeld om je te laten klikken.',
          'De link met het algoritme loopt via aandacht of kijktijd, niet via een vaag verband.',
          'De andere twee kenmerken van nepnieuws worden er ook bij genoemd.'
        ],
        feedback: 'Clickbait en het algoritme werken op hetzelfde principe: aandacht wint. Daarom reist een heftige leugen sneller dan een saaie waarheid.'
      }
    ]
  },

  '6.7': {
    learningGoals: [
      'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.',
      'Je kunt je resultaat opslaan en delen met je docent.'
    ],
    theorie: [
      {
        keyTerms: ['mediawijs', 'overhoren'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Tess leest de vier paragrafen nog drie keer door en denkt: ik ken het nu wel. Op de toets blijkt ze het verschil tussen omstander en reputatie toch niet te weten. Wat ging er mis in de manier waarop zij zich op deze toets heeft voorbereid?</p>',
          '<p><strong>Antwoord.</strong> Herlezen voelt heel goed, want bij elke zin denk je: dit weet ik allang. Bekend is alleen niet hetzelfde als geleerd, want je herkent de zin wel maar kunt hem niet zelf opschrijven. Overhoren laat dat verschil meteen zien, en juist daarom werkt het beter dan nog een ronde lezen. Tess had de uitleg moeten afdekken en per begrip eerst zelf de betekenis moeten opschrijven. Wat ze dan niet weet, is precies het stuk dat ze gericht moet terugzoeken. Zo leert ze in twintig minuten meer dan in een uur herlezen, en ze weet bovendien waar ze staat.</p>'
        ].join('\n')
      },
      {
        // 'bewijs van deelname' en 'zelfstandig' staan al vet in 4.7 en 1.5.
        keyTerms: ['Wikiwijs', '55 procent'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Ravi maakt de toets, haalt 62 procent en klikt het eindscherm daarna meteen weg. De volgende dag vraagt zijn docent hem om het bewijs van deelname met zijn resultaat erop. Wat is hier precies het probleem, en hoe had Ravi dat kunnen voorkomen?</p>',
          '<p><strong>Antwoord.</strong> Het bewijs van deelname is weg, want de toets bewaart jouw resultaat niet voor je docent. Ravi moet de hele toets dus opnieuw maken, en dat kost hem zomaar een half lesuur. Voorkomen doe je zo: zodra het eindscherm verschijnt, maak je er meteen een schermafbeelding van. Die afbeelding sla je op in je eigen map in OneDrive, met een duidelijke naam erbij. Daarna deel je hem op de manier die je docent heeft aangegeven, en pas dan sluit je het tabblad. Bewijs bewaren is bij elke toets een vaste laatste stap, en nooit iets voor later.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Mediawijs zijn betekent dat je begrijpt hoe het algoritme, je eigen gevoel en nepnieuws samen bepalen wat jij gelooft en doet. In deze toets laat je dat zien over social media, cyberpesten, digitale gezondheid en betrouwbare bronnen. Ook de normen, waarden en betaalmethodes uit hoofdstuk 5 komen erin terug. Je bewaart daarna je resultaat als bewijs van deelname en deelt dat met je docent, zodat samen te zien is welk leerdoel nog aandacht nodig heeft.</p>',
      keyTerms: ['mediawijs', 'resultaat']
    },
    vragen: [
      {
        prompt: 'Waarop baseert een algoritme zijn keuze voor wat jij te zien krijgt?',
        leerdoel: 'Je kunt uitleggen wat een algoritme op social media is.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Op de volgorde waarin de berichten geplaatst zijn.', correct: false, misconception: 'Denkt dat een tijdlijn nog altijd netjes op tijd geordend is.' },
          { text: 'Op wat jij eerder aanklikte, uitkeek en opzocht.', correct: true, explanation: 'Jouw eigen gedrag is de belangrijkste grondstof voor de voorspelling.' },
          { text: 'Op wat je docenten en je ouders je aanraden.', correct: false, misconception: 'Denkt dat er van buitenaf redactionele sturing plaatsvindt.' },
          { text: 'Op het aantal apps dat je op je telefoon hebt staan.', correct: false, misconception: 'Zoekt de verklaring in het toestel in plaats van in het gedrag.' }
        ],
        feedback: 'Jouw eerdere gedrag is de grondstof; het systeem heeft geen mening, alleen een voorspelling.'
      },
      {
        prompt: 'Een algoritme is een computerregel en geen medewerker die per persoon een tijdlijn samenstelt.',
        waar: true,
        leerdoel: 'Je kunt uitleggen wat een algoritme op social media is.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'Er zit geen redactie achter je feed; er zit een rekensom achter, en die draait voor iedereen apart.'
      },
      {
        prompt: 'Welk gedrag levert het algoritme het sterkste signaal op?',
        leerdoel: 'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Een filmpje snel liken en daarna meteen wegswipen.', correct: false, misconception: 'Denkt dat een like het zwaarste signaal is, omdat je er bewust op tikt.' },
          { text: 'Een app installeren en er verder weinig mee doen.', correct: false, misconception: 'Denkt dat het bezit van de app al iets over je voorkeuren zegt.' },
          { text: 'Een filmpje drie keer helemaal uitkijken.', correct: true, explanation: 'Kijktijd kost jou echte minuten en is daarom moeilijker te faken dan een tik.' },
          { text: 'Je profielfoto veranderen.', correct: false, misconception: 'Verwart je profiel instellen met gedrag waar het systeem iets uit voorspelt.' }
        ],
        feedback: 'Hoe meer aandacht een handeling jou kost, hoe zwaarder het systeem hem laat wegen in je profiel.'
      },
      {
        prompt: 'Welk nadeel van algoritmes noemt dit hoofdstuk?',
        leerdoel: 'Je kunt een voordeel en een nadeel van algoritmes noemen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Je telefoon wordt er merkbaar langzamer van en gaat vaker haperen.', correct: false, misconception: 'Zoekt het nadeel in de techniek van het toestel.' },
          { text: 'Je kunt geen nieuwe accounts meer volgen.', correct: false, misconception: 'Denkt dat het systeem je keuzevrijheid technisch blokkeert.' },
          { text: 'Je ziet steeds minder verschillende meningen.', correct: true, explanation: 'Je aanbod wordt smaller aan meningen en aan beelden, omdat het systeem herhaalt wat eerder bij jou werkte.' }
        ],
        feedback: 'Het nadeel zit niet in je toestel maar in je aanbod: minder variatie, terwijl het juist prettiger voelt.'
      },
      {
        prompt: 'Wat is een voordeel van algoritmes op social media?',
        leerdoel: 'Je kunt een voordeel en een nadeel van algoritmes noemen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Je ziet altijd precies hetzelfde als je klasgenoten en je vrienden.', correct: false, misconception: 'Denkt dat personalisatie juist voor één gedeelde tijdlijn zorgt.' },
          { text: 'Je vindt sneller wat bij jou past.', correct: true, explanation: 'Muziek, sport of humor die bij je smaak past komt vanzelf langs, dus je hoeft veel minder te zoeken.' },
          { text: 'Je telefoon gebruikt er minder batterij door.', correct: false, misconception: 'Zoekt het voordeel in de techniek in plaats van in het aanbod.' }
        ],
        feedback: 'Het voordeel en het nadeel zijn twee kanten van dezelfde munt: sneller vinden betekent ook minder tegenkomen.'
      },
      {
        prompt: 'Welke situatie is een voorbeeld van druk voelen?',
        leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Je kijkt elk kwartier of er nieuwe verhalen zijn geplaatst.', correct: false, misconception: 'Herkent het gedrag wel, maar noemt het druk in plaats van FOMO.' },
          { text: 'Je zet je telefoon uit tijdens het eten omdat je dat zelf hebt afgesproken.', correct: false, misconception: 'Ziet een eigen keuze aan voor druk van buitenaf.' },
          { text: 'Je meldt je af voor een groepsapp omdat je hem niet meer nodig hebt.', correct: false, misconception: 'Verwart afstand nemen met meebewegen.' },
          { text: 'Je doet mee aan een challenge omdat de rest van je klas dat ook doet.', correct: true, explanation: 'Niemand zegt dat het moet, en toch doe je mee om erbij te horen.' }
        ],
        feedback: 'Bij druk kijk je naar wat de groep doet; bij FOMO kijk je naar wat je zou kunnen missen.'
      },
      {
        prompt: 'Welke omschrijving hoort bij sociale bevestiging?',
        leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Dat je alleen nog berichten ziet die sterk op elkaar lijken.', correct: false, misconception: 'Verwart sociale bevestiging met de filterbubbel.' },
          { text: 'Dat mensen online vooral hun mooiste momenten laten zien.', correct: false, misconception: 'Verwart sociale bevestiging met het highlight reel-effect.' },
          { text: 'Dat je je goed voelt door het aantal likes dat je krijgt.', correct: true, explanation: 'Likes en reacties zijn cijfers die anderen bepalen, en toch meet je er je eigen waarde aan af.' },
          { text: 'Dat een influencer betaald wordt om een product bij zijn volgers aan te prijzen.', correct: false, misconception: 'Verwart het begrip met reclame maken.' }
        ],
        feedback: 'Sociale bevestiging draait om jouw gevoel bij cijfers van anderen; de andere drie begrippen gaan over het aanbod.'
      },
      {
        prompt: 'Wat betekent het highlight reel-effect?',
        leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Dat een filmpje automatisch opnieuw begint als het is afgelopen.', correct: false, misconception: 'Denkt aan een technische functie in plaats van aan een verschijnsel.' },
          { text: 'Dat mensen vooral hun leukste momenten laten zien.', correct: true, explanation: 'De moeilijke en de gewone dingen komen er niet in, en daardoor lijkt hun leven perfecter dan het is.' },
          { text: 'Dat berichten met veel likes bovenaan in je tijdlijn komen te staan.', correct: false, misconception: 'Verwart het effect met de werking van het algoritme.' }
        ],
        feedback: 'De naam zegt het al: je ziet de samenvatting van de hoogtepunten, niet de gewone dagen ertussen.'
      },
      {
        prompt: 'Welke actie kun je zelf doen om positiever met social media om te gaan?',
        leerdoel: 'Je kunt twee dingen noemen die jij kunt doen om positiever met social media om te gaan.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Nog meer accounts volgen die precies hetzelfde posten als de accounts die je nu volgt.', correct: false, misconception: 'Denkt dat meer van hetzelfde het gevoel verbetert.' },
          { text: 'Je meldingen uitzetten en af en toe een dag zonder social media plannen.', correct: true, explanation: 'Zo bepaal jij het moment waarop je kijkt, in plaats van je telefoon.' },
          { text: 'Alleen nog iets posten als je zeker weet dat je er veel likes voor krijgt.', correct: false, misconception: 'Zoekt de oplossing in nog meer sociale bevestiging.' }
        ],
        feedback: 'Meldingen uitzetten geeft je de regie terug: jij kiest het moment, in plaats van dat je wordt weggeroepen.'
      },
      {
        prompt: 'Bewust een paar positieve of inspirerende accounts volgen en negatieve accounts vermijden hoort bij gezonder omgaan met social media.',
        waar: true,
        leerdoel: 'Je kunt twee dingen noemen die jij kunt doen om positiever met social media om te gaan.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'Je kunt je aanbod sturen door bewust te kiezen wie je volgt; dat is de enige knop die echt van jou is.'
      },
      {
        prompt: 'Welke actie is GEEN voorbeeld van cyberpesten?',
        leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Een nepaccount aanmaken om iemand belachelijk te maken.', correct: false, misconception: 'Ziet een nepaccount als een grap in plaats van als pesten.' },
          { text: 'Iemand bewust buitensluiten uit een online groep.', correct: false, misconception: 'Denkt dat pesten altijd uit woorden moet bestaan.' },
          { text: 'Aan een docent melden dat iemand wordt uitgescholden.', correct: true, explanation: 'Wie uitschelden in de klassenapp meldt, helpt het slachtoffer, en dat is het tegenovergestelde van pesten.' },
          { text: 'Een gênante foto van iemand zonder toestemming doorsturen naar de hele klas.', correct: false, misconception: 'Denkt dat doorsturen minder telt dan zelf iets posten.' }
        ],
        feedback: 'Melden is de enige actie hier die iets oplost; de andere drie zijn precies de voorbeelden uit de paragraaf.'
      },
      {
        prompt: 'Waarin verschilt cyberpesten van pesten op het schoolplein?',
        leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Cyberpesten telt pas mee als een docent of een ouder het zelf gezien heeft.', correct: false, misconception: 'Denkt dat pesten officieel moet worden vastgesteld voordat het pesten heet.' },
          { text: 'Het gaat via een scherm en kan dag en nacht doorgaan.', correct: true, explanation: 'Via een scherm, dag en nacht door, en de pester kan ook nog anoniem blijven: die drie samen maken het net zo erg of erger.' },
          { text: 'Cyberpesten gebeurt alleen tussen mensen die elkaar nooit in het echt zien.', correct: false, misconception: 'Denkt dat het per se om onbekenden gaat, terwijl het meestal klasgenoten zijn.' }
        ],
        feedback: 'Het verschil zit in tijd, plaats en naam: overal, altijd, en soms zonder dat je weet wie het is.'
      },
      {
        prompt: 'Welk gevolg hoort bij de pester?',
        leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Angst om naar school te gaan.', correct: false, misconception: 'Geeft het gevolg van het slachtoffer aan de pester.' },
          { text: 'Spijt achteraf, omdat hij het zag gebeuren en er niets van gezegd heeft.', correct: false, misconception: 'Geeft het gevolg van de omstander aan de pester.' },
          { text: 'Buikpijn door de spanning van het meelezen.', correct: false, misconception: 'Denkt dat de pester dezelfde klachten krijgt als het slachtoffer.' },
          { text: 'Straf, aangifte en een slechte reputatie.', correct: true, explanation: 'Naast straf op school en een mogelijke aangifte raakt hij zijn reputatie kwijt, en dat vertrouwen komt niet snel terug.' }
        ],
        feedback: 'Van de drie rollen is de pester de enige die ook met de school of de politie te maken kan krijgen.'
      },
      {
        prompt: 'Een omstander is iemand die het online pesten ziet gebeuren maar zelf niet meepest.',
        waar: true,
        leerdoel: 'Je weet wat de woorden anoniem, omstander en reputatie betekenen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'De omstanders vormen de grootste groep, en daardoor tegelijk de groep die het snelst iets zou kunnen veranderen.'
      },
      {
        prompt: 'Welk woord betekent dat je niet weet wie er achter een account zit?',
        leerdoel: 'Je weet wat de woorden anoniem, omstander en reputatie betekenen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Omstander.', correct: false, misconception: 'Verwart de rol van toekijker met het verbergen van je identiteit.' },
          { text: 'Reputatie.', correct: false, misconception: 'Verwart hoe anderen over je denken met wie je bent.' },
          { text: 'Anoniem.', correct: true, explanation: 'Anoniem betekent dat je naam en identiteit niet bekend zijn.' }
        ],
        feedback: 'Anoniem is geen scheldwoord en ook niet altijd verkeerd: anoniem hulp vragen bij Pestweb mag juist wel.'
      },
      {
        prompt: 'Je krijgt gemene berichten en je wilt het melden. Wat neem je mee als bewijs?',
        leerdoel: 'Je weet wat je kunt doen als je zelf gepest wordt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Een lijstje met namen van klasgenoten die het ook vervelend vinden.', correct: false, misconception: 'Denkt dat steun van anderen hetzelfde is als bewijs.' },
          { text: 'Afbeeldingen van je scherm waarop de berichten te lezen zijn.', correct: true, explanation: 'Zo blijft het bewijs bestaan, ook als de pester zijn bericht verwijdert.' },
          { text: 'De naam van de app waarin het gebeurde.', correct: false, misconception: 'Denkt dat het noemen van het platform genoeg is om iets aan te tonen.' }
        ],
        feedback: 'Berichten kunnen verdwijnen, een opgeslagen afbeelding niet; daarom leg je het meteen vast en niet pas na een week.'
      },
      {
        prompt: 'Als je ziet dat iemand online gepest wordt en je zegt er niets van, lijkt het voor de anderen alsof je het goedvindt.',
        waar: true,
        leerdoel: 'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'Zwijgen wordt door de groep gelezen als instemmen; daarom telt zelfs een kort privéberichtje al mee.'
      },
      {
        prompt: 'Wat doe je als je online iets ziet wat niet oké is, zoals pesten?',
        leerdoel: 'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Je stuurt het door naar anderen, zodat zij ook weten wat er speelt.', correct: false, misconception: 'Denkt dat doorsturen waarschuwen is, terwijl het het bereik vergroot.' },
          { text: 'Je doet niks, het gaat jou niet aan.', correct: false, misconception: 'Denkt dat toekijken een neutrale keuze is.' },
          { text: 'Je maakt een screenshot en plaagt terug.', correct: false, misconception: 'Verwart bewijs verzamelen met wraak nemen.' },
          { text: 'Je rapporteert het bij de app of het platform.', correct: true, explanation: 'De makers van de app kunnen het bericht weghalen en de dader aanspreken.' }
        ],
        feedback: 'Rapporteren is het gereedschap dat de app jou geeft; gebruik het, ook als je verder niemand kent in die situatie.'
      },
      {
        prompt: 'Waar kun je anoniem hulp vragen als je online gepest wordt?',
        leerdoel: 'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Bij de klantenservice van de webshop waar je iets besteld hebt.', correct: false, misconception: 'Verwart hulp bij pesten met hulp bij een bestelling.' },
          { text: 'Op Pestweb of bij de Kindertelefoon.', correct: true, explanation: 'Daar kun je praten zonder te vertellen wie je bent.' },
          { text: 'In de groepsapp van je eigen klas.', correct: false, misconception: 'Denkt dat de groep waarin het gebeurt ook de plek is om hulp te zoeken.' }
        ],
        feedback: 'Anoniem praten kan echt: bij Pestweb en de Kindertelefoon hoef je je naam niet te noemen.'
      },
      {
        prompt: 'Een pester die iemand tot wanhoop drijft, dus zo ernstig pest dat die persoon geen uitweg meer ziet, kan strafbaar zijn.',
        waar: true,
        leerdoel: 'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'Dat is de zwaarste grens uit deze lessen: bij zulke gevolgen is pesten geen ruzie meer maar een zaak voor de politie.'
      },
      {
        prompt: 'Waarom kun je op den duur een bril nodig hebben van te veel schermtijd?',
        leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Doordat het blauwe licht de kleur van je ogen verandert.', correct: false, misconception: 'Koppelt elk oogprobleem aan blauw licht.' },
          { text: 'Doordat je van schermen minder vaak knippert en je oogleden zwakker worden.', correct: false, misconception: 'Verwart droge ogen met een blijvende verandering van je zicht.' },
          { text: 'Doordat je te vaak dichtbij kijkt en bijna nooit ver weg.', correct: true, explanation: 'Je ogen hoeven dan bijna nooit op veraf scherp te stellen; daarom staat in de 20-20-2 regel dat je regelmatig ver weg kijkt.' }
        ],
        feedback: 'De afstand tot je scherm is hier de sleutel, en dat maakt de pauze waarin je ver kijkt zo belangrijk.'
      },
      {
        prompt: 'Wat komt er volgens de 20-20-2 regel na twintig minuten schermtijd?',
        leerdoel: 'Je kunt de 20-20-2 regel uitleggen en toepassen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Nog eens twintig minuten doorkijken en daarna pas een pauze nemen.', correct: false, misconception: 'Denkt dat de regel over de totale kijktijd per keer gaat.' },
          { text: 'Twintig seconden ver weg kijken, en die dag twee uur buiten zijn.', correct: true, explanation: 'De twintig seconden komen direct, de twee uur buiten spreid je over de dag.' },
          { text: 'Twee uur lang helemaal geen scherm meer gebruiken.', correct: false, misconception: 'Leest de 2 als een schermverbod in plaats van als buitentijd.' }
        ],
        feedback: 'De twintig seconden komen meteen, de twee uur buiten verdeel je over je dag; dat verschil wordt vaak gemist.'
      },
      {
        prompt: 'Waar staat de 2 in de 20-20-2 regel voor?',
        leerdoel: 'Je kunt de 20-20-2 regel uitleggen en toepassen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Voor twee uur per dag buiten zijn.', correct: true, explanation: 'Het gaat om minstens twee uur, want buitenlicht helpt je slaapritme en je ogen kijken er vanzelf ver weg.' },
          { text: 'Voor twee pauzes per schooluur.', correct: false, misconception: 'Denkt dat alle drie de getallen over pauzes gaan.' },
          { text: 'Voor twee meter afstand tussen je ogen en je scherm.', correct: false, misconception: 'Verwart de buitentijd met de kijkafstand van zes meter.' },
          { text: 'Voor twee minuten je ogen dichtdoen.', correct: false, misconception: 'Denkt dat rust voor je ogen hetzelfde is als naar buiten gaan.' }
        ],
        feedback: 'Twee van de drie getallen gaan over je pauze, maar de laatste gaat over je hele dag buiten.'
      },
      {
        prompt: 'Aan welk signaal herken je digitale verslaving bij jezelf?',
        leerdoel: 'Je weet waaraan je digitale verslaving bij jezelf kunt herkennen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Je gebruikt je telefoon elke dag voor school.', correct: false, misconception: 'Denkt dat dagelijks gebruik op zichzelf al verslaving is.' },
          { text: 'Je hebt meer dan tien verschillende apps op je telefoon staan.', correct: false, misconception: 'Zoekt het signaal in het aantal apps in plaats van in gedrag.' },
          { text: 'Je wordt rusteloos als je niet op je telefoon kunt kijken.', correct: true, explanation: 'Onrust zonder telefoon is een kernsignaal van verslaving.' }
        ],
        feedback: 'Niet het aantal uren maar de onrust als je niet kunt kijken, is het duidelijkste alarmsignaal.'
      },
      {
        prompt: 'Elke dag je telefoon gebruiken is op zichzelf al een digitale verslaving.',
        waar: false,
        leerdoel: 'Je weet waaraan je digitale verslaving bij jezelf kunt herkennen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'Het gaat om drie dingen samen: niet kunnen stoppen, onrust zonder toestel, en minder aandacht voor school of hobby\'s.'
      },
      {
        prompt: 'Welk kenmerk maakt een nieuwsbericht juist verdacht?',
        leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Het bericht staat op de site van het Jeugdjournaal of de NOS.', correct: false, misconception: 'Denkt dat een bekende nieuwssite even verdacht is als een onbekende.' },
          { text: 'Er staat geen auteur of organisatie bij.', correct: true, explanation: 'Zonder afzender bij het bericht valt er niets te controleren, en dat is precies wat nepnieuws wil.' },
          { text: 'Het bericht bevat een datum en een plaatsnaam.', correct: false, misconception: 'Denkt dat concrete gegevens juist wijzen op verzinsel.' }
        ],
        feedback: 'Een bericht zonder afzender kun je nergens controleren; dat ontbrekende naampje is het grootste alarmsignaal.'
      },
      {
        prompt: 'Waaraan herken je nepnieuws als je alleen de kop en de foto ziet?',
        leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Aan een rustige kop en een scherpe, recente foto.', correct: false, misconception: 'Draait de kenmerken om en denkt dat rustige berichten verdacht zijn.' },
          { text: 'Aan een kop in kleine letters zonder leestekens.', correct: false, misconception: 'Zoekt het kenmerk in de opmaak in plaats van in de inhoud.' },
          { text: 'Aan een spelfout in de eerste zin, want die staat er altijd in.', correct: false, misconception: 'Denkt dat nepnieuws altijd slordig geschreven is.' },
          { text: 'Aan een schokkende kop met een oude of korrelige foto.', correct: true, explanation: 'Een heftige kop is clickbait en een korrelige foto is hergebruikt beeld: twee van de drie kenmerken tegelijk.' }
        ],
        feedback: 'Twee kenmerken in één oogopslag is al genoeg reden om te zoeken voordat je iets gelooft of deelt.'
      },
      {
        prompt: 'Hoe wordt een deepfake gemaakt?',
        leerdoel: 'Je weet wat een deepfake is en hoe die gemaakt wordt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Door een filmpje langzamer af te spelen en er zelfgeschreven ondertitels onder te zetten.', correct: false, misconception: 'Denkt dat gewoon videobewerken hetzelfde is als een deepfake maken.' },
          { text: 'Door met AI een gezicht over iemand anders te plakken.', correct: true, explanation: 'Eerst analyseert AI duizenden beelden, daarna gaat het gezicht over iemand anders heen en ten slotte wordt de stem nagemaakt.' },
          { text: 'Door een oude foto opnieuw te publiceren bij een nieuw bericht.', correct: false, misconception: 'Verwart een hergebruikte foto met een deepfake.' }
        ],
        feedback: 'Analyseren, overplakken en de stem nabootsen: pas met die drie stappen samen ontstaat een deepfake.'
      },
      {
        prompt: 'Bij een deepfake kan met AI ook de stem van iemand worden nagemaakt.',
        waar: true,
        leerdoel: 'Je weet wat een deepfake is en hoe die gemaakt wordt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'Beeld én geluid samen maken het overtuigend; daarom is een deepfake lastiger te ontmaskeren dan een neptekst.'
      },
      {
        prompt: 'Op TikTok staat dat alle Nederlanders drie keer per week een coronatest moeten doen. Wat doe je?',
        leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Doorsturen naar je klassenapp, zodat iedereen meteen gewaarschuwd is.', correct: false, misconception: 'Denkt dat waarschuwen belangrijker is dan eerst controleren.' },
          { text: 'Het geloven, want het staat in een filmpje met heel veel weergaven.', correct: false, misconception: 'Ziet populariteit aan voor bewijs.' },
          { text: 'De bron zoeken bij een nieuwssite of een factchecksite.', correct: true, explanation: 'Je zoekt het bericht daar op en ziet dan meteen of betrouwbare bronnen hetzelfde melden.' },
          { text: 'Het negeren en er verder helemaal niets mee doen.', correct: false, misconception: 'Denkt dat wegkijken hetzelfde is als controleren.' }
        ],
        feedback: 'Eerst controleren, dan pas delen; doorsturen zonder check maakt jou onderdeel van de verspreiding.'
      },
      {
        prompt: 'Kies twee onderwerpen uit dit hoofdstuk - social media, cyberpesten, digitale gezondheid of nepnieuws - en leg uit hoe ze met elkaar samenhangen.',
        type: 'open',
        leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Social media en digitale gezondheid hangen samen, omdat het algoritme mij steeds nieuwe filmpjes voorschotelt en ik daardoor langer blijf kijken dan ik wil. Die extra uren geven mij een stijve nek, droge ogen en slechter slapen door het blauwe licht. FOMO is de reden dat ik blijf kijken, en de klachten zijn het gevolg. Wie zijn schermtijd wil verlagen, moet dus eerst iets doen aan dat gevoel iets te missen.',
        nakijkpunten: [
          'Kiest twee onderwerpen uit dit hoofdstuk en benoemt ze duidelijk.',
          'Legt een verband dat verder gaat dan "ze gaan allebei over je telefoon".',
          'Gebruikt minstens twee begrippen uit het hoofdstuk op de juiste manier.'
        ],
        feedback: 'Verbanden leggen laat meer zien dan losse feiten opnoemen; hier blijkt waarom deze vier onderwerpen in één hoofdstuk staan.'
      },
      {
        prompt: 'Welke uitspraak past het best bij mediawijs zijn?',
        leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Ik gebruik zo min mogelijk social media, want die zijn slecht.', correct: false, misconception: 'Denkt dat mediawijs zijn hetzelfde is als schermen vermijden.' },
          { text: 'Ik geloof wat op bekende accounts staat, want die hebben veel volgers.', correct: false, misconception: 'Verwart bereik met betrouwbaarheid.' },
          { text: 'Ik weet niet hoe het werkt, maar ik gebruik het al jaren zonder problemen.', correct: false, misconception: 'Denkt dat ervaring hetzelfde is als inzicht in hoe media sturen.' },
          { text: 'Ik snap hoe media mij sturen en kies daarna zelf wat ik ermee doe.', correct: true, explanation: 'Mediawijs zijn is begrijpen én kiezen, niet vermijden.' }
        ],
        feedback: 'Mediawijs zijn is geen verbodslijst maar een keuze die je bewust maakt, met kennis van hoe het systeem werkt.'
      },
      {
        prompt: 'Beschrijf hoe je je resultaat van deze toets bewaart en met je docent deelt, en leg uit waarom dat bewijs nodig is.',
        type: 'open',
        leerdoel: 'Je kunt je resultaat opslaan en delen met je docent.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Aan het einde van de toets krijg ik een bewijs van deelname met mijn resultaat te zien. Daar maak ik meteen een afbeelding van mijn scherm van en die zet ik in mijn map in OneDrive. Daarna deel ik hem met mijn docent op de manier die hij heeft aangegeven. Dat bewijs is nodig, omdat mijn docent anders niet kan zien dat ik de toets echt gemaakt heb en welke onderdelen ik nog moet oefenen.',
        nakijkpunten: [
          'Noemt het vastleggen van het eindscherm met het resultaat erop.',
          'Noemt waar het bestand wordt opgeslagen en hoe het gedeeld wordt.',
          'Legt uit waarom de docent dat bewijs nodig heeft.'
        ],
        feedback: 'Zonder bewijs bestaat je resultaat alleen op jouw scherm; het vastleggen maakt je werk zichtbaar en bespreekbaar.'
      },
      {
        prompt: 'Wat doe je meteen nadat het scherm met je bewijs van deelname verschijnt?',
        leerdoel: 'Je kunt je resultaat opslaan en delen met je docent.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Het tabblad sluiten; je resultaat wordt automatisch naar je docent gestuurd.', correct: false, misconception: 'Denkt dat de toetsomgeving het resultaat zelf doorgeeft aan school.' },
          { text: 'Een schermafbeelding maken en die opslaan in je map in OneDrive.', correct: true, explanation: 'Het scherm is het enige bewijs, en het verdwijnt zodra je het wegklikt.' },
          { text: 'Je score in je schrift noteren; dat is voldoende bewijs.', correct: false, misconception: 'Denkt dat een zelf opgeschreven cijfer even veel waard is als het eindscherm.' },
          { text: 'De toets nog een keer maken voor een betere score.', correct: false, misconception: 'Denkt dat de toets onbeperkt opnieuw gemaakt mag worden.' }
        ],
        feedback: 'Vastleggen is de laatste stap van de toets zelf; wie eerst wegklikt en daarna nadenkt, begint helemaal opnieuw.'
      },
      {
        prompt: 'Terugblik hoofdstuk 5. Wat is een voorbeeld van een waarde?',
        leerdoel: 'Je weet wat normen en waarden zijn en hoe ze online gelden.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Je mag niet schelden.', correct: false, misconception: 'Noemt een norm of gedragsregel in plaats van een waarde.' },
          { text: 'Je deelt geen privégegevens.', correct: false, misconception: 'Noemt een concrete afspraak in plaats van wat je belangrijk vindt.' },
          { text: 'Respect.', correct: true, explanation: 'Een waarde is iets wat jij belangrijk vindt; de regels volgen daar pas uit.' },
          { text: 'Je maakt geen nepaccounts.', correct: false, misconception: 'Verwart een gedragsregel met de waarde erachter.' }
        ],
        feedback: 'Waarden zijn woorden als respect en eerlijkheid; regels zijn zinnen over wat je wel of niet doet.'
      },
      {
        prompt: 'Terugblik hoofdstuk 5. Wat is een goede reden om je social media-account op privé te zetten?',
        leerdoel: 'Je kunt je account op privé zetten en je bio veilig invullen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Dan krijg je meer likes.', correct: false, misconception: 'Denkt dat privacy-instellingen invloed hebben op je bereik ten goede.' },
          { text: 'Zo kun je zien wie jouw profiel bezoekt.', correct: false, misconception: 'Denkt dat privé een bezoekerslijst oplevert.' },
          { text: 'Je kunt dan meer apps downloaden.', correct: false, misconception: 'Koppelt een privacy-instelling aan de opslag van je toestel.' },
          { text: 'Om je privacy te beschermen.', correct: true, explanation: 'Alleen mensen die je zelf goedkeurt zien dan je berichten en foto\'s.' }
        ],
        feedback: 'Privé zetten kost je misschien bereik, maar het bepaalt wel wie er met jouw leven meekijkt.'
      },
      {
        prompt: 'Terugblik hoofdstuk 5. Bij welke betaalmethode betaal je direct met je eigen bank?',
        leerdoel: 'Je weet wat iDEAL, Klarna, een creditcard en Apple Pay of Google Pay zijn.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'iDEAL.', correct: true, explanation: 'Bij iDEAL gaat het bedrag meteen van je eigen rekening af.' },
          { text: 'Klarna.', correct: false, misconception: 'Verwart achteraf betalen met direct betalen.' },
          { text: 'Een creditcard.', correct: false, misconception: 'Denkt dat betalen op krediet hetzelfde is als betalen met je bank.' }
        ],
        feedback: 'iDEAL is direct, Klarna is achteraf en een creditcard is op krediet; dat verschil bepaalt wanneer je geld weg is.'
      },
      {
        prompt: 'Terugblik hoofdstuk 5. Een slotje voor de URL betekent dat een webshop zeker te vertrouwen is.',
        waar: false,
        leerdoel: 'Je weet waar je op moet letten in de URL en bij het slotje.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'Het slotje zegt alleen dat de verbinding beveiligd is; ook een oplichter kan zo\'n slotje op zijn site zetten.'
      },
      {
        prompt: 'Noem drie dingen waarvan het algoritme leert, gerangschikt van het sterkste naar het zwakste signaal, en verklaar je volgorde.',
        type: 'open',
        leerdoel: 'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.',
        denkniveau: 'maken_controleren',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Het sterkste signaal is een zoekopdracht of een filmpje dat ik helemaal uitkijk, want dat kost mij echte tijd en moeite. Daarna komt het volgen van een account, want dat is een keuze die blijft gelden. Het zwakste van de drie is een snelle like, want die is één tik en kost me geen seconde nadenken. Mijn volgorde loopt dus van veel moeite naar weinig moeite. Het systeem vertrouwt gedrag dat mij tijd kost meer dan gedrag dat gratis is.',
        nakijkpunten: [
          'Er staan drie verschillende signalen in, in een expliciete volgorde.',
          'De verklaring gebruikt tijd, moeite of aandacht als maatstaf.'
        ],
        feedback: 'De maatstaf is moeite: hoe meer tijd een handeling jou kost, hoe zwaarder het systeem hem meeweegt.'
      },
      {
        prompt: 'Leg met een eigen voorbeeld uit hoe FOMO kan overgaan in druk, en beschrijf op welk punt dat gevaarlijk wordt.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik zie in de groepsapp dat iedereen naar hetzelfde feest gaat en ben bang dat ik iets mis: dat is FOMO. Omdat ik er per se bij wil horen, ga ik toch, ook al had ik geen zin en moest ik leren. Op dat moment is FOMO overgegaan in druk: ik doe iets omdat de rest het doet. Gevaarlijk wordt het als de groep verder gaat dan meegaan naar een feest. In de bron staat het voorbeeld van jongeren die elkaar opjutten om iets te stelen. Dan doe je iets wat je alleen nooit zou doen, en dat kan strafbaar zijn.',
        nakijkpunten: [
          'De overgang van bang zijn iets te missen naar iets doen omdat de groep het doet is zichtbaar.',
          'Het gevaarlijke punt wordt concreet gemaakt, bijvoorbeeld met het opjutten uit de bron.'
        ],
        feedback: 'FOMO gaat over missen, druk over meedoen. Het kantelpunt ligt waar je iets doet wat je in je eentje nooit zou doen.'
      },
      {
        prompt: 'Een klasgenoot zegt: ik doe niet mee met dat pesten, dus ik heb er niets mee te maken. Leg uit waarom die uitspraak niet klopt. Ga in op wat het pesten met het slachtoffer doet en op wat een omstander wél kan doen.',
        type: 'open',
        leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Wie het ziet gebeuren en niets doet, is een omstander. Je pest niet mee, maar je helpt ook niet, en dat heeft gevolgen. Voor het slachtoffer betekent stilte dat niemand het opneemt, waardoor het lijkt alsof iedereen het goedvindt. Voor de omstander zelf betekent het vaak later spijt of een schuldgevoel, en onzekerheid: wat als ik de volgende ben. Bovendien kan een omstander wél iets doen: privé een berichtje sturen, het melden bij een docent of mentor, of het rapporteren bij de app. Melden is geen klikken, dat is helpen.',
        nakijkpunten: [
          'Het begrip omstander wordt correct gebruikt: zien maar niet meedoen en niet helpen.',
          'Er staat minstens één gevolg voor het slachtoffer én één voor de omstander zelf in.',
          'Er wordt minstens één concrete handeling genoemd die een omstander wel kan doen.'
        ],
        feedback: 'Niets doen is ook een keuze met effect. Wie zwijgt, laat het slachtoffer alleen en houdt het gedrag in stand.'
      },
      {
        prompt: 'Noem drie dingen die je doet als je zelf gepest wordt, en leg per ding uit welk doel het dient: rust, bewijs of hulp.',
        type: 'open',
        leerdoel: 'Je weet wat je kunt doen als je zelf gepest wordt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik maak screenshots van de gemene berichten: dat dient het doel bewijs, want daarmee kan ik later laten zien wat er gebeurd is. Ik blokkeer de pesters: dat dient het doel rust, want dan kunnen ze me niets meer sturen en mijn profiel niet meer bekijken. Ik praat erover met iemand die ik vertrouw en meld het bij mijn mentor of de vertrouwenspersoon: dat dient het doel hulp, want ik hoef het niet alleen op te lossen.',
        nakijkpunten: [
          'Er staan drie verschillende handelingen in die uit de bron komen.',
          'Elk van de drie doelen rust, bewijs en hulp wordt aan een handeling gekoppeld.'
        ],
        feedback: 'Drie handelingen, drie doelen: bewijs vastleggen, rust terugpakken en hulp inschakelen. Samen dekken ze de hele situatie.'
      },
      {
        prompt: 'Lisa heeft pijn in haar schouders, slaapt slecht en pakt steeds haar telefoon terwijl ze huiswerk moet maken. Koppel elke klacht aan de oorzaak en noem per klacht één maatregel.',
        type: 'open',
        leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.',
        denkniveau: 'toepassen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'De pijn in haar schouders komt door haar slechte houding: haar hoofd hangt te ver naar voren, waardoor er extra spanning op nek en rug komt. Maatregel: rechtop zitten met beide voeten op de grond en het scherm op ooghoogte. Het slecht slapen komt door het blauwe licht van haar scherm, dat de aanmaak van melatonine remt. Maatregel: nachtmodus of een schermfilter aanzetten en de telefoon na 21.00 uur wegleggen. Dat ze steeds haar telefoon pakt terwijl ze iets anders moet doen, wijst op digitale verslaving. Maatregel: schermvrije momenten plannen en een afspraak met zichzelf maken tijdens het huiswerk.',
        nakijkpunten: [
          'Alle drie de klachten zijn aan de juiste oorzaak gekoppeld: houding, blauw licht en verslaving.',
          'Bij elke klacht staat een maatregel die bij die oorzaak past.',
          'Het woord melatonine of het effect op de slaap wordt genoemd.'
        ],
        feedback: 'Elke klacht heeft zijn eigen oorzaak, en dus zijn eigen maatregel. Nachtmodus doet niets tegen een kromme rug.'
      },
      {
        prompt: 'Leg uit waarom je bij twijfel over een bericht altijd buiten dat bericht zelf gaat kijken, en noem twee plekken waar je dan controleert.',
        type: 'open',
        leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Een bericht dat nep is, zegt zelf nooit dat het nep is; het is juist gemaakt om echt te lijken. Alles wat in het bericht staat, staat er omdat de maker het erin gezet heeft. Daarom heb ik bewijs nodig dat níet van de maker komt. Ik controleer bijvoorbeeld bij Nieuwscheckers.nl, en ik Google het bericht om te zien of bekende nieuwssites zoals de NOS of het Jeugdjournaal er ook over schrijven. Komen meerdere onafhankelijke bronnen tot hetzelfde verhaal, dan wordt het geloofwaardig.',
        nakijkpunten: [
          'Het kernargument staat er: een nepbericht bevestigt zichzelf, dus eigen inhoud telt niet als bewijs.',
          'Er worden twee controleplekken genoemd, waarvan minstens één factchecksite of bekende nieuwssite.'
        ],
        feedback: 'Een bron die zichzelf bevestigt bewijst niets. Pas onafhankelijk bewijs van buiten het bericht telt echt mee.'
      }
    ]
  },

  '6.8': {
    learningGoals: [
      'Je kunt uitleggen hoe een algoritme uit jouw kijkgedrag een profiel opbouwt.',
      'Je kunt uitleggen wat een filterbubbel is en hoe die ontstaat.',
      'Je kunt bedenken wat je zelf kunt doen om uit je bubbel te komen.'
    ],
    theorie: [
      {
        keyTerms: ['aanbevelingsalgoritme', 'profiel', 'kijkgedrag'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Een nieuw account kijkt op dag één drie kookvideo\'s helemaal uit en likt er geen enkele van. Datzelfde account swipet vier gamevideo\'s achter elkaar binnen twee seconden weg. Wat weet het systeem op dag twee, en waar heeft het die kennis precies vandaan?</p>',
          '<p><strong>Antwoord.</strong> Het systeem weet niets over koken of gamen als onderwerp, maar het heeft twee soorten signalen geteld. Drie keer volledig uitkijken is een sterk positief signaal, en dat weegt zwaarder dan het ontbreken van likes. Vier keer binnen twee seconden wegswipen is daarnaast een sterk negatief signaal over dat onderwerp. Het profiel schuift dus in de richting van gebruikers die hetzelfde deden, en op dag twee komen er kookachtige video\'s bij. De gamevideo\'s verdwijnen ondertussen bijna helemaal uit het aanbod van dit nieuwe account. Het systeem heeft dat nergens gevraagd; het heeft het simpelweg aan het gedrag gemeten.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['filterbubbel', 'echokamer', 'signalen'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Twee leerlingen uit dezelfde klas zoeken op hetzelfde moment allebei op het woord klimaat. De een krijgt vooral video\'s over oplossingen, de ander vooral video\'s die twijfelen aan het probleem. Is dit een filterbubbel of een echokamer, en waaraan kun je dat verschil zien?</p>',
          '<p><strong>Antwoord.</strong> Dit is een filterbubbel, want het systeem heeft voor elk van hen een ander aanbod samengesteld. Het gebruikt daarvoor alleen wat ze eerder gedaan hebben, en niet wat ze er zelf van vinden. Een echokamer is iets anders: die ontstaat als jij zelf alleen nog vrienden, groepen en accounts kiest die er hetzelfde over denken. Dezelfde mening wordt dan steeds teruggekaatst en klinkt daardoor luider dan hij in werkelijkheid is. Het belangrijkste verschil zit in de vraag wie van de twee die selectie eigenlijk maakt. Bij de bubbel doet het systeem het meeste werk, terwijl je bij de echokamer vooral zelf aan het kiezen bent.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een aanbevelingsalgoritme bouwt uit jouw klikken, kijktijd en wegswipen een profiel op en vergelijkt dat met de profielen van andere gebruikers. Doordat het steeds meer van hetzelfde aanbiedt en jij daar makkelijk op klikt, wordt je aanbod smaller. Zo ontstaat er een filterbubbel, met soms een echokamer eromheen. Je kunt dat doorbreken door bewust andere accounts te volgen, hetzelfde nieuws bij twee bronnen te lezen en af en toe uitgelogd te zoeken.</p>',
      keyTerms: ['aanbevelingsalgoritme', 'echokamer']
    },
    vragen: [
      {
        prompt: 'Waaruit bouwt een aanbevelingsalgoritme jouw profiel op?',
        leerdoel: 'Je kunt uitleggen hoe een algoritme uit jouw kijkgedrag een profiel opbouwt.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Uit de gegevens die je bij het aanmaken van je account hebt ingevuld.', correct: false, misconception: 'Denkt dat alleen ingevulde gegevens meetellen en gedrag niet.' },
          { text: 'Uit signalen zoals klikken, kijktijd, opnieuw afspelen en snel wegswipen.', correct: true, explanation: 'Elk klein gedrag is een signaal dat het profiel bijstelt.' },
          { text: 'Uit een vragenlijst die het platform je elk kwartaal voorlegt.', correct: false, misconception: 'Denkt dat platforms je voorkeuren netjes uitvragen.' }
        ],
        feedback: 'Je profiel groeit uit gedrag dat je niet bewust afgeeft; daarom voelt het alsof de app jou al kent.'
      },
      {
        prompt: 'Kijktijd weegt voor een aanbevelingssysteem zwaarder dan een like.',
        waar: true,
        leerdoel: 'Je kunt uitleggen hoe een algoritme uit jouw kijkgedrag een profiel opbouwt.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        feedback: 'Een like kost één tik, doorkijken kost minuten; daarom is kijktijd het eerlijkere teken van interesse.'
      },
      {
        prompt: 'Hoe ontstaat een filterbubbel volgens deze paragraaf?',
        leerdoel: 'Je kunt uitleggen wat een filterbubbel is en hoe die ontstaat.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'Alleen door de keuzes van het platform; jouw eigen gedrag speelt geen enkele rol.', correct: false, misconception: 'Legt de oorzaak volledig buiten zichzelf.' },
          { text: 'Door een lus waarin het systeem steeds meer van hetzelfde aanraadt.', correct: true, explanation: 'Systeem en gebruiker versterken elkaar, waardoor de bubbel vanzelf groeit.' },
          { text: 'Doordat je account op privé staat en anderen jouw berichten niet zien.', correct: false, misconception: 'Verwart de zichtbaarheid van je eigen berichten met jouw aanbod.' }
        ],
        feedback: 'De bubbel heeft twee makers: het systeem dat herhaalt, en jijzelf die op het bekende blijft klikken.'
      },
      {
        prompt: 'Welke actie geeft het systeem echt een ander signaal?',
        leerdoel: 'Je kunt bedenken wat je zelf kunt doen om uit je bubbel te komen.',
        denkniveau: 'toepassen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Een account met een andere mening volgen en de video\'s uitkijken.', correct: true, explanation: 'Uitkijken is het zwaarste signaal, dus dat verschuift je aanbevelingen echt.' },
          { text: 'Een account met een andere mening volgen en elke video meteen wegswipen.', correct: false, misconception: 'Denkt dat volgen op zich genoeg is, terwijl wegswipen juist minder hiervan betekent.' },
          { text: 'Je telefoon een dag in de vliegtuigmodus zetten.', correct: false, misconception: 'Denkt dat offline gaan het opgebouwde profiel wist.' }
        ],
        feedback: 'Volgen alleen is een zwak signaal; pas als je iets helemaal uitkijkt, verschuift je profiel merkbaar.'
      },
      {
        prompt: 'Leg uit wat een echokamer is en waarom die iets anders is dan een filterbubbel.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen wat een filterbubbel is en hoe die ontstaat.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Een filterbubbel ontstaat doordat een systeem mij steeds meer van hetzelfde aanraadt; die maak ik dus samen met het aanbevelingsalgoritme. Een echokamer ontstaat doordat ik zelf alleen mensen om me heen kies die er hetzelfde over denken, en daar heeft het systeem weinig mee te maken. In een echokamer wordt dezelfde mening steeds teruggekaatst, waardoor die luider en algemener lijkt dan hij is.',
        nakijkpunten: [
          'Legt uit dat een filterbubbel door het aanbevelingssysteem gevoed wordt.',
          'Legt uit dat een echokamer vooral uit eigen keuzes van mensen ontstaat.',
          'Noemt het gevolg: dezelfde mening lijkt sterker of algemener dan hij werkelijk is.'
        ],
        feedback: 'Het verschil zit in wie de selectie maakt: het systeem bouwt de bubbel, mensen bouwen de kamer om zich heen.'
      },
      {
        prompt: 'In paragraaf 6.1 las je dat het algoritme meebepaalt wat trending wordt. Wat betekent dat voor de video\'s die jij aanbevolen krijgt?',
        leerdoel: 'Je kunt een voordeel en een nadeel van algoritmes noemen.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'samen_oefenen',
        options: [
          { text: 'Dat trending video\'s bij iedereen precies even vaak in beeld komen.', correct: false, misconception: 'Denkt dat trending betekent dat iedereen hetzelfde ziet.' },
          { text: 'Dat jouw aanbod deels komt van wat bij mensen zoals jij scoorde.', correct: true, explanation: 'Populariteit binnen jouw groep gebruikers stuurt mee wat jij krijgt.' },
          { text: 'Dat alleen video\'s van bekende accounts nog aanbevolen worden.', correct: false, misconception: 'Denkt dat het aantal volgers de enige factor is.' }
        ],
        feedback: 'Trending is niet één lijst voor heel Nederland; het is per groep gebruikers een andere lijst.'
      },
      {
        prompt: 'In paragraaf 6.6 leerde je nepnieuws controleren. Waarom is dat in een sterke filterbubbel extra moeilijk?',
        leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        options: [
          { text: 'Omdat factchecksites in een filterbubbel technisch niet bereikbaar zijn.', correct: false, misconception: 'Denkt dat een bubbel websites blokkeert.' },
          { text: 'Omdat je in een bubbel alleen nog berichten van vrienden ziet en geen nieuws.', correct: false, misconception: 'Denkt dat een bubbel alleen over vriendenkringen gaat.' },
          { text: 'Omdat in een bubbel bijna niemand het bericht tegenspreekt.', correct: true, explanation: 'Je mist de tegenspraak die je normaal aan het twijfelen zou brengen.' }
        ],
        feedback: 'Een bubbel haalt de tegenspraak weg, en juist tegenspraak is het signaal dat je normaal aan het controleren zet.'
      },
      {
        prompt: 'Beschrijf in vier stappen hoe uit los kijkgedrag een profiel ontstaat, van één swipe tot een aanbeveling die precies bij jou past.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen hoe een algoritme uit jouw kijkgedrag een profiel opbouwt.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'zelf_proberen',
        modelAnswer: 'Stap 1: ik doe iets kleins, bijvoorbeeld een filmpje over skaten helemaal uitkijken in plaats van wegswipen. Stap 2: het systeem legt dat vast als een signaal, met hoe lang ik keek en waarover het ging. Stap 3: al die losse signalen worden bij elkaar opgeteld tot een profiel: een lijst met onderwerpen waarvan het systeem denkt dat ik ze leuk vind. Stap 4: bij mijn volgende bezoek vergelijkt het mijn profiel met dat van gebruikers die op mij lijken, en het toont mij wat bij hen goed werkte. Zo lijkt de aanbeveling op maat gemaakt, terwijl hij eigenlijk uit optellen en vergelijken komt.',
        nakijkpunten: [
          'Alle vier de stappen zijn er, in de goede volgorde: gedrag, signaal, profiel, aanbeveling.',
          'Er staat in dat het profiel uit veel kleine losse waarnemingen wordt opgebouwd.',
          'De vergelijking met andere, gelijkende gebruikers wordt genoemd.'
        ],
        feedback: 'Een profiel is geen beschrijving van wie je bent, maar een optelsom van wat je deed. Daarom klopt het soms verrassend goed en soms helemaal niet.'
      },
      {
        prompt: 'Bedenk drie dingen die je een week lang doet om je eigen bubbel open te breken, en beschrijf waaraan je zou merken dat het gewerkt heeft.',
        type: 'open',
        leerdoel: 'Je kunt bedenken wat je zelf kunt doen om uit je bubbel te komen.',
        denkniveau: 'maken_controleren',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ding 1: ik volg drie accounts over onderwerpen waar ik normaal nooit naar kijk, bijvoorbeeld natuur of geschiedenis. Ding 2: ik kijk die video\'s ook echt helemaal uit, want alleen volgen is een zwak signaal en kijktijd telt zwaarder. Ding 3: ik haal één keer per dag mijn nieuws bij een gewone nieuwssite in plaats van uit mijn tijdlijn. Om te merken of het werkt, schrijf ik vandaag op waarover mijn eerste tien items gaan. Aan het eind van de week tel ik opnieuw. Staat er dan minstens één nieuw onderwerp bij dat er nu niet in zit, dan is mijn bubbel iets opengegaan.',
        nakijkpunten: [
          'Er staan drie verschillende acties in, waarvan minstens één een sterk signaal gebruikt zoals kijktijd.',
          'Er is een meetbare manier beschreven om te controleren of het gelukt is.',
          'De leerling gebruikt kennis uit 6.1 over sterke en zwakke signalen.'
        ],
        feedback: 'Je bubbel breek je niet open met volgen alleen: het systeem gelooft pas in je nieuwe interesse als je er ook echt tijd in stopt.'
      }
    ]
  }
};
