// Verrijkingslaag hoofdstuk 6 - Mediawijs: social media, welzijn en betrouwbaar
// nieuws. Kaderberoepsgerichte leerweg (kb).
//
// Zie scripts/seed-verrijking/PATROON.md voor het formaat van een vraag, de
// regels over afleiders en de eisen aan feedback.
//
// Opzet per paragraaf, volgens de blauwdruk en het kb-profiel:
//   - elk leerdoel heeft zijn eigen startvraag; die staan als `checks` in
//     scripts/seed-structuur/kb/h6.mjs, met antwoord en uitleg erbij. 6.1 opent
//     daarnaast met VIER voorkennisvragen over hoofdstuk 5 (waarde en
//     gedragsregel, account op prive, een bericht rapporteren, en een te lage
//     prijs in een webshop). De blauwdruk vraagt een startcheck van 4 tot 6
//     vragen over het vorige hoofdstuk en zet daar een bewijsmerk bij; ronde 2
//     had er twee, dus de helft van het minimum. De bron-eindtoets van les 15
//     gaat over les 9 tot en met 14, dus die stof telt hier echt mee;
//   - elk theorieblok heeft een uitgewerkt voorbeeld (vraag + volledige
//     uitwerking) dat VOOR het oefenblok en het zelfstandig oefenen komt;
//   - elke afsluitquiz vanaf 6.2 heeft TWEE terugkeervragen naar leerdoelen van
//     eerdere paragrafen van dit hoofdstuk, en die twee komen zo veel mogelijk
//     uit verschillende paragrafen. De validator eist er een; de blauwdruk noemt
//     spreiden een van de twee technieken met hard bewijs, dus het worden er twee;
//   - de 20-20-2 regel wordt in het hele hoofdstuk op EEN manier geteld: na elke
//     VOLLE 20 minuten. Een uur huiswerk geeft dus drie pauzes, anderhalf uur
//     vier en twee uur zes. Die telling staat gelijk in de theorie van 6.5, in de
//     uitgewerkte voorbeelden, in het diagnoseblok van 6.7 en in de toetsvraag;
//   - de hoofdstuktoets 6.7 bevraagt elk van de twintig verplichte leerdoelen
//     van 6.1 tot en met 6.7 precies TWEE keer, en stelt daarnaast twee vragen
//     over hoofdstuk 5. Dat maakt 42 vragen, ruim boven de 15 tot 20 die de
//     blauwdruk als bandbreedte noemt. Die twee eisen kunnen hier niet allebei:
//     twintig leerdoelen maal twee is nu eenmaal veertig items. De blauwdruk
//     zet een bewijsmerk bij de DEKKINGSEIS ("een item per doel is te dun voor
//     een uitspraak; twee geeft op zijn minst een tegenwicht") en niet bij het
//     aantal, dus de dekking wint. Ronde 2 zat op 23 vragen met 19 doelen die
//     maar een keer voorkwamen: boven de band in aantal en eronder in dekking
//     tegelijk. De bandbreedte van de blauwdruk hoort bij hoofdstukken met acht
//     tot tien leerdoelen; dit hoofdstuk heeft er twintig;
//   - kb-vorm: veel goed/fout-vragen naast meerkeuze en per blok hoogstens een
//     of twee open vragen. Gemeten over heel hoofdstuk 6: 63 meerkeuze,
//     28 waar-niet-waar en 9 open. Ronde 2 had er 51 / 9 / 9, met precies een
//     waar-niet-waar per afsluitquiz; nu heeft elke quiz er twee en zit de
//     hoofdstuktoets vol met stellingen. De reden waarom een antwoord goed is
//     staat in `explanation`, niet in de antwoordtekst;
//   - RAADBAARHEID OP VORM, IN TWEE RICHTINGEN. De validator toetst er een:
//     blind de LANGSTE knop klikken. Ronde 4 heeft ook de andere kant gemeten,
//     en daar zat het lek. Blind de KORTSTE knop klikken gaf 40 procent goed op
//     57 meerkeuzevragen, terwijl het kansniveau hier rond 27 procent ligt. Dat
//     kwam doordat een kort, kloppend antwoord vanzelf korter uitvalt dan drie
//     uitgeschreven afleiders. Ergste geval was vraag 21 van 6.7: het goede
//     antwoord was het kale woord "Respect" tussen drie volzinnen, dus zonder
//     enige kennis te kiezen. In tien vragen (6.3 q2, 6.4 q2 en q7, 6.6 q2 en
//     q6, 6.7 q9, q10, q13, q21 en q22) zijn de optielengtes daarom
//     gelijkgetrokken, zodat het goede antwoord noch de kortste noch de langste
//     knop is. Nu: kortste knop 23 procent, langste knop 16 procent, allebei
//     onder kansniveau. Houd dat zo bij nieuwe vragen: een goed antwoord dat
//     opvalt door zijn LENGTE of zijn VORM is net zo lek als een dat opvalt
//     door zijn plaats in de rij.
//
// De kb-vragen zijn opnieuw geschreven en niet overgenomen uit tl/h6.mjs: kort
// geformuleerd, een idee per zin en met scenario's uit de leefwereld van een
// brugklasser.

