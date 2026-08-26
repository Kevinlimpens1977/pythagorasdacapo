// Hoofdstuk 6 - Mediawijs: social media, welzijn en betrouwbaar nieuws.
// Theoretische leerweg (tl).
//
// Bron: het Wikiwijs-arrangement "Digitale Geletterdheid" van DaCapo College.
//   6.1 en 6.2  <- les 11 "De invloed van social media"
//   6.3 en 6.4  <- les 12 "Cyberpesten"
//   6.5         <- les 13 "Digitaal gezond blijven"
//   6.6         <- les 14 "Nepnieuws en betrouwbare bronnen"
//   6.7         <- les 15 "Eindtoets les 9 t/m 14: Mediawijsheid"
//   6.8         <- toegevoegde vrijwillige plusparagraaf, geen Wikiwijs-bron.
//                  In eigen woorden geschreven op basis van Schooltv
//                  (De dikke data show - Filterbubbel) en Mediawijsheid.nl;
//                  beide bronnen staan in de lestekst zelf genoemd.
//
// Voor de theoretische leerweg staan de lesteksten uit de bron er zo letterlijk
// mogelijk in: elke alinea, elke opdracht, elke stap en elke link uit les 11 t/m
// 15 komt hier terug. Wat toegevoegd is (6.8 en de aanvullingen in de
// opdrachten) is in eigen woorden geschreven met de bron erbij in de tekst.
//
// RONDE 2 - wat er in deze versie gerepareerd is
// ----------------------------------------------
// 1. Vier brononderdelen die in ronde 1 verdwenen waren staan er weer in:
//    - les 12, de alinea bij de tweede video over strafbaar zijn en iemand tot
//      wanhoop drijven -> 6.4 theorieblok 2;
//    - les 15, de invulopgave over je ogen: een bril doordat je te vaak dichtbij
//      kijkt -> 6.5 theorieblok 1 en de oefening in 6.5;
//    - les 13, de koppelopgave "Welk gevolg hoort bij welk probleem" -> 6.5
//      oefenblok, met houding -> rug- en nekklachten als JUISTE koppeling;
//    - les 13, de slotalinea "Wat neem jij mee uit deze les?" met moe,
//      prikkelbaar, slimmer en bewuster -> 6.5 theorieblok 2.
//    Daarnaast staat rapporteren bij de app of het platform nu als het juiste
//    gedrag van een omstander in 6.4 (les 15), en zijn de begrippen filters en
//    bewerkingen en influencer uit de koppelopgave van les 15 in 6.2 bevraagd.
// 2. `checks` zijn nu startvraag-objecten met antwoord en uitleg. Daardoor zet
//    de generator de Digidocent op de startcheck uit en komt de uitleg pas na
//    het antwoord van de leerling. 6.1 opent bovendien met vier
//    voorkennisvragen over hoofdstuk 5, want de bron-eindtoets gaat over les 9
//    t/m 14.
// 3. Elke paragraaf heeft een `oefenen`-blok met samen oefenen, zelf oefenen,
//    extra steun en extra plus (stap 4, 5 en 6 van de blauwdruk). In 6.3 zit
//    daarin de deeltoets over 6.1 t/m 6.3, in 6.7 de diagnostische toets met
//    per gemist doel het herhaalmateriaal erbij.
// 4. Elke praktijkopdracht is nu een object met modelAnswer en nakijkpunten, dus
//    het zwaarste blok van de paragraaf is na te kijken.
// 5. Zinnen boven de dertig woorden zijn geknipt, "zo een" is "zo'n" geworden,
//    en woorden als narekenen, weerleggen en versmallen zijn vervangen of
//    uitgelegd.
//
// RONDE 3 - wat er in deze versie gerepareerd is
// ----------------------------------------------
// 1. Zeven theoriezinnen boven de 23 woorden zijn geknipt, in 6.3, 6.5 (twee
//    keer), 6.6, 6.7 (twee keer) en 6.8. Voor tl is 15 tot 20 woorden de norm;
//    de langste zin van het hoofdstuk telt er nu 22 in plaats van 30. Ook het
//    betrekkelijk voornaamwoord "wier" in 6.8 is weg: daar staat nu "gebruikers
//    met een profiel dat op dat van jou lijkt". Een brugklasser gebruikt "wier"
//    niet zelf, en 6.8 is juist de paragraaf die hij zonder docent maakt.
// 2. De alinea onder punt 2 hierboven over 15 tokens op het startcheckblok is
//    verwijderd. Dat klopte niet meer: in de gegenereerde seed heeft het
//    startcheckblok tokenConfig.enabled false en tokenTotal 0, precies zoals de
//    blauwdruk wil. De melding stond er dus een probleem op te lossen dat er
//    niet meer is.
// 3. Bewust NIET in de hoofdstuktoets van 6.7, wel elders in de seed - dit
//    stond in ronde 2 nergens vast en staat er nu wel:
//    - de drie toetsitems van les 15 over de risico's van bestellen in China,
//      de nep-URL www.nike_sport.com en het scenario goedkopegames.nl. Ze horen
//      inhoudelijk bij hoofdstuk 5 (online shoppen en betalen) en worden daar
//      bevraagd. In 6.7 komen ze terug in het diagnoseblok, niet in de toets;
//    - de negen items die in ronde 3 uit de hoofdstuktoets zijn gehaald om hem
//      terug te brengen naar 44. Dat zijn: filters en bewerkingen, influencer
//      (allebei nog in de afsluitquiz van 6.2), het gevolg voor het slachtoffer
//      van cyberpesten en blokkeren (nog in 6.3 en 6.4), blauw licht en het
//      gevolg van een slechte houding (nog in 6.5), de vier controlevragen (nog
//      in 6.6), en twee waar-niet-waar-vragen over FOMO en over kijktijd die
//      allebei al door een open vraag in dezelfde toets gedekt worden.
//    Er is dus geen bronitem uit de seed verdwenen; alleen de plaats verschilt.
//    De open vraag over de omstander in 6.7 vraagt sinds ronde 3 ook naar wat
//    het pesten met het slachtoffer doet, zodat die kant in de toets blijft.
// 4. De hoofdstuktoets van 6.7 telde 53 items; dat waren er 13 meer dan de
//    dekkingseis van twee per leerdoel rechtvaardigt. Hij telt er nu 44: precies
//    twee per verplicht leerdoel van dit hoofdstuk (20 x 2), plus de vier
//    terugblikvragen over hoofdstuk 5 die de bron-eindtoets nu eenmaal stelt.
//    In de gesloten vragen is bovendien bij dertien items de redengevende bijzin
//    van het goede antwoord naar `explanation` verhuisd. Blind op de langste
//    knop klikken leverde 22 van de 45 gesloten vragen goed op (49 procent) en
//    levert er nu 2 van de 36 op (6 procent).
//    Het diagnoseblok blijft 24 opgaven tellen: dat is er precies een per
//    leerdoel, en dat is de reden dat het herstelspoor per gemist doel kan
//    aanwijzen waar de leerling moet zijn. Wat wel verandert is de planning.
//    6.7 staat nu als paragraaf van twee lesuren in de tekst: diagnose en
//    herhalen in het eerste uur, de toets en het bewijs in het tweede. Een
//    hoofdstuktoets over vijf bronlessen past niet in een lesuur, en dat hoort
//    in de lestekst te staan in plaats van in de hoop van de bouwer.
// 5. De opgave "Klik op de afbeelding waarop je een slechte houding ziet" uit
//    les 13 en les 15 was in ronde 2 alleen een kijkvraag bij twee losse
//    afbeeldingen. De leerling las de vraag maar klikte niets aan. In 6.5 staat
//    nu ook een echt na te kijken item: vier leerlingen achter hun laptop,
//    kies degene met de slechte houding. De kijkvraag bij het beeld blijft.
//
// De verrijking (leerdoelen, kernbegrippen, uitgewerkte voorbeelden,
// samenvattingen en alle toetsvragen) staat in
// scripts/seed-verrijking/tl/h6.mjs.

import { p, checkpoint, media } from '../helpers.mjs';

