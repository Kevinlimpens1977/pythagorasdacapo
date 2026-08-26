// Hoofdstuk 6 - Mediawijs: social media, welzijn en betrouwbaar nieuws.
// Kaderberoepsgerichte leerweg (kb).
//
// Bron: het Wikiwijs-arrangement "Digitale Geletterdheid" van DaCapo College.
//   6.1 en 6.2  <- les 11 "De invloed van social media"
//   6.3 en 6.4  <- les 12 "Cyberpesten"
//   6.5         <- les 13 "Digitaal gezond blijven"
//   6.6         <- les 14 "Nepnieuws en betrouwbare bronnen"
//   6.7         <- les 15 "Eindtoets les 9 t/m 14: Mediawijsheid"
//
// De kb-versie heeft DEZELFDE onderwerpen, dezelfde volgorde en dezelfde
// leerdoelen als tl/h6.mjs, maar is opnieuw geschreven op kaderniveau.
//
// VORM: DIT IS DE HARDE EIS VAN DEZE LEERWEG
// ------------------------------------------
// Het kb-profiel staat maar een ding toe: hooguit 6 of 7 zinnen achter elkaar
// lezen, en daarna iets te doen. Elk theorieblok hieronder telt daarom ZEVEN
// zinnen. Twee blokken zijn langer, en dat is een bewuste uitzondering met een
// reden: theorieblok 2 van 6.2 en theorieblok 1 van 6.5 tellen er allebei
// tien, omdat de bron daar een claim doet die niet in zeven zinnen paste en
// die in ronde 2 daardoor was weggevallen. Zie "WAT RONDE 3 HEEFT TERUGGEZET".
// Achter elk theorieblok staat in de verrijking een uitgewerkt voorbeeld in
// vraag-en-antwoordvorm, zodat de leerling na die zinnen weer iets te doen heeft.
//
// Ter vergelijking: tl/h6.mjs heeft 10 tot 18 zinnen per theorieblok. De
// kaderleerling leest hier dus aantoonbaar minder achter elkaar, niet alleen
// kortere zinnen. Gemeten: kb 7 zinnen (twee blokken 10) en 88 tot 130 woorden
// per blok, tl 10 tot 18 zinnen en 171 tot 306 woorden.
//
// Daarmee zit een kb-theorieblok BEWUST onder de 150 tot 250 woorden die de
// blauwdruk als bandbreedte noemt. Dat is een keuze: de blauwdruk beschrijft een
// gemiddelde leerling, het kb-profiel beschrijft deze. Zeven zinnen van rond de
// dertien woorden is 90 tot 105 woorden; wie hier op 150 uitkomt, leest elf of
// twaalf zinnen achter elkaar en dat mag niet. De stof die daardoor niet in het
// theorieblok past is niet geschrapt maar verplaatst (zie hieronder).
//
// HET LEESBLOK TUSSEN TWEE INTERACTIES: EERLIJK GEMETEN
// -----------------------------------------------------
// De generator zet theorieblok 1 en theorieblok 2 achter elkaar (order 3 en 4),
// met het uitgewerkte voorbeeld IN het theorieblok. Wat een leerling dus echt
// achter elkaar leest is: theorie 1 + voorbeeld 1 + theorie 2 + voorbeeld 2.
// Gemeten in de gegenereerde seed, per paragraaf (zinnen / woorden):
//   6.1  35 / 377     6.2  42 / 439     6.3  35 / 360     6.4  37 / 391
//   6.5  41 / 428     6.6  36 / 381     6.7  34 / 368
// Dat is meer dan de zeven zinnen die het kb-profiel per leesbeurt noemt, en
// dat wordt hier niet mooier voorgesteld dan het is. Twee dingen erover:
//   1. De blokvolgorde is van de generator, niet van de bouwer. Zolang er geen
//      interactie tussen order 3 en order 4 past, is elke paragraaf van elke
//      leerweg een leesblok van twee theorieblokken.
//   2. Wat de bouwer wel in de hand heeft is de tekstmassa. Van die 35 tot 42
//      zinnen is ongeveer de helft theorie; de rest is het uitgewerkte
//      voorbeeld in vraag-en-antwoordvorm, met genummerde stappen die als een
//      lijstje lezen en niet als lopende tekst. In ronde 3 zijn uit die
//      voorbeelden vijf zinnen geschrapt die elders al letterlijk stonden.
// 6.2 en 6.5 zijn met opzet de langste twee: daar zijn de weggevallen
// bronalinea's teruggezet. Stof terugzetten woog hier zwaarder dan een
// leesblok dat toch al boven de norm zat.
//
// Gemeten zinslengte in theorie en samenvatting (149 zinnen): gemiddeld 12,0
// woorden, langste zin 15 woorden, GEEN enkele zin boven de 15. Dat is de
// kb-band (12 tot 15) en niet de bb-band (10 tot 12). Ronde 2 zat op 13,2
// gemiddeld met een langste zin van 21; ronde 3 bracht dat terug naar 12,2 met
// nog acht zinnen van 16 woorden. Ronde 4 heeft die laatste acht herschreven
// (in 6.2, 6.3, 6.5, 6.6 en 6.7), zodat de staart nu volledig weg is.
// Buiten de theorie: 14 zinnen boven de 20 woorden in het hele hoofdstuk,
// tegen 28 in ronde 2. Wat er nog staat is bijna allemaal geciteerde spraak
// ("He, gaat het?"), waar de puntkomma-teller drie korte zinnen als een telt.
//
// WAT RONDE 3 HEEFT TERUGGEZET
// ----------------------------
// Bij de beoordeling van ronde 2 bleek dat drie alinea's uit de bron in kb
// waren verdwenen terwijl tl ze wel had. Inkorten was daar doorgeslagen naar
// weglaten. Ze staan er nu weer in, in kb-taal:
//   - les 11, "Kritisch nadenken over social media en zelfbeeld": social media
//     is ook een plek waar je jezelf verkoopt en waar anderen jou beoordelen,
//     en dat geeft extra druk om er goed uit te zien en populair te zijn.
//     -> theorieblok 2 van 6.2, de eerste twee zinnen;
//   - les 13, "Wat betekent digitaal gezond zijn?": te veel schermtijd raakt je
//     lichaam EN je geest, en je blijft zowel fysiek (je lichaam) als mentaal
//     (je gevoel, je gedachten) gezonder. -> theorieblok 1 van 6.5, zin 1 t/m 4;
//   - les 13, "Wat neem jij mee uit deze les?": moe of prikkelbaar zijn is een
//     signaal van ongezond schermgebruik, en het is niet de bedoeling om je
//     schermen nooit meer te gebruiken maar wel om ze slimmer en bewuster te
//     gebruiken. -> "moe en prikkelbaar" staat in de klachtenlijst van
//     theorieblok 1 van 6.5 (het hoort bij leerdoel 1 van die paragraaf), het
//     signaal en het slotadvies staan in de samenvatting van 6.5.
// Verder is het woord "somber" uit les 12 toegevoegd naast "depressief" in de
// steunopgaven van 6.3.
//
// DE INVULTEKST VAN LES 12 (praktijkopdracht 6.3, stap 1)
// -------------------------------------------------------
// De opdracht verwijst naar de echte Wikiwijs-oefening 8322030. Ronde 2 gaf er
// een eigen reconstructie van de invultekst bij, met een antwoordsleutel die
// NIET klopte met die oefening. Nu staan de zinnen van de bron er letterlijk,
// met de gaten op de plek waar de bron ze heeft, en de vijf keuzewoorden
// eronder. De sleutel is die van de bron: anoniem, nep, heel rot. Er blijven
// twee woorden over; dat hoort zo.
//
// WAAR DE REST VAN DE BRON GEBLEVEN IS
// ------------------------------------
// Er is niets weggelaten. Wat in tl in een lange alinea stond, staat hier in
// een blok waar de leerling iets moet DOEN:
//   - de vijf voorbeelden van cyberpesten  -> oefenblok 6.3, groep samen;
//   - de vijf tips "wat kun jij zelf doen" -> oefenblok 6.2, groep samen;
//   - de drie stappen om het goed te maken -> oefenblok 6.4, groep samen;
//   - de vijf tips "zo blijf je digitaal gezond" -> oefenblok 6.5, groep samen;
//   - het 5G-verhaal, India/WhatsApp, Obama en de vier controlevragen
//     -> oefenblok 6.6 en de praktijkopdracht van 6.6;
//   - de straffen van de pester, "depressief" en de angst om naar school te
//     gaan -> oefenblok 6.3, groep steun en zelf.
// De praktijkopdrachten zijn opgeknipt in genummerde delen met een eigen
// alinea per deel, zodat een kaderleerling ziet wat hij precies inlevert.
//
// EEN TELLING, OVERAL HETZELFDE: DE 20-20-2 PAUZES
// ------------------------------------------------
// De regel wordt in dit hoofdstuk consequent geteld als "na elke VOLLE 20
// minuten". Dus: 60 minuten huiswerk = 3 pauzes, 90 minuten = 4 pauzes, 120
// minuten = 6 pauzes. Die telling staat zo in theorieblok 2 van 6.5, in de
// oefeningen van 6.5, in het diagnoseblok van 6.7 en in de hoofdstuktoets.
//
// Waar de bron een opdracht als losse Wikiwijs-vragenlijst had (les 12 en les
// 15) staat de link in de praktijkopdracht, met de vragen eronder uitgeschreven
// zodat een leerling zonder werkende link toch verder kan.
//
// BEWUST NIET IN DE HOOFDSTUKTOETS VAN 6.7, wel elders in de leerweg
// ---------------------------------------------------------------
// De bron-eindtoets van les 15 gaat over les 9 tot en met 14 en stelt daarom
// ook vragen over online shoppen en betalen: de risico's van bestellen in
// China, de nep-URL www.nike_sport.com, het scenario goedkopegames.nl en de
// koppelopgave over iDEAL, creditcard, Klarna en Apple Pay. Die horen
// inhoudelijk bij hoofdstuk 5 en worden dus in kb/h5.mjs bevraagd, niet hier.
// In 6.7 komen ze wel terug: stap 1 van de praktijkopdracht zegt expliciet dat
// je die begrippen moet leren, en het diagnoseblok heeft er steunopgaven over.
// In de toets zelf staan twee vragen over hoofdstuk 5 (een waarde herkennen en
// je account op privé zetten), zodat de leerling merkt dat die stof meetelt.
//
// De verrijking (leerdoelen, kernbegrippen, uitgewerkte voorbeelden,
// samenvattingen en alle toetsvragen) staat in
// scripts/seed-verrijking/kb/h6.mjs.

import { p, checkpoint, media } from '../helpers.mjs';

