// Verrijkingslaag hoofdstuk 6 - Mediawijs: social media, welzijn en betrouwbaar
// nieuws. Basisberoepsgerichte leerweg (bb).
//
// Zie scripts/seed-verrijking/PATROON.md voor het formaat van een vraag, de
// regels over afleiders en de eisen aan feedback.
//
// Dit hoofdstuk heeft in bb ZES paragrafen: 6.2 tot en met 6.7. 6.1 vervalt
// voor basis en 6.8 is de plusparagraaf van de theoretische leerweg. 6.2 is
// hier dus de eerste paragraaf van het hoofdstuk en kijkt nergens op terug;
// vanaf 6.3 heeft elke afsluitquiz terugkeervragen.
//
// Opzet per paragraaf, volgens de blauwdruk en het bb-profiel:
//   - elk leerdoel heeft zijn EIGEN startvraag. Die staan als `checks` in
//     scripts/seed-structuur/bb/h6.mjs, met antwoord en uitleg erbij. 6.2 opent
//     daarnaast met twee voorkennisvragen over hoofdstuk 5, want de
//     bron-eindtoets van les 15 gaat over les 9 tot en met 14;
//   - elk theorieblok heeft een uitgewerkt voorbeeld in vraag-en-antwoordvorm.
//     Dat voorbeeld komt VOOR het oefenblok en dus voor het zelfstandig
//     oefenen. In bb is het voorbeeld altijd een situatie uit hun eigen wereld:
//     een klassenapp, een game, de schermtijd op hun telefoon;
//   - elke afsluitquiz vanaf 6.3 haalt minstens een leerdoel op uit een
//     EERDERE paragraaf van dit hoofdstuk. Spreiden is een van de twee
//     technieken waar de blauwdruk hard bewijs voor heeft;
//   - de hoofdstuktoets van 6.7 bevraagt alle ZEVENTIEN verplichte leerdoelen
//     van 6.2 tot en met 6.7, en elk leerdoel precies TWEE keer. Dat is de eis
//     van de blauwdruk (elk doel 2x) en het is nageteld: 34 toetsvragen over
//     17 leerdoelen. Voeg je hier een vraag toe, houd dat evenwicht dan heel.
//
// BB-VORM: VEEL KLEINE MOMENTEN
// -----------------------------
// Het bb-profiel zegt: vorm gaat voor inhoud, en een leerling moet elke minuut
// iets kunnen aanklikken. Daarom staan er in dit hoofdstuk veel korte vragen in
// plaats van een paar grote. Geteld over heel hoofdstuk 6 in bb: 39 meerkeuze,
// 32 waar-niet-waar en 7 open vragen op 78 vragen totaal. Dat is bewust een
// andere verhouding dan in kb (63 / 28 / 9): ruim veertig procent van de vragen
// is hier een korte goed-of-fout-knop, tegen ruim twintig procent in kb. Elk van
// de vijf afsluitquizzen heeft tien vragen en de hoofdstuktoets er 28, zodat de
// tokens over veel kleine momenten verdeeld worden in plaats van over een paar
// dikke vragen aan het eind. Blind de bovenste knop klikken levert 25 van de 71
// gesloten vragen goed (35 procent), want de waar-niet-waar-stellingen zijn
// bewust half waar en half niet waar.
//
// De reden waarom een antwoord goed is staat in `explanation`, niet in de
// antwoordtekst zelf. Feedback is kort, positief en benoemt wat er goed ging.
//
// RAADBAARHEID OP VORM
// --------------------
// Blind de langste knop klikken levert hier 2 van de 39 meerkeuzevragen goed
// (5 procent), ruim onder het kansniveau van ongeveer 30 procent. De afleiders
// zijn met opzet even lang of langer geschreven dan het goede antwoord, en de
// reden waarom iets klopt staat in `explanation`. Het goede antwoord staat
// gespreid over positie 1 tot en met 4 (11 / 12 / 14 / 2).
//
// De bb-vragen zijn opnieuw geschreven en niet overgenomen uit kb/h6.mjs of
// tl/h6.mjs: kortere zinnen, een idee per vraag en scenario's uit de leefwereld
// van een brugklasser.

