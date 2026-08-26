// Verrijkingslaag hoofdstuk 2 - Je device en hoe het werkt.
// Basisberoepsgerichte leerweg (bb).
//
// Zie scripts/seed-verrijking/PATROON.md voor het formaat van een vraag, de
// regels over afleiders en de eisen aan feedback.
//
// Dit hoofdstuk heeft in bb VIER paragrafen: 2.1, 2.2, 2.3 en het checkpoint
// 2.5. 2.4 vervalt voor basis en 2.6 is de plusparagraaf van de theoretische
// leerweg. 2.1 is dus de eerste paragraaf en kijkt nergens op terug; 2.2 en 2.3
// hebben allebei een terugkeervraag naar een eerdere paragraaf.
//
// Opzet per paragraaf, volgens de blauwdruk en het bb-profiel:
//   - elk leerdoel heeft zijn EIGEN startvraag. Die staan als `checks` in
//     scripts/seed-structuur/bb/h2.mjs, met antwoord en uitleg erbij;
//   - elk theorieblok heeft een uitgewerkt voorbeeld in vraag-en-antwoordvorm.
//     Dat voorbeeld komt VOOR het oefenblok en dus voor het zelfstandig
//     oefenen. In bb is het voorbeeld altijd een situatie uit hun eigen wereld:
//     een laptop die hapert tijdens een game, een verslag dat thuis niet
//     opengaat, een tekst die op de verkeerde plek staat;
//   - elke afsluitquiz vanaf 2.2 haalt TWEE leerdoelen op uit een EERDERE
//     paragraaf van dit hoofdstuk, zoals de blauwdruk vraagt. In 2.2 zijn dat
//     de ruimte in een vaste computer (leerdoel 3 van 2.1) en het werkgeheugen
//     (leerdoel 2 van 2.1); in 2.3 zijn dat de processor die niet bewaart
//     (leerdoel 2 van 2.1) en hardware tegenover software (leerdoel 1 van 2.2).
//     2.1 is de eerste paragraaf en kijkt dus nergens op terug;
//   - de hoofdstuktoets van 2.5 bevraagt alle ELF verplichte leerdoelen van
//     2.1, 2.2, 2.3 en 2.5. Elk leerdoel komt er twee keer in terug, twee ervan
//     zelfs drie keer, en de vier gebruiksregels uit de bronles staan er als
//     open vraag in (zie de kop van het structuurbestand voor de
//     leerdoelkoppeling).
//
// BB-VORM: VEEL KLEINE MOMENTEN
// -----------------------------
// Het bb-profiel zegt: vorm gaat voor inhoud, en een leerling moet elke minuut
// iets kunnen aanklikken. Daarom staan er veel korte vragen in plaats van een
// paar grote. Geteld over heel hoofdstuk 2 in bb: 26 meerkeuze, 27
// waar-niet-waar en 5 open vragen op 58 vragen totaal. Bijna de helft van de
// vragen is dus een korte goed-of-fout-knop. Elke afsluitquiz heeft tien tot
// dertien vragen en de hoofdstuktoets er 24, zodat de tokens over veel kleine
// momenten verdeeld worden in plaats van over een paar dikke vragen aan het
// eind.
//
// De reden waarom een antwoord goed is staat in `explanation`, niet in de
// antwoordtekst zelf. Feedback is kort, positief en benoemt wat er goed ging.
//
// RAADBAARHEID OP VORM: BEIDE RICHTINGEN, NIET EEN
// ------------------------------------------------
// De vorige versie van dit bestand maakte de afleiders met opzet even lang of
// langer dan het goede antwoord. Dat was een overcorrectie op mechanische
// controle 2, die alleen telt hoe vaak het goede antwoord het LANGST is: het
// spiegelbeeld ontstond, met in 22 van de 26 meerkeuzevragen het goede antwoord
// als strikt KORTSTE knop (85%). Een leerling die niets las en steeds de
// kortste knop plus "Waar" klikte, haalde daarmee 82% op de hoofdstuktoets.
//
// Nu geldt de 40%-grens in BEIDE richtingen, en ruim: het goede antwoord is in
// 4 van de 26 meerkeuzevragen (15%) de kortste knop en in 4 (15%) de langste.
// In de overige achttien staat er zowel een kortere als een langere afleider
// naast. De redengevende "want ..."-bijzin staat waar PATROON.md hem wil
// hebben: in `misconception` bij de afleider en in `explanation` bij het goede
// antwoord, niet in de knoptekst. Blijft de bijzin toch in de knoptekst staan,
// dan heeft het goede antwoord er zelf ook een.
//
// De waar-niet-waar-stellingen zijn per blok ongeveer half waar en half niet
// waar; in de hoofdstuktoets precies 5 om 5, en over het hoofdstuk 13 om 14.
// Het goede antwoord staat gespreid over positie 1 tot en met 4. Blind de
// kortste knop plus "Waar" klikken levert nu 32% op over het hele hoofdstuk en
// 32% op de hoofdstuktoets zelf: kansniveau.
//
// De bb-vragen zijn opnieuw geschreven en niet overgenomen uit kb/h2.mjs of
// tl/h2.mjs: kortere zinnen, één idee per vraag en voorbeelden uit de
// leefwereld van een brugklasser.

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
const LD_2_5 = [
  'Je kunt hardware en software uit elkaar houden en uitleggen wat ze doen.',
  'Je kunt je bestanden zo opslaan dat je ze op elke computer terugvindt.'
];

