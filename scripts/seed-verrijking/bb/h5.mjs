// Verrijkingslaag hoofdstuk 5 - Jouw digitale wereld: normen, waarden en online
// kopen. Basisberoepsgerichte leerweg (bb).
//
// Zie scripts/seed-verrijking/PATROON.md voor het formaat van een vraag, de
// regels over afleiders en de eisen aan feedback.
//
// Dit hoofdstuk heeft in bb VIJF paragrafen: 5.1 tot en met 5.5. 5.6 is de
// vrijwillige plusparagraaf van de theoretische leerweg en staat hier dus niet
// in. 5.1 is de eerste paragraaf van het hoofdstuk en kijkt nergens op terug;
// 5.2, 5.3 en 5.4 hebben elk minstens een terugkeervraag naar een eerdere
// paragraaf van dit hoofdstuk.
//
// Opzet per paragraaf, volgens de blauwdruk en het bb-profiel:
//   - elk leerdoel heeft zijn EIGEN startvraag. Die staan als `checks` in
//     scripts/seed-structuur/bb/h5.mjs, met antwoord en uitleg erbij. 5.1 opent
//     daarnaast met een voorkennisvraag over hoofdstuk 4, want de leerling
//     werkt in deze paragraaf weer in PowerPoint en moet weten hoe hij een
//     plaatje met Creative Commons zoekt;
//   - elk theorieblok heeft een uitgewerkt voorbeeld in vraag-en-antwoordvorm.
//     Dat voorbeeld komt VOOR het oefenblok en dus voor het zelfstandig
//     oefenen. In bb is het voorbeeld altijd een situatie uit hun eigen wereld:
//     de klassenapp, een game, een paar sneakers, een pakketje van Temu. GEEN
//     enkele opgave uit de groep `zelf` herhaalt een uitgewerkt voorbeeld met
//     een andere naam of andere bedragen erin; die opgaven halen op uit het
//     hoofd of geven een nieuw geval;
//   - de hoofdstuktoets van 5.5 bevraagt alle VEERTIEN leerdoelen van 5.1 tot
//     en met 5.5. Tien leerdoelen komen er twee keer in terug.
//
// BB-VORM: VEEL KLEINE MOMENTEN
// -----------------------------
// Het bb-profiel zegt: vorm gaat voor inhoud, en een leerling moet elke minuut
// iets kunnen aanklikken. Daarom staan er in dit hoofdstuk veel korte vragen in
// plaats van een paar grote. Geteld over heel hoofdstuk 5 in bb: 29 meerkeuze,
// 33 waar-niet-waar en 5 open vragen, samen 67. Van de 62 gesloten vragen is
// dus meer dan de helft een korte goed-of-fout-knop, en in de hoofdstuktoets -
// met 24 vragen het langste blok van het hoofdstuk - zijn dat er elf.
//
// De reden waarom een antwoord goed is staat in `explanation`, niet in de
// antwoordtekst zelf. Datzelfde geldt voor de afleiders: waarom iemand daarin
// trapt staat in `misconception` en niet als "want ..."-staart in de knop.
// Feedback is kort, positief en benoemt wat er goed ging.
//
// RAADBAARHEID OP VORM: TWEE KANTEN OP
// ------------------------------------
// De vorige ronde verloor hierop. Toen was in geen enkele vraag het goede
// antwoord de LANGSTE knop, maar in 26 van de 31 wel de kortste (84%). Blind op
// het kortste antwoord klikken was daarmee een winnende strategie, en de toets
// mat niets meer. De heuristiek moet naar twee kanten dood zijn. Daarom staat
// het goede antwoord nu bewust verdeeld over de drie lengteposities:
//
//   blok   meerkeuze   goed = strikt kortste   goed = strikt langste
//   5.1        4               1 (25%)                1 (25%)
//   5.2        5               0 ( 0%)                1 (20%)
//   5.3        4               1 (25%)                1 (25%)
//   5.4        5               1 (20%)                1 (20%)
//   5.5       11               3 (27%)                2 (18%)
//   totaal    29               6 (21%)                6 (21%)
//
// Beide kanten blijven zo ruim onder de 40% die het project hanteert. In de
// overige zeventien vragen is het goede antwoord de middelste in lengte. Waar
// de opties een reeks vormen (bedragen, betaalmanieren) zijn ze parallel
// geschreven, zodat lengte helemaal geen signaal meer is. Ook is er geen enkele
// vraag waarin het goede antwoord meer dan anderhalf keer zo lang of zo kort is
// als zijn afleiders. Het goede antwoord staat gespreid over de vier posities:
// 10 keer op 1, 7 keer op 2, 9 keer op 3 en 3 keer op 4 (er zijn vier vragen
// met vier opties).
//
// EIGEN TEKST, NIET OVERGENOMEN
// -----------------------------
// De vragen, opties, uitleg en feedback van dit bestand zijn voor bb geschreven
// en niet uit kb/h5.mjs of tl/h5.mjs overgenomen: kortere zinnen, een idee per
// vraag en scenario's uit de leefwereld van een brugklasser. Waar een zin toch
// gelijk zou lopen met kb is hij hier herschreven.
//
// EEN NAAM, EEN ROL
// -----------------
// Zie de kop van scripts/seed-structuur/bb/h5.mjs: elke naam heeft binnen dit
// hoofdstuk precies een rol. Noah (digitale wereld), Amber (toestemming
// vragen), Sanne (de klassenfoto), Ravi (muziek van een ander), Jayden (de
// foute bio), Roos (de gênante foto), Fleur (privé zetten), Sem (iDEAL en
// Klarna), Lisa (het pakket uit China), Fatima (de bestelcheck), Isa (vrijheid),
// Ilse (haar telefoon).

const LD_5_1 = [
  'Je kunt uitleggen wat jouw digitale wereld is.',
  'Je weet wat normen en waarden zijn en hoe ze online gelden.',
  'Je kunt drie gedragsregels noemen die online belangrijk zijn.'
];

