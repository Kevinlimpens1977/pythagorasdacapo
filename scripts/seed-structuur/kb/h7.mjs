// Hoofdstuk 7 - Kunstmatige intelligentie en chatbots.
// Kaderberoepsgerichte leerweg (kb).
//
// Bron: het Wikiwijs-arrangement "Digitale Geletterdheid" van DaCapo College.
//   7.1 en 7.2  <- les 16 "Kunstmatige Intelligentie (AI)"
//   7.3 en 7.4  <- les 17 "Een chatbot gebruiken"
//   7.5         <- toegevoegd checkpoint, geen Wikiwijs-bron
//
// De kb-versie heeft DEZELFDE onderwerpen, dezelfde volgorde en dezelfde
// leerdoelen als tl/h7.mjs, maar is opnieuw geschreven op kaderniveau:
//   - zinnen van ongeveer 12 tot 15 woorden, een idee per zin;
//   - elk begrip krijgt EERST een voorbeeld en wordt daarna pas gebruikt;
//   - meer hoe dan waarom: stappen, volgordes en concrete handelingen;
//   - theorie en doen wisselen elkaar af. Nergens staan meer dan zes of zeven
//     zinnen achter elkaar zonder opsomming, voorbeeld of tussenkopregel;
//   - media met een kijkvraag waar een filmpje uitleg in tekst scheelt.
// Er is niets uit tl/h7.mjs gekopieerd: alle theorie, opdrachten, startvragen
// en oefenopgaven zijn hier opnieuw geschreven op kb-niveau.
//
// GEMETEN NA RONDE 2 (met scripts/seed-structuur/kb/h7.mjs zelf ingelezen)
// -----------------------------------------------------------------------
// Alle tien theorieblokken tellen 207 tot 249 woorden en blijven dus binnen de
// 150 tot 250 die stap 2 van de blauwdruk vraagt. De langste ononderbroken rij
// lopende zinnen is 7 (in 7.1 B, 7.4 A en 7.5 A); dat is de bovengrens van het
// kb-profiel. De lopende theoriezinnen halen gemiddeld 11,98 woorden over 127
// zinnen, de opsommingsregels 9,44 over 95 regels, en geen enkele lopende zin
// komt boven de 18 woorden.
//
// WAT RONDE 2 VERANDERD HEEFT
// ---------------------------
// 1. 7.2 theorieblok A telde vier gevaren waar de lijst er drie noemt. De zin
//    "Een derde gevaar zit in de fouten die deze systemen maken" heet nu
//    "Naast deze drie gevaren maken AI-systemen ook gewoon fouten". De les zelf
//    noemt de fouten in dagelijkse systemen ook los van de drie gevaren, dus de
//    bron blijft volledig en de tegenspraak is weg.
// 2. Alle acht te lange theorieblokken zijn ingekort zonder dat er inhoud uit
//    verdween: korte zinparen zijn samengevoegd, opsommingen zijn strakker
//    geformuleerd, en de drie controlevragen van 7.4 en de lesplanning van 7.5
//    staan nu als opsomming in plaats van als losse korte zinnen.
// 3. De voorkennischeck van 7.1 telt nu vier vragen over hoofdstuk 6 (algoritme,
//    deepfake, nepnieuws controleren en de tijdlijn), zoals de hoofdstukblauwdruk
//    er vier tot zes vraagt.
// 4. Er staat nu een DEELTOETS van negen vragen over 7.1 tot en met 7.3, in de
//    checks van 7.4, met een routekop erboven en de steun- en plusopgave van 7.4
//    als uitkomst. Dat is het onderdeel dat de hoofdstukblauwdruk na paragraaf 3
//    zet en dat hier ontbrak.
// 5. Het zelf-oefenblok van 7.5 bevat nu alleen nog de tien diagnosevragen; het
//    promptlogboek en de uitleg-aan-een-jonger-kind zijn naar het samen-blok
//    verhuisd. Daarmee klopt de lesplanning in 7.5 theorieblok B met wat de
//    generator werkelijk bouwt, en staat er geen rij van twaalf opgaven meer.
// 6. 7.3 en 7.5 spraken van zes chatbotnamen terwijl er vijf te tellen waren.
//    Het zijn er nu overal vijf, met Bard er expliciet bij als oude naam van
//    Google Gemini.
// 7. In 7.5 theorieblok A wordt AI-geletterdheid pas benoemd nadat de twee
//    dingen zijn uitgelegd, staat "patronen" in 7.2 A met een gloss ervoor, en
//    zijn de twee tl-achtige abstracte zinnen vervangen door concrete.
//
// NIETS UIT DE BRON IS WEGGELATEN
// -------------------------------
//   les 16 -> 7.1: de omschrijving van kunstmatige intelligentie, het Engelse
//             artificial intelligence, gezichtsherkenning, de TikTok-tijdlijn,
//             het algoritme als slimme volgorde van stappen, leren van
//             ervaringen met de zelfrijdende auto, de robotafbeelding van
//             pagina 120 met de uitleg dat AI "gewoon" een computerprogramma
//             is, leren van data via de chatbot, de tussenvraag "Kan AI zelf
//             denken?" met gevoelens, bewustzijn, intuïtie, creatief en
//             emotioneel reageren en het woord simuleren, de video
//             QJE_ycgR8E8, de videovraag "Wie kan uit zichzelf leren?" met
//             machine learning, en de rij dagelijkse systemen Siri, Google
//             Home, Alexa, ChatGPT en de zoekbalk van Google.
//   les 16 -> 7.2: de voordelen (sneller informatie verwerken, patronen zoeken,
//             de arts die een ziekte in een scan vindt, de muziek-app, de
//             zoekmachine, de filters op Instagram en Snapchat, bedrijven die
//             het handig vinden), de gevaren (het privacyprobleem, deepfakes
//             uit de vorige les, beroepen die verdwijnen en de onrust
//             daarover), de open vraag naar een positief effect, de
//             AI-afbeeldingen met de prompt over de draak op een skateboard in
//             New York, de drie kenmerken (zes vingers, rare ogen, kleding die
//             vreemd overloopt), de vier punten over hoe AI-beeld gemaakt wordt
//             en waarom er discussie over is, de open vraag over betere
//             plaatjes en fake news, de vraag over persoonlijke gegevens delen,
//             de fouten in dagelijkse systemen met de video rd-iIfbd07I, de
//             vraag of die fouten gevaarlijk kunnen zijn, de opdracht bij
//             thispersondoesnotexist.com met twee kenmerken, de waarschuwing
//             dat je nooit je echte naam, adres, telefoonnummer of gegevens van
//             anderen aan een chatbot geeft, en de open vragen "Wat vind jij het
//             grootste voordeel van AI?" en "Gebruik jij zelf AI, denk je?".
//   les 17 -> 7.3: de omschrijving van een chatbot, de twee soorten (vaste
//             antwoorden bij een klantenservice en meedenkende AI-chatbots),
//             ChatGPT van OpenAI met het model GPT, GPT-3.5 gratis en GPT-4
//             tegen betaling, Google Gemini (voorheen Bard), Microsoft Copilot
//             in Word en Edge, Meta AI in Facebook en Instagram, TalkAI voor
//             leerlingen, de verschillen in snelheid, taalgebruik en wat ze
//             mogen zeggen, de video z1O3PPhi9Zc, het veilig-gebruikstuk over
//             persoonlijke informatie en het uploaden van foto's, de prompt met
//             haar onderdelen, het hart-en-longenvoorbeeld, de vraag "Hoe noemen
//             we de opdracht die je geeft?", de open vraag waarom je geen
//             persoonlijke gegevens deelt, opdracht 1 en opdracht 2 bij
//             talkai.info, en de Word-opmaak (titel, Arial of Calibri, grootte
//             11 of 12, begrippen dikgedrukt) met de bestandsnaam
//             Chatbot_JouwVoornaam.docx.
//   les 17 -> 7.4: opdracht 3 met de dolfijn en de haai, het woord hallucinatie,
//             de drie controlevragen onder het antwoord, het stuk "Hoe kan een
//             chatbot zoveel weten" met training op boeken, websites en
//             artikelen en met oude info, de vraag "Maken chatbots fouten?",
//             opdracht 4 over gezond eten met de eigen-woordenregel en de
//             Word-opmaak, opdracht 5 met de zeven prompttips en de drie
//             reflectievragen, de controlelijst van het document, het inleveren,
//             het stuk dat docenten AI-gebruik kunnen herkennen, de samenvatting
//             van les 17, en de verdieping "Invloed van AI op het onderwijs" met
//             de video kwHKzSek8ws en de discussievraag daarbij.
//
// TWEE PLEKKEN WAAR DE KB-VERSIE BEWUST IETS ANDERS DOET
// -----------------------------------------------------
// 1. De bron noemt bij een goede prompt vier onderdelen, waarvan het vierde
//    "eventueel: in welke taal of stijl" is. Het jaarplan vraagt bij kb om
//    opdracht, onderwerp, doelgroep en lengte. Daarom staan die vier hier als
//    het vaste rijtje, en staan taal, stijl en rol er als vijfde en zesde
//    onderdeel achteraan. Zo raakt er niets uit de bron kwijt en klopt het
//    leerdoel.
// 2. De bron zet "Invloed van AI op het onderwijs" onder het kopje
//    verdieping VMBO. Het staat hier gewoon in 7.4, maar wel als verdieping
//    gelabeld en na de vijf gewone opdrachten, zodat een leerling die de basis
//    net af heeft niet in de war raakt.
//
// 7.5 IS TOEGEVOEGD EN HEEFT GEEN WIKIWIJS-BRON
// ---------------------------------------------
// De theorie van 7.5 is in eigen woorden geschreven, met de bron in de tekst
// zelf genoemd: Kennisnet (kennisnet.nl/artificial-intelligence), de
// onderwijsorganisatie die scholen adviseert over AI-geletterdheid en die de
// toolkit "Schoolafspraken over het gebruik van generatieve AI" uitbrengt. Die
// toolkit staat ook als mediablok bij 7.5.
//
// De verrijking (leerdoelen, kernbegrippen, uitgewerkte voorbeelden,
// samenvattingen en alle toetsvragen) staat in
// scripts/seed-verrijking/kb/h7.mjs.

import { p, checkpoint, media } from '../helpers.mjs';

// De robotafbeelding van pagina 120 van de bron. Gekozen is een vrij te
// gebruiken foto van Wikimedia Commons van ASIMO, de looprobot van Honda: een
// metalen wezen met hoofd, armen en benen dat kon lopen en traplopen, maar niet
// kon bedenken wat het moest doen. Precies het beeld dat de bron oproept, en
// meteen het tegenvoorbeeld dat de alinea eronder nodig heeft.
const FOTO_ROBOT = '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/ASIMO_4.28.11.jpg/960px-ASIMO_4.28.11.jpg" alt="De looprobot ASIMO van Honda: een wit, metalen wezen ter grootte van een kind, met een helmvormig hoofd, twee armen en twee benen.">';

const LD_7_1 = [
  'Je kunt uitleggen wat kunstmatige intelligentie is.',
  'Je weet dat AI leert van data en niet denkt zoals een mens.',
  'Je kunt voorbeelden geven van AI die je elke dag gebruikt.'
];

const LD_7_2 = [
  'Je kunt een voordeel en een gevaar van AI noemen.',
  'Je kunt kenmerken noemen waaraan je een AI-afbeelding kunt herkennen.',
  'Je weet waarom je geen persoonlijke gegevens deelt met AI.'
];

