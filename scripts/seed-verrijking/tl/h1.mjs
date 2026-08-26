// Verrijkingslaag hoofdstuk 1 - Startklaar op je nieuwe school (theoretische leerweg).
//
// Structuur en lesstof staan in scripts/seed-structuur/tl/h1.mjs. Hier staan de
// leerdoelen, de kernbegrippen, de uitgewerkte voorbeelden, de samenvattingen en
// alle toetsvragen. Het patroon en alle regels staan in ../PATROON.md; lees dat
// eerst.
//
// LET OP - BEWUSTE AFWIJKING VAN DE BRON (geen dekkingsfout)
//   De bron (Wikiwijs les 0) behandelt ItsLearning als losse ELO naast
//   SOMtoday. DaCapo College gebruikt dat systeem in schooljaar 2026-2027 niet
//   meer: opdrachten en inleveren lopen nu via de ELO van SOMtoday. Alle stof
//   over de losse ELO is daarom bewust omgezet naar de ELO van SOMtoday.
//
// Twee dingen die deze leerweg sturen:
//   - Zinnen van 15 tot 20 woorden, begrippen mogen abstract blijven, en het
//     waarom staat er altijd bij. Vandaar de langere theorieblokken.
//   - Meer open vragen waarin de leerling iets uitlegt of vergelijkt, en
//     verdiepingsvragen die verbanden leggen tussen paragrafen.
//
// HOE DE BLAUWDRUK HIER LANDT
// ---------------------------
// De startcheck staat NIET in dit bestand maar in het structuurbestand, onder
// `checks`. Daar staat per leerdoel één startvraag met het goede antwoord en de
// uitleg erbij; de generator zet dat blok voor de theorie en klapt de uitleg
// dicht tot de leerling hem zelf opent. Zo is het echt een startvraag en geen
// navraag. Hetzelfde geldt voor het oefenblok (`opties.oefenen`) en voor het
// modelantwoord bij de praktijkopdracht (`assignment`).
//
// Wat hier wél staat:
//   1. Elk theorieblok heeft een uitgewerkt voorbeeld (exampleHtml) dat de
//      leerling ziet voordat hij zelfstandig gaat oefenen.
//   2. Elke afsluitquiz van 1.2, 1.3, 1.4 en 1.6 sluit af met TWEE
//      terugkeervragen uit eerdere paragrafen. Die vragen dragen het leerdoel
//      van die eerdere paragraaf, zodat de toetsmatrijs laat zien dat er echt
//      gespreid wordt. 1.1 heeft ze niet, want daarvóór ligt niets.
//   3. De hoofdstuktoets van 1.5 telt 30 vragen en bevraagt ALLE 14 verplichte
//      leerdoelen van dit hoofdstuk, elk minstens twee keer. De blauwdruk noemt
//      15 tot 20 vragen als startwaarde, maar noemt in dezelfde tabel "elk doel
//      minstens 2x" en waarschuwt dat het toetseffect niet uitstraalt naar
//      niet-bevraagde stof. Bij 14 verplichte doelen kunnen die twee getallen
//      niet allebei; dekking wint dan van het ronde getal.
//   4. De afsluitquizzen tellen 6, 6, 7, 6 en 8 vragen tegen de 5 die de
//      blauwdruk als startwaarde noemt. Dat is geen slordigheid maar het gevolg
//      van twee harde eisen die elkaar optellen: elke paragraaf heeft drie
//      leerdoelen die elk minstens één keer bevraagd moeten worden, en elke quiz
//      na 1.1 sluit af met twee terugkeervragen naar eerdere paragrafen. Drie
//      plus twee is al vijf, en dan is er nog geen enkel leerdoel twee keer
//      bevraagd. Zes is dus het praktische minimum; 1.3 heeft er zeven omdat het
//      mailleerdoel drie stappen kent, en 1.6 acht omdat de rekenredenering
//      alleen in stappen te toetsen is. 1.1 heeft er zes zonder terugkeervragen,
//      want daarvóór ligt niets.
//
// WAT ER IN RONDE 5 IS HERSTELD
// -----------------------------
// A. Het onbewezen wifi-feit is uit de gescoorde vragen. De hoofdstuktoets had
//    als waar-niet-waar dat je met je leerlingnummer en wachtwoord op het wifi
//    van school komt, met "waar" goedgerekend. Dat schoolfeit staat in het
//    structuurbestand zelf als INGEVULD gemarkeerd, met de waarschuwing dat het
//    gecontroleerd moet worden. In het theorieblok stond de slag om de arm er
//    wel bij, in de gescoorde toets niet. De stelling gaat nu over de procedure
//    en niet over de gegevens, en die procedure klopt hoe DaCapo het ook
//    geregeld heeft. Dezelfde claim in de afsluitquiz van 1.1 is vervangen door
//    de Office 365-uitspraak die les 0 letterlijk doet.
//
// B. Alle 15 waar-niet-waar-vragen staan nu in de LANGE vorm. Ze stonden in de
//    korte vorm (waar: true/false), dus met lege explanation en misconception op
//    de knoppen Waar en Niet waar, terwijl alle 32 meerkeuzevragen die velden
//    wel gevuld hadden. De blauwdruk noemt "uitleg per antwoord, niet per vraag"
//    als wat de hoogste standaard toevoegt; die kans lag op 15 vragen open.
//    Elke knop draagt nu of de reden waarom hij klopt, of de denkfout erachter,
//    zodat de docent in de nakijkstapel niet alleen ziet DAT het fout was.
//
// C. Twee afleiders die niet eenduidig fout waren of juist ontbraken.
//    - Bij de gekopieerde alinea stond als afleider "de naam van de website in
//      kleine letters eronder zetten en verder niets veranderen", met als
//      misconception dat een bronvermelding het overnemen niet goedmaakt. De
//      bron zegt echter zelf: "Als je echt grote stukken tekst gebruikt, dan moet
//      je zelfs zeggen van wie (de bron) je de tekst hebt gebruikt." Een scherpe
//      leerling kon die afleider dus verdedigen. Hij is nu "er google.com onder
//      zetten", en dat is wel eenduidig fout: de zoekmachine is de bron niet.
//    - De originele afsluittoets van DigiChallenge 1 heeft bij de omgangsregel
//      de afleider "die regels zeggen wat je wel en niet mag doen op school".
//      Dat is de denkfout die een brugklasser echt maakt, en die stond in geen
//      enkele HELIX-vraag. Hij vervangt nu de leeftijdsregel-afleider, die
//      verder van de klas af stond.
//
// D. De eerste quizvraag van 1.4 vroeg naar digitale geletterdheid "zoals het
//    aan het begin van deze paragraaf is uitgelegd" en rekende "veilig, handig
//    en kritisch" goed, terwijl het begin van theorieblok A alleen "veilig"
//    zei; de drieslag stond pas in de samenvatting. De theoriezin noemt nu alle
//    drie en legt ze in de zin erna uit, dus vraag en tekst zeggen hetzelfde.
//
// E. De vier stukken van digitale geletterdheid waren het enige onderwerp dat
//    pas in het CHECKPOINT voor het eerst werd uitgelegd en daar meteen twee
//    toetsvragen kreeg. Ze komen nu binnen in 1.4, waar digitale geletterdheid
//    zelf gedefinieerd wordt; 1.5 haalt ze alleen nog op en heeft er een
//    mediablok bij gekregen (mediawijsheid.nl), zodat de zwaarste nieuwe stof
//    van het hoofdstuk ook beeld heeft.
//
// F. Niveau. Die claim luidde hier "geen zin in dit bestand komt nog boven de
//    25 woorden", en dat was niet waar: er stonden zinnen van 26, 27 en 28
//    woorden in, onder andere in de feedback van de afsluitquiz van 1.4 en 1.6
//    en in toetsvraag 13. In ronde 6 zijn die alsnog gesplitst. Gemeten op de
//    gegenereerde seed staat er nu in vragen, opties, feedback, modelantwoorden
//    en oefenvelden geen zin meer boven de 24 woorden. De enige uitzondering in
//    het hele hoofdstuk is het letterlijke citaat van veiliginternetten.nl
//    (27 woorden), en dat staat in het structuurbestand.
//    De langste zinnen stonden in modelAnswers, en dat is precies de tekst die
//    de leerling als voorbeeldantwoord naschrijft; daar hoort de tl-band van 15
//    tot 20 woorden net zo goed te gelden als in de theorie.
//
// F2. RONDE 6: de foute rekenregel uit 1.6 is hier op twee plekken hersteld.
//    Het uitgewerkte voorbeeld bij theorieblok B van 1.6 en de explanation bij
//    het GOEDE antwoord van quizvraag 3 van 1.6 schreven allebei dat een
//    ruimere tekenset "maar een keer meetelt". Onjuist: 95^8 gedeeld door 26^8
//    is 31.770, dus die ruimere keuze werkt wel degelijk op elke positie, met
//    ongeveer 3,65. Lengte wint omdat 26 per extra teken groter is dan die 3,65
//    per positie, en omdat er vier tekens bij komen. Beide plekken rekenen nu
//    met 3,65 per positie tegen 26 per teken. De derde vindplaats stond in het
//    structuurbestand; zie punt D4 in de kop daarvan.
//    Meetnotitie bij het verwijt dat de uitgewerkte voorbeelden op 13,3 woorden
//    per zin zouden staan: dat is een artefact. De labels "Vraag." en
//    "Antwoord." tellen dan als twee zinnen van een woord per voorbeeld, dus
//    24 eenwoordszinnen op 108. Zonder die labels: 85 zinnen, gemiddeld 17,07
//    woorden, 68 procent binnen de band 15 tot 20, langste 24.
//
// WAT ER IN RONDE 3 IS HERSTELD
// -----------------------------
// A. De vier stukken van digitale geletterdheid worden nu BEVRAAGD.
//    In ronde 2 vulden ze vijf van de negen zinnen van theorieblok A van 1.5,
//    stonden ze in het uitgewerkte voorbeeld, in de samenvatting en bij de
//    kernbegrippen, en kwamen ze daarna in geen enkele van de 28 toetsvragen
//    voor. Precies de niet-bevraagde stof waarvan de blauwdruk aantoont dat het
//    toetseffect er niet naartoe uitstraalt (g = 0,01 tot 0,04). Ze hebben nu
//    een eigen startvraag (structuurbestand, checks van 1.5), een oefenopgave,
//    een steunopgave en twee toetsvragen: welke vier het zijn, en bij welk stuk
//    de omgangsregels van je poster horen.
//
// B. Twee rekenkundige fouten uit 1.6 hersteld.
//    - Het uitgewerkte voorbeeld bij theorieblok B sloot af met "zo zie je
//      waarom tien kleine letters het winnen van acht tekens vol hoofdletters,
//      cijfers en leestekens". Dat is onjuist: 26^10 is ongeveer honderdveertig
//      biljoen en 95^8 ruim zesduizend biljoen, dus die acht tekens zijn juist
//      zo'n 47 keer sterker. Het voorbeeld rekent nu allebei de effecten uit
//      en laat zien waar de omslag zit: bij twaalf kleine letters.
//    - De meerkeuzevraag daarover ging over tien kleine letters en had als
//      feedback de bronclaim "meer dan honderd keer zwakker". De vraag gaat nu
//      over twaalf kleine letters, de feedback geeft de getallen, en er staat
//      een waar-niet-waar-vraag naast die de oude claim expliciet ontkracht.
//      In het structuurbestand is de bronclaim een plusopgave geworden: reken
//      hem na en zeg of hij klopt. Dat past bij het leerdoel, dat letterlijk
//      "je kunt beredeneren" heet.
//
// C. Feitelijke correctie in de hoofdstuktoets.
//    De feedback bij de schermknip-vraag zei dat je op een Chromebook knipt met
//    Ctrl en de vensterwisseltoets. Dat pakt het HELE scherm; een deel knip je
//    met Ctrl, Shift en de vensterwisseltoets.
//
// D. Raadbaarheid van de hoofdstuktoets.
//    Het goede antwoord stond in de zestien meerkeuzevragen van 1.5 zeven keer
//    op knop 2, en zeven van de acht waar-niet-waar-stellingen waren onwaar.
//    Blind "de tweede knop" of blind "niet waar" klikken leverde daarmee te veel
//    op. Nu staat het goede antwoord vier keer op elke knop, en zijn vier van de
//    acht stellingen waar. Drie stellingen zijn daarvoor omgedraaid naar een
//    ware formulering; de inhoud die ze toetsen is niet veranderd.
//    Daar kwam de tweede blinde proef van de validator bij: het goede antwoord
//    was in vijftien van de zestien meerkeuzevragen van 1.5 ook het LANGSTE
//    antwoord, en in vijf vragen van het hoofdstuk meer dan anderhalf keer zo
//    lang als de langste afleider. Dan is de toets te halen op vorm. De
//    afleiders zijn nu even uitgeschreven als het goede antwoord, en de
//    redengevende bijzin staat waar hij hoort: in `explanation`. Over heel
//    hoofdstuk 1 is het goede antwoord nog in 13 van de 32 meerkeuzevragen het
//    langste (41 procent), en in geen enkel blok boven de 44 procent.
//
// E. Niveau: de samenvattingen en de uitgewerkte voorbeelden.
//    Alle achttien samenvattingszinnen vielen binnen de band van 15 tot 20
//    woorden, en de voorbeelden van 1.3 en 1.4 hadden zinnen van 39 en 41
//    woorden. Dat is een filter, geen geschreven tekst. Elke samenvatting heeft
//    nu een korte zin die het punt neerzet, en in de voorbeelden staat geen zin
//    meer boven de 24 woorden. De volgordeoefening van 1.3 staat nu als vier
//    losse regels A tot en met D in plaats van als één zin van 39 woorden.
//
// 1.6 is de VRIJWILLIGE plusparagraaf. Zijn leerdoelen komen daarom in geen
// enkele vraag van de hoofdstuktoets 1.5 voor; de generator en de validator
// stoppen daarop. Andersom mag 1.6 wél terugkijken naar 1.1 tot 1.4.

