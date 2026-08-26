// Hoofdstuk 8 - Zelf maken: programmeren, ontwerpen en terugblikken.
// Basisberoepsgerichte leerweg (bb).
//
// BRON (leidend)
// --------------
// Het Wikiwijs-arrangement "Digitale Geletterdheid" van DaCapo College
// (Jennifer Leijen, Sander Theunissen, Gerdien Dohmen en Mirko Ensinck,
// CC BY 4.0).
//   8.4  <- les 18 "Introductie Canva"
//   8.5  <- les 19 "Eindopdracht Canva en AI"
//   8.6  <- les 20 "Afsluiting en terugblik Digitale Vaardigheden"
//          (checkpoint en tegelijk de eindtoets van het leerjaar: final = true)
//
// Er is niets uit die drie lessen weggelaten. Wat in de bron een lijstje met
// handelingen is, staat hier in de PRAKTIJKOPDRACHT en niet in de theorie:
// daar voert de leerling het uit en daar kan hij het afvinken.
//   - de zeven aanmeldstappen van Canva (les 18)  -> opdracht 8.4, deel 1;
//   - de negen posterstappen (les 18)             -> opdracht 8.4, deel 2 en 3;
//   - de drie uitwegen bij betaalde elementen     -> opdracht 8.4, deel 4, en
//     nog een keer in opdracht 8.5, stap 8, want de bron herhaalt ze daar ook;
//   - opdracht 2 "verder oefenen" (les 18)        -> opdracht 8.4, deel 5;
//   - de vier doelen van de eindopdracht (les 19) -> theorieblok A van 8.5;
//   - de vijf kenmerken van een goede poster      -> theorieblok B van 8.5;
//   - de vijf postertips (les 19)                 -> oefenblok 8.5, samen;
//   - de negen onderwerpen (les 19)               -> opdracht 8.5, stap 3;
//   - de zes voorwaarden (les 19)                 -> opdracht 8.5, stap 6;
//   - de vier terugblikvragen (les 20)            -> theorieblok A van 8.6 en
//     opdracht 8.6, deel 1;
//   - het vergelijken met je buurman (les 20)     -> opdracht 8.6, deel 2;
//   - optie A, B en C met hun eisen (les 20)      -> opdracht 8.6, deel 3;
//   - het inleveren in vijf minuten (les 20)      -> opdracht 8.6, deel 4;
//   - het colofon met de CC BY 4.0-licentie       -> theorieblok B van 8.6.
// De video uit les 18 (youtube.com/embed/oVH6Qu9HEZ4) staat als mediablok bij
// 8.4, met een kijkvraag. TalkAI uit les 19 staat als mediablok bij 8.5.
//
// TOEGEVOEGDE PARAGRAFEN (docentmetadata, staat niet in de leerlingtekst)
// ----------------------------------------------------------------------
// 8.1, 8.2 en 8.3 vullen kerndoel 22B (computationeel denken); dat kerndoel
// ontbreekt in de lessenserie zelf. In eigen woorden geschreven op basis van:
//   - Schooltv, Clipphanger "Wat is een algoritme?"
//     (schooltv.nl/video-item/clipphanger-wat-is-een-algoritme);
//   - het NPO-programma Huh?! "Wat is een algoritme?" (YouTube);
//   - de Nederlandstalige Scratch-uitleg "Programmeren met Scratch (uitgelegd
//     in 1,5 minuut)", "Scratch voor beginners" en "Als...dan | Blokkenseries
//     Scratch" (YouTube), plus de editor zelf op scratch.mit.edu;
//   - het lemma "Bug (technologie)" op nl.wikipedia.org. Let op: de mot van
//     1947 maakte het woord beroemd, maar bedacht het niet. Edison schreef er
//     in 1878 al over. De leerlingtekst zegt daarom "toen werd het bekend".
// 8.7 (Plus: van blokken naar echte code) staat hier NIET in: dat is de
// vrijwillige plusparagraaf van de theoretische leerweg.
//
// VORM: DIT IS DE HARDE EIS VAN DEZE LEERWEG
// ------------------------------------------
// Voor bb gaat vorm voor inhoud. Concreet in dit bestand:
//   - elk theorieblok telt 5 tot 7 zinnen van maximaal twaalf woorden, een
//     idee per zin. Ter vergelijking: tl heeft hier blokken van tien tot
//     achttien zinnen. Een bb-blok is ongeveer 55 tot 75 woorden;
//   - er staan TWAALF mediablokken in, elk met een korte kijkvraag: 8.1 twee,
//     8.2 drie, 8.3 twee, 8.4 twee, 8.5 twee en 8.6 een. Waar uitleg in beeld
//     kan, staat hij niet in tekst;
//   - elke praktijkopdracht is opgeknipt in genummerde doe-taakjes van
//     ongeveer twee minuten, met per taakje wat je precies inlevert;
//   - het oefenblok telt per paragraaf zeven tot negen korte opgaven, verdeeld
//     over samen, zelf, steun en plus;
//   - de vragen in de afsluitquiz zijn kort. Ruim veertig procent is een
//     waar-niet-waar-knop, zodat een leerling elke minuut iets aanklikt.
//
// DE HOOFDSTUKLAAG VAN DE BLAUWDRUK
// ---------------------------------
// A. VOORKENNISCHECK OVER HOOFDSTUK 7. Twee terugblikvragen staan bovenaan de
//    checks van 8.1: over AI die van data leert (7.1) en over de vier
//    onderdelen van een prompt (7.3). Basis laat 7.4 vallen, dus daar wordt
//    niet naar terugverwezen. De leerdoelzinnen staan letterlijk in VORIG.
// B. DEELTOETS OVER 8.1, 8.2 EN 8.3. Staat in de checks van 8.4, dus in het
//    blok "Startcheck: wat weet je al?" van de eerste paragraaf na het
//    programmeerdeel. Een routevraag, negen korte deeltoetsvragen (een per
//    leerdoel) en daarna de drie gewone startvragen van 8.4. Zeven of meer
//    goed is doorgaan plus het plusspoor; zes of minder is eerst het
//    steunspoor. Die twee sporen staan als eerste opgave in de oefengroepen
//    steun en plus van dezelfde paragraaf.
// C. DIAGNOSTISCHE RONDE. Staat in de checks van 8.6: een routevraag, vijftien
//    korte diagnosevragen (een per leerdoel van 8.1 tot en met 8.5) en de twee
//    gewone startvragen van 8.6. Bij elke vraag staat in de uitleg wat je
//    terugpakt als hij misging. Twaalf of minder goed is het herstelspoor,
//    dertien of meer het verdiepingsspoor.
//
// De verrijking (leerdoelen, kernbegrippen, uitgewerkte voorbeelden,
// samenvattingen en alle quiz- en toetsvragen) staat in
// scripts/seed-verrijking/bb/h8.mjs.

import { p, checkpoint, media } from '../helpers.mjs';

// Leerdoelen van hoofdstuk 7, letterlijk overgetypt uit het jaarplan. Ze
// hangen aan de twee voorkennisvragen bovenaan 8.1.
const VORIG = {
  data: 'Je weet dat AI leert van data en niet denkt zoals een mens.',
  prompt: 'Je kunt een duidelijke prompt schrijven met opdracht, onderwerp, doelgroep en lengte.'
};

// De leerdoelen van dit hoofdstuk, zodat elke startvraag, oefenopgave en
// diagnosevraag aan de letterlijke zin hangt en niet aan een parafrase.
const DOEL = {
  algoritme: 'Je kunt uitleggen wat een algoritme is als stappenplan.',
  stappen: 'Je kunt een dagelijkse handeling in duidelijke stappen opschrijven.',
  herhaalKeuze: 'Je weet wat een herhaling en een keuze in een stappenplan zijn.',
  bouwen: 'Je kunt met blokken een klein programma maken dat werkt.',
  gebruiken: 'Je kunt in je programma een herhaling en een als-dan-keuze gebruiken.',
  navertellen: 'Je kunt uitleggen wat jouw programma stap voor stap doet.',
  testen: 'Je kunt je programma testen en zien waar het misgaat.',
  bug: 'Je weet wat een bug is en hoe je die opspoort.',
  feedback: 'Je kunt je programma verbeteren na feedback van een klasgenoot.',
  account: 'Je kunt met je schoolmail een Canva-account maken en inloggen.',
  starten: 'Je kunt een A4-poster starten en tekst, elementen en kleur toevoegen.',
  delen: 'Je kunt je ontwerp downloaden of delen als PNG of PDF.',
  chatbot: 'Je kunt met een chatbot informatie verzamelen over jouw onderwerp.',
  eigenWoorden: 'Je kunt die informatie in je eigen woorden op een poster zetten.',
  ontwerp: 'Je kunt een poster maken die leesbaar, rustig en aantrekkelijk is.',
  terugblik: 'Je kunt terugkijken op wat je dit jaar geleerd hebt over digitale geletterdheid.',
  creatie: 'Je kunt je kennis laten zien in een eigen eindcreatie in Canva, Word of PowerPoint.'
};

