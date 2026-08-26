// Verrijkingslaag hoofdstuk 1 - Startklaar op je nieuwe school.
// Basisberoepsgerichte leerweg (bb).
//
// Zie scripts/seed-verrijking/PATROON.md voor het formaat van een vraag, de
// regels over afleiders en de eisen aan feedback.
//
// LET OP - BEWUSTE AFWIJKING VAN DE BRON (geen dekkingsfout)
//   De bron (Wikiwijs les 0) behandelt ItsLearning als losse ELO naast
//   SOMtoday. DaCapo College gebruikt dat systeem in schooljaar 2026-2027 niet
//   meer: opdrachten en inleveren lopen nu via de ELO van SOMtoday. Alle stof
//   over de losse ELO is daarom bewust omgezet naar de ELO van SOMtoday.
//
// Dit hoofdstuk heeft in bb VIJF paragrafen: 1.1, 1.2, 1.3, 1.4 en het
// checkpoint 1.5. 1.6 is de vrijwillige plusparagraaf van de theoretische
// leerweg en hoort hier niet. 1.1 is dus de eerste paragraaf en kijkt nergens
// op terug; 1.2, 1.3 en 1.4 hebben elk een terugkeervraag naar een eerdere
// paragraaf.
//
// Opzet per paragraaf, volgens de blauwdruk en het bb-profiel:
//   - elk leerdoel heeft zijn EIGEN startvraag. Die staan als `checks` in
//     scripts/seed-structuur/bb/h1.mjs, met antwoord en uitleg erbij;
//   - elk theorieblok heeft een uitgewerkt voorbeeld in vraag-en-antwoordvorm.
//     Dat voorbeeld komt VOOR het oefenblok en dus voor het zelfstandig
//     oefenen. In bb is het altijd een situatie uit hun eigen wereld: een pasje
//     dat je niet snapt, een briefje in een etui, een appje aan een docent;
//   - elke afsluitquiz vanaf 1.2 haalt minstens één leerdoel op uit een EERDERE
//     paragraaf van dit hoofdstuk. In 1.2 is dat vraag 9 (het ene schoolaccount,
//     leerdoel 1 van 1.1), in 1.3 vraag 9 (je wachtwoord nooit weggeven,
//     leerdoel 3 van 1.2) en in 1.4 vraag 9 (de aanhef, leerdoel 1 van 1.3);
//   - de hoofdstuktoets van 1.5 bevraagt alle VEERTIEN verplichte leerdoelen van
//     1.1, 1.2, 1.3, 1.4 en 1.5. Tien ervan komen twee keer terug.
//
// BB-VORM: VEEL KLEINE MOMENTEN
// -----------------------------
// Het bb-profiel zegt: vorm gaat voor inhoud, en een leerling moet elke minuut
// iets kunnen aanklikken. Daarom staan er veel korte vragen in plaats van een
// paar grote. Geteld over heel hoofdstuk 1 in bb: 33 meerkeuze, 26
// waar-niet-waar en 6 open vragen op 65 vragen totaal. Veertig procent van de
// vragen is dus een korte goed-of-fout-knop. Elke afsluitquiz heeft tien of elf
// vragen en de hoofdstuktoets er 24, zodat de tokens over veel kleine momenten
// verdeeld worden in plaats van over een paar dikke vragen aan het eind.
//
// De reden waarom een antwoord goed is staat in `explanation`, niet in de
// antwoordtekst zelf. Feedback is kort, positief en benoemt wat er goed ging.
//
// RAADBAARHEID OP VORM
// --------------------
// De afleiders zijn met opzet langer geschreven dan het goede antwoord: blind de
// langste knop klikken levert in dit hoofdstuk niets op. Het goede antwoord
// staat gespreid over positie 1 tot en met 4, en de waar-niet-waar-stellingen
// zijn ongeveer half waar en half niet waar.
//
// De bb-vragen zijn opnieuw geschreven en niet overgenomen uit kb/h1.mjs of
// tl/h1.mjs: kortere zinnen, één idee per vraag en voorbeelden uit de leefwereld
// van een brugklasser. De vier vragen van de originele afsluittoets van
// DigiChallenge 1 (wikiwijs 8287245) staan in de quiz van 1.4, met dezelfde
// antwoordopties maar in bb-taal.