const LD_1_1 = [
  'Je kunt inloggen op je schoolaccount, het wifi-netwerk van school en Office 365.',
  'Je weet waar je in SOMtoday je rooster en je cijfers vindt en waar de ELO met je opdrachten zit.',
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

const LD_1_6 = [
  'Je kunt uitleggen wat er gebeurt als je ergens inlogt.',
  'Je kunt uitleggen waarom twee-staps-verificatie zoveel sterker is dan een wachtwoord alleen.',
  'Je kunt beredeneren waarom een lang wachtwoord veiliger is dan een ingewikkeld kort wachtwoord.'
];

export default {
  '1.1': {
    learningGoals: LD_1_1,
    theorie: [
      {
        keyTerms: ['schoolaccount', 'leerlingnummer', 'wifi-netwerk', 'Office 365'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Milan wil inloggen op een computer in het computerlokaal en daarna verbinden met het wifi van school. Op zijn briefje staat 123456@dacapocollege.nl, dus wat typt hij precies in de twee velden van het inlogscherm?</p>',
          '<p><strong>Antwoord.</strong> Bij gebruikersnaam typt hij 123456, want alleen het deel vóór de @ is zijn leerlingnummer. Bij wachtwoord typt hij het wachtwoord dat hij bij de start van het jaar zelf gekozen heeft. Typt hij het hele mailadres in, dan weigert de computer hem, want dat is een afleveradres en geen inlognaam. Voor het wifi opent hij daarna de wifi-instellingen, kiest hij het netwerk van DaCapo College en klikt hij op Verbinden. Daar typt hij opnieuw 123456 met zijn eigen wachtwoord, en op de vraag of hij het certificaat vertrouwt klikt hij weer op Verbinden.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['SOMtoday', 'ELO', 'screenshot', 'OneDrive'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sara moet haar werkstuk inleveren en wil daarna kunnen bewijzen dat het gelukt is. Welke stappen zet ze achter elkaar, en waar kijkt ze tussendoor nog even voor haar rooster?</p>',
          '<p><strong>Antwoord.</strong> Ze opent in SOMtoday de ELO, klikt haar vak aan en zoekt de opdracht van vandaag op in de lijst. Ze kiest Inleveren, sleept haar bestand in het vak en controleert de bestandsnaam voordat ze bevestigt. Op het scherm verschijnt dan een bevestiging met datum en tijd, en van precies dat scherm maakt ze een screenshot. Dat doet ze met de Windows-toets, Shift en S, waarna ze het beeld met Ctrl en V in haar Word-bestand plakt. Wil ze daarna weten hoe laat haar volgende les begint, dan kijkt ze bij haar rooster, dat ook gewoon in SOMtoday staat. Haar bestand bewaart ze tot slot in OneDrive, zodat ze er thuis op een andere computer ook bij kan.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Met één schoolaccount open je de schoolcomputers, het wifi van school en Office 365 in je browser. Eén sleutel, veel deuren. Je gebruikersnaam is je leerlingnummer, dus het deel vóór de @, en je wachtwoord koos je helemaal zelf. Je rooster staat in SOMtoday, je opdrachten staan daar ook, in de ELO, en bewijs lever je met een schermafdruk.</p>',
      keyTerms: ['schoolaccount', 'leerlingnummer', 'ELO']
    },
    vragen: [
      {
        prompt: 'Je zit voor het eerst achter een schoolcomputer en het inlogscherm vraagt om twee gegevens. Wat typ je precies in het bovenste vakje, dat van de gebruikersnaam?',
        leerdoel: LD_1_1[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je voornaam en je achternaam, met een punt ertussen.', correct: false, misconception: 'Denkt dat een schoolaccount met je naam werkt, zoals een spelaccount.' },
          { text: 'Je hele schoolmailadres, dus je leerlingnummer met de @ en de rest erachter.', correct: false, misconception: 'Kent het mailadres wel, maar leest niet dat alleen het deel vóór de @ nodig is.' },
          { text: 'Alleen je leerlingnummer, dus het deel vóór de @.', correct: true, explanation: 'Het leerlingnummer is je inlognaam; de rest van het adres hoort bij je mailbox.' },
          { text: 'Het wachtwoord dat je zelf gekozen hebt.', correct: false, misconception: 'Verwisselt het vakje gebruikersnaam met het vakje wachtwoord eronder.' }
        ],
        feedback: 'Bij de gebruikersnaam hoort alleen je leerlingnummer, dus het deel vóór de @ van je adres. Je zelfgekozen wachtwoord typ je daarna in het vakje dat er direct onder staat.'
      },
      {
        prompt: 'Met je Office 365-account log je op de computers van school in en open je daarna ook Word, PowerPoint en Outlook.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: true, explanation: 'Klopt: op alle apparaten van school log je in met datzelfde Office 365-account, en daarmee open je ook Word, PowerPoint en Outlook.' },
          { text: 'Niet waar', correct: false, misconception: 'Denkt dat elk programma van school een eigen apart account nodig heeft.' }
        ],
        leerdoel: LD_1_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Je schoolaccount is één sleutel die op veel deuren past: van de computer in het lokaal tot Word, PowerPoint en Outlook.'
      },
      {
        prompt: 'Je wilt weten in welk lokaal je het derde uur zit en welk cijfer je voor je eerste toets hebt. Waar kijk je voor allebei die vragen, zonder het aan iemand anders te hoeven vragen?',
        leerdoel: LD_1_1[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'In SOMtoday, want daar staan je rooster en je cijfers bij elkaar.', correct: true, explanation: 'SOMtoday is het administratiesysteem: rooster, roosterwijzigingen, cijfers en meldingen.' },
          { text: 'In de ELO bij je vakken, want daar zet je docent alle schoolinformatie voor jou neer.', correct: false, misconception: 'Denkt dat de elektronische leeromgeving ook het rooster en de cijfers bijhoudt.' },
          { text: 'In OneDrive, want daar staan al jouw eigen opgeslagen bestanden bij elkaar.', correct: false, misconception: 'Verwart een opslagplek met een informatiesysteem.' },
          { text: 'In de klassenapp, want daar hoor je zulke dingen altijd als eerste van elkaar.', correct: false, misconception: 'Vertrouwt op klasgenoten in plaats van op het officiële systeem van school.' }
        ],
        feedback: 'SOMtoday is je rooster en je cijferlijst, en je kunt er zelfs meldingen aanzetten voor nieuwe cijfers. De ELO is er voor het lesmateriaal van je docenten en voor het inleveren van je werk.'
      },
      {
        prompt: 'Je klasgenoot beweert dat je rooster en de ELO gewoon twee namen voor dezelfde plek in SOMtoday zijn. Leg het verschil uit en geef van allebei een voorbeeld van iets wat jij er zelf doet.',
        type: 'open',
        leerdoel: LD_1_1[1],
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        modelAnswer: 'Het rooster met de cijfers gaat over hoe ik ervoor sta en wanneer ik waar moet zijn: ik bekijk er mijn lessen en zet er een melding aan voor een roosterwijziging. De ELO is de leeromgeving binnen SOMtoday: daar staat het lesmateriaal van mijn docent en daar lever ik mijn opdrachten en werkstukken in. Het is dus niet dezelfde plek: het ene deel is de administratie, het andere is de les.',
        nakijkpunten: [
          'Noemt bij het rooster de cijfers of de meldingen.',
          'Noemt bij de ELO lesmateriaal of het inleveren van werk.',
          'Geeft bij allebei een eigen voorbeeld en schrijft in hele zinnen.'
        ],
        feedback: 'Het verschil zit in je vraag. Je rooster en je cijfers beantwoorden wanneer iets is en hoe je ervoor staat, de ELO wat je moet maken en waar je het inlevert.'
      },
      {
        prompt: 'Hoe laat je zien dat je een opdracht echt gemaakt hebt, zonder je scherm aan je docent te laten zien?',
        leerdoel: LD_1_1[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Je zegt tegen je docent dat het gelukt is.', correct: false, misconception: 'Denkt dat vertellen hetzelfde is als bewijs leveren.' },
          { text: 'Je slaat het bestand op het bureaublad op en laat het daar staan.', correct: false, misconception: 'Denkt dat opslaan op de computer waar je toevallig zit al inleveren is.' },
          { text: 'Je maakt met je telefoon een foto van je scherm en stuurt die in een appgroep.', correct: false, misconception: 'Kiest een omweg buiten de schoolomgeving om, met slecht leesbaar resultaat.' },
          { text: 'Je maakt een screenshot en levert die in via de ELO van SOMtoday.', correct: true, explanation: 'Een screenshot laat precies zien wat er op jouw scherm stond, en via de ELO komt het op de juiste plek terecht.' }
        ],
        feedback: 'Een screenshot is bewijs dat je docent kan bekijken wanneer het hem uitkomt, en de ELO van SOMtoday zorgt dat het bij de goede opdracht belandt.'
      },
      {
        prompt: 'Welke toetsen druk je op Windows tegelijk in om een deel van je scherm te knippen?',
        leerdoel: LD_1_1[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ctrl, Alt en Delete tegelijk.', correct: false, misconception: 'Kent die toetscombinatie van vastgelopen computers en gokt daarop.' },
          { text: 'De Windows-toets, Shift en S.', correct: true, explanation: 'Het scherm wordt dan grijs en je sleept met je muis een vak om het deel dat je wilt hebben.' },
          { text: 'Ctrl en S tegelijk indrukken.', correct: false, misconception: 'Verwart opslaan met knippen, omdat er in beide een S zit.' },
          { text: 'Alt en Tab achter elkaar.', correct: false, misconception: 'Denkt dat wisselen tussen vensters ook een afbeelding oplevert.' }
        ],
        feedback: 'De Windows-toets, Shift en S samen starten het knipgereedschap waarmee je een deel knipt. Wat je knipt staat op het klembord, dus plak het daarna met Ctrl en V in je bestand.'
      }
    ]
  },

  '1.2': {
    learningGoals: LD_1_2,
    theorie: [
      {
        keyTerms: ['wachtwoordzin', 'uniek', 'gehackt'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Welke van deze twee wachtwoorden is sterker: Fluffy2013! of de zin paarse trein eet zeep? En waarom denken veel leerlingen precies het omgekeerde als ze er even naar kijken?</p>',
          '<p><strong>Antwoord.</strong> Paarse trein eet zeep is veruit de sterkste: eenentwintig tekens, vier woorden die niets met elkaar te maken hebben. Fluffy2013! oogt moeilijk door de hoofdletter, de cijfers en het uitroepteken, maar het is de naam van een huisdier met een jaartal erachter. Wie de eigenaar een beetje kent raadt zo\'n wachtwoord vaak al binnen een paar pogingen. Het is dus de lengte die het werk doet, en niet de rare tekens die je ertussen zet.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['wachtwoordkluis', 'hoofdwachtwoord', 'wachtwoordportaal'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Yara schrijft al haar wachtwoorden achter in haar agenda, want dan raakt ze ze naar eigen zeggen nooit kwijt. Wat gaat hier precies mis, en wat is het betere alternatief voor haar?</p>',
          '<p><strong>Antwoord.</strong> Haar agenda ligt de hele dag open op tafel en gaat mee in haar tas; iedereen die hem oppakt, heeft al haar accounts. Beter is een wachtwoordkluis op haar telefoon: één hoofdwachtwoord onthouden, en de rest onthoudt de app voor haar. En ze maakt alvast een account op het wachtwoordportaal van school, zodat ze zichzelf kan helpen als ze toch iets vergeet.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een sterk wachtwoord is vooral lang, en een wachtwoordzin van vier losse woorden werkt daarvoor het allerbest. Lengte wint van ingewikkeldheid. Neem daarnaast voor elke site een uniek wachtwoord, want dan zet één lek niet meteen al je andere accounts open. Bewaren doe je in een wachtwoordkluis of in een goed beveiligd document, en weggeven doe je het nooit.</p>',
      keyTerms: ['wachtwoordzin', 'uniek', 'wachtwoordkluis']
    },
    vragen: [
      {
        prompt: 'Welk van deze wachtwoorden is het sterkst als je alleen naar raden en kraken kijkt?',
        leerdoel: LD_1_2[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Sanne2013!', correct: false, misconception: 'Denkt dat een hoofdletter, cijfers en een uitroepteken een wachtwoord vanzelf sterk maken.' },
          { text: 'gele stoel eet regen', correct: true, explanation: 'Twintig tekens, vier woorden die niets met elkaar en niets met jou te maken hebben.' },
          { text: 'W8woord', correct: false, misconception: 'Denkt dat een cijfer in plaats van een letter het raden echt moeilijker maakt.' },
          { text: 'MijnHond#1', correct: false, misconception: 'Gebruikt iets uit het eigen leven; wie de eigenaar kent, komt hier snel op.' }
        ],
        feedback: 'Vier losse woorden zijn samen twintig tekens lang en horen bovendien bij niemand in het bijzonder. Sanne2013! is kort en persoonlijk, en dat is precies de zwakke combinatie die je wilt vermijden.'
      },
      {
        prompt: 'Op elke site hetzelfde wachtwoord gebruiken is veilig, zolang dat ene wachtwoord maar heel lang is.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: false, misconception: 'Denkt dat lengte ook beschermt tegen een lek bij de website zelf, en niet alleen tegen raden.' },
          { text: 'Niet waar', correct: true, explanation: 'Klopt: bij een lek ligt dat ene lange wachtwoord op straat en past het meteen op al je andere accounts.' }
        ],
        leerdoel: LD_1_2[0],
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        feedback: 'Lengte helpt goed tegen raden, maar lengte helpt niet tegen een lek bij de website zelf. Is één site gehackt, dan proberen criminelen datzelfde wachtwoord meteen bij al je andere accounts.'
      },
      {
        prompt: 'Waar bewaar je je wachtwoorden zo dat jij er altijd bij kunt en anderen juist niet?',
        leerdoel: LD_1_2[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'In een notitie op je telefoon die verder niet beveiligd is.', correct: false, misconception: 'Denkt dat een eigen telefoon vanzelf privé is, ook als hij openligt in de kleedkamer.' },
          { text: 'Op een briefje in je etui, dan heb je het altijd bij je.', correct: false, misconception: 'Kiest gemak; precies het losse briefje waar de les voor waarschuwt.' },
          { text: 'In een wachtwoordkluis of in een goed beveiligd document.', correct: true, explanation: 'Alles staat achter één slot dat alleen jij kunt openen, en je hoeft niets meer op te schrijven.' },
          { text: 'In je hoofd, en als je het vergeet vraag je het aan een vriend.', correct: false, misconception: 'Ziet niet dat een vergeten wachtwoord via het wachtwoordportaal hersteld wordt, niet via anderen.' }
        ],
        feedback: 'Een wachtwoordkluis bewaart al je wachtwoorden achter één hoofdwachtwoord dat alleen jij kent. Vergeet je toch een keer iets, dan is het wachtwoordportaal van school jouw eigen herstelroute.'
      },
      {
        prompt: 'Je beste vriend is zijn wachtwoord kwijt en vraagt of hij even met jouw account mag inloggen om zijn opdracht in te leveren. Leg uit wat je doet en waarom.',
        type: 'open',
        leerdoel: LD_1_2[2],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'reflecteren',
        modelAnswer: 'Ik geef mijn wachtwoord niet, ook niet aan mijn beste vriend. Alles wat er daarna met mijn account gebeurt, staat op mijn naam, ook als hij het per ongeluk fout doet. Ik help hem wel: ik wijs hem het wachtwoordportaal van school, of we gaan samen naar de docent of de ICT-helpdesk.',
        nakijkpunten: [
          'Zegt duidelijk dat het wachtwoord niet gedeeld wordt.',
          'Noemt als reden dat alles wat er gebeurt op de eigen naam staat.',
          'Biedt een alternatief: wachtwoordportaal, docent of helpdesk.'
        ],
        feedback: 'Je geeft je wachtwoord niet weg, maar je helpt hem wel op een andere manier verder. Wijs hem het wachtwoordportaal of de helpdesk, want daar wordt zijn eigen toegang hersteld.'
      },
      {
        prompt: 'Je logt in op een schoolcomputer en het lukt drie keer achter elkaar niet, dus wat doe je dan?',
        leerdoel: LD_1_1[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je meldt het bij je docent of bij de ICT-helpdesk van school.', correct: true, explanation: 'School kan je account herstellen of je wachtwoord opnieuw instellen; jij kunt dat zelf niet.' },
          { text: 'Je logt in met het account van je buurman, dan kun je tenminste werken.', correct: false, misconception: 'Verplaatst het probleem naar iemand anders; werken onder andermans naam mag niet.' },
          { text: 'Je typt hetzelfde wachtwoord nog tien keer, want een keer moet het lukken.', correct: false, misconception: 'Denkt dat volhouden helpt bij een accountprobleem.' },
          { text: 'Je maakt zelf een nieuw account aan met je privémailadres.', correct: false, misconception: 'Denkt dat een leerling zelf een schoolaccount kan aanmaken.' }
        ],
        feedback: 'Terugblik op 1.1: een schoolaccount herstel je niet zelf, want dat doet de helpdesk voor je. Melden kost een minuut, en het account van een ander lenen is nooit de oplossing.'
      },
      {
        prompt: 'In 1.1 leverde je bewijs in met een screenshot waarop je docent zelf kon meekijken. Leg uit welk bewijs je van je wachtwoordkaart wél mag inleveren en wat er absoluut niet op mag staan.',
        type: 'open',
        leerdoel: LD_1_1[2],
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik mag laten zien dat ik het snap. Op mijn kaart staan drie verzonnen wachtwoordzinnen met het aantal tekens erbij. Daaronder leg ik per zin uit waarom die sterk is. Er zit ook een screenshot bij waarop te zien is dat mijn account op het wachtwoordportaal klaarstaat. Mijn echte wachtwoord komt er niet op, en op de screenshot mag geen ingevuld wachtwoordveld te zien zijn. Bewijs leveren betekent laten zien wat ik kan, niet mijn sleutel weggeven.',
        nakijkpunten: [
          'Noemt wat er wel op mag: verzonnen voorbeelden, uitleg of een screenshot van het portaal.',
          'Zegt expliciet dat het echte wachtwoord er nooit op staat.',
          'Legt het verschil uit tussen bewijs laten zien en toegang weggeven.'
        ],
        feedback: 'Terugblik op 1.1: bewijs laten zien en je sleutel weggeven zijn twee heel verschillende dingen. De kaart mag dus ingeleverd worden, zolang je echte wachtwoord er nergens op te lezen staat.'
      }
    ]
  },

  '1.3': {
    learningGoals: LD_1_3,
    theorie: [
      {
        keyTerms: ['Outlook', 'ontvanger', 'onderwerp'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Hier staan twee onderwerpregels voor precies dezelfde mail aan je docent: "hoi" en "mijn eerste email". Welke van die twee is beter, en waarom maakt die keuze eigenlijk uit?</p>',
          '<p><strong>Antwoord.</strong> De tweede is beter, want je docent krijgt op een dag tientallen berichten binnen. In zijn postvak ziet hij alleen de onderwerpregels staan, en verder niets van de inhoud. Bij "hoi" moet hij elk bericht openen om te weten waar het over gaat, en bij "mijn eerste email" weet hij het meteen. Het onderwerp is dus geen versiering, maar de titel waaraan jouw mail herkend wordt.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['aanhef', 'interpunctie', 'paragrafen', 'Verzenden'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Zet deze vier losse stukken van een mail in de goede volgorde en schrijf de letters op.</p>',
          '<p>A: Met vriendelijke groet, Sam de Wit, 1A. B: Ik wil graag meer leren over ICT. C: Beste mevrouw Peeters. D: Mijn naam is Sam en ik zit in klas 1A.</p>',
          '<p><strong>Antwoord.</strong> De volgorde is C, D, B en A, en die volgorde volgt uit wat elk stuk doet. Eerst C, want met de aanhef spreek je iemand aan voordat je iets van hem vraagt. Dan D, zodat de ontvanger meteen weet wie er schrijft en uit welke klas dat komt. Pas daarna komt B, je eigenlijke boodschap, en onderaan A, de afsluiting met je naam en je klas. Van boven naar beneden dus: aanspreken, jezelf voorstellen, je vraag stellen en tot slot netjes afsluiten.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>In Outlook maak je een nieuwe e-mail, vul je bij Aan het adres in en typ je daarna het onderwerp. Dat onderwerp is de titel van je mail. In het bericht begin je met een aanhef en stel je jezelf voor met je naam en je klas. Daarna komt je vraag, en onderaan staat de afsluiting met je naam, je klas en nette interpunctie.</p>',
      keyTerms: ['Outlook', 'aanhef', 'afsluiting']
    },
    vragen: [
      {
        prompt: 'Wat hoort er precies in het vakje Onderwerp van de allereerste oefenmail die je verstuurt?',
        leerdoel: LD_1_3[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je hele vraag, zodat je docent het bericht niet eens hoeft te openen.', correct: false, misconception: 'Denkt dat het onderwerp de plek voor de boodschap zelf is.' },
          { text: 'mijn eerste email', correct: true, explanation: 'Dat is precies het onderwerp dat de opdracht vraagt, en het zegt in drie woorden waar de mail over gaat.' },
          { text: 'Niets; het onderwerp mag je overslaan.', correct: false, misconception: 'Slaat het onderwerp over omdat de mail ook zonder verstuurd kan worden.' },
          { text: 'Beste meneer,', correct: false, misconception: 'Verwisselt het onderwerp met de aanhef die in het bericht zelf hoort.' }
        ],
        feedback: 'Het onderwerp is de titel van je mail en staat in een eigen veld boven je bericht. Bij deze oefenopdracht is dat onderwerp letterlijk: mijn eerste email, precies zoals de opdracht het voorschrijft.'
      },
      {
        prompt: 'Welke volgorde van onderdelen klopt voor een nette schoolmail, van boven naar beneden in het bericht?',
        leerdoel: LD_1_3[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Boodschap, aanhef, voorstellen, afsluiting.', correct: false, misconception: 'Begint met de vraag, zoals in een appje aan een vriend.' },
          { text: 'Aanhef, afsluiting, voorstellen, boodschap.', correct: false, misconception: 'Zet de groet midden in het bericht in plaats van onderaan.' },
          { text: 'Voorstellen, boodschap, aanhef, afsluiting.', correct: false, misconception: 'Vergeet dat een mail begint met wie je aanspreekt.' },
          { text: 'Aanhef, voorstellen, boodschap, afsluiting.', correct: true, explanation: 'Eerst wie je aanspreekt, dan wie jij bent, dan wat je wilt, en onderaan je naam en klas.' }
        ],
        feedback: 'Een mail loopt van boven naar beneden: aanspreken, jezelf voorstellen, je vraag stellen en afsluiten met je naam en je klas.'
      },
      {
        prompt: 'Ook in een heel korte mail aan je mentor gebruik je gewoon hoofdletters en punten.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: true, explanation: 'Klopt: hoofdletters en punten horen bij elke mail aan een docent, hoe kort dat bericht ook is.' },
          { text: 'Niet waar', correct: false, misconception: 'Denkt dat nette taal pas nodig wordt zodra een bericht een bepaalde lengte heeft.' }
        ],
        leerdoel: LD_1_3[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Ja. Interpunctie kost je twee seconden en bepaalt hoe je overkomt; een mail aan een docent is geen appje aan een vriend.'
      },
      {
        prompt: 'Je weet het mailadres van je docent niet uit je hoofd, maar je moet hem vandaag mailen. Hoe kom je er in Outlook toch achter zonder het aan iemand anders te vragen?',
        leerdoel: LD_1_3[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je typt bij Aan de achternaam van je docent en klikt het juiste adres aan.', correct: true, explanation: 'Outlook zoekt in het adresboek van school mee, dus je kunt geen typefout maken in het adres.' },
          { text: 'Je vraagt het adres in de klassenapp en typt over wat iemand stuurt.', correct: false, misconception: 'Vertrouwt op een overgetypt adres, waarin makkelijk een letter verkeerd staat.' },
          { text: 'Je gokt op voornaam.achternaam en kijkt of de mail terugkomt.', correct: false, misconception: 'Denkt dat een mail die niet terugkomt dus is aangekomen.' },
          { text: 'Je stuurt hem naar het algemene adres van school met het verzoek hem door te sturen.', correct: false, misconception: 'Maakt een omweg terwijl Outlook het juiste adres zelf voorstelt.' }
        ],
        feedback: 'Typ alleen de achternaam bij Aan, want het adresboek van school vult de rest voor je aan. Zo staat er zeker geen letter verkeerd in het adres van je eigen docent.'
      },
      {
        prompt: 'Een brugklasser stuurt zijn docent dit bericht: "ey meneer wanneer is de toets nou groetjes". Schrijf de mail opnieuw zoals het hoort en leg in twee zinnen uit wat je veranderd hebt.',
        type: 'open',
        leerdoel: LD_1_3[1],
        denkniveau: 'maken_controleren',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Beste meneer Jansen, mijn naam is Nour en ik zit in klas 1C. Ik heb een vraag over de toets van digitale geletterdheid: kunt u mij laten weten in welke week die wordt afgenomen? Met vriendelijke groet, Nour el Amrani, 1C. Ik heb een aanhef en een afsluiting toegevoegd, mezelf voorgesteld en hoofdletters en punten gebruikt. Zo ziet de docent meteen wie er schrijft en wat de vraag precies is.',
        nakijkpunten: [
          'De herschreven mail heeft een aanhef, een voorstelrondje, een duidelijke vraag en een afsluiting met naam en klas.',
          'Gebruikt hoofdletters, punten en hele zinnen.',
          'Legt in twee zinnen uit wat er veranderd is en waarom dat beter werkt.'
        ],
        feedback: 'Het is dezelfde vraag, maar in een heel andere toon en in een heel andere vorm. Met een aanhef, je naam en klas, hele zinnen en een afsluiting weet je docent meteen wie er iets vraagt.'
      },
      {
        prompt: 'Je krijgt een mail die van de ICT-helpdesk van school lijkt te komen: stuur je wachtwoord terug, anders wordt je account gesloten. Leg uit wat je doet en waaraan je ziet dat dit niet klopt.',
        type: 'open',
        leerdoel: LD_1_2[2],
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        modelAnswer: 'Ik stuur mijn wachtwoord niet terug en ik klik nergens op. Een docent of de ICT-helpdesk vraagt nooit om je wachtwoord, want zij hebben het niet nodig om je te helpen. De dreiging dat mijn account gesloten wordt, is bedoeld om mij te laten haasten. Ik meld het bericht bij mijn docent of mentor en laat de mail staan zodat zij hem kunnen bekijken.',
        nakijkpunten: [
          'Zegt dat het wachtwoord niet teruggestuurd wordt.',
          'Noemt dat school nooit om een wachtwoord vraagt, of noemt de haast als waarschuwingssignaal.',
          'Meldt het bericht bij een docent, mentor of de helpdesk.'
        ],
        feedback: 'Terugblik op 1.2: de helpdesk vraagt je nooit om je wachtwoord, ook niet via een appje. Je stuurt dus niets terug, maar je meldt het bericht wel bij je docent of je mentor.'
      },
      {
        prompt: 'Je hebt je mail verstuurd en wilt aan je docent bewijzen dat het echt gelukt is, dus wat lever je in?',
        leerdoel: LD_1_1[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Een screenshot van je map Verzonden items waarop de mail met datum staat.', correct: true, explanation: 'Daaraan ziet je docent dat het bericht echt weg is, en wanneer je het verstuurd hebt.' },
          { text: 'Een screenshot van het lege scherm Nieuwe e-mail voordat je begon.', correct: false, misconception: 'Bewijst dat je Outlook geopend hebt, niet dat je iets verstuurd hebt.' },
          { text: 'Een berichtje in de klassenapp waarin je zegt dat je hem verstuurd hebt.', correct: false, misconception: 'Verwart vertellen dat iets af is met bewijs dat je docent kan controleren.' },
          { text: 'Niets; je docent ziet de mail toch wel in zijn eigen postvak staan.', correct: false, misconception: 'Gaat ervan uit dat de ontvanger het bewijs voor jou bewaart.' }
        ],
        feedback: 'Terugblik op 1.1: bewijs is iets wat je docent zelf kan openen, ook zonder jouw hulp. Je map Verzonden items met de datum erbij laat zien dat de mail echt verstuurd is.'
      }
    ]
  },

  '1.4': {
    learningGoals: LD_1_4,
    theorie: [
      {
        keyTerms: ['digitale geletterdheid', 'DigiChallenge', 'device'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Iemand thuis vraagt waarom jullie op school les krijgen in iets wat jullie al de hele dag doen. Wat antwoord jij daarop, en welke drie redenen noem je?</p>',
          '<p><strong>Antwoord.</strong> Omdat gebruiken en begrijpen twee heel verschillende dingen zijn, ook al lijkt dat van buitenaf niet zo. Scrollen kan ik prima, maar ik zie niet vanzelf of een bericht klopt of dat mijn account goed beveiligd is. Ik weet ook niet vanzelf hoe ik mijn werkstuk overzichtelijk maak of hoe ik een bron op waarde schat. Digitale geletterdheid leert me drie dingen tegelijk: mijn schoolwerk beter maken, mezelf en mijn gegevens veilig houden, en zien wat online echt is.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['omgangsregels', 'surfen', 'bron', 'cloud'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Voor je informatiecentrum vind je op een website de zin: nepnieuws is nieuws dat expres verzonnen is om mensen te misleiden. Mag jij die zin zo letterlijk op je eigen poster zetten, of moet er iets veranderen?</p>',
          '<p><strong>Antwoord.</strong> Niet letterlijk, want je schrijft hem eerst in je eigen woorden op je kladblaadje op. Bijvoorbeeld zo: hier leer je hoe je ziet of een nieuwsbericht expres verzonnen is om jou te misleiden. Wil je de zin toch precies zo overnemen, zet er dan bij van welke website of organisatie hij komt. Dat is namelijk de bron: de persoon of de organisatie die de tekst geschreven heeft.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Digitale geletterdheid betekent dat je veilig, handig en kritisch omgaat met alles wat digitaal is. Waar je anderen tegenkomt gelden omgangsregels, en online gelden die net zo goed als offline. Wat je op internet vindt schrijf je altijd eerst in je eigen woorden op, zodat je het zelf ook begrijpt. Neem je een stuk toch letterlijk over, dan zet je erbij van welke bron die tekst afkomstig is. Gratis te lezen is niet vrij te gebruiken.</p>',
      keyTerms: ['digitale geletterdheid', 'omgangsregels', 'bron']
    },
    vragen: [
      {
        prompt: 'Wat betekent het begrip digitale geletterdheid precies, zoals het aan het begin van deze paragraaf is uitgelegd?',
        leerdoel: LD_1_4[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Dat je in geheimtaal kunt schrijven op je computer.', correct: false, misconception: 'Leest geletterdheid als iets met letters en codes.' },
          { text: 'Dat je veilig, handig en kritisch omgaat met internet op je laptop, telefoon of ander device.', correct: true, explanation: 'Het gaat om alle digitale apparaten en om drie dingen tegelijk: veilig, handig en kritisch.' },
          { text: 'Dat je de tijd kunt aflezen van een digitale klok.', correct: false, misconception: 'Koppelt het woord digitaal aan een display in plaats van aan digitale media.' },
          { text: 'Dat je op elk digitaal apparaat razendsnel kunt typen zonder ooit naar je toetsenbord te kijken.', correct: false, misconception: 'Verwart één losse vaardigheid met het hele vakgebied.' }
        ],
        feedback: 'Digitale geletterdheid gaat over veilig, handig en kritisch omgaan met alles wat digitaal om je heen is. Blind typen is daar hooguit een klein onderdeel van, en zeker niet de kern.'
      },
      {
        prompt: 'Waarom leer je op school digitale vaardigheden, terwijl je je device de hele dag al gebruikt?',
        leerdoel: LD_1_4[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Zodat ik beter kan gamen en sneller kan typen zonder te kijken.', correct: false, misconception: 'Ziet school-ICT als hetzelfde als wat je in je vrije tijd met een device doet.' },
          { text: 'Zodat ik alleen mijn schoolwerk netter en sneller kan maken.', correct: false, misconception: 'Noemt één van de drie redenen en laat veiligheid en betrouwbaarheid weg.' },
          { text: 'Zodat ik mijn schoolwerk beter maak, mezelf en mijn gegevens veilig houd en zie wat online echt is.', correct: true, explanation: 'Precies de drie redenen uit de les: beter werk, veilig blijven en betrouwbaar van onbetrouwbaar onderscheiden.' },
          { text: 'Zodat ik later verplicht een technische opleiding of een ICT-baan kan kiezen.', correct: false, misconception: 'Denkt dat het vak een beroepskeuze vastlegt.' }
        ],
        feedback: 'Er zijn drie redenen tegelijk: beter schoolwerk, jezelf en je gegevens veilig houden, en kunnen zien wat online wel of niet echt is.'
      },
      {
        prompt: 'Alles wat op internet te vinden is mag je zomaar letterlijk overnemen in je eigen werkstuk.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: false, misconception: 'Denkt dat alles wat vrij te vinden is daarom ook vrij over te nemen is.' },
          { text: 'Niet waar', correct: true, explanation: 'Klopt: je schrijft het in je eigen woorden op, en bij een groot overgenomen stuk noem je erbij wie het geschreven heeft.' }
        ],
        leerdoel: LD_1_4[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Nee. Je schrijft wat je vindt eerst in je eigen woorden op. Neem je toch een groot stuk over, dan noem je erbij wie het geschreven heeft.'
      },
      {
        prompt: 'Leg uit wat een omgangsregel is en bedenk er één die op jouw sociale-mediaplek zou moeten gelden. Schrijf er meteen bij waarom je juist die ene regel gekozen hebt en geen andere.',
        type: 'open',
        leerdoel: LD_1_4[1],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'reflecteren',
        modelAnswer: 'Een omgangsregel is een afspraak over hoe je met elkaar omgaat, zodat iedereen elkaar met respect behandelt. Omgang betekent namelijk: hoe je met elkaar omgaat. Bij mij zou gelden: je zet nooit een foto van iemand anders online zonder het te vragen. Die regel kies ik omdat je zelf niet kunt bepalen wat er daarna met zo\'n foto gebeurt. Je kunt iemand er bovendien heel ongemakkelijk mee maken.',
        nakijkpunten: [
          'Legt uit dat een omgangsregel gaat over hoe je met elkaar omgaat, met respect als kern.',
          'Bedenkt een eigen regel die concreet zegt wat je wel of niet doet.',
          'Onderbouwt waarom juist die regel belangrijk is.'
        ],
        feedback: 'Omgang betekent letterlijk hoe je met elkaar omgaat, en daar gaat een omgangsregel dus over. Een goede omgangsregel zegt wat je doet, en niet alleen wat er allemaal verboden is.'
      },
      {
        prompt: 'In 1.1 sloeg je je werk op in OneDrive. Leg uit waarom je de plaatjes voor je poster beter in OneDrive zet. Waarom is de harde schijf van deze computer een slechter idee?',
        type: 'open',
        leerdoel: LD_1_1[0],
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        modelAnswer: 'OneDrive is een cloud: mijn bestanden staan op een netwerk op internet en niet op dat ene apparaat. Log ik thuis of in een ander lokaal in met mijn schoolaccount, dan staan mijn plaatjes er gewoon. Sla ik ze op de harde schijf op, dan blijven ze achter op die ene computer. Morgen kan ik er dan niet meer bij, zeker niet als iemand anders daar zit.',
        nakijkpunten: [
          'Legt uit dat de cloud een netwerk op internet is en niet het apparaat zelf.',
          'Noemt dat je er op elke computer bij kunt waarop je inlogt.',
          'Noemt het nadeel van lokaal opslaan: het blijft achter op dat ene apparaat.'
        ],
        feedback: 'Terugblik op 1.1: OneDrive staat in de cloud, dus je opent overal precies hetzelfde bestand. Wat op de harde schijf staat blijft achter op dat ene apparaat, ook als je het nodig hebt.'
      },
      {
        prompt: 'Je poster is af, maar je docent is er vandaag niet en jij wilt hem toch iets vragen. Welke van deze mails heeft de meeste kans op een snel en bruikbaar antwoord van hem?',
        leerdoel: LD_1_3[1],
        denkniveau: 'toepassen',
        niveau: 'verdieping',
        rol: 'zelf_proberen',
        options: [
          { text: 'Onderwerp leeg, bericht: poster af, kijken?', correct: false, misconception: 'Denkt dat een mail net zo kort mag zijn als een appje.' },
          { text: 'Onderwerp: URGENT, met het hele bericht in hoofdletters zodat er zo snel mogelijk gereageerd wordt.', correct: false, misconception: 'Denkt dat schreeuwen in een mail meer haast oplevert.' },
          { text: 'Onderwerp: hoi. Bericht: meneer ik heb hem af hoor, groetjes.', correct: false, misconception: 'Schrijft wel iets, maar zonder naam, klas of duidelijke vraag.' },
          { text: 'Onderwerp: poster DigiChallenge 1, Sam de Wit 1A. Bericht met aanhef, je vraag en een afsluiting.', correct: true, explanation: 'Aan het onderwerp ziet je docent al waar het over gaat en van wie het komt. In het bericht staat daarna precies wat je vraagt.' }
        ],
        feedback: 'Terugblik op 1.3: een goed onderwerp vertelt waar het over gaat en van wie het komt. De aanhef en de afsluiting maken er daarna een net bericht van.'
      }
    ]
  },

  '1.5': {
    learningGoals: LD_1_5,
    theorie: [
      {
        keyTerms: ['ict-basisvaardigheden', 'informatievaardigheden', 'mediawijsheid', 'computational thinking'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Bij welk van de vier stukken hoort wat je in dit hoofdstuk deed: inloggen, mailen, een screenshot inleveren en een poster met omgangsregels maken?</p>',
          '<p><strong>Antwoord.</strong> Het eerste rijtje hoort bij de ict-basisvaardigheden, want je leert daar vooral de apparaten en de systemen bedienen. Je poster ging verder dan alleen bedienen, en raakte daardoor nog twee andere stukken van het vak. Bij het informatiecentrum bedacht je hoe mensen betrouwbare informatie vinden, en dat hoort bij de informatievaardigheden. De omgangsregels bij je sociale-mediaplek horen bij mediawijsheid, want die gaan over bewust omgaan met elkaar online. Computational thinking kwam nog nauwelijks aan bod, en dat begint zodra je een probleem in losse stappen gaat opdelen. Eén hoofdstuk kan dus meerdere stukken tegelijk raken, met steeds één stuk als duidelijk zwaartepunt.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['controlelijst', 'Digidocent'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Tarik zegt: ik heb alles gedaan, maar ik heb niets om in te leveren. Hoe komt hij alsnog aan zijn checkpointmap zonder het hele hoofdstuk opnieuw te maken?</p>',
          '<p><strong>Antwoord.</strong> Hij loopt met een controlelijst de vier paragrafen langs en vinkt af wat hij al in huis heeft. Zijn poster staat er nog, dus daar maakt hij vandaag gewoon een foto van met zijn telefoon. Van SOMtoday maakt hij alsnog een schermafdruk, en zijn verstuurde mail staat gewoon in zijn map Verzonden items. Alleen zijn wachtwoordkaart moet hij echt opnieuw maken, want de rest was er al en was alleen nog niet verzameld.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Hoofdstuk 1 was de bodem onder de rest van het jaar: inloggen, je weg vinden, mailen en inleveren. Wie dat kan levert bewijs in plaats van beloftes, met een schermafdruk of met een ingeleverd bestand. Bewijs is wat een ander zelf kan openen. Je werkte hier vooral aan de ict-basisvaardigheden, en de andere drie stukken komen in de hoofdstukken hierna uitgebreid terug.</p>',
      keyTerms: ['schermafdruk', 'ict-basisvaardigheden']
    },
    vragen: [
      {
        prompt: 'Welke twee gegevens heb je nodig om op een schoolcomputer van DaCapo College in te loggen?',
        leerdoel: LD_1_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je leerlingnummer en je zelfgekozen wachtwoord.', correct: true, explanation: 'Het leerlingnummer is de gebruikersnaam, het wachtwoord koos je zelf en bewaar je veilig.' },
          { text: 'Je volledige naam en je geboortedatum.', correct: false, misconception: 'Denkt dat school je herkent aan je persoonsgegevens.' },
          { text: 'Je schoolmailadres en de code van het wifi-netwerk.', correct: false, misconception: 'Plakt twee losse inloggegevens aan elkaar tot één set.' },
          { text: 'Alleen je wachtwoord, want de computer weet al wie je bent.', correct: false, misconception: 'Denkt dat een gedeelde computer in het lokaal jou onthoudt.' }
        ],
        feedback: 'Twee dingen: het deel vóór de @ als gebruikersnaam, en het wachtwoord dat je zelf gekozen hebt en veilig bewaart.'
      },
      {
        prompt: 'Op het wifi van school kom je niet vanzelf. Je kiest eerst het netwerk in de lijst en vult daarna in wat school je vraagt.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: true, explanation: 'Klopt: netwerk kiezen, op Verbinden klikken, invullen wat er gevraagd wordt en daarna het certificaat accepteren.' },
          { text: 'Niet waar', correct: false, misconception: 'Denkt dat het wifi van school vanzelf aan staat en dat je daarvoor niets hoeft in te vullen.' }
        ],
        leerdoel: LD_1_1[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Netwerk kiezen, Verbinden, invullen wat gevraagd wordt, certificaat accepteren: die volgorde is overal hetzelfde. Bij DaCapo zijn dat je schoolgegevens, maar draait jouw locatie een aparte wificode, vraag die dan even aan je docent.'
      },
      {
        prompt: 'In de ELO van SOMtoday lever je opdrachten in en vind je het lesmateriaal dat je docent deelt.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: true, explanation: 'Klopt: de ELO is de leeromgeving binnen SOMtoday, waar docenten materiaal delen en jij je werk inlevert.' },
          { text: 'Niet waar', correct: false, misconception: 'Haalt de ELO en het cijferoverzicht door elkaar en zoekt opdrachten dus bij de cijferadministratie.' }
        ],
        leerdoel: LD_1_1[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. De ELO is de elektronische leeromgeving binnen SOMtoday: docenten delen er materiaal en jij levert er je werk in.'
      },
      {
        prompt: 'Waar zet je aan dat je een melding krijgt zodra er een nieuw cijfer is ingevoerd?',
        leerdoel: LD_1_1[1],
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'In de ELO, bij de instellingen van het vak waar het cijfer voor telt.', correct: false, misconception: 'Zoekt cijfers in de leeromgeving in plaats van in de administratie.' },
          { text: 'In OneDrive, bij de instellingen van je map.', correct: false, misconception: 'Denkt dat een opslagplek ook je cijfers bijhoudt.' },
          { text: 'Bij je eigen instellingen in SOMtoday, onder het kopje Meldingen.', correct: true, explanation: 'Meldingen horen bij jouw eigen instellingen, want jij bepaalt waarover jij bericht wilt krijgen.' },
          { text: 'Dat kan niet; je docent moet het je zelf laten weten.', correct: false, misconception: 'Weet niet dat je meldingen zelf kunt instellen en wacht daarom af.' }
        ],
        feedback: 'Meldingen staan niet vanzelf aan, dus daar moet je zelf één keer iets voor doen. Je zet ze aan in SOMtoday, apart voor nieuwe cijfers en apart voor roosterwijzigingen. Ziet jouw menu er anders uit, zoek dan op het woord Meldingen; dat staat er altijd.'
      },
      {
        prompt: 'Welke toetscombinatie knipt op Windows een deel van je scherm en zet dat op het klembord?',
        leerdoel: LD_1_1[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ctrl en P, net als bij printen.', correct: false, misconception: 'Denkt aan printen, omdat dat ook iets met een afbeelding van je scherm lijkt.' },
          { text: 'Shift en Delete, net als bij wissen.', correct: false, misconception: 'Kiest een toetscombinatie die juist iets verwijdert in plaats van vastlegt.' },
          { text: 'Ctrl, Shift en N, net als bij een nieuw venster.', correct: false, misconception: 'Verwart de sneltoets voor een nieuw venster met die voor een schermknip.' },
          { text: 'De Windows-toets, Shift en S.', correct: true, explanation: 'Het scherm wordt grijs, je sleept een vak en het geknipte beeld staat op je klembord.' }
        ],
        feedback: 'De Windows-toets, Shift en S samen openen het knipgereedschap waarmee je een stuk scherm knipt. Op een Chromebook knip je een deel met Ctrl, Shift en de vensterwisseltoets; zonder Shift pak je het hele scherm.'
      },
      {
        prompt: 'Leg uit waarom een screenshot beter bewijs is dan tegen je docent zeggen dat je opdracht af is.',
        type: 'open',
        leerdoel: LD_1_1[2],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Een screenshot laat zien wat er echt op mijn scherm stond, met de bevestiging en de datum erop. Mijn docent kan dat later openen, ook als ik er niet bij ben en mijn laptop thuis ligt. Als ik het alleen vertel, moet hij mij op mijn woord geloven en kan hij niets nakijken. Bewijs is dus iets dat blijft staan en dat een ander zelf kan controleren.',
        nakijkpunten: [
          'Noemt dat een screenshot laat zien wat er werkelijk op het scherm stond.',
          'Noemt dat de docent het later en zonder de leerling kan bekijken.',
          'Maakt het verschil duidelijk tussen vertellen en aantoonbaar bewijs.'
        ],
        feedback: 'Vertellen dat het gelukt is blijft een belofte, terwijl een screenshot echt bewijs levert. Het verschil is of iemand anders het zelf kan controleren wanneer het hem uitkomt.'
      },
      {
        prompt: 'Welke wachtwoordzin zou jij een klasgenoot aanraden die zijn oude, veel te korte wachtwoord wil vervangen?',
        leerdoel: LD_1_2[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Zijn achternaam met het jaar waarin hij geboren is erachter.', correct: false, misconception: 'Kiest iets persoonlijks omdat het makkelijk te onthouden is.' },
          { text: 'De naam van zijn favoriete voetbalclub met een uitroepteken erachter.', correct: false, misconception: 'Denkt dat een leesteken het probleem van een raadbare naam oplost.' },
          { text: 'Vier woorden die niets met elkaar en niets met hem te maken hebben.', correct: true, explanation: 'Vier losse woorden zijn samen lang, en omdat ze niets met hem te maken hebben zijn ze niet te raden.' },
          { text: 'Hetzelfde wachtwoord dat hij ook voor zijn spelaccount gebruikt.', correct: false, misconception: 'Ziet hergebruik niet als risico zolang het wachtwoord zelf goed lijkt.' }
        ],
        feedback: 'Vier losse woorden zijn samen lang en zeggen niets persoonlijks over de eigenaar ervan. Alles wat het schoolplein over iemand weet, hoort niet in zijn wachtwoord te staan.'
      },
      {
        prompt: 'Een kort wachtwoord met veel vreemde tekens erin is altijd sterker dan een lange wachtwoordzin.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: false, misconception: 'Denkt dat vreemde tekens zwaarder wegen dan lengte, omdat zo\'n wachtwoord er moeilijker uitziet.' },
          { text: 'Niet waar', correct: true, explanation: 'Klopt: lengte weegt zwaarder, en vier losse woorden halen die twaalf tekens zonder moeite.' }
        ],
        leerdoel: LD_1_2[0],
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        feedback: 'Het is precies andersom, want lengte weegt zwaarder dan het aantal tekensoorten dat je gebruikt. Twaalf tekens of meer is het doel, en vier losse woorden halen dat zonder enige moeite.'
      },
      {
        prompt: 'Leg uit waarom een wachtwoordkluis veiliger is dan een briefje in je etui. Noem daarbij één ding dat je moet regelen voordat je zo\'n kluis gebruikt.',
        type: 'open',
        leerdoel: LD_1_2[1],
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        modelAnswer: 'In een kluis staan mijn wachtwoorden achter één slot dat alleen ik kan openen, en niemand kan ze lezen door mijn tas open te maken. Een briefje in mijn etui ligt open zodra ik mijn etui op tafel leg, en het kan ook zomaar kwijtraken. Voordat ik een kluis gebruik moet ik één heel sterk hoofdwachtwoord bedenken dat ik echt onthoud. Ben ik dat hoofdwachtwoord kwijt, dan kan ik nergens meer bij.',
        nakijkpunten: [
          'Noemt dat de kluis alles achter één slot zet dat alleen de eigenaar kan openen.',
          'Noemt het nadeel van het briefje: anderen kunnen het vinden of het raakt kwijt.',
          'Noemt iets dat vooraf geregeld moet zijn, zoals een sterk hoofdwachtwoord of een herstelroute.'
        ],
        feedback: 'Een kluis zet alles achter één slot dat jij alleen kent; een briefje ligt open zodra je etui openligt. Regel wel eerst een hoofdwachtwoord dat je echt onthoudt en dat je nergens anders gebruikt.'
      },
      {
        prompt: 'Je bent thuis je schoolwachtwoord vergeten en je moet vanavond nog een opdracht inleveren. Wat is je allereerste stap, nu er vanavond niemand van school voor jou bereikbaar is?',
        leerdoel: LD_1_2[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je vraagt aan een klasgenoot of je vandaag even met zijn eigen account mag inloggen.', correct: false, misconception: 'Lost het op via iemand anders, waardoor het werk op diens naam komt te staan.' },
          { text: 'Je gaat naar het wachtwoordportaal van school en stelt zelf een nieuw wachtwoord in.', correct: true, explanation: 'Daarvoor maakte je in 1.2 juist een account aan: het portaal is je eigen herstelroute.' },
          { text: 'Je wacht tot morgen en legt het dan in de les uit.', correct: false, misconception: 'Denkt dat er buiten schooltijd niets te regelen valt.' },
          { text: 'Je maakt een nieuw account aan met je privémailadres.', correct: false, misconception: 'Denkt dat een leerling zelf een tweede schoolaccount kan aanmaken.' }
        ],
        feedback: 'Het wachtwoordportaal van school is precies voor deze situatie bedoeld en helpt je meteen verder. Kom je er niet uit, dan meld je het morgen bij je docent of bij de ICT-helpdesk.'
      },
      {
        prompt: 'Een klasgenoot vraagt jou om je wachtwoord omdat hij snel nog iets moet inleveren. Wat doe je in die situatie, en wat bied je hem in plaats daarvan aan?',
        leerdoel: LD_1_2[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Je geeft het, maar je verandert het meteen daarna weer.', correct: false, misconception: 'Denkt dat het risico verdwijnt zodra je het wachtwoord later aanpast.' },
          { text: 'Je geeft het alleen als hij eerst belooft dat hij niets anders zal openen.', correct: false, misconception: 'Vertrouwt op een belofte terwijl de verantwoordelijkheid bij jou blijft liggen.' },
          { text: 'Je typt het zelf in, dan hoeft hij het niet te weten.', correct: false, misconception: 'Denkt dat het niet delen van de letters het probleem oplost, terwijl hij toch onder jouw naam werkt.' },
          { text: 'Je geeft het niet en wijst hem het wachtwoordportaal of de helpdesk.', correct: true, explanation: 'Alles wat er onder jouw account gebeurt staat op jouw naam, en hij kan zijn eigen toegang gewoon herstellen.' }
        ],
        feedback: 'Iemand helpen mag altijd, maar je eigen sleutel afgeven hoort daar echt nooit bij. Zijn eigen toegang herstellen duurt vijf minuten en dan staat zijn werk ook echt op zijn naam.'
      },
      {
        prompt: 'De ICT-helpdesk van school mag jou gerust vragen om je eigen wachtwoord door te geven.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: false, misconception: 'Denkt dat iemand met een officiële functie daarmee ook recht heeft op jouw wachtwoord.' },
          { text: 'Niet waar', correct: true, explanation: 'Klopt: de helpdesk heeft jouw wachtwoord niet nodig en vraagt er daarom ook nooit om.' }
        ],
        leerdoel: LD_1_2[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'De helpdesk heeft jouw wachtwoord helemaal niet nodig om jou goed te kunnen helpen. Wie er toch om vraagt, is dus geen helpdesk maar iemand die jouw account wil hebben.'
      },
      {
        prompt: 'Lees deze mail van Ilias uit 1B: "Beste meneer Jansen, mijn naam is Ilias uit 1B, en wanneer moet ik de opdracht inleveren?" Welk onderdeel ontbreekt hier?',
        leerdoel: LD_1_3[0],
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'De aanhef, dus de regel Beste meneer Jansen.', correct: false, misconception: 'Herkent Beste meneer Jansen niet als de aanhef.' },
          { text: 'Het voorstellen, dus wie de schrijver is.', correct: false, misconception: 'Leest mijn naam is Ilias uit 1B niet als het voorstelrondje.' },
          { text: 'De afsluiting met je naam en je klas.', correct: true, explanation: 'De mail stopt na de vraag; onderaan hoort Met vriendelijke groet met daaronder naam en klas.' },
          { text: 'De vraag over wanneer hij moet inleveren.', correct: false, misconception: 'Ziet de vraagzin over het inleveren over het hoofd.' }
        ],
        feedback: 'Deze mail eindigt midden in de lucht, want er staat helemaal geen afsluiting onder. Onderaan hoort Met vriendelijke groet te staan, met daaronder op twee regels je naam en je klas.'
      },
      {
        prompt: 'Waar typ je het onderwerp van je mail, en waar ziet je docent dat onderwerp terug?',
        leerdoel: LD_1_3[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'In een eigen veld boven het bericht, onder het veld Aan.', correct: true, explanation: 'Het onderwerp staat buiten het bericht zelf en verschijnt in de lijst van de ontvanger.' },
          { text: 'Als eerste zin van je bericht, op de regel vlak boven de aanhef.', correct: false, misconception: 'Denkt dat het onderwerp gewoon de eerste regel van de tekst is.' },
          { text: 'Achter je naam in de afsluiting.', correct: false, misconception: 'Verwart het onderwerp met de ondertekening onderaan.' },
          { text: 'In het veld Aan, achter het mailadres.', correct: false, misconception: 'Denkt dat alles boven het bericht bij de ontvanger hoort.' }
        ],
        feedback: 'Het onderwerp heeft een eigen veld, vlak boven de plek waar je je bericht intypt. Daaraan ziet de ontvanger in zijn lijst al waar je bericht over gaat, zonder het te openen.'
      },
      {
        prompt: 'Leg uit wat er misgaat als je je docent mailt zonder hoofdletters en zonder punten. Noem in je antwoord twee gevolgen die dat voor de lezer van je mail heeft.',
        type: 'open',
        leerdoel: LD_1_3[1],
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'reflecteren',
        modelAnswer: 'Zonder hoofdletters en punten loopt alles aan elkaar vast en moet mijn docent zoeken waar mijn vraag begint en eindigt. Het eerste gevolg is dus dat hij mijn vraag verkeerd of half leest, waardoor het antwoord niet klopt. Het tweede gevolg is dat het slordig overkomt: het lijkt alsof ik er geen moeite voor over had. Een appje aan een vriend mag zo, maar een mail aan een docent leest iemand die mij nog niet kent.',
        nakijkpunten: [
          'Noemt als gevolg dat de tekst moeilijker te lezen of te begrijpen is.',
          'Noemt als tweede gevolg iets over de indruk die je maakt.',
          'Maakt het verschil duidelijk tussen een appje en een schoolmail.'
        ],
        feedback: 'Twee dingen gaan mis: je bericht wordt lastiger te lezen, en de lezer trekt een conclusie over jou die je niet bedoeld had.'
      },
      {
        prompt: 'In een mail aan je docent schrijf je woorden als effe en inderdaad voluit, in plaats van ff en idd.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: true, explanation: 'Klopt: je schrijft de woorden voluit, want afkortingen uit een groepsapp horen niet in een mail aan een docent.' },
          { text: 'Niet waar', correct: false, misconception: 'Denkt dat afkortingen die iedereen begrijpt overal mogen, ook bij iemand die jou nog niet kent.' }
        ],
        leerdoel: LD_1_3[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Ja, je schrijft de woorden helemaal uit in plaats van ze zoals in een appje af te korten. Afkortingen uit een groepsapp horen niet in een bericht aan iemand die jou nog niet kent.'
      },
      {
        prompt: 'Als je het mailadres van je docent niet weet, stuur je je mail naar het algemene adres van school.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: false, misconception: 'Denkt dat het algemene adres van school de mail wel even doorstuurt naar de juiste docent.' },
          { text: 'Niet waar', correct: true, explanation: 'Klopt: je typt de achternaam bij Aan, en Outlook stelt zelf het juiste adres voor.' }
        ],
        leerdoel: LD_1_3[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Niet nodig. Typ de achternaam bij Aan, dan stelt Outlook het juiste adres voor en komt je vraag meteen bij de goede persoon.'
      },
      {
        prompt: 'Je typt bij Aan de achternaam Peeters en er verschijnen drie verschillende namen in de lijst. Wat doe je dan, zodat je mail bij precies de juiste docent aankomt?',
        leerdoel: LD_1_3[2],
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je kiest gewoon de bovenste regel, want die stelt Outlook zelf als eerste aan jou voor.', correct: false, misconception: 'Denkt dat de bovenste suggestie altijd de juiste persoon is.' },
          { text: 'Je stuurt de mail naar alle drie, dan komt hij zeker aan.', correct: false, misconception: 'Lost twijfel op door twee onbekenden mee te laten lezen.' },
          { text: 'Je kijkt welke voorletter en welk adres bij jouw docent horen en klikt die regel aan.', correct: true, explanation: 'In SOMtoday zie je de voorletter van je eigen docent, en daarmee kies je de goede.' },
          { text: 'Je typt het adres dan maar zelf helemaal uit.', correct: false, misconception: 'Kiest juist de weg waarop een typefout ontstaat, terwijl het adresboek klaarstaat.' }
        ],
        feedback: 'Op een grote school werken vaker meer mensen met precies dezelfde achternaam naast elkaar. De voorletter uit SOMtoday wijst je de goede persoon vanzelf aan.'
      },
      {
        prompt: 'Leg in je eigen woorden uit wat digitale geletterdheid betekent en noem twee redenen waarom je het leert.',
        type: 'open',
        leerdoel: LD_1_4[0],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        modelAnswer: 'Digitale geletterdheid betekent dat je veilig, handig en kritisch omgaat met internet op je laptop, je telefoon of een ander device. De eerste reden om het te leren is dat ik mijn schoolwerk er beter mee maak, bijvoorbeeld een verslag met koppen en bronnen. De tweede reden is dat ik mezelf en mijn gegevens veilig kan houden, zoals met een sterk wachtwoord dat ik niet weggeef.',
        nakijkpunten: [
          'Geeft een eigen omschrijving waarin veilig omgaan met digitale apparaten terugkomt.',
          'Noemt twee van de drie redenen: beter schoolwerk, veiligheid of zien wat echt is.',
          'Geeft bij minstens één reden een concreet voorbeeld.'
        ],
        feedback: 'Een sterk antwoord blijft niet bij het woord veilig, maar laat met een voorbeeld zien wat je er in de praktijk mee doet.'
      },
      {
        prompt: 'Welke van deze vier hoort NIET bij digitale geletterdheid zoals je die in dit hoofdstuk leerde?',
        leerdoel: LD_1_4[0],
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'Kunnen zien of een bericht online betrouwbaar is.', correct: false, misconception: 'Herkent kritisch kijken niet als een deel van het vak.' },
          { text: 'Weten hoe je je eigen account beveiligt.', correct: false, misconception: 'Denkt dat veiligheid een apart vak is en niet bij dit vak hoort.' },
          { text: 'Je schoolwerk digitaal netjes kunnen maken en op tijd inleveren.', correct: false, misconception: 'Ziet het maken van schoolwerk als iets anders dan digitale vaardigheden.' },
          { text: 'Zo snel mogelijk een spel kunnen uitspelen op je telefoon.', correct: true, explanation: 'Snel gamen is geen leerdoel van dit vak; de andere drie zijn juist precies de drie redenen uit de les.' }
        ],
        feedback: 'De drie andere antwoorden zijn precies de drie redenen die in de les genoemd worden. Een spel uitspelen zegt niets over veilig, handig of kritisch omgaan met internet, dus dat valt af.'
      },
      {
        prompt: 'Wat is een omgangsregel, en waar heb jij er in dit hoofdstuk zelf drie bedacht?',
        leerdoel: LD_1_4[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een wet die de overheid maakt voor internet.', correct: false, misconception: 'Verwart een afspraak tussen mensen met een wet van de overheid.' },
          { text: 'Een instelling in een app waarmee je vervelende mensen kunt blokkeren en melden.', correct: false, misconception: 'Denkt dat een knop in de app hetzelfde is als een afspraak tussen mensen.' },
          { text: 'Regels die zeggen wat je wel en niet mag doen op school, zoals de schoolregels.', correct: false, misconception: 'Denkt aan de schoolregels, want dat zijn de enige regels die ooit hardop zijn voorgelezen.' },
          { text: 'Een afspraak over hoe je met elkaar omgaat, zodat iedereen elkaar met respect behandelt.', correct: true, explanation: 'Omgang betekent letterlijk hoe je met elkaar omgaat, en die afspraak geldt online net zo goed.' }
        ],
        feedback: 'Een omgangsregel gaat over het gedrag tussen mensen en niet over de techniek erachter. Jij bedacht er in 1.4 zelf drie voor de sociale-mediaplek op je eigen poster.'
      },
      {
        prompt: 'Omgangsregels gelden in een groepsapp met je eigen vrienden net zo goed als op school.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: true, explanation: 'Klopt: overal waar mensen elkaar tegenkomen gelden omgangsregels, en online net zo hard als in de klas.' },
          { text: 'Niet waar', correct: false, misconception: 'Denkt dat omgangsregels alleen door school worden opgelegd en daarbuiten dus niet gelden.' }
        ],
        leerdoel: LD_1_4[1],
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'reflecteren',
        feedback: 'Overal waar mensen elkaar tegenkomen gelden omgangsregels, en online geldt dat net zo hard. Doordat je elkaars gezicht niet ziet, gaat het daar zelfs sneller mis dan in de klas.'
      },
      {
        prompt: 'Je gebruikt voor je poster een alinea die je letterlijk van een website hebt gekopieerd. Wat moet je daarmee doen voordat die alinea op jouw poster terecht mag komen?',
        leerdoel: LD_1_4[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De tekst in je eigen woorden opschrijven, en neem je hem toch over, dan de bron erbij noemen.', correct: true, explanation: 'Eigen woorden is de hoofdregel; bij een letterlijk overgenomen stuk hoort de bron erbij.' },
          { text: 'Niets, want alles wat op internet staat is gratis te gebruiken.', correct: false, misconception: 'Verwart gratis te lezen met vrij te gebruiken.' },
          { text: 'De zinnen door elkaar husselen, dan is het niet meer overgenomen.', correct: false, misconception: 'Denkt dat woorden verplaatsen hetzelfde is als iets in eigen woorden schrijven.' },
          { text: 'Er google.com onder zetten, want daar heb je die alinea tenslotte gevonden.', correct: false, misconception: 'Noteert de zoekmachine als bron in plaats van de organisatie die de tekst geschreven heeft.' }
        ],
        feedback: 'Je schrijft wat je vindt eerst in je eigen woorden op, want dan begrijp je het zelf ook. Neem je toch een groot stuk letterlijk over, dan hoort de bron erbij: de persoon of organisatie die het schreef.'
      },
      {
        prompt: 'Google is altijd de bron van een tekst die je via die zoekmachine gevonden hebt.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: false, misconception: 'Verwart de zoekmachine waarmee je iets vindt met de persoon of organisatie die het geschreven heeft.' },
          { text: 'Niet waar', correct: true, explanation: 'Klopt: Google laat je de tekst vinden, maar de bron is degene die de tekst zelf gemaakt heeft.' }
        ],
        leerdoel: LD_1_4[2],
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'zelf_proberen',
        feedback: 'Google is de zoekmachine die je de tekst laat vinden, maar niet de schrijver ervan. De bron is altijd de persoon of de organisatie die de tekst zelf gemaakt heeft.'
      },
      {
        prompt: 'Wat telt als bewijs dat jij een opdracht uit hoofdstuk 1 ook werkelijk gedaan hebt?',
        leerdoel: LD_1_5[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Dat je het aan je buurman verteld hebt.', correct: false, misconception: 'Denkt dat vertellen dat iets af is hetzelfde is als bewijs.' },
          { text: 'Een schermafdruk, een verstuurde mail of een ingeleverd bestand.', correct: true, explanation: 'Dat zijn alle drie dingen die je docent zelf kan bekijken, ook als jij er niet bij bent.' },
          { text: 'Dat het bestand ergens op de computer van het lokaal opgeslagen staat.', correct: false, misconception: 'Denkt dat opslaan op een schoolcomputer al inleveren is.' },
          { text: 'Dat je de opdracht in je agenda hebt afgevinkt.', correct: false, misconception: 'Verwart de eigen planning met bewijs voor iemand anders.' }
        ],
        feedback: 'Bewijs is iets wat je docent kan bekijken zonder erbij te zitten: een beeld, een bericht of een bestand op de juiste plek.'
      },
      {
        prompt: 'Je bent volgende week je wachtwoord kwijt en moet die dag nog een opdracht inleveren. Beschrijf stap voor stap wat je doet, vanaf het moment dat inloggen mislukt tot het moment dat je werk binnen is.',
        type: 'open',
        leerdoel: LD_1_5[0],
        denkniveau: 'maken_controleren',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Eerst probeer ik het rustig nog een keer, voor het geval ik me vertypte. Lukt het dan nog niet, dan ga ik naar het wachtwoordportaal van school om zelf een nieuw wachtwoord in te stellen; kom ik daar niet uit, dan meld ik het bij mijn docent of bij de ICT-helpdesk. Daarna log ik in met mijn nieuwe wachtwoord en zet ik het meteen in mijn wachtwoordkluis. Vervolgens open ik in SOMtoday de ELO, zoek ik de opdracht op en lever ik mijn bestand daar in. Als bewijs maak ik een schermafdruk van het ingeleverde werk.',
        nakijkpunten: [
          'Noemt de herstelroute: wachtwoordportaal, docent of ICT-helpdesk.',
          'Noemt het inleveren via de ELO van SOMtoday en het veilig bewaren van het nieuwe wachtwoord.',
          'De stappen staan in een logische volgorde en het account van een ander wordt nergens gebruikt.'
        ],
        feedback: 'De route loopt via het wachtwoordportaal of de helpdesk, dan inloggen, en dan pas inleveren. Wachten tot morgen of het account van een ander lenen staan niet in die route.'
      },
      {
        prompt: 'Schrijf in vijf tot acht zinnen en in je eigen woorden op wat digitale geletterdheid voor jou betekent. Gebruik minstens twee dingen die je in dit hoofdstuk gedaan hebt als voorbeeld.',
        type: 'open',
        leerdoel: LD_1_5[1],
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'reflecteren',
        modelAnswer: 'Digitale geletterdheid betekent voor mij dat ik zelf de baas ben over wat ik digitaal doe, in plaats van maar wat te klikken. Ik kan nu inloggen op school en ik weet waar ik moet zijn voor mijn rooster en voor mijn opdrachten. Ik heb een wachtwoordzin gemaakt en snap waarom die veel sterker is dan de naam van mijn hond. Ook heb ik een nette mail aan mijn docent gestuurd; daarvoor appte ik alleen maar. Op mijn poster heb ik omgangsregels bedacht, want online geldt net zo goed hoe je met elkaar omgaat.',
        nakijkpunten: [
          'Geeft een eigen omschrijving van digitale geletterdheid, niet alleen de zin uit het boek.',
          'Gebruikt minstens twee concrete voorbeelden uit hoofdstuk 1.',
          'Schrijft vijf tot acht hele zinnen met hoofdletters en punten.'
        ],
        feedback: 'Een goed antwoord blijft niet steken bij de definitie uit het boek of uit de les. Het laat aan je eigen voorbeelden zien wat je nu kunt wat je in de zomer nog niet kon.'
      },
      {
        prompt: 'Digitale geletterdheid bestaat uit vier stukken die allemaal een eigen naam hebben, dus welk rijtje klopt?',
        leerdoel: LD_1_5[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Typen, zoeken, presenteren en zelf leren programmeren met blokken.', correct: false, misconception: 'Noemt vier losse vaardigheden uit de lessen in plaats van de vier gebieden van het vak.' },
          { text: 'Ict-basisvaardigheden, informatievaardigheden, mediawijsheid en computational thinking.', correct: true, explanation: 'Precies deze vier: de apparaten bedienen, goed zoeken en bronnen wegen, bewust omgaan met media, en problemen in stappen opdelen.' },
          { text: 'Hardware, software, internet, online veiligheid en het gebruik van allerlei sociale media.', correct: false, misconception: 'Verwart de onderwerpen van hoofdstuk 2 en 3 met de indeling van het hele vak.' },
          { text: 'Inloggen, mailen, inleveren en samenwerken in de leeromgeving van school.', correct: false, misconception: 'Noemt de handelingen uit hoofdstuk 1, die samen maar één van de vier stukken vullen.' }
        ],
        feedback: 'Het vak bestaat uit vier stukken, en die heten ict-basisvaardigheden, informatievaardigheden, mediawijsheid en computational thinking. In dit eerste hoofdstuk werkte je vooral aan het eerste van die vier, de ict-basisvaardigheden.'
      },
      {
        prompt: 'Bij welk van de vier stukken van digitale geletterdheid hoort het bedenken van omgangsregels voor je sociale-mediaplek?',
        leerdoel: LD_1_5[1],
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'reflecteren',
        options: [
          { text: 'Bij mediawijsheid, want dat gaat over bewust omgaan met media en met elkaar.', correct: true, explanation: 'Omgangsregels gaan over gedrag en over wat je deelt, en dat is precies waar mediawijsheid over gaat.' },
          { text: 'Bij de ict-basisvaardigheden, want je had er een computer en een app voor nodig.', correct: false, misconception: 'Kijkt naar het gereedschap in plaats van naar waar de opdracht inhoudelijk over ging.' },
          { text: 'Bij computational thinking, want je moest de regels in stappen opschrijven.', correct: false, misconception: 'Verwart een lijstje maken met een probleem opdelen in stappen voor een computer.' },
          { text: 'Bij de informatievaardigheden, want je zocht er informatie voor op.', correct: false, misconception: 'Ziet het opzoeken van inspiratie aan voor de kern van de opdracht.' }
        ],
        feedback: 'Omgangsregels horen duidelijk bij mediawijsheid, want die gaan over hoe je met elkaar omgaat. Je informatiecentrum raakte de informatievaardigheden, en de inlogronde uit 1.1 de ict-basisvaardigheden.'
      },
      {
        prompt: 'Welke terugblik laat het beste zien dat iemand digitaal echt op eigen kracht kan werken?',
        leerdoel: LD_1_5[1],
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        options: [
          { text: 'Alles ging vanzelf, ik heb nooit hulp nodig gehad.', correct: false, misconception: 'Denkt dat op eigen kracht werken betekent dat je nooit vastloopt.' },
          { text: 'Ik weet nu waar ik moet zijn, ik probeer het eerst zelf en ik vraag op tijd hulp.', correct: true, explanation: 'Precies de drie dingen uit de les: de weg kennen, zelf proberen en op tijd om hulp vragen.' },
          { text: 'Mijn buurman heeft het voor mij gedaan, dus het is af.', correct: false, misconception: 'Verwart een afgerond product met eigen kunnen.' },
          { text: 'Ik heb alles netjes opgeschreven in mijn agenda, dus ik weet precies wat er moet gebeuren.', correct: false, misconception: 'Denkt dat plannen alleen al bewijst dat het ook gelukt is.' }
        ],
        feedback: 'Op eigen kracht werken is niet hetzelfde als alles helemaal in je eentje moeten doen. Het betekent: de weg kennen, zelf beginnen en op tijd zelf aan de bel trekken.'
      }
    ]
  },

  '1.6': {
    learningGoals: LD_1_6,
    theorie: [
      {
        keyTerms: ['gebruikersnaam', 'server', 'hash'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Een website mailt je: "Uw wachtwoord is: zomer2026." Wat weet je op dat moment meteen over die website?</p>',
          '<p><strong>Antwoord.</strong> Dat hij jouw wachtwoord gewoon leesbaar bewaart, want anders had hij het nooit kunnen opzoeken en mailen. Een goed beveiligde dienst kán je wachtwoord helemaal niet terugsturen, want hij heeft alleen de afdruk ervan. Die afdruk is niet terug te rekenen naar het wachtwoord, hoe hard een computer er ook op zou rekenen. Zo\'n slordige site raakt bij een inbraak dus in één klap alle wachtwoorden van al zijn gebruikers kwijt.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['verificatiecode', 'ingewikkeldheid'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Reken mee: hoeveel mogelijkheden zijn er bij drie kleine letters, en hoeveel worden het er bij vier?</p>',
          '<p><strong>Antwoord.</strong> Drie posities met elk 26 letters geeft 26 × 26 × 26, en dat zijn 17.576 mogelijkheden bij elkaar. Eén letter erbij maakt er 26 × 17.576 van, dus 456.976, en dat is al ruim een half miljoen. Elk teken vermenigvuldigt het totaal dus opnieuw met 26, en daarvoor schrijven we kort 26 tot de macht 4. Meer soorten tekens toestaan werkt óók op elke positie, alleen niet even hard: 95 gedeeld door 26 is ongeveer 3,65. Een teken erbij levert dus 26 keer zoveel op, en een ruimere keuze aan tekens maar 3,65 keer zoveel per positie.</p>',
          '<p>Reken die twee effecten nu tegen elkaar weg, en houd daarbij vast dat een biljoen een 1 met twaalf nullen is. Acht tekens met van alles erin geeft 95 tot de macht 8, oftewel ruim zesduizend biljoen mogelijkheden. Tien kleine letters geven 26 tot de macht 10, en dat is ongeveer honderdveertig biljoen mogelijkheden. Tien kleine letters verliezen dus, terwijl twaalf kleine letters met 26 tot de macht 12 juist ruim winnen. Lengte wint, maar pas als je er genoeg lengte tegenover zet en als je tekens echt willekeurig gekozen zijn. Kiest een mens ze zelf, dan valt een kort ingewikkeld wachtwoord in de praktijk vaak eerder dan tien willekeurige letters.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Achter het inloggen zit een berekening: de dienst bewaart geen wachtwoord, maar alleen een hash daarvan. Die afdruk vergelijkt hij met de afdruk van wat jij net intypt, en pas bij gelijkheid mag je erin. Zelfs de beheerder kent jouw wachtwoord dus niet. Omdat kraken neerkomt op raden telt lengte het zwaarst, en twee-staps-verificatie zet daar nog een tweede slot achter.</p>',
      keyTerms: ['hash', 'afdruk']
    },
    vragen: [
      {
        prompt: 'Wat bewaart een goed beveiligde dienst op zijn server als jij daar een wachtwoord kiest?',
        leerdoel: LD_1_6[0],
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'Jouw wachtwoord, netjes in een lijstje naast je gebruikersnaam.', correct: false, misconception: 'Stelt zich een tabel voor met namen en leesbare wachtwoorden ernaast.' },
          { text: 'Jouw wachtwoord, maar dan achterstevoren geschreven.', correct: false, misconception: 'Denkt dat beveiligen betekent: er iets simpels mee doen wat je kunt terugdraaien.' },
          { text: 'Een hash: een berekende afdruk die je niet terug kunt rekenen.', correct: true, explanation: 'De dienst hoeft je wachtwoord niet te kennen, alleen te kunnen controleren of het klopt.' },
          { text: 'Niets; jouw browser bewaart het en controleert het elke keer zelf.', correct: false, misconception: 'Denkt dat de browser de controle doet in plaats van de server aan de andere kant.' }
        ],
        feedback: 'De dienst bewaart alleen een berekende afdruk van je wachtwoord en niet het wachtwoord zelf. Bij het inloggen wordt de afdruk van wat jij intypt naast de bewaarde afdruk gelegd.'
      },
      {
        prompt: 'Een crimineel die jouw wachtwoord heeft, komt altijd in je account, ook als twee-staps-verificatie aanstaat.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: false, misconception: 'Denkt dat het wachtwoord de enige drempel is en dat een tweede stap daar niets aan verandert.' },
          { text: 'Niet waar', correct: true, explanation: 'Klopt: de tweede stap zit op iets wat hij niet heeft, namelijk jouw telefoon of jouw eigen vinger.' }
        ],
        leerdoel: LD_1_6[1],
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        feedback: 'De tweede stap zit op iets wat hij niet heeft: jouw telefoon of jouw eigen vinger. Daarom houdt twee-staps-verificatie ook stand als je wachtwoord allang gelekt blijkt te zijn.'
      },
      {
        prompt: 'Waarom is een wachtwoord van twaalf kleine letters sterker dan een van acht tekens met hoofdletters, cijfers en leestekens?',
        leerdoel: LD_1_6[2],
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat kleine letters op een scherm moeilijker te lezen zijn.', correct: false, misconception: 'Zoekt de verklaring bij het aflezen in plaats van bij het aantal mogelijkheden.' },
          { text: 'Omdat leestekens door veel websites geweigerd worden.', correct: false, misconception: 'Denkt dat het aan de website ligt en niet aan de rekensom erachter.' },
          { text: 'Omdat een raadmachine hoofdletters en cijfers overslaat.', correct: false, misconception: 'Denkt dat een kraakprogramma bepaalde tekensoorten niet probeert.' },
          { text: 'Omdat elk extra teken het aantal mogelijkheden opnieuw vermenigvuldigt.', correct: true, explanation: 'Vier tekens erbij vermenigvuldigen het totaal vier keer met 26, dus met bijna 457.000. Een ruimere keuze aan tekens werkt ook per positie, maar levert daar maar 3,65 per positie op.' }
        ],
        feedback: 'Reken het na: 26 tot de macht 12 is ongeveer vijfennegentigduizend biljoen, tegen ruim zesduizend biljoen voor 95 tot de macht 8. Lengte wint, mits je er genoeg tegenover zet.'
      },
      {
        prompt: 'Stel dat alle tekens echt willekeurig gekozen zijn, dus door een computer en niet door een mens. Dan zijn tien kleine letters al sterker dan acht tekens met hoofdletters, cijfers en leestekens erin.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: false, misconception: 'Neemt de claim van veiliginternetten.nl over zonder de som er zelf achteraan te rekenen, terwijl de stelling het rekengeval juist afbakent.' },
          { text: 'Niet waar', correct: true, explanation: 'Klopt: 26 tot de macht 10 is ongeveer honderdveertig biljoen, tegen ruim zesduizend biljoen voor 95 tot de macht 8.' }
        ],
        leerdoel: LD_1_6[2],
        denkniveau: 'maken_controleren',
        niveau: 'verdieping',
        rol: 'zelf_proberen',
        feedback: 'Bij echt willekeurige tekens stopt lengte hier nog niet. Reken maar: 26 tot de macht 10 is ongeveer honderdveertig biljoen, en 95 tot de macht 8 ruim zesduizend biljoen. Vanaf twaalf letters draait het om. Kiest een mens zijn tekens zelf, dan valt zo\'n kort ingewikkeld wachtwoord in de praktijk vaak wel eerder. Daarom staat die aanname in de stelling.'
      },
      {
        prompt: 'In 1.3 zag je hoe een nepbericht om je wachtwoord kan vragen. Leg uit waarom twee-staps-verificatie dan nog steeds helpt, en waarom dat geen reden is om een zwak wachtwoord te kiezen.',
        type: 'open',
        leerdoel: LD_1_6[1],
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        modelAnswer: 'Bij phishing geef je je wachtwoord per ongeluk aan een nepsite. Met twee-staps-verificatie heeft de crimineel daar nog niets aan, want hij mist de verificatiecode uit mijn app of mijn vingerafdruk. Toch is dat geen reden om een zwak wachtwoord te nemen: de tweede stap kan uitvallen, en op sommige sites kan ik hem niet eens aanzetten. Twee sloten achter elkaar werken alleen als allebei de sloten stevig zijn.',
        nakijkpunten: [
          'Legt uit dat de tweede stap iets vraagt wat de aanvaller niet heeft.',
          'Noemt dat de bescherming ook werkt als het wachtwoord al gelekt is.',
          'Beredeneert waarom het eerste slot toch sterk moet blijven.'
        ],
        feedback: 'Twee sloten achter elkaar zijn sterker dan één, maar het eerste slot mag daarom niet van karton zijn. Elke laag moet zijn eigen werk doen.'
      },
      {
        prompt: 'Beschrijf in vier stappen wat er gebeurt tussen jouw klik op Inloggen en het moment dat je binnen bent. Gebruik in je antwoord in elk geval de woorden server en hash op de juiste plek.',
        type: 'open',
        leerdoel: LD_1_6[0],
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Stap 1: ik typ mijn gebruikersnaam en mijn wachtwoord in en klik op Inloggen, waarna die gegevens naar de server gaan. Stap 2: de server berekent de hash van het wachtwoord dat ik net intypte. Stap 3: hij zoekt de hash op die bij mijn gebruikersnaam bewaard is en legt de twee naast elkaar. Stap 4: zijn ze precies gelijk, dan krijg ik toegang; verschillen ze, dan krijg ik de melding dat mijn wachtwoord niet klopt.',
        nakijkpunten: [
          'Noemt vier stappen in de goede volgorde.',
          'Gebruikt de woorden server en hash op de juiste plek.',
          'Zegt dat er twee hashes vergeleken worden en niet twee wachtwoorden.'
        ],
        feedback: 'De vier stappen zijn: jij verstuurt je gegevens en de server rekent daar de afdruk van uit. Daarna vergelijkt hij die met de bewaarde afdruk, en pas bij gelijkheid ga je erin.'
      },
      {
        prompt: 'In 1.2 leerde je dat je voor elke site een ander wachtwoord neemt dan op school. Leg met wat je nu over hashes weet uit waarom dat juist zo belangrijk is.',
        type: 'open',
        leerdoel: LD_1_2[0],
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        modelAnswer: 'Als een site gehackt wordt, komt de lijst met hashes op straat te liggen. Criminelen gaan die hashes dan offline zitten kraken door miljoenen wachtwoorden te proberen. Lukt dat bij mijn wachtwoord, dan proberen ze het meteen bij mijn andere accounts, want mensen gebruiken vaak overal hetzelfde. Met een uniek wachtwoord per site levert dat ene gekraakte wachtwoord hun verder niets op.',
        nakijkpunten: [
          'Noemt dat bij een lek de hashes buitgemaakt en daarna gekraakt kunnen worden.',
          'Legt uit dat een gekraakt wachtwoord meteen bij andere accounts geprobeerd wordt.',
          'Concludeert dat een uniek wachtwoord per site de schade beperkt tot één account.'
        ],
        feedback: 'Terugblik op 1.2: hergebruik van hetzelfde wachtwoord maakt van één lek een hele reeks inbraken. Uniek per site betekent dat de schade netjes bij die ene site blijft.'
      },
      {
        prompt: 'Je schoolaccount uit 1.1 opent heel veel deuren tegelijk, en juist daarom verdient dat account een tweede slot.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: true, explanation: 'Klopt: één sleutel op veel deuren is handig voor jou en juist daarom aantrekkelijk voor een inbreker.' },
          { text: 'Niet waar', correct: false, misconception: 'Denkt dat een account pas beveiliging verdient zodra er geld of iets kostbaars in zit.' }
        ],
        leerdoel: LD_1_1[0],
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        feedback: 'Terugblik op 1.1: één sleutel op veel deuren is handig voor jou en aantrekkelijk voor een inbreker. Juist bij zo\'n sleutel loont het om er een tweede slot achter te zetten.'
      }
    ]
  }
};
