// Verrijkingslaag hoofdstuk 5 - Jouw digitale wereld: normen, waarden en online
// kopen. Theoretische leerweg (tl).
//
// Structuur en lesstof staan in scripts/seed-structuur/tl/h5.mjs.
// Het patroon voor dit bestand staat in scripts/seed-verrijking/PATROON.md.
//
// WAT ER IN RONDE 9 IN DIT BESTAND IS VERANDERD
// ---------------------------------------------
// - De routetabel in de samenvatting van 5.5 had twee foute wegwijzers. De regel
//   over iDEAL, Klarna, creditcard en Apple Pay stuurde naar 5.4 theorieblok A,
//   waar iDEAL destijds niet uitgelegd stond; die regel noemt nu allebei de
//   plekken. De regel over het beoordelen van een webshop hing het uitgewerkte
//   voorbeeld van Yassin aan theorieblok A, terwijl het aan B hangt.
// - Het toetsitem over BeReal hing aan het leerdoel "Je kunt uitleggen wat jouw
//   digitale wereld is" maar mat appjeskennis. Er staat nu een item dat het
//   begrip zelf toetst.
// - Het toetsitem over nike_sport.com is vervangen, want de quiz van 5.3 mat met
//   dezelfde casus al hetzelfde herkenningspunt. Het nieuwe item gaat over
//   www.decathlon.nl.sportdeal-outlet.com/tenten en toetst dus het lezen van de
//   eigenaarsnaam voor de eerste schuine streep.
// - De quiz van 5.2 ging van elf naar tien vragen: de terugblik "gamen op een
//   console hoort niet bij je digitale wereld" mat dezelfde misvatting als twee
//   items in de hoofdstuktoets. Er blijven twee terugblikken staan.
// - "register" (modelantwoord over Klarna, 5.4) en "certificaat" (modelantwoord
//   over het slotje, 5.6) worden nu ter plekke uitgelegd; dat waren de twee
//   vakwoorden die ongegloss in nakijktekst stonden.
// - De samenvattingen lagen met gemiddeld 14,6 woorden per zin onder de theorie,
//   terwijl juist dat blok naslag voor de toets is. De korte zinnen zijn
//   uitgeschreven; het gemiddelde staat nu op 17,8.
//
// WAT DIT BESTAND VOLGENS DE BLAUWDRUK DOET
// -----------------------------------------
// - Elk leerdoel heeft zijn eigen startvraag. Die staan als `checks` in het
//   structuurbestand, een check per leerdoel, sinds ronde 3 als object met
//   { vraag, antwoord, uitleg, leerdoel }. De generator zet dat blok direct
//   achter het slidedeck en dus VOOR de theorie, klapt de uitleg dicht tot de
//   leerling hem zelf opent, en zet de Digidocent op dat blok uit. Wat hier in
//   dit bestand gebeurt: elk theorieblok van h5 opent met een ophaalregel, zodat
//   er ook binnen de uitleg eerst iets teruggehaald wordt voordat er iets
//   uitgelegd wordt.
// - De oefenlaag (stap 4, 5 en 6) staat ook in het structuurbestand, als
//   `opties.oefenen`: zes opgaven per paragraaf, verdeeld over samen, zelf,
//   steun en plus. De vragen hieronder zijn de AFSLUITvragen; ze komen dus na
//   die oefenronde en mogen daarom een stap moeilijker zijn.
// - Elk theorieblok krijgt een uitgewerkt voorbeeld (vraag plus volledige
//   uitwerking), zodat er iets is voorgedaan voordat de leerling zelf oefent.
//   Twaalf van de twaalf theorieblokken hebben er een.
// - Elke afsluitquiz heeft ACHT vragen: ZES over de eigen paragraaf en TWEE
//   (uitzondering: 5.2 heeft er ELF, want die quiz is tegelijk de deeltoets over
//   5.1 en 5.2; zie hieronder)
//   terugkeervragen uit een eerdere paragraaf of een eerder hoofdstuk. Die twee
//   dragen het leerdoel van die eerdere paragraaf letterlijk mee, zodat de
//   toetsmatrijs de spreiding ook echt laat zien. Dat is de spreiding op
//   paragraafniveau die de blauwdruk vraagt, en het is dezelfde vorm als in h1,
//   h2, h3 en h6. In ronde 3 stond die claim wel in deze kop, maar hingen alle
//   zes vragen van elke quiz aan een leerdoel van de paragraaf zelf; er was dus
//   geen enkele echte terugkeervraag. Ronde 4 heeft er tien toegevoegd:
//     5.1 <- 4.3 (beeld dat je mag gebruiken) en 3.3 (wat je niet online zet)
//     5.2 <- 5.1 (waarde onder een norm) en 3.2 (phishing herkennen)
//     5.3 <- 3.1 (risico's van internetgebruik) en 5.2 (gegevens privé houden)
//     5.4 <- 5.3 (de vijf checks) en 1.2 (je code geef je nooit weg)
//     5.6 <- 5.4 (invoerrechten en btw) en 5.3 (het slotje)
//   Het checkpoint 5.5 bevraagt het hele hoofdstuk en is daarmee zelf al de
//   spreiding op hoofdstukniveau.
// - De vijf afsluitquizzen hebben elk een andere volgorde van vraagtypes, zodat
//   een leerling het patroon niet leert in plaats van de stof.
// - De rol samen_oefenen (stap 4: de brug tussen voordoen en zelf doen, met de
//   Digidocent aan) wordt in elke quiz gebruikt. In de hoofdstuktoets niet: daar
//   staat de Digidocent uit.
//
// DE DEELTOETS IN DE QUIZ VAN 5.2
// ------------------------------
// De blauwdruk zet een deeltoets na paragraaf 1 t/m 3. Dit hoofdstuk heeft vier
// inhoudsparagrafen, dus die deeltoets valt samen met de afsluitquiz van 5.2 en
// dekt 5.1 en 5.2. Elf vragen: twee per leerdoel van 5.2, een per leerdoel van
// 5.1, en een terugkeervraag naar 3.2 (phishing).
// Tot en met ronde 6 stond die deeltoets als zes zelfnakijk-velden in het
// oefenblok van 5.2, met een instructieveld ervoor en een herstel- en een
// verdiepingsspoor erachter. Dat werkte niet: alleen `vragen` in dit bestand
// wordt in de app geregistreerd, dus er viel niets te routeren en de docent zag
// per leerdoel niets. Bovendien verscheen dat instructieveld bij de leerling als
// genummerde opgave met een leeg antwoordvak. Die negen velden zijn in ronde 7
// uit het structuurbestand verdwenen; het oefenblok van 5.2 telt weer zes
// opgaven, net als de andere vijf paragrafen.
//
// DE HOOFDSTUKTOETS IN 5.5
// ------------------------
// ACHTENTWINTIG vragen: elk van de veertien leerdoelen die de toets mag bevragen
// precies twee keer (5.1 t/m 5.5; die van de vrijwillige plusparagraaf 5.6
// nooit).
// De blauwdruk vraagt twee dingen die niet allebei kunnen: 15 tot 20 vragen EN
// elk doel minstens twee keer. Tot ronde 6 is gekozen voor de bovenkant van de
// band, twintig vragen, waarvan acht doelen maar een keer bevraagd werden. Daar
// stond dan een aparte "diagnostische ronde" van veertien zelfnakijk-vragen
// naast, in het oefenblok van 5.5. De leerling maakte daarmee feitelijk twee
// keer dezelfde diagnose, waarvan een keer zonder registratie, en het blok Zelf
// oefenen telde zeventien velden tegenover twee bij Samen oefenen.
// In ronde 7 is die diagnostische ronde de toets zelf geworden. De keuze is nu:
// liever achtentwintig geregistreerde vragen die elk doel twee keer meten dan
// twintig vragen plus veertien velden die niets meten. De band van 15 tot 20
// wordt daarmee bewust overschreden; de reden staat hier.
// Zeven van de achtentwintig zijn open vragen en eenentwintig gesloten, waarvan
// vijf waar-niet-waar en zestien meerkeuze. Het goede antwoord staat bij die
// zestien drie keer op plek 1, zes keer op plek 2, vier keer op plek 3 en drie
// keer op plek 4.
//
// DE UITGEWERKTE VOORBEELDEN
// --------------------------
// Alle twaalf zijn in ronde 7 herschreven naar de tl-band. Ze lagen op 13,10
// woorden per zin, onder de band van 15 tot 20 en onder de theorie eromheen
// (16,13). Gemeten na de herschrijving: 17,23 woorden per zin over 107 zinnen,
// met per blok een gemiddelde tussen 16,6 en 18,8 en geen enkele zin onder de
// dertien woorden. Juist in het blok waar de redenering wordt voorgedaan hoort
// het ritme niet naar een lagere leerweg te zakken.
//
// WAT ER IN RONDE 8 IS HERSTELD
// -----------------------------
// 1. De samenvatting van 5.5 routeert nu per leerdoel.
//    De blauwdruk zet vóór de herhaling een diagnose die per gemist doel gericht
//    herhaalmateriaal opent. Ronde 7 haalde de veertien zelfnakijk-diagnosevragen
//    uit het oefenblok, met een goede reden (een zelfnakijk-veld levert geen
//    meetpunt op), maar er kwam niets terug dat routeert: wie op leerdoel 9 zakte
//    kreeg niets gerichts. De samenvatting van 5.5 staat vóór de toets en is
//    naslag, geen genummerde opgave met een leeg antwoordvak. Daar staat nu per
//    leerdoel bij welke paragraaf en welk theorieblok je terugleest. Elke
//    toetsvraag draagt zijn leerdoel al mee, dus de leerling kan zelf van een
//    gemiste vraag naar het juiste stuk stof lopen.
//
// 2. De toetsvraag over het slotje is een toepassing geworden.
//    "Wat betekent het slotje voor het webadres wel, en wat betekent het niet?"
//    was in de hoofdstuktoets bijna dezelfde vraag als "Wat bewijst het slotje
//    voor het webadres van een webshop?" in de quiz van 5.3. De validator liet ze
//    door (onder de 85 procent woordoverlap), maar als tweede meetmoment was het
//    een herhaling van dezelfde definitie. De toetsvraag zet het slotje nu in een
//    situatie: een onbekende winkel met wel een slotje, maar zonder adres en met
//    reviews die alleen op de eigen site staan. Daarmee meet hij ook meteen de
//    weging uit punt 2 van de structuurkop.
//
// 3. Twee vragen hadden alleen onschuldige afleiders.
//    Bij "welke twee gegevens samen maken het voor een vreemde het makkelijkst om
//    uit te rekenen waar jij nu bent" (quiz 5.2) en "welke combinatie van gegevens
//    hoor je zeker niet openbaar te delen" (toets 5.5) waren alle drie de foute
//    opties duidelijk ongevaarlijk: lievelingsserie, favoriete kleur, emoji,
//    aantal volgers. Wie de vraag niet snapte kon hem toch goed raden. Elk van de
//    twee heeft er nu één plausibele afleider bij: woonplaats plus achternaam, en
//    woonplaats plus leeftijd. Allebei echt persoonlijk, allebei fout om een
//    reden die met de vraag te maken heeft.
//
// 4. Twee stukken leerlingtaal in 5.6.
//    "Civiele route" stond onuitgelegd in een misconception bij de quiz van 5.6.
//    PATROON.md noemt misconception een docentveld, maar src/lib/
//    answerExplanationFeedback.js geeft die zin ná het beoordelen terug aan de
//    leerling; elk ander vakwoord in dit hoofdstuk wordt wél ter plekke uitgelegd.
//    Er staat nu in gewone woorden dat niet-leveren een conflict over een afspraak
//    is dat je eerst met de verkoper zelf oplost. En de samenvatting van 5.6 had
//    een zin van 28 woorden met een puntkomma erin, de langste van het hoofdstuk,
//    juist in het blok dat naslag vóór de toets hoort te zijn. Die zin is nu twee
//    zinnen van 14 en 15 woorden, met "opschorten" vervangen door "wachten".