export default {
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
          '<p><strong>Vraag.</strong> Milan kijkt elk half uur in de klassenapp. Zijn zus koopt dezelfde jas als haar vriendinnen. Welk gevoel hoort bij wie?</p>',
          '<p><strong>Antwoord.</strong> Bij Milan hoort FOMO. Hij is bang dat hij iets mist. Daarom pakt hij steeds zijn telefoon. Bij zijn zus hoort druk. Zij doet iets omdat de groep het ook doet. Kijk goed waar het gevoel vandaan komt. FOMO zit binnen in jou. Druk komt van de groep om je heen. En je zelfbeeld? Zie je op TikTok steeds perfecte lichamen, dan word je onzeker over het jouwe.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['highlight reel-effect', 'influencer', 'sociale bevestiging', 'filterbubbel'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Nadia post een foto en telt de hele avond haar likes. Bij 80 likes is ze blij. Bij 12 likes baalt ze van zichzelf. In haar tijdlijn staan alleen nog perfecte vakantiefoto\'s. Welke twee begrippen zie je hier?</p>',
          '<p><strong>Antwoord.</strong> Het eerste is sociale bevestiging. Nadia meet haar waarde af aan een getal. Dat getal bepalen anderen. Likes zeggen niets over wie zij is. Het tweede is de filterbubbel. Zij kijkt lang naar mooie foto\'s. Daarna krijgt ze er steeds meer. Andere beelden verdwijnen uit haar tijdlijn. Let ook op de filters: die maken een foto mooier dan hij echt is.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>FOMO is bang zijn dat je iets mist; druk is meemoeten. Online zie je alleen de mooie kant van anderen. In je filterbubbel komen steeds dezelfde berichten voorbij. Meldingen uitzetten en pauzes plannen helpen je echt.</p>',
      keyTerms: ['FOMO', 'filterbubbel']
    },
    vragen: [
      {
        prompt: 'FOMO betekent dat je bang bent dat je iets leuks mist.',
        waar: true,
        leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Goed gezien. FOMO komt uit het Engels en betekent bang zijn iets te missen.'
      },
      {
        prompt: 'Wat is druk voelen?',
        leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'De angst dat er iets leuks gebeurt terwijl jij even niet kijkt.', correct: false, misconception: 'Verwart druk met FOMO.' },
          { text: 'De manier waarop jij naar jezelf kijkt en over jezelf denkt.', correct: false, misconception: 'Verwart druk met je zelfbeeld.' },
          { text: 'Het idee dat je alleen je mooiste momenten mag laten zien.', correct: false, misconception: 'Verwart druk met het highlight reel-effect.' },
          { text: 'Het gevoel dat je iets moet doen omdat anderen het ook doen.', correct: true, explanation: 'Je doet mee omdat de groep het doet of van je verwacht.' }
        ],
        feedback: 'Prima keuze. Druk gaat over meedoen met de groep, niet over iets missen.'
      },
      {
        prompt: 'Je zelfbeeld gaat over hoe andere mensen naar jou kijken.',
        waar: false,
        leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Je zelfbeeld gaat juist over hoe jij over jezelf denkt.'
      },
      {
        prompt: 'Wat is het highlight reel-effect?',
        leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Dat de app jou steeds dezelfde soort filmpjes blijft laten zien.', correct: false, misconception: 'Verwart het highlight reel-effect met de filterbubbel.' },
          { text: 'Dat een filter je huid en de kleuren van je foto mooier maakt.', correct: false, misconception: 'Verwart het effect met filters en bewerkingen.' },
          { text: 'Dat mensen online vooral hun mooiste momenten laten zien.', correct: true, explanation: 'Je vergelijkt je hele dag met de beste seconden van iemand anders.' },
          { text: 'Dat je je waarde afmeet aan het aantal likes dat je krijgt.', correct: false, misconception: 'Verwart het effect met sociale bevestiging.' }
        ],
        feedback: 'Sterk. Je ziet de hoogtepunten van een ander naast jouw gewone dag.'
      },
      {
        prompt: 'Wat is een filterbubbel?',
        leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een situatie waarin je steeds dezelfde soort berichten ziet.', correct: true, explanation: 'Andere meningen en beelden verdwijnen dan uit je tijdlijn.' },
          { text: 'Een knop waarmee je vervelende reacties automatisch verbergt.', correct: false, misconception: 'Denkt dat een filterbubbel een instelling is die je aanzet.' },
          { text: 'Een bewerking die je huid op een foto gladder laat lijken.', correct: false, misconception: 'Verwart de filterbubbel met een fotofilter.' }
        ],
        feedback: 'Mooi. In een bubbel lijkt het alsof iedereen hetzelfde vindt.'
      },
      {
        prompt: 'Een influencer is iemand die de app maakt en de regels bepaalt.',
        waar: false,
        leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Een influencer heeft veel volgers en beïnvloedt anderen.'
      },
      {
        prompt: 'Sociale bevestiging betekent dat likes bepalen hoe jij je voelt.',
        waar: true,
        leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Precies. Veel likes voelt goed, weinig likes voelt minder waard.'
      },
      {
        prompt: 'Wat kun jij doen om positiever met social media om te gaan?',
        leerdoel: 'Je kunt twee dingen noemen die jij kunt doen om positiever met social media om te gaan.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Zo veel mogelijk volgers verzamelen, want dan voel je je beter.', correct: false, misconception: 'Denkt dat veel volgers hebben je gelukkiger maakt.' },
          { text: 'Je meldingen uitzetten en soms een dagje geen social media.', correct: true, explanation: 'Zo kies jij zelf wanneer je kijkt in plaats van je telefoon.' },
          { text: 'Alleen nog kijken naar accounts met heel veel likes erop.', correct: false, misconception: 'Denkt dat populaire accounts vanzelf beter voor je zijn.' }
        ],
        feedback: 'Goed bezig. Deze twee zorgen dat jij weer de baas bent over je tijd.'
      },
      {
        prompt: 'Alleen de mooie kant van anderen zien geeft jou een eerlijk beeld.',
        waar: false,
        leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Sterk. Je ziet maar een klein stukje, dus vergelijken klopt nooit.'
      },
      {
        prompt: 'Noem twee dingen die jij morgen kunt doen om positiever met social media om te gaan. Zet er per ding bij wat er dan verandert.',
        type: 'open',
        leerdoel: 'Je kunt twee dingen noemen die jij kunt doen om positiever met social media om te gaan.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik zet mijn meldingen uit. Dan word ik niet steeds onderbroken en kies ik zelf wanneer ik kijk. Ik neem een dag pauze van TikTok. Dan houd ik tijd over voor voetbal en merk ik dat ik niets mis.',
        nakijkpunten: [
          'Er staan twee maatregelen in, bijvoorbeeld meldingen uit of een dag pauze.',
          'Bij elke maatregel staat wat er dan verandert.',
          'Het gaat over eigen gedrag, niet over wat anderen moeten doen.'
        ],
        feedback: 'Knap gedaan. Met het gevolg erbij laat je zien dat je de tip echt snapt.'
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
          '<p><strong>Vraag.</strong> In de klassenapp staat elke dag een gemene opmerking over Sem. Sem zegt er niets van. Is dit cyberpesten? En waarom voelt het thuis ook door?</p>',
          '<p><strong>Antwoord.</strong> Ja, dit is cyberpesten. Het gebeurt via een app. Het is gericht op een persoon. En het gaat door, ook als Sem niets zegt. Thuis houdt het niet op. Zijn telefoon ligt daar ook. Daarom is cyberpesten vaak zwaarder dan pesten op het plein. Let op: sommige pesters maken hiervoor een nepaccount met een valse naam.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['slachtoffer', 'pester', 'omstander', 'reputatie'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> In een game wordt Yara buitengesloten. Twee spelers doen mee. Vijf anderen kijken toe en zeggen niets. Wat houdt elke rol hieraan over?</p>',
          '<p><strong>Antwoord.</strong> Yara is het slachtoffer. Zij slaapt slecht en krijgt buikpijn. De twee spelers zijn de pester. Zij kunnen straf krijgen. Ook krijgen zij een slechte naam in de groep. De vijf anderen zijn omstander. Zij hebben later spijt. Ze denken ook: ben ik straks de volgende?</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Cyberpesten is pesten via internet, telefoon of games. Het gaat dag en nacht door en stopt niet thuis. Het slachtoffer krijgt klachten, de pester krijgt straf. Wie toekijkt heet omstander en houdt er spijt aan over.</p>',
      keyTerms: ['cyberpesten', 'omstander']
    },
    vragen: [
      {
        prompt: 'Cyberpesten is pesten via internet, telefoon of games.',
        waar: true,
        leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Goed zo. Het gaat om pesten met een scherm ertussen.'
      },
      {
        prompt: 'Wat is een voorbeeld van cyberpesten?',
        leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Iemand laten struikelen op het schoolplein tijdens de pauze.', correct: false, misconception: 'Denkt dat pesten op het plein ook cyberpesten is.' },
          { text: 'Met iemand praten over zijn of haar gevoelens na de les.', correct: false, misconception: 'Ziet praten over gevoelens aan voor pesten.' },
          { text: 'Een leuke meme delen met je vrienden in een privéchat.', correct: false, misconception: 'Denkt dat elke grap in een chat pesten is.' },
          { text: 'Iemand uitschelden in een groepsapp waar de klas in zit.', correct: true, explanation: 'Het gebeurt via een app en het is gericht op een persoon.' }
        ],
        feedback: 'Precies. Uitschelden in een groepsapp doet iedereen mee lezen.'
      },
      {
        prompt: 'Cyberpesten stopt zodra je thuiskomt en je telefoon weglegt.',
        waar: false,
        leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Het gaat dag en nacht door, ook als je thuis bent.'
      },
      {
        prompt: 'Welke klacht kan een slachtoffer van cyberpesten krijgen?',
        leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Een betere reputatie bij de rest van de klas op school.', correct: false, misconception: 'Denkt dat pesten het slachtoffer populair maakt.' },
          { text: 'Meer volgers, want iedereen praat over hem of haar zaak.', correct: false, misconception: 'Denkt dat aandacht krijgen hetzelfde is als steun krijgen.' },
          { text: 'Slecht slapen, hoofdpijn of buikpijn door de spanning.', correct: true, explanation: 'Ook al gebeurt het via een scherm, je lichaam voelt het echt.' }
        ],
        feedback: 'Klopt. Pijn in je buik of je hoofd is een echt signaal.'
      },
      {
        prompt: 'Een omstander is degene die de gemene berichten heeft verstuurd.',
        waar: false,
        leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed gezien. Een omstander kijkt toe: hij pest niet mee en helpt niet.'
      },
      {
        prompt: 'Wat betekent anoniem?',
        leerdoel: 'Je weet wat de woorden anoniem, omstander en reputatie betekenen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Dat niemand weet wie er achter een account zit.', correct: true, explanation: 'De naam en de foto zeggen dan niets over wie het echt is.' },
          { text: 'Dat anderen precies weten hoe jij over iemand denkt.', correct: false, misconception: 'Verwart anoniem met openlijk je mening geven.' },
          { text: 'Dat je alleen berichten stuurt aan mensen die je kent.', correct: false, misconception: 'Denkt dat anoniem iets met je vriendenlijst te maken heeft.' }
        ],
        feedback: 'Mooi. Anoniem voelt veilig voor de pester, maar het is niet netjes.'
      },
      {
        prompt: 'Wat betekent reputatie?',
        leerdoel: 'Je weet wat de woorden anoniem, omstander en reputatie betekenen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een account zonder naam waarmee je iemand kunt pesten.', correct: false, misconception: 'Verwart reputatie met een anoniem account.' },
          { text: 'Iemand die het pesten ziet gebeuren en niets terugzegt.', correct: false, misconception: 'Verwart reputatie met de omstander.' },
          { text: 'Hoe anderen over jou denken en of ze jou vertrouwen.', correct: true, explanation: 'Een pester raakt dat vertrouwen kwijt, ook bij mensen buiten de app.' }
        ],
        feedback: 'Sterk. Je reputatie is je naam bij anderen, en die raak je snel kwijt.'
      },
      {
        prompt: 'In een filterbubbel kom je juist heel veel verschillende meningen tegen.',
        waar: false,
        leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Deze vraag kwam uit 6.2, en je weet hem nog. In een bubbel zie je juist steeds hetzelfde.'
      },
      {
        prompt: 'Waarom koopt Fleur dezelfde schoenen als de rest van haar groep?',
        leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ze voelt druk: het gevoel dat je mee moet doen met de groep.', correct: true, explanation: 'Wat ze doet wordt bepaald door wat de groep van haar verwacht.' },
          { text: 'Ze heeft FOMO: ze is bang dat ze iets leuks op haar scherm mist.', correct: false, misconception: 'Verwart druk met FOMO, dat over missen gaat.' },
          { text: 'Ze zit in een filterbubbel en ziet daardoor alleen schoenen.', correct: false, misconception: 'Denkt dat een filterbubbel je koopgedrag bepaalt.' }
        ],
        feedback: 'Deze stof is van 6.2. Fijn dat je druk en FOMO uit elkaar houdt.'
      },
      {
        prompt: 'Leg in twee zinnen uit waarom cyberpesten zwaarder kan voelen dan pesten op het schoolplein.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Cyberpesten gaat dag en nacht door. Het stopt niet als je thuiskomt, want je telefoon ligt daar ook. De pester kan bovendien anoniem blijven, dus je weet vaak niet eens wie het is.',
        nakijkpunten: [
          'Er staat in dat cyberpesten dag en nacht doorgaat.',
          'Er staat iets in over anoniem zijn of over de grote groep die meeleest.'
        ],
        feedback: 'Goed uitgelegd. Je noemde het verschil dat er echt toe doet.'
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
        keyTerms: ['screenshot', 'blokkeren', 'vertrouwenspersoon'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Bo krijgt elke avond gemene berichten van hetzelfde account. Ze wil de pester meteen blokkeren. Wat doet ze beter eerst?</p>',
          '<p><strong>Antwoord.</strong> Bo maakt eerst van elk bericht een screenshot. Dat is haar bewijs. Na het blokkeren ziet ze de berichten soms niet meer. Daarna blokkeert ze het account. Dan komt er niets meer binnen. Als laatste laat ze de screenshots zien aan haar mentor of aan de vertrouwenspersoon.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['rapporteren', 'aangifte'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Tim leest mee in een groepsapp waarin een klasgenoot wordt uitgescholden. Hij durft er niet openlijk iets van te zeggen. Wat kan hij toch doen?</p>',
          '<p><strong>Antwoord.</strong> Tim stuurt zijn klasgenoot een privébericht: gaat het? Dan voelt die zich minder alleen. Daarna meldt hij het bij zijn mentor. Dat is helpen, geen klikken. In de app kan hij het bericht ook rapporteren. Gaat het heel ver, dan kunnen ouders aangifte doen bij de politie.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Word je gepest? Maak screenshots, blokkeer en ga naar je mentor of de vertrouwenspersoon. Zie je iemand anders gepest worden? Stuur een berichtje en meld het. Bij Pestweb en de Kindertelefoon vraag je hulp zonder je naam. Aangifte doen betekent dat je naar de politie stapt.</p>',
      keyTerms: ['vertrouwenspersoon', 'aangifte']
    },
    vragen: [
      {
        prompt: 'Een screenshot is een foto van je scherm die je als bewijs bewaart.',
        waar: true,
        leerdoel: 'Je weet wat je kunt doen als je zelf gepest wordt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Goed. Met dat bewijs kun je later laten zien wat er stond.'
      },
      {
        prompt: 'Wat doe je als eerste als jij online gepest wordt?',
        leerdoel: 'Je weet wat je kunt doen als je zelf gepest wordt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Terugschelden, want dan weet de pester dat je niet bang bent.', correct: false, misconception: 'Denkt dat terugpesten het pesten laat stoppen.' },
          { text: 'Erover praten met je ouders, je mentor of een goede vriend.', correct: true, explanation: 'Je hoeft het niet alleen op te lossen, en dat lucht meteen op.' },
          { text: 'Je account weggooien en snel een nieuw account aanmaken.', correct: false, misconception: 'Denkt dat weglopen van het account het probleem oplost.' }
        ],
        feedback: 'Fijn gekozen. De eerste stap is altijd: het aan iemand vertellen.'
      },
      {
        prompt: 'Na het blokkeren kun je de oude berichten altijd nog terugvinden.',
        waar: false,
        leerdoel: 'Je weet wat je kunt doen als je zelf gepest wordt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed. Blokkeren geeft rust, maar maak eerst je screenshots.'
      },
      {
        prompt: 'Wat doe je als je ziet dat een klasgenoot online gepest wordt?',
        leerdoel: 'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Niets zeggen, want anders ben je zelf misschien de volgende.', correct: false, misconception: 'Denkt dat zwijgen jou veilig houdt.' },
          { text: 'Het bericht doorsturen naar anderen, zodat iedereen het weet.', correct: false, misconception: 'Denkt dat doorsturen helpt, terwijl het het pesten vergroot.' },
          { text: 'Hem privé een berichtje sturen en het melden bij een docent.', correct: true, explanation: 'Zo voelt hij zich minder alleen en gaat er iemand iets doen.' },
          { text: 'Zelf ook een grapje maken, dan valt het minder op.', correct: false, misconception: 'Denkt dat meelachen de spanning eruit haalt.' }
        ],
        feedback: 'Mooi. Een klein berichtje maakt voor het slachtoffer al veel uit.'
      },
      {
        prompt: 'Het melden bij een docent is klikken en dus niet aardig.',
        waar: false,
        leerdoel: 'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed gezien. Melden is helpen: je haalt iemand uit de problemen.'
      },
      {
        prompt: 'Wat betekent aangifte doen?',
        leerdoel: 'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Bij de app melden dat een bericht echt niet door de beugel kan.', correct: false, misconception: 'Verwart aangifte doen met rapporteren bij de app.' },
          { text: 'Naar de politie gaan om te melden dat er iets ergs is gebeurd.', correct: true, explanation: 'De politie kan daarna onderzoek doen naar wat er gebeurd is.' },
          { text: 'Aan je mentor vragen of hij het pesten wil laten stoppen.', correct: false, misconception: 'Verwart aangifte doen met het melden op school.' }
        ],
        feedback: 'Precies. Aangifte gaat naar de politie, niet naar de app of de school.'
      },
      {
        prompt: 'Waar kun je anoniem hulp vragen als je gepest wordt?',
        leerdoel: 'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Bij Pestweb of bij de Kindertelefoon, zonder je naam te zeggen.', correct: true, explanation: 'Anoniem betekent dat je niet hoeft te vertellen wie je bent.' },
          { text: 'Bij de pester zelf, door hem een heel lang bericht te sturen.', correct: false, misconception: 'Denkt dat je het met de pester zelf moet oplossen.' },
          { text: 'Bij een klasgenoot, die het dan doorvertelt aan de hele klas.', correct: false, misconception: 'Denkt dat je verhaal delen met de klas hetzelfde is als hulp.' }
        ],
        feedback: 'Goed onthouden. Bij deze twee hoef je je naam niet te zeggen.'
      },
      {
        prompt: 'Een pester kan straf krijgen en ook een slechte reputatie.',
        waar: true,
        leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Deze kwam uit 6.3. Fijn dat je de gevolgen per rol nog weet.'
      },
      {
        prompt: 'Wie is de omstander bij cyberpesten?',
        leerdoel: 'Je weet wat de woorden anoniem, omstander en reputatie betekenen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Degene die het gemene bericht als eerste heeft verstuurd.', correct: false, misconception: 'Verwart de omstander met de pester.' },
          { text: 'Degene over wie het gemene bericht in de app ging vandaag.', correct: false, misconception: 'Verwart de omstander met het slachtoffer.' },
          { text: 'Degene die het ziet gebeuren, niet meedoet en niets doet.', correct: true, explanation: 'Hij staat erbij en kijkt ernaar, en dat heeft ook gevolgen.' }
        ],
        feedback: 'Deze stof is van 6.3, en je hebt hem paraat. Goed werk.'
      },
      {
        prompt: 'Schrijf drie stappen op die je zet als jij zelf online gepest wordt. Zet per stap in een zin wat die stap oplevert.',
        type: 'open',
        leerdoel: 'Je weet wat je kunt doen als je zelf gepest wordt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Stap 1: ik praat erover met mijn moeder of mijn mentor, want dan sta ik er niet alleen voor. Stap 2: ik maak screenshots van de berichten, want dan heb ik bewijs. Stap 3: ik blokkeer de pester, want dan kan hij mij niets meer sturen en heb ik rust.',
        nakijkpunten: [
          'Er staan drie stappen in, in een logische volgorde.',
          'Screenshots maken komt voor het blokkeren.',
          'Bij elke stap staat wat die stap oplevert.'
        ],
        feedback: 'Netjes uitgewerkt. Je stappenplan kun je zo aan iemand geven.'
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
        keyTerms: ['bochel', 'blauw licht', 'melatonine'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Lisa gamet vier uur achter elkaar op de bank. Daarna doen haar schouders pijn en heeft ze hoofdpijn. Ze kan die avond niet in slaap komen. Welke twee oorzaken zie je hier?</p>',
          '<p><strong>Antwoord.</strong> De pijn komt van haar houding. Haar hoofd hing uren naar voren. Dat geeft spanning op haar nek en schouders. De hoofdpijn en het slecht slapen komen van blauw licht. Dat licht remt melatonine. Zonder melatonine wordt je lichaam niet slaperig.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['20-20-2', 'ooghoogte', 'nachtmodus', 'digitale verslaving'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Jayden maakt een uur huiswerk op zijn laptop. Hoeveel 20-20-2 pauzes hoort hij te nemen? En wat doet hij in zo\'n pauze?</p>',
          '<p><strong>Antwoord.</strong> Een uur is zestig minuten. Dat zijn drie volle blokken van twintig minuten. Jayden neemt dus drie pauzes. In elke pauze kijkt hij twintig seconden naar buiten. Minstens 6 meter ver, zo ver als de overkant van de straat. De 2 is geen pauze. Dat is een doel voor de hele dag: minstens twee uur naar buiten. Tussendoor zit hij rechtop, met zijn voeten plat en zijn scherm op ooghoogte. En \'s avonds zet hij nachtmodus aan tegen het blauwe licht.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Te lang op een scherm geeft pijn in nek en rug. Blauw licht geeft droge ogen en slechter slapen. De 20-20-2 regel: elke 20 minuten 20 seconden ver kijken, en 2 uur per dag naar buiten. Bij digitale verslaving kun je bijna niet meer stoppen.</p>',
      keyTerms: ['20-20-2', 'digitale verslaving']
    },
    vragen: [
      {
        prompt: 'Van te veel blauw licht kun je slechter in slaap komen.',
        waar: true,
        leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Goed zo. Blauw licht houdt je wakker terwijl je wilt slapen.'
      },
      {
        prompt: 'Welke klacht krijg je van een slechte houding achter je scherm?',
        leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Droge ogen, doordat je te weinig knippert met je ogen.', correct: false, misconception: 'Koppelt droge ogen aan de houding in plaats van aan het licht.' },
          { text: 'Rug- en nekklachten, doordat je hoofd naar voren hangt.', correct: true, explanation: 'Je nek draagt dan de hele tijd het gewicht van je hoofd.' },
          { text: 'Minder aandacht voor school, familie en je eigen hobby\'s.', correct: false, misconception: 'Koppelt een klacht van verslaving aan de houding.' }
        ],
        feedback: 'Precies. Een bochel ontstaat doordat je hoofd steeds vooruit hangt.'
      },
      {
        prompt: 'Blauw licht maakt extra melatonine aan, dus je slaapt er beter van.',
        waar: false,
        leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed gezien. Blauw licht remt melatonine juist, dus je blijft wakker.'
      },
      {
        prompt: 'Wat is een goed voorbeeld van de 20-20-2 regel?',
        leerdoel: 'Je kunt de 20-20-2 regel uitleggen en toepassen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Elke 20 minuten even heel snel op je mobiel kijken tussendoor.', correct: false, misconception: 'Denkt dat de pauze op een ander scherm mag.' },
          { text: 'Na 20 minuten je ogen 20 seconden helemaal dichtdoen.', correct: false, misconception: 'Denkt dat ogen dichtdoen hetzelfde is als ver weg kijken.' },
          { text: 'Na 20 minuten 20 seconden ver weg kijken, en 2 uur buiten.', correct: true, explanation: 'Ver weg kijken ontspant je ogen, en buiten zijn helpt je slaap.' },
          { text: 'Ongeveer 20 keer per minuut met je ogen knipperen.', correct: false, misconception: 'Denkt dat de regel over knipperen gaat.' }
        ],
        feedback: 'Sterk. Alle drie de getallen zitten in jouw antwoord.'
      },
      {
        prompt: 'Je maakt een uur huiswerk op je laptop. Hoeveel 20-20-2 pauzes horen daarbij?',
        leerdoel: 'Je kunt de 20-20-2 regel uitleggen en toepassen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een pauze, helemaal aan het einde van dat hele uur huiswerk.', correct: false, misconception: 'Denkt dat een pauze aan het eind voldoende is.' },
          { text: 'Drie pauzes, want een uur is drie keer twintig minuten.', correct: true, explanation: 'We tellen volle blokken van twintig minuten, dus zestig gedeeld door twintig.' },
          { text: 'Twintig pauzes, want je pauzeert steeds twintig seconden.', correct: false, misconception: 'Haalt de 20 minuten en de 20 seconden door elkaar.' }
        ],
        feedback: 'Goed gerekend. Zestig minuten geeft drie volle blokken van twintig.'
      },
      {
        prompt: 'In bed TikTokken tot twee uur \'s nachts is gezond schermgebruik.',
        waar: false,
        leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Je slaapt korter en de volgende dag ben je moe.'
      },
      {
        prompt: 'Waaraan herken je digitale verslaving bij jezelf?',
        leerdoel: 'Je weet waaraan je digitale verslaving bij jezelf kunt herkennen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Je hebt een keer een avond lang naar leuke filmpjes gekeken.', correct: false, misconception: 'Denkt dat een keer lang kijken al verslaving is.' },
          { text: 'Je vindt sommige apps veel leuker dan de andere apps op je telefoon.', correct: false, misconception: 'Denkt dat een voorkeur voor een app al een signaal is.' },
          { text: 'Je kunt bijna niet stoppen en wordt onrustig zonder telefoon.', correct: true, explanation: 'Niet kunnen stoppen en onrustig worden zijn samen een echt signaal.' }
        ],
        feedback: 'Mooi. Het gaat om niet kunnen stoppen, niet om een keer lang kijken.'
      },
      {
        prompt: 'Rusteloos worden zonder je telefoon is een signaal van digitale verslaving.',
        waar: true,
        leerdoel: 'Je weet waaraan je digitale verslaving bij jezelf kunt herkennen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Juist. Rusteloos worden hoort bij de drie signalen uit de les.'
      },
      {
        prompt: 'Rapporteren betekent dat je meteen aangifte doet bij de politie.',
        waar: false,
        leerdoel: 'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Deze kwam uit 6.4. Fijn dat je rapporteren en aangifte uit elkaar houdt.'
      },
      {
        prompt: 'Schrijf drie dingen op die jij morgen anders doet om digitaal gezonder te zijn. Zet per ding op wat het jou oplevert.',
        type: 'open',
        leerdoel: 'Je weet waaraan je digitale verslaving bij jezelf kunt herkennen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik ga rechtop zitten met mijn laptop op tafel. Dan hangt mijn hoofd niet naar voren en doet mijn nek minder pijn. Ik zet nachtmodus aan na acht uur. Dan krijg ik minder blauw licht en val ik sneller in slaap. Ik leg mijn telefoon na negen uur in de gang. Dan pak ik hem niet meer in bed.',
        nakijkpunten: [
          'Er staan drie concrete veranderingen in, geen algemene voornemens.',
          'Bij elke verandering staat wat het oplevert.',
          'Minstens een verandering gaat over houding of over blauw licht.'
        ],
        feedback: 'Goed gedaan. Drie kleine veranderingen merk je vaak al binnen een week.'
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
        keyTerms: ['nepnieuws', 'clickbait', 'bron'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je ziet op TikTok: "Bekende rapper vermoord in Parijs!" Er staat geen naam bij en de foto is korrelig. Loop de drie kenmerken langs.</p>',
          '<p><strong>Antwoord.</strong> Kenmerk 1: de kop is heftig en wil je laten klikken. Dat is clickbait. Kenmerk 2: er staat geen bron bij. Je weet niet wie het schreef. Kenmerk 3: de foto is korrelig en kan oud zijn. Drie keer raak, dus vertrouw dit bericht niet.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['deepfake', 'factcheck'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Er gaat een video rond waarin een bekende voetballer iets raars roept. Zijn mond beweegt normaal en zijn stem klinkt echt. Hoe controleer je dit?</p>',
          '<p><strong>Antwoord.</strong> Dit kan een deepfake zijn. Met AI is zijn gezicht over een andere video gezet. Ook zijn stem is nagemaakt. Doe daarom een factcheck. Typ de tekst in bij Google. Kijk of de NOS of het Jeugdjournaal er iets over zegt. Staat het nergens, dan is het bijna zeker nep.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Nepnieuws herken je aan de kop, de bron en de foto. Een heftige kop die je wil laten klikken heet clickbait. Een deepfake is een nepvideo die met AI gemaakt is. Check de bron altijd via Google of Nieuwscheckers.</p>',
      keyTerms: ['nepnieuws', 'deepfake']
    },
    vragen: [
      {
        prompt: 'Nepnieuws is nieuws dat niet waar is maar wel echt lijkt.',
        waar: true,
        leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Goed. Juist omdat het er netjes uitziet, trap je er makkelijk in.'
      },
      {
        prompt: 'Wat is clickbait?',
        leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Een heftige kop die is gemaakt om jou te laten klikken.', correct: true, explanation: 'De maker wil dat jij klikt. Of het bericht klopt, boeit hem niet.' },
          { text: 'Een foto die met AI is gemaakt en daardoor nep aanvoelt.', correct: false, misconception: 'Verwart clickbait met een nagemaakte foto.' },
          { text: 'Een website waarop je nieuwsberichten kunt laten checken.', correct: false, misconception: 'Verwart clickbait met een factchecksite.' }
        ],
        feedback: 'Precies. Een kop die te heftig klinkt, is bijna altijd clickbait.'
      },
      {
        prompt: 'Bij een bericht zonder bron weet je niet wie het geschreven heeft.',
        waar: true,
        leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Zonder naam kun jij niets nakijken.'
      },
      {
        prompt: 'Kars leest een heftig bericht. Er staat geen naam bij. Wat levert het hem op als hij de maker opzoekt?',
        leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Hij weet dan uit welk land het bericht komt.', correct: false, misconception: 'Denkt dat het land van herkomst iets zegt over waarheid.' },
          { text: 'Hij weet dan of het bericht echt of nep is.', correct: true, explanation: 'Nepnieuws is gevaarlijk zodra mensen het geloven en doorsturen.' },
          { text: 'Hij weet dan of de schrijver een leuk mens is.', correct: false, misconception: 'Denkt dat je de schrijver aardig moet vinden.' }
        ],
        feedback: 'Sterk. Jij checkt eerst wie het zegt, en pas daarna of je het gelooft.'
      },
      {
        prompt: 'Welk kenmerk hoort NIET bij nepnieuws?',
        leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'De kop is heftig en schokkend om jou te laten klikken.', correct: false, misconception: 'Herkent de heftige kop niet als kenmerk van nepnieuws.' },
          { text: 'Het bericht komt van de NOS en er staat een naam bij.', correct: true, explanation: 'Een bekende nieuwssite met een schrijver erbij is juist een goed teken.' },
          { text: 'De foto is oud of komt van een heel andere gebeurtenis.', correct: false, misconception: 'Herkent de hergebruikte foto niet als kenmerk.' }
        ],
        feedback: 'Sterk. Je zag dat een bekende bron juist voor betrouwbaar spreekt.'
      },
      {
        prompt: 'Wat is een deepfake?',
        leerdoel: 'Je weet wat een deepfake is en hoe die gemaakt wordt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Een nepvideo waarin met AI een gezicht is nagemaakt.', correct: true, explanation: 'Het lijkt alsof iemand iets zegt wat hij nooit gezegd heeft.' },
          { text: 'Een foto waar iemand een filter overheen heeft gezet.', correct: false, misconception: 'Verwart een deepfake met een gefilterde foto.' },
          { text: 'Een bericht dat automatisch naar al je vrienden gaat.', correct: false, misconception: 'Verwart een deepfake met een kettingbericht.' }
        ],
        feedback: 'Mooi. Bij een deepfake is het beeld zelf nagemaakt, niet alleen bewerkt.'
      },
      {
        prompt: 'Voor een deepfake heeft de computer aan een enkele foto genoeg.',
        waar: false,
        leerdoel: 'Je weet wat een deepfake is en hoe die gemaakt wordt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed. Er zijn duizenden beelden nodig, anders lukt het namaken niet.'
      },
      {
        prompt: 'Hoe wordt bij een deepfake de stem gemaakt?',
        leerdoel: 'Je weet wat een deepfake is en hoe die gemaakt wordt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een acteur spreekt de stem in en lijkt er heel erg op.', correct: false, misconception: 'Denkt dat er altijd een mens achter de stem zit.' },
          { text: 'De stem wordt met AI nagemaakt naar het echte voorbeeld.', correct: true, explanation: 'AI leert de klank van iemands stem en maakt daarna nieuwe zinnen.' },
          { text: 'De stem blijft altijd de originele stem uit de video zelf.', correct: false, misconception: 'Denkt dat alleen het beeld en niet het geluid nep is.' }
        ],
        feedback: 'Goed. Ook het geluid kan tegenwoordig volledig nagemaakt zijn.'
      },
      {
        prompt: 'Waarom kan een deepfake gevaarlijk zijn?',
        leerdoel: 'Je weet wat een deepfake is en hoe die gemaakt wordt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Je ziet iemand iets zeggen wat hij nooit gezegd heeft.', correct: true, explanation: 'Denk aan een nepvideo waarin jouw docent iets gemeens over je zegt.' },
          { text: 'Je telefoon wordt er langzamer van als je hem bekijkt.', correct: false, misconception: 'Denkt dat het gevaar in het apparaat zit.' },
          { text: 'De video is altijd wazig, dus je kunt niets goed zien.', correct: false, misconception: 'Denkt dat een deepfake makkelijk te herkennen is.' }
        ],
        feedback: 'Precies. Het gevaar is dat mensen die nepvideo echt geloven.'
      },
      {
        prompt: 'Welke bron is waarschijnlijk betrouwbaar?',
        leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Een account zonder naam dat het bericht als eerste deelde vandaag.', correct: false, misconception: 'Denkt dat wie het eerst deelt ook de bron is.' },
          { text: 'Een gebruiker die zich Gekke Gabber laat noemen op internet.', correct: false, misconception: 'Denkt dat een grappige naam iets zegt over betrouwbaarheid.' },
          { text: 'De universiteit van Amsterdam, met de naam van de schrijver.', correct: true, explanation: 'Bij een universiteit staat een naam en wordt het werk nagekeken.' }
        ],
        feedback: 'Prima. Staat er een naam bij, dan kun jij die zelf opzoeken.'
      },
      {
        prompt: 'Je krijgt een bericht dat je niet vertrouwt. Schrijf de vier vragen op die jij jezelf stelt en waar je het bericht daarna checkt.',
        type: 'open',
        leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik vraag mezelf af: wie heeft dit gemaakt? Wat is de bron? Is het al door anderen gecontroleerd? En is het logisch? Daarna typ ik het bericht in bij Google en kijk ik wat de NOS erover zegt. Ik check het ook op Nieuwscheckers.nl.',
        nakijkpunten: [
          'Alle vier de controlevragen uit de les staan erin.',
          'Er wordt minstens een plek genoemd waar je kunt checken.'
        ],
        feedback: 'Knap. Met deze vier vragen kom je bijna altijd achter de waarheid.'
      },
      {
        prompt: 'Cyberpesten kan ook gebeuren door een nepaccount te maken.',
        waar: true,
        leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Deze kwam uit 6.3. Fijn dat je de voorbeelden nog kunt herkennen.'
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
          '<p><strong>Vraag.</strong> Sam leest zijn aantekeningen drie keer door. Noa dekt de uitleg af en zegt alles hardop. Wie leert er meer, en waarom?</p>',
          '<p><strong>Antwoord.</strong> Noa leert meer. Zij is aan het overhoren. Zij merkt meteen wat ze nog niet weet. Sam herkent zijn tekst wel, maar dat is iets anders dan onthouden. Doe het dus zoals Noa. Dek de uitleg af en zeg het begrip hardop.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['bewijs van deelname', 'schermafbeelding'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Youssef maakt de toets af. Op zijn scherm staat 70 procent goed. Hij sluit het tabblad en gaat naar de pauze. Wat gaat hier mis?</p>',
          '<p><strong>Antwoord.</strong> Youssef heeft geen schermafbeelding gemaakt. Zijn bewijs van deelname is nu weg. De toets bewaart niets voor zijn docent. Hij moet de toets dus opnieuw maken. Doe het anders: eerst de schermafbeelding, dan pas het tabblad sluiten.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Je bent nu mediawijs over FOMO, cyberpesten, schermklachten en nepnieuws. Je weet ook wat je doet als er iets misgaat. Maak van je bewijs van deelname een schermafbeelding. Miste je een leerdoel? Ga dan terug naar het herstelspoor.</p>',
      keyTerms: ['mediawijs', 'bewijs van deelname']
    },
    vragen: [
      {
        prompt: 'Bij welk gevoel hoort dit: je pakt steeds je telefoon omdat je bang bent iets te missen?',
        leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Bij druk, want je doet mee met wat de groep van je verwacht.', correct: false, misconception: 'Verwart FOMO met druk voelen.' },
          { text: 'Bij FOMO, want je bent bang dat je iets leuks misloopt.', correct: true, explanation: 'FOMO trekt je steeds terug naar je scherm.' },
          { text: 'Bij je zelfbeeld, want zo kijk je naar jezelf en je leven.', correct: false, misconception: 'Verwart FOMO met het zelfbeeld.' }
        ],
        feedback: 'Goede start van de toets. Je herkende FOMO meteen aan het gedrag.'
      },
      {
        prompt: 'Druk voelen betekent dat je iets doet omdat anderen het ook doen.',
        waar: true,
        leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Juist geantwoord. Druk komt van buiten, van de groep om je heen.'
      },
      {
        prompt: 'Een leerling ziet al weken alleen filmpjes over dezelfde sport. Hoe heet dat?',
        leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een highlight reel, want hij ziet alleen de mooie kanten.', correct: false, misconception: 'Verwart de filterbubbel met het highlight reel-effect.' },
          { text: 'Sociale bevestiging, want zijn likes bepalen wat hij ziet.', correct: false, misconception: 'Verwart de filterbubbel met sociale bevestiging.' },
          { text: 'Een filterbubbel, want hij ziet steeds dezelfde berichten.', correct: true, explanation: 'Alles wat anders is verdwijnt langzaam uit zijn tijdlijn.' }
        ],
        feedback: 'Sterk toegepast. Je herkende de bubbel aan het patroon in zijn tijdlijn.'
      },
      {
        prompt: 'Het highlight reel-effect betekent dat mensen vooral hun moeilijke momenten delen.',
        waar: false,
        leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed gezien. De moeilijke momenten komen juist bijna nooit online.'
      },
      {
        prompt: 'Welke maatregel helpt je om minder onderbroken te worden door je telefoon?',
        leerdoel: 'Je kunt twee dingen noemen die jij kunt doen om positiever met social media om te gaan.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je meldingen uitzetten, dan roept je telefoon je niet steeds.', correct: true, explanation: 'Zonder meldingen kies jij het moment waarop je kijkt.' },
          { text: 'Meer accounts volgen, dan is er altijd iets nieuws te zien.', correct: false, misconception: 'Denkt dat meer aanbod rustiger voelt.' },
          { text: 'Je telefoon naast je bed leggen, dan zie je alles meteen.', correct: false, misconception: 'Denkt dat alles meteen zien voor rust zorgt.' }
        ],
        feedback: 'Prima. Meldingen uitzetten is de tip die het snelst verschil maakt.'
      },
      {
        prompt: 'Je telefoon een uur wegleggen tijdens je huiswerk helpt tegen FOMO.',
        waar: true,
        leerdoel: 'Je kunt twee dingen noemen die jij kunt doen om positiever met social media om te gaan.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Ja. Ligt je telefoon weg, dan trekt hij ook niet aan je.'
      },
      {
        prompt: 'Wat is cyberpesten?',
        leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Pesten dat alleen op het schoolplein en in de klas gebeurt.', correct: false, misconception: 'Denkt dat cyberpesten hetzelfde is als gewoon pesten.' },
          { text: 'Een grapje in een groepsapp waar iedereen om moet lachen.', correct: false, misconception: 'Denkt dat elk grapje in een app pesten is, of andersom.' },
          { text: 'Pesten via internet, telefoon, apps of games, dag en nacht.', correct: true, explanation: 'Er zit altijd een scherm tussen, en het houdt niet op bij de schooldeur.' }
        ],
        feedback: 'Goed. Je noemde zowel de middelen als het dag en nacht doorgaan.'
      },
      {
        prompt: 'Een nepaccount maken om iemand belachelijk te maken is cyberpesten.',
        waar: true,
        leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Zeker weten. Dit is een van de vijf voorbeelden uit de les.'
      },
      {
        prompt: 'Wat houdt een omstander vaak over aan cyberpesten?',
        leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Spijt en een schuldgevoel, omdat hij niets heeft gedaan.', correct: true, explanation: 'Hij zag het gebeuren en koos ervoor om stil te blijven.' },
          { text: 'Straf van school en soms een gesprek met zijn eigen ouders.', correct: false, misconception: 'Geeft het gevolg van de pester aan de omstander.' },
          { text: 'Buikpijn, hoofdpijn en slecht slapen door de spanning ervan.', correct: false, misconception: 'Geeft het gevolg van het slachtoffer aan de omstander.' }
        ],
        feedback: 'Mooi. Je hield de drie rollen en hun gevolgen netjes uit elkaar.'
      },
      {
        prompt: 'Een pester loopt geen enkel risico, want hij zit veilig achter zijn scherm.',
        waar: false,
        leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed. Een pester kan straf krijgen en zijn goede naam kwijtraken.'
      },
      {
        prompt: 'Welk woord betekent dat je niet weet wie er achter een account zit?',
        leerdoel: 'Je weet wat de woorden anoniem, omstander en reputatie betekenen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omstander', correct: false, misconception: 'Verwart anoniem met de rol van omstander.' },
          { text: 'Anoniem', correct: true, explanation: 'De naam en de foto zeggen dan niets over de echte persoon.' },
          { text: 'Reputatie', correct: false, misconception: 'Verwart anoniem met wat anderen van je vinden.' }
        ],
        feedback: 'Goed onthouden. Anoniem gaat over wie er achter het scherm zit.'
      },
      {
        prompt: 'Leg uit wat het verschil is tussen een omstander en een pester.',
        type: 'open',
        leerdoel: 'Je weet wat de woorden anoniem, omstander en reputatie betekenen.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'De pester is degene die de gemene berichten stuurt of de foto verspreidt. De omstander doet niet mee, maar hij ziet het wel gebeuren en zegt er niets van. De pester kan straf krijgen en een slechte reputatie. De omstander houdt er meestal spijt aan over.',
        nakijkpunten: [
          'Het verschil tussen doen en toekijken staat er duidelijk in.',
          'Bij elke rol staat een gevolg dat erbij hoort.'
        ],
        feedback: 'Helder uitgelegd. Je liet zien dat toekijken ook een keuze is.'
      },
      {
        prompt: 'Wat doe je met gemene berichten voordat je de pester blokkeert?',
        leerdoel: 'Je weet wat je kunt doen als je zelf gepest wordt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je stuurt ze door naar al je vrienden zodat zij het ook zien.', correct: false, misconception: 'Denkt dat doorsturen helpt, terwijl het het pesten vergroot.' },
          { text: 'Je verwijdert ze meteen, dan hoef je ze nooit meer te zien.', correct: false, misconception: 'Gooit het bewijs weg dat je later nodig hebt.' },
          { text: 'Je maakt er screenshots van, want dat is jouw bewijs later.', correct: true, explanation: 'Na het blokkeren zie je de berichten soms niet meer terug.' }
        ],
        feedback: 'Precies goed. Eerst bewijs bewaren, daarna pas blokkeren.'
      },
      {
        prompt: 'Bij pesten kun je het beter helemaal alleen oplossen, zonder er iemand bij te halen.',
        waar: false,
        leerdoel: 'Je weet wat je kunt doen als je zelf gepest wordt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed gezien. Je hoeft het echt niet alleen op te lossen.'
      },
      {
        prompt: 'Een klasgenoot wordt in een groepsapp uitgescholden. Wat is de beste reactie?',
        leerdoel: 'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Hem privé vragen hoe het gaat en het bij je mentor melden.', correct: true, explanation: 'Zo help je hem en zorg je dat iemand met gezag ingrijpt.' },
          { text: 'Meelachen, want anders vinden de anderen jou ook vervelend.', correct: false, misconception: 'Denkt dat meelachen je eigen positie beschermt.' },
          { text: 'Niets doen en wachten tot het vanzelf een keer overgaat.', correct: false, misconception: 'Denkt dat pesten vanzelf stopt als niemand iets zegt.' }
        ],
        feedback: 'Sterk. Je koos de reactie die het slachtoffer echt verder helpt.'
      },
      {
        prompt: 'Zie je online pesten? Dan mag je het bij de app rapporteren.',
        waar: true,
        leerdoel: 'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Rapporteren kan altijd, ook als jij er zelf buiten staat.'
      },
      {
        prompt: 'Aangifte doen betekent dat je bij de politie meldt dat er iets ergs is gebeurd.',
        waar: true,
        leerdoel: 'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Correct. Rapporteren gaat naar de app, aangifte naar de politie.'
      },
      {
        prompt: 'Waar kun je hulp vragen zonder dat je je naam hoeft te zeggen?',
        leerdoel: 'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Bij de politie, want daar hoef je nooit iets te vertellen.', correct: false, misconception: 'Denkt dat je bij de politie anoniem kunt blijven.' },
          { text: 'Bij de Kindertelefoon of bij Pestweb, allebei anoniem.', correct: true, explanation: 'Deze twee zijn er juist voor als je je naam liever niet zegt.' },
          { text: 'Bij de pester zelf, die kan het pesten immers laten stoppen.', correct: false, misconception: 'Denkt dat je het probleem met de pester moet uitpraten.' }
        ],
        feedback: 'Goed onthouden. Deze twee plekken staan ook in je stappenplan.'
      },
      {
        prompt: 'Welke klachten krijg je van te lang naar een scherm kijken?',
        leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je krijgt een betere houding en sterkere spieren in je nek.', correct: false, misconception: 'Denkt dat lang zitten je spieren traint.' },
          { text: 'Je gaat sneller slapen doordat het blauwe licht je moe maakt.', correct: false, misconception: 'Denkt dat blauw licht je juist slaperig maakt.' },
          { text: 'Je krijgt droge ogen, hoofdpijn en pijn in je nek en rug.', correct: true, explanation: 'De pijn komt van je houding, de droge ogen van het blauwe licht.' }
        ],
        feedback: 'Prima. Je noemde klachten van zowel je houding als je ogen.'
      },
      {
        prompt: 'Buig je je nek te vaak naar je telefoon? Dan krijg je een bochel.',
        waar: true,
        leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Je hoofd weegt zwaar als het naar voren hangt.'
      },
      {
        prompt: 'Je zit twee uur achter je scherm. Hoeveel 20-20-2 pauzes horen daarbij?',
        leerdoel: 'Je kunt de 20-20-2 regel uitleggen en toepassen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Zes pauzes, want twee uur is zes keer twintig minuten.', correct: true, explanation: 'Honderdtwintig minuten gedeeld door twintig geeft zes volle blokken.' },
          { text: 'Twee pauzes, een voor elk uur dat je achter je scherm zat.', correct: false, misconception: 'Telt per uur in plaats van per twintig minuten.' },
          { text: 'Twaalf pauzes, want je pauzeert elke tien minuten even kort.', correct: false, misconception: 'Rekent met tien minuten in plaats van twintig.' }
        ],
        feedback: 'Goed gerekend. Je telde netjes met volle blokken van twintig minuten.'
      },
      {
        prompt: 'De 2 in de 20-20-2 regel staat voor twee uur per dag buiten zijn.',
        waar: true,
        leerdoel: 'Je kunt de 20-20-2 regel uitleggen en toepassen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Juist. De 2 is geen pauze maar een doel voor je hele dag.'
      },
      {
        prompt: 'Waaraan merk je dat schermgebruik bij jou een probleem wordt?',
        leerdoel: 'Je weet waaraan je digitale verslaving bij jezelf kunt herkennen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je vindt filmpjes kijken soms leuker dan je huiswerk maken.', correct: false, misconception: 'Denkt dat een voorkeur voor filmpjes al een probleem is.' },
          { text: 'Je hebt minder aandacht voor school, familie en je hobby\'s.', correct: true, explanation: 'Het wordt een probleem zodra het je dagelijks leven stuurt.' },
          { text: 'Je kijkt af en toe een uur langer dan je van plan was toen.', correct: false, misconception: 'Denkt dat een keer uitlopen meteen verslaving is.' }
        ],
        feedback: 'Sterk. Je zag het verschil tussen veel kijken en echt vastzitten.'
      },
      {
        prompt: 'Onrustig worden als je je telefoon kwijt bent, hoort bij digitale verslaving.',
        waar: true,
        leerdoel: 'Je weet waaraan je digitale verslaving bij jezelf kunt herkennen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'reflecteren',
        feedback: 'Juist. Dat onrustige gevoel is een van de duidelijkste signalen.'
      },
      {
        prompt: 'Welke drie dingen wijzen op nepnieuws?',
        leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een rustige kop, een bekende bron en een nieuwe foto erbij.', correct: false, misconception: 'Draait de kenmerken om.' },
          { text: 'Veel spelfouten, weinig likes en een lange tekst eronder.', correct: false, misconception: 'Denkt dat spelfouten en likes iets over echtheid zeggen.' },
          { text: 'Een heftige kop, geen bron en een oude of nagemaakte foto.', correct: true, explanation: 'Dit zijn precies de drie kenmerken uit de les.' }
        ],
        feedback: 'Goed. Je noemde alle drie de kenmerken in een keer goed.'
      },
      {
        prompt: 'Een rustige en saaie kop is het duidelijkste teken van clickbait.',
        waar: false,
        leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed. Clickbait is juist een heftige kop die je wil laten klikken.'
      },
      {
        prompt: 'Hoe maakt een computer een deepfake?',
        leerdoel: 'Je weet wat een deepfake is en hoe die gemaakt wordt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Hij leert van duizenden beelden en plakt het gezicht erover.', correct: true, explanation: 'Eerst leren van beelden, daarna pas het gezicht en de stem namaken.' },
          { text: 'Hij filmt iemand na met een acteur die er sprekend op lijkt.', correct: false, misconception: 'Denkt dat er een echte dubbelganger voor nodig is.' },
          { text: 'Hij zet een filter over een bestaande video en verandert de kleur.', correct: false, misconception: 'Verwart een deepfake met een filter over een video.' }
        ],
        feedback: 'Mooi. Je zette de twee stappen in de goede volgorde.'
      },
      {
        prompt: 'In een deepfake kan iemand iets zeggen wat hij nooit gezegd heeft.',
        waar: true,
        leerdoel: 'Je weet wat een deepfake is en hoe die gemaakt wordt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Ja. Daarom is een deepfake gevaarlijk: mensen geloven de video.'
      },
      {
        prompt: 'Wat doe je om te checken of een nieuwsbericht klopt?',
        leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ik kijk of het bericht veel likes en reacties heeft gekregen.', correct: false, misconception: 'Denkt dat populariteit iets zegt over waarheid.' },
          { text: 'Ik zoek de bron op en check het via Google of Nieuwscheckers.', correct: true, explanation: 'Zo zie je of andere, betrouwbare sites hetzelfde melden.' },
          { text: 'Ik kijk of de foto er mooi uitziet en of de tekst spannend is.', correct: false, misconception: 'Denkt dat een verzorgd uiterlijk betrouwbaarheid betekent.' }
        ],
        feedback: 'Prima aanpak. Bron zoeken en naast andere sites leggen werkt altijd.'
      },
      {
        prompt: 'Waarom is het belangrijk om de bron te checken? De bron is de maker van het bericht.',
        leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Om te zien of een leuke persoon het geschreven heeft.', correct: false, misconception: 'Denkt dat je de schrijver aardig moet vinden.' },
          { text: 'Om te zien of het artikel in Nederland gemaakt is.', correct: false, misconception: 'Denkt dat het land van herkomst iets over waarheid zegt.' },
          { text: 'Zo kom je erachter of het nieuws echt of nep is.', correct: true, explanation: 'Nepnieuws is gevaarlijk zodra mensen het geloven en doorsturen.' }
        ],
        feedback: 'Correct. Je checkt eerst wie het zegt, en pas daarna of je het gelooft.'
      },
      {
        prompt: 'Schrijf per onderwerp een zin op wat jij geleerd hebt: social media, cyberpesten, digitaal gezond blijven en nepnieuws.',
        type: 'open',
        leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Social media: ik weet nu wat FOMO is en dat mensen alleen hun mooie kant laten zien. Cyberpesten: ik weet dat het dag en nacht doorgaat en dat er drie rollen zijn. Digitaal gezond blijven: ik ken de 20-20-2 regel en de klachten van blauw licht. Nepnieuws: ik let op de kop, de bron en de foto, en ik check het via Google.',
        nakijkpunten: [
          'Alle vier de onderwerpen komen aan bod, elk met een eigen zin.',
          'Er staan begrippen uit de les in en geen algemene zinnen.'
        ],
        feedback: 'Knap werk. Je liet in vier zinnen het hele hoofdstuk zien.'
      },
      {
        prompt: 'Overhoren werkt beter dan je teksten nog een keer doorlezen.',
        waar: true,
        leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'reflecteren',
        feedback: 'Goed. Bij overhoren merk je meteen wat je nog niet weet.'
      },
      {
        prompt: 'Wat doe je met het bewijs van deelname aan het einde van de toets?',
        leerdoel: 'Je kunt je resultaat opslaan en delen met je docent.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Ik sluit het tabblad, want mijn docent ziet mijn resultaat al.', correct: false, misconception: 'Denkt dat de toets het resultaat naar de docent stuurt.' },
          { text: 'Ik schrijf mijn cijfer over op een blaadje voor mezelf thuis.', correct: false, misconception: 'Denkt dat een eigen notitie als bewijs telt.' },
          { text: 'Ik maak een schermafbeelding en deel die met mijn docent.', correct: true, explanation: 'De toets bewaart niets, dus jouw afbeelding is het enige bewijs.' }
        ],
        feedback: 'Precies. Zonder die schermafbeelding telt je resultaat niet mee.'
      },
      {
        prompt: 'Je kunt de schermafbeelding ook nog maken nadat je het tabblad sluit.',
        waar: false,
        leerdoel: 'Je kunt je resultaat opslaan en delen met je docent.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'Goed gezien. Sluit je het tabblad, dan is je resultaat echt weg.'
      }
    ]
  }
};
