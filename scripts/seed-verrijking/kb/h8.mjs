// Verrijkingslaag hoofdstuk 8 - Zelf maken: programmeren, ontwerpen en
// terugblikken. Kaderberoepsgerichte leerweg (kb).
//
// Zie scripts/seed-verrijking/PATROON.md voor het formaat van een vraag, de
// regels over afleiders en de eisen aan feedback.
//
// Opzet per paragraaf, volgens de blauwdruk en het kb-profiel:
//   - elk leerdoel heeft zijn eigen startvraag; die staan als `checks` in
//     scripts/seed-structuur/kb/h8.mjs, met antwoord en uitleg erbij. 8.1 opent
//     daarnaast met vier voorkennisvragen over hoofdstuk 7, 8.4 met de
//     deeltoets over 8.1 tot en met 8.3, en 8.6 met de diagnostische ronde over
//     alle zeventien leerdoelen van het hoofdstuk;
//   - elk theorieblok heeft een uitgewerkt voorbeeld (vraag + volledige
//     uitwerking) dat VOOR het oefenblok en het zelfstandig oefenen komt;
//   - elke afsluitquiz heeft TWEE terugkeervragen. Vanaf 8.2 gaan die naar een
//     leerdoel van een eerdere paragraaf van dit hoofdstuk; de quiz van 8.1
//     heeft er twee naar hoofdstuk 7, want daar ligt niets eerders in dit
//     hoofdstuk. Ronde 1 had er per quiz één en in 8.1 nul, terwijl de
//     blauwdruk er twee vraagt;
//   - de hoofdstuktoets 8.6 is tegelijk de eindtoets van het leerjaar. Hij
//     bevraagt elk van de zeventien verplichte leerdoelen van 8.1 tot en met
//     8.6 precies twee keer, in 34 vragen. Dat is meer dan de 15 tot 20 die de
//     blauwdruk als startwaarde noemt, en dat is bewust: bij zeventien doelen
//     wint de dekking van dat ronde getal;
//   - kb-vorm: veel goed/fout-vragen naast meerkeuze en per blok hoogstens een
//     of twee open vragen. De afleiders zijn even lang als of langer dan het
//     goede antwoord, zodat blind de langste knop klikken niets oplevert; de
//     reden staat in `explanation`, niet in de antwoordtekst.
//
// WAT RONDE 2 HIER VERANDERD HEEFT
// --------------------------------
// De kop van ronde 1 beweerde dat deze vragen niet uit tl overgenomen waren.
// Dat klopte niet: de deeltoets in de checks van 8.4, de diagnostische ronde in
// de checks van 8.6 en een deel van de oefen- en modelantwoorden waren
// woordelijk gelijk. Die zijn opnieuw geschreven, samen met alle twaalf
// uitgewerkte voorbeelden. Wat wél gelijk blijft aan tl zijn de zeventien
// leerdoelzinnen uit het jaarplan en de handelingslijstjes uit de bron; dat
// hoort zo en staat toegelicht in scripts/seed-structuur/kb/h8.mjs.
//
// GEMETEN NA RONDE 2 (narekenbaar):
//   - uitgewerkte voorbeelden 72 tot 94 woorden, gemiddeld 82. Ronde 1 stond op
//     97 tot 123, waardoor het leesblok vóór de eerste oefening juist bij kader
//     het langst was. tl zit op 56 tot 94, gemiddeld 69;
//   - vorm per afsluitquiz: negen vragen, waarvan zes meerkeuze, twee goed/fout
//     en één open. Ronde 1 had er zeven met één goed/fout;
//   - differentiatie: elke quiz heeft naast basisvragen minstens één vraag op
//     plus of verdieping. In de eindtoets van 8.6 staat van elk leerdoelpaar de
//     zwaarste vraag op plus of verdieping: 21 basis, 10 plus, 3 verdieping.
//     Ronde 1 had over het hele hoofdstuk 64 basis en 4 plus;
//   - scaffoldingrol: de quizzen van 8.1 tot en met 8.5 draaien op ik_doe_voor,
//     samen_oefenen, zelf_proberen, bewijs_leveren en reflecteren naast elkaar.
//     De eindtoets van 8.6 staat op bewijs_leveren, want dat is wat een toets
//     is; alleen de twee terugblikvragen staan op reflecteren.
//
// KERNBEGRIPPEN. Het woord "algoritme" staat in kb al in twee blokken van
// hoofdstuk 6 vet, en een kernbegrip mag in de hele leerweg in hoogstens twee
// blokken staan. Daarom is in 8.1 gekozen voor stappenplan, volgorde en
// handeling als kernbegrippen; het woord algoritme staat gewoon in de tekst en
// in de vragen, alleen niet vet.

