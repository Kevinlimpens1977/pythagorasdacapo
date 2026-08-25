// Verrijkingslaag hoofdstuk 1 - Starten en Account & Veilig.
//
// Dit bestand is het KOPIEERPATROON voor h2 t/m h5. Hoofdstuk 1 is inhoudelijk
// af: elke paragraaf heeft leerdoelen, twee verrijkte theorieblokken, een
// samenvatting en een volledige set toetsvragen. Wie hoofdstuk 2 gaat vullen,
// kopieert de structuur van een paragraaf hieronder en vervangt de inhoud.
//
// Per paragraafcode:
//   learningGoals: 2 of 3 korte zinnen die beginnen met "Je weet ..." of "Je kunt ...".
//   theorie: array met exact twee items, in dezelfde volgorde als de twee
//            theorieblokken van die paragraaf in de generator.
//     keyTerms:    2 tot 4 woorden die LETTERLIJK als los woord in die
//                  theorietekst staan; de leesopmaak zet ze vet.
//     exampleHtml: een uitgewerkt voorbeeld als vraag + antwoord. Het paneel
//                  zet zelf al het label "Voorbeeld" erboven.
//   samenvatting: de laatste leestekst voor de quiz of toets.
//     html:     2 of 3 zinnen die de begrippen van die paragraaf herhalen, elk
//               begrip letterlijk genoemd. Taalniveau B1, brugklas.
//     keyTerms: verplicht zodra html gevuld is; elk woord staat letterlijk in
//               die samenvatting. Een kernbegrip mag in de hele seed in
//               maximaal twee blokken staan (validator bewaakt dat).
//   vragen: de vragen van de afsluitquiz (paragraaf) of de hoofdstuktoets
//           (checkpoint 1.6). ONTBREEKT deze lijst, dan komt er geen quiz in de
//           leerlingroute: de generator zet dat blok op draft en noemt de
//           paragraaf in de lijst onderaan de run. Er worden nooit vragen
//           verzonnen.
//
// FORMAAT van een vraag
// ---------------------
// De veldnamen zijn gelijk aan die van de CMS-editor, zodat een vraag die in de
// app is gemaakt hier ongewijzigd in geplakt kan worden.
//
//   prompt        De vraag of stelling zoals de leerling hem leest. Verplicht.
//   type          'meerkeuze' | 'waar-niet-waar' | 'open'. Mag weg: de generator
//                 leidt het type af uit de vraag (options -> meerkeuze,
//                 waar -> waar-niet-waar, modelAnswer -> open). Nooit uit de
//                 volgorde. Een prompt die begint met wat/waarom/hoe/welke/
//                 wanneer/wie of eindigt op een vraagteken kan geen
//                 waar-niet-waar-stelling zijn; de generator weigert dat.
//   options       Gesloten vragen. 3 of 4 opties bij meerkeuze, elk met text en
//                 correct: true of false. Minstens een goede en minstens een
//                 foute. Optioneel per optie: explanation (waarom dit klopt) en
//                 misconception (welke denkfout hierachter zit).
//   waar          Korte vorm voor waar-niet-waar: true of false. De generator
//                 maakt dan zelf de opties Waar en Niet waar.
//   feedback      Wat de leerling na het antwoorden leest. Verplicht, minstens
//                 20 tekens, en per vraag anders. Dezelfde zin mag in hoogstens
//                 twee paragrafen staan.
//   modelAnswer   Open vragen: wat er in een goed antwoord staat.
//   nakijkpunten  Open vragen: 2 of 3 punten waar de docent op let. Ze komen als
//                 lijstje in het rubricveld van de nakijkstapel.
//   leerdoel      Een van de learningGoals hierboven, letterlijk overgetypt.
//                 De toetsmatrijs in de CMS groepeert hierop, dus een vraag
//                 zonder leerdoel telt daar als "Geen leerdoel gekoppeld".
//                 Uitzondering: een hoofdstuktoets (1.6) toetst het hele
//                 hoofdstuk, dus daar mag het leerdoel ook uit een eerdere
//                 paragraaf van datzelfde hoofdstuk komen. Zo laat de matrijs
//                 van de toets zien welke hoofdstukdoelen echt bevraagd worden.
//   denkniveau    Optioneel: herkennen | begrijpen | toepassen | uitleggen |
//                 maken_controleren. Standaard begrijpen (open: uitleggen).
//   niveau        Optioneel: basis | plus | verdieping. Standaard basis.
//   rol           Optioneel: ik_doe_voor | samen_oefenen | zelf_proberen |
//                 bewijs_leveren | reflecteren. Standaard zelf_proberen.
//                 Deze drie voeden samen met leerdoel de toetsmatrijs; laat je
//                 ze weg, dan lijkt elke vraag even zwaar.
//
// Verder bewaakt de generator: het goede antwoord staat niet in elke gesloten
// vraag van een blok op dezelfde plek, een quiz heeft minstens 3 vragen, een
// toets minstens 6, en een blok bestaat niet alleen uit open vragen.
//
// AFLEIDERS SCHRIJVEN
// -------------------
// Een foute optie is pas bruikbaar als een brugklasser hem echt kan kiezen.
// Schrijf dus geen onzin ("de website wordt trager van hetzelfde wachtwoord")
// maar de denkfout die je in de klas hoort ("ik hoef geen nieuwe map, ik weet
// zelf wel welk bestand het is"). Zet die denkfout er letterlijk bij in
// misconception: dan ziet de docent in de nakijkstapel niet alleen dat het fout
// was, maar ook waarom. Bij het goede antwoord hoort een explanation die
// uitlegt waarom dat antwoord klopt.
//
// Waar-niet-waar mag op twee manieren. De korte vorm (waar: true/false) is de
// standaard. Wil je de denkfout achter de foute knop vastleggen, schrijf dan
// type: 'waar-niet-waar' met precies twee opties Waar en Niet waar, in die
// volgorde; zie 1.2 vraag 2. De teksten moeten letterlijk Waar en Niet waar
// zijn, anders herkent de validator het paar niet.

