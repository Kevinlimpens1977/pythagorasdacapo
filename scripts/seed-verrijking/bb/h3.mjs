// Verrijkingslaag hoofdstuk 3 - Veilig internet en jouw gegevens.
// Basisberoepsgerichte leerweg (bb).
//
// Zie scripts/seed-verrijking/PATROON.md voor het formaat van een vraag, de
// regels over afleiders en de eisen aan feedback.
//
// Dit hoofdstuk heeft in bb VIER paragrafen: 3.1, 3.2, 3.3 en het checkpoint
// 3.4. 3.5 is de vrijwillige plusparagraaf van de theoretische leerweg en komt
// hier niet voor. 3.1 is dus de eerste paragraaf en kijkt nergens op terug;
// 3.2 en 3.3 hebben allebei een terugkeervraag naar een eerdere paragraaf.
//
// Opzet per paragraaf, volgens de blauwdruk en het bb-profiel:
//   - elk leerdoel heeft zijn EIGEN startvraag. Die staan als `checks` in
//     scripts/seed-structuur/bb/h3.mjs, met antwoord en uitleg erbij;
//   - elk theorieblok heeft een uitgewerkt voorbeeld in vraag-en-antwoordvorm.
//     Dat voorbeeld komt VOOR het oefenblok en dus voor het zelfstandig
//     oefenen. In bb is het voorbeeld altijd een situatie uit hun eigen wereld:
//     een appje van een vriendin, een win-actie op Insta, een foto in een
//     groepschat;
//   - elke afsluitquiz vanaf 3.2 haalt minstens één leerdoel op uit een
//     EERDERE paragraaf van dit hoofdstuk. In 3.2 is dat de laatste vraag
//     (twee-staps-verificatie, leerdoel 2 van 3.1), in 3.3 de laatste vraag
//     (de afzender checken, leerdoel 2 van 3.2);
//   - de hoofdstuktoets van 3.4 bevraagt alle ELF verplichte leerdoelen van
//     3.1, 3.2, 3.3 en 3.4. Elk leerdoel komt er minstens twee keer in terug.
//
// BB-VORM: VEEL KLEINE MOMENTEN
// -----------------------------
// Het bb-profiel zegt: vorm gaat voor inhoud, en een leerling moet elke minuut
// iets kunnen aanklikken. Daarom staan er veel korte vragen in plaats van een
// paar grote. Geteld over heel hoofdstuk 3 in bb: 29 meerkeuze, 28
// waar-niet-waar en 6 open vragen op 63 vragen totaal. Bijna vijfenveertig
// procent is dus een korte goed-of-fout-knop. Elke afsluitquiz heeft twaalf
// vragen en de hoofdstuktoets er 27, zodat de tokens over veel kleine momenten
// verdeeld worden in plaats van over een paar dikke vragen aan het eind.
//
// De reden waarom een antwoord goed is staat in `explanation`, niet in de
// antwoordtekst zelf. Feedback is kort, positief en benoemt wat er goed ging.
//
// RAADBAARHEID OP VORM
// --------------------
// De afleiders zijn met opzet even lang of langer geschreven dan het goede
// antwoord: blind de langste knop klikken levert vrijwel niets op. Alleen bij
// toetsvraag 5 is het goede antwoord het langst, en dat is de vraag waarvan de
// bron de drie antwoordopties letterlijk voorschrijft. Het goede antwoord
// staat gespreid over positie 1 tot en met 4, en de waar-niet-waar-stellingen
// zijn ongeveer half waar en half niet waar.
//
// WAT UIT DE BRON LETTERLIJK ALS VRAAG TERUGKOMT
// ----------------------------------------------
// Uit Wikiwijs-oefening 8315419: "Wat is phishing?" (3.2 vraag 1), de win-actie
// van bol.com (oefenblok 3.2), de noodoproep van je vriendin (3.2 vraag 8), het
// voorbeeld van identiteitsfraude (3.2 vraag 10) en het invulverhaal over de
// afzender (3.2 vraag 6 en 7).
// Uit Wikiwijs-oefening 8315424: de rijbewijsfoto (3.3 vraag 9 en toetsvraag
// 18), de sleepzin over gevoelige informatie, wachtwoorden en linkjes
// (toetsvraag 25, 26 en 27), de koppelvraag cybercrimineel / phishing /
// twee-staps-verificatie / identiteitsfraude (toetsvraag 7, 11, 12 en het
// diagnoseblok), "Kun je alles geloven wat op internet staat?" (toetsvraag 22)
// en "Wat betekent digitale weerbaarheid?" (toetsvraag 5, met de drie
// antwoordopties van de bron).
//
// De bb-vragen zijn opnieuw geschreven en niet overgenomen uit kb/h3.mjs of
// tl/h3.mjs: kortere zinnen, één idee per vraag en voorbeelden uit de
// leefwereld van een brugklasser.

const LD_3_1 = [
  "Je kunt drie risico's van internetgebruik noemen.",
  'Je weet wat twee-staps-verificatie is en waarom die je account beter beschermt.',
  'Je kunt uitleggen wat digitale weerbaarheid betekent.'
];

const LD_3_2 = [
  'Je kunt uitleggen wat phishing is.',
  'Je kunt aan een bericht of e-mail zien of het phishing kan zijn.',
  'Je weet wat identiteitsfraude is en wat een cybercrimineel doet.'
];

const LD_3_3 = [
  'Je weet dat wat je online zet veel langer blijft bestaan dan je denkt.',
  'Je kunt je privacy-instellingen zo zetten dat alleen mensen die je kent je profiel zien.',
  'Je kunt uitleggen welke gegevens je beter niet online deelt.'
];

const LD_3_4 = [
  'Je kunt een verdacht bericht herkennen en zeggen wat je dan doet.',
  'Je kunt uitleggen hoe je jezelf en je gegevens online beschermt.'
];

