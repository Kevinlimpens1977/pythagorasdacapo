// Verrijkingslaag hoofdstuk 2 - Je device en hoe het werkt.
// Kaderberoepsgerichte leerweg (kb).
//
// Structuur en lesstof staan in scripts/seed-structuur/kb/h2.mjs. Hier staan de
// leerdoelen, de kernbegrippen, de uitgewerkte voorbeelden, de samenvattingen en
// alle vragen. Het formaat van een vraag, de regels over afleiders en de eisen
// aan feedback staan in ../PATROON.md; lees dat eerst.
//
// OPZET, VOLGENS DE BLAUWDRUK EN HET KB-PROFIEL
// ---------------------------------------------
//   - Elk leerdoel heeft zijn eigen startvraag. Die staan als `checks` in het
//     structuurbestand, met antwoord en uitleg erbij, vóór de theorie.
//   - Elk theorieblok heeft een uitgewerkt voorbeeld: een vraag met een volledige
//     uitwerking in stappen, die de leerling ziet vóór het zelfstandig oefenen.
//   - Elke afsluitquiz sluit af met TWEE terugkeervragen naar leerdoelen van een
//     eerdere paragraaf van dit hoofdstuk. De quiz van 2.1 kijkt daarvoor terug
//     naar hoofdstuk 1, want er is nog geen eerdere paragraaf.
//   - De AFSLUITQUIZ VAN 2.3 IS TEGELIJK DE DEELTOETS over 2.1 t/m 2.3. Daarom
//     telt dat blok veertien vragen in plaats van acht of negen: negen over 2.3
//     zelf en vijf over 2.1 en 2.2, samen alle negen leerdoelen van die drie
//     paragrafen. De praktijkopdracht van 2.3 kondigt hem met dat aantal aan en
//     de eerste startvraag van 2.4 zet de uitslag om in een spoor.
//   - De hoofdstuktoets van 2.5 telt 30 vragen en bevraagt alle 14 verplichte
//     leerdoelen van 2.1 tot en met 2.5 elk MINSTENS TWEE KEER. De vier
//     gebruiksregels uit de bronles komen er als open vraag in terug.
//   - Kb-vorm: veel meerkeuze en goed/fout, per blok hoogstens één open vraag.
//     De afleiders zijn even lang als of langer dan het goede antwoord, zodat
//     blind de langste knop klikken niets oplevert. De reden waarom een antwoord
//     klopt staat in `explanation`, niet in de antwoordtekst zelf.
//
// BRONVRAGEN UIT LES 2 DIE HIER LETTERLIJK LANDEN
// ------------------------------------------------
//   "Waarom heeft een computer koeling nodig?"          -> quiz 2.1, met de drie
//                                                          antwoorden uit de bron
//   "Waarom altijd in de oplader houden?"               -> quiz 2.1 en toets 2.5
//   "Wat is de taak van het werkgeheugen (RAM)?"        -> quiz 2.1
//   "Welke Office-toepassing maakt presentaties?"       -> quiz 2.2
//   "Is het verstandig diep in je computer te sleutelen?" -> quiz 2.2
//   "Kan het kwaad je laptop onbeheerd achter te laten?"  -> open vraag quiz 2.2
//   "Waarvoor gebruik je Windows Verkenner?"            -> quiz 2.3
//   "Waar vind je gedownloade bestanden?"               -> quiz 2.3
//   de shortcut-vragen (Ctrl+C, Ctrl+V, Ctrl+Z)         -> quiz 2.3 en toets 2.5
//
// De vrijwillige plusparagraaf 2.6 bestaat alleen in de theoretische leerweg.
// In kb loopt hoofdstuk 2 van 2.1 tot en met het checkpoint 2.5.

const LD_2_1 = [
  'Je kunt de belangrijkste onderdelen van een computer benoemen: processor, werkgeheugen, geluidskaart, videokaart, opslag, koeling en moederbord.',
  'Je kunt uitleggen wat elk onderdeel doet.',
  'Je kunt het verschil uitleggen tussen een laptop en een vaste computer.'
];

const LD_2_2 = [
  'Je kunt het verschil uitleggen tussen hardware en software.',
  'Je weet wat een besturingssysteem doet en welke jij op school gebruikt.',
  'Je weet waarom je je device regelmatig moet updaten.'
];

const LD_2_3 = [
  'Je kunt met Windows Verkenner mappen maken, bestanden verplaatsen en terugvinden.',
  'Je weet wat de cloud is en waarom OneDrive handig is.',
  'Je kunt de sneltoetsen Ctrl+C, Ctrl+V en Ctrl+Z gebruiken.'
];

const LD_2_4 = [
  'Je kunt uitleggen wat een netwerk en een server zijn.',
  'Je kunt in stappen vertellen wat er gebeurt als je een website opvraagt.',
  'Je weet wat data is en op welke plekken jouw data bewaard wordt.'
];

const LD_2_5 = [
  'Je kunt hardware en software uit elkaar houden en uitleggen wat ze doen.',
  'Je kunt je bestanden zo opslaan dat je ze op elke computer terugvindt.'
];

// Leerdoelen uit hoofdstuk 1. Ze dragen de spreiding in 2.1 en de vier
// gebruiksregels uit de bronles (zie de kop van het structuurbestand).
const LD_H1_DELEN = 'Je weet waarom je je wachtwoord nooit aan iemand anders geeft.';
const LD_H1_SCREENSHOT = 'Je kunt een screenshot maken en die inleveren bij je docent.';

