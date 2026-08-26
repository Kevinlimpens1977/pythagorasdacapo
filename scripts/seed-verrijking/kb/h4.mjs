// Verrijkingslaag hoofdstuk 4 - Werken met Word, Excel en PowerPoint.
// KADERBEROEPSGERICHTE LEERWEG (kb).
//
// Zie scripts/seed-verrijking/PATROON.md voor het formaat van een vraag, de
// regels over afleiders en de eisen aan feedback. De structuur, de lesstof, de
// startcheck en het oefenblok staan in scripts/seed-structuur/kb/h4.mjs.
//
// BRON. Het Wikiwijs-arrangement "Digitale Geletterdheid" van DaCapo College:
//   4.1 <- les 4 (Word 1/2), 4.2 en 4.3 <- les 5 (Word 2/2),
//   4.5 <- les 6 (PowerPoint 1/2), 4.6 <- les 7 (PowerPoint 2/2),
//   4.7 <- les 8 (eindtoets basisvaardigheden ICT, les 1 t/m 7).
//   4.4 is TOEGEVOEGD en heeft geen bronles; de bronvermelding staat in de
//   praktijkopdracht in het structuurbestand.
// De vragen uit de Wikiwijs-toetsen van les 4 en les 8 zijn allemaal verwerkt.
// Twee bronvragen konden niet een-op-een mee, omdat HELIX het vraagtype niet
// kent: de twee klikvragen op een afbeelding (waar zie je aan deze ING-mail dat
// het phishing is, en waar kies je de opslaglocatie). Hun inhoud staat wel in de
// toets, maar als meerkeuzevraag.
//
// OPZET, volgens de blauwdruk en het kb-profiel:
//   - elk leerdoel heeft zijn eigen startvraag; die staan als `checks` in het
//     structuurbestand, met antwoord, uitleg en het leerdoel erbij. 4.1 opent
//     daarnaast met twee voorkennisitems over hoofdstuk 3;
//   - elk theorieblok heeft hier een uitgewerkt voorbeeld (vraag + volledige
//     uitwerking). Dat voorbeeld staat VOOR het oefenblok en dus voor het
//     zelfstandig oefenen;
//   - elke afsluitquiz vanaf 4.2 heeft minstens een terugkeervraag naar een
//     leerdoel van een eerdere paragraaf van dit hoofdstuk: 4.2 kijkt terug naar
//     4.1, 4.3 naar 4.2, 4.4 naar 4.3, 4.5 naar 4.3 en 4.6 naar 4.5;
//   - de hoofdstuktoets 4.7 bevraagt elk van de twintig verplichte leerdoelen
//     van 4.1 tot en met 4.7 minstens een keer, in 27 vragen. De vier gebieden
//     van bronles 8 (je account, je device, veilig internet, en Word met Excel
//     en PowerPoint) komen daarin alle vier terug;
//   - kb-vorm: veel korte goed/fout-vragen naast meerkeuze, en per blok hooguit
//     een of twee open vragen. De afleiders zijn ongeveer even lang als het
//     goede antwoord, zodat blind de langste knop klikken niets oplevert. De
//     reden staat in `explanation`, niet in de antwoordtekst.
//
// De kb-vragen zijn opnieuw geschreven en NIET overgenomen uit tl/h4.mjs. Zelfde
// onderwerpen en dezelfde leerdoelen, maar kort geformuleerd, een idee per zin,
// en met situaties uit de leefwereld van een brugklasser.

