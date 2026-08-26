// Verrijkingslaag hoofdstuk 8 - Zelf maken: programmeren, ontwerpen en
// terugblikken. Basisberoepsgerichte leerweg (bb).
//
// Zie scripts/seed-verrijking/PATROON.md voor het formaat van een vraag, de
// regels over afleiders en de eisen aan feedback.
//
// Dit hoofdstuk heeft in bb ZES paragrafen: 8.1 tot en met 8.6. 8.7 is de
// vrijwillige plusparagraaf van de theoretische leerweg en staat hier niet in.
// 8.1 is de eerste paragraaf van het hoofdstuk en kijkt in zijn afsluitquiz
// nergens op terug; vanaf 8.2 heeft elke quiz twee terugkeervragen.
//
// OPZET PER PARAGRAAF
// -------------------
//   - elk leerdoel heeft zijn EIGEN startvraag. Die staan als `checks` in
//     scripts/seed-structuur/bb/h8.mjs, met antwoord en uitleg erbij. 8.1 opent
//     daarnaast met twee voorkennisvragen over hoofdstuk 7 (7.1 en 7.3). Basis
//     laat 7.4 vallen, dus daar wordt niet naar terugverwezen;
//   - elk theorieblok heeft een uitgewerkt voorbeeld in vraag-en-antwoordvorm.
//     Dat voorbeeld komt VOOR het oefenblok en dus voor het zelfstandig
//     oefenen. In bb is het voorbeeld altijd een situatie uit hun eigen wereld:
//     de klassenapp, je tas inpakken, je telefoon opladen, een poster in de
//     gang;
//   - elke afsluitquiz vanaf 8.2 haalt TWEE leerdoelen op uit een EERDERE
//     paragraaf van dit hoofdstuk. De blauwdruk vraagt er twee van de vijf;
//     de mechanische controle eist er een. Die vragen hangen aan het leerdoel
//     dat je nodig hebt om ze te beantwoorden, niet aan een willekeurig doel;
//   - de eindtoets van 8.6 bevraagt alle ZEVENTIEN verplichte leerdoelen van
//     8.1 tot en met 8.6. Elf leerdoelen komen er twee keer in terug.
//
// BB-VORM: VEEL KLEINE MOMENTEN
// -----------------------------
// Het bb-profiel zegt: vorm gaat voor inhoud, en een leerling moet elke minuut
// iets kunnen aanklikken. Daarom staan er veel korte vragen in plaats van een
// paar grote. De vijf afsluitquizzen tellen tien of elf vragen, de eindtoets
// achtentwintig. Ruim veertig procent van de vragen is een korte
// waar-niet-waar-knop; de stellingen zijn bewust half waar en half niet waar,
// zodat blind op Waar klikken niets oplevert. Elke paragraaf heeft daarnaast
// zeven tot negen oefenopgaven en twee of drie mediablokken, zodat er tussen
// twee leesmomenten altijd iets te doen is.
//
// De reden waarom een antwoord goed is staat in `explanation`, niet in de
// antwoordtekst zelf. Zo is het goede antwoord niet aan zijn lengte te
// herkennen: de afleiders zijn met opzet even lang of langer geschreven.
// Feedback is kort, positief en benoemt wat er goed ging.
//
// De bb-vragen zijn opnieuw geschreven en niet overgenomen uit kb/h8.mjs of
// tl/h8.mjs: kortere zinnen, een idee per vraag en voorbeelden uit de
// leefwereld van een brugklasser.

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
          '<p><strong>Vraag.</strong> Jayden schrijft op hoe je een boterham smeert. Hij schrijft: 1 smeer boter, 2 pak twee sneetjes brood. Klopt dit algoritme?</p>',
          '<p><strong>Antwoord.</strong> Nee, dit klopt niet. Bij stap 1 heeft Jayden nog geen brood. Hij kan de boter dus nergens op smeren. De stappen zijn goed, maar de volgorde is fout. Een computer doet stap 1 gewoon en loopt daar vast. Zo hoort het wel: 1 pak twee sneetjes brood, 2 pak een mes, 3 smeer boter op het brood. Kijk dus altijd of je elke stap echt kunt doen op zijn beurt.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['herhaling', 'keuze', 'voorwaarde'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Fleur pakt haar tas in. Voor elk vak op haar rooster pakt ze een boek. Heeft ze gym, dan pakt ze ook haar sporttas. Waar zit hier een herhaling en waar een keuze?</p>',
          '<p><strong>Antwoord.</strong> De herhaling is: voor elk vak op je rooster, pak een boek. Dat gebeurt steeds opnieuw. Hoe vaak hangt af van haar rooster. De keuze is: als je gym hebt, dan pak je je sporttas. De voorwaarde is: je hebt gym. Die kan waar zijn of niet waar. Is hij niet waar, dan blijft de sporttas thuis. Zoek in je eigen plan dus naar het woord "als". Daar zit bijna altijd een keuze.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een algoritme is een stappenplan voor de computer. De volgorde is net zo belangrijk als de stappen zelf. Met een herhaling doe je iets vaker. Met een keuze kijk je eerst naar een voorwaarde.</p>',
      keyTerms: ['algoritme', 'voorwaarde']
    },
    vragen: [
      {
        prompt: 'Een algoritme is een stappenplan voor de computer.',
        waar: true,
        leerdoel: 'Je kunt uitleggen wat een algoritme is als stappenplan.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Goed gezien. Een algoritme zegt stap voor stap wat er moet gebeuren.'
      },
      {
        prompt: 'Wat hoort er altijd bij een algoritme?',
        leerdoel: 'Je kunt uitleggen wat een algoritme is als stappenplan.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Een computer die de stappen zelf mag aanvullen als er iets mist.', correct: false, misconception: 'Denkt dat een computer meedenkt zoals een mens.' },
          { text: 'Een plaatje erbij, want anders snapt niemand wat je bedoelt.', correct: false, misconception: 'Denkt dat een algoritme altijd getekend moet worden.' },
          { text: 'Minstens twintig stappen, want korter dan dat telt niet mee.', correct: false, misconception: 'Denkt dat het aantal stappen bepaalt of iets een algoritme is.' },
          { text: 'Stappen die op volgorde staan en die je precies kunt doen.', correct: true, explanation: 'Zonder vaste volgorde loopt de uitvoerder ergens vast.' }
        ],
        feedback: 'Prima keuze. Precieze stappen op volgorde: dat is de kern.'
      },
      {
        prompt: 'Een computer vult zelf aan wat jij vergeten bent op te schrijven.',
        waar: false,
        leerdoel: 'Je kunt uitleggen wat een algoritme is als stappenplan.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Vergeet jij een stap, dan gebeurt die stap gewoon niet.'
      },
      {
        prompt: 'Milan schrijft: 1 doe de deur op slot, 2 loop naar buiten, 3 pak je sleutel. Wat is hier mis?',
        leerdoel: 'Je kunt uitleggen wat een algoritme is als stappenplan.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'De sleutel komt te laat; die heb je bij stap 1 al nodig.', correct: true, explanation: 'Bij stap 1 staat Milan zonder sleutel voor een dichte deur.' },
          { text: 'Er staan te weinig stappen in; drie is nooit genoeg voor een plan.', correct: false, misconception: 'Denkt dat er een minimumaantal stappen bestaat.' },
          { text: 'Stap 2 kan helemaal weg, want naar buiten lopen doe je vanzelf.', correct: false, misconception: 'Slaat een handeling over die de computer wel nodig heeft.' }
        ],
        feedback: 'Sterk. Je voerde het plan letterlijk uit en zag daar de fout.'
      },
      {
        prompt: 'Je schrijft op hoe je thee zet. Welke stap vergeten leerlingen het vaakst?',
        leerdoel: 'Je kunt een dagelijkse handeling in duidelijke stappen opschrijven.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Het zetten van een kop op tafel, want dat is de allerlaatste stap.', correct: false, misconception: 'Denkt dat alleen de laatste stap vergeten wordt.' },
          { text: 'Het opschrijven van de smaak thee, want die kies je zelf wel.', correct: false, misconception: 'Denkt dat een keuze niet in het plan hoeft.' },
          { text: 'Het aanzetten van de waterkoker, want dat doe je zonder nadenken.', correct: true, explanation: 'Juist de handelingen die vanzelf gaan schrijf je niet op.' }
        ],
        feedback: 'Mooi. De stappen die vanzelf gaan zijn precies de gevaarlijke.'
      },
      {
        prompt: 'Elke stap in je plan begint het best met een werkwoord, zoals pak of klik.',
        waar: true,
        leerdoel: 'Je kunt een dagelijkse handeling in duidelijke stappen opschrijven.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Met een werkwoord weet je meteen wat je moet doen.'
      },
      {
        prompt: 'Schrijf in drie korte stappen op hoe jij inlogt op je schoolaccount.',
        type: 'open',
        leerdoel: 'Je kunt een dagelijkse handeling in duidelijke stappen opschrijven.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Bijvoorbeeld: 1 open de browser en ga naar de website van school. 2 Typ je schoolmailadres in het bovenste vak. 3 Typ je wachtwoord in het tweede vak en klik op Aanmelden.',
        nakijkpunten: [
          'Er staan drie genummerde stappen, elk met een werkwoord vooraan.',
          'De stappen staan in de volgorde waarin je ze echt doet.'
        ],
        feedback: 'Knap werk. Je stappen kan een ander zo overnemen.'
      },
      {
        prompt: 'Wat doet een herhaling in een stappenplan?',
        leerdoel: 'Je weet wat een herhaling en een keuze in een stappenplan zijn.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Die kijkt naar een voorwaarde en gaat dan de ene of de andere kant op.', correct: false, misconception: 'Verwart de herhaling met de keuze.' },
          { text: 'Die maakt van jouw plan een programma dat de computer meteen begrijpt.', correct: false, misconception: 'Denkt dat een herhaling het plan omzet in code.' },
          { text: 'Die laat dezelfde stappen een paar keer achter elkaar gebeuren.', correct: true, explanation: 'Zo hoef je die stappen maar een keer op te schrijven.' },
          { text: 'Die zet alle stappen van jouw plan netjes in de goede volgorde.', correct: false, misconception: 'Denkt dat een herhaling het sorteren doet.' }
        ],
        feedback: 'Precies. Een herhaling scheelt je een hoop schrijfwerk.'
      },
      {
        prompt: 'In "als het regent, dan pak je een jas" is "het regent" de voorwaarde.',
        waar: true,
        leerdoel: 'Je weet wat een herhaling en een keuze in een stappenplan zijn.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed. De voorwaarde staat altijd tussen "als" en "dan".'
      },
      {
        prompt: 'Welke zin is een keuze en geen herhaling?',
        leerdoel: 'Je weet wat een herhaling en een keuze in een stappenplan zijn.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Doe dit twintig keer achter elkaar en stop dan pas met tellen.', correct: false, misconception: 'Herkent een herhaling met een vast aantal niet.' },
          { text: 'Als je gym hebt, dan pak je ook je sporttas uit de kast.', correct: true, explanation: 'Hier hangt het af van iets dat waar of niet waar kan zijn.' },
          { text: 'Herhaal voor elk vak op je rooster: pak het boek en het schrift.', correct: false, misconception: 'Denkt dat "voor elk vak" een keuze is in plaats van een herhaling.' }
        ],
        feedback: 'Mooi. Het woordje "als" verraadt bijna altijd een keuze.'
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
        keyTerms: ['Scratch', 'sprite', 'script'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sanne opent Scratch. Ze legt het blok "neem 10 stappen" los op het werkveld. Ze klikt op de groene vlag. Er gebeurt niets. Hoe kan dat?</p>',
          '<p><strong>Antwoord.</strong> Haar blok hangt nergens aan vast. Er staat geen startblok boven. De computer weet dus niet wanneer dat blok aan de beurt is. Sanne moet het gele startblok pakken. Dat blok heet: wanneer op de groene vlag wordt geklikt. Ze klikt "neem 10 stappen" eronder vast. Nu staan er twee blokken in een script. Klikt ze nu op de vlag, dan loopt haar sprite echt.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['startblok', 'herhaal-blok', 'als-dan-blok'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Ravi wil dat zijn kat blijft lopen. Bij de rand moet hij "Boing!" roepen. Hij legt zijn als-dan-blok onder de herhaling in plaats van erin. Wat gaat er mis?</p>',
          '<p><strong>Antwoord.</strong> De herhaling stopt nooit. Het als-dan-blok komt dus nooit aan de beurt. De kat roept nooit "Boing!". Ravi moet het als-dan-blok in de herhaling leggen. Dan wordt bij elke ronde gekeken: raak ik de rand? Is dat waar, dan roept de kat "Boing!". Is dat niet waar, dan loopt hij gewoon door. De plek van een blok bepaalt dus hoe vaak het werkt.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>In Scratch klik je blokken aan elkaar tot een programma. Het figuur op het speelveld heet een sprite. Elk programma begint met het gele startblok. Daarna volgen je herhaling en je keuze.</p>',
      keyTerms: ['sprite', 'startblok']
    },
    vragen: [
      {
        prompt: 'De sprite is het figuur op het speelveld dat jouw opdrachten uitvoert.',
        waar: true,
        leerdoel: 'Je kunt met blokken een klein programma maken dat werkt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Goed. De kat van Scratch is het bekendste voorbeeld van een sprite.'
      },
      {
        prompt: 'Wat is een script in Scratch?',
        leerdoel: 'Je kunt met blokken een klein programma maken dat werkt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'De stapel blokken die je onder elkaar hebt vastgeklikt.', correct: true, explanation: 'Die stapel samen is jouw programma.' },
          { text: 'Het figuurtje dat over het speelveld heen en weer beweegt.', correct: false, misconception: 'Verwart het script met de sprite.' },
          { text: 'De achtergrond die je onder je figuurtje kunt kiezen.', correct: false, misconception: 'Verwart het script met het decor.' },
          { text: 'De knop waarmee je jouw project op de computer opslaat.', correct: false, misconception: 'Denkt dat script een opslagknop is.' }
        ],
        feedback: 'Prima. Een script is dus gewoon jouw stapel blokken.'
      },
      {
        prompt: 'Zonder startblok gebeurt er niets als je op de groene vlag klikt.',
        waar: true,
        leerdoel: 'Je kunt met blokken een klein programma maken dat werkt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Het startblok zegt wanneer je programma mag beginnen.'
      },
      {
        prompt: 'Welk blok zet je helemaal bovenaan je script?',
        leerdoel: 'Je kunt in je programma een herhaling en een als-dan-keuze gebruiken.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Het oranje blok waarin je andere blokken legt om ze vaker te doen.', correct: false, misconception: 'Denkt dat de herhaling het script start.' },
          { text: 'Het blauwe blok waarmee je jouw figuurtje tien stappen laat lopen.', correct: false, misconception: 'Denkt dat het eerste beweegblok de start is.' },
          { text: 'Het gele blok van de groene vlag, want dat start je script.', correct: true, explanation: 'Zonder dat blok weet de computer niet wanneer hij begint.' }
        ],
        feedback: 'Mooi. Geel bovenaan, dan pas de rest van je blokken.'
      },
      {
        prompt: 'Je wilt dat je kat de hele tijd blijft doorlopen. Welk blok heb je nodig?',
        leerdoel: 'Je kunt in je programma een herhaling en een als-dan-keuze gebruiken.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Het als-dan-blok, want daar schuif je een voorwaarde in.', correct: false, misconception: 'Verwart de keuze met de herhaling.' },
          { text: 'Nog twintig keer het blok "neem 10 stappen" onder elkaar.', correct: false, misconception: 'Bouwt een herhaling na met losse blokken.' },
          { text: 'Het herhaal-blok, met "neem 10 stappen" erin gelegd.', correct: true, explanation: 'Alles wat in de herhaling ligt gaat steeds opnieuw.' }
        ],
        feedback: 'Sterk. Met een herhaling hoef je maar een blok te gebruiken.'
      },
      {
        prompt: 'Het als-dan-blok mag buiten de herhaling liggen als je elke ronde wilt controleren.',
        waar: false,
        leerdoel: 'Je kunt in je programma een herhaling en een als-dan-keuze gebruiken.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Buiten de herhaling wordt er maar een keer gekeken.'
      },
      {
        prompt: 'Leg in drie zinnen uit wat jouw eigen Scratch-programma doet. Begin bij het startblok.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen wat jouw programma stap voor stap doet.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Bijvoorbeeld: mijn programma start als je op de groene vlag klikt. Daarna begint de herhaling en loopt de kat steeds tien stappen. Raakt hij de rand, dan roept hij Boing.',
        nakijkpunten: [
          'De uitleg begint bij het startblok en loopt daarna naar beneden.',
          'De herhaling en de keuze worden allebei genoemd.'
        ],
        feedback: 'Knap. Je uitleg volgt netjes de volgorde van je blokken.'
      },
      {
        prompt: 'Waarom helpt navertellen als je programma niet doet wat je wilde?',
        leerdoel: 'Je kunt uitleggen wat jouw programma stap voor stap doet.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Omdat Scratch dan zelf het ontbrekende blok voor je aanvult.', correct: false, misconception: 'Denkt dat de editor fouten oplost.' },
          { text: 'Omdat je bij elk blok moet zeggen wat het doet, en dan zie je het gat.', correct: true, explanation: 'Waar je blijft hangen, zit meestal ook de fout.' },
          { text: 'Omdat je programma sneller wordt als je hem hardop uitspreekt.', correct: false, misconception: 'Denkt dat uitleggen invloed heeft op de snelheid.' }
        ],
        feedback: 'Precies. Uitleggen dwingt je elke stap echt te benoemen.'
      },
      {
        prompt: 'De blokken in je script werken net als de genummerde stappen van een algoritme.',
        waar: true,
        leerdoel: 'Je kunt uitleggen wat een algoritme is als stappenplan.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'reflecteren',
        feedback: 'Goed verband gelegd. De plek in de stapel bepaalt de beurt.'
      },
      {
        prompt: 'In gewone taal schreef je: herhaal tien keer, doe een stap. Hoe heet dat stuk?',
        leerdoel: 'Je weet wat een herhaling en een keuze in een stappenplan zijn.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Een voorwaarde, want die kan waar of niet waar zijn.', correct: false, misconception: 'Verwart de herhaling met de voorwaarde.' },
          { text: 'Een keuze, want je kiest zelf hoeveel keer het gebeurt.', correct: false, misconception: 'Denkt dat elk getal in een plan een keuze is.' },
          { text: 'Een herhaling, want dezelfde stap gebeurt steeds opnieuw.', correct: true, explanation: 'Het aantal staat erbij, dus je weet precies hoe vaak.' }
        ],
        feedback: 'Mooi. Dit is dezelfde herhaling die je nu in blokken bouwt.'
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
        keyTerms: ['bug', 'programmeur'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Nadia speelt een game. Haar figuurtje loopt dwars door de muur heen. Het spel crasht niet. Is dit een bug?</p>',
          '<p><strong>Antwoord.</strong> Ja, dit is een bug. Het spel draait gewoon door. Toch doet het iets anders dan de makers wilden. Een muur hoort je tegen te houden. Veel leerlingen denken dat een bug altijd een crash is. Dat klopt niet. Een verkeerd getal is ook een bug. Een blok dat op de verkeerde plek ligt ook. Elke programmeur maakt zulke fouten, elke dag opnieuw.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['debuggen', 'herstellen'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Youssef past drie dingen tegelijk aan in zijn script. Daarna werkt het weer. Waarom is hij toch niet klaar?</p>',
          '<p><strong>Antwoord.</strong> Hij weet nu niet welke verandering hielp. Misschien hielp er maar een. De andere twee kunnen later nieuwe fouten geven. Zo hoort het wel: verander een ding. Klik op de groene vlag. Kijk of het klopt. Werkt het niet, zet het dan terug. Ga dan pas naar het volgende ding. Zo koppel je elke verandering aan een uitkomst. Dat is precies wat debuggen betekent.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een bug is een fout waardoor je programma iets anders doet. Fouten zoeken en oplossen heet debuggen. Verander steeds een ding tegelijk en test daarna. Feedback van een klasgenoot laat je zien wat jij zelf mist.</p>',
      keyTerms: ['bug', 'debuggen']
    },
    vragen: [
      {
        prompt: 'Het woord bug betekent letterlijk insect.',
        waar: true,
        leerdoel: 'Je weet wat een bug is en hoe je die opspoort.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Goed. In 1947 zat er echt een mot in een computer.'
      },
      {
        prompt: 'Wat is een bug in een programma?',
        leerdoel: 'Je weet wat een bug is en hoe je die opspoort.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Een fout waardoor het programma iets anders doet dan bedoeld.', correct: true, explanation: 'Dat kan een crash zijn, maar ook een verkeerd getal.' },
          { text: 'Een stuk code dat de maker er expres in heeft gestopt als grap.', correct: false, misconception: 'Denkt dat een bug altijd met opzet is gemaakt.' },
          { text: 'Een virus dat via internet in jouw programma is gekropen.', correct: false, misconception: 'Verwart een bug met een virus.' },
          { text: 'Een melding die je krijgt als je te lang aan het programmeren bent.', correct: false, misconception: 'Denkt dat een bug een waarschuwing van de computer is.' }
        ],
        feedback: 'Prima. Anders dan bedoeld: dat is het hele idee van een bug.'
      },
      {
        prompt: 'Een programma dat gewoon draait kan geen bug hebben.',
        waar: false,
        leerdoel: 'Je weet wat een bug is en hoe je die opspoort.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Ook een draaiend programma kan fout werken.'
      },
      {
        prompt: 'Je programma doet iets raars. Wat doe je als eerste?',
        leerdoel: 'Je kunt je programma testen en zien waar het misgaat.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Alles weggooien en je hele programma opnieuw beginnen te bouwen.', correct: false, misconception: 'Denkt dat opnieuw beginnen sneller is dan zoeken.' },
          { text: 'Meteen tien blokken tegelijk verwisselen en dan nog eens kijken.', correct: false, misconception: 'Verandert te veel tegelijk en kan niets meer koppelen.' },
          { text: 'Terugzoeken tot het punt waar het nog wel goed ging.', correct: true, explanation: 'Vlak na dat punt zit bijna altijd de fout.' }
        ],
        feedback: 'Sterk. Het laatste goede moment wijst je de fout aan.'
      },
      {
        prompt: 'Bij testen verander je steeds een ding tegelijk en test je daarna opnieuw.',
        waar: true,
        leerdoel: 'Je kunt je programma testen en zien waar het misgaat.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Zo weet je zeker welke verandering iets deed.'
      },
      {
        prompt: 'Waarom schrijf je vooraf op wat er zou moeten gebeuren?',
        leerdoel: 'Je kunt je programma testen en zien waar het misgaat.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat je docent anders geen cijfer voor je programma mag geven.', correct: false, misconception: 'Denkt dat een testplan alleen voor de beoordeling is.' },
          { text: 'Omdat je programma sneller gaat draaien als je het opschrijft.', correct: false, misconception: 'Denkt dat een testplan invloed heeft op de snelheid.' },
          { text: 'Omdat Scratch anders je project niet automatisch wil bewaren.', correct: false, misconception: 'Verwart een testplan met opslaan.' },
          { text: 'Omdat je dan kunt vergelijken met wat er echt gebeurt.', correct: true, explanation: 'Zonder verwachting weet je niet of iets fout ging.' }
        ],
        feedback: 'Mooi. Zonder verwachting kun je niets vergelijken.'
      },
      {
        prompt: 'Een klasgenoot ziet dat jouw kat op zijn kop hangt. Wat doe je met die opmerking?',
        type: 'open',
        leerdoel: 'Je kunt je programma verbeteren na feedback van een klasgenoot.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Bijvoorbeeld: ik vraag hem precies wanneer hij het zag. Daarna klik ik zelf op de groene vlag en kijk ik of het klopt. Het klopte, dus ik pas de draaistijl aan. In mijn verslag schrijf ik op dat ik deze tip heb overgenomen.',
        nakijkpunten: [
          'Je controleert de opmerking eerst zelf voordat je iets verandert.',
          'Je schrijft op of je de tip overneemt en waarom.'
        ],
        feedback: 'Knap. Eerst zelf checken, dan pas veranderen: goede volgorde.'
      },
      {
        prompt: 'Wat zet je in je verslag over de tips van je klasgenoot?',
        leerdoel: 'Je kunt je programma verbeteren na feedback van een klasgenoot.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Alleen de tips die je hebt overgenomen, de rest laat je gewoon weg.', correct: false, misconception: 'Denkt dat afgewezen tips niet hoeven te worden genoemd.' },
          { text: 'Wat je overnam, wat niet, en waarom je dat zo koos.', correct: true, explanation: 'Zo ziet je docent dat je echt hebt nagedacht.' },
          { text: 'De naam van je klasgenoot, want dan weet je docent wie hielp.', correct: false, misconception: 'Denkt dat alleen de naam telt en niet de keuze.' }
        ],
        feedback: 'Precies. Ook een tip die je niet volgt hoort in je verslag.'
      },
      {
        prompt: 'Je sprite beweegt helemaal niet. Welk blok controleer je als eerste?',
        leerdoel: 'Je kunt met blokken een klein programma maken dat werkt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Het als-dan-blok, want daar zit meestal de fout in verstopt.', correct: false, misconception: 'Zoekt binnenin voordat de buitenkant gecheckt is.' },
          { text: 'Het gele startblok, want zonder dat begint er niets.', correct: true, explanation: 'Je werkt van buiten naar binnen: eerst of het start.' },
          { text: 'Het blok met het aantal stappen, want tien is misschien te weinig.', correct: false, misconception: 'Denkt dat de afstand het probleem is in plaats van de start.' }
        ],
        feedback: 'Goed verband. Eerst kijken of het script überhaupt begint.'
      },
      {
        prompt: 'Het als-dan-blok kijkt naar een voorwaarde, net als de keuze in je stappenplan.',
        waar: true,
        leerdoel: 'Je kunt in je programma een herhaling en een als-dan-keuze gebruiken.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'reflecteren',
        feedback: 'Goed onthouden. Hetzelfde idee, alleen nu in een blok.'
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
          '<p><strong>Vraag.</strong> Jesse maakt zijn Canva-account met zijn eigen Gmail. Zijn poster staat er mooi op. Welke twee problemen krijgt hij later?</p>',
          '<p><strong>Antwoord.</strong> Zijn werk hangt niet aan zijn schoolaccount. Zijn docent kan er dus niet zomaar bij. Op een schoolcomputer moet hij eerst zijn privémail openen. Dat lukt niet altijd. Stopt hij ooit met dat Gmail-adres, dan is zijn werk weg. Daarom gebruik je op school altijd je schoolmail. Alles wat je met dat adres maakt, blijft aan school gekoppeld.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['homepagina', 'zoekbalk', 'plusknop', 'Downloaden'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Amber heeft een donkere foto als achtergrond. Haar zwarte titel valt helemaal weg. Wat kan zij doen?</p>',
          '<p><strong>Antwoord.</strong> Er zijn twee manieren. Manier een: ze klikt op een leeg stuk. Bovenin komt het kleurwieltje. Daarmee maakt ze de achtergrond lichter. Manier twee: ze klikt op haar titel. Daarna maakt ze de letterkleur wit. Allebei werkt, want leesbaar zijn komt van verschil. Ligt er nog een plaatje over haar titel? Dan klikt ze met de rechtermuisknop, kiest "laag" en zet het plaatje naar achteren.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Canva is een gratis ontwerptool voor posters en flyers. Je maakt je account met je schoolmail. Op de homepagina start je een nieuw ontwerp met de plus. Je slaat je poster op via Delen en dan Downloaden.</p>',
      keyTerms: ['Canva', 'homepagina']
    },
    vragen: [
      {
        prompt: 'Waarvoor gebruik je Canva?',
        leerdoel: 'Je kunt met je schoolmail een Canva-account maken en inloggen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Om online posters, flyers en presentaties te ontwerpen.', correct: true, explanation: 'Je kiest een template en past die aan met eigen tekst en beeld.' },
          { text: 'Om je bestanden op te slaan zodat je er overal bij kunt.', correct: false, misconception: 'Verwart Canva met een cloudopslag zoals OneDrive.' },
          { text: 'Om te chatten met klasgenoten over je huiswerk voor morgen.', correct: false, misconception: 'Verwart Canva met een berichtenapp.' },
          { text: 'Om te controleren of een tekst van internet echt klopt.', correct: false, misconception: 'Verwart Canva met een zoekmachine of factchecker.' }
        ],
        feedback: 'Goed. Canva is er om iets moois mee te ontwerpen.'
      },
      {
        prompt: 'Je maakt je Canva-account voor school aan met je schoolmail.',
        waar: true,
        leerdoel: 'Je kunt met je schoolmail een Canva-account maken en inloggen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Klopt. Dan blijft je werk gekoppeld aan je schoolaccount.'
      },
      {
        prompt: 'Wat vind je linksboven op de homepagina van Canva?',
        leerdoel: 'Je kunt met je schoolmail een Canva-account maken en inloggen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Een lijst met alle ontwerpen die je klasgenoten hebben gemaakt.', correct: false, misconception: 'Denkt dat je andermans werk op je eigen pagina ziet.' },
          { text: 'De knop waarmee je je poster meteen als PDF kunt opslaan.', correct: false, misconception: 'Verwart de plusknop met de downloadknop.' },
          { text: 'Een grote plusknop om een nieuw ontwerp te beginnen.', correct: true, explanation: 'Met die knop start je zonder eerst te hoeven zoeken.' }
        ],
        feedback: 'Mooi. De plus is je snelste weg naar een nieuw ontwerp.'
      },
      {
        prompt: 'In Canva moet je na elke wijziging zelf op een knop Opslaan drukken.',
        waar: false,
        leerdoel: 'Je kunt een A4-poster starten en tekst, elementen en kleur toevoegen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Goed opgelet. Canva bewaart je werk helemaal vanzelf.'
      },
      {
        prompt: 'Je typt poster in de zoekbalk. Welke keuze past bij de opdracht?',
        leerdoel: 'Je kunt een A4-poster starten en tekst, elementen en kleur toevoegen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een liggende poster, want die past beter op een computerscherm.', correct: false, misconception: 'Kiest liggend omdat een scherm liggend is.' },
          { text: 'Het staande posterformaat, dus "poster staand, A3".', correct: true, explanation: 'Canva noemt dat A3, maar het is dezelfde staande poster.' },
          { text: 'Een presentatie, want daar staan ook tekst en plaatjes op.', correct: false, misconception: 'Denkt dat elk formaat met tekst en beeld goed is.' }
        ],
        feedback: 'Sterk. Staand is de vorm die de opdracht van je vraagt.'
      },
      {
        prompt: 'Een plaatje ligt over je titel heen. Hoe krijg je de titel weer bovenop?',
        leerdoel: 'Je kunt een A4-poster starten en tekst, elementen en kleur toevoegen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je gooit het plaatje weg, want anders lukt het nooit meer.', correct: false, misconception: 'Denkt dat lagen niet te verschuiven zijn.' },
          { text: 'Je maakt je titel groter, dan komt hij er vanzelf overheen.', correct: false, misconception: 'Denkt dat grootte bepaalt wat vooraan staat.' },
          { text: 'Rechtermuisknop op het plaatje, dan "laag", dan naar achteren.', correct: true, explanation: 'Met lagen bepaal jij welk element voor het andere staat.' }
        ],
        feedback: 'Precies. Lagen bepalen wie voor wie staat op je poster.'
      },
      {
        prompt: 'De titel van je poster mag hooguit vijf woorden lang zijn.',
        waar: true,
        leerdoel: 'Je kunt een A4-poster starten en tekst, elementen en kleur toevoegen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Kort houden zorgt dat je titel groot en leesbaar blijft.'
      },
      {
        prompt: 'Welke twee knoppen gebruik je om je ontwerp als bestand te bewaren?',
        leerdoel: 'Je kunt je ontwerp downloaden of delen als PNG of PDF.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Eerst Bestand linksboven, daarna Opslaan als in het menu.', correct: false, misconception: 'Gebruikt de route van Word in plaats van die van Canva.' },
          { text: 'Eerst Delen rechtsboven, daarna Downloaden in het menu.', correct: true, explanation: 'Alles wat je ontwerp verlaat zit achter de knop Delen.' },
          { text: 'Eerst de plusknop links, daarna Exporteren onderin het scherm.', correct: false, misconception: 'Verwart starten van een ontwerp met bewaren.' }
        ],
        feedback: 'Mooi. Delen en dan Downloaden: die route ken je nu.'
      },
      {
        prompt: 'Je hebt betaalde elementen gebruikt en downloaden lukt niet. Noem de drie uitwegen.',
        type: 'open',
        leerdoel: 'Je kunt je ontwerp downloaden of delen als PNG of PDF.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Een: ik vervang de betaalde elementen door gratis elementen die erop lijken. Twee: ik maak een schermafbeelding en snijd daar alleen mijn poster uit. Drie: ik deel een link naar mijn ontwerp in plaats van een bestand.',
        nakijkpunten: [
          'Alle drie de uitwegen worden genoemd, elk in een eigen zin.',
          'Bij de schermafbeelding staat erbij dat je de poster eruit snijdt.'
        ],
        feedback: 'Knap werk. Met deze drie kom je altijd nog van je poster af.'
      },
      {
        prompt: 'Fouten in een programma zoeken en oplossen heet debuggen.',
        waar: true,
        leerdoel: 'Je weet wat een bug is en hoe je die opspoort.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'reflecteren',
        feedback: 'Goed onthouden uit 8.3. Debuggen is zoeken en herstellen.'
      },
      {
        prompt: 'Je testte je Scratch-programma. Wat deed je toen er iets misging?',
        leerdoel: 'Je kunt je programma testen en zien waar het misgaat.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Ik veranderde een ding en klikte daarna meteen op de groene vlag.', correct: true, explanation: 'Zo weet je precies welke verandering het verschil maakte.' },
          { text: 'Ik veranderde alles wat mij verdacht leek en keek daarna pas.', correct: false, misconception: 'Verandert te veel tegelijk en kan de oorzaak niet vinden.' },
          { text: 'Ik vroeg mijn docent om het programma voor mij op te lossen.', correct: false, misconception: 'Denkt dat testen het werk van de docent is.' }
        ],
        feedback: 'Sterk. Een ding tegelijk werkt bij Scratch en bij Canva.'
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
        keyTerms: ['chatbot', 'TalkAI', 'prompt', 'doelgroep'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Lisa typt bij de chatbot alleen het woord "cyberpesten". Ze krijgt een lang, saai verhaal terug. Hoe maakt zij haar prompt beter?</p>',
          '<p><strong>Antwoord.</strong> Ze zet er vier onderdelen in. De opdracht: geef vier tips. Het onderwerp: tegen cyberpesten. De doelgroep: voor leerlingen van twaalf jaar. De lengte: elke tip hooguit twintig woorden. Samen wordt dat een zin. "Geef vier tips tegen cyberpesten voor leerlingen van twaalf jaar, elke tip hooguit twintig woorden." Nu krijgt Lisa tekst die zo op haar poster past.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['poster', 'leesbaar', 'druk'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Op de poster van Tim staan zeven plaatjes en vijf kleuren. Zijn titel is twaalf woorden lang. Wat moet hij veranderen?</p>',
          '<p><strong>Antwoord.</strong> Drie dingen. Hij gaat terug naar een of twee plaatjes. Hij kiest hooguit drie kleuren die bij elkaar passen. En hij kort zijn titel in tot een paar woorden. Alle drie de veranderingen doen hetzelfde: ze geven rust. Een poster wordt maar een paar seconden bekeken. Alles wat afleidt kost Tim dus lezers. De lege ruimte die overblijft is geen verspilling, maar juist de stilte waarin zijn titel opvalt.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Met een goede prompt haal je bruikbare informatie bij een chatbot. Die informatie schrijf je altijd om in je eigen woorden. Een poster is pas leesbaar als de tekst niet wegvalt. Houd hem rustig: weinig plaatjes en hooguit drie kleuren.</p>',
      keyTerms: ['prompt', 'leesbaar']
    },
    vragen: [
      {
        prompt: 'Welke vier onderdelen horen er in een goede prompt?',
        leerdoel: 'Je kunt met een chatbot informatie verzamelen over jouw onderwerp.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'De opdracht, het onderwerp, de doelgroep en de lengte.', correct: true, explanation: 'Met die vier hoeft de chatbot niets meer te gokken.' },
          { text: 'De datum, je naam, je klas en het vak waarvoor je het maakt.', correct: false, misconception: 'Verwart een prompt met de kop van een werkstuk.' },
          { text: 'Een vraag, een plaatje, een kleur en een titel voor je poster.', correct: false, misconception: 'Verwart de prompt met de onderdelen van de poster.' },
          { text: 'Het onderwerp, de bron, de datum en de naam van de schrijver.', correct: false, misconception: 'Verwart een prompt met een bronvermelding.' }
        ],
        feedback: 'Goed. Deze vier ken je nog uit hoofdstuk 7 over chatbots.'
      },
      {
        prompt: 'Alleen het woord "cyberpesten" typen is al een goede prompt.',
        waar: false,
        leerdoel: 'Je kunt met een chatbot informatie verzamelen over jouw onderwerp.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Goed opgelet. Dan moet de chatbot alles zelf gokken.'
      },
      {
        prompt: 'Waarvoor gebruik je de chatbot bij deze eindopdracht?',
        leerdoel: 'Je kunt met een chatbot informatie verzamelen over jouw onderwerp.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Om de hele poster te laten maken en die daarna in te leveren.', correct: false, misconception: 'Denkt dat de chatbot het werk overneemt.' },
          { text: 'Om informatie en ideeën over jouw onderwerp te verzamelen.', correct: true, explanation: 'Jij blijft de maker; de chatbot levert alleen bouwstof.' },
          { text: 'Om te controleren of jouw kleuren wel bij elkaar passen.', correct: false, misconception: 'Denkt dat de chatbot het ontwerp beoordeelt.' }
        ],
        feedback: 'Prima. De chatbot helpt je aan stof, jij maakt de poster.'
      },
      {
        prompt: 'Het antwoord van de chatbot mag letterlijk op je poster.',
        waar: false,
        leerdoel: 'Je kunt die informatie in je eigen woorden op een poster zetten.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed. Je schrijft het om, anders is de tekst niet van jou.'
      },
      {
        prompt: 'Herschrijf voor een poster: "Het is raadzaam terughoudend te zijn met persoonsgegevens."',
        type: 'open',
        leerdoel: 'Je kunt die informatie in je eigen woorden op een poster zetten.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Bijvoorbeeld: "Deel je adres en telefoonnummer nooit online." De zin is kort, gebruikt gewone woorden en noemt een concreet voorbeeld.',
        nakijkpunten: [
          'De nieuwe zin is korter en gebruikt alledaagse woorden.',
          'Er staat een concreet voorbeeld in, zoals je adres of je nummer.'
        ],
        feedback: 'Knap. Jouw zin snapt iedereen in een oogopslag.'
      },
      {
        prompt: 'Waarom zet je de informatie van de chatbot in je eigen woorden?',
        leerdoel: 'Je kunt die informatie in je eigen woorden op een poster zetten.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat de chatbot anders je poster niet mag laten downloaden.', correct: false, misconception: 'Denkt dat de chatbot regels stelt over downloaden.' },
          { text: 'Omdat de tekst anders niet van jou is en je hem niet kunt uitleggen.', correct: true, explanation: 'Je docent kan je altijd vragen wat er staat.' },
          { text: 'Omdat de chatbot altijd in het Engels antwoord op jouw vragen geeft.', correct: false, misconception: 'Denkt dat het alleen om de taal van het antwoord gaat.' }
        ],
        feedback: 'Sterk. Wat je zelf schrijft, kun je ook zelf uitleggen.'
      },
      {
        prompt: 'Wanneer is een poster leesbaar?',
        leerdoel: 'Je kunt een poster maken die leesbaar, rustig en aantrekkelijk is.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Als er zoveel mogelijk informatie op staat over jouw onderwerp.', correct: false, misconception: 'Denkt dat meer tekst een poster beter maakt.' },
          { text: 'Als de tekst niet wegvalt in de foto of in de achtergrond.', correct: true, explanation: 'Verschil tussen letter en ondergrond maakt tekst leesbaar.' },
          { text: 'Als je titel in minstens vier verschillende kleuren geschreven is.', correct: false, misconception: 'Denkt dat veel kleuren de titel beter laten opvallen.' },
          { text: 'Als er onderaan een lange uitleg staat over wat je bedoelt.', correct: false, misconception: 'Denkt dat extra uitleg de poster duidelijker maakt.' }
        ],
        feedback: 'Mooi. Leesbaar zijn draait helemaal om verschil.'
      },
      {
        prompt: 'Witruimte op een poster is verspilde ruimte die je beter kunt opvullen.',
        waar: false,
        leerdoel: 'Je kunt een poster maken die leesbaar, rustig en aantrekkelijk is.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Juist die lege ruimte laat je titel opvallen.'
      },
      {
        prompt: 'Hoeveel kleuren gebruik je hooguit op je poster?',
        leerdoel: 'Je kunt een poster maken die leesbaar, rustig en aantrekkelijk is.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Zoveel als je mooi vindt, want kleur maakt een poster vrolijk.', correct: false, misconception: 'Denkt dat meer kleur altijd aantrekkelijker is.' },
          { text: 'Precies een kleur, want anders wordt het meteen te rommelig.', correct: false, misconception: 'Denkt dat maar een kleur is toegestaan.' },
          { text: 'Twee of drie kleuren die goed bij elkaar passen.', correct: true, explanation: 'Elke extra kleur vraagt aandacht die je titel nodig heeft.' }
        ],
        feedback: 'Precies. Twee of drie kleuren houden je poster rustig.'
      },
      {
        prompt: 'In welke twee bestandsformaten lever je je Canva-ontwerp in?',
        leerdoel: 'Je kunt je ontwerp downloaden of delen als PNG of PDF.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Als PNG of als PDF, allebei via de knop Downloaden.', correct: true, explanation: 'Beide bestanden kan je docent gewoon openen.' },
          { text: 'Als Word-bestand of als PowerPoint, want dat kent iedereen.', correct: false, misconception: 'Verwart de formaten van Office met die van Canva.' },
          { text: 'Als link of als schermfoto, want een bestand is niet nodig.', correct: false, misconception: 'Denkt dat de uitwegen de gewone manier zijn.' }
        ],
        feedback: 'Goed onthouden uit 8.4. PNG en PDF zijn je twee opties.'
      },
      {
        prompt: 'Je start je poster in Canva met de grote plusknop links op de homepagina.',
        waar: true,
        leerdoel: 'Je kunt een A4-poster starten en tekst, elementen en kleur toevoegen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'reflecteren',
        feedback: 'Klopt. Diezelfde plus gebruikte je vorige les ook al.'
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
        keyTerms: ['digitale geletterdheid', 'afsluiting'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Bij zijn terugblik schrijft Kaan alleen: "ik heb veel geleerd". Waarom telt dat niet mee?</p>',
          '<p><strong>Antwoord.</strong> Hij noemt niets concreets. Zijn docent leest niet wat hij nu weet. Zo wordt het wel goed: "Ik wist niet dat een slotje geen bewijs is. Nu kijk ik eerst naar de URL van een webshop." Nu staat er wat hij leerde. En waar hij dat merkt. Terugkijken betekent het verschil tussen toen en nu benoemen. Noem dus altijd een voorbeeld uit je eigen leven.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['eindcreatie', 'licentie', 'lesmateriaal'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Fatima wil laten zien dat zij nepnieuws kan herkennen. Welke optie past daar het best bij?</p>',
          '<p><strong>Antwoord.</strong> Optie C past goed. Op drie dia\'s kan zij het netjes uit elkaar halen. Dia 1: een voorbeeld van nepnieuws. Dia 2: de kenmerken waaraan je het ziet. Dia 3: hoe je het controleert. Elke dia krijgt een titel, een afbeelding en korte uitleg. Kiest zij optie A, dan moet alles op een poster. Dat is sterk voor een boodschap, maar te weinig ruimte voor drie stappen. Kies dus de optie die past bij wat je wilt bewijzen.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Je sluit dit jaar af met een terugblik en een eigen eindcreatie. Bij een terugblik noem je wat je nu weet en waar je dat merkt. Je kiest zelf Canva, Word of PowerPoint. Onderaan noem je van wie het lesmateriaal is.</p>',
      keyTerms: ['eindcreatie', 'terugblik']
    },
    vragen: [
      {
        prompt: 'Een algoritme zegt precies wat er moet gebeuren en in welke volgorde.',
        waar: true,
        leerdoel: 'Je kunt uitleggen wat een algoritme is als stappenplan.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed begin. Precies en op volgorde: dat is een algoritme.'
      },
      {
        prompt: 'Waarom mag een klasgenoot die jouw stappenplan test niet zelf meedenken?',
        leerdoel: 'Je kunt uitleggen wat een algoritme is als stappenplan.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat hij anders je stappen kan onthouden en later kan gebruiken.', correct: false, misconception: 'Denkt dat het om afkijken gaat.' },
          { text: 'Omdat hij anders sneller klaar is dan jij en dat is niet eerlijk.', correct: false, misconception: 'Denkt dat testen een wedstrijd is.' },
          { text: 'Omdat een computer ook niets zelf invult, dus hij mag dat ook niet.', correct: true, explanation: 'Anders merk je nooit welke stap je vergeten was.' }
        ],
        feedback: 'Sterk. Een tester die meedenkt verstopt juist jouw fouten.'
      },
      {
        prompt: 'Noem twee stappen die mensen bijna altijd vergeten op te schrijven.',
        type: 'open',
        leerdoel: 'Je kunt een dagelijkse handeling in duidelijke stappen opschrijven.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        modelAnswer: 'Bijvoorbeeld: het pakken van je spullen aan het begin. En het controleren achteraf of het echt gelukt is. Die handelingen doe je zonder nadenken, dus je schrijft ze niet op.',
        nakijkpunten: [
          'Er staan twee echte stappen genoemd, niet een algemene opmerking.',
          'Er staat bij waarom die stappen vergeten worden.'
        ],
        feedback: 'Knap. Je herkent nu zelf welke stappen risico geven.'
      },
      {
        prompt: 'Welke zin is een herhaling?',
        leerdoel: 'Je weet wat een herhaling en een keuze in een stappenplan zijn.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Als de accu leeg is, dan zoek je een stopcontact in de klas.', correct: false, misconception: 'Herkent het woordje "als" niet als keuze.' },
          { text: 'Herhaal tot de accu vol is: laat de kabel in je telefoon zitten.', correct: true, explanation: 'Hier gebeurt dezelfde stap steeds opnieuw.' },
          { text: 'Pak de kabel en steek de stekker in het stopcontact naast je.', correct: false, misconception: 'Ziet een gewone stap aan voor een herhaling.' }
        ],
        feedback: 'Mooi. Het woord "herhaal" wijst je meteen de weg.'
      },
      {
        prompt: 'In Scratch kun je een tikfout maken die je programma stukmaakt.',
        waar: false,
        leerdoel: 'Je kunt met blokken een klein programma maken dat werkt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Je klikt blokken, dus typen hoeft niet.'
      },
      {
        prompt: 'Wat heb je nodig voordat een blok in Scratch iets kan doen?',
        leerdoel: 'Je kunt met blokken een klein programma maken dat werkt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een account, want zonder inloggen werkt de editor helemaal niet.', correct: false, misconception: 'Denkt dat inloggen verplicht is om te bouwen.' },
          { text: 'Een startblok erboven waar het blok aan vastgeklikt zit.', correct: true, explanation: 'Anders weet de computer niet wanneer het aan de beurt is.' },
          { text: 'Een achtergrond, want een sprite kan niet op een leeg veld lopen.', correct: false, misconception: 'Denkt dat het decor nodig is om te kunnen draaien.' }
        ],
        feedback: 'Precies. Los op het veld doet een blok helemaal niets.'
      },
      {
        prompt: 'Waar leg je het als-dan-blok als je elke ronde de rand wilt controleren?',
        leerdoel: 'Je kunt in je programma een herhaling en een als-dan-keuze gebruiken.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Onder de herhaling, zodat hij pas aan het einde wordt gedaan.', correct: false, misconception: 'Denkt dat onder de herhaling hetzelfde is als erin.' },
          { text: 'Binnen de herhaling, tussen de andere blokken in.', correct: true, explanation: 'Alles wat erin ligt wordt elke ronde opnieuw gedaan.' },
          { text: 'Boven het startblok, want dan gaat hij als allereerste kijken.', correct: false, misconception: 'Denkt dat de bovenste plek de belangrijkste is.' }
        ],
        feedback: 'Sterk. Binnen de herhaling wordt er elke ronde gekeken.'
      },
      {
        prompt: 'Beschrijf in drie zinnen wat er in jouw programma gebeurt na de groene vlag.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen wat jouw programma stap voor stap doet.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Bijvoorbeeld: na de groene vlag begint de herhaling. Daarbinnen loopt mijn sprite tien stappen en keert hij om aan de rand. Raakt hij de rand, dan roept hij Boing.',
        nakijkpunten: [
          'De drie zinnen volgen de blokken van boven naar beneden.',
          'Zowel de herhaling als de keuze komt erin voor.'
        ],
        feedback: 'Knap gedaan. Je programma is nu voor iedereen te volgen.'
      },
      {
        prompt: 'Bij het zoeken van een fout verander je liever drie dingen tegelijk.',
        waar: false,
        leerdoel: 'Je kunt je programma testen en zien waar het misgaat.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed. Anders weet je nooit welke verandering hielp.'
      },
      {
        prompt: 'Wat staat er in een testplan dat je vooraf opschrijft?',
        leerdoel: 'Je kunt je programma testen en zien waar het misgaat.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De namen van de klasgenoten die jouw programma gaan uitproberen.', correct: false, misconception: 'Denkt dat een testplan een deelnemerslijst is.' },
          { text: 'De blokken die je gebruikt hebt, netjes op volgorde genoteerd.', correct: false, misconception: 'Verwart het testplan met een lijst van je blokken.' },
          { text: 'De dingen die zouden moeten werken als alles goed gaat.', correct: true, explanation: 'Daarmee vergelijk je later wat er echt gebeurde.' }
        ],
        feedback: 'Mooi. Eerst je verwachting, daarna pas de test.'
      },
      {
        prompt: 'Een bug is alleen een bug als het programma helemaal vastloopt.',
        waar: false,
        leerdoel: 'Je weet wat een bug is en hoe je die opspoort.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Ook een verkeerd getal is gewoon een bug.'
      },
      {
        prompt: 'Hoe komt het dat je een fout vaak zelf vindt tijdens het hardop uitleggen?',
        leerdoel: 'Je weet wat een bug is en hoe je die opspoort.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat je bij elke stap moet zeggen wat hij doet, en dan valt het gat op.', correct: true, explanation: 'In je hoofd sla je bekende stappen stilzwijgend over.' },
          { text: 'Omdat je klasgenoot altijd precies weet welk blok jij mist.', correct: false, misconception: 'Denkt dat de luisteraar het antwoord geeft.' },
          { text: 'Omdat je programma opnieuw start zodra je erover begint te praten.', correct: false, misconception: 'Denkt dat uitleggen iets aan het programma verandert.' }
        ],
        feedback: 'Sterk. Uitspreken dwingt je elke stap te benoemen.'
      },
      {
        prompt: 'Je klasgenoot geeft een tip die jij niet gaat gebruiken. Wat doe je?',
        leerdoel: 'Je kunt je programma verbeteren na feedback van een klasgenoot.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je laat hem weg uit je verslag, want hij levert je toch niets op.', correct: false, misconception: 'Denkt dat alleen gebruikte tips genoemd hoeven worden.' },
          { text: 'Je schrijft op dat je hem niet overneemt, met een reden erbij.', correct: true, explanation: 'Zo laat je zien dat je er echt over hebt nagedacht.' },
          { text: 'Je voert hem toch uit, want feedback moet je altijd opvolgen.', correct: false, misconception: 'Denkt dat feedback een bevel is.' }
        ],
        feedback: 'Precies. Jij blijft de maker, maar je legt je keuze uit.'
      },
      {
        prompt: 'Waarom maak je je Canva-account met je schoolmail en niet met je privémail?',
        leerdoel: 'Je kunt met je schoolmail een Canva-account maken en inloggen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat Canva alleen schoolmailadressen accepteert bij het registreren.', correct: false, misconception: 'Denkt dat een privéadres geweigerd wordt.' },
          { text: 'Omdat je werk dan bij school hoort en je er overal bij kunt.', correct: true, explanation: 'Je docent kan je zo ook bereiken over je ontwerp.' },
          { text: 'Omdat je met je schoolmail alle betaalde elementen gratis krijgt.', correct: false, misconception: 'Denkt dat het schooladres de betaalde versie ontgrendelt.' }
        ],
        feedback: 'Goed. Alles met dat adres blijft aan je schoolaccount hangen.'
      },
      {
        prompt: 'Welke vier dingen zie je op de homepagina van Canva?',
        leerdoel: 'Je kunt met je schoolmail een Canva-account maken en inloggen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een zoekbalk, een plusknop, je eerdere ontwerpen en de templates.', correct: true, explanation: 'Met die vier vind je alles terug op elke computer.' },
          { text: 'Een prullenbak, een kleurwieltje, een tijdlijn en een lagenmenu.', correct: false, misconception: 'Noemt onderdelen uit de editor in plaats van de homepagina.' },
          { text: 'Een agenda, een cijferlijst, een berichtenvak en je rooster.', correct: false, misconception: 'Verwart Canva met de schoolomgeving.' }
        ],
        feedback: 'Mooi. Deze vier ken je nu uit je hoofd.'
      },
      {
        prompt: 'Je klikt op een wit stuk van je poster. Wat verschijnt er dan bovenin?',
        leerdoel: 'Je kunt een A4-poster starten en tekst, elementen en kleur toevoegen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een menu waarmee je je poster meteen kunt versturen naar je docent.', correct: false, misconception: 'Verwart de kleurkeuze met delen.' },
          { text: 'Een kleurwieltje waarmee je de achtergrondkleur kiest.', correct: true, explanation: 'Kies een kleur waarbij je tekst goed leesbaar blijft.' },
          { text: 'Een lijst met templates die bij jouw onderwerp zouden passen.', correct: false, misconception: 'Denkt dat klikken op de achtergrond templates opent.' }
        ],
        feedback: 'Sterk. Met het kleurwieltje red je een onleesbare titel.'
      },
      {
        prompt: 'Canva slaat je ontwerp automatisch op terwijl je bezig bent.',
        waar: true,
        leerdoel: 'Je kunt een A4-poster starten en tekst, elementen en kleur toevoegen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Zoeken naar een opslaanknop is dus verspilde tijd.'
      },
      {
        prompt: 'Achter welke knop zitten downloaden en een link delen allebei?',
        leerdoel: 'Je kunt je ontwerp downloaden of delen als PNG of PDF.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Achter Bestand, linksboven in het scherm van je ontwerp.', correct: false, misconception: 'Gebruikt de menustructuur van Word.' },
          { text: 'Achter Delen, rechtsboven in het scherm van je ontwerp.', correct: true, explanation: 'Alles wat je ontwerp verlaat loopt via die ene knop.' },
          { text: 'Achter Ontwerpen, in het menu links naast je poster.', correct: false, misconception: 'Verwart het ontwerpmenu met de deelknop.' }
        ],
        feedback: 'Goed. Delen is de uitgang van elk Canva-ontwerp.'
      },
      {
        prompt: 'Lukt downloaden niet, dan mag je ook een link naar je ontwerp delen.',
        waar: true,
        leerdoel: 'Je kunt je ontwerp downloaden of delen als PNG of PDF.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Een link is een volwaardige derde uitweg.'
      },
      {
        prompt: 'Welke prompt levert de bruikbaarste tekst voor jouw poster op?',
        leerdoel: 'Je kunt met een chatbot informatie verzamelen over jouw onderwerp.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Vertel me alles wat je weet over privacy op internet en social media.', correct: false, misconception: 'Vraagt te breed en krijgt een algemeen verhaal terug.' },
          { text: 'Geef drie tips over privacy voor twaalfjarigen, elk hooguit vijftien woorden.', correct: true, explanation: 'Opdracht, onderwerp, doelgroep en lengte staan er alle vier in.' },
          { text: 'Privacy online, graag een leuk antwoord met veel voorbeelden erbij.', correct: false, misconception: 'Denkt dat een losse zoekterm met een wens genoeg is.' }
        ],
        feedback: 'Sterk. Vier onderdelen, dus niets meer te gokken.'
      },
      {
        prompt: 'Een chatbot kan zich vergissen, dus je controleert wat je overneemt.',
        waar: true,
        leerdoel: 'Je kunt met een chatbot informatie verzamelen over jouw onderwerp.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed. Jij blijft zelf verantwoordelijk voor je poster.'
      },
      {
        prompt: 'Wat is het probleem met tekst die je letterlijk van een chatbot overneemt?',
        leerdoel: 'Je kunt die informatie in je eigen woorden op een poster zetten.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Die tekst is niet van jou en je kunt hem meestal niet uitleggen.', correct: true, explanation: 'Je docent kan altijd vragen wat er precies staat.' },
          { text: 'Die tekst is altijd in het Engels en past dus niet op je poster.', correct: false, misconception: 'Denkt dat het probleem bij de taal zit.' },
          { text: 'Die tekst is te kort, want een chatbot antwoordt altijd in een zin.', correct: false, misconception: 'Denkt dat chatbotantwoorden altijd kort zijn.' }
        ],
        feedback: 'Precies. Je moet je eigen poster kunnen toelichten.'
      },
      {
        prompt: 'Wat verandert er als je een poster minder vol maakt?',
        leerdoel: 'Je kunt een poster maken die leesbaar, rustig en aantrekkelijk is.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Er is minder te lezen, dus mensen leren er ook minder van.', correct: false, misconception: 'Denkt dat meer tekst meer oplevert.' },
          { text: 'De titel en het beeld vallen beter op bij wie voorbijloopt.', correct: true, explanation: 'Een poster wordt maar een paar seconden bekeken.' },
          { text: 'De poster wordt saai, want kleur en beeld maken hem juist mooi.', correct: false, misconception: 'Verwart rust met saaiheid.' }
        ],
        feedback: 'Mooi. Rust is precies wat je boodschap laat opvallen.'
      },
      {
        prompt: 'Je poster moet over een onderwerp uit de lijst van negen gaan.',
        waar: true,
        leerdoel: 'Je kunt een poster maken die leesbaar, rustig en aantrekkelijk is.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Buiten die lijst kun je geen punten krijgen.'
      },
      {
        prompt: 'Terugkijken op je jaar betekent opschrijven wat je nu weet en waar je dat merkt.',
        waar: true,
        leerdoel: 'Je kunt terugkijken op wat je dit jaar geleerd hebt over digitale geletterdheid.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'reflecteren',
        feedback: 'Goed. Een voorbeeld uit je eigen leven maakt het echt.'
      },
      {
        prompt: 'Waarom noem je onderaan je eindcreatie van wie het lesmateriaal is?',
        leerdoel: 'Je kunt terugkijken op wat je dit jaar geleerd hebt over digitale geletterdheid.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Omdat je docent anders niet weet in welke klas jij zit.', correct: false, misconception: 'Verwart bronvermelding met je eigen naamgegevens.' },
          { text: 'Omdat de licentie CC BY 4.0 vraagt dat je de maker noemt.', correct: true, explanation: 'Bij die licentie mag je alles, mits je de naam erbij zet.' },
          { text: 'Omdat je anders geen afbeeldingen uit Canva mag gebruiken.', correct: false, misconception: 'Verwart de licentie van de les met die van Canva.' }
        ],
        feedback: 'Sterk. Dezelfde regel over bronnen als in paragraaf 1.4.'
      },
      {
        prompt: 'Welke drie programma\'s mag je kiezen voor je eindcreatie?',
        leerdoel: 'Je kunt je kennis laten zien in een eigen eindcreatie in Canva, Word of PowerPoint.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Scratch, Outlook of OneDrive, want die gebruikte je ook dit jaar.', correct: false, misconception: 'Noemt programma\'s uit andere hoofdstukken.' },
          { text: 'Canva, Word of PowerPoint, elk met hun eigen eisen.', correct: true, explanation: 'De drie opties tellen even zwaar mee.' },
          { text: 'Alleen Canva, want daar heb je de vorige twee lessen aan gewerkt.', correct: false, misconception: 'Denkt dat de poster verplicht is.' }
        ],
        feedback: 'Goed. Je kiest zelf welke optie bij jou past.'
      },
      {
        prompt: 'Bij optie B gebruik je koppen, vetgedrukte woorden en paginanummers.',
        waar: true,
        leerdoel: 'Je kunt je kennis laten zien in een eigen eindcreatie in Canva, Word of PowerPoint.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'Klopt. Die opmaak leerde je in hoofdstuk 4 bij Word.'
      }
    ]
  }
};