export default {
  '6.1': {
    learningGoals: [
      'Je kunt uitleggen wat een algoritme op social media is.',
      'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.',
      'Je kunt een voordeel en een nadeel van algoritmes noemen.'
    ],
    theorie: [
      {
        keyTerms: ['social media', 'algoritme', 'computerregel'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sem en Jaylin zitten naast elkaar in de klas. Ze openen op hetzelfde moment dezelfde app, op hetzelfde wifi-netwerk. Sem ziet alleen voetbal. Jaylin ziet alleen make-up. Hoe kan dat?</p>',
          '<p><strong>Antwoord.</strong> Stap 1: er is geen vaste tijdlijn die iedereen hetzelfde ziet. Stap 2: voor elke gebruiker rekent het algoritme apart uit wat werkt. Stap 3: Sem kijkt voetbalvideo\'s helemaal uit, dus dat herhaalt het systeem. Stap 4: Jaylin zocht vaak naar make-up, dus dat krijgt zij terug. Er zijn dus geen twee versies van de app: het wifi-netwerk doet hier niets.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['kijktijd', 'trending', 'signaal'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Fatima geeft een filmpje over een hond een like. Twee seconden later swipet ze het weg. Daarna kijkt ze een skatefilmpje drie keer helemaal uit, zonder like. Waarover krijgt ze morgen meer te zien?</p>',
          '<p><strong>Antwoord.</strong> Over skaten. Kijk maar naar de tijd die het haar kostte. Een like is een tikje van een seconde. Drie keer uitkijken kost echte minuten. Kijktijd telt daarom zwaarder dan een like. Het wegswipen van de hond is bovendien een negatief signaal. Dat onderwerp zakt weg. Zo bouwt het systeem haar voorkeuren op uit haar gedrag, en niet uit wat zij zegt.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een algoritme kiest per persoon wat er in jouw tijdlijn komt. Het leert dat uit je klikken, je zoekopdrachten en vooral uit hoe lang je kijkt. Het voordeel is dat je snel vindt wat bij je past. Het nadeel is dat je steeds minder andere meningen en ander nieuws ziet.</p>',
      keyTerms: ['algoritme', 'tijdlijn']
    },
    vragen: [
      {
        prompt: 'Je kijktijd is voor het algoritme een sterker teken dan een snelle like.',
        waar: true,
        leerdoel: 'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Een like is een tikje van een seconde. Doorkijken kost jou echte minuten, en dat weegt zwaarder.'
      },
      {
        prompt: 'Wat is een algoritme op social media?',
        leerdoel: 'Je kunt uitleggen wat een algoritme op social media is.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Een medewerker van de app die elke dag kiest welke berichten populair worden.', correct: false, misconception: 'Denkt dat er mensen achter zitten die de tijdlijn met de hand maken.' },
          { text: 'Een knop die jij zelf aanzet als je meer van hetzelfde wilt zien.', correct: false, misconception: 'Denkt dat je de aanbevelingen zelf inschakelt.' },
          { text: 'Een filter dat berichten weghaalt die niet mogen van het platform.', correct: false, misconception: 'Verwart aanbevelen met het weghalen van verboden berichten.' },
          { text: 'Een computerregel die berekent welke berichten jij ziet.', correct: true, explanation: 'Het is een rekenregel die voorspelt waar jij naar blijft kijken.' }
        ],
        feedback: 'Een algoritme is geen mens en geen knop. Het is een rekenregel die per persoon iets anders uitrekent.'
      },
      {
        prompt: 'Waarom wil een app dat jij zo lang mogelijk blijft kijken?',
        leerdoel: 'Je kunt uitleggen wat een algoritme op social media is.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Omdat jij per minuut kijken een klein bedrag aan de app betaalt.', correct: false, misconception: 'Denkt dat een gratis app per gebruiker afrekent.' },
          { text: 'Omdat de app jouw filmpjes daarna aan andere gebruikers verkoopt.', correct: false, misconception: 'Denkt dat de filmpjes van gebruikers het handelswaar zijn.' },
          { text: 'Omdat je dan meer advertenties ziet en dat levert geld op.', correct: true, explanation: 'De app verdient geld met advertenties. Blijf jij langer, dan zie je er meer.' },
          { text: 'Omdat het algoritme alleen werkt bij mensen met een betaald account.', correct: false, misconception: 'Denkt dat aanbevelingen een extraatje zijn waarvoor je betaalt.' }
        ],
        feedback: 'Jouw aandacht is hier het product. Hoe langer jij blijft, hoe meer reclame de app aan je kwijt kan.'
      },
      {
        prompt: 'Het algoritme leert net zo goed van hoe lang jij kijkt als van waar je op klikt.',
        waar: true,
        leerdoel: 'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Kijktijd is zelfs het sterkste signaal, want doorkijken kost jou echte minuten.'
      },
      {
        prompt: 'Je zoekt een keer naar een blauwe trui. Waarom zie je daarna dagenlang truien voorbijkomen?',
        leerdoel: 'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat truien op dat moment bij alle gebruikers van de app tegelijk trending zijn.', correct: false, misconception: 'Denkt dat iedereen dezelfde tijdlijn te zien krijgt.' },
          { text: 'Omdat je zoekopdracht bewaard is en het systeem denkt dat je wilt kopen.', correct: true, explanation: 'Zoeken is een sterk koopsignaal, dus dat onderwerp wordt herhaald.' },
          { text: 'Omdat webshops jouw telefoonnummer hebben gekocht van de app.', correct: false, misconception: 'Denkt dat er altijd gegevens verkocht zijn voordat je reclame ziet.' }
        ],
        feedback: 'Een zoekopdracht is voor het systeem een koopsignaal. Dat herhaalt het tot jij stopt met reageren.'
      },
      {
        prompt: 'Hoe kan het algoritme meebepalen wat trending wordt?',
        leerdoel: 'Je kunt een voordeel en een nadeel van algoritmes noemen.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'De app spreekt van tevoren af welke filmpjes er die week populair moeten worden.', correct: false, misconception: 'Denkt dat trends van bovenaf worden ingepland door het bedrijf.' },
          { text: 'Alleen betaalde filmpjes komen in de tijdlijn van andere mensen terecht.', correct: false, misconception: 'Verwart advertenties met aanbevolen filmpjes.' },
          { text: 'Een filmpje met veel kijktijd wordt vaker getoond en krijgt meer kijkers.', correct: true, explanation: 'Vaker getoond worden levert weer kijktijd op, en dat versterkt zichzelf.' }
        ],
        feedback: 'Populair worden en veel getoond worden lopen op social media door elkaar heen.'
      },
      {
        prompt: 'Noem een voordeel en een nadeel van algoritmes. Zet bij het nadeel wie er last van heeft.',
        type: 'open',
        leerdoel: 'Je kunt een voordeel en een nadeel van algoritmes noemen.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Een voordeel is dat ik snel filmpjes en muziek vind die bij mij passen. Ik hoef dan minder te zoeken. Een nadeel is dat ik bijna alleen krijg wat ik al leuk vind. Daardoor mis ik ander nieuws en andere meningen. Daar heb ik zelf last van, want ik ga denken dat iedereen er zo over denkt.',
        nakijkpunten: [
          'Noemt een concreet voordeel, bijvoorbeeld sneller vinden wat bij je past.',
          'Noemt een nadeel over eenzijdig aanbod of te lang doorscrollen.',
          'Zet erbij voor wie dat nadeel een probleem is.'
        ],
        feedback: 'Een goed antwoord noemt twee kanten en zegt er ook bij wie er last van heeft.'
      }
    ]
  },

  '6.2': {
    learningGoals: [
      'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.',
      'Je weet wat het highlight reel-effect en een filterbubbel zijn.',
      'Je kunt twee dingen noemen die jij kunt doen om positiever met social media om te gaan.'
    ],
    theorie: [
      {
        keyTerms: ['FOMO', 'druk', 'zelfbeeld'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Milan checkt elk half uur of er iets nieuws is in de klassenapp. Zijn zusje koopt dezelfde jas als de rest van haar groep. Welk gevoel hoort bij Milan en welk gevoel hoort bij zijn zusje?</p>',
          '<p><strong>Antwoord.</strong> Bij Milan hoort FOMO. Hij is bang dat hij iets mist, dus hij pakt steeds zijn telefoon. Bij zijn zusje hoort druk. Zij doet iets omdat de groep het ook doet. Let op het verschil in richting. FOMO trekt je naar je scherm toe. Druk stuurt wat je buiten je scherm doet, zoals kopen of meedoen met een challenge.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['influencer', 'highlight reel-effect', 'sociale bevestiging', 'filterbubbel'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Nadia post een foto en kijkt de hele avond naar haar likes. Bij 12 likes voelt ze zich minder waard dan bij 80. Ze ziet in haar tijdlijn bijna alleen nog perfecte vakantiefoto\'s. Welke twee begrippen zie je hier?</p>',
          '<p><strong>Antwoord.</strong> Het eerste is sociale bevestiging. Nadia meet haar waarde af aan een cijfer dat anderen bepalen. Likes zeggen iets over het moment van posten en over het algoritme. Ze zeggen niets over wie zij is. Het tweede is de filterbubbel. Zij kijkt lang naar mooie vakantiefoto\'s, dus krijgt ze er steeds meer. Andere beelden verdwijnen uit haar tijdlijn. Zo lijkt het net alsof iedereen zo leeft.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>FOMO is bang zijn dat je iets mist als je niet kijkt. Druk is het gevoel dat je iets moet doen omdat anderen het ook doen. Door het highlight reel-effect zie je alleen de mooie momenten van anderen. Een filterbubbel zorgt dat je steeds dezelfde soort berichten krijgt. Meldingen uitzetten en pauzes plannen helpen je om er positiever mee om te gaan.</p>',
      keyTerms: ['highlight reel-effect', 'filterbubbel']
    },
    vragen: [
      {
        prompt: 'Op social media word je ook beoordeeld door anderen, en dat geeft extra druk.',
        waar: true,
        leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Je laat er een stukje van jezelf zien, en anderen geven er met likes een oordeel over.'
      },
      {
        prompt: 'Wat betekent FOMO?',
        leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Het gevoel dat je iets leuks mist als je niet op social media kijkt.', correct: true, explanation: 'FOMO staat voor Fear Of Missing Out: bang zijn iets te missen.' },
          { text: 'Het gevoel dat je iets moet doen omdat de rest van de groep het doet.', correct: false, misconception: 'Verwart FOMO met druk voelen.' },
          { text: 'De manier waarop jij naar jezelf kijkt en over jezelf denkt.', correct: false, misconception: 'Verwart FOMO met zelfbeeld.' },
          { text: 'Het idee dat je alleen je mooiste momenten online mag zetten.', correct: false, misconception: 'Verwart FOMO met het highlight reel-effect.' }
        ],
        feedback: 'FOMO trekt je naar je scherm toe. Het is de angst dat er iets leuks gebeurt zonder jou.'
      },
      {
        prompt: 'Druk voelen betekent dat je bang bent dat je iets leuks mist.',
        waar: false,
        leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Dat is de omschrijving van FOMO. Druk is het gevoel dat je iets moet doen omdat anderen het ook doen.'
      },
      {
        prompt: 'Wat is het highlight reel-effect?',
        leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Dat de app jou steeds dezelfde soort berichten en filmpjes blijft tonen.', correct: false, misconception: 'Verwart het highlight reel-effect met de filterbubbel.' },
          { text: 'Dat je je waarde afmeet aan het aantal likes dat je krijgt.', correct: false, misconception: 'Verwart het highlight reel-effect met sociale bevestiging.' },
          { text: "Dat foto's met een filter altijd meer volgers en reacties krijgen.", correct: false, misconception: 'Denkt dat het over het aantal volgers gaat in plaats van over weglaten.' },
          { text: 'Dat mensen online alleen hun leukste en mooiste momenten laten zien.', correct: true, explanation: 'Je vergelijkt je hele dag met de beste seconden van iemand anders.' }
        ],
        feedback: 'Je ziet de hoogtepunten van een ander en je eigen gewone dag. Dat is nooit een eerlijke vergelijking.'
      },
      {
        prompt: 'Wat is een filterbubbel?',
        leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een instelling waarmee je alle vervelende reacties automatisch verbergt.', correct: false, misconception: 'Denkt dat een filterbubbel een knop is die je zelf aanzet.' },
          { text: 'Een bewerking die je huid en de kleuren van een foto mooier maakt.', correct: false, misconception: 'Verwart de filterbubbel met filters en bewerkingen op foto\'s.' },
          { text: 'Een situatie waarin je steeds dezelfde soort berichten ziet.', correct: true, explanation: 'Andere meningen en beelden verdwijnen dan langzaam uit je tijdlijn.' }
        ],
        feedback: 'In een bubbel lijkt het alsof iedereen hetzelfde vindt. Dat komt doordat je de rest niet meer te zien krijgt.'
      },
      {
        prompt: 'Wat is een influencer?',
        leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Iemand die de app maakt en bepaalt welke berichten populair worden.', correct: false, misconception: 'Verwart een influencer met het bedrijf achter het platform.' },
          { text: "Iemand die alle foto's op zijn tijdlijn met een filter bewerkt.", correct: false, misconception: 'Denkt dat het bewerken van foto\'s iemand tot influencer maakt.' },
          { text: 'Iemand die van de app betaald krijgt voor elk uur dat jij kijkt.', correct: false, misconception: 'Denkt dat influencers per kijkuur van het platform betaald worden.' },
          { text: 'Iemand met veel volgers die anderen beïnvloedt met wat hij deelt.', correct: true, explanation: 'Juist die volgers maken dat wat hij post invloed heeft op anderen.' }
        ],
        feedback: 'Een influencer laat vooral zijn hoogtepunten zien. Daardoor lijkt zijn leven mooier dan het echt is.'
      },
      {
        prompt: 'Sanne kijkt drie filmpjes over paarden helemaal uit. Wat gebeurt er daarna in haar tijdlijn?',
        leerdoel: 'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ze krijgt juist minder paarden te zien, want ze heeft er niets bij geliket.', correct: false, misconception: 'Denkt dat alleen een like als signaal telt.' },
          { text: 'Ze krijgt meer filmpjes over paarden, want kijktijd is een sterk signaal.', correct: true, explanation: 'Helemaal uitkijken kost tijd en telt daarom zwaarder dan een like.' },
          { text: 'Er verandert niets, want de tijdlijn is voor iedereen hetzelfde.', correct: false, misconception: 'Denkt dat alle gebruikers dezelfde berichten krijgen.' }
        ],
        feedback: 'Deze vraag komt uit paragraaf 6.1. Het systeem meet wat je doet, niet wat je zegt leuk te vinden.'
      },
      {
        prompt: 'Wat is het voordeel van een algoritme dat jou steeds meer van hetzelfde geeft?',
        leerdoel: 'Je kunt een voordeel en een nadeel van algoritmes noemen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je vindt sneller filmpjes en muziek die bij jou passen.', correct: true, explanation: 'Je hoeft minder te zoeken, want het aanbod is op jou afgestemd.' },
          { text: 'Je krijgt vanzelf meer volgers op je eigen account.', correct: false, misconception: 'Denkt dat het algoritme ook jouw eigen bereik vergroot.' },
          { text: 'Je telefoon gebruikt minder data als je berichten bekijkt.', correct: false, misconception: 'Denkt dat aanbevelingen iets met je databundel doen.' },
          { text: 'Je ziet als eerste het belangrijkste nieuws van die dag.', correct: false, misconception: 'Denkt dat het algoritme op belangrijkheid sorteert.' }
        ],
        feedback: 'Deze vraag komt uit paragraaf 6.1. Het voordeel zit in snel vinden, niet in beter nieuws.'
      },
      {
        prompt: 'Noem twee dingen die jij kunt doen om positiever met social media om te gaan. Zet er per ding bij wat er dan verandert.',
        type: 'open',
        leerdoel: 'Je kunt twee dingen noemen die jij kunt doen om positiever met social media om te gaan.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik zet mijn meldingen uit. Dan word ik niet steeds onderbroken en kies ik zelf wanneer ik kijk. Ik plan een dag social media-pauze. Dan merk ik hoeveel tijd ik overhoud voor andere dingen. Ook helpt het om positieve accounts te volgen en accounts te ontvolgen waar ik een naar gevoel van krijg.',
        nakijkpunten: [
          'Noemt twee maatregelen uit de theorie, bijvoorbeeld meldingen uit of een pauze plannen.',
          'Zet per maatregel het effect erbij en niet alleen de maatregel zelf.',
          'De maatregelen gaan over eigen gedrag, niet over wat anderen moeten doen.'
        ],
        feedback: 'Een maatregel noemen is de helft. Pas met het effect erbij laat je zien dat je snapt waarom hij werkt.'
      }
    ]
  },

  '6.3': {
    learningGoals: [
      'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.',
      'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.',
      'Je weet wat de woorden anoniem, omstander en reputatie betekenen.'
    ],
    theorie: [
      {
        keyTerms: ['cyberpesten', 'anoniem', 'nepaccount'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> In een groepsapp van 28 leerlingen wordt drie avonden achter elkaar dezelfde jongen uitgelachen om een foto. Iemand maakt daarna een account met zijn naam en foto. Is dit cyberpesten? Leg uit waaraan je dat ziet.</p>',
          '<p><strong>Antwoord.</strong> Ja, dit is cyberpesten. Kijk naar drie dingen. Ten eerste: het is gericht op een persoon en het herhaalt zich. Ten tweede: het gebeurt via een app, dus het gaat mee naar huis. Ten derde: er is een nepaccount gemaakt om hem belachelijk te maken. Zeg dus niet dat het minder telt omdat het via een scherm gaat.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['slachtoffer', 'pester', 'reputatie', 'omstander'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Jaylin scheldt Noa uit in een groepsapp. Vijftien klasgenoten lezen mee en zeggen niets. Noa slaapt daarna slecht. Zet per persoon een gevolg neer.</p>',
          '<p><strong>Antwoord.</strong> Noa is het slachtoffer. Zij krijgt lichamelijke klachten: slecht slapen, en later misschien hoofdpijn of buikpijn. Jaylin is de pester. Zij kan straf krijgen op school en krijgt een slechte reputatie. Bij ernstig pesten kan er zelfs aangifte gedaan worden. De vijftien meelezers zijn omstanders. Zij houden er spijt of een schuldgevoel aan over.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Cyberpesten is pesten via internet, telefoon of games, en het gaat dag en nacht door. Anoniem betekent dat niemand weet wie de pester is. Het slachtoffer kan buikpijn krijgen en slecht slapen. De pester riskeert straf en een slechte naam. Een omstander ziet het gebeuren en houdt er vaak spijt aan over.</p>',
      keyTerms: ['cyberpesten', 'omstander']
    },
    vragen: [
      {
        prompt: 'Een omstander is iemand die het pesten ziet gebeuren, maar niet meepest en ook niet helpt.',
        waar: true,
        leerdoel: 'Je weet wat de woorden anoniem, omstander en reputatie betekenen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Meelezen en niets doen telt dus al als omstander. Precies daar begint spijt achteraf.'
      },
      {
        prompt: 'Wat is een voorbeeld van cyberpesten?',
        leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Iemand laten struikelen op het schoolplein.', correct: false, misconception: 'Herkent pesten wel, maar ziet niet dat cyberpesten digitaal gaat.' },
          { text: 'Iemand uitschelden in de groepsapp van je klas.', correct: true, explanation: 'Het gebeurt via een app en is gericht op een persoon.' },
          { text: 'Een leuke meme delen met je vrienden.', correct: false, misconception: 'Denkt dat alles wat in een chat gebeurt pesten kan zijn.' },
          { text: 'Met iemand praten over zijn of haar gevoelens.', correct: false, misconception: 'Verwart helpen met pesten omdat het over gevoelens gaat.' }
        ],
        feedback: 'Cyberpesten loopt altijd via een scherm. Struikelen op het plein is pesten, maar geen cyberpesten.'
      },
      {
        prompt: 'Wat is het verschil tussen gewoon pesten en cyberpesten?',
        leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Er is geen verschil, want het gaat allebei om hetzelfde gedrag.', correct: false, misconception: 'Ziet niet dat cyberpesten ook thuis doorgaat.' },
          { text: 'Cyberpesten is niet echt pesten, want er komt geen geweld bij kijken.', correct: false, misconception: 'Denkt dat pesten pas telt als het lichamelijk is.' },
          { text: 'Cyberpesten gaat via een app en kan dag en nacht doorgaan.', correct: true, explanation: 'Bij gewoon pesten zie je elkaar direct en stopt het als je thuiskomt.' }
        ],
        feedback: 'Cyberpesten stopt niet bij de schoolpoort. Juist dat 24 uur per dag doorgaan maakt het extra zwaar.'
      },
      {
        prompt: 'Welk gevolg hoort bij het slachtoffer van cyberpesten?',
        leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Straf van school en een gesprek met de ouders.', correct: false, misconception: 'Zet het gevolg van de pester bij het slachtoffer.' },
          { text: 'Spijt achteraf en een schuldgevoel, omdat je niets gedaan hebt.', correct: false, misconception: 'Zet het gevolg van de omstander bij het slachtoffer.' },
          { text: 'Een slechte reputatie bij de rest van de klas.', correct: false, misconception: 'Denkt dat reputatieschade het slachtoffer treft in plaats van de pester.' },
          { text: 'Buikpijn, slecht slapen en niet meer naar school durven.', correct: true, explanation: 'Het pesten geeft echte lichamelijke klachten, ook al gaat het via een scherm.' }
        ],
        feedback: 'Reputatie hoort bij de pester en spijt bij de omstander. Het slachtoffer krijgt de lichamelijke klachten.'
      },
      {
        prompt: 'Een omstander houdt zelf niets over aan het pesten dat hij ziet gebeuren.',
        waar: false,
        leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Omstanders krijgen vaak spijt of een schuldgevoel. Sommigen worden onzeker en vragen zich af of zij de volgende zijn.'
      },
      {
        prompt: 'Welk woord betekent dat je niet weet wie er achter een account zit?',
        leerdoel: 'Je weet wat de woorden anoniem, omstander en reputatie betekenen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Anoniem', correct: true, explanation: 'Anoniem betekent dat niemand weet wie jij bent.' },
          { text: 'Omstander', correct: false, misconception: 'Verwart de dader zonder naam met iemand die staat toe te kijken.' },
          { text: 'Reputatie', correct: false, misconception: 'Verwart de naamloosheid van de pester met wat anderen van hem denken.' }
        ],
        feedback: 'Anoniem gaat over de pester zonder naam. Reputatie gaat over hoe de groep hem daarna ziet.'
      },
      {
        prompt: 'Waarop baseert het algoritme zijn keuze voor jouw tijdlijn?',
        leerdoel: 'Je kunt uitleggen wat een algoritme op social media is.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Op wat de meeste mensen in Nederland op dat moment bekijken.', correct: false, misconception: 'Denkt dat de tijdlijn een landelijke top tien is.' },
          { text: 'Op wat jij eerder aanklikte en hoe lang je toen bleef kijken.', correct: true, explanation: 'Het rekent per persoon uit wat waarschijnlijk werkt.' },
          { text: 'Op de volgorde waarin jouw vrienden hun berichten geplaatst hebben.', correct: false, misconception: 'Denkt dat een tijdlijn nog altijd op tijd gesorteerd is.' }
        ],
        feedback: 'Deze vraag hoort bij paragraaf 6.1. Het gaat om jouw eigen gedrag, niet om dat van heel Nederland.'
      },
      {
        prompt: 'Welke zin laat FOMO zien?',
        leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ik koop dezelfde jas, want mijn hele groep heeft er een.', correct: false, misconception: 'Verwart FOMO met druk voelen vanuit de groep.' },
          { text: 'Ik krijg alleen nog filmpjes over hetzelfde onderwerp.', correct: false, misconception: 'Verwart FOMO met de filterbubbel van het algoritme.' },
          { text: 'Ik pak steeds mijn telefoon om te zien of ik iets mis.', correct: true, explanation: 'FOMO is de angst dat er iets leuks gebeurt zonder jou erbij.' }
        ],
        feedback: 'Deze vraag hoort bij paragraaf 6.2. FOMO trekt je naar je scherm, druk stuurt je gedrag daarbuiten.'
      },
      {
        prompt: 'Leg uit wat een omstander is. Schrijf er ook bij wat hij er zelf aan overhoudt.',
        type: 'open',
        leerdoel: 'Je weet wat de woorden anoniem, omstander en reputatie betekenen.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Een omstander is iemand die het pesten ziet gebeuren. Hij pest niet mee, maar hij helpt ook niet. Hij houdt er vaak spijt of een schuldgevoel aan over, omdat hij niets deed terwijl hij het zag. Sommige omstanders worden ook onzeker en denken: wat als ik straks de volgende ben?',
        nakijkpunten: [
          'Zegt dat een omstander het ziet, niet meepest en ook niet helpt.',
          'Noemt minstens een gevolg voor de omstander zelf, zoals spijt of schuldgevoel.',
          'Haalt de omstander niet door elkaar met de pester of het slachtoffer.'
        ],
        feedback: 'Toekijken voelt neutraal, maar dat is het niet. Voor de groep leest zwijgen als goedvinden.'
      }
    ]
  },

  '6.4': {
    learningGoals: [
      'Je weet wat je kunt doen als je zelf gepest wordt.',
      'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.',
      'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.'
    ],
    theorie: [
      {
        keyTerms: ['screenshot', 'blokkeer', 'vertrouwenspersoon'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Tim krijgt drie dagen lang gemene berichten in een game-chat. Hij wil de app meteen verwijderen, zodat hij er vanaf is. Is dat een goed plan? Wat doet hij beter?</p>',
          '<p><strong>Antwoord.</strong> Nee, dat is geen goed plan. Verwijdert hij de app, dan is zijn bewijs weg terwijl het pesten doorgaat. Dit is de goede volgorde. Stap 1: hij vertelt het aan iemand die hij vertrouwt, bijvoorbeeld zijn mentor. Stap 2: hij maakt screenshots van alle berichten. Stap 3: pas daarna blokkeert hij de pesters. Stap 4: hij meldt het bij de vertrouwenspersoon op school. Stap 5: wil hij liever anoniem praten, dan belt of chat hij met de Kindertelefoon.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['rapporteren', 'aangifte', 'excuses'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Onder een openbaar filmpje wordt iemand uitgescholden. Je kent die persoon niet en je zit niet in die groep. Kun je dan nog iets doen?</p>',
          '<p><strong>Antwoord.</strong> Ja. Je rapporteert de reactie bij de app of het platform. Rapporteren betekent dat je het bericht meldt bij de makers van de app. Zij kunnen het weghalen. Dat kan altijd, ook als je het slachtoffer niet kent. Verwar rapporteren niet met blokkeren en niet met aangifte doen. Blokkeren doe je op je eigen telefoon. Rapporteren doe je bij de app. Aangifte doen is naar de politie gaan om iets ergs te melden.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Word je gepest? Praat erover, maak screenshots, blokkeer de pester en meld het op school. Bij Pestweb en de Kindertelefoon kun je anoniem hulp vragen. Zie je iemand anders gepest worden? Stuur privé een berichtje en meld het bericht bij de app. Aangifte doen betekent dat je naar de politie gaat om iets ergs te melden.</p>',
      keyTerms: ['blokkeer', 'aangifte']
    },
    vragen: [
      {
        prompt: 'Een bericht rapporteren doe je bij de politie.',
        waar: false,
        leerdoel: 'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Rapporteren doe je bij de app zelf. Naar de politie gaan heet aangifte doen.'
      },
      {
        prompt: 'Je wordt gepest in een groepsapp. Wat doe je vlak voordat je de pesters blokkeert?',
        leerdoel: 'Je weet wat je kunt doen als je zelf gepest wordt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Je scheldt eerst een keer stevig terug via de groepsapp.', correct: false, misconception: 'Denkt dat terugpesten het pesten laat stoppen.' },
          { text: 'Je maakt eerst screenshots van de gemene berichten.', correct: true, explanation: 'Na het blokkeren zie je de berichten vaak niet meer, dus je bewijs is dan weg.' },
          { text: 'Je verwijdert de hele app en al je berichten.', correct: false, misconception: 'Denkt dat het probleem weg is als de app weg is.' },
          { text: 'Je wacht een week af of het vanzelf overgaat.', correct: false, misconception: 'Denkt dat afwachten de veiligste keuze is.' }
        ],
        feedback: 'Bewijs bewaren gaat altijd voor opruimen. Zonder screenshots kun je later niets laten zien.'
      },
      {
        prompt: 'Wat doet blokkeren precies?',
        leerdoel: 'Je weet wat je kunt doen als je zelf gepest wordt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'De app haalt het gemene bericht van het platform af.', correct: false, misconception: 'Verwart blokkeren met rapporteren bij de app.' },
          { text: 'De politie krijgt een melding van jouw telefoon binnen.', correct: false, misconception: 'Verwart blokkeren met aangifte doen.' },
          { text: 'Die persoon kan jou niets meer sturen en je profiel niet meer zien.', correct: true, explanation: 'Blokkeren werkt op jouw eigen toestel en geeft je meteen rust.' },
          { text: 'Je account wordt een tijdje onzichtbaar voor al je volgers en vrienden.', correct: false, misconception: 'Denkt dat blokkeren hetzelfde is als je account op privé zetten.' }
        ],
        feedback: 'Blokkeren regel je zelf op je telefoon. Het haalt het bericht niet weg bij de app.'
      },
      {
        prompt: 'In de klassenapp wordt iemand uitgelachen. Wat is de beste eerste stap voor jou als omstander?',
        leerdoel: 'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je stuurt het slachtoffer privé een kort berichtje.', correct: true, explanation: 'Een bericht laat merken dat niet iedereen meedoet.' },
          { text: 'Je stuurt de berichten door naar een andere groepsapp.', correct: false, misconception: 'Denkt dat doorsturen helpt, terwijl het het pesten verspreidt.' },
          { text: 'Je zet een lachende emoji, zodat het niet zo serieus lijkt.', correct: false, misconception: 'Denkt dat een emoji neutraal is en niet meetelt.' },
          { text: 'Je doet niets, want het gaat jou eigenlijk niet aan.', correct: false, misconception: 'Denkt dat zwijgen een neutrale keuze is.' }
        ],
        feedback: 'Een lach-emoji telt voor het slachtoffer net zo hard als een woord. Zwijgen leest de groep als goedvinden.'
      },
      {
        prompt: 'Rapporteren betekent dat je het bericht meldt bij de makers van de app.',
        waar: true,
        leerdoel: 'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Rapporteren kan altijd, ook als je het slachtoffer niet kent. De app kan het bericht dan weghalen.'
      },
      {
        prompt: 'Wat betekent aangifte doen?',
        leerdoel: 'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Naar de politie gaan om te melden dat er iets ergs gebeurd is.', correct: true, explanation: 'Bij ernstig pesten kan de politie er dus echt bij komen.' },
          { text: 'Bij de app of het platform melden dat een bericht over de grens gaat.', correct: false, misconception: 'Verwart aangifte doen met rapporteren.' },
          { text: 'Op school aan je mentor vertellen wat er gebeurd is.', correct: false, misconception: 'Verwart aangifte doen met melden bij school.' },
          { text: 'Zorgen dat iemand jou geen berichten meer kan sturen.', correct: false, misconception: 'Verwart aangifte doen met blokkeren.' }
        ],
        feedback: 'Aangifte doen loopt via de politie. Rapporteren loopt via de app en blokkeren via je eigen telefoon.'
      },
      {
        prompt: 'Noa vergelijkt zichzelf elke avond met perfecte foto\'s van anderen. Hoe heet het effect waardoor zij alleen hun mooiste momenten ziet?',
        leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Het zoeken van sociale bevestiging bij anderen', correct: false, misconception: 'Verwart het weglaten van moeilijke momenten met waarde halen uit likes.' },
          { text: 'Het highlight reel-effect op je tijdlijn', correct: true, explanation: 'Mensen posten hun hoogtepunten en laten de moeilijke dingen weg.' },
          { text: 'Een vorm van digitale verslaving', correct: false, misconception: 'Denkt dat lang kijken hetzelfde is als het effect van de beelden.' }
        ],
        feedback: 'Deze vraag komt uit paragraaf 6.2. Het gaat om wat anderen weglaten, niet om wat jij voelt bij likes.'
      },
      {
        prompt: 'Wie krijgt bij cyberpesten last van spijt en een schuldgevoel?',
        leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De omstander die het zag en niets deed.', correct: true, explanation: 'Toekijken voelt neutraal, maar blijft achteraf knagen.' },
          { text: 'Het slachtoffer dat de berichten kreeg.', correct: false, misconception: 'Zet het gevolg van de omstander bij het slachtoffer.' },
          { text: 'De pester die de berichten stuurde.', correct: false, misconception: 'Zet het gevolg van de omstander bij de pester.' },
          { text: 'De docent die het pesten meldde.', correct: false, misconception: 'Denkt dat melden een schuldgevoel oplevert.' }
        ],
        feedback: 'Deze vraag komt uit paragraaf 6.3. Het slachtoffer krijgt klachten en de pester een slechte naam.'
      },
      {
        prompt: 'Waar kun je hulp vragen bij pesten? Noem twee plekken op school en twee plekken daarbuiten.',
        type: 'open',
        leerdoel: 'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Op school kan ik naar mijn mentor gaan en naar de vertrouwenspersoon. Een vertrouwenspersoon is iemand bij wie je terechtkunt als je ergens mee zit. Buiten school kan ik anoniem hulp vragen via Pestweb en via de Kindertelefoon. Anoniem betekent dat ik mijn naam niet hoef te zeggen. Denk ik aan zelfmoord, dan bel ik gratis 0800-0113.',
        nakijkpunten: [
          'Noemt twee plekken op school, bijvoorbeeld de mentor en de vertrouwenspersoon.',
          'Noemt twee plekken buiten school, bijvoorbeeld Pestweb en de Kindertelefoon.',
          'Legt uit wat anoniem hier betekent.'
        ],
        feedback: 'Buiten school kun je praten zonder je naam te zeggen. Dat is een lagere drempel dan een gesprek op school.'
      }
    ]
  },

  '6.5': {
    learningGoals: [
      'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.',
      'Je kunt de 20-20-2 regel uitleggen en toepassen.',
      'Je weet waaraan je digitale verslaving bij jezelf kunt herkennen.'
    ],
    theorie: [
      {
        keyTerms: ['fysiek', 'mentaal', 'blauw licht', 'melatonine'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Bram gamet elke avond twee uur met zijn laptop op schoot. Hij gaat om half twaalf naar bed. Hij heeft nekpijn en valt pas na een uur in slaap. Wat zijn de twee oorzaken?</p>',
          '<p><strong>Antwoord.</strong> Er zijn twee verschillende oorzaken, dus ook twee oplossingen. Oorzaak 1 is zijn houding. Met de laptop op schoot hangt zijn hoofd ver naar voren. Dat geeft spanning op zijn nek. De oplossing: laptop op tafel, scherm op ooghoogte. Oorzaak 2 is het blauw licht van zijn scherm. Dat remt melatonine, het stofje dat hem slaperig maakt. De oplossing: het scherm een uur voor bedtijd wegleggen, of de nachtmodus aanzetten.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['20-20-2', 'digitale verslaving', 'rusteloos'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Nour maakt anderhalf uur huiswerk achter haar laptop. Hoe vaak past zij de 20-20-2 pauze toe, en wat doet ze dan precies?</p>',
          '<p><strong>Antwoord.</strong> Reken het uit. Anderhalf uur is 90 minuten. Na elke 20 minuten hoort een pauze, dus na 20, 40, 60 en 80 minuten. Dat is vier keer. Elke keer kijkt zij 20 seconden naar iets op minstens 6 meter afstand, bijvoorbeeld uit het raam. Even op haar telefoon kijken telt niet: dan kijkt ze weer dichtbij en naar een scherm. De 2 uit de regel hoort niet bij de pauze. Die 2 uur buiten geldt voor haar hele dag.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Te lang schermgebruik geeft rug- en nekklachten, droge ogen en hoofdpijn. Voel je je vaak moe of prikkelbaar? Dan is dat misschien een signaal van ongezond schermgebruik. Blauw licht remt melatonine, waardoor je later in slaap valt. Met de 20-20-2 regel kijk je na elke 20 minuten 20 seconden ver weg. En je bent 2 uur per dag buiten. Digitale verslaving herken je aan bijna niet kunnen stoppen en rusteloos worden zonder telefoon. Je hoeft je schermen niet nooit meer te gebruiken, wel slimmer en bewuster.</p>',
      keyTerms: ['20-20-2', 'digitale verslaving']
    },
    vragen: [
      {
        prompt: 'Voel je je vaak moe of prikkelbaar, dan kan dat een signaal van ongezond schermgebruik zijn.',
        waar: true,
        leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Je hoeft je schermen daarna niet weg te doen. Slimmer en bewuster gebruiken is genoeg.'
      },
      {
        prompt: 'Wat is een goed voorbeeld van de 20-20-2 regel?',
        leerdoel: 'Je kunt de 20-20-2 regel uitleggen en toepassen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Elke 20 minuten even op je mobiel kijken om je hoofd leeg te maken.', correct: false, misconception: 'Denkt dat een pauze op een ander scherm ook een pauze is.' },
          { text: 'Na 20 minuten je ogen 20 seconden dichtdoen en dan doorgaan.', correct: false, misconception: 'Denkt dat rust voor je ogen hetzelfde is als ver weg kijken.' },
          { text: 'Na 20 minuten 20 seconden ver kijken en 2 uur per dag buiten zijn.', correct: true, explanation: 'Ver kijken ontspant je oogspieren en buitenlicht helpt je slaapritme.' },
          { text: 'Twintig keer per minuut knipperen om droge ogen te voorkomen.', correct: false, misconception: 'Denkt dat de getallen over knipperen gaan.' }
        ],
        feedback: 'De 2 hoort niet bij de pauze zelf. Die 2 uur buiten geldt voor je hele dag.'
      },
      {
        prompt: 'Welk gevolg hoort bij te veel blauw licht?',
        leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Slecht in slaap kunnen komen.', correct: true, explanation: 'Blauw licht remt melatonine, en dat stofje maakt je slaperig.' },
          { text: 'Minder aandacht voor school en vrienden.', correct: false, misconception: 'Zet het gevolg van digitale verslaving bij het licht van je scherm.' },
          { text: 'Rug- en nekklachten na een lange schooldag.', correct: false, misconception: 'Zet het gevolg van een slechte houding bij het licht van je scherm.' }
        ],
        feedback: 'Elke oorzaak heeft zijn eigen gevolg. Licht werkt op je slaap, houding werkt op je spieren.'
      },
      {
        prompt: 'Wat is GEEN goed voorbeeld van gezond schermgebruik?',
        leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Rechtop zitten met beide voeten plat op de grond.', correct: false, misconception: 'Ziet niet dat een goede houding juist wel gezond is.' },
          { text: 'In bed TikTokken tot twee uur \'s nachts.', correct: true, explanation: 'Dat combineert blauw licht vlak voor het slapen met een slechte houding.' },
          { text: 'Je scherm op ooghoogte zetten met een stapel boeken.', correct: false, misconception: 'Ziet niet dat het scherm op ooghoogte de nek juist ontlast.' },
          { text: 'Na dertig minuten werken even pauze nemen.', correct: false, misconception: 'Denkt dat een pauze fout is omdat er 30 staat en geen 20.' }
        ],
        feedback: 'Let op het woord GEEN in de vraag. Drie antwoorden zijn juist gezond gedrag.'
      },
      {
        prompt: 'Door heel vaak dichtbij naar een scherm te kijken kun je uiteindelijk een bril nodig hebben.',
        waar: true,
        leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Je ogen staan dan urenlang op dichtbij ingesteld. Daarom zegt de regel juist dat je ver moet kijken.'
      },
      {
        prompt: 'Waaraan herken je digitale verslaving?',
        leerdoel: 'Je weet waaraan je digitale verslaving bij jezelf kunt herkennen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je hebt een telefoon met veel opslagruimte en snelle apps.', correct: false, misconception: 'Kijkt naar het toestel in plaats van naar het eigen gedrag.' },
          { text: 'Je gebruikt je telefoon soms een uur langer dan gepland.', correct: false, misconception: 'Denkt dat een keer uitlopen al een verslaving is.' },
          { text: 'Je kunt bijna niet stoppen en wordt rusteloos zonder telefoon.', correct: true, explanation: 'School, familie en hobby\'s krijgen dan ook minder aandacht.' }
        ],
        feedback: 'De signalen gaan over jouw gedrag en gevoel. Kijk naar wat je doet als je je telefoon niet kunt pakken.'
      },
      {
        prompt: 'Welke stap zet je als eerste als je zelf online gepest wordt?',
        leerdoel: 'Je weet wat je kunt doen als je zelf gepest wordt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Praten met iemand die je vertrouwt.', correct: true, explanation: 'Zo haal je het probleem meteen weg uit je eentje.' },
          { text: 'Meteen aangifte doen bij de politie.', correct: false, misconception: 'Denkt dat de politie de eerste stap is bij elk pestgeval.' },
          { text: 'De pester precies hetzelfde terugsturen.', correct: false, misconception: 'Denkt dat terugpesten het snelst helpt.' }
        ],
        feedback: 'Deze vraag hoort bij paragraaf 6.4. Je hoeft het echt niet alleen op te lossen.'
      },
      {
        prompt: 'Hoe noem je het beeld dat anderen van jou hebben?',
        leerdoel: 'Je weet wat de woorden anoniem, omstander en reputatie betekenen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Anoniem zijn: niemand weet wie jij bent.', correct: false, misconception: 'Verwart de naam die je hebt met het ontbreken van een naam.' },
          { text: 'Omstander zijn: je ziet het en helpt niet.', correct: false, misconception: 'Verwart de rol bij het pesten met wat anderen van je denken.' },
          { text: 'Je reputatie: hoe anderen over jou denken.', correct: true, explanation: 'Een pester raakt die goede naam kwijt en wordt minder vertrouwd.' }
        ],
        feedback: 'Deze vraag hoort bij paragraaf 6.3. Reputatie gaat over wat de groep van je vindt.'
      },
      {
        prompt: 'Noem twee klachten van te lang schermgebruik. Zet er per klacht de oorzaak bij.',
        type: 'open',
        leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'De eerste klacht is nek- en rugpijn. De oorzaak is een slechte houding: mijn hoofd hangt te ver naar voren als ik naar mijn scherm kijk. De tweede klacht is slecht in slaap komen. De oorzaak is het blauwe licht van mijn scherm, want dat remt melatonine. Ik kan ook droge ogen of hoofdpijn krijgen, en op de lange duur een bril nodig hebben.',
        nakijkpunten: [
          'Noemt twee verschillende klachten uit de theorie.',
          'Zet bij elke klacht de juiste oorzaak: houding of blauw licht.',
          'Haalt de oorzaken niet door elkaar.'
        ],
        feedback: 'Twee klachten met twee oorzaken vragen ook om twee verschillende oplossingen.'
      }
    ]
  },

  '6.6': {
    learningGoals: [
      'Je kunt drie kenmerken van nepnieuws noemen.',
      'Je weet wat een deepfake is en hoe die gemaakt wordt.',
      'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.'
    ],
    theorie: [
      {
        keyTerms: ['nepnieuws', 'clickbait', 'bron'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je ziet deze kop: "SCHOKKEND: zangeres overlijdt na boosterprik, familie zwijgt!" Er staat geen naam van een schrijver bij. Welke kenmerken van nepnieuws zie je al?</p>',
          '<p><strong>Antwoord.</strong> Twee van de drie kenmerken staan al in die ene regel. Kenmerk 1: de opvallende, schokkende titel met hoofdletters en een uitroepteken. Zo\'n kop wil vooral dat je klikt, en dat heet clickbait. Kenmerk 2: er is geen bron. Je ziet geen schrijver en geen bekende nieuwssite. Kenmerk 3 moet je apart bekijken: is de foto oud of nep? Zoek de foto op en kijk waar hij vandaan komt.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['deepfake', 'factcheck', 'kunstmatige intelligentie'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Er gaat een filmpje rond waarin de minister-president zegt dat de zomervakantie twee weken korter wordt. Hoe controleer je dit in vijf minuten?</p>',
          '<p><strong>Antwoord.</strong> Loop de vier vragen af. Vraag 1: wie heeft dit gepost? Is dat een nieuwsdienst of een onbekend account? Vraag 2: wat is de bron? Staat er een ministerie of een persconferentie bij? Vraag 3: is het al gecontroleerd? Typ de zin in Google en kijk of de NOS of het Jeugdjournaal het meldt. Vraag 4: is het logisch? Zo\'n besluit zou overal in het nieuws staan. Staat het nergens, dan is dat het sterkste teken dat het nep is. Deze controle heet een factcheck.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Nepnieuws herken je aan drie dingen. Een schokkende kop, een ontbrekende bron en oude of neppe foto\'s. Een kop die je vooral moet laten klikken heet clickbait. Een deepfake is een neppe video die met AI gemaakt is. Stel altijd vier vragen. Wie heeft het gemaakt? Wat is de bron? Is het al gecontroleerd? En is het logisch?</p>',
      keyTerms: ['nepnieuws', 'deepfake']
    },
    vragen: [
      {
        prompt: 'Bij nepnieuws hoort altijd een nagemaakte foto; een echte foto kan nooit misleiden.',
        waar: false,
        leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Vaak is de foto echt, maar hoort hij bij een andere gebeurtenis of een ander jaar.'
      },
      {
        prompt: 'Welk kenmerk hoort bij nepnieuws?',
        leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Er staat een foto bij, dus het bericht is echt.', correct: false, misconception: 'Denkt dat beeld op zichzelf bewijs is.' },
          { text: 'Het bericht staat op meerdere sociale media tegelijk.', correct: false, misconception: 'Denkt dat vaak gedeeld worden hetzelfde is als kloppen.' },
          { text: 'De tekst is netjes geschreven, dus zonder spelfouten.', correct: false, misconception: 'Denkt dat een verzorgde tekst betrouwbaar bewijs is.' },
          { text: 'Er wordt geen bron of betrouwbare krant genoemd.', correct: true, explanation: 'Zonder schrijver of bekende nieuwssite kan niemand erop aangesproken worden.' }
        ],
        feedback: 'Nepnieuws ziet er juist vaak verzorgd uit. De ontbrekende bron verraadt het, niet de spelling.'
      },
      {
        prompt: 'Wat is clickbait?',
        leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Een website die betaalt voor elk bericht dat jij verder doorstuurt.', correct: false, misconception: 'Denkt dat clickbait iets met betalen te maken heeft.' },
          { text: 'Een reclame die midden in een filmpje wordt geplaatst.', correct: false, misconception: 'Verwart clickbait met advertenties.' },
          { text: 'Een knop waarmee je een bericht bij de app kunt melden.', correct: false, misconception: 'Verwart clickbait met rapporteren.' },
          { text: 'Een heftige kop die vooral bedoeld is om je te laten klikken.', correct: true, explanation: 'Clickbait betekent letterlijk klik-aas: de kop is het aas.' }
        ],
        feedback: 'Een clickbait-kop is geen samenvatting van het bericht. Hij is lokaas voor jouw klik.'
      },
      {
        prompt: 'Hoe wordt een deepfake gemaakt?',
        leerdoel: 'Je weet wat een deepfake is en hoe die gemaakt wordt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Iemand speelt de persoon na en zet er later ondertiteling onder.', correct: false, misconception: 'Denkt dat een deepfake gewoon een imitatie met montage is.' },
          { text: 'Een oude foto wordt opnieuw geplaatst bij een nieuw bericht.', correct: false, misconception: 'Verwart een deepfake met hergebruikt beeld.' },
          { text: 'AI bekijkt duizenden beelden, plakt het gezicht erover en maakt de stem na.', correct: true, explanation: 'Bij bekende mensen lukt dat het best, want er bestaat veel beeld van hen.' }
        ],
        feedback: 'Pas met die drie stappen samen ontstaat een deepfake. Beeld en geluid kloppen dan allebei.'
      },
      {
        prompt: 'Een deepfake kan ook voor iets positiefs gebruikt worden, bijvoorbeeld in films.',
        waar: true,
        leerdoel: 'Je weet wat een deepfake is en hoe die gemaakt wordt.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        feedback: 'In films kun je een acteur jonger maken. Iemand die zijn stem kwijt is, kan die met AI terugkrijgen.'
      },
      {
        prompt: 'Welke bron is waarschijnlijk het meest betrouwbaar?',
        leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een anoniem account zonder naam of profielfoto.', correct: false, misconception: 'Denkt dat je een bericht kunt vertrouwen zonder te weten wie het schreef.' },
          { text: 'De website van de Universiteit van Amsterdam.', correct: true, explanation: 'Een universiteit zet haar naam onder wat ze publiceert.' },
          { text: 'Een site die Gekke Gabber Nieuws heet.', correct: false, misconception: 'Denkt dat een grappige naam niets over betrouwbaarheid zegt.' }
        ],
        feedback: 'Bij een anoniem account kun je niets controleren. Bij een universiteit kan dat wel.'
      },
      {
        prompt: 'Je wilt positiever met social media omgaan. Welke maatregel hoort bij de theorie uit paragraaf 6.2?',
        leerdoel: 'Je kunt twee dingen noemen die jij kunt doen om positiever met social media om te gaan.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Zoveel mogelijk volgers verzamelen, want dan voel je je beter.', correct: false, misconception: 'Denkt dat meer volgers je zelfbeeld verbetert.' },
          { text: 'Je meldingen uitzetten en pauzes plannen.', correct: true, explanation: 'Dan kies jij het moment waarop je kijkt, in plaats van je telefoon.' },
          { text: 'Alle accounts volgen die je klasgenoten ook volgen.', correct: false, misconception: 'Denkt dat meedoen met de groep het gevoel oplost.' },
          { text: 'Elke foto van jezelf eerst met een filter bewerken.', correct: false, misconception: 'Denkt dat bewerken je onzekerheid wegneemt.' }
        ],
        feedback: 'Deze vraag komt uit paragraaf 6.2. Veel volgers hebben is niet belangrijk voor je gevoel.'
      },
      {
        prompt: 'Waarnaar kijk je tijdens een 20-20-2 pauze?',
        leerdoel: 'Je kunt de 20-20-2 regel uitleggen en toepassen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Naar je telefoon in plaats van je laptop.', correct: false, misconception: 'Denkt dat een ander scherm ook als pauze telt.' },
          { text: 'Naar niets, want je doet je ogen dicht.', correct: false, misconception: 'Denkt dat rust voor je ogen hetzelfde is als ver kijken.' },
          { text: 'Naar een tekst dichtbij op je scherm.', correct: false, misconception: 'Denkt dat de pauze over lezen gaat.' },
          { text: 'Naar iets op minstens 6 meter afstand.', correct: true, explanation: 'Ver weg kijken ontspant de spieren van je ogen.' }
        ],
        feedback: 'Deze vraag komt uit paragraaf 6.5. Twintig seconden ver kijken, en 2 uur per dag naar buiten.'
      },
      {
        prompt: 'Welke vier vragen stel je om te controleren of een bericht klopt? Leg er bij een vraag uit waarom die helpt.',
        type: 'open',
        leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Vraag 1: wie heeft dit gemaakt? Vraag 2: wat is de bron? Vraag 3: is het al door anderen gecontroleerd? Vraag 4: is het logisch? De tweede vraag helpt het meest. Als er geen bekende nieuwssite of organisatie achter zit, kan niemand erop aangesproken worden. Ik kan het ook opzoeken op Nieuwscheckers.nl of het bericht in Google typen.',
        nakijkpunten: [
          'Noemt alle vier de controlevragen uit de theorie.',
          'Legt bij minstens een vraag uit waarom die helpt.',
          'Noemt een manier om te checken, bijvoorbeeld Google of een factchecksite.'
        ],
        feedback: 'Die vier vragen samen heten een factcheck. Vind je op twee vragen geen antwoord, stuur het dan niet door.'
      }
    ]
  },

  '6.7': {
    learningGoals: [
      'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.',
      'Je kunt je resultaat opslaan en delen met je docent.'
    ],
    theorie: [
      {
        keyTerms: ['mediawijs', 'overhoren'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Jayden leest de hele paragraaf drie keer over. Sara dekt de uitleg af en zegt elk begrip eerst hardop. Wie is beter voorbereid op de toets, en waarom?</p>',
          '<p><strong>Antwoord.</strong> Sara. Overhoren werkt beter dan herlezen. Bij herlezen herken je de tekst en denk je: dit weet ik al. Bij overhoren merk je meteen welk begrip je niet uit je hoofd krijgt. Dat begrip is dan je leerpunt. Sara leest daarna alleen dat stuk terug.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['bewijs van deelname', 'herstelspoor'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Ryan maakt de toets en haalt 60 procent. Hij sluit het tabblad en gaat naar de volgende les. De week erna vraagt zijn docent om zijn resultaat. Wat ging hier mis, en wat had hij moeten doen?</p>',
          '<p><strong>Antwoord.</strong> De toets bewaart zijn resultaat niet voor de docent. Door het tabblad te sluiten is zijn bewijs van deelname weg. Hij moet de toets nu opnieuw maken. Dit had hij moeten doen. Stap 1: aan het einde meteen een schermafbeelding maken van het scherm met zijn resultaat. Stap 2: die opslaan in zijn map in OneDrive. Stap 3: hem delen zoals de docent had gezegd.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>In deze toets laat je zien wat je weet. Het gaat over algoritmes, FOMO, cyberpesten, schermgebruik en nepnieuws. Er staan ook vragen in over hoofdstuk 5. De toets gaat namelijk over les 9 tot en met 14. Van je bewijs van deelname maak je een schermafbeelding. Die deel je met je docent. Ging een leerdoel mis, dan volg je het herstelspoor.</p>',
      keyTerms: ['bewijs van deelname', 'herstelspoor']
    },
    vragen: [
      {
        prompt: 'Een algoritme kiest voor iedereen dezelfde berichten, zodat de app eerlijk blijft.',
        waar: false,
        leerdoel: 'Je kunt uitleggen wat een algoritme op social media is.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Het algoritme rekent per persoon iets anders uit. Twee klasgenoten zien daarom een andere tijdlijn.'
      },
      {
        prompt: 'Welk signaal weegt voor het algoritme het zwaarst?',
        leerdoel: 'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een snelle like onder een bericht van een vriend.', correct: false, misconception: 'Denkt dat een like het belangrijkste signaal is.' },
          { text: 'Hoe lang jij naar een filmpje blijft kijken.', correct: true, explanation: 'Doorkijken kost echte minuten en is dus een eerlijker teken van interesse.' },
          { text: 'Het aantal vrienden dat jij in de app hebt.', correct: false, misconception: 'Denkt dat je vriendenlijst de aanbevelingen stuurt.' },
          { text: 'Het merk telefoon waarop je de app opent.', correct: false, misconception: 'Denkt dat je toestel bepaalt wat je te zien krijgt.' }
        ],
        feedback: 'Kijktijd kost jou tijd, en daarom vertrouwt het systeem dat signaal het meest.'
      },
      {
        prompt: 'Wat is een nadeel van algoritmes op social media?',
        leerdoel: 'Je kunt een voordeel en een nadeel van algoritmes noemen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je telefoon wordt er trager van en gaat minder lang mee.', correct: false, misconception: 'Denkt dat het nadeel bij het toestel zit.' },
          { text: 'Je moet betalen voordat je aanbevelingen krijgt.', correct: false, misconception: 'Denkt dat aanbevelingen een betaalde dienst zijn.' },
          { text: 'Je kunt geen berichten meer van vrienden zien.', correct: false, misconception: 'Denkt dat het algoritme vrienden helemaal wegfiltert.' },
          { text: 'Je komt bijna geen andere meningen meer tegen.', correct: true, explanation: 'Het systeem herhaalt wat werkte, dus je aanbod wordt smaller.' }
        ],
        feedback: 'Het nadeel zit in je aanbod, niet in je toestel. Meer van hetzelfde voelt juist prettig.'
      },
      {
        prompt: 'Welke zin beschrijft druk voelen?',
        leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ik koop dezelfde schoenen, want de rest van de groep heeft ze ook.', correct: true, explanation: 'Je doet iets omdat anderen het doen of van je verwachten.' },
          { text: 'Ik kijk elk half uur of ik iets nieuws gemist heb.', correct: false, misconception: 'Verwart druk met FOMO.' },
          { text: 'Ik vind mezelf minder mooi dan de mensen op mijn tijdlijn.', correct: false, misconception: 'Verwart druk met een negatief zelfbeeld.' },
          { text: 'Ik krijg steeds dezelfde soort filmpjes te zien in mijn app.', correct: false, misconception: 'Verwart druk met de filterbubbel.' }
        ],
        feedback: 'Druk stuurt je gedrag buiten je scherm, bijvoorbeeld bij kopen of bij meedoen met een challenge.'
      },
      {
        prompt: 'Wat betekent sociale bevestiging?',
        leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Dat je je goed voelt door het aantal likes en reacties dat je krijgt.', correct: true, explanation: 'Weinig likes voelt dan alsof jij minder waard bent.' },
          { text: 'Dat vrienden je berichten bevestigen voordat ze online komen.', correct: false, misconception: 'Denkt dat er een goedkeuringsstap in de app zit.' },
          { text: 'Dat een app je vraagt of je een bericht echt wilt plaatsen.', correct: false, misconception: 'Verwart sociale bevestiging met een waarschuwing van de app.' },
          { text: 'Dat je alleen accounts volgt die je in het echt kent.', correct: false, misconception: 'Denkt dat het over je volglijst gaat.' }
        ],
        feedback: 'Likes zeggen iets over het moment van posten en over het algoritme. Ze zeggen niets over wie jij bent.'
      },
      {
        prompt: 'Noem twee dingen die jij kunt doen om gezonder met social media om te gaan. Schrijf er per ding bij waarom dat helpt.',
        type: 'open',
        leerdoel: 'Je kunt twee dingen noemen die jij kunt doen om positiever met social media om te gaan.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'reflecteren',
        modelAnswer: 'Ik zet mijn meldingen uit. Dat helpt, want dan word ik niet steeds naar mijn telefoon geroepen en kies ik zelf het moment. Ik volg alleen nog accounts waar ik een goed gevoel van krijg en ontvolg de rest. Dat helpt, want ik vergelijk mezelf dan minder met bewerkte foto\'s. Ook plan ik een dag per week zonder social media.',
        nakijkpunten: [
          'Noemt twee maatregelen die de leerling zelf kan uitvoeren.',
          'Zet bij elke maatregel een reden waarom die helpt.',
          'De maatregelen komen uit de theorie van dit hoofdstuk.'
        ],
        feedback: 'Alle maatregelen hebben hetzelfde doel: jij kiest wanneer je kijkt, en niet je telefoon.'
      },
      {
        prompt: 'Welke situatie is cyberpesten?',
        leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Iemand wordt uit een online groep gezet omdat hij is verhuisd.', correct: false, misconception: 'Denkt dat elke verwijdering uit een groep pesten is.' },
          { text: 'Iemand reageert kritisch op het filmpje van een bekende artiest.', correct: false, misconception: 'Verwart kritiek op een bekende met pesten van een klasgenoot.' },
          { text: 'Iemand stuurt een foto van zijn huiswerk naar de klassenapp.', correct: false, misconception: 'Denkt dat alles in een klassenapp risico op pesten is.' },
          { text: 'Iemand maakt een nepaccount om een klasgenoot belachelijk te maken.', correct: true, explanation: 'Het is digitaal, gericht op een persoon en bedoeld om te kwetsen.' }
        ],
        feedback: 'Een nepaccount maken staat letterlijk in de lijst met voorbeelden uit de les.'
      },
      {
        prompt: 'Welk gevolg hoort bij de pester?',
        leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Hoofdpijn en buikpijn tijdens de lessen op school.', correct: false, misconception: 'Zet de klachten van het slachtoffer bij de pester.' },
          { text: 'Spijt achteraf, omdat hij niets deed terwijl hij het zag.', correct: false, misconception: 'Zet het gevolg van de omstander bij de pester.' },
          { text: 'Angst om nog naar school te durven gaan.', correct: false, misconception: 'Zet de angst van het slachtoffer bij de pester.' },
          { text: 'Straf op school en een slechte reputatie.', correct: true, explanation: 'Bij ernstig pesten kan er zelfs aangifte tegen hem gedaan worden.' }
        ],
        feedback: 'Reputatie gaat altijd over de pester. Dat vertrouwen krijgt hij niet zomaar terug.'
      },
      {
        prompt: 'Wat betekent het woord reputatie?',
        leerdoel: 'Je weet wat de woorden anoniem, omstander en reputatie betekenen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Dat niemand weet wie er achter dat nepaccount zit.', correct: false, misconception: 'Verwart reputatie met anoniem.' },
          { text: 'Iemand die het pesten ziet maar niets doet.', correct: false, misconception: 'Verwart reputatie met omstander.' },
          { text: 'Hoe anderen over jou denken en over jou praten.', correct: true, explanation: 'Een pester kan die goede naam kwijtraken en wordt dan minder vertrouwd.' }
        ],
        feedback: 'Reputatie is je goede naam bij anderen. Anoniem gaat juist over het ontbreken van een naam.'
      },
      {
        prompt: 'Wat neem je mee als bewijs als je een pestbericht wilt melden?',
        leerdoel: 'Je weet wat je kunt doen als je zelf gepest wordt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Screenshots van de gemene berichten in de app.', correct: true, explanation: 'Een screenshot is een foto van je scherm en blijft bestaan als het bericht verdwijnt.' },
          { text: 'Een lijst met namen van alle groepsleden.', correct: false, misconception: 'Denkt dat een namenlijst als bewijs telt.' },
          { text: 'Een verhaal dat je later uit je hoofd navertelt.', correct: false, misconception: 'Denkt dat een eigen verhaal net zo sterk is als bewijs.' },
          { text: 'De gegevens van je eigen account en wachtwoord.', correct: false, misconception: 'Denkt dat je inloggegevens nodig zijn bij een melding.' }
        ],
        feedback: 'Maak de screenshots voordat je blokkeert. Daarna zie je de berichten vaak niet meer.'
      },
      {
        prompt: 'Wat doe je als je online iets ziet wat niet oké is, zoals pesten?',
        leerdoel: 'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je stuurt het door naar anderen, zodat zij het ook zien.', correct: false, misconception: 'Denkt dat doorsturen aandacht vraagt voor het probleem.' },
          { text: 'Je doet niets, want het gaat jou eigenlijk niet aan.', correct: false, misconception: 'Denkt dat toekijken een neutrale keuze is.' },
          { text: 'Je rapporteert het bij de app of het platform.', correct: true, explanation: 'De makers van de app kunnen het bericht dan weghalen.' },
          { text: 'Je maakt een screenshot en plaagt daarna terug.', correct: false, misconception: 'Denkt dat terugpesten het rechttrekt.' }
        ],
        feedback: 'Rapporteren kan altijd, ook als je het slachtoffer niet kent en er geen docent bij is.'
      },
      {
        prompt: 'Waar kun je anoniem hulp vragen bij pesten?',
        leerdoel: 'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Bij Pestweb en de Kindertelefoon.', correct: true, explanation: 'Daar hoef je je naam niet te zeggen, en dat verlaagt de drempel.' },
          { text: 'Bij de leerlingenraad van je eigen school.', correct: false, misconception: 'Denkt dat hulp altijd binnen de school geregeld wordt.' },
          { text: 'Bij de klantenservice van je telefoonprovider.', correct: false, misconception: 'Denkt dat de provider over de inhoud van berichten gaat.' },
          { text: 'Bij de beheerder van de groepsapp zelf.', correct: false, misconception: 'Denkt dat een groepsbeheerder een hulpinstantie is.' }
        ],
        feedback: 'Denk je aan zelfmoord, bel dan gratis 0800-0113. Kijk voor meer informatie op 113.nl.'
      },
      {
        prompt: 'Welke klacht kun je krijgen van een slechte houding achter je scherm?',
        leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Rug- en nekklachten na een lange dag.', correct: true, explanation: 'Je hoofd hangt te ver naar voren en dat geeft spanning op nek en rug.' },
          { text: 'Minder aandacht voor school en vrienden.', correct: false, misconception: 'Zet het gevolg van digitale verslaving bij de houding.' },
          { text: 'Slecht in slaap kunnen komen.', correct: false, misconception: 'Zet het gevolg van blauw licht bij de houding.' },
          { text: 'Rusteloos worden zonder je telefoon.', correct: false, misconception: 'Zet een verslavingssignaal bij een lichamelijke klacht.' }
        ],
        feedback: 'Houding werkt op je spieren. Blauw licht werkt op je slaap en verslaving op je aandacht.'
      },
      {
        prompt: 'Je maakt twee uur huiswerk achter je laptop. Hoe vaak neem je volgens de 20-20-2 regel een pauze?',
        leerdoel: 'Je kunt de 20-20-2 regel uitleggen en toepassen.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'Twee keer, want je pauzeert na elk vol uur werken.', correct: false, misconception: 'Denkt dat de pauze om het uur komt in plaats van om de 20 minuten.' },
          { text: 'Zes keer, want twee uur zijn zes blokken van 20 minuten.', correct: true, explanation: 'Deel 120 door 20: je pauzeert na 20, 40, 60, 80, 100 en 120 minuten.' },
          { text: 'Twintig keer, want de regel heet niet voor niets 20-20-2.', correct: false, misconception: 'Leest de getallen van de regel als een aantal pauzes.' },
          { text: 'Nul keer, want de 20-20-2 regel geldt alleen voor je telefoon.', correct: false, misconception: 'Denkt dat de regel niet voor een laptop of een pc geldt.' }
        ],
        feedback: 'Deel de minuten altijd door 20. Een uur huiswerk geeft dus drie pauzes en anderhalf uur vier.'
      },
      {
        prompt: 'Vaak op je telefoon zitten is op zichzelf al een digitale verslaving.',
        waar: false,
        leerdoel: 'Je weet waaraan je digitale verslaving bij jezelf kunt herkennen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Het gaat om de onrust en om de gevolgen voor school, familie en hobby\'s, niet om het aantal uren alleen.'
      },
      {
        prompt: 'Noem de drie kenmerken van nepnieuws. Geef bij een kenmerk een voorbeeld.',
        type: 'open',
        leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Kenmerk 1 is een opvallende, schokkende titel. Een voorbeeld is de kop "zangeres overlijdt na boosterprik, familie zwijgt". Zo\'n kop heet clickbait. Kenmerk 2 is dat er geen betrouwbare bron genoemd wordt. Er staat dan geen schrijver bij en geen bekende nieuwssite zoals de NOS. Kenmerk 3 zijn oude of neppe foto\'s, bijvoorbeeld een explosie van tien jaar geleden bij een nieuw bericht.',
        nakijkpunten: [
          'Noemt alle drie de kenmerken: opvallende titel, geen betrouwbare bron, oude of neppe foto.',
          'Geeft bij minstens een kenmerk een concreet voorbeeld.',
          'Gebruikt het woord clickbait of legt uit wat zo\'n kop wil bereiken.'
        ],
        feedback: 'Een verzorgde tekst of een foto erbij bewijst niets. Juist die drie kenmerken helpen je verder.'
      },
      {
        prompt: 'Wat is een deepfake?',
        leerdoel: 'Je weet wat een deepfake is en hoe die gemaakt wordt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een foto die met een filter mooier is gemaakt dan in het echt.', correct: false, misconception: 'Verwart een deepfake met filters en bewerkingen.' },
          { text: 'Een kop die overdreven is om jou te laten klikken.', correct: false, misconception: 'Verwart een deepfake met clickbait.' },
          { text: 'Een oud filmpje dat bij een nieuw bericht wordt gezet.', correct: false, misconception: 'Verwart een deepfake met hergebruikt beeld.' },
          { text: 'Een video met AI waarin iemand iets zegt wat nooit gebeurd is.', correct: true, explanation: 'Beeld en stem worden allebei nagemaakt, dus het lijkt volledig echt.' }
        ],
        feedback: 'Bij een deepfake is het beeld zelf gemaakt. Bij hergebruikt beeld is de video echt maar de context nep.'
      },
      {
        prompt: 'Waarom is het belangrijk om de bron van een bericht te checken?',
        leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Om te kijken of een leuk persoon het geschreven heeft.', correct: false, misconception: 'Denkt dat de schrijver sympathiek moet zijn.' },
          { text: 'Om te kijken of het artikel wel in Nederland geschreven is.', correct: false, misconception: 'Denkt dat het land van herkomst bepaalt of iets klopt.' },
          { text: 'Zo kun je achterhalen of het nieuws echt of nep is.', correct: true, explanation: 'Nepnieuws is gevaarlijk zodra mensen het geloven en doorsturen.' },
          { text: 'Om te kijken of je het bericht zelf interessant vindt.', correct: false, misconception: 'Denkt dat je eigen interesse iets over betrouwbaarheid zegt.' }
        ],
        feedback: 'Een bron is de schrijver of organisatie achter een bericht. Zonder bron kan niemand ergens op aangesproken worden.'
      },
      {
        prompt: 'Hoe deel je het bewijs van je toetsresultaat met je docent?',
        leerdoel: 'Je kunt je resultaat opslaan en delen met je docent.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Je noteert je cijfer op papier en laat dat later even zien.', correct: false, misconception: 'Denkt dat een eigen aantekening als bewijs telt.' },
          { text: 'Je hoeft niets te doen, want de toets stuurt het zelf door.', correct: false, misconception: 'Denkt dat de resultaten automatisch bij de docent komen.' },
          { text: 'Je stuurt de link van de toets door naar je docent.', correct: false, misconception: 'Denkt dat de link het persoonlijke resultaat bevat.' },
          { text: 'Je maakt een schermafbeelding van je bewijs van deelname.', correct: true, explanation: 'Die sla je op in OneDrive en deel je zoals je docent heeft aangegeven.' }
        ],
        feedback: 'De toets bewaart je resultaat niet voor je docent. Sluit je het tabblad, dan begin je opnieuw.'
      },
      {
        prompt: 'Je bewijs van deelname verschijnt pas aan het einde van de toets.',
        waar: true,
        leerdoel: 'Je kunt je resultaat opslaan en delen met je docent.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Maak dus meteen een schermafbeelding van dat eindscherm, voordat je iets anders doet.'
      },
      {
        prompt: 'Wat is een voorbeeld van een waarde?',
        leerdoel: 'Je weet wat normen en waarden zijn en hoe ze online gelden.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je mag online niemand uitschelden.', correct: false, misconception: 'Verwart een waarde met een gedragsregel.' },
          { text: 'Je maakt geen nepaccounts aan.', correct: false, misconception: 'Verwart een waarde met een regel over gedrag.' },
          { text: 'Je deelt geen privégegevens.', correct: false, misconception: 'Verwart een waarde met een afspraak over privacy.' },
          { text: 'Respect hebben voor een ander.', correct: true, explanation: 'Een waarde is iets wat jij belangrijk vindt en zit vanbinnen.' }
        ],
        feedback: 'Deze vraag komt uit hoofdstuk 5. Een gedragsregel volgt uit een waarde, maar is niet hetzelfde.'
      },
      {
        prompt: 'Wat is een goede reden om je social media-account op privé te zetten?',
        leerdoel: 'Je kunt je account op privé zetten en je bio veilig invullen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Dan krijg je meer likes op je berichten.', correct: false, misconception: 'Denkt dat privé zetten je bereik vergroot.' },
          { text: 'Dan kun je zien wie jouw profiel bezoekt.', correct: false, misconception: 'Denkt dat de app bezoekers laat zien.' },
          { text: 'Om je privacy en je gegevens te beschermen.', correct: true, explanation: 'Alleen mensen die jij goedkeurt zien dan je berichten en foto\'s.' },
          { text: 'Dan kun je meer apps op je telefoon downloaden.', correct: false, misconception: 'Denkt dat accountinstellingen met opslagruimte te maken hebben.' }
        ],
        feedback: 'Ook deze vraag komt uit hoofdstuk 5. Privé zetten beperkt wie er meekijkt, meer niet.'
      },
      {
        prompt: 'Het algoritme is een computerregel die uitrekent welke berichten jij te zien krijgt.',
        waar: true,
        leerdoel: 'Je kunt uitleggen wat een algoritme op social media is.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Er zit dus geen mens achter die jouw tijdlijn samenstelt. Het is rekenwerk van de app zelf.'
      },
      {
        prompt: 'Sanne zoekt een keer naar voetbalschoenen. Daarna ziet zij er dagenlang meer van. Hoe komt dat?',
        leerdoel: 'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Haar zoekopdracht is een signaal en dat herhaalt de app.', correct: true, explanation: 'Zoeken, klikken en kijktijd zijn alle drie signalen voor het systeem.' },
          { text: 'De winkel heeft haar telefoonnummer aan de app gegeven.', correct: false, misconception: 'Denkt dat een winkel de tijdlijn vult.' },
          { text: 'Voetbalschoenen zijn deze week bij iedereen trending.', correct: false, misconception: 'Denkt dat iedereen dezelfde tijdlijn krijgt.' },
          { text: 'Zij heeft per ongeluk een advertentie aangezet.', correct: false, misconception: 'Denkt dat je aanbevelingen zelf inschakelt.' }
        ],
        feedback: 'Eenmaal zoeken is al genoeg. Kijk je de filmpjes daarna ook uit, dan wordt het effect sterker.'
      },
      {
        prompt: 'Een voordeel van het algoritme is dat je snel muziek, sport of games vindt die bij je passen.',
        waar: true,
        leerdoel: 'Je kunt een voordeel en een nadeel van algoritmes noemen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Dit is de goede kant van het systeem. Vraag je daarna altijd af wat je er niet meer door ziet.'
      },
      {
        prompt: 'FOMO betekent dat je iets moet doen omdat de rest van de groep het ook doet.',
        waar: false,
        leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Dat is de omschrijving van druk. FOMO is bang zijn dat je iets mist als je niet kijkt.'
      },
      {
        prompt: 'Je ziet in je tijdlijn bijna alleen nog filmpjes over hetzelfde onderwerp. Hoe heet dat?',
        leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Sociale bevestiging.', correct: false, misconception: 'Verwart de bubbel met het afmeten van je waarde aan likes.' },
          { text: 'Een filterbubbel.', correct: true, explanation: 'Het systeem geeft meer van hetzelfde, dus je aanbod wordt smaller.' },
          { text: 'Het highlight reel-effect.', correct: false, misconception: 'Verwart wat jij krijgt met wat anderen posten.' },
          { text: 'Clickbait.', correct: false, misconception: 'Verwart de bubbel met een kop die je wil laten klikken.' }
        ],
        feedback: 'Let op het verschil. Een filterbubbel gaat over jouw tijdlijn, het highlight reel-effect over hun posts.'
      },
      {
        prompt: 'Meldingen uitzetten is een manier om positiever met social media om te gaan.',
        waar: true,
        leerdoel: 'Je kunt twee dingen noemen die jij kunt doen om positiever met social media om te gaan.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Zonder melding kies jij zelf het moment. Pauzes plannen en positieve accounts volgen werken net zo.'
      },
      {
        prompt: 'Cyberpesten stopt zodra je thuiskomt en je je telefoon weglegt.',
        waar: false,
        leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Cyberpesten gaat dag en nacht door. Juist daardoor voelt het zwaarder dan pesten op het schoolplein.'
      },
      {
        prompt: 'Wie krijgt er last van spijt of een schuldgevoel na cyberpesten?',
        leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De omstander die het zag en niets deed.', correct: true, explanation: 'Wie toekeek denkt achteraf vaak: ik had iets kunnen zeggen.' },
          { text: 'De mentor die het pesten moest oplossen.', correct: false, misconception: 'Denkt dat de gevolgen bij de school liggen.' },
          { text: 'De ouders van de leerling die meelas.', correct: false, misconception: 'Denkt dat de gevolgen bij de ouders liggen.' },
          { text: 'De maker van de app waarin het gebeurde.', correct: false, misconception: 'Denkt dat het platform de gevolgen draagt.' }
        ],
        feedback: 'De drie rollen zijn slachtoffer, pester en omstander. Spijt achteraf hoort bij die laatste.'
      },
      {
        prompt: 'Anoniem betekent dat niemand weet wie jij bent.',
        waar: true,
        leerdoel: 'Je weet wat de woorden anoniem, omstander en reputatie betekenen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Anoniem gaat over jouw naam. Reputatie gaat over hoe anderen over jou denken.'
      },
      {
        prompt: 'Word je zelf gepest, dan verwijder je de app het beste meteen.',
        waar: false,
        leerdoel: 'Je weet wat je kunt doen als je zelf gepest wordt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Dan raak je je bewijs kwijt. Praat er eerst over, maak screenshots en blokkeer daarna pas.'
      },
      {
        prompt: 'Je ziet een klasgenoot uitgescholden worden in een groepsapp. Wat helpt hem het meest?',
        leerdoel: 'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De app een paar dagen niet meer openen.', correct: false, misconception: 'Denkt dat wegkijken het probleem oplost.' },
          { text: 'Wachten tot iemand anders er iets van zegt.', correct: false, misconception: 'Denkt dat helpen de taak van een ander is.' },
          { text: 'Hem een berichtje sturen: he, gaat het wel?', correct: true, explanation: 'Dan voelt hij zich minder alleen, en jij hoeft niets in de groep te zeggen.' },
          { text: 'De berichten doorsturen naar een andere groep.', correct: false, misconception: 'Ziet niet dat doorsturen het pesten juist verspreidt.' }
        ],
        feedback: 'Niets zeggen laat het lijken alsof het goed is zo. Een berichtje kost weinig en helpt echt.'
      },
      {
        prompt: 'Aangifte doen betekent dat je naar de politie gaat om iets ergs te melden.',
        waar: true,
        leerdoel: 'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Melden bij de app zelf heet rapporteren. Aangifte doe je bij de politie, dat is dus iets anders.'
      },
      {
        prompt: 'Van te lang schermgebruik kun je ook moe en prikkelbaar worden.',
        waar: true,
        leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Zulke klachten zijn een signaal. Je hoeft niet te stoppen met schermen, wel bewuster te worden.'
      },
      {
        prompt: 'De 2 uit de 20-20-2 regel betekent: twee uur achter elkaar zonder scherm.',
        waar: false,
        leerdoel: 'Je kunt de 20-20-2 regel uitleggen en toepassen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'De 2 betekent minstens 2 uur per dag buiten zijn. Die hoort bij je hele dag, niet bij je pauze.'
      },
      {
        prompt: 'Waaraan herken je digitale verslaving bij jezelf?',
        leerdoel: 'Je weet waaraan je digitale verslaving bij jezelf kunt herkennen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je hebt meer dan tien apps op je telefoon staan.', correct: false, misconception: 'Denkt dat het aantal apps iets zegt.' },
          { text: 'Je wordt rusteloos als je niet op je telefoon kunt.', correct: true, explanation: 'De onrust en de gevolgen voor school en hobby zijn de tekenen.' },
          { text: 'Je kijkt elke dag even naar het nieuws.', correct: false, misconception: 'Denkt dat dagelijks gebruik al verslaving is.' },
          { text: 'Je telefoon is bijna elke avond leeg.', correct: false, misconception: 'Denkt dat de accu iets over verslaving zegt.' }
        ],
        feedback: 'Veel op je telefoon zitten is nog geen verslaving. Het gaat om de onrust en om wat je laat liggen.'
      },
      {
        prompt: 'Een kop met hoofdletters en uitroeptekens die je wil laten klikken heet clickbait.',
        waar: true,
        leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Clickbait is kenmerk 1. De andere twee zijn: er is geen bron, en de foto is oud of nep.'
      },
      {
        prompt: 'Een deepfake maak je door een foto wat lichter of donkerder te maken.',
        waar: false,
        leerdoel: 'Je weet wat een deepfake is en hoe die gemaakt wordt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Een deepfake maakt AI uit duizenden beelden. Het gezicht en de stem worden nagemaakt.'
      },
      {
        prompt: 'Je leest iets schokkends op een onbekend account. Wat is je eerste stap?',
        leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Doorsturen naar je groepsapp en vragen wat zij ervan vinden.', correct: false, misconception: 'Denkt dat de mening van vrienden een controle is.' },
          { text: 'Kijken hoeveel likes en reacties het bericht heeft.', correct: false, misconception: 'Denkt dat veel likes bewijzen dat iets klopt.' },
          { text: 'Het bericht bewaren en er morgen nog eens naar kijken.', correct: false, misconception: 'Denkt dat wachten hetzelfde is als controleren.' },
          { text: 'De zin in Google typen en kijken of de NOS het meldt.', correct: true, explanation: 'Bij groot nieuws melden bekende nieuwssites het ook. Staat het nergens, dan klopt het waarschijnlijk niet.' }
        ],
        feedback: 'Zo een controle heet een factcheck en kost twee minuten. Doorsturen kun je daarna altijd nog.'
      },
      {
        prompt: 'De begrippen uit hoofdstuk 5, zoals norm, waarde en privacy, tellen ook mee in deze toets.',
        waar: true,
        leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Deze eindtoets gaat over les 9 tot en met 14. Neem hoofdstuk 5 dus ook door voor je begint.'
      },
      {
        prompt: 'Welke twee onderwerpen uit dit hoofdstuk vond jij het moeilijkst? Schrijf op wat je eraan gaat doen.',
        type: 'open',
        leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'reflecteren',
        modelAnswer: 'Ik vond de gevolgen per rol bij cyberpesten het moeilijkst. Ik haalde de pester en het slachtoffer door elkaar. Ik ga de steunopgave met de drie rollen opnieuw maken en er een schema van tekenen. Ook de 20-20-2 regel vond ik lastig, want ik dacht dat de 2 twee uur zonder scherm betekende. Ik lees paragraaf 6.5 terug en overhoor mezelf daarna.',
        nakijkpunten: [
          'Noemt twee concrete onderwerpen uit dit hoofdstuk, met de paragraaf erbij.',
          'Zegt per onderwerp wat er precies misging.',
          'Zegt precies wat je gaat doen, en niet alleen dat je beter gaat leren.'
        ],
        feedback: 'Twee onderwerpen kiezen is realistischer dan alles opnieuw doen. Gericht terugzoeken levert het meeste op.'
      }
    ]
  }
};