export default {
  // 4.1 Word: je eerste document met voorblad, opmaak en paginanummers
  '4.1': {
    learningGoals: [
      'Je kunt een Word-document maken, een duidelijke naam geven en op de juiste plek opslaan.',
      'Je kunt een automatisch voorblad invoegen en invullen.',
      'Je kunt tekst dikgedrukt, schuin of onderstreept maken en paginanummers toevoegen.'
    ],
    theorie: [
      {
        keyTerms: ['werkbalk', 'floppy disc', 'bureaublad'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Noor slaat haar verslag op als opdracht.docx, op het bureaublad van lokaal 12. Thuis vindt ze dat bestand daarna niet meer terug. Wat ging er precies mis?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: kijk eerst naar de naam, want opdracht.docx zegt helemaal niets over de inhoud. Stap 2: kijk daarna naar de plek, want het bureaublad hoort bij die ene laptop in dat ene lokaal. Stap 3: bedenk wat er dan thuis gebeurt, waar Noor inlogt op haar eigen laptop. Daar staat haar bestand natuurlijk niet, want dat is een heel andere computer. Zo doet Noor het beter: ze noemt het bestand Verslag_Oefening_Noor_1B en slaat het op in OneDrive. OneDrive hoort namelijk bij haar eigen account, dus haar bestand reist gewoon met haar mee.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['voorblad', 'Auteur', 'opmaak', 'selecteren'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sam typt zijn titel zelf heel groot midden op pagina 1 van zijn verslag. Hij zegt: dat is toch precies hetzelfde als een voorblad? Klopt dat?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: kijk wat er allemaal op een voorblad hoort, namelijk de titel, je naam, de datum en je klas. Stap 2: tel na wat Sam daarvan heeft, en dat is alleen een titel, dus drie dingen missen. Stap 3: typ er bij Sam eens een regel bij, dan schuift zijn hele pagina meteen door elkaar. Bij een echt voorblad blijft de opmaak juist helemaal vanzelf netjes staan. Sam haalt daarom zijn eigen pagina weg en klikt op Invoegen en dan op Voorblad. Daarna vult hij netjes de velden Titel, Subtitel, Auteur, Datum en Cursus in.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Je slaat je document meteen op, dus voordat je iets typt. Je kiest daarbij twee dingen: een naam die iets zegt en een plek waar je erbij kunt. Een automatisch voorblad haal je op via Invoegen, en de vijf velden vul je daarna zelf in. Tekst maak je dikgedrukt met CTRL + B, schuin met CTRL + i en onderstreept met CTRL + U. Selecteer die tekst altijd eerst, anders weet Word niet welk stuk je bedoelt. Een paginanummer zet je eronder via Invoegen en dan de knop Paginanummer.</p>',
      keyTerms: ['Invoegen', 'dikgedrukt', 'paginanummer']
    },
    vragen: [
      {
        prompt: 'Je wilt thuis verder werken aan het verslag dat je op school begon. Waar sla je het bestand op?',
        options: [
          { text: 'In OneDrive, want dat hoort bij jouw account en niet bij een laptop.', correct: true, explanation: 'Je logt thuis in met hetzelfde account, dus je bestand staat daar gewoon klaar.' },
          { text: 'In de map Downloads, want daar komt alles automatisch terecht.', correct: false, misconception: 'Denkt dat Downloads een vaste bewaarplek is in plaats van een doorgeefmap.' },
          { text: 'In de prullenbak, want daar blijft het een tijdje bewaard staan.', correct: false, misconception: 'Verwart bewaren met verwijderen; in de prullenbak staat wat je weg wilde doen.' },
          { text: 'Op het bureaublad, want daar staat het meteen in beeld.', correct: false, misconception: 'Kiest de plek die het snelst te zien is, niet de plek die overal te openen is.' }
        ],
        feedback: 'Het bureaublad hoort bij een apparaat. OneDrive hoort bij jou, dus je opent je werk op elke computer.',
        leerdoel: 'Je kunt een Word-document maken, een duidelijke naam geven en op de juiste plek opslaan.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Een bestand dat Document1 heet, kun je over drie weken net zo makkelijk terugvinden als Verslag_Oefening_Sara_1K2.',
        waar: false,
        leerdoel: 'Je kunt een Word-document maken, een duidelijke naam geven en op de juiste plek opslaan.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Een naam is bedoeld voor later. Document1 zegt niets, dus dan moet je elk bestand openen om te kijken.'
      },
      {
        prompt: 'Wie vult de velden Titel, Auteur en Cursus in op een automatisch voorblad?',
        options: [
          { text: 'Je docent vult ze in als hij je verslag nakijkt in Word.', correct: false, misconception: 'Legt het invullen bij iemand anders neer in plaats van bij de maker.' },
          { text: 'Jij vult ze zelf in, want Word levert alleen de lege velden.', correct: true, explanation: 'Het voorblad regelt de vormgeving. De inhoud van elk veld komt van jou.' },
          { text: 'Word vult ze zelf in, want het programma kent jouw gegevens.', correct: false, misconception: 'Denkt dat Word je naam en klas weet omdat de pagina al kant-en-klaar oogt.' }
        ],
        feedback: 'Het voorblad zet de vorm al klaar; jij hoeft alleen de velden nog te vullen. Word weet niet hoe jij heet of in welke klas je zit.',
        leerdoel: 'Je kunt een automatisch voorblad invoegen en invullen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'ik_doe_voor'
      },
      {
        prompt: 'Onder welk tabblad van de werkbalk zoek je de knop Voorblad?',
        options: [
          { text: 'Onder Start, want daar begin je altijd met een nieuw stuk.', correct: false, misconception: 'Ziet Start als het beginpunt van een document, terwijl daar de opmaakknoppen staan.' },
          { text: 'Onder Indeling, want dat gaat over de indeling van je pagina.', correct: false, misconception: 'Kiest op het woord indeling af, terwijl dat tabblad marges en kolommen regelt.' },
          { text: 'Onder Invoegen, want daar staat alles wat je toevoegt.', correct: true, explanation: 'Voorblad, paginanummer en afbeelding staan alle drie onder Invoegen.' },
          { text: 'Onder Ontwerpen, want dat gaat over hoe je verslag eruitziet.', correct: false, misconception: 'Denkt dat een mooie pagina onder Ontwerpen hoort, want dat woord klinkt als vormgeving.' }
        ],
        feedback: 'Onthoud de regel: toevoegen doe je onder Invoegen. Dat geldt in dit hoofdstuk voor bijna alles.',
        leerdoel: 'Je kunt een automatisch voorblad invoegen en invullen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Je wilt de titel onderstrepen en twee kernwoorden dik maken. Welke twee sneltoetsen gebruik je?',
        options: [
          { text: 'CTRL + B voor de titel en CTRL + i voor de kernwoorden.', correct: false, misconception: 'Verwisselt dikgedrukt en onderstrepen, omdat beide knoppen naast elkaar staan.' },
          { text: 'CTRL + i voor de titel en CTRL + U voor de kernwoorden.', correct: false, misconception: 'Denkt dat schuin en onderstreept hetzelfde effect geven.' },
          { text: 'CTRL + S voor de titel en CTRL + B voor de kernwoorden.', correct: false, misconception: 'Ziet CTRL + S voor een opmaaktoets aan, terwijl die alleen opslaat.' },
          { text: 'CTRL + U voor de titel en CTRL + B voor de kernwoorden.', correct: true, explanation: 'De letters komen uit het Engels: U van underline en B van bold.' }
        ],
        feedback: 'B van bold, i van italic en U van underline. En selecteer altijd eerst je tekst, anders gebeurt er niets.',
        leerdoel: 'Je kunt tekst dikgedrukt, schuin of onderstreept maken en paginanummers toevoegen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Leg uit waarom paginanummers handig zijn in een verslag van tien pagina\'s.',
        type: 'open',
        modelAnswer: 'Bij tien pagina\'s ziet je lezer niet alles in een keer. Met paginanummers kan hij naar een plek bladeren. Je kunt ook zeggen op welke pagina iets staat. En de inhoudsopgave gebruikt diezelfde nummers om naar je hoofdstukken te wijzen.',
        nakijkpunten: [
          'Noemt dat de lezer bij een lang verslag moet kunnen bladeren of zoeken.',
          'Legt een verband met verwijzen naar een plek, bijvoorbeeld via de inhoudsopgave.',
          'Schrijft het in eigen woorden en niet als overgeschreven zin uit de les.'
        ],
        feedback: 'Een nummer is pas nuttig als je ernaar kunt verwijzen. Bij een half A4 hoeft dat niet, bij tien pagina\'s wel.',
        leerdoel: 'Je kunt tekst dikgedrukt, schuin of onderstreept maken en paginanummers toevoegen.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren'
      },
      {
        prompt: 'Terug naar hoofdstuk 3. Je verslag staat in OneDrive, achter je schoolwachtwoord. Wat beschermt dat werk het best?',
        options: [
          { text: 'Je wachtwoord opschrijven in je agenda, zodat je het nooit vergeet.', correct: false, misconception: 'Denkt dat onthouden het probleem is en legt het wachtwoord juist op straat.' },
          { text: 'Twee-staps-verificatie aanzetten op je schoolaccount.', correct: true, explanation: 'Naast je wachtwoord is dan ook je telefoon nodig, en die heeft een dief niet.' },
          { text: 'Je wachtwoord delen met een klasgenoot die je goed vertrouwt.', correct: false, misconception: 'Ziet vertrouwen als beveiliging, terwijl elke extra persoon een extra lek is.' },
          { text: 'Elke week een ander kort wachtwoord kiezen dat je snel typt.', correct: false, misconception: 'Denkt dat vaak wisselen belangrijker is dan de lengte van je wachtwoord.' }
        ],
        feedback: 'Deze vraag haalt hoofdstuk 3 terug. Al je werk van dit hoofdstuk hangt straks aan dat ene account.',
        leerdoel: 'Je kunt een Word-document maken, een duidelijke naam geven en op de juiste plek opslaan.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren'
      },
      {
        prompt: 'Terug naar hoofdstuk 2. Je slaat je verslag op in OneDrive. Is OneDrive hardware of software?',
        options: [
          { text: 'Hardware, want je bestand belandt ergens op een echte schijf.', correct: false, misconception: 'Verwart de plek waar data landt met het programma dat je bedient.' },
          { text: 'Geen van beide, want de cloud staat helemaal los van je computer.', correct: false, misconception: 'Denkt dat de cloud buiten de indeling hardware en software valt.' },
          { text: 'Software, want het is een programma dat je opent en bedient.', correct: true, explanation: 'Je kunt OneDrive niet vastpakken; je gebruikt het net als Word.' },
          { text: 'Allebei tegelijk, want je hebt er een muis en een toetsenbord bij nodig.', correct: false, misconception: 'Rekent de randapparaten mee waarmee je het programma bedient.' }
        ],
        feedback: 'Deze vraag haalt hoofdstuk 2 terug. Kun je het vastpakken? Dan pas heb je het over hardware.',
        leerdoel: 'Je kunt een Word-document maken, een duidelijke naam geven en op de juiste plek opslaan.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'reflecteren'
      }
    ]
  },

  // 4.2 Koppen en een automatische inhoudsopgave
  '4.2': {
    learningGoals: [
      'Je kunt tekst opmaken met de stijlen Kop 1 en Kop 2.',
      'Je kunt een automatische inhoudsopgave invoegen en bijwerken.',
      'Je weet waarom koppen je verslag overzichtelijk maken.'
    ],
    theorie: [
      {
        keyTerms: ['koptekst', 'stijl', 'Kop 1', 'Kop 2'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Fenna maakt al haar kopjes zelf dik en 16 punten groot. Haar inhoudsopgave blijft daarna toch helemaal leeg. Waarom werkt dat niet?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: kijk wat Fenna precies gedaan heeft, want zij veranderde alleen hoe de letters eruitzien. Stap 2: kijk daarna wat Word eigenlijk nodig heeft, en dat is een label en geen dikke letters. Stap 3: bedenk hoe je zo\'n label geeft, dus je selecteert het kopje en klikt boven op Start. Daarna klik je in het vakje Stijlen op de stijl Kop 1. Stap 4: werk tot slot de lijst bij, want nu vindt Word de koppen wel. Fenna hoeft dus niets opnieuw te typen: ze geeft alleen elk kopje even een stijl.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['inhoudsopgave', 'Verwijzingen', 'bijwerken'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Jayden voegt achteraf nog een hoofdstuk 3 aan zijn verslag toe. In zijn inhoudsopgave staan daarna nog steeds maar twee hoofdstukken. Wat moet hij doen?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: snap eerst waarom het misgaat, want die lijst is een foto van het moment dat je hem maakte. Zo\'n foto verandert natuurlijk niet vanzelf mee als jij later iets toevoegt. Stap 2: klik op de inhoudsopgave, dan verschijnt bovenaan de knop Inhoudsopgave bijwerken. Stap 3: klik op die knop, dan vraagt Word wat hij precies moet bijwerken. Stap 4: kies daar voor Hele inhoudsopgave bijwerken en niet voor alleen de paginanummers. Stap 5: kijk of hoofdstuk 3 er nu ook in staat en of de nummers weer kloppen. Doe dit altijd nog even vlak voordat je je verslag inlevert.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een kopje maak je niet zelf dik, maar je geeft het een stijl uit het vakje Stijlen. Dat vakje met stijlen vind je boven in de werkbalk op het tabblad Start. Kop 1 hoort bij een hoofdstuk en Kop 2 bij een stukje daaronder. Word zoekt al die stijlen zelf op en maakt er daarna een lijst van. Die lijst voeg je in via Verwijzingen en dan de knop Inhoudsopgave. Verander je later iets, dan werk je de lijst bij met Hele inhoudsopgave bijwerken. Koppen geven je verslag structuur, zodat je lezer meteen ziet hoe het is opgebouwd.</p>',
      keyTerms: ['Stijlen', 'structuur']
    },
    vragen: [
      {
        prompt: 'Waarom herkent Word een kopje niet als je het alleen zelf dik en groot maakt?',
        options: [
          { text: 'Omdat je dan een label mist en Word alleen labels opzoekt.', correct: true, explanation: 'De stijl Kop 1 is dat label. Dik en groot verandert alleen het uiterlijk.' },
          { text: 'Omdat Word pas kopjes ziet zodra je het bestand hebt opgeslagen.', correct: false, misconception: 'Denkt dat opslaan nodig is voordat Word iets in het document herkent.' },
          { text: 'Omdat een dikke letter in Word altijd bij gewone tekst hoort.', correct: false, misconception: 'Denkt dat dikgedrukte tekst per definitie geen kop kan zijn.' },
          { text: 'Omdat Word alleen kopjes van maximaal drie woorden herkent.', correct: false, misconception: 'Denkt dat de lengte van een kopje bepaalt of Word het oppikt.' }
        ],
        feedback: 'Uiterlijk en label zijn twee verschillende dingen. Word kijkt naar het label, jouw lezer kijkt naar het uiterlijk.',
        leerdoel: 'Je kunt tekst opmaken met de stijlen Kop 1 en Kop 2.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'ik_doe_voor'
      },
      {
        prompt: 'Kop 2 gebruik je voor een stukje dat onder een hoofdstuk met Kop 1 hoort.',
        waar: true,
        leerdoel: 'Je kunt tekst opmaken met de stijlen Kop 1 en Kop 2.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Denk aan een boom. Kop 1 is een dikke tak aan de stam en Kop 2 is een tak aan die dikke tak.'
      },
      {
        prompt: 'Onder welk tabblad staat de knop Inhoudsopgave?',
        options: [
          { text: 'Onder Invoegen, net als het voorblad en het paginanummer.', correct: false, misconception: 'Trekt de regel over Invoegen door, terwijl dit juist de uitzondering is.' },
          { text: 'Onder Verwijzingen, want die lijst verwijst naar je pagina\'s.', correct: true, explanation: 'De inhoudsopgave is het enige onderdeel uit deze les dat niet onder Invoegen staat.' },
          { text: 'Onder Start, want daar staat ook het vakje met de stijlen.', correct: false, misconception: 'Denkt dat alles rond koppen bij elkaar staat, omdat de stijlen onder Start zitten.' },
          { text: 'Onder Beeld, want daar zie je hoe je document eruitziet.', correct: false, misconception: 'Kiest het tabblad dat over weergave gaat in plaats van over inhoud.' }
        ],
        feedback: 'Let goed op dit tabblad. Alles wat je toevoegt staat onder Invoegen, behalve juist deze lijst.',
        leerdoel: 'Je kunt een automatische inhoudsopgave invoegen en bijwerken.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Je hebt er een hoofdstuk bij getypt, maar je lijst voorin toont dat hoofdstuk nog niet. Wat doe je?',
        options: [
          { text: 'Je typt het hoofdstuk er met de hand onderaan de lijst bij.', correct: false, misconception: 'Repareert het gevolg met de hand, waardoor de lijst bij de volgende wijziging weer scheef staat.' },
          { text: 'Je verwijdert de lijst en voegt een compleet nieuwe lijst in.', correct: false, misconception: 'Denkt dat opnieuw beginnen de enige manier is om de lijst te vernieuwen.' },
          { text: 'Je klikt erop en kiest Hele inhoudsopgave bijwerken.', correct: true, explanation: 'Word haalt dan opnieuw alle koppen op en zet er de goede nummers achter.' },
          { text: 'Je slaat het bestand op, want dan vernieuwt de lijst vanzelf.', correct: false, misconception: 'Denkt dat opslaan hetzelfde is als bijwerken.' }
        ],
        feedback: 'De lijst is een foto van een moment. Wie iets verandert, moet dus zelf even een nieuwe foto maken.',
        leerdoel: 'Je kunt een automatische inhoudsopgave invoegen en bijwerken.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Noem twee dingen die koppen opleveren in een verslag. Zeg er per ding bij voor wie het handig is.',
        type: 'open',
        modelAnswer: 'Ten eerste ziet mijn lezer meteen hoe mijn verslag is opgebouwd. Hij weet dan waar een nieuw onderwerp begint. Dat is handig voor de lezer. Ten tweede kan Word er een automatische inhoudsopgave van maken. Ik hoef dan zelf geen paginanummers op te zoeken. Dat is handig voor mij.',
        nakijkpunten: [
          'Noemt dat de lezer de opbouw van het verslag ziet.',
          'Noemt dat Word er een automatische inhoudsopgave van kan maken.',
          'Zegt er per voordeel bij voor wie het handig is: de lezer of de maker.'
        ],
        feedback: 'De ene winst is voor je lezer en de andere voor jezelf. Daarom lonen kopstijlen dubbel.',
        leerdoel: 'Je weet waarom koppen je verslag overzichtelijk maken.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren'
      },
      {
        prompt: 'Terug naar 4.1. Je bent kwijt waar je Word-bestand van vorige les gebleven is. Wat is de handigste eerste stap?',
        options: [
          { text: 'Wachten tot je docent het bestand voor je terugstuurt.', correct: false, misconception: 'Legt de verantwoordelijkheid voor het eigen bestand bij een ander.' },
          { text: 'Alle mappen op je bureaublad een voor een openklikken.', correct: false, misconception: 'Zoekt op de plek waar het bestand juist niet hoort te staan.' },
          { text: 'Een nieuw leeg document beginnen en alles opnieuw typen.', correct: false, misconception: 'Geeft het zoeken meteen op en doet het werk twee keer.' },
          { text: 'Zoeken op de naam die je het bestand gaf, in OneDrive.', correct: true, explanation: 'Daarom kies je een naam die iets zegt: je kunt erop zoeken.' }
        ],
        feedback: 'Deze vraag haalt 4.1 terug. Een duidelijke naam en OneDrive maken samen dat je je werk terugvindt.',
        leerdoel: 'Je kunt een Word-document maken, een duidelijke naam geven en op de juiste plek opslaan.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren'
      },
      {
        prompt: 'Terug naar 4.1. Welke vijf velden vul je in op een automatisch voorblad van Word?',
        options: [
          { text: 'Kop 1, Kop 2, Kop 3, Inhoudsopgave en Bronvermelding.', correct: false, misconception: 'Vult de stijlen van deze paragraaf in op de plek van de voorbladvelden.' },
          { text: 'Naam, Klas, Vak, Docent en het cijfer dat je verwacht.', correct: false, misconception: 'Bedenkt zelf logische velden in plaats van de velden die Word aanbiedt.' },
          { text: 'Titel, Subtitel, Auteur, Datum en Cursus.', correct: true, explanation: 'Precies die vijf velden staan klaar; jij hoeft ze alleen nog aan te klikken.' },
          { text: 'Titel, Inhoudsopgave, Hoofdstuk 1, Hoofdstuk 2 en Slot.', correct: false, misconception: 'Verwart de opbouw van het hele verslag met de velden op de eerste pagina.' }
        ],
        feedback: 'Deze vraag haalt 4.1 terug. Cursus is het veld waar je klas in komt, en Auteur is jouw naam.',
        leerdoel: 'Je kunt een automatisch voorblad invoegen en invullen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'reflecteren'
      }
    ]
  },

  // 4.3 Afbeeldingen invoegen en beeld dat je mag gebruiken
  '4.3': {
    learningGoals: [
      'Je kunt op Google zoeken naar afbeeldingen met een Creative Commons-licentie.',
      'Je kunt een afbeelding invoegen in Word en netjes bij je tekst plaatsen.',
      'Je weet waarom je niet zomaar elke afbeelding van internet mag gebruiken.'
    ],
    theorie: [
      {
        keyTerms: ['licentie', 'Creative Commons', 'zoekterm'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sem zegt: het plaatje staat gewoon op Google, dus het is vast gratis. Waar gaat zijn redenering precies mis?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: vraag je eerst af wie dat plaatje gemaakt heeft, en dat is een fotograaf, een tekenaar of een bedrijf. Stap 2: vraag je daarna af wie Google is, want Google laat plaatjes alleen maar zien en maakt ze niet. Stap 3: kijk wat er dan nog mist, en dat is dat niemand Sem ooit toestemming gegeven heeft. Stap 4: zoek die toestemming daarom vooraf op, dus Sem typt zijn zoekterm en klikt op Images. Daarna klikt hij op Tools en op usage rights, waar hij Creative Commons kiest. Nu krijgt Sem alleen nog plaatjes te zien die hij van de maker mag gebruiken.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['Indelingsopties', 'terugloop', 'bronregel'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Yara zet een foto precies midden in haar alinea over gamen. Haar zinnen vallen daardoor in twee losse stukken uit elkaar. Hoe lost ze dat op?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: klik een keer met je linkermuisknop op de foto in het document. Stap 2: zoek daarna het icoontje naast de rechterbovenhoek, want dat icoontje heet Indelingsopties. Stap 3: klik erop, dan klapt er een vakje open met de terugloopopties erin. Stap 4: probeer er drie uit, want bij boven en onder blijft haar alinea in stukken liggen. Bij de optie vierkant loopt de tekst juist netjes om de foto heen. Stap 5: Yara kiest daarom die laatste optie voor haar eigen foto. Stap 6: ze zet er tot slot de bronregel onder, met de naam van de maker.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Elk plaatje op internet is van iemand, dus je hebt toestemming nodig om het te gebruiken. Die toestemming van de maker heet een licentie. Op Google filter je erop via Images, dan Tools en dan usage rights, in het Nederlands Gebruiksrechten. Kies daar Creative Commons, en voeg je afbeelding daarna in via Invoegen en dan Afbeelding. Met het icoontje Indelingsopties kies je hoe je tekst om dat plaatje heen loopt. Zet er tot slot een regel onder met de naam van de maker erin.</p>',
      keyTerms: ['Gebruiksrechten', 'maker']
    },
    vragen: [
      {
        prompt: 'Op welke knop klik je in Google Afbeeldingen voordat je usage rights kunt kiezen?',
        options: [
          { text: 'Op Tools, de knop vlak onder het zoekvak.', correct: true, explanation: 'Pas als Tools openstaat, verschijnt de rij met filters waaronder usage rights.' },
          { text: 'Op Instellingen, want daar staan alle keuzes van Google.', correct: false, misconception: 'Zoekt de filters in het menu van de zoekmachine zelf.' },
          { text: 'Op Veilig zoeken, want dat filtert de resultaten al.', correct: false, misconception: 'Verwart een filter op aanstootgevend beeld met een filter op rechten.' },
          { text: 'Op Nieuws, want daar staan foto\'s die iedereen mag gebruiken.', correct: false, misconception: 'Denkt dat beeld bij nieuwsberichten automatisch vrij te gebruiken is.' }
        ],
        feedback: 'De stappen zijn in elke taal hetzelfde. Zie je Tools niet staan? Kijk dan of jouw Google die knop Filter noemt.',
        leerdoel: 'Je kunt op Google zoeken naar afbeeldingen met een Creative Commons-licentie.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor'
      },
      {
        prompt: 'Bij een Creative Commons-licentie mag je het plaatje gebruiken, meestal met de naam van de maker erbij.',
        waar: true,
        leerdoel: 'Je kunt op Google zoeken naar afbeeldingen met een Creative Commons-licentie.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'De maker geeft zijn werk gratis weg, maar wil er wel bij staan. Zijn naam is dan zijn beloning.'
      },
      {
        prompt: 'Hoe zet je een opgeslagen foto in je Word-verslag?',
        options: [
          { text: 'Via het tabblad Verwijzingen en dan de knop Afbeelding.', correct: false, misconception: 'Haalt Verwijzingen en Invoegen door elkaar na de vorige paragraaf.' },
          { text: 'Via het tabblad Invoegen en dan de knop Afbeelding.', correct: true, explanation: 'Alles wat je aan je document toevoegt, staat onder Invoegen.' },
          { text: 'Via het tabblad Start en dan de knop Afbeelding.', correct: false, misconception: 'Denkt dat Start het beginpunt voor alle handelingen is.' },
          { text: 'Via het tabblad Ontwerpen en dan de knop Afbeelding.', correct: false, misconception: 'Zoekt beeld onder het tabblad dat over vormgeving gaat.' }
        ],
        feedback: 'Dezelfde regel als bij het voorblad en het paginanummer: toevoegen doe je onder Invoegen.',
        leerdoel: 'Je kunt een afbeelding invoegen in Word en netjes bij je tekst plaatsen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Je foto duwt je zinnen uit elkaar. Met welk icoontje pas je dat aan?',
        options: [
          { text: 'Met het pijltjes-icoon waarmee je het plaatje draait.', correct: false, misconception: 'Kiest het gereedschap voor draaien in plaats van voor terugloop.' },
          { text: 'Met de knop Ongedaan maken bovenaan in de werkbalk.', correct: false, misconception: 'Draait de hele stap terug in plaats van het probleem op te lossen.' },
          { text: 'Met het icoontje Indelingsopties naast de rechterbovenhoek.', correct: true, explanation: 'Daarin staan de terugloopopties: die bepalen hoe je tekst om het plaatje loopt.' },
          { text: 'Met de witte puntjes op de rand van de afbeelding.', correct: false, misconception: 'Denkt dat kleiner maken hetzelfde is als de tekst anders laten lopen.' }
        ],
        feedback: 'Groter maken en terugloop zijn twee losse dingen. De puntjes veranderen het formaat, het icoontje de tekstloop.',
        leerdoel: 'Je kunt een afbeelding invoegen in Word en netjes bij je tekst plaatsen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Alles wat je op internet kunt zien, mag je ook zomaar in je eigen verslag zetten.',
        waar: false,
        leerdoel: 'Je weet waarom je niet zomaar elke afbeelding van internet mag gebruiken.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Kunnen zien is iets anders dan mogen gebruiken. Er zit altijd een maker achter het beeld.'
      },
      {
        prompt: 'Iemand plaatst jouw eigen vakantiefoto zonder vragen in zijn werkstuk. Leg uit wat dit met plaatjes van internet te maken heeft.',
        type: 'open',
        modelAnswer: 'Die foto is van mij, want ik heb hem gemaakt. Het voelt niet eerlijk als iemand hem zonder vragen gebruikt. Bij plaatjes op internet is dat net zo. Achter elk plaatje zit een maker. Je hebt zijn toestemming nodig. Die toestemming heet een licentie. Bij Creative Commons geeft de maker die toestemming vooraf, meestal met zijn naam erbij.',
        nakijkpunten: [
          'Legt uit dat achter elk plaatje een maker zit die er tijd in stak.',
          'Gebruikt het woord toestemming of licentie op de goede manier.',
          'Maakt de stap van de eigen foto naar plaatjes op internet.'
        ],
        feedback: 'Wie het van de andere kant bekijkt, snapt de regel meteen. Jouw werk is van jou, dat van een ander ook.',
        leerdoel: 'Je weet waarom je niet zomaar elke afbeelding van internet mag gebruiken.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren'
      },
      {
        prompt: 'Terug naar 4.2. Onder je foto zet je de bronregel. Welke stijl geef je die regel?',
        options: [
          { text: 'Geen kopstijl, want dit is gewone tekst onder je plaatje.', correct: true, explanation: 'Alleen Kop 1 en Kop 2 komen in je inhoudsopgave; een bronregel hoort daar niet in.' },
          { text: 'De stijl Titel, want de naam van de maker is belangrijk.', correct: false, misconception: 'Denkt dat belangrijk hetzelfde is als een kop, en zet er de zwaarste stijl op.' },
          { text: 'Kop 1, want elke losse regel in je verslag krijgt een kopstijl.', correct: false, misconception: 'Denkt dat kopstijlen er zijn voor alle korte regels.' },
          { text: 'Kop 2, want de bronregel hoort onder een groter hoofdstuk.', correct: false, misconception: 'Ziet de bronregel als een onderdeel van je opbouw in plaats van als bijschrift.' }
        ],
        feedback: 'Deze vraag haalt 4.2 terug. Kopstijlen zijn voor je opbouw, dus alleen wat in de inhoudsopgave hoort.',
        leerdoel: 'Je kunt tekst opmaken met de stijlen Kop 1 en Kop 2.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren'
      },
      {
        prompt: 'Terug naar 4.1. Met je afbeelding erbij is je verslag vier pagina\'s. Hoe zorg je dat elke pagina een nummer krijgt?',
        options: [
          { text: 'Je typt onderaan elke pagina zelf het nummer erbij.', correct: false, misconception: 'Doet met de hand wat Word bijhoudt, dus na een wijziging klopt het niet meer.' },
          { text: 'Via Invoegen en dan Paginanummer, en daarna kies je de plek.', correct: true, explanation: 'Word telt de nummers zelf door, ook als je later een pagina toevoegt.' },
          { text: 'Via Ontwerpen, want daar staat alles over de vorm van je pagina.', correct: false, misconception: 'Kiest het tabblad over vormgeving in plaats van dat over toevoegen.' },
          { text: 'Dat gaat vanzelf zodra je een inhoudsopgave invoegt.', correct: false, misconception: 'Denkt dat de inhoudsopgave de nummers op de pagina zet.' }
        ],
        feedback: 'Deze vraag haalt 4.1 terug. Alles wat je aan je document toevoegt, zoek je onder Invoegen.',
        leerdoel: 'Je kunt tekst dikgedrukt, schuin of onderstreept maken en paginanummers toevoegen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren'
      }
    ]
  },

  // 4.4 Gegevens in Excel: tabel, formule en grafiek
  '4.4': {
    learningGoals: [
      'Je kunt gegevens netjes in een tabel zetten in Excel.',
      'Je kunt met een eenvoudige formule optellen en een gemiddelde berekenen.',
      'Je kunt van je tabel een grafiek maken en die aflezen.'
    ],
    theorie: [
      {
        keyTerms: ['cel', 'kolom', 'rij', 'kopregel'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Bilal zet zijn zeven getallen netjes onder elkaar in Excel, maar laat de bovenste regel leeg. Waarom is die lege bovenste regel een probleem?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: kijk wat iemand anders op dat scherm ziet, en dat zijn alleen zeven losse getallen in een kolom. Stap 2: vraag je af wat die getallen eigenlijk betekenen, want zijn het stappen, minuten of cijfers? Dat weet niemand, en over twee weken weet Bilal het zelf ook niet meer. Stap 3: vul daarom de kopregel in, dus in A1 komt Dag en in B1 komt Aantal stappen. Stap 4: kijk wat dat oplevert, want nu weet elke lezer wat er in welke kolom staat. En het woord stappen staat er nu netjes een keer, in plaats van zeven keer.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['isgelijkteken', 'celbereik', 'GEMIDDELDE', 'kolomdiagram'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Lynn typt in het vakje B9 de tekst 8500+9200+7100. Er verschijnt daarna geen enkele uitkomst in beeld. Wat moet ze veranderen?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: kijk of er vooraan een isgelijkteken staat, want zonder dat teken gaat Excel niet rekenen. Excel probeert de invoer dan als getal te lezen, maar 8500+9200+7100 is geen getal. Wat overblijft is voor Excel dus gewoon een stukje tekst, en tekst blijft staan zoals je het typt. Stap 2: zet er een isgelijkteken voor, dan rekent Excel wel en komt er 24800 te staan. Stap 3: bedenk daarna wat er nog beter kan, want Lynn typte alle getallen zelf over. Verandert er later een van die getallen, dan klopt haar som ineens niet meer. Stap 4: gebruik daarom de adressen van de vakjes, dus Lynn typt =SOM(B2:B4). Stap 5: verander nu een getal in de tabel, en het totaal past zich vanzelf aan.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Elk vakje in Excel heeft een eigen adres, zoals bijvoorbeeld het vakje B3. De letter van dat adres hoort bij de kolom en het cijfer hoort bij de rij. Bovenaan je tabel zet je een kopregel met de namen van al je kolommen. De getallen eronder typ je kaal in, dus zonder een woord erachter. Elke formule in Excel begint met een isgelijkteken ervoor. Met =SOM(B2:B8) tel je op en met =GEMIDDELDE(B2:B8) bereken je het gemiddelde. Selecteer je gegevens met de kopregel en klik op Invoegen om er een grafiek van te maken.</p>',
      keyTerms: ['SOM', 'grafiek']
    },
    vragen: [
      {
        prompt: 'Welk vakje bedoel je als je B3 opschrijft?',
        options: [
          { text: 'Het vakje in de tweede kolom en de derde rij.', correct: true, explanation: 'De letter hoort altijd bij de kolom en het cijfer bij de rij.' },
          { text: 'Het derde vakje van de bovenste rij van je tabel.', correct: false, misconception: 'Telt vanaf de kopregel door en negeert de letter.' },
          { text: 'Het vakje met de derde grootste waarde van kolom B.', correct: false, misconception: 'Denkt dat het cijfer iets over de inhoud zegt in plaats van over de plek.' },
          { text: 'Het vakje in de derde kolom en de tweede rij.', correct: false, misconception: 'Draait letter en cijfer om en leest het adres van rechts naar links.' }
        ],
        feedback: 'Eerst de letter, dan het cijfer. Kolommen lopen van boven naar beneden, rijen van links naar rechts.',
        leerdoel: 'Je kunt gegevens netjes in een tabel zetten in Excel.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor'
      },
      {
        prompt: 'In je kolom met getallen typ je het beste 8500 stappen, zodat iedereen ziet wat het getal betekent.',
        waar: false,
        leerdoel: 'Je kunt gegevens netjes in een tabel zetten in Excel.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Met een woord erachter wordt het vakje tekst. De eenheid hoort een keer bovenaan, in de kopregel.'
      },
      {
        prompt: 'Met welke formule tel je alle getallen van B2 tot en met B8 bij elkaar op?',
        options: [
          { text: '=SOM(B2+B8), want het plusteken zegt dat je optelt.', correct: false, misconception: 'Gebruikt een plusteken en telt daardoor alleen het eerste en het laatste vakje op.' },
          { text: '=SOM(B2:B8), want de dubbele punt betekent tot en met.', correct: true, explanation: 'Het celbereik B2:B8 pakt alle zeven vakjes en niet alleen de twee uiterste.' },
          { text: '=TOTAAL(B2:B8), want je wilt het totaal weten.', correct: false, misconception: 'Verzint een functienaam die op het Nederlandse woord lijkt.' },
          { text: 'SOM(B2:B8), zonder teken ervoor, want de naam is genoeg.', correct: false, misconception: 'Vergeet het isgelijkteken en denkt dat de functienaam het rekenen aanzet.' }
        ],
        feedback: 'Drie dingen moeten kloppen: het teken vooraan, de naam van de functie en de dubbele punt in het bereik.',
        leerdoel: 'Je kunt met een eenvoudige formule optellen en een gemiddelde berekenen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Je typt 3+4 in een leeg vakje. Wat zie je daarna in dat vakje staan?',
        options: [
          { text: 'Het getal 34, want de tekens vallen er gewoon uit.', correct: false, misconception: 'Denkt dat Excel losse tekens weglaat en de cijfers aan elkaar plakt.' },
          { text: 'Het antwoord 7, want Excel rekent alles automatisch uit.', correct: false, misconception: 'Denkt dat Excel altijd rekent, ook zonder dat je erom vraagt.' },
          { text: 'Gewoon 3+4, want zonder isgelijkteken rekent Excel niet.', correct: true, explanation: 'Zonder dat isgelijkteken blijft je invoer gewoon tekst en gebeurt er niets.' },
          { text: 'Een foutmelding, want dit is geen geldige formule.', correct: false, misconception: 'Denkt dat Excel klaagt over alles wat niet als formule bedoeld is.' }
        ],
        feedback: 'Probeer het zelf: typ eerst 5+5 en daarna =5+5. Het verschil zit in dat ene teken vooraan.',
        leerdoel: 'Je kunt met een eenvoudige formule optellen en een gemiddelde berekenen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Langs de onderkant van je grafiek staan de nummers 1 tot en met 7 in plaats van de dagen. Wat ging er mis?',
        options: [
          { text: 'Je hebt de grafiek gemaakt voordat je de formules invulde.', correct: false, misconception: 'Denkt dat de volgorde van werken de namen langs de as bepaalt.' },
          { text: 'Je hebt de getallen als tekst getypt met een woord erachter.', correct: false, misconception: 'Haalt de fout met tekst in getallen door elkaar met een fout in de selectie.' },
          { text: 'Je koos een kolomdiagram, terwijl daar geen namen bij passen.', correct: false, misconception: 'Geeft het soort grafiek de schuld in plaats van de selectie.' },
          { text: 'Je hebt kolom A met de dagnamen niet meegeselecteerd.', correct: true, explanation: 'De eerste kolom en de kopregel leveren de namen langs de assen.' }
        ],
        feedback: 'Selecteer altijd de kopregel en de eerste kolom mee. Anders klopt je grafiek wel, maar zegt hij niets.',
        leerdoel: 'Je kunt van je tabel een grafiek maken en die aflezen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Schrijf op wat je in een grafiek sneller ziet dan in een rijtje van zeven losse getallen.',
        type: 'open',
        modelAnswer: 'In een grafiek zie ik meteen welke kolom het hoogst is. Bij losse getallen moet ik ze eerst allemaal vergelijken. Ik zie in de grafiek ook of het stijgt of daalt. En een uitschieter springt eruit, bijvoorbeeld een woensdag met veel meer stappen. Mijn oog vergelijkt hoogtes sneller dan cijfers.',
        nakijkpunten: [
          'Noemt iets wat je in een grafiek in een oogopslag ziet, zoals de hoogste waarde of een uitschieter.',
          'Legt uit dat je bij losse getallen zelf moet vergelijken.',
          'Gebruikt een eigen voorbeeld uit de tabel of uit het dagelijks leven.'
        ],
        feedback: 'Een grafiek verandert getallen in hoogtes. Daardoor doet je oog het vergelijkwerk in plaats van je hoofd.',
        leerdoel: 'Je kunt van je tabel een grafiek maken en die aflezen.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren'
      },
      {
        prompt: 'Terug naar 4.3. Je plakt je grafiek in je Word-verslag en de alinea valt in stukken. Wat pak je aan?',
        options: [
          { text: 'Je klikt erop en kiest een andere optie bij Indelingsopties.', correct: true, explanation: 'De terugloopoptie bepaalt hoe je tekst om een plaatje heen loopt.' },
          { text: 'Je zet er een lege regel boven en onder met de Enter-toets.', correct: false, misconception: 'Duwt de tekst weg in plaats van de terugloop goed te zetten.' },
          { text: 'Je maakt van je hele alinea een kop met de stijl Kop 2.', correct: false, misconception: 'Grijpt naar een kopstijl om een opmaakprobleem op te lossen.' },
          { text: 'Je maakt de grafiek in Excel opnieuw met minder gegevens.', correct: false, misconception: 'Past de bron aan terwijl het probleem in de opmaak van Word zit.' }
        ],
        feedback: 'Deze vraag haalt 4.3 terug. Een grafiek gedraagt zich in Word precies als elke andere afbeelding.',
        leerdoel: 'Je kunt een afbeelding invoegen in Word en netjes bij je tekst plaatsen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren'
      },
      {
        prompt: 'Terug naar 4.2. Je plakt je grafiek onder een nieuwe kop in je verslag. Wat doe je daarna met je inhoudsopgave?',
        options: [
          { text: 'Niets, want Word past die lijst zelf aan zodra je iets toevoegt.', correct: false, misconception: 'Denkt dat de lijst live meeloopt in plaats van een momentopname te zijn.' },
          { text: 'Je verwijdert de lijst en voegt hem daarna helemaal opnieuw in.', correct: false, misconception: 'Lost het op met een omweg die precies hetzelfde oplevert.' },
          { text: 'Je typt de nieuwe regel er met de hand onderaan bij.', correct: false, misconception: 'Vult een automatische lijst met de hand aan, waardoor de nummers los raken.' },
          { text: 'Je klikt erop en laat hem helemaal bijwerken.', correct: true, explanation: 'Word haalt dan opnieuw alle koppen op en zet de goede paginanummers erachter.' }
        ],
        feedback: 'Deze vraag haalt 4.2 terug. Bijwerken doe je altijd nog even vlak voordat je inlevert.',
        leerdoel: 'Je kunt een automatische inhoudsopgave invoegen en bijwerken.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren'
      }
    ]
  },

  // 4.5 PowerPoint: dia's, tekst, ontwerp en overgangen
  '4.5': {
    learningGoals: [
      'Je kunt uitleggen waarvoor je PowerPoint gebruikt.',
      "Je kunt dia's toevoegen met tekstvakken en afbeeldingen.",
      'Je kunt een achtergrond, kleuren en overgangen kiezen die je verhaal ondersteunen.'
    ],
    theorie: [
      {
        keyTerms: ['dia', 'presentatie', 'publiek'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Tim moet zijn klas in vijf minuten iets uitleggen over zijn hobby. Hij begint daarvoor een Word-document. Is dat een goede keuze?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: kijk eerst voor wie het bedoeld is, en dat is een hele groep die naar Tim zit te luisteren. Stap 2: kijk daarna hoe een lezer werkt, want die leest rustig door en kan alles teruglezen. Stap 3: kijk vervolgens hoe een luisteraar werkt, want die krijgt maar een kans en kijkt mee op een scherm. Stap 4: kies daar het juiste programma bij, en dat is hier een presentatie op een scherm, dus PowerPoint. Op elke dia zet Tim dan korte woorden en een passend plaatje. Het hele verhaal eromheen vertelt hij er als spreker zelf bij. Zo helpt die dia zijn publiek in plaats van dat hij afleidt.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['tekstvak', 'overgang', 'Ontwerpen', 'thema'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Amber heeft acht dia\'s klaar en zet er daarna nog twee dia\'s bij. Bij die laatste twee dia\'s zit geen overgang. Hoe komt dat?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: kijk wanneer Amber die overgangen erin zette, en dat was toen er nog maar acht dia\'s waren. Stap 2: bedenk waar een overgang eigenlijk zit, namelijk tussen twee dia\'s die er op dat moment al zijn. Stap 3: kijk daarna naar de twee nieuwe dia\'s, want die bestonden toen nog helemaal niet. Ze kregen dus ook geen overgang mee, hoe netjes Amber het verder ook deed. Stap 4: los het op door naar het tabblad Overgangen te gaan. Ze zet daar nu ook bij dia 9 en dia 10 een overgang aan. Regel voor de volgende keer: overgangen zet je pas als allerlaatste stap.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>PowerPoint gebruik je om een verhaal aan een hele groep tegelijk te laten zien. Elke dia is een blad van je presentatie, en een blad erbij maak je met de knop Nieuwe dia. Tekst zet je erop via Invoegen en dan Tekstvak, een foto via Invoegen en dan Afbeeldingen. De achtergrond en de kleuren van je dia kies je onder het tabblad Ontwerpen. Een overgang tussen twee dia\'s zet je aan onder het tabblad Overgangen. Houd het rustig, dus weinig tekst per dia en hooguit twee lettertypes.</p>',
      keyTerms: ['Nieuwe dia', 'lettertypes']
    },
    vragen: [
      {
        prompt: 'Waarvoor gebruik je PowerPoint vooral?',
        options: [
          { text: 'Om ingewikkelde formules uit te rekenen.', correct: false, misconception: 'Verwart PowerPoint met Excel, het programma voor getallen.' },
          { text: 'Om een presentatie met dia\'s te maken.', correct: true, explanation: 'Een presentatie is een reeks bladen die je aan anderen laat zien.' },
          { text: 'Om muziek en geluid te bewerken.', correct: false, misconception: 'Denkt dat elk Microsoft-programma media kan bewerken.' },
          { text: 'Om lange teksten en verslagen te schrijven.', correct: false, misconception: 'Verwart PowerPoint met Word, omdat je in allebei kunt typen.' }
        ],
        feedback: 'Word is voor tekst, Excel voor getallen en PowerPoint voor een verhaal op een scherm.',
        leerdoel: 'Je kunt uitleggen waarvoor je PowerPoint gebruikt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor'
      },
      {
        prompt: 'Een dia met veel tekst erop zorgt ervoor dat je publiek je verhaal beter begrijpt.',
        waar: false,
        leerdoel: 'Je kunt uitleggen waarvoor je PowerPoint gebruikt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Bij veel tekst gaat je klas lezen in plaats van luisteren. De dia ondersteunt jou, hij vervangt jou niet.'
      },
      {
        prompt: 'Je wilt een blad erbij in je presentatie en daar een foto op zetten. Welke twee knoppen gebruik je?',
        options: [
          { text: 'Nieuwe dia, en daarna Overgangen en dan Afbeeldingen.', correct: false, misconception: 'Zoekt beeld onder het tabblad dat tussen twee dia\'s werkt.' },
          { text: 'Nieuw thema, en daarna Invoegen en dan Afbeeldingen.', correct: false, misconception: 'Verwart een thema, dat de stijl bepaalt, met een extra blad.' },
          { text: 'Nieuwe dia, en daarna Invoegen en dan Afbeeldingen.', correct: true, explanation: 'Elke dia is een nieuw blad, en toevoegen doe je onder Invoegen.' },
          { text: 'Nieuw tekstvak, en daarna Ontwerpen en dan Afbeeldingen.', correct: false, misconception: 'Denkt dat een tekstvak een nieuw blad oplevert.' }
        ],
        feedback: 'Een dia is een blad, een tekstvak staat op zo\'n blad. Die twee zijn dus niet hetzelfde.',
        leerdoel: "Je kunt dia's toevoegen met tekstvakken en afbeeldingen.",
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Welke uitleg hoort bij het begrip tekstvak?',
        options: [
          { text: 'Een van de bladen waaruit je presentatie bestaat.', correct: false, misconception: 'Kiest de uitleg van een dia.' },
          { text: 'De kleur die je achter al je dia\'s zet.', correct: false, misconception: 'Kiest de uitleg van een achtergrond.' },
          { text: 'Het effect om van de ene dia naar de andere te gaan.', correct: false, misconception: 'Kiest de uitleg van een overgang.' },
          { text: 'De plek op je dia waar je je tekst in typt.', correct: true, explanation: 'Een tekstvak is het kader waarin je typt, en dat staat op een dia.' }
        ],
        feedback: 'Drie begrippen, drie plekken: de dia is het blad, het tekstvak staat erop, de overgang zit ertussen.',
        leerdoel: "Je kunt dia's toevoegen met tekstvakken en afbeeldingen.",
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen'
      },
      {
        prompt: 'Onder welk tabblad pas je de achtergrondkleur van je dia\'s aan?',
        options: [
          { text: 'Onder Ontwerpen, want dat gaat over hoe je dia eruitziet.', correct: true, explanation: 'Ontwerpen regelt de vormgeving: het thema, de kleuren en de achtergrond.' },
          { text: 'Onder Start, want daar staat de opmaak van je letters.', correct: false, misconception: 'Verwart de opmaak van tekst met de vormgeving van de hele dia.' },
          { text: 'Onder Invoegen, want daar staat alles wat je toevoegt.', correct: false, misconception: 'Trekt de regel uit Word door naar een instelling die niets toevoegt.' },
          { text: 'Onder Overgangen, want dat gaat over je hele presentatie.', correct: false, misconception: 'Denkt dat alles wat voor alle dia\'s geldt onder Overgangen staat.' }
        ],
        feedback: 'In PowerPoint splitst het zich: toevoegen onder Invoegen, uiterlijk onder Ontwerpen.',
        leerdoel: 'Je kunt een achtergrond, kleuren en overgangen kiezen die je verhaal ondersteunen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Je zet zwarte letters op een donkerblauwe achtergrond. Wat is daar het probleem mee?',
        options: [
          { text: 'PowerPoint staat die twee kleuren niet samen toe.', correct: false, misconception: 'Denkt dat het programma slechte kleurkeuzes tegenhoudt.' },
          { text: 'Achterin het lokaal leest niemand je tekst nog.', correct: true, explanation: 'Het kleurverschil is te klein, dus de letters vallen weg in de achtergrond.' },
          { text: 'De overgangen werken niet meer op een donkere dia.', correct: false, misconception: 'Legt een verband tussen kleurkeuze en het effect tussen twee dia\'s.' },
          { text: 'Je mag maar een donkere kleur per presentatie kiezen.', correct: false, misconception: 'Verzint een regel over het aantal kleuren in plaats van over leesbaarheid.' }
        ],
        feedback: 'Kies een combinatie die van een afstand leesbaar blijft, bijvoorbeeld witte letters op donkerblauw.',
        leerdoel: 'Je kunt een achtergrond, kleuren en overgangen kiezen die je verhaal ondersteunen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Terug naar 4.3. Je wilt een foto van internet op je dia zetten. Wat doe je als eerste?',
        options: [
          { text: 'Aan je docent vragen of hij een foto voor je opzoekt.', correct: false, misconception: 'Legt de keuze bij een ander in plaats van zelf te filteren.' },
          { text: 'De foto meteen opslaan, want je vindt hem toch mooi.', correct: false, misconception: 'Slaat de controle op rechten over omdat het plaatje bevalt.' },
          { text: 'Op Images klikken en daarna via Tools filteren op rechten.', correct: true, explanation: 'Zo zie je alleen beeld met een Creative Commons-licentie.' },
          { text: 'De foto eerst kleiner maken zodat hij op je dia past.', correct: false, misconception: 'Begint met de vormgeving in plaats van met de vraag of het mag.' }
        ],
        feedback: 'Deze vraag haalt 4.3 terug. In PowerPoint geldt precies dezelfde regel over beeld als in Word.',
        leerdoel: 'Je kunt op Google zoeken naar afbeeldingen met een Creative Commons-licentie.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren'
      },
      {
        prompt: 'Terug naar 4.4. Je zet je stappengrafiek op een dia. Waarom werkt die grafiek daar beter dan zeven kale getallen?',
        options: [
          { text: 'Omdat een grafiek altijd nauwkeuriger is dan losse getallen.', correct: false, misconception: 'Denkt dat een grafiek preciezer meet, terwijl het dezelfde gegevens zijn.' },
          { text: 'Omdat je publiek in een oogopslag ziet welke dag eruit springt.', correct: true, explanation: 'Je kijkers vergelijken hoogtes, en dat gaat sneller dan zeven cijfers lezen.' },
          { text: 'Omdat een grafiek minder ruimte inneemt dan zeven getallen.', correct: false, misconception: 'Kiest op ruimte, terwijl een grafiek op een dia juist groter is.' },
          { text: 'Omdat je dan geen kopregel meer nodig hebt in je tabel.', correct: false, misconception: 'Denkt dat de grafiek de kopregel overbodig maakt, terwijl hij die gebruikt.' }
        ],
        feedback: 'Deze vraag haalt 4.4 terug. Op een dia telt hoe snel je publiek iets ziet, niet hoeveel er staat.',
        leerdoel: 'Je kunt van je tabel een grafiek maken en die aflezen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'reflecteren'
      }
    ]
  },

  // 4.6 Je eigen presentatie maken en presenteren
  '4.6': {
    learningGoals: [
      'Je kunt een presentatie maken met een titeldia, een inhoudsdia en een afsluitende dia.',
      'Je kunt je tekst kort en goed leesbaar houden.',
      'Je kunt je presentatie laten zien en er zelf bij vertellen.'
    ],
    theorie: [
      {
        keyTerms: ['titeldia', 'inhoudsdia', 'afsluitende dia'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Dani begint zijn presentatie meteen met zijn eerste onderwerp. Aan het eind klapt hij zonder iets te zeggen zijn laptop dicht. Wat mist er?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: kijk naar het begin, want niemand weet wie Dani is en waar het over gaat. Er mist dus een titeldia met zijn titel, zijn naam en zijn klas erop. Stap 2: kijk daarna naar dia 2, waar niemand kan zien wat er allemaal nog komt. Er mist dus een inhoudsdia met het overzicht van zijn presentatie. Stap 3: kijk tot slot naar het eind, want zijn verhaal stopt daar gewoon ineens. Er mist dus ook nog een afsluitende dia om het netjes af te ronden. Stap 4: tel na wat Dani nodig heeft, dus vooraan twee dia\'s en achteraan een. Daartussen zet hij minimaal zeven inhoudelijke dia\'s met zijn eigen verhaal.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['steekwoorden', 'contrast', 'spreker'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Op de dia van Roos staan acht regels tekst in donkergrijs op zwart. Noem de twee fouten en de oplossing.</p>',
          '<p><strong>Antwoord.</strong> Stap 1: kijk eerst naar de hoeveelheid tekst, want acht regels op een dia is veel te veel. Haar klas gaat dan zitten lezen en luistert niet meer naar Roos zelf. Stap 2: maak er steekwoorden van, want drie losse woorden per punt zijn genoeg. De hele zin eromheen vertelt Roos er als spreker gewoon zelf bij. Stap 3: kijk daarna naar de kleuren, want donkergrijs en zwart lijken veel te veel op elkaar. Dat heet te weinig contrast tussen je letters en je achtergrond. Stap 4: maak de letters wit, dan leest ook de achterste rij van de klas nog mee. Let op: dit zijn twee losse fouten, dus je moet ze allebei oplossen.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Je eindpresentatie heeft een vaste opbouw van vier soorten dia\'s achter elkaar. Vooraan staan een titeldia en een inhoudsdia, en helemaal achteraan een afsluitende dia. Daartussen staan minimaal zeven inhoudelijke dia\'s met steekwoorden en plaatjes erop. Zet losse woorden op je dia en vertel de hele zin er zelf bij. Zorg voor genoeg kleurverschil tussen je letters en je achtergrond. Oefen je verhaal een keer hardop, dan hoef je niet voor te lezen. Jij bent de spreker en je dia is niet meer dan een hulpmiddel.</p>',
      keyTerms: ['hardop', 'hulpmiddel']
    },
    vragen: [
      {
        prompt: 'Welke dia hoort helemaal vooraan in je eindpresentatie te staan?',
        options: [
          { text: 'De afsluitende dia, want dan weet iedereen waar je heen wilt.', correct: false, misconception: 'Denkt dat het einde vooraf laten zien het verhaal duidelijker maakt.' },
          { text: 'Een dia met alleen een grote foto van je onderwerp.', correct: false, misconception: 'Denkt dat alleen een plaatje genoeg is voor een eerste dia.' },
          { text: 'De inhoudsdia, want daar staat wat er allemaal komt.', correct: false, misconception: 'Zet het overzicht voorop en vergeet dat de kijker eerst wil weten wie er praat.' },
          { text: 'De titeldia, met je titel, je naam en klas en een plaatje.', correct: true, explanation: 'Zo weet je publiek meteen waar het over gaat en wie er staat.' }
        ],
        feedback: 'Alleen een plaatje is te weinig en alleen je naam ook. Op je titeldia horen alle drie de dingen.',
        leerdoel: 'Je kunt een presentatie maken met een titeldia, een inhoudsdia en een afsluitende dia.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor'
      },
      {
        prompt: 'In je eindpresentatie zitten tussen de inhoudsdia en de afsluitende dia minimaal zeven dia\'s met je verhaal.',
        waar: true,
        leerdoel: 'Je kunt een presentatie maken met een titeldia, een inhoudsdia en een afsluitende dia.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Tel ze na voordat je inlevert. Met titeldia, inhoudsdia en afsluiting kom je dus op tien dia\'s uit.'
      },
      {
        prompt: 'Wat zet je op een dia in plaats van hele zinnen?',
        options: [
          { text: 'Steekwoorden, want de hele zin vertel je er zelf bij.', correct: true, explanation: 'Losse woorden zijn haakjes waar jouw verhaal aan hangt.' },
          { text: 'Een samenvatting van je verhaal in vijf hele zinnen.', correct: false, misconception: 'Denkt dat korter maken hetzelfde is als minder zinnen gebruiken.' },
          { text: 'Alleen plaatjes, want daar hoef je niets bij te lezen.', correct: false, misconception: 'Slaat door naar de andere kant en laat elke houvast weg.' },
          { text: 'De letterlijke tekst die je zelf gaat opzeggen.', correct: false, misconception: 'Gebruikt de dia als spiekbriefje in plaats van als hulpmiddel voor het publiek.' }
        ],
        feedback: 'Van de zin over een sterk wachtwoord blijven bijvoorbeeld twee woorden over: sterk wachtwoord, twaalf tekens.',
        leerdoel: 'Je kunt je tekst kort en goed leesbaar houden.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Grijze letters op een lichtgrijze achtergrond zijn achterin het lokaal prima te lezen.',
        waar: false,
        leerdoel: 'Je kunt je tekst kort en goed leesbaar houden.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Contrast is het kleurverschil tussen letter en achtergrond. Hoe kleiner dat verschil, hoe eerder het wegvalt.'
      },
      {
        prompt: 'Je video start niet terwijl je voor de klas staat. Wat is de beste reactie?',
        options: [
          { text: 'Je laat een klasgenoot de video op zijn telefoon opzoeken.', correct: false, misconception: 'Schuift de oplossing naar het publiek en verliest de aandacht.' },
          { text: 'Je gaat rustig door en vertelt kort wat erin te zien was.', correct: true, explanation: 'Jij bent de spreker, dus je verhaal staat los van de techniek.' },
          { text: 'Je stopt en gaat pas verder als de video het weer doet.', correct: false, misconception: 'Legt het verhaal stil en maakt de techniek belangrijker dan de spreker.' },
          { text: 'Je slaat de rest van je presentatie over en gaat zitten.', correct: false, misconception: 'Denkt dat een technisch probleem de hele presentatie waardeloos maakt.' }
        ],
        feedback: 'Daarom oefen je je verhaal een keer hardop. Dan kun je ook doorpraten als het scherm je in de steek laat.',
        leerdoel: 'Je kunt je presentatie laten zien en er zelf bij vertellen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Leg uit waarom je je verhaal hardop oefent en niet alleen in je hoofd doorneemt.',
        type: 'open',
        modelAnswer: 'In je hoofd loopt alles altijd soepel. Hardop merk je pas waar je vastloopt of te snel praat. Je hoort ook of je zinnen kloppen. En je onthoudt de volgorde van je dia\'s beter. Daardoor hoef je straks niet voor te lezen en kun je je publiek aankijken.',
        nakijkpunten: [
          'Noemt dat je hardop merkt waar je vastloopt of te snel gaat.',
          'Legt een verband met niet voorlezen of met je publiek aankijken.',
          'Schrijft het in eigen woorden en niet als overgeschreven zin uit de les.'
        ],
        feedback: 'Oefenen kost een kwartier en levert het meeste op van alle tips. Je hoort jezelf pas als je hardop praat.',
        leerdoel: 'Je kunt je presentatie laten zien en er zelf bij vertellen.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren'
      },
      {
        prompt: 'Terug naar 4.5. Wanneer zet je de overgangen tussen je dia\'s aan?',
        options: [
          { text: 'Nooit, want overgangen leiden je publiek alleen maar af.', correct: false, misconception: 'Trekt de regel over rustige dia\'s door naar een eis uit de opdracht.' },
          { text: 'Meteen bij dia 1, zodat je het niet meer kunt vergeten.', correct: false, misconception: 'Denkt dat een overgang bij de eerste dia voor de hele presentatie geldt.' },
          { text: 'Pas als al je dia\'s klaar staan, dus helemaal aan het eind.', correct: true, explanation: 'Dia\'s die je later toevoegt krijgen anders geen overgang mee.' },
          { text: 'Halverwege, zodat je de tweede helft er nog bij kunt doen.', correct: false, misconception: 'Denkt dat een overgang vanaf dat punt automatisch doorloopt.' }
        ],
        feedback: 'Deze vraag haalt 4.5 terug. Je eindpresentatie moet tussen alle dia\'s een overgang hebben.',
        leerdoel: 'Je kunt een achtergrond, kleuren en overgangen kiezen die je verhaal ondersteunen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren'
      },
      {
        prompt: 'Terug naar 4.4. Op een dia wil je het gemiddelde van zeven metingen noemen. Welke formule levert dat?',
        options: [
          { text: '=GEMIDDELDE(B2:B8)', correct: true, explanation: 'Die telt B2 tot en met B8 op en deelt daarna door het aantal getallen.' },
          { text: 'GEMIDDELDE(B2:B8)', correct: false, misconception: 'Vergeet het isgelijkteken, dus Excel laat de invoer als tekst staan.' },
          { text: '=SOM(B2:B8)', correct: false, misconception: 'Kiest de functie die alleen optelt en niet deelt.' },
          { text: '=GEMIDDELDE(B2+B8)', correct: false, misconception: 'Gebruikt een plusteken, waardoor alleen die twee vakjes meedoen.' }
        ],
        feedback: 'Deze vraag haalt 4.4 terug. Let op de dubbele punt: die betekent tot en met, dus alles ertussen telt mee.',
        leerdoel: 'Je kunt met een eenvoudige formule optellen en een gemiddelde berekenen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'reflecteren'
      }
    ]
  },

  // 4.7 Checkpoint: eindtoets basisvaardigheden ICT
  '4.7': {
    learningGoals: [
      'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
      'Je kunt je resultaat opslaan en delen met je docent.'
    ],
    theorie: [
      {
        keyTerms: ['eindtoets', 'oefenblok', 'voldoende'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Jesse leest voor de eindtoets zijn hele boek nog een keer helemaal door. Toch scoort hij laag op de toets. Wat had hij beter kunnen doen?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: kijk wat Jesse precies deed, want hij las alles, ook alle stof die hij allang wist. Stap 2: kijk wat dat hem oplevert, want bekende stof voelt makkelijk en dus dacht hij dat het goed zat. Stap 3: bedenk daarom wat beter werkt, en dat is eerst het oefenblok maken, want dat laat je gaten zien. Stap 4: lees daarna alleen terug bij precies die opgaven die bij hem misgingen. Stap 5: doe die opgaven een dag later gewoon nog een keer opnieuw. Zo werkt Jesse veel gerichter en houdt hij aan het eind zelfs tijd over.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['schermfoto', 'zelfstandig'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Amine is klaar met de eindtoets en klikt het scherm meteen weg. Daarna wil hij zijn resultaat alsnog met zijn docent delen. Kan dat nog?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: kijk wat er weg is, want dat scherm met zijn resultaat komt niet meer terug. Stap 2: kijk wat Amine dan nog heeft, en dat is niets, dus hij kan zijn docent niets laten zien. Stap 3: bedenk daarom de goede volgorde, namelijk eerst een schermfoto maken en dan pas wegklikken. Stap 4: sla die schermfoto daarna netjes op in je eigen OneDrive. Stap 5: zet hem in de map met de naam Checkpoint hoofdstuk 4. Stap 6: deel hem met je docent en zet er kort bij wat goed ging.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Deze toets sluit je hele eerste halfjaar digitale geletterdheid in een keer af. Hij gaat over vier gebieden: je account, je device, veilig internet, en Word met Excel en PowerPoint. Je maakt hem helemaal alleen en je zoekt tijdens de toets niets op. Vanaf 55 procent goed heb je hem gehaald met een voldoende. Aan het eind zie je je resultaat op het scherm; maak daar meteen een foto van. Sla die schermfoto op in OneDrive en deel hem daarna met je docent. Zet erbij wat goed ging en welke onderwerpen je nog wilt oefenen.</p>',
      keyTerms: ['resultaat', 'halfjaar']
    },
    vragen: [
      {
        prompt: 'Wat is de belangrijkste reden om een sterk wachtwoord te gebruiken?',
        options: [
          { text: 'Om je wachtwoord zelf makkelijker te kunnen onthouden bij het inloggen.', correct: false, misconception: 'Verwart een goed wachtwoord met een wachtwoord dat makkelijk is.' },
          { text: 'Om je wachtwoord met je beste vrienden te kunnen delen.', correct: false, misconception: 'Denkt dat een wachtwoord bedoeld is om samen te gebruiken.' },
          { text: 'Om sneller op je account te kunnen inloggen.', correct: false, misconception: 'Denkt dat een wachtwoord er is voor het gemak van de gebruiker.' },
          { text: 'Om je account te beschermen tegen mensen die er niet in mogen.', correct: true, explanation: 'Een wachtwoord is een slot, en een sterk slot houdt langer stand.' }
        ],
        feedback: 'Een wachtwoord doet maar een ding: het houdt anderen buiten. Alles wat dat verzwakt, is dus geen voordeel.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Wat is het verschil tussen hardware en software?',
        options: [
          { text: 'Hardware zijn de onderdelen, software zijn de programma\'s.', correct: true, explanation: 'Onderdelen kun je vastpakken, programma\'s draaien erop.' },
          { text: 'Hardware en software zijn twee woorden voor hetzelfde ding.', correct: false, misconception: 'Denkt dat het synoniemen zijn omdat ze vaak samen genoemd worden.' },
          { text: 'Hardware is alleen de muis, software is de computer zelf.', correct: false, misconception: 'Beperkt hardware tot de randapparaten en noemt de computer software.' },
          { text: 'Hardware zijn de programma\'s, software zijn de onderdelen.', correct: false, misconception: 'Draait de twee begrippen om, omdat allebei met techniek te maken heeft.' }
        ],
        feedback: 'Kun je het vastpakken? Dan is het hardware. Draait het erop, zoals Word of Windows? Dan is het software.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Wat is phishing?',
        options: [
          { text: 'Vissen op een plek waar dat eigenlijk niet mag.', correct: false, misconception: 'Leest het Engelse woord letterlijk en denkt aan hengelen.' },
          { text: 'Een nepbericht dat je op een link laat klikken of geld vraagt.', correct: true, explanation: 'De afzender doet zich voor als een bekend bedrijf om je gegevens te krijgen.' },
          { text: 'Het stelen van iemands wachtwoord door in te breken op zijn account.', correct: false, misconception: 'Verwart phishing met hacken, terwijl je bij phishing zelf iets invult.' },
          { text: 'Een programma dat je device stiekem langzamer maakt.', correct: false, misconception: 'Verwart phishing met een virus op je apparaat.' }
        ],
        feedback: 'Bij phishing geef je je gegevens zelf, omdat je denkt dat het bericht echt is. Controleer dus altijd de afzender.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Wat is een voorbeeld van identiteitsfraude?',
        options: [
          { text: 'Iemand pakt een reep chocola mee uit de supermarkt.', correct: false, misconception: 'Ziet elke vorm van stelen als identiteitsfraude.' },
          { text: 'Iemand stuurt jou een mail met een besmette bijlage.', correct: false, misconception: 'Verwart het verspreiden van een virus met het overnemen van een identiteit.' },
          { text: 'Iemand doet zich met jouw naam en foto voor als jou.', correct: true, explanation: 'De dader gebruikt jouw identiteit om anderen te misleiden of geld te vragen.' },
          { text: 'Iemand raadt jouw wachtwoord en logt in op je account.', correct: false, misconception: 'Denkt dat inbreken hetzelfde is als iemands identiteit gebruiken.' }
        ],
        feedback: 'Bij identiteitsfraude gebruikt iemand wie jij bent. Daarom is een foto van je rijbewijs online een slecht idee.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Je krijgt een appje van een vriendin die snel geld nodig heeft. Wat doe je?',
        options: [
          { text: 'Je stuurt het bericht door naar de rest van je vrienden.', correct: false, misconception: 'Verspreidt het bericht in plaats van het te controleren.' },
          { text: 'Je vraagt in de chat of zij het echt is en gelooft dat.', correct: false, misconception: 'Controleert binnen hetzelfde kanaal, waar de oplichter ook zit.' },
          { text: 'Je maakt het geld over, want een vriendin help je meteen.', correct: false, misconception: 'Laat de haast in het bericht het overnemen van de controle.' },
          { text: 'Je belt haar op het nummer dat je zelf al had staan.', correct: true, explanation: 'Zo controleer je buiten het bericht om of zij het echt is.' }
        ],
        feedback: 'Controleer altijd buiten het bericht om. Een oplichter antwoordt in die chat gewoon dat hij het echt is.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Alles wat op internet staat, kun je zonder controleren geloven.',
        waar: false,
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Iedereen kan iets op internet zetten. Kijk dus altijd wie het schreef en of anderen hetzelfde melden.'
      },
      {
        prompt: 'Het is verstandig om zelf diep in de instellingen van je computer dingen aan te passen.',
        waar: false,
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Je kunt je device er flink mee beschadigen. Updaten moet je juist wel doen, en dan regelmatig.'
      },
      {
        prompt: 'Waarom is het handig om je bestanden in OneDrive te bewaren?',
        options: [
          { text: 'Omdat je er op elke computer bij kunt waar je inlogt.', correct: true, explanation: 'OneDrive hoort bij je account, dus je werk reist met je mee.' },
          { text: 'Omdat je je bestanden dan makkelijker kunt uitprinten.', correct: false, misconception: 'Verwart bereikbaarheid met een functie voor printen.' },
          { text: 'Omdat OneDrive alle bestanden automatisch voor je nakijkt.', correct: false, misconception: 'Denkt dat de cloud iets met de inhoud van je werk doet.' },
          { text: 'Omdat je bestanden dan alleen op die ene laptop staan.', correct: false, misconception: 'Beschrijft juist het nadeel van opslaan op het bureaublad.' }
        ],
        feedback: 'Dat is precies waarom je je verslag daar zette: thuis inloggen en gewoon verder werken.',
        leerdoel: 'Je kunt een Word-document maken, een duidelijke naam geven en op de juiste plek opslaan.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Je begint aan een nieuw verslag in Word. Wat doe je nog voordat je de eerste zin typt?',
        options: [
          { text: 'Een lettertype kiezen dat je mooi vindt staan.', correct: false, misconception: 'Begint met de vormgeving in plaats van met het veiligstellen van het bestand.' },
          { text: 'Het bestand opslaan met een naam en een gekozen plek.', correct: true, explanation: 'Wie meteen opslaat, raakt bij een crash hooguit een paar regels kwijt.' },
          { text: 'Alvast een inhoudsopgave invoegen via Verwijzingen.', correct: false, misconception: 'Voegt een lijst in terwijl er nog geen enkele kop bestaat.' },
          { text: 'De paginanummers instellen via het tabblad Invoegen.', correct: false, misconception: 'Doet een stap uit het midden van de les als eerste handeling.' }
        ],
        feedback: 'Opslaan is de eerste handeling, niet de laatste. Daarna sla je tussendoor steeds op met CTRL + S.',
        leerdoel: 'Je kunt een Word-document maken, een duidelijke naam geven en op de juiste plek opslaan.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Hoe voeg je een voorblad in?',
        options: [
          { text: 'Via Indeling, dan op Voorblad en een stijl kiezen.', correct: false, misconception: 'Kiest het tabblad dat over marges en kolommen gaat.' },
          { text: 'Via Ontwerpen, dan op Voorblad en een stijl kiezen.', correct: false, misconception: 'Kiest het tabblad dat over de vormgeving van je document gaat.' },
          { text: 'Via Invoegen, dan op Voorblad en een stijl kiezen.', correct: true, explanation: 'De knop Voorblad staat helemaal links onder het tabblad Invoegen.' },
          { text: 'Via Verwijzingen, dan op Voorblad en een stijl kiezen.', correct: false, misconception: 'Verwart de plek van de inhoudsopgave met die van het voorblad.' }
        ],
        feedback: 'Op je voorblad vul jij daarna zelf Titel, Subtitel, Auteur, Datum en Cursus in.',
        leerdoel: 'Je kunt een automatisch voorblad invoegen en invullen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Waar kun je paginanummers toevoegen?',
        options: [
          { text: 'Via de werkbalk op Beeld, dan Paginanummers, dan een plek.', correct: false, misconception: 'Kiest het tabblad dat alleen de weergave van je document verandert.' },
          { text: 'Via de werkbalk op Verwijzing, dan Paginanummers, dan een plek.', correct: false, misconception: 'Denkt dat alles met nummers onder Verwijzingen staat.' },
          { text: 'Via de werkbalk op Bestand, dan Paginanummers, dan een plek.', correct: false, misconception: 'Zoekt de knop in het menu waar je opslaat en print.' },
          { text: 'Via de werkbalk op Invoegen, dan Paginanummers, dan een plek.', correct: true, explanation: 'Je kiest daarna zelf waar de nummers komen te staan.' }
        ],
        feedback: 'Bovenaan, onderaan in het midden of links onderin: de plek mag je zelf kiezen.',
        leerdoel: 'Je kunt tekst dikgedrukt, schuin of onderstreept maken en paginanummers toevoegen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Welke sneltoets hoort bij welke handeling? Kies de rij die helemaal klopt.',
        options: [
          { text: 'CTRL + S opslaan, CTRL + B dik, CTRL + i schuin, CTRL + U onderstreept.', correct: true, explanation: 'De letters komen uit het Engels: save, bold, italic en underline.' },
          { text: 'CTRL + S schuin, CTRL + B opslaan, CTRL + i dik, CTRL + U onderstreept.', correct: false, misconception: 'Schuift de eerste drie een plek door en houdt alleen de laatste goed.' },
          { text: 'CTRL + S opslaan, CTRL + B schuin, CTRL + i onderstreept, CTRL + U dik.', correct: false, misconception: 'Verwisselt de drie opmaaktoetsen onderling.' },
          { text: 'CTRL + S dik, CTRL + B onderstreept, CTRL + i opslaan, CTRL + U schuin.', correct: false, misconception: 'Koppelt de letters willekeurig, zonder aan het Engelse woord te denken.' }
        ],
        feedback: 'Onthoud het aan de eerste letter van het Engelse woord. Dan hoef je deze rij nooit uit je hoofd te leren.',
        leerdoel: 'Je kunt tekst dikgedrukt, schuin of onderstreept maken en paginanummers toevoegen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Welke stijl geef je een hoofdstuktitel in je verslag?',
        options: [
          { text: 'Kop 2, want een hoofdstuk is een onderdeel van je verslag.', correct: false, misconception: 'Redeneert dat een hoofdstuk een onderdeel is en dus een niveau lager staat.' },
          { text: 'Kop 1, want dat is de stijl voor een hoofdtitel of hoofdstuk.', correct: true, explanation: 'Kop 2 gebruik je pas voor een stukje binnen zo\'n hoofdstuk.' },
          { text: 'Geen stijl, je maakt de titel zelf dik en 16 punten groot.', correct: false, misconception: 'Denkt dat het uiterlijk genoeg is en dat Word dat wel herkent.' },
          { text: 'Kop 3, want dat is de stijl die het meest opvalt in je tekst.', correct: false, misconception: 'Denkt dat een hoger nummer een belangrijker kop betekent.' }
        ],
        feedback: 'Hoe lager het nummer, hoe hoger de kop staat. Kop 1 is de dikste tak, Kop 3 zit het diepst.',
        leerdoel: 'Je kunt tekst opmaken met de stijlen Kop 1 en Kop 2.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Je hebt de volgorde van je hoofdstukken omgedraaid. Wat moet er daarna gebeuren met je lijst voorin?',
        options: [
          { text: 'Je haalt de lijst weg, want die klopt toch nooit meer.', correct: false, misconception: 'Gooit een werkend hulpmiddel weg in plaats van het te vernieuwen.' },
          { text: 'Niets, want Word past die lijst zelf meteen aan.', correct: false, misconception: 'Denkt dat automatisch betekent dat de lijst continu meeloopt.' },
          { text: 'Je werkt de hele inhoudsopgave bij via de knop erboven.', correct: true, explanation: 'Word haalt dan opnieuw alle koppen op met de nieuwe paginanummers.' },
          { text: 'Je verandert alleen de paginanummers met de hand.', correct: false, misconception: 'Herstelt de nummers los van de volgorde, dus de regels blijven verkeerd staan.' }
        ],
        feedback: 'Doe dit altijd vlak voor het inleveren. Dan kloppen de volgorde en de nummers allebei.',
        leerdoel: 'Je kunt een automatische inhoudsopgave invoegen en bijwerken.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Leg uit wat een lezer merkt van een verslag van tien pagina\'s zonder enige kop.',
        type: 'open',
        modelAnswer: 'Zo\'n lezer ziet niet waar een nieuw onderwerp begint. Hij moet alles lezen om iets terug te vinden. Er is geen inhoudsopgave, want Word heeft geen koppen om op te halen. Hij kan dus ook niet vooraf zien hoe het verslag is opgebouwd.',
        nakijkpunten: [
          'Noemt dat de lezer niet ziet waar een nieuw onderwerp begint.',
          'Legt het verband met het ontbreken van een inhoudsopgave.',
          'Beschrijft het vanuit de lezer en niet alleen vanuit de maker.'
        ],
        feedback: 'Koppen werken twee kanten op: je lezer ziet de opbouw en Word krijgt materiaal voor de lijst voorin.',
        leerdoel: 'Je weet waarom koppen je verslag overzichtelijk maken.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren'
      },
      {
        prompt: 'Welk filter zet je aan om alleen beeld te vinden dat je voor school mag gebruiken?',
        options: [
          { text: 'Bij Type kies je de optie Foto.', correct: false, misconception: 'Filtert op het soort beeld in plaats van op wat je ermee mag.' },
          { text: 'Bij Formaat kies je de optie Groot en daarna Rechthoekig.', correct: false, misconception: 'Filtert op grootte, want dat is het filter dat het meest opvalt.' },
          { text: 'Bij Kleur kies je de optie Zwart-wit.', correct: false, misconception: 'Denkt dat een filter op uiterlijk ook iets over rechten zegt.' },
          { text: 'Bij usage rights kies je Creative Commons.', correct: true, explanation: 'Usage rights heet in het Nederlands Gebruiksrechten en gaat precies over toestemming.' }
        ],
        feedback: 'Eerst Images, dan Tools, dan usage rights. Zonder die drie stappen zie je gewoon alle plaatjes.',
        leerdoel: 'Je kunt op Google zoeken naar afbeeldingen met een Creative Commons-licentie.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Je wilt je foto zo neerzetten dat de tekst er netjes omheen loopt. Wat gebruik je?',
        options: [
          { text: 'Het icoontje Indelingsopties naast je afbeelding.', correct: true, explanation: 'Daarin staan de terugloopopties, en die bepalen hoe de tekst loopt.' },
          { text: 'De knop Uitlijnen op het tabblad Start.', correct: false, misconception: 'Verwart het uitlijnen van tekst met de terugloop rond een plaatje.' },
          { text: 'Het tabblad Ontwerpen met de paginakleuren.', correct: false, misconception: 'Zoekt een oplossing bij de vormgeving van de hele pagina.' },
          { text: 'De witte puntjes op de rand van je afbeelding, in elke hoek.', correct: false, misconception: 'Gebruikt het gereedschap voor het formaat in plaats van voor de terugloop.' }
        ],
        feedback: 'Probeer altijd een paar opties uit. Kies daarna die waarbij je zinnen gewoon door te lezen zijn.',
        leerdoel: 'Je kunt een afbeelding invoegen in Word en netjes bij je tekst plaatsen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Mag je teksten van internet zomaar overnemen in je eigen werkstuk?',
        options: [
          { text: 'Ja, alles wat op internet staat is gratis te gebruiken.', correct: false, misconception: 'Denkt dat vrij te lezen hetzelfde is als vrij te gebruiken.' },
          { text: 'Nee, je schrijft het in eigen woorden en noemt de bron.', correct: true, explanation: 'Bij grotere stukken hoort er altijd bij van wie de tekst komt.' },
          { text: 'Ja, zolang je het maar niet aan anderen doorstuurt.', correct: false, misconception: 'Denkt dat het pas fout is als je de tekst verder verspreidt.' },
          { text: 'Nee, je mag helemaal niets van internet gebruiken.', correct: false, misconception: 'Slaat door en denkt dat internet als bron verboden is.' }
        ],
        feedback: 'Voor tekst geldt hetzelfde als voor beeld: er zit een maker achter en die noem je.',
        leerdoel: 'Je weet waarom je niet zomaar elke afbeelding van internet mag gebruiken.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Wat hoort er in de bovenste rij van een tabel in Excel te staan?',
        options: [
          { text: 'Een lege rij, zodat je tabel wat ruimte krijgt.', correct: false, misconception: 'Denkt dat witruimte bovenaan de tabel netter maakt.' },
          { text: 'Het totaal van alle getallen die eronder staan.', correct: false, misconception: 'Zet de uitkomst bovenaan in plaats van onder de gegevens.' },
          { text: 'De namen van je kolommen, dus de kopregel.', correct: true, explanation: 'Zonder die namen weet niemand wat de getallen eronder betekenen.' },
          { text: 'De formules waarmee je later gaat rekenen.', correct: false, misconception: 'Denkt dat formules bovenaan horen omdat je er later mee werkt.' }
        ],
        feedback: 'Laat ook nergens anders lege rijen staan. Excel denkt dan dat je tabel daar ophoudt.',
        leerdoel: 'Je kunt gegevens netjes in een tabel zetten in Excel.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Met welke formule bereken je het gemiddelde van de getallen in B2 tot en met B8?',
        options: [
          { text: 'GEMIDDELDE(B2:B8), want de naam zegt al genoeg.', correct: false, misconception: 'Vergeet het isgelijkteken, dus Excel leest het vakje als tekst.' },
          { text: '=SOM(B2:B8), want optellen en middelen is hetzelfde.', correct: false, misconception: 'Denkt dat het totaal en het gemiddelde uit dezelfde functie komen.' },
          { text: '=GEMIDDELD(B2-B8), want je haalt er iets vanaf.', correct: false, misconception: 'Gebruikt een streepje als bereik en verzint een functienaam.' },
          { text: '=GEMIDDELDE(B2:B8), want die telt op en deelt daarna.', correct: true, explanation: 'De functie deelt het totaal door het aantal getallen in het bereik.' }
        ],
        feedback: 'Let op alle drie de onderdelen: het teken vooraan, de juiste naam en de dubbele punt in het bereik.',
        leerdoel: 'Je kunt met een eenvoudige formule optellen en een gemiddelde berekenen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Wat selecteer je voordat je van je tabel een grafiek maakt?',
        options: [
          { text: 'Je gegevens inclusief de kopregel en de eerste kolom.', correct: true, explanation: 'Die twee leveren de namen langs de assen van je grafiek.' },
          { text: 'Het hele werkblad, want dan mist er zeker niets.', correct: false, misconception: 'Neemt lege vakken mee, waardoor de grafiek onleesbaar wordt.' },
          { text: 'Alleen de vakjes met je twee formules eronder.', correct: false, misconception: 'Denkt dat de uitkomsten de grafiek vormen in plaats van de metingen.' },
          { text: 'Alleen de kolom met getallen, want die wordt getekend.', correct: false, misconception: 'Selecteert alleen de waarden en verliest daarmee de namen langs de as.' }
        ],
        feedback: 'Anders krijg je langs de onderkant alleen de nummers 1 tot en met 7 te zien.',
        leerdoel: 'Je kunt van je tabel een grafiek maken en die aflezen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Welk Microsoft-programma gebruik je voor het maken van presentaties?',
        options: [
          { text: 'Word', correct: false, misconception: 'Kiest het programma voor teksten en verslagen.' },
          { text: 'PowerPoint', correct: true, explanation: 'PowerPoint maakt een reeks dia\'s die je aan een groep laat zien.' },
          { text: 'OneDrive', correct: false, misconception: 'Kiest de opslagplek in plaats van een programma om iets te maken.' },
          { text: 'Excel', correct: false, misconception: 'Kiest het programma voor getallen, formules en grafieken.' }
        ],
        feedback: 'Deze vier hoor je uit elkaar te houden: schrijven, presenteren, rekenen en bewaren.',
        leerdoel: 'Je kunt uitleggen waarvoor je PowerPoint gebruikt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Welke uitleg hoort bij het begrip overgang?',
        options: [
          { text: 'De plek waarin je op een dia je tekst typt.', correct: false, misconception: 'Kiest de uitleg van een tekstvak.' },
          { text: 'Een van de bladen waaruit je presentatie bestaat.', correct: false, misconception: 'Kiest de uitleg van een dia.' },
          { text: 'Het effect om van de ene dia naar de andere te gaan.', correct: true, explanation: 'Een overgang zit dus tussen twee dia\'s in en niet op een dia.' },
          { text: 'De kleur of foto die achter je hele dia staat.', correct: false, misconception: 'Kiest de uitleg van een achtergrond.' }
        ],
        feedback: 'Op de dia staat het tekstvak, tussen twee dia\'s zit de overgang. Zo houd je ze uit elkaar.',
        leerdoel: "Je kunt dia's toevoegen met tekstvakken en afbeeldingen.",
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Zet de stappen voor het maken van een presentatie op de goede volgorde en schrijf ze op.',
        type: 'open',
        modelAnswer: 'Eerst kies ik een lege presentatie. Daarna maak ik mijn titeldia. Dan maak ik de dia met de inhoudsopgave. Vervolgens voeg ik dia\'s toe met informatie over mijn onderwerp. Daarna zet ik overgangen tussen alle dia\'s. Als laatste sla ik de presentatie op.',
        nakijkpunten: [
          'Begint met het kiezen van een lege presentatie en daarna de titeldia.',
          'Zet de inhoudsdia voor de dia\'s met informatie.',
          'Zet de overgangen aan het eind, vlak voor het opslaan.'
        ],
        feedback: 'De overgangen komen bewust als laatste. Dia\'s die je daarna nog toevoegt krijgen anders geen effect mee.',
        leerdoel: 'Je kunt een achtergrond, kleuren en overgangen kiezen die je verhaal ondersteunen.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'bewijs_leveren'
      },
      {
        prompt: 'Wat zet je op je eerste dia, de titeldia?',
        options: [
          { text: 'Alleen je naam en je klas, netjes onder elkaar.', correct: false, misconception: 'Laat het onderwerp weg, dus de kijker weet niet waar het over gaat.' },
          { text: 'Alleen het onderwerp van je presentatie, groot in beeld.', correct: false, misconception: 'Laat weg wie de spreker is, terwijl dat er ook op hoort.' },
          { text: 'Alleen een groot plaatje dat bij je onderwerp past.', correct: false, misconception: 'Denkt dat beeld alleen genoeg is om je presentatie te openen.' },
          { text: 'Je naam, je onderwerp en een aantrekkelijke afbeelding.', correct: true, explanation: 'Zo weet je publiek meteen wie er staat en waar het over gaat.' }
        ],
        feedback: 'Drie dingen dus, en niet een. Op je titeldia staat wie je bent, waar het over gaat en een plaatje.',
        leerdoel: 'Je kunt een presentatie maken met een titeldia, een inhoudsdia en een afsluitende dia.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Aan welke eisen moet je eindpresentatie voldoen? Kies de rij die helemaal klopt.',
        options: [
          { text: 'Korte teksten, goed leesbaar, plaatjes en een video, overgangen.', correct: true, explanation: 'Dat zijn precies de vier eisen die bij de eindopdracht horen.' },
          { text: 'Korte teksten, veel lettertypes, alleen plaatjes, geen video.', correct: false, misconception: 'Onthoudt alleen de eis over korte tekst en verzint de rest erbij.' },
          { text: 'Lange teksten, goed leesbaar, plaatjes en video, overgangen.', correct: false, misconception: 'Denkt dat lange tekst mag zolang die maar goed leesbaar is.' },
          { text: 'Lange teksten, donkere kleuren, geen beeld, geen overgangen.', correct: false, misconception: 'Kiest precies het tegenovergestelde van de vier eisen uit de les.' }
        ],
        feedback: 'Loop deze vier af voordat je inlevert. Twee gaan over tekst, twee over wat erin zit.',
        leerdoel: 'Je kunt je tekst kort en goed leesbaar houden.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Beschrijf drie dingen die je doet terwijl je je presentatie voor de klas houdt.',
        type: 'open',
        modelAnswer: 'Ik vertel zelf het verhaal bij de steekwoorden op mijn dia. Ik kijk af en toe mijn klas aan in plaats van naar het scherm. En als er iets misgaat, bijvoorbeeld een video die niet start, vertel ik gewoon door. Ik heb mijn verhaal vooraf een keer hardop geoefend.',
        nakijkpunten: [
          'Noemt dat je zelf vertelt bij de steekwoorden in plaats van voorleest.',
          'Noemt dat je je publiek af en toe aankijkt.',
          'Noemt wat je doet als de techniek hapert.'
        ],
        feedback: 'Deze drie zorgen samen dat je publiek naar jou luistert en niet naar het scherm zit te staren.',
        leerdoel: 'Je kunt je presentatie laten zien en er zelf bij vertellen.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'bewijs_leveren'
      },
      {
        prompt: 'Wat betekent digitale geletterdheid?',
        options: [
          { text: 'Dat je de tijd kunt aflezen van een digitale klok.', correct: false, misconception: 'Koppelt digitaal aan een digitaal display in plaats van aan apparaten.' },
          { text: 'Dat je goed en veilig omgaat met je laptop en telefoon.', correct: true, explanation: 'Het gaat om veilig en handig omgaan met al je digitale apparaten.' },
          { text: 'Dat je heel snel kunt typen zonder naar je toetsen te kijken.', correct: false, misconception: 'Beperkt het tot een losse handigheid met het toetsenbord.' },
          { text: 'Dat je berichten in een geheime taal kunt schrijven.', correct: false, misconception: 'Leest geletterdheid als een vaardigheid in geheimschrift.' }
        ],
        feedback: 'Je leert het om jezelf veilig te houden, je schoolwerk beter te doen en online echt van nep te scheiden.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Je hebt de eindtoets net af en ziet je resultaat op het scherm. Wat doe je als eerste?',
        options: [
          { text: 'Je docent in de les vertellen wat je gehaald hebt.', correct: false, misconception: 'Meldt het mondeling, dus zonder bewijs dat de score klopt.' },
          { text: 'Het scherm wegklikken en het cijfer onthouden.', correct: false, misconception: 'Vertrouwt op het geheugen, terwijl de docent een bewijsstuk nodig heeft.' },
          { text: 'Meteen een schermfoto maken van je resultaat.', correct: true, explanation: 'Na het wegklikken komt dat scherm niet meer terug.' },
          { text: 'De toets nog een keer maken voor een hogere score.', correct: false, misconception: 'Denkt dat een toets zomaar over te doen is voor een beter resultaat.' }
        ],
        feedback: 'Die foto sla je daarna op in OneDrive en deel je met je docent, met erbij wat goed ging.',
        leerdoel: 'Je kunt je resultaat opslaan en delen met je docent.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren'
      },
      {
        prompt: 'Je ziet online een winactie en er wordt om je e-mailadres gevraagd. Wat doe je als eerste?',
        options: [
          { text: 'Je vult je e-mailadres in, want meedoen kost je verder niets.', correct: false, misconception: 'Ziet gratis meedoen als bewijs dat er niets te verliezen valt.' },
          { text: 'Je vult het adres van een klasgenoot in, dan loop jij geen risico.', correct: false, misconception: 'Schuift het risico door in plaats van het eerst te controleren.' },
          { text: 'Je kijkt eerst van wie de actie is en wat ze met je gegevens doen.', correct: true, explanation: 'Pas als je de afzender en de voorwaarden kent, kun je echt kiezen.' },
          { text: 'Je vult een verzonnen adres in, want dan maak je toch nog kans.', correct: false, misconception: 'Denkt dat een nepadres helpt, terwijl je dan sowieso niets kunt winnen.' }
        ],
        feedback: 'Eerst uitzoeken van wie de actie is, daarna pas invullen. Die volgorde komt ook in je eindtoets terug.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'De winactie is van een groot bedrijf zoals bol.com, en in de voorwaarden staat dat je gegevens alleen voor die actie gebruikt worden. Dan loopt je data weinig gevaar.',
        waar: true,
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        feedback: 'Een bekende afzender met duidelijke voorwaarden is iets anders dan een onbekend formulier. Lees die voorwaarden dus echt.'
      },
      {
        prompt: 'Je cijfers staan in SOMtoday, je schoolmail in Outlook en je opdrachten in ItsLearning. Waar vind je je rooster?',
        options: [
          { text: 'In SOMtoday, want daar staat ook de rest van je leerlinggegevens.', correct: true, explanation: 'SOMtoday is het leerlingvolgsysteem met je cijfers, je absentie en je rooster.' },
          { text: 'In Outlook, want dat is het programma voor je agenda en je mail.', correct: false, misconception: 'Denkt dat een agenda in de mail hetzelfde is als je lesrooster.' },
          { text: 'In OneDrive, want daar staan al je schoolbestanden bij elkaar.', correct: false, misconception: 'Verwart een opslagplek voor bestanden met een systeem met schoolgegevens.' },
          { text: 'In ItsLearning, want daar zet je docent alle opdrachten neer.', correct: false, misconception: 'Ziet de leeromgeving als de plek voor alle schoolinformatie.' }
        ],
        feedback: 'Drie systemen, drie taken: Outlook voor mail, SOMtoday voor cijfers en rooster, ItsLearning voor opdrachten.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Waarvoor gebruik je de taakbalk onderaan je scherm?',
        options: [
          { text: 'Om te zien hoeveel opslagruimte er nog vrij is op je laptop.', correct: false, misconception: 'Verwart de balk met de instellingen over opslagruimte.' },
          { text: 'Om je updates te installeren zodra ze voor je klaarstaan.', correct: false, misconception: 'Denkt dat updates via de balk lopen in plaats van via de instellingen.' },
          { text: 'Om programma\'s te starten en te wisselen tussen wat openstaat.', correct: true, explanation: 'Links zit de Startknop, en daarnaast staan je vaste en je open programma\'s.' },
          { text: 'Om bestanden op te slaan die je snel wilt terugvinden.', correct: false, misconception: 'Ziet de balk als een opslagplek in plaats van als een startplek.' }
        ],
        feedback: 'De taakbalk is je startplek: Startknop, zoekvak en je openstaande vensters op een rij.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Welk onderdeel van je computer zorgt ervoor dat je beeld op je scherm komt?',
        options: [
          { text: 'De videokaart.', correct: true, explanation: 'De videokaart rekent het beeld uit en stuurt het naar je scherm.' },
          { text: 'De geluidskaart.', correct: false, misconception: 'Wisselt de twee kaarten om, omdat ze allebei kaart heten.' },
          { text: 'De harde schijf.', correct: false, misconception: 'Denkt dat de plek waar bestanden staan ook het beeld maakt.' },
          { text: 'Het toetsenbord.', correct: false, misconception: 'Noemt een onderdeel waarmee je invoert in plaats van een dat uitvoert.' }
        ],
        feedback: 'De processor is de rekenbaas, de videokaart doet het beeld en de geluidskaart het geluid.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Je laptop hangt de hele dag aan de oplader en wordt daar warm van. Dat is helemaal geen probleem.',
        waar: false,
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Warmte sloopt je accu en je onderdelen. Haal hem eraf als hij vol is en houd de ventilatiegaten vrij.'
      },
      {
        prompt: 'Wat betekent het als iemand digitaal weerbaar is?',
        options: [
          { text: 'Dat hij zo min mogelijk online is en hem dus weinig kan overkomen.', correct: false, misconception: 'Denkt dat wegblijven hetzelfde is als jezelf kunnen redden.' },
          { text: 'Dat hij online risico\'s herkent en weet wat hij er zelf aan doet.', correct: true, explanation: 'Weerbaar zijn is zien wat er gebeurt en er daarna naar handelen.' },
          { text: 'Dat hij van elk programma weet hoe je het moet installeren.', correct: false, misconception: 'Verwart technische handigheid met veilig omgaan met risico\'s.' },
          { text: 'Dat hij alles wat hij online leest eerst aan zijn ouders vraagt.', correct: false, misconception: 'Legt de verantwoordelijkheid buiten zichzelf in plaats van erbij.' }
        ],
        feedback: 'Weerbaar is niet hetzelfde als bang. Je gebruikt internet gewoon, maar je weet waar je op let.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Een foto van je rijbewijs of je paspoort kun je gerust op social media zetten.',
        waar: false,
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Daarop staan je geboortedatum en je documentnummer. Daarmee kan iemand zich voor jou uitgeven.'
      }
    ]
  }
};
