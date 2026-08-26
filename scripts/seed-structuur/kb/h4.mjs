// Hoofdstuk 4 - Werken met Word, Excel en PowerPoint.
// KADERBEROEPSGERICHTE LEERWEG (kb).
//
// Bron: het Wikiwijs-arrangement "Digitale Geletterdheid" van DaCapo College.
//   4.1  <- les 4 "Word (les 1/2)", inclusief de afsluitende Wikiwijs-vragenset
//           en de vooruitblik "Klaar voor volgende keer?".
//   4.2  <- les 5 "Word (les 2/2)", stap 1 t/m 5, de opdracht "Verslag vullen",
//           het extra hoofdstuk 3 met vier eigen zinnen, de controle
//           "Opslaan & afronden" en het blokje "Herhaling uit vorige les".
//   4.3  <- les 5, de extra opdracht (of huiswerk) over afbeeldingen zoeken via
//           Google met Tools en usage rights, opslaan, invoegen en indelen.
//   4.4  <- TOEGEVOEGD, geen Wikiwijs-bronles. In eigen woorden geschreven op
//           basis van het open arrangement "Excel Basis B3/K3/T3 UC VMBO" op
//           maken.wikiwijs.nl/196081 (CC BY-SA 4.0) en de Nederlandstalige
//           hulppagina van Microsoft over de functie GEMIDDELDE. De
//           bronvermelding staat in de inleiding van de praktijkopdracht, waar
//           de meta-informatie over deze paragraaf toch al staat.
//   4.5  <- les 6 "PowerPoint (les 1/2)", inclusief de video uit de bron.
//   4.6  <- les 7 "PowerPoint (les 2/2)", de vier onderwerpen met hun tips en
//           de vier eisen aan de eindpresentatie.
//   4.7  <- les 8 "Eindtoets basisvaardigheden ICT (les 1 t/m 7)".
//
// De vrijwillige plusparagraaf 4.8 bestaat ALLEEN in de theoretische leerweg.
// In kb loopt hoofdstuk 4 van 4.1 tot en met het checkpoint 4.7.
//
// KB-PROFIEL: WAT ER ANDERS IS DAN IN tl/h4.mjs
// --------------------------------------------
// Dezelfde onderwerpen, dezelfde volgorde en dezelfde leerdoelen als de
// theoretische leerweg. De taal en de vorm zijn opnieuw geschreven, niet
// overgenomen:
//
//   * ZINSLENGTE. Kader zit op 12 tot 15 woorden per zin; dit hoofdstuk meet
//     12,2 gemiddeld over de lopende theorietekst, gelijk aan de andere zeven
//     kb-hoofdstukken (12,1 tot 13,0). Dat is bewust NIET korter: bb zit op 7
//     tot 9 woorden, en een kb-hoofdstuk dat daaronder duikt is geen kb meer.
//     Ronde 1 leverde 8,8 op en is daarom in ronde 2 opnieuw geschreven: de
//     losse mededelingen zijn weer aan elkaar gezet met want, dus, en zodat.
//     Het waarom staat er nog steeds, maar achter het hoe en in kortere stukjes.
//     Genummerde stappen en opsommingen blijven wel kort - die lees je niet,
//     die volg je - dus de meting hierboven gaat over de <p>-tekst.
//   * BEGRIP EERST VOORDOEN. Elk begrip krijgt eerst een concreet voorbeeld en
//     wordt pas daarna als woord gebruikt. Een cel heet dus eerst "het vakje
//     waar 8500 in staat" en pas daarna een cel.
//   * THEORIE EN DOEN WISSELEN ELKAAR AF. Nergens meer dan zes of zeven zinnen
//     achter elkaar. Tussen de blokjes staan "Doe dit even" en "Check even":
//     korte taakjes van hooguit twee minuten, waarna de tekst het antwoord
//     geeft. Stappen staan in genummerde lijstjes in plaats van in lopende
//     tekst, want een stappenplan lees je niet, dat volg je.
//   * GEEN ROUTESTUURSYSTEEM. tl stuurt na de tussentoets van 4.3 twee sporen
//     in, met een uitslag die de leerling zelf moet doorgeven. Dat is voor deze
//     leerweg administratie zonder opbrengst. De steun- en plusopgaven staan
//     gewoon in elk oefenblok, zodat een leerling ze pakt wanneer hij ze nodig
//     heeft. De terugkeervragen zelf blijven: elke afsluitquiz vanaf 4.2 haalt
//     een leerdoel uit een eerdere paragraaf op.
//   * MEER MEDIA MET KIJKVRAAG. Waar tl een scherm beschrijft, staat hier een
//     pagina of filmpje dat het scherm laat zien. Elke kijkvraag is met het
//     gelinkte materiaal ook echt te beantwoorden.
//
// De startcheck van 4.1 begint met twee voorkennisitems over hoofdstuk 3. Die
// dragen bewust GEEN leerdoel: het zijn geen doelen van dit hoofdstuk, en een
// vreemd leerdoel zou de toetsmatrijs vervuilen.

import { p, checkpoint, media } from '../helpers.mjs';

const LD_4_1 = [
  'Je kunt een Word-document maken, een duidelijke naam geven en op de juiste plek opslaan.',
  'Je kunt een automatisch voorblad invoegen en invullen.',
  'Je kunt tekst dikgedrukt, schuin of onderstreept maken en paginanummers toevoegen.'
];

const LD_4_2 = [
  'Je kunt tekst opmaken met de stijlen Kop 1 en Kop 2.',
  'Je kunt een automatische inhoudsopgave invoegen en bijwerken.',
  'Je weet waarom koppen je verslag overzichtelijk maken.'
];

const LD_4_3 = [
  'Je kunt op Google zoeken naar afbeeldingen met een Creative Commons-licentie.',
  'Je kunt een afbeelding invoegen in Word en netjes bij je tekst plaatsen.',
  'Je weet waarom je niet zomaar elke afbeelding van internet mag gebruiken.'
];

const LD_4_4 = [
  'Je kunt gegevens netjes in een tabel zetten in Excel.',
  'Je kunt met een eenvoudige formule optellen en een gemiddelde berekenen.',
  'Je kunt van je tabel een grafiek maken en die aflezen.'
];

const LD_4_5 = [
  'Je kunt uitleggen waarvoor je PowerPoint gebruikt.',
  "Je kunt dia's toevoegen met tekstvakken en afbeeldingen.",
  'Je kunt een achtergrond, kleuren en overgangen kiezen die je verhaal ondersteunen.'
];

const LD_4_6 = [
  'Je kunt een presentatie maken met een titeldia, een inhoudsdia en een afsluitende dia.',
  'Je kunt je tekst kort en goed leesbaar houden.',
  'Je kunt je presentatie laten zien en er zelf bij vertellen.'
];

const LD_4_7 = [
  'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
  'Je kunt je resultaat opslaan en delen met je docent.'
];

