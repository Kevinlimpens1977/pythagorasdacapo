// Verrijkingslaag hoofdstuk 1 - Startklaar op je nieuwe school.
// Kaderberoepsgerichte leerweg (kb).
//
// Structuur en lesstof staan in scripts/seed-structuur/kb/h1.mjs. Hier staan de
// leerdoelen, de kernbegrippen, de uitgewerkte voorbeelden, de samenvattingen en
// alle vragen. Het formaat van een vraag, de regels over afleiders en de eisen
// aan feedback staan in ../PATROON.md; lees dat eerst.
//
// OPZET, VOLGENS DE BLAUWDRUK EN HET KB-PROFIEL
// ---------------------------------------------
//   - Elk leerdoel heeft zijn eigen startvraag. Die staan als `checks` in het
//     structuurbestand, met antwoord en uitleg erbij, vóór de theorie.
//   - Elk theorieblok heeft een uitgewerkt voorbeeld (vraag + volledige
//     uitwerking) dat de leerling ziet vóór het zelfstandig oefenen.
//   - Elke afsluitquiz vanaf 1.2 heeft TWEE terugkeervragen naar leerdoelen van
//     eerdere paragrafen, en niet één. De blauwdruk vraagt er twee, en spreiden
//     is een van de twee technieken waar harde winst voor te vinden is. De
//     terugblikken reiken ook verschillend ver terug: 1.2 kijkt twee keer naar
//     1.1, 1.3 kijkt naar 1.2 en naar 1.1, en 1.4 kijkt naar 1.3 en naar 1.1.
//     Zo haalt de laatste paragraaf de stof van de eerste nog een keer op.
//   - De hoofdstuktoets van 1.5 telt 28 vragen en bevraagt alle 14 verplichte
//     leerdoelen van 1.1 tot en met 1.5 ELK TWEE KEER. In ronde 1 waren dat er
//     20 en kwamen acht leerdoelen maar één keer voorbij; met 14 doelen past
//     tweevoudige dekking niet in de 15 tot 20 vragen die de blauwdruk als
//     startwaarde noemt, en dan wint de dekking van dat ronde getal (PATROON.md).
//     Achtentwintig vragen aan een stuk is voor kb een lange zit. Daarom staan
//     ze sinds ronde 3 in TWEE VOLLEDIGE RONDEN van veertien: vraag 1 tot en
//     met 14 loopt de veertien leerdoelen één keer af, en vraag 15 begint weer
//     bij leerdoel 1. Een docent die de toets over twee lesmomenten wil doen,
//     knipt hem dus bij vraag 14 door en heeft dan twee keer volledige dekking.
//     Wie de toets in één keer maakt, merkt er niets van.
//   - De afsluitquiz van 1.4 telt negen vragen waar de blauwdruk er vijf noemt.
//     Vier daarvan zijn de vragen van de originele Wikiwijs-afsluittoets, en
//     die mogen niet verdwijnen; drie dekken de eigen leerdoelen van 1.4 en
//     twee zijn terugkeervragen. Vijf halen zou de bron aantasten.
//   - Kb-vorm: veel meerkeuze en goed/fout, per blok hoogstens één open vraag.
//     De reden waarom een antwoord klopt staat in `explanation`, niet in de
//     antwoordtekst zelf.
//
// DE LENGTE VAN EEN ANTWOORD MAG NIETS VERRADEN (ronde 3)
// -------------------------------------------------------
// In ronde 2 kreeg bijna elke afleider een want-clausule erachter en het goede
// antwoord niet. De validator kijkt alleen of de LANGSTE optie te vaak goed is,
// dus dat bleef groen - terwijl blind de KORTSTE knop klikken 29 van de 45
// meerkeuzevragen goed gaf. Precies de verklikker die we wilden vermijden, maar
// dan omgekeerd. Daarom is de vraagvorm hier opnieuw gezet, met twee regels:
//   - bij een vraag naar een naam of een plek zijn ALLE opties even kort;
//     de want-clausules zijn daar geschrapt, de denkfout leeft door in
//     `misconception`.
//   - bij een vraag naar een reden of een handeling zegt het goede antwoord
//     ook wat het is of hoe het gaat, zodat het even veel body heeft als de
//     afleiders.
// Nameten met beide maten (woorden en tekens): kortste antwoord goed 9 en 4
// procent, langste antwoord goed 13 en 20 procent. Raden op lengte levert nu
// minder op dan willekeurig gokken.
//
// De vier vragen van de originele afsluittoets van DigiChallenge 1
// (maken.wikiwijs.nl/p/questionnaire/standalone/8287245) zitten in de quiz van
// 1.4, herschreven naar kb-taal en met echte afleiders erbij.
//
// De vrijwillige plusparagraaf 1.6 bestaat alleen in de theoretische leerweg.
// In kb loopt hoofdstuk 1 van 1.1 tot en met het checkpoint 1.5.

const LD_1_1 = [
  'Je kunt inloggen op je schoolaccount, het wifi-netwerk van school en Office 365.',
  'Je weet waarvoor SOMtoday en ItsLearning zijn en waar je je rooster, cijfers en opdrachten vindt.',
  'Je kunt een screenshot maken en die inleveren bij je docent.'
];

const LD_1_2 = [
  'Je weet waaraan een sterk wachtwoord voldoet.',
  'Je kunt je wachtwoord veilig bewaren in een wachtwoordkluis of een beveiligd document.',
  'Je weet waarom je je wachtwoord nooit aan iemand anders geeft.'
];

const LD_1_3 = [
  'Je kunt in Outlook een nieuwe e-mail maken met onderwerp, aanhef en afsluiting.',
  'Je kunt een nette mail aan je docent schrijven met interpunctie en hoofdletters.',
  'Je kunt het juiste e-mailadres van je docent opzoeken en de mail versturen.'
];

const LD_1_4 = [
  'Je kunt uitleggen wat digitale geletterdheid betekent en waarom je het leert.',
  'Je weet wat een omgangsregel is en waarom die online ook geldt.',
  'Je weet dat je teksten van internet niet zomaar mag overnemen en dat je de bron noemt.'
];

const LD_1_5 = [
  'Je kunt zelfstandig inloggen, mailen en je werk inleveren.',
  'Je kunt uitleggen wat digitale geletterdheid voor jou betekent.'
];