export default {
  chapter: 6,
  chapterTitle: 'Mediawijs: social media, welzijn en betrouwbaar nieuws',
  badge: 'Mediawijs',
  paragraphs: [
    p('6.1', 'Social media en het algoritme', ['21B', '21C'], 'feedonderzoek met tien aanbevelingen en jouw verklaring erbij', 100, 'Feed Fabriek',
      ['Social media en de computerregel achter jouw tijdlijn',
        "Social media zijn online platforms waar je informatie deelt met anderen, zoals Instagram, WhatsApp en TikTok. Je gebruikt ze waarschijnlijk elke dag, maar wie bepaalt eigenlijk wat jij te zien krijgt? Juist, het algoritme: een slimme computerregel die kiest welke filmpjes en berichten in jouw tijdlijn komen. Die regel kiest wat je waarschijnlijk leuk vindt, zodat je langer blijft kijken en vaker terugkomt. Dat is geen toeval, want een platform verdient geld met advertenties en verdient meer als jij langer blijft. Het algoritme is dus geen mens die jou kent, maar een berekening die jouw gedrag vergelijkt met dat van anderen. Is het je wel eens opgevallen dat je tijdens het shoppen steeds meer van die blauwe truien voorgesteld krijgt? Juist, dat is een algoritme aan het werk, en het gebruikt daarvoor alleen jouw eigen gedrag van daarnet. Begrijp vooral dit: de computerregel kiest niet wat waar of belangrijk is, maar wat jouw aandacht vasthoudt. Twee klasgenoten die naast elkaar zitten en dezelfde app openen, zien daarom een compleet andere tijdlijn."],
      ['Hoe het algoritme jou leert kennen',
        'Het algoritme leert van jou, en het doet dat voortdurend, zonder jou ooit iets te vragen. Het houdt bij welke dingen je aanklikt, hoe lang je naar iets kijkt en welke dingen je opzoekt. Ook je likes, je reacties en de accounts die je volgt tellen als aanwijzingen mee. Zelfs het moment waarop je stopt met scrollen is een gegeven waar het systeem iets van leert. Uit al die kleine gegevens bouwt het een lijst met jouw voorkeuren op, die bij elke sessie preciezer wordt. Kijktijd weegt daarbij zwaarder dan een like, want doorkijken is een eerlijker teken van interesse dan een snelle tik. Dat levert je echte voordelen op: je vindt sneller muziek, sport of humor die bij je past en hoeft minder te zoeken. Er zit ook een duidelijk nadeel aan, en dat merk je pas als je erop let. Wie alleen nog krijgt wat hij al leuk vindt, komt bijna geen andere meningen en geen andere beelden meer tegen. Bovendien bepaalt het algoritme mee wat trending wordt, dus wat op dat moment overal tegelijk populair lijkt. Een filmpje dat toevallig goed scoort wordt vaker getoond, en juist daardoor wordt het nog populairder. Populair zijn en veel getoond worden lopen op social media dus voortdurend door elkaar heen.'],
      media('https://app.nos.nl/op3/algoritmes/', 'NOS op3: zo werken algoritmes', 'Welke twee dingen doet het algoritme volgens deze pagina met jouw gedrag?'),
      [
        {
          vraag: 'Terugblik hoofdstuk 5. Wat is het verschil tussen een waarde en een gedragsregel?',
          antwoord: 'Een waarde is iets wat jij belangrijk vindt, zoals respect of eerlijkheid. Een gedragsregel zegt hoe je je hoort te gedragen, bijvoorbeeld: je scheldt niemand uit online.',
          uitleg: 'Een waarde zit vanbinnen en is voor iedereen een beetje anders. Een gedragsregel is de afspraak die uit die waarde volgt en die je kunt nakijken.',
          leerdoel: 'Je weet wat normen en waarden zijn en hoe ze online gelden.'
        },
        {
          vraag: 'Terugblik hoofdstuk 5. Waarom zet je je social media-account op privé?',
          antwoord: 'Om je privacy te beschermen: alleen mensen die je zelf goedkeurt kunnen dan je berichten en je foto\'s zien.',
          uitleg: 'Privé zetten geeft je geen extra likes en laat je ook niet zien wie je profiel bezoekt. Het beperkt alleen wie er meekijkt, en dat is precies het doel.',
          leerdoel: 'Je kunt je account op privé zetten en je bio veilig invullen.'
        },
        {
          vraag: 'Terugblik hoofdstuk 5. Noem twee dingen waaraan je ziet of een webshop te vertrouwen is.',
          antwoord: 'Je controleert de URL en je zoekt op de naam van de winkel naar reviews. Ook let je op een adres, meerdere betaalmethodes en hoe lang de site al bestaat.',
          uitleg: 'Een prijs die veel te laag is en het ontbreken van contactgegevens zijn allebei rode vlaggen. Een slotje alleen zegt niet dat de winkel eerlijk is.',
          leerdoel: 'Je kunt vijf checks doen om te zien of een webshop betrouwbaar is.'
        },
        {
          vraag: 'Terugblik hoofdstuk 5. Wat is het risico van achteraf betalen met bijvoorbeeld Klarna?',
          antwoord: 'Je kunt vergeten te betalen of je hebt het geld later toch niet. Dan komen er extra kosten bij en kun je in de geldproblemen komen.',
          uitleg: 'Achteraf betalen voelt gratis omdat er op dat moment niets van je rekening gaat. De rekening komt wel, meestal binnen dertig dagen.',
          leerdoel: 'Je kunt de risico\'s van achteraf betalen uitleggen.'
        },
        {
          vraag: 'Wat denk jij dat een algoritme op social media is? Schrijf je eigen omschrijving op, ook als je het niet zeker weet.',
          antwoord: 'Een algoritme is een computerregel die uitrekent welke filmpjes en berichten jij te zien krijgt.',
          uitleg: 'Het is dus geen medewerker die kiest en geen knop die jij zelf aanzet. Het is een berekening die per persoon een andere uitkomst geeft.',
          leerdoel: 'Je kunt uitleggen wat een algoritme op social media is.'
        },
        {
          vraag: 'Waar denk jij dat het algoritme iets van leert als jij op je telefoon zit? Noem drie dingen.',
          antwoord: 'Van je klikken, van hoe lang je naar iets kijkt en van wat je opzoekt. Ook likes, reacties, gevolgde accounts en wegswipen tellen mee.',
          uitleg: 'Kijktijd weegt het zwaarst, want doorkijken kost je echte minuten. Een like is maar één tik en zegt daarom minder.',
          leerdoel: 'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.'
        },
        {
          vraag: 'Bedenk vast een voordeel en een nadeel van algoritmes. Wat is volgens jou het grootste nadeel?',
          antwoord: 'Voordeel: je vindt sneller wat bij je past. Nadeel: je krijgt bijna alleen nog meer van hetzelfde en mist andere meningen en beelden.',
          uitleg: 'Het nadeel zit niet in je toestel maar in je aanbod. Je merkt het pas als je erop let, want meer van hetzelfde voelt juist prettig.',
          leerdoel: 'Je kunt een voordeel en een nadeel van algoritmes noemen.'
        }
      ],
      {
        tekst: "Onderzoek jouw eigen feed. Stap 1: scroll de pagina van NOS op3 over algoritmes helemaal door (https://app.nos.nl/op3/algoritmes/) en lees de teksten. Werkt de link niet, kopieer en plak hem dan in je browser. Stap 2: beantwoord in een Word-bestand de drie vragen uit de bron. (a) Waarom denk je dat algoritmes ervoor zorgen dat je steeds nieuwe filmpjes of berichten te zien krijgt die je interessant vindt? Wat zou een reden kunnen zijn om een algoritme te gebruiken? (b) Wat zou er kunnen gebeuren als een algoritme alleen maar laat zien wat je leuk vindt? Kan dat ook nadelen hebben? Leg uit. (c) Denk je dat het algoritme ook invloed kan hebben op wat mensen populair vinden of wat trending wordt? Waarom wel of niet? Stap 3: open daarna een app die jij vaak gebruikt en bekijk de eerste tien video's of berichten. Zet in een tabel per item waarover het gaat en waarom jij denkt dat je juist dat item krijgt. Stap 4: schrijf onder je tabel vijf regels waarin je het voordeel en het nadeel uit de theorie terugzoekt in jouw eigen tien items. Lever het bestand in bij je docent.",
        label: 'Lever je feedonderzoek in: de drie antwoorden uit de bron, je tabel met tien items en je vijf regels conclusie.',
        modelAnswer: "(a) Algoritmes tonen steeds nieuwe filmpjes die ik interessant vind, omdat het platform wil dat ik langer blijf kijken. Hoe langer ik blijf, hoe meer advertenties ik zie en hoe meer het platform verdient. Een reden om een algoritme te gebruiken is ook dat ik zelf sneller vind wat bij mij past. (b) Als het algoritme alleen laat zien wat ik leuk vind, kom ik bijna geen andere meningen en beelden meer tegen. Dat is een nadeel, want ik ga dan denken dat iedereen erover denkt zoals ik. (c) Ja, het algoritme heeft invloed op wat trending wordt. Een filmpje dat goed scoort wordt vaker getoond, en daardoor krijgt het nog meer weergaven. In mijn tabel staan tien items: vier over voetbal, drie over gaming, twee over muziek en één advertentie voor schoenen. De voetbalitems krijg ik omdat ik die video's helemaal uitkijk. De schoenen krijg ik omdat ik gisteren op een webshop naar schoenen zocht. In mijn tien items zie ik het voordeel terug: acht van de tien gingen over iets wat ik echt leuk vind, dus ik hoef niet te zoeken. Het nadeel zie ik ook: er zat geen enkel nieuwsitem bij en geen enkel onderwerp waar ik nog nooit naar gekeken had.",
        nakijkpunten: [
          'De drie vragen uit de bron zijn alle drie beantwoord, met een uitleg en niet alleen ja of nee.',
          'De tabel bevat tien items met per item het onderwerp én een verklaring waarom juist dat item verschijnt.',
          'In de vijf regels conclusie worden het voordeel en het nadeel uit de theorie teruggezocht in de eigen tien items.',
          'Er wordt minstens één sterk signaal genoemd, bijvoorbeeld kijktijd of een zoekopdracht.'
        ]
      },
      ['Wat is een algoritme op social media?', 'Waarvan leert het algoritme?', 'Waarom weegt kijktijd zwaarder dan een like?', 'Noem een voordeel van algoritmes.', 'Hoe kan een algoritme meebepalen wat trending wordt?'],
      'Bouw een tijdlijn: kies signalen, kijk wat het algoritme daarna aanraadt en probeer je eigen bubbel open te breken.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Lees samen met je buurman of buurvrouw de eerste alinea nog eens. Zeg om de beurt in één zin wat het algoritme doet, zonder in de tekst te kijken. Wat zei de ander anders dan jij?',
            antwoord: 'Een goede zin is: het algoritme rekent uit welke berichten jij te zien krijgt, op basis van wat je eerder deed.',
            uitleg: 'Hardop uitleggen laat meteen horen welk stukje je nog niet scherp hebt. Wie het woord berekening gebruikt, zit dichter bij de bron dan wie zegt dat de app iets kiest.',
            leerdoel: 'Je kunt uitleggen wat een algoritme op social media is.'
          },
          {
            groep: 'samen',
            vraag: 'Noem samen vijf handelingen van vanochtend op je telefoon. Zet er per handeling bij of het een sterk of een zwak signaal is voor het algoritme.',
            antwoord: 'Een filmpje helemaal uitkijken of iets opzoeken is een sterk signaal. Een snelle like of één seconde kijken is een zwak signaal.',
            uitleg: 'Sterke signalen kosten jou tijd of moeite. Daarom vertrouwt het systeem die meer dan een tik die je zonder nadenken geeft.',
            leerdoel: 'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.'
          },
          {
            groep: 'zelf',
            vraag: 'Jesse kijkt drie avonden lang alleen naar gamevideo\'s. De vierde avond opent hij de app en ziet hij bijna niets anders. Leg uit waarom, in twee zinnen.',
            antwoord: 'Het systeem heeft drie avonden lang gemeten dat gamevideo\'s zijn aandacht vasthouden. Het herhaalt daarom wat werkte, want zo blijft hij langer kijken.',
            uitleg: 'Het gaat niet om wat Jesse leuk zegt te vinden, maar om wat hij aantoonbaar deed. Meten gaat bij een algoritme altijd vóór vragen.',
            leerdoel: 'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.'
          },
          {
            groep: 'zelf',
            vraag: 'Schrijf één voordeel en één nadeel van algoritmes op. Zet er bij het nadeel bij voor wie dat een probleem is.',
            antwoord: 'Voordeel: je vindt sneller muziek of sport die bij je past. Nadeel: je komt bijna geen andere meningen meer tegen, en dat is een probleem voor jou, omdat je gaat denken dat iedereen er zo over denkt.',
            uitleg: 'Een nadeel noemen is de helft van het werk. Het antwoord wordt pas sterk als je erbij zet wie er last van heeft en waarom.',
            leerdoel: 'Je kunt een voordeel en een nadeel van algoritmes noemen.'
          },
          {
            groep: 'steun',
            vraag: 'Vul de zin aan: een algoritme is een ... die bepaalt welke berichten jij te zien krijgt. Kies uit: medewerker, computerregel, instelling.',
            antwoord: 'Computerregel.',
            uitleg: 'Er zit geen mens achter die per persoon kiest, en jij zet het ook niet zelf aan. Het is een rekenregel die voor iedereen apart iets anders uitrekent.',
            leerdoel: 'Je kunt uitleggen wat een algoritme op social media is.'
          },
          {
            groep: 'steun',
            vraag: 'Streep door wat niet klopt. Het algoritme leert van: jouw klikken / jouw kijktijd / jouw cijfers op school / wat je opzoekt.',
            antwoord: 'Jouw cijfers op school hoort er niet bij. De andere drie wel.',
            uitleg: 'Het systeem ziet alleen wat je binnen de app doet. Alles wat het meet, meet het via jouw eigen gedrag op dat scherm.',
            leerdoel: 'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.'
          },
          {
            groep: 'plus',
            vraag: 'Een filmpje krijgt in het eerste uur veel kijktijd en komt daarna bij veel meer mensen terecht. Leg uit hoe populariteit hier zichzelf versterkt.',
            antwoord: 'Veel kijktijd is voor het systeem een teken dat het filmpje werkt, dus toont het dat vaker. Vaker tonen levert weer meer weergaven op, en die leveren opnieuw vaker tonen op.',
            uitleg: 'Zo kan een trend in één dag ontstaan zonder dat iemand dat plant. Populair worden en veel getoond worden zijn op social media bijna hetzelfde geworden.',
            leerdoel: 'Je kunt een voordeel en een nadeel van algoritmes noemen.'
          }
        ]
      }),

    p('6.2', 'FOMO, druk en je zelfbeeld', ['23B'], 'schermtijdrapport met influenceranalyse en twee eigen voornemens', 100, 'Echt of Gefilterd',
      ['FOMO, druk en wat social media met je gevoel doen',
        "Social media kunnen leuk zijn, maar ze hebben ook invloed op hoe je je voelt, wat je denkt en wat je doet. Bij dat laatste gaat het bijvoorbeeld om kopen, om challenges en om ander gedrag. Zie je veel foto's van mensen met een perfect lichaam, dan kun je onzeker worden over jezelf. Gaat er een challenge viral, dan voel je de neiging om mee te doen, want je wilt erbij horen. Je bent bang dat je er anders niet bij hoort of dat je iets mist; dat gevoel heet FOMO. FOMO staat voor Fear Of Missing Out: de angst dat je iets leuks of belangrijks mist als je niet kijkt. Daarnaast is er druk, en dat is het gevoel dat je iets moet doen omdat anderen het ook doen. FOMO en druk voelen kunnen nadelige gevolgen hebben, want ze zorgen ervoor dat je meedoet met de rest. Soms is dat onschuldig, bijvoorbeeld erbij willen horen door de nieuwste sneakers te kopen. Maar het kan ook grote problemen geven, bijvoorbeeld als een groepje jongeren elkaar opjut, dus overhaalt, om iets te stelen. Social media raken ook je zelfbeeld, en dat is de manier waarop je naar jezelf kijkt. Mensen laten meestal alleen de leuke en mooie dingen zien, want minder leuke momenten zet je niet zo snel online. Zie je steeds zulke mooie beelden, dan ga je jezelf onvermijdelijk met anderen vergelijken. Misschien denk je dan: waarom zie ik er niet zo uit, of waarom heb ik niet zo'n leuk leven? Daardoor kun je je onzeker of verdrietig voelen over jezelf, terwijl je maar een deel van de werkelijkheid ziet. Onthoud dat iedereen anders is en dat wat je op social media ziet niet altijd de waarheid is. Wees dus lief voor jezelf, want jij bent goed zoals je bent, ook al lijkt dat soms anders."],
      ['Highlight reel, likes en jouw filterbubbel',
        "Social media is niet zomaar een plek om foto's en video's te delen: het is ook een plek waar je jezelf verkoopt. Anderen beoordelen jou daar voortdurend, en dat geeft extra druk om er goed uit te zien en populair te zijn. Veel influencers en bekende mensen laten niet zien wat ze écht voelen of meemaken. Een influencer is iemand met veel volgers die anderen beïnvloedt met wat hij of zij deelt. Vaak zie je alleen hun hoogtepunten, en dat heet het highlight reel-effect. Je vergelijkt dan jouw hele leven met de beste tien seconden uit het leven van iemand anders. Door de filters en bewerkingen op foto's zie je bovendien vaak geen echt gezicht meer, maar een perfect plaatje. Filters en bewerkingen zijn aanpassingen om een foto of video mooier te laten lijken, en daardoor raken je verwachtingen vervormd. Er is nog een valkuil: je waarde baseren op likes en reacties heet sociale bevestiging. Veel likes voelen goed, weinig likes voelen alsof jij minder waard bent, en dat geeft onzekerheid en stress. Ondertussen zorgt het algoritme dat je steeds meer vergelijkbare content krijgt, waardoor je in een filterbubbel terechtkomt. In die bubbel kom je steeds minder verschillende meningen en beelden tegen, en lijkt het alsof iedereen hetzelfde moet doen. Je kunt daar gelukkig iets tegenover zetten, en dat zijn vijf dingen die je vandaag al kunt doen." +
        "</p><ul>" +
        "<li>Zet je meldingen uit, zodat je zelf kiest wanneer je kijkt in plaats van je telefoon.</li>" +
        "<li>Volg ook positieve of inspirerende accounts, en vermijd de accounts die je een naar gevoel geven.</li>" +
        "<li>Plan social media-pauzes, dus soms gewoon een dagje helemaal geen social media.</li>" +
        "<li>Bedenk bij elke foto: is dit leven op Instagram echt of nep? Vergelijk jezelf er niet mee.</li>" +
        "<li>Veel volgers hebben is niet belangrijk; het gaat erom dat je gelukkig bent in het echte leven.</li>" +
        "</ul><p>" +
        "Vraag jezelf daarom regelmatig af: wie ben ik eigenlijk, los van social media? Dat is een lastige vraag, maar het antwoord bepaalt hoeveel invloed die tijdlijn op je heeft."],
      media('https://www.youtube.com/embed/w7zq_wDFFuk', 'Social media en je zelfbeeld', 'Welk moment uit de video lijkt het meest op iets dat jij zelf wel eens voelt?'),
      [
        {
          vraag: 'Wat betekent FOMO volgens jou, en wanneer voelde jij dat voor het laatst? Schrijf het in gewone zinnen op.',
          antwoord: 'FOMO staat voor Fear Of Missing Out. Het is het gevoel dat je iets belangrijks of leuks mist als je niet op social media kijkt.',
          uitleg: 'Druk is iets anders dan FOMO. FOMO trekt je naar je scherm toe, druk stuurt wat je daarbuiten doet.',
          leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.'
        },
        {
          vraag: 'Wat denk je dat het highlight reel-effect is? En wat zou een filterbubbel kunnen zijn? Gok gerust.',
          antwoord: 'Het highlight reel-effect is dat mensen alleen hun mooiste momenten laten zien. Een filterbubbel is dat je steeds dezelfde soort berichten ziet, waardoor andere meningen verdwijnen.',
          uitleg: 'Het eerste gaat over wat anderen posten, het tweede over wat jij te zien krijgt. Ze versterken elkaar, want je krijgt steeds meer van diezelfde hoogtepunten.',
          leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.'
        },
        {
          vraag: 'Welke twee dingen zou jij morgen anders kunnen doen op social media? Schrijf ze op voordat je verder leest.',
          antwoord: 'Bijvoorbeeld: meldingen uitzetten en een dag social media-pauze plannen. Ook helpt het om positieve accounts te volgen en negatieve te vermijden.',
          uitleg: 'Deze maatregelen werken omdat jij dan het moment kiest waarop je kijkt. Zonder meldingen word je niet meer teruggeroepen naar je telefoon.',
          leerdoel: 'Je kunt twee dingen noemen die jij kunt doen om positiever met social media om te gaan.'
        }
      ],
      {
        tekst: "Deze opdracht heeft drie delen; zet alles in een Word-bestand. Deel 1, je eigen gevoel: beantwoord met waar of niet waar en schrijf bij elk antwoord een zin uitleg. Ik voel me soms onzeker door wat ik op social media zie. Ik scroll wel eens langer dan ik van plan was. Ik voel me wel eens buitengesloten door dingen op social media. Ik vergelijk mezelf met mensen op social media. Deel 2, je schermtijd: schat eerst hoe lang je per dag op social media zit. Noem minimaal drie plekken waar je vaak komt, bijvoorbeeld TikTok, YouTube of Snapchat. Zet per app het aantal minuten of uren erbij dat je denkt te besteden. Pak daarna je telefoon erbij, ga naar Schermtijd en vul per genoemde app in hoeveel tijd je er echt aan besteedt per dag. Vergelijk je schatting met je echte schermtijd en leg in je eigen woorden uit of je eerste inschatting klopte en hoe dat komt. Vergelijk je antwoorden daarna met je buurman of buurvrouw: lijkt jullie schermtijd op elkaar? Geef elkaar een tip over hoe je je schermtijd kunt verminderen en noteer de tip die jij kreeg. Deel 3, de influencer: zoek een influencer of bekend persoon op social media en bekijk tien van hun foto's of filmpjes. Beantwoord daarna deze drie vragen. Welke dingen lijken echt en welke lijken gemaakt of gefilterd? Welke dingen zou zo'n influencer nooit laten zien via social media? Influencers zijn ook gewoon mensen, zoals jij en je klasgenoten: denk je dat hun status als influencer invloed heeft op hun dagelijks leven? Leg je antwoord uit. Sluit af met twee voornemens voor jezelf. Lever het bestand in bij je docent.",
        label: 'Lever je schermtijdrapport in: de vier waar-of-niet-waar-antwoorden met uitleg, je schermtijdvergelijking, je influenceranalyse en twee voornemens.',
        modelAnswer: "Deel 1. Waar: ik voel me soms onzeker door foto's van mensen die er perfect uitzien. Waar: ik scroll bijna elke avond langer dan ik van plan was. Niet waar: buitengesloten voel ik me zelden, want mijn vrienden appen me gewoon. Waar: ik vergelijk mezelf met mensen op social media, vooral met sporters. Deel 2. Ik schatte TikTok op 60 minuten, YouTube op 45 en Snapchat op 20, dus samen ruim twee uur. In Schermtijd stond TikTok op 1 uur 50, YouTube op 40 minuten en Snapchat op 25 minuten, samen bijna drie uur. Mijn schatting klopte dus niet: ik onderschatte vooral TikTok, omdat ik daar in korte stukjes kijk en de tijd niet merk. Mijn buurman had een vergelijkbare schermtijd. Hij gaf mij de tip om mijn meldingen uit te zetten; ik gaf hem de tip om zijn telefoon buiten zijn slaapkamer op te laden. Deel 3. Bij de influencer die ik koos lijken de trainingsvideo's echt, maar de vakantiefoto's zijn duidelijk bewerkt: de kleuren en de huid kloppen niet. Ze zou nooit laten zien dat een opname mislukte, dat ze ruzie had of dat ze zich onzeker voelde. Ik denk dat haar status haar dagelijks leven wel beïnvloedt, want ze moet steeds nieuwe content maken en wordt overal herkend en beoordeeld. Mijn twee voornemens: meldingen uit na 21:00 uur, en één dag per week geen TikTok.",
        nakijkpunten: [
          'Alle vier de stellingen uit deel 1 zijn beantwoord met waar of niet waar én een zin uitleg.',
          'De geschatte schermtijd en de echte schermtijd staan er allebei in, met een verklaring van het verschil.',
          'De tip van de buurman of buurvrouw is genoteerd.',
          'De influenceranalyse beantwoordt alle drie de vragen en eindigt met twee eigen voornemens.'
        ]
      },
      ['Wat betekent FOMO?', 'Wat is druk voelen?', 'Wat is het highlight reel-effect?', 'Wat zijn filters en bewerkingen?', 'Wat is sociale bevestiging?', 'Noem twee dingen die je zelf kunt doen.'],
      'Beoordeel posts op echt of gefilterd, ontmasker het highlight reel en verzamel punten met gezonde keuzes.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Lees samen deze twee zinnen. "Ik kijk elk half uur of er iets nieuws is." en "Ik koop dezelfde jas als de rest van de groep." Welke zin is FOMO en welke is druk?',
            antwoord: 'De eerste zin is FOMO, de tweede is druk.',
            uitleg: 'FOMO gaat over bang zijn iets te missen en trekt je naar je scherm. Druk gaat over meedoen met de groep en stuurt je gedrag daarbuiten.',
            leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.'
          },
          {
            groep: 'samen',
            vraag: 'Bekijk samen één post van een bekend account. Wijs aan wat er waarschijnlijk gefilterd of bewerkt is en wat er waarschijnlijk niet in beeld komt.',
            antwoord: 'Vaak zijn huid, kleur en licht bewerkt. Wat niet in beeld komt: de mislukte pogingen, het wachten en de gewone dagen.',
            uitleg: 'Dat weglaten is precies het highlight reel-effect. Je ziet de beste tien seconden en niet de uren eromheen.',
            leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.'
          },
          {
            groep: 'zelf',
            vraag: 'Nadia post een foto en checkt de hele avond hoeveel likes ze heeft. Bij 12 likes voelt ze zich minder waard dan bij 80. Hoe heet dat, en waarom is het riskant?',
            antwoord: 'Dat heet sociale bevestiging. Het is riskant omdat je je eigen waarde afmeet aan een cijfer dat anderen bepalen.',
            uitleg: 'Likes zeggen iets over het moment van posten en over het algoritme, niet over wie jij bent. Wie dat door elkaar haalt, wordt onzeker van een getal.',
            leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.'
          },
          {
            groep: 'zelf',
            vraag: 'Noem twee maatregelen uit de theorie en schrijf per maatregel op wat er dan verandert aan jouw dag.',
            antwoord: 'Bijvoorbeeld: meldingen uit, dan word ik niet steeds onderbroken en kies ik zelf wanneer ik kijk. En een dag pauze, dan merk ik hoeveel tijd ik echt overhoud.',
            uitleg: 'Een maatregel noemen is makkelijk. Het effect erbij zetten laat zien dat je begrijpt waarom die maatregel werkt.',
            leerdoel: 'Je kunt twee dingen noemen die jij kunt doen om positiever met social media om te gaan.'
          },
          {
            groep: 'steun',
            vraag: 'Zet het juiste woord bij de juiste uitleg: FOMO, druk, zelfbeeld. Uitleg 1: hoe jij naar jezelf kijkt. Uitleg 2: bang zijn iets te missen. Uitleg 3: iets doen omdat anderen het ook doen.',
            antwoord: 'Uitleg 1 is zelfbeeld, uitleg 2 is FOMO, uitleg 3 is druk.',
            uitleg: 'Zelfbeeld gaat over jou vanbinnen. FOMO en druk zijn twee gevoelens die je zelfbeeld van buitenaf raken.',
            leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.'
          },
          {
            groep: 'steun',
            vraag: 'Waar of niet waar: filters en bewerkingen maken een foto mooier dan de werkelijkheid.',
            antwoord: 'Waar.',
            uitleg: 'Filters en bewerkingen zijn aanpassingen aan een foto of video om die perfecter te laten lijken. Wat je ziet is dus bewerkt beeld, geen gewoon gezicht.',
            leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.'
          },
          {
            groep: 'plus',
            vraag: 'Leg uit hoe het algoritme uit paragraaf 6.1 en het highlight reel-effect elkaar versterken.',
            antwoord: 'Mensen posten hun hoogtepunten, en het algoritme laat je vooral de posts zien waar je lang naar kijkt. Dat zijn juist die mooie beelden, dus je krijgt er steeds meer van.',
            uitleg: 'Het probleem zit dus niet in één post, maar in de stapeling ervan. De bubbel maakt van een uitzondering iets wat normaal lijkt.',
            leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.'
          }
        ]
      }),

    p('6.3', 'Cyberpesten: wat het is en wat het doet', ['23B'], 'begrippenkaart en een verhaal van tien regels over online pesten', 100, 'Groepsapp Alarm',
      ['Wat cyberpesten is en waarom het nooit ophoudt',
        'Cyberpesten is pesten via internet, telefoon of andere digitale middelen, en het gaat overal mee naartoe. Het gebeurt bijvoorbeeld op WhatsApp, Instagram, Snapchat en TikTok, maar net zo goed via e-mail of in games. Voorbeelden zijn: gemeen doen via berichten of reacties, iemand uitschelden in een groepsapp en een gênante foto van iemand verspreiden. Ook iemand buitensluiten in online groepen en een nepaccount maken om iemand belachelijk te maken horen erbij. Het verschil met gewoon pesten zit in twee dingen, en allebei maken ze cyberpesten zwaarder om te dragen. Gewoon pesten gebeurt vaak op school of op straat, waar je iemand direct ziet. Cyberpesten gebeurt via een telefoon, app of social media en kan dag en nacht doorgaan. Cyberpesten gebeurt dus 24/7 en stopt niet als je naar huis gaat, en juist dat maakt het extra heftig. Daarnaast kun je online anoniem zijn, en anoniem betekent dat niemand weet wie jij bent. Achter een scherm en zonder naam gaan mensen soms erg ver, bijvoorbeeld met een gestolen naam en foto. Dat is precies waarom cyberpesten net zo erg of erger kan zijn dan pesten op het schoolplein. Denk dus niet dat het minder telt omdat het via een scherm gaat: het is echt pesten, met echte gevolgen.'],
      ['Wat het doet met het slachtoffer, de pester en de omstander',
        'Cyberpesten lijkt misschien iets kleins: een gemene opmerking, een gekke foto of een flauw filmpje. De gevolgen kunnen echter groot zijn, en ze raken niet één maar drie partijen tegelijk. Voor het slachtoffer, degene die gepest wordt, doet het pijn, ook al gebeurt het via een scherm. Veel slachtoffers voelen zich verdrietig of schamen zich, en ze denken vaak dat het hun eigen schuld is. Ook denken ze dat anderen hen raar vinden, terwijl daar meestal helemaal geen reden voor is. Sommigen krijgen angst om naar school te gaan, omdat ze bang zijn dat het daar doorgaat of dat mensen over hen praten. Daar komen vaak lichamelijke klachten bij, zoals slecht slapen, hoofdpijn of buikpijn tijdens de les. In sommige gevallen worden mensen er somber of zelfs depressief van, en dat gaat niet vanzelf over. Depressief betekent dat je je langere tijd heel naar voelt, alsof je nergens zin meer in hebt. Ook voor de pester zijn er gevolgen, ook al denkt hij zelf dat het maar een grap is. Op school kan hij straf krijgen, zoals nablijven of een gesprek met de mentor of de ouders. Is het pesten ernstig, dan kan er zelfs aangifte gedaan worden bij de politie. Bovendien krijgt de pester een slechte reputatie, en dat is misschien wel het langste gevolg. Reputatie is hoe anderen over jou denken, en dat vertrouwen krijg je niet zomaar weer terug. De derde partij is de omstander: iemand die het ziet gebeuren, niet meepest, maar ook niet helpt. Omstanders krijgen later vaak spijt of een schuldgevoel, omdat ze niets deden terwijl ze het zagen. Sommigen worden bovendien onzeker en vragen zich af wat er gebeurt als zij de volgende zijn. Cyberpesten raakt dus iedereen die erbij is, en daarom kun ook jij het verschil maken.'],
      media('https://www.youtube.com/embed/a-FX9FryDok', 'Wat cyberpesten met iemand doet', 'Welk gevolg uit de video had jij zelf niet bedacht, en waarom niet?'),
      [
        {
          vraag: 'Wat is volgens jou cyberpesten? Noem er meteen twee voorbeelden bij uit apps die jij gebruikt.',
          antwoord: 'Cyberpesten is pesten via internet, telefoon of andere digitale middelen. Voorbeelden: iemand uitschelden in een groepsapp of een gênante foto van iemand verspreiden.',
          uitleg: 'Ook buitensluiten in een online groep en een nepaccount maken horen erbij. Het middel is digitaal, maar de pijn is echt.',
          leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.'
        },
        {
          vraag: 'Wie hebben er volgens jou last van cyberpesten? Denk verder dan alleen degene die gepest wordt.',
          antwoord: 'Het slachtoffer, de pester en de omstander. Alle drie houden ze er iets aan over.',
          uitleg: 'Het slachtoffer krijgt klachten, de pester riskeert straf en een slechte naam, en de omstander blijft achter met spijt.',
          leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.'
        },
        {
          vraag: 'Wat denk je dat de woorden anoniem, omstander en reputatie betekenen? Schrijf je eigen uitleg op.',
          antwoord: 'Anoniem: niemand weet wie jij bent. Omstander: iemand die het ziet maar niet meedoet en ook niet helpt. Reputatie: hoe anderen over jou denken.',
          uitleg: 'Deze drie woorden komen in de hele paragraaf terug. Wie ze door elkaar haalt, mist het verschil tussen de rollen.',
          leerdoel: 'Je weet wat de woorden anoniem, omstander en reputatie betekenen.'
        }
      ],
      {
        tekst: "Maak de oefening en werk daarna je begrippen uit. Stap 1: maak de oefening van drie vragen uit de bron (https://maken.wikiwijs.nl/p/questionnaire/standalone/8322030). Daarin komen drie dingen aan bod. Ten eerste het verschil tussen gewoon pesten en cyberpesten, ten tweede een voorbeeld van cyberpesten. Ten derde de invultekst waarin je uitlegt dat cyberpesten van achter een scherm anoniem gebeurt en heel rot kan voelen. Stap 2: maak in Word een begrippenkaart met de woorden anoniem, omstander, reputatie en aangifte. Zet achter elk woord je eigen uitleg in een zin en daarna een voorbeeld uit een groepsapp of een game. Stap 3: schrijf een verhaal van tien regels over een verzonnen leerling die online gepest wordt. Beschrijf wat er gebeurt, hoe het slachtoffer zich voelt, wat de pester denkt en wat de omstanders doen of juist niet doen. Gebruik geen echte namen van klasgenoten. Lever je bestand in bij je docent. Belangrijk: zit je zelf ergens mee of denk je aan zelfmoord, dan is er een speciale hulplijn die je gratis kunt bellen op 0800-0113. Meer informatie vind je op https://www.113.nl/.",
        label: 'Lever in: je antwoorden op de Wikiwijs-oefening, je begrippenkaart met vier woorden en je verhaal van tien regels.',
        modelAnswer: "Oefening. Het verschil tussen gewoon pesten en cyberpesten: gewoon pesten gebeurt vaak op school of op straat, waar je iemand direct ziet; cyberpesten gebeurt via een telefoon, app of social media en kan dag en nacht doorgaan. Een voorbeeld van cyberpesten is iemand uitschelden in een groepsapp. De invultekst wordt: cyberpesten is dan echt pesten, omdat het van achter een scherm gebeurt. Je kunt zo ook makkelijker pesten, anoniem, en het kan heel rot voelen. Begrippenkaart. Anoniem: niemand weet wie jij bent; in een game scheldt iemand met de naam Shadow, en niemand weet wie dat is. Omstander: iemand die het ziet, niet meepest en ook niet helpt; in onze klassenapp lazen twintig mensen mee zonder iets te zeggen. Reputatie: hoe anderen over jou denken; wie bekendstaat als pester wordt door klasgenoten minder vertrouwd. Aangifte: naar de politie gaan om te melden dat er iets ergs gebeurd is; dat kan bij ernstig pesten. Verhaal. In mijn verhaal wordt een leerling in een groepsapp uitgelachen om een foto. Zij durft niets meer te zeggen in de app en slaapt slecht. De pester denkt dat het een grap is en dat het vanzelf overwaait. De omstanders zeggen niets, omdat ze bang zijn zelf aan de beurt te komen; één van hen stuurt haar later privé een berichtje.",
        nakijkpunten: [
          'De drie vragen van de Wikiwijs-oefening zijn beantwoord, inclusief de invultekst met de woorden anoniem en heel rot.',
          'De begrippenkaart bevat anoniem, omstander, reputatie én aangifte, elk met een eigen uitleg en een voorbeeld uit een app of game.',
          'Het verhaal is minstens tien regels en beschrijft het slachtoffer, de pester én de omstanders.',
          'Er staan geen echte namen van klasgenoten in.'
        ]
      },
      ['Wat is het verschil tussen pesten en cyberpesten?', 'Noem twee voorbeelden van cyberpesten.', 'Wat betekent anoniem?', 'Welke klachten kan een slachtoffer krijgen?', 'Wat is een omstander?'],
      'Lees mee in een groepsapp, herken het moment waarop het pesten wordt en kies per bericht wat je doet.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Bedenk samen drie berichten die in een groepsapp nog een grap zijn, en drie die pesten zijn. Waar ligt bij jullie de grens?',
            antwoord: 'Een grap is wederzijds en stopt als iemand er last van heeft. Pesten is gericht op één persoon, herhaalt zich en gaat door ondanks protest.',
            uitleg: 'De grens ligt niet bij de bedoeling van de zender maar bij het effect op de ontvanger. Dat is precies waarom "het was maar een grapje" geen verweer is.',
            leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.'
          },
          {
            groep: 'samen',
            vraag: 'Verdeel de rollen: één van jullie is slachtoffer, één pester, één omstander. Zeg om de beurt in één zin wat jouw rol eraan overhoudt.',
            antwoord: 'Slachtoffer: verdriet, schaamte, slecht slapen of buikpijn. Pester: straf, mogelijk aangifte en een slechte reputatie. Omstander: spijt, schuldgevoel en onzekerheid.',
            uitleg: 'De rollen hebben verschillende gevolgen, en die verwisselen is de meestgemaakte fout. Let vooral op: reputatie hoort bij de pester, buikpijn bij het slachtoffer.',
            leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.'
          },
          {
            groep: 'zelf',
            vraag: 'Hierna volgt de deeltoets over 6.1 tot en met 6.3, met één vraag per leerdoel van die drie paragrafen. Je krijgt er geen cijfer voor, en de Digidocent staat op dit blok uit. Maak eerst alle negen de vragen en kijk ze daarna pas na.',
            antwoord: 'Zeven of meer goed: ga verder met de plusopgave onderaan deze paragraaf. Zes of minder goed: maak eerst de steunopgaven en lees de paragraaf terug waar je vragen misgingen.',
            uitleg: 'Deze deeltoets bepaalt geen cijfer maar je route. Hij laat vroeg zien welk leerdoel nog niet zit, zodat je dat kunt herstellen voordat de hoofdstuktoets komt.',
            leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.'
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 1. Wat bepaalt een algoritme op social media?',
            antwoord: 'Welke filmpjes en berichten jij te zien krijgt.',
            uitleg: 'Het bepaalt niet wat waar of belangrijk is. Het rekent uit wat jouw aandacht waarschijnlijk vasthoudt.',
            leerdoel: 'Je kunt uitleggen wat een algoritme op social media is.'
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 2. Welk signaal weegt zwaarder: een like of een filmpje helemaal uitkijken?',
            antwoord: 'Een filmpje helemaal uitkijken.',
            uitleg: 'Kijktijd kost je echte minuten en is daarom een eerlijker teken van interesse. Een like is één tik en kost bijna geen moeite.',
            leerdoel: 'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.'
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 3. Noem één nadeel van algoritmes.',
            antwoord: 'Je krijgt steeds minder verschillende meningen en beelden te zien.',
            uitleg: 'Het aanbod wordt smaller omdat het systeem herhaalt wat eerder werkte. Dat merk je pas als je erop let.',
            leerdoel: 'Je kunt een voordeel en een nadeel van algoritmes noemen.'
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 4. Wat is het verschil tussen FOMO en druk?',
            antwoord: 'FOMO is bang zijn iets te missen. Druk is het gevoel dat je iets moet doen omdat anderen het ook doen.',
            uitleg: 'FOMO trekt je naar je scherm toe. Druk stuurt wat je buiten je scherm doet, zoals kopen of meedoen aan een challenge.',
            leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.'
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 5. Wat betekent het highlight reel-effect?',
            antwoord: 'Dat mensen online vooral hun leukste en mooiste momenten laten zien en de moeilijke dingen weglaten.',
            uitleg: 'Je vergelijkt daardoor je hele dag met de beste tien seconden van iemand anders. Dat is nooit een eerlijke vergelijking.',
            leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.'
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 6. Noem twee dingen die je zelf kunt doen om positiever met social media om te gaan.',
            antwoord: 'Meldingen uitzetten en social media-pauzes plannen. Ook positieve accounts volgen en negatieve vermijden telt.',
            uitleg: 'Alle maatregelen hebben hetzelfde doel: jij kiest het moment waarop je kijkt, in plaats van je telefoon.',
            leerdoel: 'Je kunt twee dingen noemen die jij kunt doen om positiever met social media om te gaan.'
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 7. Noem twee voorbeelden van cyberpesten.',
            antwoord: 'Iemand uitschelden in een groepsapp en een gênante foto van iemand verspreiden.',
            uitleg: 'Ook buitensluiten in een online groep en een nepaccount maken zijn voorbeelden uit de bron. Iemand laten struikelen op het plein hoort er niet bij.',
            leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.'
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 8. Wat is een omstander, en wat houdt hij er zelf aan over?',
            antwoord: 'Een omstander ziet het pesten gebeuren, doet niet mee en helpt ook niet. Hij houdt er vaak spijt, een schuldgevoel of onzekerheid aan over.',
            uitleg: 'Toekijken voelt neutraal maar is het niet. Voor de groep leest zwijgen namelijk als instemmen.',
            leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.'
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 9. Geef in je eigen woorden de betekenis van anoniem, omstander en reputatie.',
            antwoord: 'Anoniem betekent dat niemand weet wie jij bent. Een omstander ziet het pesten gebeuren, doet niet mee en helpt ook niet. Reputatie is hoe anderen over jou denken.',
            uitleg: 'Deze drie woorden komen in de bron-eindtoets terug als koppelopgave, dus je moet ze uit je hoofd kennen. Let op dat anoniem over de pester gaat en reputatie over hoe de groep hem daarna ziet.',
            leerdoel: 'Je weet wat de woorden anoniem, omstander en reputatie betekenen.'
          },
          {
            groep: 'steun',
            vraag: 'Zes of minder goed in de deeltoets? Begin hier. Streep door wat geen cyberpesten is: uitschelden in een groepsapp / een nepaccount maken / iemand helpen met huiswerk in de chat.',
            antwoord: 'Iemand helpen met huiswerk in de chat is geen cyberpesten.',
            uitleg: 'Cyberpesten is gericht op één persoon, herhaalt zich en doet die persoon pijn. Helpen doet precies het tegenovergestelde.',
            leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.'
          },
          {
            groep: 'steun',
            vraag: 'Zet het gevolg bij de juiste rol. Gevolgen: buikpijn en slecht slapen / straf en een slechte reputatie / spijt achteraf. Rollen: slachtoffer, pester, omstander.',
            antwoord: 'Buikpijn en slecht slapen horen bij het slachtoffer, straf en een slechte reputatie bij de pester, spijt achteraf bij de omstander.',
            uitleg: 'Deze drie verwisselen is de meestgemaakte fout in de toets. Onthoud: reputatie gaat altijd over de pester.',
            leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.'
          },
          {
            groep: 'plus',
            vraag: 'Zeven of meer goed in de deeltoets? Doe deze. Leg uit waarom anoniem pesten voor het slachtoffer zwaarder kan zijn dan pesten door iemand die het openlijk doet.',
            antwoord: 'Het slachtoffer weet niet wie het is en gaat daardoor iedereen wantrouwen. Ook klasgenoten die er niets mee te maken hebben, komen onder verdenking te staan.',
            uitleg: 'Anoniem pesten verspreidt de angst dus over de hele groep. Bovendien durft een anonieme pester verder te gaan, omdat hij geen reputatieschade verwacht.',
            leerdoel: 'Je weet wat de woorden anoniem, omstander en reputatie betekenen.'
          }
        ]
      }),

    p('6.4', 'Wat doe jij bij cyberpesten?', ['23B', '23A'], 'ingevulde opdracht Cyberpesten met een eigen stappenplan van vijf stappen', 100, 'Omstander of Held',
      ['Als jij gepest wordt: vijf stappen die echt helpen',
        "Cyberpesten kan je het gevoel geven dat je alleen staat, maar dat ben je in werkelijkheid niet. Er zijn altijd mensen die je kunnen helpen; jij moet alleen wel zelf de eerste stap zetten. Stap één is praten met iemand die je vertrouwt, bijvoorbeeld je ouders, je mentor, een docent of een goede vriendin. Je hoeft het niet alleen op te lossen, en het uitspreken maakt het probleem meteen een stuk kleiner. Stap twee is screenshots maken van de gemene berichten of filmpjes, want een screenshot is een foto van je scherm. Bewijs bewaren is belangrijk als je het aan iemand wilt laten zien of als je het wilt melden. Stap drie is blokkeren: wie geblokkeerd is kan jou geen berichten meer sturen en jouw profiel niet meer bekijken. Dat geeft rust, en het is meteen te doen, ook als je nog niet weet wat je verder wilt. Stap vier is het melden bij school, en dat kan bij je mentor of bij een vertrouwenspersoon. Een vertrouwenspersoon is iemand op school bij wie je terecht kunt als je ergens mee zit en die je verder helpt. Stap vijf is anoniem hulp vragen via www.pestweb.nl of www.kindertelefoon.nl, als je liever je naam niet zegt. Denk je aan zelfmoord, bel dan gratis 0800-0113 of kijk voor meer informatie op https://www.113.nl/. Al deze stappen hebben één ding gemeen: je haalt het probleem weg uit je eentje. Gaat het pesten heel ver door, dan kan er bovendien aangifte gedaan worden bij de politie. Aangifte doen betekent dat iemand naar de politie gaat om te melden dat er iets ergs is gebeurd. Wie anoniem pest, blijft dus niet automatisch onvindbaar, en dat is precies waarom bewijs bewaren loont."],
      ['Als je het ziet gebeuren, en als je zelf hebt meegedaan',
        "Ook als jij niet degene bent die gepest wordt, kun je iets doen; toekijken is geen neutrale keuze. Negeer het niet, want als niemand iets zegt, lijkt het alsof het oké is wat er gebeurt. Kom op voor de ander als je durft, en dat kan ook gewoon privé met een kort berichtje. Eén zin als hé, gaat het? of ik vind het niet oké wat ze zeggen, laat het slachtoffer al merken dat hij er niet alleen voor staat. Zie je online iets wat niet oké is, dan rapporteer je het bij de app of het platform. Rapporteren betekent dat je het bericht meldt bij de makers van de app, zodat zij het kunnen weghalen. Meld het daarna ook bij een docent of mentor, want dat is geen klikken maar gewoon helpen. Cyberpesten kan grote gevolgen hebben, en jouw actie kan iemand hard raken, ook als jij het klein vond. Soms kun je zelfs strafbaar zijn, namelijk als jij de pester bent en iemand tot wanhoop hebt gedreven. Iemand tot wanhoop drijven betekent iemand zo ernstig pesten dat die persoon geen andere uitweg meer ziet. Soms lach je zelf mee of zeg je iets zonder erbij na te denken, en kwets je iemand toch. Ook dan kun je het goedmaken, en de drie stappen daarvoor zijn kort opgeschreven maar niet makkelijk. Bied je excuses aan en zeg dat je spijt hebt, want dat is moeilijk maar wel sterk. Verwijder daarna je berichten, zodat je laat zien dat je het serieus meent en niet alleen zegt. Laat ten slotte merken dat je ervan geleerd hebt: doe voortaan niet meer mee en help anderen juist wel. Wil je meer hulp bij pesten, kijk dan op de website https://www.kindertelefoon.nl/ voor advies en contact."],
      [
        media('https://www.youtube.com/embed/OA0EDH4z6_M', 'Cyberpesten: hoe ver kan het gaan? (heftige reportage over een jongen die zelfmoord pleegde; kijk hem samen in de klas)', 'Deze reportage gaat over een echte jongen en loopt slecht af, dus kijk hem met je klas en je docent erbij. Welke stap uit de theorie had iemand in zijn omgeving kunnen zetten om hem te helpen? Raakt de video jou, praat er dan over met je mentor of bel gratis 0800-0113.'),
        media('https://www.pestweb.nl/', 'Pestweb: anoniem hulp vragen bij pesten', 'Welke manier van contact opnemen zou jij zelf kiezen, en waarom die?')
      ],
      [
        {
          vraag: 'Je krijgt drie dagen achter elkaar gemene berichten. Welke drie stappen zet jij, en in welke volgorde?',
          antwoord: 'Eerst praten met iemand die je vertrouwt, dan screenshots maken van de berichten, dan de pesters blokkeren. Daarna meld je het bij je mentor of de vertrouwenspersoon.',
          uitleg: 'Bewijs bewaren gaat altijd vóór opruimen. Wie eerst de app verwijdert, is zijn bewijs kwijt terwijl het pesten doorgaat.',
          leerdoel: 'Je weet wat je kunt doen als je zelf gepest wordt.'
        },
        {
          vraag: 'In de klassenapp wordt iemand uitgelachen. Wat doe jij precies, en wat doe je bewust niet?',
          antwoord: 'Je negeert het niet, je stuurt het slachtoffer privé een berichtje en je rapporteert het bij de app. Daarna meld je het bij een docent. Je lacht niet mee en je zet geen emoji.',
          uitleg: 'Een lach-emoji telt voor het slachtoffer net zo hard als een woord. Zwijgen leest de groep bovendien als instemmen.',
          leerdoel: 'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.'
        },
        {
          vraag: 'Waar kun jij hulp vragen? Noem twee plekken op school en twee plekken daarbuiten.',
          antwoord: 'Op school: je mentor en de vertrouwenspersoon. Daarbuiten: Pestweb en de Kindertelefoon, en bij zelfmoordgedachten hulplijn 113 via 0800-0113.',
          uitleg: 'Buiten school kun je anoniem praten, dus zonder je naam te zeggen. Aangifte doen is iets anders: dat loopt via de politie.',
          leerdoel: 'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.'
        }
      ],
      {
        tekst: "Maak de opdracht Cyberpesten in een Word-document. Stap 1: download het document uit de bron (https://maken.wikiwijs.nl/userfiles/b/bdcd8628039a6a0212c8129e42a7d2ce56096f44.docx) en vul het volledig in. Vraag aan je docent of en hoe je het document moet delen. Stap 2: voeg onderaan je eigen stappenplan toe van vijf stappen die jij morgen zou volgen als jij online gepest werd. Zet achter elke stap een zin waarom die stap helpt, en gebruik daarbij in elk geval de woorden screenshots, blokkeren en vertrouwenspersoon. Stap 3: schrijf daaronder een tekst van vijf regels waarin je uitlegt waarom melden bij een docent geen klikken is maar helpen. Gebruik daarin de woorden omstander, rapporteren en aangifte. Stap 4: bedenk tot slot wat jij zou zeggen tegen iemand die per ongeluk heeft meegedaan aan het pesten en het wil goedmaken. Noem de drie dingen uit de theorie: excuses aanbieden, berichten verwijderen en laten merken dat je ervan geleerd hebt. Sla het bestand op in OneDrive en lever het in bij je docent.",
        label: 'Lever in: het ingevulde bronnendocument, je eigen stappenplan van vijf stappen, je tekst over melden en je advies aan iemand die het wil goedmaken.',
        modelAnswer: "Mijn stappenplan. 1. Ik vertel het aan mijn mentor of aan mijn ouders, want dan sta ik er niet alleen voor. 2. Ik maak screenshots van de berichten, want dan heb ik bewijs, ook als ze later verwijderd worden. 3. Ik blokkeer de pesters, want dan kunnen ze mij geen berichten meer sturen en krijg ik rust. 4. Ik meld het bij de vertrouwenspersoon op school, want dat is iemand bij wie ik terechtkan en die verder helpt. 5. Ik rapporteer de berichten bij de app, want dan kan het platform ze weghalen. Waarom melden geen klikken is: klikken doe je om iemand in de problemen te brengen, melden doe je om iemand te helpen. Wie het ziet en zwijgt is een omstander, en zwijgen leest de groep als goedvinden. Bij ernstig pesten kan er zelfs aangifte gedaan worden bij de politie, en dan is stil blijven helemaal geen optie meer. Tegen iemand die per ongeluk heeft meegedaan zou ik zeggen: bied je excuses aan bij degene die je gekwetst hebt, verwijder je berichten of je reactie, en laat merken dat je ervan geleerd hebt door voortaan niet meer mee te doen en anderen juist te helpen.",
        nakijkpunten: [
          'Het bronnendocument uit de Wikiwijs-link is volledig ingevuld en op de afgesproken manier gedeeld.',
          'Het eigen stappenplan telt vijf stappen met per stap een reden, en gebruikt de woorden screenshots, blokkeren en vertrouwenspersoon.',
          'De tekst van vijf regels gebruikt de woorden omstander, rapporteren en aangifte en legt het verschil tussen melden en klikken uit.',
          'Het advies noemt alle drie de dingen: excuses aanbieden, berichten verwijderen en laten merken dat je ervan geleerd hebt.'
        ]
      },
      ['Wat is je eerste stap als je gepest wordt?', 'Waarom maak je screenshots?', 'Wat doet blokkeren?', 'Wat betekent rapporteren bij de app?', 'Waarom is melden geen klikken?', 'Wat betekent aangifte doen?'],
      'Kies in tien online situaties tussen wegkijken, meelachen of ingrijpen en zie meteen wat je keuze doet.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Zet samen de vijf stappen voor een slachtoffer in de goede volgorde: blokkeren, melden bij school, praten met iemand die je vertrouwt, anoniem hulp vragen, screenshots maken.',
            antwoord: 'Praten met iemand die je vertrouwt, screenshots maken, blokkeren, melden bij school, en anoniem hulp vragen als je liever niet je naam noemt.',
            uitleg: 'Screenshots komen vóór blokkeren, want na het blokkeren kun je de berichten vaak niet meer zien. Anoniem hulp vragen kan altijd, ook als eerste stap.',
            leerdoel: 'Je weet wat je kunt doen als je zelf gepest wordt.'
          },
          {
            groep: 'samen',
            vraag: 'Bedenk samen twee zinnen die je privé naar een slachtoffer zou sturen. Lees ze aan elkaar voor: welke zin voelt het minst ongemakkelijk?',
            antwoord: 'Bijvoorbeeld: "Hé, gaat het?" of "Ik vind het niet oké wat ze zeggen." Kort en gewoon werkt beter dan een lange tekst.',
            uitleg: 'Het gaat er niet om dat je het perfect zegt. Eén bericht laat het slachtoffer al merken dat niet iedereen meedoet.',
            leerdoel: 'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.'
          },
          {
            groep: 'zelf',
            vraag: 'Je ziet in een openbare reactie onder een filmpje dat iemand wordt uitgescholden. Je kent die persoon niet. Wat doe je?',
            antwoord: 'Je rapporteert de reactie bij de app of het platform. Daarmee meld je het bericht bij de makers, zodat zij het kunnen weghalen.',
            uitleg: 'Rapporteren werkt ook als je het slachtoffer niet kent en geen docent kunt inschakelen. Het is iets anders dan aangifte doen; dat loopt via de politie.',
            leerdoel: 'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.'
          },
          {
            groep: 'zelf',
            vraag: 'Leg in twee zinnen uit wat het betekent dat een pester strafbaar kan zijn als hij iemand tot wanhoop heeft gedreven.',
            antwoord: 'Iemand tot wanhoop drijven betekent zo ernstig pesten dat die persoon geen andere uitweg meer ziet. In zo\'n geval kan de pester strafbaar zijn en kan er aangifte tegen hem gedaan worden.',
            uitleg: 'Pesten is dus niet alleen een schoolzaak. Bij ernstige gevallen kan de politie erbij komen, ook als de pester anoniem dacht te blijven.',
            leerdoel: 'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.'
          },
          {
            groep: 'steun',
            vraag: 'Wat doe je als eerste als jij gepest wordt: terugschelden, screenshots maken, of wachten tot het overgaat?',
            antwoord: 'Screenshots maken, en het daarna vertellen aan iemand die je vertrouwt.',
            uitleg: 'Terugschelden maakt het meestal erger en wachten geeft de pester de tijd. Met screenshots heb je bewijs, ook als de berichten later verdwijnen.',
            leerdoel: 'Je weet wat je kunt doen als je zelf gepest wordt.'
          },
          {
            groep: 'steun',
            vraag: 'Zet het juiste woord bij de uitleg: rapporteren, blokkeren, aangifte doen. Uitleg 1: naar de politie gaan. Uitleg 2: melden bij de app. Uitleg 3: zorgen dat iemand jou geen berichten meer kan sturen.',
            antwoord: 'Uitleg 1 is aangifte doen, uitleg 2 is rapporteren, uitleg 3 is blokkeren.',
            uitleg: 'Deze drie worden vaak door elkaar gehaald. Ze gaan over drie verschillende plekken: de politie, de app en je eigen telefoon.',
            leerdoel: 'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.'
          },
          {
            groep: 'plus',
            vraag: 'Iemand zegt: "Ik heb niets gedaan, dus ik heb er niets mee te maken." Schrijf een antwoord van drie zinnen waarin je uitlegt waarom dat niet klopt.',
            antwoord: 'Wie het ziet en zwijgt is een omstander. Voor de groep lijkt zwijgen op goedvinden, en het slachtoffer voelt zich daardoor nog meer alleen. Bovendien houden omstanders er zelf vaak spijt en een schuldgevoel aan over.',
            uitleg: 'Niets doen is dus wél een keuze, met gevolgen voor drie partijen. Eén privébericht of één melding verandert die situatie al.',
            leerdoel: 'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.'
          }
        ]
      }),

    p('6.5', 'Digitaal gezond blijven', ['23B'], 'schermdagboek van een dag met drie eigen verbeterpunten', 100, 'Schermtijd Balans',
      ['Wat een scherm met je lichaam doet',
        'Digitaal gezond blijven betekent dat je je telefoon, tablet en laptop op een verantwoorde manier gebruikt. Je zorgt dan goed voor jezelf, terwijl je toch gebruik kunt maken van alles wat digitale technologie te bieden heeft. Dat gaat over twee kanten tegelijk: fysiek, dus je lichaam, en mentaal, dus je gevoel en je gedachten. Kijk je uren achter elkaar naar een scherm, in een slechte houding en zonder te bewegen, dan krijgt je lichaam de rekening. Een veelvoorkomend probleem is een bochel of een kromme rug, en dat begint bijna altijd bij je nek. Je hoofd hangt dan te ver naar voren als je naar je scherm kijkt. Hierdoor komt er extra spanning op je nek en rug te staan, en ook je schouders en polsen kunnen pijn gaan doen. Daarnaast kun je last krijgen van droge ogen of hoofdpijn, en dat komt door het zogenaamde blauw licht van je scherm. Dit licht remt de aanmaak van melatonine, een stofje dat ervoor zorgt dat je slaperig wordt. Kijk je vlak voor het slapen lang op je telefoon, dan val je dus later in slaap. Op de lange termijn is er nog een gevolg voor je ogen, en dat merk je pas na jaren. Kijk je te lang naar een scherm, dan kun je uiteindelijk een bril nodig hebben, doordat je te vaak dichtbij kijkt. Een schermfilter of de nachtmodus van je toestel helpt om dat blauwe licht flink te verminderen. Let daarnaast op je houding: zit rechtop, met beide voeten op de grond en je scherm op ooghoogte. Beweeg bovendien regelmatig: sta op, rek je uit en loop een rondje door de kamer.'],
      ['De 20-20-2 regel, digitale verslaving en wat jij meeneemt',
        "Eén simpele tip helpt je ogen én de rest van je lichaam: de 20-20-2 regel. Na elke 20 minuten schermtijd kijk je 20 seconden naar iets op minstens 6 meter afstand. Daarnaast ben je minstens 2 uur per dag buiten. Ver kijken ontspant je oogspieren en buitenlicht helpt je slaapritme; het is dus meer dan een schoolregel. Tellen doe je zo: je deelt je schermtijd door 20 en rondt naar beneden af. Elke volle 20 minuten levert dus één oogpauze op, en een halve blok telt niet mee. Een uur schermtijd geeft zo drie oogpauzes, anderhalf uur vier en twee uur zes. De 2 telt daar nooit in mee, want die hoort bij je hele dag en niet bij je schermtijd. Soms is het moeilijk om je telefoon weg te leggen: je blijft scrollen op TikTok, gamen of appjes checken. Dan krijg je te maken met digitale verslaving, en die sluipt er meestal ongemerkt in. Aan drie signalen kun je digitale verslaving bij jezelf herkennen." +
        "</p><ul>" +
        "<li>Je kunt bijna niet stoppen met je scherm gebruiken, ook niet als je het jezelf voorneemt.</li>" +
        "<li>Je voelt je rusteloos of ongemakkelijk als je even niet op je telefoon kunt kijken.</li>" +
        "<li>Je hebt minder aandacht voor school, voor je familie en voor je hobby's dan eerst.</li>" +
        "</ul><p>" +
        "Veel op je telefoon zitten is niet meteen een verslaving, maar als het je dagelijks leven beïnvloedt, kijk dan kritisch naar je gedrag. Een eerlijke test: wat doe jij als eerste als je wakker wordt, en wat zegt dat over jouw telefoongebruik? Maak afspraken met jezelf, bijvoorbeeld na 21:00 uur geen telefoon meer, en plan schermvrije momenten tijdens het eten of voor het slapen. Wat neem jij mee uit deze paragraaf over hoe jij met je telefoon, laptop of gameconsole omgaat? Voel je je soms moe of prikkelbaar, of heb je last van je rug of je ogen? Dan is dit misschien een signaal van ongezond schermgebruik en is het tijd om iets te veranderen. Door op je houding te letten en genoeg pauzes te nemen, voel je je vaak snel beter. Het is niet de bedoeling om je schermen nooit meer te gebruiken, maar wel om ze slimmer en bewuster te gebruiken."],
      [
        media('https://upload.wikimedia.org/wikipedia/commons/3/31/Ergonomic_Workstation.png', 'Afbeelding A: een ingerichte werkplek met beeldscherm (Marcel Kollmar en Partynia, Wikimedia Commons, CC BY-SA 3.0 DE)', 'Welke van de twee afbeeldingen laat de slechte houding zien: is dat afbeelding A of afbeelding B hieronder? Schrijf erbij waaraan je dat precies ziet.'),
        media('https://upload.wikimedia.org/wikipedia/commons/c/c4/Bad_posture.jpg', 'Afbeelding B: zittende houding op een bureaustoel, met de wervelkolom uitgelicht (Skoivuma, Wikimedia Commons, CC BY 3.0)', 'Noem drie dingen die op de afbeelding met de slechte houding fout gaan, en zet er per punt bij wat je in plaats daarvan zou doen.'),
        media('https://youtube.com/shorts/s9nDVkBSr-g?si=hCrt5yOMyBbSCBqw', 'Snelle tip om je schermtijd te verminderen (Engelstalig; zet de automatische ondertiteling met vertaling naar Nederlands aan)', 'Dit filmpje is in het Engels: zet in het instellingenmenu de ondertiteling aan en vertaal die naar het Nederlands. Welke tip kun jij vandaag nog uitproberen, en wat verwacht je ervan?')
      ],
      [
        {
          vraag: 'Welke klachten denk jij dat je van te lang schermgebruik kunt krijgen? Noem er drie.',
          antwoord: 'Rug- en nekklachten door een kromme houding, droge ogen en hoofdpijn, en slecht slapen door het blauwe licht. Op de lange termijn kun je zelfs een bril nodig hebben.',
          uitleg: 'De klachten hebben twee verschillende oorzaken: je houding en het licht van je scherm. Daarom heb je er ook twee verschillende oplossingen voor nodig.',
          leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.'
        },
        {
          vraag: 'Waar denk je dat de drie getallen in de 20-20-2 regel voor staan? Schrijf je gok op.',
          antwoord: 'Na elke 20 minuten schermtijd kijk je 20 seconden naar iets op minstens 6 meter afstand. Daarnaast ben je minstens 2 uur per dag buiten.',
          uitleg: 'De 2 hoort niet bij de pauze zelf maar bij je hele dag. Dat verschil wordt in de toets het vaakst fout gedaan.',
          leerdoel: 'Je kunt de 20-20-2 regel uitleggen en toepassen.'
        },
        {
          vraag: 'Waaraan zou je bij jezelf kunnen merken dat je telefoongebruik te ver gaat? Noem twee signalen.',
          antwoord: 'Je kunt bijna niet stoppen, je wordt rusteloos zonder telefoon, en school, familie of hobby\'s krijgen minder aandacht.',
          uitleg: 'Veel op je telefoon zitten is op zichzelf nog geen verslaving. Het gaat om de onrust en om de gevolgen voor de rest van je leven.',
          leerdoel: 'Je weet waaraan je digitale verslaving bij jezelf kunt herkennen.'
        }
      ],
      {
        tekst: "Maak je schermdagboek in een Word-document; de opdracht heeft vier delen. Deel 1, de foto's: zoek of maak twee foto's van iemand achter een laptop, één met een goede en één met een slechte houding. Zet erbij welke foto de slechte houding laat zien en schrijf er drie dingen bij die daar fout gaan. Deel 2, het schermdagboek: kijk een dag lang naar je eigen schermgebruik en maak daarna een korte samenvatting. Hoeveel uur zat je op een scherm? Wat voor klachten heb je gemerkt, bijvoorbeeld hoofdpijn, vermoeide ogen of een stijve nek? Wat zou je morgen anders doen om digitaal gezonder te zijn? Deel 3, drie verbeterpunten: noteer drie dingen die je gaat veranderen. Gebruik daarbij in elk geval de woorden houding, 20-20-2 en nachtmodus, en zet per punt in één zin waarom het helpt. Deel 4, je eigen mening: schrijf in twee zinnen wat jij van je eigen telefoongebruik vindt. Zou je minder schermtijd willen, of ben je tevreden? Leg je antwoord uit en deel het document met je docent.",
        label: 'Lever je schermdagboek in: de twee foto\'s met uitleg, je dagoverzicht, je drie verbeterpunten en je eigen mening.',
        modelAnswer: "Op de tweede foto zie ik de slechte houding. Het hoofd hangt ver naar voren, de rug is krom en de laptop staat op schoot in plaats van op ooghoogte. Op mijn eigen dag zat ik ongeveer zes uur achter een scherm: drie uur voor school en drie uur op mijn telefoon. Ik merkte tegen de avond hoofdpijn en droge ogen, en mijn nek was stijf na het huiswerk. Mijn drie verbeterpunten zijn: ik zet mijn laptop op een stapel boeken zodat mijn scherm op ooghoogte staat, want dan hangt mijn hoofd niet meer naar voren. Ik zet een timer voor de 20-20-2 regel, want dan kijk ik elke 20 minuten 20 seconden ver weg en zijn mijn ogen minder droog. En ik zet nachtmodus aan na 21:00 uur, want blauw licht remt melatonine en daardoor slaap ik slechter in. Ik vind zelf dat ik te veel op mijn telefoon zit in de avond. Ik wil vooral het laatste uur voor het slapen schermvrij maken, want dat merk ik de volgende dag het duidelijkst.",
        nakijkpunten: [
          'De foto met de slechte houding is aangewezen, met drie concrete fouten erbij: hoofd naar voren, kromme rug en scherm niet op ooghoogte.',
          'Het schermdagboek noemt een aantal uren, minstens één gemerkte klacht en één ding dat morgen anders gaat.',
          'De drie verbeterpunten gebruiken de woorden houding, 20-20-2 en nachtmodus, elk met een reden erbij.',
          'De eigen mening bestaat uit twee zinnen met een uitleg, niet uit één woord.'
        ]
      },
      ['Welke klachten krijg je van te lang schermgebruik?', 'Waarom kun je een bril nodig hebben?', 'Wat doet blauw licht met je slaap?', 'Wat is de 20-20-2 regel?', 'Waaraan herken je digitale verslaving?', 'Noem twee manieren om gezonder met je scherm om te gaan.'],
      'Plan een schooldag vol schermmomenten en houd houding, ogen en slaap tegelijk in de groene zone.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Vul samen het verhaal van Lisa aan met woorden uit de lijst: 20, ooghoogte, slechte, buiten, nachtmodus, vier, pauzes, 20-20-2, verslaafd. "Lisa zit al ... uur op haar telefoon. Haar schouders doen pijn en haar hoofd voelt zwaar; dat komt waarschijnlijk door haar ... houding en het felle blauwe licht van haar scherm. Ze weet eigenlijk wel dat ze na elke ... minuten even 20 seconden moet kijken naar iets in de verte, dat is de ... regel, maar dat doet ze niet altijd. \'s Nachts kan Lisa moeilijk slapen en overdag is ze snel moe. Ze pakt steeds weer haar telefoon erbij, ook als ze eigenlijk huiswerk moet maken, en soms denkt ze dat ze misschien een beetje ... is aan haar telefoon. Haar ouders zeggen dat ze vaker naar ... moet gaan en minder schermtijd moet nemen. Lisa besluit een paar dingen te veranderen: ze gaat rechtop zitten met haar scherm op ..., neemt vaker ... en stelt in dat haar scherm in de avond automatisch een ...-filter aanzet."',
            antwoord: 'Vier uur, slechte houding, na elke 20 minuten, de 20-20-2 regel, een beetje verslaafd, vaker naar buiten, scherm op ooghoogte, vaker pauzes, een nachtmodus-filter.',
            uitleg: 'Let op het verschil tussen de twee keer 20: de eerste is de tijd achter je scherm, de tweede zijn de seconden dat je ver weg kijkt. Het woord verslaafd hoort bij het gedrag, niet bij de klachten.',
            leerdoel: 'Je kunt de 20-20-2 regel uitleggen en toepassen.'
          },
          {
            groep: 'samen',
            vraag: 'Zet samen deze vier stappen in de goede volgorde. a) Ik heb 20 minuten op mijn telefoon gekeken. b) Ik kijk nog eens 20 minuten op mijn telefoon. c) Nu kijk ik 20 seconden naar buiten of ver weg. d) Ik neem een pauze, waarbij ik 2 uur naar buiten ga.',
            antwoord: 'De volgorde is a, c, b, d.',
            uitleg: 'De 20 seconden ver kijken komt direct na de 20 minuten scherm, dus tussen a en b in. De 2 uur buiten is geen pauze tussendoor maar iets voor je hele dag.',
            leerdoel: 'Je kunt de 20-20-2 regel uitleggen en toepassen.'
          },
          {
            groep: 'zelf',
            vraag: 'Koppel het gevolg aan het juiste probleem. Problemen: slechte houding, te veel blauw licht, digitale verslaving. Gevolgen: slecht slapen, rug- en nekklachten, minder aandacht voor school en vrienden.',
            antwoord: 'Slechte houding hoort bij rug- en nekklachten. Te veel blauw licht hoort bij slecht slapen. Digitale verslaving hoort bij minder aandacht voor school en vrienden.',
            uitleg: 'Elke oorzaak heeft zijn eigen gevolg, en dat is precies wat deze opgave test. Houding werkt op je spieren, blauw licht op melatonine, en verslaving op je aandacht.',
            leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.'
          },
          {
            groep: 'zelf',
            vraag: 'Nour maakt anderhalf uur huiswerk. Hoe vaak past zij de 20-20-2 pauze toe, en wat doet ze dan precies?',
            antwoord: 'Vier keer, want 90 gedeeld door 20 is vier hele blokken met 10 minuten over. Telkens kijkt ze 20 seconden naar iets op minstens 6 meter afstand.',
            uitleg: 'Delen door 20 en naar beneden afronden is de rekenregel; de 10 minuten die overblijven leveren geen extra pauze op. Even op je telefoon kijken telt trouwens niet als pauze.',
            leerdoel: 'Je kunt de 20-20-2 regel uitleggen en toepassen.'
          },
          {
            groep: 'steun',
            vraag: 'Waar of niet waar: door heel vaak dichtbij naar een scherm te kijken kun je uiteindelijk een bril nodig hebben.',
            antwoord: 'Waar.',
            uitleg: 'Je ogen staan dan urenlang op dichtbij ingesteld en krijgen weinig gelegenheid om ver te kijken. Daarom staat er in de 20-20-2 regel juist dat je ver weg moet kijken.',
            leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.'
          },
          {
            groep: 'steun',
            vraag: 'Streep door wat geen signaal van digitale verslaving is: bijna niet kunnen stoppen / rusteloos worden zonder telefoon / een telefoon met veel opslagruimte hebben.',
            antwoord: 'Een telefoon met veel opslagruimte hebben is geen signaal.',
            uitleg: 'De signalen gaan over jouw gedrag en gevoel, niet over je toestel. Kijk dus naar wat je doet als je je telefoon níet kunt pakken.',
            leerdoel: 'Je weet waaraan je digitale verslaving bij jezelf kunt herkennen.'
          },
          {
            groep: 'plus',
            vraag: 'Bram gamet elke avond twee uur met zijn laptop op schoot en gaat om half twaalf naar bed. Hij heeft nekpijn en valt pas na een uur in slaap. Leg de twee oorzaken en de twee oplossingen uit.',
            antwoord: 'De nekpijn komt door zijn houding: met de laptop op schoot hangt zijn hoofd ver naar voren. Het lastig inslapen komt door het blauwe licht, dat de aanmaak van melatonine remt. De oplossingen zijn: laptop op tafel op ooghoogte, en het scherm een uur voor bedtijd wegleggen.',
            uitleg: 'Twee klachten met twee verschillende oorzaken vragen dus om twee verschillende maatregelen. Alleen nachtmodus aanzetten lost zijn nekpijn niet op.',
            leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.'
          }
        ]
      }),

    p('6.6', 'Nepnieuws, deepfake en betrouwbare bronnen', ['21B', '21D'], 'factcheckdossier met een gecontroleerd bericht en je bronvermelding', 100, 'Factcheck Rush',
      ['Wat nepnieuws is en waaraan je het herkent',
        "Je ziet het misschien elke dag: een schokkend bericht op Instagram of TikTok, zoals bekende rapper vermoord in Parijs. Een ander voorbeeld is de kop Temu-pakketjes besmet met corona, en de vraag is dan steeds: klopt dat wel? Fake news, in het Nederlands nepnieuws, is nieuws dat niet waar is: het lijkt echt, maar het is bedacht of verdraaid. Mensen maken fake news om geld te verdienen, om beroemd te worden, of om anderen te beïnvloeden. In 2020 ging het verhaal rond dat je van 5G-straling corona kon krijgen. Dit was compleet onzin, maar mensen geloofden het echt en staken in Nederland zelfs zendmasten in brand. Zo gevaarlijk kan nepnieuws zijn, en juist daarom loont het om te weten waaraan je het herkent. Nepnieuws ziet er namelijk vaak professioneel uit, en toch zijn er drie kenmerken die je verder helpen." +
        "</p><ol>" +
        "<li><strong>Een opvallende titel.</strong> Nepnieuws heeft vaak een heftige of schokkende kop, zoals: zangeres overlijdt na boosterprik, familie zwijgt. Zo'n kop is geen samenvatting maar lokaas, want de makers willen vooral dat je erop klikt; dat heet clickbait.</li>" +
        "<li><strong>Een betrouwbare bron ontbreekt.</strong> Een bron is de schrijver of de organisatie waarvan een bericht komt. Is die bron een universiteit of een bekende nieuwssite zoals de NOS, RTL Nieuws of het Jeugdjournaal, dan is het een betrouwbare bron. Nepnieuws komt daarentegen vaak van vage websites of noemt helemaal geen bron, zodat niemand erop aangesproken kan worden.</li>" +
        "<li><strong>Oude of neppe foto's.</strong> Beeld overtuigt sneller dan tekst en is makkelijk te hergebruiken. Soms zetten nepnieuws-sites er een explosie van tien jaar geleden bij, die nu zogenaamd in Oekraïne zou zijn gebeurd.</li>" +
        "</ol><p>" +
        "Zie je twee of drie van deze kenmerken tegelijk, dan is de kans op nepnieuws heel groot. Eén kenmerk alleen is nog geen bewijs, want ook echt nieuws heeft weleens een schreeuwerige kop."],
      ['Deepfake, en hoe je zelf controleert',
        'Deepfake is een techniek waarbij met kunstmatige intelligentie een neppe video of audio gemaakt wordt. Daarin lijkt het alsof iemand iets zegt of doet wat in werkelijkheid nooit is gebeurd. Je ziet bijvoorbeeld een video van president Obama die iets geks zegt, en zijn gezicht beweegt heel normaal. Zijn stem klinkt bovendien echt, en toch is de hele video nep en met deepfake-technologie gemaakt. Het maken gaat in drie stappen, en die stappen verklaren meteen waarom bekende mensen het vaakst slachtoffer zijn. Eerst worden met AI duizenden beelden van een persoon bekeken en vergeleken, bijvoorbeeld al zijn gezichtsuitdrukkingen. Daarna plakt de computer het gezicht van die persoon over iemand anders heen, beeldje voor beeldje. Ten slotte kan ook de stem met AI worden nagemaakt, zodat beeld en geluid samen kloppen. Dat is gevaarlijk, want mensen geloven iets dat niet klopt en worden daar bang of boos van. Vervolgens verspreiden ze het bericht verder, en zo ontstaan er ruzies of zelfs geweld. In India ging op WhatsApp het bericht rond dat er kinderdieven actief waren in de buurt. Het bericht was niet waar, maar mensen gingen er toch op af en in één dorp werd een onschuldige man doodgeknuppeld. Gelukkig kun je leren nep van echt te onderscheiden, en dat kost minder tijd dan je denkt. Denk altijd aan deze vier vragen: wie heeft dit gemaakt en wat is de bron? Is het al door anderen gecontroleerd, en is het logisch wat er staat? Zo\'n controle heet een factcheck, en je hoeft hem gelukkig niet altijd helemaal zelf te doen. Gebruik daarvoor sites als Nieuwscheckers.nl, Drogredenen.nl of Snopes.com, waar mensen berichten al hebben nagelopen. Of check het via Google: typ het bericht in en kijk wat andere, betrouwbare sites erover zeggen.'],
      [
        media('https://www.youtube.com/embed/KgPFSsv9-jw', 'Hoe herken je nepnieuws?', 'Hoe kun je nepnieuws toch herkennen, ook al lijkt het echt? Noem twee dingen uit de video.'),
        media('https://www.youtube.com/embed/l8JC2R3sbsk', 'Zo werkt een deepfake', 'Welk detail in de video verraadt volgens jou het duidelijkst dat het beeld nep is?')
      ],
      [
        {
          vraag: 'Aan welke drie dingen denk jij dat je nepnieuws kunt herkennen? Schrijf je gok op.',
          antwoord: 'Aan een opvallende, schokkende titel (clickbait), aan het ontbreken van een betrouwbare bron, en aan oude of neppe foto\'s.',
          uitleg: 'Een tekst zonder spelfouten of een foto erbij zegt niets over de waarheid. Nepnieuws ziet er juist vaak verzorgd uit.',
          leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.'
        },
        {
          vraag: 'Wat is een deepfake, denk je? En hoe zou zo\'n video gemaakt kunnen worden?',
          antwoord: 'Een deepfake is een neppe video of audio, gemaakt met AI, waarin iemand iets lijkt te zeggen of te doen wat nooit gebeurd is. AI bekijkt duizenden beelden, plakt het gezicht over iemand anders heen en maakt ook de stem na.',
          uitleg: 'Een deepfake is dus meer dan een bewerkt filmpje. Bij bekende mensen lukt het het best, omdat er zoveel beeld van hen bestaat.',
          leerdoel: 'Je weet wat een deepfake is en hoe die gemaakt wordt.'
        },
        {
          vraag: 'Hoe zou jij controleren of een bericht klopt? Beschrijf je eigen aanpak in drie zinnen.',
          antwoord: 'Je stelt vier vragen: wie heeft dit gemaakt, wat is de bron, is het al door anderen gecontroleerd, en is het logisch? Daarna zoek je het bericht op bij een bekende nieuwssite of bij Nieuwscheckers.nl.',
          uitleg: 'Zo\'n controle heet een factcheck. Zoeken kost een paar minuten en scheelt je een doorgestuurd bericht waar je later spijt van hebt.',
          leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.'
        }
      ],
      {
        tekst: "Word zelf factchecker; maak alle onderdelen in een Word-document. Onderdeel 1: geef in twee zinnen je mening over de uitspraak mensen zijn zelf verantwoordelijk of ze nepnieuws geloven. Onderdeel 2: bekijk de video over deepfakes hierboven (https://www.youtube.com/embed/l8JC2R3sbsk) en leg daarna uit waarom deepfake gevaarlijk kan zijn. Beantwoord ook: kun je deepfake ook voor positieve doeleinden inzetten? Onderdeel 3: zoek online, bijvoorbeeld op Google, naar een nepnieuwsbericht dat rondging in Nederland. Schrijf kort op wat het bericht was, waarom het fake news was en wat de gevolgen waren. Onderdeel 4, de factcheck: je ziet dit bericht op TikTok: vanaf vandaag moeten alle Nederlanders 3 keer per week een coronatest doen, anders krijg je geen studiefinanciering meer. Gebruik Google en minimaal een betrouwbare website om te controleren of dit klopt. Schrijf op wat je vindt en of je het bericht zou vertrouwen, en zeg ook welke website je hebt gebruikt om uit te zoeken of het echt is. Onderdeel 5: ga naar https://nieuwscheckers.nl/ en zoek een artikel op. Schrijf op welk bericht je hebt gevonden en wat er nep aan was. Zet erbij waar de foto of het bericht dan wel echt vandaan komt, of waar het wel echt over ging. Onderdeel 6: schrijf in een zin op wat jij het meest verrassende of schokkende vond uit deze paragraaf en wat je geleerd hebt dat je nog niet wist. Let op: hierna volgt de eindtoets mediawijsheid. Het is de bedoeling dat je daarvoor leert; neem de begrippen uit dit hele hoofdstuk door, dat zijn de dikgedrukte woorden met uitleg.",
        label: 'Lever je factcheckdossier in: je mening, je uitleg over deepfake, je nepnieuwsvoorbeeld, je eigen factcheck met bronvermelding en je Nieuwscheckers-artikel.',
        modelAnswer: "Onderdeel 1. Ik vind mensen deels zelf verantwoordelijk, want je kunt altijd de bron controleren voordat je iets gelooft. Tegelijk is nepnieuws expres gemaakt om echt te lijken, dus je kunt het iemand niet volledig kwalijk nemen. Onderdeel 2. Deepfake is gevaarlijk omdat je iemand ziet en hoort, en beeld geloven mensen sneller dan tekst. Zo kan iemand woorden in de mond gelegd krijgen die hij nooit gezegd heeft. Positief kan het ook: in films kun je een acteur jonger maken, en iemand die zijn stem verloren heeft, kan die terugkrijgen. Onderdeel 3. Het bericht dat 5G-straling corona zou veroorzaken ging in 2020 in Nederland rond. Het was fake news, want er is geen enkel verband tussen straling en een virus. Het gevolg was dat er zendmasten in brand werden gestoken. Onderdeel 4. Het TikTok-bericht over drie coronatesten per week klopt niet. Ik heb het in Google getypt en gekeken bij de NOS en op rijksoverheid.nl; daar staat niets over zo'n verplichting. Ik zou het bericht dus niet vertrouwen en niet doorsturen. De website die ik gebruikte is nos.nl. Onderdeel 5. Bij Nieuwscheckers vond ik een artikel over een foto die zogenaamd bij een recente ramp hoorde. De foto was echt, maar hij kwam van een gebeurtenis van jaren eerder in een ander land. Onderdeel 6. Ik vond het meest schokkend dat er in India een onschuldige man is doodgeknuppeld door een nepbericht op WhatsApp. Ik wist niet dat nepnieuws zo ver kon gaan.",
        nakijkpunten: [
          'Alle zes de onderdelen staan erin, ook de mening van twee zinnen en de slotzin over wat verrast heeft.',
          'De factcheck van het TikTok-bericht noemt met naam de betrouwbare website die is gebruikt.',
          'Het Nieuwscheckers-artikel wordt beschreven mét waar de foto of het bericht wél echt vandaan komt.',
          'Bij deepfake staan zowel het gevaar als één positieve toepassing.'
        ]
      },
      ['Noem drie kenmerken van nepnieuws.', 'Wat is clickbait?', 'Wat is een bron?', 'Hoe wordt een deepfake gemaakt?', 'Welke vier vragen stel je bij een bericht?'],
      'Beoordeel berichten onder tijdsdruk op kop, bron en beeld en verzamel bewijs voordat je doorstuurt.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Bekijk samen deze kop: "SCHOKKEND: zangeres overlijdt na boosterprik, familie zwijgt!" Welke twee kenmerken van nepnieuws zien jullie al in die ene regel?',
            antwoord: 'De opvallende, schokkende titel met hoofdletters en een uitroepteken, en het ontbreken van een bron of een auteur.',
            uitleg: 'Zo\'n kop is clickbait: hij is gemaakt om je te laten klikken, niet om je te informeren. Het derde kenmerk, de foto, moet je apart bekijken.',
            leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.'
          },
          {
            groep: 'samen',
            vraag: 'Loop samen de vier controlevragen langs bij een bericht dat een van jullie vandaag gezien heeft. Wie heeft het gemaakt, wat is de bron, is het gecontroleerd, en is het logisch?',
            antwoord: 'Een goed antwoord noemt per vraag wat jullie wel of niet konden vinden, en eindigt met een conclusie: wel of niet vertrouwen.',
            uitleg: 'De vier vragen zijn samen een factcheck. Als je op twee ervan geen antwoord vindt, is dat al reden genoeg om het niet door te sturen.',
            leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.'
          },
          {
            groep: 'zelf',
            vraag: 'Een filmpje gaat rond waarin de minister-president zegt dat de zomervakantie twee weken korter wordt. Hoe controleer je dit in vijf minuten?',
            antwoord: 'Je kijkt eerst wie het gepost heeft en of er een ministerie of persconferentie genoemd wordt. Daarna typ je de zin in Google en kijk je of de NOS of het Jeugdjournaal het meldt. Tot slot vraag je je af of het logisch is.',
            uitleg: 'Een besluit van deze omvang zou overal in het nieuws staan. Staat het nergens bij een bekende nieuwssite, dan is dat het sterkste teken dat het nep is.',
            leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.'
          },
          {
            groep: 'zelf',
            vraag: 'Leg in drie stappen uit hoe een deepfake gemaakt wordt.',
            antwoord: 'Eerst bekijkt en vergelijkt AI duizenden beelden van een persoon, bijvoorbeeld alle gezichtsuitdrukkingen. Daarna plakt de computer dat gezicht over iemand anders heen. Ten slotte kan de stem ook met AI worden nagemaakt.',
            uitleg: 'Pas met die drie stappen samen ontstaat een deepfake. Een oude foto opnieuw plaatsen is dus iets heel anders.',
            leerdoel: 'Je weet wat een deepfake is en hoe die gemaakt wordt.'
          },
          {
            groep: 'steun',
            vraag: 'Welke bron is het meest betrouwbaar: een anoniem account, een site die Gekke Gabber Nieuws heet, of de Universiteit van Amsterdam?',
            antwoord: 'De Universiteit van Amsterdam.',
            uitleg: 'Een universiteit zet haar naam onder wat ze publiceert en kan daarop aangesproken worden. Bij een anoniem account kun je niets controleren.',
            leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.'
          },
          {
            groep: 'steun',
            vraag: 'Vul in: een heftige kop die je vooral moet laten klikken heet ....',
            antwoord: 'Clickbait.',
            uitleg: 'Clickbait betekent letterlijk klik-aas. De kop is het lokaas en jouw klik is wat ze willen hebben.',
            leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.'
          },
          {
            groep: 'plus',
            vraag: 'Waarom is een deepfake moeilijker te ontkrachten dan een nepbericht in tekst? Ontkrachten betekent: aantonen dat iets niet waar is.',
            antwoord: 'Bij een deepfake zie en hoor je iemand, en beeld en geluid geloven mensen sneller dan tekst. Ook als je later bewijst dat het nep was, blijft het beeld bij mensen hangen.',
            uitleg: 'Daarom verspreidt een deepfake zich harder dan een geschreven bericht. Diezelfde techniek kan trouwens ook nuttig zijn, bijvoorbeeld in films of om iemand zijn stem terug te geven.',
            leerdoel: 'Je weet wat een deepfake is en hoe die gemaakt wordt.'
          }
        ]
      }),

    checkpoint('6.7', 'Checkpoint: eindtoets mediawijsheid', ['21B', '23B', '23C'], 'bewijs van deelname met je resultaat plus een terugblik van vijf regels', 120, 'Mediawijs Meesterproef',
      ['Wat je in dit hoofdstuk hebt geleerd',
        'Dit hoofdstuk ging over mediawijs zijn: begrijpen hoe media jou sturen, en daarna zelf kiezen wat je ermee doet. Je weet nu dat een algoritme jouw tijdlijn samenstelt uit wat je aanklikt en hoe lang je kijkt. Je kunt uitleggen hoe FOMO, druk en het vergelijken met bewerkte beelden je zelfbeeld raken. Je weet wat cyberpesten is en wat het doet met het slachtoffer, de pester en de omstander. Ook weet je welke stappen jij kunt zetten als je het meemaakt of ziet gebeuren. Je kent de klachten van te veel schermtijd en de regel waarmee je ze voorkomt. En je kunt nepnieuws en een deepfake herkennen en daarna zelf een bron op betrouwbaarheid controleren. Deze toets hoort bij de eindtoets mediawijsheid uit de lessenserie, en die gaat over les 9 tot en met 14. Neem daarom ook de begrippen uit hoofdstuk 5 over normen, waarden en online kopen nog een keer door. Er staan in deze toets echt vragen over, en die tellen gewoon mee. De beste manier van leren is niet herlezen maar overhoren, en dat scheelt je bovendien tijd. Dek de uitleg af en probeer elk begrip eerst zelf uit je hoofd te zeggen. Wat je dan niet weet, lees je gericht terug in plaats van alles opnieuw.'],
      ['Zo maak je de toets, en hoe het daarna verdergaat',
        'Om deze toets te maken moet je de paragrafen van dit hoofdstuk gemaakt hebben; neem de teksten nog eens door voordat je begint. Let op: deze paragraaf bestaat uit drie onderdelen, en elk onderdeel heeft een ander doel. Het diagnoseblok van 24 opgaven is geen toets, maar een check die je gaten aanwijst. Daarna komt de HELIX-toets op je scherm, die per leerdoel laat zien wat jij al beheerst. Ten slotte is er de eindtoets uit de lessenserie op Wikiwijs, en die levert je bewijsstuk op. Alleen van die laatste lever je een bewijs van deelname in bij je docent. Verwar de twee toetsen dus niet: de HELIX-toets is om te leren, de Wikiwijs-toets om te bewijzen. De toets uit de lessenserie staat op Wikiwijs en bevat 29 vragen, waarvan je er 20 willekeurig krijgt. Vanaf 55 procent goed heb je een voldoende, dus je mag een aantal vragen missen. Aan het einde van de toets krijg je een bewijs van deelname met je resultaat te zien. Van dat scherm maak je een screenshot dat je deelt met je docent, want zonder dat bewijs telt je resultaat niet mee. Je maakt de toets tijdens de les of als opdracht wanneer je docent dat aangeeft. Reken op twee lesuren voor deze paragraaf, want vijf bronlessen komen hier samen. In het eerste uur doe je de diagnose en herhaal je gericht wat daaruit komt. In het tweede uur maak je eerst de HELIX-toets en daarna de eindtoets op Wikiwijs. Je werkt zelfstandig: de Digidocent staat hier uit, omdat deze toets moet laten zien wat jij zelf al weet. Werk rustig en lees bij elke vraag eerst alle antwoorden helemaal door voordat je iets kiest. Juist bij nepnieuws en cyberpesten lijken twee antwoordopties vaak sterk op elkaar, en dan telt het verschil. Kom je er echt niet uit, sla de vraag dan over en kom later terug. Na de toets zijn er twee routes, en welke route jij krijgt hangt af van je resultaat. Ging een leerdoel mis, dan volg je het herstelspoor. Je doet de oefeningen bij dat leerdoel opnieuw en levert één nieuw bewijsje in. Ging alles goed, dan volg je het verdiepingsspoor en maak je de vrijwillige plusparagraaf 6.8 over aanbevelingsalgoritmes. Welke route je ook krijgt, je begint met het diagnoseblok hierboven: dat wijst per gemist doel aan waar je moet zijn.'],
      null,
      [
        {
          vraag: 'Schrijf per paragraaf van dit hoofdstuk één begrip op met je eigen uitleg, zonder terug te lezen. Welk begrip lukte niet?',
          antwoord: 'Bijvoorbeeld: 6.1 algoritme, 6.2 FOMO, 6.3 omstander, 6.4 vertrouwenspersoon, 6.5 de 20-20-2 regel, 6.6 clickbait.',
          uitleg: 'Het begrip dat niet lukte is precies je leerpunt. Overhoren werkt beter dan herlezen, omdat je nu al merkt wat er ontbreekt.',
          leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.'
        },
        {
          vraag: 'Welke twee onderwerpen uit dit hoofdstuk vind jij het moeilijkst, en wat ga je daaraan doen voor de toets?',
          antwoord: 'Bijvoorbeeld: de gevolgen per rol bij cyberpesten en de betekenis van de drie getallen in de 20-20-2 regel. Ik lees die stukken terug en overhoor mezelf daarna.',
          uitleg: 'Twee onderwerpen kiezen is realistischer dan alles nog eens doen. Gericht terugzoeken kost minder tijd en levert meer op.',
          leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.'
        },
        {
          vraag: 'Waar sla jij je bewijs van deelname op, en hoe deel je het precies met je docent?',
          antwoord: 'Ik maak meteen een schermafbeelding van het eindscherm, sla die op in mijn map in OneDrive en deel hem zoals mijn docent heeft aangegeven.',
          uitleg: 'De toets bewaart je resultaat niet voor je docent. Sluit je het tabblad zonder afbeelding, dan moet je opnieuw beginnen.',
          leerdoel: 'Je kunt je resultaat opslaan en delen met je docent.'
        }
      ],
      {
        tekst: "Maak de eindtoets mediawijsheid en lever je bewijs in. Stap 1: leer de begrippen van dit hoofdstuk uit je hoofd, per paragraaf. Uit 6.1 en 6.2: algoritme, social media, trending, FOMO, druk, zelfbeeld, highlight reel-effect, filters en bewerkingen, sociale bevestiging, filterbubbel en influencer. Uit 6.3 en 6.4: cyberpesten, anoniem, omstander, reputatie, rapporteren, aangifte en vertrouwenspersoon. Uit 6.5 en 6.6: blauw licht, melatonine, de 20-20-2 regel, digitale verslaving, nepnieuws, clickbait, bron en deepfake. Neem daarnaast de begrippen uit hoofdstuk 5 door: norm, waarde, gedragsregel, privacy, iDEAL, creditcard, Klarna en achteraf betalen. Die staan er echt in, want de toets uit de lessenserie gaat over les 9 tot en met 14. Stap 2: maak de eindtoets uit de lessenserie via https://maken.wikiwijs.nl/p/questionnaire/standalone/8329938; dat is dus een andere toets dan de HELIX-toets op je scherm. Je krijgt in totaal 20 willekeurige vragen uit een set van 29, en vanaf 55 procent goed heb je een voldoende. Stap 3: maak aan het einde een screenshot van je bewijs van deelname, met je resultaat erop. Sla dat op in OneDrive en deel het met je docent zoals hij of zij heeft aangegeven. Stap 4: schrijf in een Word-bestand een terugblik van vijf regels. Welke twee vragen gingen mis, bij welke paragraaf van dit hoofdstuk hoorden ze, en wat ga je daaraan doen? Stap 5: kies je route. Ging een leerdoel mis, dan doe je de oefeningen bij dat leerdoel opnieuw en lever je één nieuw bewijsje in; dat is het herstelspoor. Ging alles goed, dan mag je door naar de vrijwillige plusparagraaf 6.8. Lever je screenshot, je terugblik en je gekozen route samen in.",
        label: 'Lever in: je bewijs van deelname met je resultaat, je terugblik van vijf regels en de route die je kiest.',
        modelAnswer: "Ik heb de toets gemaakt en 70 procent goed, dus een voldoende. Van het eindscherm met mijn bewijs van deelname heb ik meteen een schermafbeelding gemaakt en die staat in mijn map Digitale geletterdheid in OneDrive; ik heb hem met mijn docent gedeeld via de manier die zij had aangegeven. Twee vragen gingen mis. De eerste ging over de gevolgen per rol bij cyberpesten: ik koos reputatie bij het slachtoffer, terwijl reputatie bij de pester hoort. Die vraag hoort bij paragraaf 6.3. De tweede ging over de 20-20-2 regel: ik dacht dat de 2 twee uur zonder scherm betekende, maar het zijn twee uur buiten per dag. Die vraag hoort bij paragraaf 6.5. Ik kies daarom het herstelspoor voor die twee leerdoelen. Ik doe de oefeningen van 6.3 en 6.5 opnieuw en lever als nieuw bewijsje een schema in met de drie rollen en hun gevolgen.",
        nakijkpunten: [
          'Het bewijs van deelname met het resultaat is ingeleverd en de opslagplek en manier van delen worden genoemd.',
          'De terugblik noemt twee vragen die misgingen én bij welke paragraaf ze horen.',
          'Er staat een concrete vervolgactie in, niet alleen "beter leren".',
          'De gekozen route is benoemd: herstelspoor bij een gemist leerdoel, of verdieping met 6.8.'
        ]
      },
      ['Waarop baseert een algoritme zijn keuze?', 'Wat is sociale bevestiging?', 'Wat zijn filters en bewerkingen?', 'Wat is een influencer?', 'Wat is een omstander?', 'Welke klachten krijgt een slachtoffer van cyberpesten?', 'Wat neem je mee als bewijs bij een melding?', 'Wat doe je als je online iets ziet wat niet oké is?', 'Waar kun je anoniem hulp vragen?', 'Wat houdt de 20-20-2 regel in?', 'Wat doet blauw licht met melatonine?', 'Waarom kun je een bril nodig hebben van te veel schermtijd?', 'Wat doe je bij een verdacht bericht op TikTok?', 'Wat is een waarde en wat is een gedragsregel?', 'Hoe deel je je resultaat met je docent?'],
      'Vijf kamers, elke kamer een leerdoel uit dit hoofdstuk, met een eindsleutel die je alleen krijgt bij volledig bewijs.',
      false,
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Spreek met je buurman of buurvrouw af hoe jullie de diagnose hierna gebruiken. Wat schrijf je op zodra een vraag misgaat, en waar zoek je dat leerdoel terug?',
            antwoord: 'Je noteert het leerdoel letterlijk en de paragraaf waar het bij hoort, bijvoorbeeld: "Je weet wat een omstander is" bij 6.3.',
            uitleg: 'De diagnose is geen cijfer maar een wegwijzer, en die wijzer werkt alleen als je opschrijft wat er misging. Zonder notitie weet je straks nog steeds niet welk stuk je moet herhalen.',
            leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.'
          },
          {
            groep: 'samen',
            vraag: 'Leg elkaar uit wat het herstelspoor en het verdiepingsspoor inhouden, en wanneer je welk spoor volgt.',
            antwoord: 'Ging er een leerdoel mis, dan volg je het herstelspoor met de steunopgaven hieronder. Ging alles goed, dan mag je door naar de plusopgaven en naar de vrijwillige paragraaf 6.8.',
            uitleg: 'Beide sporen bestaan naast elkaar, dus je hoeft niet alles opnieuw te doen. Je herhaalt alleen het leerdoel dat nog niet zat, en de rest gebruik je om verder te komen.',
            leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vooraf, vraag 1 van 24. Zeg in één zin wat een algoritme op social media precies is en doet.',
            antwoord: 'Een algoritme is een computerregel die uitrekent welke filmpjes en berichten jij in je tijdlijn te zien krijgt.',
            uitleg: 'Gaat dit mis, dan hoort daar paragraaf 6.1 bij, theorieblok 1. Let vooral op dat het geen mens en geen knop is, maar een berekening per persoon.',
            leerdoel: 'Je kunt uitleggen wat een algoritme op social media is.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vooraf, vraag 2 van 24. Noem drie dingen waarvan het algoritme leert, en zeg welk signaal het zwaarst weegt.',
            antwoord: 'Het leert van je klikken, van je kijktijd en van wat je opzoekt; ook likes, reacties, gevolgde accounts en wegswipen tellen mee. Kijktijd weegt het zwaarst.',
            uitleg: 'Gaat dit mis, dan hoort daar paragraaf 6.1 bij, theorieblok 2. Doe daar de steunopgave waarin je doorstreept wat er niet bij hoort.',
            leerdoel: 'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vooraf, vraag 3 van 24. Noem één voordeel en één nadeel van algoritmes, en zeg er bij het nadeel bij voor wie dat een probleem is.',
            antwoord: 'Voordeel: je vindt sneller muziek of sport die bij je past. Nadeel: je komt bijna geen andere meningen meer tegen, en dat is een probleem voor jou als kijker.',
            uitleg: 'Gaat dit mis, dan hoort daar paragraaf 6.1 bij, theorieblok 2. Herhaal daar de zelf-opgave waarin je bij het nadeel opschrijft wie er last van heeft.',
            leerdoel: 'Je kunt een voordeel en een nadeel van algoritmes noemen.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vooraf, vraag 4 van 24. Leg in twee zinnen het verschil uit tussen FOMO en druk voelen.',
            antwoord: 'FOMO is de angst dat je iets leuks of belangrijks mist als je niet kijkt. Druk is het gevoel dat je iets moet doen omdat anderen het ook doen.',
            uitleg: 'Gaat dit mis, dan hoort daar paragraaf 6.2 bij, theorieblok 1. Onthoud het verschil in richting: FOMO trekt je naar het scherm, druk stuurt je gedrag daarbuiten.',
            leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vooraf, vraag 5 van 24. Wat is het highlight reel-effect, en wat is een filterbubbel?',
            antwoord: 'Het highlight reel-effect is dat mensen alleen hun leukste en mooiste momenten laten zien. Een filterbubbel is dat je steeds dezelfde soort berichten krijgt, waardoor andere meningen verdwijnen.',
            uitleg: 'Gaat dit mis, dan hoort daar paragraaf 6.2 bij, theorieblok 2. Het eerste gaat over wat anderen posten, het tweede over wat jij te zien krijgt.',
            leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vooraf, vraag 6 van 24. Noem twee dingen die jij zelf kunt doen om positiever met social media om te gaan, met per maatregel het effect.',
            antwoord: 'Meldingen uitzetten, zodat je zelf het moment kiest waarop je kijkt. En social media-pauzes plannen, zodat je merkt hoeveel tijd je overhoudt.',
            uitleg: 'Gaat dit mis, dan hoort daar paragraaf 6.2 bij, theorieblok 2. Ook positieve accounts volgen en negatieve vermijden telt als goede maatregel.',
            leerdoel: 'Je kunt twee dingen noemen die jij kunt doen om positiever met social media om te gaan.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vooraf, vraag 7 van 24. Wat is cyberpesten, en noem er twee voorbeelden bij uit apps of games.',
            antwoord: 'Cyberpesten is pesten via internet, telefoon of andere digitale middelen. Voorbeelden: iemand uitschelden in een groepsapp en een gênante foto van iemand verspreiden.',
            uitleg: 'Gaat dit mis, dan hoort daar paragraaf 6.3 bij, theorieblok 1. Buitensluiten in een online groep en een nepaccount maken horen er ook bij.',
            leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vooraf, vraag 8 van 24. Noem per rol één gevolg van cyberpesten: voor het slachtoffer, voor de pester en voor de omstander.',
            antwoord: 'Slachtoffer: buikpijn, slecht slapen of angst om naar school te gaan. Pester: straf, aangifte of een slechte reputatie. Omstander: spijt of een schuldgevoel.',
            uitleg: 'Gaat dit mis, dan hoort daar paragraaf 6.3 bij, theorieblok 2. Maak daar de steunopgave met de drie rollen opnieuw, want die drie worden vaak verwisseld.',
            leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vooraf, vraag 9 van 24. Geef de betekenis van de woorden anoniem, omstander en reputatie.',
            antwoord: 'Anoniem: niemand weet wie jij bent. Omstander: iemand die het ziet, niet meepest en ook niet helpt. Reputatie: hoe anderen over jou denken.',
            uitleg: 'Gaat dit mis, dan hoort daar paragraaf 6.3 bij. Deze drie woorden komen in de bron-eindtoets terug als koppelopgave, dus ken ze uit je hoofd.',
            leerdoel: 'Je weet wat de woorden anoniem, omstander en reputatie betekenen.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vooraf, vraag 10 van 24. Noem drie stappen die jij zet als je zelf online gepest wordt, in de goede volgorde.',
            antwoord: 'Eerst praten met iemand die je vertrouwt, dan screenshots maken van de berichten, dan de pesters blokkeren. Daarna meld je het bij je mentor of de vertrouwenspersoon.',
            uitleg: 'Gaat dit mis, dan hoort daar paragraaf 6.4 bij, theorieblok 1. Let op de volgorde: bewijs bewaren gaat altijd vóór blokkeren of opruimen.',
            leerdoel: 'Je weet wat je kunt doen als je zelf gepest wordt.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vooraf, vraag 11 van 24. Wat doe je als je ziet dat iemand anders online gepest wordt? Noem drie handelingen.',
            antwoord: 'Niet negeren en niet meelachen, privé een steunend berichtje sturen, het bericht rapporteren bij de app, en het melden bij een docent of mentor.',
            uitleg: 'Gaat dit mis, dan hoort daar paragraaf 6.4 bij, theorieblok 2. Rapporteren bij de app wordt het vaakst vergeten, terwijl dat juist altijd kan.',
            leerdoel: 'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vooraf, vraag 12 van 24. Waar kun je hulp vragen bij pesten, en wat betekent aangifte doen?',
            antwoord: 'Op school bij je mentor of de vertrouwenspersoon, en daarbuiten anoniem via Pestweb of de Kindertelefoon; bij zelfmoordgedachten bel je 0800-0113. Aangifte doen is naar de politie gaan om te melden dat er iets ergs is gebeurd.',
            uitleg: 'Gaat dit mis, dan hoort daar paragraaf 6.4 bij. Houd rapporteren, blokkeren en aangifte doen uit elkaar: dat zijn de app, je eigen telefoon en de politie.',
            leerdoel: 'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vooraf, vraag 13 van 24. Noem drie klachten van te lang schermgebruik en zet er per klacht de oorzaak bij.',
            antwoord: 'Rug- en nekklachten door een slechte houding, slecht slapen door blauw licht dat melatonine remt, en droge ogen of hoofdpijn. Op termijn kun je zelfs een bril nodig hebben door te vaak dichtbij kijken.',
            uitleg: 'Gaat dit mis, dan hoort daar paragraaf 6.5 bij, theorieblok 1. Maak daar de koppelopgave gevolg-probleem opnieuw, want de oorzaken worden vaak verwisseld.',
            leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vooraf, vraag 14 van 24. Leg de 20-20-2 regel uit en zeg hoe vaak je hem toepast tijdens een uur huiswerk.',
            antwoord: 'Na elke 20 minuten schermtijd kijk je 20 seconden naar iets op minstens 6 meter afstand. Daarnaast ben je minstens 2 uur per dag buiten. In een uur huiswerk is dat 60 gedeeld door 20, dus drie keer.',
            uitleg: 'Gaat dit mis, dan hoort daar paragraaf 6.5 bij, theorieblok 2. Reken altijd met delen door 20 en naar beneden afronden, en tel de 2 uur buiten daar nooit in mee.',
            leerdoel: 'Je kunt de 20-20-2 regel uitleggen en toepassen.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vooraf, vraag 15 van 24. Aan welke drie signalen kun je digitale verslaving bij jezelf herkennen?',
            antwoord: 'Je kunt bijna niet stoppen met je scherm, je wordt rusteloos of ongemakkelijk zonder telefoon, en school, familie of hobby\'s krijgen minder aandacht.',
            uitleg: 'Gaat dit mis, dan hoort daar paragraaf 6.5 bij, theorieblok 2. De signalen gaan over jouw gedrag en gevoel, en nooit over je toestel zelf.',
            leerdoel: 'Je weet waaraan je digitale verslaving bij jezelf kunt herkennen.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vooraf, vraag 16 van 24. Noem de drie kenmerken waaraan je nepnieuws kunt herkennen.',
            antwoord: 'Een opvallende, schokkende titel die clickbait is, het ontbreken van een betrouwbare bron, en oude of neppe foto\'s.',
            uitleg: 'Gaat dit mis, dan hoort daar paragraaf 6.6 bij, theorieblok 1. Let op: een tekst zonder spelfouten of met een foto erbij zegt niets over de waarheid.',
            leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vooraf, vraag 17 van 24. Wat is een deepfake, en in welke drie stappen wordt die gemaakt?',
            antwoord: 'Een deepfake is een neppe video of audio waarin iemand met AI iets lijkt te zeggen wat nooit gebeurd is. AI bekijkt duizenden beelden, plakt het gezicht over iemand anders heen, en maakt daarna ook de stem na.',
            uitleg: 'Gaat dit mis, dan hoort daar paragraaf 6.6 bij, theorieblok 2. Een oude foto opnieuw plaatsen is dus iets heel anders dan een deepfake maken.',
            leerdoel: 'Je weet wat een deepfake is en hoe die gemaakt wordt.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vooraf, vraag 18 van 24. Welke vier vragen stel je om te controleren of een bericht en zijn bron betrouwbaar zijn, en welke sites gebruik je daarbij?',
            antwoord: 'Wie heeft dit gemaakt, wat is de bron, is het al door anderen gecontroleerd, en is het logisch? Je gebruikt Nieuwscheckers.nl, Drogredenen.nl of Snopes.com, of je typt het bericht in Google.',
            uitleg: 'Gaat dit mis, dan hoort daar paragraaf 6.6 bij, theorieblok 2. Zo\'n controle heet een factcheck, en twee vragen zonder antwoord zijn al reden om niet door te sturen.',
            leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vooraf, vraag 19 van 24. Schrijf uit elke paragraaf van dit hoofdstuk één begrip op met je eigen uitleg, zonder terug te lezen.',
            antwoord: 'Bijvoorbeeld: 6.1 algoritme, 6.2 highlight reel-effect, 6.3 omstander, 6.4 vertrouwenspersoon, 6.5 de 20-20-2 regel en 6.6 clickbait, elk met een eigen zin uitleg.',
            uitleg: 'Gaat dit mis, dan mist er nog overzicht over het hele hoofdstuk. Overhoren werkt hier beter dan herlezen, want je merkt meteen welk begrip nog niet zit.',
            leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vooraf, vraag 20 van 24. Beschrijf stap voor stap hoe je straks je bewijs van deelname opslaat en met je docent deelt.',
            antwoord: 'Zodra het eindscherm verschijnt maak ik er een schermafbeelding van, ik sla die op in mijn map in OneDrive met een duidelijke naam, en pas daarna deel ik hem zoals mijn docent heeft aangegeven.',
            uitleg: 'Gaat dit mis, dan hoort daar het tweede leerdoel van dit checkpoint bij. De toets bewaart je resultaat niet voor je docent, dus zonder afbeelding moet je opnieuw beginnen.',
            leerdoel: 'Je kunt je resultaat opslaan en delen met je docent.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vooraf, vraag 21 van 24. Terugblik hoofdstuk 5: wat is het verschil tussen een waarde, een norm of gedragsregel, en privacy?',
            antwoord: 'Een waarde is iets wat jij belangrijk vindt, zoals respect. Een norm of gedragsregel zegt hoe je je hoort te gedragen, bijvoorbeeld: je scheldt niemand uit online. Privacy is persoonlijke informatie die je liever niet met iedereen deelt.',
            uitleg: 'De bron-eindtoets gaat over les 9 tot en met 14, dus deze begrippen komen er echt in terug. Gaat het mis, lees dan 5.1 en 5.2 terug.',
            leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vooraf, vraag 22 van 24. Terugblik hoofdstuk 5: waarom zet je je account op privé, en wat doe je als je online iets ziet wat niet oké is?',
            antwoord: 'Je zet je account op privé om je privacy te beschermen, en niet om meer likes te krijgen of te zien wie je profiel bezoekt. Zie je iets wat niet oké is, dan rapporteer je het bij de app of het platform.',
            uitleg: 'Ook hierover staan vragen in de bron-eindtoets. Gaat het mis, lees dan 5.2 terug en let op het verschil tussen doorsturen, negeren en rapporteren.',
            leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vooraf, vraag 23 van 24. Terugblik hoofdstuk 5: hoe controleer je of een webwinkel betrouwbaar is? Denk aan www.goedkopegames.nl zonder adres en aan www.nike_sport.com.',
            antwoord: 'Ik controleer de URL, ik google de naam op reviews, ik kijk hoe lang de site bestaat en of er meerdere betaalmethodes zijn. Een winkel zonder adres of met een telefoon die nooit wordt opgenomen koop ik niet; een grote merkwinkel verkoopt alleen via zijn eigen URL.',
            uitleg: 'Deze twee scenario\'s staan letterlijk in de bron-eindtoets. Gaat het mis, lees dan 5.3 terug en onthoud dat een slotje nog geen eerlijke winkel betekent.',
            leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vooraf, vraag 24 van 24. Terugblik hoofdstuk 5: koppel iDEAL, creditcard, Klarna en Apple Pay aan de juiste uitleg, en noem één risico van bestellen in China.',
            antwoord: 'iDEAL is direct betalen via je bank, een creditcard is betalen op krediet, Klarna is een Zweedse bank met achteraf betalen, en Apple Pay of Google Pay koppelt je betaalkaarten aan je telefoon of smartwatch. Producten uit China kunnen giftige stoffen bevatten, van slechtere kwaliteit zijn of minder garantie hebben, en er kunnen invoerrechten bij komen.',
            uitleg: 'Deze koppelopgave en de vraag over China staan allebei in de bron-eindtoets. Gaat het mis, lees dan 5.4 terug; betaal je met iDEAL, dan krijg je je geld niet automatisch terug.',
            leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.'
          },
          {
            groep: 'steun',
            vraag: 'Herstelspoor. Ging er een diagnosevraag mis? Schrijf op welk leerdoel dat was en bij welke paragraaf het hoort, en maak daarna de steunopgaven van die paragraaf opnieuw.',
            antwoord: 'Noteer het leerdoel letterlijk, bijvoorbeeld: "Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander", en erbij: paragraaf 6.3.',
            uitleg: 'Het leerdoel opschrijven maakt het herstel klein en concreet. Je hoeft niet het hele hoofdstuk over te doen, alleen dat ene stuk waar je op vastliep.',
            leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.'
          },
          {
            groep: 'steun',
            vraag: 'Herstelspoor. Maak van jouw gemiste leerdoel een spiekkaart van drie regels: het begrip, de uitleg en een voorbeeld uit je eigen apps.',
            antwoord: 'Bijvoorbeeld: omstander - iemand die het pesten ziet, niet meedoet en ook niet helpt - in de klassenapp waar niemand iets zegt.',
            uitleg: 'Zelf een voorbeeld bedenken werkt beter dan het voorbeeld uit de tekst overschrijven. Je koppelt het begrip dan aan een situatie die je echt kent.',
            leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.'
          },
          {
            groep: 'steun',
            vraag: 'Herstelspoor. Ging diagnosevraag 20 mis? Oefen het dan één keer droog: maak nu een schermafbeelding van dit scherm, sla hem op in je map en laat hem aan je buurman zien.',
            antwoord: 'Met de toetsen Windows en Shift en S maak je een schermafbeelding, die je opslaat in je map Digitale geletterdheid in OneDrive, met een duidelijke bestandsnaam.',
            uitleg: 'Wie dit één keer geoefend heeft, hoeft het straks niet meer te bedenken terwijl de toets afloopt. Je bewijs kwijtraken kost je namelijk de hele toets opnieuw.',
            leerdoel: 'Je kunt je resultaat opslaan en delen met je docent.'
          },
          {
            groep: 'plus',
            vraag: 'Verdiepingsspoor. Alles goed in de diagnose? Leg in vijf zinnen uit hoe het algoritme uit 6.1, de filterbubbel uit 6.2 en de verspreiding van nepnieuws uit 6.6 met elkaar samenhangen.',
            antwoord: 'Het algoritme kiest wat aandacht vasthoudt, en schokkende berichten houden veel aandacht vast, dus die worden vaker getoond. Daardoor zie je steeds meer van hetzelfde en kom je in een filterbubbel, waarin bijna niemand het bericht tegenspreekt. Zo verspreidt nepnieuws zich sneller dan een gecontroleerd bericht.',
            uitleg: 'De kern is dat het systeem aandacht meet en geen waarheid. Wie dat begrijpt, snapt meteen waarom een factcheck van jou zelf moet komen.',
            leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.'
          },
          {
            groep: 'plus',
            vraag: 'Verdiepingsspoor. Bedenk een toetsvraag van jezelf over dit hoofdstuk, met drie antwoordopties waarvan er één klopt. Schrijf er ook bij welke denkfout achter elke foute optie zit.',
            antwoord: 'Een goede vraag heeft één duidelijk juist antwoord en twee foute opties die een echte denkfout bevatten, bijvoorbeeld het verwisselen van omstander en pester.',
            uitleg: 'Zelf een vraag maken dwingt je om te bedenken waar anderen struikelen. Dat is een van de sterkste manieren om te controleren of je iets echt beheerst.',
            leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.'
          }
        ]
      }),

    p('6.8', 'Plus: hoe een aanbevelingsalgoritme jou leert kennen', ['21B', '21C', '23C'], 'bubbelexperiment van een week met twee vergelijkbare lijsten en een conclusie', 100, 'Bubbel Doorbreker',
      ['Hoe een aanbevelingsalgoritme een profiel van jou bouwt',
        'Een aanbevelingsalgoritme is een programma dat uit jouw gedrag voorspelt wat je waarschijnlijk nog meer wilt zien. Het werkt met signalen: kleine feitjes die je achterlaat zonder erover na te denken. Elke keer dat je op iets tikt, een filmpje uitkijkt, doorscrolt, iets liket of deelt, wordt dat als signaal opgeslagen. Uit al die losse signalen ontstaat na verloop van tijd een profiel van jou als kijker. Een profiel is een verzameling voorspellingen over jouw kijkgedrag, uitgedrukt in getallen in plaats van in woorden. Het systeem weet dus niet dat jij van skateboarden houdt, maar wel dat mensen met jouw klikpatroon lang naar skatevideo\'s kijken. Daarna gebruikt het de truc die aanbevelen zo krachtig maakt. Het zoekt gebruikers met een profiel dat op dat van jou lijkt, en toont jou wat zij uitkeken. Zo kan het je iets aanraden waar jij zelf nooit op gezocht zou hebben, en dat voelt bijna magisch. Belangrijk is de vraag welk signaal in die berekening nu eigenlijk het zwaarst meeweegt. Kijktijd en het opnieuw afspelen van een filmpje wegen zwaarder dan een like, omdat je die aandacht moeilijker kunt faken. Ook negatieve signalen tellen mee, want snel wegswipen betekent voor het systeem simpelweg: minder hiervan. Schooltv legt dit uit in de aflevering De dikke data show over de filterbubbel. Mediawijsheid.nl beschrijft hetzelfde mechanisme onder de naam personalisatie, en deze paragraaf is op basis van die twee bronnen in eigen woorden geschreven.'],
      ['Waarom je bubbel vanzelf smaller wordt',
        'Raadt het systeem steeds meer van hetzelfde aan en kijk jij dat ook steeds uit, dan ontstaat er een lus die zichzelf versterkt. Die lus heet een filterbubbel: je ziet vooral bevestiging van wat je al vond en bijna geen tegenspraak meer. Belangrijk om te snappen is dat niemand die bubbel expres om jou heen bouwt. Hij ontstaat uit twee dingen tegelijk: de keuzes van het systeem en jouw eigen klikgedrag. Mensen klikken nu eenmaal liever op iets wat ze herkennen dan op iets onbekends. Kies je zelf ook nog alleen vrienden en accounts die er hetzelfde over denken, dan komt daar een echokamer bij. Een echokamer is een ruimte waarin dezelfde mening steeds wordt teruggekaatst en daardoor luider lijkt dan hij is. Onderzoekers zijn het er trouwens niet over eens hoe dicht zo\'n bubbel echt is. Sommige studies vinden juist dat mensen online méér verschillende bronnen tegenkomen dan in hun eigen omgeving. Wat je zelf kunt doen, is het systeem bewust andere signalen geven dan het gewend is. Volg bewust twee accounts die er anders over denken dan jij en kijk hun video\'s helemaal uit. Zoek af en toe iets op wat volledig buiten je gewone interesses valt, ook al lijkt dat saai. Lees hetzelfde nieuwsbericht bij twee verschillende nieuwssites en vergelijk daarna hun koppen met elkaar. En gebruik af en toe een privévenster of een uitgelogde zoekopdracht, zodat je ziet wat iemand zonder jouw profiel te zien krijgt.'],
      media('https://schooltv.nl/video-item/de-dikke-data-show-filterbubbel', 'Schooltv: De dikke data show over de filterbubbel', 'Waardoor wordt de wereld op je telefoon volgens dit item kleiner dan hij in werkelijkheid is?'),
      [
        {
          vraag: 'Hoe zou een app volgens jou kunnen weten wat jij leuk vindt, zonder het ooit te vragen? Schrijf je idee op.',
          antwoord: 'Uit signalen: je klikken, je kijktijd, opnieuw afspelen, liken, delen en snel wegswipen. Daaruit bouwt het systeem een profiel in getallen.',
          uitleg: 'Het systeem kent geen onderwerpen zoals jij die kent. Het vergelijkt jouw patroon met dat van andere gebruikers en voorspelt daaruit.',
          leerdoel: 'Je kunt uitleggen hoe een algoritme uit jouw kijkgedrag een profiel opbouwt.'
        },
        {
          vraag: 'Wat denk je dat een filterbubbel is, en wie bouwt die volgens jou?',
          antwoord: 'Een filterbubbel is dat je vooral bevestiging ziet van wat je al vond, en bijna geen tegenspraak. Hij ontstaat door het systeem én door je eigen klikgedrag.',
          uitleg: 'Niemand bouwt hem expres om jou heen. Juist daarom is hij lastig te merken: hij voelt gewoon als jouw tijdlijn.',
          leerdoel: 'Je kunt uitleggen wat een filterbubbel is en hoe die ontstaat.'
        },
        {
          vraag: 'Wat zou jij kunnen doen om uit je eigen bubbel te komen? Noem twee ideeën voordat je verder leest.',
          antwoord: 'Bewust accounts volgen die er anders over denken en hun video\'s helemaal uitkijken. Ook helpt hetzelfde nieuws bij twee sites lezen en af en toe uitgelogd zoeken.',
          uitleg: 'Volgen alleen is een zwak signaal. Pas als je iets helemaal uitkijkt, verschuift je profiel merkbaar.',
          leerdoel: 'Je kunt bedenken wat je zelf kunt doen om uit je bubbel te komen.'
        }
      ],
      {
        tekst: "Doe het bubbelexperiment en schrijf een verslag van een A4. Stap 1: noteer van de app die jij het meest gebruikt de eerste vijftien aanbevelingen en zet per stuk het onderwerp erbij. Tel hoeveel verschillende onderwerpen je in totaal telt. Stap 2: open dezelfde app of dezelfde zoekmachine in een privévenster of uitgelogd, noteer opnieuw vijftien aanbevelingen en tel weer het aantal verschillende onderwerpen. Stap 3: zet beide lijsten naast elkaar in een tabel in Word en beschrijf in vijf zinnen wat er verschilt en waardoor dat verschil komt. Stap 4: volg zeven dagen lang twee accounts die er duidelijk anders over denken dan jij, en kijk hun berichten uit in plaats van ze weg te swipen. Noteer na een week of je aanbevelingen veranderd zijn en waaraan je dat precies merkt. Stap 5: sluit af met een conclusie van vijf regels: hoe sterk was jouw bubbel, en wat ga je voortaan anders doen? Gebruik in je verslag in elk geval de woorden profiel, signaal, filterbubbel en echokamer. Bekijk voor extra uitleg de aflevering van Schooltv over de filterbubbel (https://schooltv.nl/video-item/de-dikke-data-show-filterbubbel) en de uitleg over personalisatie op https://www.mediawijsheid.nl/filterbubbel/.",
        label: 'Lever je bubbelexperiment in: de twee lijsten van vijftien aanbevelingen in een tabel, je vergelijking, je weekmeting en je conclusie.',
        modelAnswer: "Stap 1. In mijn eigen account telde ik bij vijftien aanbevelingen maar vier verschillende onderwerpen: voetbal, gaming, humor en muziek. Stap 2. Uitgelogd telde ik bij vijftien aanbevelingen elf verschillende onderwerpen, waaronder nieuws, koken en reizen. Stap 3. Het verschil is groot. In mijn eigen lijst staat vooral wat ik eerder helemaal uitkeek; uitgelogd heeft het systeem geen profiel van mij en toont het wat bij veel mensen goed scoort. Dat verschil komt dus door de signalen die ik zelf heb afgegeven, vooral kijktijd. Stap 4. Ik volgde een week lang twee accounts met een andere mening en keek hun video's helemaal uit. Na vijf dagen kwamen er vergelijkbare video's tussen mijn aanbevelingen, en na een week zag ik ook twee nieuwsitems die ik daarvoor nooit kreeg. Stap 5. Mijn bubbel was vrij sterk: vier onderwerpen tegenover elf. Ik ga voortaan elke week één ding opzoeken dat buiten mijn interesses valt, en ik lees hetzelfde nieuwsbericht bij twee sites. Een echokamer wil ik vermijden door niet alleen accounts te volgen die er hetzelfde over denken als ik.",
        nakijkpunten: [
          'Beide lijsten van vijftien aanbevelingen staan naast elkaar in een tabel, met per lijst het aantal verschillende onderwerpen.',
          'De vergelijking van vijf zinnen legt uit waardoor het verschil komt, met de signalen erbij.',
          'De weekmeting beschrijft of de aanbevelingen veranderd zijn en waaraan dat te merken is.',
          'De woorden profiel, signaal, filterbubbel en echokamer worden alle vier gebruikt.'
        ]
      },
      ['Waaruit bouwt een aanbevelingsalgoritme jouw profiel op?', 'Welk signaal weegt het zwaarst?', 'Hoe ontstaat een filterbubbel?', 'Wat is een echokamer?', 'Wat kun je doen om uit je bubbel te komen?'],
      'Stuur een simulatie van jouw feed: geef signalen af, zie het profiel groeien en probeer de bubbel weer open te breken.',
      {
        optioneel: true,
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Bedenk samen vijf signalen die jullie vanochtend hebben afgegeven. Zet ze op volgorde van zwaar naar licht.',
            antwoord: 'Van zwaar naar licht ongeveer: een filmpje opnieuw afspelen, helemaal uitkijken, iets opzoeken, delen, liken, en als negatief signaal snel wegswipen.',
            uitleg: 'Hoe meer aandacht een handeling kost, hoe zwaarder het signaal weegt. Aandacht is namelijk moeilijker te faken dan een tik.',
            leerdoel: 'Je kunt uitleggen hoe een algoritme uit jouw kijkgedrag een profiel opbouwt.'
          },
          {
            groep: 'zelf',
            vraag: 'Twee leerlingen zoeken allebei op klimaat en krijgen totaal andere video\'s. Is dat een filterbubbel of een echokamer? Leg uit.',
            antwoord: 'Een filterbubbel, want het systeem heeft voor elk van hen een ander aanbod samengesteld op basis van eerder gedrag.',
            uitleg: 'Bij een echokamer maak jij de selectie zelf, door alleen mensen te volgen die er hetzelfde over denken. Het verschil zit dus in wie er kiest.',
            leerdoel: 'Je kunt uitleggen wat een filterbubbel is en hoe die ontstaat.'
          },
          {
            groep: 'zelf',
            vraag: 'Je volgt drie accounts met een andere mening, maar je swipet hun video\'s altijd binnen twee seconden weg. Verandert je aanbod? Leg uit.',
            antwoord: 'Nauwelijks. Volgen is een zwak signaal, en snel wegswipen is een sterk negatief signaal. Het systeem leert daaruit juist dat je dit niet wilt zien.',
            uitleg: 'Je moet dus niet alleen volgen maar ook echt kijken. Anders geef je precies het signaal dat je bubbel weer smaller maakt.',
            leerdoel: 'Je kunt bedenken wat je zelf kunt doen om uit je bubbel te komen.'
          },
          {
            groep: 'steun',
            vraag: 'Vul in: het systeem bouwt uit jouw ... een ... op, en dat vergelijkt het met andere gebruikers. Kies uit: signalen, profiel.',
            antwoord: 'Uit jouw signalen bouwt het een profiel op.',
            uitleg: 'Een signaal is één handeling, bijvoorbeeld een klik. Een profiel is de optelsom van al die handelingen, uitgedrukt in getallen.',
            leerdoel: 'Je kunt uitleggen hoe een algoritme uit jouw kijkgedrag een profiel opbouwt.'
          },
          {
            groep: 'plus',
            vraag: 'Onderzoekers zijn het er niet over eens hoe sterk filterbubbels zijn. Waarom is het toch verstandig om je eigen bubbel te testen?',
            antwoord: 'Omdat je met een eigen test meet wat er bij jou gebeurt, in plaats van te vertrouwen op een algemene uitspraak. Uitgelogd zoeken laat direct zien welk deel van je aanbod van jouw profiel komt.',
            uitleg: 'Zo verzamel je zelf bewijs in plaats van een mening over te nemen. Dat is precies wat het bubbelexperiment in de praktijkopdracht doet.',
            leerdoel: 'Je kunt bedenken wat je zelf kunt doen om uit je bubbel te komen.'
          }
        ]
      })
  ]
};