const LD_1_1 = [
  'Je kunt inloggen op je schoolaccount, het wifi-netwerk van school en Office 365.',
  'Je weet waar in SOMtoday je rooster, cijfers en opdrachten staan.',
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
          '<p><strong>Vraag.</strong> Jaylen krijgt zijn schoolpas. Daarop staat 205914@dacapocollege.nl. Hij typt dat hele adres in bij gebruikersnaam. De computer laat hem er niet in. Wat doet Jaylen fout?</p>',
          '<p><strong>Antwoord.</strong> Jaylen typt te veel. Bij gebruikersnaam hoort alleen 205914. Dat is het deel vóór de @. De rest van het adres hoort bij zijn mailbox. Het is geen inlognaam. Jaylen typt dus 205914 en daaronder zijn eigen wachtwoord. Datzelfde paar werkt ook op het wifi. En het werkt in Office 365.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['SOMtoday', 'ELO', 'screenshot'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Fatima is maandag ziek geweest. Ze wil twee dingen weten. Wanneer haalt ze de toets in? En welke opdracht heeft ze gemist? Waar zoekt ze wat?</p>',
          '<p><strong>Antwoord.</strong> Fatima splitst haar vraag in tweeën. De toets gaat over tijd en cijfers. Dat staat bij haar rooster in SOMtoday. De gemiste opdracht hoort bij de les. Die staat in de ELO. Ze levert de opdracht daar ook in. Van de bevestiging maakt ze een screenshot. Dan heeft ze bewijs dat ze op tijd was.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Je hebt op school één account voor alles. Bij gebruikersnaam typ je alleen je leerlingnummer. Daarmee kom je ook op het wifi-netwerk van school en in Office 365. In SOMtoday staan je rooster en je cijfers. Je opdrachten staan daar ook, in de ELO. Daar lever je ze ook in. Van je bevestiging maak je een foto van je scherm met Windows, Shift en S.</p>',
      keyTerms: ['gebruikersnaam', 'wifi-netwerk']
    },
    vragen: [
      {
        prompt: 'Bij gebruikersnaam typ je je hele schoolmailadres in.',
        waar: false,
        leerdoel: LD_1_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Goed gezien. Alleen het stuk vóór de @ hoort daar.'
      },
      {
        prompt: 'Wat typ je op een schoolcomputer bij gebruikersnaam?',
        leerdoel: LD_1_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Je hele mailadres, dus ook alles wat achter de @ staat.', correct: false, misconception: 'Denkt dat het mailadres en de inlognaam hetzelfde zijn.' },
          { text: 'Alleen je leerlingnummer.', correct: true, explanation: 'Dat is het deel dat vóór de @ van je schoolmailadres staat.' },
          { text: 'Je voornaam en je achternaam, net zoals ze op je pasje staan.', correct: false, misconception: 'Denkt dat je met je eigen naam inlogt.' },
          { text: 'De naam van je mentor, want die staat in het adresboek van school.', correct: false, misconception: 'Verwart inloggen met het opzoeken van een mailadres.' }
        ],
        feedback: 'Prima. Kijk altijd naar het stuk vóór de @ op je pasje.'
      },
      {
        prompt: 'Met hetzelfde schoolaccount kom je ook op het wifi van school.',
        waar: true,
        leerdoel: LD_1_1[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Klopt helemaal. Eén account opent alle deuren van school.'
      },
      {
        prompt: 'Waar vind je je rooster en je cijfers?',
        leerdoel: LD_1_1[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'In OneDrive, want daar staan al je opgeslagen bestanden bij elkaar.', correct: false, misconception: 'Verwart een opslagplek met de administratie van school.' },
          { text: 'In Outlook, want daar komen alle berichten van school binnen.', correct: false, misconception: 'Denkt dat een roosterwijziging altijd per mail komt.' },
          { text: 'In de ELO, want daar zet je docent zijn lesmateriaal neer.', correct: false, misconception: 'Haalt de leeromgeving en de administratie door elkaar.' },
          { text: 'In SOMtoday.', correct: true, explanation: 'Daar staan je rooster, je absentie en je cijfers bij elkaar.' }
        ],
        feedback: 'Mooi. Gaat het over tijd of cijfers? Dan is het SOMtoday.'
      },
      {
        prompt: 'Je opdrachten lever je in via de ELO in SOMtoday.',
        waar: true,
        leerdoel: LD_1_1[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Sterk. De ELO is de leeromgeving van je vakken.'
      },
      {
        prompt: 'Welke drie toetsen druk je op Windows samen in voor een screenshot?',
        leerdoel: LD_1_1[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De Windows-toets, Shift en S.', correct: true, explanation: 'Je scherm wordt dan grijs en je sleept zelf een vak.' },
          { text: 'Ctrl, Alt en Delete, net zoals wanneer je een programma afsluit.', correct: false, misconception: 'Verwart de screenshot-sneltoets met het scherm om af te sluiten.' },
          { text: 'Ctrl, C en V, want daarmee kopieer en plak je een stuk tekst.', correct: false, misconception: 'Denkt dat kopiëren hetzelfde is als een schermfoto maken.' }
        ],
        feedback: 'Goed onthouden. Windows, Shift en S: dat is de vaste greep.'
      },
      {
        prompt: 'Na de sneltoets staat je screenshot vanzelf in je Word-bestand.',
        waar: false,
        leerdoel: LD_1_1[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Je moet hem zelf nog plakken met Ctrl en V.'
      },
      {
        prompt: 'Wat doe je als het inloggen twee keer achter elkaar niet lukt?',
        leerdoel: LD_1_1[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je leent snel het account van een klasgenoot die al ingelogd is.', correct: false, misconception: 'Denkt dat een geleend account een oplossing is.' },
          { text: 'Je let op de hoofdletters en op de nul en de o.', correct: true, explanation: 'Die twee tekens lijken op elkaar en gaan het vaakst mis.' },
          { text: 'Je maakt zelf een nieuw account aan met een ander leerlingnummer erbij.', correct: false, misconception: 'Denkt dat je zelf een schoolaccount kunt aanmaken.' },
          { text: 'Je wacht rustig tot de volgende les en probeert het dan opnieuw.', correct: false, misconception: 'Wacht af in plaats van hulp te vragen bij de helpdesk.' }
        ],
        feedback: 'Goed bezig. Lukt het daarna nog niet? Vraag dan hulp.'
      },
      {
        prompt: 'Waar zet je een melding aan voor een nieuw cijfer?',
        leerdoel: LD_1_1[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'In de ELO, bij het vak waar de toets van die dag bij hoorde.', correct: false, misconception: 'Zoekt de cijfers bij het vak in plaats van in de administratie.' },
          { text: 'In Outlook, bij de instellingen van je eigen postvak van school.', correct: false, misconception: 'Denkt dat meldingen bij je mailprogramma horen.' },
          { text: 'In SOMtoday, via het menu, Instellingen en Meldingen.', correct: true, explanation: 'Daar zet je met schuifjes aan waarover je bericht wilt.' }
        ],
        feedback: 'Netjes gevonden. Zo mis je geen roosterwijziging meer.'
      },
      {
        prompt: 'Leg in twee zinnen uit waarom je het account van een klasgenoot nooit leent.',
        type: 'open',
        leerdoel: LD_1_1[0],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Alles wat ik op zijn account doe, komt op zijn naam te staan. Gaat er iets mis, dan krijgt hij daar gedoe over. Ik log dus altijd zelf in met mijn eigen leerlingnummer.',
        nakijkpunten: [
          'Er staat dat alles op naam van de eigenaar van het account komt.',
          'Er staat wat je in plaats daarvan doet: zelf inloggen met je eigen gegevens.'
        ],
        feedback: 'Fijn uitgelegd. Je noemt precies wie er last van krijgt.'
      }
    ]
  },

  '1.2': {
    learningGoals: LD_1_2,
    theorie: [
      {
        keyTerms: ['wachtwoordzin', 'raadprogramma'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sem kiest het wachtwoord Feyenoord2012!. Hij zegt: hier zit een hoofdletter in, en een cijfer, en een uitroepteken. Dus dit is sterk. Heeft Sem gelijk?</p>',
          '<p><strong>Antwoord.</strong> Nee, Sem heeft geen gelijk. Zijn wachtwoord is maar veertien tekens. En het verraadt zijn club en een jaartal. Dat weet zijn hele klas al. Beter is een wachtwoordzin. Bijvoorbeeld: gele stoel eet regen. Die telt twintig tekens. Een raadprogramma heeft daar veel langer werk aan.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['wachtwoordkluis', 'wachtwoordportaal'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Iris schrijft haar wachtwoord in een notitie op haar telefoon. Er zit geen slot op die notitie. Ze zegt: mijn telefoon ligt toch nooit ergens. Is dit veilig genoeg?</p>',
          '<p><strong>Antwoord.</strong> Nee. Stel één vraag: kan iemand anders hierbij zonder mij? Bij een notitie zonder slot kan dat. Iemand pakt haar telefoon en leest mee. Beter is een wachtwoordkluis. Daar zit alles achter één hoofdwachtwoord. Vergeet Iris haar schoolwachtwoord? Dan gebruikt ze het wachtwoordportaal van school.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een sterk wachtwoord is vooral lang: twaalf tekens of meer. Vier losse woorden achter elkaar werken het best. Gebruik nooit je naam, je verjaardag of je club. Kies voor elke site een uniek wachtwoord. Bewaar het achter een hoofdwachtwoord, en nooit op een briefje. En je geeft het aan niemand, ook niet aan je beste vriend.</p>',
      keyTerms: ['uniek', 'hoofdwachtwoord']
    },
    vragen: [
      {
        prompt: 'Een wachtwoord van vier gewone woorden is sterker dan Fluffy2013!.',
        waar: true,
        leerdoel: LD_1_2[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Precies. Vier woorden zijn samen veel langer dan elf tekens.'
      },
      {
        prompt: 'Wat maakt een wachtwoord vooral sterk?',
        leerdoel: LD_1_2[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Dat het lang is.', correct: true, explanation: 'Bij elk teken erbij duurt raden veel en veel langer.' },
          { text: 'Dat er een uitroepteken achter je eigen naam is gezet.', correct: false, misconception: 'Denkt dat rare tekens belangrijker zijn dan lengte.' },
          { text: 'Dat je het elke week weer een klein beetje verandert.', correct: false, misconception: 'Denkt dat vaak wisselen een zwak wachtwoord sterk maakt.' },
          { text: 'Dat je geboortejaar erin staat, want dat weet toch niemand.', correct: false, misconception: 'Denkt dat persoonlijke gegevens geheim zijn.' }
        ],
        feedback: 'Goed. Lengte is de eerste vraag, de rest komt daarna.'
      },
      {
        prompt: 'Je verjaardag is een goed wachtwoord, want die kent niemand.',
        waar: false,
        leerdoel: LD_1_2[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Goed dat je dit doorhebt. Je verjaardag staat online al.'
      },
      {
        prompt: 'Waar bewaar je je wachtwoord veilig?',
        leerdoel: LD_1_2[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Op een briefje in je etui, want dat heb je altijd bij je.', correct: false, misconception: 'Denkt dat bij je hebben hetzelfde is als veilig bewaren.' },
          { text: 'In een gewone notitie op je telefoon, zonder slot erop.', correct: false, misconception: 'Denkt dat een telefoon vanzelf een veilige plek is.' },
          { text: 'In een wachtwoordkluis.', correct: true, explanation: 'Alles zit daar achter één hoofdwachtwoord dat alleen jij kent.' }
        ],
        feedback: 'Sterk gekozen. Een kluis gaat alleen open met jouw sleutel.'
      },
      {
        prompt: 'Een los briefje in je etui is een veilige bewaarplek.',
        waar: false,
        leerdoel: LD_1_2[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Klopt, dat is niet veilig. Iedereen die kijkt, leest mee.'
      },
      {
        prompt: 'Waarvoor is het wachtwoordportaal van school?',
        leerdoel: LD_1_2[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Om zelf een nieuw wachtwoord in te stellen.', correct: true, explanation: 'Zo kom je er weer in zonder op iemand te wachten.' },
          { text: 'Om te zien welke cijfers je dit jaar tot nu toe gehaald hebt.', correct: false, misconception: 'Verwart het portaal met SOMtoday.' },
          { text: 'Om je huiswerk voor de volgende week in te leveren bij je docent.', correct: false, misconception: 'Verwart het portaal met de ELO.' }
        ],
        feedback: 'Goed. Maak dat account aan vóór je het nodig hebt.'
      },
      {
        prompt: 'Een docent of de ICT-helpdesk vraagt nooit om jouw wachtwoord.',
        waar: true,
        leerdoel: LD_1_2[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Helemaal goed. Zo iemand kan je account ook zonder herstellen.'
      },
      {
        prompt: 'Je vriend vraagt of hij even met jouw account mag inloggen. Wat doe je?',
        leerdoel: LD_1_2[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je geeft het, want jullie kennen elkaar al sinds de basisschool.', correct: false, misconception: 'Denkt dat vertrouwen het risico wegneemt.' },
          { text: 'Je geeft het niet en wijst hem het wachtwoordportaal.', correct: true, explanation: 'Zo help je hem wel, maar geef je je sleutel niet weg.' },
          { text: 'Je geeft het even, maar je verandert het daarna zelf meteen weer.', correct: false, misconception: 'Denkt dat je een gedeeld wachtwoord kunt terugnemen.' }
        ],
        feedback: 'Knap. Helpen kan prima zonder je eigen sleutel af te geven.'
      },
      {
        prompt: 'Voor welke drie plekken gebruik je hetzelfde schoolaccount?',
        leerdoel: LD_1_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Alleen de vaste computers in het computerlokaal van de school.', correct: false, misconception: 'Denkt dat het account alleen op schoolcomputers werkt.' },
          { text: 'Alleen je eigen laptop, want die staat op jouw naam.', correct: false, misconception: 'Denkt dat het account aan één apparaat vastzit.' },
          { text: 'Je telefoon, je spelcomputer thuis en de laptop van je ouders.', correct: false, misconception: 'Verwart een schoolaccount met je eigen apparaten thuis.' },
          { text: 'De computers, het wifi en Office 365.', correct: true, explanation: 'Dat is precies waarom dat ene wachtwoord sterk moet zijn.' }
        ],
        feedback: 'Goed teruggehaald uit 1.1. Eén sleutel, drie deuren.'
      },
      {
        prompt: 'Bedenk een sterke wachtwoordzin en leg in twee zinnen uit waarom hij sterk is.',
        type: 'open',
        leerdoel: LD_1_2[0],
        denkniveau: 'maken_controleren',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Mijn zin is: stille bank eet donder. Dat zijn eenentwintig tekens, met de spaties meegeteld. Hij is sterk omdat hij lang is. En er staat geen woord in dat iets over mij zegt.',
        nakijkpunten: [
          'De zin bestaat uit vier woorden en telt twaalf tekens of meer.',
          'De uitleg noemt de lengte als reden.',
          'De uitleg noemt dat er niets persoonlijks in de zin staat.'
        ],
        feedback: 'Mooie zin. Je noemt de lengte én dat hij niets verraadt.'
      }
    ]
  },

  '1.3': {
    learningGoals: LD_1_3,
    theorie: [
      {
        keyTerms: ['Outlook', 'onderwerp'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Nour zit in de bus. Ze heeft geen internet. Ze wil nu alvast een mail typen aan haar mentor. Kan dat, en hoe doet ze dat?</p>',
          '<p><strong>Antwoord.</strong> Dat kan, maar alleen in de app. De app van Outlook werkt ook offline. Ze typt haar bericht en zet er een onderwerp bij. De mail blijft klaarstaan. Zodra Nour weer internet heeft, gaat hij weg. In de browser zou dit niet lukken, want daar heb je internet voor nodig.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['aanhef', 'interpunctie', 'afsluiting'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Bilal stuurt zijn mentor dit bericht: ey meneer wanneer is de toets nou groetjes. Zijn mentor snapt niet wie er schrijft. Wat mist er in dit bericht?</p>',
          '<p><strong>Antwoord.</strong> Er missen vier dingen. Er is geen aanhef, dus geen Beste meneer Jansen. Bilal zegt niet wie hij is en in welke klas hij zit. Er is geen interpunctie: geen hoofdletters en geen punten. En er is geen nette afsluiting met zijn naam. Netjes wordt het zo: Beste meneer Jansen, mijn naam is Bilal uit 1B. Wanneer is de toets? Met vriendelijke groet, Bilal Aydin, klas 1B.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Outlook gebruik je in de app of in je browser. Je begint een bericht met de knop Nieuwe e-mail. Bovenin vul je het adres en de titel van je mail in. Daarna komen de aanhef, wie je bent, je boodschap en de groet. Schrijf met hoofdletters en punten. Weet je het adres niet? Typ dan de achternaam en klik het goede adres aan. Klik als laatste op Verzenden.</p>',
      keyTerms: ['Verzenden', 'browser']
    },
    vragen: [
      {
        prompt: 'Het onderwerp van je mail is de titel die je docent als eerste ziet.',
        waar: true,
        leerdoel: LD_1_3[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Juist. In zijn postvak ziet hij alleen die ene regel.'
      },
      {
        prompt: 'Welk onderwerp typ je bij je allereerste oefenmail?',
        leerdoel: LD_1_3[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'hoi meneer, ik heb een vraag over de les van vandaag', correct: false, misconception: 'Zet de hele boodschap in het onderwerp.' },
          { text: 'mijn eerste email', correct: true, explanation: 'Dat vraagt de opdracht letterlijk, dus precies zo overtypen.' },
          { text: 'geen onderwerp, dat vult Outlook zelf wel automatisch in', correct: false, misconception: 'Denkt dat het onderwerp niet nodig is.' }
        ],
        feedback: 'Goed overgetypt. Precies deze woorden vraagt de opdracht.'
      },
      {
        prompt: 'Outlook werkt alleen als je internet hebt.',
        waar: false,
        leerdoel: LD_1_3[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Goed opgelet. In de app kun je offline alvast typen.'
      },
      {
        prompt: 'Waarmee begin je een mail aan je docent?',
        leerdoel: LD_1_3[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Met Beste meneer of Beste mevrouw en de achternaam.', correct: true, explanation: 'Dat is de aanhef, en die krijgt een hoofdletter en een komma.' },
          { text: 'Met yo of hey, net zoals je dat in een groepsapp doet.', correct: false, misconception: 'Gebruikt de toon van een appje in een mail.' },
          { text: 'Met je eigen naam en je klas, zodat de lezer weet wie je bent.', correct: false, misconception: 'Zet het voorstellen vóór de aanhef.' }
        ],
        feedback: 'Netjes. Eerst aanspreken, daarna pas zeggen wie je bent.'
      },
      {
        prompt: 'Onder je mail zet je Met vriendelijke groet, je naam en je klas.',
        waar: true,
        leerdoel: LD_1_3[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Klopt. Zo weet je docent meteen bij wie hij moet zijn.'
      },
      {
        prompt: 'Wat is interpunctie?',
        leerdoel: LD_1_3[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De plaatjes die je in je bericht zet om het leuker te maken.', correct: false, misconception: 'Verwart interpunctie met emoji of afbeeldingen.' },
          { text: 'De punten en de komma\'s in je tekst.', correct: true, explanation: 'Samen met hoofdletters maken ze je bericht leesbaar.' },
          { text: 'De witregel tussen twee stukken tekst in een langere mail.', correct: false, misconception: 'Verwart interpunctie met de indeling in paragrafen.' }
        ],
        feedback: 'Goed. Punten en komma\'s houden je zinnen uit elkaar.'
      },
      {
        prompt: 'Bij Aan typ je de achternaam als je het adres niet weet.',
        waar: true,
        leerdoel: LD_1_3[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Slim. Outlook zoekt dan mee in het adresboek van school.'
      },
      {
        prompt: 'Er staan drie mensen met dezelfde achternaam in het lijstje. Wat doe je?',
        leerdoel: LD_1_3[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je kiest de bovenste naam, want die staat er niet voor niets.', correct: false, misconception: 'Denkt dat de volgorde in de lijst iets betekent.' },
          { text: 'Je stuurt je mail voor de zekerheid maar naar alle drie.', correct: false, misconception: 'Lost twijfel op door iedereen te mailen.' },
          { text: 'Je kijkt naar de voorletter van jouw docent.', correct: true, explanation: 'Die voorletter staat ook gewoon in SOMtoday.' }
        ],
        feedback: 'Goed nagekeken. Een verkeerd verstuurde mail komt niet terug.'
      },
      {
        prompt: 'Je krijgt een mail met de vraag om je wachtwoord. Wat doe je?',
        leerdoel: LD_1_2[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Je stuurt niets terug en meldt de mail.', correct: true, explanation: 'School vraagt nooit om je wachtwoord, ook niet per mail.' },
          { text: 'Je stuurt het alleen als de mail er echt van school uitziet.', correct: false, misconception: 'Denkt dat een echt uitziende mail ook echt is.' },
          { text: 'Je stuurt het snel terug, want anders raak je je account kwijt.', correct: false, misconception: 'Laat zich opjagen door een dreigend bericht.' }
        ],
        feedback: 'Goed teruggehaald uit 1.2. Hoe het eruitziet, zegt niets.'
      },
      {
        prompt: 'Herschrijf dit bericht netjes als schoolmail: ey meneer wanneer is de toets nou groetjes.',
        type: 'open',
        leerdoel: LD_1_3[1],
        denkniveau: 'maken_controleren',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Beste meneer Jansen, mijn naam is Nour en ik zit in klas 1C. Kunt u mij laten weten in welke week de toets is? Met vriendelijke groet, Nour el Amrani, klas 1C.',
        nakijkpunten: [
          'Er staat een aanhef met Beste en de achternaam van de docent.',
          'De schrijver noemt zijn naam en zijn klas.',
          'Er staat een afsluiting met Met vriendelijke groet, naam en klas.'
        ],
        feedback: 'Netjes herschreven. De vraag bleef, de toon werd beter.'
      }
    ]
  },

  '1.4': {
    learningGoals: LD_1_4,
    theorie: [
      {
        keyTerms: ['digitale geletterdheid', 'mediawijsheid', 'DigiChallenge'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> De broer van Yara zegt: jullie zitten toch altijd op je telefoon? Waarom krijg jij dan les in digitale dingen? Wat kan Yara antwoorden?</p>',
          '<p><strong>Antwoord.</strong> Yara zegt: gebruiken en snappen is niet hetzelfde. Ik leer het om drie redenen. Eén: ik maak mijn schoolwerk er beter mee. Twee: ik hou mijn gegevens veilig. Drie: ik leer zien wat online echt is. Vorige week trapte mijn oom nog in een nepbericht. Dat wil ik niet.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['omgangsregel', 'bron', 'cloud'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Tygo vindt op nos.nl een mooi stukje over nepnieuws. Hij wil het op zijn poster zetten. Hij kopieert en plakt het. Mag dat zomaar?</p>',
          '<p><strong>Antwoord.</strong> Nee, dat mag niet zomaar. Tygo schrijft het eerst in zijn eigen woorden op. Hij leest het stukje, kijkt weg en schrijft het na. Gebruikt hij toch een groot stuk letterlijk? Dan zet hij de NOS erbij. De NOS is de bron, want die heeft de tekst gemaakt. Google is alleen de zoekmachine.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Digitale geletterdheid is veilig, handig en kritisch omgaan met internet. Je leert het voor je schoolwerk, voor je eigen veiligheid en om nep te herkennen. Het vak bestaat uit vier stukken: knoppen, zoeken, omgaan met elkaar en denken in stappen. Een omgangsregel zegt hoe je met elkaar omgaat, ook online. Teksten van internet schrijf je in eigen woorden over, anders noem je de maker erbij. Je plaatjes zoek je met zoektermen en je bewaart ze versleuteld op internet.</p>',
      keyTerms: ['zoektermen', 'versleuteld']
    },
    vragen: [
      {
        prompt: 'Wat betekent digitale geletterdheid?',
        leerdoel: LD_1_4[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Dat je in geheime taal kunt schrijven die niemand anders leest.', correct: false, misconception: 'Denkt bij digitaal aan geheimschrift.' },
          { text: 'Hoe je de tijd afleest van een digitale klok die op je telefoon staat.', correct: false, misconception: 'Denkt bij digitaal alleen aan cijfers op een scherm.' },
          { text: 'Veilig, handig en kritisch omgaan met internet op je device.', correct: true, explanation: 'Veilig, handig en kritisch: die drie horen er alle drie bij.' }
        ],
        feedback: 'Goed. Dit is de vraag uit de afsluittoets van les 1.'
      },
      {
        prompt: 'Waarom leer je digitale vaardigheden?',
        leerdoel: LD_1_4[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Om veilig te blijven, beter te werken en nep te herkennen.', correct: true, explanation: 'Dat zijn precies de drie redenen uit de theorie.' },
          { text: 'Zodat ik goed kan leren typen en beter word in het gamen.', correct: false, misconception: 'Denkt dat het vak over typen en games gaat.' },
          { text: 'Zodat ik mijn schoolwerk beter kan maken, en verder niets.', correct: false, misconception: 'Noemt maar één van de drie redenen.' }
        ],
        feedback: 'Prima. Alle drie de redenen komen dit jaar steeds terug.'
      },
      {
        prompt: 'Digitale geletterdheid bestaat uit vier stukken.',
        waar: true,
        leerdoel: LD_1_4[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Klopt. Knoppen, zoeken, omgaan met elkaar en stappen.'
      },
      {
        prompt: 'Wat betekent het woord omgangsregel?',
        leerdoel: LD_1_4[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Een regel die alleen op school geldt en verder nergens anders.', correct: false, misconception: 'Denkt dat omgangsregels alleen schoolregels zijn.' },
          { text: 'Een afspraak over hoe je met elkaar omgaat.', correct: true, explanation: 'Omgang betekent letterlijk: hoe je met elkaar omgaat.' },
          { text: 'Een regel over hoe laat je naar bed moet als je school hebt.', correct: false, misconception: 'Denkt bij regel aan een huisregel van thuis.' }
        ],
        feedback: 'Goed. Ook dit is een vraag uit de afsluittoets van les 1.'
      },
      {
        prompt: 'Omgangsregels gelden alleen in de klas en niet online.',
        waar: false,
        leerdoel: LD_1_4[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Goed opgelet. Aan de andere kant zit ook online een mens.'
      },
      {
        prompt: 'Mag je teksten van internet zomaar overnemen?',
        leerdoel: LD_1_4[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ja, alles wat op internet staat is gratis en dus vrij te gebruiken.', correct: false, misconception: 'Denkt dat gratis lezen hetzelfde is als vrij gebruiken.' },
          { text: 'Ja, zolang je maar niet meer dan tien regels tegelijk overneemt.', correct: false, misconception: 'Denkt dat een klein stukje overnemen altijd mag.' },
          { text: 'Nee, je schrijft het in je eigen woorden en noemt de bron.', correct: true, explanation: 'In eigen woorden schrijven zorgt dat je het zelf ook snapt.' }
        ],
        feedback: 'Sterk. De derde vraag uit de afsluittoets, en goed ook.'
      },
      {
        prompt: 'De bron is de persoon of organisatie die de tekst gemaakt heeft.',
        waar: true,
        leerdoel: LD_1_4[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Juist. De maker van de tekst, en niet de zoekmachine.'
      },
      {
        prompt: 'Je vond een tekst via Google op de site van de NOS. Wie is de bron?',
        leerdoel: LD_1_4[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Google, want daarmee heb je de tekst gevonden.', correct: false, misconception: 'Verwart de zoekmachine met de maker van de tekst.' },
          { text: 'De NOS.', correct: true, explanation: 'De NOS heeft de tekst geschreven, dus die is de maker.' },
          { text: 'Je browser, want daarin heb je de pagina geopend en gelezen.', correct: false, misconception: 'Verwart het venster waarin je leest met de maker.' }
        ],
        feedback: 'Mooi. Vraag jezelf steeds af: wie heeft dit geschreven?'
      },
      {
        prompt: 'Een mail aan je docent begint met een aanhef.',
        waar: true,
        leerdoel: LD_1_3[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'reflecteren',
        feedback: 'Goed onthouden uit 1.3. Eerst aanspreken, dan de rest.'
      },
      {
        prompt: 'Bij welk stuk van dit vak hoort het inloggen op je laptop?',
        leerdoel: LD_1_4[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Bij de ict-basisvaardigheden.', correct: true, explanation: 'Dat stuk gaat over de knoppen: inloggen, mailen en opslaan.' },
          { text: 'Bij mediawijsheid, want dat gaat over omgaan met anderen.', correct: false, misconception: 'Kiest mediawijsheid voor alles wat met een scherm te maken heeft.' },
          { text: 'Bij de informatievaardigheden, dus bij zoeken en bronnen.', correct: false, misconception: 'Denkt dat elk stuk over internet informatievaardigheid is.' }
        ],
        feedback: 'Goed geplaatst. Knoppen indrukken hoort bij stuk nummer 1.'
      },
      {
        prompt: 'Bedenk twee omgangsregels voor een groepsapp en leg uit waarom ze nodig zijn.',
        type: 'open',
        leerdoel: LD_1_4[1],
        denkniveau: 'maken_controleren',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Regel 1: je zet geen foto van een ander in de groep. Dat doe je pas na toestemming. Niet iedereen wil namelijk op een foto staan. Regel 2: je scheldt niemand uit in de groep. Dat is nodig, omdat een bericht blijft staan en steeds opnieuw gelezen wordt.',
        nakijkpunten: [
          'Er staan twee regels die echt over omgaan met elkaar gaan.',
          'Bij elke regel staat waarom die nodig is.',
          'De regels zeggen wat je doet, en niet alleen wat verboden is.'
        ],
        feedback: 'Goede regels. Je zegt er ook duidelijk bij waarom.'
      }
    ]
  },

  '1.5': {
    learningGoals: LD_1_5,
    theorie: [
      {
        keyTerms: ['ict-basisvaardigheden', 'computational thinking'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Tarik moet bij elk van de vier stukken een opdracht uit dit hoofdstuk noemen. Bij drie lukt het hem. Bij computational thinking loopt hij vast. Wat kan hij noemen?</p>',
          '<p><strong>Antwoord.</strong> Tarik noemt eerst de makkelijke drie. Inloggen en mailen zijn ict-basisvaardigheden. Zoeken naar een plaatje hoort bij informatievaardigheden. De omgangsregels op zijn poster horen bij mediawijsheid. En de vierde? De inlogronde van 1.1 ging in zes stappen. Zo\'n taak opknippen in stappen is computational thinking.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['bestandsnamen', 'diagnose'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Lisa zegt: ik heb alles gedaan, maar ik heb niets om in te leveren. Haar map is leeg. Hoe komt zij toch aan haar checkpointmap?</p>',
          '<p><strong>Antwoord.</strong> Lisa loopt de vier paragrafen langs met een lijstje. Haar poster ligt nog thuis: daar maakt ze een foto van. Haar mail staat in Verzonden items: daar maakt ze nu een screenshot van. Alleen haar wachtwoordkaart is echt weg. Die maakt ze opnieuw. Zo heeft ze in tien minuten toch haar bewijs. Daarna doet ze de diagnose.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Je kunt nu zelf inloggen, mailen en je werk inleveren. In dit checkpoint laat je dat zien met vier bewijsstukken. Werk met een controlelijst, zodat je niets vergeet. Geef elk bestand een duidelijke bestandsnaam, want anders kan je docent het niet nakijken. Schrijf er vijf regels bij over wat je geleerd hebt.</p>',
      keyTerms: ['controlelijst', 'bestandsnaam']
    },
    vragen: [
      {
        prompt: 'Bij gebruikersnaam typ je alleen je leerlingnummer.',
        waar: true,
        leerdoel: LD_1_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed begin van de toets. Dat is het deel vóór de @.'
      },
      {
        prompt: 'Waarmee log je in op het wifi-netwerk van school?',
        leerdoel: LD_1_1[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Met een aparte wificode die op het bord in het lokaal staat.', correct: false, misconception: 'Denkt dat schoolwifi met een losse code werkt.' },
          { text: 'Met je leerlingnummer en je eigen wachtwoord.', correct: true, explanation: 'Het is hetzelfde paar als op de computers van school.' },
          { text: 'Met het account van je mentor, want die heeft meer rechten.', correct: false, misconception: 'Denkt dat je voor wifi een account met meer rechten nodig hebt.' }
        ],
        feedback: 'Goed. Eén account voor de computers, het wifi en Office.'
      },
      {
        prompt: 'Je wilt weten of het derde uur verplaatst is. Waar kijk je?',
        leerdoel: LD_1_1[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'In OneDrive, want daar staan al je schoolbestanden bij elkaar.', correct: false, misconception: 'Zoekt roosterinformatie in een opslagplek.' },
          { text: 'In Outlook, want roosterwijzigingen komen altijd per mail.', correct: false, misconception: 'Denkt dat school elke wijziging mailt.' },
          { text: 'In de ELO, bij het vak dat je dat uur zou hebben gehad.', correct: false, misconception: 'Zoekt het rooster bij het vak in plaats van bij het rooster.' },
          { text: 'Bij je rooster in SOMtoday.', correct: true, explanation: 'Daar staat je rooster, met de wijzigingen erin verwerkt.' }
        ],
        feedback: 'Precies. Vragen over tijd gaan altijd naar je rooster.'
      },
      {
        prompt: 'De ELO in SOMtoday is de plek waar je je opdrachten inlevert.',
        waar: true,
        leerdoel: LD_1_1[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Daar staat ook het lesmateriaal van je docenten.'
      },
      {
        prompt: 'Wat doe je nadat je met Windows, Shift en S een vak gesleept hebt?',
        leerdoel: LD_1_1[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je slaat je hele scherm automatisch op in de map Afbeeldingen.', correct: false, misconception: 'Denkt dat het geknipte beeld zichzelf opslaat.' },
          { text: 'Je hoeft niets meer te doen, want het staat al in je document.', correct: false, misconception: 'Slaat de plakstap over.' },
          { text: 'Je plakt het beeld met Ctrl en V.', correct: true, explanation: 'Tot dat moment staat het alleen op het klembord.' }
        ],
        feedback: 'Goed. Knippen en plakken zijn twee losse stappen.'
      },
      {
        prompt: 'Een screenshot van de bevestiging bewijst dat je op tijd inleverde.',
        waar: true,
        leerdoel: LD_1_1[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Juist. Op dat scherm staan de datum en de tijd erbij.'
      },
      {
        prompt: 'Welk wachtwoord van deze drie is het sterkst?',
        leerdoel: LD_1_2[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Sanne2013!, want daar zit een hoofdletter en een cijfer in.', correct: false, misconception: 'Kiest op rare tekens in plaats van op lengte.' },
          { text: 'gele stoel eet regen', correct: true, explanation: 'Twintig tekens lang, en het zegt niets over de eigenaar.' },
          { text: 'W8woord, want dat is kort en heeft toch een cijfer erin.', correct: false, misconception: 'Denkt dat een bekend trucje een wachtwoord sterk maakt.' }
        ],
        feedback: 'Goed. Kijk eerst naar de lengte, daarna pas naar de tekens.'
      },
      {
        prompt: 'Twaalf tekens is een goede ondergrens voor een wachtwoord.',
        waar: true,
        leerdoel: LD_1_2[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Een zin van vier woorden haalt dat makkelijk.'
      },
      {
        prompt: 'Wat is een wachtwoordkluis precies?',
        leerdoel: LD_1_2[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een app die je wachtwoorden achter één hoofdwachtwoord bewaart.', correct: true, explanation: 'Dat ene hoofdwachtwoord onthoud je zelf en deel je nooit.' },
          { text: 'Een kastje op school waarin de ICT-afdeling alle wachtwoorden bewaart.', correct: false, misconception: 'Denkt dat school jouw wachtwoorden bewaart.' },
          { text: 'Een lijstje in je agenda waarin je al je wachtwoorden opschrijft.', correct: false, misconception: 'Verwart een kluis met een lijstje op papier.' }
        ],
        feedback: 'Goed omschreven. Eén sleutel voor al je andere sleutels.'
      },
      {
        prompt: 'Een document met een eigen wachtwoord erop is een veilige bewaarplek.',
        waar: true,
        leerdoel: LD_1_2[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Zonder dat wachtwoord komt niemand erin.'
      },
      {
        prompt: 'Waarom geef je je wachtwoord aan niemand?',
        leerdoel: LD_1_2[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat je account dan trager wordt en je bestanden verdwijnen.', correct: false, misconception: 'Denkt aan een technisch gevolg in plaats van aan wie er verantwoordelijk is.' },
          { text: 'Omdat alles op jouw account op jouw naam komt.', correct: true, explanation: 'Ook een fout van een ander staat dan op jouw naam.' },
          { text: 'Omdat school je account dan meteen een week lang blokkeert.', correct: false, misconception: 'Denkt dat delen automatisch een straf oplevert.' }
        ],
        feedback: 'Precies. Het gaat om wie de schuld krijgt als het misgaat.'
      },
      {
        prompt: 'Als je vriend om je wachtwoord vraagt, mag je het geven.',
        waar: false,
        leerdoel: LD_1_2[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed. Ook aan iemand die je vertrouwt geef je het niet.'
      },
      {
        prompt: 'Wat hoort er bovenin je mail te staan, boven je bericht?',
        leerdoel: LD_1_3[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Alleen je eigen naam en de klas waarin je dit jaar zit.', correct: false, misconception: 'Zet het voorstellen boven de mail in plaats van erin.' },
          { text: 'De datum van vandaag en het lokaal waar je die dag les hebt.', correct: false, misconception: 'Denkt dat een mail een kop nodig heeft zoals een brief.' },
          { text: 'Je vraag, want dan ziet je docent meteen waar het over gaat.', correct: false, misconception: 'Zet de boodschap in het adresgedeelte.' },
          { text: 'Het adres bij Aan en het onderwerp.', correct: true, explanation: 'Die twee staan buiten je bericht, boven de aanhef.' }
        ],
        feedback: 'Goed. Kijk anders nog even naar de genummerde tekening.'
      },
      {
        prompt: 'Het onderwerp van je mail laat je leeg als je haast hebt.',
        waar: false,
        leerdoel: LD_1_3[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed gezien. Zonder titel moet je docent alles openklikken.'
      },
      {
        prompt: 'Hoe sluit je een schoolmail netjes af?',
        leerdoel: LD_1_3[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Met groetjes en een emoji, net als in een appje aan een vriend.', correct: false, misconception: 'Gebruikt de toon van een appje in een schoolmail.' },
          { text: 'Met alleen je voornaam, want je docent kent je toch wel.', correct: false, misconception: 'Denkt dat een docent aan een voornaam genoeg heeft.' },
          { text: 'Met Met vriendelijke groet, je naam en je klas.', correct: true, explanation: 'Je klas erbij, want er zijn meer leerlingen met jouw naam.' }
        ],
        feedback: 'Goed afgesloten. Je klas erbij scheelt je docent zoekwerk.'
      },
      {
        prompt: 'In een schoolmail begin je elke zin met een hoofdletter.',
        waar: true,
        leerdoel: LD_1_3[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. En elke zin eindigt met een punt.'
      },
      {
        prompt: 'Je weet alleen de achternaam van je docent. Wat doe je in Outlook?',
        leerdoel: LD_1_3[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je typt die achternaam bij Aan en kiest het juiste adres.', correct: true, explanation: 'Outlook zoekt mee, dus je kunt geen letter fout typen.' },
          { text: 'Je vraagt het adres in de groepsapp van je klas en typt het over.', correct: false, misconception: 'Vertrouwt op een overgetypt adres uit een groepsapp.' },
          { text: 'Je stuurt de mail naar je mentor en vraagt of hij hem doorstuurt.', correct: false, misconception: 'Laat een ander het adresprobleem oplossen.' }
        ],
        feedback: 'Goed. Het adresboek van school staat er al in.'
      },
      {
        prompt: 'Digitale geletterdheid betekent veilig, handig en kritisch omgaan met internet.',
        waar: true,
        leerdoel: LD_1_4[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed. Die drie woorden vatten het hele vak samen.'
      },
      {
        prompt: 'Welke van deze drie is een reden om digitale vaardigheden te leren?',
        leerdoel: LD_1_4[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Zodat je sneller kunt typen en beter wordt in het spelen van games.', correct: false, misconception: 'Denkt dat het vak over typen en gamen gaat.' },
          { text: 'Zodat je later minder hoeft te leren voor de vakken op school.', correct: false, misconception: 'Denkt dat digitale vaardigheden leren vervangen.' },
          { text: 'Zodat je precies weet welke apps het populairst zijn dit jaar.', correct: false, misconception: 'Denkt dat het vak over trends in apps gaat.' },
          { text: 'Zodat je jezelf en je gegevens veilig kunt houden.', correct: true, explanation: 'Dit is een van de drie redenen uit de theorie van 1.4.' }
        ],
        feedback: 'Goed gekozen. De andere twee redenen ken je vast ook nog.'
      },
      {
        prompt: 'Een omgangsregel gaat over hoe je met elkaar omgaat.',
        waar: true,
        leerdoel: LD_1_4[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Het woord omgang zit er letterlijk in.'
      },
      {
        prompt: 'Welke van deze drie is een goede omgangsregel voor een groepsapp?',
        leerdoel: LD_1_4[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je zet geen foto van iemand online zonder het te vragen.', correct: true, explanation: 'Deze regel zegt wat je doet, en dat is precies de bedoeling.' },
          { text: 'Je moet elk bericht binnen vijf minuten beantwoorden, ook \'s avonds.', correct: false, misconception: 'Denkt dat een omgangsregel over snelheid gaat.' },
          { text: 'Je mag alleen berichten sturen als er een docent in de groep zit.', correct: false, misconception: 'Verwart een omgangsregel met toezicht.' }
        ],
        feedback: 'Sterk. Een goede regel zegt wat je wél doet.'
      },
      {
        prompt: 'Je neemt een hele alinea letterlijk over van de NOS. Wat moet je doen?',
        leerdoel: LD_1_4[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Niets, want alles op internet mag je gratis gebruiken voor school.', correct: false, misconception: 'Denkt dat schoolwerk een uitzondering is.' },
          { text: 'Je zet de NOS erbij als bron.', correct: true, explanation: 'Bij een letterlijk stuk noem je altijd de maker erbij.' },
          { text: 'Je verandert twee woorden, dan is het genoeg aangepast.', correct: false, misconception: 'Denkt dat een paar woorden wisselen eigen woorden zijn.' }
        ],
        feedback: 'Goed. In je eigen woorden mag ook, dan snap je het beter.'
      },
      {
        prompt: 'Leg stap voor stap uit hoe jij een opdracht inlevert. Noem ook je bewijs.',
        type: 'open',
        leerdoel: LD_1_5[0],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik log in met mijn leerlingnummer en mijn eigen wachtwoord. Ik open in SOMtoday de ELO en klik mijn vak aan. Daarna klik ik de opdracht aan en klik op Inleveren. Ik sleep mijn bestand in het vak en bevestig. Er verschijnt een bevestiging met datum en tijd. Van dat scherm maak ik een screenshot met Windows, Shift en S. Die plak ik in mijn Word-bestand.',
        nakijkpunten: [
          'De stappen staan in de goede volgorde: inloggen, vak, opdracht, inleveren, bevestigen.',
          'Er staat bij dat je een screenshot maakt van de bevestiging.',
          'Er staat bij hoe je dat screenshot maakt en waar je hem plakt.'
        ],
        feedback: 'Compleet verhaal. Je stappen kloppen van begin tot eind.'
      },
      {
        prompt: 'Wat betekent digitale geletterdheid voor jou? Schrijf drie zinnen met een voorbeeld.',
        type: 'open',
        leerdoel: LD_1_5[1],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'reflecteren',
        modelAnswer: 'Voor mij betekent het dat ik zelf mijn schoolwerk digitaal kan regelen. In de zomer wist ik niet hoe ik iets moest inleveren. Nu lever ik in via de ELO. Ik maak er meteen een screenshot bij. Ook let ik nu beter op mijn wachtwoord.',
        nakijkpunten: [
          'Er staan drie zinnen die over de leerling zelf gaan.',
          'Er staat een voorbeeld in van iets wat de leerling nu kan en eerder niet.'
        ],
        feedback: 'Mooie terugblik. Je noemt echt iets wat je nu zelf kunt.'
      }
    ]
  }
};
