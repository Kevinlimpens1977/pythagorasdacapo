// Verrijkingslaag hoofdstuk 3 - Veilig internet en jouw gegevens.
// Kaderberoepsgerichte leerweg (kb).
//
// Structuur en lesstof staan in scripts/seed-structuur/kb/h3.mjs. Hier staan de
// leerdoelen, de kernbegrippen, de uitgewerkte voorbeelden, de samenvattingen en
// alle vragen. Het formaat van een vraag, de regels over afleiders en de eisen
// aan feedback staan in ../PATROON.md; lees dat eerst.
//
// OPZET, VOLGENS DE BLAUWDRUK EN HET KB-PROFIEL
// ---------------------------------------------
//   - Elk leerdoel heeft zijn eigen startvraag. Die staan als `checks` in het
//     structuurbestand, met antwoord, uitleg en leerdoelzin, vóór de theorie.
//   - Elk theorieblok heeft een uitgewerkt voorbeeld (vraag + volledige
//     uitwerking) dat de leerling ziet vóór het zelfstandig oefenen. Geen enkel
//     voorbeeld is dezelfde casus als een oefenopgave van dezelfde paragraaf:
//     3.1 sorteert wachtwoorden en de oefening rekent risico's uit, 3.2 ontleedt
//     een win-actie-DM en de oefening een Spotify-smoes, 3.3 leest een foto en
//     de oefening loopt de volgerslijst na, 3.4 koppelt begrippen en de oefening
//     zet het stappenplan op volgorde.
//   - SPREIDEN, twee terugkeervragen per afsluitquiz. De blauwdruk vraagt er
//     twee, niet één. 3.1 is de eerste paragraaf van het hoofdstuk en heeft
//     binnen het hoofdstuk niets om op terug te kijken; die quiz haalt daarom
//     twee leerdoelen uit hoofdstuk 1 op (bewaren en delen). 3.2 haalt LD_3_1[1]
//     en LD_3_1[2] op, 3.3 haalt LD_3_2[1] en LD_3_2[2] op.
//   - De hoofdstuktoets van 3.4 telt 22 vragen: elk van de elf verplichte
//     leerdoelen van 3.1 tot en met 3.4 komt precies TWEE keer terug. Dat is
//     meer dan de 15 tot 20 die de blauwdruk als startwaarde noemt; PATROON.md
//     zegt dat de dekking dan van dat ronde getal wint. In ronde 1 stonden er
//     18 vragen en werden vier leerdoelen maar één keer bevraagd.
//   - DE DRIE SIGNALEN. In 3.2 staat een genummerd rijtje: signaal 1 de
//     afzender, signaal 2 de haast, signaal 3 de vraag om een wachtwoord of
//     pincode. Elke vraag over het herkennen van een nepbericht wijst daarnaar
//     terug, in 3.2, in 3.3 en in de hoofdstuktoets. In ronde 1 wees elke vraag
//     een ander kenmerk aan als "het" signaal.
//   - ONTKENNINGEN staan in hoofdletters (GEEN, NIET). Voor kb leest een deel
//     van de klas anders over dat ene woord heen en beantwoordt de omgekeerde
//     vraag.
//   - Kb-vorm: veel meerkeuze en goed/fout, per blok hoogstens één open vraag.
//     De afleiders zijn even lang als of langer dan het goede antwoord, zodat
//     blind de langste knop klikken niets oplevert. De reden waarom een antwoord
//     klopt staat in `explanation`, niet in de antwoordtekst zelf.
//
// De vragen van de twee Wikiwijs-oefeningen uit de bron
// (maken.wikiwijs.nl/p/questionnaire/standalone/8315419 en /8315424) zitten hier
// verwerkt, herschreven naar kb-taal en met echte afleiders erbij: wat phishing
// is, het voorbeeld van identiteitsfraude, de rijbewijsfoto, de vijf
// sleepregels, de koppeling van de vier begrippen, of je alles op internet kunt
// geloven en wat digitale weerbaarheid betekent.
//
// De vrijwillige plusparagraaf 3.5 bestaat alleen in de theoretische leerweg.
// In kb loopt hoofdstuk 3 van 3.1 tot en met het checkpoint 3.4.

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

// Leerdoelen uit hoofdstuk 1 van deze leerweg, letterlijk overgetypt. Paragraaf
// 3.1 is de eerste van dit hoofdstuk en heeft dus niets binnen het hoofdstuk om
// op terug te kijken. De blauwdruk vraagt wel spreiding, dus haalt de quiz van
// 3.1 twee leerdoelen uit hoofdstuk 1 op.
const LD_VOORKENNIS = {
  wachtwoord: 'Je weet waaraan een sterk wachtwoord voldoet.',
  bewaren: 'Je kunt je wachtwoord veilig bewaren in een wachtwoordkluis of een beveiligd document.',
  delen: 'Je weet waarom je je wachtwoord nooit aan iemand anders geeft.'
};

