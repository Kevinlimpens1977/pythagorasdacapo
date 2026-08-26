// Verrijkingslaag hoofdstuk 7 - Kunstmatige intelligentie en chatbots.
// Kaderberoepsgerichte leerweg (kb).
//
// Zie scripts/seed-verrijking/PATROON.md voor het formaat van een vraag, de
// regels over afleiders en de eisen aan feedback. De structuur en de lesstof
// staan in scripts/seed-structuur/kb/h7.mjs.
//
// Bron: het Wikiwijs-arrangement "Digitale Geletterdheid" van DaCapo College,
// les 16 (AI) voor 7.1 en 7.2 en les 17 (een chatbot gebruiken) voor 7.3 en
// 7.4. 7.5 is een toegevoegd checkpoint zonder Wikiwijs-bron; de uitleg daar
// leunt op Kennisnet (kennisnet.nl/artificial-intelligence).
//
// Opzet per paragraaf, volgens de blauwdruk en het kb-profiel:
//   - elk leerdoel heeft zijn EIGEN startvraag; die staan als `checks` in het
//     structuurbestand, met antwoord en uitleg erbij. 7.1 opent daarnaast met
//     VIER voorkennisvragen over hoofdstuk 6 (het algoritme op social media, de
//     deepfake, nepnieuws controleren en de tijdlijn die zich aanpast), zoals de
//     hoofdstukblauwdruk er vier tot zes vraagt en les 16 zelf naar terugwijst;
//   - na 7.3 staat een DEELTOETS van negen vragen over 7.1 tot en met 7.3, in de
//     checks van 7.4. Geen cijfer: de uitslag stuurt naar de steunopgave of de
//     plusopgave van 7.4. Elk leerdoel van 7.1, 7.2 en 7.3 komt er één keer in
//     voor. De tien diagnosevragen in het zelf-blok van 7.5 blijven daarnaast
//     staan; dat is de diagnostische toets vóór de hoofdstuktoets;
//   - elk theorieblok heeft hieronder een uitgewerkt voorbeeld (vraag +
//     volledige uitwerking) dat VOOR het oefenblok en het zelfstandig oefenen
//     komt. Tien blokken, dus tien voorbeelden;
//   - elke afsluitquiz vanaf 7.2 heeft TWEE terugkeervragen naar leerdoelen van
//     eerdere paragrafen van dit hoofdstuk, en die twee komen uit verschillende
//     paragrafen. De validator eist er een; spreiden is een van de twee
//     technieken waar de blauwdruk hard bewijs voor heeft, dus het worden er twee;
//   - de hoofdstuktoets 7.5 bevraagt elk van de veertien verplichte leerdoelen
//     van 7.1 tot en met 7.5 precies TWEE keer. Dat maakt 28 vragen, boven de
//     15 tot 20 die de blauwdruk als startwaarde noemt. De blauwdruk zet het
//     bewijsmerk bij de dekkingseis en niet bij het aantal, dus de dekking wint.
//     Datzelfde geldt voor de afsluitquizzen: die tellen 8, 10, 10 en 11 vragen
//     waar de blauwdruk 5 als startwaarde noemt. Die 5 staat er expliciet als
//     ontwerpkeuze mét bijstelregel, terwijl "elk leerdoel raken" en "twee
//     terugkeervragen" wél bewijs achter zich hebben. Met drie leerdoelen plus
//     twee terugkeervragen per paragraaf is 8 het rekenkundige minimum;
//   - kb-vorm: veel goed/fout-vragen naast meerkeuze en per blok een enkele open
//     vraag. Gemeten over heel hoofdstuk 7: 67 vragen, waarvan 35 meerkeuze,
//     26 waar-niet-waar en 6 open. Per blok: 7.1 heeft er 8, 7.2 en 7.3 elk 10,
//     7.4 elf en de hoofdstuktoets 7.5 achtentwintig.
//     In elke meerkeuzevraag is minstens een afleider even lang als of
//     langer dan het goede antwoord, zodat blind de langste knop klikken niets
//     oplevert; de reden staat in `explanation`, niet in de antwoordtekst.
//
// De kb-vragen zijn opnieuw geschreven en niet overgenomen uit tl/h7.mjs: kort
// geformuleerd, een idee per zin en met scenario's uit de leefwereld van een
// brugklasser.
//
// TWEE VRAGEN DIE IN RONDE 2 HERSCHREVEN ZIJN
// -------------------------------------------
// 1. "AI maakt een nieuw beeld door bestaande foto's samen te voegen" stond als
//    waar. Dat staat zo in de bron en blijft daarom in de theorie van 7.2 staan,
//    maar zo werken beeldmodellen niet: ze plakken geen foto's aan elkaar. Als
//    waar-niet-waar-stelling zette dat een misvatting vast. De stelling toetst nu
//    het bronpunt dat er wel toe doet: een AI-beeld leunt op foto's van anderen,
//    en daarom is er discussie of het mag.
// 2. "Een chatbot leest de internetpagina's op het moment dat jij je vraag stelt"
//    stond als niet waar, met de nuance pas in de feedback. In 2026 zoeken veel
//    chatbots wél live. De stelling begint nu met "Elke chatbot", zodat ze
//    onwaar is om de goede reden, en de feedback noemt de zoekfunctie.
//
// De vijf samenvattingen zijn teruggebracht van vier naar drie zinnen. Stap 9
// van de blauwdruk vraagt er twee of drie, en dat is juist de plek waar de
// blauwdruk kort wil zijn omdat samenvatten de zwakste van de tien technieken is.
//
// EEN NOOT OVER DE KERNBEGRIPPEN
// ------------------------------
// Het woord "prompt" staat in de kb-seed al in twee blokken van hoofdstuk 8, en
// een kernbegrip mag in maximaal twee blokken vetgezet worden. Daarom is in 7.3
// gekozen voor "goede prompt": dat staat letterlijk in de theorie, zet het woord
// prompt toch vet en botst niet met hoofdstuk 8.

const LD_7_1_A = 'Je kunt uitleggen wat kunstmatige intelligentie is.';
const LD_7_1_B = 'Je weet dat AI leert van data en niet denkt zoals een mens.';
const LD_7_1_C = 'Je kunt voorbeelden geven van AI die je elke dag gebruikt.';

const LD_7_2_A = 'Je kunt een voordeel en een gevaar van AI noemen.';
const LD_7_2_B = 'Je kunt kenmerken noemen waaraan je een AI-afbeelding kunt herkennen.';
const LD_7_2_C = 'Je weet waarom je geen persoonlijke gegevens deelt met AI.';

const LD_7_3_A = 'Je kunt uitleggen wat een chatbot is en drie bekende chatbots noemen.';
const LD_7_3_B = 'Je kunt een duidelijke prompt schrijven met opdracht, onderwerp, doelgroep en lengte.';
const LD_7_3_C = 'Je kunt het antwoord van een chatbot netjes verwerken in Word.';

const LD_7_4_A = 'Je weet wat hallucinatie bij een chatbot betekent.';
const LD_7_4_B = 'Je kunt controleren of het antwoord van een chatbot klopt.';
const LD_7_4_C = 'Je weet wat je met een chatbot wel en niet mag doen voor schoolwerk.';

const LD_7_5_A = 'Je kunt uitleggen hoe AI werkt en waar je op moet letten.';
const LD_7_5_B = 'Je kunt een prompt schrijven en het antwoord kritisch beoordelen.';