const LD_7_3 = [
  'Je kunt uitleggen wat een chatbot is en drie bekende chatbots noemen.',
  'Je kunt een duidelijke prompt schrijven met opdracht, onderwerp, doelgroep en lengte.',
  'Je kunt het antwoord van een chatbot netjes verwerken in Word.'
];

const LD_7_4 = [
  'Je weet wat hallucinatie bij een chatbot betekent.',
  'Je kunt controleren of het antwoord van een chatbot klopt.',
  'Je weet wat je met een chatbot wel en niet mag doen voor schoolwerk.'
];

const LD_7_5 = [
  'Je kunt uitleggen hoe AI werkt en waar je op moet letten.',
  'Je kunt een prompt schrijven en het antwoord kritisch beoordelen.'
];

export default {
  chapter: 7,
  chapterTitle: 'Kunstmatige intelligentie en chatbots',
  badge: 'AI-Verkenner',
  paragraphs: [
    p('7.1', 'Wat is kunstmatige intelligentie?', ['21D'],
      'AI-logboek van één dag met jouw eigen uitleg erbij', 100, 'Mens of Machine',
      ['Wat is AI, en waar zit het in?',
        'Eerst een voorbeeld: je telefoon gaat open zodra hij jouw gezicht ziet. ' +
        'Dat heet gezichtsherkenning; daar zit kunstmatige intelligentie achter, in het Engels artificial intelligence of AI. ' +
        'AI is technologie waarmee computers taken doen die normaal alleen mensen kunnen, zoals leren, plannen en beslissen.' +
        '</p><p>' +
        'Ook TikTok weet welke filmpjes jij leuk vindt, door een algoritme: een slimme volgorde van stappen. ' +
        'Hoe vaker jij iets bekijkt, hoe beter dat algoritme jou begrijpt. ' +
        'Zo gebruik je elke dag AI; tel hier hoeveel systemen jij vandaag al gebruikte.' +
        '</p><ul>' +
        '<li>Gezichtsherkenning: je telefoon gaat open bij jouw gezicht.</li>' +
        '<li>De tijdlijn van TikTok past zich aan jouw kijkgedrag aan.</li>' +
        '<li>Siri: de spraakassistent op een iPhone.</li>' +
        '<li>Google Home: de speaker waaraan je hardop vragen stelt.</li>' +
        '<li>Alexa: de spraakassistent van Amazon.</li>' +
        '<li>ChatGPT: een chatbot die teksten voor je schrijft.</li>' +
        '<li>De zoekbalk van Google vult jouw zoekwoorden aan.</li>' +
        "<li>Je muziek-app leert welke nummers jij vaak draait.</li>" +
        '<li>Filters op Instagram of Snapchat vinden je ogen en mond.</li>' +
        '</ul><p>' +
        'Veel mensen zien bij het woord AI meteen een robot van metaal voor zich, zoals hieronder.</p>' +
        FOTO_ROBOT +
        '<p><em>Bijschrift: ASIMO, een looprobot van Honda uit 2011. ' +
        'Hij kon lopen en traplopen, maar niet zelf bedenken wat hij moest doen. ' +
        'Foto van Vanillase, Wikimedia Commons, CC BY-SA 3.0.</em></p><p>' +
        'In het echt is AI een computerprogramma, en dat heeft geen lichaam. ' +
        'Je kunt het in een robot stoppen en die robot menselijk laten doen. ' +
        'De robot is dus de verpakking, en de AI zit erin als software.'],
      ['AI leert van gegevens en denkt niet zoals jij',
        'Eerst weer een voorbeeld: een zelfrijdende auto remt te laat en maakt een fout. ' +
        'Die fout wordt opgeslagen, zodat het de volgende keer beter gaat. ' +
        'AI kan dus leren van ervaringen, net zoals jij leert van je fouten. ' +
        'Dat leren van heel veel voorbeelden heet machine learning. ' +
        'AI gebruikt daarvoor data, en data is een ander woord voor gegevens. ' +
        'Schrijf jij iets naar een chatbot, dan kan hij dat later gebruiken om te leren. ' +
        'Zo maakt een chatbot in de loop van de tijd steeds minder fouten.' +
        '</p><p>' +
        'Kan AI dan ook zelf denken, nu het zelf kan leren? ' +
        'Nee: vier dingen heb jij wel en een computerprogramma niet.' +
        '</p><ul>' +
        '<li>Gevoelens: jij wordt blij, boos of verdrietig van iets.</li>' +
        '<li>Bewustzijn: jij weet dat je er bent en wat er met je gebeurt.</li>' +
        '<li>Intuïtie: jij voelt dat iets niet klopt, nog voor je het kunt uitleggen.</li>' +
        '<li>Creatief en emotioneel reageren: jij verzint zelf iets nieuws.</li>' +
        '</ul><p>' +
        'AI begrijpt niets van wat het zegt, ook al klinkt een antwoord heel gewoon. ' +
        'AI simuleert, en simuleren betekent: menselijk gedrag alleen maar nadoen. ' +
        'Onthoud dat woord goed, want je hebt het in 7.4 meteen weer nodig. ' +
        'Elk antwoord van AI is een voorspelling, dus een gok die vaak klopt. ' +
        'Een voorspelling is geen zekerheid, en daarom kijk jij zelf het antwoord na. ' +
        'Die systemen maken namelijk fouten, en die fouten kunnen soms gevaarlijk zijn. ' +
        'In paragraaf 7.2 zie je daar meteen een bekend voorbeeld van.'],
      media('https://www.youtube.com/embed/QJE_ycgR8E8', 'Kunstmatige intelligentie voor dummies in 2 minuten (RTL Z)', 'Kijk de video en beantwoord daarna deze vraag uit de les: wie kan uit zichzelf leren? Kies uit: een systeem dat aan machine learning kan doen, elke computer, tv en telefoon, of alleen mensen. Schrijf er in één zin bij aan welk voorbeeld uit het filmpje je dat ziet.'),
      [
        {
          vraag: 'Voorkennis hoofdstuk 6. Wat doet een algoritme op social media? En waar kijkt het naar?',
          antwoord: 'Het rekent uit welke filmpjes jij te zien krijgt. Het kijkt naar je klikken en je kijktijd.',
          uitleg: 'Je hebt dit woord hier meteen weer nodig. Achter bijna elke AI zit zo\'n rekenregel.'
        },
        {
          vraag: 'Voorkennis hoofdstuk 6. Wat is een deepfake, en hoe wordt zo\'n filmpje gemaakt?',
          antwoord: 'Een filmpje of foto die echt lijkt maar door een computer is gemaakt met een bestaand gezicht.',
          uitleg: 'In 7.2 komt de deepfake terug, dan als gevaar van AI. Daar hoort dit woord weer bij.'
        },
        {
          vraag: 'Voorkennis hoofdstuk 6. Hoe controleer je of een bericht op internet nepnieuws is? Noem twee dingen.',
          antwoord: 'Kijk wie het bericht geplaatst heeft, en zoek of een tweede betrouwbare site hetzelfde meldt.',
          uitleg: 'Precies dat naar een tweede bron gaan doe je in 7.4 opnieuw, dan bij een chatbotantwoord.'
        },
        {
          vraag: 'Voorkennis hoofdstuk 6. Waarom kreeg jij op social media steeds hetzelfde soort filmpjes te zien?',
          antwoord: 'De app houdt bij wat jij bekijkt en kiest daar meer van hetzelfde bij. Zo blijf je langer kijken.',
          uitleg: 'Dat bijhouden en kiezen is AI. In 7.1 lees je hoe dat werkt en hoe zo\'n systeem leert.'
        },
        {
          vraag: 'Wat denk jij dat kunstmatige intelligentie is? Schrijf het in één zin op.',
          antwoord: 'Een computerprogramma dat werk doet waar je normaal een mens voor nodig hebt, zoals leren en beslissen.',
          uitleg: 'Veel leerlingen zeggen "een robot". Een robot is de verpakking, de AI is het programma erin.',
          leerdoel: LD_7_1[0]
        },
        {
          vraag: 'Denkt een computer volgens jou echt na als hij een goed antwoord geeft? Leg het in twee zinnen uit.',
          antwoord: 'Nee. Het programma rekent uit welk antwoord het waarschijnlijkst is en doet menselijk gedrag na.',
          uitleg: 'Waar het om gaat is het verschil tussen rekenen en begrijpen. Dat verschil staat in theorieblok B.',
          leerdoel: LD_7_1[1]
        },
        {
          vraag: 'Noem drie apparaten of apps die jij vandaag gebruikt hebt. Zit daar AI in, denk je?',
          antwoord: 'Bijvoorbeeld je telefoon met gezichtsherkenning, TikTok en je muziek-app. In alle drie zit AI.',
          uitleg: 'De les noemt er negen. Loop straks het rijtje in theorieblok A na en tel hoeveel je er had.',
          leerdoel: LD_7_1[2]
        }
      ],
      {
        tekst: 'Je maakt een AI-logboek van één dag. Werk in Word en sla het bestand op als AI_logboek_jouwvoornaam.docx. ' +
          'Stap 1: zoek zelf een afbeelding van een robot op met een Creative Commons-licentie, net als in hoofdstuk 4. ' +
          'Zet die bovenaan je document met daaronder één zin: is dit AI, of alleen de verpakking? ' +
          'Stap 2: maak een tabel met drie kolommen: moment van de dag, welk systeem, wat het voor jou deed. ' +
          'Stap 3: vul minstens vijf rijen in met momenten waarop jij vandaag AI gebruikt hebt. ' +
          'Gebruik het rijtje van negen uit theorieblok A als hulp, maar schrijf je eigen dag op. ' +
          'Stap 4: kies uit je tabel één systeem uit en schrijf in drie zinnen waaraan je merkt dat er AI in zit. ' +
          'Stap 5: schrijf onderaan in vijf zinnen je eigen uitleg bij deze vraag: kan AI zelf denken? ' +
          'Gebruik in die vijf zinnen de woorden data, machine learning en simuleren. ' +
          'Lever je document in bij je docent.',
        label: 'Lever AI_logboek_jouwvoornaam.docx in. Zet hier je vijf rijen kort neer en je uitleg over zelf denken.',
        modelAnswer: 'Mijn document heet AI_logboek_Rayan.docx. Bovenaan staat een Creative Commons-foto van een robot met de zin: dit is de verpakking, de AI is het programma erin. Mijn tabel: 07.10 uur, gezichtsherkenning, mijn telefoon ging open zonder code. 07.40 uur, muziek-app, hij zette zelf een lijst met nummers klaar die ik vaak draai. 12.20 uur, TikTok, ik kreeg vijf voetbalfilmpjes achter elkaar. 16.00 uur, zoekbalk van Google, hij vulde mijn zoekwoord al aan na drie letters. 20.30 uur, filter op Snapchat, hij vond precies mijn ogen en mijn mond. Ik kies TikTok. Ik merk dat er AI in zit doordat mijn tijdlijn anders is dan die van mijn zus. Hij wordt beter naarmate ik langer kijk. Als ik iets snel wegveeg, krijg ik dat soort filmpjes minder. Kan AI zelf denken? Nee. AI leert van data, dus van gegevens die het krijgt. Dat leren van heel veel voorbeelden heet machine learning. Het programma rekent uit wat waarschijnlijk het beste antwoord is. Het simuleert: het doet menselijk gedrag alleen maar na. Gevoelens, bewustzijn en intuïtie heeft het niet.',
        nakijkpunten: [
          'Bovenaan staat een robotafbeelding met een Creative Commons-licentie en de zin over verpakking en programma.',
          'De tabel heeft minstens vijf rijen met een moment, een systeem en wat dat systeem deed.',
          'Bij één systeem staat in drie zinnen waaraan de leerling merkt dat er AI in zit.',
          'De slotuitleg gebruikt de woorden data, machine learning en simuleren op de goede manier.'
        ]
      },
      ['Wat betekent de afkorting AI?', 'Wat is een algoritme in één zin?', 'Waarvan leert AI?', 'Wat is machine learning?', 'Waarom denkt AI niet zoals een mens?', 'Noem drie systemen met AI die je elke dag gebruikt.'],
      'Sorteer uitspraken en systemen in twee bakken: dit doet een mens, en dit doet een machine.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Leg elkaar om de beurt in één zin uit wat AI is. Wie het woord robot gebruikt, begint opnieuw.',
            antwoord: 'AI is technologie waarmee computers taken doen die normaal alleen mensen kunnen.',
            uitleg: 'Het woord robot is de valkuil. Een robot is de verpakking, AI is het programma erin.',
            leerdoel: LD_7_1[0]
          },
          {
            groep: 'samen',
            vraag: 'Zoek samen drie systemen uit het rijtje van negen. Zeg per systeem wat het voor jullie doet.',
            antwoord: 'Bijvoorbeeld: TikTok kiest je filmpjes, Siri geeft antwoord, en het filter vindt je ogen.',
            uitleg: 'Wie er maar één noemt, kijkt te weinig om zich heen. Ook de zoekbalk van Google telt mee.',
            leerdoel: LD_7_1[2]
          },
          {
            groep: 'zelf',
            vraag: 'Een zelfrijdende auto remt te laat. Wat gebeurt er daarna met die fout? Schrijf twee zinnen op.',
            antwoord: 'De fout wordt opgeslagen als voorbeeld. De volgende keer gaat het daardoor beter.',
            uitleg: 'Dit is machine learning in het klein: leren van heel veel voorbeelden, niet van nadenken.',
            leerdoel: LD_7_1[1]
          },
          {
            groep: 'zelf',
            vraag: 'Vul in: AI begrijpt niets, het ... . En het leert van ... . Gebruik de woorden uit de theorie.',
            antwoord: 'AI begrijpt niets, het simuleert. En het leert van data, dus van gegevens.',
            uitleg: 'Simuleren betekent nadoen. Wie dat woord kent, trapt niet in een antwoord dat gewoon klinkt.',
            leerdoel: LD_7_1[1]
          },
          {
            groep: 'steun',
            vraag: 'Kies de goede zin. A: een robot is hetzelfde als AI. B: AI is een programma dat in een robot kan zitten.',
            antwoord: 'Zin B is goed. AI is het programma, de robot is alleen het omhulsel eromheen.',
            uitleg: 'Twijfel je? Kijk terug naar de foto in theorieblok A. Zonder programma doet ASIMO niets.',
            leerdoel: LD_7_1[0]
          },
          {
            groep: 'plus',
            vraag: 'Jouw tijdlijn op TikTok is anders dan die van je buurman. Leg in drie zinnen uit hoe dat komt.',
            antwoord: 'Het algoritme houdt bij wat jij bekijkt, en rekent uit welke filmpjes jij waarschijnlijk leuk vindt.',
            uitleg: 'Zo werkt AI in het klein: gegevens verzamelen, patronen zoeken en dan voorspellen.',
            leerdoel: LD_7_1[2]
          }
        ]
      }),

    p('7.2', 'Voordelen, gevaren en AI-beeld', ['21D', '23A', '23C'],
      'onderzoekje naar AI-gezichten met twee bewijskenmerken', 100, 'Echt of Gegenereerd',
      ['Wat AI oplevert, en wat het kost',
        'Eerst een voorbeeld: een arts maakt een scan en zoekt daarop een klein vlekje. ' +
        'Een AI-systeem kijkt mee en vindt zo\'n vlekje soms sneller dan de arts. ' +
        'Daarmee kan AI levens redden, en dat is meteen het grootste voordeel. ' +
        'Een patroon is iets dat steeds terugkomt, zoals dat vlekje op elke zieke scan. ' +
        'AI verwerkt informatie veel sneller dan een mens en vindt zulke patronen dus snel. ' +
        'Hier staan vier voordelen uit de les.' +
        '</p><ul>' +
        '<li>Artsen sporen een ziekte op in een scan.</li>' +
        '<li>Je muziek-app leert wat jij leuk vindt.</li>' +
        '<li>Zoekmachines geven je snel het juiste antwoord.</li>' +
        "<li>Filters op Instagram of Snapchat maken je foto's en filmpjes leuker.</li>" +
        '</ul><p>' +
        'Omdat AI preciezer werkt, gebruiken steeds meer bedrijven het; dat maakt hun werk makkelijker. ' +
        'Maar dezelfde techniek levert ook drie gevaren op.' +
        '</p><ul>' +
        '<li>Een privacyprobleem: AI-systemen verzamelen persoonlijke gegevens, soms zonder dat jij het weet.</li>' +
        "<li>Misleiding: denk aan deepfakes, filmpjes of foto's die echt lijken maar door een computer gemaakt zijn.</li>" +
        '<li>Werk: computers kunnen steeds meer, dus sommige beroepen verdwijnen. Dat zorgt voor onrust.</li>' +
        '</ul><p>' +
        'De deepfake ken je uit hoofdstuk 6; nu weet je waar hij vandaan komt. ' +
        'Naast deze drie gevaren maken AI-systemen ook gewoon fouten. ' +
        'Siri, Google Home, Alexa, ChatGPT en de zoekbalk gebruiken allemaal AI. ' +
        'Soms geven ze een antwoord dat niet klopt; de video hieronder laat zo\'n bizarre fout zien.' +
        '</p><p>' +
        'Deel daarom nooit persoonlijke gegevens met een chatbot of ander AI-systeem. ' +
        'Je weet niet wie ze leest of waar ze blijven, en terughalen kan niet meer.'],
      ['Zo herken je een AI-afbeelding',
        'Eerst een voorbeeld: je typt bij een AI-programma een opdracht. ' +
        'Maak een foto van een draak op een skateboard in New York. ' +
        'Seconden later zie je een plaatje dat op een echte foto lijkt. ' +
        'Maar die draak heeft nooit bestaan, en dat skateboard ook niet. ' +
        'Zulke beelden lijken echt, maar soms zie je toch dat er iets niet klopt. ' +
        'Let daarom op deze zes kenmerken; de eerste drie noemt de les zelf.' +
        '</p><ul>' +
        '<li>Handen: tel de vingers. Zes vingers komt vaak voor.</li>' +
        '<li>Ogen: die staan soms raar, of kijken twee kanten op.</li>' +
        '<li>Kleding: een kraag of mouw loopt vreemd over in de achtergrond.</li>' +
        '<li>Tekst: letters op een bord of shirt vormen geen echt woord.</li>' +
        '<li>Sieraden en oren: links en rechts zien er anders uit.</li>' +
        '<li>Achtergrond: lijnen buigen, of iemand mist een been.</li>' +
        '</ul><p>' +
        'AI-beelden zijn vaak zo goed dat kritisch kijken hier meer nodig is dan bij een gewone foto. ' +
        'Hoe zo\'n plaatje ontstaat, staat in deze vier punten uit de les.' +
        '</p><ul>' +
        "<li>AI gebruikt foto's die het kreeg, of zoekt zelf afbeeldingen op internet.</li>" +
        "<li>Die foto's voegt AI samen tot één nieuw beeld.</li>" +
        '<li>Dat beeld is gebaseerd op werk van iemand anders; daarom is er discussie of dit mag.</li>' +
        '<li>Plaatjes kloppen soms niet, maar AI leert bij. Ze worden steeds echter, en dat helpt fake news.</li>' +
        '</ul><p>' +
        'Denk even door: wat als iemand een nepbeeld van iets schokkends verspreidt? ' +
        'Mensen geloven een foto sneller dan tekst, dus zoiets gaat hard rond. ' +
        'Eén nepbeeld kan dan grote gevolgen hebben voor een echt persoon.'],
      [
        media('https://www.youtube.com/embed/rd-iIfbd07I', 'Waarom zegt AI dat je lijm op je pizza moet doen?', 'Welke fout maakt het AI-systeem in dit filmpje? Schrijf daarna in één zin op in welke situatie zo\'n fout echt gevaarlijk zou kunnen worden.'),
        media('https://www.thispersondoesnotexist.com/', 'This Person Does Not Exist: elke keer een nieuw gezicht dat niet bestaat', 'Ververs deze pagina vijf keer en bekijk de gezichten goed. Bij welk gezicht zag jij als eerste iets wat niet klopte, en waar zat dat precies? Deze site heb je zo nodig bij de opdracht.'),
        media('https://schooltv.nl/video-item/mag-ai-mijn-gezicht-gebruiken-het-klokhuis-over-ai-2', 'Het Klokhuis: mag AI mijn gezicht gebruiken? (Schooltv, opent in een nieuw tabblad)', 'Deze aflevering opent buiten HELIX; kom daarna terug naar deze pagina. Welk bezwaar tegen AI-beeld noemt de aflevering, en staat dat bezwaar ook in het rijtje van vier punten hierboven?')
      ],
      [
        {
          vraag: 'Bedenk één ding dat AI beter maakt en één ding dat AI erger maakt. Schrijf allebei op.',
          antwoord: 'Bijvoorbeeld beter: een arts vindt een ziekte sneller. Erger: er komen filmpjes die nep zijn.',
          uitleg: 'Let op: het is dezelfde techniek. Snel patronen zien helpt de arts en maakt ook de nepfoto.',
          leerdoel: LD_7_2[0]
        },
        {
          vraag: 'Je ziet een foto die nep is. Waar kijk jij dan naar? Noem twee dingen.',
          antwoord: 'Bijvoorbeeld aan de handen, want die hebben vaak te veel vingers, en aan rare ogen.',
          uitleg: 'De les noemt er drie: handen, ogen en kleding. In theorieblok B staan er nog drie bij.',
          leerdoel: LD_7_2[1]
        },
        {
          vraag: 'Een chatbot vraagt naar je naam en je woonplaats. Vul jij dat in? Leg in twee zinnen uit waarom.',
          antwoord: 'Nee. Je weet niet wie de gegevens leest en waar ze bewaard worden, en terughalen kan niet meer.',
          uitleg: 'Achter een chatbot zit een bedrijf met mensen. Wat jij typt kan daar gewoon gelezen worden.',
          leerdoel: LD_7_2[2]
        }
      ],
      {
        tekst: 'Je maakt een onderzoekje naar AI-gezichten. Werk in Word en noem het bestand AI_beeld_jouwvoornaam.docx. ' +
          'Stap 1: ga naar de website This Person Does Not Exist. Elke keer dat je de pagina ververst, zie je een nieuwe foto. ' +
          'Toch bestaat geen enkele persoon op die foto\'s echt; ze zijn allemaal door AI gemaakt. ' +
          'Stap 2: kijk goed naar de gezichten. Je mag zo vaak verversen als je wilt. ' +
          'Zoek een foto waarop iets niet klopt aan het gezicht. ' +
          'Stap 3: maak van die foto een screenshot en zet hem in je document. ' +
          'Stap 4: schrijf twee kenmerken op waaraan je kunt zien dat het beeld niet echt is. ' +
          'Wijs die twee kenmerken aan op jouw screenshot, bijvoorbeeld met een pijl of een tekstvak. ' +
          'Stap 5: beantwoord daaronder deze vier vragen uit de les, elk in twee of drie zinnen. ' +
          'Vraag 1: noem een situatie waarin AI een positief effect heeft op ons dagelijks leven. ' +
          'Vraag 2: waarom dragen betere plaatjes bij aan meer verspreiding van fake news? Leg je antwoord uit. ' +
          'Vraag 3: is het verstandig om al jouw persoonlijke gegevens te delen met AI? Leg uit waarom wel of niet. ' +
          'Vraag 4: wat vind jij het grootste voordeel van AI, en waarom vind je dat? ' +
          'Lever je document in bij je docent.',
        label: 'Lever AI_beeld_jouwvoornaam.docx in. Zet hier je twee kenmerken neer en je antwoord op vraag 2.',
        modelAnswer: 'Mijn bestand heet AI_beeld_Kiara.docx. Op mijn screenshot staat een vrouw van ongeveer dertig. Kenmerk 1: haar linkeroor heeft een oorbel en haar rechteroor niet, terwijl je allebei de oren ziet. Kenmerk 2: de kraag van haar jas loopt aan de rechterkant over in de achtergrond, zonder rand. Ik heb er twee pijlen bij gezet. Vraag 1: AI helpt artsen om op een scan een ziekte te vinden. Dat gaat sneller en kan levens redden. Vraag 2: mensen geloven een foto sneller dan een tekst. Als AI-beelden er steeds echter uitzien, zie je de fouten niet meer. Dan geloven meer mensen een nepbericht en sturen ze het door. Vraag 3: nee. Achter de chatbot zit een bedrijf met mensen die mijn gegevens kunnen lezen. Ik weet niet waar die gegevens bewaard worden. Ze kunnen onbedoeld in verkeerde handen komen. Vraag 4: ik vind de zoekmachine het grootste voordeel. Ik vind daardoor in een paar seconden iets waar ik vroeger een halve avond naar zocht.',
        nakijkpunten: [
          'Er staat een screenshot van een AI-gezicht in het document, niet alleen een beschrijving.',
          'Er staan twee kenmerken bij die op dat screenshot echt te zien en aangewezen zijn.',
          'De vier vragen uit de les zijn alle vier beantwoord in eigen woorden.',
          'Bij vraag 3 staat de reden erbij: je weet niet wie de gegevens leest of waar ze blijven.'
        ]
      },
      ['Noem een voordeel van AI uit de les.', 'Noem een gevaar van AI uit de les.', 'Wat is een privacyprobleem?', 'Waaraan herken je een AI-afbeelding?', "Waar haalt AI de foto's vandaan voor een nieuw beeld?", 'Waarom deel je geen persoonlijke gegevens met AI?', 'Waarom helpen betere AI-plaatjes fake news?'],
      'Twee stapels beelden: echt of door AI gemaakt. Wijs per beeld het kenmerk aan dat je verraadt.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Noem samen één voordeel en één gevaar van AI. Zeg er per keer bij wie er last of voordeel van heeft.',
            antwoord: 'Voordeel: de patiënt, want de arts vindt de ziekte sneller. Gevaar: iemand van wie een deepfake rondgaat.',
            uitleg: 'Zet er altijd een persoon bij. Dan wordt het verschil tussen handig en gevaarlijk meteen duidelijk.',
            leerdoel: LD_7_2[0]
          },
          {
            groep: 'samen',
            vraag: 'Bekijk samen één gezicht op This Person Does Not Exist. Wie ziet als eerste iets wat niet klopt?',
            antwoord: 'Kijk op volgorde: handen, ogen, kleding, tekst, oren en achtergrond. Dan vind je het sneller.',
            uitleg: 'Wie zomaar rondkijkt, ziet niets. Een vaste volgorde werkt hier veel beter dan willekeurig zoeken.',
            leerdoel: LD_7_2[1]
          },
          {
            groep: 'zelf',
            vraag: 'Waarom is het een privacyprobleem als een AI-systeem gegevens over jou verzamelt?',
            antwoord: 'Je weet niet wat er met die gegevens gebeurt en wie ze leest. Terughalen kan achteraf niet meer.',
            uitleg: 'Het woord probleem zit hem in het niet weten, niet in het verzamelen zelf.',
            leerdoel: LD_7_2[2]
          },
          {
            groep: 'zelf',
            vraag: 'Leg in drie zinnen uit hoe AI een nieuw beeld maakt. Gebruik de vier punten uit de theorie.',
            antwoord: "AI gebruikt foto's die het gekregen heeft of van internet haalt, en voegt die samen tot één nieuw beeld.",
            uitleg: 'Vergeet de discussie niet: dat nieuwe beeld is gebaseerd op het werk van iemand anders.',
            leerdoel: LD_7_2[1]
          },
          {
            groep: 'steun',
            vraag: 'Vul in: het gevaar dat AI persoonlijke gegevens verzamelt heet een ... .',
            antwoord: 'Een privacyprobleem.',
            uitleg: 'Twijfel je? Lees het rijtje met drie gevaren in theorieblok A terug. Het staat er als eerste.',
            leerdoel: LD_7_2[0]
          },
          {
            groep: 'plus',
            vraag: 'Waarom is het gevaarlijk dat AI-plaatjes steeds echter worden? Schrijf drie zinnen.',
            antwoord: 'De kenmerken verdwijnen, dus je ziet de fout niet meer. Mensen geloven het beeld en sturen het door.',
            uitleg: 'Denk aan hoofdstuk 6: nepnieuws werkt op gevoel. Beeld raakt je gevoel harder dan tekst.',
            leerdoel: LD_7_2[1]
          }
        ]
      }),

    p('7.3', 'Een chatbot gebruiken: een goede prompt schrijven', ['21D', '22A'],
      'Word-document Chatbot_JouwVoornaam.docx met opdracht 1 en 2', 100, 'Prompt Bouwer',
      ['Wat is een chatbot, en welke bestaan er?',
        'Eerst een voorbeeld: op een webshop springt er ineens een chatvenster open. ' +
        'Je typt een vraag over je pakket en krijgt meteen antwoord terug. ' +
        'Zo\'n programma waarmee je via tekst praat, heet een chatbot: jij vraagt of geeft een opdracht, hij antwoordt. ' +
        'Chatbots gebruiken AI om te begrijpen wat jij bedoelt. ' +
        'Ze reageren alsof je met een mens praat, maar het blijven programma\'s die antwoorden voorspellen.' +
        '</p><p>' +
        'Er zijn twee soorten chatbots, en het verschil merk je meteen.' +
        '</p><ul>' +
        '<li>Simpele chatbots geven vaste antwoorden, zoals bij de klantenservice van een webshop.</li>' +
        '<li>AI-chatbots denken echt met je mee, zoals ChatGPT en TalkAI.</li>' +
        '</ul><p>' +
        'De bekendste is ChatGPT van het bedrijf OpenAI, dat draait op het model GPT. ' +
        'Versie 3.5 is gratis en versie 4 is slimmer, maar die nummers veranderen elk jaar. ' +
        'Er zijn nog vier namen die je moet kennen; met ChatGPT erbij zijn dat er vijf.' +
        '</p><ul>' +
        '<li>Google Gemini, dat vroeger Bard heette.</li>' +
        '<li>Microsoft Copilot, die in Word en in browser Edge zit.</li>' +
        '<li>Meta AI, die in Facebook en Instagram zit.</li>' +
        '<li>TalkAI, een gratis eenvoudige chatbot voor leerlingen.</li>' +
        '</ul><p>' +
        'De een legt goed uit, de ander maakt plaatjes of vat websites samen. ' +
        'Ze verschillen in snelheid, taalgebruik en in wat ze mogen zeggen.' +
        '</p><p>' +
        'Nog één regel, en die is de belangrijkste. ' +
        'Deel geen persoonlijke informatie met een chatbot, ook niet die van anderen. ' +
        'Achter de chatbot zit een bedrijf met mensen die jouw tekst kunnen lezen. ' +
        "Upload ook geen foto's van jezelf of van anderen; daar leert de chatbot van."],
      ['Een goede prompt schrijven en het antwoord in Word zetten',
        'De opdracht die je aan een chatbot geeft, heet een prompt. ' +
        'Hoe duidelijker jouw prompt, hoe bruikbaarder het antwoord. ' +
        'Een goede prompt heeft vier onderdelen; leer dit rijtje uit je hoofd.' +
        '</p><ul>' +
        '<li>De opdracht: wat moet de bot doen? Uitleggen, samenvatten of een lijstje maken.</li>' +
        '<li>Het onderwerp: waar moet het over gaan?</li>' +
        '<li>De doelgroep: voor wie is het? Bijvoorbeeld voor een kind van 12.</li>' +
        '<li>De lengte: 5 zinnen of 100 woorden bijvoorbeeld.</li>' +
        '</ul><p>' +
        'Je mag er nog twee dingen bij zetten, en dat helpt vaak flink. ' +
        'Noem de taal of de stijl, en geef de bot een rol: schrijf alsof je docent bent. ' +
        'Vermijd vage woorden zoals doe maar iets of vertel wat. ' +
        'Hier staat het voorbeeld uit de les.' +
        '</p><ul>' +
        '<li>Prompt: leg in makkelijke taal uit wat het verschil is tussen een hart en longen, in 5 zinnen, voor een leerling van 12 jaar.</li>' +
        '<li>Opdracht: uitleggen. Onderwerp: het verschil tussen hart en longen.</li>' +
        '<li>Doelgroep: een leerling van 12 jaar. Lengte: 5 zinnen. Stijl: makkelijke taal.</li>' +
        '</ul><p>' +
        'Het antwoord zet je daarna in vijf stappen netjes in Word.' +
        '</p><ul>' +
        '<li>Zet een titel bovenaan; deze opmaak ken je uit hoofdstuk 4.</li>' +
        '<li>Zet boven elk antwoord een kop, bijvoorbeeld: Opdracht 1 - Wat is een chatbot?</li>' +
        '<li>Kies een duidelijk lettertype, bijvoorbeeld Arial of Calibri.</li>' +
        '<li>Zet de tekstgrootte op 11 of 12.</li>' +
        '<li>Maak de begrippen dikgedrukt: de moeilijke woorden bij het onderwerp.</li>' +
        '</ul><p>' +
        'Weet je niet welke woorden de begrippen zijn, vraag het dan aan de chatbot. ' +
        'Sla je document op als Chatbot_JouwVoornaam.docx, met jouw eigen voornaam.'],
      [
        media('https://www.youtube.com/embed/z1O3PPhi9Zc', 'Wéér een nieuwe versie van ChatGPT, leerkrachten zien meer fraude (Hart van Nederland)', 'Dit nieuwsitem is uit maart 2023 en gaat over een toen splinternieuwe versie van ChatGPT. Welk probleem op school noemt de docent in het filmpje? En wat zegt de theorie hierboven over versienummers die snel verouderen?'),
        media('https://talkai.info/', 'TalkAI: de gratis chatbot die je bij de opdrachten gebruikt', 'Open TalkAI en kies de Nederlandstalige chatbot; een account maken hoeft niet. Kijk eerst rond: waar typ je je prompt, en waar verschijnt het antwoord? Je hebt deze site zo nodig bij opdracht 1 en 2.')
      ],
      [
        {
          vraag: 'Heb jij wel eens met een chatbot gepraat? Schrijf op waar dat was en wat je vroeg.',
          antwoord: 'Bijvoorbeeld bij de klantenservice van een webshop, of bij ChatGPT voor hulp bij huiswerk.',
          uitleg: 'Er zijn twee soorten: eentje met vaste antwoorden en eentje die echt meedenkt. Beide tellen mee.',
          leerdoel: LD_7_3[0]
        },
        {
          vraag: 'Je wilt uitleg over de VAR bij voetbal. Schrijf de opdracht op die je aan een chatbot geeft.',
          antwoord: 'Bijvoorbeeld: leg uit hoe de VAR werkt bij voetbal, in makkelijke taal, in 5 zinnen, voor iemand van 12.',
          uitleg: 'Kijk straks of jouw zin vier dingen bevat: opdracht, onderwerp, doelgroep en lengte.',
          leerdoel: LD_7_3[1]
        },
        {
          vraag: 'Noem drie dingen die je in Word doet zodat je verslag er netjes uitziet.',
          antwoord: 'Bijvoorbeeld een titel bovenaan, een duidelijk lettertype en tekstgrootte 11 of 12.',
          uitleg: 'Deze opmaak komt uit hoofdstuk 4. In theorieblok B staat er nog één stap bij: begrippen dikgedrukt.',
          leerdoel: LD_7_3[2]
        }
      ],
      {
        tekst: 'Ga naar de website talkai.info en kies de Nederlandstalige chatbot. Een account maken hoeft niet. ' +
          'Open daarnaast een leeg Word-document. Daar verwerk je al je antwoorden in. ' +
          'Sla het meteen op als Chatbot_JouwVoornaam.docx, dus met jouw eigen voornaam. ' +
          'Zet bovenaan een titel: Werken met een chatbot. Gebruik Arial of Calibri, grootte 11 of 12. ' +
          'Opdracht 1 - Eerste prompt in TalkAI. Typ deze prompt letterlijk over: Leg kort uit wat een chatbot is en noem 3 voorbeelden. ' +
          'Lees het antwoord goed door. Kopieer het en plak het in je Word-document. ' +
          'Zet erboven de kop: Opdracht 1 - Wat is een chatbot? ' +
          'Maak in dat antwoord de begrippen dikgedrukt. Weet je niet welke woorden dat zijn, vraag het dan aan de chatbot. ' +
          'Opdracht 2 - Zelf een goede prompt maken. Bedenk een onderwerp dat jij interessant vindt. ' +
          'Denk aan voetbal, gamen, muziek, gezondheid, eten of dieren. ' +
          'Typ een duidelijke prompt waarin je om een korte uitleg vraagt, voor iemand van 12 jaar. ' +
          'Een voorbeeld: Leg uit hoe de VAR werkt bij voetbal, in begrijpelijke taal. ' +
          'Controleer je eigen prompt op de vier onderdelen: opdracht, onderwerp, doelgroep en lengte. ' +
          'Kopieer ook dit antwoord naar Word, onder je eerste opdracht. ' +
          'Zet erboven de kop: Opdracht 2 - Mijn eigen prompt. Zet je prompt er zelf ook bij. ' +
          'Sla je document op. In paragraaf 7.4 werk je er verder in.',
        label: 'Lever Chatbot_JouwVoornaam.docx in. Zet hier je eigen prompt uit opdracht 2 neer, met de vier onderdelen erbij.',
        modelAnswer: 'Mijn bestand heet Chatbot_Devi.docx en staat in mijn map in OneDrive. Bovenaan staat de titel Werken met een chatbot in Calibri 12. Kop 1: Opdracht 1 - Wat is een chatbot? Daaronder staat het antwoord van TalkAI. Dikgedrukt staan de woorden chatbot, kunstmatige intelligentie en prompt. Kop 2: Opdracht 2 - Mijn eigen prompt. Mijn prompt is: Leg uit hoe een keeper een penalty probeert te stoppen, in makkelijke taal, in 6 zinnen, voor een leerling van 12 jaar. De vier onderdelen zitten erin. Opdracht: uitleggen. Onderwerp: hoe een keeper een penalty stopt. Doelgroep: een leerling van 12 jaar. Lengte: 6 zinnen. Extra heb ik de stijl erbij gezet: makkelijke taal. Daaronder staat het antwoord van de chatbot, met de begrippen dikgedrukt.',
        nakijkpunten: [
          'Het bestand heet Chatbot_ plus de eigen voornaam en heeft een titel, Arial of Calibri en grootte 11 of 12.',
          'Onder de kop van opdracht 1 staat het antwoord van de chatbot met de begrippen dikgedrukt.',
          'De eigen prompt van opdracht 2 bevat de opdracht, het onderwerp, de doelgroep en de lengte.',
          'Bij opdracht 2 staan zowel de prompt als het antwoord in het document.'
        ]
      },
      ['Wat is een chatbot in één zin?', 'Welke twee soorten chatbots zijn er?', 'Noem drie bekende chatbots.', 'Welk bedrijf maakte ChatGPT?', 'Wat is een prompt?', 'Welke vier onderdelen horen in een prompt?', 'Hoe heet jouw bestand?', 'Welke lettertypes noemt de les?'],
      'Bouw een prompt uit losse blokjes en zie meteen welk antwoord de bot daarop geeft.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Leg elkaar om de beurt uit wat een chatbot is. Noem er daarna samen drie bij naam.',
            antwoord: 'Een programma waarmee je via tekst praat. Bijvoorbeeld ChatGPT, TalkAI en Google Gemini.',
            uitleg: 'Microsoft Copilot en Meta AI tellen ook mee. Het zijn er vijf; Bard is de oude naam van Gemini.',
            leerdoel: LD_7_3[0]
          },
          {
            groep: 'samen',
            vraag: 'Kijk samen naar deze prompt: vertel wat over dieren. Welke drie onderdelen ontbreken hier?',
            antwoord: 'De opdracht is vaag, het onderwerp is te breed, en doelgroep en lengte ontbreken helemaal.',
            uitleg: 'Vertel wat is precies zo\'n vaag woord als de les afraadt. Zeg wat je wilt: uitleg of een lijstje.',
            leerdoel: LD_7_3[1]
          },
          {
            groep: 'zelf',
            vraag: 'Schrijf een prompt over jouw lievelingssport. Zet er de vier onderdelen los onder.',
            antwoord: 'Bijvoorbeeld: maak een lijstje met 5 regels van basketbal, voor een leerling van 12 jaar.',
            uitleg: 'Controleer altijd of je de doelgroep noemt. Die wordt het vaakst vergeten van de vier.',
            leerdoel: LD_7_3[1]
          },
          {
            groep: 'zelf',
            vraag: 'Je hebt een antwoord gekopieerd naar Word. Noem vijf dingen die je daarna aan de opmaak doet.',
            antwoord: 'Titel bovenaan, kop boven het antwoord, Arial of Calibri, grootte 11 of 12, begrippen dikgedrukt.',
            uitleg: 'Weet je niet welke woorden de begrippen zijn? Vraag de chatbot ze uit de tekst te halen.',
            leerdoel: LD_7_3[2]
          },
          {
            groep: 'steun',
            vraag: 'Vul de vier onderdelen van een prompt in: ..., ..., ... en ... .',
            antwoord: 'Opdracht, onderwerp, doelgroep en lengte.',
            uitleg: 'Onthoud ze als vier vragen: wat, waarover, voor wie en hoe lang. Loop dat rijtje altijd af.',
            leerdoel: LD_7_3[1]
          },
          {
            groep: 'plus',
            vraag: 'Terugblik 7.2. Waarom upload je geen foto van jezelf naar een chatbot? Geef twee redenen.',
            antwoord: 'De chatbot kan er beeld mee maken, en het bedrijf erachter kan bij jouw foto komen.',
            uitleg: "Denk aan de vier punten uit 7.2: AI voegt bestaande foto's samen tot een nieuw beeld.",
            leerdoel: LD_7_2[2]
          }
        ]
      }),

    p('7.4', 'Kritisch met chatbots: hallucinatie en veilig gebruik', ['21D', '23A'],
      'gecontroleerd chatbotverslag in je eigen woorden', 100, 'Klopt Dat Wel',
      ['Hallucinatie: als de chatbot iets verzint',
        'Eerst een voorbeeld: je vraagt aan een chatbot wat het verschil is tussen een dolfijn en een haai. ' +
        'Je krijgt acht vlotte zinnen terug, met namen en getallen erin. ' +
        'Alles klinkt goed, maar één zin klopt gewoon niet. ' +
        'Zo\'n verzonnen stuk in een antwoord heet hallucinatie. ' +
        'Dat gebeurt doordat de chatbot iets verzint als hij het niet zeker weet. ' +
        'Hij zegt nooit dat hij iets niet weet; hij vult het gat gewoon op.' +
        '</p><p>' +
        'Hoe kan een chatbot dan toch zoveel weten? Dat zit zo.' +
        '</p><ul>' +
        '<li>Zonder speciale zoekfunctie leest hij geen internetpagina\'s op het moment dat jij vraagt.</li>' +
        '<li>Hij is getraind op enorme hoeveelheden tekst uit boeken, websites en artikelen.</li>' +
        '<li>Daaruit leert hij wat waarschijnlijk een goed antwoord is.</li>' +
        '<li>Daarom kan hij fouten maken, oude informatie gebruiken of dingen erbij verzinnen.</li>' +
        '</ul><p>' +
        'Een chatbot is dus handig maar niet perfect, dus blijf altijd kritisch. ' +
        'Controleren doe je in vier stappen; die kosten je samen twee minuten.' +
        '</p><ul>' +
        '<li>Streep de namen, jaartallen en getallen in het antwoord aan.</li>' +
        '<li>Kies er één uit en zoek die op bij een tweede bron, dus een andere website.</li>' +
        '<li>Vergelijk wat daar staat met wat de chatbot zei.</li>' +
        '<li>Klopt het niet? Streep de zin weg en zet de goede informatie erbij.</li>' +
        '</ul><p>' +
        'De les geeft je daar drie controlevragen bij die je onder elk antwoord zet.' +
        '</p><ul>' +
        '<li>Vraag 1: klopt dit helemaal?</li>' +
        '<li>Vraag 2: hoe weet je dat?</li>' +
        '<li>Vraag 3: kun je dit controleren op een andere website?</li>' +
        '</ul><p>' +
        'Die derde vraag is de belangrijkste, want daar lever je het bewijs.'],
      ['Wat mag wel en wat mag niet voor schoolwerk',
        'Eerst een voorbeeld: je moet een werkstuk maken over gezond eten. ' +
        'Je vraagt de chatbot om een verslag en plakt dat erin. ' +
        'Dat mag niet: een werkstuk schrijf je altijd zelf. ' +
        'Wat wel mag: hulp vragen en het in eigen woorden overnemen, want daar leer je van. ' +
        'Docenten zien trouwens vaak of je AI gebruikt hebt.' +
        '</p><ul>' +
        '<li>AI schrijft op een manier die minder menselijk klinkt.</li>' +
        '<li>Er komen steeds meer systemen om AI-gebruik te controleren.</li>' +
        '<li>Je mag AI wel gebruiken, maar niet je schoolwerk laten maken.</li>' +
        '</ul><p>' +
        'Tekst in je eigen woorden zetten gaat in vier stappen.' +
        '</p><ul>' +
        '<li>Lees het antwoord helemaal door en leg het scherm weg.</li>' +
        '<li>Schrijf uit je hoofd op wat je onthouden hebt.</li>' +
        '<li>Kijk terug of je niets vergeten bent en vul aan.</li>' +
        '<li>Controleer of geen zin letterlijk hetzelfde is gebleven.</li>' +
        '</ul><p>' +
        'Gebruik daarna weer de Word-opmaak uit 7.3. ' +
        'Bij opdracht 5 schrijf je zelf een prompt met deze zeven tips.' +
        '</p><ul>' +
        '<li>Wees duidelijk: zeg precies wat je wilt.</li>' +
        '<li>Geef context: leg kort uit waar het over gaat.</li>' +
        '<li>Geef een vorm: een lijstje, uitleg, verslag of stappenplan.</li>' +
        '<li>Kies je doelgroep: zeg voor wie het bedoeld is.</li>' +
        '<li>Geef een lengte: kort, 5 zinnen, 100 woorden.</li>' +
        '<li>Geef de bot een rol: schrijf alsof je docent bent.</li>' +
        '<li>Vermijd vage woorden zoals doe maar iets of vertel wat.</li>' +
        '</ul><p>' +
        'Verdieping. Onderaan staat een filmpje over AI in het onderwijs, als extra stof. ' +
        'Scholen denken nu na: AI verbieden, of leerlingen ermee leren omgaan? ' +
        'Bij de opdracht schrijf je op wat jij daarvan vindt.'],
      [
        media('https://schooltv.nl/video-item/het-klokhuis-over-ai-5-kun-je-ai-antwoorden-vertrouwen', 'Het Klokhuis: kun je AI-antwoorden vertrouwen? (Schooltv, opent in een nieuw tabblad)', 'Deze aflevering opent buiten HELIX; kom daarna terug naar deze pagina. Noem één manier uit het filmpje om te checken of een AI-antwoord klopt. Staat die manier ook in het stappenplan van vier hierboven?'),
        media('https://www.youtube.com/embed/kwHKzSek8ws', 'Verdieping: zo verandert kunstmatige intelligentie het onderwijs', 'Kijk dit filmpje pas als je opdracht 1 tot en met 5 af hebt; het is extra stof. Welke verandering op school laat de video zien? En vind jij die verandering goed nieuws of juist zorgelijk?')
      ],
      [
        {
          vraag: 'Deeltoets over 7.1, 7.2 en 7.3. Maak eerst de negen vragen hieronder, zonder terug te lezen. Hoeveel had je er goed?',
          antwoord: 'Reken een vraag pas goed als jouw antwoord alles bevat wat in het opengeklapte antwoord staat. Zeven of meer goed? Dan ga je door en doe je verderop de plusopgave bij Extra plus. Zes of minder goed? Lees dan eerst de theorie terug die onder je gemiste vragen staat, en doe verderop de steunopgave. De drie vragen na de deeltoets zijn de gewone startvragen van deze paragraaf.',
          uitleg: 'Deze deeltoets levert geen cijfer op, maar een route. Hij staat hier omdat het AI-deel en het promptdeel nu af zijn en je overstapt op kritisch controleren. Onder elke vraag staat welk stuk theorie je teruglees als die vraag misging.'
        },
        {
          vraag: 'Deeltoets vraag 1. Wat is kunstmatige intelligentie? Geef een omschrijving van één zin.',
          antwoord: 'Een computerprogramma dat taken doet die anders een mens moet doen, zoals leren, plannen en beslissen.',
          uitleg: 'Ging deze mis? Lees 7.1 theorieblok A terug. Het woord robot hoort niet in je omschrijving: de robot is de verpakking.',
          leerdoel: LD_7_1[0]
        },
        {
          vraag: 'Deeltoets vraag 2. Goed of fout? AI denkt na over wat het zegt, want het geeft goede antwoorden.',
          antwoord: 'Fout. Het rekent uit welk antwoord het waarschijnlijkst is en doet menselijk gedrag alleen maar na.',
          uitleg: 'Ging deze mis? Lees 7.1 theorieblok B terug. Let op het woord simuleren en op de vier dingen die jij wel hebt.',
          leerdoel: LD_7_1[1]
        },
        {
          vraag: 'Deeltoets vraag 3. Noem vier systemen met AI die je vandaag gebruikt kunt hebben.',
          antwoord: 'Bijvoorbeeld gezichtsherkenning, de tijdlijn van TikTok, je muziek-app en de zoekbalk van Google.',
          uitleg: 'Ging deze mis? Lees het rijtje van negen in 7.1 theorieblok A terug. Siri, Alexa en Google Home tellen ook mee.',
          leerdoel: LD_7_1[2]
        },
        {
          vraag: 'Deeltoets vraag 4. Noem één voordeel en één gevaar van AI uit de les.',
          antwoord: 'Voordeel: een arts vindt een ziekte in een scan. Gevaar: een privacyprobleem, misleiding of werk dat verdwijnt.',
          uitleg: 'Ging deze mis? Lees 7.2 theorieblok A terug. Daar staan vier voordelen en drie gevaren op een rij.',
          leerdoel: LD_7_2[0]
        },
        {
          vraag: 'Deeltoets vraag 5. Waar kijk je als eerste naar om te zien of een foto door AI gemaakt is?',
          antwoord: 'Naar de handen: tel de vingers. Daarna naar de ogen en naar kleding die overloopt in de achtergrond.',
          uitleg: 'Ging deze mis? Lees 7.2 theorieblok B terug. Er staan zes kenmerken; de eerste drie komen uit de les zelf.',
          leerdoel: LD_7_2[1]
        },
        {
          vraag: 'Deeltoets vraag 6. Goed of fout? Je woonplaats invullen bij een chatbot kan geen kwaad.',
          antwoord: 'Fout. Achter de chatbot zit een bedrijf met mensen, en je weet niet waar je gegevens blijven.',
          uitleg: 'Ging deze mis? Lees het slot van 7.2 theorieblok A terug. Gegevens van anderen geef je ook niet door.',
          leerdoel: LD_7_2[2]
        },
        {
          vraag: 'Deeltoets vraag 7. Wat is een chatbot, en welke drie kun jij bij naam noemen?',
          antwoord: 'Een programma waarmee je via tekst praat. Bijvoorbeeld ChatGPT, TalkAI en Google Gemini.',
          uitleg: 'Ging deze mis? Lees 7.3 theorieblok A terug. Microsoft Copilot en Meta AI mogen ook; het zijn er vijf.',
          leerdoel: LD_7_3[0]
        },
        {
          vraag: 'Deeltoets vraag 8. Welke vier onderdelen horen in een prompt? Schrijf ze op volgorde op.',
          antwoord: 'Opdracht, onderwerp, doelgroep en lengte. Dus: wat, waarover, voor wie en hoe lang.',
          uitleg: 'Ging deze mis? Lees 7.3 theorieblok B terug. De doelgroep wordt van de vier het vaakst vergeten.',
          leerdoel: LD_7_3[1]
        },
        {
          vraag: 'Deeltoets vraag 9. Noem drie opmaakstappen die je in Word doet met een chatbotantwoord.',
          antwoord: 'Bijvoorbeeld een titel bovenaan, Arial of Calibri in grootte 11 of 12, en de begrippen dikgedrukt.',
          uitleg: 'Ging deze mis? Lees 7.3 theorieblok B terug. Er staan er vijf; een kop boven elk antwoord hoort er ook bij.',
          leerdoel: LD_7_3[2]
        },
        {
          vraag: 'Een chatbot geeft een antwoord waarin één zin verzonnen is. Hoe zou jij dat noemen?',
          antwoord: 'Dat heet hallucinatie: de chatbot verzint iets als hij het niet zeker weet.',
          uitleg: 'De valkuil is denken dat de bot liegt. Liegen doe je expres; dit is een fout in het rekenwerk.',
          leerdoel: LD_7_4[0]
        },
        {
          vraag: 'Hoe zou jij nakijken of een antwoord van een chatbot echt klopt? Noem twee stappen.',
          antwoord: 'Ik streep de namen en getallen aan en zoek er één op bij een andere website.',
          uitleg: 'Nog een keer vragen aan dezelfde chatbot telt niet. Je hebt een tweede bron nodig.',
          leerdoel: LD_7_4[1]
        },
        {
          vraag: 'Mag je een werkstuk door een chatbot laten schrijven? Schrijf in twee zinnen op wat jij denkt.',
          antwoord: 'Nee. Een werkstuk schrijf je zelf. Je mag de chatbot wel om hulp vragen en het in eigen woorden overnemen.',
          uitleg: 'Het gaat om het verschil tussen hulp en overnemen. Dat verschil staat in theorieblok B.',
          leerdoel: LD_7_4[2]
        }
      ],
      {
        tekst: 'Open weer je document Chatbot_JouwVoornaam.docx uit paragraaf 7.3. Je werkt daar verder in. ' +
          'Opdracht 3 - Fout zoeken en verbeteren. Vraag TalkAI: Wat is het verschil tussen een dolfijn en een haai? ' +
          'Let goed op of het antwoord klopt. Zie je een fout? Plak het antwoord in Word onder de kop Opdracht 3 - Fout zoeken. ' +
          'Schrijf onder het antwoord deze drie vragen over en beantwoord ze: Klopt dit helemaal? Hoe weet je dat? Kun je dit controleren op een andere website? ' +
          'Zet de link van die andere website erbij als bewijs. ' +
          'Opdracht 4 - Verslag gezond eten. Geef TalkAI deze prompt: Maak een kort verslag over gezond eten voor een leerling van de eerste klas vmbo, in maximaal 8 zinnen. Gebruik makkelijke woorden. ' +
          'Zet die tekst nu in je eigen woorden in Word, ook in ongeveer 8 zinnen. Kopieer dus niet. ' +
          'Zet erboven de kop: Opdracht 4 - Verslag gezond eten. ' +
          'Gebruik de opmaak uit 7.3: een titel bovenaan, Arial of Calibri, tekstgrootte 11 of 12 en de begrippen dikgedrukt. ' +
          'Opdracht 5 - Zelf denken. Bedenk zelf wat je de chatbot wilt laten schrijven. ' +
          'Gebruik de zeven tips uit theorieblok B. Zet in je prompt dat er maximaal 300 woorden geschreven worden. ' +
          'Zet in Word de kop Opdracht 5 - Zelf denken, en daaronder Prompt: en Antwoord:. ' +
          'Lees het antwoord door en beantwoord daarna deze drie vragen. ' +
          'Vraag 1: heeft de chatbot fouten gemaakt? Zo ja, welke? ' +
          'Vraag 2: heeft de chatbot goed naar je prompt geluisterd? Waarom wel of niet? ' +
          'Vraag 3: wat zou je nog willen laten aanpassen? Vraag dat aan de chatbot en plak het aangepaste antwoord eronder. ' +
          'Controleer nu je document: staan alle vijf de opdrachten erin, en is het makkelijk te lezen? Pas fouten aan. ' +
          'Lever het document daarna in. Je docent vertelt je hoe. ' +
          'Verdieping. Kijk de video over AI in het onderwijs en schrijf onderaan een paar zinnen. ' +
          'Hoe moet het onderwijs volgens jou met AI omgaan: toelaten of verbieden? Leer je minder als AI je huiswerk maakt?',
        label: 'Lever je afgeronde Chatbot_JouwVoornaam.docx in. Zet hier de fout uit opdracht 3 neer, met de link van je tweede bron.',
        modelAnswer: 'Bij opdracht 3 schreef TalkAI dat een dolfijn kieuwen heeft, net als een haai. Klopt dit helemaal? Nee. Hoe weet ik dat? Een dolfijn is een zoogdier en ademt met longen, dus hij moet boven komen voor lucht. Kun je dit controleren op een andere website? Ja, op de dierenpagina van Schooltv over dolfijnen staat dat ze longen hebben en zoogdieren zijn. De link staat in mijn document. Bij opdracht 4 heb ik het verslag over gezond eten in eigen woorden geschreven in 8 zinnen. Dikgedrukt staan de woorden vezels, eiwitten en schijf van vijf. Bij opdracht 5 was mijn prompt: schrijf alsof je mijn gymdocent bent en maak een stappenplan van 6 stappen om te leren hardlopen, voor een leerling van 12 jaar, in maximaal 300 woorden. Vraag 1: hij maakte één fout, hij noemde een afstand van 10 kilometer voor beginners. Vraag 2: hij luisterde goed, want het waren 6 stappen en het bleef onder de 300 woorden. Vraag 3: ik heb gevraagd om er per stap een tijd bij te zetten, en dat aangepaste antwoord staat eronder.',
        nakijkpunten: [
          'Bij opdracht 3 staat een aanwijsbare fout uit het antwoord, met de link van een tweede bron erbij.',
          'De drie controlevragen staan uitgeschreven onder het antwoord van opdracht 3.',
          'Het verslag van opdracht 4 is in eigen woorden geschreven en niet gekopieerd.',
          'Bij opdracht 5 staan de eigen prompt, het antwoord, de drie vragen en het aangepaste antwoord.'
        ]
      },
      ['Wat betekent hallucinatie bij een chatbot?', 'Waarom verzint een chatbot soms iets?', 'Waarop is een chatbot getraind?', 'Leest een chatbot internet op het moment dat jij vraagt?', 'Welke drie controlevragen zet je onder een antwoord?', 'Wat mag je met een chatbot wel voor schoolwerk?', 'Wat mag je niet?', 'Waaraan kan een docent AI-gebruik herkennen?'],
      'Vijf chatbotantwoorden op je scherm. Vind in elk antwoord de verzonnen zin en bewijs het met een bron.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Leg elkaar uit wat hallucinatie is. Verzin er samen een voorbeeld bij dat niet uit de les komt.',
            antwoord: 'Hallucinatie is dat de chatbot iets verzint als hij het niet zeker weet, bijvoorbeeld een fout jaartal.',
            uitleg: 'Gebruik niet het woord liegen. Liegen doe je expres; hier gaat het rekenen gewoon mis.',
            leerdoel: LD_7_4[0]
          },
          {
            groep: 'samen',
            vraag: 'Pak samen één antwoord van TalkAI. Streep om de beurt aan wat gecontroleerd moet worden.',
            antwoord: 'Alle namen, jaartallen en getallen. Die zijn na te kijken; een mening is dat niet.',
            uitleg: 'Zolang je niet weet welk stukje bewijs nodig heeft, controleer je alles of juist niets.',
            leerdoel: LD_7_4[1]
          },
          {
            groep: 'zelf',
            vraag: 'Waarom kan een chatbot verouderde informatie geven? Schrijf twee zinnen op.',
            antwoord: 'Hij is getraind op tekst van vroeger. Op het moment van jouw vraag leest hij niets nieuws.',
            uitleg: 'Alleen met speciale toestemming zoekt hij live op internet. Dat is niet de standaard.',
            leerdoel: LD_7_4[0]
          },
          {
            groep: 'zelf',
            vraag: 'Zet in de goede volgorde: vergelijken, aanstrepen, opzoeken bij een tweede bron, zin verbeteren.',
            antwoord: 'Eerst aanstrepen, dan opzoeken bij een tweede bron, dan vergelijken, dan de zin verbeteren.',
            uitleg: 'Wie meteen gaat zoeken, weet niet waarnaar. Aanstrepen is daarom altijd stap 1.',
            leerdoel: LD_7_4[1]
          },
          {
            groep: 'steun',
            vraag: 'Zes of minder goed in de deeltoets? Doe deze eerst. Mag dit wel of niet? A: het antwoord letterlijk in je werkstuk plakken. B: het in eigen woorden overnemen.',
            antwoord: 'A mag niet, B mag wel. Een werkstuk schrijf je altijd zelf.',
            uitleg: 'Twijfel je? Lees theorieblok B terug. Hulp vragen mag; je werk laten maken niet.',
            leerdoel: LD_7_4[2]
          },
          {
            groep: 'plus',
            vraag: 'Zeven of meer goed in de deeltoets? Deze is voor jou. Wat heeft een verzonnen zin van een chatbot te maken met een zesde vinger op een AI-foto?',
            antwoord: 'Allebei kiest het programma wat het waarschijnlijkst is, zonder ergens te controleren of het klopt.',
            uitleg: 'Eén werking, twee soorten fouten. Daarom controleer je bij beide zelf, met je eigen ogen of een bron.',
            leerdoel: LD_7_2[1]
          }
        ]
      }),

    checkpoint('7.5', 'Checkpoint: slim en veilig met AI', ['21D', '23A', '23C'],
      'AI-dossier met bewijs uit het hele hoofdstuk', 120, 'AI Challenge',
      ['Wat je nu over AI weet',
        'In dit hoofdstuk heb je AI van twee kanten bekeken: hoe het werkt en hoe je ermee omgaat. ' +
        'Je weet nu dat AI leert van gegevens en dat het patronen zoekt. ' +
        'Begrijpen doet het niets; het doet menselijk gedrag alleen maar na. ' +
        'Snel patronen zien helpt de arts aan een diagnose, en maakt ook het gezicht dat niet bestaat. ' +
        'Eén techniek dus, met een voordeel en een gevaar eraan vast. ' +
        'Hier staat per paragraaf wat je in handen hebt gekregen.' +
        '</p><ul>' +
        '<li>Uit 7.1: wat AI is, hoe het leert en negen systemen die je elke dag gebruikt.</li>' +
        '<li>Uit 7.2: een voordeel en een gevaar, zes kenmerken van AI-beeld, en de regel over persoonlijke gegevens.</li>' +
        '<li>Uit 7.3: wat een chatbot is, vijf namen, de vier onderdelen van een prompt en de Word-opmaak.</li>' +
        '<li>Uit 7.4: hallucinatie, het stappenplan om te controleren, en wat wel en niet mag voor schoolwerk.</li>' +
        '</ul><p>' +
        'Twee dingen doe jij nu zelf: je schrijft een scherpe opdracht, en je leest het antwoord na. ' +
        'Hoe scherper je opdracht, hoe bruikbaarder het antwoord. ' +
        'Hoe kritischer je naleest, hoe minder onzin er in je werk komt. ' +
        'Die twee dingen samen heten AI-geletterdheid. ' +
        'Nalezen is een gewoonte, net als je fiets op slot zetten. ' +
        'Kort gezegd: eerst controleren, dan pas geloven.'],
      ['Zo lever je je bewijs in',
        'Deze uitleg staat niet in de les en komt van Kennisnet, op kennisnet.nl/artificial-intelligence. ' +
        'Kennisnet adviseert scholen over ict en AI, en zegt twee dingen die voor jou belangrijk zijn.' +
        '</p><ul>' +
        '<li>AI komt ongemerkt de school binnen, doordat leerlingen en docenten het al gebruiken.</li>' +
        '<li>Daarom maakt een school duidelijke afspraken over wat wel en niet mag met AI.</li>' +
        '</ul><p>' +
        'Vraag dus altijd aan je docent wat de afspraak is bij zijn vak. ' +
        'Weet je die afspraak niet, dan raad je maar wat. ' +
        'In deze checkpoint verzamel je bewijsstukken uit het hele hoofdstuk. ' +
        'Een bewijsstuk is iets waaraan je docent kan zien dat je het gedaan hebt. ' +
        'Dat kan een screenshot zijn, een bestand of een prompt met het antwoord.' +
        '</p><p>' +
        'Zet alles bij elkaar in één OneDrive-map met de naam AI-dossier hoofdstuk 7. ' +
        'Nieuw is het promptlogboek; dat vul je vanaf nu bij elke prompt in.' +
        '</p><ul>' +
        '<li>Regel 1: de prompt die je gaf, precies zoals je hem typte.</li>' +
        '<li>Regel 2: het antwoord dat je kreeg, in het kort.</li>' +
        '<li>Regel 3: wat je ermee deed. Overgenomen, herschreven of weggegooid.</li>' +
        '</ul><p>' +
        'Die derde regel is de belangrijkste, want daar staat jouw eigen keuze in. ' +
        'Zo ziet iedereen waar jouw werk ophoudt en waar de machine begon. ' +
        'Deze checkpoint past niet in één lesuur; reken op drie lessen.' +
        '</p><ul>' +
        '<li>Les 1: de startcheck, deze twee theorieblokken en het blok Samen oefenen.</li>' +
        '<li>Les 2: de tien diagnosevragen bij Zelf oefenen, dan steun of plus, dan je dossier inleveren.</li>' +
        '<li>Les 3: de hoofdstuktoets, zonder Digidocent en met één poging.</li>' +
        '</ul>'],
      media('https://www.kennisnet.nl/artificial-intelligence/schoolafspraken-over-het-gebruik-van-generatieve-ai/', 'Kennisnet: schoolafspraken over het gebruik van generatieve AI', 'Deze pagina is voor scholen geschreven, niet voor leerlingen; lees hem dus als een kijkje achter de schermen. Noem één afspraak die jij op deze pagina ziet en die jij ook in jouw klas zou willen. Deze pagina opent buiten HELIX.'),
      [
        {
          vraag: 'Je moet thuis vertellen hoe AI werkt. Welke twee dingen vertel je zeker? Schrijf ze op.',
          antwoord: 'Bijvoorbeeld: AI leert van heel veel voorbeelden, en het begrijpt niets van wat het zegt.',
          uitleg: 'Wie moet kiezen, moet ordenen. Wat je als eerste noemt, is voor jou de kern van dit hoofdstuk.',
          leerdoel: LD_7_5[0]
        },
        {
          vraag: 'Een chatbot geeft je acht vlotte zinnen met jaartallen erin. Wat doe je als eerste?',
          antwoord: 'Ik streep de jaartallen en de namen aan en zoek er minstens één op bij een tweede bron.',
          uitleg: 'Beoordelen begint bij aanwijzen. Anders controleer je alles of juist helemaal niets.',
          leerdoel: LD_7_5[1]
        },
        {
          vraag: 'Welk werkstuk uit 7.1 tot en met 7.4 heb jij al af, en welk moet je nog afmaken?',
          antwoord: 'Het AI-logboek, het onderzoekje naar AI-beeld, of het document met de vijf chatbotopdrachten.',
          uitleg: 'Deze startcheck vindt gaten vóór de toets, niet erna. Zoek ze dus nu op, niet volgende week.',
          leerdoel: LD_7_5[0]
        }
      ],
      {
        tekst: 'Maak in OneDrive de map AI-dossier hoofdstuk 7. Zet daar vijf bewijsstukken in. ' +
          '1: je AI-logboek uit 7.1, met de robotafbeelding en je uitleg over zelf denken. ' +
          '2: je onderzoekje uit 7.2, met het screenshot van een AI-gezicht en de twee kenmerken erbij. ' +
          '3: je document Chatbot_JouwVoornaam.docx met alle vijf de opdrachten uit 7.3 en 7.4. ' +
          '4: een promptlogboek met minstens drie prompts. Zet per prompt de drie regels erbij. ' +
          '5: één antwoord van een chatbot dat aantoonbaar fout was. Zet de link van je tweede bron eronder. ' +
          'Maak daarna in Word een nieuw bestand met de naam Mijn_AI_afspraken.docx. ' +
          'Stap 1: schrijf in vier zinnen wat AI voor jou kan doen. Gebruik een voorbeeld uit je eigen week. ' +
          'Stap 2: schrijf in vier zinnen waar jij zelf op let bij AI. Noem daarbij het woord hallucinatie. ' +
          'Stap 3: bedenk één afspraak over AI-gebruik die jij in jouw klas zou willen. Schrijf hem als één regel op. ' +
          'Zet erbij waarom die afspraak volgens jou eerlijk is voor iedereen. ' +
          'Lever de map in bij je docent.',
        label: 'Lever de map AI-dossier hoofdstuk 7 in. Noem hier je foute chatbotantwoord, je tweede bron en je klassenafspraak.',
        modelAnswer: 'Mijn map heet AI-dossier hoofdstuk 7 en bevat vijf bestanden. 1: AI_logboek_Rayan.docx met de robotfoto en vijf momenten van mijn dag. 2: AI_beeld_Rayan.docx met een screenshot van een AI-gezicht, waarbij het linkeroor een oorbel heeft en het rechteroor niet, en waarbij de kraag overloopt in de achtergrond. 3: Chatbot_Rayan.docx met alle vijf de opdrachten. 4: mijn promptlogboek met drie prompts. Voorbeeld: prompt was leg uit hoe een keeper een penalty stopt in 6 zinnen voor iemand van 12; het antwoord noemde zes tips; ik heb het herschreven in mijn eigen woorden. 5: het foute antwoord dat een dolfijn kieuwen heeft. Mijn tweede bron is de dolfijnenpagina van Schooltv, met de link erbij. Daar staat dat een dolfijn een zoogdier is met longen. In Mijn_AI_afspraken.docx staat wat AI voor mij doet: het legt uit wat ik in de les niet snapte, in makkelijke taal. Waar ik op let: ik controleer namen en getallen bij een tweede bron, want een chatbot kan hallucineren en zelf iets verzinnen. Mijn klassenafspraak: we zetten onder elk werkstuk welke prompt we gebruikt hebben. Dat is eerlijk, want dan zie je bij iedereen even goed wat de bot deed en wat hijzelf deed.',
        nakijkpunten: [
          'Alle vijf de bewijsstukken zitten in de map en zijn door de leerling zelf gemaakt.',
          'Het promptlogboek heeft per prompt drie regels, waarvan de derde de eigen keuze noemt.',
          'Het foute chatbotantwoord is weerlegd met een link naar een bron buiten de chatbot.',
          'In Mijn_AI_afspraken.docx staat één klassenafspraak met een reden erbij.'
        ]
      },
      ['Wat is AI en waarvan leert het?', 'Denkt AI zoals een mens?', 'Noem drie systemen met AI die je elke dag gebruikt.', 'Noem een voordeel en een gevaar van AI.', 'Waaraan herken je een AI-afbeelding?', 'Welke gegevens deel je nooit met een chatbot?', 'Wat is een chatbot en noem er drie.', 'Wat is een prompt en welke vier onderdelen horen erin?', 'Hoe maak je het antwoord netjes op in Word?', 'Wat is hallucinatie?', 'Hoe controleer je een chatbotantwoord?', 'Wat mag je met AI wel en niet voor schoolwerk?'],
      'Vijf kamers, en in elke kamer lever je één bewijsstuk uit hoofdstuk 7 af.',
      false,
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Loop samen jullie map na. Welk bewijsstuk hoort bij 7.2, en waaraan zie je dat het compleet is?',
            antwoord: 'Het screenshot van een AI-gezicht. Het is compleet als er twee kenmerken bij staan die je op dat beeld ziet.',
            uitleg: 'Compleet betekent niet dat het bestand bestaat. Iemand anders moet er iets aan kunnen aflezen.',
            leerdoel: LD_7_5[0]
          },
          {
            groep: 'samen',
            vraag: 'Schrijf samen één prompt en beoordeel elkaars antwoord. Wat zou je nog laten aanpassen?',
            antwoord: 'Controleer eerst de vier onderdelen. Vraag daarna bijvoorbeeld om kortere zinnen of om een voorbeeld erbij.',
            uitleg: 'Aanpassen vragen hoort erbij. Een tweede prompt levert bijna altijd een beter antwoord op.',
            leerdoel: LD_7_5[1]
          },
          {
            groep: 'samen',
            vraag: 'Schrijf allebei de drie regels van je promptlogboek uit. Ruil daarna en kijk elkaars regel 3 na.',
            antwoord: 'Regel 1 de prompt, regel 2 het antwoord in het kort, regel 3 wat je ermee deed.',
            uitleg: 'Regel 3 is de belangrijkste. Zonder die regel staat er alleen dat je iets gevraagd hebt.',
            leerdoel: LD_7_5[1]
          },
          {
            groep: 'samen',
            vraag: 'Leg elkaar om de beurt in twee zinnen uit hoe AI werkt, alsof je het aan je buurjongen van 10 vertelt.',
            antwoord: 'AI krijgt heel veel voorbeelden te zien. Daarin zoekt het wat steeds terugkomt, en zo raadt het wat erbij past.',
            uitleg: 'Wie het woord denken gebruikt, begint opnieuw. AI rekent; begrijpen doet het niet.',
            leerdoel: LD_7_5[0]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 1. Wat is kunstmatige intelligentie? Geef een omschrijving van één zin.',
            antwoord: 'Techniek waarmee een computer taken doet die normaal alleen een mens kan, zoals leren en beslissen.',
            uitleg: 'Gaat dit mis? Lees 7.1, theorieblok A terug. Het woord robot hoort niet in je omschrijving.',
            leerdoel: LD_7_1[0]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 2. Waarvan leert AI, en waarom is dat geen denken? Twee zinnen.',
            antwoord: 'Van data, dus gegevens. Het rekent uit wat waarschijnlijk klopt en simuleert menselijk gedrag.',
            uitleg: 'Gaat dit mis? Lees 7.1, theorieblok B terug. Gevoelens, bewustzijn en intuïtie ontbreken daar.',
            leerdoel: LD_7_1[1]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 3. Noem vijf systemen met AI die je elke dag gebruikt.',
            antwoord: 'Bijvoorbeeld gezichtsherkenning, de tijdlijn van TikTok, Siri, je muziek-app en de zoekbalk van Google.',
            uitleg: 'Gaat dit mis? Lees 7.1, theorieblok A terug. Daar staan er negen op een rij.',
            leerdoel: LD_7_1[2]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 4. Noem één voordeel en één gevaar van AI uit de les.',
            antwoord: 'Voordeel: een arts vindt een ziekte in een scan. Gevaar: een privacyprobleem of een deepfake.',
            uitleg: 'Gaat dit mis? Lees 7.2, theorieblok A terug. De les noemt vier voordelen en drie gevaren.',
            leerdoel: LD_7_2[0]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 5. Noem drie kenmerken waaraan je een AI-afbeelding herkent.',
            antwoord: 'Handen met te veel vingers, rare ogen, en kleding die vreemd overloopt in de achtergrond.',
            uitleg: 'Gaat dit mis? Lees 7.2, theorieblok B terug. Er staan er zes; de eerste drie komen uit de les.',
            leerdoel: LD_7_2[1]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 6. Waarom geef je een chatbot niet je naam, adres of telefoonnummer?',
            antwoord: 'Achter de chatbot zit een bedrijf met mensen. Je weet niet wie het leest of waar het bewaard wordt.',
            uitleg: 'Gaat dit mis? Lees 7.2, theorieblok A terug. Gegevens van anderen geef je ook niet door.',
            leerdoel: LD_7_2[2]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 7. Wat is een chatbot, en welke drie kun jij noemen?',
            antwoord: 'Een programma waarmee je via tekst praat. Bijvoorbeeld ChatGPT, TalkAI en Google Gemini.',
            uitleg: 'Gaat dit mis? Lees 7.3, theorieblok A terug. Copilot en Meta AI mogen ook.',
            leerdoel: LD_7_3[0]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 8. Welke vier onderdelen horen in een prompt? Geef er meteen een voorbeeld bij.',
            antwoord: 'Opdracht, onderwerp, doelgroep en lengte. Bijvoorbeeld: leg de VAR uit, voor iemand van 12, in 5 zinnen.',
            uitleg: 'Gaat dit mis? Lees 7.3, theorieblok B terug. De doelgroep wordt het vaakst vergeten.',
            leerdoel: LD_7_3[1]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 9. Noem vijf opmaakstappen die je in Word doet met een chatbotantwoord.',
            antwoord: 'Titel bovenaan, kop boven het antwoord, Arial of Calibri, grootte 11 of 12, begrippen dikgedrukt.',
            uitleg: 'Gaat dit mis? Lees 7.3, theorieblok B terug. De chatbot mag de begrippen zelf aanwijzen.',
            leerdoel: LD_7_3[2]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 10. Wat is hallucinatie, en hoe bewijs je dat een antwoord fout is?',
            antwoord: 'De chatbot verzint iets als hij het niet zeker weet. Je bewijst het met een tweede bron.',
            uitleg: 'Gaat dit mis? Lees 7.4, theorieblok A terug. Nog eens vragen aan dezelfde bot telt niet.',
            leerdoel: LD_7_4[0]
          },
          {
            groep: 'steun',
            vraag: 'Vul in: eerst ..., dan pas geloven. En een chatbot ... iets als hij het niet zeker weet.',
            antwoord: 'Eerst controleren, dan pas geloven. En een chatbot verzint iets als hij het niet zeker weet.',
            uitleg: 'Twijfel je? Deze twee zinnen zijn de kern van 7.4. Leer ze zo uit je hoofd.',
            leerdoel: LD_7_4[1]
          },
          {
            groep: 'steun',
            vraag: 'Mag dit wel of niet voor schoolwerk? A: de chatbot om uitleg vragen. B: je werkstuk laten schrijven.',
            antwoord: 'A mag wel, B mag niet. Hulp vragen is toegestaan, je werk laten maken niet.',
            uitleg: 'Twijfel je? Lees 7.4, theorieblok B terug. Docenten kunnen AI-gebruik vaak herkennen.',
            leerdoel: LD_7_4[2]
          },
          {
            groep: 'plus',
            vraag: 'Bedenk een klassenafspraak over AI die eerlijk is voor iedereen. Leg in drie zinnen uit waarom.',
            antwoord: 'Bijvoorbeeld: we zetten onder elk werkstuk welke prompt we gebruikt hebben.',
            uitleg: 'Kennisnet zegt dat scholen zulke afspraken moeten maken. Jouw regel moet voor iedereen gelden.',
            leerdoel: LD_7_5[1]
          }
        ]
      })
  ]
};