export default {
  '1.1': {
    learningGoals: LD_1_1,
    theorie: [
      {
        keyTerms: ['schoolaccount', 'leerlingnummer', 'certificaat'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Milan zit in het computerlokaal. Op zijn briefje staat 123456@dacapocollege.nl. Wat typt hij in de twee velden? En wat doet hij daarna voor het wifi?</p>',
          '<p><strong>Antwoord.</strong> Milan werkt zes stappen van boven naar beneden af.</p>',
          '<ol>' +
          '<li>Bij gebruikersnaam typt hij 123456. Alleen het deel vóór de @ is zijn leerlingnummer.</li>' +
          '<li>Bij wachtwoord typt hij het wachtwoord dat hij aan het begin zelf koos.</li>' +
          '<li>Voor het wifi opent hij de wifi-instellingen van zijn laptop.</li>' +
          '<li>Hij kiest het netwerk van DaCapo College en klikt op Verbinden.</li>' +
          '<li>Hij typt daar weer 123456 in en daaronder zijn eigen wachtwoord.</li>' +
          '<li>Zijn laptop vraagt of hij het certificaat vertrouwt. Hij klikt op Verbinden of op Accepteren.</li>' +
          '</ol>',
          '<p>Die laatste knop heet niet op elke laptop hetzelfde. Typt Milan bij stap 1 zijn hele mailadres in, dan weigert de computer hem.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['SOMtoday', 'ItsLearning', 'screenshot'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sara moet haar werkstuk inleveren. Daarna wil ze kunnen bewijzen dat het gelukt is. En ze wil weten hoe laat haar volgende les begint. Wat doet ze?</p>',
          '<p><strong>Antwoord.</strong> Sara levert eerst in en haalt daarna haar bewijs op.</p>',
          '<ol>' +
          '<li>Ze opent ItsLearning en klikt haar vak aan.</li>' +
          '<li>Ze zoekt de opdracht op en klikt op Inleveren.</li>' +
          '<li>Ze sleept haar bestand in het vak.</li>' +
          '<li>Ze leest de bestandsnaam na en bevestigt pas daarna.</li>' +
          '<li>Op het scherm komt een bevestiging met de datum en de tijd erbij.</li>' +
          '<li>Daarvan maakt ze een screenshot met de Windows-toets, Shift en S.</li>' +
          '<li>Ze plakt dat plaatje met Ctrl en V in een Word-bestand.</li>' +
          '</ol>',
          '<p>Haar rooster zoekt ze daarna in SOMtoday op, want daar staan rooster en cijfers.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Met één account open je de schoolcomputers, het wifi van school en Office 365. Je gebruikersnaam is je leerlingnummer, dus het deel vóór de @. Je wachtwoord koos je zelf. Je rooster en je cijfers staan in SOMtoday. Je opdrachten staan in ItsLearning. Bewijs lever je met een foto van je scherm.</p>',
      keyTerms: ['leerlingnummer', 'SOMtoday']
    },
    vragen: [
      {
        prompt: 'Je zit voor het eerst achter een schoolcomputer. Het inlogscherm vraagt om twee gegevens. Wat typ je in het bovenste vakje, dat van de gebruikersnaam?',
        leerdoel: LD_1_1[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je voornaam en je achternaam.', correct: false, misconception: 'Denkt dat een schoolaccount met je naam werkt, zoals een spelaccount thuis.' },
          { text: 'Je hele schoolmailadres, dus je nummer met de @ en de rest.', correct: false, misconception: 'Kent het mailadres, maar leest niet dat alleen het deel vóór de @ nodig is.' },
          { text: 'Alleen je leerlingnummer, dus het stukje vóór de @.', correct: true, explanation: 'Dat nummer is je inlognaam. Wat achter de @ staat hoort bij je mailbox en typ je hier niet.' },
          { text: 'Het wachtwoord dat je aan het begin van het jaar zelf koos.', correct: false, misconception: 'Vult bovenin al in wat pas in het vakje daaronder thuishoort.' }
        ],
        feedback: 'In het bovenste vakje hoort alleen je leerlingnummer. Je wachtwoord typ je in het vakje eronder.'
      },
      {
        prompt: 'Met je Office 365-account log je in op de computers van school. Datzelfde account opent ook Word, PowerPoint en Outlook.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: true, explanation: 'Op alle apparaten van school log je in met datzelfde account, en Word, PowerPoint en Outlook horen erbij.' },
          { text: 'Niet waar', correct: false, misconception: 'Rekent op een los account per programma en zoekt dus naar meer wachtwoorden.' }
        ],
        leerdoel: LD_1_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Klopt. Je schoolaccount is één sleutel die op veel deuren past.'
      },
      {
        prompt: 'Je wilt weten in welk lokaal je het derde uur zit. En je wilt je cijfer van de eerste toets zien. Waar kijk je voor allebei?',
        leerdoel: LD_1_1[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'In SOMtoday.', correct: true, explanation: 'SOMtoday is de administratie: rooster, roosterwijzigingen, cijfers en meldingen staan daar bij elkaar.' },
          { text: 'In ItsLearning.', correct: false, misconception: 'Denkt dat de leeromgeving ook rooster en cijfers bijhoudt.' },
          { text: 'In OneDrive.', correct: false, misconception: 'Verwart een opslagplek met een informatiesysteem.' },
          { text: 'In de klassenapp.', correct: false, misconception: 'Vertrouwt op klasgenoten in plaats van op het systeem van school.' }
        ],
        feedback: 'SOMtoday is je rooster en je cijferlijst. Je kunt er zelfs meldingen aanzetten voor een nieuw cijfer.'
      },
      {
        prompt: 'Je levert een opdracht in op ItsLearning. Welke volgorde klopt?',
        leerdoel: LD_1_1[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Eerst bevestigen, dan je vak openen, dan de opdracht aanklikken en slepen.', correct: false, misconception: 'Denkt dat bevestigen de eerste stap is in plaats van de laatste.' },
          { text: 'Je bestand slepen, dan bevestigen, en daarna pas je vak openen.', correct: false, misconception: 'Denkt dat je een bestand kunt inleveren zonder eerst het vak te kiezen.' },
          { text: 'De opdracht aanklikken, bevestigen, je vak openen en dan slepen.', correct: false, misconception: 'Kent de losse stappen wel, maar werkt niet van groot naar klein.' },
          { text: 'Je vak openen, de opdracht aanklikken, je bestand slepen, bevestigen.', correct: true, explanation: 'Je werkt van groot naar klein, en bevestigen is altijd de laatste stap.' }
        ],
        feedback: 'Eerst het vak, dan de opdracht, dan het bestand. Bevestig pas als de bestandsnaam klopt.'
      },
      {
        prompt: 'Je docent wil een bewijsje van je rooster in SOMtoday zien. Jij werkt op een Windows-laptop. Welke drie toetsen druk je tegelijk in?',
        leerdoel: LD_1_1[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ctrl, Alt en Delete tegelijk indrukken en dan wachten.', correct: false, misconception: 'Kent die combinatie van vastgelopen computers en gokt daarop.' },
          { text: 'De Windows-toets, Shift en S tegelijk indrukken en dan een vak slepen.', correct: true, explanation: 'Het scherm wordt dan grijs en je sleept met je muis een vak om het deel dat je wilt.' },
          { text: 'Ctrl en S tegelijk indrukken en daarna een naam kiezen.', correct: false, misconception: 'Verwart opslaan met knippen, omdat in allebei een S zit.' },
          { text: 'Alt en Tab een paar keer achter elkaar indrukken.', correct: false, misconception: 'Denkt dat wisselen tussen vensters ook een plaatje oplevert.' }
        ],
        feedback: 'Windows-toets, Shift en S starten het knipprogramma. Wat je knipt, plak je daarna met Ctrl en V.'
      },
      {
        prompt: 'Je klasgenoot zegt dat SOMtoday en ItsLearning gewoon twee namen voor hetzelfde systeem zijn. Leg het verschil uit. Geef van allebei een voorbeeld van iets wat jij er doet.',
        type: 'open',
        leerdoel: LD_1_1[1],
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        modelAnswer: 'SOMtoday gaat over wanneer ik waar moet zijn en hoe ik ervoor sta. Ik bekijk er mijn rooster en mijn cijfers. Ik zet er ook een melding aan voor een roosterwijziging. ItsLearning is de leeromgeving. Daar staat het lesmateriaal van mijn docent. Daar lever ik ook mijn opdrachten in. Het is dus niet hetzelfde: het ene is de administratie, het andere is de les.',
        nakijkpunten: [
          'Bij SOMtoday staat er iets over het rooster, de cijfers of de meldingen.',
          'Bij ItsLearning staat er iets over lesmateriaal of over het inleveren van werk.',
          'Er staat bij allebei een eigen voorbeeld, in hele zinnen opgeschreven.'
        ],
        feedback: 'Het verschil zit in je vraag. Hoe sta ik ervoor is SOMtoday. Wat moet ik doen is ItsLearning.'
      }
    ]
  },

  '1.2': {
    learningGoals: LD_1_2,
    theorie: [
      {
        keyTerms: ['wachtwoordzin', 'raadprogramma'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Jayden twijfelt tussen twee wachtwoorden: Jayden2013! en de zin bruine kast eet donder. Welke is sterker? En hoe zie je dat?</p>',
          '<p><strong>Antwoord.</strong> Jayden legt allebei de wachtwoorden langs dezelfde twee meetlatten.</p>',
          '<ol>' +
          '<li>Tel de tekens. Jayden2013! telt 11 tekens. Bruine kast eet donder telt er 22, spaties meegeteld.</li>' +
          '<li>Kijk of het eerste wachtwoord iets over Jayden zegt. Zijn voornaam en zijn geboortejaar staan er letterlijk in.</li>' +
          '<li>Kijk of het tweede wachtwoord iets over hem zegt. Nee, die vier woorden hebben niets met hem te maken.</li>' +
          '</ol>',
          '<p>De wachtwoordzin wint dus twee keer: hij is dubbel zo lang en hij verraadt niets. Een raadprogramma begint namelijk altijd met namen en jaartallen.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['wachtwoordkluis', 'hoofdwachtwoord', 'wachtwoordportaal'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Lisa is haar schoolwachtwoord vergeten. Ze wil ook weten waar ze haar nieuwe wachtwoord straks bewaart. Welke stappen zet ze?</p>',
          '<p><strong>Antwoord.</strong> Lisa lost het in vijf stappen op, zonder op iemand te wachten.</p>',
          '<ol>' +
          '<li>Ze gaat naar het wachtwoordportaal van school. Daar maakte ze aan het begin van het jaar een account.</li>' +
          '<li>Ze stelt daar zelf een nieuw wachtwoord in.</li>' +
          '<li>Ze kiest een wachtwoordzin van vier woorden.</li>' +
          '<li>Ze zet die zin in de wachtwoordkluis op haar telefoon.</li>' +
          '<li>Die kluis gaat open met één hoofdwachtwoord dat alleen zij kent.</li>' +
          '</ol>',
          '<p>Wat ze niet doet: het op een briefje in haar etui schrijven. En ze appt het aan niemand door.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een sterk wachtwoord is vooral lang: twaalf tekens of meer. Het zegt niets over jou, dus geen naam en geen geboortedatum. Het handigst is een wachtwoordzin van vier losse woorden. Bewaar hem in een wachtwoordkluis of in een goed beveiligd document, nooit op een los briefje. Je geeft je wachtwoord aan niemand, want alles komt op jouw naam.</p>',
      keyTerms: ['wachtwoordzin', 'wachtwoordkluis']
    },
    vragen: [
      {
        prompt: 'Vier leerlingen laten hun wachtwoord zien. Welk wachtwoord is het sterkst?',
        leerdoel: LD_1_2[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Feyenoord2012', correct: false, misconception: 'Denkt dat cijfers erbij zetten al genoeg is, ook bij een clubnaam.' },
          { text: 'W8w00rd!', correct: false, misconception: 'Denkt dat het vervangtrucje nieuw is; raadprogramma\'s kennen het al jaren.' },
          { text: 'Gele stoel eet regen.', correct: true, explanation: 'Twintig tekens lang en er zit geen woord in dat iets over de eigenaar zegt.' },
          { text: 'De zin mijn moeder heet Fatima.', correct: false, misconception: 'Ziet dat een zin lang is, maar vergeet dat deze zin iets over de eigenaar verklapt.' }
        ],
        feedback: 'Kijk eerst naar de lengte en pas daarna naar rare tekens. Een naam of jaartal maakt een wachtwoord juist zwakker.'
      },
      {
        prompt: 'Een wachtwoord van acht tekens met je eigen voornaam erin is sterk genoeg voor je schoolaccount.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: false, misconception: 'Denkt dat een wachtwoord veilig is zolang het maar niet te raden lijkt.' },
          { text: 'Niet waar', correct: true, explanation: 'Acht tekens is te kort, en je voornaam is precies wat een raadprogramma als eerste probeert.' }
        ],
        leerdoel: LD_1_2[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Twaalf tekens of meer is een goed begin. Je eigen naam hoort er nooit in.'
      },
      {
        prompt: 'Waar bewaar je je wachtwoord zo dat een ander er niet bij kan?',
        leerdoel: LD_1_2[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'In een wachtwoordkluis, een app met een eigen slot.', correct: true, explanation: 'Alles staat daar achter één hoofdwachtwoord dat alleen jij uit je hoofd kent.' },
          { text: 'Op een briefje in je etui.', correct: false, misconception: 'Denkt dat iets veilig is zolang het klein is en in je tas zit.' },
          { text: 'In een gewone notitie op je telefoon zonder schermslot.', correct: false, misconception: 'Denkt dat een telefoon vanzelf beveiligd is, ook zonder slot.' },
          { text: 'Achter in je agenda, want die pakt niemand van je af.', correct: false, misconception: 'Denkt dat een agenda privé is, terwijl hij vaak open op tafel ligt.' }
        ],
        feedback: 'Stel steeds dezelfde vraag: kan een ander hierbij zonder mijn hoofdwachtwoord? Zo ja, dan is het geen bewaarplek.'
      },
      {
        prompt: 'Je krijgt een bericht: hallo, ik ben van de ICT-helpdesk, stuur je wachtwoord even door. Wat doe je?',
        leerdoel: LD_1_2[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je stuurt het door, want de helpdesk mag je account beheren.', correct: false, misconception: 'Denkt dat medewerkers van school je wachtwoord nodig hebben om te helpen.' },
          { text: 'Je stuurt de helft, zodat ze het zelf kunnen afmaken.', correct: false, misconception: 'Denkt dat een half wachtwoord minder gevaarlijk is dan een heel.' },
          { text: 'Je vraagt eerst hoe hij heet en stuurt het dan pas door.', correct: false, misconception: 'Denkt dat een naam vragen genoeg controle is bij een onbekende afzender.' },
          { text: 'Je stuurt niets terug en je meldt dit bericht bij je docent.', correct: true, explanation: 'De echte helpdesk kan je account herstellen zonder ooit je wachtwoord te zien.' }
        ],
        feedback: 'Wie om je wachtwoord vraagt, wil je account hebben. Melden bij je mentor of docent is altijd goed.'
      },
      {
        prompt: 'Waarvoor maak je aan het begin van het jaar een account aan op het wachtwoordportaal van school?',
        leerdoel: LD_1_2[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Om je rooster en je cijfers van dat jaar te kunnen bekijken.', correct: false, misconception: 'Verwart het portaal met SOMtoday.' },
          { text: 'Om zelf een nieuw wachtwoord in te stellen als je het vergeet.', correct: true, explanation: 'Dat is je herstelroute: je hoeft dan niet op de helpdesk te wachten.' },
          { text: 'Om je wachtwoord daar als tekst te bewaren voor later.', correct: false, misconception: 'Denkt dat het portaal een bewaarplek is in plaats van een herstelroute.' },
          { text: 'Om je docent te laten zien welk wachtwoord jij gekozen hebt.', correct: false, misconception: 'Denkt dat school jouw wachtwoord moet kennen.' }
        ],
        feedback: 'Het portaal is je nooddeur. Je zet er zelf een nieuw wachtwoord neer als je het oude kwijt bent.'
      },
      {
        prompt: 'Terugblik op 1.1. Je zoekt het lesmateriaal dat je docent voor morgen klaarzette. Welk systeem open je?',
        leerdoel: LD_1_1[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'SOMtoday.', correct: false, misconception: 'Denkt dat SOMtoday ook het lesmateriaal van docenten bevat.' },
          { text: 'ItsLearning.', correct: true, explanation: 'ItsLearning is de elektronische leeromgeving: lesmateriaal en inleverpunten per vak.' },
          { text: 'De klassenapp van je vak.', correct: false, misconception: 'Denkt dat mail de vaste plek voor lesmateriaal is.' },
          { text: 'OneDrive.', correct: false, misconception: 'Denkt dat OneDrive een gedeelde schoolmap is in plaats van je eigen opslag.' }
        ],
        feedback: 'Lesmateriaal en inleveren horen bij ItsLearning. Rooster en cijfers horen bij SOMtoday.'
      },
      {
        prompt: 'Nog een terugblik op 1.1. Je opdracht is ingeleverd en de bevestiging staat op je scherm. Hoe bewaar je dat als bewijs?',
        leerdoel: LD_1_1[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je schrijft de tijd over in je schrift.', correct: false, misconception: 'Denkt dat overschrijven net zo hard is als een afbeelding van het scherm.' },
          { text: 'Je maakt er een screenshot van en bewaart dat plaatje.', correct: true, explanation: 'Zo blijft de bevestiging met datum en tijd bewaard, ook zonder je eigen laptop erbij.' },
          { text: 'Je laat het scherm in de volgende les even aan je docent zien.', correct: false, misconception: 'Denkt dat laten zien hetzelfde is als bewijs dat blijft staan.' },
          { text: 'Je doet niets, want ItsLearning onthoudt dat zelf wel voor je.', correct: false, misconception: 'Vertrouwt op het systeem en heeft daardoor zelf niets in handen.' }
        ],
        feedback: 'Een foto van je scherm blijft bestaan. Je hoeft er je laptop dus niet meer voor mee te nemen.'
      }
    ]
  },

  '1.3': {
    learningGoals: LD_1_3,
    theorie: [
      {
        keyTerms: ['Outlook', 'onderwerp', 'offline'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Bilal zit in de trein zonder internet. Hij wil zijn mentor een vraag stellen over zijn rooster. Kan dat? En wat vult hij bovenin in?</p>',
          '<p><strong>Antwoord.</strong> Ja, dat kan. Bilal opent de app van Outlook op zijn laptop en werkt offline.</p>',
          '<ol>' +
          '<li>Hij klikt linksboven op Nieuwe e-mail.</li>' +
          '<li>Bij Aan typt hij de achternaam van zijn mentor en klikt het juiste adres aan.</li>' +
          '<li>In het veld onderwerp zet hij: vraag over mijn rooster.</li>' +
          '<li>Hij typt zijn bericht en klikt daarna op Verzenden.</li>' +
          '<li>De mail blijft in de wachtrij staan tot hij weer internet heeft.</li>' +
          '</ol>',
          '<p>Zodra er internet is, gaat de mail vanzelf weg. Via de browser had dit niet gewerkt, want die werkt alleen online.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['aanhef', 'interpunctie', 'afsluiting'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Dit bericht ging naar een docent: ey mevr ik snap de opdracht nie kunt u helpen. Wat is er mis? En hoe ziet een nette versie eruit?</p>',
          '<p><strong>Antwoord.</strong> Er mist een aanhef. Er staat geen naam en geen klas. Er is geen afsluiting. En er staan geen hoofdletters of punten.</p>',
          '<p>Zo ziet de nette versie eruit, regel voor regel.</p>',
          '<ol>' +
          '<li>De aanhef: Beste mevrouw Peeters.</li>' +
          '<li>Voorstellen: mijn naam is Dilara en ik zit in klas 1B.</li>' +
          '<li>De boodschap: ik snap opdracht 3 van vandaag niet goed.</li>' +
          '<li>De vraag: kunt u mij uitleggen wat er bij stap 2 moet gebeuren?</li>' +
          '<li>De afsluiting: Met vriendelijke groet.</li>' +
          '<li>Daaronder je naam en je klas: Dilara Yilmaz, klas 1B.</li>' +
          '</ol>',
          '<p>In elke zin staat nu interpunctie: een hoofdletter voorop en een punt of vraagteken erachter.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Outlook hoort bij Office 365 en werkt via de app of via je browser. Je begint met Nieuwe e-mail, vult bij Aan het adres in en typt daarna een duidelijk onderwerp. In je bericht staan vijf onderdelen: aanhef, voorstellen, boodschap, groet en je naam met je klas. Gebruik hoofdletters en punten. Ken je het adres niet, typ dan de achternaam en klik het juiste adres aan.</p>',
      keyTerms: ['Outlook', 'aanhef']
    },
    vragen: [
      {
        prompt: 'Je maakt je eerste oefenmail voor deze les. Wat vul je precies in bij het onderwerp?',
        leerdoel: LD_1_3[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Niets; dat vakje mag leeg blijven.', correct: false, misconception: 'Denkt dat het onderwerp niet belangrijk is omdat de mail ook zonder verstuurt.' },
          { text: 'Mijn eerste email.', correct: true, explanation: 'De opdracht uit de les schrijft precies deze woorden voor.' },
          { text: 'Je eigen naam en je klas.', correct: false, misconception: 'Denkt dat het onderwerp bedoeld is om jezelf voor te stellen.' },
          { text: 'Hoi meneer.', correct: false, misconception: 'Verwart het onderwerp met de aanhef van het bericht zelf.' }
        ],
        feedback: 'Het onderwerp is de titel van je mail. Bij deze oefening is dat letterlijk: mijn eerste email.'
      },
      {
        prompt: 'Vier regels van een schoolmail staan door elkaar. Welke volgorde is goed?',
        leerdoel: LD_1_3[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Eerst je boodschap, dan de aanhef, dan de groet, dan voorstellen.', correct: false, misconception: 'Begint met de inhoud en vergeet dat je eerst iemand aanspreekt.' },
          { text: 'Eerst de groet, dan de aanhef, dan voorstellen, dan je boodschap.', correct: false, misconception: 'Zet de afsluiting bovenaan, alsof het een kop is.' },
          { text: 'Eerst de aanhef, dan voorstellen, dan je boodschap, dan de groet.', correct: true, explanation: 'Zo loopt een mail van boven naar beneden: aanspreken, wie je bent, wat je wilt, afsluiten.' },
          { text: 'Eerst voorstellen, dan je boodschap, dan de aanhef, dan de groet.', correct: false, misconception: 'Denkt dat je jezelf voorstelt voordat je iemand aanspreekt.' }
        ],
        feedback: 'Denk aan een gesprek bij de deur. Eerst hallo, dan wie je bent, dan je vraag, en dan pas dag.'
      },
      {
        prompt: 'In een mail aan je docent begint elke zin met een hoofdletter. Aan het eind van die zin zet je een punt.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: true, explanation: 'Die punten en hoofdletters heten interpunctie, en ze maken je bericht leesbaar.' },
          { text: 'Niet waar', correct: false, misconception: 'Denkt dat mailen hetzelfde is als appen, waar leestekens vaak wegvallen.' }
        ],
        leerdoel: LD_1_3[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Hoofdletters en punten laten ook zien dat je moeite voor je bericht gedaan hebt.'
      },
      {
        prompt: 'Je weet alleen de achternaam van je docent. Hoe kom je in Outlook aan het juiste e-mailadres?',
        leerdoel: LD_1_3[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je typt de achternaam bij Aan en kiest het juiste adres.', correct: true, explanation: 'Outlook zoekt mee in het adresboek van school, dus je kunt geen letter fout typen.' },
          { text: 'Je vraagt het adres in de klassenapp.', correct: false, misconception: 'Denkt dat overtypen net zo betrouwbaar is als het adresboek gebruiken.' },
          { text: 'Je verzint het adres zelf met de voorletter en de achternaam.', correct: false, misconception: 'Denkt dat alle schooladressen op dezelfde manier zijn opgebouwd.' },
          { text: 'Je stuurt de mail naar je mentor en vraagt of hij hem doorstuurt.', correct: false, misconception: 'Kiest een omweg in plaats van het adresboek dat er gewoon is.' }
        ],
        feedback: 'Het adresboek van school doet het werk voor je. Staan er meer namen, kijk dan naar de voorletter.'
      },
      {
        prompt: 'Terugblik op 1.2. Wat maakt de zin blauwe kraan zingt zaterdag een sterk wachtwoord?',
        leerdoel: LD_1_2[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Er zit een kleur in.', correct: false, misconception: 'Denkt dat het soort woord telt in plaats van de lengte.' },
          { text: 'Hij is lang en hij zegt niets over jou of je hobby.', correct: true, explanation: 'Zevenentwintig tekens, en er zit geen naam, club of datum in die iets verraadt.' },
          { text: 'Hij bestaat uit gewone woorden, dus je hoeft hem niet te onthouden.', correct: false, misconception: 'Denkt dat makkelijk onthouden hetzelfde is als sterk zijn.' },
          { text: 'Er staan geen cijfers in, en dat vinden raadprogramma\'s juist lastig.', correct: false, misconception: 'Denkt dat het weglaten van cijfers een wachtwoord sterker maakt.' }
        ],
        feedback: 'Lengte doet het meeste werk. Woorden die niets met jou te maken hebben, doen de rest.'
      },
      {
        prompt: 'Nog een terugblik, nu op 1.1. Outlook vraagt je opnieuw om in te loggen. Welke gebruikersnaam vul je in?',
        leerdoel: LD_1_1[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je voornaam.', correct: false, misconception: 'Denkt dat een schoolaccount met een naam werkt in plaats van met een nummer.' },
          { text: 'Je leerlingnummer.', correct: true, explanation: 'Outlook hoort bij hetzelfde Office 365-account als de computers en het wifi van school.' },
          { text: 'Het adres van je mentor.', correct: false, misconception: 'Verwart het vakje Aan met het inlogscherm.' },
          { text: 'Je nummer met de @ en dacapocollege.nl er nog achter.', correct: false, misconception: 'Kent het mailadres, maar vult meer in dan het deel vóór de @.' }
        ],
        feedback: 'Eén account voor alles van school. Je nummer werkt dus ook hier, met je eigen wachtwoord erbij.'
      },
      {
        prompt: 'Herschrijf dit bericht aan je docent netjes: ey meneer wanneer is de toets nou groetjes. Gebruik alle onderdelen van een schoolmail.',
        type: 'open',
        leerdoel: LD_1_3[1],
        denkniveau: 'maken_controleren',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Beste meneer Jansen. Ik ben Nour el Amrani uit klas 1C. Ik heb een vraag over de eerste toets van dit jaar. In welke week staat die toets gepland? Alvast bedankt voor uw antwoord. Met vriendelijke groet, Nour el Amrani uit klas 1C.',
        nakijkpunten: [
          'Er staat een aanhef met de achternaam van de docent, en een afsluiting met naam en klas.',
          'De leerling stelt zichzelf voor met naam en klas voordat de vraag komt.',
          'Elke zin begint met een hoofdletter en eindigt met een punt of een vraagteken.'
        ],
        feedback: 'De vraag zelf blijft hetzelfde. Wat verandert is de toon: aanspreken, jezelf voorstellen en netjes afsluiten.'
      }
    ]
  },

  '1.4': {
    learningGoals: LD_1_4,
    theorie: [
      {
        keyTerms: ['digitale geletterdheid', 'DigiChallenge', 'mediawijsheid'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je oom zegt: jullie zitten toch de hele dag op je telefoon, wat valt daar nog aan te leren? Wat antwoord je hem?</p>',
          '<p><strong>Antwoord.</strong> Digitale geletterdheid betekent veilig, handig en kritisch omgaan met internet.</p>',
          '<ol>' +
          '<li>Veilig is dat ik mijn account en mijn gegevens beschermen kan.</li>' +
          '<li>Handig is dat ik een verslag en een presentatie kan maken die er goed uitzien.</li>' +
          '<li>Kritisch is dat ik zie of een bericht echt is of verzonnen.</li>' +
          '<li>Scrollen leert me geen van die drie dingen.</li>' +
          '</ol>',
          '<p>Daarom heet elke les hier een DigiChallenge: ik moet het zelf doen. Het vak heeft vier stukken, en mediawijsheid is er daar een van.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['omgangsregel', 'surfen', 'bron', 'cloud'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Jill vindt op nos.nl een alinea over nepnieuws. Ze wil hem op haar poster zetten. Wat doet ze goed, en wat doet ze fout?</p>',
          '<p><strong>Antwoord.</strong> Fout is: de alinea kopiëren en zo op haar poster plakken. Goed gaat het zo.</p>',
          '<ol>' +
          '<li>Ze leest de alinea en kijkt daarna weg van haar scherm.</li>' +
          '<li>Ze schrijft op wat ze onthouden heeft, in haar eigen woorden.</li>' +
          '<li>Gebruikt ze toch een groot stuk letterlijk, dan zet ze de bron erbij.</li>' +
          '<li>Haar plaatjes bewaart ze in OneDrive, want dat is een cloud.</li>' +
          '<li>Bij de plek voor sociale media schrijft ze drie regels op.</li>' +
          '</ol>',
          '<p>Die bron is de NOS, want die schreef de tekst. Google is de zoekmachine en dus niet de bron. Elke regel over hoe je met elkaar omgaat heet een omgangsregel. Surfen naar zo een plek doe je gewoon met je browser.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Digitale geletterdheid betekent veilig, handig en kritisch omgaan met internet. Je leert het voor beter schoolwerk, voor je eigen veiligheid en om te zien wat echt is. Het vak bestaat uit vier stukken: ict-basisvaardigheden, informatievaardigheden, mediawijsheid en computational thinking. Een omgangsregel is een afspraak over hoe je met elkaar omgaat, en die geldt online net zo hard. Teksten van internet schrijf je in je eigen woorden op. Neem je iets letterlijk over, dan noem je de maker erbij.</p>',
      keyTerms: ['digitale geletterdheid', 'omgangsregel']
    },
    vragen: [
      {
        prompt: 'Wat betekent digitale geletterdheid?',
        leerdoel: LD_1_4[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Dat je in geheimtaal kunt schrijven.', correct: false, misconception: 'Leest geletterdheid als een soort code kunnen schrijven.' },
          { text: 'Dat je de tijd kunt aflezen van een digitale klok of horloge.', correct: false, misconception: 'Verbindt het woord digitaal met een klok in plaats van met internet.' },
          { text: 'Dat je veilig, handig en kritisch omgaat met internet en media.', correct: true, explanation: 'Veilig gaat over jezelf beschermen, handig over je schoolwerk en kritisch over zien wat echt is.' },
          { text: 'Dat je snel kunt typen op een toetsenbord zonder te kijken.', correct: false, misconception: 'Denkt dat het vak over een technische handigheid gaat.' }
        ],
        feedback: 'Het gaat om drie dingen tegelijk: veilig, handig en kritisch. Niet één ervan alleen.'
      },
      {
        prompt: 'Waarom leer je op school digitale vaardigheden?',
        leerdoel: LD_1_4[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Om jezelf veilig te houden, beter schoolwerk te maken en te zien wat echt is.', correct: true, explanation: 'Dat zijn de drie redenen die de les noemt, en ze horen alle drie bij elkaar.' },
          { text: 'Om beter te leren typen en om beter te worden in gamen op je device.', correct: false, misconception: 'Denkt dat het vak over sneller worden met je apparaat gaat.' },
          { text: 'Om alleen je schoolwerk beter te maken, want daar gaat school over.', correct: false, misconception: 'Noemt maar één van de drie redenen en laat veiligheid weg.' },
          { text: 'Om later een baan te krijgen waarin je de hele dag met computers moet werken.', correct: false, misconception: 'Denkt dat het vak een beroepsopleiding is in plaats van basiskennis.' }
        ],
        feedback: 'Alleen goed met een computer kunnen werken maakt je nog niet veilig, en ook nog niet kritisch.'
      },
      {
        prompt: 'Digitale geletterdheid heeft vier stukken. Bij welk stuk hoort het inloggen en het maken van een screenshot uit 1.1?',
        leerdoel: LD_1_4[0],
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Bij de informatievaardigheden.', correct: false, misconception: 'Verwart het zoeken naar informatie met het bedienen van je apparaat.' },
          { text: 'Bij mediawijsheid.', correct: false, misconception: 'Denkt dat alles wat met een scherm te maken heeft mediawijsheid is.' },
          { text: 'Bij computational thinking.', correct: false, misconception: 'Ziet het stappenplan wel, maar mist dat het om de knoppen gaat.' },
          { text: 'Bij de ict-basisvaardigheden.', correct: true, explanation: 'Dat stuk gaat precies over het bedienen van je apparaten en je programma\'s.' }
        ],
        feedback: 'Gaat het over knoppen en programma\'s, dan zijn het basisvaardigheden. Gaat het over bronnen, dan zijn het informatievaardigheden.'
      },
      {
        prompt: 'Wat is een omgangsregel?',
        leerdoel: LD_1_4[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een regel van de school.', correct: false, misconception: 'Dit is de schoolregel; een omgangsregel gaat over hoe je met elkaar omgaat.' },
          { text: 'Een afspraak over hoe je met elkaar omgaat, ook online.', correct: true, explanation: 'Omgang betekent letterlijk hoe je met elkaar omgaat, en die afspraak geldt ook online.' },
          { text: 'Een regel van de app over hoe oud je moet zijn om mee te doen.', correct: false, misconception: 'Verwart een leeftijdsgrens met een afspraak tussen gebruikers.' },
          { text: 'Een wet van de overheid over wat je online mag plaatsen.', correct: false, misconception: 'Denkt dat een omgangsregel door de overheid gemaakt wordt.' }
        ],
        feedback: 'Kijk naar het woord zelf: omgang is hoe je met elkaar omgaat. Daar gaat zo een regel over.'
      },
      {
        prompt: 'Omgangsregels gelden alleen in de klas, en niet in een groepsapp of op social media.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: false, misconception: 'Denkt dat je online minder rekening hoeft te houden omdat je elkaar niet ziet.' },
          { text: 'Niet waar', correct: true, explanation: 'Aan de andere kant zit een echt mens, en online blijft een bericht ook nog eens staan.' }
        ],
        leerdoel: LD_1_4[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Juist online gaat het sneller mis. Je ziet namelijk niet dat de ander schrikt van je bericht.'
      },
      {
        prompt: 'Mag je een tekst die je op internet vindt zomaar overnemen in je werkstuk?',
        leerdoel: LD_1_4[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ja, alles wat op internet staat is gratis en dus vrij te gebruiken.', correct: false, misconception: 'Denkt dat gratis te lezen hetzelfde is als vrij te gebruiken.' },
          { text: 'Ja, zolang je er google.com onder zet als plek waar je hem vond.', correct: false, misconception: 'Denkt dat de zoekmachine de bron is in plaats van de maker.' },
          { text: 'Nee, je schrijft hem in je eigen woorden op en zet de bron erbij.', correct: true, explanation: 'Neem je toch een groot stuk letterlijk over, dan zet je de maker erbij als bron.' },
          { text: 'Nee, je mag helemaal niets van internet in je werkstuk zetten.', correct: false, misconception: 'Denkt dat internet als bron verboden is, in plaats van dat je hem moet noemen.' }
        ],
        feedback: 'Lees, kijk weg en schrijf op wat je onthouden hebt. Bij een letterlijk stuk noem je de maker.'
      },
      {
        prompt: 'Terugblik op 1.3. Je mail aan je docent is af, maar het onderwerp is nog leeg. Waarom is dat een probleem?',
        leerdoel: LD_1_3[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je docent ziet in zijn postvak niet waar je mail over gaat.', correct: true, explanation: 'In het postvak staan alleen de onderwerpregels, dus hij moet elk bericht openen.' },
          { text: 'De mail komt dan niet aan.', correct: false, misconception: 'Denkt dat een leeg onderwerp het versturen tegenhoudt.' },
          { text: 'Outlook zet er dan zelf een verkeerd onderwerp boven je bericht.', correct: false, misconception: 'Denkt dat het programma het veld automatisch invult.' },
          { text: 'Je docent kan dan niet zien van welk mailadres het bericht komt.', correct: false, misconception: 'Verwart het onderwerp met de afzender van de mail.' }
        ],
        feedback: 'Het onderwerp is de titel van je bericht. Zonder titel moet je lezer alles openklikken.'
      },
      {
        prompt: 'Terugblik helemaal naar 1.1. Je poster is af en de foto ervan moet ingeleverd worden. Waar doe je dat?',
        leerdoel: LD_1_1[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'In SOMtoday, bij het vak waar deze opdracht bij hoort.', correct: false, misconception: 'Denkt dat de administratie ook opdrachten van docenten bevat.' },
          { text: 'In OneDrive, door de foto in een gedeelde map te zetten.', correct: false, misconception: 'Denkt dat opslaan hetzelfde is als inleveren.' },
          { text: 'In ItsLearning, bij de opdracht, op de knop Inleveren.', correct: true, explanation: 'Daar staat per vak een inleverpunt, en je krijgt er een bevestiging met datum en tijd.' },
          { text: 'In Outlook, door de foto als bijlage aan je docent te mailen.', correct: false, misconception: 'Kiest mail omdat dat sneller voelt dan het inleverpunt zoeken.' }
        ],
        feedback: 'Inleveren hoort bij de leeromgeving. Alleen daar krijg je een bevestiging die je kunt bewaren.'
      },
      {
        prompt: 'Je zet op je poster een alinea over nepnieuws die je letterlijk van nos.nl overneemt. Leg uit wat je dan moet doen en waarom dat moet.',
        type: 'open',
        leerdoel: LD_1_4[2],
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik moet de bron erbij zetten. De bron is de NOS, want die organisatie heeft de tekst geschreven. Ik zet dus niet Google erbij, want dat is alleen de zoekmachine. Dat moet, omdat de tekst niet van mij is. Iemand anders heeft er werk in gestoken. Het is ook eerlijker naar mijn docent, want die ziet dan wat ik zelf bedacht heb. Beter is nog om de alinea in mijn eigen woorden op te schrijven. Dan snap ik zelf ook wat er staat.',
        nakijkpunten: [
          'Noemt dat de bron erbij moet en dat de NOS de bron is, niet Google.',
          'Geeft een reden: de tekst is van iemand anders, of je docent moet zien wat van jou is.',
          'Noemt dat het beter is om de tekst in eigen woorden op te schrijven.'
        ],
        feedback: 'De bron is altijd de maker. Eigen woorden zijn nog beter, want dan begrijp je de tekst zelf ook.'
      }
    ]
  },

  '1.5': {
    learningGoals: LD_1_5,
    theorie: [
      {
        keyTerms: ['ict-basisvaardigheden', 'informatievaardigheden', 'computational thinking'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Meneer Jansen vraagt je iets. Leg eens uit wat je dit hoofdstuk geleerd hebt. Zeg er ook bij bij welk stuk van het vak dat hoort. Wat zeg je?</p>',
          '<p><strong>Antwoord.</strong> Ik noem zeven dingen en zeg er telkens bij waar ze horen.</p>',
          '<ol>' +
          '<li>Ik kan inloggen op school, op het wifi en in Office 365. Dat zijn de ict-basisvaardigheden.</li>' +
          '<li>Ik vind mijn rooster in SOMtoday en mijn opdrachten in ItsLearning. Ook basisvaardigheden.</li>' +
          '<li>Ik maak een sterk wachtwoord en bewaar het veilig.</li>' +
          '<li>Ik stuur een nette mail aan mijn docent.</li>' +
          '<li>Op mijn poster bedacht ik welke informatie mensen kunnen ophalen. Dat zijn de informatievaardigheden.</li>' +
          '<li>Mijn drie omgangsregels horen bij de mediawijsheid.</li>' +
          '<li>Mijn inlogronde deelde ik op in zes stappen. Dat is computational thinking.</li>' +
          '</ol>'
        ].join('\n')
      },
      {
        keyTerms: ['bewijs', 'controlelijst', 'checkpointmap'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Yusuf denkt dat hij niets meer heeft om in te leveren. Hoe vult hij toch zijn map? En waaraan ziet hij of iets telt?</p>',
          '<p><strong>Antwoord.</strong> Yusuf maakt een controlelijst met vier regels, één per paragraaf.</p>',
          '<ol>' +
          '<li>1.1 vraagt zijn screenshotdocument. Dat staat nog in zijn OneDrive, dus die is er al.</li>' +
          '<li>1.2 vraagt zijn wachtwoordkaart. Die is hij kwijt, dus die maakt hij vandaag opnieuw.</li>' +
          '<li>1.3 vraagt zijn mail. Die staat in Verzonden items, dus daar maakt hij nu een schermafdruk van.</li>' +
          '<li>1.4 vraagt zijn poster. Die ligt thuis, dus hij fotografeert hem vanavond.</li>' +
          '<li>Alles gaat daarna in zijn checkpointmap.</li>' +
          '</ol>',
          '<p>Bij elk stuk stelt hij één vraag: kan mijn docent dit openen en snappen zonder mij erbij? Is het antwoord ja, dan is het bewijs.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Je kunt nu inloggen, je rooster vinden, een nette mail sturen en je werk inleveren. Je wachtwoord staat op een veilige plek. Bewijs is iets wat je docent zelf kan bekijken, ook zonder jou erbij. Denk aan een schermafdruk, een ingeleverd bestand of een verstuurd bericht. Werk met een controlelijst en loop de vier paragrafen langs. Alles gaat samen in één map in OneDrive.</p>',
      keyTerms: ['bewijs', 'controlelijst']
    },
    vragen: [
      {
        prompt: 'Je gaat aan een schoolcomputer zitten. Welke twee gegevens heb je nodig om binnen te komen?',
        leerdoel: LD_1_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je volledige naam en je geboortedatum van dit schooljaar.', correct: false, misconception: 'Denkt dat de computer je persoonsgegevens gebruikt om je te herkennen.' },
          { text: 'Je leerlingnummer en het wachtwoord dat je zelf gekozen hebt.', correct: true, explanation: 'Het leerlingnummer is het deel vóór de @ van je schoolmailadres.' },
          { text: 'Je schoolpas en de code die op de achterkant van die pas staat.', correct: false, misconception: 'Denkt dat inloggen met een pas gaat, zoals bij een pinautomaat.' },
          { text: 'Het mailadres van je mentor en het wachtwoord van je klas.', correct: false, misconception: 'Denkt dat een klas samen één account deelt.' }
        ],
        feedback: 'Twee gegevens en niet meer: het nummer vóór de @ en het wachtwoord dat jij koos.'
      },
      {
        prompt: 'Je wilt automatisch bericht krijgen zodra er een nieuw cijfer wordt ingevoerd. Waar zet je dat aan?',
        leerdoel: LD_1_1[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'In ItsLearning, bij het vak waar dat cijfer bij hoort.', correct: false, misconception: 'Denkt dat cijfers bij de leeromgeving horen in plaats van bij de administratie.' },
          { text: 'In Outlook, met een regel voor je post.', correct: false, misconception: 'Denkt dat je meldingen zelf in je mailprogramma instelt.' },
          { text: 'Nergens; je docent belt je zelf.', correct: false, misconception: 'Denkt dat de docent dit handmatig doet in plaats van het systeem.' },
          { text: 'In SOMtoday, via het menu en dan Instellingen en Meldingen.', correct: true, explanation: 'Daar zet je met een schuifje meldingen aan voor cijfers en voor roosterwijzigingen.' }
        ],
        feedback: 'Zoek in het menu op het woord Meldingen. Dat staat er altijd, ook als jouw menu er anders uitziet.'
      },
      {
        prompt: 'Je werkt op een Chromebook en wilt een deel van je scherm knippen. Welke toetsen gebruik je?',
        leerdoel: LD_1_1[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Alleen de vensterwisseltoets, want die maakt vanzelf een plaatje.', correct: false, misconception: 'Denkt dat die toets in zijn eentje een schermafdruk maakt.' },
          { text: 'Ctrl en de vensterwisseltoets, en dan sleep je een vak.', correct: false, misconception: 'Die combinatie pakt juist het hele scherm, zonder dat je iets kunt slepen.' },
          { text: 'Ctrl, Shift en de vensterwisseltoets, en dan sleep je een vak.', correct: true, explanation: 'Daarna sleep je met je muis een vak om het deel dat je wilt hebben.' },
          { text: 'De Windows-toets, Shift en S, net als op een gewone laptop.', correct: false, misconception: 'Denkt dat een Chromebook dezelfde sneltoets heeft als Windows.' }
        ],
        feedback: 'Zonder Shift pak je het hele scherm. Met Shift erbij knip je precies het stuk dat je nodig hebt.'
      },
      {
        prompt: 'Twee wachtwoorden liggen naast elkaar: Kevin2011! en de zin zeven wolken dragen soep. Welke uitspraak klopt?',
        leerdoel: LD_1_2[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Kevin2011! is sterker, want er zit een hoofdletter en een cijfer in.', correct: false, misconception: 'Denkt dat vreemde tekens zwaarder wegen dan lengte.' },
          { text: 'Kevin2011! is sterker, want hij is korter en dus sneller te typen.', correct: false, misconception: 'Verwart handig typen met veilig zijn.' },
          { text: 'Ze zijn even sterk, want allebei zijn ze zelf bedacht.', correct: false, misconception: 'Denkt dat zelf bedenken al genoeg is voor een sterk wachtwoord.' },
          { text: 'De zin is sterker, want hij is langer en niet persoonlijk.', correct: true, explanation: 'Vierentwintig tekens tegen tien, en er zit geen naam of jaartal in die zin.' }
        ],
        feedback: 'Een naam met een jaartal erachter is precies wat een raadprogramma als eerste probeert.'
      },
      {
        prompt: 'Vier leerlingen bewaren hun wachtwoord ergens. Wie doet het veilig?',
        leerdoel: LD_1_2[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Sam, die het achter op zijn schoolpas geschreven heeft.', correct: false, misconception: 'Denkt dat iets veilig is zolang hij het zelf bij zich draagt.' },
          { text: 'Amber, die het in een wachtwoordkluis op haar telefoon zet.', correct: true, explanation: 'Die kluis gaat alleen open met één hoofdwachtwoord dat alleen zij kent.' },
          { text: 'Joep, die het in een gewoon Word-bestand op het bureaublad zet.', correct: false, misconception: 'Denkt dat een bestand op zijn eigen computer vanzelf privé is.' },
          { text: 'Nina, die het aan haar beste vriendin appt zodat zij het onthoudt.', correct: false, misconception: 'Denkt dat een vertrouwd persoon een veilige bewaarplek is.' }
        ],
        feedback: 'Een veilige plek is een plek waar niemand anders bij kan zonder jouw hoofdwachtwoord.'
      },
      {
        prompt: 'Je broer vraagt of hij even met jouw schoolaccount mag inloggen. Waarom doe je dat niet?',
        leerdoel: LD_1_2[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat je account dan langzamer wordt en je uitgelogd raakt.', correct: false, misconception: 'Denkt dat het om een technisch probleem gaat.' },
          { text: 'Omdat er dan twee mensen op staan.', correct: false, misconception: 'Denkt dat er een technische grens is in plaats van een afspraak.' },
          { text: 'Omdat alles wat hij daarmee doet op jouw naam komt.', correct: true, explanation: 'Ook een fout van hem staat daarna in het systeem als iets wat jij gedaan hebt.' },
          { text: 'Omdat je dan zelf een nieuw wachtwoord moet gaan aanvragen.', correct: false, misconception: 'Denkt dat delen alleen extra werk oplevert, en geen risico.' }
        ],
        feedback: 'Jouw account is jouw naam. Helpen kan prima zonder dat je je sleutel weggeeft.'
      },
      {
        prompt: 'Je stuurt een mail aan een docent die je nog niet kent. Wat zet je in het onderwerp?',
        leerdoel: LD_1_3[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Kort waar je mail over gaat, in een paar woorden.', correct: true, explanation: 'Je docent ziet in zijn postvak alleen de onderwerpregels en weet dan meteen wat er speelt.' },
          { text: 'Je eigen naam en klas, zodat hij weet van wie de mail komt.', correct: false, misconception: 'Denkt dat het onderwerp bedoeld is om jezelf voor te stellen.' },
          { text: 'Een vriendelijke groet, want zo begin je netjes aan je bericht.', correct: false, misconception: 'Verwart het onderwerp met de aanhef in het bericht zelf.' },
          { text: 'Het woord belangrijk, zodat hij je mail als eerste openmaakt.', correct: false, misconception: 'Denkt dat aandacht vragen belangrijker is dan duidelijk zijn.' }
        ],
        feedback: 'Een goed onderwerp is kort en zegt precies waar het over gaat. Bijvoorbeeld: vraag over de toets van 12 oktober.'
      },
      {
        prompt: 'Je hebt je mail getypt en wilt hem versturen. Waar let je nog even op voordat je klikt?',
        leerdoel: LD_1_3[1],
        denkniveau: 'maken_controleren',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Of je bericht kort genoeg is, want lange mails leest niemand.', correct: false, misconception: 'Denkt dat lengte het belangrijkste is bij het nakijken.' },
          { text: 'Of er emoji in staan, want die maken je bericht vriendelijker.', correct: false, misconception: 'Past de stijl van een appje toe op een mail aan een docent.' },
          { text: 'Of je het lettertype hebt aangepast zodat het beter leesbaar is.', correct: false, misconception: 'Denkt dat opmaak belangrijker is dan de onderdelen van je bericht.' },
          { text: 'Of je aanhef en je afsluiting erin staan, met hoofdletters en punten.', correct: true, explanation: 'Dat zijn precies de onderdelen die een schoolmail netjes maken.' }
        ],
        feedback: 'Controleer altijd de bovenkant en de onderkant van je bericht. Daar gaat het meestal mis.'
      },
      {
        prompt: 'Je typt bij Aan de achternaam Peeters en er verschijnen drie namen onder elkaar. Wat doe je?',
        leerdoel: LD_1_3[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je klikt de bovenste aan, want die staat er meestal niet voor niets.', correct: false, misconception: 'Denkt dat de eerste suggestie altijd de juiste is.' },
          { text: 'Je kijkt naar de voorletter van jouw docent en kiest die regel.', correct: true, explanation: 'Op een grote school werken vaak meer mensen met precies dezelfde achternaam.' },
          { text: 'Je stuurt de mail naar alle drie, dan komt hij zeker goed aan.', correct: false, misconception: 'Denkt dat rondsturen veiliger is dan één keer goed kiezen.' },
          { text: 'Je typt het adres zelf helemaal opnieuw in het vakje Aan.', correct: false, misconception: 'Denkt dat zelf typen betrouwbaarder is dan het adresboek.' }
        ],
        feedback: 'Twijfel je nog? Kijk dan in SOMtoday of ItsLearning welke voorletter bij jouw docent hoort.'
      },
      {
        prompt: 'Uit welke vier stukken bestaat digitale geletterdheid?',
        leerdoel: LD_1_4[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Typen, rekenen, presenteren en programmeren met blokken.', correct: false, misconception: 'Noemt vaardigheden die je op school leert, maar niet deze indeling.' },
          { text: 'Veilig internetten, mailen, informatie zoeken en je eigen bestanden opslaan in de cloud.', correct: false, misconception: 'Noemt losse handelingen in plaats van de vier vakonderdelen.' },
          { text: 'Ict-basisvaardigheden, informatievaardigheden, mediawijsheid en computational thinking.', correct: true, explanation: 'Zo is het vak in heel Nederland ingedeeld, en die vier namen komen dit jaar steeds terug.' },
          { text: 'Hardware, software, internet en social media in het dagelijks leven.', correct: false, misconception: 'Noemt onderwerpen uit het vak in plaats van de vier stukken zelf.' }
        ],
        feedback: 'Onthoud ze aan de hand van je eigen werk: inloggen, zoeken, omgangsregels en stappenplannen.'
      },
      {
        prompt: 'In jullie groepsapp geldt de afspraak dat je geen foto van een klasgenoot doorstuurt. Hoe heet zo een afspraak?',
        leerdoel: LD_1_4[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een omgangsregel.', correct: true, explanation: 'Omgang betekent hoe je met elkaar omgaat, en die afspraak geldt online net zo hard.' },
          { text: 'Een schoolregel.', correct: false, misconception: 'Denkt dat elke afspraak van school komt in plaats van van de groep zelf.' },
          { text: 'Een privacywet over foto\'s van andere mensen.', correct: false, misconception: 'Verwart een afspraak in een groep met een wet van de overheid.' },
          { text: 'Een instelling in de app.', correct: false, misconception: 'Denkt dat een afspraak hetzelfde is als een knop in een app.' }
        ],
        feedback: 'Niemand schreef die afspraak op, en toch weet iedereen hem. Dat is precies wat een omgangsregel is.'
      },
      {
        prompt: 'Je gebruikt in je werkstuk een halve pagina tekst die je letterlijk van een website haalt. Wat zet je erbij?',
        leerdoel: LD_1_4[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De datum waarop je de tekst gevonden hebt op internet.', correct: false, misconception: 'Denkt dat de datum belangrijker is dan de maker van de tekst.' },
          { text: 'De naam van de zoekmachine waarmee je hem gevonden hebt.', correct: false, misconception: 'Denkt dat Google de bron is in plaats van de maker.' },
          { text: 'Niets, want de tekst stond gratis en open op internet.', correct: false, misconception: 'Denkt dat gratis lezen hetzelfde is als vrij gebruiken.' },
          { text: 'De bron, dus de persoon of organisatie die de tekst schreef.', correct: true, explanation: 'Zo ziet je docent wat van jou is en wat je van iemand anders overnam.' }
        ],
        feedback: 'Nog beter is het om zo een stuk in je eigen woorden op te schrijven. Dan snap je het zelf ook.'
      },
      {
        prompt: 'Je zegt tegen je docent dat je alles gedaan hebt. Waarom telt dat niet als bewijs?',
        leerdoel: LD_1_5[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat je docent alleen cijfers mag geven voor toetsen.', correct: false, misconception: 'Denkt dat het om een regel over beoordelen gaat.' },
          { text: 'Omdat je docent jouw werk dan niet zelf kan bekijken of nakijken.', correct: true, explanation: 'Bewijs is iets wat blijft staan en wat hij ook morgen nog kan openen.' },
          { text: 'Omdat je docent daar geen tijd voor heeft in de les.', correct: false, misconception: 'Denkt dat het aan de drukte van de docent ligt.' },
          { text: 'Omdat je het ook nog in de klas moet vertellen aan de rest.', correct: false, misconception: 'Denkt dat presenteren de vervanging is van bewijs leveren.' }
        ],
        feedback: 'Een schermafdruk, een ingeleverd bestand of een verstuurd bericht: dat is wat een ander kan nakijken.'
      },
      {
        prompt: 'Bij welk stuk van het vak hoort het wegen of een website te vertrouwen is?',
        leerdoel: LD_1_5[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Bij mediawijsheid.', correct: false, misconception: 'Rekent alles met een scherm tot mediawijsheid.' },
          { text: 'Bij de ict-basisvaardigheden.', correct: false, misconception: 'Kijkt naar de knoppen in plaats van naar wat je met de inhoud doet.' },
          { text: 'Bij de informatievaardigheden.', correct: true, explanation: 'Dat stuk gaat over zoeken en over beoordelen of een bron te vertrouwen is.' },
          { text: 'Bij computational thinking, dus in stappen werken.', correct: false, misconception: 'Herkent de stappen wel, maar mist dat het om de bron gaat.' }
        ],
        feedback: 'Zoeken en bronnen wegen horen bij informatievaardigheden. Dat deed je bij je informatiecentrum.'
      },
      {
        prompt: 'Om op het wifi van school te komen kies je eerst het netwerk van school. Daarna klik je op Verbinden en log je in met je schoolgegevens.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: true, explanation: 'Dat is de volgorde: netwerk kiezen, verbinden, inloggen en tot slot het certificaat vertrouwen.' },
          { text: 'Niet waar', correct: false, misconception: 'Denkt dat wifi op school zonder inloggen werkt, zoals thuis.' }
        ],
        leerdoel: LD_1_1[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'De volgorde blijft altijd hetzelfde, ook als een knop bij jou iets anders heet.'
      },
      {
        prompt: 'ItsLearning is de ELO van school. Wat betekent die afkorting ELO?',
        leerdoel: LD_1_1[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Elektronische leeromgeving.', correct: true, explanation: 'Het is de digitale plek waar al je vakken met hun materiaal naast elkaar staan.' },
          { text: 'Elektronisch leerlingoverzicht.', correct: false, misconception: 'Denkt dat de ELO hetzelfde is als het cijfersysteem.' },
          { text: 'Extra lesmateriaal online.', correct: false, misconception: 'Denkt dat de ELO alleen huiswerk bevat.' },
          { text: 'Eigen leeromgeving.', correct: false, misconception: 'Verwart de ELO met je persoonlijke opslag in OneDrive.' }
        ],
        feedback: 'Elektronische leeromgeving: daar deelt je docent materiaal en daar lever jij je werk in.'
      },
      {
        prompt: 'Een geknipt stukje scherm staat eerst op het klembord, dus je moet het daarna zelf nog ergens plakken.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: true, explanation: 'Plakken doe je met Ctrl en V, op de plek waar je cursor in je bestand staat.' },
          { text: 'Niet waar', correct: false, misconception: 'Denkt dat een geknipt beeld vanzelf als bestand wordt opgeslagen.' }
        ],
        leerdoel: LD_1_1[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Het klembord is een wachtruimte. Wat erin staat verdwijnt zodra je iets anders kopieert.'
      },
      {
        prompt: 'Een wachtwoord van twaalf tekens of meer is een goed begin voor een sterk wachtwoord.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: true, explanation: 'Elk teken dat je erbij zet, maakt het aantal mogelijkheden veel groter.' },
          { text: 'Niet waar', correct: false, misconception: 'Denkt dat acht tekens met vreemde tekens ertussen al genoeg is.' }
        ],
        leerdoel: LD_1_2[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Lengte doet het meeste werk. Vier losse woorden halen die twaalf tekens vanzelf.'
      },
      {
        prompt: 'Je bent je schoolwachtwoord vergeten en het is zaterdag. Wat doe je?',
        leerdoel: LD_1_2[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je gaat naar het wachtwoordportaal van school.', correct: true, explanation: 'Daar stel je zelf een nieuw wachtwoord in, ook buiten schooltijd.' },
          { text: 'Je vraagt een klasgenoot of je even zijn account mag gebruiken.', correct: false, misconception: 'Denkt dat lenen mag; alles komt dan op de naam van de ander.' },
          { text: 'Je wacht tot maandag en vraagt dan hulp aan de ICT-helpdesk.', correct: false, misconception: 'Kent de herstelroute niet en verliest daardoor het hele weekend.' },
          { text: 'Je maakt zelf een nieuw account aan.', correct: false, misconception: 'Denkt dat je zelf een tweede schoolaccount kunt maken.' }
        ],
        feedback: 'Het portaal is je nooddeur, en die staat het hele weekend open. Daarom maak je dat account meteen aan.'
      },
      {
        prompt: 'Een klasgenoot zegt: geef mij je wachtwoord even, dan lever ik jouw opdracht wel in. Wat doe je?',
        leerdoel: LD_1_2[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je geeft het, want hij helpt je alleen maar met je eigen schoolwerk.', correct: false, misconception: 'Denkt dat een goede bedoeling het delen van een wachtwoord veilig maakt.' },
          { text: 'Je geeft het en verandert je wachtwoord meteen daarna weer.', correct: false, misconception: 'Denkt dat snel wisselen de schade achteraf ongedaan maakt.' },
          { text: 'Je geeft het niet; je stuurt hem gewoon het bestand dat hij nodig heeft.', correct: true, explanation: 'Hij kan het bestand met zijn eigen account inleveren of aan jou teruggeven.' },
          { text: 'Je geeft het, zolang je docent daar van tevoren toestemming voor geeft.', correct: false, misconception: 'Denkt dat toestemming van een docent de regel opheft.' }
        ],
        feedback: 'Delen hoeft niet: het bestand kan gewoon van hand tot hand. Je sleutel blijft van jou.'
      },
      {
        prompt: 'Je hebt in Outlook op Nieuwe e-mail geklikt. Welke twee velden vul je in voordat je gaat typen?',
        leerdoel: LD_1_3[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Het veld Aan en daaronder het veld met het onderwerp.', correct: true, explanation: 'Die twee staan bovenin, buiten je bericht; de aanhef hoort pas in het bericht zelf.' },
          { text: 'Het veld met de datum en het veld met je eigen klas erin.', correct: false, misconception: 'Denkt dat een mail net als een brief bovenaan een datum krijgt.' },
          { text: 'Het veld voor de bijlage en het veld met je handtekening.', correct: false, misconception: 'Kent de knoppen wel, maar niet welke je altijd nodig hebt.' },
          { text: 'Het veld met de aanhef en het veld met de afsluiting eronder.', correct: false, misconception: 'Denkt dat aanhef en afsluiting eigen velden zijn in plaats van tekst.' }
        ],
        feedback: 'Bovenin staan Aan en onderwerp. Pas daaronder begint je bericht met de aanhef.'
      },
      {
        prompt: 'Een mail aan je docent schrijf je in dezelfde stijl als een appje aan een vriend.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: false, misconception: 'Denkt dat er online maar één toon bestaat, ongeacht wie er leest.' },
          { text: 'Niet waar', correct: true, explanation: 'Een docent kent jou nog niet en leest alleen je tekst, dus die moet alles duidelijk maken.' }
        ],
        leerdoel: LD_1_3[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'In een appje weet de ander al wie je bent. In een mail moet je tekst dat zelf vertellen.'
      },
      {
        prompt: 'Waarom typ je bij Aan liever de achternaam in dan een adres uit je hoofd?',
        leerdoel: LD_1_3[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat Outlook je bericht anders later verstuurt.', correct: false, misconception: 'Denkt dat er een technische straf staat op zelf typen.' },
          { text: 'Omdat je zo geen letter verkeerd kunt typen in het adres.', correct: true, explanation: 'Het adresboek van school vult het volledige adres voor je in en kiest de juiste persoon.' },
          { text: 'Omdat je docent dan een melding krijgt dat jij hem aan het zoeken bent.', correct: false, misconception: 'Denkt dat het adresboek de ander waarschuwt.' },
          { text: 'Omdat een schooladres elk jaar verandert.', correct: false, misconception: 'Denkt dat adressen jaarlijks vernieuwd worden.' }
        ],
        feedback: 'Eén verkeerde letter en je mail komt nergens aan. Het adresboek doet dat werk voor je.'
      },
      {
        prompt: 'Je vriend zegt: ik scroll de hele dag, dus ik ben digitaal geletterd. Wat klopt daarvan?',
        leerdoel: LD_1_4[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Dat klopt, want vlot met je telefoon omgaan is precies wat het betekent.', correct: false, misconception: 'Zet gebruiken gelijk aan begrijpen.' },
          { text: 'Dat klopt half; scrollen hoort erbij.', correct: false, misconception: 'Rekent scrollen mee als een vaardigheid die je op school leert.' },
          { text: 'Dat klopt niet: veilig en kritisch zijn horen er ook bij.', correct: true, explanation: 'Van scrollen leer je niet hoe je je gegevens beschermt of hoe je ziet wat verzonnen is.' },
          { text: 'Dat klopt niet, want digitale geletterdheid gaat alleen over je schoolwerk.', correct: false, misconception: 'Beperkt het vak tot verslagen en presentaties.' }
        ],
        feedback: 'Snel zijn met je device is één stukje. Veilig en kritisch zijn hoort er net zo hard bij.'
      },
      {
        prompt: 'Vier regels hangen bij jullie digitale ontmoetingsplek. Welke is een omgangsregel?',
        leerdoel: LD_1_4[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je moet dertien jaar zijn voor een account.', correct: false, misconception: 'Ziet een leeftijdsgrens van de app aan voor een afspraak tussen gebruikers.' },
          { text: 'Je scheldt hier niemand uit, ook niet als je heel erg boos bent.', correct: true, explanation: 'Deze regel zegt hoe je met een ánder omgaat, en dat is precies wat omgang betekent.' },
          { text: 'Je laptop moet elke ochtend helemaal opgeladen mee naar school komen.', correct: false, misconception: 'Verwart een schoolafspraak over spullen met een omgangsregel.' },
          { text: 'Je zit hier hooguit twee uur per dag.', correct: false, misconception: 'Denkt dat een regel over je eigen schermtijd ook over omgang gaat.' }
        ],
        feedback: 'Kijk naar wie de regel raakt. Gaat het over een ánder mens, dan is het een omgangsregel.'
      },
      {
        prompt: 'Waarom moet de bron erbij als je een stuk tekst letterlijk overneemt?',
        leerdoel: LD_1_4[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat je werkstuk anders niet af is.', correct: false, misconception: 'Zoekt de reden bij de techniek in plaats van bij de maker.' },
          { text: 'Omdat die tekst niet van jou is maar van iemand anders.', correct: true, explanation: 'De maker stak er werk in, en je docent ziet zo welk deel jij zelf bedacht hebt.' },
          { text: 'Omdat je werkstuk daardoor langer wordt en er beter uitziet.', correct: false, misconception: 'Denkt dat een bronvermelding vooral voor de vorm is.' },
          { text: 'Omdat de website je anders een boete per mail kan sturen.', correct: false, misconception: 'Denkt dat het om straf gaat in plaats van om eerlijk zijn.' }
        ],
        feedback: 'Het gaat om eerlijk zijn. Wat van een ander is, krijgt de naam van die ander erbij.'
      },
      {
        prompt: 'Je map is bijna af, maar het bewijs van je verstuurde mail ontbreekt nog. Wat doe je?',
        leerdoel: LD_1_5[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Je schrijft in je terugblik dat je die mail echt verstuurd hebt.', correct: false, misconception: 'Denkt dat een eigen verklaring hetzelfde is als bewijs.' },
          { text: 'Je stuurt de mail nog een keer, zodat hij weer bovenaan staat.', correct: false, misconception: 'Lost een ontbrekend bewijsstuk op met extra werk voor de docent.' },
          { text: 'Je opent Verzonden items en maakt daar alsnog een schermafdruk van.', correct: true, explanation: 'Elke verstuurde mail blijft in die map staan, met de datum en het onderwerp erbij.' },
          { text: 'Je laat dat stuk weg, want drie bewijsstukken zijn ook al genoeg.', correct: false, misconception: 'Denkt dat de controlelijst een keuzelijst is.' }
        ],
        feedback: 'Wat je ooit verstuurde staat er nog. Loop je map na met de controlelijst uit 1.5.'
      },
      {
        prompt: 'Wat betekent digitale geletterdheid voor jou persoonlijk? Noem één ding dat je nu kunt en in de zomer nog niet kon. Schrijf twee of drie zinnen.',
        type: 'open',
        leerdoel: LD_1_5[1],
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'reflecteren',
        modelAnswer: 'Voor mij betekent digitale geletterdheid dat ik zelf de baas ben over wat ik digitaal doe. Ik klik niet meer zomaar wat aan. In de zomer wist ik niet hoe ik een mail aan een docent moest schrijven. Nu weet ik welke onderdelen erin horen en stuur ik hem zelf. Ik weet ook hoe ik mijn wachtwoord veilig bewaar.',
        nakijkpunten: [
          'Noemt iets concreets dat de leerling nu kan en in de zomer nog niet kon.',
          'Geeft een eigen betekenis aan digitale geletterdheid, niet alleen de definitie uit het boek.',
          'Het antwoord telt twee of drie hele zinnen.'
        ],
        feedback: 'Er is hier geen goed of fout. Eén voorbeeld uit je eigen week zegt meer dan een hele definitie.'
      }
    ]
  }
};