export default {
  '2.1': {
    learningGoals: LD_2_1,
    theorie: [
      {
        keyTerms: ['hardware', 'software', 'vast systeem'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sam mag kiezen: een laptop of een vaste computer. Hij wil er video mee bewerken. Wat raad je hem aan? En waarom?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: kijk naar de ruimte binnenin. In de kast van een vast systeem is meer plaats. Stap 2: daar passen dus grotere onderdelen in. Stap 3: grote onderdelen raken hun warmte beter kwijt. Stap 4: daardoor is een vaste computer bij hetzelfde geld krachtiger. Stap 5: video bewerken is zwaar werk, dus Sam kiest de vaste computer. Stap 6: wat hij inlevert is de batterij. Hij moet nu op één plek werken.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['processor', 'werkgeheugen', 'koeling', 'moederbord'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Een spel start wel op, maar het beeld schokt. Het gebeurt vooral als er veel tegelijk op het scherm staat. De laptop wordt ook heel warm. Welke onderdelen bekijk je?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: schokkend beeld wijst naar de videokaart. Die maakt namelijk alles wat je ziet. Stap 2: het gaat mis als er veel tegelijk gebeurt. Dat wijst op te weinig werkgeheugen. Stap 3: de processor moet dan wachten tot de gegevens klaarstaan. Stap 4: de laptop wordt warm, dus kijk ook naar de koeling. Stap 5: de geluidskaart is hier waarschijnlijk niet stuk, want het geluid valt niet weg.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Alle onderdelen van je device die je kunt vasthouden heten samen hardware. De processor voert de taken uit. Het werkgeheugen houdt tijdelijk vast waar je nu mee bezig bent. Het opslaggeheugen bewaart je bestanden, ook als de stroom eraf gaat. De geluidskaart maakt geluid en de videokaart maakt beeld. De koeling voert de warmte af met ventilatoren. Op het moederbord zitten alle onderdelen aan elkaar vast. Een laptop heeft een batterij en kan overal mee naartoe. Een vaste computer heeft meer ruimte binnenin en is daardoor vaak krachtiger.</p>',
      keyTerms: ['hardware', 'processor', 'opslaggeheugen']
    },
    vragen: [
      {
        prompt: 'In de theorie staan zeven onderdelen van een computer op een rij. Welke hoort NIET in dat rijtje van zeven?',
        leerdoel: LD_2_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Het werkgeheugen, ook wel RAM genoemd.', correct: false, misconception: 'Denkt dat werkgeheugen iets anders is dan een onderdeel binnen in de computer.' },
          { text: 'De oplader met het snoer eraan.', correct: true, explanation: 'De oplader hoort wel bij een laptop, maar hij zit niet in het rijtje van zeven onderdelen binnenin.' },
          { text: 'De geluidskaart voor je koptelefoon.', correct: false, misconception: 'Twijfelt of een kaart voor geluid bij de zeven hoofdonderdelen hoort.' },
          { text: 'Het moederbord onder in de kast.', correct: false, misconception: 'Ziet het moederbord als een omhulsel in plaats van als een van de zeven onderdelen.' }
        ],
        feedback: 'De zeven zijn processor, werkgeheugen, geluidskaart, videokaart, opslag, koeling en moederbord. De oplader valt erbuiten.'
      },
      {
        prompt: 'Je koptelefoon geeft geen geluid meer. Het beeld op je scherm werkt gewoon. Welk onderdeel verdenk je als eerste?',
        leerdoel: LD_2_1[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'De processor, want die voert alle taken uit.', correct: false, misconception: 'Wijst de processor aan bij elke storing, omdat die overal een rol in speelt.' },
          { text: 'Het moederbord, want daar zit alles op vast.', correct: false, misconception: 'Kiest de plaat waarop alles vastzit, terwijl één onderdeel precies deze taak heeft.' },
          { text: 'De geluidskaart in je device.', correct: true, explanation: 'De geluidskaart is precies het onderdeel dat geluid naar je koptelefoon of speakers stuurt.' },
          { text: 'De koeling, want die houdt alles aan de praat.', correct: false, misconception: 'Denkt aan een te warme laptop terwijl er één aansluiting het niet doet.' }
        ],
        feedback: 'Beeld werkt en geluid niet. Dan zit de storing in het onderdeel met precies die ene taak.'
      },
      {
        prompt: 'Wat is de taak van het werkgeheugen (RAM)?',
        leerdoel: LD_2_1[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Gegevens langdurig bewaren, ook als het apparaat uit gaat.', correct: false, misconception: 'Verwart het werkgeheugen met het opslaggeheugen.' },
          { text: 'Bestanden klaarzetten en daarna naar de printer sturen.', correct: false, misconception: 'Denkt dat onthouden en doorgeven van opdrachten hetzelfde werk is.' },
          { text: 'Beelden mooier maken en de kleuren op je scherm bijstellen.', correct: false, misconception: 'Verwart het geheugen waarin je nu werkt met de kaart die beeld maakt.' },
          { text: "Programma's tijdelijk ondersteunen zodat alles soepel werkt.", correct: true, explanation: 'RAM houdt vast waar de processor nu mee bezig is, en daardoor blijft je laptop soepel werken.' }
        ],
        feedback: 'Werkgeheugen is een werkbank en geen kast. Het houdt vast waar je nu mee bezig bent en is daarna leeg.'
      },
      {
        prompt: 'Waarom heeft een computer koeling nodig?',
        leerdoel: LD_2_1[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Om bestanden sneller op te slaan en terug te vinden.', correct: false, misconception: 'Verbindt koeling met de snelheid van opslaan in plaats van met warmte.' },
          { text: 'Om geluid af te spelen via je speakers of koptelefoon.', correct: false, misconception: 'Hoort de ventilator en denkt daardoor aan de kaart die geluid maakt.' },
          { text: 'Om te voorkomen dat de computer oververhit raakt.', correct: true, explanation: 'Onderdelen die rekenen geven warmte af; zonder ventilatoren loopt die warmte op tot het apparaat uitvalt.' }
        ],
        feedback: 'Rekenen kost energie, en energie komt er als warmte weer uit. De koeling voert precies die warmte af.'
      },
      {
        prompt: 'Een laptop is bijna altijd krachtiger dan een vaste computer, omdat de onderdelen kleiner zijn.',
        waar: false,
        leerdoel: LD_2_1[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Kleiner is hier juist zwakker. In een vaste computer passen grotere onderdelen, en die raken hun warmte beter kwijt.'
      },
      {
        prompt: 'Waarom is het niet goed voor je laptop om hem altijd in de oplader te laten zitten?',
        leerdoel: LD_2_1[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een apparaat aan de oplader werkt merkbaar minder snel.', correct: false, misconception: 'Denkt dat opladen rekenkracht kost en het apparaat daardoor vertraagt.' },
          { text: 'Een accu die constant bijlaadt kan oververhit raken.', correct: true, explanation: 'Een accu die altijd vol wordt gehouden wordt warm; in het ergste geval vliegt hij in de brand.' },
          { text: 'De oplader trekt stroom uit je geheugen en wist bestanden.', correct: false, misconception: 'Denkt dat de stroom uit de oplader iets doet met je opgeslagen bestanden.' },
          { text: 'Het maakt niets uit; hij mag er altijd in blijven zitten.', correct: false, misconception: 'Denkt dat de laptop zichzelf zo goed regelt dat er nooit risico is.' }
        ],
        feedback: 'Het gaat om warmte. Een accu die steeds wordt bijgeladen kan te heet worden, en dat is een echt brandrisico.'
      },
      {
        prompt: 'Op het moederbord zitten alle andere onderdelen aangesloten, zodat ze kunnen samenwerken.',
        waar: true,
        leerdoel: LD_2_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Het moederbord is de grote plaat waarop alles vastzit en waarlangs de onderdelen gegevens uitwisselen.'
      },
      {
        prompt: 'Kies drie van de zeven onderdelen. Schrijf per onderdeel op hoe het heet, wat het doet en wat jij merkt als het stuk is.',
        type: 'open',
        leerdoel: LD_2_1[0],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik kies de processor, de videokaart en de koeling. De processor voert alle taken uit. Werkt hij niet goed, dan wordt mijn laptop traag. De videokaart maakt het beeld op mijn scherm. Valt die weg, dan gaat het beeld schokken of blijft mijn scherm zwart. De koeling voert de warmte af met ventilatoren. Slaat die af, dan wordt mijn laptop heet en valt hij uit. De andere vier heten werkgeheugen, geluidskaart, opslaggeheugen en moederbord.',
        nakijkpunten: [
          'Je noemt drie namen uit het rijtje van zeven, geen zelfbedachte namen.',
          'Bij elk onderdeel staat in je eigen woorden een taak die alleen dat heeft.',
          'Bij elk onderdeel staat een gevolg dat jij merkt, en dat past bij de taak.'
        ],
        feedback: 'Een naam zonder taak is nog geen kennis. Koppel elk onderdeel aan wat jij merkt als het wegvalt.'
      },
      // --- Terugkeervraag: spreiding over hoofdstuk 1 ---
      {
        prompt: 'Je hebt de Wikiwijs-opdrachten van deze paragraaf af en er staat een screenshot klaar. Wat doe je nu met dat plaatje?',
        leerdoel: LD_H1_SCREENSHOT,
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Ik laat het staan; mijn docent zoekt het zelf wel op.', correct: false, misconception: 'Denkt dat een bestand op zijn eigen laptop vanzelf bij de docent aankomt.' },
          { text: 'Ik zet het in de groepsapp, dan heeft de klas het ook.', correct: false, misconception: 'Denkt dat delen in de groepsapp hetzelfde is als inleveren bij je docent.' },
          { text: 'Ik print het en leg de afdruk op mijn eigen tafel.', correct: false, misconception: 'Denkt dat werk pas meetelt zodra het uitgeprint op tafel ligt.' },
          { text: 'Ik mail het of ik zet het in mijn OneDrive.', correct: true, explanation: 'Inleveren betekent dat het bewijs bij je docent komt, via mail of via OneDrive, zoals je docent aangeeft.' }
        ],
        feedback: 'Een screenshot telt pas als je docent erbij kan. Mailen of in OneDrive zetten maakt het inleveren af.'
      },
      // --- Tweede terugkeervraag: spreiding over hoofdstuk 1 ---
      {
        prompt: 'Een klasgenoot is zijn eigen wachtwoord kwijt en vraagt of hij even met dat van jou mag inloggen. Wat doe je?',
        leerdoel: LD_H1_DELEN,
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Ik geef het hem, want hij is mijn beste vriend en hij geeft het terug.', correct: false, misconception: 'Denkt dat vertrouwen tussen vrienden de regel over wachtwoorden opheft.' },
          { text: 'Ik typ het zelf in, dan heeft hij het niet echt gezien op mijn scherm.', correct: false, misconception: 'Denkt dat het probleem het zien van het wachtwoord is en niet het gebruik van je account.' },
          { text: 'Ik zeg nee en stuur hem naar de ICT-afdeling of naar zijn mentor.', correct: true, explanation: 'Alles wat onder jouw account gebeurt staat op jouw naam, dus je deelt hem met niemand; school kan zijn wachtwoord opnieuw instellen.' },
          { text: 'Ik geef het hem voor vandaag en verander het morgenochtend gewoon weer.', correct: false, misconception: 'Denkt dat een wachtwoord tijdelijk delen zonder gevolgen kan.' }
        ],
        feedback: 'Jouw account blijft van jou, ook heel even. Een vergeten wachtwoord lost de ICT-afdeling in twee minuten op.'
      }
    ]
  },

  '2.2': {
    learningGoals: LD_2_2,
    theorie: [
      {
        keyTerms: ['besturingssysteem', 'bureaublad', 'taakbalk', 'touchpad'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Milan werkt thuis op een MacBook. Hij zoekt daar het Windows-vlaggetje links naast het zoekvak. Hij kan het niet vinden. Wat is er aan de hand?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: het vlaggetje van vier blauwe vierkantjes hoort bij Windows. Stap 2: Windows is één besturingssysteem, en een MacBook heeft een ander. Stap 3: bij een ander besturingssysteem ziet de balk er anders uit. Stap 4: er is dus niets stuk aan zijn MacBook. Stap 5: Milan zoekt de knop die op zijn eigen balk staat. Stap 6: het bureaublad en het touchpad werken bij hem wél gewoon hetzelfde.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['Microsoft Office', 'update', 'stuurprogramma'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sara heeft haar laptop al een half jaar niet bijgewerkt. Haar koptelefoon doet het opeens niet meer, en er komt steeds een melding in beeld. Wat doet ze?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: ze gaat naar Instellingen en dan naar Windows Update. Stap 2: ze laat de updates zoeken en installeren. Stap 3: bij die update wordt ook het stuurprogramma van de geluidskaart bijgewerkt. Stap 4: een stuurprogramma is de software die één hardware-onderdeel aanstuurt. Stap 5: er gaan fouten uit en er komen functies bij. Stap 6: helpt het niet, dan gaat ze naar haar mentor of de ICT-afdeling. Dat is regel vier.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Hardware is alles wat je kunt vasthouden, software zijn de programma\'s. Het besturingssysteem is het programma dat je hele computer aanstuurt. Op school is dat meestal Windows, van het bedrijf Microsoft. Word, Excel en PowerPoint zijn gewone programma\'s daarbovenop. Bij een update gaan fouten eruit en komen er functies bij. Doe je dat niet regelmatig, dan blijft er een gat openstaan voor virussen. Er gelden vier gebruiksregels: nooit onbeheerd achterlaten, je wachtwoord aan niemand geven, alleen van veilige sites downloaden en bij problemen naar je mentor gaan.</p>',
      keyTerms: ['software', 'besturingssysteem', 'update']
    },
    vragen: [
      {
        prompt: 'Wat doet een besturingssysteem op jouw laptop?',
        leerdoel: LD_2_2[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Het stuurt je hele computer aan.', correct: true, explanation: 'Zonder besturingssysteem worden de onderdelen en de programma\'s niet aangestuurd, en dan doet het apparaat niets.' },
          { text: 'Het maakt documenten, tabellen en presentaties voor je.', correct: false, misconception: 'Verwart het besturingssysteem met de programma\'s van Microsoft Office.' },
          { text: 'Het bewaart je bestanden op internet bij je account.', correct: false, misconception: 'Verwart het besturingssysteem met cloudopslag zoals OneDrive.' },
          { text: 'Het koelt de onderdelen als de laptop te warm wordt.', correct: false, misconception: 'Denkt dat een programma de taak van een hardware-onderdeel overneemt.' }
        ],
        feedback: 'Het besturingssysteem is de baas van je apparaat. Windows, ChromeOS en macOS zijn er alle drie een voorbeeld van.'
      },
      {
        prompt: 'Welk van deze vier is software en dus geen hardware?',
        leerdoel: LD_2_2[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'De ventilator van de koeling.', correct: false, misconception: 'Weet niet dat een ventilator een onderdeel is dat je kunt vastpakken.' },
          { text: 'Het moederbord in de kast.', correct: false, misconception: 'Denkt dat het moederbord een programma is omdat het alles regelt.' },
          { text: 'Het stuurprogramma van de printer.', correct: true, explanation: 'Een stuurprogramma hoort bij een onderdeel, maar het is zelf code en dus software.' },
          { text: 'De videokaart met eigen ventilator.', correct: false, misconception: 'Twijfelt of een kaart hardware is omdat er ook een programma bij hoort.' }
        ],
        feedback: 'De valkuil is het stuurprogramma. Het hoort bij hardware, maar je kunt het niet vasthouden, dus het is software.'
      },
      {
        prompt: 'Welke toepassing van Microsoft Office gebruik je om een presentatie te maken?',
        leerdoel: LD_2_2[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Word', correct: false, misconception: 'Kent Word als het programma voor alle schoolopdrachten.' },
          { text: 'OneDrive', correct: false, misconception: 'Verwart een opslagplek met een programma waarin je iets maakt.' },
          { text: 'Excel', correct: false, misconception: 'Denkt dat het programma met rijen en kolommen ook voor dia\'s bedoeld is.' },
          { text: 'PowerPoint', correct: true, explanation: 'PowerPoint werkt met dia\'s en is precies gemaakt om iets aan een groep te laten zien.' }
        ],
        feedback: 'Word is voor documenten, Excel voor tabellen met cijfers en PowerPoint voor dia\'s. OneDrive is alleen opslag.'
      },
      {
        prompt: 'Is het verstandig om zomaar, diep in je computer, de instellingen aan te passen?',
        leerdoel: LD_2_2[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Ja hoor, zo leer je het snelst hoe je device werkt.', correct: false, misconception: 'Denkt dat uitproberen zonder risico is, omdat je alles kunt terugzetten.' },
          { text: 'Nee, je kunt schade doen aan jouw device.', correct: true, explanation: 'Diepe instellingen sturen het besturingssysteem aan; één verkeerde keuze kan het apparaat onbruikbaar maken.' },
          { text: 'Ja, want het besturingssysteem herstelt alles vanzelf weer.', correct: false, misconception: 'Denkt dat er altijd een knop is om een systeeminstelling terug te draaien.' },
          { text: 'Nee, want je laptop gaat er alleen maar langzamer van werken.', correct: false, misconception: 'Zoekt een gevolg in snelheid in plaats van in schade aan het apparaat.' }
        ],
        feedback: 'Dit is het antwoord uit de bron: nee, dat is niet verstandig. Vraag het na bij je mentor of de ICT-afdeling.'
      },
      {
        prompt: 'Je hoeft je laptop maar één keer per jaar te updaten; vaker is niet nodig.',
        waar: false,
        leerdoel: LD_2_2[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Updaten doe je regelmatig. Eén keer per jaar laat alle bekende gaten van dat hele jaar gewoon openstaan.'
      },
      {
        prompt: 'Wat gebeurt er precies bij een update van je device?',
        leerdoel: LD_2_2[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Al je bestanden worden gewist en opnieuw opgeslagen.', correct: false, misconception: 'Denkt dat updaten hetzelfde is als het apparaat helemaal leegmaken.' },
          { text: 'Je krijgt er automatisch meer werkgeheugen en opslag bij.', correct: false, misconception: 'Denkt dat software de hoeveelheid hardware kan vergroten.' },
          { text: 'De koeling gaat harder draaien zodat je apparaat afkoelt.', correct: false, misconception: 'Verwart een softwaretaak met een taak van een hardware-onderdeel.' },
          { text: 'Er gaan fouten uit en er komen functies bij.', correct: true, explanation: 'Bij een update wordt onder andere het stuurprogramma bijgewerkt: fouten eruit, nieuwe functies erbij.' }
        ],
        feedback: 'Bij een update wordt ook het stuurprogramma bijgewerkt. Dat is de software die één onderdeel aanstuurt.'
      },
      {
        prompt: 'Kan het kwaad om je laptop ingelogd en onbeheerd achter te laten? Leg uit waarom wel of niet, en schrijf op wat jij dan doet.',
        type: 'open',
        leerdoel: LD_H1_DELEN,
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'reflecteren',
        modelAnswer: 'Ja, dat kan zeker kwaad. Mijn laptop staat dan ingelogd open in het lokaal. Iedereen die langsloopt kan bij mijn mail en mijn bestanden. Alles wat iemand anders dan doet, staat op mijn naam. Dat is hetzelfde als mijn wachtwoord weggeven. Dat is ook precies waarom regel één en regel twee bij elkaar horen. Daarom vergrendel ik mijn scherm met de Windows-toets en L. Als ik langer weg ben, log ik helemaal uit.',
        nakijkpunten: [
          'Je zegt duidelijk dat onbeheerd achterlaten wél kwaad kan.',
          'Je noemt als reden dat een ander onder jouw naam verder kan werken.',
          'Je noemt een oplossing, bijvoorbeeld je scherm vergrendelen of uitloggen.'
        ],
        feedback: 'Een open ingelogde laptop is net zoiets als je wachtwoord uitdelen. Vergrendelen kost twee toetsen.'
      },
      // --- Terugkeervraag naar 2.1 ---
      {
        prompt: 'Je laptop wordt heel warm en de ventilator maakt veel lawaai. Welk onderdeel doet hier zijn werk?',
        leerdoel: LD_2_1[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'De koeling van je device.', correct: true, explanation: 'De koeling voert met ventilatoren de warmte af; bij zwaar werk draait die ventilator harder en hoor je hem.' },
          { text: 'Het opslaggeheugen waar je bestanden staan.', correct: false, misconception: 'Denkt dat een vol geheugen warmte en lawaai veroorzaakt.' },
          { text: 'De geluidskaart, want die maakt immers geluid.', correct: false, misconception: 'Denkt dat elk geluid uit een device door de geluidskaart komt.' },
          { text: 'Het moederbord, want daar zit de ventilator op.', correct: false, misconception: 'Kiest het onderdeel dat alles verbindt in plaats van het onderdeel met die taak.' }
        ],
        feedback: 'Het lawaai komt van de ventilator, niet van de geluidskaart. Rekenen geeft warmte, en die warmte moet weg.'
      }
    ]
  },

  '2.3': {
    learningGoals: LD_2_3,
    theorie: [
      {
        keyTerms: ['Verkenner', 'Knippen', 'Kopiëren', 'Plakken'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Milan heeft een werkblad van internet gehaald. Hij wil het in zijn map Hoofdstuk 2 zetten. Er mag geen tweede versie ontstaan. Wat doet hij, stap voor stap?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: hij opent Verkenner via het pictogram in de taakbalk. Stap 2: hij klikt op de map Downloads, want daar komt alles van internet binnen. Stap 3: hij klikt het werkblad één keer aan, zodat het geselecteerd is. Stap 4: hij klikt op Knippen, het pictogram met de schaar. Stap 5: hij opent zijn map Hoofdstuk 2 in OneDrive. Stap 6: hij klikt op Plakken. Kopiëren zou het origineel laten staan, en dan had hij er twee.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['cloud', 'OneDrive', 'sneltoetsen'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sara maakt op school een poster af en slaat hem op het bureaublad op. Thuis wil ze verder werken, maar ze vindt niets. Wat ging er mis? En hoe voorkomt ze dit?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: het bureaublad hoort bij die ene lokaalcomputer. Stap 2: haar bestand staat dus in het opslaggeheugen van dat apparaat. Stap 3: thuis heeft ze een ander apparaat, dus daar staat het niet. Stap 4: ze had moeten opslaan in OneDrive. Stap 5: OneDrive is de cloud en hoort bij haar schoolaccount. Stap 6: ze logt thuis in met datzelfde account en heeft haar poster terug. Een sneltoets helpt haar daarbij: met Ctrl+S slaat ze steeds tussentijds op.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Met Windows Verkenner open en orden je je bestanden en mappen. Wat je van internet haalt staat standaard in de map Downloads. Met Knippen en Plakken verplaats je een bestand; met Kopiëren maak je er een tweede bij. De cloud is opslag die niet in je eigen apparaat zit, maar bij een bedrijf op internet. OneDrive is zulke opslag en hoort bij jouw schoolaccount, dus je werk reist met je mee. Een sneltoets voer je uit door twee toetsen tegelijk in te drukken. Ctrl+C kopieert, Ctrl+V plakt en Ctrl+Z maakt je laatste actie ongedaan.</p>',
      keyTerms: ['Verkenner', 'OneDrive', 'sneltoets']
    },
    vragen: [
      {
        prompt: 'Waarvoor gebruik je Windows Verkenner?',
        leerdoel: LD_2_3[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Om bestanden en mappen te openen en te ordenen.', correct: true, explanation: 'Verkenner is de archiefkast van je device: daar maak je mappen, verplaats je bestanden en zoek je ze terug.' },
          { text: 'Om spelletjes te spelen die op je device staan.', correct: false, misconception: 'Denkt dat elk venster met pictogrammen een programmastarter is.' },
          { text: 'Om websites te bekijken en op internet te zoeken.', correct: false, misconception: 'Verwart Verkenner met een browser, omdat beide een adresbalk hebben.' },
          { text: 'Om e-mails te versturen naar je docent of klas.', correct: false, misconception: 'Verwart de archiefkast van je bestanden met het programma waarmee je mailt.' }
        ],
        feedback: 'Verkenner is je archiefkast. Je opent hem met het pictogram in de taakbalk of met Windows+E.'
      },
      {
        prompt: 'Waar vind je bestanden terug die je net van internet hebt gedownload?',
        leerdoel: LD_2_3[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'In de map Documenten, tussen je eigen verslagen.', correct: false, misconception: 'Denkt dat alle bestanden automatisch bij de documenten belanden.' },
          { text: 'Op het bureaublad, tussen je snelkoppelingen.', correct: false, misconception: 'Denkt dat een download op het beginscherm verschijnt omdat hij nieuw is.' },
          { text: 'In de map Downloads.', correct: true, explanation: 'Downloads is de standaardplek: alles wat je van internet haalt komt daar automatisch binnen.' },
          { text: 'In de map Muziek, want daar staat alle media.', correct: false, misconception: 'Denkt dat de mediamappen ook voor gedownloade documenten bedoeld zijn.' }
        ],
        feedback: 'Downloads is de wachtkamer van je computer. Zet wat je wilt bewaren daarna meteen in je eigen vakmap.'
      },
      {
        prompt: 'Je wilt een bestand naar een andere map verplaatsen. Er mag geen tweede versie overblijven. Wat doe je?',
        leerdoel: LD_2_3[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Eerst Kopiëren en daarna in de nieuwe map Plakken.', correct: false, misconception: 'Denkt dat kopiëren en verplaatsen hetzelfde resultaat geven.' },
          { text: 'Eerst Naam wijzigen en daarna in de nieuwe map Plakken.', correct: false, misconception: 'Denkt dat een andere naam het bestand ook verplaatst.' },
          { text: 'Eerst Delen en daarna in de nieuwe map Verwijderen.', correct: false, misconception: 'Verwart delen met een ander met het verplaatsen van een bestand.' },
          { text: 'Eerst Knippen en daarna in de nieuwe map Plakken.', correct: true, explanation: 'Knippen haalt het bestand van de oude plek weg, dus na het plakken bestaat het maar één keer.' }
        ],
        feedback: 'Kopiëren laat het origineel staan en maakt er een tweede bij. Later weet je dan niet welke de goede is.'
      },
      {
        prompt: 'Wat bedoelen we met de cloud?',
        leerdoel: LD_2_3[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Opslag op computers van een bedrijf, bereikbaar via internet.', correct: true, explanation: 'Je bestanden staan niet in jouw apparaat maar bij een bedrijf, en je bereikt ze met je account via internet.' },
          { text: 'Een extra map op het bureaublad van je eigen laptop.', correct: false, misconception: 'Denkt dat de cloud gewoon een map op het apparaat zelf is.' },
          { text: 'Een groter opslaggeheugen dat je in je laptop laat zetten.', correct: false, misconception: 'Verwart cloudopslag met extra hardware in het apparaat.' },
          { text: 'Een programma dat je bestanden kleiner maakt en inpakt.', correct: false, misconception: 'Denkt dat de cloud iets met de grootte van bestanden doet.' }
        ],
        feedback: 'De cloud staat niet in jouw apparaat. Je werk hoort bij je account, dus het reist met je mee.'
      },
      {
        prompt: 'Sla je je werk op in OneDrive, dan open je thuis hetzelfde bestand als op school.',
        waar: true,
        leerdoel: LD_2_3[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt, zolang je met je schoolaccount inlogt. Een verloren USB-stick is daarmee geen ramp meer.'
      },
      {
        prompt: 'Je hebt tekst op de verkeerde plek geplakt. Welke sneltoets maakt die laatste stap ongedaan?',
        leerdoel: LD_2_3[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Ctrl+C, de sneltoets om iets te kopiëren.', correct: false, misconception: 'Kent de drie sneltoetsen wel, maar verwisselt kopiëren met terugdraaien.' },
          { text: 'Ctrl+V, de sneltoets om iets te plakken.', correct: false, misconception: 'Denkt dat nog een keer plakken de vorige stap vervangt.' },
          { text: 'Ctrl+Z, de sneltoets om terug te gaan.', correct: true, explanation: 'Ctrl+Z draait je laatste actie terug, dus je hoeft niets over te typen.' },
          { text: 'Ctrl+P, de sneltoets om af te drukken.', correct: false, misconception: 'Kiest een bekende sneltoets zonder te weten wat hij doet.' }
        ],
        feedback: 'Ctrl+Z is je terugknop. De Z ligt vlak bij de C en de V, dus je doet het met één hand.'
      },
      {
        prompt: 'Welke drie sneltoetsen horen bij kopiëren, plakken en ongedaan maken, in die volgorde?',
        leerdoel: LD_2_3[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ctrl+V, Ctrl+C en Ctrl+Z, in die volgorde.', correct: false, misconception: 'Verwisselt kopiëren en plakken, omdat de toetsen naast elkaar liggen.' },
          { text: 'Ctrl+C, Ctrl+V en Ctrl+Z, in die volgorde.', correct: true, explanation: 'De C staat voor copy, de V ligt er direct naast om te plakken en de Z draait je laatste stap terug.' },
          { text: 'Ctrl+A, Ctrl+S en Ctrl+P, in die volgorde.', correct: false, misconception: 'Noemt drie bestaande sneltoetsen die iets heel anders doen.' },
          { text: 'Ctrl+X, Ctrl+Z en Ctrl+Y, in die volgorde.', correct: false, misconception: 'Verwart knippen met kopiëren en kent het verschil tussen Z en Y niet.' }
        ],
        feedback: 'De C van copy staat vooraan, de V ligt ernaast en de Z is je terugknop. Alle drie liggen ze dicht bij elkaar.'
      },
      {
        prompt: 'Je maakte vorige week een werkstuk, maar je weet niet meer waar het staat. Beschrijf stap voor stap hoe je het met Verkenner terugvindt.',
        leerdoel: LD_2_3[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        modelAnswer: 'Ik open Verkenner met het mapje in de taakbalk onderin mijn scherm. Eerst kijk ik in Documenten, want daar zet Word mijn bestanden standaard neer. Staat het er niet, dan open ik mijn map Downloads en daarna mijn OneDrive. Vind ik het zo nog niet, dan typ ik een woord uit de titel in het zoekvak. Verkenner zoekt dan in de map waar ik op dat moment sta. Ik kan de lijst ook sorteren op datum, zodat mijn nieuwste bestanden bovenaan komen. Zodra ik het terug heb, sleep ik het naar mijn eigen map voor dat vak.',
        nakijkpunten: [
          'Je stappen staan op volgorde en beginnen met het openen van Verkenner.',
          'Je noemt minstens twee vaste mappen, zoals Documenten, Downloads of OneDrive.',
          'Je noemt zoeken op een woord uit de titel, of sorteren op datum.'
        ],
        feedback: 'Zoeken gaat van bekend naar onbekend: eerst de vaste mappen langs, daarna pas het zoekvak. Sorteren op datum scheelt vaak de meeste tijd.'
      },
      // --- DEELTOETS: vijf vragen over 2.1 en 2.2 ---
      // Dit blok is geen gewone afsluitquiz. De praktijkopdracht van 2.3 zegt
      // erbij dat de afsluitquiz tegelijk de deeltoets over 2.1, 2.2 en 2.3 is,
      // en noemt het aantal van veertien. De acht vragen hierboven dekken de
      // drie leerdoelen van 2.3; de vijf hieronder plus de terugkeervraag aan
      // het slot dekken de zes leerdoelen van 2.1 en 2.2, zodat alle negen
      // leerdoelen van die drie paragrafen in dit ene blok gemeten worden. De
      // eerste startvraag van 2.4 zet de uitslag om in een spoor.
      {
        prompt: 'Welke twee onderdelen uit het rijtje van zeven zorgen samen voor jouw beeld en jouw geluid?',
        leerdoel: LD_2_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Het werkgeheugen en het opslaggeheugen in je apparaat.', correct: false, misconception: 'Kiest de twee soorten geheugen omdat die namen op elkaar lijken.' },
          { text: 'De videokaart en de geluidskaart in je apparaat.', correct: true, explanation: 'De videokaart maakt het beeld op je scherm en de geluidskaart stuurt het geluid naar je koptelefoon.' },
          { text: 'De processor en het moederbord in je apparaat.', correct: false, misconception: 'Kiest de twee onderdelen die overal bij betrokken zijn in plaats van de twee met die ene taak.' },
          { text: 'De koeling en de processor in je apparaat.', correct: false, misconception: 'Verbindt beeld en geluid met de warmte die een apparaat afgeeft.' }
        ],
        feedback: 'Twee kaarten, twee zintuigen: kijken doe je dankzij de videokaart, luisteren dankzij de geluidskaart.'
      },
      {
        prompt: 'Wat is de taak van het moederbord in een computer?',
        leerdoel: LD_2_1[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Het rekent alle opdrachten uit die jij aan je device geeft.', correct: false, misconception: 'Verwart het moederbord met de processor, omdat allebei belangrijk klinken.' },
          { text: 'Het bewaart je bestanden ook als de stroom eraf gaat.', correct: false, misconception: 'Verwart het moederbord met het opslaggeheugen.' },
          { text: 'Het houdt tijdelijk vast waar jij op dit moment mee bezig bent.', correct: false, misconception: 'Verwart het moederbord met het werkgeheugen.' },
          { text: 'Het verbindt alle onderdelen zodat ze kunnen samenwerken.', correct: true, explanation: 'Alle andere onderdelen zitten op die grote plaat vast en wisselen daarlangs hun gegevens uit.' }
        ],
        feedback: 'Het moederbord rekent zelf niets uit. Het is de plaat waarop de rest vastzit en waarlangs alles loopt.'
      },
      {
        prompt: 'Sam wil video bewerken en hij hoeft zijn computer nergens mee naartoe te nemen. Wat raad je hem aan?',
        leerdoel: LD_2_1[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een laptop, want kleinere onderdelen werken nu eenmaal sneller.', correct: false, misconception: 'Denkt dat klein automatisch snel betekent.' },
          { text: 'Een vast systeem, want daar is binnenin meer ruimte.', correct: true, explanation: 'In die ruimte passen grotere onderdelen, en die raken hun warmte beter kwijt, dus je krijgt meer kracht voor je geld.' },
          { text: 'Een laptop, want die kan hij op school ook nog gebruiken.', correct: false, misconception: 'Kiest op meenemen terwijl de opdracht juist zegt dat dat niet hoeft.' },
          { text: 'Dat maakt niet uit, want binnenin zijn ze precies hetzelfde.', correct: false, misconception: 'Hoorde dat ze van binnen op elkaar lijken en leest dat als volledig gelijk.' }
        ],
        feedback: 'Video bewerken is zwaar werk. Ruimte binnenin betekent grotere onderdelen, en die kunnen meer aan.'
      },
      {
        prompt: 'Je scherm en je browser: in welke groep hoort elk van die twee thuis?',
        leerdoel: LD_2_2[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je scherm is hardware en je browser is software.', correct: true, explanation: 'Je scherm kun je vastpakken, je browser bestaat alleen als programma en zit dus bij de software.' },
          { text: 'Je scherm is software en je browser is hardware.', correct: false, misconception: 'Draait de twee groepen om omdat je de browser op het scherm ziet.' },
          { text: 'Ze zijn allebei hardware, want je ziet ze allebei voor je.', correct: false, misconception: 'Gebruikt zien in plaats van vastpakken als test.' },
          { text: 'Ze zijn allebei software, want ze horen bij elkaar op je device.', correct: false, misconception: 'Denkt dat dingen die samenwerken ook in dezelfde groep vallen.' }
        ],
        feedback: 'Zien is niet hetzelfde als vastpakken. Het glas van je scherm pak je op, het venster erin niet.'
      },
      {
        prompt: 'Je hebt de updates van je laptop drie maanden uitgesteld. Wat is daarvan het grootste nadeel?',
        leerdoel: LD_2_2[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je accu gaat sneller leeg dan bij een bijgewerkte laptop.', correct: false, misconception: 'Verbindt updates met de stroom in plaats van met veiligheid en fouten.' },
          { text: 'Je opslaggeheugen raakt vol met bestanden die je niet ziet.', correct: false, misconception: 'Denkt dat uitgestelde updates zich opstapelen in je opslag.' },
          { text: 'Bekende fouten blijven al die tijd gewoon openstaan.', correct: true, explanation: 'Zo\'n bekende fout is een gat waar virussen doorheen komen, en de update maakt dat gat juist dicht.' },
          { text: 'Je moet daarna elk programma opnieuw installeren op je device.', correct: false, misconception: 'Denkt dat uitstellen je programma\'s onbruikbaar maakt.' }
        ],
        feedback: 'Een update is onderhoud dat niet kan wachten. Wat vandaag bekend is, is morgen bekend bij iedereen.'
      },
      // --- Terugkeervraag naar 2.2 ---
      {
        prompt: 'Op welk soort programma draaien Verkenner, Word en al je andere programma\'s?',
        leerdoel: LD_2_2[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Op het besturingssysteem, bijvoorbeeld Windows.', correct: true, explanation: 'Het besturingssysteem stuurt de hardware aan; alle andere programma\'s draaien daarbovenop.' },
          { text: 'Op de videokaart, want die maakt het beeld.', correct: false, misconception: 'Denkt dat een hardware-onderdeel programma\'s kan aansturen.' },
          { text: 'Op OneDrive, want daar staan al je bestanden.', correct: false, misconception: 'Verwart de opslagplek van bestanden met de aansturing van programma\'s.' },
          { text: 'Op het stuurprogramma van je toetsenbord.', correct: false, misconception: 'Denkt dat een stuurprogramma de hele computer aanstuurt in plaats van één onderdeel.' }
        ],
        feedback: 'Windows is de baas op je laptop. Verkenner en Word zijn gewone programma\'s die daarbovenop draaien.'
      }
    ]
  },

  '2.4': {
    learningGoals: LD_2_4,
    theorie: [
      {
        keyTerms: ['netwerk', 'server', 'client', 'router'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> In het lokaal opent YouTube gewoon. De site van school komt bij niemand in beeld. Ligt dat aan het netwerk of aan één server? Hoe redeneer je?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: kijk of er nog iets anders binnenkomt. Stap 2: YouTube werkt, dus jouw verbinding met internet doet het. Stap 3: de weg is dus in orde, en de router werkt ook. Stap 4: er is maar één bestemming die niet reageert. Stap 5: die bestemming is de server van school. Stap 6: jouw laptop is hier de client, en die vraagt gewoon netjes. Werkte er helemaal niets, dan was de weg het probleem geweest.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['IP-adres', 'gegevens', 'provider'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Een pagina laadt half. De tekst staat er al, maar de foto\'s nog niet. Wat zegt dat over de manier waarop een pagina bij jou aankomt?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: je typte het adres en drukte op enter. Stap 2: je device zocht het IP-adres bij die naam op. Stap 3: de router stuurde je vraag naar de server. Stap 4: de server stuurde de pagina niet in één stuk terug. Stap 5: hij knipte hem op in kleine pakketjes. Stap 6: de tekstpakketjes waren als eerste binnen, de beeldpakketjes nog niet. Je browser tekent alvast wat er is. Onderweg zag ook je provider deze gegevens langskomen.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een netwerk is twee of meer apparaten die verbonden zijn om gegevens uit te wisselen. Het internet is een netwerk van heel veel kleinere netwerken. Een server staat dag en nacht aan en levert iets; de client vraagt en dat is jouw laptop. De router stuurt je vraag de goede kant op en brengt het antwoord terug. Vraag je een website op, dan zoekt je device eerst het IP-adres op. Daarna gaat je vraag naar de server, die de pagina in pakketjes terugstuurt. Data staat op je device, in de cloud, op servers van bedrijven, bij je provider en in het logboek van school.</p>',
      keyTerms: ['netwerk', 'server', 'IP-adres']
    },
    vragen: [
      {
        prompt: 'Wat is een netwerk?',
        leerdoel: LD_2_4[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Eén computer met heel veel programma\'s erop.', correct: false, misconception: 'Denkt dat een netwerk iets is dat binnen één apparaat zit.' },
          { text: 'Een groot gebouw vol kasten met servers erin.', correct: false, misconception: 'Verwart het netwerk met een datacentrum.' },
          { text: 'Een kabel die je laptop met je scherm verbindt.', correct: false, misconception: 'Denkt dat elke kabel tussen apparaten meteen een netwerk maakt.' },
          { text: 'Twee of meer apparaten die verbonden zijn.', correct: true, explanation: 'Verbonden apparaten kunnen gegevens uitwisselen; thuis hangen je laptop, telefoon en tv aan één router.' }
        ],
        feedback: 'Twee apparaten die gegevens uitwisselen zijn al een netwerk. Het internet is het grootste netwerk van allemaal.'
      },
      {
        prompt: 'Jouw laptop vraagt een pagina op en een andere computer levert die. Hoe heet die leverende computer?',
        leerdoel: LD_2_4[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'De client van dat netwerk.', correct: false, misconception: 'Verwisselt de partij die vraagt met de partij die levert.' },
          { text: 'De router van dat netwerk.', correct: false, misconception: 'Denkt dat de wegwijzer ook de bestemming is.' },
          { text: 'De server van dat netwerk.', correct: true, explanation: 'Een server staat dag en nacht aan en levert diensten aan andere computers, zoals websites en mail.' },
          { text: 'De provider van dat netwerk.', correct: false, misconception: 'Verwart het bedrijf dat internet levert met de computer die de pagina levert.' }
        ],
        feedback: 'Denk aan het restaurant. Jij bestelt als client, de keuken levert als server en de ober is de router.'
      },
      {
        prompt: 'Waarvoor dient een IP-adres?',
        leerdoel: LD_2_4[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Het is het wachtwoord waarmee je op een website inlogt.', correct: false, misconception: 'Denkt dat een IP-adres bij jouw account hoort in plaats van bij een apparaat.' },
          { text: 'Het is het nummer waarop een apparaat te vinden is.', correct: true, explanation: 'Computers werken met nummers en niet met namen; het IP-adres is dus een soort huisnummer op internet.' },
          { text: 'Het is de naam van de website die je wilt bezoeken.', correct: false, misconception: 'Verwart de naam die jij typt met het nummer dat erbij hoort.' },
          { text: 'Het is de snelheid waarmee jouw internet werkt.', correct: false, misconception: 'Denkt dat elk getal rond internet iets over snelheid zegt.' }
        ],
        feedback: 'Een IP-adres is een huisnummer op internet. Het opzoeken van dat nummer bij een naam heet DNS.'
      },
      {
        prompt: 'Zet de stappen op volgorde. Wat gebeurt er direct nadat je een adres hebt getypt en op enter hebt gedrukt?',
        leerdoel: LD_2_4[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De server knipt de pagina meteen op in kleine pakketjes.', correct: false, misconception: 'Slaat de zoekstap over en laat de server al werk doen voor de vraag er is.' },
          { text: 'Je browser tekent de pagina alvast op je scherm.', correct: false, misconception: 'Denkt dat de pagina er al is voordat er iets is opgehaald.' },
          { text: 'De router stuurt jouw vraag meteen naar de server door.', correct: false, misconception: 'Vergeet dat de router pas kan doorsturen als het nummer bekend is.' },
          { text: 'Je device zoekt eerst het IP-adres bij die naam op.', correct: true, explanation: 'Zonder IP-adres weet de router niet naar welke server jouw vraag toe moet.' }
        ],
        feedback: 'Eerst het nummer zoeken, dan pas versturen. Dat is de stap die de meeste mensen vergeten.'
      },
      {
        prompt: 'Een server stuurt een webpagina altijd in één groot stuk naar jouw laptop.',
        waar: false,
        leerdoel: LD_2_4[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Een pagina wordt opgeknipt in kleine pakketjes. Daarom zie je bij traag internet eerst tekst en pas daarna beeld.'
      },
      {
        prompt: 'Op welke plek staat jouw data zonder dat jij daar zelf iets voor doet?',
        leerdoel: LD_2_4[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'In het logboek van je provider en van school.', correct: true, explanation: 'Allebei houden ze bij wie wanneer welke pagina opvroeg; dat gebeurt automatisch en vaak is het verplicht.' },
          { text: 'In je map Documenten, tussen je eigen verslagen.', correct: false, misconception: 'Noemt een plek waar je juist zelf bewust iets neerzet.' },
          { text: 'Op de poster die je in paragraaf 2.2 gemaakt hebt.', correct: false, misconception: 'Verwart schoolwerk met gegevens die automatisch worden vastgelegd.' },
          { text: 'In het werkgeheugen, want dat bewaart alles voorgoed.', correct: false, misconception: 'Denkt dat het werkgeheugen gegevens langdurig bewaart.' }
        ],
        feedback: 'Data is meer dan wat je bewust deelt. Ook je zoekopdrachten en inlogmomenten worden ergens vastgelegd.'
      },
      {
        prompt: 'Wat is data? Noem daarna drie plekken waar data van jou bewaard wordt, en zeg per plek wie erbij kan.',
        type: 'open',
        leerdoel: LD_2_4[2],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Data is de verzamelnaam voor alle gegevens die ik maak en verstuur. Ook wat ik zonder het te merken achterlaat hoort erbij. De eerste plek is mijn eigen device, in het opslaggeheugen. Daar kan alleen ik bij, want ik moet inloggen. De tweede plek is OneDrive, dus de cloud. Daar kan ik bij en mijn docent als ik iets deel. De derde plek is de server van een app waar ik een account heb. Dat bedrijf kan er zelf ook bij. Daarnaast houden mijn provider en mijn school een logboek bij.',
        nakijkpunten: [
          'Je omschrijving van data gaat verder dan alleen je eigen bestanden.',
          'Je noemt drie plekken, bijvoorbeeld je device, de cloud en een server.',
          'Bij elke plek schrijf je op wie erbij kan.'
        ],
        feedback: 'Data is breder dan je bestanden. Het gaat ook om berichten, zoekopdrachten en inlogmomenten.'
      },
      // --- Terugkeervraag naar 2.3 ---
      {
        prompt: 'Waarom staan jouw schoolbestanden in OneDrive en niet op het bureaublad van een lokaalcomputer?',
        leerdoel: LD_2_3[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Omdat het bureaublad je bestanden na een week wist.', correct: false, misconception: 'Denkt dat bestanden op een apparaat vanzelf verdwijnen.' },
          { text: 'Omdat OneDrive je bestanden kleiner en sneller maakt.', correct: false, misconception: 'Denkt dat cloudopslag iets met de grootte van bestanden doet.' },
          { text: 'Omdat OneDrive bij jouw account hoort en dus meereist.', correct: true, explanation: 'Wat in de cloud staat hoort bij je account, dus je opent het op elk apparaat waar je inlogt.' },
          { text: 'Omdat het bureaublad alleen plaats heeft voor snelkoppelingen.', correct: false, misconception: 'Denkt dat je op het bureaublad helemaal geen bestand kunt opslaan.' }
        ],
        feedback: 'Wat op het apparaat staat, blijft op het apparaat. Alleen de cloud reist met jouw account mee.'
      },
      // --- Tweede terugkeervraag naar 2.3 ---
      {
        prompt: 'Je stappenschema van deze paragraaf is af en je wilt het snel bewaren. Welke sneltoets slaat je werk op?',
        leerdoel: LD_2_3[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Ctrl+A, want daarmee selecteer je eerst je hele schema.', correct: false, misconception: 'Denkt dat selecteren en opslaan één handeling zijn.' },
          { text: 'Ctrl+S, de S van opslaan in het Engels.', correct: true, explanation: 'Ctrl+S slaat je werk meteen op, zonder dat je naar het menu hoeft; doe het elke paar minuten.' },
          { text: 'Ctrl+P, want daarmee zet je je schema vast op papier.', correct: false, misconception: 'Verwart afdrukken met bewaren op je device.' },
          { text: 'Ctrl+Z, want daarmee zet je je laatste stap veilig terug.', correct: false, misconception: 'Kiest de terugknop omdat die ook met veiligheid te maken lijkt te hebben.' }
        ],
        feedback: 'De S staat voor save, het Engelse woord voor opslaan. Twee toetsen schelen je een hoop verloren werk.'
      }
    ]
  },

  '2.5': {
    learningGoals: LD_2_5,
    theorie: [
      {
        keyTerms: ['virus', 'werkgeheugen', 'opslaggeheugen'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Tarik zegt: mijn laptop is traag, dus er zit vast een virus in. Ook zijn ventilator maakt herrie. Hoe zoek je dit samen uit?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: verdeel de klachten in twee groepen. Stap 2: een virus is een programma, dus dat is software. Stap 3: een ventilator kun je vastpakken, dus dat is hardware. Stap 4: tegen software helpt een update of een virusscanner. Stap 5: tegen hardware helpt repareren of vervangen. Stap 6: traag zijn hoeft trouwens niet aan een virus te liggen. Te weinig werkgeheugen kan het ook zijn. Een vol opslaggeheugen betekent alleen dat er niets meer bij kan.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['bewijsstuk', 'bestandsnaam', 'diagnose'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sara heeft alles gedaan, maar haar map heet Nieuwe map en de bestanden heten document(1) tot document(4). Waarom is dat een probleem? En wat doet ze eraan?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: haar docent moet elk bestand openen om te zien wat het is. Stap 2: een bewijsstuk hoort zonder uitleg leesbaar te zijn. Stap 3: ze hernoemt de map naar Checkpoint hoofdstuk 2. Stap 4: ze klikt elk bestand aan en kiest Naam wijzigen, of ze drukt op F2. Stap 5: ze geeft elke bestandsnaam de vorm h2-onderwerp-voornaam-klas. Stap 6: ze doet daarna de diagnose in het oefenblok en leest terug wat misging.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Hardware kun je vasthouden en software niet, en daarom repareer je ze op een andere manier. Een virus is software en pak je aan met een update of een virusscanner. Een kapotte ventilator is hardware en moet gemaakt of vervangen worden. Je bestanden zet je in OneDrive, in een vakmap met een submap per hoofdstuk. Geef elke bestandsnaam een vaste vorm, bijvoorbeeld h2-onderdelenkaart-sam-1c. Dan vind je je werk op elke computer terug en ziet je docent meteen wat het is.</p>',
      keyTerms: ['virus', 'bestandsnaam']
    },
    vragen: [
      {
        prompt: 'Welk rijtje bestaat alleen uit hardware?',
        leerdoel: LD_2_5[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Videokaart, ventilator en moederbord.', correct: true, explanation: 'Deze drie kun je alle drie vastpakken, dus ze horen alle drie bij de hardware.' },
          { text: 'Videokaart, Excel en het stuurprogramma.', correct: false, misconception: 'Ziet het stuurprogramma als hardware omdat het bij een onderdeel hoort.' },
          { text: 'Windows, Word en de browser op je laptop.', correct: false, misconception: 'Kiest het rijtje dat juist helemaal uit software bestaat.' },
          { text: 'Moederbord, besturingssysteem en ventilator.', correct: false, misconception: 'Denkt dat het besturingssysteem hardware is omdat het de onderdelen aanstuurt.' }
        ],
        feedback: 'Loop elk woord langs met dezelfde test: kun je het vasthouden? Alleen dan is het hardware.'
      },
      {
        prompt: 'Een virus vertraagt je laptop en tegelijk is de ventilator stuk. Waarom pak je die twee anders aan?',
        leerdoel: LD_2_5[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat het ene ernstig is en het andere niet zo erg.', correct: false, misconception: 'Kiest op ernst in plaats van op de vraag of het hardware of software is.' },
          { text: 'Omdat een virus vanzelf weggaat en een ventilator niet.', correct: false, misconception: 'Denkt dat schadelijke software vanzelf verdwijnt.' },
          { text: 'Omdat een ventilator bij de koeling hoort en een virus niet.', correct: false, misconception: 'Noemt een verschil dat waar is maar niets zegt over de oplossing.' },
          { text: 'Omdat een virus software is en een ventilator hardware.', correct: true, explanation: 'Software pak je aan met een update of virusscanner; hardware moet je laten repareren of vervangen.' }
        ],
        feedback: 'De groep bepaalt het gereedschap: een programma tegen een programma, een schroevendraaier tegen een onderdeel.'
      },
      {
        prompt: 'Wat doet de processor in je device?',
        leerdoel: LD_2_1[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Hij bewaart je bestanden ook als de stroom eraf gaat.', correct: false, misconception: 'Verwart het onderdeel dat rekent met het onderdeel dat bewaart.' },
          { text: 'Hij verbindt alle onderdelen zodat ze samenwerken.', correct: false, misconception: 'Verwart het onderdeel dat rekent met de plaat waarop alles vastzit.' },
          { text: 'Hij voert de taken snel en efficiënt uit.', correct: true, explanation: 'De processor is het rekenhart: hij verwerkt alle opdrachten die jouw programma\'s geven.' },
          { text: 'Hij voert de warmte af zodat het apparaat koel blijft.', correct: false, misconception: 'Verwart de processor met de koeling die eromheen zit.' }
        ],
        feedback: 'De processor rekent. Merk je dat alles traag wordt, dan houdt hij het werk vaak niet meer bij.'
      },
      {
        prompt: 'Welke van deze vier hoort bij de zeven onderdelen die je in 2.1 hebt geleerd?',
        leerdoel: LD_2_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De muis die naast je laptop op tafel ligt.', correct: false, misconception: 'Denkt dat elk apparaat rond de computer een intern onderdeel is.' },
          { text: 'Het opslaggeheugen waar je bestanden staan.', correct: true, explanation: 'Opslaggeheugen staat in het rijtje van zeven; het bewaart alles ook nadat het apparaat uitgaat.' },
          { text: 'De oplader waarmee je de accu bijlaadt.', correct: false, misconception: 'Denkt dat de oplader een van de onderdelen binnenin is.' },
          { text: 'Het scherm waarop je het beeld ziet.', correct: false, misconception: 'Verwart het scherm met de videokaart die het beeld maakt.' }
        ],
        feedback: 'De zeven zitten binnen in het apparaat. Muis, scherm en oplader horen erbij, maar niet in dat rijtje.'
      },
      {
        prompt: 'In een vaste computer is meer ruimte voor grote onderdelen, en die raken hun warmte beter kwijt.',
        waar: true,
        leerdoel: LD_2_1[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt, en daarom is een vaste computer bij hetzelfde geld meestal krachtiger dan een laptop.'
      },
      {
        prompt: 'Je laat je laptop altijd aan de oplader hangen. Welk risico loop je daarmee?',
        leerdoel: LD_2_1[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Je verliest alle bestanden uit je opslaggeheugen.', correct: false, misconception: 'Denkt dat stroom en geheugen met elkaar te maken hebben.' },
          { text: 'Je videokaart maakt daarna een veel slechter beeld.', correct: false, misconception: 'Verbindt de stroomvoorziening met de kwaliteit van het beeld.' },
          { text: 'Je besturingssysteem installeert dan geen updates meer.', correct: false, misconception: 'Denkt dat opladen invloed heeft op de software van het apparaat.' },
          { text: 'Je accu kan oververhitten en zelfs in brand vliegen.', correct: true, explanation: 'Een accu die constant vol wordt gehouden wordt warm; in het ergste geval loopt dat uit op brand.' }
        ],
        feedback: 'Warmte is hier het gevaar. Haal de stekker eruit zodra je batterij vol is, ook op school.'
      },
      {
        prompt: 'Windows is het besturingssysteem van je laptop. In welke groep horen Word, Excel en PowerPoint dan thuis?',
        leerdoel: LD_2_2[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Dat zijn stuurprogramma\'s voor losse onderdelen.', correct: false, misconception: 'Verwart een programma waarin je werkt met de software achter een onderdeel.' },
          { text: 'Dat zijn ook besturingssystemen, net als Windows.', correct: false, misconception: 'Denkt dat elk groot programma van Microsoft een besturingssysteem is.' },
          { text: 'Dat zijn programma\'s die op Windows draaien.', correct: true, explanation: 'Ze horen bij Microsoft Office en draaien bovenop het besturingssysteem dat de hardware aanstuurt.' },
          { text: 'Dat zijn onderdelen van de hardware in je laptop.', correct: false, misconception: 'Denkt dat programma\'s die je ziet ook iets zijn dat je kunt vastpakken.' }
        ],
        feedback: 'Er is er maar één de baas. Windows stuurt de hardware aan, en Office draait daar gewoon bovenop.'
      },
      {
        prompt: 'Welk programma van Microsoft Office gebruik je om een tabel met cijfers bij te houden?',
        leerdoel: LD_2_2[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Excel', correct: true, explanation: 'Excel werkt met rijen en kolommen en is gemaakt om met getallen te rekenen.' },
          { text: 'Word', correct: false, misconception: 'Kent Word als het programma voor elke schoolopdracht.' },
          { text: 'PowerPoint', correct: false, misconception: 'Denkt dat dia\'s ook bedoeld zijn om cijfers in bij te houden.' },
          { text: 'Outlook', correct: false, misconception: 'Verwart een mailprogramma met een programma om in te rekenen.' }
        ],
        feedback: 'Excel is het programma met rijen en kolommen. In hoofdstuk 4 ga je er zelf mee rekenen.'
      },
      {
        prompt: 'Waarom moet je je device regelmatig updaten?',
        leerdoel: LD_2_2[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat je accu daardoor veel langer meegaat.', correct: false, misconception: 'Denkt dat een update invloed heeft op de levensduur van de accu.' },
          { text: 'Omdat je anders geen bestanden meer kunt opslaan.', correct: false, misconception: 'Verwart updaten met een volle opslag.' },
          { text: 'Omdat er fouten uit gaan en functies bij komen.', correct: true, explanation: 'Een bekende fout is een gat waar virussen doorheen komen; een update maakt dat gat dicht.' },
          { text: 'Omdat je device anders langzamer opstart dan normaal.', correct: false, misconception: 'Noemt een gevolg dat soms klopt maar niet de reden is.' }
        ],
        feedback: 'Updaten is onderhoud. Sla je het over, dan blijft precies het gat openstaan dat al bekend is.'
      },
      {
        prompt: 'Een stuurprogramma is de software die één hardware-onderdeel aanstuurt.',
        waar: true,
        leerdoel: LD_2_2[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Bij een update wordt zo\'n stuurprogramma vaak meteen meegenomen en bijgewerkt.'
      },
      {
        prompt: 'Je wilt in Verkenner een nieuwe map maken voor dit hoofdstuk. Welke knop gebruik je daarvoor?',
        leerdoel: LD_2_3[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De knop Delen, boven aan het venster.', correct: false, misconception: 'Denkt dat delen ook een plek voor een bestand aanmaakt.' },
          { text: 'De knop Nieuw, boven aan het venster.', correct: true, explanation: 'Met Nieuw maak je een nieuwe map of een nieuw bestand aan, precies op de plek waar je staat.' },
          { text: 'De knop Plakken, boven aan het venster.', correct: false, misconception: 'Denkt dat plakken zonder knippen ook een map oplevert.' },
          { text: 'De knop Naam wijzigen, boven aan het venster.', correct: false, misconception: 'Denkt dat je iets kunt hernoemen wat nog niet bestaat.' }
        ],
        feedback: 'Nieuw maakt iets aan wat er nog niet was. Naam wijzigen verandert alleen iets wat er al staat.'
      },
      {
        prompt: 'Fatima zet haar verslag op het bureaublad van een lokaalcomputer. Wat gebeurt er als ze morgen een andere laptop krijgt?',
        leerdoel: LD_2_3[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Haar verslag staat er ook op, want school deelt de opslag.', correct: false, misconception: 'Denkt dat schoolapparaten automatisch één gezamenlijk geheugen hebben.' },
          { text: 'Haar verslag staat er op zodra ze het wifi weer aanzet.', correct: false, misconception: 'Denkt dat een verbinding op zichzelf bestanden overzet.' },
          { text: 'Haar verslag staat er op als die laptop evenveel geheugen heeft.', correct: false, misconception: 'Denkt dat de grootte van het geheugen bepaalt of een bestand meereist.' },
          { text: 'Haar verslag staat er niet op; het bleef op dat apparaat.', correct: true, explanation: 'Het bureaublad hoort bij het opslaggeheugen van dat ene apparaat, dus het bestand reist niet mee.' }
        ],
        feedback: 'Alleen de cloud reist mee met je account. Het bureaublad hoort altijd bij één apparaat.'
      },
      {
        prompt: 'Je hebt een stuk tekst geselecteerd en je wilt het ergens anders neerzetten, zonder het origineel te bewaren. Welke twee sneltoetsen gebruik je?',
        leerdoel: LD_2_3[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Eerst Ctrl+X en daarna Ctrl+V.', correct: true, explanation: 'Ctrl+X knipt de tekst weg van de oude plek en Ctrl+V zet hem op de nieuwe plek neer.' },
          { text: 'Eerst Ctrl+C en daarna Ctrl+V.', correct: false, misconception: 'Kopieert in plaats van te knippen, dus het origineel blijft staan.' },
          { text: 'Eerst Ctrl+Z en daarna Ctrl+Y.', correct: false, misconception: 'Gebruikt de terugknoppen in plaats van de knip- en plakknoppen.' },
          { text: 'Eerst Ctrl+A en daarna Ctrl+S.', correct: false, misconception: 'Selecteert alles en slaat op, maar verplaatst niets.' }
        ],
        feedback: 'De X is de schaar en de V is de lijm. Wil je het origineel wel bewaren, dan gebruik je Ctrl+C.'
      },
      {
        prompt: 'Ctrl+Z maakt je laatste actie ongedaan, zodat je niets hoeft over te typen.',
        waar: true,
        leerdoel: LD_2_3[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt, en dat is de meest onderschatte sneltoets. Met Ctrl+Y zet je die stap juist weer terug.'
      },
      {
        prompt: 'Op school laadt geen enkele website meer, ook YouTube niet. Waar zit het probleem waarschijnlijk?',
        leerdoel: LD_2_4[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Bij de server van één website die het niet doet.', correct: false, misconception: 'Kiest de bestemming terwijl er helemaal niets meer binnenkomt.' },
          { text: 'Bij het netwerk of de router van de school.', correct: true, explanation: 'Als er niets meer binnenkomt is de weg stuk, en niet één bestemming aan het eind van die weg.' },
          { text: 'Bij het werkgeheugen van jouw eigen laptop.', correct: false, misconception: 'Zoekt de oorzaak in een onderdeel dat niets met de verbinding doet.' },
          { text: 'Bij het IP-adres dat jouw laptop gekregen heeft.', correct: false, misconception: 'Denkt dat één nummer de oorzaak is terwijl de hele klas last heeft.' }
        ],
        feedback: 'Kijk altijd apart naar de weg en naar de bestemming. Komt er niets meer binnen, dan is de weg het probleem.'
      },
      {
        prompt: 'Waarom stuurt een server een pagina in kleine pakketjes in plaats van in één stuk?',
        leerdoel: LD_2_4[1],
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat een server nooit een heel bestand tegelijk kan lezen.', correct: false, misconception: 'Denkt dat de server technisch niet in staat is een pagina in één keer te sturen.' },
          { text: 'Omdat pakketjes verschillende routes kunnen nemen.', correct: true, explanation: 'Raakt er onderweg één pakketje kwijt, dan hoeft alleen dat pakketje opnieuw en niet de hele pagina.' },
          { text: 'Omdat jouw browser maar één pakketje tegelijk kan tekenen.', correct: false, misconception: 'Denkt dat de browser de reden is in plaats van de reis.' },
          { text: 'Omdat de router alleen kleine bestanden mag doorlaten.', correct: false, misconception: 'Denkt dat een router een grens stelt aan de grootte van een pagina.' }
        ],
        feedback: 'Denk aan verhuizen in dozen. Raakt er één doos zoek, dan haal je alleen die ene opnieuw op.'
      },
      {
        prompt: 'Welke partij levert jou thuis het internet en houdt daarbij een logboek bij?',
        leerdoel: LD_2_4[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De client die jij zelf in je hand hebt.', correct: false, misconception: 'Verwart het eigen apparaat met het bedrijf dat de verbinding levert.' },
          { text: 'De browser waarin jij de pagina opvraagt.', correct: false, misconception: 'Denkt dat het programma waarin je surft ook de verbinding regelt.' },
          { text: 'De provider die jouw verbinding verzorgt.', correct: true, explanation: 'De provider is het bedrijf dat internet levert; in het logboek staat wie wanneer welke pagina opvroeg.' },
          { text: 'Het datacentrum waar de servers in staan.', correct: false, misconception: 'Verwart de plek waar servers staan met het bedrijf dat jouw verbinding levert.' }
        ],
        feedback: 'Je provider ziet al je verkeer langskomen. Op school doet de ICT-afdeling hetzelfde met het schoolnetwerk.'
      },
      {
        prompt: 'Beschrijf hoe jij je schoolwerk opslaat en benoemt, zodat je het over twee maanden op elke computer terugvindt.',
        type: 'open',
        leerdoel: LD_2_5[1],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik sla alles op in OneDrive en niet op het bureaublad. OneDrive is de cloud, dus mijn werk hoort bij mijn account. Daardoor open ik thuis hetzelfde bestand als op school. In OneDrive heb ik één map per vak, met de naam Digitale geletterdheid. Daarin zit een submap per hoofdstuk, dus Hoofdstuk 1 en Hoofdstuk 2. Elke bestandsnaam maak ik volgens dezelfde afspraak. Mijn onderdelenkaart heet h2-onderdelenkaart-sam-1c. Zo zie ik meteen het hoofdstuk, het onderwerp, mijn naam en mijn klas.',
        nakijkpunten: [
          'Je slaat op in OneDrive, want de cloud hoort bij jouw account.',
          'Je noemt een vakmap met daarin een submap per hoofdstuk.',
          'Je geeft één voorbeeld van een bestandsnaam volgens jouw vaste afspraak.'
        ],
        feedback: 'Terugvinden is een afspraak en geen geluk. Een vaste plek plus een naam die zichzelf uitlegt.'
      },
      {
        prompt: 'Noem de vier gebruiksregels die op school voor je device gelden. Schrijf bij elke regel in één zin waarom die regel bestaat.',
        type: 'open',
        leerdoel: LD_H1_DELEN,
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Regel één: laat je computer nooit onbeheerd achter. Anders werkt een ander onder mijn naam verder. Regel twee: geef nooit je wachtwoord aan andere mensen, ook niet aan je beste vriend. Ik blijf namelijk zelf verantwoordelijk voor mijn account. Regel drie: downloaden mag, maar ik ben er zelf verantwoordelijk voor. Daarom gebruik ik alleen sites die ik vertrouw. Regel vier: kom ik er zelf niet uit, dan ga ik direct naar mijn mentor of de ICT-afdeling. Zelf sleutelen maakt het probleem meestal groter.',
        nakijkpunten: [
          'Alle vier de gebruiksregels staan er, in je eigen woorden.',
          'Bij elke regel schrijf je één zin over waarom die regel bestaat.',
          'Bij regel één en twee gaat je reden over je account, niet over diefstal.'
        ],
        feedback: 'Regel één en twee gaan over hetzelfde: wie bij jouw ingelogde account kan, handelt onder jouw naam.'
      },
      {
        prompt: 'Wat is het duidelijkste verschil tussen hardware en software?',
        leerdoel: LD_2_5[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Hardware kost geld en software krijg je er gratis bij.', correct: false, misconception: 'Denkt dat de prijs bepaalt in welke groep iets valt.' },
          { text: 'Hardware kun je vasthouden en software niet.', correct: true, explanation: 'Dat is de test die overal werkt: een toetsenbord pak je op, Windows niet.' },
          { text: 'Hardware zit binnenin en software zit op je scherm.', correct: false, misconception: 'Kijkt naar waar iets zit in plaats van naar wat het is.' },
          { text: 'Hardware gaat kapot en software gaat nooit kapot.', correct: false, misconception: 'Denkt dat programma\'s geen fouten of storingen kunnen hebben.' }
        ],
        feedback: 'Eén vraag beslist het: kun je het oppakken? Die test gebruik je de rest van het schooljaar.'
      },
      // --- Tweede ronde: elk leerdoel dat hierboven nog maar één keer aan bod
      // kwam, krijgt hier zijn tweede meetmoment. Daarmee komen alle veertien
      // verplichte leerdoelen van 2.1 tot en met 2.5 minstens twee keer terug.
      {
        prompt: 'Kies het groepje van drie dat helemaal binnen in de kast of de laptop zit.',
        leerdoel: LD_2_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Werkgeheugen, koeling en geluidskaart.', correct: true, explanation: 'Deze drie horen bij de zeven onderdelen die je niet ziet zolang de kap dicht zit.' },
          { text: 'Scherm, muis en toetsenbord.', correct: false, misconception: 'Denkt dat alles wat bij de computer hoort ook binnenin zit.' },
          { text: 'Videokaart, oplader en processor.', correct: false, misconception: 'Ziet de oplader als een onderdeel binnenin omdat hij bij de laptop hoort.' },
          { text: 'Moederbord, printer en opslaggeheugen.', correct: false, misconception: 'Rekent een apparaat dat ernaast staat mee als intern onderdeel.' }
        ],
        feedback: 'Twee van de drie kloppen is niet genoeg. Alleen wat achter de kap zit hoort bij de zeven.'
      },
      {
        prompt: 'Je speelt een zwaar spel en het beeld gaat schokken zodra er veel tegelijk gebeurt. Welk onderdeel doet daar zijn werk?',
        leerdoel: LD_2_1[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De geluidskaart, die stuurt het spel naar je koptelefoon.', correct: false, misconception: 'Kiest de kaart voor geluid terwijl de klacht over beeld gaat.' },
          { text: 'Het opslaggeheugen, waar het spel op je device staat.', correct: false, misconception: 'Denkt dat de plek waar een spel staat ook bepaalt hoe soepel het loopt.' },
          { text: 'De videokaart, die maakt alles wat je op je scherm ziet.', correct: true, explanation: 'Schokkend beeld hoort bij de videokaart; die moet elk plaatje op je scherm opnieuw tekenen.' },
          { text: 'Het moederbord, want daar zit dat spel toch ook op vast.', correct: false, misconception: 'Kiest opnieuw het onderdeel dat alles verbindt in plaats van dat met die ene taak.' }
        ],
        feedback: 'Klacht over beeld, dus kijk naar het onderdeel dat beeld maakt. Bij haperen speelt het werkgeheugen vaak mee.'
      },
      {
        prompt: 'Milan zoekt op zijn Chromebook het Windows-vlaggetje en vindt het nergens. Hoe komt dat?',
        leerdoel: LD_2_2[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Zijn Chromebook heeft een ander besturingssysteem.', correct: true, explanation: 'Elk besturingssysteem heeft zijn eigen balk en zijn eigen knoppen, dus het vlaggetje hoort daar niet.' },
          { text: 'Zijn Chromebook is nog niet helemaal opgestart.', correct: false, misconception: 'Denkt dat een ontbrekende knop altijd een opstartprobleem is.' },
          { text: 'Zijn Chromebook heeft de laatste update nog niet gehad.', correct: false, misconception: 'Denkt dat een update knoppen van een ander besturingssysteem toevoegt.' },
          { text: 'Zijn Chromebook heeft het vlaggetje van de taakbalk gehaald.', correct: false, misconception: 'Denkt dat elk apparaat dezelfde knoppen heeft en dat er eentje verborgen is.' }
        ],
        feedback: 'Er is niets stuk aan zijn Chromebook. Andere baas op het apparaat, dus ook een andere balk onderin.'
      },
      {
        prompt: 'Je koptelefoon doet het al maanden niet meer op je laptop, en je hebt in die tijd niets bijgewerkt. Wat probeer je als eerste?',
        leerdoel: LD_2_2[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ik koop meteen een nieuwe koptelefoon, want deze is vast stuk.', correct: false, misconception: 'Zoekt de oorzaak in de hardware voordat de software gecontroleerd is.' },
          { text: 'Ik ga in de systeeminstellingen zelf van alles omzetten.', correct: false, misconception: 'Gaat sleutelen in diepe instellingen, wat de bron juist afraadt.' },
          { text: 'Ik zet mijn laptop een keer uit en daarna weer aan.', correct: false, misconception: 'Denkt dat opnieuw opstarten een verouderd stuurprogramma bijwerkt.' },
          { text: 'Ik ga naar Instellingen en installeer de updates.', correct: true, explanation: 'Bij een update wordt ook het stuurprogramma van de geluidskaart bijgewerkt, en dat lost zo\'n storing vaak op.' }
        ],
        feedback: 'Eerst updaten, dan pas kopen. Een update neemt het stuurprogramma van je onderdelen meteen mee.'
      },
      {
        prompt: 'Je map heet Nieuwe map en je wilt hem Hoofdstuk 2 noemen. Wat gebruik je daarvoor?',
        leerdoel: LD_2_3[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De knop Nieuw, boven in het venster van Verkenner.', correct: false, misconception: 'Denkt dat je een nieuwe map moet maken in plaats van deze te hernoemen.' },
          { text: 'De knop Naam wijzigen, of de toets F2 op je toetsenbord.', correct: true, explanation: 'Naam wijzigen verandert de naam van iets dat er al staat, en F2 doet precies hetzelfde.' },
          { text: 'De knop Delen, boven in het venster van Verkenner.', correct: false, misconception: 'Verwart delen met een ander met het aanpassen van de naam.' },
          { text: 'De knop Verwijderen, en daarna maak je hem opnieuw aan.', correct: false, misconception: 'Denkt dat hernoemen alleen kan door iets weg te gooien en over te doen.' }
        ],
        feedback: 'Nieuw maakt iets aan, Naam wijzigen past iets aan. Met F2 gaat het nog een stuk sneller.'
      },
      {
        prompt: 'Een bestand dat op het bureaublad van een lokaalcomputer staat, staat daardoor ook in jouw OneDrive.',
        waar: false,
        leerdoel: LD_2_3[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Niet waar: die twee plekken staan los van elkaar. Wil je het in de cloud, dan zet je het er zelf in.'
      },
      {
        prompt: 'Welk apparaat stuurt jouw vraag de goede kant op en brengt het antwoord weer bij je terug?',
        leerdoel: LD_2_4[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De router, het kastje tussen jou en het internet.', correct: true, explanation: 'De router is de wegwijzer: hij stuurt je vraag door en brengt het antwoord bij jouw apparaat terug.' },
          { text: 'De server, de computer die dag en nacht aan staat.', correct: false, misconception: 'Verwart de wegwijzer met de bestemming die levert.' },
          { text: 'De client, het apparaat waar jij op zit te werken.', correct: false, misconception: 'Verwart de vrager met het apparaat dat het verkeer regelt.' },
          { text: 'Het datacentrum, de hal waar heel veel servers staan.', correct: false, misconception: 'Verwart de plek waar servers staan met het apparaat dat verkeer doorstuurt.' }
        ],
        feedback: 'De router is de ober van het internet. Hij kookt niet en hij bestelt niet, hij loopt heen en weer.'
      },
      {
        prompt: 'De pakketjes van een pagina komen bij jou binnen. Wat doet je browser daar vervolgens mee?',
        leerdoel: LD_2_4[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Hij stuurt ze eerst naar de server terug ter controle.', correct: false, misconception: 'Denkt dat er nog een ronde langs de server nodig is voor je iets ziet.' },
          { text: 'Hij bewaart ze voorgoed in je opslaggeheugen op je device.', correct: false, misconception: 'Verwart tijdelijk tonen met blijvend opslaan.' },
          { text: 'Hij zet ze op volgorde en tekent daarmee de pagina.', correct: true, explanation: 'De pakketjes komen door elkaar aan; de browser legt ze op volgorde en bouwt daar je pagina mee op.' },
          { text: 'Hij zoekt er eerst het bijbehorende IP-adres bij op.', correct: false, misconception: 'Zet de stap van het opzoeken aan het eind in plaats van aan het begin.' }
        ],
        feedback: 'Op volgorde leggen en tekenen: dat is de laatste stap van de vijf. Het opzoeken gebeurde helemaal vooraan.'
      },
      {
        prompt: 'Alleen dingen die jij zelf bewust deelt, worden ergens van jou bewaard.',
        waar: false,
        leerdoel: LD_2_4[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'reflecteren',
        feedback: 'Niet waar: je laat ook data achter zonder er iets voor te doen. Denk aan het logboek van je provider.'
      },
      {
        prompt: 'Welke bestandsnaam laat je docent in één blik zien wat het is en van wie?',
        leerdoel: LD_2_5[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'document(3) definitieve versie nieuw.docx', correct: false, misconception: 'Denkt dat woorden als definitief en nieuw genoeg zeggen over de inhoud.' },
          { text: 'h2-onderdelenkaart-sam-1c.docx', correct: true, explanation: 'Hierin staan het hoofdstuk, het onderwerp, de voornaam en de klas, precies in die volgorde.' },
          { text: 'digitalegeletterdheidopdrachtvanvandaag.docx', correct: false, misconception: 'Denkt dat een lange naam vanzelf een duidelijke naam is.' },
          { text: 'werkstuk versie 2 echt af nu.docx', correct: false, misconception: 'Denkt dat een versienummer belangrijker is dan het onderwerp en de eigenaar.' }
        ],
        feedback: 'Een goede naam beantwoordt drie vragen tegelijk: welk hoofdstuk, welk onderwerp, van wie.'
      }
    ]
  }
};