export default {
  '3.1': {
    learningGoals: LD_3_1,
    theorie: [
      {
        keyTerms: ['hacken', 'data', 'wachtwoordbeheer'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Tim heeft drie wachtwoorden bedacht: Tim2013, Zw!7q, en blauwe kaars eet zaterdag. Welke is het sterkst? En waar bewaart hij hem?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: tel de tekens. Tim2013 heeft er 7, Zw!7q heeft er 5, en blauwe kaars eet zaterdag heeft er 25. Stap 2: kijk naar de eis van twaalf tekens. Alleen de derde haalt die. Stap 3: kijk of iemand het kan raden. Tim2013 is zijn naam met zijn geboortejaar, dus dat raadt een klasgenoot zo. Stap 4: Zw!7q heeft wel rare tekens, maar is veel te kort. Stap 5: de derde wint, want vier losse woorden zijn lang én makkelijk te onthouden. Stap 6: Tim zet hem in wachtwoordbeheer op zijn telefoon, achter één hoofdwachtwoord. Een briefje in zijn etui doet hij niet.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['twee-staps-verificatie', 'authenticator app', 'digitale weerbaarheid'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Nour wil haar Instagram beter beveiligen. Welke stappen zet zij, en wat merkt ze de volgende keer dat ze inlogt?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: ze installeert de Microsoft Authenticator op haar telefoon. Stap 2: ze opent in Instagram de instellingen en zoekt daar Beveiliging op. Stap 3: ze kiest tweestapsverificatie en koppelt haar account aan de app. Stap 4: ze voegt haar telefoonnummer toe, voor als de app niet werkt. Stap 5: ze slaat de herstelcodes op die ze krijgt. De volgende keer typt ze eerst haar wachtwoord. Daarna vraagt Instagram om een code van zes cijfers. Die leest ze af in de app en typt ze in. Pas dan is ze binnen.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Veilig internetten betekent dat je jezelf en je data beschermt terwijl je online bent. Kies een wachtwoord van minstens twaalf tekens en gebruik het nergens anders. Bewaar het in een app of in een beveiligd document, en nooit op een briefje. Zet daarnaast twee-staps-verificatie aan: na je wachtwoord vul je dan een code van je telefoon in. Zo houd je iemand buiten die je wachtwoord al kent.</p>',
      keyTerms: ['data', 'twee-staps-verificatie']
    },
    vragen: [
      {
        prompt: "Welke van deze vier is GEEN risico van internetgebruik, maar gewoon pech?",
        leerdoel: LD_3_1[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Iemand steelt je wachtwoord en logt in op jouw eigen accounts.', correct: false, misconception: 'Ziet diefstal van een wachtwoord als iets technisch en niet als iets wat iemand jou aandoet.' },
          { text: 'Iemand verkoopt jouw gegevens door aan bedrijven die je bellen.', correct: false, misconception: 'Denkt dat doorverkopen mag zodra je zelf een formulier hebt ingevuld.' },
          { text: 'Iemand pest jou online met gemene berichten in een groepschat.', correct: false, misconception: 'Denkt dat pesten geen internetrisico is omdat de dader er geen geld aan verdient.' },
          { text: 'Je laat je telefoon vallen en je scherm gaat kapot.', correct: true, explanation: 'Er is niemand die hier beter van wordt; bij een risico wil altijd iemand iets van jou of wil hij jou raken.' }
        ],
        feedback: "Bij een risico zit er altijd een ander mens achter. Een kapot scherm is vervelend, maar niemand wordt er beter van."
      },
      {
        prompt: "Met data bedoelen we gegevens over jou, zoals je adres en je foto's.",
        type: 'waar-niet-waar',
        waar: true,
        leerdoel: LD_3_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Data is alles wat iets over jou zegt, en juist daarom is het voor een ander de moeite waard.'
      },
      {
        prompt: 'Je hebt twee-staps-verificatie aangezet. Wat gebeurt er de volgende keer dat je inlogt?',
        leerdoel: LD_3_1[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je moet je wachtwoord voortaan twee keer achter elkaar intypen.', correct: false, misconception: 'Leest twee stappen als twee keer hetzelfde in plaats van twee verschillende soorten bewijs.' },
          { text: 'Je hoeft je wachtwoord niet meer te weten, want de app doet het.', correct: false, misconception: 'Denkt dat de tweede stap de eerste vervangt in plaats van hem aanvult.' },
          { text: 'Na je wachtwoord vul je een code van je telefoon in.', correct: true, explanation: 'De tweede stap vraagt iets wat jij bezit, en dat heeft een dief met alleen je wachtwoord niet.' },
          { text: 'Je krijgt elke week een nieuw wachtwoord toegestuurd per mail.', correct: false, misconception: 'Verwart de tweede stap met het regelmatig veranderen van je wachtwoord.' }
        ],
        feedback: 'Eerst iets wat je weet, dan iets wat je hebt. Die twee samen maken inloggen voor een ander bijna onmogelijk.'
      },
      {
        prompt: 'Je wilt een authenticator app gaan gebruiken. Wat is daarbij de eerste stap?',
        leerdoel: LD_3_1[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je installeert de app van Google of Microsoft op je telefoon.', correct: true, explanation: 'Zonder de app op je telefoon valt er nog niets aan een account te koppelen.' },
          { text: 'Je verandert eerst het wachtwoord van al je accounts tegelijk.', correct: false, misconception: 'Denkt dat een tweede stap pas zin heeft na een grote wachtwoordschoonmaak.' },
          { text: 'Je stuurt je telefoonnummer per mail naar de helpdesk van de app.', correct: false, misconception: 'Denkt dat je gegevens moet opsturen om iets te kunnen beveiligen.' },
          { text: 'Je maakt een nieuw account aan met een ander e-mailadres erbij.', correct: false, misconception: 'Denkt dat beveiligen betekent dat je opnieuw moet beginnen met een leeg account.' }
        ],
        feedback: 'De volgorde is: app installeren, account koppelen, telefoonnummer toevoegen, en daarna pas inloggen met een code.'
      },
      {
        prompt: 'Wat betekent digitale weerbaarheid?',
        leerdoel: LD_3_1[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Dat jouw telefoon tegen een flinke stoot kan en niet snel kapotgaat.', correct: false, misconception: 'Leest weerbaar als stevig, en denkt daarom aan het apparaat in plaats van aan jou.' },
          { text: 'Dat je heel snel kunt typen op het toetsenbord van je eigen laptop.', correct: false, misconception: 'Verwart weerbaarheid met handigheid op de computer.' },
          { text: 'Dat je van school elke dag twee uur op sociale media mag zitten.', correct: false, misconception: 'Denkt dat het over schermtijd gaat en niet over veiligheid.' },
          { text: 'Dat je jezelf beschermt tegen wat online niet veilig of eerlijk is.', correct: true, explanation: 'Het gaat om je eigen gedrag: je merkt dat iets niet klopt en je zet dan de goede stap.' }
        ],
        feedback: 'Weerbaar zijn is gedrag, geen kennis. Je merkt zelf dat er iets raars is en klikt dan juist niet door.'
      },
      {
        prompt: 'Je neefje van tien vraagt wat digitale weerbaarheid is. Leg het uit in drie zinnen. Geef er één voorbeeld bij van iets wat jij zelf doet.',
        type: 'open',
        leerdoel: LD_3_1[2],
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        modelAnswer: 'Digitale weerbaarheid betekent dat je jezelf online kunt beschermen. Je merkt zelf dat iets niet veilig of niet eerlijk is. Daarna zet je de goede stap, bijvoorbeeld niet klikken of het melden. Bij mij is dat zo: ik heb op mijn mail een tweede inlogstap aangezet. En als ik een rare link krijg, klik ik er niet op maar vraag ik het thuis.',
        nakijkpunten: [
          'Noemt dat het gaat om jezelf beschermen tegen wat online niet veilig of niet eerlijk is.',
          'Beschrijft weerbaarheid als iets wat je doet, en niet alleen als een woord met een uitleg.',
          'Geeft één eigen voorbeeld uit het eigen leven en schrijft in hele zinnen.'
        ],
        feedback: 'Een goed antwoord noemt het merken én het doen. Alleen de definitie opschrijven laat nog niet zien dat je weerbaar bent.'
      },
      // Twee terugkeervragen naar hoofdstuk 1. 3.1 is de eerste paragraaf van
      // dit hoofdstuk, dus binnen het hoofdstuk valt er niets op te halen.
      {
        prompt: 'Terugblik op hoofdstuk 1: waar bewaar je je wachtwoorden veilig?',
        leerdoel: LD_VOORKENNIS.bewaren,
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Op een briefje in je etui, zodat je het altijd bij je hebt.', correct: false, misconception: 'Denkt dat iets wat je bij je draagt daarmee ook veilig bewaard is.' },
          { text: 'In een wachtwoordkluis of in een beveiligd document.', correct: true, explanation: 'Allebei gaan ze open met één hoofdwachtwoord dat alleen jij kent.' },
          { text: 'In een appje aan jezelf, want dat leest verder niemand mee.', correct: false, misconception: 'Denkt dat een chat met jezelf een afgesloten plek is.' },
          { text: 'In je hoofd, en dan overal hetzelfde wachtwoord gebruiken.', correct: false, misconception: 'Lost het onthouden op door de belangrijkste eis, uniek zijn, op te geven.' }
        ],
        feedback: 'Een kluis houdt jouw wachtwoorden apart én uniek. Onthouden lukt alleen als je overal hetzelfde neemt, en dat is nou juist fout.'
      },
      {
        prompt: 'Je vriend vraagt je wachtwoord om even op jouw account te kijken. Wat doe je?',
        leerdoel: LD_VOORKENNIS.delen,
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Geven, want je vertrouwt hem en je verandert het daarna weer.', correct: false, misconception: 'Denkt dat vertrouwen genoeg is, en vergeet dat een wachtwoord doorverteld kan worden.' },
          { text: 'Geven, maar hem eerst laten beloven dat hij niets aanpast.', correct: false, misconception: 'Denkt dat een afspraak hetzelfde beschermt als een gesloten account.' },
          { text: 'Niet geven, en samen op jouw telefoon kijken wat hij zoekt.', correct: true, explanation: 'Alles wat er op dat account gebeurt staat op jouw naam, ook wat een ander doet.' },
          { text: 'Niet geven, en de vraag meteen melden bij een docent.', correct: false, misconception: 'Reageert te zwaar op een vraag van een vriend; nee zeggen is hier genoeg.' }
        ],
        feedback: 'Nee zeggen kan gewoon vriendelijk. Kijk samen mee, dan houd je je account dicht zonder ruzie.'
      }
    ]
  },

  '3.2': {
    learningGoals: LD_3_2,
    theorie: [
      {
        keyTerms: ['phishing', 'win-actie', 'nepbericht'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Lisa krijgt een DM: "Gefeliciteerd! Jij wint een iPhone. Vul binnen 2 uur je e-mail en 06-nummer in." Wat klopt hier niet, en wat wint de afzender?</p>',
          '<p><strong>Antwoord.</strong> Punt 1: Lisa heeft nergens meegedaan aan een wedstrijd. Punt 2: er staat haast in het bericht, namelijk binnen twee uur. Punt 3: er wordt om haar e-mailadres en haar telefoonnummer gevraagd. Punt 4: er staat niet bij wie de actie uitschrijft en waar de voorwaarden staan. Wat wint de afzender? Geen iPhone weggeven, maar een lijst met werkende adressen en nummers. Die lijst verkoopt hij door. Lisa wordt daarna gebeld door onbekende nummers en krijgt nog meer nepmail. Lisa vult dus niets in en gebruikt de knop rapporteren.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['cybercrimineel', 'identiteitsfraude', 'afzender'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Er staat een mail van "ING" in de mailbox van Daan. Hoe controleert hij de afzender, stap voor stap?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: hij klikt de naam ING aan zodat het hele mailadres zichtbaar wordt. Er staat: service@ing-veiligheid-nl.com. Stap 2: hij typt zelf ing.nl in zijn browser, dus niet via de mail. Stap 3: op die website zoekt hij op welke adressen de bank echt gebruikt. Die eindigen op ing.nl. Stap 4: hij vergelijkt letter voor letter. Het adres uit de mail eindigt op .com en heeft er woorden bij gezet. Stap 5: hij weet nu genoeg en klikt nergens op. Stap 6: hij belt het nummer van de website om het te melden. Het nummer uit de mail gebruikt hij niet.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Phishing is een nepbericht waarmee iemand jouw gegevens of je geld probeert te krijgen. Je herkent het aan de afzender, aan de haast en aan de vraag om een wachtwoord of pincode. Een bank of de overheid mailt daar nooit om. Iemand die jouw gegevens digitaal steelt heet een cybercrimineel. Doet hij zich met jouw naam en foto voor als jou, dan heet dat identiteitsfraude.</p>',
      keyTerms: ['phishing', 'identiteitsfraude']
    },
    vragen: [
      {
        prompt: 'Wat is phishing?',
        leerdoel: LD_3_2[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Vissen in een sloot op een plek waar dat eigenlijk niet mag.', correct: false, misconception: 'Vertaalt het Engelse woord letterlijk en denkt daardoor aan echte hengels.' },
          { text: 'Het raden van een wachtwoord met een heel snel computerprogramma.', correct: false, misconception: 'Verwart phishing met hacken; bij phishing geef je je gegevens juist zelf.' },
          { text: 'Met een nepbericht gegevens of geld van iemand losmaken.', correct: true, explanation: 'Er wordt niets gekraakt: de dader laat jou zelf klikken, invullen of overmaken.' },
          { text: 'Het online pesten van iemand met gemene berichten in een groepschat.', correct: false, misconception: 'Gooit alle onveilige dingen op internet op één hoop.' }
        ],
        feedback: 'Phishing draait om een nepbericht en niet om techniek. De dader wacht tot jij zelf iets invult of overmaakt.'
      },
      {
        prompt: 'Er staat een mail van je bank in je mailbox. Waaraan zie je het snelst dat het phishing kan zijn?',
        leerdoel: LD_3_2[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Het mailadres van de afzender klopt niet met dat van de bank.', correct: true, explanation: 'Signaal 1 uit het rijtje van drie. Het adres is het lastigste deel om na te maken, daarom kijk je daar het eerst naar.' },
          { text: 'Er staat een logo van de bank bovenaan de mail afgebeeld.', correct: false, misconception: 'Denkt dat een echt logo bewijst dat een mail echt is, terwijl iedereen een logo kan kopiëren.' },
          { text: 'De mail is netjes geschreven en er staan geen spelfouten in.', correct: false, misconception: 'Denkt dat nepmails altijd te herkennen zijn aan slecht Nederlands.' },
          { text: 'Onderaan de mail staat een link naar de website van de bank.', correct: false, misconception: 'Denkt dat een link naar een bekende site automatisch veilig is.' }
        ],
        feedback: 'Signaal 1 van de drie is de afzender, en die kun jij als enige zelf nakijken. Eén letter verschil is al genoeg.'
      },
      {
        prompt: 'Een bank of de overheid vraagt je per mail nooit om je wachtwoord of je pincode.',
        type: 'waar-niet-waar',
        waar: true,
        leerdoel: LD_3_2[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Precies. Staat die vraag er toch, dan weet je meteen genoeg: weggooien en melden, en zeker niet antwoorden.'
      },
      {
        prompt: 'Wat is een voorbeeld van identiteitsfraude?',
        leerdoel: LD_3_2[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Iemand raadt jouw wachtwoord en leest daarna je berichten mee.', correct: false, misconception: 'Noemt hacken, terwijl bij identiteitsfraude iemand zich juist als jou voordoet.' },
          { text: 'Iemand doet zich met jouw naam en foto voor als jou.', correct: true, explanation: 'Jouw naam en foto worden als vermomming gebruikt om iemand anders te bestelen.' },
          { text: 'Iemand steelt een reep chocola bij de kassa van de supermarkt.', correct: false, misconception: 'Denkt dat elke vorm van stelen fraude met een identiteit is.' },
          { text: 'Iemand maakt een schermfoto van jouw verhaal en stuurt die door.', correct: false, misconception: 'Verwart het doorsturen van jouw materiaal met het overnemen van jouw identiteit.' }
        ],
        feedback: 'Bij identiteitsfraude ben jij het masker en niet het doelwit. De schade valt bij mensen die jou vertrouwden.'
      },
      {
        prompt: 'Op TikTok staat een win-actie voor een iPhone van een bekende winkel. Wat controleer je eerst, en hoe doe je dat? Schrijf drie stappen op.',
        type: 'open',
        leerdoel: LD_3_2[1],
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        modelAnswer: 'Stap 1: ik controleer van wie de actie echt is. Dat doe ik buiten het bericht om. Ik typ zelf het adres van die winkel in mijn browser. Stap 2: ik kijk of de actie ook op die website staat. Staat hij er niet, dan vul ik niets in en rapporteer ik de post. Stap 3: staat hij er wel, dan lees ik de voorwaarden. Als mijn gegevens alleen voor de actie gebruikt worden, mag ik meedoen. Ik vul dan nooit meer in dan gevraagd wordt. Een wachtwoord of pincode vul ik nooit in.',
        nakijkpunten: [
          'Controleert van wie de actie is buiten het bericht om, dus door zelf het adres van het bedrijf in te typen.',
          'Noemt de voorwaarden pas als tweede stap, nadat duidelijk is wie de actie uitschrijft.',
          'Zegt dat er nooit meer ingevuld wordt dan gevraagd, en nooit een wachtwoord of pincode.'
        ],
        feedback: 'De volgorde telt hier. Eerst nagaan van wie de actie is, en pas daarna kijken wat de voorwaarden beloven.'
      },
      {
        prompt: 'Een oplichter heeft jouw wachtwoord van Instagram te pakken gekregen. Wat houdt hem dan alsnog tegen?',
        leerdoel: LD_3_1[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Dat je je profielfoto onlangs vervangen hebt door een andere foto.', correct: false, misconception: 'Denkt dat zichtbare veranderingen aan je profiel iets met beveiliging te maken hebben.' },
          { text: 'Dat je account op privé staat en alleen bekenden je posts zien.', correct: false, misconception: 'Verwart wie er meekijkt met wie er kan inloggen.' },
          { text: 'Dat je je wachtwoord in wachtwoordbeheer bewaart en niet op papier.', correct: false, misconception: 'Denkt dat een goede bewaarplek ook helpt als het wachtwoord al gestolen is.' },
          { text: 'De code die op jouw telefoon binnenkomt bij het inloggen.', correct: true, explanation: 'Die code is de tweede stap; zonder jouw telefoon komt hij er niet doorheen.' }
        ],
        feedback: 'Dit is de reden dat je in 3.1 die tweede stap aanzette. Een gestolen wachtwoord is dan nog niet genoeg.'
      },
      {
        prompt: 'Je twijfelt over een bericht en je klikt daarom niet. Hoe heet dat gedrag uit 3.1?',
        leerdoel: LD_3_1[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Twee-staps-verificatie.', correct: false, misconception: 'Noemt een instelling op je account, terwijl het hier om jouw eigen gedrag gaat.' },
          { text: 'Digitale geletterdheid.', correct: false, misconception: 'Kiest het overkoepelende vak in plaats van het gedrag dat erbij hoort.' },
          { text: 'Digitale weerbaarheid.', correct: true, explanation: 'Je merkt het zelf, je houdt je in, en je zet de goede stap.' },
          { text: 'Wachtwoordbeheer.', correct: false, misconception: 'Kiest een hulpmiddel in plaats van het gedrag van de leerling zelf.' }
        ],
        feedback: 'Weerbaar zijn is precies dit moment: niet klikken terwijl klikken makkelijker was geweest.'
      }
    ]
  },

  '3.3': {
    learningGoals: LD_3_3,
    theorie: [
      {
        keyTerms: ['digitale voetafdruk', 'gevoelige informatie'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sem post een foto van zichzelf voor zijn huis, in zijn voetbaltenue, met de tekst: "Elke dinsdag om 19 uur training!" Wat verraadt die ene foto?</p>',
          '<p><strong>Antwoord.</strong> Punt 1: op de gevel staat een huisnummer, dus zijn adres is bijna compleet. Punt 2: op zijn tenue staat de naam van zijn club, dus zijn woonplaats ligt vast. Punt 3: het bijschrift zegt wanneer hij niet thuis is, elke dinsdag om zeven uur. Punt 4: alle drie apart lijken onschuldig, maar samen zeggen ze waar hij woont en wanneer hij weg is. Wat doet Sem beter? Hij fotografeert alleen zichzelf, zonder gevel en zonder clubnaam. Het tijdstip laat hij weg. En hij zet zijn account op privé.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['privacy-instellingen', 'fake news'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Amber wil dat alleen mensen die ze echt kent haar profiel zien. Ze heeft 180 volgers. Welke stappen zet zij?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: ze opent de app en gaat naar Instellingen. Stap 2: ze zoekt daar het kopje Privacy of Account op. Stap 3: ze zet de schakelaar Privé-account aan. Stap 4: ze controleert of het gelukt is door haar profiel op de telefoon van een klasgenoot te openen. Stap 5: ze opent haar volgerslijst en gaat die van boven naar beneden door. Stap 6: elke volger die ze niet in het echt kent, verwijdert ze. Stap 7: in haar bio haalt ze haar school en haar sportclub weg. Die stond daar nog wel.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Alles wat je post laat sporen na, en al die sporen samen heten je digitale voetafdruk. Verwijderen helpt maar half, want anderen hebben er al een kopie van gemaakt. Met je privacy-instellingen zet je je account op privé, zodat alleen bekenden meekijken. Ga daarna ook je volgerslijst helemaal langs. Deel geen gegevens die zeggen waar je bent, wanneer je er bent of wie je officieel bent.</p>',
      keyTerms: ['digitale voetafdruk', 'privacy-instellingen']
    },
    vragen: [
      {
        prompt: 'Je bent geslaagd voor je rijbewijs en post een foto van je pasje. Is dat verstandig?',
        leerdoel: LD_3_3[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ja, want je verwijdert de foto na een dag toch gewoon weer.', correct: false, misconception: 'Denkt dat verwijderen de foto echt weghaalt, terwijl kopieën al gemaakt kunnen zijn.' },
          { text: 'Nee, want je gegevens staan er voor iedereen op.', correct: true, explanation: 'Je naam, je geboortedatum en je handtekening staan op zo’n pasje, en daar kan een ander mee werken.' },
          { text: 'Ja, want alleen je eigen volgers kunnen die foto bekijken.', correct: false, misconception: 'Denkt dat volgers altijd bekenden zijn en dat die niets doorsturen.' },
          { text: 'Nee, want een foto van een pasje wordt door de app geweigerd.', correct: false, misconception: 'Denkt dat de app zelf controleert wat je mag posten.' }
        ],
        feedback: 'Op een pasje staat meer dan je denkt: je naam, je geboortedatum en je handtekening bij elkaar.'
      },
      {
        prompt: 'Een bericht dat je na tien minuten verwijdert, kan in die tien minuten al door anderen zijn opgeslagen.',
        type: 'waar-niet-waar',
        waar: true,
        leerdoel: LD_3_3[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Jouw verwijderknop gaat alleen over jouw exemplaar, en niet over de kopieën van anderen.'
      },
      {
        prompt: 'Waar zet je in de meeste apps je account op privé?',
        leerdoel: LD_3_3[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Bij Privacy of Account, achter de schakelaar Privé-account.', correct: true, explanation: 'Alleen die schakelaar bepaalt wie jouw profiel kan zien; de rest is tekst.' },
          { text: 'Bij Instellingen voor meldingen, onder de knop voor geluid.', correct: false, misconception: 'Zoekt in het eerste menu dat hij tegenkomt in plaats van bij Privacy.' },
          { text: 'In je bio, door daar te zetten dat je profiel privé is.', correct: false, misconception: 'Denkt dat een zin in je bio door de app gelezen en gevolgd wordt.' },
          { text: 'Dat kan alleen de app zelf doen als je daarom vraagt per mail.', correct: false, misconception: 'Denkt dat privacy iets is wat je moet aanvragen in plaats van zelf instellen.' }
        ],
        feedback: 'De schakelaar doet het werk, je bio niet. Ga daarna nog even je volgerslijst langs.'
      },
      {
        prompt: 'Welke van deze vier hoort echt NIET op een openbaar profiel?',
        leerdoel: LD_3_3[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De naam van je favoriete band en hun nieuwste nummer.', correct: false, misconception: 'Denkt dat alles wat persoonlijk voelt ook gevaarlijk is om te delen.' },
          { text: 'Een foto van je kat die op de vensterbank ligt te slapen.', correct: false, misconception: 'Denkt dat elke foto van thuis meteen je adres verraadt.' },
          { text: 'Je schoolrooster met je lestijden erin.', correct: true, explanation: 'Een ander leest zo af wanneer jij op school zit en wanneer je huis leeg is.' },
          { text: 'Een tekening die je zelf in de les hebt zitten maken.', correct: false, misconception: 'Denkt dat schoolwerk delen hetzelfde is als schoolgegevens delen.' }
        ],
        feedback: 'Vraag je drie dingen af: zegt dit waar ik ben, wanneer ik er ben, of wie ik officieel ben?'
      },
      {
        prompt: 'In een groepschat gaat een bewerkte foto rond van iemand uit jouw klas. Beschrijf in drie stappen wat jij doet. Leg er ook bij uit waarom je hem niet doorstuurt.',
        type: 'open',
        leerdoel: LD_3_3[2],
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        modelAnswer: 'Stap 1: ik maak een schermfoto, want die heb ik later nodig als bewijs. Stap 2: ik blokkeer de persoon die de foto plaatste. Stap 3: ik meld het bij mijn mentor of bij mijn ouders. Daarna zeg ik tegen het slachtoffer dat ik het gemeld heb. Doorsturen doe ik niet, want dan maak ik de groep die meepest groter. Ook als ik er iets aardigs bij zet, zien er weer meer mensen die foto. Dit is cyberpesten, en dat begint pas te stoppen als iemand het meldt.',
        nakijkpunten: [
          'Noemt de drie stappen bewijs maken, blokkeren en melden, in die volgorde.',
          'Legt uit dat doorsturen de groep die meepest groter maakt, ook met een aardig bijschrift erbij.',
          'Gebruikt het woord cyberpesten of beschrijft het duidelijk, en schrijft in hele zinnen.'
        ],
        feedback: 'Bewijs, blokkeren, melden. Niets doen voelt neutraal, maar het laat de pester gewoon doorgaan.'
      },
      {
        prompt: 'In een DM staat: klik snel op deze link, anders wordt je account morgen verwijderd. Wat doe je?',
        leerdoel: LD_3_2[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je klikt en kijkt alleen even hoe de pagina eruitziet.', correct: false, misconception: 'Denkt dat kijken zonder invullen niet gevaarlijk is.' },
          { text: 'Je stuurt de link door aan een vriend om te vragen wat hij vindt.', correct: false, misconception: 'Vraagt hulp op een manier die de link juist verder verspreidt.' },
          { text: 'Je antwoordt dat je geen interesse hebt en blokkeert daarna pas.', correct: false, misconception: 'Denkt dat antwoorden netjes is, terwijl het bevestigt dat je nummer werkt.' },
          { text: 'Je klikt niets aan en kijkt zelf in de app of dat klopt.', correct: true, explanation: 'Signaal 2 en signaal 3 tegelijk; controleren doe je altijd buiten het bericht om.' }
        ],
        feedback: 'Hier staan signaal 2 en signaal 3 samen: haast plus een klik. Twee signalen tegelijk, dus nep.'
      },
      {
        prompt: 'Nepnieuws kan schade doen, ook als jij het zelf verzonnen en doorgestuurd hebt.',
        type: 'waar-niet-waar',
        waar: true,
        leerdoel: LD_3_3[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Zo is het. Je kunt niet alles geloven wat op internet staat, en je moet ook niet alles doorsturen.'
      },
      {
        prompt: 'Een cybercrimineel vraagt met jouw naam en foto aan jouw vrienden om geld. Dat heet identiteitsfraude.',
        type: 'waar-niet-waar',
        waar: true,
        leerdoel: LD_3_2[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Juist. En daarom is een openbaar profiel met jouw naam en foto erop precies wat hij nodig heeft.'
      }
    ]
  },

  '3.4': {
    learningGoals: LD_3_4,
    theorie: [
      {
        keyTerms: ['cybercrimineel', 'weerbaar'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Koppel deze vier begrippen aan de juiste uitleg: phishing, twee-staps-verificatie, identiteitsfraude, cybercrimineel.</p>',
          '<p><strong>Antwoord.</strong> Phishing hoort bij: een manier om met een nepbericht jouw gegevens of geld te stelen. Twee-staps-verificatie hoort bij: een manier om je account extra te beschermen met een authenticator app of een extra sms. Identiteitsfraude hoort bij: iets stelen door gebruik te maken van de identiteit van iemand anders. Cybercrimineel hoort bij: de misdadiger die online jouw gegevens probeert te stelen. Let op het verschil tussen de laatste twee. De cybercrimineel is de persoon, identiteitsfraude is wat hij doet.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['noodkaart', 'afzender'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Bo levert als bewijs een schermfoto in van haar mailbox, waarop staat dat ze een nepmail heeft weggegooid. Bewijst dat wat zij beweert?</p>',
          '<p><strong>Antwoord.</strong> Bo beweert: ik heb mijn account beter beveiligd. Haar schermfoto laat iets anders zien, namelijk dat ze één mail heeft verwijderd. Dat is netjes, maar het zegt niets over haar beveiliging. Wat bewijst wel wat zij beweert? Een schermfoto van het beveiligingsscherm waarop staat dat de tweede inlogstap aan is. Of een schermfoto van haar instellingen waarop haar account op privé staat. Kijk dus bij elk bewijsstuk: welke zin uit mijn verslag staat hier nu precies op?</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Digitaal weerbaar zijn betekent dat je zelf merkt dat iets niet klopt en dan handelt. Op je noodkaart staan vier stappen bij een verdacht bericht: niet klikken, de afzender controleren, bij twijfel bellen, en daarna melden en blokkeren. Je gegevens bescherm je met een lang wachtwoord, een tweede inlogstap en een profiel op privé. En je denkt na voor je iets post, want wat je online zet blijft lang bestaan.</p>',
      keyTerms: ['weerbaar', 'noodkaart']
    },
    vragen: [
      {
        prompt: "Welk rijtje bestaat helemaal uit risico's die een ander jou online kan bezorgen?",
        leerdoel: LD_3_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Wachtwoorden stelen, nepberichten sturen en pesten.', correct: true, explanation: 'Bij alle drie zit er een ander mens achter die iets van jou wil of jou wil raken.' },
          { text: 'Een lege batterij, een trage verbinding en een kapot scherm.', correct: false, misconception: 'Rekent pech met het apparaat mee als internetrisico.' },
          { text: 'Een volle mailbox, een oude telefoon en te weinig opslagruimte.', correct: false, misconception: 'Denkt dat ongemak hetzelfde is als onveiligheid.' },
          { text: 'Te lang schermgebruik, pijn in je nek en te weinig slaap.', correct: false, misconception: 'Verwart gezondheidsklachten met risico’s die door een ander veroorzaakt worden.' }
        ],
        feedback: 'Achter elk risico zit een mens met een bedoeling. Techniek die stukgaat hoort niet in dat rijtje thuis.'
      },
      {
        prompt: 'Iemand vult bij een win-actie zijn e-mailadres en telefoonnummer in. Wat gebeurt er meestal daarna met die gegevens?',
        leerdoel: LD_3_1[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Ze worden na de trekking automatisch en volledig verwijderd.', correct: false, misconception: 'Vertrouwt erop dat een onbekende actie zich aan regels houdt.' },
          { text: 'Ze blijven bij de winkel staan tot je zelf om verwijdering vraagt.', correct: false, misconception: 'Gaat ervan uit dat er een echte winkel achter de actie zit.' },
          { text: 'Ze gaan naar de politie, die controleert of de actie echt bestaat.', correct: false, misconception: 'Denkt dat er standaard toezicht op zulke acties zit.' },
          { text: 'Ze worden doorverkocht en daarna voor reclame en nepmail gebruikt.', correct: true, explanation: 'Een werkend adres met een werkend nummer erbij is precies waar zulke lijsten om draaien.' }
        ],
        feedback: 'De prijs is het lokaas. Wat de dader echt wil is een lijst met adressen en nummers die het doen.'
      },
      {
        prompt: 'Hoe zet je op een account een tweede inlogstap aan?',
        leerdoel: LD_3_1[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Via de beveiligingsinstellingen, met een app of een sms-code.', correct: true, explanation: 'Je koppelt daar je account aan een authenticator app of aan je telefoonnummer.' },
          { text: 'Door je wachtwoord twee keer achter elkaar in te typen bij inloggen.', correct: false, misconception: 'Leest twee stappen als hetzelfde bewijs, twee keer geleverd.' },
          { text: 'Door je wachtwoord elke maand door een nieuw wachtwoord te vervangen.', correct: false, misconception: 'Verwart een tweede stap met het regelmatig veranderen van je wachtwoord.' },
          { text: 'Door je account te koppelen aan het account van een klasgenoot.', correct: false, misconception: 'Denkt dat een tweede persoon hetzelfde doet als een tweede stap.' }
        ],
        feedback: 'Zoek in de instellingen naar Beveiliging. Daar staat de knop voor tweestapsverificatie bijna altijd.'
      },
      {
        prompt: 'Je krijgt midden in de les een code van Instagram op je telefoon, terwijl je zelf niet inlogt. Wat betekent dat?',
        leerdoel: LD_3_1[1],
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Dat de app zichzelf heeft bijgewerkt en daarom om een code vraagt.', correct: false, misconception: 'Zoekt een onschuldige verklaring en negeert daarmee het alarmsignaal.' },
          { text: 'Dat iemand jouw wachtwoord al heeft en probeert in te loggen.', correct: true, explanation: 'De code komt pas nadat het wachtwoord goed was, dus die ander is al een stap ver.' },
          { text: 'Dat je account per ongeluk op openbaar is komen te staan.', correct: false, misconception: 'Verwart wie er meekijkt met wie er probeert in te loggen.' },
          { text: 'Dat je telefoon te weinig opslag heeft en daarom meldingen stuurt.', correct: false, misconception: 'Ziet elke onverwachte melding als een storing van het apparaat.' }
        ],
        feedback: 'Zo’n code is een alarm. Verander meteen je wachtwoord en geef die code aan niemand door.'
      },
      {
        prompt: 'Wat hoort bij digitale weerbaarheid?',
        leerdoel: LD_3_1[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Dat je bij twijfel eerst controleert en pas daarna iets doet.', correct: true, explanation: 'Weerbaarheid is gedrag: merken, even wachten, en dan de goede stap zetten.' },
          { text: 'Dat je alle apps van je telefoon haalt die je niet meer gebruikt.', correct: false, misconception: 'Denkt dat opruimen hetzelfde is als jezelf beschermen.' },
          { text: 'Dat je een hoesje om je telefoon doet zodat hij niet kapotgaat.', correct: false, misconception: 'Leest weerbaar als stevig en denkt daarom aan het apparaat.' },
          { text: 'Dat je elke dag bijhoudt hoeveel uur je op je telefoon zit.', correct: false, misconception: 'Verwart digitale weerbaarheid met digitale gezondheid.' }
        ],
        feedback: 'Weerbaar zijn zie je aan wat je doet op het moment zelf, en niet aan wat je erover kunt vertellen.'
      },
      {
        prompt: 'Waarom stuurt een oplichter zijn nepbericht naar duizenden mensen tegelijk?',
        leerdoel: LD_3_2[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Omdat een bericht pas werkt als heel veel mensen het lezen.', correct: false, misconception: 'Denkt dat phishing werkt als een reclame die je vaak moet zien.' },
          { text: 'Omdat hij niet weet welke mensen er een bankrekening hebben.', correct: false, misconception: 'Denkt dat de dader gericht zoekt in plaats van breed uitgooit.' },
          { text: 'Omdat versturen niets kost en één beet al winst oplevert.', correct: true, explanation: 'Trapt er één op de duizend in, dan heeft hij zijn moeite er ruim uit.' },
          { text: 'Omdat de politie een bericht dan veel moeilijker kan opsporen.', correct: false, misconception: 'Denkt dat het aantal ontvangers met opsporing te maken heeft.' }
        ],
        feedback: 'Reken het uit zoals de dader: duizend berichten kosten niets, en één slachtoffer levert al geld op.'
      },
      {
        prompt: 'Welk rijtje geeft de drie signalen van een nepbericht uit 3.2?',
        leerdoel: LD_3_2[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Het logo, de nette taal en de lengte van het bericht eronder.', correct: false, misconception: 'Kijkt naar hoe een bericht eruitziet; juist dat kan een oplichter perfect namaken.' },
          { text: 'De afzender, de haast en de vraag om je wachtwoord.', correct: true, explanation: 'Dit is het rijtje uit 3.2, in de volgorde waarin je ze nakijkt.' },
          { text: 'De datum, het onderwerp en het aantal bijlagen dat meekomt.', correct: false, misconception: 'Zoekt de signalen in de kop van de mail in plaats van in de inhoud.' },
          { text: 'De kleur, het lettertype en de plek van de knop erin.', correct: false, misconception: 'Denkt dat opmaak iets zegt over of een bericht echt is.' }
        ],
        feedback: 'Afzender, haast, vraag. Eén signaal is een waarschuwing; twee of drie samen betekenen: nep.'
      },
      {
        prompt: 'Je vriend appt vanaf een onbekend nummer dat hij snel geld nodig heeft. Wat doe je als eerste?',
        leerdoel: LD_3_2[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Je maakt het geld over en vraagt hem het morgen terug te geven.', correct: false, misconception: 'Denkt dat snel helpen belangrijker is dan eerst controleren.' },
          { text: 'Je vraagt in de chat of hij het echt is en wacht op antwoord.', correct: false, misconception: 'Controleert binnen hetzelfde bericht, waar de oplichter alle antwoorden geeft.' },
          { text: 'Je belt hem op het nummer dat je al had.', correct: true, explanation: 'De hele truc draait om dat nieuwe nummer; op het oude nummer zit de oplichter niet.' },
          { text: 'Je stuurt het bericht door aan andere vrienden om het te vragen.', correct: false, misconception: 'Verspreidt het nepbericht in plaats van het te controleren.' }
        ],
        feedback: 'Controleer altijd buiten het bericht om. Binnen de chat bepaalt de oplichter wat je te horen krijgt.'
      },
      {
        prompt: 'Wat doet een cybercrimineel?',
        leerdoel: LD_3_2[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Hij repareert computers die door een virus zijn stukgegaan.', correct: false, misconception: 'Leest cyber als iets technisch en denkt daarom aan een monteur.' },
          { text: 'Hij controleert of webshops zich netjes aan de regels houden.', correct: false, misconception: 'Verwart de dader met een toezichthouder.' },
          { text: 'Hij verspreidt nepnieuws om mensen aan het schrikken te maken.', correct: false, misconception: 'Gooit alles wat online misgaat op één hoop.' },
          { text: 'Hij steelt digitaal de gegevens van andere mensen.', correct: true, explanation: 'Hij doet dat via nepberichten, gestolen wachtwoorden of gehackte websites.' }
        ],
        feedback: 'Cybercrimineel is de naam van de dader. Wat hij doet heeft allerlei namen, zoals phishing en hacken.'
      },
      {
        prompt: 'Waarom is identiteitsfraude ook vervelend voor mensen die jou kennen?',
        leerdoel: LD_3_2[2],
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Omdat zij daarna zelf ook geen account meer mogen aanmaken.', correct: false, misconception: 'Denkt dat een app anderen straft voor wat er met jouw naam gebeurt.' },
          { text: 'Omdat zij jouw naam en foto zien en daardoor geld overmaken.', correct: true, explanation: 'Jij bent de vermomming; de schade valt bij mensen die jou juist vertrouwden.' },
          { text: 'Omdat zij hun eigen wachtwoord dan verplicht moeten veranderen.', correct: false, misconception: 'Denkt dat identiteitsfraude hetzelfde werkt als een datalek.' },
          { text: 'Omdat zij jouw berichten dan niet meer kunnen terugvinden.', correct: false, misconception: 'Denkt aan ongemak in de app in plaats van aan schade bij mensen.' }
        ],
        feedback: 'Daarom is een openbaar profiel meer waard voor een oplichter dan je denkt: hij leent er vertrouwen mee.'
      },
      {
        prompt: 'Waarom is een foto die je verwijdert vaak nog niet echt weg?',
        leerdoel: LD_3_3[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Omdat een app foto’s pas na een jaar echt van de server haalt.', correct: false, misconception: 'Denkt dat het alleen om een wachttijd gaat en niet om kopieën van anderen.' },
          { text: 'Omdat je hem ook nog uit je eigen prullenbak moet weghalen.', correct: false, misconception: 'Denkt dat het probleem op het eigen toestel zit en dus zelf op te lossen is.' },
          { text: 'Omdat de app je eerst om een bevestiging per mail moet vragen.', correct: false, misconception: 'Denkt dat verwijderen een procedure is die nog kan mislukken.' },
          { text: 'Omdat anderen er al een kopie van gemaakt kunnen hebben.', correct: true, explanation: 'Over die kopieën heb jij niets meer te zeggen, en je kunt ze niet eens zien.' }
        ],
        feedback: 'Je verwijdert alleen jouw eigen exemplaar. De schermfoto van een klasgenoot blijft gewoon staan.'
      },
      {
        prompt: 'Waarom helpt een zin in je bio niet om je profiel privé te maken?',
        leerdoel: LD_3_3[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Omdat je bio te kort is voor zo’n hele lange mededeling.', correct: false, misconception: 'Denkt dat het aan de lengte ligt en niet aan wie de tekst leest.' },
          { text: 'Omdat je bio alleen zichtbaar is voor mensen die je al volgen.', correct: false, misconception: 'Denkt dat een bio verborgen is, terwijl die juist openbaar staat.' },
          { text: 'Omdat de app die tekst niet leest en niets afsluit.', correct: true, explanation: 'Alleen de schakelaar Privé-account regelt wie jouw profiel mag zien.' },
          { text: 'Omdat je bio elke keer verdwijnt als je een nieuwe foto post.', correct: false, misconception: 'Denkt dat een bio net zo tijdelijk is als een verhaal.' }
        ],
        feedback: 'Een app leest geen wensen, alleen instellingen. Zet dus de schakelaar om en controleer daarna je volgers.'
      },
      {
        prompt: 'Welke gegevens deel je beter niet op een openbaar profiel?',
        leerdoel: LD_3_3[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Alles waar een foto van jezelf op te zien is.', correct: false, misconception: 'Denkt dat elke foto van jezelf gevaarlijk is, waardoor de regel onbruikbaar wordt.' },
          { text: 'Alleen dingen waar je je later voor zou schamen.', correct: false, misconception: 'Denkt dat het om schaamte gaat en niet om bruikbaarheid voor een ander.' },
          { text: 'Alles wat zegt waar je bent, wanneer, of wie je officieel bent.', correct: true, explanation: 'Juist die drie soorten gegevens maken misbruik en identiteitsfraude mogelijk.' },
          { text: 'Alles waar iemand anders ook op de achtergrond op staat.', correct: false, misconception: 'Denkt aan de privacy van anderen en vergeet de eigen gegevens.' }
        ],
        feedback: 'Onthoud de drie vragen: waar, wanneer en wie. Gaat het antwoord ja, dan hoort het niet openbaar.'
      },
      {
        prompt: 'Wat hoort bij cyberpesten?',
        leerdoel: LD_3_3[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Een bewerkte foto van iemand rondsturen in een groepschat.', correct: true, explanation: 'Gemene berichten, bewerkte foto’s en buitensluiten zijn de drie bekendste vormen.' },
          { text: 'Een klasgenoot die jou per ongeluk niet terug appt na school.', correct: false, misconception: 'Ziet elk vervelend moment online als pesten.' },
          { text: 'Een app die jou reclame stuurt over dingen die je bekeken hebt.', correct: false, misconception: 'Verwart hinderlijke reclame met pesten door mensen.' },
          { text: 'Een onbekende die jou een nepmail stuurt over een pakketje.', correct: false, misconception: 'Verwart phishing met cyberpesten, omdat allebei onveilig voelen.' }
        ],
        feedback: 'Bij pesten is er één persoon het doelwit en is kwetsen het doel. Bij phishing gaat het om gegevens of geld.'
      },
      {
        prompt: 'Wat is de allereerste stap bij een verdacht bericht?',
        leerdoel: LD_3_4[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'De afzender opzoeken op de officiële website van dat bedrijf.', correct: false, misconception: 'Kent het stappenplan wel, maar begint bij stap 2 in plaats van stap 1.' },
          { text: 'Niets aanklikken en niets invullen.', correct: true, explanation: 'Deze stap is bij elk verdacht bericht hetzelfde, dus je hoeft niets te bedenken.' },
          { text: 'Het bericht doorsturen naar je mentor zodat die het kan bekijken.', correct: false, misconception: 'Wil meteen melden, waardoor de link intussen verder verspreid wordt.' },
          { text: 'De afzender blokkeren zodat hij je niets meer kan sturen.', correct: false, misconception: 'Begint bij de laatste stap, waardoor het bewijs verdwijnt.' }
        ],
        feedback: 'Stap 1 is altijd hetzelfde: je handen stil. Alle andere stappen kunnen daarna nog rustig.'
      },
      {
        prompt: 'Je hebt een verdacht bericht gecontroleerd en het blijkt nep. Wat is de laatste stap uit je noodkaart?',
        leerdoel: LD_3_4[0],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Terugschrijven dat je weet dat het nep is en niets zult doen.', correct: false, misconception: 'Denkt dat antwoorden helpt, terwijl het bevestigt dat je adres werkt.' },
          { text: 'Het bericht meteen verwijderen zodat je het niet meer ziet.', correct: false, misconception: 'Ruimt op en gooit daarmee het bewijs weg dat nodig is voor een melding.' },
          { text: 'De link openen in een ander programma om te kijken wat er staat.', correct: false, misconception: 'Denkt dat een andere app of browser de link ongevaarlijk maakt.' },
          { text: 'Schermfoto maken, melden en de afzender blokkeren.', correct: true, explanation: 'De schermfoto is je bewijs, en melden zorgt dat er ook iets mee gebeurt.' }
        ],
        feedback: 'Eerst bewijs, dan melden, dan blokkeren. In die volgorde raak je niets kwijt wat je later nodig hebt.'
      },
      {
        prompt: 'Welke drie maatregelen beschermen jouw gegevens het best bij elkaar?',
        leerdoel: LD_3_4[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Een lang wachtwoord, een tweede inlogstap en je profiel op privé.', correct: true, explanation: 'Deze drie dekken elk een ander gat: raden, stelen en meekijken.' },
          { text: 'Een korte gebruikersnaam, veel volgers en een nette profielfoto.', correct: false, misconception: 'Denkt dat een verzorgd profiel ook een veilig profiel is.' },
          { text: 'Je telefoon uitzetten, je bio leeghalen en je app opnieuw laden.', correct: false, misconception: 'Doet dingen die zichtbaar moeite kosten maar niets beveiligen.' },
          { text: 'Alleen op wifi van school, veel updates en een groot geheugen.', correct: false, misconception: 'Denkt dat een snel en schoon toestel hetzelfde is als een beveiligd account.' }
        ],
        feedback: 'Drie lagen die elk iets anders tegenhouden. Eén laag is altijd te weinig, want elke laag heeft een zwakke plek.'
      },
      {
        prompt: 'Je docent vraagt om bewijs dat je jezelf online beter beschermt. Beschrijf twee bewijsstukken die je inlevert. Leg bij elk uit wat er precies op te zien is.',
        type: 'open',
        leerdoel: LD_3_4[1],
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Bewijsstuk 1 is een schermfoto van het beveiligingsscherm van mijn mail. Daarop is te zien dat de tweede inlogstap aanstaat. Dat bewijst dat een gestolen wachtwoord bij mij niet genoeg is. Bewijsstuk 2 is een schermfoto van mijn privacy-instellingen. Daarop staat de schakelaar Privé-account aan. Dat bewijst dat alleen mensen die ik goedkeur mijn profiel zien. Ik lever geen schermfoto van een verwijderde mail in. Dat laat namelijk iets anders zien dan wat ik beweer.',
        nakijkpunten: [
          'Noemt twee verschillende bewijsstukken, bijvoorbeeld de tweede inlogstap en het profiel op privé.',
          'Zegt bij elk bewijsstuk wat er precies op te zien is en welke bewering daarmee klopt.',
          'Maakt duidelijk dat bewijs iets moet laten zien en niet alleen iets mag vertellen.'
        ],
        feedback: 'Goed bewijs laat zien wát er gelukt is. Kijk bij elk stuk of het echt de zin bewijst die je erbij schrijft.'
      },
      // Vier vragen die de dekking gelijktrekken. Zonder deze werden vier
      // leerdoelen maar één keer bevraagd: digitale weerbaarheid, wat phishing
      // is, dat een post blijft bestaan, en de privacy-instellingen. Met deze
      // vier komt elk van de elf verplichte leerdoelen precies twee keer terug.
      {
        prompt: 'Twee leerlingen krijgen dezelfde rare link. Wie van de twee is digitaal weerbaar?',
        leerdoel: LD_3_1[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Nour klikt de link open om te kijken wat er gebeurt.', correct: false, misconception: 'Denkt dat kijken zonder invullen geen kwaad kan.' },
          { text: 'Tim klikt niet en vraagt het eerst aan zijn mentor.', correct: true, explanation: 'Hij merkt het, hij houdt zich in, en hij zoekt hulp buiten het bericht om.' },
          { text: 'Sem stuurt de link door aan de groepschat van zijn klas.', correct: false, misconception: 'Vraagt hulp op een manier die de link juist verder verspreidt.' },
          { text: 'Bo antwoordt op het bericht dat ze geen interesse heeft.', correct: false, misconception: 'Denkt dat antwoorden netjes is, terwijl het bevestigt dat haar nummer werkt.' }
        ],
        feedback: 'Weerbaar zijn zie je aan de keuze op het moment zelf. Niet klikken is hier de hele prestatie.'
      },
      {
        prompt: 'Bij phishing wordt er niets gekraakt: jij vult je gegevens zelf in.',
        type: 'waar-niet-waar',
        waar: true,
        leerdoel: LD_3_2[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        feedback: 'Klopt, en dat is meteen het verschil met hacken. De dader hoeft alleen te wachten tot jij iets doet.'
      },
      {
        prompt: 'Wat is een digitale voetafdruk?',
        leerdoel: LD_3_3[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'De grootte van het scherm waarop jij het vaakst kijkt.', correct: false, misconception: 'Leest voetafdruk als een maat van het apparaat.' },
          { text: 'Het aantal volgers dat jij op je account hebt staan.', correct: false, misconception: 'Denkt dat het om zichtbaarheid bij mensen gaat en niet om sporen.' },
          { text: 'De tijd die jij per dag op je telefoon doorbrengt.', correct: false, misconception: 'Verwart je voetafdruk met je schermtijd.' },
          { text: 'Alle sporen die jij op internet achterlaat bij elkaar.', correct: true, explanation: 'Ook sporen die anderen van jou maakten horen erbij, en die kun jij niet weghalen.' }
        ],
        feedback: 'Een voetafdruk is wat je achterlaat, niet wat je meedraagt. Hij groeit ook als jij niets post.'
      },
      {
        prompt: 'Je hebt je account op privé gezet. Wat moet daarna nog gebeuren?',
        leerdoel: LD_3_3[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Je bio aanvullen met de zin dat je profiel nu privé is.', correct: false, misconception: 'Denkt dat een mededeling in de bio iets regelt.' },
          { text: 'Je oude berichten allemaal opnieuw plaatsen.', correct: false, misconception: 'Denkt dat de instelling met terugwerkende kracht opnieuw moet.' },
          { text: 'Je volgerslijst nalopen en onbekenden eruit halen.', correct: true, explanation: 'De schakelaar houdt nieuwe onbekenden buiten; wie er al in zat kijkt gewoon door.' },
          { text: 'Je wachtwoord veranderen in een korter wachtwoord.', correct: false, misconception: 'Denkt dat elke beveiligingsstap met het wachtwoord te maken heeft.' }
        ],
        feedback: 'De schakelaar doet de deur dicht. Daarna kijk je pas wie er al binnen stond.'
      }
    ]
  }
};