export default {
  chapter: 4,
  chapterTitle: 'Werken met Word, Excel en PowerPoint',
  badge: 'Documentbouwer',
  paragraphs: [
    p('4.1', 'Word: je eerste document met voorblad, opmaak en paginanummers', ['22A', '21A'], 'Word-document met een ingevuld voorblad, drie opgemaakte oefenzinnen en paginanummers', 100, 'Voorblad Bouwer',
      ['Van leeg document naar een bestand dat je terugvindt',
        'Op school lever je verslagen en opdrachten in bij je docent, bijna altijd in Microsoft Word. ' +
        'Word is het programma waarin je teksten schrijft en daarna netjes opmaakt. ' +
        'Ook later op je werk kom je diezelfde Microsoft-programma\'s bijna overal weer tegen. ' +
        'Je opent Word en klikt daarna op de tegel Leeg document.' +
        '</p><p><strong>Doe dit even:</strong> open Word en tel hoeveel tabbladen er bovenin staan.</p><p>' +
        'Bovenin je scherm staat nu een brede balk vol knoppen, en die balk heet de werkbalk. ' +
        'In de werkbalk voeg je van alles toe aan je document, en je slaat het er ook mee op. ' +
        'Doe dat opslaan meteen, dus voordat je ook maar iets getypt hebt.' +
        '</p><ol>' +
        '<li>Klik links bovenin op Bestand of op het blauwe icoontje.</li>' +
        '<li>Dat icoontje is een floppy disc, een oude vorm van een USB-stick.</li>' +
        '<li>Je krijgt nu een scherm waarin je twee dingen kiest.</li>' +
        '</ol><p>' +
        'Bovenin dat scherm typ je de bestandsnaam, en in de lijst ernaast wijs je de plek aan. ' +
        'Kies een bestandsnaam waaraan je over twee weken nog ziet wat erin staat. ' +
        'Gebruik in deze les deze naam: Verslag_Oefening_Voornaam_klas.' +
        '</p><p><strong>Check even:</strong> welke naam is duidelijker, opdracht.docx of Verslag_Oefening_Sara_1K2?</p><p>' +
        'De tweede natuurlijk, want die naam vertelt je meteen wat erin zit. ' +
        'Kies daarna net zo bewust een plek voor je bestand: je bureaublad of OneDrive. ' +
        'Dat verschil tussen die twee plekken is een stuk groter dan het lijkt.' +
        '</p><ul>' +
        '<li>Op je bureaublad staat het bestand alleen op die ene laptop.</li>' +
        '<li>In OneDrive staat het bij jouw account, dus je opent het overal.</li>' +
        '</ul><p>' +
        'Twijfel je waar het bestand hoort? Vraag dat voor de zekerheid even aan je docent. ' +
        'Sla tijdens het typen steeds tussendoor op met de sneltoets CTRL+S erbij. ' +
        'Zo raak je nooit een halve pagina kwijt als Word vastloopt. ' +
        'Werk je in OneDrive, dan kun je bovendien automatisch opslaan aanzetten. ' +
        'Die schakelaar vind je boven de werkbalk, helemaal links in beeld.'],
      ['Een voorblad invoegen, tekst opmaken en nummers eronder',
        'Een voorblad is de eerste pagina van je verslag, met daarop de titel en jouw naam. ' +
        'Meestal staan er ook de datum en je klas op, zodat je docent weet van wie het is. ' +
        'Word heeft kant-en-klare voorbladen klaarstaan: mooie pagina\'s die je alleen nog invult. ' +
        'Zo voeg je er in vier stappen een in.' +
        '</p><ol>' +
        '<li>Klik in de werkbalk bovenaan op Invoegen.</li>' +
        '<li>Zoek helemaal links de knop Voorblad en klik erop.</li>' +
        '<li>Kies uit het menu een stijl die jij mooi vindt.</li>' +
        '<li>Klik daarna op de velden en vul ze in.</li>' +
        '</ol><p>' +
        'Die velden heten Titel, Subtitel, Auteur, Datum en Cursus.' +
        '</p><ul>' +
        '<li>Titel: het onderwerp van je verslag.</li>' +
        '<li>Subtitel: mag leeg blijven, of schrijf Oefening Word.</li>' +
        '<li>Auteur: jouw voor- en achternaam.</li>' +
        '<li>Datum: vandaag.</li>' +
        '<li>Cursus: je klas.</li>' +
        '</ul><p>' +
        'Tip: elk stukje van het voorblad kun je aanklikken en aanpassen zonder iets stuk te maken. ' +
        'Let op dat je hiervoor Invoegen gebruikt, en dus niet Indeling of Ontwerpen.' +
        '</p><p><strong>Check even:</strong> onder welk tabblad zoek jij straks de knop Paginanummer?</p><p>' +
        'Ook onder Invoegen, want alles wat je aan je document toevoegt staat onder dat tabblad. ' +
        'Druk nu op Ctrl + Enter, dan krijg je een nieuwe pagina onder je voorblad. ' +
        'Typ daar deze vier zinnen over, of kopieer en plak ze in je document. ' +
        'Dit is gewone tekst. Dit is dikgedrukte tekst. Dit is schuin geschreven tekst. Dit is onderstreepte tekst.' +
        '</p><p>' +
        'Opmaak betekent: hoe de tekst eruitziet, dus dik, onderstreept, schuin of een ander lettertype. ' +
        'Selecteren doe je door je linkermuisknop voor de zin vast te houden en naar het einde te slepen. ' +
        'Die zin krijgt dan een gekleurd vlak, en daarop werkt een sneltoets van drie.' +
        '</p><ul>' +
        '<li>Selecteer de tweede zin en druk op CTRL + B voor dikgedrukt.</li>' +
        '<li>Selecteer de derde zin en druk op CTRL + i voor schuin.</li>' +
        '<li>Selecteer de vierde zin en druk op CTRL + U voor onderstrepen.</li>' +
        '</ul><p><strong>Doe dit even:</strong> maak de tweede zin dik en kijk of de eerste zin gewoon blijft.</p><p>' +
        'Voeg tot slot op elke pagina een nummer toe via Invoegen en dan Paginanummer. ' +
        'Kies zelf de plek: bovenaan, onderaan in het midden of juist links onderin.' +
        '</p><p><strong>Check even:</strong> waarom is je lezer blij met nummers op een verslag van tien pagina\'s?</p><p>' +
        'Omdat hij dan meteen weet waarheen hij moet bladeren als jij ergens naar verwijst. ' +
        'Klaar voor volgende keer? Dan maak je kopjes met Kop 1 en Kop 2 en een automatische inhoudsopgave. ' +
        'Die lijst gebruikt precies de paginanummers die je vandaag hebt ingevoegd.'],
      [
        media('https://www.youtube.com/embed/52oE3U5sdgE', 'Video: een voorblad invoegen in Word', 'Welke velden van het voorblad vult de maker in? Schrijf op welk veld jij anders zou invullen dan hij.'),
        media('https://support.microsoft.com/nl-nl/word/training/save-a-document', 'Microsoft: opslaan in Word en wat Automatisch opslaan doet', 'Op deze pagina staan twee knoppen afgebeeld: Bestand opslaan en Automatisch opslaan. Welke twee dingen kies jij volgens de les in het opslaanscherm? Let op: dat scherm heet in nieuwe Word Een kopie opslaan en in oudere versies Opslaan als.'),
        media('https://support.microsoft.com/nl-nl/word/training/add-and-edit-text', 'Microsoft: tekst selecteren en opmaken in de werkbalk', 'Op de afbeelding staat de groep Lettertype. Welke drie knoppen horen bij CTRL + B, CTRL + i en CTRL + U?')
      ],
      [
        {
          vraag: 'Welkom in hoofdstuk 4. Je maakt hier een verslag, een rekenblad en een presentatie. Wat denk jij dat je aan het eind moet inleveren?',
          antwoord: 'Vier bestanden en een schermfoto: een Word-verslag, een Excel-bestand, een oefenpresentatie, een eindpresentatie en je bewijs van de eindtoets.',
          uitleg: 'In 4.1 tot en met 4.3 bouw je aan een verslag in Word. In 4.4 zet je gegevens in Excel. In 4.5 en 4.6 maak je twee presentaties. In 4.7 sluit je je hele eerste halfjaar af met een eindtoets.',
          leerdoel: ''
        },
        {
          vraag: 'Voorkennis uit hoofdstuk 3. Je krijgt een mail die om je pincode vraagt. Wat is dit, en wat doe je?',
          antwoord: 'Dit is phishing. Je vult niets in en je klikt nergens op. Banken en de overheid vragen nooit per mail om een pincode.',
          uitleg: 'Al je werk van dit hoofdstuk staat straks in OneDrive, achter een wachtwoord. Wie dat wachtwoord steelt, komt bij al je schoolwerk. Zet daarom twee-staps-verificatie aan op je schoolaccount.',
          leerdoel: ''
        },
        {
          vraag: 'Voorkennis uit hoofdstuk 3. Waarom denk je na voordat je iets over jezelf online zet?',
          antwoord: 'Omdat het lang blijft bestaan, ook nadat je het weghaalt. Anderen kunnen het kopieren of misbruiken.',
          uitleg: 'In dit hoofdstuk zet je je naam en klas op een voorblad en straks op een dia. Dat is voor school prima, maar bedenk steeds met wie je het deelt.',
          leerdoel: ''
        },
        {
          vraag: 'Voorkennis uit hoofdstuk 2. Wat is het verschil tussen hardware en software? Waar hoort Word bij?',
          antwoord: 'Hardware zijn de onderdelen die je kunt vastpakken. Software zijn de programma\'s die erop draaien. Word is software.',
          uitleg: 'Word, Excel en PowerPoint zijn alle drie software van Microsoft. Ze draaien op de hardware van je laptop, en je opent ze via het startmenu of de taakbalk.',
          leerdoel: ''
        },
        {
          vraag: 'Voorkennis uit hoofdstuk 1. Waarom mag je tekst van internet niet zomaar overnemen in je verslag?',
          antwoord: 'Omdat die tekst van iemand anders is. Je moet de bron erbij zetten of het in je eigen woorden schrijven.',
          uitleg: 'Voor plaatjes geldt precies dezelfde regel, en dat werk je uit in 4.3. Daar leer je hoe je beeld zoekt dat je wel mag gebruiken.',
          leerdoel: ''
        },
        {
          vraag: 'Je maakt zo een verslag dat je thuis wilt afmaken. Waar sla jij dat bestand op, en hoe noem je het?',
          antwoord: 'In OneDrive, met een naam die je herkent, bijvoorbeeld Verslag_Oefening_Voornaam_klas.',
          uitleg: 'Je bureaublad hoort bij die ene laptop. OneDrive hoort bij jouw account, dus je opent het overal. Een naam als Document1 zegt je over twee weken niets meer.',
          leerdoel: LD_4_1[0]
        },
        {
          vraag: 'Wat hoort er op de eerste pagina van een verslag? Noem er drie. Wie vult die informatie in?',
          antwoord: 'De titel, je naam, de datum en je klas. Op een automatisch voorblad zijn dat de velden Titel, Subtitel, Auteur, Datum en Cursus. Jij vult ze zelf in.',
          uitleg: 'Word levert alleen de vormgeving en de lege velden. Het programma weet niet hoe jij heet of in welke klas je zit.',
          leerdoel: LD_4_1[1]
        },
        {
          vraag: 'Hoe zou jij een zin dik maken zonder je muis naar de werkbalk te bewegen? En waar zit de knop voor paginanummers?',
          antwoord: 'De zin selecteren en dan CTRL + B indrukken. Paginanummers zitten onder het tabblad Invoegen.',
          uitleg: 'De letters komen uit het Engels: B van bold, i van italic en U van underline. Alles wat je toevoegt aan je document staat onder Invoegen.',
          leerdoel: LD_4_1[2]
        }
      ],
      {
        tekst: 'Maak je eerste Word-verslag en lever het in. Werk de stappen een voor een af.<br><br>' +
          '<strong>Stap 1.</strong> Open Microsoft Word en klik op Leeg document.<br>' +
          '<strong>Stap 2.</strong> Sla het bestand meteen op via Bestand of het blauwe floppy-icoontje.<br>' +
          '<strong>Stap 3.</strong> Geef het de naam Verslag_Oefening_Voornaam_klas.<br>' +
          '<strong>Stap 4.</strong> Kies bewust een plek: je bureaublad of OneDrive. Vraag je docent waar het moet als je twijfelt.<br>' +
          '<strong>Stap 5.</strong> Klik op Invoegen, dan op Voorblad, en kies een stijl.<br>' +
          '<strong>Stap 6.</strong> Vul de vijf velden in: Titel, Subtitel, Auteur, Datum en Cursus.<br>' +
          '<strong>Stap 7.</strong> Druk op Ctrl + Enter voor een nieuwe pagina onder je voorblad.<br>' +
          '<strong>Stap 8.</strong> Typ daar de vier oefenzinnen over, of kopieer en plak ze: Dit is gewone tekst. Dit is dikgedrukte tekst. Dit is schuin geschreven tekst. Dit is onderstreepte tekst.<br>' +
          '<strong>Stap 9.</strong> Selecteer de tweede zin en druk op CTRL + B. Doe de derde zin met CTRL + i en de vierde met CTRL + U.<br>' +
          '<strong>Stap 10.</strong> Klik op Invoegen, dan op Paginanummer, en kies zelf de plek.<br>' +
          '<strong>Stap 11.</strong> Sla op met CTRL + S en controleer of het bestand op de goede plek staat.<br>' +
          '<strong>Stap 12.</strong> Lever het in zoals je docent uitlegt.<br>' +
          '<strong>Stap 13.</strong> Maak daarna de afsluiting van Word les 1 om te zien of je alles begrepen hebt: https://maken.wikiwijs.nl/p/questionnaire/standalone/8316071',
        label: 'Schrijf op hoe je bestand heet, waar het staat, en welke stap het lastigst was.',
        modelAnswer: 'Mijn bestand heet Verslag_Oefening_Sara_1K2 en staat in OneDrive. Daar kan ik er thuis ook bij, want ik log in met hetzelfde account. Op pagina 1 staat een automatisch voorblad. Ik heb Titel, Subtitel, Auteur, Datum en Cursus ingevuld. Op pagina 2 staan de vier oefenzinnen. De tweede zin is dik met CTRL + B. De derde is schuin met CTRL + i. De vierde is onderstreept met CTRL + U. Via Invoegen en Paginanummer staat er onderaan elke pagina een nummer. Het lastigst vond ik het selecteren van precies een hele zin.',
        nakijkpunten: [
          'Het bestand heeft een herkenbare naam en staat op de plek die de docent noemde.',
          'Pagina 1 is een automatisch voorblad met alle vijf de velden ingevuld.',
          'De vier oefenzinnen staan er, met de juiste opmaak per zin.',
          'Op elke pagina staat een paginanummer.'
        ]
      },
      ['Waar in de werkbalk vind je Paginanummer?', 'Wat doet CTRL + B en wat doet CTRL + U?', 'Waarom kies je bewust een plek bij het opslaan?', 'Welke vijf velden staan er op een automatisch voorblad?', 'Wat is het verschil tussen je bureaublad en OneDrive?', 'Waarmee maak je een nieuwe pagina?'],
      'Bouw een voorblad door de juiste velden in te vullen en kies bij elke opmaakopdracht de goede sneltoets.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Loop samen na waar deze bestandsnaam misgaat: opdracht.docx op het bureaublad van lokaal 12.',
            antwoord: 'Er zitten twee fouten in. De naam zegt niets over de inhoud. En het bureaublad hoort bij die ene laptop, niet bij jouw account.',
            uitleg: 'Elke fout heeft een eigen gevolg. Van de naam kun je het bestand niet terugvinden. Van de plek kun je er thuis niet bij.',
            leerdoel: LD_4_1[0]
          },
          {
            groep: 'samen',
            vraag: 'Bilal zegt: "Ik sla wel op als ik klaar ben." Wat kan er dan misgaan?',
            antwoord: 'Loopt Word vast of gaat de stroom eruit, dan is alles weg. Wie tussendoor CTRL + S gebruikt, raakt hooguit een paar regels kwijt.',
            uitleg: 'Automatisch opslaan werkt alleen als je bestand in OneDrive staat. Op het bureaublad ben jij zelf het vangnet.',
            leerdoel: LD_4_1[0]
          },
          {
            groep: 'zelf',
            vraag: 'Schrijf de vijf velden van een automatisch voorblad op. Zet erachter wat jij erin zou zetten.',
            antwoord: 'Titel: het onderwerp van je verslag. Subtitel: Oefening Word of niets. Auteur: je voor- en achternaam. Datum: vandaag. Cursus: je klas.',
            uitleg: 'Het voorblad regelt alleen de vorm. De inhoud van elk veld komt van jou. Je vindt het onder Invoegen, dus niet onder Indeling of Ontwerpen.',
            leerdoel: LD_4_1[1]
          },
          {
            groep: 'zelf',
            vraag: 'Je wilt alleen de derde zin schuin maken. Schrijf in drie stappen op wat je doet.',
            antwoord: 'Stap 1: houd je linkermuisknop vast voor de zin. Stap 2: sleep naar het einde van de zin. Stap 3: druk op CTRL + i.',
            uitleg: 'Zonder selecteren gebeurt er niets, of de sneltoets geldt vanaf je cursor. Selecteren zegt tegen Word: dit stuk bedoel ik.',
            leerdoel: LD_4_1[2]
          },
          {
            groep: 'steun',
            vraag: 'Zet de drie sneltoetsen op een rij. Welke maakt dik, welke schuin en welke onderstreept?',
            antwoord: 'CTRL + B maakt dik. CTRL + i maakt schuin. CTRL + U maakt onderstreept.',
            uitleg: 'De letter is de eerste letter van het Engelse woord: bold, italic, underline. CTRL + S hoort er niet bij, want die slaat op.',
            leerdoel: LD_4_1[2]
          },
          {
            groep: 'plus',
            vraag: 'Automatisch opslaan staat aan in OneDrive. Waarom is CTRL + S dan toch handig om te kennen?',
            antwoord: 'Omdat automatisch opslaan alleen in OneDrive werkt. Werk je ergens anders, dan is CTRL + S je enige vangnet.',
            uitleg: 'Je weet met CTRL + S bovendien precies op welk moment je versie is vastgelegd. Dat scheelt als je iets wilt terugdraaien.',
            leerdoel: LD_4_1[0]
          }
        ]
      }),

    p('4.2', 'Koppen en een automatische inhoudsopgave', ['22A'], 'verslag met Kop 1, Kop 2 en een bijgewerkte automatische inhoudsopgave', 100, 'Kop of Geen Kop',
      ['Een koptekst is een stijl, geen dikke letter',
        'Vandaag werk je verder in het document dat je vorige les hebt gemaakt. ' +
        'Open het dus op de plek waar je het toen hebt opgeslagen. ' +
        'Vind je het niet meer terug? Kijk dan in OneDrive of op je bureaublad. ' +
        'Zoek daar op de naam die jij het bestand vorige les gegeven hebt.' +
        '</p><p><strong>Doe dit even:</strong> open je Word-bestand van vorige les en kijk of je voorblad er nog staat.</p><p>' +
        'Stel: je typt het woord Inleiding en maakt het daarna zelf dik en groot. ' +
        'Het ziet er dan uit als een kop, maar Word weet nog steeds van niets. ' +
        'Daarom gebruik je een koptekst, en dat is een tekststijl van Word zelf. ' +
        'Een stijl is een label dat je aan een stuk tekst hangt.' +
        '</p><p><strong>Check even:</strong> ziet Word verschil tussen een zelf dik gemaakt woord en een kop?</p><p>' +
        'Nee, want met dat label zeg je pas echt tegen Word: dit stukje tekst is een kop. ' +
        'Word maakt hem daarna zelf dik en groot, precies zoals bij de andere koppen. ' +
        'Belangrijker nog: Word onthoudt het, zodat het je koppen later kan terugvinden. ' +
        'In het vakje Stijlen op het tabblad Start staan die kopstijlen voor je klaar.' +
        '</p><ul>' +
        '<li>Kop 1 is een hoofdtitel of een hoofdstuk.</li>' +
        '<li>Kop 2 is een subtitel onder zo\'n hoofdstuk.</li>' +
        '<li>Kop 3 gebruik je pas als je nog een laag dieper gaat.</li>' +
        '</ul><p>' +
        'Zo geef je je eerste kop een stijl.' +
        '</p><ol>' +
        '<li>Ga naar de tweede pagina, waar je oefenzinnen staan.</li>' +
        '<li>Typ bovenaan die pagina het woord Inleiding.</li>' +
        '<li>Selecteer dat woord met je linkermuisknop.</li>' +
        '<li>Klik boven in de werkbalk op Start.</li>' +
        '<li>Zoek het vakje Stijlen en klik daar op Kop 1.</li>' +
        '</ol><p><strong>Check even:</strong> waarom zou je Inleiding niet gewoon zelf dik en groot maken?</p><p>' +
        'Omdat Word een zelfgemaakte dikke letter later niet als kop herkent. ' +
        'Je inhoudsopgave blijft dan gewoon leeg, hoe mooi je titel er ook uitziet. ' +
        'Maak nu ook twee hoofdstukken, allebei bovenaan een eigen nieuwe pagina. ' +
        'Zo\'n nieuwe pagina maak je met de sneltoets CTRL + ENTER.' +
        '</p><ul>' +
        '<li>Hoofdstuk 1 - Wat is Microsoft Word? Geef dit de stijl Kop 1.</li>' +
        '<li>Hoofdstuk 2 - Wat heb ik geleerd? Geef dit ook de stijl Kop 1.</li>' +
        '</ul>'],
      ['De inhoudsopgave invoegen en bijwerken',
        'Een inhoudsopgave is een lijst met hoofdstukken en bladzijden, voorin een boek of werkstuk. ' +
        'In die lijst staat welke hoofdstukken jij hebt gemaakt in je verslag. ' +
        'Er staat achter elke regel ook bij op welke pagina de lezer dat hoofdstuk vindt. ' +
        'Word maakt zo\'n lijst helemaal zelf voor je, zolang je met kopstijlen werkt.' +
        '</p><ol>' +
        '<li>Scroll terug naar het begin van je document, net na het voorblad.</li>' +
        '<li>Druk op Ctrl + Enter voor een lege pagina.</li>' +
        '<li>Klik boven in de werkbalk op Verwijzingen.</li>' +
        '<li>Klik op Inhoudsopgave.</li>' +
        '<li>Kies een standaardstijl, bijvoorbeeld Automatische inhoudsopgave 1.</li>' +
        '</ol><p>' +
        'Je Inleiding schuift nu een pagina naar achteren, en dat hoort ook zo. ' +
        'Word haalt namelijk zelf alle stukken met Kop 1 en Kop 2 op. ' +
        'Achter elke kop zet het programma daarna vanzelf het goede paginanummer neer. ' +
        'Zie je jouw eigen hoofdstukken met nummers in de lijst staan? Dan is het gelukt.' +
        '</p><p><strong>Doe dit even:</strong> tel de regels in jouw inhoudsopgave. Klopt dat met je koppen?</p><p>' +
        'Zie je helemaal niets staan? Dan is de kopstijl waarschijnlijk nog niet goed gezet. ' +
        'Probeer die stap dan gewoon nog een keer rustig opnieuw. ' +
        'Lukt het daarna nog steeds niet, vraag dan hulp aan je docent of buurman. ' +
        'Vergeet ook niet om tussendoor steeds op te slaan met CTRL + S.' +
        '</p><p><strong>Doe dit even:</strong> voeg onderaan je verslag een derde hoofdstuk toe met Kop 1. Verandert je lijst mee?</p><p>' +
        'Nee, want de lijst klopt na zo\'n verandering niet meer vanzelf. ' +
        'De inhoudsopgave is namelijk een foto van hoe je verslag op dat moment was. ' +
        'Je moet die foto daarom zelf even opnieuw laten maken, oftewel bijwerken.' +
        '</p><ol>' +
        '<li>Klik op de inhoudsopgave.</li>' +
        '<li>Klik op Inhoudsopgave bijwerken.</li>' +
        '<li>Kies Hele inhoudsopgave bijwerken.</li>' +
        '</ol><p>' +
        'Zo blijft alles in je verslag altijd netjes kloppen. ' +
        'Hier zie je precies waarom die koppen de moeite waard zijn. ' +
        'Zonder koppen zoek je elk paginanummer met de hand op en typ je het over. ' +
        'Met koppen doet Word datzelfde werk voor je in drie klikken. ' +
        'Je lezer ziet bovendien in een oogopslag hoe jouw verslag is opgebouwd.'],
      [
        media('https://www.youtube.com/embed/XP0fUUbKHaY', 'Video: een automatische inhoudsopgave maken in Word', 'Welke stap uit de video zou jij vergeten als je het zonder uitleg probeerde? Schrijf die stap over.'),
        media('https://support.microsoft.com/nl-nl/office/een-inhoudsopgave-invoegen-882e8564-0edb-435e-84b5-1d8552ccf0c0', 'Microsoft: een kop toevoegen en er een inhoudsopgave van maken', 'Op de afbeelding bij Een kop toevoegen zie je hoe Kop 1 eruitziet. Hoe zou een Kop 2 daaronder eruitzien? Waaraan zie je dat het een andere stijl is?')
      ],
      [
        {
          vraag: 'Herhaling uit vorige les. Weet je nog hoe je een voorblad invoegt, tekst dik maakt en paginanummers toevoegt?',
          antwoord: 'Voorblad: Invoegen, dan Voorblad, dan een stijl kiezen. Dik: zin selecteren en CTRL + B. Paginanummers: Invoegen, dan Paginanummer.',
          uitleg: 'Ben je iets vergeten? Kijk dan even terug in 4.1 of vraag hulp. Open Word erbij en zoek de knoppen echt op, want kijken werkt beter dan onthouden.',
          leerdoel: LD_4_1[2]
        },
        {
          vraag: 'Je typt het woord Inleiding en maakt het zelf dik en groot. Is dat volgens jou een kop? Waarom wel of niet?',
          antwoord: 'Het ziet eruit als een kop, maar het is er geen. Word weet alleen dat het een kop is als je de stijl Kop 1 kiest.',
          uitleg: 'Een stijl is een label dat je aan tekst geeft. Zelf dik maken verandert alleen hoe het eruitziet, niet wat het is.',
          leerdoel: LD_4_2[0]
        },
        {
          vraag: 'In een boek staat voorin een lijst met hoofdstukken en bladzijden. Hoe heet die lijst? En hoe zou Word hem zelf kunnen maken?',
          antwoord: 'Dat is de inhoudsopgave. Word maakt hem via Verwijzingen en dan Inhoudsopgave, door je Kop 1 en Kop 2 op te halen.',
          uitleg: 'Verander je later iets, dan werk je de lijst bij. Dat doe je met Inhoudsopgave bijwerken en dan Hele inhoudsopgave bijwerken.',
          leerdoel: LD_4_2[1]
        },
        {
          vraag: 'Je krijgt een verslag van tien pagina\'s zonder kopjes. Wat is daar lastig aan voor de lezer?',
          antwoord: 'Je ziet niet waar een nieuw onderwerp begint. Je moet alles lezen om iets terug te vinden, en er is geen inhoudsopgave.',
          uitleg: 'Koppen doen twee dingen tegelijk. Ze laten de lezer zien hoe je verslag is opgebouwd. En ze geven Word het materiaal voor de inhoudsopgave.',
          leerdoel: LD_4_2[2]
        }
      ],
      {
        tekst: 'Vul je verslag met koppen en een inhoudsopgave. Werk in hetzelfde bestand als vorige les.<br><br>' +
          '<strong>Stap 1.</strong> Open je bestand Verslag_Oefening_Voornaam_klas.<br>' +
          '<strong>Stap 2.</strong> Typ bovenaan pagina 2 het woord Inleiding en geef het de stijl Kop 1.<br>' +
          '<strong>Stap 3.</strong> Maak met CTRL + ENTER een nieuwe pagina. Typ daar: Hoofdstuk 1 - Wat is Microsoft Word? Geef het de stijl Kop 1.<br>' +
          '<strong>Stap 4.</strong> Maak weer een nieuwe pagina. Typ daar: Hoofdstuk 2 - Wat heb ik geleerd? Geef het ook de stijl Kop 1.<br>' +
          '<strong>Stap 5.</strong> Zet een lege pagina na je voorblad. Voeg daar via Verwijzingen een automatische inhoudsopgave in.<br>' +
          '<strong>Stap 6.</strong> Vul hoofdstuk 1 met een korte uitleg over Microsoft Word. Schrijf in twee zinnen wat je met het programma kunt.<br>' +
          '<strong>Stap 7.</strong> Vul hoofdstuk 2 met wat je geleerd hebt en hoe je dat doet. Schrijf minimaal 2 zinnen over elk van deze vijf dingen: inhoudsopgave maken, paginanummers toevoegen, voorblad invoegen, kopteksten maken en sneltoetsen gebruiken (CTRL + B, CTRL + i en CTRL + U).<br>' +
          '<strong>Stap 8.</strong> Controleer of elk hoofdstuk bovenaan een nieuwe pagina begint. Staat een kop te laag? Klik er vlak voor en druk op backspace.<br>' +
          '<strong>Stap 9.</strong> Werk je inhoudsopgave bij: klik erop, klik op Inhoudsopgave bijwerken en kies Hele inhoudsopgave bijwerken.<br>' +
          '<strong>Stap 10.</strong> Heb je tijd over? Maak dan een hoofdstuk 3 op een nieuwe pagina, met een eigen koptekst. Kies zelf een onderwerp: mijn favoriete vak, mijn leukste hobby, mijn favoriete dier of mijn favoriete film of serie. Schrijf daaronder minimaal 4 zinnen met punten, komma\'s en hoofdletters.<br>' +
          '<strong>Stap 11.</strong> Sla je bestand op. Controleer of het document netjes is: begint elk hoofdstuk op een nieuwe pagina, staan er geen lege pagina\'s tussen, zit alles erin (voorblad, inhoudsopgave, inleiding en gevulde hoofdstukken, paginanummers)?<br>' +
          '<strong>Stap 12.</strong> Lever het in zoals je docent dat vraagt.',
        label: 'Schrijf op welke koppen je gebruikt hebt en wat er in je inhoudsopgave staat.',
        modelAnswer: 'Ik heb drie keer de stijl Kop 1 gebruikt: Inleiding, Hoofdstuk 1 en Hoofdstuk 2. In mijn inhoudsopgave staan die drie regels met een paginanummer erachter. Inleiding staat op pagina 3, hoofdstuk 1 op pagina 4 en hoofdstuk 2 op pagina 5. In hoofdstuk 1 schrijf ik dat Word een programma is om teksten te maken en op te maken. In hoofdstuk 2 leg ik per onderdeel uit hoe het werkt. Nadat ik hoofdstuk 3 toevoegde, klopte de lijst niet meer. Ik heb hem toen bijgewerkt met Hele inhoudsopgave bijwerken. Daarna stond hoofdstuk 3 er ook in.',
        nakijkpunten: [
          'Inleiding, hoofdstuk 1 en hoofdstuk 2 hebben allemaal de stijl Kop 1 en niet zelf dik gemaakte tekst.',
          'Er staat een automatische inhoudsopgave na het voorblad, met paginanummers die kloppen.',
          'Hoofdstuk 1 heeft twee zinnen over Word en hoofdstuk 2 heeft twee zinnen per onderdeel.',
          'Elk hoofdstuk begint bovenaan een nieuwe pagina en er staan geen lege pagina\'s tussen.'
        ]
      },
      ['Waar staat het vakje Stijlen?', 'Wat is het verschil tussen Kop 1 en Kop 2?', 'Onder welk tabblad zit Inhoudsopgave?', 'Hoe werk je de inhoudsopgave bij?', 'Waarom herkent Word zelf dik gemaakte tekst niet?', 'Waarmee maak je een nieuwe pagina?'],
      'Sorteer stukken tekst in Kop 1, Kop 2 en gewone tekst, en kijk daarna wat de inhoudsopgave ervan maakt.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Fenna maakte al haar kopjes zelf dik en 16 punten groot. Haar inhoudsopgave blijft leeg. Zoek samen uit waarom.',
            antwoord: 'Word herkent alleen de stijlen Kop 1, Kop 2 en Kop 3. Zelf dik maken verandert alleen hoe de letters eruitzien, niet welk label ze hebben.',
            uitleg: 'Fenna hoeft niets opnieuw te typen. Ze selecteert elk kopje en klikt in het vakje Stijlen op Kop 1. Daarna werkt ze de inhoudsopgave bij.',
            leerdoel: LD_4_2[0]
          },
          {
            groep: 'samen',
            vraag: 'Je verslag heeft drie hoofdstukken. Onder hoofdstuk 2 wil je twee kleinere stukjes. Welke stijl geef je die twee?',
            antwoord: 'Kop 2, want die hoort onder een hoofdstuk. De drie hoofdstukken zelf houden Kop 1.',
            uitleg: 'De inhoudsopgave laat de Kop 2-regels iets ingesprongen zien. Zo ziet je lezer meteen wat bij welk hoofdstuk hoort.',
            leerdoel: LD_4_2[0]
          },
          {
            groep: 'zelf',
            vraag: 'Schrijf in vijf stappen op hoe je een automatische inhoudsopgave invoegt.',
            antwoord: 'Stap 1: ga naar het begin, net na je voorblad. Stap 2: druk op Ctrl + Enter. Stap 3: klik op Verwijzingen. Stap 4: klik op Inhoudsopgave. Stap 5: kies Automatische inhoudsopgave 1.',
            uitleg: 'Let op het tabblad. Voorblad en paginanummer staan onder Invoegen, maar de inhoudsopgave staat onder Verwijzingen.',
            leerdoel: LD_4_2[1]
          },
          {
            groep: 'zelf',
            vraag: 'Je voegt achteraf een hoofdstuk 3 toe. Wat moet je daarna nog doen, en waarom?',
            antwoord: 'Je klikt op de inhoudsopgave, klikt op Inhoudsopgave bijwerken en kiest Hele inhoudsopgave bijwerken. Anders staat hoofdstuk 3 er niet in.',
            uitleg: 'De lijst is een foto van het moment waarop je hem maakte. Hij verandert niet vanzelf mee als jij later iets toevoegt.',
            leerdoel: LD_4_2[1]
          },
          {
            groep: 'steun',
            vraag: 'Welke stijl hoort bij een hoofdstuk, en welke bij een stukje onder dat hoofdstuk?',
            antwoord: 'Kop 1 hoort bij een hoofdstuk. Kop 2 hoort bij een stukje daaronder.',
            uitleg: 'Denk aan een boom. Kop 1 is een dikke tak aan de stam. Kop 2 is een kleinere tak aan die dikke tak.',
            leerdoel: LD_4_2[0]
          },
          {
            groep: 'plus',
            vraag: 'Noem twee dingen die koppen opleveren, en zeg voor wie elk van die twee handig is.',
            antwoord: 'Ten eerste: je lezer ziet meteen hoe je verslag is opgebouwd. Ten tweede: Word kan er een inhoudsopgave van maken, dus jij hoeft geen paginanummers op te zoeken.',
            uitleg: 'De eerste winst is voor je lezer, de tweede voor jou. Precies daarom zijn kopstijlen meer werk waard dan zelf dik maken.',
            leerdoel: LD_4_2[2]
          }
        ]
      }),

    p('4.3', 'Afbeeldingen invoegen en beeld dat je mag gebruiken', ['22A', '23C'], 'verslag met een Creative Commons-afbeelding die netjes bij de tekst staat', 100, 'Beeldrechter',
      ['Niet elk plaatje op internet is van jou',
        'Bijna alles wat op internet staat is van iemand: een fotograaf, een tekenaar of een bedrijf. ' +
        'Die maker heeft er tijd en vaak ook geld in gestoken voordat jij het zag. ' +
        'Daarom mag je niet zomaar elk plaatje van internet in je verslag plakken. ' +
        'Dat is precies dezelfde regel als bij tekst overnemen uit hoofdstuk 1.' +
        '</p><p><strong>Check even:</strong> van wie is de laatste foto die jij in een opdracht gebruikte?</p><p>' +
        'Een maker kan wel van tevoren toestemming geven, en die toestemming heet een licentie. ' +
        'In zo\'n licentie staat precies wat jij met het werk van die maker mag doen. ' +
        'Bij een Creative Commons-licentie mag je het werk delen en zelf gebruiken. ' +
        'Meestal moet je dan wel de naam van de maker eronder zetten. ' +
        'Zo\'n regeltje met de maker erin noemen we de bronregel onder je afbeelding.' +
        '</p><p>' +
        'Via Google Afbeeldingen zoek je in vijf stappen gericht naar zulke plaatjes.' +
        '</p><ol>' +
        '<li>Typ op Google je zoekterm, bijvoorbeeld digitale wereld.</li>' +
        '<li>Klik op Images, dan krijg je alleen afbeeldingen.</li>' +
        '<li>Klik op Tools. Die knop heet meestal ook in het Nederlands gewoon Tools.</li>' +
        '<li>Klik op usage rights. In het Nederlands heet dat Gebruiksrechten.</li>' +
        '<li>Kies daar de optie Creative Commons.</li>' +
        '</ol><p>' +
        'De stappen zijn in elke taal hetzelfde; alleen de woorden op de knoppen verschillen. ' +
        'Zie je Tools niet staan? Kijk dan of jouw Google die knop Filter noemt.' +
        '</p><p><strong>Doe dit even:</strong> zoek met deze vijf stappen een plaatje bij het woord school.</p><p>' +
        'Je zoekterm kies je zelf, maar hij mag niet aanstootgevend zijn voor anderen. ' +
        'Gebruik dus geen enge, gewelddadige of andere aanstootgevende plaatjes in je verslag. ' +
        'Kies gewoon een leuke afbeelding die goed bij jouw onderwerp past. ' +
        'Sla die daarna op met je rechtermuisknop en de optie Afbeelding opslaan als. ' +
        'Zet hem op een plek waar jij hem straks meteen weer terugvindt.'],
      ['Invoegen en netjes bij je tekst plaatsen',
        'Nu voeg je die afbeelding toe aan je Word-document.' +
        '</p><ol>' +
        '<li>Ga naar de werkbalk van Word in jouw document.</li>' +
        '<li>Klik op Invoegen.</li>' +
        '<li>Klik op Afbeelding.</li>' +
        '<li>Zoek jouw afbeelding op en voeg hem toe.</li>' +
        '</ol><p>' +
        'Het plaatje staat nu in je verslag, maar meestal nog niet op de plek die jij wilt. ' +
        'Klik daarom een keer met je linkermuisknop op de afbeelding zelf. ' +
        'Naast de rechterbovenhoek verschijnt dan een klein icoontje met een boog eromheen. ' +
        'Dat icoontje naast je afbeelding heet in Word de Indelingsopties.' +
        '</p><p><strong>Doe dit even:</strong> klik op je plaatje en zoek dat icoontje naast de rechterbovenhoek.</p><p>' +
        'Klik erop, dan klapt er een vakje open met de terugloopopties erin. ' +
        'Terugloop betekent: hoe de tekst van je verslag om het plaatje heen loopt. ' +
        'Je kunt je plaatje voor, na, boven of midden in de tekst zetten.' +
        '</p><ul>' +
        '<li>Kies een optie in het menu Indelingsopties.</li>' +
        '<li>Verplaats je plaatje en kijk wat er met je tekst gebeurt.</li>' +
        '<li>Maak het groter of kleiner met de witte puntjes op de rand.</li>' +
        '<li>Draai het met het pijltjes-icoon als je dat wilt.</li>' +
        '</ul><p>' +
        'Zo ontdek je zelf welke optie je tekst leesbaar houdt en welke je zinnen uit elkaar trekt. ' +
        'Zet je plaatje uiteindelijk netjes bij de tekst waar het over gaat. ' +
        'Je zinnen moeten daarna gewoon van begin tot eind door te lezen zijn. ' +
        'Een afbeelding hoort iets uit te leggen wat je in woorden lastig vertelt. ' +
        'Staat hij er alleen maar mooi bij, dan leidt hij je lezer juist af. ' +
        'Zet tot slot de bronregel eronder, met daarin de naam van de maker.'],
      [
        media('https://support.google.com/websearch/answer/29508?hl=nl', 'Google: afbeeldingen zoeken die je mag gebruiken en delen', 'Welke stap op deze pagina hoort bij de knop Tools uit de les? Hoe heet usage rights hier in het Nederlands?'),
        media('https://support.microsoft.com/nl-nl/word/wrap-text-and-move-pictures-in-word', 'Microsoft: het icoontje Indelingsopties naast je afbeelding', 'Bovenaan staat het icoontje Indelingsopties afgebeeld, precies zoals het naast je plaatje verschijnt. Welke optie laat je tekst netjes om je plaatje heen lopen? Welke optie zet het plaatje juist midden in je regel?'),
        media('https://creativecommons.org/licenses/by/4.0/deed.nl', 'Creative Commons: wat de licentie CC BY 4.0 je toestaat', 'Deze pagina heeft twee lijstjes: wat je mag en onder welke voorwaarde. Welke voorwaarde geldt hier altijd? Wat betekent dat voor de regel onder jouw afbeelding?')
      ],
      [
        {
          vraag: 'Je zoekt op Google een plaatje voor je verslag. Denk je dat je elk plaatje mag gebruiken? Kun je dat vooraf ergens instellen?',
          antwoord: 'Nee, niet elk plaatje. Je kunt vooraf filteren: zoekterm typen, op Images klikken, op Tools klikken en bij usage rights Creative Commons kiezen.',
          uitleg: 'In het Nederlands heet usage rights Gebruiksrechten. Tools blijft meestal gewoon Tools heten, maar soms Filter.',
          leerdoel: LD_4_3[0]
        },
        {
          vraag: 'Je hebt een plaatje opgeslagen. Hoe denk je dat je het in Word krijgt? En hoe zet je het netjes bij je tekst?',
          antwoord: 'Via Invoegen en dan Afbeelding. Netjes zetten doe je met het icoontje Indelingsopties naast de rechterbovenhoek van je plaatje.',
          uitleg: 'In dat vakje staan de terugloopopties. Die bepalen of je tekst om het plaatje heen loopt, of dat het plaatje je alinea uit elkaar trekt.',
          leerdoel: LD_4_3[1]
        },
        {
          vraag: 'Iemand zet jouw eigen foto zonder te vragen in zijn presentatie. Wat vind je daarvan? En wat zegt dat over plaatjes van internet?',
          antwoord: 'Dat voelt niet eerlijk, want die foto is van jou. Voor plaatjes op internet geldt hetzelfde: iemand heeft ze gemaakt en jij mag ze niet zomaar gebruiken.',
          uitleg: 'Een maker kan wel vooraf toestemming geven. Die toestemming heet een licentie. Bij een Creative Commons-licentie mag je het werk gebruiken en noem je de maker.',
          leerdoel: LD_4_3[2]
        }
      ],
      {
        tekst: 'Zet een afbeelding in je verslag die je echt mag gebruiken. Werk in hetzelfde bestand als de vorige twee paragrafen.<br><br>' +
          '<strong>Stap 1.</strong> Bedenk een zoekterm die bij je verslag past. Hij mag niet aanstootgevend zijn: geen enge, gewelddadige of andere aanstootgevende plaatjes.<br>' +
          '<strong>Stap 2.</strong> Typ je zoekterm op Google en klik op Images.<br>' +
          '<strong>Stap 3.</strong> Klik op Tools. Zie je die knop niet? Kijk dan of hij bij jou Filter heet.<br>' +
          '<strong>Stap 4.</strong> Klik op usage rights (in het Nederlands: Gebruiksrechten) en kies Creative Commons.<br>' +
          '<strong>Stap 5.</strong> Kies een afbeelding en sla hem op, op een plek die je terugvindt.<br>' +
          '<strong>Stap 6.</strong> Open je Word-verslag. Klik op Invoegen, dan op Afbeelding, en voeg je plaatje toe.<br>' +
          '<strong>Stap 7.</strong> Klik op de afbeelding en klik op het icoontje Indelingsopties naast de rechterbovenhoek.<br>' +
          '<strong>Stap 8.</strong> Probeer minstens drie terugloopopties uit. Verplaats het plaatje er telkens bij en kijk wat er met je tekst gebeurt.<br>' +
          '<strong>Stap 9.</strong> Maak het plaatje groter of kleiner met de witte puntjes op de rand.<br>' +
          '<strong>Stap 10.</strong> Kies de optie waarbij je tekst het beste leesbaar blijft.<br>' +
          '<strong>Stap 11.</strong> Zet onder het plaatje een bronregel: waar komt het vandaan en van wie is het?<br>' +
          '<strong>Stap 12.</strong> Werk je inhoudsopgave bij, sla op en lever in zoals je docent uitlegt.',
        label: 'Schrijf je zoekterm op, de gekozen terugloopoptie en je bronregel.',
        modelAnswer: 'Mijn zoekterm was digitale wereld. Ik heb op Images geklikt, daarna op Tools en bij usage rights op Creative Commons. Zo weet ik zeker dat ik het plaatje mag gebruiken voor school. Ik heb drie opties geprobeerd. Bij Tekstterugloop boven en onder viel mijn alinea in twee stukken. Bij Vierkant loopt mijn tekst netjes om het plaatje heen. Die heb ik gekozen, want zo blijft alles leesbaar. Ik heb het plaatje kleiner gemaakt met de witte puntjes. Onder de afbeelding staat mijn bronregel met de naam van de maker en de licentie CC BY 4.0.',
        nakijkpunten: [
          'De afbeelding is gevonden via de filterstappen Tools en usage rights, met de optie Creative Commons.',
          'De afbeelding staat echt in het Word-document en is passend van formaat.',
          'De gekozen terugloopoptie houdt de tekst leesbaar; de leerling noemt er minstens twee die hij geprobeerd heeft.',
          'Onder de afbeelding staat een bronregel met de maker of de vindplaats erbij.'
        ]
      },
      ['Wat is een licentie?', 'Waar klik je op om alleen Creative Commons-plaatjes te zien?', 'Hoe voeg je een afbeelding in Word in?', 'Wat doet het icoontje Indelingsopties?', 'Waarom mag je niet elk plaatje van internet gebruiken?', 'Wat zet je onder je afbeelding?'],
      'Beoordeel per plaatje of je het mag gebruiken en kies daarna de terugloopoptie die de tekst leesbaar houdt.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Sem zegt: "Het staat op Google, dus het is gratis." Zoek samen uit waar zijn redenering misgaat.',
            antwoord: 'Google laat plaatjes zien, maar Google is niet de maker. Achter elk plaatje zit een fotograaf, tekenaar of bedrijf. Zonder licentie geeft niemand je toestemming.',
            uitleg: 'Kunnen zien is iets anders dan mogen gebruiken. Met het filter usage rights zoek je juist plaatjes waarvan de maker die toestemming vooraf gaf.',
            leerdoel: LD_4_3[2]
          },
          {
            groep: 'samen',
            vraag: 'Loop samen de vijf zoekstappen na en zeg bij elke stap wat er misgaat als je hem overslaat.',
            antwoord: 'Sla je Images over, dan zie je websites. Sla je Tools over, dan vind je usage rights niet. Sla je usage rights over, dan krijg je alle plaatjes. Sla je Creative Commons over, dan filter je nog niets.',
            uitleg: 'De stappen zitten in elkaar. Elke knop opent de volgende, dus de volgorde is niet vrij te kiezen.',
            leerdoel: LD_4_3[0]
          },
          {
            groep: 'zelf',
            vraag: 'Schrijf in vier stappen op hoe je een afbeelding in Word invoegt.',
            antwoord: 'Stap 1: ga naar de werkbalk. Stap 2: klik op Invoegen. Stap 3: klik op Afbeelding. Stap 4: zoek je bestand op en voeg het toe.',
            uitleg: 'Het staat onder Invoegen, net als het voorblad en het paginanummer. Alles wat je aan je document toevoegt, zit onder dat tabblad.',
            leerdoel: LD_4_3[1]
          },
          {
            groep: 'zelf',
            vraag: 'Je plaatje staat midden in een zin en de tekst valt in stukken. Wat doe je?',
            antwoord: 'Je klikt op het plaatje, klikt op Indelingsopties en kiest een andere terugloopoptie. Daarna verplaats je het plaatje en kijk je of de tekst weer doorloopt.',
            uitleg: 'Elke terugloopoptie doet iets anders met je alinea. Probeer er een paar en kies die waarbij je zinnen gewoon door te lezen zijn.',
            leerdoel: LD_4_3[1]
          },
          {
            groep: 'steun',
            vraag: 'Wat betekent het woord licentie? Zeg het in je eigen woorden.',
            antwoord: 'Een licentie is toestemming van de maker. Daarin staat wat jij met zijn werk mag doen.',
            uitleg: 'Vergelijk het met een kaartje voor het zwembad. Het kaartje zegt wanneer je naar binnen mag en wat je er mag doen.',
            leerdoel: LD_4_3[2]
          },
          {
            groep: 'plus',
            vraag: 'Waarom staat er bij Creative Commons bijna altijd de eis dat je de maker noemt?',
            antwoord: 'Omdat de maker zijn werk gratis weggeeft, maar wel wil dat mensen zien wie het gemaakt heeft. Zijn naam is dan zijn beloning.',
            uitleg: 'Precies daarom hoort er een bronregel onder je afbeelding. Zonder die regel houd je je niet aan de licentie, ook al was het plaatje gratis.',
            leerdoel: LD_4_3[2]
          }
        ]
      }),

    p('4.4', 'Gegevens in Excel: tabel, formule en grafiek', ['21C', '22A'], 'Excel-bestand met een ingevulde tabel, twee formules en een grafiek', 100, 'Cel Commando',
      ['Een tabel is een afspraak over waar iets staat',
        'Word is het programma voor tekst; Excel is het programma voor getallen. ' +
        'Je scherm bestaat in Excel uit heel veel kleine vakjes naast elkaar. ' +
        'Elk vakje heeft een eigen adres, bijvoorbeeld B3, en zo\'n vakje noemen we een cel.' +
        '</p><p><strong>Doe dit even:</strong> open Excel en klik het vakje aan dat B3 heet.</p><p>' +
        'De letter van dat adres hoort bij de kolom, die van boven naar beneden loopt. ' +
        'Het cijfer hoort bij de rij, en die loopt juist van links naar rechts. ' +
        'De cel B3 is dus het vakje in de tweede kolom en de derde rij.' +
        '</p><p>' +
        'Een tabel werkt alleen als iedereen weet wat er in welke kolom staat. ' +
        'Daarom zet je bovenaan een regel met de namen van al je kolommen. ' +
        'Die bovenste regel heet de kopregel: zet bijvoorbeeld Dag in A1 en Aantal stappen in B1.' +
        '</p><p><strong>Check even:</strong> waarom zou je die kopregel niet gewoon weglaten?</p><p>' +
        'Zonder kopregel weet niemand meer wat al die losse getallen eronder betekenen. ' +
        'Onder de kopregel vul je per rij precies een meting of een dag in. ' +
        'Laat daarbij nooit lege rijen tussen je gegevens staan, want dat gaat mis. ' +
        'Excel denkt bij een lege rij namelijk dat je tabel daar al afgelopen is.' +
        '</p><p><strong>Doe dit even:</strong> typ in een leeg vakje 8500 stappen. Zie je dat het links komt te staan?</p><p>' +
        'Wat links tegen de rand plakt, leest Excel als tekst; kale getallen schuiven naar rechts. ' +
        'Typ dus 8500 en niet 8500 stappen, want anders staat er voor Excel een woord. ' +
        'Zo\'n vakje slaat een formule later over, en dan klopt je uitkomst niet meer. ' +
        'De eenheid stappen zet je daarom een keer in de kopregel erboven.'],
      ['Rekenen met formules en je tabel in beeld brengen',
        'Typ je 3+4 in een vakje, dan blijft er daarna gewoon 3+4 staan. ' +
        'Typ je =3+4, dan verschijnt in datzelfde vakje ineens het antwoord 7. ' +
        'Het isgelijkteken is dus de schakelaar waarmee elke formule in Excel begint. ' +
        'Met dat ene teken zeg je tegen Excel: dit is geen tekst, ga rekenen.' +
        '</p><p><strong>Doe dit even:</strong> typ in een leeg vakje eerst 5+5 en daarna =5+5. Wat zie je?</p><p>' +
        'Handiger dan rekenen met losse getallen is rekenen met de adressen van cellen. ' +
        'Je uitkomst past zich dan vanzelf aan zodra je een getal verandert. ' +
        'Voor een hele kolom tegelijk gebruik je geen plustekens maar een functie.' +
        '</p><ul>' +
        '<li>=SOM(B2:B8) telt alles van B2 tot en met B8 op.</li>' +
        '<li>=GEMIDDELDE(B2:B8) telt hetzelfde op en deelt door het aantal getallen.</li>' +
        '</ul><p>' +
        'Dat stukje B2:B8 in de formule heet een celbereik. ' +
        'Een celbereik is het rijtje vakjes waarover de functie moet rekenen. ' +
        'De dubbele punt ertussen betekent gewoon tot en met, dus alles daartussen telt mee. ' +
        'Een plusteken tussen twee adressen telt juist alleen die twee vakjes bij elkaar op.' +
        '</p><p><strong>Check even:</strong> wat rekent =SOM(B2:B4) uit, en welke vakjes doen niet mee?</p><p>' +
        'Die formule telt B2, B3 en B4 op, dus B5 doet niet mee. ' +
        'Staat er in een van die drie vakjes tekst, dan slaat Excel dat ene vakje over. ' +
        'SOM telt de overgebleven getallen dan gewoon op en GEMIDDELDE deelt door de rest. ' +
        'Je krijgt dus een keurige uitkomst te zien, maar wel een die te laag is. ' +
        'Alleen als er in alle vakjes tekst staat, geeft SOM een 0 en GEMIDDELDE de melding #DEEL/0!.' +
        '</p><p><strong>Doe dit even:</strong> typ het woord vrij in B2, zet getallen in B3 en B4 en kijk wat =SOM(B2:B4) doet.</p><p>' +
        'Van je ingevulde tabel maak je daarna in drie klikken een grafiek. ' +
        'Selecteer eerst al je gegevens, en neem daarbij de kopregel gewoon mee. ' +
        'Klik dan boven in de werkbalk op Invoegen en kies een soort grafiek.' +
        '</p><p><strong>Check even:</strong> welke soort grafiek zou jij kiezen bij zeven dagen van een week?</p><p>' +
        'Een kolomdiagram past daar goed bij, want zeven losse dagen vergelijk je op hoogte. ' +
        'In een grafiek zie je namelijk in een oogopslag wat eruit springt. ' +
        'Denk aan een piek op woensdag, die je tussen zeven kale cijfers zo mist.'],
      [
        media('https://www.youtube.com/embed/SEspdxI-gAc', 'Video: Excel voor beginners, tabellen en grafieken', 'Welke vakjes selecteert de maker voordat hij de grafiek invoegt? Neemt hij de kopregel mee, en waarom?'),
        media('https://support.microsoft.com/nl-nl/office/het-gemiddelde-van-een-groep-getallen-berekenen-e158ef61-421c-4839-8290-34d7b1e68283', 'Microsoft: het gemiddelde van een groep getallen berekenen', 'Deze pagina laat =GEMIDDELDE(A2:A7) zien en ook de knop AutoSom. Welke van die twee zou jij bij jouw eigen tabel gebruiken? Schrijf op waarom.')
      ],
      [
        {
          vraag: 'Je wilt van zeven dagen bijhouden hoeveel stappen je zette. Hoe zou jij die getallen neerzetten? Wat schrijf je in de bovenste rij?',
          antwoord: 'Per rij een dag. In de bovenste rij een kopregel met Dag en Aantal stappen. De getallen typ je kaal, dus 8500 en niet 8500 stappen.',
          uitleg: 'De kopregel is de afspraak waardoor iedereen weet wat de getallen betekenen. Zet je een woord achter een getal, dan leest Excel het vakje als tekst.',
          leerdoel: LD_4_4[0]
        },
        {
          vraag: 'Wat denk je dat er in een vakje verschijnt als je 3+4 intypt? Wat moet je typen om echt 7 te zien?',
          antwoord: 'Er blijft gewoon 3+4 staan. Met =3+4 verschijnt het antwoord 7.',
          uitleg: 'Zonder dat isgelijkteken blijft je invoer gewoon tekst en gebeurt er niets. Voor een hele kolom gebruik je liever =SOM(B2:B8) of =GEMIDDELDE(B2:B8).',
          leerdoel: LD_4_4[1]
        },
        {
          vraag: 'Waar heb jij weleens een grafiek gezien in plaats van een rijtje cijfers? Wat zag je daar sneller aan?',
          antwoord: 'Bijvoorbeeld in het nieuws of bij het weerbericht. Je ziet in een oogopslag welke waarde eruit springt, of dat iets stijgt of daalt.',
          uitleg: 'Selecteer je gegevens met de kopregel erbij en klik daarna op Invoegen voor een grafiek. Je oog vergelijkt dan hoogtes in plaats van getallen.',
          leerdoel: LD_4_4[2]
        }
      ],
      {
        tekst: 'Maak een eigen gegevensbestand in Excel. De uitleg van deze paragraaf staat niet in je lesboek. Hij is in eigen woorden geschreven op basis van het gratis Excel-oefenmateriaal voor het vmbo op Wikiwijs (maken.wikiwijs.nl/196081) en de Nederlandstalige hulppagina van Microsoft over de functie GEMIDDELDE.<br><br>' +
          '<strong>Stap 1.</strong> Open Excel en maak een lege werkmap.<br>' +
          '<strong>Stap 2.</strong> Sla die meteen op in OneDrive met de naam Gegevens_Voornaam_klas.<br>' +
          '<strong>Stap 3.</strong> Zet in rij 1 een kopregel, bijvoorbeeld Dag in A1 en Aantal stappen in B1. Kies zelf wat je meet: stappen, schermtijd in minuten, cijfers of berichten per dag.<br>' +
          '<strong>Stap 4.</strong> Vul in A2 tot en met A8 de zeven dagen in.<br>' +
          '<strong>Stap 5.</strong> Vul in B2 tot en met B8 je zeven getallen in, zonder woord erachter.<br>' +
          '<strong>Stap 6.</strong> Zet in B9 de formule =SOM(B2:B8). Zet in B10 de formule =GEMIDDELDE(B2:B8).<br>' +
          '<strong>Stap 7.</strong> Schrijf in A9 het woord Totaal en in A10 het woord Gemiddelde.<br>' +
          '<strong>Stap 8.</strong> Verander een getal in je tabel. Kijk wat er met B9 en B10 gebeurt en schrijf dat op.<br>' +
          '<strong>Stap 9.</strong> Selecteer A1 tot en met B8. Klik op Invoegen en kies een kolomdiagram.<br>' +
          '<strong>Stap 10.</strong> Geef je grafiek een titel die vertelt waar hij over gaat.<br>' +
          '<strong>Stap 11.</strong> Schrijf onder je grafiek in drie zinnen welke dag eruit springt en wat je in de grafiek ziet dat je in de losse getallen niet zag.<br>' +
          '<strong>Stap 12.</strong> Sla op en lever het bestand in zoals je docent uitlegt.',
        label: 'Schrijf je twee formules over. Noteer wat er gebeurde toen je een getal veranderde, en wat je grafiek laat zien.',
        modelAnswer: 'In B9 staat =SOM(B2:B8) en in B10 staat =GEMIDDELDE(B2:B8). Mijn totaal was eerst 58100 stappen. Mijn gemiddelde was 8300 stappen per dag. Toen ik het getal in B4 veranderde, pasten allebei zich meteen aan. Dat komt doordat de formule naar de vakjes verwijst en niet naar de getallen zelf. In mijn grafiek springt woensdag eruit met de hoogste kolom. Dat zag ik in de losse cijfers niet snel, want dan moet ik zeven getallen vergelijken. Zaterdag is juist de laagste kolom. Mijn grafiek heet Mijn stappen per dag.',
        nakijkpunten: [
          'De tabel heeft een kopregel en bevat kale getallen zonder woord erachter.',
          'Beide formules beginnen met een isgelijkteken en gebruiken het celbereik B2:B8.',
          'De grafiek heeft een titel en is gemaakt van de gegevens inclusief de kopregel.',
          'De leerling beschrijft wat er gebeurde bij het veranderen van een getal en noemt iets dat de grafiek laat zien.'
        ]
      },
      ['Wat is het adres van een cel?', 'Waarmee begint elke formule?', 'Wat doet =SOM(B2:B8)?', 'Wat betekent de dubbele punt in B2:B8?', 'Waarom neem je de kopregel mee in je grafiek?', 'Waarom typ je 8500 en niet 8500 stappen?'],
      'Vul een tabel goed in, kies de juiste formule en lees daarna de bijbehorende grafiek af.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'In B2 tot en met B4 staat 8500 stappen, 9200 stappen en 7100 stappen. =SOM(B2:B4) geeft 0 en =GEMIDDELDE(B2:B4) geeft #DEEL/0!. Zoek samen uit waarom.',
            antwoord: 'Door het woord stappen leest Excel de drie vakjes als tekst. SOM slaat tekst over en houdt 0 over. GEMIDDELDE vindt geen enkel getal om door te delen en meldt een deling door nul.',
            uitleg: 'Twee verschillende meldingen, maar dezelfde fout eronder. Zet de eenheid een keer in de kopregel: Aantal stappen. Daaronder staan dan kale getallen.',
            leerdoel: LD_4_4[0]
          },
          {
            groep: 'samen',
            vraag: 'Jij zet in B9 gewoon =8500+9200+7100. Je buurman zet er =SOM(B2:B4). Wat is het verschil als een getal verandert?',
            antwoord: 'Bij jou verandert er niets, want jouw formule kent alleen de oude getallen. Bij je buurman past het totaal zich meteen aan, want zijn formule kijkt naar de vakjes.',
            uitleg: 'Daarom reken je met celadressen en niet met losse getallen. Je hoeft je formule dan nooit meer aan te passen.',
            leerdoel: LD_4_4[1]
          },
          {
            groep: 'zelf',
            vraag: 'Schrijf de formule op waarmee je B2 tot en met B8 optelt. Schrijf daarna die voor het gemiddelde.',
            antwoord: '=SOM(B2:B8) telt op. =GEMIDDELDE(B2:B8) geeft het gemiddelde.',
            uitleg: 'Drie dingen moeten kloppen: het isgelijkteken vooraan, de naam van de functie en het celbereik tussen haakjes.',
            leerdoel: LD_4_4[1]
          },
          {
            groep: 'zelf',
            vraag: 'Je grafiek heeft langs de onderkant de nummers 1 tot en met 7 in plaats van de dagen. Wat ging er mis?',
            antwoord: 'Je hebt kolom A niet meegeselecteerd. Zonder kolom A weet Excel niet hoe je metingen heten.',
            uitleg: 'Uit je kopregel en je eerste kolom haalt Excel zelf de namen bij de assen. Selecteer je ze niet mee, dan klopt je grafiek wel, maar zegt hij niets.',
            leerdoel: LD_4_4[2]
          },
          {
            groep: 'steun',
            vraag: 'Hoe heet het vakje in de tweede kolom en de derde rij? Waarmee begint elke formule?',
            antwoord: 'Dat vakje heet B3. Elke formule begint met een isgelijkteken.',
            uitleg: 'De letter hoort altijd bij de kolom en het cijfer bij de rij. Dus eerst de letter, dan het cijfer.',
            leerdoel: LD_4_4[1]
          },
          {
            groep: 'plus',
            vraag: 'Jouw gemiddelde is 8300 stappen. Toch liep je op zes van de zeven dagen minder. Hoe kan dat?',
            antwoord: 'Er zit een uitschieter tussen. Op een dag liep je bijvoorbeeld 20000 stappen. Die ene dag trekt het gemiddelde omhoog.',
            uitleg: 'Precies daarom kijk je ook naar je grafiek. Een gemiddelde is een getal, maar de grafiek laat de uitschieter zien.',
            leerdoel: LD_4_4[2]
          }
        ]
      }),

    p('4.5', "PowerPoint: dia's, tekst, ontwerp en overgangen", ['22A', '21B'], "oefenpresentatie van minimaal vijf dia's met tekstvak, afbeelding en overgangen", 100, 'Dia Dirigent',
      ['Wat PowerPoint is en waarvoor je het gebruikt',
        'Stel: je houdt een spreekbeurt over jouw favoriete sport voor de klas. ' +
        'Naast je hangt een scherm met plaatjes en steekwoorden, en dat scherm maak je met PowerPoint. ' +
        'PowerPoint is een programma waarmee je presentaties maakt voor school of werk. ' +
        'Een presentatie is een reeks bladen die je aan andere mensen laat zien. ' +
        'Zo\'n los blad heet een dia, en in het Engels heet dat een slide.' +
        '</p><p><strong>Check even:</strong> waar heb jij zelf weleens een presentatie op een scherm gezien?</p><p>' +
        'Op een dia kun je tekst, afbeeldingen, grafieken en zelfs een video zetten. ' +
        'Je gebruikt PowerPoint bij een spreekbeurt, bij een project of bij een verslag. ' +
        'Het programma maakt je verhaal duidelijk en overzichtelijk voor iedereen die kijkt. ' +
        'Met plaatjes en kleuren wordt je presentatie bovendien een stuk aantrekkelijker. ' +
        'Dat helpt je publiek, dus de mensen die naar jouw verhaal zitten te luisteren. ' +
        'Zij begrijpen en onthouden jouw verhaal daardoor een stuk beter.' +
        '</p><p><strong>Doe dit even:</strong> denk aan een dia die jij ooit zag en die veel te vol stond. Wat deed jij toen?</p><p>' +
        'Grote kans dat je ging lezen en niet meer hoorde wat de spreker vertelde. ' +
        'Je presentatie mag dus niet te druk of te vol worden. ' +
        'De presentatie ondersteunt jouw verhaal, en dat betekent twee dingen tegelijk. ' +
        'Hij helpt jou bij het vertellen en hij helpt je publiek bij het volgen. ' +
        'Een drukke dia met veel foto\'s en veel tekst doet precies het omgekeerde. ' +
        'Houd je dia\'s dus rustig en laat er lucht tussen staan.' +
        '</p><p><strong>Doe dit even:</strong> bedenk een onderwerp waarover jij vijf dia\'s zou kunnen vullen.</p>'],
      ['De basisfuncties: tekstvak, afbeelding, ontwerp en overgang',
        'Met PowerPoint kun je vijf dingen die je vandaag nodig hebt.' +
        '</p><ul>' +
        '<li>Dia\'s toevoegen: elke dia is een nieuw blad in je presentatie.</li>' +
        '<li>Een tekstvak maken: een tekstvak is het kader waarin je typt.</li>' +
        '<li>Afbeeldingen toevoegen: foto\'s of tekeningen die je in je dia zet.</li>' +
        '<li>Achtergronden en kleuren kiezen: zo maak je je dia\'s mooier en duidelijker.</li>' +
        '<li>Overgangen toepassen: een overgang is het effect tussen twee dia\'s.</li>' +
        '</ul><p>' +
        'Zo werk je stap voor stap in PowerPoint.' +
        '</p><ol>' +
        '<li>Open PowerPoint en kies een lege presentatie of een thema.</li>' +
        '<li>Voeg een titel toe op de eerste dia.</li>' +
        '<li>Maak nieuwe dia\'s aan via de knop Nieuwe dia.</li>' +
        '<li>Voeg tekstvakken toe via Invoegen en dan Tekstvak.</li>' +
        '<li>Voeg een afbeelding toe via Invoegen en dan Afbeeldingen.</li>' +
        '<li>Pas de achtergrond of de kleuren aan via het menu Ontwerpen.</li>' +
        '<li>Zet een overgang tussen dia\'s via het tabblad Overgangen.</li>' +
        '<li>Sla regelmatig op, en zet je bestand ook in OneDrive.</li>' +
        '</ol><p><strong>Check even:</strong> onder welk tabblad zoek jij de achtergrondkleur van je dia?</p><p>' +
        'Onder Ontwerpen, want dat tabblad gaat helemaal over hoe je dia eruitziet. ' +
        'Voor je afbeeldingen geldt hier precies dezelfde regel als in Word. ' +
        'Je mag ook in PowerPoint niet zomaar elk plaatje van internet gebruiken. ' +
        'Zoek dus weer via Tools en daarna Gebruiksrechten, precies zoals in 4.3.' +
        '</p><p>' +
        'Nog drie tips voor een presentatie die werkt.' +
        '</p><ul>' +
        '<li>Houd je dia\'s overzichtelijk: niet te veel tekst per dia.</li>' +
        '<li>Gebruik afbeeldingen om je verhaal te ondersteunen.</li>' +
        '<li>Zorg dat kleuren en lettertypes bij elkaar passen, met maximaal twee lettertypes.</li>' +
        '</ul>'],
      media('https://www.youtube.com/embed/ByPBwR7nl7I', 'Video: hoe maak je een PowerPoint-presentatie?', 'Welke mogelijkheid uit de video kende jij nog niet? Op welke dia van jouw eigen presentatie ga je hem gebruiken?'),
      [
        {
          vraag: 'Terug naar 4.3. Je wilt een foto in je presentatie zetten. Waar let je op voordat je hem downloadt?',
          antwoord: 'Dat je hem mag gebruiken. Je zoekt op Google, klikt op Images, dan op Tools en kiest bij usage rights de optie Creative Commons.',
          uitleg: 'In PowerPoint geldt precies dezelfde regel als in Word. Een plaatje is van iemand, ook als het zo van Google te plukken is.',
          leerdoel: LD_4_3[0]
        },
        {
          vraag: 'Je moet je klas in vijf minuten iets uitleggen. Kies je Word of PowerPoint? Waarom?',
          antwoord: 'PowerPoint, want je maakt het voor een groep die naar jou luistert. Er staat dan beeld naast je verhaal.',
          uitleg: 'Word maak je voor een lezer die rustig doorleest. PowerPoint helpt jou als spreker, met korte tekst en plaatjes op een scherm.',
          leerdoel: LD_4_5[0]
        },
        {
          vraag: 'Hoe denk je dat je in PowerPoint een blad erbij krijgt? En hoe zet je daar tekst en een foto op?',
          antwoord: 'Een blad erbij via de knop Nieuwe dia. Tekst via Invoegen en dan Tekstvak. Een foto via Invoegen en dan Afbeeldingen.',
          uitleg: 'Elke dia is een nieuw blad in je presentatie. Een tekstvak is het kader waarin je typt, net als een tekstvakje in Word.',
          leerdoel: LD_4_5[1]
        },
        {
          vraag: 'Je maakt een presentatie over voetbal. Welke achtergrondkleur kies jij, en waarom die?',
          antwoord: 'Bijvoorbeeld een rustig groen, want dat past bij het veld. Belangrijk is dat je letters er goed op te lezen blijven.',
          uitleg: 'Achtergrond en kleuren pas je aan via het menu Ontwerpen. Een overgang zet je tussen alle dia\'s via het tabblad Overgangen.',
          leerdoel: LD_4_5[2]
        }
      ],
      {
        tekst: 'Maak je eigen oefenpresentatie. Kies een onderwerp dat jij leuk vindt: hobby\'s, dieren, sport, games, reizen of iets anders.<br><br>' +
          '<strong>Stap 1.</strong> Open PowerPoint en kies een lege presentatie of een thema.<br>' +
          '<strong>Stap 2.</strong> Maak een titeldia. Zet daar de titel van je presentatie op, met daaronder je naam en klas en een aantrekkelijke afbeelding.<br>' +
          '<strong>Stap 3.</strong> Maak dia 2: een overzicht van de inhoud. In PowerPoint kan dat niet automatisch, dus maak zelf een opsomming. Je mag hem aanvullen terwijl je meer dia\'s bedenkt.<br>' +
          '<strong>Stap 4.</strong> Maak nieuwe dia\'s via de knop Nieuwe dia. Je presentatie heeft minimaal 5 dia\'s, meer mag.<br>' +
          '<strong>Stap 5.</strong> Zet op elke dia minstens een tekstvak met informatie, via Invoegen en dan Tekstvak.<br>' +
          '<strong>Stap 6.</strong> Gebruik minimaal een afbeelding, via Invoegen en dan Afbeeldingen. Zoek hem via Tools en usage rights (Gebruiksrechten), zoals je in 4.3 leerde.<br>' +
          '<strong>Stap 7.</strong> Kies via Ontwerpen een achtergrondkleur of achtergrondafbeelding die bij je onderwerp past.<br>' +
          '<strong>Stap 8.</strong> Gebruik verschillende kleuren en lettertypes, maar niet te veel. Maximaal 2 lettertypes.<br>' +
          '<strong>Stap 9.</strong> Controleer of de tekst goed leesbaar is op je achtergrond.<br>' +
          '<strong>Stap 10.</strong> Zet via het tabblad Overgangen een overgang tussen alle dia\'s.<br>' +
          '<strong>Stap 11.</strong> Zorg dat je inhoudsdia compleet is voordat je inlevert.<br>' +
          '<strong>Stap 12.</strong> Sla regelmatig op, ook in OneDrive, en lever je presentatie in bij je docent.',
        label: 'Schrijf op hoeveel dia\'s je hebt, welke overgang je koos en waarom je achtergrond bij je onderwerp past.',
        modelAnswer: 'Mijn presentatie gaat over paardrijden en heeft zes dia\'s. Dia 1 is mijn titeldia met de titel, mijn naam, mijn klas en een foto van een paard. Dia 2 is mijn inhoudsdia met vier punten. Op elke dia staat een tekstvak met korte zinnen. Ik heb twee afbeeldingen gebruikt die ik met Tools en usage rights heb gezocht. Mijn achtergrond is lichtbruin, want dat past bij een manege. Mijn letters zijn donkerblauw, dus die zijn goed te lezen. Ik gebruik twee lettertypes: een voor de titels en een voor de tekst. Tussen alle dia\'s staat de overgang Vervagen, want die is rustig.',
        nakijkpunten: [
          "De presentatie heeft minimaal 5 dia's, met op elke dia minstens één tekstvak met informatie.",
          'Er staat minimaal één afbeelding in, die met het filter op gebruiksrechten is gezocht.',
          'Er staat een overgang tussen alle dia\'s en er is een achtergrond gekozen die bij het onderwerp past.',
          'De tekst is goed leesbaar op de achtergrond en er zijn maximaal twee lettertypes gebruikt.'
        ]
      },
      ['Waarvoor gebruik je PowerPoint?', 'Wat is een dia?', 'Wat is een tekstvak?', 'Wat is een overgang?', 'Onder welk tabblad pas je de achtergrond aan?', 'Wat zet je op je titeldia?'],
      'Sleep de begrippen dia, tekstvak en overgang naar de goede uitleg en bouw daarna een rustige dia.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Koppel samen de drie begrippen aan de uitleg: dia, tekstvak en overgang.',
            antwoord: 'Dia: een pagina van je presentatie. Tekstvak: de plek waar je tekst invoegt. Overgang: het effect om van de ene dia naar de andere te gaan.',
            uitleg: 'Een dia is dus het blad zelf. Een tekstvak staat op zo\'n blad. Een overgang zit juist tussen twee bladen in.',
            leerdoel: LD_4_5[1]
          },
          {
            groep: 'samen',
            vraag: 'Zet deze stappen samen op volgorde: dia\'s toevoegen, presentatie opslaan, titeldia maken, lege presentatie kiezen, overgangen zetten, inhoudsdia maken.',
            antwoord: 'Eerst een lege presentatie kiezen. Dan de titeldia maken. Dan de inhoudsdia maken. Dan dia\'s toevoegen met informatie. Dan overgangen zetten tussen alle dia\'s. En dan opslaan.',
            uitleg: 'Overgangen zet je aan het eind, als al je dia\'s er zijn. Anders mis je de overgang naar de dia\'s die je later toevoegt.',
            leerdoel: LD_4_5[2]
          },
          {
            groep: 'zelf',
            vraag: 'Schrijf op waarvoor je PowerPoint gebruikt. Noem twee situaties uit school.',
            antwoord: 'Om een presentatie met dia\'s te maken. Bijvoorbeeld bij een spreekbeurt en bij het presenteren van een project.',
            uitleg: 'Lange teksten maak je in Word. Rekenen doe je in Excel. PowerPoint is er voor een verhaal dat je aan anderen laat zien.',
            leerdoel: LD_4_5[0]
          },
          {
            groep: 'zelf',
            vraag: 'Je zet zwarte letters op een donkerblauwe achtergrond. Wat gaat er mis, en wat doe je eraan?',
            antwoord: 'Achterin het lokaal leest niemand het, want het kleurverschil is te klein. Kies een lichte achtergrond of maak je letters wit.',
            uitleg: 'Achtergrond en kleuren pas je aan via Ontwerpen. Kies altijd een combinatie die van een afstand leesbaar blijft.',
            leerdoel: LD_4_5[2]
          },
          {
            groep: 'steun',
            vraag: 'Onder welk tabblad vind je Tekstvak? En onder welk tabblad vind je Overgangen?',
            antwoord: 'Tekstvak vind je onder Invoegen. Overgangen hebben een eigen tabblad dat ook Overgangen heet.',
            uitleg: 'Alles wat je aan een dia toevoegt staat onder Invoegen. Alles wat tussen twee dia\'s gebeurt, staat onder Overgangen.',
            leerdoel: LD_4_5[1]
          },
          {
            groep: 'plus',
            vraag: 'Waarom raadt de les af om veel tekst op een dia te zetten, terwijl meer uitleg toch duidelijker lijkt?',
            antwoord: 'Omdat je publiek dan gaat lezen in plaats van luisteren. Ze horen jouw uitleg niet meer, want ze zijn met de dia bezig.',
            uitleg: 'De dia ondersteunt jou. Zet er steekwoorden op en vertel de hele zin er zelf bij. Dan blijft de aandacht bij jou.',
            leerdoel: LD_4_5[0]
          }
        ]
      }),

    p('4.6', 'Je eigen presentatie maken en presenteren', ['22A', '21B'], "eindpresentatie met titeldia, inhoudsdia, zeven inhoudelijke dia's en een afsluitende dia", 100, 'Presenteer Pro',
      ['De vaste opbouw van je eindpresentatie',
        'In deze les werk je zelfstandig aan een presentatie die je echt inlevert. ' +
        'Je laat daarin zien dat je alles kunt toepassen wat je tot nu toe geleerd hebt. ' +
        'Je kiest daarvoor een van deze vier onderwerpen uit.' +
        '</p><ol>' +
        '<li><strong>Mijn device.</strong> Je vertelt over jouw favoriete device, met de hardware en de software die erbij horen.</li>' +
        '<li><strong>Veilig internet.</strong> Je vertelt wat veilig internet betekent en hoe je jezelf veilig over internet beweegt.</li>' +
        '<li><strong>Word.</strong> Je legt uit wat Word is, hoe je het inzet en welke basisdingen je moet kennen.</li>' +
        '<li><strong>Digitale geletterdheid.</strong> Je vertelt wat dat is, waarom je er les in krijgt en wat er allemaal bij komt kijken.</li>' +
        '</ol><p><strong>Check even:</strong> welk van de vier onderwerpen kies jij, en waarom dat?</p><p>' +
        'Je presentatie heeft daarna een vaste opbouw van vier soorten dia\'s. ' +
        'Die opbouw is voor alle vier de onderwerpen precies hetzelfde.' +
        '</p><ol>' +
        '<li>Een titeldia met een korte titel, je naam en klas, en een afbeelding.</li>' +
        '<li>Een inhoudsdia met het overzicht van wat er komt.</li>' +
        '<li>Minimaal 7 inhoudelijke dia\'s met steekwoorden en plaatjes.</li>' +
        '<li>Een afsluitende dia waarmee je je verhaal netjes afrondt.</li>' +
        '</ol><p>' +
        'Die vaste opbouw staat er niet zomaar voor de sier in. ' +
        'Je luisteraar weet dankzij de inhoudsdia vooraf waar jouw verhaal naartoe gaat. ' +
        'En aan het eind hoort hij aan je afsluitende dia dat het verhaal klaar is. ' +
        'Zonder zo\'n afsluitende dia stopt jouw verhaal voor je publiek gewoon ineens.' +
        '</p><p><strong>Doe dit even:</strong> schrijf in vier woorden op wat er op jouw inhoudsdia komt.</p>'],
      ['Kort, leesbaar en er zelf bij vertellen',
        'Naast die vaste opbouw moet je presentatie ook aan vier eisen voldoen.' +
        '</p><ul>' +
        '<li>Kort en bondig qua tekst, dus geen lappen tekst op je dia\'s.</li>' +
        '<li>Duidelijk en goed leesbaar, dus geen donkere tekst op een donkere achtergrond.</li>' +
        '<li>Plaatjes en een video erin.</li>' +
        '<li>Overgangen tussen alle dia\'s.</li>' +
        '</ul><p>' +
        'Zet daarom steekwoorden op je dia in plaats van hele volle zinnen. ' +
        'Steekwoorden zijn losse woorden die de stappen van je verhaal aftikken. ' +
        'De hele zin eromheen vertel jij er als spreker gewoon zelf bij. ' +
        'Dan luistert je klas naar jou in plaats van dat hij je dia zit mee te lezen.' +
        '</p><p><strong>Check even:</strong> maak van deze zin drie steekwoorden. "Een sterk wachtwoord heeft minstens twaalf tekens en gebruik je nergens anders."</p><p>' +
        'Dat wordt bijvoorbeeld: sterk wachtwoord, twaalf tekens, nergens hergebruiken. ' +
        'Goed leesbaar zijn gaat vooral over iets wat contrast heet. ' +
        'Contrast is het verschil tussen de kleur van je letter en die van je achtergrond. ' +
        'Hoe groter dat verschil is, hoe verder weg iemand jouw dia nog kan lezen. ' +
        'Wit op donkerblauw werkt daarom goed, en grijs op lichtgrijs juist helemaal niet.' +
        '</p><p>' +
        'Voor het presenteren zelf helpen drie afspraken, die je vooraf hooguit een kwartier kosten.' +
        '</p><ol>' +
        '<li>Oefen je verhaal een keer hardop, dan hoef je niet voor te lezen.</li>' +
        '<li>Kijk tussendoor je klas even aan en niet steeds naar het scherm achter je.</li>' +
        '<li>Loopt er iets mis, bijvoorbeeld een video die niet start? Vertel dan gewoon door.</li>' +
        '</ol><p>' +
        'Jij bent namelijk de spreker, en de dia is alleen maar je hulpmiddel. ' +
        'Jouw verhaal staat daarom helemaal los van de techniek achter je. ' +
        'Ben je klaar met je presentatie? Controleer dan alle punten hierboven nog een keer. ' +
        'Lever hem daarna in op de manier die je docent heeft uitgelegd.'],
      media('https://www.youtube.com/embed/grBK4wyqqjc', 'Video: acht tips voor een goede presentatie', 'Welke twee tips uit de video ga jij echt gebruiken? Welke tip vind je overdreven, en waarom?'),
      [
        {
          vraag: 'Terug naar 4.5. Wat is een overgang, en waar zet je die aan?',
          antwoord: 'Het effect tussen twee dia\'s in noemen we een overgang. Je zet hem aan via het tabblad Overgangen.',
          uitleg: 'In je eindpresentatie zit tussen alle dia\'s een overgang. Doe dat pas als al je dia\'s klaar zijn, anders mis je er een paar.',
          leerdoel: LD_4_5[2]
        },
        {
          vraag: 'Je kijkt straks naar de presentatie van een klasgenoot. Welke dia verwacht je vooraan, en welke achteraan?',
          antwoord: 'Vooraan een titeldia en daarna een inhoudsdia. Achteraan een afsluitende dia. Daartussen minimaal zeven inhoudelijke dia\'s.',
          uitleg: 'Je luisteraar weet zo vooraf waar hij naartoe gaat. En achteraf hoort hij dat het verhaal klaar is, in plaats van dat het gewoon stopt.',
          leerdoel: LD_4_6[0]
        },
        {
          vraag: 'Iemand zet zijn hele verhaal in hele zinnen op de dia. Wat doet het publiek dan? En wat vind je van donker op donker?',
          antwoord: 'Je klas zit dan te lezen en hoort niet meer wat jij vertelt. Donkere letters op een donkere kleur zijn achterin het lokaal niet meer te lezen.',
          uitleg: 'Zet steekwoorden op je dia en vertel de hele zin er zelf bij. Hoe groter het kleurverschil, hoe verder weg iemand het nog leest.',
          leerdoel: LD_4_6[1]
        },
        {
          vraag: 'Je video start niet tijdens je presentatie. Wat doe jij op dat moment?',
          antwoord: 'Gewoon doorvertellen. Je zegt kort wat er in de video te zien was en gaat verder met je verhaal.',
          uitleg: 'Jij vertelt het verhaal; de dia hangt er alleen als geheugensteun bij. Oefen je verhaal daarom een keer hardop, dan kun je ook zonder scherm door.',
          leerdoel: LD_4_6[2]
        }
      ],
      {
        tekst: 'Maak je eindpresentatie en houd hem voor de klas. Kies eerst een van de vier onderwerpen.<br><br>' +
          '<strong>Onderwerp 1: mijn device.</strong> Kies een device waar je het over wilt hebben. Maak een dia over de software en de hardware. Maak een dia over het besturingssysteem. Maak een dia met tips om je device gezond te houden. Maak een dia over wat je met dit device kunt, met de voor- en nadelen ten opzichte van een ander device. Bedenk zelf wat je nog meer kunt toevoegen.<br>' +
          '<strong>Onderwerp 2: veilig internet.</strong> Wat is het internet? Is het internet veilig of niet, met voorbeelden? Hoe houd je jezelf veilig op internet? Wat is privacy en hoe bewaak je die? Voorbeelden uit het nieuws waarom internet onveilig kan zijn. Wat is handig aan internet, waarom gebruiken mensen het zoveel?<br>' +
          '<strong>Onderwerp 3: Word.</strong> Maak een dia met korte punten over wat Word is en een dia over wat je ermee kunt. Maak per basisvaardigheid een dia met een kort stappenplan: paginanummers toevoegen, titelblad maken, automatische inhoudsopgave invoegen. Ondersteun je verhaal met schermafbeeldingen of plaatjes van internet.<br>' +
          '<strong>Onderwerp 4: digitale geletterdheid.</strong> Leg uit wat digitale geletterdheid betekent. Vertel waarom het belangrijk is om digitaal geletterd te zijn. Noem de voor- en nadelen van de groeiende digitale wereld. Vertel wat jouw rol daarin is en hoe jij je daar gedraagt. Vertel wat je doet bij problemen op internet of met je device.<br><br>' +
          '<strong>Stap 1.</strong> Maak je titeldia: korte titel, je naam en klas, en een afbeelding.<br>' +
          '<strong>Stap 2.</strong> Maak je inhoudsdia met het overzicht van wat er komt.<br>' +
          '<strong>Stap 3.</strong> Maak minimaal 7 inhoudelijke dia\'s met steekwoorden en plaatjes.<br>' +
          '<strong>Stap 4.</strong> Maak een afsluitende dia.<br>' +
          '<strong>Stap 5.</strong> Zet er een video in en zorg dat je hem vooraf een keer test.<br>' +
          '<strong>Stap 6.</strong> Zet een overgang tussen alle dia\'s.<br>' +
          '<strong>Stap 7.</strong> Controleer je contrast: geen donkere tekst op een donkere achtergrond.<br>' +
          '<strong>Stap 8.</strong> Oefen je verhaal een keer hardop.<br>' +
          '<strong>Stap 9.</strong> Houd je presentatie voor de klas. Kijk af en toe je publiek aan.<br>' +
          '<strong>Stap 10.</strong> Controleer alle punten nog een keer en lever in zoals de docent heeft uitgelegd.',
        label: 'Schrijf je onderwerp op, hoeveel dia\'s je hebt en wat je bij het presenteren zelf lastig vond.',
        modelAnswer: 'Mijn onderwerp is veilig internet. Mijn presentatie heeft elf dia\'s. Dia 1 is de titeldia met mijn naam, klas en een slotje als afbeelding. Dia 2 is mijn inhoudsdia met zes punten. Daarna komen zeven dia\'s met steekwoorden en plaatjes: wat internet is, phishing, sterke wachtwoorden, twee-staps-verificatie, privacy, een nieuwsvoorbeeld en waarom mensen internet toch gebruiken. Op dia 8 staat een korte video over phishing, die ik vooraf getest heb. Dia 11 is mijn afsluitende dia. Tussen alle dia\'s staat de overgang Duwen. Mijn letters zijn wit op donkerblauw, dus goed leesbaar. Ik vond het lastig om mijn publiek aan te kijken, want ik keek steeds naar het scherm.',
        nakijkpunten: [
          "De presentatie heeft een titeldia, een inhoudsdia, minimaal 7 inhoudelijke dia's en een afsluitende dia.",
          'Op de dia\'s staan steekwoorden en geen lappen tekst, en de tekst is leesbaar op de achtergrond.',
          'Er zitten plaatjes en een video in, en tussen alle dia\'s staat een overgang.',
          'De leerling heeft de presentatie zelf gehouden en er zelf bij verteld in plaats van voorgelezen.'
        ]
      },
      ['Welke vier dia-soorten zitten in je presentatie?', 'Hoeveel inhoudelijke dia\'s heb je minimaal nodig?', 'Wat zijn steekwoorden?', 'Wat betekent contrast?', 'Wat doe je als je video niet start?', 'Waarom oefen je je verhaal een keer hardop?'],
      'Bouw een presentatie op volgorde en beoordeel per dia of de tekst kort en leesbaar genoeg is.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Zet samen de vier dia-soorten op volgorde en zeg bij elk waarvoor hij dient.',
            antwoord: '1. Titeldia: laat zien waar het over gaat en wie je bent. 2. Inhoudsdia: laat zien wat er komt. 3. Inhoudelijke dia\'s: daar staat je verhaal. 4. Afsluitende dia: rondt je verhaal af.',
            uitleg: 'De eerste twee dia\'s en de laatste zijn er voor je luisteraar. Alleen de dia\'s in het midden gaan echt over je onderwerp.',
            leerdoel: LD_4_6[0]
          },
          {
            groep: 'samen',
            vraag: 'Maak samen van deze zin steekwoorden: "Phishing is een nepbericht waarmee criminelen je gegevens proberen te stelen."',
            antwoord: 'Bijvoorbeeld: phishing, nepbericht, gegevens stelen. Drie woorden zijn genoeg, want de rest vertel jij.',
            uitleg: 'Steekwoorden zijn haakjes waar jouw verhaal aan hangt. Zet je de hele zin erop, dan leest je publiek en luistert het niet.',
            leerdoel: LD_4_6[1]
          },
          {
            groep: 'zelf',
            vraag: 'Beoordeel deze dia: donkergrijze letters op een zwarte achtergrond, met acht regels tekst. Noem twee fouten en de oplossing.',
            antwoord: 'Fout 1: te weinig contrast, want donkergrijs op zwart lijkt te veel op elkaar. Fout 2: acht regels is veel te veel tekst. Maak de letters wit en zet er drie steekwoorden neer.',
            uitleg: 'Contrast en tekstlengte zijn twee losse eisen. Je kunt dus perfect leesbare letters hebben en toch een dia die niemand volgt.',
            leerdoel: LD_4_6[1]
          },
          {
            groep: 'zelf',
            vraag: 'Noem drie dingen die je doet terwijl je je presentatie houdt.',
            antwoord: 'Je vertelt zelf bij je steekwoorden, je kijkt af en toe je publiek aan, en je vertelt door als er iets misgaat.',
            uitleg: 'Voorlezen van je dia is geen presenteren. Jij bent de spreker, en de dia is niet meer dan je hulpmiddel.',
            leerdoel: LD_4_6[2]
          },
          {
            groep: 'steun',
            vraag: 'Wat staat er op je titeldia? Noem de drie dingen.',
            antwoord: 'Een korte titel, je naam en klas, en een afbeelding.',
            uitleg: 'Alleen een plaatje is te weinig, want dan weet niemand wie je bent. Alleen je naam is ook te weinig, want dan mist het onderwerp.',
            leerdoel: LD_4_6[0]
          },
          {
            groep: 'plus',
            vraag: 'Waarom oefen je je verhaal hardop, en niet alleen in je hoofd?',
            antwoord: 'Omdat je pas hardop merkt waar je vastloopt of te snel gaat. In je hoofd loopt alles altijd soepel.',
            uitleg: 'Je hoort dan ook of je zinnen kloppen. En je onthoudt de volgorde van je dia\'s, dus je hoeft niet voor te lezen.',
            leerdoel: LD_4_6[2]
          }
        ]
      }),

    checkpoint('4.7', 'Checkpoint: eindtoets basisvaardigheden ICT', ['21A', '22A', '23A'], 'schermfoto van je bewijs van deelname met je resultaat, gedeeld met je docent', 120, 'ICT Eindronde',
      ['Waar deze eindtoets over gaat',
        'Deze eindtoets sluit les 1 tot en met les 7 in een keer af. ' +
        'Dat is dus je hele eerste halfjaar digitale geletterdheid bij elkaar. ' +
        'Je werkt in deze paragraaf drie momenten af, en elk moment doet iets anders.' +
        '</p><ol>' +
        '<li>Het oefenblok hieronder. Dat geeft geen cijfer, maar laat zien wat je nog moet teruglezen.</li>' +
        '<li>De eindtoets op Wikiwijs. Die maak je in het volgende lesuur.</li>' +
        '<li>De hoofdstuktoets van HELIX. Die maak je bewust pas een week later.</li>' +
        '</ol><p><strong>Doe dit even:</strong> schrijf op welke van die drie je het spannendst vindt.</p><p>' +
        'De Wikiwijs-toets heeft 38 vragen in voorraad, en daarvan krijg jij er 25 willekeurig te zien. ' +
        'Vanaf 55 procent goed heb je die eindtoets gehaald met een voldoende. ' +
        'De vragen die je krijgt gaan over vier verschillende gebieden tegelijk.' +
        '</p><ul>' +
        '<li><strong>Je account en systemen:</strong> Outlook, SOMtoday, ItsLearning, wachtwoorden en OneDrive.</li>' +
        '<li><strong>Je device:</strong> hardware en software, het besturingssysteem, de taakbalk, het startmenu, updates en de processor.</li>' +
        '<li><strong>Veilig internet:</strong> phishing, cybercriminelen, identiteitsfraude, twee-staps-verificatie en wat je online zet.</li>' +
        '<li><strong>Word, Excel en PowerPoint:</strong> het voorblad, de inhoudsopgave, de formules, de dia en de overgang.</li>' +
        '</ul><p>' +
        'Kijk voor elk van die vier gebieden nog even terug in je eigen werk. ' +
        'Dat is je allerbeste samenvatting, juist omdat je het zelf gemaakt hebt.'],
      ['Hoe je je resultaat opslaat en deelt',
        'Deze toets maak je helemaal zelfstandig, want hij moet laten zien wat jij zelf al weet. ' +
        'De Digidocent staat er daarom bij uit, en je zoekt tijdens de toets ook niets op.' +
        '</p><p>' +
        'Aan het einde van de toets krijg je een scherm met jouw resultaat te zien. ' +
        'Dat scherm heet je bewijs van deelname, en dat is je bewijsstuk voor je docent. ' +
        'Zonder een schermfoto ervan ziet hij nergens terug dat jij de toets gemaakt hebt.' +
        '</p><p><strong>Check even:</strong> weet jij uit hoofdstuk 1 nog hoe je een schermfoto maakt?</p><p>' +
        'Maak die schermfoto meteen, want na het wegklikken is dat scherm voorgoed weg. ' +
        'Sla hem daarna netjes op en deel hem in vijf stappen met je docent.' +
        '</p><ol>' +
        '<li>Sla de schermfoto op in OneDrive.</li>' +
        '<li>Maak daar een map met de naam Checkpoint hoofdstuk 4.</li>' +
        '<li>Zet je Word-verslag, je Excel-bestand en je presentaties in diezelfde checkpointmap.</li>' +
        '<li>Deel de schermfoto met je docent, meestal via ItsLearning.</li>' +
        '<li>Zet er kort bij welke onderwerpen goed gingen en welke je nog wilt oefenen.</li>' +
        '</ol><p>' +
        'Die vijf stappen kosten je hooguit twee minuten van je lesuur. ' +
        'Je docent weet daardoor precies hoe hij jou de volgende les verder helpt. ' +
        'Haal je geen voldoende, dan is dat helemaal geen ramp. ' +
        'Je weet dan juist heel precies welke onderwerpen je nog eens moet doorlopen.'],
      [
        media('https://www.veiliginternetten.nl/', 'Veilig internetten: het overzicht van alle onderwerpen', 'Op deze pagina staan de thema\'s onder elkaar: phishing, wachtwoorden, tweestapsverificatie en meer. Zoek het thema op waar jij het minste van weet en schrijf twee dingen op die je daar leest.'),
        media('https://support.microsoft.com/nl-nl/accessibility/windows/navigate-and-explore-the-windows-taskbar', 'Microsoft: de Windows-taakbalk verkennen', 'De pagina loopt de taakbalk van links naar rechts af: de Startknop, het zoekvak, taakweergave en het systeemvak. Welk onderdeel gebruik jij het vaakst zonder erbij na te denken?')
      ],
      [
        {
          vraag: 'De toets gaat over vier gebieden: je account, je device, veilig internet, en Word met Excel en PowerPoint. Van welk gebied weet jij het minste?',
          antwoord: 'Dat verschilt per leerling. Schrijf op welk gebied dat bij jou is en waaraan je dat merkt.',
          uitleg: 'Kijk daarna eerst in dat gebied terug in je eigen werk. Gericht teruglezen werkt beter dan alles nog een keer doorbladeren.',
          leerdoel: LD_4_7[0]
        },
        {
          vraag: 'Aan het eind van de toets zie je een scherm met je resultaat. Wat doe je op dat moment als eerste?',
          antwoord: 'Meteen een schermfoto maken. Na het wegklikken is dat scherm weg en heb je geen bewijs meer.',
          uitleg: 'Die foto sla je op in OneDrive, in een map die je terugvindt. Daarna deel je hem met je docent, meestal via ItsLearning.',
          leerdoel: LD_4_7[1]
        },
        {
          vraag: 'Je plant je week. Wanneer maak je het oefenblok, de Wikiwijs-toets en de hoofdstuktoets?',
          antwoord: 'Het oefenblok nu, in dit lesuur. De Wikiwijs-toets volgend lesuur. De hoofdstuktoets pas een week later.',
          uitleg: 'Die week ertussen is expres. Stof die je na een tijdje weer ophaalt, blijft veel langer hangen dan stof die je meteen herhaalt.',
          leerdoel: ''
        }
      ],
      {
        tekst: 'Maak de eindtoets en deel je bewijs. Werk deze stappen in volgorde af.<br><br>' +
          '<strong>Stap 1.</strong> Maak eerst het oefenblok hierboven helemaal af. Dat is 25 korte opgaven en telt niet mee voor je cijfer.<br>' +
          '<strong>Stap 2.</strong> Ging een opgave mis? Lees dan terug in de paragraaf die erbij staat, en doe de opgave daarna nog een keer.<br>' +
          '<strong>Stap 3.</strong> Open in het volgende lesuur de eindtoets: https://maken.wikiwijs.nl/p/questionnaire/standalone/8329866<br>' +
          '<strong>Stap 4.</strong> Je krijgt 25 willekeurige vragen uit een voorraad van 38. Vanaf 55% goed heb je een voldoende.<br>' +
          '<strong>Stap 5.</strong> Werk zelfstandig. Zoek niets op en overleg niet.<br>' +
          '<strong>Stap 6.</strong> Maak aan het einde meteen een schermfoto van je bewijs van deelname.<br>' +
          '<strong>Stap 7.</strong> Sla die schermfoto op in OneDrive, in een map met de naam Checkpoint hoofdstuk 4.<br>' +
          '<strong>Stap 8.</strong> Zet je Word-verslag, je Excel-bestand en je twee presentaties in diezelfde map.<br>' +
          '<strong>Stap 9.</strong> Deel de schermfoto met je docent zoals hij dat aangeeft.<br>' +
          '<strong>Stap 10.</strong> Zet in hetzelfde bericht welke onderwerpen goed gingen en welke je nog wilt oefenen.<br>' +
          '<strong>Stap 11.</strong> Maak een week later de hoofdstuktoets van HELIX hieronder.',
        label: 'Schrijf je resultaat op, waar je schermfoto staat, en welke twee onderwerpen je nog wilt oefenen.',
        modelAnswer: 'Ik had 19 van de 25 vragen goed, dus 76 procent. Dat is een voldoende, want vanaf 55 procent ben je geslaagd. Mijn schermfoto staat in OneDrive in de map Checkpoint hoofdstuk 4. In diezelfde map staan mijn Word-verslag, mijn Excel-bestand en mijn twee presentaties. Ik heb de foto via ItsLearning gedeeld met mijn docent. Goed gingen de vragen over Word en over PowerPoint, want die heb ik net zelf gemaakt. Lastig vond ik de onderdelen van mijn device, vooral het verschil tussen werkgeheugen en opslag. Ook de vragen over phishing gingen niet goed. Die twee onderwerpen wil ik nog oefenen.',
        nakijkpunten: [
          'De schermfoto van het bewijs van deelname is er echt, met het resultaat zichtbaar.',
          'De schermfoto en de vier bestanden van dit hoofdstuk staan samen in een map in OneDrive.',
          'De leerling noemt concreet welke onderwerpen goed gingen en welke twee hij nog wil oefenen.',
          'Het bewijs is met de docent gedeeld op de manier die hij aangaf.'
        ]
      },
      ['Waar gaat deze eindtoets over?', 'Hoeveel procent heb je nodig voor een voldoende?', 'Wat doe je als eerste bij je bewijs van deelname?', 'Waar sla je je schermfoto op?', 'Hoe deel je je resultaat met je docent?', 'Wat zet je erbij in je bericht?', 'Waarom maak je de hoofdstuktoets pas een week later?'],
      'Loop in een eindronde alle onderwerpen van het halfjaar langs en verdien punten per goed beantwoord gebied.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Ophalen 1 van 5. Wat is het verschil tussen hardware en software? Geef van allebei een voorbeeld.',
            antwoord: 'Hardware zijn de onderdelen van je device, zoals het scherm en de processor. Software zijn de programma\'s die erop draaien, zoals Word.',
            uitleg: 'Ging dit mis? Lees hoofdstuk 2 terug. Ging het goed? Dan weet je meteen waarom een besturingssysteem software is en geen onderdeel.',
            leerdoel: LD_4_7[0]
          },
          {
            groep: 'samen',
            vraag: 'Ophalen 2 van 5. Is het verstandig om diep in je computer zelf instellingen aan te passen? En om vreemde programma\'s te downloaden?',
            antwoord: 'Nee, allebei niet. Van verkeerde instellingen kun je je device beschadigen. Vreemde programma\'s kunnen virussen bevatten.',
            uitleg: 'Ging dit mis? Lees hoofdstuk 2 en 3 terug. Updaten moet je juist wel regelmatig doen, en niet een keer per jaar.',
            leerdoel: LD_4_7[0]
          },
          {
            groep: 'samen',
            vraag: 'Ophalen 3 van 5. Wat is phishing, en hoe controleer je of een mail echt is?',
            antwoord: 'Phishing is een nepbericht dat je op een link laat klikken of je gegevens vraagt. Je controleert de afzender en belt zelf het bedrijf op het nummer van hun website.',
            uitleg: 'Ging dit mis? Lees hoofdstuk 3 terug. Banken en instanties vragen je nooit per mail om een wachtwoord of pincode.',
            leerdoel: LD_4_7[0]
          },
          {
            groep: 'samen',
            vraag: 'Ophalen 4 van 5. Waarom is een sterk wachtwoord belangrijk, en waarom denk je na voordat je iets online zet?',
            antwoord: 'Een sterk wachtwoord beschermt je account tegen mensen die er niet in mogen. Wat je online zet blijft lang bestaan, ook nadat je het verwijdert.',
            uitleg: 'Ging dit mis? Lees hoofdstuk 1 en 3 terug. Een sterk wachtwoord heeft minstens twaalf tekens en gebruik je nergens anders.',
            leerdoel: LD_4_7[0]
          },
          {
            groep: 'samen',
            vraag: 'Ophalen 5 van 5. Waarom leer je digitale vaardigheden op school? En waarom is OneDrive handig?',
            antwoord: 'Om jezelf en je gegevens veilig te houden, je schoolwerk beter te maken en te weten wat online echt is. OneDrive is handig omdat je er op elke computer bij kunt.',
            uitleg: 'Ging dit mis? Lees hoofdstuk 1 en 2 terug. Op je bureaublad staat een bestand alleen op die ene laptop.',
            leerdoel: LD_4_7[0]
          },
          {
            groep: 'zelf',
            vraag: 'Doel 4.1a. Hoe noem je je bestand en waar sla je het op, zodat je het thuis kunt openen?',
            antwoord: 'Met een naam als Verslag_Oefening_Voornaam_klas, en opgeslagen in OneDrive.',
            uitleg: 'Ging dit mis? Lees 4.1 terug, theorieblok A. Ging het goed? Controleer dan meteen waar jouw eigen verslag nu echt staat.',
            leerdoel: LD_4_1[0]
          },
          {
            groep: 'zelf',
            vraag: 'Doel 4.1b. Onder welk tabblad zit de knop Voorblad, en welke vijf velden vul je in?',
            antwoord: 'Onder Invoegen. De velden zijn Titel, Subtitel, Auteur, Datum en Cursus.',
            uitleg: 'Ging dit mis? Lees 4.1 terug, theorieblok B. Indeling en Ontwerpen gaan over de vorm van een pagina die er al staat.',
            leerdoel: LD_4_1[1]
          },
          {
            groep: 'zelf',
            vraag: 'Doel 4.1c. Welke drie sneltoetsen gebruik je voor opmaak, en waar zit Paginanummer?',
            antwoord: 'CTRL + B voor dik, CTRL + i voor schuin en CTRL + U voor onderstreept. Paginanummer zit onder Invoegen.',
            uitleg: 'Ging dit mis? Lees 4.1 terug, theorieblok B. Selecteer altijd eerst de tekst, anders doet de sneltoets niets.',
            leerdoel: LD_4_1[2]
          },
          {
            groep: 'zelf',
            vraag: 'Doel 4.2a. Welke stijl geef je een hoofdstuk, en welke een stukje daaronder? Waar vind je die stijlen?',
            antwoord: 'Kop 1 voor een hoofdstuk en Kop 2 voor een stukje daaronder. Je vindt ze in het vakje Stijlen op het tabblad Start.',
            uitleg: 'Ging dit mis? Lees 4.2 terug, theorieblok A. Zelf dik maken telt niet, want Word herkent dat later niet.',
            leerdoel: LD_4_2[0]
          },
          {
            groep: 'zelf',
            vraag: 'Doel 4.2b. Onder welk tabblad voeg je een inhoudsopgave in, en hoe werk je hem later bij?',
            antwoord: 'Onder Verwijzingen, via de knop Inhoudsopgave. Bijwerken doe je met Inhoudsopgave bijwerken en dan Hele inhoudsopgave bijwerken.',
            uitleg: 'Ging dit mis? Lees 4.2 terug, theorieblok B. Let op dat dit het enige onderdeel is dat niet onder Invoegen staat.',
            leerdoel: LD_4_2[1]
          },
          {
            groep: 'zelf',
            vraag: 'Doel 4.2c. Noem twee dingen die koppen opleveren in je verslag.',
            antwoord: 'Je lezer ziet meteen hoe je verslag is opgebouwd. En Word kan er een automatische inhoudsopgave van maken.',
            uitleg: 'Ging dit mis? Lees 4.2 terug, theorieblok B. De eerste winst is voor je lezer, de tweede voor jou.',
            leerdoel: LD_4_2[2]
          },
          {
            groep: 'zelf',
            vraag: 'Doel 4.3a. Noem de vijf stappen waarmee je op Google alleen plaatjes vindt die je mag gebruiken.',
            antwoord: 'Zoekterm typen, op Images klikken, op Tools klikken, op usage rights klikken en Creative Commons kiezen.',
            uitleg: 'Ging dit mis? Lees 4.3 terug, theorieblok A. In het Nederlands heet usage rights de knop Gebruiksrechten.',
            leerdoel: LD_4_3[0]
          },
          {
            groep: 'zelf',
            vraag: 'Doel 4.3b. Hoe voeg je een afbeelding in Word in, en met welk icoontje zet je hem netjes bij je tekst?',
            antwoord: 'Via Invoegen en dan Afbeelding. Netjes zetten doe je met het icoontje Indelingsopties naast de rechterbovenhoek.',
            uitleg: 'Ging dit mis? Lees 4.3 terug, theorieblok B. In dat vakje staan de terugloopopties die bepalen hoe je tekst loopt.',
            leerdoel: LD_4_3[1]
          },
          {
            groep: 'zelf',
            vraag: 'Doel 4.3c. Waarom mag je niet zomaar elk plaatje van internet gebruiken?',
            antwoord: 'Omdat elk plaatje van iemand is die het gemaakt heeft. Je hebt toestemming nodig, en die toestemming heet een licentie.',
            uitleg: 'Ging dit mis? Lees 4.3 terug, theorieblok A. Bij Creative Commons geeft de maker die toestemming vooraf, meestal met zijn naam erbij.',
            leerdoel: LD_4_3[2]
          },
          {
            groep: 'zelf',
            vraag: 'Doel 4.4a. Wat zet je in de bovenste rij van je tabel, en hoe typ je de getallen eronder?',
            antwoord: 'In de bovenste rij een kopregel met de namen van je kolommen. De getallen typ je kaal, dus zonder woord erachter.',
            uitleg: 'Ging dit mis? Lees 4.4 terug, theorieblok A. Met een woord erachter leest Excel het vakje als tekst en kan er niets meer mee rekenen.',
            leerdoel: LD_4_4[0]
          },
          {
            groep: 'zelf',
            vraag: 'Doel 4.4b. Schrijf de formule op voor het totaal van B2 tot en met B8. Schrijf ook die voor het gemiddelde.',
            antwoord: '=SOM(B2:B8) voor het totaal en =GEMIDDELDE(B2:B8) voor het gemiddelde.',
            uitleg: 'Ging dit mis? Lees 4.4 terug, theorieblok B. Het isgelijkteken vooraan is de schakelaar tussen tekst en rekenen.',
            leerdoel: LD_4_4[1]
          },
          {
            groep: 'zelf',
            vraag: 'Doel 4.4c. Wat selecteer je voordat je een grafiek invoegt, en waarom juist dat?',
            antwoord: 'Je gegevens inclusief de kopregel en de eerste kolom. Anders weet Excel niet hoe je metingen heten.',
            uitleg: 'Ging dit mis? Lees 4.4 terug, theorieblok B. Zonder die namen krijg je langs de as alleen de nummers 1 tot en met 7.',
            leerdoel: LD_4_4[2]
          },
          {
            groep: 'zelf',
            vraag: 'Doel 4.5a. Waarvoor gebruik je PowerPoint, en waarvoor juist niet?',
            antwoord: 'Om een presentatie met dia\'s te maken voor een groep. Niet voor lange teksten, want die maak je in Word.',
            uitleg: 'Ging dit mis? Lees 4.5 terug, theorieblok A. Rekenen doe je in Excel; PowerPoint is er voor je verhaal op een scherm.',
            leerdoel: LD_4_5[0]
          },
          {
            groep: 'zelf',
            vraag: 'Doel 4.5b. Hoe maak je een dia erbij, en hoe zet je daar tekst en een foto op?',
            antwoord: 'Een dia erbij via de knop Nieuwe dia. Tekst via Invoegen en Tekstvak. Een foto via Invoegen en Afbeeldingen.',
            uitleg: 'Ging dit mis? Lees 4.5 terug, theorieblok B. Alles wat je aan een dia toevoegt, staat onder het tabblad Invoegen.',
            leerdoel: LD_4_5[1]
          },
          {
            groep: 'zelf',
            vraag: 'Doel 4.5c. Onder welk tabblad kies je een achtergrond? En waar zet je overgangen aan?',
            antwoord: 'De achtergrond kies je onder Ontwerpen. Overgangen zet je aan onder het tabblad Overgangen.',
            uitleg: 'Ging dit mis? Lees 4.5 terug, theorieblok B. Zet je overgangen pas als al je dia\'s klaar zijn.',
            leerdoel: LD_4_5[2]
          },
          {
            groep: 'zelf',
            vraag: 'Doel 4.6a. Welke vier soorten dia\'s zitten in je eindpresentatie, en in welke volgorde?',
            antwoord: 'Eerst de titeldia, dan de inhoudsdia, dan minimaal zeven inhoudelijke dia\'s, en tot slot de afsluitende dia.',
            uitleg: 'Ging dit mis? Lees 4.6 terug, theorieblok A. Zonder afsluitende dia stopt je verhaal ineens, en dat merkt je publiek.',
            leerdoel: LD_4_6[0]
          },
          {
            groep: 'zelf',
            vraag: 'Doel 4.6b. Wat zet je op een dia in plaats van hele zinnen? En wat betekent contrast?',
            antwoord: 'Steekwoorden, want de hele zin vertel je er zelf bij. Contrast is het kleurverschil tussen je letters en je achtergrond.',
            uitleg: 'Ging dit mis? Lees 4.6 terug, theorieblok B. Hoe groter dat verschil, hoe verder achterin het lokaal iemand het leest.',
            leerdoel: LD_4_6[1]
          },
          {
            groep: 'zelf',
            vraag: 'Doel 4.6c. Noem drie dingen die je doet terwijl je voor de klas staat.',
            antwoord: 'Je vertelt zelf bij je steekwoorden, je kijkt af en toe je publiek aan, en je vertelt door als de techniek hapert.',
            uitleg: 'Ging dit mis? Lees 4.6 terug, theorieblok B. Oefen je verhaal een keer hardop, dan hoef je niet voor te lezen.',
            leerdoel: LD_4_6[2]
          },
          {
            groep: 'zelf',
            vraag: 'Doel 4.7a. Over welke vier gebieden gaat de eindtoets? Noem ze alle vier.',
            antwoord: 'Je account en systemen, je device, veilig internet, en Word met Excel en PowerPoint.',
            uitleg: 'Ging dit mis? Lees theorieblok A van deze paragraaf terug. Kijk daarna in je eigen werk van het gebied dat je het minste ligt.',
            leerdoel: LD_4_7[0]
          },
          {
            groep: 'zelf',
            vraag: 'Doel 4.7b. Wat doe je met je bewijs van deelname, in drie stappen?',
            antwoord: 'Stap 1: meteen een schermfoto maken. Stap 2: opslaan in OneDrive in een map die je terugvindt. Stap 3: delen met je docent.',
            uitleg: 'Ging dit mis? Lees theorieblok B van deze paragraaf terug. Na het wegklikken is het scherm weg, dus die foto is je enige bewijs.',
            leerdoel: LD_4_7[1]
          },
          {
            groep: 'steun',
            vraag: 'Welke drie programma\'s gebruikte je in dit hoofdstuk, en waarvoor dient elk?',
            antwoord: 'Word voor teksten en verslagen. Excel voor getallen, formules en grafieken. PowerPoint voor presentaties met dia\'s.',
            uitleg: 'Kies je het verkeerde programma, dan wordt alles moeilijk. Een verslag in PowerPoint maken lukt wel, maar leest niemand.',
            leerdoel: LD_4_7[0]
          },
          {
            groep: 'plus',
            vraag: 'Waarom maak je de hoofdstuktoets pas een week na de Wikiwijs-toets?',
            antwoord: 'Omdat stof die je na een tijdje weer ophaalt veel langer blijft hangen. Meteen herhalen voelt makkelijker, maar levert minder op.',
            uitleg: 'Je merkt in die week welke onderdelen echt zijn blijven zitten. Precies die onderdelen kun je dan gericht nog een keer oefenen.',
            leerdoel: LD_4_7[0]
          }
        ]
      })
  ]
};