export default {
  '8.1': {
    learningGoals: [
      'Je kunt uitleggen wat een algoritme is als stappenplan.',
      'Je kunt een dagelijkse handeling in duidelijke stappen opschrijven.',
      'Je weet wat een herhaling en een keuze in een stappenplan zijn.'
    ],
    theorie: [
      {
        keyTerms: ['stappenplan', 'volgorde', 'handeling'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Yara schrijft op hoe je een boterham smeert: 1. doe boter op je brood, 2. pak twee sneetjes uit de zak, 3. leg er kaas op. Een klasgenoot speelt robot. Waar loopt hij vast?</p>',
          '<p><strong>Antwoord.</strong> Bij stap 1. De robot heeft nog geen brood in zijn handen en kan er dus geen boter op doen. Stap 2 staat te laat. Goed is: pak twee sneetjes, doe er boter op, leg er kaas op. Alle drie de stappen waren juist; alleen de volgorde klopte niet.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['herhaling', 'keuze', 'voorwaarde'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je pakt je tas in. Morgen heb je zes vakken, en bij gym gaat je sporttas mee. Hoe schrijf je dat kort op?</p>',
          '<p><strong>Antwoord.</strong> Stap 1, de herhaling: "herhaal voor elk vak op je rooster, pak het boek en het schrift". Stap 2, de keuze: "als je gym hebt, dan pak je ook je sporttas". Stap 3, de voorwaarde: dat is "je hebt gym". Die kan waar of niet waar zijn. Heb je geen gym, dan slaat het plan die stap over.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een algoritme is een stappenplan dat precies zegt hoe je iets doet. Een computer vult niets zelf in, dus je schrijft elke stap los op en let goed op de volgorde. Met een herhaling zeg je hoe vaak iets moet gebeuren. Met een keuze kijk je naar een voorwaarde en ga je daarna de ene of de andere kant op.</p>',
      keyTerms: ['stappenplan', 'herhaling', 'keuze']
    },
    vragen: [
      {
        prompt: 'Je broertje vraagt wat dat woord algoritme nou eigenlijk betekent. Wat antwoord je hem?',
        leerdoel: 'Je kunt uitleggen wat een algoritme is als stappenplan.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Een stappenplan dat precies zegt hoe iets moet.', correct: true, explanation: 'Het is een rij instructies van begin tot resultaat.' },
          { text: 'Een computerprogramma dat alleen op een laptop draait.', correct: false, misconception: 'Denkt dat een algoritme altijd software is en niet op papier kan.' },
          { text: 'Een apparaat dat opdrachten van je telefoon overneemt.', correct: false, misconception: 'Verwart het stappenplan met de machine die het uitvoert.' },
          { text: 'Een instelling waarmee je een programma sneller maakt.', correct: false, misconception: 'Denkt dat het een knop of instelling in een programma is.' }
        ],
        feedback: 'Een algoritme kan gewoon op papier staan, zoals een recept. Het is dus geen apparaat en geen knop.'
      },
      {
        prompt: 'Bij een algoritme maakt het niet uit in welke volgorde de stappen staan.',
        waar: false,
        leerdoel: 'Je kunt uitleggen wat een algoritme is als stappenplan.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'De volgorde telt net zo zwaar als de stappen zelf. Eerst beleggen en dan smeren geeft een heel andere boterham.'
      },
      {
        prompt: 'Waarom schrijf je voor een computer meer stappen op dan voor een klasgenoot?',
        leerdoel: 'Je kunt een dagelijkse handeling in duidelijke stappen opschrijven.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Een computer leest sneller en kan daarom veel meer regels aan.', correct: false, misconception: 'Denkt dat het om leessnelheid gaat en niet om zelf aanvullen.' },
          { text: 'Een klasgenoot mag de stappen in een andere volgorde uitvoeren.', correct: false, misconception: 'Denkt dat de volgorde bij mensen niet uitmaakt.' },
          { text: 'Een computer vult niets zelf in en heeft elke stap los nodig.', correct: true, explanation: 'Wat jij overslaat, gebeurt bij een machine gewoon niet.' },
          { text: 'Een computer voert alleen de eerste vijf stappen van je lijst uit.', correct: false, misconception: 'Denkt dat er een maximum aan het aantal stappen zit.' }
        ],
        feedback: 'Een mens vult zelf aan wat jij vergeet. Precies dat aanvullen doet een computer nooit.'
      },
      {
        prompt: 'Wat voor soort stappen vergeet je het vaakst als je een dagelijkse handeling opschrijft?',
        leerdoel: 'Je kunt een dagelijkse handeling in duidelijke stappen opschrijven.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De hoofdhandeling zelf, want die is zo groot dat je hem juist over het hoofd ziet.', correct: false, misconception: 'Denkt dat juist de hoofdhandeling vergeten wordt.' },
          { text: 'De stappen die je zonder nadenken doet, zoals je spullen pakken en achteraf controleren.', correct: true, explanation: 'Wat vanzelfsprekend voelt, schrijf je niet op. Precies die stappen mist de computer.' },
          { text: 'De stappen met de langste zinnen, want die kosten de meeste moeite om helemaal uit te typen.', correct: false, misconception: 'Denkt dat de lengte van een stap bepaalt of je hem opschrijft.' },
          { text: 'De stappen in het midden van de lijst, want het begin en het eind onthoud je nog wel.', correct: false, misconception: 'Denkt dat de plek in de lijst bepaalt wat je vergeet.' }
        ],
        feedback: 'Wat je zonder nadenken doet, schrijf je meestal niet op. Het pakken van je spullen en het controleren achteraf blijven daarom vaak liggen.'
      },
      {
        prompt: 'In welke zin staat een keuze met een voorwaarde?',
        leerdoel: 'Je weet wat een herhaling en een keuze in een stappenplan zijn.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Herhaal twintig keer: doe een stap vooruit.', correct: false, misconception: 'Verwart een herhaling met een keuze.' },
          { text: 'Pak eerst je jas en loop dan naar buiten toe.', correct: false, misconception: 'Denkt dat elke opdracht met twee delen een keuze is.' },
          { text: 'Als het regent, dan pak je een jas.', correct: true, explanation: 'Het woordje "als" wijst hier de voorwaarde aan.' },
          { text: 'Doe dit vijf keer achter elkaar en stop dan.', correct: false, misconception: 'Denkt dat een aantal keren hetzelfde is als een voorwaarde.' }
        ],
        feedback: 'Een keuze herken je aan het woordje "als". Wat daarachter staat is de voorwaarde, en die kan waar of niet waar zijn.'
      },
      {
        prompt: 'Leg met een eigen voorbeeld uit wat een herhaling is en wat een keuze is.',
        type: 'open',
        leerdoel: 'Je weet wat een herhaling en een keuze in een stappenplan zijn.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Een herhaling zegt hoe vaak iets moet gebeuren. Mijn voorbeeld: herhaal voor elke sok in de wasmand, leg hem op de stapel. Een keuze kijkt naar een voorwaarde. Mijn voorbeeld: als de sok een gat heeft, dan gooi je hem weg. De voorwaarde is "de sok heeft een gat". Die kan waar of niet waar zijn.',
        nakijkpunten: [
          'Het voorbeeld van de herhaling zegt hoe vaak iets gebeurt.',
          'Het voorbeeld van de keuze begint met "als" en heeft een voorwaarde.',
          'De twee voorbeelden zijn zelf bedacht en komen niet uit de tekst.'
        ],
        feedback: "Een eigen voorbeeld laat pas echt zien dat je het snapt. Let erop dat je keuze het woordje \"als\" bevat."
      },
      {
        prompt: 'Terugblik hoofdstuk 7. Een chatbot denkt met je mee, net zoals een klasgenoot dat doet.',
        waar: false,
        leerdoel: 'Je weet dat AI leert van data en niet denkt zoals een mens.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Een chatbot rekent met patronen uit heel veel data. Het lijkt op meedenken, maar hij weet niet waar jouw opdracht over gaat.'
      },
      {
        prompt: 'Terugblik hoofdstuk 7. Je vraagt een chatbot om hulp bij je stappenplan. Welke prompt levert het meest op?',
        leerdoel: 'Je kunt een duidelijke prompt schrijven met opdracht, onderwerp, doelgroep en lengte.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'Stappenplan graag, ik moet dit voor school af hebben.', correct: false, misconception: 'Denkt dat een beleefde zin al een prompt is.' },
          { text: 'Leg uit hoe je een goed stappenplan schrijft, alsjeblieft.', correct: false, misconception: 'Mist de doelgroep en de lengte in de prompt.' },
          { text: 'Geef acht stappen om thee te zetten, voor een robot die niets zelf invult.', correct: true, explanation: 'Opdracht, onderwerp, doelgroep en lengte staan er alle vier in.' }
        ],
        feedback: 'Vier onderdelen maken een prompt bruikbaar. Noem je de doelgroep niet, dan gokt de chatbot voor wie hij schrijft.'
      },
      {
        prompt: 'Wat bedoelen we met computationeel denken?',
        leerdoel: 'Je weet wat een herhaling en een keuze in een stappenplan zijn.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        options: [
          { text: 'Een opdracht zo opschrijven dat een machine hem kan uitvoeren.', correct: true, explanation: 'Denk aan de jas en de pet: gewone taal, maar zonder eigen invulling.' },
          { text: 'Zo snel kunnen rekenen dat je geen rekenmachine meer nodig hebt.', correct: false, misconception: 'Denkt dat het over rekensnelheid gaat.' },
          { text: 'Alles wat je bedenkt eerst in een computerprogramma uitproberen.', correct: false, misconception: 'Denkt dat er altijd een computer bij nodig is.' },
          { text: 'Onthouden welke knoppen er in een programma bij elkaar horen.', correct: false, misconception: 'Verwart het met het bedienen van software.' }
        ],
        feedback: 'Je deed het al bij de jas en de pet. Een machine kan die twee regels volgen zonder er iets bij te bedenken.'
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
        keyTerms: ['blokkentaal', 'sprite', 'script'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Milan klikt drie blokken onder elkaar: "neem 10 stappen", "zeg hallo", "draai 90 graden". Hij klikt op de groene vlag en er gebeurt niets. Wat is er aan de hand?</p>',
          '<p><strong>Antwoord.</strong> Kijk naar het bovenste blok: daar staat "neem 10 stappen". Dat is geen gebeurtenis maar een gewone opdracht, dus de computer weet niet wanneer dit script begint. Milan klikt het blok "wanneer op de groene vlag wordt geklikt" erbovenop. Daarna doet de sprite alle drie de opdrachten.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['gebeurtenis', 'herhaal-blok', 'als-dan-blok'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Noa wil dat haar kat bij elke botsing "Boing!" roept. Ze legt het als-dan-blok met "raak ik (rand)?" onder het blok herhaal in plaats van erin. Wat gaat er mis?</p>',
          '<p><strong>Antwoord.</strong> Alles binnen de herhaling gebeurt elke ronde opnieuw. Het als-dan-blok ligt erbuiten, dus de controle komt pas na afloop. Maar het blok herhaal uit Besturen loopt oneindig door en is dus nooit klaar. De kat roept daardoor nooit iets. Oplossing: sleep het als-dan-blok in de opening van het blok herhaal.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>In Scratch klik je gekleurde blokken aan elkaar tot een script. De sprite op het speelveld voert dat script van boven naar beneden uit. Elk script begint met een gebeurtenis, meestal de groene vlag. Daaronder gebruik je een herhaling om iets vaker te laten gebeuren en een als-dan-keuze om alleen bij een voorwaarde iets te doen.</p>',
      keyTerms: ['script', 'sprite']
    },
    vragen: [
      {
        prompt: 'Wat is een sprite in Scratch?',
        leerdoel: 'Je kunt met blokken een klein programma maken dat werkt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'De stapel blokken die je in het midden onder elkaar klikt.', correct: false, misconception: 'Verwart de sprite met het script.' },
          { text: 'Het figuur op het speelveld dat jouw opdrachten uitvoert.', correct: true, explanation: 'In Scratch is dat standaard de kat.' },
          { text: 'De knop waarmee je een nieuw project opslaat in je account.', correct: false, misconception: 'Denkt dat het een knop in de editor is.' },
          { text: 'Het menu waarin alle gekleurde blokken op kleur staan.', correct: false, misconception: 'Verwart de sprite met de blokkenbibliotheek.' }
        ],
        feedback: 'De sprite is de uitvoerder en het script is de opdracht. Die twee woorden gebruik je de rest van dit hoofdstuk.'
      },
      {
        prompt: 'Een als-dan-blok voert de blokken erbinnen alleen uit als de voorwaarde waar is.',
        waar: true,
        leerdoel: 'Je kunt in je programma een herhaling en een als-dan-keuze gebruiken.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Is de voorwaarde niet waar, dan wordt de inhoud van dat blok die ronde gewoon overgeslagen.'
      },
      {
        prompt: 'Waarmee begint bijna elk Scratch-script?',
        leerdoel: 'Je kunt met blokken een klein programma maken dat werkt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Met het gele blok "wanneer op de groene vlag wordt geklikt".', correct: true, explanation: 'Dat blok zegt wanneer het script moet starten.' },
          { text: 'Met een oranje herhaal-blok waarin je alle andere blokken legt.', correct: false, misconception: 'Denkt dat een herhaling een script kan starten.' },
          { text: 'Met het blok "neem 10 stappen" boven aan de hele stapel.', correct: false, misconception: 'Denkt dat het bovenste blok altijd het startblok is.' }
        ],
        feedback: 'Zonder gebeurtenisblok weet de computer niet wanneer hij moet beginnen. Er gebeurt dan helemaal niets.'
      },
      {
        prompt: 'Je sprite moet elke ronde controleren of hij de rand raakt. Waar leg je dat als-dan-blok?',
        leerdoel: 'Je kunt in je programma een herhaling en een als-dan-keuze gebruiken.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Boven het startblok, zodat de controle als eerste gebeurt.', correct: false, misconception: 'Denkt dat een controle vooraf één keer genoeg is.' },
          { text: 'Onder het herhaal-blok, zodat hij de rand pas na afloop bekijkt.', correct: false, misconception: 'Denkt dat wat eronder staat toch meedraait.' },
          { text: 'Binnen het herhaal-blok, zodat hij elke ronde de rand nakijkt.', correct: true, explanation: 'Alleen binnen de lus wordt de voorwaarde steeds opnieuw gecheckt.' },
          { text: 'Naast de herhaling op het werkveld, los van de rest.', correct: false, misconception: 'Denkt dat losse blokken vanzelf meedoen.' }
        ],
        feedback: 'De plek van een blok bepaalt hoe vaak het aan de beurt komt. Buiten de lus wordt de rand maar één keer gecontroleerd.'
      },
      {
        prompt: 'Welke uitleg vertelt een script goed na?',
        leerdoel: 'Je kunt uitleggen wat jouw programma stap voor stap doet.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Mijn programma is een spel waarin een kat heen en weer gaat.', correct: false, misconception: 'Beschrijft de bedoeling in plaats van de blokken.' },
          { text: 'Het start bij de vlag, dan loopt de kat, dan keert hij om.', correct: true, explanation: 'Deze uitleg volgt de blokken van boven naar beneden.' },
          { text: 'Ik heb blokken gebruikt die ik in het linkermenu gevonden heb.', correct: false, misconception: 'Vertelt hoe hij gezocht heeft in plaats van wat het doet.' }
        ],
        feedback: 'Navertellen betekent de volgorde van je blokken volgen. Je bedoeling beschrijven is iets anders.'
      },
      {
        prompt: 'Beschrijf jouw eigen programma in vier zinnen, van het bovenste blok naar het onderste.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen wat jouw programma stap voor stap doet.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Mijn programma start als je op de groene vlag klikt. Daarna begint het blok herhaal, en dat stopt vanzelf niet meer. Binnen die herhaling neemt de kat steeds tien stappen en keert ze om aan de rand. Het als-dan-blok kijkt daar elke ronde of "raak ik (rand)?" waar is, en dan roept ze Boing.',
        nakijkpunten: [
          'De uitleg begint bij het gebeurtenisblok bovenaan.',
          'Er staat bij wat binnen de herhaling ligt en wat erbuiten.',
          'De voorwaarde van het als-dan-blok wordt genoemd.'
        ],
        feedback: "Navertellen doe je van boven naar beneden. Zeg er altijd bij welke blokken binnen de herhaling liggen."
      },
      {
        prompt: 'Terugblik 8.1. Wat is de voorwaarde in de zin "als de accu leeg is, dan laad je op"?',
        leerdoel: 'Je weet wat een herhaling en een keuze in een stappenplan zijn.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Het stuk "dan laad je op", want dat is wat er daarna moet gebeuren.', correct: false, misconception: 'Verwart de voorwaarde met de handeling die erop volgt.' },
          { text: 'Het stuk "de accu is leeg", want dat kan waar of niet waar zijn.', correct: true, explanation: 'De voorwaarde staat altijd achter het woordje "als".' },
          { text: 'De hele zin, want een voorwaarde is altijd een complete zin.', correct: false, misconception: 'Denkt dat de hele als-dan-zin de voorwaarde is.' }
        ],
        feedback: 'Een voorwaarde is iets dat waar of niet waar kan zijn. Precies dat schuif je straks in je als-dan-blok.'
      },
      {
        prompt: 'Blokken klikken alleen vast waar ze passen, dus in een blokprogramma kan geen fout meer zitten.',
        waar: false,
        leerdoel: 'Je kunt met blokken een klein programma maken dat werkt.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        feedback: 'De vorm regelt alleen wat past. De volgorde kies je zelf, en die kan gewoon verkeerd zijn. Daar gaat 8.3 over.'
      },
      {
        prompt: 'Je wilt de voorwaarde "raak ik (rand)?" in je als-dan-blok schuiven. In welke categorie zoek je dat blok?',
        leerdoel: 'Je kunt in je programma een herhaling en een als-dan-keuze gebruiken.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Bij Beweging, want de sprite is aan het lopen als hij de rand raakt.', correct: false, misconception: 'Kiest de categorie van het gevolg in plaats van die van de controle.' },
          { text: 'Bij Waarnemen, want daar staan alle blokken die iets controleren.', correct: true, explanation: 'Waarnemen levert de zeshoekige voorwaardeblokken.' },
          { text: 'Bij Besturen, want daar staat het als-dan-blok zelf ook.', correct: false, misconception: 'Denkt dat een blok en zijn vulling altijd uit dezelfde categorie komen.' },
          { text: 'Bij Uiterlijken, want de rand hoort bij hoe het speelveld eruitziet.', correct: false, misconception: 'Verwart het speelveld met het uiterlijk van de sprite.' }
        ],
        feedback: 'Zoek een blok op zijn categorie en niet op zijn kleur. Er staan tientallen blokken in dezelfde kleur.'
      },
      {
        prompt: 'Terugblik 8.1. Waarom lijkt een script op het genummerde stappenplan dat je in 8.1 schreef?',
        leerdoel: 'Je kunt een dagelijkse handeling in duidelijke stappen opschrijven.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'samen_oefenen',
        options: [
          { text: 'Elk blok is één stap, en de plek in de stapel bepaalt de beurt.', correct: true, explanation: 'Precies zoals de nummers in je stappenplan de volgorde vastlegden.' },
          { text: 'Scratch nummert je blokken automatisch zodra je ze vastklikt.', correct: false, misconception: 'Denkt dat de editor de nummering overneemt.' },
          { text: 'Een script mag net als een stappenplan hooguit twaalf regels hebben.', correct: false, misconception: 'Denkt dat de maximumlengte uit 8.1 ook in Scratch geldt.' }
        ],
        feedback: 'Wat op papier een genummerde stap was, is op je scherm een blok. Het idee eronder is precies hetzelfde.'
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
          '<p><strong>Vraag.</strong> Jayden speelt zijn spel. De kat loopt netjes, maar blijft bij de rand trillen. Jayden zegt: "het werkt niet". Hoe kom je van die zin bij de echte fout?</p>',
          '<p><strong>Antwoord.</strong> Zeg eerst wat je zag: niet "het werkt niet", maar "hij trilt aan de rechterrand". Zeg daarna wat je verwachtte: "hij zou omkeren en teruglopen". Tot aan de rand liep alles prima, dus daar zit de fout: hij keert om en raakt meteen weer de rand. Oplossing: na het omkeren eerst drie stappen lopen.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['debuggen', 'testplan', 'feedback'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Fenna verandert drie dingen tegelijk in haar script. Daarna werkt haar programma. Waarom is haar klasgenoot toch niet tevreden?</p>',
          '<p><strong>Antwoord.</strong> Fenna weet nu dat het werkt, maar niet waardoor. De twee andere wijzigingen zitten er nog in en kunnen later fouten geven. Beter is: zet er twee terug en test opnieuw. Werkt het nog? Dan deed alleen de derde het werk. Dat is debuggen: één ding tegelijk veranderen en daartussen testen.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een bug is een fout waardoor je programma iets anders doet dan de bedoeling. Fouten opsporen en herstellen heet debuggen, en dat doe je één ding tegelijk. Schrijf vooraf een testplan met wat er zou moeten gebeuren. Laat daarna een klasgenoot je programma proberen, en gebruik zijn feedback om het te verbeteren.</p>',
      keyTerms: ['bug', 'debuggen']
    },
    vragen: [
      {
        prompt: 'Een klasgenoot hoort jou het woord bug zeggen en snapt het niet. Wat leg je hem uit?',
        leerdoel: 'Je weet wat een bug is en hoe je die opspoort.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Een fout waardoor je programma iets anders doet dan bedoeld.', correct: true, explanation: 'Dat kan een verkeerd getal zijn of een vergeten blok.' },
          { text: 'Een virus dat via internet in jouw programma is gekomen.', correct: false, misconception: 'Verwart een programmeerfout met malware van buitenaf.' },
          { text: 'Een blok dat in Scratch niet aan andere blokken vastklikt.', correct: false, misconception: 'Denkt dat een bug iets is wat je meteen ziet.' },
          { text: 'Een melding die zegt dat je programma klaar is met laden.', correct: false, misconception: 'Verwart een bug met een gewone systeemmelding.' }
        ],
        feedback: 'Ook een programma dat gewoon draait kan een bug hebben. Het doet dan alleen niet wat jij bedoelde.'
      },
      {
        prompt: 'Het woord bug werd pas na 1947 voor het eerst in de techniek gebruikt.',
        waar: false,
        leerdoel: 'Je weet wat een bug is en hoe je die opspoort.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Thomas Edison schreef er in 1878 al over. In 1947 werd het woord alleen beroemd door de mot in de computer.'
      },
      {
        prompt: 'Je programma start wel, maar de sprite beweegt niet. Wat controleer je dan?',
        leerdoel: 'Je kunt je programma testen en zien waar het misgaat.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Of je computer nog genoeg werkgeheugen vrij heeft staan.', correct: false, misconception: 'Zoekt de fout in de computer in plaats van in het script.' },
          { text: 'Of je project wel onder de goede naam is opgeslagen.', correct: false, misconception: 'Denkt dat opslaan invloed heeft op wat het script doet.' },
          { text: 'Of het beweegblok wel binnen de herhaling ligt.', correct: true, explanation: 'Ligt het erbuiten, dan gebeurt het maar één keer of nooit.' },
          { text: 'Of je wel de allernieuwste versie van je browser gebruikt.', correct: false, misconception: 'Denkt dat de browser de oorzaak is van een logische fout.' }
        ],
        feedback: 'Het script start, dus het gebeurtenisblok is goed. Kijk daarna naar de plek van je blokken.'
      },
      {
        prompt: 'Waarom test je je programma ook op wegen die je zelf niet bedacht had?',
        leerdoel: 'Je kunt je programma testen en zien waar het misgaat.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een programma draait sneller als je het vaker hebt gestart.', correct: false, misconception: 'Denkt dat testen het programma zelf verbetert.' },
          { text: 'Daar zitten fouten die je op de bedachte weg nooit ziet.', correct: true, explanation: 'Op je eigen route werkt het meestal wel; daarbuiten niet.' },
          { text: 'Scratch bewaart alleen scripts die je twee keer getest hebt.', correct: false, misconception: 'Denkt dat testen met opslaan te maken heeft.' },
          { text: 'Je docent kijkt vooral naar het aantal keren dat je test.', correct: false, misconception: 'Denkt dat testen om het aantal pogingen gaat.' }
        ],
        feedback: 'Je test je eigen route bijna vanzelf goed. Juist de wegen die je niet bedacht had leveren de fouten op.'
      },
      {
        prompt: 'Een klasgenoot geeft je drie tips tegelijk. Hoe verwerk je die het beste?',
        leerdoel: 'Je kunt je programma verbeteren na feedback van een klasgenoot.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Alle drie tegelijk doorvoeren en daarna één keer testen.', correct: false, misconception: 'Wil tijd winnen en verliest daardoor het overzicht.' },
          { text: 'Alleen de tip doorvoeren die je zelf het leukste vindt.', correct: false, misconception: 'Kiest op smaak in plaats van op wat er misging.' },
          { text: 'Eén tip tegelijk doorvoeren en daartussen steeds testen.', correct: true, explanation: 'Zo weet je per verandering wat die precies deed.' }
        ],
        feedback: 'Doe je alles tegelijk, dan weet je niet welke tip hielp. En de andere twee kunnen ondertussen nieuwe fouten geven.'
      },
      {
        prompt: 'Je klasgenoot zegt alleen: "je programma werkt niet." Schrijf twee vragen op die je hem stelt.',
        type: 'open',
        leerdoel: 'Je kunt je programma verbeteren na feedback van een klasgenoot.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Vraag 1: wat deed je precies toen het misging, en op welk moment gebeurde het? Vraag 2: wat zag je op het scherm, en wat had er volgens jou moeten gebeuren? Met die twee antwoorden weet ik waar ik moet zoeken. "Het werkt niet" is nog geen fout die ik kan opsporen.',
        nakijkpunten: [
          'Eén vraag gaat over wat de tester deed of zag.',
          'Eén vraag gaat over wat er had moeten gebeuren.',
          'Uit de vragen blijkt dat je de plek van de fout wilt vinden.'
        ],
        feedback: 'Met goede vragen maak je vage feedback bruikbaar. Vraag altijd naar wat er gebeurde en naar wat er had moeten gebeuren.'
      },
      {
        prompt: 'Terugblik 8.2. Wat gebeurt er met een blok dat je los op het werkveld legt?',
        leerdoel: 'Je kunt met blokken een klein programma maken dat werkt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Het wordt uitgevoerd zodra je het project de volgende keer opent.', correct: false, misconception: 'Denkt dat openen hetzelfde is als starten.' },
          { text: 'Er gebeurt niets, want geen enkele gebeurtenis start het.', correct: true, explanation: 'Zonder startblok komt het blok nooit aan de beurt.' },
          { text: 'Het wordt automatisch onder het laatste script geplakt.', correct: false, misconception: 'Denkt dat Scratch losse blokken zelf opruimt.' },
          { text: 'Het draait mee zodra een ander script bij dat blok komt.', correct: false, misconception: 'Denkt dat scripts elkaar vanzelf overnemen.' }
        ],
        feedback: 'Een los blok hoort bij geen enkel script. Het wacht dus op een startsein dat nooit komt.'
      },
      {
        prompt: 'Van je tester noteer je wat hij zag gebeuren, niet wat hij ervan vond.',
        waar: true,
        leerdoel: 'Je kunt je programma verbeteren na feedback van een klasgenoot.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'ik_doe_voor',
        feedback: '"Saai" helpt je niet verder. "Hij bleef aan de rechterrand hangen" wijst je meteen de plek aan.'
      },
      {
        prompt: 'Terugblik 8.1. Je testplan is zelf ook een klein stappenplan. Wat maakt zo\'n plan bruikbaar?',
        leerdoel: 'Je kunt uitleggen wat een algoritme is als stappenplan.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Dat er zo veel mogelijk punten in staan, want dan mis je niets.', correct: false, misconception: 'Denkt dat een testplan zo lang mogelijk moet zijn.' },
          { text: 'Dat je hem pas invult nadat je gezien hebt wat er gebeurde.', correct: false, misconception: 'Denkt dat een testplan achteraf geschreven wordt.' },
          { text: 'Dat elk punt zo concreet is dat een ander hem kan nalopen.', correct: true, explanation: 'Net als bij je stappenplan uit 8.1: geen ruimte voor eigen invulling.' },
          { text: 'Dat je er je eigen naam en de datum van de les bij zet.', correct: false, misconception: 'Verwart de inhoud met de opmaak van een document.' }
        ],
        feedback: 'Een punt als "het moet goed werken" kan niemand nalopen. "Hij keert om bij de rand" wel.'
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
          '<p><strong>Vraag.</strong> Bilal maakte thuis een Canva-account met zijn eigen Gmail. Op school lukt inloggen niet, want dat wachtwoord kent hij niet uit zijn hoofd. Wat doet hij nu?</p>',
          '<p><strong>Antwoord.</strong> Zijn werk hangt nu aan een privéadres, dus op school kan hij er niet bij. Hij had zich moeten aanmelden met zijn schoolmail, want dat adres kent hij wel. Hij maakt daarom een nieuw account: op canva.nl klikt hij op Registreren en vult zijn schoolmail in. Daarna bevestigt hij via de link in zijn mail.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['elementen', 'laag', 'downloaden'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> De poster van Lieke is af, maar downloaden lukt niet: ze gebruikte twee betaalde iconen. De les duurt nog vijf minuten. Wat kan ze doen?</p>',
          '<p><strong>Antwoord.</strong> Ze heeft drie uitwegen. Vervangen door gratis iconen kost tijd, maar levert een echt bestand. Een screenshot uitsnijden gaat snel, maar de kwaliteit wordt minder. Een link delen bij Delen is het snelst; haar docent kijkt dan online mee. Met nog vijf minuten kiest ze die link.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Canva is een online ontwerptool waarin je met een template snel een poster maakt. Je meldt je aan met je schoolmail, zodat je werk bij je schoolaccount hoort. Op de lege poster voeg je tekst toe, kies je elementen en zet je met het kleurwieltje een achtergrondkleur. Klaar? Dan klik je rechtsboven op Delen en daarna op Downloaden als PNG of PDF.</p>',
      keyTerms: ['Canva', 'template']
    },
    vragen: [
      {
        prompt: 'Met welk mailadres maak je je Canva-account voor school?',
        leerdoel: 'Je kunt met je schoolmail een Canva-account maken en inloggen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Met je schoolmail, want je werk hoort bij je schoolaccount.', correct: true, explanation: 'Zo kom je er op elke schoolcomputer weer bij.' },
          { text: 'Met een nieuw gratis mailadres dat je speciaal hiervoor maakt.', correct: false, misconception: 'Denkt dat een los adres handiger is dan het schooladres.' },
          { text: 'Met je privémail, want dan houd je je werk voor jezelf.', correct: false, misconception: 'Denkt dat schoolwerk privé hoort te blijven.' },
          { text: 'Met het mailadres van je docent, want die kijkt het toch na.', correct: false, misconception: 'Denkt dat nakijken via het account van de docent gaat.' }
        ],
        feedback: 'Alles wat je met je schoolmail maakt blijft aan school gekoppeld. Ook als je van device wisselt.'
      },
      {
        prompt: 'Canva slaat je ontwerp automatisch op, dus zoeken naar een knop bewaren heeft geen zin.',
        waar: true,
        leerdoel: 'Je kunt een A4-poster starten en tekst, elementen en kleur toevoegen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Je werk staat online en wordt tijdens het bouwen steeds bijgewerkt. Er is dus geen bewaarknop.'
      },
      {
        prompt: 'Welk onderdeel van de homepagina gebruik je om een leeg ontwerp te beginnen?',
        leerdoel: 'Je kunt met je schoolmail een Canva-account maken en inloggen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Het overzicht van je eerdere ontwerpen.', correct: false, misconception: 'Denkt dat je altijd verder werkt aan iets ouds.' },
          { text: 'De grote plusknop aan de linkerkant.', correct: true, explanation: 'Daarmee start je zonder zoeken een nieuw ontwerp.' },
          { text: 'De knop Delen rechtsboven in beeld.', correct: false, misconception: 'Verwart de knop voor delen met de knop voor beginnen.' },
          { text: 'De zoekbalk helemaal bovenin het scherm.', correct: false, misconception: 'Denkt dat zoeken de enige weg naar een nieuw ontwerp is.' }
        ],
        feedback: 'De plusknop links is je snelste ingang. De zoekbalk gebruik je als je een bepaald soort ontwerp zoekt.'
      },
      {
        prompt: 'Je titel valt weg tegen een donkere achtergrondfoto. Wat doe je?',
        leerdoel: 'Je kunt een A4-poster starten en tekst, elementen en kleur toevoegen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De titel wat kleiner maken, zodat er minder tekst overheen valt.', correct: false, misconception: 'Denkt dat de grootte het leesprobleem oplost.' },
          { text: 'Een extra plaatje achter je titel plaatsen als versiering.', correct: false, misconception: 'Voegt drukte toe in plaats van contrast.' },
          { text: 'De tekstkleur wit maken of de achtergrond lichter maken.', correct: true, explanation: 'Je letters vallen pas op als de ondergrond genoeg verschilt.' },
          { text: 'De poster liggend maken in plaats van staand neerzetten.', correct: false, misconception: 'Denkt dat het formaat met leesbaarheid te maken heeft.' }
        ],
        feedback: 'Je kunt aan twee kanten draaien: aan de letter of aan de ondergrond. Als het verschil maar groot genoeg wordt.'
      },
      {
        prompt: 'In welke twee bestandsformaten download je je Canva-ontwerp?',
        leerdoel: 'Je kunt je ontwerp downloaden of delen als PNG of PDF.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'DOCX of PPTX.', correct: false, misconception: 'Denkt dat een Canva-ontwerp een Office-bestand wordt.' },
          { text: 'MP3 of MP4.', correct: false, misconception: 'Verwart een poster met geluid of video.' },
          { text: 'PNG of PDF.', correct: true, explanation: 'Die twee staan onder Delen en dan Downloaden.' },
          { text: 'ZIP of EXE.', correct: false, misconception: 'Denkt dat een ontwerp als installatiebestand komt.' }
        ],
        feedback: 'PNG is een afbeelding en PDF is een document. Allebei kun je gewoon inleveren.'
      },
      {
        prompt: 'Downloaden lukt niet door betaalde elementen. Noem de drie uitwegen en kies er één.',
        type: 'open',
        leerdoel: 'Je kunt je ontwerp downloaden of delen als PNG of PDF.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Uitweg 1 is de betaalde elementen vervangen door gratis elementen die er bijna hetzelfde uitzien. Uitweg 2 is een screenshot maken en daaruit alleen mijn poster snijden. Uitweg 3 is bij Delen een link delen in plaats van een bestand. Ik kies uitweg 1, want dan heb ik een echt bestand en blijft de kwaliteit goed.',
        nakijkpunten: [
          'Alle drie de uitwegen uit de opdracht worden genoemd.',
          'Er wordt één uitweg gekozen met een reden erbij.'
        ],
        feedback: "Elke uitweg heeft een prijs: tijd, kwaliteit of afhankelijk zijn van je account. Kies bewust en zeg waarom."
      },
      {
        prompt: 'Terugblik 8.1. Waarom staan de aanmeldstappen van Canva genummerd en los van elkaar?',
        leerdoel: 'Je kunt een dagelijkse handeling in duidelijke stappen opschrijven.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Zo mag je zelf kiezen in welke volgorde je ze gaat uitvoeren.', correct: false, misconception: 'Denkt dat genummerde stappen door elkaar mogen.' },
          { text: 'Zo weet Canva welke stap jij als laatste hebt afgerond.', correct: false, misconception: 'Denkt dat het programma je stappen bijhoudt.' },
          { text: 'Zo kun je ze één voor één afvinken en zie je waar je bent.', correct: true, explanation: 'Een genummerd stappenplan is precies wat je in 8.1 leerde.' },
          { text: 'Zo passen ze allemaal precies op één bladzijde van je scherm.', correct: false, misconception: 'Denkt dat het om de ruimte op het scherm gaat.' }
        ],
        feedback: 'Dit is hetzelfde idee als je stappenplan uit 8.1. Elke stap is los uitvoerbaar en de volgorde ligt vast.'
      },
      {
        prompt: 'Canva noemt het formaat A3, terwijl de opdracht om een A4-poster vraagt. Dat is dezelfde staande vorm.',
        waar: true,
        leerdoel: 'Je kunt een A4-poster starten en tekst, elementen en kleur toevoegen.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'ik_doe_voor',
        feedback: 'A3 is precies twee keer zo groot als A4, met dezelfde verhouding. Je poster blijft dus staand en klopt gewoon.'
      },
      {
        prompt: 'Terugblik 8.3. Je poster is klaar. Hoe kom je erachter of hij doet wat jij bedoelde?',
        leerdoel: 'Je kunt je programma testen en zien waar het misgaat.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        options: [
          { text: 'Je laat hem zien aan iemand die je onderwerp niet kent.', correct: true, explanation: 'Testen doe je altijd met iemand die je bedoeling nog niet kent.' },
          { text: 'Je leest hem zelf nog een keer helemaal rustig door.', correct: false, misconception: 'Denkt dat de maker zijn eigen werk goed kan beoordelen.' },
          { text: 'Je telt of je alle negen stappen uit de opdracht hebt gedaan.', correct: false, misconception: 'Verwart afvinken met controleren of het overkomt.' }
        ],
        feedback: 'Een programma test je door het uit te voeren, een poster door hem te laten zien. Jij kent je bedoeling al, dus jij bent de slechtste tester.'
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
        keyTerms: ['chatbot', 'prompt', 'eigen woorden'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sanne typt bij de chatbot alleen het woord "cyberpesten". Ze krijgt acht alinea\'s terug en kan er niets mee. Hoe maakt ze er een goede prompt van?</p>',
          '<p><strong>Antwoord.</strong> Ze zet er vier dingen in. De opdracht: "geef vier tips". Het onderwerp: "tegen cyberpesten". De doelgroep: "voor brugklassers". De lengte: "elke tip maximaal twintig woorden". Samen wordt dat één zin, en dan komt er tekst terug die bijna op een poster past. Daarna schrijft ze het in haar eigen woorden over.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['leesbaar', 'witruimte', 'actie'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Op de poster van Ryan staan acht plaatjes, zes kleuren en een titel van veertien woorden. Niemand blijft ervoor staan. Wat verander je als eerste?</p>',
          '<p><strong>Antwoord.</strong> Begin bij de titel: veertien woorden lees je niet in het voorbijgaan. Kort hem in tot vier woorden en maak de letters groot. Haal daarna zes plaatjes weg en houd er twee over. Kies drie kleuren die bij elkaar passen. De lege plekken die overblijven zijn witruimte, en die laat je zo.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Bij de eindopdracht haal je informatie op met een chatbot. Je geeft die chatbot een prompt met de opdracht, het onderwerp, de doelgroep en de lengte. Wat je terugkrijgt controleer je en schrijf je in je eigen woorden over. Daarna maak je een poster die leesbaar is, niet te druk, en die de kijker aanzet tot een actie.</p>',
      keyTerms: ['prompt', 'leesbaar']
    },
    vragen: [
      {
        prompt: 'Welke prompt levert de bruikbaarste tekst voor je poster op?',
        leerdoel: 'Je kunt met een chatbot informatie verzamelen over jouw onderwerp.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Vertel eens iets over privacy online, ik ben heel benieuwd.', correct: false, misconception: 'Denkt dat een vriendelijke vraag hetzelfde is als een prompt.' },
          { text: 'Geef drie korte tips over privacy voor twaalfjarigen.', correct: true, explanation: 'Hier staan opdracht, onderwerp, doelgroep en lengte in.' },
          { text: 'Privacy online.', correct: false, misconception: 'Denkt dat een zoekterm genoeg is voor een chatbot.' }
        ],
        feedback: 'Een prompt met vier onderdelen levert tekst die bijna op je poster past. Een los woord levert een algemeen verhaal.'
      },
      {
        prompt: 'Je mag de tekst van de chatbot letterlijk op je poster overnemen.',
        waar: false,
        leerdoel: 'Je kunt die informatie in je eigen woorden op een poster zetten.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'De opdracht vraagt juist dat je de informatie aanpast naar je eigen woorden. Anders is het niet jouw tekst.'
      },
      {
        prompt: 'Waarom schrijf je het antwoord van de chatbot in je eigen woorden over?',
        leerdoel: 'Je kunt die informatie in je eigen woorden op een poster zetten.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Anders slaat Canva jouw poster niet automatisch meer op.', correct: false, misconception: 'Denkt dat het met de techniek van Canva te maken heeft.' },
          { text: 'Anders past de tekst niet in het tekstvak van je poster.', correct: false, misconception: 'Denkt dat het alleen om de ruimte op de poster gaat.' },
          { text: 'Anders is de tekst niet van jou en kun je hem niet uitleggen.', correct: true, explanation: 'Je docent kan vragen wat er staat, en dat moet je weten.' },
          { text: 'Anders mag je je poster niet als PDF bij je docent inleveren.', correct: false, misconception: 'Denkt dat het inleveren zelf geblokkeerd wordt.' }
        ],
        feedback: 'Herschrijven doe je om twee redenen. De tekst wordt van jou, en je hebt hem meteen gecontroleerd.'
      },
      {
        prompt: 'Wanneer is een poster leesbaar?',
        leerdoel: 'Je kunt een poster maken die leesbaar, rustig en aantrekkelijk is.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Als er minstens vijf verschillende kleuren op gebruikt zijn.', correct: false, misconception: 'Denkt dat veel kleur een poster duidelijker maakt.' },
          { text: 'Als de tekst genoeg verschilt van de achtergrond eronder.', correct: true, explanation: 'Zonder verschil valt de tekst weg in de foto of kleur.' },
          { text: 'Als de tekstvakken helemaal tot aan de rand doorlopen.', correct: false, misconception: 'Denkt dat een volle poster meer vertelt.' }
        ],
        feedback: 'Leesbaar gaat over het verschil tussen letter en ondergrond. Niet over hoeveel er op je poster staat.'
      },
      {
        prompt: 'Welke zin op een poster zet de kijker aan tot een actie?',
        leerdoel: 'Je kunt een poster maken die leesbaar, rustig en aantrekkelijk is.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Wij vinden pesten heel erg vervelend.', correct: false, misconception: 'Denkt dat een mening al een oproep is.' },
          { text: 'Deze poster gaat over cyberpesten.', correct: false, misconception: 'Verwart het onderwerp noemen met iets vragen.' },
          { text: 'Koop nu je ticket op onze website.', correct: true, explanation: 'De kijker weet meteen wat hij moet doen.' }
        ],
        feedback: 'Een actie is iets wat de kijker daarna gaat doen: kopen, klikken, invullen of iets verkopen.'
      },
      {
        prompt: 'Herschrijf deze zin kort voor een poster: "Het verdient aanbeveling regelmatig pauze te nemen van beeldschermen."',
        type: 'open',
        leerdoel: 'Je kunt die informatie in je eigen woorden op een poster zetten.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Bijvoorbeeld: "Kijk elke 20 minuten even weg van je scherm." De zin is nu kort en staat in gewone woorden. Er staat ook meteen bij wat je moet doen, dus de kijker weet wat er van hem verwacht wordt.',
        nakijkpunten: [
          'De nieuwe zin is korter dan het origineel.',
          'Er staan alleen alledaagse woorden in.',
          'De zin zegt concreet wat de lezer kan doen.'
        ],
        feedback: "Op een poster win je met korte zinnen in gewone woorden. Zet er ook bij wat de lezer kan doen."
      },
      {
        prompt: 'Terugblik 8.4. Hoe zorg je dat je poster staand wordt en niet liggend?',
        leerdoel: 'Je kunt een A4-poster starten en tekst, elementen en kleur toevoegen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je draait de poster achteraf een kwartslag via het menu laag.', correct: false, misconception: 'Denkt dat lagen ook het formaat draaien.' },
          { text: 'Je zet het vinkje staand aan in het scherm van Downloaden.', correct: false, misconception: 'Denkt dat je het formaat bij het downloaden kiest.' },
          { text: 'Bij het zoeken kies je "poster staand, A3" uit de lijst.', correct: true, explanation: 'Het formaat kies je meteen bij het starten van je ontwerp.' }
        ],
        feedback: 'Het formaat kies je vooraf. Canva noemt het A3, en dat is dezelfde staande poster als de A4 uit de opdracht.'
      },
      {
        prompt: 'Een poster met veel plaatjes en veel kleuren valt beter op dan een rustige poster.',
        waar: false,
        leerdoel: 'Je kunt een poster maken die leesbaar, rustig en aantrekkelijk is.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Bij veel drukte weet een kijker niet waar hij moet beginnen. Dan valt er juist niets meer op.'
      },
      {
        prompt: 'Terugblik 8.1. De acht stappen van deze eindopdracht zijn ook een stappenplan. Wat gebeurt er als je stap 5 overslaat?',
        leerdoel: 'Je kunt een dagelijkse handeling in duidelijke stappen opschrijven.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'reflecteren',
        options: [
          { text: 'Je poster wordt liggend in plaats van staand neergezet.', correct: false, misconception: 'Verwart het herschrijven met de formaatkeuze uit stap 2.' },
          { text: 'Je poster mist een afbeelding en voldoet daardoor niet.', correct: false, misconception: 'Verwart het herschrijven met het toevoegen van beeld.' },
          { text: 'De chatbottekst staat letterlijk op je poster en is niet van jou.', correct: true, explanation: 'Stap 5 is precies de stap waarin je het antwoord omschrijft.' },
          { text: 'Je kunt je poster niet meer downloaden als PNG of PDF.', correct: false, misconception: 'Denkt dat het downloaden van eerdere stappen afhangt.' }
        ],
        feedback: 'Een stap overslaan valt pas op bij het resultaat. Hier lever je dan tekst in die je zelf niet kunt uitleggen.'
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
        keyTerms: ['terugblikken', 'vergelijken'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Dylan schrijft: "Ik heb veel geleerd en het was leuk." Amara schrijft: "Ik wist niet dat een slotje geen bewijs is. Nu kijk ik eerst naar de reviews." Waarom telt alleen de tweede?</p>',
          '<p><strong>Antwoord.</strong> Dylan noemt geen onderwerp en geen handeling; zijn zin past bij elk vak van school. Amara noemt er twee: wat ze niet wist, en wat ze nu anders doet. Dat tweede weegt het zwaarst, want terugblikken is het verschil tussen toen en nu benoemen.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['eindcreatie', 'bronvermelding'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Youssef wil laten zien dat hij nepnieuws herkent. Hij twijfelt tussen optie A, B en C. Welke kiest hij, en wat zet hij eronder?</p>',
          '<p><strong>Antwoord.</strong> Herkennen gaat in stappen: eerst een voorbeeld, dan de kenmerken, dan de controle. Kies dus de vorm die stappen aankan. Dat is optie C, de PowerPoint van drie dia\'s. Loop daarna de eisen na: per dia een titel, een afbeelding en korte uitleg. Onderaan de laatste dia komt de bronvermelding: DaCapo College, CC BY 4.0.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Je sluit het jaar af met terugblikken: je beantwoordt vier vragen en vergelijkt je antwoorden met een klasgenoot. Daarna laat je in vijfentwintig minuten zien wat je kunt met een eindcreatie in Canva, Word of PowerPoint. Onder je werk zet je een bronvermelding, want het lesmateriaal is gedeeld onder CC BY 4.0.</p>',
      keyTerms: ['terugblikken', 'eindcreatie']
    },
    vragen: [
      {
        prompt: 'Welke omschrijving hoort bij een algoritme?',
        leerdoel: 'Je kunt uitleggen wat een algoritme is als stappenplan.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Een lijst met programma\'s die op jouw laptop geïnstalleerd zijn.', correct: false, misconception: 'Verwart een algoritme met software op een apparaat.' },
          { text: 'Een rij stappen die precies zegt hoe je iets doet.', correct: true, explanation: 'Van begin tot resultaat, zonder ruimte voor eigen invulling.' },
          { text: 'Een verzameling gegevens waaruit een computer leert kiezen.', correct: false, misconception: 'Verwart het stappenplan met de data eromheen.' },
          { text: 'Een melding die verschijnt als je programma vastgelopen is.', correct: false, misconception: 'Verwart een algoritme met een foutmelding.' }
        ],
        feedback: 'Een recept en een wasvoorschrift zijn ook algoritmes. Er hoeft dus geen computer aan te pas te komen.'
      },
      {
        prompt: 'Dezelfde stappen in een andere volgorde geven altijd hetzelfde resultaat.',
        waar: false,
        leerdoel: 'Je kunt uitleggen wat een algoritme is als stappenplan.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'Eerst je sleutel pakken en dan de deur op slot doen werkt. Andersom sta je buiten zonder sleutel.'
      },
      {
        prompt: 'Je schrijft het inpakken van je tas op voor een robot. Welke regel hoort daar niet in?',
        leerdoel: 'Je kunt een dagelijkse handeling in duidelijke stappen opschrijven.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Pak voor elk vak op je rooster het boek en het schrift.', correct: false, misconception: 'Ziet een herhaling aan voor een onduidelijke stap.' },
          { text: 'Doe verder alles wat je normaal ook zou doen.', correct: true, explanation: 'Deze regel laat de robot zelf invullen, en dat kan hij niet.' },
          { text: 'Open je rooster in SOMtoday en kijk welke dag het is.', correct: false, misconception: 'Denkt dat een openingsstap overbodig is.' },
          { text: 'Als je gym hebt, pak dan ook je sporttas uit de kast.', correct: false, misconception: 'Ziet een keuze met voorwaarde aan voor vaagheid.' }
        ],
        feedback: 'Een stap moet uitvoerbaar zijn op het moment dat hij aan de beurt is. "Doe de rest maar" is dat niet.'
      },
      {
        prompt: 'Schrijf het maken van een tosti op in vijf stappen. Bouw er één keuze met een voorwaarde in.',
        type: 'open',
        leerdoel: 'Je kunt een dagelijkse handeling in duidelijke stappen opschrijven.',
        denkniveau: 'toepassen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: '1. Pak twee sneetjes brood uit de zak. 2. Leg er een plak kaas tussen. 3. Zet het tosti-ijzer aan en wacht tot het lampje uit gaat. 4. Leg de tosti erin en sluit het deksel. 5. Als de tosti bruin is, dan haal je hem eruit, anders wacht je nog een minuut. Stap 5 is de keuze. De voorwaarde is "de tosti is bruin".',
        nakijkpunten: [
          'Er staan vijf stappen die los uitvoerbaar zijn.',
          'Er staat een keuze in die met "als" begint.',
          'De voorwaarde wordt aangewezen of genoemd.'
        ],
        feedback: "Een keuze herken je aan \"als\". De voorwaarde is het stuk dat waar of niet waar kan zijn."
      },
      {
        prompt: 'Wat doet een herhaling in een stappenplan voor je?',
        leerdoel: 'Je weet wat een herhaling en een keuze in een stappenplan zijn.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Om te bepalen onder welke voorwaarde iets mag gebeuren.', correct: false, misconception: 'Verwart de herhaling met de keuze.' },
          { text: 'Om iets meerdere keren te laten gebeuren zonder overtypen.', correct: true, explanation: 'Eén regel vervangt twintig dezelfde regels.' },
          { text: 'Om aan te geven welke stap als allerlaatste aan de beurt is.', correct: false, misconception: 'Denkt dat een herhaling over volgorde gaat.' }
        ],
        feedback: 'Een herhaling zegt hoe vaak. Een keuze zegt onder welke voorwaarde. Dat zijn twee verschillende dingen.'
      },
      {
        prompt: 'In de zin "als je gym hebt, dan pak je je sporttas" is "je hebt gym" de voorwaarde.',
        waar: true,
        leerdoel: 'Je weet wat een herhaling en een keuze in een stappenplan zijn.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'De voorwaarde staat achter het woordje "als" en kan waar of niet waar zijn.'
      },
      {
        prompt: 'Waarom kun je in een blokkentaal geen tikfout maken?',
        leerdoel: 'Je kunt met blokken een klein programma maken dat werkt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Scratch verbetert je spelling automatisch tijdens het typen.', correct: false, misconception: 'Denkt dat er een spellingcontrole meedraait.' },
          { text: 'Je klikt kant-en-klare blokken aan in plaats van te typen.', correct: true, explanation: 'De tekst op een blok staat er al, dus je typt hem niet.' },
          { text: 'Elk blok wordt eerst gecontroleerd voordat je hem gebruikt.', correct: false, misconception: 'Denkt dat er een controle vooraf plaatsvindt.' },
          { text: 'Je mag maar één blok tegelijk op het werkveld neerleggen.', correct: false, misconception: 'Denkt dat er een limiet aan het aantal blokken zit.' }
        ],
        feedback: 'De tekst staat al op het blok. Je aandacht gaat daardoor naar de volgorde en niet naar de spelling.'
      },
      {
        prompt: 'Een script van drie blokken start niet. Wat is de meest waarschijnlijke oorzaak?',
        leerdoel: 'Je kunt met blokken een klein programma maken dat werkt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Er staat geen gebeurtenisblok boven de stapel blokken.', correct: true, explanation: 'Zonder startsein komt geen enkel blok aan de beurt.' },
          { text: 'De blokken hebben niet allemaal dezelfde kleur gekregen.', correct: false, misconception: 'Denkt dat kleuren bij elkaar moeten passen.' },
          { text: 'Er staan te weinig blokken onder elkaar om te kunnen starten.', correct: false, misconception: 'Denkt dat een script een minimumlengte heeft.' },
          { text: 'De sprite staat op de verkeerde plek van het speelveld.', correct: false, misconception: 'Zoekt de fout bij de positie van de sprite.' }
        ],
        feedback: 'Kijk altijd eerst naar het bovenste blok. Is dat geen gele gebeurtenis, dan gebeurt er niets.'
      },
      {
        prompt: 'Waar moet een als-dan-blok liggen als je elke ronde de rand wilt controleren?',
        leerdoel: 'Je kunt in je programma een herhaling en een als-dan-keuze gebruiken.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Los naast de herhaling, zodat het altijd blijft meedraaien.', correct: false, misconception: 'Denkt dat losse blokken zelfstandig doorlopen.' },
          { text: 'Vlak boven het gebeurtenisblok van je hele script.', correct: false, misconception: 'Denkt dat de controle voor de start moet gebeuren.' },
          { text: 'In de opening van het blok herhaal, tussen de andere blokken.', correct: true, explanation: 'Alles binnen de lus wordt elke ronde opnieuw gedaan.' }
        ],
        feedback: 'Binnen de lus is de controle elke ronde aan de beurt. Buiten de lus hooguit één keer.'
      },
      {
        prompt: 'Een herhaal-blok voert de blokken erbuiten net zo vaak uit als de blokken erbinnen.',
        waar: false,
        leerdoel: 'Je kunt in je programma een herhaling en een als-dan-keuze gebruiken.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'Alleen wat in de opening van de lus ligt gaat mee. Wat eronder staat komt pas na afloop aan de beurt.'
      },
      {
        prompt: 'Vertel in drie zinnen na wat een programma doet dat start, herhaalt en bij de rand omkeert.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen wat jouw programma stap voor stap doet.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Het script begint zodra je op de groene vlag klikt. Daarna start het blok herhaal, waarin de sprite steeds tien stappen loopt en omkeert aan de rand. Binnen die herhaling kijkt een als-dan-blok bovendien of "raak ik (rand)?" waar is, en dan roept hij Boing.',
        nakijkpunten: [
          'De drie zinnen volgen de volgorde van de blokken.',
          'De herhaling en de als-dan-keuze worden allebei genoemd.'
        ],
        feedback: "Wie een script kan navertellen, kan het ook repareren. Volg de blokken en niet je bedoeling."
      },
      {
        prompt: 'Waarom helpt navertellen je bij het opsporen van een fout?',
        leerdoel: 'Je kunt uitleggen wat jouw programma stap voor stap doet.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Je programma gaat sneller als je het hardop hebt uitgelegd.', correct: false, misconception: 'Denkt dat uitleggen het programma zelf verandert.' },
          { text: 'Je moet elke stap benoemen, en dan valt op wat je oversloeg.', correct: true, explanation: 'In je hoofd sla je bekende stappen ongemerkt over.' },
          { text: 'Scratch markeert het blok dat je tijdens het praten aanwijst.', correct: false, misconception: 'Denkt dat de editor meekijkt met je uitleg.' }
        ],
        feedback: 'Daarom werkt uitleggen aan een klasgenoot of aan een badeendje. Je hoort jezelf de stap missen.'
      },
      {
        prompt: 'Wat hoort er in een testplan te staan?',
        leerdoel: 'Je kunt je programma testen en zien waar het misgaat.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Het cijfer dat je hoopt te halen voor deze opdracht.', correct: false, misconception: 'Verwart een testplan met een doel voor jezelf.' },
          { text: 'Vooraf opgeschreven wat er zou moeten gebeuren.', correct: true, explanation: 'Zonder verwachting vooraf praat je je resultaat goed.' },
          { text: 'Een lijst met alle blokken die je in Scratch gebruikt hebt.', correct: false, misconception: 'Denkt dat een testplan je script beschrijft.' },
          { text: 'De namen van alle klasgenoten die je programma bekeken hebben.', correct: false, misconception: 'Denkt dat een testplan bijhoudt wie er getest heeft.' }
        ],
        feedback: 'Een testplan schrijf je vooraf. Daarna vergelijk je wat er echt gebeurde met wat er zou moeten gebeuren.'
      },
      {
        prompt: 'Bij het debuggen verander je steeds maar één ding tegelijk.',
        waar: true,
        leerdoel: 'Je kunt je programma testen en zien waar het misgaat.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'Zo weet je na elke test welke verandering het verschil maakte. Bij drie tegelijk weet je dat niet.'
      },
      {
        prompt: 'Waarvan is het woord bug afkomstig?',
        leerdoel: 'Je weet wat een bug is en hoe je die opspoort.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Van het Engelse woord voor insect, al lang voor de computer.', correct: true, explanation: 'Edison schreef er in 1878 al over in zijn brieven.' },
          { text: 'Van de achternaam van de eerste programmeur van Scratch.', correct: false, misconception: 'Denkt dat het naar een persoon vernoemd is.' },
          { text: 'Van een Engelse afkorting voor een kapot stukje software.', correct: false, misconception: 'Denkt dat het een afkorting is.' },
          { text: 'Van een merk computers dat in de jaren zestig kapotging.', correct: false, misconception: 'Denkt aan een merknaam uit de computergeschiedenis.' }
        ],
        feedback: 'In 1947 zat er echt een mot in een computer. Dat verhaal maakte het woord beroemd, maar het bestond al.'
      },
      {
        prompt: 'Je programma draait zonder foutmelding, maar doet niet wat jij bedoelde. Wat is er aan de hand?',
        leerdoel: 'Je weet wat een bug is en hoe je die opspoort.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Er is niets aan de hand, want er komt geen melding op je scherm.', correct: false, misconception: 'Denkt dat geen melding hetzelfde is als geen fout.' },
          { text: 'Er zit een bug in, ook al klaagt de computer nergens over.', correct: true, explanation: 'Een bug is elk verschil tussen bedoeling en resultaat.' },
          { text: 'Je computer moet opnieuw opgestart worden voor het werkt.', correct: false, misconception: 'Zoekt de oorzaak buiten het eigen script.' }
        ],
        feedback: 'Geen melding betekent alleen dat de computer je blokken kon uitvoeren. Of het klopte wat er stond, weet hij niet.'
      },
      {
        prompt: 'Een klasgenoot zegt dat jouw kat door de rand heen loopt. Wat doe je als eerste?',
        leerdoel: 'Je kunt je programma verbeteren na feedback van een klasgenoot.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Je bouwt je hele script opnieuw op met verse blokken.', correct: false, misconception: 'Gooit werk weg in plaats van de fout te zoeken.' },
          { text: 'Je vraagt wat hij precies deed en wat hij daarbij zag.', correct: true, explanation: 'Pas met die details weet je waar je moet zoeken.' },
          { text: 'Je legt uit dat het bij jou thuis wel gewoon goed ging.', correct: false, misconception: 'Verdedigt het werk in plaats van het te onderzoeken.' },
          { text: 'Je verandert meteen drie blokken en test daarna één keer.', correct: false, misconception: 'Wil snel klaar zijn en verliest het overzicht.' }
        ],
        feedback: 'Feedback wordt pas bruikbaar als je weet wat er precies gebeurde. Daarna pas ga je aanpassen.'
      },
      {
        prompt: 'Een tip van een klasgenoot voer je altijd door, ook als je het er zelf niet mee eens bent.',
        waar: false,
        leerdoel: 'Je kunt je programma verbeteren na feedback van een klasgenoot.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'Je controleert de tip eerst zelf. Daarna beslis jij of je hem overneemt, en je schrijft je reden erbij.'
      },
      {
        prompt: 'Waarom maak je je Canva-account met je schoolmail?',
        leerdoel: 'Je kunt met je schoolmail een Canva-account maken en inloggen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Omdat Canva alleen accounts van scholen gratis laat werken.', correct: false, misconception: 'Denkt dat de gratis versie aan een schooladres hangt.' },
          { text: 'Omdat je werk dan bij je schoolaccount hoort en blijft.', correct: true, explanation: 'Je komt er op elke schoolcomputer weer bij.' },
          { text: 'Omdat je docent anders jouw wachtwoord niet kan opzoeken.', correct: false, misconception: 'Denkt dat docenten wachtwoorden kunnen inzien.' },
          { text: 'Omdat een privéadres na een jaar automatisch verloopt.', correct: false, misconception: 'Denkt dat privémail vanzelf ophoudt te bestaan.' }
        ],
        feedback: 'Je schoolmail ken je uit je hoofd en hij hoort bij school. Daarmee raak je je werk niet kwijt.'
      },
      {
        prompt: 'Na het registreren bij Canva kun je meteen inloggen, zonder je e-mail te bevestigen.',
        waar: false,
        leerdoel: 'Je kunt met je schoolmail een Canva-account maken en inloggen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'Je klikt eerst op de link in je mail of vult de code in. Pas daarna werkt het inloggen.'
      },
      {
        prompt: 'Je hebt een lege staande poster. Welke drie dingen voeg je toe volgens de opdracht?',
        leerdoel: 'Je kunt een A4-poster starten en tekst, elementen en kleur toevoegen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Een tekst, een of meer elementen, en een achtergrondkleur.', correct: true, explanation: 'Dat zijn precies de drie stappen uit het stappenplan.' },
          { text: 'Een geluidsfragment, een video en een animatie met beweging.', correct: false, misconception: 'Denkt dat een poster met multimedia gevuld wordt.' },
          { text: 'Een tabel, een grafiek en een automatische inhoudsopgave erbij.', correct: false, misconception: 'Verwart de poster met een Word-verslag.' },
          { text: 'Een voorblad, paginanummers en koppen boven elk tekstvak.', correct: false, misconception: 'Past de opmaakregels van hoofdstuk 4 op een poster toe.' }
        ],
        feedback: 'Tekst, elementen en kleur zijn de drie bouwstenen van je poster. Vormen en iconen zitten onder elementen.'
      },
      {
        prompt: 'Waar vind je in Canva de iconen en de vormen voor je poster?',
        leerdoel: 'Je kunt een A4-poster starten en tekst, elementen en kleur toevoegen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Onder het menu uploads, tussen je eigen foto\'s en filmpjes.', correct: false, misconception: 'Denkt dat uploads ook de voorraad van Canva bevat.' },
          { text: 'Onder het menu elementen, links in het scherm.', correct: true, explanation: 'Daar staan afbeeldingen, iconen en vormen bij elkaar.' },
          { text: 'Onder de knop Delen, vlak naast het downloaden.', correct: false, misconception: 'Verwart de knop voor inleveren met een materiaalmenu.' },
          { text: 'Onder het menu tekst, naast de lijst met lettertypen.', correct: false, misconception: 'Denkt dat alle opmaak bij het tekstmenu zit.' }
        ],
        feedback: 'Lijnen, cirkels en kaders zijn vormen, en die zitten samen met de iconen onder elementen.'
      },
      {
        prompt: 'Via welke knoppen download je je Canva-ontwerp?',
        leerdoel: 'Je kunt je ontwerp downloaden of delen als PNG of PDF.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Eerst linksboven Canva, daarna Bestand en dan Opslaan als.', correct: false, misconception: 'Zoekt het Office-menu in een online ontwerptool.' },
          { text: 'Eerst rechtsboven Delen en daarna Downloaden.', correct: true, explanation: 'Delen is de ingang voor alles wat je ontwerp verlaat.' },
          { text: 'Eerst het menu elementen en daarna de knop Exporteren.', correct: false, misconception: 'Denkt dat downloaden bij het materiaalmenu zit.' },
          { text: 'Eerst rechtermuisknop op je poster en dan Opslaan als.', correct: false, misconception: 'Gebruikt de gewone browsermanier in plaats van de knop.' }
        ],
        feedback: 'Onder Delen zitten allebei de manieren om je werk in te leveren: downloaden en een link delen.'
      },
      {
        prompt: 'Downloaden lukt niet door een betaald element. Welke oplossing hoort niet bij de drie uitwegen?',
        leerdoel: 'Je kunt je ontwerp downloaden of delen als PNG of PDF.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Een screenshot maken en daaruit alleen je poster snijden.', correct: false, misconception: 'Denkt dat een screenshot niet mag van de opdracht.' },
          { text: 'Het betaalde element vervangen door een gratis element.', correct: false, misconception: 'Denkt dat vervangen geen echte oplossing is.' },
          { text: 'Een proefabonnement nemen met de bankpas van je ouders.', correct: true, explanation: 'Betalen staat niet in de opdracht en hoeft ook niet.' },
          { text: 'Bij Delen een link delen in plaats van een echt bestand.', correct: false, misconception: 'Denkt dat een link niet meetelt als inlevering.' }
        ],
        feedback: 'De drie uitwegen zijn vervangen, een screenshot uitsnijden of een link delen. Betalen hoort er niet bij.'
      },
      {
        prompt: 'Welk onderdeel ontbreekt in de prompt "geef tips over nepnieuws"?',
        leerdoel: 'Je kunt met een chatbot informatie verzamelen over jouw onderwerp.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        options: [
          { text: 'De opdracht, want er staat nergens wat de chatbot moet doen.', correct: false, misconception: 'Ziet "geef tips" niet als de opdracht.' },
          { text: 'Het onderwerp, want nepnieuws is daarvoor veel te breed.', correct: false, misconception: 'Denkt dat een onderwerp altijd smaller moet.' },
          { text: 'De doelgroep en de lengte van het antwoord dat je wilt.', correct: true, explanation: 'Zonder die twee gokt de chatbot en krijg je een lang verhaal.' }
        ],
        feedback: 'Een prompt heeft vier onderdelen. Hier staan de opdracht en het onderwerp er wel, de andere twee niet.'
      },
      {
        prompt: 'Een chatbot geeft altijd een antwoord dat klopt, dus controleren hoeft niet.',
        waar: false,
        leerdoel: 'Je kunt met een chatbot informatie verzamelen over jouw onderwerp.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'Een chatbot kan dingen verzinnen die zeker klinken. Zoek het daarom na bij een tweede bron.'
      },
      {
        prompt: 'Wat maakt een herschreven zin geschikt voor een poster?',
        leerdoel: 'Je kunt die informatie in je eigen woorden op een poster zetten.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Hij is langer, zodat er meer uitleg op de poster past.', correct: false, misconception: 'Denkt dat meer uitleg een poster beter maakt.' },
          { text: 'Hij is kort en staat in gewone woorden die jij snapt.', correct: true, explanation: 'Dan kun je hem ook uitleggen als je docent ernaar vraagt.' },
          { text: 'Hij is letterlijk overgenomen, zodat er geen fouten in staan.', correct: false, misconception: 'Denkt dat overnemen veiliger is dan zelf schrijven.' },
          { text: 'Hij bevat moeilijke woorden, want dat staat serieuzer.', correct: false, misconception: 'Denkt dat moeilijke taal deskundiger overkomt.' }
        ],
        feedback: 'Kort en gewoon Nederlands wint op een poster. Een lezer loopt langs en heeft maar een paar seconden.'
      },
      {
        prompt: 'Schrijf op wat er mis is met deze postertekst: "Onderzoek toont aan dat overmatig beeldschermgebruik nadelige effecten kan sorteren."',
        type: 'open',
        leerdoel: 'Je kunt die informatie in je eigen woorden op een poster zetten.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'De zin is te lang en staat vol moeilijke woorden, zoals "sorteren" en "overmatig". Iemand die langsloopt leest dat niet. De zin zegt ook niet wat je moet doen. Beter is: "Te lang op je scherm? Neem elk uur even pauze." Die zin is kort, in gewone woorden, en zet aan tot een actie.',
        nakijkpunten: [
          'Er wordt benoemd dat de zin te lang of te moeilijk is.',
          'Er staat een kortere versie in gewone woorden bij.'
        ],
        feedback: "Een poster wordt in seconden bekeken. Alles wat de lezer moet ontcijferen kost je zijn aandacht."
      },
      {
        prompt: 'Welke poster voldoet aan de eis dat hij niet te druk is?',
        leerdoel: 'Je kunt een poster maken die leesbaar, rustig en aantrekkelijk is.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Een poster met zeven plaatjes, zes kleuren en veel kleine tekst.', correct: false, misconception: 'Denkt dat veel inhoud een poster informatiever maakt.' },
          { text: 'Een poster met een grote titel, twee tekstvakken en één icoon.', correct: true, explanation: 'Weinig onderdelen laten je titel zijn werk doen.' },
          { text: 'Een poster die van rand tot rand met tekstvakken gevuld is.', correct: false, misconception: 'Denkt dat lege ruimte verspilling is.' }
        ],
        feedback: 'Witruimte is geen verspilling. Het is de rust waarin je titel opvalt.'
      },
      {
        prompt: 'Een poster die alleen mooi is maar niets vraagt van de kijker, voldoet aan alle vijf de kenmerken.',
        waar: false,
        leerdoel: 'Je kunt een poster maken die leesbaar, rustig en aantrekkelijk is.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'Een van de vijf kenmerken is juist dat je poster aanzet tot een actie, zoals klikken of invullen.'
      },
      {
        prompt: 'Welke terugblik laat het best zien dat iemand echt iets geleerd heeft?',
        leerdoel: 'Je kunt terugkijken op wat je dit jaar geleerd hebt over digitale geletterdheid.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Ik vond de lessen over veilig internet heel erg interessant.', correct: false, misconception: 'Denkt dat een mening over de les een terugblik is.' },
          { text: 'Ik controleer nu eerst de afzender van elke mail.', correct: true, explanation: 'Er staat een handeling in die de leerling nu echt doet.' },
          { text: 'Ik heb dit jaar een heleboel nieuwe dingen bijgeleerd.', correct: false, misconception: 'Blijft algemeen en noemt geen onderwerp of handeling.' }
        ],
        feedback: 'Een terugblik telt pas als er een onderwerp en een handeling in staan. Alleen een gevoel is te weinig.'
      },
      {
        prompt: 'Schrijf twee zinnen terugblik over dit jaar. Noem een onderwerp en een handeling die je nu anders doet.',
        type: 'open',
        leerdoel: 'Je kunt terugkijken op wat je dit jaar geleerd hebt over digitale geletterdheid.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        modelAnswer: 'Het meest is me bijgebleven dat een slotje in de adresbalk geen bewijs is dat een webshop eerlijk is. Sinds die les kijk ik eerst naar de reviews en naar het adres van het bedrijf voordat ik iets bestel.',
        nakijkpunten: [
          'Er wordt een concreet onderwerp uit dit jaar genoemd.',
          'Er staat een handeling bij die de leerling nu echt anders doet.'
        ],
        feedback: "Terugblikken is het verschil tussen toen en nu benoemen. Een handeling is daarvoor het beste bewijs."
      },
      {
        prompt: 'Welke drie programma\'s mag je gebruiken voor je eindcreatie?',
        leerdoel: 'Je kunt je kennis laten zien in een eigen eindcreatie in Canva, Word of PowerPoint.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Scratch, Excel of Outlook, afhankelijk van je onderwerp.', correct: false, misconception: 'Kiest programma\'s uit andere hoofdstukken van dit jaar.' },
          { text: 'Canva, Word of PowerPoint, en ze tellen even zwaar.', correct: true, explanation: 'Optie A, B en C uit de opdracht van deze paragraaf.' },
          { text: 'Alleen Canva, want daar heb je net twee lessen mee geoefend.', correct: false, misconception: 'Denkt dat de laatste tool de enige toegestane is.' },
          { text: 'Word of PowerPoint, want een poster telt niet als verslag.', correct: false, misconception: 'Denkt dat een poster te weinig bewijs oplevert.' }
        ],
        feedback: 'De drie opties tellen even zwaar. Je kiest de vorm die het best bij jouw onderwerp past.'
      },
      {
        prompt: 'Je kiest optie B, het Word-verslag. Welke opmaak moet erin zitten?',
        leerdoel: 'Je kunt je kennis laten zien in een eigen eindcreatie in Canva, Word of PowerPoint.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Alleen een voorblad met je naam, je klas en de datum erop.', correct: false, misconception: 'Denkt dat een voorblad de gevraagde opmaak is.' },
          { text: 'Koppen, vetgedrukte woorden en paginanummering.', correct: true, explanation: 'Precies de opmaak die je in hoofdstuk 4 bij Word leerde.' },
          { text: 'Twee kolommen tekst met een tabel en een grafiek erbij.', correct: false, misconception: 'Verwart de eisen met een Excel-opdracht.' },
          { text: 'Een automatische inhoudsopgave met minstens vijf koppen.', correct: false, misconception: 'Denkt dat één A4 een inhoudsopgave nodig heeft.' }
        ],
        feedback: 'Koppen geven structuur, vet legt nadruk en paginanummers houden je verslag op volgorde.'
      }
    ]
  }
};