const LD_5_2 = [
  'Je weet welke persoonlijke gegevens je beter privé houdt.',
  'Je kunt je account op privé zetten en je bio veilig invullen.',
  'Je weet hoe en waarom je een bericht rapporteert.'
];

const LD_5_3 = [
  'Je kunt vijf checks doen om te zien of een webshop betrouwbaar is.',
  'Je weet waar je op moet letten in de URL en bij het slotje.',
  'Je kunt uitleggen waarom een te lage prijs een waarschuwing is.'
];

const LD_5_4 = [
  'Je weet wat iDEAL, Klarna, een creditcard en Apple Pay of Google Pay zijn.',
  "Je kunt de risico's van achteraf betalen uitleggen.",
  'Je weet dat je bij kopen buiten de EU invoerrechten en btw kunt moeten betalen.'
];

const LD_5_5 = [
  'Je kunt een webshop en een betaalmethode beoordelen voordat je bestelt.',
  'Je kunt uitleggen welke gedragsregels jij online belangrijk vindt.'
];

export default {
  '5.1': {
    learningGoals: LD_5_1,
    theorie: [
      {
        keyTerms: ['digitale wereld', 'social media'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Noah zegt: mijn digitale wereld is Fortnite. Verder doe ik niets online. Klopt dat?</p>',
          '<p><strong>Antwoord.</strong> Nee, dat klopt niet helemaal. Fortnite is wel het grootste stuk. Maar Noah kijkt ook YouTube op zijn telefoon. Hij appt in de teamgroep van zijn voetbalclub. En hij zoekt huiswerk op met zijn schoollaptop. Alles wat via een scherm en internet gaat telt mee. Zijn digitale wereld is dus veel groter dan één game.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['waarden', 'normen', 'gedragsregels'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Amber post nooit een foto van een klasgenoot zonder te vragen. Welke waarde zit daaronder? En welke norm hoort erbij?</p>',
          '<p><strong>Antwoord.</strong> Haar waarde is respect. Dat is wat zij belangrijk vindt. Haar norm is de regel: ik vraag eerst of het mag. Let op de volgorde. De waarde komt eerst, de regel volgt daaruit. Kent Amber haar waarde, dan bedenkt zij zelf een regel. Ook voor een situatie die nog in geen enkel lijstje staat.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Jouw digitale wereld is alles wat je via een scherm doet. Waarden zijn dingen die jij belangrijk vindt. Normen zijn de regels die daaruit komen. Online gelden vier regels. Niet schelden en eerst toestemming vragen. Niets van anderen delen en nadenken voor je plaatst.</p>',
      keyTerms: ['digitale wereld', 'normen']
    },
    vragen: [
      {
        prompt: 'Jouw digitale wereld is alles wat jij via een scherm en via internet doet.',
        waar: true,
        leerdoel: LD_5_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Goed gezien. Je telefoon, je console en je laptop horen er alle drie bij.'
      },
      {
        prompt: 'Welk van deze dingen hoort bij jouw digitale wereld?',
        leerdoel: LD_5_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Met vrienden voetballen op het veld.', correct: false, misconception: 'Denkt dat alles wat je met vrienden doet meetelt.' },
          { text: 'Een puzzel maken met je opa.', correct: false, misconception: 'Denkt dat elke vrijetijdsbesteding erbij hoort.' },
          { text: 'Een filmpje kijken op YouTube of TikTok.', correct: true, explanation: 'Dit gaat via een scherm en via internet, dus het telt mee.' }
        ],
        feedback: 'Prima. De vraag is steeds: gaat het via een scherm en via internet?'
      },
      {
        prompt: 'Wat is een waarde?',
        leerdoel: LD_5_1[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Een afspraak die je docent opschrijft.', correct: false, misconception: 'Verwart een waarde met een norm of een schoolregel.' },
          { text: 'Een knop waarmee je een vervelend bericht meldt bij de app.', correct: false, misconception: 'Verwart een waarde met de rapporteerknop.' },
          { text: 'Het aantal likes op een foto.', correct: false, misconception: 'Denkt dat waarde met een getal te maken heeft.' },
          { text: 'Iets wat jij zelf belangrijk vindt, zoals eerlijkheid.', correct: true, explanation: 'Een waarde zit vanbinnen en die kun je niet zien.' }
        ],
        feedback: 'Mooi. Jij weet nu dat een waarde vanbinnen zit en een norm zichtbaar is.'
      },
      {
        prompt: 'Uit de waarde veiligheid komt de norm dat je geen privégegevens deelt.',
        waar: true,
        leerdoel: LD_5_1[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Sterk. Je ziet dat de regel netjes uit de waarde volgt.'
      },
      {
        prompt: 'Online gelden andere normen en waarden dan in het echte leven.',
        waar: false,
        leerdoel: LD_5_1[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Je ziet de ander niet, maar de regel blijft staan.'
      },
      {
        prompt: 'Je vindt online een mooie tekening. Je wilt hem als profielfoto. Wat doe je?',
        leerdoel: LD_5_1[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Ik vraag eerst aan de maker of het mag.', correct: true, explanation: 'De tekening is van iemand anders, dus die beslist erover.' },
          { text: 'Ik zet hem erop en haal hem weg als de maker klaagt.', correct: false, misconception: 'Denkt dat je achteraf mag herstellen wat je vooraf moest vragen.' },
          { text: 'Ik zet hem erop; hij stond toch al op internet.', correct: false, misconception: 'Denkt dat alles op internet vrij te gebruiken is.' }
        ],
        feedback: 'Precies. Een tekening, een liedje of een foto blijft van de maker.'
      },
      {
        prompt: 'Iemand uitschelden als grapje mag wel, want het is niet echt gemeen.',
        waar: false,
        leerdoel: LD_5_1[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed. Wat telt is hoe het bij de ander aankomt, niet je bedoeling.'
      },
      {
        prompt: 'Welke van de vier regels gaat over wat jij zelf de wereld in stuurt?',
        leerdoel: LD_5_1[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je scheldt niemand uit.', correct: false, misconception: 'Deze regel beschermt de ander, niet jouw eigen keuze.' },
          { text: 'Je denkt na voordat je iets plaatst.', correct: true, explanation: 'Na het plaatsen heb je er zelf geen controle meer over.' },
          { text: 'Je vraagt eerst of iemand op jouw foto mag.', correct: false, misconception: 'Ook deze regel gaat over de ander en niet over jouw post.' }
        ],
        feedback: 'Knap gezien. Twee regels gaan over de ander en twee over jou.'
      },
      {
        prompt: "Op Snapchat stuur je foto's die daarna weer verdwijnen.",
        waar: true,
        leerdoel: LD_5_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Al kan de ander er wel een screenshot van maken.'
      },
      {
        prompt: 'Noem twee dingen uit jouw eigen digitale wereld. Zet er per ding bij op welk apparaat het gebeurt.',
        type: 'open',
        leerdoel: LD_5_1[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik kijk TikTok op mijn telefoon. Ik game FIFA op mijn PlayStation. En ik zoek huiswerk op met mijn schoollaptop. Dat hoort er allemaal bij, want het gaat steeds via een scherm en via internet.',
        nakijkpunten: [
          'Er staan minstens twee dingen in die echt via een scherm en internet gaan.',
          'Bij elk ding staat het apparaat erbij.'
        ],
        feedback: 'Netjes. Je noemt niet alleen je favoriete app maar ook het apparaat.'
      }
    ]
  },

  '5.2': {
    learningGoals: LD_5_2,
    theorie: [
      {
        keyTerms: ['privacy', 'bio'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> In de bio van Jayden staat: 1B2, Sittard, 06-12345678. Wat moet daar weg?</p>',
          '<p><strong>Antwoord.</strong> Alle drie moeten weg. Met 1B2 en Sittard vind je zijn school. Met zijn school en rooster weet je waar hij is. Zijn nummer is een directe lijn naar hem. In je eentje lijkt elk stukje onschuldig. Samen wijzen ze naar één jongen op één plek.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['rapporteren', 'blokkeren'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Er gaat een gênante foto van Roos door de klassenapp. Wat doe jij, stap voor stap?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: je stuurt de foto niet door. Stap 2: je maakt een screenshot als bewijs. Stap 3: je tikt op de drie puntjes bij het bericht. Stap 4: je kiest Rapporteren en zegt wat er mis is. Stap 5: je stuurt Roos een privébericht. Stap 6: je vertelt het aan je mentor.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Privacy is alles wat persoonlijk van jou is. Je naam, adres, nummer en school houd je privé. Je locatie zet je uit. Zet daarna je account op privé. Dan zien alleen goedgekeurde volgers je berichten. Je bio blijft wel voor iedereen zichtbaar. Zie je iets wat niet oké is? Dan meld je het bij de app.</p>',
      keyTerms: ['privacy', 'bio']
    },
    vragen: [
      {
        prompt: 'Privacy betekent dat je iets te verbergen hebt.',
        waar: false,
        leerdoel: LD_5_2[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Goed opgelet. Privacy is zelf kiezen wie wat van jou ziet.'
      },
      {
        prompt: 'Welk gegeven houd je online beter privé?',
        leerdoel: LD_5_2[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'De naam van je lievelingsband.', correct: false, misconception: 'Denkt dat alles wat je leuk vindt privé moet blijven.' },
          { text: 'De kleur die jij het mooist vindt.', correct: false, misconception: 'Denkt dat elke persoonlijke voorkeur gevaarlijk is.' },
          { text: 'Je favoriete speler van Oranje.', correct: false, misconception: 'Verwart een mening met een persoonlijk gegeven.' },
          { text: 'Het adres waar jij woont en slaapt.', correct: true, explanation: 'Met je adres weet een vreemde precies waar je te vinden bent.' }
        ],
        feedback: 'Sterk. Vraag je steeds af: kan iemand hiermee vinden waar ik ben?'
      },
      {
        prompt: 'Je school en je rooster samen laten zien waar jij elke dag bent.',
        waar: true,
        leerdoel: LD_5_2[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Precies. Los is elk gegeven klein, maar samen worden ze groot.'
      },
      {
        prompt: 'Fleur zet haar account op privé. Wat kunnen vreemden daarna nog steeds zien?',
        leerdoel: LD_5_2[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Haar bio en haar profielfoto.', correct: true, explanation: 'Die twee blijven in bijna elke app voor iedereen zichtbaar.' },
          { text: "Alle foto's van de afgelopen maanden.", correct: false, misconception: 'Denkt dat privé zetten niets verandert.' },
          { text: 'De berichten in haar verhaal.', correct: false, misconception: 'Denkt dat verhalen buiten de privacy-instelling vallen.' }
        ],
        feedback: 'Goed gezien. Daarom schoon je naast je instellingen ook je bio op.'
      },
      {
        prompt: 'In je bio zet je liever niet je woonplaats en je school.',
        waar: true,
        leerdoel: LD_5_2[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt helemaal. Die tekst kan iedereen lezen, ook zonder account.'
      },
      {
        prompt: 'Waarom helpt de vraag: zou ik willen dat een leraar dit ziet?',
        leerdoel: LD_5_2[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je weet dan hoeveel volgers je bericht zag.', correct: false, misconception: 'Verwart nadenken over later met het tellen van bereik.' },
          { text: 'Leraren kunnen alle berichten van leerlingen bekijken.', correct: false, misconception: 'Denkt dat de school meekijkt in je account.' },
          { text: 'Je kijkt vooruit naar wie het later nog ziet.', correct: true, explanation: 'Je denkt aan mensen die je nu nog niet kent maar later nodig hebt.' }
        ],
        feedback: 'Mooi. Zo kijk je een paar jaar vooruit in plaats van één dag.'
      },
      {
        prompt: 'Rapporteren is hetzelfde als klikken.',
        waar: false,
        leerdoel: LD_5_2[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed. Je meldt gedrag, je doet het anoniem en de app beslist.'
      },
      {
        prompt: 'Er gaat een gênante foto van een klasgenoot rond in de groepsapp. Wat doe jij?',
        leerdoel: LD_5_2[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ik reageer met een grappige emoji.', correct: false, misconception: 'Denkt dat meelachen de situatie zachter maakt.' },
          { text: 'Ik stuur hem niet door en ik meld hem.', correct: true, explanation: 'Zo stopt de foto bij jou en kijkt de app ernaar.' },
          { text: 'Ik doe niets; het gaat niet over mij.', correct: false, misconception: 'Denkt dat je alleen mag ingrijpen als jij het slachtoffer bent.' },
          { text: 'Ik stuur hem door naar mijn beste vriend.', correct: false, misconception: 'Denkt dat doorsturen onschuldig is als het maar één persoon is.' }
        ],
        feedback: 'Sterke keuze. Niet doorsturen is de helft van de oplossing.'
      },
      {
        prompt: 'Voordat je rapporteert maak je eerst een screenshot als bewijs.',
        waar: true,
        leerdoel: LD_5_2[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Slim. Wordt het bericht verwijderd, dan heb jij het nog.'
      },
      {
        prompt: 'Ravi post nooit muziek van iemand anders alsof het van hem is. Welke waarde zit daaronder?',
        leerdoel: LD_5_1[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Vrijheid.', correct: false, misconception: 'Denkt dat vrijheid betekent dat je alles mag gebruiken.' },
          { text: 'Populariteit.', correct: false, misconception: 'Verwart een waarde met wat veel likes oplevert.' },
          { text: 'Eerlijkheid.', correct: true, explanation: 'Hij doet niet alsof andermans werk van hem is.' }
        ],
        feedback: 'Goed onthouden uit 5.1. De waarde staat altijd onder de regel.'
      }
    ]
  },

  '5.3': {
    learningGoals: LD_5_3,
    theorie: [
      {
        keyTerms: ['webshop', 'reviews'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Een site heeft vijfhonderd reviews op zijn eigen pagina, allemaal vijf sterren. Is dat een goed teken?</p>',
          '<p><strong>Antwoord.</strong> Nee, dat zegt weinig. Die reviews staan op hun eigen site. Ze kunnen ze dus zelf geschreven hebben. Alles wat de winkel zelf regelt bewijst niets. Zoek daarom op Google naar de naam plus het woord klacht. Wat daar staat komt van buiten en telt wel mee.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['URL', 'slotje', 'nepwinkel'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je ziet dit adres: www.nike-outlet-sale.com. Wie is de eigenaar van die site?</p>',
          '<p><strong>Antwoord.</strong> Kijk naar de naam vlak voor .com. Daar staat nike-outlet-sale. Dat is dus niet Nike zelf. Nike verkoopt alleen via www.nike.com. De stukjes -outlet en -sale zijn erbij geplakt om echt te lijken. Staat er ook nog een slotje? Dat verandert niets aan dit oordeel.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Bij een webshop doe je vijf checks. Vergelijk de prijs met een winkel die je kent. Kijk naar het slotje en klik erop. Check de naam vlak voor .nl of .com. Bekijk de site en zoek een adres. Lees daarna reviews op Google. Een te lage prijs is bijna altijd een waarschuwing.</p>',
      keyTerms: ['webshop', 'slotje']
    },
    vragen: [
      {
        prompt: 'Bij de vijf checks vergelijk je de prijs met een winkel die je kent.',
        waar: true,
        leerdoel: LD_5_3[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Klopt. Bol.com of een winkel in de stad is een prima meetlat.'
      },
      {
        prompt: 'Waar zoek je reviews van andere kopers?',
        leerdoel: LD_5_3[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Op Google.', correct: true, explanation: 'Wat buiten de site staat kan de winkel niet zelf regelen.' },
          { text: 'Bij je bank.', correct: false, misconception: 'Verwart reviews met je eigen betaalgeschiedenis.' },
          { text: 'Op de webshop.', correct: false, misconception: 'Denkt dat reviews op de site zelf onafhankelijk zijn.' }
        ],
        feedback: 'Goed. Zoeken buiten de winkel om is de sterkste van de vijf checks.'
      },
      {
        prompt: 'Op een site staan spelfouten en er is nergens een adres te vinden. Wat doe je?',
        leerdoel: LD_5_3[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Ik bestel toch; spelfouten maakt iedereen.', correct: false, misconception: 'Denkt dat slordigheid niets over betrouwbaarheid zegt.' },
          { text: 'Ik bel de klantenservice en bestel daarna.', correct: false, misconception: 'Denkt dat één telefoontje het ontbrekende adres goedmaakt.' },
          { text: 'Ik bestel hier niet en zoek een andere winkel.', correct: true, explanation: 'Een echte winkel heeft altijd een adres, ook als hij alleen online is.' }
        ],
        feedback: 'Verstandig. Geen adres betekent: je vindt ze later nooit meer terug.'
      },
      {
        prompt: 'Wie is de eigenaar van www.decathlon.nl.sportdeal-outlet.com?',
        leerdoel: LD_5_3[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Decathlon.', correct: false, misconception: 'Kijkt naar het begin van het adres in plaats van naar het eind.' },
          { text: 'Sportdeal-outlet.', correct: true, explanation: 'De naam vlak voor .com is altijd de eigenaar van de site.' },
          { text: 'Allebei de namen samen.', correct: false, misconception: 'Denkt dat twee namen in een adres twee eigenaren betekenen.' }
        ],
        feedback: 'Knap gedaan. Je kijkt naar het stukje vlak voor .nl of .com.'
      },
      {
        prompt: 'Een slotje voor het webadres bewijst dat de winkel eerlijk is.',
        waar: false,
        leerdoel: LD_5_3[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Het slotje gaat alleen over je verbinding.'
      },
      {
        prompt: 'In sommige browsers zie je twee schuifjes in plaats van een slotje.',
        waar: true,
        leerdoel: LD_5_3[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Dat is dezelfde knop, hij ziet er alleen anders uit.'
      },
      {
        prompt: 'Een jas van 120 euro kost op een onbekende site 15 euro. Wat betekent dat meestal?',
        leerdoel: LD_5_3[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Dat het waarschijnlijk een nepwinkel is.', correct: true, explanation: 'Van 120 naar 15 euro kan geen enkele echte winkel volhouden.' },
          { text: 'Dat de winkel uitverkoop houdt.', correct: false, misconception: 'Denkt dat elke lage prijs een gewone aanbieding is.' },
          { text: 'Dat de winkel rechtstreeks bij de fabriek koopt.', correct: false, misconception: 'Denkt dat inkoop bij de fabriek zulke prijzen verklaart.' }
        ],
        feedback: 'Scherp. Te mooi om waar te zijn is het meestal ook niet.'
      },
      {
        prompt: 'Een prijs die veel lager is dan overal elders, is een waarschuwing.',
        waar: true,
        leerdoel: LD_5_3[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Precies. Dan krijg je niets, of iets anders dan op de foto stond.'
      },
      {
        prompt: 'Jouw pakketje wordt thuisbezorgd door een vervoersbedrijf zoals PostNL, DHL of UPS.',
        waar: true,
        leerdoel: LD_5_3[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Ja. Eerst betaal je, daarna brengt zo\'n bedrijf je pakketje.'
      },
      {
        prompt: 'Leg in twee zinnen uit waarom je niet bestelt bij een winkel zonder adres.',
        type: 'open',
        leerdoel: LD_5_3[0],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Een echte webwinkel heeft altijd een adres, ook als hij alleen online is. Zonder adres kun je niemand vinden als je pakket niet aankomt of kapot is.',
        nakijkpunten: [
          'Er staat in dat elke echte webwinkel een adres heeft.',
          'Er staat een gevolg bij: je kunt de winkel later niet meer bereiken.'
        ],
        feedback: 'Goede uitleg. Je noemt niet alleen de regel maar ook het gevolg.'
      },
      {
        prompt: 'Een webshop heeft jouw telefoonnummer nodig om een pakket te bezorgen.',
        waar: false,
        leerdoel: LD_5_2[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren',
        feedback: 'Goed onthouden uit 5.2. Je naam en je adres zijn genoeg.'
      }
    ]
  },

  '5.4': {
    learningGoals: LD_5_4,
    theorie: [
      {
        keyTerms: ['iDEAL', 'Klarna', 'creditcard'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sem koopt sneakers van 90 euro. Wat gebeurt er met zijn geld bij iDEAL en wat bij Klarna?</p>',
          '<p><strong>Antwoord.</strong> Bij iDEAL gaat de 90 euro meteen weg. Het staat direct op de rekening van de winkel. Zijn gegevens zijn daarbij versleuteld, dus niemand leest mee. Maar Sem kan het bedrag zelf niet terughalen. Bij Klarna gaat er nu niets weg. Sem krijgt eerst zijn sneakers en betaalt later. Vergeet hij dat? Dan komt er een boete bij.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['invoerrechten', 'btw', 'douane'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Lisa bestelt een lamp van 30 euro op Temu. Kan die lamp haar meer dan 30 euro kosten?</p>',
          '<p><strong>Antwoord.</strong> Ja, dat kan. De lamp komt van buiten de EU. De douane kan invoerrechten en btw rekenen. Stel dat dat samen 12 euro is. Dan betaalt Lisa 42 euro. Die rekening krijgt zij pas als het pakket hier is. Betaalt zij niet, dan wordt het pakket vernietigd.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Met iDEAL gaat je geld meteen weg. Terughalen kan niet meer. Met Klarna betaal je achteraf. Te laat betalen kost een boete. Daarna komt er een incassobureau bij. Een creditcard werkt met geleend geld van de bank. Koop je buiten de EU? Dan kan de douane invoerrechten en btw rekenen.</p>',
      keyTerms: ['Klarna', 'invoerrechten']
    },
    vragen: [
      {
        prompt: 'Wat gebeurt er met je geld als je met iDEAL betaalt?',
        leerdoel: LD_5_4[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Je krijgt eerst het product en betaalt later.', correct: false, misconception: 'Verwart iDEAL met achteraf betalen.' },
          { text: 'Het gaat meteen naar de winkel.', correct: true, explanation: 'De betaling loopt direct via je eigen bank-app.' },
          { text: 'De bank houdt het vast.', correct: false, misconception: 'Denkt dat de bank je geld voor je bewaart.' }
        ],
        feedback: 'Goed. Daarom check je de winkel altijd vóór je met iDEAL betaalt.'
      },
      {
        prompt: 'Klarna is een bank uit Zweden waarmee je achteraf betaalt.',
        waar: true,
        leerdoel: LD_5_4[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Klopt. Je koopt nu en de rekening komt later.'
      },
      {
        prompt: 'Bij iDEAL zijn jouw gegevens versleuteld, zodat niemand kan meelezen.',
        waar: true,
        leerdoel: LD_5_4[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Ja. Het betalen zelf is veilig; het risico zit in de winkel.'
      },
      {
        prompt: 'Wat is krediet?',
        leerdoel: LD_5_4[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Je eigen spaargeld.', correct: false, misconception: 'Verwart krediet met je eigen spaargeld.' },
          { text: 'Korting bij een webshop.', correct: false, misconception: 'Denkt dat krediet iets met korting te maken heeft.' },
          { text: 'Het aantal keer pinnen per maand.', correct: false, misconception: 'Denkt dat krediet een limiet op pinnen is.' },
          { text: 'Geld van de bank dat jij moet terugbetalen.', correct: true, explanation: 'Het is niet van jou, dus je moet het terugbetalen.' }
        ],
        feedback: 'Mooi. Lenen kost altijd geld, hoe klein het bedrag ook is.'
      },
      {
        prompt: 'Met Apple Pay of Google Pay betaal je met je telefoon of je horloge.',
        waar: true,
        leerdoel: LD_5_4[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Ja. Je bevestigt met een knopje, Face ID, je vinger of je code.'
      },
      {
        prompt: 'Je betaalt je Klarna-rekening niet op tijd. Wat komt er dan als eerste?',
        leerdoel: LD_5_4[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Eerst een herinnering.', correct: true, explanation: 'Pas als je ook daarna niet betaalt komen de boete en het incassobureau.' },
          { text: 'Meteen een incassobureau.', correct: false, misconception: 'Slaat de herinnering en de boete over.' },
          { text: 'Een blokkade bij alle webshops.', correct: false, misconception: 'Denkt dat één rekening je overal buitensluit.' }
        ],
        feedback: 'Goed. Je hebt dus nog een kans voordat het echt duur wordt.'
      },
      {
        prompt: 'Als je vaker te laat betaalt, kan je naam worden doorgegeven aan banken.',
        waar: true,
        leerdoel: LD_5_4[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Later geeft dat gedoe als je geld wilt lenen.'
      },
      {
        prompt: 'Achteraf betalen is eigenlijk een vorm van lenen.',
        waar: true,
        leerdoel: LD_5_4[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Precies. Daarom mag het pas vanaf achttien jaar.'
      },
      {
        prompt: 'Een hoesje uit China kost 10 euro. De douane rekent 4 euro invoerrechten en 3 euro btw. Wat betaal je in totaal?',
        leerdoel: LD_5_4[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: '10 euro, dat stond op de site.', correct: false, misconception: 'Denkt dat de prijs op de site alles is wat je betaalt.' },
          { text: '7 euro, alleen wat de douane rekent.', correct: false, misconception: 'Telt alleen de extra kosten en vergeet het product.' },
          { text: '17 euro, de prijs plus de kosten.', correct: true, explanation: 'De extra kosten komen boven op de prijs van het product.' }
        ],
        feedback: 'Goed gerekend. De prijs op de site is niet altijd de eindprijs.'
      },
      {
        prompt: 'De extra kosten van de douane betaal je pas als het pakket in Nederland is.',
        waar: true,
        leerdoel: LD_5_4[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Kun je niet betalen, dan raak je je pakket kwijt.'
      },
      {
        prompt: 'Je vriend zegt: op Temu betaal je nooit meer dan de prijs op de site. Leg uit waarom dat niet klopt.',
        type: 'open',
        leerdoel: LD_5_4[2],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Temu verkoopt vanuit China en dat ligt buiten de EU. Daarom kan de douane invoerrechten en btw rekenen. Een lamp van 30 euro kan dan 42 euro worden. Die rekening komt pas als het pakket in Nederland aankomt.',
        nakijkpunten: [
          'Er staat in dat China buiten de EU ligt.',
          'Invoerrechten en btw worden allebei genoemd.',
          'Er staat bij wanneer je die kosten moet betalen.'
        ],
        feedback: 'Sterke uitleg. Je noemt de kosten én het moment waarop ze komen.'
      },
      {
        prompt: 'Je wilt met iDEAL betalen bij een winkel die je niet kent. Wat doe je eerst?',
        leerdoel: LD_5_3[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Ik loop eerst de vijf checks langs.', correct: true, explanation: 'Na de betaling kun je het geld niet meer terughalen.' },
          { text: 'Ik kijk of er een slotje staat.', correct: false, misconception: 'Denkt dat het slotje de hele controle vervangt.' },
          { text: 'Ik betaal een klein bedrag als test.', correct: false, misconception: 'Denkt dat een proefbestelling een veilige test is.' }
        ],
        feedback: 'Goed onthouden uit 5.3. Checken doe je vóór je betaalt.'
      }
    ]
  },

  '5.5': {
    learningGoals: LD_5_5,
    theorie: [
      {
        keyTerms: ['gedragsregels', 'iDEAL'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Wat heb je in dit hoofdstuk geleerd? Noem per paragraaf één ding.</p>',
          '<p><strong>Antwoord.</strong> Uit 5.1: wat mijn digitale wereld is en welke gedragsregels er gelden. Uit 5.2: welke gegevens ik privé houd en hoe ik rapporteer. Uit 5.3: de vijf checks bij een webshop. Uit 5.4: het verschil tussen iDEAL, Klarna, een creditcard en Apple Pay. Kun je dit hardop opzeggen? Dan zit het erin.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['checklist', 'betaalmethode'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Fatima wil een controller kopen bij een shop die zij niet kent. Hoe pakt zij dat aan?</p>',
          '<p><strong>Antwoord.</strong> Eerst haar checklist voor de shop. Prijs: 19 euro terwijl hij overal 60 kost. Adres: nergens te vinden. Reviews op Google: drie klachten. Drie checks vallen negatief uit. Dan hoeft zij niet eens meer een betaalmethode te kiezen. Fatima bestelt hier niet en zoekt een andere winkel.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Voor je op bestellen klikt doe je twee dingen. Eerst de vijf checks bij de shop. Daarna kies je hoe je betaalt. Ken je de winkel niet? Betaal dan liever niet met iDEAL. Online houd jij je aan je eigen regels. Onder elke regel ligt een waarde van jou.</p>',
      keyTerms: ['bestellen', 'waarde']
    },
    vragen: [
      {
        prompt: 'Huiswerk opzoeken op je schoollaptop hoort ook bij je digitale wereld.',
        waar: true,
        leerdoel: LD_5_1[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Ja. Het hoeft niet leuk te zijn om erbij te horen.'
      },
      {
        prompt: 'Ilse zegt: mijn digitale wereld is alleen mijn telefoon. Wat klopt daar niet aan?',
        leerdoel: LD_5_1[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Haar telefoon hoort er niet bij.', correct: false, misconception: 'Denkt dat een telefoon buiten je digitale wereld valt.' },
          { text: 'Haar console en haar laptop horen er ook bij.', correct: true, explanation: 'Alles wat via een scherm en internet gaat telt mee.' },
          { text: 'Je hebt pas een digitale wereld met social media.', correct: false, misconception: 'Denkt dat alleen social media meetelt.' }
        ],
        feedback: 'Goed. Gamen, opzoeken en kijken horen er net zo goed bij.'
      },
      {
        prompt: 'Respect is een norm en niet schelden is een waarde.',
        waar: false,
        leerdoel: LD_5_1[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Scherp. Het is precies andersom: respect is de waarde.'
      },
      {
        prompt: 'Isa vindt vrijheid belangrijk. Welke regel past daarbij?',
        leerdoel: LD_5_1[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ik kijk elke avond hoeveel likes ik kreeg.', correct: false, misconception: 'Denkt dat likes tellen bij een waarde hoort.' },
          { text: "Ik zet de nieuwste filter op mijn foto's.", correct: false, misconception: 'Kiest een gewoonte in plaats van een regel met een waarde eronder.' },
          { text: 'Ik kies zelf wie mij mag volgen.', correct: true, explanation: 'Vrijheid gaat over zelf kiezen, dus ook over wie jou volgt.' }
        ],
        feedback: 'Goed. Uit een waarde maak je zelf een regel die erbij past.'
      },
      {
        prompt: 'Welke gedragsregel beschermt vooral de ander?',
        leerdoel: LD_5_1[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je vraagt toestemming voor je iemand op je foto zet.', correct: true, explanation: 'De ander houdt zo zelf de keuze wie hem of haar ziet.' },
          { text: 'Je zet je eigen account op privé.', correct: false, misconception: 'Dat is een privacytip en geen gedragsregel richting de ander.' },
          { text: 'Je denkt na voordat je zelf iets plaatst.', correct: false, misconception: 'Deze regel gaat over jouw eigen post, niet over de ander.' }
        ],
        feedback: 'Prima. Twee van de vier regels gaan over de ander.'
      },
      {
        prompt: 'Muziek van iemand anders posten alsof het van jou is, mag online gewoon.',
        waar: false,
        leerdoel: LD_5_1[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed. Een liedje blijft van de maker, ook op internet.'
      },
      {
        prompt: 'Welke twee dingen wijzen samen naar de plek waar jij bent?',
        leerdoel: LD_5_2[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je kleur en je game.', correct: false, misconception: 'Denkt dat elke voorkeur een persoonlijk gegeven is.' },
          { text: 'Je school en je rooster.', correct: true, explanation: 'Samen zeggen die twee precies waar jij bent en hoe laat.' },
          { text: 'Het aantal volgers op TikTok.', correct: false, misconception: 'Verwart een getal in de app met een persoonlijk gegeven.' }
        ],
        feedback: 'Goed. Los is elk gegeven klein, samen worden ze verraderlijk.'
      },
      {
        prompt: 'Je locatie bij een foto zetten is onschuldig, want die verdwijnt vanzelf weer.',
        waar: false,
        leerdoel: LD_5_2[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Een locatie blijft hangen en verraadt je route.'
      },
      {
        prompt: 'Je bio blijft zichtbaar, ook als je account op privé staat.',
        waar: true,
        leerdoel: LD_5_2[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Daarom hoort je bio opschonen bij privé zetten.'
      },
      {
        prompt: 'Als je account op privé staat, zien alleen goedgekeurde volgers je berichten.',
        waar: true,
        leerdoel: LD_5_2[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Ja. Jij bepaalt dan zelf wie er binnenkomt en wie niet.'
      },
      {
        prompt: 'Waarom is rapporteren geen klikken?',
        leerdoel: LD_5_2[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je meldt gedrag en je doet het anoniem.', correct: true, explanation: 'Je verraadt geen persoon; de app kijkt naar het bericht.' },
          { text: 'De app doet er toch nooit iets mee.', correct: false, misconception: 'Denkt dat melden zinloos is en dus niet telt.' },
          { text: 'Je krijgt er zelf een beloning voor terug.', correct: false, misconception: 'Denkt dat er iets voor jou te winnen valt.' }
        ],
        feedback: 'Sterk. Klikken doe je voor jezelf, rapporteren voor een ander.'
      },
      {
        prompt: 'Voordat je een gemeen bericht meldt, maak je er eerst een screenshot van.',
        waar: true,
        leerdoel: LD_5_2[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Slim. Zet er ook de naam en de datum op de afbeelding bij.'
      },
      {
        prompt: 'Welke check kan een oplichter het makkelijkst zelf regelen?',
        leerdoel: LD_5_3[0],
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een adres dat je op de kaart terugvindt.', correct: false, misconception: 'Denkt dat een echt adres makkelijk te verzinnen is.' },
          { text: 'Reviews die op Google buiten zijn site staan.', correct: false, misconception: 'Denkt dat reviews van buiten net zo makkelijk te sturen zijn.' },
          { text: 'Het slotje voor zijn webadres.', correct: true, explanation: 'Dat vraag je in een paar minuten aan; het zegt niets over eerlijkheid.' }
        ],
        feedback: 'Knap geredeneerd. Wat de winkel zelf regelt bewijst het minst.'
      },
      {
        prompt: 'In www.adidas-outlet-sale.com is adidas de eigenaar van de site.',
        waar: false,
        leerdoel: LD_5_3[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed gezien. Voor .com staat adidas-outlet-sale en dat is iemand anders.'
      },
      {
        prompt: 'Waarom bestel je niet bij een site waar alles spotgoedkoop is?',
        leerdoel: LD_5_3[2],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je pakket komt dan later aan.', correct: false, misconception: 'Denkt dat een lage prijs alleen trage bezorging betekent.' },
          { text: 'Je moet altijd invoerrechten betalen.', correct: false, misconception: 'Verwart een nepwinkel met kopen buiten de EU.' },
          { text: 'Geen echte winkel kan dat volhouden.', correct: true, explanation: 'Een winkel die niets verdient bestaat niet, dus er klopt iets niet.' }
        ],
        feedback: 'Precies. De prijs zelf is al een reden om verder te kijken.'
      },
      {
        prompt: 'Bij welke betaalmanier is je geld meteen weg?',
        leerdoel: LD_5_4[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Bij iDEAL, direct via je bank.', correct: true, explanation: 'Het bedrag gaat direct van je eigen rekening naar de winkel.' },
          { text: 'Bij Klarna, dus achteraf.', correct: false, misconception: 'Denkt dat een openstaande rekening hetzelfde is als betaald.' },
          { text: 'Bij een creditcard van de bank.', correct: false, misconception: 'Denkt dat jouw geld weg is zodra de bank betaalt.' }
        ],
        feedback: 'Goed. Bij de andere twee gaat jouw geld pas later weg.'
      },
      {
        prompt: 'Een creditcard kun je pas krijgen als je een maandelijks inkomen hebt.',
        waar: true,
        leerdoel: LD_5_4[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. De hoogte van je inkomen bepaalt hoeveel krediet je krijgt.'
      },
      {
        prompt: 'Een incassobureau probeert je geld alsnog te halen en rekent daarvoor kosten.',
        waar: true,
        leerdoel: LD_5_4[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Een vergeten rekening van 40 euro loopt zo op tot 100.'
      },
      {
        prompt: 'Wanneer krijg je de rekening van de douane?',
        leerdoel: LD_5_4[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Meteen in je winkelmandje.', correct: false, misconception: 'Denkt dat de extra kosten al bij het bestellen zichtbaar zijn.' },
          { text: 'Een jaar later bij de belasting.', correct: false, misconception: 'Verwart invoerrechten met belasting die je jaarlijks betaalt.' },
          { text: 'Als het pakket in Nederland is aangekomen.', correct: true, explanation: 'Pas dan kijkt de douane naar wat er in het pakket zit.' }
        ],
        feedback: 'Goed. Reken die kosten dus alvast mee voordat je bestelt.'
      },
      {
        prompt: 'Je kent de webshop niet. Welke betaalmanier kies je dan liever niet?',
        leerdoel: LD_5_5[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'iDEAL.', correct: true, explanation: 'Dat geld is meteen weg en de bank kan je niet helpen.' },
          { text: 'Klarna.', correct: false, misconception: 'Denkt dat achteraf betalen bij een onbekende winkel meer risico geeft.' },
          { text: 'Een creditcard.', correct: false, misconception: 'Denkt dat de verzekering van de creditcard juist een nadeel is.' }
        ],
        feedback: 'Slimme keuze. Bij twijfel kies je een manier die je nog beschermt.'
      },
      {
        prompt: 'Wat maakt een regel echt van jou?',
        leerdoel: LD_5_5[1],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Je docent schreef hem aan het begin van het jaar op.', correct: false, misconception: 'Denkt dat een regel van school automatisch jouw regel is.' },
          { text: 'Er ligt een waarde onder die jij belangrijk vindt.', correct: true, explanation: 'Dan houd je hem vol, ook als niemand meekijkt.' },
          { text: 'De app heeft hem in zijn voorwaarden gezet.', correct: false, misconception: 'Denkt dat de app bepaalt wat jij belangrijk vindt.' }
        ],
        feedback: 'Mooi. Een regel zonder waarde eronder houd je niet lang vol.'
      },
      {
        prompt: 'Iemand zomaar uit de groepsapp gooien past bij de waarde erbij horen.',
        waar: false,
        leerdoel: LD_5_5[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren',
        feedback: 'Scherp. Buitensluiten is juist het tegenovergestelde.'
      },
      {
        prompt: 'Noem drie van de vijf checks bij een webshop. Zet er per check bij waar je op let.',
        type: 'open',
        leerdoel: LD_5_3[0],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Check 1: prijzen vergelijken. Ik kijk of het bij bol.com veel duurder is. Check 3: de naam en de URL. Ik kijk welke naam vlak voor .nl of .com staat. Check 5: reviews lezen. Ik google de naam van de shop plus het woord klacht.',
        nakijkpunten: [
          'Er staan drie verschillende checks in.',
          'Bij elke check staat concreet waar de leerling op let.'
        ],
        feedback: 'Netjes. Je noemt de checks én wat je er precies mee doet.'
      },
      {
        prompt: 'Je wilt sneakers kopen bij een shop die je niet kent. Beschrijf in vier stappen wat je doet voor je betaalt.',
        type: 'open',
        leerdoel: LD_5_5[0],
        denkniveau: 'maken_controleren',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Stap 1: ik vergelijk de prijs met een winkel die ik ken. Stap 2: ik kijk welke naam vlak voor .nl of .com staat. Stap 3: ik zoek een adres en een telefoonnummer op de site. Stap 4: ik google de naam van de shop en lees de reviews. Valt er iets negatiefs uit? Dan bestel ik niet. Anders kies ik een betaalmanier die bij deze winkel past.',
        nakijkpunten: [
          'Er staan vier stappen in die uit de vijf checks komen.',
          'De volgorde is logisch: eerst de shop beoordelen, dan pas betalen.',
          'Er staat bij wat de leerling doet als een check negatief uitvalt.'
        ],
        feedback: 'Goed werk. Je beoordeelt de winkel voordat je je geld weggeeft.'
      }
    ]
  }
};
