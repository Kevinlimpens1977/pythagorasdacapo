// Verrijkingslaag hoofdstuk 5 - Jouw digitale wereld: normen, waarden en
// online kopen. Kaderberoepsgerichte leerweg (kb).
//
// Zie scripts/seed-verrijking/PATROON.md voor het formaat van een vraag, de
// regels over afleiders en de eisen aan feedback.
//
// Opzet per paragraaf, volgens de blauwdruk en het kb-profiel:
//   - elk leerdoel heeft zijn eigen startvraag; die staan als `checks` in
//     scripts/seed-structuur/kb/h5.mjs, met antwoord, uitleg en het leerdoel
//     erbij. 5.1 opent daarnaast met twee voorkennisvragen over hoofdstuk 4,
//     want de leerling werkt hier opnieuw in PowerPoint en zoekt opnieuw beeld
//     met een Creative Commons-licentie;
//   - elk theorieblok heeft een uitgewerkt voorbeeld (vraag + volledige
//     uitwerking) dat VOOR het oefenblok en het zelfstandig oefenen komt;
//   - elke afsluitquiz vanaf 5.2 heeft minstens een terugkeervraag naar een
//     leerdoel van een eerdere paragraaf van dit hoofdstuk. 5.2 kijkt terug
//     naar 5.1, 5.3 naar 5.1 en 5.2, en 5.4 naar 5.3;
//   - de hoofdstuktoets 5.5 bevraagt elk van de veertien verplichte leerdoelen
//     van 5.1 tot en met 5.5 minstens een keer, in zeventien vragen;
//   - kb-vorm: veel goed/fout-vragen naast meerkeuze en per blok hoogstens een
//     of twee open vragen. De afleiders zijn ongeveer even lang als het goede
//     antwoord, zodat blind de langste knop klikken niets oplevert; de reden
//     staat in `explanation`, niet in de antwoordtekst.
//
// De kb-vragen zijn opnieuw geschreven en niet overgenomen uit tl/h5.mjs: kort
// geformuleerd, een idee per zin en met situaties uit de leefwereld van een
// brugklasser.