export default {
  '7.1': {
    learningGoals: [LD_7_1_A, LD_7_1_B, LD_7_1_C],
    theorie: [
      {
        keyTerms: ['gezichtsherkenning', 'artificial intelligence', 'computerprogramma'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Jill houdt haar telefoon voor haar gezicht en het scherm gaat open. Haar broer houdt dezelfde telefoon voor zijn gezicht en het scherm blijft dicht. Zit hier AI in? Leg uit hoe je dat ziet.</p>',
          '<p><strong>Antwoord.</strong> Ja, hier zit AI in. Stap 1: de telefoon moest leren hoe Jills gezicht eruitziet. Stap 2: dat leren gebeurde met veel foto\'s van haar gezicht. Stap 3: nu vergelijkt het toestel elk nieuw gezicht met wat het geleerd heeft. Stap 4: het gezicht van haar broer past daar niet bij, dus blijft het scherm dicht. Herkennen en dan beslissen is precies een taak die normaal alleen mensen kunnen. Dat heet gezichtsherkenning.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['machine learning', 'simuleert', 'voorspelling'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Rayan typt tegen een chatbot: ik ben zo verdrietig. De bot antwoordt: wat naar voor je, ik ben er voor je. Rayan zegt: die bot voelt echt met me mee. Heeft hij gelijk?</p>',
          '<p><strong>Antwoord.</strong> Nee. Kijk naar de vier dingen die jij wel hebt. Gevoelens: de bot wordt nergens verdrietig van. Bewustzijn: hij weet niet dat hij bestaat. Intuïtie: hij voelt niets aankomen. Creatief reageren: hij verzint niets nieuws. Wat gebeurde er dan wel? De bot heeft in miljoenen teksten gezien welke zin hier meestal op volgt. Hij geeft dus een voorspelling van het beste antwoord. Dat lijkt op meeleven, maar het is nadoen. Dat nadoen heet simuleren.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Kunstmatige intelligentie is een computerprogramma dat taken doet die normaal alleen mensen kunnen. Het leert van heel veel voorbeelden, en dat leren heet machine learning; denken doet het niet. Je gebruikt het elke dag, bijvoorbeeld in je tijdlijn, in filters en in de zoekbalk.</p>',
      keyTerms: ['kunstmatige intelligentie', 'machine learning']
    },
    vragen: [
      {
        prompt: 'Wat is kunstmatige intelligentie?',
        leerdoel: LD_7_1_A,
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Een robot van metaal die zelf kan lopen en praten.', correct: false, misconception: 'Denkt dat AI altijd een robot met een lichaam is.' },
          { text: 'Technologie waarmee computers taken doen die mensen doen.', correct: true, explanation: 'Denk aan leren, plannen en een beslissing nemen.' },
          { text: 'Een website waarop je alle antwoorden van de hele wereld kunt vinden.', correct: false, misconception: 'Verwart AI met een zoekmachine vol kant-en-klare antwoorden.' },
          { text: 'Een app die je eerst moet kopen voordat hij werkt.', correct: false, misconception: 'Denkt dat AI een los betaald programma is.' }
        ],
        feedback: 'AI is geen robot en geen website. Het is technologie die mensentaken overneemt.'
      },
      {
        prompt: 'AI is altijd een robot van metaal met armen en benen.',
        waar: false,
        leerdoel: LD_7_1_A,
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'AI is een computerprogramma. Je kunt dat programma wel in een robot stoppen.'
      },
      {
        prompt: 'Wat doet het algoritme achter jouw tijdlijn op TikTok?',
        leerdoel: LD_7_1_A,
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Het volgt een slimme volgorde van stappen en kiest jouw filmpjes.', correct: true, explanation: 'Hoe vaker jij iets bekijkt, hoe beter die stappen jou leren kennen.' },
          { text: 'Het laat aan iedereen in Nederland precies dezelfde filmpjes zien op die dag.', correct: false, misconception: 'Denkt dat er één tijdlijn is die voor iedereen gelijk is.' },
          { text: 'Het bewaart jouw filmpjes zodat je ze offline kunt kijken.', correct: false, misconception: 'Verwart aanbevelen met opslaan op je toestel.' },
          { text: 'Het maakt je telefoon sneller als je lang kijkt.', correct: false, misconception: 'Denkt dat het algoritme iets met de snelheid van je toestel doet.' }
        ],
        feedback: 'Een algoritme is een volgorde van stappen. Die rekent per persoon iets anders uit.'
      },
      {
        prompt: 'Een zelfrijdende auto slaat een fout op, zodat het de volgende keer beter gaat.',
        waar: true,
        leerdoel: LD_7_1_B,
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Precies. Leren van je fouten kan een AI-systeem net zo goed als jij.'
      },
      {
        prompt: 'Waarom zeggen we dat AI niet echt denkt?',
        leerdoel: LD_7_1_B,
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat AI alleen werkt als er internet is en dat is niet altijd zo.', correct: false, misconception: 'Denkt dat een internetverbinding iets zegt over denken.' },
          { text: 'Omdat AI te langzaam is om over een moeilijke vraag na te denken.', correct: false, misconception: 'Denkt dat denken een kwestie van snelheid is; AI is juist snel.' },
          { text: 'Omdat AI geen gevoelens en geen bewustzijn heeft en dus nadoet.', correct: true, explanation: 'AI simuleert menselijk gedrag; begrijpen doet het niet.' },
          { text: 'Omdat AI alleen sommen kan maken en verder niets kan.', correct: false, misconception: 'Denkt dat AI een rekenmachine is die geen taal aankan.' }
        ],
        feedback: 'AI mist gevoelens, bewustzijn en intuïtie. Het doet menselijk gedrag alleen maar na.'
      },
      {
        prompt: 'In welke rij zit in alle drie de dingen kunstmatige intelligentie?',
        leerdoel: LD_7_1_C,
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een rekenmachine, een tosti-ijzer en een fietsbel.', correct: false, misconception: 'Denkt dat elk apparaat met stroom AI bevat.' },
          { text: 'Een usb-stick, een printer en een muismat op je bureau.', correct: false, misconception: 'Verwart hardware zonder software met AI.' },
          { text: 'Een lampje, een oplader en een koptelefoon met een snoer.', correct: false, misconception: 'Denkt dat alles wat je op je device aansluit AI bevat.' },
          { text: 'Siri, de zoekbalk van Google en een filter op Snapchat.', correct: true, explanation: 'Alle drie leren ze van gegevens en kiezen ze zelf iets uit.' }
        ],
        feedback: 'Alexa, Siri, ChatGPT, de zoekbalk en filters zijn allemaal voorbeelden uit de les.'
      },
      {
        prompt: 'De zoekbalk van Google gebruikt geen AI, want die zoekt alleen woorden op.',
        waar: false,
        leerdoel: LD_7_1_C,
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'De zoekbalk vult jouw woorden al aan. Daarvoor is AI nodig, want hij voorspelt.'
      },
      {
        prompt: 'Noem drie systemen met AI die jij vandaag zelf gebruikt hebt. Schrijf er per systeem bij wat het voor jou deed.',
        type: 'open',
        leerdoel: LD_7_1_C,
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Vanochtend ging mijn telefoon open met gezichtsherkenning; hij herkende mijn gezicht. In de bus keek ik TikTok; de tijdlijn koos filmpjes over voetbal, want daar kijk ik altijd naar. Daarna zocht ik iets op in de zoekbalk van Google; hij vulde mijn zoekwoorden al aan voordat ik ze af had getypt.',
        nakijkpunten: [
          'Er staan drie systemen die uit de les komen of daar duidelijk op lijken.',
          'Bij elk systeem staat wat het voor de leerling deed, niet alleen de naam.',
          'De voorbeelden zijn van vandaag en uit het eigen gebruik van de leerling.'
        ],
        feedback: 'Kijk of je bij elk systeem echt opgeschreven hebt wat het deed. Alleen een naam is te weinig.'
      }
    ]
  },

  '7.2': {
    learningGoals: [LD_7_2_A, LD_7_2_B, LD_7_2_C],
    theorie: [
      {
        keyTerms: ['patronen', 'privacyprobleem', 'misleiding'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Een ziekenhuis laat AI meekijken met duizend scans per week. De artsen vinden dat handig. Toch maakt de gemeenteraad zich zorgen. Noem hier het voordeel en het gevaar, allebei in een zin.</p>',
          '<p><strong>Antwoord.</strong> Het voordeel: AI verwerkt veel sneller informatie dan een mens en vindt zo een klein vlekje dat een arts kan missen. Dat kan levens redden. Het gevaar: op zo\'n scan staan persoonlijke gegevens van duizend patiënten. Niemand ziet precies waar die gegevens blijven of wie ze nog meer bekijkt. Dat is een privacyprobleem. Let op: het is dezelfde techniek. Snel patronen zien levert hier het voordeel op, en het verzamelen van gegevens levert het gevaar op.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['AI-programma', 'kenmerken', 'nepbeeld'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Yara krijgt een foto doorgestuurd van een brand bij een school. Ze wil weten of het beeld echt is. Ze heeft dertig seconden. Wat doet ze, in stappen?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: ze zoomt in op de handen van de mensen en telt de vingers. Stap 2: ze kijkt naar de ogen; staan die raar of kijken ze twee kanten op? Stap 3: ze volgt een kraag of een mouw; loopt die vreemd over in de achtergrond? Stap 4: ze leest de tekst op een bord of een shirt; vormen die letters een echt woord? Stap 5: ze kijkt naar de achtergrond; buigen er lijnen of mist iemand een been? Yara vindt bij stap 4 letters die geen woord vormen. Ze stuurt de foto niet door en zegt erbij waarom niet.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>AI heeft een groot voordeel: het vindt razendsnel patronen, bijvoorbeeld een ziekte op een scan. Het bekendste gevaar heet een privacyprobleem: AI-systemen verzamelen gegevens over jou. Aan handen, ogen, kleding en tekst herken je een AI-beeld, en hoe echter die beelden worden, hoe meer ze fake news helpen.</p>',
      keyTerms: ['privacyprobleem', 'fake news']
    },
    vragen: [
      {
        prompt: 'Welk voordeel van AI noemt de les bij de dokter?',
        leerdoel: LD_7_2_A,
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'AI kan een ziekte opsporen in een scan en zo levens redden.', correct: true, explanation: 'AI verwerkt sneller informatie en is goed in het zoeken naar patronen.' },
          { text: 'AI kan een patiënt opereren zonder dat er nog een arts bij hoeft te zijn.', correct: false, misconception: 'Denkt dat AI het werk van de arts helemaal overneemt.' },
          { text: 'AI kan medicijnen thuisbezorgen bij mensen die ziek zijn.', correct: false, misconception: 'Verwart AI met bezorgdiensten.' },
          { text: 'AI kan bepalen wie er als eerste geholpen wordt.', correct: false, misconception: 'Denkt dat AI over de volgorde in de wachtkamer gaat.' }
        ],
        feedback: 'Snel patronen zoeken is waar AI goed in is. In een scan vindt het daardoor een klein vlekje.'
      },
      {
        prompt: 'Doordat computers steeds meer kunnen, verdwijnen sommige beroepen.',
        waar: true,
        leerdoel: LD_7_2_A,
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Niet iedereen is meer nodig voor werk dat een machine ook kan. Dat geeft onrust.'
      },
      {
        prompt: 'Wat bedoelen we met een privacyprobleem bij AI?',
        leerdoel: LD_7_2_A,
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Dat AI-systemen persoonlijke gegevens verzamelen zonder dat jij dat weet.', correct: true, explanation: 'Je ziet niet waar je gegevens blijven of wie ze nog meer bekijkt.' },
          { text: 'Dat je een wachtwoord nodig hebt voordat je een AI-systeem mag openen op school.', correct: false, misconception: 'Verwart privacy met inloggen.' },
          { text: 'Dat AI je scherm laat zien aan de mensen om je heen.', correct: false, misconception: 'Denkt dat privacy alleen over meekijken in de klas gaat.' },
          { text: 'Dat je AI alleen thuis mag gebruiken en niet op school.', correct: false, misconception: 'Verwart een schoolregel met een privacyprobleem.' }
        ],
        feedback: 'Het gaat om gegevens die worden verzameld terwijl jij het niet doorhebt.'
      },
      {
        prompt: 'Waar kijk je als eerste naar als je wilt weten of een foto door AI gemaakt is?',
        leerdoel: LD_7_2_B,
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Naar de datum die onder de foto staat op de website waar hij vandaan komt.', correct: false, misconception: 'Denkt dat een datum bewijst dat een foto echt is.' },
          { text: 'Naar het aantal likes, want een echte foto krijgt er meer.', correct: false, misconception: 'Denkt dat populariteit iets zegt over echtheid.' },
          { text: 'Naar de handen: tel de vingers, want zes vingers komt vaak voor.', correct: true, explanation: 'Handen, ogen en kleding zijn de drie kenmerken die de les zelf noemt.' },
          { text: 'Naar de grootte van het bestand op je telefoon.', correct: false, misconception: 'Denkt dat je aan de bestandsgrootte ziet wie de foto maakte.' }
        ],
        feedback: 'Handen, ogen en kleding verraden een AI-beeld het snelst. Zoom dus eerst in.'
      },
      {
        prompt: 'Een AI-beeld leunt op foto\'s van anderen, en daarom is er discussie of het wel mag.',
        waar: true,
        leerdoel: LD_7_2_B,
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'De maker van die foto\'s heeft er geen toestemming voor gegeven en krijgt er niets voor.'
      },
      {
        prompt: 'Je hebt op This Person Does Not Exist een gezicht gevonden dat niet klopt. Schrijf twee kenmerken op waaraan je dat ziet.',
        type: 'open',
        leerdoel: LD_7_2_B,
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Kenmerk 1: het linkeroor heeft een grote ring en het rechteroor helemaal niets, terwijl je allebei de oren ziet. Kenmerk 2: de kraag van het shirt loopt aan de rechterkant zomaar over in de wazige achtergrond. Er zit geen rand tussen de kleding en de lucht erachter.',
        nakijkpunten: [
          'Er staan twee kenmerken, geen algemene indruk zoals "het ziet er nep uit".',
          'Elk kenmerk zegt waar op het gezicht of de foto het te zien is.',
          'De kenmerken passen bij het rijtje uit de theorie: handen, ogen, kleding, tekst, sieraden of achtergrond.'
        ],
        feedback: 'Een goed kenmerk zegt waar je moet kijken. "Het ziet er raar uit" is nog geen bewijs.'
      },
      {
        prompt: 'Waarom helpt het fake news dat AI-plaatjes steeds echter worden?',
        leerdoel: LD_7_2_B,
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat een nepbeeld dat je niet doorhebt door heel veel mensen geloofd wordt.', correct: true, explanation: 'Mensen geloven een foto sneller dan een tekst, dus zo\'n beeld gaat hard rond.' },
          { text: 'Omdat mooie foto\'s hoger in de zoekresultaten van Google komen te staan.', correct: false, misconception: 'Denkt dat het probleem bij de zoekvolgorde zit.' },
          { text: 'Omdat AI-plaatjes minder ruimte innemen dan echte foto\'s.', correct: false, misconception: 'Denkt dat bestandsgrootte de verspreiding bepaalt.' },
          { text: 'Omdat kranten alleen nog AI-plaatjes mogen gebruiken.', correct: false, misconception: 'Denkt dat er een regel is die echte foto\'s verbiedt.' }
        ],
        feedback: 'Hoe echter het beeld, hoe minder mensen twijfelen. En juist die twijfel had het nieuws nodig.'
      },
      {
        prompt: 'Een chatbot vraagt naar je achternaam en je woonplaats. Wat doe je?',
        leerdoel: LD_7_2_C,
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Invullen, want dan kan de chatbot een beter antwoord op maat geven.', correct: false, misconception: 'Denkt dat persoonlijke gegevens het antwoord beter maken.' },
          { text: 'Alleen je woonplaats invullen, want dat is niet zo persoonlijk.', correct: false, misconception: 'Denkt dat een woonplaats geen persoonlijk gegeven is.' },
          { text: 'Niets invullen en gewoon je vraag stellen zonder die gegevens.', correct: true, explanation: 'Je weet niet wie er aan de andere kant zit of hoe je gegevens bewaard worden.' },
          { text: 'De naam van een klasgenoot invullen in plaats van die van jezelf.', correct: false, misconception: 'Denkt dat gegevens van iemand anders wel mogen.' }
        ],
        feedback: 'Ook de gegevens van iemand anders deel je niet. Die kunnen onbedoeld in verkeerde handen komen.'
      },
      {
        prompt: 'Terugblik 7.1. Een chatbot kan later leren van de tekst die jij hem stuurt.',
        waar: true,
        leerdoel: LD_7_1_B,
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Daarom is het extra belangrijk wat jij intypt. Wat jij schrijft, is voer voor het systeem.'
      },
      {
        prompt: 'Terugblik 7.1. Waarom noemen we AI een computerprogramma en geen robot?',
        leerdoel: LD_7_1_A,
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat een robot altijd duurder is dan een programma dat je downloadt.', correct: false, misconception: 'Denkt dat de prijs het verschil maakt.' },
          { text: 'Omdat robots niet bestaan en alleen in films voorkomen.', correct: false, misconception: 'Denkt dat looprobots verzonnen zijn.' },
          { text: 'Omdat een robot geen stroom nodig heeft en een programma wel.', correct: false, misconception: 'Verwart stroomgebruik met het verschil software-hardware.' },
          { text: 'Omdat AI software is die je ook in een robot kunt stoppen.', correct: true, explanation: 'De robot is de verpakking; de AI zit erin als software.' }
        ],
        feedback: 'ASIMO kon lopen en traplopen. Zelf bedenken wat hij moest doen, dat kon hij niet.'
      }
    ]
  },

  '7.3': {
    learningGoals: [LD_7_3_A, LD_7_3_B, LD_7_3_C],
    theorie: [
      {
        keyTerms: ['chatbot', 'OpenAI', 'TalkAI'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Milan chat op een webshop over zijn pakket. Hij krijgt drie keer hetzelfde antwoord terug, hoe hij zijn vraag ook stelt. Daarna vraagt hij thuis aan TalkAI hetzelfde en krijgt wel een passend antwoord. Met welke twee soorten had hij te maken?</p>',
          '<p><strong>Antwoord.</strong> Op de webshop zat een simpele chatbot. Die geeft vaste antwoorden en kan niet meedenken. Daarom bleef het antwoord hetzelfde. Thuis gebruikte hij een AI-chatbot. Die begrijpt wat jij bedoelt en denkt met je mee. Bekende AI-chatbots zijn ChatGPT, TalkAI, Google Gemini en Microsoft Copilot. Zo herken je het verschil: krijg je drie keer precies dezelfde zin terug, dan zit er waarschijnlijk geen AI achter.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['goede prompt', 'doelgroep', 'lengte', 'dikgedrukt'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Noa typt: vertel wat over paarden. Ze krijgt drie pagina\'s in moeilijke taal. Verbeter haar opdracht en laat zien waar de vier onderdelen zitten.</p>',
          '<p><strong>Antwoord.</strong> Verbeterde opdracht: leg in makkelijke taal uit hoe je een paard verzorgt, in 6 zinnen, voor een leerling van 12 jaar. Nu de vier onderdelen los. Opdracht: uitleggen. Onderwerp: hoe je een paard verzorgt. Doelgroep: een leerling van 12 jaar. Lengte: 6 zinnen. Extra staat er nog de stijl bij: makkelijke taal. In de oude versie stond alleen het onderwerp, en dat was nog vaag ook. "Vertel wat" is precies zo\'n vaag woord dat je moet vermijden.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een chatbot is een programma waarmee je via tekst praat, zoals ChatGPT, TalkAI of Google Gemini. Je geeft hem een opdracht met vier onderdelen: opdracht, onderwerp, doelgroep en lengte. Het antwoord zet je in Word met een titel, een kop, Arial of Calibri, grootte 11 of 12 en de begrippen vet, opgeslagen als Chatbot_JouwVoornaam.docx.</p>',
      keyTerms: ['doelgroep', 'Word']
    },
    vragen: [
      {
        prompt: 'Wat is een chatbot?',
        leerdoel: LD_7_3_A,
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Een medewerker van een bedrijf die de hele dag chatberichten beantwoordt voor klanten.', correct: false, misconception: 'Denkt dat er altijd een mens meetypt in het chatvenster.' },
          { text: 'Een computerprogramma waarmee je via tekst kunt praten.', correct: true, explanation: 'Je stelt een vraag of geeft een opdracht en het programma antwoordt.' },
          { text: 'Een app waarmee je met je klasgenoten kunt bellen.', correct: false, misconception: 'Verwart een chatbot met een berichtenapp.' },
          { text: 'Een spelletje waarin je tegen de computer speelt.', correct: false, misconception: 'Denkt dat een chatbot een game is.' }
        ],
        feedback: 'Het is een programma, geen mens. Het voorspelt wat het beste antwoord is.'
      },
      {
        prompt: 'ChatGPT is gemaakt door het bedrijf OpenAI en gebruikt een model dat GPT heet.',
        waar: true,
        leerdoel: LD_7_3_A,
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'GPT-3.5 is gratis en GPT-4 kost meestal geld. Die versienummers veranderen elk jaar.'
      },
      {
        prompt: 'Welke drie namen staan alle drie in het rijtje bekende AI-chatbots?',
        leerdoel: LD_7_3_A,
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Outlook, Verkenner en OneDrive.', correct: false, misconception: 'Verwart schoolprogramma\'s uit hoofdstuk 1 en 2 met chatbots.' },
          { text: 'SOMtoday, ItsLearning en Canva.', correct: false, misconception: 'Denkt dat elk schoolprogramma een chatbot is.' },
          { text: 'Snapchat, Spotify en YouTube die je elke dag op je telefoon opent.', correct: false, misconception: 'Denkt dat elke app met AI erin meteen een chatbot is.' },
          { text: 'Google Gemini, Microsoft Copilot en Meta AI.', correct: true, explanation: 'Gemini heette vroeger Bard, Copilot zit in Word en Edge, Meta AI in Instagram.' }
        ],
        feedback: 'ChatGPT, TalkAI, Google Gemini, Microsoft Copilot en Meta AI staan in de les.'
      },
      {
        prompt: 'Welke van deze opdrachten bevat alle vier de onderdelen?',
        leerdoel: LD_7_3_B,
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Vertel eens wat over gezond eten, maar niet te veel en niet te ingewikkeld graag.', correct: false, misconception: 'Denkt dat "niet te veel" een lengte is; het blijft een vaag woord.' },
          { text: 'Schrijf een kort stukje over voetbal voor de onderbouw.', correct: false, misconception: 'Ziet "kort" aan voor een lengte en mist de opdracht.' },
          { text: 'Leg uit hoe de VAR werkt, in 5 zinnen, voor een leerling van 12.', correct: true, explanation: 'Opdracht: uitleggen. Onderwerp: de VAR. Doelgroep: 12 jaar. Lengte: 5 zinnen.' },
          { text: 'Maak een lijstje met tien dieren die in Nederland leven.', correct: false, misconception: 'Mist de doelgroep en denkt dat drie onderdelen genoeg zijn.' }
        ],
        feedback: 'Loop de vier onderdelen altijd af: opdracht, onderwerp, doelgroep en lengte.'
      },
      {
        prompt: 'Een duidelijke opdracht levert een bruikbaarder antwoord op dan een vage opdracht.',
        waar: true,
        leerdoel: LD_7_3_B,
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Vage woorden als "doe maar iets" leveren een vaag antwoord op. Zeg precies wat je wilt.'
      },
      {
        prompt: 'Je hebt het antwoord van de chatbot in Word geplakt. Wat doe je daarna met de opmaak?',
        leerdoel: LD_7_3_C,
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je zet er een titel en een kop boven en kiest Arial of Calibri.', correct: true, explanation: 'Daarna zet je de grootte op 11 of 12 en maak je de begrippen vet.' },
          { text: 'Je zet alle tekst in hoofdletters, want dan valt hij beter op bij je docent.', correct: false, misconception: 'Denkt dat opvallen hetzelfde is als netjes opmaken.' },
          { text: 'Je zet de tekstgrootte op 20 zodat het document langer lijkt.', correct: false, misconception: 'Denkt dat opmaak bedoeld is om ruimte te vullen.' },
          { text: 'Je laat de opmaak zoals hij is, want die komt van de chatbot.', correct: false, misconception: 'Denkt dat de chatbot de opmaak al goed heeft gezet.' }
        ],
        feedback: 'Titel, kop, lettertype, grootte en begrippen vet: die vijf stappen ken je uit hoofdstuk 4.'
      },
      {
        prompt: 'Weet je niet welke woorden de begrippen zijn, dan kun je dat aan de chatbot vragen.',
        waar: true,
        leerdoel: LD_7_3_C,
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Vraag hem de moeilijke woorden uit de tekst te halen. Die maak jij daarna vet.'
      },
      {
        prompt: 'Onder welke naam sla je jouw Word-document van deze paragraaf op? Schrijf de naam op en leg uit wat er in het document moet staan.',
        type: 'open',
        leerdoel: LD_7_3_C,
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Mijn bestand heet Chatbot_Devi.docx, dus met mijn eigen voornaam erin. Bovenaan staat een titel. Daaronder staat de kop Opdracht 1 - Wat is een chatbot? met het antwoord van TalkAI eronder. Daarna staat de kop Opdracht 2 - Mijn eigen prompt met mijn eigen opdracht en het antwoord. Alles staat in Calibri 12 en de begrippen zijn vet.',
        nakijkpunten: [
          'De bestandsnaam is Chatbot_ met de eigen voornaam en eindigt op .docx.',
          'Opdracht 1 en opdracht 2 staan er allebei in, elk met een eigen kop erboven.',
          'De opmaak wordt genoemd: lettertype, tekstgrootte en begrippen vet.'
        ],
        feedback: 'Controleer je bestandsnaam letterlijk. Een onderstreepje vergeten is zo gebeurd.'
      },
      {
        prompt: 'Terugblik 7.2. Waarom upload je geen foto van jezelf naar een chatbot?',
        leerdoel: LD_7_2_C,
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat het uploaden van een foto veel data van je bundel kost.', correct: false, misconception: 'Denkt dat het bezwaar over datagebruik gaat.' },
          { text: 'Omdat de chatbot ervan leert en die foto later kan gebruiken.', correct: true, explanation: 'Je voedt hem dan met gegevens die van jou of van iemand anders zijn.' },
          { text: 'Omdat een chatbot alleen tekst kan lezen en geen plaatjes.', correct: false, misconception: 'Denkt dat het technisch niet kan; veel chatbots kunnen dat wel.' },
          { text: 'Omdat je foto dan niet meer op je eigen telefoon staat.', correct: false, misconception: 'Denkt dat uploaden hetzelfde is als verplaatsen.' }
        ],
        feedback: 'Achter de chatbot zit een bedrijf met mensen die bij jouw gegevens kunnen.'
      },
      {
        prompt: 'Terugblik 7.1. AI geeft geen zekerheid, maar een voorspelling van het beste antwoord.',
        waar: true,
        leerdoel: LD_7_1_B,
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        feedback: 'Een voorspelling klopt vaak, maar niet altijd. Daarom kijk jij het antwoord zelf na.'
      }
    ]
  },

  '7.4': {
    learningGoals: [LD_7_4_A, LD_7_4_B, LD_7_4_C],
    theorie: [
      {
        keyTerms: ['hallucinatie', 'getraind', 'tweede bron'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sem vraagt: wat is het verschil tussen een dolfijn en een haai? Hij krijgt acht vlotte zinnen. Er staat in dat een dolfijn kieuwen heeft. Wat is hier gebeurd, en wat doet Sem nu?</p>',
          '<p><strong>Antwoord.</strong> Wat er gebeurde: de bot wist het niet zeker en vulde het gat op. Zo\'n verzonnen stuk heet hallucinatie. Wat Sem doet, in vier stappen. Stap 1: hij streept de namen, jaartallen en getallen aan. Stap 2: hij kiest "kieuwen" en zoekt dat op bij een tweede bron, bijvoorbeeld Schooltv. Stap 3: hij vergelijkt; daar staat dat een dolfijn een longademhaling heeft en dus geen kieuwen. Stap 4: hij streept de zin weg en zet de goede informatie erbij. Dat kostte hem twee minuten.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['eigen woorden', 'werkstuk', 'context'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Lisa moet een werkstuk over gezond eten maken. Ze vraagt de chatbot om acht zinnen en plakt die zo in haar werkstuk. Waarom mag dat niet, en hoe doet ze het wel goed?</p>',
          '<p><strong>Antwoord.</strong> Dat mag niet, want een werkstuk moet je altijd zelf schrijven. Bovendien zien docenten het vaak: AI schrijft op een manier die minder menselijk klinkt. Zo doet Lisa het wel goed, in vier stappen. Stap 1: ze leest het antwoord helemaal door en legt het scherm weg. Stap 2: ze schrijft uit haar hoofd op wat ze onthouden heeft. Stap 3: ze kijkt terug of ze niets vergeten is en vult aan. Stap 4: ze controleert of er geen zin letterlijk hetzelfde is gebleven. Nu staat het in haar eigen woorden en heeft ze er ook nog van geleerd.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Verzint een chatbot iets omdat hij het niet zeker weet, dan heet dat hallucinatie. Blijf dus kritisch: je zoekt namen, jaartallen en getallen op bij een andere bron. Een werkstuk schrijf je altijd zelf: hulp vragen mag, letterlijk plakken niet.</p>',
      keyTerms: ['hallucinatie', 'kritisch']
    },
    vragen: [
      {
        prompt: 'Een chatbot die iets verzint omdat hij het antwoord niet zeker weet, hallucineert.',
        waar: true,
        leerdoel: LD_7_4_A,
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Hij zegt namelijk nooit: dit weet ik niet. Hij vult het gat gewoon op.'
      },
      {
        prompt: 'Waarop is een chatbot getraind?',
        leerdoel: LD_7_4_A,
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Op de berichten die jij en je klasgenoten in de klas naar elkaar sturen.', correct: false, misconception: 'Denkt dat een chatbot meeleest in je eigen apps.' },
          { text: 'Op alle filmpjes die er op YouTube en TikTok staan.', correct: false, misconception: 'Denkt dat een tekstchatbot van video leert.' },
          { text: 'Op enorme hoeveelheden tekst uit boeken, websites en artikelen.', correct: true, explanation: 'Daaruit leert hij wat waarschijnlijk een goed antwoord is.' },
          { text: 'Op één grote encyclopedie die elke dag wordt bijgewerkt.', correct: false, misconception: 'Denkt dat er één bron met altijd actuele feiten achter zit.' }
        ],
        feedback: 'Hij leert uit heel veel tekst. Daarom kan hij ook oude informatie geven.'
      },
      {
        prompt: 'Elke chatbot leest de internetpagina\'s op het moment dat jij je vraag stelt.',
        waar: false,
        leerdoel: LD_7_4_A,
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Een chatbot met zoekfunctie doet dat wel. Zonder die functie werkt hij uit zijn training van eerder.'
      },
      {
        prompt: 'Je wilt een jaartal uit een chatbotantwoord controleren. Wat doe je?',
        leerdoel: LD_7_4_B,
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je vraagt de chatbot of hij het zeker weet en gelooft zijn antwoord.', correct: false, misconception: 'Denkt dat de bot zichzelf kan controleren; hij klinkt altijd zeker.' },
          { text: 'Je stelt dezelfde vraag nog een keer en kijkt of het antwoord gelijk blijft.', correct: false, misconception: 'Denkt dat hetzelfde antwoord bewijst dat het klopt.' },
          { text: 'Je vraagt het aan je klasgenoot die naast je zit.', correct: false, misconception: 'Denkt dat een mening van iemand anders een bron is.' },
          { text: 'Je zoekt het jaartal op bij een andere website en vergelijkt.', correct: true, explanation: 'Een tweede bron is de enige manier om echt bewijs te krijgen.' }
        ],
        feedback: 'Controleren doe je buiten de chatbot om. Vraag het hem niet nog een keer.'
      },
      {
        prompt: 'Welke drie controlevragen zet je van de les onder een chatbotantwoord?',
        leerdoel: LD_7_4_B,
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Wie schreef dit? Wanneer schreef hij het? En hoeveel woorden zijn het?', correct: false, misconception: 'Verwart de controlevragen met het beoordelen van een schrijver.' },
          { text: 'Klopt dit helemaal? Hoe weet je dat? Kun je dit op een andere website controleren?', correct: true, explanation: 'Die derde vraag is de belangrijkste, want daar lever je bewijs.' },
          { text: 'Is dit lang genoeg? Staat er een titel boven? En is het lettertype goed?', correct: false, misconception: 'Verwart controleren van de inhoud met de opmaak in Word.' },
          { text: 'Vind ik dit leuk? Snap ik dit? En wil ik hier meer over weten?', correct: false, misconception: 'Denkt dat controleren over je eigen mening gaat.' }
        ],
        feedback: 'Klopt dit, hoe weet je dat, en kun je het ergens anders nakijken. Die drie.'
      },
      {
        prompt: 'Als een chatbot met veel namen en getallen antwoordt, weet je dat het antwoord klopt.',
        waar: false,
        leerdoel: LD_7_4_B,
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Juist die namen en getallen streep je aan. Dat zijn de stukken die je moet nakijken.'
      },
      {
        prompt: 'Wat mag je wel met een chatbot voor je schoolwerk?',
        leerdoel: LD_7_4_C,
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Hem je werkstuk laten schrijven en er alleen je naam boven zetten.', correct: false, misconception: 'Denkt dat het jouw werk wordt zodra je naam erboven staat.' },
          { text: 'Hem om uitleg vragen en het daarna in je eigen woorden overschrijven.', correct: true, explanation: 'Zo leer je er ook van, en dat merk je bij de toets.' },
          { text: 'Zijn antwoord letterlijk kopiëren en er zelf een titel bij bedenken.', correct: false, misconception: 'Denkt dat een eigen titel het kopiëren goedmaakt.' },
          { text: 'Zijn antwoord door een andere chatbot laten herschrijven.', correct: false, misconception: 'Denkt dat herschrijven door AI hetzelfde is als eigen woorden.' }
        ],
        feedback: 'Hulp vragen mag, je werk laten maken niet. Het verschil zit in wie het opschrijft.'
      },
      {
        prompt: 'Docenten kunnen vaak zien dat een tekst door AI geschreven is.',
        waar: true,
        leerdoel: LD_7_4_C,
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'AI schrijft op een manier die minder menselijk klinkt. Ook komen er steeds meer controlesystemen.'
      },
      {
        prompt: 'Leg in je eigen woorden uit hoe je een tekst van een chatbot omzet naar je eigen woorden. Noem de vier stappen uit de les.',
        type: 'open',
        leerdoel: LD_7_4_C,
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Stap 1: ik lees het antwoord helemaal door en leg daarna mijn scherm weg. Stap 2: ik schrijf uit mijn hoofd op wat ik onthouden heb. Stap 3: ik kijk terug in het antwoord of ik niets belangrijks vergeten ben en vul dat aan. Stap 4: ik controleer of er geen zin letterlijk hetzelfde is gebleven als bij de chatbot. Daarna zet ik de Word-opmaak erop: titel, kop, lettertype, grootte en begrippen vet.',
        nakijkpunten: [
          'De vier stappen staan er alle vier in en in de goede volgorde.',
          'Bij stap 1 staat dat het scherm weggelegd wordt; dat is de kern van de aanpak.',
          'Bij stap 4 staat dat gecontroleerd wordt op letterlijk overgenomen zinnen.'
        ],
        feedback: 'Het scherm wegleggen is de belangrijkste stap. Zonder dat schrijf je toch over.'
      },
      {
        prompt: 'Terugblik 7.3. Welke vier onderdelen horen er in een opdracht aan een chatbot?',
        leerdoel: LD_7_3_B,
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Titel, lettertype, tekstgrootte en de begrippen die je vet maakt.', correct: false, misconception: 'Verwart de onderdelen van de opdracht met de Word-opmaak.' },
          { text: 'Naam, klas, vak en de datum van vandaag erboven.', correct: false, misconception: 'Denkt dat je jezelf moet voorstellen aan de chatbot.' },
          { text: 'Vraag, antwoord, controle en de bron waar je het nakeek.', correct: false, misconception: 'Verwart de opbouw van de opdracht met het controleren achteraf.' },
          { text: 'Opdracht, onderwerp, doelgroep en lengte.', correct: true, explanation: 'Taal, stijl en een rol mag je er als extra bij zetten.' }
        ],
        feedback: 'Dat rijtje van vier ken je uit 7.3. Leer het uit je hoofd, dan gaat het snel.'
      },
      {
        prompt: 'Terugblik 7.2. Een verzonnen zin in een antwoord en een zesde vinger op een foto komen allebei doordat AI voorspelt in plaats van weet.',
        waar: true,
        leerdoel: LD_7_2_B,
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'reflecteren',
        feedback: 'Mooi verband. In tekst en in beeld gokt het systeem wat er waarschijnlijk hoort te staan.'
      }
    ]
  },

  '7.5': {
    learningGoals: [LD_7_5_A, LD_7_5_B],
    theorie: [
      {
        keyTerms: ['AI-geletterdheid', 'patronen', 'gewoonte'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Bilal zegt: AI is gevaarlijk. Sarah zegt: AI is juist heel handig. Wie heeft er gelijk? Leg uit met een voorbeeld uit dit hoofdstuk.</p>',
          '<p><strong>Antwoord.</strong> Ze hebben allebei half gelijk, en dat is geen toeval. Het is dezelfde techniek. AI is razendsnel in het zoeken naar patronen. Dat helpt de arts die een vlekje op een scan zoekt: het voordeel van Sarah. Precies datzelfde patroonzoeken maakt ook het gezicht op This Person Does Not Exist: het gevaar van Bilal. Je kunt het voordeel dus niet aanzetten en het gevaar uitzetten. Wat je wel kunt: scherp vragen en kritisch nalezen. Die twee samen heten AI-geletterdheid.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['promptlogboek', 'Kennisnet', 'AI-dossier'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Fenna gebruikte vanochtend een chatbot voor aardrijkskunde. Ze wil dat netjes vastleggen. Schrijf haar drie regels voor het promptlogboek uit.</p>',
          '<p><strong>Antwoord.</strong> Regel 1, de opdracht die ze gaf: leg uit hoe een vulkaan uitbarst, in 5 zinnen, voor een leerling van 12 jaar. Regel 2, het antwoord in het kort: vijf zinnen over magma dat omhoog komt door druk in de aardkorst. Regel 3, wat ze ermee deed: herschreven in eigen woorden en één zin over de temperatuur weggehaald, want die kon ze bij een tweede bron niet terugvinden. Die derde regel is de belangrijkste. Daar staat namelijk waar haar eigen werk begint.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>In deze toets laat je zien wat je over AI weet en hoe je ermee omgaat. Scherp vragen en kritisch nalezen horen bij elkaar; samen heet dat AI-geletterdheid. Je bewijsstukken zet je in je AI-dossier in OneDrive, met een promptlogboek waarin per opdracht staat wat je vroeg, kreeg en deed.</p>',
      keyTerms: ['AI-geletterdheid', 'promptlogboek']
    },
    vragen: [
      {
        prompt: 'Welke omschrijving van kunstmatige intelligentie is juist?',
        leerdoel: LD_7_1_A,
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een machine met armen en benen die zelfstandig door een gebouw kan lopen.', correct: false, misconception: 'Blijft bij het robotbeeld uit 7.1.' },
          { text: 'Een programma dat werk doet waarvoor je normaal een mens nodig hebt.', correct: true, explanation: 'Denk aan leren, plannen en beslissingen nemen.' },
          { text: 'Een spelcomputer die steeds moeilijker wordt naarmate je beter speelt.', correct: false, misconception: 'Denkt dat elk oplopend niveau in een game AI is.' },
          { text: 'Een netwerk waarmee computers gegevens naar elkaar sturen.', correct: false, misconception: 'Verwart AI met het internet uit hoofdstuk 2.' }
        ],
        feedback: 'AI neemt taken over die normaal alleen mensen kunnen. Het lichaam doet er niet toe.'
      },
      {
        prompt: 'AI leert doordat het heel veel voorbeelden krijgt en daar patronen in vindt.',
        waar: true,
        leerdoel: LD_7_1_B,
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Dat leren van voorbeelden heet machine learning. Daar zit geen begrip bij.'
      },
      {
        prompt: 'Rico opent zijn telefoon met zijn gezicht en kijkt daarna filmpjes in zijn tijdlijn. Hoe vaak gebruikte hij AI?',
        leerdoel: LD_7_1_C,
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Nul keer, want AI zit alleen in chatbots zoals ChatGPT en TalkAI.', correct: false, misconception: 'Denkt dat AI hetzelfde is als een chatbot.' },
          { text: 'Eén keer, alleen bij het openen van zijn telefoon.', correct: false, misconception: 'Herkent gezichtsherkenning wel, maar de tijdlijn niet.' },
          { text: 'Twee keer, bij het openen en bij de tijdlijn.', correct: true, explanation: 'Gezichtsherkenning en de gekozen tijdlijn draaien allebei op AI.' },
          { text: 'Eén keer, alleen bij het kijken van de filmpjes.', correct: false, misconception: 'Herkent de tijdlijn wel, maar gezichtsherkenning niet.' }
        ],
        feedback: 'AI zit in veel meer dan chatbots. Vaak merk je er niets van.'
      },
      {
        prompt: 'Noem een voordeel van AI dat de les geeft.',
        leerdoel: LD_7_2_A,
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een zoekmachine geeft je snel het juiste antwoord op je vraag.', correct: true, explanation: 'AI verwerkt sneller informatie dan een mens en vindt sneller patronen.' },
          { text: 'Je telefoon gaat langer mee als er AI op staat geïnstalleerd.', correct: false, misconception: 'Denkt dat AI iets met de accuduur doet.' },
          { text: 'Je hoeft nooit meer zelf huiswerk te maken als je AI gebruikt.', correct: false, misconception: 'Denkt dat het overnemen van schoolwerk een voordeel is.' },
          { text: 'Alle apps op je telefoon worden gratis zodra er AI in zit.', correct: false, misconception: 'Denkt dat AI iets met de prijs van apps te maken heeft.' }
        ],
        feedback: 'De les noemt de arts, je muziek-app, de zoekmachine en de filters op je foto\'s.'
      },
      {
        prompt: 'Aan welke drie dingen zie je volgens de les meestal dat een afbeelding door AI gemaakt is?',
        leerdoel: LD_7_2_B,
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Aan de kleuren, de scherpte en de grootte van het bestand.', correct: false, misconception: 'Denkt dat de beeldkwaliteit het verraadt.' },
          { text: 'Aan de naam van het bestand en de datum van de foto.', correct: false, misconception: 'Denkt dat bestandsgegevens bewijs leveren.' },
          { text: 'Aan de handen, de ogen en de kleding op de foto.', correct: true, explanation: 'Zes vingers, rare ogen en kleding die vreemd overloopt zijn de drie uit de les.' },
          { text: 'Aan het aantal mensen dat op de afbeelding te zien is.', correct: false, misconception: 'Denkt dat AI geen groepen kan maken.' }
        ],
        feedback: 'Handen, ogen en kleding. Tekst, sieraden en achtergrond helpen ook.'
      },
      {
        prompt: 'Je adres en telefoonnummer mag je rustig aan een chatbot geven, want dat is een programma.',
        waar: false,
        leerdoel: LD_7_2_C,
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Achter dat programma zit een bedrijf met mensen. Je weet niet waar je gegevens blijven.'
      },
      {
        prompt: 'Je zit op een webshop en de chat geeft drie keer precies hetzelfde antwoord. Wat voor chatbot is dit?',
        leerdoel: LD_7_3_A,
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een AI-chatbot die met je meedenkt, maar even geen internet heeft.', correct: false, misconception: 'Denkt dat een storing verklaart waarom het antwoord hetzelfde blijft.' },
          { text: 'Een medewerker van de webshop die het druk heeft met andere klanten.', correct: false, misconception: 'Denkt dat er een mens meetypt.' },
          { text: 'Een zoekmachine die de website van de webshop doorzoekt.', correct: false, misconception: 'Verwart een chatvenster met een zoekfunctie.' },
          { text: 'Een simpele chatbot met vaste antwoorden.', correct: true, explanation: 'Zulke bots kunnen niet meedenken en herhalen hun standaardzin.' }
        ],
        feedback: 'De les noemt twee soorten: vaste antwoorden of echt meedenken. Dit was de eerste.'
      },
      {
        prompt: 'Welke opdracht aan een chatbot is het duidelijkst?',
        leerdoel: LD_7_3_B,
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Maak een lijstje van 5 tips om gitaar te leren, voor een beginner van 12.', correct: true, explanation: 'Opdracht, onderwerp, doelgroep en lengte zitten er alle vier in.' },
          { text: 'Doe maar iets met muziek, ik hoor het wel wat je ervan maakt vandaag.', correct: false, misconception: 'Denkt dat de bot zelf wel invult wat je bedoelt.' },
          { text: 'Vertel wat over muziek, maar hou het lekker kort alsjeblieft.', correct: false, misconception: 'Ziet "kort" aan voor een lengte en mist de doelgroep.' },
          { text: 'Schrijf iets moois over gitaarspelen voor de eerste klas.', correct: false, misconception: 'Mist een concrete opdracht en een lengte.' }
        ],
        feedback: 'Tel de onderdelen: opdracht, onderwerp, doelgroep, lengte. Alle vier aanwezig? Dan is hij goed.'
      },
      {
        prompt: 'Onder welke naam sla je het Word-document van dit hoofdstuk op?',
        leerdoel: LD_7_3_C,
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Chatbot_JouwVoornaam.docx, dus met je eigen voornaam erin.', correct: true, explanation: 'Zo ziet je docent meteen van wie het bestand is.' },
          { text: 'Werkstuk.docx, want zo weet je zelf welk bestand het is.', correct: false, misconception: 'Denkt dat een algemene naam genoeg is; de docent ziet dan niets.' },
          { text: 'Opdracht1.docx, want je begint met de eerste opdracht.', correct: false, misconception: 'Denkt dat elk opdrachtnummer een eigen bestand krijgt.' },
          { text: 'DigitaleGeletterdheidHoofdstuk7Klas1.docx met de naam van het vak erin.', correct: false, misconception: 'Denkt dat de vaknaam belangrijker is dan de eigen naam.' }
        ],
        feedback: 'Voornaam in de bestandsnaam. Alle vijf de opdrachten komen in datzelfde document.'
      },
      {
        prompt: 'Hallucinatie betekent dat een chatbot iets verzint als hij het niet zeker weet.',
        waar: true,
        leerdoel: LD_7_4_A,
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Hij vult het gat op in plaats van te zeggen dat hij het niet weet.'
      },
      {
        prompt: 'Wat is de beste eerste stap om te controleren of een antwoord klopt?',
        leerdoel: LD_7_4_B,
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Het antwoord hardop voorlezen aan iemand anders in de klas.', correct: false, misconception: 'Denkt dat voorlezen fouten zichtbaar maakt.' },
          { text: 'De namen, jaartallen en getallen in het antwoord aanstrepen.', correct: true, explanation: 'Dat zijn de stukken die je daarna bij een tweede bron opzoekt.' },
          { text: 'Kijken of het antwoord netjes is opgemaakt en goed leest.', correct: false, misconception: 'Verwart de vorm van het antwoord met de inhoud.' },
          { text: 'De chatbot vragen om hetzelfde antwoord nog een keer te geven.', correct: false, misconception: 'Denkt dat herhaling van de bot bewijs oplevert.' }
        ],
        feedback: 'Eerst aanstrepen, dan opzoeken, dan vergelijken, dan verbeteren. Vier stappen.'
      },
      {
        prompt: 'Wat mag je niet met een chatbot doen voor school?',
        leerdoel: LD_7_4_C,
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Hem om uitleg vragen bij een som die je niet snapt.', correct: false, misconception: 'Denkt dat hulp vragen verboden is.' },
          { text: 'Hem de moeilijke begrippen uit een tekst laten halen.', correct: false, misconception: 'Denkt dat elke hulp bij opmaak ook verboden is.' },
          { text: 'Zijn antwoord letterlijk in je werkstuk plakken.', correct: true, explanation: 'Een werkstuk schrijf je altijd zelf; hulp vragen mag wel.' },
          { text: 'Hem vragen om een voorbeeld bij een onderwerp waar je over leest.', correct: false, misconception: 'Denkt dat een voorbeeld vragen niet mag.' }
        ],
        feedback: 'De grens ligt bij wie het opschrijft. Hulp vragen mag, je werk laten maken niet.'
      },
      {
        prompt: 'Welke twee dingen vertel je als iemand vraagt hoe AI werkt?',
        leerdoel: LD_7_5_A,
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Dat AI van heel veel voorbeelden leert en niets van zijn antwoord begrijpt.', correct: true, explanation: 'Leren van voorbeelden en niet begrijpen zijn de twee kernpunten uit 7.1.' },
          { text: 'Dat AI heel snel is en daarom nooit fouten kan maken bij een vraag.', correct: false, misconception: 'Denkt dat snelheid betekent dat het altijd klopt.' },
          { text: 'Dat AI alles op internet leest terwijl jij op je antwoord wacht.', correct: false, misconception: 'Denkt dat een chatbot live meeleest op websites.' },
          { text: 'Dat AI gevoelens heeft en daarom met je meedenkt.', correct: false, misconception: 'Denkt dat een menselijk klinkend antwoord op gevoel wijst.' }
        ],
        feedback: 'Leren van voorbeelden en niets begrijpen. Die twee samen leggen AI het beste uit.'
      },
      {
        prompt: 'Wat schrijf je op regel 3 van je promptlogboek?',
        leerdoel: LD_7_5_B,
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De naam van de chatbot die je gebruikt hebt en het tijdstip erbij.', correct: false, misconception: 'Denkt dat het logboek over de bot gaat en niet over jouw keuze.' },
          { text: 'De opdracht die je gaf, precies zoals je hem hebt ingetypt.', correct: false, misconception: 'Verwisselt regel 3 met regel 1.' },
          { text: 'Het antwoord dat je kreeg, kort samengevat in een paar woorden.', correct: false, misconception: 'Verwisselt regel 3 met regel 2.' },
          { text: 'Wat je met het antwoord gedaan hebt: overgenomen, herschreven of weggegooid.', correct: true, explanation: 'Daar staat jouw eigen keuze in, en dus waar jouw werk begint.' }
        ],
        feedback: 'Regel 3 is de belangrijkste. Daar laat je zien waar de machine ophield en jij begon.'
      },
      {
        prompt: 'Kunstmatige intelligentie is een computerprogramma en geen wezen van metaal.',
        waar: true,
        leerdoel: LD_7_1_A,
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Je kunt zo\'n programma wel in een robot stoppen. De robot is dan alleen de verpakking.'
      },
      {
        prompt: 'Een chatbot geeft een antwoord dat heel menselijk klinkt. Wat gebeurt daar?',
        leerdoel: LD_7_1_B,
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'reflecteren',
        options: [
          { text: 'Hij voelt mee, want hij heeft geleerd hoe verdriet en blijdschap werken bij mensen.', correct: false, misconception: 'Denkt dat leren over gevoelens hetzelfde is als gevoelens hebben.' },
          { text: 'Hij doet menselijk gedrag na en voorspelt de best passende zin.', correct: true, explanation: 'Dat nadoen heet simuleren; begrijpen doet hij niet.' },
          { text: 'Hij zoekt zijn antwoord op bij iemand die op dat moment meeleest.', correct: false, misconception: 'Denkt dat er een mens achter de chat zit.' },
          { text: 'Hij denkt eerst na en kiest daarna zelf wat hij wil zeggen.', correct: false, misconception: 'Denkt dat AI een eigen wil heeft.' }
        ],
        feedback: 'Menselijk klinken en menselijk denken zijn twee dingen. Het eerste kan hij, het tweede niet.'
      },
      {
        prompt: 'Alexa, Google Home en Siri gebruiken alle drie kunstmatige intelligentie.',
        waar: true,
        leerdoel: LD_7_1_C,
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Ze luisteren, begrijpen jouw woorden en kiezen een antwoord. Daar is AI voor nodig.'
      },
      {
        prompt: 'Als een computer meer over jou weet dan jij doorhebt, noemen we dat een privacyprobleem.',
        waar: true,
        leerdoel: LD_7_2_A,
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Dat is een van de drie gevaren. De andere twee zijn misleiding en werk dat verdwijnt.'
      },
      {
        prompt: 'Kijk naar deze beschrijving van een foto: een man draagt een shirt met letters die geen woord vormen, en zijn linkerhand heeft zes vingers. Schrijf op of dit beeld echt of door AI gemaakt is en waarom.',
        type: 'open',
        leerdoel: LD_7_2_B,
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Dit beeld is door AI gemaakt. Ik zie twee kenmerken uit de les. Ten eerste de hand met zes vingers; AI zet vaak te veel vingers aan een hand. Ten tweede de letters op het shirt die geen echt woord vormen; AI weet niet wat woorden betekenen en tekent alleen lettervormen na.',
        nakijkpunten: [
          'Het antwoord kiest duidelijk: door AI gemaakt.',
          'Er worden twee kenmerken genoemd die in de tekst staan, niet verzonnen.',
          'Bij minstens een kenmerk staat kort waarom AI daar fouten in maakt.'
        ],
        feedback: 'Twee kenmerken zijn samen sterker bewijs dan een. Noem ze allebei apart.'
      },
      {
        prompt: 'Waarom deel je geen gegevens van een klasgenoot met een chatbot?',
        leerdoel: LD_7_2_C,
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat de chatbot dan langzamer wordt en minder goede antwoorden geeft.', correct: false, misconception: 'Denkt dat het probleem technisch is.' },
          { text: 'Omdat je klasgenoot dan een melding krijgt van de chatbot.', correct: false, misconception: 'Denkt dat de ander gewaarschuwd wordt.' },
          { text: 'Omdat die gegevens niet van jou zijn en toch bewaard kunnen worden.', correct: true, explanation: 'Je voedt de bot met gegevens van iemand die daar niets over te zeggen had.' },
          { text: 'Omdat een chatbot alleen gegevens van jezelf mag verwerken van de school.', correct: false, misconception: 'Denkt dat het alleen een schoolregel is.' }
        ],
        feedback: 'Niet alleen jouw gegevens, maar ook die van anderen blijven buiten de chat.'
      },
      {
        prompt: 'Er zijn twee soorten chatbots: eentje met vaste antwoorden en eentje die met je meedenkt.',
        waar: true,
        leerdoel: LD_7_3_A,
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'De klantenservice van een webshop is het eerste type. ChatGPT en TalkAI zijn het tweede.'
      },
      {
        prompt: 'Schrijf een opdracht voor een chatbot over een onderwerp dat jij leuk vindt. Zet er daarna onder waar de vier onderdelen zitten.',
        type: 'open',
        leerdoel: LD_7_3_B,
        denkniveau: 'maken_controleren',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Mijn opdracht: leg in makkelijke taal uit hoe een skateboard blijft rijden als je niet meer afzet, in 6 zinnen, voor een leerling van 12 jaar. Opdracht: uitleggen. Onderwerp: hoe een skateboard blijft rijden. Doelgroep: een leerling van 12 jaar. Lengte: 6 zinnen. Extra: de stijl is makkelijke taal.',
        nakijkpunten: [
          'De opdracht bevat alle vier de onderdelen: opdracht, onderwerp, doelgroep en lengte.',
          'Onder de opdracht staat per onderdeel welk stuk van de zin dat is.',
          'Er staan geen vage woorden in zoals "doe maar iets" of "vertel wat".'
        ],
        feedback: 'Streep de vier onderdelen in je eigen zin aan. Ontbreekt er een, vul hem dan aan.'
      },
      {
        prompt: 'Je mag de opmaak van de chatbot laten staan, want die is altijd al goed.',
        waar: false,
        leerdoel: LD_7_3_C,
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Jij zet de opmaak zelf: titel, kop, lettertype, grootte en de begrippen vet.'
      },
      {
        prompt: 'Waarom klinkt een chatbot zeker van zichzelf, ook als het antwoord niet klopt?',
        leerdoel: LD_7_4_A,
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'reflecteren',
        options: [
          { text: 'Omdat hij van zijn makers heeft gekregen dat hij nooit mag twijfelen bij een vraag.', correct: false, misconception: 'Denkt dat er een regel is die twijfel verbiedt.' },
          { text: 'Omdat hij zijn antwoord eerst controleert bij een tweede website.', correct: false, misconception: 'Denkt dat de bot zichzelf nakijkt.' },
          { text: 'Omdat hij altijd alleen dingen zegt die hij honderd procent zeker weet.', correct: false, misconception: 'Denkt dat hallucinatie zelden voorkomt.' },
          { text: 'Omdat hij de best passende zin voorspelt en niet weet wat waar is.', correct: true, explanation: 'Hij meet niet of iets klopt; hij meet wat waarschijnlijk volgt.' }
        ],
        feedback: 'Zeker klinken en zeker weten zijn niet hetzelfde. Daarom controleer jij het zelf.'
      },
      {
        prompt: 'Het antwoord twee keer bij dezelfde chatbot opvragen is een goede controle.',
        waar: false,
        leerdoel: LD_7_4_B,
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Controleren doe je buiten de bot om, bij een andere website. Anders krijg je dezelfde fout.'
      },
      {
        prompt: 'Een werkstuk moet je altijd zelf schrijven, ook als je een chatbot om hulp hebt gevraagd.',
        waar: true,
        leerdoel: LD_7_4_C,
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Hulp vragen en in eigen woorden overnemen mag. Daar leer je bovendien van.'
      },
      {
        prompt: 'Snel patronen zien zorgt zowel voor het voordeel als voor het gevaar van AI.',
        waar: true,
        leerdoel: LD_7_5_A,
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'reflecteren',
        feedback: 'Het is dezelfde techniek. Die vindt het vlekje op de scan en maakt het nepgezicht.'
      },
      {
        prompt: 'Je krijgt van een chatbot acht vlotte zinnen met drie jaartallen erin. Wat doe je als eerste?',
        leerdoel: LD_7_5_B,
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De tekst meteen in je eigen woorden overschrijven en dan inleveren.', correct: false, misconception: 'Denkt dat herschrijven ook meteen controleren is.' },
          { text: 'De drie jaartallen aanstrepen en er één bij een andere bron opzoeken.', correct: true, explanation: 'Namen, jaartallen en getallen zijn de plekken waar hallucinatie zit.' },
          { text: 'De tekst in Word plakken en er de goede opmaak op zetten.', correct: false, misconception: 'Begint bij de vorm terwijl de inhoud nog niet klopt.' },
          { text: 'De chatbot vragen of hij nog een keer wil controleren of alles klopt.', correct: false, misconception: 'Denkt dat de bot zichzelf kan nakijken.' }
        ],
        feedback: 'Eerst nakijken, dan pas overschrijven. Anders neem je een fout netjes over.'
      }
    ]
  }
};