export default {
  '3.1': {
    learningGoals: LD_3_1,
    theorie: [
      {
        keyTerms: ['nepberichten', 'symbolen', 'wachtwoordzin'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sem gebruikt op elke site hetzelfde wachtwoord: Sem2013. Een webshop waar hij ooit iets kocht wordt gehackt. Wat gebeurt er nu?</p>',
          '<p><strong>Antwoord.</strong> De dief heeft nu het wachtwoord van Sem. Hij probeert het meteen bij zijn mail. En bij zijn Insta. Overal past dezelfde sleutel. Sem had per account een ander wachtwoord moeten kiezen. En een langere. Gele fiets zoekt maandag 9! is 27 tekens. Zo een zin onthoudt hij nog ook.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['wachtwoordbeheer', 'hacken', 'twee-staps-verificatie', 'digitale weerbaarheid'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Amira krijgt om half twaalf ’s nachts een sms met een inlogcode. Ze logt zelf helemaal niet in. Wat is er aan de hand?</p>',
          '<p><strong>Antwoord.</strong> Iemand anders typt haar wachtwoord in. Dat wachtwoord is dus gelekt. Verder komt hij niet, want de code kwam bij Amira binnen. Zij deelt die code met niemand. Ze verandert meteen haar wachtwoord. Zonder die tweede stap had de dief nu in haar account gezeten.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: "<p>Er zijn vier risico's online: wachtwoorden stelen, nepberichten sturen, pesten en data misbruiken. Een sterk wachtwoord heeft minstens 12 tekens en gebruik je nergens anders. Je bewaart hem in een app of in een beveiligd document, nooit op een briefje. Met twee stappen inloggen is veiliger: eerst je wachtwoord, daarna een code uit een sms of uit een authenticator app. Zo bescherm je jezelf, en dat heet weerbaar zijn.</p>",
      keyTerms: ['sterk wachtwoord', 'authenticator app']
    },
    vragen: [
      {
        prompt: 'Data zijn gegevens over jou, zoals je adres en je telefoonnummer.',
        waar: true,
        leerdoel: LD_3_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Goed gezien. Data is gewoon een ander woord voor jouw gegevens.'
      },
      {
        prompt: 'Wat is een risico van internetgebruik?',
        leerdoel: LD_3_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Dat iemand jouw wachtwoord steelt.', correct: true, explanation: 'Daarmee komt hij in al je accounts.' },
          { text: 'Dat je batterij leeg raakt terwijl je aan het gamen bent.', correct: false, misconception: 'Ziet pech met een apparaat aan voor een risico.' },
          { text: 'Dat je wifi thuis soms een paar minuten langzamer is.', correct: false, misconception: 'Denkt dat een storing hetzelfde is als een gevaar.' },
          { text: 'Dat je laptop warm wordt als je er lang op werkt.', correct: false, misconception: 'Verwart een normale eigenschap met een risico.' }
        ],
        feedback: 'Sterk. Bij een risico wil er altijd iemand iets van jou.'
      },
      {
        prompt: "Pesten hoort ook bij de risico's van internetgebruik.",
        waar: true,
        leerdoel: LD_3_1[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Klopt. De dader verdient er niets aan, maar hij wil jou raken.'
      },
      {
        prompt: 'Waaraan voldoet een sterk wachtwoord?',
        leerdoel: LD_3_1[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Hij is lekker kort, want dan typ je hem snel in op je telefoon.', correct: false, misconception: 'Kiest gemak boven lengte.' },
          { text: 'Hij heeft 12 tekens en gebruik je nergens anders.', correct: true, explanation: 'Lang zijn weegt daarbij het zwaarst.' },
          { text: 'Hij bestaat uit je eigen voornaam met je geboortejaar erachter.', correct: false, misconception: 'Denkt dat een persoonlijk woord ook een moeilijk woord is.' },
          { text: 'Hij is bij al je accounts hetzelfde, want dan onthoud je hem goed.', correct: false, misconception: 'Denkt dat onthouden belangrijker is dan uniek zijn.' }
        ],
        feedback: 'Prima. Met 12 tekens en uniek zit je al goed.'
      },
      {
        prompt: 'Je wachtwoord mag je aan je beste vriend doorgeven.',
        waar: false,
        leerdoel: LD_3_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Een wachtwoord houd je altijd voor jezelf.'
      },
      {
        prompt: 'Waar bewaar je je wachtwoorden veilig?',
        leerdoel: LD_3_1[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Op een briefje in je etui, dan heb je hem altijd bij je.', correct: false, misconception: 'Denkt dat iets op papier veiliger is dan digitaal.' },
          { text: 'In de groepsapp van je klas, dan raak je hem nooit kwijt.', correct: false, misconception: 'Verwart een back-up maken met veilig bewaren.' },
          { text: 'In wachtwoordbeheer of een beveiligd document.', correct: true, explanation: 'Allebei zitten ze achter een code of vingerafdruk.' }
        ],
        feedback: 'Precies. Achter een slot, en niet in je etui.'
      },
      {
        prompt: 'Hacken betekent dat iemand jouw wachtwoord achterhaalt.',
        waar: true,
        leerdoel: LD_3_1[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Mooi. En daarna kan hij bij al jouw gegevens.'
      },
      {
        prompt: 'Waar komt de code van twee-staps-verificatie vandaan?',
        leerdoel: LD_3_1[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Uit de mail die je van de website terugkrijgt na het inloggen.', correct: false, misconception: 'Denkt dat de tweede stap ook via de mail loopt.' },
          { text: 'Uit het wachtwoord zelf, want daar zitten al cijfers in.', correct: false, misconception: 'Ziet de tweede stap als een deel van het wachtwoord.' },
          { text: 'Van de website waar je op dat moment aan het inloggen bent.', correct: false, misconception: 'Denkt dat de site de code op je scherm zet.' },
          { text: 'Uit een sms of uit een authenticator app.', correct: true, explanation: 'Allebei komen ze binnen op jouw eigen telefoon.' }
        ],
        feedback: 'Goed bezig. De code komt altijd op jouw telefoon aan.'
      },
      {
        prompt: 'Met twee-staps-verificatie log je in twee stappen in.',
        waar: true,
        leerdoel: LD_3_1[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt helemaal. Eerst je wachtwoord, dan pas de code.'
      },
      {
        prompt: 'Waarom beschermt twee-staps-verificatie je account beter?',
        leerdoel: LD_3_1[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat je wachtwoord dan elke week automatisch wordt vervangen.', correct: false, misconception: 'Denkt dat de tweede stap het wachtwoord verandert.' },
          { text: 'Omdat een dief ook jouw telefoon nodig heeft.', correct: true, explanation: 'En die ligt gewoon in jouw eigen zak.' },
          { text: 'Omdat de website je wachtwoord dan extra goed gaat bewaren.', correct: false, misconception: 'Denkt dat de bescherming bij de website zelf zit.' },
          { text: 'Omdat je dan een veel langer wachtwoord mag gaan gebruiken.', correct: false, misconception: 'Verwart de tweede stap met een langer wachtwoord.' }
        ],
        feedback: 'Sterk geredeneerd. Weten alleen is niet genoeg, hebben ook.'
      },
      {
        prompt: 'Wat betekent digitale weerbaarheid?',
        leerdoel: LD_3_1[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Dat je heel snel kunt typen op een toetsenbord of telefoon.', correct: false, misconception: 'Denkt dat weerbaarheid over vaardigheid met techniek gaat.' },
          { text: 'Dat je apparaat tegen een stootje kan als je hem laat vallen.', correct: false, misconception: 'Denkt aan het apparaat in plaats van aan jezelf.' },
          { text: 'Dat je jezelf beschermt tegen wat online niet veilig is.', correct: true, explanation: 'Je merkt dat iets niet klopt en doet dan het goede.' }
        ],
        feedback: 'Netjes. Het gaat om jou, niet om je apparaat.'
      },
      {
        prompt: 'Leg in twee zinnen uit wat digitale weerbaarheid voor jou betekent. Geef er één voorbeeld bij.',
        type: 'open',
        leerdoel: LD_3_1[2],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Digitale weerbaarheid betekent dat ik mezelf online bescherm. Ik merk zelf wanneer iets niet klopt. Een voorbeeld: ik kreeg een mail met een link over een pakket. Ik klikte niet en vroeg het eerst thuis na.',
        nakijkpunten: [
          'Er staat een uitleg in eigen woorden, niet alleen het woord overgeschreven.',
          'Er staat een echt voorbeeld bij uit het eigen leven van de leerling.',
          'Uit het voorbeeld blijkt dat de leerling zelf iets deed of juist liet.'
        ],
        feedback: 'Goed uitgelegd. Je laat zien wat je doet en niet alleen wat je weet.'
      }
    ]
  },

  '3.2': {
    learningGoals: LD_3_2,
    theorie: [
      {
        keyTerms: ['phishing', 'win-actie'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Jaylen ziet op Insta: win een iPhone, vul je e-mailadres en je nummer in. Hij doet mee. Twee weken later wordt hij door vreemde nummers gebeld. Hoe kan dit gebeuren?</p>',
          '<p><strong>Antwoord.</strong> Jaylen gaf zijn gegevens weg. Dat waren zijn data. Die zijn daarna doorverkocht. Nu staat hij op lijstjes van bedrijven die hij niet kent. Er is nooit een iPhone geweest. De actie was alleen bedoeld om gegevens te verzamelen.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['cybercrimineel', 'identiteitsfraude', 'afzender'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Noa krijgt een mail van ING. Er staat: uw pas wordt geblokkeerd, log binnen 24 uur in. De afzender is ing-service@bankcheck.info. Wat klopt hier niet?</p>',
          '<p><strong>Antwoord.</strong> Drie dingen. Eén: het adres van de afzender. De echte ING mailt vanaf ing.nl. Twee: de haast. Binnen 24 uur, dat is druk zetten. Drie: de vraag om in te loggen via een link. Noa klikt nergens op. Ze zoekt het nummer van ING op de echte site en belt dat.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Phishing is: met een nepbericht jouw gegevens of jouw geld stelen. Een bank of de overheid vraagt nooit om je wachtwoord of je pincode. Kijk daarom altijd wie de mail stuurde en vergelijk dat adres met de echte site. Iemand die jouw gegevens digitaal steelt heet een cybercrimineel. Doet hij zich met jouw naam en foto voor als jou, dan heet dat identiteitsfraude.</p>',
      keyTerms: ['nepbericht', 'pincode']
    },
    vragen: [
      {
        prompt: 'Wat is phishing?',
        leerdoel: LD_3_2[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Vissen op een plek waar dat eigenlijk niet is toegestaan.', correct: false, misconception: 'Vertaalt het woord letterlijk en denkt aan echt vissen.' },
          { text: 'Met een nepbericht gegevens of geld stelen.', correct: true, explanation: 'Het nepbericht is het lokaas.' },
          { text: 'Als iemand jouw wachtwoord van je laptopscherm afkijkt.', correct: false, misconception: 'Verwart phishing met meekijken over je schouder.' }
        ],
        feedback: 'Goed. Het bericht is nep, de schade is echt.'
      },
      {
        prompt: 'Het woord phishing komt van het Engelse woord fishing, vissen.',
        waar: true,
        leerdoel: LD_3_2[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Klopt. De dader gooit een hengel uit en wacht af.'
      },
      {
        prompt: 'Een oplichter stuurt zijn nepbericht naar duizenden mensen tegelijk.',
        waar: true,
        leerdoel: LD_3_2[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Precies. Hapt er één, dan heeft hij al winst gemaakt.'
      },
      {
        prompt: 'Wat gebeurt er met je gegevens na een nep-winactie?',
        leerdoel: LD_3_2[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Het bedrijf gooit ze na de trekking meteen weer weg.', correct: false, misconception: 'Gaat ervan uit dat er echt een bedrijf achter zit.' },
          { text: 'Ze blijven netjes bij de winactie staan en gaan nergens heen.', correct: false, misconception: 'Denkt dat gegevens op één plek blijven.' },
          { text: 'Ze worden doorverkocht en misbruikt.', correct: true, explanation: 'Daarna bellen vreemde nummers je op.' },
          { text: 'Ze worden alleen gebruikt om jou de prijs op te sturen.', correct: false, misconception: 'Gelooft dat er echt een prijs te winnen was.' }
        ],
        feedback: 'Sterk. Jouw gegevens zijn voor hem de echte prijs.'
      },
      {
        prompt: 'Een bank mailt je soms met de vraag om je pincode door te geven.',
        waar: false,
        leerdoel: LD_3_2[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Een bank vraagt dat nooit, ook niet per post.'
      },
      {
        prompt: 'Waaraan check je het eerst of een mail echt is?',
        leerdoel: LD_3_2[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Aan de afzender.', correct: true, explanation: 'Vergelijk dat adres met de echte website.' },
          { text: 'Aan de kleur van het logo dat bovenaan het bericht staat.', correct: false, misconception: 'Denkt dat een echt logo bewijst dat de mail echt is.' },
          { text: 'Aan het aantal mensen dat de mail ook gekregen heeft.', correct: false, misconception: 'Denkt dat een mail aan velen daardoor betrouwbaar is.' },
          { text: 'Aan de knop die helemaal onderaan in het bericht staat.', correct: false, misconception: 'Wil in de mail zelf gaan klikken om te controleren.' }
        ],
        feedback: 'Prima eerste stap. Het adres liegt minder dan een logo.'
      },
      {
        prompt: 'Eén letter verschil in het adres van de afzender is al fout.',
        waar: true,
        leerdoel: LD_3_2[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed gekeken. Juist die ene letter is de hele truc.'
      },
      {
        prompt: 'Je vriendin appt vanaf een onbekend nummer dat ze snel geld nodig heeft. Wat doe je?',
        leerdoel: LD_3_2[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ik maak het geld meteen over, want zij heeft duidelijk haast.', correct: false, misconception: 'Laat zich meeslepen door de haast in het bericht.' },
          { text: 'Ik vraag in dat gesprek zelf of zij het echt wel is.', correct: false, misconception: 'Controleert binnen het bericht in plaats van erbuiten.' },
          { text: 'Ik maak de helft over, want dan is het risico kleiner.', correct: false, misconception: 'Denkt dat een kleiner bedrag het probleem oplost.' },
          { text: 'Ik bel haar op haar oude nummer.', correct: true, explanation: 'Daar zit de oplichter niet.' }
        ],
        feedback: 'Slim. Bellen op het oude nummer haalt de truc onderuit.'
      },
      {
        prompt: 'Een cybercrimineel steelt jouw gegevens via internet.',
        waar: true,
        leerdoel: LD_3_2[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Juist. Cyber gaat over internet, crimineel over stelen.'
      },
      {
        prompt: 'Wat is een voorbeeld van identiteitsfraude?',
        leerdoel: LD_3_2[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Iemand kraakt het wachtwoord van jouw schoolaccount.', correct: false, misconception: 'Verwart hacken met je voordoen als iemand.' },
          { text: 'Iemand doet zich met jouw naam en foto voor als jou.', correct: true, explanation: 'Zo vraagt hij jouw vrienden om geld.' },
          { text: 'Iemand steelt chocola in de supermarkt om de hoek.', correct: false, misconception: 'Kiest een diefstal zonder iets digitaals erin.' }
        ],
        feedback: 'Goed. Jij bent hier het masker en niet het doelwit.'
      },
      {
        prompt: 'Leg uit wat een cybercrimineel doet. Gebruik in je antwoord het woord identiteitsfraude.',
        type: 'open',
        leerdoel: LD_3_2[2],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Een cybercrimineel steelt via internet gegevens van mensen. Hij pakt bijvoorbeeld je wachtwoord en je foto. Daarna maakt hij een account met jouw naam. Zo vraagt hij jouw vrienden om geld. Dat heet identiteitsfraude.',
        nakijkpunten: [
          'Er staat wat een cybercrimineel doet: digitaal gegevens stelen.',
          'Het woord identiteitsfraude is gebruikt en klopt met de uitleg erbij.',
          'Er staat een voorbeeld in van wat er met de gestolen gegevens gebeurt.'
        ],
        feedback: 'Mooi verwoord. Je koppelt de dader aan wat hij daarna doet.'
      },
      {
        prompt: 'Terugblik op 3.1. Iemand kent jouw wachtwoord, maar jij hebt twee-staps-verificatie aan. Wat gebeurt er?',
        leerdoel: LD_3_1[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Hij is meteen binnen, want hij heeft het wachtwoord toch al.', correct: false, misconception: 'Denkt dat het wachtwoord altijd de enige sleutel is.' },
          { text: 'Hij krijgt de code automatisch op zijn eigen telefoon toegestuurd.', correct: false, misconception: 'Denkt dat de code naar de inlogger gaat en niet naar jou.' },
          { text: 'Hij komt er niet in zonder de code van jouw telefoon.', correct: true, explanation: 'Die code komt alleen bij jou binnen.' },
          { text: 'Hij mag drie keer proberen en is daarna alsnog binnen.', correct: false, misconception: 'Denkt dat de tweede stap na een paar pogingen vervalt.' }
        ],
        feedback: 'Mooi onthouden uit de vorige paragraaf. Dat scheelt bij de toets.'
      }
    ]
  },

  '3.3': {
    learningGoals: LD_3_3,
    theorie: [
      {
        keyTerms: ['digitale voetafdruk', 'gevoelige informatie'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Yara post een grappig filmpje van een klasgenoot. Na een uur haalt ze het weg. Toch ziet ze het een week later terug in een andere groepsapp. Hoe kan dat, denk je?</p>',
          '<p><strong>Antwoord.</strong> In dat uur maakte iemand een schermafbeelding. Die kopie is van hem, niet van Yara. Haar verwijderknop doet daar niets aan. Ze kan hem ook niet zien. Zo groeit haar digitale voetafdruk zonder dat zij het merkt.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['privacy-instellingen', 'volgerslijst', 'groepschat'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Milan zet in zijn bio: alleen voor vrienden, niet delen. Toch komen er onbekenden bij zijn foto’s. Wat doet hij fout?</p>',
          '<p><strong>Antwoord.</strong> Een app leest je bio niet. Alleen de schakelaar telt. Milan gaat naar Instellingen. Daar kiest hij Privacy of Account. Hij zet zijn account op privé. Daarna loopt hij zijn volgers na. Iedereen die hij niet echt kent, haalt hij eruit. Pas dan is zijn profiel dicht.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Alles wat je online zet laat sporen na. Die sporen heten samen je digitale voetafdruk. Zet daarom je account op privé en loop daarna je volgers na. Deel nooit je adres, je rooster of een foto van een pasje. En stuur een gemene of bewerkte foto van iemand anders nooit door.</p>',
      keyTerms: ['digitale voetafdruk', 'privé']
    },
    vragen: [
      {
        prompt: 'Iets dat jij van internet verwijdert, is daarna overal echt weg.',
        waar: false,
        leerdoel: LD_3_3[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Goed opgelet. Kopieën van anderen blijven gewoon bestaan.'
      },
      {
        prompt: 'Wat is een digitale voetafdruk?',
        leerdoel: LD_3_3[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Een app die bijhoudt hoeveel stappen jij per dag hebt gezet.', correct: false, misconception: 'Denkt bij voetafdruk aan echte voeten en stappen tellen.' },
          { text: 'Het ene profiel dat je bij één app hebt aangemaakt.', correct: false, misconception: 'Beperkt de voetafdruk tot één account.' },
          { text: 'Alle sporen die je online achterlaat.', correct: true, explanation: 'Ook sporen die anderen over jou plaatsen.' },
          { text: 'Het wachtwoord waarmee jij op al je apparaten inlogt.', correct: false, misconception: 'Verwart je voetafdruk met je vingerafdruk of je wachtwoord.' }
        ],
        feedback: 'Sterk. Elk spoor telt mee, ook een oude foto.'
      },
      {
        prompt: 'Een verhaal dat na 24 uur weggaat, kan intussen gekopieerd zijn.',
        waar: true,
        leerdoel: LD_3_3[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Klopt. Tijdelijk geldt alleen voor jouw eigen exemplaar.'
      },
      {
        prompt: 'Welke vraag stel je jezelf voordat je iets post?',
        leerdoel: LD_3_3[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Zou ik dit ook op het bord hangen?', correct: true, explanation: 'Wat daar niet kan, hoort ook niet online.' },
          { text: 'Hoeveel likes ga ik hier waarschijnlijk mee ophalen vandaag?', correct: false, misconception: 'Kiest aandacht als maatstaf in plaats van veiligheid.' },
          { text: 'Vinden mijn vrienden dit bericht grappig genoeg om te delen?', correct: false, misconception: 'Laat de keuze afhangen van de reactie van anderen.' },
          { text: 'Hoeveel volgers heb ik op dit moment eigenlijk in totaal?', correct: false, misconception: 'Denkt dat een klein publiek het bericht veilig maakt.' }
        ],
        feedback: 'Goede check. Het bord in de klas is een handige spiegel.'
      },
      {
        prompt: 'Waar vind je de knop om je account op privé te zetten?',
        leerdoel: LD_3_3[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'In je bio, door daar een zin over je privacy in te typen.', correct: false, misconception: 'Denkt dat de app je bio leest en zich daaraan houdt.' },
          { text: 'Bij Privacy of bij Account.', correct: true, explanation: 'Daar zit de schakelaar die echt iets doet.' },
          { text: 'In de zoekbalk, door daar je eigen naam in te typen.', correct: false, misconception: 'Verwart zoeken naar jezelf met je profiel afschermen.' },
          { text: 'Bij de instellingen van je laptop, onder het kopje Systeem.', correct: false, misconception: 'Zoekt de instelling bij het apparaat en niet bij de app.' }
        ],
        feedback: 'Prima. Zoek die twee kopjes en je vindt hem altijd.'
      },
      {
        prompt: 'Een zin in je bio zorgt ervoor dat vreemden je profiel niet zien.',
        waar: false,
        leerdoel: LD_3_3[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Alleen de schakelaar doet echt iets.'
      },
      {
        prompt: 'Ook met je account op privé loop je je volgerslijst nog na.',
        waar: true,
        leerdoel: LD_3_3[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Wie al binnen stond, blijft anders gewoon meekijken.'
      },
      {
        prompt: 'Beschrijf in drie stappen hoe jij je profiel op privé zet.',
        type: 'open',
        leerdoel: LD_3_3[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Stap 1: ik open de instellingen van de app. Stap 2: ik ga naar Privacy of Account en zet de schakelaar Privé-account aan. Stap 3: ik loop mijn volgers na en haal iedereen weg die ik niet echt ken.',
        nakijkpunten: [
          'Er staan drie stappen in de goede volgorde.',
          'De schakelaar bij Privacy of Account wordt genoemd, niet de bio.',
          'De volgerslijst nalopen staat er als laatste stap bij.'
        ],
        feedback: 'Netjes op volgorde. Zo kan een ander het ook doen.'
      },
      {
        prompt: 'Een foto van je rijbewijs op sociale media zetten is niet slim.',
        waar: true,
        leerdoel: LD_3_3[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed gezien. Je naam, je geboortedatum en je handtekening staan erop.'
      },
      {
        prompt: 'Welk gegeven kun je beter niet openbaar delen?',
        leerdoel: LD_3_3[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je favoriete muziek en de artiesten waar je graag naar luistert.', correct: false, misconception: 'Denkt dat smaak net zo gevoelig is als locatie.' },
          { text: 'Een foto van je kat die op de bank ligt te slapen.', correct: false, misconception: 'Ziet elke foto als even risicovol.' },
          { text: 'De naam van het spel dat je het liefste speelt.', correct: false, misconception: 'Denkt dat een hobby iets over je locatie zegt.' },
          { text: 'Je lesrooster.', correct: true, explanation: 'Daarmee weet een ander waar jij wanneer bent.' }
        ],
        feedback: 'Slim gekozen. Alles wat zegt waar je bent, houd je binnen.'
      },
      {
        prompt: "Cyberpesten kan ook met een bewerkte foto in een groepschat.",
        waar: true,
        leerdoel: LD_3_3[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Juist. Gemene berichten en buitensluiten horen er ook bij.'
      },
      {
        prompt: 'Terugblik op 3.2. Waarmee controleer je of een mail van je bank echt is?',
        leerdoel: LD_3_2[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Met het adres van de afzender.', correct: true, explanation: 'Dat vergelijk je met de echte website.' },
          { text: 'Met de vraag of het logo van de bank in de mail staat.', correct: false, misconception: 'Denkt dat een logo bewijst wie de afzender is.' },
          { text: 'Met de link die onderaan in die mail zelf is gezet.', correct: false, misconception: 'Controleert binnen de mail in plaats van erbuiten.' },
          { text: 'Met het tijdstip waarop de mail bij jou is binnengekomen.', correct: false, misconception: 'Denkt dat oplichters alleen s nachts mailen.' }
        ],
        feedback: 'Goed onthouden. Deze check gebruik je bij elk raar bericht.'
      }
    ]
  },

  '3.4': {
    learningGoals: LD_3_4,
    theorie: [
      {
        keyTerms: ['digitale weerbaarheid', 'identiteitsfraude'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Ravi heeft twee-staps-verificatie aan op zijn mail. Op tien andere sites gebruikt hij hetzelfde wachtwoord. Waar zit bij hem het gat?</p>',
          '<p><strong>Antwoord.</strong> Zijn mail zit goed dicht. Die tien andere accounts niet. Wordt één van die sites gehackt, dan liggen ze allemaal open. Ravi begint dus met unieke wachtwoorden in een kluis. Daarna zet hij ook op zijn Insta een tweede stap.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['stappenplan', 'afzender'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sam levert als bewijs een schermafbeelding in van zijn volgerslijst. Daarop is te zien dat hij vier accounts weghaalde. Bewijst dat ook dat zijn account op privé staat?</p>',
          '<p><strong>Antwoord.</strong> Nee. Dat zijn twee verschillende dingen. Zijn volgerslijst laat zien wie hij opruimde. Dat zijn account op privé staat, zie je alleen op de instellingenpagina. Sam heeft dus allebei de schermafbeeldingen nodig.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Je weet nu hoe je jezelf en je gegevens online beschermt. Dat doe je met een sterk wachtwoord, met een tweede stap bij het inloggen en met een profiel op slot. Een nepbericht herken je aan de afzender, aan de haast en aan de vraag om een wachtwoord. Op je noodkaart staan vier stappen: niet klikken, checken, bellen, en melden en blokkeren.</p>',
      keyTerms: ['noodkaart', 'melden']
    },
    vragen: [
      {
        prompt: "Welke van deze vier hoort niet bij de risico's van internetgebruik?",
        leerdoel: LD_3_1[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Iemand steelt jouw wachtwoord en logt in op jouw mail.', correct: false, misconception: 'Herkent diefstal van een wachtwoord niet als risico.' },
          { text: 'Je oplader ligt thuis, dus je laptop valt uit.', correct: true, explanation: 'Er is hier niemand die iets van jou wil.' },
          { text: 'Iemand stuurt jou een nepbericht met een valse link erin.', correct: false, misconception: 'Herkent een nepbericht niet als risico.' },
          { text: 'Iemand verkoopt jouw gegevens door aan een ander bedrijf.', correct: false, misconception: 'Herkent misbruik van data niet als risico.' }
        ],
        feedback: 'Goed onderscheid. Pech is vervelend, maar het is geen risico.'
      },
      {
        prompt: "Je foto's en je adres horen allebei bij jouw data.",
        waar: true,
        leerdoel: LD_3_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Correct. Alles wat bij jou hoort telt als jouw data.'
      },
      {
        prompt: 'Hoe log je in op een account met twee-staps-verificatie?',
        leerdoel: LD_3_1[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je vult twee keer achter elkaar precies hetzelfde wachtwoord in.', correct: false, misconception: 'Denkt dat de tweede stap een herhaling is.' },
          { text: 'Je vult je wachtwoord in en klikt daarna nog een keer op inloggen.', correct: false, misconception: 'Denkt dat een extra klik de tweede stap is.' },
          { text: 'Je vult je wachtwoord in en daarna een code van je telefoon.', correct: true, explanation: 'Die code komt per sms of uit een app.' },
          { text: 'Je vult je wachtwoord in en daarna het wachtwoord van een vriend.', correct: false, misconception: 'Denkt dat er een tweede persoon bij nodig is.' }
        ],
        feedback: 'Precies de goede volgorde. Eerst weten, dan hebben.'
      },
      {
        prompt: 'Een dief moet ook jouw telefoon hebben om de tweede stap te halen.',
        waar: true,
        leerdoel: LD_3_1[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. En jouw telefoon zit gewoon in jouw eigen zak.'
      },
      {
        prompt: 'Wat betekent digitale weerbaarheid precies?',
        leerdoel: LD_3_1[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Dat je jezelf kunt beschermen tegen dingen die online niet veilig of eerlijk zijn.', correct: true, explanation: 'Je merkt het zelf en je doet er iets mee.' },
          { text: 'Dat is een app waarin je kunt zien of het mooi weer wordt.', correct: false, misconception: 'Kent het woord niet en gokt op een app.' },
          { text: 'Dat je niet nat kunt worden als je buiten in de regen loopt.', correct: false, misconception: 'Denkt bij weerbaarheid aan het weer.' }
        ],
        feedback: 'Helemaal goed. Weerbaar gaat over jou en niet over het weer.'
      },
      {
        prompt: 'Noem twee dingen die jij doet om digitaal weerbaar te zijn. Leg bij elk uit waarom.',
        type: 'open',
        leerdoel: LD_3_1[2],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik heb twee-staps-verificatie aan op mijn mail. Daardoor is een gestolen wachtwoord niet genoeg. En ik klik nooit op een link in een mail die haast maakt. Zo trap ik niet in phishing.',
        nakijkpunten: [
          'Er staan twee verschillende maatregelen in, niet twee keer dezelfde.',
          'Bij elke maatregel staat welk gevaar er kleiner van wordt.',
          'Het gaat om iets wat de leerling zelf doet, niet om een regel van school.'
        ],
        feedback: 'Goed werk. Je koppelt elke maatregel aan een echt gevaar.'
      },
      {
        prompt: 'Met welk doel stuurt een oplichter een nepbericht?',
        leerdoel: LD_3_2[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Hij wil weten hoeveel mensen zijn bericht op een dag openen.', correct: false, misconception: 'Denkt dat het om aandacht gaat in plaats van om buit.' },
          { text: 'Hij wil dat jij zijn bericht doorstuurt naar al je vrienden.', correct: false, misconception: 'Verwart phishing met een kettingbericht.' },
          { text: 'Hij wil je waarschuwen dat je account bijna helemaal vol zit.', correct: false, misconception: 'Gelooft de smoes die in het bericht staat.' },
          { text: 'Hij wil jouw gegevens of jouw geld.', correct: true, explanation: 'Daarvoor is het nepbericht gemaakt.' }
        ],
        feedback: 'Sterk. Achter elke smoes zit hetzelfde doel.'
      },
      {
        prompt: 'Bij phishing gooit de dader een hengel uit naar duizenden mensen.',
        waar: true,
        leerdoel: LD_3_2[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed beeld. Daarom staat jouw naam er meestal niet in.'
      },
      {
        prompt: 'In welke mail zit het duidelijkste alarmsignaal?',
        leerdoel: LD_3_2[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een mail van je mentor met het huiswerk van deze week erin.', correct: false, misconception: 'Vindt elke mail met een bijlage verdacht.' },
          { text: 'Een mail die vraagt om je pincode.', correct: true, explanation: 'Een bank vraagt daar nooit per mail om.' },
          { text: 'Een mail van een webshop met de bevestiging van je bestelling.', correct: false, misconception: 'Denkt dat elke mail van een winkel nep is.' },
          { text: 'Een mail van school over de ouderavond van volgende maand.', correct: false, misconception: 'Vindt alle post van school verdacht.' }
        ],
        feedback: 'Prima gekozen. De vraag om een pincode is altijd fout.'
      },
      {
        prompt: 'Als een mail netjes geschreven is, kan het geen phishing zijn.',
        waar: false,
        leerdoel: LD_3_2[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Ook een nette mail kan van een oplichter komen.'
      },
      {
        prompt: 'Iemand maakt met jouw naam en foto een nepaccount en vraagt jouw vrienden om geld. Hoe heet dat?',
        leerdoel: LD_3_2[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Hacken, want hij komt in een account van iemand anders.', correct: false, misconception: 'Denkt dat er altijd een account gekraakt wordt.' },
          { text: 'Nepnieuws, want hij verspreidt iets wat helemaal niet klopt.', correct: false, misconception: 'Verwart een nagemaakt profiel met een onwaar bericht.' },
          { text: 'Identiteitsfraude.', correct: true, explanation: 'Hij gebruikt jou als vermomming.' },
          { text: 'Cyberpesten, want hij doet iets gemeens met jouw naam.', correct: false, misconception: 'Ziet elk misbruik van je naam als pesten.' }
        ],
        feedback: 'Precies. Er hoeft niets gekraakt te worden voor deze truc.'
      },
      {
        prompt: 'Een cybercrimineel is iemand die online gegevens van anderen steelt.',
        waar: true,
        leerdoel: LD_3_2[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt precies. Hij werkt digitaal en niet met een breekijzer.'
      },
      {
        prompt: 'Waarom kan een foto die je weghaalt tóch blijven bestaan?',
        leerdoel: LD_3_3[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat iemand er al een schermafbeelding van maakte.', correct: true, explanation: 'Die kopie is niet meer van jou.' },
          { text: 'Omdat de app hem pas na precies één jaar echt weghaalt.', correct: false, misconception: 'Denkt dat verwijderen met een vaste termijn werkt.' },
          { text: 'Omdat je zelf per ongeluk op de verkeerde knop hebt gedrukt.', correct: false, misconception: 'Zoekt de oorzaak bij een eigen fout.' },
          { text: 'Omdat je telefoon eerst nog opnieuw opgestart moet worden.', correct: false, misconception: 'Denkt dat het aan het apparaat ligt.' }
        ],
        feedback: 'Goed geredeneerd. Over kopieën van anderen ga jij niet.'
      },
      {
        prompt: 'Alle sporen die je online achterlaat heten samen je digitale voetafdruk.',
        waar: true,
        leerdoel: LD_3_3[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Juist. Ook sporen die anderen over jou plaatsen tellen mee.'
      },
      {
        prompt: 'Je account staat op privé, maar 80 volgers ken je niet echt. Wat doe je?',
        leerdoel: LD_3_3[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Niets, want de schakelaar staat toch al goed op privé.', correct: false, misconception: 'Denkt dat de schakelaar ook oude volgers weghaalt.' },
          { text: 'Ik haal die 80 onbekende volgers weg.', correct: true, explanation: 'Anders kijken ze gewoon door.' },
          { text: 'Ik zet er in mijn bio bij dat ik ze eigenlijk niet ken.', correct: false, misconception: 'Denkt dat een zin in de bio iets afsluit.' },
          { text: 'Ik maak snel een tweede account voor alleen mijn echte vrienden.', correct: false, misconception: 'Lost het op met een nieuw account en laat het oude open.' }
        ],
        feedback: 'Goed aangepakt. Opruimen hoort bij op privé zetten.'
      },
      {
        prompt: 'De privacy-knop van een app staat altijd in je bio.',
        waar: false,
        leerdoel: LD_3_3[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed. Hij staat bij Privacy of bij Account in de instellingen.'
      },
      {
        prompt: 'Welke drie gegevens deel je liever niet online?',
        leerdoel: LD_3_3[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je lievelingskleur, je lievelingsdier en je lievelingsfilm.', correct: false, misconception: 'Ziet onschuldige voorkeuren als gevoelige gegevens.' },
          { text: 'De naam van je hond, je favoriete game en je bandshirt.', correct: false, misconception: 'Denkt dat hobbys iets over je locatie verraden.' },
          { text: 'Je adres, je rooster en je handtekening.', correct: true, explanation: 'Die zeggen waar je bent en wie je bent.' },
          { text: 'Je favoriete vak op school, je pauzehap en je muzieksmaak.', correct: false, misconception: 'Verwart persoonlijke smaak met persoonsgegevens.' }
        ],
        feedback: 'Sterk gekozen. Waar, wanneer en wie: die drie houd je binnen.'
      },
      {
        prompt: 'Waarom is een foto van je rijbewijs op sociale media niet slim? Noem twee redenen.',
        type: 'open',
        leerdoel: LD_3_3[2],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Op zo een foto staan mijn naam en mijn geboortedatum. Daarmee kan iemand zich voordoen als mij. Ook mijn handtekening staat erop. Die kan iemand namaken. Een cybercrimineel kan met die gegevens dus dingen op mijn naam doen.',
        nakijkpunten: [
          'Er staan twee verschillende redenen in, niet twee keer dezelfde.',
          'Er wordt minstens één echt gegeven genoemd dat op het pasje staat.',
          'Er staat bij wat iemand anders met die gegevens zou kunnen doen.'
        ],
        feedback: 'Goed uitgelegd. Je noemt het gegeven én het gevaar erbij.'
      },
      {
        prompt: 'Wat is de eerste stap bij een verdacht bericht?',
        leerdoel: LD_3_4[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De link openen om te kijken waar hij naartoe leidt.', correct: false, misconception: 'Wil eerst kijken en pas daarna oordelen.' },
          { text: 'Terugschrijven met de vraag wie dit bericht gestuurd heeft.', correct: false, misconception: 'Gaat in gesprek met de afzender van het nepbericht.' },
          { text: 'Niets aanklikken en niets invullen.', correct: true, explanation: 'Daarna pas ga je checken.' },
          { text: 'Het bericht doorsturen naar de groepsapp van je hele klas.', correct: false, misconception: 'Deelt het bericht en vergroot zo het bereik.' }
        ],
        feedback: 'Precies. Stap één is bij elk verdacht bericht hetzelfde.'
      },
      {
        prompt: 'Bij een verdacht bericht bel je met een nummer dat je al kende.',
        waar: true,
        leerdoel: LD_3_4[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Het nummer uit het bericht is van de oplichter zelf.'
      },
      {
        prompt: 'In een groepschat gaat een bewerkte foto van een klasgenoot rond. Wat doe je?',
        leerdoel: LD_3_4[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Schermafbeelding maken, blokkeren en melden.', correct: true, explanation: 'Bewijs, dan dicht, dan hulp erbij.' },
          { text: 'Doorsturen met de tekst dat jij het zelf ook heel erg vindt.', correct: false, misconception: 'Denkt dat meeleven het doorsturen goedmaakt.' },
          { text: 'Er niets van zeggen en de groepschat gewoon zelf verlaten.', correct: false, misconception: 'Denkt dat weggaan hetzelfde is als ingrijpen.' },
          { text: 'Zelf een grappige foto terugsturen naar diezelfde groepschat.', correct: false, misconception: 'Reageert op pesten met nog meer pesten.' }
        ],
        feedback: 'Goede keuze. Deze drie stappen houden de foto juist tegen.'
      },
      {
        prompt: 'Kun je alles geloven wat op internet staat?',
        leerdoel: LD_3_4[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ja, want mensen schrijven meestal gewoon op wat er echt is.', correct: false, misconception: 'Gaat ervan uit dat iedereen online eerlijk is.' },
          { text: 'Nee, dat is niet verstandig.', correct: true, explanation: 'Nepnieuws gaat juist heel snel rond.' },
          { text: 'Ja, als een bericht maar heel vaak gedeeld is door anderen.', correct: false, misconception: 'Verwart populair zijn met waar zijn.' }
        ],
        feedback: 'Goed. Te mooi om waar te zijn is het meestal ook.'
      },
      {
        prompt: 'Een schermafbeelding van je instellingen is bewijs dat je iets gedaan hebt.',
        waar: true,
        leerdoel: LD_3_4[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'Klopt. Op bewijs moet te zien zijn wát er gelukt is.'
      },
      {
        prompt: 'Beschrijf drie dingen die jij doet om je gegevens online te beschermen.',
        type: 'open',
        leerdoel: LD_3_4[1],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Eén: ik gebruik per account een ander wachtwoord van minstens 12 tekens. Twee: op mijn mail staat twee-staps-verificatie aan. Drie: mijn Insta staat op privé en ik ken al mijn volgers. Zo komt niemand zomaar bij mijn gegevens.',
        nakijkpunten: [
          'Er staan drie verschillende maatregelen in.',
          'Minstens één maatregel gaat over wachtwoorden of over de tweede stap.',
          'Minstens één maatregel gaat over wat de leerling deelt of op privé zet.'
        ],
        feedback: 'Sterke afsluiting. Drie lagen samen maken je echt weerbaar.'
      },
      {
        prompt: 'Gevoelige informatie deel je nooit met iemand die je niet kent.',
        waar: true,
        leerdoel: LD_3_3[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed. Dit is een van de vaste regels uit dit hoofdstuk.'
      },
      {
        prompt: 'Je wachtwoorden verander je regelmatig, ook als er niets misging.',
        waar: true,
        leerdoel: LD_3_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Zo opent een oud lek later geen deur meer.'
      },
      {
        prompt: 'Op een linkje in een onbekende mail mag je gerust klikken.',
        waar: false,
        leerdoel: LD_3_3[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Klik nooit zomaar, ook niet uit nieuwsgierigheid.'
      }
    ]
  }
};