export default {
  '5.1': {
    learningGoals: [
      'Je kunt uitleggen wat jouw digitale wereld is.',
      'Je weet wat normen en waarden zijn en hoe ze online gelden.',
      'Je kunt drie gedragsregels noemen die online belangrijk zijn.'
    ],
    theorie: [
      {
        keyTerms: ['digitale wereld', 'scherm', 'social media'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Milan zegt: mijn digitale wereld is Fortnite, want daar zit ik het langst in. Klopt dat?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: kijk naar de omschrijving. Je digitale wereld is alles wat je via een scherm doet en wat met internet te maken heeft. Stap 2: tel op wat Milan verder nog doet. Hij kijkt YouTube, hij appt in de teamgroep en hij zoekt huiswerk op. Stap 3: tel ook zijn apparaten mee: zijn console, zijn telefoon en zijn laptop. Conclusie: Fortnite is de grootste plek in zijn digitale wereld, maar niet de hele wereld.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['waarde', 'norm', 'gedragsregels'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Iris schrijft op: "ik stuur geen screenshots van gesprekken door". Is dat een waarde of een norm? En wat hoort er dan bij?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: kun je dit zien aan haar gedrag? Ja, je ziet of ze doorstuurt of niet. Dan is het een norm. Stap 2: zoek de waarde die eronder ligt. Waarom stuurt ze niet door? Omdat ze vindt dat een gesprek van twee mensen is. Stap 3: geef die waarde een naam: respect, of privacy. Klaar: de waarde is respect, de norm is niet doorsturen. De waarde staat altijd eerst, de norm volgt daaruit.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Jouw digitale wereld is alles wat je via een scherm doet en wat met internet te maken heeft. Waarden zijn dingen die jij belangrijk vindt, zoals respect of veiligheid. Normen zijn de regels die daaruit volgen, zoals niet schelden of geen privégegevens delen. Online gelden dezelfde normen en waarden als offline.</p>',
      keyTerms: ['normen', 'waarden']
    },
    vragen: [
      {
        prompt: 'Welke omschrijving past bij het begrip digitale wereld?',
        leerdoel: 'Je kunt uitleggen wat jouw digitale wereld is.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Alle apps die op jouw telefoon geïnstalleerd staan.', correct: false, misconception: 'Denkt dat de digitale wereld alleen op de telefoon bestaat.' },
          { text: 'De social media waarop jij een eigen account hebt.', correct: false, misconception: 'Rekent alleen social media mee en vergeet gamen en opzoeken.' },
          { text: 'Alles wat jij via een scherm en via internet doet.', correct: true, explanation: 'Scherm plus internet: dat is precies de omschrijving uit de les.' },
          { text: 'Alle websites die jij dit schooljaar bezocht hebt.', correct: false, misconception: 'Denkt dat het om een lijstje bezoeken gaat in plaats van om gedrag.' }
        ],
        feedback: 'Twee dingen tellen mee: een scherm en internet. Gamen, kijken, appen en opzoeken horen er dus allemaal bij.'
      },
      {
        prompt: 'Gamen op een console hoort niet bij je digitale wereld, want dat is geen social media.',
        waar: false,
        leerdoel: 'Je kunt uitleggen wat jouw digitale wereld is.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Gamen met anderen staat gewoon in het rijtje van zes voorbeelden uit de les. Social media zijn maar een deel.'
      },
      {
        prompt: 'Sem vindt eerlijkheid belangrijk en spiekt daarom niet bij een toets. Wat is hier de norm?',
        leerdoel: 'Je weet wat normen en waarden zijn en hoe ze online gelden.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Eerlijkheid, want dat is wat Sem vanbinnen belangrijk vindt.', correct: false, misconception: 'Verwart de waarde met de norm die eruit volgt.' },
          { text: 'Niet spieken, want dat kun je aan zijn gedrag zien.', correct: true, explanation: 'Een norm is gedrag, en gedrag kun je van buitenaf zien.' },
          { text: 'De toets zelf, want daar wordt de regel pas zichtbaar.', correct: false, misconception: 'Denkt dat de situatie de norm is in plaats van de regel.' }
        ],
        feedback: 'Een waarde zit vanbinnen en zie je niet. Een norm zie je aan wat iemand wel of niet doet.'
      },
      {
        prompt: 'Normen en waarden gelden online net zo goed als in het echte leven.',
        waar: true,
        leerdoel: 'Je weet wat normen en waarden zijn en hoe ze online gelden.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Dat je de ander niet ziet zitten, verandert de regel niet. Online geldt precies hetzelfde.'
      },
      {
        prompt: 'Nova wil een filmpje van een klasgenoot op TikTok zetten. Welke gedragsregel geldt hier?',
        leerdoel: 'Je kunt drie gedragsregels noemen die online belangrijk zijn.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je deelt geen muziek of kunst die niet van jou is.', correct: false, misconception: 'Kiest de regel over andermans werk in plaats van over personen.' },
          { text: 'Je vraagt toestemming voor je iemand op beeld zet.', correct: true, explanation: 'De ander bepaalt zelf wie hem of haar te zien krijgt.' },
          { text: 'Je scheldt of pest niemand, ook niet als het een grapje is.', correct: false, misconception: 'Denkt dat de regel pas geldt als het gemeen bedoeld is.' },
          { text: 'Je denkt na voordat je iets over jezelf plaatst.', correct: false, misconception: 'Betrekt de regel op zichzelf en niet op de klasgenoot.' }
        ],
        feedback: 'Grappig bedoeld is nog geen toestemming. Vraag het altijd eerst aan wie herkenbaar in beeld is.'
      },
      {
        prompt: 'Noem drie gedragsregels die online belangrijk zijn. Zet bij één regel waarom jij die belangrijk vindt.',
        type: 'open',
        leerdoel: 'Je kunt drie gedragsregels noemen die online belangrijk zijn.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Regel 1: je scheldt of pest niemand. Regel 2: je vraagt toestemming voordat je iemand op een foto zet. Regel 3: je denkt na voordat je iets plaatst. Die derde vind ik het belangrijkst. Een bericht online blijft staan en wordt doorgestuurd. Een opmerking in de klas is na een uur vergeten.',
        nakijkpunten: [
          'Er staan drie verschillende gedragsregels uit de theorie, elk in een eigen zin.',
          'Bij één regel staat een reden waarom de leerling die belangrijk vindt.',
          'De regels zijn concreet opgeschreven als gedrag, niet als losse woorden.'
        ],
        feedback: 'De les noemt er vier. Twee gaan over de ander, twee over wat jij zelf de wereld in stuurt.'
      }
    ]
  },

  '5.2': {
    learningGoals: [
      'Je weet welke persoonlijke gegevens je beter privé houdt.',
      'Je kunt je account op privé zetten en je bio veilig invullen.',
      'Je weet hoe en waarom je een bericht rapporteert.'
    ],
    theorie: [
      {
        keyTerms: ['privacy', 'privé', 'bio'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> In de bio van Jayden staat: "Jayden Peters, DaCapo Sittard, 06-12345678". Wat moet daaruit weg, en waarom?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: streep zijn achternaam weg. Samen met zijn voornaam is dat zijn volledige naam. Stap 2: streep zijn school weg. Met zijn rooster erbij weet een vreemde waar hij elke dag is. Stap 3: streep zijn nummer weg. Dat is een directe lijn naar hem die hij niet meer dichtdraait. Wat blijft er over? Alleen Jayden. Daar mag hij nog iets bij zetten wat hij leuk vindt, bijvoorbeeld voetbal.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['rapporteren', 'Rapporteer-knop', 'melding'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Lieke ziet in een groepsapp een gemene foto van een klasgenoot. Wat doet zij, in welke volgorde?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: ze stuurt de foto niet door, want doorsturen maakt het erger. Stap 2: ze maakt een schermafbeelding als bewijsje, want een weggehaald bericht is weg. Stap 3: ze tikt op de drie puntjes bij het bericht. Stap 4: ze kiest de knop om te melden en geeft als reden pesten op. Stap 5: ze vertelt het aan haar mentor en aan de klasgenoot zelf. De app ziet daarna of het bericht tegen de regels is.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Er zijn vijf persoonlijke gegevens die je online beter voor jezelf houdt: je volledige naam en adres, je nummer, je school, je locatie en gênante beelden. Zet je account op privé en houd uit je bio alles weg wat verraadt waar je bent. Zie je iets wat niet oké is, dan rapporteer je dat bij de app zelf.</p>',
      keyTerms: ['persoonlijke gegevens', 'bio']
    },
    vragen: [
      {
        prompt: 'Welk gegeven hoort volgens de les bij het rijtje dat je online beter privé houdt?',
        leerdoel: 'Je weet welke persoonlijke gegevens je beter privé houdt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'De naam van je lievelingsserie op Netflix.', correct: false, misconception: 'Denkt dat elke persoonlijke voorkeur gevaarlijk is om te delen.' },
          { text: 'De sport die je in je vrije tijd doet.', correct: false, misconception: 'Verwart een hobby met een gegeven dat je kan vinden.' },
          { text: 'De school waar je elke dag naartoe gaat.', correct: true, explanation: 'Met je school en je rooster ligt vast waar je elke dag bent.' },
          { text: 'De kleur van de telefoonhoes die je gebruikt.', correct: false, misconception: 'Denkt dat alles over je spullen ook privé moet blijven.' }
        ],
        feedback: 'Het gaat om gegevens waarmee iemand jou kan vinden. Wat je leuk vindt, mag je gewoon delen.'
      },
      {
        prompt: 'Je locatie delen is ongevaarlijk, want die verandert steeds als jij ergens anders bent.',
        waar: false,
        leerdoel: 'Je weet welke persoonlijke gegevens je beter privé houdt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Juist doordat je locatie meeloopt, ziet iemand precies waar jij op welk moment bent.'
      },
      {
        prompt: 'Waar vind je in bijna elke app de knop om je account op privé te zetten?',
        leerdoel: 'Je kunt je account op privé zetten en je bio veilig invullen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'In de instellingen, onder het kopje privacy.', correct: true, explanation: 'Elke app noemt het net anders, maar het staat altijd onder privacy.' },
          { text: 'In je profiel, onder de knop om je foto te wijzigen.', correct: false, misconception: 'Denkt dat het bij het uiterlijk van je profiel hoort.' },
          { text: 'In het menu van je telefoon, bij de app-machtigingen.', correct: false, misconception: 'Verwart de instellingen van de telefoon met die van de app.' },
          { text: 'Bij je berichten, onder de drie puntjes rechtsboven.', correct: false, misconception: 'Denkt dat je het per bericht instelt in plaats van per account.' }
        ],
        feedback: 'Zoek altijd eerst het kopje privacy in de instellingen van de app zelf, niet in je telefoon.'
      },
      {
        prompt: 'In je bio mag je voornaam en je hobby staan, maar je woonplaats en je schoolnaam niet.',
        waar: true,
        leerdoel: 'Je kunt je account op privé zetten en je bio veilig invullen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Alles wat vertelt waar jij te vinden bent, hoort er niet in. Wat je leuk vindt, kan geen kwaad.'
      },
      {
        prompt: 'Wat gebeurt er nadat jij een bericht bij de app gemeld hebt?',
        leerdoel: 'Je weet hoe en waarom je een bericht rapporteert.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De politie krijgt jouw melding binnen en neemt contact op.', correct: false, misconception: 'Denkt dat melden bij een app hetzelfde is als aangifte doen.' },
          { text: 'Medewerkers kijken of het bericht tegen de regels is.', correct: true, explanation: 'De app beoordeelt de melding en haalt het bericht zo nodig weg.' },
          { text: 'De maker krijgt te horen wie hem gemeld heeft.', correct: false, misconception: 'Durft niet te melden omdat hij denkt dat het zichtbaar is.' }
        ],
        feedback: 'Melden is anoniem en gaat naar de app zelf. Die beslist daarna of het bericht weg moet.'
      },
      {
        prompt: 'Waarom maak je eerst een schermafbeelding voordat je iets meldt? Leg je antwoord uit in twee zinnen.',
        type: 'open',
        leerdoel: 'Je weet hoe en waarom je een bericht rapporteert.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Als de app het bericht weghaalt, is het echt weg. Dan kan ik later aan mijn mentor of aan mijn ouders niet meer laten zien wat er stond. Met een schermafbeelding heb ik nog wel een bewijsje van wat er gebeurd is.',
        nakijkpunten: [
          'Noemt dat een gemeld bericht kan verdwijnen.',
          'Noemt dat je het daarna aan niemand meer kunt laten zien.',
          'Gebruikt het woord bewijs of bewijsje, of omschrijft dat in eigen woorden.'
        ],
        feedback: 'Een melding die slaagt, wist het bericht. Zonder afbeelding vooraf heb je daarna niets meer in handen.'
      },
      {
        prompt: 'Terugblik 5.1. Uit welke waarde volgt de regel dat je geen privégegevens deelt?',
        leerdoel: 'Je weet wat normen en waarden zijn en hoe ze online gelden.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Uit de waarde vrijheid, want je bepaalt zelf wat je doet.', correct: false, misconception: 'Kiest de waarde die het meest over jezelf gaat.' },
          { text: 'Uit de waarde respect, want je let daarmee op de ander.', correct: false, misconception: 'Verwart de regel over jezelf met de regel over anderen.' },
          { text: 'Uit de waarde veiligheid, zo staat het in de les.', correct: true, explanation: 'De les koppelt veiligheid aan de norm dat je niets privés deelt.' }
        ],
        feedback: 'De les geeft twee paren: respect hoort bij niet uitschelden, veiligheid bij geen privégegevens delen.'
      }
    ]
  },

  '5.3': {
    learningGoals: [
      'Je kunt vijf checks doen om te zien of een webshop betrouwbaar is.',
      'Je weet waar je op moet letten in de URL en bij het slotje.',
      'Je kunt uitleggen waarom een te lage prijs een waarschuwing is.'
    ],
    theorie: [
      {
        keyTerms: ['online shoppen', 'vervoersbedrijven', 'versleuteld'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Tim betaalt 60 euro met iDEAL bij een winkel die hij niet kent. Er komt nooit een pakket. Kan hij zijn geld terugkrijgen?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: kijk waar het geld heen ging. Bij iDEAL gaat het meteen van zijn rekening naar de verkoper. Stap 2: kijk wie het nog kan tegenhouden. Niemand, want de betaling is al klaar. Stap 3: bel de bank. Die kan hem hier niet helpen, want hij heeft de opdracht zelf gegeven. Conclusie: dat geld is hij kwijt. Daarom controleer je de winkel vóórdat je betaalt, en niet erna.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['slotje', 'URL', 'reviews'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Een site heet www.nike_sport.com, ziet er precies uit als Nike en heeft een slotje. Er is geen klantenservice. Betrouwbaar?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: lees het adres tot de eerste schuine streep. Daar staat nike_sport, en dat is niet nike. Stap 2: weeg het slotje. Dat betekent alleen dat je gegevens versleuteld zijn, en het is gratis aan te vragen. Stap 3: check de contactgegevens. Bij de echte site staat een klantenservice, hier niet. Twee checks vallen negatief uit en het slotje bewijst niets. Conclusie: niet betrouwbaar, want grote merken verkopen alleen via hun eigen adres.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Voordat je bestelt doe je de vijf checks: prijzen vergelijken, het slotje bekijken, naam en adres controleren, de website goed bekijken en reviews lezen. Het slotje zegt alleen dat je gegevens onderweg beschermd zijn; het maakt een winkel niet betrouwbaar. Een prijs die veel te laag is, is bedoeld om je snel te laten klikken.</p>',
      keyTerms: ['vijf checks', 'betrouwbaar']
    },
    vragen: [
      {
        prompt: 'Welke check hoort volgens de les bij de vijf checks van een webshop?',
        leerdoel: 'Je kunt vijf checks doen om te zien of een webshop betrouwbaar is.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Kijken hoeveel volgers de winkel op Instagram heeft.', correct: false, misconception: 'Denkt dat een groot account bewijst dat een winkel echt bestaat.' },
          { text: 'Kijken of de winkel een app in de appstore heeft.', correct: false, misconception: 'Denkt dat een app strenger gecontroleerd is dan een website.' },
          { text: 'Zoeken op Google naar reviews van andere kopers.', correct: true, explanation: 'Buiten de site zoeken is de enige check die de winkel niet zelf regelt.' },
          { text: 'Kijken of er een chatbot rechtsonder in beeld staat.', correct: false, misconception: 'Ziet een chatvenster aan voor echte klantenservice.' }
        ],
        feedback: 'De vijf checks zijn: prijzen, het slotje, naam en adres, de website zelf, en reviews van kopers.'
      },
      {
        prompt: 'Als één van de vijf checks goed uitvalt, mag je de andere vier overslaan.',
        waar: false,
        leerdoel: 'Je kunt vijf checks doen om te zien of een webshop betrouwbaar is.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Je telt de vijf uitkomsten bij elkaar op. Eén goede check weegt niet op tegen twee slechte.'
      },
      {
        prompt: 'Wat bewijst een slotje voor het webadres precies?',
        leerdoel: 'Je weet waar je op moet letten in de URL en bij het slotje.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Dat de winkel gecontroleerd is door de Nederlandse overheid.', correct: false, misconception: 'Denkt dat een instantie de winkel goedkeurt voor het slotje.' },
          { text: 'Dat jouw gegevens onderweg beschermd verstuurd worden.', correct: true, explanation: 'Versleuteling maakt je gegevens onderweg onleesbaar voor anderen.' },
          { text: 'Dat je je geld terugkrijgt als het pakket nooit aankomt.', correct: false, misconception: 'Denkt dat er een verzekering aan het slotje vastzit.' },
          { text: 'Dat de prijzen op deze website eerlijk berekend zijn.', correct: false, misconception: 'Koppelt het slotje aan de betrouwbaarheid van de prijs.' }
        ],
        feedback: 'Het slotje gaat alleen over de verbinding. Een oplichter regelt zo\'n slotje in vijf minuten gratis.'
      },
      {
        prompt: 'Welke winkelnaam staat er echt in het adres www.adidas-outlet-sale.com?',
        leerdoel: 'Je weet waar je op moet letten in de URL en bij het slotje.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'Adidas, want die merknaam staat vooraan in het webadres.', correct: false, misconception: 'Leest alleen het eerste woord en let niet op de toevoegingen.' },
          { text: 'Adidas-outlet-sale, en dat is niet het merk Adidas.', correct: true, explanation: 'Alles tot de eerste schuine streep hoort bij één naam.' },
          { text: 'Sale, want dat is het laatste stuk voor de punt com.', correct: false, misconception: 'Denkt dat het laatste woord de eigenaar aanwijst.' }
        ],
        feedback: 'Lees tot de eerste schuine streep. Toevoegingen als -outlet of -sale horen bij de naam, niet bij het merk.'
      },
      {
        prompt: 'Een spelcomputer van 500 euro staat bij een onbekende shop voor 79 euro. Dat is een reden om niet te bestellen.',
        waar: true,
        leerdoel: 'Je kunt uitleggen waarom een te lage prijs een waarschuwing is.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Een winkel koopt zo\'n spelcomputer zelf ook in. Voor 79 euro houdt hij niets over, dus klopt er iets niet.'
      },
      {
        prompt: 'Leg uit waarom een oplichter juist een heel lage prijs gebruikt. Schrijf twee zinnen.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen waarom een te lage prijs een waarschuwing is.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Een lage prijs zorgt ervoor dat je haast krijgt, want je bent bang dat het aanbod weg is. Door die haast doe je de andere checks niet meer en klik je meteen op bestellen. Precies dat wil de oplichter, want daarna is je geld weg.',
        nakijkpunten: [
          'Noemt dat een lage prijs zorgt voor haast of voor de angst iets te missen.',
          'Legt uit dat je door die haast de andere checks overslaat.',
          'Koppelt dat aan het doel van de oplichter: snel betaald krijgen.'
        ],
        feedback: 'De prijs is het lokaas. Wie eerst rustig de vijf checks doet, trapt er meestal niet in.'
      },
      {
        prompt: 'Terugblik 5.2. Hoe meld je een bericht dat niet door de beugel kan?',
        leerdoel: 'Je weet hoe en waarom je een bericht rapporteert.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Via de drie puntjes bij het bericht en dan de meldknop.', correct: true, explanation: 'Bijna elke app zet de meldknop achter de drie puntjes.' },
          { text: 'Door de maker een bericht te sturen dat het weg moet.', correct: false, misconception: 'Denkt dat je het altijd eerst zelf met de ander oplost.' },
          { text: 'Door je account te verwijderen zodat je het niet meer ziet.', correct: false, misconception: 'Lost het eigen ongemak op maar niet het probleem.' }
        ],
        feedback: 'Drie puntjes, meldknop, reden kiezen, versturen. Maak eerst even een schermafbeelding.'
      },
      {
        prompt: 'Terugblik 5.1. Welke gedragsregel gaat over spullen van iemand anders?',
        leerdoel: 'Je kunt drie gedragsregels noemen die online belangrijk zijn.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Je denkt na voordat je iets op internet plaatst of deelt.', correct: false, misconception: 'Kiest de bekendste regel in plaats van de regel die gevraagd wordt.' },
          { text: 'Je scheldt of pest niemand, online net zomin als offline.', correct: false, misconception: 'Denkt dat elke regel over de ander hetzelfde is.' },
          { text: 'Je deelt geen foto\'s, kunst of muziek van anderen.', correct: true, explanation: 'Deze regel gaat precies over werk dat niet van jou is.' }
        ],
        feedback: 'Deze regel gaat over werk van een ander, bijvoorbeeld een foto met een Creative Commons-licentie.'
      }
    ]
  },

  '5.4': {
    learningGoals: [
      'Je weet wat iDEAL, Klarna, een creditcard en Apple Pay of Google Pay zijn.',
      "Je kunt de risico's van achteraf betalen uitleggen.",
      'Je weet dat je bij kopen buiten de EU invoerrechten en btw kunt moeten betalen.'
    ],
    theorie: [
      {
        keyTerms: ['Klarna', 'incassobureau', 'krediet'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Bo is 19 en koopt een trui van 40 euro met Klarna. Ze vergeet de betaaldatum. Wat gebeurt er, stap voor stap?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: ze krijgt een herinnering, want Klarna wil eerst gewoon zijn geld. Stap 2: betaalt ze nog niet, dan komt er een boete boven op de 40 euro. Stap 3: blijft het staan, dan komt er een incassobureau bij. Dat bedrijf probeert het geld alsnog te krijgen en rekent daar kosten voor. Stap 4: gebeurt dit vaker, dan gaat haar naam naar andere instanties, bijvoorbeeld banken. Zo wordt een trui van 40 euro er zomaar een van 100. En let op: Bo mag dit pas omdat ze 19 is. Onder de 18 kun je niet achteraf betalen.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['invoerrechten', 'btw', 'douane'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je bestelt een telefoonhoesje uit China voor 10 euro. Waarom staat er in de les dat je 17 euro betaalt?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: de prijs van het hoesje is 10 euro, en die betaal je aan de webshop. Stap 2: het pakket komt van buiten de EU, dus de douane kijkt ernaar. Stap 3: de douane rekent in dit voorbeeld 4 euro invoerrechten en 3 euro btw. Stap 4: 10 plus 4 plus 3 is 17 euro in totaal. Let op: die bedragen veranderen regelmatig, dus kijk het na op douane.nl bij Extra kosten bij online bestellingen. Onthoud vooral wanneer je moet bijbetalen, en niet het bedrag.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Met iDEAL gaat je geld meteen naar de verkoper en kun je het zelf niet terughalen. Bij achteraf betalen krijg je eerst je pakket, maar te laat betalen kost je een boete en extra kosten. Achteraf betalen en een creditcard zijn allebei lenen en mogen pas vanaf 18 jaar. Met Apple Pay of Google Pay betaal je met je telefoon. Koop je buiten de EU, dan kan de douane extra kosten rekenen als je pakket hier aankomt.</p>',
      keyTerms: ['achteraf betalen', 'iDEAL']
    },
    vragen: [
      {
        prompt: 'Wat is het verschil tussen betalen met iDEAL en betalen met Klarna?',
        leerdoel: 'Je weet wat iDEAL, Klarna, een creditcard en Apple Pay of Google Pay zijn.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Bij iDEAL gaat het geld meteen weg, bij Klarna pas later.', correct: true, explanation: 'iDEAL is een directe betaling, Klarna is achteraf betalen.' },
          { text: 'Bij iDEAL betaal je kosten, bij Klarna is het altijd gratis.', correct: false, misconception: 'Denkt dat achteraf betalen nooit iets extra kost.' },
          { text: 'Bij iDEAL koop je in Nederland, bij Klarna in het buitenland.', correct: false, misconception: 'Koppelt de betaalmethode aan het land van de winkel.' },
          { text: 'Bij iDEAL heb je een pas nodig, bij Klarna alleen een app.', correct: false, misconception: 'Denkt dat het verschil in het apparaat zit dat je gebruikt.' }
        ],
        feedback: 'Het verschil zit in het moment. Direct betalen tegenover later betalen: dat bepaalt ook je risico.'
      },
      {
        prompt: 'Een creditcard kun je pas aanvragen als je een maandelijks inkomen hebt.',
        waar: true,
        leerdoel: 'Je weet wat iDEAL, Klarna, een creditcard en Apple Pay of Google Pay zijn.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'De bank leent je geld en wil weten dat je het terug kunt betalen. Daarom geldt ook de grens van 18 jaar.'
      },
      {
        prompt: 'Waarvoor gebruik je de app Apple Pay of Google Pay?',
        leerdoel: 'Je weet wat iDEAL, Klarna, een creditcard en Apple Pay of Google Pay zijn.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Om je bankpassen aan je telefoon of smartwatch te koppelen.', correct: true, explanation: 'Je pas komt in de app en je betaalt met een code of vingerafdruk.' },
          { text: 'Om je uitgaven per week in een overzicht bij te houden.', correct: false, misconception: 'Verwart een betaalapp met een app die je budget bijhoudt.' },
          { text: 'Om geld te lenen als je rekening even leeg is.', correct: false, misconception: 'Denkt dat elke betaalapp ook krediet aanbiedt.' }
        ],
        feedback: 'Weet iemand anders jouw toegangscode, dan kan die dus ook jouw pas gebruiken. Kies er een van zes cijfers.'
      },
      {
        prompt: 'Wat kan er gebeuren als je een aankoop met achteraf betalen te laat betaalt?',
        leerdoel: "Je kunt de risico's van achteraf betalen uitleggen.",
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je bestelling wordt teruggehaald door het vervoersbedrijf.', correct: false, misconception: 'Denkt dat de winkel het product gewoon weer ophaalt.' },
          { text: 'Je account bij de webshop wordt voorgoed geblokkeerd.', correct: false, misconception: 'Denkt dat de winkel je straft in plaats van de kredietverstrekker.' },
          { text: 'Je moet het bedrag daarna in één keer contant betalen.', correct: false, misconception: 'Denkt dat te laat betalen leidt tot contant afrekenen.' },
          { text: 'Je krijgt een boete en er kan een incassobureau bij komen.', correct: true, explanation: 'De kosten van dat bureau komen boven op je eigen rekening.' }
        ],
        feedback: 'Er is nog een derde gevolg: je naam gaat door naar banken en andere instanties.'
      },
      {
        prompt: "Noem twee risico's van achteraf betalen en leg bij één ervan uit waarom het jou later geld kost.",
        type: 'open',
        leerdoel: "Je kunt de risico's van achteraf betalen uitleggen.",
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Risico 1: je krijgt een boete als je de betaaldatum vergeet. Risico 2: er kan een incassobureau bij komen. Dat tweede kost mij extra geld, want dat bureau rekent zijn eigen kosten boven op mijn rekening. Zo betaal ik veel meer dan het product kostte.',
        nakijkpunten: [
          "Noemt twee verschillende risico's van achteraf betalen.",
          'Legt bij één risico uit hoe het bedrag oploopt.',
          'Gebruikt het woord boete, incassobureau of extra kosten.'
        ],
        feedback: 'Vergeten is hier het echte risico, niet de betaalmethode zelf. Zet de datum meteen in je agenda.'
      },
      {
        prompt: 'Op welk moment krijg je de rekening van de douane voor een pakket uit China?',
        leerdoel: 'Je weet dat je bij kopen buiten de EU invoerrechten en btw kunt moeten betalen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Meteen bij het afrekenen, want de webshop rekent het erbij.', correct: false, misconception: 'Denkt dat de winkel alle kosten al in de prijs verwerkt.' },
          { text: 'Pas als het pakket in Nederland is aangekomen.', correct: true, explanation: 'De douane kijkt naar de zending als die het land binnenkomt.' },
          { text: 'Een maand later, samen met de rekening van je bank.', correct: false, misconception: 'Denkt dat de bank de douanekosten int en doorbelast.' }
        ],
        feedback: 'Kun je die rekening niet betalen, dan wordt je pakket vernietigd. Je bent dan je geld én je product kwijt.'
      },
      {
        prompt: 'Invoerrechten en btw betaal je alleen bij pakketten die van buiten de EU komen.',
        waar: true,
        leerdoel: 'Je weet dat je bij kopen buiten de EU invoerrechten en btw kunt moeten betalen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Binnen de EU zit de btw al in de prijs. Van buiten de EU komt de rekening van de douane er nog bij.'
      },
      {
        prompt: 'Terugblik 5.3. Waarom lees je een webadres tot aan de eerste schuine streep?',
        leerdoel: 'Je weet waar je op moet letten in de URL en bij het slotje.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Omdat daarna alleen nog de naam van het product staat.', correct: false, misconception: 'Denkt dat het deel na de streep de winkel aanwijst.' },
          { text: 'Omdat het slotje altijd vlak voor die schuine streep staat.', correct: false, misconception: 'Verwart de plaats van het slotje met de winkelnaam.' },
          { text: 'Omdat daar de echte naam van de winkel te vinden is.', correct: true, explanation: 'Alles tot die streep hoort bij één naam, inclusief toevoegingen.' }
        ],
        feedback: 'Een merknaam vooraan zegt niets. Toevoegingen als -sale of een lage streep horen bij de nepnaam.'
      }
    ]
  },

  '5.5': {
    learningGoals: [
      'Je kunt een webshop en een betaalmethode beoordelen voordat je bestelt.',
      'Je kunt uitleggen welke gedragsregels jij online belangrijk vindt.'
    ],
    theorie: [
      {
        keyTerms: ['gereedschap', 'betaalmethode'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je wilt een koptelefoon van 28 euro. De shop kent niemand, maar alle vijf de checks vallen goed uit. Welke betaalmethode kies je?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: de winkel is gecontroleerd, dus bestellen kán. Stap 2: streep achteraf betalen en de creditcard weg. Dat is allebei lenen en mag pas vanaf 18 jaar. Stap 3: dan blijft iDEAL over. Je geld is daarmee meteen weg en niemand haalt het terug. Stap 4: je kent deze winkel niet, dus bestel je samen met een volwassene die meekijkt. Stap 5: vraag jezelf af of je die 28 euro kunt missen als het toch misgaat. Is het antwoord nee, dan bestel je hier niet.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['toezichthouder', 'oplichter'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sara betaalde 45 euro bij een shop die nep blijkt. Ze schaamt zich en wil het stilhouden. Wat doet ze vandaag nog?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: ze bewaart haar bevestigingsmail, de betaling in haar bankapp en een schermafbeelding van de site. Stap 2: ze belt haar bank, want soms valt er nog iets te redden. Stap 3: ze vertelt het thuis, ook al vindt ze dat moeilijk. Stap 4: ze doet aangifte bij de politie, want meldingen bij elkaar wegen zwaarder. Stap 5: ze meldt de winkel bij ACM ConsuWijzer. Schaamte kost hier tijd, en tijd is precies wat telt.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>In dit hoofdstuk leerde je bewust omgaan met wat je online deelt en met wat je online koopt. Je kunt nu een webshop beoordelen met vijf checks en daarna een betaalmethode kiezen waarvan je het risico kent. En je kunt uitleggen welke regels jij online volgt, en welke waarde er onder elke regel ligt.</p>',
      keyTerms: ['bewust', 'beoordelen']
    },
    vragen: [
      {
        prompt: 'Je vindt een onbekende webshop waar alle vijf de checks goed uitvallen. Wat is dan de slimste betaalkeuze?',
        leerdoel: 'Je kunt een webshop en een betaalmethode beoordelen voordat je bestelt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Achteraf betalen, want je krijgt eerst je pakket binnen.', correct: false, misconception: 'Vergeet dat achteraf betalen lenen is en pas vanaf 18 jaar mag.' },
          { text: 'Contant, want dan houd je je bankgegevens buiten beeld.', correct: false, misconception: 'Denkt dat contant betalen bij een webshop mogelijk is.' },
          { text: 'iDEAL, en een volwassene kijkt met je mee.', correct: true, explanation: 'iDEAL is de enige methode die jij al mag gebruiken.' }
        ],
        feedback: 'Klarna en de creditcard mogen pas vanaf 18 jaar. Bij een winkel die je niet kent, laat je iemand meekijken.'
      },
      {
        prompt: 'Valt één van de vijf checks negatief uit, dan kies je gewoon een veiligere betaalmethode.',
        waar: false,
        leerdoel: 'Je kunt een webshop en een betaalmethode beoordelen voordat je bestelt.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        feedback: 'Dan bestel je daar helemaal niet. Geen enkele betaalmethode repareert een winkel die niet klopt.'
      },
      {
        prompt: 'Waarom is het handig om bij elke online regel die je volgt ook de waarde eronder te kennen?',
        leerdoel: 'Je kunt uitleggen welke gedragsregels jij online belangrijk vindt.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'reflecteren',
        options: [
          { text: 'Omdat je dan zelf een regel kunt maken voor iets nieuws.', correct: true, explanation: 'Uit een waarde leid je zelf een regel af voor een nieuwe situatie.' },
          { text: 'Omdat een regel met een waarde erbij strenger wordt gehandhaafd.', correct: false, misconception: 'Denkt dat waarden iets met straf of controle te maken hebben.' },
          { text: 'Omdat je de regel dan makkelijker uit je hoofd kunt leren.', correct: false, misconception: 'Ziet de waarde als een geheugentruc in plaats van als reden.' }
        ],
        feedback: 'Geen enkel lijstje dekt alles. Met de waarde in je hoofd bedenk je zelf de regel die past.'
      },
      {
        prompt: 'Ali post een groepsfoto zonder te vragen en zegt: het was maar een grapje. Welke regel breekt hij?',
        leerdoel: 'Je kunt uitleggen welke gedragsregels jij online belangrijk vindt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De regel dat je niets deelt wat niet van jou is.', correct: false, misconception: 'Past de regel over andermans werk toe op een foto van personen.' },
          { text: 'De regel dat je vooraf toestemming vraagt.', correct: true, explanation: 'Iedereen die herkenbaar in beeld staat, beslist daar zelf over.' },
          { text: 'De regel dat je niemand uitscheldt of pest online.', correct: false, misconception: 'Denkt dat de regel pas geldt als iets gemeen bedoeld is.' }
        ],
        feedback: 'Een grapje is geen toestemming. Vraag het aan iedereen die je op de foto kunt herkennen.'
      },
      {
        prompt: 'Welk rijtje hoort bij het begrip digitale wereld?',
        leerdoel: 'Je kunt uitleggen wat jouw digitale wereld is.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Scrollen, gamen, chatten, posten, opzoeken en kijken.', correct: true, explanation: 'Dat zijn precies de zes voorbeelden uit de les.' },
          { text: 'Alleen de apps waarin je zelf iets plaatst of post.', correct: false, misconception: 'Rekent kijken en opzoeken niet mee omdat je daar niets plaatst.' },
          { text: 'Alleen wat je op je eigen telefoon doet, niet op school.', correct: false, misconception: 'Denkt dat schoolwerk buiten de digitale wereld valt.' }
        ],
        feedback: 'Alles via een scherm met internet telt mee. Ook je laptop op school hoort erbij.'
      },
      {
        prompt: 'Uit de waarde respect volgt de norm dat je mensen niet uitscheldt.',
        waar: true,
        leerdoel: 'Je weet wat normen en waarden zijn en hoe ze online gelden.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Dit is het eerste voorbeeldpaar uit de les. Het tweede paar is veiligheid met geen privégegevens delen.'
      },
      {
        prompt: 'Welke gedragsregel noemt de les als de sterkste van de vier?',
        leerdoel: 'Je kunt drie gedragsregels noemen die online belangrijk zijn.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je vraagt toestemming voor je iemand op beeld zet.', correct: false, misconception: 'Kiest de regel die het vaakst in de les herhaald wordt.' },
          { text: 'Je scheldt of pest niemand, ook niet als grapje.', correct: false, misconception: 'Denkt dat de bekendste regel ook de sterkste is.' },
          { text: 'Je denkt na voordat je iets op internet plaatst.', correct: true, explanation: 'Wat online staat, blijft staan en wordt doorgestuurd.' }
        ],
        feedback: 'Het verschil zit in tijd. Een opmerking in de klas vervliegt, een bericht online duikt jaren later op.'
      },
      {
        prompt: 'Je woonplaats mag je gerust in je bio zetten, want dat is geen adres.',
        waar: false,
        leerdoel: 'Je weet welke persoonlijke gegevens je beter privé houdt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Woonplaats en school samen wijzen al aan waar je elke dag bent. Los lijken ze onschuldig.'
      },
      {
        prompt: 'Wat verandert er als je je account op privé zet?',
        leerdoel: 'Je kunt je account op privé zetten en je bio veilig invullen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Alleen mensen die jij goedkeurt zien je berichten.', correct: true, explanation: 'Jij bepaalt vanaf dat moment wie er meekijkt.' },
          { text: 'Je oude berichten worden automatisch van de app gewist.', correct: false, misconception: 'Denkt dat de instelling met terugwerkende kracht opruimt.' },
          { text: 'Je ziet voortaan wie jouw profiel bekeken heeft.', correct: false, misconception: 'Verwart de privacyknop met een functie voor bezoekers.' }
        ],
        feedback: 'Het gaat alleen over wie meekijkt. Wat er al gedeeld is, blijft gewoon bij anderen staan.'
      },
      {
        prompt: 'Waarom is melden bij de app zinvol, ook als jij het bericht zelf kunt wegklikken?',
        leerdoel: 'Je weet hoe en waarom je een bericht rapporteert.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat je er punten of tokens voor terugkrijgt in de app.', correct: false, misconception: 'Denkt dat melden beloond wordt in plaats van dat het helpt.' },
          { text: 'Omdat de app het weg kan halen voor alle andere kijkers.', correct: true, explanation: 'Wegklikken helpt alleen jou, weghalen helpt iedereen.' },
          { text: 'Omdat de maker dan een waarschuwing van jou krijgt.', correct: false, misconception: 'Denkt dat een melding zichtbaar van jou afkomstig is.' }
        ],
        feedback: 'Wegklikken lost het voor jou op. Melden kan het voor de hele groep oplossen, en dat is anoniem.'
      },
      {
        prompt: 'Welke van deze checks kan een oplichter het minst makkelijk namaken?',
        leerdoel: 'Je kunt vijf checks doen om te zien of een webshop betrouwbaar is.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'Het slotje dat voor het webadres in de balk staat.', correct: false, misconception: 'Denkt dat een slotje moeilijk of duur te krijgen is.' },
          { text: 'De contactgegevens die onderaan de website staan.', correct: false, misconception: 'Denkt dat een adres op de site altijd echt is.' },
          { text: 'Reviews van kopers op andere sites.', correct: true, explanation: 'Wat buiten de site staat, heeft de winkel niet in de hand.' }
        ],
        feedback: 'Alles wat de winkel zelf plaatst, is na te maken. Daarom zoek je ook buiten de site.'
      },
      {
        prompt: 'Een webshop met een slotje voor de URL is daarmee een eerlijke webshop.',
        waar: false,
        leerdoel: 'Je weet waar je op moet letten in de URL en bij het slotje.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Het slotje gaat over de verbinding, niet over de verkoper. Ook een nepwinkel kan er een hebben.'
      },
      {
        prompt: 'Een fiets van 400 euro staat op een nieuwe site voor 55 euro. Waarom is dat een waarschuwing?',
        leerdoel: 'Je kunt uitleggen waarom een te lage prijs een waarschuwing is.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat een winkel bij die prijs niets kan verdienen.', correct: true, explanation: 'Inkoop plus verzending kost al meer dan 55 euro.' },
          { text: 'Omdat een goedkope fiets meestal sneller kapot zal gaan.', correct: false, misconception: 'Denkt aan kwaliteit in plaats van aan het risico op oplichting.' },
          { text: 'Omdat je bij zo\'n prijs zeker invoerrechten moet betalen.', correct: false, misconception: 'Koppelt elke lage prijs automatisch aan de douane.' }
        ],
        feedback: 'Reken even mee: inkoop en verzending kosten al meer. Zo\'n prijs is er om je te laten haasten.'
      },
      {
        prompt: 'Welke omschrijving hoort bij iDEAL?',
        leerdoel: 'Je weet wat iDEAL, Klarna, een creditcard en Apple Pay of Google Pay zijn.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een Zweedse bank waarmee je je aankoop later betaalt.', correct: false, misconception: 'Wisselt iDEAL om met Klarna.' },
          { text: 'Een pas met krediet, die je alleen met inkomen krijgt.', correct: false, misconception: 'Wisselt iDEAL om met de creditcard.' },
          { text: 'Een app waarmee je je pas aan je telefoon koppelt.', correct: false, misconception: 'Wisselt iDEAL om met Apple Pay of Google Pay.' },
          { text: 'Direct betalen via je bank, het bedrag gaat meteen weg.', correct: true, explanation: 'Je regelt het in de app van je bank en het geld vertrekt direct.' }
        ],
        feedback: 'Deze vier omschrijvingen zijn precies de koppeloefening uit 5.4. Leer ze als paren.'
      },
      {
        prompt: 'Wat doet een incassobureau als jij je rekening niet betaalt?',
        leerdoel: "Je kunt de risico's van achteraf betalen uitleggen.",
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Het scheldt een deel van je schuld kwijt na een gesprek.', correct: false, misconception: 'Denkt dat een incassobureau er is om jou te helpen.' },
          { text: 'Het probeert het geld alsnog te krijgen, met extra kosten.', correct: true, explanation: 'Hun eigen kosten komen boven op het bedrag dat je al schuldig was.' },
          { text: 'Het betaalt de winkel en jij hoeft daarna niets meer.', correct: false, misconception: 'Denkt dat het bureau de rekening voor je overneemt.' }
        ],
        feedback: 'Zo groeit een rekening van twintig euro er zomaar uit naar zestig. Betalen op tijd scheelt echt geld.'
      },
      {
        prompt: 'Wat gebeurt er met je pakket als je de invoerrechten en btw niet betaalt?',
        leerdoel: 'Je weet dat je bij kopen buiten de EU invoerrechten en btw kunt moeten betalen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Het gaat terug naar de verkoper en je krijgt je geld terug.', correct: false, misconception: 'Denkt dat een retour bij de douane automatisch geregeld wordt.' },
          { text: 'Het blijft een jaar liggen tot je alsnog betaald hebt.', correct: false, misconception: 'Denkt dat je onbeperkt de tijd krijgt om te betalen.' },
          { text: 'Het wordt vernietigd en je bent je geld en product kwijt.', correct: true, explanation: 'De douane geeft het pakket niet vrij en houdt het niet bewaard.' }
        ],
        feedback: 'Reken daarom vóór je bestelt op de site van de douane uit wat er nog bij kan komen.'
      },
      {
        prompt: 'Je hebt betaald bij een webshop die nep blijkt te zijn. Schrijf op wat je doet, in vier stappen.',
        type: 'open',
        leerdoel: 'Je kunt een webshop en een betaalmethode beoordelen voordat je bestelt.',
        denkniveau: 'maken_controleren',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Stap 1: ik bewaar mijn bewijsjes, dus de bevestigingsmail, de betaling in mijn bankapp en een schermafbeelding van de site. Stap 2: ik bel of mail mijn bank nog dezelfde dag, want soms valt er nog iets te redden. Stap 3: ik doe aangifte bij de politie, want meerdere meldingen samen wegen zwaarder. Stap 4: ik meld de winkel bij ACM ConsuWijzer. En ik vertel het thuis, ook al schaam ik me ervoor.',
        nakijkpunten: [
          'Noemt het bewaren van bewijsjes als eerste stap.',
          'Noemt de bank en de politie, elk met een reden.',
          'Noemt ACM ConsuWijzer of het inschakelen van een volwassene.'
        ],
        feedback: 'De volgorde telt hier: bewijs bewaren gaat voor, want daarna verdwijnt de site vaak binnen een dag.'
      }
    ]
  }
};