export default {
  '5.1': {
    learningGoals: [
      'Je kunt uitleggen wat jouw digitale wereld is.',
      'Je weet wat normen en waarden zijn en hoe ze online gelden.',
      'Je kunt drie gedragsregels noemen die online belangrijk zijn.'
    ],
    theorie: [
      {
        keyTerms: ['digitale wereld', 'social media', 'BeReal', 'Discord'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sem zegt dat zijn digitale wereld alleen Discord is, omdat hij daar veruit de meeste tijd doorbrengt. Klopt die omschrijving, en hoe zou jij zijn digitale wereld zelf beter beschrijven?</p>',
          '<p><strong>Antwoord.</strong> Zijn omschrijving klopt maar half, want Discord is de grootste plek in zijn digitale wereld en niet de hele wereld. Alles wat Sem via een scherm doet en wat met internet te maken heeft telt namelijk mee. Dus ook gamen op zijn console, filmpjes kijken op YouTube en huiswerk opzoeken op zijn schoollaptop. Appen in de klassengroep hoort er net zo goed bij, ook al voelt dat voor hem niet als internet. Een goede beschrijving noemt daarom meerdere plekken en meerdere apparaten, en niet alleen de app van de meeste uren. Zeg er per plek bij wat je daar doet en hoeveel tijd dat ongeveer per dag kost. Pas dan zie je zelf op welke van die plekken jouw eigen risico waarschijnlijk het grootst is.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['waarden', 'normen', 'gedragsregels', 'toestemming'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Stel dat jij privacy een belangrijke waarde vindt in jullie klassengroep op WhatsApp. Welke twee normen volgen daar logisch uit, en waarom passen juist die twee bij die waarde?</p>',
          '<p><strong>Antwoord.</strong> Norm 1 is dat ik geen screenshots van privégesprekken in de groep zet, ook niet als grap. Norm 2 is dat ik toestemming vraag voordat ik een foto van een klasgenoot in de groep deel. Allebei de normen beschermen precies hetzelfde: dat iemand zelf kiest wie wat van hem te zien krijgt. Zo zie je de opbouw van dit onderwerp terug in een voorbeeld uit je eigen groep. Eerst staat de waarde, daarna volgt de regel eruit, en pas daarna komt het gedrag dat je ziet. Wie de waarde kent, kan zelf een nieuwe regel bedenken voor een situatie die nog in geen lijstje staat.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Jouw digitale wereld is alles wat je via een scherm doet en wat met internet te maken heeft. Dat gaat dus over je telefoon, je laptop, je gameconsole en al je apps samen. Waarden zijn wat jij zelf belangrijk vindt, en normen zijn de gedragsregels die daaruit voortkomen; online gelden ze net zo hard als offline. Onthoud er vier: niet schelden of pesten, toestemming vragen voor een foto, niets delen wat niet van jou is, en nadenken voordat je iets plaatst.</p>',
      keyTerms: ['digitale wereld', 'waarden', 'normen', 'gedragsregels']
    },
    vragen: [
      {
        prompt: 'Nour gamet elke avond op haar console, kijkt TikTok, appt met haar team en zoekt huiswerk op haar laptop op. Wat is haar digitale wereld?',
        leerdoel: 'Je kunt uitleggen wat jouw digitale wereld is.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Alleen het gamen, want daar besteedt ze de meeste tijd aan.', correct: false, misconception: 'Denkt dat je digitale wereld de app of het apparaat is waar je het langst in zit.' },
          { text: 'Alleen wat ze zelf plaatst; kijken en zoeken tellen niet mee.', correct: false, misconception: 'Denkt dat je pas meedoet online als je zelf iets post.' },
          { text: 'Alles wat ze via een scherm doet en wat met internet te maken heeft.', correct: true, explanation: 'Gamen, kijken, appen en opzoeken gaan allemaal via een scherm en via internet, dus horen ze er allemaal bij.' },
          { text: 'Alleen wat ze op haar telefoon doet, niet wat ze op haar laptop of console doet.', correct: false, misconception: 'Koppelt de digitale wereld aan een apparaat in plaats van aan het internet.' }
        ],
        feedback: 'Je digitale wereld zit niet in een app en niet in een apparaat: telefoon, laptop en gameconsole horen er alle drie bij.'
      },
      {
        prompt: 'Noem drie gedragsregels die online belangrijk zijn en leg bij elke regel uit welk probleem hij voorkomt.',
        type: 'open',
        leerdoel: 'Je kunt drie gedragsregels noemen die online belangrijk zijn.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        modelAnswer: 'Ik scheld en pest niemand: dat voorkomt dat iemand zich onveilig gaat voelen in een groep waar hij niet uit kan. Ik vraag toestemming voordat ik iemand op een foto zet: dat voorkomt dat een ander ongewild rondgaat op plekken die hij niet kent. Ik deel geen foto\'s, kunst of muziek van anderen: dat voorkomt dat ik iemands werk gebruik zonder dat hij daar iets over te zeggen heeft. Een vierde regel is nadenken voordat je iets plaatst; dat voorkomt spijt, want online blijft staan wat je verstuurt.',
        nakijkpunten: [
          'Noemt drie regels die echt uit de paragraaf komen, niet drie keer dezelfde regel anders gezegd.',
          'Zet bij elke regel een probleem dat die regel voorkomt, niet alleen de regel zelf.',
          'Schrijft in hele zinnen en in eigen woorden.'
        ],
        feedback: 'Een regel opnoemen is de helft; erbij zeggen welk probleem hij voorkomt laat zien dat je snapt waarom hij bestaat.'
      },
      {
        prompt: 'Een norm komt voort uit een waarde die je belangrijk vindt.',
        waar: true,
        leerdoel: 'Je weet wat normen en waarden zijn en hoe ze online gelden.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Precies die volgorde maakt het verschil: de waarde is wat je belangrijk vindt, de norm is de regel die daaruit volgt.'
      },
      {
        prompt: 'Bij welke waarde hoort de norm: je vraagt toestemming voordat je iemand op een foto zet?',
        leerdoel: 'Je weet wat normen en waarden zijn en hoe ze online gelden.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Respect voor de ander.', correct: true, explanation: 'Toestemming vragen betekent dat je de ander laat kiezen; dat is respect in de praktijk.' },
          { text: 'Vrijheid, want iedereen mag online plaatsen wat hij wil.', correct: false, misconception: 'Verwart vrijheid met vrijblijvendheid, alsof jouw vrijheid boven die van de ander gaat.' },
          { text: 'Eerlijkheid, want de foto laat zien hoe iemand er echt uitziet.', correct: false, misconception: 'Denkt dat een echte foto vanzelf een eerlijke daad is.' },
          { text: 'Zuinigheid, want zo bespaar je opslagruimte op je telefoon.', correct: false, misconception: 'Zoekt een technische reden achter een regel die over omgang gaat.' }
        ],
        feedback: 'Toestemming vragen is de norm; respect is de waarde eronder. Wie de waarde kent, bedenkt zelf de goede regel bij een nieuwe situatie.'
      },
      {
        prompt: 'Je maakt een titeldia over jouw eigen digitale wereld. Beschrijf die wereld in vijf zinnen: welke apparaten, welke plekken en wat je daar doet. Leg er daarna bij uit hoe je zeker weet dat het plaatje dat je kiest ook echt mag.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen wat jouw digitale wereld is.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Mijn digitale wereld gaat verder dan mijn telefoon. Op mijn telefoon scroll ik TikTok en app ik in de klassengroep, ongeveer twee uur per dag. Op mijn PlayStation game ik met vrienden, meestal een uur op een doordeweekse avond. Op mijn schoollaptop zoek ik dingen op voor huiswerk en werk ik in Office 365. Op de tv van mijn ouders kijk ik YouTube, en dat telt ook mee, want het gaat via internet. Voor mijn plaatje zoek ik in Google, klik ik op images, dan op tools en dan op usage rights, en daar kies ik Creative Commons. Dat is een licentie: de maker heeft vooraf toestemming gegeven, dus ik gebruik geen werk van iemand anders zonder te vragen.',
        nakijkpunten: [
          'Noemt minstens drie verschillende plekken of apparaten, met per plek wat de leerling daar doet.',
          'Laat zien dat de digitale wereld alles omvat wat via een scherm en via internet gaat.',
          'Beschrijft hoe je aan beeld komt dat je mag gebruiken en waarom dat nodig is.'
        ],
        feedback: 'Wie zijn digitale wereld beschrijft, ziet ook waar zijn eigen risico het grootst zit. En het plaatje erbij hoort net zo goed van iemand te mogen zijn.'
      },
      {
        prompt: 'Een opmerking in de klas is de volgende dag vergeten. Leg uit waarom de regel denk na voordat je iets plaatst online veel zwaarder weegt, en gebruik daarbij wat je eerder over je digitale voetafdruk leerde.',
        type: 'open',
        leerdoel: 'Je kunt drie gedragsregels noemen die online belangrijk zijn.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        modelAnswer: 'Een opmerking in de klas hoor je een keer en daarna is hij weg. Iets wat je online plaatst blijft staan, kan gekopieerd of gescreenshot worden en komt jaren later weer boven, ook bij mensen die er toen niet bij waren. Daardoor kan een bericht dat je nu grappig vindt later bij een stage of een nieuwe school opduiken. De regel weegt dus zwaarder omdat het gevolg veel langer duurt en veel verder reikt dan je op het moment zelf ziet.',
        nakijkpunten: [
          'Legt het verschil in tijdsduur uit: offline vervliegt, online blijft staan.',
          'Noemt dat kopieren, screenshots of doorsturen het bereik vergroten.',
          'Verbindt dat aan een gevolg voor de leerling zelf, later.'
        ],
        feedback: 'Dit is de brug tussen hoofdstuk 3 en dit hoofdstuk: je digitale voetafdruk maakt van een gedragsregel een regel met een lange staart.'
      }
      ,
      {
        prompt: 'Terugblik op 4.3: je zoekt een plaatje voor je titeldia over jouw digitale wereld. Waarom pak je niet gewoon het eerste beeld dat Google je laat zien?',
        leerdoel: 'Je weet waarom je niet zomaar elke afbeelding van internet mag gebruiken.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'samen_oefenen',
        options: [
          { text: 'Omdat beeld uit Google te klein is voor een dia en daardoor altijd korrelig wordt.', correct: false, misconception: 'Denkt dat het bezwaar over beeldkwaliteit gaat in plaats van over toestemming.' },
          { text: 'Omdat op het meeste beeld auteursrecht van de maker zit.', correct: true, explanation: 'Beeld is werk van iemand; alleen bij een licentie zoals Creative Commons heeft die maker vooraf toestemming gegeven.' },
          { text: 'Omdat het wel mag, zolang je de afbeelding maar niet groter maakt dan het origineel.', correct: false, misconception: 'Denkt dat je met een technische aanpassing onder de regel uit komt.' },
          { text: 'Omdat het wel mag, want voor schoolwerk gelden de regels over beeld nu eenmaal niet.', correct: false, misconception: 'Denkt dat school een uitzondering is op het auteursrecht.' }
        ],
        feedback: 'Dezelfde gedragsregel uit deze paragraaf zit erachter: je deelt niets wat niet van jou is. Creative Commons is precies de plek waar de maker die toestemming al heeft gegeven.'
      },
      {
        prompt: 'Terugblik op 3.3: welk gegeven laat je weg van een dia die je straks aan de hele klas laat zien?',
        leerdoel: 'Je kunt uitleggen welke gegevens je beter niet online deelt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De naam van de app waar jij het vaakst op zit.', correct: false, misconception: 'Denkt dat je smaak net zo gevoelig is als je gegevens.' },
          { text: 'Het aantal uren dat jij ongeveer per dag gamet of scrollt.', correct: false, misconception: 'Verwart iets waar je je voor schaamt met iets dat je onveilig maakt.' },
          { text: 'De achtergrondkleur die jij voor je dia gekozen hebt.', correct: false, misconception: 'Zoekt het antwoord in de opmaak in plaats van in de inhoud.' },
          { text: 'Je woonadres met huisnummer erbij.', correct: true, explanation: 'Een adres vertelt vreemden waar je te vinden bent, en dat is niet terug te draaien zodra het rondgaat.' }
        ],
        feedback: 'Wat je doet online mag je best laten zien; waar je te vinden bent niet. Dat onderscheid is het hele verschil tussen jezelf beschrijven en jezelf blootgeven.'
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
        keyTerms: ['privacy', 'bio', 'locatie', 'werkgever'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Yara zet in haar openbare bio: 14 jaar, Dacapo College, Sittard, appen mag op 06-12345678. Wat is er precies mis met deze bio, en hoe zou een veilige versie ervan eruitzien?</p>',
          '<p><strong>Antwoord.</strong> Drie van de vier gegevens horen niet in een openbare bio: haar school, haar woonplaats en haar telefoonnummer. Samen vertellen die drie precies waar Yara elke schooldag te vinden is, ook aan mensen die zij niet kent. Een veilige bio wordt bijvoorbeeld: 14 - hockey - kattenfan, want dat zegt wel iets over wie ze is. Het zegt tegelijk helemaal niets over waar ze woont, waar ze leert en hoe je haar rechtstreeks bereikt. Let er bovendien op dat haar bio zichtbaar blijft voor iedereen, ook als haar account op privé staat. Juist dat vakje is dus het gevaarlijkste stukje van haar profiel, want de privéknop beschermt het niet.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['rapporteren', 'Rapporteer-knop', 'DM', 'anoniem'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Iemand zet een gênante foto van een klasgenoot in jullie groepsapp, terwijl jij er zelf niet op staat. Wat doe je in die situatie, en waarom is melden hier iets heel anders dan klikken?</p>',
          '<p><strong>Antwoord.</strong> Er zijn drie stappen die je hier naast elkaar kunt zetten, want ze sluiten elkaar niet uit. Eerst zeg je er zelf iets van in de groep: haal die foto weg, dat kan echt niet. Daarna rapporteer of blokkeer je, want de app kan het bericht verwijderen en jij kunt dat zelf niet. Ten slotte vertel je het aan iemand die je vertrouwt, zodat de klasgenoot er niet alleen voor staat. Dit is geen klikken, want klikken betekent iemand verraden om er zelf beter van te worden. Rapporteren is gedrag melden dat tegen de regels van de app ingaat, en dat doe je anoniem. De app beoordeelt daarna zelf of het bericht weg moet, en die beslissing hoef jij dus niet te nemen.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Privacy betekent niet dat je iets te verbergen hebt, maar dat jij zelf kiest wie wat van jou ziet. Houd daarom je volledige naam en adres, je telefoonnummer, je school, je locatie en privéfoto\'s voor jezelf. Een account op privé laat alleen mensen die jij goedkeurt je berichten zien, maar je bio blijft zichtbaar voor iedereen. Zie je een bericht, een reactie of een account dat niet oké is, dan gebruik je de Rapporteer-knop. Je meldt dan anoniem gedrag bij de app, en die beslist zelf wat er daarna mee gebeurt.</p>',
      keyTerms: ['privacy', 'bio', 'Rapporteer-knop']
    },
    vragen: [
      {
        prompt: 'Als je je account op privé zet, is ook je bio niet meer voor vreemden te zien.',
        waar: false,
        leerdoel: 'Je kunt je account op privé zetten en je bio veilig invullen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Je account op privé beschermt je berichten en verhalen. Je bio en je profielfoto blijven meestal gewoon openbaar, dus daar hoort geen adresinformatie in.'
      },
      {
        prompt: 'Welke gegevens kun je het beste helemaal uit je openbare bio laten?',
        leerdoel: 'Je weet welke persoonlijke gegevens je beter privé houdt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De naam van je school en je woonplaats.', correct: true, explanation: 'Samen vertellen die twee waar je elke werkdag bent, en dat is precies wat een vreemde niet hoeft te weten.' },
          { text: 'Je favoriete sport.', correct: false, misconception: 'Denkt dat elk persoonlijk detail even gevaarlijk is, ook als het niets over jouw plek zegt.' },
          { text: 'Een emoji die bij jou past.', correct: false, misconception: 'Zoekt het risico in de vorm van de bio in plaats van in de inhoud.' },
          { text: 'Het jaar waarin je fan werd van je club.', correct: false, misconception: 'Ziet elk jaartal als een gevoelig gegeven, ook als het niet naar jou leidt.' }
        ],
        feedback: 'School plus woonplaats is de gevaarlijkste combinatie in een bio: samen wijzen ze een vreemde de weg naar jou.'
      },
      {
        prompt: 'Leg uit waarom rapporteren iets anders is dan klikken, en wat er gebeurt nadat jij op de Rapporteer-knop hebt gedrukt.',
        type: 'open',
        leerdoel: 'Je weet hoe en waarom je een bericht rapporteert.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Klikken is iemand verraden om er zelf beter van te worden. Rapporteren is gedrag melden dat tegen de regels van de app ingaat, en je meldt het gedrag en niet de persoon. Je doet het anoniem, dus de ander weet niet dat jij het was. Na de melding kijken medewerkers of programmas van de app of het bericht of het account inderdaad tegen de regels ingaat. Zij beslissen daarna wat er gebeurt: het bericht weghalen, het account waarschuwen of het account blokkeren.',
        nakijkpunten: [
          'Noemt het verschil in bedoeling: eigen voordeel tegenover een regel handhaven.',
          'Zegt dat je gedrag meldt en dat het anoniem gaat.',
          'Beschrijft dat de app het beoordeelt en zelf beslist wat er gebeurt.'
        ],
        feedback: 'Het verschil zit in de bedoeling en in wie beslist: bij rapporteren meld jij gedrag en beoordeelt de app het, jij hoeft geen rechter te spelen.'
      },
      {
        prompt: 'Je krijgt een DM van iemand die je niet kent, met de vraag naar welke school je gaat. Wat doe je?',
        leerdoel: 'Je weet hoe en waarom je een bericht rapporteert.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Antwoorden met alleen de plaatsnaam; dat is nog geen schoolnaam.', correct: false, misconception: 'Denkt dat een half antwoord veilig is, terwijl kleine stukjes samen een compleet beeld geven.' },
          { text: 'Vragen wie hij is; als hij zich netjes voorstelt, is het goed.', correct: false, misconception: 'Gaat ervan uit dat iemand die aardig schrijft ook is wie hij zegt te zijn.' },
          { text: 'Niet reageren, het account blokkeren en het bericht rapporteren.', correct: true, explanation: 'Je geeft niets prijs, je stopt het contact, en de app kan het account bekijken en zo nodig aanpakken.' },
          { text: 'Het bericht doorsturen in de klassengroep, dan weet iedereen het.', correct: false, misconception: 'Verwart aandacht vragen in een groep met een melding bij de app die er iets aan kan doen.' }
        ],
        feedback: 'Niet reageren, blokkeren en rapporteren horen bij elkaar: het eerste beschermt jou, het laatste beschermt ook de volgende die dit bericht krijgt.'
      },
      {
        prompt: 'Welke gedragsregel uit 5.1 werkt al voordat er iets misgaat? Noem hem, en leg daarna uit hoe de Rapporteer-knop uit deze paragraaf die regel aanvult.',
        type: 'open',
        leerdoel: 'Je weet hoe en waarom je een bericht rapporteert.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        modelAnswer: 'De gedragsregel werkt vooraf: door toestemming te vragen voorkom je dat er iets online komt waar de ander niet achter staat. De Rapporteer-knop werkt achteraf: als iemand die regel toch breekt, kun jij dat melden en kan de app het bericht weghalen. Je hebt allebei nodig, want de regel houdt alleen mensen tegen die zich aan afspraken willen houden, en de knop is er voor de mensen die dat niet doen. Samen zorgen ze ervoor dat er minder misgaat en dat wat er misgaat opgelost kan worden.',
        nakijkpunten: [
          'Zet de gedragsregel als maatregel vooraf en het rapporteren als maatregel achteraf.',
          'Legt uit waarom een regel alleen niet genoeg is.',
          'Gebruikt beide begrippen uit 5.1 en 5.2 in eigen woorden.'
        ],
        feedback: 'Voorkomen en herstellen zijn twee verschillende taken: de gedragsregel doet het eerste, de meldknop het tweede.'
      },
      {
        prompt: 'Je hebt je privacy-instellingen al omgezet, zoals je in een eerder hoofdstuk leerde. Welke waarschuwing voegt deze paragraaf daar nog aan toe?',
        leerdoel: 'Je kunt je account op privé zetten en je bio veilig invullen.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'zelf_proberen',
        options: [
          { text: 'Dat je instellingen elke maand opnieuw moeten worden gezet, anders vervallen ze.', correct: false, misconception: 'Denkt dat privacy-instellingen vanzelf terugspringen naar openbaar.' },
          { text: 'Dat je account op privé niet genoeg is, omdat je bio en profielfoto openbaar blijven.', correct: true, explanation: 'De instelling beschermt je berichten; de bio staat daarbuiten en moet je zelf leegmaken.' },
          { text: 'Dat je beter helemaal geen account kunt hebben, want privé bestaat niet.', correct: false, misconception: 'Trekt uit een gat in de bescherming de conclusie dat bescherming zinloos is.' },
          { text: 'Dat je alleen nog met je mentor mag chatten via school.', correct: false, misconception: 'Verwart een schoolregel met wat de app zelf technisch doet.' }
        ],
        feedback: 'Hoofdstuk 3 leerde je de knop omzetten; hier leer je wat die knop juist niet afschermt, en dat is precies je bio.'
      }
      ,
      {
        prompt: 'Terugblik op 5.1: de norm dat je geen privégegevens deelt komt voort uit de waarde veiligheid.',
        waar: true,
        leerdoel: 'Je weet wat normen en waarden zijn en hoe ze online gelden.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Zo hangt deze hele paragraaf aan 5.1 vast: je lege bio is niet zomaar een instelling, maar veiligheid die je in een regel hebt gegoten.'
      },
      {
        prompt: 'Terugblik op 3.2: een onbekende stuurt je een DM dat je account morgen gesloten wordt en vraagt om je inloggegevens. Waaraan zie je dat dit phishing is?',
        leerdoel: 'Je kunt aan een bericht of e-mail zien of het phishing kan zijn.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'Aan de haast, de dreiging en de vraag om je inloggegevens.', correct: true, explanation: 'Een echte app zet je nooit onder tijdsdruk en vraagt nooit om je wachtwoord; die combinatie is het patroon van phishing.' },
          { text: 'Aan het feit dat het bericht in een DM staat en niet gewoon in een groepsapp.', correct: false, misconception: 'Denkt dat het kanaal bepaalt of een bericht deugt.' },
          { text: 'Aan de spelfouten, want zonder spelfouten kan een bericht nooit phishing zijn.', correct: false, misconception: 'Gebruikt spelfouten als enige test en trapt daardoor in een nette nepmail.' },
          { text: 'Aan het tijdstip van versturen, want phishing komt altijd midden in de nacht binnen.', correct: false, misconception: 'Zoekt een vast kenmerk in de techniek in plaats van in de inhoud van het bericht.' }
        ],
        feedback: 'Zo\'n DM is meteen ook het moment om te rapporteren. Je herkent hem aan het patroon uit hoofdstuk 3, en je meldt hem met de knop uit deze paragraaf.'
      },
      {
        prompt: 'Welke twee gegevens samen maken het voor een vreemde het makkelijkst om uit te rekenen waar jij nu bent?',
        leerdoel: 'Je weet welke persoonlijke gegevens je beter privé houdt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je voornaam en de serie waar je op dit moment naar aan het kijken bent.', correct: false, misconception: 'Ziet elk persoonlijk detail als even gevoelig, ook als het niets over een plek zegt.' },
          { text: 'Je school en je rooster.', correct: true, explanation: 'School zegt waar je bent en het rooster zegt wanneer; samen leggen die twee je hele week vast.' },
          { text: 'Je woonplaats en je achternaam.', correct: false, misconception: 'Kiest twee gegevens die je inderdaad kunnen identificeren, maar leest de vraag niet scherp: woonplaats en achternaam zeggen wie je bent en waar je woont, niet waar je op dit moment bent.' },
          { text: 'Je leeftijd en de voetbalclub waar je al sinds groep vier fan van bent.', correct: false, misconception: 'Denkt dat leeftijd het gevoelige gegeven is, terwijl leeftijd niemand naar een adres leidt.' }
        ],
        feedback: 'Plaats en tijd zijn de twee stukjes die je nooit tegelijk weggeeft: los zegt elk weinig, samen wijzen ze een vreemde de weg.'
      },
      {
        prompt: 'Terugblik op 5.1: iemand wil een grappige klassenfoto op zijn verhaal zetten. Welke gedragsregel is hier als eerste aan de beurt?',
        leerdoel: 'Je kunt drie gedragsregels noemen die online belangrijk zijn.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je deelt geen muziek, kunst of beeld dat niet van jou is en dus van iemand anders gemaakt is.', correct: false, misconception: 'Past de regel over andermans werk toe, terwijl de foto hier door de plaatser zelf gemaakt is.' },
          { text: 'Je scheldt of pest niemand, ook niet als het als een grapje bedoeld is.', correct: false, misconception: 'Kiest de regel die over de toon gaat, terwijl er hier nog niemand beledigd wordt.' },
          { text: 'Je vraagt toestemming aan iedereen die herkenbaar op de foto staat.', correct: true, explanation: 'De ander bepaalt zelf wie hem te zien krijgt, en die keuze neem jij niet over met een verhaal.' },
          { text: 'Je zet eerst je eigen account op privé, en daarna mag je alles plaatsen wat je wilt.', correct: false, misconception: 'Verwart een privacy-instelling voor jezelf met toestemming van de mensen op de foto.' }
        ],
        feedback: 'Grappig bedoeld is nog geen toestemming. Deze regel werkt vooraf, terwijl de Rapporteer-knop uit deze paragraaf pas achteraf werkt.'
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
        keyTerms: ['online shoppen', 'vervoersbedrijf', 'betaalmethodes', 'versleuteld'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Ravi betaalt met iDEAL bij een webshop die hij niet kent en niet vooraf gecontroleerd heeft. Twee dagen later blijkt die winkel nep te zijn, dus kan hij zijn geld nog terugkrijgen?</p>',
          '<p><strong>Antwoord.</strong> Nee, hij krijgt dat geld niet meer terug, en dat is precies de reden om vooraf te controleren. Bij iDEAL gaat het bedrag meteen van zijn eigen rekening naar de rekening van de verkoper toe. De betaling zelf is wel veilig, want zijn gegevens gaan versleuteld naar de bank en niemand kan meelezen. Veilig betalen betekent hier alleen dat niemand het onderweg onderschept, en dus niet dat de ontvanger deugt. Ravi kan het bedrag niet zelf terughalen, en zijn bank kan dat evenmin voor hem doen. Wie met iDEAL betaalt, koopt daarom alleen bij winkels die hij van tevoren echt heeft gecontroleerd.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['slotje', 'URL', 'nepwinkel', 'reviews'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Een webshop heet www.airpods-sale-nl.com, heeft een slotje, verkoopt oordopjes voor 29 euro in plaats van 179 euro, en heeft alleen een contactformulier. Loop hieronder alle vijf de checks uit de theorie langs en spreek daarna je oordeel uit.</p>',
          '<p><strong>Antwoord.</strong> Check 1, prijs: 29 tegenover 179 euro is geen korting maar een alarm, want niemand verkoopt maandenlang met verlies. Check 2, slotje: het staat er, maar dat bewijst alleen dat je gegevens versleuteld verstuurd worden, niet dat de verkoper eerlijk is. Check 3, naam en URL: -sale in het adres en geen officieel merkadres, dus verdacht. Check 4, website: alleen een contactformulier, geen adres en geen telefoonnummer, terwijl elke webwinkel een adres hoort te hebben. Check 5, reviews: die zoek je op Google en niet op de site zelf. Vier van de vijf checks staan op rood, dus hier bestel je niet.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Pas de vijf checks bij elkaar zeggen iets over de vraag of een webshop wel of niet te vertrouwen is. Vergelijk prijzen, kijk naar het slotje en controleer de naam en de URL. Bekijk daarna de website en de contactgegevens, en lees reviews van andere kopers. Het slotje bewijst alleen dat je gegevens versleuteld verstuurd worden, niet dat de verkoper eerlijk is. Een prijs die veel lager ligt dan overal elders is geen buitenkansje maar een waarschuwing, want ook een nepwinkel kan een slotje regelen.</p>',
      keyTerms: ['contactgegevens', 'nepwinkel', 'reviews']
    },
    vragen: [
      {
        prompt: 'Leg uit waarom een prijs die veel lager is dan bij bekende winkels een waarschuwing is en geen buitenkansje.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen waarom een te lage prijs een waarschuwing is.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        modelAnswer: 'Een echte winkel moet het product inkopen, versturen en er nog iets aan verdienen. Verkoopt iemand structureel veel goedkoper dan bol.com of een merkwinkel, dan klopt die rekensom niet: hij verkoopt met verlies, en dat houdt niemand vol. Meestal betekent het dat het product nep is, dat het nooit verstuurd wordt, of dat de winkel het alleen om je betaalgegevens te doen is. De lage prijs is dus geen kans maar het lokmiddel, en juist daarom is prijs vergelijken check nummer een.',
        nakijkpunten: [
          'Legt uit dat een winkel kosten heeft en dus niet lang met verlies kan verkopen.',
          'Noemt minstens een concreet gevolg: nepproduct, geen levering of gegevensdiefstal.',
          'Benoemt de lage prijs als lokmiddel, niet als toeval.'
        ],
        feedback: 'De rekensom is het bewijs: wie kosten heeft en toch ver onder de markt zit, verdient zijn geld ergens anders mee, en dat ben jij.'
      },
      {
        prompt: 'Wat bewijst het slotje voor het webadres van een webshop?',
        leerdoel: 'Je weet waar je op moet letten in de URL en bij het slotje.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Dat de webshop is gecontroleerd door de overheid.', correct: false, misconception: 'Denkt dat een slotje een keurmerk van een officiële instantie is.' },
          { text: 'Dat jouw gegevens versleuteld verstuurd worden naar deze site.', correct: true, explanation: 'Het slotje gaat over de verbinding, dus over hoe je gegevens onderweg beschermd zijn.' },
          { text: 'Dat je je geld terugkrijgt als het pakket niet aankomt.', correct: false, misconception: 'Verwart een beveiligde verbinding met een garantie op de koop.' },
          { text: 'Dat de verkoper eerlijk is en echt bestaat.', correct: false, misconception: 'Denkt dat een oplichter geen slotje kan regelen.' }
        ],
        feedback: 'Het slotje beschermt de weg, niet de winkel. Een oplichter kan zonder moeite een slotje regelen, dus check altijd de andere vier punten erbij.'
      },
      {
        prompt: 'Een webshop heeft nette prijzen, een slotje en een telefoonnummer, maar geen adres. Je belt drie keer op verschillende dagen en er wordt niet opgenomen. Wat doe je?',
        leerdoel: 'Je kunt vijf checks doen om te zien of een webshop betrouwbaar is.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Toch bestellen; het personeel was waarschijnlijk gewoon druk.', correct: false, misconception: 'Zoekt een onschuldige verklaring voor een signaal dat drie keer terugkwam.' },
          { text: 'Een goedkoop product bestellen om het uit te proberen.', correct: false, misconception: 'Denkt dat een kleine bestelling het risico wegneemt, terwijl je dan alsnog je gegevens en je geld afgeeft.' },
          { text: 'Niet bestellen: een webwinkel hoort altijd een adres en een bereikbare telefoon te hebben.', correct: true, explanation: 'Twee van de vijf checks staan op rood, en juist de check die bewijst dat er echte mensen achter zitten.' },
          { text: 'Alleen bestellen als je met iDEAL kunt betalen, want dat is nu eenmaal de veiligste manier.', correct: false, misconception: 'Verwart een veilige betaalmethode met een veilige verkoper, terwijl iDEAL-geld juist niet terug te halen is.' }
        ],
        feedback: 'Geen adres plus een telefoon die nooit wordt opgenomen: dat zijn twee rode vlaggen op dezelfde check, en dat is genoeg om weg te klikken.'
      },
      {
        prompt: 'De URL www.nike_sport.com hoort bij een betrouwbare webshop van Nike zelf.',
        waar: false,
        leerdoel: 'Je weet waar je op moet letten in de URL en bij het slotje.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Grote merken verkopen alleen via hun eigen adres, hier www.nike.com. Een variant met een streepje of een extra woord erin is een bekende truc van namaaksites.'
      },
      {
        prompt: 'Welke van de vier gedragsregels uit 5.1 heeft dezelfde bouw als de vijf checks uit deze paragraaf? Noem hem en leg uit wat die twee met elkaar te maken hebben.',
        type: 'open',
        leerdoel: 'Je kunt vijf checks doen om te zien of een webshop betrouwbaar is.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Allebei gaan ze over even stoppen voordat je op een knop drukt. Bij plaatsen is de vraag: wil ik dat dit over een jaar nog te vinden is? Bij bestellen is de vraag: bestaat deze winkel echt en kan ik dit bedrag missen? In beide gevallen is de handeling zelf een seconde werk en het gevolg soms jarenlang. De vijf checks zijn eigenlijk hetzelfde nadenken, maar dan uitgeschreven als een lijstje, zodat je niet vergeet waarnaar je moet kijken.',
        nakijkpunten: [
          'Ziet dat het in beide gevallen om nadenken voor een onomkeerbare klik gaat.',
          'Noemt van allebei een concrete vraag die je jezelf stelt.',
          'Legt uit waarom een lijstje helpt bij dat nadenken.'
        ],
        feedback: 'Goed gezien: gedragsregels en webshopchecks zijn twee versies van dezelfde gewoonte, namelijk even stoppen voor de klik die je niet kunt terugdraaien.'
      },
      {
        prompt: 'Bij check 4 bekijk je de website goed. In het bestelformulier van deze webshop moet je je geboortedatum, je telefoonnummer en de naam van je school invullen. Wat zegt dat over deze winkel?',
        leerdoel: 'Je kunt vijf checks doen om te zien of een webshop betrouwbaar is.',
        denkniveau: 'toepassen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        options: [
          { text: 'Dat is heel normaal; elke webshop heeft juist die gegevens nodig om goed te kunnen bezorgen.', correct: false, misconception: 'Denkt dat alles wat een formulier vraagt ook nodig is voor de bestelling.' },
          { text: 'Dat mag alleen als er een slotje voor de URL staat.', correct: false, misconception: 'Denkt dat een beveiligde verbinding ook bepaalt welke gegevens gevraagd mogen worden.' },
          { text: 'Een schoolnaam is nergens voor nodig bij een bestelling; dat is een reden om af te haken.', correct: true, explanation: 'Voor bezorgen zijn naam, adres en e-mail genoeg; wie meer vraagt, verzamelt gegevens voor iets anders.' },
          { text: 'Je vult wat anders in; met een verzonnen school kom je er ook.', correct: false, misconception: 'Lost een signaal over de winkel op met een trucje, in plaats van de winkel te wantrouwen.' }
        ],
        feedback: 'Een formulier dat meer vraagt dan het nodig heeft, is zelf een zesde check: hier komen 5.2 en 5.3 bij elkaar.'
      }
      ,
      {
        prompt: 'Terugblik op 3.1: welk risico van internetgebruik loop je bij een nepwebshop als eerste?',
        leerdoel: "Je kunt drie risico's van internetgebruik noemen.",
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Dat je computer trager wordt van al dat zoeken en vergelijken tussen webshops.', correct: false, misconception: 'Denkt bij risico aan schade aan het apparaat in plaats van aan schade aan jou.' },
          { text: 'Dat je te veel tijd achter een scherm doorbrengt en daar hoofdpijn van krijgt.', correct: false, misconception: 'Noemt een echt risico van internet, maar niet het risico dat hier speelt.' },
          { text: 'Oplichting: je betaalt en je krijgt niets.', correct: true, explanation: 'Een nepwinkel bestaat om je geld aan te nemen zonder te leveren; alle vijf de checks zijn daartegen bedoeld.' },
          { text: 'Dat je per ongeluk een duurdere verzendmethode aanklikt dan je eigenlijk wilde.', correct: false, misconception: 'Denkt aan een vergissing van jezelf in plaats van aan opzet van de verkoper.' }
        ],
        feedback: 'De drie risico\'s uit 3.1 komen hier concreet terug in een winkelwagen. Oplichting is de reden dat je de winkel controleert vóór je betaalt en niet erna.'
      },
      {
        prompt: 'Terugblik op 5.2: een webshop die bij het afrekenen om het wachtwoord van je e-mail vraagt, heeft dat nooit nodig om jouw pakket te bezorgen.',
        waar: true,
        leerdoel: 'Je weet welke persoonlijke gegevens je beter privé houdt.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        feedback: 'Voor bezorgen zijn een naam, een adres en een mailadres genoeg. Alles wat een winkel daarbovenop vraagt, verzamelt hij voor iets anders dan jouw bestelling.'
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
        keyTerms: ['iDEAL', 'Klarna', 'krediet', 'incassobureau'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Milan bestelt een koptelefoon van 80 euro en kiest Klarna, want hij heeft op dit moment geen geld. Wat gaat er in deze situatie waarschijnlijk mis, en welke vraag had hij zichzelf eerst moeten stellen?</p>',
          '<p><strong>Antwoord.</strong> Klarna is bedoeld om te betalen nadat je het product hebt gekregen, niet om iets te kopen dat je niet kunt betalen. Milan krijgt de rekening na ongeveer twee weken, dus op een moment waarop zijn geldprobleem meestal nog niet is opgelost. Betaalt hij dan nog steeds niet, dan volgt een herinnering en daarna een boete, en die 80 euro kan zo 100 euro worden. Betaalt hij nog steeds niet, dan komt er een incassobureau bij, wat opnieuw geld kost. Ook kan zijn naam worden doorgegeven aan banken, waardoor hij jaren later moeilijker geld kan lenen. De vraag is dus niet of je later kunt betalen, maar of je zeker weet dat je dat doet.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['invoerrechten', 'btw', 'douane', 'afhandelingskosten'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je koopt een telefoonhoesje uit China voor 10 euro, en de webshop rekent geen verzendkosten. Wat kost dat hoesje uiteindelijk echt, en op welk moment kom je die extra kosten tegen?</p>',
          '<p><strong>Antwoord.</strong> Je les rekent met 4 euro invoerrechten en 3 euro btw, en komt daarmee op een totaal van 17 euro. Met de regels van nu gaat die berekening anders, en die regels zijn gecontroleerd op douane.nl op 26 augustus 2026. Die datum heet de peildatum, en die hoort erbij omdat de douane haar bedragen regelmatig aanpast. Voor een zending tot en met 150 euro rekent de douane 3 euro invoerrechten per productcategorie in je pakket. Je komt daarmee eerst op 10 euro plus 3 euro invoerrechten, en dat is samen 13 euro. Over dat hele bedrag komt vervolgens 21 procent btw, dus 13 maal 0,21 is 2,73 euro. Je zit dan op 15,73 euro, en daar komen nog de afhandelingskosten van je bezorger bovenop. De uitkomst lijkt op de 17 euro uit de les, maar de opbouw van dat bedrag is compleet anders. Je merkt die kosten bovendien laat, want ze komen pas als het pakket al in Nederland ligt. Kun je die rekening op dat moment niet betalen, dan wordt jouw pakket vernietigd en ben je alles kwijt. Reken je dit later na, kijk dan eerst of de bedragen op douane.nl nog dezelfde zijn. De manier van rekenen verandert namelijk niet, maar de bedragen en de percentages doen dat wel.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Met iDEAL betaal je direct via je bank en met Klarna betaal je achteraf. Met een creditcard leen je krediet van de bank, en met Apple Pay of Google Pay betaal je met je telefoon. Achteraf betalen is verleidelijk maar riskant: te laat betalen geeft boetes, daarna een incassobureau, en je naam kan bij banken bekend worden. Koop je buiten de EU, dan komen er invoerrechten en btw bij, plus de kosten van je bezorger. Die rekening krijg je pas als het pakket al in Nederland ligt, dus ruim nadat jij hebt afgerekend.</p>',
      keyTerms: ['iDEAL', 'krediet', 'invoerrechten', 'btw']
    },
    vragen: [
      {
        prompt: 'Welke betaalmethode leent je geld van de bank en kan alleen worden aangevraagd door iemand met een maandelijks inkomen?',
        leerdoel: 'Je weet wat iDEAL, Klarna, een creditcard en Apple Pay of Google Pay zijn.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Een creditcard.', correct: true, explanation: 'Op een creditcard staat krediet: geld van de bank dat je leent, en de bank bepaalt de hoogte op basis van je inkomen.' },
          { text: 'iDEAL.', correct: false, misconception: 'Denkt dat iDEAL ook krediet geeft, terwijl het geld direct van je eigen rekening gaat.' },
          { text: 'Apple Pay of Google Pay.', correct: false, misconception: 'Ziet de betaalapp aan voor een eigen betaalproduct in plaats van een manier om je bestaande pas te gebruiken.' },
          { text: 'Een pinpas van je eigen bank.', correct: false, misconception: 'Verwart betalen met eigen geld en betalen met geleend geld.' }
        ],
        feedback: 'Krediet is het sleutelwoord: bij een creditcard gebruik je geld van de bank, en daarom kijkt de bank eerst naar je inkomen.'
      },
      {
        prompt: 'Bij een betaling met iDEAL kun je het bedrag zelf terughalen als de webshop nep blijkt te zijn.',
        waar: false,
        leerdoel: 'Je weet wat iDEAL, Klarna, een creditcard en Apple Pay of Google Pay zijn.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Het betalen met iDEAL is veilig, maar het geld is meteen weg. Je kunt het niet zelf terughalen en de bank kan je daar ook niet bij helpen.'
      },
      {
        prompt: 'Je koppelt je bankpas aan je telefoon met Apple Pay of Google Pay. Welke maatregel hoort daar volgens de paragraaf bij?',
        leerdoel: 'Je weet wat iDEAL, Klarna, een creditcard en Apple Pay of Google Pay zijn.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je zet je telefoon op vliegtuigstand als je hem niet gebruikt.', correct: false, misconception: 'Denkt dat betalen internet nodig heeft en dat vliegtuigstand daarom beschermt.' },
          { text: 'Je deelt je toegangscode met een vriend, voor het geval je hem vergeet.', correct: false, misconception: 'Ziet een reservekopie van de code als handig in plaats van als het grootste lek.' },
          { text: 'Je kiest een lange toegangscode, deelt hem met niemand en zet Zoek mijn iPhone aan.', correct: true, explanation: 'Wie jouw code kent, kan met jouw passen betalen; een lange code en een terugvindfunctie beperken de schade.' },
          { text: 'Je haalt de pas van je telefoon zodra je iets besteld hebt.', correct: false, misconception: 'Denkt dat het risico bij de bestelling zit in plaats van bij een gestolen telefoon met een bekende code.' }
        ],
        feedback: 'Een gekoppelde bankpas is zo veilig als je toegangscode: zes cijfers, met niemand gedeeld, en een functie om je telefoon terug te vinden.'
      },
      {
        prompt: 'Beschrijf wat er stap voor stap gebeurt als je een Klarna-rekening steeds niet betaalt, en waarom dat jaren later nog last kan geven.',
        type: 'open',
        leerdoel: "Je kunt de risico's van achteraf betalen uitleggen.",
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Eerst krijg je een herinnering. Betaal je dan nog niet, dan volgen boetes, waardoor het bedrag oploopt. Daarna kan Klarna een incassobureau inschakelen: een bedrijf dat probeert het geld alsnog te krijgen, en dat kost jou opnieuw extra geld. Betaal je vaker te laat, dan kan je naam worden doorgegeven aan andere instanties, bijvoorbeeld banken. Instanties zijn organisaties die zulke gegevens bijhouden. Dat kan jaren later problemen geven als je geld wilt lenen of een huis wilt kopen, want de bank ziet dan dat je je afspraken niet nakwam.',
        nakijkpunten: [
          'Zet de stappen in de goede volgorde: herinnering, boete, incassobureau.',
          'Legt uit dat het bedrag daardoor steeds hoger wordt.',
          'Noemt het doorgeven van je naam en het gevolg voor lenen of een huis kopen.'
        ],
        feedback: 'Achteraf betalen is geen uitstel maar een afspraak: de keten van herinnering naar incasso naar registratie loopt vanzelf door als je niets doet.'
      },
      {
        prompt: 'Je vindt een webshop buiten de EU die alle vijf de checks uit 5.3 glansrijk doorstaat. Waarom is dat nog geen reden om zonder nadenken te bestellen?',
        leerdoel: 'Je weet dat je bij kopen buiten de EU invoerrechten en btw kunt moeten betalen.',
        denkniveau: 'toepassen',
        niveau: 'verdieping',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat webshops buiten de EU nooit een slotje hebben.', correct: false, misconception: 'Denkt dat het land van de winkel iets zegt over de beveiliging van de verbinding.' },
          { text: 'Omdat er invoerrechten, btw en afhandelingskosten bij kunnen komen bij aankomst.', correct: true, explanation: 'De vijf checks gaan over betrouwbaarheid, niet over de rekening die aan de grens ontstaat.' },
          { text: 'Omdat je buiten de EU alleen met een creditcard mag betalen.', correct: false, misconception: 'Denkt dat er een regel bestaat over welke betaalmethode buiten de EU is toegestaan.' },
          { text: 'Omdat de douane elk pakket dat uit het buitenland komt openmaakt en daarna vernietigt.', correct: false, misconception: 'Verwart controleren met vernietigen; vernietigen gebeurt alleen als je de kosten niet betaalt.' }
        ],
        feedback: 'De vijf checks zeggen iets over de winkel, niet over de grens. Buiten de EU heb je dus een zesde vraag: wat kost dit straks extra?'
      },
      {
        prompt: 'Wie vaker te laat betaalt bij Klarna, krijgt niet alleen een boete: zijn naam wordt ook doorgegeven aan andere instanties. Leg uit waarom dat tweede gevolg zwaarder weegt dan het eerste, en verbind het met wat je in 5.2 over je gegevens leerde.',
        type: 'open',
        leerdoel: "Je kunt de risico's van achteraf betalen uitleggen.",
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        modelAnswer: 'Een boete is een bedrag dat je één keer betaalt, en daarna is het voorbij. Doorgeven aan instanties werkt anders: dan komt jouw naam in een register bij banken te staan, dus in een lijst die banken samen bijhouden van mensen met een betalingsachterstand, en daar blijf je jaren in staan. Daardoor kun je later moeilijker geld lenen, een telefoonabonnement afsluiten of een huis kopen. In 5.2 leerde ik dat gegevens over jou blijven bestaan en zich verspreiden zodra je ze uit handen geeft. Hier gebeurt precies dat, alleen geef jij ze niet zelf weg: je geeft ze weg door niets te doen. Daarom is te laat betalen geen kleine slordigheid maar een spoor dat lang meegaat.',
        nakijkpunten: [
          'Zet het eenmalige karakter van een boete tegenover het langdurige karakter van een registratie.',
          'Noemt minstens één concreet gevolg later, bijvoorbeeld lenen of een huis kopen.',
          'Legt de verbinding met 5.2: gegevens over jou blijven bestaan en verspreiden zich.'
        ],
        feedback: 'De boete raakt je portemonnee van deze maand; de registratie raakt je keuzes over vijf jaar. Dat is het verschil tussen een rekening en een spoor.'
      }
      ,
      {
        prompt: 'Terugblik op 5.3: waarom weegt een onbekende webshop zwaarder als je met iDEAL wilt betalen dan wanneer je achteraf betaalt?',
        leerdoel: 'Je kunt vijf checks doen om te zien of een webshop betrouwbaar is.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'samen_oefenen',
        options: [
          { text: 'Omdat een webshop pas iDEAL mag aanbieden als een instantie hem heeft goedgekeurd.', correct: false, misconception: 'Denkt dat de betaalmethode zelf al een keurmerk is, waardoor hij de vijf checks van 5.3 overslaat zodra hij iDEAL ziet staan.' },
          { text: 'Omdat het geld bij iDEAL meteen weg is en niemand het voor je terughaalt.', correct: true, explanation: 'Bij iDEAL staat het bedrag direct bij de verkoper; bij achteraf betalen zie je het pakket eerst en betaal je daarna pas.' },
          { text: 'Omdat je bij iDEAL je pincode moet invullen op de website van de webshop zelf.', correct: false, misconception: 'Denkt dat je bij iDEAL je gegevens aan de winkel geeft, terwijl je bij je eigen bank betaalt.' },
          { text: 'Omdat iDEAL geen slotje in de URL gebruikt en achteraf betalen wel een slotje heeft.', correct: false, misconception: 'Verwart de beveiliging van de verbinding met de vraag of je je geld kunt terughalen.' }
        ],
        feedback: 'De vijf checks en de betaalmethode werken samen: hoe minder je van een winkel weet, hoe belangrijker het is dat je je geld nog kunt tegenhouden.'
      },
      {
        prompt: 'Terugblik op 1.2: iemand die jouw toegangscode kent, kan met Apple Pay of Google Pay ook met jouw bankpas betalen.',
        waar: true,
        leerdoel: 'Je weet waarom je je wachtwoord nooit aan iemand anders geeft.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Sinds je je bankpas aan je telefoon koppelt, is die code niet meer alleen de sleutel van je toestel maar ook van je rekening. Daarom hoort hij zes cijfers lang te zijn en van niemand anders.'
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
        keyTerms: ['gereedschap', 'checks', 'betaalmethodes'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Waarom staan online gedrag en online kopen eigenlijk in hetzelfde hoofdstuk bij elkaar? Op het eerste gezicht lijken die twee onderwerpen niets met elkaar te maken te hebben.</p>',
          '<p><strong>Antwoord.</strong> Ze delen dezelfde vorm, en dat zie je pas als je naar de handeling zelf kijkt. In allebei de gevallen doe je iets dat een seconde duurt en dat je daarna niet meer kunt terugdraaien. Op plaatsen drukken en op bestellen drukken voelen op dat moment precies even klein en even onschuldig. In allebei de gevallen helpt bovendien hetzelfde gereedschap: even stoppen, een vaste vraag stellen en pas daarna klikken. Bij plaatsen is die vaste vraag of jij wilt dat dit bericht over een jaar nog vindbaar is. Bij bestellen is die vaste vraag of deze winkel echt bestaat en of jij dit bedrag kunt missen. Precies om die gedeelde vorm leer je de twee onderwerpen in dit hoofdstuk samen beoordelen.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['controlelijst', 'oordeel', 'betaalwijzer'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Yassin schrijft als enige zin bij zijn checkpoint: ik heb een goede webshop gekozen. Waarom telt die zin nog niet als bewijs, en wat moet hij eraan toevoegen om er bewijs van te maken?</p>',
          '<p><strong>Antwoord.</strong> Het is een conclusie zonder onderbouwing, dus zijn docent kan er niet aan zien of hij echt gekeken heeft. Bewijs wordt het pas zodra hij per check laat zien wat hij precies gevonden heeft. Dus de prijs naast die van twee andere winkels, plus een schermafdruk van het slotje en het adres. Daarbij hoort de URL helemaal uitgeschreven, wat er onder contactgegevens stond en waar hij de reviews vond. Daarna volgt zijn eigen oordeel, en dat oordeel krijgt altijd een reden mee die uit zijn bevindingen volgt. Bijvoorbeeld: ik bestel hier, want vier checks vallen goed uit en de vijfde kon ik via Google controleren.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>In dit hoofdstuk leerde je twee dingen die dezelfde vorm hebben: nadenken voordat je iets deelt, en nadenken voordat je iets bestelt. Voor gedrag gebruik je je eigen waarden, de normen die eruit volgen, je privacy-instellingen en de meldknop. Voor kopen gebruik je de vijf checks en de vier betaalmanieren met hun risico\'s, en buiten de EU komen daar nog invoerrechten en btw bij. In deze toets laat je zien dat je dat gereedschap ook op een nieuwe situatie kunt gebruiken.</p>'
        + '<p>Elke vraag in deze toets hangt aan één leerdoel, en elk leerdoel wordt twee keer bevraagd. Loop je vast, kijk dan aan welk leerdoel de vraag hangt en lees het stuk hieronder terug voordat je verdergaat.</p>'
        + '<ul>'
        + '<li>Wat jouw digitale wereld is: 5.1, theorieblok A, de zes voorbeelden.</li>'
        + '<li>Normen en waarden online: 5.1, theorieblok B, de eerste alinea over waarden en normen.</li>'
        + '<li>Drie gedragsregels noemen: 5.1, theorieblok B, het rijtje van vier gedragsregels.</li>'
        + '<li>Welke gegevens je privé houdt: 5.2, theorieblok A, de vijf gegevens en waarom ze samen zwaarder wegen.</li>'
        + '<li>Je account op privé en je bio: 5.2, theorieblok A, de vier tips en de adder onder het gras.</li>'
        + '<li>Hoe en waarom je rapporteert: 5.2, theorieblok B, plus het verschil tussen rapporteren en klikken.</li>'
        + '<li>De vijf checks bij een webshop: 5.3, theorieblok B, het rijtje met de vijf checks.</li>'
        + '<li>URL en slotje lezen: 5.3, theorieblok B, check 2 en check 3, plus de weging aan het eind.</li>'
        + '<li>Waarom een te lage prijs waarschuwt: 5.3, theorieblok B, de rekensom over inkoop en verzending.</li>'
        + '<li>iDEAL, Klarna, creditcard en Apple Pay: 5.4, theorieblok A, waar de vier op een rij staan; iDEAL zelf staat daar kort en helemaal uitgeschreven in 5.3, theorieblok A.</li>'
        + "<li>De risico's van achteraf betalen: 5.4, theorieblok A, de keten van herinnering tot instanties.</li>"
        + '<li>Invoerrechten en btw buiten de EU: 5.4, theorieblok B, het douanestuk met de peildatum.</li>'
        + '<li>Een webshop en een betaalmethode beoordelen: 5.5, theorieblok B, plus het uitgewerkte voorbeeld van Yassin dat daaraan hangt.</li>'
        + '<li>Welke gedragsregels jij belangrijk vindt: 5.5, theorieblok A, en je eigen presentatie uit 5.1 en 5.2.</li>'
        + '</ul>',
      keyTerms: ['gedrag', 'meldknop', 'betaalmanieren']
    },
    vragen: [
      {
        prompt: 'Bas zegt: mijn digitale wereld is alleen mijn telefoon, want mijn PlayStation en mijn laptop tellen niet mee. Wat klopt daar niet aan?',
        leerdoel: 'Je kunt uitleggen wat jouw digitale wereld is.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Niets; je digitale wereld is inderdaad alleen wat je op je eigen telefoon doet, want daar zit je het meest op.', correct: false, misconception: 'Koppelt de digitale wereld aan een apparaat in plaats van aan alles wat via internet gaat.' },
          { text: 'Alles wat via een scherm en internet gaat telt mee, dus console en laptop ook.', correct: true, explanation: 'De les noemt telefoon, laptop, gameconsole en sociale media in een adem; het gaat om de verbinding, niet om het kastje.' },
          { text: 'Zijn PlayStation telt alleen mee als hij daar ook op chat.', correct: false, misconception: 'Denkt dat er pas sprake is van een digitale wereld zodra je met anderen praat.' },
          { text: 'Zijn laptop telt niet mee omdat hij daar schoolwerk op doet.', correct: false, misconception: 'Denkt dat schoolwerk buiten je digitale wereld valt omdat het moet.' }
        ],
        feedback: 'De bron noemt vier plekken tegelijk: telefoon, laptop, gameconsole en sociale media. Wie er een wegstreept, mist ook de risico\'s daarvan.'
      },
      {
        prompt: 'Welke zin beschrijft het verschil tussen een waarde en een norm het beste?',
        leerdoel: 'Je weet wat normen en waarden zijn en hoe ze online gelden.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een waarde vind je belangrijk; een norm is de regel die eruit volgt.', correct: true, explanation: 'De waarde is het uitgangspunt, de norm vertaalt dat naar gedrag dat wel of niet hoort.' },
          { text: 'Een waarde geldt in het echte leven en een norm geldt alleen op internet.', correct: false, misconception: 'Denkt dat online en offline elk hun eigen soort regels hebben.' },
          { text: 'Een waarde staat in de wet en een norm bedenk je zelf.', correct: false, misconception: 'Verwart normen en waarden met wetten.' },
          { text: 'Een waarde is een straf en een norm is een beloning.', correct: false, misconception: 'Denkt dat het over belonen en straffen gaat in plaats van over wat je belangrijk vindt.' }
        ],
        feedback: 'Waarde eerst, norm daarna. Wie de waarde kent, kan zelf een regel bedenken voor een situatie die nog niet op het lijstje stond.'
      },
      {
        prompt: 'Noem drie gedragsregels die online belangrijk zijn en geef bij elke regel een voorbeeld van een situatie waarin die regel geldt.',
        type: 'open',
        leerdoel: 'Je kunt drie gedragsregels noemen die online belangrijk zijn.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Regel 1: je scheldt of pest niemand. Situatie: in een gamechat gaat iemand af, en ik reageer niet met een scheldwoord. Regel 2: je vraagt toestemming voordat je iemand op een foto zet. Situatie: ik maak een groepsfoto op het schoolplein en vraag eerst of iedereen erop wil. Regel 3: je deelt geen foto\'s, kunst of muziek die niet van jou zijn. Situatie: ik gebruik voor mijn dia alleen een plaatje met een Creative Commons-licentie. Een vierde regel is nadenken voordat je iets plaatst, bijvoorbeeld bij een boos berichtje dat ik beter kan bewaren tot de volgende dag.',
        nakijkpunten: [
          'Noemt drie verschillende regels uit het hoofdstuk.',
          'Geeft bij elke regel een concrete situatie, geen algemene zin.',
          'Laat zien dat de situatie echt bij die regel hoort.'
        ],
        feedback: 'Een regel met een situatie erbij is toepasbare kennis; een regel zonder situatie is een zin die je uit je hoofd hebt geleerd.'
      },
      {
        prompt: 'Fatima schrijft haar digitale wereld op: scrollen op TikTok, gamen op de PlayStation, opzoeken hoe je een band plakt, en chatten in de klassengroep. Wat laat haar lijstje zien over het begrip digitale wereld?',
        leerdoel: 'Je kunt uitleggen wat jouw digitale wereld is.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Dat het begrip alles omvat wat via een scherm en internet gaat, dus ook gamen en opzoeken.', correct: true, explanation: 'De les zet telefoon, laptop, console en sociale media naast elkaar; het gaat om de verbinding, niet om het soort activiteit.' },
          { text: 'Dat het begrip eigenlijk alleen over sociale media gaat, want dat zijn de echte voorbeelden.', correct: false, misconception: 'Versmalt de digitale wereld tot social media en laat gamen en opzoeken erbuiten vallen.' },
          { text: 'Dat het begrip pas geldt zodra er andere mensen meekijken of meedoen.', correct: false, misconception: 'Denkt dat er pas sprake is van een digitale wereld als er contact met anderen bij komt kijken.' },
          { text: 'Dat het begrip voor iedereen precies hetzelfde invult, want online doen we dezelfde dingen.', correct: false, misconception: 'Mist dat de digitale wereld per persoon verschilt en daarom per persoon andere risico\'s meebrengt.' }
        ],
        feedback: 'Twee dingen zitten in dit begrip tegelijk: het gaat om alles wat via een scherm en internet loopt, en het ziet er voor iedereen anders uit.'
      },
      {
        prompt: 'Welke combinatie van gegevens hoor je zeker niet openbaar te delen?',
        leerdoel: 'Je weet welke persoonlijke gegevens je beter privé houdt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je lievelingsserie, je favoriete kleur en je mening over een film.', correct: false, misconception: 'Denkt dat elk persoonlijk detail even gevoelig is.' },
          { text: 'Je school, je woonplaats en je telefoonnummer.', correct: true, explanation: 'Samen leiden die drie een vreemde precies naar de plek waar jij elke dag bent, en geven ze hem ook een manier om contact te zoeken.' },
          { text: 'Je klas en het vak dat je het leukst vindt.', correct: false, misconception: 'Ziet schoolinformatie als gevaarlijk, ook als er geen naam of plek aan hangt.' },
          { text: 'Je woonplaats en je leeftijd.', correct: false, misconception: 'Kiest twee echt persoonlijke gegevens, maar mist waar het gevaar in zit. Woonplaats en leeftijd leveren geen plek op waar je elke dag te vinden bent en geen manier om je te bereiken.' }
        ],
        feedback: 'Losse gegevens zijn zelden het probleem; het gevaar ontstaat als drie stukjes samen een adres en een telefoon opleveren.'
      },
      {
        prompt: 'Je bio blijft meestal zichtbaar voor iedereen, ook als je account op privé staat.',
        waar: true,
        leerdoel: 'Je kunt je account op privé zetten en je bio veilig invullen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Daarom is je bio het gevaarlijkste vakje van je profiel: hij ligt open terwijl de rest dicht zit, dus zet er geen school of nummer in.'
      },
      {
        prompt: 'Je ziet in een groepsapp dat iemand een klasgenoot uitscheldt. Wat is de beste combinatie van stappen?',
        leerdoel: 'Je weet hoe en waarom je een bericht rapporteert.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Niets doen; het gaat niet over jou en meepraten maakt het erger.', correct: false, misconception: 'Denkt dat zwijgen hetzelfde is als neutraal blijven, terwijl de klasgenoot dan alleen staat.' },
          { text: 'Terugschelden naar degene die begon, dan houdt hij vanzelf op.', correct: false, misconception: 'Denkt dat je een gedragsregel mag breken zolang de ander begon.' },
          { text: 'Er iets van zeggen, het bericht rapporteren en het vertellen aan iemand die je vertrouwt.', correct: true, explanation: 'Deze drie stappen doen elk iets anders: grens stellen, de app laten ingrijpen en zorgen dat het niet bij jullie tweeen blijft.' },
          { text: 'Een screenshot maken en die in een andere groep zetten, zodat meer mensen zien wat er gebeurt.', correct: false, misconception: 'Verwart het verspreiden van het probleem met het melden ervan.' }
        ],
        feedback: 'Drie stappen die elkaar aanvullen: jij stelt de grens, de app kan het weghalen, en een volwassene zorgt dat het niet stilletjes doorgaat.'
      },
      {
        prompt: 'Welke check zegt het meest over de vraag of er echte mensen achter een webshop zitten?',
        leerdoel: 'Je kunt vijf checks doen om te zien of een webshop betrouwbaar is.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Of er een slotje voor het webadres staat.', correct: false, misconception: 'Denkt dat het slotje iets over de verkoper zegt in plaats van over de verbinding.' },
          { text: 'Of de site er professioneel uitziet.', correct: false, misconception: 'Denkt dat een mooie website bewijst dat er een echt bedrijf achter zit.' },
          { text: 'Of de prijzen ongeveer gelijk zijn aan die van andere winkels.', correct: false, misconception: 'Ziet de prijscheck als bewijs van bestaan, terwijl die alleen over de aanbieding gaat.' },
          { text: 'Of er een adres staat en of het telefoonnummer echt wordt opgenomen.', correct: true, explanation: 'Adres en bereikbare telefoon zijn de enige checks waarbij je contact maakt met de mensen achter de winkel.' }
        ],
        feedback: 'Contactgegevens zijn de menselijke check: een adres en een telefoon die opgenomen wordt, zijn moeilijker te faken dan een mooie pagina.'
      },
      {
        prompt: 'Bij het adres www.decathlon.nl.sportdeal-outlet.com/tenten is decathlon.nl de eigenaar van de site, want die naam staat vooraan.',
        waar: false,
        leerdoel: 'Je weet waar je op moet letten in de URL en bij het slotje.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'De eigenaar is sportdeal-outlet.com, want dat is de naam die direct vóór de eerste schuine streep staat. Wat een oplichter daarvóór plakt, mag hij helemaal zelf verzinnen, dus ook een bestaande merknaam.'
      },
      {
        prompt: 'Bij een te lage prijs kun je er meestal van uitgaan dat de winkel gewoon een scherpe aanbieding heeft.',
        waar: false,
        leerdoel: 'Je kunt uitleggen waarom een te lage prijs een waarschuwing is.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Een winkel heeft inkoop-, verzend- en personeelskosten. Wie structureel ver onder de markt zit, verdient zijn geld ergens anders mee.'
      },
      {
        prompt: 'Je vindt een spelcomputer voor 90 euro terwijl hij overal 240 euro kost. De site heeft een slotje, een adres in Duitsland en veel vijfsterrenreviews op de eigen pagina. Loop de vijf checks langs en schrijf je oordeel op.',
        type: 'open',
        leerdoel: 'Je kunt vijf checks doen om te zien of een webshop betrouwbaar is.',
        denkniveau: 'maken_controleren',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Check 1, prijs: 90 tegenover 240 euro is veel te laag, dus dat is meteen een alarm. Check 2, slotje: het staat er, maar dat zegt alleen iets over de verbinding en niets over de verkoper. Check 3, naam en URL: die moet ik vergelijken met het officiele adres van de winkel of het merk. Check 4, website en contactgegevens: er staat een adres, maar ik controleer of het telefoonnummer werkt en of het adres bestaat. Check 5, reviews: vijfsterrenreviews op de eigen pagina tellen niet, want die kan de verkoper zelf uitkiezen; ik zoek ze op Google. Mijn oordeel: niet bestellen, want de belangrijkste check staat op rood en het enige positieve bewijs komt van de winkel zelf.',
        nakijkpunten: [
          'Loopt alle vijf de checks langs en benoemt per check wat hij vindt.',
          'Ziet dat reviews op de eigen site geen bewijs zijn.',
          'Sluit af met een oordeel plus een reden.'
        ],
        feedback: 'Bewijs van de winkel zelf is geen bewijs. Zodra het enige positieve signaal van de verkoper komt, is de zaak rond.'
      },
      {
        prompt: 'Een onbekende webshop heeft wel een slotje, maar geen adres en alleen reviews op de eigen site. Wat mag je uit dat slotje afleiden?',
        leerdoel: 'Je weet waar je op moet letten in de URL en bij het slotje.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Dat het ontbrekende adres minder erg is, want een beveiligde winkel is geregistreerd.', correct: false, misconception: 'Laat een licht signaal een zwaar signaal wegstrepen, terwijl een oplichter het lichte signaal zelf regelt.' },
          { text: 'Dat de reviews op de eigen site kloppen, want op een beveiligde site kun je niet zomaar iets neerzetten.', correct: false, misconception: 'Denkt dat versleuteling ook over de inhoud van de site gaat in plaats van over het transport.' },
          { text: 'Niets over deze winkel; alleen dat jouw gegevens versleuteld onderweg zijn.', correct: true, explanation: 'Het slotje regelt de winkel zelf, dus het kan de twee zware signalen hier niet opheffen: er is geen adres en er is geen bewijs van buiten.' },
          { text: 'Dat je hier gerust met iDEAL kunt betalen, want je gegevens zijn onderweg beschermd.', correct: false, misconception: 'Koppelt een veilige verbinding aan een veilige betaalkeuze, terwijl iDEAL-geld juist niet terug te halen is.' }
        ],
        feedback: 'Denk aan een gepantserde geldwagen die naar het verkeerde adres rijdt: het transport is veilig, de bestemming niet gecontroleerd.'
      },
      {
        prompt: 'Op welke betaalpas staat geld van de bank in plaats van je eigen geld?',
        leerdoel: 'Je weet wat iDEAL, Klarna, een creditcard en Apple Pay of Google Pay zijn.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Op de pinpas van je eigen betaalrekening.', correct: false, misconception: 'Denkt dat elke bankpas met geld van de bank werkt.' },
          { text: 'Op de creditcard, want daar staat krediet op dat je van de bank leent.', correct: true, explanation: 'Krediet is geleend geld; daarom kijkt de bank eerst naar je inkomen voordat je zo\'n kaart krijgt.' },
          { text: 'Op de kaart in je telefoon, want Apple Pay maakt er een creditcard van.', correct: false, misconception: 'Denkt dat een betaalapp de soort pas verandert in plaats van hem alleen door te geven.' },
          { text: 'Op elke pas waarmee je online kunt betalen.', correct: false, misconception: 'Ziet online betalen en lenen als hetzelfde.' }
        ],
        feedback: 'Bij een creditcard geef je geld uit dat nog niet van jou is; dat is het hele verschil met een gewone pinpas.'
      },
      {
        prompt: 'Welke omschrijving hoort bij Klarna?',
        leerdoel: 'Je weet wat iDEAL, Klarna, een creditcard en Apple Pay of Google Pay zijn.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een app waarmee je je bankpassen aan je telefoon koppelt.', correct: false, misconception: 'Verwart achteraf betalen met een betaalapp op je telefoon.' },
          { text: 'Een Zweedse bank waarmee je achteraf betaalt, met boete na een herinnering.', correct: true, explanation: 'Klarna laat je pas betalen als het product er is; te laat betalen kost daarna extra.' },
          { text: 'Een manier om direct via je eigen bank te betalen.', correct: false, misconception: 'Verwart Klarna met iDEAL, waar het geld meteen van je rekening gaat.' },
          { text: 'Een betaalpas met krediet die je alleen krijgt als je een vast maandelijks inkomen hebt.', correct: false, misconception: 'Verwart Klarna met een creditcard.' }
        ],
        feedback: 'Klarna en de creditcard lijken op elkaar omdat je bij allebei later betaalt, maar alleen bij de creditcard leen je geld van een bank.'
      },
      {
        prompt: 'Beschrijf de risico\'s van achteraf betalen in de goede volgorde, van de eerste brief tot het gevolg jaren later.',
        type: 'open',
        leerdoel: "Je kunt de risico's van achteraf betalen uitleggen.",
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Eerst komt de rekening, meestal een paar weken na de bestelling. Betaal je niet, dan volgt een herinnering. Daarna komen er boetes bij, waardoor het bedrag oploopt. Blijft het openstaan, dan schakelt het bedrijf een incassobureau in, en dat rekent zelf ook kosten. Als het vaker gebeurt, kan je naam worden doorgegeven aan instanties zoals banken. Jaren later merk je dat pas: je krijgt moeilijker een lening of een hypotheek, dus een lening om een huis mee te kopen, want de bank ziet dat je je afspraken niet nakwam.',
        nakijkpunten: [
          'Zet minstens vier stappen in de goede volgorde.',
          'Benoemt dat elke stap het bedrag verder laat oplopen.',
          'Noemt het gevolg op lange termijn voor lenen of een huis kopen.'
        ],
        feedback: 'De keten is het antwoord: rekening, herinnering, boete, incasso, registratie. Elke stap kost meer geld dan de vorige.'
      },
      {
        prompt: 'Waarom is achteraf betalen juist voor iemand zonder vast inkomen riskant?',
        leerdoel: "Je kunt de risico's van achteraf betalen uitleggen.",
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat achteraf betalen volgens de wet alleen mag als je ouder bent dan achttien jaar.', correct: false, misconception: 'Denkt dat een leeftijdsgrens het risico wegneemt in plaats van uitstelt.' },
          { text: 'Omdat de webshop je gegevens dan aan de douane doorgeeft.', correct: false, misconception: 'Haalt achteraf betalen en de regels rond invoer door elkaar.' },
          { text: 'Omdat de rekening hoe dan ook komt, ook als je dan geen geld hebt.', correct: true, explanation: 'Uitstel verandert niets aan het bedrag; het verplaatst alleen het moment waarop je het echt moet hebben. Zonder vast inkomen weet je niet of dat moment je uitkomt.' },
          { text: 'Omdat je bij achteraf betalen geen bedenktijd meer hebt.', correct: false, misconception: 'Denkt dat de betaalmethode bepaalt of je een product mag terugsturen.' }
        ],
        feedback: 'Achteraf betalen verplaatst het probleem naar een moment waarop jij nog niet weet hoe je ervoor staat; dat is de hele val.'
      },
      {
        prompt: 'Je bestelt voor 40 euro een gadget bij een webshop buiten de EU. Wat kan er nog bijkomen?',
        leerdoel: 'Je weet dat je bij kopen buiten de EU invoerrechten en btw kunt moeten betalen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: "Niets extra's, want de verzendkosten en de belasting zaten al in de prijs inbegrepen.", correct: false, misconception: 'Denkt dat gratis verzending betekent dat alle kosten betaald zijn.' },
          { text: 'Invoerrechten, btw en de kosten van de bezorger, te betalen bij aankomst.', correct: true, explanation: 'Bij goederen van buiten de EU rekent de douane invoerrechten en btw, en de pakketdienst rekent daarbovenop zijn eigen afhandelingskosten. Die rekening komt pas als het pakket hier is.' },
          { text: 'Alleen btw als je ouder bent dan achttien.', correct: false, misconception: 'Denkt dat belastingregels van je leeftijd afhangen.' },
          { text: 'Een boete, omdat kopen buiten de EU niet mag.', correct: false, misconception: 'Verwart extra kosten met iets verbodens.' }
        ],
        feedback: 'Drie posten, geen een: invoerrechten en btw van de douane, plus het vaste bedrag dat je bezorger rekent om je pakket aan te melden.'
      },
      {
        prompt: 'Kies een product van maximaal dertig euro en beschrijf hoe je in vijf stappen beslist waar en hoe je het koopt.',
        type: 'open',
        leerdoel: 'Je kunt een webshop en een betaalmethode beoordelen voordat je bestelt.',
        denkniveau: 'maken_controleren',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Stap 1: ik zoek het product bij twee of drie winkels en vergelijk de prijzen, zodat ik weet wat normaal is. Stap 2: ik kijk bij de goedkoopste of het slotje er staat en of de URL het echte adres van die winkel is. Stap 3: ik zoek contactgegevens, kijk of er een adres staat en of het telefoonnummer werkt. Stap 4: ik zoek reviews op Google, dus buiten de site zelf om. Stap 5: ik kies mijn betaalmethode. Zijn alle checks groen, dan kan iDEAL; twijfel ik nog, dan kies ik niet en zoek ik een andere winkel, want met iDEAL krijg ik mijn geld nooit terug.',
        nakijkpunten: [
          'Loopt herkenbaar de vijf checks uit 5.3 langs, in een logische volgorde.',
          'Koppelt de keuze van de betaalmethode aan de uitkomst van die checks.',
          'Trekt een conclusie: wel of niet bestellen, met een reden.'
        ],
        feedback: 'Een beslissing is pas af als de betaalmethode uit de checks volgt: eerst weten of de winkel deugt, dan pas kiezen hoe je betaalt.'
      },
      {
        prompt: 'Je wilt iets kopen bij een winkel die je niet kent en die er op het oog prima uitziet. Welke betaalmethode past het beste bij die twijfel?',
        leerdoel: 'Je kunt een webshop en een betaalmethode beoordelen voordat je bestelt.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'iDEAL, want dat is de veiligste manier van betalen.', correct: false, misconception: 'Verwart een veilige betaling met een veilige verkoper; juist bij iDEAL is het geld weg.' },
          { text: 'Geen enkele: bij twijfel bestel je niet, en zoek je een winkel die je wel kunt controleren.', correct: true, explanation: 'De betaalmethode lost je twijfel over de verkoper niet op; alleen de checks doen dat.' },
          { text: 'Apple Pay, want dan hoeft de winkel je pasnummer niet te zien.', correct: false, misconception: 'Denkt dat minder gegevens delen hetzelfde is als minder risico op oplichting.' },
          { text: 'Een creditcard van je ouders, want dan is het hun probleem.', correct: false, misconception: 'Schuift het risico door in plaats van het weg te nemen, en gebruikt bovendien andermans kaart.' }
        ],
        feedback: 'Geen enkele betaalknop maakt een onbekende winkel betrouwbaar; twijfel is zelf al het antwoord op de vraag of je bestelt.'
      },
      {
        prompt: 'Welke drie gedragsregels vind jij online het belangrijkst? Noem bij elke regel de waarde die eronder ligt en een situatie waarin die regel jou al eens geholpen heeft of had kunnen helpen.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen welke gedragsregels jij online belangrijk vindt.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'reflecteren',
        modelAnswer: 'Regel 1: ik vraag toestemming voordat ik iemand op een foto zet, want ik vind respect belangrijk. Toen ik een groepsfoto wilde posten heb ik het eerst gevraagd, en een klasgenoot wilde het niet; dat had anders ruzie gegeven. Regel 2: ik denk na voordat ik iets plaats, want ik vind het belangrijk dat ik later niet in de problemen kom. Een boos berichtje dat ik niet verstuurd heb, was de volgende dag al niet meer nodig. Regel 3: ik deel geen foto\'s of muziek van anderen, want ik vind eerlijkheid belangrijk; werk van iemand anders is niet van mij om weg te geven.',
        nakijkpunten: [
          'Noemt drie verschillende regels en bij elke regel de waarde die eronder ligt.',
          'Geeft per regel een concrete situatie, geen algemene zin.',
          'Schrijft in de ik-vorm en in eigen woorden.'
        ],
        feedback: 'Op deze vraag bestaat geen modelantwoord: het gaat erom dat jouw drie regels echt aan jouw waarden vastzitten en niet overgeschreven zijn.'
      },
      {
        prompt: 'Een klasgenoot zegt: ik post nooit iets over anderen zonder het eerst te vragen. Wat is die uitspraak, en wat ligt eronder?',
        leerdoel: 'Je weet wat normen en waarden zijn en hoe ze online gelden.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een norm, en daaronder ligt de waarde respect of privacy.', correct: true, explanation: 'Je ziet het aan zijn gedrag, dus het is een norm; de waarde eronder is wat hem die regel laat volhouden.' },
          { text: 'Een waarde, en daaronder ligt de norm dat je respect moet hebben voor iedereen.', correct: false, misconception: 'Draait de volgorde om: de waarde komt eerst en de norm volgt daaruit.' },
          { text: 'Een wet, want de Nederlandse privacywet verbiedt het plaatsen van foto\'s van klasgenoten.', correct: false, misconception: 'Verwart een afspraak tussen mensen met een regel die de overheid oplegt en handhaaft.' },
          { text: 'Geen van beide, want het is gewoon zijn eigen mening over hoe social media werkt.', correct: false, misconception: 'Ziet een gedragsregel aan voor een smaakvoorkeur, terwijl er een waarde onder ligt.' }
        ],
        feedback: 'De test is simpel: een waarde kun je niet zien, een norm zie je aan gedrag. Hier gaat het over gedrag, dus over een norm.'
      },
      {
        prompt: 'De regel dat je nadenkt voordat je iets plaatst weegt online zwaarder dan in de klas, omdat online materiaal gekopieerd en bewaard wordt.',
        waar: true,
        leerdoel: 'Je kunt drie gedragsregels noemen die online belangrijk zijn.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Een opmerking in de klas vervliegt in een minuut; een bericht online wordt gescreenshot, doorgestuurd en komt jaren later zomaar weer boven.'
      },
      {
        prompt: 'Leg uit waarom de vijf gegevens die je privé houdt samen gevaarlijker zijn dan elk gegeven op zichzelf. Gebruik in je uitleg een voorbeeld van twee gegevens die elkaar versterken.',
        type: 'open',
        leerdoel: 'Je weet welke persoonlijke gegevens je beter privé houdt.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Los lijkt elk gegeven onschuldig. Je school zegt alleen in welk gebouw je leert, en je locatie zegt alleen waar je op dat moment bent. Samen wijzen ze naar een persoon op een plek op een moment. Een voorbeeld: wie mijn school kent en daarbij mijn rooster of een verhaal met locatie ziet, weet precies hoe laat ik waar naar buiten kom. Met mijn volledige naam erbij kan iemand mij bovendien opzoeken, en met mijn telefoonnummer kan hij mij rechtstreeks benaderen. Die combinatie maakt ook identiteitsfraude mogelijk: iemand geeft zich bij een andere website voor mij uit. Daarom kijk je niet naar een gegeven op zichzelf, maar naar wat er ontstaat als je ze naast elkaar legt.',
        nakijkpunten: [
          'Legt uit dat losse gegevens weinig zeggen en de combinatie veel.',
          'Noemt minstens twee gegevens die elkaar echt versterken, met wat iemand daarmee kan.',
          'Gebruikt de gedachte van plaats plus tijd of noemt identiteitsfraude.'
        ],
        feedback: 'Denk aan een puzzel: één stukje zegt niets, vier stukjes naast elkaar laten al zien wat er op de plaat staat.'
      },
      {
        prompt: 'Je hebt je account op privé gezet. Welk deel van je profiel moet je daarna alsnog zelf nalopen?',
        leerdoel: 'Je kunt je account op privé zetten en je bio veilig invullen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je berichten van vorig jaar, want alle posts van voor de instelling blijven openbaar staan.', correct: false, misconception: 'Denkt dat de instelling alleen vooruit werkt en oude berichten ongemoeid laat.' },
          { text: 'Je wachtwoord, want dat verandert automatisch mee zodra je je privacy-instelling aanpast.', correct: false, misconception: 'Verwart een privacy-instelling met de beveiliging van je inlog.' },
          { text: 'Je bio en je profielfoto.', correct: true, explanation: 'Die twee blijven meestal voor iedereen zichtbaar, ook voor mensen zonder account, dus daar hoort niets gevoeligs in.' },
          { text: 'Je vriendenlijst, want die wordt door de instelling juist voor iedereen zichtbaar gemaakt.', correct: false, misconception: 'Denkt dat de privéknop iets openbaar maakt in ruil voor de bescherming van je berichten.' }
        ],
        feedback: 'De privéknop beschermt de binnenkant van je account. Je bio en je foto staan aan de voorkant en die maak je zelf leeg.'
      },
      {
        prompt: 'Wat gebeurt er nadat jij een bericht gerapporteerd hebt?',
        leerdoel: 'Je weet hoe en waarom je een bericht rapporteert.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De maker van het bericht krijgt van de app te horen wie de melding heeft gedaan.', correct: false, misconception: 'Denkt dat melden niet anoniem is, en durft daardoor niet te rapporteren.' },
          { text: 'Het bericht wordt onmiddellijk en zonder verdere controle van het platform verwijderd.', correct: false, misconception: 'Verwacht een garantie, terwijl een melding vaak alleen een waarschuwing oplevert of niets.' },
          { text: 'De politie krijgt automatisch een kopie van jouw melding en neemt daarna contact met je op.', correct: false, misconception: 'Verwart een melding bij een app met aangifte doen bij de politie.' },
          { text: 'De app beoordeelt of het bericht tegen de regels ingaat.', correct: true, explanation: 'Medewerkers of programma\'s kijken ernaar en beslissen zelf; jij hoeft geen rechter te spelen.' }
        ],
        feedback: 'Reken op een paar dagen en op een standaardbericht terug. Blijft het doorgaan, dan is een mentor of vertrouwenspersoon je volgende stap.'
      },
      {
        prompt: 'Leg uit waarom een halve prijs bij een onbekende webshop bijna nooit een echte aanbieding kan zijn. Noem de kosten die een winkel heeft en de drie verklaringen die dan overblijven.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen waarom een te lage prijs een waarschuwing is.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Een echte winkel koopt het product in, betaalt personeel, betaalt de verzending en wil daarna zelf nog iets overhouden. Al die kosten zitten in de prijs verwerkt. Wie structureel de helft van de normale prijs vraagt, verdient dus niets aan het product zelf en legt er zelfs geld op toe. Dat kan niemand maandenlang volhouden. Er blijven dan drie verklaringen over: het product is nep, het product is gestolen, of het komt nooit aan omdat de winkel alleen bestaat om je geld te innen. Een kleine korting kan echt zijn, bijvoorbeeld bij een uitverkoop of een oud model. Een halve prijs bij een winkel die je niet kent is een alarm en geen buitenkansje.',
        nakijkpunten: [
          'Noemt minstens drie kostenposten van een echte winkel.',
          'Legt uit dat de winkel bij een halve prijs niets aan het product verdient.',
          'Noemt de drie verklaringen: nep, gestolen of het komt nooit aan.'
        ],
        feedback: 'Reken het gewoon door vanuit de winkel: als de som niet uitkomt voor de verkoper, klopt er iets anders niet.'
      },
      {
        prompt: 'Sinds de vrijstelling voor kleine zendingen is verdwenen, betaal je ook bij een pakketje van tien euro uit China invoerrechten en btw.',
        waar: true,
        leerdoel: 'Je weet dat je bij kopen buiten de EU invoerrechten en btw kunt moeten betalen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Een vrijstelling is een uitzondering waarbij je niets hoeft te betalen. Die uitzondering voor kleine pakketjes bestaat niet meer, dus telt ook een klein bedrag mee.'
      },
      {
        prompt: 'Waarom vraagt dit hoofdstuk je om bij elke gedragsregel ook de waarde te noemen die eronder ligt?',
        leerdoel: 'Je kunt uitleggen welke gedragsregels jij online belangrijk vindt.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        options: [
          { text: 'Omdat je docent zo kan nakijken of je alle vier de regels letterlijk uit je hoofd hebt geleerd.', correct: false, misconception: 'Ziet de waarde als een controlemiddel voor de docent in plaats van als het fundament van de regel.' },
          { text: 'Omdat een regel zonder waarde eronder volgens de wet in Nederland niet geldig is.', correct: false, misconception: 'Verwart een persoonlijke gedragsregel met een wettelijke regel die je kunt afdwingen.' },
          { text: 'Omdat je een regel met een eigen waarde eronder volhoudt.', correct: true, explanation: 'En omdat je vanuit die waarde zelf een nieuwe regel kunt bedenken voor een situatie die in geen lijstje staat.' },
          { text: 'Omdat elke waarde precies een regel oplevert, zodat je kunt controleren of je er geen vergeten bent.', correct: false, misconception: 'Denkt dat waarden en normen een op een aan elkaar vastzitten, terwijl uit een waarde meerdere normen volgen.' }
        ],
        feedback: 'Een regel van iemand anders laat je los zodra het lastig wordt. Een regel die aan jouw eigen waarde vastzit, houd je vol.'
      }
    ]
  },

  '5.6': {
    learningGoals: [
      'Je weet dat je een online bestelling binnen veertien dagen mag terugsturen.',
      'Je kunt uitleggen wat garantie is en bij wie je moet zijn.',
      'Je weet wat je kunt doen als een webshop niet levert.'
    ],
    theorie: [
      {
        keyTerms: ['bedenktijd', 'herroepingsrecht', 'annuleren', 'opschorten'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Fenna bestelt op 3 maart een spelcomputer en krijgt hem op 7 maart thuisbezorgd. Op 19 maart wil ze hem toch terugsturen, dus mag dat op die datum nog gewoon?</p>',
          '<p><strong>Antwoord.</strong> Ja, dat mag, want de bedenktijd van veertien dagen begint de dag na ontvangst en dus op 8 maart. Die termijn loopt daarmee tot en met 21 maart, en Fenna is op 19 maart dus ruim op tijd. Ze meldt per e-mail bij de verkoper dat ze gebruikmaakt van haar herroepingsrecht, zodat ze dat later kan bewijzen. Daarna stuurt ze het product terug, en dat doet ze binnen veertien dagen na die melding. Vanaf haar melding op 19 maart moet de verkoper haar binnen veertien dagen terugbetalen, dus uiterlijk op 2 april. Die klok begint dus bij haar bericht en niet pas op de dag dat het pakket bij hem binnenkomt. Hij mag het betalen wel opschorten, dat wil zeggen uitstellen, totdat hij het product of haar verzendbewijs heeft. Stuurt Fenna dat verzendbewijs meteen mee, dan houdt hij geen enkele reden meer over om te wachten. Wel geldt de grens dat uitproberen mag zoals in een winkel, maar wekenlang echt gebruiken niet.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['wettelijke garantie', 'fabrieksgarantie', 'verkoper', 'ingebrekestelling'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Na veertien maanden gaat een koptelefoon van 150 euro kapot, terwijl de fabrieksgarantie maar twaalf maanden duurde. De webshop zegt dat je nu bij de fabrikant moet zijn, dus klopt dat antwoord?</p>',
          '<p><strong>Antwoord.</strong> Nee, dat antwoord klopt niet, en de webshop probeert hier iets af te schuiven wat hij zelf moet oplossen. Naast de fabrieksgarantie van twaalf maanden bestaat er namelijk wettelijke garantie, en die heb je altijd. Die wettelijke garantie duurt zolang je redelijkerwijs mag verwachten dat dit product gewoon blijft werken. Redelijkerwijs betekent hier wat een normaal mens ervan verwacht, gezien de prijs en het soort product. Bij een koptelefoon van 150 euro is veertien maanden dus veel te kort om van pech te spreken. Je aanspreekpunt blijft bovendien altijd de verkoper, dus de webshop waar jij dit product gekocht hebt. Die webshop mag de fabrikant er wel bij halen, maar blijft zelf verantwoordelijk voor reparatie, vervanging of je geld terug.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Bij een online aankoop heb je veertien dagen bedenktijd, het herroepingsrecht, gerekend vanaf de dag na ontvangst. Je meldt het schriftelijk en krijgt je geld binnen veertien dagen na die melding terug. De verkoper mag daarmee alleen wachten tot hij het product of je verzendbewijs binnen heeft. Naast de fabrieksgarantie heb je altijd wettelijke garantie, die zo lang duurt als je van het product mag verwachten. Je aanspreekpunt is bij allebei die vormen van garantie de verkoper, dus de winkel waar jij het gekocht hebt. Levert een webshop niet, dan neem je contact op, stuur je een ingebrekestelling met een redelijke termijn, en daarna mag je de koop ontbinden.</p>',
      keyTerms: ['bedenktijd', 'wettelijke garantie', 'verkoper']
    },
    vragen: [
      {
        prompt: 'Annuleren mag al vanaf het moment dat je bestelt. Maar vanaf welke dag gaan de veertien dagen bedenktijd tellen?',
        leerdoel: 'Je weet dat je een online bestelling binnen veertien dagen mag terugsturen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'De dag nadat je het product hebt ontvangen.', correct: true, explanation: 'De wet rekent vanaf de dag na ontvangst, want pas dan kun je het product echt bekijken.' },
          { text: 'De dag waarop je de bestelling plaatst.', correct: false, misconception: 'Verwart het moment waarop je al mag annuleren met het moment waarop de veertien dagen gaan tellen, en denkt daardoor dat zijn bedenktijd dagen eerder afloopt.' },
          { text: 'De dag waarop je betaald hebt.', correct: false, misconception: 'Koppelt de termijn aan de betaling in plaats van aan de levering.' },
          { text: 'De dag waarop de webshop het pakket verstuurt.', correct: false, misconception: 'Denkt dat de verzenddatum telt, terwijl de bezorging soms dagen later is.' }
        ],
        feedback: 'Twee momenten dus, en die verwar je makkelijk: annuleren mag al zodra je besteld hebt, maar de veertien dagen gaan pas lopen op de dag na ontvangst. Zo houd je altijd veertien volle dagen over om het product te bekijken, hoe lang de bezorging ook duurde.'
      },
      {
        prompt: 'Je meldt op 4 juni per e-mail dat je gebruikmaakt van je bedenktijd. Vanaf welke dag telt de termijn van veertien dagen waarbinnen de verkoper jou moet terugbetalen?',
        leerdoel: 'Je weet dat je een online bestelling binnen veertien dagen mag terugsturen.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'Vanaf de dag dat de verkoper het pakket weer binnen heeft.', correct: false, misconception: 'Maakt van het opschortingsrecht het startpunt van de termijn en geeft de verkoper daarmee weken meer tijd dan de wet hem geeft.' },
          { text: 'Vanaf 4 juni, de dag van jouw melding.', correct: true, explanation: 'De wet koppelt de terugbetaaltermijn aan jouw herroepingsmelding, dus vanaf 4 juni heeft de verkoper veertien dagen.' },
          { text: 'Vanaf de dag dat jij het pakket bij het postkantoor afgeeft.', correct: false, misconception: 'Verwart het verzendbewijs, dat alleen het opschorten beëindigt, met het startmoment van de termijn zelf.' },
          { text: 'Vanaf de dag dat de verkoper jouw e-mail beantwoordt.', correct: false, misconception: 'Denkt dat de verkoper de termijn kan uitstellen door simpelweg niet te reageren op de melding.' }
        ],
        feedback: 'Jouw melding zet de klok aan, en dat is precies waarom je die melding schriftelijk doet. De verkoper mag alleen opschorten, dus wachten met betalen tot hij het product of je verzendbewijs heeft. Stuur je hem meteen een foto van het verzendbewijs, dan heeft hij geen enkele reden meer om nog te wachten.'
      },
      {
        prompt: 'Beschrijf de drie stappen die je zet als een webshop na de beloofde levertijd nog steeds niet geleverd heeft, en leg per stap uit waarom die stap nodig is.',
        type: 'open',
        leerdoel: 'Je weet wat je kunt doen als een webshop niet levert.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        modelAnswer: 'Stap 1: ik neem contact op met de verkoper zodra de beloofde levertijd voorbij is. Dat is nodig omdat hij de kans moet krijgen het alsnog te doen en omdat ik dan kan zien of er nog iemand reageert. Stap 2: ik stuur een schriftelijke ingebrekestelling, bijvoorbeeld per e-mail, waarin ik een redelijke termijn geef van veertien dagen. Dat is nodig omdat ik daarmee kan bewijzen dat ik hem officieel in gebreke heb gesteld. Stap 3: haalt hij die termijn niet, dan ontbind ik de koop en vraag ik mijn geld terug. Dat is nodig omdat ik anders eindeloos blijf wachten. Helpt dat niet, dan ga ik naar de Geschillencommissie als de webshop daarbij is aangesloten, en ik meld de webshop bij ACM ConsuWijzer.',
        nakijkpunten: [
          'Noemt de drie stappen in de goede volgorde: contact, ingebrekestelling met termijn, ontbinden.',
          'Legt bij de ingebrekestelling uit waarom schriftelijk en met een redelijke termijn.',
          'Noemt minstens een vervolgstap, bijvoorbeeld de Geschillencommissie of ACM ConsuWijzer.'
        ],
        feedback: 'De ingebrekestelling is de sleutelstap: pas als je schriftelijk een redelijke termijn hebt gegeven, mag je de koop terugdraaien en je geld terugvragen.'
      },
      {
        prompt: 'Bij wie meld je je als een product dat je online kocht na een jaar kapotgaat?',
        leerdoel: 'Je kunt uitleggen wat garantie is en bij wie je moet zijn.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'Bij de fabrikant, want die heeft het product gemaakt.', correct: false, misconception: 'Denkt dat wie het product maakte ook het probleem moet oplossen.' },
          { text: 'Bij het vervoersbedrijf dat het pakket bezorgde.', correct: false, misconception: 'Verwart bezorgschade met een product dat later kapotgaat.' },
          { text: 'Bij de verkoper, dus bij de winkel of webshop waar jij gekocht hebt.', correct: true, explanation: 'Met de verkoper sloot jij de koop, dus hij blijft verantwoordelijk, ook als hij de fabrikant erbij haalt.' },
          { text: 'Bij je bank, want die heeft de betaling geregeld.', correct: false, misconception: 'Denkt dat de betaalpartij ook over de koop gaat.' }
        ],
        feedback: 'Altijd terug naar de verkoper. Hij mag de fabrikant inschakelen, maar hij moet het voor jou oplossen, niet andersom.'
      },
      {
        prompt: 'Je hebt alleen recht op garantie zolang de fabrieksgarantie loopt.',
        waar: false,
        leerdoel: 'Je kunt uitleggen wat garantie is en bij wie je moet zijn.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        feedback: 'Fabrieksgarantie is een extra belofte, wettelijke garantie is een recht dat je altijd hebt en dat vaak veel langer loopt.'
      },
      {
        prompt: 'Je bestelt bij een winkel die je vooraf helemaal hebt nagelopen, maar het pakket komt niet. Wat heb je aan die controle nu nog?',
        leerdoel: 'Je weet wat je kunt doen als een webshop niet levert.',
        denkniveau: 'toepassen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Niets meer; wie besteld heeft, moet afwachten.', correct: false, misconception: 'Denkt dat controleren vooraf de enige bescherming is die een koper heeft.' },
          { text: 'De vijf checks gaven je een adres en een telefoonnummer, dus je kunt contact opnemen.', correct: true, explanation: 'De contactgegevens uit check 4 zijn precies wat je nodig hebt om de verkoper te bereiken en daarna officieel in gebreke te stellen.' },
          { text: 'Je vraagt je geld gewoon terug bij de bank, want die controleert elke webshop van tevoren.', correct: false, misconception: 'Denkt dat de bank een rol speelt bij het beoordelen of leveren van bestellingen.' },
          { text: 'Je doet aangifte bij de politie, want niet leveren is diefstal.', correct: false, misconception: 'Ziet een ruzie over een koop meteen als een misdrijf. Niet leveren is een conflict over een afspraak: dat los je eerst op met de verkoper zelf, en pas daarna via een klacht of de rechter.' }
        ],
        feedback: 'De vijf checks zijn niet alleen een filter vooraf: ze leveren je precies de gegevens waarmee je achteraf je recht kunt halen.'
      },
      {
        prompt: 'Je bestelt bij een webshop in China. Leg uit waarom je veertien dagen bedenktijd daar in de praktijk veel minder waard is, en wat dat betekent voor de keuze die je in 5.3 maakte.',
        type: 'open',
        leerdoel: 'Je weet dat je een online bestelling binnen veertien dagen mag terugsturen.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        modelAnswer: 'Het herroepingsrecht van veertien dagen komt uit Europese wetgeving en geldt dus voor verkopers binnen de EU. Zit de verkoper in China, dan bestaat dat recht voor jou op papier misschien wel, maar kun je het bijna niet gebruiken. Je moet het product namelijk zelf terugsturen, en verzending naar China kost vaak meer dan het product zelf gekost heeft. Bovendien weet je meestal niet welk bedrijf er precies achter de app zit, dus je weet niet eens naar wie je iets stuurt. En er is geen Geschillencommissie of ACM ConsuWijzer die zo\'n verkoper hier kan dwingen. Voor 5.3 betekent dat: bij een winkel buiten de EU is de controle vooraf je enige bescherming. Ik pas de vijf checks daar dus strenger toe en vraag me af of ik dit bedrag echt kan missen.',
        nakijkpunten: [
          'Legt uit dat de veertien dagen bedenktijd wel bestaat maar buiten de EU nauwelijks te gebruiken is.',
          'Noemt minstens twee praktische obstakels, bijvoorbeeld retourkosten of een onbekende verkoper.',
          'Trekt de conclusie dat de controle vooraf uit 5.3 dan zwaarder weegt.'
        ],
        feedback: 'Bedenktijd die je alleen kunt gebruiken door het product duurder terug te sturen dan het kostte, is geen echte bedenktijd meer.'
      }
      ,
      {
        prompt: 'Terugblik op 5.4: je stuurt een jas van zestig euro uit China binnen veertien dagen terug. Waarom houd je daar vaak minder aan over dan je hoopt?',
        leerdoel: 'Je weet dat je bij kopen buiten de EU invoerrechten en btw kunt moeten betalen.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'samen_oefenen',
        options: [
          { text: 'Omdat het herroepingsrecht nooit geldt voor kleding die je al een keer gepast hebt.', correct: false, misconception: 'Denkt dat passen hetzelfde is als gebruiken, terwijl je juist mag bekijken en uitproberen.' },
          { text: 'Omdat retour sturen naar China duur is en je douanekosten niet vanzelf terugkomen.', correct: true, explanation: 'De verkoper betaalt de aankoopprijs terug, maar de retourzending en de teruggaaf bij de douane regel je zelf.' },
          { text: 'Omdat een webshop buiten de EU zich nergens aan hoeft te houden, ook niet aan het herroepingsrecht dat in deze paragraaf staat.', correct: false, misconception: 'Denkt dat het recht niet bestaat, terwijl het bestaat maar buiten de EU moeilijk af te dwingen is.' },
          { text: 'Omdat je het pakket eerst nog een keer moet laten keuren door de douane in Rotterdam.', correct: false, misconception: 'Verzint een extra stap en mist dat de kosten het echte probleem zijn.' }
        ],
        feedback: 'Je recht staat overeind, maar het uitoefenen kost hier geld en moeite. Precies daarom is de afweging vóór het bestellen belangrijker dan de regels erna.'
      },
      {
        prompt: 'Terugblik op 5.3: leg uit waarom het slotje in de URL je niets zegt over de vraag of je je geld terugziet als er niet geleverd wordt.',
        type: 'open',
        leerdoel: 'Je weet waar je op moet letten in de URL en bij het slotje.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        modelAnswer: 'Het slotje zegt alleen iets over de verbinding: mijn gegevens gaan versleuteld tussen mijn browser en die server, zodat niemand onderweg kan meelezen. Het zegt niets over de mensen achter de site. Achter dat slotje zit een certificaat, dus een digitaal bewijsje waarmee een site aantoont dat hij is wie hij zegt te zijn. Zo\'n certificaat kan een oplichter gratis aanvragen, dus ook een nepwinkel heeft gewoon een slotje. Of ik mijn geld terugzie hangt af van heel andere dingen: of de verkoper bestaat, of hij bereikbaar is, of hij in de EU zit en of ik mijn betaling nog kan tegenhouden. Daarom controleer ik de naam, de contactgegevens en de reviews, en kies ik bij twijfel een betaalmethode waarbij het geld nog niet meteen weg is.',
        nakijkpunten: [
          'Legt uit dat het slotje over de versleutelde verbinding gaat en niet over de verkoper.',
          'Noemt dat ook een nepwinkel een slotje kan krijgen.',
          'Verbindt het terugkrijgen van geld aan andere checks of aan de gekozen betaalmethode.'
        ],
        feedback: 'Veilig versturen en veilig kopen zijn twee verschillende vragen. Het slotje beantwoordt alleen de eerste, en je rechten uit deze paragraaf pas de tweede.'
      }
    ]
  }
};