export default {
  chapter: 8,
  chapterTitle: 'Zelf maken: programmeren, ontwerpen en terugblikken',
  badge: 'Digitale Maker',
  paragraphs: [
    p('8.1', 'Algoritmes: een stappenplan voor de computer', ['22B', '21A'], 'eigen stappenplan van een dagelijkse handeling, getest door een klasgenoot', 100, 'Stappen Sorteren',
      ['Een algoritme is een stappenplan',
        'Een algoritme is een stappenplan voor de computer. Het zegt precies wat er moet gebeuren. Ook de volgorde staat er precies in. Een recept is een algoritme. Je navigatie in de auto ook. Een computer vult zelf niets in. Vergeet jij een stap? Dan gebeurt die stap niet.'],
      ['Een herhaling en een keuze',
        'Soms moet iets een paar keer gebeuren. Dan schrijf je een herhaling op. Bijvoorbeeld: herhaal tien keer, doe een stap. Soms hangt iets van iets anders af. Dan schrijf je een keuze op. Bijvoorbeeld: als het regent, dan pak je een jas. Het stuk na "als" heet de voorwaarde.'],
      [
        media('https://schooltv.nl/video-item/clipphanger-wat-is-een-algoritme', 'Clipphanger: wat is een algoritme?', 'Kijk de clip. Schrijf in een zin op wat een algoritme volgens de clip is.'),
        media('https://www.youtube.com/embed/vmq6Rehhl6Q', 'Huh?!: wat is een algoritme?', 'Noem een algoritme uit de video dat jij vandaag al gebruikt hebt. Schrijf de eerste stap erbij.')
      ],
      [
        {
          vraag: 'Terugblik hoofdstuk 7. Waarvan leert AI? En denkt AI zoals jij denkt?',
          antwoord: 'AI leert van data, dus van heel veel voorbeelden. Nee, AI denkt niet zoals jij. Hij rekent alleen.',
          uitleg: 'Daarom moet je in dit hoofdstuk elke stap opschrijven. Een computer bedenkt niets voor jou.',
          leerdoel: VORIG.data
        },
        {
          vraag: 'Terugblik hoofdstuk 7. Uit welke vier onderdelen bestond een goede prompt?',
          antwoord: 'De opdracht, het onderwerp, de doelgroep en de lengte.',
          uitleg: 'In paragraaf 8.5 schrijf je zelf zo een prompt voor je poster. Hoe preciezer, hoe beter het antwoord.',
          leerdoel: VORIG.prompt
        },
        {
          vraag: 'Je legt iemand uit hoe hij een boterham smeert. Wat moet je zeggen? Noem de eerste twee stappen.',
          antwoord: 'Bijvoorbeeld: pak de zak brood. Haal er twee sneetjes uit. Elke handeling apart, en op volgorde.',
          uitleg: 'Een mens vult zelf aan wat jij vergeet. Een computer doet dat nooit.',
          leerdoel: DOEL.algoritme
        },
        {
          vraag: 'Hoeveel stappen heb jij nodig voor het inpakken van je tas? Noem er alvast twee.',
          antwoord: 'Bijvoorbeeld acht. Stap 1: open je rooster. Stap 2: kijk welke vakken je morgen hebt.',
          uitleg: 'Je hebt bijna altijd meer stappen nodig dan je denkt. Kleine handelingen tellen ook mee.',
          leerdoel: DOEL.stappen
        },
        {
          vraag: 'Hoe zeg je dat iets tien keer moet gebeuren? En dat iets alleen bij regen moet gebeuren?',
          antwoord: 'Bijvoorbeeld: herhaal tien keer, doe een stap. En: als het regent, dan pak je een jas.',
          uitleg: 'Dit zijn precies een herhaling en een keuze. Alleen nog in gewone taal, nog niet in blokken.',
          leerdoel: DOEL.herhaalKeuze
        }
      ],
      {
        tekst: '<strong>Maak je eigen stappenplan.</strong> Werk in een Word-bestand. Zet elk deel onder een eigen kopje. Elk deel is een taakje van een paar minuten.</p>\n' +
          '<p><strong>Deel 1. Kies je handeling. (1 minuut)</strong> Kies iets dat je elke dag doet. Bijvoorbeeld: je tas inpakken, thee zetten of inloggen op school. Schrijf je keuze bovenaan.</p>\n' +
          '<p><strong>Deel 2. Schrijf de stappen op. (5 minuten)</strong> Schrijf de handeling in genummerde stappen. Minimaal zes stappen, maximaal twaalf. Elke stap begint met een werkwoord, zoals "pak" of "klik".</p>\n' +
          '<p><strong>Deel 3. Bouw er een herhaling in. (2 minuten)</strong> Zet er een stap bij die begint met "herhaal". Bijvoorbeeld: herhaal voor elk vak op je rooster.</p>\n' +
          '<p><strong>Deel 4. Bouw er een keuze in. (2 minuten)</strong> Zet er een stap bij die begint met "als". Bijvoorbeeld: als je gym hebt, dan pak je je sporttas.</p>\n' +
          '<p><strong>Deel 5. Laat het testen. (5 minuten)</strong> Geef je stappenplan aan een klasgenoot. Hij speelt robot en voert het letterlijk uit. Hij mag niets zelf invullen. Schrijf op bij welke stap hij vastliep.</p>\n' +
          '<p><strong>Deel 6. Verbeter je plan. (2 minuten)</strong> Pas die ene stap aan. Zet de nieuwe versie eronder. Lever je Word-bestand daarna in bij je docent.',
        label: 'Lever je Word-bestand in met beide versies. Schrijf hier op bij welke stap jouw tester vastliep.',
        modelAnswer: 'Een voldoende inzending is een genummerde lijst van ongeveer acht stappen, bijvoorbeeld over "tas inpakken voor morgen". Stap 1 is: open je rooster. Ergens staat een echte herhaling, zoals "herhaal voor elk vak op je rooster: pak het boek en het schrift". Ergens staat een echte keuze, zoals "als je gym hebt, pak dan ook je sporttas". Daaronder staat: "Mijn tester liep vast bij stap 1. Ik was vergeten te zeggen dat je eerst je rooster opent. Dat is nu de nieuwe stap 1." De tweede versie laat die aanpassing echt zien.',
        nakijkpunten: [
          'Elke stap kun je meteen uitvoeren als hij aan de beurt is.',
          'Er staat echt een herhaling in en echt een keuze met "als".',
          'Je noemt de stap waar je tester vastliep en wat je veranderd hebt.'
        ]
      },
      ['Wat is een algoritme?', 'Waarom is de volgorde belangrijk?', 'Wat doet een herhaling?', 'Wat is een voorwaarde?', 'Waarom mag je tester niet meedenken?', 'Waarom vergeet je vaak kleine stappen?'],
      'Sleep losse stappen in de goede volgorde. Bouw daarna een herhaling en een keuze in het plan.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Sam schrijft: 1 doe de deur op slot, 2 loop naar buiten, 3 pak je sleutel. Welke stap staat fout?',
            antwoord: 'Stap 3 staat te laat. Je hebt de sleutel al nodig bij stap 1.',
            uitleg: 'Voer een stappenplan letterlijk uit. Bij stap 1 heeft Sam nog geen sleutel. Daar loopt hij dus vast.',
            leerdoel: DOEL.algoritme
          },
          {
            groep: 'samen',
            vraag: 'Lees samen hardop voor: pak brood, smeer boter, doe kaas erop. Klopt de volgorde? Waarom wel of niet?',
            antwoord: 'Ja, die klopt. Eerst brood, dan boter, dan kaas. Andersom werkt het niet.',
            uitleg: 'Eerst kaas en dan boter smeren gaat mis. Dezelfde stappen in een andere volgorde geven een ander resultaat.',
            leerdoel: DOEL.algoritme
          },
          {
            groep: 'zelf',
            vraag: 'Schrijf het opladen van je telefoon op. Gebruik hooguit vijf stappen.',
            antwoord: 'Bijvoorbeeld: 1 pak de kabel, 2 doe de stekker in het stopcontact, 3 doe het kleine eind in je telefoon, 4 kijk of het laadsymbool komt.',
            uitleg: 'Let op de stap die je vaak vergeet: kijken of het laden echt begon. Juist daar loopt een computer vast.',
            leerdoel: DOEL.stappen
          },
          {
            groep: 'zelf',
            vraag: 'Waar past in jouw laadplan een herhaling? En waar past een keuze?',
            antwoord: 'Een herhaling: herhaal tot de accu vol is. Een keuze: als de accu onder de twintig procent zit, laad dan op.',
            uitleg: 'Een herhaling herken je aan iets dat vaker moet. Een keuze herken je aan het woordje "als".',
            leerdoel: DOEL.herhaalKeuze
          },
          {
            groep: 'zelf',
            vraag: 'Schrijf in een zin op wat de voorwaarde is in: als het regent, dan pak je een jas.',
            antwoord: 'De voorwaarde is: het regent. Dat kan waar zijn of niet waar.',
            uitleg: 'De voorwaarde staat altijd tussen "als" en "dan". Alleen als hij waar is, gebeurt het stuk na "dan".',
            leerdoel: DOEL.herhaalKeuze
          },
          {
            groep: 'steun',
            vraag: 'Vul aan: een algoritme is een ... . En de ... van de stappen bepaalt of het werkt.',
            antwoord: 'Een algoritme is een stappenplan. En de volgorde van de stappen bepaalt of het werkt.',
            uitleg: 'Deze twee woorden zijn de kern van de paragraaf. Stappenplan is het wat, volgorde is het wanneer.',
            leerdoel: DOEL.algoritme
          },
          {
            groep: 'plus',
            vraag: 'Twee mensen doen hetzelfde stappenplan. Toch is het resultaat anders. Hoe kan dat?',
            antwoord: 'Er staat een stap in die niet precies genoeg is. Of de voorwaarde valt bij hen anders uit.',
            uitleg: 'Een stap als "doe er wat suiker in" laat ruimte over. En "als het regent" is bij de een wel waar en bij de ander niet.',
            leerdoel: DOEL.herhaalKeuze
          }
        ]
      }),

    p('8.2', 'Zelf programmeren met blokken', ['22B', '22A'], 'werkend blokprogramma met een herhaling en een als-dan-keuze', 100, 'Blokkenbouwer',
      ['Bouwen met blokken',
        'In Scratch klik je gekleurde blokken aan elkaar. Elk blok is een opdracht. De vorm laat zien wat eronder past. Zo kun je geen tikfout maken. Het figuur op het speelveld heet een sprite. De blokken onder elkaar heten samen een script. Je bouwt gratis op scratch.mit.edu.'],
      ['De vlag, de herhaling en de als-dan',
        'Elk script begint met een geel startblok. Dat blok heet: wanneer op de groene vlag wordt geklikt. Daaronder klik je de rest van je blokken. Het oranje herhaal-blok doet iets steeds opnieuw. Blokken die erin liggen gaan steeds door. Het als-dan-blok is de keuze uit 8.1. Je schuift er een voorwaarde in, zoals: raak ik de rand?'],
      [
        media('https://www.youtube.com/embed/xq-9Wd3pGq8', 'Programmeren met Scratch in anderhalve minuut', 'Kijk de video. Noem een ding dat de sprite in de video doet.'),
        media('https://www.youtube.com/embed/NkjtZl1MpfI', 'Scratch voor beginners: je eerste programma', 'Welk blok zet de maker helemaal bovenaan? Schrijf de naam van dat blok op.'),
        media('https://www.youtube.com/embed/uY6smVKxjQA', 'Als...dan: de keuze in Scratch', 'Welke voorwaarde schuift de maker in het als-dan-blok? Schrijf op wat er gebeurt als die niet waar is.')
      ],
      [
        {
          vraag: 'Je klikt drie blokken onder elkaar. Wat doet de computer dan volgens jou?',
          antwoord: 'Hij doet ze van boven naar beneden. Eerst het bovenste blok, dan het tweede, dan het derde.',
          uitleg: 'Blokken werken als de genummerde stappen uit 8.1. De plek in de stapel bepaalt de beurt.',
          leerdoel: DOEL.bouwen
        },
        {
          vraag: 'In 8.1 schreef je een herhaling op. Hoe ziet zo een herhaling er als blok uit, denk je?',
          antwoord: 'Als een blok met een opening erin. In die opening leg je de blokken die steeds opnieuw moeten.',
          uitleg: 'De vorm doet het werk. Aan de opening zie je wat binnen de herhaling valt en wat erbuiten.',
          leerdoel: DOEL.gebruiken
        },
        {
          vraag: 'Denk aan een spel dat jij kent. Wat gebeurt er na de startknop? Noem drie dingen op volgorde.',
          antwoord: 'Bijvoorbeeld: de score gaat op nul, het figuur komt links in beeld, en dan begint hij te lopen.',
          uitleg: 'Dit navertellen op volgorde doe je straks ook bij je eigen script. Dan blok voor blok.',
          leerdoel: DOEL.navertellen
        }
      ],
      {
        tekst: '<strong>Bouw je eerste programma in Scratch.</strong> Werk de zes taakjes op volgorde af. Vink ze af terwijl je bezig bent.</p>\n' +
          '<p><strong>Taak 1. Open de editor. (1 minuut)</strong> Ga naar scratch.mit.edu. Klik op Maken. Inloggen hoeft niet. Met een account bewaar je je werk wel.</p>\n' +
          '<p><strong>Taak 2. Zet het startblok neer. (1 minuut)</strong> Pak het gele blok "wanneer op de groene vlag wordt geklikt". Zet het bovenaan je werkveld.</p>\n' +
          '<p><strong>Taak 3. Laat je sprite lopen. (3 minuten)</strong> Pak het blok "herhaal oneindig". Klik het onder je startblok. Leg er "neem 10 stappen" in. Leg er ook "keer om aan de rand" in.</p>\n' +
          '<p><strong>Taak 4. Bouw een keuze. (3 minuten)</strong> Pak het als-dan-blok. Leg het ook in de herhaling. Schuif er de voorwaarde "raak ik de rand?" in. Die vind je bij Waarnemen. Zet er "zeg Boing!" in.</p>\n' +
          '<p><strong>Taak 5. Test je programma. (2 minuten)</strong> Klik op de groene vlag. Kijk of het doet wat jij bedacht had. Zo niet? Kijk of alle blokken echt vastzitten.</p>\n' +
          '<p><strong>Taak 6. Lever in. (3 minuten)</strong> Maak een screenshot van je script. Maak ook een screenshot van het speelveld. Plak ze in Word. Schrijf er vier of vijf regels bij. Vertel per blok wat het doet. Lever het bestand in bij je docent.',
        label: 'Lever je twee screenshots met uitleg in. Schrijf hier in twee zinnen wat jouw programma doet.',
        modelAnswer: 'Op het screenshot staat het gele startblok bovenaan. Daaronder zit "herhaal oneindig". Daarbinnen liggen "neem 10 stappen" en "keer om aan de rand". Daar ligt ook een als-dan-blok met "raak ik de rand?" en daarin "zeg Boing!". De uitleg eronder luidt bijvoorbeeld: "Mijn programma start bij de groene vlag. De herhaling laat de kat steeds doorlopen. Aan de rand keert hij om. Het als-dan-blok kijkt of hij de rand raakt. Alleen dan roept hij Boing." De uitleg loopt van boven naar beneden mee met de blokken.',
        nakijkpunten: [
          'Er zit een startblok, een herhaling en een als-dan-blok in je script.',
          'Op het speelveld gebeurt echt wat jij in je uitleg opschrijft.',
          'Je uitleg loopt van blok naar blok, van boven naar beneden.'
        ]
      },
      ['Wat is een sprite?', 'Waarmee begint elk script?', 'Wat doet een herhaal-blok?', 'Wat schuif je in een als-dan-blok?', 'Waarom kun je met blokken geen tikfout maken?', 'Wat is een script?'],
      'Klik blokken aan elkaar tot de sprite de opdracht haalt. Elk level vraagt een extra herhaling of keuze.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Een klasgenoot legt "neem 10 stappen" los op het werkveld. Er staat geen startblok boven. Waarom gebeurt er niets?',
            antwoord: 'Er is geen startblok. De computer weet dus niet wanneer dat blok aan de beurt is.',
            uitleg: 'Zonder startblok is het als een recept zonder beginmoment. Zet het gele vlagblok erboven.',
            leerdoel: DOEL.bouwen
          },
          {
            groep: 'samen',
            vraag: 'Wijs samen op het scherm aan: waar zit het gele blok, waar het oranje blok, waar het als-dan-blok?',
            antwoord: 'Geel staat bovenaan en start. Oranje is de herhaling. Als-dan is de keuze.',
            uitleg: 'De kleuren helpen je zoeken. Geel is Gebeurtenissen, oranje is Besturen. Ook als-dan staat bij Besturen.',
            leerdoel: DOEL.gebruiken
          },
          {
            groep: 'zelf',
            vraag: 'Je sprite moet blijven lopen en "Boing!" roepen bij de rand. Welke twee blokken heb je nodig?',
            antwoord: 'Een herhaal-blok om het lopen heen. En daarbinnen een als-dan-blok met "raak ik de rand?".',
            uitleg: 'De plek telt. Ligt de als-dan buiten de herhaling, dan kijkt hij maar een keer naar de rand.',
            leerdoel: DOEL.gebruiken
          },
          {
            groep: 'zelf',
            vraag: 'Vertel je eigen script na in vier korte zinnen. Begin bij het startblok.',
            antwoord: 'Bijvoorbeeld: het start bij de groene vlag. Dan begint de herhaling. De kat loopt tien stappen. Bij de rand keert hij om.',
            uitleg: 'Wie navertelt op volgorde vindt zelf de gaten. Blijf je hangen? Daar zit meestal je fout.',
            leerdoel: DOEL.navertellen
          },
          {
            groep: 'zelf',
            vraag: 'Wat is het verschil tussen een sprite en een script? Zeg het in twee korte zinnen.',
            antwoord: 'Een sprite is het figuur op het speelveld. Een script is de stapel blokken die hij uitvoert.',
            uitleg: 'De sprite doet het werk. Het script zegt wat hij moet doen. Samen zijn ze jouw programma.',
            leerdoel: DOEL.bouwen
          },
          {
            groep: 'steun',
            vraag: 'Vul aan: het figuur heet een ... . De stapel blokken heet een ... .',
            antwoord: 'Het figuur heet een sprite. De stapel blokken heet een script.',
            uitleg: 'Deze twee woorden heb je de hele paragraaf nodig. Sprite is wie, script is wat.',
            leerdoel: DOEL.bouwen
          },
          {
            groep: 'plus',
            vraag: 'Waarom kun je in blokken geen onmogelijke combinatie bouwen? In getypte code kan dat wel.',
            antwoord: 'Omdat de vorm bepaalt waar een blok past. Een blok dat er niet hoort klikt niet vast.',
            uitleg: 'De taal sluit de fout vooraf uit. Bij getypte code merk je zo een fout pas als je het programma start.',
            leerdoel: DOEL.bouwen
          }
        ]
      }),

    p('8.3', 'Testen en verbeteren: fouten uit je programma halen', ['22B'], 'testverslag met drie gevonden fouten en de verbeteringen', 100, 'Bugjacht',
      ['Wat is een bug?',
        'Een bug is een fout in een programma. Het programma doet dan iets anders dan jij wilde. Bug betekent letterlijk insect. In 1947 zat er een mot in een computer. Toen werd het woord echt bekend. Elke programmeur maakt elke dag fouten. Het werk zit in het vinden van die fouten.'],
      ['Zo zoek je de fout',
        'Fouten zoeken en herstellen heet debuggen. Verander steeds maar een ding tegelijk. Test daarna meteen opnieuw. Zo weet je wat die verandering deed. Leg je programma hardop uit aan een klasgenoot. Vaak zie je de fout dan zelf al. Schrijf vooraf op wat er zou moeten gebeuren.'],
      [
        media('https://www.youtube.com/embed/GlqkuktSmyE', 'Een Scratch-spel stap voor stap gebouwd', 'De maker klikt steeds tussendoor op de groene vlag. Noem een moment waarop hij zo test.'),
        media('https://scratch.mit.edu/', 'De Scratch-editor: hier test je zelf', 'Open je eigen project. Klik op de groene vlag. Schrijf op wat er gebeurt en wat je verwachtte.')
      ],
      [
        {
          vraag: 'Een app op je telefoon doet iets raars. Hoe zoek jij uit waar het misgaat?',
          antwoord: 'Bijvoorbeeld: nog een keer proberen. Stap voor stap terug. Kijken wanneer het nog wel goed ging.',
          uitleg: 'Dat terugstappen is testen. Je zoekt het laatste moment dat klopte. Daarna zit de fout.',
          leerdoel: DOEL.testen
        },
        {
          vraag: 'Het woord bug ken je misschien uit games. Wat betekent het volgens jou?',
          antwoord: 'Een fout in een programma. Het programma doet dan iets anders dan de bedoeling was.',
          uitleg: 'Bug betekent letterlijk insect. In 1947 zat er echt een mot in een computer.',
          leerdoel: DOEL.bug
        },
        {
          vraag: 'Iemand zegt dat jouw werk iets mist. Jij zag dat zelf niet. Wat doe je dan?',
          antwoord: 'Je vraagt precies wat hij zag. Je kijkt zelf na of het klopt. Daarna beslis je zelf.',
          uitleg: 'Een ander weet niet wat jij bedoelde. Juist daarom valt hem op wat jij overslaat.',
          leerdoel: DOEL.feedback
        }
      ],
      {
        tekst: '<strong>Maak een testverslag bij je programma uit 8.2.</strong> Werk in Word. Zet elk deel onder een eigen kopje.</p>\n' +
          '<p><strong>Deel 1. Schrijf je testplan. (3 minuten)</strong> Noem drie dingen die zouden moeten werken. Bijvoorbeeld: de sprite start bij de groene vlag. Hij blijft bewegen. Hij keert om bij de rand.</p>\n' +
          '<p><strong>Deel 2. Bouw zelf een fout in. (2 minuten)</strong> Verander iets in je als-dan-blok. Klik op de groene vlag. Schrijf op wat er nu misgaat.</p>\n' +
          '<p><strong>Deel 3. Laat een klasgenoot testen. (4 minuten)</strong> Ruil van plek. Laat hem jouw programma proberen. Schrijf letterlijk op wat hij zei.</p>\n' +
          '<p><strong>Deel 4. Los de fouten op. (5 minuten)</strong> Los ze een voor een op. Schrijf per fout drie dingen op. Wat ging er mis? Wat heb je veranderd? Hoe wist je dat het nu klopt?</p>\n' +
          '<p><strong>Deel 5. Reageer op de feedback. (2 minuten)</strong> Schrijf twee regels. Welke tip nam je over? Welke tip niet? Zeg er kort bij waarom. Lever je testverslag daarna in.',
        label: 'Lever je testverslag in. Schrijf hier welke fout je klasgenoot vond die jij zelf gemist had.',
        modelAnswer: 'Een voldoende testverslag heeft drie rijen. Bijvoorbeeld: "Verwacht: de kat keert om bij de rand. Gebeurde: de kat trilde tegen de rand. Veranderd: na het omkeren drie stappen laten lopen. Gecontroleerd: tien keer laten stuiteren, het trillen was weg." Daaronder staat een echte reactie op de feedback: "Sami zag dat mijn kat op zijn kop hing. Die tip heb ik overgenomen. Zijn tip om alles opnieuw te bouwen nam ik niet over, want de fout zat maar in een blok."',
        nakijkpunten: [
          'Je testplan staat er vooraf, met per punt wat er zou moeten gebeuren.',
          'Per fout staat wat er misging, wat je veranderde en hoe je het controleerde.',
          'Je zegt welke tip je overnam en welke niet, met een reden erbij.'
        ]
      },
      ['Wat is een bug?', 'Wat betekent debuggen?', 'Waarom verander je een ding tegelijk?', 'Waarom test je tussendoor?', 'Hoe helpt hardop uitleggen?', 'Wat staat er in een testplan?'],
      'Vind in vijf kapotte programma’s de bug. Kies de juiste verbetering en test opnieuw.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Een sprite beweegt helemaal niet. Welke drie dingen controleer je? En in welke volgorde?',
            antwoord: 'Eerst het startblok. Dan de volgorde van de blokken. Dan of het beweegblok in de herhaling ligt.',
            uitleg: 'Je werkt van buiten naar binnen. Eerst of het start. Dan of de stappen kloppen. Dan pas de plek.',
            leerdoel: DOEL.testen
          },
          {
            groep: 'samen',
            vraag: 'Leg elkaar om de beurt je script hardop uit. Wat merken jullie tijdens het uitleggen?',
            antwoord: 'Je merkt vaak zelf waar een blok mist. Halverwege je uitleg zie je het gat.',
            uitleg: 'In je hoofd sla je bekende stappen over. Hardop uitleggen dwingt je ze te noemen.',
            leerdoel: DOEL.feedback
          },
          {
            groep: 'zelf',
            vraag: 'Leg in twee zinnen uit wat een bug is. Zeg er ook bij waarom een foutmelding helpt.',
            antwoord: 'Een bug is een fout waardoor je programma iets anders doet. Een foutmelding zegt vaak waar het misging.',
            uitleg: 'Zonder melding moet je zelf zoeken. Met melding heb je de plek al. Dat scheelt het halve werk.',
            leerdoel: DOEL.bug
          },
          {
            groep: 'zelf',
            vraag: 'Je verandert drie dingen tegelijk. Het werkt weer. Waarom is dat toch niet slim?',
            antwoord: 'Je weet nu niet welke verandering hielp. De andere twee kunnen nieuwe fouten geven.',
            uitleg: 'Debuggen is een ding tegelijk veranderen en daarna testen. Zo koppel je elke stap aan een uitkomst.',
            leerdoel: DOEL.testen
          },
          {
            groep: 'zelf',
            vraag: 'Je klasgenoot geeft je drie tips. Wat doe je met een tip die jij niet goed vindt?',
            antwoord: 'Je legt kort uit waarom je hem niet overneemt. Je schrijft dat op in je verslag.',
            uitleg: 'Feedback is geen bevel. Jij blijft de maker. Maar je moet je keuze wel kunnen uitleggen.',
            leerdoel: DOEL.feedback
          },
          {
            groep: 'steun',
            vraag: 'Vul aan: fouten zoeken en herstellen heet ... . Je verandert steeds ... ding tegelijk.',
            antwoord: 'Het heet debuggen. Je verandert steeds een ding tegelijk.',
            uitleg: 'Deze twee horen bij elkaar. Debuggen is het werk. Een ding tegelijk is de manier.',
            leerdoel: DOEL.bug
          },
          {
            groep: 'plus',
            vraag: 'Je programma start wel, maar doet niet wat jij wilde. Is dat een bug? Leg uit.',
            antwoord: 'Ja, dat is ook een bug. Een programma dat draait kan best fout werken.',
            uitleg: 'Veel leerlingen denken dat een bug altijd een crash is. Een verkeerd getal is ook een bug.',
            leerdoel: DOEL.bug
          }
        ]
      }),

    p('8.4', 'Zelf ontwerpen in Canva', ['22A'], 'zelfgemaakte A4-poster in Canva, ingeleverd als PNG of PDF', 100, 'Canva Ontwerpduel',
      ['Wat is Canva?',
        'Canva is een online ontwerptool. Je maakt er posters, flyers en presentaties mee. Je kiest een template en past die aan. Een template is een kant-en-klaar ontwerp. Canva Free is genoeg voor school. Je maakt je account op www.canva.nl. Gebruik daarbij je schoolmail, dus niet je privémail.'],
      ['Je poster maken en downloaden',
        'Na het inloggen zie je de homepagina. Bovenin staat een zoekbalk. Links staat een grote plusknop. In het midden staan je eerdere ontwerpen. Daarnaast vind je templates en uploads. Klik op de plus en typ poster. Canva slaat je werk automatisch op. Klaar? Klik rechtsboven op Delen en dan Downloaden.'],
      [
        media('https://www.youtube.com/embed/oVH6Qu9HEZ4', 'Starten met Canva: account maken en downloaden', 'Welke stap ging bij jou anders dan in de opdracht? Schrijf op hoe je het oploste.'),
        media('https://www.canva.nl/', 'Canva: hier maak je je account', 'Log in en kijk naar je homepagina. Noem de vier onderdelen die je ziet.')
      ],
      [
        {
          vraag: 'Deeltoets over 8.1, 8.2 en 8.3. Maak eerst de negen vragen hieronder. Kijk niet terug. Hoeveel had je goed?',
          antwoord: 'Reken een vraag pas goed als je antwoord alles bevat wat er in het opengeklapte antwoord staat. Zeven of meer goed? Ga gewoon door. Doe verderop het plusspoor bij Extra plus. Zes of minder goed? Doe verderop eerst het steunspoor bij Extra steun. De drie vragen na de deeltoets zijn de gewone startvragen van 8.4.',
          uitleg: 'Deze deeltoets geeft geen cijfer. Hij geeft een route. Bij elke vraag staat wat je terugleest als hij misging. Het programmeerdeel is nu af, en in deze paragraaf ga je ontwerpen.'
        },
        {
          vraag: 'Deeltoets 1. Wat is een algoritme? Zeg het in een zin.',
          antwoord: 'Een stappenplan. Het zegt precies wat er moet gebeuren en in welke volgorde.',
          uitleg: 'Ging deze mis? Lees theorieblok A van 8.1 terug. Let op het woord precies.',
          leerdoel: DOEL.algoritme
        },
        {
          vraag: 'Deeltoets 2. Waarom schrijf je een handeling in heel kleine stappen op?',
          antwoord: 'Omdat een computer niets zelf invult. Een stap die jij vergeet, gebeurt niet.',
          uitleg: 'Ging deze mis? Pak je eigen stappenplan uit 8.1 erbij. Kijk waar je tester vastliep.',
          leerdoel: DOEL.stappen
        },
        {
          vraag: 'Deeltoets 3. Wat is het verschil tussen een herhaling en een keuze?',
          antwoord: 'Een herhaling doet iets vaker. Een keuze kijkt naar een voorwaarde en gaat dan de ene of de andere kant op.',
          uitleg: 'Ging deze mis? Lees theorieblok B van 8.1 terug. Herhaling gaat over hoe vaak, keuze over of het gebeurt.',
          leerdoel: DOEL.herhaalKeuze
        },
        {
          vraag: 'Deeltoets 4. Wat is een sprite? En wat is een script?',
          antwoord: 'Een sprite is het figuur op het speelveld. Een script is de stapel blokken eronder.',
          uitleg: 'Ging deze mis? Lees theorieblok A van 8.2 terug. De sprite doet het, het script zegt wat.',
          leerdoel: DOEL.bouwen
        },
        {
          vraag: 'Deeltoets 5. Welk blok start je script? En wat schuif je in een als-dan-blok?',
          antwoord: 'Het gele blok van de groene vlag start je script. In het als-dan-blok schuif je een voorwaarde.',
          uitleg: 'Ging deze mis? Lees theorieblok B van 8.2 terug. Kijk daarna naar je eigen screenshot.',
          leerdoel: DOEL.gebruiken
        },
        {
          vraag: 'Deeltoets 6. Vertel in drie zinnen na wat jouw eigen Scratch-programma doet.',
          antwoord: 'Bijvoorbeeld: het start bij de groene vlag. De herhaling laat de kat doorlopen. Bij de rand roept hij Boing.',
          uitleg: 'Ging deze mis? Pak je uitleg uit de opdracht van 8.2 erbij. Volg de volgorde van je blokken.',
          leerdoel: DOEL.navertellen
        },
        {
          vraag: 'Deeltoets 7. Je programma start wel maar beweegt niet. Wat controleer je als eerste?',
          antwoord: 'Eerst het startblok. Daarna de volgorde. Daarna of het beweegblok in de herhaling ligt.',
          uitleg: 'Ging deze mis? Lees theorieblok A van 8.3 terug. Testen doe je van buiten naar binnen.',
          leerdoel: DOEL.testen
        },
        {
          vraag: 'Deeltoets 8. Wat is een bug? En wat betekent debuggen?',
          antwoord: 'Een bug is een fout waardoor je programma iets anders doet. Debuggen is die fout zoeken en herstellen.',
          uitleg: 'Ging deze mis? Lees theorieblok B van 8.3 terug. Ook een programma dat draait kan een bug hebben.',
          leerdoel: DOEL.bug
        },
        {
          vraag: 'Deeltoets 9. Je krijgt drie tips tegelijk. Waarom voer je die niet in een keer door?',
          antwoord: 'Dan weet je niet welke tip hielp. En de andere twee kunnen nieuwe fouten geven.',
          uitleg: 'Ging deze mis? Pak je testverslag uit 8.3 erbij. Een ding tegelijk, en daartussen testen.',
          leerdoel: DOEL.feedback
        },
        {
          vraag: 'Met welk mailadres meld jij je aan voor schoolwerk? En waarom niet met je privémail?',
          antwoord: 'Met je schoolmail. Dan hoort je werk bij school en kan je docent je bereiken.',
          uitleg: 'Je schoolmail ken je uit hoofdstuk 1. Alles met dat adres blijft aan school gekoppeld.',
          leerdoel: DOEL.account
        },
        {
          vraag: 'Denk aan een poster in de gang. Wat zag je erop? En waarom kon je de titel goed lezen?',
          antwoord: 'Meestal een grote titel, een plaatje en korte tekst. De letterkleur verschilde genoeg van de achtergrond.',
          uitleg: 'Tekst, beeld en kleur zet je straks zelf op je poster. Te weinig verschil maakt een titel onleesbaar.',
          leerdoel: DOEL.starten
        },
        {
          vraag: 'Je hebt iets online gemaakt. Hoe krijg je dat bij je docent? Noem twee manieren.',
          antwoord: 'Bijvoorbeeld: downloaden en uploaden in de leeromgeving. Of een link delen.',
          uitleg: 'In hoofdstuk 1 leverde je een screenshot in. Dat is dezelfde route. Een link mag ook.',
          leerdoel: DOEL.delen
        }
      ],
      {
        tekst: '<strong>Opdracht 1: je eerste A4-poster.</strong> Werk de vijf delen op volgorde af.</p>\n' +
          '<p><strong>Deel 1. Maak je account. (5 minuten)</strong> Doe deze zeven stappen. 1 Ga naar www.canva.nl. 2 Klik rechtsboven op Registreren. 3 Kies aanmelden met e-mail en gebruik je schoolmail, dus niet je privémail. 4 Vul je voornaam, achternaam en wachtwoord in en klik op Doorgaan. 5 Kijk in je mail en klik op de link, of vul de code in. 6 Ga terug naar Canva, kies Inloggen en vul je gegevens in. 7 Je komt op de homepagina. Lukt het niet? Kijk de video in deze paragraaf.</p>\n' +
          '<p><strong>Deel 2. Start je poster. (3 minuten)</strong> 1 Klik op de grote plus links. 2 Typ bovenin poster en klik op "poster staand, A3". Je leest A3 en niet A4. Dat klopt: het is dezelfde staande poster, maar twee keer zo groot. 3 Nu opent een lege poster. Links zie je Ontwerpen, tekst, elementen en uploads.</p>\n' +
          '<p><strong>Deel 3. Vul je poster. (6 minuten)</strong> 4 Ga naar tekst en kies een stijl. Zet die in het midden. Bedenk zelf de titel, maximaal vijf woorden. 5 Ga naar elementen en kies iets dat bij je titel past. Hoeveel je toevoegt mag je zelf weten. 6 Klik op een wit stuk. Bovenin komt het kleurwieltje. Kies een achtergrondkleur waarbij je tekst goed leesbaar blijft, of pas je tekstkleur aan. 7 Canva slaat automatisch op. 8 Experimenteer verder. Met de rechtermuisknop en het prullenbakje gooi je iets weg. Met de rechtermuisknop en dan "laag" zet je iets naar voren of naar achteren.</p>\n' +
          '<p><strong>Deel 4. Lever je poster in. (3 minuten)</strong> 9 Klik rechtsboven op Delen en daarna op Downloaden. Kies PNG of PDF. Lukt downloaden niet door betaalde elementen? Dan heb je drie uitwegen. Vervang de betaalde elementen. Of maak een screenshot en snijd alleen je poster uit. Of deel een link in plaats van een bestand. Lever je poster in en vraag je docent hoe dat gaat.</p>\n' +
          '<p><strong>Deel 5. Opdracht 2: verder oefenen. (10 minuten)</strong> Goed gedaan, de basis zit erin. Klik linksboven op het woord Canva. Je bent weer op de homepagina. Klik weer op de plus. Kies nu zelf wat je maakt. Alles mag: templates, elementen en teksten. Een video, een website, een flyer of iets anders. Download ook dit project als PNG of PDF en lever het in. Dezelfde drie uitwegen gelden hier. Oefen thuis nog even met inloggen. Volgende les moet je zelf in Canva kunnen werken.',
        label: 'Lever je twee ontwerpen in. Schrijf hier op bij welke stap je het langst bezig was.',
        modelAnswer: 'Een voldoende inzending bestaat uit twee bestanden. Het eerste is de poster uit opdracht 1, bijvoorbeeld "poster-veiliginternet-Jayden-1C.png". Die poster staat staand. In het midden staat een titel van hooguit vijf woorden. Er staat minstens een element bij dat past. De achtergrondkleur verschilt genoeg van de letterkleur. Het tweede bestand is een zelfgekozen ontwerp uit opdracht 2, bijvoorbeeld een flyer, ook als PNG of PDF. Lukte downloaden niet? Dan zit er een uitgesneden screenshot of een link bij, met de reden erbij.',
        nakijkpunten: [
          'Je account is met je schoolmail gemaakt en je logt zelf in.',
          'De poster is staand en heeft een titel van maximaal vijf woorden.',
          'Er staat minstens een element op dat bij je titel past.',
          'Beide ontwerpen zijn ingeleverd als PNG, als PDF of via een van de drie uitwegen.'
        ]
      },
      ['Waarvoor gebruik je Canva?', 'Welke vier dingen staan op de homepagina?', 'Welk mailadres gebruik je?', 'Hoe zet je een element naar achteren?', 'Welke twee bestandsformaten kies je?', 'Wat doe je bij betaalde elementen?'],
      'Ontwerp tegen de klok. Kies de template, de tekst, het element en de kleur die het best passen.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Leg iemand uit wat Canva is. Noem daarbij de vier onderdelen van de homepagina.',
            antwoord: 'Canva is een online ontwerptool. Op de homepagina zie je de zoekbalk, de plusknop, je eerdere ontwerpen en de templates en uploads.',
            uitleg: 'Online betekent: je installeert niets. Die vier onderdelen zijn je vaste kaart op elke computer.',
            leerdoel: DOEL.account
          },
          {
            groep: 'samen',
            vraag: 'Een klasgenoot maakte zijn account met zijn eigen Gmail. Welke twee problemen krijgt hij?',
            antwoord: 'Zijn werk hangt niet aan zijn schoolaccount. En op een schoolcomputer komt hij er lastig bij.',
            uitleg: 'School ziet alleen wat aan het schoolaccount hangt. Stopt hij met dat privéadres, dan is zijn werk weg.',
            leerdoel: DOEL.account
          },
          {
            groep: 'zelf',
            vraag: 'Je titel valt weg in een donkere foto. Noem twee manieren om dat op te lossen.',
            antwoord: 'Maak de achtergrond lichter met het kleurwieltje. Of maak je tekstkleur wit.',
            uitleg: 'Leesbaar zijn komt van verschil. Je kunt aan twee kanten draaien: de ondergrond of de letter.',
            leerdoel: DOEL.starten
          },
          {
            groep: 'zelf',
            vraag: 'Een plaatje ligt over je titel heen. Welke stappen zet je om de titel weer bovenop te krijgen?',
            antwoord: 'Rechtermuisknop op het plaatje, dan "laag", dan naar achteren. Of de titel naar voren zetten.',
            uitleg: 'Lagen bepalen wie voor wie staat. Welke van de twee je verschuift maakt niet uit.',
            leerdoel: DOEL.starten
          },
          {
            groep: 'zelf',
            vraag: 'Waar klik je als je je poster wilt opslaan als bestand? Noem de twee knoppen.',
            antwoord: 'Rechtsboven op Delen. Daarna op Downloaden. Dan kies je PNG of PDF.',
            uitleg: 'Delen is de ingang voor alles wat je ontwerp verlaat. Downloaden en een link delen zitten daar allebei.',
            leerdoel: DOEL.delen
          },
          {
            groep: 'steun',
            vraag: 'Steunspoor. Had je zes of minder van de negen deeltoetsvragen goed? Begin hier. Schrijf per gemiste vraag op bij welke paragraaf hij hoort.',
            antwoord: 'Vraag 1, 2 en 3 horen bij 8.1. Vraag 4, 5 en 6 horen bij 8.2. Vraag 7, 8 en 9 horen bij 8.3.',
            uitleg: 'Terugbladeren op gevoel kost tijd. Lees precies het theorieblok dat in de uitleg staat. Programmeren komt terug in de eindtoets.',
            leerdoel: DOEL.testen
          },
          {
            groep: 'steun',
            vraag: 'Vul aan: je downloadt via de knop ... en daarna ... . Je kiest ... of PDF.',
            antwoord: 'Via Delen en daarna Downloaden. Je kiest PNG of PDF.',
            uitleg: 'Deze route is elke les hetzelfde. Onthoud hem, dan hoef je nooit te zoeken.',
            leerdoel: DOEL.delen
          },
          {
            groep: 'plus',
            vraag: 'Plusspoor. Had je zeven of meer van de negen goed? Leg dan uit waarom 8.1, 8.2 en 8.3 in deze volgorde staan.',
            antwoord: 'Eerst bedenk je de stappen. Dan bouw je ze in blokken. Daarna test je of het klopt.',
            uitleg: 'Zonder plan weet je niet wat je bouwt. Zonder programma weet je niet wat je test. Bij ontwerpen gaat het net zo.',
            leerdoel: DOEL.navertellen
          },
          {
            groep: 'plus',
            vraag: 'Je gebruikte vijf betaalde elementen en de les is bijna om. Welke uitweg kies je? Wat is het nadeel?',
            antwoord: 'Een link delen gaat het snelst. Het nadeel is dat je zelf geen bestand hebt.',
            uitleg: 'Vervangen kost tijd maar levert een bestand op. Een screenshot verliest kwaliteit. Een link hangt aan je account.',
            leerdoel: DOEL.delen
          }
        ]
      }),

    p('8.5', 'Eindopdracht: poster met Canva en AI', ['22A', '21D', '23C'], 'staande A4-poster over een eigen onderwerp, gemaakt met informatie van een chatbot in eigen woorden', 100, 'Posterlab',
      ['Informatie halen bij een chatbot',
        'In deze eindopdracht laat je twee dingen zien. Dat je een chatbot kunt gebruiken. En dat je een mooie poster maakt. Je gebruikt bijvoorbeeld TalkAI. Een goede prompt heeft vier onderdelen. De opdracht, het onderwerp, de doelgroep en de lengte. Neem het antwoord nooit letterlijk over.'],
      ['Wat is een goede poster?',
        'Een poster wordt maar een paar seconden bekeken. Een goede poster is leesbaar. De tekst valt niet weg in de achtergrond. Hij is niet te druk, dus niet te veel plaatjes. Hij is mooi om naar te kijken. Hij zegt meteen waar hij over gaat. En hij gebruikt geen beeld van iemand anders.'],
      [
        media('https://www.youtube.com/embed/qYys36TLtuA', 'Drie tips om je eigen poster te ontwerpen', 'Welke tip uit de video ga jij gebruiken? Schrijf hem in een zin op.'),
        media('https://talkai.info/', 'TalkAI: de chatbot uit de eindopdracht', 'Schrijf de prompt op waarmee jij begint. Zeg in een zin of het antwoord bruikbaar is.')
      ],
      [
        {
          vraag: 'Waarvoor ga jij een chatbot gebruiken bij je poster? Noem een ding dat je wilt weten.',
          antwoord: 'Bijvoorbeeld: vijf korte tips over mijn onderwerp. Of drie feiten die op de poster passen.',
          uitleg: 'Je vraagt om informatie, niet om een kant-en-klare poster. Jij blijft de maker.',
          leerdoel: DOEL.chatbot
        },
        {
          vraag: 'Waarom mag je een tekst van internet niet zomaar overnemen in je eigen werk?',
          antwoord: 'Omdat die tekst niet van jou is. En je kunt hem meestal niet uitleggen.',
          uitleg: 'Dit leerde je in paragraaf 1.4 over bronnen. Op een poster schrijf je het liever zelf.',
          leerdoel: DOEL.eigenWoorden
        },
        {
          vraag: 'Noem een poster of reclame die jou is bijgebleven. Waarom heb jij die echt gelezen?',
          antwoord: 'Bijvoorbeeld: een grote titel, weinig tekst, rustige kleuren en een opvallend plaatje.',
          uitleg: 'Wat jou opviel is precies wat een goede poster doet. Leesbaar, rustig en aantrekkelijk.',
          leerdoel: DOEL.ontwerp
        }
      ],
      {
        tekst: '<strong>Eindopdracht: jouw poster met Canva en AI.</strong> Werk de acht stappen op volgorde af. Vink ze af terwijl je bezig bent.</p>\n' +
          '<p><strong>Stap 1. Log in. (1 minuut)</strong> Open Canva. Log in met je gegevens van vorige les.</p>\n' +
          '<p><strong>Stap 2. Start je poster. (1 minuut)</strong> Klik op de plus. Typ poster. Kies een staande poster.</p>\n' +
          '<p><strong>Stap 3. Kies je onderwerp. (2 minuten)</strong> Kies er een uit deze negen. Cyberpesten. Online shoppen op Temu, Shein of AliExpress en de gevaren. Achteraf betalen: wat zijn de risico’s? De voordelen of nadelen van AI en chatbots. Veilig internetten. Privacy online. Digitaal gezond blijven. Nepnieuws herkennen. De invloed van social media op jongeren.</p>\n' +
          '<p><strong>Stap 4. Vraag het aan de chatbot. (5 minuten)</strong> Schrijf een prompt met vier onderdelen. Bewaar je prompt en het antwoord. Die lever je straks mee in.</p>\n' +
          '<p><strong>Stap 5. Schrijf het om. (5 minuten)</strong> Zet de informatie in je eigen woorden. Maak er korte zinnen van.</p>\n' +
          '<p><strong>Stap 6. Check de zes voorwaarden. (3 minuten)</strong> Je poster heeft een duidelijke titel. Er staat minstens een afbeelding of symbool op. Er staan minstens twee tekstvakken met uitleg of tips op, in korte zinnen. Hij gaat over een onderwerp uit de lijst. Hij bevat informatie van AI in jouw eigen woorden. En hij is staand. Voldoe je hier niet aan? Dan kun je geen punten krijgen.</p>\n' +
          '<p><strong>Stap 7. Loop de vijf tips na. (3 minuten)</strong> Grote letters voor de titel. Tekst kort en krachtig. Maximaal twee of drie kleuren die bij elkaar passen. Laat witruimte over. Kies iconen die bij je onderwerp passen.</p>\n' +
          '<p><strong>Stap 8. Lever in. (3 minuten)</strong> Download je poster als PNG of PDF. Lukt dat niet door betaalde elementen? Vervang ze, maak een uitgesneden screenshot of deel een link. Lever ook een half A4 in. Daarop staat je prompt, het antwoord van de chatbot en jouw eigen tekst.',
        label: 'Lever je staande poster en je half A4 in. Schrijf hier welke zin je het sterkst herschreven hebt.',
        modelAnswer: 'Een voldoende inzending is een staande poster. Bijvoorbeeld met de titel "Stop met scrollen, ga slapen". Er staat een icoon van een telefoon op. Er staan twee tekstvakken met elk drie korte tips over digitaal gezond blijven. Op het half A4 staat de prompt: "Geef vijf korte tips om digitaal gezond te blijven. Voor leerlingen van twaalf jaar. Elke tip maximaal vijftien woorden." Daaronder staat het antwoord van de chatbot. Daaronder staat de eigen versie, bijvoorbeeld "Leg je telefoon een uur voor het slapen weg" in plaats van "Het wordt aanbevolen mobiele apparaten voorafgaand aan de nachtrust te vermijden".',
        nakijkpunten: [
          'Je prompt heeft een opdracht, een onderwerp, een doelgroep en een lengte.',
          'Het antwoord van de chatbot zit erbij, en jouw eigen tekst staat ernaast.',
          'Je poster voldoet aan alle zes de voorwaarden uit stap 6.',
          'Je poster volgt minstens vier van de vijf tips uit stap 7.'
        ]
      },
      ['Waarvoor gebruik je de chatbot?', 'Wat zit er in een goede prompt?', 'Waarom schrijf je het antwoord om?', 'Wanneer is een poster leesbaar?', 'Waarom laat je witruimte over?', 'Hoeveel kleuren gebruik je hooguit?'],
      'Beoordeel posters van anderen op leesbaarheid en drukte. Repareer daarna de zwakste in drie zetten.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Hier zijn de vijf tips uit de les. 1 Grote letters voor de titel. 2 Tekst kort en krachtig. 3 Hooguit twee of drie kleuren. 4 Laat witruimte over. 5 Kies passende iconen. Kies er samen twee die jullie zeker gebruiken.',
            antwoord: 'Elke keuze mag. Zeg er wel per tip bij wat er dan verandert aan jullie poster.',
            uitleg: 'Alle vijf de tips dienen hetzelfde doel: rust. Een poster wordt in seconden bekeken.',
            leerdoel: DOEL.ontwerp
          },
          {
            groep: 'samen',
            vraag: 'Vergelijk twee prompts. A: "cyberpesten". B: "Geef vier tips tegen cyberpesten voor brugklassers, elk hooguit twintig woorden." Welke werkt beter?',
            antwoord: 'B werkt beter. Die noemt de opdracht, het onderwerp, de doelgroep en de lengte.',
            uitleg: 'Bij A moet de chatbot alles gokken. Bij B krijg je meteen tekst die op je poster past.',
            leerdoel: DOEL.chatbot
          },
          {
            groep: 'samen',
            vraag: 'Een goede poster zet je aan tot actie. Vier voorbeelden: een ticket kopen, naar een website gaan, een enquête invullen of iets kopen. Welke actie past bij jullie onderwerp?',
            antwoord: 'Elke keuze mag. Schrijf de actie op als een korte zin op je poster, bijvoorbeeld: kijk op deze website.',
            uitleg: 'Zonder actie weet je lezer niet wat hij moet doen. Zeg dus altijd wat je van hem wilt.',
            leerdoel: DOEL.ontwerp
          },
          {
            groep: 'zelf',
            vraag: 'Herschrijf deze zin voor een poster: "Het is raadzaam terughoudend te zijn met persoonsgegevens."',
            antwoord: 'Bijvoorbeeld: "Deel je adres en telefoonnummer nooit online."',
            uitleg: 'Kort, gewone woorden en een voorbeeld erbij. Zo kun je hem ook uitleggen aan je docent.',
            leerdoel: DOEL.eigenWoorden
          },
          {
            groep: 'zelf',
            vraag: 'Een poster heeft zeven plaatjes, vijf kleuren en een titel van twaalf woorden. Noem drie dingen die je verandert.',
            antwoord: 'Terug naar een of twee plaatjes. Terug naar hooguit drie kleuren. De titel korter maken.',
            uitleg: 'Alles wat afleidt kost je lezers. Rust is precies wat een poster leesbaar maakt.',
            leerdoel: DOEL.ontwerp
          },
          {
            groep: 'zelf',
            vraag: 'Schrijf een prompt over jouw eigen onderwerp. Zorg dat alle vier de onderdelen erin staan.',
            antwoord: 'Bijvoorbeeld: "Geef drie tips om nepnieuws te herkennen. Voor leerlingen van twaalf jaar. Elke tip hooguit vijftien woorden."',
            uitleg: 'Zoek de vier onderdelen zelf terug in je zin. Mist er een? Dan wordt het antwoord vaag.',
            leerdoel: DOEL.chatbot
          },
          {
            groep: 'steun',
            vraag: 'Vul aan: een goede poster is leesbaar, niet te ... , en laat genoeg ... over.',
            antwoord: 'Een goede poster is leesbaar, niet te druk, en laat genoeg witruimte over.',
            uitleg: 'Deze drie woorden dekken de hele paragraaf. Leesbaar, rustig en met ruimte ertussen.',
            leerdoel: DOEL.ontwerp
          },
          {
            groep: 'plus',
            vraag: 'AI-informatie mag op je poster. Plaatjes van iemand anders niet. Waarom is dat geen tegenspraak?',
            antwoord: 'Je schrijft de AI-informatie zelf om. En de plaatjes komen uit Canva, dus die mag je gebruiken.',
            uitleg: 'Het gaat om wie het gemaakt heeft en of je het mag gebruiken. Herschreven tekst is van jou.',
            leerdoel: DOEL.eigenWoorden
          }
        ]
      }),

    checkpoint('8.6', 'Checkpoint: terugblik en jouw digitale creatie', ['22A', '23C', '21D'], 'eigen eindcreatie in Canva, Word of PowerPoint, met je terugblik erbij', 150, 'Terugblik Challenge',
      ['Terugblikken op je jaar',
        'Je bent klaar met de lessen digitale geletterdheid. Goed gedaan! Deze afsluiting is groot. Je docent verdeelt hem over ongeveer drie lesuren. Eerst kijk je terug. Beantwoord vier vragen in de opdracht verderop. Wat is je het meest bijgebleven? Wat wist je nog niet? Waarover wil je meer weten? Heb je genoeg tips gekregen?'],
      ['Jouw digitale creatie',
        'Daarna maak je je eindcreatie. Je krijgt daar vijfentwintig minuten voor. Je kiest optie A, B of C. Optie A is een Canva-poster. Optie B is een Word-verslag van een A4. Optie C is een PowerPoint van drie dia’s. Dit lesmateriaal is van DaCapo College. Het staat onder de licentie CC BY 4.0. Dat betekent: je mag het gebruiken als je de maker noemt.'],
      media('https://www.youtube.com/embed/pdVvcAav_Jk', 'Wat is digitale geletterdheid?', 'De video noemt een paar onderdelen. Zoek bij elk onderdeel een hoofdstuk uit dit jaar.'),
      [
        {
          vraag: 'Zelftest over het hele hoofdstuk. Maak eerst de vijftien Diagnose-vragen hieronder. Kijk niet terug. Hoeveel had je goed?',
          antwoord: 'Reken een vraag pas goed als je antwoord alles bevat wat er in het opengeklapte antwoord staat. Twaalf of minder goed? Ga naar het herstelspoor bij Extra steun. Dertien of meer goed? Kies het verdiepingsspoor bij Extra plus. De twee vragen na Diagnose 15 zijn de gewone startvragen van deze paragraaf.',
          uitleg: 'Deze ronde staat voor de herhaling en niet erna. Zo weet je wat je moet herhalen. Hij geeft geen cijfer. Bij elke vraag staat wat je terugpakt als hij misging.'
        },
        {
          vraag: 'Diagnose 1. Wat is een algoritme? En waarom telt de volgorde net zo zwaar?',
          antwoord: 'Een algoritme is een stappenplan. Dezelfde stappen in een andere volgorde geven een ander resultaat.',
          uitleg: 'Gemist? Lees theorieblok A van 8.1 terug en speel het spel Stappen Sorteren.',
          leerdoel: DOEL.algoritme
        },
        {
          vraag: 'Diagnose 2. Noem twee stappen die mensen bijna altijd vergeten op te schrijven.',
          antwoord: 'Bijvoorbeeld: eerst je spullen pakken. En achteraf controleren of het gelukt is.',
          uitleg: 'Gemist? Pak je eigen stappenplan uit 8.1 erbij. Kijk waar je tester vastliep.',
          leerdoel: DOEL.stappen
        },
        {
          vraag: 'Diagnose 3. Schrijf een herhaling en een keuze op in gewone taal.',
          antwoord: 'Bijvoorbeeld: herhaal tien keer, doe een stap. En: als het regent, dan pak je een jas.',
          uitleg: 'Gemist? Lees theorieblok B van 8.1 terug. Let op wat de voorwaarde is.',
          leerdoel: DOEL.herhaalKeuze
        },
        {
          vraag: 'Diagnose 4. Wat is het voordeel van blokken boven getypte code?',
          antwoord: 'Je kunt geen tikfout maken. En de vorm laat zien welk blok waar past.',
          uitleg: 'Gemist? Lees theorieblok A van 8.2 terug. Kijk daarna naar je eigen screenshot.',
          leerdoel: DOEL.bouwen
        },
        {
          vraag: 'Diagnose 5. Waar leg je het als-dan-blok als je elke ronde de rand wilt controleren?',
          antwoord: 'Binnen de herhaling. Ligt hij erbuiten, dan kijkt hij maar een keer.',
          uitleg: 'Gemist? Lees theorieblok B van 8.2 terug. De plek van een blok bepaalt hoe vaak het werkt.',
          leerdoel: DOEL.gebruiken
        },
        {
          vraag: 'Diagnose 6. Vertel in drie zinnen na wat jouw eigen programma doet.',
          antwoord: 'Bijvoorbeeld: het start bij de groene vlag. De herhaling laat de kat lopen. Bij de rand roept hij Boing.',
          uitleg: 'Gemist? Pak je uitlegtekst uit 8.2 erbij. Volg de volgorde van je blokken.',
          leerdoel: DOEL.navertellen
        },
        {
          vraag: 'Diagnose 7. Je sprite beweegt niet. Wat controleer je, en in welke volgorde?',
          antwoord: 'Eerst het startblok. Dan de volgorde. Dan of het beweegblok in de herhaling ligt.',
          uitleg: 'Gemist? Lees theorieblok A van 8.3 terug. Testen doe je van buiten naar binnen.',
          leerdoel: DOEL.testen
        },
        {
          vraag: 'Diagnose 8. Wat is een bug? Geef ook een voorbeeld.',
          antwoord: 'Een fout waardoor je programma iets anders doet. Bijvoorbeeld: de kat loopt door de rand heen.',
          uitleg: 'Gemist? Lees theorieblok A van 8.3 terug. Ook een programma dat draait kan een bug hebben.',
          leerdoel: DOEL.bug
        },
        {
          vraag: 'Diagnose 9. Je klasgenoot geeft je een tip die jij niet goed vindt. Wat doe je?',
          antwoord: 'Je legt kort uit waarom je hem niet overneemt. Je schrijft dat op in je verslag.',
          uitleg: 'Gemist? Lees theorieblok B van 8.3 terug. Jij blijft de maker, maar je legt je keuze uit.',
          leerdoel: DOEL.feedback
        },
        {
          vraag: 'Diagnose 10. Met welk mailadres maak je je Canva-account? En waarom?',
          antwoord: 'Met je schoolmail. Dan hoort je werk bij school en kom je er overal bij.',
          uitleg: 'Gemist? Lees theorieblok A van 8.4 terug. Kijk ook terug naar hoofdstuk 1.',
          leerdoel: DOEL.account
        },
        {
          vraag: 'Diagnose 11. Je titel valt weg in de achtergrond. Wat doe je eraan?',
          antwoord: 'Je maakt de achtergrondkleur lichter. Of je maakt je tekstkleur anders.',
          uitleg: 'Gemist? Lees theorieblok B van 8.4 terug. Denk aan het kleurwieltje bovenin.',
          leerdoel: DOEL.starten
        },
        {
          vraag: 'Diagnose 12. Downloaden lukt niet door betaalde elementen. Noem de drie uitwegen.',
          antwoord: 'Vervang de betaalde elementen. Maak een uitgesneden screenshot. Of deel een link.',
          uitleg: 'Gemist? Pak het slot van theorieblok B van 8.4 erbij en deel 4 van de opdracht.',
          leerdoel: DOEL.delen
        },
        {
          vraag: 'Diagnose 13. Noem de vier onderdelen van een bruikbare prompt.',
          antwoord: 'De opdracht, het onderwerp, de doelgroep en de lengte.',
          uitleg: 'Gemist? Lees theorieblok A van 8.5 terug. Pak de prompt van je half A4 erbij.',
          leerdoel: DOEL.chatbot
        },
        {
          vraag: 'Diagnose 14. Waarom zet je een chatbotantwoord in je eigen woorden op je poster?',
          antwoord: 'Anders is de tekst niet van jou. En je kunt hem niet uitleggen of controleren.',
          uitleg: 'Gemist? Lees theorieblok A van 8.5 terug. Leg je eigen zin naast die van de chatbot.',
          leerdoel: DOEL.eigenWoorden
        },
        {
          vraag: 'Diagnose 15. Noem drie dingen die je aan een goede poster ziet.',
          antwoord: 'Bijvoorbeeld: je leest hem makkelijk, er staat niet te veel op, en hij zegt meteen waar hij over gaat.',
          uitleg: 'Gemist? Lees theorieblok B van 8.5 terug. Loop de vijf tips na op je eigen poster.',
          leerdoel: DOEL.ontwerp
        },
        {
          vraag: 'Noem twee dingen die jij nu anders doet op internet dan vorig jaar.',
          antwoord: 'Bijvoorbeeld: ik gebruik nu langere wachtwoorden. En ik kijk eerst naar de URL van een webshop.',
          uitleg: 'Gedrag is het beste bewijs van leren. Wat je weet maar nooit doet, is nog niet geland.',
          leerdoel: DOEL.terugblik
        },
        {
          vraag: 'Welke drie programma’s van dit jaar kun je voor je eindcreatie gebruiken?',
          antwoord: 'Canva voor een poster. Word voor een verslag. PowerPoint voor een presentatie.',
          uitleg: 'Elk programma is ergens sterk in. Een poster brengt een boodschap, een verslag legt uit.',
          leerdoel: DOEL.creatie
        }
      ],
      {
        tekst: '<strong>Maak je eindcreatie en lever hem in met je terugblik.</strong> De opdracht heeft vier delen.</p>\n' +
          '<p><strong>Deel 1. Je terugblik. (10 minuten)</strong> Beantwoord deze vier vragen in een Word-bestand. 1 Wat is je het meest bijgebleven van de lessen? 2 Wat heb je geleerd dat je nog niet wist en waar je nu blij mee bent? 3 Van welk onderwerp wil je meer weten, maar ging het te weinig over? 4 Heb je nu genoeg tips om jezelf veilig te houden op internet? Waarom wel of niet?</p>\n' +
          '<p><strong>Deel 2. Vergelijk met een klasgenoot. (5 minuten)</strong> Lees elkaars antwoorden. Schrijf in twee zinnen op welke verschillen je opvielen. Noem er ook een naam bij.</p>\n' +
          '<p><strong>Deel 3. Je eindcreatie. (25 minuten)</strong> Kies optie A, B of C. Ze tellen alle drie even zwaar.</p>\n' +
          '<p><strong>Optie A: Canva-poster.</strong> Maak een poster over een onderwerp dat jij interessant vond, bijvoorbeeld veilig internet, AI of nepnieuws. Gebruik minstens drie afbeeldingen. Voeg een tekstkader met uitleg toe. Bedenk een pakkende titel.</p>\n' +
          '<p><strong>Optie B: Word-verslag.</strong> Schrijf een kort verslag van een A4. Wat heb je geleerd? Wat vond je leuk? Waar wil je meer over leren? Voeg minstens een afbeelding toe. Gebruik koppen, vetgedrukte woorden en paginanummers.</p>\n' +
          '<p><strong>Optie C: PowerPoint.</strong> Maak een presentatie van drie dia’s over je favoriete onderwerp. Geef elke dia een titel. Voeg afbeeldingen toe. Zet bij elke dia een korte uitleg. Wil je presenteren? Dat mag.</p>\n' +
          '<p><strong>Deel 4. Inleveren. (5 minuten)</strong> Lever je terugblik en je creatie samen in. Doe dat zoals je docent het heeft uitgelegd. Zet er onderaan bij van wie het lesmateriaal is. Dat zijn Jennifer Leijen, Sander Theunissen, Gerdien Dohmen en Mirko Ensinck van DaCapo College. De licentie is CC BY 4.0. De laatste versie is van 28 oktober 2025.',
        label: 'Lever je terugblik en je eindcreatie in. Schrijf hier welke optie je koos en waarom.',
        modelAnswer: 'Een voldoende inzending heeft een terugblik met echte antwoorden op alle vier de vragen. Bijvoorbeeld: "Het meest is me bijgebleven dat een deepfake met gewone software gemaakt wordt. Daardoor geloof ik filmpjes niet meer zomaar. Mijn buurvrouw noemde phishing. Dat wist ik al. Maar zij wist niet dat een slotje geen bewijs is." Daarbij hoort een creatie die aan alle eisen van de gekozen optie voldoet. Bijvoorbeeld een PowerPoint van drie dia’s over nepnieuws. Elke dia heeft een titel, een passende afbeelding en drie regels uitleg. Onderaan de laatste dia staat DaCapo College met CC BY 4.0.',
        nakijkpunten: [
          'Alle vier de terugblikvragen zijn echt beantwoord, niet met een half woord.',
          'De vergelijking met een klasgenoot staat erbij, met een naam.',
          'Je gekozen optie voldoet aan alle eisen die erbij staan.',
          'Onderaan staat van wie het lesmateriaal is.'
        ]
      },
      ['Wat is een algoritme?', 'Waar gebruik je een herhaling voor?', 'Wat schuif je in een als-dan-blok?', 'Wat is een bug?', 'Wat betekent debuggen?', 'Met welk mailadres maak je je Canva-account?', 'Hoe download je een ontwerp?', 'Wanneer is een poster leesbaar?', 'Waarom schrijf je AI-tekst om?', 'Welke drie opties heb je voor je eindcreatie?', 'Waarom noem je de bron van het lesmateriaal?', 'Wat is een sprite?'],
      'Loop in vijf kamers je hele jaar langs: een algoritme, een bug, een ontwerp, een prompt en je terugblik.',
      true,
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Een klasgenoot schrijft bij zijn terugblik alleen "ik heb veel geleerd". Waarom telt dat niet?',
            antwoord: 'Hij noemt niets concreets. Het telt pas als hij zegt wat hij leerde en waar hij dat merkt.',
            uitleg: '"Ik controleer nu de afzender van een mail" is bewijs. "Ik heb veel geleerd" is dat niet.',
            leerdoel: DOEL.terugblik
          },
          {
            groep: 'samen',
            vraag: 'Lees samen de eisen van optie A, B en C. Welke optie past het best bij jullie eigen sterke punt?',
            antwoord: 'Elke keuze mag. Zeg er wel bij waarom die optie bij jullie past.',
            uitleg: 'Een poster brengt een boodschap. Een verslag legt uit. Een presentatie laat stappen zien.',
            leerdoel: DOEL.creatie
          },
          {
            groep: 'zelf',
            vraag: 'Jij kiest optie B, het Word-verslag. Welke drie opmaakeisen moet je verslag hebben?',
            antwoord: 'Koppen, vetgedrukte woorden en paginanummers. Die opmaak leerde je in hoofdstuk 4.',
            uitleg: 'Deze eisen zijn geen versiering. Koppen geven structuur en paginanummers houden de volgorde.',
            leerdoel: DOEL.creatie
          },
          {
            groep: 'zelf',
            vraag: 'Schrijf een antwoord op terugblikvraag 2 in twee zinnen. Noem iets dat je vorig jaar nog niet wist.',
            antwoord: 'Bijvoorbeeld: ik wist niet dat een slotje geen bewijs is. Nu kijk ik ook naar de URL.',
            uitleg: 'Noem het verschil tussen toen en nu. Dat maakt je terugblik bruikbaar voor je docent.',
            leerdoel: DOEL.terugblik
          },
          {
            groep: 'steun',
            vraag: 'Herstelspoor. Had je twaalf of minder van de vijftien diagnosevragen goed? Zet je gemiste vragen op een rij.',
            antwoord: 'Diagnose 1 tot en met 3 horen bij 8.1. Vraag 4 tot en met 6 bij 8.2. Vraag 7 tot en met 9 bij 8.3. Vraag 10 tot en met 12 bij 8.4. Vraag 13 tot en met 15 bij 8.5.',
            uitleg: 'Herhalen werkt alleen als het gericht is. Lees per gemiste vraag alleen dat ene theorieblok.',
            leerdoel: DOEL.terugblik
          },
          {
            groep: 'steun',
            vraag: 'Vul aan: je maakt een ... , je vergelijkt met een klasgenoot, en daarna volgt het ... .',
            antwoord: 'Je maakt een eindcreatie, je vergelijkt met een klasgenoot, en daarna volgt het inleveren.',
            uitleg: 'Dit zijn de delen van deze les op volgorde. Terugblikken, maken en inleveren.',
            leerdoel: DOEL.creatie
          },
          {
            groep: 'plus',
            vraag: 'Verdiepingsspoor. Had je dertien of meer goed? Wat hebben programmeren en ontwerpen met elkaar gemeen?',
            antwoord: 'Bij allebei bedenk je eerst, maak je daarna, en test je of het bij een ander overkomt.',
            uitleg: 'Een programma test je door het te draaien. Een poster test je door hem aan iemand te laten zien.',
            leerdoel: DOEL.creatie
          },
          {
            groep: 'plus',
            vraag: 'Waarom noem je onder je eindcreatie de bron van het lesmateriaal, ook als je alles zelf schreef?',
            antwoord: 'Omdat het materiaal onder CC BY 4.0 staat. Die licentie vraagt dat je de maker noemt.',
            uitleg: 'Bij CC BY mag je kopiëren en bewerken. Maar altijd met de naam erbij. Dat leerde je in 1.4.',
            leerdoel: DOEL.terugblik
          }
        ]
      })
  ]
};