export default {
  '1.1': {
    learningGoals: [
      'Je weet waarvoor je HELIX, OneDrive en Outlook gebruikt.',
      'Je kunt met je schoolaccount inloggen en je schoolwerk terugvinden.',
      'Je kunt bewijs van je werk opslaan in een eigen map.'
    ],
    theorie: [
      {
        keyTerms: ['schoolaccount', 'HELIX', 'OneDrive', 'Outlook'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Noa krijgt een bericht van haar mentor. Daarna moet ze de opdracht van vandaag openen. Welke twee plekken heeft ze nodig?</p>',
          '<p><strong>Antwoord.</strong> Eerst Outlook, want daar komt het bericht binnen. Daarna HELIX, want daar staan de lessen en opdrachten. Met haar schoolaccount komt ze op allebei binnen.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['vaste map', 'Word-bestand', 'schoolwerk'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Tim slaat zijn eerste opdracht op met de naam nieuw. Een week later kan hij hem niet meer vinden. Wat ging er mis?</p>',
          '<p><strong>Antwoord.</strong> De naam zegt niets over de opdracht, en het bestand staat niet in een vaste map. Beter: een map voor dit vak, met daarin les1-schooltas-tim-1a.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Met je schoolaccount kom je binnen bij HELIX, OneDrive en Outlook. Elke plek heeft een eigen taak: mail in Outlook, bestanden in OneDrive en je lessen in HELIX. Je schoolwerk zet je in een vaste map, zodat je het volgende week nog terugvindt.</p>',
      keyTerms: ['schoolaccount', 'HELIX', 'schoolwerk']
    },
    vragen: [
      {
        prompt: 'Je maakt je werkstuk thuis af en morgen moet je het op school laten zien. Waar zet je het bestand neer?',
        leerdoel: 'Je kunt met je schoolaccount inloggen en je schoolwerk terugvinden.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        options: [
          { text: 'Op het bureaublad van de computer thuis.', correct: false, misconception: 'Denkt dat een bestand vanzelf meereist met de leerling.' },
          { text: 'Op een USB-stick in je etui.', correct: false, misconception: 'Vertrouwt op een stick die je kunt vergeten, verliezen of thuis laten liggen.' },
          { text: 'In de map Downloads van de computer in het lokaal.', correct: false, misconception: 'Verwart een tijdelijke map met een bewaarplek.' },
          { text: 'In OneDrive, in de map van dit vak.', correct: true, explanation: 'OneDrive staat in de cloud, dus je opent het bestand op elk apparaat waarop je inlogt.' }
        ],
        feedback: 'OneDrive staat in de cloud. Daardoor open je hetzelfde bestand thuis en op school, zolang je met je schoolaccount inlogt.'
      },
      {
        prompt: 'Met je schoolaccount log je alleen in bij Outlook; voor HELIX heb je een apart account nodig.',
        waar: false,
        leerdoel: 'Je weet waarvoor je HELIX, OneDrive en Outlook gebruikt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        feedback: 'Een schoolaccount is een sleutelbos: dezelfde inlog opent HELIX, OneDrive en Outlook.'
      },
      {
        prompt: 'Je mentor stuurt een bericht over de excursie van volgende week. Waar lees je dat bericht?',
        leerdoel: 'Je weet waarvoor je HELIX, OneDrive en Outlook gebruikt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        options: [
          { text: 'In Outlook.', correct: true, explanation: 'Berichten van school komen binnen in de mail van je schoolaccount.' },
          { text: 'In OneDrive, bij je bestanden.', correct: false, misconception: 'Denkt dat de opslagplek ook de berichtenplek is.' },
          { text: 'In HELIX bij de opdrachten.', correct: false, misconception: 'Verwart lesmateriaal met communicatie.' },
          { text: 'In de appgroep van je klas.', correct: false, misconception: 'Denkt dat school officiële berichten ook via privé-apps stuurt.' }
        ],
        feedback: 'Berichten lees je in Outlook. OneDrive is voor bestanden en HELIX voor je lessen en opdrachten.'
      },
      {
        prompt: 'Leg uit waarom je een vaste map voor dit vak maakt in plaats van alles los op te slaan.',
        type: 'open',
        leerdoel: 'Je kunt bewijs van je werk opslaan in een eigen map.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'reflecteren',
        modelAnswer: 'In een vaste map staat al mijn werk voor dit vak bij elkaar. Ik hoef niet te zoeken en ik raak minder snel iets kwijt. Mijn docent kan ook sneller zien wat ik gemaakt heb.',
        nakijkpunten: [
          'Noemt dat het werk bij elkaar staat en dus terug te vinden is.',
          'Noemt een nadeel van los opslaan, bijvoorbeeld kwijtraken of lang zoeken.',
          'Antwoordt in eigen woorden en in hele zinnen.'
        ],
        feedback: 'Een vaste map is geen extra werk maar tijdwinst: volgende week zoek je niet meer waar je bestand gebleven is.'
      },
      {
        prompt: 'Wat doe je als inloggen op je schoolaccount niet lukt?',
        leerdoel: 'Je kunt met je schoolaccount inloggen en je schoolwerk terugvinden.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        options: [
          { text: 'Steeds hetzelfde wachtwoord opnieuw proberen tot het lukt.', correct: false, misconception: 'Denkt dat volhouden helpt bij een accountprobleem.' },
          { text: 'Het account van een klasgenoot lenen.', correct: false, misconception: 'Ziet niet dat een geleend account het probleem verplaatst en niet mag.' },
          { text: 'Het melden bij je docent, mentor of de ICT-helpdesk van school.', correct: true, explanation: 'School kan je account herstellen; jij kunt dat zelf niet.' },
          { text: 'Zelf een nieuw account maken met je privé-mailadres.', correct: false, misconception: 'Denkt dat je je eigen schoolaccount kunt aanmaken.' }
        ],
        feedback: 'Bij inlogproblemen vraag je hulp op school. Het account van een ander gebruiken mag niet, ook niet als het even handig lijkt.'
      }
    ]
  },

  '1.2': {
    learningGoals: [
      'Je weet waarom een lang en uniek wachtwoord veiliger is.',
      'Je kunt een sterke wachtwoordzin bedenken zonder je eigen gegevens.',
      'Je weet wat je doet als je wachtwoord gelekt of vergeten is.'
    ],
    theorie: [
      {
        keyTerms: ['wachtwoord', 'wachtwoordzin', 'uniek', 'gehackt'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Welke is sterker: Rex2011! of paarse fiets zoekt kaas?</p>',
          '<p><strong>Antwoord.</strong> De tweede. Rex2011! lijkt moeilijk, maar het is de naam van een huisdier met een jaartal erachter. Dat kan iemand raden. De vier woorden zijn veel langer en horen niet bij jou.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['wachtwoord', 'gelekt', 'herstelroute', 'nepwachtwoorden'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Iemand mailt: ik ben van de ICT-helpdesk, stuur je wachtwoord even terug. Wat doe je?</p>',
          '<p><strong>Antwoord.</strong> Niet terugsturen. De school vraagt nooit om je echte wachtwoord. Je meldt het bericht bij je docent of mentor. Moet je zelf een nieuw wachtwoord, dan gebruik je de officiële herstelroute.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een sterk wachtwoord is vooral lang en uniek: een wachtwoordzin van meerdere woorden is beter dan een kort moeilijk woord. Je deelt je wachtwoord nooit, ook niet met een vriend, en je gebruikt niet overal hetzelfde. Is het gelekt of vergeten, dan neem je de herstelroute van school.</p>',
      keyTerms: ['uniek', 'wachtwoordzin', 'herstelroute']
    },
    vragen: [
      {
        prompt: 'Welk nepwachtwoord is het sterkst?',
        leerdoel: 'Je kunt een sterke wachtwoordzin bedenken zonder je eigen gegevens.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        options: [
          { text: 'Rex2011!', correct: false, misconception: 'Ziet een uitroepteken aan voor sterkte, terwijl dit een huisdiernaam met jaartal is.' },
          { text: 'paarse fiets zoekt kaas', correct: true, explanation: 'Vier gewone woorden zijn veel langer en hebben niets met de leerling te maken.' },
          { text: 'Wachtwoord123', correct: false, misconception: 'Denkt dat cijfers achter een woord genoeg zijn.' },
          { text: 'Qwerty2026', correct: false, misconception: 'Denkt dat een rij toetsen van het toetsenbord willekeurig overkomt.' }
        ],
        feedback: 'Lengte wint van rare tekens. Vier gewone woorden zijn langer dan een naam met een jaartal, en ze horen niet bij jou.'
      },
      {
        // Lange vorm van waar-niet-waar: precies twee opties, Waar eerst. Zo kun
        // je vastleggen welke denkfout achter de foute knop zit.
        prompt: 'Een docent of ICT-medewerker mag jou om je echte wachtwoord vragen als er iets kapot is.',
        type: 'waar-niet-waar',
        leerdoel: 'Je weet wat je doet als je wachtwoord gelekt of vergeten is.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        options: [
          { text: 'Waar', correct: false, misconception: 'Denkt dat school het wachtwoord nodig heeft om te kunnen helpen.' },
          { text: 'Niet waar', correct: true, explanation: 'School kan altijd helpen zonder jouw wachtwoord; ernaar vragen is juist een alarmsignaal.' }
        ],
        feedback: 'School vraagt nooit om je echte wachtwoord. Gebeurt het toch, dan is dat juist een reden om het te melden.'
      },
      {
        prompt: 'Waarom is hetzelfde wachtwoord voor school, je game-account en je mail een risico?',
        leerdoel: 'Je weet waarom een lang en uniek wachtwoord veiliger is.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        options: [
          { text: 'Als één site gehackt wordt, kan iemand meteen bij al je accounts.', correct: true, explanation: 'Eén lek opent dan alle deuren tegelijk.' },
          { text: 'Je vergeet het wachtwoord dan sneller.', correct: false, misconception: 'Denkt dat het probleem het onthouden is.' },
          { text: 'Je mag van school maar één wachtwoord per website gebruiken.', correct: false, misconception: 'Zoekt de reden in een schoolregel in plaats van in het risico.' }
        ],
        feedback: 'Eén gelekt wachtwoord opent dan alle deuren. Daarom is elk wachtwoord uniek, ook al kost dat even moeite.'
      },
      {
        prompt: 'Je hoort dat een website waar jij een account hebt gehackt is. Beschrijf wat je doet.',
        type: 'open',
        leerdoel: 'Je weet wat je doet als je wachtwoord gelekt of vergeten is.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'reflecteren',
        modelAnswer: 'Ik verander meteen het wachtwoord van die site. Gebruikte ik hetzelfde wachtwoord ergens anders, dan verander ik het daar ook. Gaat het om mijn schoolaccount, dan gebruik ik de herstelroute van school of vraag ik hulp.',
        nakijkpunten: [
          'Noemt dat het wachtwoord veranderd wordt.',
          'Noemt de andere accounts met hetzelfde wachtwoord.',
          'Noemt hulp vragen of de herstelroute van school.'
        ],
        feedback: 'Bij een lek is snel handelen belangrijker dan je schamen. Veranderen en melden is precies de goede reactie.'
      },
      {
        prompt: 'Wat maakt een wachtwoordzin veilig?',
        leerdoel: 'Je kunt een sterke wachtwoordzin bedenken zonder je eigen gegevens.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        options: [
          { text: 'Dat je je geboortedatum erin verwerkt.', correct: false, misconception: 'Denkt dat persoonlijke gegevens iets moeilijker maken, terwijl ze juist te raden zijn.' },
          { text: 'Dat je hem opslaat in de notities van je telefoon.', correct: false, misconception: 'Verwart een bewaarplek met de sterkte van het wachtwoord zelf.' },
          { text: 'Dat hij lang is en uit woorden bestaat die niets met jou te maken hebben.', correct: true, explanation: 'Lengte plus onvoorspelbaarheid maakt raden zinloos.' }
        ],
        feedback: 'Een wachtwoordzin is veilig door lengte en doordat niemand hem aan jou kan koppelen.'
      }
    ]
  },

  '1.3': {
    learningGoals: [
      'Je weet het verschil tussen hardware en software.',
      'Je kunt uitleggen waarom updates je device veiliger maken.',
      'Je weet welke instellingen je zelf aanpast en welke niet.'
    ],
    theorie: [
      {
        keyTerms: ['hardware', 'software', 'Windows', 'browser'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je muis beweegt niet meer. Je klasgenoot zegt: dan moet je de browser opnieuw opstarten. Klopt dat?</p>',
          '<p><strong>Antwoord.</strong> Nee. Een muis is hardware, dus je controleert eerst de kabel, de batterij of de verbinding. De browser is software en heeft hier niets mee te maken.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['instellingen', 'updates', 'wifi', 'device'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je laptop vraagt al twee weken om een update. Je klikt steeds op later, want je hebt haast. Wat is daar het risico van?</p>',
          '<p><strong>Antwoord.</strong> Updates lossen fouten op en dichten gaten in de beveiliging. Blijf je uitstellen, dan wordt je device onveiliger. Plan de update op een moment dat je niet aan het werk bent, bijvoorbeeld in de pauze.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Hardware is alles wat je kunt vastpakken, software is het programma dat erop draait. Een update repareert gaten in de software, daarom stel je hem niet steeds uit.</p>',
      keyTerms: ['hardware', 'software', 'update']
    },
    vragen: [
      {
        prompt: 'Welk onderdeel is hardware?',
        leerdoel: 'Je weet het verschil tussen hardware en software.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        options: [
          { text: 'Het toetsenbord.', correct: true, explanation: 'Je kunt het vastpakken, dus het is hardware.' },
          { text: 'Windows.', correct: false, misconception: 'Denkt dat het besturingssysteem bij het apparaat zelf hoort.' },
          { text: 'De browser.', correct: false, misconception: 'Verwart een programma dat je ziet met een apparaat dat je voelt.' },
          { text: 'De virusscanner.', correct: false, misconception: 'Denkt dat beveiliging een onderdeel is dat in het apparaat gebouwd zit.' }
        ],
        feedback: 'Hardware kun je aanraken. Windows, de browser en de virusscanner zijn software: programma’s die op het apparaat draaien.'
      },
      {
        prompt: 'Een update stel je beter niet eindeloos uit, omdat updates fouten oplossen en je device veiliger maken.',
        waar: true,
        leerdoel: 'Je kunt uitleggen waarom updates je device veiliger maken.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        feedback: 'Uitstellen laat gaten in de beveiliging openstaan. Plan de update liever op een moment dat je niet met schoolwerk bezig bent.'
      },
      {
        prompt: 'Je krijgt tijdens de les een onbekende melding met de knop Nu installeren. Wat doe je?',
        leerdoel: 'Je weet welke instellingen je zelf aanpast en welke niet.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        options: [
          { text: 'Meteen op Nu installeren klikken.', correct: false, misconception: 'Gaat ervan uit dat elke melding op een schoolcomputer veilig is.' },
          { text: 'De melding wegklikken en er niets over zeggen.', correct: false, misconception: 'Denkt dat wegklikken hetzelfde is als oplossen.' },
          { text: 'De melding laten staan en je docent vragen wat het is.', correct: true, explanation: 'De docent kan meekijken zolang de melding nog in beeld staat.' }
        ],
        feedback: 'Bij een onbekende melding klik je niet, maar vraag je. Een screenshot maken helpt je docent om mee te kijken.'
      },
      {
        prompt: 'Leg het verschil uit tussen hardware en software. Geef van allebei een voorbeeld.',
        type: 'open',
        leerdoel: 'Je weet het verschil tussen hardware en software.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        modelAnswer: 'Hardware is het deel dat je kunt aanraken, zoals het scherm of het toetsenbord. Software zijn de programma’s die daarop draaien, zoals Windows of Word. Samen zorgen ze dat je kunt typen, opslaan en printen.',
        nakijkpunten: [
          'Zegt dat hardware tastbaar is en software niet.',
          'Geeft van allebei een voorbeeld dat klopt.',
          'Legt uit dat hardware en software samenwerken.'
        ],
        feedback: 'Het verschil zit in aanraken: kun je het vasthouden, dan is het hardware; draait het erop, dan is het software.'
      },
      {
        prompt: 'Welke instelling mag je zonder overleg zelf aanpassen?',
        leerdoel: 'Je weet welke instellingen je zelf aanpast en welke niet.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        options: [
          { text: 'De beveiligingsinstellingen van de schoolcomputer.', correct: false, misconception: 'Denkt dat toegang hebben hetzelfde is als mogen wijzigen.' },
          { text: 'Het beheerderswachtwoord van het apparaat.', correct: false, misconception: 'Ziet niet dat beheerdersrechten voor de hele school gelden.' },
          { text: 'De wifi-instellingen van het schoolnetwerk.', correct: false, misconception: 'Denkt dat wifi op school net zo van jou is als de wifi thuis.' },
          { text: 'Het volume van je eigen koptelefoon.', correct: true, explanation: 'Dit raakt alleen jouw eigen gebruik en niets in de beveiliging.' }
        ],
        feedback: 'Je eigen geluid of helderheid mag je regelen. Van beveiliging, wifi en beheerdersinstellingen blijf je af.'
      }
    ]
  },

  '1.4': {
    learningGoals: [
      'Je weet het verschil tussen een bestand op je apparaat en in de cloud.',
      'Je kunt een mappenstructuur maken voor vak, hoofdstuk en opdracht.',
      'Je kunt bestandsnamen kiezen waarmee je je werk terugvindt.'
    ],
    theorie: [
      {
        keyTerms: ['lokaal', 'cloud', 'cloudopslag'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sam maakt op school zijn opdracht af en slaat hem lokaal op het bureaublad op. Thuis wil hij verder werken. Lukt dat?</p>',
          '<p><strong>Antwoord.</strong> Nee, het bestand staat alleen op die ene schoolcomputer. Had hij het in OneDrive gezet, dan kon hij er thuis gewoon bij.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['structuur', 'bestandsnamen', 'lesnummer'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Verbeter deze bestandsnaam: versie2echtklaar.docx.</p>',
          '<p><strong>Antwoord.</strong> Zet erin wat het is en van wie: les4-mappen-sam-1c.docx. Nu weten jij en je docent na een maand nog steeds welke opdracht dit is.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een bestand staat lokaal op je apparaat of in de cloud. Zet je het in OneDrive, dan vind je je werk op school en thuis terug, maar alleen met een vaste structuur van vak, hoofdstuk en opdracht. Duidelijke bestandsnamen zorgen dat je na een maand nog weet welk bestand je nodig hebt.</p>',
      keyTerms: ['cloud', 'structuur', 'bestandsnamen']
    },
    vragen: [
      {
        prompt: 'Welke bestandsnaam vind je over drie weken het snelst terug?',
        leerdoel: 'Je kunt bestandsnamen kiezen waarmee je je werk terugvindt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        options: [
          { text: 'opdracht2 definitief echt klaar.docx', correct: false, misconception: 'Beschrijft de staat van het werk in plaats van de inhoud.' },
          { text: 'les4-bestandsnamen-noa-1a.docx', correct: true, explanation: 'Les, onderwerp, naam en klas staan erin; je hoeft het bestand niet te openen.' },
          { text: 'nieuw (1).docx', correct: false, misconception: 'Laat de standaardnaam van het programma staan.' },
          { text: 'huiswerk.docx', correct: false, misconception: 'Denkt dat één algemeen woord genoeg is omdat je zelf toch wel weet welk bestand het is.' }
        ],
        feedback: 'Een goede naam vertelt zonder openen wat erin zit: de les, het onderwerp, je naam en je klas.'
      },
      {
        prompt: 'Een bestand kopiëren en een bestand verplaatsen komt op hetzelfde neer.',
        waar: false,
        leerdoel: 'Je kunt een mappenstructuur maken voor vak, hoofdstuk en opdracht.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        feedback: 'Na kopiëren staat het bestand op twee plekken, na verplaatsen op één. Dat verschil verklaart de meeste zoekacties.'
      },
      {
        prompt: 'Waarom bewaar je schoolwerk in OneDrive en niet alleen op de computer in het lokaal?',
        leerdoel: 'Je weet het verschil tussen een bestand op je apparaat en in de cloud.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        options: [
          { text: 'Omdat een bestand in OneDrive daarna nooit meer kwijt kan raken.', correct: false, misconception: 'Denkt dat de cloud ook slordig opslaan en rommelige namen repareert.' },
          { text: 'Omdat je op een schoolcomputer geen bestanden mag opslaan.', correct: false, misconception: 'Denkt aan een verbod in plaats van aan bereikbaarheid.' },
          { text: 'Omdat je bestanden dan in de cloud staan en je er thuis ook bij kunt.', correct: true, explanation: 'De cloud maakt je werk los van één apparaat.' }
        ],
        feedback: 'De cloud maakt je werk plaats-onafhankelijk. Op één vaste computer ben je je bestand kwijt zodra je ergens anders zit.'
      },
      {
        prompt: 'Beschrijf hoe jij je map voor dit vak indeelt. Noem minstens twee niveaus.',
        type: 'open',
        leerdoel: 'Je kunt een mappenstructuur maken voor vak, hoofdstuk en opdracht.',
        denkniveau: 'maken_controleren',
        niveau: 'plus',
        modelAnswer: 'Ik maak eerst een map Digitale Vaardigheden. Daarin maak ik een map per hoofdstuk, bijvoorbeeld H1 Starten en Account & Veilig. Daarin komt een map Inleverbestanden met mijn opdrachten.',
        nakijkpunten: [
          'Noemt een vaste hoofdmap voor het vak.',
          'Noemt minstens één onderverdeling, bijvoorbeeld per hoofdstuk of opdracht.',
          'De indeling is logisch en navolgbaar voor iemand anders.'
        ],
        feedback: 'Een map in een map werkt als een kast met laden: hoe duidelijker de indeling, hoe minder je zoekt.'
      },
      {
        prompt: 'Je hebt drie versies van hetzelfde werkstuk. Welke aanpak houdt het overzichtelijk?',
        leerdoel: 'Je kunt bestandsnamen kiezen waarmee je je werk terugvindt.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        options: [
          { text: 'Noem ze versie2, versie2echt en versie2echtklaar.', correct: false, misconception: 'Bedenkt per keer een nieuwe naam zonder vaste regel.' },
          { text: 'Bewaar alleen de laatste en gooi de rest meteen weg.', correct: false, misconception: 'Ziet niet dat een oudere versie soms nog nodig is.' },
          { text: 'Zet elke versie in een eigen map en laat de bestandsnaam hetzelfde.', correct: false, misconception: 'Verplaatst het probleem naar de mappen; buiten de map zie je nog steeds niets.' },
          { text: 'Zet de datum in de naam, bijvoorbeeld werkstuk-2026-09-12.', correct: true, explanation: 'Met een datum zie je meteen welke versie de nieuwste is.' }
        ],
        feedback: 'Met een datum in de naam zie je in één blik welke versie de nieuwste is, zonder alle bestanden te openen.'
      }
    ]
  },

  '1.5': {
    learningGoals: [
      'Je weet wat phishing is en waarom het werkt.',
      'Je kunt rode vlaggen in een verdacht bericht aanwijzen.',
      'Je weet wat je doet bij twijfel en wie je om hulp vraagt.'
    ],
    theorie: [
      {
        keyTerms: ['phishing', 'afzenders', 'haast', 'bijlagen'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je krijgt een bericht: je schoolaccount wordt binnen 24 uur gesloten, klik hier om dit te voorkomen. Welke twee rode vlaggen zie je?</p>',
          '<p><strong>Antwoord.</strong> De haast (binnen 24 uur) en de dreiging (je account gaat dicht). Zo willen ze dat je snel klikt zonder na te denken. Dit is phishing.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['afzender', 'link', 'screenshot', 'melden'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Het bericht lijkt van school, maar het mailadres eindigt op -school-support.info. Wat doe je?</p>',
          '<p><strong>Antwoord.</strong> Niet klikken en de bijlage niet openen. Je maakt een screenshot en laat het bericht zien aan je docent of mentor. Melden is slim, geen blunder.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Phishing is een truc om jouw gegevens of geld te krijgen. Je herkent het aan haast, dreiging, spelfouten en een afzender die niet klopt. Klik niet op de link, open geen bijlage en ga melden bij je docent of mentor.</p>',
      keyTerms: ['phishing', 'haast', 'melden']
    },
    vragen: [
      {
        prompt: 'Een mail zegt: je account wordt binnen 24 uur gesloten, klik hier om dat te voorkomen. Wat is hier de rode vlag?',
        leerdoel: 'Je kunt rode vlaggen in een verdacht bericht aanwijzen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        options: [
          { text: 'Dat de mail over een account gaat.', correct: false, misconception: 'Vindt het onderwerp verdacht in plaats van de manier van vragen.' },
          { text: 'Dat er een link in de mail staat.', correct: false, misconception: 'Denkt dat elke link phishing is.' },
          { text: 'Dat er haast wordt gemaakt met een dreiging.', correct: true, explanation: 'Druk zorgt dat je klikt voordat je nadenkt; dat is precies de bedoeling.' },
          { text: 'Dat de mail in goed Nederlands geschreven is.', correct: false, misconception: 'Denkt dat phishing altijd te herkennen is aan slechte taal.' }
        ],
        feedback: 'Haast en dreiging zijn de motor van phishing: wie snel klikt, denkt niet na. Links en accounts zijn op zichzelf niet verdacht.'
      },
      {
        prompt: 'Een bericht dat er netjes uitziet en geen spelfouten heeft, is daarom veilig.',
        waar: false,
        leerdoel: 'Je weet wat phishing is en waarom het werkt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        feedback: 'Ook een verzorgd bericht kan phishing zijn. Je kijkt naar de afzender en waar de link heen gaat, niet naar de opmaak.'
      },
      {
        prompt: 'Een onbekende afzender stuurt je een bijlage met de naam factuur.zip. Wat doe je?',
        leerdoel: 'Je weet wat je doet bij twijfel en wie je om hulp vraagt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        options: [
          { text: 'Niet openen en het bericht laten zien aan je docent of mentor.', correct: true, explanation: 'Melden kost niets en voorkomt schade.' },
          { text: 'Openen om te kijken of het klopt.', correct: false, misconception: 'Denkt dat kijken zonder klikken kan bij een bijlage.' },
          { text: 'Doorsturen naar een klasgenoot om te vragen wat het is.', correct: false, misconception: 'Verplaatst het risico naar iemand anders.' },
          { text: 'De bijlage alvast downloaden en later beslissen.', correct: false, misconception: 'Denkt dat downloaden nog geen risico is zolang je het bestand niet opent.' }
        ],
        feedback: 'Een onbekende bijlage open je niet en stuur je niet door. Melden is slim, geen blunder.'
      },
      {
        prompt: 'Noem drie signalen waaraan je een phishingbericht kunt herkennen.',
        type: 'open',
        leerdoel: 'Je kunt rode vlaggen in een verdacht bericht aanwijzen.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        modelAnswer: 'Een afzender die niet klopt, haast of dreiging in de tekst, en een link die ergens anders heen gaat dan hij belooft. Ook een onverwachte bijlage, een prijs die je niet gewonnen kunt hebben en veel spelfouten zijn signalen.',
        nakijkpunten: [
          'Noemt drie verschillende signalen.',
          'De signalen komen uit de les en zijn geen gok.',
          'Beschrijft de signalen in eigen woorden.'
        ],
        feedback: 'Drie signalen zijn genoeg om te twijfelen. Twijfel is het moment waarop je stopt en het aan iemand laat zien.'
      },
      {
        prompt: 'Wat is je eerste stap als je twijfelt over een bericht?',
        leerdoel: 'Je weet wat je doet bij twijfel en wie je om hulp vraagt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        options: [
          { text: 'Op de link klikken om te zien waar hij heen gaat.', correct: false, misconception: 'Denkt dat je een link veilig kunt uitproberen.' },
          { text: 'Stoppen, niet klikken en het bericht aan iemand op school laten zien.', correct: true, explanation: 'Stoppen houdt alle opties open, ook melden.' },
          { text: 'Het bericht meteen verwijderen zodat niemand het ziet.', correct: false, misconception: 'Wil het probleem laten verdwijnen in plaats van het te melden.' }
        ],
        feedback: 'Stoppen kost tien seconden. Klikken kan je account kosten, en weggooien maakt melden onmogelijk.'
      }
    ]
  },

  '1.6': {
    learningGoals: [
      'Je kunt zelfstandig inloggen, opslaan en mailen met je schoolaccount.',
      'Je kunt bewijs van je werk verzamelen en inleveren.',
      'Je weet wanneer je stopt en hulp vraagt bij iets verdachts.'
    ],
    theorie: [
      {
        keyTerms: ['account', 'device', 'veiligheid', 'digitaal vaardig'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Een klasgenoot zegt: ik kan alles vinden, maar ik weet niet meer waar mijn opdracht van vorige week staat. Is hij digitaal vaardig?</p>',
          '<p><strong>Antwoord.</strong> Nog niet helemaal. Inloggen lukt, maar terugvinden hoort er ook bij. Met een vaste map in OneDrive en duidelijke namen lost hij dat op.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['checkpoint', 'bewijs', 'Outlook-mail'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je levert een screenshot in van een leeg scherm met alleen het woord Checkpoint1. Is dat genoeg bewijs?</p>',
          '<p><strong>Antwoord.</strong> Nee. Op de screenshot moet te zien zijn dat de map bestaat en welk bestand erin staat. Anders kan je docent niet controleren of je het echt gedaan hebt.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>In deze checkpoint laat je zien dat je zelfstandig kunt inloggen, opslaan, mailen en veilig kiezen. Je levert bewijs in: een map, een Word-bestand, een screenshot en een nette Outlook-mail. Weet je iets niet zeker, dan stop je en vraag je hulp.</p>',
      keyTerms: ['checkpoint', 'zelfstandig', 'Outlook-mail']
    },
    // Hoofdstuktoets: de leerdoelen komen uit het hele hoofdstuk, niet alleen
    // uit 1.6. Zo laat de toetsmatrijs zien welke doelen van H1 echt getoetst
    // worden en welke alleen in de paragraafquiz zijn langsgekomen.
    vragen: [
      {
        prompt: 'Je zit in de mediatheek achter een andere computer en wilt verder aan je opdracht van gisteren. Wat doe je?',
        leerdoel: 'Je kunt zelfstandig inloggen, opslaan en mailen met je schoolaccount.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        options: [
          { text: 'De opdracht opnieuw typen, want dit is een andere computer.', correct: false, misconception: 'Denkt dat een bestand vastzit aan het apparaat waarop het gemaakt is.' },
          { text: 'Een klasgenoot vragen of hij zijn versie doorstuurt.', correct: false, misconception: 'Lost een opslagprobleem op met het werk van iemand anders.' },
          { text: 'Hier een nieuwe map maken en opnieuw beginnen.', correct: false, misconception: 'Maakt een tweede bewaarplek in plaats van de bestaande te openen.' },
          { text: 'Inloggen met je schoolaccount en het bestand in OneDrive openen.', correct: true, explanation: 'Je werk staat in de cloud, dus het opent op elke computer waarop je inlogt.' }
        ],
        feedback: 'Een ander apparaat is geen probleem zolang je werk in OneDrive staat: je logt in en gaat verder waar je gebleven was.'
      },
      {
        prompt: 'Je wachtwoord delen met je beste vriend is veilig, want die vertelt het toch niet door.',
        waar: false,
        leerdoel: 'Je weet wat je doet als je wachtwoord gelekt of vergeten is.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        feedback: 'Een wachtwoord dat twee mensen kennen is geen wachtwoord meer. Vertrouwen verandert daar niets aan.'
      },
      {
        prompt: 'Welke rij bevat alleen software?',
        leerdoel: 'Je weet het verschil tussen hardware en software.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        options: [
          { text: 'Het toetsenbord, de muis en het scherm.', correct: false, misconception: 'Noemt juist de onderdelen die je kunt vastpakken software.' },
          { text: 'Windows, de browser en Word.', correct: true, explanation: 'Dit zijn alle drie programma’s die op het apparaat draaien.' },
          { text: 'Word, de printer en de accu.', correct: false, misconception: 'Ziet één programma staan en let niet op de twee tastbare onderdelen ernaast.' },
          { text: 'De camera, de wifi-antenne en de luidspreker.', correct: false, misconception: 'Denkt dat onderdelen die je zelden ziet daarom software zijn.' }
        ],
        feedback: 'Software draait op het apparaat en kun je niet vastpakken. Zodra er een printer, accu of camera in de rij staat, gaat het over hardware.'
      },
      {
        prompt: 'Leg uit wat je doet als je een verdachte mail krijgt op je schoolaccount.',
        type: 'open',
        leerdoel: 'Je weet wanneer je stopt en hulp vraagt bij iets verdachts.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        modelAnswer: 'Ik klik niet op de link en open geen bijlage. Ik kijk naar de afzender en of het bericht ergens op slaat. Daarna maak ik een screenshot en laat ik het zien aan mijn docent, mentor of de ICT-helpdesk.',
        nakijkpunten: [
          'Noemt dat er niet geklikt wordt.',
          'Noemt het controleren van de afzender of de link.',
          'Noemt melden bij iemand op school.'
        ],
        feedback: 'Niet klikken, wel controleren, altijd melden. Die volgorde werkt bij elk verdacht bericht.'
      },
      {
        prompt: 'Welke bestandsnaam hoort bij een nette inlevering?',
        leerdoel: 'Je kunt bewijs van je werk verzamelen en inleveren.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        options: [
          { text: 'document1.docx', correct: false, misconception: 'Laat de standaardnaam staan.' },
          { text: 'klaar!!.docx', correct: false, misconception: 'Beschrijft een gevoel in plaats van de inhoud.' },
          { text: 'h1-checkpoint-noa-1a.docx', correct: true, explanation: 'Hoofdstuk, opdracht, naam en klas staan erin.' }
        ],
        feedback: 'Aan zo’n naam ziet je docent meteen om welk hoofdstuk, welke leerling en welke klas het gaat.'
      },
      {
        prompt: 'Een wachtwoordzin van vier gewone woorden is meestal sterker dan een kort wachtwoord met vreemde tekens.',
        waar: true,
        leerdoel: 'Je weet waarom een lang en uniek wachtwoord veiliger is.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        feedback: 'Lengte telt zwaarder dan moeilijkdoenerij: vier woorden geven veel meer mogelijke combinaties dan acht tekens.'
      },
      {
        prompt: 'Je stuurt je docent een mail over een opdracht. Wat hoort er zeker in?',
        leerdoel: 'Je kunt zelfstandig inloggen, opslaan en mailen met je schoolaccount.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        options: [
          { text: 'Alleen een link, zonder verdere tekst.', correct: false, misconception: 'Denkt dat de link voor zichzelf spreekt.' },
          { text: 'Een onderwerp, een aanhef en een korte uitleg.', correct: true, explanation: 'Daarmee weet de ontvanger meteen waar het over gaat.' },
          { text: 'Je wachtwoord, zodat de docent kan meekijken.', correct: false, misconception: 'Verwart meekijken met inloggen als jou.' },
          { text: 'Je hele opdracht als tekst in de mail geplakt.', correct: false, misconception: 'Denkt dat mailen hetzelfde is als inleveren.' }
        ],
        feedback: 'Een nette mail begint met een onderwerp en een aanhef. Je wachtwoord hoort nergens in een bericht thuis.'
      },
      {
        prompt: 'Wanneer installeer je een update op je device?',
        leerdoel: 'Je kunt uitleggen waarom updates je device veiliger maken.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        options: [
          { text: 'Zo snel als het uitkomt, bijvoorbeeld na schooltijd.', correct: true, explanation: 'De update gebeurt snel, maar niet midden in je werk.' },
          { text: 'Pas als het apparaat helemaal niet meer werkt.', correct: false, misconception: 'Ziet een update als reparatie achteraf.' },
          { text: 'Nooit, want updates maken het apparaat trager.', correct: false, misconception: 'Denkt dat onderhoud alleen nadelen heeft.' }
        ],
        feedback: 'Een update is onderhoud, geen storing. Je plant hem op een handig moment, maar je slaat hem niet over.'
      },
      {
        prompt: 'Beschrijf welk bewijs je inlevert om te laten zien dat je map en bestanden op orde zijn.',
        type: 'open',
        leerdoel: 'Je kunt bewijs van je werk verzamelen en inleveren.',
        denkniveau: 'maken_controleren',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik lever een screenshot in van mijn map Digitale Vaardigheden in OneDrive, waarop de mappen en de bestandsnamen te zien zijn. Daarnaast lever ik het Word-bestand zelf in, met mijn naam en klas erin.',
        nakijkpunten: [
          'Noemt een screenshot waarop de mapstructuur zichtbaar is.',
          'Noemt het bestand zelf met een duidelijke naam.',
          'Het bewijs is controleerbaar voor iemand anders.'
        ],
        feedback: 'Bewijs is iets wat een ander kan controleren. Een screenshot van je map plus het bestand zelf is genoeg.'
      },
      {
        prompt: 'Waarom vraag je hulp als iets digitaals niet lukt?',
        leerdoel: 'Je weet wanneer je stopt en hulp vraagt bij iets verdachts.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Omdat je dan zelf niets meer hoeft te leren.', correct: false, misconception: 'Ziet hulp vragen als het overdragen van de taak.' },
          { text: 'Omdat de docent het altijd sneller doet.', correct: false, misconception: 'Maakt snelheid belangrijker dan begrijpen.' },
          { text: 'Omdat je zo voorkomt dat je uit onzekerheid op iets onveiligs klikt.', correct: true, explanation: 'Doorklikken zonder te snappen wat er gebeurt geeft het meeste risico.' }
        ],
        feedback: 'Hulp vragen hoort bij digitaal vaardig zijn. Wie blijft doorklikken zonder het te snappen, loopt het meeste risico.'
      }
    ]
  }
};