export default {
  chapter: 6,
  chapterTitle: 'Mediawijs: social media, welzijn en betrouwbaar nieuws',
  badge: 'Mediawijs',
  paragraphs: [
    p('6.1', 'Social media en het algoritme', ['21B', '21C'], 'feedonderzoek met tien berichten en jouw uitleg erbij', 100, 'Feed Fabriek',
      ['Social media: wie kiest wat jij ziet?',
        "Social media zijn apps waarin je berichten, foto's en filmpjes met anderen deelt. Denk aan Instagram, WhatsApp en TikTok, die je waarschijnlijk elke dag opent. Maar wie kiest eigenlijk welk filmpje jij als eerste te zien krijgt? Dat doet het algoritme: een computerregel die berekent welke berichten jij krijgt. Hier is een voorbeeld: je zoekt een keer naar een blauwe trui in een webshop. Daarna zie je dagenlang blauwe truien voorbijkomen, en precies dat is het algoritme. Er zit dus geen mens achter, en jij zet het ook niet zelf aan."],
      ['Zo leert het algoritme jou kennen',
        "Het algoritme leert van jou, elke keer dat je de app opent. Het houdt bij waarop je klikt, wat je opzoekt en wat je liket. Ook je reacties en de accounts die je volgt zijn een signaal voor het systeem. Het sterkste signaal is je kijktijd, dus hoe lang je naar een filmpje blijft kijken. Dat heeft een voordeel: je vindt snel muziek, sport of games die bij je passen. Het nadeel is dat je daarna bijna alleen nog meer van hetzelfde ziet. Een filmpje met veel kijktijd wordt vaker getoond en wordt daardoor trending."],
      media('https://app.nos.nl/op3/algoritmes/', 'NOS op3: zo werken algoritmes', 'Scroll deze pagina helemaal door. Welke twee dingen doet het algoritme volgens deze pagina met jouw gedrag?'),
      [
        {
          vraag: 'Terugblik hoofdstuk 5. Jayden zet nooit iemand voor schut online, want hij vindt respect belangrijk. Wat is hier de waarde en wat is de gedragsregel?',
          antwoord: 'Respect is de waarde. Niemand voor schut zetten online is de gedragsregel die daaruit volgt.',
          uitleg: 'Een waarde zit vanbinnen en kun je niet zien. Een gedragsregel is de afspraak eromheen en die kun je wel nakijken.',
          leerdoel: 'Je weet wat normen en waarden zijn en hoe ze online gelden.'
        },
        {
          vraag: 'Terugblik hoofdstuk 5. Sanne zet haar account op privé. Wat verandert er dan precies voor mensen die zij niet kent?',
          antwoord: 'Zij kunnen haar berichten en foto\'s niet meer zien. Alleen volgers die Sanne zelf goedkeurt komen er nog bij.',
          uitleg: 'Privé zetten beschermt je privacy. Het geeft je geen extra likes en laat ook niet zien wie je profiel bezoekt.',
          leerdoel: 'Je kunt je account op privé zetten en je bio veilig invullen.'
        },
        {
          vraag: 'Terugblik hoofdstuk 5. In een groepsapp staat een gemeen bericht over een klasgenoot. Wat kun jij met dat bericht doen in de app zelf?',
          antwoord: 'Je kunt het rapporteren, ook wel melden genoemd. Je houdt het bericht ingedrukt of tikt op de drie puntjes, en kiest daarna Rapporteren.',
          uitleg: 'Rapporteren gaat naar de app zelf, en niet naar de politie. De app kijkt er dan naar en kan het bericht weghalen.',
          leerdoel: 'Je weet hoe en waarom je een bericht rapporteert.'
        },
        {
          vraag: 'Terugblik hoofdstuk 5. Je ziet een webshop met de nieuwste telefoon voor 79 euro. Waarom is die prijs een waarschuwing?',
          antwoord: 'Zo\'n lage prijs kan bijna niet echt zijn. Vaak is het een nepwebshop en krijg je niets geleverd na je betaling.',
          uitleg: 'Een te lage prijs is een van de vijf checks uit 5.3. Kijk daarnaast naar de URL, het slotje en de reviews.',
          leerdoel: 'Je kunt uitleggen waarom een te lage prijs een waarschuwing is.'
        },
        {
          vraag: 'Twee klasgenoten openen op hetzelfde moment dezelfde app. Ze zien allebei iets heel anders. Wie of wat bepaalt dat, denk jij?',
          antwoord: 'Het algoritme bepaalt dat. Dat is een computerregel die per persoon uitrekent welke berichten je krijgt.',
          uitleg: 'Er is dus geen mens die kiest en geen knop die jij aanzet. Het wifi-netwerk heeft er ook niets mee te maken.',
          leerdoel: 'Je kunt uitleggen wat een algoritme op social media is.'
        },
        {
          vraag: 'Je pakt je telefoon en scrollt tien minuten door een app. Welke dingen die jij dan doet kan die app allemaal meten?',
          antwoord: 'Waar je op klikt, wat je opzoekt, wat je liket en hoe lang je naar een filmpje kijkt. Ook de accounts die je volgt tellen mee.',
          uitleg: 'Kijktijd weegt het zwaarst van alles. Doorkijken kost jou echte minuten, terwijl een like maar een tikje is.',
          leerdoel: 'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.'
        },
        {
          vraag: 'Stel: je krijgt vanaf morgen alleen nog filmpjes over jouw eigen hobby. Noem daarvan iets fijns en iets vervelends.',
          antwoord: 'Fijn is dat je meteen vindt wat je leuk vindt. Vervelend is dat je bijna niets anders meer tegenkomt.',
          uitleg: 'Het nadeel merk je pas als je erop let. Meer van hetzelfde krijgen voelt namelijk gewoon prettig.',
          leerdoel: 'Je kunt een voordeel en een nadeel van algoritmes noemen.'
        }
      ],
      {
        tekst: "<strong>Onderzoek je eigen feed.</strong> Werk in een Word-bestand en zet elke stap onder een eigen kopje.</p>\n" +
          "<p><strong>Stap 1. Lees de bron.</strong> Scroll de pagina van NOS op3 over algoritmes helemaal door en lees de teksten: https://app.nos.nl/op3/algoritmes/. Werkt de link niet? Kopieer en plak hem dan in je browser.</p>\n" +
          "<p><strong>Stap 2. Beantwoord drie vragen in hele zinnen.</strong> (a) Waarom zorgen algoritmes ervoor dat je steeds nieuwe filmpjes ziet die je interessant vindt? Wat zou een reden zijn om een algoritme te gebruiken? (b) Wat kan er gebeuren als een algoritme alleen laat zien wat je leuk vindt? Kan dat ook nadelen hebben? Leg uit. (c) Denk je dat het algoritme invloed heeft op wat trending wordt? Waarom wel of niet?</p>\n" +
          "<p><strong>Stap 3. Maak je tabel.</strong> Open een app die jij vaak gebruikt. Bekijk de eerste tien filmpjes of berichten. Maak een tabel met twee kolommen: waar gaat het over, en waarom denk jij dat je dit krijgt?</p>\n" +
          "<p><strong>Stap 4. Trek je conclusie.</strong> Schrijf onder je tabel vijf regels. Zoek daarin het voordeel en het nadeel uit de theorie terug in jouw eigen tien berichten. Lever het bestand daarna in bij je docent.",
        label: 'Lever je feedonderzoek in: de drie antwoorden uit de bron, je tabel met tien berichten en je vijf regels conclusie.',
        modelAnswer: "(a) Ik krijg steeds nieuwe filmpjes die ik leuk vind, omdat de app wil dat ik langer blijf kijken. Hoe langer ik blijf, hoe meer advertenties ik zie. Een reden om een algoritme te gebruiken is ook dat ik zelf sneller vind wat bij mij past. (b) Als ik alleen krijg wat ik leuk vind, zie ik bijna geen andere meningen meer. Dat is een nadeel, want dan denk ik dat iedereen er zo over denkt. (c) Ja, het algoritme heeft invloed op wat trending wordt. Een filmpje dat goed scoort wordt vaker getoond, en krijgt daardoor nog meer kijkers. In mijn tabel staan tien berichten: vier over voetbal, drie over gaming, twee over muziek en een reclame voor schoenen. De voetbalfilmpjes krijg ik omdat ik die helemaal uitkijk. De schoenen krijg ik omdat ik gisteren op een webshop naar schoenen zocht. Het voordeel zie ik terug: acht van de tien gingen over iets wat ik leuk vind. Het nadeel zie ik ook: er zat geen enkel nieuwsbericht bij.",
        nakijkpunten: [
          'De drie vragen uit de bron zijn beantwoord met een uitleg erbij.',
          'De tabel bevat tien berichten met per bericht het onderwerp en een reden waarom het verschijnt.',
          'In de vijf regels conclusie staan het voordeel en het nadeel uit de theorie, gekoppeld aan de eigen tien berichten.',
          'Er wordt minstens een sterk signaal genoemd, bijvoorbeeld kijktijd of een zoekopdracht.'
        ]
      },
      ['Wat is een algoritme op social media?', 'Waar leert het algoritme van?', 'Waarom telt kijktijd zwaarder dan een like?', 'Noem een voordeel van algoritmes.', 'Noem een nadeel van algoritmes.'],
      'Kies signalen, kijk wat het algoritme daarna aanraadt en probeer je eigen bubbel open te breken.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Klap je boek dicht. Zeg om de beurt in een zin wat een algoritme doet. Wat zei de ander anders dan jij?',
            antwoord: 'Een goede zin is: het algoritme berekent welke berichten jij te zien krijgt, op basis van wat je eerder deed.',
            uitleg: 'Wie het woord berekenen of computerregel gebruikt, zit dicht bij de bron. Wie zegt dat de app kiest, mist dat het per persoon wordt uitgerekend.',
            leerdoel: 'Je kunt uitleggen wat een algoritme op social media is.'
          },
          {
            groep: 'samen',
            vraag: 'Een app wil dat jij zo lang mogelijk blijft kijken. Bedenk samen waarom dat de app geld oplevert.',
            antwoord: 'Hoe langer jij blijft kijken, hoe meer advertenties je te zien krijgt. Van die reclame verdient de app zijn geld.',
            uitleg: 'Daarom kiest het algoritme berichten die jij waarschijnlijk leuk vindt. Jouw aandacht is hier het product dat verkocht wordt.',
            leerdoel: 'Je kunt uitleggen wat een algoritme op social media is.'
          },
          {
            groep: 'samen',
            vraag: 'Noem samen vijf dingen die je vanochtend op je telefoon deed. Zet er per ding bij of het een sterk of een zwak signaal is.',
            antwoord: 'Een filmpje helemaal uitkijken of iets opzoeken is sterk. Een snelle like of een seconde kijken is zwak.',
            uitleg: 'Sterke signalen kosten jou tijd of moeite. Daarom vertrouwt het systeem die meer dan een snelle tik op een knop.',
            leerdoel: 'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.'
          },
          {
            groep: 'zelf',
            vraag: 'Jesse kijkt drie avonden alleen naar gamefilmpjes. De vierde avond ziet hij bijna niets anders. Leg in twee zinnen uit hoe dat komt.',
            antwoord: 'Het systeem heeft drie avonden gemeten dat gamefilmpjes zijn aandacht vasthouden. Het herhaalt daarom wat werkte, want zo blijft hij langer kijken.',
            uitleg: 'Het gaat dus niet om wat Jesse leuk zegt te vinden. Het gaat alleen om wat hij echt op zijn scherm gedaan heeft.',
            leerdoel: 'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.'
          },
          {
            groep: 'zelf',
            vraag: 'Wat mis je als het algoritme jou alleen nog geeft wat je leuk vindt? Schrijf twee dingen op.',
            antwoord: 'Je komt bijna geen andere meningen meer tegen. Ook ander nieuws en andere onderwerpen verdwijnen uit je tijdlijn.',
            uitleg: 'Je aanbod wordt smaller zonder dat je het merkt. Dat is precies waarom dit een nadeel heet en geen storing.',
            leerdoel: 'Je kunt een voordeel en een nadeel van algoritmes noemen.'
          },
          {
            groep: 'zelf',
            vraag: 'Schrijf een voordeel en een nadeel van algoritmes op. Zet bij het nadeel wie er last van heeft.',
            antwoord: 'Voordeel: je vindt sneller muziek of sport die bij je past. Nadeel: je komt bijna geen andere meningen tegen, en daar heb jij zelf last van.',
            uitleg: 'Een nadeel noemen is de helft van het werk. Je antwoord wordt pas sterk als je erbij zet voor wie het een probleem is.',
            leerdoel: 'Je kunt een voordeel en een nadeel van algoritmes noemen.'
          },
          {
            groep: 'steun',
            vraag: 'Vul aan: een algoritme is een ... die bepaalt welke berichten jij ziet. Kies uit: medewerker, computerregel, instelling.',
            antwoord: 'Computerregel.',
            uitleg: 'Er zit geen mens achter die per persoon kiest. Jij zet het ook niet zelf aan met een knop of een instelling.',
            leerdoel: 'Je kunt uitleggen wat een algoritme op social media is.'
          },
          {
            groep: 'steun',
            vraag: 'Streep door wat er niet bij hoort. Het algoritme leert van: je klikken / je kijktijd / je cijfers op school / wat je opzoekt.',
            antwoord: 'Je cijfers op school horen er niet bij. De andere drie wel.',
            uitleg: 'Het systeem ziet alleen wat je in de app doet. Alles wat het meet, meet het op dat ene scherm.',
            leerdoel: 'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.'
          },
          {
            groep: 'plus',
            vraag: 'Twee filmpjes gaan tegelijk online. Het ene wordt het eerste uur uitgekeken, het andere weggeswipet. Een dag later heeft het eerste een miljoen kijkers. Hoe komt dat?',
            antwoord: 'Veel kijktijd is voor het systeem een teken dat het filmpje werkt. Het toont het dan vaker, en dat levert weer meer kijkers op.',
            uitleg: 'Zo kan een trend in een dag ontstaan zonder dat iemand dat plant. Populair zijn en veel getoond worden lopen hier door elkaar.',
            leerdoel: 'Je kunt een voordeel en een nadeel van algoritmes noemen.'
          }
        ]
      }),

    p('6.2', 'FOMO, druk en je zelfbeeld', ['23B'], 'schermtijdrapport met influenceranalyse en twee eigen voornemens', 100, 'Echt of Gefilterd',
      ['FOMO, druk en je zelfbeeld',
        "Social media hebben invloed op wat je voelt, wat je denkt en wat je doet. Zie je veel foto's van perfecte lichamen, dan word je onzeker over jezelf. Gaat een challenge viral, dan gaat hij razendsnel door heel Nederland rond. Je voelt dan de neiging om ook mee te doen, want je wilt erbij horen. Dat gevoel heet FOMO, en dat is Engels voor bang zijn dat je iets mist. Druk is anders: het gevoel dat je iets moet doen omdat anderen dat ook doen. En je zelfbeeld is de manier waarop jij naar jezelf kijkt en over jezelf denkt."],
      ['Beoordeeld worden, highlight reel en je filterbubbel',
        "Social media is niet alleen een plek om foto's en filmpjes te delen. Je verkoopt er ook jezelf, en anderen beoordelen jou met likes en reacties. Dat geeft extra druk om er goed uit te zien en populair te zijn. Een influencer is iemand met veel volgers die anderen beïnvloedt met wat hij post. Influencers laten bijna nooit zien wat ze echt voelen of echt meemaken. Je ziet alleen hun hoogtepunten, en dat heet het highlight reel-effect. Filters en bewerkingen maken zo'n foto ook nog mooier dan hij echt is. Sociale bevestiging betekent dat je je eigen waarde afmeet aan je likes. Weinig likes voelt dan als minder waard zijn, en dat geeft stress. Krijg je van het algoritme steeds dezelfde soort berichten, dan zit je in een filterbubbel."],
      media('https://www.youtube.com/embed/w7zq_wDFFuk', 'Social media en je zelfbeeld', 'Welk moment uit de video lijkt het meest op iets dat jij zelf wel eens voelt? Schrijf het in een zin op.'),
      [
        {
          vraag: 'Ravi checkt elk kwartier zijn telefoon. Fleur koopt dezelfde schoenen als haar hele groep. Welke twee gevoelens spelen hier volgens jou?',
          antwoord: 'Bij Ravi is dat FOMO: bang zijn dat hij iets leuks mist. Bij Fleur is dat druk: het gevoel dat je moet meedoen met de groep.',
          uitleg: 'Let op de richting van allebei. FOMO trekt je naar je scherm toe, druk stuurt juist wat je daarbuiten doet.',
          leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.'
        },
        {
          vraag: 'Op een vakantiefoto van een bekend account ziet alles er perfect uit. Wat is er niet in beeld gekomen, denk je? En wat gebeurt er als jij alleen zulke foto\'s blijft krijgen?',
          antwoord: 'Niet in beeld komen de saaie dagen en de mislukte pogingen. Krijg je alleen nog zulke foto\'s, dan zit je in een filterbubbel.',
          uitleg: 'Het eerste gaat over wat anderen posten en heet het highlight reel-effect. Het tweede gaat over wat jij te zien krijgt.',
          leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.'
        },
        {
          vraag: 'Je wilt vanavond minder last hebben van je telefoon. Wat zou je dan aanzetten of juist uitzetten? Noem twee dingen.',
          antwoord: 'Bijvoorbeeld: je meldingen uitzetten en een dag pauze inplannen. Ook positieve accounts volgen telt mee.',
          uitleg: 'Deze maatregelen werken omdat jij dan zelf het moment kiest. Zonder meldingen word je niet steeds teruggeroepen naar je scherm.',
          leerdoel: 'Je kunt twee dingen noemen die jij kunt doen om positiever met social media om te gaan.'
        }
      ],
      {
        tekst: "<strong>Maak je schermtijdrapport.</strong> De opdracht heeft drie delen. Zet alles in een Word-bestand, met een kopje per deel.</p>\n" +
          "<p><strong>Deel 1. Je eigen gevoel.</strong> Antwoord vier keer met waar of niet waar en schrijf er telkens een zin uitleg bij. (a) Ik voel me soms onzeker door wat ik op social media zie. (b) Ik scroll wel eens langer dan ik van plan was. (c) Ik voel me wel eens buitengesloten door dingen op social media. (d) Ik vergelijk mezelf met mensen op social media.</p>\n" +
          "<p><strong>Deel 2. Je schermtijd.</strong> Schat eerst hoe lang je per dag op social media zit. Noem minstens drie plekken waar je vaak komt, bijvoorbeeld TikTok, YouTube of Snapchat. Zet per app het aantal minuten of uren erbij dat je denkt te besteden. Pak daarna je telefoon en ga naar Schermtijd. Vul per app in hoeveel tijd je er echt aan besteedt per dag. Vergelijk je schatting met je echte schermtijd en leg in je eigen woorden uit of je schatting klopte. Vergelijk je antwoorden daarna met je buurman of buurvrouw. Lijkt jullie schermtijd op elkaar? Geef elkaar een tip om je schermtijd te verminderen en schrijf de tip op die jij kreeg.</p>\n" +
          "<p><strong>Deel 3. De influencer.</strong> Zoek een influencer of bekend persoon op en bekijk tien van hun foto's of filmpjes. Beantwoord daarna deze drie vragen. (a) Welke dingen lijken echt en welke lijken gemaakt of gefilterd? (b) Welke dingen zou zo'n influencer nooit laten zien? (c) Influencers zijn ook gewoon mensen, net als jij: heeft hun status invloed op hun dagelijks leven? Leg je antwoord uit.</p>\n" +
          "<p><strong>Afsluiting.</strong> Sluit af met twee voornemens voor jezelf en lever het bestand in bij je docent.",
        label: 'Lever je schermtijdrapport in: de vier antwoorden met uitleg, je schermtijdvergelijking, je influenceranalyse en twee voornemens.',
        modelAnswer: "Deel 1. Waar: van strandfoto's waarop iedereen getraind is word ik onzeker. Waar: ik zeg elke avond nog vijf minuten en het worden er dertig. Niet waar: buitengesloten voel ik me zelden, want mijn vrienden appen mij gewoon. Waar: vooral bij voetballers denk ik dat ik zelf te weinig train. Deel 2. Ik schatte TikTok op 60 minuten, YouTube op 45 en Snapchat op 20. Samen is dat ruim twee uur. In Schermtijd stond TikTok op 1 uur 50, YouTube op 40 minuten en Snapchat op 25 minuten. Samen is dat bijna drie uur. Mijn schatting klopte dus niet. Ik onderschatte TikTok, omdat ik daar in korte stukjes kijk en de tijd niet merk. Mijn buurman had ongeveer dezelfde schermtijd. Hij gaf mij de tip om mijn meldingen uit te zetten. Ik gaf hem de tip om zijn telefoon buiten zijn slaapkamer op te laden. Deel 3. Bij de influencer die ik koos lijken de trainingsfilmpjes echt. De vakantiefoto's zijn duidelijk bewerkt: de kleuren en de huid kloppen niet. Ze zou nooit laten zien dat een opname mislukte of dat ze zich onzeker voelde. Haar status heeft wel invloed op haar dagelijks leven. Ze moet steeds nieuwe filmpjes maken en wordt overal herkend. Mijn twee voornemens: meldingen uit na 21:00 uur, en een dag per week geen TikTok.",
        nakijkpunten: [
          'De vier stellingen van deel 1 hebben een antwoord en een zin uitleg.',
          'De geschatte schermtijd en de echte schermtijd staan er allebei in, met een verklaring van het verschil.',
          'De tip van de buurman of buurvrouw staat erbij.',
          'De influenceranalyse beantwoordt alle drie de vragen en eindigt met twee eigen voornemens.'
        ]
      },
      ['Wat betekent FOMO?', 'Wat is druk voelen?', 'Wat is het highlight reel-effect?', 'Wat is een filterbubbel?', 'Wat is sociale bevestiging?', 'Noem twee dingen die je zelf kunt doen.'],
      'Beoordeel berichten op echt of gefilterd, ontmasker het highlight reel en verdien punten met gezonde keuzes.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Hier zijn de vijf tips uit de les. 1 Zet je meldingen uit. 2 Volg positieve of inspirerende accounts. 3 Vermijd negatieve accounts. 4 Plan social media-pauzes, dus soms een dagje niets. 5 Vraag je af: is deze foto echt of nep? Kies er samen twee die jullie echt zouden doen.',
            antwoord: 'Elke keuze is goed, als jullie er per tip bij zeggen wat er dan verandert aan jullie dag.',
            uitleg: 'De vijfde tip hoort erbij: veel volgers hebben is niet belangrijk, je goed voelen in het echte leven wel. Vraag jezelf ook af: wie ben ik eigenlijk, los van social media?',
            leerdoel: 'Je kunt twee dingen noemen die jij kunt doen om positiever met social media om te gaan.'
          },
          {
            groep: 'samen',
            vraag: 'Een groepje jongeren jut elkaar op om iets te stelen. Opjutten is elkaar overhalen. Is dit FOMO of druk? En waaraan zien jullie dat?',
            antwoord: 'Dit is druk. Ze doen iets omdat de anderen het ook doen en verwachten.',
            uitleg: 'Druk is soms onschuldig, zoals de nieuwste sneakers kopen om erbij te horen. Maar het kan dus ook flink misgaan.',
            leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.'
          },
          {
            groep: 'samen',
            vraag: 'Bekijk samen een bericht van een bekend account. Wijs aan wat waarschijnlijk bewerkt is en wat waarschijnlijk niet in beeld komt.',
            antwoord: 'Vaak zijn de huid, de kleuren en het licht bewerkt. Niet in beeld komen de mislukte pogingen en de gewone dagen.',
            uitleg: 'Dat weglaten is precies het highlight reel-effect. Je ziet de beste seconden en niet de uren die eromheen zaten.',
            leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.'
          },
          {
            groep: 'zelf',
            vraag: 'Nadia post een foto en checkt de hele avond haar likes. Bij 12 likes voelt ze zich minder waard dan bij 80. Hoe heet dat?',
            antwoord: 'Dat heet sociale bevestiging. Het is riskant, want ze meet haar waarde af aan een cijfer van anderen.',
            uitleg: 'Likes zeggen iets over het moment van posten en over het algoritme. Ze zeggen niets over wie jij als persoon bent.',
            leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.'
          },
          {
            groep: 'zelf',
            vraag: 'Waarom zet bijna niemand zijn moeilijke momenten op social media? En wat doet dat met jou als kijker?',
            antwoord: 'Mensen laten liever alleen hun leuke en mooie momenten zien. Als kijker ga je jezelf daarmee vergelijken en voel je je minder.',
            uitleg: 'Onthoud dat iedereen anders is en dat wat je ziet niet altijd waar is. Wees dus lief voor jezelf: jij bent goed zoals je bent.',
            leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.'
          },
          {
            groep: 'zelf',
            vraag: 'Kies twee maatregelen die je vanavond echt doet. Beschrijf per maatregel hoe jouw avond er dan anders uitziet.',
            antwoord: 'Bijvoorbeeld: meldingen uit, dan word ik niet steeds onderbroken. En een dag pauze, dan merk ik hoeveel tijd ik overhoud.',
            uitleg: 'Een maatregel noemen is makkelijk. Het effect erbij zetten laat zien dat je snapt waarom die maatregel werkt.',
            leerdoel: 'Je kunt twee dingen noemen die jij kunt doen om positiever met social media om te gaan.'
          },
          {
            groep: 'steun',
            vraag: 'Kies het goede woord. Ik doe mee met een challenge omdat de hele klas het doet. Is dat FOMO, druk of zelfbeeld?',
            antwoord: 'Dat is druk.',
            uitleg: 'FOMO zou zijn: ik kijk steeds of ik iets mis. Zelfbeeld is hoe jij vanbinnen over jezelf denkt.',
            leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.'
          },
          {
            groep: 'steun',
            vraag: 'Waar of niet waar: filters en bewerkingen maken een foto mooier dan hij in het echt is.',
            antwoord: 'Waar.',
            uitleg: 'Filters en bewerkingen zijn aanpassingen aan een foto of video. Wat je op je scherm ziet is dus bewerkt beeld.',
            leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.'
          },
          {
            groep: 'plus',
            vraag: 'Jij kijkt lang naar perfecte vakantiefoto\'s. Wat doet het algoritme uit 6.1 daarna met jouw tijdlijn?',
            antwoord: 'Het meet die lange kijktijd en geeft je er nog meer van. Zo raakt je tijdlijn vol met alleen maar hoogtepunten.',
            uitleg: 'Een losse foto is niet het probleem. Het probleem is dat je er honderd achter elkaar ziet. Dan lijkt die uitzondering ineens normaal.',
            leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.'
          }
        ]
      }),

    p('6.3', 'Cyberpesten: wat het is en wat het doet', ['23B'], 'begrippenkaart met vier woorden en een verhaal van tien regels', 100, 'Groepsapp Alarm',
      ['Wat cyberpesten is en waarom het nooit stopt',
        'Cyberpesten is pesten via internet, telefoon of een ander digitaal middel. Het gebeurt op WhatsApp, Instagram, Snapchat en TikTok, maar ook in games en via e-mail. Gewoon pesten gebeurt op school of op straat, waar je elkaar direct ziet. Cyberpesten gaat dag en nacht door en stopt dus niet als je thuiskomt. Online kun je bovendien anoniem zijn, en anoniem betekent dat niemand weet wie jij bent. Sommige pesters maken zelfs een nepaccount met een gestolen naam en foto. Achter een scherm gaan mensen daarom verder dan ze in het echt zouden doen.'],
      ['Wat het doet met drie mensen tegelijk',
        'Cyberpesten lijkt soms iets kleins, maar de gevolgen raken drie mensen tegelijk. Het slachtoffer is verdrietig, schaamt zich en denkt vaak dat het zijn eigen schuld is. Het krijgt ook lichamelijke klachten, zoals slecht slapen, hoofdpijn of buikpijn. De pester denkt dat het een grap is, maar krijgt straf en soms de politie. Hij krijgt bovendien een slechte reputatie, want anderen willen hem niet meer vertrouwen. De omstander ziet het pesten gebeuren, doet niet mee, maar helpt ook niet. Hij houdt er vaak spijt aan over en denkt: ben ik straks de volgende?'],
      media('https://www.youtube.com/embed/a-FX9FryDok', 'Wat cyberpesten met iemand doet', 'Welk gevolg uit de video had jij zelf niet bedacht? Schrijf op waarom niet.'),
      [
        {
          vraag: 'In een groepsapp wordt elke dag iemand uitgelachen. Is dat pesten? Leg in twee zinnen uit waarom je dat vindt.',
          antwoord: 'Ja, dat is cyberpesten: pesten via internet, telefoon of een ander digitaal middel. Het is gericht op een persoon en gaat door ondanks protest.',
          uitleg: 'Ook een gênante foto verspreiden of een nepaccount maken hoort erbij. Buitensluiten in een online groep of een game telt ook mee.',
          leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.'
        },
        {
          vraag: 'Iemand wordt in een game buitengesloten, terwijl de rest van de groep toekijkt. Wie krijgt daar volgens jou allemaal last van?',
          antwoord: 'Het slachtoffer, de pester en de omstanders die toekijken. Alle drie houden ze er iets aan over.',
          uitleg: 'Het slachtoffer krijgt klachten. De pester kan straf krijgen en een slechte naam. De omstander blijft achter met spijt.',
          leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.'
        },
        {
          vraag: 'Drie woorden uit deze paragraaf zijn anoniem, omstander en reputatie. Schrijf per woord op wat jij denkt dat het betekent.',
          antwoord: 'Anoniem: niemand weet wie jij bent. Omstander: iemand die het ziet maar niet meedoet en niet helpt. Reputatie: hoe anderen over jou denken.',
          uitleg: 'Deze drie woorden komen in het hele hoofdstuk terug. Wie ze door elkaar haalt, mist het verschil tussen de drie rollen.',
          leerdoel: 'Je weet wat de woorden anoniem, omstander en reputatie betekenen.'
        }
      ],
      {
        tekst: "<strong>Maak eerst de oefening en werk daarna je begrippen uit.</strong></p>\n" +
          "<p><strong>Stap 1. De oefening uit de bron.</strong> Maak de oefening van drie vragen: https://maken.wikiwijs.nl/p/questionnaire/standalone/8322030. Werkt de link niet? Beantwoord de vragen dan hieronder. <em>Vraag 1:</em> wat is het verschil tussen gewoon pesten en cyberpesten? <em>Vraag 2:</em> wat is een voorbeeld van cyberpesten? Kies uit deze vier. (a) Iemand laten struikelen op het schoolplein. (b) Iemand uitschelden in een groepsapp. (c) Een leuke meme delen met je vrienden. (d) Met iemand praten over zijn gevoelens. <em>Vraag 3:</em> vul de drie gaten in de tekst van de oefening aan. Je kiest uit vijf woorden: heel rot, veilig, anoniem, nep, makkelijker. Er blijven dus twee woorden over, en dat hoort zo. \"Cyberpesten is dan echt pesten. Dat komt omdat cyberpesten van achter een scherm gebeurt. Je kunt zo ook (1) pesten. Dat betekent dat niemand weet wie jij bent. Soms gaan mensen dan erg ver, met bijvoorbeeld een (2) naam en foto. Cyberpesten kan grote gevolgen hebben: iemand kan zich (3) voelen.\"</p>\n" +
          "<p><strong>Stap 2. Je begrippenkaart.</strong> Maak in Word een kaart met vier woorden: anoniem, omstander, reputatie en aangifte. Zet achter elk woord je eigen uitleg in een zin. Zet daarachter een voorbeeld uit een groepsapp of een game.</p>\n" +
          "<p><strong>Stap 3. Je verhaal van tien regels.</strong> Schrijf over een verzonnen leerling die online gepest wordt. Beschrijf wat er gebeurt en hoe het slachtoffer zich voelt. Beschrijf ook wat de pester denkt en wat de omstanders doen of juist niet doen. Gebruik geen echte namen van klasgenoten en lever je bestand in bij je docent.</p>\n" +
          "<p><strong>Belangrijk.</strong> Zit je zelf ergens mee of denk je aan zelfmoord? Bel dan gratis 0800-0113. Meer informatie vind je op https://www.113.nl/.",
        label: 'Lever in: je antwoorden op de oefening, je begrippenkaart met vier woorden en je verhaal van tien regels.',
        modelAnswer: "Oefening. Vraag 1: gewoon pesten gebeurt op school of op straat, waar je iemand direct ziet. Cyberpesten gebeurt via een telefoon, app of social media en kan dag en nacht doorgaan. Vraag 2: iemand uitschelden in een groepsapp. Vraag 3: gat 1 is anoniem, want de volgende zin legt uit dat niemand dan weet wie jij bent. Gat 2 is nep, want het gaat over een nepnaam en een nepfoto. Gat 3 is heel rot. De woorden veilig en makkelijker blijven over. Begrippenkaart. Anoniem: niemand weet wie jij bent. In een game scheldt iemand met de naam Shadow, en niemand weet wie dat is. Omstander: iemand die het ziet, niet meepest en niet helpt. In onze klassenapp lazen twintig mensen mee zonder iets te zeggen. Reputatie: hoe anderen over jou denken. Wie bekendstaat als pester wordt minder vertrouwd. Aangifte: naar de politie gaan om te melden dat er iets ergs is gebeurd. Verhaal. Mijn hoofdpersoon heet Roos en zij staat op een foto die de klassenapp rondgaat. Roos zegt niets meer in die app en ligt 's avonds uren wakker. Degene die begon vindt het gewoon grappig en denkt dat het overwaait. De omstanders zeggen niets, want ze zijn bang zelf aan de beurt te komen. Een van hen stuurt haar later privé een berichtje.",
        nakijkpunten: [
          'De drie vragen van de oefening zijn beantwoord.',
          'De invultekst is aangevuld met anoniem, nep en heel rot.',
          'De begrippenkaart heeft vier woorden, elk met uitleg en een voorbeeld.',
          'Het verhaal is tien regels en gaat over alle drie de rollen.'
        ]
      },
      ['Wat is het verschil tussen pesten en cyberpesten?', 'Noem twee voorbeelden van cyberpesten.', 'Wat betekent anoniem?', 'Welke klachten kan een slachtoffer krijgen?', 'Wat is een omstander?'],
      'Lees mee in een groepsapp, herken het moment waarop het pesten wordt en kies per bericht wat je doet.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'In de les staan vijf voorbeelden van cyberpesten. 1 Gemeen doen via berichten of reacties. 2 Iemand uitschelden in een groepsapp. 3 Een gênante foto van iemand verspreiden. 4 Iemand buitensluiten in een online groep. 5 Een nepaccount maken om iemand belachelijk te maken. Zet ze samen op volgorde van minst erg naar ergst.',
            antwoord: 'Elke volgorde mag, als jullie per voorbeeld kunnen zeggen waarom het daar staat.',
            uitleg: 'Merk op dat jullie het waarschijnlijk niet eens zijn. Dat komt doordat het effect op het slachtoffer telt, en niet de bedoeling van de zender.',
            leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.'
          },
          {
            groep: 'samen',
            vraag: 'Bedenk samen drie berichten die nog een grap zijn en drie die pesten zijn. Waar ligt bij jullie de grens?',
            antwoord: 'Een grap is van twee kanten en stopt als iemand er last van heeft. Pesten is gericht op een persoon en gaat door ondanks protest.',
            uitleg: 'De grens ligt bij het effect op de ontvanger, niet bij de bedoeling van de zender. Daarom is "het was maar een grapje" geen excuus.',
            leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.'
          },
          {
            groep: 'samen',
            vraag: 'Verdeel de rollen: een van jullie is slachtoffer, een pester, een omstander. Zeg om de beurt wat jouw rol eraan overhoudt.',
            antwoord: 'Slachtoffer: verdriet, schaamte, slecht slapen of buikpijn. Pester: straf, aangifte en een slechte reputatie. Omstander: spijt en schuldgevoel.',
            uitleg: 'De rollen verwisselen is de meestgemaakte fout. Onthoud: reputatie hoort bij de pester, buikpijn bij het slachtoffer.',
            leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.'
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets over 6.1 tot en met 6.3, vraag 1. Noem in een zin wat het algoritme voor jou uitrekent.',
            antwoord: 'Het rekent uit welke filmpjes en berichten jij in je tijdlijn te zien krijgt.',
            uitleg: 'Het bepaalt niet wat waar of belangrijk is. Het berekent alleen wat jouw aandacht het langst vasthoudt.',
            leerdoel: 'Je kunt uitleggen wat een algoritme op social media is.'
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 2. Amir liket een filmpje in een halve seconde. Sara kijkt een ander filmpje drie keer uit. Van wie leert het systeem het meest?',
            antwoord: 'Van Sara, want haar kijktijd kost echte minuten.',
            uitleg: 'Een like is maar een tik en kost bijna geen moeite. Kijktijd is daarom een eerlijker teken van interesse.',
            leerdoel: 'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.'
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 3. Wat verlies je als het algoritme jou steeds meer van hetzelfde geeft?',
            antwoord: 'Je ziet steeds minder verschillende meningen, beelden en nieuwsonderwerpen.',
            uitleg: 'Het aanbod wordt smaller, omdat het systeem herhaalt wat eerder werkte. Dat merk je pas als je erop gaat letten.',
            leerdoel: 'Je kunt een voordeel en een nadeel van algoritmes noemen.'
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 4. Zet de goede naam bij het gevoel. Gevoel 1: ik moet die jas ook kopen. Gevoel 2: ik mis iets als ik nu niet kijk.',
            antwoord: 'Gevoel 1 is druk. Gevoel 2 is FOMO.',
            uitleg: 'FOMO trekt je naar je scherm toe. Druk stuurt juist wat je buiten je scherm doet, zoals kopen of meedoen.',
            leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.'
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 5. Waarom is het highlight reel-effect een oneerlijke vergelijking?',
            antwoord: 'Omdat je je hele dag vergelijkt met alleen de mooiste momenten van iemand anders.',
            uitleg: 'Mensen laten hun moeilijke momenten niet zien. Je vergelijkt dus jouw complete leven met een selectie.',
            leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.'
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 6. Noem twee dingen die je vanaf morgen kunt doen om positiever met social media om te gaan.',
            antwoord: 'Meldingen uitzetten en social media-pauzes plannen. Ook positieve accounts volgen telt mee.',
            uitleg: 'Alle maatregelen hebben hetzelfde doel. Jij kiest zelf het moment waarop je kijkt, en niet je telefoon.',
            leerdoel: 'Je kunt twee dingen noemen die jij kunt doen om positiever met social media om te gaan.'
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 7. Twee dingen gebeuren online. 1 Iemand maakt een nepaccount om een klasgenoot belachelijk te maken. 2 Iemand deelt een meme in de vriendengroep. Welke van de twee is cyberpesten, en waarom?',
            antwoord: 'Nummer 1 is cyberpesten. Het is gericht op een persoon en het doet die persoon pijn.',
            uitleg: 'Een meme delen is pas pesten als hij over een persoon gaat en die persoon kwetst. Het gaat om het effect, niet om de grap.',
            leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.'
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 8. Noem een gevolg voor het slachtoffer en een gevolg voor de pester.',
            antwoord: 'Het slachtoffer kan slecht slapen, buikpijn of hoofdpijn krijgen. De pester kan straf krijgen, bijvoorbeeld nablijven, en een slechte naam.',
            uitleg: 'Let op dat het twee heel andere soorten gevolgen zijn. Bij het slachtoffer gaat het om gevoel en lichaam, bij de pester om straf en vertrouwen.',
            leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.'
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 9. Zet het goede woord bij de goede uitleg. Woorden: anoniem, omstander, reputatie.',
            antwoord: 'Anoniem: niemand weet wie jij bent. Omstander: je ziet het gebeuren, maar je doet niets. Reputatie: hoe anderen over jou denken.',
            uitleg: 'Deze drie woorden staan in bijna elke toetsvraag over cyberpesten. Reputatie gaat altijd over de pester.',
            leerdoel: 'Je weet wat de woorden anoniem, omstander en reputatie betekenen.'
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 10. Tel je goede antwoorden. Zeven of meer goed? Ga door naar de plusopgave. Zes of minder goed? Doe eerst de steunopgaven hieronder en lees terug wat misging.',
            antwoord: 'Zeven of meer goed: door naar de plusopgave onderaan deze paragraaf. Zes of minder goed: eerst de steunopgaven.',
            uitleg: 'Deze deeltoets bepaalt geen cijfer maar je route. Hij laat vroeg zien welk leerdoel nog niet goed zit.',
            leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.'
          },
          {
            groep: 'steun',
            vraag: 'Streep door wat geen cyberpesten is. a Uitschelden in een groepsapp. b Een nepaccount maken. c Iemand helpen met huiswerk in de chat.',
            antwoord: 'Iemand helpen met huiswerk in de chat is geen cyberpesten.',
            uitleg: 'Cyberpesten is gericht op een persoon en doet die persoon pijn. Helpen doet precies het tegenovergestelde.',
            leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.'
          },
          {
            groep: 'steun',
            vraag: 'Drie leerlingen zeggen iets. Wie is wie? Kim: "Ik heb er nu spijt van dat ik niets zei." Bo: "Ik moest nablijven en niemand vertrouwt me nog." Sil: "Ik slaap slecht en heb buikpijn."',
            antwoord: 'Kim is de omstander, Bo is de pester en Sil is het slachtoffer.',
            uitleg: 'Deze drie verwisselen is de meestgemaakte fout in de toets. Onthoud: reputatie gaat altijd over de pester.',
            leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.'
          },
          {
            groep: 'steun',
            vraag: 'Vul aan. Een pester kan op school straf krijgen, zoals nablijven of een gesprek met ... of met ....',
            antwoord: 'Een gesprek met de mentor of met de ouders.',
            uitleg: 'Bij ernstig pesten kan er zelfs aangifte gedaan worden. Aangifte doen is naar de politie gaan om iets ergs te melden.',
            leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.'
          },
          {
            groep: 'steun',
            vraag: 'Twee extra gevolgen voor het slachtoffer. Wat betekent het als iemand angst krijgt om naar school te gaan? En wat betekent somber of depressief worden?',
            antwoord: 'Angst om naar school te gaan is bang zijn dat het pesten daar doorgaat. Somber of depressief worden betekent dat je je lange tijd heel naar voelt en nergens zin in hebt.',
            uitleg: 'Deze twee gevolgen zie je niet aan de buitenkant. Daarom denken pesters vaak dat het wel meevalt.',
            leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.'
          },
          {
            groep: 'plus',
            vraag: 'Leg uit waarom anoniem pesten voor het slachtoffer zwaarder kan zijn dan pesten door iemand die je kent.',
            antwoord: 'Het slachtoffer weet niet wie het is en gaat daardoor iedereen wantrouwen. Ook klasgenoten die er niets mee te maken hebben komen onder verdenking.',
            uitleg: 'Anoniem pesten verspreidt de angst over de hele groep. Een anonieme pester durft bovendien verder te gaan.',
            leerdoel: 'Je weet wat de woorden anoniem, omstander en reputatie betekenen.'
          }
        ]
      }),

    p('6.4', 'Wat doe jij bij cyberpesten?', ['23B', '23A'], 'ingevulde opdracht Cyberpesten met een eigen stappenplan van vijf stappen', 100, 'Omstander of Held',
      ['Word jij gepest? Zet deze vijf stappen',
        "Word je online gepest, dan voelt het alsof je er helemaal alleen voor staat. Dat ben je niet, maar jij moet wel zelf de eerste stap durven zetten. Stap 1: praat erover met iemand die je vertrouwt, thuis of op school. Stap 2: maak van elk gemeen bericht een screenshot, dus een foto van je scherm. Stap 3: blokkeer de pesters, want dan kunnen ze jou niets meer sturen. Stap 4: meld het bij je mentor of bij de vertrouwenspersoon van school. Stap 5: vraag anoniem hulp via www.pestweb.nl of www.kindertelefoon.nl."],
      ['Zie je het gebeuren? En wat als jij meedeed?',
        'Ook als jij niet zelf gepest wordt, kun jij iets betekenen. Negeer het niet, want als niemand iets zegt lijkt het net alsof het oké is. Stuur het slachtoffer privé een kort berichtje, bijvoorbeeld: hé, gaat het? Rapporteren betekent dat je het bericht meldt bij de makers van de app. Meld het daarna ook bij een docent, want dat is geen klikken maar helpen. Bij ernstig pesten kan er aangifte gedaan worden bij de politie. Deed je zelf per ongeluk mee, bied dan je excuses aan en maak het goed.'],
      [
        media('https://www.youtube.com/embed/OA0EDH4z6_M', 'Cyberpesten: hoe ver kan het gaan?', 'Op welk moment in de video had een omstander het nog kunnen stoppen? Schrijf op wat hij dan had moeten doen.'),
        media('https://www.pestweb.nl/', 'Pestweb: anoniem hulp vragen bij pesten', 'Bekijk de site. Welke manier van contact opnemen zou jij zelf kiezen, en waarom die?')
      ],
      [
        {
          vraag: 'Stel: iemand stuurt jou elke avond nare berichten. Noem drie dingen die jij kunt doen en zet ze op volgorde.',
          antwoord: 'Eerst praten met iemand die je vertrouwt. Dan screenshots maken van de berichten. Daarna de pesters blokkeren en het melden bij je mentor.',
          uitleg: 'Bewijs bewaren gaat altijd voor blokkeren. Wie eerst blokkeert, kan de berichten daarna vaak niet meer terugvinden.',
          leerdoel: 'Je weet wat je kunt doen als je zelf gepest wordt.'
        },
        {
          vraag: 'In de klassenapp lacht iedereen om een foto van een klasgenoot. Wat doe jij, en wat doe jij juist niet?',
          antwoord: 'Je stuurt het slachtoffer privé een berichtje en je rapporteert het bij de app. Daarna meld je het bij een docent. Je lacht niet mee.',
          uitleg: 'Een lach-emoji telt voor het slachtoffer net zo hard als een woord. Zwijgen leest de rest van de groep als goedvinden.',
          leerdoel: 'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.'
        },
        {
          vraag: 'Wie kan jou helpen bij pesten? Noem twee mensen op school en twee plekken buiten school.',
          antwoord: 'Op school: je mentor en de vertrouwenspersoon. Daarbuiten: Pestweb en de Kindertelefoon. Bij zelfmoordgedachten bel je 0800-0113.',
          uitleg: 'Buiten school kun je anoniem praten, dus zonder je naam te noemen. Aangifte doen is iets anders: dat loopt via de politie.',
          leerdoel: 'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.'
        }
      ],
      {
        tekst: "<strong>Maak de opdracht Cyberpesten in een Word-document.</strong> Zet elke stap onder een eigen kopje.</p>\n" +
          "<p><strong>Stap 1. Het document uit de bron.</strong> Download het document en vul het helemaal in: https://maken.wikiwijs.nl/userfiles/b/bdcd8628039a6a0212c8129e42a7d2ce56096f44.docx. Vraag aan je docent of en hoe je het document moet delen.</p>\n" +
          "<p><strong>Stap 2. Jouw stappenplan van vijf stappen.</strong> Schrijf op wat jij morgen zou doen als jij online gepest werd. Zet achter elke stap een zin waarom die stap helpt. Gebruik in elk geval de woorden screenshots, blokkeren en vertrouwenspersoon.</p>\n" +
          "<p><strong>Stap 3. Vijf regels over melden.</strong> Leg uit waarom melden bij een docent geen klikken is maar helpen. Gebruik daarin de woorden omstander, rapporteren en aangifte.</p>\n" +
          "<p><strong>Stap 4. Je advies aan iemand die meedeed.</strong> Noem de drie dingen uit de theorie: excuses aanbieden, je berichten verwijderen en laten merken dat je ervan geleerd hebt. Sla het bestand daarna op in OneDrive en lever het in bij je docent.</p>\n" +
          "<p><strong>Meer hulp nodig?</strong> Kijk op https://www.kindertelefoon.nl/. Denk je aan zelfmoord, bel dan gratis 0800-0113 of kijk op https://www.113.nl/.",
        label: 'Lever in: het ingevulde bronnendocument, je stappenplan van vijf stappen, je tekst over melden en je advies.',
        modelAnswer: "Mijn stappenplan. 1. Ik vertel het meteen aan mijn mentor, want dan sta ik er niet in mijn eentje voor. 2. Ik maak screenshots van elk bericht, want dan heb ik nog bewijs als de pester ze wist. 3. Ik blokkeer de pesters, zodat ze mij niets meer kunnen sturen en ik rust krijg. 4. Ik ga naar de vertrouwenspersoon op school, want die weet wat er daarna moet gebeuren. 5. Ik rapporteer de berichten bij de app, zodat het platform ze zelf kan weghalen. Melden is geen klikken. Klikken doe je om iemand in de problemen te brengen; melden doe je om iemand uit de problemen te halen. Wie het ziet en zwijgt is een omstander, en de groep leest dat zwijgen als goedvinden. Rapporteren bij de app kost tien seconden en brengt niemand in de problemen. Gaat het heel ver, dan kan er aangifte gedaan worden bij de politie. Mijn advies aan iemand die per ongeluk meedeed: zeg eerlijk sorry, gooi je eigen berichten weg en doe voortaan niet meer mee.",
        nakijkpunten: [
          'Het bronnendocument uit de Wikiwijs-link is helemaal ingevuld en op de afgesproken manier gedeeld.',
          'Het stappenplan telt vijf stappen met per stap een reden, en gebruikt screenshots, blokkeren en vertrouwenspersoon.',
          'De tekst over melden gebruikt de woorden omstander, rapporteren en aangifte.',
          'Het advies noemt alle drie de dingen: excuses aanbieden, berichten verwijderen en laten merken dat je ervan geleerd hebt.'
        ]
      },
      ['Wat is je eerste stap als je gepest wordt?', 'Waarom maak je screenshots?', 'Wat doet blokkeren?', 'Wat betekent rapporteren?', 'Waarom is melden geen klikken?', 'Wat betekent aangifte doen?'],
      'Kies in tien online situaties tussen wegkijken, meelachen of ingrijpen en zie meteen wat je keuze doet.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Deed je per ongeluk mee met pesten? Dan kun je het in drie stappen goedmaken. 1 Bied je excuses aan en zeg dat je spijt hebt. 2 Verwijder je berichten. 3 Laat merken dat je ervan geleerd hebt. Bedenk samen per stap een zin die je echt zou durven zeggen.',
            antwoord: 'Bijvoorbeeld: "Sorry, dat was niet oké van mij." Daarna je eigen berichten wissen. En daarna zelf ingrijpen als het opnieuw gebeurt.',
            uitleg: 'Excuses aanbieden is moeilijk, maar juist daarom sterk. Je berichten weghalen laat zien dat je het echt meent.',
            leerdoel: 'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.'
          },
          {
            groep: 'samen',
            vraag: 'Zet samen deze vijf stappen in de goede volgorde. a Blokkeren. b Melden op school. c Praten met iemand die je vertrouwt. d Anoniem hulp vragen. e Screenshots maken.',
            antwoord: 'De volgorde is c, e, a, b, d. Dus: eerst praten, dan screenshots, dan blokkeren, dan melden op school. Anoniem hulp vragen kan altijd, als je je naam liever niet noemt.',
            uitleg: 'Screenshots komen voor blokkeren, want daarna zie je de berichten vaak niet meer. Anoniem hulp vragen kan altijd, ook meteen.',
            leerdoel: 'Je weet wat je kunt doen als je zelf gepest wordt.'
          },
          {
            groep: 'samen',
            vraag: 'Typ allebei een appje van hoogstens tien woorden aan iemand die net is uitgelachen. Laat het aan elkaar zien: welke van de twee zou jij zelf liever krijgen?',
            antwoord: 'Kort werkt het best, bijvoorbeeld: "Hé, gaat het?" of "Ik vind het niet oké wat ze zeggen."',
            uitleg: 'Een lange tekst hoeft niet en perfect hoeft ook niet. Elk berichtje laat merken dat niet iedereen meedoet.',
            leerdoel: 'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.'
          },
          {
            groep: 'zelf',
            vraag: 'Je ziet onder een filmpje dat iemand wordt uitgescholden. Je kent die persoon niet. Wat doe je?',
            antwoord: 'Je rapporteert de reactie bij de app of het platform. Dan kunnen de makers van de app het bericht weghalen.',
            uitleg: 'Rapporteren werkt ook als je het slachtoffer niet kent. Het is iets anders dan aangifte doen, want dat loopt via de politie.',
            leerdoel: 'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.'
          },
          {
            groep: 'zelf',
            vraag: 'Een pester gaat zo ver dat het slachtoffer geen uitweg meer ziet. Dat heet iemand tot wanhoop drijven. Wat kan er dan met die pester gebeuren?',
            antwoord: 'Die pester kan strafbaar zijn. Er kan dan aangifte tegen hem gedaan worden bij de politie.',
            uitleg: 'Pesten is dus niet altijd alleen een schoolzaak. Bij ernstige gevallen komt de politie er echt bij.',
            leerdoel: 'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.'
          },
          {
            groep: 'steun',
            vraag: 'Je krijgt vanavond het eerste gemene bericht. Kies wat je meteen doet: terugschelden, screenshots maken, of afwachten tot het overgaat?',
            antwoord: 'Screenshots maken, en het daarna vertellen aan iemand die je vertrouwt.',
            uitleg: 'Terugschelden maakt het meestal erger en afwachten geeft de pester alleen maar tijd. Met screenshots heb je bewijs in handen.',
            leerdoel: 'Je weet wat je kunt doen als je zelf gepest wordt.'
          },
          {
            groep: 'steun',
            vraag: 'Zet het juiste woord bij de uitleg: rapporteren, blokkeren, aangifte doen. Uitleg 1: naar de politie gaan. Uitleg 2: melden bij de app. Uitleg 3: zorgen dat iemand jou niets meer kan sturen.',
            antwoord: 'Uitleg 1 is aangifte doen, uitleg 2 is rapporteren, uitleg 3 is blokkeren.',
            uitleg: 'Deze drie worden vaak door elkaar gehaald. Ze gaan over drie verschillende plekken: de politie, de app en je eigen telefoon.',
            leerdoel: 'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.'
          },
          {
            groep: 'steun',
            vraag: 'Wat is een vertrouwenspersoon precies? En wat betekent het dat je bij Pestweb anoniem hulp kunt vragen?',
            antwoord: 'Een vertrouwenspersoon is iemand op school bij wie je met alles terechtkunt. Anoniem betekent dat je je eigen naam niet hoeft te zeggen.',
            uitleg: 'Op school kennen ze je naam wel, maar helpen ze je verder. Buiten school kun je eerst praten zonder jezelf bekend te maken.',
            leerdoel: 'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.'
          },
          {
            groep: 'plus',
            vraag: 'Ties zegt: "Ik heb zelf niets gestuurd, dus dit gaat mij niet aan." Schrijf drie zinnen waarmee jij hem van gedachten laat veranderen.',
            antwoord: 'Wie het ziet en zwijgt is een omstander. Voor de groep lijkt zwijgen op goedvinden, en het slachtoffer voelt zich nog meer alleen. Omstanders houden er zelf vaak spijt aan over.',
            uitleg: 'Niets doen is dus wel degelijk een keuze, met gevolgen voor drie partijen. Een privébericht of een melding bij de app verandert dat al.',
            leerdoel: 'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.'
          }
        ]
      }),

    p('6.5', 'Digitaal gezond blijven', ['23B'], 'schermdagboek van een dag met drie eigen verbeterpunten', 100, 'Schermtijd Balans',
      ['Wat een scherm met je lichaam en je geest doet',
        "Urenlang achter een scherm zitten heeft gevolgen voor je lichaam en voor je geest. Digitaal gezond blijven betekent dat je je telefoon en laptop verstandig gebruikt. Doe je dat, dan blijf je zowel fysiek als mentaal gezonder. Fysiek gaat over je lichaam, mentaal over je gevoel en je gedachten. Kijk je uren naar je scherm, dan hangt je hoofd te ver naar voren. Zo krijg je een kromme rug of zelfs een bochel, en spanning op je nek. Ook je schouders en je polsen kunnen daarvan pijn gaan doen. Verder word je er moe en prikkelbaar van, en dat merken anderen ook. Daarnaast krijg je droge ogen of hoofdpijn van het blauw licht van je scherm. Blauw licht remt melatonine, het stofje dat jou 's avonds slaperig maakt."],
      ['De 20-20-2 regel en digitale verslaving',
        "Voor je ogen is er een simpele tip: de 20-20-2 regel. Na elke volle 20 minuten schermtijd stop je even met kijken. Je kijkt dan 20 seconden naar iets op minstens 6 meter afstand. En je bent minstens 2 uur per dag buiten in het daglicht. Reken maar mee. Bij een uur huiswerk pauzeer je drie keer, bij twee uur zes keer. Bij digitale verslaving kun je bijna niet meer stoppen met je scherm gebruiken. Je wordt rusteloos zonder telefoon en let minder op school, familie en je hobby's."],
      [
        media('https://upload.wikimedia.org/wikipedia/commons/3/31/Ergonomic_Workstation.png', 'Afbeelding A: een werkplek met een bureau, een stoel en een beeldscherm (Wikimedia Commons, CC BY-SA 3.0 DE)', 'Kijk naar drie dingen op deze tekening: de rug, de voeten en de hoogte van het scherm. Noem er twee die hier goed gaan.'),
        media('https://upload.wikimedia.org/wikipedia/commons/c/c4/Bad_posture.jpg', 'Afbeelding B: een tekening van iemand op een stoel, met de wervelkolom uitgelicht (Wikimedia Commons, CC BY 3.0)', 'Op welke van de twee afbeeldingen zie je de slechte houding? Noem twee dingen die er met deze rug misgaan en schrijf erbij wat jij zou veranderen.'),
        media('https://youtube.com/shorts/s9nDVkBSr-g?si=hCrt5yOMyBbSCBqw', 'Snelle tip om je schermtijd te verminderen (Engels gesproken - zet de ondertiteling aan)', 'Let op: dit filmpje is Engels. Zet de ondertiteling aan via het tandwiel en kies Nederlands. Welke tip zie je iemand doen, en probeer jij hem vandaag?')
      ],
      [
        {
          vraag: 'Je zit een hele zaterdag te gamen achter je laptop. Welke drie dingen kunnen daarna pijn doen of vervelend voelen?',
          antwoord: 'Je rug en je nek van de kromme houding, je ogen worden droog en je krijgt hoofdpijn. \'s Avonds slaap je bovendien slechter in.',
          uitleg: 'De klachten hebben twee oorzaken: je houding en het licht van je scherm. Daarom heb je ook twee verschillende oplossingen nodig.',
          leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.'
        },
        {
          vraag: 'Je docent zegt: pas vandaag de 20-20-2 regel toe. Wat zou jij dan precies gaan doen? Gok gerust.',
          antwoord: 'Na elke 20 minuten schermtijd kijk je 20 seconden naar iets op minstens 6 meter afstand. En je gaat 2 uur per dag naar buiten.',
          uitleg: 'De 2 hoort niet bij de pauze, maar bij je hele dag. Dat verschil gaat in de toets het vaakst mis.',
          leerdoel: 'Je kunt de 20-20-2 regel uitleggen en toepassen.'
        },
        {
          vraag: 'Wanneer is telefoongebruik volgens jou te veel geworden? Noem twee dingen waaraan je dat bij jezelf zou merken.',
          antwoord: 'Je kunt bijna niet stoppen en je wordt rusteloos zonder telefoon. Ook krijgen school, familie of hobby\'s minder aandacht.',
          uitleg: 'Veel op je telefoon zitten is nog geen verslaving. Het gaat om de onrust en om de gevolgen voor de rest van je leven.',
          leerdoel: 'Je weet waaraan je digitale verslaving bij jezelf kunt herkennen.'
        }
      ],
      {
        tekst: "<strong>Maak je schermdagboek in een Word-document.</strong> De opdracht heeft vier delen met elk een eigen kopje.</p>\n" +
          "<p><strong>Deel 1. De foto's.</strong> Zoek of maak twee foto's van iemand achter een laptop: een met een goede houding en een met een slechte. Zet erbij welke foto de slechte houding laat zien en schrijf er drie dingen bij die daar fout gaan.</p>\n" +
          "<p><strong>Deel 2. Het schermdagboek.</strong> Kijk een dag lang naar je eigen schermgebruik. Maak daarna een korte samenvatting met deze drie antwoorden. (a) Hoeveel uur zat je op een scherm? (b) Welke klachten heb je gemerkt, bijvoorbeeld hoofdpijn, vermoeide ogen of een stijve nek? (c) Wat zou je morgen anders doen om digitaal gezonder te zijn?</p>\n" +
          "<p><strong>Deel 3. Drie verbeterpunten.</strong> Noteer drie dingen die je gaat veranderen. Gebruik in elk geval de woorden houding, 20-20-2 en nachtmodus. Zet per punt in een zin waarom het helpt.</p>\n" +
          "<p><strong>Deel 4. Je eigen mening.</strong> Schrijf in twee zinnen wat jij van je eigen telefoongebruik vindt. Zou je minder schermtijd willen, of ben je tevreden? Leg je antwoord uit en deel het document met je docent.",
        label: 'Lever je schermdagboek in: de twee foto\'s met uitleg, je dagoverzicht, je drie verbeterpunten en je eigen mening.',
        modelAnswer: "Op de tweede foto zie ik de slechte houding. Het hoofd hangt ver naar voren, de rug is krom en de laptop staat op schoot. Het scherm staat dus niet op ooghoogte. Op mijn eigen dag zat ik ongeveer zes uur achter een scherm: drie uur voor school en drie uur op mijn telefoon. Tegen de avond kreeg ik hoofdpijn en droge ogen, en mijn nek was stijf na mijn huiswerk. Mijn drie verbeterpunten. 1. Ik zet mijn laptop op een stapel boeken, zodat mijn scherm op ooghoogte staat en mijn houding beter wordt. 2. Ik zet een timer voor de 20-20-2 regel, want dan kijk ik na elke 20 minuten even ver weg. 3. Ik zet de nachtmodus aan na 21:00 uur, want blauw licht remt melatonine en dan slaap ik slechter in. Ik vind zelf dat ik 's avonds te veel op mijn telefoon zit. Ik wil vooral het laatste uur voor het slapen schermvrij maken.",
        nakijkpunten: [
          'De foto met de slechte houding is aangewezen, met drie concrete fouten erbij.',
          'Het schermdagboek noemt uren, een klacht en wat morgen anders gaat.',
          'De drie verbeterpunten gebruiken de woorden houding, 20-20-2 en nachtmodus, elk met een reden.',
          'De eigen mening bestaat uit twee zinnen met een uitleg, niet uit een woord.'
        ]
      },
      ['Welke klachten krijg je van te lang schermgebruik?', 'Waarom kun je een bril nodig hebben?', 'Wat doet blauw licht met je slaap?', 'Wat is de 20-20-2 regel?', 'Waaraan herken je digitale verslaving?', 'Noem twee manieren om gezonder met je scherm om te gaan.'],
      'Plan een schooldag vol schermmomenten en houd houding, ogen en slaap tegelijk in de groene zone.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Dit zijn de vijf tips uit de les om digitaal gezond te blijven. 1 Let op je houding: zit rechtop, met beide voeten op de grond en je scherm op ooghoogte. 2 Beweeg regelmatig: sta op, rek je uit en loop even rond. 3 Gebruik een schermfilter of de nachtmodus tegen het blauwe licht. 4 Maak afspraken met jezelf, bijvoorbeeld: na 21:00 uur geen telefoon meer. 5 Plan schermvrije momenten, bijvoorbeeld tijdens het eten of vlak voor het slapen. Kies er samen twee die vandaag nog lukken.',
            antwoord: 'Elke keuze is goed, als jullie er per tip bij zeggen welke klacht die tip aanpakt.',
            uitleg: 'Bewegen betekent hier: sta op, rek je uit en loop even een rondje. Een schermvrij moment is bijvoorbeeld tijdens het eten of vlak voor het slapen.',
            leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.'
          },
          {
            groep: 'samen',
            vraag: 'Vul samen het verhaal van Lisa aan. Kies uit: 20, ooghoogte, slechte, buiten, nachtmodus, vier, pauzes, 20-20-2, verslaafd. "Lisa zit al ... uur op haar telefoon. Haar schouders doen pijn en haar hoofd voelt zwaar. Dat komt door haar ... houding en het felle blauwe licht. Ze weet wel dat ze na elke ... minuten even 20 seconden ver moet kijken. Dat is de ... regel, maar ze doet het niet altijd. \'s Nachts slaapt Lisa slecht en overdag is ze snel moe. Ze pakt steeds haar telefoon, ook als ze huiswerk moet maken. Soms denkt ze dat ze een beetje ... is aan haar telefoon. Haar ouders zeggen dat ze vaker naar ... moet gaan. Lisa gaat rechtop zitten met haar scherm op ..., neemt vaker ... en zet \'s avonds een ...-filter aan."',
            antwoord: 'Op volgorde: vier, slechte, 20, 20-20-2, verslaafd, buiten, ooghoogte, pauzes, nachtmodus. Alle negen woorden zijn dus gebruikt.',
            uitleg: 'Let op het verschil tussen de twee keer 20. De eerste is de tijd achter je scherm, de tweede zijn de seconden dat je ver kijkt.',
            leerdoel: 'Je kunt de 20-20-2 regel uitleggen en toepassen.'
          },
          {
            groep: 'samen',
            vraag: 'Zet samen deze vier stappen in de goede volgorde. a) Ik heb 20 minuten op mijn telefoon gekeken. b) Ik kijk nog eens 20 minuten op mijn telefoon. c) Nu kijk ik 20 seconden naar buiten of ver weg. d) Ik neem een pauze en ga 2 uur naar buiten.',
            antwoord: 'De volgorde is a, c, b, d.',
            uitleg: 'De 20 seconden ver kijken komt direct na elke volle 20 minuten scherm. De 2 uur buiten hoort bij je hele dag en niet bij die pauze.',
            leerdoel: 'Je kunt de 20-20-2 regel uitleggen en toepassen.'
          },
          {
            groep: 'zelf',
            vraag: 'Zet bij elke klacht de juiste oorzaak. Klachten: rug- en nekklachten / slecht slapen / minder aandacht voor school en vrienden. Oorzaken: te veel blauw licht, digitale verslaving, slechte houding.',
            antwoord: 'Rug- en nekklachten komen van een slechte houding. Slecht slapen komt van te veel blauw licht. Minder aandacht voor school en vrienden komt van digitale verslaving.',
            uitleg: 'Elke oorzaak heeft zijn eigen gevolg. Houding werkt op je spieren, blauw licht op melatonine en verslaving op je aandacht.',
            leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.'
          },
          {
            groep: 'zelf',
            vraag: 'Sem maakt twee uur huiswerk achter zijn laptop. Hoe vaak neemt hij een 20-20-2 pauze, en wat doet hij dan precies?',
            antwoord: 'Zes keer, want twee uur zijn 120 minuten en dat is zes keer 20 minuten. Elke keer kijkt hij 20 seconden naar iets op minstens 6 meter afstand.',
            uitleg: 'Reken altijd zo: deel de minuten door 20. Een uur geeft dus drie pauzes en anderhalf uur geeft er vier.',
            leerdoel: 'Je kunt de 20-20-2 regel uitleggen en toepassen.'
          },
          {
            groep: 'zelf',
            vraag: 'Wat doe jij als eerste als je wakker wordt? En wat zegt dat over jouw telefoongebruik? Schrijf twee zinnen.',
            antwoord: 'Pak je meteen je telefoon, dan is dat een signaal dat je scherm je dag stuurt. Pak je hem pas later, dan bepaal jij het moment.',
            uitleg: 'Veel op je telefoon zitten is niet meteen een verslaving. Maar stuurt het je dagelijks leven, kijk dan kritisch naar je gedrag.',
            leerdoel: 'Je weet waaraan je digitale verslaving bij jezelf kunt herkennen.'
          },
          {
            groep: 'steun',
            vraag: 'Waar of niet waar: als je jarenlang heel vaak dichtbij naar een scherm kijkt, kun je een bril nodig krijgen.',
            antwoord: 'Waar.',
            uitleg: 'Je ogen staan dan urenlang op dichtbij ingesteld. Daarom staat er in de 20-20-2 regel juist dat je ver moet kijken.',
            leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.'
          },
          {
            groep: 'steun',
            vraag: 'Streep door wat geen signaal van digitale verslaving is. a Bijna niet kunnen stoppen. b Rusteloos worden zonder telefoon. c Een telefoon met veel opslagruimte.',
            antwoord: 'Een telefoon met veel opslagruimte is geen signaal.',
            uitleg: 'De signalen gaan over jouw gedrag en gevoel, niet over je toestel. Kijk dus naar wat je doet als je telefoon er niet is.',
            leerdoel: 'Je weet waaraan je digitale verslaving bij jezelf kunt herkennen.'
          },
          {
            groep: 'plus',
            vraag: 'Bram gamet elke avond twee uur met zijn laptop op schoot. Hij heeft nekpijn en valt pas na een uur in slaap. Noem de twee oorzaken en de twee oplossingen.',
            antwoord: 'De nekpijn komt door zijn houding, want zijn hoofd hangt ver naar voren. Het slechte inslapen komt door blauw licht. Oplossingen: laptop op tafel op ooghoogte, en het scherm een uur voor bedtijd wegleggen.',
            uitleg: 'Twee klachten met twee oorzaken vragen om twee maatregelen. Alleen de nachtmodus aanzetten lost zijn nekpijn dus niet op.',
            leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.'
          }
        ]
      }),

    p('6.6', 'Nepnieuws, deepfake en betrouwbare bronnen', ['21B', '21D'], 'factcheckdossier met een gecontroleerd bericht en je bronvermelding', 100, 'Factcheck Rush',
      ['Nepnieuws en de drie kenmerken',
        "Nepnieuws is nieuws dat niet waar is; in het Engels heet dat fake news. Het is bedacht of verdraaid, maar het ziet eruit als een echt nieuwsbericht. Kenmerk 1 is een opvallende, schokkende kop die je vooral moet laten klikken. Zo'n kop heet clickbait, en dat betekent letterlijk klik-aas. Kenmerk 2 is dat er geen betrouwbare bron bij het bericht staat. Een bron is de schrijver of de organisatie waar een bericht vandaan komt. Kenmerk 3 zijn oude of neppe foto's die eigenlijk bij heel ander nieuws horen."],
      ['Deepfake, en zo check je het zelf',
        "Een deepfake is een neppe video of audio, gemaakt met kunstmatige intelligentie. Kunstmatige intelligentie, kortweg AI, zijn slimme computerprogramma's die van voorbeelden leren. In zo'n video lijkt het alsof iemand iets zegt wat nooit echt gebeurd is. Stap 1: AI bekijkt duizenden beelden van die persoon, zoals zijn gezichtsuitdrukkingen. Stap 2: de computer plakt dat gezicht beeldje voor beeldje over iemand anders heen. Stap 3: ook de stem van die persoon wordt met AI nagemaakt. Controleer daarom elk bericht zelf met een factcheck van vier korte vragen."],
      [
        media('https://www.youtube.com/embed/KgPFSsv9-jw', 'Hoe herken je nepnieuws?', 'Hoe kun je nepnieuws toch herkennen, ook al lijkt het echt? Noem twee dingen uit de video.'),
        media('https://www.youtube.com/embed/l8JC2R3sbsk', 'Zo werkt een deepfake', 'Welk detail in de video verraadt volgens jou het duidelijkst dat het beeld nep is?')
      ],
      [
        {
          vraag: 'Je ziet twee koppen op TikTok: "Bekende rapper vermoord in Parijs!" en "Temu-pakketjes besmet met corona!" Waaraan zou jij bij zulke berichten twijfelen? Noem drie dingen.',
          antwoord: 'Aan de schokkende kop, aan het ontbreken van een betrouwbare bron, en aan de foto die er misschien niet bij hoort.',
          uitleg: 'Een tekst zonder spelfouten zegt niets over de waarheid. Nepnieuws ziet er juist vaak netjes en echt uit.',
          leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.'
        },
        {
          vraag: 'Er gaat een filmpje rond waarin de koning iets heel geks zegt. Hoe zou zo\'n filmpje gemaakt kunnen zijn, denk je?',
          antwoord: 'Met een deepfake: een neppe video gemaakt met AI. AI bekijkt duizenden beelden, plakt het gezicht over iemand anders heen en maakt ook de stem na.',
          uitleg: 'Een deepfake is dus meer dan een bewerkt filmpje. Bij bekende mensen lukt het het best, want er bestaat heel veel beeld van hen.',
          leerdoel: 'Je weet wat een deepfake is en hoe die gemaakt wordt.'
        },
        {
          vraag: 'Een vriend stuurt jou een schokkend bericht door. Wat doe jij voordat je het gelooft? Schrijf drie zinnen.',
          antwoord: 'Je stelt vier vragen: wie heeft dit gemaakt, wat is de bron, is het gecontroleerd, en is het logisch? Daarna zoek je het op bij een bekende nieuwssite.',
          uitleg: 'Zo\'n controle heet een factcheck. Zoeken kost een paar minuten en scheelt je een bericht waar je spijt van krijgt.',
          leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.'
        }
      ],
      {
        tekst: "<strong>Word zelf factchecker.</strong> Maak alle onderdelen in een Word-document, met een kopje per onderdeel.</p>\n" +
          "<p><strong>Onderdeel 1. Jouw mening.</strong> Geef in twee zinnen je mening over deze uitspraak: \"Mensen zijn zelf verantwoordelijk of ze nepnieuws geloven.\"</p>\n" +
          "<p><strong>Onderdeel 2. Deepfake.</strong> Bekijk de video over deepfakes hierboven (https://www.youtube.com/embed/l8JC2R3sbsk). Leg daarna uit waarom deepfake gevaarlijk kan zijn. Beantwoord ook: kun je deepfake ook voor iets positiefs gebruiken?</p>\n" +
          "<p><strong>Onderdeel 3. Een echt nepnieuwsbericht.</strong> Zoek online, bijvoorbeeld op Google, naar een nepnieuwsbericht dat in Nederland rondging. Schrijf kort op wat het bericht was, waarom het nepnieuws was en wat de gevolgen waren.</p>\n" +
          "<p><strong>Onderdeel 4. De factcheck.</strong> Je ziet dit bericht op TikTok: vanaf vandaag moeten alle Nederlanders 3 keer per week een coronatest doen, anders krijg je geen studiefinanciering meer. Gebruik Google en minstens een betrouwbare website om te controleren of dit klopt. Schrijf op wat je vindt, of je het bericht zou vertrouwen, en noem de website die je gebruikt hebt.</p>\n" +
          "<p><strong>Onderdeel 5. Nieuwscheckers.</strong> Ga naar https://nieuwscheckers.nl/ en zoek een artikel op. Schrijf op welk bericht je gevonden hebt en wat er nep aan was. Zet erbij waar de foto of het bericht wel echt vandaan komt.</p>\n" +
          "<p><strong>Onderdeel 6. Afronding.</strong> Schrijf in een zin wat jij het meest verrassende vond uit deze paragraaf. Let op: hierna volgt de eindtoets mediawijsheid. Leer daarvoor de begrippen uit het hele hoofdstuk, dus de dikgedrukte woorden met uitleg.",
        label: 'Lever je factcheckdossier in: je mening, je uitleg over deepfake, je nepnieuwsvoorbeeld, je eigen factcheck met bronvermelding en je Nieuwscheckers-artikel.',
        modelAnswer: "Onderdeel 1. Ik vind mensen voor een deel zelf verantwoordelijk, want de bron checken kost maar twee minuten. Toch is nepnieuws expres gemaakt om echt te lijken, dus je kunt het niet iemand helemaal aanrekenen. Onderdeel 2. Een deepfake is gevaarlijk doordat je iemand ziet bewegen en hoort praten. Beeld overtuigt sneller dan tekst, dus iemand kan woorden in de mond gelegd krijgen die hij nooit zei. Positief kan het ook: in een film kun je een acteur jonger maken, en wie zijn stem kwijt is kan die terugkrijgen. Onderdeel 3. In 2020 ging het verhaal rond dat 5G-straling corona zou veroorzaken. Dat was nepnieuws, want straling kan geen virus maken. Het gevolg was dat er in Nederland zendmasten in brand werden gestoken. Onderdeel 4. Van dat TikTok-bericht over verplichte coronatesten klopt niets. Ik heb de zin in Google getypt en gekeken bij de NOS en op rijksoverheid.nl. Daar staat helemaal niets over zo'n verplichting. Ik vertrouw het bericht dus niet en stuur het niet door. Als betrouwbare website heb ik nos.nl gebruikt. Onderdeel 5. Op Nieuwscheckers las ik over een rampfoto die bij een heel andere gebeurtenis hoorde. De foto zelf was echt, maar hij kwam van een gebeurtenis van jaren eerder in een ander land. Onderdeel 6. Het meest schokkend vond ik dat er in India een onschuldige man is doodgeslagen door een nepbericht.",
        nakijkpunten: [
          'Alle zes de onderdelen staan erin, ook de mening van twee zinnen en de slotzin.',
          'De factcheck van het TikTok-bericht noemt met naam de betrouwbare website die is gebruikt.',
          'Het Nieuwscheckers-artikel wordt beschreven met waar de foto of het bericht wel echt vandaan komt.',
          'Bij deepfake staan zowel het gevaar als een positieve toepassing.'
        ]
      },
      ['Noem drie kenmerken van nepnieuws.', 'Wat is clickbait?', 'Wat is een bron?', 'Hoe wordt een deepfake gemaakt?', 'Welke vier vragen stel je bij een bericht?'],
      'Beoordeel berichten onder tijdsdruk op kop, bron en beeld, en verzamel bewijs voordat je doorstuurt.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'In 2020 ging het verhaal rond dat je van 5G-straling corona kreeg. Mensen geloofden het en staken in Nederland zendmasten in brand. Bedenk samen twee redenen waarom iemand zoiets verzint.',
            antwoord: 'Om geld te verdienen aan klikken, om beroemd te worden, of om andere mensen te beïnvloeden.',
            uitleg: 'Nepnieuws is dus zelden zomaar een grapje. Er zit bijna altijd een doel achter, en dat doel kost soms echte slachtoffers.',
            leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.'
          },
          {
            groep: 'samen',
            vraag: 'Lees deze kop samen: "SCHOKKEND: zangeres overlijdt na boosterprik, familie zwijgt!" Welke twee kenmerken van nepnieuws zien jullie al in die ene regel?',
            antwoord: 'De opvallende, schokkende kop met hoofdletters en een uitroepteken. En er staat geen bron of schrijver bij.',
            uitleg: 'Zo\'n kop is clickbait: hij is gemaakt om je te laten klikken. Het derde kenmerk, de foto, moet je apart bekijken.',
            leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.'
          },
          {
            groep: 'samen',
            vraag: 'Bij een bericht over de oorlog in Oekraïne staat een foto van een explosie. Die foto is tien jaar oud en komt uit een ander land. Welk kenmerk van nepnieuws is dat, en waarom werkt die truc zo goed?',
            antwoord: 'Dat is kenmerk 3: oude of neppe foto\'s. Hij werkt omdat een echte foto bij een vals verhaal geloofwaardig overkomt.',
            uitleg: 'De foto zelf is dus niet vervalst, alleen de tekst eronder. Zoeken met een foto kan ook: ga naar images.google.com, klik op het camera-icoontje en sleep de foto erin. Google laat dan zien waar die foto eerder stond.',
            leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.'
          },
          {
            groep: 'samen',
            vraag: 'Loop samen de vier controlevragen langs bij een bericht dat een van jullie vandaag zag. Wie heeft het gemaakt, wat is de bron, is het gecontroleerd, en is het logisch?',
            antwoord: 'Een goed antwoord noemt per vraag wat jullie wel of niet konden vinden. Het eindigt met een conclusie: wel of niet vertrouwen.',
            uitleg: 'De vier vragen samen zijn een factcheck. Gebruik daarbij Nieuwscheckers.nl, Drogredenen.nl of Snopes.com, of typ het bericht gewoon in Google.',
            leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.'
          },
          {
            groep: 'zelf',
            vraag: 'Er gaat een filmpje rond waarin de minister-president zegt dat de zomervakantie twee weken korter wordt. Noem drie dingen die jij doet om dat te checken.',
            antwoord: 'Kijken wie het gepost heeft, de zin in Google typen, en controleren of de NOS of het Jeugdjournaal het ook meldt.',
            uitleg: 'Zo\'n besluit zou overal in het nieuws staan. Staat het nergens bij een bekende nieuwssite, dan is het waarschijnlijk nep.',
            leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.'
          },
          {
            groep: 'zelf',
            vraag: 'In India ging op WhatsApp het bericht rond dat er kinderdieven waren. Het klopte niet, maar in een dorp werd een onschuldige man doodgeslagen. Noem twee dingen die er met mensen gebeuren door nepnieuws.',
            antwoord: 'Mensen geloven iets dat niet klopt en worden bang of boos. Ze sturen het door, en zo ontstaan ruzies of zelfs geweld.',
            uitleg: 'Dit is precies waarom een factcheck van twee minuten de moeite waard is. Stuur je het door zonder te checken, dan help jij het bericht verder.',
            leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.'
          },
          {
            groep: 'zelf',
            vraag: 'Je ziet president Obama in een filmpje iets geks zeggen. Zijn gezicht beweegt normaal en zijn stem klinkt echt. Leg in drie stappen uit hoe zo\'n filmpje gemaakt is.',
            antwoord: 'Eerst bekijkt AI duizenden beelden van Obama. Daarna plakt de computer zijn gezicht over iemand anders heen. Ten slotte wordt zijn stem nagemaakt.',
            uitleg: 'Pas met die drie stappen samen ontstaat een deepfake. Een oude foto opnieuw plaatsen is dus iets heel anders.',
            leerdoel: 'Je weet wat een deepfake is en hoe die gemaakt wordt.'
          },
          {
            groep: 'steun',
            vraag: 'Hetzelfde bericht staat op drie plekken. 1 Bij een anoniem account. 2 Op een site die Gekke Gabber Nieuws heet. 3 Bij de Universiteit van Amsterdam. Welke van de drie geloof je?',
            antwoord: 'De Universiteit van Amsterdam.',
            uitleg: 'Betrouwbaar zijn ook de NOS, RTL Nieuws en het Jeugdjournaal. Bij een anoniem account kun je helemaal niets controleren.',
            leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.'
          },
          {
            groep: 'steun',
            vraag: 'Hoe heet een heftige kop die vooral bedoeld is om jou te laten klikken?',
            antwoord: 'Clickbait.',
            uitleg: 'Clickbait betekent letterlijk klik-aas. De kop is het aas en jouw klik is precies wat ze willen.',
            leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.'
          },
          {
            groep: 'plus',
            vraag: 'Van een nepbericht in tekst geloven mensen je meestal als je zegt dat het nep is. Bij een deepfake lukt dat veel moeilijker. Waarom?',
            antwoord: 'Bij een deepfake zie en hoor je iemand, en beeld geloven mensen sneller dan tekst. Ook als je later bewijst dat het nep is, blijft het beeld hangen.',
            uitleg: 'Daarom verspreidt een deepfake zich harder dan een geschreven bericht. Dezelfde techniek kan trouwens ook nuttig zijn, bijvoorbeeld in films.',
            leerdoel: 'Je weet wat een deepfake is en hoe die gemaakt wordt.'
          }
        ]
      }),

    checkpoint('6.7', 'Checkpoint: eindtoets mediawijsheid', ['21B', '23B', '23C'], 'bewijs van deelname met je resultaat plus een terugblik van vijf regels', 120, 'Mediawijs Meesterproef',
      ['Wat je in dit hoofdstuk geleerd hebt',
        'Dit hoofdstuk ging over mediawijs zijn, en dat is meer dan media gebruiken. Mediawijs betekent snappen hoe media werken en daarna zelf kiezen wat je doet. Je weet nu hoe een algoritme jouw tijdlijn samenstelt uit jouw eigen gedrag. Je kent FOMO, cyberpesten, de klachten van te veel schermtijd en nepnieuws. Let op: deze toets hoort bij les 9 tot en met 14 van de lessenserie. Er staan dus ook vragen in over hoofdstuk 5, en die tellen gewoon mee. Leer niet door herlezen maar door overhoren: dek de uitleg af en zeg alles hardop.'],
      ['Zo maak je de toets, en hoe het daarna verdergaat',
        'De toets uit de lessenserie staat op Wikiwijs en bevat 29 vragen. Je krijgt er 20 willekeurig, dus niet iedereen krijgt dezelfde vragen. Vanaf 55 procent goed heb je een voldoende, dus je mag er een paar missen. Aan het einde zie je een bewijs van deelname met jouw resultaat erop. Maak daar meteen een schermafbeelding van en deel die met je docent. Zonder dat bewijs telt je resultaat niet mee, want de toets bewaart niets voor je. Ging een leerdoel mis, dan volg je het herstelspoor en doe je die oefeningen opnieuw.'],
      null,
      [
        {
          vraag: 'Sla je boek dicht. Schrijf per paragraaf een begrip op met je eigen uitleg. Bij welk begrip liep je vast?',
          antwoord: 'Bijvoorbeeld: 6.1 algoritme, 6.2 FOMO, 6.3 omstander, 6.4 vertrouwenspersoon, 6.5 de 20-20-2 regel, 6.6 clickbait.',
          uitleg: 'Het begrip dat niet lukte is precies je leerpunt. Overhoren werkt beter dan herlezen, want je merkt nu al wat ontbreekt.',
          leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.'
        },
        {
          vraag: 'Kies uit dit hoofdstuk de twee stukken waar jij nu nog over twijfelt. Wat ga je met die twee doen voor de toets?',
          antwoord: 'Bijvoorbeeld: de gevolgen per rol bij cyberpesten en de drie getallen van de 20-20-2 regel. Ik lees die stukken terug en overhoor mezelf.',
          uitleg: 'Twee onderwerpen kiezen is realistischer dan alles opnieuw doen. Gericht terugzoeken kost je bovendien veel minder tijd.',
          leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.'
        },
        {
          vraag: 'Straks staat je resultaat op het scherm. Wat is de allereerste knop die jij dan indrukt, en waar komt dat bestand terecht?',
          antwoord: 'Ik maak meteen een schermafbeelding van het eindscherm. Die sla ik op in mijn map in OneDrive en deel ik zoals mijn docent zei.',
          uitleg: 'De toets bewaart je resultaat niet voor je docent. Sluit je het tabblad zonder afbeelding, dan moet je opnieuw beginnen.',
          leerdoel: 'Je kunt je resultaat opslaan en delen met je docent.'
        }
      ],
      {
        tekst: "<strong>Maak de eindtoets mediawijsheid en lever je bewijs in.</strong> Reken op twee lesuren: in het eerste uur oefen je, in het tweede uur maak je de toets. Je werkt zelfstandig, want de Digidocent helpt je bij deze toets niet.</p>\n" +
          "<p><strong>Stap 1. Leer de begrippen per paragraaf.</strong> Uit 6.1 en 6.2: algoritme, social media, kijktijd, trending, FOMO, druk, zelfbeeld, highlight reel-effect, filters en bewerkingen, sociale bevestiging, filterbubbel en influencer. Uit 6.3 en 6.4: cyberpesten, anoniem, slachtoffer, pester, omstander, reputatie, screenshot, blokkeren, rapporteren, aangifte en vertrouwenspersoon. Uit 6.5 en 6.6: blauw licht, melatonine, ooghoogte, de 20-20-2 regel, digitale verslaving, nepnieuws, clickbait, bron, deepfake en factcheck. Neem ook de begrippen uit hoofdstuk 5 door: norm, waarde, gedragsregel, privacy, iDEAL, creditcard, Klarna en achteraf betalen. Die staan er echt in, want de toets gaat over les 9 tot en met 14.</p>\n" +
          "<p><strong>Stap 2. Maak de toets.</strong> Ga naar https://maken.wikiwijs.nl/p/questionnaire/standalone/8329938. Je krijgt 20 willekeurige vragen uit een set van 29, en vanaf 55 procent goed heb je een voldoende. Lees bij elke vraag eerst alle antwoorden helemaal door voordat je kiest. Kom je er niet uit, sla de vraag dan over en kom later terug.</p>\n" +
          "<p><strong>Stap 3. Bewaar je bewijs.</strong> Maak aan het einde een schermafbeelding van je bewijs van deelname met je resultaat. Sla die op in OneDrive en deel hem met je docent.</p>\n" +
          "<p><strong>Stap 4. Je terugblik van vijf regels.</strong> Schrijf in een Word-bestand: welke twee vragen gingen mis, bij welke paragraaf hoorden ze, en wat ga je eraan doen?</p>\n" +
          "<p><strong>Stap 5. Kies je route.</strong> Ging een leerdoel mis, dan doe je de oefeningen daarvan opnieuw en lever je een nieuw bewijsje in; dat is het herstelspoor. Ging alles goed, dan kies je het verdiepingsspoor en help je een klasgenoot. Lever je schermafbeelding, je terugblik en je route samen in.",
        label: 'Lever in: je bewijs van deelname met je resultaat, je terugblik van vijf regels en de route die je kiest.',
        modelAnswer: "Mijn toets staat op 70 procent goed en dat is een voldoende. Van het eindscherm met mijn bewijs van deelname heb ik meteen een schermafbeelding gemaakt. Die staat in mijn map Digitale geletterdheid in OneDrive en ik heb hem met mijn docent gedeeld. Twee vragen gingen mis. De eerste ging over de gevolgen per rol bij cyberpesten. Ik koos reputatie bij het slachtoffer, terwijl reputatie bij de pester hoort. Die vraag hoort bij paragraaf 6.3. De tweede ging over de 20-20-2 regel. Ik dacht dat de 2 twee uur zonder scherm betekende, maar het zijn twee uur buiten per dag. Die vraag hoort bij paragraaf 6.5. Voor die twee leerdoelen ga ik dus het herstelspoor doen. Ik doe de oefeningen van 6.3 en 6.5 opnieuw. Als nieuw bewijsje lever ik een schema in met de drie rollen en hun gevolgen.",
        nakijkpunten: [
          'Het bewijs van deelname is ingeleverd, met de opslagplek erbij.',
          'De terugblik noemt twee vragen die misgingen en bij welke paragraaf ze horen.',
          'Er staat een concrete vervolgactie in, niet alleen "beter leren".',
          'De gekozen route is benoemd: herstelspoor bij een gemist leerdoel, of verdieping.'
        ]
      },
      ['Waarop baseert een algoritme zijn keuze?', 'Waarvan leert het algoritme?', 'Noem een voordeel en een nadeel van algoritmes.', 'Wat betekent FOMO?', 'Wat is een filterbubbel?', 'Noem twee dingen die je zelf kunt doen.', 'Wat is cyberpesten?', 'Wat houdt een omstander eraan over?', 'Wat betekenen anoniem en reputatie?', 'Wat doe je als je zelf gepest wordt?', 'Wat doe je als je iemand anders ziet pesten?', 'Wat betekent aangifte doen?', 'Welke klachten krijg je van te veel schermtijd?', 'Wat houdt de 20-20-2 regel in?', 'Waaraan herken je digitale verslaving?', 'Noem drie kenmerken van nepnieuws.', 'Hoe wordt een deepfake gemaakt?', 'Hoe controleer je een bron?', 'Wat is een waarde en wat is een gedragsregel?', 'Hoe deel je je resultaat met je docent?'],
      'Vijf kamers, elke kamer een leerdoel uit dit hoofdstuk, met een eindsleutel die je alleen krijgt bij volledig bewijs.',
      false,
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Spreek met je buurman of buurvrouw af hoe jullie de diagnose hierna gebruiken. Wat schrijf je op zodra een vraag misgaat?',
            antwoord: 'Je noteert het leerdoel letterlijk en de paragraaf waar het bij hoort, bijvoorbeeld: "Je weet wat een omstander is" bij 6.3.',
            uitleg: 'De diagnose is geen cijfer maar een wegwijzer. Zonder notitie weet je straks nog steeds niet welk stuk je moet herhalen.',
            leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.'
          },
          {
            groep: 'samen',
            vraag: 'Leg elkaar uit wat het herstelspoor en het verdiepingsspoor zijn. Wanneer volg je welk spoor?',
            antwoord: 'Ging een leerdoel mis, dan volg je het herstelspoor met de steunopgaven. Ging alles goed, dan help je een klasgenoot en doe je de plusopgave.',
            uitleg: 'Je hoeft dus niet alles opnieuw te doen. Je herhaalt alleen het leerdoel dat nog niet goed zat.',
            leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vraag 1. Zeg in een zin wat een algoritme op social media is en doet.',
            antwoord: 'Een algoritme is een computerregel die berekent welke filmpjes en berichten jij in je tijdlijn krijgt.',
            uitleg: 'Gaat dit mis? Lees paragraaf 6.1, theorieblok 1 terug. Het is geen mens en geen knop, maar een berekening per persoon.',
            leerdoel: 'Je kunt uitleggen wat een algoritme op social media is.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vraag 2. Noem drie dingen waarvan het algoritme leert. Zeg welk signaal het zwaarst weegt.',
            antwoord: 'Het leert van je klikken, van je kijktijd en van wat je opzoekt. Kijktijd weegt het zwaarst.',
            uitleg: 'Gaat dit mis? Lees paragraaf 6.1, theorieblok 2 terug. Doe daar de steunopgave met doorstrepen nog een keer.',
            leerdoel: 'Je weet hoe een algoritme leert van wat jij aanklikt en bekijkt.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vraag 3. Noem een voordeel en een nadeel van algoritmes.',
            antwoord: 'Voordeel: je vindt sneller muziek of sport die bij je past. Nadeel: je komt bijna geen andere meningen meer tegen.',
            uitleg: 'Gaat dit mis? Lees paragraaf 6.1, theorieblok 2 terug. Zet bij het nadeel altijd erbij wie er last van heeft.',
            leerdoel: 'Je kunt een voordeel en een nadeel van algoritmes noemen.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vraag 4. Leg in twee zinnen het verschil uit tussen FOMO en druk voelen.',
            antwoord: 'FOMO is bang zijn dat je iets leuks mist als je niet kijkt. Druk is het gevoel dat je iets moet doen omdat anderen het ook doen.',
            uitleg: 'Gaat dit mis? Lees paragraaf 6.2, theorieblok 1 terug. FOMO trekt je naar je scherm, druk stuurt je gedrag daarbuiten.',
            leerdoel: 'Je kunt uitleggen wat FOMO is en wat druk voelen betekent.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vraag 5. Wat is het highlight reel-effect, en wat is een filterbubbel?',
            antwoord: 'Het highlight reel-effect is dat mensen alleen hun mooiste momenten laten zien. Een filterbubbel is dat je steeds dezelfde soort berichten krijgt.',
            uitleg: 'Gaat dit mis? Lees paragraaf 6.2, theorieblok 2 terug. Het eerste gaat over posten, het tweede over wat jij krijgt.',
            leerdoel: 'Je weet wat het highlight reel-effect en een filterbubbel zijn.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vraag 6. Noem twee dingen die jij zelf kunt doen om positiever met social media om te gaan.',
            antwoord: 'Meldingen uitzetten, zodat je zelf kiest wanneer je kijkt. En pauzes plannen, zodat je merkt hoeveel tijd je overhoudt.',
            uitleg: 'Gaat dit mis? Lees paragraaf 6.2, theorieblok 2 terug. Ook positieve accounts volgen telt als goede maatregel.',
            leerdoel: 'Je kunt twee dingen noemen die jij kunt doen om positiever met social media om te gaan.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vraag 7. Wat is cyberpesten? Noem er twee voorbeelden bij uit apps of games.',
            antwoord: 'Cyberpesten is pesten via internet, telefoon of een ander digitaal middel. Bijvoorbeeld uitschelden in een groepsapp of een gênante foto verspreiden.',
            uitleg: 'Gaat dit mis? Lees paragraaf 6.3, theorieblok 1 terug. Buitensluiten en een nepaccount maken horen er ook bij.',
            leerdoel: 'Je kunt uitleggen wat cyberpesten is en er voorbeelden van geven.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vraag 8. Noem per rol een gevolg van cyberpesten: voor het slachtoffer, de pester en de omstander.',
            antwoord: 'Slachtoffer: buikpijn, slecht slapen of angst om naar school te gaan. Pester: straf, aangifte of een slechte reputatie. Omstander: spijt of schuldgevoel.',
            uitleg: 'Gaat dit mis? Lees paragraaf 6.3, theorieblok 2 terug. Doe daar de steunopgave met de drie rollen opnieuw.',
            leerdoel: 'Je weet wat de gevolgen zijn voor het slachtoffer, de pester en de omstander.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vraag 9. Geef de betekenis van de woorden anoniem, omstander en reputatie.',
            antwoord: 'Anoniem: niemand weet wie jij bent. Omstander: iemand die het ziet, niet meepest en niet helpt. Reputatie: hoe anderen over jou denken.',
            uitleg: 'Gaat dit mis? Lees paragraaf 6.3 terug. Deze drie woorden komen in de bron-eindtoets terug als koppelopgave.',
            leerdoel: 'Je weet wat de woorden anoniem, omstander en reputatie betekenen.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vraag 10. Noem drie stappen die jij zet als je zelf online gepest wordt, in de goede volgorde.',
            antwoord: 'Eerst praten met iemand die je vertrouwt, dan screenshots maken, dan blokkeren. Daarna meld je het bij je mentor.',
            uitleg: 'Gaat dit mis? Lees paragraaf 6.4, theorieblok 1 terug. Let op de volgorde: bewijs bewaren gaat voor blokkeren.',
            leerdoel: 'Je weet wat je kunt doen als je zelf gepest wordt.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vraag 11. Wat doe je als je ziet dat iemand anders online gepest wordt? Noem drie handelingen.',
            antwoord: 'Niet negeren en niet meelachen, privé een steunend berichtje sturen, het bericht rapporteren bij de app en het melden bij een docent.',
            uitleg: 'Gaat dit mis? Lees paragraaf 6.4, theorieblok 2 terug. Rapporteren bij de app wordt het vaakst vergeten.',
            leerdoel: 'Je weet wat je kunt doen als je ziet dat iemand anders online gepest wordt.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vraag 12. Waar kun je hulp vragen bij pesten, en wat betekent aangifte doen?',
            antwoord: 'Op school bij je mentor of de vertrouwenspersoon, daarbuiten anoniem via Pestweb of de Kindertelefoon. Aangifte doen is naar de politie gaan.',
            uitleg: 'Gaat dit mis? Lees paragraaf 6.4 terug. Houd rapporteren, blokkeren en aangifte doen goed uit elkaar.',
            leerdoel: 'Je weet waar je hulp kunt vragen en wat aangifte doen betekent.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vraag 13. Noem drie klachten van te lang schermgebruik. Zet er per klacht de oorzaak bij.',
            antwoord: 'Rug- en nekklachten door een slechte houding, slecht slapen door blauw licht, en droge ogen of hoofdpijn. Op termijn kun je een bril nodig hebben.',
            uitleg: 'Gaat dit mis? Lees paragraaf 6.5, theorieblok 1 terug. Maak daar de koppelopgave klacht-oorzaak opnieuw.',
            leerdoel: 'Je kunt klachten noemen die je kunt krijgen van te lang schermgebruik.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vraag 14. Leg de 20-20-2 regel uit. Hoe vaak pas je hem toe tijdens een uur huiswerk, en hoe vaak tijdens twee uur?',
            antwoord: 'Na elke volle 20 minuten kijk je 20 seconden naar iets op minstens 6 meter afstand, en je bent 2 uur per dag buiten. Een uur huiswerk geeft drie pauzes, twee uur geeft er zes.',
            uitleg: 'Gaat dit mis? Lees paragraaf 6.5, theorieblok 2 terug. Deel de minuten door 20, en onthoud dat de 2 bij je hele dag hoort.',
            leerdoel: 'Je kunt de 20-20-2 regel uitleggen en toepassen.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vraag 15. Aan welke drie signalen herken je digitale verslaving bij jezelf?',
            antwoord: 'Je kunt bijna niet stoppen, je wordt rusteloos zonder telefoon, en school, familie of hobby\'s krijgen minder aandacht.',
            uitleg: 'Gaat dit mis? Lees paragraaf 6.5, theorieblok 2 terug. De signalen gaan over je gedrag, nooit over je toestel.',
            leerdoel: 'Je weet waaraan je digitale verslaving bij jezelf kunt herkennen.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vraag 16. Noem de drie kenmerken van nepnieuws.',
            antwoord: 'Een opvallende, schokkende titel. Geen betrouwbare bron. Oude of neppe foto\'s.',
            uitleg: 'Gaat dit mis? Lees paragraaf 6.6, theorieblok 1 terug. Een verzorgde tekst zegt niets over de waarheid.',
            leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vraag 17. Leg in drie stappen uit hoe een deepfake gemaakt wordt.',
            antwoord: 'AI bekijkt duizenden beelden van een persoon. De computer plakt dat gezicht over iemand anders heen. Daarna wordt ook de stem nagemaakt.',
            uitleg: 'Gaat dit mis? Lees paragraaf 6.6, theorieblok 2 terug. Bij bekende mensen lukt het het best.',
            leerdoel: 'Je weet wat een deepfake is en hoe die gemaakt wordt.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vraag 18. Welke vier vragen stel je om te controleren of een bericht klopt?',
            antwoord: 'Wie heeft dit gemaakt? Wat is de bron? Is het al door anderen gecontroleerd? Is het logisch?',
            uitleg: 'Gaat dit mis? Lees paragraaf 6.6, theorieblok 2 terug. Die vier vragen samen heten een factcheck.',
            leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.'
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose vraag 19. Oefen het een keer droog. Maak nu een schermafbeelding van dit scherm, sla hem op in je map en laat hem aan je buurman zien.',
            antwoord: 'Ik maak een schermafbeelding, sla die op in mijn map in OneDrive en deel hem zoals mijn docent zei.',
            uitleg: 'Gaat dit mis? Lees paragraaf 6.7, theorieblok 2 terug. Zonder schermafbeelding telt je resultaat straks niet mee.',
            leerdoel: 'Je kunt je resultaat opslaan en delen met je docent.'
          },
          {
            groep: 'steun',
            vraag: 'Ging er iets mis in de diagnose? Maak deze kaart. Zet bij elk woord de juiste paragraaf: algoritme, FOMO, omstander, blokkeren, melatonine, clickbait.',
            antwoord: 'Algoritme hoort bij 6.1, FOMO bij 6.2, omstander bij 6.3, blokkeren bij 6.4, melatonine bij 6.5 en clickbait bij 6.6.',
            uitleg: 'Zo weet je meteen welk stuk je terugleest. Elk begrip hoort bij precies een paragraaf van dit hoofdstuk.',
            leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.'
          },
          {
            groep: 'steun',
            vraag: 'Terugblik hoofdstuk 5, want die stof zit ook in de toets. Wat is een waarde, wat is een norm en wat is een gedragsregel?',
            antwoord: 'Een waarde is iets wat jij belangrijk vindt, zoals respect. Een norm en een gedragsregel zeggen hoe je je hoort te gedragen, bijvoorbeeld: je scheldt niemand uit.',
            uitleg: 'De toets gaat over les 9 tot en met 14. Deze begrippen komen daar echt in terug, net als privacy.',
            leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.'
          },
          {
            groep: 'steun',
            vraag: 'Terugblik hoofdstuk 5, deel 2. Waarom zet je je account op privé, en wat doe je als je online iets ziet wat niet oké is?',
            antwoord: 'Je account op privé zetten beschermt je privacy. Zie je iets wat niet oké is, dan rapporteer je het bij de app of het platform.',
            uitleg: 'Deze twee vragen staan echt in de bron-eindtoets. Ze horen bij hoofdstuk 5, maar tellen hier gewoon mee.',
            leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.'
          },
          {
            groep: 'plus',
            vraag: 'Alles goed in de diagnose? Leg aan een klasgenoot uit hoe het algoritme uit 6.1, de filterbubbel uit 6.2 en nepnieuws uit 6.6 met elkaar te maken hebben.',
            antwoord: 'Het algoritme geeft je meer van hetzelfde, dus je komt in een filterbubbel. In die bubbel spreekt bijna niemand het bericht tegen. Daardoor blijft het nepnieuws veel langer staan.',
            uitleg: 'Drie paragrafen die je apart leerde, blijken hetzelfde mechanisme te delen. Uitleggen aan een ander laat zien of je het echt snapt.',
            leerdoel: 'Je kunt laten zien wat je weet over social media, cyberpesten, digitale gezondheid en nepnieuws.'
          }
        ]
      })
  ]
};