export default {
  '2.1': {
    learningGoals: LD_2_1,
    theorie: [
      {
        keyTerms: ['device', 'hardware', 'software'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Jaylen krijgt op school een laptop. Zijn broer heeft thuis een vaste computer om te gamen. Waarom loopt dat spel bij zijn broer soepeler?</p>',
          '<p><strong>Antwoord.</strong> In een vaste computer is meer ruimte. Daar passen grotere onderdelen in. Grote onderdelen raken hun warmte beter kwijt. Daarom is zo\'n computer krachtiger. In een laptop zitten kleine onderdelen. Die passen naast de batterij. De laptop van Jaylen kun je wel meenemen naar school. Dat kan zijn broer met zijn kast niet.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['processor', 'werkgeheugen', 'koeling', 'moederbord'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Bij Amira hapert een spel. Haar laptop wordt heet en blaast hard. Ze heeft nog 200 GB vrij. Welke onderdelen doen hier hun werk?</p>',
          '<p><strong>Antwoord.</strong> Het haperen komt niet door haar opslag. Die is nog half leeg. Het komt door het werkgeheugen of de processor. Die twee moeten het spel nu draaien. De processor rekent hard en wordt daardoor warm. De koeling blaast die warmte weg met een ventilator. Daarom hoor jij dat geblaas. Al deze onderdelen zitten op het moederbord vast.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>In een computer zitten zeven belangrijke onderdelen. De processor rekent en het werkgeheugen onthoudt tijdelijk. Het opslaggeheugen bewaart je bestanden. De geluidskaart maakt geluid en de videokaart maakt beeld. De koeling blaast warmte weg en op het moederbord zit alles vast. Een laptop heeft een batterij, een vaste computer heeft meer ruimte.</p>',
      keyTerms: ['geluidskaart', 'videokaart']
    },
    vragen: [
      {
        prompt: 'Een processor, een videokaart en een moederbord zitten in een computer.',
        waar: true,
        leerdoel: LD_2_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Goed gezien. Dit zijn drie van de zeven onderdelen uit de theorie.'
      },
      {
        prompt: 'Welk onderdeel stuurt het geluid naar je koptelefoon?',
        leerdoel: LD_2_1[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'De videokaart.', correct: false, misconception: 'Haalt geluid en beeld door elkaar; de videokaart regelt je scherm.' },
          { text: 'De geluidskaart, want die zet geluid naar buiten.', correct: true, explanation: 'Die stuurt het geluid naar je koptelefoon of naar de speakers.' },
          { text: 'De processor, want die voert alle taken van je device uit.', correct: false, misconception: 'Denkt dat de processor alles zelf doet.' },
          { text: 'De koeling, want die blaast met een ventilator de warmte weg.', correct: false, misconception: 'Verwart het geblaas van de ventilator met geluid uit je koptelefoon.' }
        ],
        feedback: 'Prima. Hoor je iets? Dan is het altijd de geluidskaart.'
      },
      {
        prompt: 'Het werkgeheugen bewaart je bestanden ook als je laptop uitgaat.',
        waar: false,
        leerdoel: LD_2_1[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Goed opgelet. Bewaren doet de opslag. Het werkgeheugen onthoudt alleen even.'
      },
      {
        prompt: 'Wat is de taak van het werkgeheugen, ook wel RAM genoemd?',
        leerdoel: LD_2_1[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Gegevens voor altijd bewaren, ook als je device uit staat.', correct: false, misconception: 'Verwart het werkgeheugen met het opslaggeheugen.' },
          { text: 'Beelden mooier maken.', correct: false, misconception: 'Verwart het werkgeheugen met de videokaart.' },
          { text: 'Programma\'s tijdelijk ondersteunen zodat je laptop soepel werkt.', correct: true, explanation: 'Het houdt even vast waar je nu mee bezig bent.' },
          { text: 'Bestanden klaarzetten en daarna naar de printer sturen.', correct: false, misconception: 'Denkt dat het werkgeheugen met printen te maken heeft.' }
        ],
        feedback: 'Sterk. RAM is er alleen voor wat je nu doet, niet voor later.'
      },
      {
        prompt: 'Waarom heeft een computer koeling nodig?',
        leerdoel: LD_2_1[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Om bestanden sneller op te slaan dan anders.', correct: false, misconception: 'Denkt dat koeling met opslag te maken heeft.' },
          { text: 'Om te voorkomen dat de computer oververhit raakt.', correct: true, explanation: 'Rekenen kost stroom en stroom wordt warmte.' },
          { text: 'Om geluid te kunnen afspelen via je koptelefoon of speakers.', correct: false, misconception: 'Verwart de ventilator met de geluidskaart.' }
        ],
        feedback: 'Mooi. Zonder koeling wordt je laptop te heet en gaat hij traag.'
      },
      {
        prompt: 'De koeling hoort bij de belangrijke onderdelen van een computer.',
        waar: true,
        leerdoel: LD_2_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. De koeling is een van de zeven onderdelen die je moet kennen.'
      },
      {
        prompt: 'Waarom is het niet goed om je laptop altijd in de oplader te houden?',
        leerdoel: LD_2_1[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een apparaat dat wordt opgeladen werkt daardoor een stuk minder snel.', correct: false, misconception: 'Denkt dat opladen de snelheid van je laptop verlaagt.' },
          { text: 'De batterij raakt dan juist sneller leeg.', correct: false, misconception: 'Denkt dat opladen de batterij leegtrekt.' },
          { text: 'Een apparaat dat constant oplaadt kan te heet worden.', correct: true, explanation: 'In het ergste geval vliegt zo\'n hete accu zelfs in brand.' }
        ],
        feedback: 'Goed bezig. Haal de stekker er dus geregeld even uit.'
      },
      {
        prompt: 'Een vaste computer heeft een batterij en kun je overal mee naartoe nemen.',
        waar: false,
        leerdoel: LD_2_1[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Juist de laptop heeft een batterij en gaat overal mee.'
      },
      {
        prompt: 'Hoe heet het onderdeel dat zorgt voor beeld op je scherm?',
        leerdoel: LD_2_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De videokaart, ook wel grafische kaart.', correct: true, explanation: 'Zonder videokaart blijft je scherm zwart.' },
          { text: 'De geluidskaart, want die stuurt alles naar buiten toe.', correct: false, misconception: 'Haalt beeld en geluid door elkaar.' },
          { text: 'Het moederbord.', correct: false, misconception: 'Denkt dat het moederbord zelf het beeld maakt; daar zit alles alleen op vast.' },
          { text: 'Het werkgeheugen, want dat onthoudt wat je nu ziet.', correct: false, misconception: 'Verwart onthouden met beeld maken.' }
        ],
        feedback: 'Precies. Zie je iets op je scherm? Dank dan de videokaart.'
      },
      {
        prompt: 'Noem twee verschillen tussen een laptop en een vaste computer.',
        type: 'open',
        leerdoel: LD_2_1[2],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Een laptop heeft een batterij en een oplader. Daarom kun je hem meenemen. Een vaste computer heeft geen batterij en staat op één plek. In een laptop zitten kleinere onderdelen. Daardoor is hij vaak minder krachtig dan een vaste computer.',
        nakijkpunten: [
          'Je noemt twee echte verschillen, niet twee keer hetzelfde.',
          'Je noemt de batterij of het meenemen.',
          'Je zegt iets over de grootte of over de kracht.'
        ],
        feedback: 'Netjes uitgelegd. Je noemt wat je ziet en wat je merkt.'
      }
    ]
  },

  '2.2': {
    learningGoals: LD_2_2,
    theorie: [
      {
        keyTerms: ['bureaublad', 'taakbalk', 'startmenu', 'besturingssysteem'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Noa moet Word openen. Ze ziet het icoontje nergens op haar scherm staan. Wat doet ze?</p>',
          '<p><strong>Antwoord.</strong> Noa kijkt eerst naar de taakbalk. Die staat onderaan haar scherm. Links ziet ze vier blauwe vierkantjes staan. Daar klikt ze op. Het startmenu gaat open. Daarin staan al haar programma\'s. Ze typt "Word" en klikt het aan. Word start op. Zo hoeft er niets op haar bureaublad te staan.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['Microsoft Office', 'updaten', 'stuurprogramma'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> De laptop van Ravi vraagt al drie weken om een update. Hij klikt steeds op "later". Nu doet zijn koptelefoon het niet meer. Wat kan er aan de hand zijn?</p>',
          '<p><strong>Antwoord.</strong> Bij een update wordt ook een stuurprogramma vernieuwd. Zo\'n programma stuurt één onderdeel aan, bijvoorbeeld zijn geluidskaart. Blijft die oud, dan kan het geluid uitvallen. Ravi moet dus updaten. Er gaan dan fouten uit en er komen nieuwe dingen bij. Nog een reden: oude software is een gat voor virussen.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Hardware kun je vasthouden, software niet. Windows is het besturingssysteem dat je hele computer aanstuurt. Word, Excel en PowerPoint horen bij Microsoft Office. Updaten haalt fouten eruit en voegt nieuwe dingen toe. Op school gelden vier regels. Laat je laptop nooit alleen staan. Houd je wachtwoord voor jezelf. Download alleen van veilige sites. Vraag bij problemen hulp aan je mentor.</p>',
      keyTerms: ['hardware', 'software']
    },
    vragen: [
      {
        prompt: 'Software kun je niet vasthouden, hardware wel.',
        waar: true,
        leerdoel: LD_2_2[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Goed zo. Dit ene trucje werkt bij elke vraag over dit verschil.'
      },
      {
        prompt: 'In welke rij staat alleen software?',
        leerdoel: LD_2_2[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Scherm, toetsenbord en ventilator.', correct: false, misconception: 'Noemt drie dingen die je juist wel kunt vasthouden.' },
          { text: 'Word, moederbord en Windows, want die gebruik je elke dag.', correct: false, misconception: 'Ziet het moederbord aan voor een programma.' },
          { text: 'Videokaart, Excel en koeling, want die horen bij je computer.', correct: false, misconception: 'Mengt onderdelen en programma\'s door elkaar.' },
          { text: 'Windows, Word en Excel: alle drie programma\'s.', correct: true, explanation: 'Dit zijn alle drie programma\'s die je niet kunt vasthouden.' }
        ],
        feedback: 'Sterk gekozen. Alle drie zijn programma\'s en dus software.'
      },
      {
        prompt: 'Welk programma van Microsoft Office gebruik je om een presentatie te maken?',
        leerdoel: LD_2_2[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Word.', correct: false, misconception: 'Verwart een verslag met een presentatie; in Word typ je tekst met kopjes.' },
          { text: 'PowerPoint, want daarin maak je dia\'s voor de klas.', correct: true, explanation: 'Je klikt de dia\'s achter elkaar door terwijl je vertelt.' },
          { text: 'OneDrive, want daarin bewaar je al je schoolbestanden.', correct: false, misconception: 'Denkt dat OneDrive een programma is om iets te maken.' },
          { text: 'Excel, want daarin reken je met getallen in een tabel.', correct: false, misconception: 'Verwart rekenen met presenteren.' }
        ],
        feedback: 'Klopt helemaal. In hoofdstuk 4 ga je hiermee echt aan de slag.'
      },
      {
        prompt: 'Zonder besturingssysteem werken de onderdelen van je computer gewoon door.',
        waar: false,
        leerdoel: LD_2_2[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Goed opgelet. Zonder aansturing doen de onderdelen helemaal niets.'
      },
      {
        prompt: 'Waarop klik je om het startmenu te openen?',
        leerdoel: LD_2_2[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Op de klok rechts onderin je scherm, naast de datum.', correct: false, misconception: 'Denkt dat het systeemvak het startmenu opent.' },
          { text: 'Op een leeg stuk bureaublad, met de rechtermuisknop.', correct: false, misconception: 'Verwart het menu met de rechtermuisknop met het startmenu.' },
          { text: 'Op het blauwe vlaggetje links in de taakbalk.', correct: true, explanation: 'Die vier vierkantjes zijn het Windows-vlaggetje.' }
        ],
        feedback: 'Prima. Probeer het nu meteen even uit op je eigen laptop.'
      },
      {
        prompt: 'Een Chromebook heeft een ander besturingssysteem dan Windows.',
        waar: true,
        leerdoel: LD_2_2[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed gezien. Je herkent dat aan de balk onderin je scherm.'
      },
      {
        prompt: 'Hoe vaak moet je je laptop updaten?',
        leerdoel: LD_2_2[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Regelmatig, dus zodra je device erom vraagt.', correct: true, explanation: 'Dan blijft je device werken en blijven de gaten dicht.' },
          { text: 'Eén keer per jaar.', correct: false, misconception: 'Denkt dat een schoollaptop maar een keer per jaar bijgewerkt hoeft.' },
          { text: 'Alleen als je laptop helemaal niet meer wil opstarten.', correct: false, misconception: 'Wacht met updaten tot er al iets stuk is.' }
        ],
        feedback: 'Precies. Wachten tot het misgaat is te laat.'
      },
      {
        prompt: 'Bij een update worden alleen nieuwe functies toegevoegd, verder niets.',
        waar: false,
        leerdoel: LD_2_2[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Er gaan ook fouten uit het systeem, en dat is het belangrijkst.'
      },
      {
        prompt: 'Kan het kwaad om je laptop onbeheerd achter te laten? Waarom wel of niet?',
        type: 'open',
        leerdoel: LD_2_2[2],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ja, dat kan kwaad. Je bent nog ingelogd op jouw account. Iemand anders kan dan bij je mail en je bestanden. Diegene kan iets versturen op jouw naam. Daarom is regel 1 op school: laat je computer nooit onbeheerd achter.',
        nakijkpunten: [
          'Je antwoord is duidelijk ja. Je geeft er een reden bij.',
          'Je noemt een echt gevaar. Bijvoorbeeld: iemand werkt op jouw account.',
          'Je legt de link met de gebruiksregels van school.'
        ],
        feedback: 'Goed uitgelegd. Je noemt niet alleen de regel maar ook het gevaar.'
      },
      {
        prompt: 'Rare programma\'s downloaden van een onbekende site is geen probleem.',
        waar: false,
        leerdoel: LD_2_2[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Regel 3 zegt: gebruik alleen veilige sites om te downloaden.'
      },
      {
        prompt: 'Je mag zelf diep in de instellingen van je schoollaptop rommelen.',
        waar: false,
        leerdoel: LD_2_2[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Scherp. Je kunt zo schade doen. Laat dat aan de ICT-afdeling over.'
      },
      {
        prompt: 'Terugblik op 2.1. Een vaste computer heeft binnenin meer ruimte dan een laptop.',
        waar: true,
        leerdoel: LD_2_1[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'reflecteren',
        feedback: 'Goed onthouden. Daar passen grotere onderdelen in, en die zijn krachtiger.'
      },
      {
        prompt: 'Terugblik op 2.1. Welk onderdeel onthoudt tijdelijk waar je nu mee bezig bent?',
        leerdoel: LD_2_1[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Het opslaggeheugen.', correct: false, misconception: 'Verwart tijdelijk onthouden met bewaren; in de opslag blijft alles staan.' },
          { text: 'Het werkgeheugen, samen met de processor.', correct: true, explanation: 'Die twee werken samen aan wat je op dit moment doet.' },
          { text: 'De koeling, want die houdt je laptop koel genoeg.', correct: false, misconception: 'Denkt dat koeling met geheugen te maken heeft.' },
          { text: 'De geluidskaart, want die stuurt geluid naar je oren.', correct: false, misconception: 'Kiest een onderdeel dat niets met geheugen doet.' }
        ],
        feedback: 'Mooi onthouden uit de vorige paragraaf. Dat scheelt straks bij de toets.'
      }
    ]
  },

  '2.3': {
    learningGoals: LD_2_3,
    theorie: [
      {
        keyTerms: ['Verkenner', 'Knippen', 'Kopiëren', 'Plakken'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Yara heeft haar poster twee keer op haar bureaublad staan. Ze weet niet meer welke de goede is. Hoe voorkom je dat?</p>',
          '<p><strong>Antwoord.</strong> Yara had Kopiëren gebruikt. Dan blijft het origineel gewoon staan. Er komt dus een tweede bestand bij. Wil je iets verplaatsen? Gebruik dan Knippen. Het bestand gaat dan weg van zijn oude plek. Daarna zet je het met Plakken in de goede map neer. Zo houd je één versie over.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['cloud', 'OneDrive', 'sneltoetsen'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sem maakt zijn verslag af op de laptop van lokaal 12. Hij slaat het op het bureaublad op. Thuis kan hij er niet bij. Wat ging er mis?</p>',
          '<p><strong>Antwoord.</strong> Het bestand staat in dat ene apparaat. Het reist dus niet met Sem mee. In de cloud was dat anders gegaan. OneDrive hoort namelijk bij zijn account. Logt hij thuis in, dan staat zijn verslag er gewoon. Tip voor volgende keer: sla meteen op met Ctrl+S. Sneltoetsen zoals die schelen je elke les tijd.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Met Verkenner maak je mappen en vind je je bestanden terug. Wat je van internet haalt, staat in de map Downloads. Knippen haalt een bestand weg, kopiëren laat het origineel staan. In de cloud horen je bestanden bij jouw account. Je opent ze dus overal. Ctrl+C kopieert, Ctrl+V plakt en Ctrl+Z maakt je laatste stap ongedaan.</p>',
      keyTerms: ['mappen', 'Downloads']
    },
    vragen: [
      {
        prompt: 'Waarvoor gebruik je Windows Verkenner?',
        leerdoel: LD_2_3[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Om spelletjes te spelen op je laptop in de pauze.', correct: false, misconception: 'Denkt dat Verkenner een spelprogramma is.' },
          { text: 'Om je bestanden en mappen te openen en netjes te ordenen.', correct: true, explanation: 'Verkenner is de kast waarin al je bestanden staan.' },
          { text: 'Om websites te bekijken en dingen op te zoeken.', correct: false, misconception: 'Verwart Verkenner met een browser.' },
          { text: 'Om e-mails te versturen naar je docent of je klas.', correct: false, misconception: 'Verwart Verkenner met Outlook.' }
        ],
        feedback: 'Goed. Zie je het gele mapje in de taakbalk? Dat is Verkenner.'
      },
      {
        prompt: 'Waar vind je bestanden die je van internet hebt gedownload?',
        leerdoel: LD_2_3[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'In de map Documenten.', correct: false, misconception: 'Denkt dat downloads meteen bij je andere documenten komen te staan.' },
          { text: 'Op het Bureaublad, tussen je snelkoppelingen.', correct: false, misconception: 'Denkt dat alles standaard op het bureaublad landt.' },
          { text: 'In de map Downloads van je eigen computer.', correct: true, explanation: 'Daar zet je computer standaard alles neer wat je binnenhaalt.' },
          { text: 'In de map Muziek, samen met je liedjes en podcasts.', correct: false, misconception: 'Kiest een mediamap in plaats van de downloadmap.' }
        ],
        feedback: 'Klopt. Zet het daarna wel meteen in je eigen map, anders raak je het kwijt.'
      },
      {
        prompt: 'Knippen haalt het bestand weg van zijn oude plek.',
        waar: true,
        leerdoel: LD_2_3[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Goed gezien. Daarom gebruik je Knippen als je iets wilt verplaatsen.'
      },
      {
        prompt: 'Een bestand op het bureaublad kun je op elke schoolcomputer openen.',
        waar: false,
        leerdoel: LD_2_3[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Goed opgelet. Dat bestand blijft in die ene laptop achter.'
      },
      {
        prompt: 'Wat is de cloud?',
        leerdoel: LD_2_3[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Opslag op internet, bij jouw account.', correct: true, explanation: 'Je bestanden staan op computers van een bedrijf.' },
          { text: 'Een map die alleen op jouw eigen laptop staat.', correct: false, misconception: 'Denkt dat de cloud gewoon een map op het apparaat is.' },
          { text: 'Een programma waarmee je foto\'s mooier kunt maken.', correct: false, misconception: 'Verwart de cloud met een bewerkingsapp.' }
        ],
        feedback: 'Sterk. Mensen tekenen het als een wolkje omdat je het nooit ziet staan.'
      },
      {
        prompt: 'Met OneDrive open je thuis hetzelfde bestand als op school.',
        waar: true,
        leerdoel: LD_2_3[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Precies. Log je in met je schoolaccount, dan staat je werk er gewoon.'
      },
      {
        prompt: 'Welke sneltoets maakt je laatste stap ongedaan?',
        leerdoel: LD_2_3[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ctrl+C.', correct: false, misconception: 'Verwart kopiëren met terugdraaien; Ctrl+C pakt wat je hebt geselecteerd.' },
          { text: 'Ctrl+V, want daarmee zet je iets op de nieuwe plek neer.', correct: false, misconception: 'Verwart plakken met terugdraaien.' },
          { text: 'Ctrl+Z, de terugknop van je toetsenbord.', correct: true, explanation: 'Daarmee draai je je laatste actie terug zonder over te typen.' }
        ],
        feedback: 'Goed onthouden. Ctrl+Z is je terugknop bij elke fout.'
      },
      {
        prompt: 'Met Ctrl+C plak je iets op een nieuwe plek.',
        waar: false,
        leerdoel: LD_2_3[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Ctrl+C kopieert; plakken doe je met Ctrl+V.'
      },
      {
        prompt: 'Bij een sneltoets druk je twee toetsen tegelijk in.',
        waar: true,
        leerdoel: LD_2_3[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Houd Ctrl ingedrukt en tik dan pas de letter aan.'
      },
      {
        prompt: 'Terugblik op 2.1. De processor bewaart al jouw bestanden.',
        waar: false,
        leerdoel: LD_2_1[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'reflecteren',
        feedback: 'Scherp teruggehaald. Bewaren doet de opslag. De processor rekent.'
      },
      {
        prompt: 'Terugblik op 2.2. Noem twee dingen van je laptop die hardware zijn en twee die software zijn. Hoe weet je dat?',
        type: 'open',
        leerdoel: LD_2_2[0],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'reflecteren',
        modelAnswer: 'Hardware zijn bijvoorbeeld het scherm en de ventilator. Die kan ik vasthouden. Software zijn bijvoorbeeld Windows en Word. Dat zijn programma\'s, die kan ik niet vastpakken. Zo weet ik het altijd: kun je het vasthouden, dan is het hardware.',
        nakijkpunten: [
          'Je geeft twee voorbeelden van hardware en twee van software.',
          'Je noemt de test: kun je het vasthouden?',
          'Al je voorbeelden staan in de goede groep.'
        ],
        feedback: 'Goed teruggehaald. Je gebruikt de test uit de vorige paragraaf.'
      }
    ]
  },

  '2.5': {
    learningGoals: LD_2_5,
    theorie: [
      {
        keyTerms: ['virus', 'ventilator'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Bij Lars start zijn laptop heel traag op en er verschijnen rare vensters. Bij Iris ratelt de ventilator en wordt de laptop gloeiend heet. Wie heeft een probleem met software?</p>',
          '<p><strong>Antwoord.</strong> Lars heeft waarschijnlijk een virus. Een virus is een programma en dus software. Dat los je op met een update of een virusscanner. Bij Iris gaat het om hardware. Haar ventilator zit vol stof of is stuk. Die moet schoongemaakt of vervangen worden. Je ziet het meteen: de soort bepaalt het gereedschap.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['bewijs', 'schermafbeelding'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Fenna levert vier bestanden in. Ze heten allemaal document, met een nummer erachter. Haar docent stuurt ze terug. Waarom?</p>',
          '<p><strong>Antwoord.</strong> Aan die namen ziet niemand wat het is. Je docent moet dan alles openen. Bewijs moet zichzelf uitleggen. Fenna geeft ze nieuwe namen met Naam wijzigen. Bijvoorbeeld h2-onderdelenkaart-fenna-1b. Van haar mappen maakt ze een schermafbeelding. Nu ziet haar docent in één blik wat er af is.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Je kent nu de zeven onderdelen van je device. Je weet ook wat ze doen. Je weet dat het besturingssysteem alles aanstuurt en waarom je moet updaten. Je houdt hardware en software uit elkaar. Vasthouden kan alleen bij hardware. En je bestanden staan in OneDrive, in een map per hoofdstuk. Elke naam legt zichzelf uit.</p>',
      keyTerms: ['besturingssysteem', 'OneDrive']
    },
    vragen: [
      {
        prompt: 'Het moederbord, de processor en de geluidskaart zijn alle drie onderdelen van een computer.',
        waar: true,
        leerdoel: LD_2_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goede start van de toets. Deze drie stonden alle drie op foto in 2.1.'
      },
      {
        prompt: 'Welke rij noemt drie onderdelen die echt in een computer zitten?',
        leerdoel: LD_2_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Werkgeheugen, koeling en videokaart.', correct: true, explanation: 'Dit zijn drie van de zeven onderdelen uit 2.1.' },
          { text: 'Bureaublad, taakbalk en startmenu.', correct: false, misconception: 'Noemt onderdelen van je scherm in plaats van van de computer zelf.' },
          { text: 'Word, Excel en PowerPoint, want die staan op elke schoollaptop.', correct: false, misconception: 'Noemt programma\'s in plaats van onderdelen.' },
          { text: 'Downloads, Documenten en Afbeeldingen, want daar staat je werk in.', correct: false, misconception: 'Noemt mappen in plaats van onderdelen.' }
        ],
        feedback: 'Sterk. Onderdelen kun je vastpakken; de rest is iets op je scherm.'
      },
      {
        prompt: 'Wat doet de processor in je device?',
        leerdoel: LD_2_1[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Hij bewaart al je bestanden, ook als je device uit staat.', correct: false, misconception: 'Verwart de processor met het opslaggeheugen.' },
          { text: 'Hij blaast de warmte weg.', correct: false, misconception: 'Verwart de processor met de koeling en de ventilator daarop.' },
          { text: 'Hij voert je taken snel uit en rekent alles door.', correct: true, explanation: 'De processor is het rekenhart van je device.' },
          { text: 'Hij stuurt het beeld door naar het scherm van je laptop.', correct: false, misconception: 'Verwart de processor met de videokaart.' }
        ],
        feedback: 'Goed. De processor is de rekenaar; de rest heeft een eigen taak.'
      },
      {
        prompt: 'Het opslaggeheugen bewaart je bestanden ook nadat je je laptop hebt uitgezet.',
        waar: true,
        leerdoel: LD_2_1[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Dat is precies het verschil met het werkgeheugen.'
      },
      {
        prompt: 'Waarvoor zit er een ventilator in je laptop?',
        leerdoel: LD_2_1[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Om de warmte uit je laptop weg te blazen.', correct: true, explanation: 'Zonder koeling raakt je device oververhit.' },
          { text: 'Om het geluid van je koptelefoon harder te laten klinken.', correct: false, misconception: 'Verwart de ventilator met de geluidskaart.' },
          { text: 'Om je bestanden sneller op te slaan in de opslag.', correct: false, misconception: 'Denkt dat koeling met opslaan te maken heeft.' },
          { text: 'Om je batterij op te laden.', correct: false, misconception: 'Denkt dat de ventilator bij het opladen van de batterij hoort.' }
        ],
        feedback: 'Precies. Hoor je hem hard blazen? Dan werkt je laptop hard.'
      },
      {
        prompt: 'Een laptop is meestal minder krachtig dan een vaste computer.',
        waar: true,
        leerdoel: LD_2_1[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed gezien. In een laptop is minder ruimte voor grote onderdelen.'
      },
      {
        prompt: 'Waaraan zie je meteen dat een apparaat een laptop is en geen vaste computer?',
        leerdoel: LD_2_1[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Aan het merk dat op de voorkant van het apparaat staat.', correct: false, misconception: 'Denkt dat het merk het verschil bepaalt.' },
          { text: 'Aan de batterij en het scherm dat dichtklapt.', correct: true, explanation: 'Daardoor kun je hem overal mee naartoe nemen.' },
          { text: 'Aan het besturingssysteem dat op het apparaat is gezet.', correct: false, misconception: 'Denkt dat Windows alleen op een vaste computer staat.' },
          { text: 'Aan de hoeveelheid opslag die er in het apparaat zit.', correct: false, misconception: 'Denkt dat de opslag het soort apparaat bepaalt.' }
        ],
        feedback: 'Mooi. De batterij is het verschil dat je met je ogen ziet.'
      },
      {
        prompt: 'Welke twee horen bij hardware?',
        leerdoel: LD_2_2[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Windows en Word.', correct: false, misconception: 'Noemt twee programma\'s als hardware, omdat je laptop ze nodig heeft.' },
          { text: 'Een stuurprogramma en een virus, want die zitten in je laptop.', correct: false, misconception: 'Denkt dat alles wat in je laptop zit hardware is.' },
          { text: 'Een ventilator en een moederbord.', correct: true, explanation: 'Die kun je allebei vastpakken.' },
          { text: 'Excel en een browser, want die staan op elke schoollaptop.', correct: false, misconception: 'Noemt twee programma\'s als hardware.' }
        ],
        feedback: 'Goed. Je gebruikt de vasthoudtest, en die werkt altijd.'
      },
      {
        prompt: 'Een stuurprogramma is software.',
        waar: true,
        leerdoel: LD_2_2[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Knap. Dit is de lastigste: het hoort bij een onderdeel maar is zelf code.'
      },
      {
        prompt: 'Jouw laptop doet het niet meer omdat de accu kapot is. Is dat een probleem met hardware of met software?',
        leerdoel: LD_2_5[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Software.', correct: false, misconception: 'Denkt dat alles in een laptop door programma\'s geregeld wordt.' },
          { text: 'Hardware, want de accu is een onderdeel.', correct: true, explanation: 'Een kapot onderdeel moet gemaakt of vervangen worden.' },
          { text: 'Allebei, want een update kan de accu weer opladen.', correct: false, misconception: 'Denkt dat een update kapotte onderdelen repareert.' }
        ],
        feedback: 'Goed geredeneerd. Een onderdeel repareer je niet met een update.'
      },
      {
        prompt: 'Wat doet een besturingssysteem?',
        leerdoel: LD_2_2[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Het bewaart je bestanden.', correct: false, misconception: 'Verwart het besturingssysteem met Verkenner en je eigen mappen.' },
          { text: 'Het maakt presentaties en verslagen voor je schoolwerk.', correct: false, misconception: 'Verwart het besturingssysteem met Office.' },
          { text: 'Het beschermt je laptop tegen virussen van internet.', correct: false, misconception: 'Verwart het besturingssysteem met een virusscanner.' },
          { text: 'Het stuurt je hele computer en alle onderdelen erin aan.', correct: true, explanation: 'Zonder aansturing doen de onderdelen niets.' }
        ],
        feedback: 'Sterk. Het besturingssysteem is de baas over alle onderdelen.'
      },
      {
        prompt: 'Op de meeste schoollaptops staat Windows als besturingssysteem.',
        waar: true,
        leerdoel: LD_2_2[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Je ziet het aan de taakbalk met het blauwe vlaggetje.'
      },
      {
        prompt: 'Wat gebeurt er als je je device bijwerkt?',
        leerdoel: LD_2_2[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Al je bestanden worden gewist.', correct: false, misconception: 'Denkt dat updaten je bestanden verwijdert en je opnieuw begint.' },
          { text: 'Er gaan fouten uit het systeem en er komen nieuwe dingen bij.', correct: true, explanation: 'Ook het stuurprogramma van een onderdeel wordt vernieuwd.' },
          { text: 'Je device wordt sneller doordat er onderdelen bij komen.', correct: false, misconception: 'Denkt dat een update nieuwe hardware oplevert.' },
          { text: 'Je moet daarna een nieuw wachtwoord kiezen voor je account.', correct: false, misconception: 'Verwart updaten met inloggen.' }
        ],
        feedback: 'Goed. Bijwerken is gewoon een ander woord voor updaten.'
      },
      {
        prompt: 'Als je nooit updatet, blijft je device net zo veilig als daarvoor.',
        waar: false,
        leerdoel: LD_2_2[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Een oude fout blijft een open gat voor virussen.'
      },
      {
        prompt: 'Welke vier regels gelden er op school voor jouw device? Noem ze alle vier.',
        type: 'open',
        leerdoel: LD_2_2[2],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Eén: laat je computer nooit onbeheerd achter. Twee: geef je wachtwoord aan niemand, ook niet aan je beste vriend. Drie: downloaden mag, maar je bent er zelf verantwoordelijk voor, dus gebruik veilige sites. Vier: heb je een probleem dat je niet oplost, ga dan direct naar je mentor of de ICT-afdeling.',
        nakijkpunten: [
          'Je noemt alle vier de regels, in je eigen woorden.',
          'Bij regel 3 schrijf je dat jij zelf verantwoordelijk bent.',
          'Bij regel 4 noem je je mentor of de ICT-afdeling.'
        ],
        feedback: 'Netjes. Deze vier regels gebruik je de rest van het schooljaar.'
      },
      {
        prompt: 'Met welke twee knoppen verplaats je een bestand naar een andere map?',
        leerdoel: LD_2_3[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Eerst Knippen en daarna Plakken, in die volgorde.', correct: true, explanation: 'Knippen haalt het bestand van zijn oude plek weg.' },
          { text: 'Eerst Kopiëren en daarna Plakken.', correct: false, misconception: 'Houdt twee versies over zonder dat te merken, want het origineel blijft staan.' },
          { text: 'Eerst Delen en daarna Naam wijzigen, want dan staat het goed.', correct: false, misconception: 'Verwart delen met verplaatsen.' },
          { text: 'Eerst Verwijderen en daarna Nieuw, want dan maak je hem opnieuw.', correct: false, misconception: 'Denkt dat verplaatsen betekent: weggooien en opnieuw maken.' }
        ],
        feedback: 'Precies. Zo houd je maar één versie van je bestand over.'
      },
      {
        prompt: 'In Verkenner maak je een nieuwe map met de knop Delen.',
        waar: false,
        leerdoel: LD_2_3[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Een map maak je met Nieuw. Delen is voor iemand anders.'
      },
      {
        prompt: 'Waarom is OneDrive handig voor je schoolwerk?',
        leerdoel: LD_2_3[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat je bestanden dan sneller openen op je eigen laptop.', correct: false, misconception: 'Denkt dat de cloud vooral snelheid oplevert.' },
          { text: 'Omdat je werk bij je account hoort en overal opengaat.', correct: true, explanation: 'De cloud hoort niet bij één apparaat maar bij jou.' },
          { text: 'Omdat je docent er dan niet meer bij kan zonder te vragen.', correct: false, misconception: 'Denkt dat de cloud vooral over privacy gaat.' },
          { text: 'Omdat je bestanden dan minder ruimte innemen op je laptop.', correct: false, misconception: 'Denkt dat de cloud er is om plek te besparen.' }
        ],
        feedback: 'Sterk. Daarom is een USB-stick kwijtraken geen ramp meer.'
      },
      {
        prompt: 'De cloud is een map die alleen op jouw eigen laptop staat.',
        waar: false,
        leerdoel: LD_2_3[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. De cloud staat op internet, op computers van een bedrijf.'
      },
      {
        prompt: 'Je hebt net een zin geplakt op de verkeerde plek. Welke sneltoets gebruik je?',
        leerdoel: LD_2_3[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ctrl+V, want daarmee zet je de zin op de goede plek terug.', correct: false, misconception: 'Denkt dat nog een keer plakken de fout herstelt.' },
          { text: 'Ctrl+A.', correct: false, misconception: 'Verwart alles selecteren met terugdraaien.' },
          { text: 'Ctrl+Z, want die draait je laatste stap terug.', correct: true, explanation: 'Je hoeft dan niets over te typen of te wissen.' },
          { text: 'Ctrl+S, want daarmee sla je je werk meteen goed op.', correct: false, misconception: 'Denkt dat opslaan de fout ongedaan maakt.' }
        ],
        feedback: 'Goed toegepast. Overtypen hoeft dus nooit meer.'
      },
      {
        prompt: 'De sneltoets Ctrl+V staat voor kopiëren.',
        waar: false,
        leerdoel: LD_2_3[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. De V is plakken. Kopiëren doe je met de C van copy.'
      },
      {
        prompt: 'Een virus op je laptop is een probleem met hardware.',
        waar: false,
        leerdoel: LD_2_5[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed opgelet. Een virus is een programma en dus software.'
      },
      {
        prompt: 'Leg uit hoe jij je schoolwerk opslaat en benoemt, zodat je het op elke computer terugvindt.',
        type: 'open',
        leerdoel: LD_2_5[1],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik sla alles op in OneDrive, want dat is de cloud. Daar hoort mijn werk bij mijn account. Ik heb een map Digitale geletterdheid gemaakt. Daarin staat een map per hoofdstuk. Elk bestand krijgt een naam volgens de afspraak, bijvoorbeeld h2-onderdelenkaart-sam-1c. Zo zie ik meteen waar het over gaat.',
        nakijkpunten: [
          'Je noemt OneDrive of de cloud als plek.',
          'Je beschrijft je mappen: een map per vak, met een map per hoofdstuk.',
          'Je geeft een afspraak voor de bestandsnaam, met een voorbeeld.'
        ],
        feedback: 'Goed beschreven. Terugvinden is bij jou een afspraak en geen geluk.'
      },
      {
        prompt: 'Je docent kan jouw ingeleverde bestand niet nakijken. Wat is de meest waarschijnlijke oorzaak?',
        leerdoel: LD_2_5[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je hebt te veel mappen gemaakt in je eigen OneDrive.', correct: false, misconception: 'Denkt dat ordenen het probleem is.' },
          { text: 'Je bestand heet document(3) en staat op het bureaublad.', correct: true, explanation: 'Dan ziet niemand wat het is, en je docent kan er niet bij.' },
          { text: 'Je hebt de sneltoets Ctrl+S gebruikt om het op te slaan.', correct: false, misconception: 'Denkt dat opslaan met een sneltoets iets kapotmaakt.' },
          { text: 'Je hebt het bestand in Word gemaakt en niet in PowerPoint.', correct: false, misconception: 'Denkt dat het programma bepaalt of iets nagekeken kan worden.' }
        ],
        feedback: 'Mooi geredeneerd. Bewijs moet zichzelf uitleggen aan wie het opent.'
      }
    ]
  }
};
